import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-upload-cover-page',
  templateUrl: './upload-cover-page.component.html',
  styleUrls: ['./upload-cover-page.component.scss']
})
export class UploadCoverPageComponent implements OnInit {
  public isJobDetails: boolean = false;
  public loading: boolean;
  public images = [];
  public selectedFiles: any;
  public UploadResumeForm: FormGroup;
  public fileBinary: File;
  public myfilename = '';
  public candidateId: any;
  public filePath: any;
  public previewUrl: any;
  public statusList: any = [];
  fileType: any;
  fileSizetoShow: any;
  fileSize: number;
  UploadFileName: any = ""
  activestatus: string = 'Add';
  fileInfo: string;
  fileViewstatus: boolean = true;
  filestatus: boolean = true;
  public JobTitleList: any;
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';
  pageOption: any;
  public clientNameData: any;
  public jobReferenceIdData: any;
  public sortingValue: string = "JobTitle,desc";
  public isSubmit: boolean = false;
  public docFileSize: number;
  iconFileType: any;
  documentTypeOptions: any;
  jobId: string;
  isActive: any;
  candidateJobActionList=[];
  ClientName: string;
  JobReferenceId: any;
  constructor(private fb: FormBuilder, private snackBService: SnackBarService,
    private commonServiesService: CommonServiesService,
    public _sidebarService: SidebarService, private translateService: TranslateService, private http: HttpClient,
    public candidateService: CandidateService, private routes: ActivatedRoute, private _appSetting: AppSettingsService,
    public dialogRef: MatDialogRef<UploadCoverPageComponent>, private appSettingsService: AppSettingsService, @Inject(MAT_DIALOG_DATA) private data: any, private jobService: JobService,
  ) {
    this.UploadResumeForm = this.fb.group({
      CoverPageField: ['', [Validators.required, Validators.maxLength(150), Validators.minLength(1)]],
      JobTittile: [null],
      JobReferenceId: [''],
      clientName: [''],
      file: ['', [Validators.required]]
    });

    this.candidateId = data.candId;//@who:priti @why:EWM-2973 @what: 'candidate id' is coming as input @when:30-sep-2021
    this.isActive = data.isActive
    this.candidateJobActionList = data.candidateJobActionList;
    this.ClientName=data.ClientName;
    this.JobReferenceId=data.JobReferenceId;
    this.fileType = _appSetting.resume_file_file_type_medium;//_appSetting.file_file_type_medium;
    this.fileSizetoShow = _appSetting.file_img_size_large;
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

    this.routes.queryParams.subscribe((Id: any) => {
      this.jobId = Id['jobId'];
    })
  }

  ngOnInit(): void {
    this.getActiveJobAll();
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    })
  }

  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who:  Suika
 @When: 20-May-2022
 @Why: EWM-6605
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
 @Who:  Suika
 @When: 20-May-2022
 @Why: EWM-6605
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
     @Who:  Suika
     @When: 20-May-2022
     @Why: EWM-6605
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
 @Who:  Suika
 @When: 20-May-2022
 @Why: EWM-6605
 @What: for upload docuemnt data
 */
  uploadFiles: File;
  Uploadfile(file) {
    this.loading = true;
    const list = file.target.files[0].name.split('.');
    const fileType = list[list.length - 1];
    let FileTypeJson = this.documentTypeOptions.filter(x => x['type'] === fileType.toLocaleLowerCase());
    this.iconFileType = FileTypeJson[0] ? FileTypeJson[0].logo : '';
    if (!this.fileType.includes(fileType.toLowerCase())) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
      this.loading = false;
      file = null;
      return;
    }
    if (file.target.files[0].size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      this.loading = false;
      file = null;
      return;
    }

    this.fileInfo = file.target.files[0].name + '(' + this.formatBytes(file.target.files[0].size) + ')';
    localStorage.setItem('Image', '1');
    this.uploadFiles = file.target.files[0];
    this.loading = false;
    this.filestatus = false;
  }


  uploadCoverPage() {
    const formData = new FormData();
    formData.append('file', this.uploadFiles);
    this.candidateService.FileUploadFile(formData)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.loading = false;
          this.filePath = data.Data[0].FilePathOnServer;
          this.docFileSize = data.Data[0].SizeOfFile;
          this.previewUrl = data.Data[0].Preview;
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
     @Who:  Suika
     @When: 20-May-2022
     @Why: EWM-6605
     @What: on save pop-up button file
   */

  onConfirm(): void {
    if (this.UploadResumeForm.invalid) {
      return;
    }
    this.isSubmit = true;
    //who:maneesh,what:ewm-10733 for two times duplicate data show and duplicasy issu then apply this.checkDuplicity(true);,when:23/03/2023 
    this.checkDuplicity(true);

  }

  saveUploadCoverLetter(): void {
    if (this.UploadResumeForm.invalid) {
      return;
    }
    let uploadInfo = {};
    uploadInfo['CandidateId'] = this.candidateId;
    uploadInfo['Name'] = this.UploadResumeForm.value.CoverPageField;
    uploadInfo['JobTitle'] = this.UploadResumeForm.get('JobTittile').value?.JobTitle;
    uploadInfo['JobId'] = this.UploadResumeForm.get('JobTittile').value?.Id;
    uploadInfo['Source'] = this.UploadResumeForm.value.JobReferenceId;
    uploadInfo['clientName'] = this.UploadResumeForm.value.clientName;
    uploadInfo['CoverLetterURL'] = this.filePath;
    uploadInfo['ActualFileName'] = this.UploadFileName;
    uploadInfo['FileSize'] = this.docFileSize?.toString();
    this.candidateService.createCoverPage(uploadInfo).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          document.getElementsByClassName("uploadNewResume")[0].classList.remove("animate__fadeInDownBig")
          document.getElementsByClassName("uploadNewResume")[0].classList.add("animate__fadeOutUpBig");
          setTimeout(() => { this.dialogRef.close({ data: this.previewUrl, filePath: this.filePath, UploadFileName: uploadInfo['Name'] }); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
          this.UploadResumeForm.reset();
          this.isSubmit = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Type: File, <ts>
   @Name: getActiveJobAll function
   @Who: Suika
   @When: 16-May-2022
   @Why: EWM-6605, EWM-6720 
   @What: For Job Mapped To Candidate All ForSerch
   */

  getActiveJobAll() {
    this.loading = true;
    this.jobService.getActiveJobAll(this.isActive).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.JobTitleList = repsonsedata['Data'];
          if (this.isActive == 0) {
           if (this.JobTitleList.length) {
            this.UploadResumeForm.patchValue({
              JobTittile: this.candidateJobActionList[0].JobTitle
            });
            this.UploadResumeForm.controls['JobTittile'].disable();
            this.isJobDetails = true;
            this.clientNameData = this.ClientName;
            this.jobReferenceIdData = this.JobReferenceId;
            this.UploadResumeForm.get('JobReferenceId').disable();
            this.UploadResumeForm.get('clientName').disable();
            this.UploadResumeForm.patchValue({
              JobReferenceId: this.JobReferenceId,
              clientName: this.clientNameData,
            })
          }
          }
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  setDefaultJobTitle() {
    this.JobTitleList = this.JobTitleList.filter(job => job.Id == this.jobId);
    if (this.JobTitleList.length) {
      this.UploadResumeForm.patchValue({
        JobTittile: this.JobTitleList[0]
      });
      this.UploadResumeForm.controls['JobTittile'].disable();
      this.isJobDetails = true;
      this.clientNameData = this.JobTitleList[0].ClientName;
      this.clientNameData = this.JobTitleList[0].ClientName;
      this.jobReferenceIdData = this.JobTitleList[0].JobReferenceId;
      this.UploadResumeForm.get('JobReferenceId').disable();
      this.UploadResumeForm.get('clientName').disable();
      this.UploadResumeForm.patchValue({
        JobReferenceId: this.JobTitleList[0].JobReferenceId,
        clientName: this.clientNameData,
      })
    }
  }

  getEvent:any;
  OnJobChange(event) {
    if (event == undefined) {
      this.isJobDetails = false;
      this.clientNameData = '';
      this.jobReferenceIdData = undefined;
      this.getEvent = event;

    } else {
      this.isJobDetails = true;
      this.clientNameData = event.ClientName;
      this.clientNameData = event.ClientName;
      this.jobReferenceIdData = event.JobReferenceId;
      this.UploadResumeForm.get('JobReferenceId').disable();
      this.UploadResumeForm.get('clientName').disable();
      this.UploadResumeForm.patchValue({
        JobReferenceId: event.JobReferenceId,
        clientName: this.clientNameData,
      })
      this.getEvent = event;
      this.checkDuplicity(false);
    }
  }

  //who:maneesh,what:ewm-10733 for two times duplicate data show and duplicasy issu then apply checkDuplicity(value),when:23/03/2023 
  checkDuplicity(value) {
    
    if (this.UploadResumeForm.controls['CoverPageField'].value == '') {
      return;
    }
    let Id = 0;
    let Value = this.UploadResumeForm.controls['CoverPageField'].value;
    let UserTypeId = this.candidateId;
    let ob;
    if (this.data.pageName === 'CAND') {
      this.jobId = this.getEvent?.Id;
      if (this.jobId) {
        ob = '?id=' + Id + '&Value=' + Value + '&UserTypeId=' + UserTypeId +'&jobid='+this.jobId;
      }
      else{
        ob = '?id=' + Id + '&Value=' + Value + '&UserTypeId=' + UserTypeId;
      }
    }
    else{
      ob = '?id=' + Id + '&Value=' + Value + '&UserTypeId=' + UserTypeId +'&jobid='+this.jobId;
    }
    this.candidateService.checkduplicity(ob).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          //who:maneesh,what:ewm-10733 for two times duplicate data show and duplicasy issu then apply (keyup)="checkDuplicity(false),when:23/03/2023 
          this.UploadResumeForm.get("CoverPageField").setErrors({ codeTaken: true });
          this.UploadResumeForm.get("CoverPageField").markAsDirty();
          this.UploadResumeForm.get('CoverPageField').setValidators([Validators.required, Validators.maxLength(150)]);
          if (data.Data == false) {
            this.UploadResumeForm.get("CoverPageField").setErrors({ codeTaken: true });
            this.UploadResumeForm.get("CoverPageField").markAsDirty();
          }
        }
        if (data.HttpStatusCode == 204) {
          this.UploadResumeForm.get("CoverPageField").clearValidators();
          this.UploadResumeForm.get("CoverPageField").markAsPristine();
          this.UploadResumeForm.get('CoverPageField').setValidators([Validators.required, Validators.maxLength(150)]);
          this.UploadResumeForm.get("CoverPageField").updateValueAndValidity();
          //who:maneesh,what:ewm-10733 for two times duplicate data show and duplicasy issu then apply value===true,when:23/03/2023 
          if (value === true && this.isSubmit) {
            this.saveUploadCoverLetter();
          }
        }
        else {
         // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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




  /*
   @Type: File, <ts>
   @Name: formatBytes
   @Who:  Suika
   @When: 20-May-2022
   @Why: EWM-6605
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
 @Who:  Suika
 @When: 20-May-2022
 @Why: EWM-6605
 @What: for remove document uploaded data
 */
  removeImage(filePathOnServer) {
    this.filestatus = true;
  }

  openDoc(url: any) {
    window.open(url, '_blank');
  }


  /*
  @Type: File, <ts>
  @Name: documentDataFetchFromChild
  @Who:  Suika
  @When: 20-May-2022
  @Why: EWM-6605
  @What: for patch document data 
  */
  documentDataFetchFromChild(FileDetails: any) {
    if (FileDetails != undefined) {
      this.uploadFiles = FileDetails.File;
      let UploadDocument = FileDetails.File;
      this.UploadResumeForm.patchValue({
        file: UploadDocument
      });
      this.uploadCoverPage();
    }

  }

}
