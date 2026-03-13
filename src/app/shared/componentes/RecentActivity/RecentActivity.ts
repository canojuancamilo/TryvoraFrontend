import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityItem } from '../../../models/dashboard-admin.model';

@Component({
  selector: 'app-recent-activity',
  imports: [],
  templateUrl: './RecentActivity.html',
  styleUrl: './RecentActivity.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivity {
  activities = input<ActivityItem[]>([]);
  
  getActivityIcon(type: string): string {
    const icons = {
      payment: 'bi-check-circle-fill',
      player: 'bi-person-plus-fill',
      alert: 'bi-exclamation-triangle-fill'
    };
    return icons[type as keyof typeof icons] || 'bi-info-circle-fill';
  }
  
  getActivityClass(type: string): string {
    const classes = {
      payment: 'payment',
      player: 'player',
      alert: 'alert'
    };
    return classes[type as keyof typeof classes] || 'info';
  }
  
  formatTime(time: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'ahora mismo';
    if (minutes < 60) return `hace ${minutes} min`;
    if (hours < 24) return `hace ${hours} h`;
    if (days === 1) return 'ayer';
    return `hace ${days} días`;
  }
 }
