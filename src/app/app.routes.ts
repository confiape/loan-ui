import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { LoginComponent } from './features/auth/login/login';
import { CompaniesListComponent } from './features/companies/companies-list/companies-list';
import { RolesListComponent } from './features/roles/roles-list/roles-list';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'companies',
        children: [
          {
            path: '',
            component: CompaniesListComponent,
          },
          {
            path: ':id',
            component: CompaniesListComponent,
          },
        ],
      },
      {
        path: 'roles',
        component: RolesListComponent,
      },
    ],
  },
];
