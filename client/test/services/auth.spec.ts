import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'
import { authApi } from '../../src/services/auth'

const mockFetch = vi.fn() as MockedFunction<typeof fetch>
globalThis.fetch = mockFetch

describe('auth api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should login with correct payload', async () => {
    const payload = {
      message: 'Login successful',
      token: 'token-123',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify(payload)
    } as Response)

    const result = await authApi.login(
      { email: 'test@example.com', password: 'secret' },
      { baseUrl: 'http://localhost:4000' }
    )

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'secret' })
    })
    expect(result).toEqual(payload)
  })

  it('should register with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify({ ok: true })
    } as Response)

    await authApi.register(
      { email: 'test@example.com', username: 'testuser', password: 'secret' },
      { baseUrl: 'http://localhost:4000' }
    )

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser',
        password: 'secret'
      })
    })
  })
})
