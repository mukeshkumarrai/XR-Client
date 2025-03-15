import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { LinkDeniedComponent } from '../errors/link-denied/link-denied.component';
import { CareerComponent } from '../EWM.core/job/career/career.component';
import { ConfigureJobBoardComponent } from '../EWM.core/job/configure-job-board/configure-job-board.component';
import { SampleComponent } from '../EWM.core/sample/sample.component';
import { CandidateJobMappedComponent } from './candidate-job-mapped/candidate-job-mapped.component';
import { JobSettingsComponent } from './job-settings/job-settings.component';
const routes: Routes = [  {
  path: 'job',
  children: [
{ path: 'job-workflow', loadChildren: () => import(`./job-workflow/job-workflow-routing.module`).then(m => m.JobWorkflowRoutingModule)},
{ path: 'job-list', loadChildren: () => import(`./job-list/job-list-routing.module`).then(m => m.JobListRoutingModule)},
{ path: 'job-detail', loadChildren: () => import(`./job-detail/job-detail-routing.module`).then(m => m.JobDetailRoutingModule), canActivate: [AuthGuard] },
{ path: 'job-screening', loadChildren: () => import(`./job-screening/job-screening-routing.module`).then(m => m.JobScreeningRoutingModule)},
{ path: 'job-manage', loadChildren: () => import(`./job-manage/job-manage-routing.module`).then(m => m.JobManageRoutingModule)},
{ path: 'job-publish', loadChildren: () => import(`./job-publish/job-publish-routing.module`).then(m => m.JobPublishRoutingModule)},
{ path: 'job-publish-v1', loadChildren: () => import(`./job-publish-NEW/job-publish-routing.module`).then(m => m.JobPublishRoutingModule)},
{ path: 'landing',  loadChildren: () => import(`./job-workflow/job-workflow-routing.module`).then(m => m.JobWorkflowRoutingModule)},
{ path: 'job-requisitions', component: SampleComponent},
{ path: 'career', component: CareerComponent,  canActivate: [AuthGuard] },
{ path: 'masters', component: SampleComponent},
{ path: 'report', component: SampleComponent},
{ path: 'job-setting', component: JobSettingsComponent, canActivate: [AuthGuard] },
{ path: 'candidate-job-mapped', component: CandidateJobMappedComponent, canActivate: [AuthGuard] },
{ path: 'mapping-configuration', component: ConfigureJobBoardComponent, canActivate: [AuthGuard] },
{ path: 'access-denied', component: LinkDeniedComponent },
{ path: '**', redirectTo: 'job-workflow' }

]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeopleJobRoutingModule { }
