import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { LinkDeniedComponent } from '../errors/link-denied/link-denied.component';
import { SampleComponent } from '../EWM.core/sample/sample.component';
import { ModulesComponent } from '../modules.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

const routes: Routes = [
  {
    // path: '',
    // component: ModulesComponent,
    // children: [
    //   {
        path: 'employees',
        children: [
          { path: 'employee-list', component: EmployeeListComponent, canActivate: [AuthGuard]},
          { path: 'employee-detail', component: EmployeeDetailComponent , canActivate: [AuthGuard]},
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: 'report', component: SampleComponent},
          { path: 'masters', component: SampleComponent},

          { path: '**', redirectTo: 'employee-list' }

        ]
     // },
   // ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
