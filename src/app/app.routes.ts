import { Routes } from '@angular/router';
import { RegistroClub } from './paginas/publicas/registro-club/registro-club';
import { Login } from './paginas/publicas/login/login';
import { AdminClubDashboard } from './paginas/admin/admin-club-dashboard/admin-club-dashboard';
import { DashboardSuperAdmin } from './paginas/super-admin/dashboard/dashboard';
import { DashboardTercero } from './paginas/tesorero/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  { path: 'super-admin', component: DashboardSuperAdmin },
  {
    path: 'login', component: Login
  },
  {
    path: 'registro-club', component: RegistroClub
  },
  {
    path: 'admin-club', component: AdminClubDashboard
  },
  {
    path: 'tesorero-dashboard', component: DashboardTercero
  },
  {
    path: '**', redirectTo: ''
  }
];