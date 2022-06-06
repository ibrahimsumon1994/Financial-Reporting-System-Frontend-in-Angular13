import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: UserProfileEditComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    UserProfileEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class UserProfileModule { }
