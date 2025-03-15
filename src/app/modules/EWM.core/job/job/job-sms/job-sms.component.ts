/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 16 Dec
    @Why: EWM-4210 EWM-4219
    @What:  This page is job sms for candidate
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { QuickpeopleService } from '../../../shared/services/quick-people/quickpeople.service';
import { ResponceData } from 'src/app/shared/models';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { TemplatesComponent } from '../../../shared/quick-modal/new-email/templates/templates.component';
import { SmsTemplateComponent } from '../../../shared/quick-modal/new-email/templates/sms-template/sms-template.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SendSmsData } from 'src/app/shared/models/sendsms';
import { XeopleSearchMsgComponent } from '@app/modules/EWM.core/home/xeople-search/xeople-search-msg/xeople-search-msg.component';

@Component({
  selector: 'app-job-sms',
  templateUrl: './job-sms.component.html',
  styleUrls: ['./job-sms.component.scss']
})
export class JobSMSComponent implements OnInit {
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
  UserType: any;
  public errorField:any=[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
    private snackBService: SnackBarService, private serviceListClass: ServiceListClass,private quickpeopleService:QuickpeopleService,
    public dialogRef: MatDialogRef<JobSMSComponent>, private commonserviceService: CommonserviceService, public dialog: MatDialog, private translateService: TranslateService,
     public systemSettingService: SystemSettingService,private _appSetting: AppSettingsService,private sanitized: DomSanitizer,
     private el: ElementRef,private renderer: Renderer2) {
      this.maxsmsLength = this._appSetting.maxsmslength;
      this.minimumBalanceSMS = this._appSetting.minimumBalanceSMS

    this.sendSMSForm = this.fb.group({
      PhoneCode:['',Validators.required],
      //  @When: 09-10-2023 @who:maneesh @why: EWM-14669 @what: Change the maxlength length of phone no from 20 to 11 while entering phone no  -->
      ToPhone:[, [Validators.required,Validators.pattern(this.numberPattern),Validators.maxLength(11),Validators.minLength(4)]],
      //  @When: 28-11-2023 @who:maneesh @why: EWM-15173 @what: Change the maxlength length subject from 1000 to 75   -->
      Subject:['', [Validators.required,Validators.maxLength(75),Validators.minLength(1)]],
      MessageBody: ['', [Validators.required,Validators.maxLength(this.maxsmsLength),Validators.minLength(1)]]

    });
   
  }


  ngOnInit(): void {  
    this.jobdetailsData = this.data?.jobdetailsData;
    this.UserType = this.data?.UserType;
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
     this.getValidationPhone();
  }
  // who:maneesh,what: or validation trigger when open sms popup,when:09/11/2023
  getValidationPhone(){  
    if (!this.sendSMSForm.get('ToPhone').valid) {
    this.renderer.selectRootElement('#sms-phoneNumber').focus();
    this.sendSMSForm.get('ToPhone').markAllAsTouched();
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
    localStorage.removeItem('selectSMSTemp');
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
       this.selectedMobileNumberValue= Number(this.countryCode?.Id);
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
    let ToPhone={};
    let PhoneList:any[] = [];     
       ToPhone["ToPhone"] ='+' + value.PhoneCode + value.ToPhone,
       PhoneList.push(ToPhone);
       let name;
       let id;
       if(this.UserType==="CLIE" ||  this.UserType==="LEAD"){
        name=this.jobdetailsData?.ClientName? this.jobdetailsData.ClientName : this.jobdetailsData?.LeadName;
        id=this.jobdetailsData?.ClientId?this.jobdetailsData?.ClientId:this.jobdetailsData?.LeadId;
       }else {
        name= this.jobdetailsData?.CandidateName?this.jobdetailsData?.CandidateName:this.jobdetailsData?.Name;
        id =this.jobdetailsData?.CandidateId?this.jobdetailsData?.CandidateId:this.jobdetailsData?.Id;
       }
       ToPhone["Name"] =name;
       ToPhone["Id"] = id;
       let smsObj:SendSmsData = {
        PhoneList:PhoneList,
        Subject:value.Subject,
        MessageBody:value.MessageBody,
        Type:value.RelatedUserId,
        Provider:"Burst",
        JobId:this.JobId,
        JobName: this.JobName,
        UserType:this.UserType?this.UserType:"CAND",
       }
    this.systemSettingService.sendSmsJobForCan(smsObj).subscribe(
      (repsonsedata: any) => {
        localStorage.removeItem('selectSMSTemp');
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false; 
          document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.errorField=repsonsedata?.ErrorFields;          
          if (this.errorField?.length!=0) {
            this.openMsgFilterModal()
          }
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
  const dialogData = new ConfirmDialogModel(title, subtitle, message,);
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
         this.selectedMobileNumberValue= Number(this.countryCode?.Id);
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

//by maneesh,when:21/05/2024 what:ewm-17100
openMsgFilterModal() {
  const dialogRef = this.dialog.open(XeopleSearchMsgComponent, {
    data: { errorFieldData: this.errorField },
    panelClass: ['xeople-modal-sm', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
}
}