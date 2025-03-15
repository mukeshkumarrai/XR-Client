/*
    @Type: File, <ts>
    @Name: Grid tree compnent 
    @Who: priti
    @When: 15-Sep-2021
    @Why: EWM-2380
    @What: to generate nth level grid withdata and event 
  */
    import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
    import { MatDialog } from '@angular/material/dialog';
    import { ResponceData, Userpreferences } from 'src/app/shared/models';
    import{ CreateNewDocumentComponent} from 'src/app/modules/EWM-Candidate/candidate-document/create-new-document/create-new-document.component';
    import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
    import{DocumentService}from 'src/app/shared/services/candidate/document.service';
    import { TranslateService } from '@ngx-translate/core';
    import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
    import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
    import {PdfViewerComponent} from 'src/app/modules/EWM-Candidate/candidate-document/pdf-viewer/pdf-viewer.component';
    import{ViewDocumentComponent} from 'src/app/modules/EWM-Candidate/candidate-document/view-document/view-document.component';
    import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
    import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
    import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
    import { EmmailnotintegratedComponent } from 'src/app/shared/modal/emmailnotintegrated/emmailnotintegrated.component';
    import { DisconnectEmailComponent } from 'src/app/shared/modal/disconnect-email/disconnect-email.component';
    import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
    import{DocumentShareableLinkComponent} from 'src/app/modules/EWM-Candidate/candidate-document/document-shareable-link/document-shareable-link.component';
    import { A } from '@angular/cdk/keycodes';
    import { fadeInRightBigAnimation } from 'angular-animations';
    import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
    import { ActivatedRoute, Router } from '@angular/router';
import { CreateFolderComponent } from '@app/modules/EWM-Candidate/candidate-document/create-folder/create-folder.component';
import { CreateDocumentComponent } from '@app/modules/EWM-Candidate/candidate-document/create-document/create-document.component';
import { VersionComponent } from '@app/modules/EWM-Candidate/candidate-document/version/version.component';
import { ShareDocumentComponent } from '@app/modules/EWM-Candidate/candidate-document/share-document/share-document.component';
import { ManageAccessComponent } from '@app/modules/EWM-Candidate/candidate-document/manage-access/manage-access.component';
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
  selector: 'app-job-grid-tree-view',
  templateUrl: './job-grid-tree-view.component.html',
  styleUrls: ['./job-grid-tree-view.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class JobGridTreeViewComponent implements OnInit {

  @Input() opened = false;
  @Input() treeNodelevel=0;
  @Input() folderName='';
  @Output() updatedata:EventEmitter<any> = new EventEmitter<any>();
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  public userpreferences: Userpreferences;
  @Input() gridView:any=[];
  loading:boolean=false;
  @Input() candidateId:any;
  @Input() documentFor:any;
  public candidateName:any;
  auditParameter: string;
  isCollapse:boolean=false;
  @Input() isShowtoggle:boolean;
  pageNo: number=1;
  pageSize: number;
  sortingValue: string='Name,asc';
  logedInUserName: any;
  progress: number;
  maxTrreNodeLevel:number=3;
  documentTypeOptions:any;
  activatedRoute:any;
  dirctionalLang;
  iconFileType
  background70: any;
    // animate and scroll page size
    pageOption: any;
    animationState = false;
    // animate and scroll page size
  constructor(public _userpreferencesService: UserpreferencesService,public dialog: MatDialog, public candidateService:CandidateService,
    private _services:DocumentService,private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService,private http: HttpClient, private appSettingsService:AppSettingsService,private router:Router,private routes: ActivatedRoute,private route: Router) {
         // page option from config file
         this.pageOption = this.appSettingsService.pageOption;
         // page option from config file
      this.pageSize = this._appSetting.pagesize;
      this.maxTrreNodeLevel=_appSetting.maxleveloftreenode;
       /*
        @Type: File, <ts>
        @Name: Json file 
        @Who: Nitin Bhati
        @When: 08-oct-2021
        @Why: EWM-3225
        @What: Read json file
        */
        this.http.get("assets/config/document-config.json").subscribe(data => {
          this.documentTypeOptions = JSON.parse(JSON.stringify(data));
         })
   
     }

     
  ngOnInit(): void {
    this.candidateService.currentCandidateName.subscribe((name) => {
      this.candidateName = name;   
      let logedInUser= localStorage.getItem('currentUser');
      this.logedInUserName=logedInUser['FirstName']+' '+logedInUser['LastName'];
      let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
      this.background70 = this.hexToRGB(primaryColor, 0.60);
  })
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.auditParameter = encodeURIComponent('Documents');
    this.animate();
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
delaAnimation(i:number){
  if(i<=25){
    return 0+i*80;
  }
  else{
    return 0;
  }
}

 
  OpenFolderPopUp(Id,name)
  {
    if((this.maxTrreNodeLevel-1)===this.treeNodelevel)
    {
      this.snackBService.showErrorSnackBar(this.translateService.instant("node can be only add till third level"), "200");
      return; 
    }
    let dothave= name.filter((a)=>a.Id==0);
   if( dothave==undefined ||dothave==null ||dothave.length==0 ){
   name.splice(0,0,{Id:0,Name:'.'});}
    const dialogRef = this.dialog.open(CreateFolderComponent, {
      maxWidth: "550px",
      width: "90%",
      maxHeight: "85%",
      data: {header:'label_addfolder',
            label:'label_folderName',
            btnlabel:'label_save',
            folderId:0,candidateId:this.candidateId,
            parentId:Id==undefined?0:Id,
            name:name==''?'':name},
      panelClass: ['quick-modalbox', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult!=false)
     {
      dialogResult.UserTypeId=this.candidateId;
      dialogResult.PageName="candidate";
      dialogResult.BtnId="attachments-tab";
      if(Id!=undefined)
      {
        dialogResult.ParentId=Id;
      }
      this._services.createFolder(dialogResult).subscribe(
        (Res:ResponceData)=>{
          if(Res.HttpStatusCode==200)
          {
            this.updatedata.emit(false);
          }
      })
     }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }
  OpenRenameFolderPopUp(Id,Name,Type,parentId)
  {
    // if(this.maxTrreNodeLevel==this.treeNodelevel)
    // {
    //   this.snackBService.showErrorSnackBar(this.translateService.instant("node can be only add till third level"), "200");
    //   return; 
    // }
    const dialogRef = this.dialog.open(CreateFolderComponent, {
      data: {header:'label_rename',
            label:'label_file/folder',
            btnlabel:'label_rename',
            folderId:Id,
            candidateId:this.candidateId,
            parentId:parentId==undefined?0:parentId,
            name:Name,
            type:Type},
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(dialogResult => {
     if(dialogResult!=false)
     {
      dialogResult.UserTypeId=this.candidateId;
      dialogResult.PageName="candidate";
      dialogResult.BtnId="attachments-tab";
      if(Id!=undefined)
      {
        dialogResult.Id=Id;
      }
      const formdata={
        From:{
          Id: Id,
          Name: Name,
          UserTypeId:this.candidateId,
          PageName: "candidate",
          BtnId: "attachments-tab"
        },
        To:dialogResult
      }
      this._services.renameData(formdata).subscribe(
        (Res:ResponceData)=>{
          if(Res.HttpStatusCode==200)
          {
           
            this.updatedata.emit(false);
          }
      });
     }
    });
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
 
  loadViewer(url,type)
  {
    // if(type=='Folder')
    // {
    //   return;
    // }
    // const list = url.split('.');
    // const fileType = list[list.length - 1];
    // if(fileType=='PDF' || fileType=='pdf'){
    //   const dialogRef = this.dialog.open(PdfViewerComponent, {
    //     maxWidth: "1000px",
    //     width: "90%",
    //     maxHeight: "85%",
    //     data:{url:url,fileType:fileType},
    //     panelClass: ['quick-modalbox', 'add_folder', 'animate__animated', 'animate__zoomIn'],
    //     disableClose: true,
    //   });
    //   dialogRef.afterClosed().subscribe(dialogResult => {
    //     return;
       
    //   });
    // }else{
      if(type=='Folder')
      {
        return;
      }else{
        window.open(url,'_blank');
      }
    
      //this.downloadData(Id,name);
    // }  
  } 
  OpenDocuemntPopUp(Id,name)
  {  
    if((this.maxTrreNodeLevel-1)===this.treeNodelevel)
    {     
      this.snackBService.showErrorSnackBar(this.translateService.instant("node can be only add till "+this.maxTrreNodeLevel+" level"), "200");
      return; 
    }
   let dothave= name.filter((a)=>a.Id==0);
   if( dothave==undefined ||dothave==null ||dothave.length==0 ){
    name.splice(0,0,{Id:0,Name:'.'});}
    const dialogRef = this.dialog.open(CreateDocumentComponent, {
      maxWidth: "550px",
      width: "90%",
      maxHeight: "85%",
      data:{candidateId:this.candidateId,openDocumentPopUpFor:this.documentFor,FolderId:Id,Name:name,docRequiredStatus:true},
      panelClass: ['quick-modalbox', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult)
      {
        this.updatedata.emit(false);
      }
     
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }
  OpenViewPopUp(Id)
  {
    const dialogRef = this.dialog.open(ViewDocumentComponent, {
      data:{Id:Id,isExternal:false},
      panelClass: ['xeople-modal', 'view_Document', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult)
      {
       
      }
     
    });
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
  deletedata(degreeData: any): void {
      let docObj = {};
      docObj = degreeData;
     //delete docObj['LastActivity'];
     docObj['LastModified']=new Date(degreeData.LastActivity);
     docObj['PageName']='candidate';
     docObj['BtnId']='attachments-tab';
      // const message =degreeData.Children.length>0?'label_titleDialogdeletewithChildContent': `label_titleDialogdeleteContent`;//@when:2-nov-2021;@who:Priti Srivastva;@why: EWM-3468
      const message='label_titleDialogContent'
      const title = '';
      const subTitle = degreeData.Name;
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult == true) {
          this._services.delete(docObj).subscribe(
            (data: ResponceData) => {
              if (data.HttpStatusCode === 200) {
                this.pageNo = 1;
                
                this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
               // this.getAlldocument(false);
               this.updatedata.emit(false);
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

      // RTL Code
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

    }
    downloadData(Id,name)
    {
      this.loading=true;
      let jobId='00000000-0000-0000-0000-000000000000';
      this._services.downloadData(Id,jobId).subscribe(
        (data:any)=>{
       const Url= URL.createObjectURL(data)
        const fileExt=fileExtention[data.type];
        let fileName=name+'.'+fileExt;
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
    getAlldocument(data)
    {
    this.updatedata.emit(false);
    }
    
     /*
  @Type: File, <ts>
  @Name: OpenVersionPopUp function
  @Who:  ANUP
  @When: 15-Sep-2021
  @Why: EWM-2682 EWM-2725
  @What: For open version popup
   */

  OpenVersionPopUp(documentData) {
    const dialogRef = this.dialog.open(VersionComponent, {
      data:{candidateId:this.candidateId, documentData:documentData},
      panelClass: ['xeople-modal-lg', 'add_version', 'animate__animated', 'animate__zoomIn','animate__slow'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {}
     
    });

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
@Name: confirmShareAttachment
@Who: Suika
@When: 15-Sept-2021
@Why: EWM-2833
@What: To confirm share document as an attachment.
*/

confirmShareAttachment(documentData: any): void {
let docObj = {};
docObj = documentData;
docObj['LastModified']=new Date(documentData.LastActivity);
docObj['PageName']='candidate';
docObj['BtnId']='attachments-tab';
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
   this._services.getUserIsEmailConnected().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {  
        if(data.Data.IsEmailConnected==1){
        this.openNewEmailModal(documentData);
        }else{
         // console.log("email not integrated");
          this.EmailNotIntegratedPopup();
         // this.openNewEmailModal(documentData);
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
@Name: EmailNotIntegratedPopup
@Who: Suika
@When: 15-Sept-2021
@Why: EWM-2833
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
 
openNewEmailModal(documentData) {
const message = ``;
const title = 'label_disabled';
const subtitle = 'label_securitymfa';
const dialogData = new ConfirmDialogModel(title, subtitle, message);
const dialogRef = this.dialog.open(NewEmailComponent, {
  maxWidth: "750px",
  width: "95%",
  maxHeight: "100%",
  height: "100%",
  data: new Object({ documentData:documentData,candidateId:this.candidateId,openDocumentPopUpFor:this.documentFor,isBulkEmail:true}),
  panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__slow', 'animate__animated', 'animate__slideInRight'],
  disableClose: true,
});
}




 /*
  @Type: File, <ts>
  @Name: confirmShareDocument
  @Who: Suika
  @When: 15-Sept-2021
  @Why: EWM-2833
  @What: To confirm share document as an attachment.
  */


confirmShareDocument(documentData) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(ShareDocumentComponent, {
    data: new Object({ documentData: documentData,candidateId:this.candidateId,candidateName:this.candidateName}),
    panelClass: ['xeople-modal', 'share-docs', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    autoFocus: false 
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {  
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.

    // this.activatedng s = this.routes.url;

    //   this.router.navigate([], {
    //     relativeTo: this.activatedRoute,
    //     queryParams: {
    //       'search': null,
    //     },
    //     queryParamsHandling: 'merge'
    //   }) 

    // this.activatedRoute = this.routes.url;

    // this.route.navigate([],{
    //   relativeTo: this.activatedRoute,
    //   queryParams: { search: null },
    //   queryParamsHandling: 'merge'
    // });


    }else{
    // @Who: Bantee Kumar,@Why:EWM-10728,@When: 1-Mar-2023,@What:When user share Documents via Internal Share, then that particular Document/Folder should be displayed not all the Documents/Folders of that job.

    //   this.activatedRoute = this.routes.url;

    // this.route.navigate([],{
    //   relativeTo: this.activatedRoute,
    //   queryParams: { search: null },
    //   queryParamsHandling: 'merge'
    // });
    }
 });

 
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
    @Name: openManageAccessModal
    @Who: Nitin Bhati
    @When: 16-Sep-2021
    @Why: EWM-2861
    @What: to open quick add Manage Access modal dialog
  */
    openManageAccessModal(Id:any,Name:any,AccessModeId:any) {
        const dialogRef = this.dialog.open(ManageAccessComponent, {
        data:{candidateId:this.candidateId,Id:Id,Name:Name,AccessModeId:AccessModeId, candidateName: this.candidateName},
        panelClass: ['xeople-modal', 'add_manageAccess',  'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == false) {
          this.updatedata.emit(false);
         } 
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
 onSharableLink(id,name,documentType,uploadDocument)
 {
  this._services.getUserIsEmailConnected().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {  
        // if(data.Data.IsEmailConnected==1){
        //   const data={Name:name,
        //     Id:id,
        //     DocumentType:documentType,
        //     UploadDocument:uploadDocument}
        // this.openNewEmailModal(data);
        // }else{
          
        //   this.shareableLinkPopup(id,name);
        // }
        /*----EWM-8615, Done-Adarsh, date: 1st Sep22----*/ 
        this.shareableLinkPopup(id,name,documentType);
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
    shareableLinkPopup(Id,DocumentName,documentType)
    {
      const dialogRef = this.dialog.open(DocumentShareableLinkComponent, {
        data:{candidateId:this.candidateId,DocumentId:Id,documentType:documentType},
        panelClass: ['xeople-modal', 'quick-modalbox', 'add_shareableLink', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(!dialogResult)
        {
          return;
        }
        else{
          dialogResult.DocumentId=Id;
          dialogResult.PageName= "DocumentShareable";
          dialogResult.BtnId="attachments-tab";
          dialogResult.CandidateId=this.candidateId;
          dialogResult.CandidateName=this.candidateName;
          dialogResult.DocumentName=DocumentName;
          dialogResult.DocumentType=documentType;
          this._services.pushShareableLink(dialogResult).subscribe(
            (data:ResponceData)=>{
              if(data.HttpStatusCode==200)
              {
                this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              
              }else {
                this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              }
            }, err => {
             this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            });
          
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

    getIcon(uploadDocument) {
      if(uploadDocument){
  
      const list = uploadDocument.split('.');
      const fileType = list[list.length - 1];
      let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
         let logo = FileTypeJson[0].logo; ;
     
        return logo;
    
      }
    }


}
