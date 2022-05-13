import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { DashboardComponent } from './dashboard.component';


// routing
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule,
    ReactiveFormsModule, 
    CoreCommonModule
  ]
})
export class DashboardModule { }
