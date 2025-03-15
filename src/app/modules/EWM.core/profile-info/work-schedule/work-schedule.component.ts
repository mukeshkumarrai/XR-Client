import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';

@Component({
  selector: 'app-work-schedule',
  templateUrl: './work-schedule.component.html',
  styleUrls: ['./work-schedule.component.scss']
})
export class WorkScheduleComponent implements OnInit {
  loading: boolean;
  workScheduleForm: FormGroup;
  gridData: any;
  public auditParameter;
  oldPatchValues: any;

  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [];
  WeekDays = new FormControl();
  filteredDay: Observable<string[]>;
  selectedDay: any = [];
  dayList = new FormControl();
  allDay: any = [
    { Id: 1, Name: 'Monday' },
    { Id: 2, Name: 'Tuesday' },
    { Id: 3, Name: 'Wednesday' },
    { Id: 4, Name: 'Thursday' },
    { Id: 5, Name: 'Friday' },
    { Id: 6, Name: 'Saturday' },
    { Id: 0, Name: 'Sunday' }
  ];

  @ViewChild('dayInput') dayInput: ElementRef;
    // time picker 
    public TimeStartValue:any;
    public TimeEndValue:any;
  // end 
isSameTimeError:boolean;

  constructor(private fb: FormBuilder, private _profileInfoService: ProfileInfoService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private commonserviceService: CommonserviceService, private translateService: TranslateService, private commonServiesService: CommonServiesService) {
    this.auditParameter = encodeURIComponent('Organization Preferences');

    this.filteredDay = this.WeekDays.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allDay.slice()));


  }

  ngOnInit(): void {
    let URL = this.route.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }

    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    // --------@When: 04-Mar-2023 @who:Adarsh singh @why: EWM-11033 EWM-10940 Desc-for setting default time value --------
    let currentDa = new Date();
    let nowTime = new Date(currentDa.getTime());
    this.TimeStartValue = nowTime;
    this.TimeEndValue = nowTime;
    // end 
    this.workScheduleForm = this.fb.group({
      WeekDays: [],
      StartTime: [''],
      EndTime: [''],
    });

    this.getWorkScheduleData();
    /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
    this.commonServiesService.searchEnableCheck(1);
  }
  /*
  @Type: File, <ts>
  @Name: onConfirm()
  @Who: Adarsh SIngh
  @When: 14-APRIL-2022
  @Why:EWM-5579 EWM-6172
  @What: for save
  */
  onConfirm(value) {
    this.updateWorkScheduleData(value);
  }

  /*
  @Type: File, <ts>
  @Name: getWorkScheduleData function
  @Who: Adarsh SIngh
  @When: 14-APRIL-2022
  @Why:EWM-5579 EWM-6172
  @What:  function declare for call get api
*/
  getWorkScheduleData() {
    this.loading = true;
    this._profileInfoService.getWorkSchedule().subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.gridData = repsonsedata['Data'];
          this.oldPatchValues = repsonsedata.Data;
          
          this.workScheduleForm.patchValue({
            WeekDays:  this.gridData.WeekDays,
          });
         // --------@When: 04-Mar-2023 @who:Adarsh singh @why: EWM-11033 Desc- patch value in time varibale --------
          let startTime = this.gridData.StartTime.split(":")
          let endTime = this.gridData.EndTime.split(":")
          this.TimeStartValue = new Date(2023, 2, 10, startTime[0], startTime[1].slice(0,2), 0);
          this.TimeEndValue = new Date(2023, 2, 10, endTime[0], endTime[1].slice(0,2), 0);
          // End 
          if (this.selectedDay.length == 0) {
            this.dayList.setValidators([Validators.required]);
          } else {
            this.dayList.clearValidators();
            this.dayList.updateValueAndValidity();
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
  @Name: updateWorkScheduleData function
  @Who: Adarsh SIngh
  @When: 14-APRIL-2022
  @Why:EWM-5579 EWM-6172
  @What: function declare for call update data
*/

  updateWorkScheduleData(value) {
    this.loading = true;
    if (this.oldPatchValues.StartTime == null && this.oldPatchValues.EndTime == null) {
      this.oldPatchValues.StartTime = '00:00';
      this.oldPatchValues.EndTime = '00:00'
    }
     // --------@When: 04-Mar-2023 @who:Adarsh singh @why: EWM-11033 --------
    let getStartTimeHM:any = new Date(this.TimeStartValue).toString().slice(16, 21);
    let getEndTimeHM = new Date(this.TimeEndValue).toString().slice(16, 21);
    // end 
    let fromObj = {};
    fromObj = this.oldPatchValues;
    
    let Obj = {}
    Obj['StartTime'] = getStartTimeHM;
    Obj['EndTime'] = getEndTimeHM;
    Obj['WeekDays'] = value.WeekDays;

    let addObj = {};
    addObj = [{
      "From": fromObj,
      "To": Obj
    }];

    this._profileInfoService.updateWorkSchedule(addObj[0]).subscribe(
      (repsonsedata: any) => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
        this.loading = false;
          this.gridData = repsonsedata['Data'];
          this.getWorkScheduleData();
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        }
        else if(repsonsedata['HttpStatusCode'] == '400'){
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
         else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    this.WeekDays.setValidators([Validators.required])
    if ((value || '').trim()) {
      this.selectedDay.push({
        Id: Math.random(),
        Name: value.trim()
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.WeekDays.setValue(null);
  }

  remove(fruit, indx): void {
    this.selectedDay.splice(indx, 1);

    if (this.selectedDay.length > 0) {
    } else {
      this.dayList.setValue('');
      this.dayList.setValidators([Validators.required]);
      this.dayList.updateValueAndValidity();
    }

  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let duplicateCheck = this.selectedDay.filter(x => x['Name'] === event.option.value.Name);

    if (duplicateCheck.length == 0) {
      this.selectedDay.push(event.option.value);
    }

    if (this.selectedDay.length > 0) {
      this.dayList.clearValidators();
      this.dayList.updateValueAndValidity();
    }

    this.dayInput.nativeElement.value = '';
    this.WeekDays.setValue(null);
  }

  private _filter(value: any): any[] {
    return this.allDay.filter(fruit => fruit.Name.toLowerCase().includes(value.toLowerCase()));
  }

  /*
  @Type: File, <ts>
  @Name: onDateChangedStart function
  @Who: Nitin Bhati
  @When: 22-July-2022
  @Why:EWM-6767
  @What:  function check validation
*/
  /*
  @Type: Modify 
  @Who: Adarsh Singh
  @When: 04-March-2023
  @Why: EWM-6711003367
  @What: checking same date validation for new time picker
*/
  onDateChangedStart(){
    // const StartTime= this.workScheduleForm.get("StartTime").value;
    // const EndTime= this.workScheduleForm.get("EndTime").value;
    let getStartTimeHM:any = new Date(this.TimeStartValue).toString().slice(16, 21);
    let getEndTimeHM:any = new Date(this.TimeEndValue).toString().slice(16, 21);
    const StartTime = new Date('2023-01-01 ' + getStartTimeHM);
    const EndTime = new Date('2023-01-01 ' + getEndTimeHM);

     if(StartTime.getTime()===EndTime.getTime()){
      this.isSameTimeError = true;
     }else{
      this.isSameTimeError = false;
     }    
  }

/*
  @Type: File, <ts>
  @Name: onWorkDays function
  @Who: Adarsh Singh
  @When: 23-August-2022
  @What:  function for is selected date is blank then add class
*/
  onWorkDays(e){
    let workDay = document.getElementById('day-dropdown');
    if(e.length ==0){
      workDay.classList.add('is-blank-day');
    }else{
      workDay.classList.remove('is-blank-day');
    }
    
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
  this.TimeStartValue = e;
  this.onDateChangedStart();
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
  this.onDateChangedStart();
}
}
