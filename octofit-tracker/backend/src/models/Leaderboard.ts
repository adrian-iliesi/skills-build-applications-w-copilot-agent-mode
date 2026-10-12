import { model, Schema } from 'mongoose'

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
)

export const Leaderboard = model('Leaderboard', leaderboardSchema)
