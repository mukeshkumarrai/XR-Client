import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import * as FileSaver from 'file-saver';
import { ApplicationForm } from 'src/app/shared/models/job-screening';
import { FilePreviwerPopupComponent } from 'src/app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';

@Component({
  selector: 'app-job-candidate-application-form',
  templateUrl: './job-candidate-application-form.component.html',
  styleUrls: ['./job-candidate-application-form.component.scss']
})
export class JobCandidateApplicationFormComponent implements OnInit {

  public isLoading: boolean = false;
  viewer = 'url';
  public disableDownloadBtn: boolean;
  public IsApplicationForm: boolean = true;
  DemoDocCover: any;
  PreviewUrl: any;
  CoverLetterURL: any;
  jobId: any;
  applicationUrl: any;
  candidateList: any = [];
  loading: boolean;
  showUploadedAppForm: boolean;
  UploadFileName: any;
  applicationData: ApplicationForm;
  public dirctionalLang: any;
  tabName: string = 'Application Form'
  loaderAddInfo: boolean;
  docUrl: boolean;
  @Input() set candId(value: any) {
    //this.loaderAddInfo = true;

    if (value) {
      this.getApplicationFormByJobId(value);
      // this.loaderAddInfo = false;
    }
    // this.loaderAddInfo = false;
  }

  constructor(public dialog: MatDialog, public candidateService: CandidateService,
    private routes: ActivatedRoute,
    private jobService: JobService,) {
    this.routes.queryParams.subscribe((Id: any) => {
      this.jobId = Id['jobId'];
    })
  }

  ngOnInit(): void {
  }

  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Bantee Kumar
   @When: 26-May-2023
   @Why: EWM-11776 EWM-12534
   @What:  showAppForm created for open popup 
*/

  showAppForm(applicationUrl, FileName) {
    var filename = applicationUrl?.split('.').pop();
    let fname = 'resume.' + filename;
    const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {
      data: new Object({ ResumeUrl: applicationUrl, FileName: FileName ? FileName : fname, TabName: this.tabName }),
      panelClass: ['xeople-modal-full-screen', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;

    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      }
    });

  }

  /*
     @Type: File, <ts>
     @Name: onDownloadAppForm function
     @Who: Bantee Kumar
     @When: 26-May-2023
     @Why: EWM-11776 EWM-12534
     @What: on click doanload button
   */
  onDownloadAppForm(url: any, FileName: any) {
    FileSaver.saveAs(url, FileName);
  }

  /*
    @Type: File, <ts>
    @Name: getApplicationFormByJobId function
    @Who: Bantee Kumar
    @When: 26-May-2023
    @Why: EWM-11776 EWM-12534
    @What: getApplicationForm data
  */
  getApplicationFormByJobId(candId) {
    if (candId && this.jobId) {
      this.docUrl = true;
      this.loaderAddInfo = true;
      this.isLoading = true;
      this.jobService.getApplicationFormByJobId(candId, this.jobId).subscribe(
        (repsonsedata: ResponceData) => {
          this.isLoading = true;
          if (repsonsedata.HttpStatusCode === 200) {
            this.applicationData = repsonsedata.Data;
            // <!---------@When: 07-08-2023 @who:Adarsh singh @why: EWM-12873 --------->
            const base64Data = repsonsedata.Data.bytes 
            const contentType = 'application/pdf';  
            // Convert base64 to Blob and generate a blob URL
            const blob = this.base64ToBlob(base64Data, contentType);
            this.applicationUrl = URL.createObjectURL(blob);
            // End 
            this.IsApplicationForm = false;
            this.isLoading = false;
            this.loaderAddInfo = false;
            this.showUploadedAppForm = true;
            this.UploadFileName = this.applicationData.filename;
            this.docUrl = false;
          } else {
            this.showUploadedAppForm = false;
            // this.loading = false;
            this.IsApplicationForm = true;
            this.isLoading = false;
            this.applicationUrl = null;
            this.loaderAddInfo = false;
            this.docUrl = false;
          }
        }, err => {
          //this.loading = false;
        });
    }
  }

  // <!---------@When: 07-08-2023 @who:Adarsh singh @why: EWM-12873 --------->
  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }
// End 
}