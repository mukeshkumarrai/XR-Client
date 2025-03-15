import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobManageRoutingModule } from './job-manage-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateJobSelectionComponent } from './create-job-selection/create-job-selection.component';
import { CreateJobAndClientPopupComponent } from './create-job-and-client-popup/create-job-and-client-popup.component';
import { CopyJobComponent } from './copy-job/copy-job.component';
import { JobSharedModule } from '../job-shared/job-shared.module';


@NgModule({
  declarations: [CreateJobSelectionComponent, CreateJobAndClientPopupComponent, CopyJobComponent],
  imports: [
    CommonModule,
    SharedModule,
    JobManageRoutingModule,
    InfiniteScrollModule,
    NgSelectModule,
    JobSharedModule
  ]
})
export class JobManageModule { }
