import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCodeAddComponent } from './common-code-add/common-code-add.component';
import { CommonCodeListComponent } from './common-code-list/common-code-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: CommonCodeListComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    CommonCodeAddComponent,
    CommonCodeListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CommonCodeModule { }
