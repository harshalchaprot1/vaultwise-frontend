export interface Budget {
  id: number;
  userId: number;
  category: string;
  limitAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  spent?: number;
}

export interface BudgetPayload {
  userId: number;
  category: string;
  limitAmount: number;
  period: 'weekly' | 'monthly' | 'yearly';
}
