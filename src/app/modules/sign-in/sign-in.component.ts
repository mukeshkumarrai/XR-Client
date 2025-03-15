// @(C): Entire Software @Type: File, <ts> @Who: Satya Prakash Gupta @When: 03-Nov-2020  @Why: EWM-15045 EWM-15046  @What: Login page functions
import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { data, Item } from './features';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '@app/shared/services/login/login.service';
import { InviteusersReq, InviteusersRes, LoginResponce, ResponceData } from '@app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { EncryptionDecryptionService } from '@app/shared/services/encryption-decryption.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { MatInput } from '@angular/material/input';
import { first } from 'rxjs/operators';
import { MustMatch } from '@app/shared/helper/must-match.validator';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DummyService } from '@app/shared/data/dummy.data';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MfaAuthService } from '../EWM.core/shared/services/mfa/mfa-auth.service';
import { ThemingService } from '@app/shared/services/theming.service';
import { CommonServiesService } from '@app/shared/services/common-servies.service';
import { DynamicMenuService } from '@app/shared/services/commonservice/dynamic-menu.service';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FooterDialogComponent } from '@app/shared/modal/footer-dialog/footer-dialog.component';
import { MatDrawer } from '@angular/material/sidenav';
import { DOCUMENT } from '@angular/common';

declare const gapi: any;

const loginRequest = {
  scopes: ["user.read"]
}
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [DummyService],
})
export class SignInComponent implements OnInit {
  public items: Item[] = data;
  public width = "100%";
  public height = "500px";
  private interval;
  @ViewChild("sv") private scrollView;

  @ViewChild('spanval') span: ElementRef;
  @ViewChild('langDiv') langDiv: ElementRef;
  isRtl = false;
  rtlVal: string = 'ltr';
  userDefoultLang: string;
  userDefoultConvert: string;
  private _jsonURL;
  dirctionalLang;
  toggleActive: boolean = false;
  registerAsValue: string = "employee";
  setPassword: boolean = false;
  enterOTP: boolean = false;
  // Entire Software : Mukesh Kumar Rai : 10-Sept-2020 : carousel setting parameters start :ROST-154
  public slidesList = new Array<never>(5);
  public loading: boolean;
  public codeErrorvalue = '';
  public parentHeight = '';
  public timings = '250ms ease-in';
  public autoplay = true;
  public codeError = false;
  public loop = true;
  public hideArrows = true;
  public hideIndicators = false;
  public maxWidth = '100%';
  public maintainAspectRatio = true;
  public proportion = 25;
  public slideHeight = '';
  public slides = 5;
  public overlayColor = '';
  public hideOverlay = false;
  public useKeyboard = true;
  public useMouseWheel = false;
  public loginResponce: LoginResponce;
  public loginData: any = {};
  authCode: string;
  public forgotPasswordArray = {};
  public resetPasswordArray = {};
  public onlyEmail = true;
  public regEmailID: string = '';
  public regUserName: string = '';
  submitted = false;
  hide = true;
  public currentYear: any;
  errmsg: boolean = false;
  public showSignUpfailureMsg: boolean = false;
  public showSignUpsuccessMsg: boolean = false;
  container: any;
  hidec = true;
  // @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  @ViewChild('password') password: ElementRef;
  @ViewChild('username') username: MatInput;
  @ViewChild('firstname') firstname: MatInput;
  //@ViewChild('userpass') userpass: MatInput;

  // Entire Software : Mukesh Kumar Rai : 10-Sept-2020 : carousel setting parameters End
  rosterForm: FormGroup;
  createAccountForm: FormGroup;
  forgetAccountForm: FormGroup;
  resetPasswordForm: FormGroup;
  public forgotpassActive = false;
  public resetPassActive = false;
  errorBox: string;
  errorLabel: boolean = false;
  langflag: string;
  modaldata: any;
  status = 'ONLINE';
  noInternetConnection: boolean = false;
  isConnected = true;
  CarouselContent: any;
  returnUrl: string;
  user: SocialUser;
  loggedIn: boolean;
  isChecked: boolean;
  public specialcharPattern = "^[a-z A-Z]+$";
  // edit email patterb by Adarsh singh for EWM-6004
  public emailPattern: string;
  public aphanumericPattern = "^[A-Za-z0-9 ]+$";
  @ViewChild('newaccount') newaccount;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otp: string = '';
  public outlookUser;
  public urlpath: string;
  public registerUserArr: any;
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
  domainSignUp: any;
  domainSignUpdata: any = '';
  public correlationId: string;
  TenantId: string;
  inviteusersReq: InviteusersReq[];
  inviteusersRes: InviteusersRes[];
  uninviteuserHide: boolean = false;
  public uninviteBtn: boolean = false;
  errmsgexternal: boolean;
  domainURL: string;
  loginType: any;
  public showResetMes: boolean = false;
  public showalertMes: boolean = false;
  public showResetExp: boolean = false;
  isPinValid: boolean = false;
  public userDomain: any;
  public showCaptcha: boolean = true;
  /*
    @who: priti
    @when: 12/march/2021
    @why: EWM-1129
    */
  showDetails: boolean = false;
  pattern = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$^&+=])(?!.*[*%-'"])/);
  PasswordMin = 8;
  PasswordMax = 30;
  IsPasswordLength = true;
  IsUpperCase = true;
  IsLowercase = true;
  IsSpecialCharector = true;
  IsDigit = true;
  Strength = 0;
  showCreateDetails: boolean = false;
  CreateStrength: number = 0;
  public devEnvSettings: any;
  public showsignupinvitedmsg: boolean = false;
  public validateSignUpSuccessMsg: boolean;
  public forgotEmailID: string = '';

  errorCode: string;
  captchaErrCode: boolean = false;
  setnextScreenUser: boolean = true;
  IschkRemaimemberMe: any = false;

  public isCapchaConfig: number;
  loginResponse: any;
  statusClass: string = 'success-snackbar';
  regUserImageURL: string = '';innerWidth: string;
;
  regUserShortName: string = '';;


  /*
  @Modified
   @Who: Priti Srivastava
     @When: 01-03-2021
     @Why:  EWM-1058

  */
  onOtpChange(otp) {
    this.otp = otp;
    if (this.otp.length === 6) {
      this.isPinValid = true;
    }
    else {
      this.isPinValid = false;
    }
    this.authCode = this.otp;

  }
  public signUpEmail: string;
  public Provider = 'Self';


  userInvNextStep: boolean = false;
  userInvClientShow: boolean = false

  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  public existingworkspace:string;


  captchaConfig: any = {
    length: 5,
  };

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  RetryCount:number;
  constructor(
    public dummyService: DummyService,
    public dialog: MatDialog,
    public router: Router,
    private translateService: TranslateService,
    private overlayContainer: OverlayContainer,
    private _mfaAuthService: MfaAuthService,
    private _snackBarService: SnackBarService,
    private elementRef: ElementRef<HTMLElement>,
    private authService: SocialAuthService, private http: HttpClient,
    private authenticationService: LoginService,
    private route: ActivatedRoute,
    private fb: FormBuilder, private msalService: MsalService, private broadcastService: BroadcastService,
    private theming: ThemingService,
    public _encryptionDecryptionService: EncryptionDecryptionService,
    public _appSetting: AppSettingsService,
    private renderer: Renderer2,
    private commonserviceService: CommonserviceService,
    private commonServiesService: CommonServiesService,
    private cookieService: CookieService, private _dynamicMenuService: DynamicMenuService,
    public _sidebarService: SidebarService,
    private domSanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document

  ) {
    this.existingworkspace = this._appSetting?.existingworkspace;  
    this.isCapchaConfig = this._appSetting?.isCapchaConfig;
    this.emailPattern = this._appSetting?.emailPattern;

    this.container = '';
    //this.userDefoultLang = 'eng';
    this.forgotpassActive = false;
    this.resetPassActive = false;
    this.translateService.setDefaultLang('eng');
    this.langflag = 'eng';
    this.currentYear = new Date().getFullYear();
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : Checking Network status show : ROST-189
    this.CarouselContent = `<mat-card-header>
<mat-card-title>Mukesh</mat-card-title>
</mat-card-header>
<img src="https://material.angular.io/assets/img/examples/shiba2.jpg" style='max-height: 150px;'
alt="Photo of a Shiba Inu">
<mat-card-content>
<p>
  The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from
  Japan.
  A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally
  bred for hunting.
</p> </mat-card-content>`;
  }

  // @(C): Entire Software
  // @Type: switchFormButton
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Switching form sign-in to sign-up, sign-in to Forgot password, Sign-up to sign-in, Forgot to sign-in form.
  // @What: This function switch forms between sign-in to sign-up, sign-in to Forgot password, Sign-up to sign-in, Forgot to sign-in form.
  // @Return: None
  // @Params :
  // 1. status - this is value to identify the carousel panel currently active or not.
  // 2. flogformDirective - this is the object which contain all form data.
  // 3. forget - this is optinal parameter with parameter we check is request come from forgot password page or not
  UnInviteUser() {
    this.uninviteuserHide = true;
  }


  switchFormButton(status, flogformDirective: FormGroupDirective, forget?: boolean) {
    flogformDirective.resetForm();
    this.createAccountForm.get('EmployeeType').markAsUntouched();
    this.errorLabel = false;
    this.errmsg = false;
    // Entire Software : Mukesh Kumar Rai : 10-Sept-2020 : Checking request come from forgot password page or not
    if (forget) {
      this.forgotpassActive = true;
    }
    // Entire Software : Mukesh Kumar Rai : 10-Sept-2020 : Checking which side section open right or left and switch them.
    if (status === 'Active') {
      this.container = 'right-panel-active';
      this.firstname?.focus();
      Object.keys(this.createAccountForm.controls).forEach(key => {
        this.createAccountForm.get(key).setErrors(null);
      });

      this.setPassword = false;
      this.uninviteBtn = false;
      this.setnextScreenUser = true;
    } else {
      this.container = '';
      this.forgotpassActive = false;
      this.resetPassActive = false;
    }
    this.showResetMes = false;
    this.showResetExp = false;
    this.showSignUpfailureMsg = false;
    this.showSignUpsuccessMsg = false;
    this.showsignupinvitedmsg = false;
    this.validateSignUpSuccessMsg = false;

  }


  // @(C): Entire Software
  // @Type: ngOnIni
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Initialization of data after dom load
  // @What: Initialization form data with validation
  // @Return: None
  // @Params : none
  redirectUrl: any;
  ngOnInit(): void {
    this.commonserviceService.setDrawer(this.drawer);
    this.forgotEmailID = localStorage.getItem('forgotVerifyEmailId');
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    if (this.cookieService.get('Token') != undefined && this.cookieService.get('Token') != '') {
      this.IschkRemaimemberMe = true;
      this.userLogin();
      return;
    }
    this.URL_validation();
    this.getIPValidation()
    const queryParams = this.route.snapshot.queryParams
    let URL = this.router.url;

    let URL_AS_LIST = URL.split('?');
    this.domainURL = URL_AS_LIST[1];
    this.route.queryParams.subscribe(params => {
      this.userDomain = params['domain'];
      this.redirectUrl = params['redirectUrl'];
      // console.log(this.redirectUrl,"this.redirectUrl")
      /********When:13-July-2023 WHO: Adarsh singh*/
      this.checkMessageType(params)
      // End 
    });
    /********When:30-AUG-2022 WHO: Renu Why:For domain null issue while login with SSO */
    if (this.userDomain === 'null') {
      this.router.navigate(['/login']);
    }
    this.theming.theme.next("light-theme");
    this.getPasswordPattern();
    this.forgetAccountForm = new FormGroup({
      forgetemail: new FormControl('', [Validators.required, Validators.email]),
      // recaptcha: new FormControl('', [Validators.required])
    });
    this.resetPasswordForm = this.fb.group({
      resetPwd: new FormControl(''),
      confirmResetPwd: new FormControl(''),
      // resetRecaptcha: new FormControl('', [Validators.required])
    }, {
      validator: MustMatch('resetPwd', 'confirmResetPwd')
    });

    this.createAccountForm = this.fb.group({
      'FirstName': ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]],
      'LastName': ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]],
      'Email': ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.emailPattern)]],
      'EmployeeType': [],
      'OrganizationName': [],
      'OrganizationAddress': [],
      'recaptcha': [],
      'Password': [],
      'confirmPassword': []
    }, {
      validator: MustMatch('Password', 'confirmPassword')
    });

    this.rosterForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(this.emailPattern)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ])
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.route.queryParams.subscribe(params => {
      this.loginType = params.logintype;
      if (this.loginType == 'undefined') {
        this.loginType = 1;
      } else {
        this.loginType = params.logintype;
      }
      //console.log("params.domain "+ params.domain);
      const userType = params.u;
      this.domainSignUpdata = params.domain;
      this.signUpEmail = params.email;
      this.correlationId = params.col;
      this.TenantId = params.t;
      this.activatePanelSignUp(this.loginType, params.email, userType);
    }
    );

    this.setEmployeeCategoryValidators();

    // this.http.get("assets/config/App-settings.config.json").subscribe(data => {
    //   data = JSON.parse(JSON.stringify(data));
    this.devEnvSettings = this._appSetting.systemConfig;
    this.urlpath = window.location.origin;
    // });
    this.readloginUrl();

    if (this.domainSignUpdata !== undefined && this.domainSignUpdata !== null && this.domainSignUpdata !== '') {
      this.domainSignUp = true
    } else {
      this.domainSignUp = false;
    }
    this.document.body.classList.add('login-screen-body');
    setTimeout(() => {
      if (localStorage.getItem('verifyemailvalue')!=null) {
        this.rosterForm.patchValue({
          username: localStorage.getItem('verifyemailvalue')
        });
      } 
   }, 200);
   
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

  public ngAfterViewInit(): void {
    this.username.focus();
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


  // @(C): Entire Software
  // @Type: onEmailSubmit
  // @Who: Vipul Bansal
  // @When: 18-Feb-2021
  // @Why:  go back to the user name field
  cancelLogin() {
    if (this.domainSignUpdata !== undefined && this.domainSignUpdata !== null && this.domainSignUpdata !== '') {
      this.domainSignUp = true
    } else {
      this.domainSignUp = false;
    }
    this.onlyEmail = true;
    this.errmsg = false;
    //this.rosterForm.reset();
    this.firstname.focus();
    this.router.navigate([this.returnUrl]);
  }

  // @(C): Entire Software
  // @Type: onEmailSubmit
  // @Who: Vipul Bansal
  // @When: 18-Feb-2021
  // @Why:  checking the email id is registerd by user or not
  onEmailSubmit(value, e: any) {
    // @Who: Bantee Kumar,@Why:EWM-10903,@When: 09-Mar-2023,@What: Error message “Password is required“ is displaying below password field when user press enter key for next password page after entering email id -->

    e.preventDefault();
    localStorage.setItem('URLs', this.authenticationService.setUrl())
    if (this.rosterForm.get("username").invalid) {
      return;
    }
    this.loading = true;


    if (this.rosterForm.get("username").hasError('required')) {
      this.rosterForm.get("username").setErrors({ required: true });
      this.rosterForm.get("username").markAsTouched();
      this.loading = false;
      return;
    }
    if (this.rosterForm.get("username").hasError('email')) {
      this.rosterForm.get("username").setErrors({ email: true });
      this.rosterForm.get("username").markAsTouched();
      this.loading = false;
      return;
    }

    const formData = new FormData();
    value['EmailId'] = value.username;
    // if (localStorage.getItem('domain') != null) {
    //   value['Domain'] = localStorage.getItem('domain');

    // } else {
    //   value['Domain'] = "";
    // }
    if (this.userDomain && this.userDomain != undefined) {
      value['Domain'] = this.userDomain;
    } else {
      value['Domain'] = '';
    }
    this.authenticationService.loginCheck(JSON.stringify(value))
      .pipe(first())
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            this.loading = false;
            this.onlyEmail = false;

            setTimeout(() => {
              this.password.nativeElement.focus();
            }, 0);

            this.regEmailID = data.Data.EmailId;
            this.regUserName = data.Data.UserName;
            this.regUserImageURL = data?.Data?.ProfileImageUrl;
            this.regUserShortName = data?.Data?.ShortName;
            this.domainSignUp = false;
            this.errmsgexternal = false;

          } else {
            this.loading = false;
            //code added by priti on 19 march 2021 for EWM-1130
            this.errmsgexternal = true;
            this.errorCode = data.Message;
            this.rosterForm.get("username").setErrors({ NotExist: true });
            this.rosterForm.get("username").markAsTouched();
            if (this.domainSignUpdata !== undefined && this.domainSignUpdata !== null && this.domainSignUpdata !== '') {
              this.domainSignUp = true
            } else {
              this.domainSignUp = false;
            }
          }
        },
        error => {
          //this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), error.StatusCode);
          this.loading = false;
        });


  }

  // @(C): Entire Software
  // @Type: switchFormButton
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Switching form sign-in to sign-up, sign-in to Forgot password, Sign-up to sign-in, Forgot to sign-in form.
  // @What: This function switch forms between sign-in to sign-up, sign-in to Forgot password, Sign-up to sign-in, Forgot to sign-in form.
  // @Return: None
  // @Params :
  // 1. status - this is value to identify the carousel panel currently active or not.
  // 2. flogformDirective - this is the object which contain all form data.
  // 3. forget (optinal)- this is optinal parameter with parameter we check is request come from forgot password page or not

  onSubmit(form, value) {
    //this.errorBox = form;
    this.loading = true;
    if (this.rosterForm.get('username').value == null || this.rosterForm.get('username').value == '') {
      this.rosterForm.controls.username.setValue(this.regEmailID);
    }
    const formData = new FormData();
    value['Username'] = this.rosterForm.get('username').value;
    value['Password'] = this._encryptionDecryptionService.encryptData(this.rosterForm.get('password').value); //encryptData(value.password);

    if (this.userDomain) {
      value['Domain'] = this.userDomain;
    } else {
      value['Domain'] = '';
    }

    value['IsRemember'] = this.IschkRemaimemberMe;
    value['Device'] = "Web";
    value['MFA'] = 0;
    value['MfaType'] = 0;
    value['MfaKey'] = '';
    value['KeyId'] = 0;
    value['KeyA'] = '';

    value['SuppressMfa30'] = 0;
    this.loginData = value;
    delete value['username'];
    delete value['password'];
    this.submitted = true;
    // stop here if form is invalid
    if (this.rosterForm.invalid) {
      this.loading = false;
      return;
    }

    this.authenticationService.login(JSON.stringify(value))
      .pipe(first())
      .subscribe(
        (data: ResponceData) => {
          this.loading = false;
          if (data.HttpStatusCode == 200) {
            localStorage.setItem('isRemember', this.IschkRemaimemberMe);
            this.loginResponce = data.Data;            
            this.loginData['MFA'] = this.loginResponce.MFA;
            this.errmsg = false;
            if (this.IschkRemaimemberMe) {
              this.cookieService.set('Token', data.Data.Token);  //priti
            }
            else {
              this.cookieService.delete('Token');

            }
            if (this.loginResponce.MFA === 0) {
              this.domainRedirection(data.Data.Token, data.Data.Tenants[0].DomainName, data.Data.Tenants);

            } else if (this.loginResponce.MFA === 1) {
              this.enterOTP = true;
            } else if (this.loginResponce.MFA === 2) {
              this.domainRedirection(data.Data.Token, data.Data.Tenants[0].DomainName, data.Data.Tenants);

            } else {
              this.domainRedirection(data.Data.Token, data.Data.Tenants[0].DomainName, data.Data.Tenants);

            }
          }
           else {
            // who:maneesh what:ewm-16932 when:10/05/2024
            this.RetryCount=data?.RetryCount;
            if (this.RetryCount==2 || this.RetryCount==1) {
              this.rosterForm.get("password").setErrors({ CountError: true });
              this.rosterForm.get("password").markAsTouched();
            }else if (this.RetryCount==0 && data?.Message!='400016'){
              this.rosterForm.get("password").setErrors({ FourthError: true });
              this.rosterForm.get("password").markAsTouched();
            }else if (data?.Message=='400016'){
              // this.errorCode = data?.Message;
              this.rosterForm.get("password").setErrors({ NotExistPassword: true });
              this.rosterForm.get("password").markAsTouched();
              }
              else if (this.RetryCount<0 && data?.Message=='400017'){
                this.errorCode = data?.Message;
                this.rosterForm.get("password").setErrors({ LockAccount: true });
                this.rosterForm.get("password").markAsTouched();
                }
            this.loading = false;
            this.errmsg = true;
            // this.rosterForm.get("password").setErrors({ NotExistPassword: true });
            // this.rosterForm.get("username").markAsTouched();
            // //code added by priti on 19 march 2021 for EWM-1130
            // this.errorCode = data.Message;
            //this.router.navigate([this.returnUrl]);


          }

        },
        error => {

          this.errmsg = true;
          //code added by priti on 19 march 2021 for EWM-1130
          this.errorCode = 'label_snackbarerrmsg';
          // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), error.StatusCode);
          this.loading = false;
        });
  }
  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  close error box
  // @What: This function close the error box when username and password is invalid.
  // @Return: None
  // @Params :None

  authCodeChange(event) {
    let codeset = event.target.value
    if (codeset.length == 6) {
      this.authCode = event.target.value;

    }

  }

  /*
     @Type: closeError
     @Who: Renu
     @When: 09-Feb-2021
     @Why:  ROST-816
     @What: for closing the err msg on click event

   */
  closeError(msgId: string) {
    if (msgId == 'errmsg') {
      this.errmsg = false;
    } else {
      this.errmsgexternal = false;
    }
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
      maxWidth: "750px",
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
  @Name: signInWithGoogle function
  @Who: Renu
  @When: 21-Jan-2020
  @Why: ROST-663
  @What: When user login with Google Account
  */

  signInWithGoogle(): void {
    this.Provider = 'Google';
    let URL = this.router.url;
    // alert(URL);
    let URL_AS_LIST = URL.split('?');
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (this.user.authToken != '') {
        //this.router.navigate(['../admin/commonfunction']);
        //localStorage.setItem('SeesionUser', this.user.name);
        if (URL_AS_LIST[1]) {
          if (this.user.email === this.signUpEmail) {
            this.createAccountForm.patchValue({
              'FirstName': this.user.firstName,
              'LastName': this.user.lastName,
              'Email': this.user.email
            });
            this.uninviteBtn = true;
          } else {
            this._snackBarService.showErrorSnackBar("This Email is not authorised", '')
          }
        }
        else {
          this.createAccountForm.patchValue({
            'FirstName': this.user.firstName,
            'LastName': this.user.lastName,
            'Email': this.user.email
          });
        }

      }

    });

  }

  /*
 @Type: File, <ts>
 @Name: signInWithLinkdin function
 @Who:  Suika
 @When: 24-Mar-2021
 @Why:  ROST-893
 @What: When user login with Linkdin Account
 */

  signInWithLinkdin(): void {
    let responseType = this._appSetting.getResponseType();
    let state = this._appSetting.getState();
    let scope = this._appSetting.getScope();
    let clientId = this._appSetting.getClientId();
    let redirectUri = this._appSetting.getRedirectUri();
    window.open('https://www.linkedin.com/oauth/v2/authorization?response_type=' + responseType + '&state=' + state + '&scope=' + scope + '&client_id=' + clientId + '&redirect_uri=' + redirectUri + '', "_self");

  }

  readloginUrl() {
    //this.loading = true;
    let code = this.route.snapshot.queryParams.code;
    if (code != undefined) {
      let value = {};
      if (this.userDomain) {
        value['DomainName'] = this.userDomain;
      } else {
        value['DomainName'] = '';
      }
      value['Provider'] = 'linkedin';
      value['IdToken'] = code;
      value['IsRemember'] = true;
      value['Device'] = "Web";
      value['Mfa'] = 0;
      value['MfaType'] = 0;
      value['MfaKey'] = '';
      value['KeyId'] = 0;
      value['KeyA'] = '';
      value['SuppressMfa30'] = 0;
      this.authenticationService.loginExternalUser(value).subscribe(
        repsonsedata => {
          if (repsonsedata.HttpStatusCode == 200) {
            this.loginResponce = repsonsedata.Data;
            value['MFA'] = this.loginResponce.MFA;
            this.errmsgexternal = false;
            if (this.loginResponce.MFA === 0) {
              this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
            } else if (this.loginResponce.MFA === 1) {
              this.enterOTP = true;
            } else if (this.loginResponce.MFA === 2) {
              this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
            } else {
              this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
            }
          } else {
            this.loading = false;
            //code added by priti on 19 march 2021 for EWM-1130
            this.errmsgexternal = true;
            this.errorCode = 'label_snackbarerrmsg';
            //
            //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackbarerrmsg'), repsonsedata.StatusCode);
            this._snackBarService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.StatusCode);
            this.router.navigate([this.returnUrl]);
          }
          this.loading = false;
        }, err => {
          this.loading = false;
          //code added by priti on 19 march 2021 for EWM-1130
          this.errmsgexternal = true;
          this.errorCode = 'label_snackbarerrmsg';
          // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
        })
    }
  }
  /*
  @Type: Function
  @Who: Satya Prakash
  @When: 26-Oct-2020
  @Why:  ROST-230 ROST-269
  @What: This function open create password box.
  @Return: None
  @Params :None
  */

  signupNext() {
    this.setPassword = true;
  }

  /*
    @Type: Function
    @Who: Satya Prakash
    @When: 31-Dec-2020
    @Why:  ROST-230 ROST-269
    @What: This function open OTP box.
    @Return: None
    @Params :None
  */
  enterOTPBox() {

  }

  /*
      @Type: File, <ts>
      @Name: authenticatPin function
      @Who: Mukesh Kumar Rai
      @When: 27-Dec-2020
      @Why: ROST-581
      @What: service call for getting authenticat Pin
      */
  authenticatPin() {
    this.loginData['MfaKey'] = this._encryptionDecryptionService.encryptData(this.authCode);
    this.loginData['MfaType'] = 1;
    this.loginData['Mfa'] = 1;
    this.loginData['Username'] = this.loginResponse ? (this.loginResponse?.account?.userName) : this.rosterForm.get('username').value; /******@When: 12-05-2023 @Why: EWM-12344 EWM-12424 @WHo: Renu */
    if (this.isChecked == true) {
      this.loginData['SuppressMfa30'] = 1;
    } else {
      this.loginData['SuppressMfa30'] = 0;
    }
    this.loading = true;

    this.authenticationService.login(JSON.stringify(this.loginData)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 400) {
          this.codeErrorvalue = "label_pinIncorrect";
          this.codeError = true;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 200) {
          this.codeError = false;
          this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants)
          // this.setLocalStoreageData(repsonsedata);
          //this.router.navigate(['./client/core/profile/profile-setting']);
        }
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
    @Type: Function
    @Who: Renu
    @When: 03-Nov-2020
    @Why:  -
    @What: This function open external link.
    @Return: None
    @Params :None
  */

  redirectToWebsite() {
    window.location.href = 'https://www.entiresoftware.com';
  }

  /*
    @Type: setEmployeeCategoryValidators()
    @Who: Renu
    @When: 31-Dec-2020
    @Why:  -
    @What: This function to create new Account user
    @Return: None
    @Params :None
  */

  setEmployeeCategoryValidators() {


    this.createAccountForm.get('EmployeeType').valueChanges
      .subscribe(EmployeeType => {

        if (EmployeeType === 'employee') {
          this.createAccountForm.get('OrganizationName').setValidators(null);
          this.createAccountForm.get('OrganizationAddress').setValidators(null);
        }

        else if (EmployeeType === 'client') {
          this.createAccountForm.get('OrganizationName').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
          this.createAccountForm.get('OrganizationAddress').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);

        } else {
          this.createAccountForm.get('OrganizationName').setValidators(null);
          this.createAccountForm.get('OrganizationAddress').setValidators(null);
        }

        this.createAccountForm.get('OrganizationName').updateValueAndValidity();
        this.createAccountForm.get('OrganizationAddress').updateValueAndValidity();
      });

  }


  /*
    @Type: onNextUserInv()
    @Who: Renu
    @When: 19-Apr-2021
    @Why:  ROST-1249
    @What: for moving to next screen
    @Return: None
    @Params :None
  */
  onNextUserInv() {
    if (this.createAccountForm.invalid) {
      this.createAccountForm.get('FirstName').touched;
      this.createAccountForm.get('LastName').touched;
      this.createAccountForm.get('Email').touched;
      return;
    } else {
      this.setnextScreenUser = false;
      this.signupNext();
    }
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

  inputCapchaValue: any = "input";
  resultCapchaValue: any = "result";
  captchaResult(value: any) {
    if (this.inputCapchaValue != 'input') {
      this.captchaErrCode = false;
    }
    this.inputCapchaValue = value.inputValue;
    this.resultCapchaValue = value.resultValue;
    if (value && value.isValid == true) {
      this.errmsg = false;
    }
  }



  handleSuccess(data) {
    if (data !== undefined && data !== null && data !== '') {
      this.inputCapchaValue = "true";
      this.resultCapchaValue = "true";
      this.errmsg = false;
    }
  }

  /*
     @Type: onSubmitValidateUser()
     @Who: Renu
     @When: 31-Dec-2020
     @Why:  -
     @What: This function to create new Account user
     @Return: None
     @Params :None
   */
  onSubmitValidateUser(value) {
    if (this.inputCapchaValue == "input") {
      this.captchaErrCode = true;
      this.createAccountForm.get('EmployeeType').markAsTouched();
      this.formControlValueChanged();
    } else if (this.inputCapchaValue != "input" && this.inputCapchaValue == this.resultCapchaValue) {
      this.errmsg = false;
      this.captchaErrCode = false;
      this.submitted = true;
      // stop here if form is invalid  
      if (this.uninviteuserHide === false) {
        const EmployeeType = this.createAccountForm.get('EmployeeType');
        EmployeeType.setValidators([Validators.required]);
        EmployeeType.updateValueAndValidity();
        this.validateinviteUser(value);
      } else {
        this.formControlValueChanged();
        //this.createUninviteUser(value);
        this.signup(value);
      }
    } else {
      this.errmsg = true;
      this.captchaErrCode = false;
    }


  }


  /*
    @Type: onSubmitinviteUser()
    @Who: Renu
    @When: 04-Feb-2021
    @Why:  ROST-816
    @What: This function to create Uninvite Account user

  */

  onSubmitinviteUser(value) {
    if (value.EmployeeType == 'employee') {
      value['UserType'] = "E";
    } else if (value.EmployeeType == 'client') {
      value['UserType'] = "C";
    } else {
      value['UserType'] = "D";
    }
    value['Provider'] = this.Provider;
    value['TenantId'] = this.TenantId;
    value['CorrelationId'] = this.correlationId;
    value['Email'] = this.signUpEmail;
    if (value.Password) {
      value['Password'] = this._encryptionDecryptionService.encryptData(value.Password);
    }
    delete value['confirmPassword'];
    this.submitted = true;
    // stop here if form is invalid
    if (this.createAccountForm.invalid) {
      this.createAccountForm.get('Password').markAsTouched();
      this.createAccountForm.get('confirmPassword').markAsTouched();
      this.errmsg = true;
      return;
    } else {
      this.errmsg = false;
      this.createinviteUser(value);
    }


  }
  /*
  @Type: File, <ts>
  @Name: validateinviteUser function
  @Who: Renu
  @When: 21-Jan-2020
  @Why: ROST-663
  @What: For validate invite User
  */

  validateinviteUser(value) {

    // if (localStorage.getItem('domain') != null) {
    //   value['DomainName'] = localStorage.getItem('domain');
    // } else {
    //   value['DomainName'] = "entire";
    // }
    if (this.userDomain) {
      value['DomainName'] = this.userDomain;
    } else {
      value['DomainName'] = '';
    }
    if (value.EmployeeType == 'employee') {
      value['UserType'] = "1";
    } else if (value.EmployeeType == 'client') {
      value['UserType'] = "2";
    } else {
      value['UserType'] = "3";
    }
    value['Provider'] = this.Provider;
    value['TenantId'] = this.TenantId;
    value['CorrelationId'] = this.correlationId;
    if (this.signUpEmail) {
      value['Email'] = this.signUpEmail;
    } else {
      value['Email'] = value.Email;
    }


    this.authenticationService.validateInviteUser(value).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] === 200) {
          //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackSignupmsg'), repsonsedata.Httpstatuscode);
          // this.signupNext();
          this.userInvNextStep = true;
          this.setPassword = false;
          this.uninviteBtn = true;
          const password = this.createAccountForm.get('Password');
          const confirmPassword = this.createAccountForm.get('confirmPassword');
          // const recaptcha = this.createAccountForm.get('recaptcha');
          password.setValidators([Validators.required, Validators.pattern(this.pattern), Validators.minLength(this.PasswordMin), Validators.maxLength(this.PasswordMax)]);
          confirmPassword.setValidators([Validators.required]);
          //  recaptcha.setValidators([Validators.required]);
          password.updateValueAndValidity();
          confirmPassword.updateValueAndValidity();
          // recaptcha.updateValueAndValidity();
        } else {
          this.userInvNextStep = false;
          this.showsignupinvitedmsg = true;
          this.setPassword = false;
          this.errmsg = false;
          // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackSignupinvitedmsg'), repsonsedata['HttpStatusCode']);
        }
      }, err => {
        this.errmsg = false;
        this.userInvNextStep = false;
        this.setPassword = false;
        this.loading = false;
        this.showSignUpfailureMsg = true;

        //this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
      })
  }

  /*
  @Type: File, <ts>
  @Name: setLocalStoreageData function
  @Who: Renu
  @When: 21-Jan-2020
  @Why: ROST-663
  @What: For Storing Neccessary Information in localstorage
  */

  setLocalStoreageData(data) {
    if (data.Data['Colors'] != undefined && data.Data['Colors'] != null) {
      localStorage.setItem('HeaderBackground', data.Data['Colors']['HeaderBackground']);
      localStorage.setItem('HeaderColor', data.Data['Colors']['HeaderColor']);
      localStorage.setItem('HighlightBackground', data.Data['Colors']['HighlightBackground']);
      localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
      localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
    }
    if (data.Data['Urls'] != undefined && data.Data['Urls'] != null) {
      localStorage.setItem('FaviconUrl', data.Data['Urls']['FaviconUrl']);
      localStorage.setItem('LogoUrl', data.Data['Urls']['LogoUrl']);
    }
    localStorage.setItem('MFA', data.Data['MFA']);
    //localStorage.setItem('Language', data.Data['Language']);
    if (data.Data['Language'] === null) {
      localStorage.setItem('Language', 'eng');
    } else {
      localStorage.setItem('Language', data.Data['Language']);
    }
  }

  eventCheckOnClick(event) {
    this.isChecked = event.checked;
  }

  /*
  @Type: File, <ts>
  @Name: getUserDetails function
  @Who: Renu
  @When: 21-Jan-2020
  @Why: ROST-663
  @What:  To get the details of User login with Microsoft
  */

  getUserDetails() {
    let URL = this.router.url;
    let URL_AS_LIST = URL.split('?');
    this.outlookUser = this.msalService.getAccount();
    let userName = this.outlookUser.name;
    let useData = userName.split("  ", 2)
    let firstName = useData[0];
    let lastName = useData[1];
    if (URL_AS_LIST[1]) {
      if (this.outlookUser.userName === this.signUpEmail) {
        this.createAccountForm.patchValue({
          'FirstName': firstName,
          'LastName': lastName,
          'Email': this.outlookUser.userName
        });
        this.uninviteBtn = true;
        this.Provider = 'Microsoft';
      } else {
        this._snackBarService.showErrorSnackBar("This Email is not authorised", '')
      }
    } else {
      this.createAccountForm.patchValue({
        'FirstName': firstName,
        'LastName': lastName,
        'Email': this.outlookUser.userName
      });
      this.Provider = 'Microsoft';
    }

  }

  /*
  @Type: File, <ts>
  @Name: signInWithOutlook function
  @Who: https://gitlab.com/entiresoftware/ewm/web/client/-/merge_requests/598
  @When: 21-Jan-2020
  @Why: ROST-663
  @What: When User Login OutLook Account
  */

  signInWithOutlook() {

    var _this = this;
    this.msalService.loginPopup(loginRequest)
      .then(function (loginResponse) {
        _this.getUserDetails();
      }).catch(function (error) {
      });
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
    const Email = this.createAccountForm.get('Email');
    const EmployeeType = this.createAccountForm.get('EmployeeType');
    if (loginType === '0') {
      if (status === 'Active') {

        this.container = 'right-panel-active';
        if (userType == 'E') {
          this.createAccountForm.patchValue({
            'EmployeeType': 'employee'
          })
        } else if (userType == 'C') {
          this.createAccountForm.patchValue({
            'EmployeeType': 'client'
          })
          this.registerAsValue = 'client';
        } else {
          this.createAccountForm.patchValue({
            'EmployeeType': 'candidate'
          })
        }
        this.createAccountForm.patchValue({
          'Email': emailId
        });
        this.createAccountForm.controls.EmployeeType.disable();
        EmployeeType.updateValueAndValidity();
        this.createAccountForm.controls.Email.disable();
        Email.updateValueAndValidity();
      } else {
        this.container = '';
        this.forgotpassActive = false;
        this.resetPassActive = false;
      }
    }
    // else if (loginType === '2') {
    //   this.container = 'right-panel-active';
    //   this.forgotpassActive = false;
    //   this.resetPassActive = true;
    //   this.verifyResetPwdLink();
    // }
    else {
      this.forgotpassActive = false;
      this.resetPassActive = false;
    }
  }

  /*
    @Type: onSubmitCreateAcc()
    @Who: Renu
    @When: 31-Dec-2020
    @Why:  -
    @What: This function to create new Account user
    @Return: None
    @Params :None
  */

  onSubmitCreateAcc(value) {
    if (value.EmployeeType == 'employee') {
      value['UserType'] = "E";
    } else if (value.EmployeeType == 'client') {
      value['UserType'] = "C";
    } else {
      value['UserType'] = "D";
    }
    const formData = {
      'FirstName': value.FirstName,
      'LastName': value.LastName,
      'Email': value.Email,
      'UserType': value.UserType,
      'OrganizationName': value.OrganizationName,
      'OrganizationAddress': value.OrganizationAddress,
      'Password': value.Password,
      'Provider': this.Provider,
      'TenantId': this.correlationId,
      'CorrelationId': this.correlationId
    };
    value['Provider'] = this.Provider;
    value['TenantId'] = this.TenantId;
    value['CorrelationId'] = this.correlationId;
    value['Email'] = this.signUpEmail;

    // value['Password'] = this._encryptionDecryptionService.encryptData(value.Password);
    // delete value['confirmPassword'];
    this.submitted = true;
    // stop here if form is invalid
    if (this.createAccountForm.invalid) {
      this.errmsg = true;
      return;
    } else {
      this.errmsg = false;
      this.createinviteUser(formData);
    }
  }

  /*
  @Type: File, <ts>
  @Name: createinviteUser function
  @Who: Renu
  @When: 04-feb-2021
  @Why: ROST-816
  @What: For invite User
  */

  createinviteUser(value) {
    this.loading = true;
    this.authenticationService.createInviteUser(value).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == 200) {
          this.showSignUpsuccessMsg = true;
          this.errorCode = repsonsedata['Message'];
          //this._snackBarService.showSuccessSnackBar("Your Registration completed successfully.", repsonsedata.Httpstatuscode);
          this.createAccountForm.reset();
          this.userInvNextStep = false;
          // let status = 'Dective';
          //code uncommented by priti at 25-march-2021 for EWM-1241
          if (status === 'Active') {
            this.container = 'right-panel-active';
          } else {
            // console.log('loggg ');
            this.container = '';
            this.forgotpassActive = false;
          }
          this.uninviteBtn = false;

        } else {
          this.uninviteBtn = false;
          this.userInvNextStep = false;
          this.showSignUpfailureMsg = true;
          this.setPassword = false;
          this.errorCode = repsonsedata['Message'];
          //this._snackBarService.showErrorSnackBar("Invited user is not created.", repsonsedata['HttpStatusCode']);
        }
      }, err => {
        this.uninviteBtn = false;
        this.userInvNextStep = false;
        this.setPassword = false;
        this.loading = false;
        this.showSignUpfailureMsg = true;
        this.errorCode = 'label_snackbarerrmsg';
        // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
      })
  }

  /*
  @Type: File, <ts>
  @Name: formControlValueChanged function
  @Who: Renu
  @When: 04-Feb-2021
  @Why: ROST-663
  @What:  conditonal handling of validators in reactive form
  */

  formControlValueChanged() {
    const EmployeeType = this.createAccountForm.get('EmployeeType');
    EmployeeType.setValidators([Validators.required]);
    EmployeeType.updateValueAndValidity();
    // const recaptcha = this.createAccountForm.get('recaptcha');
    //recaptcha.setValidators([Validators.required]);
    // recaptcha.updateValueAndValidity();

    // const password = this.createAccountForm.get('Password');
    // const confirmPassword = this.createAccountForm.get('confirmPassword');
    // password.setValidators([Validators.required, Validators.pattern(this.pattern), Validators.minLength(this.PasswordMin), Validators.maxLength(this.PasswordMax)]);
    // confirmPassword.setValidators([Validators.required]);
    // password.updateValueAndValidity();
    // confirmPassword.updateValueAndValidity();

  }


  /*
  @Type: File, <ts>
  @Name: createinviteUser function
  @Who: Renu
  @When: 04-feb-2021
  @Why: ROST-816
  @What: For Uninvite User
  */

  createUninviteUser(value) {
    this.loading = true;
    if (this.createAccountForm.invalid) {
      this.loading = false;
      this.createAccountForm.get('EmployeeType').markAsTouched();
      this.errmsg = true;
      return;
    } else {
      this.errmsg = false;
    }


    // if (localStorage.getItem('domain') != null) {
    //   value['DomainName'] = localStorage.getItem('domain');
    // } else {
    //   value['DomainName'] = "entire";
    // }
    if (this.userDomain) {
      value['DomainName'] = this.userDomain;
    } else {
      value['DomainName'] = '';
    }
    if (value.EmployeeType == 'employee') {
      value['EmployeeType'] = 1;
    } else if (value.EmployeeType == 'client') {
      value['EmployeeType'] = 2;
    } else {
      value['EmployeeType'] = 3;
    }
    delete value['Password'];
    delete value['confirmPassword'];
    // delete value['recaptcha'];

    this.authenticationService.createUninviteUser(value).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == 200) {
          this.showSignUpsuccessMsg = true;
          this.errorCode = repsonsedata['Message'];
          // this._snackBarService.showSuccessSnackBar("Your Registration completed successfully.", repsonsedata.Httpstatuscode);
          // let status = 'Dective';
          // if (status === 'Active') {
          //   this.container = 'right-panel-active';

          // } else {
          //   this.container = '';
          //   this.forgotpassActive = false;
          //   this.resetPassActive = false;
          // }
          this.createAccountForm.reset();
          this.uninviteuserHide = false;
          this.setPassword = false;
        } else {
          this.showSignUpfailureMsg = true;
          this.errorCode = repsonsedata['Message'];
          this.setPassword = false;
          //this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), repsonsedata['HttpStatusCode']);
        }
      }, err => {
        this.showSignUpfailureMsg = true;
        this.loading = false;
        this.errorCode = 'label_snackbarerrmsg';
        this.setPassword = false;
        // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
      })
  }

  /*
  @Type: File, <ts>
  @Name: loginWithGoogleProvider function
  @Who: Renu
  @When: 07-feb-2021
  @Why: ROST-816
  @What: For logged In with google User
  */

  loginWithGoogleProvider(value) {
    //alert(value);
    this.loading = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(success => {
      this.authService.authState.subscribe((user) => {
        this.user = user;
        if (user) {
          value['IdToken'] = user.idToken;
          value['Provider'] = 'Google';
          value['Audience'] = '';
          value['EmailId'] = user.email;
          // if (localStorage.getItem('domain') != null) {
          //   value['DomainName'] = localStorage.getItem('domain');
          // } else {
          //   value['DomainName'] = "entire";
          // }
          if (this.userDomain) {
            value['DomainName'] = this.userDomain;
          } else {
            value['DomainName'] = '';
          }
          value['IsRemember'] = true;
          value['Device'] = "Web";
          value['Mfa'] = 0;
          value['MfaType'] = 0;
          value['MfaKey'] = '';
          value['KeyId'] = 0;
          value['KeyA'] = '';
          value['SuppressMfa30'] = 0;
          delete value['password'];
          delete value['username'];
          this.authenticationService.loginExternalUser(value).subscribe(
            repsonsedata => {
              if (repsonsedata.HttpStatusCode == 200) {
                this.loginResponce = repsonsedata.Data;
                value['MFA'] = this.loginResponce.MFA;
                this.errmsgexternal = false;
                if (this.loginResponce.MFA === 0) {
                  this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
                } else if (this.loginResponce.MFA === 1) {
                  this.enterOTP = true;
                } else if (this.loginResponce.MFA === 2) {
                  this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
                } else {
                  this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
                }
              } else {
                this.loading = false;
                //code added by priti on 19 march 2021 for EWM-1130
                this.errmsgexternal = true;
                this.errorCode = 'label_snackbarerrmsg';
                //  this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackbarerrmsg'), repsonsedata.StatusCode);
                this.router.navigate([this.returnUrl]);
              }

            }, err => {
              this.loading = false;
              //code added by priti on 19 march 2021 for EWM-1130
              this.errmsgexternal = true;
              this.errorCode = 'label_snackbarerrmsg';
              // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
            })
        }

      })
    }, error => {
      // console.log("error ",error);
      // console.log("error.error ",error.error);
      if (error.error == 'popup_closed_by_user') {
        this.loading = false;
      }
    });

  }

  /*
  @Type: File, <ts>
  @Name: domainRedirection function
  @Who: Renu
  @When: 25-feb-2021
  @Why: ROST-865
  @What:commmon function for redirecitng to landing page
  */
  domainRedirection(Token, DomainName, TenantData) {

    let TenantUrl;
    if (TenantData.length > 1) {

      this.commonserviceService.setTenantInfo(TenantData, Token);
      this.router.navigate(['tenant-user'], { queryParams: { redirectUrl: this.redirectUrl } });

    } else {

      if (this.devEnvSettings === 'local') {
        if (this.redirectUrl != undefined && this.redirectUrl != null && this.redirectUrl != '') {
          window.location.href = 'http://localhost:4200/landingpage?Token=' + encodeURIComponent(Token) + '&DomainName=' + DomainName + '&redirectUrl=' + this.redirectUrl;

        } else {
          window.location.href = 'http://localhost:4200/landingpage?Token=' + encodeURIComponent(Token) + '&DomainName=' + DomainName;

        }
      } else {
        TenantUrl = TenantData[0].TenantUrl;
        if (this.redirectUrl != undefined && this.redirectUrl != null && this.redirectUrl != '') {
          window.location.href = TenantUrl + '/landingpage?Token=' + encodeURIComponent(Token) + '&DomainName=' + DomainName + '&redirectUrl=' + this.redirectUrl;

        } else {
          window.location.href = TenantUrl + '/landingpage?Token=' + encodeURIComponent(Token) + '&DomainName=' + DomainName;

        }

      }
    }
  }
  /*
    @Type: File, <ts>
    @Name: loginWithOutlookProvider function
    @Who: Renu
    @When: 25-feb-2021
    @Why: ROST-865
    @What: For logged In with Oulook User
    */
  loginWithOutlookProvider(value: any) {
    this.loading = true;
    var _this = this;
    this.msalService.loginPopup(loginRequest)
      .then(function (loginResponse) {
        _this.loginwithOutlookUserDetails(loginResponse, value);

      }).catch(function (error) {
        if (error.errorCode == 'user_cancelled') {
          _this.loading = false;
        }
      });

  }


  /*
    @Type: File, <ts>
    @Name: loginwithOutlook function
    @Who: Renu
    @When: 25-feb-2021
    @Why: ROST-865
    @What: For logged In with Oulook User
    */

  loginwithOutlookUserDetails(loginResponse: any, value: any) {
    this.loginResponse = loginResponse;
    value['IdToken'] = loginResponse.idToken.rawIdToken;
    value['Provider'] = 'Microsoft';
    value['EmailId'] = loginResponse.account.userName;
    // if (localStorage.getItem('domain') != null) {
    //   value['DomainName'] = localStorage.getItem('domain');
    // } else {
    //   value['DomainName'] = "entire";
    // }
    if (this.userDomain) {
      value['DomainName'] = this.userDomain;
    } else {
      value['DomainName'] = '';
    }
    value['IsRemember'] = true;
    value['Device'] = "Web";
    value['Mfa'] = 0;
    value['MfaType'] = 0;
    value['MfaKey'] = '';
    value['KeyId'] = 0;
    value['KeyA'] = '';
    value['SuppressMfa30'] = 0;
    delete value['password'];
    delete value['username'];
    this.authenticationService.loginExternalUser(value).subscribe(
      repsonsedata => {
        if (repsonsedata.HttpStatusCode == 200) {
          this.loginResponce = repsonsedata.Data;
          value['MFA'] = this.loginResponce.MFA;
          this.errmsgexternal = false;
          if (this.loginResponce.MFA === 0) {
            this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
          } else if (this.loginResponce.MFA === 1) {
            this.enterOTP = true;
          } else if (this.loginResponce.MFA === 2) {
            this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
          } else {
            this.domainRedirection(repsonsedata.Data.Token, repsonsedata.Data.Tenants[0].DomainName, repsonsedata.Data.Tenants);
          }
        } else {
          //code added by priti on 19 march 2021 for EWM-1130
          // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), repsonsedata.StatusCode);
          //code modified by bantee on 19 april 2023 for displaying the error message after the accounts gets locked
          this.errorCode = repsonsedata.Message;
          this.loading = false;
          this.errmsgexternal = true;
          //this.router.navigate([this.returnUrl]);
        }

      }, err => {
        this.loading = false;
        // this._snackBarService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
      })
  }

  /*
  @who:Mukesh kumar rai
  @when:15-March-2021
  @why:-
  @what:For checking the domain
  */

  URL_validation() {
    const urlpath = window.location.hostname;
    /*****@When: 18-05-2023 @Who: Renu @Why:EWM-12461 EWM-12478 *****/
    let atr = urlpath.split('-').join(',').split('.').join(',');
    // console.log("domainname",  atr.split(',')[0]) ;
    let domainName = atr.split(',')[0];
    // let domainName = urlpath.slice(0, urlpath.indexOf('-'));
    //  this.http.get("assets/config/App-settings.config.json").subscribe(data => {
    //  data = JSON.parse(JSON.stringify(data));
    this.urlpath = window.location.origin;
    let domain;
    let redirectUrl;
    this.route.queryParams.subscribe(params => {

      if (params.domain) {
        domain = params.domain;
      } else if (params.domain == 'site') {
        domain = '';
      } else {
        domain = '';
      }
      if (params.redirectUrl) {
        redirectUrl = params.redirectUrl;
      } else {
        redirectUrl = '';
      }
    });

    //  console.log(this.router.url,domain, window.location.href,"urlpath")
    if (this.urlpath !== this._appSetting.baseUrl) {
      if (redirectUrl == undefined || redirectUrl == null || redirectUrl == '') {
        window.location.href = this._appSetting.baseUrl + '/login?' + 'domain=' + domainName;
      } else {
        window.location.href = this._appSetting.baseUrl + '/login?' + 'domain=' + domainName + '&redirectUrl=' + redirectUrl;
      }
      const qerypayam = this.route.snapshot.queryParams;
    } else if (this.loginType) {
      this.router.navigate(['/login'], { queryParams: this.route.snapshot.queryParams });

    } else if (domain != '') {
      if (redirectUrl == undefined || redirectUrl == null || redirectUrl == '') {
        this.router.navigate(['/login'], { queryParams: { domain: domain } });
      } else {
        this.router.navigate(['/login'], { queryParams: { domain: domain, redirectUrl: redirectUrl } });
      }


    } else {
      if (redirectUrl == undefined || redirectUrl == null || redirectUrl == '') {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/login'], { queryParams: { redirectUrl: redirectUrl } });
      }

    }

    //});
  }
  /*
  @who:priti
  @when:15-March-2021
  @why:1129
  @what:For get strength of password length
  */
  onStrengthChanged(strength: number) {
    //this.showDetails=true;
    this.Strength = strength;
    // if(strength==100)
    // {
    // this.showDetails=false;
    //}
  }
  toggleInfo() {
    if (this.showDetails) { this.showDetails = false; }
    else { this.showDetails = true; }
  }
  toggleCreateInfo() {
    if (this.showCreateDetails) { this.showCreateDetails = false; }
    else { this.showCreateDetails = true; }
  }
  onCreatePassStrengthChanged(strength: number) {
    //this.showCreateDetails = true;
    this.CreateStrength = strength;
    // if (strength == 100) {
    //   this.showCreateDetails = false;
    // }
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
          let regExp: any = new RegExp(data.Regex.trim());
          let ScriptSanitze: any = this.domSanitizer.bypassSecurityTrustScript(regExp);
          this.pattern = ScriptSanitze.changingThisBreaksApplicationSecurity;
          /////

          if (this.PasswordMin > 0) {
            this.IsPasswordLength = true;
          }
          else {
            this.IsPasswordLength = false;
          }
        }
      }
    );
  }
  getIPValidation() {
    //this.loading = true;
    this.authenticationService.getIPValidation().subscribe(
      (repsonsedata: ResponceData) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          // let element: HTMLElement = document.getElementById('btnResetCancel') as HTMLElement;
          // element.click();

          //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_resetPasswordSuccess'), repsonsedata.StatusCode);
          this.loading = false;
          this.showResetExp = false;
        }
        else {

          this.loading = false;
        }
      }, err => {
        // this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackbarerrmsg'), err.StatusCode);
        this.loading = false;
      })
  }



  /*
   @Type: File, <TS>
   @Name: cancelButton
   @Who:Renu
   @When: 16-Apr-2021
   @Why: ROST-1249
   @What: when user cancel the ongoing request
   */
  cancelButton(status) {
    if (status === 'Active') {
      this.container = 'right-panel-active';
    } else {
      this.container = '';
      if (this.domainSignUpdata !== undefined && this.domainSignUpdata !== null && this.domainSignUpdata !== '') {
        this.domainSignUp = true
      } else {
        this.domainSignUp = false;
      }

    }

    /* this.createAccountForm.get("FirstName").clearValidators();
     this.createAccountForm.get("FirstName").markAsPristine();               
     this.createAccountForm.get("LastName").clearValidators();
     this.createAccountForm.get("LastName").markAsPristine();
     this.createAccountForm.get("Email").clearValidators();
     this.createAccountForm.get("Email").markAsPristine();*/

    this.createAccountForm.reset();

    this.setPassword = false;
    this.uninviteBtn = false;
    this.userInvNextStep = false;
    this.setnextScreenUser = true;
    this.showSignUpfailureMsg = false;
    this.errorCode = null;
    this.errmsg = null;
    this.inputCapchaValue = 'input';
    setTimeout(() => {
      //this.router.navigate(['/sign-in']);
      this.router.navigate(['/login'], { queryParams: { domain: this.userDomain } });
    }, 400);
  }


  /************registerUserArrList*******/

  //@Type: File, <ts> : @Name: getRegisteredUserList function : Satya Prakash Gupta : @When: 13-Dec-2023 : EWM-15440 : @What: remove function

  /************************end*************/

  /*
    @Type: File, <ts>
    @Name: signup function
    @Who:  Suika
    @When: 30-May-2021
    @Why: ROST-1550
    @What: For signup process
   */

  signup(value) {
    this.loading = true;
    if (this.createAccountForm.invalid) {
      this.loading = false;
      this.createAccountForm.get('EmployeeType').markAsTouched();
      this.errmsg = true;
      return;
    } else {
      this.errmsg = false;
    }
    if (this.userDomain) {
      value['Domain'] = this.userDomain;
    } else {
      value['Domain'] = '';
    }
    /*  if (value.EmployeeType == 'employee') {
        value['EmployeeType'] = 1;
      } else if (value.EmployeeType == 'client') {
        value['EmployeeType'] = 2;
      } else {
        value['EmployeeType'] = 3;
      }*/
    value['UserTypeCode'] = value['EmployeeType'];
    delete value['Password'];
    delete value['confirmPassword'];
    //delete value['recaptcha'];
    delete value['OrganizationName'];
    delete value['OrganizationAddress'];
    delete value['EmployeeType'];
    this.authenticationService.signUp(value).subscribe(
      (repsonsedata: ResponceData) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.showSignUpsuccessMsg = true;
          this.errorCode = repsonsedata.Message;
          this.createAccountForm.reset();
          this.uninviteuserHide = false;
          this.setPassword = false;
        } else if (repsonsedata.HttpStatusCode == 400) {
          this.showSignUpfailureMsg = true;
          this.errorCode = repsonsedata.Message;
          this.setPassword = false;
        } else {
          this.showSignUpfailureMsg = true;
          this.errorCode = repsonsedata.Message;
          this.setPassword = false;
        }
      }, err => {
        this.showSignUpfailureMsg = true;
        this.loading = false;
        this.errorCode = 'label_snackbarerrmsg';
        this.setPassword = false;
      })
  }
  chkRemaimemberMeChange(ischk: boolean) {
    this.IschkRemaimemberMe = ischk;
  }
  /*
    @Type: Function
    @Who: Priti Srivastava
    @When: 29-june-2021
    @Why:  EWM-1863 (for user login in case of remeber me)
    @What: this function used for user login in case of remeber me.
  */
  userLogin() {
    const formData = { 'Domain': this.cookieService.get('userDomain'), 'IsRemember': Boolean(JSON.parse('true')), 'Device': 'web', 'Token': this.cookieService.get('Token') };

    this.authenticationService.loginDomain(formData).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (data.Data.Token) {
            this.loginResponce = data.Data;
            // value['MFA'] = 2;
            /************@ehy: EWM-1988 @who: Mukesh @what: to load menu on page load inital level*******/
            this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
              localStorage.setItem("menuInfo", JSON.stringify(response.Data));
              this._dynamicMenuService.menuStatusOb.next(1);
              if (this.loginResponce.MFA === 0) {
                this.setuserLocalStoreageData(data);
                this.router.navigate(['mfa']);
              } else if (this.loginResponce.MFA === 1) {
                this.setuserLocalStoreageData(data);
                //this.router.navigate(['./client/core/profile/profile-setting']);
                this.router.navigate(['./client/core/home/dashboard']);
              } else if (this.loginResponce.MFA === 2) {
                this.setuserLocalStoreageData(data);
                //this.router.navigate(['./client/core/profile/profile-setting']);
                this.router.navigate(['./client/core/home/dashboard']);
              } else {
                this.setuserLocalStoreageData(data);
                this.router.navigate(['mfa']);
              }
            });
            // set login sessionID :Priti(2-july-2021)EWM-1989
            localStorage.setItem('sessionId', uuidv4());
          } else {
            this.router.navigate(['/login']);
          }

        }
      },
      error => {
        this.router.navigate(['/login']);
      });
  }
  /*
    @Type: Function
    @Who: Priti Srivastava
    @When: 29-june-2021
    @Why:  EWM-1863 (set localstoreage in case of remeber me)
    @What: this function used for user login in case of remeber me.
  */
  setuserLocalStoreageData(data) {
    if (data.Data['Colors'] != undefined && data.Data['Colors'] != null) {
      localStorage.setItem('HeaderBackground', data.Data['Colors']['HeaderBackground']);
      localStorage.setItem('HeaderColor', data.Data['Colors']['HeaderColor']);
      localStorage.setItem('HighlightBackground', data.Data['Colors']['HighlightBackground']);
      localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
      localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
    }
    if (data.Data['Urls'] != undefined && data.Data['Urls'] != null) {
      localStorage.setItem('FaviconUrl', data.Data['Urls']['FaviconUrl']);
      localStorage.setItem('LogoUrl', data.Data['Urls']['LogoUrl']);
    }

    localStorage.setItem('MFA', data.Data['MFA']);
    localStorage.setItem('OrganizationId', data.Data['OrganizationId']);
    localStorage.setItem('OrganizationName', data.Data['OrganizationName']);//who:maneesh,what:ewm-15806 for set OrganizationName,when:23/01/2024
    localStorage.setItem('LastLoginDateTime', data.Data['LastLoginDateTime']);
    localStorage.setItem('TimeZone', data.Data['TimeZone']);
    localStorage.setItem('DateTimeFormat', data.Data['DateTimeFormat']);
    localStorage.setItem('QuickTour', data.Data['QuickTour']);
    //localStorage.setItem('Language', data.Data['Language']);
    if (data.Data['Language'] === null) {
      localStorage.setItem('Language', 'eng');
    } else {
      localStorage.setItem('Language', data.Data['Language']);
    }
  }

  /*
    @Who: Adarsh singh
    @When: 13-07-2023
    @Why:  EWM-13082
    @What: this function used for check which message will come
  */
  checkMessageType(params) {
    if (params.logout === 'y') {
      this.showLogoutSuccessSnack('label_login_logoutMessage');
    }
    if (params.sessionExpire === 'y') {
      this.showLogoutSuccessSnack('label_login_sessionExpiredMessage');
    }
  }
  /*
    @Who: Adarsh singh
    @When: 13-07-2023
    @Why:  EWM-13082
    @What: this function used for show successfully logout message
  */
  showLogoutSuccessSnack(message: string) {
    this._snackBarService.showSuccessLogoutSnackBar(message);
  }
}
function uuidv4(): string {
  throw new Error('Function not implemented.');
}

