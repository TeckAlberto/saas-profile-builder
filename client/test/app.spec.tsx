import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import App from '../src/App'

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />)
    const appElement = screen.getByTestId('app-root')
    expect(appElement).toBeTruthy()
  })
})
