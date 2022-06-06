import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderListComponent } from './header-list/header-list.component';
import { HeaderAddComponent } from './header-add/header-add.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: HeaderListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    HeaderListComponent,
    HeaderAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HeaderModule { }
