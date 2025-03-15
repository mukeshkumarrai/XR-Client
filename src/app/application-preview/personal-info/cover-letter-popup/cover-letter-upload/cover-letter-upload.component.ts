import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { FileUploaderService } from 'src/app/shared/services/file-uploader.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-cover-letter-upload',
  templateUrl: './cover-letter-upload.component.html',
  styleUrls: ['./cover-letter-upload.component.scss']
})
export class CoverLetterUploadComponent implements OnInit {

  @Output() informDocumentParent = new EventEmitter<{File:File}>();
  @Input() filestatus: boolean = true;
 // @Input() fileName: any;
  file: any;
  fileType: any;
  fileSize: any;
  fileSizetoShow: string;
  @Input() fileInfo: string;
  loading: boolean;
  addForm: FormGroup;
  UploadDocument: any;
  FileName: any;
  
  documentTypeOptions:any;
  @Input() iconFileType: any;
  @Input()  fileViewstatus : any;
  @Input() activestatus: string ;
  @Input() docRequiredStatus: boolean = false ;
  @Input() filePathOnServer:any='';

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private _services: DocumentService, public uploader: FileUploaderService, private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService, private serviceListClass: ServiceListClass,private http: HttpClient) { 
    this.fileType = _appSetting.file_file_type_medium;
    this.fileSizetoShow = _appSetting.file_file_size_extralarge;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }
   if(data?.docRequiredStatus!=undefined){
     this.docRequiredStatus = true;
   }
  
 
    }

  ngOnInit(): void {
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     })
  }
 
/*
 @Type: File, <ts>
 @Name: Uploadfile
 @Who: Renu
 @When: 05-July-2022
 @Why: EWM-7404 EWM-7515
 @What: for upload docuemnt data
 */
  uploadFiles: File;
  Uploadfile(file) {
     this.loading = true;
    const list = file.target.files[0].name.split('.');
    const fileType = list[list.length - 1];
    let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
    this.iconFileType= FileTypeJson[0]? FileTypeJson[0].logo:'';
    if (!this.fileType.includes(fileType.toLowerCase())) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
      this.loading=false;
      file = null;
      return;
    }
    if (file.target.files[0].size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      this.loading=false;
      file = null;
      return;
    }

    this.fileInfo = file.target.files[0].name + '(' + this.formatBytes(file.target.files[0].size) + ')';
    
    localStorage.setItem('Image', '1');
    this.uploadFiles = file.target.files[0];
    this.informDocumentParent.emit({File:this.uploadFiles});
    this.filestatus = false;
  }

  /*
 @Type: File, <ts>
 @Name: removeImage
 @Who: Renu
 @When: 05-July-2022
 @Why: EWM-7404 EWM-7515
 @What: for remove document uploaded data
 */
  removeImage() {
    this.filestatus = true;
    this.loading = false;
    this.informDocumentParent.emit(undefined);
   //this.informDocumentParent.emit({FilePathOnServer:'', SizeOfFile:'',UploadFileName:''});
  }
/*
 @Type: File, <ts>
 @Name: formatBytes
 @Who: Renu
 @When: 05-July-2022
 @Why: EWM-7404 EWM-7515
 @What: for convert data Kb and mb
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

  // openDoc(url:any){
  //   console.log("url:",url);
  //   window.open(url, '_blank');
  // }

}
