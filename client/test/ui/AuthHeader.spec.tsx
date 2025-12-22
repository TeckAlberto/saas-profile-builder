import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthHeader } from '../../src/components/ui/AuthHeader'
import '@testing-library/jest-dom'

describe('AuthHeader', () => {
  it('should render title and subtitle correctly', () => {
    const title = 'Welcome Back'
    const subtitle = 'Please sign in to continue'

    render(<AuthHeader title={title} subtitle={subtitle} />)

    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(subtitle)).toBeInTheDocument()
  })
})
