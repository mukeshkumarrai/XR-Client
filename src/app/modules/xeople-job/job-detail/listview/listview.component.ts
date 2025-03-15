import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { CommonMethodeType, EventType, JobDetailIndexDBCard, JobDetailIndexDBList, JobDetailLocalCalculationName, ListModeObj, ParentEventType } from '@app/shared/enums/job-detail.enum';
import { GoogleMapsLocationPopComponent } from '@app/shared/modal/google-maps-location-pop/google-maps-location-pop.component';
import { ButtonTypes, ResponceData, StageDetails, Userpreferences } from '@app/shared/models';
import { GridState, JobScreening } from '@app/shared/models/job-screening';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { CandidatejobmappingService } from '@app/shared/services/candidate/candidatejobmapping.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { JobScreeningComponent } from '../../job-screening/job-screening.component';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CandidateFolderFilterComponent } from '@app/modules/EWM-Candidate/profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { MulitpleCandidateFolderMappingComponent } from '@app/shared/modal/mulitple-candidate-folder-mapping/mulitple-candidate-folder-mapping.component';
import { CandidateTimelineComponent } from '@app/modules/EWM.core/job/candidate-timeline/candidate-timeline.component';
import { CandidateRankComponent } from '@app/modules/EWM.core/job/job-details/candidate-rank/candidate-rank.component';
import { RemoveCandidateComponent } from '@app/modules/EWM.core/job/remove-candidate/remove-candidate.component';
import { MailServiceService } from '@app/shared/services/email-service/mail-service.service';
import { NewEmailComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { CandidateWorkflowStagesMappedJobdetailsPopComponent } from '@app/shared/modal/candidate-workflow-stages-mapped-jobdetails-pop/candidate-workflow-stages-mapped-jobdetails-pop.component';
import { ShareResumeComponent } from '@app/modules/EWM.core/job/screening/share-resume/share-resume.component';
import { State, SortDescriptor, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { ColumnSettings } from '@app/shared/models/column-settings.interface';
import { IndexedDbService } from '@app/shared/helper/indexed-db.service';
import { jobDetails } from '../../job-manage/IquickJob';
import { PushcandidateToEohFromPopupComponent } from '../../job-screening/pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';
import { AlertDialogComponent } from '@app/shared/modal/alert-dialog/alert-dialog.component';
import { JobIndexDbService } from '@app/shared/helper/job-index-db.service';
import { CommonServiesService } from '@app/shared/services/common-servies.service';
import { ParsedResumeKeywordSearchComponent } from '@app/shared/parsed-resume-keyword-search/parsed-resume-keyword-search/parsed-resume-keyword-search.component';
import { XeepService } from '../../../../shared/services/xeep/xeep.service';
import { SharedJobComponent } from '../../job-screening/shared-job/shared-job.component';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}


@Component({
  selector: 'job-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['./listview.component.scss']
})
export class ListviewComponent implements OnInit, OnDestroy {
  public triggerOrigin: any;
  pagesize = 200;
  pageNum: any = 1;
  public sortingValue: string;
  searchValue: any = '';
  SelectedStageId: '';
  filterConfig: any = [];
  loading: boolean = false;
  public GridId: any = 'CandidateJobMapping_grid_001';
  gridColConfigStatus: boolean = false;
  @ViewChild(GridComponent) public grid: GridComponent;
  gridListData: any[] = [];
  JobId: any;
  JobName: any;
  WorkflowId: any;
  WorkflowName: any;
  loadingscroll: boolean;
  loadingSearch: boolean;
  showHideDocumentButtons: boolean = false;
  public loadingAssignJobSaved: boolean;
  public allComplete: boolean = false;
  AllCandidateJobMappingObs: Subscription;
  CountFilter: any = 'All';
  IsIntermediate: boolean;
  selectedCandidates: any = [];
  public totalDataCount: number;
  candidateMappedJobCount: number = 0;
  filterCount: number;
  public columnsWithAction: any[] = [];
  public sortDirection = 'desc';
  isNotSort: boolean = false;

  FilterConfigObs: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public colArr: any = [];
  public filterAlert: any = 0;
  public quickFilterStatus: number = 0;
  public dynamicFilterArea: boolean = false;
  public headerExpand: boolean = true;
  currentUser: any;
  public columns: ColumnSetting[] = [];
  public hideChartOnHeaderCollpase: boolean = false;
  viewMode: string = 'cardMode';
  isCardMode: boolean = false;


  public userpreferences: Userpreferences;
  distanceUnit: string = 'KM';
  cardloading: boolean = false;
  searchSubject$ = new Subject<any>();

  @Input() listViewObj: ListModeObj;

  @Input() IsJobClosed: number;
  @Output() isResponseGetFromServer = new EventEmitter<Object>();
  @Input() firstStageData: any;
  @Input() headerListData: any;
  @Output() getSelectedDataOnEveryChange = new EventEmitter<any>();
  dirctionalLang: string;
  candidateId: any;
  workflowId: string;
  stages: any;
  @Output() parentRefreshType = new EventEmitter<EventType>();
  candidateIdData: any;
  IsApplicationFormAvailable: any;
  isClientId: any;
  applicationFormId: any;
  applicationFormURL: string;
  applicationBaseUrl: string;
  subdomain: string;
  StageId: string = '';
  Source: string = '';
  public candidateScreeningInfo: JobScreening[] = [];
  @Input() JobDetails: any;

  StageDetailsObj: StageDetails;
  public screeningObj: JobScreening;
  public gridStateObj: GridState;
  public jobDetails: jobDetails;
  @Output() sendEventTypeOnParent = new EventEmitter<ParentEventType>();
  JobLatitude: any;
  JobLongitude: any;
  jobLocation: any;
  orderBy = 'IsPin,desc'

  //************ Kendo grid pageng variabel***********
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [50, 100, 200, 300, 400, 500, 1000];
  public gridViewlistFilter: GridDataResult;
  public filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
  FilterDataClearList: any = [];
  public gridData: any[] = [];
  public gridListDataFilter: [] = [];
  Totalcount: number;
  TotalRecordgrid: number;
  public state: State = { skip: 0, take: 200 };
  sum: any;
  public sort: SortDescriptor[] = [
    {
      field: 'IsPin',
      dir: 'desc'
    }
  ];
  public skip = 0;
  public pagneNo = 1;
  public gridViewlistClearData: GridDataResult;
  public gridViewlist: GridDataResult;
  animationVar: any;
  public cacheData: boolean = false;
  inputValue: string = '';

  EOHIntegrationObj:any;
  IsEOHIntergrated: boolean = false;
  eohRegistrationCode: string;
  zoomCheckStatus: boolean = false;
  SMSCheckStatus: boolean = false;
  zoomPhoneCallRegistrationCode: string;
  getSMSRegistrationCode;
  burstSMSRegistrationCode: string;
  public headcount: Number;

  public dataChangeStatus: boolean = false;
  public ParentSource: any;

  brandAppSetting: any=[];
  EOHLogo: any;

  constructor(private appSettingsService: AppSettingsService, private translateService: TranslateService, private _service: CandidatejobmappingService,
    private snackBService: SnackBarService, private ngZone: NgZone, public _userpreferencesService: UserpreferencesService, private jobService: JobService,
    private commonserviceService: CommonserviceService, public dialog: MatDialog,
    public indexBDService: IndexedDbService,
    public candidateService: CandidateService, private routes: ActivatedRoute, private route: Router,
    private mailService: MailServiceService,
    private _JobIndexDbService: JobIndexDbService,
    private commonServiesService: CommonServiesService,private xeepService:XeepService
    ) {
      this.ParentSource=this.appSettingsService.SourceCodeParam['ApplicationForm'];
    this.showScreeningInterview = this.appSettingsService.showScreeningInterview;
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.getSMSRegistrationCode = this.appSettingsService.xeopleSMSRegistrationCode;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
  }

  ngOnInit() {
    this.routes.queryParams.subscribe((parmsValue: any) => {
      if (parmsValue) {
        this.JobId = parmsValue.jobId;
        this.workflowId = parmsValue.workflowId;
      }
    })

    this.screeningObj = {
      PageName: '',
      WorkFlowStageName: '',
      WorkFlowStageId: '',
      JobTitle: '',
      JobId: this.JobId,
      ClientName: '',
      ClientId: '',
      Address: '',
      CandidateList: [],
      WorkflowId: this.workflowId,
      WorkflowName: '',
      GridState: {
        JobId: '',
        GridId: '',
        JobFilterParams: null,
        search: "",
        PageNumber: 0,
        PageSize: 0,
        OrderBy: "",
        WorkflowId: "",
        Source: "",
      },
      SelectedCandidate: [{
        FirstName: "",
        MiddleName: "",
        LastName: "",
        ProfileImage: "",
        PreviewUrl: "",
        CandidateStatus: "",
        IsResume: 0,
        StageDisplaySeq: 0,
        ActiveJobs: 0,
        LastActivity: 0,
        StatusId: "",
        StatusName: "",
        StageColorCode: "",
        StageVisibility: 0,
        EmailId: "",
        PhoneNumber: "",
        CountryId: 0,
        JobTitle: "",
        Designation: "",
        Location: "",
        Latitude: "",
        Longitude: "",
        WorkFlowId: "",
        WorkFlowStageId: "",
        WorkFlowStageName: "",
        Source: "",
        SourceColorCode: "",
        CandidateId: "",
        CandidateName: "",
        IsProfileRead: 0,
        IsSelected: 0,
        WorkflowName: "",
        WorkFlowName: "",
        StageType:""
      }],
      JobReferenceId: '',
      JobHeadCount: this.headerListData?.HeaderAdditionalDetails?.HeadCount,
      isLastSatgeCand:false
    }

    this.gridStateObj = {
      JobId: "",
      GridId: "",
      JobFilterParams: null,
      search: "",
      PageNumber: 0,
      PageSize: 0,
      OrderBy: "",
      WorkflowId: "",
      Source: "",
    }
    this.sortingValue = this.sort[0].field + '-' + this.sortDirection;


    // this.columnsWithAction = this.listViewObj?.columnsWithAction;
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.getCandidateListByJob(this.pagesize, this.pageNum);
    });
    this.JobName = this.headerListData?.HeaderDetails?.JobDetails?.JobTitle;
    this.WorkflowId = this.headerListData?.HeaderDetails?.JobDetails?.WorkflowId;
    this.WorkflowName = this.headerListData?.HeaderDetails?.JobDetails?.WorkflowName;
    this.headcount = this.headerListData?.HeaderAdditionalDetails?.HeadCount;
    this.animationVar = ButtonTypes;

    this.jobDetails = {
      JobId: this.JobId,
      JobName: this.headerListData?.HeaderDetails?.JobDetails?.JobTitle,
      CandidateId: [''],
      CandidateName: '',
      WorkflowId: this.headerListData?.HeaderDetails?.JobDetails?.WorkflowId,
      WorkflowName: this.headerListData?.HeaderDetails?.JobDetails?.WorkflowName,
      StageId: '',
      StageName: '',
      StageDisplaySeq: 0
    }
    // this.checkIfDatabaseExists('jobdetails');
    this.getFilterConfig(true);
    this.EOHIntegrationObj = JSON.parse(localStorage.getItem("EOHIntegration"));
    // EOH 
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let eohRegistrationCode = otherIntegrations?.filter(res=>res.RegistrationCode === this.eohRegistrationCode);
    this.IsEOHIntergrated = eohRegistrationCode[0]?.Connected;

    // Zoom
  let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode === this.zoomPhoneCallRegistrationCode);
  this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;
  // SMS
  let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode === this.burstSMSRegistrationCode);
  this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;

  const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople);
  this.EOHLogo=filteredBrands[0]?.logo;

  }
  isDatabaseExist
  // async checkIfDatabaseExists(dbName): Promise<void> {
  //   this.isDatabaseExist = await this.indexBDService.doesDatabaseExist('jobdetails_list');
  //   console.log('Database exists:', this.isDatabaseExist);
  //   if (this.isDatabaseExist) {
  //     console.log('Database exists:', this.isDatabaseExist);

  //     this.indexBDService.getTableData('jobdetails_list', 'listview').then(data => {
  //       let result = data[0];
  //       this.columnsWithAction = result['columns'];
  //       this.data = { data: result['data'], total: result['total'] };
  //     });
  //   } else {
  //   }

  // }

  getCandidateListByJob(pagesize: number, pagneNo: number) {
    this.loading = true;
    let obj = {
      "JobId": this.JobId,
      "GridId": this.GridId,
      "JobFilterParams": this.filterConfig ? this.filterConfig : [],
      "search": this.inputValue ? this.inputValue : '',
      "OrderBy": this.orderBy,
      "WorkflowId": this.workflowId,
      "Source": this.Source ? this.Source : '',
      "Longitude": +this.JobLongitude || 0,
      "Latitude": +this.JobLatitude || 0,
      "QuickFilter": this.CountFilter,
      "page": pagneNo,
      "PageSize": pagesize,
      "sort": this.sortingValue
    }

    this.StageId ? obj["StageId"] = this.StageId : null;
    this.AllCandidateJobMappingObs && this.AllCandidateJobMappingObs.unsubscribe();
    this.AllCandidateJobMappingObs = this._service.getAllCandidateJobMapping(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
         this.loadingscroll = false;
         //this.jobService.pageDataChangeStatus(false);
          this.loading = false;
          this.data = { data: repsonsedata.Data, total: repsonsedata.TotalRecord };
          // set data in index db 
          // this._JobIndexDbService.saveData([this.data],JobDetailIndexDBList.DB_NAME, JobDetailIndexDBList.STORE_NAME);
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loading = false;
          this.FilterDataClearList = repsonsedata;
          this.gridListDataFilter = repsonsedata.Data;
          this.gridListData = repsonsedata.Data;
          this.gridListData?.forEach(res => {
            res.CheckboxStatus = false;
          })
          if (this.gridColConfigStatus) {
            this.fitColumns();
          }
          this.allComplete = false;
          this.IsIntermediate = false;
          this.gridListData?.forEach(v => { v.IsIntermediate = false; });
          this.selectedCandidates = [];
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.loadingAssignJobSaved = false;
          if (repsonsedata.Data == null) {
            this.candidateMappedJobCount = 0;
          } else {
            this.candidateMappedJobCount = repsonsedata.TotalRecord;
          }
          this.showHideDocumentButtons = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.gridListData = [];
          this.data = { data: [], total: repsonsedata.TotalRecord };
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.loadingAssignJobSaved = false;
          this.showHideDocumentButtons = false;
        }
        else {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.loadingAssignJobSaved = false;
          this.filterCount = 0
          this.showHideDocumentButtons = false;
          this.gridListData = [];
        }
        let obj: Object = {
          "Data": repsonsedata.Data?.length,
          "Status": repsonsedata.Status,
          "HttpStatusCode": repsonsedata.HttpStatusCode,
          "Message": repsonsedata.Message,
          "TotalRecord": repsonsedata.TotalPages,
          "PageNumber": repsonsedata.PageNumber,
          "PageSize": repsonsedata['PageSize'],
          "TotalPages": repsonsedata.TotalPages,
        }
        this.setAllDataInStorage(this.data);
        this.isResponseGetFromServer.emit(obj)
        this.AllCandidateJobMappingObs.unsubscribe();

      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.loadingAssignJobSaved = false;
        this.filterCount = 0
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }

  /*
      @Type: File, <ts>
      @Name: fitColumns
      @Who: Nitin Bhati
      @When: 21-04-2023
      @Why: EWM-12064
      @What: For auto fit column size
    */
  public fitColumns(): void {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns();
    });
  }
  pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData?.length) {
      this.pageNum = this.pageNum + 1;
    } else {
      this.loadingscroll = false;
    }
  }


  /*
@Type: File, <ts>
@Name: markPinUnPin function
@Who: Adarsh
@When: 08-Nov-2023
@Why: EWM-14944
@What: For markPinUnPin
 */
  markPinUnPinGridView(can) {
    this.markAsReadGridView(can);
    let isPin;
    if (can.IsPin == 1) {
      can.IsPin = 0;
      isPin = 0;
    } else {
      can.IsPin = 1;
      isPin = 1;
    }
    this.pinunpinCandidate(can, isPin)
    this.gridListData.sort((a, b) => {
      // First, sort by IsPin (ascending order)
      if (b.IsPin !== a.IsPin) {
        return b.IsPin - a.IsPin;
      }
      // Then, if IsPin is the same, sort by Proximity (ascending order)
      if (b.Proximity !== a.Proximity) {
        return a.Proximity - b.Proximity;
      }
      // Finally, if both IsPin and Proximity are the same, sort by name (ascending order)
      return a.CandidateName.localeCompare(b.CandidateName);
    })
    this.setAllDataInStorage(this.data);
  }

  /*
    @Type: File, <ts>
    @Name: pinunpinCandidate function
    @Who: Suika
    @When: 31-Aug-2023
    @Why: EWM-13813 EWM-13813
  */
  pinunpinCandidate(can, isPin) {
    this.jobDetails.CandidateId = can.CandidateId ? [can.CandidateId] : [""];
    this.jobDetails['IsPin'] = isPin == 1 ? true : false;
    this.commonMarkAsReadSingle(can);
    this.jobService.pinUnpinCandidate(this.jobDetails).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.cardloading = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.cardloading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.cardloading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          return false;
        }
      })
  }

  // <!---------@When: 09-10-2023 @who:Adarsh singh @why: EWM-14638 @Desc- make a common function for mark as read-------->
  commonMarkAsReadSingle(cand) {
    let candArrs: any = [];
    let candDiv: any = document.querySelector(".candidateInfoPanel_" + cand.CandidateId);
    if (candDiv?.classList.contains("unread")) {
      candDiv?.classList.remove("unread");
      cand.IsProfileRead = 1;
      candArrs.push(cand.CandidateId)
    }
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileReadUnread(candArrs, this.JobId);
    }
  }


  getFilterConfig(loaderVal: boolean) {
    // this.loading = true;
    this.FilterConfigObs = this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.gridColConfigStatus = repsonsedata.Data.IsDefault;
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig != null ? repsonsedata.Data.FilterConfig : [];
            this.filterAlert = repsonsedata.Data.FilterAlert;
            this.quickFilterStatus = repsonsedata.Data.QuickFilter;
            this.headerExpand = repsonsedata.Data.Header == 1 ? true : false;
            if (this.headerExpand === true) {
              this.hideChartOnHeaderCollpase = true;
            } else {
              this.hideChartOnHeaderCollpase = false;
            }
            this.viewMode = repsonsedata.Data.PageMode == 'Card' ? 'cardMode' : 'listMode';
            localStorage.setItem('viewMode', this.viewMode);
            this.viewMode = localStorage.getItem('viewMode');
            this.viewMode == 'cardMode' ? this.isCardMode = true : this.isCardMode = false;
            this.dynamicFilterArea = false;
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig?.length;
            } else {
              this.filterCount = 0;
            }
            if (repsonsedata.Data.GridConfig?.length != 0) {
              colArrSelected = repsonsedata?.Data?.GridConfig?.filter(x => x?.Grid == true);
              colArrSelected = colArrSelected?.filter(x => x.Selected == true);
              colArrSelected.sort(function (a, b) {
                return a.Order - b.Order;
              });
            }
            if (colArrSelected?.length !== 0) {
              this.columns = colArrSelected;
              this.columnsWithAction = this.columns;
              this.columnsWithAction.splice(0, 0, {
                "Type": "Action",
                "Field": null,
                "Order": 0,
                "Title": null,
                "Selected": false,
                "Format": "{0:c}",
                "Locked": true,
                "width": "40px",
                "Alighment": null,
                "Grid": true,
                "Filter": false,
                "API": null,
                "APIKey": null,
                "Label": null
              });
            } else {
              this.columns = this.colArr;
              this.columnsWithAction = this.columns;
              this.columnsWithAction.splice(0, 0, {
                "Type": "Action",
                "Field": null,
                "Order": 0,
                "Title": null,
                "Selected": false,
                "Format": "{0:c}",
                "Locked": true,
                "width": "40px",
                "Alighment": null,
                "Grid": true,
                "Filter": false,
                "API": null,
                "APIKey": null,
                "Label": null
              });
            }
          }
          // this.getCandidateListByJob(this.pagesize, this.pageNum);
          this.checkDataInsideIndexDB();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  isFilter: boolean = false;

  /*
@Type: File, <ts>
@Name: setAll function
@Who: Suika
@When: 24-May-2023
@Why: EWM-11782 EWM-12504
what:for set all checkbox
*/
  isSelectedCandOfFirstSatgesOnly: boolean = false;
  isSelectedCandOfOtherSatgesOnly: boolean = false;

  setAll(completed: boolean) {
    if (completed && this.IsIntermediate == false) {
      this.allComplete = true;
      this.IsIntermediate = false;

      if (this.gridListData == null) return;
      this.gridListData.forEach((t, index) => {
        t.CheckboxStatus = true;
      });
    }
    else {
      this.allComplete = true;
      setTimeout(() => {
        this.allComplete = false;
        this.IsIntermediate = false;
      }, 10);
      this.gridListData.forEach((t: any) => {
        t.CheckboxStatus = false;
      });
    }
    // @suika @EWM-12925 @whn 29-06-2023  modification as per story @EWM-12888
    this.selectedCandidates = this.gridListData.filter(x => x.CheckboxStatus == true);
    // adarsh singh EWM-14729 13-OCT-23
    this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
    if (!this.isSelectedCandOfFirstSatgesOnly) {
      this.isSelectedCandOfOtherSatgesOnly = true;
    } else {
      this.isSelectedCandOfOtherSatgesOnly = false;
    }
    // End
    this.getSelectedDataOnEveryChange.emit(this.selectedCandidates)
  }

  // <!---------@When: 12-10-2023 @who:Adarsh singh @why: EWM-14741 @Desc-check selected candidate of only 1st stage -------->
  checkSelectedCandOfFirstStage() {
    let res: boolean;
    if (this.selectedCandidates?.length > 0) {
      res = this.selectedCandidates.every((e: any) => e?.ParentId === this.firstStageData?.InternalCode);
    }
    else {
      res = false;
    }
    return res
  }

  /*
 @Type: File, <ts>
 @Name: updateAllComplete function
 @Who: Suika
 @When: 24-May-2023
 @Why: EWM-11782 EWM-12504
*/
  onHideField(isChecked, data) {
    if (isChecked.checked == true) {
      this.gridListData.forEach(element => {
        if (element.CandidateId == data.CandidateId) {
          element.CheckboxStatus = 1
          element.IsIntermediate = true;
        }
      });
    }
    else {
      this.gridListData.forEach(element => {
        if (element.CandidateId == data.CandidateId) {
          element.CheckboxStatus = 0
          element.IsIntermediate = false;
        }
      });
    }
    this.selectedCandidates = this.gridListData.filter(x => x.CheckboxStatus == 1);
    // adarsh singh EWM-14729 13-OCT-23
    this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
    if (!this.isSelectedCandOfFirstSatgesOnly) {
      this.isSelectedCandOfOtherSatgesOnly = true;
    } else {
      this.isSelectedCandOfOtherSatgesOnly = false;
    }
    //  End
    this.getSelectedDataOnEveryChange.emit(this.selectedCandidates)
    this.checkListParentStage(data);
  }
  checkListParentStage(stageData) {
    if (this.selectedCandidates?.length == 0) {
      this.IsIntermediate = false;
      this.allComplete = false;
      return;
    }
    let checkStage = stageData != null && this.gridListData.every(t => t.CheckboxStatus == 1 || t.CheckboxStatus == true);
    if (checkStage) {
      this.IsIntermediate = false;
      this.allComplete = true;
    } else {
      this.allComplete = false;
      this.IsIntermediate = true;
    }
  }
  /*
  @Type: File, <ts>
  @Name: openForLatLongDistance
  @Who: Anup Singh
  @When: 06-oct-2021
  @Why: EWM-3088 EWM-3181
  @What: to open popup for total distance of job and candidate
  */

  openForLatLongDistance(canData) {
    if ((this.JobLatitude != undefined && this.JobLatitude != null && this.JobLatitude != '') &&
      (this.JobLongitude != undefined && this.JobLongitude != null && this.JobLongitude != '') &&
      (canData.Latitude != undefined && canData.Latitude != null && canData.Latitude != '') &&
      (canData.Longitude != undefined && canData.Longitude != null && canData.Longitude != '')) {
      const dialogRef = this.dialog.open(GoogleMapsLocationPopComponent, {
        data: new Object({
          jobLat: this.JobLatitude, jobLong: this.JobLongitude, jobAddress: this.jobLocation,
          canLat: canData.Latitude, canLong: canData.Longitude, canAddress: canData.Location,
          proximity: canData.Proximity
        }),
        panelClass: ['xeople-modal', 'candidateLatLong', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    }
  }
  openTimelinePopup(candidateId, workflowId) {
    this.candidateId = candidateId;
    const dialogRef = this.dialog.open(CandidateTimelineComponent, {
      data: { candidateId: candidateId, jobId: this.JobId, workflowId: workflowId },
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
  selectedCanEmail: string;
  isLastStageCandidate: boolean = false;
  isAnyRejectedStageTypeListView: boolean = false;

  selectedCandThreeDot(can: any) {
    this.candidateId = can?.CandidateId;
    this.selectedCanEmail = can?.EmailId;
    let res = this.stagesList?.filter((e: any) => e?.IsLastStage === 1)[0];
    if (res?.InternalCode == can?.ParentId) {
      this.isLastStageCandidate = true;
    }
    else {
      this.isLastStageCandidate = false;
    }

  }

  /*
@Type: File, <ts>
@Name: openActionView function
@Who: Suika
@When: 22-May-2023
@Why: EWM-11782 EWM-12504
@What: To open action view details.
*/


  openSingleCanActionView(can) {
    let canArr = [];
    canArr.push(can);
    this.screeningObj.ClientId = this.JobDetails?.ClientId;
    this.screeningObj.ClientName = this.JobDetails?.ClientName;
    this.screeningObj.Address = this.jobLocation;
    this.screeningObj.WorkflowName = this.JobDetails?.WorkflowName;
    this.screeningObj.WorkflowId = this.JobDetails?.WorkflowId;
    this.screeningObj.JobId = this.JobId;
    this.screeningObj.JobTitle = this.JobName;
    this.screeningObj.WorkFlowStageName = (can?.ParentName) ? (can?.ParentName) : (can?.StageName);
    this.screeningObj.WorkFlowStageId = (can?.ParentId) ? (can?.ParentId) : can?.StageId;
    this.screeningObj.CandidateList = canArr;
    this.gridStateObj.GridId = this.GridId;
    this.gridStateObj.JobId = this.JobId;
    this.gridStateObj.JobFilterParams = this.filterConfig;
    this.gridStateObj.search = this.searchValue;
    this.gridStateObj.PageNumber = this.pageNum;
    this.gridStateObj.PageSize = this.pagesize;
    this.gridStateObj.OrderBy = this.sortingValue;
    this.gridStateObj.Source = this.Source;
    this.screeningObj.GridState = this.gridStateObj
    this.candidateScreeningInfo.push(this.screeningObj);
    // --------@When: 07-07-2023 @who:Adarsh singh @EWM-13010
    setTimeout(() => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + can.CandidateId);
      if (candDiv?.classList?.contains("unread")) {
        candDiv?.classList?.remove("unread");
        let candArr: [string] = [can.CandidateId];
        this.commonserviceService.candidateProfileReadUnread(candArr, this.JobId);
      }
    }, 600);
    //  End
    const dialogRef = this.dialog.open(JobScreeningComponent, {
      data: new Object({ candidateInfo: this.candidateScreeningInfo }),
      panelClass: ['screening-and-interview-modal', 'screening-and-interview-animation', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.event == true && res?.reloadData == true) {
        this.getCandidateListByJob(this.pagesize, this.pageNum);

      }
    })
  }
  viewResumeByCandidateId(candidateId: string) {
    // --------@When: 07-07-2023 @who:Adarsh singh @EWM-13010
    setTimeout(() => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + candidateId);
      if (candDiv?.classList?.contains("unread")) {
        candDiv?.classList.remove("unread");
        let candArr: [string] = [candidateId];
        this.commonserviceService.candidateProfileReadUnread(candArr, this.JobId);
      }
    }, 600);
    // End
    this.showResume(candidateId);
  }

  showResume(CandidateId: string) {
    const dialogRef = this.dialog.open(ParsedResumeKeywordSearchComponent, {
      data: new Object({ CandidateId:CandidateId }),
      panelClass: ['xeople-modal-lg', 'resume-view-parse', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

  }
  /*
    @Type: File, <TS>
    @Name: openQuickFolderModal
    @Who: Anup Singh
    @When: 09-Mar-2022
    @Why: EWM-5328 EWM-5582
    @What: to open folder model
    */
  public folderCancel: any;
  openQuickFolderModal(CandidateId) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folder';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(CandidateFolderFilterComponent, {
      data: new Object({ candidateId: CandidateId, labelAddFolder: true }),
      // data: dialogData,
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
        this.folderCancel = 1;
        this.commonserviceService.onOrgSelectFolderId.next(this.folderCancel);
        this.getCandidateListByJob(this.pagesize, this.pageNum);
      }
    })
  }


  /*
  @Type: File, <ts>
  @Name: createCallLog function
  @Who: Suika
  @When: 07-July-2022
  @Why: EWM-7401 EWM-7509
  @What: on saving the data client Notes
*/
  CreateJobCallLogObs: Subscription;

  createCallLog() {
    this.loading = true;
    let Obj = {};
    Obj['JobId'] = this.JobId;
    Obj['CandidateId'] = this.candidateId;
    this.CreateJobCallLogObs = this.jobService.createJobCallLog(Obj).pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }

  /*
  @Type: File, <ts>
  @Name: like Candidate function
  @Who: Adarsh
  @When: 08-Nov-2023
  @Why: EWM-14944
*/
  likeCandidateGridView(can) {
    this.markAsReadGridView(can);
    let canArr = [];
    canArr.push({
      CandidateId: can?.CandidateId,
      CandidateName: can?.CandidateName,
      StageId: can?.WorkFlowStageId,
      StageName: can?.WorkFlowStageName,
      StageDisplaySeq: can?.StageDisplaySeq,
    })
    let payload = {
      JobId: this.JobId,
      JobName: this.JobName,
      Candidates: canArr,
      WorkflowId: this.workflowId,
      WorkflowName: this.WorkflowName,
      JobHeadCount: this.headerListData?.HeaderAdditionalDetails?.HeadCount
    }

    this.commonMarkAsReadSingle(can);
    this.jobService.likeCandidate(payload).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        let data = repsonsedata.Data;
        if (data?.length == 1) {
          //  Adarsh singh EWM-14944 on 0-11-2023 @dec- like candidate
          let nextStageId = repsonsedata.Data[0].NextStageId;
          let parentStageId = repsonsedata.Data[0].ParentStageId;
          let nextStageName = repsonsedata.Data[0].NextStageName;
          const nextStageIndex: any = this.gridListData.findIndex(obj => obj?.ParentId === parentStageId);
          if (nextStageIndex !== -1) {
            can.ParentId = nextStageId;
            can.ParentName = nextStageName;
            can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
            can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
            can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
            const obj = can
            this.gridListData.splice(nextStageIndex, 0, obj)
          }
          else {
            can.ParentId = nextStageId;
            can.ParentName = nextStageName;
            can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
            can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
            can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
          }
          // End
          const IsLastStage =this.stages.filter(x=>x?.InternalCode===nextStageId)[0]?.IsLastStage;
          if(IsLastStage===1){
            this.xeepService.performAction('eats-cookie');
          }
          this.setAllDataInStorage({data: this.gridListData, total: this.totalDataCount});
        }
        // Who:Ankit Rawat, What:EWM-17802, on switching the mode candidate is going blank (set local storage 'jobDetailsPageEventStatus'), When:07Aug24
        this.jobService.pageDataChangeStatus(true);
        // Who:Ankit Rawat, What:EWM-16947 Reload the workflow after accept the candidate, When:05Aug24
        this.parentRefreshType.emit(EventType.REALOAD_WORKFLOW_STAGES);
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.cardloading = false;
        if (repsonsedata.Message == '400056') {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      } else if (repsonsedata.HttpStatusCode === 400) {
        if (repsonsedata.Message === "400058") {
          this.alertMaxCandidateAddInLastStage();
        }
        else{
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
        this.cardloading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        return false;
      }
    })
  }

  /*
  @Type: File, <ts>
  @Name: dislikeCandidate function
   @Who: Adarsh
  @When: 08-Nov-2023
  @Why: EWM-14944
*/
  dislikeCandidateGridView(can) {
    this.markAsReadGridView(can);
    let canArr = [];
    if (this.selectedCandidates?.length > 0) {
      this.selectedCandidates?.forEach((e: any) => {
        canArr.push({
          CandidateId: e?.CandidateId,
          CandidateName: e?.CandidateName,
          StageId: e?.WorkFlowStageId,
          StageName: e?.WorkFlowStageName,
          StageDisplaySeq: e?.StageDisplaySeq,

        })
      })
    }
    else {
      canArr.push({
        CandidateId: can?.CandidateId,
        CandidateName: can?.CandidateName,
        StageId: can?.WorkFlowStageId,
        StageName: can?.WorkFlowStageName,
        StageDisplaySeq: can?.StageDisplaySeq,
      })
    }
    let payload = {
      JobId: this.JobId,
      JobName: this.JobName,
      Candidates: canArr,
      WorkflowId: this.workflowId,
      WorkflowName: this.WorkflowName
    }
    this.commonMarkAsReadSingle(can);
    this.jobService.disLikeCandidate(payload).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.cardloading = false;
          let data = repsonsedata.Data;
          if (data?.length == 1) {
            //  Adarsh singh EWM-14944 on 0-11-2023 @dec- like candidate
            let rejectedStageId = repsonsedata.Data[0].NextStageId;
            let nextStageName = repsonsedata.Data[0].NextStageName;
            const nextStageIndex: any = this.stages.findIndex(obj => obj?.ParentId === rejectedStageId);
            if (nextStageIndex !== -1) {
              can.ParentId = rejectedStageId;
              can.ParentName = nextStageName;
              can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
              can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
              can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
              const obj = can
              this.gridListData.splice(nextStageIndex, 0, obj)

            }
            else {
              can.ParentId = rejectedStageId;
              can.ParentName = nextStageName;
              can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
              can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
              can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
            }
            // End
            this.xeepService.performAction('binshot')
            this.setAllDataInStorage({data: this.gridListData, total: this.totalDataCount});
          }
          // Who:Ankit Rawat, What:EWM-16947 Reload the workflow after accept the candidate, When:05Aug24
          this.parentRefreshType.emit(EventType.REALOAD_WORKFLOW_STAGES);
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.cardloading = false;
          if (repsonsedata.Message == '400054') {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          return false;
        }
      })
  }

  /*
@Type: File, <ts>
@Name: openRemoveCandidate
@Who: Anup Singh
@When: 30-sep-2021
@Why: EWM-2871
@What: to open Remove Candidate modal dialog
*/
  openRemoveCandidate(dataItem) {
    const dialogRef = this.dialog.open(RemoveCandidateComponent, {
      maxWidth: "500px",
      data: new Object({ jobdetailsData: dataItem, JobId: this.JobId, JobName: this.JobName, StatusData: dataItem }),
      width: "90%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.parentRefreshType.emit(EventType.REALOAD_HEADER_CHART_LIST);
        this.parentRefreshType.emit(EventType.REALOAD_WORKFLOW_STAGES);
        this.jobService.pageDataChangeStatus(true);
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        this.updateAllComplete();
        this.jobService.pageDataChangeStatus(true);
         

      } else {
        this.loading = false;
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

  updateAllComplete() {
    // this.allComplete = this.gridListData != null && this.gridListData.every(t => t.CheckboxStatus == 1);
    if (this.selectedCandidates?.length > 0) {
      this.IsIntermediate = true;
    } else {
      this.IsIntermediate = false;
      this.allComplete = false;
    }

  }
  /*
   @Type: File, <ts>
   @Name: markAsUnReadGridView function
   @Who: Adarsh
   @When: 08-Nov-2023
   @Why: EWM-14944
 */
  markAsReadGridView(can) {
    let candArrs: any = [];
    let candDiv: any = document.querySelector(".btnViewCandiateName__" + can.CandidateId);
    if (candDiv?.classList.contains("unread")) {
      candDiv?.classList.remove("unread");
      can.IsProfileRead = 1;
      candArrs.push(can.CandidateId)
    }
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileReadUnread(candArrs, this.JobId);
    }
  }
  /*
    @Type: File, <ts>
    @Name: markAsUnReadGridView function
    @Who: Adarsh
    @When: 08-Nov-2023
    @Why: EWM-14944
  */
  markAsUnReadGridView(can) {
    let candArrs: any = [];
    let candDiv: any = document.querySelector(".btnViewCandiateName__" + can.CandidateId);
    if (!candDiv?.classList.contains("unread")) {
      candDiv?.classList.add("unread");
      can.IsProfileRead = 0;
      candArrs.push(can.CandidateId)
    }
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileUnread(candArrs, this.JobId);
    }
  }
  IsEmailConnected: number;
  toEmailList: any = [];
  openMailSync(candidateInfo: any, isBulEmail: boolean): void {
    this.getCandidateData=[];
    this.getCandidateData.push({
      "ModuleType": "CAND", 
      "Id": candidateInfo.CandidateId,
      "EmailTo": candidateInfo.EmailId
    })
    this.mailService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          if (data.Data.IsEmailConnected == 1) {
            this.IsEmailConnected = 1;
          } else {
            this.IsEmailConnected = 0;
          }
          this.toEmailList = [];
          this.toEmailList.push({ EmailId: candidateInfo.EmailId, CandidateId: candidateInfo.CandidateId });
          this.openMail(candidateInfo, this.IsEmailConnected, isBulEmail);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }
  /*
   @Type: File, <ts>
   @Name: openMail
   @Who: Renu
   @When: 04-Oct-2021
   @Why:EWM-2867 EWM-3075
   @What: to open Mail
  */
  multipleEmail: boolean = false;

  openMail(responseData, IsEmailConnected, isBulkEmail: boolean) {
    let subObj = {}
    if (this.viewMode === 'cardMode') {
      subObj = {
        JobName: this.JobName,
        StageName: this.selectedCandidates[0]?.WorkFlowStageName
      }
    }

    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      height: "100%",
      maxHeight: "100%",
      data: {
        'candidateres': responseData, 'IsEmailConnected': IsEmailConnected, 'workflowId': this.workflowId, 'JobId': this.JobId, 'candidateId': this.candidateIdData, 'isBulkEmail': true, 'candiateDetails': this.getCandidateData, 'toEmailList': this.toEmailList, openDocumentPopUpFor: 'Candidate', multipleEmail: this.multipleEmail,
        isDefaultSubj: true, subjectObj: subObj,'JobTitle': this.JobName,caldidateJobMappedPreviewEmail:this.selectedCandidates[0]?.CandidateId?this.selectedCandidates[0]?.CandidateId:responseData?.CandidateId
      },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.multipleEmail = false;
      // this.switchListMode(this.viewMode);
      if (dialogResult == true) {

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
  smsHistoryDetails(can) {
    let obj: any = {
      value: '',
      cdata: can,
      Type: ParentEventType.SEND_SMS_HISTORY
    }
    this.sendEventTypeOnParent.emit(obj)
  }
  openMoveBoxModal(dataItem: any) {
    dataItem.JobHeadCount=this.headcount;
    this.commonMarkAsReadSingle(dataItem);
    const dialogRef = this.dialog.open(CandidateWorkflowStagesMappedJobdetailsPopComponent, {
      maxWidth: "550px",
      data: { data: dataItem, WorkflowId: this.WorkflowId, WorkflowName: this.WorkflowName, JobId: this.JobId, JobName: this.JobName },
      width: "95%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'add_manageAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        this.jobService.pageDataChangeStatus(true);
        this.IsIntermediate = false;
        this.parentRefreshType.emit(EventType.REALOAD_WORKFLOW_STAGES);
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
  getCandidateData: any = [];
  getAllEmailIdFormMappedJob: any = [];

  getAllEmailIdFromMappedJob(data) {
    let arr = data;
    this.getAllEmailIdFormMappedJob = data?.map(function (el) { return el.EmailId; });
    this.getCandidateData = [];
    arr?.forEach(element => {
      this.getCandidateData.push({
        "ModuleType": "Jobs",
        "Id": element.CandidateId,
        "EmailTo": element.EmailId
      })
    });
    this.getCandidateData.filter((value, index) => {
      data.indexOf(value) === index
    })
  }

  /*
   @Type: File, <ts>
   @Name: onMappCandidateFolderGridView function
    @Who: Adarsh
   @When: 08-Nov-2023
   @Why: EWM-14944
 */
  onMappCandidateFolderGridView(canData) {
    this.markAsReadGridView(canData);
    let selectedCandArr: any = [];
    selectedCandArr?.push(canData.CandidateId)
    this.commonMarkAsReadSingle(canData);
    const dialogRef = this.dialog.open(MulitpleCandidateFolderMappingComponent, {
      data: new Object({ candidateIdArr: selectedCandArr, labelAddFolder: true }),
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
        this.folderCancel = 1;
        this.commonserviceService.onOrgSelectFolderId.next(this.folderCancel);
      } else {
      }
    })
  }
  hidecomponent = false;
  oldTabIndex: any = null;
  overlayCandidateSummary = false;
  public matDrawerBgClass;

  candidate(value, cdata) {
    let obj: any = {
      value: value,
      cdata: cdata,
      Type: ParentEventType.OPEN_CANDIDATE_SUMMARY_OVERLAY
    }
    this.sendEventTypeOnParent.emit(obj)
  }

  /*
    @Type: File, <ts>
    @Name: onCandidateRankPop function
    @Who: Adarsh singh
    @When: 07-06-2022
    @Why: EWM-7067 EWM-7080
    @What: for open candidate rank popup
   */
  onCandidateRankPop(candidate) {
    // this.candidateId = candidate.CandidateId;
    const dialogRef = this.dialog.open(CandidateRankComponent, {
      data: { candidate: candidate, jobId: this.JobId },
      panelClass: ['xeople-modal', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getCandidateListByJob(this.pagesize, this.pageNum);
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
 @Name: confirmShareDocument
 @Who: Suika
 @When: 15-Sept-2021
 @Why: EWM-2833
 @What: To confirm share document as an attachment.
 */
  CandidateId: any;
  CandidateName: string;
  confirmShareDocument(CandidateId, CandidateName) {
    this.loading = true;
    this.fetchVersionHistory(CandidateId);
    this.CandidateId = CandidateId;
    this.CandidateName = CandidateName;
    // --------@When: 07-07-2023 @who:Adarsh singh @EWM-13010
    setTimeout(() => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + CandidateId);
      if (candDiv.classList.contains("unread")) {
        candDiv.classList.remove("unread");
        let candArr: [string] = [CandidateId];
        this.commonserviceService.candidateProfileReadUnread(candArr, this.JobId);
      }
    }, 600);
    // End
  }
  isResumeUpload: any = [];
  public ResumeName: any;
  public FileName: any;
  public ResumeId: any;
  fetchVersionHistory(candidateId) {
    this.loading = true;
    this.candidateService.fetchCandidateVersionHistory("?candidateId=" + candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode == 204) {
          let gridView = repsonsedata.Data;
          if (gridView?.length == 0) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_resumeNotAddedYet'), repsonsedata['HttpStatusCode']);
            this.loading = false;
            this.isResumeUpload[candidateId] = true;
          } else {
            if (gridView) {
              let Id = gridView?.ResumeId;
              this.ResumeName = gridView[0].UploadFileName;
              this.FileName = gridView[0].FileName;
              this.ResumeId = gridView[0].ResumeId;
              // this.loadViewer(DemoDoc, Id, FileName)
              this.onShareDocPopUp();
              this.loading = false;
            }
            this.loading = false;
          }
        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  onShareDocPopUp() {
    let documentData = {};
    documentData['Name'] = this.ResumeName ? this.ResumeName : 'Resume';
    documentData['ResumeLink'] = this.FileName;
    documentData['Id'] = this.ResumeId;
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ShareResumeComponent, {
      data: new Object({ documentData: documentData, candidateId: this.CandidateId, candidateName: this.CandidateName }),
      panelClass: ['xeople-modal', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      } else {
        this.loading = false;
      }
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
  @Name: copyCandidateEmailId function
  @Who: Adarsh singh
  @When: 03-Jan-2023
  @Why: ROST-10065
  @What: for copy current data
*/
  copyCandidateEmailId(EmailId: any, i: any) {
    // for display and auto hide after some time
    let el = document.getElementById('autoHide' + i);
    el.style.display = 'block';
    setTimeout(() => {
      let el = document.getElementById('autoHide' + i);
      el.style.display = 'none';
    }, 2000);
    // End
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = EmailId;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }


  public pageChanges({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.state['take'] = take;
    this.pagesize = this.state.take;
    if (skip == 0) {
      this.pagneNo = 1;
    } else {
      this.pagneNo = this.skip / this.pagesize + 1;
    }
    // this.getClientList(take, this.pagneNo, this.sortingValue,this.searchVal,this.filterConfig);
    this.getCandidateListByJob(take, this.pagneNo);

  }


  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    if (this.filter?.filters?.length == 0) {
      this.gridViewlistClearData = {
        data: this.FilterDataClearList.Data,
        total: this.FilterDataClearList.TotalRecord
      };

      this.data = this.gridViewlistClearData;
      this.totalDataCount = this.FilterDataClearList.TotalRecord;
    } else {
      this.loadData();
    }
  }
  public loadData(): void {
    this.gridData = filterBy(this.gridListDataFilter, this.filter);
    this.gridViewlist = {
      data: this.gridData,
      total: this.gridData?.length
    };
    this.data = this.gridViewlist;
    this.totalDataCount = this.gridViewlist?.total;
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    if (this.sort[0].dir != undefined || this.sort[0].dir != null) {
      this.sortDirection = this.sort[0].dir;
    } else {
      this.sortDirection = 'asc';
    }
    this.sortingValue = this.sort[0].field + '-' + this.sortDirection;
    this.getCandidateListByJob(this.pagesize, this.pageNum);

  }
  openNewEmailModal(responseData: any, mailRespondType: string, email: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      height: "100%",
      maxHeight: "100%",
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, 'workflowId': this.workflowId, 'JobId': this.JobId, openDocumentPopUpFor: 'Candidate', isBulkEmail: false,'JobTitle': this.JobName, },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.pageNum = 1;
        this.sortingValue = '';
        this.searchValue = '';
      }
    })
  }

  getFilterConnfig(data: any) {
    setTimeout(() => {
      this.filterConfig = data;
    }, 150);
  }


  ngOnDestroy() {
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
            .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
        })
      };
      setTimeout(() => {
        this.setConfiguration(gridConfig.columnsConfig);
      }, 500);
    }
    this.updatesessiondata();
    if(this.dataChangeStatus){
      this.jobService.pageDataChangeStatus(true);
     }
  }
  updatesessiondata(){
    // this._JobIndexDbService.getDataFromStorage(JobDetailIndexDBList.DB_NAME).then((data:any)=>{
    //   try {
    //    console.log('session data list',data);
    //   } catch (error) {
    //     console.log('Error',error)
    //   }
    // })
    // console.log('this.data list',this.data);
    //this._JobIndexDbService.setDataInStorage(JobDetailIndexDBCard.DB_NAME,this.stages);
  }

  setConfiguration(columnsConfig) {
    let gridConf = {};
    let tempArr: any[] = this.colArr;
    // suika @EWM-10899 @When 11-03-2023

    columnsConfig?.forEach(x => {
      // @When: 05-07-2023 @who:Amit @why: EWM-12954 @what:add question mark
      let objIndex: any = tempArr?.findIndex((obj => obj?.Field == x?.field));
      if (objIndex >= 0) {

        tempArr[objIndex].Format = x?.format,
          tempArr[objIndex].Locked = x?.locked,
          tempArr[objIndex].Order = x?.leafIndex + 1,
          tempArr[objIndex].Selected = true,
          tempArr[objIndex].width = String(x._width)
      }
    });
    gridConf['GridId'] = this.GridId;
    gridConf['GridConfig'] = tempArr;
    gridConf['CardConfig'] = [];
    gridConf['filterConfig'] = this.filterConfig;
    gridConf['FilterAlert'] = this.filterAlert;
    gridConf['QuickFilter'] = this.quickFilterStatus;
    gridConf['Header'] = this.headerExpand ? 1 : 0;
    gridConf['PageMode'] = localStorage.getItem("PageMode") || 'Card';

    this.jobService.setfilterConfig(gridConf).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }

  stagesList: any;
  public showScreeningInterview: boolean;

  @Input() set commonMethodeGetData(methodeTypeData: any) {
    // Who:Ankit Rawat, What:EWM-17083 Set lant long value for fixing the proximity bug, When:08Aug24
    this.JobLatitude = methodeTypeData?.JobDetailsHeader?.Latitude,
    this.JobLongitude = methodeTypeData?.JobDetailsHeader?.Longitude;
    switch (methodeTypeData.Type) {
      case CommonMethodeType.GET_ALL_STAGES: {
        this.stagesList = methodeTypeData?.stagesList;
        this.stages = methodeTypeData?.stages;
        let isRejectedStage = methodeTypeData?.rejectedStage;
        isRejectedStage?.length > 0 ? this.isAnyRejectedStageTypeListView = true : this.isAnyRejectedStageTypeListView = false;
        if (methodeTypeData?.JobDetailsHeader) {
          this.JobDetails = methodeTypeData?.JobDetailsHeader;
          this.JobName = methodeTypeData?.JobDetailsHeader?.JobTitle;
          this.WorkflowId = methodeTypeData?.JobDetailsHeader?.WorkflowId;
          this.listViewObj = methodeTypeData.DefaultConfig
          this.JobLatitude = methodeTypeData?.JobDetailsHeader?.Latitude,
            this.JobLongitude = methodeTypeData?.JobDetailsHeader?.Longitude;

          this.StageDetailsObj = {
            WorkflowId: methodeTypeData?.JobDetailsHeader?.WorkflowId,
            WorkflowName: methodeTypeData?.JobDetailsHeader?.WorkflowName,
            JobId: this.JobId,
            JobTitle: methodeTypeData?.JobDetailsHeader?.JobTitle,
            StageIds: '',
            JobStatus: ''
          }
          this.jobDetails = {
            JobId: this.JobId,
            JobName: methodeTypeData?.JobDetailsHeader?.JobTitle,
            CandidateId: [''],
            CandidateName: '',
            WorkflowId: methodeTypeData?.JobDetailsHeader?.WorkflowId,
            WorkflowName: methodeTypeData?.JobDetailsHeader?.WorkflowName,
            StageId: '',
            StageName: '',
            StageDisplaySeq: 0
          }
          this.WorkflowName = methodeTypeData?.JobDetailsHeader?.WorkflowName;
          this.IsApplicationFormAvailable = methodeTypeData?.JobDetailsHeader?.IsApplicationFormAvailable;
          this.isClientId = methodeTypeData?.JobDetailsHeader?.ClientId;
          this.applicationFormId = methodeTypeData?.JobDetailsHeader?.ApplicationFormId;
          this.applicationFormURL = this.applicationBaseUrl + '/application/apply?mode=apply&jobId=' + this.JobId + '&domain=' + this.subdomain + '&applicationId=' + this.applicationFormId + '&Source='+this.ParentSource+'&parentSource='+this.ParentSource;
        }
        break;
      }
      case CommonMethodeType.HEADER_DETAILS: {
        this.JobDetails = methodeTypeData?.JobDetailsHeader;
        this.JobName = methodeTypeData?.JobDetailsHeader?.JobTitle;
        this.WorkflowId = methodeTypeData?.JobDetailsHeader?.WorkflowId;
        this.listViewObj = methodeTypeData?.DefaultConfig
        this.JobLatitude = methodeTypeData?.JobDetailsHeader?.Latitude,
          this.JobLongitude = methodeTypeData?.JobDetailsHeader?.Longitude;

        this.StageDetailsObj = {
          WorkflowId: methodeTypeData?.JobDetailsHeader?.WorkflowId,
          WorkflowName: methodeTypeData?.JobDetailsHeader?.WorkflowName,
          JobId: this.JobId,
          JobTitle: methodeTypeData?.JobDetailsHeader?.JobTitle,
          StageIds: '',
          JobStatus: ''
        }
        this.jobDetails = {
          JobId: this.JobId,
          JobName: methodeTypeData?.JobDetailsHeader?.JobTitle,
          CandidateId: [''],
          CandidateName: '',
          WorkflowId: methodeTypeData?.JobDetailsHeader?.WorkflowId,
          WorkflowName: methodeTypeData?.JobDetailsHeader?.WorkflowName,
          StageId: '',
          StageName: '',
          StageDisplaySeq: 0
        }
        this.WorkflowName = methodeTypeData?.JobDetailsHeader?.WorkflowName;
        this.IsApplicationFormAvailable = methodeTypeData?.JobDetailsHeader?.IsApplicationFormAvailable;
        this.isClientId = methodeTypeData?.JobDetailsHeader?.ClientId;
        this.applicationFormId = methodeTypeData?.JobDetailsHeader?.ApplicationFormId;
        this.applicationFormURL = this.applicationBaseUrl + '/application/apply?mode=apply&jobId=' + this.JobId + '&domain=' + this.subdomain + '&applicationId=' + this.applicationFormId + '&Source='+this.ParentSource+'&parentSource='+this.ParentSource;
        break;
      }
      case CommonMethodeType.FILTER_CONFIG: {
        this.filterConfig = methodeTypeData?.JobFilterParams;
        this.stagesList = methodeTypeData?.stagesList;
        // this.listViewObj.JobFilterParams = methodeTypeData?.JobFilterParams ? methodeTypeData?.JobFilterParams : [];
        if (methodeTypeData.isRefresh) {
          this.getCandidateListByJob(this.pagesize, this.pageNum);
        }
        break;
      }
      case CommonMethodeType.REALOAD_FILTER_STAGES: {
        this.filterConfig = methodeTypeData?.JobFilterParams;
        this.StageId = methodeTypeData?.SelectedStageId;
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        break;
      }
      case CommonMethodeType.REALOAD_PIECHART_FROM_HEADER: {
        this.Source = methodeTypeData?.Source;
        this.stages = methodeTypeData?.stages;
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        break;
      }
      case CommonMethodeType.REALOAD_FROM_QUICK_FILTER: {
        this.CountFilter = methodeTypeData?.CountFilter;
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        break;
      }
      case CommonMethodeType.FILTER_CLEAR: {
        this.filterConfig = [];
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        break;

      }
      case CommonMethodeType.INPUT_SEARCH: {
        this.inputValue = methodeTypeData?.searchVal;
        this.searchSubject$.next();
        break;

      }
    }
  }


  formType(value, CandidateId, RelatedUser) {
    let obj: any = {
      value: value,
      CandidateId: CandidateId,
      RelatedUser: RelatedUser,
      Type: ParentEventType.CREATE_ACTIVITY
    }
    this.sendEventTypeOnParent.emit(obj)
  }

  performActionEventWise(eventNumber: number) {
    switch (eventNumber) {
      case EventType.REFRESH: {
        this.Source = '';/***@Why:EWM-16622 EWM-16974 @Who: Renu @What: to send updated source***/
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        break;
      }

      case EventType.SEARCH_CLEAR: {
        this.inputValue = '';
        this.getCandidateListByJob(this.pagesize, this.pageNum);
        break;
      }
      case EventType.ACTION: {
        this.getFilterConfig(false);
        break;
      }
    }
  }

  pushCandidateToEOH(CandidateId: string, dataItem:any) {
    let slCand = dataItem;
    let ApplicantMemberPublishedStatus=slCand?.MemberId?.substring(0, 3)?.toLowerCase();
    if (slCand?.MemberId?.substring(0, 3).toLowerCase()==='mbr' && slCand?.MemberId!=null && slCand?.MemberId !=='') {
      const message = this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg1') + slCand?.CandidateName + this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg2') + slCand?.MemberId;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      this.dialog.open(AlertDialogComponent, {
        maxWidth: "350px",
        data: { dialogData, isButtonShow: true },
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    } else {
      const dialogRef = this.dialog.open(PushcandidateToEohFromPopupComponent, {
        data: new Object({ candidateId: CandidateId, IsOpenFor: 'popUp', candidateName: slCand?.CandidateName,stageType: slCand?.StageType,lastActivity: slCand?.LastActivity,PublishedStatus: ApplicantMemberPublishedStatus }),
        panelClass: ['xeople-modal', 'push-candidate-to-eoh-modal', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res.StatsCode == 200) {
          let allCand = this.data
          for (let object of allCand.data) {
            if (object.CandidateId === this.candidateId) {
              object.IsXRCandidatePushedToEOH = 1;
              object.MemberId = res?.ApplicantId;
            }
          }
        }
      })
    }
  }

  checkDataInsideIndexDB(){ 
    let getData = sessionStorage.getItem(JobDetailLocalCalculationName.LIST_COUNT);
    let dataChangeStatus = localStorage.getItem('jobDetailsPageEventStatus');
    let AssignToCandidateToJob = localStorage.getItem('AssignToCandidateToJob');
    if(AssignToCandidateToJob!== null){
      this.jobService.pageDataChangeStatus(true);
      this.getCandidateListByJob(this.pagesize, this.pageNum);
         
    }
    if ((getData && Number(getData) >= 0) &&  dataChangeStatus === null) {
      this._JobIndexDbService.getDataFromStorage(JobDetailIndexDBList.DB_NAME).then((data:any)=>{
        try {
          this.data = data[0]?.data;
          this.stagesList  = data[0]?.data;
          this.gridListData = data[0]?.data
          this.stages = this.stagesList;
          // this.stagesList
          this._JobIndexDbService.getDataFromStorage(JobDetailIndexDBCard.ALL_STAGE_LIST).then((arr:any)=>{
            let isRejectedStage = arr.filter(e=> e.IsRejectedStage === true);
            isRejectedStage?.length > 0 ? this.isAnyRejectedStageTypeListView = true : this.isAnyRejectedStageTypeListView = false;
          })

        } catch (error) {
          console.log('Error',error)
        }
      })
    }else{
      if(dataChangeStatus!='1'){
        this.jobService.pageDataChangeStatus(false);
      }
      this.getCandidateListByJob(this.pagesize, this.pageNum);
      // this.data = { data: result['data'], total: result['total'] };
    }
  }

  setAllDataInStorage(data:any){
    this._JobIndexDbService.setDataInStorage(JobDetailIndexDBList.DB_NAME,[data]);
  }
  redirectOnMarketPlace(){
    this.route.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode))
  }

// adarsh singh on 9 April 2024 for EWM-16567
  public alertMaxCandidateAddInLastStage(){
    const jobHeadCount = this.headerListData?.HeaderAdditionalDetails?.HeadCount;
    const message = `${this.translateService.instant('label_candidate_Of_Job_HeaCount')} (${jobHeadCount}).
     ${this.translateService.instant('label_max_candidate_Of_Job_HeaCount')} (${jobHeadCount})
     ${this.translateService.instant('label_candidate_Of_Job_HeaCount_message')} 
     `
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle,message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData,isButtonShow:true,message:message},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
     
  }

  shareJob(CandidateId: string, dataItem:any) {
    let slCand = dataItem;
    if (slCand?.IsXRCandidatePushedToEOH == 1 && slCand?.MemberId!=null) {
      const message = this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg1') + slCand?.CandidateName + this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg2') + slCand?.MemberId;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      this.dialog.open(AlertDialogComponent, {
        maxWidth: "350px",
        data: { dialogData, isButtonShow: true },
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    } else {
      const dialogRef = this.dialog.open(SharedJobComponent, {
        data: new Object({ candidateId: CandidateId, IsOpenFor: 'popUp', candidateName: slCand?.CandidateName,stageType: slCand?.StageType,lastActivity: slCand?.LastActivity }),
        panelClass: ['xeople-modal-full-screen', 'push-candidate-to-eoh-modal', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res.StatsCode == 200) {
          let allCand = this.data
          for (let object of allCand.data) {
            if (object.CandidateId === this.candidateId) {
              object.IsXRCandidatePushedToEOH = 1;
              object.MemberId = res?.ApplicantId;
            }
          }
        }
      })
    }
  }



}
