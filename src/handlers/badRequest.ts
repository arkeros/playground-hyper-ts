import { middleware, Handler } from 'hyper-ts/lib/MiddlewareTask'
import { Status } from 'hyper-ts'
import { pipe } from 'fp-ts/lib/function'

export const badRequest = pipe(
  (messages: string[]) => ({
    error: true,
    errors: messages,
  }),
  JSON.stringify,
  (json): Handler =>
    middleware
      .status(Status.OK)
      .ichain(() => middleware.closeHeaders)
      .ichain(() => middleware.send(json)),
)
