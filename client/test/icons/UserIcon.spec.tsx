import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { UserIcon } from '../../src/components/icons/UserIcon'
import '@testing-library/jest-dom'

describe('UserIcon Component', () => {
  it('should render the svg element successfully', () => {
    const { container } = render(<UserIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })

  it('should apply default classes when no className is provided', () => {
    const { container } = render(<UserIcon />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('w-4')
    expect(svg).toHaveClass('h-4')
  })

  it('should accept and apply custom class names', () => {
    const customClass = 'text-red-500 w-10 h-10'
    const { container } = render(<UserIcon className={customClass} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('text-red-500')
    expect(svg).toHaveClass('w-10')
    expect(svg).toHaveClass('h-10')
  })
})
