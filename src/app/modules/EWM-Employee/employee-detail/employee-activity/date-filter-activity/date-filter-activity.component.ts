/*
  @Type: File, <ts>
  @Name: date-filter.component.ts
  @Who: Nitin Bhati
  @When: 13-jan-2022
  @Why: EWM-4545
  @What: popup component for filter date
  */
  import { Component, Inject, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-date-filter-activity',
  templateUrl: './date-filter-activity.component.html',
  styleUrls: ['./date-filter-activity.component.scss']
})
export class DateFilterActivityComponent implements OnInit {
  clientDatesFilterForm:FormGroup;
  public dateFill = new Date();
  public today = new Date();
  public todayOpenDate = new Date();
  public todayFillDate = new Date();
  durationError: boolean=false;
  FromDate: string;
  ToDate: string; 
  getDateFormat:any;
  endDay= new Date();
  call:string='';
  startOfDayUTC: Date;
  endOfDayUTC: Date;
  callData:boolean=false;
  CallDatefilterPop:boolean=false;
  constructor(public dialogRef: MatDialogRef<DateFilterActivityComponent>,private fb: FormBuilder,private appSettingsService: AppSettingsService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { 
    this.clientDatesFilterForm= this.fb.group({
      FromDate: [new Date(), [CustomValidatorService.dateValidator]],
      ToDate:[new Date(), [CustomValidatorService.dateValidator]]
    })
    this.callData = this.data?.CallData;  
    this.CallDatefilterPop=this.data?.CallDatefilterPop;  
    if(this.callData==true){ //by maneesh this condition for call listing page ewm-18850 when:27/11/2024
      const currentDate = new Date();
      // Set the time to the start of the day (00:00:00)
      this.startOfDayUTC = new Date(currentDate);
      this.startOfDayUTC.setHours(0, 0, 0, 0);
      // Set the time to the end of the day (23:59:59)
      this.endOfDayUTC = new Date(currentDate);
      this.endOfDayUTC.setHours(23, 59, 59, 999);
      this.clientDatesFilterForm= this.fb.group({
      FromDate: [this.startOfDayUTC, [CustomValidatorService.dateValidator]],
      ToDate:[this.endOfDayUTC, [CustomValidatorService.dateValidator]]
    })
    }
    this.call=sessionStorage.getItem('Call');
    if(data?.filterCountDateNotes!=0){
      const d = new Date(data?.fromDate);
      this.clientDatesFilterForm.patchValue({
        FromDate:data?.fromDate,
        ToDate:data?.ToDate
      })
      this.endDay = new Date(data?.fromDate);
      this.endDay?.setDate(d?.getDate() + 365 );      
    }
  }
  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.endDay = new Date(this.clientDatesFilterForm.value.FromDate);
    this.endDay?.setDate(this.clientDatesFilterForm.value.FromDate.getDate() + 365 );

  }
/*
 @Name: saveDateFilter()
 @Who: Nitin Bhati
@When: 13-jan-2022
@Why: EWM-4545
 @What: save data
*/
saveDateFilter(value:any){
  const d = new Date(value?.FromDate);
  let FromDate = this.appSettingsService.getUtcFromDateFormat(d);
  const T = new Date(value?.ToDate);
  let ToDate = this.appSettingsService.getUtcToDateFormat(T);
  document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({'FromDate':FromDate,'ToDate':ToDate,'resType':true,'value':value}); }, 200);
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.remove("is-blurred");
  }
}
  /*
  @Name: onDismiss()
  @Who: Nitin Bhati
  @When: 13-jan-2022
  @Why: EWM-4545
  @What: cancel button to close the dialog
  */
  onDismiss() {
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(true); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
    // this.dialogRef.close({ data: '' })
  }
/*
  @Name: checkDuration()
  @Who: Adarsh Singh
  @When: 30-Mar-2023
  @Why: EWM-10692
  @What: checkDuration 
*/
  checkDuration(fromdate, todate) {
    if (fromdate) {
      this.endDay = new Date(fromdate);
      let fromDate: any = new Date(fromdate);
      let toDate: any = new Date(todate);
      let fromDatee = this.clientDatesFilterForm.controls['FromDate'].value;
      this.endDay?.setFullYear(fromDate?.getFullYear() + 1);
      let res = Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
      if (res > 365) {
        this.durationError = true;
      } else {
        this.durationError = false;
      }
    }
    if (!fromdate){
      this.endDay = null;
    }
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
      this.clientDatesFilterForm.patchValue({
        FromDate: null
      });
      this.endDay = null;
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
      this.clientDatesFilterForm.patchValue({
        ToDate: null
      });
    }
}
