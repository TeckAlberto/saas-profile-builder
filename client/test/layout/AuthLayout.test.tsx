import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthLayout } from '../../src/components/layout/AuthLayout'
import '@testing-library/jest-dom'

describe('AuthLayout Component', () => {
  it('should render the child content via Outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<span>Child Content</span>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Child Content')).toBeInTheDocument()
  })

  it('should have the correct container structure and styles', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthLayout />
      </MemoryRouter>
    )

    const outerContainer = container.firstChild
    expect(outerContainer).toHaveClass(
      'min-h-screen',
      'flex',
      'items-center',
      'justify-center',
      'bg-linear-to-br'
    )

    const innerCard = outerContainer?.firstChild
    expect(innerCard).toHaveClass(
      'w-full',
      'max-w-lg',
      'bg-white',
      'rounded-2xl',
      'shadow-xl',
      'overflow-hidden'
    )
  })
})
