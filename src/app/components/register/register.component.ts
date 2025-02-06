import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], // Fixed typo in 'styleUrls' (plural)
})
export class RegisterComponent {
  private http = inject(HttpClient);

  // Handle form submission
  onSubmit(form: NgForm) {
    if (form.valid) {
      // Prepare user data to send to the server
      const userData = {
        email: form.value.email,
        password: form.value.password,
      };

      // Make the HTTP request to register the user
      this.http.post('http://localhost:5000/api/register', userData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          alert('Registration completed successfully!');
        },
        error: (error) => {
          console.error('Error during registration:', error);
          alert('Error during registration');
        },
      });
    }
  }
}
