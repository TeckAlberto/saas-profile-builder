import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import RegisterPage from '../../src/pages/RegisterPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

vi.mock('../components/icons/icons', () => ({
  UserIcon: () => <svg data-testid="icon-user" />,
  MailIcon: () => <svg data-testid="icon-mail" />,
  LockIcon: () => <svg data-testid="icon-lock" />
}))

describe('RegisterPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.fetch = vi.fn()
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

    const fetchMock = (window.fetch as Mock).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return {
        ok: true,
        json: async () => ({ message: 'Success' })
      } as Response
    })

    render(<RegisterPage />)

    await user.type(screen.getByLabelText(/username/i), 'juan')
    await user.type(screen.getByLabelText(/email/i), 'juan@test.com')
    await user.type(screen.getByLabelText('Password'), '123')
    await user.type(screen.getByLabelText(/confirm password/i), '123')

    await user.click(screen.getByRole('button', { name: /register/i }))

    expect(screen.getByText('Creating Account...')).toBeInTheDocument()

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/auth/register', expect.any(Object))
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('should handle server errors', async () => {
    const user = userEvent.setup()

    ;(window.fetch as Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Usuario existe' })
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
