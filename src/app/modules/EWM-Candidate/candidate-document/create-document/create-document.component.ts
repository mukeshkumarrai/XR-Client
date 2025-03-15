import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FileUploaderService } from 'src/app/shared/services/file-uploader.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.scss']
})
export class CreateDocumentComponent implements OnInit {
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
  hideFileName: boolean = false;
  // <!------------@suika @EWM-13129 EWM-13293 @whn 18-07-2023--------------------->
  maxMessage: number = 250;
  filestatus: boolean = true;
  fileInfo: string;
  fileViewstatus: boolean = true;
  filePathOnServer: any;
  showReferenceId: boolean;
  showStartDate: boolean;
  showExpiryDate: boolean;
  hideMoreFields: boolean=false;
  fileName: any;
 @ViewChild('target') private myScrollContainer: ElementRef;
 getDateFormat:any;
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder, public dialogRef: MatDialogRef<CreateDocumentComponent>,
     
    private _services: DocumentService, public uploader: FileUploaderService, private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService, private serviceListClass: ServiceListClass,private commonserviceService: CommonserviceService,private appSettingsService: AppSettingsService) {
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
    let date = new Date();
    date.setDate( date.getDate() + 1 );
    this.addForm = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      CategoryId: [0],
      Category: [''],
      DocumentId: [0],
      DocumentName: [''],
      ReferenceId: ['', Validators.maxLength(50)],
      StartDate: [new Date(), [CustomValidatorService.dateValidator]],
      ExpiryDate: [date ,[CustomValidatorService.dateValidator]],
      UploadDocument: ['', [Validators.required]],
      FileName: [''],
      Comment: ['',[Validators.maxLength(250)]],// <!------------@suika @EWM-13129 EWM-13293 @whn 18-07-2023--------------------->
      FileSize: [0],
      ParentId: [0],
      UserTypeId: [],
      PageName: [],
      BtnId: [],
      DocumentVersionId: [],
      Weightage: [],
    });

    // this.dropDoneConfig['IsDisabled'] = false;
    // this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getDocumentcategory +'?search='+ this.data?.openDocumentPopUpFor  + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=Active';
    // this.dropDoneConfig['placeholder'] = 'label_category';
    // this.dropDoneConfig['searchEnable'] = true;
    // this.dropDoneConfig['IsManage'] = 'client/core/administrators/document-category';
    // this.dropDoneConfig['IsRequired'] = true;
    // this.dropDoneConfig['bindLabel'] = 'CategoryName';
    // this.dropDoneConfig['multiple'] = false;

    // this.dropDocumrntnameConfig['IsDisabled'] = false;
    // this.dropDocumrntnameConfig['placeholder'] = 'label_documentname';
    // this.dropDocumrntnameConfig['searchEnable'] = true;
    // //this.dropDocumrntnameConfig['IsManage']='client/core/administrators/document-category';
    // this.dropDocumrntnameConfig['IsRequired'] = true;
    // this.dropDocumrntnameConfig['bindLabel'] = 'DocumentName';
    // this.dropDocumrntnameConfig['multiple'] = false;

    this.dropDocumrntnameConfig['IsDisabled'] = false;
    this.dropDocumrntnameConfig['apiEndPoint'] = this.serviceListClass.getDocumentnameAllbyUsertype +'?userType='+ this.data?.openDocumentPopUpFor +'&ByPassPaging=true&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND';
    this.dropDocumrntnameConfig['placeholder'] = 'label_documentname';
    this.dropDocumrntnameConfig['searchEnable'] = true;
    this.dropDocumrntnameConfig['IsManage']='client/core/administrators/document-category';
    this.dropDocumrntnameConfig['IsRequired'] = false;
    this.dropDocumrntnameConfig['bindLabel'] = ['CategoryName','DocumentName'];
    this.dropDocumrntnameConfig['multiple'] = false;
  }
  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    if (this.data.documentData != undefined && this.data.documentData != null) {
      this.patchValueFromVersion(this.data.documentData)
    }
     // <!---------@When: 29-03-2023 @who:Adarsh singh @why: EWM-11208 --------->
     this.endDay = new Date(this.addForm.value.StartDate);
     this.endDay.setDate(this.endDay.getDate() + 1);
    //this.getDocumentCategory();
    this.addForm.controls['Weightage'].disable();
  }


  /*
  @Type: File, <ts>
  @Name: patchValueFromVersion
  @Who: Anup
  @When: 16-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for data get From document page via version popup and also hide file name and disable some field for version
  */
  patchValueFromVersion(documentData) {
    this.addForm.patchValue({
      Name: documentData?.Name,
      CategoryId: documentData?.CategoryId,
      Category: documentData?.Category,
      DocumentId: documentData?.DocumentId,
      DocumentName: documentData?.DocumentName,
      ReferenceId: documentData?.ReferenceId,
    })
    this.selectedCategory = { Id: documentData?.CategoryId },

      this.dropDocumrntnameConfig['apiEndPoint'] = this.serviceListClass.getDocumentName + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=Active&DocumentCategoryId=' + documentData?.CategoryId;
    this.resetDdl.next(this.dropDocumrntnameConfig);
    this.selectedDocumentname = { Id: documentData?.DocumentId },

      this.dropDoneConfig['IsDisabled'] = true;
    this.dropDocumrntnameConfig['IsDisabled'] = true;
    this.addForm.controls['ReferenceId'].disable();
    this.hideFileName = true;

  }

 
  /*
   @Type: File, <ts>
   @Name: onSave
   @Who: Anup
   @When: 16-sep-2021
   */
  onSave(value) {
    if (this.hideFileName == true) {
      this.onSaveVersionDocument(value);
    } else {
      this.onSaveDocuments(value);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
   @Type: File, <ts>
   @Name: onSaveVersionDocument
   @Who: Anup
   @When: 16-sep-2021
   @Why: EWM-2638 EWM-2853
   @What: for data save of version document popup
   */
// <!---------@When: 05-05-2023 @who:Bantee Kumar @why: EWM-11814 EWM-12321 Need to pass PageName like candidate, job,employee and client in create-document API --------->
  onSaveVersionDocument(value) {
    let comment = value.Comment.replace(/(\r\n|\n|\r)/gm, " ");
    value.Comment = comment;
    this.loading = false;
    value.DocumentVersionId = this.data?.documentData?.Id;
    value.PageName = this.data.openDocumentPopUpFor;
    value.BtnId = "attachments-tab";
    this._services.createVersionDocument(value)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.loading = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        } else if (data.HttpStatusCode === 412 || data.HttpStatusCode === 402) {
          this.loading = false;
          this.addForm.get("ReferenceId").setErrors({ codeTaken: true });
          this.addForm.get("ReferenceId").markAsDirty();
        }
        else if (data.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      },
        err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
  }



  onSaveDocuments(value) {
    this.loading = false;
    value.UserTypeId = this.data.candidateId;
    value.PageName = this.data.openDocumentPopUpFor;
    let comment = value.Comment.replace(/(\r\n|\n|\r)/gm, " ");
    value.Comment = comment;
    value.BtnId = "attachments-tab";
    if (this.data.FolderId != undefined) {
      value.ParentId = this.data.FolderId;
    }
    this._services.createDocument(value)
      .subscribe((data: any) => {
        if (data.HttpStatusCode == 200) {
          this.loading = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.commonserviceService.documentAdded.next(1);
          document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        } else if (data.HttpStatusCode === 412 || data.HttpStatusCode === 402) {
          this.loading = false;
          if (data.ErrorFields[0].FieldName == 'Name') {
            this.addForm.get("Name").setErrors({ codeTaken: true });
            this.addForm.get("Name").markAsDirty();
          }
          else if(data.ErrorFields[0].FieldName == 'ReferenceId'){
            this.addForm.get("ReferenceId").setErrors({ codeTaken: true });
            this.addForm.get("ReferenceId").markAsDirty();
          }
        }
        else if (data.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      },
        err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
  }
  uploadFiles: any;
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
 // <!-- @Who: bantee ,@When: 12-04-2023, @Why: EWM-11854 ,What: add CustomValidatorService to the start date control -->
  inputEventStart(startDate) {
    if(startDate){
    this.endDay = new Date(startDate);
    this.endDay.setDate(this.endDay.getDate()+1);}
    else{
      this.endDay = null;
    }
  }
  onDismiss() {
    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
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

    this.dropDocumrntnameConfig['IsManage'] = 'client/core/administrators/document-category/document-name?documentcategoryId=' + CategoryId + '&V=list';
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
      // this.addForm.get("DocumentId").setErrors({ required: true });
      // this.addForm.get("DocumentId").markAsTouched();
      // this.addForm.get("DocumentId").markAsDirty();
      this.showReferenceId = false;
      this.showStartDate = false;
      this.showExpiryDate = false;
      this.addForm.patchValue(
        {
          DocumentId: 0,
          DocumentName: '',
          CategoryId: 0,
          Category: '',
          Weightage: null
        }
        );
    }
    else {
      this.addForm.get("DocumentId").clearValidators();
      this.addForm.get("DocumentId").markAsPristine();
      this.selectedDocumentname = value;
      this.addForm.patchValue(
        {
          DocumentId: value.Id,
          DocumentName: value.DocumentName,
          CategoryId: value.DocumentCategoryId,
          Category: value.CategoryName,
          Weightage: value.Weightage
        }
      );
      this.showReferenceId = value.ReferenceId == 0 ? false : true;
      this.showStartDate = value.StartDate == 0 ? false : true;
      this.showExpiryDate = value.ExpiryDate == 0 ? false : true;
      if (this.showReferenceId || this.showStartDate || this.showExpiryDate) {
        this.hideMoreFields= true;
      }
      let dcName = this.documentnameList.filter((dn: any) => dn.Id == value.Id);
      if (dcName.length > 0) {
        this.showExpdate = dcName[0].ExpiryDate == 0 ? false : true;
      }
    }
  }
  checkDuplicity(checkforvalue) {
     let Value = '';
    //  <!---------@When: 20-03-2023 @who:Adarsh singh @why: EWM-11150 @Desc- Handle error--------->
     if (checkforvalue == 'Name') {
      Value = this.addForm.controls['Name'].value?this.addForm.controls['Name'].value:this.fileName ? this.fileName[0] : '';
    }
    else {
      Value = this.addForm.controls['ReferenceId'].value;
    }
    if (Value == '' || Value == undefined) {
      return;
    }
    const formdata = {
      Id: 0,
      Value: Value,
      CheckFor: checkforvalue,
      IsFolder: 0,
      UserTypeId: this.data.candidateId,
      ParentId: this.data.FolderId == undefined ? 0 : this.data.FolderId
    };
    this._services.checkduplicity(formdata).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            if (checkforvalue == 'Name') {
              this.addForm.get("Name").setErrors({ codeTaken: true });
              this.addForm.get("Name").markAsDirty();
            }
            else {
              this.addForm.get("ReferenceId").setErrors({ codeTaken: true });
              this.addForm.get("ReferenceId").markAsDirty();
            }
          }
        }
        else if (data.HttpStatusCode == 204) {
          if (checkforvalue == 'Name') {
            this.addForm.get("Name").clearValidators();
            this.addForm.get("Name").markAsPristine();
            this.addForm.get('Name').setValidators([Validators.required, Validators.maxLength(100)]);
          }
          else {
            this.addForm.get("ReferenceId").clearValidators();
            this.addForm.get("ReferenceId").markAsPristine();
            this.addForm.get('ReferenceId').setValidators([Validators.maxLength(50)]);
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      // <!------------@suika @EWM-13129 EWM-13293 @whn 18-07-2023--------------------->
      this.maxMessage = 250 - value.length;
      if(value?.length>250){
        this.addForm.get('Comment').markAsTouched();
        this.addForm.get('Comment').setErrors({maxlength:true});
      }
    }
  }


  /*
 @Type: File, <ts>
 @Name: uploadFileCustom
 @Who: Nitin Bhati
 @When: 23-sep-2021
 @Why: EWM-22993
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
 @Who: Nitin Bhati
 @When: 08-Oct-2021
 @Why: EWM-3227
 @What: for patch document data 
 */
 documentDataFetchFromChild(FileDetails:any){
    let UploadDocument = FileDetails;
   this.filePathOnServer= UploadDocument.DocumentUrl;
   this.fileName= UploadDocument.UploadFileName.split('.')
    this.addForm.patchValue({
      UploadDocument: UploadDocument.FilePathOnServer,
      FileSize: UploadDocument.SizeOfFile,
      FileName: UploadDocument.UploadFileName,
      Name: this.fileName[0]
    });
    //this.fileName=this.fileName[0];
    this.checkDuplicity('Name');
  }
/*
 @Type: File, <ts>
 @Name: onHideMoreField
 @Who: Nitin Bhati
 @When: 08-Oct-2022
 @Why: EWM-9189
 @What: for Hide more fields
 */
  onHideMoreField(el){
    setTimeout(() => { this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight, 
      left: 0, 
      behavior: 'smooth' }); }, 0);
    this.hideMoreFields=!this.hideMoreFields;
    if (this.showReferenceId || this.showStartDate || this.showExpiryDate) {
      this.showReferenceId = false;
      this.showStartDate = false;
      this.showExpiryDate = false;
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


