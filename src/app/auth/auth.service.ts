import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
    console.log('Dati inviati:', { email, password });

    return this.http.post<any>(this.apiUrl, { email, password });
  }

  get isLoggedIn(): boolean {
    return this.isBrowser ? !!localStorage.getItem('userToken') : false;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('userToken');
      this.router.navigate(['/login']);
    }
  }
}
