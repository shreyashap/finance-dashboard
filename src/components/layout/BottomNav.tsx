import type { Role } from '../../types'

interface BottomNavProps {
  role: Role
  onRoleChange: (role: Role) => void
}

export function BottomNav({ role, onRoleChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 gap-1 border-t border-[var(--border-default)] bg-[var(--bg-surface)]/90 px-2 pb-[1.4rem] pt-2 backdrop-blur-xl shadow-[0_-10px_28px_var(--color-primary)/10] max-md:animate-slide-up md:hidden">
      <a className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[var(--color-primary)]/10 px-2 py-2 text-[var(--color-primary)] transition-all hover:-translate-y-0.5" href="#">
        <span className="material-symbols-outlined text-xl">home</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
      </a>
      <a className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[var(--text-secondary)] transition-all hover:-translate-y-0.5 hover:bg-[var(--bg-surface-2)]" href="#">
        <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Activity</span>
      </a>
      <a className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[var(--text-secondary)] transition-all hover:-translate-y-0.5 hover:bg-[var(--bg-surface-2)]" href="#">
        <span className="material-symbols-outlined text-xl">query_stats</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Analysis</span>
      </a>
      <div className="flex items-center gap-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 py-2 text-sm font-bold">
        <span className="material-symbols-outlined text-lg text-[var(--color-primary)]">admin_panel_settings</span>
        <select
          className="cursor-pointer border-none bg-transparent text-sm font-bold text-[var(--text-primary)] focus:outline-none"
          value={role}
          onChange={(e) => onRoleChange(e.target.value as Role)}
        >
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
    </nav>
  )
}
