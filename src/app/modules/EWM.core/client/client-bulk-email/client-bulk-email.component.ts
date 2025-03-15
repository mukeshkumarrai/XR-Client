/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 21-Feb-2024
  @Why: EWM-16076 EWM-16096
  @What:  This page will be use for the bulk email for client only
*/
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, ElementRef, ViewChild, Renderer2, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ResponceData } from '@app/shared/models/responce.model';
import { FileUploaderService } from '@app/shared/services/file-uploader.service';
import { ServiceListClass } from '@app/shared/services/sevicelist';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { MailServiceService } from '@app/shared/services/email-service/mail-service.service';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { ProfileInfoService } from '@app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { KendoEditorImageUploaderService } from '@app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EncryptionDecryptionService } from '@app/shared/services/encryption-decryption.service';
import { customDropdownConfig, UserEmailIntegration } from '@app/modules/EWM.core/shared/datamodels';
import { ContactReceipentPopupComponent } from '@app/modules/EWM.core/shared/contact-receipent-popup/contact-receipent-popup.component';
import { TemplatesComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/templates/templates.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { EmailPreviewPopupComponent } from '@app/modules/EWM.core/system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { ImageUploadKendoEditorPopComponent } from '@app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { CommonDropDownService } from '@app/modules/EWM.core/shared/services/common-dropdown-service/common-dropdown.service';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { MentionEditorComponent } from '@app/shared/mention-editor/mention-editor.component';

export interface Email {
  name: string;
}

@Component({
  selector: 'app-client-bulk-email',
  templateUrl: './client-bulk-email.component.html',
  styleUrls: ['./client-bulk-email.component.scss']
})
export class ClientBulkEmailComponent implements OnInit {
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
  JobReset: boolean=false;
  public JobId: any;
  public JoId: any;
  public JobTitle: any;
  public candidateId:any;
  public Source:any;
  emailProvider: any;
  getJobDataById: any;
  public workflowId: any;
  isBulkEmailPreviewBtn: boolean = true;
  ModuleName:string='CONT';
  isBulkEmail:boolean = true;
  xeopleSmartEmail:boolean;
  public Email: any;
  public isEmail: any;
  dirctionalLang;
  openDocumentPopUpFor: string='Client';
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
 public plcData = [];
 @ViewChild('editor') editor: EditorComponent;
 DefaultSignature:Number;
subscription$: Subscription;
common_DropdownC_Config:DRP_CONFIG;
public  selectedTempId: number;
selectable = true;
removable = true;
addOnBlur = true;
readonly separatorKeysCodes = [ENTER, COMMA] as const;
emails: Email[] = [];
selectedClientContacts:any=[];
AllContacts:any=[];
PrimaryContacts:any=[];
selectedClient: any=[];
ClientId: string='00000000-0000-0000-0000-000000000000';
checkboxDisabled: boolean = true;
  PrimaryContactStatus: boolean=false;
  AllContactsStatus: boolean=false;
  isfileAttachments:boolean;
  checkboxDisabledRedirect: boolean = true;
  ContactStatus:boolean;
  ClientContactId:string;
  StatusClientChecklist: boolean=false;
  AllStatusChecklist: boolean=false;
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string='';
  ownerList: string[]=[];
  public showErrorDesc: boolean = false;
  public tagList:any=['jobs'];
  public basic:any=[];
  ContactCheckboxDisabled:boolean=true;
  ClientCheckboxDisabled:boolean=true;
  resetEditorValue: Subject<any> = new Subject<any>();
 @ViewChild('mentionEditor') mentionEditor: MentionEditorComponent;
 getEmailEditorVal:string=''
  constructor(public dialogRef: MatDialogRef<ClientBulkEmailComponent>,public uploader: FileUploaderService,
     private fb: FormBuilder, private snackBService: SnackBarService,private dataService: CommonDropDownService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,private translateService: TranslateService,
    public systemSettingService: SystemSettingService,private mailService: MailServiceService,private _dialog: MatDialog,
    private serviceListClass: ServiceListClass,private _profileInfoService: ProfileInfoService, private _appSetting: AppSettingsService,
    public _snackBarService: SnackBarService,public _encryptionDecryptionService: EncryptionDecryptionService,private appSettingsService: AppSettingsService,
    private quickJobService: QuickJobService, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private renderer: Renderer2,private cache: CacheServiceService) {
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
        EmailTo: ['',[Validators.required]],
        EmailCC: [''],
        EmailBCC: [''],
        Subject: ['',[Validators.required, this.noWhitespaceValidator(),Validators.maxLength(500),Validators.minLength(5)]],
        TemplateText: [],
        JobId:[],
        UniqueId:[],
        Id:[],
        JobTitle:['']
      });
    let endPoint = this.workflowId ? this.serviceListClass.jobWithoutWorkflowV3 + '?WorkflowId=' + this.workflowId : this.serviceListClass.jobWithoutWorkflowV3;
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
      IMG_BIND_VALUE:'ProfileImage',
      FIND_BY_INDEX: 'Id'
    }
    this.getEditorVal='';
    this.mentionEditor?.editorFormControl.setValue(null);

  }

  ngOnInit() {    
    this.getUserEmailIntegration();
    //Who:Ankit Rawat, What:EWM-16493 EWM-16501 if local storage is not exists then call api to get the signature, When:20March2024
    this.getUserEmailSettingInfo();
    this.getInsertPlaceholderByType('Jobs');
    this.sendBtnDisabled=this.data?.IsEmailConnected==1?false:true;
    let mappedClientMail =  this.data?.selectedClient?.filter(res=>res?.ClientEmail!='' && res?.ClientEmail!=null && res?.ClientEmail!=undefined);
     if(mappedClientMail?.length>=1){
       this.ClientCheckboxDisabled=false;
     }
     this.selectedClientContacts=[];
     this.selectedClient=this.data?.selectedClient;
     if(this.data?.selectedClient?.length>=1){
      this.checkboxDisabledRedirect=true;
      this.ClientContactId=this.data?.selectedClient[0].ClientId
    }else{
      this.checkboxDisabledRedirect=false;
    }
    this.selectedClient?.forEach(element => {
      this.selectedClientContacts?.push(element?.ClientId);
      });
      this.ClientId= this.selectedClientContacts[0];
    this.getClientContactsList();
              //  @Who: maneesh, @When: 04-04-2024,@Why: @What: on changes on kendo editor catch the event here
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
  }
  /*
    @Type: File, <ts>
    @Name: clickMoreRecord function
    @Who: Nitin Bhati
    @When: 21-Feb-2024
    @Why: EWM-16076 EWM-16096
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
  localStorage.removeItem('selectEmailTemp');
    document.getElementsByClassName("quickNewEmailModal")[0].classList.remove("animate__slideInRight")
    document.getElementsByClassName("quickNewEmailModal")[0].classList.add("animate__slideOutRight");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '')?.trim();

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
    const value = event.value?.trim();
    var IsDuplicate = false;
    if (event.value?.trim()) {
      for (let i = 0; i < this.toEmailList?.length; i++) {
        if (this.toEmailList[i].EmailId === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value?.trim())) {
          this.toEmailList.push({ EmailId: event.value?.trim(), invalid: false });
          this.setFromEmailsValues();
        } else {
          this.toEmailList.push({ EmailId: event.value?.trim(), invalid: true });
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
      this.PrimaryContactStatus=false;
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
      /* this.newEmailTemplateForm.get("ccMails").clearValidators();
      this.newEmailTemplateForm.get("ccMails").setErrors({ required: true });
      this.newEmailTemplateForm.get("ccMails").markAsDirty(); */
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
    const value = event.value?.trim();
    var IsDuplicate = false;
    if (event.value?.trim()) {
      for (let i = 0; i < this.ccEmailList?.length; i++) {
        if (this.ccEmailList[i].value === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value?.trim())) {
          this.ccEmailList.push({ value: event.value?.trim(), invalid: false });
          this.setCCEmailsValues();
        } else {
          this.ccEmailList.push({ value: event.value?.trim(), invalid: true });
          this.setCCEmailsValues();
          this.newEmailTemplateForm.get("EmailCC").clearValidators();
          this.newEmailTemplateForm.controls["EmailCC"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.newEmailTemplateForm.get("EmailCC").value === null || this.newEmailTemplateForm.get("EmailCC").value === '') {
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
      'bccMails': eMailVal
    });

    if (eMailVal?.length === 0 || eMailVal === '') {
      /* this.newEmailTemplateForm.get("bccMails").clearValidators();
      this.newEmailTemplateForm.get("bccMails").setErrors({ required: true });
      this.newEmailTemplateForm.get("bccMails").markAsDirty(); */
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
    const value = event.value?.trim();
    var IsDuplicate = false;
    if (event.value?.trim()) {
      for (let i = 0; i < this.bccEmailList?.length; i++) {
        if (this.bccEmailList[i].value === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value?.trim())) {
          this.bccEmailList.push({ value: event.value?.trim(), invalid: false });
          this.setBccEmailsValues();
        } else {
          this.bccEmailList.push({ value: event.value?.trim(), invalid: true });
          this.setBccEmailsValues();
          this.newEmailTemplateForm.get("bccMails").clearValidators();
          this.newEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.newEmailTemplateForm.get("bccMails").value === null || this.newEmailTemplateForm.get("bccMails").value === '') {
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
@Who: Nitin Bhati
@When: 21-Feb-2024
@Why: EWM-16076 EWM-16096
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
   @Who: Nitin Bhati
   @When: 21-Feb-2024
   @Why: EWM-16076 EWM-16096
   @What: when realtion drop down changes
 */
onJobchange(data){
    this.selectedJobs=null;
    if(data==null || data=="")
    {
      this.selectedJobs=null;
      this.newEmailTemplateForm.patchValue(
        {
          JobId:null,
          JobTitle:null
        }
     )
    }
    else
    {
      this.selectedJobs=data;
      this.newEmailTemplateForm.patchValue(
        {
          JobId:data.Id,
          JobTitle:data.JobTitle
        }
     )
    }
}
 /*
   @Type: File, <ts>
   @Name: onJobchange
   @Who: Nitin Bhati
   @When: 21-Feb-2024
   @Why: EWM-16076 EWM-16096
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
  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
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
   @Who: Nitin Bhati
   @When: 21-Feb-2024
   @Why: EWM-16076 EWM-16096
   @What: send mail
 */
sendEmail(){
  this.loading=true;

  if (this.newEmailTemplateForm.invalid) {
    return;
  }
  let sendObj={};
  //sendObj['To']=this.newEmailTemplateForm.get("EmailTo").value;
  sendObj['Cc']=this.newEmailTemplateForm.get("EmailCC").value;
  sendObj['Bcc']=this.newEmailTemplateForm.get("EmailBCC").value;
  sendObj['Body']= this.newEmailTemplateForm.get("TemplateText").value;
  sendObj['Attachment']=this.fileAttachments?.length>0?true:false;
  sendObj['Files']=this.fileAttachments;
  sendObj['Subject']=this.newEmailTemplateForm.get("Subject").value?.trim();
  sendObj['JobId']=this.selectedJobs?.Id;
  sendObj['JobTitle']=this.selectedJobs?.JobTitle;
  sendObj['MailProvider']=this.emailProvider;
  sendObj['BodyType']='HTML';
  sendObj['CandidateId'] = this.candidateId;
  //sendObj['Source'] = this.Source;
  sendObj['RelatedToInternalCode'] = this.ModuleName;
  sendObj['DefaultSignature'] = this.DefaultSignature;
     let url = window.location.pathname + 'bulk-email' + window.location.search
    let emailContactList=[];
    this.toEmailList.forEach(x=>{
      emailContactList.push({
        'ModuleType':x.UserType,
        'Id':x.ContactId,
        'Emailto':x.EmailId
      })
    })
    sendObj['CandidateList'] = emailContactList;
    sendObj['PageUrl'] = url;
    let bulkEmail = this.mailService.bulkMailSend(sendObj);
  bulkEmail.subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        localStorage.removeItem('selectEmailTemp');
        this.loading=false;
        this.getEditorVal='';
        this.resetEditorValue.next(this.editorConfig);

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
// <!----@bantee @EWM-11601 @Whn 20-09-2023  error message Validation handled-->
  let draftObj={};
    draftObj['From']=this.newEmailTemplateForm.get("EmailFrom").value;
    draftObj['To']=this.newEmailTemplateForm.get("EmailTo").value;
    draftObj['Cc']=this.newEmailTemplateForm.get("EmailCC").value;
    draftObj['Bcc']=this.newEmailTemplateForm.get("EmailBCC").value;
    draftObj['Attachment']=this.fileAttachments?.length>0?true:false;
    draftObj['Subject']=this.newEmailTemplateForm.get("Subject").value?.trim();
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
    draftObj['JobId']= this.selectedJobs?.Id;
    draftObj['JobTitle']= this.selectedJobs?.JobTitle;
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
   @Who: Nitin Bhati
   @When: 21-Feb-2024
   @Why: EWM-16076 EWM-16096
   @What: reset the data for compose mail
 */
resetComposeEmail(){
  localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for clear value;
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
   @Who: Nitin Bhati
   @When: 21-Feb-2024
   @Why: EWM-16076 EWM-16096
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
   @Who: Nitin Bhati
   @When: 21-Feb-2024
   @Why: EWM-16076 EWM-16096
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
  @Who: Nitin Bhati
  @When: 21-Feb-2024
  @Why: EWM-16076 EWM-16096
  @What: to open template modal dialog
*/
      openTemplateModal() {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_insertTemplate';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
          const dialogRef = this.dialog.open(TemplatesComponent, {
            data: new Object({ selectedTemplateId:  this.selectedTempId,isMyActivity:true}),
            panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(res => {
           if(res!=false){
            this.selectedTempId=res?.data?.Id;
            this.systemSettingService.getEmailTemplateByID('?id=' + this.selectedTempId).subscribe(
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
                  //   'TemplateText': repsonsedata['Data'].TemplateText+this.cache.getLocalStorage("UserEmailSignature")
                  // });
                  // by maneesh,patch editor value,when:04/04/2024
                  if (this.cache.getLocalStorage("UserEmailSignature")==null) {
                    this.getEditorVal=repsonsedata['Data']?.TemplateText; 
                    this.newEmailTemplateForm.patchValue({
                      'Subject': repsonsedata.Data?.Subject,
                      'TemplateText': repsonsedata['Data']?.TemplateText
                    });   
                    }else{
                      this.newEmailTemplateForm.patchValue({
                        'Subject': repsonsedata.Data?.Subject,
                        'TemplateText': repsonsedata['Data']?.TemplateText+this.cache.getLocalStorage("UserEmailSignature")
                      });
                      this.getEditorVal=repsonsedata['Data']?.TemplateText+this.cache?.getLocalStorage("UserEmailSignature");
                    }
                    // adarsh singh EWM-14288 on 23-09-2023
                this.renderer.selectRootElement('#userRole-roleId').focus();
                this.newEmailTemplateForm.get('Subject').markAllAsTouched();
                // End
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
                  this.DefaultSignature = repsonsedata.Data?.DefaultSignature;
                  }
  // <!---------@When: 15-03-2023 @who:Bantee Kumar @why: EWM-10334 What: passing relatedTo value coming on selecting the template --------->
                  // calling function
                  // this.replaceTextIntoData(repsonsedata['Data'].TemplateText);
                  this.ModuleName = repsonsedata.Data?.RelatedTo;;
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
      @Name: identifyMailType
      @Who: Nitin Bhati
      @When: 21-Feb-2024
      @Why: EWM-16076 EWM-16096
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
      @Who: Nitin Bhati
      @When: 21-Feb-2024
      @Why: EWM-16076 EWM-16096
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
      @Who: Nitin Bhati
      @When: 21-Feb-2024
      @Why: EWM-16076 EWM-16096
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
      @Who: Nitin Bhati
      @When: 21-Feb-2024
      @Why: EWM-16076 EWM-16096
      @What: if value present  then patch value
    */
    patchValues(data:any){
      if(data.JobId && data.JobId!=="00000000-0000-0000-0000-000000000000"){
        this.selectedJobs={'Id':data.JobId};
      }else{
        this.selectedJobs=null;
      }
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
      //this.filestatus=true;
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
          candidateData?.forEach(element => {
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

  // Adarsh singh
  getFullJobdetails(jobId){
    this.loading = true;
    this.quickJobService.quickJobListBy('?JobId=' + jobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.getJobDataById = repsonsedata.Data;
          this.loading = false;
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
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
    let subject = this.newEmailTemplateForm.value.Subject;
    let body = this.newEmailTemplateForm.value.TemplateText;
    let JobId= this.newEmailTemplateForm.value.JobId;
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: new Object({ subjectName: subject, emailTemplateData: body,JobClientId:JobId,CandidateId:this.ClientContactId,isMailActive:true,openDocumentPopUpFor:this.openDocumentPopUpFor,emailToCount:this.toEmailList }),
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
  @Modified
  @Type: File, <ts>
  @Name: confirmSaveAsDraft function
  @Who: Adarsh Singh
  @When: 27-02-2023
  @Why: EWM-10633
  @What: FOR DIALOG BOX confirmation for Save as Draft
*/
   confirmSaveAsDraft(): void {
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
  localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for clear value;
        this.saveAsDraft();
      }
    });
  }


/*
  @Type: File, <ts>
  @Name: getInsertPlaceholderByType
  @Who: Adarsh Singh
  @When: 12-April-2023
  @Why: EWM-11851
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
}

noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

getClientContactsList() {
  this.loading = true;
  this.systemSettingService.getClientContactsList(this.selectedClientContacts).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata?.HttpStatusCode === 200) {
        this.loading = false;
        this.PrimaryContacts = repsonsedata?.Data?.PrimaryContacts;
        this.AllContacts = repsonsedata?.Data?.AllContacts;
          if(repsonsedata?.Data?.AllContacts?.length>=1){
          this.ContactCheckboxDisabled=false;
         }
        const arrayOfObjectsPrimary = repsonsedata?.Data?.PrimaryContacts;
        this.PrimaryContacts = arrayOfObjectsPrimary?.filter((obj, index, self) =>
            index === self.findIndex((o) => o.EmailId === obj.EmailId)
          );
        const arrayOfObjectsAllContacts = repsonsedata?.Data?.AllContacts;
        this.AllContacts = arrayOfObjectsAllContacts?.filter((obj, index, self) =>
            index === self.findIndex((o) => o.EmailId === obj.EmailId)
          );
        if(repsonsedata?.Data?.PrimaryContacts?.length>=1){
          this.checkboxDisabledRedirect=false;
          this.checkboxDisabled=false;
          this.PrimaryContactStatus=true;
          this.AllContactsStatus=false;
          this.toEmailList = [];
          this.toEmailList =  this.PrimaryContacts?.filter(res=>res?.EmailId!='' && res?.EmailId!=null && res?.EmailId!=undefined);
          this.ClientContactId=this.toEmailList[0].ContactId;
          this.openDocumentPopUpFor='Contact';
          this.newEmailTemplateForm.patchValue({
            'EmailTo': this.toEmailList
           })
        }else{
          this.PrimaryContactStatus=false;
          this.AllContactsStatus=true;
          this.toEmailList = [];
          this.toEmailList =  this.AllContacts?.filter(res=>res?.EmailId!='' && res?.EmailId!=null && res?.EmailId!=undefined);
          this.ClientContactId=this.toEmailList[0].ContactId;
          this.openDocumentPopUpFor='Contact';
          this.newEmailTemplateForm.patchValue({
            'EmailTo': this.toEmailList
           })
        }
      }else if(repsonsedata?.HttpStatusCode === 204){
        //this.mappedPhones = [];
        this.ContactStatus = true;
        this.loading = false;
      } else if (repsonsedata?.HttpStatusCode === 400) {
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

statusPrimary(values){
  this.toEmailList = [];
    if(values===true){
      this.toEmailList =  this.PrimaryContacts?.filter(res=>res?.EmailId!='' && res?.EmailId!=null && res?.EmailId!=undefined);
      this.PrimaryContactStatus=true;
      this.AllContactsStatus=false;
      this.StatusClientChecklist=false;
      this.AllStatusChecklist=false;
      this.ContactStatus=false;
      this.ClientContactId=this.toEmailList[0].ContactId;
          this.openDocumentPopUpFor='Contact';
      this.newEmailTemplateForm.patchValue({
        'EmailTo': this.toEmailList
       });
       this.newEmailTemplateForm.get("EmailTo").clearValidators();
       this.newEmailTemplateForm.get("EmailTo").markAsPristine();   
    }else{
     this.PrimaryContactStatus=false;
     this.AllContactsStatus=false;
     this.StatusClientChecklist=false;
     this.AllStatusChecklist=false;
     this.ContactStatus=true;
     this.newEmailTemplateForm.get("EmailTo").setErrors({required:true});
     this.newEmailTemplateForm.get("EmailTo").markAsTouched();
     this.newEmailTemplateForm.get("EmailTo").markAsDirty();
    }
  }
 statusAllContact(values){
  this.toEmailList = [];
  if(values===true){
    this.toEmailList =  this.AllContacts?.filter(res=>res?.EmailId!='' && res?.EmailId!=null && res?.EmailId!=undefined);
    this.ClientContactId=this.toEmailList[0].ContactId;
    this.openDocumentPopUpFor='Contact';
    this.PrimaryContactStatus=false;
    this.AllContactsStatus=true;
    this.ContactStatus=false;
    this.StatusClientChecklist=false;
    this.AllStatusChecklist=false;
    this.newEmailTemplateForm.patchValue({
      'EmailTo': this.toEmailList
     });
     this.newEmailTemplateForm.get("EmailTo").clearValidators();
     this.newEmailTemplateForm.get("EmailTo").markAsPristine(); 
  }else{
    this.PrimaryContactStatus=false;
    this.AllContactsStatus=false;
    this.ContactStatus=true;
    this.StatusClientChecklist=false;
    this.AllStatusChecklist=false;
    this.newEmailTemplateForm.get("EmailTo").setErrors({required:true});
    this.newEmailTemplateForm.get("EmailTo").markAsTouched();
    this.newEmailTemplateForm.get("EmailTo").markAsDirty();
  }
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
      // this.newEmailTemplateForm.patchValue({
      //   'TemplateText': this.cache.getLocalStorage("UserEmailSignature")
      // });
        // by maneesh,patch editor value,when:04/04/2024
        if (this.cache.getLocalStorage("UserEmailSignature")==null) {
          this.getEditorVal='' 
          this.newEmailTemplateForm.patchValue({
            'TemplateText': ''
          }); 
          }else{
            this.newEmailTemplateForm.patchValue({
              'TemplateText': this.cache.getLocalStorage("UserEmailSignature")
            });
            this.getEditorVal=this.cache.getLocalStorage("UserEmailSignature")
          }
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
                // this.newEmailTemplateForm.patchValue({
                //   'TemplateText': this.cache.getLocalStorage("UserEmailSignature")
                // });
 // by maneesh,patch editor value,when:04/04/2024
 if (this.cache.getLocalStorage("UserEmailSignature")==null) {
  this.getEditorVal=''  
  this.newEmailTemplateForm.patchValue({
    'TemplateText': ''
  });
  }else{
    this.newEmailTemplateForm.patchValue({
      'TemplateText': this.cache.getLocalStorage("UserEmailSignature")
    });
    this.getEditorVal=this.cache.getLocalStorage("UserEmailSignature")
  }              }
            } 
        }
      });
  }
}

statusClients(values){
  this.toEmailList = [];
    if(values===true){
      this.StatusClientChecklist=true;
      this.AllStatusChecklist=false;
      this.PrimaryContactStatus=false;
      this.AllContactsStatus=false;
      this.ContactStatus=false;
      this.toEmailList = [];
      const arrayOfObjectsAllClient = this.data?.selectedClient;
        let emailClient = arrayOfObjectsAllClient?.filter((obj, index, self) =>
            index === self.findIndex((o) => o.ClientEmail === obj.ClientEmail)
          );
      let EmailList =  emailClient?.filter(res=>res?.ClientEmail!='' && res?.ClientEmail!=null && res?.ClientEmail!=undefined);
      this.ClientContactId=this.data?.selectedClient[0].ClientId;
      this.openDocumentPopUpFor='Client';
      EmailList?.forEach(x => {
        x["ContactId"] = x?.ClientId,
        x["UserType"] ='CLIE',
        this.toEmailList.push({EmailId: x.ClientEmail,ContactId: x.ClientId,UserType:'CLIE'});
        this.newEmailTemplateForm.patchValue({
        'EmailTo': x.ClientEmail
       })
      });
      this.newEmailTemplateForm.get("EmailTo").clearValidators();
      this.newEmailTemplateForm.get("EmailTo").markAsPristine(); 
    }else{
     this.PrimaryContactStatus=false;
     this.AllContactsStatus=false;
     this.ContactStatus=true;
     this.StatusClientChecklist=false;
     this.AllStatusChecklist=false;
     this.newEmailTemplateForm.get("EmailTo").setErrors({required:true});
     this.newEmailTemplateForm.get("EmailTo").markAsTouched();
     this.newEmailTemplateForm.get("EmailTo").markAsDirty();
    }
 }
 AllStatus(values){
   this.toEmailList=[];
    if(values===true){
      this.AllStatusChecklist=true;
      this.StatusClientChecklist=false;
      this.PrimaryContactStatus=false;
      this.AllContactsStatus=false;
      this.ContactStatus=false;
      const arrayOfObjectsAll = this.data?.selectedClient;
        let SelectedEmailClient = arrayOfObjectsAll?.filter((obj, index, self) =>
            index === self.findIndex((o) => o.ClientEmail === obj.ClientEmail)
          );
      let EmailList =  SelectedEmailClient?.filter(res=>res?.ClientEmail!='' && res?.ClientEmail!=null && res?.ClientEmail!=undefined);
      this.ClientContactId=this.data?.selectedClient[0].ClientId;
      this.openDocumentPopUpFor='Client';
      let toEmailListClient=[];
      EmailList?.forEach(x => {
       toEmailListClient?.push({ EmailId: x.ClientEmail,ContactId: x.ContactId,UserType:x.UserType});
     });
      const mergedArray = [...this.AllContacts, ...this.PrimaryContacts, ...toEmailListClient];
      let SelectedEmail = mergedArray?.filter((obj, index, self) =>
            index === self.findIndex((o) => o.EmailId === obj.EmailId)
          );
      this.toEmailList =  SelectedEmail?.filter(res=>res?.EmailId!='' && res?.EmailId!=null && res?.EmailId!=undefined);
      this.newEmailTemplateForm.patchValue({
        'EmailTo': this.toEmailList
       });
       this.newEmailTemplateForm.get("EmailTo").clearValidators();
       this.newEmailTemplateForm.get("EmailTo").markAsPristine();   
    }else{
     this.PrimaryContactStatus=false;
     this.AllContactsStatus=false;
     this.ContactStatus=true;
     this.AllStatusChecklist=false;
     this.StatusClientChecklist=false;
     this.newEmailTemplateForm.get("EmailTo").setErrors({required:true});
     this.newEmailTemplateForm.get("EmailTo").markAsTouched();
     this.newEmailTemplateForm.get("EmailTo").markAsDirty();
    }
 }


 //by maneesh,when:04/04/2024 for get enent value when click editor
 getEditorFormInfo(event) {
  this.ownerList = event?.ownerList;
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
    this.newEmailTemplateForm.get('TemplateText').setValue(event?.val);
  } else {
    this.newEmailTemplateForm.get('TemplateText').updateValueAndValidity();
    this.newEmailTemplateForm.get("TemplateText").markAsTouched();
  }
}
getEditorImageFormInfo(event){
  this.newEmailTemplateForm.get('TemplateText').setValue(event?.val);
}
}
