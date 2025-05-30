import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ResponceData } from 'src/app/shared/models';
import { DocumentsModel } from 'src/app/shared/models/documents';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import * as FileSaver from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { FilePreviwerPopupComponent } from 'src/app/modules/EWM.core/job/screening/file-previwer-popup/file-previwer-popup.component';
import { ShareDocumentComponent } from 'src/app/modules/EWM-Candidate/candidate-document/share-document/share-document.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DocumentShareableLinkComponent } from 'src/app/modules/EWM-Candidate/candidate-document/document-shareable-link/document-shareable-link.component';
import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { DisconnectEmailComponent } from 'src/app/shared/modal/disconnect-email/disconnect-email.component';
import { ViewDocumentComponent } from 'src/app/modules/EWM-Candidate/candidate-document/view-document/view-document.component';
import { JobScreening } from 'src/app/shared/models/job-screening';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-job-candidate-documents',
  templateUrl: './job-candidate-documents.component.html',
  styleUrls: ['./job-candidate-documents.component.scss']
})
export class JobCandidateDocumentsComponent implements OnInit {
  DocumentsModel: DocumentsModel[];
  BackToMainDocList = [];
  DocumentsDataSubscription: Subscription;
  DocumentsDataByServiceSubscription: Subscription;
  loading: boolean;
  sortingValue: string = 'Name,asc';/*-@who: Nitin Bhati,@why:EWM-14909,@when: 25-10-2023-*/
  CandidateId: string;
  documentTypeOptions: any = [];
  doubleClickStatus: boolean;
  PreviewUrl: string;
  docsLoading: boolean;
  viewer = 'url';
  public disableDownloadBtn: boolean;
  public dirctionalLang: string;
  UploadFileName: string;
  public showUploadedResume: boolean = false;
  documentData: any = [];
  candidateId: string;
  candidateName: string;
  documentFor: string;
  docStatus: boolean = false;
  public showHideDocumentButtons: boolean = false;
  fileType: string;
  UploadDocument: string;
  searchDocument: string;
  backBtnStatus: boolean = false;
  breadcrumbs = [];
  public snglcount: number = 0;
  documentId: number = 0;
  PreviousDocumentId: number = 0;
  @Input() jobId: string;
  DocumentsViewDocsSubscription: Subscription;
  @Input() jobActionTabName:string;
  loadingImage: boolean;
  WorkFlowId: string='00000000-0000-0000-0000-000000000000';
  JobTitle: string;
  statusViewDoc: boolean;
  constructor(private translateService: TranslateService, public snackBService: SnackBarService, private _DocumentService: DocumentService,
    private appSettingsService: AppSettingsService, private commonserviceService: CommonserviceService, public dialog: MatDialog, private http: HttpClient,private routes: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    });
    this.DocumentsDataByServiceSubscription = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
        let candidateList = res?.SelectedCandidate;
         if (candidateList?.length > 0 && this.jobId) {
          this.doubleClickStatus = false;
          this.backBtnStatus = false;
          this.candidateId = candidateList[0]?.CandidateId;
          this.candidateName = candidateList[0]?.CandidateName;
          this.WorkFlowId= candidateList[0]?.WorkFlowId;
          this.JobTitle= candidateList[0]?.JobTitle;
          this.breadcrumbs = [];
          this.documentFor= 'Candidate';
          if(this.jobActionTabName?.toLowerCase()=='candidate' && this.jobId){
          this.getCandidateDocuments(this.candidateId);
          }
        }
      });
  }
  /*
   @Type: File, <ts>
   @Name: getCandidateDocuments
   @Who: Nitin Bhati
   @When: 24-08-2023
   @Why: EWM-13937
   @What: Api call for documents data
   */
  getCandidateDocuments(Id: string) {
    this.loading = true;
    this.DocumentsDataSubscription = this._DocumentService.getJobActionDocuemnt(this.sortingValue, Id).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.BackToMainDocList = repsonsedata?.Data;
          let DocumentsModel = repsonsedata?.Data;
          DocumentsModel.forEach(element => {
            const list = element?.UploadDocument?.split('.');
            const fileType = list[list?.length - 1];
            element['FileExtention'] = fileType;
          });
          this.DocumentsModel = DocumentsModel;
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.DocumentsModel = repsonsedata?.Data;
        } else {
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
  /*
      @Type: File, <ts>
      @Name: eventEmitSingleClick function
      @Who: Nitin Bhati
      @When: 25-Aug-2023
      @Why: EWM-13937
      @What: on click doanload button
    */
  eventEmitSingleClick(documentsData: any) {
    this.documentData = documentsData;
    this.doubleClickStatus = false;
    this.docStatus = false;
    if (documentsData?.DocumentType?.toLowerCase() == 'document') {
      if (this.PreviousDocumentId == documentsData?.Id) {
        this.showHideDocumentButtons = false;
        this.documentId = 0;
        this.PreviousDocumentId = 0;
      } else {
        this.PreviousDocumentId = documentsData?.Id;
        this.documentId = documentsData?.Id;
        this.PreviewUrl = documentsData?.PreviewUrl;
        this.showHideDocumentButtons = true;
        const list = documentsData?.UploadDocument?.split('.');
        this.fileType = list[list?.length - 1];
        if(this.fileType.toLowerCase()=='zip' || this.fileType.toLowerCase()=='rar'){ /*-@when:10:10:2023,@who:Nitin Bhati,@why:14328-*/
          this.statusViewDoc=false;
         }else{
          this.statusViewDoc=true;
        }
      }
    } else {
      this.backBtnStatus = true;
      this.showHideDocumentButtons = false;
      let DocumentsModelChildren: any = [];
      DocumentsModelChildren = this.DocumentsModel?.filter(x => x['Id'] === documentsData?.Id);
      //this.DocumentsModel = DocumentsModelChildren[0]?.Children;
      let DocumentsModelChild = DocumentsModelChildren[0]?.Children;
      DocumentsModelChild.forEach(element => {
        const list = element?.UploadDocument?.split('.');
        const fileType = list[list?.length - 1];
        element['FileExtention'] = fileType;
      });
      this.DocumentsModel = DocumentsModelChild;
      this.breadcrumbs.push({
        'Id': documentsData?.Id,
        'FolderName': documentsData?.Name,
        'documentsData': documentsData,
      });
    }
  }
  /*
     @Type: File, <ts>
     @Name: eventEmitDoubleClick function
     @Who: Nitin Bhati
     @When: 25-Aug-2023
     @Why: EWM-13937
     @What: on click doanload button
   */
  eventEmitDoubleClick(PreviewUrl: string, FileName: string, UploadDocument: string) {
    this.loading=true;
    this.docsLoading = true;
    this.backBtnStatus = false;
    this.loadingImage=true;
    const list = UploadDocument?.split('.');
    this.fileType = list[list?.length - 1];
    if (this.fileType?.toLowerCase() == 'jpg' || this.fileType?.toLowerCase() == 'png'  || this.fileType?.toLowerCase() == 'jpeg' || this.fileType?.toLowerCase() == 'gif') {
      this.PreviewUrl = PreviewUrl;
      this.docStatus = false;
      this.getOpenSceen(UploadDocument,FileName);
    } else if (this.fileType?.toLowerCase() == 'pdf') {
      this.viewer = 'url';
      this.docStatus = true;
      this.PreviewUrl = PreviewUrl;
      this.getOpenSceen(UploadDocument,FileName);
    }else if (this.fileType?.toLowerCase() == 'zip' || this.fileType?.toLowerCase() == 'rar') {/*-@when:10:10:2023,@who:Nitin Bhati,@why:14328-*/
      this.downloadData();
    } else {
      this.viewer = 'office';
      this.docStatus = true;
      this.PreviewUrl = PreviewUrl;
      this.getOpenSceen(UploadDocument,FileName);
    }
    // setTimeout( () => this.loadingImage = false, 1500);
    // this.UploadDocument = UploadDocument;
    // this.UploadFileName = FileName;
    // this.showUploadedResume = true;
    // this.docsLoading = false;
    // this.doubleClickStatus = true;
    // this.disableDownloadBtn = false;
    // this.loading=false;

  }
  getOpenSceen(UploadDocument,FileName){
    setTimeout( () => this.loadingImage = false, 1500);
    this.UploadDocument = UploadDocument;
    this.UploadFileName = FileName;
    this.showUploadedResume = true;
    this.docsLoading = false;
    this.doubleClickStatus = true;
    this.disableDownloadBtn = false;
    this.loading=false;
  }
  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: Nitin Bhati
   @When: 25-Aug-2023
   @Why: EWM-13937
   @What:  showDocument created for open popup
*/
  showDocument(PreviewUrl: string, DownloadDocumentName: string) {
    const dialogRef = this.dialog.open(FilePreviwerPopupComponent, {
      data: new Object({ ResumeUrl: PreviewUrl, FileName: DownloadDocumentName, TabName: 'Document' }),
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
        this.loading = false;
      }
    });
  }

  /*
     @Type: File, <ts>
     @Name: onDownloadResume function
     @Who: Nitin Bhati
     @When: 25-Aug-2023
     @Why: EWM-13937
     @What: on click doanload button
   */
  onDownloadResume(PreviewUrl: string, FileName: string) {
    FileSaver.saveAs(PreviewUrl, FileName);
  }
  /*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Nitin Bhati
  @When: 05-Sep-2023
  @Why: EWM-13937
  @What: on click dismiss
*/
  public onDismiss() {
    if (this.breadcrumbs?.length > 0) {
      this.backBtnStatus = true;
    }
    this.doubleClickStatus = false;
  }

  /*
   @Type: File, <ts>
   @Name: internalShareDocument
   @Who: Nitin Bhati
   @When: 25-Aug-2023
   @Why: EWM-13937
   @What: To Internal share document as an attachment.
   */
  internalShareDocument() {
    //by maneesh what: ewm-16845 for redirect document tab in candidate change tabindex when:14/05/2024
    let internalShareLink = '/client/cand/candidate/candidate?CandidateId=' + this.candidateId + '&Type=' + 'CAND' + '&cantabIndex=' + 9;
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ShareDocumentComponent, {
      data: new Object({ documentData: this.documentData, candidateId: this.candidateId, candidateName: this.candidateName, jobId: this.jobId,shareData:true,internalShareLink:internalShareLink}),
      panelClass: ['xeople-modal', 'share-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.loading = false;
      }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  /*
    @Type: File, <ts>
    @Name: onSharableLink
    @Who: Nitin Bhati
    @When: 25-Aug-2023
    @Why: EWM-13937
    @What: To On External Share document as an attachment.
    */
  onSharableLink() {
    this._DocumentService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.shareableLinkPopup(this.documentData?.Id, this.documentData?.Name, this.documentData?.DocumentType);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }
  /*
   @Type: File, <ts>
   @Name: shareableLinkPopup
   @Who: Nitin Bhati
   @When: 25-Aug-2023
   @Why: EWM-13937
   @What: To On External Share document as an attachment.
   */
  shareableLinkPopup(Id: number, DocumentName: string, documentType: string) {
    const dialogRef = this.dialog.open(DocumentShareableLinkComponent, {
      data: { candidateId: this.candidateId, DocumentId: Id, documentType: documentType, jobId: this.jobId },
      panelClass: ['xeople-modal', 'quick-modalbox', 'add_shareableLink', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (!dialogResult) {
        return;
      }
      else {
        dialogResult.DocumentId = Id;
        dialogResult.PageName = "DocumentShareable";
        dialogResult.BtnId = "attachments-tab";
        dialogResult.CandidateId = this.candidateId;
        dialogResult.CandidateName = this.candidateName;
        dialogResult.DocumentName = DocumentName;
        dialogResult.DocumentType = documentType;
        this._DocumentService.pushShareableLink(dialogResult).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          });
      }
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }

  /*
 @Type: File, <ts>
 @Name: confirmShareAttachment
 @Who: Nitin Bhati
 @When: 25-Aug-2023
 @Why: EWM-13937
 @What: To confirm share document as an attachment.
 */
  confirmShareAttachment(): void {
    let docObj = {};
    docObj = this.documentData;
    docObj['LastModified'] = new Date(this.documentData?.LastActivity);
    docObj['PageName'] = 'candidate';
    docObj['BtnId'] = 'attachments-tab';
    const message = `label_titleDialogshareAttachment`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._DocumentService.getUserIsEmailConnected().subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              if (data?.Data?.IsEmailConnected == 1) {
                this.openNewEmailModal(this.documentData);
              } else {
                this.EmailNotIntegratedPopup();
              }
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  /*
 @Type: File, <ts>
 @Name: openNewEmailModal
 @Who: Nitin Bhati
 @When: 24-08-2023
 @Why: EWM-13937
 @What: For open Email Popup
 */
  openNewEmailModal(documentData: any) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      maxHeight: "100%",
      height: "100%",
      data: new Object({ documentData: documentData, candidateId: this.candidateId, openDocumentPopUpFor: this.documentFor, isBulkEmail: true, JobId: this.jobId, IsJobLog: 1, DocumentId: this.documentId,workflowId:this.WorkFlowId,JobTitle:this.JobTitle }),
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__slow', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
  }
  /*
@Type: File, <ts>
@Name: EmailNotIntegratedPopup
@Who: Nitin Bhati
@When: 25-Aug-2023
@Why: EWM-13937
@What: To confirm share document as an attachment.
*/
  EmailNotIntegratedPopup(): void {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(DisconnectEmailComponent, {
      maxWidth: '350px',
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }
  /*
    @Type: File, <ts>
    @Name: OpenViewPopUp
    @Who: Nitin Bhati
    @When: 24-08-2023
    @Why: EWM-13937
    @What: For view document
    */
  OpenViewPopUp() {
    const dialogRef = this.dialog.open(ViewDocumentComponent, {
      data: { Id: this.documentData?.Id, isExternal: false, jobId: this.jobId },
      panelClass: ['xeople-modal', 'view_Document', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.loading = false;
      }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  /*
    @Type: File, <ts>
    @Name: downloadData
    @Who: Nitin Bhati
    @When: 24-08-2023
    @Why: EWM-13937
    @What: For download document
    */
  downloadData() {
    this.loading = true;
    this._DocumentService.downloadData(this.documentData?.Id, this.jobId ? this.jobId : '00000000-0000-0000-0000-000000000000').subscribe(
      (data: any) => {
        let fileName = this.documentData?.Name + '.' + this.fileType;
        this.loading = false;
        this.downloadFile(data, fileName);
      }
    );
  }
  /*
  @Type: File, <ts>
  @Name: downloadFile
  @Who: Nitin Bhati
  @When: 24-08-2023
  @Why: EWM-13937
  @What: For download document with file name
  */
  private downloadFile(data: any, filename: string) {
    const downloadedFile = new Blob([data], { type: data?.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document?.body?.appendChild(a);
    a.download = filename;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document?.body?.removeChild(a);
  }
  /*
  @Type: File, <ts>
  @Name: previewDoc
  @Who: Nitin Bhati
  @When: 24-08-2023
  @Why: EWM-13937
  @What: For showing image i.e png or jpg using extenstion base
  */
  previewDoc() {
    this.doubleClickStatus = true;
    if (this.fileType?.toLowerCase() == 'jpg' || this.fileType?.toLowerCase() == 'png' || this.fileType?.toLowerCase() == 'jpeg' || this.fileType?.toLowerCase() == 'gif') {
      this.docStatus = false;
    } else if (this.fileType?.toLowerCase() == 'pdf') {
      this.viewer = 'url';
      this.docStatus = true;
      this.PreviewUrl = this.PreviewUrl;
    } else {
      this.viewer = 'office';
      this.docStatus = true;
      this.PreviewUrl = this.PreviewUrl;
    }
    this.getViewDocument();
  }
  /*
  @Type: File, <ts>
  @Name: manageCandidateDocument
  @Who: Nitin Bhati
  @When: 24-08-2023
  @Why: EWM-13937
  @What: For redirect to candidate summary document tabs
  */
  manageCandidateDocument() {
      let URL = '/client/cand/candidate/candidate?CandidateId=' + this.candidateId + '&Type=' + 'CAND' + '&cantabIndex=' + 9;
      window.open(URL, '_blank')
  }
  /*
  @Name: ngOnDestroy
  @Who: Nitin Bhati
  @When: 31-08-2023
  @Why: EWM-13937
  @What: to unsubscribe the document API
  */
  ngOnDestroy(): void {
    this.DocumentsDataSubscription?.unsubscribe();
    this.DocumentsDataByServiceSubscription?.unsubscribe();
    this.DocumentsViewDocsSubscription?.unsubscribe();
  }
  /*
  @Name: backToListDoc
  @Who: Nitin Bhati
  @When: 31-08-2023
  @Why: EWM-13937
  @What: For showing data after pressing back button
  */
  backToListDoc() {
    if (this.breadcrumbs?.length == 1) {
      this.backBtnStatus = false;
      this.breadcrumbs = [];
      this.DocumentsModel = this.BackToMainDocList;
    } else {
      this.backBtnStatus = true;
      let index = this.breadcrumbs?.length - 1
      this.breadcrumbs.splice(index, 1);
      this.DocumentsModel = this.breadcrumbs[index - 1]?.documentsData?.Children;
    }
  }
  /*
  @Name: getBreadcrumbs
  @Who: Nitin Bhati
  @When: 31-08-2023
  @Why: EWM-13937
  @What: For breadcrumb data
  */
  getBreadcrumbs(Id) {
    let breadcrumbsRemoveById = [];
    this.DocumentsModel = [];
    const index = this.breadcrumbs?.findIndex(x => x.Id === Id);
    this.breadcrumbs?.forEach((x, i) => {
      if (i <= index) {
        breadcrumbsRemoveById?.push(x);
      }
    });
    this.breadcrumbs = [...breadcrumbsRemoveById];
    this.DocumentsModel = this.breadcrumbs[0]?.documentsData?.Children;
  }
  /*
  @Name: getIconColor
  @Who: Nitin Bhati
  @When: 04-09-2023
  @Why: EWM-13937
  @What: For get icon Color
  */
  getIconColor(iconColor) {
    let FileTypeJson = this.documentTypeOptions?.filter(x => x['type'] === iconColor?.toLowerCase());
    let colorForIcon = FileTypeJson[0]?.iconColor;;
    return colorForIcon;
  }
  /*
  @Name: showingAllRecord
  @Who: Nitin Bhati
  @When: 04-09-2023
  @Why: EWM-13937
  @What: For showing all record by using bydefault breadcrum
  */
  showingAllRecord() {
    this.breadcrumbs = [];
    this.backBtnStatus = false;
    this.DocumentsModel = this.BackToMainDocList;
  }
  /*
  @Name: getViewDocument
  @Who: Nitin Bhati
  @When: 04-09-2023
  @Why: EWM-13937
  @What: For showing view details
  */
  getViewDocument() {
    this.loading = true;
    this.DocumentsViewDocsSubscription = this._DocumentService.getViewDocument(this.jobId, this.documentId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }

}
