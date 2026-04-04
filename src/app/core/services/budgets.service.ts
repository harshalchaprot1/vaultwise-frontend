import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import { Budget } from '../models/budget.model';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface BackendBudget {
  id: number;
  user_id: number;
  category_id: number;
  amount: string | number;
  start_date: string;
  end_date: string;
}

export interface BudgetUpsertPayload {
  user_id: number;
  category_id: number;
  amount: number;
  start_date: string;
  end_date: string;
}

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private readonly endpoint = `${API_BASE_URL}${API_ENDPOINTS.budgets}`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Budget[]> {
    return this.http
      .get<ApiResponse<BackendBudget[]>>(this.endpoint)
      .pipe(map((res) => res.data.map((item) => this.toBudget(item))));
  }

  getById(id: number): Observable<Budget> {
    return this.http
      .get<ApiResponse<BackendBudget>>(`${this.endpoint}/${id}`)
      .pipe(map((res) => this.toBudget(res.data)));
  }

  create(payload: BudgetUpsertPayload): Observable<Budget> {
    return this.http
      .post<ApiResponse<BackendBudget>>(this.endpoint, payload)
      .pipe(map((res) => this.toBudget(res.data)));
  }

  update(id: number, payload: BudgetUpsertPayload): Observable<Budget> {
    return this.http
      .put<ApiResponse<BackendBudget>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((res) => this.toBudget(res.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  private toBudget(item: BackendBudget): Budget {
    return {
      id: item.id,
      userId: item.user_id,
      category: String(item.category_id),
      limitAmount: Number(item.amount),
      period: 'monthly',
      spent: 0
    };
  }
}
