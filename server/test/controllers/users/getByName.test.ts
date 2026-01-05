import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Request, type Response } from 'express'

import getByName from '../../../src/controllers/users/getByName'

const mockDbSelect = vi.hoisted(() => vi.fn())

vi.mock('../../../src/db', () => ({
  db: {
    select: mockDbSelect
  },
  pool: {
    end: vi.fn()
  }
}))

const mockDbFromUsers = vi.fn()
const mockDbWhereUsers = vi.fn()
const mockDbFromLinks = vi.fn()
const mockDbWhereLinks = vi.fn()
const mockDbOrderByLinks = vi.fn()

let mockRequest: Partial<Request>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockJson: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockDbSelect.mockReset()
  mockDbFromUsers.mockReset()
  mockDbWhereUsers.mockReset()
  mockDbFromLinks.mockReset()
  mockDbWhereLinks.mockReset()
  mockDbOrderByLinks.mockReset()

  mockDbSelect
    .mockReturnValueOnce({ from: mockDbFromUsers })
    .mockReturnValueOnce({ from: mockDbFromLinks })
  mockDbFromUsers.mockReturnValue({ where: mockDbWhereUsers })
  mockDbFromLinks.mockReturnValue({ where: mockDbWhereLinks })
  mockDbWhereLinks.mockReturnValue({ orderBy: mockDbOrderByLinks })

  mockResponse = {} as Partial<Response>
  mockStatus = vi.fn((_statusCode: number) => mockResponse as Response)
  mockJson = vi.fn((_body: unknown) => mockResponse as Response)

  mockResponse.status = mockStatus
  mockResponse.json = mockJson

  mockRequest = {
    params: {
      name: 'jane'
    }
  }
})

describe('controller', () => {
  describe('users.getByName', () => {
    it('should return 400 when name param is missing', async () => {
      mockRequest.params = {}

      await getByName(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid or missing name parameter'
      })
    })

    it('should return user and links by name', async () => {
      const usersFetched = [
        {
          id: 1,
          username: 'jane',
          email: 'jane@test.com'
        }
      ]
      const linksFetched = [
        {
          id: 1,
          userId: 1,
          title: 'Example',
          url: 'https://example.com',
          order: 0,
          isActive: true
        }
      ]

      mockDbWhereUsers.mockResolvedValueOnce(usersFetched)
      mockDbOrderByLinks.mockResolvedValueOnce(linksFetched)

      await getByName(mockRequest as Request, mockResponse as Response)

      expect(mockDbSelect).toHaveBeenCalled()
      expect(mockResponse.json).toHaveBeenCalledWith({
        username: 'jane',
        links: linksFetched
      })
    })

    it('should return 404 when user is not found', async () => {
      mockDbWhereUsers.mockResolvedValueOnce([])

      await getByName(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' })
    })

    it('should return 500 if the database fails', async () => {
      mockDbWhereUsers.mockReset()
      mockDbWhereUsers.mockImplementationOnce(() => {
        throw new Error('DB error')
      })

      await getByName(mockRequest as Request, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error fetching user' })
    })
  })
})
