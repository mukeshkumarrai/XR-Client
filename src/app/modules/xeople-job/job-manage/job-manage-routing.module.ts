import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkDeniedComponent } from '@app/modules/errors/link-denied/link-denied.component';
import { CreateJobSelectionComponent } from './create-job-selection/create-job-selection.component';
import { JobManageComponent } from './job-manage.component';

const routes: Routes = [
  { path: 'manage', component: JobManageComponent},
  { path: 'create-job-selection', component: CreateJobSelectionComponent},
  { path: 'access-denied', component: LinkDeniedComponent },
  { path: '**', redirectTo: 'manage' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobManageRoutingModule { }
