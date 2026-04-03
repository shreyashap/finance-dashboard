/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}

const storageKey = 'finance-dashboard-theme-v1'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialTheme() {
  return localStorage.getItem(storageKey) === 'dark'
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [isDark, setIsDark] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light')
  }, [isDark])

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((currentValue) => !currentValue),
    }),
    [isDark],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeContext must be used inside ThemeProvider')
  }

  return context
}
