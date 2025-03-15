/*
@(C): Entire Software
@Type: File, <ts>
@Who: Adarsh singh
@When: 26-June-2023
@Why: EWM-11778.EWM-12850
*/

import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CreateFormGroupArgs, EditMode, EventStyleArgs, MonthViewItemComponent, SchedulerEvent, SlotClassArgs, SlotClickEvent } from '@progress/kendo-angular-scheduler';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

import { ButtonTypes } from 'src/app/shared/models';
import '@progress/kendo-date-math/tz/all';
import { Day, ZonedDate } from '@progress/kendo-date-math';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SlotRange } from '@progress/kendo-angular-scheduler/dist/es2015/views/day-time/day-time-slot.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ActivityDetailComponent } from 'src/app/modules/EWM.core/home/my-activity-calender/activity-detail/activity-detail.component';
import { TimezoneModalComponent } from 'src/app/modules/EWM.core/home/my-activity-calender/timezone-modal/timezone-modal.component';
import { CalenderFilterComponent } from 'src/app/modules/EWM.core/home/my-activity-list/calender-filter/calender-filter.component';
import { CategoryFilterComponent } from 'src/app/modules/EWM.core/home/my-activity-list/category-filter/category-filter.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { JobActivityCreateComponent } from '../header-panel/job-activity-create/job-activity-create.component';
import { Subject, Subscription } from 'rxjs';
import { JobCategoryFilterComponent } from '../header-panel/job-category-filter/job-category-filter.component';
import { JobActivityCalenderDetailsComponent } from './job-activity-calender-details/job-activity-calender-details.component';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { PushCandidatePageType } from '../push-candidate-to-eoh/pushCandidate-model';



const currentYear = new Date().getFullYear();
const currentDate = new Date().getDate();
const currentMonth = new Date().getMonth();

export const displayDate = new Date(currentYear, currentMonth, currentDate);

const parseAdjust = (eventDate: string): Date => {
  const date = new Date(eventDate);
  date.setFullYear(currentYear);
  return date;
};

const randomInt = (min, max): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



@Component({
  selector: 'app-job-activity-calender',
  templateUrl: './job-activity-calender.component.html',
  styleUrls: ['./job-activity-calender.component.scss']
})
export class JobActivityCalenderComponent implements OnInit {

  gridData: any;
  StartTime: any;
  selectedDay: any;
  EndTime: any;
  source: any;
  MeetingPlatformLogoUrl: any;
  public dateFormat:any = "EEE,d MMM";
  isvisible: boolean;
  isMyActivityList:boolean=false;
  syncCandidateDataList: any=[];
  syncInterviewDataListId: any=[];
  ServiceSelectedInterviewer: any=[];
  ServiceSelectedCandidate: any=[];
  OrganiserColorCode: string; 
  onAttendeeId:any;
  WorkFlowStageId: any;   
   // @suika @EWM-13433 Whn 19-07-2023 To send reload api event on data saving.
  @Output() reloadDataEvent = new EventEmitter();
  getEventColorCode(endDate: any, color: any) {
    // let date1 = formatDate(new Date(),'YYYY-MM-dd HH:mm:ss','en_US');
    // let date2  = formatDate(endDate,'YYYY-MM-dd HH:mm:ss','en_US');
    let date1 = formatDate(new Date(), 'YYYY-MM-dd', 'en_US');

    let date2 = formatDate(endDate, 'YYYY-MM-dd', 'en_US');
    if (date1 > date2) {
      return this.hexToRGB('#F44336', 0.10);
    } else if (date1 < date2) {
      return this.hexToRGB('#2196f3', 0.10);
    } else {
      return this.hexToRGB('#7fb734', 0.10)
    }
  }

  getEventPopoverBgCode(endDate: any, textcolor: any) {
    // let date1 = formatDate(new Date(),'YYYY-MM-dd HH:mm:ss','en_US');
    // let date2  = formatDate(endDate,'YYYY-MM-dd HH:mm:ss','en_US');
    let date1 = formatDate(new Date(), 'YYYY-MM-dd', 'en_US');

    let date2 = formatDate(endDate, 'YYYY-MM-dd', 'en_US');
    if (date1 > date2) {
      return this.hexToRGB('#F44336', 0.20);
    } else if (date1 < date2) {
      return this.hexToRGB('#2196f3', 0.20);
    } else {
      return this.hexToRGB('#7fb734', 0.20)
    }
  }

  getEventBorderColorCode(endDate: any, activitybordercolor: any) {
    // let date1 = formatDate(new Date(),'YYYY-MM-dd HH:mm:ss','en_US');
    // let date2  = formatDate(endDate,'YYYY-MM-dd HH:mm:ss','en_US');
    let date1 = formatDate(new Date(), 'YYYY-MM-dd', 'en_US');

    let date2 = formatDate(endDate, 'YYYY-MM-dd', 'en_US');
    if (date1 > date2) {
      return this.hexToRGB('#F44336', 0.35);
    } else if (date1 < date2) {
      return this.hexToRGB('#2196f3', 0.35);
    } else {
      return this.hexToRGB('#7fb734', 0.35)
    }
  }
  public viewMode: string = 'cardMode';
  public activityActionForm: string = "Add";
  public activityId: number;
  public isSlotActive: boolean = false;
  public slotsData: any;
  public loading: boolean = false;
  public activityInfo: any = [];
  public selectedDate: Date = displayDate;
  public userpreferences: Userpreferences;
  public getEventStyles = (args: EventStyleArgs) => {
    let color = this.getEventColorCode(args.event.dataItem.end, args.event.dataItem.color)
    let textcolor = this.getEventPopoverBgCode(args.event.dataItem.end, args.event.dataItem.color)
    let activitybordercolor = this.getEventBorderColorCode(args.event.dataItem.end, args.event.dataItem.color)
    return { backgroundColor: color, color: textcolor, borderColor: activitybordercolor };
  }
  @ViewChild('myActivityAdd') public sidenav: MatSidenav;
  public baseData: any[] = [];
  public sampleDataWithCustomSchema;
  public sampleData;
  public sampleDataWithResources;
  public events: SchedulerEvent[];
  public onHoverId: any;
  public isOpen = false;
  public currentMonth: any;
  gridTimeZone: any;
  timeZone: any;
  public formGroup: FormGroup;
  animationVar: { CreateButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; FolderButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; AdvanceSearchButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; FilterButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; ActionsButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; RotateButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; ListButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; GridButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; GraphButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; BarExpandButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; BarMoreButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; BarRotateButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; PieExpandButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; PieMoreButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; MapExpandButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; MapMoreButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; CallButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; CategoryButton: { id: string; class: string; animation: string; name: string; isAnimClass: string; }; };

  defaultSelectActivityListing = "Upcoming";
  currentYear: any;
  public timezonName: any = localStorage.getItem('UserTimezone');
  convertedTimeZone: ZonedDate;
  slotDuration: number = 60;

  public activitySchedulerHeight: number;
  public currentMenuWidth: number;
  public weekStart: Day = Day.Monday;
  public weekEnd: Day = Day.Thursday;
  public timePeriod: any = 60;  /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10648 EWM-10761 @What:Time Interval should be an hour different instead of 30 mins **/
  public calenderMode: number = 1;
  public utctimezonName: any = localStorage.getItem('UserTimezone');
  public xeopleImage: string;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  public dirctionalLang: string;
  @Input() activityObj:string;
  candidateId:string;
  @Input() syncDataList:any=[];
  @Input() syncOrganiserDataList:any=[];
  @Input() syncInterviewDataList:any=[];
  public attendeesDataList: any[] = [];
  subscriptionSelectedList: Subscription;
  subscriptionTimeZone: Subscription;
  public selectedAllDataList: any[] = [];
  public withoutActivity: any[] = [];

  searchValue:string = '';
  public candidateInfoId: string;
  public subscriptionCandidate$: Subscription;

  constructor(private formBuilder: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService, public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService, public dialog: MatDialog, public candidateService: CandidateService, private commonserviceService: CommonserviceService,private pushCandidateEOHService: PushCandidateEOHService,
    public _sidebarService: SidebarService, private router: Router, private routes: ActivatedRoute, private _profileInfoService: ProfileInfoService, private _appSetting: AppSettingsService) {
    let date_obj = new Date();
    this.currentMonth = date_obj.toDateString().substr(4, 3);
    //this.timeZone=localStorage.getItem('UserTimezone');

    this.createFormGroup = this.createFormGroup.bind(this);
    this.dateFormat = _appSetting.getFormat(); 
   }

  ngOnInit(): void {
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
     this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
     this.getWorkScheduleData();
   //this.getActivitySchedular(currentYear);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getTimeZone();

    this.animationVar = ButtonTypes;

    this.currentMenuWidth = window.innerWidth;
    this.activitySchedulerHeight = window.innerHeight;
    this.onResize(window.innerWidth, 'onload');
    this.subscriptionSelectedList = this.commonserviceService.getJobInterviewInfo().subscribe((ServiceData) => {
      this.attendeesDataList=[];
      this.syncDataList=[];
      this.syncInterviewDataList=[];
      this.selectedAllDataList=[];
      this.syncOrganiserDataList=[];
      this.syncCandidateDataList=[];
      this.syncInterviewDataListId=[];
      this.selectedAllDataList=ServiceData;
       this.syncOrganiserDataList = ServiceData.filter(x => x['ServiceId'] === 3);
      this.syncDataList = ServiceData.filter(x => x['ServiceId'] === 1);
      this.syncDataList?.forEach(element=>{
        this.syncCandidateDataList.push(element['Id'])
      });
        this.syncInterviewDataList = ServiceData.filter(x => x['ServiceId'] === 2);
        this.syncInterviewDataList?.forEach(element=>{
        this.syncInterviewDataListId.push(element['Id'])
      });
      this.attendeesDataList=[];
      this.attendeesDataList=[...this.syncDataList,...this.syncInterviewDataList];
      this.getActivitySchedular(currentYear);
      });

    this.subscriptionTimeZone = this.commonserviceService.getJobInterviewTimeZoneInfo().subscribe((timezone) => {
      this.timezonName=timezone;
      this.getActivitySchedular(currentYear);
     });

      this.subscriptionTimeZone = this.commonserviceService.getJobInterviewAttendeeInfo().subscribe((AttendeeInfor) => {
      this.attendeesDataList=[];
      this.attendeesDataList=AttendeeInfor;
       });
    this.selectedAllDataList=this.syncOrganiserDataList;
    this.attendeesDataList=[...this.syncDataList,...this.syncInterviewDataList];
    this.WorkFlowStageId=this.syncDataList[0].WorkFlowStageId;
      /****@Who: renu @what:EWM-17898 EWM-17902 @WHEN: 12/08/2024 */
     this.subscriptionCandidate$ = this.pushCandidateEOHService.SetPushCandPageType.subscribe((details: any)=>{
       if (details) {
         this.candidateInfoId = details.candidateID;
       }
       }); 
  }
  ngAfterViewInit(): void{
    this.loading=false;
  }
  /*
    @Type: File, <ts>
    @Name: set height kendo sheduler
    @Who: Satya Prakash Gupta
    @When: 13-Apr-2022
    @Why: EWM-6140 EWM-6213
    @What: set height kendo sheduler
   */
  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    this.activitySchedulerHeight = window.innerHeight;
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }
    if (this.currentMenuWidth > 621 && this.currentMenuWidth < 1060) {
      this.activitySchedulerHeight = window.innerHeight - 150;
    } else if (this.currentMenuWidth > 581 && this.currentMenuWidth < 620) {
      this.activitySchedulerHeight = window.innerHeight - 155;
    } else if (this.currentMenuWidth > 320 && this.currentMenuWidth < 580) {
      this.activitySchedulerHeight = window.innerHeight - 216;
    } else {
      this.activitySchedulerHeight = window.innerHeight - 140;
    }
  }

  hexToRGB(hex, alpha) {
    if (hex) {
      var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
      if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
    }

  }

  /*
  @Type: File, <ts>
  @Name: openjobDetailsView
  @Who: Anup Singh
  @When: 11-Jan-2022
  @Why:EWM-4530
  @What: for child component load when click job details view
 */
  isMyActivity: boolean = false;
  openDrawerMyActivity() {
    this.slotsData = undefined;
    this.activityActionForm = "Add";
    this.isMyActivity = true;
    this.isSlotActive = true;
 
  }


  /*
  @Type: File, <ts>
  @Name: closeDrawerMyActivity
  @Who: Anup Singh
  @When: 11-Jan-2022
  @Why:EWM-4530
  @What: to close Drawer
  */

  closeDrawerMyActivity() {
    this.isSlotActive = false;
    this.isMyActivity = false;
  }
  /*
   @Type: File, <ts>
   @Name: getActivitySchedular function
   @Who: Nitin Bhati
   @When: 05-july-2023
   @Why:EWM-11778 EWM-12972
   @What: for getting list for activity scheduled
 */
  getActivitySchedular(currentYear) {
     let interviewStatus= localStorage.getItem('interviewStatus');
     if(interviewStatus=='0'){
      this.syncCandidateDataList=[];
      this.syncInterviewDataListId=[];
    }
    this.loading = true;
    let obj = {
      "activityYear": currentYear,
      "activityMonth":  this.currentMonth.toLowerCase(),
      "Organizers": [this.syncOrganiserDataList[0]?.Id],
      "Interviewers": this.syncInterviewDataListId,
      "Candidates": this.syncCandidateDataList,
    }
    this.systemSettingService.getSYNCActivitySchedular(obj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let candidateData=[]
          let interviewerData=[];
          let organizerData=[];
          organizerData=repsonsedata.Data.Organizers;
          interviewerData=repsonsedata.Data.Interviewers;
          candidateData=repsonsedata.Data.Candidates;
          this.baseData=[...organizerData,...interviewerData,...candidateData];

          if(this.baseData?.length==0){
            this.commonserviceService.setActivityNotCreatedInfo(this.selectedAllDataList);
          }else{
            this.baseData?.forEach( array1Ttem => {
              this.selectedAllDataList?.forEach( array2Item => {
                 if(array1Ttem?.AttendeeId === array2Item?.Id){
                  array1Ttem['CalenderColorCode'] = array2Item['ColorCode'];
                  array1Ttem['AttendeeName'] = array2Item['Name'];
                 }                        
              })
            });
            this.withoutActivity=[];
            this.selectedAllDataList?.forEach(xyz=>{
              const foundIndex=this.baseData?.findIndex(x => x['AttendeeId'] === xyz?.Id);
           if(foundIndex !== -1){
             //console.log("Found:",xyz?.Id);
           }else{
            this.withoutActivity.push(xyz);
            //console.log("Not Found:",xyz?.Id);
           }
            })
          this.commonserviceService.setActivityNotCreatedInfo(this.withoutActivity);
          }
          //let dummyArray=[];
          
          // console.log("Final without ActivityList:",this.withoutActivity);
          // console.log("Final CalenderColor:",this.baseData);
         
           this.sampleDataWithCustomSchema = this.baseData.map(dataItem => (
            {
              ...dataItem,
              Start: parseAdjust(dataItem.DateStartUTC),
              End: parseAdjust(dataItem.DateEndUTC),

            }
          ));

          this.sampleData = this.baseData.map(dataItem => (
            <SchedulerEvent>{
              AttendeeId: dataItem.AttendeeId,
              id: dataItem.TaskID,
              start: parseAdjust(dataItem.DateStartUTC),
              startTimezone: dataItem.startTimezone,
              end: parseAdjust(dataItem.DateEndUTC),
              endTimezone: dataItem.endTimezone,
              color: dataItem.CalenderColorCode,
              IsOwner: dataItem.IsOwner,
              //isAllDay: dataItem.IsAllDay,
              title: dataItem.Title,
              description: dataItem.Description,
              //recurrenceRule: dataItem.RecurrenceRule,
              // recurrenceId: dataItem.RecurrenceID,
              // recurrenceException: dataItem.RecurrenceException,
              //roomId: dataItem.RoomID,
              ownerID: dataItem.OwnerID,
              className: dataItem.IconName,
              readonly: dataItem.IsCompleted,
              dataItem: dataItem
            }
          ));

          this.sampleDataWithResources = this.baseData.map(dataItem => (
            <SchedulerEvent>{
              AttendeeId: dataItem.AttendeeId,
              id: dataItem.Id,
              start: parseAdjust(dataItem.DateStartUTC),
              startTimezone: dataItem.TimeZone,
              end: parseAdjust(dataItem.DateEndUTC),
              endTimezone: dataItem.TimeZone,
              className: dataItem.IconName,
              color: dataItem.CalenderColorCode,
              IsOwner: dataItem.IsOwner,
              //isAllDay: dataItem.IsAllDay,
              title: dataItem.ActivityTitle + '#' + dataItem.IconName + '#' + dataItem.IsCompleted,
              description: dataItem.Description,
              readonly: dataItem.IsCompleted,
              dataItem: dataItem
              // recurrenceRule: dataItem.RecurrenceRule,
              // recurrenceId: dataItem.RecurrenceID,
              // recurrenceException: dataItem.RecurrenceException,
              // roomId: randomInt(1, 2),
              // attendees: [randomInt(1, 3)]
            }
          ));
          const parentNode = document.getElementsByClassName('current_date');        
          if(parentNode[0]!=undefined){
            parentNode[0].parentElement.classList.add("active-date-box");
          }        
          this.events = this.sampleDataWithResources;
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
    @Name: switchListMode function
    @Who: Renu
    @When: 10-Aug-2021
    @Why: ROST-2363
    @What: for swtiching list mode to cARD MODE OR VICE VERSA
  */
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.isCardMode = false;
      this.isListMode = true;
      this.viewMode = "cardMode";
      this.isvisible = true;
    } else {
      this.isCardMode = true;
      this.isListMode = false;
      this.viewMode = "listMode";
      this.isvisible = false;
      this.isMyActivityList = true;
      //listHeader.classList.remove("hide");
    }
  }


  /*
   @Type: File, <ts>
   @Name: openDrawerForActivityEdit function
   @Who: Anup Singh
   @When: 18-jan-2022
   @Why:EWM-4465 EWM-4661
   @What: for open drawer for edit
 */
  openDrawerForActivityEdit(res) {
    if (res.isEdit == true) {
      this.activityId = res.activityId;
      this.activityActionForm = 'Edit';
      this.createActivity();
      this.isSlotActive = true;
      
      this.activityActionForm = 'Edit';
      this.isMyActivity = true;
      //this.sidenav.open();
      this.slotsData=res?.acitivityInfo?.ScheduleActivity; /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: on edit case slot data is null so assigning value on edit case **/
    }
    else {
      this.activityActionForm = 'Add';
      this.isMyActivity = false;
    }
  }

  /*
      @Type: File, <ts>
      @Name: showActivtyDeatils function
      @Who: Nitin Bhati
      @When: 08-July-2023
      @Why: EWM-12972 EWM-12972
      @What: for showing details of activity on click
    */
  showActivtyDeatils(activityData) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_markAsdone';
    const dialogRef = this.dialog.open(JobActivityCalenderDetailsComponent, {
      data: new Object({
        activityId: activityData.event.id, IsOwner: activityData.event.dataItem.IsOwner,
        readonly: activityData.event.dataItem.readonly, timezoneName: this.timezonName
      }),
      // maxHeight: "85%",
      panelClass: ['xeople-modal', 'add_Manage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isEdit == true) {
        this.openDrawerForActivityEdit(res);
      } else if (res.isSave == true) {
        this.getActivitySchedular(currentYear);
      } else {

      }
    })
  }

  /*
     @Type: File, <ts>
     @Name: getIcon function
     @Who: Renu
     @When: 18-Jan-2021
     @Why: ROST-4469 EWM-4559
     @What: for SHOWING OF EACH ACTIVITY ICON
   */
  getIcon(tittle, part) {
    if (part == 1) {
      return tittle.split('#')[0];
    } else if (part == 2) {
      return tittle.split('#')[1];
    } else {
      return tittle.split('#')[2];
    }

  }

  /*
     @Type: File, <ts>
     @Name: onHover function
     @Who: Renu
     @When: 18-Jan-2021
     @Why: ROST-4469 EWM-4559
     @What: for showing details of activity on hover
   */

  onHover(activityId) {
    this.onHoverId = activityId;
    if (activityId != -1) {
      this.editActivityForm(activityId);
    }
  }
  /*
     @Type: File, <ts>
     @Name: onHover function
     @Who: Nitin Bhati
     @When: 06-July-2023
     @Why: EWM-11778 EWM-12972
     @What: for showing details of activity on hover
   */
  onHoverInterview(id,activityId) {
    this.onHoverId = activityId;
    this.onAttendeeId = id;
    if (activityId != -1) {
      this.editActivityForm(activityId);
    }

  }

  /*
     @Type: File, <ts>
     @Name: editActivityForm function
     @Who: Renu
     @When: 18-Jan-2021
     @Why: ROST-4469 EWM-4559
     @What: for showing details of activity on hover based on Particular Id
   */
  changeBackground(eventId: number): any {
    let eventArr = [];
    eventArr = this.events.filter(x => x.id === eventId);
    let colorCode = eventArr[0]?.color;
    return { 'background-color': colorCode };
  }
/*
     @Type: File, <ts>
     @Name: changeBackgroundInterview function
     @Who: Nitin Bhati
     @When: 06-July-2023
     @Why: EWM-11778 EWM-12972
     @What: for showing background color
   */
  changeBackgroundInterview(eventId): any {
    let eventArr = [];
    eventArr = this.events.filter(x => x.dataItem?.AttendeeId === eventId);
    let colorCode = eventArr[0]?.color;
    return { 'background-color': colorCode };
  }

  changeCategoryColor(eventId: number): any {
    let eventArr = [];
    eventArr = this.events.filter(x => x.id === eventId);
    let colorCode = eventArr[0]?.color;
    return { 'color': colorCode };
  }


  editActivityForm(Id: any) {
    this.loading = false;
    this.candidateService.getActivityById('?id=' + Id)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            let activityInfoTemp = data.Data;
            let arr = [];
            arr.push(activityInfoTemp);
            arr.filter(x => {
              // let startDate=new Date(x.ScheduleActivity['DateStartUTC'])
              // let endDate=new Date(x.ScheduleActivity['DateEndUTC'])
              // x.ScheduleActivity['DateStartUTC']=ZonedDate.fromLocalDate(startDate, this.timezonName);
              // x.ScheduleActivity['DateEndUTC']=ZonedDate.fromLocalDate(endDate, this.timezonName);
              x.ScheduleActivity['DateStartUTC'] = new Date(x.ScheduleActivity['DateStartUTC']).toLocaleString('en-US', { timeZone: this.timezonName });
              x.ScheduleActivity['DateEndUTC'] = new Date(x.ScheduleActivity['DateEndUTC']).toLocaleString('en-US', { timeZone: this.timezonName });

            })
            //  this.convertedTimeZone = ZonedDate.fromLocalDate(this.activityInfo, this.timezonName);
            this.activityInfo = arr[0];
            this.source = this.activityInfo.Source;
            this.MeetingPlatformLogoUrl = this.activityInfo.MeetingPlatformLogoUrl;
            if (this.source === 'office365') {
              this.xeopleImage = "/assets/microsoft365.svg";
            } else {
              this.xeopleImage = "/assets/fab.png";
            }
            //console.log("source:",this.activityInfo.Source);
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
    @Name: onChangeActivityListing
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why:EWM-4465 EWM-4744
    @What: Change Activity Listing get list according
    */
  public activityListingValue: string = "Upcoming";
  onChangeActivityListing(activityListing) {
    this.activityListingValue = activityListing;
    this.commonserviceService.onActivityListing.next(activityListing);
  }

  /*
     @Type: File, <ts>
     @Name: openModelForCalenderFilter
     @Who: Anup Singh
     @When: 20-jan-2022
     @Why:EWM-4465 EWM-4744
     @What: open popup for calender filter
     */

  public filterCountDate: any = 0;
  openModelForCalenderFilter() {
    const dialogRef = this.dialog.open(CalenderFilterComponent, {
      // maxWidth: "1000px",
      data: new Object({ activityListingValue: this.activityListingValue }),
      // width: "90%",
      // maxHeight: "85%",
      panelClass: ['xeople-modal', 'CalenderFilter', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isSchedule == true) {
        this.commonserviceService.onActivityDateFilter.next(res)
        this.filterCountDate = 1;
        var element = document.getElementById("filter-date");
        element.classList.add("filteractive");
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
      @Name: getTimeZone function
      @Who: Renu
      @When: 21-Jan-2021
      @Why: ROST-4469 EWM-4559
      @What: getting timezone dropdown
    */

  getTimeZone() {
    this._profileInfoService.getTimezone().subscribe(
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

  changeActivityTimeZone(event) {
    this.timezonName = event;
    let gridTimeZone = this.gridTimeZone?.filter(x => x['Id'] === this.timezonName);
    this.utctimezonName = gridTimeZone[0]?.Timezone;
    this.getActivitySchedular(currentYear)
  }




  drawerCloseMyActivity(data: any) {
    if (data.isDrawerClose == true) {
      //this.sidenav.close();
      this.isMyActivity = false;
      if (data.isSubmit == true) {
        this.getActivitySchedular(currentYear);
        this.commonserviceService.onActivityCreateGetList.next(true);
      }
    }
  }

  /*
     @Type: File, <ts>
     @Name: openModelForCategoryFilter
     @Who: Anup Singh
     @When: 20-jan-2022
     @Why:EWM-4465 EWM-4744
     @What: open popup for category filter
     */
  public CategoryIds: any = [];
  public filterCountCategory: number = 0;
  openModelForCategoryFilter() {
    const dialogRef = this.dialog.open(JobCategoryFilterComponent, {
      // data: dialogData,
      panelClass: ['xeople-modal', 'categoryFilter', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result!=false){
      this.commonserviceService.onActivityCategoryFilter.next(result);
      this.CategoryIds = result.res;
      this.filterCountCategory = this.CategoryIds?.length;
      var element = document.getElementById("filter-category");
      element.classList.add("filteractive");
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
  @Name: clearFilterData function
  @Who: Anup Singh
  @When: 20-jan-2022
  @Why:EWM-4465 EWM-4744
  @What: FOR DIALOG BOX confirmation
*/
  clearFilterData(viewMode: string): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_myActivity';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if (viewMode == 'Date') {
          this.commonserviceService.onActivityDateFilterClear.next(viewMode);
        }
        else if (viewMode == 'Category') {
          this.commonserviceService.onActivityCategoryFilterClear.next(viewMode);
        }
      }
    });
  }


  /*
    @Type: File, <ts>
    @Name: DateFilterClearCount function
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why:EWM-4465 EWM-4744
    @What: after response api clear date filter and count
  */
  DateFilterClearCount(value) {
    if (value == true) {
      this.filterCountDate = 0;
      var element = document.getElementById("filter-date");
      element.classList.remove("filteractive");
    }
  }

  /*
    @Type: File, <ts>
    @Name: CategoryFilterClearCount function
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why:EWM-4465 EWM-4744
    @What: after response api clear category filter and count
  */
  CategoryFilterClearCount(value) {
    if (value == true) {
      this.filterCountCategory = 0;
      var element = document.getElementById("filter-category");
      element.classList.remove("filteractive");
    }
  }

  /*
     @Type: File, <ts>
     @Name: UpcomingActivityListing function
     @Who: Anup Singh
     @When: 20-jan-2022
     @Why:EWM-4465 EWM-4744
     @What: by default save upcoming activity
   */
  UpcomingActivityListing(value) {
    if (value == true) {
      this.defaultSelectActivityListing = "Upcoming";

      this.commonserviceService.onActivityCategoryFilterClear.next(false);
      this.commonserviceService.onActivityDateFilterClear.next(false);
      this.commonserviceService.onActivityCategoryFilter.next(false);
      this.commonserviceService.onActivityDateFilter.next(false)
      this.commonserviceService.onActivityListing.next(false);
    }
  }


  /*
@Type: File, <ts>
@Name: add remove animation function
@Who: ANUP SINGH
@When: 21-Jan-2022
@Why: EWM-4465 EWM-4744
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

  onChangeDate(event) {
    this.currentMonth = new Date(event).toDateString();
    this.currentYear = new Date(event).getFullYear();
    this.getActivitySchedular(this.currentYear);
  }

  /*
  @Type: File, <ts>
  @Name: changeDuration
  @Who: Renu
  @When: 18-FEB-2022
  @Why: EWM-4498 EWM-5297
  @What: when user change duration slot
   */
  changeDuration(event) {
    this.slotDuration = event;
  }

  /*
  @Type: File, <ts>
  @Name: openTimezoneModal
  @Who: Renu
  @When: 18-FEB-2022
  @Why: EWM-4498 EWM-5297
  @What: open Time zone modal
   */

  openTimezoneModal() {
    const dialogRef = this.dialog.open(TimezoneModalComponent, {
      // data: dialogData,
      panelClass: ['xeople-modal', 'changeEventTimeZone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult != true) {
        this.timezonName = dialogResult.timezonName;
        this.utctimezonName = dialogResult.utctimezonName;
        this.getActivitySchedular(currentYear);
      }

    })
  }

  /*
@Type: File, <ts>
@Name: dateChange
@Who: Renu
@When: 18-FEB-2022
@Why: EWM-4498 EWM-5297
@What:for date change
 */

  public dateChange(event) {
    this.currentMonth = new Date(event.selectedDate).toDateString().substr(4, 3);
    this.currentYear = new Date(event.selectedDate).getFullYear();
    this.getActivitySchedular(this.currentYear);
  }

  /*
  @Type: File, <ts>
  @Name: check
  @Who: Renu
  @When: 18-FEB-2022
  @Why: EWM-4498 EWM-5297
  @What:check for date change
   */


  public check(date: Date) {
    let date1 = formatDate(new Date(), 'YYYY-MM-dd', 'en_US');
    let date2 = formatDate(new Date(date), 'YYYY-MM-dd', 'en_US');
    if (date1 == date2) {
      return true;
    }

  }

  /*
  @Type: File, <ts>
  @Name: checkCurrentMonth
  @Who: Renu
  @When: 18-FEB-2022
  @Why: EWM-4498 EWM-5297
  @What:check for date  month
   */
  public checkCurrentMonth(date: Date) {
    let date1Month = formatDate(new Date(), 'MM', 'en_US');
    let date2Month = formatDate(new Date(date), 'MM', 'en_US');
    if (date1Month == date2Month) {
      return true;
    }

  }


  public createFormGroup(args: CreateFormGroupArgs): FormGroup {
    const dataItem = args.dataItem;
    const isOccurrence = args.mode === EditMode.Occurrence as any;
    const exceptions = isOccurrence ? [] : dataItem.recurrenceExceptions;

    this.formGroup = this.formBuilder.group({
      'id': args.isNew ? this.getNextId() : dataItem.id,
      'start': [dataItem.start, Validators.required],
      'end': [dataItem.end, Validators.required],
      'startTimezone': [dataItem.startTimezone],
      'endTimezone': [dataItem.endTimezone],
      'isAllDay': dataItem.isAllDay,
      'title': dataItem.title,
      'description': dataItem.description,
      'recurrenceRule': dataItem.recurrenceRule,
      'recurrenceId': dataItem.recurrenceId,
      'recurrenceExceptions': [exceptions],
      'readonly': 1,
    }, {
      validator: this.startEndValidator
    });

    return this.formGroup;
  }

  public getNextId(): number {
    const len = this.events.length;
    return (len === 0) ? 1 : this.events[this.events.length - 1].id + 1;
  }

  public startEndValidator: ValidatorFn = (fg: FormGroup) => {
    const start = fg.get('start').value;
    const end = fg.get('end').value;
    if (start !== null && end !== null && start.getTime() < end.getTime()) {
      return null;
    } else {
      return { range: 'End date must be greater than Start date' };
    }
  }

  openActivityPanel(e: SlotClickEvent) {
    // this.sidenav.toggle();
    this.isSlotActive = true;
    this.slotsData = e;
    this.activityActionForm = "Add";
    this.isMyActivity = true;
    this.createActivity()
  }


  public onSelectionChange(event: SlotRange): void {

  }

  slotClass = (args: SlotClassArgs) => {
    this.loading=false;
    const holidays = this.holidaysArray; //[3,4];
    //Mukesh Kukesh (16-05-2022)
    //Work Week configuration start
    let workWeekHeaderList = document.getElementsByTagName("tr")[2];
    if(this.holidaysArray.length>0){
    this.holidaysArray?.forEach(function (days) {
      if (days === 7) {
        if(workWeekHeaderList.getElementsByTagName("th")[days - 1]!=undefined){
          workWeekHeaderList.getElementsByTagName("th")[days - 1].style.display = "none";
        }      
      } else {
        if(workWeekHeaderList.getElementsByTagName("th")[days]!=undefined){
          workWeekHeaderList.getElementsByTagName("th")[days].style.display = "none";
        }      
      }    
    });
  }
    //Mukesh Kukesh (16-05-2022)
    //Work Week configuration End
    if (holidays.includes(args.start.getDay())) {
      return "holiday-bg";
    } else {
      return "working-bg";
    }
  };


  /*
     @Type: File, <ts>
     @Name: getWorkScheduleData function
     @Who: Nitin  Bhati
     @When: 08-May-2022
     @Why:EWM-5572
     @What:  function declare for call get api
   */
  holidaysArray = [];
  allWeekArray = [0, 1, 2, 3, 4, 5, 6];
  getWorkScheduleData() {
    this.loading = false;
    this._profileInfoService.getWorkSchedule().subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.gridData = repsonsedata['Data'];
            this.StartTime = this.gridData?.StartTime?this.gridData?.StartTime:"08:00",
            this.EndTime = this.gridData?.EndTime?this.gridData?.EndTime:"18:00",
            this.selectedDay = this.gridData?.WeekDays;
          let selectedDayId: any = []
          for (let index = 0; index < this.gridData.WeekDays.length; index++) {
            const element = this.gridData?.WeekDays[index];
            selectedDayId.push(element);
          };        
         let days =  this.allWeekArray.filter((f) => this.selectedDay.includes(f));
          if(days?.length!=0){
            this.holidaysArray = this.allWeekArray.filter((f) => !selectedDayId.includes(f));
          }else {
            this.holidaysArray = [0,7]; 
          }         
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

 /*
   @Type: File, <ts>
   @Name: createactivity function
   @Who: Adarsh singh
   @When: 26-June-2023
   @Why: EWM-11778 EWM-12850
   @What: create Activity
 */
   createActivity() {
     const dialogRef = this.dialog.open(JobActivityCreateComponent, {
      data: {activityActionForm: this.activityActionForm, utctimezonName:this.utctimezonName,
        timezonName: this.timezonName, timePeriod: this.timePeriod, activityId: this.activityId, isSlotActive: this.isSlotActive,
        slotsData: this.slotsData,activityObj: this.activityObj, candidateId: this.candidateId,syncCandidateAttendeeList:this.attendeesDataList,WorkFlowStageId:this.WorkFlowStageId},
      panelClass: ['xeople-drawer-lg', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res==true){
        this.reloadDataEvent.emit(true);
        this.getActivitySchedular(currentYear);
        /****@Who: renu @what:EWM-17898 EWM-17902 @WHEN: 12/08/2024 */
        let obj:any = {
          pageType: PushCandidatePageType.Normal,
          candidateID: this.candidateInfoId,
          showWarningAlert: true
        }
        this.pushCandidateEOHService.SetPushCandPageType.next(obj);
        //**end***** */
      }
    })

  }

    /* 
  @Name: ngOnDestroy
  @Who: Nitin Bhati
  @When: 6-July-2023
  @Why: EWM-12970
  @What: to store data in service 
*/
ngOnDestroy(): void {
  localStorage.setItem('interviewStatus','0');
  this.subscriptionCandidate$?.unsubscribe();
}
  //  who:Adarsh :what:ewm-15160 for clear searchdata ,function:onFilterClear,when:29/11/2023
  public onFilterClear(): void {
    this.searchValue = ''; 
  }
}
