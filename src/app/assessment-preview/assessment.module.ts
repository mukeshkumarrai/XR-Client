import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssessmentRoutingModule } from './assessment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AssessmentPreviewComponent } from './assessment-preview.component';
import { AssessmentTestComponent } from './assessment-test/assessment-test.component';
import { SuccessMsgComponent } from './success-msg/success-msg.component';
import { AssessmentPipe } from './assessment.pipe';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  declarations: [
    AssessmentPreviewComponent,
    WelcomePageComponent,
    AssessmentTestComponent,
    SuccessMsgComponent,
    AssessmentPipe
  ],
  imports: [
    CommonModule,
    SwiperModule,
    AssessmentRoutingModule,
    SharedModule
  ]
})
export class AssessmentModule { }
