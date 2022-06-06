import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PagesComponent } from './pages/pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./pages/user/user.module').then(
            (m) => m.UserModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'role',
        loadChildren: () =>
          import('./pages/role/role.module').then(
            (m) => m.RoleModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'assign-role',
        loadChildren: () =>
          import('./pages/assign-role/assign-role.module').then(
            (m) => m.AssignRoleModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./pages/menu/menu.module').then(
            (m) => m.MenuModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'role-wise-menu-assign',
        loadChildren: () =>
          import('./pages/role-wise-menu-assign/role-wise-menu-assign.module').then(
            (m) => m.RoleWiseMenuAssignModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'designation',
        loadChildren: () =>
          import('./pages/designation/designation.module').then(
            (m) => m.DesignationModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'division',
        loadChildren: () =>
          import('./pages/group/group.module').then(
            (m) => m.GroupModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'unit',
        loadChildren: () =>
          import('./pages/unit/unit.module').then(
            (m) => m.UnitModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'department',
        loadChildren: () =>
          import('./pages/department/department.module').then(
            (m) => m.DepartmentModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'common-code',
        loadChildren: () =>
          import('./pages/common-code/common-code.module').then(
            (m) => m.CommonCodeModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'header',
        loadChildren: () =>
          import('./pages/header/header.module').then(
            (m) => m.HeaderModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'transaction',
        loadChildren: () =>
          import('./pages/transaction/transaction.module').then(
            (m) => m.TransactionModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: 'user-wise-unit-permission',
        loadChildren: () =>
          import('./pages/user-wise-unit-permission/user-wise-unit-permission.module').then(
            (m) => m.UserWiseUnitPermissionModule
          ),
          canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then((m) => m.UserProfileModule),
  },
  {
    path: '**',
    component: PagesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
