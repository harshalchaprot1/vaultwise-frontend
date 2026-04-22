import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import { AnnualReport, ReportSummary } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly endpoint = `${API_BASE_URL}${API_ENDPOINTS.reports}`;

  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<ReportSummary> {
    return this.http.get<any>(`${this.endpoint}/summary`).pipe(
      map(response => {
        const data = response.summary || response.data || response;
        return {
          totalIncome: data.totalIncome || 0,
          totalExpense: data.totalExpense || 0,
          balance: data.netSavings || 0,
          byCategory: (data.categoryPerformance || []).map((c: any) => ({
            category: `Category ${c.categoryId}`,
            value: c.totalSpent || 0
          }))
        };
      })
    );
  }

  getAnnual(userId: number, year: number): Observable<AnnualReport> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<any>(`${this.endpoint}/annual/${userId}`, { params }).pipe(
      map(res => {
        const data = res.data || res;
        return {
          year: data.year,
          totalExpenses: Number(data.total_expenses),
          byCategory: (data.by_category || []).map((c: any) => ({
            categoryId: c.category_id,
            totalSpent: Number(c.total_spent),
            transactionCount: c.transaction_count
          }))
        };
      })
    );
  }
}
