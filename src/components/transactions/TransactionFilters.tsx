import { motion } from 'framer-motion'
import type { TransactionType } from '../../types'

const typeFilters = ['all', 'income', 'expense'] as const

interface TransactionFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter: 'all' | TransactionType
  onFilterChange: (filter: 'all' | TransactionType) => void
}

export function TransactionFilters({ searchQuery, onSearchChange, activeFilter, onFilterChange }: TransactionFiltersProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] font-headline">Transactions</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your financial records</p>
        </div>
        
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by description..."
            className="pl-10 pr-4 py-2 bg-[var(--bg-surface-2)] border-none rounded-xl text-sm w-full md:w-80 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {typeFilters.map((filter) => (
          <motion.button
            key={filter}
            onClick={() => onFilterChange(filter as 'all' | TransactionType)}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-all ${activeFilter === filter ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'}`}
          >
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </motion.button>
        ))}
      </div>
    </>
  )
}
