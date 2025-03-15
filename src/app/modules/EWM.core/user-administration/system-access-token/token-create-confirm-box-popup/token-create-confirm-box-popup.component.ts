/*
@(C): Entire Software
@Type: File, <html>
@Who: Anup Singh
@When: 13-April-2022
@Why: EWM-5580 EWM-6099
@What:  This page wil be use only for token create confirm box Component TS
*/

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-token-create-confirm-box-popup',
  templateUrl: './token-create-confirm-box-popup.component.html',
  styleUrls: ['./token-create-confirm-box-popup.component.scss']
})
export class TokenCreateConfirmBoxPopupComponent implements OnInit {

public EmailId = " ";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TokenCreateConfirmBoxPopupComponent>,
  private textChangeLngService: TextChangeLngService, private jobService: JobService, private route: Router,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService, private profileInfoService: ProfileInfoService,private _appSetting: AppSettingsService) {

      this.EmailId = data?.EmailId;
     }

  ngOnInit(): void {
  }

      /* 
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Anup Singh
  @When: 13-April-2022
  @Why: EWM-5580 EWM-6099
  @What: for close popup.
*/
onClose(): void {
  document.getElementsByClassName("createTokenComfirmationBox")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("createTokenComfirmationBox")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({ resType: true }); }, 200);
}

}
