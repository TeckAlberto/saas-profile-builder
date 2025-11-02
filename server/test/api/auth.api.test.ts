import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import request from 'supertest'

import app from '../../src/app'
import db from '../../src/db'

vi.mock('../../src/db', () => ({
  default: {
    query: vi.fn()
  }
}))

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
    genSalt: vi.fn()
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn()
  }
}))

const mockCompare = bcrypt.compare as Mock
const mockHash = bcrypt.hash as Mock
const mockGenSalt = bcrypt.genSalt as Mock
const mockSign = jwt.sign as Mock

const mockDbQuery = vi.spyOn(db, 'query')

const mockQueryProps = {
  command: 'SELECT',
  oid: 0,
  fields: []
}

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockGenSalt.mockResolvedValue('mocked_salt')
    mockHash.mockResolvedValue('mocked_hashed_password')
    mockCompare.mockResolvedValue(true)
    mockSign.mockReturnValue('mocked_jwt_token')
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const nuevoUsuario = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        plan: 'free'
      }

      mockDbQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        ...mockQueryProps
      })
      mockDbQuery.mockResolvedValueOnce({
        rows: [nuevoUsuario],
        rowCount: 1,
        ...mockQueryProps,
        command: 'INSERT'
      })

      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(nuevoUsuario)
      expect(response.body).not.toHaveProperty('password_hash')

      expect(mockGenSalt).toHaveBeenCalled()
      expect(mockHash).toHaveBeenCalledWith('password123', 'mocked_salt')
    })

    it('should return 400 for missing data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', username: 'testuser' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        message: 'Email, username, and password are required'
      })
      expect(mockDbQuery).not.toHaveBeenCalled()
      expect(mockHash).not.toHaveBeenCalled()
    })

    it('should return 409 if user already exists', async () => {
      mockDbQuery.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'test@example.com' }],
        rowCount: 1,
        ...mockQueryProps
      })

      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      })

      expect(response.status).toBe(409)
      expect(response.body).toEqual({ message: 'User already exists' })
      expect(mockHash).not.toHaveBeenCalled()
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hashed_password'
      }

      mockDbQuery.mockResolvedValueOnce({
        rows: [existingUser],
        rowCount: 1,
        ...mockQueryProps
      })

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'Login successful',
        token: 'mocked_jwt_token'
      })

      expect(mockDbQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [
        'test@example.com'
      ])
      expect(mockCompare).toHaveBeenCalledWith('password123', 'hashed_password')
      expect(mockSign).toHaveBeenCalled()
    })

    it('should return 401 for incorrect password', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashed_password'
      }

      mockDbQuery.mockResolvedValueOnce({
        rows: [existingUser],
        rowCount: 1,
        ...mockQueryProps
      })

      mockCompare.mockResolvedValue(false)

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrong_password'
      })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({ message: 'Invalid credentials' })
      expect(mockSign).not.toHaveBeenCalled()
    })

    it('should return 404 if user not found', async () => {
      mockDbQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        ...mockQueryProps
      })

      const response = await request(app).post('/api/auth/login').send({
        email: 'nouser@example.com',
        password: 'password123'
      })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'User not found' })
      expect(mockCompare).not.toHaveBeenCalled()
      expect(mockSign).not.toHaveBeenCalled()
    })
  })
})
