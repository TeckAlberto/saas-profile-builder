import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'
import { usersApi } from '../../src/services/users'

const mockFetch = vi.fn() as MockedFunction<typeof fetch>
globalThis.fetch = mockFetch

describe('users api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch a public profile by name', async () => {
    const payload = {
      username: 'jane',
      links: [
        {
          id: 1,
          title: 'GitHub',
          url: 'https://github.com/jane',
          userId: 1,
          platform: 'github',
          order: 0,
          isActive: true
        }
      ]
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(payload)
    } as Response)

    const result = await usersApi.getByName('jane', { baseUrl: 'http://localhost:4000' })

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/jane', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: undefined
    })
    expect(result).toEqual(payload)
  })
})
