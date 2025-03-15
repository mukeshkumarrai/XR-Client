import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DummyService } from 'src/app/shared/data/dummy.data';
import { ModalComponent } from '../../shared/modal/modal.component';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Router } from '@angular/router';
import { PreviousRouteServiceService } from 'src/app/shared/services/PreviousRouteService/previous-route-service.service';
import { MatInput } from '@angular/material/input';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { MatDrawer } from '@angular/material/sidenav';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { Item, data } from '../sign-in/features';
import { DOCUMENT } from '@angular/common';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
@Component({
  selector: 'app-new-forgot-email',
  templateUrl: './new-forgot-email.component.html',
  styleUrls: ['./new-forgot-email.component.scss'],
  providers: [DummyService]
})
export class NewForgotEmailComponent implements OnInit {
  public items: Item[] = data;
  public width = "100%";
  public height = "500px";
  private interval;
  @ViewChild("sv") private scrollView;
  
  userDefoultLang: string;
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
  enterEmail: boolean = true;
  enterName: boolean = false;
  accountNotFound: boolean = false;
  getVerificationCode: boolean = false;
  enterCode: boolean = false;
  dontWorry: boolean = false;
  modaldata: any;
  container: any;
  forgotEmailFrom: FormGroup;
  public alternateContactAddress = {};
  public verifyUserName = {};
  public verifyUserCode = {};
  emailAddress;
  userId;
  errmsg: boolean = true;
  errmsgexternal: boolean = true;
  loading: boolean;
  // public emailPattern = /^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/;
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$"
  public forgotEmailActive = false;
  previousUrl: string = null;
  currentUrl: string = null;
  transEffect: boolean=false;
  @ViewChild('UserEmailorPhone') UserEmailorPhone: MatInput;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  public formfieldnotempty:boolean=true;
  public verifyEmailid:string    
  constructor(
    private translateService: TranslateService,
    public dummyService: DummyService,
    public dialog: MatDialog,
    private forgotEmailService: LoginService,
    private fb: FormBuilder,
    private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService,
    private router: Router,  private previousRouteService: PreviousRouteServiceService,
    @Inject(DOCUMENT) private document: Document, private appSettingsService: AppSettingsService
  ) {
    this.emailPattern=this.appSettingsService.emailPattern;
    this.forgotEmailFrom = this.fb.group({
      UserEmailorPhone: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      UserFisrtName: ['', [Validators.required,Validators.maxLength(50)]], //who:maneesh,what:ewm-15128 for maxlength,when:13/12/2023
      UserLastName: ['', [Validators.required,Validators.maxLength(50)]],
      UserVerifyCode: ['', [Validators.required]]
    })

    this.container = '';
    this.forgotEmailActive = false;
    

  }

  ngOnInit(): void {  
    this.commonserviceService.setDrawer(this.drawer);
   this.previousUrl=this.previousRouteService.getPreviousUrl();
   this.currentUrl=this.previousRouteService.getCurrentUrl();
    if( this.previousUrl==  this.currentUrl)
    {
      this.container = 'right-panel-active';
      this.transEffect=true;
    }else
    {
      setTimeout(() => {
        this.transectionEffect('Active');
      }, 100);
    }
    this.document.body.classList.add('login-screen-body');
  }

  onSwiper(swiper) {
    // console.log(swiper);
   }
   onSlideChange() {
   //  console.log('slide change');
   }

  ngAfterViewInit() {
    this.UserEmailorPhone.focus();
  
    this.interval = setInterval(() => {
      this.scrollView.next();
    }, 5000);
  }

  public ngOnDestroy(): void {
    clearInterval(this.interval);
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
  /*
  @Type: File, <ts>
  @Name: switchNameForm
  @Who: Nitin Bhati
  @When: 07-April-2021
  @Why: EWM-1306
  @What: For call verify forgot email address APi
  */
  switchNameForm(value ,firsnameData,lastNameData) {
    localStorage.removeItem('currentUser');
    if (this.forgotEmailFrom.get("UserEmailorPhone").hasError('required') || this.forgotEmailFrom.get("UserEmailorPhone").hasError('pattern')) {
      // this.forgotEmailFrom.get("UserEmailorPhone").setErrors({ required: true });
      this.forgotEmailFrom.get("UserEmailorPhone").setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
      this.forgotEmailFrom.get("UserEmailorPhone").markAsTouched();
      this.loading = false;
      return;
    }

    this.alternateContactAddress['AlternateContactAddress'] = value;
    this.loading = true;
    this.forgotEmailService.getVerifyForgotEmail(JSON.stringify(this.alternateContactAddress)).subscribe(
      repsonsedata => {
        if (repsonsedata.HttpStatusCode == 200) {
          // this.enterEmail = false;
          this.enterName = true;
          this.userId = repsonsedata.Data.UserId;
          this.switchSendVerificationCode(firsnameData, lastNameData);

          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 400) {
          this.loading = false;
          this.forgotEmailFrom.get("UserEmailorPhone").setErrors({ NotExistEmail: true });
          this.forgotEmailFrom.get("UserEmailorPhone").markAsTouched();
          this.enterEmail = true;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
        else {
          this.enterEmail = false;
          this.accountNotFound = true;
          this.loading = false;
          this.errmsg = true;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
   @Type: File, <ts>
   @Name: switchSendVerificationCode
   @Who: Nitin Bhati
   @When: 07-April-2021
   @Why: EWM-1306
   @What: For call switchSendVerificationCode API
   */
  switchSendVerificationCode(firstName, lastname) {
    if (this.forgotEmailFrom.get("UserFisrtName").hasError('required')) {
      this.forgotEmailFrom.get("UserFisrtName").setErrors({ required: true });
      this.forgotEmailFrom.get("UserFisrtName").markAsTouched();
      this.loading = false;
      return;
    }
    if (this.forgotEmailFrom.get("UserLastName").hasError('required')) {
      this.forgotEmailFrom.get("UserLastName").setErrors({ required: true });
      this.forgotEmailFrom.get("UserLastName").markAsTouched();
      this.loading = false;
      return;
    }
    this.verifyUserName['FirstName'] = firstName;
    this.verifyUserName['LastName'] = lastname;
    this.verifyUserName['UserId'] = this.userId;
    this.loading = true;
    // if (this.forgotEmailFrom.invalid) {
    //   this.loading = false;
    //   return;
    // }
    this.forgotEmailService.checkUserNameorSendCode(JSON.stringify(this.verifyUserName)).subscribe(
      repsonsedata => {
        if (repsonsedata.HttpStatusCode == 200) {
          this.enterEmail = false;
          this.enterName = false;
          this.getVerificationCode = true;
          this.emailAddress = repsonsedata.Data;
          this.emailAddress = repsonsedata.Data.AlternateEmail;
          this.loading = false;
          this.switchVerifyCode()

        } else {
          this.forgotEmailFrom.get("UserFisrtName").setErrors({ NotExistFirstName: true });
          this.forgotEmailFrom.get("UserFisrtName").markAsTouched();
          this.forgotEmailFrom.get("UserLastName").setErrors({ NotExistLastName: true });
          this.forgotEmailFrom.get("UserLastName").markAsTouched();
          this.loading = false;
          this.enterEmail = true;
          this.enterName = false;
          this.accountNotFound = true;
          this.errmsg = true;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: switchNameForm
    @Who: Nitin Bhati
    @When: 07-April-2021
    @Why: EWM-1306
    @What: For call verify forgot email address APi
    */
  switchVerifyCode() {
    this.enterEmail = false;
    this.enterName = false;
    this.getVerificationCode = false;
    this.enterCode = true;
    this.alternateContactAddress['AlternateContactAddress'] = this.emailAddress;
    this.forgotEmailService.sendVerificationCode(JSON.stringify(this.alternateContactAddress)).subscribe(
      repsonsedata => {
        if (repsonsedata.HttpStatusCode == 200) {
          this.enterEmail = false;
          this.enterName = false;
          this.getVerificationCode = false;
          this.enterCode = true;
        } else {
          this.enterEmail = false;
          this.enterName = false;
          this.accountNotFound = true;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
 /*
    @Type: File, <ts>
    @Name: switchEnterCode
    @Who: Nitin Bhati
    @When: 07-April-2021
    @Why: EWM-1306
    @What: For call verify code return email address APi
    */
  switchEnterCode(UserVerifyCode) {
    if (this.forgotEmailFrom.get("UserVerifyCode").hasError('required')) {
      this.forgotEmailFrom.get("UserVerifyCode").setErrors({ required: true });
      this.forgotEmailFrom.get("UserVerifyCode").markAsTouched();
      this.loading = false;
      return;
    }
    this.verifyUserCode['Code'] = UserVerifyCode;
    this.verifyUserCode['UserId'] = this.userId;
    this.forgotEmailService.verifyCodeorReturnEmail(JSON.stringify(this.verifyUserCode)).subscribe(
      repsonsedata => {
        if (repsonsedata.HttpStatusCode == 200) {
          this.verifyEmailid=repsonsedata.Data;
          setTimeout(() => {
          localStorage.setItem('verifyemailvalue',this.verifyEmailid);
           }, 200); 
          this.router.navigate(['/login']);
        } else {
          this.loading = false;
          this.forgotEmailFrom.get("UserVerifyCode").setErrors({ InvalidCode: true });
          this.forgotEmailFrom.get("UserVerifyCode").markAsTouched();
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: switchNameForm
    @Who: Nitin Bhati
    @When: 07-April-2021
    @Why: EWM-1306
    @What: For call verify forgot email address APi
    */
  switchDontWorry() {
    this.enterEmail = false;
    this.enterName = false;
    this.getVerificationCode = false;
    this.enterCode = false;
    this.dontWorry = true;
  }
  /*
    @Type: File, <ts>
    @Name: switchAccountNotFound
    @Who: Nitin Bhati
    @When: 07-April-2021
    @Why: EWM-1306
    @What: For call verify forgot email address APi
    */
  switchAccountNotFound() {
    this.enterEmail = false;
    this.enterName = false;
    this.getVerificationCode = false;
    this.enterCode = false;
    this.dontWorry = false;
    this.accountNotFound = true;
  }
  tryAgain() {
    this.accountNotFound = false;
    this.enterEmail = true;
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
  handleSuccess(data) {
  }

  /*
     @Type: closeError
     @Who: Nitin Bhati
     @When: 08-April-2021
     @Why:  EWM-1306
     @What: for closing the err msg on click event
  */
  closeError(msgId: string) {
    if (msgId == 'errmsg') {
      this.errmsg = false;
    } else {
      this.errmsgexternal = false;
    }
  }
  /*
     @Type: checkformfield
     @Who: maneesh
     @When: 08-dec-2023
     @Why:  EWM-15092
     @What: for check field is valid or not
  */
  checkformfield(value){
    // this.forgotEmailFrom.get("UserFisrtName").setErrors({ NotExistFirstName: false });
    // this.forgotEmailFrom.get("UserFisrtName").markAsTouched();
    // this.forgotEmailFrom.get("UserLastName").setErrors({ NotExistLastName: false });
    // this.forgotEmailFrom.get("UserLastName").markAsTouched();
    if (!this.forgotEmailFrom.controls['UserEmailorPhone'].value) {
      this.formfieldnotempty=true;
    }else if(!this.forgotEmailFrom.controls['UserFisrtName'].value){
      this.formfieldnotempty=true;
    }else if(!this.forgotEmailFrom.controls['UserLastName'].value){
      this.formfieldnotempty=true;
    }else{
      this.formfieldnotempty=false;
    }

  }
}