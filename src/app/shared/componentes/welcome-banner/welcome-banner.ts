import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-welcome-banner',
  imports: [DatePipe],
  templateUrl: './welcome-banner.html',
  styleUrl: './welcome-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeBanner {
  userName = input<string>('Usuario');
  clubName = input<string>('Club');
  lastUpdate = input<Date | null>(null);

  currentDate = new Date();

  constructor() {
    // Actualizar fecha cada minuto
    effect(() => {
      // Si hay lastUpdate, podríamos hacer algo
      if (this.lastUpdate()) {
        console.log('Dashboard actualizado:', this.lastUpdate());
      }
    });
  }

  getFormattedDate(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
