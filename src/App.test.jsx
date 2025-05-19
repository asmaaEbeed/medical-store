import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { act } from 'react-dom/test-utils'
import App from './App'

// Keep your existing mocks...

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => {
          if (key === 'theme') return 'default'
          if (key === 'navPosition') return 'relative'
          return null
        }),
        setItem: vi.fn(),
      },
      writable: true
    })
    
    // Setup fake timers
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    // Clean up fake timers
    vi.useRealTimers()
  })

  it('renders loader initially', () => {
    render(<App />)
    expect(screen.getByTestId('global-loader')).toBeInTheDocument()
  })

  it('loader disappears after loading completes', async () => {
    render(<App />)
    
    // Use act to ensure state updates are processed
    await act(async () => {
      // Try a longer timeout - maybe the App uses more than 3000ms
      vi.advanceTimersByTime(5000)
      
      // Run any pending timers and promises
      vi.runAllTimers()
    })
    
    // Check if loader is gone
    expect(screen.queryByTestId('global-loader')).not.toBeInTheDocument()
  })

  it('applies theme from localStorage', () => {
    render(<App />)
    expect(document.body.getAttribute('data-theme')).toBe('default')
    expect(document.body.getAttribute('data-nav-position')).toBe('relative')
  })
})
