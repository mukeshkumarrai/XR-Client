// <!-- 
//   @Type: File, <ts>
//   @Name: job-candidate-card-activity.component.ts
//   @Who: Adarsh singh
//   @When: 01-Sept-2023
//   @Why: EWM-13814 EWM-14141
//   -->

import { MediaMatcher } from "@angular/cdk/layout";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatInput } from "@angular/material/input";
import { MatSidenav } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { EditorComponent } from "@progress/kendo-angular-editor";
import * as moment from "moment";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { CategoryFilterActivityComponent } from "src/app/modules/EWM-Employee/employee-detail/employee-activity/category-filter-activity/category-filter-activity.component";
import { DateFilterActivityComponent } from "src/app/modules/EWM-Employee/employee-detail/employee-activity/date-filter-activity/date-filter-activity.component";
import { ManageAccessActivityComponent } from "src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component";
import { MarkDoneActivityComponent } from "src/app/modules/EWM-Employee/employee-detail/employee-activity/mark-done-activity/mark-done-activity.component";
import { OwnerFilterActivityComponent } from "src/app/modules/EWM-Employee/employee-detail/employee-activity/owner-filter-activity/owner-filter-activity.component";
import { ConfirmDialogComponent } from "src/app/shared/modal/confirm-dialog/confirm-dialog.component";
import { DeleteConfirmationComponent } from "src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component";
import { CustomAttachmentPopupComponent } from "src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component";
import { ImageUploadKendoEditorPopComponent } from "src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component";
import { Userpreferences, ButtonTypes, ResponceData } from "src/app/shared/models";
import { AppSettingsService } from "src/app/shared/services/app-settings.service";
import { CommonServiesService } from "src/app/shared/services/common-servies.service";
import { CommonserviceService } from "src/app/shared/services/commonservice/commonservice.service";
import { UserpreferencesService } from "src/app/shared/services/commonservice/userpreferences.service";
import { CustomValidatorService } from "src/app/shared/services/custome-validator/custom-validator.service";
import { MailServiceService } from "src/app/shared/services/email-service/mail-service.service";
import { KendoEditorImageUploaderService } from "src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service";
import { ServiceListClass } from "src/app/shared/services/sevicelist";
import { SidebarService } from "src/app/shared/services/sidebar/sidebar.service";
import { SnackBarService } from "src/app/shared/services/snackbar/snack-bar.service";
import { AddRequiredAttendeesComponent } from "../../../home/my-activity/add-required-attendees/add-required-attendees.component";
import { OrganizerOrAssineesComponent } from "../../../home/my-activity/organizer-or-assinees/organizer-or-assinees.component";
import { ScheduleAssistanceDatePopupComponent } from "../../../home/my-activity/schedule-assistance-date-popup/schedule-assistance-date-popup.component";
import { FilterDialogComponent } from "../../../job/landingpage/filter-dialog/filter-dialog.component";
import { EmailPreviewPopupComponent } from "../../../system-settings/email-templates/email-preview-popup/email-preview-popup.component";
import { customDropdownConfig } from "../../datamodels";
import { JobService } from "../../services/Job/job.service";
import { CandidateService } from "../../services/candidates/candidate.service";
import { ClientService } from "../../services/client/client.service";
import { IntegrationsBoardService } from "../../services/profile-info/integrations-board.service";
import { ProfileInfoService } from "../../services/profile-info/profile-info.service";
import { QuickJobService } from "../../services/quickJob/quickJob.service";
import { SystemSettingService } from "../../services/system-setting/system-setting.service";
import { TemplatesComponent } from "../new-email/templates/templates.component";
import { ConfirmDialogModel } from "../quickpeople/quickpeople.component";
import { DRP_CONFIG, DRP_CONFIG_CLIENT_SIDE } from "@app/shared/models/common-dropdown";
import { CommonDropDownService } from "../../services/common-dropdown-service/common-dropdown.service";


interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
enum preFieldKey {
  'AccessName' = 'AccessName',
  'AccessId' = 'AccessId',
  'IsSendEmailToAttendees' = 'IsSendEmailToAttendees',
  'IsSendCalendarInviteToAttendees' = 'IsSendCalendarInviteToAttendees',
  'TimeZone' = 'TimeZone',
  'TimeEnd' = 'TimeEnd',
  'DateEnd' = 'DateEnd',
  'TimeStart' = 'TimeStart',
  'DateStart' = 'DateStart',
  'slotDate' = 'slotDate',
  'timePeriod' = 'timePeriod',
  'ScheduleActivity' = 'ScheduleActivity',
  'OrganizerOrAssignees' = 'OrganizerOrAssignees'
}

export interface ActivityDetails {
  LastActivityDate: number
  LastActivityTitle: string
  UpComingActivityDate: number
  UpComingActivityTitle: string
}


@Component({
  selector: 'app-job-candidate-card-activity',
  templateUrl: './job-candidate-card-activity.component.html',
  styleUrls: ['./job-candidate-card-activity.component.scss', 
  '../../../../../modules/EWM.core/home/my-activity/my-activity.component.scss']
})

export class JobCandidateCardActivityComponent implements OnInit {

  public timePeriod: any = 60;
  @ViewChild('asignJob') public asignJob: MatSidenav;
  @ViewChild('activityAdd') public activityAdd: MatSidenav;
  @Output() clientActivityCount = new EventEmitter();
  public filterConfig: any;
  public loadingscroll: boolean;
  public loading: boolean;
  public positionMatDrawer: string = 'end';
  mobileQuery: MediaQueryList;
  yearFilter: MediaQueryList;
  private _mobileQueryListener: () => void;
  public clientId: any;
  Names: string;
  @Input() clientIdData: any;
  public userpreferences: Userpreferences;
  public gridList: any = [];
  public gridMonthYearCount: any;
  public pagesize: any;
  public pagneNo: any = 1;
  public currentYear: number;
  public myActivityForm: FormGroup;
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
  @Input() GridId: any;
  public filterCount: number = 0;
  public isShowFilter: boolean = false;
  public colArr: any = [];
  public isReadMore: any[] = [false];
  public columns: ColumnSetting[] = [];
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
  public totalDataCount: number;
  public hoverIndex: number = -1;
  public tagNotesKey: any[] = [];
  public maxCharacterLengthSubHead = 500;
  public filterCountCategory: number = 0;
  public filterCountOwner: number = 0;
  public canLoad = false;
  public pendingLoad = false;
  public filterCountDate: any = 0;
  documentTypeOptions: any;
  @Input() candidateIdData: any;
  //@Input() category: string;
  Employee: string = 'Job';
  uploadedFileName: any;
  category = 'JOB';
  public utctimezonName: any = localStorage.getItem('UserTimezone');
  //public utctimezonName: any

  @ViewChild('titleActivity') titleActivity: MatInput;
  public requiredAttendeesList: any = [];
  public organizerOrAssigneesList: any = [];
  public removable = true;
  public timezonName: any = localStorage.getItem('UserTimezone');
  public selectedItem = [];
  resetFormSubjectRelatedUser: Subject<any> = new Subject<any>();
  public dropDownRelatedUserConfig: customDropdownConfig[] = [];
  public selectedRelatedUser: any = {};

  public ActivityTypeList: any[] = [];
  pageNo = 1;
  public activityForAttendees: string;
  /*** @When: 17-03-2023 @Who:Nitin Bhati @Why: EWM-11055 EWM-11104 @What:For Job tab Email template variable **/
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  @Output() myActivityDrawerClose: EventEmitter<any> = new EventEmitter<any>();
  RelatedUserId: any;
  public userId: string;
  action: boolean = false;
  public activityActionForm: string = "Add";
  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  meetingPlatformList: any;
  meetingPlatformData: any;
  meetingPlatformName: any;
  meetingUrlData: string;
  MeetingUrl: string;
  MeetingId: string;
  CalendarExternalId: any;
  public dateFormat: any;
  public hideAddButton: boolean = false;
  public slotStartDate: any;
  public slotEndDate: any;
  public startTime: any;
  public endTime: any;
  public timeAvaiableSlots: any = [];
  public selectedTimeslots: any;
  timeDisplayHour = 12;
  public slotAdd: boolean;
  scheduleTimeData: any = {};
  gridTimeZone: any;
  @Input() isAttendeesdefaultShow: boolean;
  isActivityTitle: boolean;
  // public parentComponentMenuStatus: string="open";
  @Input() dateFilterDrawer: any = "open";
  public Id: any;
  candidateData: any = [];
  public isAttendeeShow: boolean = false;
  isAddRequiredAttendees: boolean = false;
  candidateID: any;
  candidateName: any;
  candidateEmail: any;
  // @Input() PageName: string;
  PageName = 'interview';
  mode: any;
  candidateIDdta: any;
  @Input() relatedUserJobId: string
  candidateIdScreening: string;
  @Input() isDisabledTimeSlotLeft: boolean;
  isDisabledForScreening: boolean;
  selectedItemListForActiveClass = null;
  animationVar: any;
  scheduleData24Hrs: {};
  RegionName: string;
  TimeZoneName: string;
  maxMoreLength: number = 2;
  AccessName: any;
  AccessId: any;
  username: string;
  public TimeStartValue: any;
  public TimeEndValue: any;
  distinctRegion = [];
  isMinTimeCondotion: boolean = false;
  isDateEnd: boolean = true;
  EndDateMin: Date;
  currentStartDate: any = new Date();
  StartDateMin = new Date();
  readonly: boolean;
  timezoneDetails = [];
  selectedOrganizer = [];
  @ViewChild('editor') editor: EditorComponent;
  public optionalAttendeesList: any[] = [];
  getDateFormat: any;
  public Zoopplaypassword: string = '******';
  messageCopy: boolean;
  label_copied: string = 'label_copied';
  showpassstatus: boolean = false;
  emailConnection: boolean = false;
  isRequiredAttendees: boolean = true;
  dirctionalLang;
  isButtonDisabled: boolean = true;
  slotsData: any;
  slotsStartDate: any;
  isSlotActive: boolean = false;
  activityObj: any;
  syncCandidateAttendeeList: any = []
  activityId: any;
  ActivityTitleName: string;
  WorkFlowStageId: any;
  getLastUpcomingActivityDetails: ActivityDetails;
  IsDisabled: boolean = false;
  isLastUpcomingActivity:boolean = false;
  isResponseGet:boolean = false;
  isShowMoreHideMore:any;

  
  common_DropdownC_Config:DRP_CONFIG;
  attendiesPopArr = [];
  jobContactsArr = [];
  empCandArr = [];
  onlyAttendiesPopArr = [];
  dateAndTimeToggle:boolean = false;
  userInviteArr:any = [];
  currentUserDetails:any;
  timeZone_Config:DRP_CONFIG_CLIENT_SIDE;
  selecteTimezone:any;
  timezoneArrList:any = [];
  isEndTmeRequired: boolean = false;
  isStartTmeRequired: boolean;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private fb: FormBuilder, public _sidebarService: SidebarService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private http: HttpClient,
    private jobService: JobService, private snackBService: SnackBarService, private clientService: ClientService, private _profileInfoService: ProfileInfoService,
    public candidateService: CandidateService, private _SystemSettingService: SystemSettingService,
    private serviceListClass: ServiceListClass, private quickJobService: QuickJobService, public _integrationsBoardService: IntegrationsBoardService, private mailService: MailServiceService,
    public dialogRef: MatDialogRef<JobCandidateCardActivityComponent>, @Inject(MAT_DIALOG_DATA) public data: JobCandidateCardActivityComponent,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService, private renderer: Renderer2,
    private dataService: CommonDropDownService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)')
    this.yearFilter = media.matchMedia('(max-width: 1024px)');
    this.AccessId = this.appSettingsService.getDefaultAccessId;
    this.AccessName = this.appSettingsService.getDefaultaccessName;
    this.slotsData = data?.slotsData;
    this.isSlotActive = data?.isSlotActive;
    this.utctimezonName = data.utctimezonName;
    this.activityObj = data?.activityObj;
    this.Names = this.activityObj?.jobName;
    this.relatedUserJobId = this.activityObj?.jobId;
    this.requiredAttendeesList = data?.syncCandidateAttendeeList;
    this.activityId = data.activityId;
    this.activityActionForm = data?.activityActionForm;

    this.WorkFlowStageId = data?.WorkFlowStageId;
    this.RelatedUserId = this.activityObj?.jobId;

    this.ActivityTitleName=this.data['stageName']+'-'+this.Names;

    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.pagesize = appSettingsService.pagesize;
    this.currentYear = (new Date()).getFullYear();
    this.myActivityForm = this.fb.group({
      Id: [null],
      slotDate: [null, [Validators.required, CustomValidatorService.dateValidator]],
      timePeriod: ['60', Validators.required],
      ActivityTitle: [this.ActivityTitleName, [Validators.required, Validators.maxLength(500)]],/** @When: 28-11-2023 @Who:maneesh for increes charecter length @Why: Ewm-15173 */
      RelatedUserType: ['JOB', [Validators.required]],
      RelatedUserTypeName: ['Job'],
      RelatedUserId: [this.RelatedUserId, [Validators.required]],
      RelatedUserUserName: [this.Names],
      CategoryId: [null],
      CategoryName: [''],
      ScheduleActivity: [null, [Validators.required]],
      Location: ['', [Validators.maxLength(300)]],
      AddRequiredAttendees: [null, [Validators.required]],
      OrganizerOrAssignees: [],
      ActivityUrl: ['', [Validators.maxLength(2048)]],
      AccessName: [this.AccessName, [Validators.required]],
      AccessId: [this.AccessId],
      Description: [''],
      file: [''],
      MeetingPlatform: [],
      TimeZone: ['', [Validators.required]],
      DateStart: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeStart: [null, [Validators.required]],
      DateEnd: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeEnd: [null, [Validators.required]],
      IsSendEmailToAttendees: [true],
      IsSendCalendarInviteToAttendees: [true],
      LoggedInUserName: [''],
      TimeZoneID:['']
    });

    this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.jobWithoutWorkflow;
    this.dropDownRelatedUserConfig['IsManage'] = './client/client/core/job/landing';
    this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
 
    this.getActivityTypeCategory('Job');
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

    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    })

    //////User Dropdown//////////////
    this.dropDownRelatedUserConfig['IsDisabled'] = false;
    this.dropDownRelatedUserConfig['placeholder'] = 'label_relatedUser';
    this.dropDownRelatedUserConfig['IsManage'] = '';
    this.dropDownRelatedUserConfig['IsRequired'] = true;
    this.dropDownRelatedUserConfig['searchEnable'] = true;
    this.dropDownRelatedUserConfig['bindLabel'] = 'Name';
    this.dropDownRelatedUserConfig['multiple'] = false;
    this.dropDownRelatedUserConfig['isClearable'] = false;
    this.dateFormat = localStorage.getItem('DateFormat');
  }

  ngOnInit(): void {
    this.oldPatchValues = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.timezoneArrList = JSON.parse(localStorage.getItem('TimeZoneList'))
    this.currentUserDetails = currentUser;
    this.userId = currentUser?.UserId;
    this.myActivityForm.patchValue({
      'AddRequiredAttendees': this.requiredAttendeesList
    })
    if (this.activityActionForm == "Add") {
      this.getMeetingPlatformList();
      this.getAllInviteUser();
      this.getActivityTypeCategory('JOB');
      if (this.slotsData != undefined) {
        this.slotStartDate = (this.slotsData?.DateStartUTC) ? (this.slotsData?.DateStartUTC) : (this.slotsData?.start); /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: two param one from slot click and edit case **/
        const startdatetime = new Date(this.slotStartDate);
        this.slotsStartDate = this.slotStartDate;
        this.slotEndDate = new Date(startdatetime.getTime() + this.timePeriod * 60 * 1000);
        let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
        this.myActivityForm.patchValue({
          'slotDate': slotDate
        })
        this.slotAdd = false;
        this.getAvaiableTimeslots(startdatetime);
      } else {
        this.slotStartDate = new Date();
        this.slotsStartDate = this.slotStartDate;
        this.slotEndDate = new Date(Date.now() + this.timePeriod * 60 * 1000);
        const startdatetime = new Date(this.slotStartDate);
        let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
        this.myActivityForm.patchValue({
          'slotDate': slotDate
        })
        this.slotAdd = true;
        this.getAvaiableTimeslots(this.slotStartDate);

      }
    }



    this.username = currentUser?.FirstName + ' ' + currentUser?.LastName;
    if (this.activityActionForm != "Edit") {
      this.selectedRelatedUser = { 'Id': this.activityObj.jobId, 'Name': this.activityObj.jobName }
      this.onRelatedUserchange(this.selectedRelatedUser);
      // this.dataService.setSelectedData(this.selectedRelatedUser);
    }
    this.getInsertPlaceholderByType('Jobs');
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    this.TimeEndValue = nowTime;
    this.getAllRegion();
    this.checkEmailConnection();  

    this.myActivityForm.controls["OrganizerOrAssignees"].disable();
    this.getCanLastUpcomingActivity();
    this.dropdownConfig();
  }

  dateDrawerStatusChange() {
    if (this.dateFilterDrawer == "close") {
      return false;
    } else if (this.yearFilter.matches === false) {
      return true;
    } else {
      return false;
    }
  }
  dateDrawerModeStatus() {
    if (this.dateFilterDrawer == "close") {
      return "over"
    } else {
      if (this.yearFilter.matches === false) {
        return "side";
      } else {
        return "over";
      }
    }
  }


  /*
     @Type: ondismiss()
     @Who: Renu
     @When: 24-May-2023
     @Why:  EWM-11781 EWM-12517
     @What: close popup on click cross button
   */
  onDismisspopup(): void {
  localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for clear value;
    document.getElementsByClassName("quick-modal-drawer")[0]?.classList.remove("animate__slideInRight")
    document.getElementsByClassName("quick-modal-drawer")[0]?.classList.add("animate__slideOutRight");
    setTimeout(() => { this.dialogRef?.close(false); }, 200);
  }


  /*
  @Type: File, <ts>
  @Name: ngAfterViewInit
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: For Focus
  */
  ngAfterViewInit() {
    setTimeout(() => {
      this.titleActivity.focus();
    }, 1000);

  }

  /*
    @Type: File, <ts>
    @Name: onChangeActivityRelatedTo
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: 
    */
  onChangeActivityRelatedTo(activityFor) {
    this.selectedRelatedUser = null;
    this.activityForAttendees = activityFor;
    if (activityFor == "JOB") {
      this.myActivityForm.patchValue({
        'RelatedUserTypeName': 'Job'
      })
      this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllJobForActivity;
      this.dropDownRelatedUserConfig['IsManage'] = './client/core/job/landing';
      this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);

      this.getActivityTypeCategory(activityFor);

    } else if (activityFor == "CAND") {
      this.myActivityForm.patchValue({
        'RelatedUserTypeName': 'Candidate'
      })
      this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllCandidateForActivity;
      this.dropDownRelatedUserConfig['IsManage'] = './client/cand/candidate/candidate-list';
      this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
      this.getActivityTypeCategory(activityFor);

    } else if (activityFor == "EMPL") {
      this.myActivityForm.patchValue({
        'RelatedUserTypeName': 'Employee'
      })
      this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllEmployeeForActivity;
      this.dropDownRelatedUserConfig['IsManage'] = './client/emp/employees/employee-list';
      this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
      this.getActivityTypeCategory(activityFor);

    } else if (activityFor == "CLIE") {
      this.myActivityForm.patchValue({
        'RelatedUserTypeName': 'Client'
      })
      this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllClientForActivity;
      this.dropDownRelatedUserConfig['IsManage'] = './client/core/clients/client-dashboard';

      this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
      this.getActivityTypeCategory(activityFor);

    } else {
      this.myActivityForm.patchValue({
        'RelatedUserTypeName': '',
        'CategoryId': null
      })
      this.ActivityTypeList = [];
      this.dropDownRelatedUserConfig['apiEndPoint'] = null;
      this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);

    }
    this.selectedRelatedUser = null;
    this.onRelatedUserchange(this.selectedRelatedUser);
  }


  /*
    @Type: File, <ts>
    @Name: onRelatedUserchange
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: get data when select related user
    */
  onRelatedUserchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedRelatedUser = null;
      this.myActivityForm.patchValue(
        {
          RelatedUserId: null,
          RelatedUserUserName: '',
        });
      this.myActivityForm.get("RelatedUserId").setErrors({ required: true });
      this.myActivityForm.get("RelatedUserId").markAsTouched();
      this.myActivityForm.get("RelatedUserId").markAsDirty();
    }
    else {
      this.myActivityForm.get("RelatedUserId").clearValidators();
      this.myActivityForm.get("RelatedUserId").markAsPristine();
      this.selectedRelatedUser = data;

      this.myActivityForm.patchValue({
        RelatedUserId: data.Id,
        RelatedUserUserName: data.Name
      })
    }

  }
 
  /*
   @Type: File, <ts>
   @Name: fetchDataFromAddressBar
   @Who: Nitin Bhati
   @When: 13-Jan-2022
   @Why: EWM-4545
   @What:fetchData From google map
   */
  public fetchDataFromAddressBar(address) {
    this.myActivityForm.patchValue({ Location: address.formatted_address });
  }

  /*
   @Type: File, <ts>
   @Name: openModelForSchedule
   @Who: Nitin Bhati
   @When: 13-Jan-2022
   @Why: EWM-4545
   @What: open Modal for schedule
   */

  scheduleData: any = {};

  /*
    @Type: File, <ts>
    @Name: openModelAddRequiredAttendees
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: open Modal for AddRequiredAttendees
    */
  isDefaultAttendees: boolean;
  openModelAddRequiredAttendees(popUpType: string) {
    const dialogRef = this.dialog.open(AddRequiredAttendeesComponent, {
      maxWidth: "650px",
      data: new Object({
        requiredAttendeesList: (popUpType == 'optionalAttendees' ? this.optionalAttendeesList : this.requiredAttendeesList), activityForAttendees:
          this.activityForAttendees, clientIdData: this.selectedRelatedUser.Id, popUpType: popUpType
      }),
      width: "80%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'AddRequiredAttendees', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (popUpType == 'optionalAttendees') {
          this.optionalAttendeesList = res;
          this.myActivityForm.patchValue({
            'OptionalAttendeesList': this.optionalAttendeesList
          })
        } else {
          this.requiredAttendeesList = res;
          this.myActivityForm.patchValue({
            'AddRequiredAttendees': this.requiredAttendeesList
          })
        }

        if (this.requiredAttendeesList?.length == 0 && this.optionalAttendeesList?.length == 0) {
          this.isRequiredAttendees = false;
          this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);
          this.myActivityForm.get('IsSendEmailToAttendees').disable();
        } else {
          this.isRequiredAttendees = true;
          this.myActivityForm.get('IsSendEmailToAttendees').setValue(1);
        }
      }
      else {
        this.myActivityForm.patchValue({
          AddRequiredAttendees: null,
        })
        this.isRequiredAttendees = false;
        this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);

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
    @Name: getAllInviteUser
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: get All Invite User
    */
    filterData:any;
    getAllInviteUser() {
      this.userInviteArr.push({
        UserId: this.currentUserDetails.UserId,
        UserName: this.currentUserDetails.FirstName +' '+ this.currentUserDetails.LastName,
        Email: this.currentUserDetails.EmailId
      })
      let getLoggedInUser = this.userInviteArr
      this.myActivityForm.controls['OrganizerOrAssignees'].setValue(getLoggedInUser);
      this.filterData = getLoggedInUser;
      this.selectedOrganizer = this.filterData;
      this.myActivityForm.patchValue({
        LoggedInUserName: getLoggedInUser[0].UserName
      })
      this.myActivityForm.controls["LoggedInUserName"].disable();
      this.loading = false;
   
    }

  /*
   @Type: File, <ts>
   @Name: openModelOrganizerOrAssignees
   @Who: Nitin Bhati
   @When: 13-Jan-2022
   @Why: EWM-4545
   @What: open Modal for OrganizerOrAssignees
   */
  openModelOrganizerOrAssignees() {
    const dialogRef = this.dialog.open(OrganizerOrAssineesComponent, {
      maxWidth: "650px",
      data: new Object({ organizerOrAssigneesList: this.organizerOrAssigneesList, userId: this.userId }),
      width: "80%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'AddOrganizerOrAssinees', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.organizerOrAssigneesList = res;
      }
      else {
      }
    })
  }
  isAttendeesReq: boolean = false;

  /*
  @Type: File, <ts>
  @Name: remove
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {
    if (type == 'addRequiredAttendees') {
      const index = this.requiredAttendeesList.indexOf(items);
      if (index >= 0) {
        this.requiredAttendeesList.splice(index, 1);
      }
      else {
        this.myActivityForm.get("AddRequiredAttendees").setErrors({ required: true });
      }
    }
    else if (type == 'organizerOrAssignees') {
      const index = this.organizerOrAssigneesList.indexOf(items);
      if (index >= 0) {
        this.organizerOrAssigneesList.splice(index, 1);
      }
      if (this.organizerOrAssigneesList.length == 0) {
        this.myActivityForm.controls['OrganizerOrAssignees'].setErrors({ 'required': true });
      }
    } else {
      const index = this.optionalAttendeesList.indexOf(items);
      if (index >= 0) {
        this.optionalAttendeesList.splice(index, 1);
      }
    }
    if (this.requiredAttendeesList?.length == 0 && this.optionalAttendeesList?.length == 0) {
      this.isRequiredAttendees = false;
      this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);
    } else {
      this.isRequiredAttendees = true;
      this.myActivityForm.get('IsSendEmailToAttendees').setValue(1);
    }


  }

  /*
    @Type: File, <ts>
    @Name: createActivity
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: data create for my activity
    */
  createActivity(value) {
    this.scheduleInfo(value);
    let relatedUserId;
    relatedUserId = this.relatedUserJobId;
    this.loading = true;
    let myActivityJson = {};
    let ReplaceTagArr = [];
    ReplaceTagArr.push({
      Id: value.RelatedUserId,
      ObjectType: value.RelatedUserType
    })
    // End

    let requiredAttendeesList = [];
   let optionalAttendeesListArr = [];
   this.requiredAttendeesList.forEach(element=>{
     if (element.Type == "External") {
       requiredAttendeesList.push({
         Email: element.Email,
         Type: "External",
         Name: element.Name ? element.Name : ''
       })
     }
     else{
       requiredAttendeesList.push({
         Id: element.Id,
         Name: element.Name,
         Email: element.Email,
         Type: element?.Type ? element?.Type : 'CAND'
       })
     }
   })

   this.optionalAttendeesList.forEach(element=>{
     if (element.Type == "External") {
       optionalAttendeesListArr.push({
         Email: element.Email,
         Type: "External",
         Name: element.Name ? element.Name : ''
       })
     }
     else{
       optionalAttendeesListArr.push({
         Id: element.Id,
         Name: element.Name,
         Email: element.Email,
         Type: element?.Type ? element?.Type : 'CAND'
       })
     }
   })

   this.scheduleTimeData.TimeZoneID =  value.TimeZoneID;
    myActivityJson["ActivityTitle"] = value.ActivityTitle;
    myActivityJson["RelatedUserType"] = value.RelatedUserType;;
    myActivityJson["RelatedUserTypeName"] = value.RelatedUserTypeName;
    myActivityJson["RelatedUserId"] = value.RelatedUserId;
    myActivityJson["RelatedUserUserName"] = value.RelatedUserUserName;
    myActivityJson["CategoryId"] = value.CategoryId ? value.CategoryId : 0;
    myActivityJson["CategoryName"] = value.CategoryName;
    myActivityJson["ScheduleActivity"] = this.scheduleTimeData
    myActivityJson["Location"] = value.Location;
    myActivityJson["AttendeesList"] = requiredAttendeesList;
    myActivityJson["OrganizersList"] = value.OrganizerOrAssignees;
    myActivityJson["ActivityUrl"] = value.ActivityUrl;
    myActivityJson["AccessId"] = value.AccessId;
    myActivityJson["AccessName"] = value.AccessName;
    myActivityJson["Description"] = value.Description;
    myActivityJson["GrantAccesList"] = this.accessEmailId;
    myActivityJson['IsAttachment'] = this.fileAttachments.length > 0 ? 1 : 0;
    myActivityJson['Files'] = this.fileAttachments;
    myActivityJson['ActivityCoreUrl'] = window.location.href;
    myActivityJson["OptionalAttendeesList"] = optionalAttendeesListArr;
    myActivityJson["MeetingPlatformId"] = value.MeetingPlatform ? value.MeetingPlatform : '00000000-0000-0000-0000-000000000000';
    myActivityJson["MeetingPlatform"] = this.meetingPlatformName;
    myActivityJson["MeetingId"] = this.MeetingId;
    myActivityJson["PageName"] = this.PageName;
    myActivityJson["IsSendCalendarInviteToAttendees"] = value.IsSendCalendarInviteToAttendees ? 1 : 0;
    myActivityJson["IsSendEmailToAttendees"] = value.IsSendEmailToAttendees ? 1 : 0;
    myActivityJson["ReplaceTag"] = ReplaceTagArr;
    myActivityJson["WorkflowStageId"] = this.WorkFlowStageId;

    this._SystemSettingService.AddMyActivity(myActivityJson)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.scheduleData = [];
            this.requiredAttendeesList = [];
            this.organizerOrAssigneesList = [];
            this.fileAttachments = [];
            this.oldPatchValues = {};
            this.loading = false;
            this.action = false;
            document.getElementsByClassName("quick-modal-drawer")[0]?.classList.remove("animate__slideInRight")
            document.getElementsByClassName("quick-modal-drawer")[0]?.classList.add("animate__slideOutRight");
            setTimeout(() => { this.dialogRef?.close(true); }, 200);
            this.selectedCategory = {};
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.resetForm();
            this.isResponseGet = false;            
            this.commonserviceService.updateActivityCount.next(true);//by maneesh ewm-16995
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
            this.isResponseGet = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.isResponseGet = false;
          }
        }, err => {
          this.loading = false;
          this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }
  /* 
     @Type: File, <ts>
     @Name: addActivities
     @Who: Nitin Bhati
     @When: 13-Jan-2022
     @Why: EWM-4545
     @What: when addActivities
   */
  addActivities() {
    this.action = false;
    this.formHeading = 'Add';
    this.timePeriod = '60';
    this.oldPatchValues = {};
    this.accessEmailId = [];
    this.selectedCategory = {};
    this.requiredAttendeesList = [];
    this.optionalAttendeesList = [];
    this.organizerOrAssigneesList = [];
    this.scheduleData = [];
    this.getAllInviteUser();
    this.myActivityForm.patchValue({
      'RelatedUserType': this.category,
      'RelatedUserId': this.candidateIdData
    });
  }

  /*
 @Type: File, <ts>
 @Name: openFilterModalDialog function
 @Who: Nitin Bhati
 @When: 13-Jan-2022
 @Why: EWM-4545
 @What: For opening filter  dialog box
  */

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.loading = true;
        this.filterCount = res.data.length;
        let filterParamArr = [];
        res.data.forEach(element => {
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
        jsonObjFilter['CandidateId'] = this.candidateIdData;
        jsonObjFilter['AttendeeId'] = this.candidateIdData;
        jsonObjFilter['Year'] = this.yearFilterRes ? this.yearFilterRes : 0;
        jsonObjFilter['Month'] = this.monthFilterRes ? this.monthFilterRes : '';
        if (this.OwnerIds) {
          jsonObjFilter['OwnerIds'] = this.OwnerIds;
        } else {
          jsonObjFilter['OwnerIds'] = [];
        }
        if (this.CategoryIds) {
          jsonObjFilter['CategoryIds'] = this.CategoryIds;
        } else {
          jsonObjFilter['CategoryIds'] = [];
        }
        jsonObjFilter['PageNumber'] = this.pagneNo;
        jsonObjFilter['PageSize'] = this.pagesize;
        jsonObjFilter['OrderBy'] = '';
        jsonObjFilter['FromDate'] = this.FromDate ? this.FromDate : null;
        jsonObjFilter['ToDate'] = this.ToDate ? this.ToDate : null;
        var element = document.getElementById("filter-advance");
        element?.classList.add("active");
        this.candidateService.fetchActivityAll(jsonObjFilter).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
              this.gridList = repsonsedata.Data;
              this.getFilterConfig(false);
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
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
    @Name: onCategorychange
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: when category drop down changes 
  */
  onCategorychange(data) {
    this.CategoryId = data.Id;
    this.myActivityForm.patchValue({
      CategoryId: data?.Id,
      CategoryName: data?.ActivityCategory,
    })

  }
 
  getClientYearMonthList() {
    let jsonObj = {};
    jsonObj['OwnerIds'] = [];
    jsonObj['CategoryIds'] = [];
    jsonObj['FromDate'] = null;
    jsonObj['ToDate'] = null;
    if (this.isAttendeesdefaultShow) {
      jsonObj['AttendeeId'] = this.candidateIdData;
      jsonObj['CandidateId'] = this.relatedUserJobId;
    } else {
      jsonObj['CandidateId'] = this.candidateIdData;
    }
    this.candidateService.fetchActivityMonthYearCountAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.gridMonthYearCount = data.Data;
            this.loading = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridMonthYearCount = [];
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
  setIndex(index: number) {
    this.selectedIndex = index;
  }


  /*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who: Nitin Bhati
   @When: 13-Jan-2022
   @Why: EWM-4545
   @What: FOR DIALOG BOX confirmation
 */

  clearFilterData(viewMode: string): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_MenuActivity';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.filterConfig = [];

        this.loading = true;
        let jsonObj = {};
        if (viewMode == 'Owner') {
          this.OwnerIds = [];
        }
        if (viewMode == 'Category') {
          this.CategoryIds = [];
        }
        if (viewMode == 'Filter') {
          this.filterConfig = [];
        }
        if (this.isAttendeesdefaultShow) {
          jsonObj['AttendeeId'] = this.candidateIdData;
          jsonObj['CandidateId'] = this.relatedUserJobId;
        } else {
          jsonObj['CandidateId'] = this.candidateIdData;
          jsonObj['AttendeeId'] = this.candidateIdData;

        }

        jsonObj['Year'] = this.yearFilterRes ? this.yearFilterRes : 0;
        jsonObj['Month'] = this.monthFilterRes ? this.monthFilterRes : '';

        jsonObj['OwnerIds'] = viewMode == 'Owner' ? [] : this.OwnerIds;
        jsonObj['CategoryIds'] = viewMode == 'Category' ? [] : this.CategoryIds;

        jsonObj['PageNumber'] = this.pagneNo;
        jsonObj['PageSize'] = this.pagesize;
        jsonObj['OrderBy'] = '';
        if (viewMode == 'Date') {
          this.FromDate = null;
          this.ToDate = null;
        }
        jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
        jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;


        this.candidateService.fetchActivityAll(jsonObj).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
              this.gridList = repsonsedata.Data;
              this.hideAddButton = true;
              this.getFilterConfig(false);
              if (viewMode == 'Category') {
                this.filterCountCategory = 0;
                var element = document.getElementById("filter-category");
                element?.classList.remove("active");
              }
              if (viewMode == 'Owner') {
                this.filterCountOwner = 0;
                var element = document.getElementById("filter-owner");
                element?.classList.remove("active");
              }
              if (viewMode == 'Date') {
                this.filterCountDate = 0;
                var element = document.getElementById("filter-date");
                element?.classList.remove("active");
              }

              if (viewMode == 'Filter') {
                var element = document.getElementById("filter-advance");
                element?.classList.remove("active");
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
    });
  }

  getActivityList(clientId: any, year: number, month: string, pageNo) {

    this.loading = true;
    this.yearFilterRes = year;
    this.monthFilterRes = month;
    let jsonObj = {};
    let isJobIdOrCandidateId: string;
    if (this.PageName == 'Candidate Screening') {
      isJobIdOrCandidateId = this.relatedUserJobId;
      jsonObj['AttendeeId'] = this.candidateIdScreening;
    } else {
      isJobIdOrCandidateId = this.candidateIdData
    }
    jsonObj['CandidateId'] = isJobIdOrCandidateId;

    jsonObj['AttendeeId'] = isJobIdOrCandidateId;
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

    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = this.pagesize;
    jsonObj['OrderBy'] = '';
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;

    this.candidateService.fetchActivityAll(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.totalDataCount = data.TotalRecord;
            this.gridList = data.Data;
            this.loading = false;
            this.hideAddButton = true;

          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
            this.loading = false;
            this.hideAddButton = false;
            this.loadingscroll = false;
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
@Name: dirChange
@Who: Nitin Bhati
@When: 13-Jan-2022
@Why: EWM-4545
@What: for ltr and rtr
*/
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }


  /*
     @Type: File, <ts>
     @Name: selectFile function
     @Who: Nitin Bhati
     @When: 13-Jan-2022
     @Why: EWM-4545
     @What: on selecting file
   */

  selectFile(fileInput: any) {
    this.selectedFiles = fileInput.target.files;
    this.fileBinary = fileInput.target.files[0];
    if (!this.validateFile(fileInput.target.files[0].name)) {
      this.myActivityForm.get('file').setErrors({ fileTaken: true });
      this.myActivityForm.get("file").markAsDirty();
      return false;
    } else if (fileInput.target.files[0].size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      this.loading = false;
      fileInput = null;
      return;
    } else {
      this.myActivityForm.get("file").markAsPristine();
      this.myfilename = '';
      Array.from(fileInput.target.files).forEach((file: File) => {
        this.myfilename = file.name;
      });
      this.myActivityForm.get('file').setValue(this.myfilename);
      localStorage.setItem('Image', '1');
      this.uploadAttachementFile(this.fileBinary);
    }

  }

  /*
     @Type: File, <ts>
     @Name: uploadAttachementFile function
     @Who: Nitin Bhati
     @When: 13-Jan-2022
     @Why: EWM-4545
     @What: on uploading file
   */

  uploadAttachementFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    this.candidateService.FileUploadClient(formData).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.filePath = responseData.Data[0].FilePathOnServer;
          this.previewUrl = responseData.Data[0].Preview;
          this.uploadedFileName = responseData.Data[0].UploadFileName;
          localStorage.setItem('Image', '2');
        }
      }, err => {
        this.loading = false;
      })
  }

  /*
    @Type: File, <ts>
    @Name: validateFile function
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: on validating file
  */
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'pdf') {
      return true;
    } else if (ext.toLowerCase() == 'doc') {
      return true;
    } else if (ext.toLowerCase() == 'docx') {
      return true;
    } else if (!this.fileType.includes(ext.toLowerCase())) {
      return true;
    } else {
      return false;
    }
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

  /*
   @Type: File, <ts>
   @Name: onDismiss function
   @Who: Nitin Bhati
   @When: 13-Jan-2022
   @Why: EWM-4545
   @What: on closing the mat drawer
 */

  onDismiss(): void {
    this.action = false;
    this.sidenav.close();
    this.requiredAttendeesList = [];
    this.organizerOrAssigneesList = [];
    this.scheduleData = [];
    this.oldPatchValues = {};
    this.accessEmailId = [];
    this.resetForm();
    this.getAllInviteUser();
    this.myActivityForm.patchValue({
      'RelatedUserType': this.category,
      'RelatedUserId': this.candidateIdData
    });

  }

  /*
  @Type: File, <ts>
  @Name: onSave function
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: on saving the data
*/
  onSave(value) {
    this.isResponseGet = true;
    setTimeout(() => {
      this.hideAddButton = true;
    }, 3000);
    if (this.activestatus == 'Add') {
      this.createActivity(value);
      this.hideAddButton = true;
    }
  localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for clear value;
  }



  /*
  @Type: File, <ts>
  @Name: getNoteCateogoryList function
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: getting notes category list data
*/

  getNoteCateogoryList() {
    this.loading = true;
    let category = this.category;
    this.clientService.getNotesCategoryList(category).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data) {
            this.notesCategory = repsonsedata.Data;
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  openDialogforowner() {
    const dialogRef = this.dialog.open(OwnerFilterActivityComponent, {
      // data: dialogData,
      panelClass: ['xeople-modal', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        let arr = [];
        result.res.Teammates.forEach(element => {
          arr.push(element.Id)
        });

        this.OwnerIds = arr;
        this.filterCountOwner = this.OwnerIds.length;
        var element = document.getElementById("filter-owner");
        element?.classList.add("active");
        this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);

      }

    });
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
    @Name: openManageAccessModal
    @Who: Nitin Bhati
    @When: 13-Jan-2022
    @Why: EWM-4545
    @What: to open quick add Manage Access modal dialog
  */
  openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
      data: { candidateId: this.clientId, Id: Id, Name: Name, AccessModeId: this.oldPatchValues, ActivityType: 1 },
      panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {

      if (res.isSubmit == true) {
        this.oldPatchValues = {};
        this.accessEmailId = [];
        let mode: number;
        if (this.formHeading == 'Add') {
          mode = 0;
        } else {
          mode = 1;
        }
        res.ToEmailIds.forEach(element => {
          this.accessEmailId.push({
            'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': mode
          });
        });

        this.myActivityForm.patchValue({
          'AccessName': res.AccessName,
          'AccessId': res.AccessId[0].Id
        });
        this.oldPatchValues = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

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
  @Type: File, <ts>
  @Name: deleteActivity function 
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: call Api for delete record .
  */
  deleteActivity(val): void {
    this.getCandidateName(this.candidateIdScreening)
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'label_MenuActivity';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "355px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.loading = true;
        let delObj = {};
        let relatedUserId: string;
        if (this.PageName == 'Candidate Screening') {
          delObj = val;
          delObj["PageName"] = this.PageName;
          delObj["AttendeesList"] = this.requiredAttendeesList;
          relatedUserId = this.relatedUserJobId;
          delObj["RelatedUserId"] = relatedUserId;
          delObj["RelatedUserType"] = "JOB";
        } else {
          delObj = val;
        }
        this.candidateService.deleteActivityById(delObj).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;

              this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
              this.getClientYearMonthList();
              this.clientActivityCount.emit(true);
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      } else {
      }
    });
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
  @Name: getFilterConfig function 
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: filter config
  */
  getFilterConfig(loaderValue: boolean) {
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.isShowFilter = true;
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig;

            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig.length;
            } else {
              this.filterCount = 0;
            }

            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
            }
            if (colArrSelected.length !== 0) {
              this.columns = colArrSelected;
            } else {
              this.columns = this.colArr;
            }
          }
          if (loaderValue == true) {
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
 @Type: File, <ts>
 @Name: openDateFilterDialog function 
 @Who: Nitin Bhati
 @When: 13-Jan-2022
 @Why: EWM-4545
 @What: open date filter dialog
 */
  openDateFilterDialog() {
    const dialogRef = this.dialog.open(DateFilterActivityComponent, {
      panelClass: ['xeople-modal', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.FromDate = result.FromDate;
      this.ToDate = result.ToDate;
      if (this.FromDate && this.ToDate) {
        this.filterCountDate = 1;
        var element = document.getElementById("filter-date");
        element?.classList.add("active");
      }

      this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
    });
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
 @Name: openDialogJobCategory function 
 @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
 @What: job category dialog
 */
  openDialogJobCategory() {
    const dialogRef = this.dialog.open(CategoryFilterActivityComponent, {
      maxWidth: "750px",
      width: "90%",
      data: new Object({ category: this.category }),
      panelClass: ['quick-modalbox', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.CategoryIds = result.res;
      this.filterCountCategory = this.CategoryIds.length;
      this.filterCountOwner = this.OwnerIds.length;
      var element = document.getElementById("filter-category");
      element?.classList.add("active");
      this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
    });
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

  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridList.length) {
        this.pagneNo = this.pagneNo + 1;
        this.getClientActivityListScroll(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
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
    jsonObj['AttendeeId'] = this.candidateIdData;
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

    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = this.pagesize;
    jsonObj['OrderBy'] = '';
    jsonObj['FromDate'] = this.FromDate ? this.FromDate : null;
    jsonObj['ToDate'] = this.ToDate ? this.ToDate : null;

    this.candidateService.fetchActivityAll(jsonObj)
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
            this.loadingscroll = false;
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

  getIcon(uploadDocument) {
    if (uploadDocument) {

      const list = uploadDocument.split('.');
      const fileType = list[list.length - 1];
      let FileTypeJson = this.documentTypeOptions.filter(x => x['type'] === fileType.toLocaleLowerCase());
      if (FileTypeJson[0]) {
        let logo = FileTypeJson[0].logo;
        return logo;
      }

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
  formType(value) {
    // who:maneesh,what:ewm-11936 for by default public button patch,when:18/04/2023
    this.myActivityForm.patchValue({
      'AccessName': this.AccessName,
      'AccessId': this.AccessId
    });
    this.oldPatchValues = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
    if (this.isAttendeesdefaultShow) {
      this.isAddRequiredAttendees = true;
      this.myActivityForm.get('AddRequiredAttendees').clearValidators();
      this.myActivityForm.get('AddRequiredAttendees').updateValueAndValidity();

      this.getCandidateName(this.Id)
      // this.removable=false
    } else {
      this.isAddRequiredAttendees = false;
    }
    this.myActivityForm.enable();
    //<!----@suika @EWM-11802 @Whn 11-04-2023
    if (!this.emailConnection) {
      this.myActivityForm.get('IsSendCalendarInviteToAttendees').disable();
    }
    //<!-----@suika @EWM-11866 @whn 13-04-2023 @why enable disable required attendees---->
    if (this.requiredAttendeesList?.length == 0 && this.optionalAttendeesList?.length == 0) {
      this.isRequiredAttendees = false;
      this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);
      this.myActivityForm.get('IsSendEmailToAttendees').disable();
    } else {
      this.isRequiredAttendees = true;
      this.myActivityForm.get('IsSendEmailToAttendees').setValue(1);
    }
    //<!----@suika @EWM-11802 @Whn 11-04-2023
    if (!this.emailConnection) {
      this.myActivityForm.get('IsSendCalendarInviteToAttendees').disable();
    }
    this.action = false;
    this.formHeading = 'Add';
    this.activestatus = value;
    //this.formHeading = value;
    this.dateFill = new Date();
    this.fileAttachmentsOnlyTow = [];
    this.fileAttachments = [];
    this.IsDisabled = false;
    /* @When : 21-09-2022 @who: Renu @Why:1734 EWM-8251 @Waht : for scehdule assitance*/
    let slotStartDate = new Date();
    let slotEndDate = new Date(Date.now() + this.timePeriod * 60 * 1000);
    this.getScheduleAssitance(slotStartDate, slotEndDate);
    /* @When : 21-09-2022 @who: Renu @Why:1734 EWM-8251 @Waht : for scehdule assitance*/
  }
  /*
    @Type: File, <ts>
    @Name: openQuickMarkDoneModal
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2424
    @What: to open quick Activity mark as done modal dialog
*/
  openQuickMarkDoneModal(Id: any, remarkStatus: any, Remarks: any) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_markAsdone';
    const dialogRef = this.dialog.open(MarkDoneActivityComponent, {
      data: new Object({ editId: Id, remarkStatusId: remarkStatus, remarks: Remarks }),
      panelClass: ['xeople-modal', 'add_Manage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.clientActivityCount.emit(true);
        this.getFilterConfig(true);
        this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
        this.getClientYearMonthList();
      } else {
        // this.generalLoader = false;
      }
    })
  }



  /*
   @Type: File, <ts>
   @Name: openMultipleAttachmentModal function
   @Who: Anup Singh
   @When: 08-Feb-2022
   @Why:EWM-4805 EWM-4861
   @What: For Open Model For Multiple Attachment
 */

  openMultipleAttachmentModal() {
    const dialogRef = this.dialog.open(CustomAttachmentPopupComponent, {
      maxWidth: "600px",
      data: new Object({
        fileType: this.fileType, fileSize: this.fileSize, fileSizetoShow: this.fileSizetoShow,
        fileAttachments: this.fileAttachments
      }),
      width: "100%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isFile == true) {
        this.fileAttachments = [];
        this.fileAttachments = res.fileAttachments;

        if (this.fileAttachments.length > 2) {
          this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2);
        } else {
          this.fileAttachmentsOnlyTow = this.fileAttachments;
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



  /*
   @Type: File, <ts>
   @Name: removeAttachment function
   @Who: Anup Singh
   @When: 08-Feb-2022
   @Why:EWM-4805 EWM-4861
   @What: For remove Attachment
 */
  removeAttachment(fileInfo: any) {
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
      this.fileAttachments.splice(index, 1);
    }

    if (this.fileAttachments.length > 2) {
      this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
    } else {
      this.fileAttachmentsOnlyTow = this.fileAttachments
    }
  }

  /*
  @Type: File, <ts>
  @Name: getMeetingPlatformList function
  @Who: nitin Bhati
  @When: 20-April-2022
  @Why: EWM-6237
  @What: For getting Meeting Platform List 
 */
  getMeetingPlatformList() {
    this.loading = true;
    let intergrationType = 'Connected';
    this._integrationsBoardService.getMeetingPlatformList(intergrationType).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.meetingPlatformList = repsonsedata.Data;
        } else {
          this.meetingPlatformList = null;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }

  /* 
  @Type: File, <ts>
  @Name: clickMeetingPlatformID function
  @Who: Nitin Bhati
  @When: 20-April-2022
  @Why: EWM-6237
  @What: For MeetingPlatform Click event
 */
  clickMeetingPlatformID(RegistrationCodeId) {
    if (RegistrationCodeId != undefined) {
      this.meetingPlatformData = this.meetingPlatformList?.filter((dl: any) => dl.RegistrationCode == RegistrationCodeId);
      this.meetingPlatformName = this.meetingPlatformData[0]?.Name;
      if (this.meetingPlatformName != undefined) {
        this.getCreateMeetingUrl();
      }
    } else {
      this.myActivityForm.patchValue(
        {
          ActivityUrl: null,
        })
      this.readonly = null;
    }
  }

  /*
  @Type: File, <ts>
  @Name: getCreateMeetingUrl function
  @Who: Nitin Bhati
  @When: 04-May-2022
  @Why: EWM-6237
  @What: For getting Create Meeting URL
 */
  getCreateMeetingUrl() {
    this.scheduleInfo(this.myActivityForm.getRawValue());
    this.loading = true;
    let AddObj = {};
    this.scheduleTimeData.TimeZoneID =  this.myActivityForm.get("TimeZoneID")?.value;
    AddObj['Title'] = this.myActivityForm.get("ActivityTitle")?.value;
    AddObj['ScheduleActivity'] = this.scheduleTimeData;
    AddObj['MeetingPlatformId'] = this.myActivityForm.get("MeetingPlatform").value ? this.myActivityForm.get("MeetingPlatform").value : '00000000-0000-0000-0000-000000000000';
    if (!this.myActivityForm.value.ActivityTitle?.trim()) {
      this.isActivityTitle = true;
      this.loading = false;
      this.myActivityForm.patchValue(
        {
          MeetingPlatform: null,
        })
      return;
    }

    if (AddObj['MeetingPlatformId'] != '00000000-0000-0000-0000-000000000000') {
      this._integrationsBoardService.createMeetingUrl(AddObj).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
            this.loading = false;
            let meetingUrlData = repsonsedata.Data;
            this.MeetingId = repsonsedata.Data.MeetingId;
            this.MeetingUrl = repsonsedata.Data.MeetingUrl;
            this.myActivityForm.patchValue({
              'ActivityUrl': repsonsedata.Data.MeetingUrl,
            });
            this.readonly = true;
            this.isActivityTitle = false;
          } else if (repsonsedata.HttpStatusCode == '400') {
            this.readonly = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
            this.myActivityForm.patchValue(
              {
                ActivityUrl: null,
              })
            this.isActivityTitle = false;

          } else {
            this.meetingUrlData = null;
            this.loading = false;
            this.readonly = false;
          }
        }, err => {
          this.readonly = false;
          this.loading = false;
        })
    }
  }
  /*
    @Type: File, <ts>
    @Name: onRemoveMeetingChange function
    @Who: Nitin Bhati
    @When: 05-May-2022
    @Why: EWM-6049
    @What: For remove in MeetingPlatform
   */
  onRemoveMeetingChange() {
    this.MeetingId = null;
    this.isActivityTitle = false;
    this.loading = false;
    this.myActivityForm.patchValue(
      {
        ActivityUrl: null,
      })
    this.readonly = null;
  }

  /*
@Type: File, <ts>
@Name: onchangeCategory
@Who: suika
@When: 24-aug-2022
@Why:EWM-6129 EWM-8192
@What: patch data when category select
*/

selectedCategoryId: string;
onchangeCategory(category) {
  if(this.selectedCategoryId==category?.Id){
   this.myActivityForm.patchValue({
     CategoryId:'',
     CategoryName:'',
     ActivityTitle: this.myActivityForm.value.RelatedUserUserName
     
   })
   this.selectedCategoryId = '';
  }else{
   this.selectedCategoryId = category?.Id;
   this.myActivityForm.patchValue({
     CategoryId: category?.Id,
     CategoryName: category?.ActivityCategory,
     ActivityTitle: `${category?.ActivityCategory} ${this.myActivityForm.value.RelatedUserUserName ? '-' +this.myActivityForm.value.RelatedUserUserName : this.myActivityForm.value.RelatedUserUserName}`
   })
  }  
 }
  /*
      @Type: File, <ts>
      @Name: changeTimeDisplay
      @Who: Renu
      @When: 22-Sep-2022
      @Why:EWM-1734 EWM-8251
      @What: open user change time format from dropdown
      */

  changeTimeDisplay($event) {
    this.timeDisplayHour = $event.value;
    this.getTimeSlot(this.selectedTimeslots, null, this.slotAdd);
  }
  /*
   @Type: File, <ts>
   @Name: openModelForSchedule
   @Who: Renu
   @When: 22-Sep-2022
   @Why:EWM-1734 EWM-8251
   @What: open Modal for schedule
   */
  openModelForScheduleAssistanceDate() {
    const dialogRef = this.dialog.open(ScheduleAssistanceDatePopupComponent, {
      data: new Object({ scheduleData: { 'TimeZone': this.utctimezonName, 'DateStart': this.slotStartDate }, activityActionForm: this.activityActionForm }),
      panelClass: ['xeople-modal', 'schedule-overflow', 'AddSchedule', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isSchedule == true) {
        this.slotStartDate = res.scheduleData.DateStart;
        const d = new Date(this.slotStartDate);
        let slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString().slice(0, 10);;
        this.myActivityForm.patchValue({
          'slotDate': slotDate
        })
        this.utctimezonName = res.scheduleData.TimeZone;
        this.getAvaiableTimeslots(this.slotStartDate);
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
  @Name: openModelForSchedule
  @Who: Renu
  @When: 22-Sep-2022
  @Why:EWM-1734 EWM-8251
  @What: when time slot changes
  */
  changeTimeSlot($event) {
    this.timePeriod = $event;
    if ($event == undefined) {
      this.myActivityForm.patchValue({
        'timePeriod': '60'
      })
      this.timePeriod = 60;
    }
    if (this.timePeriod == 15) {
      document.getElementById('time-slot').classList.add('add-slotscroll');
    } else {
      document.getElementById('time-slot').classList.remove('add-slotscroll');
    }
    this.getAvaiableTimeslots('');
    this.selectedItem = [];
  }

  /*
   @Type: File, <ts>
   @Name: getAllRegion
   @Who: Renu
   @When: 22-Sep-2022
   @Why:EWM-1734 EWM-8251
   @What: for getting all timezone info
   */

   getAllRegion() {
    this.getAccountPreference();
    if (this.scheduleData24Hrs != undefined && this.scheduleData24Hrs != null && this.scheduleData24Hrs != '') {
      this.patchScheduleData(this.scheduleData24Hrs);
    }
  
  }

  /*
     @Type: File, <ts>
     @Name: getScheduleAssitance
     @Who:Renu
     @When: 22-Sept-2022
     @Why:EWM-1734 EWM-8251
     @What: get All avaiable User
     */

  getScheduleAssitance(startDate, endDate) {
    this.slotStartDate = new Date(startDate);
    this.slotEndDate = new Date(endDate);
    const startdatetime = new Date(this.slotStartDate);
    let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
    this.myActivityForm.patchValue({
      'slotDate': slotDate,
      'timePeriod': '60'
    })
  }

  /*
    @Type: File, <ts>
    @Name: getAvaiableTimeslots
    @Who: Suika
    @When: 21-April-2022
    @Why:EWM-5572 EWM-6131
    @What: get All avaiable User
    */
  getAvaiableTimeslots(startdatetime) {
    const d = new Date(this.slotStartDate);
    let timeZone = this.utctimezonName?.substring(4, 10);
    let slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    let timeZoneValue = encodeURIComponent(timeZone);
    this.quickJobService.getAvaiableTimeslots(slotDate, this.timePeriod, timeZoneValue).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.timeAvaiableSlots = repsonsedata.Data?.TimeSlots;
          if (startdatetime != '') {
            const enddatetime = new Date(this.slotEndDate);
            let starttime = this.slotStartDate?.getTime();
            const stime = new Date(Number(starttime));
            this.startTime = moment.utc(stime).tz(this.timezonName).format("hh:mm");
            let endtime = enddatetime?.getTime();
            const etime = new Date(Number(endtime));
            this.endTime = moment.utc(etime).tz(this.timezonName).format("hh:mm");
            this.selectedTimeslots = { StartTime: starttime, EndTime: endtime };
            let index: number;
            if (this.slotAdd == true) {
              index = this.timeAvaiableSlots.map((elm, idx) => ((elm.StartTime >= starttime && elm.StartTime <= endtime) ||
                (elm.EndTime >= starttime && elm.EndTime <= endtime)) ? idx : '').filter(String);
            } else {
              index = this.timeAvaiableSlots.findIndex((e: any) => e.StartTime == starttime);
            }
            this.slotStartDate = startdatetime;
            this.getTimeSlot(this.selectedTimeslots, index, this.slotAdd);
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.timeAvaiableSlots = [];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
  @Type: File, <ts>
  @Name: getTimeSlot
  @Who: Nitin Bhati
  @When: 12-March-2023
  @Why:EWM-10638
  @What: for patching th value based on 12/24 format
  */

  getTimeSlot(timeslots, i, slotAdd) {
    this.myActivityForm.get('MeetingPlatform').setValue(null);
    this.onRemoveMeetingChange();
    this.readonly = null;
    this.slotAdd = slotAdd;
    this.selectedTimeslots = timeslots;
    if (this.slotAdd == true) {
      if (i?.length != null) {
        i.forEach(x => {
          this.selectedItem[x] = x;
        })
      }
    } else {
      this.selectedItem = [];
      if (i != null) {
        this.selectedItem[i] = i;
      }
    }
    const d = new Date(Number(timeslots.StartTime));
    let startTime: any;
    let endTime: any;
    let scheduleFormData = {};
    if (this.timeDisplayHour == 12) {

      let hourStartTime = moment.utc(d).tz(this.timezonName).hours();
      let minuteStartTime = moment.utc(d).tz(this.timezonName).minute();
      if (this.activityActionForm == 'Add' && this.slotAdd == true) {
        if (minuteStartTime <= 30)
          startTime = moment.utc(d).tz(this.timezonName).set({ minute: 30 }).format("hh:mm");
        if (minuteStartTime > 30)
          startTime = moment.utc(d).tz(this.timezonName).set({ hours: hourStartTime + 1, minute: 0 }).format("hh:mm");
      } else {
        startTime = moment.utc(d).tz(this.timezonName).format("hh:mm");
      }
      const e = new Date(Number(timeslots.EndTime));
      let hourendTime = moment.utc(e).tz(this.timezonName).hours();
      let minuteEndTime = moment.utc(e).tz(this.timezonName).minute();
      if (this.activityActionForm == 'Add' && this.slotAdd == true) {
        if (minuteEndTime <= 30)
          endTime = moment.utc(e).tz(this.timezonName).set({ minute: 30 }).format("hh:mm");
        if (minuteEndTime > 30)
          endTime = moment.utc(e).tz(this.timezonName).set({ hours: hourendTime + 1, minute: 0 }).format("hh:mm");
      } else {
        let end_time = moment.utc(e).tz(this.timezonName).format("hh:mm");
        endTime = end_time;
      }
    } else {
      let hourStartTime = moment.utc(d).tz(this.timezonName).hours();
      let minuteStartTime = moment.utc(d).tz(this.timezonName).minute();
      if (this.activityActionForm == 'Add' && this.slotAdd == true) {
        if (minuteStartTime <= 30)
          startTime = moment.utc(d).tz(this.timezonName).set({ minute: 30 }).format("HH:mm");
        if (minuteStartTime > 30)
          startTime = moment.utc(d).tz(this.timezonName).set({ hours: hourStartTime + 1, minute: 0 }).format("HH:mm");
      } else {
        let start_time = moment.utc(d).tz(this.timezonName).format('HH:mm');
        startTime = start_time;
      }
      const e = new Date(Number(timeslots.EndTime));
      let hourendTime = moment.utc(e).tz(this.timezonName).hours();
      let minuteEndTime = moment.utc(e).tz(this.timezonName).minute();
      if (this.activityActionForm == 'Add' && this.slotAdd == true) {
        if (minuteEndTime <= 30)
          endTime = moment.utc(e).tz(this.timezonName).set({ minute: 30 }).format("HH:mm");
        if (minuteEndTime > 30)
          endTime = moment.utc(e).tz(this.timezonName).set({ hours: hourendTime + 1, minute: 0 }).format("HH:mm");
      } else {
        let end_time = moment.utc(e).tz(this.timezonName).format('HH:mm');
        endTime = end_time;
      }
    }
    scheduleFormData['TimeZone'] = this.utctimezonName;
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), startTime);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = startTime;
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), endTime);
    scheduleFormData['DateEnd'] = local_endDate;
    const e = new Date(Number(timeslots.EndTime));
    if (i === 0 || i === null) {
      scheduleFormData['TimeEnd'] = this.timeAddMinutes(endTime, 60);
    } else {
      scheduleFormData['TimeEnd'] = endTime;
    }

    this.get24hrsFormatSchedule(d, e);
    this.scheduleData = scheduleFormData;
    this.myActivityForm.patchValue({
      ScheduleActivity: scheduleFormData,
    });

    this.patchScheduleData(this.scheduleData24Hrs)
    this.getScheduleTimeData(timeslots, i);
  }

  /*
 @Type: File, <ts>
 @Name: getScheduleTimeData
 @Who: Nitin Bhati
 @When: 10-March-2023
 @Why:EWM-10638
 @What: calucation for the schedule time
 */
  getScheduleTimeData(timeslots, index) {
    const d = new Date(Number(timeslots.StartTime));
    let startTime: any;
    let endTime: any;

    let hourStartTime = moment.utc(d).tz(this.timezonName).hours();
    let minuteStartTime = moment.utc(d).tz(this.timezonName).minute();
    if (this.activityActionForm == 'Add' && this.slotAdd == true) {
      if (minuteStartTime <= 30)
        startTime = moment.utc(d).tz(this.timezonName).set({ minute: 30 }).format("HH:mm");
      if (minuteStartTime > 30)
        startTime = moment.utc(d).tz(this.timezonName).set({ hours: hourStartTime + 1, minute: 0 }).format("HH:mm");
    } else {
      let start_time = moment.utc(d).tz(this.timezonName).format('HH:mm');
      startTime = start_time;
    }

    const e = new Date(Number(timeslots.EndTime));
    let end_time: any;


    let hourendTime = moment.utc(e).tz(this.timezonName).hours();
    let minuteEndTime = moment.utc(e).tz(this.timezonName).minute();
    if (this.activityActionForm == 'Add' && this.slotAdd == true) {
      if (minuteEndTime <= 30)
        endTime = moment.utc(e).tz(this.timezonName).set({ minute: 30 }).format("HH:mm");
      if (minuteEndTime > 30)
        endTime = moment.utc(e).tz(this.timezonName).set({ hours: hourendTime + 1, minute: 0 }).format("HH:mm");
    } else {
      end_time = moment.utc(e).tz(this.timezonName).format('HH:mm');
      endTime = end_time;
    }
    let scheduleFormData = {};
    scheduleFormData['TimeZone'] = this.utctimezonName;
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), startTime);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = startTime;
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), endTime);
    scheduleFormData['DateEnd'] = local_endDate;
    if (index === 0 || index === null) {
      scheduleFormData['TimeEnd'] = this.timeAddMinutes(endTime, 60);
    } else {
      scheduleFormData['TimeEnd'] = moment.utc(e).tz(this.timezonName).format('HH:mm');

    }
    this.scheduleTimeData = scheduleFormData;
  }
  /*
    @Type: File, <ts>
    @Name: getCandidateName
    @Who: Maneesh
    @When: 27-oct-2022
    @Why: EWM-9324
    @What: get  CandidateName
    */
  getCandidateName(Id) {
    this.candidateService.getCandidateSummaryList('?CandidateId=' + this.candidateIdScreening).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.candidateData = repsonsedata.Data
          this.requiredAttendeesList.push({
            Id: this.candidateData.CandidateId,
            Name: this.candidateData.Name,
            Email: this.candidateData.CandidateEmail,
            isDefaultAttendees: true
          })
          const unique = [...new Map(this.requiredAttendeesList.map((m) => [m.Id, m])).values()];
          this.requiredAttendeesList = unique;
          if (this.activestatus != 'Edit') {
            this.action = false;
          }

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
      @Type: File, <ts>
      @Name: add remove animation function
      @Who: maneesh
      @When: 13-feb-2023
      @Why: EWM-10466
      @What: add and remove animation
  */

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  refreshComponent() {
    this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
    this.getClientYearMonthList();
  }

  /*
 @Type: File, <ts>
 @Name: timeAddMinutes
 @Who: Nitin Bhati
 @When: 12-March-2023
 @Why:- EWM-10638
 @What: To add minutes on month click based on timeslot selected
 */
  timeAddMinutes(time, min) {
    var t = time.split(":"),
      h = Number(t[0]),
      m = Number(t[1]);
    m += min % 60;
    h += Math.floor(min / 60);
    if (m >= 60) { h++; m -= 60 }

    return (h + "").padStart(2, "0") + ":"
      + (m + "").padStart(2, "0");
  }

  /*
 @Type: File, <ts>
 @Name: get24hrsFormatSchedule
 @Who: Nitin Bhati
 @When: 12-March-2023
 @Why:- EWM-10638
 @What: for conversion schedule popup patch in 2 hrs format
 */
  get24hrsFormatSchedule(startDate: any, enddate: any) {
    let scheduleFormData = {};
    let startTime: any;
    let endTime: any;
    let hourStartTime = moment.utc(startDate).tz(this.timezonName).hours();
    let minuteStartTime = moment.utc(startDate).tz(this.timezonName).minute();
    if (this.activityActionForm == 'Add' && this.slotAdd == true) {
      if (minuteStartTime <= 30)
        startTime = moment.utc(startDate).tz(this.timezonName).set({ minute: 30 }).format("HH:mm");
      if (minuteStartTime > 30)
        startTime = moment.utc(startDate).tz(this.timezonName).set({ hours: hourStartTime + 1, minute: 0 }).format("HH:mm");
    } else {
      let start_time = moment.utc(startDate).tz(this.timezonName).format('HH:mm');
      startTime = start_time;
    }

    const convEnd = new Date(Number(enddate));
    let hourendTime = moment.utc(convEnd).tz(this.timezonName).hours();
    let minuteEndTime = moment.utc(convEnd).tz(this.timezonName).minute();
    if (this.activityActionForm == 'Add' && this.slotAdd == true) {
      if (minuteEndTime <= 30)
        endTime = moment.utc(convEnd).tz(this.timezonName).set({ minute: 30 }).format("HH:mm");
      if (minuteEndTime > 30)
        endTime = moment.utc(convEnd).tz(this.timezonName).set({ hours: hourendTime + 1, minute: 0 }).format("HH:mm");
    } else {
      let end_time = moment.utc(convEnd).tz(this.timezonName).format('HH:mm');
      endTime = end_time;
    }

    scheduleFormData['TimeZone'] = this.utctimezonName;
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), startTime);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = startTime;
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), endTime);
    scheduleFormData['DateEnd'] = local_endDate;
    scheduleFormData['TimeEnd'] = endTime;

    this.scheduleData24Hrs = scheduleFormData;
  }
 
  /*
   @Type: File, <ts>
   @Name: getAccountPreference function
   @@Who: Renu
   @When: 17-mar-2023
   @Why:EWM-11055 EWM-11093
   @Why: call Get method from services for showing data into grid
 */
   getAccountPreference() {
    let userTimeZone  = localStorage.getItem('UserTimezone');
    this.RegionName = userTimeZone;
    this.TimeZoneName = userTimeZone;
    let regionId = this.timezoneArrList.filter(x => x['Id'] == userTimeZone);
  
    this.myActivityForm.patchValue({
      'TimeZone': { Id: regionId[0]?.Id, Timezone: regionId[0]?.Timezone },
      TimeZoneID: regionId[0]?.Id
    })
    this.selecteTimezone = regionId[0];
      this.gridTimeZone = this.timezoneArrList;
      let gridTimeZone = this.gridTimeZone?.filter(x => x['Id'] === this.timezonName);
      this.utctimezonName = gridTimeZone[0]?.Timezone;
      let slotStartDate = new Date();
      let slotEndDate = new Date(Date.now() + this.timePeriod  * 60 * 1000);
      const startdatetime = new Date(this.slotStartDate); 
      let slotDate =  new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0,10);
      this.myActivityForm.patchValue({
        'slotDate':slotDate
      })  
       
      this.getScheduleAssitance(slotStartDate,slotEndDate);
  }
 
  /*
@Type: File, <ts>
@Name: patchScheduleData()
@Who: Renu 
@When: 17-mar-2022
@Why:EWM-11055 EWM-11093
@What: patch data
*/
  patchScheduleData(value) {
    this.StartDateMin = null;
    let timeZoneData: any;
    setTimeout(() => {
      timeZoneData = this.timezoneArrList.filter(x => x['Timezone'] == value.TimeZone || x['Id'] == value.TimeZone);
      let DateStart = this.appSettingsService.getUtcDateFormat(value.DateStart);
      let DateEnd = this.appSettingsService.getUtcDateFormat(value.DateEnd);
      let startTime = value.TimeStart.split(":");
      let endTime = value.TimeEnd.split(":");
      let getStrtTime = value.DateStart.split('-');

      this.TimeStartValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], startTime[0], startTime[1], 0);
      this.TimeEndValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], endTime[0], endTime[1], 0);
      this.myActivityForm.patchValue({
        TimeZone: timeZoneData[0],
        DateStart: DateStart,
        TimeStart: value.TimeStart,
        DateEnd: DateEnd,
        TimeEnd: value.TimeEnd,
      });
    }, 1000)


    let local_startDate = moment.utc(value.DateStart).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(value.DateEnd).local().format('YYYY-MM-DD');
    if (local_startDate === local_endDate) {
      this.isDateEnd = false;
    } else {
      this.isDateEnd = true;
    }

    let DateStart = this.appSettingsService.getUtcDateFormat(value.DateStart);
    this.EndDateMin = new Date(new Date(DateStart));
    this.EndDateMin.setDate(this.EndDateMin.getDate());
  }
  /*
@Type: File, <ts>
@Name: handleChangeStartTime function
@Who: Renu
@When: 17-Mar-2023
@Why: EWM-11055 EWM-11093
@What: getting start time value which  selected for
*/
  handleChangeStartTime(e: any) {
    let date = new Date(e);
    let mnth: any = ("0" + (date.getMonth() + 1)).slice(-2);
    let day: any = ("0" + date.getDate()).slice(-2);
    this.TimeStartValue = new Date(date.getFullYear(), mnth, day, date.getHours(), date.getMinutes(), 0);
    this.TimeEndValue = new Date(date.getFullYear(), mnth, day, date.getHours() + 1, date.getMinutes(), 0);

    this.myActivityForm.patchValue({
      TimeStart: new Date(this.TimeStartValue).toString().slice(16, 21),
      TimeEnd: new Date(this.TimeEndValue).toString().slice(16, 21),
    });
    this.onChangeEndTime();
  }
  /*
  @Type: File, <ts>
  @Name: onChangeEndTime()
  @Who: renu
  @When: 17-mar-2023
  @Why:EWM-11055 EWM-11093 
  @What: change time
  */
  onChangeEndTime() {
    let getStartTimeHM: any = new Date(this.TimeStartValue).toString().slice(16, 21);
    let getEndTimeHM: any = new Date(this.TimeEndValue).toString().slice(16, 21);
    let local_startDate = moment.utc(this.myActivityForm.get("DateStart").value).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(this.myActivityForm.get("DateEnd").value).local().format('YYYY-MM-DD');

    if (local_startDate == local_endDate) {
      const date1 = new Date('2023-01-01 ' + getStartTimeHM);
      const date2 = new Date('2023-01-01 ' + getEndTimeHM);
      if (date2.getTime() > date1.getTime()) {
        this.isMinTimeCondotion = false;
      }
      else {
        this.isMinTimeCondotion = true;
      }
    } else {
      this.isMinTimeCondotion = false;
    }

  }

  /*
    @Type: File, <ts>
    @Name: handleChangeEndTime function
    @Who: Renu
    @When: 17-Mar-2023
    @Why: EWM-11055 EWM-11093
    @What: getting End time value which i have selected for
  */
  handleChangeEndTime(e: any) {
    this.TimeEndValue = e;
    this.onChangeEndTime();
  }
  /*
    @Type: File, <ts>
    @Name: clearStartDate function
    @Who: Renu
    @When: 17-mar-2022
    @Why:EWM-11055 EWM-11093
    @What: For clear start  date 
 */
  clearStartDate(e) {
    this.myActivityForm.patchValue({
      DateStart: null
    });
  }
  /*
 @Type: File, <ts>
 @Name: clearEndDate function
 @Who: Renu 
 @When: 17-mar-2022
 @Why:EWM-11055 EWM-11093
 @What: For clear end  date 
  */
  clearEndDate(e) {
    this.myActivityForm.patchValue({
      DateEnd: null
    });
  }
  /*
@Type: File, <ts>
@Name: addDateEnd()
@Who: Renu
@When: 17-Mar-2023
@Why:EWM-11055 ewm-11093
@What: change end date
*/
  addDateEnd() {
    let local_startDate = moment.utc(this.myActivityForm.get("DateStart").value).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(this.myActivityForm.get("DateEnd").value).local().format('YYYY-MM-DD');
    if (local_startDate == local_endDate) {
      this.isDateEnd = false;
    }
    this.onChangeEndTime();
  }

  /*
  @Type: File, <ts>
  @Name: addDateStart()
  @Who: Renu
  @When: 17-Mar-2023
  @Why:EWM-11055 ewm-11093
  @What: change start date
  */
  addDateStart(event) {
    let DateStart = this.appSettingsService.getUtcDateFormat(this.myActivityForm.get("DateStart").value);
    this.EndDateMin = new Date(new Date(DateStart));
    this.EndDateMin.setDate(this.EndDateMin.getDate());
    this.myActivityForm.patchValue({
      DateEnd: DateStart
    });
    this.isDateEnd = false;

  }
  /*
@Type: File, <ts>
@Name: onChangeTimezone()
@Who: Renu
@When: 17-mar-2023
@Why:EWM-11055 ewm-11093 
@What: get time according to chosen timezone
*/
onChangeTimezone(event){
  if (event.length != 0) {
    this.myActivityForm.patchValue({
      'TimeZone': { Id: event?.Id, Timezone: event?.Timezone },
      TimeZoneID: event?.Id
    })
    const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
    var formatTime = (date) => {
      const hours = getTwoDigits(date.getHours());
      const mins = getTwoDigits(date.getMinutes());
      return `${hours}:${mins}`;
    }
    let startDate = new Date();
    let endDate = new Date(Date.now() + 10 * 60 * 1000);
    /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: null handling **/
    const date = this.changeTimezone(startDate, event?.Id);
    const dateEnd = this.changeTimezone(endDate, event?.Id);
    this.currentStartDate = date;
    this.myActivityForm.patchValue({
      TimeStart: formatTime(date),
      TimeEnd: formatTime(dateEnd),
      DateEnd: date,
    })

    // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10688 EWM-10940 Desc- chnage time while chnage the timezone --------
    let startTime: any = formatTime(date).split(":")
    let endTime: any = formatTime(dateEnd).split(":")
    this.TimeStartValue = new Date(2023, 2, 10, startTime[0], startTime[1], 0);
    this.TimeEndValue = new Date(2023, 2, 10, endTime[0], endTime[1], 0);
    // end 
    this.myActivityForm.get("DateEnd").markAsTouched();
    this.selecteTimezone = event;

  }
  else {
    this.myActivityForm.patchValue({
      TimeZone: null
    });
    this.selecteTimezone = {};
    this.myActivityForm.get("TimeZone").setErrors({ required: true });
    this.myActivityForm.get("TimeZone").markAsTouched();
    this.myActivityForm.get("TimeZone").markAsDirty();
  }

}
  /*
  @Type: File, <ts>
  @Name: changeTimezone()
  @Who: Renu
  @When: 17-mar-2022
  @Why:EWM-11055 EWM-11093 
  @What: get time date based on chosen timezone
  */
  changeTimezone(date, ianatz) {
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: ianatz
    }));
    var diff = date.getTime() - invdate.getTime();
    return new Date(date.getTime() - diff);
  }
  /*
    @Type: File, <ts>
    @Name: onActivityChange
    @Who: Nitin Bhati
    @When: 20-mar-2022
    @Why:EWM-11254 EWM-11257
    @What: get data when activity change
  */
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
  }
  /*
       @Type: File, <ts>
       @Name: scheduleInfo
       @Who: Renu
       @When: 17-MAR-2023
       @Why:EWM-11055 EWM-11093
       @What: data create for my activity
       */
  scheduleInfo(value) {
    this.onChangeEndTime();
    let scheduleFormData = {};
    let getStartTimeHM: any = new Date(this.TimeStartValue).toString().slice(16, 21);
    let getEndTimeHM = new Date(this.TimeEndValue).toString().slice(16, 21);
    scheduleFormData['TimeZone'] = value.TimeZone.Timezone;
    let localstartDate = new Date(value.DateStart);
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(localstartDate, getStartTimeHM);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = getStartTimeHM;
    let localendDate = new Date(value.DateEnd)
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(localendDate, getEndTimeHM);
    scheduleFormData['DateEnd'] = local_endDate;
    scheduleFormData['TimeEnd'] = getEndTimeHM;
    this.scheduleTimeData = scheduleFormData;
  }
  /*
@Type: File, <ts>
@Name: openTemplateModal
@Who: Nitin Bhati
@When: 20-March-2023
@Why: EWM-11256
@What: to open template modal dialog
*/
  openTemplateModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_insertTemplate';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(TemplatesComponent, {
      panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this._SystemSettingService.getEmailTemplateByID('?id=' + res.data.Id).subscribe(
          (repsonsedata: ResponceData) => {
            this.loading = false;
            if (repsonsedata.HttpStatusCode === 200) {
              let cceList = repsonsedata.Data.CcEmail?.split(',');
              this.optionalAttendeesList = [];
              for (let itr2 = 0; itr2 < cceList?.length; itr2++) {
                if (cceList[itr2]?.length != 0 && cceList[itr2] != '') {
                  this.optionalAttendeesList.push({ Name: cceList[itr2], Email: cceList[itr2] });
                }
              }
              this.myActivityForm.patchValue({
                'ActivityTitle': repsonsedata.Data.Subject,
                'Description': repsonsedata['Data'].TemplateText
              });
               // adarsh singh EWM-14288 on 23-09-2023 
               this.renderer.selectRootElement('#activity-titleOfActivity').focus();
               this.myActivityForm.get('ActivityTitle').markAllAsTouched();
               // End 
            }
            else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          },
          err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            this.loading = false;
          });
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
   @Name: getInsertPlaceholderByType
   @Who: Nitin Bhati
   @When: 20-March-2023
   @Why: EWM-11273
   @What: For Insert Job tag value
 */
  getInsertPlaceholderByType(insertType) {
    this._SystemSettingService.getPlaceholderByType(insertType).subscribe(
      respdata => {
        if (respdata['Data']) {
          let existing: any[] = this._toolButtons$.getValue();
          this.plcData = [];
          for (let plc of respdata['Data']) {
            this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
          }
          let peopleButton: string = insertType;
          existing.push({ text: peopleButton, data: this.plcData });
          let jobData: any = existing.filter((item) => {
            return item.text === insertType
          });
          this._toolButtons$.next(jobData);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
      @Type: File, <ts>
      @Name: onEditMeetingURlActivity
      @Who: renu
      @When: 27-march-2023
      @Why:EWM-11340 EWM-11356
      @What:on edit platform URL
      */
  onEditMeetingURlActivity(): void {
    const message = '';
    const title = '';
    const subTitle = 'label_editPlatform';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "355px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.readonly = false;

      } else {
        this.readonly = true;
      }
    });
  }
  /*
     @Type: File, <ts>
     @Name: clearDate function
     @Who: Bantee
     @When: 27-mar-2023
     @Why:EWM-11204 EWM-11238
     @What: For clear date 
  */
  clearDate(e) {
    this.myActivityForm.patchValue({
      slotDate: null
    });
  }
  /*
 @Type: File, <ts>
 @Name: previewEmailPopUp
 @Who: Nitin Bhati
 @When: 17-March-2023
 @Why: EWM-11104
 @What: For open preview Email popup
*/
  previewEmailPopUp() {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: new Object({ subjectName: this.myActivityForm.get("ActivityTitle").value, emailTemplateData: this.myActivityForm.get("Description").value, RelatedUserType: this.category, RelatedUserId: this.candidateIdData, isActivity: true }),
      panelClass: ['xeople-modal-lg', 'emailPreview', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {

      }
    });
  }
  /*
   @Type: File, <ts>
   @Name: resetForm
   @Who: Renu
   @When: 28-March-2023
   @Why: EWM-11340 EWM-11366
   @What: RESET FORM 
 */
  resetForm() {
    Object.keys(this.myActivityForm.controls).forEach(key => {
      if (preFieldKey[key] !== key)
        this.myActivityForm.get(key).reset();
    });
    this.optionalAttendeesList = [];
    this.requiredAttendeesList = [];
    this.readonly = null;
    // this.getAllInviteUser(this.userId);
    this.timePeriod = 60;
    this.action = false;
    this.activestatus = 'Add';
    this.requiredAttendeesList = [];
    this.organizerOrAssigneesList = [];
    this.scheduleData = [];
    this.oldPatchValues = {};
    this.accessEmailId = [];
    //this.myActivityForm.reset();
    this.myActivityForm.patchValue({
      'RelatedUserType': this.category,
      'RelatedUserId': this.candidateIdData
    });
    this.myActivityForm.patchValue({
      LoggedInUserName: this.userInviteArr[0].UserName
    })
  }

  /*       
  @Type: File, <ts>
  @Name: showpassword
  @Who:Nitin Bhati
  @When: 31-March-2023
  @Why: EWM-11401
  @What: For showing password.
 */
  showpassword(password, showpassstatus) {
    this.Zoopplaypassword = password;
    this.showpassstatus = !showpassstatus;
  }
  /*
   @Name: copyActivityPlayUrl
   @Who:Nitin Bhati
   @When: 31-March-2023
   @Why: EWM-11401
   @What: For copy play url.
  */
  copyActivityPlayUrl(jobApplicationUrl) {
    this.messageCopy = true;
    this.label_copied = 'label_copiedMeetingRecordingUrl'
    setTimeout(() => {
      this.messageCopy = false;
    }, 3000);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = jobApplicationUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  /*
  @Name: copyZoomRecordingPassword
  @Who:Nitin Bhati
  @When: 31-March-2023
  @Why: EWM-11401
  @What: For copy zoom play url.      
  */
  copyZoomRecordingPassword(jobApplicationUrl) {
    this.messageCopy = true;
    this.label_copied = 'label_copiedPassword'
    setTimeout(() => {
      this.messageCopy = false;
    }, 3000);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = jobApplicationUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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
  let isemailConnect:any = localStorage.getItem('emailConnection');
  if (isemailConnect == 1) {
    this.emailConnection = true;
  }
  else{
    this.emailConnection = false;
    this.myActivityForm.get('IsSendCalendarInviteToAttendees').setValue(0);
  }
  }	


  /*
 @Type: File, <ts>
 @Name: myActivityDataBy function
 @Who: Anup Singh
 @When: 18-jan-2022
 @Why:EWM-4465 EWM-4661
 @What: getting my activity data based on specific Id
*/
  myActivityDataBy(Id: any) {
    this.StartDateMin = null;
    this.loading = true;
    this._SystemSettingService.getMyActivityById('?id=' + Id)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.oldPatchValues = data.Data;
            this.accessEmailId = this.oldPatchValues?.GrantAccesList;

            let res = data.Data;
            this.onChangeActivityRelatedTo(res.RelatedUserType);
            setTimeout(() => {
              this.selectedRelatedUser = { 'Id': res.RelatedUserId, 'Name': res.RelatedUserUserName }
              this.onRelatedUserchange(this.selectedRelatedUser);
            }, 2000);
            this.selectedCategory = res.CategoryId;
            this.myActivityForm.patchValue({
              'ActivityTitle': res.ActivityTitle,
              'RelatedUserType': res.RelatedUserType,
              'RelatedUserTypeName': res.RelatedUserTypeName,
              'RelatedUserId': res.RelatedUserId,
              'RelatedUserUserName': res.RelatedUserUserName,
              'ScheduleActivity': res.ScheduleActivity,
              'AddRequiredAttendees': res.AttendeesList,
              'Location': res.Location,
              'ActivityUrl': res.ActivityUrl,
              'Description': res.Description,
              'CategoryId': res.CategoryId,
              'CategoryName': res.CategoryName,
              'Id': res.Id,
              'AccessName': res.AccessName,
              'AccessId': res.AccessId,

              'MeetingPlatform': res.MeetingPlatformId == '00000000-0000-0000-0000-000000000000' ? null : res.MeetingPlatformId,
              'IsSendCalendarInviteToAttendees': res.IsSendCalendarInviteToAttendees == 1 ? true : false,
              'IsSendEmailToAttendees': res.IsSendEmailToAttendees == 1 ? true : false,
              'TimeZoneID':res?.ScheduleActivity?.TimeZoneID
            });
            if (res.MeetingPlatformId == '00000000-0000-0000-0000-000000000000') {
              this.readonly = null;
            } else {
              this.readonly = true;
            }
            this.relatedUserJobId = res.RelatedUserId;
            this.CalendarExternalId = res.CalendarExternalId;
            this.meetingPlatformName = res.MeetingPlatform;
            this.MeetingId = res.MeetingId;
            this.fileAttachments = res.Files;
            if (this.fileAttachments.length > 2) {
              this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
            } else {
              this.fileAttachmentsOnlyTow = this.fileAttachments
            }

            this.requiredAttendeesList = [];
            this.optionalAttendeesList = [];
            if (res.AttendeesList != '') {
              if (res.AttendeesList.length > 0) {
                this.requiredAttendeesList = res.AttendeesList;
              }

            }
            if (res.OptionalAttendeesList != '') {
              this.optionalAttendeesList = res.OptionalAttendeesList;
            }
            if (this.requiredAttendeesList?.length == 0 && this.optionalAttendeesList?.length == 0) {
              this.isRequiredAttendees = false;
              this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);
            } else {
              this.isRequiredAttendees = true;
              this.myActivityForm.get('IsSendEmailToAttendees').setValue(1);
            }
            this.selectedOrganizer = [];
            if (res.OrganizersList != '') {
              if (res.OrganizersList.length > 0) {
                res.OrganizersList.forEach(element => {
                  this.selectedOrganizer.push({
                    Id: element.Id,
                    Mode: element.Mode,
                    Email: element.Email,
                    UserName: element.UserName,
                    UserId: element.UserId
                  })
                });
              }
            }
            this.myActivityForm.patchValue({
              'OrganizerOrAssignees': this.selectedOrganizer.map((p) =>
                p.UserId !== this.userId ? p : { ...p, disabled: true }
              )
            })
            let patchScheduleData = {};
            let startDate = new Date(res.ScheduleActivity?.DateStartUTC)
            let local_startDate = this.commonserviceService.getTimeAndpatchInDate(startDate, res.ScheduleActivity?.TimeStart);
            let endDate = new Date(res.ScheduleActivity?.DateEndUTC)
            let local_endDate = this.commonserviceService.getTimeAndpatchInDate(endDate, res.ScheduleActivity?.TimeEnd);
            patchScheduleData['DateEnd'] = local_endDate;
            patchScheduleData['DateEndUTC'] = res.ScheduleActivity?.DateEndUTC;
            patchScheduleData['DateStart'] = local_startDate;
            patchScheduleData['DateStartUTC'] = res.ScheduleActivity?.DateStartUTC;
            patchScheduleData['TimeEnd'] = res.ScheduleActivity?.TimeEnd;
            patchScheduleData['TimeStart'] = res.ScheduleActivity?.TimeStart;
            patchScheduleData['TimeZone'] = res.ScheduleActivity?.TimeZone;
            this.utctimezonName = res.ScheduleActivity?.TimeZone;
            this.scheduleData = patchScheduleData;
            this.scheduleTimeData = patchScheduleData;
            this.patchScheduleData(this.scheduleData);
            const startdatetime = new Date(startDate);
            let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
            this.slotStartDate = startDate;
            this.slotsStartDate = this.slotStartDate;
            this.myActivityForm.patchValue({
              'slotDate': slotDate
            })
            this.getAvaiableTimeslots('');
            setTimeout(() => {
              this.loading = false;
            }, 2000);
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
    @Name: openImageUpload function
    @Who: Adarsh singh
    @When: 24-July-2023
    @Why: EWM-13233
    @What: open modal for set image in kendo editor
  */
  openImageUpload(): void {
    const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
      data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
      panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      width: '100%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.loading = true;
        if (res.event === 1) {
          this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
            this.editor.exec('insertImage', res);
            this.loading = false;
          })
        }
        else {
          this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
            this.editor.exec('insertImage', res);
            this.loading = false;
          })
        }
      }
    })
  }
  getCanLastUpcomingActivity() {
    this._SystemSettingService.getCanLastUpcomingActivity('?candidateId=' + this.requiredAttendeesList[0]?.Id).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.getLastUpcomingActivityDetails = data.Data;
          this.isLastUpcomingActivity = true;
        } else {
          this.getLastUpcomingActivityDetails = null;
          this.isLastUpcomingActivity = false;
        }
      }, err => {
        this.isLastUpcomingActivity = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }



  ngOnDestroy(){
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  
  
   /*
  @Type: File, <ts>
  @Name: onToggleDateAndTime function
  @Who: Adarsh singh
  @When: 26-Aug-2023
  @Why: EWM-13711-EWM-13884
  @What: for toggle date and time section
  */
  
  onToggleDateAndTime(): void {
    let x = document.getElementById('DateAndTime') as HTMLElement | null;
    let y = document.getElementById('fadeButton') as HTMLElement | null;
    x.classList.toggle('showDateAndTime')
    if (x?.classList.contains('showDateAndTime')) {
      x.classList.remove("out");
      x.classList.add("active");
      x.style.display = 'block';
      y.classList.add('btnActive');
      this.dateAndTimeToggle = true;
    }
    else {
      x.classList.add("out");
      x.classList.remove("active");
      x.style.display = 'none';
      y.classList.remove('btnActive');
      this.dateAndTimeToggle = false;
    }
  }
  /*
  @Type: File, <ts>
  @Name: onShowMoreFiled function
  @Who: Adarsh singh
  @When: 26-Aug-2023
  @Why: EWM-13711-EWM-13884
  @What: for toggle show more filed setion
  */
  onShowMoreFiled() {
    let x = document.getElementById('showMoreFiled') as HTMLElement | null;
    x.classList.toggle('showMoreFileds')
    if (x?.classList.contains('showMoreFileds')) {
      x.classList.remove("out");
      x.classList.add("active");
      x.style.display = 'block';
      this.isShowMoreHideMore = true;
    }
    else {
      x.classList.add("out");
      x.classList.remove("active");
      x.style.display = 'none';
      this.isShowMoreHideMore = false;
    }
  }
  /*
  @Type: File, <ts>
  @Name: dropdownConfig function
  @Who: Adarsh singh
  @When: 23-Nov-2023
  @Why: EWM-15147 
  @What: for initialize form
  */
    dropdownConfig(){
      this.common_DropdownC_Config = {
        API: this.serviceListClass.getAllJobForActivityV2,
        MANAGE: './client/emp/employees/employee-list',
        BINDBY: 'Name',
        REQUIRED: true,
        DISABLED: false,
        PLACEHOLDER: 'label_relatedUser',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        IMG_SHOW: false,
        EXTRA_BIND_VALUE: '',
        IMG_BIND_VALUE:'ProfileImage',
        FIND_BY_INDEX: 'Id'
      }
  
      this.timeZone_Config = {
        LIST_ARRAY_DATA: this.timezoneArrList,
        MANAGE: '',
        BINDBY: 'Timezone',
        REQUIRED: true,
        DISABLED: false,
        PLACEHOLDER: 'label_timeZone',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        EXTRA_BIND_VALUE: ''
      }
    }

    isNoRecordCategory: boolean = false;
    getActivityTypeCategory(activityFor) {
      this._SystemSettingService.getAllActivityListCategory("?search=" + activityFor).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
            //  this.loading = false;
            this.ActivityTypeList = repsonsedata.Data;
            if (this.ActivityTypeList == undefined || this.ActivityTypeList == null || this.ActivityTypeList.length == 0) {
              this.isNoRecordCategory = true;
            } else {
              this.isNoRecordCategory = false;
            }
  
          } else {
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
  
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
        })
    }

      /*
    @Type: File, <ts>
    @Name: checkRelatedType
    @Who: Adarsh Singh
    @When: 21-Nov-2023
    @Why:EWM-15147
    */
    resetRelattedUserDrp: Subject<any> = new Subject<any>();

    checkRelatedType(activityFor) {
      switch (activityFor) {
        case "JOB": {
          // v2 dropdown Adarsh Singh
          this.common_DropdownC_Config.API = this.serviceListClass.getAllJobForActivityV2;
          this.common_DropdownC_Config.MANAGE = './client/core/job/landing';
          this.common_DropdownC_Config.SHORTNAME_SHOW = false;
          this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
          // End 
          break;
        }
        case "CAND": {
          // v2 dropdown Adarsh Singh
          this.common_DropdownC_Config.API = this.serviceListClass.getAllCandidateForActivity_v2;
          this.common_DropdownC_Config.MANAGE = './client/cand/candidate/candidate-list';
          this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
          // End 
          break;
        }
        case "EMPL": {
          // v2 dropdown Adarsh Singh
          this.common_DropdownC_Config.API = this.serviceListClass.getAllEmployeeForActivity_v2;
          this.common_DropdownC_Config.MANAGE = './client/emp/employees/employee-list';
          this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
          // End 
          break;
        }
        case "CLIE": {
          // v2 dropdown Adarsh Singh
          this.common_DropdownC_Config.API = this.serviceListClass.getAllClientForActivity;
          this.common_DropdownC_Config.MANAGE = './client/core/clients/client-dashboard';
          this.common_DropdownC_Config.SHORTNAME_SHOW = false;
          this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
          // End
          break;
        }
  
        default: {
          // v2 dropdown Adarsh Singh
          this.common_DropdownC_Config.API = '';
          this.common_DropdownC_Config.MANAGE = '';
          // End 
  
          break;
        }
      }
    }
}
