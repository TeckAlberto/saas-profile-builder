import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Request, type Response } from 'express'

import login from '../../../src/controllers/auth/login'

const mockDbSelect = vi.hoisted(() => vi.fn())
const mockBcryptCompare = vi.hoisted(() => vi.fn())
const mockJwtSign = vi.hoisted(() => vi.fn())

vi.mock('../../../src/db', () => ({
  db: {
    select: mockDbSelect
  },
  pool: {
    end: vi.fn()
  }
}))

vi.mock('bcryptjs', () => ({
  default: {
    compare: mockBcryptCompare
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

let mockRequest: Partial<Request>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockSend: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockDbSelect.mockReturnValue({ from: mockDbFrom })
  mockDbFrom.mockReturnValue({ where: mockDbWhere })
  mockDbWhere.mockReturnValue({ limit: mockDbLimit })
  mockBcryptCompare.mockResolvedValue(true)
  mockJwtSign.mockReturnValue('mocked_jwt_token')

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
        id: 1,
        email: 'test@example.com',
        passwordHash: 'mocked_hashed_password',
        username: 'testuser'
      }

      const successfulLoginResponse = {
        message: 'Login successful',
        token: 'mocked_jwt_token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }
      }

      mockDbLimit.mockResolvedValueOnce([existingUser])

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()

      expect(mockBcryptCompare).toHaveBeenCalledWith('password123', 'mocked_hashed_password')
      expect(mockJwtSign).toHaveBeenCalledWith({ userId: 1 }, process.env.JWT_SECRET as string, {
        expiresIn: '2h'
      })

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
      mockDbLimit.mockResolvedValueOnce([])

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockSend).toHaveBeenCalledWith({ message: 'User not found' })
    })

    it('should return 401 if the password is incorrect', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'mocked_hashed_password'
      }

      mockDbLimit.mockResolvedValueOnce([existingUser])
      mockBcryptCompare.mockResolvedValueOnce(false)

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()

      expect(mockBcryptCompare).toHaveBeenCalledWith('password123', 'mocked_hashed_password')

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Invalid credentials' })
    })

    it('should return 500 if there is a database error', async () => {
      mockDbLimit.mockRejectedValueOnce(new Error('Database error'))

      await login(mockRequest as Request, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Internal server error' })
    })
  })
})
