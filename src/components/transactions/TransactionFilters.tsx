import { motion } from 'framer-motion'
import type { TransactionType, Transaction } from '../../types'

const typeFilters = ['all', 'income', 'expense'] as const

interface TransactionFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter: 'all' | TransactionType
  onFilterChange: (filter: 'all' | TransactionType) => void
  transactions?: Transaction[]
}

function exportToCSV(transactions: Transaction[], filename: string = 'transactions') {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
  const rows = transactions.map(tx => [
    tx.date,
    `"${tx.description.replace(/"/g, '""')}"`,
    tx.category,
    tx.type,
    tx.type === 'expense' ? -tx.amount : tx.amount
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' })
  const reader = new FileReader()
  reader.onload = function() {
    const link = document.createElement('a')
    link.href = reader.result as string
    link.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  reader.readAsDataURL(blob)
}

function exportToJSON(transactions: Transaction[], filename: string = 'transactions') {
  const data = transactions.map(tx => ({
    ...tx,
    signedAmount: tx.type === 'expense' ? -tx.amount : tx.amount
  }))

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const reader = new FileReader()
  reader.onload = function() {
    const link = document.createElement('a')
    link.href = reader.result as string
    link.setAttribute('download', `${filename}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  reader.readAsDataURL(blob)
}

export function TransactionFilters({ searchQuery, onSearchChange, activeFilter, onFilterChange, transactions }: TransactionFiltersProps) {
  const handleExport = (type: 'csv' | 'json') => {
    if (!transactions || transactions.length === 0) return
    
    const timestamp = new Date().toISOString().split('T')[0]
    
    if (type === 'csv') {
      exportToCSV(transactions, `transactions-${timestamp}`)
    } else {
      exportToJSON(transactions, `transactions-${timestamp}`)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] font-headline">Transactions</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your financial records</p>
        </div>
        
        <div className="flex items-center gap-2">
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
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport('csv')}
            className="p-2 bg-[var(--bg-surface-2)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            title="Export CSV"
          >
            <span className="material-symbols-outlined">download</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport('json')}
            className="p-2 bg-[var(--bg-surface-2)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            title="Export JSON"
          >
            <span className="material-symbols-outlined">code</span>
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
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
