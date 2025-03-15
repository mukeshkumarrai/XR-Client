import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service'
import { JobSmsComponent } from '../job-sms.component';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-sms-history',
  templateUrl: './sms-history.component.html',
  styleUrls: ['./sms-history.component.scss']
})
export class SmsHistoryComponent implements OnInit {

  @Input() JobId: any;
  @Input() JobName: any;
  @Input() WorkflowId: any;
  @Input() WorkflowName: any; 
  @Input() candidateIdData:any; 
  @Input() candidateDetails:any;
  @Output() onSmsHistoryForm = new EventEmitter<any>();
  public loading:boolean=false;
  @Input() SMSHistory:any[]=[]; 
  dirctionalLang;
  @ViewChild('target', { read: ElementRef }) public myScrollContainer: ElementRef<any>;
  public userpreferences: Userpreferences;
  UserType: string='CAND';
  @Input() hideCanselBtn: boolean;
  constructor(public systemSettingService: SystemSettingService,private _appSetting: AppSettingsService, public dialog: MatDialog,
    private snackBService: SnackBarService, private translateService: TranslateService, 
    private _userpreferencesService: UserpreferencesService,private commonserviceService: CommonserviceService,) {
      this.userpreferences = this._userpreferencesService.getuserpreferences();
   }

  ngOnInit(): void {
    if(this.candidateIdData!=undefined){
    setTimeout(() => {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 0);
   }
   
   this.commonserviceService?.getContactSummerySmsData?.subscribe(res => {
    if (res!=null && res!=undefined) {
      this.SMSHistory=res;
    }
   })   
  }


  
  /*
  @Type: File, <ts>
  @Name: getSMSHistory
  @Who: Suika
  @When: 27-Sep-2022
  @Why: EWM-8813 EWM-8952
  @What: to open template modal dialog
*/

getSMSHistory() {
  this.loading = true;
  this.systemSettingService.getSMSHistory('?Id='+this.candidateIdData+'&UserType='+this.UserType).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.SMSHistory = repsonsedata.Data;
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.SMSHistory = [];
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
  @Name: sortName function
  @Who: Nitin
  @When: 4-Oct-2021
  @Why: EWM-3144
  @What: For showing shortname on image icon
  */
 sortName(fisrtName) {
  if (fisrtName) {
    const Name = fisrtName;
    let charCount = Name.split(" ").length - 1;
    if (charCount > 0) {
      const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
      let first = ShortName1.slice(0, 1);
      let last = ShortName1.slice(-1);
      let ShortName = first.concat(last.toString());
      return ShortName.toUpperCase();
    } else {
      const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
      let first = ShortName1.slice(0, 1);
      let ShortName = first;
      return ShortName.toUpperCase();
    }

  }

}



  /*
  @Type: File, <ts>
  @Name: openJobSMS
  @Who: Anup Singh
  @When: 16-Dec-2021
  @Why: EWM-4210 EWM-4219
  @What: to open job Sms For Candidate modal dialog
  */
 openJobSMSForCandidate(dataItem) {
  const dialogRef = this.dialog.open(JobSmsComponent, {
    maxWidth: "700px",
    data: new Object({ jobdetailsData: dataItem, JobId: this.JobId,JobName:dataItem.JobName?dataItem.JobName:this.JobName,UserType:'CAND'}),
    width: "90%",
    maxHeight: "85%",
    panelClass: ['JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) {
      setTimeout(() => {
        this.getSMSHistory();
      }, 1500);
     
    } else {
      this.loading = false;
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


closeToggel(){
  this.onSmsHistoryForm.emit(true);
}

resendSMS(sms){
  this.loading = true;
  let smsObj = {};
  let ToPhone={};
  let PhoneList:any[] = [];     
     ToPhone["Id"] = sms?.Id,
     ToPhone["Name"] =sms?.Name,
     ToPhone["ToPhone"] = sms?.MobileNumber,
     PhoneList.push(ToPhone);
     smsObj["PhoneList"] = PhoneList,
     smsObj["Id"] = sms?.SMSId,
     smsObj["Subject"] = sms.subject?sms.subject:"subject",
     smsObj["MessageBody"] = sms.MessageBody,
     smsObj["Provider"] = "Burst",
     smsObj["Type"] = "ReSendSmsNotification";
     smsObj["JobId"] = this.JobId;
     smsObj["JobName"] = this.JobName;
     smsObj["UserType"] = "CAND";
  this.systemSettingService.sendSmsJobForCan(smsObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        document.getElementsByClassName("JobSMSForCandidate")[0]?.classList.remove("animate__zoomIn")
        document.getElementsByClassName("JobSMSForCandidate")[0]?.classList.add("animate__zoomOut");
// @bantee @EWM-14292 @whn 22-09-2023
       
        // this.snackBService.showThankyouSMSSnackBar(this.translateService.instant('label_sendSMS'), '');
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

}
