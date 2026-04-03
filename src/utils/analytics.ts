import type { CategorySpend, MonthlySummary, Transaction } from '../types'
import { formatMonthLabel } from './formatters'

export function getTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  return {
    income,
    expenses,
    balance: income - expenses,
  }
}

export function getMonthlySummary(transactions: Transaction[]): MonthlySummary[] {
  const bucket = new Map<string, MonthlySummary>()

  transactions.forEach((transaction) => {
    const monthKey = transaction.date.slice(0, 7)
    const existing =
      bucket.get(monthKey) || {
        monthKey,
        label: formatMonthLabel(monthKey),
        income: 0,
        expenses: 0,
        balance: 0,
      }

    if (transaction.type === 'income') {
      existing.income += transaction.amount
    } else {
      existing.expenses += transaction.amount
    }

    existing.balance = existing.income - existing.expenses
    bucket.set(monthKey, existing)
  })

  return Array.from(bucket.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey))
}

export function getSpendingByCategory(transactions: Transaction[]): CategorySpend[] {
  const spendMap = new Map<string, number>()

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const currentAmount = spendMap.get(transaction.category) || 0
      spendMap.set(transaction.category, currentAmount + transaction.amount)
    })

  return Array.from(spendMap.entries())
    .map(([category, amount]) => ({ category: category as CategorySpend['category'], amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function getTopSpendingCategory(transactions: Transaction[]): CategorySpend | null {
  const categories = getSpendingByCategory(transactions)
  return categories[0] || null
}

export function getBiggestExpense(transactions: Transaction[]): Transaction | null {
  const expenses = transactions.filter((transaction) => transaction.type === 'expense')

  if (expenses.length === 0) {
    return null
  }

  return expenses.reduce((biggest, current) =>
    current.amount > biggest.amount ? current : biggest,
  )
}

export function getAverageDailySpend(transactions: Transaction[]): number {
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense')

  if (expenseTransactions.length === 0) {
    return 0
  }

  const totalExpenses = expenseTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  )

  const uniqueDays = new Set(expenseTransactions.map((transaction) => transaction.date)).size

  return uniqueDays === 0 ? 0 : totalExpenses / uniqueDays
}

export function getSavingsRate(transactions: Transaction[]): number {
  const { income, expenses } = getTotals(transactions)

  if (income === 0) {
    return 0
  }

  return ((income - expenses) / income) * 100
}
