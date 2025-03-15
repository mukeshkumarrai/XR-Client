import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { JobPublishRoutingModule } from './job-publish-routing.module';
import { JobPublishComponent } from './job-publish.component';
import { JobPublishDetailsComponent } from './job-publish-details/job-publish-details.component';
import { JobAddDetailsComponent } from './job-add-details/job-add-details.component';
import { MapApplicationFormSeekComponent } from './map-application-form-seek/map-application-form-seek.component';
import { RepublishJobComponent } from './republish-job/republish-job.component';
import { SeekPostSubmitResponseComponent } from './seek-post-submit-response/seek-post-submit-response.component';
import { BroadbeanComponent } from './broadbean/broadbean.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '@app/shared/shared.module';
import { JobIndeedComponent } from './job-indeed/job-indeed.component';
import { JobIndeedDescriptionComponent } from './job-indeed-description/job-indeed-description.component';
import { JobIndeedPublishedComponent } from './job-indeed-published/job-indeed-published.component';
import { JobPublishIndeedDetailsComponent } from './job-publish-indeed-details/job-publish-indeed-details.component';


@NgModule({
  declarations: [JobPublishComponent, JobPublishDetailsComponent, JobAddDetailsComponent, MapApplicationFormSeekComponent, RepublishJobComponent, SeekPostSubmitResponseComponent, BroadbeanComponent, JobIndeedComponent, JobIndeedDescriptionComponent, JobIndeedPublishedComponent, JobPublishIndeedDetailsComponent],
  imports: [
    CommonModule,
    JobPublishRoutingModule,
    NgSelectModule,
    InfiniteScrollModule,
    SharedModule
  ]
})
export class JobPublishModule { }
