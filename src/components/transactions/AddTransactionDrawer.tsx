import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Category, TransactionType } from '../../types'

const categories: Category[] = ['Salary', 'Freelance', 'Rent', 'Food', 'Transport', 'Health', 'Entertainment', 'Shopping', 'Utilities']

interface TransactionFormData {
  date: string
  amount: string
  category: string
  type: TransactionType
  description: string
}

interface AddTransactionDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => void
}

export function AddTransactionDrawer({ isOpen, onClose, onSubmit }: AddTransactionDrawerProps) {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)] rounded-t-[32px] shadow-2xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-[var(--border-default)] rounded-full" />
        </div>
        
        <div className="px-6 pb-28 pt-2 overflow-y-auto max-h-[calc(90vh-40px)]">
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
    </motion.div>
  )
}
