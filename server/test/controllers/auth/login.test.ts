import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Request, type Response } from 'express'
import bcrypt from 'bcryptjs'
import j from 'jsonwebtoken'

import db from '../../../src/db'
import login from '../../../src/controllers/auth/login'

vi.mock('../../../src/db', () => ({
  default: {
    query: vi.fn()
  }
}))

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(() => Promise.resolve(true))
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mocked_jwt_token')
  }
}))

const mockDbQuery = vi.spyOn(db, 'query')
const mockBcryptCompare = vi.spyOn(bcrypt, 'compare')
const mockJwtSign = vi.spyOn(j, 'sign')

let mockRequest: Partial<Request>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockSend: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockResponse = {} as Partial<Response>

  mockSend = vi.fn((_body: unknown) => {
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
      password: 'password123'
    }
  }
})

describe('controller', () => {
  describe('login', () => {
    it('should log in a user successfully', async () => {
      const existingUser = {
        email: 'test@example.com',
        password_hash: 'mocked_hashed_password'
      }

      const successfulLoginResponse = {
        message: 'Login successful',
        token: 'mocked_jwt_token'
      }

      mockDbQuery.mockResolvedValueOnce({
        rows: [existingUser],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: []
      })

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [
        'test@example.com'
      ])

      expect(mockBcryptCompare).toHaveBeenCalledWith('password123', 'mocked_hashed_password')
      expect(mockJwtSign).toHaveBeenCalledWith(
        { userId: undefined },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      )

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockSend).toHaveBeenCalledWith(successfulLoginResponse)
    })

    it('should return 400 if email or password is missing', async () => {
      mockRequest.body = {
        email: '',
        password: ''
      }

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Email and password are required' })
    })

    it('should return 404 if the user does not exist', async () => {
      mockDbQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        oid: 0,
        fields: []
      })

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [
        'test@example.com'
      ])

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockSend).toHaveBeenCalledWith({ message: 'User not found' })
    })

    it('should return 401 if the password is incorrect', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'mocked_hashed_password'
      }

      mockDbQuery.mockResolvedValueOnce({
        rows: [existingUser],
        rowCount: 1,
        command: 'SELECT',
        oid: 0,
        fields: []
      })
      mockBcryptCompare.mockResolvedValueOnce()

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [
        'test@example.com'
      ])

      expect(mockBcryptCompare).toHaveBeenCalledWith('password123', 'mocked_hashed_password')

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Invalid credentials' })
    })

    it('should return 500 if there is a database error', async () => {
      mockDbQuery.mockRejectedValueOnce(new Error('Database error'))

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbQuery).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', [
        'test@example.com'
      ])

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Internal server error' })
    })
  })
})
