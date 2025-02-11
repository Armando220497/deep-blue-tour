import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, AfterViewInit {
  @ViewChild('aboutContainer', { static: true }) aboutContainer!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initIntersectionObserver(), 100); // Attendi 100ms per garantire il caricamento
    }
  }

  ngAfterViewInit() {
    // Spostato l'osservatore in ngOnInit per evitare il problema di ricaricamento
  }

  private initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.2 }
      );

      const elements =
        this.aboutContainer.nativeElement.querySelectorAll('.fade-in');
      elements.forEach((el: HTMLElement) => observer.observe(el));
    } else {
      console.warn('IntersectionObserver non supportato su questo browser.');
    }
  }
}
