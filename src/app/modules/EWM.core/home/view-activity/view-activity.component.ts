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
import { AddRequiredAttendeesComponent } from '../my-activity/add-required-attendees/add-required-attendees.component';
import { ScheduleAssistanceDatePopupComponent } from '../my-activity/schedule-assistance-date-popup/schedule-assistance-date-popup.component';
import * as moment from 'moment';
@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {
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
  isNoRecordCategory: boolean = false;
  constructor(private fb: FormBuilder, public dialog: MatDialog, private appSettingsService: AppSettingsService, private datePipe: DatePipe,
    private http: HttpClient, private snackBService: SnackBarService, public candidateService: CandidateService,
    private route: ActivatedRoute, private router: Router, public _sidebarService: SidebarService, private _profileInfoService: ProfileInfoService,
    private commonserviceService: CommonserviceService, public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService, private serviceListClass: ServiceListClass, private quickJobService: QuickJobService,
    private systemSettingService: SystemSettingService, public _integrationsBoardService: IntegrationsBoardService, private mailService: MailServiceService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,private renderer: Renderer2,
    private dataService: CommonDropDownService) {
    /*** @When: 09-03-2023 @Who:Renu @Why: EWM-10648 EWM-10765 @What:make defualt access public **/
    this.AccessId = this.appSettingsService.getDefaultAccessId;
    this.AccessName = this.appSettingsService.getDefaultaccessName;
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
    this.myActivityDataBy(this.activityId);
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    this.TimeEndValue = nowTime;
    // end
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
          this.loading = false;
          if (data.HttpStatusCode === 200) {
            this.oldPatchValues = data.Data;
            this.accessEmailId = this.oldPatchValues?.GrantAccesList;
            let res = data.Data;
            this.selectedRelatedUser = { 'Id': res.RelatedUserId, 'Name': res.RelatedUserUserName }
            // this.dataService.setSelectedData(this.selectedRelatedUser);
            this.selectedCategory = res.CategoryId;
            this.getActivityTypeCategory(res.RelatedUserType);
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
              }
            }
            if (res.OptionalAttendeesList != '') {
              this.optionalAttendeesList = res.OptionalAttendeesList;
            }
            if (this.requiredAttendeesList?.length == 0 && this.optionalAttendeesList?.length == 0) {
              this.isRequiredAttendees = false;
            } else {
              this.isRequiredAttendees = true;
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
            this.patchScheduleData(this.scheduleData);
            const startdatetime = new Date(startDate);
            let slotDate = new Date(startdatetime.getFullYear(), startdatetime.getMonth(), startdatetime.getDate(), startdatetime.getHours(), startdatetime.getMinutes() - startdatetime.getTimezoneOffset()).toISOString().slice(0, 10);
            this.slotStartDate = startDate;
            this.slotsStartDate = this.slotStartDate;   // @suika @EWM-12408 @date changes time remains same
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
  getActivityTypeCategory(activityFor: string) {
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
}
