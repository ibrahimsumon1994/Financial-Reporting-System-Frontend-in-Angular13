import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitAddComponent } from './unit-add/unit-add.component';
import { UnitListComponent } from './unit-list/unit-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

export const routes = [
  { path: '', component: UnitListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    UnitAddComponent,
    UnitListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UnitModule { }
