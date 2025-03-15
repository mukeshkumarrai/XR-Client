/*
  @Type: File, <ts>
  @Who: Adarsh Singh singh
  @When: 28-Nov-2023 24-Aug-2023
  @Why: EWM-15160
  @What: this is use for quick add activity
*/

import { HttpClient } from '@angular/common/http';
import { Component,Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import * as moment from 'moment';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { AddRequiredAttendeesComponent } from 'src/app/modules/EWM.core/home/my-activity/add-required-attendees/add-required-attendees.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { TemplatesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/templates/templates.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { IntegrationsBoardService } from 'src/app/modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { EmailPreviewPopupComponent } from 'src/app/modules/EWM.core/system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogModel } from '../quickpeople/quickpeople.component';
import { CreateActivity } from '../../../../../shared/models/quick-add-activity';
import { ConfirmDialogComponent } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ScheduleAssistanceDatePopupComponent } from '@app/modules/EWM.core/home/my-activity/schedule-assistance-date-popup/schedule-assistance-date-popup.component';
import { DRP_CONFIG, DRP_CONFIG_CLIENT_SIDE } from '@app/shared/models/common-dropdown';
import { OrganizerOrAssineesComponent } from '@app/modules/EWM.core/home/my-activity/organizer-or-assinees/organizer-or-assinees.component';
import { CommonDropDownService } from '../../services/common-dropdown-service/common-dropdown.service';


@Component({
  selector: 'app-quick-add-activity',
  templateUrl: './quick-add-activity.component.html',
  styleUrls: ['./quick-add-activity.component.scss']
})

export class QuickAddActivity {

  public timePeriod: number = 60;
  public loading: boolean;
  public clientId: string;
  public gridList: [] = [];
  public pagesize: number;
  public pagneNo: number = 1;
  public currentYear: number;
  public myActivityForm: FormGroup;
  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public dateFill = new Date();
  public today = new Date();
  public todayOpenDate = new Date();
  public todayFillDate = new Date();
  public fileBinary: File;
  public myfilename:string = '';
  public filePath: string;
  public maxMessage: number = 200;
  public selectedCategory: any = {};
  public dropDoneConfig: customDropdownConfig[] = [];
  CategoryId: string = 'EMPL';
  public activestatus: string = 'Add';
  accessEmailId: any = [];
  changeText: boolean = false;
  public yearFilterRes: number;
  public monthFilterRes: string;
  public filterCount: number = 0;
  public assignJobDrawerPos: string;
  public notesDrawerPos: string = 'end';
  public oldPatchValues: any = {};
  public CategoryIds: any = [];
  public totalDataCount: number;
  public maxCharacterLengthSubHead = 500;
  public filterCountCategory: number = 0;
  public filterCountOwner: number = 0;
  public filterCountDate: any = 0;
  documentTypeOptions: any;
  uploadedFileName: any;
  public utctimezonName: any = localStorage.getItem('UserTimezone');
  public requiredAttendeesList: any = [];
  public organizerOrAssigneesList: any = [];
  public timezonName: any = localStorage.getItem('UserTimezone');
  public selectedItem = [];
  resetFormSubjectRelatedUser: Subject<any> = new Subject<any>();
  public dropDownRelatedUserConfig: customDropdownConfig[] = [];
  public selectedRelatedUser: any = {};

  public ActivityTypeList: any[] = [];
  pageNo = 1;
  public activityForAttendees: string;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
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
  isActivityTitle: boolean;
  public Id: any;
  candidateData: any = [];
  public isAttendeeShow: boolean = false;
  isAddRequiredAttendees: boolean = false;
  candidateID: any;
  candidateName: any;
  candidateEmail: any;
  mode: any;
  candidateIDdta: any;
  candidateIdScreening: string;
  isDisabledForScreening: boolean;
  selectedItemListForActiveClass = null;
  animationVar: any;
  scheduleData24Hrs: {};
  RegionName: string;
  TimeZoneName: string;
  maxMoreLength: number = 2;
  AccessName: any;
  AccessId: number;
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
  emailConnection: boolean = false;
  isRequiredAttendees: boolean = false;
  dirctionalLang;
  selectedCategoryId: string;
  isStartTmeRequired: boolean;
  isEndTmeRequired: boolean;
  selectedTemplateId: any;
  tabActiveIndex: any;
  tabActive: any;
  scheduleData: any = {};
  slotsStartDate: any;
  isSlotActive: boolean = false;
  public IsAttendeesReq: boolean = false;
  isResponseGet:boolean = false;
  public removable = true;
  isShowMoreHideMore:boolean = false;
  attendiesPopArr = [];
  jobContactsArr = [];
  empCandArr = [];
  onlyAttendiesPopArr = [];
  dateAndTimeToggle:boolean = false;
  filterData: any;
  @Input() clientEmailId: any;
  userInviteArr:any = [];
  currentUserDetails:any;
  timeZone_Config:DRP_CONFIG_CLIENT_SIDE;
  selecteTimezone:any;
  timezoneArrList:any = [];
  common_DropdownC_Config:DRP_CONFIG;
  label_copied: string;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private http: HttpClient, private snackBService: SnackBarService, public candidateService: CandidateService,
    public _sidebarService: SidebarService, private _profileInfoService: ProfileInfoService,
    private commonserviceService: CommonserviceService, public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService, private serviceListClass: ServiceListClass, private quickJobService: QuickJobService,
    private systemSettingService: SystemSettingService, public _integrationsBoardService: IntegrationsBoardService, private mailService: MailServiceService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService, public dialogRef: MatDialogRef<QuickAddActivity>,private renderer: Renderer2,
    private dataService: CommonDropDownService) {
    this.AccessId = this.appSettingsService.getDefaultAccessId;
    this.AccessName = this.appSettingsService.getDefaultaccessName;
    this.pagesize = appSettingsService.pagesize;
    this.oldPatchValues = { 'AccessId':  this.AccessId, 'GrantAccesList':  this.AccessName }
    this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllEmployeeForActivity;
    this.dropDownRelatedUserConfig['IsManage'] = './client/emp/employees/employee-list';
    this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
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
    this.myActivityForm = this.fb.group({
      Id: [],
      slotDate: [null, [Validators.required, CustomValidatorService.dateValidator]],
      timePeriod: ['60', Validators.required],
      ActivityTitle: ['', [Validators.required, Validators.maxLength(100)]], 
      RelatedUserType: ['EMPL', [Validators.required]],
      RelatedUserTypeName: ['Employee'],
      RelatedUserId: [null, [Validators.required]],
      RelatedUserUserName: [''],
      CategoryId: [''],
      CategoryName: [''],
      ScheduleActivity: [null, [Validators.required]],
      Location: ['', [Validators.maxLength(100)]],
      OptionalAttendeesList:[],
      AddRequiredAttendees: [null],  
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
      IsSendEmailToAttendees:[true],
      IsSendCalendarInviteToAttendees:[true],
      LoggedInUserName: [''],
      TimeZoneID: ['']
    });
    this.oldPatchValues = { 'AccessId': this.AccessId, 'GrantAccesList': '' }
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    this.TimeEndValue = nowTime;
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.slotStartDate = new Date(); 
    this.slotEndDate = new Date(Date.now() + this.timePeriod * 60 * 1000);
    const startdatetime = new Date(this.slotStartDate); 
    let slotDate =  new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0,10);
  
    this.myActivityForm.patchValue({
      'slotDate':slotDate
    })   
    this.slotAdd=true;
    this.onChangeActivityRelatedTo(this.CategoryId);
    this.getMeetingPlatformList();
    this.timezoneArrList = JSON.parse(localStorage.getItem('TimeZoneList'))
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUserDetails = currentUser;
    this.userId = currentUser?.UserId;
     this.username=currentUser?.FirstName+' '+currentUser?.LastName;
    this.getAllInviteUser();
    this.getInsertPlaceholderByType('Jobs');
    this.dropdownConfig();
    this.checkEmailConnection();  
    this.getAllRegion();
    this.selectedRelatedUser = { 'Id': this.userId, 'Name': this.username, 'Email': currentUser?.EmailId }
    this.onRelatedUserchange(this.selectedRelatedUser);
    
  }


  /*
    @Type: File, <ts>
    @Name: checkRelatedType
    @Who: Adarsh Singh Singh
    @When: 28-Nov-2023 21-Nov-2023
    @Why:EWM-15160
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
    @Who: Adarsh Singh singh
    @When: 28-Nov-2023 24-Aug-2023
    @Why: EWM-15160
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
        RelatedUserId: data?.Id,
        RelatedUserUserName: data?.Name
      })
      this.jobContactsArr = [];
      if (this.myActivityForm.value.RelatedUserTypeName === 'Job') {
        if (data?.CompanyContactList?.length>0) {
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
          this.jobContactsArr = [];
        }
      }
      else{
        this.empCandArr = [];
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
    @Name: onChangeActivityRelatedTo
    @Who: Adarsh Singh
    @When: 28-Nov-2023 07-jan-2022
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
   
    }

 

  /*
    @Type: File, <ts>
    @Name: getActivityTypeCategory
    @Who: Adarsh Singh
    @When: 28-Nov-2023 13-Jan-2022
    @Why: EWM-4545
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
   @Name: fetchDataFromAddressBar
   @Who: Adarsh Singh
   @When: 28-Nov-2023 13-Jan-2022
   @Why: EWM-4545
   @What:fetchData From google map
   */
  public fetchDataFromAddressBar(address) {
    this.myActivityForm.patchValue({ Location: address.formatted_address });
  }

  /*
   @Type: File, <ts>
   @Name: openModelForSchedule
   @Who: Adarsh Singh
   @When: 28-Nov-2023 13-Jan-2022
   @Why: EWM-4545
   @What: open Modal for schedule
   */
 
  /*
    @Type: File, <ts>
    @Name: openModelAddRequiredAttendees
    @Who: Adarsh Singh
    @When: 28-Nov-2023 13-Jan-2022
    @Why: EWM-4545
    @What: open Modal for AddRequiredAttendees
    */
   isDefaultAttendees:boolean;
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
    @Who: Adarsh Singh
    @When: 28-Nov-2023 13-Jan-2022
    @Why: EWM-4545
    @What: get All Invite User
    */
    getAllInviteUser() {
      this.userInviteArr.push({
        UserId: this.currentUserDetails.UserId,
        UserName: this.currentUserDetails.FirstName + ' '+ this.currentUserDetails.LastName,
        Email: this.currentUserDetails.EmailId
      })
      let getLoggedInUser = this.userInviteArr
      this.myActivityForm.controls['OrganizerOrAssignees'].setValue(getLoggedInUser);
      this.filterData = getLoggedInUser;
      this.selectedOrganizer = this.filterData;
      this.myActivityForm.patchValue({
        LoggedInUserName: getLoggedInUser[0].UserName
      })
      this.loading = false;
    this.myActivityForm.controls["LoggedInUserName"].disable();
    }

  /*
   @Type: File, <ts>
   @Name: openModelOrganizerOrAssignees
   @Who: Adarsh Singh
   @When: 28-Nov-2023 13-Jan-2022
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
        // this.loading = false;
      }
    })
  }
  isAttendeesReq: boolean = false;

  /*
  @Type: File, <ts>
  @Name: remove
  @Who: Adarsh Singh
  @When: 28-Nov-2023 13-Jan-2022
  @Why: EWM-4545
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {
    if (type == 'addRequiredAttendees') {
      const index = this.requiredAttendeesList.indexOf(items);
      if (index >= 0) {
        this.requiredAttendeesList.splice(index, 1);
      }
       /*** @When: 28-Nov-2023 01-03-2023 @Who:Adarsh Singh @Why: EWM-10768 EWM-10648 @What:  This will also be OPTIONAL Field for a user to create their activity and tasks **/

     //  if (this.requiredAttendeesList.length == 0) {
     //    this.myActivityForm.controls['AddRequiredAttendees'].setErrors({ 'required': true });
     //    this.IsAttendeesReq = true;
     //  } else {
     //    this.IsAttendeesReq = false;
     //  }
    }
    else if (type == 'organizerOrAssignees') {
      const index = this.organizerOrAssigneesList.indexOf(items);
      if (index >= 0) {
        this.organizerOrAssigneesList.splice(index, 1);
      }
      if (this.organizerOrAssigneesList.length == 0) {
        this.myActivityForm.controls['OrganizerOrAssignees'].setErrors({ 'required': true });
      }
    }else{  /*** @When: 28-Nov-2023 17-03-2023 @Who:Adarsh Singh @Why: EWM-11055 EWM-11095 @What:  optional attendees handling **/

     const index = this.optionalAttendeesList.indexOf(items);
      if (index >= 0) {
        this.optionalAttendeesList.splice(index, 1);
      }
    }
      //<!-----@adarsh singh @EWM-11866 @whn 13-04-2023 @why enable disable required attendees---->
      if(this.requiredAttendeesList?.length==0 && this.optionalAttendeesList?.length==0){
        this.isRequiredAttendees = false;
        this.myActivityForm.get('IsSendEmailToAttendees').setValue(0);
       }else{
        this.isRequiredAttendees = true;
        this.myActivityForm.get('IsSendEmailToAttendees').setValue(1);
       }
    //  else {
    //   const index = this.socials.indexOf(items);
    //   if (index >= 0) {
    //     this.socials.splice(index, 1);
    //   }
    // }


  }
 
 
  /* 
    @Type: File, <ts>
    @Name: onCategorychange
    @Who: Adarsh Singh
    @When: 28-Nov-2023 13-Jan-2022
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

  ngOnDestroy(): void {
  }

 

  /*
     @Type: File, <ts>
     @Name: selectFile function
     @Who: Adarsh Singh
     @When: 28-Nov-2023 13-Jan-2022
     @Why: EWM-4545
     @What: on selecting file
   */
     public selectedFiles: any;

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
     @Who: Adarsh Singh
     @When: 28-Nov-2023 13-Jan-2022
     @Why: EWM-4545
     @What: on uploading file
   */
     public previewUrl: any;

  uploadAttachementFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    //formData.append('resources', 'resume');
    this.candidateService.FileUploadClient(formData).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.filePath = responseData.Data[0].FilePathOnServer;
          this.previewUrl = responseData.Data[0].Preview;
          this.uploadedFileName = responseData.Data[0].UploadFileName;
          localStorage.setItem('Image', '2');
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
    @Type: File, <ts>
    @Name: validateFile function
    @Who: Adarsh Singh
    @When: 28-Nov-2023 13-Jan-2022
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
     @Who: Adarsh Singh
     @When: 28-Nov-2023 13-Jan-2022
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
    @Name: openManageAccessModal
    @Who: Adarsh Singh
    @When: 28-Nov-2023 13-Jan-2022
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
   @Name: openMultipleAttachmentModal function
   @Who: Adarsh Singh
   @When: 28-Nov-2023 08-Feb-2022
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
   @Who: Adarsh Singh
   @When: 28-Nov-2023 08-Feb-2022
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
  @Who: adarsh Singh
  @When: 28-Nov-2023 20-April-2022
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
  @Who: Adarsh Singh
  @When: 28-Nov-2023 20-April-2022
  @Why: EWM-6237
  @What: For MeetingPlatform Click event
 */
  clickMeetingPlatformID(RegistrationCodeId) {
      //<!--@adarsh singh @EWM-11802 @WHN 11-04-2023 to check email connected or not------>
      if(RegistrationCodeId!=undefined){
        this.meetingPlatformData = this.meetingPlatformList?.filter((dl: any) => dl.RegistrationCode == RegistrationCodeId);
        this.meetingPlatformName = this.meetingPlatformData[0]?.Name;     
        if (this.meetingPlatformName != undefined) {
          this.getCreateMeetingUrl();
        }
      }else{
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
  @Who: Adarsh Singh
  @When: 28-Nov-2023 04-May-2022
  @Why: EWM-6237
  @What: For getting Create Meeting URL
 */
  getCreateMeetingUrl() {
   
    //<!---------@When: 28-Nov-2023 27-12-2022 @who:Adarsh Singh @why: EWM-11340 EWM-11355 --------->
    this.scheduleInfo(this.myActivityForm.getRawValue());
    this.loading = true;
    let AddObj = {};
    this.scheduleTimeData.TimeZoneID =  this.myActivityForm.get("TimeZoneID")?.value;
    AddObj['Title'] = this.myActivityForm.get("ActivityTitle")?.value;
    AddObj['ScheduleActivity'] = this.scheduleTimeData;//<!--@adarsh singh @EWM-11802 @WHN 11-04-2023 ----->
    AddObj['MeetingPlatformId'] = this.myActivityForm.get("MeetingPlatform").value ? this.myActivityForm.get("MeetingPlatform").value : '00000000-0000-0000-0000-000000000000';
     //  <!---------@When: 28-Nov-2023 05-12-2022 @who:Adarsh Singh singh @why: EWM-9729 --------->
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
            this.MeetingId=repsonsedata.Data.MeetingId;
            this.MeetingUrl=repsonsedata.Data.MeetingUrl;
            this.myActivityForm.patchValue({
                'ActivityUrl': repsonsedata.Data.MeetingUrl,
            //  <!---------@When: 28-Nov-2023 04May-2023 @who:Adarsh Singh singh @why: EWM-12322 @Desc- Remove patching link in description--------->
            });
            this.readonly=true;
           // this.myActivityForm.controls["ActivityUrl"].disable(); /*** @When: 28-Nov-2023 01-03-2023 @Who:Adarsh Singh @Why: EWM-10648 EWM-10766 @What:activity url should not be disabled **/
            this.isActivityTitle = false;    
          } else if(repsonsedata.HttpStatusCode == '400'){
            this.readonly=false;
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
            this.readonly=false;
          }
        }, err => {
          this.readonly=false;
          this.loading = false;
        })
     }
  }
  /*
    @Type: File, <ts>
    @Name: onRemoveMeetingChange function
    @Who: Adarsh Singh
    @When: 28-Nov-2023 05-May-2022
    @Why: EWM-6049
    @What: For remove in MeetingPlatform
   */
  onRemoveMeetingChange() {
    // this.MeetingId = null;
    // this.myActivityForm.patchValue(
    //   {
    //     ActivityUrl: null,
    //   })
    //<!---------@When: 28-Nov-2023 27-12-2022 @who:Adarsh Singh @why: EWM-11340 EWM-11355 --------->
    this.MeetingId = null;
    this.isActivityTitle = false;
    this.loading = false;
    this.myActivityForm.patchValue(
      {
        ActivityUrl: null,
      })
      this.readonly=null;
  }

  /*
@Type: File, <ts>
@Name: onchangeCategory
@Who: adarsh singh
@When: 28-Nov-2023 24-aug-2022
@Why: EWM-6129 EWM-8192
@What: patch data when category select
*/

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
      @Who: Adarsh Singh
      @When: 28-Nov-2023 22-Sep-2022
      @Why:EWM-1734 EWM-8251
      @What: open user change time format from dropdown
      */

  changeTimeDisplay($event) {
    this.timeDisplayHour = $event.value;
    this.getTimeSlot(this.selectedTimeslots, null,this.slotAdd);
  }
  /*
   @Type: File, <ts>
   @Name: openModelForSchedule
   @Who: Adarsh Singh
   @When: 28-Nov-2023 22-Sep-2022
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
         this.getAvaiableTimeslots(this.slotStartDate,this.slotAdd);//<!--@adarsh singh @EWM-11802 @WHN 11-04-2023 ----->
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
  @Who: Adarsh Singh
  @When: 28-Nov-2023 22-Sep-2022
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
    if(this.timePeriod==15){
      document.getElementById('time-slot').classList.add('add-slotscroll');
    }else{
      document.getElementById('time-slot').classList.remove('add-slotscroll');
    }
    this.getAvaiableTimeslots('',this.slotAdd);
    this.selectedItem=[];
  }
 

  /*
     @Type: File, <ts>
     @Name: getScheduleAssitance
     @Who:Adarsh Singh
     @When: 28-Nov-2023 22-Sept-2022
     @Why:EWM-1734 EWM-8251
     @What: get All avaiable User
     */

  getScheduleAssitance(startDate,endDate) {
    this.slotStartDate = new Date(startDate);
    this.slotEndDate = new Date(endDate);
    const startdatetime = new Date(this.slotStartDate);
    let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
    this.myActivityForm.patchValue({
      'slotDate': slotDate,
      'timePeriod': '60'
    })
    this.getAvaiableTimeslots(this.slotStartDate,this.slotAdd);
  }

  /*
    @Type: File, <ts>
    @Name: getAvaiableTimeslots
    @Who: Adarsh singh
    @When: 28-Nov-2023 21-April-2022
    @Why:EWM-5572 EWM-6131
    @What: get All avaiable User
    */
  getAvaiableTimeslots(startdatetime,slotAdd) {
    this.loading = true;
    this.slotAdd=slotAdd;
    const d = new Date(this.slotStartDate);
    let timeZone = this.utctimezonName?.substring(4, 10);
    let slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    let timeZoneValue = encodeURIComponent(timeZone);
    this.quickJobService.getAvaiableTimeslots(slotDate, this.timePeriod, timeZoneValue).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
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
           this.getTimeSlot(this.selectedTimeslots, index,this.slotAdd);
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

  /*
  @Type: File, <ts>
  @Name: getTimeSlot
  @Who: Adarsh Singh
  @When: 28-Nov-2023 12-March-2023
  @Why:EWM-10638
  @What: for patching th value based on 12/24 format
  */

  getTimeSlot(timeslots, i,slotAdd) {
      //<!-----@adarsh singh @EWM-11866 @whn 13-04-2023 @why enable disable required attendees---->
      this.myActivityForm.get('MeetingPlatform').setValue(null);
      this.onRemoveMeetingChange();
      this.readonly = null;
    this.slotAdd=slotAdd;
    /* if(timeslots.IsAvailable===0){
       return;
     }*/
     this.selectedTimeslots = timeslots;
     if(this.slotAdd==true){
      if(i?.length!=null){
        i.forEach(x=>{
          this.selectedItem[x] = x;   
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
      // let start_time = moment.utc(d).tz(this.timezonName).format("hh:mm");
      // startTime = start_time;
      // const e = new Date(Number(timeslots.EndTime));
      // let end_time = moment.utc(e).tz(this.timezonName).format("hh:mm");
      // endTime = end_time;
      let hourStartTime   = moment.utc(d).tz(this.timezonName).hours();
      let minuteStartTime = moment.utc(d).tz(this.timezonName).minute();
      if(this.activityActionForm=='Add' && this.slotAdd==true){
      if(minuteStartTime <= 30)
      startTime = moment.utc(d).tz(this.timezonName).set({minute: 30}).format("hh:mm");
      if(minuteStartTime >  30) 
      startTime = moment.utc(d).tz(this.timezonName).set({hours: hourStartTime + 1, minute: 0}).format("hh:mm");
      }else{
        startTime = moment.utc(d).tz(this.timezonName).format("hh:mm");
      }
        const e = new Date(Number(timeslots.EndTime));
        let hourendTime   = moment.utc(e).tz(this.timezonName).hours();
        let minuteEndTime = moment.utc(e).tz(this.timezonName).minute();
        if(this.activityActionForm=='Add' && this.slotAdd==true){
          if(minuteEndTime <= 30)
          endTime = moment.utc(e).tz(this.timezonName).set({minute: 30}).format("hh:mm");
          if(minuteEndTime >  30) 
          endTime = moment.utc(e).tz(this.timezonName).set({hours: (hourendTime + 1), minute: 0}).format("hh:mm");
       
        }else{
         let end_time =  moment.utc(e).tz(this.timezonName).format("hh:mm");     
          endTime = end_time; 
        }
    } else {
      // let start_time = moment.utc(d).tz(this.timezonName).format('HH:mm');
      // startTime = start_time;
      // const e = new Date(Number(timeslots.EndTime));
      // let end_time = moment.utc(e).tz(this.timezonName).format('HH:mm');
      //endTime = end_time;
        /*** @When: 28-Nov-2023 09-03-2023 @Who:Adarsh Singh @Why: EWM-10648 EWM-10764 @What:round off time to nearest quater in gap of 30min **/
        let hourStartTime   = moment.utc(d).tz(this.timezonName).hours();
        let minuteStartTime = moment.utc(d).tz(this.timezonName).minute();
        if(this.activityActionForm=='Add' && this.slotAdd==true){
        if(minuteStartTime <= 30)
        startTime = moment.utc(d).tz(this.timezonName).set({minute: 30}).format("HH:mm");
        if(minuteStartTime >  30) 
        startTime = moment.utc(d).tz(this.timezonName).set({hours: hourStartTime + 1, minute: 0}).format("HH:mm");
        }else{
          let start_time = moment.utc(d).tz(this.timezonName).format('HH:mm');
          startTime = start_time;
        }
       const e = new Date(Number(timeslots.EndTime));
       let hourendTime   = moment.utc(e).tz(this.timezonName).hours();
       let minuteEndTime = moment.utc(e).tz(this.timezonName).minute();
        if(this.activityActionForm=='Add' && this.slotAdd==true){
          if(minuteEndTime <= 30)
          endTime = moment.utc(e).tz(this.timezonName).set({minute: 30}).format("HH:mm");
          if(minuteEndTime >  30) 
          endTime = moment.utc(e).tz(this.timezonName).set({hours: hourendTime + 1, minute: 0}).format("HH:mm");
        }else{
          let end_time = moment.utc(e).tz(this.timezonName).format('HH:mm');    
          endTime = end_time; 
        }
    }
    let scheduleFormData = {};
    scheduleFormData['TimeZone'] = this.utctimezonName;//'(UTC+03:00) East Africa Time/ Mayotte';//value.TimeZone.Timezone;
     //let local_startDate = moment.utc(value.DateStart).local().format('YYYY-MM-DD');
      /*** @When: 28-Nov-2023 09-03-2023 @Who:Adarsh Singh @Why: EWM-10648 EWM-10764 @What:round off time to nearest quater in gap of 30 min **/
     let local_startDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate),startTime);
     scheduleFormData['DateStart'] = local_startDate;
     scheduleFormData['TimeStart'] = startTime;
     // let local_endDate = moment.utc(value.DateEnd).local().format('YYYY-MM-DD');
     let local_endDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate),endTime);
     scheduleFormData['DateEnd'] = local_endDate;
     const e = new Date(Number(timeslots.EndTime));
     if(i===0 || i===null){
      scheduleFormData['TimeEnd'] =this.timeAddMinutes(endTime,60); /*** @When: 28-Nov-2023 12-03-2023 @Who:Adarsh Singh @Why: EWM-10648 EWM-10764 @What: 1 hrs difference added **/
     
    }else{
      scheduleFormData['TimeEnd'] =endTime;
     }
   
     this.get24hrsFormatSchedule(d,e);
     this.scheduleData = scheduleFormData;
     this.myActivityForm.patchValue({
       ScheduleActivity: scheduleFormData
     })
     if (this.gridTimeZone.length > 0) {
      this.loading = false;
      this.distinctRegion = this.gridTimeZone.filter(
        (thing, i, arr) => arr.findIndex(t => t.Region === thing.Region) === i
      );

      if (this.scheduleData24Hrs != undefined && this.scheduleData24Hrs != null && this.scheduleData24Hrs!= '') {
       this.patchScheduleData(this.scheduleData24Hrs)
      } else {
        this.myActivityForm.patchValue({
          DateEnd: this.currentStartDate,
        });
        this.isDateEnd = false;
      }
    }
     this.getScheduleTimeData(timeslots,i);

     this.isStartTmeRequired = false;
     this.isEndTmeRequired = false;
  }

  /*
 @Type: File, <ts>
 @Name: getScheduleTimeData
 @Who: Adarsh Singh
 @When: 28-Nov-2023 10-March-2023
 @Why:EWM-10638
 @What: calucation for the schedule time
 */
  getScheduleTimeData(timeslots,index) {
    const d = new Date(Number(timeslots.StartTime));
    let startTime:any;
    let endTime:any;   
   
     /*** @When: 28-Nov-2023 07-03-2023 @Who:Adarsh Singh @Why: EWM-10648 EWM-10764 @What: date format correction without using minute **/
    let hourStartTime   = moment.utc(d).tz(this.timezonName).hours();
    let minuteStartTime = moment.utc(d).tz(this.timezonName).minute();
    if(this.activityActionForm=='Add' && this.slotAdd==true){
      if(minuteStartTime <= 30)
      startTime = moment.utc(d).tz(this.timezonName).set({minute: 30}).format("HH:mm");
      if(minuteStartTime >  30) 
      startTime =moment.utc(d).tz(this.timezonName).set({hours: hourStartTime + 1, minute: 0}).format("HH:mm");
    }else{
       let start_time = moment.utc(d).tz(this.timezonName).format('HH:mm');
       startTime = start_time;
    }
    
    const e = new Date(Number(timeslots.EndTime));
    let end_time:any;
    

    let hourendTime   = moment.utc(e).tz(this.timezonName).hours();
    let minuteEndTime = moment.utc(e).tz(this.timezonName).minute();
    if(this.activityActionForm=='Add' && this.slotAdd==true){
      if(minuteEndTime <= 30)
      endTime = moment.utc(e).tz(this.timezonName).set({minute: 30}).format("HH:mm");
      if(minuteEndTime >  30) 
      endTime = moment.utc(e).tz(this.timezonName).set({hours: hourendTime + 1, minute: 0}).format("HH:mm");  
    }else{
       end_time = moment.utc(e).tz(this.timezonName).format('HH:mm');    
       endTime = end_time; 
    }
    let scheduleFormData = {};
    scheduleFormData['TimeZone'] = this.utctimezonName;
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate),startTime);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = startTime;
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate),endTime);
    scheduleFormData['DateEnd'] = local_endDate;
    if(index===0 || index===null){
      scheduleFormData['TimeEnd']=this.timeAddMinutes(endTime,60); 
    }else{
      scheduleFormData['TimeEnd'] = moment.utc(e).tz(this.timezonName).format('HH:mm');    
     
    }
    this.scheduleTimeData = scheduleFormData;
  }
 

      /*
     @Type: File, <ts>
     @Name: timeAddMinutes
     @Who: Adarsh Singh
     @When: 28-Nov-2023 12-March-2023
     @Why:- EWM-10638
     @What: To add minutes on month click based on timeslot selected
     */
     timeAddMinutes(time, min) {
      var t = time.split(":"),      
          h = Number(t[0]),        
          m = Number(t[1]);         
      m+= min % 60;                
      h+= Math.floor(min/60);      
      if (m >= 60) { h++; m-=60 }   
      
      return (h+"").padStart(2,"0")  +":"  
             +(m+"").padStart(2,"0");                       
      } 

      /*
     @Type: File, <ts>
     @Name: get24hrsFormatSchedule
     @Who: Adarsh Singh
     @When: 28-Nov-2023 12-March-2023
     @Why:- EWM-10638
     @What: for conversion schedule popup patch in 2 hrs format
     */
   get24hrsFormatSchedule(startDate:any,enddate:any){
    let scheduleFormData={};
    let startTime:any;
    let endTime:any; 
     /*** @When: 28-Nov-2023 07-03-2023 @Who:Adarsh Singh @Why: EWM-10648 EWM-10764 @What: date format correction without using minute **/
    let hourStartTime   = moment.utc(startDate).tz(this.timezonName).hours();
    let minuteStartTime = moment.utc(startDate).tz(this.timezonName).minute();
    if(this.activityActionForm=='Add' && this.slotAdd==true){
      if(minuteStartTime <= 30)
      startTime = moment.utc(startDate).tz(this.timezonName).set({minute: 30}).format("HH:mm");
      if(minuteStartTime >  30) 
      startTime =moment.utc(startDate).tz(this.timezonName).set({hours: hourStartTime + 1, minute: 0}).format("HH:mm");  
    }else{
       let start_time = moment.utc(startDate).tz(this.timezonName).format('HH:mm');
       startTime = start_time;
    }
  
    const convEnd = new Date(Number(enddate));
    let hourendTime   = moment.utc(convEnd).tz(this.timezonName).hours();
    let minuteEndTime = moment.utc(convEnd).tz(this.timezonName).minute();
    if(this.activityActionForm=='Add' && this.slotAdd==true){
      if(minuteEndTime <= 30)
      endTime = moment.utc(convEnd).tz(this.timezonName).set({minute: 30}).format("HH:mm");
      if(minuteEndTime >  30) 
      endTime = moment.utc(convEnd).tz(this.timezonName).set({hours: hourendTime + 1, minute: 0}).format("HH:mm");  
    }else{
       let end_time = moment.utc(convEnd).tz(this.timezonName).format('HH:mm');    
       endTime = end_time; 
    }
      
    scheduleFormData['TimeZone'] = this.utctimezonName;
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate),startTime);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = startTime;
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(new Date(this.slotStartDate),endTime);
    scheduleFormData['DateEnd'] = local_endDate;
    scheduleFormData['TimeEnd'] =endTime;

    this.scheduleData24Hrs = scheduleFormData;
 }

 /*
  @Type: File, <ts>
  @Name: getAccountPreference function
  @@Who: Adarsh Singh
  @When: 28-Nov-2023 17-mar-2023
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
@Who: Adarsh Singh 
@When: 28-Nov-2023 17-mar-2022
@Why:EWM-11055 EWM-11093
@What: patch data
*/
patchScheduleData(value) {  
  this.StartDateMin = null;
  let timeZoneData:any;
   setTimeout(()=>{
   timeZoneData =  this.timezoneArrList.filter(x => x['Timezone'] == value.TimeZone || x['Id'] == value.TimeZone);
   let DateStart = this.appSettingsService.getUtcDateFormat(value.DateStart);
   let DateEnd = this.appSettingsService.getUtcDateFormat(value.DateEnd);
   // --------@When: 28-Nov-2023 03-Mar-2023 @who:Adarsh Singh singh @why: EWM-10688 EWM-10940 Desc- patch value in time varibale --------
   let startTime = value.TimeStart.split(":");
   let endTime = value.TimeEnd.split(":");
   let getStrtTime = value.DateStart.split('-');
     
   this.TimeStartValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], startTime[0], startTime[1], 0);
   this.TimeEndValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], endTime[0], endTime[1], 0);
   // End 
    this.myActivityForm.patchValue({
     TimeZone: timeZoneData[0],
     DateStart: DateStart,
     TimeStart: value.TimeStart,
     DateEnd: DateEnd,
     TimeEnd: value.TimeEnd,
   });
 },2000) // @adarsh singh @EWM-11934 time zone patching in drop down @whn 17-05-2023

   let local_startDate = moment.utc(value.DateStart).local().format('YYYY-MM-DD');
   let local_endDate = moment.utc(value.DateEnd).local().format('YYYY-MM-DD');
   if (local_startDate === local_endDate) {
     this.isDateEnd = false;
   } else {
     this.isDateEnd = true;
   }

   let DateStart = this.appSettingsService.getUtcDateFormat(this.myActivityForm.get("DateStart").value);
   //this.EndDateMin = new Date(DateStart);
   this.EndDateMin = new Date(new Date(DateStart));
   this.EndDateMin.setDate(this.EndDateMin.getDate());
 }
     /*
  @Type: File, <ts>
  @Name: handleChangeStartTime function
  @Who: Adarsh Singh
  @When: 28-Nov-2023 17-Mar-2023
  @Why: EWM-11055 EWM-11093
  @What: getting start time value which  selected for
*/
handleChangeStartTime(e:any){
  if(e==null){
    return false;
  }
  //this.TimeStartValue = e;
  if(e==null){
    return false;
  }
/*** @When: 28-Nov-2023 10-03-2023 @Who:Adarsh Singh @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/
  let date=new Date(e);
  let mnth:any = ("0" + (date.getMonth() + 1)).slice(-2);
  let day:any = ("0" + date.getDate()).slice(-2);
   //const dateEnd = new Date(Date.now() + 10 * 60 * 1000) 
   let DateEnd = this.appSettingsService.getUtcDateFormat([date.getFullYear(), mnth, day].join("-"));
  
  // let startTime = value.TimeStart.split(":");
  this.TimeStartValue = new Date(date.getFullYear(), mnth, day, date.getHours(), date.getMinutes(), 0);
   this.TimeEndValue = new Date(date.getFullYear(), mnth, day, date.getHours()+1, date.getMinutes(), 0);

   this.myActivityForm.patchValue({
    TimeStart:new Date(this.TimeStartValue).toString().slice(16, 21),
    TimeEnd:new Date(this.TimeEndValue).toString().slice(16, 21),
  });
   /*** @When: 28-Nov-2023 10-03-2023 @Who:Adarsh Singh @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/
   this.isStartTmeRequired = false;
  this.onChangeEndTime();
}
/*
@Type: File, <ts>
@Name: onChangeEndTime()
@Who: adarsh singh
@When: 28-Nov-2023 17-mar-2023
@Why:EWM-11055 EWM-11093 
@What: change time
*/
onChangeEndTime() {
  let getStartTimeHM:any = new Date(this.TimeStartValue).toString().slice(16, 21);
 let getEndTimeHM:any = new Date(this.TimeEndValue).toString().slice(16, 21);
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
 this.isStartTmeRequired = false;
 this.isEndTmeRequired = false;
}

/*
  @Type: File, <ts>
  @Name: handleChangeEndTime function
  @Who: Adarsh Singh
  @When: 28-Nov-2023 17-Mar-2023
  @Why: EWM-11055 EWM-11093
  @What: getting End time value which i have selected for
*/
handleChangeEndTime(e:any){
  this.TimeEndValue = e;
  this.onChangeEndTime();
}
  /*
    @Type: File, <ts>
    @Name: clearStartDate function
    @Who: Adarsh Singh
    @When: 28-Nov-2023 17-mar-2022
    @Why:EWM-11055 EWM-11093
    @What: For clear start  date 
 */
    clearStartDate(e){
      this.myActivityForm.patchValue({
        DateStart: null
      });
  
    }
     /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: Adarsh Singh 
    @When: 28-Nov-2023 17-mar-2022
    @Why:EWM-11055 EWM-11093
    @What: For clear end  date 
     */
    clearEndDate(e){
      this.myActivityForm.patchValue({
        DateEnd: null
      });
   
    }
     /*
@Type: File, <ts>
@Name: addDateEnd()
@Who: Adarsh Singh
@When: 28-Nov-2023 17-Mar-2023
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
@Who: Adarsh Singh
@When: 28-Nov-2023 17-Mar-2023
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
  this.isDateEnd = false;

}
   /*
@Type: File, <ts>
@Name: onChangeTimezone()
@Who: Adarsh Singh
@When: 28-Nov-2023 17-mar-2023
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
    /*** @When: 28-Nov-2023 10-03-2023 @Who:Adarsh Singh @Why: EWM-10632 EWM-10981 @What: null handling **/
    const date = this.changeTimezone(startDate, event?.Id);
    const dateEnd = this.changeTimezone(endDate, event?.Id);
    this.currentStartDate = date;
    this.myActivityForm.patchValue({
      TimeStart: formatTime(date),
      TimeEnd: formatTime(dateEnd),
      DateEnd: date,
    })

    // --------@When: 28-Nov-2023 03-Mar-2023 @who:Adarsh Singh singh @why: EWM-10688 EWM-10940 Desc- chnage time while chnage the timezone --------
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
@Who: Adarsh Singh
@When: 28-Nov-2023 17-mar-2022
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
  @Who: Adarsh Singh
  @When: 28-Nov-2023 20-mar-2022
  @Why:EWM-11254 EWM-11257
  @What: get data when activity change
*/
compareFn(c1: any, c2: any): boolean {
  return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
}
/*
     @Type: File, <ts>
     @Name: scheduleInfo
     @Who: Adarsh Singh
     @When: 28-Nov-2023 17-MAR-2023
     @Why:EWM-11055 EWM-11093
     @What: data create for my activity
     */
     scheduleInfo(value){
      this.onChangeEndTime();
      let scheduleFormData = {};
      let getStartTimeHM:any = new Date(this.TimeStartValue).toString().slice(16, 21);
      let getEndTimeHM = new Date(this.TimeEndValue).toString().slice(16, 21);
      scheduleFormData['TimeZone'] = value.TimeZone.Timezone;   
      scheduleFormData['TimeZoneID'] = "Australia/Sydney";
      let localstartDate = new Date(value.DateStart);
      let local_startDate = this.commonserviceService.getTimeAndpatchInDate(localstartDate, getStartTimeHM);
      scheduleFormData['DateStart'] = local_startDate;
      scheduleFormData['TimeStart'] = getStartTimeHM;
      let localendDate = new Date(value.DateEnd)
      let local_endDate = this.commonserviceService.getTimeAndpatchInDate(localendDate, getEndTimeHM);
      scheduleFormData['DateEnd'] = local_endDate;
      scheduleFormData['TimeEnd'] = getEndTimeHM; 
      this.scheduleTimeData=scheduleFormData;
     }
     /*
  @Type: File, <ts>
  @Name: openTemplateModal
  @Who: Adarsh Singh
  @When: 28-Nov-2023 20-March-2023
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
      data: {isMyActivity:true,selectedTemplateId:this.selectedTemplateId,tabActiveIndex:this.tabActiveIndex,tabActive:this.tabActive},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     if(res!=false){
      this.systemSettingService.getEmailTemplateByID('?id=' + res.data.Id).subscribe(
        (repsonsedata:ResponceData) => {
          this.selectedTemplateId = res.data.Id;
          this.tabActiveIndex = res.tabActiveIndex;
          this.tabActive = res.tabActive;
          this.loading = false;
           if (repsonsedata.HttpStatusCode === 200) {   
            let cceList = repsonsedata.Data.CcEmail?.split(',');
            this.optionalAttendeesList = [];
            for (let itr2 = 0; itr2 < cceList?.length; itr2++) {
              if (cceList[itr2]?.length != 0 && cceList[itr2] != '') {
                this.optionalAttendeesList.push({ Name: cceList[itr2],Email: cceList[itr2]});               
              }
            }
              this.myActivityForm.patchValue({
              'ActivityTitle': repsonsedata.Data.Subject,
              'Description': repsonsedata['Data'].TemplateText
            });
             // adarsh singh singh EWM-14288 on 23-09-2023 
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
  @Who: Adarsh Singh
  @When: 28-Nov-2023 20-March-2023
  @Why: EWM-11273
  @What: For Insert Job tag value
*/
getInsertPlaceholderByType(insertType) {
  this.systemSettingService.getPlaceholderByType(insertType).subscribe(
    respdata => {
      if (respdata['Data']) {
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
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

/*
    @Type: File, <ts>
    @Name: onEditMeetingURlActivity
    @Who: adarsh singh
    @When: 28-Nov-2023 27-march-2023
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
          this.readonly=false;
          
        } else{
          this.readonly=true;
        }
      });
    }
 /*
    @Type: File, <ts>
    @Name: clearDate function
    @Who: Bantee
    @When: 28-Nov-2023 27-mar-2023
    @Why:EWM-11204 EWM-11238
    @What: For clear date 
 */
clearDate(e){
  this.myActivityForm.patchValue({
    slotDate: null
  });
}
   /*
  @Type: File, <ts>
  @Name: previewEmailPopUp
  @Who: Adarsh Singh
  @When: 28-Nov-2023 17-March-2023
  @Why: EWM-11104
  @What: For open preview Email popup
*/
previewEmailPopUp() {
  const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
    // @adarsh singh @whn 29-03-2023 @why dynamic email template preview data for activity section
    data: new Object({ subjectName: this.myActivityForm.get("ActivityTitle").value, emailTemplateData: this.myActivityForm.get("Description").value, RelatedUserType: this.myActivityForm.get("RelatedUserType").value, RelatedUserId: this.myActivityForm.get("RelatedUserId").value, isActivity: true }),
    panelClass: ['xeople-modal-lg', 'emailPreview', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
}

 
/*
 @Name: copyActivityPlayUrl
 @Who:Adarsh Singh
 @When: 28-Nov-2023 31-March-2023
 @Why: EWM-11401
 @What: For copy play url.
*/
copyActivityPlayUrl(jobApplicationUrl){ 
this.messageCopy = true;
this.label_copied='label_copiedMeetingRecordingUrl'
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
@Who:Adarsh Singh
@When: 28-Nov-2023 31-March-2023
@Why: EWM-11401
@What: For copy zoom play url.      
*/
copyZoomRecordingPassword(jobApplicationUrl){ 
this.messageCopy = true;
this.label_copied='label_copiedPassword'
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
   @Who: Adarsh singh
   @When: 28-Nov-2023 10-April-2023
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

  //@adarsh singh @whn 14-06-2023 @EWM-12726
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
//@adarsh singh @whn 14-06-2023 @EWM-12726
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
  @Who: Adarsh Singh singh
  @When: 28-Nov-2023 24-July-2023
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

 
 /*
@Type: File, <ts>
@Name: onToggleDateAndTime function
@Who: Adarsh Singh singh
@When: 28-Nov-2023 26-Nov-2023
@Why: EWM-15160
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
@Who: Adarsh Singh singh
@When: 28-Nov-2023 26-Nov-2023
@Why: EWM-15160
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
getAllRegion() {
  this.getAccountPreference();
  if (this.scheduleData24Hrs != undefined && this.scheduleData24Hrs != null && this.scheduleData24Hrs != '') {
    this.patchScheduleData(this.scheduleData24Hrs);
  }

}
/*
@Type: File, <ts>
@Name: dropdownConfig function
@Who: Adarsh Singh singh
@When: 28-Nov-2023 26-Nov-2023
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
}
 
  /*
@Type: File, <ts>
@Name: onConfirm function
@Who: Adarsh Singh singh
@When: 28-Nov-2023 24-Aug-2023
@Why: EWM-15160
@What: for add and edit
 */
onConfirm(value) {
  this.isResponseGet = true;
  this.saveActivity(value)
}
  /*
@Type: File, <ts>
@Name: saveActivity
@Who: Adarsh Singh singh
@When: 28-Nov-2023 24-Aug-2023
@Why: EWM-15160
@What: data create for my activity
 */
saveActivity(value) {
  this.scheduleInfo(value);
  let files = [];
  this.fileAttachments.forEach(element => {
    if (element.hasOwnProperty('Path')) {
      files.push(element);
    }
  });
 
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
        Type: element?.Type
      })
    }
  })
  
  this.scheduleTimeData.TimeZoneID =  value.TimeZoneID;
  let myActivityJson:CreateActivity = {
    ActivityTitle:value.ActivityTitle?.trim(),
    RelatedUserType:value.RelatedUserType,
    RelatedUserTypeName:value.RelatedUserTypeName,
    RelatedUserId:value.RelatedUserId,
    RelatedUserUserName:value.RelatedUserUserName,
    CategoryId:value.CategoryId ? value.CategoryId : 0,
    CategoryName:value.CategoryName,
    ScheduleActivity: this.scheduleTimeData,
    Location:value.Location,
    OptionalAttendeesList:  optionalAttendeesListArr,
    AttendeesList: requiredAttendeesList,
    OrganizersList:value.OrganizerOrAssignees,
    ActivityUrl:value.ActivityUrl,
    AccessId:value.AccessId,
    AccessName:value.AccessName,
    Description:value.Description?.trim(),
    GrantAccesList:  this.accessEmailId,
    IsAttachment: this.fileAttachments.length > 0 ? 1 : 0,
    Files: files,
    ActivityCoreUrl: window.location.href,
    MeetingPlatformId:value.MeetingPlatform ? value.MeetingPlatform : '00000000-0000-0000-0000-000000000000',
    MeetingPlatform: this.meetingPlatformName,
    MeetingId: this.MeetingId,
    IsSendCalendarInviteToAttendees:value.IsSendCalendarInviteToAttendees ? 1 : 0,
    IsSendEmailToAttendees:value.IsSendEmailToAttendees ? 1 : 0,
    ReplaceTag: ReplaceTagArr
 }
  this.systemSettingService.AddMyActivity(myActivityJson)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
          this.isResponseGet = false;
          this.onDismiss();
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.isResponseGet = false;
        }
      }, err => {
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
}

  /*
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Adarsh Singh singh
    @When: 28-Nov-2023 24-Aug-2023
    @Why: EWM-15160
    @What: drawer close
    */
    onDismiss() {
      document.getElementsByClassName("quickAddActivity")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("quickAddActivity")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
    }
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

}