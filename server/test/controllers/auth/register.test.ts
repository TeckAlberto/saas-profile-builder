import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import db from '../../../src/db'
import register from '../../../src/controllers/auth/register'

vi.mock('../../../src/db', () => ({
  default: {
    query: vi.fn()
  }
}))

vi.mock('bcryptjs', () => ({
  default: {
    genSalt: vi.fn(() => Promise.resolve('mocked_salt')),
    hash: vi.fn(() => Promise.resolve('mocked_hashed_password'))
  }
}))

const mockDbQuery = vi.spyOn(db, 'query')
const mockBcryptHash = vi.spyOn(bcrypt, 'hash')

let mockRequest: Partial<Request>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockSend: Mock<(body: any) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockResponse = {} as Partial<Response>

  mockSend = vi.fn((_body: any) => {
    return mockResponse as Response
  })
  mockStatus = vi.fn((_statusCode: number) => {
    return mockResponse as Response
  })

  mockResponse.status = mockStatus
  mockResponse.send = mockSend

  mockRequest = {
    body: {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    }
  }
})

describe('controller', () => {
  describe('register', () => {
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
        command: 'SELECT',
        oid: 0,
        fields: []
      })
      mockDbQuery.mockResolvedValueOnce({
        rows: [nuevoUsuario],
        rowCount: 1,
        command: 'INSERT',
        oid: 0,
        fields: []
      })

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockDbQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        ['test@example.com', 'testuser']
      )

      expect(mockBcryptHash).toHaveBeenCalledWith('password123', 'mocked_salt')

      expect(mockDbQuery).toHaveBeenCalledWith(
        'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, plan',
        ['test@example.com', 'testuser', 'mocked_hashed_password']
      )

      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockSend).toHaveBeenCalledWith(nuevoUsuario)
    })

    it('should return 400 if email, username, or password are missing', async () => {
      mockRequest.body = { email: 'test@example.com', username: 'testuser' }

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockSend).toHaveBeenCalledWith({
        message: 'Email, username, and password are required'
      })
      expect(mockDbQuery).not.toHaveBeenCalled()
    })

    it('should return 409 if the user already exists', async () => {
      mockDbQuery.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'test@example.com' }],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: []
      })

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockDbQuery).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        ['test@example.com', 'testuser']
      )
      expect(mockResponse.status).toHaveBeenCalledWith(409)
      expect(mockSend).toHaveBeenCalledWith({ message: 'User already exists' })
    })

    it('should return 500 if the INSERT fails (rowCount 0)', async () => {
      mockDbQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: []
      })
      mockDbQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'INSERT',
        oid: 0,
        fields: []
      })

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Error registering user' })
    })

    it('should return 500 if the database fails', async () => {
      const dbError = new Error('Error de conexión a la BD')
      mockDbQuery.mockRejectedValueOnce(dbError)

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Error interno del servidor' })
    })
  })
})
