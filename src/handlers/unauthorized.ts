import { middleware, Handler } from 'hyper-ts/lib/MiddlewareTask'
import { Status } from 'hyper-ts'

export const unauthorized = (message: string): Handler =>
  middleware
    .status(Status.Unauthorized)
    .ichain(() => middleware.closeHeaders)
    .ichain(() => middleware.send(message))
