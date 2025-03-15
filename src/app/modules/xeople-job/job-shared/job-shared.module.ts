import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { JobFilterDialogComponent } from './job-filter-dialog/job-filter-dialog.component';
import { JobActionDialogComponent } from './job-action-dialog/job-action-dialog.component';
import { SearchPipe } from './job-action-dialog/search.pipe';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [JobFilterDialogComponent, JobActionDialogComponent, SearchPipe],
  imports: [
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    NgSelectModule
  ],
  exports: [
    SearchPipe
  ],
  providers: []
})
export class JobSharedModule { }
