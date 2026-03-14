import { ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
   protected notificationService = inject(NotificationService);

  getIcon(type: string): string {
    const icons = {
      success: 'bi bi-check-circle-fill',
      error: 'bi bi-exclamation-circle-fill',
      warning: 'bi bi-exclamation-triangle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return icons[type as keyof typeof icons] || icons.info;
  }
 }