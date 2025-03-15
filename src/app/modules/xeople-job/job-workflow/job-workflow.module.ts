import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobWorkflowRoutingModule } from './job-workflow-routing.module';
import { JobWorkflowComponent } from './job-workflow.component';
import { SharedModule } from '@app/shared/shared.module';
import { ViewWorkflowStagesComponent } from './view-workflow-stages/view-workflow-stages.component';
import { NgxOrgChartModule } from 'ngx-org-chart';


@NgModule({
  declarations: [JobWorkflowComponent, ViewWorkflowStagesComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxOrgChartModule,
    JobWorkflowRoutingModule
  ]
})
export class JobWorkflowModule { }
