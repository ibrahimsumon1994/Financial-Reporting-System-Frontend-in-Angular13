import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignationAddComponent } from './designation-add/designation-add.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: DesignationListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    DesignationAddComponent,
    DesignationListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DesignationModule { }
