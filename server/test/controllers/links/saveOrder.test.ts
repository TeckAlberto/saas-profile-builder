import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { type Response } from 'express'

import saveOrder from '../../../src/controllers/links/saveOrder'
import type { AuthRequest } from '../../../src/middleware/auth.middleware'

const mockDbSelect = vi.hoisted(() => vi.fn())
const mockDbTransaction = vi.hoisted(() => vi.fn())

vi.mock('../../../src/db', () => ({
  db: {
    select: mockDbSelect,
    transaction: mockDbTransaction
  },
  pool: {
    end: vi.fn()
  }
}))

const mockDbFrom = vi.fn()
const mockDbWhere = vi.fn()

const mockTxUpdate = vi.fn()
const mockTxSet = vi.fn()
const mockTxWhere = vi.fn()

let mockRequest: Partial<AuthRequest>
let mockResponse: Partial<Response>
let mockStatus: Mock<(statusCode: number) => Response>
let mockJson: Mock<(body: unknown) => Response>

beforeEach(() => {
  vi.clearAllMocks()

  mockDbSelect.mockReturnValue({ from: mockDbFrom })
  mockDbFrom.mockReturnValue({ where: mockDbWhere })

  mockTxUpdate.mockReturnValue({ set: mockTxSet })
  mockTxSet.mockReturnValue({ where: mockTxWhere })
  mockTxWhere.mockResolvedValue(undefined)

  mockDbTransaction.mockImplementation(
    async (callback: (tx: { update: typeof mockTxUpdate }) => Promise<void>) => {
      await callback({ update: mockTxUpdate })
    }
  )

  mockResponse = {} as Partial<Response>
  mockStatus = vi.fn((_statusCode: number) => mockResponse as Response)
  mockJson = vi.fn((_body: unknown) => mockResponse as Response)

  mockResponse.status = mockStatus
  mockResponse.json = mockJson

  mockRequest = {
    userId: 123,
    body: {
      orderedLinkIds: [
        { id: 1, order: 0 },
        { id: 2, order: 1 }
      ]
    }
  }
})

describe('controller', () => {
  describe('links.saveOrder', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockRequest.userId = undefined

      await saveOrder(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' })
      expect(mockDbSelect).not.toHaveBeenCalled()
    })

    it('should return 400 when ordered IDs are invalid', async () => {
      mockDbWhere.mockResolvedValueOnce([{ id: 1, userId: 123 }])

      await saveOrder(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid link IDs' })
      expect(mockDbTransaction).not.toHaveBeenCalled()
    })

    it('should update links order and return 200', async () => {
      mockDbWhere.mockResolvedValueOnce([
        { id: 1, userId: 123 },
        { id: 2, userId: 123 }
      ])

      await saveOrder(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockDbTransaction).toHaveBeenCalled()
      expect(mockTxUpdate).toHaveBeenCalledTimes(2)
      expect(mockTxSet).toHaveBeenCalledWith({ order: 0 })
      expect(mockTxSet).toHaveBeenCalledWith({ order: 1 })
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Links order saved successfully'
      })
    })

    it('should return 500 when the database fails', async () => {
      mockDbWhere.mockRejectedValueOnce(new Error('DB error'))

      await saveOrder(mockRequest as AuthRequest, mockResponse as Response)

      expect(mockResponse.status).toHaveBeenCalledWith(500)
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Error saving links order' })
    })
  })
})
