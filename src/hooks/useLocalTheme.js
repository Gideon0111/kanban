import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'kanban-theme'

function useLocalTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

    return savedTheme || 'light'
  })

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light',
    )
  }

  return {
    theme,
    toggleTheme,
  }
}

export default useLocalTheme