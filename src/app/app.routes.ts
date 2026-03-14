import { Routes } from '@angular/router';
import { AdminClubDashboard } from './features/admin/admin-club-dashboard/admin-club-dashboard';
import { DashboardSuperAdmin } from './features/super-admin/dashboard/dashboard';
import { DashboardTercero } from './features/tesorero/dashboard/dashboard';
import { GestionTesoreros } from './features/admin/gestion-tesoreros/gestion-tesoreros';
import { Login } from './features/login/login';
import { RegistroClub } from './features/registro-club/registro-club';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Unauthorized } from './shared/componentes/unauthorized/unauthorized';

export const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', component: Login
  },
  {
    path: 'registro-club', component: RegistroClub
  },
  { 
    path: 'super-admin', component: DashboardSuperAdmin, canActivate: [AuthGuard, RoleGuard], data: { roles: ['super-admin']} 
  },
  {
    path: 'admin-club', component: AdminClubDashboard, canActivate: [AuthGuard, RoleGuard], data: { roles: ['super-admin','club-admin']}
  },
  {
    path: 'admin-gestion-tesoreros', component: GestionTesoreros, canActivate: [AuthGuard, RoleGuard], data: { roles: ['super-admin','club-admin']}
  },
  {
    path: 'tesorero-dashboard', component: DashboardTercero, canActivate: [AuthGuard, RoleGuard], data: { roles: ['super-admin','club-admin']}
  },
  {
    path: 'unauthorized', component: Unauthorized
  },
  
  {
    path: '**', redirectTo: ''
  }
];