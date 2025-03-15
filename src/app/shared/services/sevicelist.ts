/*
@(C): Entire Software
@Type: File, <ts>
@Name: servicelist.service.ts
@Who: Renu
@When: 17-11-2020
@Why: ROST-316
@What: for common url functionality service file reading the file form config.json
@modified on: 08/05/2021
 */
import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class ServiceListClass {

  public configurationobject;
  public userProfileList: string;
  public userProfileUpdate: string;
  public userProfileImageUpload: string;
  public contactList: string;
  public countryList: string;
  public updateContact: string;
  public updateDarkMode: string;
  public getDarkMode: string;
  public updateUserPwd: string;
  public verifyPwd: string;
  public emailSettingList: string;
  public emailSettingUpdate: string;
  public mailSettingList: string;
  public mailSettingUpdate: string;
  public updateSiteDomain: string;
  public userGrpAdd: string;
  public userGrpExists: string;
  public userGrpUpdate: string;
  public userGrpDelete: string;
  public userGrpList: string;
  public generalSettingList: string;
  public generalSettingUpdate: string
  public getLanguageList: string;
  public getTimeZoneList: string;
  public internalizationUpdate: string;
  public internalizationList: string
  public productList: string;
  public emailaAvailableCheck: string;
  public createAccountUser: string;
  public supportPlanList: string;
  public defaultLoginUser: string;
  public regionList: string;
  public siteLogoupload: string;
  public resendEmail: string;
  public createTenant: string;
  public emaillinkISvalid: string;
  public loginUserAuth: string;
  public logoutUserAuth: string;
  public userPreferenceList: string;
  public updateuserPreference: string;
  public getSystemLookFeel: string;
  public updateSystemLookFeel: string;
  public getSystemDatetimeFormats: string;
  public organizationList: string;
  public updateOrganization: string;
  public addOrganization: string;
  public administratorsList: string;
  public checkDuplicityKey: string;
  public searchAdminList: string;
  public addAdministratorsUser: string;
  public deleteAdministrators: string;
  public siteDomainList: string;
  public checkDomainAvailable: string;
  public countryByName: string;
  public siteName: string;
  public emailTempsAdd: string;
  public emailTemplateExists: string;
  public emailTempsList: string;
  public emailTempsUpdate: string;
  public emailTempsDelete: string;
  public emailTempByID: string;
  public updateUserEmailIntegration: string;
  public getUserEmailIntegration: string;
  public getEmailIntegration: string;
  public userRoleList: string;
  public userRoleCreate: string;
  public userRoleDelete: string;
  public userRoleUpdate: string;
  public userRoleExists: string;
  public userSmsAdd: string;
  public userSmsUpdate: string;
  public userSmsDelete: string;
  public userSmsList: string;
  public userSmsExists: string;
  public uninvitedUser: string;
  public checkEmailcredential: string;
  public planType: string;
  public productListNew: string;
  public getMfaQrCode: string;
  public authenticatPin: string;
  public alternateEmail: string;
  public alternateEmailOtpvalidate: string;
  public getSecrurityquestion: string;
  public createUserMfa: string;
  public disableUserMfa: string;
  public tenantuserTypeColumnUniqueCheck: string;
  public tenantUserTypeList: string;
  public tenantUserTypeListById: string;
  public tenantUserTypeUpdate: string;
  public disbaledMFAUser: string;
  imageUploadByUrl: string;
  imageUploadByBase64: string;
  public getBuyNowStatus: string;
  public getAddressFormat: string;
  public setAddressFormat: string;
  public userSystemLogList: string;
  public userSystemLogListDownload: string;
  public addUserInvitation: string;
  public userInvitationList: string;
  public userInvitationListv2: string;
  public userGroupmemberAll: string;
  public userInviteList: string;
  public userInvitationByID: string;
  public userInvitationRoleList: string;
  public userInvitationUserTypeList: string;
  public userInvitationAccessLevelList: string;
  public invitedUser: string;
  public validateinvitedUser: string;
  public externalLogin: string;
  public forgotPassword: string;
  public resetPassword: string;
  public verifyResetLink: string;
  public getDomainAvailable: string;
  public loginUserCheck: string;
  public refreshTokenlogin: string;
  private http: HttpClient;
  public loginDomain: string;
  public encodeUri: string;
  public decodeUri: string;
  public passwordPattern: string;
  public getIpAddress: string;
  public accessLevelList: string;
  public accessLevelListById: string;
  public getIPValidation: string;
  public getModuleList: string;
  public getPlaceHolderType: string;
  public getPlaceHolderByType: string;
  public getPlaceHolderDetails: string;
  public rolePermissionById: string;
  public getUserDirectory: string;
  public verifyForgotEmail: string;
  public verifyuserName: string;
  public sendVerificationCode: string;
  public validateVerificationCode: string;
  public getOrganizationList: string;
  public orgToken: string;
  public getUninvitedUsers: string;
  public uninvitedUserByID: string;
  public setUninvitedUserPassword: string;
  public updateUninvitedUserRequest: string;

  public locationTypeByID: string;
  public locationTypeAllList: string;
  public deleteLocationType: string;
  public addLocationType: string;
  public updateLocationType: string;
  public locationTypeExists: string;

  public groupByID: string;
  public groupAllList: string;
  public statusCodeExists: string;
  public statusByID: string;
  public statusAllList: string;
  public deleteStatus: string;
  public addStatus: string;
  public updateStatus: string;
  public socialProfileListMaster: string;
  public duplicaySocialProfileName: string;
  public socialProfileById: string;
  public socialProfileDeleteMaster: string;
  public socialProfileEditMaster: string;
  public socialProfileAddMaster: string;
  public getAllPeopleMasterUserContactType: string;
  public addPeopleMasterUserContactType: string;
  public deletePeople_MasterUserContactType: string;
  public getPeople_MasterContactByID: string;
  public updatePeople_MasterContactType: string;
  public getAllCategoryForPeopleMaster: string;
  public duplicayContactType: string;

  public menuList: string;
  public createIndustry: string;
  public getIndustryAll: string;
  public getIndustryById: string;
  public updateIndustryById: string;
  public deleteIndustryById: string;
  public createSubIndustry: string;
  public getSubIndustryAll: string;
  public getSubIndustryById: string;
  public updateSubIndustryById: string;
  public deleteSubIndustryById: string;
  public checkIndustryIsExist: string;
  public checkSubIndustryIsExist: string;
  public checkCodeExist;
  public statusDescExists;
  public creategrupstatus: string;
  public reasonList: string;
  public createReason: string;
  public getReasonById: string;
  public updateReasonById: string;
  public deleteReasonById: string;
  public getAllstatus: string;
  saveRolePermission: string;
  public tagList: string;
  public deleteTagList: string;
  public addTagList: string;
  public tagListById: string;
  public updateTagList: string;
  public duplicayTagName: string;
  public getRegisteredUserList: string;

  public experienceByID: string;
  public experienceAllList: string;
  public deleteexperience: string;
  public addexperience: string;
  public updateexperience: string;
  public experienceExists: string;
  getAllSalary: string;
  getSalaryById: string;
  addSalaryUnit: string;
  UpdateSalaryUnit: string;
  deleteSalaryUnit: string;
  checkDuplicityofSalaryUnit: string;
  public getJobCommitmentList: string;
  public getJobCommitmentById: string;
  public getJobCommitmentUpdate: string;
  public getJobCommitmentCreate: string;
  public getJobCommitmentDelete: string;
  public getJobCommitmentIsExist: string;
  public getInviteTeammate: string;
  public createInviteTeammate: string;
  public getPeopleListByCategory: string;
  public createPeople: string;
  public checkInvitationEmailExist: string;
  UpdateUserInvitation: string;
  revokUserAccess: string;

  public signUp: string;
  public getRollAccess: string;
  public createpassword: string;
  public getUninvitedNotification: string;
  public getAccessRole: string;
  public currencyList: string;
  public salaryBandList: string;
  public salaryBandById: string;
  public CreateSalaryBand: string;
  public UpdateSalaryBand: string;
  public DeleteSalaryBand: string;
  public salaryBandDuplicayCheck: string;
  public getAllFunctionalExpertise: string;
  public deleteFunctionalExpertiseList: string;
  public addfunctionalExpertise: string;
  public FunctionalExpertiseDuplicay: string;
  public functionalExpertiseById: string;
  public updatefunctionalExpertise: string;
  public getAllFunctionalSubExpertise: string;
  public deleteFunctionalSubExpertiseList: string;
  public addfunctionalSubExpertise: string;
  public FunctionalSubExpertiseDuplicay: string;
  public getfunctionalSubExpertiseById: string;
  public updatefunctionalSubExpertise: string;
  public getBrandAll: string;
  public getBrandById: string;
  public createBrand: string;
  public updateBrandById: string;
  public deleteBrandById: string;
  public checkBrandIsExist: string;
  public createCustomer: string;
  public getCustomerAll: string;
  public getCustomerById: string;
  public updateCustomerById: string;
  public deleteCustomerById: string;
  public checkCustomerIsExist: string;
  public getJobCategoryAll: string;
  public getJobCategoryById: string;
  public createJobCategory: string;
  public updateJobCategoryById: string;
  public deleteJobCategoryById: string;
  public checkJobCategoryIsExist: string;
  public getSubJobCategoryAll: string;
  public getSubJobCategoryById: string;
  public createSubJobCategory: string;
  public updateSubJobCategoryById: string;
  public deleteSubJobCategoryById: string;
  public checkSubJobCategoryIsExist: string;
  public getJobTypeList: string;
  public getJobTypeByID: string;
  public getJobTypeCreate: string;
  public getJobTypeUpdate: string;
  public getdeleteJobType: string;
  public getJobTypeIsExist: string;
  //public ProductPlanByID: string;
  public getAllJobSubTypeList: string;
  public getdeleteJobsubType: string;
  public getJobSubTypeCreate: string;
  public getJobSubTypeIsExist: string;
  public getJobSubTypeByID: string;
  public getJobSubTypeUpdate: string;
  public createQuickCompany: string;
  public updateQuickCompany: string;
  public getParentCompanyAll: string;
  public getStateList: string;
  public stateList: string;
  public sourceLabelData: string;
  public getAllWorkFlowList: string;
  public getBrandAllList: string;
  public experienceAllListData: string;
  public getCompanyAllDetails: string;
  public createQuickAddJob: string;
  public getAllState: string;
  public jobWorkFlowList: string;
  public jobWorkFlowById: string;
  public jobWorkFlowCreate: string;
  public jobWorkFlowUpdate: string;
  public jobWorkFlowDelete: string;
  public jobWorkFlowStageIsExists: string;
  public jobWorkFlowIsExists: string;
  public countryById: string;
  public jobWorkFlowLatest: string;
  public getAllNextStages: string;
  public candidateMoveAction: string;
  public getCandidatemappedtojobcardAll: string;
  public createUseractivity: string;
  public updateFavouriteMenu: string;
  public getFavouriteMenu: string;
  public companyNameExists: string;
  public getJobTitleIsExist: string;
  public getJobBoard: string;
  public getJobBoardCategory: string;
  public getJobboardCategoryItems: string;
  public creatJobBoardConfigue: string;
  public deleteJobBoardConfigueList: string;
  public getJobBoardConfigurationList: string;
  public clientTagList: string;
  public clientTagById: string;
  public clientTagCreate: string;
  public clientTagUpdate: string;
  public clientTagDelete: string;
  public clientTagDuplicate: string;
  public getEmployeeTagAll: string;
  public getEmployeeTagById: string;
  public createEmployeetag: string;
  public updateEmployeeTag: string;
  public deleteEmployeeTag: string;
  public checkEmployeetagIsexist: string;
  public checkemployeetagkeywordisexist: string;
  public jobTemplateList: string;
  public deleteJobTemplateList: string;
  public addJobTemplateList: string;
  public JobTemplateListById: string;
  public updateJobTemplateList: string;
  public jobTemplateListByFilter: string;
  public duplicayJobTemplateNameAndTitle: string;
  public dashboardWidgetList: string;
  public dashboardConfigure: string;
  public getCandidateTagAll: string;
  public getCandidateTagById: string;
  public createCandidatetag: string;
  public updateCandidateTag: string;
  public deleteCandidateTag: string;
  public checkCandidatetagIsexist: string;
  public jobLandingList: string;
  public getJobLogHistory: string;
  public getJobsCount: string;
  public getJobsCountByWorkFlowId: string;
  public getfilterConfig: string;
  public setfilterConfig: string;
  public getManageNameList: string;
  public createManageName: string;
  public getmanageNameValueListAdmin: string;
  public getManageNameAdminById: string;
  public jobLandingWorkflow: string;
  public getJobWorkFlowList: string;
  public updateQuickLink: string;
  public scoreTypeList: string;
  public relationshipList: string;
  public genderList: string;
  public scoreTypeByID: string;
  public scoreTypeCreate: string;
  public scoreTypeUpdate: string;
  public scoreTypeDelete: string;
  public scoreTypeDuplicate: string;
  public getCandidateList: string;
  public generalInformationList: string;
  public updateGeneralInformation: string;
  public getCandidateResumeById: string;
  public uploadCandidateResume: string;
  public getCandidateSummary: string;
  public updateCandidateImage: string;
  public getCandidateVersionHistory: string;
  public getCandidateNoteAll: string;
  public createCandidateNote: string;
  public updateCandidateNote: string;
  public deleteCandidateNote: string;
  public deleteCandidateNoteCandidateId: string;
  public getCandidateAdressById: string;
  public createCandidateAdress: string;
  public getCandidateAdressAll: string;
  public updateCandidateAdress: string;
  public deleteCandidateAdress: string;
  public getAllSkills: string;
  public addSkills: string;
  public updateSkills: string;
  public candidateExperienceAllList: string;
  public candidateExperienceById: string;
  public candidateExperienceCreate: string;
  public candidateExperienceUpdate: string;
  public candidateExperienceDelete: string;
  public getCandidateEducationAll: string;
  public createCandidateEducation: string;
  public updateCandidateEducation: string;
  public deleteCandidateEducation: string;
  public getCandidateEducationById: string;
  public checkCandidateEducationExist: string;
  public candidateMappingTagList: string;
  public CandidateMappingTagList: string;
  public getEmergencyContactList: string;
  public getEmergencyContactById: string;
  public createEmergencyContact: string;
  public EmergencyContactUpdate: string;
  public EmergencyContactDelete: string;
  public getRealtionShipList: string;
  public checkAdressTypeIsExists: string;
  public candidateFolderAllList: string;
  public candidateFolderById: string;
  public candidateFolderCreate: string;
  public candidateFolderUpdate: string;
  public candidateFolderDelete: string;
  public candidateFilterFolderList: string;
  /* API path of integations board*/
  public get_integration_biling_type: string;
  public get_integration_Category: string;
  public get_integration_status: string;
  public get_integration_type: string;
  public get_integration_tag: string;
  public get_integration_Board: string;
  public canidateMappedFoldersDetails: string;
  public saveJobActionStatus: string;
  public getCandidateDependentAll: string;
  public createCandidateDependent: string;
  public updateCandidateDependent: string;
  public deleteCandidateDependent: string;
  public getCandidateDependentById: string;
  public checkCandidateDependentExist: string;
  public getCandidateMapToFolder: string;
  public mapCandidateToFolderUpdate: string;
  public degreeTypeList: string;
  public qualificationList: string;
  public degreeTypeById: string;
  public degreeTypeCreate: string;
  public degreeTypeUpdate: string;
  public degreeTypeDelete: string;
  public degreeTypeDuplicate: string;
  public getAllNationality: string;
  public AllAdditionalInfoData: string;
  public UpdateAdditionalInfoData: string;
  public jobworkFlowBypipeId: string;
  public getAllLanguage: string;
  public CreateAdditionalInfoData: string;
  public deleteAdditionalInfoData: string
  public getDocumentcategory: string;
  public createDocumentcategory: string;
  public updateDocumentcategory: string;
  public deleteDocumentcategory: string;
  public getDocumentcategorybyId: string;
  public checkduplicityDocumentcategory: string;
  public qualificationByID: string;
  public qualificationAllList: string;
  public deleteQualification: string;
  public addQualification: string;
  public updateQualification: string;
  public qualificationExists: string;
  public getQualification: string;
  public getallStatusDetails: string;
  public getDocumentName: string;
  public createDocumentName: string;
  public updateDocumentName: string;
  public deleteDocumentName: string;
  public getDocumentNamebyId: string;
  public checkduplicityDocumentName: string;

  public getAllUsertYpe: string;
  public getManageAll: string;
  public candidateInfoDelete: string;
  public getAllSkillsList: string;
  public getSkillById: string;
  public createSkill: string;
  public updateSkillById: string;
  public deleteSkillById: string;
  public checkSkillName: string;
  public getAllSkillsListWithFilter: string;
  public getSkillsCount: string;
  public getSkillsByTagId: string;
  public updateBulkEditSkill: string;
  public getAllSkillGroupList: string;
  public getSkillGroupById: string;
  public createSkillGroup: string;
  public updateSkillGroupById: string;
  public deleteSkillGroupById: string;
  public checkSkillGroupName: string;
  public getAllDocument: string;
  public getDocumentByHeierarchy: string;
  public getDocumentById: string;
  public createFolder: string;
  public createDocument: string;
  public uploadCandidateDocument: string;
  public checkduplicityCandidateDocument: string;
  public emailConfigure: string;
  public getSkillMappingListById: string;
  public createCandidate: string;
  public deletedocumentdata: string;
  public downloadFolder: string;
  public RenameFolder: string;
  public documentVersion: string;
  public createVersionDocument: string;

  public getDocumentAccessMode: string;
  public createGrantDocumentAccess: string;
  public getDocumentHasAccessById: string;
  public removeDocumentAccess: string;
  public getSearchUserwithGroup: string;

  public searchUserWithGroup: string;
  public documentShare: string;
  public getdocumentShareById: string;
  public getUserIsEmailConnected: string;
  public getDocumentCount: string;
  public checkCandidateskillsExists: string;
  public emailInbox: string;
  public emailSent: string;
  public createShareableLink: string;
  public emailDisconnection: string;

  public sendDocumentOtp: string;
  public validateDocumentOtp: string;
  public getRemoveReason: string;
  public updateRemoveReason: string;
  public createRemoveReason: string;
  public deleteRemoveReason: string;
  public getRemoveReasonById: string;
  public checkDuplicityofremoveReason: string;

  public getReasonGroup: string;
  public getReasonGroupModule: string;
  public updateReasonGroup: string;
  public createReasonGroup: string;
  public deleteReasonGroup: string;
  public getReasonGroupById: string;
  public checkDuplicityofReasonGroup: string;


  public emailInboxDetails: string;
  public createDraftMail: string;
  public getDraftMail: string;
  public updateDraftMailById: string;
  public deleteDraftMailById: string;
  public getshareablesharedLinkList: string;
  public revokeAccessOfShareablelink: string;
  public getAllDocumentForExternalLink: string;
  public downloadDocumentForExternalLink: string;

  public getMailCount: string;
  public emailDownloadAttachement: string;
  public markAsImportant: string;
  public getDocumentDetailsForExternal: string;
  public markAsisread: string;
  public markAsunread: string;
  public IsEmailConnected: string;
  public IsEmailDisConnected: string;
  public mailSend: string;
  public jobWithoutWorkflow: string;
  public jobWithoutWorkflowfilter: string;
  public emailDraftDetail: string;
  public quickJobListByJobId: string;

  public candidateNotMappedToJobList: string;
  public candidateNotMappedToJobCreate: string;
  public removeCandidate: string;
  public candidateMappedJobHeader: string;
  public getAllCandidateJobMapping: string;
  public updateJobMappingTagList: string;
  public gettimelineData: string;
  public emailfavouriteList: string;
  public candidateMappedJobHeaderCount: string;
  public candidateMappedJobHeaderTags: string;
  public candidateInbox: string;
  public candidateMailCount: string;

  public getJobNotMappedToCandidateAll: string;
  public JobMappedToCandidate: string;
  public getJobMappedToCandidateAll: string;
  public getJobMappedToCandidateAllForSearch: string;
  public getAssignJobCount: string;
  public unassignJobFromCandidate: string;
  public getLocationCount: string;


  public getWeightageList: string;
  public getWeightageById: string;
  public createWeightage: string;
  public updateWeightage: string;
  public deleteWeightage: string;
  public checkDuplicityWeightage: string;

  public getAllProximity: string;

  public clientLandingList;
  public dashboardDeatils: string;
  public dashboardStateClientDetails: string;
  public dashboardParentClientDetails: string;
  public dashboardStatusClientDetails: string;
  public dashboardClientDetails: string;
  public dashboardClientCount: string;
  public getLocationMappedToClientAll: string;
  public getLocationMappedToClientById: string;
  public createClientLocation: string;
  public updateClientLocation: string;
  public deleteClientLocation: string;
  public createGrantClientAccess: string;
  public getClientAccessMode: string;
  public getClientAccessModeById: string;
  public getCandidateDesignationList;
  public getEmployeeList: string;
  public getAllEmployee: string;
  public statusListLevel: string;
  public getCanDesignationList: string;
  public getEmployeeDesignation: string;

  public addSeekIntegration: string;
  public updateSeekIntegration: string;
  public seekIntegrationDisconnect: string;
  public integrationCheckStatus: string;
  public getIntegrationById: string;
  public getIntegrationRegistrationByCode: string;
  public getIntegrationAll: string;
  public getSeekAdvertiseId: string;

  public getAllSkillTagList: string;
  public getSkillTagById: string;
  public createSkillTag: string;
  public updateSkillTagById: string;
  public deleteSkillTagById: string;
  public checkSkillTagName: string;
  public getEmailIntegrationNew: string;

  public getSeekLocation: string;
  public getSeekLocationGeo: string;
  public getSeekJobCategorySugestion: string;
  public getSeekJobCategoryWithchild: string;
  public getAllSkillsTagList: string;
  public updateQuickAddJob: string;
  public createCandidateSkills: string;
  public updateCandidateSkills: string;
  public deleteCandidateSkillsById: string;
  public getCandidateSkillsAll: string;
  public getCandidateSkillsById: string;
  public clientSummaryHeader: string;
  getAllDescriptionOfClient: string;
  createDescriptionOfClient: string;
  updateDescriptionOfClient: string;
  getbyIdDescriptionOfClient: string;
  deleteDescriptionOfClient: string;

  public clientDetailsById: string;
  public clientMappingTagList: string;
  public getClientListById: string;
  public updateClientMappingTagList: string;
  public updateOwner: string;
  public updateClientStatusList: string;
  public getSubIndustryAllWithoutID: string;
  public updateClientDetailsById: string;
  public businessRegistrationById: string;
  public updateBusinessRegistration: string;
  getAllEmailOfClient: string;
  createEmailOfClient: string;
  updateEmailOfClient: string;
  deleteEmailOfClient: string;

  public getClientLocationMain: string;
  public getClientLocationById: string;
  public getClientAllList: string;
  public getAllContactRelatedType: string;
  public createQuickContact: string;
  public getContactRelatedClientall: string;

  public getAllPhoneOfClient: string;
  public updatePhoneOfClient: string;
  public deletePhoneOfClient: string;
  public createPhoneOfClient: string;
  downloadClientData: string;
  public getContactListById: string;
  public deLinkClientContact: string;
  public getContactCount: string;

  public daxtraIntegrationDisconnect: string;
  public daxtraIntegrationConnect: string;
  public getJobListByClientId: string;
  public getJobCount: string;
  public getClientContactList: string;

  public notesCategoryList: string;
  public notesCategoryCreate: string;
  public notesCategoryEdit: string;
  public notesCategoryDelete: string;
  public notesCategoryById: string;
  public notesCategoryDuplicayCheck: string;
  public parseResume: string;
  public getResumeByCandidateId: string;
  public vxtcallStatus: string;

  public getSeekAdSelection: string;
  public getUpdatedSeekAdSelection: string;
  public getSeekBranding: string;
  public getPostingseekDetails: string;
  public createSeekJobPosting: string;
  public updateSeekJobPosting: string;
  public clientNoteCount: string;
  public clientNoteList: string;
  public clientNoteCreate: string;
  public clientNoteUpdate: string;
  public clientNoteDelete: string;
  public clientNoteById: string;
  public clientNoteGrantAccess: string;
  public organisationStructure: string;
  public downloadorgStructure: string;
  public enableXeopleSMSIntegration: string;
  public disableXeopleSMSIntegration: string;
  public clientTeamDetails: string;
  public clientTeamUpdate: string;
  public clientTeamDeleteById: string;
  public updateAccess: string;
  public getSeekCurrencies:string;
  public getSeekAdselectionV2:string;
  public createSeekJobPostingPreview:string;
  public getSeekPayType:string;
  public getSeekWorkType:string;

  public getSeekAdselectionUpdateV2:string;


  public getPosition_All: string;
  checkPositionDuplicacy: string;
  getPositionCount: string;
  deletePosition: string;
  getPosition_ByIndustry: string;
  getPosition_byId: string;
  bulkUpdatePosition: string;
  updatePosition: string;
  createPosition: string;

  public sendSmsJobForCan: string;
  public getAccessPermission: string;
  public postAccessPermission: string;

  public clientNoteTotal: string;
  candidateNotesBycandidateId: string;
  candidateFilterNoteByYear: string;
  candidateNoteCount: string;
  candidateNoteDelete: string;
  candidateNoteById: string;


  jobFilterNoteByYear: string;
  getNotesCountBymonth: string;
  jobnotesByYearfilter: string;
  createJobNotes: string;
  updateJobNotes: string;
  deleteJobNotesById: string;
  getJobNotesById: string;
  getJobNotesByJobId: string;
  JobNotesCount: string;
  public deleteCanEmpById: string;
  public clientUserAccess: string;
  public createAddTeam: string;
  public getClientTeamById: string;
  public getTeamCount: string;
  public getDuplicateEmployeeTeam: string;




  public getAllJobForActivity: string;
  public getAllCandidateForActivity: string;
  public getAllCandidateForActivity_v2: string;
  public getAllEmployeeForActivity: string;
  public getAllEmployeeForActivity_v2: string;
  public getAllClientForActivity: string;
  public getAllActivityCategory: string;
  public myActivityCreate: string;
  public getManageAccessMode: string;

  public activityCategoryList: string;
  public activityCategoryCreate: string;
  public activityCategoryEdit: string;
  public activityCategoryDelete: string;
  public activityCategoryById: string;
  public activityCategoryDuplicayCheck: string;
  public activitySchedular: string;

  candidateActivityBycandidateId: string;
  candidateFilterActivityByYear: string;
  candidateActivityById: string;
  updateActivityMaster: string;
  public deleteActivityId: string;
  recentActivityCount: string;
  updateActivityStatus: string;
  public myActivityList: string;
  public getMyActivityById: string;
  public updateMyActivityById: string;
  public deleteMyActivityById: string;
  public getContactByClientId: string;

  public getPostedJobdetailsByid: string;
  public getEmailForwarding: string;
  public updateEmailForwarding: string;


  public getOtherIntegrationAll: string;
  public zoomHistoryList: string;
  public zoomHistoryDetail: string;
  public zoomConfiguration: string;
  public otherIntegrationCheckStatus: string;
  public zoomConfigurationDisabled: string;

  public getGDPRCompliance: string;
  public updateGDPRCompliance: string;

  public relateToModuleList: string;
  public relateToModuleCreate: string;
  public relateToModuleById: string;
  public relateToModuleUpdate: string;
  public relateToModuleCheckDuplicacy: string;
  public relateToModuleDelete: string;
  public getGDPRConsentByid: string;
  public updateGDPRConsent: string;
  public candidatePhoneNo: string;

  public getGDPREmailTemp: string;
  public updateGDPREmailTemp: string
  public getGDPRPageTemp: string;
  public updateGDPRPageTemp: string
  public sendgdprrequest: string;
  public getAssessmentList: string;
  public getSeekIntegrationById: string;
  public checkAssessmentDuplicacy: string;
  public addAssementStep: string;
  public addAssementGuidLines: string;
  public addAssementQues: string;
  public getAssessmentRelatedTo: string;
  public getSeekApplicationMethod: string;
  public getAssessmentById: string;
  public getAssessmentVersionById: string;

  public getFolderCount: string;

  public getCandidateSocialProfile: string;
  public deleteAssessment: string;
  public getCandidateStatus: string;
  public updateCandidateStatus: string;
  public getWorkFlowImgByColorCode: string;
  public zoomConfigurationConnect: string;
  public zoomConfigurationDisconnect: string;
  public getJobdetailsByid: string;
  public getOrganizationById: string;

  public removeReasonCandidate: string;
  public getWorkSchedule: string;
  public updateWorkSchedule: string;



  public createSystemAccessToken: string;
  public SystemAccessTokenList: string;
  public revokeSystemAccessToken: string;

  public msTeamConfigurationConnect: string;
  public msTeamConfigurationDisconnect: string;
  public googleMeetConfigurationConnect: string;
  public googleMeetConfigurationDisconnect: string;
  public getCategoryListByType: string;
  public getStep4List: string;

  public getSmsById: string;
  public getAvaiabletimeslots: string;
  public getActivityAvaiableTimeslots: string;
  public msTeamConfiguration: string;
  public getCareerPageAll: string;
  public createCareerPage: string;
  public checkCareerPageDuplicacy: string;
  public updateCareerPage: string;
  public getByIdCareerPage: string;
  public googleMeetConfiguration: string;


  public deleteAssessmentStep4: string;
  public getQuestionById: string;
  public getStep1ById: string;
  public getStep3ById: string;
  public deleteCareerPage: string;
  public addReviewSection: string;
  public creatMeetingUrl: string;
  public updateSectionName: string;
  public getStep2List: string;
  public createNetworkPage: string;
  public getStep2deleteQues: string;
  public getUserRoleById: string;
  public getCoverLetterAll: string;
  public getCoverLetterDetailsById: string;
  public createCoverLetter: string;
  public deleteCoverLetter: string;
  public renameCoverLetter: string;
  public checkDuplicateCoverLetter: string;
  public getActiveJobAll: string;
  public getCoverPageVersionHistory: string;
  public getApplicationFormAll: string;
  public updateIsDefault: string;
  public createWelcomePage: string;
  public getWelcomeFormData: string;
  public applicationDuplicacy: string;
  public createApplicationForm: string;
  public getByIdApplicationForm: string;
  public createPersonalInfoPage: string;
  public fetchPersonalInfoById: string;
  public createKnockoutQuestion: string
  public getKnockoutQuestionById: string
  public getKnockoutQuestionAll: string
  public deleteKnockoutQuestionById: string
  public updateKnockoutQuestion: string
  public getFormDocumnetPage: string;
  public checkKnockoutQuestion: string
  public createDocumentPage: string;
  public applicationConfigStepById: string;
  public getAppformConfigById: string;
  public createApplicationformConfiguration: string;
  public cloneApplicationForm: string;
  public getUserGroupListById: string;
  public setDefaultlocation: string;
  public getAssessmentAllWithoutFilter: string;
  public getAccessPermissionType: string;
  public checkDefaultLocation: string;
  public checkIsDefaultLocation: string;
  public updateCandiateRank: string;
  public getapplicationFormMappingToJob: string;
  public updateapplicationFormMappingToJob: string;
  public jobpublisheddetails: string;
  public externalUser: string;
  public getCandidateJobFilterCount: string;
  public checkCandidateExists: string;
  public saveApplicationPreview: string;
  public getCandidateMappedtoallJobTimelines: string;
  public candidatePersonalInfo: string;
  public candidateKnockoutInfo: string;
  public candidateDocumentInfo: string;
  public sendOtp: string;
  public candidateDetails: string;
  public getCandidateResumeLatestById: string;
  public jobworkFlowChildById: string;
  public logoutUrl: string;
  public sharejobapplicationurl: string;
  public createJobCallLog: string;
  public getAssessmentDeleteDraft: string;
  deleteSavedConfig: string;

  public getCheckListById: string;
  public createChecklist: string;
  public deleteChecklist: string;
  public updateChecklist: string;
  public checkUniqueChecklist: string;
  public checkUniqueGroupList: string;
  public checkUniqueQuestions: string;
  public getCheckListGroupById: string;
  public createChecklistGroup: string;
  public deleteChecklistGroup: string;
  public updateChecklistGroup: string;
  public getCheckListAll: string;
  public TenantUserType: string;
  public StateAll: string;
  public deleteState: string;
  public state: string;
  public getStateByID: string;
  public states: string;
  public checkDuplicacyofState: string;
  public groupCheckListAll: string;
  public getCandidateEmailAndPhone: string;

  public getApi: string;
  public postApi: string;
  public errorLogStatus: string;

  public getActiveJobAllWithJobId: string;
  public getJobsummaryHeaderSourcepichart: string;
  public broadBeanIntegrationDisconnect: string;
  public addbroadBeanIntegration: string;
  public getbroadbeantenantdetails: string;

  public burstSmsIntegrationDisconnect: string;
  public addBurstSmsIntegration: string;
  public getBurstSmstenantdetails: string;
  public disablebroadBeanIntegration: string;
  public enabelbroadBeanIntegration: string;
  public getbroadbeanuserdetails: string;

  public weighageUserType: string;
  public weighageExperience: string;
  public smsTempsList: string;
  public jobHeaderDetails: string;
  public sendSMS: string;
  public getSMSall: string;
  public getSMSBalance: string;
  public JobMappedCandidate: string;

  public getCandidateMappedPhone: string;
  public bulkEmail: string;
  public getThankYouInfo: string;
  public createThankYouInfo: string;
  public sectionUpdate: string;
  public checkSection: string;
  public getAppChartCandidate: string;
  public getDocumentnameAllbyUsertype: string;
  public getCandidatemappedBulkemail: string;
  public candidateJobAction: string;
  public JobNotesCandidate: string;
  public getChecklistDetails: string;
  public updateChecklistInfo: string;
  public downloadCheckList: string;
  public mapChecklistDocument: string;
  public getDownloadApplicationForm: string;
  public getCandidateMappedtoJobTimelines: string;
  public getImportantsLinksAll: string;
  public createUpdateImportantsLinksAll: string;
  public checkEmergencycontactsRelationship: string;
  public updateMapChecklistWorkflowstage: string;
  public configureRule: string;
  public getConfigureRule: string;
  public getConfigureRuleTemplate: string;
  public getApplicationFormByJobId: string;

  public getcandidateall: string;
  public getDefaultWorkflow: string;
  public workflowapplicationstages: string;

  public getJobPostingDetailByID: string;
  public shareAssessment: string;
  public getShareAssessment: string;
  public broadbeanAddUser: string;
  public getBroadbeanUsersAll: string;
  public getPlanTypeAll: string;
  public deleteBroadbeanUsers: string;
  public isBroadBeanUserExist: string;
  public CandidateMappedJobAsignJob: string;
  public CandidateMappedJobAsignJobV2:string;
  public getXfactorPoolList: string;
  public getXfactorOutputField: string;
  public getXfactorIOList: string;
  public getXfactorFilterList: string;
  public getXfactorFilterById: string;
  public saveFilterConfig: string;
  public CandidateAlljobTimeLine: string;
  public broadBeanJobPosting: string;
  public jobConfigurePermission: string;
  public createJobConfigureField: string;
  public xeopleSearchJob: string;
  public checkFilterUnique: string;
  public getFilterSearchAll: string;
  public deleteFilterSearch: string;
  public elasticSearchEngine: string;
  public outputFilterGrid: string;
  public postSeekJobExpire: string;
  public emailPreview: string;
  public CandidateJobCount: string;
  public getUserDashboardjob: string;
  public getUserDashboardActivity: string;
  public getUserdashboardMyInbox: string;
  public getUserdashboardAction: string;
  public getUserdashboardCandidate: string;
  public getJobDetails: string;
  public jobScreeningHeader: string;
  public candidateResumeCoverLetter: string;
  public jobactivityChecklistCount: string;
  public getClientContactMapList: string;
  public getClientAssignContact: string;
  public getcanJobActivities: string;
  public getReasonByShortDesc: string;
  public getJobBoardsPublishedDetails: string;
  public getJobActionNotesDate: string;
  public getAllNextStagesv2: string;
  public checkCandidateMoveAction: string;

  public getJobActionNotesCount: string;


  public hideWorkflowStage: string;

  public jobCandidateMappedAll: string;
  public getJobActionComments: string;
  public updateJobActionComments: string;
  public addJobActionComments: string;
  public deleteJobActionComments:string;
  public getJobActionRecuirters:string;
  public cvParsedCount: string;
  public getCandidateActivityCount: string;

  public SYNCactivitySchedular: string;
  public checkWorkflowMapping: string;

  public candProfileReadUnread: string;
  public intervewJobCount: string;
  public restoreDefaultConfig: string;
  public myInterviewActivityList: string;
  public checkintegrationStatus: string;
  public Candidatecountbyworkflowid_v1: string;
  public getLatLongByAddress: string;
  public getAllJobForActivityV2: string;
  public getViewDocument: string;
  public createJob_V2_Notes:string;
  public getValidateEohClientById:string;
  public EOHIntegrationDisconnect: string;
  public getEOHIntegrationDetails:string;
  public EOHIntegrationConnect:string;
  public getUserOrganizationList:string;
  public getTenantBasedOrg:string;
  public subscribeEOHSearchExtNotf:string;
  public subscribeEOHPushJobNotf:string;
  public saveEOHSubsFeatures:string;
  public getEOHSrhExtSubsDetails:string;
  public getEOHPushJobSubsDetails:string;
public getSuperUserDetails:string;
  public getClientsContact:string;
  public getContactSummaryHeader:string;
  public getContactAddress:string;
  public getContactPersonalDetails:string;
  public updateContactAddress:string;
  public createContactAddress:string;
  public deleteContactAddress:string;
  public getContactDetailsById:string;
  public updateContactImage:string;
  public deleteContact:string;
  public updatePersonalInfoData:string;
  public getClientAssignContactList:string;
  public getClientUnAssignContactList:string;
  public delinkClientContact:string;
  public assignClientContact:string;
  public updateContactDetails:string;
  public getXSearchTagData:string;
  public getXSearchCardList:string;
  public getXSearchCardProfilePic:string;
  public XeopleMapToFolder:string;



  public pinUnpinCandidate:string;
  public disLikeCandidate:string;
  public likeCandidate:string;
  public getCanLastUpcomingActivity: string;
  public GETworkflowhierarchy: string;
  public getXSearchCardSelected: string;
  public applicantProfileUpdate : string;
  public candidateJobAction_v2: string;
  public downloadDocumentByHtml:string;
  public xeopleExtractMembers: string;
  public eohSendpushNotification: string;
  public getXSearchCardResumeUrl: string;
  public getAllSelectedCandidates:string;
  public jobWithoutWorkflowV3: string;
  public xeoplePushMembers: string;
  public emailTemplateList:string;
  public updateJobStatus:string;
  public closeJob:string;
  public configureEOHFilter: string;
  public getEOHFilterById: string;
  public getEOHFilterAll: string;
  public deleteEOHFilter: string;
  public uniqueCheckEOHFilter: string;
  public getAllEmployeeListV2: string;
  public removeCandidateV2: string;
  public updateJobLocation: string;
  public candProfileReadUnreadV2: string;
  public userV2SmsList: string;
  public getJobdetailsByidV2: string;
  public getPostingIndeedDetails: string;
  public createIndeedJobPosting:string;
  public getIndeedPublishedJobDetails: string;
  public getIndeedDownloadJobXml: string;

  public inDeedintegrationCheckStatus: string;
  public indeedIntegrationDisconnect: string;
  public IndeedIntegrationConnect:string;
  public jobworkFlowBypipeIdV2: string;
  public candidateInboxV2: string;
  public candidateMailCountV2: string;
  public applicantList: string;
  public jobNotificationUrl: string;
  public sharedCalenderUserSave: string;
  public sharedCalenderUserDelete: string;
  public sharedCalenderListSharedBy: string;
  public sharedCalenderListSharedTo: string;
  public getExternalAttendeeName: string;
  public calendarnotsharedUserList: string;
  public updateJobExpiry: string;
  public getCandidateActivityHistoryAll: string;
  public getCompanyAllDetailsV2: string;
  public getParentCompanyAllEditClient: string;
  getCandidatemappedtojobcardAllV2: string;
  public userDetailsByID: string;

  public generalInbox: string;
  public recipientMailCount: string;
  public clientInbox: string;
  public clientMailCount: string;
  public dashboardClientDetailsV2: string;
  public jobLandingkendoList: string;
  public getAllEmployeeListV3: string;
  public getClientandContactEmails: string;
  public getJobsCountByWorkFlowIdV2: string;
  public postEOHCandNotification:string;
  public getEOHCandsubscriptionDetails:string;
  public clientFolderListCreate: string;
  public clientFolderList: string;
  public mapClientToFolder: string;
  public getClientFoldermappedList: string;
  public clientFolderListAll: string;
  public getIndustryList: string;
  public getQualificationList: string;
  public clientFolderDelete :string;
  public clientFolderListById :string;
  public clientFolderListUpdate :string;
  public getTitleMaster: string;
  public getOfficeList: string;
  public getCandidateInfoById: string;
  public pushCandidateToEOH: string;
  public clientFolderduplicateCheck :string;
  public getClientContactsList: string;
  public getSMSAllContact: string;
  public getContactSMSHistory: string;
  public userInvitationsList: string;
  public getUserNotificationsAll: string;
  public readNotification: string;
  public deleteNotification: string;
  public deLinkClientContact_V2: string;
  public isPrimaryContact: string;
  public candidatenoteByYearfilterByid: string;
  public getRedirectedClientNotebyid: string;
  public getRedirectedJobNotebyid:string;
  public notificationwss: string;
  public getActivityLogById: string;
  public setDefaultWorkflow: string;

  public sendBulkSmsForClient: string;
  public getAllJobWorkFlowList: string;
  public getClientNoteContactByClientid: string;  
  public getJobNoteContactByJobId:string;
  public xeoplesearchEmail: string;
  public language:string;
  public getCanidateTimelineCount: string;
  public resetlockedUser: string;
  public invitedlockedUser: string;
  public resumeFolder: string;
  public getCandidateSourceListURL: string;
  public getCandidateSourceByIdURL: string;
  public updateCandidateSourceURL: string;
  public getRecruiterEOHList: string;
  public getTempEmailList: string;
  public getCandidateActivitiesById: string;
  public getScreeningInterviewStatus: string;
  public getEOHTempEmailList: string;

  public CandidateStatusUpdate: string;
  public fetchEohNotesAll: string;
  public pushCandidateToEOHV2: string;
  public getCandidateSourceDefaultStatus:string;
  public totalCandidateForJobLandingPage:string;
  public createQuickAddJob_v2: string;
  public quickJobListByJobId_v2: string;
  public updateQuickAddJob_v2: string;
  public getjobactionconfiguration: string;
  public getJobActiontenantConfiguration:string;
  public updateJobActionNameandDisplay:string;
  public updateJobActionStageTypeMapping:string;
  public updateJobActionDisplaySequence:string;
  public integrationCheckStatusVxt: string;
  public getVxtIntegrationStatus: string;
  public getVxtIntegrationRegistrationByCode: string;
  public candidateVxtCreateCall: string;
  public getVxtLastCallDetails: string;
  public getVxtCandidateListCallDetails: string;
  public getVxtCandidateListCallDetailsById: string;
  public candidateVxtUpdateCall: string;
  public candidateVxtDeleteCall: string;
  public countVxtCall: string;
  public createCandidateSourceURL: string;
  public getCandidateChildSourceListURL: string;
  public getCandidateSourceDeleteURL: string;
  public  getDasboardAll: string;
  public createShareableLinkWithName: string;
  public  addLeadSource: string;
  public  updateLeadSource: string;
  public  getLeadSourceById: string;
  public  checkduplicasyLeadSource: string;
  public  deleteLeadSource: string;
  public  LeadSource: string;
  public getLeadWorkflowAll: string;
  public createLeadWOrkFlow: string;
  public leadWorkFlowStageIsExists: string;
  public leadWorkFlowIsExists: string;
  public getLeadWorkFlowById: string;
  public updateLeadWorkFlow: string;
  public deleteLeadWorkFlowById: string;
  public updateDefaultWorkFlow: string;
  public checkLeadWorkflowMapping: string;
  public getLeadSourceMaster: string;
  public createQuickLead: string;
  public getLeadCardDetails: string;
  public getAllStageDetails: string;
  public getClientWorkflowAll: string;
  public pinUnpinLead: string;
  public getLeadWorkflowCount: string;
  public convertLeadIntoClient: string;
  public getLeaddetailsById: string;
  public likeLead: string;
  public disLikeLead: string;
  public leadMoveAction: string;
  public hideLeadWorkflowStage: string;
  public leadLandingList: string;
  public getAllClientLeadList: string;
  public getLeadNextStages: string;
  public getLeadworkflowhierarchy: string;
  getLeadworkflowList: string;
  public  updateclientAccess : string;
  public getclientAccessById: string;
  public getEOHClientsubscriptionDetails: string;
  public getEOHContactsubscriptionDetails: string;
  public getEOHJobsubscriptionDetails: string;
  public subscribeEOHClientNotf: string;
  public subscribeEOHContactNotf: string;
  public subscribeEOHJobNotf: string;
  public getMemberPriorityList: string;
  public getEmploymentTypeList: string;
  public getEOHState: string;
  public getEOHLocationType: string;
  public getEOHLocationFunc: string;
  public getEOHOffice: string;
  public getEOHGrup: string;
  public getEOHPriority: string;
  public getEOHStatus: string;
  public getEOHClient: string;
  public shareEOHClient: string;
  public getEOHSharedContactData:string;
  public getEOHProfessionalLevel:string;
  public pushContactToEOH:string;
  public getEOHSyncedClients: string;
  public checkClientSyncEOH: string;
  public checkCandidateSyncEOH: string;
  public getJobShiftTypeEOH: string;
  public getJobQualificationEOH: string;
  public shareJobEOH: string;
  public pushCandidateToEOHV2Member: string;

  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  /*
  @Type: File, <ts>
  @Name: servicelist.service.ts
  @Who: Renu
  @When: 23-11-2020
  @Why: ROST-404
  @What: Get all application url form this call stord in config json file
  */

  Url() {
    return this.http.get('assets/config/config.json').toPromise()
      .then((response: any) => {
        this.configurationobject = response;
        this.setSharedApiUrl(this.configurationobject.shared);
        this.setSMSApiUrl(this.configurationobject.sms);
        this.setFileUploadApiUrl(this.configurationobject.fileServer);
        this.authApiUrl(this.configurationobject.auth);
        this.coreApiUrl(this.configurationobject.core);
        this.siteName = this.configurationobject.siteName;
        this.auditApiUrl(this.configurationobject.audit);
        this.setUriCoderApiUrl(this.configurationobject.uricoder);
        this.jobApiUrl(this.configurationobject.job);
        this.candidateApiUrl(this.configurationobject.can);
        this.emailApiUrl(this.configurationobject.email);
        this.seekApiUrl(this.configurationobject.seek);
        this.dextraApiUrl(this.configurationobject.dextra);
        this.assessmentApiUrl(this.configurationobject.assessment);
        this.broadBeanApiUrl(this.configurationobject.broadbean);
        this.ElasticApiUrl(this.configurationobject.elastic);
       // this.eohApiUrl(this.configurationobject.entireRecruit);
        this.pdfApiUrl(this.configurationobject.pdf);
        this.indeedApiUrl(this.configurationobject.indeed);
        this.notificationUrl(this.configurationobject.notification);
        this.wss(this.configurationobject.wss);
      }
      );
  }


  /*
    @Type: File, <ts>
    @Name: setFileUploadApiUrl
    @Who: Vipul Bansal
    @When: 27-02-2021
    @Why: EWM-1025
    @What: set All url for uri coder
    */
  setUriCoderApiUrl(URL: string) {
    this.encodeUri = URL + 'v1/UriCoder/uri-encode';
    this.decodeUri = URL + 'v1/UriCoder/uri-decode';
    this.getIpAddress = 'https://api.ipify.org?format=json';
    this.getUserNotificationsAll = URL + 'v1/WebNotification/get-usernotifications-all';
    this.readNotification = URL + 'v1/WebNotification/read-notification';
    this.deleteNotification = URL + 'v1/WebNotification/delete-notification';
  }

  /*
  @(C): Entire Software
  @Type: Url
  @Name: servicelist.service.ts
  @Who: Renu
  @When: 23-11-2020
  @Why: ROST-404
  @What: Get all menu realted info dynamically stored in module-menu json file
  */
  public getsubMenu() {
    return this.http.get('assets/config/module-menu.json').pipe(map(
      (response: Response) => {
        const data = response;
        return data;
      }
    ));
  }

  /*
  @Type: File, <ts>
  @Name: setSharedApiUrl
  @Who: Renu
  @When: 23-11-2020
  @Why: ROST-414
  @What: Set All shared Api Url
  */

  setSharedApiUrl(URL: string) {
    this.getAllUsertYpe = URL + 'v1/UserType/get-user-type-all';
    this.productList = URL + 'v1/Product/get-product-feature-detail';
    this.relationshipList = URL + 'v1/RelationshipType/get-relationshiptype-all';
    this.genderList = URL + 'v1/Gender/get-gender-all';
    this.emailaAvailableCheck = URL + 'v1/Email/get-check-isemail-available';
    this.createAccountUser = URL + 'v1/BuyNow/create-new-user';
    this.supportPlanList = URL + 'v1/SupportPlan/get-support-feature-detail';
    this.regionList = URL + 'v1/Region/get-region-all';
    this.resendEmail = URL + 'v1/BuyNow/resend-email';
    this.createTenant = URL + 'v1/BuyNow/create-new-tenant';
    this.emaillinkISvalid = URL + 'v1/BuyNow/get-isvalid-email';
    this.countryList = URL + 'v1/Country/get-country-all';
    this.getLanguageList = URL + 'v1/Language/get-langauge';
    this.getTimeZoneList = URL + 'v1/TimeZone/get-timezone';
    this.getSystemDatetimeFormats = URL + 'v1/TimeZone/get-timezone-datetimeformats';
    this.countryByName = URL + 'v1/Country/get-countrylist-byname';
    this.uninvitedUser = URL + 'v1/Uninvited/create-uninvited-user';
    this.invitedUser = URL + 'v1/InvitedUsers/create-inviteduser';
    this.validateinvitedUser = URL + 'v1/InvitedUsers/validate-inviteduser';
    this.planType = URL + 'v1/Plan/get-plan-all';
    this.productListNew = URL + 'v1/Product/get-product-by-region-plan';
    this.getBuyNowStatus = URL + 'v1/BuyNow/get-status';
    this.checkDomainAvailable = URL + 'v1/Domain/get-check-domain-available';
    this.disableUserMfa = URL + 'v1/MFA/disable-user-mfa';
    this.getMfaQrCode = URL + 'v1/MFA/get-user-mfa-qr';
    this.authenticatPin = URL + 'v1/MFA/validate-user-authenticator-pin';
    this.alternateEmail = URL + 'v1/MFA/send-user-email-otp';
    this.alternateEmailOtpvalidate = URL + 'v1/MFA/validate-user-otp';
    this.siteDomainList = URL + 'v1/Domain/get-site-domain-details';
    this.updateSiteDomain = URL + 'v1/Domain/update-tenant-domain';
    this.administratorsList = URL + 'v1/User/get-user-admin-all';

    this.deleteAdministrators = URL + 'v1/User/delete-user-as-admin';
    this.searchAdminList = URL + 'v1/User/get-user-search-admin?searchtext=';
    this.addAdministratorsUser = URL + 'v1/User/add-user-as-admin';
    this.updateUserPwd = URL + 'v1/User/update-user-password';
    this.verifyPwd = URL + 'v1/User/verify-user-password';
    this.getSecrurityquestion = URL + 'v1/SecurityQuestion/get-secrurityquestion-all';
    this.createUserMfa = URL + 'v1/MFA/create-user-mfa';
    this.forgotPassword = URL + 'v1/User/forgot-user-password';
    this.resetPassword = URL + 'v1/User/reset-password';
    this.verifyResetLink = URL + 'v1/User/verify-forgot-link';
    this.getDomainAvailable = URL + 'v1/Domain/get-sub-domain-available';
    this.passwordPattern = URL + 'v1/PasswordPolicy/get-PasswordPattern';
    this.accessLevelList = URL + 'v1/AccessLevel/get-accesslevel-all';
    this.accessLevelListById = URL + 'v1/AccessLevel/get-accesslevel-byid';
    this.getIPValidation = URL + 'v1/BuyNow/get-check-ip-blacklist';
    this.getModuleList = URL + 'v1/ProductModuleMapping/get-modules-by-tenantid';
    this.getPlaceHolderType = URL + 'v1/Placeholder/get-placeholder-type-all';
    this.getPlaceHolderByType = URL + 'v1/Placeholder/get-placeholder-by-type';
    this.getPlaceHolderDetails = URL + 'v1/Placeholder/get-placeholder-table-details-by-id';
    this.verifyForgotEmail = URL + 'v1/User/verify-forgot-email-address';
    this.verifyuserName = URL + 'v1/User/verify-user-name';
    this.sendVerificationCode = URL + 'v1/User/send-verification-code';
    this.validateVerificationCode = URL + 'v1/User/validate-verification-code';
    this.setUninvitedUserPassword = URL + 'v1/Uninvited/set-uninvited-user-password';
    this.menuList = URL + 'v1/RolePermission/get-tenant-menu';
    this.getAllstatus = URL + "v1/Common/get-active-status-all";

    this.currencyList = URL + 'v1/Currency/get-currency-all';
    this.getStateList = URL + 'v1/State/get-state-all';
    this.stateList = URL + 'v1/State/get-state-all';
    this.getAllWorkFlowList = URL + 'v1/JobWorkflow/get-jobworkflow-all';
    this.getAllState = URL + 'v1/State/get-state-all';
    this.countryById = URL + 'v1/Country/get-country-byid';
    this.jobWorkFlowLatest = URL + 'v1/JobWorkflow/get-jobworkflow-byid';

    this.getmanageNameValueListAdmin = URL + 'v1/ManageName/get-managename-value-all';
    this.getManageNameAdminById = URL + 'v1/ManageName/get-managename-value-byid';
    this.getRealtionShipList = URL + 'v1/RelationshipType/get-relationshiptype-all';

    this.get_integration_biling_type = URL + 'v1/BillingType/get-billingtype-all';
    this.get_integration_Category = URL + 'v1/IntegratorCategory/get-integratorcategory-all';
    this.get_integration_status = URL + 'v1/IntegrationStatus/get-integrationstatus-all';
    this.get_integration_type = URL + 'v1/IntegrationType/get-integrationtype-all';
    this.get_integration_tag = URL + 'v1/IntegrationRegistration/get-integrationregistration-getintegratortaglist';
    this.get_integration_Board = URL + 'v1/IntegrationRegistration/get-integrationregistration-all',
    this.getAllNationality = URL + 'v1/Nationality/get-nationality-all';
    this.getAllLanguage = URL + 'v1/LanguageMaster/get-languagemaster-all';
    this.emailDisconnection = URL + 'v1/User/disconnectemail';
    this.updateUserEmailIntegration = URL + 'v1/User/update-emailintegration';
    this.IsEmailConnected = URL + 'v1/User/isemailconnected';
    this.IsEmailDisConnected = URL + 'v1/User/disconnectemail';


    this.getRegisteredUserList = URL + 'v1/UserType/get-usertype-bypeople';
    this.currencyList = URL + 'v1/Currency/get-currency-all';
    this.getStateList = URL + 'v1/State/get-state-all';
    this.stateList = URL + 'v1/State/get-state-all';
    this.getAllWorkFlowList = URL + 'v1/JobWorkflow/get-jobworkflow-all';
    this.getAllState = URL + 'v1/State/get-state-all';
    this.countryById = URL + 'v1/Country/get-country-byid';
    this.jobWorkFlowLatest = URL + 'v1/JobWorkflow/get-jobworkflow-byid';

    this.getmanageNameValueListAdmin = URL + 'v1/ManageName/get-managename-value-all';
    this.getManageNameAdminById = URL + 'v1/ManageName/get-managename-value-byid';
    this.getRealtionShipList = URL + 'v1/RelationshipType/get-relationshiptype-all';

    this.currencyList = URL + 'v1/Currency/get-currency-all';
    this.getStateList = URL + 'v1/State/get-state-all';
    this.stateList = URL + 'v1/State/get-state-all';
    this.getAllWorkFlowList = URL + 'v1/JobWorkflow/get-jobworkflow-all';
    this.getAllState = URL + 'v1/State/get-state-all';
    this.countryById = URL + 'v1/Country/get-country-byid';
    this.jobWorkFlowLatest = URL + 'v1/JobWorkflow/get-jobworkflow-byid';

    this.getmanageNameValueListAdmin = URL + 'v1/ManageName/get-managename-value-all';
    this.getManageNameAdminById = URL + 'v1/ManageName/get-managename-value-byid';
    this.getRealtionShipList = URL + 'v1/RelationshipType/get-relationshiptype-all';

    this.get_integration_biling_type = URL + 'v1/BillingType/get-billingtype-all';
    this.get_integration_Category = URL + 'v1/IntegratorCategory/get-integratorcategory-all';
    this.get_integration_status = URL + 'v1/IntegrationStatus/get-integrationstatus-all';
    this.get_integration_type = URL + 'v1/IntegrationType/get-integrationtype-all';
    this.get_integration_tag = URL + 'v1/IntegrationRegistration/get-integrationregistration-getintegratortaglist';
    this.get_integration_Board = URL + 'v1/IntegrationRegistration/get-integrationregistration-all',
    this.getAllNationality = URL + 'v1/Nationality/get-nationality-all';
    this.getAllLanguage = URL + 'v1/LanguageMaster/get-languagemaster-all';
    this.emailDisconnection = URL + 'v1/User/disconnectemail';
    this.updateUserEmailIntegration = URL + 'v1/User/update-emailintegration';
    this.IsEmailConnected = URL + 'v1/User/isemailconnected';
    this.IsEmailDisConnected = URL + 'v1/User/disconnectemail';

    this.currencyList = URL + 'v1/Currency/get-currency-all';
    this.getStateList = URL + 'v1/State/get-state-all';
    this.stateList = URL + 'v1/State/get-state-all';
    this.getAllWorkFlowList = URL + 'v1/JobWorkflow/get-jobworkflow-all';
    this.getAllState = URL + 'v1/State/get-state-all';
    this.countryById = URL + 'v1/Country/get-country-byid';
    this.jobWorkFlowLatest = URL + 'v1/JobWorkflow/get-jobworkflow-byid';

    this.getmanageNameValueListAdmin = URL + 'v1/ManageName/get-managename-value-all';
    this.getManageNameAdminById = URL + 'v1/ManageName/get-managename-value-byid';
    this.getRealtionShipList = URL + 'v1/RelationshipType/get-relationshiptype-all';

    this.get_integration_biling_type = URL + 'v1/BillingType/get-billingtype-all';
    this.get_integration_Category = URL + 'v1/IntegratorCategory/get-integratorcategory-all';
    this.get_integration_status = URL + 'v1/IntegrationStatus/get-integrationstatus-all';
    this.get_integration_type = URL + 'v1/IntegrationType/get-integrationtype-all';
    this.get_integration_tag = URL + 'v1/IntegrationRegistration/get-integrationregistration-getintegratortaglist';
      this.getAllNationality = URL + 'v1/Nationality/get-nationality-all';
    this.getAllLanguage = URL + 'v1/LanguageMaster/get-languagemaster-all';
    this.emailDisconnection = URL + 'v1/User/disconnectemail';
    this.updateUserEmailIntegration = URL + 'v1/User/update-emailintegration';
    this.IsEmailConnected = URL + 'v1/User/isemailconnected';
    this.IsEmailDisConnected = URL + 'v1/User/disconnectemail';
    this.getEmailIntegration = URL + 'v1/User/get-emailintegration';

    this.getAllProximity = URL + 'v1/Proximity/get-proximity';
    this.getIntegrationRegistrationByCode = URL + 'v1/IntegrationRegistration/get-integrationregistration-bycode';
    this.zoomHistoryList = URL + 'v1/ZoomCallHistory/get-zoomcallhistory-all';
    this.zoomHistoryDetail = URL + 'v1/ZoomCallHistory/get-zoomcallhistory-details';
    this.getGDPRConsentByid = URL + 'v1/GDPRConsent/get-gdprconsent-byid';
    this.updateGDPRConsent = URL + 'v1/GDPRConsent/update-gdprconsent';

    this.getGDPREmailTemp = URL + 'v1/GDPREmailTemplate/get-gdprtemplate';
    this.updateGDPREmailTemp = URL + 'v1/GDPREmailTemplate/update';
    this.getGDPRPageTemp = URL + 'v1/GDPRPageTemplate/get-gdprpagetemplate';
    this.updateGDPRPageTemp = URL + 'v1/GDPRPageTemplate/update';
    this.createSystemAccessToken = URL + 'v1/PAT/generate',
      this.SystemAccessTokenList = URL + 'v1/PAT/get-pat-all',
      this.revokeSystemAccessToken = URL + 'v1/PAT/revoke-access';
    this.otherIntegrationCheckStatus = URL + 'v1/IntegrationRegistration/checkstatus-otherintegrations';
    this.errorLogStatus = URL + 'v1/PushToMQ/push';
    this.workflowapplicationstages = URL + 'v1/JobWorkflow/get-workflowapplicationstages-all';
    this.getDefaultWorkflow = URL + 'v1/JobWorkflow/get-jobworkflow-defaultstages';
    this.getPlanTypeAll = URL + 'v1/IntegrationRegistration/get-broadbean-plantype-details';
    this.emailPreview = URL + 'v1/TemplatePreview/preview-email';

    this.getGDPREmailTemp = URL + 'v1/GDPREmailTemplate/get-gdprtemplate';
    this.updateGDPREmailTemp = URL + 'v1/GDPREmailTemplate/update';
    this.getGDPRPageTemp = URL + 'v1/GDPRPageTemplate/get-gdprpagetemplate';
    this.updateGDPRPageTemp = URL + 'v1/GDPRPageTemplate/update';
    this.createSystemAccessToken = URL + 'v1/PAT/generate',
      this.SystemAccessTokenList = URL + 'v1/PAT/get-pat-all',
      this.revokeSystemAccessToken = URL + 'v1/PAT/revoke-access';
    this.otherIntegrationCheckStatus = URL + 'v1/IntegrationRegistration/checkstatus-otherintegrations';
    this.errorLogStatus = URL + 'v1/PushToMQ/push';
    this.workflowapplicationstages = URL + 'v1/JobWorkflow/get-workflowapplicationstages-all';
    this.getDefaultWorkflow = URL + 'v1/JobWorkflow/get-jobworkflow-defaultstages';
    this.getPlanTypeAll = URL + 'v1/IntegrationRegistration/get-broadbean-plantype-details';
    this.emailPreview = URL + 'v1/TemplatePreview/preview-email';
    this.getEmailIntegration = URL + 'v1/User/get-emailintegration';
    this.language = URL + 'v1/Lang';
    this.resetlockedUser = URL + 'v1/User/reset-locked-account-byclient';
    this.getVxtIntegrationRegistrationByCode = URL + 'v1/IntegrationRegistration/get-integrationregistration-bycode';
  }

  /*
  @Type: File, <ts>
  @Name: setFileUploadApiUrl
  @Who: Renu
  @When: 23-11-2020
  @Why: ROST-414
  @What: set All url for upload file
  */
  setFileUploadApiUrl(URL: string) {
    this.userProfileImageUpload = URL + 'v1/FileUpload/upload-user-resources';
    this.siteLogoupload = URL + 'v1/FileUpload/upload-tenant-resources';
    this.imageUploadByUrl = URL + 'v1/ImageUpload/upload-image-by-url';
    this.imageUploadByBase64 = URL + 'v1/ImageUpload/upload-image-by-base64string';
    this.uploadCandidateDocument = URL + 'v1/FileUpload/upload-candidate-resources';
    this.mapChecklistDocument = URL + 'v1/Document/mapped-document-checklist';
    this.getDocumentAccessMode = URL + 'v1/Document/get-document-access-modes';
    this.createGrantDocumentAccess = URL + 'v1/Document/grant-document-access';
    this.getDocumentHasAccessById = URL + 'v1/Document/get-document-hasaccess-byid';
    this.removeDocumentAccess = URL + 'v1/Document/remove-document-access';

    this.documentVersion = URL + 'v1/DocumentVersion/get-documentversion-all';
    this.createVersionDocument = URL + 'v1/DocumentVersion/create-documentversion';

    this.getAllDocument = URL + 'v1/Document/get-document-all';
    this.getDocumentByHeierarchy = URL + 'v1/Document/get-document-hierarchy';
    this.getDocumentById = URL + 'v1/Document/get-document-byid';
    this.createFolder = URL + 'v1/Document/create-folder';
    this.createDocument = URL + 'v1/Document/create-document';
    this.checkduplicityCandidateDocument = URL + 'v1/Document/check-referenceid';
    this.deletedocumentdata = URL + 'v1/Document/delete-document-byid';
    this.downloadFolder = URL + 'v1/Document/download-filefolder';
    this.RenameFolder = URL + 'v1/Document/update-document';

    this.getDocumentcategory = URL + 'v1/DocumentCategory/get-documentcategory-all';
    this.createDocumentcategory = URL + 'v1/DocumentCategory/create-documentcategory';
    this.updateDocumentcategory = URL + 'v1/DocumentCategory/update-documentcategory';
    this.deleteDocumentcategory = URL + 'v1/DocumentCategory/delete-documentcategory-byid';
    this.getDocumentcategorybyId = URL + 'v1/DocumentCategory/get-documentcategory-byid';
    this.checkduplicityDocumentcategory = URL + 'v1/DocumentCategory/check-documentcategory-exists';

    this.getDocumentName = URL + 'v1/DocumentName/get-documentname-all';
    this.createDocumentName = URL + 'v1/DocumentName/create-documentname';
    this.updateDocumentName = URL + 'v1/DocumentName/update-documentname-byid';
    this.deleteDocumentName = URL + 'v1/DocumentName/delete-documentname-byid';
    this.getDocumentNamebyId = URL + 'v1/DocumentName/get-documentname-byid';
    this.checkduplicityDocumentName = URL + 'v1/DocumentName/check-documentname-name';
    this.getdocumentShareById = URL + 'v1/DocumentShare/get-document-share-byid';
    this.documentShare = URL + 'v1/DocumentShare/sharedocument';
    this.getDocumentCount = URL + 'v1/Document/get-document-count';
    this.createShareableLink = URL + 'v1/DocumentSharedLink/create-documentsharedlink';
    this.sendDocumentOtp = URL + 'v1/Document/send-document-email-otp';
    this.validateDocumentOtp = URL + 'v1/Document/validate-document-otp';
    this.getshareablesharedLinkList = URL + 'v1/DocumentSharedLink/get-sharedlinklist-byid';
    this.revokeAccessOfShareablelink = URL + 'v1/DocumentSharedLink/delete-revokeaccess-byid';
    this.getAllDocumentForExternalLink = URL + 'v1/Document/get-document-externalshare-all';
    this.downloadDocumentForExternalLink = URL + 'v1/Document/download-externalshare-filefolder';
    this.getDocumentDetailsForExternal = URL + 'v1/Document/get-externalsharedocument-byid';

    this.getWorkFlowImgByColorCode = URL + 'v1/ImageUpload/upload-image-by-name';
    this.getCategoryListByType = URL + 'v1/DocumentCategory/get-documentcategory-byusertypeid';
    this.getDocumentnameAllbyUsertype = URL + 'v1/DocumentName/get-documentname-all-byusertype';
    this.getViewDocument = URL + 'v1/Document/view-document';
    this.resumeFolder = URL + 'v1/FileUpload/DownLoadFile';

  }

  /*
  @Type: File, <ts>
  @Name: setFileUploadApiUrl
  @Who: Renu
  @When: 23-11-2020
  @Why: ROST-414
  @What: set All url for authentication
  */
  authApiUrl(URL: string) {
    this.defaultLoginUser = URL + 'v1/Login/agent-token';
    this.loginUserAuth = URL + 'v1/Login/token';
    this.logoutUserAuth = URL + 'v1/Login/logout';
    this.loginUserCheck = URL + 'v1/Login/verify-emailid';
    this.externalLogin = URL + 'v1/Login/externallogin';
    this.refreshTokenlogin = URL + 'v1/Login/refresh';
    this.loginDomain = URL + 'v1/Login/user-token';
    this.orgToken = URL + 'v1/Login/org-token';
    this.signUp = URL + 'v1/Signup/user-signup';
    this.externalUser = URL + 'v1/Login/authenticate-externaluser';
    this.getRollAccess = URL + '';
    this.createpassword = URL + 'v1/Createpassword/user-createpassword';
    this.updateQuickLink = URL + 'v1/Login/update-quicktour';
    this.logoutUrl = URL + 'v1/Login/logout';

  }

  /*
 @Type: File, <ts>
 @Name: setFileUploadApiUrl
 @Who: Nitin Bhati
 @When: 23-11-2020
 @Why: ROST-414
 @What: set All url for authentication
 */
  auditApiUrl(URL: string) {
    this.userSystemLogList = URL + 'v1/Audit/get-audit-log-all';
    this.userSystemLogListDownload = URL + 'v1/Audit/download-audit-logs';
    this.createUseractivity = URL + 'v1/UserActivity/create-useractivity';
    this.getJobLogHistory = URL + 'v1/JobHistory/get-job-history';
    this.getUserdashboardAction = URL + 'v1/ActionDashboard/get-userdashboardactions';
  }


  /*
  @Type: File, <ts>
  @Name: coreApiUrl
  @Who: Renu
  @When: 24-01-2021
  @Why:-
  @What: set All url for client
  */

  coreApiUrl(URL: string) {
    this.getApi = URL + 'v1/Brand/get-dummy-errorthrow-api-for-ui-use';
    this.postApi = URL + 'v1/Brand/post-dummy-errorthrow-api-for-ui-use';
    this.userProfileList = URL + 'v1/User/get-user-profile';
    this.userProfileUpdate = URL + 'v1/User/update-user-profile';
    this.contactList = URL + 'v1/User/get-user-contact';
    this.updateContact = URL + 'v1/User/update-user-contact';
    this.emailSettingList = URL + 'v1/User/get-user-email-setting';
    this.emailSettingUpdate = URL + 'v1/User/update-user-email-setting';
    this.mailSettingList = URL + 'v1/Tenant/get-tenant-email-setting';
    this.mailSettingUpdate = URL + 'v1/Tenant/update-tenant-email-setting';
    this.checkEmailcredential = URL + 'v1/Tenant/check-email-credential';
    this.userGrpAdd = URL + 'v1/UserGroup/create-usergroup';
    this.userGrpUpdate = URL + 'v1/UserGroup/update-usergroup-byid';
    this.userGrpDelete = URL + 'v1/UserGroup/delete-usergroup-byId';
    this.userGrpExists = URL + 'v1/UserGroup/get-usergroup-name-isavailable';
    this.userGrpList = URL + 'v1/UserGroup/get-usergroup-all';
    this.generalSettingList = URL + 'v1/Tenant/get-tenant-general-setting';
    this.generalSettingUpdate = URL + 'v1/Tenant/update-tenant-general-setting';
    this.internalizationUpdate = URL + 'v1/Tenant/update-tenant-Internationalization-setting';
    this.internalizationList = URL + 'v1/Tenant/get-tenant-Internationalization-setting';
    this.userPreferenceList = URL + 'v1/User/get-user-preference';
    this.updateuserPreference = URL + 'v1/User/update-user-preference';
    this.getSystemLookFeel = URL + 'v1/Tenant/get-tenant-lookandfeel-settings';
    this.updateSystemLookFeel = URL + 'v1/Tenant/update-tenant-lookandfeel-settings';
    this.organizationList = URL + 'v1/Organization/get-tenant-organization-all';
    this.addOrganization = URL + 'v1/Organization/create-organization';
    this.updateOrganization = URL + 'v1/Organization/update-organization';
    this.checkDuplicityKey = URL + 'v1/Organization/check-duplicate-key';
    this.getOrganizationById = URL + 'v1/Organization/get-organization-byid';
    this.emailTempsAdd = URL + 'v1/EmailTemplate/create-emailtemplate';
    this.emailTempsUpdate = URL + 'v1/EmailTemplate/update-emailtemplate';
    this.emailTempsDelete = URL + 'v1/EmailTemplate/delete-emailtemplate-byid';
    this.emailTemplateExists = URL + 'v1/EmailTemplate/check-emailtemplate-exist';
    this.emailTempsList = URL + 'v1/EmailTemplate/get-emailtemplate-all';
    this.emailTempByID = URL + 'v1/EmailTemplate/get-emailtemplate-byid';
    this.getUserEmailIntegration = URL + 'v1/User/get-user-email-integration';
    this.emailTempByID = URL + 'v1/EmailTemplate/Get-emailtemplate-byid';
    this.userSmsAdd = URL + 'v1/Sms/create-sms';
    this.userSmsUpdate = URL + 'v1/Sms/update-sms-byid';
    this.userSmsDelete = URL + 'v1/Sms/delete-sms-byid';
    this.userSmsList = URL + 'v1/Sms/get-sms-all';
    this.smsTempsList = URL + 'v1/Sms/get-sms-templates';
    this.userRoleList = URL + 'v1/Role/get-role-all';
    this.userRoleCreate = URL + 'v1/Role/create-role';
    this.userRoleDelete = URL + 'v1/Role/delete-role-byid';
    this.userRoleUpdate = URL + 'v1/Role/update-role-byid';
    this.userRoleExists = URL + 'v1/Role/get-role-name-isavailable';
    this.userSmsExists = URL + 'v1/Sms/get-sms-title-isavailable';
    this.getUserRoleById = URL + 'v1/Role/get-role-byid';
    this.tenantUserTypeList = URL + 'v1/tenantUserType/get-tenantusertype-all';
    this.tenantUserTypeListById = URL + 'v1/TenantUserType/get-tenantusertype-ById';
    this.tenantUserTypeUpdate = URL + 'v1/tenantUserType/update-tenantusertype-byId';
    this.tenantuserTypeColumnUniqueCheck = URL + 'v1/tenantUserType/get-tenantusertype-columnvalue-isavailable';
    this.getAddressFormat = URL + 'v1/Tenant/get-tenant-address-format';
    this.setAddressFormat = URL + 'v1/Tenant/update-tenant-address-formats';
    this.addUserInvitation = URL + 'v1/UserInvite/create-user-invitation';
    this.userInvitationList = URL + 'v1/UserInvite/get-user-invitation-all';
    this.userInvitationsList = URL + 'v1/UserInvite/get-user-invitations-all';
    this.userInvitationListv2 = URL + 'v1/UserInvite/get-user-invitation-all-v2';
    this.userGroupmemberAll = URL + 'v1/UserInvite/get-usergroup-member-all';
    this.userInviteList = URL + 'v1/UserInvite/get-client-rm-all';
    this.userInvitationByID = URL + 'v1/UserInvite/get-user-invite-byid';
    this.userInvitationRoleList = URL + 'v1/UserInvite/get-user-roles-list';
    this.userInvitationUserTypeList = URL + 'v1/UserInvite/get-user-type-list';
    this.userInvitationAccessLevelList = URL + 'v1/UserInvite/get-user-access-level-list';
    this.getUserDirectory = URL + 'v1/User/get-user-directory';
    this.getOrganizationList = URL + 'v1/Organization/get-user-organization-all';
    this.updateUninvitedUserRequest = URL + 'v1/UserInvite/update-user-access-request';
    this.calendarnotsharedUserList = URL + 'v1/ShareCalendar/get-calendarnotsharedtouser-list';
   // this.socialProfileListMaster = URL + 'SocialProfile/get-socialprofile-all';
   // this.socialProfileById = URL + 'SocialProfile/get-socialprofile-byid';
   // this.socialProfileDeleteMaster = URL + 'SocialProfile/delete-socialprofile-byid';
   // this.socialProfileEditMaster = URL + 'SocialProfile/update-socialprofile';
   // this.socialProfileAddMaster = URL + 'SocialProfile/create-socialprofile';
   // this.duplicaySocialProfileName = URL + 'SocialProfile/check-socialprofile-availability';
    this.addLocationType = URL + 'v1/LocationType/create-locationtype';
    this.locationTypeAllList = URL + 'v1/LocationType/get-locationtype-all';
    this.locationTypeByID = URL + 'v1/LocationType/get-locationtype-byId';
    this.updateLocationType = URL + 'v1/LocationType/update-locationtype';
    this.deleteLocationType = URL + 'v1/LocationType/delete-locationtype-byId';
    this.locationTypeExists = URL + 'v1/LocationType/get-locationtype-exits';
    this.rolePermissionById = URL + 'v1/Role/get-role-permissions-by-rolecode';
    this.saveRolePermission = URL + 'v1/Role/update-role-permissions';
    this.addPeopleMasterUserContactType = URL + 'v1/UserContactType/create-usercontacttype'
    this.getAllPeopleMasterUserContactType = URL + 'v1/UserContactType/get-usercontacttype-getallbycategory';
    this.deletePeople_MasterUserContactType = URL + 'v1/UserContactType/delete-usercontacttype-byId';
    this.getPeople_MasterContactByID = URL + 'v1/UserContactType/get-usercontacttype-byId';
    this.updatePeople_MasterContactType = URL + 'v1/UserContactType/update-usercontacttype';
    this.getAllCategoryForPeopleMaster = URL + 'v1/UserContactType/get-usercontacttype-getallcategory';
    this.duplicayContactType = URL + 'v1/UserContactType/get-usercontacttype-exits';
    this.getPeopleListByCategory = URL + 'v1/UserContactType/get-usercontacttype-byCategory';
    this.groupAllList = URL + 'v1/Group/get-group-all';
    this.statusAllList = URL + 'v1/Group/get-groupstatus-all';
    this.statusListLevel = URL + 'v1/Group/get-group-status-all';
    this.statusByID = URL + 'v1/Group/get-groupstatus-byid';
    this.creategrupstatus = URL + 'v1/Group/create-groupstatus';
    this.deleteStatus = URL + 'v1/Group/delete-groupstatus-byid';
    this.updateStatus = URL + 'v1/Group/update-groupstatus-byid';
    this.checkCodeExist = URL + 'v1/Group/check-statuscode-exists';
    this.statusDescExists = URL + 'v1/Group/check-statusdescription-exists';
    this.reasonList = URL + 'v1/Group/get-statusreason-all';
    this.createReason = URL + 'v1/Group/create-statusreason';
    this.getReasonById = URL + 'v1/Group/get-statusreason-byid';
    this.updateReasonById = URL + 'v1/Group/update-statusreason-byid';
    this.deleteReasonById = URL + 'v1/Group/delete-statusreason-byid';
    this.createIndustry = URL + 'v1/Industry/create-industry';
    this.getIndustryAll = URL + 'v1/Industry/get-industry-all';
    this.getIndustryById = URL + 'v1/Industry/get-industry-byid';
    this.updateIndustryById = URL + 'v1/Industry/update-industry-byid';
    this.deleteIndustryById = URL + 'v1/Industry/delete-industry-byid';
    this.checkIndustryIsExist = URL + 'v1/Industry/check-industry-isexist';
    this.createSubIndustry = URL + 'v1/SubIndustry/create-subindustry';
    this.getSubIndustryAll = URL + 'v1/SubIndustry/get-subindustry-all';
    this.getSubIndustryById = URL + 'v1/SubIndustry/get-subindustry-byid';
    this.updateSubIndustryById = URL + 'v1/SubIndustry/update-subindustry-byid';
    this.deleteSubIndustryById = URL + 'v1/SubIndustry/delete-subindustry-byid';
    this.checkSubIndustryIsExist = URL + 'v1/SubIndustry/check-subindustry-isexist';
    this.getAllSalary = URL + 'v1/SalaryUnit/get-salaryunit-all';
    this.getSalaryById = URL + 'v1/SalaryUnit/get-salaryunit-byId';
    this.addSalaryUnit = URL + 'v1/SalaryUnit/create-salaryunit';
    this.UpdateSalaryUnit = URL + 'v1/SalaryUnit/update-salaryunit';
    this.deleteSalaryUnit = URL + 'v1/SalaryUnit/delete-salaryunit-byId';
    this.checkDuplicityofSalaryUnit = URL + 'v1/SalaryUnit/check-salaryunit-exits';
    this.getJobCommitmentList = URL + 'v1/JobCommitment/get-jobcommitment-all';
    this.getJobCommitmentById = URL + 'v1/JobCommitment/get-jobcommitment-byid';
    this.getJobCommitmentCreate = URL + 'v1/JobCommitment/create-jobcommitment';
    this.getJobCommitmentUpdate = URL + 'v1/JobCommitment/update-jobcommitment-byid';
    this.getJobCommitmentDelete = URL + 'v1/JobCommitment/delete-jobcommitment-byid';
    this.getJobCommitmentIsExist = URL + 'v1/JobCommitment/check-jobcommitment-exists';
    this.getInviteTeammate = URL + 'v1/TeammateInvite/get-teammateinvite-directory';
    this.createInviteTeammate = URL + 'v1/TeammateInvite/create-teammate-invitation';
    this.createPeople = URL + 'v1/People/create-people';
    this.checkInvitationEmailExist = URL + 'v1/UserInvite/check-invitationemail-exists';
    this.UpdateUserInvitation = URL + 'v1/UserInvite/update-user-invitation';
    this.revokUserAccess = URL + 'v1/UserInvite/revoke-user-accessrequest';
    this.getUninvitedUsers = URL + 'v1/Uninvited/get-uninvited-users';
    this.uninvitedUserByID = URL + 'v1/Uninvited/get-uninvited-user-byid';
    this.getUninvitedNotification = URL + 'v1/Uninvited/get-uninvited-user-request-notification';
    this.getAccessRole = URL + 'v1/Role/checkaccess';
    this.getDarkMode = URL + 'v1/User/get-user-darkmode';
    this.updateDarkMode = URL + 'v1/User/update-user-darkmode';
    this.getBrandAllList = URL + 'v1/Brand/get-brand-all';
    this.createCustomer = URL + 'v1/CustomerType/create-customertype';
    this.getCustomerAll = URL + 'v1/CustomerType/get-customertype-all';
    this.getCustomerById = URL + 'v1/CustomerType/get-customertype-byid';
    this.updateCustomerById = URL + 'v1/CustomerType/update-customertype';
    this.deleteCustomerById = URL + 'v1/CustomerType/delete-customer-byid';
    this.checkCustomerIsExist = URL + 'v1/CustomerType/get-customertype-exits';
    this.getBrandAll = URL + 'v1/Brand/get-brand-all';
    this.getBrandById = URL + 'v1/Brand/get-brand-byid';
    this.createBrand = URL + 'v1/Brand/create-brand';
    this.updateBrandById = URL + 'v1/Brand/update-brand-byid';
    this.deleteBrandById = URL + 'v1/Brand/delete-brand-byid';
    this.checkBrandIsExist = URL + 'v1/Brand/check-brand-isexist';
    this.getAllFunctionalExpertise = URL + 'v1/FunctionalExpertise/get-functionalexpertise-all';
    this.deleteFunctionalExpertiseList = URL + 'v1/FunctionalExpertise/delete-functionalexpertise-byid';
    this.addfunctionalExpertise = URL + 'v1/FunctionalExpertise/create-functionalexpertise';
    this.FunctionalExpertiseDuplicay = URL + 'v1/FunctionalExpertise/check-functionalexpertise-isexist';
    this.functionalExpertiseById = URL + 'v1/FunctionalExpertise/get-functionalexpertise-byid';
    this.updatefunctionalExpertise = URL + 'v1/FunctionalExpertise/update-functionalexpertise-byid';
    this.getAllFunctionalSubExpertise = URL + 'v1/FunctionalSubExpertise/get-functionalsubexpertise-all';
    this.deleteFunctionalSubExpertiseList = URL + 'v1/FunctionalSubExpertise/delete-functionalsubexpertise-byid';
    this.addfunctionalSubExpertise = URL + 'v1/FunctionalSubExpertise/create-functionalsubexpertise';
    this.FunctionalSubExpertiseDuplicay = URL + 'v1/FunctionalSubExpertise/check-functionalsubexpertise-isexist';
    this.getfunctionalSubExpertiseById = URL + 'v1/FunctionalSubExpertise/get-functionalsubexpertise-byid';
    this.updatefunctionalSubExpertise = URL + 'v1/FunctionalSubExpertise/update-functionalsubexpertise-byid';
    this.getCompanyAllDetails = URL + 'v1/QuickAddClient/get-quickaddclient-all';
    this.createQuickCompany = URL + 'v1/QuickAddClient/create-quickaddclient';
    this.updateQuickCompany = URL + 'v1/QuickAddClient/update-clientdetails';
    this.getClientListById = URL + 'v1/QuickAddClient/get-clientalldetails-byid';
    this.getParentCompanyAll = URL + 'v1/QuickAddClient/get-quickaddclient-all';
    this.updateFavouriteMenu = URL + 'v1/User/update-user-favouritemenu';
    this.getFavouriteMenu = URL + 'v1/User/get-user-favouritemenu';
    this.companyNameExists = URL + 'v1/QuickAddClient/get-clientname-exits';
    this.getEmployeeTagAll = URL + 'v1/EmployeeTag/get-employeetag-all';
    this.getEmployeeTagById = URL + 'v1/EmployeeTag/get-employeetag-byid';
    this.createEmployeetag = URL + 'v1/EmployeeTag/create-employeetag';
    this.updateEmployeeTag = URL + 'v1/EmployeeTag/update-employeetag-byid';
    this.deleteEmployeeTag = URL + 'v1/EmployeeTag/delete-employeetag-byid';
    this.checkEmployeetagIsexist = URL + 'v1/EmployeeTag/check-employeetag-isexist';
    this.checkemployeetagkeywordisexist = URL + 'v1/EmployeeTag/check-employeetag-keyword-isexist';
    this.clientTagList = URL + 'v1/ClientTag/get-clienttag-all';
    this.clientTagById = URL + 'v1/ClientTag/get-clienttag-byid';
    this.clientTagCreate = URL + 'v1/ClientTag/create-clienttag';
    this.clientTagUpdate = URL + 'v1/ClientTag/update-clienttag-byid';
    this.clientTagDelete = URL + 'v1/ClientTag/delete-clienttag-byid';
    this.clientTagDuplicate = URL + 'v1/ClientTag/check-clienttag-codedisplaysequence-isexist';
    this.getManageNameList = URL + 'v1/ManageNames/get-managenames-all';
    this.createManageName = URL + 'v1/ManageNames/configure-managenames';
    this.dashboardWidgetList = URL + 'v1/DashboardWidget/get-dashboardwidget-all';
    this.dashboardConfigure = URL + 'v1/DashboardWidget/configure';
    this.getfilterConfig = URL + 'v1/Configuration/get-configuration';
    this.setfilterConfig = URL + 'v1/Configuration/create-configuration';
    this.getQualification = URL + 'v1/Qualification/get-qualification-all';
    this.qualificationList = URL + 'v1/Qualification/get-qualification-all';
    this.deleteSavedConfig = URL + 'v1/Configuration/delete-configuration';
    this.qualificationAllList = URL + 'v1/Qualification/get-qualification-all';
    this.qualificationByID = URL + 'v1/Qualification/get-qualification-byid';
    this.addQualification = URL + 'v1/Qualification/create-qualification';
    this.updateQualification = URL + 'v1/Qualification/update-qualification-byid';
    this.deleteQualification = URL + 'v1/Qualification/delete-qualification-byid';
    this.qualificationExists = URL + 'v1/Qualification/check-qualification-name';
    this.getallStatusDetails = URL + 'v1/Group/get-groupstatus-getallStatusDetails';
    this.getManageAll = URL + 'v1/ManageNames/get-managename-value-json';
    this.getAllSkillsList = URL + 'v1/Skill/get-skill-names-all';
    this.getAllSkillsListWithFilter = URL + 'v1/Skill/get-skill-all';
    this.getSkillsCount = URL + 'v1/Skill/get-skill-namecount';
    this.getSkillsByTagId = URL + 'v1/Skill/get-skill-namesbytagid';
    this.updateBulkEditSkill = URL + 'v1/Skill/update-skill-bulk';
    this.getSkillById = URL + 'v1/Skill/get-skill-byid';
    this.createSkill = URL + 'v1/Skill/create-skill';
    this.updateSkillById = URL + 'v1/Skill/update-skill-byid';
    this.deleteSkillById = URL + 'v1/Skill/delete-skill-byid';
    this.checkSkillName = URL + 'v1/Skill/check-skill-name';
    this.getAllSkillGroupList = URL + 'v1/SkillGroup/get-skillgroup-all';
    this.getSkillGroupById = URL + 'v1/SkillGroup/get-skillgroup-byid';
    this.createSkillGroup = URL + 'v1/SkillGroup/create-skillgroup';
    this.updateSkillGroupById = URL + 'v1/SkillGroup/update-skillgroup-byid';
    this.deleteSkillGroupById = URL + 'v1/SkillGroup/delete-skillgroup-byid';
    this.checkSkillGroupName = URL + 'v1/SkillGroup/check-skill-name';
    this.getSkillMappingListById = URL + 'v1/Skill/get-skill-skillmatching';
    this.getSearchUserwithGroup = URL + 'v1/User/search-user-withgroup';
    this.searchUserWithGroup = URL + 'v1/User/search-user-withgroup';
    this.getUserIsEmailConnected = URL + 'v1/User/get-user-isemailconnected';
    //this.emailDisconnection = URL + 'v1/User/get-user-emaildisconnected';

    this.getWeightageList = URL + 'v1/Weightage/get-weightage-all';
    this.getWeightageById = URL + 'v1/Weightage/get-weightage-byid';
    this.createWeightage = URL + 'v1/Weightage/create-weightage';
    this.updateWeightage = URL + 'v1/Weightage/update-weightage';
    this.deleteWeightage = URL + 'v1/Weightage/delete-weightage-byid';
    this.checkDuplicityWeightage = URL + 'v1/Weightage/check-duplicate-weightage';

    this.clientLandingList = URL + 'v1/QuickAddClient/get-client-all';
    this.getReasonGroup = URL + 'v1/TenantReason/get-tenantreason-all-bygroupinternalcode';
    this.updateReasonGroup = URL + 'v1/TenantReason/update-tenantreason-byid';
    this.createReasonGroup = URL + 'v1/TenantReason/create-tenantreason';
    this.deleteReasonGroup = URL + 'v1/TenantReason/delete-tenantreason-byid';
    this.getReasonGroupById = URL + 'v1/TenantReason/get-tenantreason-byid';
    this.checkDuplicityofReasonGroup = URL + 'v1/TenantReason/check-tenantreason-duplicate';
    this.getReasonGroupModule = URL + 'v1/TenantReason/get-reasongroup-bymodulename';
    this.dashboardStateClientDetails = URL + 'v1/ClientDashboard/get-clientdashboard-stateclient-all';
    this.dashboardParentClientDetails = URL + 'v1/ClientDashboard/get-clientdashboard-parentclient-all';
    this.dashboardStatusClientDetails = URL + 'v1/ClientDashboard/get-clientdashboard-statusclient-all';
    this.dashboardClientDetails = URL + 'v1/ClientDashboard/get-clientdashboard-client-all';
    this.dashboardClientCount = URL + 'v1/ClientDashboard/get-clientdashboard-client-count';
    this.getEmployeeList = URL + 'v1/EmployeeLanding/get-employeelanding-all';

    this.addSeekIntegration = URL + 'v1/Integrations/connect';
    this.updateSeekIntegration = URL + 'v1/Integrations/update';
    this.seekIntegrationDisconnect = URL + 'v1/Integrations/disconnect';
    this.integrationCheckStatus = URL + 'v1/Integrations/checkstatus';
    this.getIntegrationById = URL + 'v1/Integrations/get-integrations-byid';
    this.getIntegrationAll = URL + 'v1/Integrations/get-integrations-all';
    this.getSeekIntegrationById = URL + 'v1/Integrations/get-seek-integrations-byid';


    this.getAllSkillTagList = URL + 'v1/SkillTag/get-skilltag-all';
    this.getSkillTagById = URL + 'v1/SkillTag/get-skilltag-byid';
    this.createSkillTag = URL + 'v1/SkillTag/create-skilltag';
    this.updateSkillTagById = URL + 'v1/SkillTag/update-skilltag-byid';
    this.deleteSkillTagById = URL + 'v1/SkillTag/delete-skilltag-byid';
    this.checkSkillTagName = URL + 'v1/SkillTag/check-skill-tag';

    this.getAllSkillsTagList = URL + 'v1/Skill/get-skillnamewithtag-all';
    this.clientSummaryHeader = URL + 'v1/QuickAddClient/get-clientsummary-header';
    this.getLocationMappedToClientAll = URL + 'v1/ClientLocation/get-clientlocation-all';
    this.getLocationMappedToClientById = URL + 'v1/ClientLocation/get-clientlocation-byid';
    this.createClientLocation = URL + 'v1/ClientLocation/create-clientlocation';
    this.updateClientLocation = URL + 'v1/ClientLocation/update-clientlocation';
    this.deleteClientLocation = URL + 'v1/ClientLocation/delete-clientlocation-byid';
    this.getClientAccessMode = URL + 'v1/Visibility/get-client-visibility-mode';
    this.createGrantClientAccess = URL + 'v1/QuickAddClient/update-clientvisibility';
    this.getClientAccessModeById = URL + 'v1/QuickAddClient/get-clientvisibility-byid';
    this.getLocationCount = URL + 'v1/ClientLocation/get-clientlocation-count';
    this.getAllDescriptionOfClient = URL + 'v1/ClientDescription/get-clientdescription-all';
    this.createDescriptionOfClient = URL + 'v1/ClientDescription/create-description';
    this.getbyIdDescriptionOfClient = URL + 'v1/ClientDescription/get-clientdescription-byid';
    this.updateDescriptionOfClient = URL + 'v1/ClientDescription/update-clientdescription';
    this.deleteDescriptionOfClient = URL + 'v1/ClientDescription/delete-clientdescription-byid';
    this.clientDetailsById = URL + 'v1/QuickAddClient/get-client-details-byid';
    this.clientMappingTagList = URL + 'v1/MappingClientTag/get-mappingclienttag-all';
    this.updateClientMappingTagList = URL + 'v1/MappingClientTag/update';
    this.updateClientStatusList = URL + 'v1/QuickAddClient/update-clientstatus';
    this.getSubIndustryAllWithoutID = URL + 'v1/SubIndustry/get-allsubindustry-list';
    this.updateClientDetailsById = URL + 'v1/QuickAddClient/update-client-details-byid';
    this.businessRegistrationById = URL + 'v1/QuickAddClient/get-client-details-byid';
    this.updateBusinessRegistration = URL + 'v1/QuickAddClient/update-client-details-byid';
    this.getAllEmailOfClient = URL + 'v1/ClientEmail/get-client-emails';
    this.createEmailOfClient = URL + 'v1/ClientEmail/create-client-emails';
    this.updateEmailOfClient = URL + 'v1/ClientEmail/update-client-email-byid';
    this.deleteEmailOfClient = URL + 'v1/ClientEmail/delete-client-email-byid';

    this.businessRegistrationById = URL + 'v1/QuickAddClient/get-businessregistration-byid';
    this.updateBusinessRegistration = URL + 'v1/QuickAddClient/update-businessregistration';

    this.getClientLocationMain = URL + 'v1/ClientLocation/get-clientlocation-main';
    this.getClientLocationById = URL + 'v1/ClientLocation/get-clientlocation-byid';
    this.getClientAllList = URL + 'v1/QuickAddClient/get-client-dd';

    this.getAllContactRelatedType = URL + 'v1/TenantUserType/get-tenantusertype-all?FilterParams.ColumnName=InternalCode&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=CLIE%2CSUPP&FilterParams.FilterOption=Contains&FilterParams.FilterCondition=AND'
    this.createQuickContact = URL + 'v1/ClientContacts/create-clientcontact';
    this.getContactRelatedClientall = URL + 'v1/ClientContacts/get-contactrelatedclient-all';

    this.getAllPhoneOfClient = URL + 'v1/PhoneDetails/get-clientphonecontact-all';
    this.updatePhoneOfClient = URL + 'v1/PhoneDetails/update-clientphonecontact';
    this.deletePhoneOfClient = URL + 'v1/PhoneDetails/delete-clientphonecontact-byid';
    this.createPhoneOfClient = URL + 'v1/PhoneDetails/create-clientphonecontact';

    this.downloadClientData = URL + 'v1/QuickAddClient/download-client-list';

    this.getContactListById = URL + 'v1/ClientContacts/get-clientcontacts-all';
    this.deLinkClientContact = URL + 'v1/ClientContacts/delink-clientcontact';
    this.getContactCount = URL + 'v1/ClientContacts/get-clientcontacts-count';
    this.daxtraIntegrationDisconnect = URL + 'v1/Integrations/daxtra-disconnect';
    this.daxtraIntegrationConnect = URL + 'v1/Integrations/daxtra-connect';
    this.getClientContactList = URL + 'v1/ClientContacts/get-contacts-all';
    this.getContactByClientId = URL + 'v1/ClientContacts/get-contactsbyclientid-all';


    this.notesCategoryList = URL + 'v1/NotesCategory/get-notescategory-all';
    this.notesCategoryById = URL + 'v1/NotesCategory/get-notescategory-byid';
    this.notesCategoryCreate = URL + 'v1/NotesCategory/create';
    this.notesCategoryEdit = URL + 'v1/NotesCategory/update';
    this.notesCategoryDelete = URL + 'v1/NotesCategory/delete-notescategory-byid';
    this.notesCategoryDuplicayCheck = URL + 'v1/NotesCategory/unique';
    
    

    this.clientNoteCount = URL + 'v1/ClientNotes/get-clientnotescount-byclientid';
    this.clientNoteList = URL + 'v1/ClientNotes/clientnotes-byyearfilter';
    this.clientNoteCreate = URL + 'v1/ClientNotes/create';
    this.clientNoteUpdate = URL + 'v1/ClientNotes/update';
    this.clientNoteById = URL + 'v1/ClientNotes/get-clientnotes-byid';
    this.clientNoteDelete = URL + 'v1/ClientNotes/delete-clientnotes-byid';
    this.clientNoteGrantAccess = URL + 'v1/ClientNotes/create-notesaccessmapping';
    this.clientNoteTotal = URL + 'v1/ClientNotes/get-clientnotes-count';
    this.clientUserAccess = URL + 'v1/ClientNotes/get-noteuseraccesslist';

    this.getPosition_All = URL + 'v1/PositionMaster/get-position-all';
    this.createPosition = URL + 'v1/PositionMaster/create-position';
    this.updatePosition = URL + 'v1/PositionMaster/update-position-byid';
    this.bulkUpdatePosition = URL + 'v1/PositionMaster/update-position-bulk';
    this.getPosition_byId = URL + 'v1/PositionMaster/get-position-byid';
    this.getPosition_ByIndustry = URL + 'v1/PositionMaster/get-positionnames-byindustryid';
    this.deletePosition = URL + 'v1/PositionMaster/delete-position-byid';
    this.getPositionCount = URL + 'v1/PositionMaster/get-position-count';
    this.checkPositionDuplicacy = URL + 'v1/PositionMaster/check-position-name';

    this.enableXeopleSMSIntegration = URL + 'v1/Integrations/sms-connect';
    this.disableXeopleSMSIntegration = URL + 'v1/Integrations/sms-disconnect';
    this.sendSmsJobForCan = URL + 'v1/Integrations/send-sms';
    this.organisationStructure = URL + 'v1/OrganizationStructure/get-organization-structure';
    this.downloadorgStructure = URL + 'v1/OrganizationStructure/download-organization-structure';

    this.getAccessPermission = URL + 'v1/AccessPermission/get-accesspermission-all';
    this.postAccessPermission = URL + 'v1/AccessPermission/update-accesspermission';
    this.clientTeamDetails = URL + 'v1/ClientTeamDetails/get-clientteamdetails-all';
    this.createAddTeam = URL + 'v1/ClientTeamDetails/create';
    this.clientTeamUpdate = URL + 'v1/ClientTeamDetails/update';
    this.getClientTeamById = URL + 'v1/ClientTeamDetails/get-clientteamdetails-byid';
    this.clientTeamDeleteById = URL + 'v1/ClientTeamDetails/delete-team-byid';
    this.getTeamCount = URL + 'v1/ClientTeamDetails/get-clientteam-count';
    this.updateOwner = URL + 'v1/ClientTeamDetails/update-owner';
    this.getDuplicateEmployeeTeam = URL + 'v1/ClientTeamDetails/check-duplicate-employee';


    this.getAllClientForActivity = URL + 'v1/QuickAddClient/get-client-list';
    this.getAllActivityCategory = URL + 'v1/ActivityCategoryMaster/get-activitycategory-all';
    this.myActivityCreate = URL + 'v1/ActivityMaster/create';
    this.getManageAccessMode = URL + 'v1/AccessPermission/get-accesspermission-all'


    this.activityCategoryList = URL + 'v1/ActivityCategoryMaster/get-activitycategory-all';
    this.activityCategoryById = URL + 'v1/ActivityCategoryMaster/get-activitycategory-byid';
    this.activityCategoryCreate = URL + 'v1/ActivityCategoryMaster/create';
    this.activityCategoryEdit = URL + 'v1/ActivityCategoryMaster/update';
    this.activityCategoryDelete = URL + 'v1/ActivityCategoryMaster/delete-activitycategory-byid';
    this.activityCategoryDuplicayCheck = URL + 'v1/ActivityCategoryMaster/unique';

    this.activitySchedular = URL + 'v1/ActivityMaster/get-schedulemonthactivity';
    this.candidateActivityBycandidateId = URL + 'v1/ActivityMaster/get-activitycount-bycandidateid';
    this.candidateFilterActivityByYear = URL + 'v1/ActivityMaster/candidateactivity-byyearfilter';
    this.candidateActivityById = URL + 'v1/ActivityMaster/get-activity-byid';
    this.updateActivityMaster = URL + 'v1/ActivityMaster/update';
    this.deleteActivityId = URL + 'v1/ActivityMaster/delete-activity-byid';
    this.recentActivityCount = URL + 'v1/ActivityMaster/get-activity-count';
    this.updateActivityStatus = URL + 'v1/ActivityMaster/updateactivitystatus';

    this.myActivityList = URL + 'v1/ActivityMaster/getactivitylist';
    this.getMyActivityById = URL + 'v1/ActivityMaster/get-activity-byid';
    this.updateMyActivityById = URL + 'v1/ActivityMaster/update';
    this.deleteMyActivityById = URL + 'v1/ActivityMaster/delete-myactivity-byid';
    this.sourceLabelData = URL + 'v1/CandidateSourceLabel/get-candidatesource-label';

    this.getEmailForwarding = URL + 'v1/EmailForwarding/get-emailforwarding';
    this.updateEmailForwarding = URL + 'v1/EmailForwarding/update-emailforwarding';

    this.getOtherIntegrationAll = URL + 'v1/Integrations/get-otherintegrations-all';
    this.zoomConfiguration = URL + 'v1/Integrations/Zoom-userconnect';

    this.zoomConfigurationDisabled = URL + 'v1/Integrations/Zoom-otherintegration-disconnect';
    this.getGDPRCompliance = URL + 'v1/Tenant/get-gdprsetting';
    this.updateGDPRCompliance = URL + 'v1/Tenant/update-gdprsetting'

    this.relateToModuleList = URL + 'v1/RelatedToModuleMaster/get-relatedtomodule-all';
    this.relateToModuleCreate = URL + 'v1/RelatedToModuleMaster/create';
    this.relateToModuleById = URL + 'v1/RelatedToModuleMaster/get-relatedtomodule-byid';
    this.relateToModuleUpdate = URL + 'v1/RelatedToModuleMaster/update';
    this.relateToModuleCheckDuplicacy = URL + 'v1/RelatedToModuleMaster/check-duplicate-module';
    this.relateToModuleDelete = URL + 'v1/RelatedToModuleMaster/delete';

    this.zoomConfigurationConnect = URL + 'v1/Integrations/zoom-connect';
    this.zoomConfigurationDisconnect = URL + 'v1/Integrations/Zoom-disconnect';
    this.removeReasonCandidate = URL + 'v1/TenantReason/get-tenantreasonall-forjob';
    this.getWorkSchedule = URL + 'v1/UserWorkSchedule/get-userworkschedule';
    this.updateWorkSchedule = URL + 'v1/UserWorkSchedule/update';

    this.removeReasonCandidate = URL + 'v1/TenantReason/get-tenantreasonall-forjob'

    this.msTeamConfigurationConnect = URL + 'v1/Integrations/msteams-connect';
    this.msTeamConfigurationDisconnect = URL + 'v1/Integrations/msteams-disconnect';
    this.googleMeetConfigurationConnect = URL + 'v1/Integrations/googlemeet-connect';
    this.googleMeetConfigurationDisconnect = URL + 'v1/Integrations/googlemeet-disconnect';
    this.getSmsById = URL + 'v1/Sms/get-sms-byid';

    this.getAvaiabletimeslots = URL + 'v1/ActivityMaster/get-availabletimeslots';
    this.getActivityAvaiableTimeslots = URL + 'v1/ActivityMaster/get-activity-availabletimeslots';
    this.msTeamConfiguration = URL + 'v1/Integrations/enable-msteams';
    this.googleMeetConfiguration = URL + 'v1/Integrations/enalbe-googlemeet';
    this.creatMeetingUrl = URL + 'v1/ActivityMaster/create-meetingurl';
    this.getUserGroupListById = URL + 'v1/UserGroup/get-usergroup-byid';
    this.setDefaultlocation = URL + 'v1/ClientLocation/update-isdefault';
    this.getAccessPermissionType = URL + 'v1/AccessPermission/get-access';
    this.updateAccess = URL + 'v1/AccessPermission/update-access';
    this.checkIsDefaultLocation = URL + 'v1/ClientLocation/check-defaultlocation';
    this.TenantUserType = URL + 'v1/TenantUserType/get-tenantusertype-all';
    this.StateAll = URL + 'v1/State/get-state-all';
    this.deleteState = URL + 'v1/State/delete-state-byid';
    this.state = URL + 'v1/State/update-state';
    this.getStateByID = URL + 'v1/State/get-state-byid';
    this.states = URL + 'v1/State/create-state';
    this.checkDuplicacyofState = URL + 'v1/State/check-duplicate-state';

    this.broadBeanIntegrationDisconnect = URL + 'v1/Integrations/broadbean-disconnect';
    this.addbroadBeanIntegration = URL + 'v1/Integrations/broadbean-connect';
    this.getbroadbeantenantdetails = URL + 'v1/Integrations/get-broadbeantenantdetails';
    this.disablebroadBeanIntegration = URL + 'v1/Integrations/broadbean-userdisable';
    this.enabelbroadBeanIntegration = URL + 'v1/Integrations/broadbean-userenable';
    this.getbroadbeanuserdetails = URL + 'v1/Integrations/get-broadbeanuserdetails';

    this.burstSmsIntegrationDisconnect = URL + 'v1/Integrations/burstsms-disconnect';
    this.addBurstSmsIntegration = URL + 'v1/Integrations/burstsms-connect';
    this.getBurstSmstenantdetails = URL + 'v1/Integrations/get-burstsmstenantdetails';
    this.weighageUserType = URL + 'v1/Weightage/get-weightage-all';
    this.weighageExperience = URL + 'v1/Weightage/get-weightage-all';
    this.broadbeanAddUser = URL + 'v1/Integrations/broadbean-add-user';
    this.getBroadbeanUsersAll = URL + 'v1/Integrations/get-broadbean-users-all';
    this.deleteBroadbeanUsers = URL + 'v1/Integrations/delete-broadbean-user-byid';
    this.isBroadBeanUserExist = URL + 'v1/Integrations/check-broadbean-user-isexist';
    this.jobConfigurePermission = URL + 'v1/JobConfiguration/get-job-configuration';
    this.createJobConfigureField = URL + 'v1/JobConfiguration/create-job-configuration';

    this.getXfactorPoolList = URL + 'v1/XFactorSearch/get-searchpool';
    this.getXfactorOutputField = URL + 'v1/XFactorSearch/get-outputfields';
    this.getXfactorIOList = URL + 'v1/XFactorSearch/get-xfilterparameters';
    this.getXfactorFilterList = URL + 'v1/XFactorSearch/get-xfiltersearch-all';
    this.getXfactorFilterById = URL + 'v1/XFactorSearch/get-xfiltersearch-byid';
    this.saveFilterConfig = URL + 'v1/XFactorSearch/configure-xfilter';
    this.checkFilterUnique = URL + 'v1/XFactorSearch/check-unique-filter';
    this.getFilterSearchAll = URL + 'v1/XFactorSearch/get-xfiltersearch-all';
    this.deleteFilterSearch = URL + 'v1/XFactorSearch/delete-filter';
    this.outputFilterGrid = URL + 'v1/XFactorSearch/get-outputfields-byfilterid';
    this.getUserDashboardActivity = URL + 'v1/DashboardWidget/get-userdashboardActivity';
    this.getClientContactMapList = URL + 'v1/ClientContacts/get-notmappedcontacts-all';
    this.getClientAssignContact = URL + 'v1/ClientContacts/assign-contact';
    this.getcanJobActivities = URL + 'v1/ActivityMaster/get-candidatejobactivities';
    this.getCandidateActivityCount = URL + 'v1/ActivityMaster/get-candidateactivities-count';
    this.SYNCactivitySchedular =  URL + 'v1/ActivityMaster/get-schedulemonthactivity-interviews';
    this.restoreDefaultConfig =  URL + 'v1/Configuration/delete-gridconfiguration';
    this.myInterviewActivityList = URL + 'v1/ActivityMaster/interview-getactivitylist';
    this.checkintegrationStatus=URL + 'v1/Integrations/check-integration-status';
    this.getLatLongByAddress=URL + 'v1/State/get-latitude-longitude-by-address';

    this.burstSmsIntegrationDisconnect = URL + 'v1/Integrations/burstsms-disconnect';
    this.addBurstSmsIntegration = URL + 'v1/Integrations/burstsms-connect';
    this.getBurstSmstenantdetails = URL + 'v1/Integrations/get-burstsmstenantdetails';
    this.weighageUserType = URL + 'v1/Weightage/get-weightage-all';
    this.weighageExperience = URL + 'v1/Weightage/get-weightage-all';
    this.broadbeanAddUser = URL + 'v1/Integrations/broadbean-add-user';
    this.getBroadbeanUsersAll = URL + 'v1/Integrations/get-broadbean-users-all';
    this.deleteBroadbeanUsers = URL + 'v1/Integrations/delete-broadbean-user-byid';
    this.isBroadBeanUserExist = URL + 'v1/Integrations/check-broadbean-user-isexist';
    this.jobConfigurePermission = URL + 'v1/JobConfiguration/get-job-configuration';
    this.createJobConfigureField = URL + 'v1/JobConfiguration/create-job-configuration';

    this.getXfactorPoolList = URL + 'v1/XFactorSearch/get-searchpool';
    this.getXfactorOutputField = URL + 'v1/XFactorSearch/get-outputfields';
    this.getXfactorIOList = URL + 'v1/XFactorSearch/get-xfilterparameters';
    this.getXfactorFilterList = URL + 'v1/XFactorSearch/get-xfiltersearch-all';
    this.getXfactorFilterById = URL + 'v1/XFactorSearch/get-xfiltersearch-byid';
    this.saveFilterConfig = URL + 'v1/XFactorSearch/configure-xfilter';
    this.checkFilterUnique = URL + 'v1/XFactorSearch/check-unique-filter';
    this.getFilterSearchAll = URL + 'v1/XFactorSearch/get-xfiltersearch-all';
    this.deleteFilterSearch = URL + 'v1/XFactorSearch/delete-filter';
    this.outputFilterGrid = URL + 'v1/XFactorSearch/get-outputfields-byfilterid';
    this.getUserDashboardActivity = URL + 'v1/DashboardWidget/get-userdashboardActivity';
    this.getClientContactMapList = URL + 'v1/ClientContacts/get-notmappedcontacts-all';
    this.getClientAssignContact = URL + 'v1/ClientContacts/assign-contact';
    this.getcanJobActivities = URL + 'v1/ActivityMaster/get-candidatejobactivities';
    this.getCandidateActivityCount = URL + 'v1/ActivityMaster/get-candidateactivities-count';
    this.SYNCactivitySchedular =  URL + 'v1/ActivityMaster/get-schedulemonthactivity-interviews';
    this.restoreDefaultConfig =  URL + 'v1/Configuration/delete-gridconfiguration';
    this.myInterviewActivityList = URL + 'v1/ActivityMaster/interview-getactivitylist';
    this.checkintegrationStatus=URL + 'v1/Integrations/check-integration-status';
    this.getLatLongByAddress=URL + 'v1/State/get-latitude-longitude-by-address';

    this.getValidateEohClientById=URL + 'v1/Integrations/validate-eoh-client-byid';
    this.EOHIntegrationDisconnect = URL + 'v1/Integrations/eoh-disconnect';
    this.getEOHIntegrationDetails=URL + 'v1/Integrations/get-eoh-integration-details';
    this.EOHIntegrationConnect=URL + 'v1/Integrations/eoh-connect';
    this.getUserOrganizationList=URL + 'v1/UserInvite/get-user-invitation-all-by-orgid';
    this.subscribeEOHSearchExtNotf=URL +'v1/Integrations/enable-eoh-search-extract-notifications';
    this.subscribeEOHPushJobNotf=URL+'v1/Integrations/enable-eoh-push-job-notifications';
    this.saveEOHSubsFeatures=URL+'v1/Integrations/update-eoh-subscription-user-notification-details'
    this.getEOHSrhExtSubsDetails=URL+'v1/Integrations/get-eoh-search-extract-subscription-details'
    this.getEOHPushJobSubsDetails=URL+'v1/Integrations/get-eoh-push-job-subscription-details'
    this.getSuperUserDetails=URL+'v1/UserInvite/get-eoh-super-user-details';
    this.getTenantBasedOrg = URL + 'v2/Organization/get-tenant-organization-all';

    this.getClientsContact=URL + 'v1/ClientContacts/get-contactslist-all';
    this.getContactSummaryHeader=URL+'v1/ClientContacts/get-contactsummary-header';
    this.getContactAddress=URL+'v1/ClientContacts/get-contactaddress';
    this.getContactPersonalDetails=URL+'v1/ClientContacts/get-contactdetails';
    this.updateContactAddress=URL+'v1/ClientContacts/update-contactaddress';
    this.createContactAddress=URL+'v1/ClientContacts/create-contactaddress';
    this.deleteContactAddress=URL+'v1/ClientContacts/delete-contactaddress';
    this.getContactDetailsById=URL+'v1/ClientContacts/get-contact-byid';
    this.updateContactImage=URL+'v1/ClientContacts/update-contactimage';
    this.deleteContact=URL+'v1/ClientContacts/delete-contact';
    this.updatePersonalInfoData=URL+'v1/ClientContacts/update-contactpersonaldetails';
    this.getClientAssignContactList = URL +'v1/ClientContacts/get-clientsassignedcontact';
    this.getClientUnAssignContactList = URL +'v1/ClientContacts/get-clientsnotassignedcontact';
    this.delinkClientContact = URL +'v1/ClientContacts/delink-client';
    this.assignClientContact = URL +'v1/ClientContacts/assign-client';
    this.updateContactDetails = URL +'v1/ClientContacts/update-contact';
    this.getCanLastUpcomingActivity=URL + 'v1/ActivityMaster/get-canlastupcoming-activity';
    this.emailTemplateList = URL +'v1/EmailTemplate/get-emailtemplate-all-v2';
    this.configureEOHFilter=URL + 'v1/XFactorSearch/configure-xeoplesearch-eohfilter';
    this.getEOHFilterById=URL + 'v1/XFactorSearch/get-eohfilter-byid';
    this.getEOHFilterAll=URL + 'v1/XFactorSearch/get-eohfilter-all';
    this.deleteEOHFilter=URL + 'v1/XFactorSearch/delete-eoh-filter';
    this.uniqueCheckEOHFilter=URL + 'v1/XFactorSearch/check-unique-eoh-filter';
    this.inDeedintegrationCheckStatus = URL + 'v1/Integrations/get-indeedtenantdetails';
    this.indeedIntegrationDisconnect = URL + 'v1/Integrations/indeed-disconnect';
    this.IndeedIntegrationConnect=URL + 'v1/Integrations/indeed-connect';
    this.userV2SmsList = URL + 'v2/Sms/get-sms-all';
    this.sharedCalenderListSharedBy= URL +'v1/ShareCalendar/get-sharedcalendartouser-list';
    this.sharedCalenderUserSave= URL +'v1/ShareCalendar/post-sharedcalender-user';
    this.sharedCalenderUserDelete= URL +'v1/ShareCalendar/delete-sharedcalender-user';
    this.sharedCalenderListSharedTo= URL +'v1/ShareCalendar/get-sharedcalender-user';
    this.getExternalAttendeeName = URL+'v1/ActivityMaster/get-externalattendeename';
    this.getCompanyAllDetailsV2 = URL + 'v1/QuickAddClient/get-quickaddclient-all_v2';
    this.getParentCompanyAllEditClient = URL + 'v1/QuickAddClient/get-parentclientchildren-list';
    this.userDetailsByID = URL + 'v1/User/get-user-profile';
    this.dashboardClientDetailsV2 = URL + 'v1/ClientDashboard/get-clientdashboard-client-all-v2';
    this.getClientandContactEmails=URL + 'v1/ClientContacts/get-clientandcontactemails';
    this.postEOHCandNotification=URL + 'v1/Integrations/enable-eoh-push-candidate-notifications';
    this.getEOHCandsubscriptionDetails=URL + 'v1/Integrations/get-eoh-push-candidate-subscription-details';
    this.clientFolderListCreate = URL + 'v1/FilterFolder/create';
    this.clientFolderListAll = URL + 'v1/FilterFolder/get-filterfolder-all';
    this.clientFolderList = URL + 'v1/FilterFolder/get-clientfolder';
    this.mapClientToFolder = URL + 'v1/FilterFolder/mapclienttofolder';
    this.getClientFoldermappedList=URL + 'v1/FilterFolder/get-clientfolder-mappedlist';
    this.clientFolderDelete = URL + 'v1/FilterFolder/delete-filterfolder-byid';
    this.clientFolderListById = URL + 'v1/FilterFolder/get-filterfolder-byid';
    this.clientFolderListUpdate = URL + 'v1/FilterFolder/update';
    this.clientFolderduplicateCheck = URL + 'v1/FilterFolder/check-unique';
    this.getClientContactsList = URL + 'v1/ClientContacts/get-clientcontacts-list';
    this.getSMSAllContact = URL + 'v1/Integrations/get-sms-all';
    this.getContactSMSHistory = URL + 'v1/Integrations/get-sms-all';
    this.deLinkClientContact_V2 = URL + 'v2/ClientContacts/delink-clientcontact';
    this.isPrimaryContact = URL + 'v1/ClientContacts/update-isprimary';
    this.getRedirectedClientNotebyid = URL + 'v1/ClientNotes/get-redirectedclientnote-byid';
    this.sendBulkSmsForClient = URL + 'v2/Integrations/send-sms';
    this.getClientNoteContactByClientid= URL + 'v1/ClientContacts/get-client-note-contacts-by-clientid';
    this.invitedlockedUser = URL + '/v1/UserInvite/resend-user-invitation';
    this.getCandidateActivitiesById = URL +'v1/ActivityMaster/get-candidate-activities-byid';
    this.integrationCheckStatusVxt = URL + 'v1/Integrations/check-vxtintegrationstatus';
    this.getVxtIntegrationStatus = URL + 'v1/Integrations/configure-vxt';
    this.getDasboardAll = URL + 'v1/DashboardConfiguration/get-dashboard-configuration-all';
    this.addLeadSource = URL + 'v1/LeadSourceMaster/create-leadsource';
    this.updateLeadSource = URL + 'v1/LeadSourceMaster/update-leadsource';
    this.getLeadSourceById = URL + 'v1/LeadSourceMaster/get-leadsource-byid';
    this.checkduplicasyLeadSource = URL + 'v1/LeadSourceMaster/check-leadsource';
    this.deleteLeadSource = URL + 'v1/LeadSourceMaster/delete-leadsource';
    this.LeadSource = URL + 'v1/LeadSourceMaster/get-leadsource';
    this.getLeadSourceMaster = URL + 'v1/LeadSourceMaster/get-leadsource';
    this.createQuickLead = URL + 'v1/Lead/create-lead';
    this.getClientWorkflowAll = URL + 'v1/ClientWorkflow/get-workflow-all';
    this.getLeadWorkflowCount = URL + 'v1/Lead/get-workflow-count';

    /****************lead/Client Workflow api Start ****************/
    this.getLeadWorkflowAll = URL +'v1/ClientWorkflow/get-workflow-all';
    this.createLeadWOrkFlow= URL +'v1/ClientWorkflow/create-workflow';
    this.getLeadWorkFlowById= URL +'v1/ClientWorkflow/get-workflow-byid';
    this.updateLeadWorkFlow= URL +'v1/ClientWorkflow/update-workflow-byid';
    this.deleteLeadWorkFlowById= URL +'v1/ClientWorkflow/delete-workflow-byid';
    this.leadWorkFlowStageIsExists=URL+'v1/ClientWorkflow/check-workflowstage';
    this.leadWorkFlowIsExists = URL + 'v1/ClientWorkflow/check-workflow';
    this.updateDefaultWorkFlow = URL +'v1/ClientWorkflow/update-defaultworkflow';
    this.checkLeadWorkflowMapping=URL + 'v1/ClientWorkflow/check-workflow-mapping';
   /****************lead/Client Workflow api End ******************/

 /****************lead/Client card api Start ******************/
   this.getLeadCardDetails=URL+'v1/LeadActions/leads-card';
   this.getAllStageDetails=URL+'v1/Lead/get-workflow-stages-count';
   this.pinUnpinLead=URL+'v1/LeadActions/pin-unpin';
   this.disLikeLead = URL + 'v1/LeadActions/dislike';
   this.likeLead = URL + 'v1/LeadActions/like';
   this.leadMoveAction = URL + 'v1/LeadActions/move';
   this.hideLeadWorkflowStage= URL +'v1/Lead/save-stage-visibility';
  /******************lead/Client card api end******************/
    this.convertLeadIntoClient = URL + 'v1//Lead/convert-lead-to-client';
    this.getLeaddetailsById = URL + 'v1/Lead/get-leaddetails-byid';
    this.leadLandingList = URL + 'v1/LeadActions/leads-list';
    this.getAllClientLeadList = URL + 'v1/QuickAddClient/get-clientlead-list';
    this.getLeadNextStages = URL + 'v1/ClientWorkflow/get-allnextstages';
    this.getLeadworkflowhierarchy=URL + 'v1/ClientWorkflow/get-workflowhierarchy';
    this.getLeadworkflowList=URL + 'v1/Lead/get-workflow-all';
    this.updateclientAccess = URL + 'v1/QuickAddClient/update-accesspermission';
    this.getclientAccessById= URL + 'v1/QuickAddClient/get-accesspermission-byid';
  /*************************Marketplace EOH API START****************************/
    this.getEOHClientsubscriptionDetails=URL + 'v1/Integrations/get-eoh-share-client-subscription-details';
    this.getEOHContactsubscriptionDetails=URL + 'v1/Integrations/get-eoh-share-contact-subscription-details';
    this.getEOHJobsubscriptionDetails=URL + 'v1/Integrations/get-eoh-share-job-subscription-details';
    this.subscribeEOHClientNotf=URL +'v1/Integrations/enable-eoh-share-client-notifications';
    this.subscribeEOHContactNotf=URL +'v1/Integrations/enable-eoh-share-contact-notifications';
    this.subscribeEOHJobNotf=URL +'v1/Integrations/enable-eoh-share-job-notifications';
    /*************************Marketplace EOH API end****************************/

    /**************************share Client API START ******************************/
    this.getEOHState=URL +'v1/EOHMasterData/eoh-get-state';
    this.getEOHLocationType=URL +'v1/EOHMasterData/eoh-get-locationtype';
    this.getEOHLocationFunc=URL +'v1/EOHMasterData/eoh-get-locationfunction';
    this.getEOHOffice=URL +'v1/EOHMasterData/eoh-get-servicingoffice';
    this.getEOHGrup=URL +'v1/EOHMasterData/eoh-get-group';
    this.getEOHPriority=URL +'v1/EOHMasterData/eoh-get-priority';
    this.getEOHStatus=URL +'v1/EOHMasterData/eoh-get-status';
    this.getEOHClient=URL +'v1/EOHMasterData/eoh-get-client';
    this.shareEOHClient=URL +'v1/EOHClient/eoh-shareclient';
    this.getEOHSharedContactData=URL +'v1/ClientContacts/get-eohsharedcontact-data';
    this.getEOHProfessionalLevel=URL +'v1/EOHMasterData/get-eoh-professionallevel';
    this.pushContactToEOH=URL +'v1/EOHContact/push-contact-to-eoh';
    this.getEOHSyncedClients=URL +'v1/ClientContacts/get-eohsyncedclients';
     /**************************share Client API START ******************************/
    this.checkClientSyncEOH=URL +'v1/QuickAddClient/check-client-synceoh';
    this.getJobQualificationEOH=URL +'v1/EOHMasterData/eoh-get-jobqualification';
    this.getJobShiftTypeEOH=URL +'v1/EOHMasterData/eoh-get-jobshifttype';

  }



  jobApiUrl(URL: string) {
    // this.jobWithoutWorkflow= URL + 'Job/get-job-all-withoutworkflow';
    this.getJobCategoryAll = URL + 'v1/JobCategory/get-jobcategory-all';
    this.createJobCategory = URL + 'v1/JobCategory/create-jobcategory';
    this.updateJobCategoryById = URL + 'v1/JobCategory/update-jobcategory-byid';
    this.deleteJobCategoryById = URL + 'v1/JobCategory/delete-jobcategory-byid';
    this.checkJobCategoryIsExist = URL + 'v1/JobCategory/check-jobcategory-exists';
    this.getSubJobCategoryAll = URL + 'v1/JobSubCategory/get-jobsubcategory-all';
    this.getSubJobCategoryById = URL + 'v1/JobSubCategory/get-jobsubcategory-byid';
    this.createSubJobCategory = URL + 'v1/JobSubCategory/create-jobsubcategory';
    this.updateSubJobCategoryById = URL + 'v1/JobSubCategory/update-jobsubcategory-byid';
    this.deleteSubJobCategoryById = URL + 'v1/JobSubCategory/delete-jobsubcategory-byid';
    this.checkSubJobCategoryIsExist = URL + 'v1/JobSubCategory/check-jobsubcategory-exists';

    this.salaryBandList = URL + 'v1/SalaryBand/get-salaryband-all';
    this.salaryBandById = URL + 'v1/SalaryBand/get-salaryband-byid';
    this.CreateSalaryBand = URL + 'v1/SalaryBand/create-salaryband';
    this.UpdateSalaryBand = URL + 'v1/SalaryBand/update-salaryband';
    this.DeleteSalaryBand = URL + 'v1/SalaryBand/delete-salaryband-byid';
    this.salaryBandDuplicayCheck = URL + 'v1/SalaryBand/get-salaryband-exits';

    this.getJobTypeList = URL + 'v1/JobType/get-jobtype-all';
    this.getJobTypeByID = URL + 'v1/JobType/get-jobtype-byid';
    this.getJobTypeCreate = URL + 'v1/JobType/create-jobtype';
    this.getJobTypeUpdate = URL + 'v1/JobType/update-jobtype-byid';
    this.getdeleteJobType = URL + 'v1/JobType/delete-jobtype-byid';
    this.getJobTypeIsExist = URL + 'v1/JobType/check-jobtype-exists';

    this.getAllJobSubTypeList = URL + 'v1/JobSubType/get-jobsubtype-all';
    this.getdeleteJobsubType = URL + 'v1/JobSubType/delete-jobsubtype-byid';
    this.getJobSubTypeCreate = URL + 'v1/JobSubType/create-jobsubtype';
    this.getJobSubTypeIsExist = URL + 'v1/JobSubType/check-jobsubtype-exists';
    this.getJobSubTypeByID = URL + 'v1/JobSubType/get-jobsubtype-byid';
    this.getJobSubTypeUpdate = URL + 'v1/JobSubType/update-jobsubtype-byid';

    this.tagList = URL + 'v1/JobTag/get-jobtag-all';
    this.deleteTagList = URL + 'v1/JobTag/delete-jobtag-byid';
    this.addTagList = URL + 'v1/JobTag/create-jobtag';
    this.tagListById = URL + 'v1/JobTag/get-jobtag-byid';
    this.updateTagList = URL + 'v1/JobTag/update-jobtag-byid';
    this.duplicayTagName = URL + 'v1/JobTag/check-jobtag-exists';

    this.experienceAllListData = URL + 'v1/Experience/get-experience-all';
    this.createQuickAddJob = URL + 'v1/Job/create-job';

    this.jobWorkFlowCreate = URL + 'v1/JobWorkflow/create-jobworkflow';
    this.jobWorkFlowList = URL + 'v1/JobWorkflow/get-jobworkflow-all';
    this.jobWorkFlowById = URL + 'v1/JobWorkflow/get-jobworkflow-byid';
    this.jobWorkFlowUpdate = URL + 'v1/JobWorkflow/update-jobworkflow-byid';
    this.jobWorkFlowDelete = URL + 'v1/JobWorkflow/delete-jobworkflow-byid';
    this.jobWorkFlowStageIsExists = URL + 'v1/JobWorkflow/check-jobworkflow-stagename-isexist';
    this.jobWorkFlowIsExists = URL + 'v1/JobWorkflow/check-jobworkflow-isexist';
    this.setDefaultWorkflow = URL +'v1/JobWorkflow/update-defaultworkflow';


    this.addexperience = URL + 'v1/Experience/create-experience';
    this.experienceAllList = URL + 'v1/Experience/get-experience-all';
    this.experienceByID = URL + 'v1/Experience/get-experience-byid';
    this.updateexperience = URL + 'v1/Experience/update-experience-byid';
    this.deleteexperience = URL + 'v1/Experience/delete-experience-byid';
    this.experienceExists = URL + 'v1/Experience/check-experience-isexist';

    this.getJobTitleIsExist = URL + 'v1/Job/check-job-titleexists';

    this.getJobBoard = URL + 'v1/JobBoard/get-jobboard-all';
    this.getJobBoardCategory = URL + 'v1/JobBoard/get-jobboard-categories';
    this.getJobboardCategoryItems = URL + 'v1/JobBoard/get-jobboard-category-items';
    this.creatJobBoardConfigue = URL + 'v1/JobBoard/create-jobboard-configuration';
    this.deleteJobBoardConfigueList = URL + 'v1/JobBoard/delete-jobboard-configuration-byid';
    this.getJobBoardConfigurationList = URL + 'v1/JobBoard/get-jobboard-configurations';


    this.jobTemplateList = URL + 'v1/JobTemplate/get-jobtemplate-all';
    this.deleteJobTemplateList = URL + 'v1/JobTemplate/delete-jobtemplate-byid';
    this.addJobTemplateList = URL + 'v1/JobTemplate/create-jobtemplate';
    this.JobTemplateListById = URL + 'v1/JobTemplate/get-jobtemplate-byid';
    this.updateJobTemplateList = URL + 'v1/JobTemplate/update-jobtemplate-byid';
    this.duplicayJobTemplateNameAndTitle = URL + 'v1/JobTemplate/check-jobtemplate-nametitleexists';
    this.jobTemplateListByFilter = URL + 'v1/JobTemplate/get-jobtemplate-all'

    this.jobLandingList = URL + 'v1/Job/get-job-all';
    this.jobLandingWorkflow = URL + 'v1/Job/get-job-workflow-all';
    this.getJobWorkFlowList = URL + 'v1/Job/get-job-workflow-all';
    this.getJobsCount = URL + 'v1/Job/get-jobs-count_v1'; /*-EWM-13230,@who:Nitin Bhati,@When: 02-07-2023, Change API i.e add v1--*/
    this.getJobsCountByWorkFlowId = URL + 'v1/Job/get-jobs-count-byworkflowid';
    this.getJobsCount = URL + 'v1/Job/get-jobs-count_v1'; /*-EWM-13230,@who:Nitin Bhati,@When: 02-07-2023, Change API i.e add v1--*/
    this.updateRemoveReason = URL + 'v1/RemoveReason/update';
    this.createRemoveReason = URL + 'v1/RemoveReason/create';
    this.deleteRemoveReason = URL + 'v1/RemoveReason/delete-remove-reason-byid';
    this.getRemoveReasonById = URL + 'v1/RemoveReason/get-removereason-byid';
    this.checkDuplicityofremoveReason = URL + 'v1/RemoveReason/check-duplicate-reason';
    this.jobWithoutWorkflow = URL + 'v1/Job/get-job-all-withoutworkflow';
    this.jobWithoutWorkflowfilter = URL + 'v1/Job/get-job-all-withoutworkflowfilter';
    this.quickJobListByJobId = URL + 'v1/Job/get-job-byid',
    this.removeCandidate = URL + 'v1/RemoveCandidate/removecandidate',
    this.getAllNextStages = URL + 'v1/JobWorkflow/get-allnextstages_v2';

    // this.getCandidatemappedtojobcardAll = URL + 'CandidateMappedJob/get-candidatemappedtojobcard-all';
    this.removeCandidate = URL + 'v1/RemoveCandidate/removecandidate'
    this.candidateMappedJobHeader = URL + 'v1/CandidateMappedJob/get-candidatemappedjob-header';

    this.quickJobListByJobId = URL + 'v1/Job/get-job-byid';
    this.removeCandidate = URL + 'v1/RemoveCandidate/removecandidate';
    this.updateJobMappingTagList = URL + 'v1/JobTag/update';

    //this.candidateMappedJobHeaderCount = URL + 'CandidateMappedJob/get-candidatemappedjob-headercount';
    this.candidateMappedJobHeaderTags = URL + 'v1/CandidateMappedJob/get-candidatemappedjob-headertags';

    this.getJobNotMappedToCandidateAll = URL + 'v1/JobMappedCandidate/get-job-notmappedtocandidate-all';

    this.getJobMappedToCandidateAll = URL + 'v1/JobMappedCandidate/get-jobmappedtocandidate-all';


    this.getJobMappedToCandidateAll = URL + 'v1/JobMappedCandidate/get-jobmappedtocandidate-all';
    this.getJobMappedToCandidateAllForSearch = URL + 'v1/JobMappedCandidate/get-jobtitile-search';
    this.unassignJobFromCandidate = URL + 'v1/RemoveCandidate/unassigncandidate';

    this.updateQuickAddJob = URL + 'v1/Job/update-job';

    this.getJobListByClientId = URL + 'v1/Job/get-clientjob-all';
    this.getJobCount = URL + 'v1/Job/get-clientjobs-count';
    this.getPostingseekDetails = URL + 'v1/Job/get-posting-seekdetail';

    this.getAllJobForActivity = URL + 'v1/Job/get-job-all-withoutworkflow';
    this.getPostedJobdetailsByid = URL + 'v1/Job/get-postedjobdetails-byid';
    this.getJobdetailsByid = URL + 'v1/Job/get-jobdetails-byid';
    this.jobFilterNoteByYear = URL + 'v1/JobNotes/jobnotes-byyearfilter';
    this.getNotesCountBymonth = URL + 'v1/JobNotes/get-notescount-bymonth';
    this.jobnotesByYearfilter = URL + 'v1/JobNotes/jobnotes-byyearfilter';
    this.createJobNotes = URL + 'v1/JobNotes/create';
    this.updateJobNotes = URL + 'v1/JobNotes/update';
    this.deleteJobNotesById = URL + 'v1/JobNotes/delete-jobnotes-byid';
    this.getJobNotesById = URL + 'v1/JobNotes/get-jobnotes-byid';
    this.getJobNotesByJobId = URL + 'v1/JobNotes/get-jobnotescount-byjobid';
    this.JobNotesCount = URL + 'v1/JobNotes/get-jobnotes-count';
    this.getCareerPageAll = URL + 'v1/CareerPage/get-careerpagelanding-all';
    this.createCareerPage = URL + 'v1/CareerPage/create';
    this.checkCareerPageDuplicacy = URL + 'v1/CareerPage/check-duplicate-careerpage';
    this.updateCareerPage = URL + 'v1/CareerPage/update';
    this.getByIdCareerPage = URL + 'v1/CareerPage/get-careerpagedeatils-byid';
    this.deleteCareerPage = URL + 'v1/CareerPage/delete';
    this.createNetworkPage = URL + 'v1/CareerPage/configure-socialprofile';
    this.getActiveJobAll = URL + 'v1/Job/get-activejob-all';
    this.getApplicationFormAll = URL + 'v1/ApplicationFrom/get-applicationform-all';
    this.updateIsDefault = URL + 'v1/ApplicationFrom/update-isdefault';
    this.createWelcomePage = URL + 'v1/ApplicationFrom/create-welcomepage';
    this.getWelcomeFormData = URL + 'v1/ApplicationFrom/get-welcomepage-byid';
    this.sendOtp = URL + 'v1/ApplicationFrom/send-otp';
    this.applicationDuplicacy = URL + 'v1/ApplicationFrom/check-applicationform';
    this.createApplicationForm = URL + 'v1/ApplicationFrom/create';
    this.getByIdApplicationForm = URL + 'v1/ApplicationFrom/get-applicationformdeatils-byid';
    this.createPersonalInfoPage = URL + 'v1/ApplicationFrom/configure-personalinfo';
    this.fetchPersonalInfoById = URL + 'v1/ApplicationFrom/get-personalinfo-byid';
    this.createKnockoutQuestion = URL + 'v1/ApplicationKnockoutQuestion/create';
    this.getKnockoutQuestionById = URL + 'v1/ApplicationKnockoutQuestion/get-knockoutquestion-byid';
    this.getKnockoutQuestionAll = URL + 'v1/ApplicationKnockoutQuestion/get-knockoutquestion-all';
    this.deleteKnockoutQuestionById = URL + 'v1/ApplicationKnockoutQuestion/delete';
    this.updateKnockoutQuestion = URL + 'v1/ApplicationKnockoutQuestion/Update';
    this.getFormDocumnetPage = URL + 'v1/ApplicationFrom/get-formdocument-all';
    this.checkKnockoutQuestion = URL + 'v1/ApplicationKnockoutQuestion/check-application-question';
    this.createDocumentPage = URL + 'v1/ApplicationFrom/configure-document';
    this.applicationConfigStepById = URL + 'v1/ApplicationFrom/get-applicationformconfiguration-byid';
    this.getAppformConfigById = URL + 'v1/ApplicationFrom/get-applicationformconfiguration-byid';
    this.createApplicationformConfiguration = URL + 'v1/ApplicationFrom/applicationform-configuration';
    this.cloneApplicationForm = URL + 'v1/ApplicationFrom/clone';
    this.getapplicationFormMappingToJob = URL + 'v1/Job/get-applicationformmappedtojob-all';
    this.updateapplicationFormMappingToJob = URL + 'v1/Job/applicationjob-mapping';
    this.jobpublisheddetails = URL + 'v1/JobMappedCandidate/get-jobpublisheddetails';
    this.getCandidateJobFilterCount = URL + 'v1/Job/get-jobs-count-byworkflowid';
    //this.checkCandidateExists = URL + 'ApplicationFrom/check-candidate';
    this.saveApplicationPreview = URL + 'v1/ApplicationFrom/preview';
    this.candidatePersonalInfo = URL + 'v1/ApplicationFrom/get-candidate-personalinfo';
    this.candidateKnockoutInfo = URL + 'v1/ApplicationFrom/get-candidate-knockout';
    this.candidateDocumentInfo = URL + 'v1/ApplicationFrom/get-candidate-documents';
    this.sharejobapplicationurl = URL + 'v1/CandidateMappedJob/share-jobapplicationurl';
    this.createJobCallLog = URL + 'v1/CandidateMappedJob/create-calllog';

    this.getCandidateEmailAndPhone = URL + 'v1/CandidateMappedJob/get-candidatemappedjob-header-details';
    this.getActiveJobAllWithJobId = URL + 'v1/Job/get-jobdetails-byjobid';
    this.createThankYouInfo = URL + 'v1/ApplicationFrom/create-thankyoupage';
    this.getThankYouInfo = URL + 'v1/ApplicationFrom/get-thankyoupage-byid';
    this.jobHeaderDetails = URL + 'v1/CandidateMappedJob/get-jobheader-details';
    this.sectionUpdate = URL + 'v1/ApplicationFrom/update-sectiontitle';
    this.checkSection = URL + 'v1/ApplicationFrom/check-sectiontitle';
    this.getAppChartCandidate = URL + 'v1/JobMappedCandidate/get-jobdetailswithapplicationchart';

    this.candidateJobAction = URL + 'v1/ApplicationFrom/get-candidate-jobactions';
    this.getDownloadApplicationForm = URL + 'v1/ApplicationFrom/download-application-form-by-jobid';
    this.getImportantsLinksAll = URL + 'v1/ApplicationFrom/get-importantlinks';
    this.createUpdateImportantsLinksAll = URL + 'v1/ApplicationFrom/configure-importantlinks';
    this.updateMapChecklistWorkflowstage = URL + 'v1/JobWorkflow/map-checklist-workflowstage';
    this.configureRule = URL + 'v1/ApplicationFrom/configure-rule';
    this.getConfigureRule = URL + 'v1/ApplicationFrom/get-configure-rule';
    this.getConfigureRuleTemplate = URL + 'v1/ApplicationFrom/get-configure-rule-template';
    this.getJobPostingDetailByID = URL + "v1/JobMappedCandidate/get-jobpostingdetails";
    this.shareAssessment = URL + "v1/ApplicationFrom/share-assessment";
    this.getShareAssessment = URL + "v1/ApplicationFrom/get-share-assessment";
    this.xeopleSearchJob = URL + "v1/Job/get-xeoplesearchjob-details";
    this.getUserDashboardjob = URL + "v1/Job/get-userdashboardjob";
    this.getJobDetails = URL + "v1/Job/get-postingjob-details";
    this.jobScreeningHeader = URL + "v1/JobAction/get-headerdeatils-byid";
    this.jobactivityChecklistCount = URL + "v1/JobAction/get-activitychecklist-count";
    this.getApplicationFormByJobId = URL + 'v1/ApplicationFrom/get-application-form-by-jobid'
    this.getReasonByShortDesc = URL + 'v1/Status/get-statusreason-byshortdescription';
    /*--@why:EWM-12617,@When:01-06-2023,@who:Nitin Bhati,@what: move api core to job--*/
    this.getChecklistDetails = URL + 'v1/ChecklistMaster/get-checklist-details-byid';
    this.updateChecklistInfo = URL + 'v1/ChecklistMaster/update-checklist-details-byid';
    this.downloadCheckList = URL + 'v1/ChecklistMaster/download-checklist';
    this.getCheckListAll = URL + 'v1/ChecklistMaster/get-checklist-all';
    this.getCheckListById = URL + 'v1/ChecklistMaster/get-checklist-byid';
    this.getCheckListGroupById = URL + 'v1/ChecklistMaster/get-groupchecklist-byid';
    this.createChecklist = URL + 'v1/ChecklistMaster/create';
    this.createChecklistGroup = URL + 'v1/ChecklistMaster/create-group';
    this.updateChecklist = URL + 'v1/ChecklistMaster/update-checklist';
    this.updateChecklistGroup = URL + 'v1/ChecklistMaster/update-groupchecklist';
    this.deleteChecklist = URL + 'v1/ChecklistMaster/delete-checklist';
    this.checkUniqueQuestions = URL + 'v1/ChecklistMaster/check-unique-question';
    this.checkUniqueChecklist = URL + 'v1/ChecklistMaster/check-unique-checklist';
    this.checkUniqueGroupList = URL + 'v1/ChecklistMaster/check-unique-checklistgroup';
    this.groupCheckListAll = URL + 'v1/ChecklistMaster/get-group-checklist-all';
    this.getJobBoardsPublishedDetails = URL + 'v1/JobBoard/get-jobboard-published-details';
    this.getAllNextStagesv2 = URL + 'v1/JobWorkflow/get-allnextstages_v2';
    this.getJobActionNotesDate = URL + 'v1/JobNotes/get-jobaction-notes';
    this.getJobActionNotesCount = URL + 'v1/JobNotes/get-jobaction-notes-count';
    this.checkWorkflowMapping=URL + 'v1/JobWorkflow/check-workflow-mapping';
    this.intervewJobCount=URL + 'v1/Job/get-jobs-count-byworkflowid';
    this.createJob_V2_Notes = URL + 'v2/JobNotes/create';
    this.getAllJobForActivityV2 = URL + 'v1/Job/get-job-all-withoutworkflowv2';
    this.GETworkflowhierarchy=URL + 'v1/CandidateMappedJob/get-workflowhierarchy';
    this.candidateJobAction_v2 = URL + 'v2/ApplicationFrom/get-candidate-jobactions';
    this.updateJobStatus = URL + 'v1/Job/update-job-status-reason';
    this.jobWithoutWorkflowV3 = URL + 'v1/Job/get-job-all-withoutworkflowv3';
    this.removeCandidateV2 = URL + 'v1/RemoveCandidate/removecandidate-v2';
    this.updateJobLocation = URL + 'v1/Job/update-job-location';
    this.getJobdetailsByidV2 = URL + 'v1/Job/get-jobdetails-byid-v2';
    this.getPostingIndeedDetails = URL + 'v1/Job/get-posting-indeeddetail';
    this.updateJobExpiry = URL+ 'v1/Job/update-job-expiry-days';
   // this.jobLandingkendoList = URL + 'v1/Job/get-job-all_v3';
    this.getJobCategoryById = URL + 'v1/JobCategory/get-jobcategory-byid';
    this.getRedirectedJobNotebyid = URL + 'v1/JobNotes/get-redirectedjobnote-byid';
    this.getAllJobWorkFlowList = URL + 'v1/JobWorkflow/get-jobworkflow-all';
    this.getJobNoteContactByJobId = URL + 'v1/Job/get-job-note-contacts-by-jobid';
    this.createQuickAddJob_v2 = URL + 'v2/Job/create-job';
    this.quickJobListByJobId_v2 = URL + 'v2/Job/get-job-byid';
    this.updateQuickAddJob_v2 = URL + 'v2/Job/update-job';
    this.getjobactionconfiguration = URL + "v1/JobAction/get-jobactionconfiguration";
    this.getJobActiontenantConfiguration = URL + 'v1/JobAction/get-jobactiontenant-configuration';
    this.updateJobActionNameandDisplay = URL + 'v1/JobAction/update-nameanddisplay';
    this.updateJobActionStageTypeMapping = URL + 'v1/JobAction/update-stagetypemapping';
    this.updateJobActionDisplaySequence = URL + 'v1/JobAction/update-tabsequence';
  	this.createQuickAddJob_v2 = URL + 'v2/Job/create-job';
    this.quickJobListByJobId_v2 = URL + 'v2/Job/get-job-byid';
    this.updateQuickAddJob_v2 = URL + 'v2/Job/update-job';
    this.createShareableLinkWithName = URL +'v1/CandidateMappedJob/share-jobapplicationurl-with-recipient-name';
    this.shareJobEOH = URL +'v1/Job/eoh-sharejob';
  }

  candidateApiUrl(URL: string) {
    this.CandidateMappedJobAsignJobV2 = URL + 'v2/CandidateMappedJob/map-candidates-with-jobs';
    this.CandidateMappedJobAsignJob = URL + 'v1/CandidateMappedJob/map-candidates-with-jobs';
    this.scoreTypeList = URL + 'v1/ScoreType/get-scoretype-all';
    this.degreeTypeList = URL + 'v1/DegreeType/get-degreetype-all';
    this.scoreTypeCreate = URL + 'v1/ScoreType/create-scoretype';
    this.scoreTypeUpdate = URL + 'v1/ScoreType/update-scoretype-byid';
    this.scoreTypeDelete = URL + 'v1/ScoreType/delete-scoretype-byid';
    this.scoreTypeDuplicate = URL + 'v1/ScoreType/check-scoretype-exists';
    this.scoreTypeByID = URL + 'v1/ScoreType/get-scoretype-byid';
   // this.getCandidateList = URL + 'Candidate/get-candidate-all';
    this.generalInformationList = URL + 'v1/GeneralInformation/get-generalinformation-all';
    this.updateGeneralInformation = URL + 'v1/GeneralInformation/update-generalinformation';
    this.getCandidateResumeById = URL + 'v1/CandidateResume/get-candidateresume-byId';
    this.uploadCandidateResume = URL + 'v1/CandidateResume/upload';
    this.getCandidateSummary = URL + 'v1/Candidate/get-candidate-summary';
    this.getCandidateSocialProfile = URL + 'v1/Candidate/get-candidate-socialprofiledetails';
    this.getCandidateNoteAll = URL + 'v1/CandidateNote/get-candidatenote-all';
    this.createCandidateNote = URL + 'v1/CandidateNote/create';
    this.updateCandidateNote = URL + 'v1/CandidateNote/update';
    this.deleteCandidateNote = URL + 'v1/CandidateNote/delete-note-byid';
    this.deleteCandidateNoteCandidateId = URL + 'v1/CandidateNote/delete-note-candidateid';
    this.updateCandidateImage = URL + 'v1/Candidate/update-candidate-imageurl';
    this.createCandidate = URL + 'v1/Candidate/create-candidate';
    this.candidateNotesBycandidateId = URL + 'v1/CandidateNote/get-candidatenotescount-bycandidateid';
    this.candidateFilterNoteByYear = URL + 'v1/CandidateNote/candidatenote-byyearfilter';
    this.candidateNoteCount = URL + 'v1/CandidateNote/get-candidatenote-count';
    this.candidateNoteDelete = URL + 'v1/CandidateNote/delete-note-candidateid';
    this.candidateNoteById = URL + 'v1/CandidateNote/get-candidatenote-byid';

    this.deleteCanEmpById = URL + 'v1/CandidateNote/delete-note-byid';


    this.getCandidateAdressAll = URL + 'v1/Address/get-address-all';
    this.getCandidateAdressById = URL + 'v1/Address/get-address-byid';
    this.createCandidateAdress = URL + 'v1/Address/create-address';
    this.deleteCandidateAdress = URL + 'v1/Address/delete-address-byid';
    this.updateCandidateAdress = URL + 'v1/Address/update-address';
    this.checkAdressTypeIsExists = URL + 'v1/Address/check-address-locationtype';

    this.getCandidateEducationAll = URL + 'v1/CandidateEducation/get-candidateeducation-all';
    this.createCandidateEducation = URL + 'v1/CandidateEducation/create-candidateeducation';
    this.updateCandidateEducation = URL + 'v1/CandidateEducation/update-candidateeducation';
    this.deleteCandidateEducation = URL + 'v1/CandidateEducation/delete-candidateeducation-byid';
    this.getCandidateEducationById = URL + 'v1/CandidateEducation/get-candidateeducation-byid';
    this.checkCandidateEducationExist = URL + 'v1/CandidateEducation/check-candidateeducation-exists';
    this.getAllSkills = URL + 'v1/CandidateSkills/get-candidateskills-all';
    this.addSkills = URL + 'v1/CandidateSkills/create-candidateskills';
    this.updateSkills = URL + 'v1/CandidateSkills/update-candidateskills';

    this.candidateMappingTagList = URL + 'v1/MappingCandidateTag/get-mappingcandidatetag-all';
    this.CandidateMappingTagList = URL + 'v1/MappingCandidateTag/update';

    this.getEmergencyContactList = URL + 'v1/EmergencyContacts/get-emergencycontacts-all';
    this.getEmergencyContactById = URL + 'v1/EmergencyContacts/get-emergencycontacts-byid';
    this.createEmergencyContact = URL + 'v1/EmergencyContacts/create-emergencycontacts';
    this.EmergencyContactUpdate = URL + 'v1/EmergencyContacts/update-emergencycontacts-byid';
    this.EmergencyContactDelete = URL + 'v1/EmergencyContacts/delete-emergencycontacts-byid';
    this.candidateExperienceAllList = URL + 'v1/Experience/get-experience-all';
    this.candidateExperienceById = URL + 'v1/Experience/get-experience-byid';
    this.candidateExperienceCreate = URL + 'v1/Experience/create-experience';
    this.candidateExperienceUpdate = URL + 'v1/Experience/update-experience-byid';
    this.candidateExperienceDelete = URL + 'v1/Experience/delete-experience-byid';
    this.degreeTypeById = URL + 'v1/DegreeType/get-degreetype-byid';
    this.degreeTypeCreate = URL + 'v1/DegreeType/create-degreetype';
    this.degreeTypeUpdate = URL + 'v1/DegreeType/update-degreetype-byid';
    this.degreeTypeDelete = URL + 'v1/DegreeType/delete-degreetype-byid';
    this.degreeTypeDuplicate = URL + 'v1/DegreeType/check-degreetype-exists';
    this.getCandidateDependentAll = URL + 'v1/CandidateDependent/get-candidatedependent-all';
    this.createCandidateDependent = URL + 'v1/CandidateDependent/create-candidatedependent';
    this.updateCandidateDependent = URL + 'v1/CandidateDependent/update-candidatedependent';
    this.deleteCandidateDependent = URL + 'v1/CandidateDependent/delete-candidatedependent-byid';
    this.getCandidateDependentById = URL + 'v1/CandidateDependent/get-candidatedependent-byid';
    this.checkCandidateDependentExist = URL + 'v1/CandidateDependent/check-candidatedependent-exists';
    this.candidateFolderAllList = URL + 'v1/FilterFolder/get-filterfolder-all';
    this.candidateFolderById = URL + 'v1/FilterFolder/get-filterfolder-byid';
    this.candidateFolderCreate = URL + 'v1/FilterFolder/create';
    this.candidateFolderUpdate = URL + 'v1/FilterFolder/update';
    this.candidateFolderDelete = URL + 'v1/FilterFolder/delete-filterfolder-byid';

    this.getCandidateMapToFolder = URL + 'v1/FilterFolder/get-candidatefolder-mappedlist';
    this.mapCandidateToFolderUpdate = URL + 'v1/FilterFolder/mappcandidatetofolder';
    this.candidateFilterFolderList = URL + 'v1/FilterFolder/get-candidatefolder';

    this.AllAdditionalInfoData = URL + 'v1/CandidateAdditionalInformation/get-candidateadditionalinformation-all';
    this.UpdateAdditionalInfoData = URL + 'v1/CandidateAdditionalInformation/update';
    this.CreateAdditionalInfoData = URL + 'v1/CandidateAdditionalInformation/create-candidateadditionalinformation';

    this.deleteAdditionalInfoData = URL + 'v1/CandidateAdditionalInformation/delete';

    this.candidateInfoDelete = URL + 'v1/Candidate/delete-candidate-byid';

    this.getCandidateTagAll = URL + 'v1/CandidateTag/get-candidatetag-all';
    this.getCandidateTagById = URL + 'v1/CandidateTag/get-candidatetag-byid';
    this.createCandidatetag = URL + 'v1/CandidateTag/create-candidatetag';
    this.updateCandidateTag = URL + 'v1/CandidateTag/update-candidatetag';
    this.deleteCandidateTag = URL + 'v1/CandidateTag/delete-candidatetag-byid';
    this.checkCandidatetagIsexist = URL + 'v1/CandidateTag/check-candidatetag-isexist';
    this.checkCandidateskillsExists = URL + 'v1/CandidateSkills/check-candidateskills-exists';
    this.getCandidateDesignationList = URL + 'v1/Experience/get-alldesignation';
    this.getAllEmployee = URL + 'v1/Candidate/get-employee-all';

    this.getCanDesignationList = URL + 'v1/Experience/get-designationlist';
    this.getEmployeeDesignation = URL + 'v1/Experience/get-designationlist';
    this.createCandidateSkills = URL + 'v1/CandidateSkills/create-candidateskills';
    this.updateCandidateSkills = URL + 'v1/CandidateSkills/update-candidateskills';
    this.deleteCandidateSkillsById = URL + 'v1/CandidateSkills/delete-candidateskills-byid';
    this.getCandidateSkillsAll = URL + 'v1/CandidateSkills/get-candidateskills-all';
    this.getCandidateSkillsById = URL + 'v1/CandidateSkills/get-candidateskills-byid';

    this.getAllCandidateForActivity = URL + 'v1/Candidate/get-candidate-list';
    this.getAllCandidateForActivity_v2 = URL + 'v2/Candidate/get-candidate-list';
    this.getAllEmployeeForActivity = URL + 'v1/Candidate/get-employee-list';
    this.getAllEmployeeForActivity_v2 = URL + 'v2/Candidate/get-employee-list';

    this.candidatePhoneNo = URL + 'v1/Candidate/get-candidatename-byphonenumber';
    this.sendgdprrequest = URL + 'v1/Candidate/sendgdprrequest';
    this.getFolderCount = URL + 'v1/FilterFolder/get-candidatefolder-mappedcount'
    this.getCandidateStatus = URL + 'v1/Candidate/get-candidatestatus-list';
    this.updateCandidateStatus = URL + 'v1/Candidate/update-candidatestatus';
    this.getCoverLetterAll = URL + 'v1/CoverLetter/get-coverletter-all';
    this.getCoverLetterDetailsById = URL + 'v1/CoverLetter/get-coverletter-details';
    this.getCoverPageVersionHistory = URL + 'v1/CoverLetter/get-version-history';
    this.createCoverLetter = URL + 'v1/CoverLetter/create';
    this.deleteCoverLetter = URL + 'v1/CoverLetter/delete';
    this.renameCoverLetter = URL + 'v1/CoverLetter/rename';
    this.checkDuplicateCoverLetter = URL + 'v1/CoverLetter/check-coverletter-isexist';
    this.candidateDetails = URL + 'v1/Candidate/get-candidate-details';
    this.getCandidateResumeLatestById = URL + 'v1/CandidateResume/get-candidatelatestresume-byId'
    this.JobMappedCandidate = URL + 'v1/JobMappedCandidate/get-jobdetailswithapplicationchart';
    this.JobNotesCandidate = URL + 'v1/CandidateNote/get-jobaction-noteactivity';
    this.checkEmergencycontactsRelationship = URL + 'v1/EmergencyContacts/check-emergencycontacts-relationship';
    this.candidateNotMappedToJobList = URL + 'v2/CandidateMappedJob/get-candidate-notmappedtojob-all';
    this.getAllCandidateJobMapping = URL + 'v2/CandidateMappedJob/get-candidatemappedtojob-all';


    this.updateCandiateRank = URL + 'v1/JobMappedCandidate/update-candidaterank';
    this.getAssignJobCount = URL + 'v1/JobMappedCandidate/get-jobmappedtocandidate-count';
    this.getJobsummaryHeaderSourcepichart = URL + 'v1/CandidateMappedJob/get-jobsummary-header-sourcepichart';
    this.getCandidatemappedBulkemail = URL + 'v1/CandidateMappedJob/get-candidatemapped-bulkemail';
    this.getCandidateMappedPhone = URL + 'v1/CandidateMappedJob/get-candidatemapped-phones';
    this.jobworkFlowBypipeId = URL + 'v1/CandidateMappedJob/get-jobworkflow-includejobpipeline-byid';
    this.jobworkFlowBypipeIdV2 = URL + 'v2/CandidateMappedJob/get-jobworkflow-includejobpipeline-byid';
    this.jobworkFlowChildById = URL + 'v1/CandidateMappedJob/get-jobworkflow-child-byid';
    this.candidateNotMappedToJobCreate = URL + 'v2/CandidateMappedJob/create';
    this.candidateMoveAction = URL + 'v2/CandidateMove/candidatemoveaction';
    this.JobMappedToCandidate = URL + 'v2/JobMappedCandidate/create';
    this.getCandidatemappedtojobcardAll = URL + 'v2/CandidateMappedJob/get-candidatemappedtojobcard-all';
    this.getCandidatemappedtojobcardAllV2 =URL+'v2/CandidateMappedJob/get-candidatemappedtojobcard-all_v2';
    this.checkCandidateExists = URL + 'v1/CandidateMappedJob/check-candidate';
    this.getCandidateMappedtoJobTimelines = URL + 'v1/CandidateMappedJob/get-candidatemappedtojob-timelines';
    this.gettimelineData = URL + 'v1/CandidateMappedJob/get-candidatemappedtojob-timelines';
    this.getCandidateMappedtoallJobTimelines = URL + 'v1/CandidateMappedJob/get-candidatemappedtoalljob-timelines';
    this.getcandidateall = URL + 'v1/Candidate/getcandidateall';
    this.CandidateAlljobTimeLine = URL + 'v1/CandidateMappedJob/get-candidatealljob-timelines';
    this.CandidateJobCount = URL + 'v1/CandidateMappedJob/get-mappedcandidatecount-byworkflowid';
    this.getUserdashboardCandidate = URL + 'v1/Candidate/get-userdashboardcandidate';
    this.candidateResumeCoverLetter = URL + 'v2/Candidate/get-candidate-resumecoverletter';
    this.canidateMappedFoldersDetails = URL + 'v1/FilterFolder/candidate-mapped-folders-details';

    this.hideWorkflowStage = URL + 'v1/CandidateMappedJob/save-stage-visibility';
    this.checkCandidateMoveAction = URL + 'v2/CandidateMove/check-candidatemoveaction';

    this.saveJobActionStatus = URL + 'v2/CandidateMove/save-action-status';
    this.jobCandidateMappedAll = URL + 'v2/CandidateMappedJob/get-mappedjobcandidate-all';
    this.getJobActionComments=URL + 'v1/CandidateJobComments/get-comments';
    this.updateJobActionComments=URL + 'v1/CandidateJobComments/update-comments';
    this.addJobActionComments=URL + 'v1/CandidateJobComments/create-comments';
    this.deleteJobActionComments=URL + 'v1/CandidateJobComments/delete-comments';
    this.getJobActionRecuirters=URL + 'v1/CandidateJobComments/get-recuirters';
    this.cvParsedCount=URL + 'v1/Candidate/get-cvparsedcandidate-count';
    this.candProfileReadUnread=URL + 'v1/CandidateMappedJob/update-profileread';
    this.candProfileReadUnreadV2=URL + 'v2/CandidateMappedJob/update-profileread';
    // @suika @EWM-13719 @whn-08-08-2023 change social profile url core to candidate
    this.socialProfileListMaster = URL + 'v1/SocialProfile/get-socialprofile-all';
    this.socialProfileById = URL + 'v1/SocialProfile/get-socialprofile-byid';
    this.socialProfileDeleteMaster = URL + 'v1/SocialProfile/delete-socialprofile-byid';
    this.socialProfileEditMaster = URL + 'v1/SocialProfile/update-socialprofile';
    this.socialProfileAddMaster = URL + 'v1/SocialProfile/create-socialprofile';
    this.duplicaySocialProfileName = URL + 'v1/SocialProfile/check-socialprofile-availability';
    this.Candidatecountbyworkflowid_v1 = URL + 'v1/CandidateMappedJob/get-candidatecount-byworkflowid_v1';
    this.XeopleMapToFolder = URL + 'v2/FilterFolder/get-candidatefolder-mappedlist';
    this.xeopleExtractMembers = URL + 'v1/EOHCandidate/extract-create-eoh-candidates';
    this.pinUnpinCandidate = URL + 'v2/CandidateMappedJob/pin-unpin';
    this.getAllSelectedCandidates = URL + 'v1/CandidateMappedJob/get-candidatelist-bystages';
    this.closeJob = URL + 'v1/CandidateMappedJob/close-job';
    this.disLikeCandidate = URL + 'v2/CandidateMappedJob/dislike';
    this.likeCandidate = URL + 'v2/CandidateMappedJob/like';
    this.xeoplePushMembers = URL + 'v1/EOHCandidate/send-eoh-pushjob-notification';
    this.getAllEmployeeListV2 = URL + 'v2/Candidate/get-employee-all';
    this.applicantList = URL + 'v2/Candidate/get-candidate-all';
    this.applicantProfileUpdate = URL + 'v1/CandidateMappedJob/update-applicant-profile';
    this.getAllEmployeeListV3 = URL + 'v1/Candidate/get-employee-all-v3';
    this.getTitleMaster = URL + 'v1/TitleMaster/get-eoh-candidate-title-all';
    this.getCandidateInfoById=URL + 'v1/EOHCandidate/get-candidate-information-byid';
    this.pushCandidateToEOH=URL + 'v1/EOHCandidate/push-candidate-to-eoh';
    this.pushCandidateToEOHV2=URL + 'v1/EOHCandidate/push-candidate-to-eoh-v2';
    this.getIndustryList=URL+'v1/EOHMasterData/get-industry-list';
    this.getQualificationList=URL+'v1/EOHMasterData/get-qualifications-list'; 
    this.getOfficeList=URL+'v1/EOHMasterData/get-office-list';
    this.candidatenoteByYearfilterByid = URL + 'v1/CandidateNote/get-redirectedcandidatenote-byid';
    this.getCanidateTimelineCount = URL + 'v1/CandidateMappedJob/get-candidate-timelines-count';
    this.getCandidateSourceListURL = URL + 'v1/CandidateSource/get-candidate-source-all';
    this.getCandidateSourceByIdURL=URL + 'v1/CandidateSource/get-candidate-source-by-sourceId';
    this.updateCandidateSourceURL=URL + 'v1/CandidateSource/update-candidate-source';
    this.getRecruiterEOHList=URL + 'v1/EOHMasterData/get-recruiter-list';
    this.getTempEmailList=URL + 'v1/EOHMasterData/get-email-template-list';
    this.getScreeningInterviewStatus=URL + 'v1/CandidateMappedJob/get-candidate-screeninginterview-status';
    this.getEOHTempEmailList=URL + 'v1/EOHMasterData/get-email-template-list';
    this.CandidateStatusUpdate = URL + 'v2/Candidate/update-candidatestatus';
    this.fetchEohNotesAll = URL+'v1/CandidateNote/get-candidatescreeningnotes-byjob';
    this.getCandidateSourceDefaultStatus = URL+'v1/CandidateSource/get-candidate-source-default-status';
    this.totalCandidateForJobLandingPage = URL + 'v1/Candidate/get-totalcandidatecount-byworkflow';
    this.candidateVxtCreateCall = URL + 'v1/Call/create-call';
    this.getVxtLastCallDetails = URL + 'v1/Call/get-lastcall-details';
    this.getVxtCandidateListCallDetails = URL + 'v1/Call/get-call-grid-detail-all';
    this.getVxtCandidateListCallDetailsById = URL + 'v1/Call/get-call-details-byid';
    this.candidateVxtUpdateCall = URL + 'v1/Call/update-call';
    this.candidateVxtDeleteCall = URL + 'v1/Call/delete-call-details-byid';
    this.countVxtCall = URL + 'v1/Call/get-count-call-details';
    this.createCandidateSourceURL=URL + 'v1/CandidateSource/create-candidate-source';
    this.getCandidateChildSourceListURL = URL + 'v1/CandidateSource/get-child_candidate-source-all';
    this.getCandidateSourceDeleteURL = URL + 'v1/CandidateSource/delete-candidate-source-byid';
    /**************Eoh Search api start*****************************/
    this.getXSearchTagData = URL + 'v1/EOHMasterData/get-x-search-tag-data';
      this.getXSearchCardList = URL + 'v1/EOHMasterData/get-x-talent-search-short';
      this.getXSearchCardProfilePic = URL + 'v1/EOHMasterData/get-x-talent-search-profile-picture';
      this.getXSearchCardSelected = URL + 'v1/EOHMasterData/get-x-talent-search-long';
      this.eohSendpushNotification =URL + 'v1/EOHMasterData/send-push-notification';
      this.getXSearchCardResumeUrl =URL + 'v1/EOHMasterData/get-document-url';
    /**************Eoh Search api End*****************************/
    this.getMemberPriorityList =URL + 'v1/EOHMasterData/get-memberpriority-list';
    this.getEmploymentTypeList =URL + 'v1/EOHMasterData/get-employmenttype-list'; 
    this.checkCandidateSyncEOH = URL+'v1/Candidate/check-candidate-synceoh';
    this.pushCandidateToEOHV2Member = URL + 'v1/EOHCandidate/push-member';
    this.vxtcallStatus = URL + 'v1/Call/get-call-status-details';
  }

  /*
    @Type: File, <ts>p
    @Name: emailApiUrl
    @Who: Renu
    @When: 15-09-2021
    @Why: ROAST-2716
    @What: set All url for Email
    */
  emailApiUrl(URL: string) {

    this.getEmailIntegrationNew = URL + 'v1/MailConfiguration/configure';
    this.emailConfigure = URL + 'v1/Office/configure';
    this.emailInboxDetails = URL + 'v1/UserMail/inbox-detail';
    this.emailInbox = URL + 'v1/UserMail/inbox';
    this.getDraftMail = URL + 'v1/UserDraftMail/draft';
    this.createDraftMail = URL + 'v1/UserDraftMail/create';
    this.updateDraftMailById = URL + 'v1/UserDraftMail/update';
    this.deleteDraftMailById = URL + 'v1/UserDraftMail/delete';
    this.getMailCount = URL + 'v1/UserMail/mailcount';
    this.emailDownloadAttachement = URL + 'v1/UserMail/attachment';
    this.markAsImportant = URL + 'v1/UserMail/favourite';
    this.markAsisread = URL + 'v1/UserMail/isread';
    this.markAsunread = URL + 'v1/UserMail/isreadunread';
    this.mailSend = URL + 'v1/UserMail/send';
    this.emailSent = URL + 'v1/UserMail/sentbox';
    this.emailDraftDetail = URL + 'v1/UserDraftMail/draft-detail';
    this.emailfavouriteList = URL + 'v1/UserMail/favouritemails';
    this.candidateInbox = URL + 'v1/UserMail/candidate-inbox';
    this.candidateMailCount = URL + 'v1/UserMail/candidate-mailcount';
    this.bulkEmail = URL + 'v1/UserMail/bulkemail';
    this.getUserdashboardMyInbox = URL + 'v1/UserMail/get-userdashboardmail';
    this.candidateInboxV2 = URL + 'v1/UserMail/candidate-inbox-v2';
    this.candidateMailCountV2 = URL + 'v1/UserMail/candidate-mailcount-v2';

    this.generalInbox = URL + 'v1/UserMail/general-inbox';
    this.recipientMailCount = URL + 'v1/UserMail/recipient-mailcount';
    this.clientInbox = URL + 'v1/UserMail/client-inbox';
    this.clientMailCount = URL + 'v1/UserMail/client-mailcount';
    this.xeoplesearchEmail = URL + 'v1/UserMail/bulkemail';

  }

  /*
    @Type: File, <ts>
    @Name: seekApiUrl
    @Who: Nitin Bhati
    @When: 09-11-2021
    @Why: EWM-3691
    @What: set All url for Seek
    */
  seekApiUrl(URL: string) {
    this.getSeekLocation = URL + 'v1/SeekData/get-seeklocation';
    this.getSeekLocationGeo = URL + 'v1/SeekData/get-seeklocation-geo';
    this.getSeekJobCategorySugestion = URL + 'v1/SeekData/get-seekjobcategory-suggestion';
    this.getSeekJobCategoryWithchild = URL + 'v1/SeekData/get-seekjobcategory-withchild';
    this.getSeekAdSelection = URL + 'v1/SeekData/get-seek-adselection';
    this.getUpdatedSeekAdSelection = URL + 'v1/SeekData/get-updated-seek-adselection';
    this.getSeekBranding = URL + 'v1/SeekData/get-seek-branding';
    this.createSeekJobPosting = URL + 'v1/SeekPosting/jobpost';
    this.updateSeekJobPosting = URL + 'v1/SeekPosting/update-seekjob-byid';
    this.getSeekAdvertiseId = URL + 'v1/SeekData/get-seek-advertiserid';
    this.getSeekApplicationMethod = URL + 'v1/SeekData/get-seek-application-method';
    this.postSeekJobExpire = URL + 'v1/SeekPosting/postSeekJobExpire';
    this.getSeekCurrencies = URL + 'v1/SeekData/get-seek-currencies';
    this.getSeekAdselectionV2 = URL + 'v1/SeekData/get-seek-adselection_v2';
    this.createSeekJobPostingPreview= URL + 'v1/SeekData/create-seek-job-posting-preview';
    this.getSeekPayType= URL + 'v1/SeekData/get-seek-paytype';
     this.getSeekWorkType= URL + 'v1/SeekData/get-seek-worktype';
     this.getSeekAdselectionUpdateV2 = URL + 'v1/SeekData/get-seek-adselection_update_v2';
  }


  /*
@Type: File, <ts>
@Name: dextra
@Who: Suika
@When: 12-12-2021
@Why: EWM-4147
@What: set All url for dextra
*/
  dextraApiUrl(URL: string) {
    this.parseResume = URL + 'v1/ResumeParser/parse-resume';
    this.getResumeByCandidateId = URL + 'v1/ResumeParser/get-resume-by-candidateid';
  }
  /*
  @Type: File, <ts>
  @Name: Assessment
  @Who: Renu
  @When: 05-03-2021
  @Why: EWM-1732 EWM-5339
  @What: set All url for assessment
  */

  assessmentApiUrl(URL: string) {
    this.getAssessmentList = URL + 'v1/Assessment/get-assessment-all';
    this.checkAssessmentDuplicacy = URL + 'v1/Assessment/check-assessment-name';
    this.addAssementStep = URL + 'v1/Assessment/step1';
    this.addAssementQues = URL + 'v1/Assessment/step2';
    this.addAssementGuidLines = URL + 'v1/Assessment/step3';
    this.addReviewSection = URL + 'v1/Assessment/step4';
    this.getAssessmentRelatedTo = URL + 'v1/Assessment/get-assessment-relatedto';
    this.getAssessmentById = URL + 'v1/Assessment/get-assessment-info-byid';
    this.getAssessmentVersionById = URL + 'v1/Assessment/get-assessment-version-byid';
    this.deleteAssessment = URL + 'v1/Assessment/delete-assessment';
    this.getStep4List = URL + 'v1/Assessment/get-step4-byid';
    this.deleteAssessmentStep4 = URL + 'v1/Assessment/delete';
    this.getQuestionById = URL + 'v1/Assessment/get-question-byid';
    this.getStep1ById = URL + 'v1/Assessment/get-step1-byid';
    this.getStep3ById = URL + 'v1/Assessment/get-step3-byid';
    this.updateSectionName = URL + 'v1/Assessment/update-sectionname';
    this.getStep2List = URL + 'v1/Assessment/get-step2-byid';
    this.getStep2deleteQues = URL + 'v1/Assessment/delete-question';
    this.getAssessmentAllWithoutFilter = URL + 'v1/Assessment/get-assessment-all-withoutfilter';
    this.getAssessmentDeleteDraft = URL + 'v1/Assessment/delete-assessment-draft';
  }


  /*
 @Type: File, <ts>
 @Name: setSMSApiUrl
 @Who: Suika
 @When: 29-Sept-2022
 @Why: ROST-8952
 @What: set All url for authentication
 */
  setSMSApiUrl(URL: string) {
    this.sendSMS = URL + 'v1/SMS/send-sms';
    this.getSMSall = URL + 'v1/SMS/get-sms-all';
    this.getSMSBalance = URL + 'v1/SMS/get-sms-balance';
  }

  /*
@Type: File, <ts>
@Name: broadBeanApiUrl
@Who: Adarsh singh
@When: 08-Feb-2023
@Why: EWM-10428
@What: set All url for broadBeanApiUrl
*/
  broadBeanApiUrl(URL: string) {
    this.broadBeanJobPosting = URL + 'v1/JobPosting/publish-job';
  }

  /*
@Type: File, <ts>
@Name: ElasticApiUrl
@Who: Nitin Bhati
@When: 18-Feb-2023
@Why: EWM-10317
@What: set All url for elastic search
*/
  ElasticApiUrl(URL: string) {
    this.elasticSearchEngine = URL + 'v1/ElasticSearchEngine';
    this.getCandidateList = URL + 'v1/ElasticSearchEngine/getCandidateList';
    this.getCandidateActivityHistoryAll = URL + 'v1/LogActivity';
    this.jobLandingkendoList = URL + 'v1/Job/getJobList';
    this.getJobsCountByWorkFlowIdV2 = URL + 'v1/Job/getJobCount';
    this.getActivityLogById = URL + 'v1/LogActivity/getActivityLogById';
  }
/*@Who: renu @When: 09-Sept-2023 @Why: EWM-13708 EWM-13925 @What: Externally eOh api call*/
  // eohApiUrl(URL: string){
  //   this.getXSearchTagData = URL + 'v1/TalentSearch/get-x-search-tag-data';
  //   this.getXSearchCardList = URL + 'v1/TalentSearch/get-x-talent-search-short';
  //   this.getXSearchCardProfilePic = URL + 'v1/TalentSearch/get-x-talent-search-profile-picture';
  //   this.getXSearchCardSelected = URL + 'v1/TalentSearch/get-x-talent-search-long';
  //   this.eohSendpushNotification =URL + 'v2/Notification/send-push-notification';
  //   this.getXSearchCardResumeUrl =URL + 'v1/TalentSearch/get-document-url';
  // } 

  /*
@Type: File, <ts>
@Name: pdfApiUrl
@Who: mukesh
@When: 18-09-2023
@Why: EWM-13769
@What: for pdf api url
*/
  pdfApiUrl(URL: string){
    this.downloadDocumentByHtml =URL + 'v1/ApplicationForm/download-document-byhtml';
  }

   /*
 @Type: File, <ts>
 @Name: indeedApiUrl
 @Who: Nitin Bhati
 @When: 16-Nov-2023
 @Why: EWM-15083
 @What: set All url for indeedApiUrl
 */
 indeedApiUrl(URL: string) {
  this.createIndeedJobPosting = URL + 'v1/IndeedPosting/publish-job';
  this.getIndeedPublishedJobDetails = URL + 'v1/IndeedPosting/get-published-job-details';
  this.getIndeedDownloadJobXml = URL + 'v1/IndeedPosting/download-job-xml';
}

/*
 @Type: File, <ts>
 @Name: notificationUrl
 @Who: Renu
 @When: 28-Nov-2023
 @Why: EWM-15193 EWM-15224
 @What: set All url for notification url
 */
notificationUrl(URL: string) {
  this.jobNotificationUrl = URL + 'v1/job/quick-job-mapping-notification';
}
wss(URL: string) {
  this.notificationwss = URL;
}
}
