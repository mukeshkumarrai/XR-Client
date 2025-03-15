/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 17-Oct-2023
  @Why: EWM-14828 EWM-14832 EWN-14833
  @What:  Candidate card info
*/
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { JobSMSComponent } from 'src/app/modules/EWM.core/job/job/job-sms/job-sms.component';
import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { CandidateDetails } from './applicant-model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-applicant-detail-popup',
  templateUrl: './applicant-detail-popup.component.html',
  styleUrls: ['./applicant-detail-popup.component.scss']
})
export class ApplicantDetailPopupComponent implements OnInit {

  jobId: string;
  loading: boolean;
  candidateInfo: CandidateDetails;
  zoomPhoneCallRegistrationCode: string;
  isZoomCallConnected: boolean;
  SMSHistory: any[];
  jobName: string;
  isCopied: boolean;
  candId: string;
  isCopiedEmail: boolean;
  workflowId: string;
  emailConnection: boolean = false;
  burstSMSRegistrationCode: any;
  public isSMSStatus: boolean = false;
  public userpreferences: Userpreferences;
  LastActivity: number = 0;
  candidatedetails: any;

  getSMSRegistrationCode: string;
  public destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  public isSmsHistoryForm: boolean = false;
  public candidateDetails:any=[];
  public candidateIdData: string;
  public smsHistoryToggel:boolean=false;
  public quickFilterToggel:boolean=true;
  public contactPhone:number;
  public userType='CAND';
  constructor(public dialogRef: MatDialogRef<ApplicantDetailPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private jobService: JobService, private snackBService: SnackBarService, private translateService: TranslateService,
    private _systemSettingService: SystemSettingService, private appSettingsService: AppSettingsService, public dialog: MatDialog,
    private mailService: MailServiceService, public _userpreferencesService: UserpreferencesService,) {
    this.candidatedetails = this.data?.candidatedata;
    this.candId = this.data?.candidatedata?.CandidateId;
    this.LastActivity=this.data?.candidatedata.LastActivityDate;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getSMSRegistrationCode = this.appSettingsService.xeopleSMSRegistrationCode;
    this.jobId = data?.JobId;
  }
  ngOnInit(): void {
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    // Zoom
    let zoomCallIntegrationObj = otherIntegrations?.filter(res => res.RegistrationCode == this.zoomPhoneCallRegistrationCode);
    this.isZoomCallConnected = zoomCallIntegrationObj[0]?.Connected;
    // SMS
    let smsIntegrationObj = otherIntegrations?.filter(res => res.RegistrationCode == this.burstSMSRegistrationCode);
    this.isSMSStatus = smsIntegrationObj[0]?.Connected;
    this.checkEmailConnection();
  }
  /* @Type: File, <ts> | @Name: checkEmailConnection function | @Who: Satya Prakash Gupta | @When: 10-April-2024 | @Why: EWM-15579 EWM-16659 : @What: check email connection is established or not */
  checkEmailConnection(){
    let isemailConnect:any = localStorage.getItem('emailConnection');
    if (isemailConnect == 1) {
      this.emailConnection = true;
    } else{
      this.emailConnection = false;
    }
  }
  /*
    @Type: ondismiss()
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: close popup on click cross button
   */
  onDismiss() {
    document.getElementsByClassName("animate__animated")[0].classList.remove("open-candidate-details")
    document.getElementsByClassName("animate__animated")[0].classList.add("open-candidate-details");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  /*
    @Type: zoomCallEnable()
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: to enable zoom call
  */
  zoomCallEnable(phoneNo: any) {
    if (phoneNo) {
      window.open('zoomphonecall://' + phoneNo, '_blank');
    }
  }
  /* 
    @Type: File, <ts>
    @Name: smsHistoryDetails function
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What:For sms hostory
  */
  smsHistoryDetails(candidatedetails) {
      this.contactPhone=candidatedetails?.PhoneNumber;   //who:maneesh as discuss with ankit rajput sir this line use for send sms btn enabel and disable
      this.getSMSHistoryData(candidatedetails);
      this.smsHistoryToggel = true;
  }
    /*
 @Type: File, <ts>
 @Name: getSMSHistoryData function
 @Who: maneesh
 @When: 07-nov-2023
 @Why: EWM-14977
 @What: fetch sms histroy
 */
  getSMSHistoryData(can) {
    this.loading = true;
    let userType='CAND';
    this._systemSettingService.getSMSHistory('?Id='+can.CandidateId+'&UserType='+userType).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.SMSHistory = repsonsedata.Data;          
          if(this.SMSHistory?.length>0){
            this.smsHistoryDrawer?.open();
            this.isSmsHistoryForm = true;
            can['JobName'] = this.jobName;
            this.candidateIdData = can.CandidateId;
            this.candidateDetails = can;            
          }
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.SMSHistory = [];
          this.openJobSMSForCandidate(can);

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
 @Name: toggleDrwer function
 @Who: maneesh
 @When: 07-nov-2023
 @Why: EWM-14977
 @What: toggle assign job drawer
 */
 toggleDrwer(start: any) {
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
  start.toggle();
}
fetchDataFromSMSHistory(event){
  if(event){
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
    this.smsHistoryDrawer.close();
  }
}
  /*
    @Type: File, <ts>
    @Name: openJobSMS
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: to open job Sms For Candidate modal dialog
  */
  openJobSMSForCandidate(dataItem) {
    const dialogRef = this.dialog.open(JobSMSComponent, {
      data: new Object({ jobdetailsData: dataItem, JobId: this.jobId, JobName: this.jobName,UserType:this.userType }),
      panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getSMSHistory();
        this.loading = false;
      } else {
        this.loading = false;
      }
      this.smsHistoryToggel = false;
    })
  }
  /*
    @Type: File, <ts>
    @Name: getSMSHistory
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: to open template modal dialog
  */
  getSMSHistory() {
    this.loading = true;
    // let userType='CAND';
    this._systemSettingService.getSMSHistory('?Id='+this.candId+'&UserType='+this.userType).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.SMSHistory = repsonsedata.Data;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
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
    @Type: File, <ts>
    @Name: copyPhoneNumber
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: copy phone number
  */
  copyPhoneNumber(copyPhoneNumber: string) {
    this.isCopied = true;
    setTimeout(() => {
      this.isCopied = false;
    }, 3000);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = copyPhoneNumber;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  /* 
    @Type: File, <ts>
    @Name: openNewEmailModal function
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: opening new mail
  */
  openNewEmailModal(responseData: any, mailRespondType: string, candidateEmail: any) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      maxHeight: "100%",
      height: "100%",
      //CandidateId: this.candId,'XeopleSearchgridMail': true, use for ewm-17337 by maneesh
      data: {
        'res': responseData, 'mailRespondType': mailRespondType, 'openType': this.emailConnection,
        'candidateMail': candidateEmail, 'JobId': this.jobId, 'workflowId': this.workflowId, candidateData: { CandidateId: this.candId },
        openDocumentPopUpFor: 'Candidate',CandidateId: this.candId,'XeopleSearchgridMail': true,
      },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

      }
    })

  }

  /*
    @Type: File, <ts>
    @Name: copyEmail
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: copy Email
  */
  copyEmail(copyEmail: string) {
    this.isCopiedEmail = true;
    setTimeout(() => {
      this.isCopiedEmail = false;
    }, 2000);
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = copyEmail;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /* 
    @Name: getBackgroundColor function
    @Who: Satya Prakash
    @When: 17-Oct-2023
    @Why: EWM-14828 EWM-14832 EWN-14833
    @What: set background color
  */
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }

  manageCandidateSummary() {
    let URL = '/client/cand/candidate/candidate?CandidateId=' + this.candidatedetails?.CandidateId + '&Type=' + 'CAND' + '&cantabIndex=' + 0;
    window.open(URL, '_blank')
 }

}
