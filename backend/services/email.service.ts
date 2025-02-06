import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Ensures the service is globally injectable
})
export class EmailService {
  private apiUrl = 'http://localhost:5000/api/send'; // API endpoint for sending email

  constructor(private http: HttpClient) {}

  sendEmail(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData); // Sends a POST request with form data
  }
}
