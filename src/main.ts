import express from 'express'
import { toExpressRequestHandler } from 'hyper-ts/lib/toExpressRequestHandler'

import * as handlers from './handlers'

interface Config {
  port: number
}

const main = ({ port }: Config) => {
  const app = express()

  app.get('/:user_id', toExpressRequestHandler(handlers.user))
  app.listen(port, () => console.log(`Express listening on port ${port}`))
}

if (require.main === module) {
  main({ port: parseFloat(process.env.PORT || '3000') })
}
