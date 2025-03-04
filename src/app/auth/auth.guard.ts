import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  // Method to check if the user is authenticated
  canActivate(): boolean {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined') {
      const isLoggedIn = !!localStorage.getItem('userToken'); // Check if the user is authenticated by looking for a token in localStorage

      if (!isLoggedIn) {
        this.router.navigate(['/login']); // If the user is not logged in, redirect to the login page
        return false; // Deny access to the route
      }
      return true; // Allow access to the route
    }

    return false; // Deny access if it's not running in a browser (e.g., SSR)
  }
}
