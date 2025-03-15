import {
  Component,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { DummyService } from '../../shared/data/dummy.data';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ReCaptcha2Component } from 'ngx-captcha';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { LoginService } from '../../shared/services/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionDecryptionService } from '../../shared/services/encryption-decryption.service';
import { MustMatch } from '../../shared/helper/must-match.validator';
import { PreviousRouteServiceService } from 'src/app/shared/services/PreviousRouteService/previous-route-service.service';
import { MatInput } from '@angular/material/input';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { MatDrawer } from '@angular/material/sidenav';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { Item, data } from '../sign-in/features';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-new-forgot-password',
  templateUrl: './new-forgot-password.component.html',
  styleUrls: ['./new-forgot-password.component.scss'],
  providers: [DummyService],
})
export class NewForgotPasswordComponent implements OnInit {
  public items: Item[] = data;
  public width = "100%";
  public height = "500px";
  private interval;
  @ViewChild("sv") private scrollView;

  userDefoultLang: string;
  modaldata: any;
  langflag: string;
  public hideOverlay = false;
  public overlayColor = '';
  public slideHeight = '';
  public maxWidth = '100%';
  public maintainAspectRatio = true;
  public slides = 5;
  public useMouseWheel = false;
  public useKeyboard = true;
  public proportion = 25;
  public hideArrows = true;
  public hideIndicators = false;
  public autoplay = true;
  public timings = '250ms ease-in';
  public parentHeight = '';
  public loop = true;
  public slidesList = new Array<never>(5);

  public loading: boolean;
  public forgotEmailActive;
  public showalertMes: boolean = false;
  public errorForgotPwd: boolean = false;
  public showResetMes: boolean = false;
  forgetAccountForm: FormGroup;
  public forgotEmailID: string = '';
  public regEmailID: string = '';
 // @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  container: any;
  public forgotPasswordArray = {};

  resetPasswordForm: FormGroup;
  public resetPassActive = false;
  public resetPasswordArray = {};
  public showResetExp: boolean = false;
  TenantId: string;
  showDetails: boolean = false;
  Strength = 0;
  CreateStrength: number = 0;
  pattern = new RegExp(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$^&+=])(?!.*[*%-'"])/
  );
  PasswordMin = 8;
  PasswordMax = 30;
  IsPasswordLength = true;
  IsUpperCase = true;
  IsLowercase = true;
  IsSpecialCharector = true;
  IsDigit = true;
  showCreateDetails: boolean = false;
  loginType: any;
  previousUrl: string = null;
  currentUrl: string = null;
  transEffect: boolean = false;
  @ViewChild('forgotEmail') forgotEmail: MatInput;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;

  captchaConfig:any = {
     length:5, 
  };

  public isCapchaConfig:number;
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$"

  constructor(
    private translateService: TranslateService,
    public dummyService: DummyService,
    public dialog: MatDialog,
    private router: Router,
    private authenticationService: LoginService,
    public _encryptionDecryptionService: EncryptionDecryptionService,
    private fb: FormBuilder,
    public _appSetting: AppSettingsService,
    private commonserviceService: CommonserviceService,
    private route: ActivatedRoute, private previousRouteService: PreviousRouteServiceService,
    private domSanitizer: DomSanitizer,@Inject(DOCUMENT) private document: Document

  ) {
    this.emailPattern=this._appSetting.emailPattern;
    this.forgotEmailActive = false;
    this.resetPassActive = false;
    this.container = '';

    this.isCapchaConfig = this._appSetting?.isCapchaConfig;
   // console.log(this.isCapchaConfig,"this.isCapchaConfig")
  }

  

  ngOnInit(): void {
    this.commonserviceService.setDrawer(this.drawer);
    this.previousUrl = this.previousRouteService.getPreviousUrl();
    this.currentUrl = this.previousRouteService.getCurrentUrl();
    if (this.previousUrl == this.currentUrl) {
      this.container = 'right-panel-active';
      this.transEffect = true;
    } else {
      setTimeout(() => {
        this.transectionEffect('Active');
      }, 100);
    }

    this.forgotEmailID = localStorage.getItem('forgotVerifyEmailId');
    this.forgetAccountForm = new FormGroup({
//  who:maneesh,what:ewm-15445 for fixed validation,when:14/12/2023     
      forgetemail: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      recaptcha: new FormControl(''),
    });
    this.resetPasswordForm = this.fb.group(
      {
        resetPwd: new FormControl('', [Validators.required, Validators.pattern(this.pattern)]),
        confirmResetPwd: new FormControl(''),
        resetRecaptcha: new FormControl(''),
      },
      {
        validator: MustMatch('resetPwd', 'confirmResetPwd'),
      }
    );
    this.route.queryParams.subscribe((params) => {
      this.loginType = params.logintype;
      if (params.email != undefined && params.email != '') {

        this.regEmailID = params.email;
      }
      if (this.loginType == 'undefined') {
        this.loginType = 1;
      } else {
        this.loginType = params.logintype;
      }
      const userType = params.u;
      this.TenantId = params.t;
      this.activatePanelSignUp(this.loginType, params.email, userType);
    });
    this.getPasswordPattern();
    this.document.body.classList.add('login-screen-body');
  }

  public ngAfterViewInit(): void {
    // this.forgotEmail.focus();
    this.interval = setInterval(() => {
      this.scrollView.next();
    }, 5000);
  }
  public ngOnDestroy(): void {
    clearInterval(this.interval);
  }


  onSwiper(swiper) {
    // console.log(swiper);
   }
   onSlideChange() {
   //  console.log('slide change');
   }
  /*
  @who:priti
  @when:15-March-2021
  @why:1129
  @what:For get strength of password length
  */
  onStrengthChanged(strength: number) {
    this.Strength = strength;
  }
  toggleInfo() {
    if (this.showDetails) {
      this.showDetails = false;
    } else {
      this.showDetails = true;
    }
  }
  onCreatePassStrengthChanged(strength: number) {
    this.CreateStrength = strength;
  }



   /*
     @Type: captchaResult()
     @Who: Anup
     @When: 01-Feb-2022
     @Why:  -
     @What: This function use for get data from capcha
     @Return: None
     @Params :None
   */
     inputCapchaValue:any="input";
     resultCapchaValue:any="result";
     isErrCaptcha:boolean=true;
     errmsgCapcha:boolean=false;
   captchaResult(value:any){
       this.inputCapchaValue= value.inputValue;
       this.resultCapchaValue= value.resultValue;
       if(value.isValid==true){
         this.isErrCaptcha= false;
         this.errmsgCapcha=false;
       }
     }

 
     handleSuccess(data) {
      if(data!==undefined && data !==null && data !==''){
        this.inputCapchaValue="true";
        this.resultCapchaValue="true";
        this.isErrCaptcha= false;
        this.errmsgCapcha=false;
      }
    }
  
  
  /*
      @Type: onSubmitForgotPwd()
      @Who: Vipul Bansal
      @When: 11-Feb-2021
      @Why:  -
      @What: This function to send email to the user in case of forgot password
      @Return: None
      @Params :None
    */
  onSubmitForgotPwd(value: any) {
    if(this.inputCapchaValue==this.resultCapchaValue){
      this.isErrCaptcha=false;
      this.errmsgCapcha=false;
    this.forgotPasswordArray['EmailId'] = value.forgetemail;
    this.forgotPasswordArray['ApplicationType'] = "Client";
    if (this.forgetAccountForm.invalid) {
      return;
    } else {
      //this.loading = true;
      this.authenticationService
        .forgotPassword(this.forgotPasswordArray)
        .subscribe(
          (repsonsedata) => {
            this.loading = false;

            if (repsonsedata.HttpStatusCode == 200) {
              // let element: HTMLElement = document.getElementById('btnResetCancel') as HTMLElement;
              // element.click();

              // this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_forgotPasswordSuccess'), repsonsedata.StatusCode);
              this.loading = false;
              this.showResetMes = true;
            } else if (repsonsedata.HttpStatusCode == 400) {
              this.showalertMes = false;
              this.errorForgotPwd = true;
              this.loading = false;
            } else {
              // this._snackBarService.showSuccessSnackBar(repsonsedata.Message, repsonsedata.StatusCode);
              this.errorForgotPwd = true;
              this.showalertMes = false;
              this.loading = false;
            }
          },
          (err) => {
            this.showalertMes = false;
            //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
            this.loading = false;
          }
        );
    }
  }
  else{
    this.isErrCaptcha=true;
    this.errmsgCapcha=true;
  }
  }

  /*
   @Type: verifyResetPwdLink()
   @Who: Vipul Bansal
   @When: 26-Feb-2021
   @Why:  -
   @What: This function to verify the reset password link in case of forgot password
   @Return: None
   @Params :None
 */
  verifyResetPwdLink() {
    this.resetPasswordArray['Link'] = this.TenantId;

    this.loading = true;
    this.authenticationService
      .verifyResetPasswordLink(this.resetPasswordArray)
      .subscribe(
        (repsonsedata) => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            // let element: HTMLElement = document.getElementById('btnResetCancel') as HTMLElement;
            // element.click();

            //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_resetPasswordSuccess'), repsonsedata.StatusCode);
            this.loading = false;
            this.showResetExp = false;
          } else {
            //this._snackBarService.showSuccessSnackBar(repsonsedata.Message, repsonsedata.StatusCode);
            this.showResetExp = true;
            this.loading = false;
          }
        },
        (err) => {
          //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
          this.showResetExp = true;
          this.loading = false;
        }
      );
  }

  /*
     @Type: onSubmitResetPwd()
     @Who: Vipul Bansal
     @When: 12-Feb-2021
     @Why:  -
     @What: This function to reset the user password in case of forgot password
     @Return: None
     @Params :None
   */
  onSubmitResetPwd(value: any) {
    this.resetPasswordArray['Link'] = this.TenantId;
    this.resetPasswordArray[
      'NewPassword'
    ] = this._encryptionDecryptionService.encryptData(value.resetPwd);

    if (this.resetPasswordForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.authenticationService
        .resetPassword(this.resetPasswordArray)
        .subscribe(
          (repsonsedata) => {
            this.loading = false;
            if (repsonsedata.HttpStatusCode == 200) {
              // let element: HTMLElement = document.getElementById('btnResetCancel') as HTMLElement;
              // element.click();

              //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_resetPasswordSuccess'), repsonsedata.StatusCode);
              this.loading = false;
              this.showResetMes = true;
            } else {
              this.loading = false;
              this.showResetExp = true;
            }
          },
          (err) => {
            this.showResetExp = true;
            //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
            this.loading = false;
          }
        );
    }
  }


  /*
    @Type: File, <ts>
    @Name: activatePanelSignUp function
    @Who: Renu
    @When: 02-Feb-2021
    @Why: -
    @What: When login contais Parmeterised urlthn to activate the sign up form based on
    logintype
  */

  activatePanelSignUp(loginType, emailId, userType) {
    let status = 'Active';

    if (loginType === '2') {
      this.container = 'right-panel-active';
      this.resetPassActive = true;
      this.verifyResetPwdLink();
    } else {
      this.resetPassActive = false;
    }
  }

  transectionEffect(status, forgetEmail?: boolean) {
    //let status = 'Active';

    if (forgetEmail) {
      this.forgotEmailActive = true;
    }
    if (status === 'Active') {
      this.container = 'right-panel-active';
    } else {
      this.container = '';
      this.forgotEmailActive = false;
    }
  }
  cancelButton(status) {
    this.forgotEmailActive = true;
    if (status === 'Active') {
      this.container = 'right-panel-active';
    } else {
      this.container = '';
      this.forgotEmailActive = false;
    }
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 400);
  }

  /*
  @(C): Entire Software
  @Type: Function
  @Who: Satya Prakash Gupta
  @When: 24-Feb-2021
  @Why:  Switching language
  @What: this function used for change language of application.
  @Return: None
  @Params :
  1. lang - language code.
  */
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

    dialogRef.afterClosed().subscribe((result) => { });
  }
 
  /*
 @who:priti
 @when:16-March-2021
 @why:1165
 @what:For get password pattern details
 */
  getPasswordPattern() {
    this.authenticationService.getPasswordValidationParameter().subscribe(
      response => {
        if (response['HttpStatusCode'] === 200) {
          let data = response['Data'];
          this.IsLowercase = data.LowerCase;
          this.IsDigit = data.Digit;
          this.IsUpperCase = data.UpperCase;
          this.PasswordMin = data.MinLength;
          this.IsSpecialCharector = data.SpecialCharacter;
          // this.pattern = new RegExp(data.Regex.trim());
           ///with Sanitize
           let regExp:any = new RegExp(data.Regex.trim());
           let ScriptSanitze:any =  this.domSanitizer.bypassSecurityTrustScript(regExp);
           this.pattern = ScriptSanitze.changingThisBreaksApplicationSecurity;
           /////

          if (this.PasswordMin > 0) {
            this.IsPasswordLength = true;
          }
          else {
            this.IsPasswordLength = false;
          }
          const password = this.resetPasswordForm.get('resetPwd');
          password.setValidators([Validators.minLength(this.PasswordMin), Validators.maxLength(this.PasswordMax), Validators.pattern(this.pattern)]);
          password.updateValueAndValidity();
        }
      }
    );
  }

  closeError() {
    this.errorForgotPwd = false;
  }

}
