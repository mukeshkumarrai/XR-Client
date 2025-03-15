import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActionserviceService } from '../shared/actionservice.service';
import { PreviewSaveService } from '../shared/preview-save.service';

@Component({
  selector: 'app-important-links',
  templateUrl: './important-links.component.html',
  styleUrls: ['./important-links.component.scss']
})
export class ImportantLinksComponent implements OnInit {
  @Input() totalStepsCount: number;
  currentStep: any;
  submitActive: boolean;
  @Output() stepperNext = new EventEmitter<any>();
  mode: any;
  JobId: any;
  applicationId: any;
  applicationParam: string;
  loading: boolean;
  importantLinksList;
  @Input() lableTitleName: string;

  constructor(private snackBService: SnackBarService, private jobService: JobService, private translateService: TranslateService,
    private routes: ActivatedRoute, private fb: FormBuilder, private appSettingsService: AppSettingsService,
    public dialog: MatDialog, private commonService: CommonserviceService, private http: HttpClient, private router: Router,
    private actionsService: ActionserviceService, private previewSaveService: PreviewSaveService) {

  }

  ngOnInit(): void {
    this.commonService.onstepperInfoChange.subscribe(res => {
      this.currentStep = res + 1;
      if (this.totalStepsCount == this.currentStep) {
        this.submitActive = true;
      } else {
        this.submitActive = false;
      }
    })
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationId = parms?.applicationId;
        // this.applicationParam='?applicationId='+parms?.applicationId;
      } else if (parms?.jobId) {
        this.JobId = parms?.jobId;
        this.applicationParam = '?jobId=' + parms?.jobId;

      }
      if (parms?.mode) {
        this.mode = parms?.mode;
      }
    });
    this.getImportantLinksByApplicationId(this.applicationId)
  }


  /*
   @Type: File, <ts>
   @Name: saveApplicationInfo
   @Who: Adarsh singh
  @When: 31-Oct-2022
  @Why: EWM-8897 EWM-9270
   @What: for saving application overall  data
  */
  saveApplicationInfo() {
    this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
  }

  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Adarsh singh
    @When: 31-Oct-2022
    @Why: EWM-8897 EWM-9270
     @What: on save pop-up button file
   */

  onConfirm(): void {
    if (this.mode == 'apply') {
      // this.saveDocsInfo();
    } else {
      this.stepperNext.emit(true);
    }

  }

  /*
@Type: File, <ts>
@Name: getImportantLinksByApplicationId function
@Who: Adarsh singh
@When: 31-Oct-2022
@Why: EWM-8897 EWM-9270
@What: get data
*/
  getImportantLinksByApplicationId(ApplicationFormId: any) {
    this.loading = true;
    this.jobService.getImportantLinksAll('?applicationId=' + ApplicationFormId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            this.importantLinksList = data?.Data.ImportantLinkDetails;
            // this.importantLinksList = this.data;
            // this._commonService.importantLinksForm.next(this.importantLinksList);
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

/* 
   @Type: File, <ts>
   @Name: socialURL function
   @Who: Adarsh singh
   @When: 28-Oct-2022
   @Why: ROST-9259
   @What: for redirect on new tab with url 
*/

socialURL(url){
  let http = url.search('http')
  let tempurl;
  if(http===-1){
    tempurl = "http://"+url;
  }else{
    tempurl = url;
  }
  if(url!=''){
    window.open(tempurl,'_blank')
  }
}

/* 
   @Type: File, <ts>
   @Name: copyJobApplicationUrl function
   @Who: Adarsh singh
   @When: 28-Oct-2022
   @Why: ROST-9259
   @What: for copy current data 
*/
message =  this.translateService.instant('label_copy');
copyJobApplicationUrl(jobApplicationUrl){ 
  this.message = this.translateService.instant('label_copied');
  setTimeout(() => {
    this.message = this.translateService.instant('label_copy');
  }, 3000);
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = jobApplicationUrl;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

}
