import { useMemo } from 'react'
import { useTransactionContext } from '../../context/TransactionContext'
import { SummaryCards, RecentActivity, PerformanceChart, CategoryChart, QuickActions, InsightCard } from './index'

const spendingCategories = [
  { name: 'Rent', percent: 45, color: '#4f46e5' },
  { name: 'Shopping', percent: 20, color: '#818cf8' },
  { name: 'Food', percent: 15, color: '#f59e0b' },
  { name: 'Other', percent: 20, color: '#9ca3af' }
]

export function Dashboard() {
  const { state } = useTransactionContext()
  const transactions = state.transactions

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    return { income, expenses, balance: income - expenses }
  }, [transactions])

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
      <SummaryCards 
        balance={summary.balance} 
        income={summary.income} 
        expenses={summary.expenses} 
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <PerformanceChart transactions={transactions} />
        
        <CategoryChart categories={spendingCategories} />
        
        <QuickActions />
        
        <RecentActivity transactions={transactions} />
      </section>

      <InsightCard />
    </main>
  )
}
