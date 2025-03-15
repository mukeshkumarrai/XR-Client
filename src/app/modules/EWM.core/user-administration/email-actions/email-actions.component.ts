import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UserAdministrationService } from '../../shared/services/user-administration/user-administration.service';

@Component({
  selector: 'app-email-actions',
  templateUrl: './email-actions.component.html',
  styleUrls: ['./email-actions.component.scss']
})
export class EmailActionsComponent implements OnInit {
  public loading: boolean;
  public gridData: any;
  statusId: number;
  emailForwardForm: FormGroup;
  statusName: any;
  checkedLabel: boolean;
  fullEmail:string;
  labelCandidate = '';
  labelJobRefId = '';
  public viewMode: string = 'cardMode';
  public gridView: any[];
  pagesize;
  pagneNo = 1;
  sortingValue: string = "OrganizationName,asc";
  public searchValue: string = "";
  formtitle: string = 'grid';
  public active = false;
  totalDataCount: any;
orgShortCode:any;
featureById:any;
label_can:string = '.can';
label_job:string = '.job';
domainName:string;
orgData:any;
getDomainName: any;
dirctionalLang;
  EmailId: string;
  showMsg: boolean;

  constructor(private route: Router,public _sidebarService: SidebarService,private _userAdministrationService:UserAdministrationService,private snackBService:SnackBarService,
    private translateService:TranslateService,private fb: FormBuilder,public dialog: MatDialog,private appSettingsService: AppSettingsService,) { 
      this.emailForwardForm = this.fb.group({
        EmailForwardingStatus: [false]
      })
    this.pagesize = this.appSettingsService.pagesize;
    this.labelCandidate =  this.appSettingsService.email_forwarding;
    }

  ngOnInit(): void {

    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.getEmailForwarding();
    this.getOrganizationInfo(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue);
    this.domainName = localStorage.getItem('tenantDomain');
    let orgName = localStorage.getItem('OrganizationName');
    this.orgShortCode = orgName;

  }

  /*
 @Type: File, <ts>
 @Name: getEmailForwarding function
 @Who: Adarsh singh
 @When: 03-Feb-2020
 @Why: EWM.4462.EWM-4968
 @What: call Get method from services.
  */
  getEmailForwarding(){
    this.loading=true;
    this._userAdministrationService.getEmailForwarding().subscribe(
      (repsonsedata:any)=>{
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading=false;
          this.gridData = repsonsedata['Data'];
          if(repsonsedata.Data.EmailForwardingStatus === 1){
            this.checkedLabel = true;
            this.emailForwardForm.patchValue({
              'EmailForwardingStatus':true
            })
          }
          else{
            this.checkedLabel = false;
            this.emailForwardForm.patchValue({
              'EmailForwardingStatus':false
            })
          }
        }
      },
      err=>{
         this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }) 
  }

    /*
 @Type: File, <ts>
 @Name: updateEmailForward function
 @Who: Adarsh singh
 @When: 03-Feb-2020
 @Why: EWM.4462.EWM-4968
 @What: update data .
  */
  updateEmailForward(oldPatchValues,statusName){
    this.loading = true;
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = oldPatchValues;
  
    toObj['Id'] = oldPatchValues.Id;
    toObj['EmailForwardingStatus'] = statusName;

    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
  
    this._userAdministrationService.updateEmailForwarding(updateObj[0]).subscribe(
      (repsonsedata:ResponceData) =>{
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.getEmailForwarding();
        }
        else if(repsonsedata.HttpStatusCode === 400 ){
          this.loading = false;
          this.getEmailForwarding();
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
        else{
          this.loading = false;
        }
        },err=>{
         this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }) 
  }

   /*
 @Type: File, <ts>
 @Name: toggleVisibility function
 @Who: Adarsh singh
 @When: 03-Feb-2020
 @Why: EWM.4462.EWM-4968
 @What: chnage email forwarding while click on toggle button.
  */
  toggleVisibility(checkData,data:any){
    const message = '';
    const title = '';
    // const subTitle = 'label_Team';
    const  subTitle = this.checkedLabel ? 'label_areYouSureToDisableXeopleSmartEmail' : 'label_areYouSureToEnableXeopleSmartEmail';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "355px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if(checkData == 1){
          this.statusName = 1;
         }
         else{
           this.statusName = 0;
         }
         this.updateEmailForward(data,this.statusName);
      } else {
        if(checkData === false){
          this.emailForwardForm.patchValue({
            'EmailForwardingStatus':true
          })
        }
        else{
          this.emailForwardForm.patchValue({
            'EmailForwardingStatus':false
          })
        }
      }
    });

    /* RTL code */
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    
  }

  /*
  @Type: File, <ts>
  @Name: getOrganizationInfo function
 @Who: Adarsh singh
 @When: 15-Feb-2020
 @Why: EWM.4462.EWM-4968
  @What: call Get method from services for showing data into grid.
   */
  getOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue) {
    this.loading = true;
    this._userAdministrationService.getOrganizationInfo(pagesize, pagneNo, sortingValue, searchValue).subscribe(
      repsonsedata => {
        
        this.totalDataCount = repsonsedata['TotalRecord'];
        this.orgData = repsonsedata['Data'];
        // this.gridView = repsonsedata['Data'];
        
        let featureBy:any= this.orgData.filter(x => x['OrganizationName'] == this.orgShortCode);
        this.getComplteDomain();
        this.featureById = featureBy[0].Key;
        this.fullEmail = this.domainName+'.'+ this.featureById+this.label_can+ '@'+ this.getDomainName;
        this.labelJobRefId = 'JobRefId.job@' + this.getDomainName;
        this.EmailId = this.labelCandidate + '+' + this.fullEmail
        this.loading = false;
        // this.reloadListData();
        // this.doNext();
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

    /*
  @Type: File, <ts>
  @Name: get complete domain name function
  @Who: Adarsh singh
  @When: 15-Feb-2020
  @Why: EWM.5362.EWM-5367
  @What: get last daomin name or url
   */
   getComplteDomain(){
    const getEmailFormt = this.labelCandidate.split('@')
    let candidate =  getEmailFormt[0];
    let emailDomain =  getEmailFormt[getEmailFormt.length - 1];
    this.labelCandidate = candidate;
    this.getDomainName = emailDomain;
  }


  

  /* 
   @Type: File, <ts>
   @Name: copyCandidateEmailId function
   @Who: Suika
   @When: 18-July-2023
   @Why: EWM-13288 EWM-13179 
   @What: for copy current data 
*/
copyCandidateEmailId(EmailId:any,index){
  this.showMsg = true;
  // for display and auto hide after some time 
  let el = document.getElementById('autoHide'+index);
  el.style.display = 'block'; 
  setTimeout(() => {
    let el = document.getElementById('autoHide'+index);
    el.style.display = 'none';
    this.showMsg = false;
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

}
