import { useState, useRef, useEffect } from 'react'
import type { Role } from '../../types'

interface TopNavProps {
  role: Role
  isDark: boolean
  onRoleChange: (role: Role) => void
  onToggleTheme: () => void
}

export function TopNav({ role, isDark, onRoleChange, onToggleTheme }: TopNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const roles: { value: Role; label: string; icon: string; desc: string }[] = [
    { value: 'admin', label: 'Admin', icon: 'shield', desc: 'Full access' },
    { value: 'viewer', label: 'Viewer', icon: 'visibility', desc: 'View only' },
  ]

  const currentRole = roles.find((r) => r.value === role)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3 backdrop-blur-md max-md:animate-slide-down">
      <div className="flex items-center gap-7">
        <span className="font-headline text-2xl font-extrabold tracking-tight text-[var(--color-primary)]">FinanceIQ</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            className="hidden items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 transition-all hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 md:flex"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
              <span className="material-symbols-outlined text-lg">{currentRole?.icon}</span>
            </span>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">Role</span>
              <span className="text-sm font-bold text-[var(--text-primary)]">{currentRole?.label}</span>
            </div>
            <span className={`material-symbols-outlined text-xl text-[var(--text-secondary)] transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          <div className={`absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-xl shadow-[var(--color-primary)]/20 transition-all duration-300 ${dropdownOpen ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0'}`}>
            {roles.map((r) => (
              <button
                key={r.value}
                className={`flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-[var(--color-primary)]/10 ${role === r.value ? 'bg-[var(--color-primary)]/10' : ''}`}
                onClick={() => {
                  onRoleChange(r.value)
                  setDropdownOpen(false)
                }}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-surface-2)] text-[var(--text-secondary)] transition-all ${role === r.value ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white' : ''}`}>
                  <span className="material-symbols-outlined text-lg">{r.icon}</span>
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text-primary)]">{r.label}</span>
                  <span className="text-xs text-[var(--text-secondary)]">{r.desc}</span>
                </div>
                {role === r.value && (
                  <span className="material-symbols-outlined text-lg text-[var(--color-primary)] ml-auto">
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 active:scale-95"
          onClick={onToggleTheme}
        >
          <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>

        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 active:scale-95">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  )
}
