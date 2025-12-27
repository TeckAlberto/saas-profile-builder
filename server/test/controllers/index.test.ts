import { describe, it, expect, vi, beforeEach } from 'vitest'
import express, { Router } from 'express'
import request from 'supertest'

const mockAuthRouter = Router()
mockAuthRouter.get('/ping', (_req, res) => {
  res.status(200).json({ ok: 'auth' })
})

const mockLinksRouter = Router()
mockLinksRouter.get('/ping', (_req, res) => {
  res.status(200).json({ ok: 'links' })
})

describe('controller router', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should mount /auth and /links routers', async () => {
    vi.doMock('../../src/controllers/auth', () => ({
      default: mockAuthRouter
    }))

    vi.doMock('../../src/controllers/links', () => ({
      default: mockLinksRouter
    }))

    const { default: router } = (await import('../../src/controllers')) as { default: Router }

    const app = express()
    app.use('/api', router)

    const authResponse = await request(app).get('/api/auth/ping')
    const linksResponse = await request(app).get('/api/links/ping')

    expect(authResponse.status).toBe(200)
    expect(authResponse.body).toEqual({ ok: 'auth' })
    expect(linksResponse.status).toBe(200)
    expect(linksResponse.body).toEqual({ ok: 'links' })
  })
})
