import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  onSubmit(form: NgForm) {
    if (form.valid) {
      const userData = {
        email: form.value.email,
        password: form.value.password,
      };

      this.http
        .post<{ token: string; user: any }>(
          'http://localhost:5000/api/register',
          userData
        )
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);

            // Salva il token in localStorage
            localStorage.setItem('userToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Reindirizza alla home
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Error during registration:', error);
            alert('Errore durante la registrazione');
          },
        });
    }
  }
}
