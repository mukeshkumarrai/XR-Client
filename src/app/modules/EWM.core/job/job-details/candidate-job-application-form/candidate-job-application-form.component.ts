import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import * as FileSaver from 'file-saver';
import { ApplicationForm } from 'src/app/shared/models/job-screening';
import { FilePreviwerPopupComponent } from 'src/app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';


@Component({
  selector: 'app-candidate-job-application-form',
  templateUrl: './candidate-job-application-form.component.html',
  styleUrls: ['./candidate-job-application-form.component.scss']
})
export class CandidateJobApplicationFormComponent implements OnInit {

  public isLoading: boolean = false;
  viewer = 'url';
  public IsApplicationForm: boolean = true;
  jobId: any;
  applicationUrl: any;
  UploadFileName: any;
  applicationData: ApplicationForm;
  public dirctionalLang: any;
  tabName: string = 'Application Form'
  loaderAddInfo: boolean;
  docUrl: boolean;
  candId:string;
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<CandidateJobApplicationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public candidateService: CandidateService,private jobService: JobService,) {
      this.candId = data?.canDetails?.CandidateId; 
      this.jobId = data?.JobId;
    
  }

  ngOnInit(): void {
    this.getApplicationFormByJobId(this.candId);
  }

  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Suika
   @When: 26-Aug-2023
   @Why: EWM-13813 EWM-13813
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
     @Who: Suika
     @When: 26-Aug-2023
     @Why: EWM-13813 EWM-13813
     @What: on click doanload button
   */
  onDownloadAppForm(url: any, FileName: any) {
    FileSaver.saveAs(url, FileName);
  }

  /*
    @Type: File, <ts>
    @Name: getApplicationFormByJobId function
    @Who: Suika
    @When: 26-Aug-2023
    @Why: EWM-13813 EWM-13813
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
            const base64Data = repsonsedata.Data.bytes 
            const contentType = 'application/pdf';  
            const blob = this.base64ToBlob(base64Data, contentType);
            this.applicationUrl = URL.createObjectURL(blob);
            this.IsApplicationForm = false;
            this.isLoading = false;
            this.loaderAddInfo = false;
            this.UploadFileName = this.applicationData.filename;
            this.docUrl = false;
          } else {
            this.IsApplicationForm = true;
            this.isLoading = false;
            this.applicationUrl = null;
            this.loaderAddInfo = false;
            this.docUrl = false;
          }
        }, err => {
        });
    }
  }

 /*
    @Type: File, <ts>
    @Name: base64ToBlob function
    @Who: Suika
    @When: 26-Aug-2023
    @Why: EWM-13813 EWM-13813
    @What: base64ToBlob data
  */
  base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: contentType });
  }



  /*
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Suika
  @When: 26-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: for close popup
  */
 onDismiss() {
  document.getElementsByClassName("candidate-jobapplicationform")[0]?.classList.remove("animate__zoomIn")
  document.getElementsByClassName("candidate-jobapplicationform")[0]?.classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}
}