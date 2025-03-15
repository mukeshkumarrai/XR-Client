import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecruitmentRoutingModule } from './recruitment-routing.module';
import { RecruitmentLandingPageComponent } from './recruitment-landing-page/recruitment-landing-page.component';


@NgModule({
  declarations: [RecruitmentLandingPageComponent],
  imports: [
    CommonModule,
    RecruitmentRoutingModule
  ]
})
export class RecruitmentModule { }
