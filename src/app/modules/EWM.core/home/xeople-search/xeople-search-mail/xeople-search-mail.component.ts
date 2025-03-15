
/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: maneesh
  @When: 07/02/2023
  @Why: EWM-10305
  @What:  This page will be use for the New XeopleAssign job Email component ts file
*/


import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
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
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailPreviewPopupComponent } from '../../../system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { NewEmailComponent } from '../../../shared/quick-modal/new-email/new-email.component';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';
import { ContactReceipentPopupComponent } from '../../../shared/contact-receipent-popup/contact-receipent-popup.component';
import { TemplatesComponent } from '../../../shared/quick-modal/new-email/templates/templates.component';
import { customDropdownConfig, UserEmailIntegration } from '../../../shared/datamodels';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

export interface Email {
  name: string;
}

@Component({
  selector: 'app-xeople-search-mail',
  templateUrl: './xeople-search-mail.component.html',
  styleUrls: ['./xeople-search-mail.component.scss']
})
export class XeopleSearchMailComponent implements OnInit {

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
  public Source:any;
  emailProvider: any;
  getJobDataById: any;
  public workflowId: any;
  isBulkEmailPreviewBtn: boolean = false;
  ModuleName:string;
  isBulkEmail:boolean = false;
  IsDefault:any
  xeopleSmartEmail:boolean;
  public Email: any;
  public isEmail: any;
  xeopleSearchData:any=[];
  emailTo:[]=[];
  dirctionalLang: string;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
   public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  public plcData = [];
	  @ViewChild('editor') editor: EditorComponent;

//  kendo image uploader Adarsh singh 01-Aug-2023
subscription$: Subscription;
// End 
common_DropdownC_Config:DRP_CONFIG;
public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
ownerList: string[]=[];
public showErrorDesc: boolean = false;
public tagList:any=['Jobs'];
public basic:any=[];
getEmailEditorVal:string='';
public getCandidateData:any = [];
public getCandidateEmailData:any = [];
isfileAttachments:boolean;
DefaultSignature:Number;
  constructor(public dialogRef: MatDialogRef<NewEmailComponent>,public uploader: FileUploaderService, 
     private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,private translateService: TranslateService, 
    public systemSettingService: SystemSettingService,private mailService: MailServiceService,private _dialog: MatDialog,
    private serviceListClass: ServiceListClass,private _profileInfoService: ProfileInfoService, private _appSetting: AppSettingsService, 
    public _snackBarService: SnackBarService,public _encryptionDecryptionService: EncryptionDecryptionService,private appSettingsService: AppSettingsService,
     private commonService: CommonserviceService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,private cache: CacheServiceService) {
           
      this.fileType = _appSetting.file_file_type_extralarge;
      this.fileSizetoShow = _appSetting.file_file_type_mail;
      if (this.fileSizetoShow.includes('KB')) {
        let str = this.fileSizetoShow.replace('KB', '')
        this.fileSize = Number(str) * 1000;
      }
      else if (this.fileSizetoShow.includes('MB')) {
        let str = this.fileSizetoShow.replace('MB', '')
        this.fileSize = Number(str) * 1000000;
      }
    
      this.newEmailTemplateForm = this.fb.group({
        UserId: [],
        EmailFrom: [''],
        EmailTo: [''],
        EmailCC: [''],
        EmailBCC: [''],
        Subject: ['',[Validators.required,Validators.maxLength(500),Validators.minLength(5)]],
        TemplateText: [],
        JobId:[],
        UniqueId:[],
        Id:[],
        JobTitle:['']
      });        

      if(data && data.workflowId!==undefined)
      {
        this.JobId = data.JobId;
        this.workflowId = data.workflowId;
        this.JobTitle = data.JobTitle;

        let jobData={'Id':this.JobId,'JobTitle': this.JobTitle};
        this.onJobchange(jobData);
        this.readonlyField = true;
      }
      // who:maneesh,why:ewm-10305,when:02/02/2023
    // @Who: rENU,@Why:EWM-12023.EWM-12027,@When: 17mAY--2023,@What:SACE DRAFT ISSUE
      if(data && data.res!==undefined)
    {      
      this.draftNewFlag=false;       
      this.identifyMailType(data.res,data.mailRespondType);
    }else{
  
      this.draftNewFlag=true;
    }

      if(data && data.EmailData!==undefined)
      {
      this.Email=data.EmailData;    
      this.JobId = data.JobId;
      this.JobTitle=data.JobTitle;
      let jobData={'Id':this.JobId,'JobTitle': this.JobTitle};
      this.onJobchange(jobData);
      this.readonlyField = true;   
        for (let i = 0; i < this.Email.length; i++) {
          this.candidateId = this.Email[i]?.CandidateId;
          this.toEmailList.push({   
            'value': this.Email[i]?.Email,
            'IsDefault': this.Email[i]?.IsDefault?this.Email[i]?.IsDefault:1
          })  
                
      }
    // @Who: Bantee Kumar,@Why:EWM-10611.EWM-11217,@When: 15-Mar-2023,@What:to pass all emailId with comma seperated.

      this.setFromEmailsValues();
    }  
      // who:maneesh,why:ewm-15234 for fixed new dropdown,when:15/02/2024  
      let endPoint = this.workflowId ? this.serviceListClass.jobWithoutWorkflowfilter + '?WorkflowId=' + this.workflowId : this.serviceListClass.jobWithoutWorkflowfilter;
      this.common_DropdownC_Config = {
        API: endPoint,
        MANAGE: '',
        BINDBY: 'JobTitle',
        REQUIRED: false,
        DISABLED: this.readonlyField,
        PLACEHOLDER: 'candidate_job',
        SHORTNAME_SHOW: false,
        SINGLE_SELECETION: true,
        AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
        IMG_SHOW: false,
        EXTRA_BIND_VALUE: '',
        IMG_BIND_VALUE:'',
        FIND_BY_INDEX: 'Id'
      }
  }

  ngOnInit() {      
    this.getUserEmailIntegration();
    //Who:Ankit Rawat, What:EWM-16493 EWM-16501 if local storage is not exists then call api to get the signature, When:20March2024
    this.getUserEmailSettingInfo();
    this.commonService.xeopleSearchServicedata.subscribe((data)=>{
      this.xeopleSearchData=data;   
      })
       /*--------@When: 10-May-2023 @who:Renu @why: EWM-12023 EWM-12038 -------- */
       this.getInsertPlaceholderByType('Jobs'); 
                 //  @Who: maneesh, @When: 13-03-2024,@Why: EWM-16342-EWM-16207 @What: on changes on kendo editor catch the event here
                 this.editorConfig={
                  REQUIRED:false,
                  DESC_VALUE:null,
                  PLACEHOLDER:'',
                  Tag:this.tagList,
                  EditorTools:this.basic,
                  MentionStatus:false,
                  maxLength:0,
                  MaxlengthErrormessage:false,
                  JobActionComment:false
      
                };
                // by maneesh,get email array format
                let arr =this.data?.candiateDetails;
                arr?.forEach(element => {
                  this.getCandidateData.push({
                   "EmailId": element?.EmailTo
                  })
                });
               }


 /* 
    @Type: File, <ts>
    @Name: clickMoreRecord function
    @Who: Nitin Bhati
    @When: 13-Sep-2021
    @Why: EWM-2756
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
    for (let i = 0; i < files?.length; i++) {
      let file = files[i];
    }
  }


  

  clearInputElement() {
    this.fileUpload.nativeElement.value = ''
  }

  onDismiss(): void {
    localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;
    document.getElementsByClassName("quickNewEmailModal")[0].classList.remove("animate__slideInRight")
    document.getElementsByClassName("quickNewEmailModal")[0].classList.add("animate__slideOutRight");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: Email[] = [];

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
      document.getElementsByClassName('ccBccEmailBtn')[0].classList.add('activeBtnColor');
    }
    if(this.showCC == false){
      document.getElementsByClassName('ccBccEmailBtn')[0].classList.remove('activeBtnColor');
    }
  }

  showBCCBtn(){
    this.showBCC = !this.showBCC;
    if(this.showBCC == true){
      document.getElementsByClassName('bccBccEmailBtn')[0].classList.add('activeBtnColor');
    }
    if(this.showBCC == false){
      document.getElementsByClassName('bccBccEmailBtn')[0].classList.remove('activeBtnColor');
    }
  }

  
  setFromEmailsValues() {
    let eMailVal = '';
    let IsValid = true;
    for (let i = 0; i < this.toEmailList?.length; i++) {
      if (this.validateEmail(this.toEmailList[i].value) === false) {
        IsValid = false;
      } 

      if (eMailVal?.length === 0 || eMailVal === '') {
        eMailVal = this.toEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.toEmailList[i].value;
      }

    }
    this.newEmailTemplateForm.patchValue({
      'EmailTo': eMailVal
    });

    if (IsValid === false) {
      this.newEmailTemplateForm.get("EmailTo").clearValidators();
      this.newEmailTemplateForm.controls["EmailTo"].setErrors({ 'incorrectEmail': true });
    }
  }

  addFrom(event: MatChipInputEvent): void { 
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;
    if (event.value) {
      for (let i = 0; i < this.toEmailList?.length; i++) {
        if (this.toEmailList[i].value === value) {
          IsDuplicate = true;
        }
      }
      
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value)) {
          this.toEmailList.push({ value: event.value, invalid: false });
          this.setFromEmailsValues();
        } else {
          this.toEmailList.push({value: event.value, IsDefault: 0, invalid: true }); 
                this.setFromEmailsValues();
          this.newEmailTemplateForm.get("EmailTo").clearValidators();
          this.newEmailTemplateForm.controls["EmailTo"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.newEmailTemplateForm.get("EmailTo").value === null || this.newEmailTemplateForm.get("EmailTo").value === '') {
      this.newEmailTemplateForm.get("EmailTo").clearValidators();
      this.newEmailTemplateForm.get("EmailTo").setErrors({ required: true });
      this.newEmailTemplateForm.get("EmailTo").markAsDirty();
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  removeToEmail(data: any): void {
    if (this.toEmailList.indexOf(data) >= 0) {
      this.toEmailList.splice(this.toEmailList.indexOf(data), 1);
    }

    let eMailVal = '';
    let invalidEmail = false;

    for (let i = 0; i < this.toEmailList?.length; i++) {
      if (this.toEmailList[i].invalid === true) {
        invalidEmail = true;
      }

      if (eMailVal?.length === 0 || eMailVal === '') {
        eMailVal = this.toEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.toEmailList[i].value;
      }
    }

    this.newEmailTemplateForm.patchValue({
      'EmailTo': eMailVal
    });

    if (eMailVal?.length === 0 || eMailVal === '') {
      this.newEmailTemplateForm.get("EmailTo").clearValidators();
      this.newEmailTemplateForm.get("EmailTo").setErrors({ required: true });
      this.newEmailTemplateForm.get("EmailTo").markAsDirty();
    }
    else {
      if (invalidEmail) {
        this.newEmailTemplateForm.get("EmailTo").clearValidators();
        this.newEmailTemplateForm.controls["EmailTo"].setErrors({ 'incorrectEmail': true });
      }
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
      'ccMails': eMailVal
    });

    if (eMailVal?.length === 0 || eMailVal === '') {
    }
    else {
      if (invalidEmail) {
        this.newEmailTemplateForm.get("ccMails").clearValidators();
        this.newEmailTemplateForm.controls["ccMails"].setErrors({ 'incorrectEmail': true });
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
      'EmailCC': eMailVal
    });

    if (IsValid === false) {
      this.newEmailTemplateForm.get("EmailCC").clearValidators();
      this.newEmailTemplateForm.controls["EmailCC"].setErrors({ 'incorrectEmail': true });
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
          this.newEmailTemplateForm.get("EmailCC").clearValidators();
          this.newEmailTemplateForm.controls["EmailCC"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.newEmailTemplateForm.get("EmailCC").value === null || this.newEmailTemplateForm.get("EmailCC").value === '') {
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
      'bccMails': eMailVal
    });

    if (eMailVal?.length === 0 || eMailVal === '') {
 
    }
    else {
      if (invalidEmail) {
        this.newEmailTemplateForm.get("bccMails").clearValidators();
        this.newEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
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
      'EmailBCC': eMailVal
    });

    if (IsValid === false) {
      this.newEmailTemplateForm.get("bccMails").clearValidators();
      this.newEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
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
          this.newEmailTemplateForm.get("bccMails").clearValidators();
          this.newEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.newEmailTemplateForm.get("bccMails").value === null || this.newEmailTemplateForm.get("bccMails").value === '') {

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

  removeAttachment(fileInfo:any){
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
        this.fileAttachments.splice(index, 1);
    }   
    const indexfile: number = this.arr.findIndex(x => x.size === fileInfo.Size);
    if (indexfile !== -1) {
        this.arr.splice(index, 1);
    }     
    this.attachmentName = null;
  }


  
 /*
@Name: getUserEmailIntegration
@Who: Renu
@When: 29-Sept-2021
@Why: ROST-2641 EWM-2996
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
   @Who: Renu
   @When: 18-Aug-2021
   @Why: EWM-2428
   @What: when realtion drop down changes 
 */

onJobchange(data){  
  this.selectedJobs=null;
  if(data==null || data=="")
  {
    this.selectedJobs=null;
          this.newEmailTemplateForm.get("JobId").setErrors({ required: true });
      this.newEmailTemplateForm.get("JobId").markAsTouched();
      this.newEmailTemplateForm.get("JobId").markAsDirty();
  }
  else
  {
    if (data.Id!=undefined && data!=null) {
    this.selectedJobs=data;
    this.newEmailTemplateForm.get("JobId").clearValidators();
    this.newEmailTemplateForm.get("JobId").markAsPristine();
  this.newEmailTemplateForm.patchValue(
    {
      JobId:data.Id,
      JobTitle:data.JobTitle
    }
 ) 
    }else{
    this.selectedJobs=null;  
    }
   
  }
}
 /* 
   @Type: File, <ts>
   @Name: onJobchange
   @Who: Renu
   @When: 18-Aug-2021
   @Why: EWM-2428
   @What: when realtion drop down changes 
 */
getUserContactInfo(currEmailType) {  
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "";
  // dialogConfig.width = "100%";
  dialogConfig.autoFocus = false;
  dialogConfig.panelClass = 'myDialogCroppingImage';
  dialogConfig.data = null;
  // dialogConfig.maxWidth = "750px";
  dialogConfig.panelClass = ['xeople-modal', 'contact_receipent', 'animate__animated', 'animate__zoomIn'];
  const modalDialog = this._dialog.open(ContactReceipentPopupComponent, dialogConfig);
  modalDialog.afterClosed().subscribe(res => {
    for (let i = 0; i < res['data']?.length; i++) {
      let IsDuplicate = false;
      if (currEmailType === 'To') {
        // && i < res['data'].length
        for (let j = 0; j < this.toEmailList?.length; j++) {
          if (this.toEmailList[j].value === res['data'][i]['emailId']) {
            IsDuplicate = true;
          }
        }
        if (IsDuplicate === false) {
          if (this.validateEmail(res['data'][i]['emailId'])) {
            this.toEmailList.push({ value: res['data'][i]['emailId'], invalid: false });
            this.setFromEmailsValues();
          } else {
            this.toEmailList.push({ value: res['data'][i]['emailId'], invalid: true });            
            this.setFromEmailsValues();
            this.newEmailTemplateForm.get("EmailTo").clearValidators();
            this.newEmailTemplateForm.controls["EmailTo"].setErrors({ 'incorrectEmail': true });
          }
        }
     
      }
      else if (currEmailType === 'CC') {
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
            this.newEmailTemplateForm.get("EmailCC").clearValidators();
            this.newEmailTemplateForm.controls["EmailCC"].setErrors({ 'incorrectEmail': true });
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
            this.newEmailTemplateForm.get("EmailBCC").clearValidators();
            this.newEmailTemplateForm.controls["EmailBCC"].setErrors({ 'incorrectEmail': true });
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
   @Who: Renu
   @When: 29-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: send mail
 */
sendEmail(){
  this.loading=true;
  localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;

  if (this.newEmailTemplateForm.invalid) {
    return;
  }
// <!----@bantee @EWM-11601 @Whn 20-09-2023  error message Validation handled-->
  let sendObj={};
  sendObj['To']=this.getCandidateData;
  sendObj['Cc']=this.newEmailTemplateForm.get("EmailCC").value;
  sendObj['Bcc']=this.newEmailTemplateForm.get("EmailBCC").value;
  sendObj['Body']= this.newEmailTemplateForm.get("TemplateText").value;
  sendObj['Attachment']=this.fileAttachments?.length>0?true:false;
  sendObj['Files']=this.fileAttachments;
  sendObj['Subject']=this.newEmailTemplateForm.get("Subject").value?.trim();
  sendObj['JobId']=(this.selectedJobs?.Id)?this.selectedJobs?.Id:'00000000-0000-0000-0000-000000000000';
  sendObj['JobTitle']=(this.selectedJobs?.JobTitle)?this.selectedJobs?.JobTitle:'';
  sendObj['MailProvider']=this.emailProvider;
  sendObj['BodyType']='HTML';
  sendObj['CandidateId'] = this.candidateId;
  sendObj['Source'] = this.Source;
  sendObj['RelatedToInternalCode'] = this.ModuleName ? this.ModuleName : 'CAND';
  if (this.Email?.IsDefault) {
    let url = window.location.pathname + 'bulk-email' + window.location.search
    sendObj['CandidateList'] = this.data?.candiateDetails;
    sendObj['PageUrl'] = url;
    sendObj['RelatedToInternalCode'] = this.ModuleName ? this.ModuleName : 'JOBS';
  }
  sendObj['CandidateList'] = this.data?.candiateDetails;
  // <!---------@When: 23-12-2022 @who:Adarsh singh @why: EWM-10016 --------->
  if (this.data?.xeopleSmartEmail) {
    if (this.fileAttachments?.length == 0) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_pleseSelectFileFirst'), '');
      this.loading=false;
      return;
    }else{
    }
  }
  // sendObj['IsJobLog'] = this.data?.IsJobLog?this.data?.IsJobLog:0;
  // sendObj['DocumentId'] = this.data?.DocumentId;
  // End

  let bulkEmail = this.isBulkEmailPreviewBtn ? this.mailService.bulkMailSend(sendObj) : this.mailService.xeoplesearchEmail(sendObj);
  bulkEmail.subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
  localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for clear value;
        this.loading=false;
        document.getElementsByClassName("quickNewEmailModal")[0].classList.remove("animate__slideInRight");
        document.getElementsByClassName("quickNewEmailModal")[0].classList.add("animate__slideOutLeft");
        setTimeout(() => { this.dialogRef.close({'draft':false}); }, 200);
        this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }else{
        this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading=false;
      }
    }, err => {
        this.loading = false;
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
      this.commonService.xeopleSearchMail.next(true);
}
// isfileAttachments:boolean;
// sendEmail(){
//   localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;
//   this.loading=true;
  
//   if (this.newEmailTemplateForm.invalid) {
//     return;
//   }
  
//   let sendObj={};
//   // @Who: Bantee Kumar,@Why:EWM-10970.EWM-11023,@When: 3-Mar-2023,@What:When the user sends Mail to multiple candidate email IDs.
  
//   sendObj['To']=this.newEmailTemplateForm.get("EmailTo").value;
//   sendObj['Cc']=this.newEmailTemplateForm.get("EmailCC").value;
//   sendObj['Bcc']=this.newEmailTemplateForm.get("EmailBCC").value;
//   sendObj['Body']= this.newEmailTemplateForm.get("TemplateText").value;
//   sendObj['Attachment']=this.fileAttachments?.length>0?true:false;
//   sendObj['Files']=this.fileAttachments;
//   sendObj['Subject']=this.newEmailTemplateForm.get("Subject").value;
//   sendObj['JobId']=(this.selectedJobs?.Id)?this.selectedJobs.Id:'00000000-0000-0000-0000-000000000000';
//   sendObj['JobTitle']=(this.selectedJobs?.JobTitle)?this.selectedJobs.JobTitle:'';
//   sendObj['MailProvider']=this.emailProvider;
//   sendObj['BodyType']='HTML';
//   sendObj['CandidateId'] = this.candidateId;
//   sendObj['Source'] = this.Source;

//   if (this.Email?.IsDefault) {
//     let url = window.location.pathname + 'bulk-email' + window.location.search
//     sendObj['CandidateList'] = this.data?.candiateDetails;
//     sendObj['PageUrl'] = url;
//     sendObj['RelatedToInternalCode'] = this.ModuleName ? this.ModuleName : 'JOBS';
//   }

//   let bulkEmail = this.isBulkEmailPreviewBtn ? this.mailService.bulkMailSend(sendObj) : this.mailService.mailSend(sendObj);
//   bulkEmail.subscribe(
//     (data: ResponceData) => {
//       if (data.HttpStatusCode === 200) {
//         this.loading=false;
//         document.getElementsByClassName("quickNewEmailModal")[0].classList.remove("animate__slideInRight");
//         document.getElementsByClassName("quickNewEmailModal")[0].classList.add("animate__slideOutLeft");
//         setTimeout(() => { this.dialogRef.close({'draft':false}); }, 200);
//         this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
//       }else{
//         this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
//         this.loading=false;
//       }
//     }, err => {
//         this.loading = false;
//         this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
//       })
//       if (this.appSettingsService.isBlurredOn) {
//         document.getElementById("main-comp").classList.remove("is-blurred");
//       }
//        this.commonService.xeopleSearchMail.next(true);

// }
/*
  @Type: File, <ts>
  @Name: confirmSaveAsDraft function
  @Who: RENU
  @When: 10-05-2023
  @Why: EWM-12023 EWM-12027
  @What: FOR DIALOG BOX confirmation for Save as Draft
*/
confirmSaveAsDraft(): void {
  localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;
  const message = `label_titleDialogContentSiteDomain`;
  const title = '';
  const subTitle = 'label_saveAsDraft';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
  }
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.saveAsDraft();
    }
  });
}

/* 
   @Type: File, <ts>
   @Name: saveAsDraft
   @Who: Renu
   @When: 29-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: save as draft
 */

saveAsDraft(){
 
  let draftObj={};
    draftObj['From']=this.newEmailTemplateForm.get("EmailFrom").value
    draftObj['To']=this.newEmailTemplateForm.get("EmailTo").value;
    draftObj['Cc']=this.newEmailTemplateForm.get("EmailCC").value;
    draftObj['Bcc']=this.newEmailTemplateForm.get("EmailBCC").value;
    draftObj['Attachment']=this.fileAttachments?.length>0?true:false;
    draftObj['Subject']=this.newEmailTemplateForm.get("Subject").value;
    draftObj['Body']=this.newEmailTemplateForm.get("TemplateText").value;
    let file=[];
    this.fileAttachments.forEach(e=>{
      file.push({
        'Name':e.Name,
        'Size':e.Size,
        'Path':e.Path
      })
    })
    draftObj['Files']=file;
    draftObj['JobId']= (this.selectedJobs?.Id)?this.selectedJobs.Id:'00000000-0000-0000-0000-000000000000';
    draftObj['JobTitle']= (this.selectedJobs?.JobTitle)?this.selectedJobs.JobTitle:'';
    draftObj['MailProvider']=this.emailProvider;
    draftObj['BodyType']='HTML';

    if(this.draftNewFlag==true){
       this.createDraft(draftObj)
    }else{
         this.updateDraft(draftObj)
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
}

/* 
   @Type: File, <ts>
   @Name: resetComposeEmail
   @Who: Renu
   @When: 29-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: reset the data for compose mail
 */
resetComposeEmail(){
  localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;
  this.onDismiss();
  this.newEmailTemplateForm.controls['EmailBCC'].reset();
  this.newEmailTemplateForm.controls['EmailCC'].reset();
  this.bccEmailList=[];
  this.ccEmailList=[];
  if(!this.readonlyField){
    this.newEmailTemplateForm.controls['EmailTo'].reset();
    this.toEmailList=[];
    this.newEmailTemplateForm.controls['JobId'].reset();
    this.newEmailTemplateForm.controls['JobTitle'].reset();
    this.selectedJobs={};
  }
  if(this.JobReset)
  {
    this.newEmailTemplateForm.controls['JobId'].reset();
    this.newEmailTemplateForm.controls['JobTitle'].reset();
    this.selectedJobs={};
  }
  this.newEmailTemplateForm.controls['TemplateText'].reset();
  this.newEmailTemplateForm.controls['Subject'].reset();
  this.newEmailTemplateForm.controls['JobId'].reset();
  this.newEmailTemplateForm.controls['JobTitle'].reset();

  this.fileAttachments=[];
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.remove("is-blurred");
  }
}

/* 
   @Type: File, <ts>
   @Name: createDraft
   @Who: Renu
   @When: 29-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: create New Draft
 */
createDraft(draftObj){
  this.mailService.createDraftMail(draftObj).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        this.loading=false;
        document.getElementsByClassName("quickNewEmailModal")[0].classList.remove("animate__slideInRight");
        document.getElementsByClassName("quickNewEmailModal")[0].classList.add("animate__slideOutLeft");
        setTimeout(() => { this.dialogRef.close({'draft':true}); }, 200);
      
      }else{
        this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
    
      }
    }, err => {
        this.loading = false;
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
      })
}

/* 
   @Type: File, <ts>
   @Name: updateDraft
   @Who: Renu
   @When: 29-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: update  Draft
 */
   updateDraft(draftObj){
    draftObj['UniqueId'] =this.newEmailTemplateForm.get("UniqueId").value;
    draftObj['Id'] =this.newEmailTemplateForm.get("Id").value;
    this.mailService.updateDraftMailById(draftObj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.loading=false;
          document.getElementsByClassName("quickNewEmailModal")[0].classList.remove("animate__slideInRight");
          document.getElementsByClassName("quickNewEmailModal")[0].classList.add("animate__slideOutLeft");
          setTimeout(() => { this.dialogRef.close({'draft':true}); }, 200);
        
        }else{
          this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      
        }
      }, err => {
          this.loading = false;
          this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
        })
  }
/*
  @Type: File, <ts>
  @Name: openTemplateModal
  @Who: Renu
  @When: 29-Sep-2021
  @Why: EWM-2641 EWM-2996
  @What: to open template modal dialog
*/
      openTemplateModal() {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_insertTemplate';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
  
          const dialogRef = this.dialog.open(TemplatesComponent, {
            panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(res => {
           if(res!=false){
            this.systemSettingService.getEmailTemplateByID('?id=' + res.data.Id).subscribe(
              (repsonsedata:ResponceData) => {
                this.loading = false;
                 if (repsonsedata.HttpStatusCode === 200) {
            
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
  
                  // this.newEmailTemplateForm.patchValue({
                  //   'Subject': repsonsedata.Data.Subject,
                  //   'TemplateText': repsonsedata['Data'].Template+this.cache.getLocalStorage("UserEmailSignature")
                  // });
                                    // by maneesh,patch editor value,when:09/04/2024
                                    if (this.cache.getLocalStorage("UserEmailSignature")==null) {
                                      this.getEditorVal=repsonsedata['Data']?.TemplateText;
                                      this.newEmailTemplateForm.patchValue({
                                        'Subject': repsonsedata.Data.Subject,
                                        'TemplateText': repsonsedata['Data'].TemplateText
                                      });
                                      this.getEditorVal=repsonsedata['Data']?.TemplateText;

                                      }else{
                                        this.newEmailTemplateForm.patchValue({
                                          'Subject': repsonsedata.Data.Subject,
                                          'TemplateText': repsonsedata['Data'].TemplateText+this.cache.getLocalStorage("UserEmailSignature")
                                        });
                                        this.getEditorVal=repsonsedata['Data']?.TemplateText+this.cache?.getLocalStorage("UserEmailSignature");
                                      }

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
                    'EmailCC': ccEMailVal
                  });
                  this.newEmailTemplateForm.patchValue({
                    'EmailBCC': bccEMailVal
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
                       'Name':element.Name,
                       'Size':element.Size,
                       'Path':element.Path
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
        

    /*
      @Type: File, <ts>
      @Name: identifyMailType
      @Who: Renu
      @When: 30-Sep-2021
      @Why: EWM-2641 EWM-3073
      @What: CHECK mail repsond type and then patch values
    */

  identifyMailType(data:any,mailRespondType:string){
     if(mailRespondType=='forward')
     {
      
      this.patchForwardValue(data);
     }else if(mailRespondType=='replyAll'){
      this.patchReplyAllValue(data);
     }else if(mailRespondType=='reply'){
      this.patchReplyValue(data);
     }else{
       this.patchValues(data)
     }
     this.mailprovider=1;
    }

       
     /*
      @Type: File, <ts>
      @Name: patchForwardValue
      @Who: Renu
      @When: 30-Sep-2021
      @Why: EWM-2641 EWM-3073
      @What: if value present  then patch value for forward  mails
    */
    patchForwardValue(data:any){
      this.selectedJobs={'Id':data.JobId}      
      this.newEmailTemplateForm.patchValue({
        UserId: data.UserId,
        EmailFrom:data.EmailID,
        Subject: data.Subject,
        TemplateText: data.Body,
        JobId: this.selectedJobs,
        UniqueId:data.UniqueId,
        Id:data.Id
      })
      this.getEditorVal=data?.Body;
      let filedata;
      filedata = data.Files;
      let fSize: number = 0;
      if (filedata === undefined) {
        this.fileAttachments = [];
      }else{
       filedata.forEach(element => {
        fSize += element.Size;
         this.fileAttachments.push({
           'Name':element.Name,
           'Size':element.Size,
           'Path':element.Path
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
    }
    
     /*
      @Type: File, <ts>
      @Name: patchReplyAllValue
      @Who: Renu
      @When: 30-Sep-2021
      @Why: EWM-2641 EWM-3073
      @What: if value present  then patch value for reply All mails
    */
    patchReplyAllValue(data:any){
      this.selectedJobs={'Id':data.JobId}
      this.newEmailTemplateForm.patchValue({
        UserId: data.UserId,
        EmailFrom:data.EmailID,
        Subject: data.Subject,
        TemplateText: data.Body,
        JobId: this.selectedJobs,
        JobTitle: data.JobTitle,
        UniqueId:data.UniqueId,
        Id:data.Id
      })
      this.getEditorVal=data?.Body;

      let filedata;
      filedata = data.Files;
      let fSize: number = 0;
      if (filedata === undefined) {
        this.fileAttachments = [];
      }else{
       filedata.forEach(element => {
        fSize += element.Size;
         this.fileAttachments.push({
           'Name':element.Name,
           'Size':element.Size,
           'Path':element.Path
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
   
    if(data && data.EmailTo)
    {
      for (let itr2 = 0; itr2 < data.EmailTo?.length; itr2++) {
        if (data.EmailTo[itr2]?.length != 0 && data.EmailTo[itr2].EmailID != '') {
          this.toEmailList.push({ value: data.EmailTo[itr2].EmailID, invalid: false });
        }
      }
    }
   
    if(data && data.EmailBCC)
    {
    for (let itr3 = 0; itr3 < data.EmailBCC?.length; itr3++) {
      if (data.EmailBCC[itr3]?.length != 0 && data.EmailBCC[itr3].EmailID != '') {
        this.bccEmailList.push({ value: data.EmailBCC[itr3].EmailID, invalid: false });
      }
    }
  }
   
  if(data && data.EmailCC)
  {
    for (let itr3 = 0; itr3 < data.EmailCC?.length; itr3++) {
      if (data.EmailCC[itr3]?.length != 0 && data.EmailCC[itr3].EmailID != '') {
        this.ccEmailList.push({ value: data.EmailCC[itr3].EmailID, invalid: false });
      }
    }
  }

    let ccEMailVal = '';
    let bccEMailVal = '';
    let toEMailVal = '';
    for (let i = 0; i < this.ccEmailList?.length; i++) {
      if (ccEMailVal?.length === 0 || ccEMailVal === '') {
        ccEMailVal = this.ccEmailList[i].value;
      }
      else {
        ccEMailVal += ',' + this.ccEmailList[i].value;
      }
    }
  
    if(ccEMailVal!='')
    {
      this.showCC=true;
     // this.showCCBtn();
    }
    for (let i = 0; i < this.bccEmailList?.length; i++) {
      if (bccEMailVal?.length === 0 || bccEMailVal === '') {
        bccEMailVal = this.bccEmailList[i].value;
      }
      else {
        bccEMailVal += ',' + this.bccEmailList[i].value;
      }
    }

    if(bccEMailVal!='')
    {
      this.showBCC=true;
     // this.showBCCBtn();
    }

    for (let i = 0; i < this.toEmailList?.length; i++) {
      if (toEMailVal?.length === 0 || toEMailVal === '') {
        toEMailVal = this.toEmailList[i].value;
      }
      else {
        toEMailVal += ',' + this.toEmailList[i].value;
      }
    }


    this.newEmailTemplateForm.patchValue({
      'EmailCC': ccEMailVal,
      'EmailBCC': bccEMailVal,
      'EmailTo':toEMailVal
    });

    }

     /*
      @Type: File, <ts>
      @Name: patchReplyValue
      @Who: Renu
      @When: 30-Sep-2021
      @Why: EWM-2641 EWM-3073
      @What: if value present  then patch value for reply mails
    */
    patchReplyValue(data:any){
      this.selectedJobs={'Id':data.JobId}
      this.newEmailTemplateForm.patchValue({
        UserId: data.UserId,
        EmailFrom:data.EmailID,
        Subject: data.Subject,
        TemplateText: data.Body,
        JobId: this.selectedJobs,
        JobTitle: data.JobTitle,
        UniqueId:data.UniqueId,
        Id:data.Id
      })
      this.getEditorVal=data?.Body;

      let filedata;
      filedata = data.Files;
      let fSize: number = 0;
      if (filedata === undefined) {
        this.fileAttachments = [];
      }else{
       filedata.forEach(element => {
        fSize += element.Size;
         this.fileAttachments.push({
           'Name':element.Name,
           'Size':element.Size,
           'Path':element.Path
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

    if(data && data.EmailFrom)
      {
        this.toEmailList.push({ value: data.EmailFrom.EmailID, invalid: false });
        this.newEmailTemplateForm.patchValue({
          'EmailTo':data.EmailFrom.EmailID
        });
      }   

    }
   /*
      @Type: File, <ts>
      @Name: patchValues
      @Who: Renu
      @When: 30-Sep-2021
      @Why: EWM-2641 EWM-3073
      @What: if value present  then patch value
    */
    patchValues(data:any){
      this.selectedJobs={'Id':data.JobId}
      this.newEmailTemplateForm.patchValue({
        UserId: data.UserId,
        EmailFrom:data.EmailID,
        Subject: data.Subject,
        TemplateText: data.Body,
        JobId: this.selectedJobs,
        JobTitle: data.JobTitle,
        UniqueId:data.UniqueId,
        Id:data.Id
      })
      this.getEditorVal=data?.Body;
      
      if(data && data.EmailTo)
      {
        for (let itr2 = 0; itr2 < data.EmailTo?.length; itr2++) {
          if (data.EmailTo[itr2]?.length != 0 && data.EmailTo[itr2].EmailID != '') {
            this.toEmailList.push({ value: data.EmailTo[itr2].EmailID, invalid: false,readonly:true });
          }
        }
      }
     
      if(data && data.EmailBCC)
      {
      for (let itr3 = 0; itr3 < data.EmailBCC?.length; itr3++) {
        if (data.EmailBCC[itr3]?.length != 0 && data.EmailBCC[itr3].EmailID != '') {
          this.bccEmailList.push({ value: data.EmailBCC[itr3].EmailID, invalid: false });
        }
      }
    }
     
    if(data && data.EmailCC)
    {
      for (let itr3 = 0; itr3 < data.EmailCC?.length; itr3++) {
        if (data.EmailCC[itr3]?.length != 0 && data.EmailCC[itr3].EmailID != '') {
          this.ccEmailList.push({ value: data.EmailCC[itr3].EmailID, invalid: false });
        }
      }
    }

      let ccEMailVal = '';
      let bccEMailVal = '';
      let toEMailVal = '';
      for (let i = 0; i < this.ccEmailList?.length; i++) {
        if (ccEMailVal?.length === 0 || ccEMailVal === '') {
          ccEMailVal = this.ccEmailList[i].value;
        }
        else {
          ccEMailVal += ',' + this.ccEmailList[i].value;
        }
      }
    
      if(ccEMailVal!='')
      {
        this.showCC=true;
       // this.showCCBtn();
      }
      for (let i = 0; i < this.bccEmailList?.length; i++) {
        if (bccEMailVal?.length === 0 || bccEMailVal === '') {
          bccEMailVal = this.bccEmailList[i].value;
        }
        else {
          bccEMailVal += ',' + this.bccEmailList[i].value;
        }
      }

      if(bccEMailVal!='')
      {
        this.showBCC=true;
       // this.showBCCBtn();
      }

      for (let i = 0; i < this.toEmailList?.length; i++) {
        if (toEMailVal?.length === 0 || toEMailVal === '') {
          toEMailVal = this.toEmailList[i].value;
        }
        else {
          toEMailVal += ',' + this.toEmailList[i].value;
        }
      }


      this.newEmailTemplateForm.patchValue({
        'EmailCC': ccEMailVal,
        'EmailBCC': bccEMailVal,
        'EmailTo':toEMailVal
      });

      let filedata;
      filedata = data.Files;
      let fSize: number = 0;
      if (filedata === undefined) {
        this.fileAttachments = [];
      }else{
       filedata.forEach(element => {
        fSize += element.Size;
         this.fileAttachments.push({
           'Name':element.Name,
           'Size':element.Size,
           'Path':element.Path
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

 
    Uploadfile(file) {
      this.filestatus=true;
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
            fileArray['Name'] = data.Data[0].UploadFileName;
            fileArray['Path'] = data.Data[0].FilePathOnServer;
            fileArray['Size'] = data.Data[0].SizeOfFile;
            this.fileAttachments.push(fileArray);
            localStorage.setItem('Image', '2');
            this.filestatus = false;
            this.showPrgrsScrolldwn();
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

    sendMailCandidate(candidateData,emailConnection,JobId){
      if(candidateData)
      {       
        this.candidateId = candidateData?.CandidateId;
        if(JobId!=undefined){
          this.Source = 'Job';
        }        
        this.selectedJobs={'Id':JobId};
        if (candidateData?.EmailId != undefined) {
          this.toEmailList.push({ value:candidateData.EmailId, invalid: false ,readonly:true});
        }

        if (candidateData?.EmailId == undefined) {
          candidateData.forEach(element => {
            this.toEmailList.push({ value:element, invalid: false ,readonly:true});
          });
        }

        this.newEmailTemplateForm.patchValue({
          'EmailTo':candidateData.EmailId?candidateData.EmailId:'',
          'JobId': this.selectedJobs
        });

        if (candidateData?.EmailId == undefined) {
        this.setFromEmailsValues();
        }
      }   
  
      this.mailprovider=emailConnection;
    }
    /*
    @Type: File, <ts>
    @Name: openPriviewPopup function
    @Who: Adarsh singh
    @When: 28-sept-2022
    @Why: EWM-7481
    @What: For open email preivew poup
   */
  openPriviewPopup() {
    if (this.newEmailTemplateForm.value.TemplateText==null) { //by maneesh 
      this.newEmailTemplateForm.get('TemplateText').setValue('');     
    }
    localStorage.removeItem('selectEmailTemp');//who:maneesh for clear value,when:30/11/2023;
    let subject = this.newEmailTemplateForm.value.Subject;
    let body = this.newEmailTemplateForm.value.TemplateText;
    
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: new Object({ subjectName: subject, emailTemplateData: body,CandidateId:this.candidateId,JobId:this.newEmailTemplateForm.value.JobId,openDocumentPopUpFor:'Candidate',isMailActive:true,emailToCount:this.toEmailList}),
      panelClass: ['xeople-modal-lg', 'emailPreview', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {

      }
      else {
        // console.log("false")
      }

    });
  }

    /*
  @Type: File, <ts>
  @Name: getMappedPhoneNumber
  @Who: Suika
  @When: 27-Sep-2022
  @Why: EWM-7481
  @What: to open template modal dialog
*/

getMappedEmails() {
  this.loading = true;
  this.systemSettingService.getCandidateMappedBulkemail('?jobid='+this.JobId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.toEmailList = repsonsedata.Data;
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.toEmailList = [];
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })

}
 /*
   @Type: File, <ts>
   @Name: getInsertPlaceholderByType
   @Who: Renu
   @When: 10-May-2023
   @Why: EWM-12023 EWM-12038
   @What: For Insert Job tag value
 */
   getInsertPlaceholderByType(insertType) {
    this.systemSettingService.getPlaceholderByType(insertType).subscribe(
      respdata => {
        if (respdata['Data']) {
          let existing: any[] = this._toolButtons$.getValue();
          this.plcData = [];
          for (let plc of respdata['Data']) {
            this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
          }
          let peopleButton: string = insertType;
          // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
          existing.push({ text: peopleButton, data: this.plcData });
          let jobData: any = existing?.filter((item) => {
                return item.text === insertType
              });
              this._toolButtons$.next(jobData);            
       }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
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
    data: new Object({ type: this._appSetting.imageUploadConfigForKendoEditor['file_img_type_small'], size: this._appSetting.imageUploadConfigForKendoEditor['file_img_size_small'] }),
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
}

 //Who:Ankit Rawat, What:EWM-16493 EWM-16501 if local storage is not exists then call api to get the signature, When:20March2024
 getUserEmailSettingInfo()
 {
   let EmailSignature;
   const filterCache = this.cache.getLocalStorage("UserEmailSignature");    
   if(filterCache)
   {     
     if(filterCache!='<p></p>') {
       EmailSignature = filterCache;   
       this.newEmailTemplateForm.patchValue({
         'TemplateText': this.cache.getLocalStorage("UserEmailSignature")
       });
       this.getEditorVal=this.cache.getLocalStorage("UserEmailSignature");//by maneesh patch signature
     } 
   }
   else
   {
     this._profileInfoService.getUserEmailSettingInfo().subscribe(
       repsonsedata=>{
         this.loading=false;
         if(repsonsedata['HttpStatusCode']=='200')
         {
             if(repsonsedata['Data']['EmailSignature'])
             {
               EmailSignature=repsonsedata['Data']['EmailSignature'];
               if(EmailSignature!='<p></p>'){
                 this.cache.setLocalStorage("UserEmailSignature",EmailSignature);
                 this.newEmailTemplateForm.patchValue({
                   'TemplateText': this.cache.getLocalStorage("UserEmailSignature")
                 });
               }
             } 
         }
       });
   }
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

