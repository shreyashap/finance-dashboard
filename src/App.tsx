import { useState } from 'react'
import { BottomNav } from './components/layout/BottomNav'
import { TopNav } from './components/layout/TopNav'
import { Dashboard } from './components/dashboard/Dashboard'
import { TransactionsPage } from './components/transactions'
import { useRole } from './hooks/useRole'
import { useTheme } from './hooks/useTheme'

type Page = 'dashboard' | 'transactions'

function App() {
  const { role, setRole } = useRole()
  const { isDark, toggleTheme } = useTheme()
  const [currentPage, setCurrentPage] = useState<Page>('transactions')

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <TopNav 
        role={role} 
        isDark={isDark} 
        onRoleChange={setRole} 
        onToggleTheme={toggleTheme}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {currentPage === 'dashboard' ? <Dashboard /> : <TransactionsPage />}
      
      <BottomNav 
        role={role} 
        onRoleChange={setRole}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
    </div>
  )
}

export default App
