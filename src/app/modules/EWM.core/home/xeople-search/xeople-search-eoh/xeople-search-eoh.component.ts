import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig } from '../../../shared/datamodels';
import { XeopleSearchService } from '../../../../EWM.core/shared/services/xeople-search/xeople-search.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { CandidateService } from '../../../shared/services/candidates/candidate.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { XeopleEohFilterListComponent } from '../xeople-eoh-filter-list/xeople-eoh-filter-list.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ButtonTypes } from 'src/app/shared/models';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { debounceTime } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import {InputFields, OutputFields} from './input-output-models';
import { ExtractMapBulkComponent } from './extract-map-bulk/extract-map-bulk.component';
import { XeopleEohSaveFilterComponent } from '../xeople-eoh-save-filter/xeople-eoh-save-filter.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-xeople-search-eoh',
  templateUrl: './xeople-search-eoh.component.html',
  styleUrls: ['./xeople-search-eoh.component.scss']
})
export class XeopleSearchEOHComponent implements OnInit {

  public showOutputResilts = 121;
  public showAllResults = 20;
  public showAllJobResults = false;
  public poolInfo: any[] = [];
  public filterSearchForm: FormGroup;
  public selectedJobs: any = {};
  public selectedFilter: any = {};
  public filterList: any[] = [];
  public selectedPool: any = {
    SearchPoolName:'Entire OnHire',SearchPoolId:4
  };
  public xeopleFilterConfig: customDropdownConfig[] = [];
  public xeopleSearchPoolConfig: customDropdownConfig[] = [];
  public loading: boolean = false;
  public selectedInputFields: any[] = [];
  public SelectedOutputFields: any[] = [];
  public inputFields: any[] =InputFields;
  public outputFields: any[] = OutputFields;
  public conditionsList: any = [];
  filterCondition: any[] = [];
  apiGateWayUrl: any;
  dropList: any[] = [];
  multiDropDownData: any = [];
  config: any = [];
  public keyValue: any = [];
  showAndCondition: boolean;
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
  public searchSubject$ = new Subject<any>();
  public PhoneNumber: any;
  public JobId: any;
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
  public candidateName: any
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  docFileUrlEmit: any;
 
  public positionMatDrawer: string = 'end';
  ActivedraftId: any = null;
  public sendEmail: any;
  notPhoneNumber: any
  @ViewChild('quickFilter') public righttoggel: MatSidenav;
  @ViewChild('shareJobApplicationForm') public shareJobApplicationForm: MatSidenav;
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  public burstSMSRegistrationCode: any;
  SMSHistory: any = [];
  public jobLocation: any;
  JobName: any;
  JobParamValue: any = [];
  jobParamOn: boolean = false;
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
  keywordList: string[][] = [];
  resultKeyWord: string='';
  public LengthToMore: any=1;
  resumeParsed: number;
  arr=[];
  isoneArr=[];
 
  public currentMenuWidth: number;
  maxMoreLengthKeywordList:any;
  public JobWorkFlow: []=[]; /*@When: 10-07-2023 @Who: Renu @Why: EWM-13067*/
  public inputVal: string='';
  byPassPaging: boolean=true;
  loaderRefresh: boolean=false;
  distanceUnit: string='KM';
  JobLatitude= null;
  JobLongitude=null;
  totalRecords: number;
  selectedCanForExtractCount: number=0;
  selectedCanForExtractData: string[]=[];
  public secondThirdFourthSec:boolean=true;
  burstSMSCheckStatus: boolean=false;
  apiWaitLoader: boolean[] = [false];
  ExtractedStatus: boolean=false;
  public IsPushJobNotificationEnable: boolean=false;
  public IsSearchExtractNotificationEnable: boolean=false;
  public eohRegistrationCode:string;
  public IsEOHIntergrated: boolean=false;
  //public JobSelectedRouter: string;
  

  constructor(private router: Router, private serviceListClass: ServiceListClass, private fb: FormBuilder,public _sidebarService: SidebarService,
    private translateService: TranslateService, private snackBService: SnackBarService,public dialogObj: MatDialog,
    private xeopleSearchService: XeopleSearchService, private appSettingsService: AppSettingsService,
    public _dialog: MatDialog, private commonService: CommonserviceService, private candidateService: CandidateService,
    public systemSettingService: SystemSettingService, public quickJobService: QuickJobService,
    private commonServiesService: CommonServiesService,public dialog: MatDialog, private mailService: MailServiceService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.pagesize = this.appSettingsService.pagesize;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    this.apiGateWayUrl = this.appSettingsService.apiGateWayUrl;
    this.distanceUnit = localStorage.getItem('DistanceUnit')!=='null'?localStorage.getItem('DistanceUnit'):'KM';
    this.filterSearchForm = this.fb.group({
      FilterName: [],
      UserType: ['Candidate'],
      SearchPool: [this.selectedPool, [Validators.required]],
      AccessName: [],
      AccessId: [],
      ShowAllMatchingRecord: [1],
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
    this.getJobWorkflowALL();
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;  
    //this.JobSelectedRouter=this.router.getCurrentNavigation()?.extras?.state?.JobSelected;
  }

  ngOnInit(): void {
   
    this.screenMediaQuiry();
    let URL = this.router.url;
    let URL_AS_LIST: string[];
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next('xeople-search');

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //
    this.commonService.xeopleSearchServicedata.subscribe((data) => {
      this.xeopleSearchData = data;
      this.xeopleSearchDatalength = this.xeopleSearchData?.IsDefault;

    })
    /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
    this.commonServiesService.searchEnableCheck(1);
    //this.getXfactorFilterById(0);
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
    let burstSMSRegistrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
    this.burstSMSCheckStatus =  burstSMSRegistrationObj[0]?.Connected;
    this.IsPushJobNotificationEnable=localStorage.getItem('IsPushJobNotificationEnable')=='1'?true:false;
    this.IsSearchExtractNotificationEnable=localStorage.getItem('IsSearchExtractNotificationEnable')=='1'?true:false;
    let eohRegistrationCode=otherIntegrations?.filter(res=>res.RegistrationCode==this.eohRegistrationCode);
    this.IsEOHIntergrated =  eohRegistrationCode[0]?.Connected;
    
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


  /* @Name: searchResults @Who: Renu @When: 22-09-2023 @Why:EWM-14255 EWM-14221 @What: to searchResults candidate EOH */
  searchResults() {
    this.searchResult = true;
    this.hideResults = true;
    setTimeout(() => { this.secondThirdFourthSec=false; }, 200);
    this.FilterQueryString(this.filterSearchForm?.value?.SearchQuery);
    document.getElementById("xeople-drawer").style.overflow = "hidden";   
  }
    
  /* @Name: closeResults @Who: Renu @When: 22-09-2023 @Why:EWM-14255 EWM-14221 @What: to close drawer candidate EOH */

  closeResults() {
    document.getElementById("xeople-drawer").style.overflow = null;
    this.searchResult = false;
    this.totalRecords=0;
    this.selectedCanForExtractCount=0;
    this.secondThirdFourthSec=true;
    setTimeout(() => { this.hideResults = false; }, 200);
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
      //localStorage.removeItem("XeopleSelectedJob");
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
          if(this.jobId){
          //localStorage.setItem("XeopleSelectedJob",JSON.stringify(data));
          this.getJobDetails(data?.Id);
         // this.JobInfoParamByJobId(data?.Id);
          this.selectedJobs = data;
          this.savedFilter.JobDetails= this.selectedJobs;
          this.commonService.setFilterInfoEOH.next(this.savedFilter);
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
         // localStorage.removeItem("XeopleSelectedJob");
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
    this.xeopleSearchService.getEOHFilterById(filterById).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 ||repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          this.savedFilter = repsonsedata?.Data;
          this.commonService.setFilterInfoEOH.next(this.savedFilter);
        
          this.selectedPool = { 'SearchPoolId': this.savedFilter?.SearchPools[0].SearchPoolId, SearchPoolName: this.savedFilter?.SearchPools[0].SearchPoolName};
          this.selectedFilter = { 'Id': this.savedFilter?.Id };
          this.filterVal = this.savedFilter?.FilterName;
          if (this.savedFilter?.JobId) {
            this.selectedJobs = { 'Id': this.savedFilter?.JobId };
            this.filterSearchForm.patchValue({
              JobId: this.selectedJobs?.Id,
              JobTitle:this.selectedJobs?.JobTitle
            });
            this.showAllJobResults = true; 
            this.getJobDetails(this.savedFilter?.JobId);
            this.jobId=this.savedFilter?.JobId;
          } 

          this.filterSearchForm.patchValue({
            'filterName': this.savedFilter?.FilterName,
            'UserType': this.savedFilter?.UserType,
            'ShowAllMatchingRecord': this.savedFilter?.ShowAllMatchingRecord,
            'ShowTopMatchingRecordNumber': this.savedFilter?.ShowTopMatchingRecordNumber
          });
          if (this.savedFilter?.ShowAllMatchingRecord == 1) {
            this.topVal = true;
          } else {
            this.topVal = false;
          }
          this.selectedInputFields = this.savedFilter?.InputFields;
          this.SelectedOutputFields = this.savedFilter?.OutputFields;
          if (this.savedFilter?.UserType) {
            this.getXfactorIOList();
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
     @Name: getXfactorIOList function
     @Who: Renu
     @When: 08-Feb-2023
     @Why: EWM-9370 EWM-10115
     @What: get X-factor input/output list 
  */
  getXfactorIOList() {
          this.loading = false;
          this.filterSearchForm.patchValue({
            'InputFields': this.inputFields
          })
          
          this.inputFields.forEach((element) => {
            let arr: any[] = [];
            arr = this.selectedInputFields.filter(element1 => element1.InputColumnName.toLowerCase() === element.InputColumnName.toLowerCase());
            if (arr.length == 1) {
              if(element.InputColumnName.toLowerCase()!=='Keyword'){
              element["selected"] = true;
              element["InputColumnCondition"] = (arr[0]?.InputColumnCondition)?(arr[0]?.InputColumnCondition):(element?.InputColumnCondition);
              element["InputColumnValue"] = arr[0]?.InputColumnValue;
              element['IsMultiple']= element?.IsMultiple; 
            } else {
              element["selected"] = false;
              element["InputColumnCondition"] = (arr[0]?.InputColumnCondition)?(arr[0]?.InputColumnCondition):(element?.InputColumnCondition);
              element["InputColumnValue"] = arr[0]?.InputColumnValue;
              element['IsMultiple']= element?.IsMultiple; 
            }
          }
          });
        
          this.conditionsList = this.inputFields.filter(x => x['selected'] == true);
          this.patchQueryString(this.conditionsList);
          this.checkvalInput = this.inputFields.filter(x => x.selected == true); 

  }

/* @Name: inputFieldChange function @Who: Renu @When: 08-Sept-2023 @Why: EWM-13708 EWM-13925 @What: when user click on input fileds*/
  inputFieldChange(obj: any) {
    if(obj.InputColumnName.toLowerCase()=="keyword" && this.resumeParsed==0){
        this.confirmDialog();
    }else{
      obj.selected = !obj.selected;
      let index = this.searchInfo().controls.findIndex(x => x['controls'].InputColumnName.value.toLowerCase() === obj.InputColumnName.toLowerCase());
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
  /* @Name: searchQueryAdd function @Who: Renu @When: 08-Sept-2023 @Why: EWM-13708 EWM-13925  @What: get formarray alias */
  searchQueryAdd(element) {
    this.showAndCondition = true;
    const control = <FormArray>this.filterSearchForm.controls['SearchQuery'];
     let con = { 'ConditionName': element.InputColumnCondition,'ConditionId':element.InputColumnConditionId };
    control.push(
      this.fb.group({
        InputColumnName: [element.InputColumnName, [Validators.required]],
        EOHFieldName:[element.EOHFieldName],
        InputColumnCondition: [con, [Validators.required]], 
        InputColumnType: [element?.InputColumnType],
        InputColumnValue: element?.InputColumnName.toLowerCase()=="keyword"?this.fb.array([this.createItem(con)]):[, [Validators.required,conditionalValidator(element?.InputColumnType)]],
        IsMultiple:[element.IsMultiple] 
      })
    );
   
    this.filterCondition[this.searchInfo().length - 1] = element?.Condition;
    if (element?.InputColumnType.toLowerCase() === 'dropdown') {
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
      let con = { 'ConditionName': element.InputColumnCondition,'ConditionId':element.InputColumnConditionId };
      let val: any = [];
      if (element.InputColumnName.toLowerCase()!== "Keyword".toLowerCase()) {
      if (element.InputColumnType.toLowerCase() === 'Dropdown'.toLowerCase()) {
        element?.InputColumnValue.forEach(element => {
          val.push({ 'Id': element?.ValueCode, 'Text': element?.ValueName });
        });

      } else if(element.InputColumnType.toLowerCase() === 'Numeric'.toLowerCase()){
        val = Number(element?.InputColumnValue[0]?.ValueName);
      }else{
        val = element?.InputColumnValue[0]?.ValueName;
      }
      control.push(
        this.fb.group({
          InputColumnName: [element.InputColumnName, [Validators.required]],
          EOHFieldName:[element.EOHFieldName],
          InputColumnCondition: [con, [Validators.required]],
          InputColumnType: [element.InputColumnType],
          InputColumnValue: [val, [Validators.required,conditionalValidator(element?.InputColumnType)]],
          IsMultiple:[element.IsMultiple] 
        })
      )
      this.filterCondition[Index] = element?.Condition;
      if (element?.InputColumnType === 'Dropdown') {
        this.getdropdownList(element, Index, 'Edit');
      }
    }else{
   
        control.push(
        this.fb.group({
          InputColumnName: [element.InputColumnName, [Validators.required]],
          EOHFieldName:[element.EOHFieldName],
          InputColumnCondition: [con, [Validators.required]],
          InputColumnType: [element.InputColumnType],
          InputColumnValue: this.fb.array([this.createItem(con)]),
          IsMultiple:[element.IsMultiple] 
        })
      )
      this.filterCondition[Index] = element?.Condition;
      const keywordCntrl= control.at(Index).get('InputColumnValue') as FormArray;
      keywordCntrl.clear();
      element?.InputColumnValue.forEach((ele: any, jindex: number) => {
        this.keywordList.push([]);
      keywordCntrl.push(
        this.fb.group({
          InputColumnValue: [ ele?.ValueName,[Validators.required]],
          InputColumnCondition: [{'ConditionName':ele?.ValueCode}]
      }));
     /**what:exact impl remove for temp basis @when:09-10-2023 @who:renu */
     // if(ele?.ValueCode!=="Exact"){
        if ((ele?.ValueName || '').trim()) {
          ele?.ValueName.split(',').forEach(ele => {
            this.keywordList[jindex].push(ele);
          });
        }
      // }else{
      //   this.arr=[];
      //   if ((ele?.ValueName || '').trim()) {
      //   if(this.keywordList[jindex]?.length===0|| this.keywordList[jindex]?.length===undefined){
      //   this.arr.push(ele?.ValueName.trim());
      //   this.keywordList[jindex]=this.arr;
      //   }else{
      //     this.keywordList[jindex]=[ele?.ValueName.trim()];
      //   }
      // }
      // }
    })
    }
  })
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
 
 
  /*  @Name: removeSearchParam function  @Who: Renu @When: 09-Sept-2023 @Why: EWM-9625 EWM-10071 @What:for clearing filter*/

  removeSearchParam(con: any, index: any) {
    this.multiDropDownData.splice(index, 1);
    this.dropList.splice(index, 1);
    this.keyValue.splice(index, 1);
    this.filterCondition.splice(index, 1);
    this.searchInfo().removeAt(index);
    if(con.value['InputColumnName'].toLowerCase()=='Keyword'.toLowerCase()){
      this.keywordList=[];
    }
    this.inputFields.filter(x => {
      if (x?.InputColumnName.toLowerCase() == con?.value?.InputColumnName.toLowerCase())
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

  /*  @Name: getdropdownList function  @Who: Renu @When: 09-Sept-2023 @Why: EWM-9625 EWM-10071 @What: if user has save query string then patch its value*/
  getdropdownList(element: any, index: number, type: string) {
    this.multiDropDownData[index] = null;
    this.config.splice(index, 0, element);
    let apiObj = {};
    apiObj['Tag']=element?.EOHFieldName;
    apiObj['Conditions']={};
    this.apiWaitLoader[index]=true;
    this.xeopleSearchService.getTagInputList(apiObj).subscribe(
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
               selectDropDown = this.dropList[index]?.filter(item => item?.Text?.toLowerCase() == element?.ValueName?.toLowerCase());
               if (selectDropDown[0]) {
                arrdropdown.push(selectDropDown[0]);
              }
              if (type === 'Edit') {
                this.multiDropDownData[index] = arrdropdown;
              } else {
                this.multiDropDownData[index] = [];
              }
          }
          this.apiWaitLoader[index]=false;
           }else{
           
            FilterData?.forEach((ele,i) => {
              const element: any = FilterData[i];
              selectDropDown = this.dropList[index]?.filter(item => item?.Text?.toLowerCase() == element?.ValueName?.toLowerCase());
              if (type === 'Edit') {
                this.multiDropDownData[index] = selectDropDown[0];
              } else {
                this.multiDropDownData[index] = [];
              }
            });
            this.apiWaitLoader[index]=false;
             }
        }
      }, err => {
        this.apiWaitLoader[index]=false;
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

  /* @Name: onSaveFilter function @Who: Renu @When: 21-09-2023 @Why:EWM-13706 EWM-14092 @What: for saving filter */
  onSaveFilter() {
    let obj = {};
    let value = this.filterSearchForm.value;
    obj['Id'] = this.filterById ? Number(this.filterById) : 0;
    obj['FilterName'] = value?.filterName;
    obj['AccessId'] = value?.AccessId;
    obj['AccessName'] = value?.AccessName;
    obj['SearchPools'] = [value?.SearchPool];
    obj['UserType'] = value?.UserType;
    obj['ShowAllMatchingRecord'] = value?.ShowAllMatchingRecord;
    obj['ShowTopMatchingRecordNumber'] = value?.ShowTopMatchingRecordNumber ? Number(value?.ShowTopMatchingRecordNumber) : null;
    value.SearchQuery.filter((x, i) => {
      
      x['InputColumnConditionId'] = x?.InputColumnCondition?.ConditionId;
      x['InputColumnCondition'] = x?.InputColumnCondition?.ConditionName;
      if (x['InputColumnName'].toLowerCase() != "keyword") {
      if (x['InputColumnType'] === "Dropdown") {
        if(x['IsMultiple']==true){
        x['InputColumnValue'] = x.InputColumnValue.map(item => {
          return {
            ValueCode: item?.Id?.toString(),
            ValueName: item?.Text
          };
        });
      }else{
        x['InputColumnValue'] = [{  ValueCode: x?.InputColumnValue?.Id, ValueName: x?.InputColumnValue?.Text}];
     
      }
      } else {
        x['InputColumnValue'] = [{  ValueCode: '', ValueName: x?.InputColumnValue.toString() }];
      }
    }else{
    
     x['InputColumnValue']=x.InputColumnValue.map(item =>{
       return { ValueCode: item?.InputColumnCondition?.ConditionName, ValueName: item?.InputColumnValue.toString() }
        });
    }
    })
   
    obj['InputFields'] = value?.SearchQuery;
    obj['OutputFields'] = this.outputFields.filter(x => x['selected'] == true);
    obj['GrantAccessList'] = this.accessEmailId;
    obj['JobId'] = this.jobId ? this.jobId : null;
    obj['LoggedInUserType'] = 0;
    obj['View'] = 0;
    obj['Edit'] = 0;
    obj['Delete'] = 0;

    this.xeopleSearchService.configureEOHFilter(obj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.filterlistSaved('');
          //this.getXfactorFilterById(this.filterById ? Number(this.filterById) : 0);
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

 /*@Name: FilterQueryString function @Who: Renu  @When: 11-Sept-2023 @Why:EWM-13708 EWM-13925 @What: for creating string*/

  FilterQueryString(data: any[]) {
    let arrParamObj=[];
    data?.forEach((value, k) =>{
    if (value?.InputColumnName?.toLowerCase() === 'keyword') {
      value.InputColumnValue= value?.InputColumnValue.forEach((x: { InputColumnCondition: { ConditionId: any; }; InputColumnValue: { toString: () => any; }; }) => {
        arrParamObj.push({
          'TagKeyword': value?.EOHFieldName,
          'Operator':x.InputColumnCondition?.ConditionId,
          'IsMultiSelect':value?.IsMultiple,
          'TagValue':x.InputColumnValue?.toString()
        });
      });
    }else{
      if (value?.InputColumnType?.toLowerCase() === "dropdown") {
        if(value?.IsMultiple==true){
          arrParamObj.push({
            'TagKeyword': value?.EOHFieldName,
            'Operator':value?.InputColumnCondition?.ConditionId,
            'IsMultiSelect':value?.IsMultiple,
            'TagValue':value?.InputColumnValue?.map(x=>x.Id).join(",")
          });
        }else 
        {
          arrParamObj.push({
            'TagKeyword': value?.EOHFieldName,
            'Operator':value?.InputColumnCondition?.ConditionId,
            'IsMultiSelect':value?.IsMultiple,
            'TagValue':value.InputColumnValue['Id']
          });
        }
      } else
      {
        arrParamObj.push({
                'TagKeyword': value?.EOHFieldName,
                'Operator':value?.InputColumnCondition?.ConditionId,
                'IsMultiSelect':value?.IsMultiple,
                'TagValue':value?.InputColumnValue?.toString()
        });
      }
    }
    });
      if(this.jobId){
      let jobLatlong:string='';
      if((this.JobLatitude && this.JobLatitude!=='') && (this.JobLongitude && this.JobLongitude!=='')){
        jobLatlong=this.JobLatitude+','+this.JobLongitude;
        arrParamObj.push({
          'TagKeyword': 'LatLong',
          'TagValue':jobLatlong
        });
      }
      }
    this.savedFilter={};
    this.savedFilter.JobDetails= this.selectedJobs;
    this.savedFilter.SearchQuery = arrParamObj;
    this.savedFilter.OutputFields =  this.outputFields;
    this.savedFilter.ShowAllMatchingRecord = this.filterSearchForm.get('ShowAllMatchingRecord').value;
    this.savedFilter.ShowTopMatchingRecordNumber = this.filterSearchForm.get('ShowTopMatchingRecordNumber').value;
    this.commonService.setFilterInfoEOH.next(this.savedFilter);
    return arrParamObj;
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
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*@Name: openSaveFilterModal @Who:Renu @When: 20-sept-2023 @Why:EWM-13706 EWM-14092 @What: to open quick save filter add dialog*/
  openSaveFilterModal() {
    const dialogRef = this.dialog.open(XeopleEohSaveFilterComponent, {
      data: { filterInfo: this.savedFilter },
      panelClass: ['xeople-modal', 'add_manageAccess', 'xeople-search-save-filter-modal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isSubmit == true) {
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

  /* @Name: filterlistSaved  @Who: Renu @When: 20-09-2022 @Why:  EWM-13706 EWM-14092   @What: on SEARCH BY FILTER*/
  filterlistSaved(searchVal: string) {
    this.sortingValue = "";
    this.pagesize = 5;
    this.xeopleSearchService.getEOHFilterAll(this.pagesize, this.pagneNo, this.sortingValue, searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.filternotFoundMsg = false;
          this.loadingSearchFilter = false;
          this.SavedfilterList = repsonsedata.Data;
          this.defaultFilterAdmin = this.SavedfilterList.filter(x => x['IsAdminFilter'] == 1)?.[0];
          this.TotalFilter = repsonsedata.TotalRecord;
          let dataArr=this.SavedfilterList.filter(x=>x['Id']==this.selectedFilter?.Id);
          
          // if(dataArr.length==0){
          //     this.filterVal='';
          //     this.resetValue(null);
          // }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if(searchVal && searchVal!==''){
            this.filternotFoundMsg = true;
          }else{
            this.filternotFoundMsg = false;
          }
         
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
    //this.trigger.openPanel();
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
    this.commonService.setFilterInfoEOH.next(this.savedFilter);
    this.filternotFoundMsg=false;
  }
  /* @Name: onDeleteFilter  @Who: Renu  @When: 14-Feb-2023 @Why: EWM-13706 EWM-14092 @What: on delete the filter value*/
  onDeleteFilter(val: { Id: any; }) {
    this.trigger.openPanel();
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
        this.xeopleSearchService.deleteEOHFilterSearch(delObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
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
    const dialogRef = this.dialog.open(XeopleEohFilterListComponent, {
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
    this.filterSearchForm.controls['ShowAllMatchingRecord'].reset();
    //this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].reset();
    this.filterSearchForm.controls['ShowAllMatchingRecord'].setValue(1);
    this.filterSearchForm.controls['InputFields'].reset();
    this.filterSearchForm.controls['OutputFields'].reset();
    this.filterSearchForm.controls['filterName'].reset();
    this.filterSearchForm.controls['JobId'].reset();
    this.filterSearchForm.controls['JobTitle'].reset();
    this.jobId=null;  /*** @When: 19-05-2023 @Who:Renu @Why: EWM-11414 EWM-11576 **/
    this.JobLatitude=null;
    this.JobLongitude=null;
    this.selectedJobs={};
    this.showAllJobResults = false;
    this.selectedJobSaved = {};
    this.savedFilter=[];
    this.keywordList=[];
    this.commonService.setFilterInfoEOH.next(this.savedFilter);
   // this.getDefaultFilterById();
   
    this.topVal = true;
    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].setValue('');
    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].clearValidators();
    this.filterSearchForm.controls['ShowTopMatchingRecordNumber'].updateValueAndValidity();
    this.inputVal='';
    this.filterSearchForm.controls['inputValue'].setValue(this.inputVal);
    this.getJobWorkflowALL();
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
    this.xeopleSearchService.getsearchPoolList().subscribe(
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
    return c1 && c2 ? c1.SearchPoolName === c2.SearchPoolName : c1 === c2;
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
    const filterform = this.filterSearchForm.get('SearchQuery') as FormArray;
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

  /* @Name: addKeywordControl  @Who: Renu  @When: 21-09-2023 @Why: EWM-13706 EWM-14092 @What: on add keyword  filter value*/

  addKeywordControl(con,index){
    this.InputColumnValueInfo(index).push(this.createItem(con));
  }
    
  /* @Name: createItem  @Who: Renu  @When: 21-09-2023 @Why: EWM-13706 EWM-14092 @What: for pushing value to keyword*/

  createItem(con): FormGroup {
    this.keywordList.push([]);
    return this.fb.group({
      InputColumnValue: [,[Validators.required]],
      InputColumnCondition: [con]
    });
   
  }
   /* @Name: addKeyWord  @Who: Renu  @When: 21-09-2023 @Why: EWM-13706 EWM-14092 @What: on add keyword  filter value*/

  addKeyWord(event: MatChipInputEvent,index:number,jindex:number,inputVal:any,kindex:number): void {
    const input = event.input;
    const value = event.value;
    let cons=(<FormArray>this.filterSearchForm.controls['SearchQuery']).at(index).get('InputColumnValue') as FormArray;
    let prons=(cons.controls[jindex] as FormArray);
     /**what:exact impl remove for temp basis @when:09-10-2023 @who:renu */
   // if(prons.controls['InputColumnCondition'].value.ConditionName!=="Exact"){
      if ((value || '').trim() && this.keywordList[jindex]?.length<=2) {
        this.keywordList[jindex].push(value.trim());
        prons.controls['InputColumnValue'].setValue( this.keywordList[jindex]);
      }
    //}
    // else{
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
      this.xeopleSearchService.getcvParsedCountAll().subscribe(
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
        let params = `?search=${this.inputVal}&pageSize=${this.inputVal?.length > 1 ? this.pagesize :(50)}`;
      this.xeopleSearchService.getAllJobsWithoutWorkflowWithoutParsing(params).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata?.HttpStatusCode === 204 ||repsonsedata?.HttpStatusCode === 200 ) {
            this.loaderRefresh = false; 
            this.JobWorkFlow= repsonsedata.Data;        
            /*************@Who:Renu @when: 11-10-2023 @Why:EWM-14696 EWM-14711 ******/ 
            // let savedJobLocal=JSON.parse(localStorage.getItem('XeopleSelectedJob'));
            // if(this.jobId!==null ? (this.JobSelectedRouter && localStorage.getItem('XeopleSelectedJob')!==null):false){      /*************@Who:Renu @when: 20-11-2023 @Why:EWM-14145 EWM-14894 ******/
            //   this.selectedJobs = { 'Id': savedJobLocal?.Id,'JobTitle':savedJobLocal?.JobTitle };
            //  this.filterSearchForm.patchValue({
            //    JobId: this.selectedJobs?.Id,
            //    JobTitle:this.selectedJobs?.JobTitle
            //  });
            //  this.showAllJobResults = true; 
            //  this.getJobDetails(savedJobLocal?.Id);
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
   if(event?.SearchPoolName?.toLowerCase()=='Xeople Candidate Pool'.toLowerCase())
   {
    if(this.jobId && this.jobId!='')
    this.router.navigate(['./client/core/home/xeople-search'],{ state: { JobSelected: true } });
    else
    this.router.navigate(['./client/core/home/xeople-search'],{ state: { JobSelected: false } });
   }
  }
  xeopleSearchEOHdata(data: { totalDataCount: number; }){
    this.totalRecords=data?.totalDataCount;
  }

  membersEOHExtract(data: { selectedCanForExtractCount: number; selectedCanForExtractData: []; }){
    this.selectedCanForExtractCount=data?.selectedCanForExtractCount;
    this.selectedCanForExtractData=data?.selectedCanForExtractData;
  }

  OnClickExtractMap(method:string){
    this.ExtractedStatus=false;
    const message = ``;
    const title = '';
    const subtitle = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ExtractMapBulkComponent, {
      data: new Object({selectedCanForExtract:this.selectedCanForExtractData,method:method}),
      panelClass: ['xeople-modal', 'view_extract', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     if(res==false){
      this.selectedCanForExtractData.forEach(element => {
        element['checked']=false;
      });
      this.selectedCanForExtractCount=0;
      this.ExtractedStatus=true;
     }
    })
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
    this.resetAllFilter();
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
