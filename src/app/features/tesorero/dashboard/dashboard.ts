import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Sidebar } from "../../../shared/componentes/sidebar/sidebar";
import { Topbar } from "../../../shared/componentes/topbar/topbar";
import { WelcomeBanner } from "../../../shared/componentes/welcome-banner/welcome-banner";
import { StatsGrid } from "../../super-admin/stats-grid/stats-grid";
import { PendingApprovals } from "../../../shared/componentes/PendingApprovals/PendingApprovals";
import { IncomeSummary } from "../income-summary/income-summary";
import { RecentPayments } from "../recent-payments/recent-payments";
import { Notifications } from "../../../shared/componentes/notifications/notifications";
import { PaymentService } from '../../../core/services/payment.service';
import { UiService } from '../../../core/services/ui.service';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../../core/interfaces/apis/auth/IUser';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, Topbar, WelcomeBanner, StatsGrid, PendingApprovals, IncomeSummary, RecentPayments, Notifications],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTercero implements OnInit {
  paymentService = inject(PaymentService);
  uiService = inject(UiService);
  private authService = inject(AuthService);

  usuarioLogueado = signal<IUser>({
    id: 0,
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    roles: [],
    permissions: [],
  })

  constructor() {
    afterNextRender(() => {
      this.animateStats();
    });

    this.usuarioLogueado.set(this.authService.currentUser!)
  }

  ngOnInit() {
    console.log('Dashboard initialized');
  }


  public readonly userInfo = {
    name: 'Carlos Administrador',
    avatar: 'CA',
    role: 'Admin del Club'
  };

  private animateStats() {
    document.querySelectorAll('.stat-card').forEach((card, i) => {
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(20px)';
      setTimeout(() => {
        (card as HTMLElement).style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      }, 100 + i * 80);
    });
  }

  toggleSidebar(): void {
    this.uiService.toggleSidebar();
  }
}