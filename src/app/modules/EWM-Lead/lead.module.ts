import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LeadRoutingModule } from './lead-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonSharedModule } from '@app/shared/common-shared.module';
import { LeadWorklfowLandingComponent } from './lead-workflow/lead-workflow-landing.component';
import { ConvertLeadClientComponent } from './convert-lead-client/convert-lead-client.component';
import { ViewLeadWorkflowStagesComponent } from './lead-workflow/view-lead-workflow-stages/view-lead-workflow-stages.component';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { SwiperModule } from 'swiper/angular';
import { LeadListingComponent } from './lead-listing/lead-listing.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LeadMailComponent } from './lead-mail/lead-mail.component';
import { LeadInfoPopupComponent } from './lead-info-popup/lead-info-popup.component';
import { LeadWorkflowStagesMappedPopupComponent } from './lead-workflow-stages-mapped-popup/lead-workflow-stages-mapped-popup.component';

@NgModule({
  declarations: [LeadWorklfowLandingComponent, ConvertLeadClientComponent, ViewLeadWorkflowStagesComponent,LeadDetailsComponent, LeadListingComponent,
    LeadMailComponent,
    LeadInfoPopupComponent,
    LeadWorkflowStagesMappedPopupComponent
  ],
  imports: [
    CommonModule,
    LeadRoutingModule,
    SharedModule,NgSelectModule,CommonSharedModule,NgxOrgChartModule,InfiniteScrollModule,SwiperModule
  ]
})
export class LeadModule { }
