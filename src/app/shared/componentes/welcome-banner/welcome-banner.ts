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

  currentDate = new Date();

  constructor() {
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
