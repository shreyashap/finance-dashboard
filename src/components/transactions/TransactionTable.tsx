import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatters'
import type { Transaction, TransactionType } from '../../types'

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

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
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
          {transactions.slice(0, 10).map((tx, i) => (
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
        <p className="text-xs font-medium text-[var(--text-secondary)]">Showing 1 to {Math.min(10, transactions.length)} of {transactions.length} transactions</p>
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
  )
}
