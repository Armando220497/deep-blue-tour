import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// GuestGuard is used to prevent access to the login page if the user is already logged in.
// If the user has a userToken in localStorage, they are redirected to the home page.

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('userToken'); // Checks if the user is logged in by looking for a token in localStorage

    if (isLoggedIn) {
      this.router.navigate(['/home']); // If the user is logged in, redirects to the home page
      return false; // Prevents access to the login page
    }
    return true; // Allows access to the login page if the user is not logged in
  }
}
