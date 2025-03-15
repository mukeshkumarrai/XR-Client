import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { candidateEntity, candResumeCoverLetter, JobScreening } from 'src/app/shared/models/job-screening';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../../shared/services/candidates/candidate.service';

@Component({
  selector: 'app-candidate-jobresume',
  templateUrl: './candidate-jobresume.component.html',
  styleUrls: ['./candidate-jobresume.component.scss']
})
export class CandidateJobResumeComponent implements OnInit {

  candidateList: candidateEntity[];
  candId: string;
  candidateData: candResumeCoverLetter;
  //loaderAddInfo = false;
  public loaderAddInfo = false;
  subscription: Subscription;
  jobId:string;
  loading:boolean=false;  
  ResumeUrl:string;
  FileName: string;  
  public fileType: string;
  viewer: string;
  resumeInfoData: boolean=false;
  isParse: boolean=false;
  FilePath: string;
  UploadFileName:string;
  public parseResumeData: any = {};
  constructor(public dialog: MatDialog,public jobservice: JobService,public dialogRef: MatDialogRef<CandidateJobResumeComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any, private commonserviceService: CommonserviceService, public candidateService: CandidateService,
     private snackBService: SnackBarService,private translateService: TranslateService,private appSettingsService: AppSettingsService) {     
      this.candId = data?.canDetails?.CandidateId;      
      this.fileType = appSettingsService.file_file_type_extralarge;
      console.log(this.candidateList,"this.candidateList");
  }

  ngOnInit(): void {
   this.viewResumeByCandidateId(this.candId);
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
  document.getElementsByClassName("candidate-jobresume")[0]?.classList.remove("animate__zoomIn")
  document.getElementsByClassName("candidate-jobresume")[0]?.classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}



  /*
  @Type: File, <ts>
  @Name: viewResumeByCandidateId
  @Who: Suika
  @When: 26-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: View Resume
  */
viewResumeByCandidateId(candidateId) {
  this.loading = true;
  this.candidateService.fetchCandidateResumeHistory("?candidateId=" + candidateId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode == 204) {
        this.resumeInfoData=true;
        let gridView = repsonsedata.Data;
            this.ResumeUrl = gridView?.ResumeUrl;
            this.FileName = gridView?.FileName;
            this.FilePath = repsonsedata.Data?.FileName;
            this.UploadFileName = repsonsedata.Data?.UploadFileName;
            const list = gridView?.FileName?.split('.');
            if (list != undefined) {
              this.fileType = list[list?.length - 1];
              if (this.fileType == 'PDF' || this.fileType == 'pdf') {
                this.viewer = 'url';
              } else {
                this.viewer = 'office';
              }
            }          
          this.loading = false;
      } else {
          this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}



  /*
  @Type: File, <ts>
  @Name: selectedTabValue
  @Who: Suika
  @When: 26-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: selectedTabValue
  */
selectedTabValue(tab) {  
  let labelName = tab.index;
  if (labelName === 1) {     
    this.isParse = true;
  }else {  
    this.isParse = false;
  }
}

/*
  @Type: File, <ts>
  @Name: parseResume
  @Who: Suika
  @When: 26-Aug-2023
  @Why: EWM-13813 EWM-13813
  @What: parse resume  list for candidate
*/
parseResume() {
  let FileObj = {};
  this.loading = true;
  FileObj['FileName'] = this.FileName;
  FileObj['FilePath'] = this.FilePath;
  FileObj['CandidateId'] = this.candId;
  this.candidateService.parseResume(FileObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.parseResumeData = repsonsedata.Data;
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.parseResumeData = [];
        this.loading = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;

    })
}


}
