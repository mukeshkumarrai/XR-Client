
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appQRdata, CreateUserMfa, SecurityQuestion } from '../../../shared/datamodels';
import { MfaAuthService } from '../../../shared/services/mfa/mfa-auth.service';
import { MatStepper, MatVerticalStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from '@app/shared/services/app-settings.service';

@Component({
  selector: 'app-securitymfa',
  templateUrl: './securitymfa.component.html',
  styleUrls: ['./securitymfa.component.scss']
})
export class SecuritymfaComponent implements OnInit {

  /* Added by Naresh Singh on Dec24-2020 - Variable declaration for the input elements starts here */
  // changeText: boolean;
  public screenSize;
  public verticalStepper = false;
  public loading: boolean;
  public stepperStatus = true;
  public QrCodeUrl: string;
  public appQRdata: appQRdata;
  public securityQuestion: SecurityQuestion[];
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
  isCoppied: boolean;
  onOtpChange(otp) {
    this.otp = otp;

    if (this.otp.length === 6) {
      this.authCode = this.otp;
    }

  }
  securityQuestionOne: any;
  securityQuestionTwo: any;
  securityQuestionThree: any;
  primarymailError: boolean = false;

  constructor(private _formBuilder: FormBuilder, private _mfaAuthService: MfaAuthService, public router: Router,
    private _snackBarService: SnackBarService, public _sidebarService: SidebarService, public _encryptionDecryptionService: EncryptionDecryptionService, private translateService: TranslateService,
    private commonserviceService: CommonserviceService,private appSettingsService:AppSettingsService) {
      this.emailpattern=this.appSettingsService.emailPattern;
    this.SecurityQuestion = [];
    this.emailpattern=this.appSettingsService.emailPattern;
    // this.changeText = false;
  }

  ngOnInit() {


    this.screenSize = window.innerWidth;
    if (this.screenSize < 1099) {
      this.verticalStepper = true;
    }
    else {
      this.verticalStepper = false;
    }





    let URL = this.router.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next('profile');
    this._sidebarService.activesubMenuObs.next('security-info');
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
      answerOne: ['', [Validators.required, Validators.maxLength(200)]],
      questionTwo: ['', Validators.required],
      answerTwo: ['', [Validators.required, Validators.maxLength(200)]],
      questionThree: ['', Validators.required],
      answerThree: ['', [Validators.required, Validators.maxLength(200)]]
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

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
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
        this.QrCodeUrl = data.Data.QrCodeUrl;
        this.appQRdata = data.Data;
        this.downloadAppStep.patchValue({
          'accountInputCtrl': this.appQRdata.Account,
          'keyInputCtrl': this.appQRdata.ManualEntryKey
        });
        this.loading = false;

      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
        const numberOfQuestions = 3; 
        const questionsPerSlice = Math.ceil(this.securityQuestion?.length / numberOfQuestions);
        const securityQuestions = Array.from({ length: numberOfQuestions }, (_, i) => 
            this.securityQuestion.slice(i * questionsPerSlice, (i + 1) * questionsPerSlice)
        );
        this.securityQuestionOne = securityQuestions[0] || [];
        this.securityQuestionTwo = securityQuestions[1] || [];
        this.securityQuestionThree = securityQuestions[2] || [];
        // this.securityQuestionOne = responceData.Data.slice(0, 3);
        // this.securityQuestionTwo = responceData.Data.slice(4, 7);
        // this.securityQuestionThree = responceData.Data.slice(7, 10);


      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
          //this.createUserMfa['AlternateEmailID'] = "milyyy";
          this.loading = false;
          this.stepper.next();
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
          this.loading = false;
          this.alternateEmailOtpvalidateErrorValue = "label_pinIncorrect";
          this.alternateEmailOtpvalidateErrorStatus = true;
        } else if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.alternateEmailOtpvalidateErrorStatus = false;
          this.stepperStatus = false;
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
          this.loading = false;
          this.router.navigate(['./client/core/profile/security-info'])
          localStorage.setItem('MFA', '1');
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }


  /*
     @Type: File, <ts>
     @Name: reloadApiBasedOnorg function
     @Who: Renu
     @When: 13-Apr-2021
     @Why: EWM-1356
     @What: Reload Api's when user change organization
   */

  reloadApiBasedOnorg() {
    this.get2FAQRCode();
  }

   /*
      @Type: File, <ts>
      @Name: copyJobKey
      @Who: Nitin Bhati
      @When: 24-05-2023
      @Why: EWM-12621
      @What: For copy candidate URL.
     */
      copyJobKey(Application,Id){ 
       this.isCoppied = true;
       setTimeout(() => {
         this.isCoppied = false;
       }, 3000);
       let selBox = document.createElement('textarea');
       selBox.style.position = 'fixed';
       selBox.style.left = '0';
       selBox.style.top = '0';
       selBox.style.opacity = '0';
       selBox.value = this.appQRdata.ManualEntryKey;
       document.body.appendChild(selBox);
       selBox.focus();
       selBox.select();
       document.execCommand('copy');
       document.body.removeChild(selBox);
     }
}
