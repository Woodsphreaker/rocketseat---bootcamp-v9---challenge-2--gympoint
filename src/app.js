import 'dotenv/config'

import express from 'express'
import routes from './routes.js'
import './database'

const app = express()
app.use(express.json())
app.use(routes)

// Route not found
app.use((req, res) => {
  res.status(400).json({ error: 'Page Not Found' })
})

export default app
