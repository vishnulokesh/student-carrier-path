export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Food'
  | 'Transport'
  | 'College'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Health'
  | 'Education'
  | 'Personal'
  | 'Income'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // ISO string
  category: Category;
  sourceOrWhere: string; // "Source" for income, "Where" for expense
  note?: string;
}

export interface Budget {
  amount: number;
  enabled: boolean;
}

export interface AppState {
  transactions: Transaction[];
  initialBalance: number;
  budget: Budget;
  isSetupComplete: boolean;
}
