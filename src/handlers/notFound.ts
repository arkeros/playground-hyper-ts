import { middleware, Handler } from 'hyper-ts/lib/MiddlewareTask'
import { Status } from 'hyper-ts'

export const notFound = (message: string): Handler =>
  middleware
    .status(Status.NotFound)
    .ichain(() => middleware.closeHeaders)
    .ichain(() => middleware.send(message))
