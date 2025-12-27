import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import RegisterPage from '../../src/pages/RegisterPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

vi.mock('../../src/components/icons', () => ({
  UserIcon: () => <svg data-testid="icon-user" />,
  MailIcon: () => <svg data-testid="icon-mail" />,
  LockIcon: () => <svg data-testid="icon-lock" />
}))

describe('RegisterPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.fetch = vi.fn() as MockedFunction<typeof fetch>
  })

  it('should render correctly the component', () => {
    render(<RegisterPage />)

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
    expect(screen.getByText(/Username/i)).toBeInTheDocument()
    expect(screen.getByText(/Email/i)).toBeInTheDocument()
    expect(screen.getByText('Password')).toBeInTheDocument()
    expect(screen.getByText(/Confirm Password/i)).toBeInTheDocument()
  })

  it('should show error if form is submitted empty', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText('Please fill in all fields.')).toBeInTheDocument()
    expect(window.fetch).not.toHaveBeenCalled()
  })

  it('should show error if passwords do not match', async () => {
    const user = userEvent.setup()
    render(<RegisterPage />)

    await user.type(screen.getByLabelText(/Username/i), 'usuario_test')
    await user.type(screen.getByLabelText(/Email/i), 'test@correo.com')
    const passwordInput = screen.getAllByLabelText(/Password/i)[0]
    await user.type(passwordInput, 'PASSWORD_TEST')
    await user.type(screen.getByLabelText(/Confirm Password/i), 'PASSWORD_DIFERENTE')

    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText('The passwords do not match.')).toBeInTheDocument()
  })

  it('should call API and redirect if successful', async () => {
    const user = userEvent.setup()

    const fetchMock = window.fetch as MockedFunction<typeof fetch>
    fetchMock.mockResolvedValueOnce({
      ok: true,
      statusText: '',
      text: async () => JSON.stringify({ ok: true })
    } as Response)

    render(<RegisterPage />)

    await user.type(screen.getByLabelText(/username/i), 'juan')
    await user.type(screen.getByLabelText(/email/i), 'juan@test.com')
    await user.type(screen.getByLabelText('Password'), '123')
    await user.type(screen.getByLabelText(/confirm password/i), '123')

    await user.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'juan',
          email: 'juan@test.com',
          password: '123'
        })
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('should handle server errors', async () => {
    const user = userEvent.setup()

    const fetchMock = window.fetch as MockedFunction<typeof fetch>
    fetchMock.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      text: async () => JSON.stringify({ message: 'Usuario existe' })
    } as Response)

    render(<RegisterPage />)

    await user.type(screen.getByLabelText(/username/i), 'juan')
    await user.type(screen.getByLabelText(/email/i), 'juan@test.com')
    await user.type(screen.getByLabelText('Password'), '123')
    await user.type(screen.getByLabelText(/confirm password/i), '123')

    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(await screen.findByText('Usuario existe')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
