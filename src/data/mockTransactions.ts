import type { Category, Transaction, TransactionType } from '../types'

interface SeedTransaction {
  day: string
  amount: number
  category: Category
  type: TransactionType
  description: string
}

const monthSeeds: Record<string, SeedTransaction[]> = {
  '2026-01': [
    { day: '03', amount: 72000, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { day: '04', amount: 2400, category: 'Freelance', type: 'income', description: 'Bug-fix consultation' },
    { day: '06', amount: 18000, category: 'Rent', type: 'expense', description: 'Apartment rent' },
    { day: '08', amount: 2400, category: 'Food', type: 'expense', description: 'Groceries' },
    { day: '10', amount: 1300, category: 'Transport', type: 'expense', description: 'Cab and fuel' },
    { day: '12', amount: 2200, category: 'Utilities', type: 'expense', description: 'Electricity and internet' },
    { day: '14', amount: 900, category: 'Health', type: 'expense', description: 'Pharmacy bill' },
    { day: '16', amount: 1500, category: 'Entertainment', type: 'expense', description: 'Movie and dinner' },
    { day: '18', amount: 4200, category: 'Shopping', type: 'expense', description: 'Clothing' },
    { day: '20', amount: 16500, category: 'Freelance', type: 'income', description: 'Website redesign payout' },
    { day: '21', amount: 3100, category: 'Food', type: 'expense', description: 'Weekend groceries' },
    { day: '24', amount: 1200, category: 'Transport', type: 'expense', description: 'Metro and auto' },
    { day: '26', amount: 1400, category: 'Health', type: 'expense', description: 'Routine checkup' },
    { day: '27', amount: 1700, category: 'Entertainment', type: 'expense', description: 'Concert ticket' },
    { day: '29', amount: 2500, category: 'Utilities', type: 'expense', description: 'Phone and subscriptions' },
    { day: '30', amount: 3600, category: 'Shopping', type: 'expense', description: 'Home essentials' },
    { day: '31', amount: 5200, category: 'Food', type: 'expense', description: 'Dining out' },
    { day: '31', amount: 1200, category: 'Transport', type: 'expense', description: 'Airport transfer' },
  ],
  '2026-02': [
    { day: '03', amount: 72500, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { day: '04', amount: 2000, category: 'Freelance', type: 'income', description: 'Content update contract' },
    { day: '05', amount: 18000, category: 'Rent', type: 'expense', description: 'Apartment rent' },
    { day: '07', amount: 2800, category: 'Food', type: 'expense', description: 'Groceries' },
    { day: '09', amount: 1500, category: 'Transport', type: 'expense', description: 'Cab and fuel' },
    { day: '11', amount: 2600, category: 'Utilities', type: 'expense', description: 'Electricity and internet' },
    { day: '13', amount: 1100, category: 'Health', type: 'expense', description: 'Clinic visit' },
    { day: '15', amount: 2100, category: 'Entertainment', type: 'expense', description: 'Streaming and events' },
    { day: '17', amount: 4700, category: 'Shopping', type: 'expense', description: 'Household shopping' },
    { day: '19', amount: 14500, category: 'Freelance', type: 'income', description: 'API integration project' },
    { day: '21', amount: 2900, category: 'Food', type: 'expense', description: 'Groceries and snacks' },
    { day: '22', amount: 1100, category: 'Transport', type: 'expense', description: 'Bus and metro pass' },
    { day: '24', amount: 1200, category: 'Health', type: 'expense', description: 'Supplements' },
    { day: '25', amount: 2400, category: 'Entertainment', type: 'expense', description: 'Weekend outing' },
    { day: '26', amount: 2400, category: 'Utilities', type: 'expense', description: 'Phone and broadband' },
    { day: '27', amount: 3100, category: 'Shopping', type: 'expense', description: 'Accessories' },
    { day: '28', amount: 3900, category: 'Food', type: 'expense', description: 'Restaurant visits' },
    { day: '28', amount: 1300, category: 'Transport', type: 'expense', description: 'Late-night commute' },
  ],
  '2026-03': [
    { day: '03', amount: 73000, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { day: '03', amount: 2600, category: 'Freelance', type: 'income', description: 'Quick landing page edits' },
    { day: '04', amount: 18500, category: 'Rent', type: 'expense', description: 'Apartment rent' },
    { day: '06', amount: 3200, category: 'Food', type: 'expense', description: 'Groceries' },
    { day: '08', amount: 1600, category: 'Transport', type: 'expense', description: 'Fuel refill' },
    { day: '10', amount: 2800, category: 'Utilities', type: 'expense', description: 'Electricity and internet' },
    { day: '12', amount: 1300, category: 'Health', type: 'expense', description: 'Medical tests' },
    { day: '14', amount: 2600, category: 'Entertainment', type: 'expense', description: 'Sports and movie' },
    { day: '16', amount: 5200, category: 'Shopping', type: 'expense', description: 'Appliance purchase' },
    { day: '18', amount: 17200, category: 'Freelance', type: 'income', description: 'Design audit contract' },
    { day: '20', amount: 3500, category: 'Food', type: 'expense', description: 'Groceries and bakery' },
    { day: '22', amount: 1400, category: 'Transport', type: 'expense', description: 'Ride sharing' },
    { day: '24', amount: 1600, category: 'Health', type: 'expense', description: 'Dental visit' },
    { day: '25', amount: 2900, category: 'Entertainment', type: 'expense', description: 'Family outing' },
    { day: '27', amount: 2600, category: 'Utilities', type: 'expense', description: 'Phone and DTH recharge' },
    { day: '29', amount: 4100, category: 'Shopping', type: 'expense', description: 'Office gear' },
    { day: '31', amount: 4400, category: 'Food', type: 'expense', description: 'Dining and groceries' },
    { day: '31', amount: 1600, category: 'Transport', type: 'expense', description: 'Intercity travel' },
  ],
}

const months = Object.keys(monthSeeds).sort()

export const mockTransactions: Transaction[] = months.flatMap((month) =>
  monthSeeds[month].map((entry, index) => ({
    id: `${month}-${index + 1}`,
    date: `${month}-${entry.day}`,
    amount: entry.amount,
    category: entry.category,
    type: entry.type,
    description: entry.description,
  })),
)
