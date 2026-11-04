import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store/slices/authSlice'

const ThemeContext = createContext({
  theme: 'dark',
  setThemeLocal: () => {},
})

const THEME_KEY = 'nexora_theme'

export function ThemeProvider({ children }) {
  const { user } = useSelector(selectAuth)
  const [theme, setThemeLocal] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark'
  })

  useEffect(() => {
    if (user?.settings?.theme) {
      setThemeLocal(user.settings.theme)
    }
  }, [user?.settings?.theme])

  useEffect(() => {
    const next = theme === 'light' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(THEME_KEY, next)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setThemeLocal,
      isLight: theme === 'light',
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
