/*
  @Type: File, <ts>
  @Name: my-activity.component.ts
  @Who: Anup Singh
  @When: 07-jan-2022
  @Why:EWM-4467 EWM-4529
  @What:my activity
  */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, VERSION, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig } from '../../shared/datamodels';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { IntegrationsBoardService } from '../../shared/services/profile-info/integrations-board.service';
import { QuickJobService } from '../../shared/services/quickJob/quickJob.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { AddRequiredAttendeesComponent } from './add-required-attendees/add-required-attendees.component';
import { ScheduleAssistanceDatePopupComponent } from './schedule-assistance-date-popup/schedule-assistance-date-popup.component';
import { DatePipe } from '@angular/common';
import { TemplatesComponent } from '../../shared/quick-modal/new-email/templates/templates.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { EmailPreviewPopupComponent } from '../../system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { CustomValidatorService } from '../../../../shared/services/custome-validator/custom-validator.service';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoImageUploaderInfo } from 'src/app/shared/models/kendo-image-uploader';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { DRP_CONFIG, DRP_CONFIG_CLIENT_SIDE } from '@app/shared/models/common-dropdown';
import { CommonDropDownService } from '../../shared/services/common-dropdown-service/common-dropdown.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
 


@Component({
  selector: 'app-my-activity',
  templateUrl: './my-activity.component.html',
  styleUrls: ['./my-activity.component.scss']
})
export class MyActivityComponent implements OnInit, OnDestroy {

  myActivityForm: FormGroup;
  public loading: boolean = false
  @ViewChild('titleActivity') titleActivity: MatInput;
  public requiredAttendeesList: any[] = [];
  public optionalAttendeesList: any[] = [];
  public organizerOrAssigneesList: any = [];
  public timeAvaiableSlots: any = [];
  public removable = true;
  public oldPatchValues: any;
  public clientId: any;
  accessEmailId: any = [];

  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public selectedFiles: any;
  public fileBinary: File;
  public myfilename = '';
  public filePath: any;
  public previewUrl: any;
  public slotStartDate: any;
  public slotEndDate: any;
  public startTime: any;
  public endTime: any;
  documentTypeOptions: any;
  uploadedFileName: any;
  public selectedItem = [];
  resetFormSubjectRelatedUser: Subject<any> = new Subject<any>();
 
  public selectedRelatedUser: any = {};
  public ActivityTypeList: any[] = [];
  pagesize = 500;
  pageNo = 1;
  public activityForAttendees: string;
  public userId: string;
  public ActiveMenu: any;
  @Output() myActivityDrawerClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() activityActionForm: string; /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: new param added **/
  @Input() activityId: any;
  @Input() isSlotActive: boolean = false;
  @Input() slotsData: any;
  @Input() timePeriod: any;
  @Input() timezonName: any;
  @Input() utctimezonName: any;
  timeDisplayHour = 12;
  scheduleData: any = {};
  scheduleTimeData: any = {};
  public IsAttendeesReq: boolean = false;

  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  meetingPlatformList: any;
  meetingPlatformData: any;
  meetingPlatformName: any;
  MeetingId: string;
  MeetingUrl: string;
  meetingUrlData: string;
  CalendarExternalId: any;
  public selectedTimeslots: any;
  public dateFormat: any;
  public slotAdd: boolean;
  dirctionalLang;
  scheduleData24Hrs: {};
  /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10765 @What:make defualt access public **/
  AccessName: any;
  AccessId: any;
  selectedOrganizer = [];
  username: string;
  maxMoreLength: number = 2;
  public showCC: boolean = false;
  public showBCC: boolean = false;
  public filestatus: boolean = true;
  ModuleName: string;
  public ccEmailList = [];
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  @ViewChild('editor') editor: EditorComponent;
  public TimeStartValue: any;
  public TimeEndValue: any;
  public gridTimeZone: any[];
  distinctRegion = [];
  timezoneDetails = [];
  RegionName: string;
  TimeZoneName: string;
  isMinTimeCondotion: boolean = false;
  isDateEnd: boolean = true;
  EndDateMin: Date;
  currentStartDate: any = new Date();
  StartDateMin = new Date();
  readonly: boolean;
  filterData: any;
  getDateFormat: any;
  emailConnection: boolean = false;
  isRequiredAttendees: boolean = false;
  slotsStartDate: any;
  selectedCategory: any;
  selectedTemplateId: any;
  tabActive: any;
  tabActiveIndex: any;
  isEndTmeRequired: boolean = false;
  isStartTmeRequired: boolean = false;
 
  common_DropdownC_Config:DRP_CONFIG;
  isShowMoreHideMore:boolean = false;
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
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string;
  ownerList: string[]=[];
  public showErrorDesc: boolean = false;
  public tagList:any=['Jobs'];
  public basic:any=[];
  constructor(private fb: FormBuilder, public dialog: MatDialog, private appSettingsService: AppSettingsService, private datePipe: DatePipe,
    private http: HttpClient, private snackBService: SnackBarService, public candidateService: CandidateService,
    private route: ActivatedRoute, private router: Router, public _sidebarService: SidebarService, private _profileInfoService: ProfileInfoService,
    private commonserviceService: CommonserviceService, public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService, private serviceListClass: ServiceListClass, private quickJobService: QuickJobService,
    private systemSettingService: SystemSettingService, public _integrationsBoardService: IntegrationsBoardService, private mailService: MailServiceService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,private renderer: Renderer2,  private cache: CacheServiceService,
    private dataService: CommonDropDownService) {
    /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10765 @What:make defualt access public **/
    this.AccessId = this.appSettingsService.getDefaultAccessId;
    this.AccessName = this.appSettingsService.getDefaultaccessName;

    this.myActivityForm = this.fb.group({
      Id: [null],
      slotDate: [null, [Validators.required, CustomValidatorService.dateValidator]],
      timePeriod: ['60', Validators.required],  /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10648 EWM-10761 @What:Time Interval should be an hour different instead of 30 mins **/
      ActivityTitle: ['', [Validators.required, Validators.maxLength(500)]],/** @When: 30-11-2023 @Who:maneesh for increes charecter length @Why: Ewm-15173 */
      RelatedUserType: ['EMPL', [Validators.required]],      /**@When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11090 @What: Activity related to set to employee and iths realted changes */
      RelatedUserTypeName: ['Employee'],      /**@When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11090 @What: Activity related to set to employee and iths realted changes */
      RelatedUserId: [null, [Validators.required]],
      RelatedUserUserName: [''],
      CategoryId: [null],  /**@When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11092 @What: required removed */
      CategoryName: [''],  /**@When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11092 @What: required removed */
      ScheduleActivity: [null, [Validators.required]],
      Location: ['', [Validators.maxLength(300)]],
      AddRequiredAttendees: [null], /** @When: 01-03-2023 @Who:Renu @Why: EWM-10768 EWM-10648 @What: This will also be OPTIONAL Field for a user to create their activity and tasks */
      OrganizerOrAssignees: [],
      ActivityUrl: ['', [Validators.maxLength(2048)]],
      AccessName: [this.AccessName, [Validators.required]],   /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10765 @What:make defualt access public **/
      AccessId: [this.AccessId],  /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10765 @What:make defualt access public **/
      Description: ['', [Validators.minLength(2)]],
      file: [''],
      MeetingPlatform: [],
      TimeZone: ['', [Validators.required]], /*** @When: 17-03-2023 @Who:Renu @Why: EWM-11055 EWM-11093 @What: new schedule implementation **/
      DateStart: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeStart: [null, [Validators.required]],
      DateEnd: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeEnd: [null, [Validators.required]],
      IsSendEmailToAttendees: [true],
      IsSendCalendarInviteToAttendees: [true],
      LoggedInUserName: [''],
      TimeZoneID:['']
    });
    this.getActivityTypeCategory('Employee');

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
    this.dateFormat = localStorage.getItem('DateFormat');
  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;

    let URL = this.router.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.timezoneArrList = JSON.parse(localStorage.getItem('TimeZoneList'))

    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserDetails = currentUser;
    this.userId = currentUser?.UserId;
    this.dropdownConfig();
    this.checkEmailConnection();
    this.getMeetingPlatformList();
    this.getAllInviteUser();
    if (this.slotsData != undefined) {
      this.slotStartDate = (this.slotsData?.DateStartUTC) ? (this.slotsData?.DateStartUTC) : (this.slotsData?.start); /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: two param one from slot click and edit case **/
      //this.slotEndDate = (this.slotsData?.DateEndUTC)?(this.slotsData?.DateEndUTC):(this.slotsData?.end);      /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: two param one from slot click and edit case **/
      const startdatetime = new Date(this.slotStartDate);
      this.slotsStartDate = this.slotStartDate;
      // <!---@suika @EWM-11735 EWM-11745 @WHN 06-04-2023---->
      this.slotEndDate = new Date(startdatetime.getTime() + this.timePeriod * 60 * 1000);
      let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
      // let slotDates = this.datePipe?.transform(slotDate,this.dateFormat);
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
      //let slotDates = this.datePipe?.transform(slotDate,this.dateFormat);
      this.myActivityForm.patchValue({
        'slotDate': slotDate
       
      })
      this.slotAdd = true;
      this.getAvaiableTimeslots(this.slotStartDate);

    }

    if (this.activityActionForm == "Edit") {
      this.isSlotActive = true;
      setTimeout(() => {
        this.myActivityDataBy(this.activityId);
      }, 2000);

      //<!-----@suika @EWM-11866 @whn 13-04-2023 @why enable disable required attendees---->
      if (this.requiredAttendeesList?.length == 0 && this.optionalAttendeesList?.length == 0) {
        this.isRequiredAttendees = false;
        this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);
      } else {
        this.isRequiredAttendees = true;
        this.myActivityForm.get('IsSendEmailToAttendees').setValue(1);
      }
    }


    /**@When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11090 @What: Activity related to set to employee and iths related changes */
    this.username = currentUser?.FirstName + ' ' + currentUser?.LastName;
    if (this.activityActionForm != "Edit") {
      this.selectedRelatedUser = { 'Id': this.userId, 'Name': this.username, 'Email': currentUser?.EmailId }
      this.onRelatedUserchange(this.selectedRelatedUser);
      // this.dataService.setSelectedData(this.selectedRelatedUser);
    }  
    /*** @When: 17-03-2023 @Who:Nitin Bhati @Why: EWM-11055 EWM-11104 @What:For Job tab **/
    this.getInsertPlaceholderByType('Jobs');
    /**  @When: 17-03-2023 @Who:Renu @Why: EWM-11055 EWM-11093 @What: new schedule implementation ***/
    // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10688 EWM-10940 Desc-for setting default time value --------
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    this.TimeEndValue = nowTime;
    // end 
    this.getAllRegion();
    this.getUserEmailSettingInfo();
  }

  /*
  @Type: File, <ts>
  @Name: ngAfterViewInit
  @Who: Anup Singh
  @When: 07-jan-2022
  @Why:EWM-4467 EWM-4529
  @What: For Focus
  */
  // @When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11090 @What: focus removed
  //  ngAfterViewInit() {
  //    setTimeout(() => {
  //      this.titleActivity.focus();
  //    }, 1000);

  //  }

  /*
    @Type: File, <ts>
    @Name: onChangeActivityRelatedTo
    @Who: Anup Singh
    @When: 07-jan-2022
    @Why:EWM-4467 EWM-4529
    @What: 
    */
    onChangeActivityRelatedTo(activityFor) {
      this.selectedRelatedUser = null;
      this.empCandArr = [];
      this.jobContactsArr = [];
      this.requiredAttendeesList = [...this.onlyAttendiesPopArr, ...this.empCandArr, ...this.jobContactsArr];
      
      this.myActivityForm.patchValue({
        RelatedUserUserName: '',
        CategoryId: '',
        CategoryName: '',
        AddRequiredAttendees: this.requiredAttendeesList
      })
      let fValue = this.myActivityForm.value;
      this.myActivityForm.patchValue({
        ActivityTitle: fValue.CategoryName ? (fValue.CategoryName + ' - ') : '' + fValue.RelatedUserUserName
      })
      this.activityForAttendees = activityFor;
      if (activityFor == "JOB") {
        this.myActivityForm.patchValue({
          'RelatedUserTypeName': 'Job'
        })
        this.getActivityTypeCategory(activityFor);
      } else if (activityFor == "CAND") {
        this.myActivityForm.patchValue({
          'RelatedUserTypeName': 'Candidate'
        })
        this.getActivityTypeCategory(activityFor);  
      } else if (activityFor == "EMPL") {
        this.myActivityForm.patchValue({
          'RelatedUserTypeName': 'Employee'
        })
        this.getActivityTypeCategory(activityFor);  
      } else if (activityFor == "CLIE") {
        this.myActivityForm.patchValue({
          'RelatedUserTypeName': 'Client'
        })
        this.getActivityTypeCategory(activityFor);
      } else {
        this.myActivityForm.patchValue({
          'RelatedUserTypeName': '',
          'CategoryId': null
        })
        this.ActivityTypeList = [];
      }
      this.selectedRelatedUser = null;
      this.myActivityForm.patchValue(
        {
          RelatedUserId: null,
          RelatedUserUserName: '',
        });
      this.myActivityForm.get("RelatedUserId").setErrors({ required: true });
      this.myActivityForm.get("RelatedUserId").markAsTouched();
      this.myActivityForm.get("RelatedUserId").markAsDirty();
      this.requiredAttendeesList = [];
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
        this.common_DropdownC_Config.API = this.serviceListClass.getAllClientLeadList;
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


  /*
    @Type: File, <ts>
    @Name: onRelatedUserchange
    @Who: Anup Singh
    @When: 11-jan-2022
    @Why:EWM-4467 EWM-4530
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
        this.requiredAttendeesList = [];
      }
      else {
        this.myActivityForm.get("RelatedUserId").clearValidators();
        this.myActivityForm.get("RelatedUserId").markAsPristine();
        this.selectedRelatedUser = data;
        this.myActivityForm.patchValue({
          RelatedUserId: data?.Id,
          RelatedUserUserName: data?.Name
        })
        if (this.myActivityForm.value.RelatedUserTypeName === 'Job') {
          if (data?.CompanyContactList?.length>0) {
            this.jobContactsArr = [];
            data?.CompanyContactList?.forEach(element => {
              this.jobContactsArr.push({
                'Id': element?.ContactId,
                'Name': element?.Name,
                'Type': 'Contacts',
                'Email': element?.Email
                })
            });
          }
          else{
            if (this.jobContactsArr?.length == 0) {
              this.jobContactsArr = [];
            }
          }
        }
        else{
          this.empCandArr = [];
          this.jobContactsArr = [];
          this.empCandArr.push({
            'Id': data?.Id,
            'Name': data?.Name,
            'Email': data?.Email,
            'Type': this.activityForAttendees
          })
        }
  
        this.requiredAttendeesList = [...this.onlyAttendiesPopArr, ...this.empCandArr, ...this.jobContactsArr]
      }
  
      
      let fValue = this.myActivityForm.value;
      this.myActivityForm.patchValue({
        ActivityTitle: (fValue.CategoryName ? (fValue.CategoryName + ' - ') : '') + (fValue.RelatedUserUserName)
      })
  
     
  
      this.myActivityForm.patchValue({
        'AddRequiredAttendees': this.requiredAttendeesList
      })
  
     
    }

  /*
    @Type: File, <ts>
    @Name: getActivityTypeCategory
    @Who: Anup Singh
    @When: 11-jan-2022
    @Why:EWM-4467 EWM-4530
    @What: get data category when selcet activity related to
    */
  isNoRecordCategory: boolean = false;
  getActivityTypeCategory(activityFor) {
    this.systemSettingService.getAllActivityListCategory("?search=" + activityFor).subscribe(
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
    @Name: onchangeCategory
    @Who: Anup Singh
    @When: 19-jan-2022
    @Why:EWM-4478 EWM-4715
    @What: patch data when category select
    */

  onchangeCategory(category) {
   if(this.selectedCategory==category?.Id){
    this.myActivityForm.patchValue({
      CategoryId:'',
      CategoryName:'',
     ActivityTitle: this.myActivityForm.value.RelatedUserUserName
    })
    this.selectedCategory = '';
   }else{
    this.selectedCategory = category?.Id;
    this.myActivityForm.patchValue({
      CategoryId: category?.Id,
      CategoryName: category?.ActivityCategory,
     ActivityTitle: `${category?.ActivityCategory} ${this.myActivityForm.value.RelatedUserUserName ? '-' +this.myActivityForm.value.RelatedUserUserName : this.myActivityForm.value.RelatedUserUserName}`
    })
   }  
  }
  /*
   @Type: File, <ts>
   @Name: openModelForSchedule
   @Who: Anup Singh
   @When: 07-jan-2022
   @Why:EWM-4467 EWM-4529
   @What: open Modal for schedule
   */


  //  openModelForSchedule() {  
  //    const dialogRef = this.dialog.open(ScheduleComponent, {
  //      data: new Object({ scheduleData: this.scheduleData24Hrs, activityActionForm:this.activityActionForm  }),
  //      panelClass: ['xeople-modal', 'AddSchedule', 'animate__animated', 'animate__zoomIn'],
  //      disableClose: true,
  //    });
  //    dialogRef.afterClosed().subscribe((res) => {
  //      if (res.isSchedule == true) {
  //        this.scheduleData = res.scheduleData;
  //        this.scheduleTimeData = res.scheduleData;
  //        this.myActivityForm.patchValue({
  //          ScheduleActivity: this.scheduleData,
  //        })
  //      }
  //       // else {    
  //       //  this.myActivityForm.patchValue({
  //       //   ScheduleActivity:null,
  //       //  })
  //       // }
  //    })
  //  }


  /*
  @Type: File, <ts>
  @Name: openModelAddRequiredAttendees
  @Who: Anup Singh
  @When: 07-jan-2022
  @Why:EWM-4467 EWM-4529
  @What: open Modal for AddRequiredAttendees
  */
  openModelAddRequiredAttendees(popUpType: string) {
    const dialogRef = this.dialog.open(AddRequiredAttendeesComponent, {
      data: new Object({
        requiredAttendeesList: (popUpType == 'optionalAttendees' ? this.optionalAttendeesList : this.requiredAttendeesList), activityForAttendees:
          this.activityForAttendees, clientIdData: this.selectedRelatedUser.Id, popUpType: popUpType
      }),
      panelClass: ['xeople-modal', 'quick-modalbox', 'AddRequiredAttendees', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (popUpType == 'optionalAttendees') {
          this.optionalAttendeesList = res;
          this.myActivityForm.patchValue({
            'AddRequiredAttendees': this.optionalAttendeesList
          })
        } else {
          this.attendiesPopArr = res;
          this.requiredAttendeesList  = [ ...this.attendiesPopArr];
          this.onlyAttendiesPopArr = this.requiredAttendeesList.filter(e=> e?.Id !== this.selectedRelatedUser?.Id && e?.Type != 'Contacts');
          this.myActivityForm.patchValue({
            'AddRequiredAttendees': this.requiredAttendeesList
          })
        }
        if (this.attendiesPopArr?.length == 0 && this.optionalAttendeesList?.length == 0) {
          this.isRequiredAttendees = false;
          this.myActivityForm.get('IsSendEmailToAttendees').patchValue(0);
        } else {
          this.isRequiredAttendees = true;
          this.myActivityForm.get('IsSendEmailToAttendees').patchValue(1);
        }
      }
      else {
        this.myActivityForm.patchValue({
          AddRequiredAttendees: null,
        })
        this.isRequiredAttendees = false;
        this.myActivityForm.get('IsSendEmailToAttendees').patchValue(0);
      }
    })



  }

  /*
    @Type: File, <ts>
    @Name: getAllInviteUser
    @Who: Anup Singh
    @When: 11-jan-2022
    @Why:EWM-4467 EWM-4530
    @What: get All Invite User
    */
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
   @Who: Anup Singh
   @When: 07-jan-2022
   @Why:EWM-4467 EWM-4529
   @What: open Modal for OrganizerOrAssignees
   */
  /*** @When: 12-03-2023 @Who:Renu @Why: EWM-11055 EWM-11088 @What: popup open remvoed **/

  //  openModelOrganizerOrAssignees() {
  //    const dialogRef = this.dialog.open(OrganizerOrAssineesComponent, {
  //      data: new Object({ organizerOrAssigneesList: this.organizerOrAssigneesList, userId: this.userId }),
  //      panelClass: ['xeople-modal', 'AddOrganizerOrAssinees', 'animate__animated', 'animate__zoomIn'],
  //      disableClose: true,
  //    });
  //    dialogRef.afterClosed().subscribe((res) => {
  //      if (res) {
  //        this.organizerOrAssigneesList = res;
  //      }
  //      else {
  //        // this.loading = false;
  //      }
  //    })
  //  }


  /*
  @Type: File, <ts>
  @Name: remove
  @Who: Anup singh
  @When: 07-jan-2022
  @Why:EWM-4467 EWM-4529
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {
    if (type == 'addRequiredAttendees') {
      const index = this.requiredAttendeesList.indexOf(items);
      if (index >= 0) {
        this.requiredAttendeesList.splice(index, 1);
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
      this.myActivityForm.get('IsSendEmailToAttendees').patchValue(0);
    } else {
      this.isRequiredAttendees = true;
      this.myActivityForm.get('IsSendEmailToAttendees').patchValue(1);
    }
  }


  /*
   @Type: File, <ts>
   @Name: openManageAccessModal
   @Who:Anup
   @When: 07-jan-2022
   @Why:EWM-4467 EWM-4529
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
        // let mode: number;
        // if (this.formHeading == 'Add') {
        //   mode = 0;
        // } else {
        //   mode = 1;
        // }
        res.ToEmailIds.forEach(element => {
          this.accessEmailId.push({
            'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': 0
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
    @Name: onDismiss
    @Who: Anup Singh
    @When: 11-jan-2022
    @Why:EWM-4467 EWM-4530
    @What: drawer close
    */
  onDismiss() {
    localStorage.removeItem('selectEmailTemp');
    this.myActivityDrawerClose.emit({ 'isDrawerClose': true, 'isSubmit': false });
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
 @Name: saveActivity
 @Who: Anup Singh
 @When: 11-jan-2022
 @Why:EWM-4467 EWM-4530
 @What: data create for my activity
 */
  saveActivity(value) {

    this.scheduleInfo(value);
    // @suika @remove files element with not Path key @whn 21-03-2023
    let files = [];
    this.fileAttachments.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    let myActivityJson = {};
    // <!---------@When: 03-April-2023 @who:Adarsh singh @why: EWM-11672 --------->
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
          Type: element?.Type ? element?.Type : 'EMPL'
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
          Type: element?.Type
        })
      }
    })
    this.scheduleTimeData.TimeZoneID = value.TimeZoneID;
    myActivityJson["ActivityTitle"] = value.ActivityTitle;
    myActivityJson["RelatedUserType"] = value.RelatedUserType;
    myActivityJson["RelatedUserTypeName"] = value.RelatedUserTypeName;
    myActivityJson["RelatedUserId"] = this.selectedRelatedUser?.Id //value.RelatedUserId;
    myActivityJson["RelatedUserUserName"] = this.selectedRelatedUser?.Name //value.RelatedUserUserName;
    myActivityJson["CategoryId"] = value.CategoryId ? value.CategoryId : 0; /*** @When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11092 @What: category id required remove **/
    myActivityJson["CategoryName"] = value.CategoryName;
    myActivityJson["ScheduleActivity"] = this.scheduleTimeData;
    myActivityJson["Location"] = value.Location;
    /********@When: 17-03-2023 @Who:Renu @Why: EWM-11055 EWM-11095 @What:  optional attendees handling********/
    myActivityJson["OptionalAttendeesList"] = optionalAttendeesListArr
    myActivityJson["AttendeesList"] = requiredAttendeesList;
    myActivityJson["OrganizersList"] = value.OrganizerOrAssignees;
    myActivityJson["ActivityUrl"] = value.ActivityUrl;
    myActivityJson["AccessId"] = value.AccessId;
    myActivityJson["AccessName"] = value.AccessName;
    myActivityJson["Description"] = value.Description;
    myActivityJson["GrantAccesList"] = this.accessEmailId;
    myActivityJson['IsAttachment'] = this.fileAttachments.length > 0 ? 1 : 0;
    myActivityJson['Files'] = files;
    myActivityJson['ActivityCoreUrl'] = window.location.href;
    myActivityJson["MeetingPlatformId"] = value.MeetingPlatform ? value.MeetingPlatform : '00000000-0000-0000-0000-000000000000';
    myActivityJson["MeetingPlatform"] = this.meetingPlatformName;
    myActivityJson["MeetingId"] = this.MeetingId;
    myActivityJson["IsSendCalendarInviteToAttendees"] = value.IsSendCalendarInviteToAttendees ? 1 : 0;
    myActivityJson["IsSendEmailToAttendees"] = value.IsSendEmailToAttendees ? 1 : 0
    myActivityJson["ReplaceTag"] = ReplaceTagArr;

    this.loading = true;
    this.systemSettingService.AddMyActivity(myActivityJson)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.myActivityForm.reset();
            this.selectedRelatedUser = {};
            this.scheduleData = {};
            this.scheduleTimeData = {};
            this.requiredAttendeesList = [];
            this.optionalAttendeesList = [];
            this.accessEmailId = [];
            this.myActivityDrawerClose.emit({ 'isDrawerClose': true, 'isSubmit': true });
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
  @Name: myActivityDataBy function
  @Who: Anup Singh
  @When: 18-jan-2022
  @Why:EWM-4465 EWM-4661
  @What: getting my activity data based on specific Id
 */
  myActivityDataBy(Id: any) {
    this.StartDateMin = null;
    this.loading = true;
    this.systemSettingService.getMyActivityById('?id=' + Id)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
             
            this.oldPatchValues = data.Data;
            this.accessEmailId = this.oldPatchValues?.GrantAccesList;
            let res = data.Data;
            this.onChangeActivityRelatedTo(res.RelatedUserType);
            this.selectedRelatedUser = { 'Id': res.RelatedUserId, 'Name': res.RelatedUserUserName }
            // this.dataService.setSelectedData(this.selectedRelatedUser);
            let TemplateText = res.Description;
            this.selectedCategory = res.CategoryId;            
            this.getEditorVal=res.Description;
            this.myActivityForm.patchValue({
              'CategoryId':res?.CategoryId,
              'ActivityTitle': res.ActivityTitle,
              'RelatedUserType': res.RelatedUserType,
              'RelatedUserTypeName': res.RelatedUserTypeName,
              'RelatedUserId': res.RelatedUserId,
              'RelatedUserUserName': res.RelatedUserUserName,
              'ScheduleActivity': res.ScheduleActivity,
              //'AddRequiredAttendees': res.AttendeesList,
              'Location': res.Location,
              'ActivityUrl': res.ActivityUrl,
              'Description':TemplateText,
              'AccessId': res.AccessId,
              //  <!-- who:bantee,what:ewm-11717 ,When:13/04/2023 -->

              'MeetingPlatform': res.MeetingPlatformId == '00000000-0000-0000-0000-000000000000' ? null : res.MeetingPlatformId,
              //'file':res.AttachmentName
              'IsSendCalendarInviteToAttendees': res.IsSendCalendarInviteToAttendees == 1 ? true : false,
              'IsSendEmailToAttendees': res.IsSendEmailToAttendees == 1 ? true : false,
              'TimeZoneID':res?.ScheduleActivity?.TimeZoneID,
              'Id':Id
            });
            
            if (res.MeetingPlatformId == '00000000-0000-0000-0000-000000000000') {
              this.readonly = null;
            } else {
              this.readonly = true;
            }

            this.CalendarExternalId = res.CalendarExternalId;
            //this.myActivityForm.controls["MeetingPlatform"].disable();/*** @When: 01-03-2023 @Who:Renu @Why: EWM-10648 EWM-10766 @What:meeting platform not be disabled **/
            this.meetingPlatformName = res.MeetingPlatform;
            this.MeetingId = res.MeetingId;
            //this.myActivityForm.controls["ActivityUrl"].disable(); /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10648 EWM-10766 @What:activity url should not be disabled **/
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

                //let oldAttendeesListValues = res.AttendeesList;
                //  oldAttendeesListValues.forEach(element => {
                //    this.requiredAttendeesList.push({
                //      Id: element.Id,
                //      Name: element.Name,
                //      Email: element.Email,
                //      Mode: element.Mode,
                //      MappingId: element.MappingId,
                //    })
                //  });
              }

            }
            if (res.OptionalAttendeesList != '') {
              this.optionalAttendeesList = res.OptionalAttendeesList;
            }
            //<!-----@suika @EWM-11866 @whn 13-04-2023 @why enable disable required attendees---->
            if (this.requiredAttendeesList?.length == 0 && this.optionalAttendeesList?.length == 0) {
              this.isRequiredAttendees = false;
              this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);
            } else {
              this.isRequiredAttendees = true;
              this.myActivityForm.get('IsSendEmailToAttendees').setValue(1);

            }

            /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10768 EWM-10648 @What:  This will also be OPTIONAL Field for a user to create their activity and tasks **/

            //  if (this.requiredAttendeesList.length == 0) {
            //    this.IsAttendeesReq = true;
            //  } else {
            //    this.IsAttendeesReq = false;
            //  }

            //  this.organizerOrAssigneesList = [];
            //  if (res.OrganizersList != '') {
            //    if (res.OrganizersList.length > 0) {
            //      let oldOrganizersListValues = res.OrganizersList;
            //      oldOrganizersListValues.forEach(element => {
            //        this.organizerOrAssigneesList.push({
            //          Id: element.Id,
            //          Mode: element.Mode,
            //          Email: element.Email,
            //          UserName: element.UserName,
            //          UserId: element.UserId
            //        })
            //      });
            //    }
            //  }
            /***@When: 15-03-2023 @Who:Renu @Why: EWM-11055 EWM-11088 @What: conversion dropdown **/
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
            // this.uploadedFileName = res.AttachmentName; DateStartUTC
            // this.scheduleData = res.ScheduleActivity;
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

            this.selecteTimezone = {Timezone: res.ScheduleActivity?.TimeZone};
            this.scheduleData = patchScheduleData;
            this.scheduleTimeData = patchScheduleData;
            this.patchScheduleData(this.scheduleData);  /*** @When: 17-03-2023 @Who:Renu @Why: EWM-11055 EWM-11093 @What: schdule data patching**/
            const startdatetime = new Date(startDate);
            let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
            this.slotStartDate = startDate;
            this.slotsStartDate = this.slotStartDate;   // @suika @EWM-12408 @date changes time remains same
            // <!---------@When: 28-03-2023 @who:Bantee @why: EWM-11238 --------->

            // let slotDates = this.datePipe?.transform(slotDate,this.dateFormat);
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
   @Name: updateActivity function
   @Who: Anup Singh
   @When: 18-jan-2022
   @Why:EWM-4465 EWM-4661
   @What: on update the data client Activity
 */
  updateActivity(value) {
    this.scheduleInfo(value);
    // @suika @remove files element with not Path key @whn 21-03-2023
    let files = [];
    this.fileAttachments.forEach(element => {
      if (element.hasOwnProperty('Path')) {
        files.push(element);
      }
    });
    this.loading = true;
    let updateActivityJson = {};
    // <!---------@When: 03-April-2023 @who:Adarsh singh @why: EWM-11672 --------->
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
          MappingId: element?.MappingId,
          Mode: element?.Mode,
          Type: element?.Type
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
          MappingId: element?.MappingId,
          Mode: element?.Mode,
          Type: element?.Type
        })
      }
    })

    this.scheduleTimeData.TimeZoneID =  value.TimeZoneID;
    updateActivityJson["Id"] = value.Id;
    updateActivityJson["ActivityTitle"] = value.ActivityTitle;
    updateActivityJson["RelatedUserType"] = value.RelatedUserType;//value.RelatedUserType;
    updateActivityJson["RelatedUserTypeName"] = value.RelatedUserTypeName;//value.RelatedUserType;

    updateActivityJson["RelatedUserId"] = this.selectedRelatedUser?.Id//value.RelatedUserId ;
    updateActivityJson["RelatedUserUserName"] = this.selectedRelatedUser?.Name;//value.RelatedUserId ;
    updateActivityJson["CategoryId"] = value.CategoryId ? value.CategoryId : 0; /*** @When: 16-03-2023 @Who:Renu @Why: EWM-11055 EWM-11092 @What: category id required remove **/
    updateActivityJson["CategoryName"] = value.CategoryName;
    updateActivityJson["ScheduleActivity"] = this.scheduleTimeData;
    updateActivityJson["Location"] = value.Location;
    /********@When: 17-03-2023 @Who:Renu @Why: EWM-11055 EWM-11095 @What:  optional attendees handling********/
    updateActivityJson["OptionalAttendeesList"] = optionalAttendeesListArr;
    updateActivityJson["AttendeesList"] = requiredAttendeesList;
    updateActivityJson["OrganizersList"] = value.OrganizerOrAssignees;
    updateActivityJson["ActivityUrl"] = value.ActivityUrl;
    updateActivityJson["AccessId"] = value.AccessId;
    updateActivityJson["AccessName"] = value.AccessName;
    updateActivityJson["Description"] = value.Description;
    updateActivityJson["GrantAccesList"] = this.accessEmailId;
    updateActivityJson['IsAttachment'] = this.fileAttachments.length > 0 ? 1 : 0;
    updateActivityJson['Files'] = files;
    updateActivityJson["MeetingId"] = this.MeetingId;
    // updateActivityJson['Attachment'] = this.filePath;
    // updateActivityJson['AttachmentName'] = this.uploadedFileName;
    updateActivityJson['ActivityCoreUrl'] = window.location.href;
    updateActivityJson["MeetingPlatformId"] = value.MeetingPlatform ? value.MeetingPlatform : '00000000-0000-0000-0000-000000000000';
    updateActivityJson["MeetingPlatform"] = this.meetingPlatformName;
    updateActivityJson["CalendarExternalId"] = this.CalendarExternalId;
    updateActivityJson["IsSendCalendarInviteToAttendees"] = value.IsSendCalendarInviteToAttendees ? 1 : 0;
    updateActivityJson["IsSendEmailToAttendees"] = value.IsSendEmailToAttendees ? 1 : 0;
    updateActivityJson["ReplaceTag"] = ReplaceTagArr;

    this.systemSettingService.EditMyActivityById(updateActivityJson)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.myActivityForm.reset();
            this.selectedRelatedUser = {};
            this.scheduleData = {};
            this.scheduleTimeData = {};
            this.requiredAttendeesList = [];
            this.optionalAttendeesList = [];
            this.accessEmailId = [];
            this.myActivityDrawerClose.emit({ 'isDrawerClose': true, 'isSubmit': true });

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
   @Name: onConfirm function
   @Who: Anup Singh
   @When: 18-jan-2022
   @Why:EWM-4465 EWM-4661
   @What: for add and edit
 */
  onConfirm(value) {
    localStorage.removeItem('selectEmailTemp');
    if (this.activityActionForm == "Edit") {
      this.updateActivity(value)
    } else {
      this.saveActivity(value)
    }
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
      //  maxWidth: "480px",
      data: new Object({
        fileType: this.fileType, fileSize: this.fileSize, fileSizetoShow: this.fileSizetoShow,
        fileAttachments: this.fileAttachments
      }),
      //  width: "85%",
      //  maxHeight: "85%",
      panelClass: ['xeople-modal', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isFile == true) {
        this.fileAttachments = [];
        this.fileAttachments = res.fileAttachments;
        if (this.fileAttachments.length > 2) {
          this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
        } else {
          this.fileAttachmentsOnlyTow = this.fileAttachments;
        }
      }
    })
    /* @When: 02-03-2023 @who:Amit @why: EWM-10801 @what: multiple attachment modal RTL work start here */
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    /* @When: 02-03-2023 @who:Amit @why: EWM-10801 @what: multiple attachment modal RTL work end here */
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

  getTimeSlot(timeslots, i, slotAdd) {
    //<!-----@suika @EWM-11866 @whn 13-04-2023 @why enable disable required attendees---->
    this.myActivityForm.get('MeetingPlatform').setValue(null);
    this.onRemoveMeetingChange();
    this.readonly = null;
    this.slotAdd = slotAdd;
    // @suika @whn 14-06-2023 @EWM-12434 @EWM-12729
  /*  if (timeslots.IsAvailable === 0) {
      return;
    }*/
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

      //  let start_time = moment.utc(d).tz(this.timezonName).format("hh:mm");  
      /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What:round off time to nearest quater in gap of 30min **/
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
      /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What:round off time to nearest quater in gap of 30min **/
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
    scheduleFormData['TimeZone'] = this.utctimezonName;//'(UTC+03:00) East Africa Time/ Mayotte';//value.TimeZone.Timezone;
    //let local_startDate = moment.utc(value.DateStart).local().format('YYYY-MM-DD');
    /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What:round off time to nearest quater in gap of 30 min **/
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), startTime);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = startTime;
    // let local_endDate = moment.utc(value.DateEnd).local().format('YYYY-MM-DD');
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate), endTime);
    scheduleFormData['DateEnd'] = local_endDate;
    const e = new Date(Number(timeslots.EndTime));
    if (i === 0 || i === null) {
      scheduleFormData['TimeEnd'] = this.timeAddMinutes(endTime, 60); /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: 1 hrs difference added **/
    } else {
      scheduleFormData['TimeEnd'] = endTime;
    }

    this.get24hrsFormatSchedule(d, e);
    this.scheduleData = scheduleFormData;
    this.myActivityForm.patchValue({
      ScheduleActivity: scheduleFormData,
      // DateStart: local_startDate,
      // TimeStart: startTime,
      // DateEnd: local_endDate,
      // TimeEnd: endTime,
    });


    //  let startT = scheduleFormData['TimeStart'].split(":");
    //  let endT= scheduleFormData['TimeEnd'].split(":");
    //  let getStrtTime = scheduleFormData['DateStart'].split('-');

    //  this.TimeStartValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], startT[0], startT[1], 0);
    //  this.TimeEndValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], endT[0], endT[1], 0);
    this.patchScheduleData(this.scheduleData24Hrs)
    this.getScheduleTimeData(timeslots, i);
    this.isStartTmeRequired = false;
    this.isEndTmeRequired = false;
  }

  /*
   @Type: File, <ts>
   @Name: timeAddMinutes
   @Who: Renu
   @When: 23-Jan-2022
   @Why:- EWM-9756 EWM-9759 
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
    @Who: Renu
    @When: 29-Sept-2022
    @Why:-
    @What: for conversion schedule popup patch in 2 hrs format
    */
  get24hrsFormatSchedule(startDate: any, enddate: any) {
    let scheduleFormData = {};
    let startTime: any;
    let endTime: any;
    /*** @When: 07-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: date format correction without using minute **/
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

  getScheduleTimeData(timeslots, index) {
    const d = new Date(Number(timeslots.StartTime));
    let startTime: any;
    let endTime: any;

    /*** @When: 07-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: date format correction without using minute **/
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
    //scheduleFormData['TimeEnd'] = endTime;
    this.scheduleTimeData = scheduleFormData;
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
    this.loading = true;
    const d = new Date(this.slotStartDate);
    let timeZone = this.utctimezonName?.substring(4, 10);
    let slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    let timeZoneValue = encodeURIComponent(timeZone);//this.codec.encodeValue(timeZone);
    this.quickJobService.getAvaiableTimeslots(slotDate, this.timePeriod, timeZoneValue).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.timeAvaiableSlots = repsonsedata.Data?.TimeSlots;
        this.loading = false;
          /*************************/
          if (startdatetime != '') {
            // adarsh singh For-EWM-14647 on 10-10-2023
            const enddatetime = new Date(this.slotEndDate);
            let starttime = startdatetime.getTime();
            const stime = new Date(Number(starttime));
            this.startTime = moment.utc(stime).tz(this.timezonName).format("hh:mm");
            let endtime = enddatetime.getTime();
            const etime = new Date(Number(endtime));
            this.endTime = moment.utc(etime).tz(this.timezonName).format("hh:mm");
            this.selectedTimeslots = { StartTime: starttime, EndTime: endtime };
            let index:number;
            // end 
            if (this.slotAdd == true) {
             index = this.timeAvaiableSlots.map((elm, idx) => ((elm.StartTime >= starttime && elm.StartTime <= endtime) ||
               (elm.EndTime >= starttime && elm.EndTime <= endtime)) ? idx : '').filter(String);
            } else {
              index = this.timeAvaiableSlots.findIndex((e: any) => e.StartTime == starttime);              
            }
            this.slotStartDate = startdatetime; // @suika @ewm-12408 @whn 12-05-2023
            this.getTimeSlot(this.selectedTimeslots, index, this.slotAdd);
          }
          /**************************/
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.timeAvaiableSlots = [];
        this.loading = false;
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  changeTimeSlot($event) {
    this.timePeriod = $event;
    if ($event == undefined) {
      this.myActivityForm.patchValue({
        'timePeriod': '60' /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10648 EWM-10761 @What:Time Interval should be an hour different instead of 30 mins **/
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

  changeTimeDisplay($event) {
    this.timeDisplayHour = $event.value;
    this.getTimeSlot(this.selectedTimeslots, null, this.slotAdd);
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
      this.getCreateMeetingUrl();
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
   @Name: openModelForSchedule
   @Who: Anup Singh
   @When: 07-jan-2022
   @Why:EWM-4467 EWM-4529
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
        // @suika @EWM-12408 @date changes time remains same
        let slotStartDate = res.scheduleData.DateStart;
        const d = new Date(slotStartDate);
        let slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString().slice(0, 10);;
        this.myActivityForm.patchValue({
          'slotDate': slotDate
        })
        this.utctimezonName = res.scheduleData.TimeZone;
        this.slotStartDate = this.slotsStartDate;   // @suika @EWM-12408 @date changes time remains same
        this.getAvaiableTimeslots(slotStartDate);
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
   @Name: getCreateMeetingUrl function
   @Who: Nitin Bhati
   @When: 04-May-2022
   @Why: EWM-6237
   @What: For getting Create Meeting URL
  */
  isActivityTitle: boolean;
  getCreateMeetingUrl() {
    this.scheduleInfo(this.myActivityForm.getRawValue());
    this.loading = true;
    let AddObj = {};
    this.scheduleTimeData.TimeZoneID =  this.myActivityForm.get("TimeZoneID")?.value;
    AddObj['Title'] = this.myActivityForm.get("ActivityTitle")?.value;
    AddObj['ScheduleActivity'] = this.scheduleTimeData;
    AddObj['MeetingPlatformId'] = this.myActivityForm.get("MeetingPlatform").value ? this.myActivityForm.get("MeetingPlatform").value : '00000000-0000-0000-0000-000000000000';
    //  <!---------@When: 05-12-2022 @who:Adarsh singh @why: EWM-9729 --------->
    if (!this.myActivityForm.value.ActivityTitle?.trim()) {
      this.isActivityTitle = true;
      this.loading = false;
      this.myActivityForm.patchValue(
        {
          MeetingPlatform: null,
        })
      return;
    }
    // END 
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
              // 'Description': (this.myActivityForm.value?.Description)?this.myActivityForm.value?.Description + ' <a href="'+repsonsedata.Data.MeetingUrl+'" target="_blank">Click here to join the meeting</a>':'' + '<a href="'+repsonsedata.Data.MeetingUrl+'" target="_blank">Click here to join the meeting</a>'
            });
            this.readonly = true;
            // this.myActivityForm.controls["ActivityUrl"].disable(); /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10648 EWM-10766 @What:activity url should not be disabled **/
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
    this.MeetingUrl = null;
    this.isActivityTitle = false;
    this.loading = false;
    this.myActivityForm.patchValue(
      {
        ActivityUrl: null,
      })
  }


  /*
    @Type: File, <ts>
    @Name: onActivityChange
    @Who: Renu
    @When: 15-mar-2022
    @Why:EWM-11055 EWM-11088
    @What: get data when activity chane
  */

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
  }


  /*
    @Type: File, <ts>
    @Name: openTemplateModal
    @Who: Nitin Bhati
    @When: 17-March-2023
    @Why: EWM-11104
    @What: to open template modal dialog
  */
  openTemplateModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_insertTemplate';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(TemplatesComponent, {
      panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
      data: {isMyActivity:true,selectedTemplateId:this.selectedTemplateId,tabActiveIndex:this.tabActiveIndex,tabActive:this.tabActive},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.systemSettingService.getEmailTemplateByID('?id=' + res.data.Id).subscribe(
          (repsonsedata: ResponceData) => {
            this.selectedTemplateId = res.data.Id;
            this.tabActiveIndex = res.tabActiveIndex;
            this.tabActive = res.tabActive;
            this.loading = false;
            if (repsonsedata.HttpStatusCode === 200) {
              let cceList = repsonsedata.Data.CcEmail?.split(',');
              this.optionalAttendeesList = [];
              for (let itr2 = 0; itr2 < cceList?.length; itr2++) {
                if (cceList[itr2]?.length != 0 && cceList[itr2] != '') {
                  this.optionalAttendeesList.push({ Name: cceList[itr2], Email: cceList[itr2] });
                }
              }
              let FromEmailList = repsonsedata['Data'].FromEmail?.split(',');
              for (let itr3 = 0; itr3 < FromEmailList?.length; itr3++) {
                // if (FromEmailList[itr3]?.length != 0 && FromEmailList[itr3] != '') {
                //   this.selectedOrganizer.push({ UserName: FromEmailList[itr3], UserId: FromEmailList[itr3], Email: FromEmailList[itr3] });
                // }
              }
              let TemplateText = repsonsedata['Data'].TemplateText;
              if(this.cache.getLocalStorage("UserEmailSignature")){
                TemplateText = TemplateText + this.cache.getLocalStorage("UserEmailSignature");
                this.getEditorVal=repsonsedata['Data']?.TemplateText + this.cache.getLocalStorage("UserEmailSignature"); 
              }
              else {
                this.getEditorVal=repsonsedata['Data']?.TemplateText;
              }
              this.myActivityForm.patchValue({
                'ActivityTitle': repsonsedata.Data.Subject,
                'Description': TemplateText
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
    @When: 17-March-2023
    @Why: EWM-11104
    @What: For Insert Job tag value
  */
  getInsertPlaceholderByType(insertType) {
    this.loading = true;
    this.systemSettingService.getPlaceholderByType(insertType).subscribe(
      respdata => {
        if (respdata['Data']) {
         this.loading = false;
          let existing: any[] = this._toolButtons$.getValue();
          this.plcData = [];
          for (let plc of respdata['Data']) {
            this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
          }
          let peopleButton: string = insertType;
          // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
          existing.push({ text: peopleButton, data: this.plcData });
          let jobData: any = existing.filter((item) => {
            return item.text === insertType
          });
          this._toolButtons$.next(jobData);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
    if (this.myActivityForm.get("Description").value==null) { //by maneeh
      this.myActivityForm.get('Description').setValue('');     
    }
    localStorage.removeItem('selectEmailTemp');
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      // @suika @whn 29-03-2023 @why dynamic email template preview data for activity section
      data: new Object({ subjectName: this.myActivityForm.get("ActivityTitle").value, emailTemplateData: this.myActivityForm.get("Description").value, RelatedUserType: this.myActivityForm.get("RelatedUserType").value, RelatedUserId: this.myActivityForm.get("RelatedUserId").value, isActivity: true }),
      panelClass: ['xeople-modal-lg', 'emailPreview', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }
  /*
    @Type: File, <ts>
    @Name: getAllRegion function
    @Who: renu
    @When: 17-March-2022
    @Why:EWM-11055 EWM-11093
    @What: call Get method from services for showing data into grid..
  */
  getAllRegion() {
    this.getAccountPreference();
    if (this.scheduleData24Hrs != undefined && this.scheduleData24Hrs != null && this.scheduleData24Hrs != '') {
      this.patchScheduleData(this.scheduleData24Hrs);
    }
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
    if(e==null){
      return false;
    }
    //this.TimeStartValue = e;
    /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/
    let date = new Date(e);
    let mnth: any = ("0" + (date.getMonth() + 1)).slice(-2);
    let day: any = ("0" + date.getDate()).slice(-2);
    //const dateEnd = new Date(Date.now() + 10 * 60 * 1000) 
    let DateEnd = this.appSettingsService.getUtcDateFormat([date.getFullYear(), mnth, day].join("-"));

    // let startTime = value.TimeStart.split(":");
    this.TimeStartValue = new Date(date.getFullYear(), mnth, day, date.getHours(), date.getMinutes(), 0);
    this.TimeEndValue = new Date(date.getFullYear(), mnth, day, date.getHours() + 1, date.getMinutes(), 0);

    this.myActivityForm.patchValue({
      TimeStart: new Date(this.TimeStartValue).toString().slice(16, 21),
      TimeEnd: new Date(this.TimeEndValue).toString().slice(16, 21),
    });
    /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/
   this.isStartTmeRequired = false;
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
   
    this.isEndTmeRequired = false;
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
    //this.EndDateMin = new Date(DateStart);
    this.EndDateMin = new Date(new Date(DateStart));
    this.EndDateMin.setDate(this.EndDateMin.getDate());
    this.myActivityForm.patchValue({
      DateEnd: DateStart
    });
    // <!---------@When: 23-03-2023 @who:Adarsh singh @why: EWM-10688 @Desc- Added date validation--------->
    if (this.myActivityForm.controls['DateStart'].hasError('invalidDate')) {
      this.myActivityForm.patchValue({
        DateEnd: null
      });
    }
    this.isDateEnd = false;

  }

  /*
 @Type: File, <ts>
 @Name: getTimezone()
 @Who: Renu
 @When: 17-mar-2023
 @Why:EWM-11055 ewm-11093 
 @What: get time according to chosen timezone
 */
  getTimezone(event) {
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
      let endDate = new Date(Date.now() + this.timePeriod * 60 * 1000);
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
    else{
      this.myActivityForm.patchValue({
        TimeZone: null
      });
      this.selecteTimezone = {}
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
    @Name: clearEndDate function
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
      // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10688 EWM-10940 Desc- patch value in time varibale --------
      let startTime = value.TimeStart.split(":");
      let endTime = value.TimeEnd.split(":");
      let getStrtTime = value.DateStart.split('-');

      this.TimeStartValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], startTime[0], startTime[1], 0);
      this.TimeEndValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], endTime[0], endTime[1], 0);
      // End 
      // this.slotsStartDate = DateStart;
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

    //let DateStart = this.appSettingsService.getUtcDateFormat(this.myActivityForm.get("DateStart").value);
    /*@When: 05-04-2023 @who:Renu @why: EWM-11707 EWM-11725 @Desc-for slot back date we need back date also*/
    let DateStart = this.appSettingsService.getUtcDateFormat(value.DateStart);
    //this.EndDateMin = new Date(DateStart);
    this.EndDateMin = new Date(new Date(DateStart));
    this.EndDateMin.setDate(this.EndDateMin.getDate());
  }
  /*
  @Type: File, <ts>
  @Name: fetchDataFromAddressBar
  @Who: Nitin Bhati
  @When: 18-march-2023
  @Why:EWM-11055 EWM-11098
  @What:fetchData From google map
  */
  public fetchDataFromAddressBar(address) {
    this.myActivityForm.patchValue({ Location: address.formatted_address });
  }

  /*
  @Type: File, <ts>
  @Name: fetchDataFromAddressBar
  @Who: Renu
  @When: 19-march-2023
  @Why:EWM-11055 EWM-11096
  @What:on edit platform URL
  */
  onEditActivity(): void {

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
@Name: checkEmailConnection function
@Who: Suika
@When: 10-April-2023
@Why: EWM-11707 EWM-11802
@What: check email connection is established or not
*/
  checkEmailConnection() {
    let isemailConnect:any = localStorage.getItem('emailConnection');
    if (isemailConnect == 1) {
      this.emailConnection = true;
    }
    else{
      this.emailConnection = false;
      this.myActivityForm.get('IsSendCalendarInviteToAttendees').setValue(0);
    }
    // this.mailService.getUserIsEmailConnected().subscribe(
    //   (data: ResponceData) => {
    //     if (data.HttpStatusCode === 200) {
    //       if (data.Data.IsEmailConnected == 1) {
    //       } else {
    //         this.emailConnection = false;
    //         this.myActivityForm.get('IsSendCalendarInviteToAttendees').setValue(0);
    //       }
    //     } else {
    //       this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
    //     }
    //   }, err => {
    //     this.loading = false;
    //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    //   })
  }

//@suika @whn 14-06-2023 @EWM-12726
  clearStartTime(){
    this.TimeStartValue = "";
    this.TimeEndValue="";
    this.myActivityForm.patchValue({
      TimeStart: "",
      TimeEnd: "",
    });
    this.isEndTmeRequired = true;
    this.isStartTmeRequired = true;
  }
//@suika @whn 14-06-2023 @EWM-12726
  clearEndTime(){
    this.TimeEndValue="";
    this.myActivityForm.patchValue({
      TimeEnd: "",
    });
    this.isEndTmeRequired = true;
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


ngOnDestroy(){
  
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
      API: this.serviceListClass.getAllEmployeeForActivity_v2,
      MANAGE: './client/emp/employees/employee-list',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_relatedUser',
      SHORTNAME_SHOW: true,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
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
      SHORTNAME_SHOW: true,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      EXTRA_BIND_VALUE: ''
    }
//  @Who: maneesh, @When: 09-04-2024,@Why: EWM-16682-EWM-16207 @What: on changes on kendo editor catch the event here
                           this.editorConfig={
                            REQUIRED:false,
                            DESC_VALUE:null,
                            PLACEHOLDER:'label_description',
                            Tag:this.tagList,
                            EditorTools:this.basic,
                            MentionStatus:false,
                            maxLength:0,
                            MaxlengthErrormessage:false,
                            JobActionComment:false
                
                          };
  }

         //  @Who: maneesh, @When: 14-03-2024,@Why: EWM-16681-EWM-16207 @What: on changes on kendo editor catch the event here
         getEditorFormInfo(event) {
          this.ownerList = event?.ownerList;        
          if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
            this.myActivityForm.get('Description').setValue(event?.val);
          } else {
            this.myActivityForm.get('Description').updateValueAndValidity();
            this.myActivityForm.get("Description").markAsTouched();
          }
        }
  
      // who:maneesh,what: this is use for patch first time image upload data,when:09/04/2024
      getEditorImageFormInfo(event){      
        this.myActivityForm.get('Description').setValue(event?.val);
      }
      getUserEmailSettingInfo()
  {
    let EmailSignature;
    const filterCache = this.cache.getLocalStorage("UserEmailSignature");    
    if(filterCache)
    {     
      if(filterCache!='<p></p>') {
        EmailSignature = filterCache;          
        this.getEditorVal= EmailSignature;  
        this.myActivityForm.patchValue({
          'Description':   this.getEditorVal 
        }); 
      
      } 
    }
    else
    {
      this._profileInfoService.getUserEmailSettingInfo().subscribe(
        repsonsedata=>{
          this.loading=false;
          if(repsonsedata['HttpStatusCode']=='200')
          {
              if(repsonsedata['Data']['EmailSignature'])
              {
                EmailSignature=repsonsedata['Data']['EmailSignature'];
                if(EmailSignature!='<p></p>'){
                  this.cache.setLocalStorage("UserEmailSignature",EmailSignature);
                  this.getEditorVal=EmailSignature;
                  this.myActivityForm.patchValue({
                    'Description':   this.getEditorVal 
                  }); 
                
                }
              } 
          }
        });
    }
  }
}
