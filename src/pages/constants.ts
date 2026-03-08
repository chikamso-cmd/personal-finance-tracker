import type { Category, Transaction } from '../components/types';

export const CATEGORIES: Category[] = [
  'Groceries',
  'Transport',
  'Entertainment',
  'Salary',
  'Utilities',
  'Other'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Groceries': '#F27D26',
  'Transport': '#3B82F6',
  'Entertainment': '#8B5CF6',
  'Salary': '#10B981',
  'Utilities': '#EF4444',
  'Other': '#6B7280'
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 500000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary',
    date: '2024-05-03'
  },
  {
    id: '2',
    amount: 25000,
    type: 'expense',
    category: 'Groceries',
    description: 'Weekly Shopping',
    date: '2024-05-09'
  },
  {
    id: '3',
    amount: 10000,
    type: 'expense',
    category: 'Transport',
    description: 'Uber rides',
    date: '2024-05-06'
  },
  {
    id: '4',
    amount: 4500,
    type: 'expense',
    category: 'Entertainment',
    description: 'Netflix Subscription',
    date: '2024-05-02'
  }
];
