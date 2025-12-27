import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'
import { post } from '../../src/services/api'

const mockFetch = vi.fn() as MockedFunction<typeof fetch>
globalThis.fetch = mockFetch

describe('api service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should make a POST request with correct parameters', async () => {
    const mockResponse = { success: true }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(mockResponse)
    } as Response)

    const result = await post('/test-url', { key: 'value' })

    expect(mockFetch).toHaveBeenCalledWith('/test-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: 'value' })
    })
    expect(result).toEqual(mockResponse)
  })

  it('should throw an error when response is not ok', async () => {
    const errorMessage = 'Bad Request'
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      text: async () => JSON.stringify({ message: errorMessage })
    } as Response)

    await expect(post('/test-url', {})).rejects.toThrow(errorMessage)
  })

  it('should throw a default error message when no message is provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: '',
      text: async () => JSON.stringify({})
    } as Response)

    await expect(post('/test-url', {})).rejects.toThrow('Something went wrong')
  })
})
