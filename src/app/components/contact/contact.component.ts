// Importing necessary modules and services
import { Component } from '@angular/core';
import { EmailService } from '../../../../backend/services/email.service';
import { FormsModule } from '@angular/forms'; // For form handling
import { CommonModule } from '@angular/common'; // Common Angular directives

@Component({
  selector: 'app-contact', // Component selector
  templateUrl: './contact.component.html', // Template for the component
  styleUrls: ['./contact.component.css'], // Styles for the component
  imports: [FormsModule, CommonModule], // Import necessary modules
})
export class ContactComponent {
  // Form data properties
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  message: string = '';
  isSending: boolean = false; // Tracks submission state
  successMessage: string = ''; // Success message
  errorMessage: string = ''; // Error message

  constructor(private emailService: EmailService) {} // Inject EmailService

  // Handles form submission
  sendEmail(event: Event) {
    event.preventDefault(); // Prevent default form submission
    this.isSending = true; // Show loading state
    this.successMessage = ''; // Clear previous success message
    this.errorMessage = ''; // Clear previous error message

    // Prepare email data
    const emailData = {
      name: `${this.firstName} ${this.lastName}`,
      email: this.email,
      message: this.message,
    };

    // Send email using the service
    this.emailService.sendEmail(emailData).subscribe({
      next: (response) => {
        this.successMessage = 'Email inviata con successo!'; // Success message
        // Reset form after success
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.message = '';
        this.isSending = false; // Hide loading state
      },
      error: (error) => {
        this.errorMessage = "Errore durante l'invio dell'email."; // Error message
        this.isSending = false; // Hide loading state
      },
    });
  }
}
