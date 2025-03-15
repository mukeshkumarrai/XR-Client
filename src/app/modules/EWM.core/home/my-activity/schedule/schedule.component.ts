
/*
   @Type: File, <html>
   @Name: schedule.component.ts
   @Who: Anup Singh
   @When: 08-jan-2022
   @Why:EWM-4467 EWM-4529
   @What: popup component for schedule 
*/
import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ContactReceipentService } from 'src/app/shared/services/contact-recipient/contact-receipent.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import {CustomValidatorService} from '../../../../../shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  ScheduleForm: FormGroup;
  public gridLanguage: any[];
  public gridTimeZone1: any[];
  public gridTimeZone: any[];
  loading: boolean = false;
  distinctRegion = [];
  timezoneDetails = [];
  RegionName: string;
  TimeZoneName: string;
  isSameAsDateStart: boolean = false;
  isDateEnd: boolean = true;
  EndDateMin :  Date;
  StartDateMin = new Date();
  currentStartDate :any= new Date();
  // currentEndDate = new Date();
  isMinTimeCondotion: boolean = false;
  public dateFormat:any;
  // time picker 
  public TimeStartValue:any;
  public TimeEndValue:any;
// end 
getDateFormat:any;

  constructor(public dialogRef: MatDialogRef<ScheduleComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private _profileInfoService: ProfileInfoService,private datePipe: DatePipe,
    private route: Router, private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService, private _userpreferencesService: UserpreferencesService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService, private fb: FormBuilder) {

    this.dateFormat = localStorage.getItem('DateFormat');
    this.ScheduleForm = this.fb.group({
      TimeZone: ['', [Validators.required]],
      DateStart: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeStart: [null, [Validators.required]],
      DateEnd: [null, [Validators.required, CustomValidatorService.dateValidator]],
      TimeEnd: [null, [Validators.required]],

    })

  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10688 EWM-10940 Desc-for setting default time value --------
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    this.TimeEndValue = nowTime;
    // end 
    this.getAllRegion();

    ///////For Current Time Patch   Start///////
    const getTwoDigits = (value) => value < 10 ? `0${value}` : value;

    var formatTime = (date) => {
      const hours = getTwoDigits(date.getHours());
      const mins = getTwoDigits(date.getMinutes());
      return `${hours}:${mins}`;
    }

    const date = new Date();  ////  /// for current time
    const dateEnd = new Date(Date.now() + 10 * 60 * 1000)  /// 10min add current time

    this.ScheduleForm.patchValue({
      TimeStart: formatTime(date),
      TimeEnd: formatTime(dateEnd)
    })
    ////// End///////
    if (this.data?.scheduleData?.TimeZone != undefined && this.data?.scheduleData?.TimeZone != null && this.data?.scheduleData?.TimeZone != '') {
      this.patchScheduleData(this?.data?.scheduleData);
    } else {
      this.ScheduleForm.patchValue({
        DateEnd: this.currentStartDate,
      });
      this.isSameAsDateStart = true;
      this.isDateEnd = false;
    }

    if (this.data?.activityActionForm == 'Edit') {
      this.StartDateMin = null;
    }

    this.ScheduleForm.get("DateEnd").disable();
  }


  /*
    @Type: File, <ts>
    @Name: getAllRegion function
    @Who: Anup SIngh
    @When: 08-jan-2022
   @Why:EWM-4467 EWM-4529
    @What: call Get method from services for showing data into grid..
  */
  getAllRegion() {
    this.loading = true;
    this._profileInfoService.getTimezone().subscribe(
      repsonsedata => {
        this.gridTimeZone = repsonsedata['Data'];
        if (this.gridTimeZone.length > 0) {
          this.loading = false;
          this.getDataPreference();
          this.distinctRegion = this.gridTimeZone.filter(
            (thing, i, arr) => arr.findIndex(t => t.Region === thing.Region) === i
          );

          if (this.data?.scheduleData?.TimeZone != undefined && this.data?.scheduleData?.TimeZone != null && this.data?.scheduleData?.TimeZone != '') {
            this.patchScheduleData(this?.data?.scheduleData);
          } else {
            this.ScheduleForm.patchValue({
              DateEnd: this.currentStartDate,
            });
            this.isSameAsDateStart = true;
            this.isDateEnd = false;
          }
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
    @Type: File, <ts>
    @Name: getAllTimeZone function
    @Who: Anup SIngh
    @When: 08-jan-2022
    @Why:EWM-4467 EWM-4529
    @What: call Get method from services for showing data into grid..
  */
  getAllTimeZone(region, status) {
    if (status == "onchange" && this.gridTimeZone.length > 0) {
      // this.timezoneDetails = this.gridTimeZone.filter(x => x['Region'] === region);
      this.timezoneDetails = this.gridTimeZone;
      if (this.data?.scheduleData?.TimeZone == undefined || this.data?.scheduleData?.TimeZone == null || this.data?.scheduleData?.TimeZone == '') {   
      this.ScheduleForm.patchValue({
        'TimeZone': ''
      })
    }
    } else {      
      if (this.gridTimeZone) {
        let regionId;
        regionId = this.gridTimeZone.filter(x => x['Id'] == region);
        if (regionId != '') {
          //this.timezoneDetails = this.gridTimeZone.filter(y => y['Region'] === regionId[0]['Region']);
          this.timezoneDetails = this.gridTimeZone;
          //this.patchScheduleData(this?.data?.scheduleData);
          if (this.data?.scheduleData?.TimeZone == undefined || this.data?.scheduleData?.TimeZone == null || this.data?.scheduleData?.TimeZone == '') {
             this.ScheduleForm.patchValue({
             'TimeZone': {Id:region,Timezone:regionId[0]?.Timezone},
          })
          }
        }
      }
    }

  }

  /*
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: to compare objects selected
  */
    compareFn(c1: any, c2:any): boolean {  
      // let keyValue:string='Name';
       return c1 && c2 ? c1['Id'] === c2['Id'] : c1 === c2; 
   }

  /*
    @Type: File, <ts>
    @Name: getDataPreference function
    @Who: Anup SIngh
    @When: 08-jan-2022
    @Why:EWM-4467 EWM-4529
    @What: call Get method for calling account preference data.
  */
  getDataPreference() {
    if (this.gridTimeZone) {
      this.getAccountPreference();
    }
  }

  /*
    @Type: File, <ts>
    @Name: getAccountPreference function
    @@Who: Anup SIngh
    @When: 08-jan-2022
    @Why:EWM-4467 EWM-4529
    @Why: call Get method from services for showing data into grid.
    @What: .
  */
  getAccountPreference() {
    //this.loading = true;
    this._profileInfoService.getPreference().subscribe(
      (repsonsedata: any) => {
        // this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.RegionName = repsonsedata['Data']['UserTimezone'];
          this.TimeZoneName = repsonsedata['Data']['UserTimezone'];
          this.getAllTimeZone(repsonsedata['Data']['UserTimezone'], "onload");
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
@Type: File, <ts>
@Name: onDismiss()
@Who: Anup SIngh
@When: 08-jan-2022
@Why:EWM-4467 EWM-4529
@What: cancel button to close the dialog
*/
  onDismiss() {
    document.getElementsByClassName("AddSchedule")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("AddSchedule")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ isSchedule: false, scheduleData: this.ScheduleForm.value }); }, 200);

  }


  addDateStart(event) {
    let DateStart = this.appSettingsService.getUtcDateFormat(this.ScheduleForm.get("DateStart").value);
    //this.EndDateMin = new Date(DateStart);
    this.EndDateMin = new Date(new Date(DateStart));
    this.EndDateMin.setDate(this.EndDateMin.getDate());
    this.ScheduleForm.patchValue({
      DateEnd: DateStart
    });
    this.isSameAsDateStart = true;
    this.isDateEnd = false;

  }

  /*
@Type: File, <ts>
@Name: onChecked()
@Who: Anup SIngh
@When: 08-jan-2022
@Why:EWM-4467 EWM-4529
@What: check end date same as start date
*/
  onChecked(event) {
    if (event.checked === true) {
      this.isDateEnd = false;
      this.ScheduleForm.patchValue({
        DateEnd: this.ScheduleForm.get("DateStart").value
      });
      // <!---------@When: 13-03-2023 @who:Adarsh singh @why: EWM-10940 --------->
      this.ScheduleForm.get("DateEnd").disable();
    } else {
      this.isDateEnd = true
      this.ScheduleForm.get("DateEnd").enable();
      // end 
    }
  
    let DateStart = this.appSettingsService.getUtcDateFormat(this.ScheduleForm.get("DateStart").value);
    //this.EndDateMin = new Date(DateStart);
    this.EndDateMin = new Date(new Date(DateStart));
    this.EndDateMin.setDate(this.EndDateMin.getDate());
  }

  /*
@Type: File, <ts>
@Name: onConfirm()
@Who: Anup SIngh
@When: 08-jan-2022
@Why:EWM-4467 EWM-4529
@What: for save
*/
  onConfirm(value) {
    this.onChangeEndTime();
    let scheduleFormData = {};

    // get start time end by adarsh singh 
    // let getStartTime = this.TimeStartValue.toLocaleTimeString().split(":");
    let getStartTimeHM:any = new Date(this.TimeStartValue).toString().slice(16, 21);
    // let getStartTimeHM = `${getStartTime[0]}:${getStartTime[1]}`;
    // console.log(getStartTime);
    
    // let getEndTime = this.TimeEndValue.toLocaleTimeString().split(":");
    let getEndTimeHM = new Date(this.TimeEndValue).toString().slice(16, 21);
    // end 

    scheduleFormData['TimeZone'] = value.TimeZone.Timezone;   
    let localstartDate = new Date(value.DateStart);
    let local_startDate = this.commonserviceService.getTimeAndpatchInDate(localstartDate, getStartTimeHM);
    scheduleFormData['DateStart'] = local_startDate;
    scheduleFormData['TimeStart'] = getStartTimeHM;
    let localendDate = new Date(value.DateEnd)
    let local_endDate = this.commonserviceService.getTimeAndpatchInDate(localendDate, getEndTimeHM);
    scheduleFormData['DateEnd'] = local_endDate;
    scheduleFormData['TimeEnd'] = getEndTimeHM;    
    if (this.isMinTimeCondotion == false) {
      document.getElementsByClassName("AddSchedule")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("AddSchedule")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({ isSchedule: true, scheduleData: scheduleFormData }); }, 200);

    }

  }

  /*
@Type: File, <ts>
@Name: patchScheduleData()
@Who: Anup SIngh
@When: 08-jan-2022
@Why:EWM-4467 EWM-4529
@What: patch data
*/
  patchScheduleData(value) {  
   this.StartDateMin = null;
   let timeZoneData:any;
    setTimeout(()=>{
    timeZoneData =  this.timezoneDetails.filter(x => x['Timezone'] == value.TimeZone || x['Id'] == value.TimeZone);
    let DateStart = this.appSettingsService.getUtcDateFormat(value.DateStart);
    let DateEnd = this.appSettingsService.getUtcDateFormat(value.DateEnd);
    // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10688 EWM-10940 Desc- patch value in time varibale --------
    let startTime = value.TimeStart.split(":");
    let endTime = value.TimeEnd.split(":");
    let getStrtTime = value.DateStart.split('-');
      
    this.TimeStartValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], startTime[0], startTime[1], 0);
    this.TimeEndValue = new Date(getStrtTime[0], getStrtTime[1], getStrtTime[2], endTime[0], endTime[1], 0);
    // End 
     this.ScheduleForm.patchValue({
      TimeZone: timeZoneData[0],
      DateStart: DateStart,
      TimeStart: value.TimeStart,
      DateEnd: DateEnd,
      TimeEnd: value.TimeEnd,
    });
  },1000)
 
    let local_startDate = moment.utc(value.DateStart).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(value.DateEnd).local().format('YYYY-MM-DD');
    if (local_startDate === local_endDate) {
      this.isSameAsDateStart = true;
      this.isDateEnd = false;
    } else {
      this.isSameAsDateStart = false;
      this.isDateEnd = true;
    }
  }

  /*
@Type: File, <ts>
@Name: addDateEnd()
@Who: Anup SIngh
@When: 24-jan-2022
@Why:EWM-4467
@What: change end date
*/
  addDateEnd() {
    let local_startDate = moment.utc(this.ScheduleForm.get("DateStart").value).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(this.ScheduleForm.get("DateEnd").value).local().format('YYYY-MM-DD');
    if (local_startDate == local_endDate) {
      this.isSameAsDateStart = true;
      this.isDateEnd = false;
    }else{
      this.isSameAsDateStart = false;
    }
    this.onChangeEndTime();
  }

  /*
@Type: File, <ts>
@Name: onChangeEndTime()
@Who: Anup SIngh
@When: 24-jan-2022
@Why:EWM-4467 
@What: change time
*/
  onChangeEndTime() {
  //   let TimeEndMin = this.ScheduleForm.get("TimeStart").value;
  //  let TimeEnd = this.ScheduleForm.get("TimeEnd").value;

    // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10688 EWM-10940 Desc- checking validation --------
    // let getStartTime = this.TimeStartValue.toLocaleTimeString().split(":");
    // let getStartTimeHM = `${getStartTime[0]}:${getStartTime[1]}`;
    let getStartTimeHM:any = new Date(this.TimeStartValue).toString().slice(16, 21);

    // let getEndTime = this.TimeEndValue.toLocaleTimeString().split(":");
    // let getEndTimeHM = `${getEndTime[0]}:${getEndTime[1]}`;
    let getEndTimeHM:any = new Date(this.TimeEndValue).toString().slice(16, 21);

    // end 
   
    let local_startDate = moment.utc(this.ScheduleForm.get("DateStart").value).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(this.ScheduleForm.get("DateEnd").value).local().format('YYYY-MM-DD');

    if ((this.isSameAsDateStart == true) || (local_startDate == local_endDate)) {
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
@Name: changeTimezone()
@Who: Renu
@When: 17-jan-2022
@Why:EWM-4523 
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
@Name: getTimezone()
@Who: Renu
@When: 17-jan-2022
@Why:EWM-4523 
@What: get time according to chosen timezone
*/
  getTimezone(event){
    const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
    var formatTime = (date) => {
      const hours = getTwoDigits(date.getHours());
      const mins = getTwoDigits(date.getMinutes());
      return `${hours}:${mins}`;
    }
    let startDate=new Date();
    let endDate=new Date(Date.now() + 10 * 60 * 1000);
  /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: null handling **/
   const date = this.changeTimezone(startDate,event?.Id);  
   const dateEnd =this.changeTimezone(endDate,event?.Id); 
    this.currentStartDate=date;
   this.ScheduleForm.patchValue({
    TimeStart: formatTime(date),
    TimeEnd:formatTime(dateEnd),
    DateEnd: date,
  })

  // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10688 EWM-10940 Desc- chnage time while chnage the timezone --------
  let startTime:any = formatTime(date).split(":")
  let endTime:any = formatTime(dateEnd).split(":")
  this.TimeStartValue = new Date(2023, 2, 10, startTime[0], startTime[1], 0);
  this.TimeEndValue = new Date(2023, 2, 10, endTime[0], endTime[1], 0);
  // end 
  }

   /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear start  date 
     */
    clearStartDate(e){
      this.ScheduleForm.patchValue({
        DateStart: null
      });
    }
     /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear end  date 
     */
    clearEndDate(e){
      this.ScheduleForm.patchValue({
        DateEnd: null
      });
    }

/*
  @Type: File, <ts>
  @Name: handleChangeStartTime function
  @Who: Adarsh singh
  @When: 03-Mar-2023
  @Why: EWM-10688 EWM-10940
  @What: getting start time value which i have selected for
*/
  handleChangeStartTime(e:any){
    //this.TimeStartValue = e;
 /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/
    let date=new Date(e);
    let mnth:any = ("0" + (date.getMonth() + 1)).slice(-2);
    let day:any = ("0" + date.getDate()).slice(-2);
     //const dateEnd = new Date(Date.now() + 10 * 60 * 1000) 
     let DateEnd = this.appSettingsService.getUtcDateFormat([date.getFullYear(), mnth, day].join("-"));
    
    // let startTime = value.TimeStart.split(":");
    this.TimeStartValue = new Date(date.getFullYear(), mnth, day, date.getHours(), date.getMinutes(), 0);
     this.TimeEndValue = new Date(date.getFullYear(), mnth, day, date.getHours()+1, date.getMinutes(), 0);
 
     this.ScheduleForm.patchValue({
      TimeStart:new Date(this.TimeStartValue).toString().slice(16, 21),
      TimeEnd:new Date(this.TimeEndValue).toString().slice(16, 21),
    });
     /*** @When: 10-03-2023 @Who:Renu @Why: EWM-10632 EWM-10981 @What: automatic adjust end time on change of start time **/

    this.onChangeEndTime();
  }
/*
  @Type: File, <ts>
  @Name: handleChangeEndTime function
  @Who: Adarsh singh
  @When: 03-Mar-2023
  @Why: EWM-10688 EWM-10940
  @What: getting End time value which i have selected for
*/
  handleChangeEndTime(e:any){
    this.TimeEndValue = e;
    this.onChangeEndTime();
  }
}
