import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatters'

interface SummaryCardProps {
  balance: number
  income: number
  expenses: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

export function SummaryCards({ balance, income, expenses }: SummaryCardProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Total Balance Card - Glass Morphic */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] p-6 text-white shadow-[0_20px_40px_rgba(79,70,229,0.25)] cursor-pointer"
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl transition-all duration-500 hover:scale-110" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">Total Balance</span>
            <motion.div 
              className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-[10px] font-bold backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +12%
            </motion.div>
          </div>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-2">{formatCurrency(balance)}</h2>
          <p className="text-sm font-medium text-white/70">vs. last month: +{formatCurrency(48200)}</p>
        </div>
      </motion.div>

      {/* Income Card */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ y: -4, boxShadow: '0 25px_50px_rgba(79,70,229,0.15)' }}
        className="rounded-xl border-l-4 border-[var(--color-secondary)] bg-[var(--bg-surface)] p-6 shadow-[0_20px_40px_rgba(79,70,229,0.06)] transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Total Income</span>
          <motion.div 
            className="flex items-center gap-1 rounded-lg bg-[var(--color-secondary)]/10 px-2 py-1 text-[10px] font-bold text-[var(--color-secondary)]"
            whileHover={{ scale: 1.05 }}
          >
            <span className="material-symbols-outlined text-xs">arrow_upward</span>
            +8%
          </motion.div>
        </div>
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">{formatCurrency(income)}</h2>
        <p className="text-sm font-medium text-[var(--text-secondary)]">Earned this quarter</p>
      </motion.div>

      {/* Expenses Card */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ y: -4, boxShadow: '0 25px_50px_rgba(79,70,229,0.15)' }}
        className="rounded-xl border-l-4 border-red-500 bg-[var(--bg-surface)] p-6 shadow-[0_20px_40px_rgba(79,70,229,0.06)] transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Total Expenses</span>
          <motion.div 
            className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400"
            whileHover={{ scale: 1.05 }}
          >
            <span className="material-symbols-outlined text-xs">arrow_downward</span>
            -5%
          </motion.div>
        </div>
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">{formatCurrency(expenses)}</h2>
        <p className="text-sm font-medium text-[var(--text-secondary)]">Saved ₹6,500 vs Budget</p>
      </motion.div>
    </section>
  )
}
