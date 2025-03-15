import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-alert-popup-auto-fill-app-resume',
  templateUrl: './alert-popup-auto-fill-app-resume.component.html',
  styleUrls: ['./alert-popup-auto-fill-app-resume.component.scss']
})
export class AlertPopupAutoFillAppResumeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlertPopupAutoFillAppResumeComponent>,
  private textChangeLngService: TextChangeLngService, private jobService: JobService, private route: Router,
  private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
  public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService, private profileInfoService: ProfileInfoService, private _appSetting: AppSettingsService) { }

  ngOnInit(): void {
  }



         /* 
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Anup singh
 @When: 18-05-2022
 @Why: EWM-6554 EWM-6678
  @What: for close popup.
*/
onDismiss() {
  document.getElementsByClassName("resumeParse")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("resumeParse")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}
}
