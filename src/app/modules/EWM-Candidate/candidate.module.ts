import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { CandidateSummaryComponent } from './profile-summary/candidate-summary/candidate-summary.component';
import { UploadNewResumeComponent } from './profile-summary/candidate-resume/upload-new-resume/upload-new-resume.component';
import { CandidateConfigureDashboardComponent } from './profile-summary/candidate-configure-dashboard/candidate-configure-dashboard.component';
import { AdvancedFilterCandidateComponent } from './candidate-list/advanced-filter-candidate/advanced-filter-candidate.component';
import { DependentpopupComponent } from './dependentpopup/dependentpopup.component';
import { SharedModule } from '@progress/kendo-angular-grid';
import { GeneralInformationComponent } from './profile-summary/general-information/general-information.component';
import { CandidateLocationComponent } from './profile-summary/general-information/candidate-location/candidate-location.component';
import { RecentnotesComponent } from './recentnotes/recentnotes.component';
import { RecentnotesPopupComponent } from './recentnotes/recentnotes-popup/recentnotes-popup.component';
import { CandidateResumeComponent } from './profile-summary/candidate-resume/candidate-resume.component';
import { SkillsPopupComponent } from './profile-summary/skills-popup/skills-popup.component';
import { CandidateExperienceComponent } from './profile-summary/candidate-experience/candidate-experience.component';
import { CandidateAddressComponent } from './profile-summary/candidate-address/candidate-address.component';
import { CandidateEducationComponent } from './candidate-education/candidate-education.component';
import { CandidateEmergencyContactsComponent } from './profile-summary/candidate-emergency-contacts/candidate-emergency-contacts.component';
import { CandidateFolderComponent } from './candidate-folder/candidate-folder.component';
import { ManageCandidateFolderComponent } from './candidate-folder/manage-candidate-folder/manage-candidate-folder.component';
import { CandidateFolderFilterComponent } from './profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { FilterPipe } from '../../shared/pipe/filter.pipe';
import { AdditionalInfoPopupComponent } from './profile-summary/additional-info-popup/additional-info-popup.component';
import { CandidateDocumentComponent } from './candidate-document/candidate-document.component';
import { CreateNewDocumentComponent } from './candidate-document/create-new-document/create-new-document.component';
import { CreateFolderComponent } from './candidate-document/create-folder/create-folder.component';
import { CreateDocumentComponent } from './candidate-document/create-document/create-document.component';
import { SkillsComponent } from './../EWM.core/system-settings/skills/skills.component';
import { SkillGroupComponent } from './../EWM.core/system-settings/skill-group/skill-group.component';
import { ManageSkillComponent } from './../EWM.core/system-settings/skills/manage-skill/manage-skill.component';
import { ManageSkillGroupComponent } from './../EWM.core/system-settings/skill-group/manage-skill-group/manage-skill-group.component';
import { PdfViewerComponent } from './candidate-document/pdf-viewer/pdf-viewer.component';
import { ViewDocumentComponent } from './candidate-document/view-document/view-document.component';
import { GridTreeViewComponent } from './candidate-document/grid-tree-view/grid-tree-view.component';
import { ManageAccessComponent } from './candidate-document/manage-access/manage-access.component';
import { VersionComponent } from './candidate-document/version/version.component';
import { RemoveAccessListComponent } from './candidate-document/manage-access/remove-access-list/remove-access-list.component';
import { ShareDocumentComponent } from './candidate-document/share-document/share-document.component';
import { DocumentShareableLinkComponent } from './candidate-document/document-shareable-link/document-shareable-link.component';
import { RevokeaccessComponent } from './candidate-document/document-shareable-link/revokeaccess/revokeaccess.component';
import { CandidateInboxComponent } from './candidate-inbox/candidate-inbox.component';
import { CandidateJobComponent } from './candidate-job/candidate-job.component';
import { AsignJobComponent } from './candidate-job/asign-job/asign-job.component';
import { JobWorkflowStageComponent } from './candidate-job/job-workflow-stage/job-workflow-stage.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CandidateSkillsComponent } from './profile-summary/candidate-skills/candidate-skills.component';
import { ManageCandidateSkillsComponent } from './profile-summary/manage-candidate-skills/manage-candidate-skills.component';
import { RequestGdprpopupComponent } from './profile-summary/request-gdprpopup/request-gdprpopup.component';
//import { RequestGdprContentPageComponent } from './profile-summary/request-gdpr-content-page/request-gdpr-content-page.component';
import { ViewNotesComponent } from './recentnotes/view-notes/view-notes.component';
import { CoverPageComponent } from './profile-summary/cover-page/cover-page.component';
import { UploadCoverPageComponent } from './profile-summary/cover-page/upload-cover-page/upload-cover-page.component';
import { FilePreviwerComponent } from './profile-summary/candidate-resume/file-previwer/file-previwer.component';
import { CoverPageVersionHistoryComponent } from './profile-summary/cover-page/cover-page-version-history/cover-page-version-history.component';
import { CoverPageRenameComponent } from './profile-summary/cover-page/cover-page-rename/cover-page-rename.component';
import { CoverPageViewDetailsComponent } from './profile-summary/cover-page/cover-page-view-details/cover-page-view-details.component';
import { FileUploadComponent } from './profile-summary/cover-page/file-upload/file-upload.component';
import { ViewCandidateApplicationComponent } from './candidate-list/view-candidate-application/view-candidate-application.component';
import { CandidatePersonalInformationComponent } from './candidate-list/view-candidate-application/candidate-personal-information/candidate-personal-information.component';
import { CandidateKnockoutDetailsComponent } from './candidate-list/view-candidate-application/candidate-knockout-details/candidate-knockout-details.component';
import { CandidateDocumentInformationComponent } from './candidate-list/view-candidate-application/candidate-document-information/candidate-document-information.component';
import { CreateCandidateComponent } from './candidate-list/create-candidate/create-candidate.component';
import { XeopleSmartEmailComponent } from './candidate-list/xeople-smart-email/xeople-smart-email.component';
import { VxtAddCallLogComponent } from './candidate-list/vxt-add-call-log/vxt-add-call-log.component';
import { ChooseExpressionCandidateComponent } from './candidate-list/choose-expression-candidate/choose-expression-candidate.component';
import { MapApplicationFormCandidateComponent } from './candidate-list/map-application-form-candidate/map-application-form-candidate.component';
import { CandidateActivityComponent } from './profile-summary/candidate-activity/candidate-activity.component';
import { CandidateBulkEmailComponent } from './candidate-list/candidate-bulk-email/candidate-bulk-email.component';
import { CandidateBulkSmsComponent } from './candidate-list/candidate-bulk-sms/candidate-bulk-sms.component';
import { CandidateHistoryComponent } from './profile-summary/candidate-history/candidate-history.component';
import { CandidateSmsComponent } from './profile-summary/candidate-sms/candidate-sms.component';
import { CommonSharedModule } from '../../shared/common-shared.module';
import { AgmCoreModule } from '@agm/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NgxFileDropModule } from 'ngx-file-drop';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ImageCropperModule } from 'ngx-image-cropper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { SwiperModule } from 'swiper/angular';
import { NgApexchartsModule } from "ng-apexcharts";
import { OrgchartModule } from '@dabeng/ng-orgchart';
import { NgxMasonryModule } from 'ngx-masonry';
import { AgmDirectionModule } from 'agm-direction';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { CandidateCallLogComponent } from './profile-summary/candidate-call-log/candidate-call-log.component';
@NgModule({
  declarations: [
    CandidateListComponent,
    ProfileSummaryComponent,
    CandidateSummaryComponent,
    UploadNewResumeComponent,
    CandidateConfigureDashboardComponent,
    AdvancedFilterCandidateComponent,
    DependentpopupComponent,
    GeneralInformationComponent,
    CandidateLocationComponent,
    RecentnotesComponent,
    RecentnotesPopupComponent,
    CandidateResumeComponent,
    SkillsPopupComponent,
    CandidateExperienceComponent,
    CandidateAddressComponent,
    CandidateEducationComponent,
    CandidateEmergencyContactsComponent,
    CandidateFolderComponent,
    ManageCandidateFolderComponent,
    CandidateFolderFilterComponent,
    FilterPipe,
    AdditionalInfoPopupComponent,
    CandidateDocumentComponent,
    CreateNewDocumentComponent,
    CreateFolderComponent,
    CreateDocumentComponent,
    SkillsComponent,
    SkillGroupComponent,
    ManageSkillComponent,
    ManageSkillGroupComponent,
    PdfViewerComponent,
    ViewDocumentComponent,
    GridTreeViewComponent,
    ManageAccessComponent,
    VersionComponent,
    RemoveAccessListComponent,
    ShareDocumentComponent,
    DocumentShareableLinkComponent,
    RevokeaccessComponent,
    CandidateInboxComponent,
    CandidateJobComponent,
    AsignJobComponent,
    JobWorkflowStageComponent,
    CandidateSkillsComponent,
    ManageCandidateSkillsComponent,
    //CandidateResumeParseComponent,
    RequestGdprpopupComponent,
   // RequestGdprContentPageComponent,
    ViewNotesComponent,
    CoverPageComponent,
    UploadCoverPageComponent,
    FilePreviwerComponent,
    CoverPageVersionHistoryComponent,
    CoverPageRenameComponent,
    CoverPageViewDetailsComponent,
    FileUploadComponent,
    ViewCandidateApplicationComponent,
    CandidatePersonalInformationComponent,
    CandidateKnockoutDetailsComponent,
    CandidateDocumentInformationComponent,
    CreateCandidateComponent,
    XeopleSmartEmailComponent,
    ChooseExpressionCandidateComponent,
    MapApplicationFormCandidateComponent,
    CandidateActivityComponent,
    CandidateBulkEmailComponent,
    CandidateBulkSmsComponent,
    CandidateHistoryComponent,
    CandidateSmsComponent,
    CandidateCallLogComponent,
    VxtAddCallLogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CandidateRoutingModule,
    AutocompleteLibModule,
    CommonSharedModule,

    InfiniteScrollModule, ImageCropperModule, NgSelectModule,
    DragDropModule, MatPaginatorModule, MatSortModule, NgxFileDropModule, GooglePlaceModule,
    NgxOrgChartModule,
    NgOptionHighlightModule, ChartsModule,
    SwiperModule, 
    NgApexchartsModule,
    AgmCoreModule,
    OrgchartModule, NgxMasonryModule,AgmDirectionModule, DateInputsModule,
    BrowserAnimationsModule, ScrollViewModule
  ]
})
export class CandidateModule { }
