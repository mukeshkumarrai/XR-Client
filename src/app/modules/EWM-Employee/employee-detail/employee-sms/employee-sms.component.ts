import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { JobSMSComponent } from '@app/modules/EWM.core/job/job/job-sms/job-sms.component';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Userpreferences, ButtonTypes, ResponceData } from '@app/shared/models';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-employee-sms',
  templateUrl: './employee-sms.component.html',
  styleUrls: ['./employee-sms.component.scss']
})
export class EmployeeSmsComponent implements OnInit {

  
  animationVar: any;
  @Input() JobId: any;
  @Input() JobName: any;
  @Input() WorkflowId: any;
  @Input() WorkflowName: any;
  @Input() candidateIdData:any;
  @Input() candidateDetails:any;
  @Output() onSmsHistoryForm = new EventEmitter<any>();
  public loading:boolean=false;
  public employeeID: string;
 public SMSHistory : any =[];
  dirctionalLang;
  @ViewChild('target', { read: ElementRef }) public myScrollContainer: ElementRef<any>;
  public userpreferences: Userpreferences;
  constructor(public systemSettingService: SystemSettingService,private _appSetting: AppSettingsService, public dialog: MatDialog,
    private snackBService: SnackBarService, private translateService: TranslateService,
    private router: ActivatedRoute,private route: Router,
    private _userpreferencesService: UserpreferencesService,) {
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
   this.router.queryParams.subscribe((value) => {
    this.employeeID = value.CandidateId;

  });
  this.getSMSHistory();
  this.animationVar = ButtonTypes;
  }


  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
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
  localStorage.removeItem('selectSMSTemp');
  this.loading = true;
  let userType='CAND';
  this.systemSettingService.getSMSHistory('?Id='+this.employeeID+'&UserType='+userType).subscribe(
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
  const dialogRef = this.dialog.open(JobSMSComponent, {
    maxWidth: "700px",
    data: new Object({ jobdetailsData: dataItem, JobId: this.JobId,JobName:dataItem.JobName?dataItem.JobName:this.JobName}),
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
