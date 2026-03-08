export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Groceries' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Salary' 
  | 'Utilities' 
  | 'Other';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}
