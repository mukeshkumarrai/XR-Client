/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 18-Nov-2020
  @Why: ROST-368 ROST-401
  @What:  This page will be use for the security info Component ts file
*/
import { Component, Directive, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { MustMatch } from 'src/app/shared/helper/must-match.validator';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';


@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})

export class SecurityComponent implements OnInit {
  /****************Declaration of Global Variables*************************/

  accountPasswordHide = true;
  currentPasswordHide = true;
  newPasswordHide = true;
  confPasswordHide = true;
  status: boolean = false;
  chngPwdForm: FormGroup;
  AccpwdVerifyFrom: FormGroup
  loading: boolean;
  submitted = false;
  errorMatcher = new CustomErrorStateMatcher();
  MFA: any;
  result: string = '';
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public maxCharacterLengthSubHead = 115;
  filtersLoaded: Promise<boolean>;
  /*
  @who: priti
  @when: 12/march/2021
  @why: EWM-1132
  */
  showDetails: boolean;
  pattern = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$^&+=])(?!.*[*%-'"])/);
  PasswordMin: any = 8;
  PasswordMax = 30;
  IsPasswordLength = true;
  IsUpperCase: any = true;
  IsLowercase = true;
  IsSpecialCharector: any = true;
  IsDigit = true;
  Strength = 0;

  constructor(private fb: FormBuilder, private _profileInfoService: ProfileInfoService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog, public _encryptionDecryptionService: EncryptionDecryptionService,
    private commonserviceService: CommonserviceService, private translateService: TranslateService) {
    this.chngPwdForm = this.fb.group({
      CurPwd: ['', [Validators.required, Validators.minLength(this.PasswordMin), Validators.maxLength(this.PasswordMax)]],
      NewPwd: ['', [Validators.required]],
      ConfPwd: ['', [Validators.required]]
    }, {
      validator: MustMatch('NewPwd', 'ConfPwd')
    })
    this.AccpwdVerifyFrom = this.fb.group({
      accPwd: ['', [Validators.required, Validators.minLength(this.PasswordMin), Validators.maxLength(this.PasswordMax)]]
    })

  }

  ngOnInit(): void {

    this.getPasswordPattern();
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.commonserviceService.onMFASelectChange.subscribe(value => {
      this.MFA = localStorage.getItem('MFA');
    });
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
  }


  /*
    @Type: File, <ts>
    @Name: click function
    @Who: Satya Prakash
    @When: 18-Nov-2020
    @Why: ROST-368 ROST-401
    @What: click function for left sidebar
  */
  clickEvent() {
    this.status = !this.status;
  }

  /*
    @Type: File, <ts>
    @Name: changePwd function
    @Who: Renu
    @When: 23-Nov-2020
    @Why: ROST-411
    @What: service call to save data for changed pwd
  */

  changePwd(value) {
    value['CurrentPassword'] = this._encryptionDecryptionService.encryptData(value.CurPwd);
    value['NewPassword'] = this._encryptionDecryptionService.encryptData(value.NewPwd);
    delete value['CurPwd'];
    delete value['NewPwd'];
    this.loading = true;
    this.submitted = true;

    // stop here if form is invalid
    if (this.chngPwdForm.invalid) {
      return;
    }

    this._profileInfoService.chgPwdForm(JSON.stringify(value)).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.chngPwdForm.reset();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
      @Type: File, <ts>
      @Name: AccFormSubmit function
      @Who: Renu
      @When: 23-Nov-2020
      @Why: ROST-411
      @What: for two step verification process
  */

  AccFormSubmit(value, actionBtn) {
    value['password'] = this._encryptionDecryptionService.encryptData(value.accPwd);
    delete value['accPwd'];
    this.loading = true;
    this.submitted = true;
    // stop here if form is invalid
    if (this.AccpwdVerifyFrom.invalid) {
      return;
    }
    this._profileInfoService.accVerifyPwd(JSON.stringify(value)).subscribe(
      repsonsedata => {

        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.AccpwdVerifyFrom.reset();
          if (this.MFA != 1 || actionBtn == 'reset') {
            this.route.navigate(['./client/core/profile/security-mfa']);
          }

          if (actionBtn == 'disable') {
            this.userdisabledMFA();
          }

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
      @Type: File, <ts>
      @Name: userdisabledMFA function
      @Who: Renu
      @When: 13-Jan-2020
      @Why: ROST-702
      @What: To disabled MFA
  */


  userdisabledMFA() {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        this._profileInfoService.updateMFASettings().subscribe(
          repsonsedata => {
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              if (repsonsedata['Data'] == true) {
                this.commonserviceService.onMFASelect.next(localStorage.setItem('MFA', '0'));
                this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
                this.AccpwdVerifyFrom.reset();
              }

            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
            this.cancel.emit();
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            this.loading = false;
          })
      } else {
        // this.snackBService.showErrorSnackBar("Request is cancelled", this.result);
      }
    });
  }
  onStrengthChanged(strength: number) {
    //this.showDetails=true;
    this.Strength = strength;
    // this.getPasswordPattern();
    // if(strength==100)
    // {
    //   this.showDetails=false;
    // }
  }
  toggleInfo() {
    if (this.showDetails) { this.showDetails = false; }
    else { this.showDetails = true; }
  }
  /*
 @who:priti
 @when:16-March-2021
 @why:1165
 @what:For get password pattern details
 */


  getPasswordPattern() {
    this._profileInfoService.getPasswordValidationParameter().subscribe(
      response => {
        if (response['HttpStatusCode'] === 200) {

          let data = response['Data'];
          this.IsLowercase = data.LowerCase;
          this.IsDigit = data.Digit;
          this.IsUpperCase = data.UpperCase;

          this.PasswordMin = data.MinLength;
          this.IsSpecialCharector = data.SpecialCharacter;
          this.pattern = new RegExp(data.Regex.trim());
          const password = this.chngPwdForm.get('NewPwd');
          password.setValidators([Validators.minLength(this.PasswordMin), Validators.maxLength(this.PasswordMax), Validators.pattern(this.pattern)]);
          password.updateValueAndValidity();
          const Conpassword = this.chngPwdForm.get('ConfPwd');
          Conpassword.setValidators([Validators.minLength(this.PasswordMin), Validators.maxLength(this.PasswordMax), Validators.pattern(this.pattern)]);
          Conpassword.updateValueAndValidity();
          if (this.PasswordMin > 0) {
            this.IsPasswordLength = true;
          }
          else {
            this.IsPasswordLength = false;
          }
          this.filtersLoaded = Promise.resolve(true);
        }
      }
    );
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
    this.getPasswordPattern();
  }
}
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, chngPwdForm: NgForm | FormGroupDirective | null) {
    return control && control.invalid && control.touched;
  }

}
