import { useState } from 'react'
import { BottomNav } from './components/layout/BottomNav'
import { TopNav } from './components/layout/TopNav'
import { Dashboard } from './components/dashboard/Dashboard'
import { TransactionsPage } from './components/transactions'
import { InsightsPage } from './components/insights'
import { useRole } from './hooks/useRole'
import { useTheme } from './hooks/useTheme'

type Page = 'dashboard' | 'transactions' | 'insights'

function App() {
  const { role, setRole } = useRole()
  const { isDark, toggleTheme } = useTheme()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

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
      
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'transactions' && <TransactionsPage />}
      {currentPage === 'insights' && <InsightsPage />}
      
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
