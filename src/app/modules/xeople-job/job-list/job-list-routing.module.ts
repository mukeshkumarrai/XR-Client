import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkDeniedComponent } from '@app/modules/errors/link-denied/link-denied.component';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { RepublishJobComponent } from '../job-publish-NEW/republish-job/republish-job.component';
import { JobListComponent } from './job-list.component';
const routes: Routes = [
  { path: 'list', component: JobListComponent ,canActivate: [AuthGuard]},
   { path: 'list/:Id', component: JobListComponent ,canActivate: [AuthGuard]},
   { path: 'list/republish-job', component: RepublishJobComponent},
   { path: 'list/:Id/republish-job', component: RepublishJobComponent },
   { path: 'access-denied', component: LinkDeniedComponent },
  { path: '**', redirectTo: 'list' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobListRoutingModule { }
