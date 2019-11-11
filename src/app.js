import 'dotenv/config'

import express from 'express'
import * as Sentry from '@sentry/node'
import sentryConfig from './config/sentry'
import 'express-async-errors'
import routes from './routes.js'
import helmet from 'helmet'
import Youch from 'youch'
import './database'

Sentry.init(sentryConfig)

const app = express()
app.use(helmet())
app.use(express.json())

app.use(Sentry.Handlers.requestHandler())

app.use(routes)

app.use(Sentry.Handlers.errorHandler())

// Route not found
app.use((req, res) => {
  res.status(400).json({ error: 'Page Not Found' })
})

// Error handler
app.use(async (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const erros = await new Youch(err, req).toJSON()
    return res.status(500).json(erros)
  }

  return res.status(500).json({ message: 'Internal Server Error' })
})

export default app
