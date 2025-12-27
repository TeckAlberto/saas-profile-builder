import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../../src/pages/LoginPage'
import '@testing-library/jest-dom'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

vi.mock('../../src/components/icons', () => ({
  MailIcon: () => <svg data-testid="icon-mail" />,
  LockIcon: () => <svg data-testid="icon-lock" />
}))

vi.mock('../../src/components/ui/AuthHeader', () => ({
  AuthHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="auth-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}))

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.fetch = vi.fn() as MockedFunction<typeof fetch>
  })

  it('should render correctly', () => {
    render(<LoginPage />)

    expect(screen.getByTestId('auth-header')).toBeInTheDocument()

    const loginElement = screen.getAllByText('Login')

    expect(loginElement).toHaveLength(2)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('should show error if form is submitted empty', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText('Please fill in all fields.')).toBeInTheDocument()
    expect(window.fetch).not.toHaveBeenCalled()
  })

  it('should call API and redirect on success', async () => {
    const user = userEvent.setup()

    const fetchMock = window.fetch as MockedFunction<typeof fetch>
    fetchMock.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () =>
        JSON.stringify({
          message: 'Success',
          token: 'fake-token',
          user: { id: 1, username: 'testuser', email: 'test@example.com' }
        })
    } as Response)

    render(<LoginPage />)

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'password123')

    await user.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      )
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should handle server errors', async () => {
    const user = userEvent.setup()

    const fetchMock = window.fetch as MockedFunction<typeof fetch>
    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
      text: async () => JSON.stringify({ message: 'Invalid credentials' })
    } as Response)

    render(<LoginPage />)

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/Password/i), 'wrongpassword')

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
