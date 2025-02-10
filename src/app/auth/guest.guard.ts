import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined' && localStorage.getItem('userToken')) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
