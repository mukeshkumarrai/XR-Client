
/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: document-popup-apply.component.ts
 @Who: Renu
 @When: 20-June-2022
 @Why: ROST-7151 EWM-7233
 @What: document popup
 */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { FileUploaderService } from 'src/app/shared/services/file-uploader.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-document-popup-apply',
  templateUrl: './document-popup-apply.component.html',
  styleUrls: ['./document-popup-apply.component.scss']
})
export class DocumentPopupApplyComponent implements OnInit {
  @Output() informDocumentParent = new EventEmitter<{FilePathOnServer:string, SizeOfFile:string,UploadFileName:string}>();
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
    private _services: DocumentService, public uploader: FileUploaderService, private translateService: TranslateService, 
    private snackBService: SnackBarService,
    private _appSetting: AppSettingsService, private candidateService: CandidateService,private http: HttpClient) { 
    this.fileType = _appSetting.file_file_type_extralarge;
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
 @Who: Nitin Bhati
 @When: 08-oct-2021
 @Why: EWM-3227
 @What: for upload docuemnt data
 */
  uploadFiles: any;
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
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidFileType') + ' ' + this.fileSizetoShow, '');
      this.loading=false;
      file = null;
      return;
    }

    this.fileInfo = file.target.files[0].name + '(' + this.formatBytes(file.target.files[0].size) + ')';
    
    localStorage.setItem('Image', '1');
    this.uploadFiles = file.target.files[0];
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    this.candidateService.FileUploadClient(formData)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.loading = false;
          this.informDocumentParent.emit({FilePathOnServer:data.Data[0].FilePathOnServer, SizeOfFile:data.Data[0].SizeOfFile,UploadFileName:data.Data[0].UploadFileName});
          localStorage.setItem('Image', '2');
          this.filestatus = false;
        } else if (data.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
 @Type: File, <ts>
 @Name: removeImage
 @Who: Nitin Bhati
 @When: 08-oct-2021
 @Why: EWM-3227
 @What: for remove document uploaded data
 */
  removeImage() {
    this.filestatus = true;
    this.informDocumentParent.emit({FilePathOnServer:'', SizeOfFile:'',UploadFileName:''});
  }
/*
 @Type: File, <ts>
 @Name: formatBytes
 @Who: Nitin Bhati
 @When: 08-oct-2021
 @Why: EWM-3227
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
  //   window.open(url, '_blank');
  // }



}
