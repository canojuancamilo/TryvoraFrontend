import { Routes } from '@angular/router';
import { RegistroClub } from './paginas/publicas/registro-club/registro-club';
import { Login } from './paginas/publicas/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'registro-club',
    component: RegistroClub
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];