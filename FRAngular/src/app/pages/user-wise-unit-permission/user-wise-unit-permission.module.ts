import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserWiseUnitPermissionAddComponent } from './user-wise-unit-permission-add/user-wise-unit-permission-add.component';
import { UserWiseUnitPermissionListComponent } from './user-wise-unit-permission-list/user-wise-unit-permission-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: UserWiseUnitPermissionListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    UserWiseUnitPermissionAddComponent,
    UserWiseUnitPermissionListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule
  ]
})
export class UserWiseUnitPermissionModule { }
