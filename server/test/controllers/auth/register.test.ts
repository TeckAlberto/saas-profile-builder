import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Request, type Response } from 'express'

import register from '../../../src/controllers/auth/register'

const mockDbSelect = vi.hoisted(() => vi.fn())
const mockDbInsert = vi.hoisted(() => vi.fn())
const mockBcryptGenSalt = vi.hoisted(() => vi.fn())
const mockBcryptHash = vi.hoisted(() => vi.fn())

vi.mock('../../../src/db', () => ({
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
    genSalt: mockBcryptGenSalt,
    hash: mockBcryptHash
  }
}))

const mockDbFrom = vi.fn()
const mockDbWhere = vi.fn()
const mockDbLimit = vi.fn()
const mockDbValues = vi.fn()
const mockDbReturning = vi.fn()

let mockRequest: Partial<Request>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockSend: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockDbSelect.mockReturnValue({ from: mockDbFrom })
  mockDbFrom.mockReturnValue({ where: mockDbWhere })
  mockDbWhere.mockReturnValue({ limit: mockDbLimit })
  mockDbInsert.mockReturnValue({ values: mockDbValues })
  mockDbValues.mockReturnValue({ returning: mockDbReturning })
  mockBcryptGenSalt.mockResolvedValue('mocked_salt')
  mockBcryptHash.mockResolvedValue('mocked_hashed_password')

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

      mockDbLimit.mockResolvedValueOnce([])
      mockDbReturning.mockResolvedValueOnce([nuevoUsuario])

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()

      expect(mockBcryptHash).toHaveBeenCalledWith('password123', 'mocked_salt')

      expect(mockDbInsert).toHaveBeenCalled()

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockSend).toHaveBeenCalledWith(nuevoUsuario)
    })

    it('should return 400 if email, username, or password are missing', async () => {
      mockRequest.body = { email: 'test@example.com', username: 'testuser' }

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockSend).toHaveBeenCalledWith({
        message: 'Email, username, and password are required'
      })
      expect(mockDbSelect).not.toHaveBeenCalled()
    })

    it('should return 409 if the user already exists', async () => {
      mockDbLimit.mockResolvedValueOnce([{ id: 1, email: 'test@example.com' }])

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(409)
      expect(mockSend).toHaveBeenCalledWith({ message: 'User already exists' })
    })

    it('should return 500 if the INSERT fails (rowCount 0)', async () => {
      mockDbLimit.mockResolvedValueOnce([])
      mockDbReturning.mockResolvedValueOnce([])

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Error registering user' })
    })

    it('should return 500 if the database fails', async () => {
      const dbError = new Error('Error de conexión a la BD')
      mockDbLimit.mockRejectedValueOnce(dbError)

      await register(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockSend).toHaveBeenCalledWith({ message: 'Error interno del servidor' })
    })
  })
})
