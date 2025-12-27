import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Response } from 'express'

import getByUserId from '../../../src/controllers/links/getByUserId'
import type { AuthRequest } from '../../../src/middleware/auth.middleware'

const mockDbSelect = vi.hoisted(() => vi.fn())

vi.mock('../../../src/db', () => ({
  db: {
    select: mockDbSelect
  },
  pool: {
    end: vi.fn()
  }
}))

const mockDbFrom = vi.fn()
const mockDbWhere = vi.fn()
const mockDbOrderBy = vi.fn()

let mockRequest: Partial<AuthRequest>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockJson: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockDbSelect.mockReturnValue({ from: mockDbFrom })
  mockDbFrom.mockReturnValue({ where: mockDbWhere })
  mockDbWhere.mockReturnValue({ orderBy: mockDbOrderBy })

  mockResponse = {} as Partial<Response>
  mockStatus = vi.fn((_statusCode: number) => mockResponse as Response)
  mockJson = vi.fn((_body: unknown) => mockResponse as Response)

  mockResponse.status = mockStatus
  mockResponse.json = mockJson

  mockRequest = {
    userId: 123
  }
})

describe('controller', () => {
  describe('links.getByUserId', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockRequest.userId = undefined

      await getByUserId(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
    })

    it('should return user links', async () => {
      const userLinks = [
        {
          id: 1,
          userId: 123,
          title: 'Example',
          url: 'https://example.com',
          active: true
        }
      ]

      mockDbOrderBy.mockResolvedValueOnce(userLinks)

      await getByUserId(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith(userLinks)
    })

    it('should return 500 if the database fails', async () => {
      mockDbOrderBy.mockRejectedValueOnce(new Error('DB error'))

      await getByUserId(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error fetching links' })
    })
  })
})
