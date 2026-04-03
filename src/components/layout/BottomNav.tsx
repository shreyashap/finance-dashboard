import type { Role } from '../../types'

interface BottomNavProps {
  role: Role
  onRoleChange: (role: Role) => void
}

export function BottomNav({ role: _role, onRoleChange: _onRoleChange }: BottomNavProps) {
  const bottomNavItems = [
    { icon: 'home', label: 'Home', href: '#', active: true },
    { icon: 'account_balance_wallet', label: 'Activity', href: '#' },
    { icon: 'query_stats', label: 'Analysis', href: '#' },
    { icon: 'menu', label: 'Menu', href: '#' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 gap-1 border-t border-[var(--border-default)] bg-[var(--bg-surface)]/90 px-2 pb-[1.4rem] pt-2 backdrop-blur-xl shadow-[0_-10px_28px_var(--color-primary)/10] md:hidden">
      {bottomNavItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition-all hover:-translate-y-1 ${item.active ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]'}`}
        >
          <span className="material-symbols-outlined text-xl">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
