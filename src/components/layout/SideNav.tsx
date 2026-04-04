import { motion } from 'framer-motion'
import type { Role } from '../../types'

interface SideNavProps {
  role: Role
  currentPage?: string
  onNavigate?: (page: 'dashboard' | 'transactions' | 'insights') => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'transactions', label: 'Transactions', icon: 'receipt_long' },
  { id: 'insights', label: 'Insights', icon: 'insights' },
]

export function SideNav({ role, currentPage, onNavigate }: SideNavProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-[var(--border-default)] bg-[var(--bg-surface-2)] z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>account_balance_wallet</span>
          </div>
          <div>
            <h1 className="font-headline text-xl font-extrabold text-[var(--color-primary)] tracking-tight">FinanceIQ</h1>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold">The Intelligent Ledger</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id as 'dashboard' | 'transactions' | 'insights')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                currentPage === item.id
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-headline text-base">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[var(--border-default)]">
        {role === 'admin' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate?.('transactions')}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-[var(--color-primary)]/20 mb-4"
          >
            Add Transaction
          </motion.button>
        )}

        <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)] text-sm">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--color-primary)] text-sm">
          <span className="material-symbols-outlined">help</span>
          <span>Support</span>
        </button>
      </div>
    </aside>
  )
}
