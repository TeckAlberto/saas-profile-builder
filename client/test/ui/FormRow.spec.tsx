import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FormRow } from '../../src/components/ui/FormRow'
import '@testing-library/jest-dom'

describe('FormRow', () => {
  it('should render with label and input correctly', () => {
    render(<FormRow label="Username" name="username" />)

    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username')
  })

  it('should render with an icon when provided', () => {
    const Icon = <span data-testid="test-icon">icon</span>
    render(<FormRow label="Email" name="email" icon={Icon} />)

    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('should pass other props to the input element', () => {
    render(
      <FormRow label="Password" name="password" type="password" placeholder="Enter password" />
    )

    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('placeholder', 'Enter password')
  })

  it('should handle user input', () => {
    const handleChange = vi.fn()
    render(<FormRow label="Name" name="name" onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'John Doe' } })

    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('John Doe')
  })
})
