import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api.config';
import { User, UserPayload } from '../models/user.model';
import { ApiEnvelope } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly endpoint = `${API_BASE_URL}${API_ENDPOINTS.users}`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<ApiEnvelope<User[]>>(this.endpoint).pipe(map((res) => res.data));
  }

  getById(id: number): Observable<User> {
    return this.http.get<ApiEnvelope<User>>(`${this.endpoint}/${id}`).pipe(map((res) => res.data));
  }

  create(payload: UserPayload): Observable<User> {
    return this.http.post<ApiEnvelope<User>>(this.endpoint, payload).pipe(map((res) => res.data));
  }

  update(id: number, payload: UserPayload): Observable<User> {
    return this.http.put<ApiEnvelope<User>>(`${this.endpoint}/${id}`, payload).pipe(map((res) => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
