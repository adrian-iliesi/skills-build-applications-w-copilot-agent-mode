import { model, Schema } from 'mongoose'

const workoutSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  },
  { timestamps: true },
)

export const Workout = model('Workout', workoutSchema)
