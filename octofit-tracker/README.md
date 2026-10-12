# OctoFit Tracker

OctoFit Tracker is a multi-tier application with a React/Vite presentation tier,
an Express/TypeScript API tier, and MongoDB accessed through Mongoose.

## Services

| Tier | Directory | Port |
| --- | --- | --- |
| Presentation | `frontend` | 5173 |
| Logic/API | `backend` | 8000 |
| Data (MongoDB) | local MongoDB service | 27017 |

The backend connects to `MONGODB_URI` when set and otherwise uses
`mongodb://localhost:27017/octofit_db`. MongoDB must be running before starting
the API.

## Run locally

Install dependencies with `npm install --prefix octofit-tracker/frontend` and
`npm install --prefix octofit-tracker/backend`.

Populate MongoDB with repeatable sample users, teams, activities, leaderboard
entries, and workouts with `npm run seed --prefix octofit-tracker/backend`.

Start the API in development mode with
`npm run dev --prefix octofit-tracker/backend`. Its health endpoint is
`/api/health`; collection endpoints are `/api/users/`, `/api/teams/`,
`/api/activities/`, `/api/leaderboard/`, and `/api/workouts/`. The collection
endpoints return the documents currently stored in MongoDB.

The health response includes the API base URL. In Codespaces this is derived
from `CODESPACE_NAME` as `https://${CODESPACE_NAME}-8000.app.github.dev`; outside
Codespaces it defaults to `http://localhost:8000`.

Start the frontend with `npm run dev --prefix octofit-tracker/frontend -- --host
0.0.0.0 --port 5173`.
