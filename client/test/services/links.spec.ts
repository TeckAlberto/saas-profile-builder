import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'
import { linksApi } from '../../src/services/links'

const mockFetch = vi.fn() as MockedFunction<typeof fetch>
globalThis.fetch = mockFetch

describe('links api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should list links with auth token', async () => {
    const payload = [
      {
        id: 1,
        title: 'Link 1',
        url: 'https://example.com',
        userId: 1,
        platform: 'custom',
        order: 0,
        isActive: true
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(payload)
    } as Response)

    const result = await linksApi.list('token-123', { baseUrl: 'http://localhost:4000' })

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/links', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-123'
      },
      body: undefined
    })
    expect(result).toEqual(payload)
  })

  it('should create a link with auth token', async () => {
    const payload = {
      id: 1,
      title: 'Link 1',
      url: 'https://example.com',
      userId: 1,
      platform: 'custom',
      order: 0,
      isActive: true
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(payload)
    } as Response)

    const result = await linksApi.create(
      'token-123',
      { title: 'Link 1', url: 'https://example.com' },
      { baseUrl: 'http://localhost:4000' }
    )

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-123'
      },
      body: JSON.stringify({ title: 'Link 1', url: 'https://example.com' })
    })
    expect(result).toEqual(payload)
  })
})
