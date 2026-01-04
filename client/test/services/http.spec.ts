import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'
import { get, post, patch } from '../../src/services/http'

const mockFetch = vi.fn() as MockedFunction<typeof fetch>
globalThis.fetch = mockFetch

describe('http service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should perform a GET request', async () => {
    const payload = [{ id: 1 }]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(payload)
    } as Response)

    const result = await get('/api/links')

    expect(mockFetch).toHaveBeenCalledWith('/api/links', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: undefined
    })
    expect(result).toEqual(payload)
  })

  it('should perform a POST request with auth header', async () => {
    const payload = { ok: true }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(payload)
    } as Response)

    const result = await post('/api/test', { name: 'test' }, { token: 'token-123' })

    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-123'
      },
      body: JSON.stringify({ name: 'test' })
    })
    expect(result).toEqual(payload)
  })

  it('should throw on invalid JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => 'not-json'
    } as Response)

    await expect(get('/api/test')).rejects.toThrow('Invalid JSON response from server')
  })

  it('should throw on empty response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => ''
    } as Response)

    await expect(get('/api/test')).rejects.toThrow('Empty response from server')
  })

  it('should perform a PATCH request with payload', async () => {
    const payload = { ok: true }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(payload)
    } as Response)

    const result = await patch('/api/links/order', { orderedLinkIds: [] })

    expect(mockFetch).toHaveBeenCalledWith('/api/links/order', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderedLinkIds: [] })
    })
    expect(result).toEqual(payload)
  })
})
