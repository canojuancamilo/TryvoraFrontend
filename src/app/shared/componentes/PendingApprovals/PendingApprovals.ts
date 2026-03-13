import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PendingApproval } from '../../../models/dashboard-admin.model';

@Component({
  selector: 'app-pending-approvals',
  imports: [],
  templateUrl: './PendingApprovals.html',
  styleUrl: './PendingApprovals.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingApprovals { 
   approvals = input<PendingApproval[]>([]);
  pendingCount = input<number>(0);
  
  onApprove = output<string>();
  onReject = output<string>();
  
 // En pending-approvals.component.ts
formatTime(time: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(time).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'hace unos segundos';
  if (minutes < 60) return `hace ${minutes} min`;
  if (hours < 24) return `hace ${hours} h`;
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days} días`;
  return new Date(time).toLocaleDateString('es-ES');
}
  
  approve(id: string): void {
    this.onApprove.emit(id);
  }
  
  reject(id: string): void {
    this.onReject.emit(id);
  }
}
