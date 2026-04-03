import { SectionPlaceholder } from './components/common/SectionPlaceholder'
import { BottomNav } from './components/layout/BottomNav'
import { TopNav } from './components/layout/TopNav'
import { useRole } from './hooks/useRole'
import { useTheme } from './hooks/useTheme'

function App() {
  const { role, setRole } = useRole()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <TopNav role={role} isDark={isDark} onRoleChange={setRole} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-7xl px-5 py-10">
        <SectionPlaceholder
          title='Section 1 Complete'
          description='Navbar and mobile footer navigation are ready. Next task can add summary cards.'
        />
      </main>

      <BottomNav role={role} onRoleChange={setRole} />
    </div>
  )
}

export default App
