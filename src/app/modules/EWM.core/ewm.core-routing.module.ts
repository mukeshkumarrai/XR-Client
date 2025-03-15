import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MfaComponent } from './mfa/mfa.component';
import { AccountPrefrencesComponent } from './profile-info/account-prefrences/account-prefrences.component';
import { ContactInfoComponent } from './profile-info/contact-info/contact-info.component';
import { EmailIntegrationComponent } from './profile-info/email-integration/email-integration.component';
import { EmailSettingsComponent } from './profile-info/email-settings/email-settings.component';
import { ProfileSettingComponent } from './profile-info/profile-setting/profile-setting.component';
import { SecurityComponent } from './profile-info/security/security.component';
import { AddressFormatComponent } from './system-settings/address-format/address-format.component';
import { EmailTemplatesComponent } from './system-settings/email-templates/email-templates.component';
import { UserInvitationComponent } from './system-settings/user-invitation/user-invitation.component';
import { GeneralSettingComponent } from './system-settings/general-setting/general-setting.component';
import { InternationalizationComponent } from './system-settings/internationalization/internationalization.component';
import { LookAndFeelComponent } from './system-settings/look-and-feel/look-and-feel.component';
import { MailSettingsComponent } from './system-settings/mail-settings/mail-settings.component';
import { PhoneInfoComponent } from './system-settings/phone-info/phone-info.component';
import { SmsTemplatesComponent } from './system-settings/sms-templates/sms-templates.component';
import { SystemAuditLogNewComponent } from './system-settings/system-audit-log-new/system-audit-log-new.component';
import { UserGroupsComponent } from './system-settings/user-groups/user-groups.component';
import { UserRolesComponent } from './system-settings/user-roles/user-roles.component';
import { AdministratorsComponent } from './user-administration/administrators/administrators.component';
import { OrganizationDetailsComponent } from './user-administration/organization-details/organization-details.component';
import { SiteDomainComponent } from './user-administration/site-domain/site-domain.component';
import { UserTypeMasterComponent } from './system-settings/user-type-master/user-type-master.component';
import { SecuritymfaComponent } from './profile-info/security/securitymfa/securitymfa.component';
import { DatatableSampleComponent } from './system-settings/datatable-sample/datatable-sample.component';
import { AccessLevelsComponent } from './system-settings/access-levels/access-levels.component';
import { EmailTemplatesManageComponent } from './system-settings/email-templates/email-templates-manage/email-templates-manage.component';
import { LinkDeniedComponent } from '../errors/link-denied/link-denied.component';
import { AccessRequestComponent } from './user-management/access-request/access-request.component';
import { AccessRequestManageComponent } from './user-management/access-request/access-requestManage/access-request-manage.component';
import { CommunicationMasterComponent } from './system-settings/Master/communication-master/communication-master.component';
import { AddCommunicationMasterComponent } from './system-settings/Master/add-communication-master/add-communication-master.component';
import { SocialProfilesComponent } from './system-settings/social-profiles/social-profiles.component';
import { AddSocialProfileComponent } from './system-settings/social-profiles/add-social-profile/add-social-profile.component';
import { LocationTypesComponent } from './system-settings/location-type-master/location-types/location-types.component';
import { LocationTypesOperationComponent } from './system-settings/location-type-master/location-types-operation/location-types-operation.component';
import { GroupsComponent } from './system-settings/status-master/groups/groups.component';
import { StatusComponent } from './system-settings/status-master/status/status.component';
import { ManageStatusComponent } from './system-settings/status-master/manage-status/manage-status.component';
import { ReasonsComponent } from './system-settings/status-master/reasons/reasons.component';
import { ManageReasonsComponent } from './system-settings/status-master/manage-reasons/manage-reasons.component';
import { IndustryComponent } from './system-settings/industry/industry.component';
import { ManageIndustryComponent } from './system-settings/industry/manage-industry/manage-industry.component';
import { SubIndustryComponent } from './system-settings/industry/sub-industry/sub-industry.component';
import { ManageSubIndustryComponent } from './system-settings/industry/sub-industry/manage-sub-industry/manage-sub-industry.component';
import { ExperienceTypeComponent } from './job/Master/experience/experience-type/experience-type.component';
import { ManageExperienceTypeComponent } from './job/Master/experience/manage-experience-type/manage-experience-type.component';
import { AddTagComponent } from './job/Master/Tag/add-tag/add-tag.component';
import { TagListComponent } from './job/Master/Tag/tag-list/tag-list.component';
import { SalaryUnitComponent } from './job/Master/salary-unit/salary-unit.component';
import { ManageSalaryUnitComponent } from './job/Master/salary-unit/manage-salary-unit/manage-salary-unit.component';
import { JobComponent } from './job/job/job.component';
import { UserInviteComponent } from './system-settings/user-invitation/user-invite/user-invite.component';
import { UserInvitationDetailsComponent } from './system-settings/user-invitation/user-invitation-details/user-invitation-details.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
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
import { JobWorkflowsComponent } from './system-settings/job-workflows/job-workflows.component';
import { JobWorkflowsManageComponent } from './system-settings/job-workflows/job-workflows-manage/job-workflows-manage.component';
import { JobTemplateListComponent } from './job/create-job-template/job-template-list/job-template-list.component';
import { JobTemplateManageComponent } from './job/create-job-template/job-template-manage/job-template-manage.component';
import { EmployeeTagComponent } from './profile-info/Integration/employee-tag/employee-tag.component';
import { EmployeeTagManageComponent } from './profile-info/Integration/employee-tag/employee-tag-manage/employee-tag-manage.component';
import { CustomizationComponent } from './system-menu/customization/customization.component';
import { SampleComponent } from './sample/sample.component';
import { CustomizingWidgetsComponent } from './profile-info/customizing-widgets/customizing-widgets.component';
import { ClientTagMasterComponent } from './profile-info/Integration/client-tag-master/client-tag-master.component';
import { ManageClientTagComponent } from './profile-info/Integration/client-tag-master/manage-client-tag/manage-client-tag.component';
import { CandidateTagComponent } from './profile-info/Integration/candidate-tag/candidate-tag.component';
import { ManageCandidateTagComponent } from './profile-info/Integration/candidate-tag/manage-candidate-tag/manage-candidate-tag.component';
import { ManageNameComponent } from './profile-info/administration/manage-name/manage-name.component';
import { EmployeeManageNameComponent } from './profile-info/administration/employee-manage-name/employee-manage-name.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { configureDashboardComponent } from './home/configure-dashboard/configure-dashboard.component';
import { MasterDataComponent } from './system-menu/master-data/master-data.component';
import { IntegrationInterfaceBoardComponent } from './profile-info/Integration/integration-interface-board/integration-interface-board.component';
import { CandidateScoreTypeComponent } from './profile-info/administration/candidate-score-type/candidate-score-type.component';
 import { ManageCandidateScoreTypeComponent } from './profile-info/administration/candidate-score-type/manage-candidate-score-type/manage-candidate-score-type.component';
 import { CandidateDegreeTypeComponent } from './profile-info/administration/candidate-degree-type/candidate-degree-type.component';
 import { ManageCandidateDegreeTypeComponent } from './profile-info/administration/candidate-degree-type/manage-candidate-degree-type/manage-candidate-degree-type.component';
 import { DocumentCategoryComponent } from './profile-info/administration/document-category/document-category.component';
 import { ManageDocumentCategoryComponent } from './profile-info/administration/document-category/manage-document-category/manage-document-category.component';
 import { DocumentNameComponent } from './profile-info/administration/document-category/document-name/document-name.component';
 import { ManageDocumentNameComponent } from './profile-info/administration/document-category/manage-document-name/manage-document-name.component';

 import { QualificationComponent } from './system-settings/qualification/qualification.component';
 import {StatesComponent} from './system-settings/Master/states-matter/states/states.component';
 import {StatesManageComponent} from './system-settings/Master/states-matter/states-manage/states-manage.component';
import { ManageQualificationComponent } from './system-settings/qualification/manage-qualification/manage-qualification.component';
import { MyInboxComponent } from './home/my-inbox/my-inbox.component';
import { SkillsComponent } from './system-settings/skills/skills.component';
import { ManageSkillComponent } from './system-settings/skills/manage-skill/manage-skill.component';
import { SkillGroupComponent } from './system-settings/skill-group/skill-group.component';
import { ManageSkillGroupComponent } from './system-settings/skill-group/manage-skill-group/manage-skill-group.component';
import { RemoveReasonComponent } from './job/Master/reason-module/reason-group/remove-reason.component';
import { ManageRemoveReasonComponent } from './job/Master/reason-module/reason-group/manage-remove-reason/manage-remove-reason.component';
import { ManageViewAccessLevelsComponent } from './system-settings/access-levels/manage-view-access-levels/manage-view-access-levels.component';
import { WeightageComponent } from './system-settings/weightage/weightage.component';
import { ManageWeightageComponent } from './system-settings/weightage/manage-weightage/manage-weightage.component';
import { SeekIntegrationComponent } from './profile-info/Integration/seek-integration/seek-integration.component';
import { ClientLandingComponent } from './client/client-landing/client-landing.component';
import { ReasonModuleComponent } from './job/Master/reason-module/reason-module.component';
import { ClientDashboardComponent } from './client/client-dashboard/client-dashboard.component';
import { BulkEditComponent } from './system-settings/skills/bulk-edit/bulk-edit.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import {DaxtraIntegrationComponent} from './profile-info/Integration/daxtra-integration/daxtra-integration.component'
import { NotesCategoryComponent } from './system-settings/notes-category/notes-category.component';
import { ManageNotesCategoryComponent } from './system-settings/notes-category/manage-notes-category/manage-notes-category.component';
import { NotesDetailsComponent } from 'src/app/shared/notes-details/notes-details.component';
import { ClientOrgComponent } from './client/client-org/client-org.component';
import { PositionmasterComponent } from './job/Master/positionmaster/positionmaster.component';
import { ManagePositionmasterComponent } from './job/Master/positionmaster/manage-positionmaster/manage-positionmaster.component';
import { AccessPermissionComponent } from './system-settings/access-permission/access-permission.component';
import { ActivityCategoryComponent } from './system-settings/activity-category/activity-category.component';
import { ManageActivityCategoryComponent } from './system-settings/activity-category/manage-activity-category/manage-activity-category.component';
import { MyActivityCalenderComponent } from './home/my-activity-calender/my-activity-calender.component';
import { OtherIntegrationComponent } from './profile-info/other-integration/other-integration.component';
import { ZoomCallIntegrationComponent } from './profile-info/other-integration/zoom-call-integration/zoom-call-integration.component';
import { EmailActionsComponent } from './user-administration/email-actions/email-actions.component';
import { TenantfeatureIntegration } from './profile-info/Integration/tenant-feature-integration/tenant-feature-integration.component';
import { ZoomCallHistoryComponent } from './home/zoom-call-history/zoom-call-history.component';
import { GdprComplianceComponent } from './user-administration/gdpr/gdpr-compliance/gdpr-compliance.component';
import { RelatedToModuleComponent } from './system-settings/related-to-module/related-to-module.component';
import { AddRelatedToModuleComponent } from './system-settings/related-to-module/add-related-to-module/add-related-to-module.component';
import { ZoomMeetingIntegrationComponent } from './profile-info/other-integration/zoom-meeting-integration/zoom-meeting-integration.component';
import { AssessmentLandingPageComponent } from './job/Master/assessment/assessment-landing-page/assessment-landing-page.component';
import { CreateAssessmentComponent } from './job/Master/assessment/create-assessment/create-assessment.component';
import { AddOrganizationDetailsComponent } from './user-administration/organization-details/add-organization-details/add-organization-details.component';
import { SystemAccessTokenComponent } from './user-administration/system-access-token/system-access-token.component';
import { WorkScheduleComponent } from './profile-info/work-schedule/work-schedule.component';
import { MsTeamIntegrationComponent } from './profile-info/other-integration/ms-team-integration/ms-team-integration.component';
import { GoogleMeetIntegrationComponent } from './profile-info/other-integration/google-meet-integration/google-meet-integration.component';
import { ManageAdministratorsComponent } from './user-administration/administrators/manage-administrators/manage-administrators.component';
import { ManageSmsTemplatesComponent } from './system-settings/sms-templates/manage-sms-templates/manage-sms-templates.component';
import { ApplicationFormComponent } from './job/application-form/application-form.component';
import { ManageApplicationFormComponent } from './job/application-form/manage-application-form/manage-application-form.component';
import { LandingApplicationFormComponent } from './job/application-form/landing-application-form/landing-application-form.component';
import { ConfigureApplicationFormComponent } from './job/application-form/configure-application-form/configure-application-form.component';
import { ManageUserTypeMasterComponent } from './system-settings/user-type-master/manage-user-type-master/manage-user-type-master.component';
import { ManageUserRolesComponent } from './system-settings/user-roles/manage-user-roles/manage-user-roles.component';
import { ManageUserGroupsComponent } from './system-settings/user-groups/manage-user-groups/manage-user-groups.component';
import { ManageAccessPermissionComponent } from './system-settings/access-permission/manage-access-permission/manage-access-permission.component';
import { ChecklistComponent } from './system-settings/checklist/checklist.component';
import { ManageChecklistComponent } from './system-settings/checklist/manage-checklist/manage-checklist.component';
import { AddChecklistComponent } from './system-settings/checklist/manage-checklist/add-checklist/add-checklist.component';
import { AddChecklistGroupComponent } from './system-settings/checklist/manage-checklist/add-checklist-group/add-checklist-group.component';
import { BroadbeanIntegrationComponent } from './profile-info/Integration/broadbean-integration/broadbean-integration.component';
import { BurstsmsIntegrationComponent } from './profile-info/Integration/burstsms-integration/burstsms-integration.component';
import { BroadbeanEnabelDesabelComponent } from './profile-info/other-integration/broadbean-enabel-desabel/broadbean-enabel-desabel.component';
import { XeopleSearchComponent } from './home/xeople-search/xeople-search.component';
import { XeoplerAssingJobComponent } from './home/xeople-search//xeopler-assing-job/xeopler-assing-job.component';
import { XeopleSearchAssignJobComponent } from './home/xeople-search/xeople-search-assign-job/xeople-search-assign-job.component';
import { XeopleSearchMailComponent } from '../EWM.core/home/xeople-search/xeople-search-mail/xeople-search-mail.component';
import { XeopleSearchSmsComponent } from './home/xeople-search/xeople-search-sms/xeople-search-sms.component';
import { XeopleSearchMsgComponent } from './home/xeople-search/xeople-search-msg/xeople-search-msg.component';
import { XeopleSearchTimelinesComponent } from './home/xeople-search/xeople-search-timelines/xeople-search-timelines.component';
import { DashboardDemoComponent } from './home/dashboard-demo/dashboard-demo.component';
import { EhrIntegrationComponent } from './profile-info/Integration/ehr-integration/ehr-integration.component';
import { XeopleSearchEOHComponent } from './home/xeople-search/xeople-search-eoh/xeople-search-eoh.component';
import { IndeedIntegrationComponent } from './profile-info/Integration/indeed-integration/indeed-integration.component';
import { CandidateSourceComponent } from './system-settings/candidate-source/candidate-source.component';
import { ManageCandidateSourceComponent } from './system-settings/candidate-source/manage-candidate-source/manage-candidate-source.component';
import { JobAutomationComponent } from './job/Master/job-type/job-automation/job-automation.component';
import { VxtIntegrationComponent } from './profile-info/Integration/vxt-integration/vxt-integration.component';
import { CommonAddCallLogComponent } from './client/client-detail/common-add-call-log/common-add-call-log.component';
import { CandidateCallLogComponent } from '../EWM-Candidate/profile-summary/candidate-call-log/candidate-call-log.component';
import { CallHistroyComponent } from './home/call-histroy/call-histroy.component';
import { ChildSourceListComponent } from './system-settings/candidate-source/child-source-list/child-source-list.component';
import { LeadSourceMasterComponent } from './system-settings/lead-source-master/lead-source-master.component';
import { AddLeadSourceMasterComponent } from './system-settings/lead-source-master/add-lead-source-master/add-lead-source-master.component';
import { LeadWorkflowComponent } from './system-settings/lead-workflow/lead-workflow.component';
import { LeadWorkflowManageComponent } from './system-settings/lead-workflow/lead-workflow-manage/lead-workflow-manage.component';
import { LeadNameManageComponent } from './profile-info/administration/lead-name-manage/lead-name-manage.component';

const routes: Routes = [
     { path: 'security-mfa', component: SecuritymfaComponent },
      {
        path: 'profile',
        children: [
          { path: 'contact-info', component: ContactInfoComponent, canActivate: [AuthGuard] },
          { path: 'profile-setting', component: ProfileSettingComponent },
          { path: 'account-prefrences', component: AccountPrefrencesComponent, canActivate: [AuthGuard] },
          { path: 'email-integration', component: EmailIntegrationComponent, canActivate: [AuthGuard] },
          { path: 'customizing-widgets', component: CustomizingWidgetsComponent, canActivate: [AuthGuard] },
          { path: 'email-settings', component: EmailSettingsComponent, canActivate: [AuthGuard] },
          { path: 'security-mfa', component: SecuritymfaComponent },
          { path: 'security-info', component: SecurityComponent, canActivate: [AuthGuard] },
          { path: 'mfa', component: MfaComponent, canActivate: [AuthGuard] },
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: 'other-integration', component: OtherIntegrationComponent },
          { path: 'other-integration/zoom-call-integration', component: ZoomCallIntegrationComponent },
          { path: 'other-integration/zoom-meeting-integration', component: ZoomMeetingIntegrationComponent },
          { path: 'work-schedule', component: WorkScheduleComponent },
          { path: 'other-integration/ms-team-integration', component: MsTeamIntegrationComponent },
          { path: 'other-integration/google-meet-integration', component: GoogleMeetIntegrationComponent },
          { path: 'other-integration/broadbeanenabel-integration', component: BroadbeanEnabelDesabelComponent },
          { path: 'email-template', component: EmailTemplatesComponent, canActivate: [AuthGuard] },
           { path: 'email-template/manage', component: EmailTemplatesManageComponent, canActivate: [AuthGuard] },
          { path: 'email-template/manage:id', component: EmailTemplatesManageComponent, canActivate: [AuthGuard] },
          { path: 'sms-template', component: SmsTemplatesComponent, canActivate: [AuthGuard] },
          { path: 'sms-template/manage-sms-template', component: ManageSmsTemplatesComponent, canActivate: [AuthGuard] },
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: '**', redirectTo: 'profile-setting' },

        ]
      },

      {
        path: 'home',
        children: [
          { path: 'dashboard', component:DashboardComponent,canActivate: [AuthGuard] }, /*--@When:16-05-2023 @who:Nitin Bhati,@why:EWM-12445,@what:For redirect to dashboard demo page--*/
          { path: 'dashboardv1', component: DashboardDemoComponent,canActivate: [AuthGuard] },/*--@When:16-05-2023 @who:Nitin Bhati,@why:EWM-12445,@what:For redirect to dashboard demo page--*/
          { path: 'mailbox', component: MyInboxComponent,canActivate: [AuthGuard] },
          { path: 'myactivity', component: MyActivityCalenderComponent,canActivate: [AuthGuard] },
          { path: 'zoom-call-history', component: ZoomCallHistoryComponent },
          { path: 'configure-dashboard', component: configureDashboardComponent },
          { path: 'access-denied', component: LinkDeniedComponent},
          { path: 'xeople-search', component: XeopleSearchComponent},
          { path: 'XeoplerAssingJob', component: XeoplerAssingJobComponent},
          { path: 'XeopleSearchAssignJob', component: XeopleSearchAssignJobComponent},
          { path: 'XeopleSearchMail', component: XeopleSearchMailComponent},
          { path: 'XeopleSearchSms', component: XeopleSearchSmsComponent},
          { path: 'XeopleSearchMsg', component: XeopleSearchMsgComponent},
          { path: 'XeopleSearchTimelines', component: XeopleSearchTimelinesComponent},
          { path: 'xeople-search-eoh', component: XeopleSearchEOHComponent},
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: 'Call_Histroy_Component', component: CallHistroyComponent },

          { path: '**', redirectTo: 'dashboard' }
        ]
      },

      {
        path: 'user-management',
        children: [
          { path: 'user-invitation', component: UserInvitationComponent, canActivate: [AuthGuard] },
          { path: 'user-invitation/user-invitationmanage/:id', component: UserInvitationDetailsComponent, canActivate: [AuthGuard] },
          { path: 'user-invitation/user-invite', component: UserInviteComponent, canActivate: [AuthGuard] },
          { path: 'user-group', component: UserGroupsComponent, canActivate: [AuthGuard] },
          { path: 'user-group/manage-user-group', component: ManageUserGroupsComponent, canActivate: [AuthGuard] },
          { path: 'user-role', component: UserRolesComponent, canActivate: [AuthGuard] },
          { path: 'user-role/manage-user-role', component: ManageUserRolesComponent, canActivate: [AuthGuard] },

          { path: 'user-type-master', component: UserTypeMasterComponent, canActivate: [AuthGuard] },
          { path: 'user-type-master/manage-user-type-master', component: ManageUserTypeMasterComponent, canActivate: [AuthGuard] },
          { path: 'access-request', component: AccessRequestComponent, canActivate: [AuthGuard] },
          { path: 'access-request/access-requestmanage/:id', component: AccessRequestManageComponent, canActivate: [AuthGuard] },
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: 'access-levels', component: AccessLevelsComponent, canActivate: [AuthGuard] },
          { path: 'access-levels/manage-view', component: ManageViewAccessLevelsComponent, canActivate: [AuthGuard] },
          { path: 'access-levels/manage-view/:id', component: ManageViewAccessLevelsComponent, canActivate: [AuthGuard] },
          { path: '**', redirectTo: 'user-invitation' }

        ]
      },
      {
        path: 'administrators',
        children: [
           /****************lead workflow group start****************/
           { path: 'lead-workflow', component: LeadWorkflowComponent, canActivate: [AuthGuard] },
           { path: 'lead-workflow/manage', component: LeadWorkflowManageComponent, canActivate: [AuthGuard] },

           /****************lead workflow group end****************/
        // <!-- @Who: bantee ,@When: 6-04-2023, @Why: EWM-11742-->

          { path: 'masterdata/lead-manage-name', component: LeadNameManageComponent, canActivate: [AuthGuard] },
          { path: 'masterdata/manage-name', component: ManageNameComponent, canActivate: [AuthGuard] },
          { path: 'masterdata/employee-manage-name', component: EmployeeManageNameComponent, canActivate: [AuthGuard] },
          { path: 'administrators', component: AdministratorsComponent, canActivate: [AuthGuard] },
          { path: 'administrators/manage-administrators', component: ManageAdministratorsComponent, canActivate: [AuthGuard] },
          { path: 'organization-details', component: OrganizationDetailsComponent, canActivate: [AuthGuard] },
          { path: 'organization-details/add-organization-details', component: AddOrganizationDetailsComponent, canActivate: [AuthGuard] },
          { path: 'site-domain', component: SiteDomainComponent, canActivate: [AuthGuard] },
          { path: 'social-profiles', component: SocialProfilesComponent, canActivate: [AuthGuard] },
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: 'customization', component: CustomizationComponent, canActivate: [AuthGuard] },
          { path: 'masterdata', component: MasterDataComponent, canActivate: [AuthGuard] },
          { path: 'custom-candidate-field', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'candidate_pipeline', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'custom-contact-field', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'client-custom-field', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'client-tags', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'visibility', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'custom-job-field', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'job-pipeline', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'key-pipline', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'job-templates', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'integrations', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'data-management', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'calender-integrations', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'notifications', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'data-management', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'project-name', component: SampleComponent, canActivate: [AuthGuard] },
          { path: 'email-actions', component: EmailActionsComponent, canActivate: [AuthGuard] },
          { path: 'gdpr-compliance', component: GdprComplianceComponent, canActivate: [AuthGuard] },
          { path: 'system-access-token', component: SystemAccessTokenComponent, canActivate: [AuthGuard] },
          /***************************job menu ****************/
          { path: 'job-category', component: JobCategoryComponent, canActivate: [AuthGuard] },
          { path: 'job-category/job-category-manage', component: ManageJobCategoryComponent, canActivate: [AuthGuard] },
          { path: 'job-category/sub-job-category', component: SubJobCategoryComponent, canActivate: [AuthGuard] },
          { path: 'job-category/manage-sub-job-category', component: ManageSubJobCategoryComponent, canActivate: [AuthGuard] },
          { path: 'salary-band', component: SalaryBandComponent,canActivate: [AuthGuard]  },
          { path: 'salary-band/manage-salary', component: ManageSalaryBandComponent,canActivate: [AuthGuard]  },
          { path: 'salaryunit', component: SalaryUnitComponent, canActivate: [AuthGuard] },
          { path: 'salaryunit/add', component: ManageSalaryUnitComponent, canActivate: [AuthGuard] },
          { path: 'salaryunit/add/:id', component: ManageSalaryUnitComponent, canActivate: [AuthGuard] },
          { path: 'experience-type', component: ExperienceTypeComponent, canActivate: [AuthGuard] },
          { path: 'experience-type/manage-experience-type', component: ManageExperienceTypeComponent, canActivate: [AuthGuard] },
          { path: 'tag', component: TagListComponent, canActivate: [AuthGuard] },
          { path: 'tag/add-tag', component: AddTagComponent, canActivate: [AuthGuard] },
          { path: 'tag/add-tag/:id', component: AddTagComponent, canActivate: [AuthGuard] },
          { path: 'functional-experties', component: FunctionalExpertiesListComponent, canActivate: [AuthGuard] },
          { path: 'functional-experties/add-functional-experties', component: FunctionalExpertiesAddComponent, canActivate: [AuthGuard] },
          { path: 'functional-experties/functional-sub-experties', component: FunctionalSubExpertiesListComponent, canActivate: [AuthGuard] },
          { path: 'functional-experties/add-functional-sub-experties', component: FunctionalSubExpertiesAddComponent, canActivate: [AuthGuard] },
          { path: 'job-type', component: JobTypeListComponent, canActivate: [AuthGuard] },
          { path: 'job-type/add-job-type', component: JobTypeAddComponent, canActivate: [AuthGuard] },
          { path: 'job-type/job-sub-type', component: JobSubTypeListComponent, canActivate: [AuthGuard] },
          { path: 'job-type/add-job-sub-type', component: JobSubTypeAddComponent, canActivate: [AuthGuard] },
          { path: 'job-template-create', component: JobTemplateListComponent, canActivate: [AuthGuard] },
          { path: 'job-template-create/manage', component: JobTemplateManageComponent, canActivate: [AuthGuard] },
          { path: 'job-template-create/manage/:id', component: JobTemplateManageComponent, canActivate: [AuthGuard] },
          { path: 'job-workflows', component: JobWorkflowsComponent, canActivate: [AuthGuard] },
           { path: 'job-workflows/manage', component: JobWorkflowsManageComponent, canActivate: [AuthGuard] },
           { path: 'job-automation', component: JobAutomationComponent},

          { path: 'score-type', component: CandidateScoreTypeComponent, canActivate: [AuthGuard] },
          { path: 'score-type/manage-score-type', component: ManageCandidateScoreTypeComponent, canActivate: [AuthGuard] },
          { path: 'degree-type', component: CandidateDegreeTypeComponent, canActivate: [AuthGuard] },
          { path: 'degree-type/manage-degree-type', component: ManageCandidateDegreeTypeComponent, canActivate: [AuthGuard] },

          { path: 'reason-module', component: ReasonModuleComponent , canActivate: [AuthGuard] },
          { path: 'reason-module/reason', component: RemoveReasonComponent , canActivate: [AuthGuard] },
          { path: 'reason-module/manage-reason', component:  ManageRemoveReasonComponent , canActivate: [AuthGuard] },

          /************************job menu end  *********************/

          /********************general settings************ */
          { path: 'brands', component: BrandsComponent, canActivate: [AuthGuard] },
          { path: 'brands/manage-brands', component: ManageBrandsComponent, canActivate: [AuthGuard] },
          { path: 'social-profiles', component: SocialProfilesComponent, canActivate: [AuthGuard] },
          { path: 'social-profiles/add-social-profiles', component: AddSocialProfileComponent, canActivate: [AuthGuard] },
          { path: 'location-types', component: LocationTypesComponent, canActivate: [AuthGuard] },
          { path: 'location-types/location-types-manage', component: LocationTypesOperationComponent, canActivate: [AuthGuard] },
          { path: 'communication-master', component: CommunicationMasterComponent, canActivate: [AuthGuard] },
          { path: 'communication-master/add-communication-master', component: AddCommunicationMasterComponent, canActivate: [AuthGuard] },
          { path: 'communication-master/add-communication-master/:id', component: AddCommunicationMasterComponent, canActivate: [AuthGuard] },
          { path: 'group-master', component: GroupsComponent, canActivate: [AuthGuard] },
          { path: 'group-master/status', component: StatusComponent, canActivate: [AuthGuard] },
          { path: 'group-master/status-manage', component: ManageStatusComponent, canActivate: [AuthGuard] },
          { path: 'group-master/reason', component: ReasonsComponent, canActivate: [AuthGuard] },
          { path: 'group-master/reason-manage', component: ManageReasonsComponent, canActivate: [AuthGuard] }, { path: 'group-master', component: GroupsComponent, canActivate: [AuthGuard] },
          { path: 'document-category', component:DocumentCategoryComponent , canActivate: [AuthGuard] },
          { path: 'document-category/document-name', component: DocumentNameComponent, canActivate: [AuthGuard] },
          { path: 'document-category/document-category-manage', component: ManageDocumentCategoryComponent, canActivate: [AuthGuard] },
          { path: 'document-category/document-name/document-name-manage', component: ManageDocumentNameComponent, canActivate: [AuthGuard] },

          { path: 'group-master/reason-manage', component: ManageReasonsComponent, canActivate: [AuthGuard] },
          { path: 'qualification', component: QualificationComponent, canActivate: [AuthGuard] },
          { path: 'qualification/qualification-manage', component: ManageQualificationComponent, canActivate: [AuthGuard] },

          { path: 'weightage', component: WeightageComponent, canActivate: [AuthGuard] },
          { path: 'weightage/manage-weightage', component: ManageWeightageComponent, canActivate: [AuthGuard] },

          { path: 'skill-tag', component: SkillGroupComponent, canActivate: [AuthGuard]},
          { path: 'skill-tag/manage-skill-tag', component: ManageSkillGroupComponent, canActivate: [AuthGuard]},

          { path: 'notes-category', component: NotesCategoryComponent, canActivate: [AuthGuard] },
          { path: 'notes-category/manage-notes-category', component: ManageNotesCategoryComponent, canActivate: [AuthGuard] },

          { path: 'notes-details', component: NotesDetailsComponent, canActivate: [AuthGuard] },
          { path: 'access-permission', component: AccessPermissionComponent, canActivate: [AuthGuard] },
          { path: 'access-permission/manage-access-permission', component: ManageAccessPermissionComponent, canActivate: [AuthGuard] },

          { path: 'activity-category', component: ActivityCategoryComponent, canActivate: [AuthGuard] },
          { path: 'activity-category/manage-activity-category', component: ManageActivityCategoryComponent, canActivate: [AuthGuard] },

          { path: 'related-to-module', component: RelatedToModuleComponent, canActivate: [AuthGuard] },
          { path: 'related-to-module/add-related-to-module', component: AddRelatedToModuleComponent, canActivate: [AuthGuard] },

          { path: 'states', component: StatesComponent, canActivate: [AuthGuard] },
          { path: 'states/state-manage', component: StatesManageComponent, canActivate: [AuthGuard] },

          /****************************general setting end */

          /**********************tag ********************/
          { path: 'employeetag', component: EmployeeTagComponent, canActivate: [AuthGuard] },
          { path: 'employeetag/employeetag-manage', component: EmployeeTagManageComponent, canActivate: [AuthGuard] },
          { path: 'employeetag/employeetag-manage/:id', component: EmployeeTagManageComponent, canActivate: [AuthGuard] },
          { path: 'candidatetag', component: CandidateTagComponent, canActivate: [AuthGuard] },
          { path: 'candidatetag/candidatetag-manage', component: ManageCandidateTagComponent, canActivate: [AuthGuard] },
          { path: 'candidatetag/candidatetag-manage/:id', component: ManageCandidateTagComponent, canActivate: [AuthGuard] },
          { path: 'client-tag-master', component: ClientTagMasterComponent, canActivate: [AuthGuard]  },
          { path: 'client-tag-master/manage', component: ManageClientTagComponent,canActivate: [AuthGuard]  },
          { path: 'integration-interface-board', component: IntegrationInterfaceBoardComponent, canActivate: [AuthGuard] },
          { path: 'integration-interface-board/seek-integration', component: SeekIntegrationComponent, canActivate: [AuthGuard] },
          { path: 'integration-interface-board/ehr-integration', component: EhrIntegrationComponent, canActivate: [AuthGuard] },
          { path: 'integration-interface-board/daxtra-integration', component: DaxtraIntegrationComponent, canActivate: [AuthGuard] },
          { path: 'integration-interface-board/tenant-feature-integration', component: TenantfeatureIntegration, canActivate: [AuthGuard] },
          { path: 'assessment', component: AssessmentLandingPageComponent, canActivate: [AuthGuard] },
          { path: 'assessment/manage', component: CreateAssessmentComponent, canActivate: [AuthGuard] },
          { path: 'integration-interface-board/broadbean-integration', component: BroadbeanIntegrationComponent, canActivate: [AuthGuard] },
          { path: 'integration-interface-board/burstsms-integration', component: BurstsmsIntegrationComponent, canActivate: [AuthGuard] },
          // { path: 'integration-interface-board/indeed-integration', component: IndeedIntegrationComponent, canActivate: [AuthGuard] },
          // i have changed router ewm-18172 when:07/10/2024 this is wrong router url
          { path: 'integration-interface-board/indeed-integration_All', component: IndeedIntegrationComponent, canActivate: [AuthGuard] },
          { path: 'integration-interface-board/vxt-integration', component: VxtIntegrationComponent, canActivate: [AuthGuard] },

            /*************************tag end *********************/


          /******************************others********************************** */
          { path: 'industry-master', component: IndustryComponent, canActivate: [AuthGuard] },
          { path: 'industry-master/industry-master-manage', component: ManageIndustryComponent, canActivate: [AuthGuard] },
          { path: 'industry-master/industry-master-manage/:id', component: ManageIndustryComponent, canActivate: [AuthGuard] },
          { path: 'industry-master/sub-industry', component: SubIndustryComponent, canActivate: [AuthGuard] },
          { path: 'industry-master/sub-industry/:id', component: SubIndustryComponent, canActivate: [AuthGuard] },
          { path: 'industry-master/manage-sub-industry', component: ManageSubIndustryComponent, canActivate: [AuthGuard] },
          { path: 'industry-master/manage-sub-industry/:id', component: ManageSubIndustryComponent, canActivate: [AuthGuard] },
          { path: 'group-master/reason-manage', component: ManageReasonsComponent, canActivate: [AuthGuard] },

          { path: 'customer-master', component: CustomerMasterComponent, canActivate: [AuthGuard] },
          { path: 'customer-master/customer-master-manage', component: ManageCustomerComponent, canActivate: [AuthGuard] },
          { path: 'customer-master', component: CustomerMasterComponent, canActivate: [AuthGuard] },
          { path: 'job-workflows', component: JobWorkflowsComponent, canActivate: [AuthGuard] },
          { path: 'job-workflows/manage', component: JobWorkflowsManageComponent, canActivate: [AuthGuard] },

          { path: 'skills', component: SkillsComponent,  canActivate: [AuthGuard]},
          { path: 'skills/manage-skill', component: ManageSkillComponent,  canActivate: [AuthGuard]},
          { path: 'skills/bulk-edit', component: BulkEditComponent, canActivate: [AuthGuard]},
          { path: 'skill-group', component: SkillGroupComponent, canActivate: [AuthGuard]},
          { path: 'skill-group/manage-skill-group', component: ManageSkillGroupComponent, canActivate: [AuthGuard]},

          /******************************others End********************************** */
          /***************************Position ***************************** */
          {path:'position',component:PositionmasterComponent,canActivate:[AuthGuard]},
          {path:'position/manage-position',component:ManagePositionmasterComponent,canActivate:[AuthGuard]},

          /***************************Application Form ***************************** */
          { path: 'landing-application-form', component: LandingApplicationFormComponent,  canActivate: [AuthGuard] },
          { path: 'application-form', component: ApplicationFormComponent,  canActivate: [AuthGuard] },
          { path: 'application-form/manage-application-form', component: ManageApplicationFormComponent,  canActivate: [AuthGuard] },
          { path: 'application-form/application-form-configure', component: ConfigureApplicationFormComponent,  canActivate: [AuthGuard] },


          /***************************Position END ***************************** */

          { path: 'checklist', component: ChecklistComponent ,  canActivate: [AuthGuard] },
          { path: 'checklist/manage-checklist', component: ManageChecklistComponent ,  canActivate: [AuthGuard] },
          { path: 'checklist/add-checklist', component: AddChecklistComponent ,  canActivate: [AuthGuard] },
          { path: 'checklist/add-checklist-group', component: AddChecklistGroupComponent ,  canActivate: [AuthGuard] },
          { path: 'checklist/add-checklist/:id', component: AddChecklistComponent ,  canActivate: [AuthGuard] },
          { path: 'checklist/add-checklist-group/:id', component: AddChecklistGroupComponent ,  canActivate: [AuthGuard] },
          { path: 'lead-source', component: LeadSourceMasterComponent,canActivate: [AuthGuard] },
          { path: 'lead-source/manage-lead-source', component: AddLeadSourceMasterComponent,canActivate: [AuthGuard] },
          { path: '**', redirectTo: 'organization-details' },

          /***************************VXT start***************************** */
          { path: 'CandidateCallLog', component: CandidateCallLogComponent ,  canActivate: [AuthGuard] },

          { path: 'CandidateCallLog/CommonAddCallLog-manage', component: CommonAddCallLogComponent, canActivate: [AuthGuard] },
        ]
      },
      {
        path: 'reports',
        children: [
          { path: 'list', component: SampleComponent },
          { path: '**', redirectTo: 'list' }

        ]
      },

      {
        path: 'billing',
        children: [
          { path: 'list', component: SampleComponent },
          { path: '**', redirectTo: 'list' }

        ]
      },
      {
        path: 'clients',
        children: [
          { path: 'client-dashboard', component: ClientDashboardComponent , canActivate: [AuthGuard]},
          { path: 'list', component: ClientLandingComponent , canActivate: [AuthGuard]},
          { path: 'list/client-detail', component: ClientDetailComponent, canActivate: [AuthGuard]},
          { path: 'client-org', component: ClientOrgComponent,canActivate: [AuthGuard] },
          { path: 'masters', component: SampleComponent},
          { path: 'report', component: SampleComponent},
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: '**', redirectTo: 'client-dashboard' }

        ]
      },

      {
        path: 'system-settings',
        children: [
          { path: 'address-format', component: AddressFormatComponent, canActivate: [AuthGuard] },
          { path: 'internationalization', component: InternationalizationComponent, canActivate: [AuthGuard] },
          { path: 'lookandfeel', component: LookAndFeelComponent, canActivate: [AuthGuard] },
          { path: 'mail-settings', component: MailSettingsComponent, canActivate: [AuthGuard] },
          { path: 'phone-info', component: PhoneInfoComponent, canActivate: [AuthGuard] },
          { path: 'system-audit-log', component: SystemAuditLogNewComponent, canActivate: [AuthGuard] },
          { path: 'system-audit-log/:id', component: SystemAuditLogNewComponent, canActivate: [AuthGuard] },
          { path: 'general-setting', component: GeneralSettingComponent, canActivate: [AuthGuard] },
          { path: 'email-integration', component: EmailIntegrationComponent, canActivate: [AuthGuard] },
          { path: 'datatable-sample', component: DatatableSampleComponent, canActivate: [AuthGuard] },
          { path: 'access-denied', component: LinkDeniedComponent },
          { path: 'candidate-source', component: CandidateSourceComponent, canActivate: [AuthGuard] },
          { path: 'manage-candidate-source', component: ManageCandidateSourceComponent},
          { path: 'child-source-list', component: ChildSourceListComponent},
          { path: '**', redirectTo: 'general-setting' }
        ]
      },
      {
        path: 'Master',
        children: [

          //{ path: 'Master/experience-type/:id', component: ExperienceTypeComponent },

          { path: '**', redirectTo: 'tag' },
        ]
    //   },

    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EWMCoreRoutingModule { }
