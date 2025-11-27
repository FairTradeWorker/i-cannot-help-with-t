import { useState, useEffect } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

// Safe localStorage access helper
const getStoredTheme = (): string | null => {
  try {
    return localStorage.getItem('theme')
  } catch {
    return null
  }
}

const setStoredTheme = (theme: string): void => {
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // localStorage unavailable (SSR, private browsing, etc.)
  }
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = getStoredTheme()
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = (stored as 'light' | 'dark') || (prefersDark ? 'dark' : 'light')
    
    setThemeState(initialTheme)
    applyTheme(initialTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!getStoredTheme()) {
        const newTheme = e.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        applyTheme(newTheme)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-appearance', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-appearance', 'light')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
    setStoredTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="relative hover:bg-accent/20 dark:hover:bg-accent/30 transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400" weight="fill" />
      ) : (
        <Moon className="w-5 h-5 text-primary" weight="fill" />
      )}
    </Button>
  )
}
