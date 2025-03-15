/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: cover-letter-popup.component.ts
 @Who: Renu
 @When: 01-July-2022
 @Why: EWM-1732 EWM-7404
 @What: for uploading coverletter
 */
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { PreviewSaveService } from '../../shared/preview-save.service';

@Component({
  selector: 'app-cover-letter-popup',
  templateUrl: './cover-letter-popup.component.html',
  styleUrls: ['./cover-letter-popup.component.scss']
})
export class CoverLetterPopupComponent implements OnInit {

  public isJobDetails:boolean = false;
  public loading: boolean;
  public images = [];
  public selectedFiles: any;
  public UploadResumeForm: FormGroup;
  public fileBinary: File;
  public myfilename = '';
  public candidateId: any;
  public filePath: any;
  public previewUrl: any;
  public statusList:any = [];
  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public UploadFileName: any = ""
  public activestatus: string = 'Add';
  public fileInfo: string;
  public fileViewstatus: boolean = true;  
  public filestatus: boolean = true;
  public JobTitleList:any;
  public pagesize: any;
  public pagneNo: any = 1;
  public searchValue: any = '';  
  public pageOption: any;  
  public clientNameData:any;
  public jobReferenceIdData:any;
  public sortingValue: string = "JobTitle,desc";  
  public isSubmit:boolean = false;
  public docFileSize:number;
  public iconFileType: any;
  public documentTypeOptions:any;
  public jobId: any;
  Jobtitle: any;

  constructor(private fb: FormBuilder, private snackBService: SnackBarService,
    private commonServiesService: CommonServiesService,
    public _sidebarService: SidebarService, private translateService: TranslateService,private http: HttpClient,
    public candidateService: CandidateService, private routes: ActivatedRoute, private _appSetting: AppSettingsService,
    public dialogRef: MatDialogRef<CoverLetterPopupComponent>, private appSettingsService: AppSettingsService,
     @Inject(MAT_DIALOG_DATA) private data: any,private jobService: JobService,private previewSaveService:PreviewSaveService
  ) {
    this.UploadResumeForm = this.fb.group({
      CoverPageField: ['', [Validators.required,Validators.maxLength(150)]],
      JobTittile:[],
      JobReferenceId:[''],
      clientName:[''],
      file: ['', [Validators.required]]
    });
    this.previewSaveService.currentCandidateExistsInfo.subscribe(res => {
      if (res?.CandidateId) {
        this.candidateId = res.CandidateId;
      }
    });
    this.fileType = _appSetting.resume_file_file_type_medium;//_appSetting.file_file_type_medium;
    this.fileSizetoShow = _appSetting.file_file_type_medium;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }

    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = appSettingsService.pagesize;
  }

  ngOnInit(): void { 
    this.routes.queryParams.subscribe((parms: any) => {
    if (parms?.jobId){ 
      this.jobId=parms?.jobId;
      this.UploadResumeForm.patchValue({
        JobTittile:{'Id':this.jobId}
      });
      this.UploadResumeForm.get('JobTittile').disable();
    }
   });
   if(this.jobId){
    this.getActiveJobAllWithJobId();
   }else{
    this.getActiveJobAll();
   }
    
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     });
     this.UploadResumeForm.get('JobReferenceId').disable();
     this.UploadResumeForm.get('clientName').disable();
  }

  /*
    @Who: Renu
    @When: 28-june-2021
    @Why: EWM-1895
    @What: to compare objects selected
  */
    compareFn(c1: any, c2:any): boolean {     
      return c1 && c2 ?  c1.Id === c2.Id : c1 === c2; 
  }
  
  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who:  Renu
 @When: 01-July-2022
 @Why: EWM-1732 EWM-7404
 @What: to check the file type
*/
  onDismiss(): void {
    document.getElementsByClassName("uploadNewResume")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("uploadNewResume")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
  }

  /*
 @Type: File, <ts>
 @Name: selectFile function
 @Who:  Renu
 @When: 01-July-2022
 @Why: EWM-1732 EWM-7404
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
    this.Uploadfile(this.fileBinary);
  }

}

 /*
    @Type: File, <ts>
    @Name: validateFile function
    @Who:  Renu
    @When: 01-July-2022
    @Why: EWM-1732 EWM-7404
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
 @Name: Uploadfile
 @Who:  Renu
 @When: 01-July-2022
 @Why: EWM-1732 EWM-7404
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
  this.loading = false; 
  this.filestatus = false;
}


uploadCoverPage(){
  const formData = new FormData();
  formData.append('file',this.uploadFiles);
  this.candidateService.FileUploadFile(formData)
    .subscribe((data: ResponceData) => {
      if (data.HttpStatusCode == 200) {
        this.loading = false;
        this.filePath = data.Data[0].FilePathOnServer;
        this.docFileSize = data.Data[0].SizeOfFile;
        this.previewUrl =  data.Data[0].Preview;
        this.UploadFileName = data.Data[0].UploadFileName;       
        localStorage.setItem('Image', '2');  
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
     @Name: onConfirm function
     @Who:  Renu
     @When: 01-July-2022
     @Why: EWM-1732 EWM-7404
     @What: on save pop-up button file
   */

  onConfirm(): void {
    if (this.UploadResumeForm.invalid) {
      return;
    }  
    if(this.candidateId){
      this.checkDuplicity();
    }else{
      this.saveUploadCoverLetter();  
    }
   
    this.isSubmit=true; 
   
  }

  /*
     @Type: File, <ts>
     @Name: checkDuplicity function
     @Who:  Renu
     @When: 01-July-2022
     @Why: EWM-1732 EWM-7404
     @What: on save pop-up button file
   */

  checkDuplicity()
  {  
    if(this.UploadResumeForm.controls['CoverPageField'].value=='' || this.candidateId===undefined || this.candidateId===null)
    {
      return;
    }
     let  Id=0;
     let  Value= this.UploadResumeForm.controls['CoverPageField'].value;     
     let  UserTypeId =this.candidateId;    
    this.candidateService.checkduplicity('?id='+Id+'&Value='+Value+'&UserTypeId='+UserTypeId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
           this.UploadResumeForm.get("CoverPageField").setErrors({codeTaken: true});
           this.UploadResumeForm.get("CoverPageField").markAsDirty();
          }
        }
        else if (data.HttpStatusCode == 204) {        
            this.UploadResumeForm.get("CoverPageField").clearValidators();
            this.UploadResumeForm.get("CoverPageField").markAsPristine();
            this.UploadResumeForm.get('CoverPageField').setValidators([Validators.required, Validators.maxLength(150)]);
            this.UploadResumeForm.get("CoverPageField").updateValueAndValidity();
            if (this.isSubmit && this.isSubmit == true) { 
              this.saveUploadCoverLetter();  
            }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }
  /*
     @Type: File, <ts>
     @Name: saveUploadCoverLetter function
     @Who:  Renu
     @When: 01-July-2022
     @Why: EWM-1732 EWM-7404
     @What: on save pop-up button file
   */
  saveUploadCoverLetter(): void {
    if (this.UploadResumeForm.invalid) {
      return;
    }  
    let uploadInfo = {};
    uploadInfo['CandidateId'] = this.candidateId;
    uploadInfo['Name'] = this.UploadResumeForm.value.CoverPageField;
    uploadInfo['JobTitle']= this.UploadResumeForm.getRawValue().JobTittile?.JobTitle;
    uploadInfo['JobId']= this.UploadResumeForm.getRawValue().JobTittile?.Id; 
    uploadInfo['Source']= this.UploadResumeForm.getRawValue().JobReferenceId;     
    uploadInfo['clientName']= this.UploadResumeForm.getRawValue().clientName;
    uploadInfo['CoverLetterURL'] = this.filePath;
    uploadInfo['ActualFileName'] = this.UploadFileName;
    uploadInfo['FileSize'] = this.docFileSize.toString();
    document.getElementsByClassName("uploadNewResume")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("uploadNewResume")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close({ data: uploadInfo}); }, 200);

  }

 /*
  @Type: File, <ts>
  @Name: getActiveJobAll function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-1732 EWM-7404, EWM-6720 
  @What: For Job Mapped To Candidate All ForSerch
  */

 getActiveJobAll() {
  this.loading = true;
  this.jobService.getActiveJobAll().subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        this.JobTitleList = repsonsedata.Data;
        this.OnJobChange(this.JobTitleList.filter(x=>x['Id']==this.jobId)[0]);
      } else {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
 /*
  @Type: File, <ts>
  @Name: getActiveJobAllWithJobId function
  @Who: Nitin Bhati
  @When: 07-Sep-2022
  @Why: EWM-8485
  @What: For Job Mapped To Candidate All ForSerch
  */
  getActiveJobAllWithJobId() {
    this.loading = true;
    this.jobService.getActiveJobAllWithJobId(this.jobId).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.JobTitleList = repsonsedata.Data;
          this.OnJobChange(this.JobTitleList);
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode); 
      })
  }

OnJobChange(event){
  if(event==undefined){
    this.isJobDetails = false;
    this.clientNameData = '';
    this.jobReferenceIdData = undefined;
  }else{ 
    this.isJobDetails = true;
  this.clientNameData = event.ClientName;
  this.Jobtitle = event.Jobtitle;
  this.jobReferenceIdData = event.JobReferenceId;
  this.UploadResumeForm.get('JobTittile').disable();
  this.UploadResumeForm.get('JobReferenceId').disable();
  this.UploadResumeForm.get('clientName').disable();
  this.UploadResumeForm.patchValue({
    JobTittile:event.Jobtitle,
    JobReferenceId:event.JobReferenceId,
    clientName:this.clientNameData,
  })
}
}

/*
 @Type: File, <ts>
 @Name: formatBytes
 @Who:  Renu
 @When: 01-July-2022
 @Why: EWM-1732 EWM-7404
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
 @Name: removeImage
 @Who:  Renu
 @When: 01-July-2022
 @Why: EWM-1732 EWM-7404
 @What: for remove document uploaded data
 */
removeImage(filePathOnServer) {
  this.filestatus = true;
}

openDoc(url:any){
  window.open(url, '_blank');
}


 /*
 @Type: File, <ts>
 @Name: documentDataFetchFromChild
 @Who:  Renu
 @When: 01-July-2022
 @Why: EWM-1732 EWM-7404
 @What: for patch document data 
 */
documentDataFetchFromChild(FileDetails:any){
  if(FileDetails!=undefined){
  const list = FileDetails?.File?.name.split('.');
  this.uploadFiles = FileDetails.File;  
  let UploadDocument = FileDetails.File;
  this.UploadResumeForm.patchValue({
    file: UploadDocument,
    CoverPageField: list[0],
  });
    this.uploadCoverPage();
  }else{
    this.UploadResumeForm.patchValue({
      file: null,
      CoverPageField: null,
    });
  }

}

}
