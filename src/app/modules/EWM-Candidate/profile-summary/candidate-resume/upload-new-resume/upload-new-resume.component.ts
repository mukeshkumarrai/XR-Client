/*
  @(C): Entire Software
  @Type: upload-new-resume.component.html
  @Who: Renu
  @When: 12-Aug-2021
  @Why: EWM-2241 EWM-2493
  @What:  This page will be use for candidate resume upload popup Component ts file
*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-upload-new-resume',
  templateUrl: './upload-new-resume.component.html',
  styleUrls: ['./upload-new-resume.component.scss']
})
export class UploadNewResumeComponent implements OnInit {

  public loading: boolean;
  public images = [];
  public selectedFiles: any;
  public UploadResumeForm: FormGroup;
  public fileBinary: File;
  public myfilename = '';
  public candidateId: any;
  public filePath: any;
  public previewUrl: any;
  fileType: any;
  fileSizetoShow: any;
  fileSize: number;
  UploadFileName: any = ""
  public CandidateId: any;
  documentTypeOptions:any;
  iconFileType: any;
  filestatus: boolean = true;
  activestatus: string = 'Add';
  uploadFiles: File;
  fileViewstatus: boolean = true;
  fileInfo: string;
  isSubmit:boolean=false;
  SizeOfFile: number; /****** When:14-09-2023 @who: renu @why: EWM-14147 EWM13753   */

  constructor(private fb: FormBuilder, private snackBService: SnackBarService,
    private commonServiesService: CommonServiesService,
    public _sidebarService: SidebarService, private translateService: TranslateService,
    public candidateService: CandidateService, private routes: ActivatedRoute, private _appSetting: AppSettingsService,
    public dialogRef: MatDialogRef<UploadNewResumeComponent>, @Inject(MAT_DIALOG_DATA) private data: any,
    private appSettingsService: AppSettingsService) {
    this.UploadResumeForm = this.fb.group({
      CommentField: ['', [Validators.maxLength(100), Validators.minLength(1)]],
      file: ['', [Validators.required]]
    });
    this.candidateId = data;//@who:priti @why:EWM-2973 @what: 'candidate id' is coming as input @when:30-sep-2021
    this.CandidateId =data;
    this.fileType = _appSetting.resume_file_file_type_medium;//_appSetting.file_file_type_medium;
    this.fileSizetoShow = _appSetting.file_img_size_medium;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }
  }

  ngOnInit(): void {
    //@who:priti @why:EWM-2973 @what:code commented because 'candidate id' is coming as input @when:30-sep-2021
    // this.routes.queryParams.subscribe((value) => {
    //   this.candidateId = value.CandidateId
    // });
  }

  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who: Renu
 @When: 14-Aug-2021
 @Why: ROST-2493
 @What: to check the file type
*/
  onDismiss(): void {
    document.getElementsByClassName("uploadNewResume")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("uploadNewResume")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
 @Type: File, <ts>
 @Name: selectFile function
 @Who: Renu
 @When: 14-Aug-2021
 @Why: ROST-2493
 @What: on selecting file
*/

  selectFile(fileInput: any) {
    this.selectedFiles = fileInput.target.files;
    this.fileBinary = fileInput.target.files[0];
    if (!this.validateFile(fileInput.target.files[0].name)) {
      this.UploadResumeForm.get('file').setErrors({ fileTaken: true });
      this.UploadResumeForm.get("file").markAsDirty();
      return false;
    } else if (fileInput.target.files[0].size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      this.loading = false;
      fileInput = null;
      return;
    } else {
      this.UploadResumeForm.get("file").markAsPristine();
      this.myfilename = '';
      Array.from(fileInput.target.files).forEach((file: File) => {
        this.myfilename = file.name;
      });
      this.UploadResumeForm.get('file').setValue(this.myfilename);
      localStorage.setItem('Image', '1');
      this.uploadResumeFile(this.fileBinary);
    }

  }

  /*
    @Type: File, <ts>
    @Name: validateFile function
    @Who: Renu
    @When: 14-Aug-2021
    @Why: ROST-2493
    @What: on validating file
  */
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'pdf') {
      return true;
    } else if (ext.toLowerCase() == 'doc') {
      return true;
    } else if (ext.toLowerCase() == 'docx') {
      return true;
    } else if (!this.fileType.includes(ext.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  /*
    @Type: File, <ts>
    @Name: uploadResumeFile function
    @Who: Renu
    @When: 14-Aug-2021
    @Why: ROST-2493
    @What: on uploading file
  */

  uploadResumeFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    //formData.append('resources', 'resume');
    this.candidateService.FileUploadFile(formData).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.filePath = responseData.Data[0].FilePathOnServer;
          this.previewUrl = responseData.Data[0].Preview;
          this.UploadFileName = responseData.Data[0].UploadFileName; 
          this.SizeOfFile = responseData.Data[0].SizeOfFile; /****** When:14-09-2023 @who: renu @why: EWM-14147 EWM13753   */
          localStorage.setItem('Image', '2');
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Renu
     @When: 14-Aug-2021
     @Why: ROST-2493
     @What: on save pop-up button file
   */

  onConfirm(): void {
    if (this.UploadResumeForm.invalid) {
      return;
    }
    this.isSubmit = true;
    let uploadInfo = {};
    uploadInfo['CandidateId'] = this.candidateId;
    uploadInfo['CandidateId'] = this.CandidateId;
    uploadInfo['Size'] = this.SizeOfFile; /****** When:14-09-2023 @who: renu @why: EWM-14147 EWM13753   */
    uploadInfo['Comment'] = this.UploadResumeForm.value.CommentField;
    uploadInfo['FileName'] = this.filePath;
    uploadInfo['UploadFileName'] = this.UploadFileName;

    this.candidateService.addFileUploadFile(uploadInfo).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.isSubmit = false;
          this.UploadResumeForm.reset();
          document.getElementsByClassName("uploadNewResume")[0].classList.remove("animate__fadeInDownBig")
          document.getElementsByClassName("uploadNewResume")[0].classList.add("animate__fadeOutUpBig");
          setTimeout(() => { this.dialogRef.close({ data: this.previewUrl, filePath: this.filePath, UploadFileName: this.UploadFileName }); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.isSubmit = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.isSubmit = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
  }

 /*
 @Type: File, <ts>
 @Name: documentDataFetchFromChild
 @Who:  maneesh
 @When: 04-jan-2023
 @Why: EWM-9777
 @What: for patch document data
 */

 documentDataFetchFromChild(FileDetails:any){
  if(FileDetails!=undefined){
  this.uploadFiles = FileDetails.File;
  let UploadDocument = FileDetails.File;
  this.UploadResumeForm.patchValue({
    file: UploadDocument
  });
    this.uploadResumeFile(this.uploadFiles);
  }

}
 /*
 @Type: File, <ts>
 @Name: removeImage
 @Who:  maneesh
 @When: 04-jan-2023
 @Why: EWM-9777
 @What: for remove document uploaded data
 */
 removeImage(filePathOnServer) {
  this.filestatus = true;
}
/*
 @Type: File, <ts>
 @Name: formatBytes
 @Who:  maneesh
 @When: 04-jan-2023
 @Why: EWM-9777
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
 /*
 @Type: File, <ts>
 @Name: Uploadfile
 @Who:  maneesh
 @When: 04-jan-2023
 @Why: EWM-9777
 @What: for upload docuemnt data
 */
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
   this.loading = false;
   this.filestatus = false;
 }
}
