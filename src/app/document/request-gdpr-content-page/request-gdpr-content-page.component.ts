import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-request-gdpr-content-page',
  templateUrl: './request-gdpr-content-page.component.html',
  styleUrls: ['./request-gdpr-content-page.component.scss'],
  providers: [DummyService]
})
export class RequestGdprContentPageComponent implements OnInit {
  public userpreferences: Userpreferences;
  showingDiv: boolean=true;
  public errorMessage : boolean;
  public showMessage : boolean;
  showingrenew: boolean=false;
  showinggive: boolean=true;
  showingwithhold: boolean=true;
  showinggiveMessage: boolean=false;
  pageTemplate: any = ``;
  TenantId: any;
  RequesterId: any;
  RequesterType: any;
  RequestedOn: any;
  Valid: any;
  Consentdate: any;
  ConsentType: any;
  code: any;
  public shortUrl:string;
  loading: boolean;
  userDefoultLang: string;
  langflag: string;
  public showResetMes : boolean = false;
  public uriCoderArray={};
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  
  constructor(private _Service:SystemSettingService,private snackBService: SnackBarService,private _sanitizer: DomSanitizer,
     private route: ActivatedRoute,private translateService: TranslateService,public _userpreferencesService: UserpreferencesService,
     private commonserviceService: CommonserviceService,
     public dummyService: DummyService,
     @Inject(DOCUMENT) private document: Document,
     public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.commonserviceService.setDrawer(this.drawer);
    this.route.queryParams.subscribe(params => {
      this.code = params.t;  
      this.getGDPRConsentByid(this.code);
    });
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.document.body.classList.add('login-screen-body');
  }

  public useLanguage(lang: string): void {
    this.translateService.setDefaultLang(lang);
    this.userDefoultLang = lang;
    this.langflag = lang;
  }
  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Open modal window
  // @What: this function used for open policy and terem modal window.
  // @Return: None
  // @Params :
  // 1. lang - language code.

  openDialog(param): void {
    if (param === 'privacy') {
      this.modaldata = this.dummyService.getPolicy();
    }
    if (param === 'term') {
      this.modaldata = this.dummyService.getTerm();
    }
    const dialogRef = this.dialog.open(FooterDialogComponent, {
      maxWidth:"750px",
      width: '90%',
      disableClose: true,
      data: this.modaldata,
      panelClass: ['footerPopUp', 'animate__slow', 'animate__animated', 'animate__fadeInUpBig']
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
 /* 
  @Type: File, <ts>
  @Name: getGDPRConsentByid function
  @Who: Nitin Bhati
  @When: 10-Feb-2022
  @Why: EWM-5145
  @What: For GDPR Consent By Id
 */
  getGDPRConsentByid(code:any) {
    this.errorMessage = false;  
    this.showMessage=false;
    this.showingDiv=true;
    this._Service.getGDPRConsentByid('?Code='+code).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.showMessage=true;
        this.TenantId=repsonsedata.Data.TenantId,
        this.RequesterId=repsonsedata.Data.RequesterId,
        this.RequesterType=repsonsedata.Data.RequesterType,
        this.RequestedOn=repsonsedata.Data.RequestedOn,
        this.Valid=repsonsedata.Data.Valid,
        this.Consentdate=repsonsedata.Data.Consentdate,
        this.ConsentType=repsonsedata.Data.ConsentType,
        this.pageTemplate= this._sanitizer.bypassSecurityTrustHtml(repsonsedata.Data.EmailTemplate)
        }else  if (repsonsedata.HttpStatusCode === 204) {
            window.location.href = 'link-expired';
          //this.errorMessage = true; 
         // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }else  if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
 /* 
  @Type: File, <ts>
  @Name: clickForRenew function
  @Who: Nitin Bhati
  @When: 10-Feb-2022
  @Why: EWM-5145
  @What: Click for renew button
 */
clickForRenew(){
  // this.showingrenew=true;
  // this.showinggive=false;
  // this.showingwithhold=true;
  // this.showinggiveMessage=false;
  let formarr = {};
    formarr['Code'] = this.code;
    formarr['GDPRConsent'] = 1;
    this._Service.updateGDPRConsent(formarr).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.showingrenew=true;
          this.showingDiv=false;
          // this.showinggive=false;
          // this.showingwithhold=true;
          // this.showinggiveMessage=false;  
        }else  if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
}
/* 
  @Type: File, <ts>
  @Name: clickForRenew function
  @Who: Nitin Bhati
  @When: 10-Feb-2022
  @Why: EWM-5145
  @What: Click for renew button
 */
clickForGive(){
   let formarr = {};
  formarr['Code'] = this.code;
  formarr['GDPRConsent'] = 1;
  this._Service.updateGDPRConsent(formarr).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.showingrenew=true;
        this.showingDiv=false;
        // this.showinggive=false;
        // this.showingwithhold=false;
        // this.showinggiveMessage=false;
      }else  if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
/* 
  @Type: File, <ts>
  @Name: clickForWithHold function
  @Who: Nitin Bhati
  @When: 10-Feb-2022
  @Why: EWM-5145
  @What: Click for withHold button
 */
clickForWithHold(){
  let formarr = {};
  formarr['Code'] = this.code;
  formarr['GDPRConsent'] = 2;
  this._Service.updateGDPRConsent(formarr).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
       // this.showinggive=true;
        // this.showingrenew=false;
        // this.showinggive=true;
        // this.showingwithhold=false;
        this.showinggiveMessage=true;
        this.showingDiv=false;
      }else  if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

}
