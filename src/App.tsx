import './App.css'
import { usePermissions } from './hooks/usePermissions'
import { useRole } from './hooks/useRole'
import { useTheme } from './hooks/useTheme'
import { useTransactions } from './hooks/useTransactions'
import { getMonthlySummary, getTotals, getTopSpendingCategory } from './utils/analytics'
import { formatCurrency } from './utils/formatters'

function App() {
  const { role, setRole } = useRole()
  const { isDark, toggleTheme } = useTheme()
  const {
    state: { transactions },
    filteredTransactions,
  } = useTransactions()

  const permissions = usePermissions()
  const totals = getTotals(filteredTransactions)
  const monthly = getMonthlySummary(filteredTransactions)
  const topCategory = getTopSpendingCategory(filteredTransactions)

  return (
    <div className='app-shell'>
      <header className='topbar'>
        <h1>Finance Dashboard</h1>
        <div className='controls'>
          <label>
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as 'admin' | 'viewer')}
            >
              <option value='viewer'>Viewer</option>
              <option value='admin'>Admin</option>
            </select>
          </label>
          <button type='button' onClick={toggleTheme}>
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>

      <main className='content'>
        <section className='panel'>
          <h2>PR-1 Foundation Complete</h2>
          <p>Transactions loaded: {transactions.length}</p>
          <p>Filtered transactions: {filteredTransactions.length}</p>
          <p>Total income: {formatCurrency(totals.income)}</p>
          <p>Total expenses: {formatCurrency(totals.expenses)}</p>
          <p>Total balance: {formatCurrency(totals.balance)}</p>
          <p>
            Top spending category:{' '}
            {topCategory ? `${topCategory.category} (${formatCurrency(topCategory.amount)})` : 'No data'}
          </p>
          <p>Monthly points available for chart: {monthly.length}</p>
        </section>

        <section className='panel'>
          <h2>Role Simulation</h2>
          <p>Current role: {role}</p>
          <p>Add/Edit/Delete access: {permissions.canAdd ? 'Enabled' : 'Read only'}</p>
          <p>Next PR will add layout + pages + visual components.</p>
        </section>
      </main>
    </div>
  )
}

export default App
