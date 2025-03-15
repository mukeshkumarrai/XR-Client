import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RostersRoutingModule } from './rosters-routing.module';
import { RostersLandingPageComponent } from './rosters-landing-page/rosters-landing-page.component';


@NgModule({
  declarations: [RostersLandingPageComponent],
  imports: [
    CommonModule,
    RostersRoutingModule
  ]
})
export class RostersModule { }
