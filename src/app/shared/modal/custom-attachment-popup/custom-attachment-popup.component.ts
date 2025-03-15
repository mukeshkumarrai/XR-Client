/*
  @Type: File, <ts>
  @Name: custom-attachment-popup.component.ts
  @Who: Anup Singh
  @When: 08-FEB-2022
  @Why:EWM-4805 EWM-4861
  @What:for custom attachment-popup
  */
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from '../../models';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-custom-attachment-popup',
  templateUrl: './custom-attachment-popup.component.html',
  styleUrls: ['./custom-attachment-popup.component.scss']
})
export class CustomAttachmentPopupComponent implements OnInit {
  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public filestatus: boolean = false;
  public arr = [];
  public fileAttachments: any[] = [];
  public attachmentName: string;
  public fileInfo: any = {};
  public uploadFiles: any;
  isAssessment: boolean = false;
  maxUploadFile:any;
  public isInvalidType:boolean=false;
  public isInvalidSize:boolean=false; 
  isInvalidAttachedFilesSize: boolean = false;
  arrUpload=[];
  public fileAttachmentsOnServer: any[] = [];
  loading: boolean=false;
  isArrayChanges:boolean;
  uploadArrLength: number;
  uploadFileOnServer: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public _appSetting: AppSettingsService, public candidateService: CandidateService,
    public dialogRef: MatDialogRef<CustomAttachmentPopupComponent>, public dialog: MatDialog, public systemSettingService: SystemSettingService) {
      this.maxUploadFile = _appSetting.maxUploadFile;
      if(data!=undefined){
        this.fileType = data?.fileType;
        this.fileSizetoShow = data?.fileSizetoShow;
        this.fileSize = data?.fileSize;
        if(data?.fileAttachments?.length>0){
             // @suika @remove files element with not Path key @whn 21-03-2023
            let files = [];
            data?.fileAttachments.forEach(element => {
              if(element.hasOwnProperty('Path')){
                files.push(element);
              }
            });
          this.isArrayChanges = true;
          this.fileAttachments = files;
          this.fileAttachmentsOnServer = data?.fileAttachments;
        }
       if(data?.isAssessment!=undefined){
         this.isAssessment = data.isAssessment;
       }
      }  
  }

  ngOnInit(): void {
    if (this.fileAttachments != undefined && this.fileAttachments != null && this.fileAttachments?.length != 0) {
      this.fileAttachments?.forEach(element => {
        this.arr.push({
          'fileName': element.Name,
          'size': element.Size
        });
    });
    };
  }
  /**
   * Format the size to a human readable string
   *
   * @param bytes
   * @returns the formatted string e.g. `105 kB` or 25.6 MB
   */
  formatBytes(bytes: number): string {
    const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const factor = 1024;
    let index = 0;

    while (bytes >= factor) {
      bytes /= factor;
      index++;
    }
    return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  }
/*
@Type: File, <ts>
@Name: Uploadfile function
@Who:  Nitin Bhati
@When: 16-03-2023
@Why: EWM-11103
@What: For upload file
*/ 
Uploadfile(file,fileInput) {  
    let filesAmount = file.target.files.length;
    for (let i = 0; i < filesAmount; i++) {
        let fileArray = {};
        fileArray['Name'] = file.target.files[i].name;
        //fileArray['Path'] = responseData.Data[0].FilePathOnServer;
        fileArray['Size'] = file.target.files[i].size;
        //fileArray['Preview'] = responseData.Data[0].Preview;
        

        this.ImageValidation(file.target.files[i],fileInput);
  }
}
/*
@Type: File, <ts>
@Name: ImageValidation function
@Who:  Nitin Bhati
@When: 16-03-2023
@Why: EWM-11103
@What: For check validation
*/ 
ImageValidation(file,fileInput){
  const list = file.name.split('.');
  const fileType = list[list.length - 1];
  if (!this.fileType?.includes(fileType.toLowerCase())) {
    this.isInvalidType = true;
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->

    setTimeout(() => {
    this.isInvalidType = false;
      
    }, 2000);
    this.filestatus = false;
    return;
  }
  let totalfileSize: any = 0;  
  if (file?.size > this.fileSize) {
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->
    
    this.isInvalidSize = true;
    setTimeout(() => {
    this.isInvalidSize = false;
      
    }, 2000);
    this.filestatus = false;
    return;
  } else {
    this.isInvalidSize = false;
    // who:maneesh,what:ewm-11678 for handel validation this.isInvalidType = false; when:16/05/2023
    this.isInvalidType = false;
    this.arr.push({
      fileName: file.name,
      size: file.size
    })
    this.arr.forEach(x => {
      totalfileSize += x.size;
    })

  }
  if (totalfileSize > this.fileSize) {
    const index = this.arr.findIndex(x => x.size === file.size);
    if (index !== -1) {
      this.arr.splice(index, 1);
    }
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->

    this.isInvalidAttachedFilesSize = true;
    setTimeout(() => {
    this.isInvalidAttachedFilesSize = false;
      
    }, 2000);
    this.filestatus = false;
    return;
  }else{
    this.isInvalidAttachedFilesSize = false;

  }
  let fileArray = {};
  fileArray['Name'] = file.name;
  fileArray['Size'] = file.size;
  const index = this.fileAttachments.findIndex(x => x.Name == file.name);
  if (index == -1){
    this.fileAttachments?.push(fileArray);
    this.arrUpload.push({
      file: file
    });
  }
    // who:bantee,what:ewm-13764 After uploading the file, the scroll should move to the bottom of the recent added file in custom attach pop up component. when:11/08/2023

  setTimeout(() => {
    var matdialogue = document.getElementsByClassName('moveScrollDown')[0];
    matdialogue.scrollTop = matdialogue.scrollHeight;
  }, 0);
 
}
/*
@Type: File, <ts>
@Name: sendDataToServer function
@Who:  Nitin Bhati
@When: 16-03-2023
@Why: EWM-11103
@What: For send data to server
*/ 
sendDataToServer(file,fileInput){
  this.filestatus = true;
  this.loading=true;
  const list = file.name.split('.');
  const fileType = list[list.length - 1];
  this.fileInfo = { 'name': file.name, 'size': this.formatBytes(file.size) }; 

  localStorage.setItem('Image', '1');
  this.uploadFiles = file;
  const formData = new FormData();
  formData.append('file', file);
  
  this.candidateService.FileUploadClient(formData).subscribe(
    (responseData: ResponceData) => {
      if (responseData.HttpStatusCode === 200) {  

        localStorage.setItem('Image', '2');
        this.filestatus = false;
        this.loading=false;
        //fileInput.value = "";
        this.isInvalidType = false;
        this.isInvalidSize = false;
        this.isInvalidAttachedFilesSize = false;
        // this.showPrgrsScrolldwn();
        let fileArray = {};
        fileArray['Path'] = responseData.Data[0].FilePathOnServer;
        fileArray['PreviewUrl'] = responseData.Data[0].Preview;
        fileArray['Name'] = responseData.Data[0].UploadFileName;
        fileArray['Size'] = responseData.Data[0].SizeOfFile;

        if(responseData.Data[0].UploadFileName==file.name){
          this.fileAttachmentsOnServer?.push(fileArray);
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->

       this.uploadFileOnServer=true;
         } 
         
         if (this.arrUpload.length === this.fileAttachmentsOnServer.length ) {
           setTimeout(() => {
             
             this.dialogRef.close({ isFile: true, fileAttachments: this.fileAttachmentsOnServer }); 
           }, 200);
           document.getElementsByClassName("customAttachment")[0].classList.remove("animate__zoomIn")
           document.getElementsByClassName("customAttachment")[0].classList.add("animate__zoomOut");
         }
         if (this.isArrayChanges && this.uploadFileOnServer) {
           setTimeout(() => {
          this.dialogRef.close({ isFile: true, fileAttachments: this.fileAttachmentsOnServer }); 
             
           }, 200);
           document.getElementsByClassName("customAttachment")[0].classList.remove("animate__zoomIn")
           document.getElementsByClassName("customAttachment")[0].classList.add("animate__zoomOut"); 
       }
    
      }else{
        this.filestatus = false;
        this.loading=false;
      }
    }, err => {
      this.filestatus = false;
      this.loading=false;

    });
}
/*
@Type: File, <ts>
@Name: removeAttachment function
@Who:  Nitin Bhati
@When: 16-03-2023
@Why: EWM-11103
@What: For remove file
*/ 
  removeAttachment(fileInfo: any,fileInput) {
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->
       
        if(fileInfo.hasOwnProperty('Path')){
          this.fileAttachmentsOnServer.splice(index, 1);

        }else{

          this.arrUpload=this.arrUpload.filter(x=>x.file.name!=fileInfo.Name);
        }
    
        this.fileAttachments.splice(index, 1);
      

     
     this.isArrayChanges = true;

    }
    const indexfile: number = this.arr.findIndex(x => x.size === fileInfo.Size);
    if (indexfile !== -1) {
      this.arr.splice(index, 1);
    }
    this.attachmentName = null;
    fileInput.value="";
    this.isInvalidAttachedFilesSize = false;
    this.isInvalidSize = false;
    this.isInvalidType = false;
  }

  /*
@Type: File, <ts>
@Name: onDismiss function
@Who:  ANUP
@When: 01-oct-2021
@Why: EWM-2871 EWM-2974
@What: For cancel popup
*/
onDismiss(): void {
  document.getElementsByClassName("customAttachment")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("customAttachment")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({ isFile: false }); }, 200);
}
/*
@Type: File, <ts>
@Name: onSave function
@Who:  Nitin Bhati
@When: 17-March-2023
@Why: EWM-2871 EWM-2974,EWM-11103
@What: For onSave popup
*/
onSave(): void {  
  // <!---------@When: 11-08-2023 @who:bantee kumar @why: EWM-13388 @Desc Multiple Uploading - Tenant ->Home →Employee→ Employee Summary → Notes --------->

  this.arrUpload?.forEach((element) => {
    this.sendDataToServer(element.file,'fileInput');
   });
if (this.isArrayChanges && this.arrUpload==undefined || this.arrUpload.length==0) {
  setTimeout(() => {
    
    this.dialogRef.close({ isFile: true, fileAttachments: this.fileAttachmentsOnServer }); 
    document.getElementsByClassName("customAttachment")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("customAttachment")[0].classList.add("animate__zoomOut");
  }, 200);
}
}
}
