import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { RoleWiseMenuAssignAddComponent } from './role-wise-menu-assign-add/role-wise-menu-assign-add.component';
import { RoleWiseMenuAssignListComponent } from './role-wise-menu-assign-list/role-wise-menu-assign-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export const routes = [
  { path: '', component: RoleWiseMenuAssignListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RoleWiseMenuAssignAddComponent,
    RoleWiseMenuAssignListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatTooltipModule
  ]
})
export class RoleWiseMenuAssignModule { }
