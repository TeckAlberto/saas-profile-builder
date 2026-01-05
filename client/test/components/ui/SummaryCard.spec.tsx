import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import SummaryCard from '../../../src/components/ui/SummaryCard'

describe('SummaryCard', () => {
  it('should render profile info and actions', async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()
    const onAddLink = vi.fn()
    const onLogout = vi.fn()
    const onPreview = vi.fn()

    render(
      <SummaryCard
        profileUrl="https://example.com/jane"
        copied={false}
        onCopy={onCopy}
        onAddLink={onAddLink}
        onLogout={onLogout}
        onPreview={onPreview}
        canCopy={true}
      />
    )

    expect(screen.getByText('Your page')).toBeInTheDocument()
    expect(screen.getByText('https://example.com/jane')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /copy link/i }))
    await user.click(screen.getByRole('button', { name: /add link/i }))
    await user.click(screen.getByRole('button', { name: /log out/i }))
    await user.click(screen.getByRole('button', { name: /preview/i }))

    expect(onCopy).toHaveBeenCalledTimes(1)
    expect(onAddLink).toHaveBeenCalledTimes(1)
    expect(onLogout).toHaveBeenCalledTimes(1)
    expect(onPreview).toHaveBeenCalledTimes(1)
  })

  it('should disable copy button when canCopy is false', () => {
    render(
      <SummaryCard
        profileUrl="-"
        copied={false}
        onCopy={vi.fn()}
        onAddLink={vi.fn()}
        onLogout={vi.fn()}
        onPreview={vi.fn()}
        canCopy={false}
      />
    )

    expect(screen.getByRole('button', { name: /copy link/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /preview/i })).toBeDisabled()
  })

  it('should show copied state', () => {
    render(
      <SummaryCard
        profileUrl="https://example.com/jane"
        copied={true}
        onCopy={vi.fn()}
        onAddLink={vi.fn()}
        onLogout={vi.fn()}
        onPreview={vi.fn()}
        canCopy={true}
      />
    )

    expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument()
  })
})
