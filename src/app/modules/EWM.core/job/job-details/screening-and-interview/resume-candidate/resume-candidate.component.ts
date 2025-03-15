import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as FileSaver from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { UploadNewResumeComponent } from '../../../../../../../../src/app/modules/EWM-Candidate/profile-summary/candidate-resume/upload-new-resume/upload-new-resume.component';
import { UserpreferencesService } from '../../../../../../../../src/app/shared/services/commonservice/userpreferences.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { CandidateService } from '../../../../../../../../src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ActivatedRoute } from '@angular/router';
import { ResponceData, Userpreferences } from '../../../../../../../../src/app/shared/models';
import { SnackBarService } from '../../../../../../../../src/app/shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from '../../../../../../../../src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from '../../../../../../shared/services/app-settings.service';
import { UploadCoverPageComponent } from 'src/app/modules/EWM-Candidate/profile-summary/cover-page/upload-cover-page/upload-cover-page.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-resume-candidate',
  templateUrl: './resume-candidate.component.html',
  styleUrls: ['./resume-candidate.component.scss']
})
export class ResumeCandidateComponent implements OnInit {
  public showUploadedResume: boolean = false;
  public isLoading: boolean = true;
  public isParse: boolean = false;
  public isNewResumeLoading: boolean = true;
  public showNoResumeBox: boolean = true;
  public showUploadResumeBox: boolean = false;
  public formtitle: string = 'grid';
  public loading: boolean;
  public gridView: any = [];
  public DemoDoc: any;
  public FileName: any;
  public ResumeUrl: any;
  public FilePath: any = "";
  public UploadFileName: any = ""
  public fileType: any = "";
  viewer = 'url';
  public disableDownloadBtn: boolean;
  background20: any;
  public showVersionHistory: boolean = false;
  public IsCover: boolean = false;
  DemoDocCover: any;
  PreviewUrl: any;
  CoverLetterURL: any;



  @Output() docFileUrlEmit = new EventEmitter<any>();

  @Input() candidateId: any;
  public userpreferences: Userpreferences;
  positionMatTab: any;

  constructor(public dialog: MatDialog, private fb: FormBuilder, public candidateService: CandidateService,
    private snackBService: SnackBarService, private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService,
    private commonserviceService: CommonserviceService, private appSettingsService: AppSettingsService) { }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);

    this.fetchVersionHistory('onload');

    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab = res;
    });

  }


  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  /*
    @Type: File, <ts>
    @Name: onDownloadResume function
    @Who: Bantee Kumar
    @When: 20-Feb-2023
    @Why: EWM-10602
    @What: on click doanload button
  */
  onDownloadResume(url: any, FileName: any) {

    FileSaver.saveAs(url, FileName);
  }

  /*
   @Type: File, <ts>
   @Name:selectedTabValue function
   @Who: Bantee Kumar
   @When: 20-Feb-2023
   @Why: EWM-10602
   @What: on select tab
 */
  selectedTabValue(tab) {
    let labelName = tab.index;

    if (labelName === 0) {
      this.IsCover = false;
      this.showUploadedResume = true;
      this.fetchVersionHistory('onload');

    } else {
      this.getCoverPageDeatils('onload')
      this.showUploadedResume = false;
    }
  }
  /*
     @Type: File, <ts>
     @Name: openUploadResumeBox function
     @Who: Bantee Kumar
     @When: 20-Feb-2023
     @Why: EWM-10602
     @What: on upload resume box
   */

  openUploadResumeBox() {
    const dialogRef = this.dialog.open(UploadNewResumeComponent, {
      data: new Object({ candId: this.candidateId, isActive: 0 }),
      panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.isLoading = false;
        this.DemoDoc = res.data;
        this.FileName = res.UploadFileName;
        this.ResumeUrl = res.ResumeUrl;
        this.FilePath = res.filePath;
        this.UploadFileName = res.UploadFileName;
        const list = this.DemoDoc.split('.');
        this.fileType = list[list.length - 1];
        if (this.fileType == 'PDF' || this.fileType == 'pdf') {
          this.viewer = 'url';
        } else {
          this.viewer = 'office';
        }
        this.isNewResumeLoading = false;
        this.showUploadedResume = true;
        this.showNoResumeBox = false;
        this.disableDownloadBtn = false;
        this.docFileUrlEmit.emit({ url: this.DemoDoc, FileName: this.UploadFileName });
      } else {
        this.isLoading = false;
      }

      // this.showUploadedResume=true;
      // this.showVersionHistory=false;
      // this.DemoDoc=res.data;
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Bantee Kumar
   @When: 20-Feb-2023
   @Why: EWM-10602
   @What:  showResume created for open popup reason 
*/
  showResume(ResumeUrl, FileName) {

    window.open(ResumeUrl, '_blank');
  }
  /*
      @Type: File, <ts>
      @Name: fetchVersionHistory function
      @Who: Bantee Kumar
      @When: 20-Feb-2023
      @Why: EWM-10602
      @What: on fetch resume history
    */
  fetchVersionHistory(callMethod: string) {
    if (callMethod == 'onload') {
      this.loading = true;
    } else {
      this.loading = false;
      this.isLoading = true;
    }
    this.candidateService.fetchCandidateVersionHistory("?candidateId=" + this.candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.gridView = repsonsedata.Data;
          this.FilePath = repsonsedata.Data[0].FileName;
          if (callMethod == 'onload') {
            this.showVersionHistory = false;
            if (this.gridView.length == 0) {
              this.isNewResumeLoading = true;
              this.showNoResumeBox = true;
              this.showUploadedResume = false;
              this.disableDownloadBtn = true;
              this.loading = false;
              this.isLoading = false;

              this.docFileUrlEmit.emit(false);
            } else {
              this.isNewResumeLoading = false;
              this.showNoResumeBox = false;
              this.showUploadedResume = true;
              this.disableDownloadBtn = false;
              this.DemoDoc = this.gridView[0]?.ResumeUrl;
              this.ResumeUrl = this.gridView[0]?.ResumeUrl;
              this.FileName = this.gridView[0]?.FileName;
              this.UploadFileName = this.gridView[0]?.UploadFileName;
              const list = this.gridView[0]?.FileName?.split('.');
              if (list != undefined) {
                this.fileType = list[list.length - 1];
                if (this.fileType == 'PDF' || this.fileType == 'pdf') {
                  this.viewer = 'url';
                } else {
                  this.viewer = 'office';
                }
              }
              this.docFileUrlEmit.emit({ url: this.DemoDoc, FileName: this.UploadFileName });
              this.loading = false;
            }
          } else {
            this.showVersionHistory = true;
            this.showUploadedResume = false;
          }
        } else if (repsonsedata.HttpStatusCode == 204) {
          this.isNewResumeLoading = true;
          this.showNoResumeBox = true;
          this.showUploadedResume = false;
          this.disableDownloadBtn = true;
          this.loading = false;
          this.isLoading = false;

          this.docFileUrlEmit.emit(false);
        } else {
          this.isNewResumeLoading = true;
          this.showVersionHistory = true;
          this.showNoResumeBox = false;
          this.showUploadedResume = false;
          this.loading = false;
          this.isLoading = false;

        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
  @Type: File, <ts>
  @Name: showCoverletter function
  @Who: Bantee Kumar
  @When: 17-Feb-2023
  @Why: EWM.10602
  @What: on click showCoverletter for open new window 
*/
  showCoverletter(PreviewUrl, CoverLetterURL) {

    window.open(PreviewUrl, '_blank');
  }


  /*
  @Type: File, <ts>
  @Name: onDownloadCoverPage function
  @Who: Bantee Kumar
  @When: 17-Feb-2023
  @Why: EWM.10602
  @What: on click onDownloadCoverPage button
*/
  onDownloadCoverPage(url: any, FileName: any) {
    FileSaver.saveAs(url, FileName);
  }

  /*
 @Type: File, <ts>
 @Name: getCoverPageDeatils function
 @Who: Bantee Kumar
 @When: 17-Feb-2023
 @Why: EWM.10602
 @What: on fetch Cover Page Deatils history
*/
  getCoverPageDeatils(callMethod: string) {
    if (callMethod == 'onload') {
      this.loading = true;
      this.isLoading = true;

    } else {
      this.loading = false;
      this.isLoading = true;
    }
    this.candidateService.fetchCoverDetails("?UserTypeId=" + this.candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        // console.log(repsonsedata);
        if (repsonsedata.HttpStatusCode === 200) {
          this.gridView = repsonsedata.Data;
          this.FilePath = repsonsedata.Data[0]?.FileName;
          this.IsCover = false;
          this.loading = false;


          if (callMethod == 'onload') {
            this.showVersionHistory = false;
            if (this.gridView.length == 0) {
              this.isNewResumeLoading = true;
              this.showNoResumeBox = true;
              this.showUploadedResume = false;
              this.disableDownloadBtn = true;
              this.loading = false;
              this.isLoading = false;

              this.docFileUrlEmit.emit(false);
            } else {
              this.isNewResumeLoading = false;
              this.showNoResumeBox = false;
              this.showUploadedResume = true;
              this.disableDownloadBtn = false;
              this.DemoDocCover = this.gridView[0]?.PreviewUrl;
              this.PreviewUrl = this.gridView[0]?.PreviewUrl;
              this.CoverLetterURL = this.gridView[0]?.CoverLetterURL;
              this.UploadFileName = this.gridView[0]?.ActualFileName;
              const list = this.CoverLetterURL?.split('.');
              if (list != undefined) {
                this.fileType = list[list.length - 1];
                if (this.fileType == 'PDF' || this.fileType == 'pdf') {
                  this.viewer = 'url';
                } else {
                  this.viewer = 'office';
                }
              }
              this.docFileUrlEmit.emit({ url: this.DemoDocCover, FileName: this.UploadFileName });
              this.loading = false;
            }
          } else {
            this.showVersionHistory = true;
            this.showUploadedResume = false;
          }
        } else if (repsonsedata.HttpStatusCode == 204) {
          this.isNewResumeLoading = true;
          this.showNoResumeBox = true;
          this.showUploadedResume = false;
          this.disableDownloadBtn = true;
          this.loading = false;
          this.isLoading = false;

          this.docFileUrlEmit.emit(false);
          this.IsCover = true;
        } else {
          this.isNewResumeLoading = true;
          this.showVersionHistory = true;
          this.showNoResumeBox = false;
          this.showUploadedResume = false;
          this.loading = false;
          this.IsCover = false;
          this.isLoading = false;

        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Type: File, <ts>
  @Name: openUploadCovePage function
  @Who: Bantee Kumar
  @When: 20-Feb-2023
  @Why:EWM.10602
  @What: on upload cover page
*/
  openUploadCovePage() {
    const dialogRef = this.dialog.open(UploadCoverPageComponent, {
      data: new Object({ candId: this.candidateId, isActive: 0 }),
      panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.getCoverPageDeatils('onload');
      } else {
        this.isLoading = false;
      }
    })
  }


}
