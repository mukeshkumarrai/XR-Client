import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { UploadNewResumeComponent } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-resume/upload-new-resume/upload-new-resume.component';
import { FilePreviwerPopupComponent } from 'src/app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { Resume } from 'src/app/shared/models/job-screening';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-job-candidate-resume',
  templateUrl: './job-candidate-resume.component.html',
  styleUrls: ['./job-candidate-resume.component.scss']
})
export class JobCandidateResumeComponent implements OnInit {
  public showUploadedResume: boolean = false;
  public isLoading: boolean = true;
  public showNoResumeBox: boolean = true;
  public showUploadResumeBox: boolean = false;
  public resumeInfoData: Resume;
  public DemoDoc: any;
  public FileName: any;
  public ResumeUrl: any;
  public FilePath: any = "";
  public UploadFileName: any = ""
  public fileType: any = "";
  viewer = 'url';
  public disableDownloadBtn: boolean;
  public dirctionalLang: any;
  @Input() candId: string;
  candidateList: any;
  @Input() loaderAddInfo: boolean = true;
  @Output() docFileUrlEmit = new EventEmitter<any>();

  @Input() set resumeInfo(value: Resume) {
    this.resumeInfoData = value;
    if (value || value === null) { // api response received
      if (value) {
        this.getResume();
        this.showUploadedResume = true;
      }
      else {
        this.showUploadedResume = false;
        this.isLoading = false;
      }
    } else { // api not yet called
    }
  }
  get resumeInfo() {
    return this.resumeInfoData;
  }


  constructor(public dialog: MatDialog, public candidateService: CandidateService) {
  }

  ngOnInit(): void {

  }

  /*
    @Type: File, <ts>
    @Name: onDownloadResume function
    @Who: Bantee Kumar
    @When: 26-May-2023
    @Why: EWM-11776 EWM-12534
    @What: on click doanload button
  */
  onDownloadResume(url: any, FileName: any) {

    FileSaver.saveAs(url, FileName);
  }


  /*
     @Type: File, <ts>
     @Name: openUploadResumeBox function
     @Who: Bantee Kumar
     @When: 26-May-2023
     @Why: EWM-11776 EWM-12534
     @What: on upload resume box
   */

  openUploadResumeBox() {
    const dialogRef = this.dialog.open(UploadNewResumeComponent, {
      data: this.candId,
      panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.isLoading = false;
        this.DemoDoc = res.data;
        this.FileName = res.UploadFileName;
        this.ResumeUrl = res.data;
        this.FilePath = res.filePath;
        this.UploadFileName = res.UploadFileName;
        const list = this.DemoDoc.split('.');
        this.fileType = list[list.length - 1];
        if (this.fileType == 'PDF' || this.fileType == 'pdf') {
          this.viewer = 'url';
        } else {
          this.viewer = 'office';
        }
        this.docFileUrlEmit.emit(true);

        this.showUploadedResume = true;
        this.showNoResumeBox = false;
        this.disableDownloadBtn = false;
      } else {
        this.isLoading = false;
      }
    })
  }

  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Bantee Kumar
   @When: 26-May-2023
   @Why: EWM-11776 EWM-12534
   @What:  showResume created for open popup 
*/

  showResume(ResumeUrl, FileName) {
    var filename = ResumeUrl?.split('.').pop();
    let fname = 'resume.' + filename;
    const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {
      data: new Object({ ResumeUrl: ResumeUrl, FileName: FileName ? FileName : fname }),
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
      @Name: getResume function
      @Who: Bantee Kumar
      @When: 26-May-2023
      @Why: EWM-11776 EWM-12534
      @What: getResume
    */

  getResume() {
    if (this.resumeInfoData) {
      this.FilePath = this.resumeInfoData.FileName;
      this.showUploadedResume = true;
      this.disableDownloadBtn = false;
      this.DemoDoc = this.resumeInfoData.ResumeUrl;
      this.ResumeUrl = this.resumeInfoData.ResumeUrl;
      this.FileName = this.resumeInfoData.FileName;

      this.UploadFileName = this.resumeInfoData.UploadFileName;
      const list = this.resumeInfoData.FileName?.split('.');
      if (list != undefined) {
        this.fileType = list[list.length - 1];
        if (this.fileType == 'PDF' || this.fileType == 'pdf') {
          this.viewer = 'url';
        } else {
          this.viewer = 'office';
        }
      }
    }

  }
}