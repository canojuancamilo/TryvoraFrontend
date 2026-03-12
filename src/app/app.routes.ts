import { Routes } from '@angular/router';
import { Login } from './paginas/publicas/login/login';
import { Registro } from './paginas/publicas/registro/registro';

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
    path: 'Registro',
    component: Registro
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];