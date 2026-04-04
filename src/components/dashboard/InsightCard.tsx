import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTransactionContext } from '../../context/TransactionContext'
import { formatCurrency } from '../../utils/formatters'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

export function InsightCard() {
  const { state } = useTransactionContext()
  const transactions = state.transactions

  const insights = useMemo(() => {
    if (transactions.length === 0) return null

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const lastMonthTx = transactions.filter(t => {
      const d = new Date(t.date)
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
    })

    const thisMonthIncome = thisMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const thisMonthExpenses = thisMonthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const lastMonthIncome = lastMonthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

    const categorySpending: Record<string, number> = {}
    thisMonthTx.filter(t => t.type === 'expense').forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
    })

    const highestCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0]
    const savingsRate = thisMonthIncome > 0 ? ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100 : 0
    const incomeChange = lastMonthIncome > 0 ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0

    return {
      highestCategory: highestCategory ? highestCategory[0] : null,
      highestAmount: highestCategory ? highestCategory[1] : 0,
      savingsRate: savingsRate.toFixed(1),
      incomeChange: incomeChange.toFixed(1),
      thisMonthIncome,
      thisMonthExpenses,
    }
  }, [transactions])

  if (!insights || transactions.length === 0) {
    return (
      <motion.section
        custom={7}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full"
      >
        <motion.div 
          className="rounded-2xl bg-[var(--color-tertiary)]/10 border border-[var(--color-tertiary)]/20 p-4 flex items-start gap-3 shadow-[0_20px_40px_rgba(79,70,229,0.06)]"
        >
          <motion.span 
            className="material-symbols-outlined text-[var(--color-tertiary)] mt-0.5" 
            style={{ fontVariationSettings: 'FILL 1' }}
          >
            lightbulb
          </motion.span>
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">FinanceIQ Insight</h4>
            <p className="text-xs mt-1 leading-relaxed text-[var(--text-secondary)]">
              Add some transactions to see personalized insights about your spending patterns.
            </p>
          </div>
        </motion.div>
      </motion.section>
    )
  }

  return (
    <motion.section
      custom={7}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="w-full"
    >
      <motion.div 
        className="rounded-2xl bg-[var(--color-tertiary)]/10 border border-[var(--color-tertiary)]/20 p-4 flex items-start gap-3 shadow-[0_20px_40px_rgba(79,70,229,0.06)] cursor-pointer"
        whileHover={{ scale: 1.01 }}
      >
        <motion.span 
          className="material-symbols-outlined text-[var(--color-tertiary)] mt-0.5" 
          style={{ fontVariationSettings: 'FILL 1' }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          lightbulb
        </motion.span>
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">FinanceIQ Insight</h4>
          <p className="text-xs mt-1 leading-relaxed text-[var(--text-secondary)]">
            {insights.highestCategory && (
              <>Your highest spending this month is <span className="font-bold text-[var(--color-tertiary)]">{insights.highestCategory}</span> ({formatCurrency(insights.highestAmount)}). </>
            )}
            {parseFloat(insights.savingsRate) > 0 ? (
              <>You've saved <span className="font-bold text-green-600">{insights.savingsRate}%</span> of your income this month.</>
            ) : (
              <>Consider reducing expenses to improve your savings rate.</>
            )}
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
