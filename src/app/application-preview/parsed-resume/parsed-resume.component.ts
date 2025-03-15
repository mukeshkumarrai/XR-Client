/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: parsed-resume.component.ts
 @Who: Renu
 @When: 23-May-2022
 @Why: ROST-6558 EWM-6782
 @What: parse resume
 */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { PreviewSaveService } from '../shared/preview-save.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { Actions } from '../interface/actions';
import { ActionserviceService } from '../shared/actionservice.service';
import { ResponceData } from 'src/app/shared/models';
import { personalInfo } from '../interface/applicationInfo';
import { ApplicationAlertMessageComponent } from '../application-alert-message/application-alert-message.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-parsed-resume',
  templateUrl: './parsed-resume.component.html',
  styleUrls: ['./parsed-resume.component.scss']
})
export class ParsedResumeComponent implements OnInit {
  public UploadResumeInfo: FormGroup;
  @Input() filestatus: boolean;
  @Input() iconFileType: any;
  @Input() fileInfo: string;
  @Input() fileViewstatus: boolean;
  @Input() FilePathOnServer: string;
  SizeOfFile: string;
  UploadFileName: string;
  @Output() resumeParsed = new EventEmitter<any>();
  @Output() stepperNext= new EventEmitter<any>();
  //@Input() result: any;
  @Input() totalStepsCount: number;
  loading: boolean = false;
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  applicationParam: string;
  mode: any;
  applicationId: any;
  currentStep: any;
  submitActive: boolean;
  private actions: Actions;
  resumeData: personalInfo;
  JobId: any;
  autoFill: any;
  JobTittle: any;
  submitted: boolean = false;
  @Input() ApplicationFormId: any;
  orgName: boolean;
  candidateExists: boolean = false;
  public urlParam: any;
  event: boolean;
  candidateInfo: any;
  public file: any;
  public fileType: any;
  public fileSize: any;
  public fileSizetoShow: string;
  public documentTypeOptions:any;
  public uploadFiles: any;
  public docFileSize: any;
  public filePath: any;
  public previewUrl: any;
  public typeResumeSelected: number;
  public resumeInfo: any;
  @Input() lableTitleName: string;

  constructor(private snackBService: SnackBarService, private jobService: JobService, private translateService: TranslateService,
    private routes: ActivatedRoute, private fb: FormBuilder, private appSettingsService: AppSettingsService,private http: HttpClient,
    public dialog: MatDialog, private commonserviceService: CommonserviceService, private router: Router, private actionsService: ActionserviceService,
    private previewSaveService: PreviewSaveService,public candidateService: CandidateService) {
      this.emailPattern=this.appSettingsService.emailPattern;
    this.UploadResumeInfo = this.fb.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      EmailId: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      file: []
    });
    this.actions = this.actionsService.constants;
    this.fileType = appSettingsService.file_type_resume;
    this.fileSizetoShow = appSettingsService.file_file_size_small;
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
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     });
    
    this.commonserviceService.onstepperInfoChange.subscribe(res => {
      this.currentStep = res + 1;

      if (this.totalStepsCount == this.currentStep) {
        this.submitActive = true;
      } else {
        this.submitActive = false;
      }
    });

    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationId = parms?.applicationId;
        this.applicationParam = 'applicationId';
      } else if (parms?.jobId) {
        this.JobId = parms?.jobId;
        this.applicationId = parms?.applicationId;
        this.applicationParam = 'jobId';

      }
      if (parms?.mode) {
        this.mode = parms?.mode;
      }
    });
    
    this.previewSaveService.typeResumeSelectedInfoChange.subscribe((typeChosen: any) => {
      this.typeResumeSelected = typeChosen;
    });

    this.previewSaveService.onIsAutoFillInfoChange.subscribe((res: any) => {
      this.autoFill = res;
    });

    this.previewSaveService.onJobInfoChange.subscribe((res: any) => {
      this.JobTittle = res;
    });

    this.previewSaveService.IsResumeInfoChange.subscribe((res: any) => {
      this.resumeInfo = res;
      if(this.resumeInfo==0){
        this.UploadResumeInfo.get('file').setValidators(Validators.required)
      }else{
        this.UploadResumeInfo.get('file').clearValidators();
      }
    });
    // if (this.result) {
    //   this.UploadResumeInfo.patchValue({
    //     FirstName: this.result.FullName.split(' ')[0],
    //     LastName: this.result.FullName.split(' ')[1],
    //     EmailId: this.result.EmailAddress,
    //   })
    // }
  }


  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Renu
     @When: 24-May-2022
     @Why: EWM-6558 EWM-6782
     @What: on save pop-up button file
   */

  onConfirm(): void {
    let top = document.getElementById('preview-section');
    top.scrollTop = 0;
    if (this.mode == 'apply') {
      if (this.UploadResumeInfo.invalid) {
        return;
      }
      this.checkcandidate(this.UploadResumeInfo.value);
    } else {
      this.stepperNext.emit(true);
    }

  }

  /*
   @Type: File, <ts>
   @Name: onConfirm function
   @Who: Renu
   @When: 17-June-2022
   @Why: EWM-7151 EWM-7233
   @What: check candidate already exists or not
 */
  checkcandidate(value) {
    this.loading = true;
    this.jobService.checkCandidateExists('?emailid=' + value.EmailId + '&jobid=' + this.JobId).subscribe(repsonsedata => {
      this.previewSaveService.onResumeUploadInfo.next(this.UploadResumeInfo.value);
      if (repsonsedata.HttpStatusCode === 402) {
        this.loading = false;
        if (repsonsedata.Data?.JobDetails.length === 0) {
          this.stepperNext.emit(true);
      
          // this.stepper.next();
          // this.stepper.selected.completed = true;
        } else {
          this.candidateExists = true;
          //this.stepperNext.emit(true);
          // this.stepper.next();
          // this.stepper.selected.completed = true;
        }
        this.candidateInfo = repsonsedata.Data;
        this.previewSaveService.onCandidateExistsInfo.next(repsonsedata.Data);
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.loading = false;
        this.candidateExists = true;
        repsonsedata.Data['HttpStatusCode'] = 400;
        this.candidateInfo = repsonsedata.Data;
        this.previewSaveService.onCandidateExistsInfo.next(repsonsedata.Data);
        //this.stepperNext.emit(true);
        // this.stepper.next();
        // this.stepper.selected.completed = true;
      } else if (repsonsedata.HttpStatusCode === 204) {
        let obj =
        {
          "FirstName": this.UploadResumeInfo.value.FirstName,
          "LastName": this.UploadResumeInfo.value.LastName,
          "Emails": [
            {
              "Type": 0,
              "TypeName": "Main",
              "EmailId": this.UploadResumeInfo.value.EmailId,
              "IsDefault": true,
            }
          ],
        }
        this.previewSaveService.setActionRunnerFn(this.actions.PERSONAL_INFO, obj);
        this.previewSaveService.onCandidateExistsInfo.next(null);
        //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        if (this.submitted) {
          this.saveData();
        }  
        this.stepperNext.emit(true);
        // this.stepper.next();
        // this.stepper.selected.completed = true;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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

  saveData() {

    this.previewSaveService.personalInfoChange.subscribe((data: personalInfo) => {
      if (data) {
        let obj = {};
        obj['KnockoutQuestions'] = [];
        obj['PersonalInfo'] = {
          "FirstName": this.UploadResumeInfo.value.FirstName,
          "LastName": this.UploadResumeInfo.value.LastName,
          "Emails": [
            {
              "Type": 0,
              "TypeName": "Main",
              "EmailId": this.UploadResumeInfo.value.EmailId,
              "IsDefault": true,
            }
          ],
        };
        obj['ApplicationFormId'] = this.applicationId ? this.applicationId : this.ApplicationFormId;
        obj['JobId'] = this.JobId ? this.JobId : '';
        obj['JobTitle'] = this.JobTittle ? this.JobTittle : '';
        obj['Documents'] = [];
        obj['IsAutoFill'] = this.autoFill;
        obj['IsKnockoutSuccess'] = 0;

        this.jobService.saveApplicationPreview(obj).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.orgName = repsonsedata.Data.OrgName;
              this.previewSaveService.successMsg.next(repsonsedata.Data?.ThankyouMessage);
              this.previewSaveService.orgName.next(this.orgName);
              this.previewSaveService.successMsg.next(repsonsedata.Data?.ThankyouMessage);
              this.loading = false;
              this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
            } else {
              this.loading = false;
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }
  /*
@Type: File, <ts>
@Name: openDoc
@Who:Renu
@When: 24-May-2022
@Why: EWM-6558 EWM-6782
@What: for opening document data
*/

  // openDoc(url: any) {
  //   window.open(url, '_blank');
  // }


  /*
   @Type: File, <ts>
   @Name: removeImage
   @Who:Renu
   @When: 24-May-2022
   @Why: EWM-6558 EWM-6782
   @What: for remove document uploaded data
  */
  removeImage() {
    const message = 'label_titleApplicationForm';
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
      //this.result = dialogResult;
      if (dialogResult == true) {

        this.resumeParsed.emit(false);
        this.filestatus = true;
        this.FilePathOnServer = '';
        this.SizeOfFile = '';
        this.UploadFileName = '';
        this.UploadResumeInfo.reset();
        // this.UploadResumeInfo.get('file').reset();
        // this.UploadResumeInfo.get('FirstName').clearValidators();
        // this.UploadResumeInfo.get('LastName').clearValidators();
        // this.UploadResumeInfo.get('EmailId').clearValidators();
        this.UploadResumeInfo.patchValue({
          file: '',
          FirstName: '',
          LastName: '',
          EmailId: ''
        })
      }
    });
  }
  /*
  @Type: File, <ts>
  @Name: fetchDataFromParsed function
  @Who: Renu
  @When: 06-06-2022
  @Why: EWM-6558 EWM-6782
  @What: if resume cleared by candidate
  */
  fetchDataFromParent(event) {
    this.event = !event;

  }

  /*
   @Type: File, <ts>
   @Name: saveApplicationInfo
   @Who:Renu
   @When: 03-June-2022
   @Why: EWM-6558 EWM-6782
   @What: for saving application overall  data
  */
  saveApplicationInfo() {
    let top = document.getElementById('preview-section');
    top.scrollTop = 0;
    this.submitted = true;
    if (this.mode == 'apply') {
      this.checkcandidate(this.UploadResumeInfo.value);
    }
    else {
      this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
    }
  }

  /*
     @Type: File, <ts>
     @Name: onCancel
     @Who:Renu
     @When: 03-June-2022
     @Why: EWM-6558 EWM-6782
     @What: for cancel the apllication form
    */
  onCancel() {
    window.location.reload();
  }

  /*
    @Type: File, <ts>
    @Name: onContinue function
    @Who: Renu
    @When: 05-July-2022
    @Why:EWM-7404 EWM-7516
    @What: when user click on continue btn
  */
  onContinue() {
    // this.stepper.selected.completed = true;
    // this.stepper.next();
    this.stepperNext.emit(true);
      
    //this.previewSaveService.stepperDataInfo.next(this.stepper);
    this.candidateExists = false;
    let top = document.getElementById('preview-section');
    top.scrollTop = 0;
  }

  /*
  @Type: File, <ts>
  @Name: openApplicationAlertMSG
  @Who: Satya Prakash Gupta
  @When: 09-Aug-2022
  @Why: EWM-7404 EWM-7517
  @What: to open application alert message
  */
  openApplicationAlertMSG() {
    const dialogRef = this.dialog.open(ApplicationAlertMessageComponent, {
      data: { jobDetails: this.candidateInfo?.JobDetails},
      panelClass: ['xeople-modal', 'application-alert-msg', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }

  /*
 @Type: File, <ts>
 @Name: Uploadfile
 @Who:Renu
 @When: 30-Aug-2022
 @Why: EWM-7879 EWM-8490
 @What: for upload document data
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
 // console.log("fileInfo  ",this.fileInfo);
  localStorage.setItem('Image', '1');
  this.uploadFiles = file.target.files[0];
  this.loading = false; 
  this.filestatus = false;
  this.uploadResume();
 }

 /*
 @Type: File, <ts>
 @Name: formatBytes
 @Who:Renu
 @When: 30-Aug-2022
 @Why: EWM-7879 EWM-8490
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
 @Name: uploadResume
 @Who:Renu
 @When: 30-Aug-2022
 @Why: EWM-7879 EWM-8490
 @What: for saving resume data
 */

uploadResume(){
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
        let resumeinfo={
          'ResumeName':data.Data[0].UploadFileName,
          'ResumeFilePath':this.filePath
        };
        this.previewSaveService.resumeUploadInfo.next(resumeinfo);   
        localStorage.setItem('Image', '2'); 
        if(this.typeResumeSelected==1)
        {
          this.parseResume();
        }else{
         // this.resumeParsed=true;
         // this.result=null;
        
        }
 
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
     @Name: parseResume function
     @Who: Renu
     @When: 30-Aug-2022
     @Why: EWM-7879 EWM-8490
     @What: on save file parse resume
   */

  parseResume() {
 
  let FileObj = {};
  this.loading = true;
  FileObj['FileName'] = this.UploadFileName;
  FileObj['FilePath'] = this.filePath;
  this.candidateService.parseResume(FileObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
     
        this.loading = false;
       // this.result=repsonsedata.Data.ProfileDetails;
        this.previewSaveService.parsedResumeInfo.next(repsonsedata.Data);
        this.UploadResumeInfo.patchValue({
              FirstName: repsonsedata.Data?.ProfileDetails?.FullName.split(' ')[0],
              LastName: repsonsedata.Data?.ProfileDetails?.FullName.split(' ')[1],
              EmailId: repsonsedata.Data?.ProfileDetails?.EmailAddress,
           })
      //  this.stepper.selected.completed = true;
      //  this.stepper.next();
     // this.resumeParsed=true;
      } else if (repsonsedata.HttpStatusCode === 204) {

        this.loading = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);       
        this.filestatus=true;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

}
