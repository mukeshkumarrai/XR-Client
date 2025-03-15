/*
 @(C): Entire Software
 @Type: File, <TS>
 @Who: Adarsh Singh
 @When: 16-Dec-2022
 @Why: EWM-9627 EWM-9907
 @What: xeople smart email.component.ts
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-xeople-smart-email',
  templateUrl: './xeople-smart-email.component.html',
  styleUrls: ['./xeople-smart-email.component.scss']
})
export class XeopleSmartEmailComponent implements OnInit {
  labelCandidate = '';
  fullEmail: any;
  getDomainName: any;
  loading: boolean;
  totalDataCount: any;
  orgData: any;
  featureById: any;
  label_can: string = '.can';
  label_job: string = '.job';
  orgShortCode: any;
  domainName: string;
  labelJobRefId = '';
  pagesize;
  pagneNo = 1;
  sortingValue: string = "OrganizationName,asc";
  public searchValue: string = "";
  EmailId: any;
  public emailConnection: boolean;
  dirctionalLang;


  constructor(public dialogRef: MatDialogRef<XeopleSmartEmailComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private appSettingsService: AppSettingsService, private _userAdministrationService: UserAdministrationService,
    private snackBService: SnackBarService, private translateService: TranslateService, public dialog: MatDialog,
    private mailService: MailServiceService) {
    this.labelCandidate = this.appSettingsService.email_forwarding;
    this.pagesize = this.appSettingsService.pagesize;
    this.pagneNo = this.appSettingsService.pageOption;
  }
  /*
   @Type: File, <ts>
   @Name: ngOnInit function
   @Who: Adarsh Singh
   @When: 19-Dec-2022
   @Why: EWM-9627 EWM-9907
   @What: calling function while opening the modal
 */
  ngOnInit(): void {
    this.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
    this.checkEmailConnection()
    this.domainName = localStorage.getItem('tenantDomain');
    let orgName = localStorage.getItem('OrganizationName');
    // let checkEmailConnection:any = localStorage.getItem('emailConnection');
    // let res = checkEmailConnection == 1 ? true : false;
    // this.emailConnection = res;
    this.orgShortCode = orgName;
  }

  /*
   @Type: File, <ts>
   @Name: onDismiss function
   @Who: Adarsh Singh
   @When: 19-Dec-2022
   @Why: EWM-9627 EWM-9907
   @What: for close modal
 */
  onDismiss(): void {
    document.getElementsByClassName("xeopleSmartEmailModal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("xeopleSmartEmailModal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    //this.route.navigate(['/client/cand/candidate/candidate', {CandidateId: this.candidateId}])
  }

  /*
   @Type: File, <ts>
   @Name: get complete domain name function
   @Who: Adarsh Singh
   @When: 16-Dec-2022
   @Why: EWM-9627 EWM-9907
   @What: get last daomin name or url
 */
  getComplteDomain() {
    const getEmailFormt = this.labelCandidate.split('@')
    let candidate = getEmailFormt[0];
    let emailDomain = getEmailFormt[getEmailFormt.length - 1];
    this.labelCandidate = candidate;
    this.getDomainName = emailDomain;
  }
  /*
    @Type: File, <ts>
    @Name: getOrganizationInfo function
    @Who: Adarsh Singh
    @When: 16-Dec-2022
    @Why: EWM-9627 EWM-9907
    @What: call Get method for organization short code
  */
  getOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue) {
    this.loading = true;
    this._userAdministrationService.getOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue).subscribe(
      repsonsedata => {
        this.totalDataCount = repsonsedata['TotalRecord'];
        this.orgData = repsonsedata['Data'];
        let featureBy: any = this.orgData.filter(x => x['OrganizationName'] == this.orgShortCode);
        this.getComplteDomain();
        this.featureById = featureBy[0].Key;
        this.fullEmail = this.domainName + '.' + this.featureById + this.label_can + '@' + this.getDomainName;
        this.labelJobRefId = 'JobRefId.job@' + this.getDomainName;
        this.EmailId = this.labelCandidate + '+' + this.fullEmail
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Type: File, <ts>
   @Name: copyJobApplicationUrl function
  @Who: Adarsh Singh
  @When: 16-Dec-2022
  @Why: EWM-9627 EWM-9907
   @What: for copy current data
*/

    /*
   @Type: File, <ts>
   @Name: copyCandidateEmailId function
   @Who: Suika
   @When: 18-July-2023
   @Why: EWM-13288 EWM-13179
   @What: for copy current data
*/
copyCandidateEmailId(EmailId,index){
  // for display and auto hide after some time
  let el = document.getElementById('autocanHide'+index);
  el.style.display = 'block';
  setTimeout(() => {
    let el = document.getElementById('autocanHide'+index);
    el.style.display = 'none';
  }, 2000);
  // End
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = EmailId;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

  /*
  @Type: File, <ts>
  @Name: openNewEmailModal function
  @Who: Adarsh Singh
  @When: 16-Dec-2022
  @Why: EWM-9627 EWM-9907
  @What: opening new mail
   */
  openNewEmailModal(responseData: any, mailRespondType: string, candidateEmail, event) {
    this.dialogRef.close({ pageName: 1 });
    event.stopPropagation();
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      maxHeight: "100%",
      height: "100%",
      data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': this.EmailId, 'JobId': null, xeopleSmartEmail:true },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) { }
    })
  }

  /*
     @Type: File, <ts>
     @Name: checkEmailConnection function
     @Who: Adarsh Singh
     @When: 19-Dec-2022
     @Why: EWM-9627 EWM-9908
     @What: checking email is connected or not
   */
  checkEmailConnection() {
    this.loading = true;
    this.mailService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.loading = false;
          if (data.Data.IsEmailConnected == 1) {
            this.emailConnection = true;
          } else {
            this.emailConnection = false;
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
}
