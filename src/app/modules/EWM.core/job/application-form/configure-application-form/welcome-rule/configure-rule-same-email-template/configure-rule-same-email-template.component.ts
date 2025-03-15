/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Suika
  @When: 22-Dec-2022
  @Why: EWM-1732 EWM-9629
  @What:  This page will be use for the New Compone Email component ts file
*/


import { Component, OnInit, Inject, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { FileUploaderService } from 'src/app/shared/services/file-uploader.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { customDropdownConfig, UserEmailIntegration } from 'src/app/modules/EWM.core/shared/datamodels';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ContactReceipentPopupComponent } from 'src/app/modules/EWM.core/shared/contact-receipent-popup/contact-receipent-popup.component';
import { TemplatesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/templates/templates.component';
import { EmailPreviewPopupComponent } from 'src/app/modules/EWM.core/system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JobEmailTemplatesComponent } from '../job-email-templates/job-email-templates.component';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
export interface Email {
  name: string;
}


@Component({
  selector: 'app-configure-rule-same-email-template',
  templateUrl: './configure-rule-same-email-template.component.html',
  styleUrls: ['./configure-rule-same-email-template.component.scss']
})
export class ConfigureRuleSameEmailTemplateComponent implements OnInit {

  public showCC : boolean = false;
  public showBCC : boolean = false;
  @ViewChild('fileInput') fileInput;
  public prevUploadedFileCount: number = 0;
  public prevUploadedFileSize: number = 0;

  newEmailTemplateForm:FormGroup;
  public specialcharPattern="^[A-Za-z0-9 ]+$";
  public attachmentName:string;
  public docName:any;
  public docId:any;

  public toEmailList=[];
  public ccEmailList = [];
  public bccEmailList = [];
  @ViewChild('fileUploadQueue') fileUpload: ElementRef;
  public loading: boolean;
  public jobList=[];
  public selectedJobs:any={};
  public userEmailIntegration: UserEmailIntegration;
  public dropDoneConfig:customDropdownConfig[]=[];
  public userEmail: string;
  public fileAttachments: any[] = [];

  public fileType: any;
  public fileSize: any;
  public  filestatus: boolean = true;
  public  fileInfo: any={};
  public  uploadFiles: any;
  public  fileSizetoShow: string;
  
 @ViewChild('target') private myScrollContainer: ElementRef;
  public arr=[];
  public emailListLengthMore:number=1;
  public draftNewFlag: boolean;
  public mailprovider: any;
  public emailListLengthToMore: any=1;
  public emailListLengthccMore: any=1;
  public sendBtnDisabled: boolean;
  public readonlyField: boolean=false;
  JobReset: boolean;
  public JobId: any;
  public JoId: any;
  public JobTitle: any;
  public candidateId:any;
  public Source:any='Configure Rule';
  emailProvider: any;
  getJobDataById: any;
  public workflowId: any;
  isBulkEmailPreviewBtn: boolean = false;
  ModuleName:string;
  isBulkEmail:boolean = false;
  
  @Input() isStatusSelected:boolean=false; 
  @Input() configureRuleTemplateSameJobData:any;
  @Input() configureRuleList:any;
  @Output() emailSameJobDetails =  new EventEmitter();
  @Output() closeSameJobEmailSection = new EventEmitter();
  @Input() canTagData:any;
  @Input() jobTagData:any;
  animationVar: any;
  
  @Input() resetFormSubject: Subject<any> = new Subject<any>();
  
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
  public pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: true
  };
  addForm: FormGroup;    
  @ViewChild('editor') editor: EditorComponent;
  canData: any;
  jobData: any;

  //  kendo image uploader Adarsh singh 01-Aug-2023
subscription$: Subscription;
subscriptionOnChange$: Subscription;
// End 
public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
ownerList: string[]=[];
public showErrorDesc: boolean = false;
public tagList:any=['Jobs'];
public basic:any=[];
getEmailEditorVal:string=''
resetEditorValue: Subject<any> = new Subject<any>();
showTagDropdown:boolean=true;
  constructor(public uploader: FileUploaderService,private fb: FormBuilder, private snackBService: SnackBarService,
     private translateService: TranslateService,public dialog: MatDialog,public systemSettingService: SystemSettingService,private mailService: MailServiceService,private _profileInfoService: ProfileInfoService, 
    public _snackBarService: SnackBarService,public _encryptionDecryptionService: EncryptionDecryptionService,private appSettingsService: AppSettingsService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
      this.fileType = appSettingsService.file_file_type_extralarge;
      this.fileSizetoShow = appSettingsService.file_file_type_mail;
      if (this.fileSizetoShow.includes('KB')) {
        let str = this.fileSizetoShow.replace('KB', '')
        this.fileSize = Number(str) * 1000;
      }
      else if (this.fileSizetoShow.includes('MB')) {
        let str = this.fileSizetoShow.replace('MB', '')
        this.fileSize = Number(str) * 1000000;
      }
    
      this.newEmailTemplateForm = this.fb.group({
        Id:[''],
       // RelatedTo: ['Job', [Validators.required]],
        TemplateName:[{ value: '', disabled: true }, [Validators.required]],
        CcEmail: [''],
        BccEmail: [''],
        Subject: ['',[Validators.required,Validators.maxLength(500),this.noWhitespaceValidator]],
        TemplateText: []      
      });        

    
   
   
  
    
   /* 
      if(data && data.documentData!==undefined)
      {
        this.docName = data.documentData.Name; 
        this.docId = data.documentData.Id;     
      if(data.documentData.DocumentType=='Folder'){      
        let extension = "zip";      
        this.attachmentName = this.docName+'.'+extension; 
      }else{
        let extension  = data.documentData.UploadDocument.substring(data.documentData.UploadDocument.indexOf('.') + 1);        
        this.attachmentName = this.docName+'.'+extension; 
      }
      this.fileAttachments.push({
        'Name':  this.attachmentName,
        'Size':  data.documentData.DocumentSize,
        'Path': data.documentData.UploadDocument
      })
    this.filestatus=false;
    
      } */
  }

  ngOnInit() {
   // this.getUserEmailIntegration(); 
   this.getCanPlaceholderData();
   this.getJobPlaceholderData();
    setTimeout(() => {     
      this.patchData(this.configureRuleTemplateSameJobData);
       }, 2000);
    this.subscriptionOnChange$= this.newEmailTemplateForm?.valueChanges?.subscribe(x => {
     
        this.sendEmail();
    });
             //  @Who: maneesh, @When: 13-03-2024,@Why: EWM-16342-EWM-16207 @What: on changes on kendo editor catch the event here
             this.editorConfig={
              REQUIRED:false,
              DESC_VALUE:null,
              PLACEHOLDER:'',
              Tag:[],
              EditorTools:this.basic,
              MentionStatus:false,
              maxLength:0,
              MaxlengthErrormessage:false,     
              JobActionComment:false
  
            };
  }

  /*
    @Type: File, <ts>
    @Name: add remove animation function
    @Who: Satya Prakash Gupta
    @When: 29-Dec-2022
    @Why: EWM-9629 EWM-9900
    @What: add and remove animation
  */

  mouseoverAnimation(matIconId, animationName) {
  let amin = localStorage.getItem('animation');
  if (Number(amin) != 0) {
    document.getElementById(matIconId)?.classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList.remove(animationName)
  }


  patchData(configureRuleTemplateSameJobData){
    let len = this.configureRuleList?.length;
    if (configureRuleTemplateSameJobData?.length>0) {
                  
      let cceList = configureRuleTemplateSameJobData[0].CcEmail?.split(',');
      for (let itr2 = 0; itr2 < cceList?.length; itr2++) {
        if (cceList[itr2]?.length != 0 && cceList[itr2] != '') {
          this.ccEmailList.push({ value: cceList[itr2], invalid: false });
        }
      }
      let bcceList = configureRuleTemplateSameJobData[0].BccEmail?.split(',');
      for (let itr3 = 0; itr3 < bcceList?.length; itr3++) {
        if (bcceList[itr3]?.length != 0 && bcceList[itr3] != '') {
          this.bccEmailList.push({ value: bcceList[itr3], invalid: false });
        }
      }

      this.newEmailTemplateForm.patchValue({
        'Id':len>0?configureRuleTemplateSameJobData[0]?.Id:0,
        'TemplateName':configureRuleTemplateSameJobData[0]?.TemplateName,
        'Subject': configureRuleTemplateSameJobData[0]?.Subject,
        'TemplateText': configureRuleTemplateSameJobData[0]?.TemplateText
      });
      this.getEditorVal=configureRuleTemplateSameJobData[0]?.TemplateText;
      let ccEMailVal = '';
      let bccEMailVal = '';


      for (let i = 0; i < this.ccEmailList?.length; i++) {
        if (ccEMailVal?.length === 0 || ccEMailVal === '') {
          ccEMailVal = this.ccEmailList[i].value;
        }
        else {
          ccEMailVal += ',' + this.ccEmailList[i].value;
        }
      }
     
      for (let i = 0; i < this.bccEmailList?.length; i++) {
        if (bccEMailVal?.length === 0 || bccEMailVal === '') {
          bccEMailVal = this.bccEmailList[i].value;
        }
        else {
          bccEMailVal += ',' + this.bccEmailList[i].value;
        }
      }
     
   
      this.newEmailTemplateForm.patchValue({
        'CcEmail': ccEMailVal,
        'BccEmail': bccEMailVal
      });
     
      if(ccEMailVal!='')
      {
        this.showCC=true;
        //this.showCCBtn();
      }
      if(bccEMailVal!='')
      {
        this.showBCC=true;
        //this.showBCCBtn();
      }
      let filedata;
      filedata = configureRuleTemplateSameJobData[0].Files;
      let fSize: number = 0;
      if (filedata === undefined) {
        this.fileAttachments = [];
      }else{
       filedata.forEach(element => {
        fSize += element.Size;
         this.fileAttachments.push({
           'AttachmentName':element.AttachmentName,
           'FileSize':element.FileSize,
           'AttachmentLocation':element.AttachmentLocation
         })
       });
   
       if (fSize > this.fileSize) {
        this.filestatus=true;
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidAttachmentSize') + ' ' + this.fileSizetoShow, '');
        return;
      }else{
        this.filestatus=false;
      }
      }
      // calling function 
      // this.replaceTextIntoData(repsonsedata['Data'].TemplateText);
      this.ModuleName =configureRuleTemplateSameJobData[0]?.InternalCode;;

   }
  }
 /* 
    @Type: File, <ts>
    @Name: clickMoreRecord function
    @Who: Suika
    @When: 22-Dec-2022
    @Why: EWM-1732 EWM-9629
    @What: For showing more chip data
    */
    public clickForMoreRecord(emailArr) {
      this.emailListLengthMore = emailArr?.length;
    }
    public clickForToMoreRecord(emailArr) {
      this.emailListLengthToMore = emailArr?.length;
    }
    public clickForccMoreRecord(emailArr) {
      this.emailListLengthccMore = emailArr?.length;
    }
    
  onFileSelected(event) {
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
   // console.log('event::::::', event)
    for (let i = 0; i < files?.length; i++) {
      let file = files[i];

    }
  }


  

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }

  onDismiss(): void {
    document.getElementsByClassName("quickNewEmailModal")[0]?.classList.remove("animate__slideInRight")
    document.getElementsByClassName("quickNewEmailModal")[0]?.classList.add("animate__slideOutRight");
  //  setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp")?.classList.remove("is-blurred");
    }
  }

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: Email[] = [
    
  ];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.emails.push({name: value});
    }
  }

  remove(fruit: Email): void {
    const index = this.emails.indexOf(fruit);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }


  showCCBtn(){
    this.showCC = !this.showCC;
    if(this.showCC == true){
      document.getElementsByClassName('ccBccEmailBtn')[0]?.classList.add('activeBtnColor');
    }
    if(this.showCC == false){
      document.getElementsByClassName('ccBccEmailBtn')[0]?.classList.remove('activeBtnColor');
    }
  }

  showBCCBtn(){
    this.showBCC = !this.showBCC;
    if(this.showBCC == true){
      document.getElementsByClassName('bccBccEmailBtn')[0]?.classList.add('activeBtnColor');
    }
    if(this.showBCC == false){
      document.getElementsByClassName('bccBccEmailBtn')[0]?.classList.remove('activeBtnColor');
    }
  }

  
 
  removeccEmail(data: any): void {
    if (this.ccEmailList.indexOf(data) >= 0) {
      this.ccEmailList.splice(this.ccEmailList.indexOf(data), 1);
    }

    let eMailVal = '';
    let invalidEmail = false;

    for (let i = 0; i < this.ccEmailList?.length; i++) {
      if (this.ccEmailList[i].invalid === true) {
        invalidEmail = true;
      }

      if (eMailVal?.length === 0 || eMailVal === '') {
        eMailVal = this.ccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.ccEmailList[i].value;
      }
    }

    this.newEmailTemplateForm.patchValue({
      'CcEmail': eMailVal
    });

    if (eMailVal?.length === 0 || eMailVal === '') {
      /* this.newEmailTemplateForm.get("ccMails").clearValidators();
      this.newEmailTemplateForm.get("ccMails").setErrors({ required: true });
      this.newEmailTemplateForm.get("ccMails").markAsDirty(); */
    }
    else {
      if (invalidEmail) {
        this.newEmailTemplateForm.get("CcEmail").clearValidators();
        this.newEmailTemplateForm.controls["CcEmail"].setErrors({ 'incorrectEmail': true });
      }
    }
  }

  setCCEmailsValues() {
    let eMailVal = '';
    let IsValid = true;

    for (let i = 0; i < this.ccEmailList?.length; i++) {
      if (this.validateEmail(this.ccEmailList[i].value) === false) {
        IsValid = false;
      }

      if (eMailVal?.length === 0 || eMailVal === '') {
        eMailVal = this.ccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.ccEmailList[i].value;
      }
    }
    this.newEmailTemplateForm.patchValue({
      'CcEmail': eMailVal
    });

    if (IsValid === false) {
      this.newEmailTemplateForm.get("CcEmail").clearValidators();
      this.newEmailTemplateForm.controls["CcEmail"].setErrors({ 'incorrectEmail': true });
    }
  }

  addCC(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;

    if (event.value) {
      for (let i = 0; i < this.ccEmailList?.length; i++) {
        if (this.ccEmailList[i].value === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value)) {
          this.ccEmailList.push({ value: event.value, invalid: false });
          this.setCCEmailsValues();
        } else {
          this.ccEmailList.push({ value: event.value, invalid: true });
          this.setCCEmailsValues();
          this.newEmailTemplateForm.get("CcEmail").clearValidators();
          this.newEmailTemplateForm.controls["CcEmail"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.newEmailTemplateForm.get("CcEmail").value === null || this.newEmailTemplateForm.get("CcEmail").value === '') {
      /* this.newEmailTemplateForm.get("ccMails").clearValidators();
      this.newEmailTemplateForm.get("ccMails").setErrors({ required: true });
      this.newEmailTemplateForm.get("ccMails").markAsDirty(); */
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  removeBccEmail(data: any): void {
    if (this.bccEmailList.indexOf(data) >= 0) {
      this.bccEmailList.splice(this.bccEmailList.indexOf(data), 1);
    }

    let eMailVal = '';
    let invalidEmail = false;

    for (let i = 0; i < this.bccEmailList?.length; i++) {
      if (this.bccEmailList[i].invalid === true) {
        invalidEmail = true;
      }

      if (eMailVal?.length === 0 || eMailVal === '') {
        eMailVal = this.bccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.bccEmailList[i].value;
      }
    }

    this.newEmailTemplateForm.patchValue({
      'BccEmail': eMailVal
    });

    if (eMailVal?.length === 0 || eMailVal === '') {
      /* this.newEmailTemplateForm.get("bccMails").clearValidators();
      this.newEmailTemplateForm.get("bccMails").setErrors({ required: true });
      this.newEmailTemplateForm.get("bccMails").markAsDirty(); */
    }
    else {
      if (invalidEmail) {
        this.newEmailTemplateForm.get("BccEmail").clearValidators();
        this.newEmailTemplateForm.controls["BccEmail"].setErrors({ 'incorrectEmail': true });
      }
    }
  }

  setBccEmailsValues() {
    let eMailVal = '';
    let IsValid = true;

    for (let i = 0; i < this.bccEmailList?.length; i++) {
      if (this.validateEmail(this.bccEmailList[i].value) === false) {
        IsValid = false;
      }

      if (eMailVal?.length === 0 || eMailVal === '') {
        eMailVal = this.bccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.bccEmailList[i].value;
      }
    }
    
    this.newEmailTemplateForm.patchValue({
     'BccEmail': eMailVal
    });

    if (IsValid === false) {
      this.newEmailTemplateForm.get("BccEmail").clearValidators();
      this.newEmailTemplateForm.controls["BccEmail"].setErrors({ 'incorrectEmail': true });
    }
  }

  addBcc(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;

    if (event.value) {
      for (let i = 0; i < this.bccEmailList?.length; i++) {
        if (this.bccEmailList[i].value === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value)) {
          this.bccEmailList.push({ value: event.value, invalid: false });
          this.setBccEmailsValues();
        } else {
          this.bccEmailList.push({ value: event.value, invalid: true });
          this.setBccEmailsValues();
          this.newEmailTemplateForm.get("BccEmail").clearValidators();
          this.newEmailTemplateForm.controls["BccEmail"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.newEmailTemplateForm.get("BccEmail").value === null || this.newEmailTemplateForm.get("BccEmail").value === '') {
      /* this.newEmailTemplateForm.get("bccMails").clearValidators();
      this.newEmailTemplateForm.get("bccMails").setErrors({ required: true });
      this.newEmailTemplateForm.get("bccMails").markAsDirty(); */
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  addToQueue() {
    const fileBrowser = this.fileInput.nativeElement;
    this.uploader.addToQueue(fileBrowser.files, this.prevUploadedFileCount, this.prevUploadedFileSize);
    this.fileInput.nativeElement.value = "";
  }

  removeAttachment(fileInfo:any,fileInputdata){
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
        this.fileAttachments.splice(index, 1);
    }   
   const indexfile: number = this.arr.findIndex(x => x.size === fileInfo.FileSize);
    if (indexfile !== -1) {
        this.arr.splice(index, 1);
    }   
    
    
    this.attachmentName = null;
    fileInputdata.value = "";
  }


  
 /*
@Name: getUserEmailIntegration
@Who: Suika
@When: 22-Dec-2022
@Why: EWM-1732 EWM-9629
@What: to get default email Id
*/
getUserEmailIntegration() {
  this.loading = true;

  this._profileInfoService.getUserEmailIntegration().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        this.userEmailIntegration = data.Data;
        this.userEmail = this.userEmailIntegration.Email;
        this.loading = false;
        this.emailProvider=data.Data.EmailProvider;
        this.newEmailTemplateForm.patchValue({
          'EmailFrom': this.userEmail 
        })
      } else {
        this.loading = false;
      }

    }, err => {
      this.loading = false;
     // this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}


 /* 
   @Type: File, <ts>
   @Name: onJobchange
   @Who: Suika
   @When: 22-Dec-2022
   @Why: EWM-1732 EWM-9629
   @What: when realtion drop down changes 
 */
getUserContactInfo(currEmailType) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "";
  dialogConfig.autoFocus = false;
  dialogConfig.panelClass = 'myDialogCroppingImage';
  dialogConfig.data = null;
  dialogConfig.panelClass = ['xeople-modal', 'contact_receipent', 'animate__animated', 'animate__zoomIn'];
  const modalDialog = this.dialog.open(ContactReceipentPopupComponent, dialogConfig);
  modalDialog.afterClosed().subscribe(res => {
    for (let i = 0; i < res['data']?.length; i++) {
      let IsDuplicate = false;
       if (currEmailType === 'CC') {
        for (let j = 0; j < this.ccEmailList?.length; j++) {
          if (this.ccEmailList[j].value === res['data'][i]['emailId']) {
            IsDuplicate = true;
          }
        }

        if (IsDuplicate === false) {
          if (this.validateEmail(res['data'][i]['emailId'])) {
            this.ccEmailList.push({ value: res['data'][i]['emailId'], invalid: false });
            this.setCCEmailsValues();
          } else {
            this.ccEmailList.push({ value: res['data'][i]['emailId'], invalid: true });
            this.setCCEmailsValues();
            this.newEmailTemplateForm.get("CcEmail").clearValidators();
            this.newEmailTemplateForm.controls["CcEmail"].setErrors({ 'incorrectEmail': true });
          }
        }
      }
      else if (currEmailType === 'BCC') {
        for (let j = 0; j < this.bccEmailList?.length; j++) {
          if (this.bccEmailList[j].value === res['data'][i]['emailId']) {
            IsDuplicate = true;
          }
        }

        if (IsDuplicate === false) {
          if (this.validateEmail(res['data'][i]['emailId'])) {
            this.bccEmailList.push({ value: res['data'][i]['emailId'], invalid: false });
            this.setBccEmailsValues();
          } else {
            this.bccEmailList.push({ value: res['data'][i]['emailId'], invalid: true });
            this.setBccEmailsValues();
            this.newEmailTemplateForm.get("BccEmail").clearValidators();
            this.newEmailTemplateForm.controls["BccEmail"].setErrors({ 'incorrectEmail': true });
          }
        }
      }
    }
    
  })
  return false; 
}



/* 
   @Type: File, <ts>
   @Name: sendEmail
   @Who: Suika
   @When: 22-Dec-2022
   @Why: EWM-1732 EWM-9629
   @What: send mail
 */
sendEmail(){
  this.loading=true;  
  if (this.newEmailTemplateForm.invalid) {
    return;
  }  
  let sendObj={};
  sendObj['TemplateName']=this.newEmailTemplateForm.get("TemplateName").value;  
  sendObj['Id']=this.newEmailTemplateForm.get("Id").value?this.newEmailTemplateForm.get("Id").value:0;
  sendObj['CcEmail']=this.newEmailTemplateForm.get("CcEmail").value;
  sendObj['BccEmail']=this.newEmailTemplateForm.get("BccEmail").value;
  sendObj['TemplateText']= this.newEmailTemplateForm.get("TemplateText").value;
  sendObj['Attachment']=this.fileAttachments?.length>0?true:false;
  sendObj['Files']=this.fileAttachments;
  sendObj['Subject']=this.newEmailTemplateForm.get("Subject").value;
 // sendObj['BodyType']='HTML';
 // sendObj['Source'] = this.Source;
  this.loading=false; 
  this.emailSameJobDetails.emit({emailTemplateData:sendObj});
 }


/* 
   @Type: File, <ts>
   @Name: resetComposeEmail
   @Who: Suika
   @When: 22-Dec-2022
   @Why: EWM-1732 EWM-9629
   @What: reset the data for compose mail
 */
resetComposeEmail(){  
 /* this.newEmailTemplateForm.controls['BccEmail'].reset();
  this.newEmailTemplateForm.controls['CcEmail'].reset();
  this.bccEmailList=[];
  this.ccEmailList=[];
  this.newEmailTemplateForm.controls['TemplateText'].reset();
  this.newEmailTemplateForm.controls['Subject'].reset();
  this.newEmailTemplateForm.controls['TemplateName'].reset();
  this.fileAttachments=[];
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp")?.classList.remove("is-blurred");
  }*/
  this.closeSameJobEmailSection.emit(true);
  this.patchData(this.configureRuleTemplateSameJobData);
}




/*
  @Type: File, <ts>
  @Name: openTemplateModal
  @Who: Suika
  @When: 22-Dec-2022
  @Why: EWM-1732 EWM-9629
  @What: to open template modal dialog
*/
      openTemplateModal() {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_insertTemplate';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
  
          const dialogRef = this.dialog.open(JobEmailTemplatesComponent, {
            panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(res => {
           if(res!=false){
            this.systemSettingService.getEmailTemplateByID('?id=' + res.data.Id).subscribe(
              (repsonsedata:ResponceData) => {
                this.loading = false;
                 if (repsonsedata.HttpStatusCode === 200) {
                  this.fileAttachments = [];
                  this.bccEmailList = [];
                  this.ccEmailList = [];
                  let cceList = repsonsedata.Data.CcEmail?.split(',');
                  for (let itr2 = 0; itr2 < cceList?.length; itr2++) {
                    if (cceList[itr2]?.length != 0 && cceList[itr2] != '') {
                      this.ccEmailList.push({ value: cceList[itr2], invalid: false });
                    }
                  }
                  let bcceList = repsonsedata['Data'].BccEmail?.split(',');
                  for (let itr3 = 0; itr3 < bcceList?.length; itr3++) {
                    if (bcceList[itr3]?.length != 0 && bcceList[itr3] != '') {
                      this.bccEmailList.push({ value: bcceList[itr3], invalid: false });
                    }
                  }
  
                  this.newEmailTemplateForm.patchValue({
                    'Id':this.configureRuleTemplateSameJobData[0]?.Id,
                    'TemplateName': repsonsedata.Data.Title,
                    'Subject': repsonsedata.Data.Subject,
                    'TemplateText': repsonsedata['Data'].TemplateText
                  });
                  this.getEditorVal=repsonsedata['Data'].TemplateText;//by maneesh
                  let ccEMailVal = '';
                  let bccEMailVal = '';
  
  
                  for (let i = 0; i < this.ccEmailList?.length; i++) {
                    if (ccEMailVal?.length === 0 || ccEMailVal === '') {
                      ccEMailVal = this.ccEmailList[i].value;
                    }
                    else {
                      ccEMailVal += ',' + this.ccEmailList[i].value;
                    }
                  }
                 
                  for (let i = 0; i < this.bccEmailList?.length; i++) {
                    if (bccEMailVal?.length === 0 || bccEMailVal === '') {
                      bccEMailVal = this.bccEmailList[i].value;
                    }
                    else {
                      bccEMailVal += ',' + this.bccEmailList[i].value;
                    }
                  }
                 
               
                  this.newEmailTemplateForm.patchValue({
                    'CcEmail': ccEMailVal
                  });
                  this.newEmailTemplateForm.patchValue({
                    'BccEmail': bccEMailVal
                  });
                  
                  if(ccEMailVal!='')
                  {
                    this.showCC=true;
                    //this.showCCBtn();
                  }
                  if(bccEMailVal!='')
                  {
                    this.showBCC=true;
                    //this.showBCCBtn();
                  }
                  let filedata;
                  filedata = repsonsedata.Data.Files;
                  let fSize: number = 0;
                  if (filedata === undefined) {
                    this.fileAttachments = [];
                  }else{
                   filedata.forEach(element => {
                    fSize += element.Size;
                     this.fileAttachments.push({
                       'AttachmentName':element.Name,
                       'FileSize':element.Size,
                       'AttachmentLocation':element.Path
                     })
                   });
               
                   if (fSize > this.fileSize) {
                    this.filestatus=true;
                    this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidAttachmentSize') + ' ' + this.fileSizetoShow, '');
                    return;
                  }else{
                    this.filestatus=false;
                  }
                  }
                  // calling function 
                  // this.replaceTextIntoData(repsonsedata['Data'].TemplateText);
                  this.ModuleName = repsonsedata.Data?.InternalCode;;

               }
                else {
                  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
                  this.loading = false;
                }
              },
              err => {
                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
                this.loading = false;
              });
           }
          
      
           })
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

 
    Uploadfile(file,fileInputdata) {
     // this.filestatus=true;
      const list = file.target.files[0].name?.split('.');
      const fileType = list[list?.length - 1];
      if (!this.fileType.includes(fileType.toLowerCase())) {
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidDocumentType'), '');
        //file = null;
        return;
      }
      let totalfileSize:any=0;
      if (file.target.files[0].size > this.fileSize) {
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidDocumentSize') + ' ' + this.fileSizetoShow, '');
       // file = null;
       this.filestatus=false;
        return;
      }else{
       
        this.arr.push({
          fileName:file.target.files[0].name,
          size:file.target.files[0].size
        })
        this.arr.forEach(x=>{
              totalfileSize += x.size;
            })
      
      }
      
        if(totalfileSize>this.fileSize){
            const index = this.arr.findIndex(x => x.size === file.target.files[0].size);
            if (index !== -1) {
            this.arr.splice(index, 1);
            }
          this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidAttachmentSize') + ' ' + this.fileSizetoShow, '');
          //file = null;
          this.filestatus=false;
          return;
        }
      
      this.fileInfo = {'name':file.target.files[0].name ,'size':this.formatBytes(file.target.files[0].size)};
  
      localStorage.setItem('Image', '1');
      this.uploadFiles = file.target.files[0];
      const formData = new FormData();
      formData.append('file', file.target.files[0]);
      this.mailService.uploadDocument(formData)
        .subscribe((data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            let fileArray = {};
            fileArray['AttachmentName'] = data.Data[0].UploadFileName;
            fileArray['AttachmentLocation'] = data.Data[0].FilePathOnServer;
            fileArray['FileSize'] = data.Data[0].SizeOfFile;
            this.fileAttachments.push(fileArray);
            localStorage.setItem('Image', '2');
            this.filestatus = false;
            this.showPrgrsScrolldwn();
            fileInputdata.value = "";
          }
        }, err => {
          this.filestatus = false;
          this.loading = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
        });
    }

    showPrgrsScrolldwn(){
     setTimeout(() => {
        this.myScrollContainer.nativeElement.scroll({
       top: this.myScrollContainer.nativeElement.scrollHeight,
       left: 0,
       behavior: 'smooth'
     });
     }, 0);
    }

  
 

    /*
    @Type: File, <ts>
    @Name: openPriviewPopup function
    @Who: Suika
    @When: 22-Dec-2022
    @Why: EWM-1732 EWM-9629
    @What: For open email preivew poup
   */
  openPriviewPopup() {
    let subject = this.newEmailTemplateForm.value.Subject;
    let body = this.newEmailTemplateForm.value.TemplateText;
    
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: new Object({ subjectName: subject, emailTemplateData: body }),
      panelClass: ['xeople-modal-lg', 'emailPreview', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {

      }
      else {
      
      }

    }); 
  }


  getJobPlaceholderData(){
    if (this.jobTagData) {
      let existing: any[] = this._toolButtons$.getValue();
       let plcData = [];
      for (let plc of this.jobTagData) {
        plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
      }
      let peopleButton: string = 'Jobs';
      // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
      existing.push({ text: peopleButton, data: plcData }); 
      let jobData: any = existing?.filter((item) => {
        return item.text === "Jobs"
      });
      //this._toolButtons$.next(jobData); 
      this.jobData = jobData;
    }
  }

  getCanPlaceholderData(){
    if (this.canTagData) {
      let existing: any[] = this._toolButtons$.getValue();
      this.plcData = [];
      for (let plc of this.canTagData) {
        this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
      }
      let peopleButton: string = 'Candidate';
      // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
      existing.push({ text: peopleButton, data: this.plcData }); 
      let candidateData: any = existing?.filter((item) => {
        return item.text === "Candidate"
      });
      //this._toolButtons$.next(candidateData);
      this.canData = candidateData;
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim()?.length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  /*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/  
openImageUpload(): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this.appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
    panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    width: '100%'
  });
   dialogRef.afterClosed().subscribe(res => {
     if (res.data != undefined && res.data != '') {
       this.loading = true;
       if (res.event === 1) {
        this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
           this.editor.exec('insertImage', res);
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
           this.editor.exec('insertImage', res);
           this.loading = false;
         })
       }
     }
   })
}

ngOnDestroy(){
  this.subscription$?.unsubscribe();
  this.subscriptionOnChange$.unsubscribe();
}

      //  @Who: maneesh, @When: 14-03-2024,@Why: EWM-16343-EWM-16207 @What: on changes on kendo editor catch the event here
      getEditorFormInfo(event) {
        this.ownerList = event?.ownerList;        
        if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
          this.showErrorDesc = false;
          this.newEmailTemplateForm.get('TemplateText').setValue(event?.val);
        } else {
          this.newEmailTemplateForm.get('TemplateText').updateValueAndValidity();
          this.newEmailTemplateForm.get("TemplateText").markAsTouched();
        }
      }

    // who:maneesh,what: this is use for patch first time image upload data,when:02/04/2024
    getEditorImageFormInfo(event){      
      this.newEmailTemplateForm.get('TemplateText').setValue(event?.val);
    }
}
