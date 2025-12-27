import { describe, it, expect, vi, beforeEach } from 'vitest'
import express, { Request, Response } from 'express'
import request from 'supertest'

const mockRegister = vi.hoisted(() =>
  vi.fn((_req: Request, res: Response) => {
    return res.status(201).json({ ok: true })
  })
)
const mockLogin = vi.hoisted(() =>
  vi.fn((_req: Request, res: Response) => {
    return res.status(200).json({ ok: true })
  })
)

describe('controller router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should wire POST /register', async () => {
    vi.doMock('../../../src/controllers/auth/register', () => ({
      default: mockRegister
    }))

    vi.doMock('../../../src/controllers/auth/login', () => ({
      default: mockLogin
    }))

    const { default: router } = await import('../../../src/controllers/auth')

    const app = express()
    app.use('/api/auth', router)

    const response = await request(app).post('/api/auth/register')

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ ok: true })
    expect(mockRegister).toHaveBeenCalled()
  })

  it('should wire POST /login', async () => {
    vi.doMock('../../../src/controllers/auth/register', () => ({
      default: mockRegister
    }))

    vi.doMock('../../../src/controllers/auth/login', () => ({
      default: mockLogin
    }))

    const { default: router } = await import('../../../src/controllers/auth')

    const app = express()
    app.use('/api/auth', router)

    const response = await request(app).post('/api/auth/login')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
    expect(mockLogin).toHaveBeenCalled()
  })
})
