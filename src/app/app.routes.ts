import { Routes } from '@angular/router';
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
    path: '**',
    redirectTo: 'login'
  }
];