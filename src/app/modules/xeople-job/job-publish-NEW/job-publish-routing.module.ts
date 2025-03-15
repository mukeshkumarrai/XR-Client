import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkDeniedComponent } from '@app/modules/errors/link-denied/link-denied.component';
import { BroadbeanComponent } from './broadbean/broadbean.component';
import { JobAddDetailsComponent } from './job-add-details/job-add-details.component';
import { JobIndeedPublishedComponent } from './job-indeed-published/job-indeed-published.component';
import { JobIndeedComponent } from './job-indeed/job-indeed.component';
import { JobPublishDetailsComponent } from './job-publish-details/job-publish-details.component';
import { JobPublishIndeedDetailsComponent } from './job-publish-indeed-details/job-publish-indeed-details.component';
import { JobPublishComponent } from './job-publish.component';
import { RepublishJobComponent } from './republish-job/republish-job.component';
import { SeekPostSubmitResponseComponent } from './seek-post-submit-response/seek-post-submit-response.component';
import { SeekUpdateDetailsComponent } from './seek-update-details/seek-update-details.component';

const routes: Routes = [
  { path: 'publish', component: JobPublishComponent},
  { path: 'job-add-details', component: JobAddDetailsComponent},
  { path: 'job-publish-details', component: JobPublishDetailsComponent},
  { path: 'republish-job', component: RepublishJobComponent},
  { path: 'seek-submit-response', component: SeekPostSubmitResponseComponent},
  { path: 'broadbean', component: BroadbeanComponent},
  { path: 'job-add-indeed', component: JobIndeedComponent},
  { path: 'job-publish-indeed-details', component: JobPublishIndeedDetailsComponent},
  { path: 'indeed-published', component: JobIndeedPublishedComponent},
  { path: 'access-denied', component: LinkDeniedComponent },

  { path: 'seek-update-details', component: SeekUpdateDetailsComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobPublishRoutingModule { }
