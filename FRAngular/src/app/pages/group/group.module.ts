import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupListComponent } from './group-list/group-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: GroupListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    GroupAddComponent,
    GroupListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class GroupModule { }
