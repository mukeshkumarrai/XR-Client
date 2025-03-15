import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UploadCoverPageComponent } from './upload-cover-page/upload-cover-page.component';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CoverPageVersionHistoryComponent } from './cover-page-version-history/cover-page-version-history.component';
import { CoverPageRenameComponent } from './cover-page-rename/cover-page-rename.component';
import { CoverPageViewDetailsComponent } from './cover-page-view-details/cover-page-view-details.component';
import { CreateFolderComponent } from '../../candidate-document/create-folder/create-folder.component';
import { ButtonTypes } from 'src/app/shared/models';
import * as FileSaver from 'file-saver';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-cover-page',
  templateUrl: './cover-page.component.html',
  styleUrls: ['./cover-page.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition("* => void", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ])
    ]),
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class CoverPageComponent implements OnInit {
  public isLoading: boolean = true;
  public loading: boolean = false;
  public loadingscroll: boolean = false;
  public DemoDoc: any;
  public showVersionHistory: boolean = false;
  public isNewResumeLoading: boolean = true;
  public showNoResumeBox: boolean = true;
  public showUploadResumeBox: boolean = false;
  public showUploadedResume: boolean = false;
  public disableDownloadBtn: boolean = false;
  public showCoverPage: boolean = false;
  public background20: any;
  public FileName: any;
  public ResumeUrl: any;
  public UploadFileName: any = ""
  public fileType: any = "";
  public gridView: any = [];
  viewer = 'url';
  public formtitle: string = 'grid';
  public userpreferences: Userpreferences;
  @Input() candidateId: any;
  public JobTitleList: any;
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';
  pageOption: any;
  public sortingValue: string = "JobTitle,desc";
  public viewMode: string;
  animationState = false;
  public versionId: any;
  public versionCoverName: any;
  animationVar: any;
  public ActualFileName: any;
  dirctionalLang;
  constructor(public dialog: MatDialog, private fb: FormBuilder, public candidateService: CandidateService,
    private snackBService: SnackBarService, private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService) {
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = appSettingsService.pagesize;
  }

  ngOnInit(): void {
    this.getCoverPageDeatils();
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);
    this.animationVar = ButtonTypes;

  }


  /* 
@Type: File, <ts>
@Name: animate delaAnimation function
@Who: Amit Rajput
@When: 19-Jan-2022
@Why: EWM-4368 EWM-4526
@What: creating animation
*/

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
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
   @Name: openUploadCovePage function
   @Who: Suika
   @When: 13-May-2022
   @Why: ROST-6720
   @What: on upload cover page
 */
  openUploadCovePage() {
    const dialogRef = this.dialog.open(UploadCoverPageComponent, {
      data: new Object({ candId: this.candidateId, isActive: 1, pageName: "CAND" }),
      panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        /*  this.isLoading = false;
          this.DemoDoc = res.data;
          this.FileName = res.UploadFileName;
          this.ResumeUrl = res.ResumeUrl;
          this.UploadFileName = res.UploadFileName;
          const list = this.DemoDoc.split('.');
          this.fileType = list[list.length - 1];            
            if(this.fileType=='PDF' || this.fileType=='pdf'){                 
              this.viewer = 'url';
            }else{
              this.viewer = 'office';
            }  
          this.isNewResumeLoading = false;
          this.showUploadedResume = true;
          this.showVersionHistory = false;
          this.showNoResumeBox = false;
          this.disableDownloadBtn = false;*/
        this.getCoverPageDeatils();
      } else {
        this.isLoading = false;
      }
    })

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }


  /*
      @Type: File, <ts>
      @Name: fetchVersionHistory function
      @Who: Suika
      @When: 13-May-2022
      @Why: ROST-6720
      @What: on fetch resume history
    */
  getCoverPageDeatils() {
    this.loading = true;
    this.candidateService.fetchCoverDetails("?UserTypeId=" + this.candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.gridView = repsonsedata.Data;
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode == 204) {
          this.gridView = [];
          this.isNewResumeLoading = true;
          this.showNoResumeBox = true;
          this.showUploadedResume = false;
          this.disableDownloadBtn = true;
          this.loading = false;
          // this.docFileUrlEmit.emit(false);
        } else {
          this.isNewResumeLoading = true;
          this.showVersionHistory = true;
          this.showNoResumeBox = false;
          this.showUploadedResume = false;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }




  /*
 @Type: File, <ts>
 @Name: deleteCoverPage
 @Who: Suika
 @When: 16-May-2022
 @Why: EWM-6605 EWM-6720
 @What: delete confirmation to cover page
*/

  deleteCoverPage(data: any) {
    let ContactsObj = {};
    ContactsObj = data;
    const message = 'label_titleDialogContent';
    const title = 'label_deleteMessage';
    const subTitle = 'label_dataofCoverPage';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
      // alert(dialogResult);
      if (dialogResult == true) {
        this.candidateService.deleteCoverPage(ContactsObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.getCoverPageDeatils();
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else if (data.HttpStatusCode == 400) {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.loading = false;
      }
    });
  }


  showCoverLetter(coverData) {
    this.ActualFileName = coverData.ActualFileName
    this.versionId = coverData.Id;
    this.versionCoverName = coverData.Name;
    this.DemoDoc = coverData.PreviewUrl;
    const list = coverData?.CoverLetterURL?.split('.');
    this.fileType = list[list?.length - 1];
    if (this.fileType == 'PDF' || this.fileType == 'pdf') {
      this.viewer = 'url';
    } else {
      this.viewer = 'office';
    }
    this.showCoverPage = true;
  }


  openVersionHistory(Id, Name) {
    const dialogRef = this.dialog.open(CoverPageVersionHistoryComponent, {
      data: { Id: Id, Name: Name },
      panelClass: ['xeople-modal-lg', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.status != false) {
        this.isLoading = false;
        // console.log(res,"res");
      } else {
        this.isLoading = false;
      }
      if (res.coverData != undefined) {
        this.showCoverLetter(res.coverData);
      }
    })
  }



  openCoverPageViewDetails(Id) {
    const dialogRef = this.dialog.open(CoverPageViewDetailsComponent, {
      data: { Id: Id },
      panelClass: ['xeople-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    })
  }


  backtoList() {
    this.showCoverPage = false;
    this.ActualFileName = null;
  }


  OpenRenameFolderPopUp(Id, Name, JobId, Type) {
    const dialogRef = this.dialog.open(CoverPageRenameComponent, {
      data: {
        header: 'label_rename',
        label: 'label_file/folder',
        btnlabel: 'label_rename',
        folderId: Id,
        candidateId: this.candidateId,
        JobId: JobId == undefined ? 0 : JobId,
        name: Name,
        type: Type
      },
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult != false) {
        dialogResult.UserTypeId = this.candidateId;
        dialogResult.PageName = "candidate";
        dialogResult.BtnId = "rename";
        dialogResult.JobId = dialogResult.JobId == 0 ? '00000000-0000-0000-0000-000000000000' : JobId;
        if (Id != undefined) {
          dialogResult.Id = Id;
        }
        this.candidateService.renameCoverPage(dialogResult).subscribe(
          (Res: ResponceData) => {
            if (Res.HttpStatusCode == 200) {
              this.getCoverPageDeatils();
              //this.updatedata.emit(false);
            }
          });
      }
    });
  }



  /*
    @Type: File, <ts>
    @Name: onDownloadResume function
    @Who: Suika
    @When: 22-May-2022
    @Why: ROST-6605,EWM-6720
    @What: on click doanload button
  */
  onDownloadCoverPage(url: any, FileName: any) {
    // console.log("FileName ",FileName);
    //  console.log("url ",url);
    FileSaver.saveAs(url, FileName);
  }

}
