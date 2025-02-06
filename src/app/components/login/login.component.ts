import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Login: Creates a login module that simulates email and password verification.
// If the user enters an email and a password, the system saves a fake token in localStorage and redirects to the home page.
// If the data is invalid, it shows an error message.

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    // Simulates login: if email and password are filled, store a fake token and navigate to home
    if (this.email && this.password) {
      localStorage.setItem('userToken', 'fake-token');
      this.router.navigate(['/home']);
    } else {
      alert('Invalid email or password!');
    }
  }
}
