/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 23-Dec-2024
  @Why: EWM-19017 EWM-19601
  @What:  This page will be use for Lead details Component ts file
*/
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ButtonTypes, ResponceData, SCREEN_SIZE, Userpreferences } from '../../../shared/models';
import { SidebarService } from '../../../shared/services/sidebar/sidebar.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { DataBindingDirective, GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { UserpreferencesService } from '../../../shared/services/commonservice/userpreferences.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snackbar/snack-bar.service';
import { CandidatejobmappingService } from '../../../shared/services/candidate/candidatejobmapping.service';
import { AppSettingsService } from '../../../shared/services/app-settings.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { CommonServiesService } from '../../../shared/services/common-servies.service';
import { DisconnectEmailComponent } from '../../../shared/modal/disconnect-email/disconnect-email.component';
import { MailServiceService } from '../../../shared/services/email-service/mail-service.service';
import { DOCUMENT } from '@angular/common';
import { CommonserviceService } from '../../../shared/services/commonservice/commonservice.service';
import { CandidateFolderFilterComponent } from '../../EWM-Candidate/profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { ServiceListClass } from '../../../shared/services/sevicelist';
import { ColumnSettings } from '../../../shared/models/column-settings.interface';
import { GoogleMapsLocationPopComponent } from '../../../shared/modal/google-maps-location-pop/google-maps-location-pop.component';
import { AlertDialogComponent } from '../../../shared/modal/alert-dialog/alert-dialog.component';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { auditTime, debounceTime, takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { RtlService } from '../../../shared/services/commonservice/rtl/rtl.service';
import { take } from 'rxjs/operators';
import { XeopleSmartEmailJobComponent } from '../../../shared/popups/xeople-smart-email-job/xeople-smart-email-job.component';
import { StageDetails } from '../../../shared/models';
import { ShortNameColorCode } from '../../../shared/models/background-color';
import { MulitpleCandidateFolderMappingComponent } from '../../../shared/modal/mulitple-candidate-folder-mapping/mulitple-candidate-folder-mapping.component';
import { JobDetailsCardViewgoogleMapsLocationPopComponent } from '../../../shared/modal/job-details-card-viewgoogle-maps-location-pop/job-details-card-viewgoogle-maps-location-pop.component';
import { CloseJobComponent } from '../../../shared/modal/close-job/close-job.component';
import { CandidateWorkflowStagesMappedJobdetailsPopComponent } from '../../../shared/modal/candidate-workflow-stages-mapped-jobdetails-pop/candidate-workflow-stages-mapped-jobdetails-pop.component';
import { RemoveMultipleCandidateComponent } from '../../../shared/modal/remove-multiple-candidate/remove-multiple-candidate.component';
import { customDropdownConfig } from '../../../modules/EWM.core/shared/datamodels';
import { TreeDataSource, TreeNode } from '../../../modules/EWM.core/job/landingpage/tree-datasource';
import { NestedTreeControl } from '@angular/cdk/tree';
import { GridState, JobScreening } from '../../../shared/models/job-screening';
import { QuickJobService } from '../../../modules/EWM.core/shared/services/quickJob/quickJob.service';
import { JobService } from '../../../modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from '../../../modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CandidateService } from '../../../modules/EWM.core/shared/services/candidates/candidate.service';
import { IntegrationsBoardService } from '../../../modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { BroadbeanService } from '../../../modules/EWM.core/shared/services/broadbean/broadbean.service';
import { ProfileInfoService } from '../../../modules/EWM.core/shared/services/profile-info/profile-info.service';
import { UserAdministrationService } from '../../../modules/EWM.core/shared/services/user-administration/user-administration.service';
import { CandidateTimelineComponent } from '../../../modules/EWM.core/job/candidate-timeline/candidate-timeline.component';
import { RemoveCandidateComponent } from '../../../modules/EWM.core/job/remove-candidate/remove-candidate.component';
import { NewEmailComponent } from '../../../modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ShareResumeComponent } from '../../../modules/EWM.core/job/screening/share-resume/share-resume.component';
import { CandidateRankComponent } from '../../../modules/EWM.core/job/job-details/candidate-rank/candidate-rank.component';
import { JobPublishPopupComponent } from '../../../modules/EWM.core/job/job-details/job-publish-popup/job-publish-popup.component';
import { JobDeatilsHeaderStatusComponent } from '../../../modules/EWM.core/job/job-action/job-deatils-header-status/job-deatils-header-status.component';
import { ActionDialogComponent } from '../../../modules/EWM.core/job/landingpage/action-dialog/action-dialog.component';
import { WorkflowSubStagesComponent } from '../../../modules/EWM.core/job/landingpage/workflow-sub-stages/workflow-sub-stages.component';
import { FilePreviwerPopupComponent } from '../../../modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { BulkSmsComponent } from '../../../modules/EWM.core/job/job/job-sms/bulk-sms/bulk-sms.component';
import { CandidateJobResumeComponent } from '../../../modules/EWM.core/job/job-details/candidate-jobresume/candidate-jobresume.component';
import { CandidateJobApplicationFormComponent } from '../../../modules/EWM.core/job/job-details/candidate-job-application-form/candidate-job-application-form.component';
import { JobCandidateCardActivityComponent } from '../../../modules/EWM.core/shared/quick-modal/job-candidate-card-activity/job-candidate-card-activity.component';

import { ReloadService } from '../../../modules/EWM.core/shared/reload.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonMethodeType, EventType, JobDetailIndexDBCard, JobDetailIndexDBList, JobDetailLocalCalculationName, ListModeObj, ParentEventType } from '../../../shared/enums/job-detail.enum';
import { IndexedDbService } from '../../../shared/helper/indexed-db.service';
import { Title } from '@angular/platform-browser';
import { CandidateJobMappedComponent } from '../../xeople-job/candidate-job-mapped/candidate-job-mapped.component';
import { JobIndexDbService } from '../../../shared/helper/job-index-db.service';
import { ParsedResumeKeywordSearchComponent } from '../../../shared/parsed-resume-keyword-search/parsed-resume-keyword-search/parsed-resume-keyword-search.component';
import { InformDialogComponent } from '../../../shared/modal/inform-dialog/inform-dialog.component';
import { ApplicantDetailPopupComponent } from '../../xeople-job/job-list/applicant-list/applicant-detail-popup/applicant-detail-popup.component';
import { PushcandidateToEohFromPopupComponent } from '../../xeople-job/job-screening/pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';
import { ListviewComponent } from '../../xeople-job/job-detail/listview/listview.component';
import { JobFilterDialogComponent } from '../../xeople-job/job-shared/job-filter-dialog/job-filter-dialog.component';
import { JobScreeningComponent } from '../../xeople-job/job-screening/job-screening.component';
import { JobSmsComponent } from '../../xeople-job/job-detail/job-sms/job-sms.component';
import { LeadsService } from '../../EWM.core/shared/services/leads/leads.service';
import { leadCard, LeadDetails, leadsLikeEntity, LeadStageDetails } from '../../../shared/models/lead.model';
import { LeadMailComponent } from '../lead-mail/lead-mail.component';
import { ConvertLeadClientComponent } from '../convert-lead-client/convert-lead-client.component';
import { ViewLeadWorkflowStagesComponent } from '../lead-workflow/view-lead-workflow-stages/view-lead-workflow-stages.component';
import { AddLeadComponent } from '@app/shared/modal/add-lead/add-lead.component';
import { LeadInfoPopupComponent } from '../lead-info-popup/lead-info-popup.component';
import { LeadWorkflowStagesMappedPopupComponent } from '../lead-workflow-stages-mapped-popup/lead-workflow-stages-mapped-popup.component';
import { NavigationService } from '../../../shared/helper/navigation.service';
import { XeepService } from '../../../shared/services/xeep/xeep.service';

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
  LeadFilterParams: any[]
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
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss']
})
export class LeadDetailsComponent implements OnInit, OnDestroy {
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
  public GridId: any = 'LeadLanding_grid_001';
  public GridIdNotes: any = "JobNotes_grid_001"; // @suika @EWM-10650 changes notes grid ID
  public userpreferences: Userpreferences;
  public stages: any[];
  public candidates: any = [];
  public positionMatDrawer: string = 'end';
  public colArr: any = [];
  public columns: ColumnSetting[] = [];
  public publishArr: any = [];
  public isActiveNotes: boolean = false;
  public isActiveSearchCandidate: boolean = false;
  public isJobLog: boolean = false;
  HeaderCount: any;
  JobDetails: any;
  JobStatus: any;
  JobTags: any;
  tagLength: any;
  tagLengthStatus: boolean;
  filterCount: number = 0;
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
  activityRelatedToJob: string = 'JOB';
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
  CountFilter: any = 'All';
  public screnSizePerStage: number;
  public actionButtonVisible: number = 11;
  public navigation: Boolean = true;
  public screenPreviewClass: string = "";
  addSlectedID: number = 0;
  stagesList: any;
  totalStages: any;
  currentMenuWidth: any;
  OwnersList: any = [];
  PrimaryOwner: any = [];
  filterStatus: boolean = false;
  workflowId: any='00000000-0000-0000-0000-000000000000';
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
  activatedRoute: any;
  isClientDetailView: boolean = false;
  isClientId: string;
  pieChartData: any = [];
  public pieheight = 360;
  public piechartType: any = 'pie';
  public pieDataLegends = [];
  public pieData: any[];
  public pieDataColors = [];
  public Source: string = '';
  public cOptions1: Partial<ChartOptions>;
  public cOptions: Partial<ChartOptions>;
  public pieloading: boolean = false;
  public totalSource: any = 0;
  searchSubject$ = new Subject<any>();
  burstSMSRegistrationCode: any;
  getAllEmailIdFormMappedJob: any = [];
  applicationBaseUrl: string;
  applicationFormURL: string;
  applicationFormId: any = 0;
  hideButton: boolean = true;
  subdomain: string;
  isSmsHistoryForm: boolean = false;
  jobActionStatus: boolean = false;
  EmailsAndPhonesData;
  largeEmailsAndPhonesData: [] = [];
  smallEmailsAndPhonesData;
  getResponseEmailPhone: any;
  skillData: [] = [];
  largeSkill: [] = [];
  candidateDetails: any = [];
  SMSHistory: any = [];
  smsHistoryToggel: boolean = false;
  quickFilterToggel: boolean = true;
  JobTitle: any;
  jobId: any;
  EmailId: any;
  WorkFlowStageId: any='00000000-0000-0000-0000-000000000000';
  WorkFlowStageName: any;
  LastActivity: any;
  TREE_DATA: TreeNode[];
  view: boolean = false;
  treeControl: NestedTreeControl<TreeNode>;
  dataSource: TreeDataSource;
  dataArr: any = [];
  // public selectjobcatparam: any = 'TotalJobs';
  public selectjobcatparam: any;
  treeMatDrawer: boolean = false;
  public loadingStage: boolean;
  public loadingTree: boolean;
  public loadingHeader: boolean;
  applicationLinkExpire: any;
  overlayViewjob = false;
  overlayCandidateSummary = false;
  overlayMappApplicationForm = false;
  overlayShareJobApplicationForm = false;
  overlayClientDetail = false;
  currentStatusReasonName: string;
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
  public TimeZone: any = localStorage.getItem('TimeZone')
  public selectedItem = [];
  timeDisplayHour = 12;
  scheduleTimeData: any = {};
  isDisabledForScreening: boolean;
  filterparam: any;
  public showScreeningInterview: boolean;
  selectjob: any;
  emailConnection: boolean = false;
  public categoryForCand: string = 'CAND';
  gridColConfigStatus: boolean = false;
  selectedCandidates: any = [];
  StageDetailsObj: LeadStageDetails = {
    WorkflowId: '',
    StageIds: ''
  };
  masterSelected: boolean = false;
  /*--@When:25-05-2023,@who:Renu,@why:EWM-11781 EWM-12517,@what:For job screening model*/
  public candidateScreeningInfo: JobScreening[] = [];
  public screeningObj: JobScreening;
  public gridStateObj: GridState;
  public stageId: string;
  public allComplete: boolean = false;
  HideStageIds: any = [];
  public hideChartOnHeaderCollpase: boolean = false;
  IsIntermediate: boolean;
  IsCardStageIntermediate: boolean = true;
  NoOfCanSelectedEachStage: number; // @suika EWM-11782 02-06-2023
  JobHeaderDetailsObs: Subscription;
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
  SelectedStageId: '00000000-0000-0000-0000-000000000000';
  loadingData: any = "label_job_details_candidates_loading";
  public interviewinaweek: number;
  moreThanOneJobCount: number = 0;
  inboxCount: number = 0;
  public unreaddatas: {};
  public selectedCand: any[]
  public hidedata: boolean = false;
  public gridViewList: any = [];
  oldTabIndex: any = null;
  dateFormatKendo: string | null;
  scheduleData: any = {};
  public leadetails: LeadDetails = {};
  showHideDocumentButtons: boolean = false;
  SMSCheckStatus: boolean = false;
  selectedClientAndCandidateLatLong: boolean = false;
  public isSlotActive: boolean = false;
  public slotsData: any;
  public attendeesDataList: any[] = [];
  multipleEmail: boolean = false;
  StageVisibilityCount: number = 0;
  public getSkillLength: number;
  public getSkillALl: any = [];
  public maxMoreLengthForOwnerContacts: number = 2
  public ownersData: boolean = false;
  public FocusContactField: boolean = false;
  public triggerOrigin: any;
  public overlayCandidateProfile: boolean;
  public candidateProfileDrwerForEdit: boolean;
  public IsJobClosed: number
  workflowStatus: boolean = false;
  firstStageData: any;
  isSelectedCandOfFirstSatgesOnly: boolean = false;
  isOpen: string;
  isSelectedCandOfOtherSatgesOnly: boolean = false;
  isAnyRejectedStageType: boolean = false;
  actiontBtnTooltip: string = 'label_jobDetailsAction';
  actiontBtnTooltipCount: number | string;
  acceptBtnTooltip: string = 'label_jobDetails_Accept';
  rejectBtnTooltip: string = 'label_jobDetails_Reject';
  removeBtnTooltip: string = 'label_jobDetails_Remove';
  readBtnTooltip: string = 'label_jobDetails_Read';
  callBtnTooltip: string = '';
  smsBtnTooltip: string = 'label_SMS';
  activityBtnTooltip: string = 'label_MenuActivity';
  ProfileUpdateBtnTooltip: string = 'label_jobDetails_ApplicantProfileUpdate_tooltip';
  pinBtnTooltip: string = 'label_jobDetails_Pin';
  unpinBtnTooltip: string = 'label_jobDetails_UnPin';
  moveToFolderBtnTooltip: string = 'label_jobDetails_MovetoFolder';
  unreadBtnTooltip: string = 'label_jobDetails_UnRead';
  distanceUnit: string = 'KM';
  isLastStageCandidate: boolean = false;
  jobContactDetailsArr: [] = [];
  workflowStageList: any;
  WorkflowStageId: any='00000000-0000-0000-0000-000000000000';
  @ViewChild('quickCandidateList') public candidatetoggel: MatSidenav;
  quickCandidateList: string = 'All';
  CountFilters = 'TotalJobs';
  @ViewChild('LandingEnddrawer') public sidenav1: MatSidenav;
  sideMenuContext: string;
  isAnyRejectedStageTypeListView: boolean = false;
  @ViewChild('target') targetElement: any;
  scrolledStage: string;
  @ViewChildren('viewport') viewport: QueryList<CdkVirtualScrollViewport>;

  currentParamValue: string | null = null;
  previousParamValue: string | null = null;
  // split list mode code
  listModeObj: ListModeObj
  listModeEventType: number;
  @ViewChild(ListviewComponent) listViewPage: ListviewComponent;
  commonMethodeGetData: any;
  cdkDragDisabled = false;
  JobReferenceId: string;
  EOHIntegrationObj: any;
  IsEOHIntergrated: boolean = false;
  eohRegistrationCode: string;
  public userType = 'CLIE';
  public contactPhone: number;

  public dataChangeStatus: boolean = false;
  JobExpiryDays: number = 1;
  JobIdForVxt: string;
  CallTab: boolean = false;
  public ParentSource: string;

  ////
  public workflowList: any = [];
  public totalJobsWorkFlow: number;
  JobWorkflowListObs: Subscription;
  lastStageIdObj: any;
  candidateMappedJobCount: number = 0;
  stagesCount: { totalStageCount: string | number, lastStageCount: string | number };
  drawerIconStatus: boolean = false;
  MobileMapTagSelected: any;
  isLastSatgeCand: boolean = false;
  selectedStageCode: string;
  selectedStageIndex: number;
  tempcan = '';
  public toEmailList: any = [];
  public getCandidateData: any = [];
  public isSMSStatus: boolean = false;
  isFilter: boolean = false;
  public disabledDashboard:boolean=false;
  listModeStatus:boolean=false;
  public emailDisabel:boolean=false;
  public selectEmailList: any = [];
  public ListModeData:string;
  public actionmenuItmes:number=7;
  public slidePerWidth:number=400;
  public isAnyRejectedStageListView:boolean
  public isAnyAcceptStageListView:boolean
  public noPhoneNumber:boolean=false;
  public  hasChild = (_: number, node: TreeNode) =>!!node.Stages && node.Stages.length > 0;
  constructor(private route: Router, private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private _service: CandidatejobmappingService, private translateService: TranslateService, private snackBService: SnackBarService, @Inject(DOCUMENT) private document: any,
    private quickJobService: QuickJobService, public systemSettingService: SystemSettingService,private navigationService:NavigationService,
    private jobService: JobService, private mailService: MailServiceService, public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, public changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public _integrationsBoardService: IntegrationsBoardService, private serviceListClass: ServiceListClass, public _DatePipe: DatePipe, private datePipe: DatePipe, private _profileInfoService: ProfileInfoService,
    private _broadbeanService: BroadbeanService,
    private _rtlService: RtlService, private ngZone: NgZone,
    private _userAdministrationService: UserAdministrationService,
    private _reloadService: ReloadService,
    public indexBDService: IndexedDbService,
    private titleService: Title,
    private _JobIndexDbService: JobIndexDbService, private leadService: LeadsService,private xeepService:XeepService

  ) {
    this.ParentSource = this.appSettingsService.SourceCodeParam['ApplicationForm'];
    this.pagesize = appSettingsService.pagesize;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.getSMSRegistrationCode = this.appSettingsService.xeopleSMSRegistrationCode;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    this.applicationBaseUrl = this.appSettingsService.applicationBaseUrl;
    this.applicationLinkExpire = this.appSettingsService.applicationLinkExprire;
    this.showScreeningInterview = this.appSettingsService.showScreeningInterview;
    this.NoOfCanSelectedEachStage = this.appSettingsService.NoOfCanSelectedEachStage;
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
      this.candidateIdForJobDoc = Id['jobId'];
      // }
      // this.candidateIdForJobDoc = 'c6f34211-df10-4dbf-af71-43ff5674cf9b';
    })
  }
  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL?.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    //this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('landing');
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = tenantData.FirstName;
    this._sidebarService.searchEnable.next('1');
    this.dateFormatKendo = localStorage.getItem('DateFormat');
    this.animationVar = ButtonTypes;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.routes.queryParams.subscribe((parmsValue) => {
      this.JobIdForVxt = parmsValue?.jobId;
      if (this.oldTabIndex != this.selectedTabIndex) {
        this.viewMode = parmsValue?.cardJob ? parmsValue.cardJob : this.viewMode;
        this.workflowId = parmsValue?.workflowId;
        this.WorkflowName = parmsValue?.WorkflowName;
      }
    });
    this.viewMode == 'cardMode' ? this.isCardMode = true : this.isCardMode = false;
    this.StageDetailsObj.WorkflowId = this.workflowId;
    this.getLeadWorkflowList();
    this.getFilterConfig(true);
    //this.getWorkFlowStages(this.workflowId);
    this.onResize(window.innerWidth, 'onload');
    this.actionmenus();
    this.checkZoomConnectedOrNot();

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      if (this.isCardMode) {
        this.getLeadCardDetails(this.pagesize, this.pageNum, this.sortingValue, value, this.filterConfig);
      } else {
        // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, value, this.filterConfig, true, false,this.SelectedStageId);
      }
    });
    this.commonserviceService?.leadListData.subscribe(res => {
      if (res?.selectedCandidate) {
       this.selectedCandidates = res?.selectedCandidate;       
       this.ListModeData = res?.Mode;       
  if (this.selectedCandidates?.length> 0) {
    let res = this.selectedCandidates.filter(element => element?.EmailId!='' && element?.EmailId!=' ' && element?.EmailId!=null && element?.EmailId!=undefined);
   if (res?.length==0) {
      this.emailDisabel=true; 
   }else{
   this.emailDisabel=false;  
   }
   let noPhoneNumber = this.selectedCandidates.filter(element => element?.PhoneNumber!='' && element?.PhoneNumber!=' ' && element?.PhoneNumber!=null && element?.PhoneNumber!=undefined);
   if (noPhoneNumber?.length==0) {
      this.noPhoneNumber=true; 
   }else{
   this.noPhoneNumber=false;  
   }
   this.getSelectedCandidatesSameStageFlag();
    }
     } 
     this.getWorkFlowStagesForListView(res?.stagesList,this.selectedCandidates,res?.singleCheck,res?.isAnyRejectedStageTypeListView)
    });
   this.getIntegrationCheckSMSstatus();
  }

  ngOnDestroy(): void {
    this.JobHeaderDetailsObs?.unsubscribe();
  }

  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if ((element.nodeName === 'TD' || element.nodeName === 'TH') && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
    } else {
      this.tooltipDir.hide();
    }
  }

  getWorkFlowStages(Id) {
    this.loadingStage = true;
    this.JobworkFlowBypipeIdObs = this.leadService.getAllStageDetails('?Id=' + Id).pipe(takeUntil(this.destroy$)).subscribe(
      (data: ResponceData) => {
        this.loadingStage = false;
        if (data.HttpStatusCode === 200) {
          // this.stagesList = data.Data.Stages;
          this.stages = data.Data?.Stages;
          let resCount = 0;
          this.stages?.forEach((v, i) => {
            v.CheckboxStatus = false;
            if (v?.IsLastStage === 1) {
              this.lastStageIdObj = v;
              v['lastStage'] = true;
            }
            resCount = resCount + v.Count;
          });
          this.candidateMappedJobCount = resCount;
          this.stagesList = data.Data?.Stages;
          let firstStage = this.stagesList.filter(e => e.SerialNumber === 1);
          let isRejectedStage = this.stagesList.filter(e => e.IsRejectedStage === true);
          this.firstStageData = firstStage[0];
          isRejectedStage?.length > 0 ? this.isAnyRejectedStageTypeListView = true : this.isAnyRejectedStageTypeListView = false;
          isRejectedStage?.length > 0 ? this.isAnyRejectedStageType = true : this.isAnyRejectedStageType = false;
          let StageVisibilityLength = this.stagesList?.filter(res => res.StageVisibility == 1);
          this.StageVisibilityCount = StageVisibilityLength?.length;
          if (this.stages?.length > 0) {
            if(this.viewMode == 'cardMode'){
            this.getLeadCardDetails(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
            }else{
            this.viewMode='listMode';
            this.WorkflowStageId = '00000000-0000-0000-0000-000000000000';
            this.commonserviceService.onLeadSelectId.next({leadWorkflowId:this.workflowId,leadStageId:this.WorkflowStageId});
            }
          }

          // if(this.viewMode == 'cardMode'){
          //   this.listModeStatus=false;
          //   this.getWorkFlowStages(this.workflowId);
          //  }else{
          //   this.listModeStatus=true;
          //   this.commonserviceService.onLeadSelectId.next({leadWorkflowId:this.workflowId,leadStageId:this.WorkflowStageId});
          //   this.viewMode='listMode';
          //  }

        } else {
          this.loadingStage = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loadingStage = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      },
    )
  }


  public getLeadCardDetails(pagesize: any, pageNum: any, sortingValue: string, searchValue: any, filterConfig: any) {
    this.loadingData = "label_job_details_candidates_loading";
    const formdata: leadCard = {
      GridId: this.GridId,
      WorkflowId: this.workflowId,
      StageId: '',
      search: searchValue,
      PageNumber: pageNum,
      PageSize: pagesize,
      OrderBy: sortingValue,
      ByPassPaging: false,
      LeadFilterParams:this.filterConfig
    }

    let stagesCount: { totalStageCount: string | number, lastStageCount: string | number };
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
    this.stages?.forEach((res, i) => {
      res['StageDisplaySeq'] = res.SerialNumber;
      res['CheckboxStatus'] = false;
      res['IsIntermediate'] = false;
      let copyReq = Object.assign({}, formdata);
      copyReq.StageId = res.InternalCode;
      if (res.StageVisibility == 0) {
        this.HideStageIds.push(res.InternalCode);
      }
      this.HideStageIds = this.HideStageIds.filter((n, i) => this.HideStageIds.indexOf(n) === i);
      stagesCount.lastStageCount = ++i
      this.forkApiCallRequest(copyReq, false, ++i);
    });
    this.stagesCount = stagesCount;
  }

  forkApiCallRequest(req: leadCard, status: boolean, lastStageCount: number) {
    let indexOf = this.stages.findIndex(x => x.InternalCode === req?.StageId);
    if (this.CandidatemappedtojobcardAllObs && status) {
      this.CandidatemappedtojobcardAllObs.unsubscribe();
    }
    this.CandidatemappedtojobcardAllObs = this.leadService.getLeadCardDetails(req).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        this.scrolledStage = null;
        if (repsonsedata.HttpStatusCode === 200) {
          repsonsedata.Data?.forEach(can => {
            //can['StageName'] = this.stages[indexOf].StageName;
           // can['StageType'] = this.stages[indexOf].StageType;   // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
           // can['StageId'] = this.stages[indexOf].InternalCode;
           // can['StageDisplaySeq'] = can.StageDisplaySeq;
            can['Candidateloader'] = false;
            // <!---------@suika @EWM-11782 EWM-12504 Action labels --------->
            can['CheckboxStatus'] = false;
          });
          if (status) {
            let newObj = repsonsedata.Data;
            this.stages[indexOf]['candidates'] = this.stages[indexOf]['candidates'].concat(newObj);
          } else {
            this.stages[indexOf]['candidates'] = repsonsedata.Data;
          }
          this.stages[indexOf]['candidatesCount'] = JSON.parse(JSON.stringify(repsonsedata.TotalRecord));
          this.stages[indexOf].isDisabled = false;
          this.stages[indexOf].TotalPages = repsonsedata?.TotalPages;
          this.stages[indexOf].PageNumber = req?.PageNumber;
          // this.indexBDService.SetData('jobdetailsCard','cardview',this.stages);
          // End
          this.loading = false;
          this.loadingSearch = false;
          this.selectedCandidates = [];
          setTimeout(() => {
            this.loadingData = "label_no_leads";
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
          this.loadingData = "label_no_leads";
          // this.candidateMappedJobCount = 0;
          this.stages[indexOf]['candidates'] = [];
          this.stages[indexOf]['isDisabled'] = false;
          this.stages[indexOf]['candidatesCount'] = 0;
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
          this.loadingData = "label_no_leads";
          this.filterCount = 0
          this.loading = false;
          this.showHideDocumentButtons = false;
        }
        if (lastStageCount === this.stages?.length) {
          this._JobIndexDbService.setDataInStorage(JobDetailIndexDBCard.DB_NAME, this.stages);
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.filterCount = 0
          this.loading = false;
        }
      })
  }

  public getLeadWorkflowList() {
    this.loading = true;
    this.JobWorkflowListObs = this.leadService.getLeadworkflowList('').pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200) {
          this.loading = false;
         
            this.workflowList = repsonsedata.Data?repsonsedata.Data:[];
            this.WorkflowName = this.workflowList.filter(x => x?.WorkflowId === this.workflowId)[0]?.WorkflowName;
            this.totalJobsWorkFlow = this.workflowList.filter(x => x.WorkflowId === this.workflowId)[0]?.NewLeads;

        } else if (repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          this.workflowList = repsonsedata?.Data;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata?.Message), repsonsedata?.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err?.Message), err?.StatusCode);
      })
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId)?.classList.add(animationName);
    }
  }
    mouseleaveAnimation(matIconId, animationName) {
      document.getElementById(matIconId)?.classList.remove(animationName)
    }

    getWorkflowBasisList(event) {
      this.listModeStatus=false;
       this.workflowId = event;
       this.StageDetailsObj.WorkflowId = this.workflowId;
       this.WorkflowName=this.workflowList?.filter(x => x.WorkflowId === this.workflowId)[0]?.WorkflowName;
       this.getWorkFlowStages(this.workflowId);
      //  if(this.viewMode == 'cardMode'){
      //   this.listModeStatus=false;
      //   this.getWorkFlowStages(this.workflowId);
      //  }else{
      //   this.listModeStatus=true;
      //   this.commonserviceService.onLeadSelectId.next({leadWorkflowId:this.workflowId,leadStageId:this.WorkflowStageId});
      //   this.viewMode='listMode';
      //  }
       
     }

     public onFilter(inputValue: string): void {
      this.isFilter = true;
      if (inputValue?.length > 0 && inputValue?.length < 3) {
        this.loadingSearch = false;
        this.allComplete = false;
        this.IsIntermediate = false;
        return;
      }
      this.searchValue = inputValue;
  
      this.searchSubject$.next(inputValue);
      
  
    }
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.allComplete = false;
    this.IsIntermediate = false;
    if (this.isCardMode) {
      this.getLeadCardDetails(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
    } else {
      this.listViewPage?.performActionEventWise(EventType.SEARCH_CLEAR);
      // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
    }
  }

  cancelTreeview() {
    this.dataArr = [];
    this.treeMatDrawer = false;
  }

  switchListMode(viewMode) {
    this.showHideDocumentButtons = false;
    this.SelectedStageId = '00000000-0000-0000-0000-000000000000';
    if (viewMode === 'cardMode') {
      this.listModeStatus=false;
      //this.onIndexDBHandlerGrid(0);
      this.selectedCandidates = [];
      this.viewMode = "cardMode";
      localStorage.setItem('viewMode', this.viewMode);/*****@Who:maneesh @Why:Ewm-11774  @When:23-09-2023 */
      this.isCardMode = true;
      if (this.workflowId != '' && this.workflowId != undefined) {
       // if (this.candidates?.length === 0) {
         this.getFilterConfig(true);
          //this.getWorkFlowStages(this.workflowId);
       // }
      }

    } else {
      this.listModeStatus=true;
      this.selectedCandidates = [];
      this.viewMode = "listMode";
      localStorage.setItem('viewMode', this.viewMode);
      this.allComplete = false;
      this.isCardMode = false;
      this.viewMode='listMode';
      this.WorkflowStageId = '00000000-0000-0000-0000-000000000000';
      this.commonserviceService.onLeadSelectId.next({leadWorkflowId:this.workflowId,leadStageId:this.WorkflowStageId});

    }
    localStorage.setItem('PageMode', viewMode === 'cardMode' ? 'Card' : 'List');
  }

  scrolled(event: any, stageId: string, index: number) {
    const end = this.viewport?.toArray()[index]?.getRenderedRange().end;
    const start = this.viewport?.toArray()[index]?.getRenderedRange().start;
    const total = this.viewport?.toArray()[index]?.getDataLength();
    if (end >= total) {
      this.nextBatch(stageId, index);
    }
    if (start == 0) {
      //  this.previousBatch(stageId,index);
    }
  }
  nextBatch(stageId: string, index: number) {
    let indexOf = this.stages.findIndex(x => x.InternalCode === stageId);
    let maxSize = this.stages[indexOf]?.TotalPages;
    let StagesPageNo = this.stages[indexOf]?.PageNumber;
    if (StagesPageNo < maxSize) {
      this.scrolledStage = stageId;
      const requestObj = {
        JobId: this.JobId,
        GridId: this.GridId,
        LeadFilterParams: this.filterConfig,
        search: this.searchValue,
        PageNumber: Number(StagesPageNo + 1),
        PageSize: this.pagesize,
        OrderBy: this.sortingValue,
        Source: this.Source,
        WorkflowId: this.workflowId,
        ByPassPaging: false,
        QuickFilter: this.CountFilter ? this.CountFilter : 'All',
        StageId: ''
      }
      requestObj.StageId = stageId;
      this.forkApiCallRequest(requestObj, true, 0);
    }
  }
  previousBatch(stageId: string, index: number) {
    let indexOf = this.stages.findIndex(x => x?.InternalCode === stageId);
    let StagesPageNo = this.stages[indexOf]?.PageNumber;
    if (StagesPageNo > 1) {
      this.scrolledStage = stageId;
      const requestObj = {
        JobId: this.JobId,
        GridId: this.GridId,
        LeadFilterParams: this.filterConfig,
        search: this.searchValue,
        PageNumber: Number(StagesPageNo - 1),
        PageSize: this.pagesize,
        OrderBy: this.sortingValue,
        Source: this.Source,
        WorkflowId: this.workflowId,
        ByPassPaging: false,
        QuickFilter: this.CountFilter ? this.CountFilter : 'All',
        StageId: ''
      }
      requestObj.StageId = stageId;
      this.forkApiCallRequest(requestObj, true, 0);
      // this.viewport.toArray()[index].scrollToIndex(15);
    }
  }

  markPinUnPin(can: { IsPin: number; }, candidates: any, index: number) {
    let isPin: number;
    if (can?.IsPin == 1) {
      can.IsPin = 0;
      isPin = 0;
    } else {
      can.IsPin = 1;
      isPin = 1;
    }
    this.pinunpinCandidate(can, isPin)
    this.sortByPinAndDate(candidates, index);

  }

  sortByPinAndDate(can, index: number) {
    this.stages[index].candidates = [...can.sort((a, b) => {
      let IsPinSort = this.customSort(a, b, 'IsPin', 'number', 'desc');
      let LastActivitySort = this.customSort(a, b, 'LastActivity', 'string', 'desc');
      if (IsPinSort === 0) {
        return LastActivitySort;
      }
      return IsPinSort;
    })]
  }

  customSort(a, b, field, type: string, direction: string) {
    return this.sortCandidateData(a, b, field, type, direction);
  }

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

  pinunpinCandidate(can, isPin) {
    this.leadetails.LeadId = can?.LeadId ? [can?.LeadId] : [];
    this.leadetails['IsPin'] = isPin == 1 ? true : false;
    this.commonMarkAsReadSingle(can);
    this.leadService.pinUnpinLead(this.leadetails).subscribe(
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

  // <!---------@When: 09-10-2023 @who:Renu @why: EWM-14638 @Desc- make a common function for mark as read-------->
  commonMarkAsReadSingle(cand) {
    let candArrs: any = [];
    let candDiv: any = document.querySelector(".candidateInfoPanel_" + cand?.LeadId);
    if (candDiv?.classList.contains("unread")) {
      candDiv?.classList.remove("unread");
      cand.IsProfileRead = 1;
      candArrs.push(cand.CandidateId)
    }
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileReadUnread(candArrs, this.JobId);
    }
  }
  // <!---------@When: 09-10-2023 @who:Renu @why: EWM-14638 @Desc-read profile on call clicked-------->
  onCall() {
    this.commonMarkAsRead(this.selectedCandidates)
  }

  // <!---------@When: 09-10-2023 @who:Renu @why: EWM-14638 @Desc- make a common function for mark as read-------->
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

  onDragMoved(event) {
    if (event.delta.x === 1) {
      this.document.getElementById('kanban-sec').scrollLeft += 10;
    }

    if (event.delta.y === 1) {
      this.document.getElementById('kanban-sec').scrollTop += 10;
    } else {
      this.document.getElementById('kanban-sec').scrollTop -= 10;
    }
  }

  likeLead(can, stageCandList, Id) {
   
    (document.getElementById("thumb-up-btn_" + Id) as HTMLElement).style['pointer-events'] = 'none';
    let canArr: leadsLikeEntity[] = [];
    canArr.push({
      LeadId: can?.LeadId,
      LeadName: can?.LeadName,
      StageId: can?.StageId,
      StageName: can?.StageName,
      StageDisplaySeq: can?.StageDisplaySeq
    })
    let payload = {
      Leads: canArr,
      WorkflowId: this.workflowId,
      WorkflowName: this.WorkflowName
    }
    this.commonMarkAsReadSingle(can);
    this.leadService.likeLead(payload).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.dataChangeStatus = true;
        let data = repsonsedata.Data;
        if (data?.length == 1) {
          //  Renu EWM-14419 on 20-09-2023 @dec- push candidate to rejected satge
          let nextStageId = repsonsedata.Data[0].NextStageId;
          let parentStageId = repsonsedata.Data[0].ParentStageId;
          let nextStageName = repsonsedata.Data[0].NextStageName;
          let nextStageType = repsonsedata.Data[0].NextStageType;  // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
          const getCurrentStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === stageCandList?.InternalCode);
          const nextStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === parentStageId);
          const IsLastStage =this.stages.filter(x=>x?.InternalCode===nextStageId)[0]?.IsLastStage;
          if (nextStageIndex !== -1) {
            can.StageId = nextStageId;
            can.StageName = nextStageName;
            can.StageType = nextStageType;
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
              res.candidates = [...res.candidates]
              // res.candidatesCount = res.candidates?.length
            });
            this.getWorkFlowStagesForClient(this.workflowId);
          }
        if(IsLastStage===1){
          this.xeepService.performAction('eats-cookie');
        }
          // End
        }
        else {
        }
        (document.getElementById("thumb-up-btn_" + Id) as HTMLElement).style['pointer-events'] = 'auto';
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.cardloading = false;
        if (repsonsedata.Message == '400056') {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
        (document.getElementById("thumb-up-btn_" + Id) as HTMLElement).style['pointer-events'] = 'auto';
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.cardloading = false;
        (document.getElementById("thumb-up-btn_" + Id) as HTMLElement).style['pointer-events'] = 'auto';
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


  dislikeLead(can, stageCandList, Id) {
    (document.getElementById("thumb-down-btn_" + Id) as HTMLElement).style['pointer-events'] = 'none';
    let leadArr = [];
    if (this.selectedCandidates?.length > 0) {
      this.selectedCandidates?.forEach((e: any) => {
        leadArr.push({
          LeadId: e?.LeadId,
          LeadName: e?.LeadName,
          StageId: e?.StageId,
          StageName: e?.StageName,
          StageDisplaySeq: e?.StageDisplaySeq,
        })
      })
    }
    else {
      leadArr.push({
        LeadId: can?.LeadId,
        LeadName: can?.LeadName,
        StageId: can?.StageId,
        StageName: can?.StageName,
        StageDisplaySeq: can?.StageDisplaySeq,
      })
    }
    let payload = {
      Leads: leadArr,
      WorkflowId: this.workflowId,
      WorkflowName: this.WorkflowName
    }
    this.commonMarkAsReadSingle(can);
    this.leadService.disLikeLead(payload).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.cardloading = false;
          this.dataChangeStatus = true;
          let data = repsonsedata.Data;
          if (data?.length == 1) {
            let rejectedStageId = repsonsedata.Data[0].NextStageId;
            let nextStageName = repsonsedata.Data[0].NextStageName;
            let nextStageType = repsonsedata.Data[0].NextStageType; // @When: 19 Jun 24 @who:Ankit Rawat @Desc- get StageType to bind dynamaic job action menu  @Why:  EWM-17249-------
            const getCurrentStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === stageCandList?.InternalCode);
            const nextStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === rejectedStageId);
            if (nextStageIndex !== -1) {
              can.StageId = rejectedStageId;
              can.StageName = nextStageName;
              can.StageType = nextStageType;
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
                res.candidates = [...res.candidates]
                // res.candidatesCount = res.candidates?.length
              });
              this.getWorkFlowStagesForClient(this.workflowId);
              this.xeepService.performAction('binshot');
            }
            // End
          }
          else {
          }
          (document.getElementById("thumb-down-btn_" + Id) as HTMLElement).style['pointer-events'] = 'auto';
        } else if (repsonsedata.HttpStatusCode === 204) {
          // this.openMoveBoxModal(can);
          this.cardloading = false;
          if (repsonsedata.Message == '400054') {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
          (document.getElementById("thumb-down-btn_" + Id) as HTMLElement).style['pointer-events'] = 'auto';
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.cardloading = false;
          (document.getElementById("thumb-down-btn_" + Id) as HTMLElement).style['pointer-events'] = 'auto';
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          return false;
        }
      })
  }

  maxNumberClass(perSlide) {
    if (this.totalStages > perSlide) {
      this.screenPreviewClass = 'flext-start';
    } else {
      this.screenPreviewClass = '';
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    this.actionmenus();
    this.actionMenuShowHide();
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }
    this.detectScreenSize();
    if (this.currentMenuWidth >= 1650 && this.currentMenuWidth <= 1800) {
      this.screnSizePerStage = 7;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth >= 1500 && this.currentMenuWidth <= 1650) {
      this.screnSizePerStage = 6;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth >= 1400 && this.currentMenuWidth <= 1500) {
      this.screnSizePerStage = 5;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth >= 1300 && this.currentMenuWidth <= 1400) {
      this.screnSizePerStage = 4;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth >= 950 && this.currentMenuWidth <= 1300) {
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth >= 441 && this.currentMenuWidth <= 950) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 280 && this.currentMenuWidth <= 441) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } else {
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    }
    if (this.currentMenuWidth <= 767) {
      this.headerExpand = false
      this.hideChartOnHeaderCollpase = false
    } else if (this.currentMenuWidth <= 1299) {
      this.hideChartOnHeaderCollpase = false
    } else {
      this.headerExpand = false
      this.hideChartOnHeaderCollpase = false
    }
  }

  actionmenus(){
    if (this.currentMenuWidth >= 1024 && this.currentMenuWidth <= 1150) {
      this.navigation=true;
    } else 
    if (this.currentMenuWidth >= 768 && this.currentMenuWidth <= 1023) {
      this.actionmenuItmes = 3;
      this.slidePerWidth=240;
      this.navigation=true;
    } else if(this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767){
      this.actionmenuItmes = 2;
      this.slidePerWidth=180;
      this.navigation=true;
    } else {
      this.actionmenuItmes = 7;
      this.slidePerWidth=557;
    }
  }

  getSelectedCandidatesSameStageFlag() {
    if (this.selectedCandidates?.length == 0) {
      return true;
    }
    let checkStage = [];
    if (this.viewMode == 'cardMode') {
      checkStage = this.selectedCandidates != null && this.selectedCandidates?.filter(t => t?.StageId != this.selectedCandidates[0]?.StageId);
    } else {
      checkStage = this.selectedCandidates != null && this.selectedCandidates?.filter(t => t?.ParentId != this.selectedCandidates[0]?.ParentId);
    }
    if (checkStage?.length > 0) {
      this.commonTooltipFunTrue();
      return true;
    } else {
      this.commonTooltipFunFalse();
      return false;
    }
  }

  // <!---------@When: 27-Dec-24 @who:Renu @why: EWM-13767 EWM-14823 @Desc- common tooltip change function -------->
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
    } else if (this.selectedCandidates?.length == 1 && this.selectedCandidates[0]?.PhoneNumber != '' && this.selectedCandidates[0]?.PhoneNumber != null && this.selectedCandidates[0]?.PhoneNumber != undefined) {
      this.callBtnTooltip = 'label_call';
    }
    else if (this.selectedCandidates[0]?.PhoneNumber == '' || this.selectedCandidates[0]?.PhoneNumber == null || this.selectedCandidates[0]?.PhoneNumber == undefined) {
      this.callBtnTooltip = 'label_Lead_CanPhoneErr';
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
    else {
      this.acceptBtnTooltip = 'label_jobDetails_Accept';
    }
  }
  // <!---------@When: 27-Dec-24 @who:Renu @why: EWM-13767 EWM-14823 @Desc-common tooltip change function-------->
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
    } else if (this.selectedCandidates?.length == 1 && this.selectedCandidates[0]?.PhoneNumber != '' && this.selectedCandidates[0]?.PhoneNumber != null && this.selectedCandidates[0]?.PhoneNumber != undefined) {
      this.callBtnTooltip = 'label_call';
    }
    else if (this.selectedCandidates[0]?.PhoneNumber == '' || this.selectedCandidates[0]?.PhoneNumber == null || this.selectedCandidates[0]?.PhoneNumber == undefined) {
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
    else {
      this.acceptBtnTooltip = 'label_stageCanSelectionErr';
    }
  }

  actionMenuShowHide() {
    if (this.currentMenuWidth > 1024 && this.currentMenuWidth < 1150) {
      this.actionButtonVisible = 7;
      this.navigation = true;
    } else if (this.currentMenuWidth > 768 && this.currentMenuWidth < 1023) {
      this.actionButtonVisible = 3;
      this.navigation = true;
    } else if (this.currentMenuWidth > 240 && this.currentMenuWidth < 767) {
      this.actionButtonVisible = 2;
      this.navigation = true;
    } else {
      this.actionButtonVisible = 11;
      this.navigation = false;
    }
  }

  private detectScreenSize() {
    this.mobileMenu(this.tagSelecteditem);
  }

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

  onSwiper(swiper) {
    // console.log(swiper);
  }

  getWorkFlowStagesForClient(Id) {
    this.loadingStage = true;
    this.JobworkFlowBypipeIdObs = this.leadService.getAllStageDetails('?Id=' + Id).pipe(takeUntil(this.destroy$)).subscribe(
      (data: ResponceData) => {
        this.loadingStage = false;
        if (data.HttpStatusCode === 200) {
          this.dataChangeStatus = true;
          this.stagesList = data.Data.Stages;
          data.Data.Stages.filter(o1 => !this.stages.some(o2 => {
            if (o1.InternalCode === o2.InternalCode)
              o2.candidatesCount = o1.Count;
          }));

          this.totalStages = this.stagesList?.length;
          if (this.stagesList?.length > 0) {
            this.getLeadCardDetails(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
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

  drop(event: CdkDragDrop<{}[]>, stageName, stageId, StageDisplaySeq, index: number, candidates, stageType) {
    let tempData = event.previousContainer.data;
    const tempindex = event.previousContainer.data.findIndex(candidate => candidate === this.tempcan);

    if (event.previousContainer == event.container) {
      moveItemInArray(event.container.data, event.previousContainer.data.indexOf(event.item.data), event.container.data.indexOf(event.item.data));
      this.stages[index].candidates = [...this.stages[index]?.candidates]
    } else {

      transferArrayItem(event.previousContainer.data, event.container.data, tempindex, event.currentIndex);
      this.changeDetectorRef.markForCheck();
      this.dataChangeStatus = true;
      // Use setTimeout to trigger change detection
      setTimeout(() => {
        this.changeDetectorRef.detectChanges();
      });
      this.checkDropStageValid(event, event.container.data[event.currentIndex], StageDisplaySeq, stageName, stageId, stageType);
    }
    this.jobService.pageDataChangeStatus(true);
    this.stages?.forEach(res => {
      res.isDisabled = false;
      // res.candidates=[...res.candidates]
      // res.candidatesCount = res.candidates?.length;
      //res.Count = res.candidates?.length;
    })

  }

  checkDropStageValid(event: CdkDragDrop<{}[]>, dropData, newStageOrder, stageName, stageId, stageType) {
    if (dropData != undefined) {
      let oldStageOrder = dropData.StageDisplaySeq;
      if (newStageOrder > oldStageOrder) {
        this.onUpdate(event, dropData, stageName, stageId, newStageOrder, stageType);
        return true;
      } else {
        //this.backdropBox(event);
        this.onUpdate(event, dropData, stageName, stageId, newStageOrder, stageType);
        return false;
      }
    } else {
      this.backdropBox(event);
    }
  }

  onUpdate(event: CdkDragDrop<{}[]>, value, stageName, stageId, newStageOrder, stageType): any {
    this.cardloading = true;
    value.Candidateloader = true;
    let previousStageId = value.StageId;
    let previousStageObj = value;
    let formdata = {};
    formdata['LeadId'] = value.LeadId;
    formdata['LeadName'] = value.LeadName;
    formdata['WorkflowId'] = value.WorkflowId;
    formdata['WorkflowName'] = this.WorkflowName;
    formdata['PreviousStageId'] = value.StageId;
    formdata['PreviousStageName'] = value.StageName;
    formdata['NextStageId'] = stageId;
    formdata['NextStageName'] = stageName;
    formdata['CurrentStageDisplaySeq'] = value.StageDisplaySeq;
    formdata['NextStageDisplaySeq'] = newStageOrder;
    // formdata['JobHeadCount'] = this.headerListData?.HeaderAdditionalDetails?.HeadCount;

    this.candidateMoveActionObs = this.leadService.leadMoveAction(formdata).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.cardloading = false;
          value.Candidateloader = false;
          this.changeCurrentStage(value, stageName, stageId, newStageOrder, stageType);
          this.getWorkFlowStagesForClient(this.workflowId);
          if (this.selectedCandidates?.length > 0) {
            this.showHideDocumentButtons = true
          } else {
            this.showHideDocumentButtons = false
          }
          // @suika EWM-11782 @Whn 02-06-2023
          if (this.viewMode == 'listMode') {
            this.updateAllComplete();
          } else {
            this.stages?.forEach(v => {
              v.candidates = [...v.candidates];
              if (previousStageId == v.InternalCode) {
                this.checkParentStageMark(v);
              }
            });
          }
          let nextStageId = repsonsedata.Data.NextStageId;
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
          if (repsonsedata.Message == '400041') {
            // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show 
            this.alertValidationManageAccess(repsonsedata.Data.SkipStageName, repsonsedata.Data.SkipStagePosition);
          }
          else if (repsonsedata.Message === "400058") {
            this.alertMaxCandidateAddInLastStage();
          }
          else if (repsonsedata.Message === "400042") {
            this.refreshCandidateList();
          }
          else {
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

  backdropBox(event: CdkDragDrop<{}[]>) {
    if (event.previousContainer == event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex, event.previousIndex);
    }
    this.jobService.pageDataChangeStatus(true);
    this.stages?.forEach(res => {
      res.isDisabled = false;
      res.candidates = [...res.candidates];
      //res.candidatesCount = res.candidates?.length;
      // res.Count = res.candidates?.length;
    })
  }

  // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show 
  public alertValidationManageAccess(SkipStageName, SkipStagePosition) {
    let message1 = `label_stage_msg1`;
    const message2 = `label_stage_msg2`;
    const message3 = `label_stage_msg3`;
    const message = '';
    const title = '';
    const subTitle = '';
    let mintitle = 'label_jobsummary_job_workflow_manuallymovingcandidates';
    switch (SkipStagePosition) {
      case 'parent':
        mintitle = 'label_jobsummary_job_workflow_manuallymovingcandidates';
        break;
      case 'child':
        mintitle = 'label_jobsummary_job_workflow_manuallymovingcandidates_substage';
        break;
      case 'subchild':
        mintitle = 'label_jobsummary_job_workflow_manuallymovingcandidates_substage_Sub-substage';
        break;
    }

    message1 = this.commonServiesService.getreplace(mintitle, SkipStageName);

    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: { dialogData, isButtonShow: true, SkipStageName: SkipStageName, message1: message1, message2: message2, message3: message3 },
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {
    })
  }


  checkParentStageMark(stageData) {
    if (this.selectedCandidates?.length == 0) {
      stageData.IsIntermediate = false;
      stageData.CheckboxStatus = false;
      return;
    }
    if (stageData.candidates?.length == this.selectedCandidates?.length) {
      stageData.IsIntermediate = false;
      stageData.CheckboxStatus = true;
    } else {
      stageData.CheckboxStatus = false;
      stageData.IsIntermediate = true;
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

  public alertMaxCandidateAddInLastStage() {
    const jobHeadCount = this.headerListData?.HeaderAdditionalDetails?.HeadCount;
    const message = `${this.translateService.instant('label_candidate_Of_Job_HeaCount')} (${jobHeadCount}).
            ${this.translateService.instant('label_max_candidate_Of_Job_HeaCount')} (${jobHeadCount})
            ${this.translateService.instant('label_candidate_Of_Job_HeaCount_message')} 
            `
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: { dialogData, isButtonShow: true, message: message },
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
  refreshCandidateList() {
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
        this.getWorkFlowStages(this.workflowId);
      }
    });
  }

  changeCurrentStage(dropElement, stageName, stageId, newStageOrder, stageType) {
    if (dropElement != undefined) {
      dropElement.WorkFlowStageName = stageName;
      dropElement.WorkFlowStageId = stageId;
      dropElement.StageName = stageName;
      dropElement.StageId = stageId;
      dropElement.StageDisplaySeq = newStageOrder;
      dropElement.StageType = stageType;
      if (dropElement.CheckboxStatus == true) {
        dropElement.CheckboxStatus = false;
        this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a.CandidateId === dropElement.CandidateId), 1);
      }
    }
  }

  dragStart(ev, StageDisplaySeq, can) {
    this.tempcan = can;
    this.stages?.forEach(res => {
      if (res.StageDisplaySeq < StageDisplaySeq) {
        res.isDisabled = true;
      }
    })
  }


  selectStageCanData(stageData, Can, event, stageIndex: number) {
    this.disabledDashboard=false;
    this.selectedStageIndex = stageIndex;
    if (event.checked === true) {
      this.selectedStageCode = stageData?.InternalCode;
      this.selectedCandidates.push(Can);
      Can.CheckboxStatus = true;
      this.showAlertMsgOnCandidateSelection(stageData, Can, event);
      // End
      if (stageData?.lastStage) {
        this.isLastSatgeCand = true;
      }
      else {
        this.isLastSatgeCand = false;
      }
    } else {
      this.selectedCandidates.splice(this.selectedCandidates.findIndex(a => a?.LeadId === Can?.LeadId), 1)
      Can.CheckboxStatus = false;
      let selectedItem = this.selectedCandidates.filter(res => res?.StageId == stageData?.InternalCode);
      if (selectedItem?.length == 0) {
        stageData.IsIntermediate = false;
        stageData.CheckboxStatus = false;
      } else {
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
      else {
        this.removeBtnTooltip = 'label_jobDetails_Remove'
      }
    }
    else {
      this.removeBtnTooltip = 'label_jobDetails_Remove';
      this.isSelectedCandOfOtherSatgesOnly = false;
    }
    // Adarsh singh
    if (this.selectedCandidates?.length > 0) {
      this.showHideDocumentButtons = true;
      // check lat long
      this.selectedClientAndCandidateLatLong = this.checkClientAndCandidateLatLong(this.selectedCandidates[0]);
    } else {
      this.showHideDocumentButtons = false;
      this.selectedClientAndCandidateLatLong = this.checkClientAndCandidateLatLong(this.selectedCandidates[0]);
    }    
    if (this.selectedCandidates?.length> 0) {
      let res = this.selectedCandidates.filter(element => element?.EmailId!='' && element?.EmailId!=' ' && element?.EmailId!=null && element?.EmailId!=undefined);
     if (res?.length==0) {
        this.emailDisabel=true; 
     }else{
     this.emailDisabel=false;  
     }
     let noPhoneNumber = this.selectedCandidates.filter(element => element?.PhoneNumber!='' && element?.PhoneNumber!=' ' && element?.PhoneNumber!=null && element?.PhoneNumber!=undefined);
     if (noPhoneNumber?.length==0) {
        this.noPhoneNumber=true; 
     }else{
     this.noPhoneNumber=false;  
     }
      }
  }

  showAlertMsgOnCandidateSelection(stageData, Can, event) {
    this.selectedCandidates = this.selectedCandidates.filter((n, i) => this.selectedCandidates.indexOf(n) === i);
    if (this.selectedCandidates?.length > this.NoOfCanSelectedEachStage) {
      // this.alertSingleCandidatesSelectionMessage(stageData,Can);
    }
    /*else  if(this.selectedCandidates[0]?.StageId!=undefined && this.selectedCandidates[0]?.StageId!=stageData?.InternalCode){
      this.alertStageSelectionMessage(stageData);
     }*/
    else {
      this.checkParentStage(stageData);
    }
  }

  checkParentStage(stageData) {
    if (this.selectedCandidates?.length == 0) {
      stageData.IsIntermediate = false;
      stageData.CheckboxStatus = false;
      return;
    }
    let checkStage = stageData != null && stageData.candidates?.every(t => t.CheckboxStatus == 1 || t.CheckboxStatus == true);
    if (checkStage) {
      stageData.IsIntermediate = false;
      stageData.CheckboxStatus = true;
    } else {
      stageData.CheckboxStatus = false;
      stageData.IsIntermediate = true;
    }
  }

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

  checkSelectedCandOfFirstStage() {
    if (this.firstStageData === undefined || this.firstStageData === null) {
      this.firstStageData = this.stagesList.find(item => item.SerialNumber === 1);
    }

    let res: boolean;
    if (this.selectedCandidates?.length > 0) {
      if (this.viewMode === 'cardMode') {
        res = this.selectedCandidates.every((e: any) => e?.StageId === this.firstStageData?.InternalCode);
      }
      else {
        res = this.selectedCandidates.every((e: any) => e?.ParentId === this.firstStageData?.InternalCode);
      }
    }
    else {
      res = false;
    }
    return res
  }


  //comment by maneesh start for email section
  //        selectStageCanData(data,d,type,j){
  // this.selectedCandidates.push(data?.candidates[j]);
  //       }
  onBulkEmail() {
    this.disabledDashboard=true;
    if (this.selectedCandidates?.length>1) {
    this.toEmailList= this.selectedCandidates?.filter(res => res?.EmailId!='' && res?.EmailId!=' ' && res?.EmailId!=null && res?.EmailId!=undefined); 
    }else{
      this.toEmailList= this.selectedCandidates?.filter(res => res?.EmailId!='' && res?.EmailId!=' ' && res?.EmailId!=null && res?.EmailId!=undefined); 
    }
    this.loading = false;
    this.commonMarkAsRead(this.selectedCandidates)
    this.getAllEmailIdFromMappedJob(this.selectedCandidates);
    this.openMail(this.selectedCandidates, this.IsEmailConnected, true);
    this.disabledDashboard=false;
  }

  getAllEmailIdFromMappedJob(data) {
    let arr = data;
    this.getAllEmailIdFormMappedJob = data?.map(function (el) { return el.EmailId; });
    this.getCandidateData = [];
    arr?.forEach(element => {
      this.getCandidateData.push({
        "ModuleType": "CAND",
        "Id": element?.CandidateId,
        "EmailTo": element?.EmailId
      })
    });
    this.getCandidateData.filter((value, index) => {
      data.indexOf(value) === index
    })
  }
  openMail(responseData, IsEmailConnected, isBulkEmail: boolean) {
    this.disabledDashboard=false;
    let subObj = {}
    if (this.viewMode === 'cardMode') {
      subObj = {
        JobName: this.JobName,
        StageName: this.selectedCandidates[0]?.WorkFlowStageName
      }

      this.getCandidateData = [];
      this.getCandidateData?.push({
        "ModuleType": "CLIE",
        "Id": this.toEmailList[0]?.LeadId,
        "EmailTo": this.toEmailList[0]?.EmailId
      })

    }
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(LeadMailComponent, {
      maxWidth: "750px",
      width: "95%",
      height: "100%",
      maxHeight: "100%",
      data: {
        'candidateres': responseData, 'IsEmailConnected': IsEmailConnected, 'workflowId': this.workflowId,
        'JobId': this.JobId,
        'candidateId': this.candidateIdData, 'isBulkEmail': true,
        'candiateDetails': this.getCandidateData, 'toEmailList': this.toEmailList,
        openDocumentPopUpFor: 'Candidate', multipleEmail: this.multipleEmail,
        isDefaultSubj: true, subjectObj: subObj, 'JobTitle': this.JobName,
        caldidateJobMappedPreviewEmail: this.selectedCandidates[0]?.LeadId
      },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.multipleEmail = false;
      this.commonserviceService.leadListMode.next({Mode:'LISTDATA'});
    })
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  onSendSMSToCandidate() {
    if (this.selectedCandidates?.length === 1) {
      this.openJobSMSForCandidate(this.selectedCandidates[0]);
    }
    else {
      this.openJobBulkSMSForCandidate();
    }
    this.commonMarkAsRead(this.selectedCandidates);
    this.disabledDashboard=false;
  }

  openJobSMSForCandidate(dataItem) {
    let dataItemObj = {};
    dataItemObj['PhoneNumber'] = dataItem?.PhoneNumber
    dataItemObj['Name'] = dataItem?.LeadName;
    dataItemObj['CandidateId'] = dataItem?.LeadId;
    dataItem = dataItemObj;
    const dialogRef = this.dialog.open(JobSmsComponent, {
      data: new Object({ jobdetailsData: dataItem, UserType: this.userType,Lead: 'LEAD' }),
      panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.loading = false;
      this.commonserviceService.leadListMode.next({Mode:'LISTDATA'});
      } else {
        this.loading = false;
      }
      this.smsHistoryToggel = false;
      this.quickFilterToggel = true;
    })
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  openJobBulkSMSForCandidate() {
    this.commonMarkAsRead(this.selectedCandidates);
    const dialogRef = this.dialog.open(BulkSmsComponent, {
      data: new Object({
        selectedCandidates: this.selectedCandidates,
        leadType: this.userType
      }),
      panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != true) {
        this.loading = false;
      }
      this.commonserviceService.leadListMode.next({Mode:'LISTDATA'});
    })
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }

  checkZoomConnectedOrNot() {
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    // Zoom
    let zoomCallIntegrationObj = otherIntegrations?.filter(res => res?.RegistrationCode === this.zoomPhoneCallRegistrationCode);
    this.zoomCheckStatus = zoomCallIntegrationObj[0]?.Connected;
    // SMS
    let smsIntegrationObj = otherIntegrations?.filter(res => res?.RegistrationCode === this.burstSMSRegistrationCode);
    this.SMSCheckStatus = smsIntegrationObj[0]?.Connected;
    this.zoomSMSTooltipMSG();

  }
  zoomSMSTooltipMSG() {
    if (!this.SMSCheckStatus) {
      this.smsBtnTooltip = 'label_connectsms';
    }
    else {
      this.smsBtnTooltip = 'label_SMS';
    }
  }

  conertIntoLead(Id) {
    const dialogRef = this.dialog.open(ConvertLeadClientComponent, {
      data: new Object({ LeadId: Id, formType: "edit" }),
      panelClass: ['xeople-modal-lg', 'leadEdit', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res==true) {
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

  HideStageDetails(stageData) {
    if ((this.stages?.length - 1) == this.HideStageIds?.length) {
      this.alertHideStageMessage(stageData);
    } else {
      stageData.StageVisibility = 0;
      stageData.CheckboxStatus = false;
      stageData.IsIntermediate = false;
      stageData?.candidates?.forEach(element => {
        element.CheckboxStatus = false;
      })
      this.HideStageIds.push(stageData.InternalCode);
      let selectedCan = this.selectedCandidates.filter(res => res.StageId != stageData.InternalCode);
      this.selectedCandidates = selectedCan;
      this.hideShowStagesDetails();
    }
    if (this.selectedCandidates?.length > 0) {
      this.showHideDocumentButtons = true;
    } else {
      this.showHideDocumentButtons = false;
    }
  }

  public alertHideStageMessage(stageData) {
    const message = `label_stage_hide_error`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: { dialogData, isButtonShow: true, message: message },
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {
      this.ShowStageDetails(stageData);
    })
  }

  hideShowStagesDetails() {
    let hideStageData = this.stages?.filter(res => res.StageVisibility == 0);
    if (hideStageData?.length > 0) {
      hideStageData.forEach(element => {
        this.HideStageIds.push(element.InternalCode);
      });
    }
    this.HideStageIds = this.HideStageIds.filter((n, i) => this.HideStageIds.indexOf(n) === i);
    this.StageDetailsObj.StageIds = this.HideStageIds.toString() ? this.HideStageIds.toString() : '';
    this.leadService.hideLeadWorkflowStage(this.StageDetailsObj).subscribe(
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

  ShowStageDetails(stageData) {
    this.dataArr?.forEach(element => {
      this.stages?.forEach(res => {
        if (element.InternalCode == res.InternalCode) {
          res.StageVisibility = 1;
          this.HideStageIds.splice(this.HideStageIds.findIndex(a => a.InternalCode === res.InternalCode), 1);
        }
      })
    });
    stageData.StageVisibility = 1;
    this.hideShowStagesDetails();
  }

  rightToggel() {
    this.sidenav1.close();
    if (!this.sidenav1.opened) {
      this.sidenav1.open();
      this.sideMenuContext = 'quickfilter-section';
    }
    this.drawerIconStatus = !this.drawerIconStatus;
    // if (this.drawerIconStatus) {
    //   this.getCandidateJobFilterCount(this.JobId,this.workflowId);
    // }
  }

  showAllStages() {
    this.stages?.forEach(res => {
      res.StageVisibility = 1;
      this.HideStageIds.splice(this.HideStageIds.findIndex(a => a.InternalCode === res.InternalCode), 1);
    })
    this.hideShowStagesDetails();
  }

  qucikFilterClose() {
    this.drawerIconStatus = false;
    this.sideMenuContext = '';
  }

  openJobWorkflowSubStages(code) {
    this.treeMatDrawer = true;
    this.loadingTree = true;
    this.dataArr = [];
    let stageList = this.stagesList.filter(e => e.InternalCode == code);
    let IsJobid = '';
    IsJobid = '?Id=' + this.workflowId + '&stageId=' + code;
    this.JobworkFlowChildByIdObs = this.leadService.getAllStageDetails(IsJobid).pipe(takeUntil(this.destroy$)).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.view = true;
          this.loadingTree = false;
          this.dataArr = data.Data.Stages.filter(e => e.InternalCode == stageList[0].InternalCode);
          this.dataArr?.forEach(element => {
            this.stages?.forEach(res => {
              if (element.InternalCode == res.InternalCode && res.StageVisibility == 0) {
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

  backToLeadLading() {
    this.route.navigate(['/client/leads/lead/lead-landing']);
  }

  refresh() {
    this.viewport?.toArray().forEach(x => x.scrollToIndex(0));
    this.Source = '';
    if (this.viewMode == 'cardMode') {
      this.SelectedStageId = '00000000-0000-0000-0000-000000000000';
    }
    // setTimeout(() => {
    //   this.listViewPage?.performActionEventWise(EventType.REFRESH);
    // }, 400);
    this.selectedCandidates = []
    if (this.isCardMode == true) {
      this.stages?.forEach(v => { v.CheckboxStatus = false, v.PageNumber = 1 });
      //this.getLeadCardDetails(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);

    } else {
      this.allComplete = false;
      // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
    }
    this.getWorkFlowStages(this.workflowId);
  }
  public swiperLoader=false;
  onAccept() {
    this.swiperLoader=true
    this.disabledDashboard=true;
    let canArr = [];
    this.selectedCandidates?.forEach((can: any) => {
      canArr.push({
        LeadId: can?.LeadId,
        LeadName: can?.LeadName,
        StageId: can?.StageId,
        StageName: can?.StageName,
        StageDisplaySeq: can?.StageDisplaySeq
      })
    })
    let payload = {
      Leads: canArr,
      WorkflowId: this.workflowId,
      WorkflowName: this.WorkflowName
    }
    this.leadService.likeLead(payload).subscribe((repsonsedata: ResponceData) => {
      this.swiperLoader=false;
      if (repsonsedata.HttpStatusCode === 200) {
        this.swiperLoader=false;
        this.disabledDashboard=false;
      if (this.ListModeData=='LIST') {
        this.commonserviceService.leadListMode.next({Mode:'LISTDATA'});
      }else{
        this.getWorkFlowStagesForClient(this.workflowId);
      }
      let nextStageId = repsonsedata.Data[0].NextStageId;
      const IsLastStage =this.stages.filter(x=>x?.InternalCode===nextStageId)[0]?.IsLastStage;
      if(IsLastStage===1){
        this.xeepService.performAction('eats-cookie');
      }
      }
      else if (repsonsedata.HttpStatusCode === 204) {
        this.disabledDashboard=false;
        if (repsonsedata.Message == '400056') {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
        this.disabledDashboard=false;
      }
      else if (repsonsedata.HttpStatusCode === 400) {
        this.disabledDashboard=false;
        if (repsonsedata.Message === "400058") {
          this.alertMaxCandidateAddInLastStage();
        }
        this.cardloading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.disabledDashboard=false;
        this.swiperLoader=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        return false;
      }
    })
  }
  onReject() {
    this.swiperLoader=true;
    this.disabledDashboard=true;
    let canArr = [];
    this.selectedCandidates?.forEach((can: any) => {
      canArr.push({
        LeadId: can?.LeadId,
        LeadName: can?.LeadName,
        StageId: can?.StageId,
        StageName: can?.StageName,
        StageDisplaySeq: can?.StageDisplaySeq
      })
    })
    let payload = {
      Leads: canArr,
      WorkflowId: this.workflowId,
      WorkflowName: this.WorkflowName
    }
    this.leadService.disLikeLead(payload).subscribe(
      (repsonsedata: ResponceData) => {
        this.swiperLoader=false;
        if (repsonsedata.HttpStatusCode === 200) {
        this.disabledDashboard=false;
          if (this.ListModeData=='LIST') {
            this.commonserviceService.leadListMode.next({Mode:'LISTDATA'});
          }else{
            this.getWorkFlowStagesForClient(this.workflowId);
          }
          this.xeepService.performAction('binshot');
        }
        else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Message == '400054') {
            this.disabledDashboard=false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }
        else if (repsonsedata.HttpStatusCode === 400) {
          this.cardloading = false;
          this.disabledDashboard=false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.disabledDashboard=false;
          this.swiperLoader=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          return false;
        }
      })
  }
  onCloseToggleAction() {
    let stageWiseCand = this.stages?.filter(e => e?.InternalCode === this.selectedCandidates[0]?.StageId);
    stageWiseCand[0]?.candidates?.forEach(element => {
      element.CheckboxStatus = false;
    });
    stageWiseCand[0].CheckboxStatus = false;
    stageWiseCand[0].IsIntermediate = false;
    let ndata = this.selectedCandidates?.filter(res => res.StageId != stageWiseCand[0]?.InternalCode);
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

  pinUnPinForMultipleCand(isPin?:number) {
    this.disabledDashboard=true;
    this.pinUnpinMutltipleCandidate(isPin);
    this.commonMarkAsRead(this.selectedCandidates)
  }
  pinUnpinMutltipleCandidate(isPin?:number) {
    let selectedCandArr: any = [];
    this.selectedCandidates?.forEach(element => {
      selectedCandArr?.push(element?.LeadId)
      element['IsPin'] = isPin
    });
    this.leadetails.LeadId = selectedCandArr;
    this.leadetails['IsPin'] = isPin===1? true: false;
    let indexOf = this.stages.findIndex(x => x?.InternalCode === this.selectedCandidates[0]?.StageId);
    let stageWiseCand = this.stages?.filter(e => e?.InternalCode === this.selectedCandidates[0]?.StageId);
    this.sortByPinAndDate(stageWiseCand[0]?.candidates, indexOf);
    // End
    this.leadService.pinUnpinLead(this.leadetails).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.cardloading = false;
          this.disabledDashboard=false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.cardloading = false;
          this.disabledDashboard=false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.cardloading = false;
          this.disabledDashboard=false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          return false;
        }
        this.disabledDashboard=false;
      })
    this.disabledDashboard=false;
    }
        viewWorkflowStages() {
           
            const dialogRef = this.dialog.open(ViewLeadWorkflowStagesComponent, {
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

          selectStageData(stageData,event){
            this.disabledDashboard=false;
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
                let index = this.selectedCandidates.findIndex(a => a?.LeadId === element?.LeadId);                if (index !== -1) {
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
                this.removeBtnTooltip = 'label_jobDetailsSelectedLeadOnlyParent';
              }
              else{
                this.removeBtnTooltip = 'label_jobDetails_Remove'
              }
            }else {
              this.isSelectedCandOfOtherSatgesOnly = false;
              this.removeBtnTooltip = 'label_jobDetails_Remove';
            }
      if (this.selectedCandidates?.length> 0) {
      let res = this.selectedCandidates.filter(element => element?.EmailId!='' && element?.EmailId!=' ' && element?.EmailId!=null && element?.EmailId!=undefined);
      if (res?.length==0) {
        this.emailDisabel=true; 
      }else{
      this.emailDisabel=false;  
      }
      let noPhoneNumber = this.selectedCandidates.filter(element => element?.PhoneNumber!='' && element?.PhoneNumber!=' ' && element?.PhoneNumber!=null && element?.PhoneNumber!=undefined);
      if (noPhoneNumber?.length==0) {
         this.noPhoneNumber=true; 
      }else{
      this.noPhoneNumber=false;  
      }
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
                  let filterParamArr:any[] = [];
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
                  jsonObjFilter['LeadFilterParams'] = filterParamArr;
                  jsonObjFilter['search'] = this.searchValue;
                  jsonObjFilter['PageNumber'] = this.pageNum;
                  jsonObjFilter['PageSize'] = this.pagesize;
                  jsonObjFilter['OrderBy'] = this.sortingValue;
                  //jsonObjFilter['WorkflowId']=this.workflowId;
                  jsonObjFilter['GridId'] = this.GridId;
                  this.filterConfig = filterParamArr;
                  if (this.viewMode == 'cardMode') {
                    this.getLeadCardDetails(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
                  } else {
                    // this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
                  }
                }
              })
              if (this.appSettingsService.isBlurredOn) {
                (document.getElementById("main-comp") as HTMLElement).classList.add("is-blurred");
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
              const subTitle = 'label_LeadDetailsFilters';
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
                    if (this.viewMode == 'cardMode') {
                      this.getLeadCardDetails(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
                    } else {
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
                        //this.viewMode = repsonsedata.Data.PageMode=='Card'?'cardMode':'listMode';
                       // localStorage.setItem('PageMode', repsonsedata.Data.PageMode);
            
                        localStorage.setItem('viewMode', this.viewMode);
                        this.viewMode=localStorage.getItem('viewMode');
                        this.viewMode == 'cardMode' ? this.isCardMode = true : this.isCardMode = false;
                        this.dynamicFilterArea = false;
                       
                        if (this.filterConfig !== null) {
                          this.filterCount = this.filterConfig?.length;
                        } else {
                          this.filterCount = 0;
                        }
                   
                      }
                
                     this.getWorkFlowStages(this.workflowId);   
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
          createLead() {
            const dialogRef = this.dialog?.open(AddLeadComponent, {
              data: new Object({ PageUrl:this.route?.url}),
              panelClass: ['xeople-modal-md', 'add-lead', 'animate__animated', 'animate__zoomIn'],
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(res => {
              if (res) {
                if(this.viewMode == 'cardMode'){
                  this.refresh();
                }else{
                  this.viewMode='listMode';
                  this.commonserviceService.onLeadSelectId.next({leadWorkflowId:this.workflowId,leadStageId:this.WorkflowStageId});
                }
                //this.getFilterConfig();
                //this.dialogRef.close();
              }
              let dir: string;
              dir = document?.getElementsByClassName('cdk-global-overlay-wrapper')[0]?.attributes['dir']?.value;
              let classList = document?.getElementsByClassName('cdk-global-overlay-wrapper');
              for (let i = 0; i < classList.length; i++) {
                classList[i].setAttribute('dir', this.dirctionalLang);
              }
            })
          }


          openNewEmailModalForSingleMultiCand(){
            if (this.selectedCandidates?.length ===1) {
              this.multipleEmail = true;
              this.candidateIdData = this.selectedCandidates[0]?.LeadId;
              let selectedCandArr:{ CandidateId: string; EmailId: string;}[] = [];
              this.selectedCandidates?.forEach(element => {
                selectedCandArr?.push({
                  'CandidateId': element?.LeadId,
                  'EmailId': element?.EmailId
                  })
              });
             this.toEmailList = selectedCandArr;
              this.onBulkEmail();
              this.commonMarkAsRead(this.selectedCandidates);
            }
            else{
              this.onBulkEmail();
            }
          }
          openCandidateDetails(leads: any) {
            let leadlist:any[]=[];
            leadlist.push(leads);
            leadlist?.forEach(element => {
             element["Email"] = element?.EmailId,
             element["ShortName"] = element?.ShortName,
             element["Name"] = element?.LeadName
            });
            this.dialog.open(LeadInfoPopupComponent, {
              data: { 'candidatedata': leadlist[0]},
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

          filterStageWiseData(node){
            if(this.viewMode == "listMode"){
              this.selectedCandidates = [];
              this.allComplete = false;
              if(this.SelectedStageId==node.InternalCode){
                this.SelectedStageId = '00000000-0000-0000-0000-000000000000'
              }else{
                this.SelectedStageId = node.InternalCode;
              }
             
            }
          }
getBulkSmsFlag(){            
  if(!this.isSMSStatus && this.selectedCandidates==null ||this.selectedCandidates==undefined || this.selectedCandidates?.length==0){
    return true;
  }else{
    let checkStage = this.selectedCandidates != null && this.selectedCandidates?.filter(t => t?.PhoneNumber!=null && t?.PhoneNumber!=undefined && t?.PhoneNumber!='');
    if(!this.isSMSStatus || checkStage?.length>0){
      return false;
    }{
      return true;
    }
  }
}
getIntegrationCheckSMSstatus() {
  // this.loading = true;
  this.systemSettingService.getIntegrationCheckstatus(this.burstSMSRegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        //  this.loading = false;
        if (repsonsedata.Data) {
          this.isSMSStatus = repsonsedata.Data?.Connected;
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
       

        

        
         openMoveBoxModal(dataItem: any) {
            dataItem.JobHeadCount= this.headerListData?.HeaderAdditionalDetails?.HeadCount
            this.commonMarkAsReadSingle(dataItem);
            const dialogRef = this.dialog.open(LeadWorkflowStagesMappedPopupComponent, {
              maxWidth: "550px",
              data: { data: dataItem, WorkflowId: this.workflowId, WorkflowName: this.WorkflowName },
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
                  //this.getCandidatemappedtojobcardAll(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig);
                } else {
                  this.IsIntermediate = false;
                //   this.getWorkFlowStagesForClient(this.workflowId);
                //   this.getCandidateListByJob(this.pagesize, this.pageNum, this.sortingValue, this.searchValue, this.filterConfig, false, false,this.SelectedStageId);
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

         
          clickStageId(stageId) {
            if(this.SelectedStageId == stageId){
              this.SelectedStageId = '00000000-0000-0000-0000-000000000000';
              this.WorkflowStageId='00000000-0000-0000-0000-000000000000';
              this.commonserviceService.onLeadSelectId.next({leadWorkflowId:this.workflowId,leadStageId:this.WorkflowStageId});
            }else{
              this.SelectedStageId = stageId;
              this.WorkflowStageId=stageId;
              this.commonserviceService.onLeadSelectId.next({leadWorkflowId:this.workflowId,leadStageId:this.WorkflowStageId});
            }
            
           }

getWorkFlowStagesForListView(stagesList,can,singleCheck,isAnyRejectedStageTypeListView) {
  this.isAnyRejectedStageType=isAnyRejectedStageTypeListView;
  let StageVisibilityLength = stagesList?.filter(res => res?.StageVisibility == 1);
  this.StageVisibilityCount = StageVisibilityLength?.length;
  let res = stagesList?.filter((e: any) => e?.IsLastStage === 1);
  let IsLastStageData = can?.filter((e: any) => e?.IsLastStage === 1);
  if (res?.length > 0 && can?.length>1 && !singleCheck) {
    this.isLastSatgeCand = true;
  }
  else if(IsLastStageData?.length>0) {
    this.isLastSatgeCand = true;
  }else{
    this.isLastSatgeCand = false;
  }
}


setPreviousUrl(can){
  const previousUrl = '/client/leads/lead/lead-details';
  const queryParams = {
    workflowId: this.workflowId,
    WorkflowName: this.WorkflowName
  };
  this.navigationService.setPreviousUrl(previousUrl, queryParams);
  this.route.navigate(['/client/leads/lead/lead-detail-summary'], { queryParams: { clientId: can?.LeadId,type:'lead' } });
 
}
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}
}

