import { useMemo, useState } from 'react'
import { useTransactionContext } from '../../context/TransactionContext'
import { formatCurrency } from '../../utils/formatters'

type TimeFilter = '30days' | 'quarterly' | 'yearly'

function InsightsPage() {
  const { state } = useTransactionContext()
  const transactions = state.transactions
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30days')

  const filteredTransactions = useMemo(() => {
    if (transactions.length === 0) return []

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    return transactions.filter(t => {
      const txDate = new Date(t.date)

      if (timeFilter === '30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return txDate >= thirtyDaysAgo
      } else if (timeFilter === 'quarterly') {
        const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1)
        return txDate >= quarterStart
      } else {
        // yearly
        const yearStart = new Date(currentYear, 0, 1)
        return txDate >= yearStart
      }
    })
  }, [transactions, timeFilter])

  const stats = useMemo(() => {
    const tx = filteredTransactions

    if (tx.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        avgDailySpend: 0,
        savingsRate: 0,
        highestCategory: null,
        highestAmount: 0,
        highestPercent: 0,
        weeklyData: [],
      }
    }

    const totalIncome = tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const totalExpenses = tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    const uniqueDates = [...new Set(tx.map(t => t.date))].length
    const avgDailySpend = uniqueDates > 0 ? totalExpenses / uniqueDates : 0

    const categorySpending: Record<string, number> = {}
    tx.filter(t => t.type === 'expense').forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
    })

    const totalSpend = Object.values(categorySpending).reduce((s, v) => s + v, 0)
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])
    const highestCategory = sortedCategories[0]?.[0] || null
    const highestAmount = sortedCategories[0]?.[1] || 0
    const highestPercent = totalSpend > 0 ? Math.round((highestAmount / totalSpend) * 100) : 0

    const getDayOfWeek = (dateStr: string) => new Date(dateStr).getDay()
    const weeklySpending: number[] = [0, 0, 0, 0, 0, 0, 0]
    tx.filter(t => t.type === 'expense').forEach(t => {
      weeklySpending[getDayOfWeek(t.date)] += t.amount
    })
    const maxWeekly = Math.max(...weeklySpending, 1)
    const weeklyData = weeklySpending.map((v, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      amount: v,
      height: (v / maxWeekly) * 100,
    }))

    return {
      totalIncome,
      totalExpenses,
      avgDailySpend,
      savingsRate,
      highestCategory,
      highestAmount,
      highestPercent,
      weeklyData,
    }
  }, [filteredTransactions])

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8 space-y-6 pb-32 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-[0.2em] mb-1">Financial Intelligence</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">Monthly Insights</h2>
        </div>
        <div className="flex items-center gap-3 bg-[var(--bg-surface-2)] p-1.5 rounded-2xl">
          <button 
            onClick={() => setTimeFilter('30days')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${timeFilter === '30days' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--color-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)]'}`}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => setTimeFilter('quarterly')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${timeFilter === 'quarterly' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--color-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)]'}`}
          >
            Quarterly
          </button>
          <button 
            onClick={() => setTimeFilter('yearly')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${timeFilter === 'yearly' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--color-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--color-primary)]'}`}
          >
            Yearly
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 bg-gradient-to-br from-[var(--color-primary)] to-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-[0px_20px_40px_rgba(53,37,205,0.12)]">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: 'FILL 1' }}>home</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">Top Category</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-5xl font-extrabold tracking-tighter">{stats.highestCategory || 'N/A'}</h3>
              <p className="text-indigo-100 text-lg opacity-90">{stats.highestPercent || 0}% of total spend</p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-xl font-bold">{formatCurrency(stats.highestAmount)}</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 top-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl"></div>
        </div>

        <div className="md:col-span-8 bg-[var(--bg-surface)] rounded-[2rem] p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Income vs Expenses</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></span>
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[var(--border-default)]"></span>
                <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-around gap-4 px-4">
            {stats.weeklyData.length > 0 ? stats.weeklyData.map((day, i) => (
              <div key={i} className="flex flex-col items-center flex-1 max-w-[80px]">
                <div className="w-full flex justify-center items-end gap-1.5 h-48">
                  <div className="w-1/2 bg-[var(--color-primary)] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${Math.max(day.height, 5)}%` }}></div>
                  <div className="w-1/2 bg-[var(--border-default)] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${Math.max(day.height * 0.7, 3)}%` }}></div>
                </div>
                <p className="mt-4 text-xs font-bold text-[var(--text-secondary)] uppercase">{day.day}</p>
              </div>
            )) : (
              <>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="flex flex-col items-center flex-1 max-w-[80px]">
                    <div className="w-full flex justify-center items-end gap-1.5 h-48">
                      <div className="w-1/2 bg-[var(--color-primary)] rounded-t-lg" style={{ height: '20%' }}></div>
                      <div className="w-1/2 bg-[var(--border-default)] rounded-t-lg" style={{ height: '15%' }}></div>
                    </div>
                    <p className="mt-4 text-xs font-bold text-[var(--text-secondary)] uppercase">{day}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="md:col-span-4 bg-[var(--bg-surface-2)] rounded-[2rem] p-6 flex flex-col justify-between group hover:bg-[var(--bg-surface)] transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center mb-4 text-[var(--color-primary)] shadow-sm">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Avg Daily Spend</p>
            <h4 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">{formatCurrency(stats.avgDailySpend)}</h4>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span className="flex items-center text-[var(--color-secondary)] text-xs font-bold bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded-lg">
              <span className="material-symbols-outlined text-sm mr-1">trending_down</span>
              4.2%
            </span>
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">vs last month</span>
          </div>
        </div>

        <div className="md:col-span-4 bg-[var(--bg-surface-2)] rounded-[2rem] p-6 flex flex-col justify-between group hover:bg-[var(--bg-surface)] transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center mb-4 text-[var(--color-primary)] shadow-sm">
              <span className="material-symbols-outlined">savings</span>
            </div>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Savings Rate</p>
            <h4 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">{stats.savingsRate.toFixed(1)}%</h4>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <span className="flex items-center text-[var(--color-secondary)] text-xs font-bold bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded-lg">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              1.8%
            </span>
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">above target</span>
          </div>
        </div>

        <div className="md:col-span-4 bg-[var(--bg-surface-2)] rounded-[2rem] p-6 flex flex-col justify-between group hover:bg-[var(--bg-surface)] transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] flex items-center justify-center mb-4 text-[var(--color-primary)] shadow-sm">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1">Biggest Expense</p>
            <h4 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">{formatCurrency(stats.highestAmount)}</h4>
          </div>
          <div className="mt-6">
            <span className="text-xs font-bold bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] px-3 py-1 rounded-full border border-[var(--color-tertiary)]/20">
              {stats.highestCategory || 'N/A'}
            </span>
          </div>
        </div>

        <div className="md:col-span-12 bg-[var(--bg-surface)] rounded-[2rem] p-8 shadow-sm border border-[var(--border-default)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Financial Health Momentum</h3>
              <p className="text-sm text-[var(--text-secondary)]">Comparing this month vs last month performance</p>
            </div>
            <div className="p-2 bg-[var(--color-primary)]/10 rounded-xl text-[var(--color-primary)]">
              <span className="material-symbols-outlined">compare_arrows</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">Net Worth</span>
                <span className="text-[var(--color-secondary)] font-bold text-sm">+2.4%</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--color-secondary)] h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">Your net worth is trending upward due to consistent investment contributions and debt reduction.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">Lifestyle Spend</span>
                <span className="text-red-500 font-bold text-sm">+12%</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">Holiday spending has increased your discretionary budget. Consider adjusting for the next 30 days.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">Fixed Costs</span>
                <span className="text-[var(--text-secondary)] font-bold text-sm">0%</span>
              </div>
              <div className="w-full bg-[var(--bg-surface-2)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--color-primary)] h-full rounded-full" style={{ width: '50%' }}></div>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">Stable core expenses. No major subscription changes or rent adjustments detected this month.</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-12 mt-8">
          <div className="bg-[var(--color-tertiary)] text-white px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm border border-[var(--color-tertiary)]/20 w-full">
            <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center text-[var(--color-tertiary)]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: 'FILL 1' }}>auto_awesome</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">AI Insights: Spending is up 5% in 'Dining Out' compared to your 6-month average.</p>
              <p className="text-[11px] opacity-80 font-medium">Suggestion: Cook at home 2 more times per week to save $120/mo.</p>
            </div>
            <button className="ml-auto text-xs font-extrabold uppercase tracking-widest text-white hover:underline">Apply</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export { InsightsPage }
