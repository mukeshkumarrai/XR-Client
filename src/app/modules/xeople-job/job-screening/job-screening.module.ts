import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobScreeningRoutingModule } from './job-screening-routing.module';
import { JobScreeningComponent } from './job-screening.component';
import { JobStatusComponent } from './job-status/job-status.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { JobCommentsComponent } from './job-comments/job-comments.component';
import { JobInterviewComponent } from './job-interview/job-interview.component';
import { JobChecklistComponent } from './job-checklist/job-checklist.component';
import { JobCandidateComponent } from './right-panel/job-candidate/job-candidate.component';
import { JobCandidateResumeComponent } from './right-panel/job-candidate/job-candidate-resume/job-candidate-resume.component';
import { JobCandidateCoverPageComponent } from './right-panel/job-candidate/job-candidate-cover-page/job-candidate-cover-page.component';
import { JobActivityCreateComponent } from './header-panel/job-activity-create/job-activity-create.component';
import { JobActivityListComponent } from './header-panel/job-activity-list/job-activity-list.component';

import { JobCandidateApplicationFormComponent } from './right-panel/job-candidate/job-candidate-application-form/job-candidate-application-form.component';
import { JobCandidateKeyWordSearchComponent } from './right-panel/job-candidate/job-candidate-key-word-search/job-candidate-key-word-search.component';
import { JobNoteComponent } from './job-note/job-note.component';
import { JobNoteListComponent } from './job-note/job-note-list/job-note-list.component';
import { FilterJobCommentsComponent } from './job-comments/filter-job-comments/filter-job-comments.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { JobCategoryFilterComponent } from './header-panel/job-category-filter/job-category-filter.component';
import { FilterPipeInterviewPipe } from './job-interview/filter-pipe-interview.pipe';
import { JobCandidateDocumentsComponent } from './right-panel/job-candidate/job-candidate-documents/job-candidate-documents.component';
import { JobActionCandidateNotesComponent } from './right-panel/job-candidate/job-action-candidate-notes/job-action-candidate-notes.component';
import { JobActionCandidateAddNotesComponent } from './right-panel/job-candidate/job-action-candidate-add-notes/job-action-candidate-add-notes.component';
import { JobActionJobNotesComponent } from './right-panel/job-tabs/job-action-job-notes/job-action-job-notes.component';
import { JobActionAddJobNotesComponent } from './right-panel/job-tabs/job-action-add-job-notes/job-action-add-job-notes.component';
import { JobTabActionComponent } from './right-panel/job-tabs/job-tab-action/job-tab-action.component';
import { JobActionAddClientNotesComponent } from './right-panel/client-tabs/job-action-add-client-notes/job-action-add-client-notes.component';
import { ClientTabActionComponent } from './right-panel/client-tabs/client-tab-action/client-tab-action.component';
import { JobActionClientNotesComponent } from './right-panel/client-tabs/job-action-client-notes/job-action-client-notes.component';
import { JobDetailsDiscriptionComponent } from './right-panel/job-tabs/job-details-discription/job-details-discription.component';
import { ShowDiscriptionComponent } from './right-panel/job-tabs/show-discription/show-discription.component'
import { JobActionJobDocumentsComponent } from './right-panel/job-tabs/job-action-job-documents/job-action-job-documents.component';
import { JobActionClientDocumentsComponent } from './right-panel/client-tabs/job-action-client-documents/job-action-client-documents.component';
import { SingleGroupChecklistComponent } from './job-checklist/single-group-checklist/single-group-checklist.component';
import { AddMapChecklistComponent } from './job-checklist/add-map-checklist/add-map-checklist.component'
import { JobActionClientContactlistComponent } from './right-panel/client-tabs/job-action-client-contactlist/job-action-client-contactlist.component';
import { UploadDocumentChecklistComponent } from './job-checklist/upload-document-checklist/upload-document-checklist.component';
import { GroupChecklistComponent } from './job-checklist/single-group-checklist/group-checklist/group-checklist.component'
import { SharedModule } from '@app/shared/shared.module';
import { JobCandidateMailboxComponent } from './right-panel/job-candidate/job-candidate-mailbox/job-candidate-mailbox.component';
import { JobClientMailboxComponent } from './right-panel/client-tabs/job-client-mailbox/job-client-mailbox.component';
import { JobCandidateActivityComponent } from './right-panel/job-candidate/job-candidate-activity/job-candidate-activity.component';
import { JobActionClientActivityComponent } from './right-panel/client-tabs/job-action-client-activity/job-action-client-activity.component';
import { PushCandidateToEohComponent } from './push-candidate-to-eoh/push-candidate-to-eoh.component';
import { PushcandidateToEohFromPopupComponent } from './pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';
import { PushCandidateSuccessPoupComponent } from './pushcandidate-to-eoh-from-popup/push-candidate-success-poup/push-candidate-success-poup.component';
import { CommonSharedModule } from '@app/shared/common-shared.module';
import { ScreeningActionComponent } from './push-candidate-to-eoh/screening-action/screening-action.component';
import { ReviewFinalSummaryComponent } from './push-candidate-to-eoh/review-final-summary/review-final-summary.component';
import { CandidateScreeningComponent } from './push-candidate-to-eoh/candidate-screening/candidate-screening.component';
import { ScreeningNotesComponent } from './push-candidate-to-eoh/screening-notes/screening-notes.component';
/*import { ChecklistComponent } from '../../EWM.core/system-settings/checklist/checklist.component';*/
import { DescriptionPopupComponent } from './job-checklist/popup/description-popup/description-popup.component';
import { EmploymentStatusComponent } from './push-candidate-to-eoh/employment-status/employment-status.component';
import { ApplicantMemberComponent } from './push-candidate-to-eoh/applicant-member/applicant-member.component';
import { SharedJobComponent } from './shared-job/shared-job.component';
import { SharejobClientMemberOrderComponent } from './shared-job/sharejob-client-member-order/sharejob-client-member-order.component';
import { JobOrderComponent } from './shared-job/job-order/job-order.component';
import { PushMemberSuccessPopupComponent } from './pushcandidate-to-eoh-from-popup/push-member-success-popup/push-member-success-popup.component';


@NgModule({
  declarations: [
    JobScreeningComponent,
    JobStatusComponent,
    JobCommentsComponent,
    JobInterviewComponent,
    JobChecklistComponent,
    JobCandidateComponent,
    JobCandidateResumeComponent,
    JobCandidateCoverPageComponent,
    JobCandidateApplicationFormComponent,
    JobCandidateKeyWordSearchComponent,
    JobActivityCreateComponent,
    JobActivityListComponent,
    JobNoteListComponent,
    FilterJobCommentsComponent,
    FilterPipeInterviewPipe,
    JobCandidateDocumentsComponent,
    JobActionCandidateNotesComponent,
    JobActionCandidateAddNotesComponent,
    JobActionJobNotesComponent,
    JobActionAddJobNotesComponent,
    JobTabActionComponent,
    JobActionAddClientNotesComponent,
    ClientTabActionComponent,
    JobActionClientNotesComponent,
    JobDetailsDiscriptionComponent,
    ShowDiscriptionComponent,
    JobActionJobDocumentsComponent,
    JobActionClientDocumentsComponent,
    SingleGroupChecklistComponent,
    AddMapChecklistComponent,
    JobActionClientContactlistComponent,
    UploadDocumentChecklistComponent,
    GroupChecklistComponent,
    JobCandidateMailboxComponent,
    JobClientMailboxComponent,
    JobCandidateActivityComponent,
    JobActionClientActivityComponent,
    PushCandidateToEohComponent,
    PushcandidateToEohFromPopupComponent,
    PushCandidateSuccessPoupComponent,
    JobNoteComponent,
    ScreeningActionComponent,
    CandidateScreeningComponent,
    ReviewFinalSummaryComponent,
    ScreeningNotesComponent,
    DescriptionPopupComponent,
    EmploymentStatusComponent,
    ApplicantMemberComponent,
    SharedJobComponent,
    SharejobClientMemberOrderComponent,
    JobOrderComponent,
    PushMemberSuccessPopupComponent
  ],
  imports: [
    CommonModule,
    JobScreeningRoutingModule,
    NgSelectModule,
    InfiniteScrollModule,
    SharedModule,
    CommonSharedModule
  ]
})
export class JobScreeningModule { }
