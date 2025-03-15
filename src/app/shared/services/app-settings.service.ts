
/**
   @(C): Entire Software
   @Type: ts
   @Name: app.setting.service.ts
   @Who: Renu
   @When: 28-Jan-2021
   @Why: ROST-772
   @What: This service contains the config file data without login token genration adn by pass the http intercpetors
  */
import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Logging } from '../models';



@Injectable({
  providedIn: 'root'
})
export class
AppSettingsService {

  /****************Common varibales declarations*********************** */
  public config: any;
  public configSubject$;
  public apikey: any;
  public agentId: any;
  public pagesize: any;
  public maxSelectEmail: any;
  public apiGateWayUrl: any;
  public pageSizeOptions: any;
  public employeeID: any;
  public candidateID: any;
  public jobID: any;
  public environment: any;
  public environment_color: string;
  public lastLogin: any;
  public lastLogin_color: string;
  public xeopleURL: string;
  public autodisappearTime: any;
  public encryptSecretKey: any;
  public apptitle: string;
  public menuMoreConfig: any;
  public clientNameId: any;
  public employeeNameId: any;
  public leadNameId: any;
  public manageNameParendID: any;
  public reasonModule: any;
  public reasonModules: any;
  public seekRegistrationCode: any;
  public daxtraRegistrationCode: any;
  public xeopleSMSRegistrationCode: any;
  public xeopleCallRegistrationCode: any;
  public zoomMeetingInviteRegistrationCode: any;
  public zoomPhoneCallRegistrationCode: any;
  public mSTeamMeetingInviteRegistrationCode: any;
  public googleMeetMeetingInviteRegistrationCode: any;
  public pageOption: any;
  public isCapchaConfig: any;
  public dateFormat: any;
  public Broadbeanregistrationcode: any;
  public burstSMSRegistrationCode: any
  public enabelBroadbeanregistrationcode: any;
  public maxsmslength: any;
  public groupCodeEmployeeSummaryPage: any
  public groupCodeCandidateSummaryPage: any;
  public groupCodeQuickClientDetailsPage: any;
  public SidebardefaultbackgroundUrl: any;
  public broadBeanClientId: any;
  public NoOfCanSelectedEachStage: number;
  public logoutAndSessionExpireSnackbarShow: number;
  public imageUploadConfigForKendoEditor: Object;
  public eohRegistrationCode: string;
  public indeedRagistrationCode:string
  public anouncmenturlOne:string;
  public loginHeaderKnowledgeBase:string;
  public loginHeaderResources:string;
  public loginHeaderSignUpCreateAccount:string;
  public loginHeaderHelpCenter:string;
  public loginFooterSecurityNoticeboard:string;
  public loginFooterTermsOfUse:string;
  public loginFooterPrivacyPolicy:string;
  public FooterSecurityNoticeboardUrl:string;
  public FooterTermsOfUseUrl:string;
  public FooterPrivacyPolicyUrl:string;
  public existingworkspace:string;
  public logging: Logging;
  public vxtRagistrationCode:string;
  public dashboardurl:string;
  public brandAppSetting:any;





  /*@who:Priti
  @why:EWM-888
  */
  public file_img_type_small: any;
  public file_img_type_medium: any;
  public file_img_type_large: any;
  public file_img_type_extralarge: any;
  public file_img_size_small: any;
  public file_img_size_medium: any;
  public file_img_size_large: any;
  public file_img_size_extralarge: any;
  public file_file_type_small: any;
  public file_file_type_medium: any;
  public resume_file_file_type_medium: any;
  public file_file_type_large: any;
  public file_file_type_extralarge: any;
  public file_file_size_small: any;
  public file_file_size_medium: any;
  public file_file_size_large: any;
  public file_file_size_extralarge: any;
  public file_file_size_extraExtraLarge: any;

  public attachment_max_count: any;
  public attachment_max_size: any;

  private googleKey: any;
  private microsoftkey: any;
  private linkedinkey: any;
  private httpClient: HttpClient;
  public baseUrl: any;

  public response_type: any;
  public state: any;
  public scope: any;
  public client_id: any;
  public redirect_uri: any;
  public response_mode: any;
  public responsetype365: any;
  public state365: any;
  public scope365: any;
  public clientid365: any;
  public redirecturi365: any;
  public responsemode365: any;
  public maxleveloftreenode: number;
  public file_file_type_mail: any;
  responsetypeGmail: any;
  stateGmail: any;
  scopeGmail: any;
  clientidGmail: any;
  redirecturiGmail: any;
  responsemodeGmail: any;
  _clientFilePrefix: any;


  responsetypeZoom: any;
  clientidZoom: any;
  redirecturiZoom: any;
  public zoomCalleeNameConfig: number;
  public email_forwarding: any;

  responsetypeZoomMeeting: any;
  clientidZoomMeeting: any;
  redirecturiZoomMeeting: any;
  public zoomMeetingNameConfig: number;
  public tokenExpiryDays: any;
  roadMapMenuLink: string;
  aPIMenuLink: string;
  documentCentreMenuLink: string;
  supportMenuLink: string;


  responsetypeMSTeam: any;
  clientidMSTeam: any;
  redirecturiMSTeam: any;
  responsetypeGoogleMeet: any;
  clientidGoogleMeet: any;
  redirecturiGoogleMeet: any;


  promptGoogleMeet: string;
  scopeGoogleMeet: string;
  responseModeMSTeam: any;
  scopeMSTeam: string;
  promptGmail: string;
  maxOptions: any;
  file_type_resume: any;
  isBlurredOn: boolean;
  domainPrefix: string;
  perWorkflowMapMaxAessment: number;
  perWorkflowMapMaxChecklist: number;
  applicationBaseUrl: string;
  applicationLinkExprire: any;
  dateTimeFormatViaLookAndFeel: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public dateTimeFormatVal = this.dateTimeFormatViaLookAndFeel.asObservable();
  broadRegistrationCode: any;
  broadBeanRegistrationCode: any;
  prefix: any;
  systemConfig: any;
  defaultSMS: any;
  maxUploadFile: any;
  minimumBalanceSMS: number;
  broadbean: any;
  showScreeningInterview: boolean;
  optionalMenu: any;
  smsBalance: any;
  //@suika@EWM-10675 EWM-10947 For setting default values for country and phone code
  defaultCountryId: any;
  defaultCountryCode: any;
  //@suika@EWM-10681 EWM-10813 For setting default values for status active code key
  CandidateStatusActiveKey: any;
  EmployeeStatusActiveKey: any;
  JobStatusActiveKey: any;
  ContactStatusActiveKey: any;
  ClientStatusActiveKey: any;

  /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10765 @What:make defualt access public **/
  accessName: any;
  accessId: any;
  // who:maneesh, @Why:ewm-10646  to get default logo for when:ewm-23/03/2023
  public defaultlogo: string;
  public dateFormatPlaceholder: string;
  emailPattern: string;
  numberPattern: string;
  namePattern: string;
  urlpattern: string;

  public progressBar_Reverse_Direction: string;
  public counterDashboardTimer: number;
  public Datalimit: number;
  public Expiredays: number;
  public ActionDurationDays: number;
  public LastActionListNoOfRecords: number;
  ShowDummyDashboard: number;
  public ClientGraphLimit: any;
  public ApplicationStatusId: any;
  categoryId: string;
  categoryName: string;
  inviteTeammate:number;
  phoneNumberPattern:string;
  public file_type_xeoplEmailResume: string;
  public NoOfMembersEOHExtract: number;
  alphaNumericPattern: string;
  public pushNotificationStatus: number;
  public appVersion: string;
  public ExternalSharedLink: string;
  //  @Who: Ankit Rawat, @When: 29-jan-2024, @Why: EWM-15577-EWM-15840 (Allow some special characters on First and Last Name)
  public specialcharNamePattern: string;
  NotificationDebugStatus:boolean;
  public SourceCodeParam: any;
  ProfessionallevelActiveKey: any;

  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }
  /*
     @Type: loadEnvVariable
     @Who: Nitin Bhati
     @When: 28-Jan-2021
     @Why:  ROST-7772
     @What: This promise function will read cofig file and stored required varaibles to setter getter functions
     @modified by: Priti
     @When: 09-Feb-2021
     @Why:  ROST-888
   */
  public loadEnvVariable() {
    this.setClientNameId(environment.clientNameId);
    this.setEmployeeName(environment.employeeNameId);
    this.setLeadName(environment.leadNameId);
    this.setManageName(environment.manageNameParendID);
    this.setReasonModule(environment.reasonModule);
    this.setEncryptSecretKey(environment.encryptSecretKey);
    this.setConfigapi(environment.apiKey);
    this.setConfiAgentId(environment.agentId);
    this.setClientKey(environment.clientKey);
  }

  /*
   @Type: loadConfig
   @Who: Renu
   @When: 28-Jan-2021
   @Why:  ROST-7772
   @What: This promise function will read cofig file and stored required varaibles to setter getter functions
   @modified by: Priti
   @When: 09-Feb-2021
   @Why:  ROST-888
 */

  public loadConfig() {
    return this.httpClient.get('assets/config/App-settings.config.json')
      //return this.httpClient.get('./assets/enviro')
      .toPromise()
      .then((config: any) => {
        this.setBaseURL(config.baseLogin);
        this.setPrefix(config.prefix);
        this.setSystemConfig(config.systemConfig);
        this.setApiGateWayUrl(config.apiGateWayUrl);
        this.setEnvironment(config.environment);
        // this.setdefaultSMS(config.defaultSMS);
        this.setEnvironment_color(config.environment_color);
        this.setLastLogin_color(config.lastLogin_color);
        this.setDisapperTime(config.autoDisapperTime);
        this.setMenuMoreConfig(config.menuMoreConfig);
        this.setPagesize(config.pagesize);
        this.setApptitle(config.apptitle);
        this.setMaxSelectEmail(config.maxSelectEmail);
        this.setMaxOptions(config.maxAssPerQuesOptions);
        this.setPageSizeOptions(config.pageSizeOptions);
        this.setmaxtreeNodeLevel(config.documentTreeMaxNode);
        this.setClientFilePrefix(config.clientFilePrefix);
        this.setIsCapchaConfig(config.isCapchaConfig);
        this.setzoomCalleeNameConfig(config.zoomCalleeName);
        this.setEmail_forwarding(config.email_forwarding);
        this.setPageOption(config.pageOption);
        this.setTokenExpiryDays(config.tokenExpiryDays);
        this.setRoadMapMenuLink(config.RoadMapMenuLink);
        this.setAPIMenuLink(config.APIMenuLink);
        this.setDocumentCentreMenuLink(config.DocumentCentreMenuLink);
        this.setSupportMenuLink(config.SupportMenuLink);
        this.setFormat(config.activityDateFormat);
        this.setIsBlured(config.isBlurredOn);
        this.setXeopleURL(config.xeopleURL);
        this.setPerWorkflowMapMaxAessment(config.perWorkflowMapMaxAessment);
        this.setApplicationBaseUrl(config.applicationBaseUrl);
        this.setPerWorkflowMapMaxChecklist(config.perWorkflowMapMaxChecklist);
        this.setMaxsmslength(config.maxsmslength);
        this.setminimumBalanceSMS(config.minimumBalanceSMS);
        this.setShowScreeningInterview(config.showScreeningInterview);

        this.setApplicationLinkExpire(config.applicationLinkExpire);
        this.setSidebardefaultbackgroundUrl(config.debardefaultbackgroundUrl);
        this.setmaxUploadFile(config.maxUploadFile);
        this.setbroadBeanClientId(config.broadBeanClientId);
        this.setbroadBeanConfig(config.broadbean);
        this.setDocumentFileConfig(config.documentFileConfig);
        this.setGmailConfig(config.GmailConfig);
        this.setZoomConfig(config.ZoomConfig);
        this.setZoomMeetingConfig(config.ZoomMeetingConfig);
        this.setMSTeamConfig(config.MSTeamConfig);
        this.setGoogleMeetConfig(config.GoogleMeetConfig);
        this.setSeekRegistrationCode(config.seekRegistrationCode);
        this.setDaxtraRegistrationCode(config.daxtraRegistrationCode);
        this.setXeopleSMSRegistrationCode(config.xeopleSMSRegistrationCode);
        this.setXeopleCallRegistrationCode(config.xeopleCallRegistrationCode);
        this.setZoomMeetingInviteRegistrationCode(config.zoomMeetingInviteRegistrationCode);
        this.setZoomPhoneCallRegistrationCode(config.zoomPhoneCallRegistrationCode);
        this.setMSTeamMeetingInviteRegistrationCode(config.mSTeamMeetingInviteRegistrationCode);
        this.setGoogleMeetMeetingInviteRegistrationCode(config.googleMeetMeetingInviteRegistrationCode);
        this.setEmployeeID(config.employeeID);
        this.setCandidateID(config.candidateID);
        this.setJobID(config.JobID);
        this.setOffice365Config(config.office365Config);
        this.setimageConfig(config.imageConfig);
        this.setBroadbeanregistrationcode(config.Broadbeanregistrationcode);
        this.setLinkedInConfig(config.linkedInConfig);
        this.setBurstSMSRegistrationCode(config.burstSMSRegistrationCode);
        this.setenabelBroadbeanregistrationcode(config.enabelBroadbeanregistrationcode);
        this.setgroupCodeEmployeeSummaryPage(config.groupCodeEmployeeSummaryPage);
        this.setgroupCodeCandidateSummaryPage(config.groupCodeCandidateSummaryPage);
        this.setgroupCodeQuickClientDetailsPage(config.groupCodeQuickClientDetailsPage);
        //@suika@EWM-10675 EWM-10947 For setting default values for country and phone code
        this.setdefaultCountryCode(config.defaultCountryCode);
        this.setdefaultCountryId(config.defaultCountryId);
        //@suika@EWM-10681 EWM-10813 For setting default values for status active code key
        this.setCandidateStatusActiveKey(config.CandidateStatusActiveKey);
        this.setClientStatusActiveKey(config.ClientStatusActiveKey);
        this.setContactStatusActiveKey(config.ContactStatusActiveKey);
        this.setProfessionallevelActiveKey(config.ProfessionallevelActiveKey);
        this.setJobStatusActiveKey(config.JobStatusActiveKey);
        this.setEmployeeStatusActiveKey(config.EmployeeStatusActiveKey);
        /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10765 @What:make defualt access public **/
        this.setDefaultAcess(config.defaultAcessInfo)
        this.setDateFormatPlchldr(config.dateFormatPlaceholder);
        // --------@When: 03-April-2023 @who:Adarsh singh @why: EWM-10209 --------
        this.setEmailPattern(config.emailPattern);
        this.setNumPattern(config.numberPattern);
        this.setPhoneNumberPattern(config.phoneNumberPattern);
        this.setNamePattern(config.namePattern);
        this.setURLPattern(config.urlpattern);
        this.setOptionalMenu(config.optionalMenu);
        // END
        this.setProgressBar_Reverse_Direction(config.progressBar_Reverse_Direction);
        this.setCounterDashboardTimer(config.counterDashboardTimer);
        this.setDatalimit(config.Datalimit);
        this.setExpiredays(config.Expiredays);
        this.setActionDurationDays(config.ActionDurationDays);
        this.setLastActionListNoOfRecords(config.LastActionListNoOfRecords);
        this.setShowDummyDashboard(config.ShowDummyDashboard);
        this.setClientGraphLimit(config.ClientGraphLimit); /*--EWM-12603,@when:24-05-2023,@why:for setter and getter--*/
        this.setApplicationStatusId(config.ApplicationStatusId);
        this.setNoOfCanSelectedEachStage(config.NoOfCanSelectedEachStage);
        this.setDefaultCategory(config.defaultCategoryInfo);
        this.setinviteTeammate(config.inviteTeammate);
        this.setLogoutAndSessionExpireSnackbarShow(config.logoutAndSessionExpireSnackbarShow);
        this.setImageUploadConfigForKendoEditor(config.imageUploadConfigForKendoEditor);
        this.setEOHRegistrationCode(config.eohRegistrationCode);
        this.setPhoneNumberPattern(config.phoneNumberPattern);
        this.setBrandAppSetting(config.brandAppSetting);

        this.setNoOfMembersEOHInfo(config.setNoOfMembersEOH);
        this.setpushNotificationStatus(config.pushNotificationStatus);
        this.setAlphaNumericPattern(config.namePattern);
        this.setappVersion(config.appVersion);
        this.setInneedRegistrationCode(config.indeedRagistrationCode);
        /*--who:maneesh--EWM-15045,@when:01-01-2023,@why:for setter and getter--*/
        this.setanouncmenturlOne(config.anouncmenturlOne)
        this.setloginHeaderKnowledgeBase(config.loginHeaderKnowledgeBase);
        this.setloginHeaderResources(config.loginHeaderResources);
        this.setloginHeaderSignUpCreateAccount(config.loginHeaderSignUpCreateAccount);
        this.setloginHeaderHelpCenter(config.loginHeaderHelpCenter);
        this.setloginFooterSecurityNoticeboard(config.loginFooterSecurityNoticeboard);
        this.setloginFooterTermsOfUse(config.loginFooterTermsOfUse);
        this.setloginFooterPrivacyPolicy(config.loginFooterPrivacyPolicy);
        this.setFooterSecurityNotice(config.FooterSecurityNoticeboardUrl);
        this.setFooterTerms(config.FooterTermsOfUseUrl);
        this.setFooterPrivacyPolicy(config.FooterPrivacyPolicyUrl);
        this.setexistingworkspace(config.existingworkspace);
        this.setExternalSharedLink(config.ExternalSharedLink);
        //  @Who: Ankit Rawat, @When: 29-jan-2024, @Why: EWM-15577-EWM-15840 (Allow some special characters on First and Last Name)
        this.setSpecialcharNamePattern(config.specialcharNamePattern);
        this.setNotificationDebugStatus(config.NotificationDebugStatus);
        this.setLogging(config.logging);
        this.setVxtRegistrationCode(config.vxtRagistrationCode);
        this.setUrlSourceCodeParmas(config.SourceCodeParam);
        this.setdashboardurl(config.setdashboardurl);
      })
      .catch((err: any) => {
        // console.warn(err);
      })
  }

  setUrlSourceCodeParmas(key: string) {
    return this.SourceCodeParam=key;
  }

  getUrlSourceCodeParmas(key: string) {
    return this.SourceCodeParam[key];
  }


 

  /*
   @Who: priti
   @When: 2-Dec-2021
   @Why:  EWM-3939
   @What: setter variable for Client File Prefix
        this.setApplicationBaseUrl(environment.applicationBaseUrl);
        this.setFormat(environment.activityDateFormat);
        this.setPerWorkflowMapMaxAessment(environment.perWorkflowMapMaxAessment);
        this.setTokenExpiryDays(environment.tokenExpiryDays);
        this.setRoadMapMenuLink(environment.RoadMapMenuLink);
        this.setAPIMenuLink(environment.APIMenuLink);
        this.setDocumentCentreMenuLink(environment.DocumentCentreMenuLink);
        this.setSupportMenuLink(environment.SupportMenuLink);
        this.setBaseURL(environment.baseLogin);
        this.setDocumentFileConfig(environment.documentFileConfig);
        this.setGmailConfig(environment.GmailConfig);
        this.setZoomConfig(environment.ZoomConfig);
        this.setZoomMeetingConfig(environment.ZoomMeetingConfig);
        this.setMSTeamConfig(environment.MSTeamConfig);
        this.setGoogleMeetConfig(environment.GoogleMeetConfig);
        this.setClientNameId(environment.clientNameId);
        this.setEmployeeName(environment.employeeNameId);
        this.setReasonModule(environment.reasonModule);
        this.setzoomCalleeNameConfig(environment.zoomCalleeName);
        this.setApptitle(environment.apptitle);
        this.setMenuMoreConfig(environment.menuMoreConfig);
        this.setEncryptSecretKey(environment.encryptSecretKey);
        this.setConfigapi(environment.apiKey);
        this.setConfiAgentId(environment.agentId);
        this.setPagesize(environment.pagesize);
        this.setSeekRegistrationCode(environment.seekRegistrationCode);
        this.setDaxtraRegistrationCode(environment.daxtraRegistrationCode);
        this.setXeopleSMSRegistrationCode(environment.xeopleSMSRegistrationCode);
        this.setXeopleCallRegistrationCode(environment.xeopleCallRegistrationCode);
        this.setZoomMeetingInviteRegistrationCode(environment.zoomMeetingInviteRegistrationCode);
        this.setZoomPhoneCallRegistrationCode(environment.zoomPhoneCallRegistrationCode);
        this.setMSTeamMeetingInviteRegistrationCode(environment.mSTeamMeetingInviteRegistrationCode);
        this.setGoogleMeetMeetingInviteRegistrationCode(environment.googleMeetMeetingInviteRegistrationCode);
        this.setIsCapchaConfig(environment.isCapchaConfig);
        this.setMaxSelectEmail(environment.maxSelectEmail);
        this.setMaxOptions(environment.maxAssPerQuesOptions);
        this.setApiGateWayUrl(environment.apiGateWayUrl);
        this.setPageSizeOptions(environment.pageSizeOptions);
        this.setEnvironment(environment.environment);
        this.setDisapperTime(environment.autoDisapperTime);
        this.setOffice365Config(environment.office365Config);
        this.setEnvironment_color(environment.environment_color);
        this.setLastLogin_color(environment.lastLogin_color);
        this.setXeopleURL(environment.xeopleURL);
        this.setEmail_forwarding(environment.email_forwarding);
        this.setPageOption(environment.pageOption)
        this.setIsBlured(environment.isBlurredOn);
        // this.environmentSubject$.next(this.environment);
        this.setimageConfig(environment.imageConfig);
        this.setClientFilePrefix(environment.clientFilePrefix);
        this.setmaxtreeNodeLevel(environment.documentTreeMaxNode);
        this.setClientKey(environment.clientKey);
        this.setLinkedInConfig(environment.linkedInConfig);
      //  this.setAttachmentsConfig(environment.attachmentsConfig);


      // })
      // .catch((err: any) => {
      //   // console.warn(err);
      // })
  }
   /*
    @Who: priti
    @When: 2-Dec-2021
    @Why:  EWM-3939
    @What: setter variable for Client File Prefix

 */
  setSidebardefaultbackgroundUrl(url: any) {
    this.SidebardefaultbackgroundUrl = url;
  }
  setClientFilePrefix(clientFilePrefix: any) {
    this._clientFilePrefix = clientFilePrefix;
  }
  /*
   @Who: priti
   @When: 2-Dec-2021
   @Why:  EWM-3939
   @What: getter variable for Client File Prefix

 */
  public get getClientFilePrefix() {
    return this._clientFilePrefix;
  }
  setmaxtreeNodeLevel(_maxleveloftreenode: any) {
    this.maxleveloftreenode = _maxleveloftreenode;
  }
  public get getmaxtreeNodeLevel() {
    return this.maxleveloftreenode;
  }

  /*
    @Type: getBaseURL
    @Who: Renu
    @When: 24-Feb-2021
    @Why:  ROST-865
    @What: getter variable for baseURL

  */
  public get getBaseURL() {
    return this.baseUrl;
  }
  /*
      @Type: getMaxOptions
      @Who: Renu
      @When: 05-May-2022
      @Why: EWM-5338 EWM-6527
      @What: getter variable
  */
  public get getMaxOptions() {
    return this.maxOptions;
  }
  /*
   @Type: setBaseURL
   @Who: Renu
   @When: 24-Feb-2021
   @Why:  ROST-865
   @What: setter variable for baseURL

 */
  setBaseURL(baseURL: string) {
    this.baseUrl = baseURL;
  }

  /*
    @Type: setClientKey
    @Who: Priti
    @When: 15-Feb-2021
    @Why:  ROST-895
    @What: setter variable

  */
  setClientKey(clientKey) {
    this.googleKey = clientKey.google;
    this.microsoftkey = clientKey.microsofte;
    this.linkedinkey = clientKey.linedin;
  }
  /*
    @Type: getGoogleClientKey
    @Who: Priti
    @When: 15-Feb-2021
    @Why:  ROST-895
    @What: getter variable

  */
  getSidebardefaultbackgroundUrl() {
    return this.SidebardefaultbackgroundUrl;
  }
  getGoogleClientKey() {
    return this.googleKey;
  }
  getMSClientKey() {
    return this.microsoftkey;
  }
  getLinkedinClientKey() {
    return this.linkedinkey;
  }
  /*
    @Type: setConfigapi
    @Who: Renu
    @When: 28-Jan-2021
    @Why:  ROST-7772
    @What: setter variable

  */

  setConfigapi(apikey) {
    this.apikey = apikey;
  }

  setdefaultSMS(defaultSMS) {
    this.defaultSMS = defaultSMS;
  }

  /*
      @Type: setConfiAgentId
      @Who: Renu
      @When: 28-Jan-2021
      @Why:  ROST-7772
      @What: setter variable

    */
  setConfiAgentId(agentId) {
    this.agentId = agentId;
  }

  /*
      @Type: getConfigApi
      @Who: Renu
      @When: 28-Jan-2021
      @Why:  ROST-7772
      @What: getter variable
  */
  public get getConfigApi() {
    return this.apikey;
  }

  /*
      @Type: getConfigAgentid
      @Who: Renu
      @When: 28-Jan-2021
      @Why:  ROST-7772
      @What: getter variable
  */
  public get getConfigAgentid() {
    return this.agentId;
  }

  /*
      @Type: getpagesize
      @Who: Nitin Bhati
      @When: 11-Feb-2021
      @Why:  EWM-867
      @What: getter variable
  */
  public get getPagesize() {
    return this.pagesize;
  }
  public get getSeekRegistrationCode() {
    return this.seekRegistrationCode;
  }
  public get getDaxtraRegistrationCode() {
    return this.daxtraRegistrationCode;
  }
  public get getApptitle() {
    return this.apptitle;
  }


  public get getXeopleSMSRegistrationCode() {
    return this.xeopleSMSRegistrationCode;
  }

  public get getXeopleCallRegistrationCode() {
    return this.xeopleCallRegistrationCode;
  }


  public get getZoomMeetingInviteRegistrationCode() {
    return this.zoomMeetingInviteRegistrationCode;
  }

  public get getZoomPhoneCallRegistrationCode() {
    return this.zoomPhoneCallRegistrationCode;
  }

  public get getMSTeamMeetingInviteRegistrationCode() {
    return this.mSTeamMeetingInviteRegistrationCode;
  }

  public get getGoogleMeetMeetingInviteRegistrationCode() {
    return this.googleMeetMeetingInviteRegistrationCode;
  }

  public get getIsCapchaConfig() {
    return this.isCapchaConfig;
  }


  public get getTokenExpiryDays() {
    return this.tokenExpiryDays;
  }
  public get getBroadbeanregistrationcode() {
    return this.Broadbeanregistrationcode;
  }
  public get getenabelBroadbeanregistrationcode() {
    return this.enabelBroadbeanregistrationcode;
  }
  public get getgroupCodeEmployeeSummaryPage() {
    return this.groupCodeEmployeeSummaryPage;
  }
  public get getgroupCodeCandidateSummaryPage() {
    return this.groupCodeCandidateSummaryPage;
  }

  public get getgroupCodeQuickClientDetailsPage() {
    return this.groupCodeQuickClientDetailsPage;
  }
  /*
      @Type: setPagesize
      @Who: Nitin Bhati
      @When: 11-feb-2021
      @Why:  EWM-867
      @What: setter variable
  */
  setTokenExpiryDays(tokenExpiryDays) {
    this.tokenExpiryDays = tokenExpiryDays;
  }

  /*
      @Type: setFormat
      @Who: Suika
      @When: 30-05-2022
      @Why:  EWM-6720
      @What: setter variable
  */
  setFormat(dateFormat) {
    this.dateFormat = dateFormat;
  }

  /*
 @Type: setFormat
 @Who: Suika
 @When: 21-07-2022
 @Why:  EWM-7674
 @What: setter variable
*/
  setPerWorkflowMapMaxAessment(perAssessment) {
    this.perWorkflowMapMaxAessment = perAssessment;
  }



  /*
    @Type: getFormat
    @Who: Suika
    @When: 21-07-2022
    @Why:  EWM-7674
    @What: setter variable
*/
  getPerWorkflowMapMaxAessment() {
    return this.perWorkflowMapMaxAessment;
  }



  /*
@Type: setFormat
@Who: Suika
@When: 07-07-2022
@Why:  EWM-7469
@What: setter variable
*/
  setPerWorkflowMapMaxChecklist(perAssessment) {
    this.perWorkflowMapMaxChecklist = perAssessment;
  }



  /*
    @Type: getFormat
    @Who: Suika
    @When: 07-07-2022
    @Why:  EWM-7469
    @What: setter variable
*/
  getPerWorkflowMapMaxChecklist() {
    return this.perWorkflowMapMaxChecklist;
  }


  /*
      @Type: getFormat
      @Who: Suika
      @When: 30-05-2022
      @Why:  EWM-6720
      @What: setter variable
  */
  getFormat() {
    return this.dateFormat;
  }

  setPagesize(pagesize) {
    this.pagesize = pagesize;
  }
  setSeekRegistrationCode(seekRegistrationCode) {
    this.seekRegistrationCode = seekRegistrationCode;
  }
  setDaxtraRegistrationCode(daxtraRegistrationCode) {
    this.daxtraRegistrationCode = daxtraRegistrationCode;
  }

  /*
      @Type: setXeopleSMSRegistrationCode
      @Who:  Anup
      @When: 30-Dec-2021
      @What: setter and getter variable for xeople sms
  */
  public setXeopleSMSRegistrationCode(xeopleSMSRegistrationCode) {
    this.xeopleSMSRegistrationCode = xeopleSMSRegistrationCode
  }
  /*
      @Type: setXeopleCallRegistrationCode
      @Who:  Anup
      @When: 30-Dec-2021
      @What: setter and getter variable for xeople sms
  */
  public setXeopleCallRegistrationCode(xeopleCallRegistrationCode) {
    this.xeopleCallRegistrationCode = xeopleCallRegistrationCode
  }


  /*
     @Type: setZoomMeetingInviteRegistrationCode
     @Who:  Anup
     @When: 03-Feb-2022
     @What: setter and getter variable for zoom meeting invite
 */
  public setZoomMeetingInviteRegistrationCode(zoomMeetingInviteRegistrationCode) {
    this.zoomMeetingInviteRegistrationCode = zoomMeetingInviteRegistrationCode
  }

  /*
  @Type: setZoomPhoneCallRegistrationCode
  @Who:  Anup
  @When: 03-Feb-2022
  @What: setter and getter variable for zoom phon call
*/
  public setZoomPhoneCallRegistrationCode(zoomPhoneCallRegistrationCode) {
    this.zoomPhoneCallRegistrationCode = zoomPhoneCallRegistrationCode
  }

  /*
  @Type: setMSTeamMeetingInviteRegistrationCode
  @Who:  Nitin Bhati
  @When: 13-April-2022
  @What: setter and getter variable for Microsoft Team meeting invite
*/
  public setMSTeamMeetingInviteRegistrationCode(mSTeamMeetingInviteRegistrationCode) {
    this.mSTeamMeetingInviteRegistrationCode = mSTeamMeetingInviteRegistrationCode
  }

  /*
  @Type: setMSTeamMeetingInviteRegistrationCode
  @Who:  Nitin Bhati
  @When: 13-April-2022
  @What: setter and getter variable for Microsoft Team meeting invite
*/
  public setGoogleMeetMeetingInviteRegistrationCode(googleMeetMeetingInviteRegistrationCode) {
    this.googleMeetMeetingInviteRegistrationCode = googleMeetMeetingInviteRegistrationCode
  }

  setenabelBroadbeanregistrationcode(enabelBroadbeanregistrationcode) {
    this.enabelBroadbeanregistrationcode = enabelBroadbeanregistrationcode;
  }

  setgroupCodeEmployeeSummaryPage(groupCodeEmployeeSummaryPage) {
    this.groupCodeEmployeeSummaryPage = groupCodeEmployeeSummaryPage;
  }

  setgroupCodeCandidateSummaryPage(groupCodeCandidateSummaryPage) {
    this.groupCodeCandidateSummaryPage = groupCodeCandidateSummaryPage;
  }

  setgroupCodeQuickClientDetailsPage(groupCodeQuickClientDetailsPage) {
    this.groupCodeQuickClientDetailsPage = groupCodeQuickClientDetailsPage;
  }
  setIsCapchaConfig(isCapchaConfig) {
    this.isCapchaConfig = isCapchaConfig;
  }

  public setApptitle(apptitle) {
    this.apptitle = apptitle;
  }

  public setClientNameId(clientNameId) {
    this.clientNameId = clientNameId;
  }

  public get getClientNameId() {
    return this.clientNameId;
  }

  public setEmployeeName(employeeNameId) {
    this.employeeNameId = employeeNameId;
  }
  public get getEmployeeName() {
    return this.employeeNameId;
  }

  public setLeadName(leadNameId) {
    this.leadNameId = leadNameId;
  }
  public get getLeadName() {
    return this.leadNameId;
  }

  public setManageName(manageNameParendID) {
    this.manageNameParendID = manageNameParendID;
  }
  public get getManageName() {
    return this.manageNameParendID;
  }


  /*
      @Type: setReasonModule
      @Who:  Suika
      @When: 22-Oct-2021
      @Why: EWM-3141 EWM-3424
      @What: setter variable
  */

  public setReasonModule(reasonModule) {
    this.reasonModules = reasonModule;
  }

  /*
     @Type: getReasonModule
     @Who:  Suika
     @When: 22-Oct-2021
     @Why: EWM-3141 EWM-3424
     @What: getter variable
 */
  public get getReasonModule() {
    return this.reasonModules;
  }


  /*
       @Type: getMaxSelectEmail
       @Who: Anup Singh
       @When: 28-May-2021
       @Why: EWM-1434 EWM-1613
       @What: getter variable
   */
  public get getMaxSelectEmail() {
    return this.maxSelectEmail;
  }



  /*
     @Type: setMaxselectEmail
     @Who: Anup Singh
     @When: 28-May-2021
     @Why: EWM-1434 EWM-1613
     @What: setter variable
 */
  setMaxSelectEmail(maxSelectEmail) {
    this.maxSelectEmail = maxSelectEmail
  }

  /*
     @Type: setMaxOptions
     @Who: Renu
     @When: 05-May-2022
     @Why: EWM-5338 EWM-527
     @What: setter variable
 */
  setMaxOptions(maxOptions) {
    this.maxOptions = maxOptions
  }


  /*
       @Type: getApiGateWayUrl
       @Who: Anup Singh
       @When: 22-oct-2021
       @Why: EWM-3039 EWM-3405
       @What: getter variable
   */
  public get getApiGateWayUrl() {
    return this.apiGateWayUrl;
  }

  /*
     @Type: setApiGateWayUrl
     @Who: Anup Singh
     @When: 22-oct-2021
     @Why: EWM-3039 EWM-3405
     @What: setter variable
 */
  setApiGateWayUrl(apiGateWayUrl) {
    this.apiGateWayUrl = apiGateWayUrl
  }
  /*
      @Type: getPageSizeOptions
      @Who: Nitin Bhati
      @When: 11-Feb-2021
      @Why:  EWM-867
      @What: getter variable
  */
  public get getPageSizeOptions() {
    return this.pageSizeOptions;
  }
  /*
      @Type: setPageSizeOptions
      @Who: Nitin Bhati
      @When: 11-feb-2021
      @Why:  EWM-867
      @What: setter variable
     */
  setPageSizeOptions(pageSizeOptions) {
    this.pageSizeOptions = pageSizeOptions;
  }

  setEmployeeID(employeeID) {
    this.employeeID = employeeID;
  }

  setCandidateID(candidateID) {
    this.candidateID = candidateID;
  }

  setJobID(jobID) {
    this.jobID = jobID;
  }

  /*
      @Type: getEnvironment
      @Who: Nitin Bhati
      @When: 18-Feb-2021
      @Why:  EWM-996
      @What: getter variable
  */
  public get getEnvironment() {
    return this.environment;
  }
  /*
        @Type: setEnvironment_color
      @Who: Mukesh
      @When: 10-March-2021
      @Why:  EWM-1147
      @What: Getter variable
   */

  public get getEnvironment_color() {
    return this.environment_color;
  }

  /*
    @Type: get last login color
    @Who: Satya Prakash Gupta
    @When: 0-May-2021
    @Why:  EWM-1196 EWM-1428
    @What: getter variable
*/
  public get getLastLogin() {
    return this.lastLogin;
  }

  /*
    @Type: get last login color
    @Who: Satya Prakash Gupta
    @When: 0-May-2021
    @Why:  EWM-1196 EWM-1428
    @What: Getter variable
 */
  public get getLastLogin_color() {
    return this.lastLogin_color;
  }

  /*
    @Type: get direction value
    @Who: Satya Prakash Gupta
    @When: 02-May-2023
    @Why:  EWM-12264
    @What: Getter variable
 */
  public get getProgressBar_Reverse_Direction() {
    return this.progressBar_Reverse_Direction;
  }

  /*
  @Type: get direction value
  @Who: Satya Prakash Gupta
  @When: 02-May-2023
  @Why:  EWM-12264
  @What: Getter variable
*/
  public get getCounterDashboardTimer() {
    return this.counterDashboardTimer;
  }

  /*
    @Type: get last login color
    @Who: Satya Prakash Gupta
    @When: 0-May-2021
    @Why:  EWM-1196 EWM-1428
    @What: Getter variable
 */
  public get getXeopleURL() {
    return this.xeopleURL;
  }

  /*
    @Type: get email forwarding
    @Who: Adarsh singh
    @When: 28 FEb 2022
    @Why:  EWM-5362 EWM-5367
    @What: Getter variable
 */
  public get getEmail_forwarding() {
    return this.email_forwarding;
  }
  /*
  @Type: get isBlurred
  @Who: Adarsh singh
  @When: 02-06-22
  @Why:  EWM-6620 EWM-6886
  @What: Getter variable
*/
  public get getIsBlurred() {
    return this.isBlurredOn;
  }
  /*
      @Type: setEnvironment
      @Who: Nitin Bhati
      @When: 18-feb-2021
      @Why:  EWM-996
      @What: setter variable
  */
  setEnvironment(environment: string) {
    this.environment = environment;
  }
  /*
      @Type: setEnvironment_color
      @Who: Mukesh
      @When: 10-March-2021
      @Why:  EWM-1147
      @What: setter variable
  */
  setEnvironment_color(environment_color: string) {
    this.environment_color = environment_color;
  }

  /*
      @Type: get last login color
      @Who: Satya Prakash Gupta
      @When: 0-May-2021
      @Why:  EWM-1196 EWM-1428
      @What: setter variable
  */
  setLastLogin(lastLogin: string) {
    this.lastLogin = lastLogin;
  }
  /*
      @Type: get last login color
      @Who: Satya Prakash Gupta
      @When: 0-May-2021
      @Why:  EWM-1196 EWM-1428
      @What: setter variable
  */
  setLastLogin_color(lastLogin_color: string) {
    this.lastLogin_color = lastLogin_color;
  }

  /*
      @Type: set direction value
      @Who: Satya Prakash Gupta
      @When: 02-May-2023
      @Why:  EWM-12264
      @What: setter variable
  */
  setProgressBar_Reverse_Direction(progressBar_Reverse_Direction: string) {
    this.progressBar_Reverse_Direction = progressBar_Reverse_Direction;
  }

  /*
    @Type: set direction value
    @Who: Satya Prakash Gupta
    @When: 02-May-2023
    @Why:  EWM-12264
    @What: setter variable
*/
  setCounterDashboardTimer(counterDashboardTimer: number) {
    this.counterDashboardTimer = counterDashboardTimer;
  }
  /*
      @Type: get last login color
      @Who: Satya Prakash Gupta
      @When: 0-May-2021
      @Why:  EWM-1196 EWM-1428
      @What: setter variable
  */
  setXeopleURL(xeopleURL: string) {
    this.xeopleURL = xeopleURL;
  }

  /*
  @Type: get email forwarding
  @Who: Adarsh singh
  @When: 28 FEb 2022
  @Why:  EWM-5362 EWM-5367
  @What: setter variable
*/
  setEmail_forwarding(email_forwarding: any) {
    this.email_forwarding = email_forwarding
  }
  /*
    @Type: setImageConfig
    @Who: Priti
    @When: 09-Feb-2021
    @Why:  ROST-888
    @What: setter variable

  */

  /*
     @Type: setOption
     @Who: Adarsh singh
     @When: 01-jan-2022
     @Why:  EWM-4492
     @What: setter variable
    */
  setPageOption(pageOption) {
    this.pageOption = pageOption;
  }

  /*
    @Type: get last login color
    @Who: Adarsh singh
    @When: 02-06-22
    @Why:  EWM-6620 EWM-6886
    @What: setter variable
  */
  setIsBlured(isBlur: any) {
    this.isBlurredOn = isBlur;
  }


  setimageConfig(imageCofig: any) {
    this.file_img_size_extralarge = imageCofig.file_img_size_extralarge;
    this.file_img_size_large = imageCofig.file_img_size_large;
    this.file_img_size_medium = imageCofig.file_img_size_medium;
    this.file_img_size_small = imageCofig.file_img_size_small;
    this.file_img_type_extralarge = imageCofig.file_img_type_extralarge;
    this.file_img_type_large = imageCofig.file_img_type_large;
    this.file_img_type_medium = imageCofig.file_img_type_medium;
    this.file_img_type_small = imageCofig.file_img_type_small;
  }
  public getImageSizeExtralarge() {
    return this.file_img_size_extralarge;
  }
  public getImageSizeLarge() {
    return this.file_img_size_large;
  }
  public getImageSizeMedium() {
    return this.file_img_size_medium;
  }
  public getImageSizeSmall() {
    return this.file_img_size_small;
  }
  public getImageTypeExtralarge() {
    return this.file_img_type_extralarge;
  }
  public getImageTypeLarge() {
    return this.file_img_type_large;
  }
  public getImageTypeMedium() {
    return this.file_img_type_medium;
  }
  public getImageTypeSmall() {
    return this.file_img_type_small;
  }

  setAttachmentsConfig(attachmentConfig: any) {
    this.attachment_max_count = attachmentConfig.attachment_max_count;
    this.attachment_max_size = attachmentConfig.attachment_max_size;
  }

  public getAttachmentMaxCount() {
    return this.attachment_max_count;
  }
  public getAttachmentMaxSize() {
    return this.attachment_max_size;
  }

  setDocumentFileConfig(documentfileconfig: any) {
    this.file_file_size_extraExtraLarge = documentfileconfig.file_file_size_extraExtraLarge;
    this.file_file_size_extralarge = documentfileconfig.file_file_size_extralarge;
    this.file_file_size_large = documentfileconfig.file_file_size_large;
    this.file_file_size_medium = documentfileconfig.file_file_size_medium;
    this.file_file_size_small = documentfileconfig.file_file_size_small;
    this.file_file_type_extralarge = documentfileconfig.file_file_type_extralarge;
    this.file_file_type_large = documentfileconfig.file_file_type_large;
    this.file_file_type_medium = documentfileconfig.file_file_type_medium;
    this.resume_file_file_type_medium = documentfileconfig.file_file_type_medium;
    this.file_file_type_small = documentfileconfig.file_file_type_small;
    this.file_file_type_mail = documentfileconfig.file_file_type_mail;
    this.file_type_resume = documentfileconfig.file_type_resume;
    this.file_type_xeoplEmailResume=documentfileconfig.file_type_xeoplEmailResume;
  }

  public getDocumentfileSizeResume() {
    return this.file_type_resume;
  }

  public getDocumentmailFileSize() {
    return this.file_file_type_mail;
  }
  public getDocumentfileSizeExtraExtralarge() {
    return this.file_file_size_extraExtraLarge;
  }
  public getDocumentfileSizeExtralarge() {
    return this.file_file_size_extralarge;
  }
  public getDocumentfileSizeLarge() {
    return this.file_file_size_large;
  }
  public getDocumentfileSizeMedium() {
    return this.file_file_size_medium;
  }
  public getDocumentfileSizeSmall() {
    return this.file_file_size_small;
  }
  public getDocumentfileTypeExtralarge() {
    return this.file_file_type_extralarge;
  }
  public getDocumentfileTypeLarge() {
    return this.file_file_type_large;
  }
  public getDocumentfileSTypeMedium() {
    return this.file_file_type_medium;
  }
  public getresumeFileTypeMedium() {
    return this.resume_file_file_type_medium;
  }
  public getDocumentfileTypeSmall() {
    return this.file_file_type_small;
  }


  /*
    @Type: setLinkedInConfig
    @Who:  Suika
    @When: 24-March-2021
    @Why:  ROST-893
    @What: setter variable

  */
  public setLinkedInConfig(linkedInConfig: any) {
    this.response_type = linkedInConfig.response_type;
    this.state = linkedInConfig.state;
    this.scope = linkedInConfig.scope;
    this.client_id = linkedInConfig.client_id;
    this.redirect_uri = linkedInConfig.redirect_uri;
  }



  /*
      @Type: getResponseType
      @Who:  Suika
      @When: 24-March-2021
      @Why:  ROST-893
      @What: getter variable
  */

  public getResponseType() {
    return this.response_type;
  }

  /*
     @Type: getState
     @Who:  Suika
     @When: 24-March-2021
     @Why:  ROST-893
     @What: getter variable
 */

  public getState() {
    return this.state;
  }

  /*
    @Type: getScope
    @Who:  Suika
    @When: 24-March-2021
    @Why:  ROST-893
    @What: getter variable
*/

  public getScope() {
    return this.scope;
  }

  /*
       @Type: getRedirectUri
       @Who:  Suika
       @When: 24-March-2021
       @Why:  ROST-893
       @What: getter variable
   */
  public getRedirectUri() {
    return this.redirect_uri;
  }


  /*
     @Type: getClientId
     @Who:  Suika
     @When: 24-March-2021
     @Why:  ROST-893
     @What: getter variable
 */

  public getClientId() {
    return this.client_id;
  }


  /*
        @Type: setDisapperTime
        @Who: Renu
        @When: 14-Apr-2021
        @Why:  EWM-1249
        @What: setter variable
    */
  public setDisapperTime(autodisappearTime: any) {
    this.autodisappearTime = autodisappearTime;
  }

  /*
    @Type: getDisapperTime
    @Who: Renu
    @When: 14-Apr-2021
    @Why:  EWM-1249
    @What: getter variable
*/
  public get getDisapperTime() {
    return this.autodisappearTime;
  }

  /*
      @Type: setGmailConfig
      @Who: Renu
      @When: 12-Nov-2021
      @Why:  EWM-3685
      @What: getter variable
  */


  setGmailConfig(gmailConfig: any) {
    this.responsetypeGmail = gmailConfig.response_type;
    this.stateGmail = gmailConfig.state;
    this.scopeGmail = gmailConfig.scope;
    this.clientidGmail = gmailConfig.client_id;
    this.redirecturiGmail = gmailConfig.redirect_uri;
    this.promptGmail = gmailConfig.prompt;

  }
  /*
 @Type: getresponseModeGmail
 @Who:  Renu
  @When: 12-Nov-2021
 @Why:  ROST-3685
 @What: getter variable
*/

  public getresponseModeGmail() {
    return this.responsemodeGmail;
  }
  /*
    @Type: getResponseTypeGmail
      @Who:  Renu
     @When: 12-Nov-2021
     @Why:  ROST-3685
   @What: getter variable
*/

  public getResponseTypeGmail() {
    return this.responsetypeGmail;
  }

  public getPromptGmail() {
    return this.promptGmail;
  }

  /*
     @Type: getStateGmail
       @Who:  Renu
       @When: 12-Nov-2021
     @Why:  ROST-3685
     @What: getter variable
 */

  public getStateGmail() {
    return this.stateGmail;
  }

  /*
    @Type: getScopeGmail
   @When: 12-Nov-2021
     @Why:  ROST-3685
     @What: getter variable
*/

  public getScopeGmail() {
    return this.scopeGmail;
  }

  /*
    @Type: getRedirectUriGmail
    @Who:  Renu
     @When: 12-Nov-2021
     @Why:  ROST-3685
     @What: getter variable
   */
  public getRedirectUriGmail() {
    return this.redirecturiGmail;
  }

  /*
     @Type: getClientIdGmail
     @Who:  Renu
     @When: 12-Nov-2021
     @Why:  ROST-3685
     @What: getter variable
 */

  public getClientIdGmail() {
    return this.clientidGmail;
  }
  /*
      @Type: setOffice365Config
      @Who: Renu
      @When: 14-Sept-2021
      @Why:  EWM-2716
      @What: getter variable
  */

  setOffice365Config(office365Config: any) {
    this.responsetype365 = office365Config.response_type;
    this.state365 = office365Config.state;
    this.scope365 = office365Config.scope;
    this.clientid365 = office365Config.client_id;
    this.redirecturi365 = office365Config.redirect_uri;
    this.responsemode365 = office365Config.response_mode;

  }

  /*
     @Type: getresponseMode365
     @Who:  Renu
     @When: 14-Sept-2021
     @Why:  ROST-2716
     @What: getter variable
 */

  public getresponseMode365() {
    return this.responsemode365;
  }
  /*
    @Type: getResponseType365
      @Who:  Renu
   @When: 14-Sept-2021
   @Why:  ROST-2716
   @What: getter variable
*/

  public getResponseType365() {
    return this.responsetype365;
  }

  /*
     @Type: getState365
       @Who:  Renu
     @When: 14-Sept-2021
     @Why:  ROST-2716
     @What: getter variable
 */

  public getState365() {
    return this.state365;
  }

  /*
    @Type: getScope365
     @Who:  Renu
     @When: 14-Sept-2021
     @Why:  ROST-2716
     @What: getter variable
*/

  public getScope365() {
    return this.scope365;
  }

  /*
       @Type: getRedirectUri365
        @Who:  Renu
     @When: 14-Sept-2021
     @Why:  ROST-2716
     @What: getter variable
   */
  public getRedirectUri365() {
    return this.redirecturi365;
  }

  /*
     @Type: getClientIdOffice365
     @Who:  Renu
     @When: 14-Sept-2021
     @Why:  ROST-2716
     @What: getter variable
 */

  public getClientIdOffice365() {
    return this.clientid365;
  }

  /*
       @Type: setEncryptSecretKey
       @Who: Suika
       @When: 29-Apr-2021
       @Why:  EWM-1425
       @What: setter variable
   */
  public setEncryptSecretKey(encryptSecretKey) {
    this.encryptSecretKey = encryptSecretKey;
  }

  /*
      @Type: getEncryptSecretKey
      @Who: Suika
      @When: 29-Apr-2021
      @Why:  EWM-1425
      @What: getter variable
  */
  public getEncryptSecretKey() {
    return this.encryptSecretKey;
  }

  /*
      @Type: setMenuMoreConfig
      @Who: Suika
      @When: 01-July-2021
      @Why:  EWM-1908
      @What: getter variable
  */

  public setMenuMoreConfig(menuMoreConfig) {
    this.menuMoreConfig = menuMoreConfig;
  }

  /*
     @Type: getMenuMoreConfig
     @Who: Suika
     @When: 01-July-2021
     @Why:  EWM-1908
     @What: getter variable
 */

  public get getMenuMoreConfig() {
    return this.menuMoreConfig;
  }



  /*
    @Type: setGmailConfig
    @Who:  Anup
    @When: 04-FEB-2022
    @Why:  EWM-4063 EWM-4611
    @What: getter variable
*/
  setZoomConfig(zoomConfig: any) {
    this.responsetypeZoom = zoomConfig.response_type;
    this.clientidZoom = zoomConfig.client_id;
    this.redirecturiZoom = zoomConfig.redirect_uri;

  }

  /*
 @Type: setZoomMettingConfig
 @Who:  Nitin Bhati
 @When: 02-March-2022
 @Why:  EWM-5409
 @What: getter variable
*/
  setZoomMeetingConfig(zoomMeetingConfig: any) {
    this.responsetypeZoomMeeting = zoomMeetingConfig.response_type;
    this.clientidZoomMeeting = zoomMeetingConfig.client_id;
    this.redirecturiZoomMeeting = zoomMeetingConfig.redirect_uri;
  }
  /*
    @Type: getResponseTypeZoom
    @Who:  Anup
    @When: 04-FEB-2022
    @Why:  EWM-4063 EWM-4611
    @What: getter variable
*/

  public getResponseTypeZoom() {
    return this.responsetypeZoom;
  }

  /*
    @Type: getRedirectUriZoom
    @Who:  Anup
     @When: 04-FEB-2022
     @Why:  EWM-4063 EWM-4611
     @What: getter variable
   */
  public getRedirectUriZoom() {
    return this.redirecturiZoom;
  }

  /*
     @Type: getClientIdZoom
     @Who:  Anup
     @When: 04-FEB-2022
     @Why:  EWM-4063 EWM-4611
     @What: getter variable
 */

  public getClientIdZoom() {
    return this.clientidZoom;
  }

  /*
       @Type: setzoomCalleeNameConfig
       @Who:  Renu
       @When: 17-FEB-2022
       @Why:  EWM-4472 EWM-4523
       @What: setter variable
   */
  setzoomCalleeNameConfig(zoomCalleeNameConfig) {
    this.zoomCalleeNameConfig = zoomCalleeNameConfig;
  }
  /*
     @Type: getzoomCalleeNameConfig
     @Who:  Renu
     @When: 17-FEB-2022
     @Why:  EWM-4472 EWM-4523
     @What: getter variable
 */

  public getzoomCalleeNameConfig() {
    return this.zoomCalleeNameConfig;
  }



  /*
 @Type: getResponseTypeZoomMeeting
 @Who:  Nitin Bhati
 @When: 02-March-2022
 @Why:  EWM-5409
 @What: getter variable
*/

  public getResponseTypeZoomMeeting() {
    return this.responsetypeZoomMeeting;
  }

  /*
    @Type: getRedirectUriZoom
    @Who:  Nitin Bhati
    @When: 02-March-2022
    @Why:  EWM-5409
     @What: getter variable
   */
  public getRedirectUriZoomMeeting() {
    return this.redirecturiZoomMeeting;
  }

  /*
     @Type: getClientIdZoom
     @Who:  Nitin Bhati
     @When: 02-March-2022
     @Why:  EWM-5409
     @What: getter variable
 */

  public getClientIdZoomMeeting() {
    return this.clientidZoomMeeting;
  }

  /*
       @Type: setzoomCalleeNameConfig
       @Who:  Nitin Bhati
       @When: 02-March-2022
       @Why:  EWM-5409
       @What: setter variable
   */
  setzoomMeetingNameConfig(zoomMeetingNameConfig) {
    this.zoomMeetingNameConfig = zoomMeetingNameConfig;
  }
  /*
     @Type: getzoomCalleeNameConfig
     @Who:  Nitin Bhati
     @When: 02-March-2022
     @Why:  EWM-5409
     @What: getter variable
  */
  public getzoomMeetingNameConfig() {
    return this.zoomMeetingNameConfig;
  }

  /*
 @Type: setMSTeamMeetingConfig
 @Who:  Nitin Bhati
 @When: 14-Aprl-2022
 @Why:  EWM-6183
 @What: getter variable
*/
  setMSTeamConfig(MSTeamConfig: any) {
    this.responsetypeMSTeam = MSTeamConfig.response_type;
    this.clientidMSTeam = MSTeamConfig.client_id;
    this.redirecturiMSTeam = MSTeamConfig.redirect_uri;
    this.responseModeMSTeam = MSTeamConfig.response_mode;
    this.scopeMSTeam = MSTeamConfig.scope;
  }
  /*
   @Type: setGoogleMeetConfig
   @Who:  Nitin Bhati
   @When: 14-Aprl-2022
   @Why:  EWM-6183
   @What: getter variable
 */
  setGoogleMeetConfig(GoogleMeetConfig: any) {
    this.responsetypeGoogleMeet = GoogleMeetConfig.response_type;
    this.clientidGoogleMeet = GoogleMeetConfig.client_id;
    this.redirecturiGoogleMeet = GoogleMeetConfig.redirect_uri;
    this.promptGoogleMeet = GoogleMeetConfig.prompt;
    this.scopeGoogleMeet = GoogleMeetConfig.scope;
  }

  /*
    @Type: getMSTeam
    @Who:  Nitin Bhati
    @When: 02-March-2022
    @Why:  EWM-5409
    @What: getter variable
  */
  public getResponsetypeMSTeam() {
    return this.responsetypeMSTeam;
  }
  public getClientidMSTeam() {
    return this.clientidMSTeam;
  }
  public getRedirecturiMSTeam() {
    return this.redirecturiMSTeam;
  }
  public getResponseModeMSTeam() {
    return this.responseModeMSTeam;
  }
  public getScopeMSTeam() {
    return this.scopeMSTeam;
  }

  /*
   @Type: getMSTeam
   @Who:  Nitin Bhati
   @When: 02-March-2022
   @Why:  EWM-5409
   @What: getter variable
 */
  public getResponsetypeGoogleMeet() {
    return this.responsetypeGoogleMeet;
  }
  public getClientidGoogleMeet() {
    return this.clientidGoogleMeet;
  }
  public getRedirecturiGoogleMeet() {
    return this.redirecturiGoogleMeet;
  }
  public getScopeGoogleMeet() {
    return this.scopeGoogleMeet;
  }
  public getPromptGoogleMeet() {
    return this.promptGoogleMeet;
  }

  /*
       @Type: getMenu Link
       @Who:  Nitin Bhati
       @When: 23-April-2022
       @Why:  EWM-6273
       @What: getter variable
     */
  public get getRoadMapMenuLink() {
    return this.roadMapMenuLink;
  }
  setRoadMapMenuLink(roadMapMenuLink) {
    this.roadMapMenuLink = roadMapMenuLink;
  }

  public get getAPIMenuLink() {
    return this.aPIMenuLink;
  }
  setAPIMenuLink(aPIMenuLink) {
    this.aPIMenuLink = aPIMenuLink;
  }

  public get getDocumentCentreMenuLink() {
    return this.documentCentreMenuLink;
  }
  setDocumentCentreMenuLink(documentCentreMenuLink) {
    this.documentCentreMenuLink = documentCentreMenuLink;
  }

  public get getSupportMenuLink() {
    return this.supportMenuLink;
  }
  setSupportMenuLink(supportMenuLink) {
    this.supportMenuLink = supportMenuLink;
  }

  /*
   @Type: getUtcToDateFormat
   @Who:  Suika
   @When: 28-July-2022
   @What: getter variable convert calender date into UTC  date format
 */
  getUtcDateFormat(param) {
    const d = new Date(param);
    let ParamValue = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
    return ParamValue;
  }

  /*
   @Type: getUtcToDateFormat
   @Who:  Suika
   @When: 28-July-2022
   @What: getter variable convert calender date into UTC From date format
 */
  getUtcFromDateFormat(param) {
    const d = new Date(param);
    let ParamValue = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
    return ParamValue;
  }

  /*
     @Type: getUtcToDateFormat
     @Who:  Suika
     @When: 28-July-2022
     @What: getter variable convert calender date into UTC To date format
   */
  getUtcToDateFormat(param) {
    const d = new Date(param);
    let ParamValue = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, d.getHours(), d.getMinutes()).toISOString();
    return ParamValue;
  }
  setApplicationBaseUrl(applicationBaseUrl) {
    this.applicationBaseUrl = applicationBaseUrl;
  }
  getApplicationBaseUrl() {
    return this.applicationBaseUrl;
  }

  getLookNFeelDateFormat() {
    let dateFormat;
    this.dateTimeFormatVal.subscribe(res => {
      dateFormat = res;
    })
    return dateFormat;
  }

  setBroadbeanregistrationcode(Broadbeanregistrationcode) {
    this.Broadbeanregistrationcode = Broadbeanregistrationcode;
  }
  setBurstSMSRegistrationCode(burstSMSRegistrationCode) {
    this.burstSMSRegistrationCode = burstSMSRegistrationCode;
  }

  /*
    @Type: setMaxsmslength
    @Who: Suika
    @When: 29-sept-2022
    @Why:  EWM-8952
    @What: setter variable
*/
  setMaxsmslength(maxsmslength) {
    this.maxsmslength = maxsmslength;
  }

  /*
    @Type: getMaxsmslength
    @Who: Suika
    @When: 29-sept-2022
    @Why:  EWM-8952
    @What: setter variable
*/
  getMaxsmslength() {
    return this.maxsmslength;
  }

  /*
 @Type: setminimumBalanceSMS
 @Who: Bantee Kumar
 @When: 13-Jan-2023
 @Why:  EWM-10510
 @What: setter variable
*/
  setminimumBalanceSMS(minimumBalanceSMS) {
    this.minimumBalanceSMS = minimumBalanceSMS;
  }
  /*
      @Type: getminimumBalanceSMS
      @Who: Bnatee Kumar
      @When: 13-Jan-2023
      @Why:  EWM-10510
      @What: get variable
  */
  getminimumBalanceSMS() {
    return this.minimumBalanceSMS;
  }

  /*
    @Type: showScreeningInterview
    @Who: Bantee Kumar
    @When: 16-Feb-2023
    @Why:  EWM-10579
    @What: setter variable
*/

  setShowScreeningInterview(showScreeningInterview) {
    this.showScreeningInterview = showScreeningInterview
  }

  /*
      @Type: getShowScreeningInterview
      @Who: Bnatee Kumar
      @When: 16-Feb-2023
      @Why:  EWM-10579
      @What: get variable
  */
  getShowScreeningInterview() {
    return this.showScreeningInterview;
  }





  /*
  @Type: setbroadBeanClientId
  @Who: Adarsh singh
  @When: 03-Feb-2023
  @Why:  EWM-10393
  @What: setter variable
*/
  setbroadBeanClientId(broadBeanClientId) {
    this.broadBeanClientId = broadBeanClientId;
  }

  /*
    @Type: setbroadBeanConfig
    @Who: Adarsh singh
    @When: 13-Feb-2023
    @Why:  EWM-10428
    @What: setter variable
  */
  setbroadBeanConfig(config) {
    this.broadbean = config;
  }
  /*
    @Type: getbroadBeanClientId
    @Who: Adarsh singh
    @When: 03-Feb-2023
    @Why:  EWM-10393
    @What: get variable
*/
  getbroadBeanClientId() {
    return this.broadBeanClientId;
  }
  /*
    @Type: getbroadBeanClientId
    @Who: Adarsh singh
    @When: 13-Feb-2023
    @Why:  EWM-10428
    @What: get variable
*/
  getbroadBeanConfig() {
    return this.broadbean;
  }
  /*
    @Type: setApplicationLinkExpire
    @Who: Adarsh singh
    @When: 04-11-2022
    @Why:  EWM-9326
    @What: setter variable
  */
  setApplicationLinkExpire(applicationLinkExprire) {
    this.applicationLinkExprire = applicationLinkExprire;
  }

  getApplicationLinkExpire() {
    return this.applicationLinkExprire;
  }

  /*
   @Type: setPrefix
   @Who: Nitin Bhati
   @When: 2-DEc-2022
   @Why:
   @What: setter variable for prefix
 */
  setPrefix(prefix: string) {
    this.prefix = prefix;
  }
  public get getPrefix() {
    return this.prefix;
  }

  public setSystemConfig(systemConfig: string) {
    this.systemConfig = systemConfig;
  }
  public get getSystemConfig() {
    return this.systemConfig;
  }

  public setmaxUploadFile(maxUploadFile: number) {
    this.maxUploadFile = maxUploadFile;
  }

  public get getmaxUploadFile() {
    return this.maxUploadFile;
  }

  /*
     @Type: setOptionalMenu
     @Who: Nitin Bhati
     @When: 10-Feb-2022
     @Why:
     @What: setter variable
    */
  setOptionalMenu(optionalMenu) {
    this.optionalMenu = optionalMenu;
  }

  /*
  @Type: setSmsBalance
  @Who: Suika
  @When: 13-Feb-2023
  @Why:
  @What: setter variable
 */
  setSmsBalance(smsBalance) {
    this.smsBalance = smsBalance;
  }

  /*
     @Type: setSmsBalance
     @Who: Suika
     @When: 13-Feb-2023
     @Why:
     @What: getter variable
    */
  public get getSmsBalance() {
    return this.smsBalance;
  }

  /*
     @Type: setdefaultCountryId
     @Who: Suika
     @When: 01-March-2023
     @Why: @EWM-10675 to set dafault country Id
     @What: setter variable
    */
  setdefaultCountryId(defaultCountryId: any) {
    this.defaultCountryId = defaultCountryId;
  }


  /*
    @Type: getdefaultCountryId
    @Who: Suika
    @When: 01-March-2023
    @Why: @EWM-10675 to get dafault country Id
    @What: getter variable
   */
  public get getdefaultCountryId() {
    return this.defaultCountryId;
  }

  /*
  @Type: setdefaultCountryId
  @Who: Suika
  @When: 01-March-2023
  @Why: @EWM-10675 to set dafault country Id
  @What: setter variable
 */
  setdefaultCountryCode(defaultCountryCode: any) {
    this.defaultCountryCode = defaultCountryCode;
  }


  /*
   @Type: getdefaultCountryCode
   @Who: Suika
   @When: 01-March-2023
   @Why: @EWM-10675 to get dafault country Code
   @What: getter variable
  */
  public get getdefaultCountryCode() {
    return this.defaultCountryCode;
  }


  /*
  @Type: setEmployeeStatusActiveKey
  @Who: Suika
  @When: 01-March-2023
  @Why: @EWM-10681 to get dafault status code
  @What: setter variable
  */
  setEmployeeStatusActiveKey(EmployeeStatusActiveKey: any) {
    this.EmployeeStatusActiveKey = EmployeeStatusActiveKey;
  }

  /*
  @Type: getEmployeeStatusActiveKey
  @Who: Suika
  @When: 01-March-2023
  @Why: @EWM-10681 to get dafault status code
  @What: getter variable
  */
  public get getEmployeeStatusActiveKey() {
    return this.EmployeeStatusActiveKey;
  }

  /*
@Type: setEmployeeStatusActiveKey
@Who: Suika
@When: 01-March-2023
@Why: @EWM-10681 to get dafault status code
@What: setter variable
*/
  setJobStatusActiveKey(JobStatusActiveKey: any) {
    this.JobStatusActiveKey = JobStatusActiveKey;
  }

  /*
  @Type: getEmployeeStatusActiveKey
  @Who: Suika
  @When: 01-March-2023
  @Why: @EWM-10681 to get dafault status code
  @What: getter variable
  */
  public get getJobStatusActiveKey() {
    return this.JobStatusActiveKey;
  }

  /*
@Type: setEmployeeStatusActiveKey
@Who: Suika
@When: 01-March-2023
@Why: @EWM-10681 to get dafault status code
@What: setter variable
*/
  setContactStatusActiveKey(ContactStatusActiveKey: any) {
    this.ContactStatusActiveKey = ContactStatusActiveKey;
  }

  /*
  @Type: getEmployeeStatusActiveKey
  @Who: Suika
  @When: 01-March-2023
  @Why: @EWM-10681 to get dafault status code
  @What: getter variable
  */
  public get getContactStatusActiveKey() {
    return this.ContactStatusActiveKey;
  }
  /*
@Type: setEmployeeStatusActiveKey
@Who: Suika
@When: 01-March-2023
@Why: @EWM-10681 to get dafault status code
@What: setter variable
*/
  setClientStatusActiveKey(ClientStatusActiveKey: any) {
    this.ClientStatusActiveKey = ClientStatusActiveKey;
  }

  /*
  @Type: getEmployeeStatusActiveKey
  @Who: Suika
  @When: 01-March-2023
  @Why: @EWM-10681 to get dafault status code
  @What: getter variable
  */
  public get getClientStatusActiveKey() {
    return this.ClientStatusActiveKey;
  }


  /*
@Type: setEmployeeStatusActiveKey
@Who: Suika
@When: 01-March-2023
@Why: @EWM-10681 to get dafault status code
@What: setter variable
*/
  setCandidateStatusActiveKey(CandidateStatusActiveKey: any) {
    this.CandidateStatusActiveKey = CandidateStatusActiveKey;
  }

  /*
  @Type: getEmployeeStatusActiveKey
  @Who: Suika
  @When: 01-March-2023
  @Why: @EWM-10681 to get dafault status code
  @What: getter variable
  */
  public get getCandidateStatusActiveKey() {
    return this.CandidateStatusActiveKey;
  }

  /*
    @Type: setDefaultAcess
    @Who: Renu
    @When: 09-March-2023
    @Why: to set default access persmission
    @What: setter variable
   */
  setDefaultAcess(accessInfo: any) {
    this.accessId = accessInfo?.Id;
    this.accessName = accessInfo?.AccessName;
  }



  /*
  @Type: getDefaultAccessId
  @Who: Renu
  @When: 09-March-2023
  @Why: to get default access permission
  @What: getter variable
 */
  public get getDefaultAccessId() {
    return this.accessId;
  }
  /*
   @Type: getDefaultaccessName
   @Who: Renu
   @When: 09-March-2023
   @Why: to get default access permission
   @What: getter variable
  */
  public get getDefaultaccessName() {
    return this.accessName;
  }
  /*
    @Type: setdefaultlogoSetting
    @Who: maneesh
    @When: 23-March-2023
    @Why: ewm-10646 to set default logo
    @What: getter variable
   */
  public setdefaultlogoSetting(defaultlogo: string) {
    this.defaultlogo = defaultlogo;
  }
  /*
     @Type: getDefaultaccessName
     @Who: maneesh
     @When: 23-March-2023
     @Why:ewm-10646  to get default logo for
     @What: getter variable
    */
  public get defaultlogoSetting() {
    return this.defaultlogo;
  }

  /*
    @Type: setDateFormatPlchldr
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10692
    @What: setter variable
  */
  public setDateFormatPlchldr(format: string) {
    this.dateFormatPlaceholder = format;
  }

  /*
    @Type: dateFormatPlchldr
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10692
    @What: getter variable
  */
  public get dateFormatPlchldr() {
    return this.dateFormatPlaceholder;
  }
  /*
    @Type: setEmailPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: setter variable
  */
  public setEmailPattern(format: string) {
    this.emailPattern = format;
  }

  /*
    @Type: getEmailPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: getter variable
  */
  public get getEmailPattern() {
    return this.emailPattern;
  }
  /*
    @Type: setNumPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: setter variable
  */
  public setNumPattern(format: string) {
    this.numberPattern = format;
  }
  /*
    @Type: getNumPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: getter variable
  */
  public get getNumPattern() {
    return this.numberPattern;
  }
  /*
    @Type: setNumPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: setter variable
  */
  public setNamePattern(format: string) {
    this.namePattern = format;
  }
  /*
    @Type: getNumPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: getter variable
  */
  public get getNamePattern() {
    return this.namePattern;
  }
  /*
    @Type: setNumPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: setter variable
  */
  public setURLPattern(format: string) {
    this.urlpattern = format;
  }
  /*
    @Type: getNumPattern
    @Who: Adarsh singh
    @When: 01-April-2023
    @Why: EWM-10209
    @What: getter variable
  */
  public get getURLPattern() {
    return this.urlpattern;
  }

  /*
    @Type: getNumPattern
    @Who: Nitin Bhati
    @When: 07-May-2023
    @Why: EWM-12199
    @What: getter variable
  */
  public get getDatalimit() {
    return this.Datalimit;
  }
  public get getExpiredays() {
    return this.Expiredays;
  }
  public get getActionDurationDays() {
    return this.ActionDurationDays;
  }
  public get getLastActionListNoOfRecords() {
    return this.LastActionListNoOfRecords;
  }
  public get getShowDummyDashboard() {
    return this.ShowDummyDashboard;
  }
  /*--EWM-12603,@when:24-05-2023,@why:for setter and getter--*/
  public get getClientGraphLimit() {
    return this.ClientGraphLimit;
  }

  public get getApplicationStatusId() {
    return this.ApplicationStatusId;
  }

  /*--EWM-11782,@when:02-06-2023,@why:for setter and getter--*/
  public get getNoOfCanSelectedEachStage() {
    return this.NoOfCanSelectedEachStage;
  }

   /*--EWM-12725,@when:02-06-2023,@why:for setter and getter--*/
  public get getinviteTeammate() {
    return this.inviteTeammate;
  }

   /*--EWM-13083,@when:14-July-2023, Adarsh singh@why:for setter and getter--*/
   public get getLogoutAndSessionExpireSnackbarShow() {
    return this.logoutAndSessionExpireSnackbarShow;
  }

   /*--EWM-13233,@when:26-July-2023, Adarsh singh@why:for setter and getter--*/
   public get getImageUploadConfigForKendoEditor() {
    return this.imageUploadConfigForKendoEditor;
  }

  /*
  @Type: setNumPattern
  @Who: Nitin Bhati
  @When: 07-May-2023
  @Why: EWM-12199
  @What: setter variable
  */
  public setDatalimit(Datalimit: number) {
    this.Datalimit = Datalimit;
  }
  public setExpiredays(Expiredays: number) {
    this.Expiredays = Expiredays;
  }
  public setActionDurationDays(ActionDurationDays: number) {
    this.ActionDurationDays = ActionDurationDays;
  }
  public setLastActionListNoOfRecords(LastActionListNoOfRecords: number) {
    this.LastActionListNoOfRecords = LastActionListNoOfRecords;
  }
  public setShowDummyDashboard(ShowDummyDashboard: number) {
    this.ShowDummyDashboard = ShowDummyDashboard;
  }
  /*--EWM-12603,@when:24-05-2023,@why:for setter and getter--*/
  public setClientGraphLimit(ClientGraphLimit: number) {
    this.ClientGraphLimit = ClientGraphLimit;
  }

  public setApplicationStatusId(applicationStatusId: number) {
    this.ApplicationStatusId = applicationStatusId;
  }

  // @suika @EWM-11782
  public setNoOfCanSelectedEachStage(NoOfCanSelectedEachStage: any) {
    this.NoOfCanSelectedEachStage = NoOfCanSelectedEachStage
  }

  public setinviteTeammate(inviteTeammate){
   this.inviteTeammate = inviteTeammate
  }

  public setLogoutAndSessionExpireSnackbarShow(logoutAndSessionExpireSnackbarShow:number){
    this.logoutAndSessionExpireSnackbarShow = logoutAndSessionExpireSnackbarShow
   }

   /*--EWM-13233,@when:26-July-2023, Adarsh singh@why:for setter and getter--*/
   public setImageUploadConfigForKendoEditor(imageUploadConfigForKendoEditor:Object){
    this.imageUploadConfigForKendoEditor = imageUploadConfigForKendoEditor
   }

  /*
     @Type: setDefault Category
     @Who: Bantee
     @When: 06-June-2023
     @Why: to set default job cateogory
     @What: setter variable
    */
  public setDefaultCategory(defaultCategoryInfo: any) {
    this.categoryId = defaultCategoryInfo?.Id;
    this.categoryName = defaultCategoryInfo?.CategoryName;
  }


  public get getDefaultCategoryId() {
    return this.categoryId;
  }

  public get getDefaultcategoryName() {
    return this.categoryName;
  }

  public get getEOHRegistrationCode() {
    return this.eohRegistrationCode;
  }

  setEOHRegistrationCode(eohRegistrationCode) {
    this.eohRegistrationCode = eohRegistrationCode;
  }
  public get getBrandAppSetting() {
    return this.brandAppSetting;
  }

  setBrandAppSetting(brandAppSetting) {
    this.brandAppSetting = brandAppSetting;
  }
  public get getanouncmenturlOne() {
    return this.anouncmenturlOne;
  }
  public get HeaderKnowledgeBase() {
    return this.loginHeaderKnowledgeBase;
  }
  public get HeaderResources() {
    return this.loginHeaderResources;
  }
  public get HeaderSignUpCreateAccount() {
    return this.loginHeaderSignUpCreateAccount;
  }
  public get HeaderHelpCenter() {
    return this.loginHeaderHelpCenter;
  }
  public get FooterSecurityNoticeboard() {
    return this.loginFooterSecurityNoticeboard;
  }
  public get FooterTermsOfUse() {
    return this.loginFooterTermsOfUse;
  }
  public get FooterPrivacyPolicy() {
    return this.loginFooterPrivacyPolicy;
  }
  public get FooterSecurityNoticUrl() {
    return this.FooterSecurityNoticeboardUrl;
  }
  public get FooterTermsOUrl() {
    return this.FooterTermsOfUseUrl;
  }
  public get FooterPrivacyPolicyURL() {
    return this.FooterPrivacyPolicyUrl;
  }
  public get getexistingworkspace() {
    return this.existingworkspace;
  }
  setanouncmenturlOne(anouncmenturlOne) {
    this.anouncmenturlOne = anouncmenturlOne;
  } 
  setloginHeaderKnowledgeBase(loginHeaderKnowledgeBase) {
    this.loginHeaderKnowledgeBase = loginHeaderKnowledgeBase;
  } 
  setloginHeaderResources(loginHeaderResources) {
    this.loginHeaderResources = loginHeaderResources;
  } 
  setloginHeaderSignUpCreateAccount(loginHeaderSignUpCreateAccount) {
    this.loginHeaderSignUpCreateAccount = loginHeaderSignUpCreateAccount;
  } 
  setloginHeaderHelpCenter(loginHeaderHelpCenter) {
    this.loginHeaderHelpCenter = loginHeaderHelpCenter;
  }

  setloginFooterSecurityNoticeboard(loginFooterSecurityNoticeboard) {
    this.loginFooterSecurityNoticeboard = loginFooterSecurityNoticeboard;
  } 
  setloginFooterTermsOfUse(loginFooterTermsOfUse) {
    this.loginFooterTermsOfUse = loginFooterTermsOfUse;
  } 
  setloginFooterPrivacyPolicy(loginFooterPrivacyPolicy) {
    this.loginFooterPrivacyPolicy = loginFooterPrivacyPolicy;
  }
  setFooterSecurityNotice(FooterSecurityNoticeboardUrl) {
    this.FooterSecurityNoticeboardUrl = FooterSecurityNoticeboardUrl;
  } 
  setFooterTerms(FooterTermsOfUseUrl) {
    this.FooterTermsOfUseUrl = FooterTermsOfUseUrl;
  } 
  setFooterPrivacyPolicy(FooterPrivacyPolicyUrl) {
    this.FooterPrivacyPolicyUrl = FooterPrivacyPolicyUrl;
  }

  setexistingworkspace(existingworkspace) {
    this.existingworkspace = existingworkspace;
  } 
  /*
    @Type: setPhoneNumberPattern
    @Who: Suika
    @When: 14-Sept-2023
    @Why: EWM-14300
    @What: setter variable
  */
 public setPhoneNumberPattern(format: string) {
  this.phoneNumberPattern = format;
}
/*
  @Type: getPhoneNumberPattern
  @Who: Suika
  @When: 14-Sept-2023
  @Why: EWM-14300
  @What: getter variable
*/
public get getPhoneNumberPattern() {
  return this.phoneNumberPattern;
}
 /* @Type: getDocumentfileTypeXeopleResume @Who: Renu  @When: 10-Sep-2021 @Why:EWM-137088 EWM-13925 @What: setter variable */
  public getDocumentfileTypeXeopleResume() {
    return this.file_type_xeoplEmailResume;
  }
 /* @Type: getDocumentfileTypeXeopleResume @Who: Renu  @When: 10-Sep-2021 @Why:EWM-137088 EWM-13925 @What: setter variable */
  public setNoOfMembersEOHInfo(setNoOfMembersEOH: number) {
    this.NoOfMembersEOHExtract = setNoOfMembersEOH;
  }

  /* @Type: getDocumentfileTypeXeopleResume @Who: Renu  @When: 10-Sep-2021 @Why:EWM-137088 EWM-13925 @What: getter variable */
  public get getNoOfMembersEOHInfo() {
    return this.NoOfMembersEOHExtract;
  }
  /* @Type: setAlphaNumericPattern @Who: Renu  @When: 19-Sep-2021 @Why:EWM-13752 EWM-14377 @What: setter variable */
  public setAlphaNumericPattern(format: string) {
    this.alphaNumericPattern = format;
  }
   /* @Type: getAlphaNumericPattern @Who: Renu  @When: 10-Sep-2021 @Why:EWM-13752 EWM-14377 @What: getter variable */
  public get getAlphaNumericPattern() {
    return this.alphaNumericPattern;
  }
  /* @Type: setpushNotificationStatus @Who: Renu  @When: 13-10-2021 @Why:EWM-14696 EWM-14710 @What: setter variable */
  public setpushNotificationStatus(setpushStatus: number) {
    this.pushNotificationStatus = setpushStatus;
  }
 /* @Type: getpushNotificationStatus @Who: Renu  @When: 10-10-2021 @Why:EWM-14696 EWM-14710 @What: getter variable */
 public get getpushNotificationStatus() {
  return this.pushNotificationStatus;
}
public setappVersion(appVersion:string){
  this.appVersion = appVersion;
}
/*
  @Type: getPhoneNumberPattern
  @Who: maneesh
  @When: 07-nov-2023
  @Why: EWM-14477
  @What: getter variable
*/
  public get getInneedRegistrationCode() {
    return this.indeedRagistrationCode;
  }
/*
  @Type: getPhoneNumberPattern
  @Who: maneesh
  @When: 07-nov-2023
  @Why: EWM-14477
  @What: setter variable
*/
  setInneedRegistrationCode(indeedRagistrationCode) {
    this.indeedRagistrationCode = indeedRagistrationCode;
  }

    /*
   @Type: set doc share url
   @Who: Adarsh singh
   @When: 22-Jan-2025
 */
   setExternalSharedLink(exLink: string) {
    this.ExternalSharedLink = exLink;
  }

  //  @Who: Ankit Rawat, @When: 29-jan-2024, @Why: EWM-15577-EWM-15840 (Allow some special characters on First and Last Name)
  setSpecialcharNamePattern(specialcharNamePattern: string) {
    this.specialcharNamePattern = specialcharNamePattern;
  }

  setNotificationDebugStatus(NotificationDebugStatus: boolean) {
    this.NotificationDebugStatus = NotificationDebugStatus;
  }
  setLogging(logging: Logging) {
    this.logging = logging;
  }
  // <!-- by maneesh  ewm-17967 fixed vxt integration when:29/08/2024 -->
  public get getVxtRegistrationCode() {
    return this.vxtRagistrationCode;
  }
  setVxtRegistrationCode(vxtRagistrationCode) {
    this.vxtRagistrationCode = vxtRagistrationCode;
  }
  setdashboardurl(dashboardurl) {
    this.dashboardurl = dashboardurl;
  }
 
  setProfessionallevelActiveKey(ProfessionallevelActiveKey: any) {
    this.ProfessionallevelActiveKey = ProfessionallevelActiveKey;
  }
  public get getProfessionallevelActiveKey() {
    return this.ProfessionallevelActiveKey;
  }
  
}


