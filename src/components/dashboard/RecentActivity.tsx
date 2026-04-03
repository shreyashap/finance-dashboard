import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatters'
import type { Transaction } from '../../types'

interface RecentActivityProps {
  transactions: Transaction[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

function getCategoryIcon(tx: Transaction) {
  if (tx.type === 'income') return 'account_balance_wallet'
  if (tx.category === 'Food') return 'restaurant'
  if (tx.category === 'Shopping') return 'shopping_bag'
  return 'receipt'
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [transactions])

  return (
    <motion.div
      custom={6}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="lg:col-span-2 rounded-3xl bg-[var(--bg-surface)] p-6 md:p-8 shadow-[0_20px_40px_rgba(79,70,229,0.06)] overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-xl font-extrabold text-[var(--text-primary)]">Recent activity</h3>
        <motion.button 
          className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-wide hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View all
        </motion.button>
      </div>

      {/* Desktop Table / Mobile List */}
      <div className="hidden md:block overflow-hidden rounded-xl">
        {/* Table Header */}
        <div className="grid grid-cols-4 px-4 py-3 bg-[var(--bg-surface-2)] rounded-t-xl">
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Date</span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Description</span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Category</span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest text-right">Amount</span>
        </div>
        {/* Rows */}
        {recentTransactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            whileHover={{ backgroundColor: 'var(--bg-surface-2)' }}
            className="grid grid-cols-4 px-4 py-4 transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium text-[var(--text-secondary)]">{tx.date}</span>
            <span className="text-sm font-bold text-[var(--text-primary)]">{tx.description}</span>
            <span className="px-2 py-1 bg-[var(--bg-surface-2)] rounded-lg text-[10px] font-bold text-[var(--text-secondary)] w-fit">
              {tx.category}
            </span>
            <span className={`text-sm font-bold text-right ${tx.type === 'income' ? 'text-[var(--color-secondary)]' : 'text-red-500'}`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Mobile List */}
      <div className="md:hidden space-y-0">
        {recentTransactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            className="flex items-center justify-between py-4 border-b border-[var(--border-default)]/30 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 bg-[var(--bg-surface-2)] rounded-2xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="material-symbols-outlined text-[var(--text-secondary)]">
                  {getCategoryIcon(tx)}
                </span>
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{tx.description}</p>
                <p className="text-[10px] text-[var(--text-secondary)] font-medium">{tx.category} • {tx.date}</p>
              </div>
            </div>
            <motion.span 
              className={`text-sm font-bold ${tx.type === 'income' ? 'text-[var(--color-secondary)]' : 'text-red-500'}`}
              whileHover={{ scale: 1.1 }}
            >
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
