import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, MatButtonModule, MatCardModule, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  cards = [
    { title: 'Capri', image: 'assets/image/capri.jpg' },
    { title: 'Amalfi', image: 'assets/image/amalfi.jpg' },
    { title: 'Sorrento', image: 'assets/image/sorrento.jpg' },
    { title: 'Procida', image: 'assets/image/procida.jpg' },
  ];

  constructor(private router: Router) {}
  goToContact() {
    this.router.navigate(['/contact']);
  }
}
