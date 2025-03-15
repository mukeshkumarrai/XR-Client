/*
@(C): Entire Software
@Type: File, <ts>
@Name: commonservice.service.ts
@Who: Renu
@When: 18-nov-2020
@Why: ROST-316
@What: this file is used for common observable service to communicate b/q compenents independenantly
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs/operators/delay';
import { ResponseData } from '../common-servies.service';
import { Title } from '@angular/platform-browser';
import { catchError, distinctUntilChanged, retry } from 'rxjs/operators';
import { handleError } from '../../helper/exception-handler';
import { ServiceListClass } from '../sevicelist';
import { AppSettingsService } from '../app-settings.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { permissions } from '../../models/common.model';
import * as moment from 'moment';
import { JobScreening } from '../../models/job-screening';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData } from '../../models/responce.model';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '../snackbar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  private drawer: MatDrawer;

  onRegionSelect: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public userDetailsObs = this.onRegionSelect.asObservable();

  onProfileImageSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public userDetailsObs1 = this.onProfileImageSelect.asObservable();

  onUserLanguage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onUserLanguageChange = this.onUserLanguage.asObservable();

  onnameManageChange: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ononnameManageChangeObs = this.onnameManageChange.asObservable();

  onUserLanguageDirection: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onUserLanguageDirections = this.onUserLanguageDirection.asObservable();

  onMFASelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onMFASelectChange = this.onMFASelect.asObservable();

  onHeaderColorSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onHeaderColorSelectChange = this.onHeaderColorSelect.asObservable();

  onHighlightBackgroundSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onHighlightBackgroundSelectChange = this.onHighlightBackgroundSelect.asObservable();

  onHeaderBackgroundSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onHeaderBackgroundSelectChange = this.onHeaderBackgroundSelect.asObservable();

  onHighlightColorSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onHighlightColorSelectChange = this.onHighlightColorSelect.asObservable();


  onTemplateSelect: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public templateDetailsObs = this.onTemplateSelect.asObservable();

  onChangeLngForClientText: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changeLngForClientTextObs = this.onChangeLngForClientText.asObservable();

  onChangeLngForClientsText: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changeLngForClientsTextObs = this.onChangeLngForClientsText.asObservable();

  onChangeLngForEmployeeText: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changeLngForEmployeeTextObs = this.onChangeLngForEmployeeText.asObservable();

  onChangeLngForEmployeesText: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changeLngForEmployeesTextObs = this.onChangeLngForEmployeesText.asObservable();

  onleftPanelWidth: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changeleftPanelWidthObs = this.onleftPanelWidth.asObservable();

  onrightPanelWidth: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changerightPanelWidthObs = this.onrightPanelWidth.asObservable();

  private currentUserPermissionSubject = new BehaviorSubject<any>({});
  public currentUserPermission = this.currentUserPermissionSubject.asObservable().pipe(distinctUntilChanged());

  candidatesummaryDashboardSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public changecandidatesummaryDashboardObs = this.candidatesummaryDashboardSubject.asObservable();

  onJobCopySectionSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public JobCopySectionObs = this.onJobCopySectionSelect.asObservable();


  onActivityListing: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ActivityListingObs = this.onActivityListing.asObservable();

  onActivityDateFilter: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ActivityDateFilterObs = this.onActivityDateFilter.asObservable();


  onActivityDateFilterClear: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ActivityDateFilterClearObs = this.onActivityDateFilterClear.asObservable();


  onActivityCategoryFilter: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ActivityCategoryFilterObs = this.onActivityCategoryFilter.asObservable();


  onActivityCategoryFilterClear: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ActivityCategoryFilterClearObs = this.onActivityCategoryFilterClear.asObservable();

  onActivityCreateGetList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ActivityCreateGetListObs = this.onActivityCreateGetList.asObservable();


  activePageLabel: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public activePageLabelObs = this.activePageLabel.asObservable();

  xeopleSearchService:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public xeopleSearchServicedata = this.xeopleSearchService.asObservable();


      xeopleSearchAssign:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public xeopleSearchAssignData = this.xeopleSearchAssign.asObservable();

  xeopleSearchMail:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public xeopleSearchmail = this.xeopleSearchMail.asObservable();

  DisabelData:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public xeopleSearchDisabel = this.DisabelData.asObservable();

  setFilterInfo:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public getFilterInfo = this.setFilterInfo.asObservable();

  onOrganizationLogo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onOrganizationLogoSelectChange = this.onOrganizationLogo.asObservable();

  onFavicon: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onFaviconSelectChange = this.onFavicon.asObservable();

  setFilterInfoEOH:BehaviorSubject<any>=new BehaviorSubject<any>(null);
  public getFilterInfoEOH = this.setFilterInfoEOH.asObservable();
  /*
 @Type: File, <ts>
 @Name: userTenantInfo/onuserTenantInfoChange
 @Who: Renu
 @When: 07-Apr-2021
 @Why: EWM-1289
 @What: used for storing user teanant info
 */

  private userTenantInfo = new ReplaySubject<any>(1);
  private usershortTokenInfo = new ReplaySubject<any>(1);

  onOrgSelect: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public OrgSelectObs = this.onOrgSelect.asObservable();

  onOrgSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public OrgSelectIdObs = this.onOrgSelectId.asObservable();

  onClientSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ClientSelectIdObs = this.onClientSelectId.asObservable();

  onClientOrgFilterSelected: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ClientOrgFilterSelectedObs = this.onClientOrgFilterSelected.asObservable();

  isClientOrgReload: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isClientOrgReloadObs = this.isClientOrgReload.asObservable();

  isClientOrgBackReload: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isClientOrgBackReloadObs = this.isClientOrgBackReload.asObservable();


  isClientOrgReloadId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isClientOrgReloadIdObs = this.isClientOrgReloadId.asObservable();

  onJobSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public JobSelectIdObs = this.onJobSelectId.asObservable();

  onJobSeekButtonStatusId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public JobSeekButtonStatusIdObs = this.onJobSeekButtonStatusId.asObservable();


  onSeekJobPreviewSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public SeekJobPreviewSelectIdObs = this.onSeekJobPreviewSelectId.asObservable();

  onSeekJobPublishedSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public SeekJobPublishedSelectIdObs = this.onSeekJobPublishedSelectId.asObservable();

  onselectedIndexId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public SeekselectedIndexIdObs = this.onselectedIndexId.asObservable();

  onSeekJobformValidSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public SeekJobformValidSelectIdObs = this.onSeekJobformValidSelectId.asObservable();

  onSeekJobformValidSelectIdActive: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public SeekJobformValidSelectIdObsActive = this.onSeekJobformValidSelectIdActive.asObservable();

  onOrgSelectFolderId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public OrgSelectFolderIdObs = this.onOrgSelectFolderId.asObservable();

  onOrgSelectJsonId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public OrgSelectJsonIdObs = this.onOrgSelectJsonId.asObservable();


  onOrgSelectLastLogin: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onOrgSelectLastLoginObs = this.onOrgSelectLastLogin.asObservable();

  onOrganizationAdd: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public refreshOrgObs = this.onOrganizationAdd.asObservable();

  documentAdded: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public documentAddedObs = this.documentAdded.asObservable();
  appTitle: string;

  ondefultCountry: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ondefultCountryObs = this.ondefultCountry.asObservable();
  public permissonInfo: any;

  emailDocument: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public emailDocumentObs = this.emailDocument.asObservable();

  configueApplicationForm: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public configueApplicationFormObj = this.configueApplicationForm.asObservable();

  knockoutQuestionForm: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public knockoutQuestionFormObj = this.knockoutQuestionForm.asObservable();

  knockoutQuestionFormSaveStatus: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public knockoutQuestionFormSaveStatusObj = this.knockoutQuestionFormSaveStatus.asObservable();

  stepperSelectedInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onstepperInfoChange = this.stepperSelectedInfo.asObservable();

  jobDrawer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onjobDrawerChange = this.jobDrawer.asObservable();

  importantLinksForm: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public importantlinkFormObj = this.importantLinksForm.asObservable();

  public assessmentTotalQuestionsCount =  new BehaviorSubject<any>(null);

  assessmentTotalNoOfQuestion: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public assessmentTotalNoOfQuestionObj = this.assessmentTotalNoOfQuestion.asObservable();

  popupCloseService: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public popupCloseServiceObj = this.popupCloseService.asObservable();

  documentPageLabel: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public documentPageLabelobs = this.documentPageLabel.asObservable();

  updateClientData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateClientDataObs = this.updateClientData.asObservable();
 jobClientId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public notesClientId = this.jobClientId.asObservable();

  onIndeedJobPreviewSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public IndeedJobPreviewSelectIdObs = this.onIndeedJobPreviewSelectId.asObservable();

  onSeekJobPreviewIframeId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public SeekJobPreviewIframeIdObs = this.onSeekJobPreviewIframeId.asObservable();

  notestimestampResponce: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public notestimestampResp = this.notestimestampResponce.asObservable();
  // Adarsh singh 09 Feb 2023  ewm - 10280
  public shareJobApplicationUrl:any;
  public applicationBaseUrl:any;
  applicationLinkExpire: any;
  subdomain:string;
  private JobScreeningModel = new ReplaySubject<any>(1); /*** @Who: renu @when:25-05-02023 @why: EWM-11781 EWM-12517 ********/
  private JobInterviewModel = new ReplaySubject<any>(1);
  private JobInterviewTimeZoneModel = new ReplaySubject<any>(1);
  private JobInterviewAteendeeModel = new ReplaySubject<any>(1);
  private JobInterviewActivityNotCreatedModel = new ReplaySubject<any>(1);

  leftMenuServiceObs: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public leftMenuServiceObsObj = this.leftMenuServiceObs.asObservable();

  JobScreeningCandidateObs: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public JobScreeningCandidateObsServiceObs = this.JobScreeningCandidateObs.asObservable();

  checklistServiceObs: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public checklistServiceObsObj = this.checklistServiceObs.asObservable();

  groupchecklistServiceObs: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public groupchecklistServiceObsObj = this.groupchecklistServiceObs.asObservable();

  ChangeStatus: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ChangeStatusObj = this.ChangeStatus.asObservable();
// end
public JobXeopleSearch:BehaviorSubject<any> = new BehaviorSubject<any>(null);
JobXeopleSearch$ = this.JobXeopleSearch.asObservable();

getcontactsms: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public getcontactsmsHistroy = this.getcontactsms.asObservable();

getContactSummerySms: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public getContactSummerySmsData = this.getContactSummerySms.asObservable();
 
selectedContact: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public selectedContactForSms = this.selectedContact.asObservable();

public updateCandidateHeaderdata: BehaviorSubject<any> = new BehaviorSubject<any>(null);
CandidateSummeryHeaderdata = this.updateCandidateHeaderdata.asObservable();

sendsmsResponce: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public contactlistSendSmsResponce = this.sendsmsResponce.asObservable();

onActivityDateFilterCount: BehaviorSubject<any> = new BehaviorSubject<any>(null);//who:maneesh,what:ewm-16043 when:13/03/2024
public PastActivityDateFilterCount = this.onActivityDateFilterCount.asObservable();

changeStatusCandidate: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public UpdateChangeStatus = this.changeStatusCandidate.asObservable();

changeStatusEmployee: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public employeeUpdateChangeStatus = this.changeStatusEmployee.asObservable();
configueApplicationFormAlertMessage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public configueApplicationFormAlertObj = this.configueApplicationFormAlertMessage.asObservable();

xeoplesearchJobData: BehaviorSubject<any> = new BehaviorSubject<any>(null);//who:maneesh,what:ewm-16043 when:13/03/2024
public xeoplesearchJobDataId = this.xeoplesearchJobData.asObservable();

updateActivityCount: BehaviorSubject<any> = new BehaviorSubject<any>(null);//who:maneesh,what:ewm-16995
public updateActivityCountJobSummery = this.updateActivityCount.asObservable();

countDataRefreshForContact: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public countRefreshForContact = this.countDataRefreshForContact.asObservable();

showJobTag: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public showJobTagThreedotEmail = this.showJobTag.asObservable();
public ParentSource: string;

refreshchildSourceData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public refreshchildSource = this.refreshchildSourceData.asObservable();

getContactDataForRedirect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public getContactData = this.getContactDataForRedirect.asObservable();

VxtCountApiCall: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public VxtCountApiCallData = this.VxtCountApiCall.asObservable();

 onLeadSelectId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public LeadSelectIdObs = this.onLeadSelectId.asObservable();
leadList: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public leadListData = this.leadList.asObservable();

leadListMode: BehaviorSubject<any> = new BehaviorSubject<any>(null);
public leadListModeData = this.leadListMode.asObservable();

private sharedClientIdEOH = new BehaviorSubject<string>(''); 
ClientIdEOH$ = this.sharedClientIdEOH.asObservable();

private sharedMemberIdEOH = new BehaviorSubject<string>(''); 
MemberIdEOH$ = this.sharedMemberIdEOH.asObservable();

 constructor(private http: HttpClient, private titleService: Title, private serviceListClass: ServiceListClass, private _appSetting: AppSettingsService, private _systemSettingService: SystemSettingService,
    private appConfigService: AppSettingsService,public candidateService: CandidateService,
    private translateService: TranslateService, private snackBService: SnackBarService) {
      this.ParentSource=this._appSetting.SourceCodeParam['Broadbean'];
    let StoredTenant = localStorage.getItem('StoredTenantData');
    let StoredshortToken = localStorage.getItem('StoredshortToken');
    if (StoredTenant && StoredshortToken)
      this.setTenantInfo(JSON.parse(StoredTenant), StoredshortToken);
      // Adarsh singh 09 feb 2023 ewm - 10280
      this.applicationBaseUrl =  appConfigService.applicationBaseUrl;
      this.applicationLinkExpire = appConfigService.applicationLinkExprire;
      this.subdomain=localStorage.getItem("tenantDomain");
    // End

  }



  private fireEvent = new Subject<string>();
  event = this.fireEvent.asObservable();
  emitEvent(dirVal: string) {
    this.fireEvent.next(dirVal);
  }

  /*
  @Type: File, <ts>
  @Name: commonservice.service.ts
  @Who: Renu
  @When: 22-dec-2020
  @Why: ROST-572
  @What: used for observable that emits when a scroll event is fired on the host element.
  */

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  /*
  @Type: File, <ts>
  @Name: commonservice.service.ts
  @Who: Renu
  @When: 22-dec-2020
  @Why: ROST-572
  @What: used for toggle event from header to module file in mobile Menu
  */

  toggle(): void {
    this.drawer.toggle();
  }


  /*
  @Type: File, <ts>
  @Name: commonservice.service.ts
  @Who: Renu
  @When: 22-dec-2020
  @Why: ROST-572
  @What: used for toggle close from header to module file in mobile Menu
  */

  toggleclose(): void {
    this.drawer.close();
  }
  // Set Title
  setTitle(menuName,otherParam:string =null) {
    let transString;
    let result;
    if (menuName !== undefined && menuName !== null){
      this.translateService.get(menuName).subscribe((responce: string) => {
        transString = responce;
      });
      result = this.replaceText(transString);
      result = result?.substring(0,1)?.toUpperCase() + result?.substring(1)?.toLowerCase();//Ewm-18712 by maneeesh when:11/11/2024 as discuss with mukesh sir
      if(otherParam !=null){
        result = result + otherParam;
        }
      this.titleService.setTitle(result);
    }
  }
  replaceText(value) {
    let result: string;
    let manageData = [JSON.parse(localStorage.getItem('ManageName'))];
    let lang = localStorage.getItem('Language');

    for (let obj of manageData) {
      for (let key in obj) {
        let objKey = Object.assign({}, JSON.parse(obj[key]));
        let replacekey = '{{' + key.toLowerCase() + '}}';
        if (value != undefined) {
          if (value.includes(replacekey)) {
            if (value.indexOf(replacekey) > 0) {
              result = value.replaceAll(replacekey, objKey[lang].toLowerCase());
            }
            else {
              result = value.replaceAll(replacekey, objKey[lang]);
            }
            return result;
          } else {
            result = value;
          }
        }
      }
    }

    return result;
}
getmenuIfo(){

}
setCustomeTitle(menuName) {
  this.titleService.setTitle(menuName);
}

  /*
 @Type: File, <ts>
 @Name: commonservice.service.ts
 @Who: Priti Srivasatva
 @When: 22-Feb-2021
 @Why: EWM-852
 @What: used for refresh header search
 */
  invokeEvent: Subject<any> = new Subject();
  refreshSearchComponent() {
    this.invokeEvent.next();
  }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

  /*
 @Type: File, <ts>
 @Name: setTenantInfo
 @Who: Renu
 @When: 09-Apr-2021
 @Why: EWM-1289
 @What: Set Tenant Info
 */
  setTenantInfo(TenantData: any, shortToken: any) {
    localStorage.setItem('StoredTenantData', JSON.stringify(TenantData));
    localStorage.setItem('StoredshortToken', shortToken);
    this.userTenantInfo.next(TenantData);
    this.usershortTokenInfo.next(shortToken);
  }
  /*
   @Type: File, <ts>
   @Name: getTenantInfo
   @Who: Renu
   @When: 09-Apr-2021
   @Why: EWM-1289
   @What: Get Tenant Info
   */
  getTenantInfo() {
    return this.userTenantInfo;
  }
  /*
   @Type: File, <ts>
   @Name: getshortTokenInfo
   @Who: Renu
   @When: 09-Apr-2021
   @Why: EWM-1289
   @What: get Short Token
   */
  getshortTokenInfo() {
    return this.usershortTokenInfo;
  }


  /*
     @Type: File, <ts>
     @Name: getStatusList
     @Who: Renu
     @When: 20-May-2021
     @Why: ROST-1539
     @What: get status list data
     */
  getStatusList() {
    return this.http.get(this.serviceListClass.getAllstatus).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: sourceLabelData
     @Who: Suika
     @When: 21-Feb-2022
     @Why: ROST-4722
     @What: get status list data
     */
    getSourceList() {
      return this.http.get(this.serviceListClass.sourceLabelData).pipe(
        retry(1),
        catchError(handleError)
      );
    }


  /*
   @Type: File, <ts>
   @Name: getStatusList
   @Who: Suika
   @When: 24-May-2021
   @Why: ROST-1550
   @What: get status list data
   */
  getRegisteredUserList() {
    return this.http.get(this.serviceListClass.getRegisteredUserList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getUserDetailsByID() {
    return this.http.get(this.serviceListClass.userDetailsByID).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Name: Save user activity
    @Who: priti Srivastava
    @When: 2-july-2021
    @Why: EWM-1989
    @What: get status list data
    */
  saveUserActivity(data: any): Observable<any> {

    return this.http.post(this.serviceListClass.createUseractivity, JSON.stringify(data)).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getGenericDropdownList()
  @Who: Renu
  @When: 18-aUG-2021
  @Why: EWM-2447
  @What: get data for dropdown based on endpoint passed
  */
  getGenericDropdownList(apiEndPoint: any): Observable<any> {
    return this.http.get(apiEndPoint).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: setPermissionsInfo
 @Who: Renu
 @When: 06-Sept-2021
 @Why: EWM-2295
 @What: Set User permissions
 */

  setPermissionsInfo(permissons: any) {
    this.permissonInfo = permissons;
    this.currentUserPermissionSubject.next(this.permissonInfo);
  }

  /*
    @Type: File, <ts>
    @Name: getPermissionsInfo
    @Who: Renu
    @When: 06-Sept-2021
    @Why: EWM-2295
    @What: Set User permissions
    */
  getPermissionsInfo() {
    return this.permissonInfo;
  }
  getNameShort(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName;

  }

   /*
    @Type: File, <ts>
    @Name: convertDate
    @Who:Renu
    @When: 17-Feb-2022
    @Why: EWM-4478 EWM-4715
    @What: convert only date format to api
    */
     convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(inputFormat)
      return [d.getFullYear(), pad(d.getMonth()+1),pad(d.getDate()) ].join('-')
    }


   /*
    @Type: File, <ts>
    @Name: getTimeAndpatchInDate
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why: EWM-4478 EWM-4715
    @What: convert only date from mat date picker
    */
  getTimeAndpatchInDate(dateValue,time){
    var hrs = time?.split(':')[0];
    var min =  time?.split(':')[1];
    dateValue?.setHours(hrs);
    dateValue?.setMinutes(min);

   // const sendOnlyDate = moment.utc(value).local().format('YYYY-MM-DD');
    const sendDateWithInputTime =new Date(dateValue);

    return this.convertDate(sendDateWithInputTime);

  }

  getIndustryActiveList(){
    return this.http.get(this.serviceListClass.getIndustryAll+'?search=active').pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getAllSkillList(){
    return this.http.get(this.serviceListClass.getAllSkillGroupList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getUtCToLocalDate(date){
    let DateTimeFormat = 'YYYY-MM-DD';//localStorage.getItem('DateTimeFormat');
    let TimeZone = localStorage.getItem('UserTimezone');
    let local_date =  moment.utc(date).tz(TimeZone).format(DateTimeFormat);
   // return moment.utc(date).local().format('YYYY-MM-DD');
    return local_date;
  }

    /*
    @Type: File, <ts>
    @Name: logErrorApi
    @Who: Renu
    @When: 05-Sep-2022
    @Why: EWM-8235 EWM-8659
    @What: log error in API caught by status network
    */
  logErrorApi(formData): Observable<any> {
    return this.http.post(this.serviceListClass.errorLogStatus, formData).pipe(
      retry(1),
      catchError(handleError)
    )
  }
 /*
     @Type: File, <ts>
     @Name: getStatusList
     @Who: Renu
     @When: 20-May-2021
     @Why: ROST-1539
     @What: get status list data
     */
    //  getStatusList() {
    //   return this.http.get(this.serviceListClass.getAllstatus).pipe(
    //     retry(1),
    //     catchError(handleError)
    //   );
    // }

    getWeightageUserType()
{
  return this.http.get(this.serviceListClass.weighageExperience ).pipe(
    retry(1),
    catchError(handleError)
  );
}

  /*
    @Type: File, <ts>
    @Name: shareJobApplicationURL
    @Who: Adarsh Singh
    @When: 09-Feb-2023
    @Why: EWM-10280 EWM-10428
    @What: create a common function for using share application form
  */
  onshareJobApplicationURL(JobId: string,domain) {
      // <!---------@When: 23-Aug-2023 @who:Adarsh singh @why: EWM-13692--------->
     // let domain = localStorage.getItem("tenantDomain");
    return this.shareJobApplicationUrl = this.applicationBaseUrl + '/application/apply?mode=apply&jobId=' + JobId + '&domain=' + domain+'&parentSource='+this.ParentSource;
  }




/*
  @Type: File, <ts>
  @Name: getAllColorCode
  @Who: Adarsh Singh
  @When: 09-Feb-2023
  @Why: EWM-10611 EWM-11033
  @What: get all custome color code from assets file
*/
 getAllColorCode(): Observable<any> {
  return this.http.get('assets/config/custom-color-code.json').pipe(
    retry(1),
    catchError(handleError)
  )
}
/*
 @Type: File, <ts>
 @Name: setJobScreeningInfo
 @Who: Renu
 @When: 25-May-20233
 @Why: EWM-11781 ewm-12517
 @What: Set job screening info
 */
 setJobScreeningInfo(JobScreening: JobScreening) {
  this.JobScreeningModel.next(JobScreening);
}

/*
 @Type: File, <ts>
 @Name: getJobScreeningInfo
 @Who: Renu
 @When: 25-May-20233
 @Why: EWM-11781 ewm-12517
 @What: get job screening info
 */
 getJobScreeningInfo() {
 return this.JobScreeningModel;
}

// @Name: getGenericDropdownList()
// @Who: Renu
// @When: 18-aUG-2021
// @Why: EWM-2447
// @What: get data for dropdown based on endpoint passed
// */
jobActionsGenricAPI(apiEndPoint: any, data:any): Observable<any> {
  return this.http.post(apiEndPoint, data).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
   @Type: File, <ts>
   @Name: candidateProfileReadUnread function
   @Who: Adarsh Singh
   @When: 03-July-2023
   @Why: EWM-12879 EWM-1293
*/
  candidateProfileReadUnread(CanidateId: [string], jobId: string) {
    let obj = {
      JobId: jobId,
      CandidateId: CanidateId
    }
    this.candidateService.profileReadInread(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }

  /*
 @Type: File, <ts>
 @Name: setJobInterviewInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: Set job Interview info
 */
 setJobInterviewInfo(JobInterview) {
  this.JobInterviewModel.next(JobInterview);
}

/*
 @Type: File, <ts>
 @Name: getJobInterviewInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: get job Interview info
 */
 getJobInterviewInfo() {
 return this.JobInterviewModel;
}

  /*
 @Type: File, <ts>
 @Name: setJobInterviewTimeZoneInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: Set job Interview info
 */
 setJobInterviewTimeZoneInfo(JobInterviewTimeZone) {
  this.JobInterviewTimeZoneModel.next(JobInterviewTimeZone);
}

/*
 @Type: File, <ts>
 @Name: getJobInterviewTimeZoneInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: get job Interview info
 */
 getJobInterviewTimeZoneInfo() {
 return this.JobInterviewTimeZoneModel;
}

 /*
 @Type: File, <ts>
 @Name: setJobInterviewAttendeeInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: Set for attendee infor
 */
 setJobInterviewAttendeeInfo(AttendeeInfor) {
  this.JobInterviewAteendeeModel.next(AttendeeInfor);
}

/*
 @Type: File, <ts>
 @Name: getJobInterviewAttendeeInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: get for attendee info
 */
 getJobInterviewAttendeeInfo() {
 return this.JobInterviewAteendeeModel;
}


 /*
 @Type: File, <ts>
 @Name: setActivityNotCreatedInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: Set for attendee infor
 */
 setActivityNotCreatedInfo(activityNotCreated) {
  this.JobInterviewActivityNotCreatedModel.next(activityNotCreated);
}

/*
 @Type: File, <ts>
 @Name: getActivityNotCreatedInfo
 @Who: Nitin Bhati
 @When: 05-July-20233
 @Why: EWM-11778 EWM-12970
 @What: get for attendee info
 */
 getActivityNotCreatedInfo() {
 return this.JobInterviewActivityNotCreatedModel;
}

/*  @Name: downloadPdf function @Who: Mukesh  @When: 18-09-2023 @Why: EWM-14389
    @What:For download pdf
    */
    downloadPdf(htmlData): Observable<any> {
      return this.http.post(this.serviceListClass.downloadDocumentByHtml, htmlData, {
        reportProgress: true,
        responseType: 'blob',
      })
        .pipe(retry(0), catchError(handleError));
    }

    setSelectedJob(jobs: any) {
      this.JobXeopleSearch.next(jobs);
    }

/*
  @Name: getGenericDropdownList_v2()
  @Who: Adarsh singh

  */
  getGenericDropdownList_v2(apiEndPoint: any): Observable<any> {
    return this.http.get(apiEndPoint).pipe(
      retry(1),
      catchError(handleError)
    );
  }

    /*
   @Type: File, <ts>
   @Name: candidateProfileUnread function
   @Who: Renu
   @When: 26-Oct-2023
   @Why: EWM-14918 EWM-14941
*/
  candidateProfileUnread(CanidateId: [string], jobId: string) {
    let obj = {
      JobId: jobId,
      CandidateId: CanidateId,
      ProfileStatus:0
    }
    this.candidateService.profileUnread(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }


  setClientIdEOHValue(value: string) {
    this.sharedClientIdEOH.next(value);
  }

  setMemberIdEOHValue(value: string) {
    this.sharedMemberIdEOH.next(value);
  }
}
