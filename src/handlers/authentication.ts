import * as t from 'io-ts'
import { Task, task } from 'fp-ts/lib/Task'
import { Option, some, none } from 'fp-ts/lib/Option'
import { StatusOpen, Conn } from 'hyper-ts'
import { tuple, pipe } from 'fp-ts/lib/function'
import { MiddlewareTask, unsafeResponseStateTransition } from 'hyper-ts/lib/MiddlewareTask'

const split = (splitter: string) => (str: string): string[] => str.split(splitter)

// the new connection state
export type Authenticated = 'Authenticated'

interface Authentication
  extends MiddlewareTask<StatusOpen, StatusOpen, Option<MiddlewareTask<StatusOpen, Authenticated, void>>> {}

const withAuthentication = (strategy: (c: Conn<StatusOpen>) => Task<Option<string>>): Authentication =>
  new MiddlewareTask(c => {
    return strategy(c).map(token => tuple(token.isSome() ? some(unsafeResponseStateTransition) : none, c))
  })

// dummy authentication process
export const bearerAuth = withAuthentication(c =>
  task.of(
    t.string.decode(c.getHeader('Authorization')).fold(
      () => none,
      pipe(
        split(' '),
        parts => {
          if (parts.length !== 2) return none
          const [scheme, credentials] = parts
          return /^Bearer$/i.test(scheme) ? some(credentials) : none
        },
      ),
    ),
  ),
)

// dummy ResponseStateTransition (like middleware.closeHeaders)
export const authenticated: MiddlewareTask<Authenticated, StatusOpen, void> = unsafeResponseStateTransition
