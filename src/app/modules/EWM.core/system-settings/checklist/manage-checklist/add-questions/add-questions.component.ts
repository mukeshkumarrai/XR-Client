import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';


@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  public isJobDetails:boolean = false;
  public loading: boolean;
  public images = [];
  public selectedFiles: any;
  public addQuestionsForm: FormGroup;
  public fileBinary: File;
  public myfilename = '';
  public candidateId: any;
  public filePath: any;
  public previewUrl: any;
  public statusList:any = [];
  fileType: any;
  fileSizetoShow: any;
  fileSize: number;
  UploadFileName: any = ""
  activestatus: string = 'Add';
  fileInfo= {};
  fileViewstatus: boolean = true;  
  filestatus: boolean = false;
  public JobTitleList:any;
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';  
  pageOption: any;  
  public clientNameData:any;
  public jobReferenceIdData:any;
  public sortingValue: string = "JobTitle,desc";  
  public isSubmit:boolean = false;
  public docFileSize:number;
  iconFileType: any;
  documentTypeOptions:any;  
  public fileAttachments: any[] = [];  
  public fileAttachmentsOnlyTow:any[]=[];
  uploadFiles: File;
  questionList:any=[];
  phoneDuplicate:boolean=false;  
  public codePattern = '^[A-Za-z0-9]{1,300}$';
  public checklistId:any=0;
  dirctionalLang;
  constructor(private fb: FormBuilder, private snackBService: SnackBarService, public dialog: MatDialog,
    private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService,
    public _sidebarService: SidebarService, private translateService: TranslateService,private http: HttpClient,
    public candidateService: CandidateService, private routes: ActivatedRoute, private _appSetting: AppSettingsService,
    public dialogRef: MatDialogRef<AddQuestionsComponent>, private appSettingsService: AppSettingsService, @Inject(MAT_DIALOG_DATA) private data: any,private jobService: JobService,
  ) {
    this.addQuestionsForm = this.fb.group({
      ChecklistId:[],
      Question: ['', [Validators.required,Validators.maxLength(300), Validators.minLength(1),this.noWhitespaceValidator()]],
      IsResponseFreeText:[null],
      DisplaySequence:[],     
      Attachment: [[]],
      // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
      IsAttachment:[null],
      // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
      IsMandatory:[null]
    });
    if(data!=undefined || data!=null){     
      this.questionList = data?.checklistDataArr;
      if(data?.editedRow?.value?.Attachment!=undefined){      
        this.fileAttachmentsOnlyTow = data?.editedRow?.value?.Attachment;
        this.fileAttachments = data?.editedRow?.value?.Attachment;   
            
      }   
      if(data?.checklistId!=undefined){
        this.checklistId = data?.checklistId;
      }      
      this.addQuestionsForm.patchValue({
        ChecklistId:data?.editedRow?.value?.ChecklistId,
        Question:data?.editedRow?.value?.Question,
        IsResponseFreeText:data?.editedRow?.value?.IsResponseFreeText,
        // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
        IsAttachment:data?.editedRow?.value?.IsAttachment,
        // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
        IsMandatory:data?.editedRow?.value?.IsMandatory,
        DisplaySequence:data?.editedRow?.value?.DisplaySequence,
        Attachment:this.fileAttachments
      })
      
    
    // this.fileAttachmentsOnlyTow = data?.editedRow?.value?.files;
    // this.fileAttachments = data?.editedRow?.value?.files;
    }

    this.fileType = _appSetting.file_file_type_extralarge;
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
  }

  ngOnInit(): void {  
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     })
  }

  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who:  Suika
 @When: 04-Aug-2022
 @Why: EWM-7427
 @What: to check the file type
*/
  onDismiss(): void {
    document.getElementsByClassName("xeople-modal")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("xeople-modal")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
  }

 
 /*
    @Type: File, <ts>
    @Name: validateFile function
    @Who:  Suika
    @When: 04-Aug-2022
    @Why: EWM-7427
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


 

uploadQuestionAttachment(){
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
     @Who: Suika
     @When: 04-Aug-2022
     @Why: EWM-7427 EWM-7635
     @What: on save pop-up button file
   */

  onConfirm(): void {
    this.isSubmit = true;
    if (this.addQuestionsForm.invalid) {
      this.isSubmit=false;  
      return;    
    } 
    this.checkDuplicity();
  }
 
checkDuplicity()
  {  
    if(this.addQuestionsForm.controls['Question'].value=='' || this.addQuestionsForm.controls['Question'].value==undefined)
    {     
      return;
    } 
    let quesforEdit;
    if(this.data?.editedRow?.value?.Question!=undefined){
      quesforEdit = this.data?.editedRow?.value?.Question;
    }
    const checkquesExistence = this.questionList.some(item => item.Question.toUpperCase().trim() == this.addQuestionsForm.controls['Question'].value.toUpperCase().trim() &&  item.Question != quesforEdit)
     if (checkquesExistence === true) {
      this.addQuestionsForm.get("Question").setErrors({codeTaken: true});
      this.addQuestionsForm.get("Question").markAsDirty();
      return;
    }

    if (this.addQuestionsForm && this.isSubmit == true) { 
      let Id = 0; 
      let quesArr = {};
      let responseArr = [];
      quesArr['Id']=Id;
      quesArr['Question']= this.addQuestionsForm.controls['Question'].value;
      quesArr['DisplaySequence']= this.addQuestionsForm.controls['DisplaySequence'].value?this.addQuestionsForm.controls['DisplaySequence'].value:0;
      quesArr['IsResponseFreeText']= this.addQuestionsForm.controls['IsResponseFreeText'].value?this.addQuestionsForm.controls['IsResponseFreeText'].value:0;
      // who:maneesh,what:ewm-10404 for add required checkbox IsAttachment when:02/06/2023
      quesArr['IsAttachment']= this.addQuestionsForm.controls['IsAttachment'].value?this.addQuestionsForm.controls['IsAttachment'].value:0;
      quesArr['Attachment']= this.fileAttachments;
      // who:Ankt Rawat,what:EWM-17538 Added mandatory checkbox for make this required field, when:05Jul24
      quesArr['IsMandatory']=this.addQuestionsForm.controls['IsMandatory'].value?this.addQuestionsForm.controls['IsMandatory'].value:0;
      responseArr.push(quesArr);
      document.getElementsByClassName("xeople-modal")[0].classList.remove("animate__fadeInDownBig")
      document.getElementsByClassName("xeople-modal")[0].classList.add("animate__fadeOutUpBig");
      setTimeout(() => { this.dialogRef.close(responseArr[0]); }, 100);
      }
   
   /*   let  Id=0;
     let quesArr = {};
     let formArr = [];
     quesArr['Id']=Id;
     quesArr['Question']= this.addQuestionsForm.controls['Question'].value.toLowerCase().trim();
     quesArr['ChecklistId']= this.addQuestionsForm.controls['ChecklistId'].value;
     formArr.push({'question':[quesArr],'ChecklistId':parseInt(this.checklistId),'isFreeText':this.addQuestionsForm.controls['IsResponseFreeText'].value});
    this.systemSettingService.checkduplicateQuestions(formArr[0]).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
           this.addQuestionsForm.get("Question").setErrors({codeTaken: true});
           this.addQuestionsForm.get("Question").markAsDirty();
           this.isSubmit = false; 
          }
        }
        else if (data.HttpStatusCode == 204) {        
            this.addQuestionsForm.get("Question").clearValidators();
            this.addQuestionsForm.get("Question").markAsPristine();
            this.addQuestionsForm.get('Question').setValidators([Validators.required,Validators.maxLength(300),this.noWhitespaceValidator()]);
            this.addQuestionsForm.get("Question").updateValueAndValidity();
            if (this.addQuestionsForm && this.isSubmit == true) {
            let Id = 0; 
            let quesArr = {};
            let responseArr = [];
            quesArr['Id']=Id;
            quesArr['Question']= this.addQuestionsForm.controls['Question'].value;
            quesArr['DisplaySequence']= this.addQuestionsForm.controls['DisplaySequence'].value?this.addQuestionsForm.controls['DisplaySequence'].value:0;
            quesArr['IsResponseFreeText']= this.addQuestionsForm.controls['IsResponseFreeText'].value?this.addQuestionsForm.controls['IsResponseFreeText'].value:0;
            quesArr['Attachment']= this.fileAttachments;
            responseArr.push(quesArr);
            document.getElementsByClassName("xeople-modal")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("xeople-modal")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => { this.dialogRef.close(responseArr[0]); }, 100);
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
*/
    
  }




/*
 @Type: File, <ts>
 @Name: formatBytes
 @Who: Suika
 @When: 04-Aug-2022
 @Why: EWM-7427 EWM-7635
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
 @Who: Suika
 @When: 04-Aug-2022
 @Why: EWM-7427 EWM-7635
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
 @Who: Suika
 @When: 04-Aug-2022
 @Why: EWM-7427 EWM-7635
 @What: for patch document data 
 */
documentDataFetchFromChild(FileDetails:any){
  if(FileDetails!=undefined){
  this.uploadFiles = FileDetails.File;  
  let UploadDocument = FileDetails.File;
  this.addQuestionsForm.patchValue({
    file: UploadDocument   
  });
    this.uploadQuestionAttachment();
  }

}



/*
   @Type: File, <ts>
   @Name: openMultipleAttachmentModal function
   @Who: Suika
   @When: 04-Aug-2022
   @Why: EWM-7427 EWM-7635
   @What: For Open Model For Multiple Attachment
 */
openMultipleAttachmentModal() {
  const dialogRef = this.dialog.open(CustomAttachmentPopupComponent, {
    maxWidth: "600px",
    data: new Object({ fileType:this.fileType, fileSize: this.fileSize , fileSizetoShow:this.fileSizetoShow, 
    fileAttachments: this.fileAttachments}),
    width: "100%",
    maxHeight: "85%",
    panelClass: ['customAttachment', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res.isFile == true) {
      this.fileAttachments=[];
       this.fileAttachments= res.fileAttachments;
    if(this.fileAttachments.length>2){
      this.fileAttachmentsOnlyTow=  this.fileAttachments.slice(0, 2)
    }else{
      this.fileAttachmentsOnlyTow=  this.fileAttachments
    }

    }
  })

  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

}


  /*
   @Type: File, <ts>
   @Name: removeAttachment function
   @Who: Suika
   @When: 04-Aug-2022
   @Why: EWM-7427 EWM-7635
   @What: For remove Attachment
*/
removeAttachment(fileInfo:any){
  const index: number = this.fileAttachments.indexOf(fileInfo);
  if (index !== -1) {
      this.fileAttachments.splice(index, 1);
  } 

  if(this.fileAttachments.length>2){
    this.fileAttachmentsOnlyTow=  this.fileAttachments.slice(0, 2)
  }else{
    this.fileAttachmentsOnlyTow=  this.fileAttachments
  }
}
 

noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}
