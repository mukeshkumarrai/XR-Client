/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: upload-resume.component.ts
 @Who: Renu
 @When: 24-May-2022
 @Why: ROST-6558 EWM-6782
 @What: upload resume
 */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnockoutQuesComponent } from '../knockout-ques/knockout-ques.component';
import { AppSettingsService } from '../../shared/services/app-settings.service';
import { SnackBarService } from '../../shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../modules/EWM.core/shared/services/candidates/candidate.service';
import { FileUploaderService } from '../../shared/services/file-uploader.service';
import { ResponceData } from '../../shared/models';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { PreviewSaveService } from '../shared/preview-save.service';


@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.scss']
})
export class UploadResumeComponent implements OnInit {

  isLinear = true;
  public filestatus: boolean = true;
  public fileInfo: string;
  public fileViewstatus: boolean = true;
  public FilePathOnServer: string;
  public SizeOfFile: string;
  public UploadFileName: string;
  // public file: any;
  // public fileType: any;
  // public fileSize: any;
  // public fileSizetoShow: string;
  public loading: boolean;
  public documentTypeOptions:any;
  public iconFileType: any;
  public uploadFiles: any;
  public UploadResumeForm: FormGroup;
  public docFileSize: any;
  public filePath: any;
  public previewUrl: any;
  public resumeParsed:boolean=false;
  public selectedIndex: any;
  public totalStepsCount: number;
  public laststep: boolean;
 // public result: any;
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @Output() showUploadResume= new EventEmitter<any>();
  //@Input() typeResumeSelected:number;
  @Input() stepperConfig:any;
  @Input() ApplicationFormId:any;
  public mode: any;
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
  
  constructor( private _appSetting: AppSettingsService, public uploader: FileUploaderService,public commonService:CommonserviceService, 
    private translateService: TranslateService, private snackBService: SnackBarService,private http: HttpClient,
    private fb: FormBuilder,public candidateService: CandidateService,private routes: ActivatedRoute,
     private jobService: JobService,private previewSaveService: PreviewSaveService
    ) {
       // this.UploadResumeForm = this.fb.group({
      //   file: ['', [Validators.required]]
      // });
    // this.fileType = _appSetting.file_type_resume;
    // this.fileSizetoShow = _appSetting.file_file_size_small;
    // if (this.fileSizetoShow.includes('KB')) {
    //   let str = this.fileSizetoShow.replace('KB', '')
    //   this.fileSize = Number(str) * 1000;
    // }
    // else if (this.fileSizetoShow.includes('MB')) {
    //   let str = this.fileSizetoShow.replace('MB', '')
    //   this.fileSize = Number(str) * 1000000;
    // }
    
   }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if(parms?.mode){
        this.mode=parms?.mode;
      }
    });
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
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
 moveNextStep(event){
    this.stepper.selected.completed = true;
     this.stepper.next();
 }

  openDoc(url:any){
    window.open(url, '_blank');
  }

/*
 @Type: File, <ts>
 @Name: removeImage
 @Who:Renu
 @When: 24-May-2022
 @Why: EWM-6558 EWM-6782
 @What: for remove document uploaded data
*/
 removeImage() {
  this.resumeParsed=false;
  this.filestatus = true;
  this.FilePathOnServer='';
  this.SizeOfFile='';
  this.UploadFileName='';
  // this.UploadResumeForm.get('FirstName').clearValidators();
  // this.UploadResumeForm.get('LastName').clearValidators();
  // this.UploadResumeForm.get('EmailId').clearValidators();
  this.UploadResumeForm.patchValue({
    file:'',
    // FirstName:'',
    // LastName:'',
    // EmailId:''
  })
}

// /*
//  @Type: File, <ts>
//  @Name: Uploadfile
//  @Who:Renu
//  @When: 24-May-2022
//  @Why: EWM-6558 EWM-6782
//  @What: for upload document data
//  */

//  Uploadfile(file) {
//   this.loading = true; 
//   const list = file.target.files[0].name.split('.');
//   const fileType = list[list.length - 1];
//   let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
//   this.iconFileType= FileTypeJson[0]? FileTypeJson[0].logo:'';
//   if (!this.fileType.includes(fileType.toLowerCase())) {
//     this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
//     this.loading=false;
//     file = null;
//     return;
//   }
//   if (file.target.files[0].size > this.fileSize) {
//     this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
//     this.loading=false;
//     file = null;
//     return;
//   }

//   this.fileInfo = file.target.files[0].name + '(' + this.formatBytes(file.target.files[0].size) + ')';
//  // console.log("fileInfo  ",this.fileInfo);
//   localStorage.setItem('Image', '1');
//   this.uploadFiles = file.target.files[0];
//   this.loading = false; 
//   this.filestatus = false;
//  }

//  /*
//  @Type: File, <ts>
//  @Name: formatBytes
//  @Who:Renu
//  @When: 24-May-2022
//  @Why: EWM-6558 EWM-6782
//  @What: for convert data Kb and mb
//  */
//  formatBytes(bytes: number): string {
//   const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
//   const factor = 1024;
//   let index = 0;

//   while (bytes >= factor) {
//     bytes /= factor;
//     index++;
//   }
//   return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
// }

// /*
//  @Type: File, <ts>
//  @Name: uploadResume
//  @Who:Renu
//  @When: 24-May-2022
//  @Why: EWM-6558 EWM-6782
//  @What: for saving resume data
//  */

// uploadResume(){
//   const formData = new FormData();
//   formData.append('file',this.uploadFiles);
//   this.candidateService.FileUploadFile(formData)
//     .subscribe((data: ResponceData) => {
//       if (data.HttpStatusCode == 200) {
//         this.loading = false;
//         this.filePath = data.Data[0].FilePathOnServer;
//         this.docFileSize = data.Data[0].SizeOfFile;
//         this.previewUrl =  data.Data[0].Preview;
//         this.UploadFileName = data.Data[0].UploadFileName; 
//         let resumeinfo={
//           'ResumeName':data.Data[0].UploadFileName,
//           'ResumeFilePath':this.filePath
//         };
//         this.previewSaveService.resumeUploadInfo.next(resumeinfo);   
//         localStorage.setItem('Image', '2'); 
//         if(this.typeResumeSelected==1)
//         {
//           this.parseResume();
//         }else{
//           this.resumeParsed=true;
//           this.result=null;
        
//         }
 
//       } else if (data.HttpStatusCode === 400) {
//         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
//         this.loading = false;
//       } else {
//         this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
//         this.loading = false;
//       }
//     }, err => {
//       this.loading = false;
//       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
//     });
// }

//  /*
//      @Type: File, <ts>
//      @Name: parseResume function
//      @Who: Renu
//      @When: 24-May-2022
//      @Why: EWM-6558 EWM-6782
//      @What: on save file parse resume
//    */

//   parseResume() {

//   //  this.UploadResumeForm.get('FirstName').setValidators(Validators.required);
//   //  this.UploadResumeForm.get('LastName').setValidators(Validators.required);
//   //  this.UploadResumeForm.get('EmailId').setValidators(Validators.required);
 
//   let FileObj = {};
//   this.loading = true;
//   FileObj['FileName'] = this.UploadFileName;
//   FileObj['FilePath'] = this.filePath;
//   this.candidateService.parseResume(FileObj).subscribe(
//     (repsonsedata: ResponceData) => {
//       if (repsonsedata.HttpStatusCode === 200) {
     
//         this.loading = false;
//         this.result=repsonsedata.Data.ProfileDetails;
//         this.previewSaveService.parsedResumeInfo.next(repsonsedata.Data);
//       //  this.stepper.selected.completed = true;
//       //  this.stepper.next();
//       this.resumeParsed=true;
//       } else if (repsonsedata.HttpStatusCode === 204) {

//         this.loading = false;
//       } else {
//         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);       
//         this.filestatus=true;
//         this.loading = false;
//       }
//     }, err => {
//       this.loading = false;
//       //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

//     })
// }

  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Renu
     @When: 24-May-2022
     @Why: EWM-6558 EWM-6782
     @What: on save pop-up button file
   */

    //  onConfirm(): void {
    //    if(this.mode=='apply'){
    //     if (this.UploadResumeForm.invalid) {
    //       return;
    //     }  
    //     this.uploadResume();
    //    }else{
    //     // this.stepper.next();
    //      this.resumeParsed=true;
    //    }
     
    // }
  
    ngAfterViewInit(){
     // setTimeout(() => {
        this.totalStepsCount=this.stepper._steps.length;
      //}, 1500);
     
    }
/*
@Type: File, <ts>
@Name: setIndex function
@Who: Renu
@When: 23-05-2022
@Why: EWM-6558 EWM-6782
@What: get index on step change
*/
setIndex(event) {
  this.selectedIndex = event.selectedIndex;
  this.commonService.stepperSelectedInfo.next(event.selectedIndex);
  
}

/*
@Type: File, <ts>
@Name: fetchDataFromParsed function
@Who: Renu
@When: 06-06-2022
@Why: EWM-6558 EWM-6782
@What: if resume cleared by candidate
*/
fetchDataFromParsed(event){
this.resumeParsed=event; this.filestatus = true;
this.FilePathOnServer='';
this.SizeOfFile='';
this.UploadFileName='';
this.UploadResumeForm.patchValue({
  file:''
})

  }

  goPrevious(){
    this.showUploadResume.emit(false);
  }
}
