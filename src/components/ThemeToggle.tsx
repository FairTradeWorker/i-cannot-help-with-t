import { useState, useEffect } from 'react'
import { Sun, Moon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = (stored as 'light' | 'dark') || (prefersDark ? 'dark' : 'light')
    
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="glass-hover relative"
      aria-label="Toggle dark/light mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" weight="fill" />
      ) : (
        <Moon className="w-5 h-5" weight="fill" />
      )}
    </Button>
  )
}
