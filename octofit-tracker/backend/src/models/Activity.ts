import { model, Schema } from 'mongoose'

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    distanceKilometers: { type: Number, min: 0 },
    recordedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
)

export const Activity = model('Activity', activitySchema)
