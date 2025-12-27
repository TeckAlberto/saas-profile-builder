import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Response } from 'express'

import deleteLink from '../../../src/controllers/links/delete'
import type { AuthRequest } from '../../../src/middleware/auth.middleware'

const mockDbSelect = vi.hoisted(() => vi.fn())
const mockDbDelete = vi.hoisted(() => vi.fn())

vi.mock('../../../src/db', () => ({
  db: {
    select: mockDbSelect,
    delete: mockDbDelete
  },
  pool: {
    end: vi.fn()
  }
}))

const mockDbFrom = vi.fn()
const mockDbWhereSelect = vi.fn()
const mockDbWhereDelete = vi.fn()

let mockRequest: Partial<AuthRequest>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockJson: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockDbSelect.mockReturnValue({ from: mockDbFrom })
  mockDbFrom.mockReturnValue({ where: mockDbWhereSelect })
  mockDbWhereSelect.mockResolvedValue([]) // Default to no link found

  mockDbDelete.mockReturnValue({ where: mockDbWhereDelete })
  mockDbWhereDelete.mockResolvedValue(undefined)

  mockResponse = {} as Partial<Response>
  mockStatus = vi.fn((_statusCode: number) => mockResponse as Response)
  mockJson = vi.fn((_body: unknown) => mockResponse as Response)

  mockResponse.status = mockStatus
  mockResponse.json = mockJson

  mockRequest = {
    userId: 123,
    params: {
      linkId: '1'
    }
  }
})

describe('controller', () => {
  describe('links.delete', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockRequest.userId = undefined

      await deleteLink(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
      expect(mockDbSelect).not.toHaveBeenCalled()
    })

    it('should return 404 when link does not exist', async () => {
      mockDbWhereSelect.mockResolvedValue([]) // No link found

      await deleteLink(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Link not found' })
    })

    it('should delete the link and return 200 when link exists', async () => {
      const mockLink = { id: 1, userId: 123, title: 'Test', url: 'https://test.com' }
      mockDbWhereSelect.mockResolvedValue([mockLink]) // Link found

      await deleteLink(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockDbDelete).toHaveBeenCalled()
      expect(mockDbWhereDelete).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Link deleted successfully',
        link: mockLink
      })
    })
  })
})
