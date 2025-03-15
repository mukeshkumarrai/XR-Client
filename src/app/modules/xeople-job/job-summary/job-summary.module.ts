import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobSummaryRoutingModule } from './job-summary-routing.module';
import { JobSummaryComponent } from './job-summary.component';
import { WorkflowLandingComponent } from './workflow-landing/workflow-landing.component';
import { JobSharedModule } from '../job-shared/job-shared.module';


@NgModule({
  declarations: [
    JobSummaryComponent,
    WorkflowLandingComponent
  ],
  imports: [
    CommonModule,
    JobSummaryRoutingModule,
    JobSharedModule
  ]
})
export class JobSummaryModule { }
