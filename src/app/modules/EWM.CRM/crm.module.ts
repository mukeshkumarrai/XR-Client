import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmRoutingModule } from './crm-routing.module';
import { CrmLandingPageComponent } from './crm-landing-page/crm-landing-page.component';


@NgModule({
  declarations: [CrmLandingPageComponent],
  imports: [
    CommonModule,
    CrmRoutingModule
  ]
})
export class CrmModule { }
