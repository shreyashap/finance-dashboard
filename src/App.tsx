import { BottomNav } from './components/layout/BottomNav'
import { TopNav } from './components/layout/TopNav'
import { Dashboard } from './components/dashboard/Dashboard'
import { useRole } from './hooks/useRole'
import { useTheme } from './hooks/useTheme'

function App() {
  const { role, setRole } = useRole()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <TopNav role={role} isDark={isDark} onRoleChange={setRole} onToggleTheme={toggleTheme} />
      <Dashboard />
      <BottomNav role={role} onRoleChange={setRole} />
    </div>
  )
}

export default App
