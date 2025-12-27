import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import AddLinkModal from '../../../src/components/ui/AddLinkModal'

describe('AddLinkModal', () => {
  it('should render nothing when closed', () => {
    render(
      <AddLinkModal
        isOpen={false}
        formError=""
        draft={{ title: '', url: '' }}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        onChange={vi.fn()}
      />
    )

    expect(screen.queryByRole('dialog', { name: /add link/i })).not.toBeInTheDocument()
  })

  it('should call handlers when interacting', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onSubmit = vi.fn()
    const onChange = vi.fn()

    const Wrapper = () => {
      const [draft, setDraft] = useState({ title: 'GitHub', url: 'https://github.com/jane' })
      const handleChange = (nextDraft: { title: string; url: string }) => {
        onChange(nextDraft)
        setDraft(nextDraft)
      }

      return (
        <AddLinkModal
          isOpen={true}
          formError="Oops"
          draft={draft}
          onClose={onClose}
          onSubmit={onSubmit}
          onChange={handleChange}
        />
      )
    }

    render(<Wrapper />)

    expect(screen.getByRole('dialog', { name: /add link/i })).toBeInTheDocument()
    expect(screen.getByText('Oops')).toBeInTheDocument()

    const titleInput = screen.getByPlaceholderText('Instagram')

    await user.clear(titleInput)
    await user.type(titleInput, 'Portfolio')
    expect(onChange).toHaveBeenLastCalledWith({
      title: 'Portfolio',
      url: 'https://github.com/jane'
    })

    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
