// services/scroll.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initScrollToTop();
  }

  private initScrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  // Método manual para hacer scroll al inicio
  scrollToTop(behavior: ScrollBehavior = 'smooth') {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        behavior: behavior
      });
    }
  }

  // Scroll a un elemento específico
  scrollToElement(selector: string, behavior: ScrollBehavior = 'smooth') {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior, block: 'start' });
      }
    }
  }
}