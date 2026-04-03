/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { mockTransactions } from '../data/mockTransactions'
import type { FilterState, Transaction } from '../types'

const defaultFilters: FilterState = {
  type: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  search: '',
  sortBy: 'date',
  sortOrder: 'desc',
}

interface TransactionState {
  transactions: Transaction[]
  filters: FilterState
}

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }

interface TransactionContextValue {
  state: TransactionState
  dispatch: Dispatch<TransactionAction>
  filteredTransactions: Transaction[]
}

const storageKey = 'finance-dashboard-transactions-v1'

function loadInitialTransactions(): Transaction[] {
  const storedValue = localStorage.getItem(storageKey)

  if (!storedValue) {
    return mockTransactions
  }

  try {
    const parsed = JSON.parse(storedValue) as Transaction[]
    return Array.isArray(parsed) ? parsed : mockTransactions
  } catch {
    return mockTransactions
  }
}

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const next = [action.payload, ...state.transactions]
      localStorage.setItem(storageKey, JSON.stringify(next))
      return { ...state, transactions: next }
    }
    case 'UPDATE_TRANSACTION': {
      const next = state.transactions.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction,
      )
      localStorage.setItem(storageKey, JSON.stringify(next))
      return { ...state, transactions: next }
    }
    case 'DELETE_TRANSACTION': {
      const next = state.transactions.filter((transaction) => transaction.id !== action.payload)
      localStorage.setItem(storageKey, JSON.stringify(next))
      return { ...state, transactions: next }
    }
    case 'SET_FILTERS': {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      }
    }
    case 'RESET_FILTERS': {
      return {
        ...state,
        filters: defaultFilters,
      }
    }
    default:
      return state
  }
}

function applyFilters(transactions: Transaction[], filters: FilterState): Transaction[] {
  const filtered = transactions.filter((transaction) => {
    const matchesType = filters.type === 'all' || transaction.type === filters.type
    const matchesCategory =
      filters.category === 'all' || transaction.category === filters.category
    const matchesSearch =
      filters.search.trim().length === 0 ||
      transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(filters.search.toLowerCase())
    const matchesFromDate = !filters.dateFrom || transaction.date >= filters.dateFrom
    const matchesToDate = !filters.dateTo || transaction.date <= filters.dateTo

    return (
      matchesType &&
      matchesCategory &&
      matchesSearch &&
      matchesFromDate &&
      matchesToDate
    )
  })

  return filtered.sort((a, b) => {
    if (filters.sortBy === 'amount') {
      return filters.sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }

    return filters.sortOrder === 'asc'
      ? a.date.localeCompare(b.date)
      : b.date.localeCompare(a.date)
  })
}

const TransactionContext = createContext<TransactionContextValue | null>(null)

export function TransactionProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(transactionReducer, {
    transactions: loadInitialTransactions(),
    filters: defaultFilters,
  })

  const filteredTransactions = useMemo(
    () => applyFilters(state.transactions, state.filters),
    [state.transactions, state.filters],
  )

  const value = useMemo(
    () => ({ state, dispatch, filteredTransactions }),
    [state, filteredTransactions],
  )

  return (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
  )
}

export function useTransactionContext() {
  const context = useContext(TransactionContext)

  if (!context) {
    throw new Error('useTransactionContext must be used inside TransactionProvider')
  }

  return context
}

export { defaultFilters }
export type { TransactionAction, TransactionState }
