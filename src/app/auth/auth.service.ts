import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/login';

  constructor(private http: HttpClient, private router: Router) {}

  private get isBrowser() {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password });
  }

  get isLoggedIn(): boolean {
    return this.isBrowser ? !!localStorage.getItem('userToken') : false;
  }

  get userRole(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('userToken');
      if (!token) return null;
      const decoded: any = jwt_decode(token);
      return decoded.role;
    }
    return null;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('userToken');
      this.router.navigate(['/login']);
    }
  }
}
