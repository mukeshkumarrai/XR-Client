import { Component, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
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
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { CalenderFilterComponent } from '../my-activity-list/calender-filter/calender-filter.component';
import { CategoryFilterComponent } from '../my-activity-list/category-filter/category-filter.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ButtonTypes } from 'src/app/shared/models';
import '@progress/kendo-date-math/tz/all';
import { Day, ZonedDate } from '@progress/kendo-date-math';
import { formatDate } from '@angular/common';
import { TimezoneModalComponent } from './timezone-modal/timezone-modal.component';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SlotRange } from '@progress/kendo-angular-scheduler/dist/es2015/views/day-time/day-time-slot.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { ShareCalenderComponent } from './share-calender/share-calender.component';
import { Observable } from 'rxjs';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { DrawerServiceService } from '@app/shared/services/commonservice/drawer-service.service';

export interface UserList {
  UserID:  string;
  Name:    string;
  EmailId: string;
}
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
  selector: 'app-my-activity-calender',
  templateUrl: './my-activity-calender.component.html',
  styleUrls: ['./my-activity-calender.component.scss']
})
export class MyActivityCalenderComponent implements OnInit {
  gridData: any;
  StartTime: any;
  selectedDay: any;
  EndTime: any;
  source: any;
  MeetingPlatformLogoUrl: any;
  public dateFormat:any = "EEE,d MMM";
  isvisible: boolean;
  isMyActivityList:boolean=false;
  emailConnection: boolean =false;
  public currentDate=new Date();
  LastSyncDate: number;
  sharedEmp: UserList[]=[];
  otherUserId: string=null;
  isMyActivityView: boolean =false;
  isMyActivity: boolean = false;
  hideCalenderOption: boolean;
  sideMenuContext:string;
  currentTimeBasedOnTimezone: string;
 
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
  @ViewChild('Activitydrawer') public sidenav: MatSidenav;
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
  dirctionalLang: string;
  searchValue:string = '';
  sharedCanenderPermission:string=null;
  selectedIndex=-1;
  ActivityObj:Object = {
    activityActionForm:'Add',
    isMyActivityView:false,
    isMyActivity:false,
    utctimezonName: localStorage.getItem('UserTimezone'),
    timePeriod:  60,
    isSlotActive:false,
    slotsData:'',
    timezonName:localStorage.getItem('UserTimezone')
  };


  constructor(private formBuilder: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService, public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService, public dialog: MatDialog, public candidateService: CandidateService, private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService,private mailService: MailServiceService, private router: Router,private _drawerService: DrawerServiceService,
    private _ngZone: NgZone, private _profileInfoService: ProfileInfoService, private _appSetting: AppSettingsService, private routes: ActivatedRoute) {
    let date_obj = new Date();
    this.currentMonth = date_obj.toDateString().substr(4, 3);
    /***@Why:EWM-10666 EWM-10747 @Who:Renu @When:08-05-2024*/
    let currentTimeZonestr = new Date().toLocaleString("en-US", { timeZone: this.timezonName });
    let currentTimeZone = new Date(currentTimeZonestr);
    let HH=currentTimeZone.getHours();
    let MM=currentTimeZone.getMinutes();
    this.currentTimeBasedOnTimezone=HH+':'+MM;
  
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

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //
    this.getWorkScheduleData();
   // this.getActivitySchedular(currentYear);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getTimeZone();

    this.animationVar = ButtonTypes;

    this.currentMenuWidth = window.innerWidth;
    this.activitySchedulerHeight = window.innerHeight;
    this.onResize(window.innerWidth, 'onload');
    this.checkEmailConnection();
    this.getSharedCalenderUserList();
    if(this.viewMode=='cardMode'){
      this.hideCalenderOption=true;
    }else{
      this.hideCalenderOption=false
    }
    this.routes.queryParams.subscribe((val) => {//@who:Renu @when:18/11/2024  @Why:EWM-17935 EWM-18747
      if(val){
        this.editActivityForm(val.meetingId,'onLoad');
      }
      });
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

  openDrawerMyActivity() {
    this.sidenav.close();
    this.isMyActivityView = false;
    this.slotsData = undefined;
    this.activityActionForm = "Add";
    this.isMyActivity = true;
    this.isSlotActive = true;
    this.ActivityObj={
      activityActionForm:'Add',
      isMyActivityView:false,
      isMyActivity:true,
      isSlotActive:this.isSlotActive,
      slotsData:undefined
     }
    if(!this.sidenav.opened){
      this.sidenav.open();
      this.sideMenuContext = 'activity-section';
    }
    this._drawerService.drawer1 = false;
    this.selectedIndex=-1;
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
    localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;
    this.isSlotActive = false;
    this.isMyActivity = false;
    this.sharedCalenderUser=null;
    this.otherUserId=null;
    this.getActivitySchedular(currentYear);
    this.ActivityObj={
      isMyActivity:false,
      isSlotActive:this.isSlotActive
    }
  }
  /*
   @Type: File, <ts>
   @Name: getActivitySchedular function
   @Who: renu
   @When: 18-jan-2022
   @Why:EWM-4469 EWM-4559
   @What: for getting list for activity scheduled
 */
// <!-----@When:  27-07-2023 @Who : bantee @why: EWM-13394---->
schedulerData$: Observable<any[]>;
  getActivitySchedular(currentYear) {
    this.loading = true;
    let param = '?activityYear=' + currentYear + '&activityMonth=' + this.currentMonth.toLowerCase();
    if(this.otherUserId !=null){
     param = '?activityYear=' + currentYear + '&activityMonth=' + this.currentMonth.toLowerCase()+'&UserId='+this.otherUserId;
    }
    this.systemSettingService.getActivitySchedular(param).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.baseData =[];
          this.baseData = repsonsedata.Data.UserMailList;
          this.LastSyncDate = repsonsedata.Data.LastSyncDate;

          this.sampleDataWithCustomSchema = this.baseData.map(dataItem => (
            {
              ...dataItem,
              Start: parseAdjust(dataItem.DateStartUTC),
              End: parseAdjust(dataItem.DateEndUTC),

            }
          ));

          this.sampleData = this.baseData.map(dataItem => (
            <SchedulerEvent>{
              id: dataItem.TaskID,
              start: parseAdjust(dataItem.DateStartUTC),
              startTimezone: dataItem.startTimezone,
              end: parseAdjust(dataItem.DateEndUTC),
              endTimezone: dataItem.endTimezone,
              color: dataItem.ColorCode,
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
              readonly: dataItem.IsCompleted
            }
          ));

          this.sampleDataWithResources = this.baseData.map(dataItem => (
            <SchedulerEvent>{
              id: dataItem.Id,
              start: parseAdjust(dataItem.DateStartUTC),
              startTimezone: dataItem.TimeZone,
              end: parseAdjust(dataItem.DateEndUTC),
              endTimezone: dataItem.TimeZone,
              className: dataItem.IconName,
              color: dataItem.ColorCode,
              IsOwner: dataItem.IsOwner,
              //isAllDay: dataItem.IsAllDay,
              title: dataItem.ActivityTitle + '#' + dataItem.IconName + '#' + dataItem.IsCompleted,
              description: dataItem.Description,
              readonly: dataItem.IsCompleted
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
          this.events =[];
          this.schedulerData$=this.sampleDataWithResources;
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
      this.getActivitySchedular(currentYear);//by maneesh ewm-15992
      this.isCardMode = false;
      this.isListMode = true;
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.hideCalenderOption=true;
      this.selectedIndex=-1;
      this.sideMenuContext ='';
    } else {
      this.isCardMode = true;
      this.isListMode = false;
      this.viewMode = "listMode";
      this.isvisible = false;
      this.isMyActivityList = true;
      this.hideCalenderOption=false;
      this.sharedCalenderUser=null;
      this.otherUserId=null;
      this.getActivitySchedular(currentYear);
      this.selectedIndex=-1;
      this.sideMenuContext ='';
      this.sidenav.close();
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
      this.isSlotActive = true;
      this.activityId = res.activityId;
      this.activityActionForm = 'Edit';
      this.isMyActivity = true;
      this.isMyActivityView=false;
      this.sidenav.open();
      this.sideMenuContext ='activity-section';
      this.slotsData=res?.acitivityInfo?.ScheduleActivity; /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10648 EWM-10764 @What: on edit case slot data is null so assigning value on edit case **/
      this.ActivityObj={
        activityActionForm:'Edit',
        isMyActivityView:false,
        isMyActivity:true,
        activityId:this.activityId,
        isSlotActive:this.isSlotActive,
        slotsData:this.slotsData
       }
    }
    else {
      this.activityActionForm = 'Add';
      this.isMyActivity = false;
      this.isMyActivityView=false;
      this.ActivityObj={
        activityActionForm:'Add',
        isMyActivityView:false,
        isMyActivity:false
       }
    }
  }

  /*
      @Type: File, <ts>
      @Name: showActivtyDeatils function
      @Who: Renu
      @When: 18-Jan-2021
      @Why: ROST-4469 EWM-4559
      @What: for showing details of activity on click
    */
  showActivtyDeatils(activityData) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_markAsdone';
    const dialogRef = this.dialog.open(ActivityDetailComponent, {
      data: new Object({
        activityId: activityData.event.id, IsOwner: activityData.event.dataItem.IsOwner,
        readonly: activityData.event.dataItem.readonly, timezoneName: this.timezonName,sharedCanender:this.otherUserId, sharedCanenderPermission:this.sharedCanenderPermission
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
      } else  if (res.isView == true) {
         this.openDrawerForActivityView(res);
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

  changeCategoryColor(eventId: number): any {
    let eventArr = [];
    eventArr = this.events.filter(x => x.id === eventId);
    let colorCode = eventArr[0]?.color;
    return { 'color': colorCode };
  }


  editActivityForm(Id: any,loadType?:string) {
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
            if(loadType==='onLoad'){
              this.activityInfo.isEdit=true;
              this.activityInfo.activityId=Id;
              this.openDrawerForActivityEdit(this.activityInfo);
            }
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
      data: new Object({ activityListingValue: this.activityListingValue }),
      panelClass: ['xeople-modal-sm', 'CalenderFilter', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isSchedule == true) {
        this.commonserviceService.onActivityDateFilter.next(res)
        this.filterCountDate = 1;
       this.commonserviceService.onActivityDateFilterCount.next(this.filterCountDate);//who:maneesh,what:ewm-16043 when:13/03/2024
        var element = document.getElementById("filter-date");
        element.classList.add("filteractive");
      } else {
      }
    })
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
          this.ActivityObj = {
            utctimezonName: this.utctimezonName
          };
        
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
    this.ActivityObj = {
      utctimezonName: this.utctimezonName,
      timezonName :this.timezonName 
    };
    this.getActivitySchedular(currentYear)
  }




  drawerCloseMyActivity(data: any) {
    if (data.isDrawerClose == true) {
      this.sidenav.close();
      this.isMyActivity = false;
      this.ActivityObj={
        isMyActivity:false
       }
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
    const dialogRef = this.dialog.open(CategoryFilterComponent, {
      // data: dialogData,
      panelClass: ['xeople-modal', 'categoryFilter', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.commonserviceService?.onActivityCategoryFilter?.next(result);
      if (result!=false) { //who:maneesh,what:ewm-16058 forhandel count filter issue,when:15/02/2024
        this.CategoryIds = result.res;
        this.filterCountCategory = this.CategoryIds?.length; 
      }else if(result==false && this.CategoryIds?.length==0){ 
        this.filterCountCategory = 0; 
      }   
      var element = document.getElementById("filter-category");
      element.classList.add("filteractive");

    });
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
      this.commonserviceService.onActivityDateFilterCount.next(this.filterCountDate);//who:maneesh,what:ewm-16043 when:13/03/2024
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
         /***@Why:EWM-10666 EWM-10747 @Who:Renu @When:08-05-2024*/
        let currentTimeZonestr = new Date().toLocaleString("en-US", { timeZone: this.timezonName });
        let currentTimeZone = new Date(currentTimeZonestr);
        let HH=currentTimeZone.getHours();
        let MM=currentTimeZone.getMinutes();
        this.currentTimeBasedOnTimezone=HH+':'+MM;
        this.ActivityObj = {
          utctimezonName: this.utctimezonName
        };
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
    this.sidenav.close();
    this.isSlotActive = true;
    this.slotsData = e;
    this.activityActionForm = "Add";
    this.isMyActivity = true;
    this.ActivityObj={
      activityActionForm:this.activityActionForm,
      isMyActivity:true,
      isSlotActive:this.isSlotActive,
      slotsData:this.slotsData
     }
     if(!this.sidenav.opened){
      this.sidenav.open();
      this.sideMenuContext = 'activity-section';
    }
    this.selectedIndex=-1;
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
    this.loading = true;
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


  checkEmailConnection(){
    this.mailService.getUserIsEmailConnected().subscribe(
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

    /*@Type: File, <ts> @Name: share calender open function @Who: Satya Prakash Gupta @When: 23-Nov-2021 @Why: EWM-16176 EWM-15204 @What: */
    shareCalender() {
      this._ngZone.runOutsideAngular(() => {
      const dialogRef = this.dialog.open(ShareCalenderComponent, {
        data: new Object({}),
        panelClass: ['xeople-modal-md', 'share-calender', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
     });

      // RTL Code
      let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList?.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }

    }

/* @Name: openSharedCalender @Who: Renu @When: 29-Nov-2023 @Why:EWM-15176 EWM-15203 @What: for calender view list users */
  openSharedCalender(event){
    if(!event.checked){
      this.otherUserId =null;
      this.sharedCalenderUser = null;
      this.sharedCanenderPermission =null;
      this.getActivitySchedular(currentYear);
      this.selectedIndex=-1;
      this.sideMenuContext='';
    } else{
       this.LastSyncDate=null; 
    }
  }

/* @Name: getSharedCalenderUserList @Who: Renu @When: 29-Nov-2023 @Why:EWM-15176 EWM-15203 @What: for calender view list users */
  getSharedCalenderUserList(){
    this.systemSettingService.sharedCalenderUserList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 ) {
          this.loading = false;
          this.sharedEmp=repsonsedata.Data;
        } else if(repsonsedata.HttpStatusCode === 204){
          this.loading = false;
          this.sharedEmp=[];
        }else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  otherSelectedUserId=null;
  sharedCalenderUser=null;
  /* @Who: Renu @When: 29-Nov-2023 @Why: EWM-15176 EWM-15203 @What: to get value on checkbox selection */
  OnViewCalender(event: { checked: any; },users: { UserID: string; Name: any; ViewAllDetails: string; },index:number){
    this.selectedIndex=index;
    if(event.checked){
      this.otherUserId=users?.UserID;
      this.sharedCalenderUser =users?.Name
      this.sharedCanenderPermission = users?.ViewAllDetails;
      this.getActivitySchedular(currentYear);
    }else{
      this.sharedCalenderUser=null;
      this.otherUserId=null;
      this.getActivitySchedular(currentYear);
     
    }
  
  }
     //  who:Adarsh :what:ewm-15160 for clear searchdata ,function:onFilterClear,when:29/11/2023
  public onFilterClear(): void {
    this.searchValue = '';
  }

  openDrawerForActivityView(res) {
    if (res.isView == true) {
      // this.activityActionForm = 'View';
      // this.isMyActivity=true;
      // this.isMyActivityView = true;
      // //this.sidenav.open();
      // this.sideMenuContext ='activity-section';
       this.activityId = res.activityId;
      this.ActivityObj={
        activityActionForm:'View',
        isMyActivityView:true,
        isMyActivity:true,
        activityId:this.activityId
        };
        this.toggleDrawer1();
    }

  }
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }
  toggleDrawer1() {
    
    if(!this._drawerService.drawer1){
      this.isMyActivity = true;
    }else{
      this.isMyActivity = false;
    }
    this._drawerService.drawer1 = !this._drawerService.drawer1;
  }

  refreshComponent(){
    this.getSharedCalenderUserList();
    this.getWorkScheduleData();
  }
}
