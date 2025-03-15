import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleRoutingModule } from './module-routing.module';
import { ModulesComponent } from './modules.component';
import { HeaderComponent } from '../core/layout/header/header.component';
import { InternationalizationComponent } from './EWM.core/system-settings/internationalization/internationalization.component';
import { SystemAuditLogComponent } from './EWM.core/system-settings/system-audit-log/system-audit-log.component';
import { SystemAuditLogNewComponent } from './EWM.core/system-settings/system-audit-log-new/system-audit-log-new.component';
import { SystemAuditDetailsComponent } from './EWM.core/system-settings/system-audit-log-new/system-audit-details/system-audit-details.component';
import { UserRolesComponent } from './EWM.core/system-settings/user-roles/user-roles.component';
import { UserInvitationComponent } from './EWM.core/system-settings/user-invitation/user-invitation.component';
import { UserGroupsComponent } from './EWM.core/system-settings/user-groups/user-groups.component';
import { MailSettingsComponent } from './EWM.core/system-settings/mail-settings/mail-settings.component';
import { EmailTemplatesComponent } from './EWM.core/system-settings/email-templates/email-templates.component';
import { SmsTemplatesComponent } from './EWM.core/system-settings/sms-templates/sms-templates.component';
import { EmailTemplatesManageComponent } from './EWM.core/system-settings/email-templates/email-templates-manage/email-templates-manage.component';
import { DatatableSampleComponent } from './EWM.core/system-settings/datatable-sample/datatable-sample.component';
import { PhoneInfoComponent } from './EWM.core/system-settings/phone-info/phone-info.component';
import { AddressFormatComponent } from './EWM.core/system-settings/address-format/address-format.component';
import { LookAndFeelComponent } from './EWM.core/system-settings/look-and-feel/look-and-feel.component';
import { ContactInfoComponent } from './EWM.core/profile-info/contact-info/contact-info.component';
import { EmailSettingsComponent } from './EWM.core/profile-info/email-settings/email-settings.component';
import { EmailIntegrationComponent } from './EWM.core/profile-info/email-integration/email-integration.component';
import { SecurityComponent } from './EWM.core/profile-info/security/security.component';
import { AccountPrefrencesComponent } from './EWM.core/profile-info/account-prefrences/account-prefrences.component';
import { ProfileSettingComponent } from './EWM.core/profile-info/profile-setting/profile-setting.component';
import { GeneralSettingComponent } from './EWM.core/system-settings/general-setting/general-setting.component';
import { OrganizationDetailsComponent } from './EWM.core/user-administration/organization-details/organization-details.component';
import { AdministratorsComponent } from './EWM.core/user-administration/administrators/administrators.component';
import { SiteDomainComponent } from './EWM.core/user-administration/site-domain/site-domain.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from '../core/layout/footer/footer.component';
import { OuterHeaderComponent } from '../core/layout/outer-header/outer-header.component';
import { SearchheaderComponent } from '../core/layout/searchheader/searchheader.component';
import { SidebarComponent } from '../core/layout/sidebar/sidebar.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CrmLandingPageComponent } from './EWM.CRM/crm-landing-page/crm-landing-page.component';
import { FinanceLandingPageComponent } from './EWM.Finance/finance-landing-page/finance-landing-page.component';
import { RostersLandingPageComponent } from './EWM.Rosters/rosters-landing-page/rosters-landing-page.component';
import { RecruitmentLandingPageComponent } from './EWM.Recruitment/recruitment-landing-page/recruitment-landing-page.component';
import { AllocationLandingPageComponent } from './EWM.Allocations/allocation-landing-page/allocation-landing-page.component';
import { MfaComponent } from './EWM.core/mfa/mfa.component';
import { MfaSettingsComponent } from './EWM.core/mfa/mfa-settings/mfa-settings.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { UserTypeMasterComponent } from './EWM.core/system-settings/user-type-master/user-type-master.component';
import { SecuritymfaComponent } from './EWM.core/profile-info/security/securitymfa/securitymfa.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { AccessLevelsComponent } from './EWM.core/system-settings/access-levels/access-levels.component';
import { ImageUploadPopupComponent } from '../modules/EWM.core/shared/image-upload-popup/image-upload-popup.component';
import { LandingComponent } from './landing/landing.component';
import { AppInitializationComponent } from './app-initialization/app-initialization.component';
import { UriComponent } from './uri/uri.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength'
import { LinkExpireComponent } from './errors/link-expire/link-expire.component';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
import { LinkDeniedComponent } from './errors/link-denied/link-denied.component';
import { UserRolePermissionComponent } from './EWM.core/system-settings/user-roles/user-role-permission/user-role-permission.component';
import { MatFileUploadModule } from 'angular-material-fileupload';

import { ContactReceipentPopupComponent } from '../modules/EWM.core/shared/contact-receipent-popup/contact-receipent-popup.component';
import { AccessRequestComponent } from './EWM.core/user-management/access-request/access-request.component';
import { TenantUserComponent } from './tenant-user/tenant-user.component';
import { AccessRequestManageComponent } from './EWM.core/user-management/access-request/access-requestManage/access-request-manage.component';
import { SocialProfilesComponent } from './EWM.core/system-settings/social-profiles/social-profiles.component';
import { LocationTypesComponent } from './EWM.core/system-settings/location-type-master/location-types/location-types.component';
import { LocationTypesOperationComponent } from './EWM.core/system-settings/location-type-master/location-types-operation/location-types-operation.component';
import { GroupsComponent } from './EWM.core/system-settings/status-master/groups/groups.component';
import { StatusComponent } from './EWM.core/system-settings/status-master/status/status.component';
import { ReasonsComponent } from './EWM.core/system-settings/status-master/reasons/reasons.component';
import { ManageStatusComponent } from './EWM.core/system-settings/status-master/manage-status/manage-status.component';
import { ManageReasonsComponent } from './EWM.core/system-settings/status-master/manage-reasons/manage-reasons.component';

import { CommunicationMasterComponent } from './EWM.core/system-settings/Master/communication-master/communication-master.component';
import { AddCommunicationMasterComponent } from './EWM.core/system-settings/Master/add-communication-master/add-communication-master.component';
import { AddSocialProfileComponent } from './EWM.core/system-settings/social-profiles/add-social-profile/add-social-profile.component';
import { IndustryComponent } from './EWM.core/system-settings/industry/industry.component';
import { SubIndustryComponent } from './EWM.core/system-settings/industry/sub-industry/sub-industry.component';
import { ManageIndustryComponent } from './EWM.core/system-settings/industry/manage-industry/manage-industry.component';
import { ManageSubIndustryComponent } from './EWM.core/system-settings/industry/sub-industry/manage-sub-industry/manage-sub-industry.component';
import { AddTagComponent } from './EWM.core/job/Master/Tag/add-tag/add-tag.component';
import { TagListComponent } from './EWM.core/job/Master/Tag/tag-list/tag-list.component';
import { QuickpeopleComponent } from './EWM.core/shared/quick-modal/quickpeople/quickpeople.component';
import { AddemailComponent } from './EWM.core/shared/quick-modal/addemail/addemail.component';
import { AddphonesComponent } from './EWM.core/shared/quick-modal/addphones/addphones.component';
import { TwoDigitDecimalNumberDirective } from './EWM.core/system-settings/industry/manage-industry/two-digit-decimal-number.directive';
import { AddSocialComponent } from './EWM.core/shared/quick-modal/add-social/add-social.component';
import { SalaryUnitComponent } from './EWM.core/job/Master/salary-unit/salary-unit.component';
import { ManageSalaryUnitComponent } from './EWM.core/job/Master/salary-unit/manage-salary-unit/manage-salary-unit.component';
import { ExperienceTypeComponent } from './EWM.core/job/Master/experience/experience-type/experience-type.component';
import { ManageExperienceTypeComponent } from './EWM.core/job/Master/experience/manage-experience-type/manage-experience-type.component';
import { InviteATeammateComponent } from './EWM.core/invite-a-teammate/invite-a-teammate.component';
import { JobComponent } from './EWM.core/job/job/job.component';
import { UserInviteComponent } from './EWM.core/system-settings/user-invitation/user-invite/user-invite.component';
import { UserInvitationDetailsComponent } from './EWM.core/system-settings/user-invitation/user-invitation-details/user-invitation-details.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { QuickjobComponent } from './EWM.core/shared/quick-modal/quickjob/quickjob.component';
import { AddressBarComponent } from '../shared/address-bar/address-bar.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { QuickCompanyComponent } from './EWM.core/shared/quick-modal/quick-company/quick-company.component';
import { AddAddressComponent } from './EWM.core/shared/quick-modal/add-address/add-address.component';
import { BrandsComponent } from './EWM.core/job/Master/brands/brands.component';
import { ManageBrandsComponent } from './EWM.core/job/Master/brands/manage-brands/manage-brands.component';
import { SalaryBandComponent } from './EWM.core/job/Master/salary-band/salary-band.component';
import { ManageSalaryBandComponent } from './EWM.core/job/Master/salary-band/manage-salary-band/manage-salary-band.component';
import { FunctionalExpertiesAddComponent } from './EWM.core/job/Master/functional-experties-master/functional-experties-add/functional-experties-add.component';
import { FunctionalExpertiesListComponent } from './EWM.core/job/Master/functional-experties-master/functional-experties-list/functional-experties-list.component';
import { FunctionalSubExpertiesListComponent } from './EWM.core/job/Master/functional-experties-master/functional-sub-experties-list/functional-sub-experties-list.component';
import { FunctionalSubExpertiesAddComponent } from './EWM.core/job/Master/functional-experties-master/functional-sub-experties-add/functional-sub-experties-add.component';
import { CustomerMasterComponent } from './EWM.core/system-settings/customer-master/customer-master.component';
import { ManageCustomerComponent } from './EWM.core/system-settings/customer-master/manage-customer/manage-customer.component';
import { JobCategoryComponent } from './EWM.core/job/Master/job-category/job-category.component';
import { ManageJobCategoryComponent } from './EWM.core/job/Master/job-category/manage-job-category/manage-job-category.component';
import { SubJobCategoryComponent } from './EWM.core/job/Master/job-category/sub-job-category/sub-job-category.component';
import { ManageSubJobCategoryComponent } from './EWM.core/job/Master/job-category/sub-job-category/manage-sub-job-category/manage-sub-job-category.component';
import { JobTypeListComponent } from './EWM.core/job/Master/job-type/job-type-list/job-type-list.component';
import { JobTypeAddComponent } from './EWM.core/job/Master/job-type/job-type-add/job-type-add.component';
import { JobSubTypeListComponent } from './EWM.core/job/Master/job-type/job-sub-type-list/job-sub-type-list.component';
import { JobSubTypeAddComponent } from './EWM.core/job/Master/job-type/job-sub-type-add/job-sub-type-add.component';
import { QuicklocationComponent } from './EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { JobDescriptionPopupEditorComponent } from './EWM.core/shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';
import { JobWorkflowsComponent } from './EWM.core/system-settings/job-workflows/job-workflows.component';
import { JobWorkflowsManageComponent } from './EWM.core/system-settings/job-workflows/job-workflows-manage/job-workflows-manage.component';
import { ConfigureJobBoardComponent } from './EWM.core/job/configure-job-board/configure-job-board.component';
import { MappingDataListComponent } from './EWM.core/job/configure-job-board/mapping-data-list/mapping-data-list.component';
import { BreadcrumbComponent } from './EWM.core/shared/breadcrumb/breadcrumb.component';
import { NgxOrgChartModule } from 'ngx-org-chart';
import { TooltipComponent } from './EWM.core/shared/tooltip/tooltip.component';
import { TooltipDirective } from './EWM.core/shared/tooltip/tooltip.directive';

import { JobTemplateListComponent } from './EWM.core/job/create-job-template/job-template-list/job-template-list.component';
import { JobTemplateManageComponent } from './EWM.core/job/create-job-template/job-template-manage/job-template-manage.component';

import { EmployeeTagComponent } from './EWM.core/profile-info/Integration/employee-tag/employee-tag.component';
import { EmployeeTagManageComponent } from './EWM.core/profile-info/Integration/employee-tag/employee-tag-manage/employee-tag-manage.component';
import { IntegrationComponent } from './EWM.core/profile-info/Integration/integration.component';
import { CustomizingWidgetsComponent } from './EWM.core/profile-info/customizing-widgets/customizing-widgets.component';
//import { IntegrationComponent } from './EWM.core/profile-info/Integration/integration.component';
import { QuickCandidateComponent } from './EWM.core/shared/quick-modal/quick-candidate/quick-candidate.component';
import { CustomizationComponent } from './EWM.core/system-menu/customization/customization.component';
import { ReportsComponent } from './EWM.core/reports/reports.component';
import { EmployeesComponent } from './EWM.core/employees/employees.component';
import { SampleComponent } from './EWM.core/sample/sample.component';

import { ManageCandidateTagComponent } from './EWM.core/profile-info/Integration/candidate-tag/manage-candidate-tag/manage-candidate-tag.component';
import { CandidateTagComponent } from './EWM.core/profile-info/Integration/candidate-tag/candidate-tag.component';

import { ClientTagMasterComponent } from './EWM.core/profile-info/Integration/client-tag-master/client-tag-master.component';
import { ManageClientTagComponent } from './EWM.core/profile-info/Integration/client-tag-master/manage-client-tag/manage-client-tag.component';
import { ManageNameComponent } from './EWM.core/profile-info/administration/manage-name/manage-name.component';
import { EmployeeManageNameComponent } from './EWM.core/profile-info/administration/employee-manage-name/employee-manage-name.component';
import { PersistFilterComponent } from './EWM.core/job/landingpage/job-filter-dialog/persist-filter/persist-filter.component';
import { ActionDialogComponent } from './EWM.core/job/landingpage/action-dialog/action-dialog.component';
import { FilterDialogComponent } from './EWM.core/job/landingpage/filter-dialog/filter-dialog.component';
import { DashboardComponent } from './EWM.core/home/dashboard/dashboard.component';
import { configureDashboardComponent } from './EWM.core/home/configure-dashboard/configure-dashboard.component';
import { IntegrationInterfaceBoardComponent } from './EWM.core/profile-info/Integration/integration-interface-board/integration-interface-board.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MasterDataComponent } from './EWM.core/system-menu/master-data/master-data.component';
import { SwiperModule } from 'swiper/angular';
import { CandidateSummaryComponent } from './EWM-Candidate/profile-summary/candidate-summary/candidate-summary.component';
import { OrderbyPipe } from '../shared/pipe/orderby.pipe';
import { ProfileSummaryComponent } from './EWM-Candidate/profile-summary/profile-summary.component';
import { UploadNewResumeComponent } from './EWM-Candidate/profile-summary/candidate-resume/upload-new-resume/upload-new-resume.component';
import { CandidateConfigureDashboardComponent } from './EWM-Candidate/profile-summary/candidate-configure-dashboard/candidate-configure-dashboard.component';
import { CandidateListComponent } from './EWM-Candidate/candidate-list/candidate-list.component';
import { AdvancedFilterCandidateComponent } from './EWM-Candidate/candidate-list/advanced-filter-candidate/advanced-filter-candidate.component';
import { GeneralInformationComponent } from './EWM-Candidate/profile-summary/general-information/general-information.component';
import { CandidateLocationComponent } from './EWM-Candidate/profile-summary/general-information/candidate-location/candidate-location.component';

import { CandidateBulkEmailComponent } from './EWM-Candidate/candidate-list/candidate-bulk-email/candidate-bulk-email.component';
import { DependentpopupComponent } from './EWM-Candidate/dependentpopup/dependentpopup.component';
import { CandidateResumeComponent } from './EWM-Candidate/profile-summary/candidate-resume/candidate-resume.component';
import { SkillsPopupComponent } from './EWM-Candidate/profile-summary/skills-popup/skills-popup.component';
import { RecentnotesComponent } from './EWM-Candidate/recentnotes/recentnotes.component';
import { ViewNotesComponent } from './EWM-Candidate/recentnotes/view-notes/view-notes.component';
import { RecentnotesPopupComponent } from './EWM-Candidate/recentnotes/recentnotes-popup/recentnotes-popup.component';


import { CandidateScoreTypeComponent } from './EWM.core/profile-info/administration/candidate-score-type/candidate-score-type.component';
import { ManageCandidateScoreTypeComponent } from './EWM.core/profile-info/administration/candidate-score-type/manage-candidate-score-type/manage-candidate-score-type.component';
import { CandidateExperienceComponent } from './EWM-Candidate/profile-summary/candidate-experience/candidate-experience.component';
import { CandidateAddressComponent } from './EWM-Candidate/profile-summary/candidate-address/candidate-address.component';

import { CandidateEducationComponent } from './EWM-Candidate/candidate-education/candidate-education.component';
import { CandidateEmergencyContactsComponent } from './EWM-Candidate/profile-summary/candidate-emergency-contacts/candidate-emergency-contacts.component';
import { CandidateFolderComponent } from './EWM-Candidate/candidate-folder/candidate-folder.component';
import { ManageCandidateFolderComponent } from './EWM-Candidate/candidate-folder/manage-candidate-folder/manage-candidate-folder.component';


import { CandidateFolderFilterComponent } from './EWM-Candidate/profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { AdditionalInfoPopupComponent } from './EWM-Candidate/profile-summary/additional-info-popup/additional-info-popup.component';

import { CandidateDegreeTypeComponent } from './EWM.core/profile-info/administration/candidate-degree-type/candidate-degree-type.component';
import { ManageCandidateDegreeTypeComponent } from './EWM.core/profile-info/administration/candidate-degree-type/manage-candidate-degree-type/manage-candidate-degree-type.component';
import { ManageDocumentCategoryComponent } from './EWM.core/profile-info/administration/document-category/manage-document-category/manage-document-category.component';
import { DocumentCategoryComponent } from './EWM.core/profile-info/administration/document-category/document-category.component';
import { DocumentNameComponent } from './EWM.core/profile-info/administration/document-category/document-name/document-name.component';
import { ManageDocumentNameComponent } from './EWM.core/profile-info/administration/document-category/manage-document-name/manage-document-name.component';
import { QualificationComponent } from './EWM.core/system-settings/qualification/qualification.component';
import { ManageQualificationComponent } from './EWM.core/system-settings/qualification/manage-qualification/manage-qualification.component';
import { CustomTableComponent } from './EWM.core/profile-info/administration/employee-manage-name/custom-table/custom-table.component';
import { MyInboxComponent } from './EWM.core/home/my-inbox/my-inbox.component';
import { NewEmailComponent } from './EWM.core/shared/quick-modal/new-email/new-email.component';
import { ClientNewEmailComponent } from './EWM.core/client/client-new-email/client-new-email.component';
import { CandidateDocumentComponent } from 'src/app/modules/EWM-Candidate/candidate-document/candidate-document.component';
import { CreateNewDocumentComponent } from './EWM-Candidate/candidate-document/create-new-document/create-new-document.component';
import { CreateFolderComponent } from './EWM-Candidate/candidate-document/create-folder/create-folder.component';
import { CreateDocumentComponent } from './EWM-Candidate/candidate-document/create-document/create-document.component';
import { SkillsComponent } from '././EWM.core/system-settings/skills/skills.component';
import { SkillGroupComponent } from '././EWM.core/system-settings/skill-group/skill-group.component';
import { ManageSkillComponent } from '././EWM.core/system-settings/skills/manage-skill/manage-skill.component';
import { ManageSkillGroupComponent } from '././EWM.core/system-settings/skill-group/manage-skill-group/manage-skill-group.component';
import { PdfViewerComponent } from 'src/app/modules/EWM-Candidate/candidate-document/pdf-viewer/pdf-viewer.component';
import { GroupSkillConfirmationPopupComponent } from './EWM.core/shared/quick-modal/quickjob/group-skill-confirmation-popup/group-skill-confirmation-popup.component';
import { ViewDocumentComponent } from 'src/app/modules/EWM-Candidate/candidate-document/view-document/view-document.component';
import { GridTreeViewComponent } from 'src/app/modules/EWM-Candidate/candidate-document/grid-tree-view/grid-tree-view.component';
import { ManageAccessComponent } from 'src/app/modules/EWM-Candidate/candidate-document/manage-access/manage-access.component';
import { VersionComponent } from 'src/app/modules/EWM-Candidate/candidate-document/version/version.component';
import { RemoveAccessListComponent } from 'src/app/modules/EWM-Candidate/candidate-document/manage-access/remove-access-list/remove-access-list.component';

import { ShareDocumentComponent } from './EWM-Candidate/candidate-document/share-document/share-document.component';
import { DocumentShareableLinkComponent } from 'src/app/modules/EWM-Candidate/candidate-document/document-shareable-link/document-shareable-link.component';
import { DocumentComponent } from '../document/document.component';
import { RevokeaccessComponent } from 'src/app/modules/EWM-Candidate/candidate-document/document-shareable-link/revokeaccess/revokeaccess.component';
import { RemoveReasonComponent } from './EWM.core/job/Master/reason-module/reason-group/remove-reason.component';
import { ManageRemoveReasonComponent } from './EWM.core/job/Master/reason-module/reason-group/manage-remove-reason/manage-remove-reason.component';
import { ManageViewAccessLevelsComponent } from './EWM.core/system-settings/access-levels/manage-view-access-levels/manage-view-access-levels.component';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { WorkflowCandidateMappedBoxComponent } from './EWM.core/job/workflow-candidate-mapped-box/workflow-candidate-mapped-box.component';
import { CandidateTimelineComponent } from './EWM.core/job/candidate-timeline/candidate-timeline.component';
import { TemplatesComponent } from './EWM.core/shared/quick-modal/new-email/templates/templates.component';
import { RemoveCandidateComponent } from './EWM.core/job/remove-candidate/remove-candidate.component';
import { WeightageComponent } from './EWM.core/system-settings/weightage/weightage.component';
import { ManageWeightageComponent } from './EWM.core/system-settings/weightage/manage-weightage/manage-weightage.component';
import { CandidateInboxComponent } from '../modules/EWM-Candidate/candidate-inbox/candidate-inbox.component';
import { CandidateJobComponent } from './EWM-Candidate/candidate-job/candidate-job.component';
import { AsignJobComponent } from './EWM-Candidate/candidate-job/asign-job/asign-job.component';
import { JobWorkflowStageComponent } from './EWM-Candidate/candidate-job/job-workflow-stage/job-workflow-stage.component';
import { SeekIntegrationComponent } from './EWM.core/profile-info/Integration/seek-integration/seek-integration.component';
import { ClientLandingComponent } from './EWM.core/client/client-landing/client-landing.component';
import { ClientDashboardComponent } from './EWM.core/client/client-dashboard/client-dashboard.component';
import { ReasonModuleComponent } from './EWM.core/job/Master/reason-module/reason-module.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { EmployeeListComponent } from './EWM-Employee/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './EWM-Employee/employee-detail/employee-detail.component';
import { EmployeeSummaryComponent } from './EWM-Employee/employee-detail/employee-summary/employee-summary.component'
import { ChartsModule } from '@progress/kendo-angular-charts';
import { BulkEditComponent } from './EWM.core/system-settings/skills/bulk-edit/bulk-edit.component';
import { CandidateSkillsComponent } from '../modules/EWM-Candidate/profile-summary/candidate-skills/candidate-skills.component';
import { ManageCandidateSkillsComponent } from './EWM-Candidate/profile-summary/manage-candidate-skills/manage-candidate-skills.component';
import { ClientDetailComponent } from './EWM.core/client/client-detail/client-detail.component';
import { ClientSummaryComponent } from './EWM.core/client/client-detail/client-summary/client-summary.component';
import { ClientLocationComponent } from './EWM.core/client/client-location/client-location.component';
import { NgApexchartsModule } from "ng-apexcharts";

import { QuickClientDetailsComponent } from './EWM.core/client/client-detail/quick-client-details/quick-client-details.component';
import { ClientDescriptionPopupComponent } from './EWM.core/client/client-detail/client-summary/client-description-popup/client-description-popup.component';
import { BusinessRegistrationComponent } from './EWM.core/client/client-detail/client-summary/business-registration/business-registration.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { QuickAddContactComponent } from './EWM.core/shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { ContactRelatedTypeComponent } from './EWM.core/shared/quick-modal/quick-add-contact/contact-related-type/contact-related-type.component';
import { AddContactRelatedToComponent } from './EWM.core/shared/quick-modal/quick-add-contact/add-contact-related-to/add-contact-related-to.component';

import { ClientInboxComponent } from './EWM.core/client/client-inbox/client-inbox.component';
import { ClientContactListComponent } from './EWM.core/client/client-contact-list/client-contact-list.component';
import { DaxtraIntegrationComponent } from './EWM.core/profile-info/Integration/daxtra-integration/daxtra-integration.component';

import { ClientVisibilityComponent } from './EWM.core/client/client-visibility/client-visibility.component';
import { EditOwnerComponent } from './EWM.core/client/edit-owner/edit-owner.component';
import { ClientJobListComponent } from './EWM.core/client/client-job-list/client-job-list.component';
import { CompanyContactPopupComponent } from './EWM.core/shared/quick-modal/quick-company/company-contact-popup/company-contact-popup.component';
import { NotesCategoryComponent } from './EWM.core/system-settings/notes-category/notes-category.component';
import { ManageNotesCategoryComponent } from './EWM.core/system-settings/notes-category/manage-notes-category/manage-notes-category.component';
import { ClientNotesComponent} from './EWM.core/client/client-notes/client-notes.component';
import {OwnerFilterComponent} from './EWM.core/client/client-notes/owner-filter/owner-filter.component';
import {DateFilterComponent} from './EWM.core/client/client-notes/date-filter/date-filter.component';
import {ManageClientAccessComponent} from './EWM.core/client/client-notes/manage-client-access/manage-client-access.component';
import {RevokeClientAccessComponent} from './EWM.core/client/client-notes/revoke-client-access/revoke-client-access.component';
import { ClientOrgComponent } from './EWM.core/client/client-org/client-org.component';
import { OrgchartModule } from '@dabeng/ng-orgchart';
import { PositionmasterComponent } from './EWM.core/job/Master/positionmaster/positionmaster.component';
import { ManagePositionmasterComponent } from './EWM.core/job/Master/positionmaster/manage-positionmaster/manage-positionmaster.component';
import { JobSMSComponent } from './EWM.core/job/job/job-sms/job-sms.component';
import { ClientJobCategoryComponent } from './EWM.core/client/client-notes/client-job-category/client-job-category.component';
import { AccessPermissionComponent } from './EWM.core/system-settings/access-permission/access-permission.component';
import { BreadcrumbsComponent } from './EWM.core/shared/breadcrumbs/breadcrumbs.component';
import {GooglemapComponent} from './EWM.core/shared/googlemap/googlemap.component'
import {EmployeeNotesComponent} from './EWM-Employee/employee-detail/employee-notes/employee-notes.component';
import { ActivityCategoryComponent } from './EWM.core/system-settings/activity-category/activity-category.component';
import { ManageActivityCategoryComponent } from './EWM.core/system-settings/activity-category/manage-activity-category/manage-activity-category.component';
import { MyActivityComponent } from './EWM.core/home/my-activity/my-activity.component';
import { AddRequiredAttendeesComponent } from './EWM.core/home/my-activity/add-required-attendees/add-required-attendees.component';
import { OrganizerOrAssineesComponent } from './EWM.core/home/my-activity/organizer-or-assinees/organizer-or-assinees.component';
import { ScheduleComponent } from './EWM.core/home/my-activity/schedule/schedule.component';
import { ScheduleAssistanceDatePopupComponent } from './EWM.core/home/my-activity/schedule-assistance-date-popup/schedule-assistance-date-popup.component';

import { MyActivityCalenderComponent } from './EWM.core/home/my-activity-calender/my-activity-calender.component';
import { ClientTeamComponent } from './EWM.core/client/client-team/client-team.component';
import { AddTeamComponent } from './EWM.core/shared/quick-modal/add-team/add-team.component';
import { ActivityDetailComponent } from './EWM.core/home/my-activity-calender/activity-detail/activity-detail.component';
import { OtherIntegrationComponent } from './EWM.core/profile-info/other-integration/other-integration.component';
import { ZoomCallIntegrationComponent } from './EWM.core/profile-info/other-integration/zoom-call-integration/zoom-call-integration.component';
import {EmployeeActivityComponent} from './EWM-Employee/employee-detail/employee-activity/employee-activity.component';
import {DateFilterActivityComponent} from './EWM-Employee/employee-detail/employee-activity/date-filter-activity/date-filter-activity.component';
import {OwnerFilterActivityComponent} from './EWM-Employee/employee-detail/employee-activity/owner-filter-activity/owner-filter-activity.component';
import {MarkDoneActivityComponent} from './EWM-Employee/employee-detail/employee-activity/mark-done-activity/mark-done-activity.component';
import {CategoryFilterActivityComponent} from './EWM-Employee/employee-detail/employee-activity/category-filter-activity/category-filter-activity.component';
import { MyActivityListComponent } from './EWM.core/home/my-activity-list/my-activity-list.component';
import { CalenderFilterComponent } from './EWM.core/home/my-activity-list/calender-filter/calender-filter.component';
import { CategoryFilterComponent } from './EWM.core/home/my-activity-list/category-filter/category-filter.component';
import { ManageAccessActivityComponent } from './EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { MyActivityViewComponent } from './EWM.core/home/my-activity-list/my-activity-view/my-activity-view.component';
import { EmailActionsComponent } from './EWM.core/user-administration/email-actions/email-actions.component';
import { TenantfeatureIntegration } from './EWM.core/profile-info/Integration/tenant-feature-integration/tenant-feature-integration.component';
import { ZoomCallHistoryComponent } from './EWM.core/home/zoom-call-history/zoom-call-history.component';
import { NgxMasonryModule } from 'ngx-masonry';
import { RequestGdprpopupComponent } from './EWM-Candidate/profile-summary/request-gdprpopup/request-gdprpopup.component';
import { AutometicConsentRequestComponent } from './EWM.core/user-administration/gdpr/autometic-consent-request/autometic-consent-request.component';
import { GdprComplianceComponent } from './EWM.core/user-administration/gdpr/gdpr-compliance/gdpr-compliance.component';
import { ConsentReqPageTemplateComponent } from './EWM.core/user-administration/gdpr/consent-req-page-template/consent-req-page-template.component';
import { ConsentReqEmailTemplateComponent } from './EWM.core/user-administration/gdpr/consent-req-email-template/consent-req-email-template.component';
import { RelatedToModuleComponent } from './EWM.core/system-settings/related-to-module/related-to-module.component';
import { AddRelatedToModuleComponent } from './EWM.core/system-settings/related-to-module/add-related-to-module/add-related-to-module.component';
import { ClientConfigDashboardPopComponent } from './EWM.core/client/client-config-dashboard-pop/client-config-dashboard-pop.component';
import {TimezoneModalComponent} from './EWM.core/home/my-activity-calender/timezone-modal/timezone-modal.component'
import {UppercaseDirective} from '../shared/directive/uppercase.directive'
import{RevokeActivityAccessComponent} from './EWM-Employee/employee-detail/employee-activity/revoke-activity-access/revoke-activity-access.component';
import { ZoomMeetingIntegrationComponent } from './EWM.core/profile-info/other-integration/zoom-meeting-integration/zoom-meeting-integration.component';
import { AssessmentInfoComponent } from './EWM.core/job/Master/assessment/assessment-info/assessment-info.component';
import { AssessmentLandingPageComponent } from './EWM.core/job/Master/assessment/assessment-landing-page/assessment-landing-page.component';
import { CreateAssessmentComponent } from './EWM.core/job/Master/assessment/create-assessment/create-assessment.component';
import {AssessmentQuesComponent} from './EWM.core/job/Master/assessment/create-assessment/assessment-ques/assessment-ques.component';
import {  AssessmentVersionComponent } from './EWM.core/job/Master/assessment/assessment-version/assessment-version.component';
import { ShareResumeComponent } from './EWM.core/job/screening/share-resume/share-resume.component';
import { AddOrganizationDetailsComponent } from './EWM.core/user-administration/organization-details/add-organization-details/add-organization-details.component';
import { ShareResumeInternalComponent } from './EWM.core/job/screening/share-resume-internal/share-resume-internal.component';
import { SystemAccessTokenComponent } from './EWM.core/user-administration/system-access-token/system-access-token.component';
import { GenerateTokenPopupComponent } from './EWM.core/user-administration/system-access-token/generate-token-popup/generate-token-popup.component';
import { NewApiTokenPopupComponent } from './EWM.core/user-administration/system-access-token/new-api-token-popup/new-api-token-popup.component';
import { TokenCreateConfirmBoxPopupComponent } from './EWM.core/user-administration/system-access-token/token-create-confirm-box-popup/token-create-confirm-box-popup.component';
import { AfterRevokeAccessMessagePopupComponent } from './EWM.core/user-administration/system-access-token/after-revoke-access-message-popup/after-revoke-access-message-popup.component';
import { ShareJobApplicationUrlComponent } from './EWM.core/job/job-details/share-job-application-url/share-job-application-url.component';

import { WorkScheduleComponent } from './EWM.core/profile-info/work-schedule/work-schedule.component';
import { MsTeamIntegrationComponent } from './EWM.core/profile-info/other-integration/ms-team-integration/ms-team-integration.component';
import { GoogleMeetIntegrationComponent } from './EWM.core/profile-info/other-integration/google-meet-integration/google-meet-integration.component';
import { DocumentEmailTemplateComponent } from './EWM.core/system-settings/email-templates/email-templates-manage/document-email-template/document-email-template.component';
import { ManageAdministratorsComponent } from './EWM.core/user-administration/administrators/manage-administrators/manage-administrators.component';
import { EmailPreviewPopupComponent } from './EWM.core/system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { ManageSmsTemplatesComponent } from './EWM.core/system-settings/sms-templates/manage-sms-templates/manage-sms-templates.component';
import { CareerComponent } from './EWM.core/job/career/career.component';
import { ManageCareerComponent } from './EWM.core/job/career/manage-career/manage-career.component';
import { NikeCareerComponent } from './EWM.core/job/career/nike-career/nike-career.component';
import { CareerSiteTypeSelectionComponent } from './EWM.core/job/career/career-site-type-selection/career-site-type-selection.component';
import { CareerNetworkComponent } from './EWM.core/job/career/career-network/career-network.component';
import { ApplicationFormComponent } from './EWM.core/job/application-form/application-form.component';
import { ManageApplicationFormComponent } from './EWM.core/job/application-form/manage-application-form/manage-application-form.component';
import { LandingApplicationFormComponent } from './EWM.core/job/application-form/landing-application-form/landing-application-form.component';
import { ConfigureApplicationFormComponent } from './EWM.core/job/application-form/configure-application-form/configure-application-form.component';
import { ManageUserTypeMasterComponent } from './EWM.core/system-settings/user-type-master/manage-user-type-master/manage-user-type-master.component';
import { SeekLinkoutCareerComponent } from './errors/seek-linkout-career/seek-linkout-career.component';
import { ManageUserRolesComponent } from './EWM.core/system-settings/user-roles/manage-user-roles/manage-user-roles.component';
import { CoverPageComponent } from './EWM-Candidate/profile-summary/cover-page/cover-page.component';
import { UploadCoverPageComponent } from './EWM-Candidate/profile-summary/cover-page/upload-cover-page/upload-cover-page.component';
import { FilePreviwerComponent } from './EWM-Candidate/profile-summary/candidate-resume/file-previwer/file-previwer.component';
import { CoverPageVersionHistoryComponent } from './EWM-Candidate/profile-summary/cover-page/cover-page-version-history/cover-page-version-history.component';
import { CoverPageRenameComponent } from './EWM-Candidate/profile-summary/cover-page/cover-page-rename/cover-page-rename.component';
import { CoverPageViewDetailsComponent } from './EWM-Candidate/profile-summary/cover-page/cover-page-view-details/cover-page-view-details.component';
import { ImageUploadAdvancedComponent } from '../modules/EWM.core/shared/image-upload-advanced/image-upload-advanced.component';
import { WelcomePageComponent } from './EWM.core/job/application-form/configure-application-form/welcome-page/welcome-page.component';
import { KnockoutQuestionsComponent } from './EWM.core/job/application-form/configure-application-form/knockout-questions/knockout-questions.component';
import { PersonalInformationFormComponent } from './EWM.core/job/application-form/configure-application-form/personal-information-form/personal-information-form.component';
import { DocumentsComponent } from './EWM.core/job/application-form/configure-application-form/documents/documents.component';
import { AssessmentQuestionsComponent } from './EWM.core/job/application-form/configure-application-form/assessment-questions/assessment-questions.component';
import { TrackingCodeComponent } from './EWM.core/job/application-form/configure-application-form/tracking-code/tracking-code.component';
import { AlertPopupAutoFillAppResumeComponent } from './EWM.core/job/application-form/configure-application-form/welcome-page/alert-popup-auto-fill-app-resume/alert-popup-auto-fill-app-resume.component';
import { AddKnockoutQuestionsComponent } from './EWM.core/job/application-form/configure-application-form/knockout-questions/add-knockout-questions/add-knockout-questions.component';
import { AddSkillsDocumentComponent } from './EWM.core/job/application-form/configure-application-form/documents/add-skills-document/add-skills-document.component';
import { FileUploadComponent } from './EWM-Candidate/profile-summary/cover-page/file-upload/file-upload.component';
import { AddQualificationDocumentComponent } from './EWM.core/job/application-form/configure-application-form/documents/add-qualification-document/add-qualification-document.component';
import { FilePreviwerPopupComponent } from './EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { AddAssessmentComponent } from './EWM.core/system-settings/job-workflows/add-assessment/add-assessment.component';
import { ManageUserGroupsComponent } from './EWM.core/system-settings/user-groups/manage-user-groups/manage-user-groups.component';
import { CandidateRankComponent } from './EWM.core/job/job-details/candidate-rank/candidate-rank.component';
import { PublishJobValidationComponent } from './EWM.core/shared/quick-modal/quickjob/publish-job-validation/publish-job-validation.component';
import { PopupIntegrationCategoryComponent } from './EWM.core/shared/quick-modal/quickjob/popup-integration-category/popup-integration-category.component';
import { ManageAccessPermissionComponent } from './EWM.core/system-settings/access-permission/manage-access-permission/manage-access-permission.component';
import { JobPublishPopupComponent } from './EWM.core/job/job-details/job-publish-popup/job-publish-popup.component';
import { MapApplicationFormComponent } from './EWM.core/job/job-details/map-application-form/map-application-form.component';
import { ShowOwnerlistPopupComponent } from './EWM.core/job/landingpage/show-ownerlist-popup/show-ownerlist-popup.component';
import { GoogleMapsLocationPopComponent } from '../shared/modal/google-maps-location-pop/google-maps-location-pop.component';
import { ViewCandidateApplicationComponent } from './EWM-Candidate/candidate-list/view-candidate-application/view-candidate-application.component';
import { CandidatePersonalInformationComponent } from './EWM-Candidate/candidate-list/view-candidate-application/candidate-personal-information/candidate-personal-information.component';
import { CandidateKnockoutDetailsComponent } from './EWM-Candidate/candidate-list/view-candidate-application/candidate-knockout-details/candidate-knockout-details.component';
import { CandidateDocumentInformationComponent } from './EWM-Candidate/candidate-list/view-candidate-application/candidate-document-information/candidate-document-information.component';
import { CustomeActivityPageComponent } from './EWM.core/job/job-details/custome-activity-page/custome-activity-page.component';
import { WorkflowSubStagesComponent } from './EWM.core/job/landingpage/workflow-sub-stages/workflow-sub-stages.component';
import { SearchPipe } from './EWM.core/job/landingpage/action-dialog/search.pipe';
import { SessionExpiredComponent } from './sign-in/session-expired/session-expired.component';
import { SessionExpiredLoginComponent } from './sign-in/session-expired-login/session-expired-login.component';
import { SearchListPipe } from '../modules/EWM-Employee/employee-detail/employee-activity/revoke-activity-access/search-list.pipe';

import { OrganizationInfoComponent } from './EWM.core/job/application-form/configure-application-form/welcome-page/organization-info/organization-info.component';
import { ChecklistComponent } from './EWM.core/system-settings/checklist/checklist.component';
import { ManageChecklistComponent } from './EWM.core/system-settings/checklist/manage-checklist/manage-checklist.component';
import { AddChecklistComponent } from './EWM.core/system-settings/checklist/manage-checklist/add-checklist/add-checklist.component';
import { AddChecklistGroupComponent } from './EWM.core/system-settings/checklist/manage-checklist/add-checklist-group/add-checklist-group.component';
import { AddQuestionsComponent } from './EWM.core/system-settings/checklist/manage-checklist/add-questions/add-questions.component';
import { StatesComponent } from './EWM.core/system-settings/Master/states-matter/states/states.component';
import { StatesManageComponent } from './EWM.core/system-settings/Master/states-matter/states-manage/states-manage.component';
import { MapChecklistComponent } from './EWM.core/system-settings/job-workflows/map-checklist/map-checklist.component';
import { BroadbeanIntegrationComponent } from './EWM.core/profile-info/Integration/broadbean-integration/broadbean-integration.component';
import { JobHeaderComponent } from './EWM.core/job/job-header/job-header.component';
import { BurstsmsIntegrationComponent } from './EWM.core/profile-info/Integration/burstsms-integration/burstsms-integration.component';
import { BroadbeanEnabelDesabelComponent } from './EWM.core/profile-info/other-integration/broadbean-enabel-desabel/broadbean-enabel-desabel.component';
import { MapApplicationInfoComponent } from './EWM.core/shared/quick-modal/quickjob/map-application-info/map-application-info.component';
import { SmsTemplateComponent } from './EWM.core/shared/quick-modal/new-email/templates/sms-template/sms-template.component';
import { ThankYouComponent} from './EWM.core/job/application-form/configure-application-form/thank-you/thank-you.component'
import { StatusCandidateUpdateComponent } from './EWM.core/job/status-candidate-update/status-candidate-update.component';
import { BulkSmsComponent } from './EWM.core/job/job/job-sms/bulk-sms/bulk-sms.component';
import { SectionConfigureComponent } from './EWM.core/job/application-form/configure-application-form/section-configure/section-configure.component';
import { SkillEditPopupComponentComponent } from './EWM.core/job/skill-edit-popup-component/skill-edit-popup-component.component';
import { AttachDocumentChecklistComponent } from './EWM.core/job/job-action/attach-document-checklist/attach-document-checklist.component';
import { ImportantLinksComponent } from './EWM.core/job/application-form/configure-application-form/important-links/important-links.component';
import { AddImportantLinksComponent } from './EWM.core/job/application-form/configure-application-form/important-links/add-important-links/add-important-links.component';
import { RequestGdprContentPageComponent } from '../document/request-gdpr-content-page/request-gdpr-content-page.component';
import { CreateCandidateComponent } from './EWM-Candidate/candidate-list/create-candidate/create-candidate.component';
import { XeopleSmartEmailComponent } from './EWM-Candidate/candidate-list/xeople-smart-email/xeople-smart-email.component';
import { VxtAddCallLogComponent } from './EWM-Candidate/candidate-list/vxt-add-call-log/vxt-add-call-log.component';
import { ChooseExpressionCandidateComponent } from './EWM-Candidate/candidate-list/choose-expression-candidate/choose-expression-candidate.component';
import { WelcomeRuleComponent } from './EWM.core/job/application-form/configure-application-form/welcome-rule/welcome-rule.component';
import { MapApplicationFormCandidateComponent } from './EWM-Candidate/candidate-list/map-application-form-candidate/map-application-form-candidate.component';

import { JobEmailTemplatesComponent } from './EWM.core/job/application-form/configure-application-form/welcome-rule/job-email-templates/job-email-templates.component';
import {AlertMessageComponent }  from './EWM.core/job/application-form/configure-application-form/welcome-rule/alert-message/alert-message.component';
import {ConfigureRuleEmailTemplateComponent }  from './EWM.core/job/application-form/configure-application-form/welcome-rule/configure-rule-email-template/configure-rule-email-template.component';
import { ConfigureRuleSameEmailTemplateComponent}  from './EWM.core/job/application-form/configure-application-form/welcome-rule/configure-rule-same-email-template/configure-rule-same-email-template.component';
import { XeopleSearchComponent } from './EWM.core/home/xeople-search/xeople-search.component';

import {AlertMessageSameJobComponent} from './EWM.core/job/application-form/configure-application-form/welcome-rule/alert-message-same-job/alert-message-same-job.component';
import { AddBroadbeanActivateUsersComponent } from './EWM.core/profile-info/Integration/broadbean-integration/add-broadbean-activate-users/add-broadbean-activate-users.component';
import {XeopleSearchActivityComponent} from './EWM.core/home/xeople-search/xeople-search-activity/xeople-search-activity.component';
import { XeoplerAssingJobComponent } from './EWM.core/home/xeople-search/xeopler-assing-job/xeopler-assing-job.component';

import { XeopleSearchAssignJobComponent } from './EWM.core/home/xeople-search/xeople-search-assign-job/xeople-search-assign-job.component';
import { ConfigureJobFieldsComponent } from './EWM.core/shared/quick-modal/quickjob/configure-job-fields/configure-job-fields.component';
import {ConfigureJobFieldPermissionComponent} from './EWM.core/shared/quick-modal/quickjob/configure-job-fields/configure-job-field-permission/configure-job-field-permission.component';
import{ConfigureCreateJobComponent} from './EWM.core/shared/quick-modal/quickjob/configure-job-fields/configure-create-job/configure-create-job.component';
import {ConfigureJobTemplateComponent} from './EWM.core/shared/quick-modal/quickjob/configure-job-fields/configure-job-template/configure-job-template.component';
import {ConfigureTemplatePopupComponent} from './EWM.core/shared/quick-modal/quickjob/configure-job-fields/configure-template-popup/configure-template-popup.component';
import { XeopleSearchMailComponent } from './EWM.core/home/xeople-search/xeople-search-mail/xeople-search-mail.component';
import { CandidateScreeningTimelineComponent } from './EWM.core/job/job-details/screening-and-interview/candidate-screening-timeline/candidate-screening-timeline.component';
import { ResumeCandidateComponent } from './EWM.core/job/job-details/screening-and-interview/resume-candidate/resume-candidate.component';
import { XeopleSearchSmsComponent } from './EWM.core/home/xeople-search/xeople-search-sms/xeople-search-sms.component';
import { XeopleSearchMsgComponent } from './EWM.core/home/xeople-search/xeople-search-msg/xeople-search-msg.component';
import { XeopleSaveFilterComponent } from './EWM.core/home/xeople-search/xeople-save-filter/xeople-save-filter.component';
import { XeopleSearchTimelinesComponent } from './EWM.core/home/xeople-search/xeople-search-timelines/xeople-search-timelines.component';
import { XeopleFilterListComponent } from './EWM.core/home/xeople-search/xeople-filter-list/xeople-filter-list.component';
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { QuickJobLocationComponent } from './EWM.core/shared/quick-modal/quickjob/quick-job-location/quick-job-location.component';
import {DatePickerFormatDirective} from '../shared/directive/date-picker-format/date-picker-format.directive';
import {ClientActivityComponent} from './EWM.core/client/client-activity/client-activity.component';
import {CandidateActivityComponent} from './EWM-Candidate/profile-summary/candidate-activity/candidate-activity.component';
import { DashboardDemoComponent } from './EWM.core/home/dashboard-demo/dashboard-demo.component';
import {XeopleJobModule} from './xeople-job/xeople-job.module';
import { AssignContactComponent } from './EWM.core/shared/quick-modal/quick-add-contact/AssignContact/assign-contact/assign-contact.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LogoutSnackbarComponent } from '../modules/sign-in/logout-snackbar/logout-snackbar.component';
import { ImageUploadKendoEditorPopComponent } from '../shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { QuickAddActivity } from './EWM.core/shared/quick-modal/quick-add-activity/quick-add-activity.component';
import { EhrIntegrationComponent } from './EWM.core/profile-info/Integration/ehr-integration/ehr-integration.component';
import { EohSubscriptionFeaturesComponent } from './EWM.core/profile-info/Integration/ehr-integration/eoh-subscription-features/eoh-subscription-features.component';
import { XeopleSearchEOHComponent } from './EWM.core/home/xeople-search/xeople-search-eoh/xeople-search-eoh.component';
import { EohSearchCardViewComponent } from './EWM.core/home/xeople-search/xeople-search-eoh/eoh-search-card-view/eoh-search-card-view.component';
import { ContactModule } from './EWM.core/contacts/contact.module';
import { XeopleShareResumeComponent } from './EWM.core/home/xeople-search/xeople-share-resume/xeople-share-resume.component';
import { CandidateJobResumeComponent } from './EWM.core/job/job-details/candidate-jobresume/candidate-jobresume.component';
import { CandidateJobresumeParseComponent } from './EWM.core/job/job-details/candidate-jobresume-parse/candidate-jobresume-parse.component';
import { CandidateJobApplicationFormComponent } from './EWM.core/job/job-details/candidate-job-application-form/candidate-job-application-form.component';
import { JobCandidateCardActivityComponent } from './EWM.core/shared/quick-modal/job-candidate-card-activity/job-candidate-card-activity.component';
import { JobDetailsCardViewgoogleMapsLocationPopComponent } from '../shared/modal/job-details-card-viewgoogle-maps-location-pop/job-details-card-viewgoogle-maps-location-pop.component';
import {XeopleSearchFolderlistComponent} from './EWM.core/home/xeople-search/xeople-search-folderlist/xeople-search-folderlist.component';
import { ExtractMapBulkComponent } from './EWM.core/home/xeople-search/xeople-search-eoh/extract-map-bulk/extract-map-bulk.component';
import {XeoplePushMembersComponent} from './EWM.core/home/xeople-search/xeople-push-members/xeople-push-members.component';
import { CloseJobComponent } from '../shared/modal/close-job/close-job.component';
import { JobDeatilsHeaderStatusComponent } from './EWM.core/job/job-action/job-deatils-header-status/job-deatils-header-status.component';
import { XeopleEohFilterListComponent } from './EWM.core/home/xeople-search/xeople-eoh-filter-list/xeople-eoh-filter-list.component';
import { XeopleEohSaveFilterComponent } from './EWM.core/home/xeople-search/xeople-eoh-save-filter/xeople-eoh-save-filter.component';
import {ActivityDrawerComponent} from './EWM.core/home/my-activity/activity-drawer/activity-drawer.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { OuterFooterComponent } from '../core/layout/outer-footer/outer-footer.component';
import { OuterHeaderNewComponent } from '../core/layout/outer-header-new/outer-header-new.component';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuickIndeedLocationComponent } from './EWM.core/shared/quick-modal/quickjob/quick-indeed-location/quick-indeed-location.component';
import { IndeedIntegrationComponent } from './EWM.core/profile-info/Integration/indeed-integration/indeed-integration.component';
import { ShareCalenderComponent } from './EWM.core/home/my-activity-calender/share-calender/share-calender.component';
import { NewForgotPasswordComponent } from './new-forgot-password/new-forgot-password.component';
import { NewForgotEmailComponent } from './new-forgot-email/new-forgot-email.component';
import { CandidateBulkSmsComponent } from './EWM-Candidate/candidate-list/candidate-bulk-sms/candidate-bulk-sms.component';
import { ViewActivityComponent } from './EWM.core/home/view-activity/view-activity.component';
import { CandidateHistoryComponent } from './EWM-Candidate/profile-summary/candidate-history/candidate-history.component';
import { CandidateSmsComponent } from './EWM-Candidate/profile-summary/candidate-sms/candidate-sms.component';
import {LowercaseDirective} from '../shared/directive/lowercase.directive';
import { EmployeeSmsComponent } from './EWM-Employee/employee-detail/employee-sms/employee-sms.component';
import { JobDetailComponent } from './xeople-job/job-detail/job-detail.component';
import { JobManageComponent } from './xeople-job/job-manage/job-manage.component';
import { ManageJobPostingComponent } from './xeople-job/job-detail/manage-job-posting/manage-job-posting.component';
import { SearchCandidateComponent } from './xeople-job/job-detail/search-candidate/search-candidate.component';
import { JobActivityComponent } from './xeople-job/job-detail/job-activity/job-activity.component';
import { AddJobActivityComponent } from './xeople-job/job-detail/add-job-activity/add-job-activity.component';
import { JobNotesComponent } from './xeople-job/job-detail/job-notes/job-notes.component';
import { JobLogComponent } from './xeople-job/job-detail/job-log/job-log.component';
import { JobDocumentComponent } from './xeople-job/job-detail/job-document/job-document.component';
import { ApplicantDetailPopupComponent } from './xeople-job/job-list/applicant-list/applicant-detail-popup/applicant-detail-popup.component';
import { ApplicantListComponent } from './xeople-job/job-list/applicant-list/applicant-list.component';
import { CandidateCardComponent } from './EWM.core/job/job-details/candidate-card/candidate-card.component';
import {  ListviewComponent } from '@app/modules/xeople-job/job-detail/listview/listview.component';
import {  CardviewComponent } from '@app/modules/xeople-job/job-detail/cardview/cardview.component';
import { JobListComponent } from './xeople-job/job-list/job-list.component';
import { ClientHistoryComponent } from './EWM.core/client/client-history/client-history.component';
import { JobGridTreeViewComponent } from './xeople-job/job-detail/job-document/job-grid-tree-view/job-grid-tree-view.component';
import { ClientFolderFeatureComponent } from './EWM.core/client/client-detail/client-summary/client-folder-feature/client-folder-feature.component';
import { ClientlandingFolderComponent } from './EWM.core/client/clientlanding-folder/clientlanding-folder.component';
import { ManageclientfolderComponent } from './EWM.core/client/manageclientfolder/manageclientfolder.component';
import {BasicConfigurationComoponent} from '../shared/utils/basic-configuration.component'
import { ClientBulkSmsComponent } from './EWM.core/client/client-bulk-sms/client-bulk-sms.component';
import {ClientBulkEmailComponent} from './EWM.core/client/client-bulk-email/client-bulk-email.component';
import { CommonSharedModule } from '../shared/common-shared.module';
import {SearchNoteByContactComponent} from './EWM.core/client/client-notes/search-note-by-contact/search-note-by-contact.component';
import { ClientSmsComponent } from '@client/client-sms/client-sms.component';
import { CandidateSourceComponent } from './EWM.core/system-settings/candidate-source/candidate-source.component';
import { ManageCandidateSourceComponent } from './EWM.core/system-settings/candidate-source/manage-candidate-source/manage-candidate-source.component';
import { JobAutomationComponent } from './EWM.core/job/Master/job-type/job-automation/job-automation.component';
import { CommonFilterDiologComponent } from './EWM.core/job/landingpage/common-filter-diolog/common-filter-diolog.component';
import { VxtIntegrationComponent } from './EWM.core/profile-info/Integration/vxt-integration/vxt-integration.component';
import { ClientCalllogComponent } from './EWM.core/client/client-detail/client-calllog/client-calllog.component';
import { CommonAddCallLogComponent } from './EWM.core/client/client-detail/common-add-call-log/common-add-call-log.component';
import { CandidateCallLogComponent } from './EWM-Candidate/profile-summary/candidate-call-log/candidate-call-log.component';
import { CallHistroyComponent } from './EWM.core/home/call-histroy/call-histroy.component';
import { JobCallHistroyComponent } from './xeople-job/job-detail/job-call-histroy/job-call-histroy.component';
import { AddJobCallComponent } from './xeople-job/job-detail/add-job-call/add-job-call.component';
import { ChildSourceListComponent } from './EWM.core/system-settings/candidate-source/child-source-list/child-source-list.component';
import { LeadSourceMasterComponent } from './EWM.core/system-settings/lead-source-master/lead-source-master.component';
import { AddLeadSourceMasterComponent } from './EWM.core/system-settings/lead-source-master/add-lead-source-master/add-lead-source-master.component';
import { LeadWorkflowComponent } from './EWM.core/system-settings/lead-workflow/lead-workflow.component';
import { LeadWorkflowManageComponent } from './EWM.core/system-settings/lead-workflow/lead-workflow-manage/lead-workflow-manage.component';
import { LeadNameManageComponent } from './EWM.core/profile-info/administration/lead-name-manage/lead-name-manage.component';
import {LeadModule} from './EWM-Lead/lead.module';
import { LeadInfoPopupComponent } from './EWM-Lead/lead-info-popup/lead-info-popup.component';
import { ShareContactComponent } from './EWM.core/shared/quick-modal/share-contact/share-contact.component';
import { ShareContactSuccessPopupComponent } from './EWM.core/shared/quick-modal/share-contact/share-contact-success-popup/share-contact-success-popup.component';

/*export class LocalStorage {
  public static get DateFormat() {
      return localStorage.getItem('DateFormat');
  }
}

const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMMM YYYY',
  },
  display: {
    dateInput: LocalStorage.DateFormat,// 'DD MMMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};*/
@NgModule({
  declarations:
    [
      ListviewComponent,
      CardviewComponent,
      ContactReceipentPopupComponent,
      ImageUploadPopupComponent,
      CandidateCardComponent,
      ModulesComponent,
      FooterComponent,
      OuterHeaderComponent,
      HeaderComponent,
      InternationalizationComponent,
      SystemAuditLogComponent,
      SystemAuditLogNewComponent,
      UserRolesComponent,
      UserGroupsComponent,
      UserInvitationComponent,
      MailSettingsComponent,
      EmailTemplatesComponent,
      EmailTemplatesManageComponent,
      SmsTemplatesComponent,
      DatatableSampleComponent,
      PhoneInfoComponent,
      AddressFormatComponent,
      LookAndFeelComponent,
      ContactInfoComponent,
      EmailSettingsComponent,
      EmailIntegrationComponent,
      SecurityComponent,
      AccountPrefrencesComponent,
      ProfileSettingComponent,
      GeneralSettingComponent,
      OrganizationDetailsComponent,
      AdministratorsComponent,
      SiteDomainComponent,
      SearchheaderComponent,
      SidebarComponent,
      CrmLandingPageComponent,
      FinanceLandingPageComponent,
      RostersLandingPageComponent,
      RecruitmentLandingPageComponent,
      AllocationLandingPageComponent,
      MfaComponent,
      MfaSettingsComponent,
      UserTypeMasterComponent,
      SecuritymfaComponent,
      LandingComponent,
      AppInitializationComponent,
      UriComponent,
      AccessLevelsComponent,
      UriComponent,
      LinkExpireComponent,
      LinkDeniedComponent,
      UserRolePermissionComponent,
      AccessDeniedComponent,
      AccessRequestComponent,
      TenantUserComponent,
      AccessRequestManageComponent,
      SocialProfilesComponent,
      LocationTypesComponent,
      LocationTypesOperationComponent,
      CommunicationMasterComponent,
      AddCommunicationMasterComponent,
      SocialProfilesComponent,
      GroupsComponent,
      StatusComponent,
      ManageStatusComponent,
      ReasonsComponent,
      ManageReasonsComponent,
      AddSocialProfileComponent,
      IndustryComponent,
      SubIndustryComponent,
      ManageIndustryComponent,
      ManageSubIndustryComponent,
      QuickpeopleComponent,
      AddemailComponent,
      AddphonesComponent,
      AddTagComponent,
      TagListComponent,
      TwoDigitDecimalNumberDirective,
      AddSocialComponent,
      ManageSalaryUnitComponent,
      SalaryUnitComponent,
      ExperienceTypeComponent,
      ManageExperienceTypeComponent,
      InviteATeammateComponent,
      JobComponent, UserInviteComponent,
      UserInvitationDetailsComponent,
      JobComponent,
      QuickjobComponent,
      AddressBarComponent,
      QuickCompanyComponent,
      AddAddressComponent,
      BrandsComponent,
      ManageBrandsComponent,
      SalaryBandComponent,
      ManageSalaryBandComponent,
      FunctionalExpertiesAddComponent,
      FunctionalExpertiesListComponent,
      FunctionalSubExpertiesListComponent,
      FunctionalSubExpertiesAddComponent,
      CustomerMasterComponent,
      ManageCustomerComponent,
      JobCategoryComponent,
      ManageJobCategoryComponent,
      SubJobCategoryComponent,
      ManageSubJobCategoryComponent,
      JobTypeListComponent,
      JobTypeAddComponent,
      JobSubTypeListComponent,
      JobSubTypeAddComponent,
      QuicklocationComponent,
      JobDescriptionPopupEditorComponent,
      JobWorkflowsComponent,
      JobWorkflowsManageComponent,
      ConfigureJobBoardComponent,
      MappingDataListComponent,
      BreadcrumbComponent,
      SystemAuditDetailsComponent,
      TooltipComponent,
      TooltipDirective,
      IntegrationComponent,
      JobTemplateListComponent,
      JobTemplateManageComponent,
      EmployeeTagComponent,
      EmployeeTagManageComponent,
      CustomizingWidgetsComponent,
      QuickCandidateComponent,
      CustomizationComponent,
      ReportsComponent,
      EmployeesComponent,
      SampleComponent,
      ClientTagMasterComponent,
      ManageClientTagComponent,
      ManageCandidateTagComponent,
      CandidateTagComponent,
      ManageNameComponent,
      EmployeeManageNameComponent,
      FilterDialogComponent,
      PersistFilterComponent,
      DashboardComponent,
      configureDashboardComponent,
      ActionDialogComponent,
      WelcomeComponent,
      MasterDataComponent,
      IntegrationInterfaceBoardComponent,
      WelcomeComponent,
      ProfileSummaryComponent,
      CandidateSummaryComponent,
      OrderbyPipe,
      UploadNewResumeComponent,
      CandidateConfigureDashboardComponent,
      CandidateListComponent,
      AdvancedFilterCandidateComponent,
      DependentpopupComponent,
      GeneralInformationComponent,
      CandidateLocationComponent,
      CandidateResumeComponent,
      ResumeCandidateComponent,
      SkillsPopupComponent,
      RecentnotesComponent,
      RecentnotesPopupComponent,
      CandidateScoreTypeComponent,
      ManageCandidateScoreTypeComponent,
      CandidateExperienceComponent,
      CandidateAddressComponent,
      CandidateEducationComponent,
      CandidateFolderComponent,
      ManageCandidateFolderComponent,
      CandidateAddressComponent,
      CandidateEducationComponent,
      CandidateEmergencyContactsComponent,
      CandidateFolderFilterComponent,
      AdditionalInfoPopupComponent,
      CandidateDegreeTypeComponent,
      ManageCandidateDegreeTypeComponent,
      ManageDocumentCategoryComponent,
      DocumentCategoryComponent,
      DocumentNameComponent,
      QualificationComponent,
      ManageQualificationComponent,
      CustomTableComponent,
      ManageDocumentNameComponent,
      CandidateDocumentComponent,
      CreateNewDocumentComponent,
      CreateFolderComponent,
      CreateDocumentComponent,
      SkillsComponent,
      SkillGroupComponent,
      ManageSkillComponent,
      ManageSkillGroupComponent,
      MyInboxComponent,
      NewEmailComponent,
      PdfViewerComponent,
      GroupSkillConfirmationPopupComponent,
      ViewDocumentComponent,
      GridTreeViewComponent,
      ManageAccessComponent,
      VersionComponent,
      RemoveAccessListComponent,
      ShareDocumentComponent,
      DocumentShareableLinkComponent,
      DocumentComponent,
      RevokeaccessComponent,
      RemoveReasonComponent,
      ManageRemoveReasonComponent,
      ManageViewAccessLevelsComponent,
      AuthenticatorComponent,
      WorkflowCandidateMappedBoxComponent,
      CandidateTimelineComponent,
      CandidateScreeningTimelineComponent,
      TemplatesComponent,
      RemoveCandidateComponent,
      WeightageComponent,
      ManageWeightageComponent,
      CandidateInboxComponent,
      CandidateJobComponent,
      AsignJobComponent,
      JobWorkflowStageComponent,
      ReasonModuleComponent,
      EmployeeListComponent,
      SeekIntegrationComponent,
      ClientLandingComponent,
      ClientDashboardComponent,
      ReasonModuleComponent,
      EmployeeDetailComponent,
      BulkEditComponent,
      EmployeeSummaryComponent,
      CandidateSkillsComponent,
      ManageCandidateSkillsComponent,
      ClientDetailComponent,
      ClientSummaryComponent,
      ClientLocationComponent,
      QuickClientDetailsComponent,
      ClientDescriptionPopupComponent,
      BusinessRegistrationComponent,
      QuickAddContactComponent,
      AddContactRelatedToComponent,
      ContactRelatedTypeComponent,
      ClientInboxComponent,
      ClientVisibilityComponent,
      ClientContactListComponent,
      DaxtraIntegrationComponent,
      ClientJobListComponent,
      ClientNewEmailComponent,
      CompanyContactPopupComponent,
      NotesCategoryComponent,
      ManageNotesCategoryComponent,
      //CandidateResumeParseComponent,
      ClientNotesComponent,
      OwnerFilterComponent,
      DateFilterComponent,
      ManageClientAccessComponent,
      RevokeClientAccessComponent,
      ClientOrgComponent,
      PositionmasterComponent,
      ManagePositionmasterComponent,
      TenantfeatureIntegration,
      JobSMSComponent,
      AccessPermissionComponent,
      ClientJobCategoryComponent,
      AccessPermissionComponent,
      BreadcrumbsComponent,
      EmployeeNotesComponent,
      GooglemapComponent,
      ActivityCategoryComponent,
      ManageActivityCategoryComponent,
      MyActivityComponent,
      AddRequiredAttendeesComponent,
      OrganizerOrAssineesComponent,
      ScheduleComponent,
      ScheduleAssistanceDatePopupComponent,
      MyActivityCalenderComponent,
      ClientTeamComponent,
      AddTeamComponent,
      OtherIntegrationComponent,
      ZoomCallIntegrationComponent,
      EmployeeActivityComponent,
      DateFilterActivityComponent,
      OwnerFilterActivityComponent,
      MarkDoneActivityComponent,
      CategoryFilterActivityComponent,
      MyActivityListComponent,
      CalenderFilterComponent,
      CategoryFilterComponent,
      ManageAccessActivityComponent,
      MyActivityViewComponent,
      ActivityDetailComponent,
       EmailActionsComponent,
      EditOwnerComponent,
      ZoomCallHistoryComponent,
      AutometicConsentRequestComponent,
      GdprComplianceComponent,
      RequestGdprpopupComponent,
      ConsentReqPageTemplateComponent,
      ConsentReqEmailTemplateComponent,
      RelatedToModuleComponent,
      AddRelatedToModuleComponent,
      ClientConfigDashboardPopComponent,
      TimezoneModalComponent,
      UppercaseDirective,
      RevokeActivityAccessComponent,
      ZoomMeetingIntegrationComponent,
      AssessmentLandingPageComponent,
      CreateAssessmentComponent,
      AssessmentQuesComponent,
      AssessmentInfoComponent,
      AssessmentVersionComponent,
      ShareResumeComponent,
      ShareResumeInternalComponent,
      AddOrganizationDetailsComponent,
      SystemAccessTokenComponent,
      GenerateTokenPopupComponent,
      NewApiTokenPopupComponent,
      ViewNotesComponent,
      WorkScheduleComponent,
      TokenCreateConfirmBoxPopupComponent,
      AfterRevokeAccessMessagePopupComponent,
      ShareJobApplicationUrlComponent,
      MsTeamIntegrationComponent,
      GoogleMeetIntegrationComponent,
      DocumentEmailTemplateComponent,
      ManageAdministratorsComponent,
      EmailPreviewPopupComponent,
      ManageSmsTemplatesComponent,
      CareerComponent,
      ManageCareerComponent,
      NikeCareerComponent,
      CareerSiteTypeSelectionComponent,
      CareerNetworkComponent,
      ManageUserTypeMasterComponent,
      SeekLinkoutCareerComponent,
      ManageUserRolesComponent,
      ApplicationFormComponent,
      ManageApplicationFormComponent,
      LandingApplicationFormComponent,
      ConfigureApplicationFormComponent,
      ManageUserTypeMasterComponent,
      CoverPageComponent,
      UploadCoverPageComponent,
      FilePreviwerComponent,
      CoverPageRenameComponent,
      CoverPageVersionHistoryComponent,
      CoverPageViewDetailsComponent,
      ImageUploadAdvancedComponent,
      WelcomePageComponent,
      KnockoutQuestionsComponent,
      PersonalInformationFormComponent,
      DocumentsComponent,
      AssessmentQuestionsComponent,
      TrackingCodeComponent,
      AlertPopupAutoFillAppResumeComponent,
      AddKnockoutQuestionsComponent,
      AddSkillsDocumentComponent,
      FileUploadComponent,
      AddQualificationDocumentComponent,
      FilePreviwerPopupComponent,
      AddAssessmentComponent,
      ManageUserGroupsComponent,
      CandidateRankComponent,
      PublishJobValidationComponent,
      PopupIntegrationCategoryComponent,
      ManageAccessPermissionComponent,
      JobPublishPopupComponent,
      MapApplicationFormComponent,
      ShowOwnerlistPopupComponent,
      GoogleMapsLocationPopComponent,
      ViewCandidateApplicationComponent,
      CandidatePersonalInformationComponent,
      CandidateKnockoutDetailsComponent,
      CandidateDocumentInformationComponent,
      CustomeActivityPageComponent,
      WorkflowSubStagesComponent,
      SearchPipe,
      SessionExpiredComponent,
      SessionExpiredLoginComponent,
      SearchListPipe,
      ChecklistComponent,
      ManageChecklistComponent,
      AddChecklistComponent,
      AddChecklistGroupComponent,
      AddQuestionsComponent,
      StatesComponent,
      StatesManageComponent,
      MapChecklistComponent,
      BroadbeanIntegrationComponent,
      MapApplicationFormComponent,
      JobHeaderComponent,
      BurstsmsIntegrationComponent,
      BroadbeanEnabelDesabelComponent,
      MapApplicationInfoComponent,
      SmsTemplateComponent,
      ThankYouComponent,
      BulkSmsComponent,
      StatusCandidateUpdateComponent,
      OrganizationInfoComponent,
      BulkSmsComponent,
      SectionConfigureComponent,
      SkillEditPopupComponentComponent,
      AttachDocumentChecklistComponent,
      ImportantLinksComponent,
      AddImportantLinksComponent,
      RequestGdprContentPageComponent,
      CreateCandidateComponent,
      XeopleSmartEmailComponent,
      ChooseExpressionCandidateComponent,
      WelcomeRuleComponent,
      MapApplicationFormCandidateComponent,
      JobEmailTemplatesComponent,
      AlertMessageComponent,
      ConfigureRuleEmailTemplateComponent,
      ConfigureRuleSameEmailTemplateComponent,
      XeopleSearchComponent,
      AlertMessageSameJobComponent,
      AddBroadbeanActivateUsersComponent,
      XeopleSearchActivityComponent,
      XeoplerAssingJobComponent,
      XeopleSearchAssignJobComponent,
      ConfigureJobFieldsComponent,
      ConfigureJobFieldPermissionComponent,
      ConfigureCreateJobComponent,
      ConfigureJobTemplateComponent,
      ConfigureTemplatePopupComponent,
      XeopleSearchMailComponent,
      XeopleSearchSmsComponent,
      XeopleSearchMsgComponent,
      XeopleSaveFilterComponent,
      XeopleSearchTimelinesComponent,
      XeopleFilterListComponent,
      QuickJobLocationComponent,
      DatePickerFormatDirective,
      ClientActivityComponent,
      CandidateActivityComponent,
      DashboardDemoComponent,
      AssignContactComponent,
      LogoutSnackbarComponent,
      ImageUploadKendoEditorPopComponent,
      QuickAddActivity,
      EhrIntegrationComponent,
      EohSubscriptionFeaturesComponent,
      XeopleSearchEOHComponent,
      EohSearchCardViewComponent,
      XeopleShareResumeComponent,
      CandidateJobResumeComponent,
      CandidateJobresumeParseComponent,
     CandidateJobApplicationFormComponent,
     JobCandidateCardActivityComponent,
     JobDetailsCardViewgoogleMapsLocationPopComponent,
     XeopleSearchFolderlistComponent,
      ExtractMapBulkComponent,
      XeoplePushMembersComponent,
     CloseJobComponent,
      JobDeatilsHeaderStatusComponent,
      XeopleEohFilterListComponent,
      ActivityDrawerComponent,
      XeopleEohSaveFilterComponent,
      SignInComponent,
      OuterFooterComponent,
      OuterHeaderNewComponent,
      CandidateBulkEmailComponent,
      QuickIndeedLocationComponent,
      IndeedIntegrationComponent,
      ShareCalenderComponent,
      NewForgotPasswordComponent,
      NewForgotEmailComponent,
      CandidateBulkSmsComponent,
      ViewActivityComponent,
      CandidateSmsComponent,
      LowercaseDirective,
      EmployeeSmsComponent,
      JobDetailComponent,
      JobManageComponent,
      ManageJobPostingComponent,
      SearchCandidateComponent,
      CandidateCardComponent,
      ClientHistoryComponent,
      CandidateHistoryComponent,
      ClientSmsComponent,
      JobActivityComponent, AddJobActivityComponent, JobNotesComponent, JobLogComponent,JobDocumentComponent,ApplicantListComponent,ApplicantDetailPopupComponent,JobListComponent,JobGridTreeViewComponent,
      ClientlandingFolderComponent,ClientFolderFeatureComponent,
      ManageclientfolderComponent,
      ClientlandingFolderComponent,ClientFolderFeatureComponent,BasicConfigurationComoponent,ClientBulkSmsComponent,
      ClientBulkEmailComponent,SearchNoteByContactComponent,CandidateSourceComponent,ManageCandidateSourceComponent,
      JobAutomationComponent,CommonFilterDiologComponent,
      VxtIntegrationComponent,ClientCalllogComponent,CommonAddCallLogComponent,CandidateCallLogComponent,CallHistroyComponent,JobCallHistroyComponent,AddJobCallComponent,ChildSourceListComponent,
      LeadSourceMasterComponent,
      AddLeadSourceMasterComponent,
      AddLeadSourceMasterComponent,
         LeadWorkflowComponent,
         VxtAddCallLogComponent,
          LeadWorkflowManageComponent,
      VxtIntegrationComponent,ClientCalllogComponent,CommonAddCallLogComponent,CandidateCallLogComponent,CallHistroyComponent,
      JobCallHistroyComponent,AddJobCallComponent,ChildSourceListComponent,LeadNameManageComponent,
      ShareContactComponent,ShareContactSuccessPopupComponent
    ],
  imports: [CommonModule, ModuleRoutingModule, SharedModule, InfiniteScrollModule, ImageCropperModule, NgSelectModule,
    NgOtpInputModule, DragDropModule, MatFileUploadModule, MatPaginatorModule, MatSortModule, NgxJsonViewerModule, NgxFileDropModule, GooglePlaceModule,
    MatPasswordStrengthModule.forRoot(), NgxOrgChartModule,
    NgOptionHighlightModule, ChartsModule,
    SwiperModule, AutocompleteLibModule,
    NgApexchartsModule,
    AutocompleteLibModule, AgmCoreModule,
    OrgchartModule, NgxMasonryModule,AgmDirectionModule, DateInputsModule,
    XeopleJobModule,ContactModule, BrowserAnimationsModule, ScrollViewModule,CommonSharedModule,LeadModule
  ],
  exports: [ListviewComponent],
//@suika @whn 27-06-2023 @EWM-12865 To set default format of date dd-mm-yyyy
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  /*
  , { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  */
})

export class ModulesModule { }
