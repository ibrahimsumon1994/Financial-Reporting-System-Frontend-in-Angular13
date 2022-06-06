import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuAddComponent } from './menu-add/menu-add.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { IconList } from 'src/app/shared/models/icon-list';
import { MatTooltipModule } from '@angular/material/tooltip';


export const routes = [
    {path: '', component: MenuListComponent, pathMatch: 'full'}
]

@NgModule({
  declarations: [
    MenuAddComponent,
    MenuListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    MatTooltipModule

  ],
  providers:[
    IconList
  ]
})

export class MenuModule { }
