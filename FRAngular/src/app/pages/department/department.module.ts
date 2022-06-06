import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentAddComponent } from './department-add/department-add.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: DepartmentListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    DepartmentAddComponent,
    DepartmentListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DepartmentModule { }
