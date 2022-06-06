import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionAddComponent } from './transaction-add/transaction-add.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes = [
  { path: '', component: TransactionAddComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    TransactionAddComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule
  ]
})
export class TransactionModule { }
