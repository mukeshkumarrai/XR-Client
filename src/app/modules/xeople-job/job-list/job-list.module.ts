import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListRoutingModule } from './job-list-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwiperModule } from 'swiper/angular';
import { JobSharedModule } from '../job-shared/job-shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    JobListRoutingModule,
    InfiniteScrollModule,
    NgSelectModule,
    SwiperModule,
    JobSharedModule
  ]
})
export class JobListModule { }
