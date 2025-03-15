/*
  @(C): Entire Software
  @Type: candidate-resume.component.html
  @Who: Renu
  @When: 12-Aug-2021
  @Why: EWM-2241 EWM-2493
  @What:  This page will be use for candidate resume Component ts file
*/

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UploadNewResumeComponent } from './upload-new-resume/upload-new-resume.component';
import * as FileSaver from 'file-saver';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { FilePreviwerPopupComponent } from 'src/app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { DocumentService } from '@app/shared/services/candidate/document.service';

enum fileExtention{
  "application/zip"="zip",
  "application/pdf"="pdf",
  "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"="xlsx",
  "text/plain"="txt",
  "application/vnd.ms-word"="doc",
  "application/vnd.ms-excel"="xls",
  "image/png"="png",
  "image/jpeg"="jpeg",
  "image/gif"="gif",
  "text/csv"="csv"
}
@Component({
  selector: 'app-candidate-resume',
  templateUrl: './candidate-resume.component.html',
  styleUrls: ['./candidate-resume.component.scss'],
})

export class CandidateResumeComponent implements OnInit {

  public isLoading: boolean = true;
  public isParse: boolean = false;
  public isCoverPage:boolean = false;
  public isNewResumeLoading: boolean = true;
  public showNoResumeBox: boolean = true;
  public showUploadResumeBox: boolean = false;
  public showUploadedResume: boolean = false;
  public formtitle: string = 'grid';
  public loading: boolean;
  public gridView: any = [];
  @Input() candidateId: any;
  public userpreferences: Userpreferences;
  viewer = 'url';
  selectedType = 'docx';
  public DemoDoc: any;
  public showVersionHistory: boolean = false;
  public disableDownloadBtn: boolean;
  background20: any;
  public FileName: any;
  public ResumeUrl:any;
  public UploadFileName: any = ""
  public fileType:any ="";
  public FilePath:any = "";
  animationState = false;
  @Output() docFileUrlEmit = new EventEmitter<any>();
  dirctionalLang;
  positionMatTab: any;
  constructor(public dialog: MatDialog, private fb: FormBuilder, public candidateService: CandidateService,
    private snackBService: SnackBarService, private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService,private _services:DocumentService,
    private commonserviceService: CommonserviceService, private appSettingsService: AppSettingsService) {

  }

  ngOnInit(): void {
    //@who:priti @why:EWM-2973 @what:code commented because 'candidate id' is coming as input @when:28-sep-2021
    // this.routes.queryParams.subscribe((value) => {
    //   this.candidateId = value.CandidateId
    // });
    this.fetchVersionHistory('onload');
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);
    

    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
       this.positionMatTab=res;
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
   @Name: onCancel function
   @Who: Renu
   @When: 14-Aug-2021
   @Why: ROST-2493
   @What: on click cancel pop-up button file
 */
  onCancel() {
    // this.showNoResumeBox = true;
    // this.showUploadedResume = false;
  }


  /*
   @Type: File, <ts>
   @Name: onDownloadResume function
   @Who: Renu
   @When: 14-Aug-2021
   @Why: ROST-2493
   @What: on click doanload button
 */

  // onDownloadResume(url: any, FileName: any) {   
  //   console.log('FileName',FileName);

  //   // this.showNoResumeBox = false;
  //   // this.showUploadedResume = true;
  //   FileSaver.saveAs(url, FileName);
  // }

  onDownloadResume(UploadFileName,FilePath)
  {    
    this.loading=true;
    this._services.downloadResumeFolder(FilePath)?.subscribe(  
      (data:any)=>{        
     const Url= URL.createObjectURL(data)
      const fileExt=fileExtention[data.type];
      let fileName=UploadFileName+'.'+fileExt;
      this.loading=false;
      this.downloadFile(data,fileName);
      }
    );
  }
  private downloadFile(data,filename) {
    const downloadedFile = new Blob([data], { type: data.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = filename;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
}
  /*
   @Type: File, <ts>
   @Name: openUploadResumeBox function
   @Who: Renu
   @When: 14-Aug-2021
   @Why: ROST-2493
   @What: on upload resume box
 */
  openUploadResumeBox() {
    const dialogRef = this.dialog.open(UploadNewResumeComponent, {
      data: this.candidateId,
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
          if(this.fileType=='PDF' || this.fileType=='pdf'){                 
            this.viewer = 'url';
          }else{
            this.viewer = 'office';
          }  
        this.isNewResumeLoading = false;
        this.showUploadedResume = true;
        this.showVersionHistory = false;
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
     @Who: Renu
     @When: 14-Aug-2021
     @Why: ROST-2493
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
              this.fileType = list[list.length - 1];            
                if(this.fileType=='PDF' || this.fileType=='pdf'){                 
                  this.viewer = 'url';
                }else{
                  this.viewer = 'office';
                }             
              this.docFileUrlEmit.emit({ url: this.DemoDoc, FileName: this.UploadFileName });
              this.loading = false;
            }
          }else{
            this.showVersionHistory = true;
            this.showUploadedResume = false;
          }
        } else if (repsonsedata.HttpStatusCode == 204) {
          this.isNewResumeLoading = true;
          this.showNoResumeBox = true;
          this.showUploadedResume = false;
          this.disableDownloadBtn = true;
          this.loading = false;
          this.docFileUrlEmit.emit(false);
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
   @Name: viewResume function
   @Who: Renu
   @When: 14-Aug-2021
   @Why: ROST-2532
   @What: on fetch resume based on individaul records
 */

  viewResume(url: any) {
    // this.isLoading=true;
    // this.DemoDoc=url;
    // this.showUploadedResume=true;
    // this.showVersionHistory=false;
    // this.showNoResumeBox=false;

    // const list = url.split('.');
    // const fileType = list[list.length - 1];
    // if(fileType=='PDF' || fileType=='pdf'){
    //   this.isLoading=true;
    //   this.DemoDoc=url;
    //   this.showUploadedResume=true;
    //   this.showVersionHistory=false;
    //   this.showNoResumeBox=false;
    // }else{
    window.open(url, '_blank');
    //    }

  }
    /*
      @(C): Entire Software
      @Type: File, <ts>
      @Who: maneesh
      @When: 25-may-2022
      @Why: EWM-5839-EWM-5872
      @What:  showResume created for open popup reason 
  */
showResume(ResumeUrl,FileName){
  var filename = ResumeUrl?.split('.').pop(); 
  let fname = 'resume.'+filename;
  const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {  
    data: new Object({ResumeUrl:ResumeUrl,FileName:FileName?FileName:fname}),
    panelClass: ['xeople-modal-full-screen', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {    
    }
  });

  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

}

  getResumeInfo(event) {
    if (event == false) {
      this.isNewResumeLoading = true;
    } else {
      this.FileName = event.FileName;
      this.DemoDoc = event.url;
      this.isNewResumeLoading = false;
    }
  }


  selectedTabValue(tab) {  
    let labelName = tab.index;
    if (labelName === 1) {     
      this.isParse = true;
      this.isCoverPage = false;
      this.showUploadedResume = false;
    }else if(labelName === 2){     
      this.isParse = false;
      this.isCoverPage = true;
      this.showUploadedResume = false;
    } else {  
      this.fetchVersionHistory('onload');
      this.isParse = false;
      this.isCoverPage = false;
      this.showUploadedResume = true;
    }
  }



  /*
  @Type: File, <ts>
  @Name: parseResume
  @Who: Suika
  @When: 13-Dec-2021
  @Why: EWM-4147
  @What: parse resume  list for candidate
*/
  parseResume() {
    let FileObj = {};
    this.isNewResumeLoading = true;
    this.loading = true;
    FileObj['FileName'] = this.UploadFileName;
    FileObj['FilePath'] = this.FilePath;
    FileObj['CandidateId'] = this.candidateId;
    this.candidateService.parseResume(FileObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.isNewResumeLoading = false;
          this.loading = false;
          //this.getResumeByCandidateId();
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.isNewResumeLoading = false;
          this.loading = false;
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
}
