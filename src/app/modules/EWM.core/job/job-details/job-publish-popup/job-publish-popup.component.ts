/*
    @Type: File, <ts>
    @Who: maneesh
     @When: 10-june-2022
    @Why: EWM-6872-EWM-7186
    @What:create component for publishjob popup 
    */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-job-publish-popup',
  templateUrl: './job-publish-popup.component.html',
  styleUrls: ['./job-publish-popup.component.scss']
})
export class JobPublishPopupComponent implements OnInit {
  loading: boolean;
  jobId: any;
  gridaData: []= [];
  public userpreferences: Userpreferences;

  constructor(public dialogRef: MatDialogRef<JobPublishPopupComponent>,public systemSettingService:SystemSettingService,
    private commonserviceService: CommonserviceService,private fb:FormBuilder,private snackBService: SnackBarService,
     private translateService: TranslateService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
     private jobService: JobService,public _userpreferencesService: UserpreferencesService,private appSettingsService: AppSettingsService){
        this.jobId = data.jobId
       }
  ngOnInit(): void {
    this.getJobPublishDetails(this.jobId);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
 /*
    @Type: File, <ts>
    @Name: getJobPublishDetails function
    @Who: maneesh
     @When: 10-june-2022
    @Why: EWM-6872-EWM-7186
    @What:get the Job Publish Details 
    */
  getJobPublishDetails(jobId) {
    this.loading = true;
    this.jobService.getJobPublishDetail('?jobId='+jobId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {      
          this.gridaData = repsonsedata.Data
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
