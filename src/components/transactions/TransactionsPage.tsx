import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTransactionContext } from '../../context/TransactionContext'
import { TransactionFilters } from './TransactionFilters'
import { TransactionTable } from './TransactionTable'
import { AddTransactionModal } from './AddTransactionModal'
import { AddTransactionDrawer } from './AddTransactionDrawer'
import type { Category, TransactionType } from '../../types'

interface TransactionFormData {
  date: string
  amount: string
  category: string
  type: TransactionType
  description: string
}

export function TransactionsPage() {
  const { state, dispatch } = useTransactionContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | TransactionType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter(tx => {
        if (activeFilter !== 'all' && tx.type !== activeFilter) return false
        if (debouncedQuery && !tx.description.toLowerCase().includes(debouncedQuery.toLowerCase()) && 
            !tx.category.toLowerCase().includes(debouncedQuery.toLowerCase())) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [state.transactions, activeFilter, debouncedQuery])

  const handleAddTransaction = (data: TransactionFormData) => {
    if (!data.category) return
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        id: `${data.date}-${Date.now()}`,
        date: data.date,
        amount: parseFloat(data.amount),
        category: data.category as Category,
        type: data.type,
        description: data.description
      }
    })
  }

  const openAddForm = () => {
    if (window.innerWidth >= 768) {
      setIsModalOpen(true)
    } else {
      setIsDrawerOpen(true)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8 space-y-6 pb-32 md:pb-8">
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
      
      <AddTransactionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddTransaction}
      />

      <TransactionFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <TransactionTable transactions={filteredTransactions} />

      <div className="md:hidden space-y-6">
        {filteredTransactions.slice(0, 10).map((tx, i) => (
          <MobileTransactionItem key={tx.id} tx={tx} index={i} />
        ))}
      </div>

      <motion.button
        onClick={openAddForm}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 right-6 w-16 h-16 bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--color-primary)]/40 z-40 md:bottom-8 md:pb-0"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </motion.button>
    </main>
  )
}

function MobileTransactionItem({ tx, index }: { tx: any; index: number }) {
  const getCategoryIcon = (category: string, type: TransactionType) => {
    if (type === 'income') return 'payments'
    switch (category) {
      case 'Food': return 'restaurant'
      case 'Shopping': return 'shopping_bag'
      case 'Transport': return 'directions_car'
      case 'Utilities': return 'bolt'
      case 'Health': return 'favorite'
      case 'Entertainment': return 'movie'
      case 'Rent': return 'home'
      case 'Salary': return 'work'
      case 'Freelance': return 'laptop_mac'
      default: return 'receipt'
    }
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-[var(--bg-surface)] p-4 rounded-2xl flex items-center justify-between shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100' : 'bg-[var(--color-primary)]/10'}`}>
          <span className={`material-symbols-outlined ${tx.type === 'income' ? 'text-green-600' : 'text-[var(--color-primary)]'}`}>
            {getCategoryIcon(tx.category, tx.type)}
          </span>
        </div>
        <div>
          <p className="font-bold text-[var(--text-primary)]">{tx.description}</p>
          <p className="text-xs text-[var(--text-secondary)]">{tx.category} • {tx.date}</p>
        </div>
      </div>
      <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-[var(--color-secondary)]' : 'text-red-500'}`}>
        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
      </p>
    </motion.div>
  )
}
