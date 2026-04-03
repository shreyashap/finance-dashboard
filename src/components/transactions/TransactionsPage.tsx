import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransactionContext } from '../../context/TransactionContext'
import { formatCurrency } from '../../utils/formatters'
import type { Category, TransactionType } from '../../types'

const categories: Category[] = ['Salary', 'Freelance', 'Rent', 'Food', 'Transport', 'Health', 'Entertainment', 'Shopping', 'Utilities']

const typeFilters = ['all', 'income', 'expense'] as const

function getCategoryIcon(category: string, type: TransactionType) {
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

interface TransactionFormData {
  date: string
  amount: string
  category: string
  type: TransactionType
  description: string
}

function AddTransactionModal({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { date: string; amount: string; category: string; type: TransactionType; description: string }) => void
}) {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense',
    description: ''
  })
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({})

  const validate = () => {
    const newErrors: Partial<TransactionFormData> = {}
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount is required and must be greater than zero'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'expense',
        description: ''
      })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--bg-surface)] rounded-[32px] w-full max-w-xl overflow-hidden shadow-2xl"
            >
              <div className="px-8 pt-8 pb-6 flex justify-between items-center border-b border-[var(--border-default)]">
                <div>
                  <h3 className="text-2xl font-extrabold text-[var(--text-primary)] font-headline">New Transaction</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Add a record to your ledger manually</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full hover:bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]"
                >
                  <span className="material-symbols-outlined">close</span>
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-1">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[var(--bg-surface-2)] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[var(--color-primary)] font-medium text-[var(--text-primary)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-1">Type</label>
                    <div className="flex rounded-xl overflow-hidden border border-[var(--border-default)]">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'}`}
                      >
                        Expense
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'income' })}
                        className={`flex-1 py-3 text-sm font-bold transition-all ${formData.type === 'income' ? 'bg-[var(--color-secondary)] text-white' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'}`}
                      >
                        Income
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] font-bold">₹</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      className={`w-full bg-[var(--bg-surface-2)] border-none rounded-xl py-3 pl-8 pr-4 text-sm focus:ring-2 focus:ring-[var(--color-primary)] font-bold text-[var(--text-primary)] ${errors.amount ? 'ring-2 ring-red-500' : ''}`}
                    />
                  </div>
                  {errors.amount && <p className="text-[10px] text-red-500 font-medium px-1">{errors.amount}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className={`w-full bg-[var(--bg-surface-2)] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[var(--color-primary)] font-medium text-[var(--text-primary)] ${errors.category ? 'ring-2 ring-red-500' : ''}`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-[10px] text-red-500 font-medium px-1">{errors.category}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] px-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What was this for?"
                    rows={3}
                    className={`w-full bg-[var(--bg-surface-2)] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[var(--color-primary)] font-medium text-[var(--text-primary)] resize-none ${errors.description ? 'ring-2 ring-red-500' : ''}`}
                  />
                  {errors.description && <p className="text-[10px] text-red-500 font-medium px-1">{errors.description}</p>}
                </div>

                <div className="pt-4 flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-6 py-3.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] font-bold text-sm hover:bg-[var(--bg-surface-2)] transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-[2] bg-[var(--color-primary)] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-[var(--color-primary)]/20 hover:opacity-90 transition-all"
                  >
                    Save Transaction
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function AddTransactionDrawer({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { date: string; amount: string; category: string; type: TransactionType; description: string }) => void
}) {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    type: 'expense',
    description: ''
  })
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({})

  const validate = () => {
    const newErrors: Partial<TransactionFormData> = {}
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount is required'
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        type: 'expense',
        description: ''
      })
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-surface)] rounded-t-[32px] shadow-2xl max-h-[90vh] overflow-hidden md:hidden"
          >
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-[var(--border-default)] rounded-full" />
            </div>
            
            <div className="px-6 pb-8 pt-2 overflow-y-auto max-h-[calc(90vh-40px)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-[var(--text-primary)] font-headline">Add Transaction</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-secondary)]"
                >
                  <span className="material-symbols-outlined">close</span>
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 bg-[var(--bg-surface-2)] rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'text-[var(--text-secondary)]'}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${formData.type === 'income' ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--text-secondary)]'}`}
                  >
                    Income
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    className={`w-full bg-[var(--bg-surface-2)] border-none rounded-xl py-3 px-4 text-lg font-bold text-[var(--text-primary)] ${errors.amount ? 'ring-2 ring-red-500' : ''}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What was this for?"
                    className={`w-full bg-[var(--bg-surface-2)] border-none rounded-xl py-3 px-4 text-sm font-medium text-[var(--text-primary)] ${errors.description ? 'ring-2 ring-red-500' : ''}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${formData.category === cat ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)]'}`}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[var(--bg-surface-2)] border-none rounded-xl py-3 px-4 text-sm font-medium text-[var(--text-primary)]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] font-bold text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-[var(--color-primary)] text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg"
                  >
                    Save
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function TransactionsPage() {
  const { state, dispatch } = useTransactionContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | TransactionType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter(tx => {
        if (activeFilter !== 'all' && tx.type !== activeFilter) return false
        if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !tx.category.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [state.transactions, activeFilter, searchQuery])

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
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8 space-y-6">
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] font-headline">Transactions</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your financial records</p>
        </div>
        
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by description..."
            className="pl-10 pr-4 py-2 bg-[var(--bg-surface-2)] border-none rounded-xl text-sm w-80 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {typeFilters.map((filter) => (
          <motion.button
            key={filter}
            onClick={() => setActiveFilter(filter as 'all' | TransactionType)}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-all ${activeFilter === filter ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'}`}
          >
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </motion.button>
        ))}
      </div>

      <div className="hidden md:block bg-[var(--bg-surface)] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(79,70,229,0.06)]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--bg-surface-2)]">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Date</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Description</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Category</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] text-right">Amount</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)]">
            {filteredTransactions.slice(0, 10).map((tx, i) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-[var(--color-primary)]/5 transition-colors"
              >
                <td className="px-6 py-5">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{tx.date}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[var(--text-secondary)]">{getCategoryIcon(tx.category, tx.type)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{tx.description}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">Visa ending in 4242</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[11px] font-bold uppercase rounded-full">
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-[var(--color-secondary)]' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 text-[11px] font-bold uppercase rounded-full ${tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {tx.type}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-6 py-4 bg-[var(--bg-surface-2)] flex items-center justify-between border-t border-[var(--border-default)]">
          <p className="text-xs font-medium text-[var(--text-secondary)]">Showing 1 to {Math.min(10, filteredTransactions.length)} of {filteredTransactions.length} transactions</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all font-medium text-sm">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Transaction List */}
      <div className="md:hidden space-y-6">
        {filteredTransactions.slice(0, 10).map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
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
        ))}
      </div>

      {/* FAB */}
      <motion.button
        onClick={openAddForm}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-28 right-6 w-16 h-16 bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-[var(--color-primary)]/40 z-40 md:bottom-8"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </motion.button>
    </main>
  )
}
