import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  initializeTooltips(componentElement: HTMLElement) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const tooltips = componentElement.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach((element: Element) => {
          this.createTooltip(element as HTMLElement);
        });
      }, 100);
    }
  }

  createTooltip(element: HTMLElement): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!(element as any)._tooltip) {
        const tooltip = new bootstrap.Tooltip(element);
        (element as any)._tooltip = tooltip;
      }
    }
  }
}