import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// AuthService handles authentication logic for the application
// - login(): Sends a request to authenticate the user with provided credentials
// - isLoggedIn: Checks if the user is logged in by looking for a token in localStorage
// - logout(): Removes the authentication token from localStorage, logging the user out

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4200/home'; // API endpoint for login

  constructor(private http: HttpClient) {}

  // Checks if running in a browser environment
  private get isBrowser() {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }

  // Login method: sends credentials to the backend for authentication
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password }; // Creates the payload with user credentials
    return this.http.post<any>(this.apiUrl, credentials); // Sends POST request
  }

  // Getter to check if the user is logged in by verifying the existence of a token in localStorage
  get isLoggedIn(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('userToken'); // Checks for a valid token in localStorage
    }
    return false;
  }

  // Logout method: removes the authentication token from localStorage
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('userToken'); // Removes the token from localStorage
    }
  }
}
