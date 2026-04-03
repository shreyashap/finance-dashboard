export type Role = 'admin' | 'viewer'

export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Rent'
  | 'Food'
  | 'Transport'
  | 'Health'
  | 'Entertainment'
  | 'Shopping'
  | 'Utilities'

export interface Transaction {
  id: string
  date: string
  amount: number
  category: Category
  type: TransactionType
  description: string
}

export interface FilterState {
  type: 'all' | TransactionType
  category: Category | 'all'
  dateFrom: string
  dateTo: string
  search: string
  sortBy: 'date' | 'amount'
  sortOrder: 'asc' | 'desc'
}

export interface MonthlySummary {
  monthKey: string
  label: string
  income: number
  expenses: number
  balance: number
}

export interface CategorySpend {
  category: Category
  amount: number
}
