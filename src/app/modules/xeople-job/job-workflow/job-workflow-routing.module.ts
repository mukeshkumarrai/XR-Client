import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkDeniedComponent } from '@app/modules/errors/link-denied/link-denied.component';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { JobWorkflowComponent } from './job-workflow.component';

const routes: Routes = [
    { path: 'workflow', component: JobWorkflowComponent ,canActivate: [AuthGuard]},
    { path: 'access-denied', component: LinkDeniedComponent },
    { path: '**', redirectTo: 'workflow' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobWorkflowRoutingModule { }
