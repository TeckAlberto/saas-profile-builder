import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Response } from 'express'

import create from '../../../src/controllers/links/create'
import { links } from '../../../src/db/schema'
import type { AuthRequest } from '../../../src/middleware/auth'

const mockDbInsert = vi.hoisted(() => vi.fn())

vi.mock('../../../src/db', () => ({
  db: {
    insert: mockDbInsert
  },
  pool: {
    end: vi.fn()
  }
}))

const mockDbValues = vi.fn()
const mockDbReturning = vi.fn()

let mockRequest: Partial<AuthRequest>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockJson: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockDbInsert.mockReturnValue({ values: mockDbValues })
  mockDbValues.mockReturnValue({ returning: mockDbReturning })

  mockResponse = {} as Partial<Response>
  mockStatus = vi.fn((_statusCode: number) => mockResponse as Response)
  mockJson = vi.fn((_body: unknown) => mockResponse as Response)

  mockResponse.status = mockStatus
  mockResponse.json = mockJson

  mockRequest = {
    userId: 123,
    body: {
      url: 'https://example.com',
      title: 'Example'
    }
  }
})

describe('controller', () => {
  describe('links.create', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockRequest.userId = undefined

      await create(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
      expect(mockDbInsert).not.toHaveBeenCalled()
    })

    it('should return 400 when url or title is missing', async () => {
      mockRequest.body = {
        title: ''
      }

      await create(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'URL and Title are required' })
      expect(mockDbInsert).not.toHaveBeenCalled()
    })

    it('should create a link with default platform', async () => {
      const newLink = {
        id: 1,
        userId: 123,
        platform: 'custom',
        title: 'Example',
        url: 'https://example.com',
        order: 0
      }

      mockDbReturning.mockResolvedValueOnce([newLink])

      await create(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockDbInsert).toHaveBeenCalledWith(links)
      expect(mockDbValues).toHaveBeenCalledWith({
        userId: 123,
        platform: 'custom',
        title: 'Example',
        url: 'https://example.com',
        order: 0
      })
      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(newLink)
    })

    it('should return 500 if the database fails', async () => {
      mockDbReturning.mockRejectedValueOnce(new Error('DB error'))

      await create(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error creating link' })
    })
  })
})
