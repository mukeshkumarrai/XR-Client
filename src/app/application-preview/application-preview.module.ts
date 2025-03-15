import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationPreviewRoutingModule } from './application-preview-routing.module';
import { UploadResumeComponent } from './upload-resume/upload-resume.component';
import { UploadDocsComponent } from './upload-docs/upload-docs.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { KnockoutQuesComponent } from './knockout-ques/knockout-ques.component';
import { CustomStepperComponent } from './custom-stepper/custom-stepper.component';
import { ApplicationPreviewComponent } from './application-preview.component';
import { SharedModule } from '../shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ParsedResumeComponent } from './parsed-resume/parsed-resume.component';
import { DocumentPopupComponent } from './upload-docs/document-popup/document-popup.component';
import { SkillPopupComponent } from './personal-info/skill-popup/skill-popup.component';
import { ExperiencePopupComponent } from './personal-info/experience-popup/experience-popup.component';
import { EducationPopupComponent } from './personal-info/education-popup/education-popup.component';
import { DocumentPopupApplyComponent } from './upload-docs/document-popup-apply/document-popup-apply.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSelectModule } from '@ng-select/ng-select';
import { NumberpipePipe } from './shared/numberpipe.pipe';
import { ManageSkillsComponent } from './personal-info/skill-popup/manage-skills/manage-skills.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { CoverLetterPopupComponent } from './personal-info/cover-letter-popup/cover-letter-popup.component';
import { CoverLetterUploadComponent } from './personal-info/cover-letter-popup/cover-letter-upload/cover-letter-upload.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { CandidateCheckComponent } from './candidate-check/candidate-check.component';
import { ApplicationAlertMessageComponent } from './application-alert-message/application-alert-message.component';
import { SkillTagPopupComponent } from './personal-info/skill-popup/skill-tag-popup/skill-tag-popup.component';
import { ImportantLinksComponent } from './important-links/important-links.component';

@NgModule({
  declarations: [
    ApplicationPreviewComponent,
    LandingPageComponent,
    CustomStepperComponent,
    UploadResumeComponent,
    UploadDocsComponent,
    SuccessDialogComponent,
    PersonalInfoComponent,
    KnockoutQuesComponent,
    ParsedResumeComponent,
    DocumentPopupComponent,
    SkillPopupComponent,
    ExperiencePopupComponent,
    EducationPopupComponent,
    DocumentPopupApplyComponent,
    NumberpipePipe,
    ManageSkillsComponent,
    OtpVerificationComponent,
    CoverLetterPopupComponent,
    CoverLetterUploadComponent,
    CandidateCheckComponent,
    ApplicationAlertMessageComponent,
    SkillTagPopupComponent,
    ImportantLinksComponent,
    
  ],
  imports: [
    CommonModule,
    ApplicationPreviewRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    NgSelectModule,
    NgOtpInputModule
  ]
})
export class ApplicationPreviewModule { }
