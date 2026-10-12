import cors from 'cors'
import express from 'express'
import { connectDatabase } from './config/database.js'

const app = express()
const port = Number(process.env.PORT ?? 8000)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api' })
})

async function startServer() {
  await connectDatabase()
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit Tracker API listening on port ${port}`)
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start OctoFit Tracker API:', error)
  process.exitCode = 1
})
