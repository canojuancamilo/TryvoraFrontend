import { Routes } from '@angular/router';
import { RegistroClub } from './features/publicas/registro-club/registro-club';
import { Login } from './features/publicas/login/login';
import { AdminClubDashboard } from './features/admin/admin-club-dashboard/admin-club-dashboard';
import { DashboardSuperAdmin } from './features/super-admin/dashboard/dashboard';
import { DashboardTercero } from './features/tesorero/dashboard/dashboard';
import { GestionTesoreros } from './features/admin/gestion-tesoreros/gestion-tesoreros';

export const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  { 
    path: 'super-admin', component: DashboardSuperAdmin 
  },
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
    path: 'admin-gestion-tesoreros', component: GestionTesoreros
  },
  {
    path: '**', redirectTo: ''
  }
];