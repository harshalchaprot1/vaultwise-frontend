import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import { MonthlyReport, ReportSummary } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly endpoint = `${API_BASE_URL}${API_ENDPOINTS.reports}`;

  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.endpoint}/summary`);
  }

  getMonthly(year: number): Observable<MonthlyReport[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<MonthlyReport[]>(`${this.endpoint}/monthly`, { params });
  }
}
