import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContactFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  company?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    subject: string;
    status: string;
    createdAt: string;
  };
  emailDelivered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  submitContactForm(data: ContactFormData): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.apiUrl, data);
  }

  /**
   * Auto-detects visitor's country calling code using IP geolocation.
   * Gracefully falls back to null if blocked or offline.
   */
  detectUserCountry(): Observable<string | null> {
    return this.http.get<any>('https://ipapi.co/json/').pipe(
      timeout(3000), // Max 3s wait so it never slows down UI
      map(res => res?.country_calling_code || null),
      catchError(() => of(null))
    );
  }
}

