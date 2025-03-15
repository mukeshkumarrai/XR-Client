import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MfaAuthService } from '../shared/services/mfa/mfa-auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.scss'],
  providers: [DummyService]
})
export class MfaComponent implements OnInit {
  public loading: boolean = false;
  userDefoultLang: string;
  langflag: string;
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  
  constructor(public router: Router, private _mfaAuthService: MfaAuthService, private _snackBarService: SnackBarService,private translateService: TranslateService,
    public dummyService: DummyService,
    public dialog: MatDialog,
    private commonserviceService: CommonserviceService,
    @Inject(DOCUMENT) private document: Document,
    ) { }

  ngOnInit(): void {
    this.commonserviceService.setDrawer(this.drawer);
    this.document.body.classList.add('login-screen-body');
  }

  public ngOnDestroy(): void {
    this.document.body.classList.remove('login-screen-body');
  }

  disableUserMfa() {
    this.loading = true;
    
    this._mfaAuthService.disableUserMfa().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 400) {
          this._snackBarService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), String(repsonsedata.HttpStatusCode));
        } else if (repsonsedata.HttpStatusCode === 200) {
          this.router.navigate(['./client/core/profile/profile-setting'])
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

  }
  stepMfaAuthentication() {
    this.loading = true;
    this.router.navigate(['./mfa-settings'])
  }
  
  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Switching language
  // @What: this function used for change language of application.
  // @Return: None
  // @Params :
  // 1. lang - language code.


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
}
