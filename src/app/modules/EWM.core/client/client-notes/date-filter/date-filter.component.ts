/*
  @Type: File, <ts>
  @Name: date-filter.component.ts
  @Who: Renu
  @When: 16-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: popup component for filter date
  */
 import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CustomValidatorService } from '../../../../../shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnInit {

  clientDatesFilterForm:FormGroup;
  public dateFill = new Date();
  public today = new Date();
  public todayOpenDate = new Date();
  public todayFillDate = new Date();
  durationError: boolean=false;
  endDay= new Date();
  public isJobLog:boolean =false;
  getDateFormat:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DateFilterComponent>,private fb: FormBuilder, private appSettingsService: AppSettingsService) { 
    this.clientDatesFilterForm= this.fb.group({
      FromDate: [new Date(),[Validators.required,CustomValidatorService.dateValidator]],
      ToDate:[new Date(),[Validators.required, CustomValidatorService.dateValidator]]
    })

    if(data!=undefined || data!=null){
      this.isJobLog = data?.isJobLog;
      if(data?.isJobLog){
        if(data?.filterCountDate!=0){
          const d = new Date(data?.fromDate);
          let fromDate = this.appSettingsService.getUtcFromDateFormat(d);//new Date(d?.getFullYear(), d?.getMonth(), d?.getDate(), d?.getHours(), d?.getMinutes() - d?.getTimezoneOffset()).toISOString();
          const e = new Date(data?.ToDate);
          let toDate = this.appSettingsService.getUtcToDateFormat(e);//new Date(e?.getFullYear(), e?.getMonth(), e?.getDate(), e?.getHours(), e?.getMinutes() - e?.getTimezoneOffset()).toISOString();
          this.clientDatesFilterForm.patchValue({
            FromDate:fromDate,
            ToDate:toDate
          })
          this.endDay = new Date(fromDate);
          this.endDay?.setDate(d?.getDate() + 365 );      
        }else{
          this.clientDatesFilterForm.patchValue({
            FromDate:data?.fromDate,
            ToDate:data?.ToDate
          })
          this.endDay = new Date(data?.fromDate);
          // this.endDay?.setDate(new Date(data?.fromDate).getDate() + 365 );
        }
      }else{
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
    }
  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.endDay = new Date(this.clientDatesFilterForm.value.FromDate);
    // <!---------@When: 07-07-2023 @who:Adarsh singh @why: EWM-13010 --------->
    this.endDay?.setDate(new Date(this.clientDatesFilterForm.value.FromDate).getDate() + 365 );
    // End 
  }

  /*
  
 @Name: saveDateFilter()
 @Who: Renu
 @When: 27-May-2021
 @Why: EWM-1434 EWM-1613
 @What: save data
*/
  saveDateFilter(value:any){
    const d = new Date(value.FromDate);
    //let FromDate =   new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    let FromDate = this.appSettingsService.getUtcFromDateFormat(d);// new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
   
    const T = new Date(value.ToDate);
    //let ToDate =   new Date(T.getFullYear(), T.getMonth(), T.getDate(), T.getHours(), T.getMinutes() - T.getTimezoneOffset()).toISOString();
    let ToDate = this.appSettingsService.getUtcToDateFormat(T);//new Date(T.getFullYear(), T.getMonth(), T.getDate()+1, T.getHours(), T.getMinutes()).toISOString();
   
   
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'FromDate':FromDate,'ToDate':ToDate,'resType':true,'value':value}); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
  @Name: onDismiss()
  @Who: Renu
  @When: 20-Dec-202
  @Why: EWM-1434 EWM-1613
  @What: cancel button to close the dialog
  */
  onDismiss() {
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'resType':false}); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

    // this.dialogRef.close({ data: '' })
  }

  checkDuration(fromdate,todate){
    if (fromdate) {
      this.endDay = new Date(fromdate);
      let fromDate:any = new Date(fromdate);
      let toDate:any = new Date(todate);
      let fromDatee = this.clientDatesFilterForm.controls['FromDate'].value;   
      this.endDay?.setFullYear(fromDate?.getFullYear()+1);
       let res=Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24));
      if(res>365){
       this.durationError=true;
      }else{
        this.durationError=false;
      }
    }
    if (!fromdate) {
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
