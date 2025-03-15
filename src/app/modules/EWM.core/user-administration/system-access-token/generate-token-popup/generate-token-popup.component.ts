/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 06-April-2022
    @Why: EWM-5580 EWM-6098
    @What:  This page wil be use only for generate-token Component ts
*/
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { NewApiTokenPopupComponent } from '../new-api-token-popup/new-api-token-popup.component';
import {CustomValidatorService} from '../../../../../shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-generate-token-popup',
  templateUrl: './generate-token-popup.component.html',
  styleUrls: ['./generate-token-popup.component.scss']
})
export class GenerateTokenPopupComponent implements OnInit {

  generateTokenForm: FormGroup;
  public loading: boolean = false;
  @ViewChild('tokenName') tokenName: MatInput;

  today = new Date();
  maxDate = new Date();
  pageSize: any = 0;
  tokenExpiryDays: any = 0;
  getDateFormat:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<GenerateTokenPopupComponent>,
    private textChangeLngService: TextChangeLngService, private jobService: JobService, private route: Router,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService, private profileInfoService: ProfileInfoService, private _appSetting: AppSettingsService,
    private appSettingsService: AppSettingsService) {
    //this.pageSize = this._appSetting.pagesize;
    this.tokenExpiryDays = this._appSetting.tokenExpiryDays;
    this.maxDate = new Date(Date.now() + this.tokenExpiryDays * 24 * 60 * 60 * 1000)

    this.generateTokenForm = this.fb.group({
      ExpiryDate: [null, [CustomValidatorService.dateValidator]],
      TokenName: ['', [Validators.required, Validators.maxLength(50)]],

    });

  }


  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;

  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.tokenName.focus();
    }, 1000);

  }


       /* 
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Anup Singh
  @When: 13-April-2022
  @Why: EWM-5580 EWM-6099
  @What: for close popup.
*/
  onDismiss(): void {
    document.getElementsByClassName("generateToken")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("generateToken")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: false }); }, 200);
  }


  /*
@Type: File, <ts>
@Name: OnSubmit
@Who: Anup Singh
@When: 13-April-2022
@Why: EWM-5580 EWM-6099
@What: for generate token
*/
  OnSubmit(value) {
    let saveObj = {}
    saveObj['Name'] = value?.TokenName;
    saveObj['ExpiryDate'] = value?.ExpiryDate;
    saveObj['PageURL'] = window.location.href;

    this.loading = true;
    this.systemSettingService.createSystemAccessToken(saveObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.openModelGenerateNewApiToken(repsonsedata.Data)
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }



  /*
@Type: File, <ts>
@Name: openModelGenerateNewApiToken
@Who: Anup Singh
@When: 13-April-2022
@Why: EWM-5580 EWM-6099
@What: for open popup to view client id and secret key
*/
  openModelGenerateNewApiToken(resData) {
    document.getElementsByClassName("generateToken")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("generateToken")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close({ resType: true }); }, 200);

    const dialogRef = this.dialog.open(NewApiTokenPopupComponent, {
      data: new Object({ ClientId: resData?.ClientId, ClientSecret: resData?.ClientSecret, EmailId: resData?.EmailId, isPopUpClose: false }),
     panelClass: ['xeople-modal', 'generateNewApiToken', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {
        // document.getElementsByClassName("generateToken")[0].classList.remove("animate__zoomIn")
        // document.getElementsByClassName("generateToken")[0].classList.add("animate__zoomOut");
        // setTimeout(() => { this.dialogRef.close({ resType: true }); }, 200);
      }
      else {
        // console.log("false")
      }

    });
  }

  
/*
  @Type: File, <ts>
  @Name: clearExpiredDate function
  @Who: Adarsh singh
  @When: 17-March-2023
  @Why: EWM-11180
  @What: For clear ExpiryDate
*/
clearExpiredDate(){
    this.generateTokenForm.patchValue({
      ExpiryDate: null
    });
  }
}
