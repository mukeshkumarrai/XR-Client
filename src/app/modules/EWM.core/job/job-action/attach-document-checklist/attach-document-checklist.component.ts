import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FileUploaderService } from 'src/app/shared/services/file-uploader.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CustomValidatorService } from '../../../../../shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-attach-document-checklist',
  templateUrl: './attach-document-checklist.component.html',
  styleUrls: ['./attach-document-checklist.component.scss']
})
export class AttachDocumentChecklistComponent implements OnInit {

 
  @ViewChild('fileInput') fileInput;
  public prevUploadedFileCount: number = 0;
  public prevUploadedFileSize: number = 0;
  public attachmentName: string;
  public docName: any;
  public docId: any;

  addForm: FormGroup;
  categoryList: any = [];
  documentnameList: any = [];
  activestatus: string = 'Add';
  loading: boolean = false;
  dateStart = new Date();
  dateEnd = new Date();
  today = new Date();
  datePublish = new Date();
  endDay: Date;
  fromDate = '';
  file: any;
  fileType: any;
  fileSize: any;
  fileSizetoShow: string;
  selectedCategory: any;
  public dropDoneConfig: customDropdownConfig[] = [];
  public dropDocumrntnameConfig: customDropdownConfig[] = [];
  resetDdl: Subject<any> = new Subject<any>();
  selectedDocumentname: any;
  showExpdate: boolean;
  maxMessage: number = 500;
  filestatus: boolean = true;
  fileInfo: string;
  fileViewstatus: boolean = true;
  uploadFiles: any;
  docInfo: any;
  getDateFormat:any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder, public dialogRef: MatDialogRef<AttachDocumentChecklistComponent>,
     
    private _services: DocumentService, public uploader: FileUploaderService, private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService, private serviceListClass: ServiceListClass,private commonserviceService: CommonserviceService,
    private appSettingsService: AppSettingsService) {
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
    //  @Who: bantee ,@When: 14-mar-2023, @Why: EWM-11168 ,What: add CustomValidatorService to the start date control

    
    this.addForm = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      CategoryId: [0, [Validators.required]],
      Category: ['', [Validators.required]],
      DocumentId: ['', [Validators.required]],
      DocumentName: ['', [Validators.required]],
      ReferenceId: ['', [Validators.maxLength(50)]],
      StartDate: [new Date(),[CustomValidatorService.dateValidator]],
      ExpiryDate: [new Date(),[CustomValidatorService.dateValidator]],
      UploadDocument: [''],
      FileName: [''],
      Comment: ['',[Validators.maxLength(500)]],
      FileSize: [0],
      ParentId: [0],
      UserTypeId: [],
      PageName: [],
      BtnId: [],
      DocumentVersionId: []
    });

    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getDocumentcategory +'?search='+ this.data?.openDocumentPopUpFor  + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=Active';
    this.dropDoneConfig['placeholder'] = 'label_category';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = '';
    this.dropDoneConfig['IsRequired'] = true;
    this.dropDoneConfig['bindLabel'] = 'CategoryName';
    this.dropDoneConfig['multiple'] = false;

    this.dropDocumrntnameConfig['IsDisabled'] = false;
    this.dropDocumrntnameConfig['placeholder'] = 'label_documentname';
    this.dropDocumrntnameConfig['searchEnable'] = true;
    this.dropDocumrntnameConfig['IsManage']='';
    this.dropDocumrntnameConfig['IsRequired'] = true;
    this.dropDocumrntnameConfig['bindLabel'] = 'DocumentName';
    this.dropDocumrntnameConfig['multiple'] = false;

   
  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    if (this.data.documentData != undefined && this.data.documentData != null) {
      this.patchValueFromVersion(this.data.documentData)
    }
    //this.getDocumentCategory();
  }


  /*
  @Type: File, <ts>
  @Name: patchValueFromVersion
  @Who: Renu
  @When: 20-June-2022
 @Why: EWM-7151 EWM-7233
  @What: for data get From document page via version popup and also hide file name and disable some field for version
  */
  patchValueFromVersion(documentData) {
    this.addForm.patchValue({
      Name: documentData?.Name,
      CategoryId: documentData?.DocumentCategoryId,
      Category: documentData?.DocumentCategory,
      DocumentId: documentData?.DocumentId,
      DocumentName: documentData?.DocumentName,
      FileName:documentData?.Name+'.pdf',
     // ReferenceId: documentData?.ReferenceId,
    })
    // this.selectedCategory = { Id: documentData?.DocumentCategoryId,CategoryName: documentData?.DocumentCategory },
    //  this.OnChangeCategory(this.selectedCategory);
    // this.dropDocumrntnameConfig['apiEndPoint'] = this.serviceListClass.getDocumentName + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=Active&DocumentCategoryId=' +
    //  documentData?.DocumentCategoryId;
    // this.resetDdl.next(this.dropDocumrntnameConfig);
    // this.selectedDocumentname = { Id: documentData?.DocumentId };

    // this.dropDoneConfig['IsDisabled'] = false;
    // this.dropDocumrntnameConfig['IsDisabled'] = false;
   // this.addForm.controls['ReferenceId'].disable();

  }


  /*
   @Type: File, <ts>
   @Name: onSave
   @Who: renu
   @When: 20-June-2022
   @Why: EWM-7151 EWM-7233
   @What:for saving info
   */
  onSave(value) {
      document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn");
      document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({'value':value,'fileInfo':this.fileInfo,'FileSize':this.fileSize}); }, 200);
       
  }

  
 /*
   @Type: File, <ts>
   @Name: Uploadfile
   @Who: Renu
   @When: 20-June-2022
   @Why: EWM-7151 EWM-7233
   @What: for uploading the file
   */


  Uploadfile(file) {
    const list = file.target.files[0].name.split('.');
    const fileType = list[list.length - 1];
    if (!this.fileType.includes(fileType.toLowerCase())) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
      file = null;
      return;
    }
    if (file.target.files[0].size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      file = null;
      return;
    }

    this.fileInfo = file.target.files[0].name + '(' + this.formatBytes(file.target.files[0].size) + ')';

    localStorage.setItem('Image', '1');
    this.uploadFiles = file.target.files[0];
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    this._services.uploadDocument(this.data.candidateId, formData)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.addForm.patchValue({
            UploadDocument: data.Data[0].FilePathOnServer,
            FileSize: data.Data[0].SizeOfFile,
            FileName: data.Data[0].UploadFileName
          });

          localStorage.setItem('Image', '2');
          this.filestatus = false;
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }
  remove() {

  }
  inputEventStart(event) {
    this.endDay = new Date(event.value);
    this.endDay.setDate(this.endDay.getDate()+1);
  }
  onDismiss() {
    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  getDocumentCategory() {
    this._services.getDocumentCategory().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.categoryList = data.Data;
        }
        else {
          this.categoryList = null;
        }
      }
    )
  }
  OnChangeCategory(value) {
    if (value == null || value == "") {
      this.addForm.get("CategoryId").setErrors({ required: true });
      this.addForm.get("CategoryId").markAsTouched();
      this.addForm.get("CategoryId").markAsDirty();
    }
    else {
      this.addForm.get("CategoryId").clearValidators();
      this.addForm.get("CategoryId").markAsPristine();
      this.selectedCategory = value;
      this.addForm.patchValue(
        {
          CategoryId: value.Id,
          Category: value.CategoryName
        }
      );

      this.getDocumentName(value.Id);
    }
  }

  getDocumentName(CategoryId) {
    this.dropDocumrntnameConfig['apiEndPoint'] = this.serviceListClass.getDocumentName + '?DocumentCategoryId=' + CategoryId;

    this.dropDocumrntnameConfig['IsManage'] = '';
    this.resetDdl.next(this.dropDocumrntnameConfig);
    this._services.getDocumentName(CategoryId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.documentnameList = data.Data;
        }
        else {
          this.documentnameList = null;
        }
      }
    )
  }
  onChangeDocumentName(value) {

    if (value == null || value == "") {
      this.addForm.get("DocumentId").setErrors({ required: true });
      this.addForm.get("DocumentId").markAsTouched();
      this.addForm.get("DocumentId").markAsDirty();
    }
    else {
      this.addForm.get("DocumentId").clearValidators();
      this.addForm.get("DocumentId").markAsPristine();
      this.selectedDocumentname = value;
      this.addForm.patchValue(
        {
          DocumentId: value.Id,
          DocumentName: value.DocumentName
        }
      );
      let dcName = this.documentnameList.filter((dn: any) => dn.Id == value.Id);
      if (dcName.length > 0) {
        this.showExpdate = dcName[0].ExpiryDate == 0 ? false : true;
      }
    }
  }
 
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 500 - value.length;
    }
  }


  /*
 @Type: File, <ts>
 @Name: uploadFileCustom
 @Who: Renu
 @When: 20-June-2022
 @Why: EWM-7151 EWM-7233
 @What: for upload file
 */


  uploadFileCustom(file) {
    this.filestatus = false;
    const list = file[0].name.split('.');
    const fileType = list[list.length - 1];
    this.fileInfo = file[0].name + '(' + this.formatBytes(file[0].size) + ')';
    this.formatBytes(file[0].size);

    if (!this.fileType.includes(fileType.toLowerCase())) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
      file = null;
      return;
    }
    if (file[0].size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      file = null;
      return;
    }
    localStorage.setItem('Image', '1');
    const formData = new FormData();
    formData.append('file', file[0]);
    this._services.uploadDocument(this.data.candidateId, formData)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.addForm.patchValue({
            UploadDocument: data.Data[0].FilePathOnServer,
            FileSize: data.Data[0].SizeOfFile,
            FileName: data.Data[0].UploadFileName
          });
          localStorage.setItem('Image', '2');
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }

  removeImage() {
    this.filestatus = true;
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
 @Name: documentDataFetchFromChild
 @Who: Renu
 @When: 20-June-2022
 @Why: EWM-7151 EWM-7233
 @What: for patch document data 
 */
 documentDataFetchFromChild(FileDetails:any){
  let UploadDocument = FileDetails;
  if(FileDetails!=''){
  const list = UploadDocument.UploadFileName.split('.');
  this.addForm.patchValue({
    UploadDocument: UploadDocument.FilePathOnServer,
    FileSize: UploadDocument.SizeOfFile,
    FileName: UploadDocument.UploadFileName,
    Name: list[0]
  });
}else{
  this.addForm.patchValue({
    UploadDocument: null,
    FileSize: null,
    FileName: null,
    Name: null
  });
}
}
     /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear start  date 
     */
    clearStartDate(e){
      this.addForm.patchValue({
        StartDate: null
      });
    }
 /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear end  date 
     */
    clearEndDate(e){
      this.addForm.patchValue({
        ExpiryDate: null
      });
    }
}
