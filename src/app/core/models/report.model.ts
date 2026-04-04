export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: Array<{
    category: string;
    value: number;
  }>;
}

export interface MonthlyReport {
  month: string;
  income: number;
  expense: number;
}
