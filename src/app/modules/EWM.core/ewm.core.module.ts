import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EWMCoreRoutingModule } from './ewm.core-routing.module';
import { MfaComponent } from './mfa/mfa.component';
import { EmailIntegrationComponent } from './profile-info/email-integration/email-integration.component';
import { SecuritymfaComponent } from './profile-info/security/securitymfa/securitymfa.component';
import { UserInvitationComponent } from './system-settings/user-invitation/user-invitation.component';
import { ImageUploadPopupComponent } from './shared/image-upload-popup/image-upload-popup.component';
import { AccessLevelsComponent } from './system-settings/access-levels/access-levels.component';
import { UserRolePermissionComponent } from './system-settings/user-roles/user-role-permission/user-role-permission.component';
import { EmailTemplatesManageComponent } from './system-settings/email-templates/email-templates-manage/email-templates-manage.component';
import { ContactReceipentPopupComponent } from './shared/contact-receipent-popup/contact-receipent-popup.component';
import { AccessRequestComponent } from './user-management/access-request/access-request.component';
import { AccessRequestManageComponent } from './user-management/access-request/access-requestManage/access-request-manage.component';
import { SocialProfilesComponent } from './system-settings/social-profiles/social-profiles.component';
import { LocationTypesComponent } from './system-settings/location-type-master/location-types/location-types.component';
import { LocationTypesOperationComponent } from './system-settings/location-type-master/location-types-operation/location-types-operation.component';
import { GroupsComponent } from './system-settings/status-master/groups/groups.component';
import { StatusComponent } from './system-settings/status-master/status/status.component';
import { ReasonsComponent } from './system-settings/status-master/reasons/reasons.component';
import { ManageStatusComponent } from './system-settings/status-master/manage-status/manage-status.component';
import { ManageReasonsComponent } from './system-settings/status-master/manage-reasons/manage-reasons.component';
import { AddSocialProfileComponent } from './system-settings/social-profiles/add-social-profile/add-social-profile.component';
import { IndustryComponent } from './system-settings/industry/industry.component';
import { ManageIndustryComponent } from './system-settings/industry/manage-industry/manage-industry.component';
import { SubIndustryComponent } from './system-settings/industry/sub-industry/sub-industry.component';
import { ManageSubIndustryComponent } from './system-settings/industry/sub-industry/manage-sub-industry/manage-sub-industry.component';
import { QuickpeopleComponent } from './shared/quick-modal/quickpeople/quickpeople.component';
import { AddemailComponent } from './shared/quick-modal/addemail/addemail.component';
import { AddphonesComponent } from './shared/quick-modal/addphones/addphones.component';
import { AddTagComponent } from './job/Master/Tag/add-tag/add-tag.component';
import { TagListComponent } from './job/Master/Tag/tag-list/tag-list.component';
import { TwoDigitDecimalNumberDirective } from './system-settings/industry/manage-industry/two-digit-decimal-number.directive';
import { AddSocialComponent } from './shared/quick-modal/add-social/add-social.component';
import { SalaryUnitComponent } from './job/Master/salary-unit/salary-unit.component';
import { ManageSalaryUnitComponent } from './job/Master/salary-unit/manage-salary-unit/manage-salary-unit.component';
import { ExperienceTypeComponent } from './job/Master/experience/experience-type/experience-type.component';
import { ManageExperienceTypeComponent } from './job/Master/experience/manage-experience-type/manage-experience-type.component';
import { InviteATeammateComponent } from './invite-a-teammate/invite-a-teammate.component';
import { JobComponent } from './job/job/job.component';
import { UserInviteComponent } from './system-settings/user-invitation/user-invite/user-invite.component';
import { UserInvitationDetailsComponent } from './system-settings/user-invitation/user-invitation-details/user-invitation-details.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { QuickjobComponent } from './shared/quick-modal/quickjob/quickjob.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { QuickCompanyComponent } from './shared/quick-modal/quick-company/quick-company.component';
import { AddAddressComponent } from './shared/quick-modal/add-address/add-address.component';
import { BrandsComponent } from './job/Master/brands/brands.component';
import { ManageBrandsComponent } from './job/Master/brands/manage-brands/manage-brands.component';
import { SalaryBandComponent } from './job/Master/salary-band/salary-band.component';
import { ManageSalaryBandComponent } from './job/Master/salary-band/manage-salary-band/manage-salary-band.component';
import { FunctionalExpertiesAddComponent } from './job/Master/functional-experties-master/functional-experties-add/functional-experties-add.component';
import { FunctionalExpertiesListComponent } from './job/Master/functional-experties-master/functional-experties-list/functional-experties-list.component';
import { FunctionalSubExpertiesListComponent } from './job/Master/functional-experties-master/functional-sub-experties-list/functional-sub-experties-list.component';
import { FunctionalSubExpertiesAddComponent } from './job/Master/functional-experties-master/functional-sub-experties-add/functional-sub-experties-add.component';
import { CustomerMasterComponent } from './system-settings/customer-master/customer-master.component';
import { ManageCustomerComponent } from './system-settings/customer-master/manage-customer/manage-customer.component';
import { JobCategoryComponent } from './job/Master/job-category/job-category.component';
import { ManageJobCategoryComponent } from './job/Master/job-category/manage-job-category/manage-job-category.component';
import { SubJobCategoryComponent } from './job/Master/job-category/sub-job-category/sub-job-category.component';
import { ManageSubJobCategoryComponent } from './job/Master/job-category/sub-job-category/manage-sub-job-category/manage-sub-job-category.component';
import { JobTypeListComponent } from './job/Master/job-type/job-type-list/job-type-list.component';
import { JobTypeAddComponent } from './job/Master/job-type/job-type-add/job-type-add.component';
import { JobSubTypeListComponent } from './job/Master/job-type/job-sub-type-list/job-sub-type-list.component';
import { JobSubTypeAddComponent } from './job/Master/job-type/job-sub-type-add/job-sub-type-add.component';
import { QuicklocationComponent } from './shared/quick-modal/addlocation/quicklocation.component';
import { JobDescriptionPopupEditorComponent } from './shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';
import { JobWorkflowsComponent } from './system-settings/job-workflows/job-workflows.component';
import { JobWorkflowsManageComponent } from './system-settings/job-workflows/job-workflows-manage/job-workflows-manage.component';
import { ConfigureJobBoardComponent } from './job/configure-job-board/configure-job-board.component';
import { MappingDataListComponent } from './job/configure-job-board/mapping-data-list/mapping-data-list.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { SystemAuditLogNewComponent } from './system-settings/system-audit-log-new/system-audit-log-new.component';
import { SystemAuditDetailsComponent } from './system-settings/system-audit-log-new/system-audit-details/system-audit-details.component';
import { TooltipComponent } from './shared/tooltip/tooltip.component';
import { TooltipDirective } from './shared/tooltip/tooltip.directive';
import { JobTemplateListComponent } from './job/create-job-template/job-template-list/job-template-list.component';
import { JobTemplateManageComponent } from './job/create-job-template/job-template-manage/job-template-manage.component';
import { EmployeeTagComponent } from './profile-info/Integration/employee-tag/employee-tag.component';
import { EmployeeTagManageComponent } from './profile-info/Integration/employee-tag/employee-tag-manage/employee-tag-manage.component';
import { IntegrationComponent } from './profile-info/Integration/integration.component';
import { CustomizingWidgetsComponent } from './profile-info/customizing-widgets/customizing-widgets.component';
import { QuickCandidateComponent } from './shared/quick-modal/quick-candidate/quick-candidate.component';
import { ClientTagMasterComponent } from './profile-info/Integration/client-tag-master/client-tag-master.component';
import { ManageClientTagComponent } from './profile-info/Integration/client-tag-master/manage-client-tag/manage-client-tag.component';
import { CustomizationComponent } from './system-menu/customization/customization.component';
import { ReportsComponent } from './reports/reports.component';
import { EmployeesComponent } from './employees/employees.component';
import { SampleComponent } from './sample/sample.component';
import { CandidateTagComponent } from './profile-info/Integration/candidate-tag/candidate-tag.component';
import { ManageCandidateTagComponent } from './profile-info/Integration/candidate-tag/manage-candidate-tag/manage-candidate-tag.component';
import { ManageNameComponent } from './profile-info/administration/manage-name/manage-name.component';
import { EmployeeManageNameComponent } from './profile-info/administration/employee-manage-name/employee-manage-name.component';
import { FilterDialogComponent } from './job/landingpage/filter-dialog/filter-dialog.component';
import { MasterDataComponent } from './system-menu/master-data/master-data.component';
import { IntegrationInterfaceBoardComponent } from './profile-info/Integration/integration-interface-board/integration-interface-board.component';
import { RecentnotesComponent } from '../EWM-Candidate/recentnotes/recentnotes.component';
import { ViewNotesComponent } from '../EWM-Candidate/recentnotes/view-notes/view-notes.component';
import { RecentnotesPopupComponent } from '../EWM-Candidate/recentnotes/recentnotes-popup/recentnotes-popup.component';
import { CandidateScoreTypeComponent } from './profile-info/administration/candidate-score-type/candidate-score-type.component';
import { ManageCandidateScoreTypeComponent } from './profile-info/administration/candidate-score-type/manage-candidate-score-type/manage-candidate-score-type.component';
import { CandidateDegreeTypeComponent } from './profile-info/administration/candidate-degree-type/candidate-degree-type.component';
import { ManageCandidateDegreeTypeComponent } from './profile-info/administration/candidate-degree-type/manage-candidate-degree-type/manage-candidate-degree-type.component';
import { DocumentCategoryComponent } from './profile-info/administration/document-category/document-category.component';
import { ManageDocumentCategoryComponent } from './profile-info/administration/document-category/manage-document-category/manage-document-category.component';
import { DocumentNameComponent } from './profile-info/administration/document-category/document-name/document-name.component';
import { QualificationComponent } from './system-settings/qualification/qualification.component';
import { ManageQualificationComponent } from './system-settings/qualification/manage-qualification/manage-qualification.component';
import { CustomTableComponent } from './profile-info/administration/employee-manage-name/custom-table/custom-table.component';
import { ManageDocumentNameComponent } from './profile-info/administration/document-category/manage-document-name/manage-document-name.component';
import { MyInboxComponent } from './home/my-inbox/my-inbox.component';
import { NewEmailComponent } from './shared/quick-modal/new-email/new-email.component';
import { SkillsComponent } from './system-settings/skills/skills.component';
import { ManageSkillComponent } from './system-settings/skills/manage-skill/manage-skill.component';
import { SkillGroupComponent } from './system-settings/skill-group/skill-group.component';
import { ManageSkillGroupComponent } from './system-settings/skill-group/manage-skill-group/manage-skill-group.component';
import { GroupSkillConfirmationPopupComponent } from './shared/quick-modal/quickjob/group-skill-confirmation-popup/group-skill-confirmation-popup.component';
import { ManageViewAccessLevelsComponent } from './system-settings/access-levels/manage-view-access-levels/manage-view-access-levels.component';
import { AuthenticatorComponent } from './authenticator/authenticator.component';
import { WorkflowCandidateMappedBoxComponent } from './job/workflow-candidate-mapped-box/workflow-candidate-mapped-box.component';
import { TemplatesComponent } from './shared/quick-modal/new-email/templates/templates.component';
import { CandidateTimelineComponent } from './job/candidate-timeline/candidate-timeline.component';
import { RemoveCandidateComponent } from './job/remove-candidate/remove-candidate.component';
// import { DocumentUploadComponent } from './shared/document-upload/document-upload.component';
import { WeightageComponent } from './system-settings/weightage/weightage.component';
import { ManageWeightageComponent } from './system-settings/weightage/manage-weightage/manage-weightage.component';
import { SeekIntegrationComponent } from './profile-info/Integration/seek-integration/seek-integration.component';
import { ClientLandingComponent } from './client/client-landing/client-landing.component';
import { ReasonModuleComponent } from './job/Master/reason-module/reason-module.component';
import { RemoveReasonComponent } from './job/Master/reason-module/reason-group/remove-reason.component';
import { ManageRemoveReasonComponent } from './job/Master/reason-module/reason-group/manage-remove-reason/manage-remove-reason.component';
import { ClientDashboardComponent } from './client/client-dashboard/client-dashboard.component';
import { BulkEditComponent } from './system-settings/skills/bulk-edit/bulk-edit.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import { ClientSummaryComponent } from './client/client-detail/client-summary/client-summary.component';
import { ClientLocationComponent } from './client/client-location/client-location.component';
import { QuickClientDetailsComponent } from './client/client-detail/quick-client-details/quick-client-details.component';
import { ClientDescriptionPopupComponent } from './client/client-detail/client-summary/client-description-popup/client-description-popup.component';
import { BusinessRegistrationComponent } from './client/client-detail/client-summary/business-registration/business-registration.component';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { QuickAddContactComponent } from './shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { ContactRelatedTypeComponent } from './shared/quick-modal/quick-add-contact/contact-related-type/contact-related-type.component';
import { AddContactRelatedToComponent } from './shared/quick-modal/quick-add-contact/add-contact-related-to/add-contact-related-to.component';
import { ClientInboxComponent } from './client/client-inbox/client-inbox.component';
import { ClientVisibilityComponent } from './client/client-visibility/client-visibility.component';
import { ClientContactListComponent } from './client/client-contact-list/client-contact-list.component';
import { DaxtraIntegrationComponent } from './profile-info/Integration/daxtra-integration/daxtra-integration.component';
import { ClientJobListComponent } from './client/client-job-list/client-job-list.component';
import { ClientNewEmailComponent } from './client/client-new-email/client-new-email.component';
import { CompanyContactPopupComponent } from './shared/quick-modal/quick-company/company-contact-popup/company-contact-popup.component';
import { NotesCategoryComponent } from './system-settings/notes-category/notes-category.component';
import { ManageNotesCategoryComponent } from './system-settings/notes-category/manage-notes-category/manage-notes-category.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ClientNotesComponent } from './client/client-notes/client-notes.component';
import { OwnerFilterComponent } from './client/client-notes/owner-filter/owner-filter.component';
import { DateFilterComponent } from './client/client-notes/date-filter/date-filter.component';
import { ManageClientAccessComponent } from './client/client-notes/manage-client-access/manage-client-access.component';
import { RevokeClientAccessComponent } from './client/client-notes/revoke-client-access/revoke-client-access.component';
import { ClientOrgComponent } from './client/client-org/client-org.component';
import { PositionmasterComponent } from './job/Master/positionmaster/positionmaster.component';
import { ManagePositionmasterComponent } from './job/Master/positionmaster/manage-positionmaster/manage-positionmaster.component';
import { ClientJobCategoryComponent } from './client/client-notes/client-job-category/client-job-category.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GooglemapComponent } from './shared/googlemap/googlemap.component';
import { ActivityCategoryComponent } from './system-settings/activity-category/activity-category.component';
import { ManageActivityCategoryComponent } from './system-settings/activity-category/manage-activity-category/manage-activity-category.component';
import { MyActivityComponent } from './home/my-activity/my-activity.component';
import { AddRequiredAttendeesComponent } from './home/my-activity/add-required-attendees/add-required-attendees.component';
import { OrganizerOrAssineesComponent } from './home/my-activity/organizer-or-assinees/organizer-or-assinees.component';
import { ScheduleComponent } from './home/my-activity/schedule/schedule.component';
import { MyActivityCalenderComponent } from './home/my-activity-calender/my-activity-calender.component';
import { ClientTeamComponent } from './client/client-team/client-team.component';
import { AddTeamComponent } from './shared/quick-modal/add-team/add-team.component';
import { OtherIntegrationComponent } from './profile-info/other-integration/other-integration.component';
import { ZoomCallIntegrationComponent } from './profile-info/other-integration/zoom-call-integration/zoom-call-integration.component';
import { MyActivityListComponent } from './home/my-activity-list/my-activity-list.component';
import { CalenderFilterComponent } from './home/my-activity-list/calender-filter/calender-filter.component';
import { CategoryFilterComponent } from './home/my-activity-list/category-filter/category-filter.component';
import { MyActivityViewComponent } from './home/my-activity-list/my-activity-view/my-activity-view.component';
import { ActivityDetailComponent } from './home/my-activity-calender/activity-detail/activity-detail.component';
import { EditOwnerComponent } from './client/edit-owner/edit-owner.component';
import { TenantfeatureIntegration } from './profile-info/Integration/tenant-feature-integration/tenant-feature-integration.component';
import { ZoomCallHistoryComponent } from './home/zoom-call-history/zoom-call-history.component';
import { configureDashboardComponent } from './home/configure-dashboard/configure-dashboard.component';
import { GdprComplianceComponent } from './user-administration/gdpr/gdpr-compliance/gdpr-compliance.component';
import { AutometicConsentRequestComponent } from './user-administration/gdpr/autometic-consent-request/autometic-consent-request.component';
import { ConsentReqPageTemplateComponent } from './user-administration/gdpr/consent-req-page-template/consent-req-page-template.component';
import { ConsentReqEmailTemplateComponent } from './user-administration/gdpr/consent-req-email-template/consent-req-email-template.component';
import { RelatedToModuleComponent } from './system-settings/related-to-module/related-to-module.component';
import { AddRelatedToModuleComponent } from './system-settings/related-to-module/add-related-to-module/add-related-to-module.component';
import { TimezoneModalComponent } from './home/my-activity-calender/timezone-modal/timezone-modal.component';
import { ZoomMeetingIntegrationComponent } from './profile-info/other-integration/zoom-meeting-integration/zoom-meeting-integration.component';
import { AssessmentLandingPageComponent } from './job/Master/assessment/assessment-landing-page/assessment-landing-page.component';
import { CreateAssessmentComponent } from './job/Master/assessment/create-assessment/create-assessment.component';
import { AssessmentQuesComponent } from './job/Master/assessment/create-assessment/assessment-ques/assessment-ques.component';
import { AssessmentInfoComponent } from './job/Master/assessment/assessment-info/assessment-info.component';
import { AssessmentVersionComponent } from './job/Master/assessment/assessment-version/assessment-version.component';
import { AddOrganizationDetailsComponent } from './user-administration/organization-details/add-organization-details/add-organization-details.component';
import { SystemAccessTokenComponent } from './user-administration/system-access-token/system-access-token.component';
import { GenerateTokenPopupComponent } from './user-administration/system-access-token/generate-token-popup/generate-token-popup.component';
import { NewApiTokenPopupComponent } from './user-administration/system-access-token/new-api-token-popup/new-api-token-popup.component';
import { TokenCreateConfirmBoxPopupComponent } from './user-administration/system-access-token/token-create-confirm-box-popup/token-create-confirm-box-popup.component';
import { AfterRevokeAccessMessagePopupComponent } from './user-administration/system-access-token/after-revoke-access-message-popup/after-revoke-access-message-popup.component';
import { WorkScheduleComponent } from './profile-info/work-schedule/work-schedule.component';
import { MsTeamIntegrationComponent } from './profile-info/other-integration/ms-team-integration/ms-team-integration.component';
import { GoogleMeetIntegrationComponent } from './profile-info/other-integration/google-meet-integration/google-meet-integration.component';
import { DocumentEmailTemplateComponent } from './system-settings/email-templates/email-templates-manage/document-email-template/document-email-template.component';
import { ManageAdministratorsComponent } from './user-administration/administrators/manage-administrators/manage-administrators.component';
import { EmailPreviewPopupComponent } from './system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { ManageSmsTemplatesComponent } from './system-settings/sms-templates/manage-sms-templates/manage-sms-templates.component';
import { ScheduleAssistanceDatePopupComponent } from './home/my-activity/schedule-assistance-date-popup/schedule-assistance-date-popup.component';
import { CareerComponent } from './job/career/career.component';
import { ManageCareerComponent } from './job/career/manage-career/manage-career.component';
import { NikeCareerComponent } from './job/career/nike-career/nike-career.component';
import { CareerSiteTypeSelectionComponent } from './job/career/career-site-type-selection/career-site-type-selection.component';
import { CareerNetworkComponent } from './job/career/career-network/career-network.component';
import { ApplicationFormComponent } from './job/application-form/application-form.component';
import { ManageApplicationFormComponent } from './job/application-form/manage-application-form/manage-application-form.component';
import { LandingApplicationFormComponent } from './job/application-form/landing-application-form/landing-application-form.component';
import { ConfigureApplicationFormComponent } from './job/application-form/configure-application-form/configure-application-form.component';
import { ManageUserTypeMasterComponent } from './system-settings/user-type-master/manage-user-type-master/manage-user-type-master.component';
import { ManageUserRolesComponent } from './system-settings/user-roles/manage-user-roles/manage-user-roles.component';
import { ImageUploadAdvancedComponent } from './shared/image-upload-advanced/image-upload-advanced.component';
import { WelcomePageComponent } from './job/application-form/configure-application-form/welcome-page/welcome-page.component';
import { KnockoutQuestionsComponent } from './job/application-form/configure-application-form/knockout-questions/knockout-questions.component';
import { PersonalInformationFormComponent } from './job/application-form/configure-application-form/personal-information-form/personal-information-form.component';
import { DocumentsComponent } from './job/application-form/configure-application-form/documents/documents.component';
import { AssessmentQuestionsComponent } from './job/application-form/configure-application-form/assessment-questions/assessment-questions.component';
import { TrackingCodeComponent } from './job/application-form/configure-application-form/tracking-code/tracking-code.component';
import { AlertPopupAutoFillAppResumeComponent } from './job/application-form/configure-application-form/welcome-page/alert-popup-auto-fill-app-resume/alert-popup-auto-fill-app-resume.component';
import { AddKnockoutQuestionsComponent } from './job/application-form/configure-application-form/knockout-questions/add-knockout-questions/add-knockout-questions.component';
import { AddSkillsDocumentComponent } from './job/application-form/configure-application-form/documents/add-skills-document/add-skills-document.component';
import { AddQualificationDocumentComponent } from './job/application-form/configure-application-form/documents/add-qualification-document/add-qualification-document.component';
import { AddAssessmentComponent } from './system-settings/job-workflows/add-assessment/add-assessment.component';
import { ManageUserGroupsComponent } from './system-settings/user-groups/manage-user-groups/manage-user-groups.component';
import { CandidateRankComponent } from './job/job-details/candidate-rank/candidate-rank.component';
import { PublishJobValidationComponent } from './shared/quick-modal/quickjob/publish-job-validation/publish-job-validation.component';
import { PopupIntegrationCategoryComponent } from './shared/quick-modal/quickjob/popup-integration-category/popup-integration-category.component';
import { ManageAccessPermissionComponent } from './system-settings/access-permission/manage-access-permission/manage-access-permission.component';
import { MapApplicationFormComponent } from './job/job-details/map-application-form/map-application-form.component';
import { ShowOwnerlistPopupComponent } from './job/landingpage/show-ownerlist-popup/show-ownerlist-popup.component';
import { ShareJobApplicationUrlComponent } from './job/job-details/share-job-application-url/share-job-application-url.component';
import { WorkflowSubStagesComponent } from './job/landingpage/workflow-sub-stages/workflow-sub-stages.component';
import { PersistFilterComponent } from './job/landingpage/job-filter-dialog/persist-filter/persist-filter.component';
import { ChecklistComponent } from './system-settings/checklist/checklist.component';
import { ManageChecklistComponent } from './system-settings/checklist/manage-checklist/manage-checklist.component';
import { AddChecklistComponent } from './system-settings/checklist/manage-checklist/add-checklist/add-checklist.component';
import { AddChecklistGroupComponent } from './system-settings/checklist/manage-checklist/add-checklist-group/add-checklist-group.component';
import { AddQuestionsComponent } from './system-settings/checklist/manage-checklist/add-questions/add-questions.component';
import { StatesComponent } from './system-settings/Master/states-matter/states/states.component';
import { StatesManageComponent } from './system-settings/Master/states-matter/states-manage/states-manage.component';
import { MapChecklistComponent } from './system-settings/job-workflows/map-checklist/map-checklist.component';
import { BroadbeanIntegrationComponent } from './profile-info/Integration/broadbean-integration/broadbean-integration.component';
import { JobHeaderComponent } from './job/job-header/job-header.component';
import { BurstsmsIntegrationComponent } from './profile-info/Integration/burstsms-integration/burstsms-integration.component';
import { BroadbeanEnabelDesabelComponent } from './profile-info/other-integration/broadbean-enabel-desabel/broadbean-enabel-desabel.component';
import { MapApplicationInfoComponent } from './shared/quick-modal/quickjob/map-application-info/map-application-info.component';
import { SmsTemplateComponent } from './shared/quick-modal/new-email/templates/sms-template/sms-template.component';
import { ThankYouComponent } from './job/application-form/configure-application-form/thank-you/thank-you.component';
import { StatusCandidateUpdateComponent } from './job/status-candidate-update/status-candidate-update.component';
import { OrganizationInfoComponent } from './job/application-form/configure-application-form/welcome-page/organization-info/organization-info.component';
import { BulkSmsComponent } from './job/job/job-sms/bulk-sms/bulk-sms.component';
import { SectionConfigureComponent } from './job/application-form/configure-application-form/section-configure/section-configure.component';
import { SkillEditPopupComponentComponent } from './job/skill-edit-popup-component/skill-edit-popup-component.component';
import { AttachDocumentChecklistComponent } from './job/job-action/attach-document-checklist/attach-document-checklist.component';
import { ImportantLinksComponent } from './job/application-form/configure-application-form/important-links/important-links.component';
import { AddImportantLinksComponent } from './job/application-form/configure-application-form/important-links/add-important-links/add-important-links.component';
import { WelcomeRuleComponent } from './job/application-form/configure-application-form/welcome-rule/welcome-rule.component';
import { JobEmailTemplatesComponent } from './job/application-form/configure-application-form/welcome-rule/job-email-templates/job-email-templates.component';
import { AlertMessageComponent } from './job/application-form/configure-application-form/welcome-rule/alert-message/alert-message.component';
import { ConfigureRuleEmailTemplateComponent } from './job/application-form/configure-application-form/welcome-rule/configure-rule-email-template/configure-rule-email-template.component';
import { ConfigureRuleSameEmailTemplateComponent } from './job/application-form/configure-application-form/welcome-rule/configure-rule-same-email-template/configure-rule-same-email-template.component';
import { XeopleSearchComponent } from './home/xeople-search/xeople-search.component';
import { AlertMessageSameJobComponent } from './job/application-form/configure-application-form/welcome-rule/alert-message-same-job/alert-message-same-job.component';
import { AddBroadbeanActivateUsersComponent } from './profile-info/Integration/broadbean-integration/add-broadbean-activate-users/add-broadbean-activate-users.component';
import { XeopleSearchActivityComponent } from './home/xeople-search/xeople-search-activity/xeople-search-activity.component';
import { XeoplerAssingJobComponent } from './home/xeople-search/xeopler-assing-job/xeopler-assing-job.component';
import { XeopleSearchAssignJobComponent } from './home/xeople-search/xeople-search-assign-job/xeople-search-assign-job.component';
import { ConfigureJobFieldsComponent } from './shared/quick-modal/quickjob/configure-job-fields/configure-job-fields.component';
import { ConfigureJobFieldPermissionComponent } from './shared/quick-modal/quickjob/configure-job-fields/configure-job-field-permission/configure-job-field-permission.component';
import { ConfigureCreateJobComponent } from './shared/quick-modal/quickjob/configure-job-fields/configure-create-job/configure-create-job.component';
import { ConfigureJobTemplateComponent } from './shared/quick-modal/quickjob/configure-job-fields/configure-job-template/configure-job-template.component';
import { ConfigureTemplatePopupComponent } from './shared/quick-modal/quickjob/configure-job-fields/configure-template-popup/configure-template-popup.component';
import { XeopleSearchMailComponent } from './home/xeople-search/xeople-search-mail/xeople-search-mail.component';
import { XeopleSearchSmsComponent } from './home/xeople-search/xeople-search-sms/xeople-search-sms.component';
import { CandidateScreeningTimelineComponent } from './job/job-details/screening-and-interview/candidate-screening-timeline/candidate-screening-timeline.component';
import { XeopleSaveFilterComponent } from './home/xeople-search/xeople-save-filter/xeople-save-filter.component';
import { XeopleSearchTimelinesComponent } from './home/xeople-search/xeople-search-timelines/xeople-search-timelines.component';
import { XeopleFilterListComponent } from './home/xeople-search/xeople-filter-list/xeople-filter-list.component';
import { ResumeCandidateComponent } from './job/job-details/screening-and-interview/resume-candidate/resume-candidate.component';
import { QuickJobLocationComponent } from './shared/quick-modal/quickjob/quick-job-location/quick-job-location.component';
import { ClientActivityComponent } from './client/client-activity/client-activity.component';
import { DashboardDemoComponent } from './home/dashboard-demo/dashboard-demo.component';
import { AssignContactComponent } from './shared/quick-modal/quick-add-contact/AssignContact/assign-contact/assign-contact.component';
import { EhrIntegrationComponent } from './profile-info/Integration/ehr-integration/ehr-integration.component';
import { EohSubscriptionFeaturesComponent } from './profile-info/Integration/ehr-integration/eoh-subscription-features/eoh-subscription-features.component';
import { XeopleSearchEOHComponent } from './home/xeople-search/xeople-search-eoh/xeople-search-eoh.component';
import { EohSearchCardViewComponent } from './home/xeople-search/xeople-search-eoh/eoh-search-card-view/eoh-search-card-view.component';
import { XeopleShareResumeComponent } from './home/xeople-search/xeople-share-resume/xeople-share-resume.component';
import { CandidateJobresumeParseComponent } from './job/job-details/candidate-jobresume-parse/candidate-jobresume-parse.component';
import { CandidateJobApplicationFormComponent } from './job/job-details/candidate-job-application-form/candidate-job-application-form.component';
import { XeopleSearchFolderlistComponent } from './home/xeople-search/xeople-search-folderlist/xeople-search-folderlist.component';
import { ExtractMapBulkComponent } from './home/xeople-search/xeople-search-eoh/extract-map-bulk/extract-map-bulk.component';
import { XeoplePushMembersComponent } from './home/xeople-search/xeople-push-members/xeople-push-members.component';
import { JobDeatilsHeaderStatusComponent } from './job/job-action/job-deatils-header-status/job-deatils-header-status.component';
import { XeopleEohFilterListComponent } from './home/xeople-search/xeople-eoh-filter-list/xeople-eoh-filter-list.component';
import { XeopleEohSaveFilterComponent } from './home/xeople-search/xeople-eoh-save-filter/xeople-eoh-save-filter.component';
import { QuickIndeedLocationComponent } from './shared/quick-modal/quickjob/quick-indeed-location/quick-indeed-location.component';
import { IndeedIntegrationComponent } from './profile-info/Integration/indeed-integration/indeed-integration.component';
import { ShareCalenderComponent } from './home/my-activity-calender/share-calender/share-calender.component';
import { ViewActivityComponent } from './home/view-activity/view-activity.component';
import { ActivityDrawerComponent } from './home/my-activity/activity-drawer/activity-drawer.component';
import { CandidateCardComponent } from './job/job-details/candidate-card/candidate-card.component';
import { ClientHistoryComponent } from './client/client-history/client-history.component';
import { ClientFolderFeatureComponent } from './client/client-detail/client-summary/client-folder-feature/client-folder-feature.component';
import { ClientlandingFolderComponent } from './client/clientlanding-folder/clientlanding-folder.component';
import { ManageclientfolderComponent } from './client/manageclientfolder/manageclientfolder.component';
import { ClientBulkSmsComponent } from './client/client-bulk-sms/client-bulk-sms.component';
import { ClientBulkEmailComponent } from './client/client-bulk-email/client-bulk-email.component';
import { SearchNoteByContactComponent } from './client/client-notes/search-note-by-contact/search-note-by-contact.component';
import { ClientSmsComponent } from './client/client-sms/client-sms.component';
import { CandidateSourceComponent } from './system-settings/candidate-source/candidate-source.component';
import { ManageCandidateSourceComponent } from './system-settings/candidate-source/manage-candidate-source/manage-candidate-source.component';
import { XeopleSearchMsgComponent } from './home/xeople-search/xeople-search-msg/xeople-search-msg.component';
import { JobAutomationComponent } from './job/Master/job-type/job-automation/job-automation.component';
import { VxtIntegrationComponent } from './profile-info/Integration/vxt-integration/vxt-integration.component';
import { ClientCalllogComponent } from './client/client-detail/client-calllog/client-calllog.component';
// import { VxtAddCallLogComponent } from './client/client-detail/vxt-add-call-log/vxt-add-call-log.component';
import { CommonAddCallLogComponent } from './client/client-detail/common-add-call-log/common-add-call-log.component';
import { CallHistroyComponent } from './home/call-histroy/call-histroy.component';
import { ChildSourceListComponent } from './system-settings/candidate-source/child-source-list/child-source-list.component';
import { LeadSourceMasterComponent } from './system-settings/lead-source-master/lead-source-master.component';
import { AddLeadSourceMasterComponent } from './system-settings/lead-source-master/add-lead-source-master/add-lead-source-master.component';
import { LeadWorkflowComponent } from './system-settings/lead-workflow/lead-workflow.component';
import { LeadWorkflowManageComponent } from './system-settings/lead-workflow/lead-workflow-manage/lead-workflow-manage.component';
import { LeadNameManageComponent } from './profile-info/administration/lead-name-manage/lead-name-manage.component';
import { ShareContactComponent } from './shared/quick-modal/share-contact/share-contact.component';
import { ShareContactSuccessPopupComponent } from './shared/quick-modal/share-contact/share-contact-success-popup/share-contact-success-popup.component';
@NgModule({
  declarations: [MfaComponent, EmailIntegrationComponent, SocialProfilesComponent, SecuritymfaComponent,
    UserInvitationComponent, ImageUploadPopupComponent, AccessLevelsComponent, UserRolePermissionComponent,
    // DocumentUploadComponent,

    EmailTemplatesManageComponent, ContactReceipentPopupComponent, AccessRequestComponent, AccessRequestManageComponent,
    SocialProfilesComponent, GroupsComponent, StatusComponent, ReasonsComponent, ManageStatusComponent,
    ManageReasonsComponent, IndustryComponent,
    ManageIndustryComponent, SubIndustryComponent, ManageSubIndustryComponent, LocationTypesComponent,
    LocationTypesOperationComponent, AddTagComponent, TagListComponent, TwoDigitDecimalNumberDirective,
    QuickpeopleComponent,
    AddphonesComponent,
    AddSocialProfileComponent,
    AddemailComponent,
    AddSocialComponent,
    SalaryUnitComponent,
    CandidateCardComponent,
    ManageSalaryUnitComponent,
    ExperienceTypeComponent,
    ManageExperienceTypeComponent,
    InviteATeammateComponent,
    JobComponent,
    UserInviteComponent,
    UserInvitationDetailsComponent,
    QuickjobComponent,
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
    SystemAuditLogNewComponent,
    SystemAuditDetailsComponent,
    TooltipComponent,
    TooltipDirective,
    JobTemplateListComponent,
    JobTemplateManageComponent,
    EmployeeTagComponent,
    EmployeeTagManageComponent,
    IntegrationComponent,
    CustomizingWidgetsComponent,
    QuickCandidateComponent,
    CustomizationComponent,
    //JobDescriptionEditorComponent,
    ReportsComponent,
    EmployeesComponent,
    SampleComponent,
    ClientTagMasterComponent,
    ManageClientTagComponent,
    CustomizationComponent,
    CandidateTagComponent,
    ManageCandidateTagComponent,
    ManageNameComponent,
    EmployeeManageNameComponent,
    EmailTemplatesManageComponent, ContactReceipentPopupComponent, AccessRequestComponent, AccessRequestManageComponent,
    SocialProfilesComponent, GroupsComponent, StatusComponent, ReasonsComponent, ManageStatusComponent,
    ManageReasonsComponent, IndustryComponent,
    ManageIndustryComponent, SubIndustryComponent, ManageSubIndustryComponent, LocationTypesComponent,
    LocationTypesOperationComponent, AddTagComponent, TagListComponent, TwoDigitDecimalNumberDirective,
    QuickpeopleComponent,
    AddphonesComponent, NewEmailComponent,
    AddSocialProfileComponent,
    AddemailComponent,
    AddSocialComponent,
    SalaryUnitComponent,
    ManageSalaryUnitComponent,
    ExperienceTypeComponent,
    ManageExperienceTypeComponent,
    InviteATeammateComponent,
    JobComponent,
    UserInviteComponent,
    UserInvitationDetailsComponent,
    QuickjobComponent,
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
    SystemAuditLogNewComponent,
    SystemAuditDetailsComponent,
    TooltipComponent,
    TooltipDirective,
    JobTemplateListComponent,
    JobTemplateManageComponent,
    EmployeeTagComponent,
    EmployeeTagManageComponent,
    IntegrationComponent,
    CustomizingWidgetsComponent,
    QuickCandidateComponent,
    CustomizationComponent,
    ReportsComponent,
    EmployeesComponent,
    SampleComponent,
    ClientTagMasterComponent,
    ManageClientTagComponent,
    CustomizationComponent,
    CandidateTagComponent,
    ManageCandidateTagComponent,
    FilterDialogComponent,
    MasterDataComponent,
    IntegrationInterfaceBoardComponent,
    RecentnotesComponent,
    ViewNotesComponent,
    RecentnotesPopupComponent,
    CandidateScoreTypeComponent,
    ManageCandidateScoreTypeComponent,
    CandidateDegreeTypeComponent,
    ManageCandidateDegreeTypeComponent,
    DocumentCategoryComponent,
    ManageDocumentCategoryComponent,
    DocumentNameComponent,
    QualificationComponent,
    ManageQualificationComponent,
    CustomTableComponent,
    ManageDocumentNameComponent,
    MyInboxComponent,
    NewEmailComponent,
    SkillsComponent,
    ManageSkillComponent,
    SkillGroupComponent,
    ManageSkillGroupComponent,
    GroupSkillConfirmationPopupComponent,
    RemoveReasonComponent,
    ManageRemoveReasonComponent,
    ManageViewAccessLevelsComponent,
    AuthenticatorComponent,
    WorkflowCandidateMappedBoxComponent,
    RemoveCandidateComponent,
    CandidateTimelineComponent,
    TemplatesComponent,
    // DocumentUploadComponent,
    WeightageComponent,
    ManageWeightageComponent,
    SeekIntegrationComponent,
    ClientLandingComponent,
    ReasonModuleComponent,
    ClientDashboardComponent,
    BulkEditComponent,
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
    ClientNotesComponent,
    OwnerFilterComponent,
    DateFilterComponent,
    ManageClientAccessComponent,
    RevokeClientAccessComponent,
    ClientOrgComponent,
    PositionmasterComponent,
    ManagePositionmasterComponent,
    TenantfeatureIntegration,
    ClientJobCategoryComponent,
    GooglemapComponent,
    ActivityCategoryComponent,
    ManageActivityCategoryComponent,
    MyActivityComponent,
    AddRequiredAttendeesComponent,
    OrganizerOrAssineesComponent,
    ScheduleComponent,
    MyActivityCalenderComponent,
    ClientTeamComponent,
    AddTeamComponent,
    OtherIntegrationComponent,
    ZoomCallIntegrationComponent,
    MyActivityListComponent,
    CalenderFilterComponent,
    CategoryFilterComponent,
    MyActivityViewComponent,
    ActivityDetailComponent,
    EditOwnerComponent,
    ZoomCallHistoryComponent,
    configureDashboardComponent,
    EditOwnerComponent,
    GdprComplianceComponent,
    AutometicConsentRequestComponent,
    ConsentReqPageTemplateComponent,
    ConsentReqEmailTemplateComponent,
    RelatedToModuleComponent,
    AddRelatedToModuleComponent,
    TimezoneModalComponent,
    ZoomMeetingIntegrationComponent,
    AssessmentLandingPageComponent,
    CreateAssessmentComponent,
    AssessmentQuesComponent,
    AssessmentInfoComponent,
    AssessmentVersionComponent,
    AddOrganizationDetailsComponent,
    SystemAccessTokenComponent,
    GenerateTokenPopupComponent,
    NewApiTokenPopupComponent,
    TokenCreateConfirmBoxPopupComponent,
    AfterRevokeAccessMessagePopupComponent,
    WorkScheduleComponent,
    MsTeamIntegrationComponent,
    GoogleMeetIntegrationComponent,
    DocumentEmailTemplateComponent,
    ManageAdministratorsComponent,
    EmailPreviewPopupComponent,
    ManageSmsTemplatesComponent,
    ScheduleAssistanceDatePopupComponent,
    CareerComponent,
    ManageCareerComponent,
    NikeCareerComponent,
    CareerSiteTypeSelectionComponent,
    CareerNetworkComponent,
    ApplicationFormComponent,
    ManageApplicationFormComponent,
    LandingApplicationFormComponent,
    ConfigureApplicationFormComponent,
    ManageUserTypeMasterComponent,
    ManageUserRolesComponent,
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
    AddQualificationDocumentComponent,
    AddAssessmentComponent,
    ManageUserGroupsComponent,
    CandidateRankComponent,
    PublishJobValidationComponent,
    PopupIntegrationCategoryComponent,
    ManageAccessPermissionComponent,
    MapApplicationFormComponent,
    ShowOwnerlistPopupComponent,
    ShareJobApplicationUrlComponent,
    WorkflowSubStagesComponent,
    PersistFilterComponent,
    ChecklistComponent,
    ManageChecklistComponent,
    AddChecklistComponent,
    AddChecklistGroupComponent,
    AddQuestionsComponent,
    StatesComponent,
    StatesManageComponent,
    MapChecklistComponent,
    BroadbeanIntegrationComponent,
    JobHeaderComponent,
    BroadbeanEnabelDesabelComponent,
    BurstsmsIntegrationComponent,
    BroadbeanEnabelDesabelComponent,
    MapApplicationInfoComponent,
    SmsTemplateComponent,
    ThankYouComponent,
    StatusCandidateUpdateComponent,
    OrganizationInfoComponent,
    BulkSmsComponent,
    SectionConfigureComponent,
    SkillEditPopupComponentComponent,
    AttachDocumentChecklistComponent,
    ImportantLinksComponent,
    AddImportantLinksComponent,
    WelcomeRuleComponent,
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
    CandidateScreeningTimelineComponent,
    XeopleSearchSmsComponent,
    XeopleSaveFilterComponent,
    XeopleSearchTimelinesComponent,
    XeopleFilterListComponent,
    ResumeCandidateComponent,
    QuickJobLocationComponent,
    ClientActivityComponent,
    DashboardDemoComponent,
    AssignContactComponent,
    EhrIntegrationComponent,
    EohSubscriptionFeaturesComponent,
    EohSearchCardViewComponent,
    XeopleShareResumeComponent,
    CandidateJobresumeParseComponent,
    CandidateJobApplicationFormComponent,
    XeopleSearchFolderlistComponent,
    ExtractMapBulkComponent,
    XeoplePushMembersComponent,
    JobDeatilsHeaderStatusComponent,
    XeopleEohSaveFilterComponent,
    QuickIndeedLocationComponent,
    IndeedIntegrationComponent,
    ShareCalenderComponent,
    ViewActivityComponent,
    ActivityDrawerComponent,
    ClientHistoryComponent,
    ClientFolderFeatureComponent,
    ClientlandingFolderComponent,
    ManageclientfolderComponent,
    ClientBulkSmsComponent,
    ClientBulkEmailComponent,
    SearchNoteByContactComponent,
    ClientSmsComponent,
    CandidateSourceComponent,
    ManageCandidateSourceComponent,
    XeopleSearchMsgComponent,
    JobAutomationComponent,
    VxtIntegrationComponent,
    ClientCalllogComponent,
    // VxtAddCallLogComponent,
    CommonAddCallLogComponent,
    CallHistroyComponent,
    ChildSourceListComponent,
    LeadSourceMasterComponent,
    AddLeadSourceMasterComponent,
    LeadWorkflowComponent,
    LeadWorkflowManageComponent,
    LeadNameManageComponent,
    ShareContactComponent,
    ShareContactSuccessPopupComponent
  ],
  imports: [
    EWMCoreRoutingModule,
    NgxFileDropModule,
    GooglePlaceModule,
    AgmCoreModule,
    AutocompleteLibModule,
    AgmDirectionModule
  ],
  entryComponents: [ImageUploadPopupComponent, TooltipComponent]
})

export class EWMCoreModule { }
