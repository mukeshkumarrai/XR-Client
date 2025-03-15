/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 28-Sept-2021
  @Why:EWM-2870 EWM-2990
  @What:  This page will be use for job details Component ts file
*/
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ButtonTypes, ResponceData, SCREEN_SIZE, Userpreferences } from 'src/app/shared/models';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { DataBindingDirective, GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidatejobmappingService } from 'src/app/shared/services/candidate/candidatejobmapping.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import {  CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { DisconnectEmailComponent } from 'src/app/shared/modal/disconnect-email/disconnect-email.component';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { DOCUMENT } from '@angular/common';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CandidateFolderFilterComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { GoogleMapsLocationPopComponent } from 'src/app/shared/modal/google-maps-location-pop/google-maps-location-pop.component';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { auditTime, debounceTime, takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { RtlService } from 'src/app/shared/services/commonservice/rtl/rtl.service';
import { take } from 'rxjs/operators';
import { XeopleSmartEmailJobComponent } from 'src/app/shared/popups/xeople-smart-email-job/xeople-smart-email-job.component';
import {StageDetails} from 'src/app/shared/models';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { MulitpleCandidateFolderMappingComponent } from 'src/app/shared/modal/mulitple-candidate-folder-mapping/mulitple-candidate-folder-mapping.component';
import { JobDetailsCardViewgoogleMapsLocationPopComponent } from 'src/app/shared/modal/job-details-card-viewgoogle-maps-location-pop/job-details-card-viewgoogle-maps-location-pop.component';
import { CloseJobComponent } from 'src/app/shared/modal/close-job/close-job.component';
import { CandidateWorkflowStagesMappedJobdetailsPopComponent } from 'src/app/shared/modal/candidate-workflow-stages-mapped-jobdetails-pop/candidate-workflow-stages-mapped-jobdetails-pop.component';
import { RemoveMultipleCandidateComponent } from 'src/app/shared/modal/remove-multiple-candidate/remove-multiple-candidate.component';
import { customDropdownConfig } from '@app/modules/EWM.core/shared/datamodels';
import { TreeDataSource, TreeNode } from '@app/modules/EWM.core/job/landingpage/tree-datasource';
import { NestedTreeControl } from '@angular/cdk/tree';
import { GridState, JobScreening } from '@app/shared/models/job-screening';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { IntegrationsBoardService } from '@app/modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { BroadbeanService } from '@app/modules/EWM.core/shared/services/broadbean/broadbean.service';
import { ProfileInfoService } from '@app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { UserAdministrationService } from '@app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { CandidateTimelineComponent } from '@app/modules/EWM.core/job/candidate-timeline/candidate-timeline.component';
import { RemoveCandidateComponent } from '@app/modules/EWM.core/job/remove-candidate/remove-candidate.component';
import { NewEmailComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ShareResumeComponent } from '@app/modules/EWM.core/job/screening/share-resume/share-resume.component';
import { CandidateRankComponent } from '@app/modules/EWM.core/job/job-details/candidate-rank/candidate-rank.component';
import { JobPublishPopupComponent } from '@app/modules/EWM.core/job/job-details/job-publish-popup/job-publish-popup.component';
import { JobDeatilsHeaderStatusComponent } from '@app/modules/EWM.core/job/job-action/job-deatils-header-status/job-deatils-header-status.component';
import { JobScreeningComponent } from '../job-screening/job-screening.component';
import { ActionDialogComponent } from '@app/modules/EWM.core/job/landingpage/action-dialog/action-dialog.component';
import { WorkflowSubStagesComponent } from '@app/modules/EWM.core/job/landingpage/workflow-sub-stages/workflow-sub-stages.component';
import { JobFilterDialogComponent } from '@job/job-shared/job-filter-dialog/job-filter-dialog.component';
import { FilePreviwerPopupComponent } from '@app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { BulkSmsComponent } from '@app/modules/EWM.core/job/job/job-sms/bulk-sms/bulk-sms.component';
import { CandidateJobResumeComponent } from '@app/modules/EWM.core/job/job-details/candidate-jobresume/candidate-jobresume.component';
import { CandidateJobApplicationFormComponent } from '@app/modules/EWM.core/job/job-details/candidate-job-application-form/candidate-job-application-form.component';
import { JobCandidateCardActivityComponent } from '@app/modules/EWM.core/shared/quick-modal/job-candidate-card-activity/job-candidate-card-activity.component';
import { JobSmsComponent } from './job-sms/job-sms.component';
import { ReloadService } from '@app/modules/EWM.core/shared/reload.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonMethodeType, EventType, JobDetailIndexDBCard, JobDetailIndexDBList, JobDetailLocalCalculationName, ListModeObj, ParentEventType } from '@app/shared/enums/job-detail.enum';
import { ListviewComponent } from './listview/listview.component';
import { IndexedDbService } from '@app/shared/helper/indexed-db.service';
import { Title } from '@angular/platform-browser';
import { jobDetails } from '../job-manage/IquickJob';
import { CandidateJobMappedComponent } from '../candidate-job-mapped/candidate-job-mapped.component';
import { PushcandidateToEohFromPopupComponent } from '../job-screening/pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';
import { JobIndexDbService } from '@app/shared/helper/job-index-db.service';
import { ApplicantDetailPopupComponent } from '../job-list/applicant-list/applicant-detail-popup/applicant-detail-popup.component';
import { ParsedResumeKeywordSearchComponent } from '@app/shared/parsed-resume-keyword-search/parsed-resume-keyword-search/parsed-resume-keyword-search.component';
import { InformDialogComponent } from '@app/shared/modal/inform-dialog/inform-dialog.component';
import { XeepService } from '../../../shared/services/xeep/xeep.service';
import { SharedJobComponent } from '../job-screening/shared-job/shared-job.component';
import { ClientService } from '../../EWM.core/shared/services/client/client.service';
import { ButtonService } from '../../../shared/services/button-service/button.service';
import { ClientBtnDetails } from '../../EWM.core/client/client-detail/share-client-eoh/share-client-model';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
export interface CandidateStageResp {
  JobId: string
  GridId: string
  JobFilterParams: any[]
  search: string
  PageNumber: number
  PageSize: number
  OrderBy: string
  WorkflowId: string
  ByPassPaging: boolean
  QuickFilter: string
  StageId: string
}
export type ChartOptions = {
  series1: ApexAxisChartSeries;
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
  states: ApexStates;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit,OnDestroy  {
  background20: any;
  disableDragDrop: boolean = true;
  cardloading: boolean = false;
  searchTextTag;
  public headerListData: any = [];
  public headerListDataCount: any = [];
  formtitle = "grid";
  loading: boolean;
  JobId: any;
  JobName: any;
  WorkflowId: any;
  WorkflowName: any;
  public candidateId: string = '2c9d3248-1c59-4ae1-8914-dcc223b17c81';
  expiryDate: any = 0;
  public days: number;
  hours: number;
  minutes: number;
  seconds: number;
  quickJobList: any = {};
  gridListData: any[] = [];
  public sortDirection = 'asc';
  public sortingValue: string = "IsPin,desc";
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  pagesize: any;
  pageNum: any = 1;
  searchValue: any = '';
  filterConfig: any = [];
  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  public pageSizeOptions;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public skip = 0;
  public sort: any[] = [{
    field: 'Proximity',
    dir: 'asc'
  }];
  kendoLoading: boolean = false;
  viewMode: string = 'cardMode';
  isCardMode: boolean = false;
  public GridId: any = 'CandidateJobMapping_grid_001';
  public GridIdNotes:any = "JobNotes_grid_001"; // @suika @EWM-10650 changes notes grid ID
  public userpreferences: Userpreferences;
  public stages: any[];
  public candidates: any = [];
  public positionMatDrawer: string = 'end';
  public colArr: any = [];
  public columns: ColumnSetting[] = [];
  public publishArr: any = [];
  public isActiveNotes: boolean = false;
  public isActiveSearchCandidate:boolean = false;
  public isJobLog: boolean = false;
  HeaderCount: any;
  JobDetails: any;
  JobStatus: any;
  JobTags: any;
  tagLength: any;
  tagLengthStatus: boolean;
  filterCount: number;
  clientName: any;
  ExpireIn: any;
  JobPostDate: any;
  currentStatus: any;
  isManageJobPosted: boolean = false;
  iscandidateJob: boolean = false;
  jobStatuslength: any;
  loadingSearch: boolean;
  IsEmailConnected: number;
  IsApiSuccess: boolean = false;
  stageData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  JobLatitude: any;
  JobLongitude: any;
  jobLocation: any;
  scrolledValue: any;
  isLocationActive: boolean = false;
  public loadingAssignJobSaved: boolean;
  loaderStatus: number;
  public totalDataCount: number;
  @ViewChild(GridComponent)
  public grid: GridComponent;
  public category: string = 'JOB';
  public documentForJob = 'Job'
  public documentJob = 'JOBS'
  dataTotalActivity: any;
  dataTotalNotes: any;
  visibilityStatus: any;
  RegistrationCode: any;
  positionMatTab: any;
  public ResumeName: any;
  public FileName: any;
  public ResumeId: any;
  animationVar: any;
  zoomPhoneCallRegistrationCode: any;
  zoomCheckStatus: boolean = false;
  selectedTabIndex: any = 0;
  activityStatus: boolean;
  // add activity
  @ViewChild('asignJob') public asignJob: MatSidenav;
  @ViewChild('activityAdd') public activityAdd: MatSidenav;
  @Output() clientActivityCount = new EventEmitter();
  public clientId: any;
  Names: any;
  clientIdData: any;
  public gridList: any = [];
  public gridMonthYearCount: any;
  public currentYear: number;
  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public dateFill = new Date();
  public today = new Date();
  public todayOpenDate = new Date();
  public todayFillDate = new Date();
  public selectedFiles: any;
  public fileBinary: File;
  public myfilename = '';
  public filePath: any;
  public previewUrl: any;
  public maxMessage: number = 200;
  @ViewChild('activityAdd') public sidenav: MatSidenav;
  notesCategory: any;
  public selectedCategory: any = {};
  public dropDoneConfig: customDropdownConfig[] = [];
  CategoryId: any;
  public activestatus: string = 'Add';
  accessEmailId: any = [];
  changeText: boolean = false;
  public yearFilterRes: number;
  public monthFilterRes: string;
  // public GridId='ClientNotes_grid_001';
  public ToDate: any;
  public FromDate: any;
  public OwnerIds: any = [];
  public assignJobDrawerPos: string;
  public notesDrawerPos: string = 'end';
  public oldPatchValues: any = {};
  public formHeading: string;
  public CategoryIds: any = [];
  public selectedIndex: number = null;
  @ViewChild('target', { read: ElementRef }) public myScrollContainer: ElementRef<any>;
  public hoverIndex: number = -1;
  public tagNotesKey: any[] = [];
  public maxCharacterLengthSubHead = 500;
  public filterCountCategory: number = 0;
  public filterCountOwner: number = 0;
  public filterCountDate: any = 0;
  documentTypeOptions: any;
  candidateIdData: any;
  Employee: string = 'Candidate';
  activityRelatedToJob:string = 'JOB';
  uploadedFileName: any;
  @ViewChild('titleActivity') titleActivity: MatInput;
  public requiredAttendeesList: any = [];
  public organizerOrAssigneesList: any = [];
  public removable = true;
  resetFormSubjectRelatedUser: Subject<any> = new Subject<any>();
  public dropDownRelatedUserConfig: customDropdownConfig[] = [];
  public selectedRelatedUser: any = {};
  public ActivityTypeList: any[] = [];
  pageNo = 1;
  public activityForAttendees: string;
  @Output() myActivityDrawerClose: EventEmitter<any> = new EventEmitter<any>();
  RelatedUserId: any;
  public userId: string;
  action: boolean = false;
  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  meetingPlatformList: any;
  meetingPlatformData: any;
  meetingPlatformName: any;
  meetingUrlData: string;
  MeetingUrl: string;
  MeetingId: string;
  CalendarExternalId: any;
  tagSelecteditem: any;
  OwnerName: any;
  candidateJobCountData: any;
  RequiredAttention: any;
  MoreThanOneJob: number = 0;
  ImmediateAvailable: number = 0;
  CountFilter: any='All';
  public screnSizePerStage: number;
  public actionButtonVisible:number=11;
  public navigation:Boolean=true;
  public screenPreviewClass: string = "";
  addSlectedID: number = 0;
  stagesList: any;
  totalStages: any;
  currentMenuWidth: any;
  OwnersList: any = [];
  PrimaryOwner: any=[];
  filterStatus: boolean = false;
  workflowId: any;
  // end
  public maxCharacterLength = 5;
  getSMSRegistrationCode;
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false
  largeScreenTagData: any;
  smallScreenTagData: any;
  isMenuOpen = false;
  elementRef: any;
  sizes = [
    {
      id: SCREEN_SIZE.small, name: 'small',
      css: `showMenu`
    },
    {
      id: SCREEN_SIZE.large, name: 'large',
      css: `hide`
    }
  ];
  prefix = 'is-';
  public dynamicFilterArea: boolean = false;
  public headerExpand: boolean = true;
  currentUser: any;
  public filterAlert: any = 0;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public quickFilterStatus: number = 0;
  public isLeft: boolean = true;
  @ViewChild('quickFilter') public righttoggel: MatSidenav;
  @ViewChild('shareJobApplicationForm') public shareJobApplicationForm: MatSidenav;
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  smallScreenTagDataOwner: number;
  largeScreenTagOwner: boolean;
  mobileScreenTagOwner: boolean;
  MobileMapTagSelectedOwner: any[];
  largeScreenTagDataOwner: any;
  isShareJobApplicationUrl: boolean = false;
  isRecentActivity: boolean = false;
  public isActive: any;
  public dirctionalLang: any;
  stageColor = '#b6b6b6';
  public IsApplicationFormAvailable: any = 0;
  // for job documents
  public showJobDocuments: boolean = false;
  candidateIdForJobDoc: string;
  public documentForCandidate: any = 'Job';
  totalDocuments: number = 0;
  totalJobPost: number = 0;
  // End
  activatedRoute:any;
  isClientDetailView: boolean = false;
  isClientId:string;
  pieChartData:any=[];
  public pieheight = 360;
  public piechartType: any = 'pie';
  public pieDataLegends = [];
  public pieData: any[];
  public pieDataColors = [];
  public Source:string='';
  public cOptions1: Partial<ChartOptions>;
  public cOptions: Partial<ChartOptions>;
  public pieloading:boolean=false;
  public totalSource:any=0;
  searchSubject$ = new Subject<any>();
  burstSMSRegistrationCode: any;
  getAllEmailIdFormMappedJob:any = [];
  applicationBaseUrl: string;
  applicationFormURL: string;
  applicationFormId: any=0;
  hideButton: boolean=true;
  subdomain: string;
  isSmsHistoryForm: boolean = false;
  jobActionStatus: boolean = false;
  EmailsAndPhonesData;
  largeEmailsAndPhonesData:[] = [];
  smallEmailsAndPhonesData;
  getResponseEmailPhone:any;
  skillData:[]= [];
  largeSkill:[]= [];
  candidateDetails:any=[];
  SMSHistory:any=[];
  smsHistoryToggel:boolean=false;
  quickFilterToggel:boolean=true;
  JobTitle: any;
  jobId: any;
  EmailId: any;
  WorkFlowStageId: any;
  WorkFlowStageName: any;
  LastActivity: any;
  TREE_DATA: TreeNode[];
  view:boolean=false;
  treeControl:NestedTreeControl<TreeNode>;
  dataSource:TreeDataSource;
  dataArr: any=[];
  // public selectjobcatparam: any = 'TotalJobs';
  public selectjobcatparam: any ;
  treeMatDrawer:boolean=false;
  public loadingStage: boolean;
  public loadingTree: boolean;
  public loadingHeader: boolean;
  WorkFlowName: any;
  applicationLinkExpire:any;
  overlayViewjob = false;
  overlayCandidateSummary= false;
  overlayMappApplicationForm=false;
  overlayShareJobApplicationForm=false;
  overlayClientDetail= false;
  currentStatusReasonName:string;
  public isChild: any;
  public slotAdd: boolean;
  public activityActionForm: string = "Add";
  public dateFormat: any;
  public utctimezonName: any = localStorage.getItem('UserTimezone');
  public slotStartDate: any;
  public slotEndDate: any;
  public startTime: any;
  public endTime: any;
  public timeAvaiableSlots: any = [];
  public selectedTimeslots: any;
  public timePeriod: any = 30;
  public timezonName: any = localStorage.getItem('UserTimezone');
  public TimeZone: any= localStorage.getItem('TimeZone')
  public selectedItem =  [];
  timeDisplayHour = 12;
  scheduleTimeData: any = {};
  isDisabledForScreening:boolean;
  filterparam: any;
  public showScreeningInterview:boolean;
  selectjob: any;
  emailConnection: boolean = false;
  public categoryForCand: string = 'CAND';
  gridColConfigStatus:boolean=false;
  selectedCandidates:any=[];
   StageDetailsObj:StageDetails;
   masterSelected:boolean = false;
  /*--@When:25-05-2023,@who:Renu,@why:EWM-11781 EWM-12517,@what:For job screening model*/
  public candidateScreeningInfo:JobScreening[]=[];
  public screeningObj: JobScreening;
  public gridStateObj:GridState;
  public stageId: string;
  public allComplete: boolean = false;
  HideStageIds: any=[];
  public hideChartOnHeaderCollpase:boolean=false;
  IsIntermediate: boolean;
  IsCardStageIntermediate: boolean=true;
  NoOfCanSelectedEachStage:number; // @suika EWM-11782 02-06-2023
  JobHeaderDetailsObs:Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  CandidateMappedJobHeadertagsObs: Subscription;
  CandidateJobFilterCountObs: Subscription;
  JobworkFlowBypipeIdObs: Subscription;
  JobsummaryHeaderSourcepichartObs: Subscription;
  AllCandidateJobMappingObs: Subscription;
  CandidatemappedtojobcardAllObs: Subscription;
  candidateMoveActionObs: Subscription;
  CreateJobCallLogObs: Subscription;
  FetchJobNotesTotalObs: Subscription;
  FilterConfigObs: Subscription;
  JobworkFlowChildByIdObs: Subscription;
  TimezoneObs: Subscription;
  UserInviteListOnbasisSearchObs: Subscription;
  AvaiableTimeslotsObs: Subscription;
  UserIsEmailConnectedObs: Subscription;
  EmailForwardingObs: Subscription;
  ActivityMonthYearCountAllObs: Subscription;
  SelectedStageId:'';
  loadingData:any="label_job_details_candidates_loading";
  public interviewinaweek: number;
  moreThanOneJobCount: number = 0;
  inboxCount: number = 0;
  public unreaddatas:{};
  public selectedCand:any[]
  public hidedata:boolean=false;
  public gridViewList: any = [];
  oldTabIndex: any = null;
  dateFormatKendo: string;
  scheduleData: any = {};
  public jobDetails:jobDetails;
  showHideDocumentButtons:boolean = false;
  SMSCheckStatus: boolean = false;
  selectedClientAndCandidateLatLong: boolean = false;
  public isSlotActive: boolean = false;
  public slotsData: any;
  public attendeesDataList: any[] = [];
  multipleEmail:boolean = false;
  StageVisibilityCount:number = 0;
  public getSkillLength: number;
  public getSkillALl:any=[];
  public maxMoreLengthForOwnerContacts:number=2
  public ownersData: boolean = false;
  public FocusContactField:boolean=false;
  public triggerOrigin: any;
  public overlayCandidateProfile:boolean;
  public candidateProfileDrwerForEdit:boolean;
  public IsJobClosed:number
  workflowStatus: boolean=false;
  firstStageData:any;
  isSelectedCandOfFirstSatgesOnly: boolean = false;
  isOpen:string;
  isSelectedCandOfOtherSatgesOnly: boolean = false;
  isAnyRejectedStageType:boolean = false;
actiontBtnTooltip:string = 'label_jobDetailsAction';
actiontBtnTooltipCount: number | string;
acceptBtnTooltip:string = 'label_jobDetails_Accept';
rejectBtnTooltip:string = 'label_jobDetails_Reject';
removeBtnTooltip:string = 'label_jobDetails_Remove';
readBtnTooltip:string = 'label_jobDetails_Read';
callBtnTooltip:string = '';
smsBtnTooltip:string = 'label_SMS';
activityBtnTooltip:string = 'label_MenuActivity';
ProfileUpdateBtnTooltip:string = 'label_jobDetails_ApplicantProfileUpdate_tooltip';
pinBtnTooltip:string = 'label_jobDetails_Pin';
moveToFolderBtnTooltip:string = 'label_jobDetails_MovetoFolder';
unreadBtnTooltip:string = 'label_jobDetails_UnRead';
distanceUnit: string='KM';
isLastStageCandidate:boolean = false;
jobContactDetailsArr:[] = [];
  workflowStageList: any;
  WorkflowStageId: any;
  @ViewChild('quickCandidateList') public candidatetoggel: MatSidenav;
  quickCandidateList: string='All';
  CountFilters='TotalJobs';
  @ViewChild('LandingEnddrawer') public sidenav1: MatSidenav;
  sideMenuContext:string;
  isAnyRejectedStageTypeListView:boolean = false;
  @ViewChild('target') targetElement: any;
  scrolledStage: string;
  @ViewChildren('viewport') viewport: QueryList<CdkVirtualScrollViewport>;

  currentParamValue: string | null = null;
  previousParamValue: string | null = null;
   // split list mode code
   listModeObj:ListModeObj
   listModeEventType:number;
   @ViewChild(ListviewComponent) listViewPage: ListviewComponent;
  commonMethodeGetData: any;
  cdkDragDisabled=false;
  JobReferenceId: string;
  EOHIntegrationObj:any;
  IsEOHIntergrated: boolean = false;
  eohRegistrationCode: string;
  public userType='CAND';
  public contactPhone:number;

  public dataChangeStatus: boolean = false;
  JobExpiryDays: number=1;
  JobIdForVxt:string;
  CallTab:boolean=false;
  public ParentSource: string;

  brandAppSetting: any=[];
  EOHLogo: any;
  checkClientSyncEOHObs: Subscription;
  EOHClientId: string='';
  MemberId: string='';

  constructor(private route: Router, private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private _service: CandidatejobmappingService, private translateService: TranslateService, private snackBService: SnackBarService, @Inject(DOCUMENT) private document: any,
    private quickJobService: QuickJobService, public systemSettingService: SystemSettingService,
    private jobService: JobService, private mailService: MailServiceService, public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, public changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public _integrationsBoardService: IntegrationsBoardService,  private serviceListClass: ServiceListClass,public _DatePipe:DatePipe, private datePipe: DatePipe,private _profileInfoService: ProfileInfoService,
    private _broadbeanService: BroadbeanService,public _clientService: ClientService,private buttonService:ButtonService,
     private _rtlService:RtlService,  private ngZone: NgZone,
     private _userAdministrationService:UserAdministrationService,
     private _reloadService: ReloadService,
     public indexBDService : IndexedDbService,
     private titleService: Title,
     private _JobIndexDbService: JobIndexDbService,private xeepService:XeepService
     
     ) {
    this.ParentSource=this.appSettingsService.SourceCodeParam['ApplicationForm'];
    this.pagesize = appSettingsService.pagesize;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.getSMSRegistrationCode = this.appSettingsService.xeopleSMSRegistrationCode;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    this.applicationBaseUrl =  this.appSettingsService.applicationBaseUrl;
    this.applicationLinkExpire = this.appSettingsService.applicationLinkExprire;
    this.showScreeningInterview = this.appSettingsService.showScreeningInterview;
    this.NoOfCanSelectedEachStage =  this.appSettingsService.NoOfCanSelectedEachStage;
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.pagesize = appSettingsService.pagesize;
    this.currentYear = (new Date()).getFullYear();
    this.fileType = appSettingsService.file_file_type_extralarge;
    this.fileSizetoShow = appSettingsService.file_file_size_extraExtraLarge;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }
    this.routes.queryParams.subscribe((Id: any) => {      
      // if(this.oldTabIndex != this.selectedTabIndex){
      this.candidateIdForJobDoc = Id['jobId'];
      // }
      // this.candidateIdForJobDoc = 'c6f34211-df10-4dbf-af71-43ff5674cf9b';
    })
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
  }
  ngOnInit(): void {
     //@When:19-11-2024 @Who:Renu @Why: EWM-17935 EWM-18596 @What: if same routing only parameters changes
     //@who:Renu @When:28-11-2024 @Why: EWM-17954 EWM-18882 @What: for reload notification on same routing
     this.routes.queryParams.subscribe(params => {
      this.previousParamValue = this.currentParamValue;
      this.currentParamValue = params['jobId']; 
      if (this.previousParamValue && this.previousParamValue !== this.currentParamValue) {
        this.getCandidateMappedJobHeader(this.currentParamValue);
        this.getCandidateMappedJobHeaderTag(this.currentParamValue);
        this.getJobsummaryHeaderSourcepichart();    
        this.getJobNotesCount();
        this.countVxtCall();
        this.getIntegrationCheckSMSstatus();
        this.getEmployeeActivityCount();
        this.checkZoomConnectedOrNot();
        this.getFilterConfig(true);
      }
   });
    //end
    this.routes.queryParams.subscribe((parmsValue) => {//by maneesh when:23/07/2024 for ewm-17125
      if (parmsValue.filter != null && parmsValue.filter != undefined && parmsValue?.filter != '') {
      this.isActive = parmsValue.filter;
      sessionStorage.setItem('Activefilter', this.isActive);
      }
    });
  this._sidebarService.searchEnable.next('1');
  /*--@Who:Nitin Bhati,@When:20-07-2023 @Why: EWM-13434--*/
   this.dateFormatKendo = localStorage.getItem('DateFormat');
  this.screeningObj = <JobScreening>{};
  this.StageDetailsObj = <StageDetails>{};
  this.jobDetails=<jobDetails>{};
  this.gridStateObj= <GridState>{};
  this.listModeObj= <ListModeObj>{};
   this.checkEmailConnection();//<!--@suika @EWM-11802 @WHN 11-04-2023 to check email connected or not------>
    this.animationVar = ButtonTypes;
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
 //   this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    //this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('landing');
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData.FirstName;
    //this.currentUser.FirstName
    this.routes.queryParams.subscribe((parmsValue) => {
     this.JobIdForVxt= parmsValue?.jobId;
    // @Who: Bantee Kumar,@Why:EWM-11603,@When: 14-july-2023,@What:On View Candidate Summary side overlay screen, when user clicks on Summary, Resume, Job, etc. from title bar, then on job detail page sections changes from Candidates to Search Candidates, Notes and so on. -->
      if(this.oldTabIndex != this.selectedTabIndex){
        this.JobId = parmsValue.jobId;
        this.viewMode = parmsValue.cardJob?parmsValue.cardJob:this.viewMode;//<!--@Who:Renu @Why:EWM-15118 @When: 14-11-2023 value is getting undefined------>
        this.workflowId = parmsValue.workflowId;
        // this.getCandidateMappedJobHeader(this.JobId);
        // this.getCandidateMappedJobHeaderTag(this.JobId);
        // this.getJobsummaryHeaderSourcepichart();
        // who:maneesh,what:ewm-12889 for pass this.workflowId show interviewinaweek count and candidate list filter interviewinaweek ,when:03/07/2023 -->
        // if(this.viewMode=='listMode'){
        //   this.getWorkFlowStagesForClient(this.workflowId);
        // }
        }
    });
    this.subdomain=localStorage.getItem("tenantDomain");
    this.onResize(window.innerWidth, 'onload');
    this.actionMenuShowHide();
    this.animationVar = ButtonTypes;
    this.getCandidateMappedJobHeader(this.JobId);
    this.getCandidateMappedJobHeaderTag(this.JobId);
    this.getJobsummaryHeaderSourcepichart();
    /*************@why:EWM-14999 EWM-15000 @Who:Renu @What:Passing a parameter to handle dynamic filter popup on load************/

    this.getJobNotesCount();
    this.countVxtCall();
    this.commonserviceService.countRefreshForContact.subscribe(res => {
      if (res?.jobCall==true) {
      this.countVxtCall();     
      }
    });
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false);
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.dirChange(res);
    });
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab = res;
    });
    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);
    this.getIntegrationCheckSMSstatus();
    this.getEmployeeActivityCount();
    this.checkZoomConnectedOrNot();
   let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.userId = currentUser?.UserId;
    //this.getAllInviteUser(this.userId);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.routes.queryParams.subscribe((value) => {
      // if(this.oldTabIndex != this.selectedTabIndex){
      if (value.clientId != undefined && value.clientId != null && value.clientId != '') {
        this.clientId = value.clientId;
      }
    // }
    });
    this.commonserviceService.onClientSelectId.subscribe(value => {
      if (value !== null) {
        this.clientIdData = value;
      }
    })
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    // this.getNoteCateogoryList();
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType=' + this.category + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDoneConfig['placeholder'] = 'label_category';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/notes-category';
    this.dropDoneConfig['bindLabel'] = 'CategoryName';
    this.dropDoneConfig['IsRequired'] = true;
    var element = document.getElementById("add-new-activity");
    element?.classList.remove("add-new-activity");
    //  activity end
    if (this.currentMenuWidth < 581) {
      this.headerExpand = false
      this.hideChartOnHeaderCollpase=false
    }else if(this.currentMenuWidth < 1299){
      this.hideChartOnHeaderCollpase=false
    } else {
      this.headerExpand = false
      this.hideChartOnHeaderCollpase=false
    }
    // get jon count
    this.getAlldocumentCount();
    this.activatedRoute = this.routes.url;
    //this.getCandidateEmailAndPhone(this.JobId);
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      if (this.isCardMode == true) {
        this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, value, this.filterConfig);
      } else {
        // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, value, this.filterConfig, true, false,this.SelectedStageId);
      }
       });
    this.commonserviceService.onjobDrawerChange.subscribe(res => {
        if(res!=null){
         this.headerExpand=!res;
        }
       });
    this.getTimeZone();
    this.routes.queryParams.subscribe((parmsValue) => {
      // if(this.oldTabIndex != this.selectedTabIndex){
      this.selectjobcatparam = parmsValue.filter;
      this.selectjob = parmsValue.selectjob;
      // }
    });

    this.listModeObj =  {
      JobId: this.JobId,
      GridId: this.GridId,
      JobFilterParams: this.filterConfig,
      Search: this.searchValue,
      PageNumber: this.pageNum,
      PageSize: this.pagesize,
      OrderBy: this.sortingValue,
      WorkflowId: this.workflowId,
      Longitude: this.JobLongitude,
      Latitude: this.JobLatitude,
      QuickFilter: this.CountFilter,
      StageId: this.SelectedStageId
    }


    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user Share Notes, Recent Activity, Documents via Protected mode and Internal share, it should redirects user to that particular Note, Recent Activity and Documents -->
        this.routes.queryParams.subscribe((value) => {          
    // @Who: Bantee Kumar,@Why:EWM-11603,@When: 14-july-2023,@What:On View Candidate Summary side overlay screen, when user clicks on Summary, Resume, Job, etc. from title bar, then on job detail page sections changes from Candidates to Search Candidates, Notes and so on. -->
      if(this.oldTabIndex != this.selectedTabIndex){
      if(value.tabIndex==1){
        this.selectedTabIndex=1;
        this.isActiveSearchCandidate = true;
        this.isActiveNotes = false;
        this.isJobLog = false;
        this.isRecentActivity = false;
        this.showJobDocuments = false;
      }else if(value.tabIndex==2){
      this.isRecentActivity = true
      this.loading = false;
      this.loader = false;
      this.isActiveNotes = false;
      this.isJobLog = false;
      this.showJobDocuments = false;
      this.isActiveSearchCandidate = false;
      this.selectedTabIndex=2;
      }else if(value.tabIndex==3){
        this.isActiveNotes = true;
      this.isActiveSearchCandidate = false;
      this.isJobLog = false;
      this.isRecentActivity = false;
      this.showJobDocuments = false;
      this.selectedTabIndex=3;
      }else if(value.tabIndex==4){
        this.isJobLog = true;
      this.isActiveSearchCandidate = false;
      this.isActiveNotes = false;
      this.isRecentActivity = false;
      this.showJobDocuments = false;
      this.selectedTabIndex=4;
      }else if(value.tabIndex==5){
        this.isJobLog = false;
      this.isActiveSearchCandidate = false;
      this.isActiveNotes = false;
      this.isRecentActivity = false;
      this.showJobDocuments = true;
      this.selectedTabIndex=5;
      }else if(value.tabIndex==6){
        this.isManageJobPosted=true;
        this.isJobLog = false;
        this.isActiveSearchCandidate = false;
        this.isActiveNotes = false;
        this.isRecentActivity = false;
        this.showJobDocuments = false;
        this.selectedTabIndex=6;
      }else if(value.tabIndex==7){
        this.CallTab=true;
        this.isJobLog = false;
        this.isActiveSearchCandidate = false;
        this.isActiveNotes = false;
        this.isRecentActivity = false;
        this.showJobDocuments = false;
        this.selectedTabIndex=7;
      }
      else{ this.isJobLog = false;
        this.isActiveSearchCandidate = false;
        this.isActiveNotes = false;
        this.isRecentActivity = false;
        this.showJobDocuments = false;
        // <!---------@When: 06-12-2022 @who:Adarsh singh @why: EWM-9760 --------->
        this.viewMode = 'cardMode';
        // End
       //this.jobActionStatus = false;   // <!---------@When: 12-04-2023 @who:Suika @why: EWM-11861--------->
      //this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
        this.selectedTabIndex = 0;
      }
     }
     })
     this.getEmailForwarding();
     this.commonserviceService.jobDrawer.next(true);
     this.commonserviceService.ChangeStatusObj.subscribe((data:any)=>{ //who:maneesh,what:ewm-11774 for update data when,22/09/2023
      if (data=='editOwnerContactData') {
        this.getCandidateMappedJobHeader(this.JobId);
      }
    })
    // localStorage.setItem('viewMode', this.viewMode); /*****@Who:maneesh @Why:Ewm-11774  @When:23-09-2023 */
    /*****@Who:Renu @Why:Ewm-12861 ewm-12891 @When:29-06-2023 */
    //this.checkIfDatabaseExists();
    this.getFilterConfig(true);
    this.EOHIntegrationObj = JSON.parse(localStorage.getItem("EOHIntegration"));
    this.commonserviceService.updateActivityCountJobSummery.subscribe(value => { //by maneesh ewm-16995
      if (value==true) {
      this.getEmployeeActivityCount();
      }
        });
        this.commonserviceService.refreshchildSource.subscribe(res => {
          if (res?.childSource==true) {
            let data=JSON.parse(localStorage.getItem('jobdetailsHeaderDetails'));
            if (data!=null && data!=undefined) { //by maneesh
              this.JobId =data?.JobDetails?.Id;   
              }
            this.countVxtCall();
          }
        });

        const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople);
        this.EOHLogo=filteredBrands[0]?.logo;
  }
 


  onIndexDBHandlerGrid(ind){
    sessionStorage.setItem(JobDetailLocalCalculationName.LIST_COUNT, ind);
  }
  onIndexDBHandlerCard(ind){
    sessionStorage.setItem(JobDetailLocalCalculationName.CARD_COUNT, ind);
  }
  isDatabaseExist
  // async checkIfDatabaseExists(): Promise<void> {
  //   this.isDatabaseExist = await this.indexBDService.doesDatabaseExist('jobdetailsCard');
  //   if(this.isDatabaseExist){
  //     this.indexBDService.getTableData('jobdetailsCard','cardview').then(data => {
  //       let result =data[0];
  //         this.stages =  data;
  //       });
  //   }else{
  //     this.getFilterConfig(true);
  //   }
  // }
  closeDynamicFilterArea() {
    this.dynamicFilterArea = false;
  }
  openDynamicFilterArea() {
    this.dynamicFilterArea = true;
  }
  headerExpandCollapse() {
    this.headerExpand = !this.headerExpand;
    if(this.headerExpand===true){
      this.hideChartOnHeaderCollpase= true
    }else{
      this.hideChartOnHeaderCollpase= false
    }
  }
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if ((element.nodeName === 'TD' || element.nodeName === 'TH') && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
    } else {
      this.tooltipDir.hide();
    }
  }
  isNotSort: boolean = false;
  public sortChange($event) {
    this.pageNum=1;
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null || this.sortDirection == undefined) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = $event[0].field + ',' + this.sortDirection;
    }
    if ($event[0].field == 'mappedwithfolder') {
      this.isNotSort = true;
    } else if ($event[0].field == 'resume') {
      this.isNotSort = true;
    } else {
      this.isNotSort = false;
    }
    if (this.isNotSort != true) {
      this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
    }
  }
  loader = false;
  candidateMappedJobCount:number = 0;
  getCandidateListByJob(pagesize: any, pageNum: any, sortingValue: string, searchValue: any, filterConfig: any, isSearch: boolean, isScroll: boolean,StageId) {
    setTimeout(() => {
        if (this.Source) {
          this.commonMethodeGetData = {
            Type: CommonMethodeType.REALOAD_FILTER_STAGES,
            Source : this.SelectedStageId,
            stagesList: this.stagesList,
            stages: this.stages,
            JobFilterParams: this.filterConfig
          }
        }
        else{
          this.listViewPage?.performActionEventWise(EventType.REFRESH);
        }
      }, 300);

    return;
    const formdata = {
      JobId: this.JobId,
      GridId: this.GridId,
      JobFilterParams: filterConfig,
      search: searchValue,
      PageNumber: pageNum,
      PageSize: pagesize,
      OrderBy: sortingValue,
      WorkflowId:this.workflowId,
      Source:this.Source,
    }
    // <!---------@When: 05-07-2023  EWM-12896 -@who:Adarsh singh:--------->
    if (this.JobLongitude==null || this.JobLongitude=='') {  //who:maneesh,ewm-11774 add latitude and longnitude,when:20/09/2023
      formdata['Longitude'] = 0
    } else{
      formdata['Longitude'] = parseFloat(this.JobLongitude)
    }
    if (this.JobLatitude==null || this.JobLatitude=="") {
      formdata['Latitude'] = 0
    } else{
      formdata['Latitude'] = parseFloat(this.JobLatitude)
    }
    if (this.CountFilter) {
      formdata['QuickFilter'] = this.CountFilter
    }
    if(StageId!=''){
      formdata['StageId']=StageId
    }
    if (!isSearch) {
      // this.loading = true;
      if (this.loaderStatus === 1) {
        this.loadingAssignJobSaved = true;
      } else if (isScroll) {
        this.loading = false;
        this.loader = false;
      } else {
        this.loading = true;
        this.loader = true;
      }
    }
   this.AllCandidateJobMappingObs= this._service.getAllCandidateJobMapping(formdata).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          // this.gridListData = data.Data;
          if (isScroll) {
            let nextgridView = [];
            nextgridView = data['Data'];
            if(this.gridColConfigStatus){
              this.fitColumns();
            }
            this.gridListData = this.gridListData.concat(nextgridView);
          } else {
            if(this.gridColConfigStatus){
              this.fitColumns();
            }
            this.gridListData = data.Data;
          }
          this.gridListData?.forEach(res=>{
            res.CheckboxStatus = false;
          })
            /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064,@what:For showing auto fit--*/
            if(this.gridColConfigStatus){
              this.fitColumns();
            }
            this.allComplete = false;
            this.IsIntermediate = false;
            this.gridListData?.forEach(v => {v.IsIntermediate = false;});
            this.selectedCandidates = [];
          this.totalDataCount = data.TotalRecord;
          this.loading = false;
          this.loader = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.loadingAssignJobSaved = false;
         // this.getWorkFlowStagesForClient(this.workflowId);
          // this.getAllEmailIdFromMappedJob(data.Data);
          if (data.Data==null) {
            this.candidateMappedJobCount = 0;
          }else{
            this.candidateMappedJobCount = data.TotalRecord;
          }
          this.showHideDocumentButtons = false;
        }else if(data.HttpStatusCode === 204) { /*--@when:04-10-2023,@why:14575,@who: Nitin Bhati--*/
        this.gridListData =data.Data;
        this.loading = false;
        this.loader = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.loadingAssignJobSaved = false;
        //this.filterCount = 0; /*--@when:19-10-2023,@why:14875,@who: Nitin Bhati--*/
        this.showHideDocumentButtons = false;
      }
        else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
          this.loader = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.loadingAssignJobSaved = false;
          this.filterCount = 0
          this.showHideDocumentButtons = false;
        }
      }, err => {
        this.loading = false;
        this.loader = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.loadingAssignJobSaved = false;
        this.filterCount = 0
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  switchListMode(viewMode) {
    /***@Why:EWM-16622 EWM-16974 @Who: Renu @What: to notify the updated count */
     this.commonMethodeGetData = {
                Type: CommonMethodeType.REALOAD_PIECHART_FROM_HEADER,
                Source : this.Source,
                stagesList: this.stagesList,
                stages: this.stages,
              }
    this.showHideDocumentButtons = false;
    this.SelectedStageId = '';
    if (viewMode === 'cardMode') {
    this.onIndexDBHandlerGrid(0);
      this.selectedCandidates = [];
      this.viewMode = "cardMode";
      localStorage.setItem('viewMode', this.viewMode);/*****@Who:maneesh @Why:Ewm-11774  @When:23-09-2023 */
      this.isCardMode = true;
      if (this.WorkflowId != '' && this.WorkflowId != undefined) {
        // if (this.candidates?.length === 0) {
              this.checkDataInsideIndexDB()
          // this.getWorkFlowStages(this.WorkflowId);
        // }
      }
      
    } else {
    this.onIndexDBHandlerCard(0);
      this.selectedCandidates = [];
      this.viewMode = "listMode";
      localStorage.setItem('viewMode', this.viewMode);/*****@Who:maneesh @Why:Ewm-11774  @When:23-09-2023 */
      this.allComplete = false;
      // if (this.gridListData?.length===0) {
        // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
        // }
        
      this.isCardMode = false;
      
    }
    localStorage.setItem('PageMode', viewMode === 'cardMode' ? 'Card': 'List');
  }
  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }
  /*
 @Type: File, <ts>
 @Name: openManageAccessModal
 @Who: Nitin Bhati
 @When: 16-Sep-2021
 @Why: EWM-2861
 @What: to open quick add Manage Access modal dialog
*/
  openCandidateJobMappedModal() {
    const dialogRef = this.dialog.open(CandidateJobMappedComponent, {
      maxWidth: "1000px",
      //data:{},
      data: new Object({ jobId: this.JobId, jobName: this.JobName }),
      width: "100%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'add_manageAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == false) {
        // this.updatedata.emit(false);
      }
    })
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
      data: new Object({ jobdetailsData:dataItem,JobId: this.JobId,JobName:this.JobName, StatusData: dataItem }),
      width: "90%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.dataChangeStatus=true;
        this.getCandidateMappedJobHeader(this.JobId);
        this.candidates = [];
        this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === dataItem.CandidateId) , 1);
        if (this.viewMode == 'cardMode') {
          this.getJobsummaryHeaderSourcepichart();
          this.getWorkFlowStages(this.workflowId);
         // this.checkParentStage(dataItem);
        } else {
          this.getJobsummaryHeaderSourcepichart();
          this.getWorkFlowStages(this.workflowId);
          this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
          this.updateAllComplete();
        }
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
  /*
 @Type: File, <ts>
 @Name: openDrawerWithBg
 @Who: Anup Singh
 @When: 28-Sept-2021
 @Why:EWM-2870 EWM-2990
 @What: to open Drawer
*/
  public matDrawerBgClass;
  openDrawerWithBg(value) {
    this.matDrawerBgClass = value;
    this.hidecomponent = false;
    this.iscandidateJob = false;
    this.isJobDetailsView = false;
    this.isMapApplicationForm = false;
    this.isShareJobApplicationUrl = false;
    this.isSmsHistoryForm = false;
    if (this.matDrawerBgClass) {
      this.openMapApplicationForm();
    }
  }
  /*
    @Type: File, <ts>
    @Name: openjobDetailsView
    @Who: Anup Singh
    @When: 28-Sept-2021
    @Why:EWM-2870 EWM-2990
    @What: for child component load when click job details view
  */
  isJobDetailsView: boolean = false;
  openjobDetailsView() {
    //--@When:18-July-2023,@why:EWM-11815, @who:Nitin Bhati, calling funtion for RTL showing overlay Job Details view
    this._rtlService.onOverlayDrawerRTLHandler();
    this.isJobDetailsView = true
    this.overlayViewjob=!this.overlayViewjob;
   }
  hidecomponent = false;
  candidate(value, cdata) {
    this.oldTabIndex = this.selectedTabIndex;
    this._rtlService.onOverlayDrawerRTLHandler();
    this.overlayCandidateSummary=!this.overlayCandidateSummary;
    this.matDrawerBgClass = value;
    this.candidateIdData = cdata
    this.hidecomponent = true;
   /*** @When: 27-03-2023 @Who:Renu @Why: EWM-11413 EWM-11497 @What: new param added to router for job edit**/
   if (this.routes.snapshot.queryParams['Type']==undefined) {
    this.route.navigate([], {
      queryParams: {
        Type: 'CAND'
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: true
      // do not trigger navigation
    });
}
  }
  /*
    @Type: File, <ts>
    @Name: closeJobview
    @Who: Satya Prakash Gupta
    @When: 14-Dec-2022
    @Why: EWM-9617 EWM-9869
    @What: for close the fullscreen drawer
  */
  closeJobview(value){
     this.matDrawerBgClass = value;
    this.isJobDetailsView = false;
    this.isClientDetailView = false;
    this.overlayViewjob=!this.overlayViewjob;
    if(localStorage.getItem('JobDetailsReload')=='true'){
      this.getCandidateMappedJobHeader(this.JobId);
      localStorage.removeItem('JobDetailsReload');
      localStorage.removeItem('PageSource');
    }
  }
  closeCandidateSummary(value){
    this.oldTabIndex = null;
    this.matDrawerBgClass = value;
    this.hidecomponent = false;
    this.isClientDetailView = false;
    this.overlayCandidateSummary=!this.overlayCandidateSummary;
    if(localStorage.getItem('JobDetailsReload')=='true'){
      this.getCandidateMappedJobHeader(this.JobId);
      localStorage.removeItem('JobDetailsReload')
      localStorage.removeItem('PageSource');
    }
  }
  closeMappApplicationForm(value){
    this.matDrawerBgClass = value;
    this.isJobDetailsView = false;
    this.isClientDetailView = false;
    this.overlayMappApplicationForm=!this.overlayMappApplicationForm;
  }
  closeShareJobApplicationForm(value){
    this.matDrawerBgClass = value;
    this.isJobDetailsView = false;
    this.isClientDetailView = false;
    this.overlayShareJobApplicationForm=!this.overlayShareJobApplicationForm;
  }
  closeClientDetail(value){
    this.matDrawerBgClass = value;
    this.isJobDetailsView = false;
    this.isClientDetailView = false;
    this.overlayClientDetail=!this.overlayClientDetail;
  }
  fullDate:string;
  isExpiredJob:boolean;
  reversecounter() {
    const timer = setInterval(() => {
      let now = new Date().getTime();
      // Find the distance between now and the count down date
      // let distance = new Date(this.expiryDate).getTime() - now;
      let distance = Math.round(this.expiryDate) - now;
      // Time calculations for days, hours, minutes and seconds
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.abs(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes = Math.abs(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      this.seconds = Math.abs(Math.floor((distance % (1000 * 60)) / 1000));
        // <!---------@When: 14-03-2023 @who:Adarsh singh:--------->
      this.fullDate = `(${this.days}d ${this.hours}h:${this.minutes}m:${this.seconds}s)`
      // If the count down is finished, write some text
      if (distance < 0) {
        // <!---------@When: 14-03-2023 @who:Adarsh singh:--------->
        let now = new Date(+this.expiryDate);
        let getDateFormat = localStorage.getItem('DateFormat');
        /*--@When:12-05-2023,@who:Nitin Bhati,@why:12409, moment required uppercase dateformat:------*/
        let getDateFormatUpperCase = getDateFormat.toUpperCase();
        let dateString = moment(now).format(getDateFormatUpperCase);
        this.fullDate = `Job Expired On (${dateString})`;
        this.isExpiredJob = true;
         clearInterval(timer);
        //  End
      }
    }, 1000);
  }
  pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData?.length) {
      this.pageNum = this.pageNum + 1;
      this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, true,this.SelectedStageId);
    } else {
      this.loadingscroll = false;
    }
  }
  /*
  @Type: File, <ts>
  @Name: getCandidateMappedJobHeader function
  @Who: Nitin Bhati
  @When: 04-Oct-2021
  @Why: EWM-3144
  @What: For showing Candidate mapped job Header data
 */
  getCandidateMappedJobHeader(JobId) {
    // this.loading = true;
    if (this.loaderStatus === 1) {
      this.loadingAssignJobSaved = true;
    } else {
      this.loadingHeader = true;
    }
   this.JobHeaderDetailsObs= this.quickJobService.getJobHeaderDetails(JobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loadingHeader = false;
          this.loadingAssignJobSaved = false;
          this.headerListData = repsonsedata.Data;
        sessionStorage.setItem('JobCallLogDatass',JSON.stringify(this.headerListData?.HeaderAdditionalDetails) ); //by maneesh           
          this.EmailsAndPhonesData = this.headerListData?.HeaderAdditionalDetails?.ListCompanyContact;
          this.jobContactDetailsArr = this.headerListData?.HeaderAdditionalDetails?.ListCompanyContact;
          this.skillData = this.headerListData?.HeaderAdditionalDetails?.Skills;
          this.largeSkill = this.headerListData?.HeaderAdditionalDetails?.Skills;
          this.getResponseEmailPhone = this.headerListData?.HeaderAdditionalDetails;
          let itemss = this.headerListData?.HeaderAdditionalDetails?.ListCompanyContact.slice(0, 2);
          this.largeEmailsAndPhonesData = itemss;
          let threeDotItemsEmailPhone =  this.EmailsAndPhonesData?.slice(2, this.EmailsAndPhonesData?.length);
          this.smallEmailsAndPhonesData = threeDotItemsEmailPhone;
          this.HeaderCount = this.headerListData.HeaderCount;
          this.JobDetails = this.headerListData?.HeaderDetails?.JobDetails;
          localStorage.setItem('jobdetailsHeaderDetails',JSON.stringify(this.headerListData?.HeaderDetails) ); //by maneesh           
          let JobTitleSet='Job | '+this.JobDetails?.JobTitle;
          this.JobExpiryDays=this.JobDetails?.JobExpiryDays;
          this.titleService.setTitle(JobTitleSet);
          let obj = {
            Type: CommonMethodeType.HEADER_DETAILS,
            stagesList: this.stagesList,
            stages: this.stages,
            rejectedStage: '',
            JobDetailsHeader: this.JobDetails,
            DefaultConfig:  this.listModeObj
          }
          this.commonMethodeGetData = obj;

          this.JobName = this.headerListData?.HeaderDetails?.JobDetails?.JobTitle;
          this.WorkflowId = this.headerListData?.HeaderDetails?.JobDetails?.WorkflowId;
          this.StageDetailsObj.WorkflowId = this.headerListData?.HeaderDetails?.JobDetails?.WorkflowId;
          this.StageDetailsObj.WorkflowName = this.headerListData?.HeaderDetails?.JobDetails?.WorkflowName;
          this.StageDetailsObj.JobId = this.JobId;
          this.StageDetailsObj.JobTitle = this.headerListData?.HeaderDetails?.JobDetails?.JobTitle;
       // @suika @EWM-13813 @whn-31-08-2023
          this.jobDetails.JobId =  this.JobId;
          this.jobDetails.JobName =  this.headerListData?.HeaderDetails?.JobDetails?.JobTitle;
          this.jobDetails.WorkflowId =  this.headerListData?.HeaderDetails?.JobDetails?.WorkflowId;
          this.jobDetails.WorkflowName =  this.headerListData?.HeaderDetails?.JobDetails?.WorkflowName;
          this.WorkflowName = this.headerListData?.HeaderDetails?.JobDetails?.WorkflowName;
          this.OwnersList = this.headerListData?.HeaderDetails?.JobDetails?.OwnersList;
          this.PrimaryOwner=this.headerListData?.HeaderDetails?.JobDetails?.PrimaryOwner;
          this.IsApplicationFormAvailable = this.headerListData?.HeaderDetails?.JobDetails?.IsApplicationFormAvailable;
          this.isClientId = this.headerListData?.HeaderDetails?.JobDetails?.ClientId;
          this.applicationFormId = this.headerListData?.HeaderDetails?.JobDetails?.ApplicationFormId;
          this.applicationFormURL = this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.JobId+'&domain='+this.subdomain+'&applicationId='+this.applicationFormId+'&Source='+this.ParentSource+'&parentSource='+this.ParentSource;
          // send data for job document share
          this.candidateService.setCandidateName(this.JobName);
          this.smallScreenTagDataOwner = 0;
          let items = this.OwnersList?.slice(0, 10);
          let threeDotItemsOwner = this.OwnersList?.slice(10, this.OwnersList?.length);
          this.largeScreenTagOwner = true;
          this.mobileScreenTagOwner = false;
          this.MobileMapTagSelectedOwner = [];
          this.largeScreenTagDataOwner = items;
          this.smallScreenTagDataOwner = threeDotItemsOwner;
          this.OwnerName = this.headerListData?.HeaderDetails?.JobDetails?.OwnerName;
          this.expiryDate = this.headerListData?.HeaderDetails?.JobDetails?.ExpireIn;
          this.JobStatus = this.headerListData?.HeaderDetails?.JobStatus;
          this.jobStatuslength = this.headerListData?.HeaderDetails?.JobStatus?.length - 1;
          var currentSatausfilter = this.JobStatus?.filter(x => x['CurrentStatus'] === 1);
          this.StageDetailsObj.JobStatus = this.JobStatus?.filter(x => x['CurrentStatus'] === 1);
          this.currentStatus = currentSatausfilter[0]?.Name;
          // <!---------@When: 22-12-2022 @who:Adarsh singh @why: EWM-9967 --------->
          this.currentStatusReasonName = currentSatausfilter[0]?.ReasonName;
          //this.JobTags = this.headerListData.JobTags;
          this.JobPostDate = this.headerListData?.HeaderDetails?.JobDetails?.Ageing;
          this.JobLatitude = this.headerListData?.HeaderDetails?.JobDetails?.Latitude;
          this.JobLongitude = this.headerListData?.HeaderDetails?.JobDetails?.Longitude;
          this.jobLocation = this.headerListData?.HeaderDetails?.JobDetails?.Location;
          // <!-- who:maneesh,what:ewm-13861 for disable,when:22/09/2022 -->
          this.IsJobClosed = this.headerListData?.HeaderDetails?.JobDetails?.IsJobClosed;
          // adarsh singh 16-02-18
          this._broadbeanService.onJobHeaderDetails?.next(this.headerListData);
          // var item = this.JobTags.filter(x => x['IsSelected'] === 1);
          // this.tagLength = item.length;
          // if (this.tagLength === 0) {
          //   this.tagLengthStatus = true;
          // } else {
          //   this.tagLengthStatus = false;
          // }
          this.reversecounter();
          this.loadingHeader = false;
         // this.switchListMode(this.viewMode);

         this.checkClientSyncTOEOH();
         this.checkCandidateSyncTOEOH();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          // this.loading = false;
          this.loadingAssignJobSaved = false;
          this.loadingHeader = false;
        }
      }, err => {
        //  this.loading = false;
        this.loadingAssignJobSaved = false;
        this.loadingHeader = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: selectTagList function
    @Who: Nitin Bhati
    @When: 4-Oct-2021
    @Why: EWM-3144
    @What:select tag list
    */
  selectTagList($event: any, tag: any) {
    $event.stopPropagation();
    $event.preventDefault();
    var item = this.JobTags.find(x => x.Id == tag.Id);
    if (item) {
      if (tag.IsSelected == 1) {
        item.IsSelected = 0;
      } else {
        item.IsSelected = 1;
      }
      this.UpdateMapTagList(item);
    }
  }
  /*
    @Type: File, <ts>
    @Name: UpdateMapTagList function
    @Who: Nitin Bhati
    @When: 4-Oct-2021
    @Why: EWM-3144
    @What:update tag list
    */
  UpdateMapTagList(tagData) {
    //this.loading = true;
    let tagUpdateObj = {};
    tagUpdateObj['JobName'] = this.JobName,
      tagUpdateObj['JobId'] = this.JobId,
      tagUpdateObj['Name'] = tagData.Name,
      tagUpdateObj['Id'] = tagData.Id,
      tagUpdateObj['IsSelected'] = tagData.IsSelected
    this.quickJobService.updateJobMappingTagList(tagUpdateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getCandidateMappedJobHeaderTag(this.JobId);
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  /*
  @Name: sortName function
  @Who: Nitin
  @When: 4-Oct-2021
  @Why: EWM-3144
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
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }
  openFilterModalDialog() {
    const dialogRef = this.dialog.open(JobFilterDialogComponent, {
      data: new Object({ GridId: this.GridId, filterObj: this.filterConfig.length==0?null:this.filterConfig }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.allComplete=false; /**********When:07-07-2023 @Why:EWM-12888 EWM-13037 @Who: RENU */
        this.loading = true;
        this.filterCount = res.data?.length;
        let filterParamArr = [];
        res.data?.forEach(element => {
          filterParamArr.push({
            'FilterValue': element.ParamValue,
            'ColumnName': element.filterParam.Field,
            'ColumnType': element.filterParam.Type,
            'FilterOption': element.condition,
            'FilterCondition': 'AND'
          })
        });
        this.loading = true;
        let jsonObjFilter = {};
        this.pageNum = 1;
        jsonObjFilter['JobFilterParams'] = filterParamArr;
        jsonObjFilter['search'] = this.searchValue;
        jsonObjFilter['PageNumber'] = this.pageNum;
        jsonObjFilter['PageSize'] = this.pagesize;
        jsonObjFilter['OrderBy'] = this.sortingValue;
        //jsonObjFilter['WorkflowId']=this.workflowId;
        jsonObjFilter['GridId'] = this.GridId;
        this.filterConfig = filterParamArr;
        // @suika @EWM-05-08-2023 handle wrong api calling on cardview
        if (this.viewMode == 'cardMode') {
          this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
        } else {
          let obj = {
            Type: CommonMethodeType.FILTER_CONFIG,
            stagesList: this.stagesList,
            stages: this.stages,
            rejectedStage: '',
            JobDetailsHeader: this.JobDetails,
            JobFilterParams: this.filterConfig,
            isRefresh: true
          }
          this.commonMethodeGetData = obj;

          // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
        }
      }
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }
  clearFilterData(viewMode): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'jobdetails';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
      if (dialogResult == true) {
        this.filterConfig = [];
        this.filterCount=0;
          // @suika @EWM-05-08-2023 handle wrong api calling on cardview
          if (this.viewMode == 'cardMode') {
            this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
          } else {
            let obj = {
              Type: CommonMethodeType.FILTER_CLEAR,
              stagesList: this.stagesList,
              stages: this.stages,
              rejectedStage: '',
              JobDetailsHeader: this.JobDetails,
              isRefresh: true
            }

            this.commonMethodeGetData = obj;
            // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
          }
        // this.getJobList(this.pagesize,this.pageNum,this.sortingValue,this.searchValue,this.workflowId,JobFilter);
        //  this.getFilterConfig();
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
  public columnsWithAction: any[] = [];
  getFilterConfig(loaderVal:boolean) {
    // this.loading = true
    this.FilterConfigObs=this.jobService.getfilterConfig(this.GridId).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;  /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064--*/
            this.colArr = repsonsedata.Data.GridConfig;
            // @suika @whn 12-03-2023 @whyEWM-11138 handle null;
            this.filterConfig = repsonsedata.Data.FilterConfig!=null?repsonsedata.Data.FilterConfig:[];

            this.filterAlert = repsonsedata.Data.FilterAlert;
            this.quickFilterStatus = repsonsedata.Data.QuickFilter;
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;
            // @suika @EWM-11782 @why for header stage preserve
            this.headerExpand = repsonsedata.Data.Header==1?true:false;
            if(this.headerExpand===true){
              this.hideChartOnHeaderCollpase= true;
            }else{
              this.hideChartOnHeaderCollpase= false;
            }
            this.viewMode = repsonsedata.Data.PageMode=='Card'?'cardMode':'listMode';
            localStorage.setItem('PageMode', repsonsedata.Data.PageMode);

            localStorage.setItem('viewMode', this.viewMode);/*****@Who:Renu @Why:EWM-15127 EWM-15206 @When:23-11-2023 @ehy: viewmode is not set so getting null on page load*/
            // maneesh @EWM-14977 @Desc- get view mode value
            this.viewMode=localStorage.getItem('viewMode');
            // Adarsh singh @EWM-13877 @Desc- Missing assign value
            this.viewMode == 'cardMode' ? this.isCardMode = true : this.isCardMode = false;
            /**@why:EWM-14999 EWM-15000 @Who:Renu @What:Passing a parameter to handle dynamic filter popup on load**/
            this.dynamicFilterArea = false;
            // if (loaderVal || this.filterAlert == 1) {
            //   this.dynamicFilterArea = false;
            // } else {
            //   this.dynamicFilterArea = true;
            // }
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
          this.getStagesOnReload().then(() => {
            let obj = {
              Type: CommonMethodeType.FILTER_CONFIG,
              rejectedStage: '',
              JobDetailsHeader: this.JobDetails,
              JobFilterParams: this.filterConfig,
              stagesList: this.stagesList,
            }
            this.commonMethodeGetData = obj;
          });
          this.checkDataInsideIndexDB();
          // this.getWorkFlowStages(this.workflowId);   /*-@why:EWM-13230,@WHY:For handle multilple APi,@when: 03-Aug-2023-*/
          //this.switchListMode(this.viewMode);
         // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  fetchDataFromNotes(value) {
    if (value == true && this.isCardMode == false) {
      this.loaderStatus = 1;
      this.getCandidateMappedJobHeader(this.JobId);
      //this.getCandidateMappedJobHeaderCount(this.JobId);
      this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
    } else if (value == true && this.isCardMode == true) {
      this.getCandidateMappedJobHeader(this.JobId);
     // this.getCandidateMappedJobHeaderCount(this.JobId);
      this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
    }
  }
  opencandidatejobmapeed() {
    this.iscandidateJob = true;
  }
  isFilter: boolean = false;
  public onFilter(inputValue: string): void {
    //this.pagesize, this.pageNum, this.sortingValue, this.searchValue,this.JobId, this.filterConfig
    //this.loading = false;
    this.isFilter = true;
   // this.loadingSearch = true;
    if (inputValue?.length > 0 && inputValue?.length < 3) {
      this.loadingSearch = false;
      this.allComplete = false;
      this.IsIntermediate = false;
      return;
    }
    this.searchValue = inputValue;

    this.searchSubject$.next(inputValue);
    let searchVal = {
      Type: CommonMethodeType.INPUT_SEARCH,
      stagesList: this.stagesList,
      stages: this.stages,
      JobDetailsHeader: this.JobDetails,
      searchVal: inputValue
    }
    this.commonMethodeGetData = searchVal;

  }
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.allComplete = false;
    this.IsIntermediate = false;
    if (this.isCardMode == true) {
      this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
    } else {
      this.listViewPage?.performActionEventWise(EventType.SEARCH_CLEAR);
      // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
    }
  }
  publishedData() {
      this.publishArr = [];
  }
  backToInitialStage(candidate) {
  }
  /**************************************end***************************************** */
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
          proximity:canData.Proximity
        }),
        panelClass: ['xeople-modal', 'candidateLatLong', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    }
  }
  isResumeUpload: any = [];
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
  /*
     @Type: File, <ts>
     @Name: openNewTabForGoogleMapLocation
     @Who: Anup
     @When: 07-oct-2021
     @Why: EWM-3127 EWM3182
     @What: to open New window Tab For Google Map Location show
   */
  openNewTabForGoogleMapLocation(canData) {
    if ((canData.Latitude != undefined && canData.Latitude != null && canData.Latitude != "") &&
      (canData.Longitude != undefined && canData.Longitude != null && canData.Longitude != "")) {
      let urlloc = "https://www.google.com/maps/place/" + canData.Latitude + ',' + canData.Longitude;
      window.open(urlloc, '_blank');
    } else if (canData.Location != undefined && canData.Location != null && canData.Location != "") {
      let urlloc = "https://www.google.com/maps/place/" + canData.Location;
      window.open(urlloc, '_blank');
    } else {
    }
  }
  /*
 @Type: File, <ts>
 @Name: confirmMailSync
 @Who: Renu
 @When: 06-Oct-2021
 @Why: EWM-2833
 @What: To confirm mail is sync or not
 */
  confirmMailSync(candidateInfo: any, isBulEmail:boolean): void {
    this.mailService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          if (data.Data.IsEmailConnected == 1) {
            this.IsEmailConnected = 1;
          } else {
            this.IsEmailConnected = 0;
          }
          this.getMappedEmails(candidateInfo,this.IsEmailConnected,isBulEmail);
         // this.openMail(candidateInfo, this.IsEmailConnected, isBulEmail);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  openMailSync(candidateInfo: any, isBulEmail:boolean): void {
    this.mailService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          if (data.Data.IsEmailConnected == 1) {
            this.IsEmailConnected = 1;
          } else {
            this.IsEmailConnected = 0;
          }
         this.toEmailList = [];
         this.toEmailList.push({ EmailId:candidateInfo.EmailId, CandidateId:candidateInfo.CandidateId});
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
  @Name: getMappedPhoneNumber
  @Who: Suika
  @When: 27-Sep-2022
  @Why: EWM-7481
  @What: to open template modal dialog
*/
toEmailList:any=[];
getMappedEmails(candidateInfo,IsEmailConnected,isBulEmail) {
  this.loading = true;
  const formdata = {
    JobId: this.JobId,
    GridId: this.GridId,
    JobFilterParams: this.filterConfig,
    search: this.searchValue,
    PageNumber: this.pageNum,
    PageSize: this.pagesize,
    OrderBy: this.sortingValue,
    CountFilter: this.CountFilter,
    Source:this.Source,
  }
  this.systemSettingService.getCandidateMappedBulkemail(formdata).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.toEmailList = [];
        this.toEmailList = repsonsedata.Data;
        this.loading = false;
        this.openMail(candidateInfo, this.IsEmailConnected, isBulEmail);
      }else if(repsonsedata.HttpStatusCode === 204){
        this.toEmailList = [];
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
  /*
  @Type: File, <ts>
  @Name: EmailNotIntegratedPopup
  @Who: Renu
  @When: 06-Oct-2021
  @Why: EWM-2867 EWM-3075
  @What: If mail is not sync then disconnenection popup
  */
  EmailNotIntegratedPopup(): void {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(DisconnectEmailComponent, {
      maxHeight: '85%',
      panelClass: ['DisconnectEmail', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }
  /*
   @Type: File, <ts>
   @Name: openMail
   @Who: Renu
   @When: 04-Oct-2021
   @Why:EWM-2867 EWM-3075
   @What: to open Mail
  */
  openMail(responseData, IsEmailConnected, isBulkEmail:boolean) {
   let subObj = {}
    if (this.viewMode === 'cardMode') {
        subObj = {
        JobName: this.JobName,
        StageName: this.selectedCandidates[0]?.WorkFlowStageName
      }

    this.getCandidateData=[];
    this.getCandidateData?.push({
      "ModuleType": "CAND",
      "Id": responseData[0]?.CandidateId,
      "EmailTo": responseData[0]?.EmailId
    })
    
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
      data: { 'candidateres': responseData, 'IsEmailConnected': IsEmailConnected, 'workflowId': this.workflowId, 'JobId': this.JobId, 'candidateId': this.candidateIdData, 'isBulkEmail': true, 'candiateDetails': this.getCandidateData,'toEmailList':this.toEmailList,openDocumentPopUpFor:'Candidate',multipleEmail: this.multipleEmail,
      isDefaultSubj: true, subjectObj: subObj,'JobTitle': this.JobName,caldidateJobMappedPreviewEmail:this.selectedCandidates[0]?.CandidateId},
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
  /****************************suika**************************************************** */
  /*
   @Type: File, <ts>
   @Name: getWorkFlowStages function
   @Who: Suika
   @When: 06-Oct-2021
   @Why: ROST-3084
   @What: For getting the stages basesd on workflowId
    */
   lastStageIdObj:any;
  getWorkFlowStages(Id) {
    this.loadingStage = true;
   this.JobworkFlowBypipeIdObs= this.jobService.jobworkFlowBypipeId('?workflowId=' + Id + '&countfilter=TotalJobs'  + '&quickfilter=' + this.CountFilter + '&jobId='+ this.JobId+'&source='+this.Source??'').pipe(takeUntil(this.destroy$)).subscribe(
      (data: ResponceData) => {
        this.loadingStage = false;
        if (data.HttpStatusCode === 200) {
          this.stagesList =  data.Data.Stages;
          this.stages = data.Data.Stages;
          //  <!---------@suika @EWM-11782 EWM-12504 Action labels --------->
          let resCount=0;
          this.stages?.forEach((v,i)=> {
            v.CheckboxStatus = false;
            if (v?.IsLastStage === 1) {
              this.lastStageIdObj = v;
              v['lastStage'] = true;
            }
            resCount=resCount+v.Count;
          });
          this.candidateMappedJobCount=resCount;
          this.stagesList = data.Data.Stages;
          let firstStage = this.stagesList.filter(e=> e.SerialNumber === 1);
          let isRejectedStage = this.stagesList.filter(e=> e.IsRejectedStage === true);
          this.firstStageData = firstStage[0];
          isRejectedStage?.length > 0 ? this.isAnyRejectedStageTypeListView = true : this.isAnyRejectedStageTypeListView = false;
          isRejectedStage?.length > 0 ? this.isAnyRejectedStageType = true : this.isAnyRejectedStageType = false;
          let StageVisibilityLength =this.stagesList?.filter(res=>res.StageVisibility==1);
          this.StageVisibilityCount = StageVisibilityLength?.length;
          let stagesListObje = {
            Type: CommonMethodeType.GET_ALL_STAGES,
            stagesList: this.stagesList,
            stages: this.stages,
            rejectedStage: isRejectedStage,
            JobDetailsHeader: this.JobDetails
          }
          this._JobIndexDbService.setDataInStorage(JobDetailIndexDBCard.ALL_STAGE_LIST, this.stagesList)
          if (!this.isQuickFilterApply) {
            this.commonMethodeGetData = stagesListObje;
          }


          if (this.stages?.length > 0) {
            if (this.viewMode === 'cardMode' ) {
              // this.checkDataInsideIndexDB()
              this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
            }else{
              if (this.isQuickFilterApply) {
                this.commonMethodeGetData = {
                Type: CommonMethodeType.REALOAD_FILTER_STAGES,
                CountFilter : this.CountFilter?this.CountFilter:'All',
                stagesList: this.stagesList,
                stages: this.stages,
                JobFilterParams: this.filterConfig,
                Source:this.Source??'' /***@Why:EWM-16622 EWM-16974 @Who: Renu @What: addedd updated source***/
              }
              }

            }
          }
        } else {
          this.loadingStage = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loadingStage = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  stagesCount:{totalStageCount:string | number, lastStageCount: string | number};
  getCandidatemappedtojobcardAll(pagesize: any, pageNum: any, sortingValue: string, searchValue: any, filterConfig: any) {
    this.loadingData = "label_job_details_candidates_loading";
    if (this.isFilter == false) {
      this.loading = true;
    }
    const formdata = {
      JobId: this.JobId,
      GridId: this.GridId,
      JobFilterParams: filterConfig,
      search: searchValue,
      PageNumber: pageNum,
      PageSize: pagesize,
      OrderBy: sortingValue,
      Source:this.Source,
      WorkflowId:this.workflowId,
      ByPassPaging:false,
      QuickFilter:this.CountFilter?this.CountFilter:'All',
      StageId:''
    }
    let len:any;
    let stagesCount: {totalStageCount:string | number, lastStageCount: string | number};
    stagesCount = {
      totalStageCount: 0,
      lastStageCount: 0
    }
    this.stagesCount = {
      totalStageCount: 0,
      lastStageCount: 0
    }
    // len = ['totalStageCount'] = this.stages?.length
    stagesCount.totalStageCount = this.stages?.length;
    this.stages?.forEach((res,i) => {
      res['StageDisplaySeq'] = res.SerialNumber;
      res['CheckboxStatus'] = false;
      res['IsIntermediate']=false;
    let copyReq = Object.assign({}, formdata);
    copyReq.StageId = res.InternalCode;
    if(res.StageVisibility==0){
      this.HideStageIds.push(res.InternalCode);
    }
    this.HideStageIds = this.HideStageIds.filter((n, i) =>  this.HideStageIds.indexOf(n) === i);
    stagesCount.lastStageCount = ++i
    this.forkApiCallRequest(copyReq,false,++i );
    });
    this.stagesCount = stagesCount;
  }
  forkApiCallRequest(req: CandidateStageResp,status: boolean,lastStageCount:number){
            let indexOf= this.stages.findIndex(x=>x.InternalCode === req?.StageId);
            if ( this.CandidatemappedtojobcardAllObs && status ) {
              this.CandidatemappedtojobcardAllObs.unsubscribe();
           }
            this.CandidatemappedtojobcardAllObs= this.jobService.getCandidatemappedtojobcardAllV2(req).pipe(takeUntil(this.destroy$)).subscribe(
            (repsonsedata: ResponceData) => {
              this.scrolledStage=null;
            if (repsonsedata.HttpStatusCode === 200) {
              repsonsedata.Data?.forEach(can => {
              can['StageName'] = this.stages[indexOf].StageName;
              can['StageType']=this.stages[indexOf].StageType;   // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
              can['StageId'] = this.stages[indexOf].InternalCode;
              can['StageDisplaySeq'] = can.StageDisplaySeq;
              can['Candidateloader'] = false;
              // <!---------@suika @EWM-11782 EWM-12504 Action labels --------->
              can['CheckboxStatus'] = false;
            });
            if(status){
              let  newObj =repsonsedata.Data;
              this.stages[indexOf]['candidates'] = this.stages[indexOf]['candidates'].concat(newObj);
            }else{
              this.stages[indexOf]['candidates']=repsonsedata.Data;
            }
          this.stages[indexOf]['candidatesCount'] =JSON.parse(JSON.stringify(repsonsedata.TotalRecord));
            this.stages[indexOf].isDisabled=false;
            this.stages[indexOf].TotalPages=repsonsedata?.TotalPages;
            this.stages[indexOf].PageNumber=req?.PageNumber;
            // this.indexBDService.SetData('jobdetailsCard','cardview',this.stages);
            // End
            this.loading = false;
            this.loadingSearch = false;
            this.selectedCandidates = [];
            setTimeout(() => {
              this.loadingData = "label_no_candidates";
            }, 1500);
            this.showHideDocumentButtons = false;
            // setTimeout(() => {
            // if(status){
            //   let scrollIndex =   repsonsedata.Data?.length/2;
            //   this.viewport?.toArray()[indexOf].scrollToIndex(scrollIndex,'smooth');
            // }
            // },200);

          }
            else if (repsonsedata.HttpStatusCode === 204) {
                this.loadingData = "label_no_candidates";
               // this.candidateMappedJobCount = 0;
                this.stages[indexOf]['candidates']=[];
                this.stages[indexOf]['isDisabled']=false;
                this.stages[indexOf]['candidatesCount']=0;
                this.loadingSearch = false;
                // this.stages?.forEach(res => {
                // res.candidates = [];
                // res.candidatesCount = 0;
                // res.isDisabled = false;
                // this.loadingSearch = false;
                // });
                this.loading = false;
                this.showHideDocumentButtons = false;
            }
            else {
                this.loadingData = "label_no_candidates";
                this.filterCount = 0
                this.loading = false;
                this.showHideDocumentButtons = false;
            }
            if (lastStageCount === this.stages?.length) {
              this._JobIndexDbService.setDataInStorage(JobDetailIndexDBCard.DB_NAME,this.stages);
            }
            }, err => {
                if (err.StatusCode == undefined) {
                this.filterCount = 0
                this.loading = false;
              }
            })
  }
  
  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Suika
   @When: 05-Oct-2021
   @Why: EWM-2868 EWM-3084
   @What:  This page will be use for the drag drop card view
 */
  backdropBox(event: CdkDragDrop<{}[]>) {
    if (event.previousContainer == event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
    }
    this.jobService.pageDataChangeStatus(true);
    this.stages?.forEach(res => {
      res.isDisabled = false;
      res.candidates=[...res.candidates];
      //res.candidatesCount = res.candidates?.length;
     // res.Count = res.candidates?.length;
    })
  }
  drop(event: CdkDragDrop<{}[]>, stageName, stageId, StageDisplaySeq,index:number,candidates,stageType) {
    let tempData =event.previousContainer.data;
    const tempindex = event.previousContainer.data.findIndex(candidate => candidate === this.tempcan);
    
    if (event.previousContainer == event.container) {
      moveItemInArray(event.container.data,  event.previousContainer.data.indexOf(event.item.data), event.container.data.indexOf(event.item.data));
      this.stages[index].candidates=[...this.stages[index]?.candidates]
    } else {
     
      transferArrayItem(event.previousContainer.data, event.container.data, tempindex, event.currentIndex);
      this.changeDetectorRef.markForCheck();
      this.dataChangeStatus=true;
 // Use setTimeout to trigger change detection
 setTimeout(() => {
  this.changeDetectorRef.detectChanges();
});
      this.checkDropStageValid(event, event.container.data[event.currentIndex], StageDisplaySeq, stageName, stageId,stageType);
    }
    this.jobService.pageDataChangeStatus(true);
    this.stages?.forEach(res => {
      res.isDisabled = false;
     // res.candidates=[...res.candidates]
     // res.candidatesCount = res.candidates?.length;
      //res.Count = res.candidates?.length;
    })

  }
  candidateCount(candidateArray) {
    if (candidateArray != undefined) {
      return candidateArray?.length;
    } else {
      return 0;
    }
  }
  tempcan='';
  dragStart(ev, StageDisplaySeq,can) {
    this.tempcan =can;
    this.stages?.forEach(res => {
      if (res.StageDisplaySeq < StageDisplaySeq) {
        res.isDisabled = true;
      }
    })
  }
  checkDropStageValid(event: CdkDragDrop<{}[]>, dropData, newStageOrder, stageName, stageId, stageType) {
    if (dropData != undefined) {
      let oldStageOrder = dropData.StageDisplaySeq;
      if (newStageOrder > oldStageOrder) {
        this.onUpdate(event, dropData, stageName, stageId, newStageOrder,stageType);
        return true;
      } else {
        //this.backdropBox(event);
        this.onUpdate(event, dropData, stageName, stageId, newStageOrder,stageType);
        return false;
      }
    }else{
      this.backdropBox(event);
    }
  }
  changeCurrentStage(dropElement, stageName, stageId, newStageOrder,stageType) {
    if (dropElement != undefined) {
      dropElement.WorkFlowStageName = stageName;
      dropElement.WorkFlowStageId = stageId;
      dropElement.StageName = stageName;
      dropElement.StageId = stageId;
      dropElement.StageDisplaySeq = newStageOrder;
      dropElement.StageType=stageType;  // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
      if(dropElement.CheckboxStatus==true){
        dropElement.CheckboxStatus  = false;
        this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === dropElement.CandidateId) , 1);
      }
    }
  }
  onUpdate(event: CdkDragDrop<{}[]>, value, stageName, stageId, newStageOrder,stageType): any {
    this.cardloading = true;
    value.Candidateloader = true;
    let previousStageId = value.WorkFlowStageId;
    let previousStageObj = value;
    let formdata = {};
    formdata['CandidateName'] = value.CandidateName;
    formdata['CandidateId'] = value.CandidateId;
    formdata['JobId'] = this.JobId;
    formdata['JobName'] = value.JobTitle;
    formdata['WorkflowId'] = value.WorkFlowId;
    formdata['WorkflowName'] = this.WorkflowName;
    formdata['PreviousStageId'] = value.WorkFlowStageId;
    formdata['PreviousStageName'] = value.WorkFlowStageName;
    formdata['NextStageId'] = stageId;
    formdata['NextStageName'] = stageName;
    formdata['CurrentStageDisplaySeq'] = value.StageDisplaySeq;
    formdata['NextStageDisplaySeq'] = newStageOrder;
    formdata['JobHeadCount'] = this.headerListData?.HeaderAdditionalDetails?.HeadCount;

    this.candidateMoveActionObs=this.jobService.candidateMoveAction(formdata).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.cardloading = false;
          value.Candidateloader = false;
          value.LastActivity=repsonsedata.Data?.LastActivity;
          this.changeCurrentStage(value, stageName, stageId, newStageOrder,stageType);
          this.getWorkFlowStagesForClient(this.workflowId);
          if (this.selectedCandidates?.length>0) {
            this.showHideDocumentButtons = true
          }else{
            this.showHideDocumentButtons = false
          }
          // @suika EWM-11782 @Whn 02-06-2023
          if(this.viewMode=='listMode'){
            this.updateAllComplete();
          }else{
            this.stages?.forEach(v => {
              v.candidates=[...v.candidates];
              if(previousStageId==v.InternalCode){
                this.checkParentStageMark(v);
              }
            });
          }
          let nextStageId = repsonsedata.Data?.NextStageId;
          const IsLastStage =this.stages.filter(x=>x?.InternalCode===nextStageId)[0]?.IsLastStage;
          if(IsLastStage===1){
            this.xeepService.performAction('eats-cookie');
          }

          const IsRejectedStage =this.stagesList.filter(e=> e.IsRejectedStage === true)[0]?.InternalCode;
          if(IsRejectedStage===nextStageId){
            this.xeepService.performAction('binshot');
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.cardloading = false;
          value.Candidateloader = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.backdropBox(event);
          if(repsonsedata.Message=='400041'){
            // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show 
            this.alertValidationManageAccess(repsonsedata.Data.SkipStageName, repsonsedata.Data.SkipStagePosition);
          }
          else if (repsonsedata.Message === "400058") {
            this.alertMaxCandidateAddInLastStage();
          }
          else if (repsonsedata.Message === "400042") {
            this.refreshCandidateList();
          }
          else{
             this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
           }
          this.cardloading = false;
          value.Candidateloader = false;
        } else {
          this.backdropBox(event);
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.cardloading = false;
          value.Candidateloader = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.backdropBox(event);
          this.cardloading = false;
          value.Candidateloader = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          return false;
        }
      })
  }
  refresh() {
    this.viewport?.toArray().forEach(x=>x.scrollToIndex(0));
    this.Source = '';
    // Who:Ankit Rawat, What:EWM-17802, After reloading the gridview mode, should be highlight the stage filter, When:07Aug24
    if(this.viewMode=='cardMode'){
      this.SelectedStageId = '';
    }
    setTimeout(() => {
      this.listViewPage?.performActionEventWise(EventType.REFRESH);
    }, 400);
    this.selectedCandidates = []
    if (this.isCardMode == true) {
      // this.stages?.forEach(v => {v.CheckboxStatus = false,v.PageNumber=1});
      // this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
    
    } else {
      
      this.allComplete = false;
      // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
    }
    this.getWorkFlowStages(this.WorkflowId);
  }
  /*
     @Type: File, <ts>
     @Name: backToJob
     @Who: Nitin Bhati
     @When: 11-oct-2021
     @Why: EWM-3282  /core/job/job-landingpage/9843f9ec-ce07-42d7-a16c-4f8e9ad922ed?filter=TotalJobs
     @What: For back to job landing page
   */
  backToJob() {
    this.route.navigate(['/client/jobs/job/job-list/list/'+this.WorkflowId, {filter: this.selectjobcatparam}]);
    this.route.navigate(['/client/jobs/job/job-list/list'],
    {queryParams:{Id:this.WorkflowId,filter:this.selectjobcatparam}
    });
    // this.route.navigate(['/client/core/job/job-landingpage/'+this.WorkflowId,{filter:this.selectjobcatparam}]);
  }
  /*
    @Type: File, <ts>
    @Name: openMoveBoxModal
    @Who: Suika
    @When: 28-Sep-2021
    @Why: EWM-3084
    @What: to open quick add Move Box modal dialog
  */
  openMoveBoxModal(dataItem: any) {
    dataItem.JobHeadCount= this.headerListData?.HeaderAdditionalDetails?.HeadCount;
    const IsRejectedStage =this.stagesList.filter(e=> e.IsRejectedStage === true)[0]?.InternalCode;
    this.commonMarkAsReadSingle(dataItem);
    const dialogRef = this.dialog.open(CandidateWorkflowStagesMappedJobdetailsPopComponent, {
      maxWidth: "550px",
      data: { data: dataItem, WorkflowId: this.WorkflowId, WorkflowName: this.WorkflowName, JobId: this.JobId,JobName:this.JobName,IsRejectedStage:IsRejectedStage },
      width: "95%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'add_manageAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        if (this.viewMode == 'cardMode') {
          this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === dataItem.CandidateId) , 1)
          dataItem.IsIntermediate = false;
          dataItem.CheckboxStatus=false;
         // this.checkParentStageMark(dataItem);
         this.dataChangeStatus=true;
          this.getWorkFlowStagesForClient(this.workflowId);
          this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
        } else {
          this.IsIntermediate = false;
          this.getWorkFlowStagesForClient(this.workflowId);
          this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
         }
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
  /**************************************end***************************************** */
  divScroll(e) {
    if (e.srcElement.scrollTop >= 20) {
      this.scrolledValue = e.isTrusted;
    } else {
      this.scrolledValue = false;
    }
  }
  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }
  /*
    @Type: File, <ts>
    @Name: getCandidateMappedJobHeaderTag function
    @Who: Nitin Bhati
    @When: 12-Oct-2021
    @Why: EWM-3144
    @What: For showing Candidate mapped job Header Tag data
   */
  getCandidateMappedJobHeaderTag(JobId) {
    //this.loading = true;
    this.CandidateMappedJobHeadertagsObs = this.quickJobService.getCandidateMappedJobHeadertags(JobId).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.JobTags = repsonsedata.Data;
          this.tagSelecteditem = this.JobTags.filter(x => x['IsSelected'] === 1);
          this.tagLength = this.tagSelecteditem?.length;
          this.mobileMenu(this.tagSelecteditem);
          if (this.tagLength === 0) {
            this.tagLengthStatus = true;
          } else {
            this.tagLengthStatus = false;
          }
          this.reversecounter();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
  @Type: File, <ts>
  @Name: onDragMoved
  @Who: Renu
  @When: 20-Oct-2021
  @Why: EWM-3144
  @What: for auto scroll when card move from left to roght or top to bottom
 */
  onDragMoved(event) {
    if (event.delta.x === 1) {
      this.document.getElementById('kanban-sec').scrollLeft += 10;
    }
    //  else {
    //   this.document.getElementById('kanban-sec').scrollLeft -= 10;
    // }
    if (event.delta.y === 1) {
      this.document.getElementById('kanban-sec').scrollTop += 10;
    } else {
      this.document.getElementById('kanban-sec').scrollTop -= 10;
    }
  }
  /*
  @Type: File, <ts>
  @Name: redirectTo
  @Who: Renu
  @When: 21-Oct-2021
  @Why: EWM-3320 EWM-3344
  @What: redirect ot workflow page
 */
  redirectTo() {
    this._sidebarService.topMenuAciveObs.next('administrators');
    this.route.navigate(['./client/core/administrators/job-workflows/manage'], { queryParams: { id: this.WorkflowId, mode: 'R', jobid: this.JobId, cardJob: this.viewMode } });
  }
  /*
 @Type: File, <ts>
 @Name: getIntegrationCheckSMSstatus function
 @Who: Anup Singh
@When: 16-Dec-2021
@Why: EWM-4210 EWM-4219
 @What: For enable  disable  sms after check status sms
*/
  public isSMSStatus: boolean = false;
  getIntegrationCheckSMSstatus() {
    // this.loading = true;
    this.systemSettingService.getIntegrationCheckstatus(this.burstSMSRegistrationCode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          //  this.loading = false;
          if (repsonsedata.Data) {
            this.isSMSStatus = repsonsedata.Data.Connected;
          }
        } else {
          //  this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
  @Type: File, <ts>
  @Name: openJobSMS
  @Who: Anup Singh
  @When: 16-Dec-2021
  @Why: EWM-4210 EWM-4219
  @What: to open job Sms For Candidate modal dialog
  */
  openJobSMSForCandidate(dataItem) {
  // who:maneesh,what:for fixed send sms parameter key ,when:11/03/2024
    let dataItemObj = {};
    dataItemObj['PhoneNumber'] = dataItem?.PhoneNumber;
    dataItemObj['Name'] = dataItem?.CandidateName;
    dataItemObj['CandidateId'] = dataItem?.CandidateId;
    // dataItemObj['PhoneCode'] = dataItem?.PhoneCode;this line comment becouse phoncode is comming with phonnumber
    dataItem=dataItemObj;
    const dialogRef = this.dialog.open(JobSmsComponent, {
      // maxWidth: "700px",
      data: new Object({ jobdetailsData: dataItem, JobId: this.JobId,JobName:this.JobName,UserType:this.userType }),
     // width: "90%",
     // maxHeight: "85%",
      panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getSMSHistory();
        this.loading = false;
      } else {
        this.loading = false;
      }
      this.smsHistoryToggel = false;
      this.quickFilterToggel=true;
    })
    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }
  zoomCallEnable(phoneNo: any) {
    if (phoneNo) {
      this.createCallLog();
      window.open('zoomphonecall://' + phoneNo, '_blank');
    }
  }
  /*
  @Type: File, <ts>
  @Name: createCallLog function
  @Who: Suika
  @When: 07-July-2022
  @Why: EWM-7401 EWM-7509
  @What: on saving the data client Notes
*/
  createCallLog() {
    this.loading = true;
    let Obj = {};
    Obj['JobId'] = this.JobId;
    Obj['CandidateId'] = this.candidateId;
   this.CreateJobCallLogObs= this.jobService.createJobCallLog(Obj).pipe(takeUntil(this.destroy$))
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
   @Name: fetchEmployeeActivityCount function
   @Who: Nitin Bhati
   @When: 19-Jan-2022
   @Why: EWM-4655
   @What: for Job count when add new Activity
 */
  fetchEmployeeActivityCount(value) {
    if (value == true) {
      this.getEmployeeActivityCount();
      this.sidenav.close();
    }
  }
   // @suika drawer closer @whn 21-03-2023
  closeDrawer(value){
    if (value == true) {
      this.activityStatus=false;
      this.sidenav.close();
    }
  }
  /*
     @Type: File, <ts>
     @Name: getEmployeeActivityCount function
      @Who: Nitin Bhati
     @When: 13-Jan-2022
     @Why: EWM-4545
     @What: for Job count when add new Activity api call
   */
  getEmployeeActivityCount() {
    let currentYear = (new Date()).getFullYear();
    this.candidateService.fetchActivityTotal("?relateduserid=" + this.JobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalActivity = repsonsedata.Data?.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalActivity = repsonsedata.Data?.Count;
          this.loading = false;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
 @Type: File, <ts>
 @Name: toggleDrwer function
 @Who: Adarsh Singh
 @When: 08-April-2022
 @Why: EWM-6033
 @What: toggle assign job drawer
 */
  toggleDrwer(start: any) {
    this.smsHistoryToggel = false;
    this.quickFilterToggel=true;
    start.toggle();
  }
  receivedMessageHandler(p) {
    if (p == false) {
      // asignJob.toggle();
      this.hidecomponent = false;
      this.iscandidateJob = false;
      this.isJobDetailsView = false;
    }
  }
  /*
    @Type: File, <ts>
    @Name: fetchJobNotesCount function
    @Who: Suika
    @When: 13-Mar-2022
    @Why: EWM-4668,EWM-6153
    @What: for notes count when add new notes
  */
  fetchJobNotesCount(value) {
    if (value == true) {
      this.getJobNotesCount();
    }
  }
  /*
     @Type: File, <ts>
     @Name: getJobNotesCount function
     @Who: Suika
     @When: 13-Mar-2022
     @Why: EWM-4668,EWM-6153
     @What: for notes count when add new notes api call
   */
  getJobNotesCount() {
    let currentYear = (new Date()).getFullYear();
    this.FetchJobNotesTotalObs=this.jobService.fetchJobNotesTotal("?jobid=" + this.JobId).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.dataTotalNotes = repsonsedata.Data?.Count;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dataTotalNotes = repsonsedata.Data?.Count;
          this.loading = false;
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  tabClick(tab) {
    this.updatesessiondata();
    this.viewMode == "cardMode" ? this.onIndexDBHandlerCard(tab.index) : this.onIndexDBHandlerGrid(tab.index);
    if (tab.index == 1) {
    this.isActiveSearchCandidate = true;
    this.isActiveNotes = false;
    this.isJobLog = false;
    this.isRecentActivity = false;
    this.showJobDocuments = false;
    this.redirectOnSamePgae(tab);
    }else if(tab.index == 2){
      // this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pageNum);
      // this.getClientYearMonthList();
      // this.onChangeActivityRelatedTo(this.category);
      this.isRecentActivity = true
      this.loading = false;
      this.loader = false;
      this.isActiveNotes = false;
      this.isJobLog = false;
      this.showJobDocuments = false;
      this.isActiveSearchCandidate = false;
      this.redirectOnSamePgae(tab);
    } else if (tab.index == 3) {
      this.isActiveNotes = true;
      this.isActiveSearchCandidate = false;
      this.isJobLog = false;
      this.isRecentActivity = false;
      this.showJobDocuments = false;
      this.isManageJobPosted=false;
      this.redirectOnSamePgae(tab);
    } else if (tab.index == 4) {
      this.isJobLog = true;
      this.isActiveSearchCandidate = false;
      this.isActiveNotes = false;
      this.isRecentActivity = false;
      this.showJobDocuments = false;
      this.redirectOnSamePgae(tab);
    }
    else if (tab.index == 5) {
      this.isJobLog = false;
      this.isActiveSearchCandidate = false;
      this.isActiveNotes = false;
      this.isRecentActivity = false;
      this.showJobDocuments = true;
      this.redirectOnSamePgae(tab);
    }
    else if (tab.index == 6) {
      this.isManageJobPosted=true;
      this.isJobLog = false;
      this.isActiveSearchCandidate = false;
      this.isActiveNotes = false;
      this.isRecentActivity = false;
      this.showJobDocuments = false;
      this.redirectOnSamePgae(tab);
    }
    else if (tab.index == 6) {
      this.CallTab=true;
      this.isJobLog = false;
      this.isActiveSearchCandidate = false;
      this.isActiveNotes = false;
      this.isRecentActivity = false;
      this.showJobDocuments = false;
      this.redirectOnSamePgae(tab);
    }
    else {
      this.isJobLog = false;
      this.isActiveSearchCandidate = false;
      this.isActiveNotes = false;
      this.isRecentActivity = false;
      this.showJobDocuments = false;
      // <!---------@When: 06-12-2022 @who:Adarsh singh @why: EWM-9760 --------->
      //this.viewMode = 'listMode';  @suika @EWM-11782 @whn 02-06-2023---
      // End
       this.candidates = [];
      this.jobActionStatus = false;
      this.isManageJobPosted=false;
      this.CallTab=false;

      setTimeout(() => {
        let getData = sessionStorage.getItem(JobDetailLocalCalculationName.LIST_COUNT);
        if (!getData) {
          this.listViewPage?.performActionEventWise(EventType.REFRESH);
        }
      }, 400);
      this.redirectOnSamePgae(tab);
      /*************@why:EWM-14999 EWM-15000 @Who:Renu @What:Passing a parameter to handle dynamic filter popup on load************/
      this.getFilterConfig(false); /*-@why:EWM-13230,@WHY:For handle multilple APi,@when: 03-Aug-2023-*/
      //this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
    }
    this.setConfiguration(this.colArr);
  }
    /*
    @Type: File, <ts>
    @Name: redirectOnSamePgae function
    @Who: Suika
    @When: 14-07-2023
    @Why: EWM-10728
    @What: for redirect on same page
   */
  redirectOnSamePgae(tab){
     // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user Share Notes, Recent Activity, Documents via Protected mode and Internal share, it should redirects user to that particular Note, Recent Activity and Documents -->
      this.route.navigate([],{
        relativeTo: this.activatedRoute,
        queryParams: { tabIndex: tab.index },
        queryParamsHandling: 'merge'
      });
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
        this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
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
 @Name: openNewEmailModal function
  @Who: Renu
  @When:19-Oct-2021
  @Why: EWM-1733 EWM-3126
 @What: opening new mail
 */
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
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'),'candidateMail': email,'workflowId': this.workflowId, 'JobId': this.JobId ,openDocumentPopUpFor:'Candidate',isBulkEmail:false },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.pageNum = 1;
        this.sortingValue = '';
        this.searchValue = '';
        // this.fetchInboxList(this.pagesize,this.pageNum,this.sortingValue,this.searchValue,'');
      }
    })
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
        this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
      }
    })
  }

  isAttendeesReq: boolean = false;
/*
 @Name: ngOnDestroy
 @Who: Nitin Bhati
 @When: 05-06-2023
 @Why: EWM-12708
 @What: use for unsubsribe service
*/
  ngOnDestroy(): void {
   this.removeLocalDataFromStorage();
    setTimeout(() => {
      this.listViewPage?.getFilterConnfig(this.filterConfig);
    }, 1200);
    this.mobileQuery.removeListener(this._mobileQueryListener);
     this.JobHeaderDetailsObs?.unsubscribe();
    this.commonserviceService.jobDrawer.next(false);  /*****@Who:Renu @Why:Ewm-12861 ewm-12891 @When:29-06-2023 */
    localStorage.removeItem('viewMode');/*****@Who:Renu @Why:EWM-15127 EWM-15206 @When:23-11-2023 */
    localStorage.removeItem('jobdetailsHeaderDetails'); //by maneesh
    this.commonserviceService.setClientIdEOHValue('');
    this.commonserviceService.setMemberIdEOHValue('');
  }
  setIndex(index: number) {
    this.selectedIndex = index;
  }
  updatesessiondata(){
       this._JobIndexDbService.setDataInStorage(JobDetailIndexDBCard.DB_NAME,this.stages);
     }
  /*
     @Type: File, <ts>
     @Name: onMessage function
     @Who: Nitin Bhati
     @When: 13-Jan-2022
     @Why: EWM-4545
     @What: on validating file
   */
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 200 - value.length;
    }
  }
  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridList.length) {
        this.pageNum = this.pageNum + 1;
        this.getClientActivityListScroll(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pageNum);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }
  getClientActivityListScroll(clientId: any, year: number, month: string, pageNo) {
    this.loading = true;
    this.yearFilterRes = year;
    this.monthFilterRes = month;
    let jsonObj = {};
    jsonObj['CandidateId'] = this.candidateIdData;
    jsonObj['Year'] = this.yearFilterRes ? this.yearFilterRes : 0;
    jsonObj['Month'] = this.monthFilterRes ? this.monthFilterRes : '';
    if (this.OwnerIds) {
      jsonObj['OwnerIds'] = this.OwnerIds;
    } else {
      jsonObj['OwnerIds'] = [];
    }
    if (this.CategoryIds) {
      jsonObj['CategoryIds'] = this.CategoryIds;
    } else {
      jsonObj['CategoryIds'] = [];
    }
    //jsonObj['NotesFilterParams'] = [];
    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = this.pagesize;
    jsonObj['OrderBy'] = '';
    //jsonObj['GridId'] = this.GridId;
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;
    this.candidateService.fetchActivityAll(jsonObj).pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            let nextgridView = [];
            nextgridView = data.Data;
            this.gridList = this.gridList.concat(nextgridView);
          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
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
  onHover(i: number) {
    this.hoverIndex = i;
    var element = document.getElementById("flex-box-hover");
    if (i != -1) {
      element?.classList.add("test");
    } else {
      this.hoverIndex = i;
      element?.classList.remove("test");
    }
  }
  /*
  @Type: File, <ts>
  @Name: openDateFilterDialog function
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: for form type update like add edit
  */
  formType(value, CandidateId, RelatedUser) {
    this.activityStatus=true;
    this.candidateId = CandidateId;
    this.candidateIdData = CandidateId;
    this.Names = RelatedUser;
    //this.myActivityForm.enable();
    this.action = false;
    this.formHeading = 'Add';
    this.activestatus = value;
    //this.formHeading = value;
    this.dateFill = new Date();
    this.fileAttachmentsOnlyTow = [];
    this.fileAttachments = [];
    // this.IsDisabled = false;
    /* @When : 21-09-2022 @who: Renu @Why:1734 EWM-8251 @Waht : for scehdule assitance*/
    let slotStartDate = new Date();
    let slotEndDate = new Date(Date.now() + 30 * 60 * 1000);
    //this.getScheduleAssitance(slotStartDate,slotEndDate);
  }
  // add activity code end
  isMapApplicationForm: boolean = false;
  openMapApplicationForm() {
    this.overlayMappApplicationForm=!this.overlayMappApplicationForm;
    // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10994 Desc- there are no used this api while called this function --------
    // this.getCandidateMappedJobHeader(this.JobId)
    this.isMapApplicationForm = true;
    // --------@When: 10-April-2023 @who:Adarsh singh calling funtion for rtl
    this._rtlService.onOverlayDrawerRTLHandler();
  }
  JobApplicationUrlCloseDrawer(data) {
    if (data === true) {
      this.shareJobApplicationForm.close();
      this.isMapApplicationForm = false;
    }
  }
  /*
     @(C): Entire Software
     @Type: File, <ts>
     @Who: maneesh
     @When: 10-june-2022
     @Why: EWM-6872-EWM-7186
     @What:  publishButtonPopup created for open popup reason
     */
  publishButtonPopup() {
    const dialogRef = this.dialog.open(JobPublishPopupComponent, {
      data: new Object({ jobId: this.JobId }),
      panelClass: ['xeople-modal-lg', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }
  /*
   @Type: File, <ts>
   @Name: getCandidateJobFilterCount function
   @Who: Nitin Bhati
   @When: 13-June-2022
   @Why: EWM-7044
   @What: For showing Candidate mapped job Header data
  */
  getCandidateJobFilterCount(JobId,workflowId) {
    // this.loading = true;
    if (this.loaderStatus === 1) {
      this.loadingAssignJobSaved = true;
    } else {
      this.loading = true;
    }
    this.CandidateJobFilterCountObs=this.quickJobService.getCandidateJobFilterCount(JobId,workflowId).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          // this.loading = false;
          this.loadingAssignJobSaved = false;
          this.candidateJobCountData = repsonsedata.Data;
          this.RequiredAttention = this.candidateJobCountData?.RequiredAttention;
          this.MoreThanOneJob = this.candidateJobCountData?.MoreThanOneJob;
          this.ImmediateAvailable = this.candidateJobCountData?.ImmediateAvailable;
        // who:maneesh,what:ewm-12889 for pass this.workflowId show interviewinaweek count and candidate list filter interviewinaweek ,when:03/07/2023 -->
          this.interviewinaweek = repsonsedata.Data.InterviewInaWeek;
          this.moreThanOneJobCount = this.candidateJobCountData?.MoreThanOneJob;
          this.inboxCount = this.candidateJobCountData?.Inbox;
         // this.switchListMode(this.viewMode);
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode ===400){
          this.loading = false;
          this.loadingscroll = false;
          this.loadingAssignJobSaved = false;
          this.interviewinaweek = 0
        }
         else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingAssignJobSaved = false;
        }
      }, err => {
         this.loading = false;
        this.loadingAssignJobSaved = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
  @Type: File, <ts>
  @Name: filterValue function
  @Who: Nitin Bhati
  @When: 13-June-2022
  @Why: EWM-7044
  @What: For showing count filter value
 */
isQuickFilterApply:boolean = false;
  filterValue(filterValue) {
    if (this.mobileQuery.matches) {
      this.righttoggel.close();
    }
    if (this.isActive === filterValue) {
      this.isActive = '';
      this.CountFilter = 'All';
    } else {
      this.isActive = filterValue;
      this.CountFilter = filterValue;
    }
    this.isQuickFilterApply = true;
    this.commonMethodeGetData = {
      Type: CommonMethodeType.REALOAD_FROM_QUICK_FILTER,
      Source : this.Source,
      stagesList: this.stagesList,
      stages: this.stages,
      CountFilter: this.CountFilter
    }
      this.getWorkFlowStages(this.WorkflowId);
  }
  /*
  @Type: File, <ts>
  @Name: getWorkFlowStagesForClient function
  @Who: Nitin Bhati
  @When: 15-June-2022
  @Why: EWM-7044
  @What: For getting the stages basesd on workflowId
   */
  getWorkFlowStagesForClient(workflowId) {
    this.loadingStage = true;
    this.JobworkFlowBypipeIdObs=this.jobService.jobworkFlowBypipeId('?workflowId=' + workflowId + '&countfilter=' + 'TotalJobs' + '&jobId=' + this.JobId).pipe(takeUntil(this.destroy$)).subscribe(
      (data: ResponceData) => {
        this.loadingStage = false;
        if (data.HttpStatusCode === 200) {
          this.dataChangeStatus=true;
          this.stagesList = data.Data.Stages;
          data.Data.Stages.filter(o1 => !this.stages.some(o2 =>{
            if(o1.InternalCode === o2.InternalCode)
            o2.candidatesCount = o1.Count;
          }));

          this.totalStages = this.stagesList.length;
          this.setDataInSesstionStorage();
        } else {
          this.loadingStage = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loadingStage = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: getFilterConfig function
    @Who: Nitin Bhati
    @When: 15-June-2022
    @Why: EWM-7044
    @What: For getting the deafult config for the user
     */
  onSwiper(swiper) {
    // console.log(swiper);
  }
  /*
    @Type: File, <ts>
    @Name: maxNumberClass function
    @Who: Nitin Bhati
    @When: 15-June-2022
    @Why: EWM-7044
    @What: For max number class config for the user
     */
  maxNumberClass(perSlide) {
    if (this.totalStages > perSlide) {
      this.screenPreviewClass = 'flext-start';
    } else {
      this.screenPreviewClass = '';
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    this.actionMenuShowHide();
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }
    this.detectScreenSize();
    if(this.currentMenuWidth >= 1650 && this.currentMenuWidth <= 1800){
      this.screnSizePerStage = 7;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 1500 && this.currentMenuWidth <= 1650){
      this.screnSizePerStage = 6;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 1400 && this.currentMenuWidth <= 1500){
      this.screnSizePerStage = 5;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 1300 && this.currentMenuWidth <= 1400){
      this.screnSizePerStage = 4;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 950 && this.currentMenuWidth <= 1300){
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 441 && this.currentMenuWidth <= 950){
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth > 280 && this.currentMenuWidth <= 441){
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    }else{
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    }
    if (this.currentMenuWidth <= 767) {
      this.headerExpand = false
      this.hideChartOnHeaderCollpase=false
    }else if(this.currentMenuWidth <= 1299){
      this.hideChartOnHeaderCollpase=false
    } else {
      this.headerExpand = false
      this.hideChartOnHeaderCollpase=false
    }
  }
  actionMenuShowHide(){
    if (this.currentMenuWidth > 1024 && this.currentMenuWidth < 1150) {
      this.actionButtonVisible=7;
      this.navigation=true;
    } else if (this.currentMenuWidth > 768 && this.currentMenuWidth < 1023) {
      this.actionButtonVisible=3;
      this.navigation=true;
    } else if (this.currentMenuWidth > 240 && this.currentMenuWidth < 767) {
      this.actionButtonVisible=2;
      this.navigation=true;
    } else {
      this.actionButtonVisible = 11;
      this.navigation=false;
    }
  }
  /*
   @Type: File, <ts>
   @Name: detectScreenSize
   @Who: Niitn Bhati
   @When: 15-June-2022
   @Why: EWM-7043
   @What: Detect screen curerent size and change the menu list accordingly for small screen
*/
  private detectScreenSize() {
    this.mobileMenu(this.tagSelecteditem);
  }
  /*
 @Type: File, <ts>
 @Name: setConfiguration function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: For saving the setting config WITH WIdth of columns
  */
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
    gridConf['Header']=this.headerExpand?1:0;
    gridConf['PageMode']=this.viewMode=='cardMode'?'Card':'List';
    this.jobService.setfilterConfig(gridConf).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
   @Type: File, <ts>
   @Name: openNewTabForClientGoogleMapLocation
   @Who: Nitin Bhati
   @When: 14-JUne-2022
   @Why: EWM-7044
   @What: to open New window Tab For Client Google Map Location show
 */
  openNewTabForClientGoogleMapLocation(Latitude, Longitude, Location) {
    if ((Latitude != undefined && Latitude != null && Latitude != "") &&
      (Longitude != undefined && Longitude != null && Longitude != "")) {
      let urlloc = "https://www.google.com/maps/place/" + Latitude + ',' + Longitude;
      window.open(urlloc, '_blank');
    }
    else if (Location != undefined && Location != null && Location != "") {
      let urlloc = "https://www.google.com/maps/place/" + Location;
      window.open(urlloc, '_blank');
    }
    else {
    }
  }
  /*
  @Type: File, <TS>
  @Name: mobileMenu()
  @Who: Nitin Bhati
  @When: 14-June-2022
  @Why: EWM-7043
  @What: menu which will be shown as an header for screen size smaller
  */
  MobileMapTagSelected: any;
  mobileMenu(data) {
    if (data) {
      this.smallScreenTagData = 0;
      let items = data.slice(0, 2);
      let threeDotItems = data.slice(2, data.length);
      this.largeScreenTag = true;
      this.mobileScreenTag = false;
      this.MobileMapTagSelected = [];
      this.largeScreenTagData = items;
      this.smallScreenTagData = threeDotItems;
    }
  }
  setShowAlert(event) {
    if (event.checked == 1) {
      this.filterAlert = 1;
    } else {
      this.filterAlert = 0;
    }
    this.setConfiguration(this.colArr);
  }
  /*
  @Type: File, <ts>
  @Name: rightToggel function
  @Who: Nitin Bhati
  @When: 23-June-2022
  @Why: EWM-7044
  @What: For on off toggle button
   */
  drawerIconStatus:boolean=false;
  rightToggel() {
    this.sidenav1.close();
   if(!this.sidenav1.opened){
      this.sidenav1.open();
      this.sideMenuContext = 'quickfilter-section';
    }
    this.drawerIconStatus=!this.drawerIconStatus;
    //this.drawerIconStatus = true;
    // --------@When: 11-07-2023 @who:Adarsh singh @EWM-13099
    if (this.drawerIconStatus) {
      this.getCandidateJobFilterCount(this.JobId,this.workflowId);
    }
    //this.righttoggel?.toggle();
    // setTimeout(() => {
    //   this.righttoggel?.toggle();
    // }, 500);
  }
  /*
 @Type: File, <ts>
 @Name: onOpenedChangeQuickFilter function
 @Who: Nitin Bhati
 @When: 23-June-2022
 @Why: EWM-7044
 @What: For gOpne Quick filter
 */
  onOpenedChangeQuickFilter(event) {
    if (event) {
      this.quickFilterStatus = 1;
      this.isLeft = true;
    } else {
      this.quickFilterStatus = 0;
      this.isLeft = false;
    }
    this.setConfiguration(this.colArr);
  }
  /*
  @Type: File, <ts>
  @Name: confirmShareDocument
  @Who: Suika
  @When: 28-Sept-2022
  @Why: EWM-5342
  @What: To confirm share document as an attachment.
  */
  ShareJobApplicationUrl() {
    this.overlayShareJobApplicationForm=!this.overlayShareJobApplicationForm;
    this.isShareJobApplicationUrl = true;
    this._rtlService.onOverlayDrawerRTLHandler();
  }
  smsHistoryDetails(can) {
    this.sidenav1.close();
  //   if(!this.sidenav1.opened){
  //    this.sidenav1.open();
  //    this.candidateIdData = can.CandidateId;
  //   this.getSMSHistoryData(can);
  //   this.smsHistoryToggel = true;
  //   this.quickFilterToggel=false;
  //    this.sideMenuContext = 'sms-section';
  //  }
  // this.sidenav1.open(); 
     this.contactPhone=can?.PhoneNumber;  //who:maneesh as discuss with ankit rajput sir this line use for send sms btn enabel and disable
     this.candidateIdData = can?.CandidateId;
    this.getSMSHistoryData(can);
    this.smsHistoryToggel = true;
    this.quickFilterToggel=false;
     this.sideMenuContext = 'sms-section';
    // this.candidateIdData = can.CandidateId;
    // this.getSMSHistoryData(can);
    // this.smsHistoryToggel = true;
    // this.quickFilterToggel=false;
  /*  setTimeout(() => {
      this.openDrawer(can);
    }, 1000);
*/
  }
  openDrawer(can){
    setTimeout(() => {
      if(this.SMSHistory.length>0){
        this.smsHistoryDrawer.open();
        this.isSmsHistoryForm = true;
        can['JobName'] = this.JobName;
        this.candidateIdData = can.CandidateId;
        this.candidateDetails = can;
      }else{
        this.openJobSMSForCandidate(can)
      }
    }, 1500);
  }
  /*
  @Type: File, <ts>
  @Name: getSMSHistory
  @Who: Suika
  @When: 27-Sep-2022
  @Why: EWM-8813 EWM-8952
  @What: to open template modal dialog
*/
getSMSHistory() {
  this.loading = true;
  let userType='CAND';
  this.systemSettingService.getSMSHistory('?Id='+this.candidateIdData+'&UserType='+userType).pipe(takeUntil(this.destroy$)).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.SMSHistory = repsonsedata.Data;
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.SMSHistory = [];
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
getSMSHistoryData(can) {
  this.contactPhone=can?.PhoneNumber;  
  this.loading = true;
  this.systemSettingService.getSMSHistory('?Id='+this.candidateIdData+'&UserType='+this.userType).pipe(takeUntil(this.destroy$)).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.SMSHistory = repsonsedata.Data;
        if(this.SMSHistory.length>0){
          this.smsHistoryDrawer.open();
          this.isSmsHistoryForm = true;
          can['JobName'] = this.JobName;
          this.candidateIdData = can.CandidateId;
          this.candidateDetails = can;
        }
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.SMSHistory = [];
        this.openJobSMSForCandidate(can);
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
  /*
    @Type: File, <ts>
    @Name: openJobWorkflowSubStages
    @Who: Adarsh singh
    @When: 08-07-22
    @Why: EWM-7711
    @What: to open quick add Manage Access modal dialog
    */
  // openJobWorkflowSubStages(code) {
  //   let stageList = this.stagesList.filter(e => e.InternalCode == code);
  //   const dialogRef = this.dialog.open(WorkflowSubStagesComponent, {
  //     data: new Object({ stageList, workflowId: this.workflowId, stageId: code, jobId: this.JobId }),
  //     panelClass: ['xeople-modal-full-screen', 'workflow-sub-stages', 'animate__animated', 'animate__zoomIn'],
  //     disableClose: true,
  //   });
  // }
  /*
      @(C): Entire Software
      @Type: File, <ts>
      @Who: Suika
      @When: 09-july-2022
      @Why: EWM-7401-EWM-7509
      @What:  showResume created for open popup reason
  */
  showResume(ResumeUrl, FileName) {
    var filename = ResumeUrl?.split('.').pop();
    let fname = 'resume.' + filename;
    const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {
      data: new Object({ ResumeUrl: ResumeUrl, FileName: FileName ? FileName : fname }),
      panelClass: ['xeople-modal-full-screen', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      }
    });
  }
  viewResumeByCandidateId(candidateId) {
    // --------@When: 07-07-2023 @who:Adarsh singh @EWM-13010
    setTimeout(() => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + candidateId);
      if (candDiv.classList.contains("unread")) {
        candDiv.classList.remove("unread");
        let candArr: [string] = [candidateId];
        this.commonserviceService.candidateProfileReadUnread(candArr, this.JobId);
      }
    }, 600);
    // End
    this.loading = true;
    this.candidateService.fetchCandidateResumeHistory("?candidateId=" + candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode == 204) {
          let gridView = repsonsedata.Data;
          if (gridView?.length == 0) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_resumeNotAddedYet'), repsonsedata['HttpStatusCode']);
            this.loading = false;
          } else {
            if (gridView) {
              let ResumeUrl = gridView?.ResumeUrl;
              let FileName = gridView?.FileName;
              this.showResume(ResumeUrl, FileName)
              this.loading = false;
            }
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  /*
      @(C): Entire Software
      @Type: File, <ts>
      @Who: Adarsh singh
      @When: 03-Aug-2022
      @Why: EWM-7402-EWM-8080
      @What: Display Total count of DOCUMENTS
  */
  getAlldocumentCount() {
    this.loading = true;
    this.candidateService.getDocumentCount('?usertypeid=' + this.JobId).pipe(takeUntil(this.destroy$))
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.totalDocuments = data.Data.FileCount;
          this.loading = false;
        }
        else if (data.HttpStatusCode == 204) {
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  /*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Adarsh singh
    @When: 03-Aug-2022
    @Why: EWM-7402-EWM-8080
    @What: Display Total count of DOCUMENTS
  */
  fetchDataFromDocs(value) {
    if (value == true) {
      this.getAlldocumentCount();
    }
  }
  /*
    @Type: File, <ts>
    @Name: alertValidationManageAccess function
    @Who: Suika
    @When: 25-Aug-2022
    @Why: EWM-7489 EWM-8426
    @What: For Alert validation message
  */
 // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show 
 public alertValidationManageAccess(SkipStageName, SkipStagePosition){
  let message1 = `label_stage_msg1`;
  const message2 = `label_stage_msg2`;
  const message3 = `label_stage_msg3`;
  const message = '';
  const title = '';
  const subTitle = '';
  let mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates';
  switch (SkipStagePosition) {
    case 'parent':
      mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates';
      break;
    case 'child':
      mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates_substage';
      break;
    case 'subchild':
      mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates_substage_Sub-substage';
      break;
  }

  message1 = this.commonServiesService.getreplace(mintitle, SkipStageName);

  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,SkipStageName:SkipStageName,message1:message1,message2:message2,message3:message3},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
  })
}
/*
  @Type: File, <ts>
  @Name: openClientDetail function
  @Who: Adarsh singh
  @When: 05-Sep-2022
  @Why: EWM-7477
  @What: For showing client details slide overlay
*/
openClientDetail() {
  this.overlayClientDetail=!this.overlayClientDetail;
  this.isClientDetailView = true;
  this.route.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: { clientId: this.isClientId },
      queryParamsHandling: 'merge'
    });
}
/*
  @Type: File, <ts>
  @Name: getCandidateEmailAndPhone function
  @Who: Adarsh singh
  @When: 05-Sep-2022
  @Why: EWM-7477
  @What: For showing Candidate emaisl and phones
*/
  getCandidateEmailAndPhone(JobId) {
    this.loading = true;
    this.quickJobService.getCandidateEmailAndPhone(JobId).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.EmailsAndPhonesData = repsonsedata.Data.ListCompanyContact;
          this.skillData = repsonsedata.Data.Skills;
          this.largeSkill = repsonsedata.Data.Skills;
          this.getResponseEmailPhone = repsonsedata.Data;
          let items = repsonsedata.Data.ListCompanyContact.slice(0, 2);
          this.largeEmailsAndPhonesData = items;
          let threeDotItemsEmailPhone =  this.EmailsAndPhonesData.slice(2, this.EmailsAndPhonesData?.length);
          this.smallEmailsAndPhonesData = threeDotItemsEmailPhone;
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
           this.loading = false;
        }
      }, err => {
         this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
    /*
      @(C): Entire Software
      @Type: File, <ts>
      @Who: Suika
      @When: 12-Sept-2022
      @Why: EWM-7478-EWM-8497
      @What: Display Total data on piechart
  */
 getJobsummaryHeaderSourcepichart() {
  //this.pieloading = true;
  this.JobsummaryHeaderSourcepichartObs=this.jobService.getJobsummaryHeaderSourcepichart('?jobid=' + this.JobId).pipe(takeUntil(this.destroy$))
    .subscribe((data: ResponceData) => {
      this.pieData = [];
      this.pieDataLegends = [];
      this.pieDataColors = [];
      if (data.HttpStatusCode == 200) {
        this.pieChartData = data.Data;
        this.totalSource = 0;
        this.pieChartData?.forEach(res => {
          res['legends'] = res.Source + '(' + res.Count + ')';
         // <!---------@When: 04-07-2023 @who:Adarsh singh @why: EWM-12895 --------->
          if (res.Count > 0) {
            this.pieData?.push(res.Count);
            this.pieDataLegends?.push(res.Source+' (' + res.Count + ')');
            this.totalSource += res.Count;
          }
          // End
          //this.pieDataColors.push(res.ColorCode);
        })
        //this.pieloading = false;
        this.drawPiechart('');
      }
      else if (data.HttpStatusCode == 204) {
        this.pieChartData = [];
        this.pieData = [];
        this.pieDataLegends = [];
        this.pieDataColors = [];
        //this.pieloading = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
        //this.pieloading = false;
      }
    }, err => {
      //this.pieloading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}
/*
  @Type: File, <ts>
  @Name: dateConvert function
  @Who: Nitin Bhati
  @When: 10-Sep-2022
  @Why: EWM-8599
  @What: For showing data in tooltip
*/
dateConvert(value){
  return this._DatePipe.transform(value, 'dd-MM-yyyy');
}
public drawPiechart(type: any) {
    this.cOptions = {
      series: this.pieData,
      chart: {
        events: {
          dataPointSelection: (event, chartContext, config) => {
            let pChartData =  this.pieChartData[config.dataPointIndex];
            this.Source = pChartData.Source;
            if (config?.selectedDataPoints[0]?.length==0) {//by maneesh when:08/10/2024 ewm-18364
              this.Source = '';              
            }
            // @suika @EWM-10666 @EWM-10902 @24-03-2023 to handle onclick event and higlight portion
            //this.getJobsummaryHeaderSourcepichart();
            // @suika @whn 19-07-2023 @EWM-13435
            this.switchListMode(this.viewMode);
           // if (this.viewMode=='listMode') {
            /***@Why:EWM-16622 EWM-16974 @Who: Renu @What: to notify the updated count below commented this.commonMethodeGetData menthod only*/
              // this.commonMethodeGetData = {
              //   Type: CommonMethodeType.REALOAD_PIECHART_FROM_HEADER,
              //   Source : this.Source,
              //   stagesList: this.stagesList,
              //   stages: this.stages,
              // }
          //  }
            this.jobService.pageDataChangeStatus(true);/***when:09/05/2024 @who:renu @why: EWM-16974 EWM-17001 @What: After applying filter of pie is it not reflecting on list view*/

            //this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
          },
          dataPointMouseEnter: function(event) {
            if(event!=undefined){
              event.target.style.cursor = "pointer";
            }
          }
        },
        // @When: 21-09-2023 @who:Amit @why: EWM-14386 @what: width change
        width: 380,
        height: 185,
        type: this.piechartType,// 'pie',
      },
      labels: this.pieDataLegends,
      responsive: [
        {
          breakpoint: 380,
          options: {
            chart: {
              width: 200,
              height: 200,
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
}
fetchDataFromParent(event){
  if(event){
    this.getCandidateMappedJobHeader(this.JobId);
  }
}
  /*
    @Type: File, <ts>
    @Name: getAllEmailIdFromMappedJob function
    @Who: Adarsh singh
    @When: 28-sept-2022
    @Why: EWM-7481
    @What: get all email from which candidate mapped from Job
  */
getCandidateData:any = [];
getAllEmailIdFromMappedJob(data){
   let arr = data;
   this.getAllEmailIdFormMappedJob = data?.map(function (el) { return el.EmailId; });
   this.getCandidateData = [];
   arr?.forEach(element => {
     this.getCandidateData.push({
      "ModuleType": "CAND",
      "Id": element.CandidateId,
      "EmailTo": element.EmailId
     })
   });
 this.getCandidateData.filter((value , index) =>{
    data.indexOf(value) === index
  })
}
  /*
    @Type: File, <ts>
    @Name: jobAction function
    @Who: Nitin Bhati
    @When: 3-Oct-2022
    @Why: EWM-9033
    @What: For Job action details
  */
jobAction(dataItem){
  this.jobActionStatus=true;
  this.candidateIdData=dataItem?.CandidateId;
  this.JobTitle= dataItem?.JobTitle;
  this.EmailId=dataItem?.EmailId;
  this.WorkFlowStageId= dataItem?.WorkFlowStageId;
  this.CandidateName=dataItem?.CandidateName;
  this.WorkFlowStageName= dataItem?.WorkFlowStageName;
  this.LastActivity=dataItem?.LastActivity;
  this.WorkFlowName=dataItem?.WorkFlowName;
  if (this.routes.snapshot.queryParams['Type']==undefined) {
  this.route.navigate([],{
    relativeTo: this.activatedRoute,
    queryParams: { appId: this.applicationFormId,hideButton:this.hideButton,Type:'CAND'}, /*** @When: 27-03-2023 @Who:Renu @Why: EWM-11413 EWM-11497 @What: new param added to router for job edit**/
    queryParamsHandling: 'merge'
  });
}else{
  this.route.navigate([],{
    relativeTo: this.activatedRoute,
    queryParams: { appId: this.applicationFormId,hideButton:this.hideButton},
    queryParamsHandling: 'merge'
  });
}
}
  fetchDataFromSMSHistory(event){
    if(event){
    this.smsHistoryToggel = false;
    this.quickFilterToggel=true;
      this.smsHistoryDrawer.close();
    }
  }
 /*
  @Type: File, <ts>
  @Name: openJobBulkSMSForCandidate
  @Who: Suika
  @When: 04-Oct-2022
  @Why: EWM-8813 EWM-8952
  @What: to open job Sms For Candidate modal dialog
  */
 openJobBulkSMSForCandidate() {
   // <!---------@When: 03-07-2023 @who:Adarsh singh @why: EWM-12937 @modify for EWM-14637 on 09-10-2023--------->
  this.commonMarkAsRead(this.selectedCandidates);
  //  End
  const dialogRef = this.dialog.open(BulkSmsComponent,{
    data: new Object({JobId:this.JobId,JobName:this.JobName,selectedCandidates:this.selectedCandidates}),
    panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res != true) {
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
getCandidateMappedListByJob(sortingValue: string, searchValue: any, filterConfig: any, isSearch: boolean, isScroll: boolean) {
  this.loading = true;
  this.loader = true;
  const formdata = {
    JobId: this.JobId,
    GridId: this.GridId,
    WorkflowId:this.workflowId,
    JobFilterParams: filterConfig,
    search: searchValue,
    // PageNumber: pageNum,
    // PageSize: pagesize,
    OrderBy: sortingValue,
    CountFilter: this.CountFilter,
    Source:this.Source,
    ByPassPaging:false
  }
  if (!isSearch) {
    // this.loading = true;
    if (this.loaderStatus === 1) {
      this.loadingAssignJobSaved = true;
    } else if (isScroll) {
      this.loading = false;
      this.loader = false;
    } else {
      this.loading = true;
      this.loader = true;
    }
  }
  this._service.getAllCandidateJobMapping(formdata).pipe(takeUntil(this.destroy$)).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
        this.totalDataCount = data.TotalRecord;
        this.loading = false;
        this.loader = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.loadingAssignJobSaved = false;
        this.getAllEmailIdFromMappedJob(data.Data);
        this.confirmMailSync(this.getAllEmailIdFormMappedJob, true)
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
        this.loading = false;
        this.loader = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.loadingAssignJobSaved = false;
        this.filterCount = 0
      }
    }, err => {
      this.loading = false;
      this.loader = false;
      this.loadingscroll = false;
      this.loadingSearch = false;
      this.loadingAssignJobSaved = false;
      this.filterCount = 0
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}
onBulkEmail(){
 // @suika @whn 29-06-2023 @EWM-12888 for sending selected candidates for bulk email pop up.
 this.toEmailList = this.selectedCandidates;
 this.loading = false;
  // <!---------@When: 03-07-2023 @who:Adarsh singh @why: EWM-12937 @modify for EWM-14637 on 09-10-2023--------->
 this.commonMarkAsRead(this.selectedCandidates)
//  End
 this.getAllEmailIdFromMappedJob(this.selectedCandidates);
 this.openMail(this.selectedCandidates, this.IsEmailConnected, true);
}
backtoJobDetails(value){
  if(value==true){
    // <!---------@When: 06-12-2022 @who:Adarsh singh @why: EWM-9760 --------->
    this.viewMode = 'listMode';
    // End
    this.jobActionStatus = false;
    this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
  }
}
assignToJob(event){
 // alert(event+"event");
   if(event){
  //  this.getJobsummaryHeaderSourcepichart();
   }
 }
/*
   @Type: File, <ts>
   @Name: hash child
   @Who: Nitin Bhati
   @When: 14-Nov-2022
   @Why:EWM-9044
   @What: for tree view
  */
   hasChild = (_: number, node: TreeNode) =>
   !!node.Stages && node.Stages.length > 0;
/*
  @Type: File, <ts>
  @Name: openJobWorkflowSubStages
  @Who: Nitin Bhati
  @When: 14-Nov-2022
  @Why:EWM-9044
  @What: for showing tree view for workflow stage
  */
  openJobWorkflowSubStages(code) {
    this.treeMatDrawer=true;
    this.loadingTree=true;
    this.dataArr=[];
   let stageList = this.stagesList.filter(e => e.InternalCode == code);
     let IsJobid = '';
     IsJobid = '?workflowId=' + this.workflowId + '&stageId=' + code + '&countfilter=' + this.selectjobcatparam + '&jobId=' + this.JobId
    this.JobworkFlowChildByIdObs= this.jobService.jobworkFlowChildById(IsJobid).pipe(takeUntil(this.destroy$)).subscribe(
     (data: ResponceData) => {
       if (data.HttpStatusCode === 200) {
         this.view = true;
         this.loadingTree=false;
         this.dataArr = data.Data.Stages.filter(e => e.InternalCode == stageList[0].InternalCode);
         // @suika @EWM-12465 Hide show stages @whn 24-05-2023
         this.dataArr?.forEach(element => {
          this.stages?.forEach(res => {
           if(element.InternalCode==res.InternalCode && res.StageVisibility==0){
             res.StageVisibility = 0;
             element.StageVisibility = 0;
           }
          })
        });
        //
         this.treeControl = new NestedTreeControl<TreeNode>(node => node.Stages);
         this.dataSource = new TreeDataSource(this.treeControl, this.dataArr);
         //this.loading = false;
       } else {
         this.loadingTree = false;
         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
       }
     },
     err => {
       this.loadingTree = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     })
 }
 /*
   @Type: File, <ts>
   @Name: cancelTreeview
   @Who: Nitin Bhati
   @When: 14-Nov-2022
   @Why:EWM-7488
   @What: for cancel tree view
   */
 cancelTreeview(){
  this.dataArr=[];
   this.treeMatDrawer=false;
 }

/*
 @Type: File, <ts>
 @Name: openActionModalDialog function
 @Who: Adarsh singh
 @When: 03-Jan-2023
 @Why: ROST-2087
 @What: For opening action dialog box
*/
 openActionModalDialog() {
   // @When: 05-07-2023 @who:Amit @why: EWM-12954 @what:add column code
  const columns = this.grid?.columns;
  const gridConfig = {
    //state: this.gridSettings.state,
    columnsConfig: columns?.toArray()?.map(item => {
      return Object?.keys(item)
        .filter(propName => !propName?.toLowerCase()
          .includes('template'))
          .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
    }),
  };
   // @When: 08-07-2023 @who:bantee @why: EWM-12956 @what:Column name reload issue in action popup
  this.setConfiguration(gridConfig.columnsConfig);
  let otherConfigObj={};
  otherConfigObj['filterAlert']=this.filterAlert;
  otherConfigObj['filterConfig']=this.filterConfig;
  otherConfigObj['PageMode']=this.viewMode=='cardMode'?'Card':'List';
  otherConfigObj['filterConfig'] = this.filterConfig;
  otherConfigObj['FilterAlert'] = this.filterAlert;
  otherConfigObj['quickFilterStatus'] = this.quickFilterStatus;
  otherConfigObj['Header']=this.headerExpand?1:0;
  const dialogRef = this.dialog.open(ActionDialogComponent, {
    maxWidth: "750px",
    data: new Object({ GridId: this.GridId,gridConfig:otherConfigObj }),
    panelClass: ['quick-modalbox', 'add_actiondialog', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res != false) {
      this.colArr = res.data;  //<!-----@suika@EWM-10650 @whn  @021-03-2023 to handle API url----->
      // this.columns=res.data;
      let selectedCol = [];
      selectedCol = res.data?.filter(x => x['Selected'] == true);
      if (selectedCol?.length != 0) {
        selectedCol.sort(function (a, b) {
          return a.Order - b.Order;
        });
        this.columns = selectedCol;
        this.columnsWithAction = this.columns;
        this.columnsWithAction.splice(0, 0, {
          "Type": "Action",
          "Field": "",
          "Order": 0,
          "Title": "",
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
          "Field": "",
          "Order": 0,
          "Title": "",
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
      this.listViewPage?.performActionEventWise(EventType.ACTION);
    }
  })
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }
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
  @Name: viewWorkflowStages
  @Who: Adarsh singh
  @When: 04-Jan-23
  @Why: EWM-10065
  @What: to open view workflow modal
*/
  viewWorkflowStages() {
    // let stageList = this.stagesList.filter(e => e.InternalCode == code);
    const dialogRef = this.dialog.open(WorkflowSubStagesComponent, {
      // data: new Object({ stageList, workflowId: this.workflowId, stageId: code, jobId: this.JobId, isParentStages: true }),
      data: new Object({ workflowId: this.workflowId, isParentStages: true }),
      panelClass: ['xeople-modal-full-screen', 'workflow-sub-stages', 'animate__animated', 'animate__zoomIn'],
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
    @Name: getAvaiableTimeslots
    @Who:maneesh
    @When: 13-jan-2023
    @Why:EWM-9928
    @What: get All avaiable User
    */
    getAvaiableTimeslots(startdatetime, slotAdd) {
      this.slotAdd=slotAdd;
      const d = new Date(this.slotStartDate);
      // let timeZone = this.TimeZone?.substring(4, 10);
      let timeZone = this.TimeZone;
      let slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
      let timeZoneValue = encodeURIComponent(timeZone);
      this.AvaiableTimeslotsObs= this.quickJobService.getAvaiableTimeslots(slotDate, this.timePeriod, timeZoneValue).pipe(takeUntil(this.destroy$)).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.timeAvaiableSlots = repsonsedata.Data.TimeSlots;
            /*************************/
            if (startdatetime != '') {
              const enddatetime = new Date(this.slotEndDate);
              let starttime = startdatetime.getTime();
              const stime = new Date(Number(starttime));
              this.startTime = moment.utc(stime).tz(this.timezonName).format("hh:mm");
              let endtime = enddatetime.getTime();
              const etime = new Date(Number(endtime));
              this.endTime = moment.utc(etime).tz(this.timezonName).format("hh:mm");
              this.selectedTimeslots = { StartTime: starttime, EndTime: endtime };
              // let index = this.timeAvaiableSlots.findIndex((e: any) => e.StartTime == starttime);
              let index:any;
              if(this.slotAdd==true){
                index=this.timeAvaiableSlots.map((elm, idx) => (( elm.StartTime >= starttime && elm.StartTime <= endtime)||
                (elm.EndTime >= starttime && elm.EndTime <= endtime))? idx : '').filter(String);
              }else{
                index=this.timeAvaiableSlots.findIndex((e: any) => e.StartTime == starttime);
              }
              this.selectedItem=[];
             this.getTimeSlot(this.selectedTimeslots, index,this.slotAdd);
            }
            /**************************/
          } else if (repsonsedata.HttpStatusCode === 204) {
            this.timeAvaiableSlots = [];
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          // this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
      /*
  @Type: File, <ts>
  @Name: getTimeSlot
   @Who:maneesh
   @When: 13-jan-2023
   @Why:EWM-9928
  @What: for patching th value based on 12/24 format
  */
  getTimeSlot(timeslots, i,slotAdd) {
    this.slotAdd=slotAdd;
    if (timeslots.IsAvailable === 0) {
      return;
    }
    this.selectedTimeslots = timeslots;
    if(this.slotAdd==true){
      if(i?.length!=null){
        i.forEach(x=>{
          if(x!==''){
            this.selectedItem[x] = x;
          }
          })
      }
     }else{
       this.selectedItem=[];
      if (i != null) {
        this.selectedItem[i]= i;
      }
     }
    const d = new Date(Number(timeslots.StartTime));
    let startTime: any;
    let endTime: any;
    if (this.timeDisplayHour == 12) {
      let start_time = moment.utc(d).tz(this.timezonName).format("hh:mm");
      startTime = start_time;
      const e = new Date(Number(timeslots.EndTime));
      let end_time = moment.utc(e).tz(this.timezonName).format("hh:mm");
      endTime = end_time;
    } else {
      let start_time = moment.utc(d).tz(this.timezonName).format('HH:mm');
      startTime = start_time;
      const e = new Date(Number(timeslots.EndTime));
      let end_time = moment.utc(e).tz(this.timezonName).format('HH:mm');
      endTime = end_time;
    }
    let scheduleFormData = {};
    scheduleFormData['TimeZone'] = this.utctimezonName;//'(UTC+03:00) East Africa Time/ Mayotte';//value.TimeZone.Timezone;
    //let local_startDate = moment.utc(value.DateStart).local().format('YYYY-MM-DD');
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(this.slotStartDate, startTime);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = startTime;
    // let local_endDate = moment.utc(value.DateEnd).local().format('YYYY-MM-DD');
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(this.slotStartDate, endTime);
    scheduleFormData['DateEnd'] = local_endDate;
    scheduleFormData['TimeEnd'] = endTime;
    const e = new Date(Number(timeslots.EndTime));
    this.scheduleData = scheduleFormData;
    this.getScheduleTimeData(timeslots);
  }
  scheduleData24Hrs: {};
  /*
 @Type: File, <ts>
 @Name: getScheduleTimeData
  @Who:maneesh
  @When: 13-jan-2023
  @Why:EWM-9928
 @What: calucation for the schedule time
 */
 getScheduleTimeData(timeslots) {
  const d = new Date(Number(timeslots.StartTime));
  let startTime: any;
  let endTime: any;
  let start_time = moment.utc(d).tz(this.timezonName).format('HH:mm');
  startTime = start_time;
  const e = new Date(Number(timeslots.EndTime));
  let end_time = moment.utc(e).tz(this.timezonName).format('HH:mm');
  endTime = end_time;
  let scheduleFormData = {};
  scheduleFormData['TimeZone'] = this.utctimezonName;
  let local_startDate = this.commonserviceService.getTimeAndpatchInDate(this.slotStartDate, startTime);
  scheduleFormData['DateStart'] = local_startDate;
  scheduleFormData['TimeStart'] = startTime;
  let local_endDate = this.commonserviceService.getTimeAndpatchInDate(this.slotStartDate, endTime);
  scheduleFormData['DateEnd'] = local_endDate;
  scheduleFormData['TimeEnd'] = endTime;
  this.scheduleTimeData = scheduleFormData;
}
  /*
      @Type: File, <ts>
      @Name: changeTimeDisplay
      @Who:maneesh
      @When: 13-jan-2023
      @Why:EWM-9928
      @What: open user change time format from dropdown
      */
      changeTimeDisplay($event) {
        this.timeDisplayHour = $event.value;
        this.getTimeSlot(this.selectedTimeslots, null,this.slotAdd);
      }
  gridTimeZone: any;
  /*
     @Type: File, <ts>
     @Name: getTimeZone
     @Who:maneesh
     @When: 13-jan-2023
     @Why:EWM-9928
     @What: get All getTimeZone
     */
    getTimeZone() {
     this.TimezoneObs =this._profileInfoService.getTimezone().pipe(takeUntil(this.destroy$)).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == 200) {
            this.gridTimeZone = repsonsedata.Data;
            let gridTimeZone = this.gridTimeZone?.filter(x => x['Id'] === this.timezonName);
            this.utctimezonName = gridTimeZone[0]?.Timezone;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

  screeningAndInterviewNew(dataItem) {
    const dialogRef = this.dialog.open(JobScreeningComponent,{
      data: new Object({ jobdetailsData:dataItem,JobId: this.JobId,JobName:this.JobName, StatusData: dataItem ,JobLatitude:this.JobLatitude,
        JobLongitude:this.JobLongitude,GridId: this.GridId,category: this.category}),
      panelClass: ['screening-and-interview-modal', 'screening-and-interview-animation', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res==true){
        setTimeout(()=>{
          this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
        },1000)
      }
    })
  }
       /*
  @Type: File, <ts>
  @Name: checkEmailConnection function
   @Who: Suika
   @When: 10-April-2023
   @Why: EWM-11707 EWM-11802
  @What: check email connection is established or not
  */
 checkEmailConnection(){
   this.UserIsEmailConnectedObs = this.mailService.getUserIsEmailConnected().pipe(takeUntil(this.destroy$)).subscribe(
   (data: ResponceData) => {
     if (data.HttpStatusCode === 200) {
       if(data.Data.IsEmailConnected==1){
        this.emailConnection=true;
       }else{
         this.emailConnection=false;
       }
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
/*
  @Type: File, <ts>
  @Name: onXeopleSmartEmailJob function
  @Who: Adarsh singh
  @When: 10-May-2023
  @Why: EWM-11804
  */
 onXeopleSmartEmailJob() {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(XeopleSmartEmailJobComponent, {
    panelClass: ['xeople-modal-md', 'xeopleSmartEmailModal', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    data: new Object({ isCandidate: true , JobRefId: this.getResponseEmailPhone?.JobReferenceId}),
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) { }
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
 @Name: getEmailForwarding function
 @Who: Adarsh singh
 @When: 10-May-2023
 @Why: EWM-11804
 @What: call Get method from services.
  */
 xeopleSmartEmailJob:boolean;
 getEmailForwarding(){
  this.loading=true;
  this.EmailForwardingObs = this._userAdministrationService.getEmailForwarding().pipe(takeUntil(this.destroy$)).subscribe(
    (repsonsedata:any)=>{
      if (repsonsedata['HttpStatusCode'] == '200') {
        this.loading=false;
        repsonsedata.Data.EmailForwardingStatus === 1 ? this.xeopleSmartEmailJob = false: this.xeopleSmartEmailJob = true;
      }
    },
    err=>{
       this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
  /*
 @Type: File, <ts>
 @Name: selectStageData function
 @Who: Suika
 @When: 22-May-2023
 @Why: EWM-11782 EWM-12504
 @What: To select stage data.
  */
 selectStageData(stageData,event){
  if(event.checked===true && stageData.IsIntermediate==false){
    stageData.CheckboxStatus=true;
    stageData.IsIntermediate=false;
    stageData?.candidates?.forEach((element,index) => {
      // remove 20 selec only candiate adarsh singh EWM-14374 on 28-09-223
      // if(index<=(this.NoOfCanSelectedEachStage-1)){
        this.selectedCandidates.push(element);
        element.CheckboxStatus=true;
      // }
    });
    stageData.IsIntermediate=false;
    stageData.CheckboxStatus=true;
   // @suika @EWM-12888 @whn 29-06-2023 As per new requirement we can select candidate of deifferent stage.
   this.selectedCandidates = this.selectedCandidates.filter((n, i) =>  this.selectedCandidates.indexOf(n) === i);
   if(this.selectedCandidates?.length>this.NoOfCanSelectedEachStage){
    // this.alertCandidatesSelectionMessage(stageData);
  }
  //  adarsh singh
  if (this.selectedCandidates?.length>0) {
    this.showHideDocumentButtons = true
  }else{
    this.showHideDocumentButtons = false
  }
  // End
  if (stageData?.lastStage) {
    this.isLastSatgeCand = true;
   }
   else{
    this.isLastSatgeCand = false;
   }
  }else{
    stageData.CheckboxStatus=true;
    setTimeout(() => {
      stageData.IsIntermediate=false;
      stageData.CheckboxStatus=false;
    }, 10);
    stageData?.candidates?.forEach(element => {
      element.CheckboxStatus=false;
      // adarsh singh for EWM-14647 on 10-10-23
      let index = this.selectedCandidates.findIndex(a => a.CandidateId === element.CandidateId);
      if (index !== -1) {
        this.selectedCandidates.splice(index, 1)
      }
      // End
    });
    //  adarsh singh
  if (this.selectedCandidates?.length>0) {
    this.showHideDocumentButtons = true
  }else{
    this.showHideDocumentButtons = false
  }
  // End
  let res = this.selectedCandidates.filter(e => e?.StageId === this.lastStageIdObj?.InternalCode);
    if (res?.length > 0) {
      this.isLastSatgeCand = true
    }
    else {
      this.isLastSatgeCand = false
    }
  }
  this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
  if (!this.isSelectedCandOfFirstSatgesOnly) {
    this.isSelectedCandOfOtherSatgesOnly = true;
    if (this.selectedCandidates?.length > 1) {
      this.removeBtnTooltip = 'label_jobDetailsSelectedCandOnlyParent';
    }
    else{
      this.removeBtnTooltip = 'label_jobDetails_Remove'
    }
  }else {
    this.isSelectedCandOfOtherSatgesOnly = false;
    this.removeBtnTooltip = 'label_jobDetails_Remove';
  }
}
  /*
 @Type: File, <ts>
 @Name: showAlertMsgOnCandidateSelection function
 @Who: Suika
 @When: 22-May-2023
 @Why: EWM-11782 EWM-12504
 @What: To check show alert messge  of candidate data.
  */
showAlertMsgOnCandidateSelection(stageData,Can,event){
  this.selectedCandidates = this.selectedCandidates.filter((n, i) =>  this.selectedCandidates.indexOf(n) === i);
  if(this.selectedCandidates?.length>this.NoOfCanSelectedEachStage){
    // this.alertSingleCandidatesSelectionMessage(stageData,Can);
  }
  /*else  if(this.selectedCandidates[0]?.StageId!=undefined && this.selectedCandidates[0]?.StageId!=stageData?.InternalCode){
    this.alertStageSelectionMessage(stageData);
   }*/
  else{
    this.checkParentStage(stageData);
  }
}
  /*
 @Type: File, <ts>
 @Name: checkStageCheckValidity function
 @Who: Suika
 @When: 22-May-2023
 @Why: EWM-11782 EWM-12504
 @What: To check stage of candidate data.
  */
checkStageCheckValidity(stageData,event){
    if(this.selectedCandidates[0]?.StageId!=undefined && this.selectedCandidates[0]?.StageId!=stageData?.InternalCode){
      this.alertStageSelectionMessage(stageData);
     }
}
  /*
 @Type: File, <ts>
 @Name: selectStageCanData function
 @Who: Suika
 @When: 22-May-2023
 @Why: EWM-11782 EWM-12504
 @What: To select stage candidate data.
  */
 isLastSatgeCand: boolean = false;
 selectedStageCode: string;
 selectedStageIndex: number;
selectStageCanData(stageData,Can,event, stageIndex:number){
  this.selectedStageIndex = stageIndex;
  if(event.checked===true){
    this.selectedStageCode = stageData?.InternalCode;
   this.selectedCandidates.push(Can);
    Can.CheckboxStatus=true;
   this.showAlertMsgOnCandidateSelection(stageData,Can,event);
     // End
  if (stageData?.lastStage) {
    this.isLastSatgeCand = true;
   }
   else{
    this.isLastSatgeCand = false;
   }
  }else{
     this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === Can.CandidateId) , 1)
      Can.CheckboxStatus=false;
       // @suika @whn 29-06-2023 @EWM-12925 modification as per story @EWM-12888
       let selectedItem = this.selectedCandidates.filter(res=>res.StageId==stageData?.InternalCode);
       if(selectedItem?.length==0){
         stageData.IsIntermediate =false;
         stageData.CheckboxStatus = false;
       }else{
         this.checkParentStageMark(stageData);
       }
    let res = this.selectedCandidates.filter(e => e?.StageId === this.lastStageIdObj?.InternalCode);
    if (res?.length > 0) {
      this.isLastSatgeCand = true
    }
    else {
      this.isLastSatgeCand = false
    }
  }
  this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
  if (!this.isSelectedCandOfFirstSatgesOnly) {
    this.isSelectedCandOfOtherSatgesOnly = true;
    if (this.selectedCandidates?.length > 1) {
      this.removeBtnTooltip = 'label_jobDetailsSelectedCandOnlyParent';
    }
    else{
      this.removeBtnTooltip = 'label_jobDetails_Remove'
    }
  }
  else{
    this.removeBtnTooltip = 'label_jobDetails_Remove';
    this.isSelectedCandOfOtherSatgesOnly = false;
  }
  // Adarsh singh
  if (this.selectedCandidates?.length>0) {
    this.showHideDocumentButtons = true;
    // check lat long
    this.selectedClientAndCandidateLatLong = this.checkClientAndCandidateLatLong(this.selectedCandidates[0]);
  }else{
    this.showHideDocumentButtons = false;
    this.selectedClientAndCandidateLatLong = this.checkClientAndCandidateLatLong(this.selectedCandidates[0]);
  }
}
checkParentStage(stageData){
  if(this.selectedCandidates?.length==0){
    stageData.IsIntermediate =false;
    stageData.CheckboxStatus = false;
    return;
  }
  let checkStage = stageData != null && stageData.candidates?.every(t => t.CheckboxStatus == 1 ||  t.CheckboxStatus == true);
  if(checkStage){
    stageData.IsIntermediate =false;
    stageData.CheckboxStatus = true;
  }else{
    stageData.CheckboxStatus = false;
    stageData.IsIntermediate =true;
  }
}
checkParentStageMark(stageData){
  if(this.selectedCandidates?.length==0){
    stageData.IsIntermediate =false;
    stageData.CheckboxStatus = false;
    return;
  }
 if(stageData.candidates?.length==this.selectedCandidates?.length){
  stageData.IsIntermediate =false;
  stageData.CheckboxStatus = true;
 }else{
  stageData.CheckboxStatus = false;
  stageData.IsIntermediate =true;
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
 openSingleCanActionView(can){
   let canArr = [];
   canArr.push(can);
  this.screeningObj.ClientId = this.JobDetails?.ClientId;
  this.screeningObj.ClientName = this.JobDetails?.ClientName;
  this.screeningObj.Address = this.jobLocation;
  this.screeningObj.WorkflowName=this.JobDetails?.WorkflowName;
  this.screeningObj.WorkflowId = this.JobDetails?.WorkflowId;
  this.screeningObj.JobId = this.JobId;
  this.screeningObj.JobTitle = this.JobName;
  this.screeningObj.WorkFlowStageName =(can?.StageName)?(can?.StageName):(can?.ParentName);
  this.screeningObj.WorkFlowStageId =(can?.StageId)?(can?.StageId):can?.ParentId;
  this.screeningObj.CandidateList = canArr;
  this.gridStateObj.GridId=this.GridId;
  this.gridStateObj.JobId=this.JobId;
  this.gridStateObj.JobFilterParams=this.filterConfig;
  this.gridStateObj.search=this.searchValue;
  this.gridStateObj.PageNumber=this.pageNum;
  this.gridStateObj.PageSize=this.pagesize;
  this.gridStateObj.OrderBy=this.sortingValue;
  this.gridStateObj.Source=this.Source;
  this.screeningObj.GridState=this.gridStateObj;
  this.screeningObj.JobReferenceId = this.JobReferenceId;
  this.screeningObj.JobHeadCount = this.headerListData?.HeaderAdditionalDetails?.HeadCount;
  this.screeningObj.isLastSatgeCand = this.isLastSatgeCand;
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
  const dialogRef = this.dialog.open(JobScreeningComponent,{
    data: new Object({ candidateInfo:this.candidateScreeningInfo,TimelinePopup:true}),
    panelClass: ['screening-and-interview-modal', 'screening-and-interview-animation', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if(res?.event==true && res?.reloadData==true){
      if(this.drawerIconStatus){
        this.getCandidateJobFilterCount(this.JobId,this.workflowId);
      }
      setTimeout(()=>{
        //this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,'');
      this.switchListMode(this.viewMode);
      },1000)
    }
  })
}
  /*
 @Type: File, <ts>
 @Name: openActionView function
 @Who: Suika
 @When: 22-May-2023
 @Why: EWM-11782 EWM-12504
 @What: To open action view details.
  */
openActionView(){
  this.screeningObj.ClientId = this.JobDetails?.ClientId;
  this.screeningObj.ClientName = this.JobDetails?.ClientName;
  this.screeningObj.Address = this.jobLocation;
  this.screeningObj.WorkflowName=this.JobDetails?.WorkflowName;
  this.screeningObj.WorkflowId = this.JobDetails?.WorkflowId;
  this.screeningObj.JobId = this.JobId;
  this.screeningObj.JobTitle = this.JobName;
  this.screeningObj.WorkFlowStageName =this.selectedCandidates[0]?.ParentName?this.selectedCandidates[0]?.ParentName:this.selectedCandidates[0]?.StageName;
  this.screeningObj.WorkFlowStageId =this.selectedCandidates[0]?.ParentId?this.selectedCandidates[0]?.ParentId:this.selectedCandidates[0]?.StageId;
  this.screeningObj.CandidateList = this.selectedCandidates;
  this.gridStateObj.GridId=this.GridId;
  this.gridStateObj.JobId=this.JobId;
  this.gridStateObj.JobFilterParams=this.filterConfig;
  this.gridStateObj.search=this.searchValue;
  this.gridStateObj.PageNumber=this.pageNum;
  this.gridStateObj.PageSize=this.pagesize;
  this.gridStateObj.OrderBy=this.sortingValue;
  this.gridStateObj.Source=this.Source;
  this.screeningObj.GridState=this.gridStateObj
  this.screeningObj.JobReferenceId = this.JobReferenceId;
  this.screeningObj.JobHeadCount = this.headerListData?.HeaderAdditionalDetails?.HeadCount;
  this.screeningObj.isLastSatgeCand = this.isLastSatgeCand;
  this.candidateScreeningInfo.push(this.screeningObj);
  const dialogRef = this.dialog.open(JobScreeningComponent,{
    data: new Object({ candidateInfo:this.candidateScreeningInfo}),
    panelClass: ['screening-and-interview-modal', 'screening-and-interview-animation', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if(res.event==true && res.reloadData==true){
      if(this.drawerIconStatus){
        this.getCandidateJobFilterCount(this.JobId,this.workflowId);
      }
      this.getWorkFlowStages(this.workflowId);
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
    @Name: alertStageSelectionMessage function
    @Who: Suika
    @When: 24-May-2023
    @Why: EWM-11782 EWM-12504
    @What: For Alert validation message
  */
 public alertStageSelectionMessage(stageData){
  const message = `label_stage_selection_error`;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,message:message},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
    if(this.viewMode=='listMode'){
      this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === stageData.CandidateId) , 1);
      stageData.CheckboxStatus=false;
    }else{
      stageData?.candidates?.forEach(element => {
        element.CheckboxStatus=false;
       let selectedCan = this.selectedCandidates.filter(res=>res.CandidateId!=element.CandidateId);
       this.selectedCandidates = selectedCan;
      });
      stageData.CheckboxStatus = false;
      stageData.IsIntermediate = false;
    }
  })
}
  /*
    @Type: File, <ts>
    @Name: alertStageSelectionMessage function
    @Who: Suika
    @When: 24-May-2023
    @Why: EWM-11782 EWM-12504
    @What: For Alert validation message
  */
 public alertStageListSelectionMessage(){
  const message = `label_stage_selection_error`;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,message:message},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
    if(this.viewMode=='listMode'){
      this.gridListData?.forEach(element => {
         element.CheckboxStatus=false;
         this.allComplete=false;
         this.IsIntermediate = false;
         this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === element.CandidateId) , 1)
       });
    }
  })
}
  /*
    @Type: File, <ts>
    @Name: HideStageDetails function
    @Who: Suika
    @When: 24-May-2023
    @Why: EWM-11782 EWM-12504
    @What: For Hidding stages details
  */
HideStageDetails(stageData){
  if((this.stages?.length-1)==this.HideStageIds?.length){
    this.alertHideStageMessage(stageData);
  }else{
    stageData.StageVisibility=0;
    stageData.CheckboxStatus = false;
    stageData.IsIntermediate = false;
    stageData?.candidates?.forEach(element => {
      element.CheckboxStatus=false;
    })
    this.HideStageIds.push(stageData.InternalCode);
    let selectedCan = this.selectedCandidates.filter(res=>res.StageId!=stageData.InternalCode);
    this.selectedCandidates = selectedCan;
    // @suika @EWM-13302 @whn 05-08-2023 hide show issues fixes
  this.hideShowStagesDetails();
  }
  if (this.selectedCandidates?.length > 0) {
    this.showHideDocumentButtons = true;
  } else {
    this.showHideDocumentButtons = false;
  }
  // End
}
  /*
    @Type: File, <ts>
    @Name: alertHideStageMessage function
    @Who: Suika
    @When: 31-May-2023
    @Why: EWM-12465 EWM-12504
    @What: For Alert validation message
  */
 public alertHideStageMessage(stageData){
  const message = `label_stage_hide_error`;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,message:message},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
   this.ShowStageDetails(stageData);
  })
}
  /*
    @Type: File, <ts>
    @Name: ShowStageDetails function
    @Who: Suika
    @When: 24-May-2023
    @Why: EWM-11782 EWM-12504
    @What: For showing  stages details
  */
ShowStageDetails(stageData){
  this.dataArr?.forEach(element => {
    this.stages?.forEach(res => {
     if(element.InternalCode==res.InternalCode){
       res.StageVisibility = 1;
       this.HideStageIds.splice(this.HideStageIds.findIndex(a => a.InternalCode === res.InternalCode),1);
     }
    })
  });
  stageData.StageVisibility=1;
  // @suika @EWM-13302 @whn 05-08-2023 hide show issues fixes
  this.hideShowStagesDetails();
}
  /*
    @Type: File, <ts>
    @Name: showAllStages function
    @Who: Suika
    @When: 31-May-2023
    @Why: EWM-12465 EWM-12504
    @What: For showing  stages details
  */
showAllStages(){
    this.stages?.forEach(res => {
       res.StageVisibility = 1;
       this.HideStageIds.splice(this.HideStageIds.findIndex(a => a.InternalCode === res.InternalCode),1);
    })
     // @suika @EWM-13302 @whn 05-08-2023 hide show issues fixes
     this.hideShowStagesDetails();
}
 /*
    @Type: File, <ts>
    @Name: alertStageSelectionMessage function
    @Who: Suika
    @When: 24-May-2023
    @Why: EWM-11782 EWM-12504
    @What: For Alert validation message
  */
 public alertCandidatesSelectionMessage(stageData){
  const message = ''
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,message:message, message1: 'label_candidates_selection_error', message2: this.NoOfCanSelectedEachStage, message3: 'label_candidate'},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
    if(this.viewMode=='listMode'){
      this.gridListData?.forEach(element => {
       // element.IsIntermediate = false;
        element.CheckboxStatus=false;
        this.allComplete=false;
        this.IsIntermediate = false;
        this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === element.CandidateId) , 1)
      });
    }else{
      stageData?.candidates?.forEach(element => {
        element.CheckboxStatus=false;
        this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === element.CandidateId) , 1)
      });
      stageData.CheckboxStatus = false;
      stageData.IsIntermediate = false;
     // this.checkParentStage(stageData); /**********When:07-07-2023 @Why:EWM-12888 EWM-13028 @Who: RENU */
    }
  })
}
 /*
    @Type: File, <ts>
    @Name: alertStageSelectionMessage function
    @Who: Suika
    @When: 24-May-2023
    @Why: EWM-11782 EWM-12504
    @What: For Alert validation message
  */
 public alertStageCandidatesSelectionMessage(stageData){
  const message = ``;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,message:message, message1: 'label_candidates_selection_error', message2: this.NoOfCanSelectedEachStage, message3: 'label_candidate'},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
  })
}
 /*
    @Type: File, <ts>
    @Name: alertStageSelectionMessage function
    @Who: Suika
    @When: 24-May-2023
    @Why: EWM-11782 EWM-12504
    @What: For Alert validation message
  */
 public alertSingleCandidatesSelectionMessage(stageData,Can){
  const message = ``;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,message:message, message1: 'label_candidates_selection_error', message2: this.NoOfCanSelectedEachStage, message3: 'label_candidate'},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
    if(this.viewMode=='listMode'){
        Can.CheckboxStatus=false;
        this.allComplete=false;
        this.IsIntermediate = true;
        this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === Can.CandidateId) , 1)
    }else{
      this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === Can.CandidateId) , 1)
      Can.CheckboxStatus=false;
      stageData.CheckboxStatus = false;
     // stageData.IsIntermediate = true;/**********When:07-07-2023 @Why:EWM-12888 EWM-13037 @Who: RENU */
      //this.checkParentStage(stageData); /**********When:07-07-2023 @Why:EWM-12888 EWM-13037 @Who: RENU */
    }
  })
}
filterStageWiseData(node){
  if(this.viewMode == "listMode"){
    this.selectedCandidates = [];
    this.allComplete = false;
    if(this.SelectedStageId==node.InternalCode){
      this.SelectedStageId = ''
    }else{
      this.SelectedStageId = node.InternalCode;
    }
    this.commonMethodeGetData = {
      Type: CommonMethodeType.REALOAD_FILTER_STAGES,
      SelectedStageId : this.SelectedStageId,
      stagesList: this.stagesList,
      stages: this.stages,
      JobFilterParams: this.filterConfig,
    }
  }
}
/*
  @Type: File, <ts>
  @Name: someComplete function
  @Who: Suika
  @When: 24-May-2023
  @Why: EWM-11782 EWM-12504
*/
someComplete(): boolean {
 if (this.gridListData == null) {
    return;
  }
  return this.gridListData.filter(t => t.IsIntermediate).length > 0 && !this.allComplete;
}
 /*
  @Type: File, <ts>
  @Name: updateAllComplete function
  @Who: Suika
  @When: 24-May-2023
  @Why: EWM-11782 EWM-12504
*/
updateAllComplete() {
 // this.allComplete = this.gridListData != null && this.gridListData.every(t => t.CheckboxStatus == 1);
  if(this.selectedCandidates?.length>0){
    this.IsIntermediate = true;
   }else{
    this.IsIntermediate = false;
    this.allComplete = false;
   }
}
checkListParentStage(stageData){
  if(this.selectedCandidates?.length==0){
    this.IsIntermediate =false;
    this.allComplete = false;
    return;
  }
  let checkStage = stageData != null && this.gridListData.every(t => t.CheckboxStatus == 1 ||  t.CheckboxStatus == true);
  if(checkStage){
    this.IsIntermediate = false;
    this.allComplete =true;
  }else{
    this.allComplete =false;
    this.IsIntermediate =true;
  }
 }
/*
@Type: File, <ts>
@Name: setAll function
@Who: Suika
@When: 24-May-2023
@Why: EWM-11782 EWM-12504
what:for set all checkbox
*/
setAll(completed: boolean) {
  if (completed &&  this.IsIntermediate==false) {
    this.allComplete = true;
    this.IsIntermediate = false;
    if (this.gridListData == null) return;
    this.gridListData.forEach((t,index) => {
        t.CheckboxStatus=true;
    });
  }
  else {
    this.allComplete = true;
    setTimeout(() => {
      this.allComplete=false;
      this.IsIntermediate=false;
    }, 10);
    this.gridListData.forEach((t:any) => {
      t.CheckboxStatus = false;
    });
  }
  // @suika @EWM-12925 @whn 29-06-2023  modification as per story @EWM-12888
    this.selectedCandidates=this.gridListData.filter(x=>x.CheckboxStatus==true);
    // adarsh singh EWM-14729 13-OCT-23
    this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
    if (!this.isSelectedCandOfFirstSatgesOnly) {
      this.isSelectedCandOfOtherSatgesOnly = true;
    }else {
      this.isSelectedCandOfOtherSatgesOnly = false;
    }
    // End
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
  this.selectedCandidates=this.gridListData.filter(x=>x.CheckboxStatus==1);
    // adarsh singh EWM-14729 13-OCT-23
  this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
  if (!this.isSelectedCandOfFirstSatgesOnly) {
    this.isSelectedCandOfOtherSatgesOnly = true;
  }else {
    this.isSelectedCandOfOtherSatgesOnly = false;
  }
  //  End
  this.checkListParentStage(data);
}
 /*
  @Type: File, <ts>
  @Name: checkStageListValidity function
  @Who: Suika
  @When: 24-May-2023
  @Why: EWM-11782 EWM-12504
*/
checkStageListValidity(data){
    let ndata = this.selectedCandidates?.filter(res=>res.ParentId!=data?.ParentId);
    if(ndata?.length>0){
      this.alertStageSelectionMessage(data);
    }
}
 /*
  @Type: File, <ts>
  @Name: hideShowStagesDetails function
  @Who: Suika
  @When: 24-May-2023
  @Why: EWM-11782 EWM-12504
*/
 hideShowStagesDetails(){
 let hideStageData =this.stages?.filter(res=>res.StageVisibility==0);
 if(hideStageData?.length>0){
   hideStageData.forEach(element => {
    this.HideStageIds.push(element.InternalCode);
   });
 }
 this.HideStageIds = this.HideStageIds.filter((n, i) =>  this.HideStageIds.indexOf(n) === i);
 this.StageDetailsObj.StageIds = this.HideStageIds.toString()?this.HideStageIds.toString():'';
 this.jobService.hideWorkflowStage(this.StageDetailsObj).subscribe(
  (repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.cardloading = false;
    } else if (repsonsedata.HttpStatusCode === 204) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.cardloading = false;
    } else if (repsonsedata.HttpStatusCode === 400) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.cardloading = false;
    }
  }, err => {
    if (err.StatusCode == undefined) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      return false;
    }
  })
 }
    /*
  @Name: getBackgroundColor function
  @Who: Bantee Kumar
  @When: 23-06-2023
  @Why: EWM-7926
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}
/*
  @Name: getSelectedCandidatesSameStageFlag function
  @Who: Suika
  @When: 23-06-2023
  @Why: EWM-12888 EWM-12925
  @What: get stage selection flag
*/
getSelectedCandidatesSameStageFlag(){
  if(this.selectedCandidates?.length==0){
    return true;
  }
  let checkStage = [];
  if(this.viewMode=='cardMode'){
     checkStage = this.selectedCandidates != null && this.selectedCandidates?.filter(t => t.StageId != this.selectedCandidates[0].StageId);
  }else{
     checkStage = this.selectedCandidates != null && this.selectedCandidates?.filter(t => t.ParentId != this.selectedCandidates[0].ParentId);
  }
    if(checkStage?.length>0){
      this.commonTooltipFunTrue();
      return true;
    }else{
      this.commonTooltipFunFalse();
      return false;
    }
}
getBulkSmsFlag(){
  if(!this.isSMSStatus && this.selectedCandidates==null ||this.selectedCandidates==undefined || this.selectedCandidates?.length==0){
    return true;
  }else{
    let checkStage = this.selectedCandidates != null && this.selectedCandidates?.filter(t => t.PhoneNumber != "");
    if(!this.isSMSStatus || checkStage?.length>0){
      return false;
    }{
      return true;
    }
  }
}
/*
   @Type: File, <ts>
   @Name: getCandidateInfo function
   @Who: Adarsh Singh
   @When: 03-July-2023
   @Why: EWM-12879 EWM-1293
*/
  getCandidateInfo(cand: any) {
    let candArr: [string] = [cand.CandidateId];
    setTimeout(() => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + cand.CandidateId);
      if (candDiv.classList.contains("unread")) {
        candDiv.classList.remove("unread");
        this.commonserviceService.candidateProfileReadUnread(candArr, this.JobId);
        cand.IsProfileRead = 1;
      }
    }, 600);
  }
 //-----@When: 09-Aug-2023 @who:Adarsh singh @why: EWM-13021 --------
 closeActivity(){
  localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for remove value from localstorage
  this.activityStatus=false;
}
 //-----@When: 20-sep-2023 @who:maneesh  function: openStatus() for open edit status popup @why: EWM-11774 --------
openStatus() {
  const dialogRef = this.dialog.open(JobDeatilsHeaderStatusComponent, {
    maxWidth: "550px",
    data: { JobId: this.JobId,currentStatus:this.currentStatus,JobName:this.JobName },
    width: "95%",
    maxHeight: "85%",
    panelClass: ['quick-modalbox', 'add_manageAccess', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    autoFocus: false
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) {
      this.commonserviceService.ChangeStatusObj.subscribe((data:any)=>{
        this.currentStatus = data;
      })
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
  @Name: markAsRead function
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For mark as read
   */
  markAsRead(cand) {
   this.commonMarkAsRead(this.selectedCandidates)
  }
  /*
  @Type: File, <ts>
  @Name: markAsUnRead function
  @Who: Renu
  @When: 26-Oct-2023
  @Why: EWM-14918 EWM-14941
  @What: For mark as Un-read
   */
  markAsUnRead(cand) {
    this.commonMarkAsUnRead(this.selectedCandidates)
   }
   /*
  @Type: File, <ts>
  @Name: OpenVersionPopUp function
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For open Resume Popup
   */
  OpenResumePopUp(canDetails) {
  this.commonMarkAsReadSingle(canDetails)
    const dialogRef = this.dialog.open(ParsedResumeKeywordSearchComponent, {
      // maxWidth: "1000px",
      // width: "90%",

      // maxHeight: "560px",
      data:{CandidateId:canDetails.CandidateId, canDetails:canDetails},
      // @When: 16-10-2023 @who:Amit @why: EWM-14822 @what: class remove
      panelClass: ['xeople-modal-lg', 'resume-view-parse', 'animate__animated', 'animate__zoomIn'],
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
  @Name: OpenApplicationFormPopUp function
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For open Application form Pop up
   */
  OpenApplicationFormPopUp(canDetails) {
    this.commonMarkAsReadSingle(canDetails)
    const dialogRef = this.dialog.open(CandidateJobApplicationFormComponent, {
      data:{JobId:this.JobId,canDetails:canDetails},
      panelClass: ['xeople-modal-lg', 'candidate-jobapplicationform', 'animate__animated', 'animate__zoomIn','animate__slow'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {}
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
  @Name: markPinUnPin function
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For markPinUnPin
   */
  markPinUnPin(can: { IsPin: number; },candidates: any,index:number){
    let isPin: number ;
    if(can.IsPin==1){
      can.IsPin = 0;
      isPin = 0;
    }else{
      can.IsPin = 1;
      isPin = 1;
    }
    this.pinunpinCandidate(can,isPin)
    this.sortByPinAndDate(candidates,index);

  }
  /*
  @Type: File, <ts>
  @Name: sortCandidateData function
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For sortCandidateData
   */
  sortCandidateData(a, b, field, type: string, direction: string) {
    if (type === 'string') {
      if (a[field] < b[field]) {
        return direction === 'asc' ? -1 : 1;
      } else if (a[field] > b[field]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    } else {
      return direction === 'asc' ? a[field] - b[field] : b[field] - a[field];
    }
  }
   /*
  @Type: File, <ts>
  @Name: customSort function
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For customSort
   */
  customSort(a, b, field, type: string, direction: string) {
    return this.sortCandidateData(a, b, field, type, direction);
  }
 /*
  @Type: File, <ts>
  @Name: sortByPinAndDate function
  @Who: Suika
  @When: 27-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: For sortByPinAndDate
   */
  sortByPinAndDate(can,index:number) {
    this.stages[index].candidates=[...can.sort((a, b) => {
      let IsPinSort = this.customSort(a, b, 'IsPin', 'number', 'desc');
      let LastActivitySort = this.customSort(a, b, 'LastActivity', 'string', 'desc');
      if (IsPinSort === 0) {
        return LastActivitySort;
      }
      return IsPinSort;
    })]
  }
/*
  @Type: File, <ts>
  @Name: like Candidate function
  @Who: Suika, Adarsh
  @When: 31-Aug-2023
  @Why: EWM-13813 EWM-13813 , EWM-14419
*/public swiperLoader=false;
  likeCandidate(can,stageCandList,Id){
    
    document.getElementById("thumb-up-btn_"+Id).style['pointer-events'] = 'none';
    let canArr = [];
    canArr.push({
    CandidateId:can?.CandidateId,
    CandidateName:can?.CandidateName,
    StageId:can?.WorkFlowStageId,
    StageName:can?.WorkFlowStageName,
    StageDisplaySeq:can?.StageDisplaySeq,
    StageType:can?.StageType   // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
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
      this.dataChangeStatus=false;
       let data = repsonsedata.Data;
       if (data?.length == 1) {
         //  Adarsh singh EWM-14419 on 20-09-2023 @dec- push candidate to rejected satge
         let nextStageId = repsonsedata.Data?.[0]?.NextStageId;
         let parentStageId = repsonsedata.Data?.[0]?.ParentStageId;
         let nextStageName = repsonsedata.Data?.[0]?.NextStageName;
         let LastActivity=repsonsedata.Data?.[0]?.LastActivity;
         let nextStageType = repsonsedata.Data?.[0]?.NextStageType;  // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
         const getCurrentStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === stageCandList?.InternalCode);
         const nextStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === parentStageId);
         const IsLastStage =this.stages.filter(x=>x?.InternalCode===nextStageId)[0]?.IsLastStage;
         if (nextStageIndex !== -1) {
           can.StageId = nextStageId;
           can.StageName = nextStageName;
           can.StageType = nextStageType;
           can.LastActivity=LastActivity;
           this.stages[nextStageIndex].candidates.push(can);
           const currentCandIndex = stageCandList.candidates?.findIndex(obj => obj?.CandidateId === can.CandidateId);
           this.stages[getCurrentStageIndex].candidates.splice(currentCandIndex, 1);
           can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
           can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
           can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
           this.cardloading = false;
           let stages = this.stages;
           this.stages = stages;
            /************@when-0-11-2023 @who:renu @why:EWM-14999 EWM-15107 For showing updated count on like/dislike */
           this.stages?.forEach(res => {
            res.candidates=[...res.candidates]
           // res.candidatesCount = res.candidates?.length
          });
          this.getWorkFlowStagesForClient(this.workflowId);
         }
         if(IsLastStage===1){
          this.xeepService.performAction('eats-cookie');
        }
         // End
       }
       else{
       }
    document.getElementById("thumb-up-btn_"+Id).style['pointer-events'] = 'auto';
     } else if (repsonsedata.HttpStatusCode === 204) {
       this.cardloading = false;
       if (repsonsedata.Message == '400056') {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       }
      document.getElementById("thumb-up-btn_"+Id).style['pointer-events'] = 'auto';
     } else if (repsonsedata.HttpStatusCode === 400) {
       this.cardloading = false;
      document.getElementById("thumb-up-btn_"+Id).style['pointer-events'] = 'auto';
      if (repsonsedata.Message === "400058") {
        this.alertMaxCandidateAddInLastStage();
      }
     }
   }, err => {
     if (err.StatusCode == undefined) {
   
       //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       return false;
     }
   })
  }
  /*
  @Type: File, <ts>
  @Name: dislikeCandidate function
  @Who: Suika, Adarsh singh
  @When: 31-Aug-2023
  @Why: EWM-13813 EWM-13813,  EWM-14419
*/
  dislikeCandidate(can, stageCandList, Id){
  document.getElementById("thumb-down-btn_"+Id).style['pointer-events'] = 'none';
  let canArr = [];
  if (this.selectedCandidates?.length > 0) {
    this.selectedCandidates?.forEach((e:any)=>{
      canArr.push({
        CandidateId:e?.CandidateId,
        CandidateName:e?.CandidateName,
        StageId:e?.WorkFlowStageId,
        StageName:e?.WorkFlowStageName,
        StageDisplaySeq:e?.StageDisplaySeq,
      })
    })
   }
   else{
    canArr.push({
      CandidateId:can?.CandidateId,
      CandidateName:can?.CandidateName,
      StageId:can?.WorkFlowStageId,
      StageName:can?.WorkFlowStageName,
      StageDisplaySeq:can?.StageDisplaySeq,
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
     this.dataChangeStatus=true;
     let data = repsonsedata.Data;
     if (data?.length == 1) {
       //  Adarsh singh EWM-14419 on 20-09-2023 @dec- push candidate to rejected satge
       let rejectedStageId = repsonsedata.Data?.[0]?.NextStageId;
       let nextStageName = repsonsedata.Data?.[0]?.NextStageName;
       let LastActivity=repsonsedata.Data?.[0]?.LastActivity;
       let nextStageType=repsonsedata.Data?.[0]?.NextStageType; // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
       const getCurrentStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === stageCandList?.InternalCode);
       const nextStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === rejectedStageId);
       if (nextStageIndex !== -1) {
         can.StageId = rejectedStageId;
         can.StageName = nextStageName;
         can.StageType = nextStageType; 
         can.LastActivity=LastActivity;
         this.stages[nextStageIndex].candidates.push(can);
         const currentCandIndex = stageCandList.candidates?.findIndex(obj => obj?.CandidateId === can.CandidateId);
         this.stages[getCurrentStageIndex].candidates.splice(currentCandIndex, 1);
         can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
         can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
         can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
         this.cardloading = false;
         let stages = this.stages;
         this.stages = stages;
         /************@when-0-11-2023 @who:renu @why:EWM-14999 EWM-15107 For showing updated count on like/dislike */
         this.stages?.forEach(res => {
          res.candidates=[...res.candidates]
         // res.candidatesCount = res.candidates?.length
        });
        this.getWorkFlowStagesForClient(this.workflowId);
        this.xeepService.performAction('binshot')
       }
       // End
     }
     else{
     }
     document.getElementById("thumb-down-btn_"+Id).style['pointer-events'] = 'auto';
   } else if (repsonsedata.HttpStatusCode === 204) {
    // this.openMoveBoxModal(can);
     this.cardloading = false;
     if (repsonsedata.Message == '400054') {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
     }
     document.getElementById("thumb-down-btn_"+Id).style['pointer-events'] = 'auto';
   } else if (repsonsedata.HttpStatusCode === 400) {
     this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
     this.cardloading = false;
     document.getElementById("thumb-down-btn_"+Id).style['pointer-events'] = 'auto';
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
  @Name: pinunpinCandidate function
  @Who: Suika
  @When: 31-Aug-2023
  @Why: EWM-13813 EWM-13813
*/
pinunpinCandidate(can,isPin){
  this.jobDetails.CandidateId=can.CandidateId?[can.CandidateId]:[""];
  this.jobDetails['IsPin']=isPin==1?true:false;
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
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - open activity modal --------->
onOpenCandidateCardActivityPop(){
  let jobIdNameObj = {};
  let selectedCandArr:{ Id: string; Name: string; Email: string;}[] = [];
  jobIdNameObj['jobName'] = this.JobName;
  jobIdNameObj['jobId'] = this.JobId;
  selectedCandArr?.push({
    'Id': this.selectedCandidates[0]?.CandidateId,
    'Name': this.selectedCandidates[0]?.CandidateName,
    'Email': this.selectedCandidates[0]?.EmailId
    })
    this.commonMarkAsRead(this.selectedCandidates);
  const dialogRef = this.dialog.open(JobCandidateCardActivityComponent, {
    data: {activityActionForm: this.activityActionForm, utctimezonName:this.utctimezonName,
      timezonName: this.timezonName, timePeriod: this.timePeriod, isSlotActive: this.isSlotActive,activityObj:jobIdNameObj,
      slotsData: this.slotsData,  candidateId: this.candidateId,syncCandidateAttendeeList:selectedCandArr,WorkFlowStageId:this.WorkFlowStageId,
      stageName: this.selectedCandidates[0]?.WorkFlowStageName},
    panelClass: ['xeople-drawer-lg', 'xeople-drawer-activity',  'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
}
ConformationUpdateApplicantProfile(){
  const message = `label_jobDetails_ApplicantProfileUpdate_Conformation`;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.UpdateApplicantProfile();
    }
  });
}
UpdateApplicantProfile(){
  let canArr = [];
  this.selectedCandidates?.forEach((e:any)=>{
    canArr.push({
      CandidateId:e?.CandidateId,
      JobId: this.JobId,
      JobName: this.JobName,
    })
  })
  let payload = canArr;
  this.jobService.applicantProfileUpdate(payload).subscribe((repsonsedata: ResponceData) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
    } else if (repsonsedata.HttpStatusCode === 400) {
      this.cardloading = false;
    }
  }, err => {
    if (err.StatusCode == undefined) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      return false;
    }
  })
}
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - openNewEmailModalForSingleMultiCand --------->
openNewEmailModalForSingleMultiCand(){
  if (this.selectedCandidates?.length ===1) {
    this.multipleEmail = true;
    this.candidateIdData = this.selectedCandidates[0]?.CandidateId;//who:maneesh,what:ewm-14998 for send candidate id,when:31/10/2023
    let selectedCandArr:{ CandidateId: string; EmailId: string;}[] = [];
    this.selectedCandidates?.forEach(element => {
      selectedCandArr?.push({
        'CandidateId': element?.CandidateId,
        'EmailId': element?.EmailId
        })
    });
   this.toEmailList = selectedCandArr;
    // this.openMail(this.selectedCandidates, this.IsEmailConnected, false);
    this.onBulkEmail(); //as discuss with nitin kumar sir and mukesh sir send candidate list parameter when:04/12/2024
    this.commonMarkAsRead(this.selectedCandidates);
  }
  else{
    this.onBulkEmail();
  }
}
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - checkZoomConnectedOrNot --------->
checkZoomConnectedOrNot(){
  let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
  // Zoom
  let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode === this.zoomPhoneCallRegistrationCode);
  this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;
  // SMS
  let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode === this.burstSMSRegistrationCode);
  this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;
  this.zoomSMSTooltipMSG();

  // EOH
  let eohRegistrationCode = otherIntegrations?.filter(res=>res.RegistrationCode === this.eohRegistrationCode);
  this.IsEOHIntergrated = eohRegistrationCode[0]?.Connected;
}

redirectOnMarketPlace(){
  this.route.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode))
}
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - onMappCandidateFolder --------->
    onMappCandidateFolder() {
      let selectedCandArr:any = [];
      this.selectedCandidates?.forEach(element => {
        selectedCandArr?.push(element.CandidateId)
      });
    this.commonMarkAsRead(this.selectedCandidates);
      const dialogRef = this.dialog.open(MulitpleCandidateFolderMappingComponent, {
        data: new Object({ candidateIdArr: selectedCandArr, labelAddFolder: true }),
        panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == false) {
          this.folderCancel = 1;
          this.commonserviceService.onOrgSelectFolderId.next(this.folderCancel);
          // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
        } else {
        }
      })
    }
    ApplicantProfileUpdate(){
    //  console.log('ApplicantProfileUpdate');
    }
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - pin unpin for multiple candidate in card view --------->
  pinUnPinForMultipleCand() {
    this.pinUnpinMutltipleCandidate();
    this.commonMarkAsRead(this.selectedCandidates)
  }
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - pin unpin for multiple candidate in card view --------->
  pinUnpinMutltipleCandidate() {
    let selectedCandArr: any = [];
    this.selectedCandidates?.forEach(element => {
      selectedCandArr?.push(element.CandidateId)
      element['IsPin'] = 1
    });
    this.jobDetails.CandidateId = selectedCandArr;
    this.jobDetails['IsPin'] = true;
    // get candidate satge wise
    let indexOf= this.stages.findIndex(x=>x.InternalCode === this.selectedCandidates[0]?.StageId);
    let stageWiseCand = this.stages?.filter(e => e?.InternalCode === this.selectedCandidates[0]?.StageId);
    this.sortByPinAndDate(stageWiseCand[0]?.candidates,indexOf);
    // End
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
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - send single and multiple candidate sms --------->
  onSendSMSToCandidate(){
    if (this.selectedCandidates?.length === 1) {
      this.candidateIdData = this.selectedCandidates[0].CandidateId;
      this.getSMSHistoryData(this.selectedCandidates[0]);
      this.smsHistoryToggel = true;
      this.quickFilterToggel=false;
    }
    else{
      this.openJobBulkSMSForCandidate();
    }
    this.commonMarkAsRead(this.selectedCandidates);
  }
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc -open show google map location popup --------->
openLatLongPopForCandidate() {
    let canData = this.selectedCandidates[0];
    if (this.checkClientAndCandidateLatLong(this.selectedCandidates[0])) {
    this.commonMarkAsRead(this.selectedCandidates);
      const dialogRef = this.dialog.open(JobDetailsCardViewgoogleMapsLocationPopComponent, {
        data: new Object({
          jobLat: this.JobLatitude, jobLong: this.JobLongitude, jobAddress: this.jobLocation,
          canLat: canData?.Latitude, canLong: canData?.Longitude, canAddress: canData?.Location
        }),
        panelClass: ['xeople-modal', 'candidateLatLong', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    }
  }
// <!---------@When: 09-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - chec lat long it's common function --------->
  checkClientAndCandidateLatLong(canData) {
    if ((this.JobLatitude != undefined && this.JobLatitude != null && this.JobLatitude != '') &&
      (this.JobLongitude != undefined && this.JobLongitude != null && this.JobLongitude != '') &&
      (canData?.Latitude != undefined && canData?.Latitude != null && canData?.Latitude != '') &&
      (canData?.Longitude != undefined && canData?.Longitude != null && canData?.Longitude != '')) {
      return true;
    }
    else {
      return false;
    }
  }
// <!---------@When: 12-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - open close job modal --------->
  onOpenCloseJobModal(){
    const dialogRef = this.dialog.open(CloseJobComponent, {
      panelClass: ['xeople-modal-md', 'candidate-jobapplicationform', 'animate__animated', 'animate__zoomIn'],
      data: new Object({ JobTitle:this.StageDetailsObj.JobTitle,jobId:this.StageDetailsObj.JobId,WorkflowId:this.StageDetailsObj.WorkflowId,WorkflowName:this.StageDetailsObj.WorkflowName,JobStatusObj:this.StageDetailsObj.JobStatus}),
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult?.data) {
        this.getCandidateMappedJobHeader(this.JobId);
        this.switchListMode(this.viewMode);
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
// <!---------@When: 12-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - toggle bottom action bar on click more button--------->
  onToggleActionBar(can, stageCandList) {
    let ndata = this.selectedCandidates?.filter(res => res.StageId != stageCandList?.InternalCode);
    if (ndata?.length > 0) {
      ndata?.forEach(res => {
        let stageCand = this.stages?.filter(e => e?.InternalCode === res?.StageId);
        stageCand[0]?.candidates?.forEach(element => {
          element.CheckboxStatus = false;
        });
        stageCand[0].CheckboxStatus = false;
        stageCand[0].IsIntermediate = false;
      });
    }
    stageCandList?.candidates?.forEach((element, index) => {
      element.CheckboxStatus = false;
    });
    let checkStage = stageCandList != null && stageCandList?.candidates?.every(t => t.CheckboxStatus == 1 || t.CheckboxStatus == true);
    if (checkStage) {
      stageCandList.IsIntermediate = false;
      stageCandList.CheckboxStatus = true;
    } else {
      stageCandList.CheckboxStatus = false;
      stageCandList.IsIntermediate = true;
    }
    this.selectedCandidates = [];
    can.CheckboxStatus = true;
    this.selectedCandidates.push(can);
    if (this.selectedCandidates?.length > 0) {
      this.showHideDocumentButtons = true;
      // check lat long
      this.selectedClientAndCandidateLatLong = this.checkClientAndCandidateLatLong(this.selectedCandidates[0]);
    } else {
      this.showHideDocumentButtons = false;
      this.selectedClientAndCandidateLatLong = this.checkClientAndCandidateLatLong(this.selectedCandidates[0]);
    }
    // End
  }
// <!---------@When: 12-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc -close bottom action bar on click cross icon--------->
  onCloseToggleAction(){
    let stageWiseCand = this.stages?.filter(e => e?.InternalCode === this.selectedCandidates[0]?.StageId);
    stageWiseCand[0]?.candidates?.forEach(element => {
      element.CheckboxStatus = false;
    });
    stageWiseCand[0].CheckboxStatus = false;
    stageWiseCand[0].IsIntermediate = false;
    let ndata = this.selectedCandidates?.filter(res=>res.StageId!=stageWiseCand[0]?.InternalCode);
    if (ndata?.length > 0) {
      ndata?.forEach(res => {
        let stageCand = this.stages?.filter(e => e?.InternalCode === res?.StageId);
        stageCand[0]?.candidates?.forEach(element => {
          element.CheckboxStatus = false;
        });
         stageCand[0].CheckboxStatus = false;
         stageCand[0].IsIntermediate = false;
      });
    }
    this.selectedCandidates = [];
    this.showHideDocumentButtons = false;
  }
 //-----@When: 21-sep-2023 @who:maneesh  function: openjobDetailsViewOwner() for open edit status popup @why: EWM-11774 --------
openjobDetailsViewOwner(trigger,data) {
  let mode= localStorage.getItem('viewMode');
  localStorage.setItem('PageSource','JobDetails')
setTimeout(()=>{
  this.viewMode=mode;
},100)
  this.route.navigate([],{
    relativeTo: this.activatedRoute,
    queryParams:  {jobId: this.JobId, editForm:'editForm', floatingButton:false },
    queryParamsHandling: 'merge'
  });
  this._rtlService.onOverlayDrawerRTLHandler();
  this.triggerOrigin = trigger;
  this.candidateProfileDrwerForEdit = true;
  this.overlayCandidateProfile=!this.overlayCandidateProfile;
if (data=='ownersData') {
  this.ownersData=true;
}else if(data=='contact'){
  this.FocusContactField=true;
}else if(data=='workflow'){
  this.ownersData=false;
  this.FocusContactField=false;
  this.workflowStatus=true;
}
 }
 closeDrawerOfEditMode(e: any) {
  if (e == 2) {
    this.candidateProfileDrwerForEdit = false;
    this.overlayCandidateProfile=!this.overlayCandidateProfile;
  }
  else{
    this.CloseShareAssessmentFromJobAction();
  }
}
CloseShareAssessmentFromJobAction(){
  let mode= localStorage.getItem('viewMode');
  setTimeout(()=>{
    this.viewMode=mode;
  },100)
  this.overlayCandidateProfile=!this.overlayCandidateProfile;
  this.candidateProfileDrwerForEdit = false;
  this.route.navigate([],{
    relativeTo: this.activatedRoute,
    queryParams: {editForm:'null', floatingButton:'null' },
    queryParamsHandling: 'merge'
  });
  if(localStorage.getItem('JobDetailsReload')=='true'){
    this.getCandidateMappedJobHeader(this.JobId);
    localStorage.removeItem('JobDetailsReload')
  }
}
// Satya Prakash Gupta for EWM-14691 EWM-14724 open profile on 13-Oct-23
profilePicStatus:boolean;
closeProfile(){
  this.profilePicStatus=false;
}
// <!---------@When: 28-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc -open profile view modal--------> Satya Prakash Gupta for EWM-14691 EWM-14724 open profile on 13-Oct-23
openProfile(can, status): void {
  this.profilePicStatus=true;
  if(status=true){
    this.isOpen=can;
  }else{
    this.isOpen='';
  }
}
// <!---------@When: 09-10-2023 @who:Adarsh singh @why: EWM-14638 @Desc- make a common function for mark as read-------->
commonMarkAsRead(cand) {
  let candArrs: any = [];
  if (cand?.length > 0) {
    cand?.forEach(element => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + element.CandidateId);
      if (candDiv?.classList.contains("unread")) {
        candDiv?.classList.remove("unread");
        element.IsProfileRead = 1;
        candArrs.push(element.CandidateId)
      }
    });
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileReadUnread(candArrs, this.JobId);
    }
  }
}
// <!---------@When: 26-10-2023 @who: Renu @why: EWM-14918 EWM-14941 @Desc- make a common function for mark as UN-read-------->
commonMarkAsUnRead(cand){
  let candArrs: any = [];
  if (cand?.length > 0) {
    cand?.forEach(element => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + element.CandidateId);
      if (candDiv) {
        candDiv?.classList.add("unread");
        element.IsProfileRead = 0;
        candArrs.push(element.CandidateId)
      }
    });
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileUnread(candArrs, this.JobId);
    }
  }
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
// <!---------@When: 09-10-2023 @who:Adarsh singh @why: EWM-14638 @Desc-read profile on call clicked-------->
onCall(){
  this.commonMarkAsRead(this.selectedCandidates)
}
// <!---------@When: 12-10-2023 @who:Adarsh singh @why: EWM-14741 @Desc-remove multiple candiadte -------->
onOpenRemoveCandidatePop(){
  let data = this.firstStageData;
  this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
  const dialogRef = this.dialog.open(RemoveMultipleCandidateComponent, {
    maxWidth: "500px",
    data: new Object({ jobdetailsData:data,JobId: this.JobId,JobName:this.JobName, StatusData: data, candList: this.selectedCandidates }),
    width: "90%",
    maxHeight: "85%",
    panelClass: ['quick-modalbox', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) {
      this.jobService.pageDataChangeStatus(true);
      this.getCandidateMappedJobHeader(this.JobId);
      if (this.viewMode == 'cardMode') {
        this.getJobsummaryHeaderSourcepichart();
        this.getWorkFlowStages(this.workflowId);
      } else {
        this.getJobsummaryHeaderSourcepichart();
        this.getWorkFlowStages(this.workflowId);
        this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
        this.updateAllComplete();
      }
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
// <!---------@When: 12-10-2023 @who:Adarsh singh @why: EWM-14741 @Desc-check selected candidate of only 1st stage -------->
  checkSelectedCandOfFirstStage(){
    if (this.firstStageData === undefined || this.firstStageData === null){
      this.firstStageData=this.stagesList.find(item => item.SerialNumber === 1);
    }
    
    let res:boolean;
    if (this.selectedCandidates?.length > 0) {
     if (this.viewMode === 'cardMode') {
       res = this.selectedCandidates.every((e:any) => e?.StageId === this.firstStageData?.InternalCode);
     }
     else{
      res = this.selectedCandidates.every((e:any) => e?.ParentId === this.firstStageData?.InternalCode);
     }
    }
    else{
      res = false;
    }
    return res
  }
// <!---------@When: 12-OCT-2023 @who:Adarsh singh @why: EWM-14690 EWM-14729 @Desc-Accept from action bar function -------->
  onAccept(){
    this.swiperLoader=true;
    let canArr = [];
     this.selectedCandidates?.forEach((e:any)=>{
       canArr.push({
         CandidateId:e?.CandidateId,
         CandidateName:e?.CandidateName,
         StageId:e?.WorkFlowStageId,
         StageName:e?.WorkFlowStageName,
         StageDisplaySeq:e?.StageDisplaySeq,
       })
     })
     let payload = {
       JobId: this.JobId,
       JobName: this.JobName,
       Candidates: canArr,
       WorkflowId: this.workflowId,
       WorkflowName: this.WorkflowName,
      JobHeadCount: this.headerListData?.HeaderAdditionalDetails?.HeadCount
     }
    this.jobService.likeCandidate(payload).subscribe((repsonsedata: ResponceData) => {
      this.swiperLoader=false;
      if (repsonsedata.HttpStatusCode === 200) {
        if (this.viewMode === 'cardMode') {
          this.getWorkFlowStages(this.WorkflowId);
        } else {
          // Who:Ankit Rawat, What:EWM-17802, on switching the mode candidate is going blank (set local storage 'jobDetailsPageEventStatus'), When:07Aug24
          this.jobService.pageDataChangeStatus(true);
          // Who:Ankit Rawat, What:EWM-16947 Reload the workflow after accept the candidate, When:05Aug24
          this.getWorkFlowStages(this.WorkflowId);
          this.listViewPage?.performActionEventWise(EventType.REFRESH);
        }
        let nextStageId = repsonsedata.Data[0].NextStageId;
        const IsLastStage =this.stages.filter(x=>x?.InternalCode===nextStageId)[0]?.IsLastStage;
        if(IsLastStage===1){
          this.xeepService.performAction('eats-cookie');
        }
      }
      else if(repsonsedata.HttpStatusCode === 204){
        if (repsonsedata.Message == '400056') {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       }
      }
       else if (repsonsedata.HttpStatusCode === 400) {
        if (repsonsedata.Message === "400058") {
          this.alertMaxCandidateAddInLastStage();
        }
        this.cardloading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.swiperLoader=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        return false;
      }
    })
  }
// <!---------@When: 12-OCT-2023 @who:Adarsh singh @why: EWM-14690 EWM-14729 @Desc-reject from action bar function -------->
  onReject() {
    this.swiperLoader=true;
    let canArr = [];
    this.selectedCandidates?.forEach((e: any) => {
      canArr.push({
        CandidateId: e?.CandidateId,
        CandidateName: e?.CandidateName,
        StageId: e?.WorkFlowStageId,
        StageName: e?.WorkFlowStageName,
        StageDisplaySeq: e?.StageDisplaySeq,
      })
    })
    let payload = {
      JobId: this.JobId,
      JobName: this.JobName,
      Candidates: canArr,
      WorkflowId: this.workflowId,
      WorkflowName: this.WorkflowName
    }
    this.jobService.disLikeCandidate(payload).subscribe(
      (repsonsedata: ResponceData) => {
        this.swiperLoader=false;
        if (repsonsedata.HttpStatusCode === 200) {
          if (this.viewMode === 'cardMode') {
            this.getWorkFlowStages(this.WorkflowId);
          }
          else {
            // Who:Ankit Rawat, What:EWM-16947 Reload the workflow after accept the candidate, When:05Aug24
            this.getWorkFlowStages(this.WorkflowId);
            this.listViewPage?.performActionEventWise(EventType.REFRESH);
          }
          this.xeepService.performAction('binshot');
        }
        else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Message == '400054') {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
        }
        else if (repsonsedata.HttpStatusCode === 400) {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.StatusCode);
          this.cardloading = false;
        }
      }, err => {
        this.swiperLoader=false;
        if (err.StatusCode == undefined) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          return false;
        }
      })
  }
// <!---------@When: 16-OCT-2023 @who:Adarsh singh @why: EWM-13767 EWM-14823 @Desc-open job action window on click worklfow stage name -------->
  onOpenJobActionStageName(satageData) {
    if (this.getSelectedCandidatesSameStageFlag()) {
      return
    }
    else {
      let getArr = this.selectedCandidates.filter(e => e?.StageId === satageData?.InternalCode);
      if (getArr?.length > 0 && this.NoOfCanSelectedEachStage >= this.selectedCandidates?.length ) {
        this.openActionView();
      }
      else {
        return;
      }
    }
  }
  /*
    @Name: openCandidateDetails function
    @Who: Satya Prakash Gupta
    @When: 16-Oct-2023
    @Why: EWM-14828 EWM-14832 EWM-14833
    @What: For showing candidate detials information on click
    */
    openCandidateDetails(candidates: any) {
      let candidatelist=[];
      candidatelist.push(candidates);
      candidatelist?.forEach(element => {
       element["CandidateEmail"] = element?.EmailId,
       element["CandidateImage"] = element?.PreviewUrl,
       element["ShortName"] = element?.ShortName,
       element["Name"] = element?.CandidateName
      });
      //JobId:this.JobId use for ewm-17337 by maneesh
      this.dialog.open(ApplicantDetailPopupComponent, {
        data: { 'candidatedata': candidatelist[0],JobId:this.JobId},
        panelClass: ['xeople-candidate-info-card', 'open-candidate-details', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      // RTL code
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    }
    // <!---------@When: 16-OCT-2023 @who:Adarsh singh @why: EWM-13767 EWM-14823 @Desc-common tooltip change function-------->
  commonTooltipFunTrue() {
    this.acceptBtnTooltip = 'label_stageCanSelectionErr'
    this.rejectBtnTooltip = 'label_stageCanSelectionErr'
    this.pinBtnTooltip = 'label_stageCanSelectionErr';
    if (this.selectedCandidates?.length > this.NoOfCanSelectedEachStage) {
      this.actiontBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
      this.pinBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
      this.actiontBtnTooltipCount = this.NoOfCanSelectedEachStage;
      this.readBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
      this.moveToFolderBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
      this.unreadBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
    }
    else {
      this.actiontBtnTooltip = 'label_stageCanSelectionErr';
      this.pinBtnTooltip = 'label_stageCanSelectionErr';
      this.actiontBtnTooltipCount = '';
      this.readBtnTooltip = 'label_jobDetails_Read';
      this.moveToFolderBtnTooltip = 'label_jobDetails_MovetoFolder';
      this.unreadBtnTooltip = 'label_jobDetails_UnRead';
    }
    if (this.selectedCandidates?.length > 1) { //by maneesh ewm-17658 when:24/07/2025
      this.callBtnTooltip = 'label_selectOnlyOne';
    }else if(this.selectedCandidates?.length == 1 && this.selectedCandidates[0]?.PhoneNumber!='' && this.selectedCandidates[0]?.PhoneNumber!=null && this.selectedCandidates[0]?.PhoneNumber!=undefined){
      this.callBtnTooltip = 'label_call';      
    }
    else if(this.selectedCandidates[0]?.PhoneNumber=='' || this.selectedCandidates[0]?.PhoneNumber==null || this.selectedCandidates[0]?.PhoneNumber==undefined){
      this.callBtnTooltip = 'JobDetails_PhoneNumberEmpty';      
    }
    if (this.selectedCandidates?.length > 1) {
      this.activityBtnTooltip = 'label_selectOnlyOne';
    }
    else {
      this.activityBtnTooltip = 'label_MenuActivity';
    }
    if (!this.isAnyRejectedStageType) {
      this.rejectBtnTooltip = 'label_noRejectedStageFound'
    }
    if (this.isLastSatgeCand) {
      this.acceptBtnTooltip = 'label_noStageFound';
    }
    else{
      this.acceptBtnTooltip = 'label_stageCanSelectionErr';
    }
  }
// <!---------@When: 16-OCT-2023 @who:Adarsh singh @why: EWM-13767 EWM-14823 @Desc- common tooltip change function -------->
  commonTooltipFunFalse() {
    this.acceptBtnTooltip = 'label_jobDetails_Accept'
    this.rejectBtnTooltip = 'label_jobDetails_Reject'
    this.pinBtnTooltip = 'label_jobDetails_Pin';
    if (this.selectedCandidates?.length > 1) {
      this.activityBtnTooltip = 'label_selectOnlyOne';
    }
    else {
      this.activityBtnTooltip = 'label_MenuActivity';
    }
    if (this.selectedCandidates?.length > 1) { //by maneesh ewm-17658 when:24/07/2025
      this.callBtnTooltip = 'label_selectOnlyOne';
    }else if(this.selectedCandidates?.length == 1 && this.selectedCandidates[0]?.PhoneNumber!='' && this.selectedCandidates[0]?.PhoneNumber!=null && this.selectedCandidates[0]?.PhoneNumber!=undefined){
      this.callBtnTooltip = 'label_call';
    }
    else if(this.selectedCandidates[0]?.PhoneNumber=='' || this.selectedCandidates[0]?.PhoneNumber==null || this.selectedCandidates[0]?.PhoneNumber==undefined){
      this.callBtnTooltip = 'JobDetails_PhoneNumberEmpty';      
    }
    if (this.selectedCandidates?.length > this.NoOfCanSelectedEachStage) {
      this.actiontBtnTooltip = 'label_jobdetails_MaxCandSelectionError'
      this.pinBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
      this.readBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
      this.actiontBtnTooltipCount = this.NoOfCanSelectedEachStage;
      this.moveToFolderBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
      this.unreadBtnTooltip = 'label_jobdetails_MaxCandSelectionError';
    }
    else {
      this.actiontBtnTooltip = 'label_jobDetailsAction';
      this.pinBtnTooltip = 'label_jobDetails_Pin';
      this.readBtnTooltip = 'label_jobDetails_Read';
      this.moveToFolderBtnTooltip = 'label_jobDetails_MovetoFolder';
      this.actiontBtnTooltipCount = '';
      this.unreadBtnTooltip = 'label_jobDetails_UnRead';
    }
    if (!this.isAnyRejectedStageType) {
      this.rejectBtnTooltip = 'label_noRejectedStageFound'
    }
    if (this.isLastSatgeCand) {
      this.acceptBtnTooltip = 'label_noStageFound';
    }
    else{
      this.acceptBtnTooltip = 'label_jobDetails_Accept';
    }
  }
// <!---------@When: 16-OCT-2023 @who:Adarsh singh @why: EWM-13767 EWM-14823 @Desc- check zoom call status -------->
  zoomSMSTooltipMSG(){ //comment by maneesh
    // if (!this.zoomCheckStatus) {
    //   this.callBtnTooltip = 'label_connectZoomCall';
    // }
    // else{
    //   this.callBtnTooltip = 'label_call';
    // }
    if (!this.SMSCheckStatus) {
      this.smsBtnTooltip = 'label_connectsms';
    }
    else{
      this.smsBtnTooltip = 'label_SMS';
    }
  }
  // grid view Story
/*
  @Type: File, <ts>
  @Name: like Candidate function
  @Who: Adarsh
  @When: 08-Nov-2023
  @Why: EWM-14944
*/
likeCandidateGridView(can){
  this.markAsReadGridView(can);
  let canArr = [];
  canArr.push({
  CandidateId:can?.CandidateId,
  CandidateName:can?.CandidateName,
  StageId:can?.WorkFlowStageId,
  StageName:can?.WorkFlowStageName,
  StageDisplaySeq:can?.StageDisplaySeq,
})
  let payload = {
    JobId: this.JobId,
    JobName: this.JobName,
    Candidates: canArr,
    WorkflowId: this.workflowId,
    WorkflowName: this.WorkflowName
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
       else{
          can.ParentId = nextStageId;
          can.ParentName = nextStageName;
         can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
         can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
         can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
       }
       // End
     }
   } else if (repsonsedata.HttpStatusCode === 204) {
     this.cardloading = false;
     if (repsonsedata.Message == '400056') {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
     }
   } else if (repsonsedata.HttpStatusCode === 400) {
     this.cardloading = false;
     this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
dislikeCandidateGridView(can){
  this.markAsReadGridView(can);
  let canArr = [];
  if (this.selectedCandidates?.length > 0) {
    this.selectedCandidates?.forEach((e:any)=>{
      canArr.push({
        CandidateId:e?.CandidateId,
        CandidateName:e?.CandidateName,
        StageId:e?.WorkFlowStageId,
        StageName:e?.WorkFlowStageName,
        StageDisplaySeq:e?.StageDisplaySeq,
      })
    })
   }
   else{
    canArr.push({
      CandidateId:can?.CandidateId,
      CandidateName:can?.CandidateName,
      StageId:can?.WorkFlowStageId,
      StageName:can?.WorkFlowStageName,
      StageDisplaySeq:can?.StageDisplaySeq,
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
       else{
        can.ParentId = rejectedStageId;
        can.ParentName = nextStageName;
        can.WorkFlowStageName = repsonsedata.Data[0].NextStageName;
        can.WorkFlowStageId = repsonsedata.Data[0].NextStageId;
        can.StageDisplaySeq = repsonsedata.Data[0].NextStageDisplaySeq;
       }
       // End
     }
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
  @Name: onMappCandidateFolderGridView function
   @Who: Adarsh
  @When: 08-Nov-2023
  @Why: EWM-14944
*/
onMappCandidateFolderGridView(canData){
  this.markAsReadGridView(canData);
  let selectedCandArr:any = [];
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
  /*
  @Type: File, <ts>
  @Name: markAsUnReadGridView function
  @Who: Adarsh
  @When: 08-Nov-2023
  @Why: EWM-14944
*/
markAsReadGridView(can){
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
  selectedCanEmail: string;
  selectedCandThreeDot(can:any){
    this.selectedCanEmail = can?.EmailId;
    let res = this.stagesList.filter((e:any)=>e.IsLastStage === 1)[0];
    if (res.InternalCode == can.ParentId) {
     this.isLastStageCandidate = true;
    }
    else{
      this.isLastStageCandidate = false;
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
  }
  candidateIconStatus: boolean = false;
  candidateToggel(stage) {
    this.sidenav1.close();
     if(!this.sidenav1.opened){
      this.sideMenuContext = 'applicant-section';
      this.sidenav1.open();
      this.workflowStageList=stage;
      this.WorkflowStageId=stage?.InternalCode;
    this.candidateIconStatus = true;
    }
  }
  closeDrawerApplicantList(){
    this.candidateIconStatus = false;
    this.sideMenuContext = '';
  }
  reloadChild() {
    this._reloadService.reload();
  }
  qucikFilterClose() {
     this.drawerIconStatus = false;
     this.sideMenuContext = '';
   }

  scrolled(event: any,stageId: string,index: number){
    const end = this.viewport?.toArray()[index]?.getRenderedRange().end;
    const start = this.viewport?.toArray()[index]?.getRenderedRange().start;
    const total =this.viewport?.toArray()[index]?.getDataLength();
    if (end >= total) {
        this.nextBatch(stageId,index);
    }
    if (start == 0) {
    //  this.previousBatch(stageId,index);
    }
  }
  nextBatch(stageId:string,index:number){
    let indexOf= this.stages.findIndex(x=>x.InternalCode === stageId);
   let maxSize =   this.stages[indexOf]?.TotalPages;
   let StagesPageNo=this.stages[indexOf]?.PageNumber;
   if(StagesPageNo<maxSize){
    this.scrolledStage=stageId;
    const requestObj = {
      JobId: this.JobId,
      GridId: this.GridId,
      JobFilterParams: this.filterConfig,
      search: this.searchValue,
      PageNumber: Number(StagesPageNo+1),
      PageSize: this.pagesize,
      OrderBy: this.sortingValue,
      Source:this.Source,
      WorkflowId:this.workflowId,
      ByPassPaging:false,
      QuickFilter:this.CountFilter?this.CountFilter:'All',
      StageId:''
    }
    requestObj.StageId = stageId;
    this.forkApiCallRequest(requestObj,true,0);
   }
  }
  previousBatch(stageId:string,index:number) {
    let indexOf= this.stages.findIndex(x=>x.InternalCode === stageId);
    let StagesPageNo=this.stages[indexOf]?.PageNumber;
    if(StagesPageNo>1){
      this.scrolledStage=stageId;
      const requestObj = {
        JobId: this.JobId,
        GridId: this.GridId,
        JobFilterParams: this.filterConfig,
        search: this.searchValue,
        PageNumber:  Number(StagesPageNo-1),
        PageSize: this.pagesize,
        OrderBy: this.sortingValue,
        Source:this.Source,
        WorkflowId:this.workflowId,
        ByPassPaging:false,
        QuickFilter:this.CountFilter?this.CountFilter:'All',
        StageId:''
      }
      requestObj.StageId = stageId;
      this.forkApiCallRequest(requestObj,true,0);
     // this.viewport.toArray()[index].scrollToIndex(15);
    }
  }
  getResFromChildComp(data:ResponceData){
    if (data) {
      this.loadingSearch = false;
    }
  }
  getSelectedCandidate(data:any){
    this.selectedCandidates = data;
     // Who:Ankit Rawat, What:EWM-16947 Get the latest value of "isSelectedCandOfFirstSatgesOnly" while updating on child component, When:06Aug24
    this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
    if (!this.isSelectedCandOfFirstSatgesOnly) {
      this.isSelectedCandOfOtherSatgesOnly = true;
    }else {
      this.isSelectedCandOfOtherSatgesOnly = false;
    }
  }
  onParentRefreshType($event){
    let e = $event;
    switch(e){
      case EventType.REALOAD_HEADER_CHART_LIST: {
        this.getCandidateMappedJobHeader(this.JobId);
        break;
      }
      case EventType.REALOAD_WORKFLOW_STAGES: {
        this.getWorkFlowStages(this.workflowId);
        break;
      }

    }
    // if (refreshType) {
    //   this.getCandidateMappedJobHeader(this.JobId);
    // this.candidates = [];
    // this.getJobsummaryHeaderSourcepichart();

    // }

  }
  // Adarsh

  onParentOpenModalType($event) {
    let e = $event;
    switch (e.Type) {
      case ParentEventType.CREATE_ACTIVITY: {
        this.sidenav.open();
        this.formType(e?.value, e?.CandidateId, e?.RelatedUser)
        break;
      }
      case ParentEventType.OPEN_CANDIDATE_SUMMARY_OVERLAY: {
        this.candidate(e?.value, e?.cdata)
        break;
      }
      case ParentEventType.SEND_SMS_HISTORY: {
        this.smsHistoryDetails(e?.cdata)
        break;
      }
    }
  }
  pushCandidateToEOH(){
    let slCand = this.selectedCandidates[0];
    let ApplicantMemberPublishedStatus=slCand?.MemberId?.substring(0, 3)?.toLowerCase();
    if(slCand?.MemberId?.substring(0, 3).toLowerCase()==='mbr' && slCand?.MemberId!=null && slCand?.MemberId !==''){
      const message = this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg1')+ slCand?.CandidateName +this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg2') +slCand?.MemberId;
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
     this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData, isButtonShow: true},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    }else{
      const componentId = 'Share-Member';
          //Set button visibility based on the desired configuration to show in client Modal
          this.buttonService.setButtonVisibility(componentId,{
            [ClientBtnDetails.BACK]: false
          });
      const dialogRef = this.dialog.open(PushcandidateToEohFromPopupComponent, {
        data: new Object({candidateId:slCand?.CandidateId,IsOpenFor:'popUp',candidateName:slCand?.CandidateName,stageType: slCand?.StageType,lastActivity: slCand?.LastActivity,PublishedStatus: ApplicantMemberPublishedStatus }),
        panelClass: ['xeople-modal', 'push-candidate-to-eoh-modal', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res.StatsCode == 200) {
          let filterStage = this.stages[this.selectedStageIndex];
          for (let object of filterStage.candidates) {
            if (object.CandidateId === slCand.CandidateId) {
              object.IsXRCandidatePushedToEOH = 1;
              object.MemberId = res?.ApplicantId;
            }
          }
        }
      })
    }
  }
  checkDataInsideIndexDB() {
    let AssignToCandidateToJob = localStorage.getItem('AssignToCandidateToJob');
    if(AssignToCandidateToJob!== null){
      this.dataChangeStatus=true;
      this.jobService.pageDataChangeStatus(true);
      this.getWorkFlowStages(this.workflowId);
      localStorage.removeItem('AssignToCandidateToJob');
   
    }
    let dataChangeStatus = localStorage.getItem('jobDetailsPageEventStatus');
    let getData = sessionStorage.getItem(JobDetailLocalCalculationName.CARD_COUNT);
    if ((getData && Number(getData) >= 0) &&   dataChangeStatus === null) {
      this._JobIndexDbService.getDataFromStorage(JobDetailIndexDBCard.DB_NAME).then((data: any) => {
        try {
          this.stages = data;
          if (!this.stagesList) {
            // const res = data.map(x => {
            //   const { InternalCode, StageName, ParentStageId, Status, ColorCode, Count, ColorCodeUrl, ColorCodePreviewUrl, SerialNumber, Stages, StageVisibility, StageVisibilityRestriction, IsFirststage, IsLastStage, IsRejectedStage } = x;
            //   return { InternalCode, StageName, ParentStageId, Status, ColorCode, Count, ColorCodeUrl, ColorCodePreviewUrl, SerialNumber, Stages, StageVisibility, StageVisibilityRestriction, IsFirststage, IsLastStage, IsRejectedStage };
            // });
            this.stagesList = data;
            this.findRejectedStage();
            this.loadingData = "label_no_candidates";
            this.getStagesOnReload();
          }
        } catch (error) {
          console.log('Error', error)
        }
      })
    } else {
      this.getWorkFlowStages(this.workflowId);
    }
  }

  getStagesOnReload() {
    let promise = new Promise<void>((resolve, reject) => {
        resolve();
    });
    return promise;
  }
  removeLocalDataFromStorage(){
    sessionStorage.removeItem(JobDetailLocalCalculationName.LIST_COUNT);
    sessionStorage.removeItem(JobDetailLocalCalculationName.CARD_COUNT);
    // clear db 
    sessionStorage.removeItem(JobDetailIndexDBCard.DB_NAME);
    sessionStorage.removeItem(JobDetailIndexDBCard.ALL_STAGE_LIST);
    sessionStorage.removeItem(JobDetailIndexDBList.DB_NAME);
  }
  setDataInSesstionStorage(){
    this._JobIndexDbService.setDataInStorage(JobDetailIndexDBCard.DB_NAME,this.stages);
  }
  findRejectedStage(){
    let isRejectedStage = this.stagesList?.filter((e: { IsRejectedStage: boolean; })=> e.IsRejectedStage === true);
    isRejectedStage?.length > 0 ? this.isAnyRejectedStageType = true : this.isAnyRejectedStageType = false;
  }
  ngAfterViewInit() {
    this.routes.queryParams.subscribe((value) => {
      if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='') {
        if(this.jobId!=value?.jobId){
          this.JobId = value?.jobId;
          this.workflowId = value?.workflowId;
          this.getCandidateMappedJobHeader(this.JobId);
          this.getCandidateMappedJobHeaderTag(this.JobId);
          this.getJobsummaryHeaderSourcepichart();
         // this.getWorkFlowStages(this.WorkflowId);
          this.getJobNotesCount();
          this.getEmployeeActivityCount();
          this.getAlldocumentCount();
          //this.reloadApiBasedOnorg();
        }
      }
    });
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
 /**
 * Refreshes the candidate list by opening a confirmation dialog.
 * If the user confirms, it retrieves the workflow stages for the given workflow ID.
 *
 *
 * refreshCandidateList()
 *   // Opens a confirmation dialog with the message "label_jobDetails_freshOfcandidates"
 *   // If the user clicks "OK", it calls getWorkFlowStages with the current WorkflowId
 */
 refreshCandidateList()
 {
   const message = 'label_jobDetails_freshOfcandidates';
   const title = '';
   const subTitle = '';
   const dialogData = new ConfirmDialogModel(title, subTitle, message);
   const dialogRef = this.dialog.open(InformDialogComponent, {
     maxWidth: "350px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     if (dialogResult == true) {
       this.getWorkFlowStages(this.WorkflowId);
     }
   });
 }
 callDataCount:number;
 countVxtCall() {
  this.candidateService.countVxtCall("?id=" + this.JobId + "&usertype=" + 'JOB').pipe(takeUntil(this.destroy$)).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.callDataCount =  repsonsedata.Data;
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.callDataCount =  repsonsedata.Data;
        this.loading = false;
      } else {
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}


shareJob(){
  let slCand = this.selectedCandidates[0];
  if(slCand?.IsXRCandidatePushedToEOH==1 && slCand?.MemberId!=null){
    const message = this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg1')+ slCand?.CandidateName +this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg2') +slCand?.MemberId;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
   this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData, isButtonShow: true},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  }else{
    const componentId = 'Share-Client';
    //Set button visibility based on the desired configuration to show in client Modal
    this.buttonService.setButtonVisibility(componentId,{
      [ClientBtnDetails.CANCEL]: false,
      [ClientBtnDetails.SAVE_AND_NEXT]: true,
      [ClientBtnDetails.SHARE_CLIENT]: false,
    });
    
    const dialogRef = this.dialog.open(SharedJobComponent, {
      data: new Object({candidateId:slCand?.CandidateId,IsOpenFor:'popUp',candidateName:slCand?.CandidateName,
        stageType: slCand?.StageType,lastActivity: slCand?.LastActivity,savedClientId:this.JobDetails?.ClientId,
        ClientName:this.JobDetails?.ClientName, JobId:this.jobDetails?.JobId,JobTitle:this.JobDetails?.JobTitle}),
      panelClass: ['xeople-modal', 'eoh-modal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.StatsCode == 200) {
        let filterStage = this.stages[this.selectedStageIndex];
        for (let object of filterStage.candidates) {
          if (object.CandidateId === slCand.CandidateId) {
            object.IsXRCandidatePushedToEOH = 1;
            object.MemberId = res?.ApplicantId;
          }
        }
      }
    })
  }
}

// Renu on 04 March 2025 for EWM-19411 EWM-19651
checkCandidateSyncTOEOH() {
  this.checkClientSyncEOHObs = this.candidateService.checkCandidateSyncTOEOH('?id='+this.JobDetails?.ClientId).pipe(takeUntil(this.destroy$)).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 402) {
        if(data.Data.MemberId && data.Data.MemberId!='' && data.Data.MemberId!=null){
          this.MemberId=data.Data.MemberId;
          this.commonserviceService.setMemberIdEOHValue(this.MemberId);
         }
      } else {
        this.commonserviceService.setMemberIdEOHValue('');
       // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    }, err => {
     this.loading = false;
     //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
 // Renu on 04 March 2025 for EWM-19411 EWM-19651
checkClientSyncTOEOH() {
  this.checkClientSyncEOHObs = this._clientService.checkClientSyncTOEOH('?id='+this.JobDetails?.ClientId).pipe(takeUntil(this.destroy$)).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 402) {
        if(data.Data.EOHClientId && data.Data.EOHClientId!='' && data.Data.EOHClientId!=null){
         this.EOHClientId=data.Data.EOHClientId;
         this.commonserviceService.setClientIdEOHValue(this.EOHClientId);
        }
      } else {
        this.commonserviceService.setClientIdEOHValue('');
        //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    }, err => {
     this.loading = false;
   //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

}
