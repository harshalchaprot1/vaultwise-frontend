import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import { Transaction } from '../models/transaction.model';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface BackendTransaction {
  id: number;
  user_id: number;
  type: 'income' | 'expense';
  category_id: number;
  amount: string | number;
  note?: string;
  transaction_date: string;
}

export interface TransactionUpsertPayload {
  user_id: number;
  category_id: number;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
  transaction_date: string;
  brand_id?: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly endpoint = `${API_BASE_URL}${API_ENDPOINTS.transactions}`;

  constructor(private readonly http: HttpClient) {}

  getAllByUser(userId: number): Observable<Transaction[]> {
    return this.http
      .get<ApiResponse<BackendTransaction[]>>(`${this.endpoint}/user/${userId}`)
      .pipe(map((res) => res.data.map((item) => this.toTransaction(item))));
  }

  getById(id: number): Observable<Transaction> {
    return this.http
      .get<ApiResponse<BackendTransaction>>(`${this.endpoint}/${id}`)
      .pipe(map((res) => this.toTransaction(res.data)));
  }

  create(payload: TransactionUpsertPayload): Observable<Transaction> {
    return this.http
      .post<ApiResponse<BackendTransaction>>(this.endpoint, payload)
      .pipe(map((res) => this.toTransaction(res.data)));
  }

  update(id: number, payload: TransactionUpsertPayload): Observable<Transaction> {
    return this.http
      .put<ApiResponse<BackendTransaction>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((res) => this.toTransaction(res.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  private toTransaction(item: BackendTransaction): Transaction {
    return {
      id: item.id,
      userId: item.user_id,
      type: item.type,
      category: String(item.category_id),
      amount: Number(item.amount),
      description: item.note || '',
      date: item.transaction_date
    };
  }
}
