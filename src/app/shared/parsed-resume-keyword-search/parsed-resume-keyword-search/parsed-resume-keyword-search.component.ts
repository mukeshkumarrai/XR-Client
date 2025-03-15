import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from '@app/shared/models';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
export interface ResumeEntity {
  FileName: string
  FilePath: string
  CandidateId: string
  DemoDoc: string
  ResumeUrl:string
}

@Component({
  selector: 'app-parsed-resume-keyword-search',
  templateUrl: './parsed-resume-keyword-search.component.html',
  styleUrls: ['./parsed-resume-keyword-search.component.scss']
})
export class ParsedResumeKeywordSearchComponent implements OnInit {
  public url: any;
  public viewer = 'url';
  public isLoading: boolean = true;
  public fileType: any;
  // <!-- @bantee @whn 27-05-2023 @whyEWM-12535 to show corresponding tab name; -->
  public showTabName: string;
  docStatus: boolean;
  loading: boolean;
  resumeEntity = <ResumeEntity>{};
  public isParse: boolean = false;
  public isNewResumeLoading: boolean = false;
  // public loading: boolean=true;
  /*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: maneesh
    @When: 25-may-2021
    @Why: -EWM-5839-EWM-5872
    @What:  this component created for open popup reason and copmlete the functionlity openpopup
*/
  constructor(public dialogRef: MatDialogRef<ParsedResumeKeywordSearchComponent>, public systemSettingService: SystemSettingService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService, private translateService: TranslateService,
    public candidateService: CandidateService) {
    this.showTabName = data?.TabName;
    this.resumeEntity.CandidateId = data?.CandidateId;
  }
  ngOnInit(): void {
    this.viewResumeByCandidateId( this.resumeEntity.CandidateId);
    this.isLoading = false;
  }
  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: maneesh
   @When: 25-may-2022
   @Why: -EWM-5839-EWM-5872
   @What: closing the pop-up 
*/
  onDismiss() {
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    document.getElementsByClassName("resume-docs")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("resume-docs")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
  }
  /* @Name: parseResume @Who: Renu @When: 04-02-2024 @Why: EWM-15584 EWM-16613  @What: parse resume  list for candidate*/
  parseResume() {
    let FileObj = {};
    this.isNewResumeLoading = true;
    this.loading = true;
    FileObj['FileName'] = this.resumeEntity.FileName;
    FileObj['FilePath'] = this.resumeEntity.FilePath;
    FileObj['CandidateId'] = this.resumeEntity.CandidateId;
    this.candidateService.parseResume(FileObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.isNewResumeLoading = false;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.isNewResumeLoading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.isNewResumeLoading = false;
          this.loading = false;
        }
      }, err => {
        this.isNewResumeLoading = false;
        this.loading = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
    /* @Name: selectedTabValue @Who: Renu @When: 04-02-2024 @Why: EWM-15584 EWM-16613  @What: on change of tab*/

  selectedTabValue(tab) {
    let labelName = tab.index;
    if (labelName === 1) {
      this.isParse = true;
    } else if (labelName === 2) {
      this.isParse = false;
    } else {
      this.isParse = false;
    }
  }   
   /* @Name: viewResumeByCandidateId @Who: Renu @When: 10-04-2024 @Why: EWM-16660 EWM-16712  @What: get resume by id*/

   viewResumeByCandidateId(candidateId: string) {
    this.loading = true;
    this.candidateService.fetchCandidateResumeHistory("?candidateId=" + candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode == 204) {
          
          let gridView = repsonsedata.Data;
          if (gridView?.length == 0) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_resumeNotAddedYet'), repsonsedata['HttpStatusCode']);
            this.loading = false;
          } else {
              let filename = gridView?.ResumeUrl?.split('.').pop();
              let fname = 'resume.' + filename;
              this.resumeEntity.DemoDoc = gridView?.ResumeUrl??fname;
              this.resumeEntity.FileName = gridView?.UploadFileName;
              this.resumeEntity.FilePath = repsonsedata.Data?.FileName;
              const list = gridView?.FileName?.split('.');
              if (list && list!=='') {
                this.fileType = list[list?.length - 1];
                if (this.fileType?.toLowerCase() == 'jpg' || this.fileType?.toLowerCase() == 'png' || this.fileType?.toLowerCase() == 'jpeg' || this.fileType?.toLowerCase() == 'gif') {
                  this.docStatus = false;
                }
                else if (this.fileType?.toLowerCase() == 'pdf') {
                  this.docStatus = true;
                  this.viewer = 'url';
                } else {
                  this.docStatus = true;
                  this.viewer = 'office';
                }
              }       
              
            this.resumeEntity.DemoDoc ? this.isNewResumeLoading = false : this.isNewResumeLoading = true;
            this.loading = false;
          }
        } else {
            this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
}
