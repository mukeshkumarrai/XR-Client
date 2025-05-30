/*
  @Type: File, <ts>
  @Who: Adarsh singh
  @When: 01-june-2023
  @Why: EWM-6872-EWM-7186
  @What: displaying job posted boards of broadbean 
*/

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BroadbeanJobPostedDetails, JobBoardDetails, Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';

@Component({
  selector: 'app-broadbean-job-boards-status',
  templateUrl: './broadbean-job-boards-status.component.html',
  styleUrls: ['./broadbean-job-boards-status.component.scss']
})
export class BroadbeanJobBoardsStatusComponent implements OnInit {
  loading: boolean;
  jobId: any;
  gridaData:JobBoardDetails[];
  public userpreferences: Userpreferences;

  constructor(public dialogRef: MatDialogRef<BroadbeanJobBoardsStatusComponent>, public systemSettingService: SystemSettingService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    private translateService: TranslateService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private jobService: JobService, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService) {
    this.jobId = data?.jobId
  }
  ngOnInit(): void {
    this.getJobBoardsPublishedOfBroadbean(this.jobId);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }

  /*
    @Type: File, <ts>
    @Name: getJobBoardsPublishedOfBroadbean function
    @Who: Adarsh singh
    @When: 01-june-2023
    @Why:  EWM-12604-EWM-12665
    @What:get the Job Publish Details 
  */
  getJobBoardsPublishedOfBroadbean(jobId) {
    this.loading = true;
    this.jobService.GETJobBoardPublishedDetailsOfBroadben('?jobId=' + jobId).subscribe(
      (repsonsedata: BroadbeanJobPostedDetails) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.gridaData = repsonsedata.Data;
          this.loading = false;
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
  onDismiss() {
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
}
