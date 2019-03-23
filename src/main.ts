import * as express from 'express'
import { toExpressRequestHandler } from 'hyper-ts/lib/toExpressRequestHandler'

import * as handlers from './handlers'

interface Config {
  port: number
}

const main = ({ port }: Config) => {
  express()
    .get('/:user_id', toExpressRequestHandler(handlers.user))
    .listen(port, () => console.log(`Express listening on port ${port}`))
}

main({ port: parseFloat(process.env.PORT) || 3000 })
