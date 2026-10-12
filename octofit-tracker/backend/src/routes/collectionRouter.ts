import { Router, type ErrorRequestHandler, type RequestHandler } from 'express'
import type { Model } from 'mongoose'

export function createCollectionRouter<T>(model: Model<T>, projection?: string): Router {
  const router = Router()
  const list: RequestHandler = async (_request, response, next) => {
    try {
      const query = model.find()
      if (projection) {
        query.select(projection)
      }
      response.json(await query.lean().exec())
    } catch (error) {
      next(error)
    }
  }

  router.get('/', list)
  return router
}

export const collectionErrorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  console.error('Failed to retrieve API collection:', error)
  response.status(500).json({ error: 'Failed to retrieve collection' })
}
