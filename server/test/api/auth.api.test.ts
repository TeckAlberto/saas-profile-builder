import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

import app from '../../src/app'

const mockDbSelect = vi.hoisted(() => vi.fn())
const mockDbInsert = vi.hoisted(() => vi.fn())
const mockBcryptCompare = vi.hoisted(() => vi.fn())
const mockBcryptHash = vi.hoisted(() => vi.fn())
const mockBcryptGenSalt = vi.hoisted(() => vi.fn())
const mockJwtSign = vi.hoisted(() => vi.fn())

vi.mock('../../src/db', () => ({
  db: {
    select: mockDbSelect,
    insert: mockDbInsert
  },
  pool: {
    end: vi.fn()
  }
}))

vi.mock('bcryptjs', () => ({
  default: {
    compare: mockBcryptCompare,
    hash: mockBcryptHash,
    genSalt: mockBcryptGenSalt
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: mockJwtSign
  }
}))

const mockDbFrom = vi.fn()
const mockDbWhere = vi.fn()
const mockDbLimit = vi.fn()
const mockDbValues = vi.fn()
const mockDbReturning = vi.fn()

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockDbSelect.mockReturnValue({ from: mockDbFrom })
    mockDbFrom.mockReturnValue({ where: mockDbWhere })
    mockDbWhere.mockReturnValue({ limit: mockDbLimit })
    mockDbInsert.mockReturnValue({ values: mockDbValues })
    mockDbValues.mockReturnValue({ returning: mockDbReturning })

    mockBcryptGenSalt.mockResolvedValue('mocked_salt')
    mockBcryptHash.mockResolvedValue('mocked_hashed_password')
    mockBcryptCompare.mockResolvedValue(true)
    mockJwtSign.mockReturnValue('mocked_jwt_token')
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const nuevoUsuario = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        plan: 'free'
      }

      mockDbLimit.mockResolvedValueOnce([])
      mockDbReturning.mockResolvedValueOnce([nuevoUsuario])

      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(nuevoUsuario)
      expect(response.body).not.toHaveProperty('password_hash')

      expect(mockBcryptGenSalt).toHaveBeenCalled()
      expect(mockBcryptHash).toHaveBeenCalledWith('password123', 'mocked_salt')
    })

    it('should return 400 for missing data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', username: 'testuser' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Email, username, and password are required'
      })
      expect(mockDbSelect).not.toHaveBeenCalled()
      expect(mockBcryptHash).not.toHaveBeenCalled()
    })

    it('should return 409 if user already exists', async () => {
      mockDbLimit.mockResolvedValueOnce([{ id: 1, email: 'test@example.com' }])

      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      })

      expect(response.status).toBe(409)
      expect(response.body).toEqual({ message: 'User already exists' })
      expect(mockBcryptHash).not.toHaveBeenCalled()
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        passwordHash: 'hashed_password'
      }

      mockDbLimit.mockResolvedValueOnce([existingUser])

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Login successful',
        token: 'mocked_jwt_token'
      })

      expect(mockDbSelect).toHaveBeenCalled()
      expect(mockBcryptCompare).toHaveBeenCalledWith('password123', 'hashed_password')
      expect(mockJwtSign).toHaveBeenCalled()
    })

    it('should return 401 for incorrect password', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashed_password'
      }

      mockDbLimit.mockResolvedValueOnce([existingUser])

      mockBcryptCompare.mockResolvedValue(false)

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrong_password'
      })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({ message: 'Invalid credentials' })
      expect(mockJwtSign).not.toHaveBeenCalled()
    })

    it('should return 404 if user not found', async () => {
      mockDbLimit.mockResolvedValueOnce([])

      const response = await request(app).post('/api/auth/login').send({
        email: 'nouser@example.com',
        password: 'password123'
      })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'User not found' })
      expect(mockBcryptCompare).not.toHaveBeenCalled()
      expect(mockJwtSign).not.toHaveBeenCalled()
    })
  })
})
