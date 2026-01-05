import { describe, it, expect, vi, beforeEach } from 'vitest'
import express, { type Request, type Response, type NextFunction } from 'express'
import request from 'supertest'

const mockAuthMiddleware = vi.hoisted(() =>
  vi.fn((_req: Request, _res: Response, next: NextFunction) => next())
)
const mockCreate = vi.hoisted(() =>
  vi.fn((_req: Request, res: Response) => {
    return res.status(201).json({ ok: true })
  })
)
const mockGetByUserId = vi.hoisted(() =>
  vi.fn((_req: Request, res: Response) => {
    return res.status(200).json([{ id: 1 }])
  })
)
const mockSaveOrder = vi.hoisted(() =>
  vi.fn((_req: Request, res: Response) => {
    return res.status(200).json({ message: 'Links order saved successfully' })
  })
)

describe('controller router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should wire GET / with auth middleware', async () => {
    vi.doMock('../../../src/middleware/auth', () => ({
      authMiddleware: mockAuthMiddleware
    }))

    vi.doMock('../../../src/controllers/links/create', () => ({
      default: mockCreate
    }))

    vi.doMock('../../../src/controllers/links/getByUserId', () => ({
      default: mockGetByUserId
    }))

    vi.doMock('../../../src/controllers/links/saveOrder', () => ({
      default: mockSaveOrder
    }))

    const { default: router } = await import('../../../src/controllers/links')

    const app = express()
    app.use('/api/links', router)

    const response = await request(app).get('/api/links')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([{ id: 1 }])
    expect(mockAuthMiddleware).toHaveBeenCalled()
    expect(mockGetByUserId).toHaveBeenCalled()
  })

  it('should wire POST / with auth middleware', async () => {
    vi.doMock('../../../src/middleware/auth.middleware', () => ({
      authMiddleware: mockAuthMiddleware
    }))

    vi.doMock('../../../src/controllers/links/create', () => ({
      default: mockCreate
    }))

    vi.doMock('../../../src/controllers/links/getByUserId', () => ({
      default: mockGetByUserId
    }))

    vi.doMock('../../../src/controllers/links/saveOrder', () => ({
      default: mockSaveOrder
    }))

    const { default: router } = await import('../../../src/controllers/links')

    const app = express()
    app.use('/api/links', router)

    const response = await request(app).post('/api/links')

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ ok: true })
    expect(mockAuthMiddleware).toHaveBeenCalled()
    expect(mockCreate).toHaveBeenCalled()
  })

  it('should wire PATCH /order with auth middleware', async () => {
    vi.doMock('../../../src/middleware/auth.middleware', () => ({
      authMiddleware: mockAuthMiddleware
    }))

    vi.doMock('../../../src/controllers/links/create', () => ({
      default: mockCreate
    }))

    vi.doMock('../../../src/controllers/links/getByUserId', () => ({
      default: mockGetByUserId
    }))

    vi.doMock('../../../src/controllers/links/saveOrder', () => ({
      default: mockSaveOrder
    }))

    const { default: router } = await import('../../../src/controllers/links')

    const app = express()
    app.use('/api/links', router)

    const response = await request(app).patch('/api/links/order')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Links order saved successfully' })
    expect(mockAuthMiddleware).toHaveBeenCalled()
    expect(mockSaveOrder).toHaveBeenCalled()
  })
})
