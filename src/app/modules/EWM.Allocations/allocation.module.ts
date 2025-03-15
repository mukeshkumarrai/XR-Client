import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllocationRoutingModule } from './allocation-routing.module';
import { AllocationLandingPageComponent } from './allocation-landing-page/allocation-landing-page.component';


@NgModule({
  declarations: [AllocationLandingPageComponent],
  imports: [
    CommonModule,
    AllocationRoutingModule
  ]
})
export class AllocationModule { }
