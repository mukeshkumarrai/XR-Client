import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceLandingPageComponent } from './finance-landing-page/finance-landing-page.component';


@NgModule({
  declarations: [FinanceLandingPageComponent],
  imports: [
    CommonModule,
    FinanceRoutingModule
  ]
})
export class FinanceModule { }
