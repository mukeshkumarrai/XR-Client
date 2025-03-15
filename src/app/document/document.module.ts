import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DocumentRoutingModule } from './document-routing.module';
import { GenrateOtpComponent } from './genrate-otp/genrate-otp.component';
import { DocumentHeaderComponent } from './shared/document-header/document-header.component';
//import { DocumentComponent } from './document.component';
import { NgOtpInputModule } from 'ng-otp-input';
import{DocumentlistComponent} from 'src/app/document/documentlist/documentlist.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { RequestGdprContentPageComponent } from './request-gdpr-content-page/request-gdpr-content-page.component';
import { CareerPageComponent } from './career-page/career-page.component';



@NgModule({
  declarations: [
    //DocumentComponent,
    GenrateOtpComponent,
    DocumentHeaderComponent,
    DocumentlistComponent,
    // RequestGdprContentPageComponent,
    CareerPageComponent
  ],
  imports: [
    CommonModule,
    DocumentRoutingModule,
    SharedModule,
    NgOtpInputModule,
    InfiniteScrollModule
  ]
})
export class DocumentModule { }
