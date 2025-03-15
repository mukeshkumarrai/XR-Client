/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 16 Dec
    @Why: EWM-4210 EWM-4219
    @What:  This page is job sms for candidate
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { QuickpeopleService } from '@app/modules/EWM.core/shared/services/quick-people/quickpeople.service';
import { SmsTemplateComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/templates/sms-template/sms-template.component';

@Component({
  selector: 'app-job-sms',
  templateUrl: './job-sms.component.html',
  styleUrls: ['./job-sms.component.scss']
})
export class JobSmsComponent implements OnInit {

  sendSMSForm: FormGroup;
  maxMessage: number = 612;
  loading: boolean;
  jobdetailsData: any = {};
  JobId: any;
  JobName:any;
  public numberPattern="^[0-9]*$";

  selectedMobileNumberValue:any = 0;
  countryId: any;
  countryCode: any=[];

  IsPhoneCode:boolean=false;

  public smsCount:number = 0;
  public msgLength:number =0;
  public maxsmsLength:number=612;
  public minimumBalanceSMS:number;
  countryList = [];
  public Lead:string;
  UserType:string
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
    private snackBService: SnackBarService, private serviceListClass: ServiceListClass,private quickpeopleService:QuickpeopleService,
    public dialogRef: MatDialogRef<JobSmsComponent>, private commonserviceService: CommonserviceService, public dialog: MatDialog, private translateService: TranslateService,
     public systemSettingService: SystemSettingService,private _appSetting: AppSettingsService,private sanitized: DomSanitizer,
     private el: ElementRef) {
      this.maxsmsLength = this._appSetting.maxsmslength;
      this.minimumBalanceSMS = this._appSetting.minimumBalanceSMS
      if(data?.Lead=='LEAD'){
        this.Lead=data?.Lead;
      }
    this.sendSMSForm = this.fb.group({
      PhoneCode:['',Validators.required],
      //  @When: 09-10-2023 @who:maneesh @why: EWM-14669 @what: Change the maxlength length of phone no from 20 to 11 while entering phone no  -->
      ToPhone:[, [Validators.required,Validators.pattern(this.numberPattern),Validators.maxLength(11),Validators.minLength(4)]],
      Subject:['', [Validators.required,Validators.maxLength(1000),Validators.minLength(1)]],
      MessageBody: ['', [Validators.required,Validators.maxLength(this.maxsmsLength),Validators.minLength(1)]]

    });
   
  }


  ngOnInit(): void {  
    this.jobdetailsData = this.data?.jobdetailsData;
    this.JobId = this.data?.JobId;
    this.JobName = this.data?.JobName;
    if(this.jobdetailsData?.CountryId!=undefined && this.jobdetailsData?.CountryId!=null && this.jobdetailsData?.CountryId!=0){
      this.getCountryCode(this.jobdetailsData?.CountryId);
    }else if(this.jobdetailsData?.PhoneCode){
      this.getCountryByPhoneCode(this.jobdetailsData?.PhoneCode) 
    }
    else{
    this.getInternationalization();
    }
     this.getBalance()
    
   

  }


  /*
@Type: File, <ts>
@Name: onDismiss function
@Who:  ANUP
@When: 16 Dec
@Why: EWM-4210 EWM-4219
@What: For cancel popup
*/
  onDismiss(): void {
   document.getElementsByClassName("JobSMSForCandidate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


  /*
@Type: File, <ts>
@Name: onMessage function
@Who:  ANUP
@When: 16 Dec
@Why: EWM-4210 EWM-4219
@What: For message count
*/
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.msgLength = value.length;
      this.maxMessage = 612 - value.length;
      if(value.length==0){
        this.smsCount  = 0;
      }else if(value.length<=160){
        this.smsCount  = 1;
      }else if(value.length<=313){
        this.smsCount  = 2;
      }else if(value.length<=459){
        this.smsCount  = 3;
      }else if(value.length<=612){
        this.smsCount  = 4;
      }else{
        this.smsCount  = 5;
      }
    }

  }


  getInternationalization() {
    this.systemSettingService.getInternalization().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] === 200 || repsonsedata['HttpStatusCode'] === 204) {
          this.countryId = Number(repsonsedata['Data']['CountryId']);
          this.getCountryCode(this.countryId);
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

 /*
@Type: File, <ts>
@Name: getCountryCode
@Who: Renu
@When: 28-June-2021
@Why: ROST-1586
@What: To get Data of contact based on categopry type
*/
getCountryCode(countryId) {
  this.quickpeopleService.getCountryById(countryId).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 200) {
       this.countryCode=repsonsedata.Data;
       this.selectedMobileNumberValue= Number(this.countryCode.Id);
       this.sendSMSForm.patchValue({
        PhoneCode:this.countryCode.CountryCode,
  }); 
      // @suika @EWM-13573 @whn 26-07-2023
      if(this.jobdetailsData?.PhoneNumber!=undefined && this.jobdetailsData?.PhoneNumber!=null && this.jobdetailsData?.PhoneNumber!=''){  
      let phoneNumber = this.jobdetailsData?.PhoneNumber.replace('+'+this.countryCode.CountryCode, '');
        this.sendSMSForm.patchValue({
          ToPhone:phoneNumber,
          });
      }  
      } else {
       // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      }
    }, err => {
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
  }


/*
  
    @Who: priti
    @When: 11-june-2021
    @Why: EWM-1806
    @What: get selected data
  */
 ddlMobileNumberChange(data){
   if(data==null || data==""){

    this.sendSMSForm.patchValue({
      PhoneCode:null,
    }); 
    this.IsPhoneCode=true;
    // this.sendSMSForm.controls['phoneCode'].setErrors({ 'required': true });
    // // this.sendSMSForm.get("phoneCode").setErrors({ required: true });
    //  this.sendSMSForm.get("phoneCode").markAsTouched();
    //  this.sendSMSForm.get("phoneCode").markAsDirty();
   }
   else
   {
    //  this.sendSMSForm.get("phoneCode").clearValidators();
    //  this.sendSMSForm.get("phoneCode").markAsPristine();
     this.selectedMobileNumberValue=data;
     this.quickpeopleService.getCountryById(data).subscribe(
       (repsonsedata:ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          let phoneCode=repsonsedata.Data.CountryCode;

          this.sendSMSForm.patchValue({
            PhoneCode:phoneCode,
          });
          
          this.IsPhoneCode=true;
          
         } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
         }
       }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       });
       
     }

    }


  /*
@Type: File, <ts>
@Name: onConfirm function
@Who:  ANUP
@When: 16 Dec
@Why: EWM-4210 EWM-4219
@What: For send SMS
*/
  onConfirm(value) {
    this.loading = true;
    let smsObj = {};
    let ToPhone={};
    let PhoneList:any[] = [];   
       ToPhone["Id"] =this.jobdetailsData?.CandidateId,
       ToPhone["Name"] =this.jobdetailsData?.CandidateName?this.jobdetailsData?.CandidateName:this.jobdetailsData?.Name,
       ToPhone["ToPhone"] ='+' + value.PhoneCode + value.ToPhone,
       PhoneList.push(ToPhone);
       smsObj["PhoneList"] = PhoneList,
       smsObj["Subject"] = value?.Subject,
       smsObj["MessageBody"] = value?.MessageBody,
       smsObj["Provider"] = "Burst",
       smsObj["Type"] = "SmsNotification";
       smsObj["JobId"] = this.JobId;
       smsObj["JobName"] = this.JobName;
       smsObj["UserType"] = this.Lead=='LEAD'?'CLIE' : "CAND";
    this.systemSettingService.sendSmsJobForCan(smsObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          document.getElementsByClassName("JobSMSForCandidate")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);

      //  
    // @Who: Bantee Kumar,@Why:EWM-10494.EWM-10510,@When: 2-Mar-2023,@What:No toaster massage will be shown.
    // @Who: maneesh,@Why:EWM-14669,@When: 09-10-2023,@What: toaster massage will be shown.
         this.snackBService.showThankyouSMSSnackBar(this.translateService.instant('label_sendSMS'), '');
            } else if (repsonsedata.HttpStatusCode === 400) {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }



/*
  @Type: File, <ts>
  @Name: openTemplateModal
  @Who: Suika
  @When: 27-Sep-2022
  @Why: EWM-8813 EWM-8952
  @What: to open template modal dialog
*/
openTemplateModal() {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_insertTemplate';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(SmsTemplateComponent, {
      panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     if(res!=false){
     this.onMessage(res.data?.SmsBody);
       this.sendSMSForm.patchValue({
        'Subject': res.data?.Title,
        'MessageBody': res.data?.SmsBody.replace(/<[^>]*>/g, '')
      });    
     }
     })
  }
  
/*
  @Type: File, <ts>
  @Name: getBalance
  @Who: Suika
  @When: 27-Sep-2022
  @Why: EWM-8813 EWM-8952
  @What: to open template modal dialog
*/

  getBalance() {
    this.systemSettingService.getBalance('?provider=Burst').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.minimumBalanceSMS = repsonsedata.Data.Balance;
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.minimumBalanceSMS = 0;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
      //    this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }
// @bantee @EWM-14292 @whn 22-09-2023
  getCountryByPhoneCode(phonecode) {
    this.quickpeopleService.getCountryByphoneCode(phonecode).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
         this.countryCode=repsonsedata.Data;
         this.selectedMobileNumberValue= Number(this.countryCode.Id);
         this.sendSMSForm.patchValue({
          PhoneCode:this.countryCode.CountryCode,
    }); 
        
        if(this.jobdetailsData?.PhoneNumber!=undefined && this.jobdetailsData?.PhoneNumber!=null && this.jobdetailsData?.PhoneNumber!=''){  
        let phoneNumber = this.jobdetailsData?.PhoneNumber.replace('+'+this.countryCode.CountryCode, '');
          this.sendSMSForm.patchValue({
            ToPhone:phoneNumber,
            });
        }  
        }
      })
    }



}
