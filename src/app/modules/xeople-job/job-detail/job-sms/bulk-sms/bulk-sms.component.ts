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
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { QuickpeopleService } from 'src/app/modules/EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { SmsTemplateComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/templates/sms-template/sms-template.component';
import { JobSmsComponent } from '../job-sms.component';

@Component({
  selector: 'app-bulk-sms',
  templateUrl: './bulk-sms.component.html',
  styleUrls: ['./bulk-sms.component.scss']
})
export class BulkSmsComponent implements OnInit {

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
  public maxsmsLength:number=0;
  public balanceSMS:number=0;
  public mappedPhones:any=[];
  public removable:boolean=true;
  selectedCandidates:any=[];
  dirctionalLang;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
    private snackBService: SnackBarService, private serviceListClass: ServiceListClass,private quickpeopleService:QuickpeopleService,
    public dialogRef: MatDialogRef<JobSmsComponent>, private commonserviceService: CommonserviceService, public dialog: MatDialog, private translateService: TranslateService,
     public systemSettingService: SystemSettingService,private _appSetting: AppSettingsService) {
      this.maxsmsLength = this._appSetting.maxsmslength;
    this.sendSMSForm = this.fb.group({
     // PhoneCode:['',Validators.required],
     // ToPhone:[[], [Validators.required,Validators.pattern(this.numberPattern),Validators.maxLength(20),Validators.minLength(10)]],
      Subject:['', [Validators.required,Validators.maxLength(1000),Validators.minLength(1)]],
      MessageBody: ['', [Validators.required,Validators.maxLength(this.maxsmsLength),Validators.minLength(1)]],
      ToEmailIds: [[]]

    });
   
  }


  ngOnInit(): void {
    this.JobId = this.data?.JobId;
    this.JobName = this.data?.JobName;  
    this.selectedCandidates = this.data?.selectedCandidates?.filter(res=>res?.PhoneNumber!='' && res?.PhoneNumber!=null && res?.PhoneNumber!=undefined);
    this.getBalance();
    // @suika @EWM-12925 modification as per story EWM-12888
    this.mappedPhones =  this.data?.selectedCandidates?.filter(res=>res?.PhoneNumber!='' && res?.PhoneNumber!=null && res?.PhoneNumber!=undefined);;
    // this.getMappedPhoneNumber();
    if(this.jobdetailsData?.PhoneNumber!=undefined && this.jobdetailsData?.PhoneNumber!=null && this.jobdetailsData?.PhoneNumber!=''){
      this.sendSMSForm.patchValue({
        ToPhone:this.jobdetailsData?.PhoneNumber,
        });
    }
   

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
      }else if(value.length<=306){
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
  
    let PhoneList:any[] = []; 
    this.mappedPhones?.forEach(element => {
      let ToPhone={};
      ToPhone["Id"] = element?.CandidateId,
      ToPhone["Name"] = element?.CandidateName,
      ToPhone["ToPhone"] = element?.PhoneNumber,
      PhoneList.push(ToPhone);
    }); 
       smsObj["PhoneList"] = PhoneList,
       smsObj["Subject"] = value.Subject,
       smsObj["MessageBody"] = value.MessageBody,
       smsObj["Provider"] = "Burst",
       smsObj["Type"] = "SmsNotification";
       smsObj["JobId"] = this.JobId;
       smsObj["JobName"] = this.JobName;
       smsObj["UserType"] = "CAND";
    this.systemSettingService.sendSmsJobForCan(smsObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          document.getElementsByClassName("JobSMSForCandidate")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
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
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
          this.balanceSMS = repsonsedata.Data.Balance;
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.balanceSMS = 0;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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



  /*
  @Type: File, <ts>
  @Name: getMappedPhoneNumber
  @Who: Suika
  @When: 27-Sep-2022
  @Why: EWM-8813 EWM-8952
  @What: to open template modal dialog
*/

getMappedPhoneNumber() {
  this.loading = true;
  let formData = {};
  formData['jobid'] = this.JobId;
  this.systemSettingService.getCandidateMappedPhone(formData).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.mappedPhones = repsonsedata.Data;
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.mappedPhones = []; //@suika @whn 02-05-2023 handle null 
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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


addOnBlur(){

}

 /*
   @Type: File, <ts>
   @Name: removeSkill function
   @Who: Anup Singh
   @When: 02-Nov-2021
   @Why: EWM-3132 EWM-3605
   @What: For remove skill chip
  */
isNotValidEmail:boolean = false;
EmailList=new FormControl('')
 isSkillValidation: boolean = true;
 removeSMS(mappedPhones: any): void {
   const index = this.mappedPhones.indexOf(mappedPhones);
   if (index >= 0) {
     this.mappedPhones.splice(index, 1);
   }
   // for validation
   if (this.mappedPhones == undefined || this.mappedPhones == null || this.mappedPhones.length == 0) {
     this.mappedPhones = [];
     this.sendSMSForm.get('ToEmailIds').reset();  
     this.sendSMSForm.get("ToEmailIds").setErrors({ required: true });
     this.sendSMSForm.get('ToEmailIds').setValidators([Validators.required]);
     this.EmailList.setValidators([Validators.required]);
     this.EmailList.setValue('');
     this.EmailList.markAsTouched();
     this.sendSMSForm.get('ToEmailIds').markAsTouched();
     this.isNotValidEmail = true;
   } else {
     this.isSkillValidation = true;
     this.isNotValidEmail = false;
     this.sendSMSForm.get("ToEmailIds").clearValidators();
     this.sendSMSForm.get("ToEmailIds").markAsPristine();
   }
 }


}
