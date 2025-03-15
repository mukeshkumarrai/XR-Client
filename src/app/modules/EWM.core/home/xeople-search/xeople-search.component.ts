import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig } from '../../shared/datamodels';
import { XeopleSearchService } from '../../../EWM.core/shared/services/xeople-search/xeople-search.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { QuickJobService } from '../../shared/services/quickJob/quickJob.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { XeopleSearchSmsComponent } from './xeople-search-sms/xeople-search-sms.component';
import { GoogleMapsLocationPopComponent } from 'src/app/shared/modal/google-maps-location-pop/google-maps-location-pop.component';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { XeopleSearchMailComponent } from './xeople-search-mail/xeople-search-mail.component';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { XeopleSaveFilterComponent } from './xeople-save-filter/xeople-save-filter.component';
import { XeopleSearchTimelinesComponent } from './xeople-search-timelines/xeople-search-timelines.component';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { XeopleFilterListComponent } from './xeople-filter-list/xeople-filter-list.component';
import { ButtonTypes } from 'src/app/shared/models';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { XeopleShareResumeComponent } from './xeople-share-resume/xeople-share-resume.component';
import { XeoplePushMembersComponent } from './xeople-push-members/xeople-push-members.component';
import { RtlService } from 'src/app/shared/services/commonservice/rtl/rtl.service';
import { XeopleSearchMsgComponent } from './xeople-search-msg/xeople-search-msg.component';

@Component({
  selector: 'app-xeople-search',
  templateUrl: './xeople-search.component.html',
  styleUrls: ['./xeople-search.component.scss']
})
export class XeopleSearchComponent implements OnInit {
  public showOutputResilts = 121;
  public showAllResults = 20;
  public showAllJobResults = false;
  //public dropDoneConfig: customDropdownConfig[] = []; /***@When:24-07-2023 @Who: Renu @Why:EWM-13284 EWM-13357 ****/
  public poolInfo: any[] = [];
  public filterSearchForm: FormGroup;
  public selectedJobs: any = {};
  public selectedFilter: any = {};
  public filterList: any[] = [];
  public selectedPool: any = [];
  public xeopleFilterConfig: customDropdownConfig[] = [];
  public xeopleSearchPoolConfig: customDropdownConfig[] = [];
  public loading: boolean = false;
  public selectedInputFields: any[] = [];
  public SelectedOutputFields: any[] = [];
  public inputFields: any[] = [];
  public outputFields: any[] = [];
  public conditionsList: any = [];
  filterCondition: any[] = [];
  apiGateWayUrl: any;
  dropList: any[] = [];
  multiDropDownData: any = [];
  config: any = [];
  public keyValue: any = [];
  showAndCondition: boolean;
  checkval: any[];
  checkvalInput: any[];
  jobObj: any = {};
  public jobParam: any[] = [];
  filterById: any;
  searchResult: boolean;
  public sortingValue: string = "Name,asc";
  public searchValue: string = "";
  public gridListData: any = [];
  public workflowId: any;
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public viewMode: string = 'listMode';
  public totalDataCount: number;
  public listData: any = [];
  public folderId: any = 0;
  public searchVal: string = '';
  public loadingSearch: boolean;
  loaderStatus: number;
  scrolledValue: any;
  animationVar: any;
  pageOption: any;
  animationState = false;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  public zoomPhoneCallRegistrationCode: any;
  public zoomCheckStatus: boolean = false;
  public searchSubject$ = new Subject<any>();
  public PhoneNumber: any;
  public JobId: any;
  public isAsignJob: boolean = false;
  @Output() assignJobCount = new EventEmitter();
  public getAllJobDataSub: any;
  public canidatedata: any = [];
  sendEmailData: any;
  public mailSentCount: number;
  public emailConnection: boolean;
  public status: boolean;
  public listViewDetails: any = {};
  public mailInBoxCount: number;
  public mailDraftCount: any;
  public counter: any = 0;
  public tabActive: string = 'Inbox';
  public selectedTabIndex: any = 0;
  public IsSelected: any;
  public ActiveMenu: any;
  public pagesize;
  public pagneNo = 1;
  public isFavouritChecked: boolean = false;
  allComplete: boolean = false;
  public listViewDraft = [];
  public listViewSend = [];
  listView: any;
  @ViewChild('activityAdd') public sidenav: MatSidenav;
  @Output() refreshgetjobApi = new EventEmitter();
  xeopleSearchData: any = [];
  xeopleSearchDatalength: any;
  public disableCheckBox: any;
  public xeople: any
  public candidateName: any
  public candidateId: any
  public receivephoneData: any = []
  FileName: any;
  FilePath: any;
  DemoDoc: any;
  UploadFileName: any;
  isNewResumeLoading: any;
  isLoading: boolean;
  gridView: any;
  showVersionHistory: boolean;
  showNoResumeBox: boolean;
  showUploadedResume: boolean;
  disableDownloadBtn: boolean;
  docFileUrlEmit: any;
  ResumeUrl: any;
  fileType: any;
  viewer: string;
  public positionMatDrawer: string = 'end';
  activityStatus: boolean;
  isParseResume: boolean;
  overlayParseResume: boolean = false;
  overlayClientDetail = false;
  public candidatePhoneNumber: any
  ActivedraftId: any = null;
  public sendEmail: any;
  notPhoneNumber: any
  @ViewChild('quickFilter') public righttoggel: MatSidenav;
  @ViewChild('shareJobApplicationForm') public shareJobApplicationForm: MatSidenav;
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  public burstSMSRegistrationCode: any;
  candidateIdData: any;
  SMSHistory: any = [];
  smsHistoryToggel: boolean = false;
  quickFilterToggel: boolean = true;
  public jobLocation: any;
  public direction: any;
  public Latitude: any;
  public Longitude: any;
  public JobLatitude = null;
  public JobLongitude = null;
  isSmsHistoryForm: boolean = false;
  JobName: any;
  candidateDetails: any = [];
  JobParamValue: any = [];
  SmsData: any;
  jobParamOn: boolean = false;
  public timelineCandidateId: any;
  public loadingSearchFilter: boolean;
  public SavedfilterList: any[];
  filterVal: any;
  @ViewChild('trigger', { read: MatAutocompleteTrigger }) trigger: MatAutocompleteTrigger;
  @ViewChild('inputAutoComplete') inputAutoComplete: any;
  savedFilter: any;
  accessEmailId: any[] = [];
  jobId: any;
  public hideResults: boolean = false;
  public TotalFilter: number = 0;
  public selectedJobSaved = {};
  defaultFilterAdmin: any;
  filternotFoundMsg: boolean = false;
  public topVal: boolean;
  dirctionalLang;
  candidateInfo: []=[];
  public jobOwner: any;
  public largeScreenTagDataOwner: any;
  public smallScreenTagDataOwner: number;
  maxMoreLength: any;
  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones: MediaQueryList;
  forIpads: MediaQueryList;
  forMiniLapi: MediaQueryList;
  private _mobileQueryListener: () => void;
  resetFormSearch: Subject<any> = new Subject<any>();
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  keywordList: string[][] = [];
  resultKeyWord: string='';
  public LengthToMore: any=1;
  resumeParsed: number;
  arr=[];
  isoneArr=[];
  public totalRecords: number; /*@When: 10-07-2023 @Who: Renu @Why: EWM-13067*/
  public currentMenuWidth: number;
  maxMoreLengthKeywordList:any;
  public JobWorkFlow: []=[]; /*@When: 10-07-2023 @Who: Renu @Why: EWM-13067*/
  public inputVal: string='';
  loaderRefresh: boolean=false;
  distanceUnit: string='KM';
  public secondThirdFourthSec:boolean=true;
  public eohRegistrationCode:string;
  public IsEOHIntergrated: boolean=false;
  public IsPushJobNotificationEnable: boolean=false;
  private destroySubject: Subject<void> = new Subject();
  public IsSearchExtractNotificationEnable: boolean=false;
 // public JobSelectedRouter: string;
  public pushNotificationStatus: number;
  selectedCandEmail: any;
  pageSIZE: number = 50;
  eohIntegratedName: string;
  jobAddressLinkToMap: string;
  public selectedCandidate: any = [];
  public toEmailList: any;
  public IsEmailConnected: number;
  public getAllEmailIdFormMappedJob:any = [];
  public getCandidateData:any = [];
  public multipleEmail:boolean = false;
  public getCandidateEmailData:any = [];
  xeopleSearchJobId: string;

  constructor(private router: Router, private serviceListClass: ServiceListClass, private fb: FormBuilder,public _sidebarService: SidebarService,
    private translateService: TranslateService, private snackBService: SnackBarService,public dialogObj: MatDialog,
    private xeopleSearchService: XeopleSearchService, private appSettingsService: AppSettingsService,
    public _dialog: MatDialog, private commonService: CommonserviceService, private candidateService: CandidateService,
    public systemSettingService: SystemSettingService, public quickJobService: QuickJobService, private _rtlService:RtlService,
    private commonServiesService: CommonServiesService,public dialog: MatDialog, private mailService: MailServiceService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {

    this.pagesize = this.appSettingsService.pagesize;
    this.pageSIZE = this.appSettingsService.pagesize;
    this.pushNotificationStatus = this.appSettingsService.pushNotificationStatus;

    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    this.apiGateWayUrl = this.appSettingsService.apiGateWayUrl;
    this.distanceUnit = localStorage.getItem('DistanceUnit')!=='null'?localStorage.getItem('DistanceUnit'):'KM';
    this.filterSearchForm = this.fb.group({
      FilterName: [],
      UserType: [[]],
      SearchPool: [[], [Validators.required]],
      AccessName: [],
      AccessId: [],
      includeJobPipeline: [],
      ShowAllMatchingRecord: [],
      ShowTopMatchingRecordNumber: [],
      SearchQuery: this.fb.array([]),
      OutputFields: [],
      InputFields: [, [Validators.required]],
      JobId: [],
      JobTitle:[],
      filterName: [],
      inputValue:[this.inputVal]
    });
    this.keywordList.push([]);

    this.xeopleFilterConfig['IsDisabled'] = false;
    this.xeopleFilterConfig['apiEndPoint'] = this.serviceListClass.getXfactorFilterList;
    this.xeopleFilterConfig['placeholder'] = 'label_searchFilter';
    this.xeopleFilterConfig['searchEnable'] = true;
    this.xeopleFilterConfig['IsManage'] = '';
    this.xeopleFilterConfig['IsRequired'] = false;
    this.xeopleFilterConfig['bindLabel'] = 'FilterName';
    this.xeopleFilterConfig['multiple'] = false;

    this.xeopleSearchPoolConfig['IsDisabled'] = false;
    this.xeopleSearchPoolConfig['apiEndPoint'] = this.serviceListClass.getXfactorPoolList;
    this.xeopleSearchPoolConfig['placeholder'] = 'label_searchPool';
    this.xeopleSearchPoolConfig['searchEnable'] = true;
    this.xeopleSearchPoolConfig['IsManage'] = '';
    this.xeopleSearchPoolConfig['IsRequired'] = true;
    this.xeopleSearchPoolConfig['bindLabel'] = 'SearchPoolName';
    this.xeopleSearchPoolConfig['multiple'] = true;

    this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
    this.forSmartphones = media.matchMedia('(max-width: 832px)');
    this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
    this.forIpads = media.matchMedia('(max-width: 1024px)');
    this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
      this.screenMediaQuiry();
    };
    this.forSmallSmartphones.addListener(this._mobileQueryListener);
   
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
     /*************@Who:Renu @when: 11-10-2023 @Why:EWM-14696 EWM-14711 ******/
    // this.JobSelectedRouter=this.router.getCurrentNavigation()?.extras?.state?.JobSelected;

  }

  ngOnInit(): void {
    
    this.screenMediaQuiry();
    let URL = this.router.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //
    this.commonService.xeopleSearchServicedata.pipe(
      takeUntil(this.destroySubject)
    ).subscribe((data) => {
      this.xeopleSearchData = data;
      this.xeopleSearchDatalength = this.xeopleSearchData?.IsDefault;

    })
    /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
    this.commonServiesService.searchEnableCheck(1);
    this.commonService.xeopleSearchDisabel.pipe(
      takeUntil(this.destroySubject)
    ).subscribe((data) => {
      this.selectedCandidate=data;
      this.candidateInfo=data?.[0]?.Inotherjobs;
      this.xeople = data?.length;
    })
    this.IsPhoneNumber();
    this.getIntegrationCheckSMSstatus();
    this.getXfactorFilterById(0);
    this.getJobWorkflowALL();
    this.filterlistSaved('');
    this.searchPoolList();
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearchFilter = true;
      this.filterlistSaved(val);
    });
    this.animationVar = ButtonTypes;
    this.getcvParsedCountAll();

    this.currentMenuWidth = window.innerWidth;
    this.detectScreenSize();
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.zoomPhoneCallRegistrationCode);
    this.zoomCheckStatus =  zoomCallIntegrationObj?.[0]?.Connected;
    let eohRegistrationCode=otherIntegrations?.filter(res=>res.RegistrationCode==this.eohRegistrationCode);
    this.IsEOHIntergrated =  eohRegistrationCode?.[0]?.Connected;
    this.eohIntegratedName = eohRegistrationCode?.[0]?.Name
    this.getEOHPushJobSubsDetails();
    this.getEOHSrhExtSubsDetails();
  }

  
  /*
     @Type: File, <ts>
     @Name: detectScreenSize function
     @Who: Satya Prakash Gupta
     @When: 19-Jul-2023
     @Why: EWM-13457 EWM-13458
   */

  detectScreenSize(){
    if (this.currentMenuWidth > 240 && this.currentMenuWidth < 767) {
      this.maxMoreLengthKeywordList = 1;
    }else {
      this.maxMoreLengthKeywordList = 2;
    }
  }

  @HostListener("window:resize", ['$event'])
  public onResize(event) {
    event.target.innerWidth;
    this.currentMenuWidth = event.target.innerWidth;
    this.detectScreenSize();
  }

  // ngAfterContentChecked(): void {
  //   this.changeDetector.detectChanges();
  // }

  screenMediaQuiry() {
    if (this.forSmallSmartphones.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forSmartphones.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forLargeSmartphones.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forIpads.matches == true) {
      this.maxMoreLength = 1;
    } else if (this.forMiniLapi.matches == true) {
      this.maxMoreLength = 3;
    } else {
      this.maxMoreLength = 4;
    }
  }

  /*
     @Type: File, <ts>
     @Name: fetchCandidateResumeById function
     @Who: Nitin Bhati
     @When: 31-Jan-2023
     @Why: EWM-10287
   */

  fetchCandidateResumeById(callMethod: string) {
    if (callMethod == 'onload') {
      this.loading = false;
    } else {
      this.loading = false;
      this.isLoading = true;
    }
    this.candidateService.fetchCandidateVersionHistory("?candidateId=" + this.candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.gridView = repsonsedata.Data;
          this.FilePath = repsonsedata.Data[0].FileName;
          if (callMethod == 'onload') {
            this.showVersionHistory = false;
            if (this.gridView.length == 0) {
              this.isNewResumeLoading = true;
              this.showNoResumeBox = true;
              this.showUploadedResume = false;
              this.disableDownloadBtn = true;
              this.loading = false;
              //this.docFileUrlEmit.emit(false);
            } else {
              this.isNewResumeLoading = false;
              this.showNoResumeBox = false;
              this.showUploadedResume = true;
              this.disableDownloadBtn = false;
              this.DemoDoc = this.gridView[0].ResumeUrl;
              this.ResumeUrl = this.gridView[0].ResumeUrl;
              this.FileName = this.gridView[0].FileName;
              this.UploadFileName = this.gridView[0].UploadFileName;
              const list = this.DemoDoc.split('.');
              this.fileType = list[list.length - 1];
              if (this.fileType == 'PDF' || this.fileType == 'pdf') {
                this.viewer = 'url';
              } else {
                this.viewer = 'office';
              }
              //this.docFileUrlEmit.emit({ url: this.DemoDoc, FileName: this.UploadFileName });
              this.loading = false;
            }
          } else {
            this.showVersionHistory = true;
            this.showUploadedResume = false;
          }
        } else if (repsonsedata.HttpStatusCode == 204) {
          this.isNewResumeLoading = true;
          this.showNoResumeBox = true;
          this.showUploadedResume = false;
          this.disableDownloadBtn = true;
          this.loading = false;
          // this.docFileUrlEmit.emit(false);
        } else {
          this.isNewResumeLoading = true;
          this.showVersionHistory = true;
          this.showNoResumeBox = false;
          this.showUploadedResume = false;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  showOutputResults(): void {
    (this.showOutputResilts === 121) ? this.showOutputResilts = 0 : this.showOutputResilts = 121;
  }

  showMoreData(): void {
    (this.showAllResults === 20) ? this.showAllResults = 45 : this.showAllResults = 20;
  }

  showJobData() {
    // (this.showAllJobResults === 95) ? this.showAllJobResults = 45 : this.showAllJobResults = 95;
    this.showAllJobResults = !this.showAllJobResults
  }


  /*
  @Type: File, <ts>
  @Name: receivecandidateiName
  @Who: maneesh
  @When: 05-Feb-2023
  @Why:EWM-10305
  @What: to receivecandidateiName candidate
  */

  receivecandidateiName(data) {
    this.candidateName = data;
  }

  /*
@Type: File, <ts>
@Name: receivecandidateid
@Who: maneesh
@When: 05-Feb-2023
@Why:EWM-10305
@What: to receivecandidateid candidate
*/
  receivecandidateid(event: any) {
    if (event != undefined || event != null || event != '') {
      this.candidateId = event;
    }
  }

/*
@Type: File, <ts>
@Name: fetchDetailsCandidate
@Who: Renu
@When: 16-May-2023
@Why:EWM-10305
@What: for xeople candidate timeline
*/
  fetchDetailsCandidate(info:string){
    this.timelineCandidateId=info
    this.openTimelinePopup();
  }
  /*
@Type: File, <ts>
@Name: xeopleSearchCanidatedata
@Who: maneesh
@When: 05-Feb-2023
@Why:EWM-10305
@What: to xeopleSearchCanidatedata phone number
*/
  xeopleSearchCanidatedata(data) {
    this.receivephoneData = data?.canidatedata; /*@When: 10-07-2023 @Who: Renu @Why: EWM-13067*/
    this.candidateInfo = this.receivephoneData?.[0]?.Inotherjobs;
    this.notPhoneNumber = this.receivephoneData[0]?.PrimaryMobileNo;
    this.timelineCandidateId = this.receivephoneData[0]?.Id;
    this.direction = this.receivephoneData[0]?.Address;
    this.Latitude = this.receivephoneData[0]?.Latitude;
    this.Longitude = this.receivephoneData[0]?.Longitude;
    this.Longitude = this.receivephoneData[0]?.Longitude;
    this.totalRecords=data?.totalDataCount;/*@When: 10-07-2023 @Who: Renu @Why: EWM-13067*/
    this.selectedCandEmail= this.receivephoneData[0]?.Email;/*@When: 30-11-2023 @Who: Adarsh @Why: EWM-15160*/
  }
  /*
  @Type: File, <ts>
  @Name: searchResults
  @Who: maneesh
  @When: 05-Feb-2023
  @Why:EWM-10305
  @What: to searchResults candidate
  */

  searchResults() {
    this.searchResult = true;
    this.hideResults = true;

    setTimeout(() => { this.secondThirdFourthSec=false; }, 200);
    /*** @Who:renu @why:to pass data to search xeoplers */
    this.FilterQueryString(this.filterSearchForm?.value?.SearchQuery);
    this.resetFormSearch.next(true);
    document.getElementById("xeople-drawer").style.overflow = "hidden";   /*** @Who:renu @When: 27/07/2023 @why:add style to drawer */
  }
  closeResults() {
       /*** @Who:renu @When: 27/07/2023 @why:remove style from drawer */
    document.getElementById("xeople-drawer").style.overflow = null;
    this.searchResult = false;
    this.totalRecords=0;

    this.secondThirdFourthSec=true;
    setTimeout(() => { this.hideResults = false; }, 200);
   // this.resetFormSearch.next(false);
  }
  /*
  @Type: File, <ts>
  @Name: drawerCloseMyActivity
  @Who: Nitin Bhati
  @When: 3-Feb-2023
  @Why:EWM-10287
  @What: to close Drawer
  */
  drawerCloseMyActivity(data: any) {
    if (data.isDrawerClose == true) {
      this.sidenav.close();
      this.activityStatus = false;
    }
  }
  /*
  @Type: File, <ts>
  @Name: closeDrawerMyActivity
  @Who: Nitin Bhati
  @When: 3-Feb-2023
  @Why:EWM-10287
  @What: to close Drawer
  */
  closeDrawerMyActivity() {
    localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;
    this.activityStatus = false;
  }
  /*
  @Type: File, <ts>
  @Name: openCreateActivity function
  @Who: Nitin Bhati
  @When: 31-Jan-2023
  @Why: EWM-10289
*/

  openCreateActivity() {
    this.activityStatus = true;
  }
  /*
     @Type: File, <ts>
     @Name: openParseResume function
     @Who: Nitin Bhati
     @When: 31-Jan-2023
     @Why: EWM-10287
   */
  openParseResume() {
    this.isParseResume = true;
    this.overlayParseResume = !this.overlayParseResume;
    this.fetchCandidateResumeById('onload');
    /* @When: 02-11-2023 @who:Amit @why: EWM-14964 @what: overlay rtl */
    this._rtlService.onOverlayDrawerRTLHandler();
  }
  /*
   @Type: File, <ts>
   @Name: toggleDrwerResume function
   @Who: Nitin Bhati
   @When: 31-Jan-2023
   @Why: EWM-10287
 */
  toggleDrwerResume(start: any) {
    this.overlayParseResume = !this.overlayParseResume;
  }
  /*
  @Type: File, <ts>
  @Name: add remove animation function
  @Who: maneesh
  @When: 25-jan-2023
  @Why:EWM-10305-EWM-9378
  @What: add and remove animation
   */

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId)?.classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList.remove(animationName)
  }
  /*
@Type: File, <ts>
@Name: openAsignJob
@Who: maneesh
@When: 30-jan-2023
@Why: EWM-10305-EWM-9378
@What: for child component load when click asign job view
*/

  openAsignJob() {
    this.isAsignJob = true;
    this.overlayClientDetail = !this.overlayClientDetail;
  }

  /*
  @Type: File, <ts>
  @Name: IsPhoneNumber function
  @Who: maneesh
  @When: 30-jan-2023
  @Why: EWM-10305-EWM-9378
  @What: for call purpos
  */


  IsPhoneNumber() {
    this.candidatePhoneNumber = this.receivephoneData[0]?.primaryMobileNo;

  }
  receivedMessageHandler(p, asignJob) {
    if (p == false) {
      asignJob.toggle();
      this.isAsignJob = false;
    }
  }
  /*
@Name: fetchRefreshgetjobApi function
@Who: maneesh
@When: 31-jan-2023
@Why: EWM-10305-EWM-9378
*/
  fetchRefreshgetjobApi(value) {
    if (value == true) {
      this.isAsignJob = false;
      this.overlayClientDetail = !this.overlayClientDetail;
      this.allComplete = false;
      this.assignJobCount.emit(true);
    }
  }
  /*
 @Type: File, <ts>
 @Name: toggleDrwer function
 @Who: maneesh
 @When: 30-jan-2023
 @Why: EWM-10305-EWM-9378
 @What: toggle assign job drawer
 */

  toggleDrwer(start: any) {
    this.isAsignJob = false;
    this.overlayClientDetail = !this.overlayClientDetail;

  }


  /*
@Type: File, <ts>
@Name: openNewEmailModal function
@Who: maneesh
@When: 30-jan-2023
@Why: EWM-10305-EWM-9378
@What:  for NewEmailComponent
*/
  openNewEmailModal(responseData: any, mailRespondType: string) {
    let arr = this.selectedCandidate;
    this.getAllEmailIdFormMappedJob = this.selectedCandidate?.map(function (el: { Email: any; }) { return el.Email; });
    this.getCandidateData = [];
    arr?.forEach(element => {
      this.getCandidateData.push({
       "ModuleType": "CAND",
       "Id": element.Id,
       "EmailTo": element.Email
      })
    });
   this.getCandidateData.filter((value , index) =>{
    this.selectedCandidate.indexOf(value) === index
   }) 
    const message = ``;
    const EmailData = this.xeopleSearchData;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(XeopleSearchMailComponent, {
      maxWidth: "750px",
      width: "95%",
      maxHeight: "100%",
      height: "100%",
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': this.emailConnection, 'toEnableEmail': true, 'EmailData':EmailData,JobId:this.jobId,JobTitle:this.selectedJobs?.JobTitle,
      'candiateDetails': this.getCandidateData,  },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.pagneNo = 1;
        this.pagesize = 50;
        this.sortingValue = '';
        this.searchValue = '';
        if (this.tabActive == 'Draft') {
          if (dialogResult.draft == true) {
            this.getDraftList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
          } else {
            this.deleteDraft(this.pagneNo, this.sortingValue, this.searchValue);
          }
        } else if (this.tabActive == 'Inbox') {
          if (this.isFavouritChecked) {
            this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '')
          } else {
            // this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');
          }
        } else if (this.tabActive == 'Sent') {
          setTimeout(() => {
            this.fetchSendList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
          }, 2000)
        }

        // setTimeout(() => {
        //   this.getMailCount();
        // }, 2000)
      }
      this.allComplete = false;

    })

  }


  /*
@Type: File, <ts>
@Name: getMailCount
@Who: maneesh
@When: 30-jan-2023
@Why:EWM-10305-EWM-9378
@What: To get mail count Info
*/
  getMailCount() {
    //this.loading=true;
    this.mailService.fetchMailCount().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.mailInBoxCount = repsonsedata.Data.Inbox;
          this.mailDraftCount = repsonsedata.Data.Drafts;
          this.mailSentCount = repsonsedata.Data.Sent;

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.mailInBoxCount = repsonsedata.Data.Inbox;
          this.mailDraftCount = repsonsedata.Data.Drafts;
          this.mailSentCount = repsonsedata.Data.Sent;
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
@Type: File, <ts>
@Name: getDraftList
@Who: maneesh
@When: 30-jan-2023
@Why: EWM-10305-EWM-9378
@What: To get draft mail list information
*/
  getDraftList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.mailService.getDraftMail(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listViewDraft = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listViewDraft = [];
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
@Type: File, <ts>
@Name: deleteDraft
@Who: maneesh
@When: 30-jan-2023
@Why:EWM-10305-EWM-9378
@What: for deleteDraft mail
*/
  deleteDraft(pagneNo, sortingValue, searchValue) {
    let deleteObj = {};
    deleteObj['draftId'] = this.ActivedraftId;
    this.mailService.deleteDraftMailById(this.ActivedraftId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.ActivedraftId = null;
          this.getDraftList(this.pagesize, pagneNo, sortingValue, searchValue);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
  @Name: fetchFavoriteMailList function
  @Who: maneesh
  @When: 30-jan-2023
  @Why:EWM-10305-EWM-9378
  @What: filter only fave records
  */
  fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal, Imp) {
    if (Imp == 'Imp') {
      this.loading = false;
    } else {
      this.loading = true;
    }

    this.mailService.fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal, '').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.listView = [];
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
    @Type: File, <ts>
    @Name: fetchInboxList function
    @Who: maneesh
    @When: 30-jan-2023
    @Why:EWM-10305-EWM-9378
    @What: service call for List data
    */
  fetchInboxList(pagesize, pagneNo, sortingValue, searchVal, Imp) {
    if (Imp == 'Imp') {
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.mailService.fetchMailList(pagesize, pagneNo, sortingValue, searchVal, '').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = [];
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
@Type: File, <ts>
@Name: fetchSendList function
@Who: maneesh
@When: 30-jan-2023
@Why: EWM-10305-EWM-9378
@What: service call for send List data
*/

  fetchSendList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.mailService.fetchSendMailList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.sendEmail = repsonsedata.Data.EmailTo;
          this.sendEmailData = repsonsedata.Data;

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.sendEmailData = [];
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
   @Type: File, <ts>
   @Name: onJobchange
   @Who: Renu
   @When: 07-feb-2023
   @Why: EWM-9370 EWM-10115
   @What: when job drop down changes
 */

  onJobchange(data: any, type: string) {
    if (!data) {
      this.resetValue(null);
      this.showAllJobResults = false;
      this.selectedJobSaved = {};
      this.jobObj={};
      this.filterSearchForm.patchValue({
        InputFields: []
      })
      this.inputFields.filter(element => {
        this.searchInfo().clear();
        element["selected"] = false;
      });
      this.checkvalInput = this.inputFields.filter(x => x.selected == true);
      this.JobLatitude=null;
      this.JobLongitude=null;
      this.xeopleSearchJobId=null;
      this.commonService.xeoplesearchJobData.next(this.xeopleSearchJobId);
      return;
    }
      const message = ``;
      const title = '';
      const subTitle = 'label_jobConfirmation';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: {dialogData,WithoutQuestionMark:true},
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.loading = true;
        if (dialogResult == true) {
          this.resetValue(null);
          this.showAllJobResults = true;
          this.jobParamOn = true;
          this.jobId = data?.Id;
          this.xeopleSearchJobId=data?.Id;
          this.commonService.xeoplesearchJobData.next(this.xeopleSearchJobId);
          if(this.jobId){
          //localStorage.setItem("XeopleSelectedJob",JSON.stringify(data));
          this.getJobDetails(data?.Id);
          this.JobInfoParamByJobId(data?.Id);
          this.selectedJobs = data;
          this.filterSearchForm.patchValue(
            {
              JobId: this.selectedJobs?.Id,
              JobTitle:this.selectedJobs?.JobTitle
            }

          )
          }else{
            this.jobObj={};
            this.showAllJobResults = false;
            this.selectedJobs = {};
            //localStorage.removeItem("XeopleSelectedJob");
            this.selectedJobSaved = data;
            this.filterSearchForm.patchValue(
              {
                JobId: this.selectedJobs?.Id,
                JobTitle:this.selectedJobs?.JobTitle
              }
            )
          }
          this.loading = false;

        } else {
          this.showAllJobResults = false;
          this.loading = false;
          this.selectedJobs = {};
          this.selectedJobSaved = data;
          this.filterSearchForm.patchValue({
            'JobId': this.selectedJobs
          });
          this.filterSearchForm.patchValue({
          InputFields: []
          })
          this.inputFields.filter(element => {
          this.searchInfo().clear();
          element["selected"] = false;
          });
          this.checkvalInput = this.inputFields.filter(x => x.selected == true);
          //localStorage.removeItem("XeopleSelectedJob");
        }
      });

  }

  /*
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: to compare objects selected
  */
    compareFnJobs(c1: any, c2:any): boolean {
       return c1 && c2 ? c1['Id'] === c2 : c1 === c2;
   }
  /*
    @Type: File, <ts>
    @Name: onFilterchange function
    @Who: Renu
    @When: 07-feb-2023
    @Why: EWM-9370 EWM-10115
    @What:get x-factor default filter list
 */

  onFilterchange(data) {
    if (data == null || data == "") {
      this.filterSearchForm.get("filterName").setErrors({ required: true });
      this.filterSearchForm.get("filterName").markAsTouched();
      this.filterSearchForm.get("filterName").markAsDirty();
    }
    else {
      this.filterSearchForm.get("filterName").clearValidators();
      this.filterSearchForm.get("filterName").markAsPristine();
      this.selectedFilter = data;
      this.filterSearchForm.patchValue(
        {
          FilterName: data.Id
        }
      )
    }
  }

  /*
    @Type: File, <ts>
    @Name: onSearchPoolchange function
    @Who: Renu
    @When: 07-feb-2023
    @Why: EWM-9370 EWM-10115
    @What:get x-factor default search pool list
 */
  onSearchPoolchange(data) {
    if (data == null || data == "") {
      this.filterSearchForm.get("SearchPool").setErrors({ required: true });
      this.filterSearchForm.get("SearchPool").markAsTouched();
      this.filterSearchForm.get("SearchPool").markAsDirty();
    }
    else {
      this.filterSearchForm.get("SearchPool").clearValidators();
      this.filterSearchForm.get("SearchPool").markAsPristine();
      this.selectedPool = data;
      this.filterSearchForm.patchValue(
        {
          SearchPool: data.Id
        }
      )
    }
  }
  /*
     @Type: File, <ts>
     @Name: getXfactorDefaultFilter function
     @Who: Renu
     @When: 07-feb-2023
     @Why: EWM-9370 EWM-10115
     @What:get x-factor default filter list
  */

  getXfactorDefaultFilter(pageSize: number, pageNo: number, sortingValue: string, searchVal: string) {
    this.xeopleSearchService.getXfactorList(pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.filterList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
     @Type: File, <ts>
     @Name: getXfactorFilterById function
     @Who: Renu
      @When: 08-Feb-2023
     @Why: EWM-9370 EWM-10115
     @What:get x-factor default filter list by Id
  */
  getXfactorFilterById(filterById: Number) {
    this.loading = true;
    this.xeopleSearchService.getXfactorFilterById(filterById).pipe(
      takeUntil(this.destroySubject)
    ).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 ||repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          this.savedFilter = repsonsedata?.Data;
          this.commonService.setFilterInfo.next(this.savedFilter);
          this.selectedPool = { 'SearchPoolId': this.savedFilter?.SearchPools[0].SearchPoolId, 'SearchPoolName': this.savedFilter?.SearchPools[0].SearchPoolName };
          this.selectedFilter = { 'Id': this.savedFilter?.Id };
          this.filterVal = this.savedFilter?.FilterName;
          if (this.savedFilter?.JobId ) {

            this.selectedJobs = { 'Id': this.savedFilter?.JobId,'JobTitle':this.savedFilter?.JobTitle };
             /*************@Who:Renu @when: 24-07-2023 @Why:EWM-13284 EWM-13357 */
            this.filterSearchForm.patchValue({
              JobId: this.selectedJobs?.Id,
              JobTitle:this.selectedJobs?.JobTitle
            });

            /*************@Who:Renu @when: 26-04-2023 @Why:EWM-11847 EWM-11931 */
            this.showAllJobResults = true;
            this.getJobDetails(this.savedFilter?.JobId);
            this.jobId=this.savedFilter?.JobId;
            //localStorage.setItem("XeopleSelectedJob",JSON.stringify(this.selectedJobs));
           }

          this.filterSearchForm.patchValue({
            'filterName': this.savedFilter?.FilterName,
            'UserType': this.savedFilter?.UserType,
            'includeJobPipeline': (this.savedFilter?.IncludeJobPipelineCandidate == 1) ? true : false,
            'ShowAllMatchingRecord': this.savedFilter?.ShowAllMatchingRecord,
            'ShowTopMatchingRecordNumber': this.savedFilter?.ShowTopMatchingRecordNumber
          });
          if (this.savedFilter?.ShowAllMatchingRecord == 1) {
            this.topVal = true;
          } else {
            this.topVal = false;
          }
          this.selectedInputFields = this.savedFilter?.InputColumns;
          this.SelectedOutputFields = this.savedFilter?.OutputFields;
          if (this.savedFilter?.UserType) {
            this.getXfactorIOList(this.savedFilter?.UserType);
          }


        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: outputFieldChange function
    @Who: Renu
    @When: 31-jan-2023
    @Why: EWM-9370 EWM-10115
    @What: when user click on output fileds
    */
  outputFieldChange(obj: any) {
    obj.selected = !obj.selected;
    this.checkval = this.outputFields.filter(x => x.selected == true);
    if (this.checkval.length == 0) {
      this.filterSearchForm.get("OutputFields").setValidators([Validators.required]);
      this.filterSearchForm.get("OutputFields").updateValueAndValidity();
    } else {
      this.filterSearchForm.get("OutputFields").clearValidators();
      this.filterSearchForm.get("OutputFields").updateValueAndValidity();
    }

  }

  /*
     @Type: File, <ts>
     @Name: getXfactorIOList function
     @Who: Renu
     @When: 08-Feb-2023
     @Why: EWM-9370 EWM-10115
     @What: get X-factor input/output list
  */
  getXfactorIOList(userType: string) {
    this.xeopleSearchService.getXfactorIOList(userType).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.inputFields = repsonsedata.Data?.InputFields;
          this.outputFields = repsonsedata.Data?.OutputFields;
          this.filterSearchForm.patchValue({
            'InputFields': this.inputFields
          })

          this.inputFields.forEach((element) => {
            let arr: any[] = [];
            arr = this.selectedInputFields.filter(element1 => element1.InputColumnId === element.InputColumnId);
            if (arr.length == 1) {
              if(element.InputColumnName!=='Keyword'){
              element["selected"] = true;
               /*** @When: 03-03-2023 @Who:Renu @Why: EWM-10970 EWM-11007 @What: bydeafult param selected**/
              element["InputColumnCondition"] = (arr[0]?.InputColumnCondition)?(arr[0]?.InputColumnCondition):(element?.InputColumnCondition);
              element["InputColumnConditionId"] = (arr[0]?.InputColumnConditionId)?(arr[0]?.InputColumnConditionId):(element?.InputColumnConditionId);
              element["InputColumnValue"] = arr[0]?.InputColumnValue;
              element["DBColumnName"] = element?.DBColumnName;
              element["APIEndpoint"] = element?.APIEndpoint;
              element['IsMultiple']= element?.IsMultiple; /*** @When: 02-03-2023 @Who:Renu @Why: EWM-10611 EWM-11021 @What: for check dropdown multiple or single **/
            } else {
              element["selected"] = false;
              /*** @When: 03-03-2023 @Who:Renu @Why: EWM-10970 EWM-11007 @What: bydeafult param selected**/
              element["InputColumnCondition"] = (arr[0]?.InputColumnCondition)?(arr[0]?.InputColumnCondition):(element?.InputColumnCondition);
              element["InputColumnConditionId"] = (arr[0]?.InputColumnConditionId)?(arr[0]?.InputColumnConditionId):(element?.InputColumnConditionId);
              element["InputColumnValue"] = arr[0]?.InputColumnValue;
              element["DBColumnName"] = element?.DBColumnName;
              element["APIEndpoint"] = element?.APIEndpoint;
              element['IsMultiple']= element?.IsMultiple; /*** @When: 02-03-2023 @Who:Renu @Why: EWM-10611 EWM-11021 @What: for check dropdown multiple or single **/
            }
          }
          });
          this.outputFields.forEach((element) => {
            let arr: any[] = []
            arr = this.SelectedOutputFields.filter(element1 => element1.OutputFieldName === element.OutputFieldName);
            if (arr.length == 1) {
              element["selected"] = true;
            } else {
              element["selected"] = false;
            }

          });

          this.conditionsList = this.inputFields.filter(x => x['selected'] == true);
          this.patchQueryString(this.conditionsList);
          this.checkvalInput = this.inputFields.filter(x => x.selected == true);  /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10970 EWM-11045 @What:  RESET values **/

        } else {
          this.loading = false;

        }
      }, err => {
        this.loading = false;

      })
  }


  /*
  @Type: File, <ts>
  @Name: inputFieldChange function
  @Who: Renu
  @When: 08-Feb-2023
  @Why: EWM-9370 EWM-10115
  @What: when user click on input fileds
*/
  inputFieldChange(obj: any) {
    if(obj.DBColumnName=="parshedResume" && this.resumeParsed==0){
        this.confirmDialog();
    }else{
      obj.selected = !obj.selected;
      let index = this.searchInfo().controls.findIndex(x => x['controls'].InputColumnId.value === obj.InputColumnId);
      if (obj.selected == false) {
        this.searchInfo().removeAt(index);
        this.dropList.splice(index, 1);
        this.keyValue.splice(index, 1);
        this.multiDropDownData.splice(index, 1);
        this.filterCondition.splice(index, 1);
        this.keywordList=[];
      } else {
        this.searchQueryAdd(obj);
      }

      this.checkvalInput = this.inputFields.filter(x => x.selected == true);
      this.filterSearchForm.patchValue({
        'InputFields': this.checkvalInput
      })
    }
  }

  /*
     @Type: File, <ts>
     @Name: filterInfo function
     @Who: Renu
     @When: 08-Feb-2023
     @Why: EWM-9370 EWM-10115
     @What: get formarray alias
  */
  searchInfo(): FormArray {
    return this.filterSearchForm.get("SearchQuery") as FormArray;
  }

  /*
    @Type: File, <ts>
    @Name: clearDate function
    @Who: Renu
    @When: 08-Feb-2023
    @Why: EWM-9370 EWM-10115
    @What: For clear   date
  */
  clearDate(control: any) {
    control.patchValue({
      InputColumnValue: null
    });
  }
  /*
     @Type: File, <ts>
     @Name: searchQueryAdd function
     @Who: Renu
     @When: 08-Feb-2023
     @Why: EWM-9370 EWM-10115
     @What: get formarray alias
  */
  searchQueryAdd(element) {
    this.showAndCondition = true;
    const control = <FormArray>this.filterSearchForm.controls['SearchQuery'];
    //control.clear();
    /*** @When: 03-03-2023 @Who:Renu @Why: EWM-10970 EWM-11007 @What: bydeafult param selected**/
   
    let con = { 'ConditionId': element.InputColumnConditionId, 'ConditionName': element.InputColumnCondition };
    control.push(
      this.fb.group({
        InputColumnId: [element.InputColumnId, [Validators.required]],
        InputColumnName: [element.InputColumnName, [Validators.required]],
        InputColumnCondition: [con, [Validators.required]], /*** @When: 03-03-2023 @Who:Renu @Why: EWM-10970 EWM-11007 @What: bydeafult param selected**/
        DBColumnName: [element.DBColumnName],
        InputColumnType: [element?.InputColumnType],
        proximityLocation:[(element.InputColumnName.toLowerCase()=='proximity' && this.jobId!=null)?this.jobAddressLinkToMap:'',element.InputColumnName.toLowerCase()=='proximity'?[Validators.required,this.noWhitespaceValidator()]:[]],
        InputColumnValue: element?.InputColumnName.toLowerCase()=="keyword"?this.fb.array([this.createItem(con)]):[element.InputColumnName.toLowerCase()=='proximity'?0:'', [Validators.required,conditionalValidator(element?.InputColumnType)]],
        APIKey: [element.APIKey],
        APIEndpoint: [element.APIEndpoint],
        IsMultiple:[element.IsMultiple]  /*** @When: 02-03-2023 @Who:Renu @Why: EWM-10611 EWM-11021 @What: for check dropdown multiple or single **/
      })
    );

    this.filterCondition[this.searchInfo().length - 1] = element?.Condition;
    if (element?.InputColumnType === 'Dropdown') {
      this.getdropdownList(element, this.searchInfo().length - 1, 'New');
    }
    
  }

  /*
  @Type: File, <ts>
  @Name: patchQueryString function
  @Who: Renu
  @When: 31-jan-2023
  @Why: EWM-9625 EWM-10071
  @What: if user has save query string then patch its value
*/
  patchQueryString(queryObj: any) {
    const control = <FormArray>this.filterSearchForm.controls['SearchQuery'];
    control.clear();
    queryObj.forEach((ele: any, Index: number) => {
      const element = queryObj[Index];
      let con = { 'ConditionId': element.InputColumnConditionId, 'ConditionName': element.InputColumnCondition };
      let val: any = [];
      let proxLocation:string;
      if (element.InputColumnName!= "Keyword") {
      if (element.InputColumnType === 'Dropdown') {
        element?.InputColumnValue.forEach(element => {
          val.push({ 'Id': element?.ValueCode, 'Name': element?.ValueName });
        });
      } else if(element.InputColumnType === 'Numeric'){
         if(element.InputColumnName.toLowerCase()== "proximity"){
          proxLocation=element?.InputColumnValue[0]?.ValueCode;
         }
        val = Number(element?.InputColumnValue[0]?.ValueName);
      }else{
        val = element?.InputColumnValue[0]?.ValueName;
      }

      control.push(
        this.fb.group({
          InputColumnId: [element.InputColumnId, [Validators.required]],
          InputColumnName: [element.InputColumnName, [Validators.required]],
          InputColumnCondition: [con, [Validators.required]],
          DBColumnName: [element.DBColumnName],
          proximityLocation:[proxLocation,element.InputColumnName.toLowerCase()== "proximity"?[Validators.required,this.noWhitespaceValidator]:[]],
          InputColumnType: [element.InputColumnType],
          InputColumnValue: [val, [Validators.required,conditionalValidator(element?.InputColumnType)]],
          APIKey: [element.APIKey],
          IsMultiple:[element.IsMultiple] /*** @When: 02-03-2023 @Who:Renu @Why: EWM-10611 EWM-11021 @What: for check dropdown multiple or single **/
        })
      )
      this.filterCondition[Index] = element?.Condition;
      if (element?.InputColumnType === 'Dropdown') {
        this.getdropdownList(element, Index, 'Edit');
      }
    }
    });
  }

  /*
     @Type: File, <ts>
     @Name: radioChange function
     @Who: Renu
     @When: 07-Feb-2023
     @Why:EWM-9625 EWM-10071
     @What: on seceting top matching reocrd condtion
  */
  radioChange(event: any) {
    if (event.value == 0) {
      this.topVal = false;
      this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].setValidators([Validators.required]);
      this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].setValue('10');
    } else {
      this.topVal = true;
      this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].setValue('');
      this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].clearValidators();
    }

    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].updateValueAndValidity();

  }


  /*
   @Type: File, <ts>
   @Name: removeSearchParam function
   @Who: Renu
   @When: 06-feb-2023
   @Why:EWM-9370 EWM-10115
   @What: for clearing filter
*/

  removeSearchParam(con: any, index: any) {
    this.multiDropDownData.splice(index, 1);
    this.dropList.splice(index, 1);
    this.keyValue.splice(index, 1);
    this.filterCondition.splice(index, 1);
    this.searchInfo().removeAt(index);
    if(con.value['InputColumnName'].toLowerCase()=='keyword'){
      this.keywordList=[];
    }
    this.inputFields.filter(x => {
      if (x['InputColumnId'] == con?.value?.InputColumnId)
        x['selected'] = false;
    }
    );
    this.checkvalInput = this.inputFields.filter(x => x.selected == true);
    if (this.checkvalInput.length == 0) {
      this.filterSearchForm.patchValue({
        InputFields: []
      })
    } else {
      this.filterSearchForm.patchValue({
        InputFields:   this.checkvalInput
      })
    }
  }
  /*
     @Type: File, <ts>
     @Name: getdropdownList function
     @Who: Renu
     @When: 31-jan-2023
     @Why: EWM-9625 EWM-10071
     @What: if user has save query string then patch its value
     */
  getdropdownList(element: any, index: number, type: string) {
    this.multiDropDownData[index] = null;
    this.config.splice(index, 0, element);

    let apiObj = this.apiGateWayUrl + element?.APIEndpoint;
    this.xeopleSearchService.getGenericDropdownList(apiObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.dropList[index] = repsonsedata.Data;
          let FilterData: [];
          let arrdropdown: any[] = [];
          FilterData = element?.InputColumnValue;
          let selectDropDown: any;
          this.keyValue[index] = element.APIKey;
          if(element?.IsMultiple==true){
          for (let i = 0; i < FilterData?.length; i++) {
            const element: any = FilterData[i];
               selectDropDown = this.dropList[index]?.filter(item => item.Id == element.ValueCode);
               if (selectDropDown[0]) {
                arrdropdown.push(selectDropDown[0]);
              }
              if (type === 'Edit') {
                this.multiDropDownData[index] = arrdropdown;
              } else {
                this.multiDropDownData[index] = [];
              }
          }
           }else{

            FilterData?.forEach((ele,i) => {
              const element: any = FilterData[i];
              selectDropDown = this.dropList[index]?.filter(item => item?.Option == element?.ValueName);
              if (type === 'Edit') {
                this.multiDropDownData[index] = selectDropDown[0];
              } else {
                this.multiDropDownData[index] = [];
              }
            });
             }

        }
      }, err => {
        // this.loader = false;
        this.dropList[index] = [];
      })
  }
  /*
   @Type: File, <ts>
   @Name: getJobDetails function
   @Who: Renu
   @When: 31-jan-2023
   @Why: EWM-9625 EWM-10071
   @What: For showing job details information
  */
  getJobDetails(JobId) {

    this.quickJobService.getJobHeaderDetails(JobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let headerListData = repsonsedata.Data;
          this.JobLatitude = headerListData?.HeaderDetails?.JobDetails?.Latitude;
          this.JobLongitude = headerListData?.HeaderDetails?.JobDetails?.Longitude;
          this.jobLocation = headerListData?.HeaderDetails?.JobDetails?.Location;
          this.jobAddressLinkToMap= headerListData?.HeaderDetails?.JobDetails?.AddressLinkToMap;
          this.jobObj = {
            'JobReferenceId': headerListData?.HeaderAdditionalDetails?.JobReferenceId,
            'JobTitle': headerListData?.HeaderDetails?.JobDetails?.JobTitle,
            'ClientName': headerListData?.HeaderDetails?.JobDetails?.ClientName,
            'OwnersList': headerListData?.HeaderDetails?.JobDetails?.OwnersList,
            'JobId': headerListData?.HeaderDetails?.JobDetails?.Id,
            'WorkflowId': headerListData?.HeaderDetails?.JobDetails?.WorkflowId
          };

           // who:maneesh,when:30/03/2023,what:ewm-11203 for button show when owner more than 10
           this.jobOwner=this.jobObj.OwnersList.length;
           this.smallScreenTagDataOwner = 0;
           let items = this.jobObj?.OwnersList.slice(0, 10);
           let threeDotItemsOwner = this.jobObj?.OwnersList.slice(10, this.jobObj?.OwnersList?.length);
           this.largeScreenTagDataOwner = items;
           this.smallScreenTagDataOwner = threeDotItemsOwner;
           this.savedFilter.JobDetails=headerListData;
           this.commonService.setFilterInfo.next(this.savedFilter);
           // who:maneesh,when:30/03/2023,what:ewm-11203 for button show when owner more than 10
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
 @Name: sortName function
 @Who: Nitin
 @When: 26-Oct-2021
 @Why: EWM-3483
 @What: For showing shortname on image icon
 */
  sortName(fisrtName) {

    if (fisrtName) {
      const Name = fisrtName;
      let charCount = Name.split(" ").length - 1;
      if (charCount > 0) {
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let last = ShortName1.slice(-1);
        let ShortName = first.concat(last.toString());
        return ShortName.toUpperCase();
      } else {
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let ShortName = first;
        return ShortName.toUpperCase();
      }

    }

  }

  /*
    @Type: File, <ts>
    @Name: onSaveFilter function
    @Who: Renu
    @When: 10-Feb-2023
    @Why:EWM-9370 EWM-10115
    @What: for saving filter
 */
  onSaveFilter() {
    let obj = {};
    let value = this.filterSearchForm.value;
    obj['Id'] = this.filterById ? Number(this.filterById) : 0;
    obj['FilterName'] = value?.filterName;
    obj['AccessId'] = value?.AccessId;
    obj['AccessName'] = value?.AccessName;
    obj['SearchPools'] = [value?.SearchPool];
    obj['UserType'] = value?.UserType;
    obj['IncludeJobPipelineCandidate'] = value?.includeJobPipeline ? 1 : 0;
    obj['ShowAllMatchingRecord'] = value?.ShowAllMatchingRecord;
    obj['ShowTopMatchingRecordNumber'] = value?.ShowTopMatchingRecordNumber ? Number(value?.ShowTopMatchingRecordNumber) : null;
    obj['SearchQuery'] = this.FilterQueryString(value?.SearchQuery);
    value.SearchQuery.filter((x, i) => {
      x['InputColumnConditionId'] = x?.InputColumnCondition?.ConditionId;
      x['InputColumnCondition'] = x?.InputColumnCondition?.ConditionName;
      if (x['InputColumnName'] != "Keyword") {
      if (x['InputColumnType'] === "Dropdown") {
      if(x['IsMultiple']==true){
        x['InputColumnValue'] = x.InputColumnValue.map(item => {
          return {
            ValueCode: item?.Id?.toString(),
            ValueName: item[x?.APIKey]
          };
        });
      }else{
        x['InputColumnValue'] = [{ ValueCode: '', ValueName: x?.InputColumnValue[x?.APIKey]}];
      }
      } else {
        x['InputColumnValue'] = [{ ValueCode:(x['InputColumnName'] == "Proximity"?x['proximityLocation']:'') , ValueName: x?.InputColumnValue.toString()}];
      }
    }
    })
    obj['InputColumns'] = value?.SearchQuery;
    obj['OutputFields'] = this.outputFields.filter(x => x['selected'] == true);
    obj['GrantAccessList'] = this.accessEmailId;
    obj['JobId'] = this.jobId ? this.jobId : null;
    obj['JobTitle'] =this.selectedJobs ? this.selectedJobs?.JobTitle : null;
    obj['LoggedInUserType'] = 0;
    obj['View'] = 0;
    obj['Edit'] = 0;
    obj['Delete'] = 0;

    this.xeopleSearchService.saveXfilter(obj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getXfactorFilterById(this.filterById ? Number(this.filterById) : 0);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
   @Type: File, <ts>
   @Name: FilterQueryString function
   @Who: Renu
   @When: 10-Feb-2023
   @Why:EWM-9370 EWM-10115
   @What: for creating string
*/

  FilterQueryString(data: any[]) {
    let temp: string = '';
    let final_result: string;
    data?.forEach((value, k) =>{
      let Field = value['DBColumnName'];
      let condition = value['InputColumnCondition']?.ConditionName;
      let LatLon:string='';
      let keyValue: string = '';
    if (value['InputColumnName'] === 'Keyword') {
      this.resultKeyWord= this.getKeywordInfo(value['InputColumnValue'],value['DBColumnName']);
    }else{
      if (value['InputColumnType'] === "Dropdown") {
        if(value['IsMultiple']==true){
          value['InputColumnValue']?.forEach((element, i) => {
            //keyValue.push(element.StatusName);
            keyValue += element[value?.APIKey];
            if (i < value['InputColumnValue'].length - 1)
            keyValue += ",";
          });
        }else
        {
          keyValue += value.InputColumnValue[value.APIKey];
        }
      } else if (value['InputColumnType'].toLowerCase() === "date") {
        keyValue += new Date( value.InputColumnValue).toISOString();
       }else
        {
           if(value['InputColumnName'].toLowerCase() === 'proximity'){
            let jobLatlong:string='';
            if((this.JobLatitude && this.JobLatitude!=='') && (this.JobLongitude && this.JobLongitude!=='')){
             jobLatlong='('+this.JobLatitude+','+this.JobLongitude+')';
            }else{
             jobLatlong='';
            }
            keyValue += value.InputColumnValue+this.distanceUnit+jobLatlong;
           // LatLon +='latlng$contains$' +'('+this.JobLatitude+','+this.JobLongitude+')' + '~';
          }
           else{
            keyValue += value.InputColumnValue;
          }
      }
   
        temp += Field?.trim() + '$' + condition?.trim() + '$' + (keyValue ? keyValue.trim() : 0)+'~';  
        if(this.showAllJobResults && !temp.includes('latlng')  && (this.JobLatitude && this.JobLatitude!=='') && (this.JobLongitude && this.JobLongitude!=='')){
          LatLon +='latlng$contains$' +'('+this.JobLatitude+','+this.JobLongitude+')' + '~';
          temp +=LatLon;
        }
    }
    });
    let result: string[] | void[];
      result = temp.split("~");
      result.pop();
      if(result.length!=0){
        final_result = result.join("~");
        if(this.resultKeyWord?.length!==0){
          final_result+='$~'+ this.resultKeyWord;
         }
        }else{
          let LatLon:string='';
          final_result = this.resultKeyWord;
          if(this.showAllJobResults && !temp.includes('latlng')  && (this.JobLatitude && this.JobLatitude!=='') && (this.JobLongitude && this.JobLongitude!=='')){
            LatLon +='latlng$contains$' +'('+this.JobLatitude+','+this.JobLongitude+')';
            final_result  +='$~'+LatLon;
          }
        }
    this.savedFilter.SearchQuery = final_result;
    this.savedFilter.OutputFields =this.outputFields;
    this.savedFilter.ShowAllMatchingRecord = this.filterSearchForm.get('ShowAllMatchingRecord').value;
    this.savedFilter.ShowTopMatchingRecordNumber = this.filterSearchForm.get('ShowTopMatchingRecordNumber').value;
    this.savedFilter.includeJobPipeline = this.filterSearchForm.get('includeJobPipeline').value;
    this.commonService.setFilterInfo.next(this.savedFilter);
    return final_result;
  }
  getKeywordInfo(data:any,field:any){
    let temp:string='';
    data.forEach((element:any, i:any) => {
    let keyValue: string = '';
    keyValue += element.InputColumnValue;
    temp += field?.trim()  +'$'+ element.InputColumnCondition.ConditionName?.trim()  +'$' + (keyValue ? keyValue.trim() : 0) + '~' ;
    });
    let result: string[] | void[];
    result = temp.split("~");
    result.pop();
    temp = result.join("~");
    return temp;
  }
  /*
     @Type: File, <ts>
     @Name: quickJobListByJobId function
     @Who: Renu
     @When: 10-Feb-2023
     @Why: EWM-9370 EWM-10115
     @What: For get quick job list by id
  */

  JobInfoParamByJobId(jobId) {
    this.loading = true;
    let userType = 'Candidate';
    this.xeopleSearchService.xeopleSearchJobList(userType, jobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.JobParamValue = repsonsedata.Data;
          this.inputFields.forEach((element) => {
            let arr: any[] = [];
            arr = this.JobParamValue.filter(element1 => element1.InputColumnId === element.InputColumnId);
            if (arr.length == 1) {
              element["selected"] = true;
            } else {
              element["selected"] = false;
            }
          });
          this.patchQueryString(this.JobParamValue);
          this.checkvalInput = this.inputFields.filter(x => x.selected == true);
        this.filterSearchForm.patchValue({
          'InputFields':this.checkvalInput
        })
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }

  /*
   @Type: File, <ts>
   @Name: JobPatchString function
   @Who: Renu
   @When: 14-feb-2023
   @Why: EWM-9370 EWM-10115
   @What: WHEN JOB CHANGES then patch query string in search fields
  */
  // JobPatchString(queryObj){
  //   const control = <FormArray>this.filterSearchForm.controls['SearchQuery'];
  //   control.clear();
  //   queryObj?.InputFields.forEach((element: any, Index: number) => {
  //     let con = { 'ConditionId': element?.ConditionId, 'ConditionName': element?.ConditionName };
  //     let val: any;
  //     if (element.InputColumnType === 'Dropdown') {
  //       val = { 'Id': queryObj?.CountryId, 'StatusName': queryObj?.Country };
  //     } else {
  //       val = '';
  //     }

  //     control.push(
  //       this.fb.group({
  //         InputColumnId: [element.InputColumnId],
  //         InputColumnName: [element.InputColumnName],
  //         InputColumnCondition: [con],
  //         DBColumnName: [element.DBColumnName],
  //         InputColumnType: [element.InputColumnType],
  //         InputColumnValue: [val]
  //       })
  //     )
  //     this.filterCondition[Index] = element?.Condition;
  //     if (element?.InputColumnType === 'Dropdown') {
  //       this.getdropdownList(element, Index, 'Edit');
  //     }
  //   });
  // }

  /*
 @Type: File, <ts>
 @Name: getIntegrationCheckSMSstatus function
 @Who: maneesh
 @When: 10-feb-2023
 @Why: EWM-10033
 @What: For enable  disable  sms after check status sms
*/
  public isSMSStatus: boolean = false;
  getIntegrationCheckSMSstatus() {
    this.systemSettingService.getIntegrationCheckstatus(this.burstSMSRegistrationCode).pipe(
      takeUntil(this.destroySubject)
    ).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.loading = false;
          if (repsonsedata.Data) {
            this.isSMSStatus = repsonsedata.Data?.Connected;
          }
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  smsHistoryDetails() {
    // this.getSMSHistory();
    this.loading = true;

    this.smsHistoryToggel = true;
    this.quickFilterToggel = false;
    setTimeout(() => {
      this.openDrawer(this.receivephoneData);
    }, 1000);

    // this.loading = false;


  }
  openDrawer(can) {
    setTimeout(() => {
      if (this.SMSHistory.length > 0) {
        this.smsHistoryDrawer.open();
        this.isSmsHistoryForm = true;
        can['JobName'] = this.JobName;
        this.candidateIdData = can.CandidateId;
        this.candidateDetails = can;
        this.loading = false;

      } else {
        this.openJobSMSForCandidate(can)
      }
    }, 1500);
  }

  /*
  @Type: File, <ts>
  @Name: openJobSMS
  @Who: maneesh
  @When: 11-feb-2023
  @Why: EWM-10033
  @What: to open job Sms For Candidate modal dialog
  */
  openJobSMSForCandidate(dataItem) {
    this.loading = true;

    this.SmsData = this.receivephoneData;
    const dialogRef = this.dialog.open(XeopleSearchSmsComponent, {
      // maxWidth: "700px",
      data: new Object({ jobdetailsData: dataItem,JobId:this.selectedJobs?.Id,JobName:this.selectedJobs?.JobTitle }),
      // width: "90%",
      // maxHeight: "85%",
      panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        // this.getSMSHistory();
        this.loading = false;
      } else {
        this.loading = false;
      }
      this.smsHistoryToggel = false;
      this.quickFilterToggel = true;
    })
  }
  /*
  @Type: File, <ts>
  @Name: openTimelinePopup
  @Who: maneesh
  @When: 11-feb-2023
  @Why: EWM-10033
  @What: to open Timeline popup for total distance of job and candidate
  */
  openTimelinePopup() {
    this.SmsData = this.receivephoneData?.Id;
    this.candidateId = this.candidateId;
    const dialogRef = this.dialog.open(XeopleSearchTimelinesComponent, {
      data: { candidateId: this.timelineCandidateId },
      panelClass: ['xeople-modal-lg', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }


  /*
  @Type: File, <ts>
  @Name: openForLatLongDistance
  @Who: maneesh
  @When: 11-feb-2023
  @Why: EWM-10033
  @What: to open popup for total distance of job and candidate
  */
  openForLatLongDistance() {
    if ((this.JobLatitude != undefined && this.JobLatitude != null && this.JobLatitude != '') &&
      (this.JobLongitude != undefined && this.JobLongitude != null && this.JobLongitude != '') &&
      (this.Latitude != undefined && this.Latitude != null && this.Latitude != '') &&
      (this.Longitude != undefined && this.Longitude != null && this.Longitude != '')) {
      const dialogRef = this.dialog.open(GoogleMapsLocationPopComponent, {
        data: new Object({
          jobLat: this.JobLatitude, jobLong: this.JobLongitude, jobAddress: this.jobLocation,
          canLat: this.Latitude, canLong: this.Longitude, canAddress: this.direction
        }),
        panelClass: ['xeople-modal', 'candidateLatLong', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    }
  }


  /*
   @Type: File, <ts>
   @Name: openSaveFilterModal
   @Who:Renu
   @When: 15-feb-2023
   @Why:EWM-9377 EWM-10167
   @What: to open quick save filter add dialog
 */
  openSaveFilterModal() {
    const dialogRef = this.dialog.open(XeopleSaveFilterComponent, {
      data: { filterInfo: this.savedFilter },
      panelClass: ['xeople-modal', 'add_manageAccess', 'xeople-search-save-filter-modal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isSubmit == true) {
        let mode: number;
        if (res?.filterStatus == 'Edit') {
          this.filterById = res.value?.IsAdminFilter == 1 ? 0 : (res?.value?.Id);
        } else {
          this.filterById = 0;
        }

        this.filterSearchForm.patchValue({
          'filterName': res?.value?.filterName,
          'AccessName': res?.AccessName,
          'AccessId': res?.AccessId[0]?.Id
        });
        //this.oldPatchValues = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

        res.ToEmailIds.forEach(element => {
          this.accessEmailId.push({
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': 0
          });
        });
        this.onSaveFilter();
        this.filterlistSaved('');
      } else {

      }
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }




  /*
    @Name: filterlistSaved
    @Who: Renu
    @When: 17-jan-2022
    @Why:  EWM-9370 EWM-10115
    @What: on SEARCH BY FILTER
  */
  filterlistSaved(searchVal: string) {
    this.sortingValue = "";
    this.pagesize = 5;
    this.xeopleSearchService.getFilterSearchAll(this.pagesize, this.pagneNo, this.sortingValue, searchVal).pipe(
      takeUntil(this.destroySubject)
    ).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.filternotFoundMsg = false;
          this.loadingSearchFilter = false;
          this.SavedfilterList = repsonsedata.Data;
          this.defaultFilterAdmin = this.SavedfilterList.filter(x => x['IsAdminFilter'] == 1)?.[0];
          this.TotalFilter = repsonsedata.TotalRecord;
          let dataArr=this.SavedfilterList.filter(x=>x['Id']==this.selectedFilter?.Id);
          if(dataArr.length==0){
              this.filterVal='';
              this.resetValue(null);
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.filternotFoundMsg = true;
          // alert(this.filternotFoundMsg)
          // this.filterSearchForm.get("filterName").markAsTouched();
          // this.filterSearchForm.get("filterName").markAsDirty();
          this.SavedfilterList = [];
          this.loadingSearchFilter = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else {
          this.filternotFoundMsg = false;
          this.SavedfilterList = [];
          this.loadingSearchFilter = false;
        }
      }, err => {
        this.loadingSearchFilter = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Name: onsearchByFilter
   @Who: Renu
   @When: 17-jan-2022
   @Why:  EWM-9370 EWM-10115
   @What: on SEARCH BY FILTER
 */
  onsearchByFilter(searchVal: string) {
    this.loading = false;
    if (searchVal.length > 0 && searchVal.length < 3) {
      this.loadingSearchFilter = false;
      return;
    }
    this.searchSubject$.next(searchVal);
  }

  /*
    @Name: selectedFilterCheck
    @Who: Renu
    @When: 14-Feb-2023
    @Why:  EWM-9377 EWM-10167
    @What: on chose filter search for uniquenes for the filter
  */
  selectedFilterCheck(event) {
   // this.trigger.openPanel();
    this.filterVal = event.option.value.FilterName;
    this.filterSearchForm.patchValue({
      'filterName': event.option.value.FilterName
    });
    this.getXfactorFilterById(event.option.value.Id);
  }

  /*
    @Name: resetValue
    @Who: Renu
    @When: 14-Feb-2023
    @Why:  EWM-9377 EWM-10167
    @What: on reset the filter value
  */

  resetValue(evt: any): void {
    this.closeResults();
    this.filterVal = '';
    this.inputVal='';
    if(evt){
      evt?.stopPropagation();
    }
    this.filterSearchForm.controls['inputValue'].setValue(this.inputVal);
    this.getJobWorkflowALL();
    this.filterSearchForm.get('filterName').reset();
    this.filterSearchForm.controls['includeJobPipeline'].reset();
    this.filterSearchForm.controls['ShowAllMatchingRecord'].setValue(1);
    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].reset();
   // this.inputAutoComplete?.nativeElement.focus();
    if(evt){
      this.filterlistSaved('');
      }
    this.savedFilter = {};
    this.resetAllFilter();
    this.filterSearchForm.controls['OutputFields'].reset();
    this.filterSearchForm.controls['InputFields'].reset();  /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10970 EWM-11045 @What:  reset values **/
    this.commonService.setFilterInfo.next(this.savedFilter);
  }
  /*
    @Name: onDeleteFilter
    @Who: Renu
    @When: 14-Feb-2023
    @Why:  EWM-9377 EWM-10167
    @What: on delete the filter value
  */
  onDeleteFilter(val: any) {

    //this.trigger.openPanel();
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_filter';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.filterSearchForm.get('filterName').reset();
        this.savedFilter = {};
        let delObj = {};
        delObj['Id'] = [val?.Id];
        this.xeopleSearchService.deleteFilterSearch(delObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              //[] this.SavedfilterList.splice(index, 1);
              this.filterlistSaved('');
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    })

  }

  /*
    @Type: File, <ts>
    @Name: openFilterListModal
    @Who: Renu
    @When: 14-Feb-2023
    @Why:  EWM-9377 EWM-10167
    @What: to open quick filter list all modal dialog
  */
  openFilterListModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(XeopleFilterListComponent, {
      //data: new Object({SavedfilterList:this.SavedfilterList }),
      panelClass: ['xeople-modal', 'xeople-search-all-filters', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.filterlistSaved('');
      }
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }

  /*
      @Type: File, <ts>
      @Name: resetAllFilter
      @Who: Renu
      @When: 17-Feb-2023
      @Why:  EWM-9377 EWM-10167
      @What: on reset the filter
  */
  resetAllFilter() {
    this.closeResults();
    const control = <FormArray>this.filterSearchForm.controls['SearchQuery'];
    control.clear();
  /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10970 EWM-11045 @What:  reset values **/
    this.checkvalInput=this.inputFields.filter(x => x['selected'] = false);
    this.filterSearchForm.controls['includeJobPipeline'].reset();
    this.filterSearchForm.controls['ShowAllMatchingRecord'].reset();
    this.filterSearchForm.controls['ShowAllMatchingRecord'].setValue(1);
    this.filterSearchForm.controls['InputFields'].reset();
    this.filterSearchForm.controls['OutputFields'].reset();
    this.filterSearchForm.controls['filterName'].reset();
    this.filterSearchForm.controls['JobId'].reset();
    this.filterSearchForm.controls['JobTitle'].reset();
    this.jobId=null;  /*** @When: 19-05-2023 @Who:Renu @Why: EWM-11414 EWM-11576 **/
    this.selectedJobs={};
    this.jobObj={};
 
    this.showAllJobResults = false;
    this.selectedJobSaved = {};
    this.savedFilter=[];
    this.keywordList=[];
    this.commonService.setFilterInfo.next(this.savedFilter);
    this.getDefaultFilterById();
    this.inputVal='';
    this.filterSearchForm.controls['inputValue'].setValue(this.inputVal);
    this.getJobWorkflowALL();
    this.topVal = true;
    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].setValue('');
    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].clearValidators();
    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].updateValueAndValidity();
  }

  /*
   @Type: File, <ts>
   @Name: searchPoolList function
   @Who: Renu
   @When: 30-jan-2023
   @Why:EWM-9625 EWM-10071
   @What:get searchPoolList list
*/
  searchPoolList() {
    this.xeopleSearchService.getsearchPoolList().pipe(
      takeUntil(this.destroySubject)
    ).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.poolInfo = repsonsedata.Data.map((p) =>
            p.IsEnabled === 1 ? p : { ...p, disabled: true }
          );
        } else {
          this.loading = false;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

/*
  @Who: Renu
  @When: 21-Aug-2021
  @Why: EWM-2447
  @What: to compare objects selected
*/
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.SearchPoolId === c2.SearchPoolId : c1 === c2;
  }
/*
   @Type: File, <ts>
   @Name: onDropdownDatachange function
   @Who: Renu
   @When: 30-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: on changing the dropdown of formarray
*/
  onDropdownDatachange(data: any, index:number,IsMultiple:boolean) {
    //let frmArray = (<FormArray>this.filterSearchForm.get('SearchQuery')).at(index) as FormArray;
    const filterform = this.filterSearchForm.get('SearchQuery') as FormArray;
    //frmArray.get('InputColumnValue').setValidators([Validators.required]);
    if (data == undefined || data == null || data == "" || data?.length == 0) {
      this.multiDropDownData[index] = null;
      filterform.at(index).patchValue({
        InputColumnValue: null
      })
    }
    else {
      if(IsMultiple==true){
        let val: any[] = [];
        val.push({ 'Id': data[0]?.Id, 'Name': data[0][this.keyValue[index]] });

        filterform.at(index).patchValue({
          InputColumnValue: val,
        });

      }else{
        let val: any[] = [];
        val.push({ 'Id': '', 'Name': data[this.keyValue[index]] });

        filterform.at(index).patchValue({
          InputColumnValue: val,
        });
      }
      this.multiDropDownData[index] = data;
    }
  }
/*
   @Type: File, <ts>
   @Name: onJobPipelineChange function
   @Who: Renu
   @When: 30-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: when job pipeline changes value
*/
  onJobPipelineChange($event){
    this.savedFilter.IncludeJobPipelineCandidate = $event.checked?1:0;
    this.commonService.setFilterInfo.next(this.savedFilter);
  }

  /*
     @Type: File, <ts>
     @Name: getDefaultFilterBy function
     @Who: Renu
     @When: 10-Feb-2023
     @Why: EWM-10970 EWM-11045
     @What:get x-factor default filter list
  */
     getDefaultFilterById() {
      this.loading = true;
      this.xeopleSearchService.getXfactorFilterById(1).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata?.HttpStatusCode === 200) {
            this.loading = false;
            this.SelectedOutputFields = repsonsedata.Data?.OutputFields;
            this.outputFields.forEach((element) => {
              let arr: any[] = []
              arr = this.SelectedOutputFields.filter(element1 => element1.OutputFieldName === element.OutputFieldName);
              if (arr.length == 1) {
                element["selected"] = true;
              } else {
                element["selected"] = false;
              }
              this.checkval = this.outputFields.filter(x => x.selected == true);
              this.filterSearchForm.controls['OutputFields'].setValue(this.inputFields);
            });

          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
 /*
     @Type: File, <ts>
     @Name: onKeywordChangeCondition
     @Who:  Renu
     @When: 24-july-2023
     @Why: EWM-13122 EWM-13580
     @What: For clear data in input value when user change dropdown condition
   */
     onKeywordChangeCondition(index:number,con,jindex:number){
      this.keywordList[jindex]=[];
          con.controls['InputColumnValue'].controls[jindex].patchValue({
            InputColumnValue:''
          })
        }

  /*
   @Type: File, <ts>
   @Name: removeKeywordParam function
   @Who: Renu
   @When: 16-June-2023
   @Why: EWM-10610 EWM-12677
   @What: for clearing keyword filter
*/

  removeKeywordParam(con: any, pindex: number,cindex:number) {
    this.InputColumnValueInfo(pindex).removeAt(cindex);
    this.keywordList.splice(cindex, 1);
    this.resultKeyWord='';
   // this.keywordList=[];
  }

  InputColumnValueInfo(index): FormArray {
    return (<FormArray>this.filterSearchForm.controls['SearchQuery']).at(index).get('InputColumnValue') as FormArray;
  }
  addKeywordControl(con,index){
    this.InputColumnValueInfo(index).push(this.createItem(con));
  }

  createItem(con): FormGroup {
    this.keywordList.push([]);
    return this.fb.group({
      InputColumnValue: [,[Validators.required]],
      InputColumnCondition: [con]
    });

  }

  addKeyWord(event: MatChipInputEvent,index:number,jindex:number,inputVal:any,kindex:number): void {
    const input = event.input;
    const value = event.value;
    let cons=(<FormArray>this.filterSearchForm.controls['SearchQuery']).at(index).get('InputColumnValue') as FormArray;
    let prons=(cons.controls[jindex] as FormArray);
     /**what:exact impl remove for temp basis @when:09-10-2023 @who:renu */
    //if(prons.controls['InputColumnCondition'].value.ConditionName!=="Exact"){
      if ((value || '').trim() && this.keywordList[jindex]?.length<=2) {
        this.keywordList[jindex].push(value.trim());
        prons.controls['InputColumnValue'].setValue( this.keywordList[jindex]);
      }

    // }else{
    //   this.arr=[];
    //   if ((value || '').trim()) {
    //   if(this.keywordList[jindex]?.length===0|| this.keywordList[jindex]?.length===undefined){
    //   this.arr.push(event.value.trim());
    //   this.keywordList[jindex]=this.arr;
    //   prons.controls['InputColumnValue'].setValue(this.arr);
    //   }else{
    //     this.keywordList[jindex]=[event.value.trim()];
    //     prons.controls['InputColumnValue'].setValue([event.value.trim()]);
    //   }
    // }
    // }
    if (input) {
      input.value = '';
    }
  }
  /*
     @Type: File, <ts>
     @Name: removeKeyWord function
     @Who: Renu
     @When: 25-July-2023
     @Why: EWM-10610 EWM-12677
     @What:to remove keys keyword param
  */
  removeKeyWord(data: any,index:number,con:any,jindex:number): void {
    this.keywordList.filter((x,i)=>{
    if (x.indexOf(data)>= 0) {
      x.splice(x.indexOf(data), 1);
      con.controls['InputColumnValue'].controls[jindex].patchValue({
        InputColumnValue:x
      }
      );
    }
    })
  }

  public clickForToMoreRecord(keywordArr) {
    this.LengthToMore = keywordArr.length;
  }

  /*
     @Type: File, <ts>
     @Name: getcvParsedCountAll function
     @Who: Renu
     @When: 10-Feb-2023
     @Why: EWM-10610 EWM-12677
     @What:get cv parsed count info
  */
     getcvParsedCountAll() {
      this.xeopleSearchService.getcvParsedCountAll().pipe(
        takeUntil(this.destroySubject)
      ).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata?.HttpStatusCode === 204 ||repsonsedata?.HttpStatusCode === 200 ) {
            this.loading = false;
            this.resumeParsed= repsonsedata.Data;
          } else {
            //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
    confirmDialog(){
    const message = `label_NoresumeParsed`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData, isButtonShow: true},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
    dialogRef.afterClosed().subscribe(dialogResult => {
    })
    }

   /*
     @Type: File, <ts>
     @Name: getJobWorkflowALL function
     @Who: Renu
     @When: 24-july-2023
     @Why: EWM-13284 EWM-13357
     @What: get workflow without Job
  */
    getJobWorkflowALL(){
      // adarsh singh on 4 March 2024 for EWM-16083
      let params = `?search=${encodeURIComponent(this.inputVal)}&pageSize=${this.inputVal?.length > 1 ? this.pageSIZE :(50)}`;
      this.xeopleSearchService.getAllJobsWithoutWorkflowWithoutParsing(params).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata?.HttpStatusCode === 204 ||repsonsedata?.HttpStatusCode === 200 ) {
            this.loaderRefresh = false;
            this.JobWorkFlow= repsonsedata.Data;
            /*************@Who:Renu @when: 20-11-2023 @Why:EWM-14145 EWM-14894 ******/
           // let savedJobLocal=JSON.parse(localStorage.getItem('XeopleSelectedJob'));
            // if(this.jobId!==null ? (this.JobSelectedRouter && localStorage.getItem('XeopleSelectedJob')!==null):false){
            //   this.selectedJobs =  { 'Id': savedJobLocal?.Id,'JobTitle':savedJobLocal?.JobTitle };
            //  this.filterSearchForm.patchValue({
            //    JobId: this.selectedJobs?.Id,
            //    JobTitle:this.selectedJobs?.JobTitle
            //  });
            //  this.showAllJobResults = true;
            //  this.getJobDetails(savedJobLocal?.Id);
            //  this.JobInfoParamByJobId(savedJobLocal?.Id);
            //  this.jobId=savedJobLocal?.Id;
            // }
          } else {
            //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loaderRefresh = false;
          }
        }, err => {
          this.loaderRefresh = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
 /*
     @Type: File, <ts>
     @Name: getUpdateOptions function
     @Who: Renu
     @When: 24-july-2023
     @Why: EWM-13284 EWM-13357
     @What: get refrsh the record again
  */

  getUpdateOptions(){
    this.loaderRefresh=true;
    this.getJobWorkflowALL();
  }

  /*
     @Type: File, <ts>
     @Name: searchData
     @Who:  Suika
     @When: 08-feb-2023
     @Why: EWM-10496
     @What: For searching data server side
   */
     searchData(inputValue: string){
      if (inputValue.length > 0 && inputValue.length < 3) {
        this.loadingSearch = false;
        return;
      }
      this.inputVal=inputValue;
      this.filterSearchForm.controls['inputValue'].setValue(this.inputVal);
      this.getJobWorkflowALL();
    }

    /*
     @Type: File, <ts>
     @Name: onSearchFilterClear
     @Who:  Renu
     @When: 24-july-2023
     @Why: EWM-13284 EWM-13357
     @What: For clear Filter search value
   */
  public onSearchFilterClear(): void {
    this.loadingSearch = false;
    this.inputVal = '';
    this.filterSearchForm.controls['inputValue'].setValue(this.inputVal);
    this.getJobWorkflowALL();
  }

    /*
     @Type: File, <ts>
     @Name: onChangeSearchPool
     @Who:  Renu
     @When: 01-Sep-2023
     @Why: EWM-13753 EWM-14029
     @What: For searchPool change to idetifiy EOH & RECruit
   */
  onChangeSearchPool(event){
   if(event?.SearchPoolName?.toLowerCase()=='Entire OnHire'.toLowerCase())
   {
    if(this.jobId && this.jobId!='')
    this.router.navigate(['./client/core/home/xeople-search-eoh'],{ state: { JobSelected: true } });
    else
    this.router.navigate(['./client/core/home/xeople-search-eoh'],{ state: { JobSelected: false } });
   }

  }
   /*
     @Type: File, <ts>
     @Name: ngOnDestroy
     @Who:  Renu
     @When: 05-Sep-2023
     @Why: EWM-13753 EWM-14130
     @What: for clearing all subcriptions
   */
  ngOnDestroy(){
    this.destroySubject.next();
  }


/* @Name: openShareEmailModal function @Who: Renu @When: 08-Sept-2023 @Why: EWM-13708-EWM-13925 @What:  for share resume*/

openShareEmailModal(responseData: any, mailRespondType: string) {
  const message = ``;
  const EmailData = this.xeopleSearchData;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(XeopleShareResumeComponent, {
    maxWidth: "750px",
    width: "95%",
    maxHeight: "100%",
    height: "100%",
    data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': this.emailConnection, 'toEnableEmail': true, 'EmailData':EmailData,JobId:this.jobId,JobTitle:this.selectedJobs?.JobTitle },
    panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult) {
      this.pagneNo = 1;
      this.pagesize = 50;
      this.sortingValue = '';
      this.searchValue = '';
      if (this.tabActive == 'Draft') {
        if (dialogResult.draft == true) {
          this.getDraftList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
        } else {
          this.deleteDraft(this.pagneNo, this.sortingValue, this.searchValue);
        }
      } else if (this.tabActive == 'Inbox') {
        if (this.isFavouritChecked) {
          this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '')
        } else {
          // this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, '');
        }
      } else if (this.tabActive == 'Sent') {
        setTimeout(() => {
          this.fetchSendList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
        }, 2000)
      }

      // setTimeout(() => {
      //   this.getMailCount();
      // }, 2000)
    }
    this.allComplete = false;

  })
}
// who:Renu,why:ewm-13752 ewm-14377 what: for checking push member subscription ,when:19/09/2023
getEOHPushJobSubsDetails() {
  this.systemSettingService.getEOHPushJobSubsDetails(this.eohRegistrationCode).pipe(
    takeUntil(this.destroySubject)
  ).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      this.IsPushJobNotificationEnable = repsonsedata.Data.IsPushJobNotificationEnable==1?true:false;
      localStorage.setItem('IsPushJobNotificationEnable',repsonsedata.Data.IsPushJobNotificationEnable);
    } else if (repsonsedata.HttpStatusCode === 400) {
      this.loading = false;
    }
    else {
      this.loading = false;
    }
  },
    err => {
      this.loading = false;
    });
}

 // who:Renu,why:ewm-13752 ewm-14377 what: opening push memebers popup ,when:19/09/2023
openPushMemberPopup(){
  const message = ``;
  const title = '';
  const subtitle = '';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(XeoplePushMembersComponent, {
    //data: new Object({ memberId:this.memberId}),
    panelClass: ['xeople-modal-lg', 'view_pushMembers', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
   if(res==false){

   }
  })
   // RTL Code
   let dir: string;
   dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
   let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
   for (let i = 0; i < classList.length; i++) {
     classList[i].setAttribute('dir', this.dirctionalLang);
   }
}
// who:Renu,why:ewm-13752 ewm-14377 what: for checking eoh subscription  ,when:19/09/2023
getEOHSrhExtSubsDetails() {
  this.loading = true;
  this.systemSettingService.getEOHSrhExtSubsDetails(this.eohRegistrationCode).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.loading = false;
      this.IsSearchExtractNotificationEnable = repsonsedata.Data.IsSearchExtractNotificationEnable==1?true:false;
      localStorage.setItem('IsSearchExtractNotificationEnable',repsonsedata.Data.IsSearchExtractNotificationEnable);
      } else if (repsonsedata.HttpStatusCode === 400) {
      this.loading = false;
    }
    else {
      this.loading = false;
    }
  },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

     IsplaceChange = false;
/*@When: 13-03-2024 @Who:Renu @Why: EWM-16172 EWM-16435 @What: for prioximity address from google places */
public focusOutAddress(event,con: any){
  if(event.target.value==='')
  {
    this.IsplaceChange = false;
    con.controls['proximityLocation'].setValidators([Validators.required,this.noWhitespaceValidator()]);
    con.controls['proximityLocation'].updateValueAndValidity();
    con.controls['proximityLocation'].markAsTouched(); 
    con.controls.proximityLocation.setValue('');
  }
  if (this.IsplaceChange == false) {
    this.IsplaceChange = false;
    con.controls['proximityLocation'].setValidators([Validators.required,this.noWhitespaceValidator()]);
    con.controls['proximityLocation'].updateValueAndValidity();
    con.controls['proximityLocation'].markAsTouched(); 
    con.controls.proximityLocation.setValue('');
  }
 
}

/*@When: 30-04-2024 @Who:Renu @Why: EWM-16620 EWM-16885 @What:For prioximity address from google places */
    public fetchDataFromAddressBar(address:any,con:any) {
      this.IsplaceChange = true;
     con.controls.proximityLocation.setValue(address.formatted_address);
      con.controls['proximityLocation'].clearValidators();
     this.JobLatitude=address?.geometry?.location?.lat() ?? 0;
     this.JobLongitude=address?.geometry?.location?.lng()?? 0;
    }

    /*@When: 13-03-2024 @Who:Renu @Why: EWM-16172 EWM-16435 @What: for prioximity address from google places */
    noWhitespaceValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const isWhitespace = (control.value || '')?.trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
      };
    }
}

export function conditionalValidator(type:string): ValidatorFn {
  return function validate(formGroup: FormGroup) {
    if (type == 'Numeric') {
      const reg = new RegExp("^[0-9]*$");
       const isValid = reg.test(formGroup.value);
       return isValid ? null : { 'numeric': true };
    }else{
      return null;
    }
}



}


