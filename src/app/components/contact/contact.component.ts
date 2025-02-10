import { Component } from '@angular/core';
import { EmailService } from '../../../../backend/services/email.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ContactComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  message: string = '';
  isSending: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private emailService: EmailService) {}

  sendEmail(event: Event) {
    event.preventDefault();
    this.isSending = true;
    this.successMessage = '';
    this.errorMessage = '';

    const emailData = {
      name: `${this.firstName} ${this.lastName}`,
      email: this.email,
      message: this.message,
    };

    this.emailService.sendEmail(emailData).subscribe({
      next: () => {
        this.successMessage = 'Email sent successfully!';
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.message = '';
        this.isSending = false;
      },
      error: () => {
        this.errorMessage = 'Error sending email.';
        this.isSending = false;
      },
    });
  }
}
