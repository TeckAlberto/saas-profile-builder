import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import DeleteLinkModal from '../../../src/components/ui/DeleteLinkModal'

describe('DeleteLinkModal', () => {
  it('should render nothing when closed', () => {
    render(
      <DeleteLinkModal isOpen={false} linkTitle="GitHub" onConfirm={vi.fn()} onCancel={vi.fn()} />
    )

    expect(screen.queryByRole('dialog', { name: /delete link/i })).not.toBeInTheDocument()
  })

  it('should render link title and handle actions', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()

    render(
      <DeleteLinkModal isOpen={true} linkTitle="GitHub" onConfirm={onConfirm} onCancel={onCancel} />
    )

    expect(screen.getByRole('dialog', { name: /delete link/i })).toBeInTheDocument()
    expect(screen.getByText('This will remove "GitHub" from your profile.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /delete/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
