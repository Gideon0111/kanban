import { createContext, useContext } from 'react'
import useLocalTheme from '../hooks/useLocalTheme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { theme, toggleTheme } = useLocalTheme()

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside a ThemeProvider')
  }

  return context
}