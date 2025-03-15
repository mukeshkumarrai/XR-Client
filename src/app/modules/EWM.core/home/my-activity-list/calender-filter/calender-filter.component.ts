
/*
   @Type: File, <html>
   @Name: calender-filter.component.ts
   @Who: Anup Singh
   @When: 14-jan-2022
   @Why:EWM-4465 EWM-4660
   @What: popup component for calender-filter 
*/
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  selector: 'app-calender-filter',
  templateUrl: './calender-filter.component.html',
  styleUrls: ['./calender-filter.component.scss']
})
export class CalenderFilterComponent implements OnInit {

  ScheduleForm: FormGroup;

  loading: boolean = false;
  durationError: boolean=false;

  StartDateMin: any;
  EndDateMin: any;

  StartDateMax: any;
  EndDateMax=new Date();
  endDay = new Date();
  dateFormat:any;
  getDateFormat:any;
  constructor(public dialogRef: MatDialogRef<CalenderFilterComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private _profileInfoService: ProfileInfoService,
    private route: Router, private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService, private _userpreferencesService: UserpreferencesService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService, private fb: FormBuilder) {
    // @When: 24-03-2023 @who:maneesh  @why: EWM-11212 @Desc- Added CustomValidatorService
    this.ScheduleForm = this.fb.group({
      DateStart: [null, [Validators.required, CustomValidatorService.dateValidator]],
      DateEnd: [null, [Validators.required,CustomValidatorService.dateValidator]],

    })

  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    // @When: 27-03-2023 @who:maneesh  @why: EWM-11214 @Desc- Added this.dateFormat
    this.dateFormat = localStorage.getItem('DateFormat'); 
    if (this.data?.activityListingValue == "Upcoming") {
      this.StartDateMin = new Date();
      this.EndDateMin = new Date();
      this.StartDateMax = null;
      this.EndDateMax = null;

    } else if (this.data?.activityListingValue == "Past") {
      this.StartDateMin = null;
      this.EndDateMin = null;
      this.StartDateMax = new Date();
      this.EndDateMax = new Date();
    } else {
      this.StartDateMin = null;
      this.EndDateMin = null;
      this.StartDateMax = null;
      // this.EndDateMax = null;
    }
    // @When: 27-03-2023 @who:maneesh  @why: EWM-11214 @Desc- Added date validation
      let EndDateMax= new Date();
      this.endDay?.setDate(EndDateMax.getDate() + 365 );
  }



  /*
@Type: File, <ts>
@Name: onDismiss()
@Who: Anup Singh
@When: 14-jan-2022
@Why:EWM-4465 EWM-4660
@What: cancel button to close the dialog
*/
  onDismiss() {
    document.getElementsByClassName("CalenderFilter")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("CalenderFilter")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ isSchedule: false, scheduleData: this.ScheduleForm.value }); }, 200);

  }


  /*
@Type: File, <ts>
@Name: addDateStart()
@Who: Anup Singh
@When: 17-jan-2022
@Why:EWM-4465 EWM-4661
@What: change start date then
*/
  addDateStart(event) {
    if (this.data?.activityListingValue == "Upcoming") {
      this.EndDateMin = new Date(this.ScheduleForm.get("DateStart").value)
      this.ScheduleForm.patchValue({
        DateEnd: null,
      });
      this.durationError=false;
    } else if (this.data?.activityListingValue == "Past") {
     /* commented by renu for EWM-EWM-5199 ON 8th April 2022*/
     // this.EndDateMax = new Date(this.ScheduleForm.get("DateStart").value)
    
      this.EndDateMin=new Date(this.ScheduleForm.get("DateStart").value);
        this.ScheduleForm.patchValue({
        DateEnd: null,
      });
      this.durationError=false;
    } else {
      this.EndDateMin = new Date(this.ScheduleForm.get("DateStart").value)
      this.ScheduleForm.patchValue({
        DateEnd: null,
      });
      this.durationError=false;
    }

  }

  /*
@Type: File, <ts>
@Name: onConfirm()
@Who: Anup Singh
@When: 17-jan-2022
@Why:EWM-4465 EWM-4661
@What: for save
*/
  onConfirm() {
    document.getElementsByClassName("CalenderFilter")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("CalenderFilter")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ isSchedule: true, scheduleData: this.ScheduleForm.value }); }, 200);
  }


  checkDuration(fromdate,todate){
    if(fromdate!== null && todate!== null){
      let fromDate:any = new Date(fromdate);
      let toDate:any = new Date(todate);
      let res:number;
      res=Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
      if(Math.abs(res)>365){
       this.durationError=true;
      }else{
        this.durationError=false;
      }
      }
  
    }
     /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 27-march-2023
    @Why: EWM-9802
    @What: For clear start  date 
     */
    clearStartDateEndDate(type:any){
      if (type==='dateStart') {
        this.ScheduleForm.patchValue({
          DateStart: null
        });
      }else if(type==='dateEnd'){
        this.ScheduleForm.patchValue({
          DateEnd: null
        });
      }
   
    }
}