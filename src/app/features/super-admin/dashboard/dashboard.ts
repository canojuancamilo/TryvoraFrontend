import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { Sidebar } from '../../../shared/componentes/sidebar/sidebar';
import { Topbar } from "../../../shared/componentes/topbar/topbar";
import { StatsGrid } from "../stats-grid/stats-grid";
import { ClubsTable } from "../clubs-table/clubs-table";
import { ActivityFeed } from "../activity-feed/activity-feed";
import { SportDistribution } from "../sport-distribution/sport-distribution";
import { ClubService } from '../../../core/services/club.service';
import { UiService } from '../../../core/services/ui.service';
import { IUser } from '../../../core/interfaces/apis/auth/IUser';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, Topbar, StatsGrid, ClubsTable, ActivityFeed, SportDistribution],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSuperAdmin {
  private clubService = inject(ClubService);
  private authService = inject(AuthService);
  uiService = inject(UiService);

  sidebar = viewChild.required(Sidebar);

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
    this.usuarioLogueado.set(this.authService.currentUser!)
  }

  exportData() {
    const clubs = this.clubService.clubs();
    const headers = ['ID', 'Club', 'Ciudad', 'Deporte', 'Jugadores', 'Ingresos', 'Estado', 'Registro'];
    const rows = clubs.map(c => [c.id, c.name, c.city, c.sport, c.players, c.income, c.status, c.date]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clubpay_clubs.csv';
    a.click();
    URL.revokeObjectURL(url);

    // Aquí podrías mostrar un toast
  }

  openAddClubModal() {
    // Implementar apertura de modal
  }

  toggleSidebar(): void {
    this.uiService.toggleSidebar();
  }

  public readonly clubInfo = {
    name: 'FC Deportivo Norte',
    avatar: 'FC',
    role: 'Administrador'
  };

  public readonly userInfo = {
    name: 'Carlos Administrador',
    avatar: 'CA',
    role: 'Admin del Club'
  };

}
