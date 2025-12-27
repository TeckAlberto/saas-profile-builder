import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import LinksList from '../../../src/components/ui/LinksList'
import type { Link } from '../../../src/services/api'

describe('LinksList', () => {
  it('should render empty state and trigger add', async () => {
    const user = userEvent.setup()
    const onAddLink = vi.fn()

    render(<LinksList links={[]} onAddLink={onAddLink} />)

    expect(screen.getByText('No links yet.')).toBeInTheDocument()
    expect(screen.getByText('0 items')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /add your first link/i }))
    expect(onAddLink).toHaveBeenCalledTimes(1)
  })

  it('should render a list of links', () => {
    const links: Link[] = [
      {
        id: 1,
        title: 'GitHub',
        url: 'https://github.com/jane',
        userId: 1,
        platform: 'github',
        order: 0,
        isActive: true
      },
      {
        id: 2,
        title: 'Portfolio',
        url: 'https://example.com',
        userId: 1,
        platform: 'custom',
        order: 1,
        isActive: false
      }
    ]

    render(<LinksList links={links} onAddLink={vi.fn()} />)

    expect(screen.getByText('2 items')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Portfolio')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^active$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^inactive$/i })).toBeInTheDocument()
  })
})
