import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { UploadCoverPageComponent } from 'src/app/modules/EWM-Candidate/profile-summary/cover-page/upload-cover-page/upload-cover-page.component';
import { FilePreviwerPopupComponent } from 'src/app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { CandidateExperienceService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-experience.service';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { CoverLetter, JobScreening } from 'src/app/shared/models/job-screening';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-job-candidate-cover-page',
  templateUrl: './job-candidate-cover-page.component.html',
  styleUrls: ['./job-candidate-cover-page.component.scss']
})
export class JobCandidateCoverPageComponent implements OnInit {
  CoverLetterURL: any;
  public showUploadedcoverLetter: boolean = false;

  public viewMode: string;
  animationState = false;
  public versionId: any;
  public versionCoverName: any;
  public ActualFileName: any;
  public showCoverPage: boolean = false;
  PreviewUrl: any;
  animationVar: any;

  JobDescription: string;
  ActiveJobs: any;
  DemoDoct: any;
  DemoDocR: any;
  DemoDocCover: any;
  CandidateApplicationStages: any;
  Application: any;
  Percentage: any;
  loading: boolean = false;
  viewer = 'url';

  //@Input() CandidateId: any;
  public isLoading: boolean = true;
  public isCoverPage: boolean = false;
  public isNewResumeLoading: boolean = true;
  public showNoCoverBox: boolean = true;
  public showUploadedCover: boolean = false;
  public formtitle: string = 'grid';
  public disableDownloadBtn: boolean;
  public UploadFileName: any = ""
  public fileType: any = "";
  public FilePath: any = "";
  public dirctionalLang: any;
  @Input() candId: string;
  @Input() loaderAddInfo: boolean = true;

  tabName: string = 'Cover Letter'
  candidateList: any;
  coverInfoData: CoverLetter;
  FileName: any;
  @Output() docFileUrlEmit = new EventEmitter<any>();
  ClientName: string;
  JobReferenceId: string;

  @Input() set coverInfo(value: CoverLetter) {
    this.coverInfoData = value;
    if (value || value === null) { // api response received
      if (value) {
        this.getCoverPageDeatils();
        this.showUploadedCover = true;
      }
      else {
        this.showUploadedCover = false;
        this.isLoading = false;

      }
      this.loading = false;
    }
    else { // api not yet called
      this.loading = true;
    }
  }
  get coverInfo() {
    return this.coverInfoData;
  }
  candidateJobActionList=[];
  constructor(public _sidebarService: SidebarService,
    public dialog: MatDialog, public systemSettingService: SystemSettingService,
    public candidateService: CandidateService,
    public dialogModel: MatDialog, public _GeneralInformationService: GeneralInformationService,
    public router: Router,private commonserviceService: CommonserviceService
  ) {
    this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      let candidateList = res?.SelectedCandidate;
      this.ClientName = res?.ClientName;
      this.JobReferenceId=res?.JobReferenceId;
      //let candidateList = res?.SelectedCandidate;      
      if (candidateList?.length>0) {
        this.candidateJobActionList=candidateList;
      }
    });
  }

  ngOnInit(): void {
  }

  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Bantee Kumar
   @When: 26-May-2023
   @Why: EWM-11776 EWM-12534
   @What:  showCoverletter created for open popup 
*/
  showCoverletter(ResumeUrl, FileName) {
    var filename = ResumeUrl?.split('.').pop();
    let fname = 'resume.' + filename;
    const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {
      data: new Object({ ResumeUrl: ResumeUrl, FileName: FileName ? FileName : fname, TabName: this.tabName }),
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
   @Name: onDownloadCoverPage function
   @Who: Bantee Kumar
   @When: 26-May-2023
   @Why: EWM-11776 EWM-12534
   @What: on click doanload button
 */
  onDownloadCoverPage(url: any, FileName: any) {
    FileSaver.saveAs(url, FileName);
  }

/*
    @Type: File, <ts>
    @Name: openUploadCovePage function
    @Who: Bantee Kumar
    @When: 26-May-2023
    @Why: EWM-11776 EWM-12534
    @What: on upload cover box
  */
  openUploadCovePage() {
    const dialogRef = this.dialog.open(UploadCoverPageComponent, {
      data: new Object({ candId: this.candId, isActive: 0,candidateJobActionList:this.candidateJobActionList,ClientName:this.ClientName,JobReferenceId:this.JobReferenceId }),
      panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {

        this.isLoading = false;

        this.DemoDocCover = res.data;
        this.PreviewUrl = res.data;
        this.CoverLetterURL = res.data;
        this.FileName = res.UploadFileName;
        this.FilePath = res.filePath;
        this.UploadFileName = res.UploadFileName;
        const list = this.DemoDocCover.split('.');
        if (list != undefined) {
          this.fileType = list[list.length - 1];
          if (this.fileType == 'PDF' || this.fileType == 'pdf') {
            this.viewer = 'url';
          } else {
            this.viewer = 'office';
          }
          this.docFileUrlEmit.emit(true);

          this.showUploadedCover = true;
          this.showNoCoverBox = false;
          this.disableDownloadBtn = false;
        }
      } else {
        this.isLoading = false;
      }

    })
  }


  /*
    @Type: File, <ts>
    @Name: getCoverPageDeatils function
    @Who: Bantee Kumar
    @When: 26-May-2023
    @Why: EWM-11776 EWM-12534
    @What: getCoverPageDeatils
  */
  getCoverPageDeatils() {

    if (this.coverInfoData) {
      this.FilePath = this.coverInfoData?.ActualFileName;

      this.showUploadedCover = true;
      this.disableDownloadBtn = false;
      this.DemoDocCover = this.coverInfoData?.PreviewUrl;
      this.PreviewUrl = this.coverInfoData?.PreviewUrl;
      this.CoverLetterURL = this.coverInfoData?.CoverLetterURL;
      this.FileName = this.coverInfoData?.ActualFileName;
      this.UploadFileName = this.coverInfoData?.ActualFileName;
      const list = this.CoverLetterURL?.split('.');
      if (list != undefined) {
        this.fileType = list[list.length - 1];
        if (this.fileType == 'PDF' || this.fileType == 'pdf') {
          this.viewer = 'url';
        } else {
          this.viewer = 'office';
        }
        this.loading = false;

      }
    }
  }
}

