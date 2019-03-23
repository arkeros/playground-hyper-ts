import { MiddlewareTask, param, Handler, lift } from 'hyper-ts/lib/MiddlewareTask'
import { StatusOpen } from 'hyper-ts'
import { Option, some, none } from 'fp-ts/lib/Option'
import * as t from 'io-ts'
import { TaskEither, tryCatch } from 'fp-ts/lib/TaskEither'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { identity } from 'fp-ts/lib/function'
import { IntegerFromString } from 'io-ts-types/lib/number/IntegerFromString'

import { User } from '../domain'
import { sendJSON } from './sendJSON'
import { notFound } from './notFound'
import { unauthorized } from './unauthorized'
import { badRequest } from './badRequest'
import { Authenticated, bearerAuth, authenticated } from './authentication'

// type FetchUser = (id: number) => Option<User>
interface EntityRepository<Entity> {
  findOne: (id: number) => TaskEither<string, Option<Entity>>
}

const userRepo: EntityRepository<User> = {
  findOne: id =>
    tryCatch(async () => (id === 1 ? some({ id, name: 'Rafael Arquero' }) : none), () => 'some error with DB'),
}

// the result of this function requires a successful authentication upstream
type LoadUser = (id: number) => MiddlewareTask<Authenticated, StatusOpen, Option<User>>
const loadUser: LoadUser = id =>
  authenticated.ichain(
    () =>
      lift(
        userRepo.findOne(id).fold(
          () => none, // ignore error
          identity,
        ),
      ),
    //   equivalent
    //   new MiddlewareTask(c =>
    //     userRepo.findOne(id).fold(
    //       // ignore error
    //       () => tuple(none, c),
    //       user => tuple(user, c),
    //     ),
    //   ),
  )

const getUserId = param('user_id', IntegerFromString)

export const user: Handler = getUserId.ichain(oid =>
  oid.fold(
    () => badRequest(PathReporter.report(oid)),
    id =>
      bearerAuth.ichain(oAuthenticated =>
        oAuthenticated.foldL(
          () => unauthorized('Unauthorized user'),
          authenticated =>
            authenticated.ichain(() => loadUser(id).ichain(ou => ou.foldL(() => notFound('User not found'), sendJSON))),
        ),
      ),
  ),
)
