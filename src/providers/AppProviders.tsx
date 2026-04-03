import type { PropsWithChildren } from 'react'
import { RoleProvider } from '../context/RoleContext'
import { ThemeProvider } from '../context/ThemeContext'
import { TransactionProvider } from '../context/TransactionContext'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <RoleProvider>
        <TransactionProvider>{children}</TransactionProvider>
      </RoleProvider>
    </ThemeProvider>
  )
}
