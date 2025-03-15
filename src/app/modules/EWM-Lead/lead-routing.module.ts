import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkDeniedComponent } from '../errors/link-denied/link-denied.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { ConvertLeadClientComponent } from './convert-lead-client/convert-lead-client.component';
import { LeadWorklfowLandingComponent } from './lead-workflow/lead-workflow-landing.component';
import { LeadListingComponent } from './lead-listing/lead-listing.component';
import { AuthGuard } from '@app/shared/guard/auth.guard';
import { ClientDetailComponent } from '../EWM.core/client/client-detail/client-detail.component';

const routes: Routes = [
  {
        path: 'lead',
        children: [
          { path: 'lead-details', component: LeadDetailsComponent},
          { path: 'lead-landing', component: LeadWorklfowLandingComponent},
          { path: 'lead-listing', component: LeadListingComponent},
          { path: 'lead-detail-summary', component: ClientDetailComponent},
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: '**', component: LeadWorklfowLandingComponent }
          // { path: 'convert-lead', component: ConvertLeadClientComponent},

      
        ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }
