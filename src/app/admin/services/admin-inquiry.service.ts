import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type InquiryStatus = 'New' | 'In Progress' | 'Completed';
export interface Inquiry { _id: string; id?: string; fullName: string; email: string; phoneNumber: string; company?: string; subject: string; message: string; status: InquiryStatus; createdAt: string; }
@Injectable({ providedIn: 'root' })
export class AdminInquiryService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/admin`;
  dashboard(): Observable<any> { return this.http.get(`${this.url}/dashboard`); }
  inquiries(filters: Record<string, string | number>): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => { if (value !== '' && value !== undefined) params = params.set(key, String(value)); });
    return this.http.get(`${this.url}/inquiries`, { params });
  }
  inquiry(id: string): Observable<any> { return this.http.get(`${this.url}/inquiries/${encodeURIComponent(id)}`); }
  updateStatus(id: string, status: InquiryStatus): Observable<any> { return this.http.patch(`${this.url}/inquiries/${encodeURIComponent(id)}/status`, { status }); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.url}/inquiries/${encodeURIComponent(id)}`); }
}
