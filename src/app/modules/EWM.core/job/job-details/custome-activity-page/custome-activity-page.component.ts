/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Maneesh
  @When: 30-06-22
  @Why: EWM.7363 EWM.7181
  @What: This page is creted for  Create/edit activity common component 
*/
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { OwnerFilterActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/owner-filter-activity/owner-filter-activity.component';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ButtonTypes, ResponceData, SCREEN_SIZE, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddRequiredAttendeesComponent } from '../../../home/my-activity/add-required-attendees/add-required-attendees.component';
import { OrganizerOrAssineesComponent } from '../../../home/my-activity/organizer-or-assinees/organizer-or-assinees.component';
import { ScheduleComponent } from '../../../home/my-activity/schedule/schedule.component';
import { customDropdownConfig } from '../../../shared/datamodels';
import { CandidateService } from '../../../shared/services/candidates/candidate.service';
import { IntegrationsBoardService } from '../../../shared/services/profile-info/integrations-board.service';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { CandidateTimelineComponent } from '../../candidate-timeline/candidate-timeline.component';
// import { RemoveCandidateComponent } from '../remove-candidate/remove-candidate.component';


@Component({
  selector: 'app-custome-activity-page',
  templateUrl: './custome-activity-page.component.html',
  styleUrls: ['./custome-activity-page.component.scss']
})
export class CustomeActivityPageComponent implements OnInit {
  public ActivityTypeList: any[] = [];
  public myActivityForm: FormGroup;
  activityForAttendees: any;
  isAttendeesReq: boolean;
  loading: boolean;
  public category:string='JOB';
  // public documentForJob = 'Job'
  candidateIdData: any;
  accessEmailId: any;
  fileAttachments: any;
  meetingPlatformName: any;
  MeetingId: any;

  sidenav: any;
  // action: boolean = false;
  selectedCategory: {};
  clientActivityCount: any;
  gridMonthYearCount: any;
  yearFilterRes: number;
  monthFilterRes: string;
  public ToDate: any;
  public FromDate: any;
  public OwnerIds: any = [];
  public assignJobDrawerPos: string;
  public notesDrawerPos: string = 'end';
  public oldPatchValues: any = {};
  public formHeading: string;
  public CategoryIds: any = [];
  public selectedIndex: number = null;
  // @ViewChild('target', { read: ElementRef }) public myScrollContainer: ElementRef<any>;
  public hoverIndex: number = -1;
  public tagNotesKey: any[] = [];
  public maxCharacterLengthSubHead = 500;
  public filterCountCategory: number = 0;
  public filterCountOwner: number = 0;
  pagesize: any;
  isLocationActive: boolean = false;
  public loadingAssignJobSaved: boolean;
  loaderStatus: number;
  public totalDataCount: number;
  public documentForJob = 'Job'
  dataTotalActivity: any;
  dataTotalNotes: any;
  visibilityStatus: any;
  RegistrationCode:any;
  positionMatTab: any;
  public ResumeName:any;
  public FileName: any;
  public ResumeId: any;
  animationVar:any;
  zoomPhoneCallRegistrationCode:any;
  zoomCheckStatus:boolean= false;
  gridList: any;
  pagneNo: any;
  clientIdData: any;
  pageNo = 1;
  CalendarExternalId: any;
  meetingPlatformList: any;
  JobId: any;
  candidateId: any;
  JobName: any;
  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public dateFill = new Date();
  public today = new Date();
  // public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];
  activestatus: string;
  public dropDoneConfig: customDropdownConfig[] = [];
  public userpreferences: Userpreferences;
  public dropDownRelatedUserConfig: customDropdownConfig[] = [];
  clientId: any;
  positionMatDrawer: string;
resetFormSubjectRelatedUser: Subject<any> = new Subject<any>();
  selectedRelatedUser: any;
  canLoad: boolean;
  pendingLoad: any;
  loadingscroll: boolean;
  Names: any;
  meetingPlatformData: any;
  MeetingUrl: any;
  meetingUrlData: any;

  Employee: string = 'Candidate';
  @ViewChild('titleActivity') titleActivity: MatInput;
  public requiredAttendeesList: any = [];
  public organizerOrAssigneesList: any = [];
  public removable = true;
  @Output() myActivityDrawerClose: EventEmitter<any> = new EventEmitter<any>();
  RelatedUserId: any;
  public userId: string;
  action: boolean = false;
  filePath: any;
  
  uploadedFileName: any;
  CategoryId: any;

  constructor( private appSettingsService: AppSettingsService, private routes: ActivatedRoute,  private commonServiesService: CommonServiesService, public _userpreferencesService: UserpreferencesService,   private commonserviceService: CommonserviceService, private serviceListClass: ServiceListClass,   private fb: FormBuilder, public _integrationsBoardService: IntegrationsBoardService,
     private quickJobService: QuickJobService,private snackBService: SnackBarService,public candidateService: CandidateService,
     private translateService: TranslateService,public dialog: MatDialog,  private _SystemSettingService: SystemSettingService,) {
      this.pagesize = appSettingsService.pagesize;

     this.myActivityForm = this.fb.group({
      Id: [],
      ActivityTitle: ['', [Validators.required, Validators.maxLength(50)]],
      RelatedUserType: [null],
      RelatedUserTypeName: [''],
      RelatedUserId: [null],
      RelatedUserUserName: [''],
      CategoryId: ['', [Validators.required]],
      CategoryName: [''],
      ScheduleActivity: [null, [Validators.required]],
      Location: ['', [Validators.maxLength(100)]],
      AddRequiredAttendees: [null, [Validators.required]],
      OrganizerOrAssignees: [],
      ActivityUrl: ['', [Validators.maxLength(2048)]],
      AccessName: ['', [Validators.required]],
      AccessId: [],
      Description: [''],
      file: [''],
      MeetingPlatform: []
    });
    
      }

  
  ngOnInit(): void {
    this.getAllInviteUser(this.userId);
    this.getMeetingPlatformList();
    this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
 // add activity 
    
 this.myActivityForm.patchValue({
  'RelatedUserType': this.category,
  'RelatedUserId': this.candidateIdData
});

this.onChangeActivityRelatedTo(this.category);
this.getMeetingPlatformList();
this.myActivityForm.controls["RelatedUserType"].disable();
//this.RelatedUserId=this.candidateIdData;

let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
this.userId = currentUser?.UserId;
this.getAllInviteUser(this.userId);


this.commonServiesService.event.subscribe(res => {
  this.dirChange(res);
});
this.userpreferences = this._userpreferencesService.getuserpreferences();
this.routes.queryParams.subscribe((value) => {
  if (value.clientId != undefined && value.clientId != null && value.clientId != '') {
    this.clientId = value.clientId;
  }
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
this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
this.getClientYearMonthList();
// this.getNoteCateogoryList();
this.dropDoneConfig['IsDisabled'] = false;
this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.notesCategoryList + '?UserType=' + this.category;
this.dropDoneConfig['placeholder'] = 'label_category';
this.dropDoneConfig['searchEnable'] = true;
this.dropDoneConfig['IsManage'] = './client/core/administrators/notes-category';
this.dropDoneConfig['bindLabel'] = 'CategoryName';
this.dropDoneConfig['IsRequired'] = true;
var element = document.getElementById("add-new-activity");
element?.classList.remove("add-new-activity");
// it is for testing purpose candidate id
// this.candidateIdData = "745a1a03-4507-496b-8f84-04f76e5ef6ea";
// this.Names = "maneesh";
//  activity end 
  }
 
/*
  @Type: File, <ts>
  @Name: getActivityTypeCategory
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: get data category when selcet activity related to
  */
 getActivityTypeCategory(activityFor) {
  this._SystemSettingService.getAllActivityListCategory("?search="  + activityFor+'&ByPassPaging=true&FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND').subscribe(
    (repsonsedata: any) => {
      
      if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
        //  this.loading = false;
        
        this.ActivityTypeList = repsonsedata.Data;
      } else {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

      }
    }, err => {
      //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
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
openModelForSchedule() {
  const dialogRef = this.dialog.open(ScheduleComponent, {
    maxWidth: "650px",
    data: new Object({ scheduleData: this.scheduleData }),
    width: "80%",
    maxHeight: "85%",
    panelClass: ['quick-modalbox', 'AddSchedule', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe((res) => {
    if (res.isSchedule == true) {
      this.scheduleData = res.scheduleData;
      this.myActivityForm.patchValue({
        ScheduleActivity: this.scheduleData,
      })

    } else {
      this.myActivityForm.patchValue({
        ScheduleActivity: null,
      })
    }
  })
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
  @Name: openModelAddRequiredAttendees
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: open Modal for AddRequiredAttendees
  */
 openModelAddRequiredAttendees() {
  const dialogRef = this.dialog.open(AddRequiredAttendeesComponent, {
    maxWidth: "650px",
    data: new Object({ requiredAttendeesList: this.requiredAttendeesList, activityForAttendees: this.activityForAttendees, clientIdData: this.candidateIdData }),
    width: "80%",
    maxHeight: "85%",
    panelClass: ['quick-modalbox', 'AddRequiredAttendees', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe((res) => {    
    if (res) {
      this.requiredAttendeesList = res;
      this.myActivityForm.patchValue({
        'AddRequiredAttendees': this.requiredAttendeesList
      })
    }
    else {      
      this.myActivityForm.patchValue({
        AddRequiredAttendees: null,
      })
      if (this.requiredAttendeesList.length == 0) {
        this.myActivityForm.controls['AddRequiredAttendees'].setErrors({ 'required': true });
        this.isAttendeesReq = true;
      } else {
        this.isAttendeesReq = false;
      }
    }   
  })
  
}



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
    if (this.requiredAttendeesList.length == 0) {
      this.myActivityForm.controls['AddRequiredAttendees'].setErrors({ 'required': true });
      this.isAttendeesReq = true;
    } else {
      this.isAttendeesReq = false;
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
      // this.loading = false;
    }
  })
}
createActivity(value) {
  this.loading = true;
  let myActivityJson = {};
  myActivityJson["ActivityTitle"] = value.ActivityTitle;
  myActivityJson["RelatedUserType"] = this.category;
  myActivityJson["RelatedUserTypeName"] = value.RelatedUserTypeName;
  myActivityJson["RelatedUserId"] = this.candidateIdData;
  myActivityJson["RelatedUserUserName"] = value.RelatedUserUserName;
  myActivityJson["CategoryId"] = value.CategoryId;
  myActivityJson["CategoryName"] = value.CategoryName;
  myActivityJson["ScheduleActivity"] = this.scheduleData;
  myActivityJson["Location"] = value.Location;
  myActivityJson["AttendeesList"] = this.requiredAttendeesList;
  myActivityJson["OrganizersList"] = this.organizerOrAssigneesList;
  myActivityJson["ActivityUrl"] = value.ActivityUrl;
  myActivityJson["AccessId"] = value.AccessId;
  myActivityJson["AccessName"] = value.AccessName;
  myActivityJson["Description"] = value.Description;
  myActivityJson["GrantAccesList"] = this.accessEmailId;
  // myActivityJson['Attachment'] =this.filePath;
  // myActivityJson['AttachmentName'] =this.uploadedFileName;
  myActivityJson['IsAttachment'] = this.fileAttachments.length > 0 ? 1 : 0;
  myActivityJson['Files'] = this.fileAttachments;
  myActivityJson['ActivityCoreUrl'] = window.location.href;

  myActivityJson["MeetingPlatformId"] = value.MeetingPlatform?value.MeetingPlatform:'00000000-0000-0000-0000-000000000000';
  myActivityJson["MeetingPlatform"] = this.meetingPlatformName;
  myActivityJson["MeetingId"] = this.MeetingId;
  //console.log("myActivityJson:",myActivityJson);
  this._SystemSettingService.AddMyActivity(myActivityJson)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.scheduleData = [];
          this.requiredAttendeesList = [];
          this.organizerOrAssigneesList = [];
          this.myActivityForm.reset();
          this.fileAttachments = [];
          this.oldPatchValues = {};
          this.loading = false;
          this.action = false;
          this.sidenav.close();
          this.getAllInviteUser(this.userId);
          this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
          this.getClientYearMonthList();
          this.clientActivityCount.emit(true);
          this.selectedCategory = {};
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
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
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

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
  // this.formHeading = 'Add';
  this.myActivityForm.reset();
  this.oldPatchValues = {};
  this.accessEmailId = [];
  // this.selectedCategory = {};
  this.requiredAttendeesList = [];
  this.organizerOrAssigneesList = [];
  this.scheduleData = [];
  // this.getAllInviteUser(this.userId);
  this.myActivityForm.patchValue({
    'RelatedUserType': this.category,
    'RelatedUserId': this.candidateIdData
  });
}
getClientYearMonthList() {
  let jsonObj = {};
  jsonObj['CandidateId'] = this.candidateIdData;
  jsonObj['OwnerIds'] = [];
  jsonObj['CategoryIds'] = [];
  jsonObj['FromDate'] = null;
  jsonObj['ToDate'] = null;
  //jsonObj['GridId'] = this.GridId;
  this.candidateService.fetchActivityMonthYearCountAll(jsonObj)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.gridMonthYearCount = data.Data;
          this.loading = false;
        }
        else if (data.HttpStatusCode === 204) {

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

getActivityList(clientId: any, year: number, month: string, pageNo) {

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

  this.candidateService.fetchActivityAll(jsonObj)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.totalDataCount = data.TotalRecord;
          this.gridList = data.Data;
          this.loading = false;

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
/*
  @Type: File, <ts>
  @Name: getAllInviteUser
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: get All Invite User
  */
 getAllInviteUser(userId) {
  this.quickJobService.fetchUserInviteListForOrganization().subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.organizerOrAssigneesList = repsonsedata.Data.filter((e: any) => e.UserId === userId);
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      // this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

onDismiss(): void {
  this.action = false;
  this.sidenav.close();
  this.requiredAttendeesList = [];
  this.organizerOrAssigneesList = [];
  this.scheduleData = [];
  this.oldPatchValues = {};
  this.accessEmailId = [];
  this.myActivityForm.reset();
  this.getAllInviteUser(this.userId);
  this.myActivityForm.patchValue({
    'RelatedUserType': this.category,
    'RelatedUserId': this.candidateIdData
  });
}


/*
@Type: File, <ts>
@Name: updateActivity function
@Who: Nitin Bhati
@When: 13-Jan-2022
@Why: EWM-4545
@What: on update the data client Activity
*/
updateActivity(value) {
  this.loading = true;
  let updateActivityJson = {};
  updateActivityJson["Id"] = value.Id;
  updateActivityJson["ActivityTitle"] = value.ActivityTitle;
  updateActivityJson["RelatedUserType"] = this.category;//value.RelatedUserType;
  updateActivityJson["RelatedUserTypeName"] = value.RelatedUserTypeName;//value.RelatedUserType;
  updateActivityJson["RelatedUserId"] = this.candidateIdData;//value.RelatedUserId ;
  updateActivityJson["RelatedUserUserName"] = value.RelatedUserUserName;//value.RelatedUserId ;
  updateActivityJson["CategoryId"] = value.CategoryId;
  updateActivityJson["CategoryName"] = value.CategoryName;
  updateActivityJson["ScheduleActivity"] = this.scheduleData;
  updateActivityJson["Location"] = value.Location;
  updateActivityJson["AttendeesList"] = this.requiredAttendeesList;
  updateActivityJson["OrganizersList"] = this.organizerOrAssigneesList;
  updateActivityJson["ActivityUrl"] = value.ActivityUrl;
  updateActivityJson["AccessId"] = value.AccessId;
  updateActivityJson["AccessName"] = value.AccessName;
  updateActivityJson["Description"] = value.Description;
  updateActivityJson["GrantAccesList"] = this.accessEmailId;
  // updateActivityJson['Attachment'] =this.filePath;
  // updateActivityJson['AttachmentName'] =this.uploadedFileName;
  updateActivityJson['IsAttachment'] = this.fileAttachments.length > 0 ? 1 : 0;
  updateActivityJson['Files'] = this.fileAttachments;
  updateActivityJson['ActivityCoreUrl'] = window.location.href;
  updateActivityJson["MeetingPlatformId"] = value.MeetingPlatform?value.MeetingPlatform:'00000000-0000-0000-0000-000000000000';
  updateActivityJson["MeetingPlatform"] = this.meetingPlatformName;
  updateActivityJson["MeetingId"] = this.MeetingId;
  updateActivityJson["CalendarExternalId"] = this.CalendarExternalId;
  this.candidateService.EditActivityAll(updateActivityJson)
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
          this.myActivityForm.reset();
          this.getAllInviteUser(this.userId);
          this.sidenav.close();
          this.tagNotesKey[value.Id] = 'updated';
          this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
          this.selectedCategory = {};
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
@Name: onRemoveMeetingChange function
@Who: Nitin Bhati
@When: 05-May-2022
@Why: EWM-6049
@What: For remove in MeetingPlatform
*/
onRemoveMeetingChange() {
  this.MeetingId = null;
    this.myActivityForm.patchValue(
      {
        ActivityUrl: null,
      })
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
  let intergrationType='Connected';
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
  @Name: openManageAccessModal
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: to open quick add Manage Access modal dialog
*/
openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
  //console.log(this.clientId,this.oldPatchValues,"data")
  const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
    // maxWidth: "550px",
    data: { candidateId: this.clientId, Id: Id, Name: Name, AccessModeId: this.oldPatchValues, ActivityType: 1 },
    // width: "95%",
    // maxHeight: "85%",
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
}


openTimelinePopup(candidateId, workflowId) {
  this.candidateId = candidateId;
  const dialogRef = this.dialog.open(CandidateTimelineComponent, {
    data: { candidateId: candidateId, jobId: this.JobId, workflowId: workflowId },
    panelClass: ['xeople-modal-lg', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
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
        this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
      } else {
        this.fileAttachmentsOnlyTow = this.fileAttachments
      }


    }
 
  })
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
  if (this.activestatus == 'Add') {
    this.createActivity(value);
  } else {
    this.updateActivity(value);
  }
}
onChangeActivityRelatedTo(activityFor) {
  this.selectedRelatedUser = null;
  this.activityForAttendees = activityFor;
  if (activityFor == "JOB") {
    this.myActivityForm.patchValue({
      'RelatedUserTypeName': 'Job'
    })
    this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllJobForActivity;
    this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
    this.selectedRelatedUser = { 'Id': this.candidateIdData };
    this.getActivityTypeCategory(activityFor);

  } else if (activityFor == "CAND") {
    this.myActivityForm.patchValue({
      'RelatedUserTypeName': 'Candidate'
    })
    this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllCandidateForActivity;
    this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
    this.selectedRelatedUser = { 'Id': this.candidateIdData };
    this.getActivityTypeCategory(activityFor);

  } else if (activityFor == "EMPL") {
    this.myActivityForm.patchValue({
      'RelatedUserTypeName': 'Employee'
    })
    this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllEmployeeForActivity;
    this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
    this.selectedRelatedUser = { 'Id': this.candidateIdData };
    this.getActivityTypeCategory(activityFor);

  } else if (activityFor == "CLIE") {
    this.myActivityForm.patchValue({
      'RelatedUserTypeName': 'Client'
    })
    this.dropDownRelatedUserConfig['apiEndPoint'] = this.serviceListClass.getAllClientForActivity;
    this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
    this.selectedRelatedUser = { 'Id': this.candidateIdData };
    this.getActivityTypeCategory(activityFor);

  } else {
    this.myActivityForm.patchValue({
      'RelatedUserTypeName': ''
    })
    this.selectedRelatedUser = null;
    this.resetFormSubjectRelatedUser.next(this.dropDownRelatedUserConfig);
  }

}

dirChange(res) {
  if (res == 'ltr') {
    this.positionMatDrawer = 'end';
  } else {
    this.positionMatDrawer = 'start';
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


formType(value,CandidateId,RelatedUser) {
  this.candidateIdData = CandidateId;
  this.Names = RelatedUser;
  
  this.myActivityForm.enable();
  this.action = false;
  this.formHeading = 'Add';
  this.activestatus = value;
  //this.formHeading = value;
  this.dateFill = new Date();
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
  this.meetingPlatformData = this.meetingPlatformList?.filter((dl: any) => dl.RegistrationCode == RegistrationCodeId);
  this.meetingPlatformName = this.meetingPlatformData[0]?.Name;    
  this.getCreateMeetingUrl();      
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
  this.loading = true;
  let AddObj={};
  AddObj['Title'] = this.myActivityForm.get("ActivityTitle")?.value;
  AddObj['ScheduleActivity'] = this.scheduleData;
  AddObj['MeetingPlatformId'] = this.myActivityForm.get("MeetingPlatform").value?this.myActivityForm.get("MeetingPlatform").value:'00000000-0000-0000-0000-000000000000';
  this._integrationsBoardService.createMeetingUrl(AddObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        this.loading = false;
        let meetingUrlData = repsonsedata.Data;
        this.MeetingId=repsonsedata.Data.MeetingId;
        this.MeetingUrl=repsonsedata.Data.MeetingUrl;
        this.myActivityForm.patchValue({
            'ActivityUrl': repsonsedata.Data.MeetingUrl
        });
        this.myActivityForm.controls["ActivityUrl"].disable();
      } else if(repsonsedata.HttpStatusCode == '400'){
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.myActivityForm.patchValue(
          {
            ActivityUrl: null,
          })
      }else {
        this.meetingUrlData = null;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}


/*
@Type: File, <ts>
@Name: createClientNotes function
@Who: Nitin Bhati
@When: 13-Jan-2022
@Why: EWM-4545
@What: on saving the data client Notes
*/
createClientNotes(value) {
  this.loading = true;
  let myActivityJson = {};
  myActivityJson["ActivityTitle"] = value.ActivityTitle;
  myActivityJson["RelatedUserType"] = value.RelatedUserType;
  myActivityJson["RelatedUserId"] = value.RelatedUserId;
  myActivityJson["CategoryId"] = value.CategoryId;
  myActivityJson["ScheduleActivity"] = this.scheduleData;
  myActivityJson["Location"] = value.Location;
  myActivityJson["AttendeesList"] = this.requiredAttendeesList;
  myActivityJson["OrganizersList"] = this.organizerOrAssigneesList;
  myActivityJson["ActivityUrl"] = value.ActivityUrl;
  myActivityJson["AccessId"] = value.AccessId;
  myActivityJson["AccessName"] = value.AccessName;
  myActivityJson["Description"] = value.Description;
  myActivityJson["GrantAccesList"] = this.accessEmailId;
  myActivityJson['Attachment'] = this.filePath;
  myActivityJson['AttachmentName'] = this.uploadedFileName;
  this._SystemSettingService.AddMyActivity(myActivityJson)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.loading = false;
          this.sidenav.close();
          this.getActivityList(this.clientIdData, this.yearFilterRes, this.monthFilterRes, this.pagneNo);
          this.getClientYearMonthList();
          this.clientActivityCount.emit(true);
          this.myActivityForm.reset();
          this.selectedCategory = {};
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
@Name: editClientForm function
@Who: Nitin Bhati
@When: 13-Jan-2022
@Why: EWM-4545
@What: getting Activity data based on specific Id
*/
editClientForm(Id: any, mode: any) {

  if (mode == 'view') {
    this.action = true;
    this.myActivityForm.controls["ActivityTitle"].disable();
    this.myActivityForm.controls["RelatedUserType"].disable();
    this.myActivityForm.controls["RelatedUserId"].disable();
    this.myActivityForm.controls["CategoryId"].disable();
    this.myActivityForm.controls["ScheduleActivity"].disable();
    this.myActivityForm.controls["Location"].disable();
    this.myActivityForm.controls["AddRequiredAttendees"].disable();
    this.myActivityForm.controls["OrganizerOrAssignees"].disable();
    this.myActivityForm.controls["ActivityUrl"].disable();
    this.myActivityForm.controls["AccessName"].disable();
    this.myActivityForm.controls["AccessId"].disable();
    this.myActivityForm.controls["file"].disable();
  } else {
    this.action = false;
    this.myActivityForm.controls["ActivityTitle"].enable();
    this.myActivityForm.controls["RelatedUserType"].enable();
    this.myActivityForm.controls["RelatedUserId"].enable();
    this.myActivityForm.controls["CategoryId"].enable();
    this.myActivityForm.controls["ScheduleActivity"].enable();
    this.myActivityForm.controls["Location"].enable();
    this.myActivityForm.controls["AddRequiredAttendees"].enable();
    this.myActivityForm.controls["OrganizerOrAssignees"].enable();
    this.myActivityForm.controls["ActivityUrl"].enable();
    this.myActivityForm.controls["AccessName"].enable();
    this.myActivityForm.controls["AccessId"].enable();
    this.myActivityForm.controls["file"].enable();
  }
  //this.myActivityForm.enable();
  //this.myActivityForm.disable();


  this.activestatus = 'Edit';
  this.formHeading = 'Edit';
  this.loading = true;
  this.candidateService.getActivityById('?id=' + Id)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.oldPatchValues = data.Data;
          this.accessEmailId = this.oldPatchValues?.GrantAccesList;
          this.loading = false;
          let res = data.Data;
          this.myActivityForm.patchValue({
            'ActivityTitle': res.ActivityTitle,
            'RelatedUserType': res.RelatedUserType,
            'RelatedUserTypeName': res.RelatedUserTypeName,
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
            'MeetingPlatform': res.MeetingPlatformId,
            //'file':res.AttachmentName
          });
          this.CalendarExternalId=res.CalendarExternalId;
          this.myActivityForm.controls["MeetingPlatform"].disable();
          this.meetingPlatformName=res.MeetingPlatform;
          this.MeetingId=res.MeetingId;
          this.myActivityForm.controls["ActivityUrl"].disable();
          this.fileAttachments = res.Files;
          if (this.fileAttachments.length > 2) {
            this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
          } else {
            this.fileAttachmentsOnlyTow = this.fileAttachments
          }

          this.requiredAttendeesList = [];
          if (res.AttendeesList != '') {
            if (res.AttendeesList.length > 0) {
              let oldAttendeesListValues = res.AttendeesList;
              oldAttendeesListValues.forEach(element => {
                this.requiredAttendeesList.push({
                  Id: element.Id,
                  Name: element.Name,
                  Email: element.Email,
                  Mode: element.Mode,
                  MappingId: element.MappingId,
                })
              });
            }
          }
          if (this.requiredAttendeesList.length == 0) {
            //this.myActivityForm.controls['AddRequiredAttendees'].setErrors({ 'required': true });
            this.isAttendeesReq = true;
          } else {
            this.isAttendeesReq = false;
          }
          this.organizerOrAssigneesList = [];
          if (res.OrganizersList != '') {
            if (res.OrganizersList.length > 0) {
              let oldOrganizersListValues = res.OrganizersList;
              oldOrganizersListValues.forEach(element => {
                // console.log( "OrganiZerArray: "+ JSON.stringify(element));
                this.organizerOrAssigneesList.push({
                  Id: element.Id,
                  Mode: element.Mode,
                  Email: element.Email,
                  UserName: element.UserName,
                  UserId: element.UserId
                })
              });
            }
          }



          this.selectedCategory = { 'Id': res.CategoryId };
          this.selectedRelatedUser = { 'Id': this.candidateIdData };
          /////@Anup Singh patch for category id/////
          //this.RelatedUserId = res.RelatedUserId;
          this.candidateIdData = res.RelatedUserId;
          this.CategoryId = res.CategoryId;
          this.uploadedFileName = res.AttachmentName;

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

          this.scheduleData = patchScheduleData;
          this.onChangeActivityRelatedTo(res.RelatedUserType);

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

openDialogforowner() {
  const dialogRef = this.dialog.open(OwnerFilterActivityComponent, {
    maxWidth: "750px",
    width: "90%",
    // data: dialogData,
    panelClass: ['quick-modalbox', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
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


}
