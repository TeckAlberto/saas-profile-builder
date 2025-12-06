import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HomePage from '../../src/pages/HomePage'
import '@testing-library/jest-dom'

describe('HomePage', () => {
  it('renders correctly', () => {
    render(<HomePage />)
    expect(screen.getByText('HomePage')).toBeInTheDocument()
  })
})
