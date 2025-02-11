import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule, MatButtonModule, MatCardModule, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, -60%)' }),
        animate(
          '1.5s ease-out',
          style({ opacity: 1, transform: 'translate(-50%, -50%)' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  isMobile: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  ngOnInit() {
    this.onResize();
  }

  cards = [
    {
      title: 'Capri',
      image: 'assets/image/capri.jpg',
      description: 'Scopri le meraviglie di Capri.',
      flipped: false,
    },
    {
      title: 'Amalfi',
      image: 'assets/image/amalfi.jpg',
      description: 'Un viaggio tra i colori di Amalfi.',
      flipped: false,
    },
    {
      title: 'Sorrento',
      image: 'assets/image/sorrento.jpg',
      description: 'Sorrento e le sue bellezze naturali.',
      flipped: false,
    },
    {
      title: 'Procida',
      image: 'assets/image/procida.jpg',
      description: 'L’isola dei colori ti aspetta.',
      flipped: false,
    },
  ];

  goToContact() {
    this.router.navigate(['/contact']);
  }

  flipCard(card: { flipped: boolean }) {
    if (this.isMobile) {
      card.flipped = !card.flipped;
    }
  }

  onHover(card: { flipped: boolean }, isHovering: boolean) {
    if (!this.isMobile) {
      card.flipped = isHovering;
    }
  }
}
