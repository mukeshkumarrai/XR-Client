/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Naresh Singh
  @When: 22-Dec-2020
  @Why: ROST-431
  @What:  This component is used for the MFA stepper process with confirmtion message
*/

import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResponceData, } from 'src/app/shared/models';
import { appQRdata, CreateUserMfa, SecurityQuestion } from '../../shared/datamodels';
import { MfaAuthService } from '../../shared/services/mfa/mfa-auth.service';
import { MatStepper, MatVerticalStepper } from '@angular/material/stepper';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';
import { MatDrawer } from '@angular/material/sidenav';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { DOCUMENT } from '@angular/common';
import { AppSettingsService } from '@app/shared/services/app-settings.service';

@Component({
  selector: 'app-mfa-settings',
  templateUrl: './mfa-settings.component.html',
  styleUrls: ['./mfa-settings.component.scss'],
  providers: [DummyService]
})
export class MfaSettingsComponent implements OnInit {
  changeText: boolean;
  public screenSize;
  public verticalStepper = false;
  public loading: boolean;
  public stepperStatus = true;
  public QrCodeUrl: string;
  public appQRdata: appQRdata;
  public securityQuestion: SecurityQuestion;
  public createUserMfa: CreateUserMfa;
  public authCode: string;
  public codeError: boolean = false;
  public codeErrorvalue: string;
  public alternateEmailOtpvalidateErrorStatus: boolean = false;
  public alternateEmailOtpvalidateErrorValue: string;
  public alternateEmail: string;
  public SecurityQuestion = [];
  downloadAppStep: FormGroup;
  enterCodeStep: FormGroup;
  addQuestionStep: FormGroup;
  addEmailStep: FormGroup;
  confirmEmailStep: FormGroup;
  isEditable = true;
  userDefoultLang: string;
  langflag: string;
  public emailpattern:string; //= '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  /* Added by Naresh Singh on Dec24-2020 - Variable declaration for the input elements Ends here */
  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild('gAuthcode') gAuthcodeElement: ElementRef;
  @ViewChild('aForm') aForm: ElementRef;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otp: string;
  /* Added by Naresh Singh on Dec24-2020 - Variable declaration for the input elements starts here */

  config = {
    allowNumbersOnly: false,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp) {
    this.otp = otp;

    if (this.otp.length === 6) {
      this.authCode = this.otp;
    }

  }


  showOtpComponent = true;

  securityQuestionOne: any;
  securityQuestionTwo: any;
  securityQuestionThree: any;
  primarymailError: boolean = false;
  modaldata: any;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  constructor(private _formBuilder: FormBuilder, private _mfaAuthService: MfaAuthService, public router: Router,
    public dummyService: DummyService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,private appConfigService: AppSettingsService,
    private commonserviceService: CommonserviceService,
    private _snackBarService: SnackBarService, private translateService: TranslateService, public _encryptionDecryptionService: EncryptionDecryptionService) {
      this.emailpattern=this.appConfigService.emailPattern;
    this.SecurityQuestion = [];
    this.changeText = false;
    this.emailpattern=this.appConfigService.emailPattern;
  }


  ngOnInit() {

    this.commonserviceService.setDrawer(this.drawer);

    this.screenSize = window.innerWidth;
    if (this.screenSize < 799) {
      this.verticalStepper = true;
    }
    else {
      this.verticalStepper = false;
    }




    this.get2FAQRCode();
    /* Added by Naresh Singh on Dec24-2020 - validation for the input elements starts from here */



    /* Added by Naresh Singh on Dec24-2020 - validation for first step starts here - Download App */
    this.downloadAppStep = this._formBuilder.group({
      accountInputCtrl: ['',],
      keyInputCtrl: ['',]
    });
    /* Added by Naresh Singh on Dec24-2020 - validation for first step ends here- Download App */


    /* Added by Naresh Singh on Dec24-2020 - validation for second step starts here - Enter Code */
    this.enterCodeStep = this._formBuilder.group({
      codeset: ['', Validators.required]

    });
    /* Added by Naresh Singh on Dec24-2020 - validation for second step Ends here - Enter Code */


    /* Added by Naresh Singh on Dec24-2020 - validation for third step starts here - Add Questions */
    this.addQuestionStep = this._formBuilder.group({
      questionOne: ['', Validators.required],
      answerOne: ['', [Validators.required, Validators.maxLength(20)]],
      questionTwo: ['', Validators.required],
      answerTwo: ['', [Validators.required, Validators.maxLength(20)]],
      questionThree: ['', Validators.required],
      answerThree: ['', [Validators.required, Validators.maxLength(20)]]
    });
    /* Added by Naresh Singh on Dec24-2020 - validation for third step Ends here - Add Questions */

    /* Added by Naresh Singh on Dec24-2020 - validation for fourth step starts here - Enter Email */
    this.addEmailStep = this._formBuilder.group({
      Email: ['', [Validators.pattern(this.emailpattern), Validators.maxLength(60)]]
    });
    /* Added by Naresh Singh on Dec24-2020 - validation for fourth step Ends here - Enter Email */

    /* Added by Naresh Singh on Dec24-2020 - validation for fifth step starts here - Confirm Email */
    this.confirmEmailStep = this._formBuilder.group({
      Pin: ['', Validators.required]
      /* Added by Naresh Singh on Dec24-2020 - validation for fifth step Ends here - Confirm Email */

    });
    this.document.body.classList.add('login-screen-body');
  }

  /* comment later*/

  public ngOnDestroy(): void {
    this.document.body.classList.remove('login-screen-body');
  }



  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSize = window.innerWidth;
    if (this.screenSize < 799) {
      this.verticalStepper = true;
    }
    else {
      this.verticalStepper = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
      if (window.scrollY > 20) {
        let element = document.getElementById('login-container');
        element.classList.add('header-sticky');
      } else {
        let element = document.getElementById('login-container');
        element.classList.remove('header-sticky'); 
      }
  }



  /*
    @Type: File, <ts>
    @Name: get2FAQRCode function
    @Who: Mukesh Kumar Rai
    @When: 27-Dec-2020
    @Why: ROST-581
    @What: service call for getting QR code
    */
  get2FAQRCode() {

    this.loading = true;

    this._mfaAuthService.getMfaQrCode().subscribe(
      (data: ResponceData) => {
        this.loading = false;
        this.QrCodeUrl = data.Data.QrCodeUrl;
        this.appQRdata = data.Data;
        this.downloadAppStep.patchValue({
          'accountInputCtrl': this.appQRdata.Account,
          'keyInputCtrl': this.appQRdata.ManualEntryKey
        });

      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
        this.loading = false;
      })
  }


  goToauthcode(name) {
    const ele = this.aForm.nativeElement[name];
    if (ele) {
      ele.focus();
    }
    //this.gAuthcodeElement.nativeElement.focus();
    this.stepper.next();
  }
  /*
      @Type: File, <ts>
      @Name: authenticatPin function
      @Who: Mukesh Kumar Rai
      @When: 27-Dec-2020
      @Why: ROST-581
      @What: service call for getting authenticat Pin
      */

  authenticatPin(value) {
    this.loading = true;
    let authcodebase64 = {
      'Pin': this._encryptionDecryptionService.encryptData(this.authCode)
    }
    this._mfaAuthService.authenticatPin(JSON.stringify(authcodebase64)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 400) {
          this.codeErrorvalue = "label_pinIncorrect";
          this.codeError = true;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 200) {
          this.codeError = false;
          this.loading = false;
          this.stepper.next();
          this.getSecrurityquestion();
          this.loading = false;
        }
      }, err => {
        
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }
  /*
         @Type: File, <ts>
       @Name: sendingOptTAalternateEmail Email  function
       @Who: Mukesh Kumar Rai
       @When: 30-Dec-2020
       @Why: ROST-432
       @What: sending opt on alternate Email
       */
  getSecrurityquestion() {
    this.loading = true;
    this._mfaAuthService.getSecrurityquestion().subscribe(
      (responceData: ResponceData) => {
        this.loading = false;
        this.securityQuestion = responceData.Data;
        this.securityQuestionOne = responceData.Data.slice(0, 3);
        this.securityQuestionTwo = responceData.Data.slice(4, 7);
        this.securityQuestionThree = responceData.Data.slice(7, 10);
        this.loading = false;
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
        this.loading = false;
      })
  }
  updateSecrurityquestion(data) {
    this.SecurityQuestion.push({
      'SecurityId': Number(data['questionOne']),
      'Answer': data['answerOne']
    });
    this.SecurityQuestion.push({
      'SecurityId': Number(data['questionTwo']),
      'Answer': data['answerTwo']
    });

    this.SecurityQuestion.push({
      'SecurityId': Number(data['questionThree']),
      'Answer': data['answerThree']

    });
    this.stepper.next();
  }
  /*
        @Type: File, <ts>
        @Name: sendingOptTAalternateEmail Email  function
        @Who: Mukesh Kumar Rai
        @When: 30-Dec-2020
        @Why: ROST-432
        @What: sending opt on alternate Email
        */
  sendingOptTAalternateEmail(value) {
    this.loading = true;
    this.alternateEmail = value['Email'];
    this._mfaAuthService.alternateEmail(JSON.stringify(value)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 400) {
          if (repsonsedata.Data == false) {
            this.primarymailError = true;
            this.loading = false;
          }
        } else if (repsonsedata.HttpStatusCode === 200) {
          this.primarymailError = false;
          //this.createUserMfa['AlternateEmailID'] = "milyyy";
          this.stepper.selected.completed = true;
          this.stepper.next();
          this.loading = false;
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
        this.loading = false;
      })
  }
  /*
       @Type: File, <ts>
       @Name: alternateEmailOtpvalidate Email  function
       @Who: Mukesh Kumar Rai
       @When: 30-Dec-2020
       @Why: ROST-432
       @What: validate alternate Email OTP
       */
  alternateEmailOtpvalidate(value) {
    this.loading = true;
    this._mfaAuthService.alternateEmailOtpvalidate(JSON.stringify(value)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 400) {
          this.alternateEmailOtpvalidateErrorValue = "label_pinIncorrect";
          this.alternateEmailOtpvalidateErrorStatus = true;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 200) {
          this.alternateEmailOtpvalidateErrorStatus = false;
          this.stepperStatus = false;
          this.loading = false;
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
        this.loading = false;
      })
  }
  notNowLink() {
    this.stepperStatus = false;
  }
  finishMfaAuth() {
    let createUserMfa = {
      'AlternateEmailID': this.alternateEmail,
      'QuestionList': this.SecurityQuestion
    }
    this.loading = true;
    this._mfaAuthService.finishMfaAuth(JSON.stringify(createUserMfa)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.router.navigate(['./client/core/profile/profile-setting'])
          localStorage.setItem('MFA', '1');
          this.loading = false;
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
        this.loading = false;
      });
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
