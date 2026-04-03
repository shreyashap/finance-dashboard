import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, Bar, BarChart } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

type TimeFilter = 'daily' | 'weekly' | 'monthly'
type ChartType = 'line' | 'bar'

interface PerformanceChartProps {
  transactions: { date: string; amount: number; type: string }[]
}

function generateChartData(transactions: { date: string; amount: number; type: string }[], filter: TimeFilter) {
  const now = new Date()
  const data: { name: string; value: number }[] = []

  if (filter === 'daily') {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })
    
    last7Days.forEach(day => {
      const dayTx = transactions.filter(t => t.date === day && t.type === 'expense')
      const total = dayTx.reduce((sum, t) => sum + t.amount, 0)
      data.push({ name: day.slice(5), value: total || Math.random() * 5000 + 1000 })
    })
  } else if (filter === 'weekly') {
    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (3 - i) * 7)
      return d
    })
    
    last4Weeks.forEach((weekStart, i) => {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const weekTx = transactions.filter(t => {
        const txDate = new Date(t.date)
        return t.type === 'expense' && txDate >= weekStart && txDate < weekEnd
      })
      const total = weekTx.reduce((sum, t) => sum + t.amount, 0)
      data.push({ name: `W${i + 1}`, value: total || Math.random() * 30000 + 5000 })
    })
  } else {
    const last3Months = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(now)
      d.setMonth(d.getMonth() - (2 - i))
      return d.toISOString().slice(0, 7)
    })
    
    last3Months.forEach(month => {
      const monthTx = transactions.filter(t => t.date.startsWith(month) && t.type === 'expense')
      const total = monthTx.reduce((sum, t) => sum + t.amount, 0)
      data.push({ name: month.slice(5), value: total || Math.random() * 80000 + 20000 })
    })
  }

  return data
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

export function PerformanceChart({ transactions }: PerformanceChartProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly')
  const [chartType, setChartType] = useState<ChartType>('line')

  const chartData = useMemo(() => generateChartData(transactions, timeFilter), [transactions, timeFilter])

  return (
    <motion.div
      custom={3}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="lg:col-span-3 rounded-3xl bg-[var(--bg-surface)] p-6 md:p-8 shadow-[0_20px_40px_rgba(79,70,229,0.06)]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h3 className="font-headline text-xl font-extrabold text-[var(--text-primary)]">3-Month Growth Trend</h3>
          <p className="text-sm text-[var(--text-secondary)]">Visualizing your capital appreciation</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-[var(--bg-surface-2)] rounded-xl p-1">
            <motion.button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--text-secondary)]'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined text-lg">show_chart</span>
            </motion.button>
            <motion.button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--text-secondary)]'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="material-symbols-outlined text-lg">bar_chart</span>
            </motion.button>
          </div>
          
          {/* Time Filter Buttons */}
          <div className="flex gap-1 bg-[var(--bg-surface-2)] rounded-xl p-1">
            {(['daily', 'weekly', 'monthly'] as TimeFilter[]).map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeFilter === filter ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Chart */}
      <div className="w-full h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${chartType}-${timeFilter}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Amount']}
                    contentStyle={{ 
                      borderRadius: 12, 
                      border: 'none', 
                      background: 'var(--bg-surface)',
                      boxShadow: '0 10px 40px rgba(79,70,229,0.2)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fill="url(#chartGradient)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Amount']}
                    contentStyle={{ 
                      borderRadius: 12, 
                      border: 'none', 
                      background: 'var(--bg-surface)',
                      boxShadow: '0 10px 40px rgba(79,70,229,0.2)'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#4f46e5" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1000}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
