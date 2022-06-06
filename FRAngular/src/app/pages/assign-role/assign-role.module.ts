import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssignRoleAddComponent } from './assign-role-add/assign-role-add.component';
import { AssignRoleListComponent } from './assign-role-list/assign-role-list.component';

export const routes = [
  { path: '', component: AssignRoleListComponent, pathMatch: 'full' }
];



@NgModule({
  declarations: [
    AssignRoleAddComponent,
    AssignRoleListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AssignRoleModule { }
