import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XeopleJobRoutingModule } from './xeople-job-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { JobPublishModule } from './job-publish/job-publish.module';
import { JobPublishModulev1 } from './job-publish-NEW/job-publish.module';
import { JobSummaryModule } from './job-summary/job-summary.module';
import { JobScreeningModule } from './job-screening/job-screening.module';
import { JobWorkflowModule } from './job-workflow/job-workflow.module';
import { JobListModule } from './job-list/job-list.module';
import { JobDetailModule } from './job-detail/job-detail.module';
import { JobManageModule } from './job-manage/job-manage.module';
import { JobSharedModule } from '../xeople-job/job-shared/job-shared.module';
import { CandidateJobMappedComponent } from './candidate-job-mapped/candidate-job-mapped.component';
import { JobSettingsComponent } from './job-settings/job-settings.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonSharedModule } from '@app/shared/common-shared.module';


@NgModule({
  declarations: [JobSettingsComponent, CandidateJobMappedComponent],
  imports: [
    CommonModule,
    XeopleJobRoutingModule,
    SharedModule,
    JobPublishModule,
    JobPublishModulev1,
    JobSummaryModule,
    JobScreeningModule,
    JobWorkflowModule,
    JobListModule,
    JobDetailModule,
    JobManageModule,
    JobSharedModule,
    InfiniteScrollModule,
    CommonSharedModule,
    JobPublishModulev1,
  ]
})
export class XeopleJobModule { }
