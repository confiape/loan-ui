import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { CompaniesListComponent } from './features/companies/companies-list/companies-list';
import { RolesListComponent } from './features/roles/roles-list/roles-list';
import { UsersListComponent } from './features/users/users-list/users-list';

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
        children: [
          {
            path: '',
            component: RolesListComponent,
          },
          {
            path: ':id',
            component: RolesListComponent,
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UsersListComponent,
          },
          {
            path: ':id',
            component: UsersListComponent,
          },
        ],
      },
    ],
  },
];
