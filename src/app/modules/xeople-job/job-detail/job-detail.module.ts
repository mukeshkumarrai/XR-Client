import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDetailRoutingModule } from './job-detail-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwiperModule } from 'swiper/angular';
import { JobSmsComponent } from './job-sms/job-sms.component';
import { SmsHistoryComponent } from './job-sms/sms-history/sms-history.component';
import { BulkSmsComponent } from './job-sms/bulk-sms/bulk-sms.component';
import { MapApplicationFormComponent } from './map-application-form/map-application-form.component';
import { ShareJobApplicationUrlComponent } from './share-job-application-url/share-job-application-url.component';
import { JobSharedModule } from '../job-shared/job-shared.module';
import { RestrictCandidateComponent } from './search-candidate/restrict-candidate/restrict-candidate.component';
import { SearchJobNoteByContactComponent } from './job-notes/search-job-note-by-contact/search-job-note-by-contact.component';
// import { AddJobCallComponent } from './add-job-call/add-job-call.component';
// import { JobCallHistroyComponent } from './job-call-histroy/job-call-histroy.component';



@NgModule({
  declarations: [JobSmsComponent, SmsHistoryComponent, BulkSmsComponent, MapApplicationFormComponent, 
    ShareJobApplicationUrlComponent, RestrictCandidateComponent, SearchJobNoteByContactComponent],
  imports: [
    CommonModule,
    JobDetailRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    NgSelectModule,
    SwiperModule,
    JobSharedModule
  ]
})
export class JobDetailModule { }
