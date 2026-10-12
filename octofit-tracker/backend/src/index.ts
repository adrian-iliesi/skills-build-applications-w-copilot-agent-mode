import cors from 'cors'
import express from 'express'
import { apiBaseUrl } from './config/api.js'
import { connectDatabase } from './config/database.js'
import { Activity } from './models/Activity.js'
import { Leaderboard } from './models/Leaderboard.js'
import { Team } from './models/Team.js'
import { User } from './models/User.js'
import { Workout } from './models/Workout.js'
import { collectionErrorHandler, createCollectionRouter } from './routes/collectionRouter.js'

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api', baseUrl: apiBaseUrl })
})

app.use('/api/users', createCollectionRouter(User, '-passwordHash'))
app.use('/api/teams', createCollectionRouter(Team))
app.use('/api/activities', createCollectionRouter(Activity))
app.use('/api/leaderboard', createCollectionRouter(Leaderboard))
app.use('/api/workouts', createCollectionRouter(Workout))
app.use(collectionErrorHandler)

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
