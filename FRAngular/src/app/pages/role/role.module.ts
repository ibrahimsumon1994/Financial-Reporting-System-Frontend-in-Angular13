import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleAddComponent } from './role-add/role-add.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';

export const routes = [
  { path: '', component: RoleListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    RoleListComponent,
    RoleAddComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    MatTooltipModule
  ]
})
export class RoleModule { }
