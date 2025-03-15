import { Component, Inject, Input, OnInit } from '@angular/core';
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
  selector: 'app-vxt-add-call-log',
  templateUrl: './vxt-add-call-log.component.html',
  styleUrls: ['./vxt-add-call-log.component.scss']
})
export class VxtAddCallLogComponent implements OnInit {
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
  @Input() candidatePhone:string;


  constructor(public dialogRef: MatDialogRef<VxtAddCallLogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
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
    
    // this.domainName = localStorage.getItem('tenantDomain');
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
    document.getElementsByClassName("manualCall")[0].classList.remove("animate__fadeOutRight")
    document.getElementsByClassName("manualCall")[0].classList.add("animate__fadeOutRight");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    //this.route.navigate(['/client/cand/candidate/candidate', {CandidateId: this.candidateId}])
  }


}

 
