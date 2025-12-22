import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { api } from '../../src/services/api'

globalThis.fetch = vi.fn()

describe('api service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should make a POST request with correct parameters', async () => {
    const mockResponse = { success: true }
    ;(globalThis.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })

    const result = await api.post('/test-url', { key: 'value' })

    expect(globalThis.fetch).toHaveBeenCalledWith('/test-url', {
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
    ;(globalThis.fetch as Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: errorMessage })
    })

    await expect(api.post('/test-url', {})).rejects.toThrow(errorMessage)
  })

  it('should throw a default error message when no message is provided', async () => {
    ;(globalThis.fetch as Mock).mockResolvedValue({
      ok: false,
      json: async () => ({})
    })

    await expect(api.post('/test-url', {})).rejects.toThrow('Something went wrong')
  })
})
