import { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profile: {
      displayName: { type: String, trim: true },
      avatarUrl: { type: String, trim: true },
    },
  },
  { timestamps: true },
)

export const User = model('User', userSchema)
