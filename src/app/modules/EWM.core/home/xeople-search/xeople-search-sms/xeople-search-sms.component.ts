/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: maneesh
    @When: 09 feb 2023
    @Why: EWM-10033
    @What:  This page is job sms for candidate
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { QuickpeopleService } from '../../../shared/services/quick-people/quickpeople.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SmsTemplateComponent } from '../../../shared/quick-modal/new-email/templates/sms-template/sms-template.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { XeopleSearchMsgComponent } from '../xeople-search-msg/xeople-search-msg.component';

@Component({
  selector: 'app-xeople-search-sms',
  templateUrl: './xeople-search-sms.component.html',
  styleUrls: ['./xeople-search-sms.component.scss']
})
export class XeopleSearchSmsComponent implements OnInit {
  sendSMSForm: FormGroup;
  maxMessage: number;
  loading: boolean;
  jobdetailsData: any = [];
  JobId: any;
  JobName: any;
  public numberPattern = "^[0-9]*$";

  selectedMobileNumberValue: any = 0;
  countryId: any;
  countryCode: any = [];
  IsPhoneCode: boolean = false;
  public smsCount: number = 0;
  public msgLength: number = 0;
  public maxsmsLength: number;
  public minimumBalanceSMS: number = 0;
  toEmailList: any = [];
  phonenumber: any
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public phone: any = []
  removable = true;
  public emailListLengthToMore: any = 3;
  public errorField:any=[];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
    private snackBService: SnackBarService, private serviceListClass: ServiceListClass, private quickpeopleService: QuickpeopleService,
    public dialogRef: MatDialogRef<XeopleSearchSmsComponent>, private commonserviceService: CommonserviceService, public dialog: MatDialog, private translateService: TranslateService,
    public systemSettingService: SystemSettingService, private _appSetting: AppSettingsService, private sanitized: DomSanitizer,
    private el: ElementRef) {
     this.maxMessage = this._appSetting.maxsmslength;
    this.maxsmsLength = this._appSetting.maxsmslength;
    this.minimumBalanceSMS = this._appSetting.minimumBalanceSMS
    this.sendSMSForm = this.fb.group({
      ToPhone: ['',[Validators.required]],
      Subject: ['', [Validators.required, Validators.maxLength(75), Validators.minLength(1)]],
      MessageBody: ['', [Validators.required, Validators.maxLength(this.maxsmsLength), Validators.minLength(1)]]

    });

  }

  ngOnInit(): void {
    this.jobdetailsData = this.data.jobdetailsData;    
    this.phone = this.jobdetailsData.filter(x => x.PrimaryMobileNo != null  && x.PrimaryMobileNo.trim() !== '')
    this.JobId = this.data?.JobId;
    this.JobName = this.data?.JobName;
    this.getBalance();
    this.patch()
  }
/*
@Type: File, <ts>
@Name: patch function
@Who: maneesh
@When: 09 feb 2023
@Why: EWM-10033
@What: For patch value
*/
  patch() {
    for (let i = 0; i < this.jobdetailsData.length; i++) {
      const element = this.jobdetailsData[i];
      if (this.jobdetailsData[i]?.PrimaryMobileNo != undefined && this.jobdetailsData[i]?.PrimaryMobileNo != null && this.jobdetailsData[i]?.PrimaryMobileNo != '') {
        this.sendSMSForm.patchValue({
          ToPhone: this.jobdetailsData[i].PrimaryMobileNo
        });
      }
    }
  }
/*
@Type: File, <ts>
@Name: clickForToMoreRecord function
@Who: maneesh
@When: 09 feb 2023
@Why: EWM-10033
@What: For showing more record
*/
  public clickForToMoreRecord(phonenumber) {
    this.emailListLengthToMore = phonenumber?.length;
  }
  /*
@Type: File, <ts>
@Name: addFrom function
@Who: maneesh
@When: 09 feb 2023
@Why: EWM-10033
@What: For add fone number
*/
  addFrom(event: MatChipInputEvent): void {
    if (this.sendSMSForm.get("ToPhone").value === null || this.sendSMSForm.get("ToPhone").value === '') {
      // this.sendSMSForm.get("ToPhone").clearValidators();
      this.sendSMSForm.get("ToPhone").setErrors({ required: true });
      this.sendSMSForm.get("ToPhone").markAsDirty();
    }else{
      this.sendSMSForm.get("ToPhone").clearValidators();

    }
  }
  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: maneesh
@When: 09 feb 2023
@Why: EWM-10033
@What: For cancel popup
*/
  removeToEmail(data: any): void {
    if (this.toEmailList.indexOf(data) >= 0) {
      this.toEmailList.splice(this.toEmailList.indexOf(data), 1);
    }
  }
  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: maneesh
@When: 09 feb 2023
@Why: EWM-10033
@What: For cancel popup
*/
  onDismiss(): void {
    localStorage.removeItem('selectSMSTemp');//who:maneesh for clear value,when:30/11/2023;
    document.getElementsByClassName("JobSMSForCandidate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


  /*
@Type: File, <ts>
@Name: onMessage function
@Who: maneesh
@When: 09 feb 2023
@Why: EWM-10033
@What: For message count
*/
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.msgLength = value.length;
      this.maxMessage = this.maxsmsLength - value.length;
      if (value.length == 0) {
        this.smsCount = 0;
      } else if (value.length <= 160) {
        this.smsCount = 1;
      } else if (value.length <= 306) {
        this.smsCount = 2;
      } else if (value.length <= 459) {
        this.smsCount = 3;
      } else if (value.length <= 612) {
        this.smsCount = 4;
      } else {
        this.smsCount = 5;
      }
    }

  }
/*
@Type: File, <ts>
@Name: onConfirm function
@Who: maneesh
@When: 09 feb 2023
@Why: EWM-10033
@What: For send SMS
*/
  onConfirm(value) {
    localStorage.removeItem('selectSMSTemp');//who:maneesh for clear value,when:30/11/2023;
    this.loading = true;
    let smsObj = {};
    let PhoneList = [];
    this.phone.forEach(function (elem) {
      PhoneList.push({
        "Id": elem.Id,
        "Name": elem.Name,
        "ToPhone":'+'+elem.PhoneCode+''+elem.PrimaryMobileNo /*-@Why: EWM-11412,@When: 20 March 2023,@Who:Nitin Bhati,@Name:for pass Number code include + symbol,-*/
      });
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
          this.errorField=repsonsedata?.ErrorFields;          
          if (this.errorField?.length!=0) {
            this.openMsgFilterModal()
          }
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
  @Who: Nitin Bhati
  @When: 10 feb 2023
  @Why: EWM-11026
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
   @Name: removeSMS function
   @Who: Nitin Bhati
   @When: 09 feb 2023
   @Why: EWM-11026
   @What: For remove sms chip
  */
   removeSMS(mappedPhones: any): void {
   const index = this.phone.indexOf(mappedPhones);
   if (index >= 0) {
     this.phone.splice(index, 1);
   }
    // for validation
    if (this.phone == undefined || this.phone == null || this.phone.length == 0) {
      this.phone = [];
      this.sendSMSForm.get('ToPhone').reset();  
      this.sendSMSForm.get("ToPhone").setErrors({ required: true });
      this.sendSMSForm.get('ToPhone').setValidators([Validators.required]);
      this.sendSMSForm.get('ToPhone').markAsTouched();
    } else {
      this.sendSMSForm.get("ToPhone").clearValidators();
      this.sendSMSForm.get("ToPhone").markAsPristine();
    }  
 }

 /*
  @Type: File, <ts>
  @Name: getBalance
  @Who: Nitin Bhati
  @When: 10-March-2023
  @Why: EWM-11026
  @What: For SMS balance
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
        //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
//by maneesh,when:21/05/2024 what:ewm-17100
openMsgFilterModal() {
  const dialogRef = this.dialog.open(XeopleSearchMsgComponent, {
    data: { errorFieldData: this.errorField },
    panelClass: ['xeople-modal-sm', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
}
}
