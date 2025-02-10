import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

// Login: Creates a login module that simulates email and password verification.
// If the user enters an email and a password, the system saves a fake token in localStorage and redirects to the home page.
// If the data is invalid, it shows an error message.

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NavbarComponent,
  ],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email e password sono obbligatori';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        localStorage.setItem('userToken', response.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        if (error.status === 404) {
          this.errorMessage =
            'Utente non registrato. Effettua la registrazione.';
        } else if (error.status === 401) {
          this.errorMessage = 'Password errata. Riprova.';
        } else {
          this.errorMessage = 'Errore nel login. Riprova più tardi.';
        }
      }
    );
  }
}
