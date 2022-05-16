import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CoreCommonModule } from '@core/common.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardService } from './dashboard.service';


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
    NgApexchartsModule,
    CoreCommonModule
  ],
  providers: [DashboardService],
})
export class DashboardModule { }
