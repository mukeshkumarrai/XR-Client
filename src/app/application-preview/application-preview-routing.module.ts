import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ApplicationPreviewComponent } from './application-preview.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { CandidateCheckComponent } from './candidate-check/candidate-check.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationPreviewComponent,
    children: [
      { path: 'preview', component: LandingPageComponent },
      { path: 'apply', component: LandingPageComponent },
      { path: 'success', component: SuccessDialogComponent },
      { path: 'send-otp', component: OtpVerificationComponent },
      {path:'candidate-exists',component:CandidateCheckComponent},
      { path: '**', component: LandingPageComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationPreviewRoutingModule { }
