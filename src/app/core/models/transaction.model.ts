export interface Transaction {
  id: number;
  userId: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export interface TransactionPayload {
  userId: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
}
