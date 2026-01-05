import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockGetByName = vi.hoisted(() => vi.fn())
const mockUseParams = vi.hoisted(() => vi.fn())

vi.mock('../../src/services/api', () => ({
  usersApi: {
    getByName: mockGetByName
  }
}))

vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParams()
}))

import PublicProfilePage from '../../src/pages/PublicProfilePage'

describe('PublicProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render profile details and links', async () => {
    mockUseParams.mockReturnValue({ name: 'jane' })
    mockGetByName.mockResolvedValue({
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
    })

    render(<PublicProfilePage />)

    expect(await screen.findByText('jane')).toBeInTheDocument()
    expect(await screen.findByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('https://github.com/jane')).toBeInTheDocument()
  })

  it('should show an error when name is missing', async () => {
    mockUseParams.mockReturnValue({})

    render(<PublicProfilePage />)

    expect(await screen.findByText('We couldn’t find this profile.')).toBeInTheDocument()
    expect(screen.getByText('Missing username in the URL.')).toBeInTheDocument()
  })

  it('should show an error when api fails', async () => {
    mockUseParams.mockReturnValue({ name: 'jane' })
    mockGetByName.mockRejectedValue(new Error('User not found'))

    render(<PublicProfilePage />)

    expect(await screen.findByText('We couldn’t find this profile.')).toBeInTheDocument()
    expect(screen.getByText('User not found')).toBeInTheDocument()
  })
})
