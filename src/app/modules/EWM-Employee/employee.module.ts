import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeSummaryComponent } from './employee-detail/employee-summary/employee-summary.component';
import { EmployeeNotesComponent } from './employee-detail/employee-notes/employee-notes.component';
import { EmployeeActivityComponent } from './employee-detail/employee-activity/employee-activity.component';
import { DateFilterComponent } from './employee-detail/employee-activity/date-filter/date-filter.component';
import { DateFilterActivityComponent } from './employee-detail/employee-activity/date-filter-activity/date-filter-activity.component';
import { OwnerFilterActivityComponent } from './employee-detail/employee-activity/owner-filter-activity/owner-filter-activity.component';
import { MarkDoneActivityComponent } from './employee-detail/employee-activity/mark-done-activity/mark-done-activity.component';
import { CategoryFilterActivityComponent } from './employee-detail/employee-activity/category-filter-activity/category-filter-activity.component';
import { ManageAccessActivityComponent } from './employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { RevokeActivityAccessComponent } from './employee-detail/employee-activity/revoke-activity-access/revoke-activity-access.component';
import { EmployeeHistoryComponent } from './employee-detail/employee-history/employee-history.component';
import { EmployeeSmsComponent } from './employee-detail/employee-sms/employee-sms.component';


@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeDetailComponent,
    EmployeeSummaryComponent,
    EmployeeNotesComponent,
    EmployeeActivityComponent,
    DateFilterComponent,
    DateFilterActivityComponent,
    OwnerFilterActivityComponent,
    MarkDoneActivityComponent,
    CategoryFilterActivityComponent,
    ManageAccessActivityComponent,
    RevokeActivityAccessComponent,
    EmployeeHistoryComponent,
    EmployeeSmsComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
