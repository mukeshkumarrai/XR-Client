
/*
   @Type: File, <html>
   @Name: schedule.component.ts
   @Who: Anup Singh
   @When: 08-jan-2022
   @Why:EWM-4467 EWM-4529
   @What: popup component for schedule 
*/
import { formatDate } from '@angular/common';
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
import { CustomValidatorService } from '../../../../../shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-schedule-assistance-date-popup',
  templateUrl: './schedule-assistance-date-popup.component.html',
  styleUrls: ['./schedule-assistance-date-popup.component.scss']
})
export class ScheduleAssistanceDatePopupComponent implements OnInit {

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
  EndDateMin = new Date();
  StartDateMin = new Date();
  currentStartDate :any= new Date();
  // currentEndDate = new Date();
  isMinTimeCondotion: boolean = false;
  getDateFormat:any;


  constructor(public dialogRef: MatDialogRef<ScheduleAssistanceDatePopupComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private _profileInfoService: ProfileInfoService,
    private route: Router, private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService, private _userpreferencesService: UserpreferencesService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService, private fb: FormBuilder) {
     
      // @Who: bantee ,@When: 14-mar-2023, @Why: EWM-11163 ,What: add CustomValidatorService to the start date control

    this.ScheduleForm = this.fb.group({
      TimeZone: ['', [Validators.required]],
      DateStart: [null, [Validators.required,CustomValidatorService.dateValidator]],
     // TimeStart: [null, [Validators.required]],
    //  DateEnd: [null, [Validators.required]],
     // TimeEnd: [null, [Validators.required]],

    })

  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
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
    this.EndDateMin = new Date(this.ScheduleForm.get("DateStart").value);
    this.ScheduleForm.patchValue({
      DateEnd: this.ScheduleForm.get("DateStart").value
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
    } else {
      this.isDateEnd = true
    }

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
    //this.onChangeEndTime();
    let scheduleFormData = {};
    scheduleFormData['TimeZone'] = value.TimeZone.Timezone;
    //let local_startDate = moment.utc(value.DateStart).local().format('YYYY-MM-DD');
   // let local_startDate = this.commonserviceService.getTimeAndpatchInDate(value.DateStart, value.TimeStart);
    scheduleFormData['DateStart'] = value.DateStart;

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
     this.ScheduleForm.patchValue({
      TimeZone: timeZoneData[0],
      DateStart: new Date(value.DateStart),
     // TimeStart: value.TimeStart,
     // DateEnd: new Date(value.DateEnd),
     // TimeEnd: value.TimeEnd,
    });
  },2000)
 
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
    }
   // this.onChangeEndTime();

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
    let TimeEndMin = this.ScheduleForm.get("TimeStart").value;
    let TimeEnd = this.ScheduleForm.get("TimeEnd").value;

    let local_startDate = moment.utc(this.ScheduleForm.get("DateStart").value).local().format('YYYY-MM-DD');
    let local_endDate = moment.utc(this.ScheduleForm.get("DateEnd").value).local().format('YYYY-MM-DD');

    if ((this.isSameAsDateStart == true) || (local_startDate == local_endDate)) {
      if (TimeEnd <= TimeEndMin) {
        this.isMinTimeCondotion = true;
      } else {
        this.isMinTimeCondotion = false;
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
   /* let startDate=new Date();
    let endDate=new Date(Date.now() + 10 * 60 * 1000);
   const date = this.changeTimezone(startDate,event.Id);  
   const dateEnd =this.changeTimezone(endDate,event.Id); 
    this.currentStartDate=date;
   this.ScheduleForm.patchValue({
    TimeStart: formatTime(date),
    TimeEnd:formatTime(dateEnd),
    DateEnd: date,
  })*/
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
}
