import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import DashboardPage from '../../src/pages/DashboardPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

const mockLogout = vi.fn()
vi.mock('../../src/store/authStore', () => ({
  useAuthStore: (selector: (state: { logout: () => void }) => unknown) =>
    selector({ logout: mockLogout })
}))

describe('DashboardPage Component', () => {
  let writeTextMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 1, username: 'jane', email: 'jane@test.com' })
    )

    vi.stubGlobal('crypto', { randomUUID: vi.fn().mockReturnValue('uuid-1') })
    vi.stubGlobal('alert', vi.fn())

    writeTextMock = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(window.Navigator.prototype, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true
    })

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true
    })
  })

  it('should render the profile url and copy it', async () => {
    const user = userEvent.setup()

    render(<DashboardPage />)

    const profileUrlElement = await screen.findByText(/\/u\/jane$/i)
    const profileUrl = profileUrlElement.textContent ?? ''
    expect(profileUrl).not.toBe('')

    const copyButton = screen.getByRole('button', { name: /^copy link$/i })
    expect(copyButton).toBeEnabled()

    await user.click(copyButton)

    expect(screen.getByRole('button', { name: /^copied!$/i })).toBeInTheDocument()
    expect(globalThis.alert).not.toHaveBeenCalled()
  })

  it('should log out and redirect to the login page', async () => {
    const user = userEvent.setup()

    render(<DashboardPage />)

    await user.click(screen.getByRole('button', { name: /log out/i }))

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('user')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login')
  })

  it('should add, toggle, and remove a link with validation', async () => {
    const user = userEvent.setup()

    render(<DashboardPage />)

    await user.click(screen.getByRole('button', { name: /add link/i }))
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    expect(await screen.findByText('Please fill in title and URL.')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Instagram'), 'Instagram')
    await user.type(screen.getByPlaceholderText('https://instagram.com/youruser'), 'not-a-url')
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    expect(await screen.findByText('Please enter a valid URL (https://...).')).toBeInTheDocument()

    await user.clear(screen.getByPlaceholderText('https://instagram.com/youruser'))
    await user.type(
      screen.getByPlaceholderText('https://instagram.com/youruser'),
      'https://instagram.com/jane'
    )
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    expect(screen.queryByRole('dialog', { name: /add link/i })).not.toBeInTheDocument()

    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByText('https://instagram.com/jane')).toBeInTheDocument()
    expect(screen.getByText('1 item')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /active/i }))
    expect(screen.getByRole('button', { name: /inactive/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /remove instagram/i }))
    expect(screen.getByText('No links yet.')).toBeInTheDocument()
    expect(screen.getByText('0 items')).toBeInTheDocument()
  })
})
