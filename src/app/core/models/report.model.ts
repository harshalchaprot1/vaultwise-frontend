export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  byCategory: Array<{
    category: string;
    value: number;
  }>;
}

export interface AnnualReportCategory {
  categoryId: number;
  totalSpent: number;
  transactionCount: number;
}

export interface AnnualReport {
  year: number;
  totalExpenses: number;
  byCategory: AnnualReportCategory[];
}
