import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-welcome-banner',
  imports: [],
  templateUrl: './welcome-banner.html',
  styleUrl: './welcome-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeBanner {
  userName = input<string |  undefined>('Usuario');
  clubName = input<string>('Club');
  totalJugadoresDia = input<number>(0);
  totalJugadoresMora = input<number>(0);
  totalComprobantesPendientes = input<number>(0);

  currentDate = new Date();

  getFormattedDate(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

}
