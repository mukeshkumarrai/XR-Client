import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobDetailComponent } from './job-detail.component';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { LinkDeniedComponent } from '@app/modules/errors/link-denied/link-denied.component';
const routes: Routes = [
  { path: 'detail', component: JobDetailComponent,canActivate: [AuthGuard]},
  { path: 'access-denied', component: LinkDeniedComponent },
  { path: '**', redirectTo: 'detail' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDetailRoutingModule { }
