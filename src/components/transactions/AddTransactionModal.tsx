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

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => void
}

export function AddTransactionModal({ isOpen, onClose, onSubmit }: AddTransactionModalProps) {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95, y: isOpen ? 0 : 20 }}
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
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
  )
}
