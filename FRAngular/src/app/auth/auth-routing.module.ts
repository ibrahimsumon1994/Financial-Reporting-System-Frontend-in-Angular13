import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';

const authRoutes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'auth', component: SigninComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
