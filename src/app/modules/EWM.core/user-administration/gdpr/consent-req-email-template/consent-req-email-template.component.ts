/*
 @(C): Entire Software
 @Type: File, <TS>
 @Who: Anup Singh
 @When: 14-Feb-2022
 @Why: EWM-4672 EWM-5191
 @What: This page wil be use only for consent req. email tempalate Component HTML
 */
 import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
 import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
 import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 import { MatChipInputEvent } from '@angular/material/chips';
 import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
 import { ActivatedRoute, Router } from '@angular/router';
 import { TranslateService } from '@ngx-translate/core';
 import { EditorComponent } from '@progress/kendo-angular-editor';
 import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
 import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
 import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
 import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
 import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
 import { ContactReceipentPopupComponent } from '../../../shared/contact-receipent-popup/contact-receipent-popup.component';
 import { CompanyContactPopupComponent } from '../../../shared/quick-modal/quick-company/company-contact-popup/company-contact-popup.component';
 import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
 
 @Component({
   selector: 'app-consent-req-email-template',
   templateUrl: './consent-req-email-template.component.html',
   styleUrls: ['./consent-req-email-template.component.scss']
 })
 export class ConsentReqEmailTemplateComponent implements OnInit {
     
   public loading :boolean=false;
   public isCandidate: boolean = true;
   public isEmployee: boolean = false;
 
   @ViewChild('editorCandidate') editorCandidate: EditorComponent;
   private _toolButtonsCandidate$ = new BehaviorSubject<any[]>([]);
   public toolButtonsCandidate$: Observable<any> = this._toolButtonsCandidate$.asObservable();
 
   @ViewChild('editorEmployee') editorEmployee: EditorComponent;
   private _toolButtonsEmployee$ = new BehaviorSubject<any[]>([]);
   public toolButtonsEmployee$: Observable<any> = this._toolButtonsEmployee$.asObservable();
 
   public plcDataCandidate = [];
   public plcDataEmployee = [];
 
 
   public ccEmailsContactCandidate: any = [];
   public bccEmailsContactCandidate: any = [];
 
   readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON, SPACE];
   public fromEmailList = [];
 
   public ccEmailsContactEmployee: any = [];
   public bccEmailsContactEmployee: any = [];
   public removable:boolean = true;
 
   emailTempalateCandidateForm: FormGroup;
   emailTempalateEmployeeForm: FormGroup;
 
   @Output() consentReqEmailTemp = new EventEmitter();
  
   candEmailTemp= ``;
   emplEmailTemp= ``;
 
   public moduleTypeList: any[] = [];
   positionMatTab: any;
   dirctionalLang;
//  kendo image uploader Adarsh singh 01-Aug-2023
 subscription$: Subscription;
 // End
 public editorConfig: EDITOR_CONFIG;
 public getEditorVal:string;
 public showErrorDesc: boolean=false;
 getRequiredValidationMassage: Subject<any> = new Subject<any>();
public tagList:any=['Candidate'];
public tagListEmployee:any=['Employee'];

public getEditorValEmployee:string;
public showErrorDescEmployee: boolean=false;
resetEditorValue: Subject<any> = new Subject<any>();
   constructor(private systemSettingService: SystemSettingService, private snackBService: SnackBarService, private translateService: TranslateService,
       public _sidebarService: SidebarService, private route: Router, private _dialog: MatDialog,
      public dialog: MatDialog, public fb: FormBuilder,
     private commonserviceService: CommonserviceService,private appSettingsService: AppSettingsService,
     private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
 
     this.emailTempalateCandidateForm = this.fb.group({
       Id:[0],
       CandidateModule: [null, [Validators.required]],
       CandidateTemplateName: ['', [Validators.required, Validators.maxLength(100)]],
       CandidateSubject: ['', [Validators.required, Validators.maxLength(200)]],
       CandidateEmailTemplate: ['', [Validators.required]],
       ccMailsCandidate: [''],
       bccMailsCandidate: [''],
       Status: [0],
     });
 
     this.emailTempalateEmployeeForm = this.fb.group({
       Id:[0],
       EmployeeModule: [null, [Validators.required]],
       EmployeeTemplateName: ['', [Validators.required, Validators.maxLength(100)]],
       EmployeeSubject: ['', [Validators.required, Validators.maxLength(200)]],
       EmployeeEmailTemplate: ['', [Validators.required]],
       ccMailsEmployee: [''],
       bccMailsEmployee: [''],
       Status: [0],
     });
 
   }
 
   ngOnInit(): void {
     this.getDataCandidate();
     this.getDataEmployee();
 
     this.getUserTypeList();
 
     this.getGDPREmailTempByModule('CAND')
     
 
     this.commonserviceService.onUserLanguageDirections.subscribe(res => {
       this.positionMatTab=res;
     });
     this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_pageTemplate',
      Tag:this.tagList,
      EditorTools:[],
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
   }
 
   /*
 @Type: File, <ts>
 @Name: onDismiss
 @Who: Anup Singh
 @When: 14-Feb-2022
 @Why: EWM-4672 EWM-5191
 @What: for close drawer
 */
   onDismiss() {
     this.consentReqEmailTemp.emit(true);
   }
 
   /*
 @Type: File, <ts>
 @Name: selectedTabValue
 @Who: Anup Singh
 @When: 14-Feb-2022
 @Why: EWM-4672 EWM-5191
 @What: when tab change msg change
 */
   
   selectedTabValue(value: any) {
     this.loading=true;
     if (value.index == 0) {
       this.isCandidate = true;
       this.isEmployee = false;
       this.editorConfig={
         REQUIRED:false,
         DESC_VALUE:null,
         PLACEHOLDER:'label_pageTemplate', 
         Tag:this.tagList,
         EditorTools:[],
         MentionStatus:false,
         maxLength:0,
         MaxlengthErrormessage:false,
         JobActionComment:false
       }
       this.showErrorDesc=false;
       this.resetEditorValue.next(this.editorConfig);
       this.getGDPREmailTempByModule('CAND');
     } else if (value.index == 1) {
       this.isCandidate = false;
       this.isEmployee = true;
       this.showErrorDescEmployee=false;

       this.editConfigForEmployee();
       this.getGDPREmailTempByModule('EMPL')
     }
   }
 
   /*
  @Type: File, <ts>
  @Name: getDataCandidate
  @Who: Anup Singh
  @When: 14-Feb-2022
  @Why: EWM-4672 EWM-5191
  @What: get candidate dropdown html editor
  */
   getDataCandidate() {
     this.systemSettingService.getPlaceholderTypeAll().subscribe(
       repsonsedata => {
         for (let result of repsonsedata['Data']) {
           this.systemSettingService.getPlaceholderByType(result['Type']).subscribe(
             respdata => {
               if (respdata['Data']) {
                 let existingCandidate: any[] = this._toolButtonsCandidate$.getValue();
                 this.plcDataCandidate = [];
                 for (let plc of respdata['Data']) {
                   this.plcDataCandidate.push({ text: plc['Placeholder'], icon: '', click: () => { this.editorCandidate.exec('insertText', { text: plc['PlaceholderTag'] }); } })
                 }
                 let peopleButton: string = result['Type'];
                 // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
                 existingCandidate.push({ text: peopleButton, data: this.plcDataCandidate });
 
                 ///For Candidate
                 let candidateData: any = existingCandidate.filter((item) => {
                   return item.text === "Candidate"
                 })
                 this._toolButtonsCandidate$.next(candidateData);
                 //////     
 
               }
             }, err => {
               this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
             });
         }
       }, err => {
         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       });
 
   }
 
 
   /*
    @Type: File, <ts>
    @Name: getDataEmployee
    @Who: Anup Singh
    @When: 14-Feb-2022
    @Why: EWM-4672 EWM-5191
    @What: get Employee dropdown html editor
    */
   getDataEmployee() {
     this.systemSettingService.getPlaceholderTypeAll().subscribe(
       repsonsedata => {
         for (let result of repsonsedata['Data']) {
           this.systemSettingService.getPlaceholderByType(result['Type']).subscribe(
             respdata => {
               if (respdata['Data']) {
                 let existingEmployee: any[] = this._toolButtonsEmployee$.getValue();
                 this.plcDataEmployee = [];
                 for (let plc of respdata['Data']) {
                   this.plcDataEmployee.push({ text: plc['Placeholder'], icon: '', click: () => { this.editorEmployee.exec('insertText', { text: plc['PlaceholderTag'] }); } })
                 }
                 let peopleButton: string = result['Type'];
                 // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
                 existingEmployee.push({ text: peopleButton, data: this.plcDataEmployee });
 
                 ///For Employee
                 let employeeData: any = existingEmployee.filter((item) => {
                   return item.text === "Employee"
                 })
                 this._toolButtonsEmployee$.next(employeeData);
                 //////     
 
               }
             }, err => {
               this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
             });
         }
       }, err => {
         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       });
 
   }
 
   /*
   @Type: File, <ts>
   @Name: validateEmail
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For Validate Email
   */
   private validateEmail(email) {
    // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     var re = /^[a-zA-Z0-9+_.]+@[a-zA-Z0-9.]+$/;
    
     return re.test(String(email).toLowerCase());
   }
 
 
   /*
   @Type: File, <ts>
   @Name: validateEmail
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For Validate Email
   */
   getUserContactInfo(currEmailType) {
     const dialogConfig = new MatDialogConfig();
     dialogConfig.disableClose = true;
     dialogConfig.id = "modal-component";
     dialogConfig.height = "";
     dialogConfig.width = "100%";
     dialogConfig.autoFocus = false;
     dialogConfig.panelClass = 'myDialogCroppingImage';
     dialogConfig.data = null;// change by priti at 28 may 2021
     dialogConfig.maxWidth = "750px";
     dialogConfig.panelClass = ['quick-modalbox', 'contact_receipent', 'animate__animated', 'animate__zoomIn'];
     const modalDialog = this._dialog.open(ContactReceipentPopupComponent, dialogConfig);
     modalDialog.afterClosed().subscribe(res => {
       for (let i = 0; i < res['data'].length; i++) {
         let IsDuplicate = false;
 
         if (currEmailType === 'CC') {
           for (let j = 0; j < this.ccEmailsContactCandidate.length; j++) {
             if (this.ccEmailsContactCandidate[j].value === res['data'][i]['emailId']) {
               IsDuplicate = true;
             }
           }
 
           if (IsDuplicate === false) {
             if (this.validateEmail(res['data'][i]['emailId'])) {
               this.ccEmailsContactCandidate.push({ value: res['data'][i]['emailId'], invalid: false });
               this.setCCEmailsValuesCandidate();
             } else {
               this.ccEmailsContactCandidate.push({ value: res['data'][i]['emailId'], invalid: true });
               this.setCCEmailsValuesCandidate();
               this.emailTempalateCandidateForm.get("ccMailsCandidate").clearValidators();
               this.emailTempalateCandidateForm.controls["ccMailsCandidate"].setErrors({ 'incorrectEmail': true });
             }
           }
         }
         else if (currEmailType === 'BCC') {
           for (let j = 0; j < this.bccEmailsContactCandidate.length; j++) {
             if (this.bccEmailsContactCandidate[j].value === res['data'][i]['emailId']) {
               IsDuplicate = true;
             }
           }
 
           if (IsDuplicate === false) {
             if (this.validateEmail(res['data'][i]['emailId'])) {
               this.bccEmailsContactCandidate.push({ value: res['data'][i]['emailId'], invalid: false });
               this.setBccEmailsValuesCandidate();
             } else {
               this.bccEmailsContactCandidate.push({ value: res['data'][i]['emailId'], invalid: true });
               this.setBccEmailsValuesCandidate();
               this.emailTempalateCandidateForm.get("bccMailsCandidate").clearValidators();
               this.emailTempalateCandidateForm.controls["bccMailsCandidate"].setErrors({ 'incorrectEmail': true });
             }
           }
         }
         else if (currEmailType === 'employeeCC') {
           for (let j = 0; j < this.ccEmailsContactEmployee.length; j++) {
             if (this.ccEmailsContactEmployee[j].value === res['data'][i]['emailId']) {
               IsDuplicate = true;
             }
           }
 
           if (IsDuplicate === false) {
             if (this.validateEmail(res['data'][i]['emailId'])) {
               this.ccEmailsContactEmployee.push({ value: res['data'][i]['emailId'], invalid: false });
               this.setCCEmailsValuesEmployee();
             } else {
               this.ccEmailsContactEmployee.push({ value: res['data'][i]['emailId'], invalid: true });
               this.setCCEmailsValuesEmployee();
               this.emailTempalateEmployeeForm.get("ccMailsEmployee").clearValidators();
               this.emailTempalateEmployeeForm.controls["ccMailsEmployee"].setErrors({ 'incorrectEmail': true });
             }
           }
         }
         else if (currEmailType === 'employeeBCC') {
           for (let j = 0; j < this.bccEmailsContactEmployee.length; j++) {
             if (this.bccEmailsContactEmployee[j].value === res['data'][i]['emailId']) {
               IsDuplicate = true;
             }
           }
 
           if (IsDuplicate === false) {
             if (this.validateEmail(res['data'][i]['emailId'])) {
               this.bccEmailsContactEmployee.push({ value: res['data'][i]['emailId'], invalid: false });
               this.setBccEmailsValuesEmployee();
             } else {
               this.bccEmailsContactEmployee.push({ value: res['data'][i]['emailId'], invalid: true });
               this.setBccEmailsValuesEmployee();
               this.emailTempalateEmployeeForm.get("bccMailsEmployee").clearValidators();
               this.emailTempalateEmployeeForm.controls["bccMailsEmployee"].setErrors({ 'incorrectEmail': true });
             }
           }
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

     return false;

    

   }
 
 
   //////////////For CC BCC Candidate Section///////////////
 
   /*
   @Type: File, <ts>
   @Name: setCCEmailsValuesCandidate
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For set CC Emails Values Candidate
   */
   setCCEmailsValuesCandidate() {
     let eMailVal = '';
     let IsValid = true;
 
     for (let i = 0; i < this.ccEmailsContactCandidate.length; i++) {
       if (this.validateEmail(this.ccEmailsContactCandidate[i].value) === false) {
         IsValid = false;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.ccEmailsContactCandidate[i].value;
       }
       else {
         eMailVal += ',' + this.ccEmailsContactCandidate[i].value;
       }
     }
 
     this.emailTempalateCandidateForm.patchValue({
       'ccMailsCandidate': eMailVal
     });
 
     if (IsValid === false) {
       this.emailTempalateCandidateForm.get("ccMailsCandidate").clearValidators();
       this.emailTempalateCandidateForm.controls["ccMailsCandidate"].setErrors({ 'incorrectEmail': true });
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: removeCandidateccEmail
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For remove Candidate cc Email
   */
   removeCandidateccEmail(data: any): void {
     if (this.ccEmailsContactCandidate.indexOf(data) >= 0) {
       this.ccEmailsContactCandidate.splice(this.ccEmailsContactCandidate.indexOf(data), 1);
     }
 
     let eMailVal = '';
     let invalidEmail = false;
 
     for (let i = 0; i < this.ccEmailsContactCandidate.length; i++) {
       if (this.ccEmailsContactCandidate[i].invalid === true) {
         invalidEmail = true;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.ccEmailsContactCandidate[i].value;
       }
       else {
         eMailVal += ',' + this.ccEmailsContactCandidate[i].value;
       }
     }
 
     this.emailTempalateCandidateForm.patchValue({
       'ccMailsCandidate': eMailVal
     });
 
     if (eMailVal.length === 0 || eMailVal === '') {
       /* this.addEmailTemplateForm.get("ccMails").clearValidators();
       this.addEmailTemplateForm.get("ccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("ccMails").markAsDirty(); */
     }
     else {
       if (invalidEmail) {
         this.emailTempalateCandidateForm.get("ccMailsCandidate").clearValidators();
         this.emailTempalateCandidateForm.controls["ccMailsCandidate"].setErrors({ 'incorrectEmail': true });
       }
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: addCandidateCC
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For add Candidate CC
   */
   addCandidateCC(event: MatChipInputEvent): void {
     const input = event.input;
     const value = event.value;
     var IsDuplicate = false;
 
     if (event.value) {
       for (let i = 0; i < this.ccEmailsContactCandidate.length; i++) {
         if (this.ccEmailsContactCandidate[i].value === value) {
           IsDuplicate = true;
         }
       }
       if (IsDuplicate === false) {
         if (this.validateEmail(event.value)) {
           this.ccEmailsContactCandidate.push({ value: event.value, invalid: false });
           this.setCCEmailsValuesCandidate();
         } else {
           this.ccEmailsContactCandidate.push({ value: event.value, invalid: true });
           this.setCCEmailsValuesCandidate();
           this.emailTempalateCandidateForm.get("ccMailsCandidate").clearValidators();
           this.emailTempalateCandidateForm.controls["ccMailsCandidate"].setErrors({ 'incorrectEmail': true });
         }
       }
     }
     else if (this.emailTempalateCandidateForm.get("ccMailsCandidate").value === null || this.emailTempalateCandidateForm.get("ccMailsCandidate").value === '') {
       /* this.addEmailTemplateForm.get("ccMails").clearValidators();
       this.addEmailTemplateForm.get("ccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("ccMails").markAsDirty(); */
     }
     if (event.input) {
       event.input.value = '';
     }
   }
 
   /*
   @Type: File, <ts>
   @Name: setBccEmailsValuesCandidate
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For set Bcc Emails Values Candidate
   */
   setBccEmailsValuesCandidate() {
     let eMailVal = '';
     let IsValid = true;
 
     for (let i = 0; i < this.bccEmailsContactCandidate.length; i++) {
       if (this.validateEmail(this.bccEmailsContactCandidate[i].value) === false) {
         IsValid = false;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.bccEmailsContactCandidate[i].value;
       }
       else {
         eMailVal += ',' + this.bccEmailsContactCandidate[i].value;
       }
     }
 
     this.emailTempalateCandidateForm.patchValue({
       'bccMailsCandidate': eMailVal
     });
 
     if (IsValid === false) {
       this.emailTempalateCandidateForm.get("bccMailsCandidate").clearValidators();
       this.emailTempalateCandidateForm.controls["bccMailsCandidate"].setErrors({ 'incorrectEmail': true });
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: removeCandidateBccEmail
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For remove Candidate Bcc Email
   */
   removeCandidateBccEmail(data: any): void {
     if (this.bccEmailsContactCandidate.indexOf(data) >= 0) {
       this.bccEmailsContactCandidate.splice(this.bccEmailsContactCandidate.indexOf(data), 1);
     }
 
     let eMailVal = '';
     let invalidEmail = false;
 
     for (let i = 0; i < this.bccEmailsContactCandidate.length; i++) {
       if (this.bccEmailsContactCandidate[i].invalid === true) {
         invalidEmail = true;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.bccEmailsContactCandidate[i].value;
       }
       else {
         eMailVal += ',' + this.bccEmailsContactCandidate[i].value;
       }
     }
 
     this.emailTempalateCandidateForm.patchValue({
       'bccMailsCandidate': eMailVal
     });
 
     if (eMailVal.length === 0 || eMailVal === '') {
       /* this.addEmailTemplateForm.get("bccMails").clearValidators();
       this.addEmailTemplateForm.get("bccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("bccMails").markAsDirty(); */
     }
     else {
       if (invalidEmail) {
         this.emailTempalateCandidateForm.get("bccMailsCandidate").clearValidators();
         this.emailTempalateCandidateForm.controls["bccMailsCandidate"].setErrors({ 'incorrectEmail': true });
       }
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: addCandidateBcc
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For add Candidate Bcc
   */
   addCandidateBcc(event: MatChipInputEvent): void {
     const input = event.input;
     const value = event.value;
     var IsDuplicate = false;
 
     if (event.value) {
       for (let i = 0; i < this.bccEmailsContactCandidate.length; i++) {
         if (this.bccEmailsContactCandidate[i].value === value) {
           IsDuplicate = true;
         }
       }
       if (IsDuplicate === false) {
         if (this.validateEmail(event.value)) {
           this.bccEmailsContactCandidate.push({ value: event.value, invalid: false });
           this.setBccEmailsValuesCandidate();
         } else {
           this.bccEmailsContactCandidate.push({ value: event.value, invalid: true });
           this.setBccEmailsValuesCandidate();
           this.emailTempalateCandidateForm.get("bccMailsCandidate").clearValidators();
           this.emailTempalateCandidateForm.controls["bccMailsCandidate"].setErrors({ 'incorrectEmail': true });
         }
       }
     }
     else if (this.emailTempalateCandidateForm.get("bccMailsCandidate").value === null || this.emailTempalateCandidateForm.get("bccMailsCandidate").value === '') {
       /* this.addEmailTemplateForm.get("bccMails").clearValidators();
       this.addEmailTemplateForm.get("bccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("bccMails").markAsDirty(); */
     }
     if (event.input) {
       event.input.value = '';
     }
   }
 
   //////////////End For CC BCC Candidate Section///////////////
 
 
 
   //////////////For CC BCC Employee Section///////////////
 
   /*
   @Type: File, <ts>
   @Name: setCCEmailsValuesEmployee
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For set CC Emails Values Employee
   */
   setCCEmailsValuesEmployee() {
     let eMailVal = '';
     let IsValid = true;
 
     for (let i = 0; i < this.ccEmailsContactEmployee.length; i++) {
       if (this.validateEmail(this.ccEmailsContactEmployee[i].value) === false) {
         IsValid = false;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.ccEmailsContactEmployee[i].value;
       }
       else {
         eMailVal += ',' + this.ccEmailsContactEmployee[i].value;
       }
     }
 
     this.emailTempalateEmployeeForm.patchValue({
       'ccMailsEmployee': eMailVal
     });
 
     if (IsValid === false) {
       this.emailTempalateEmployeeForm.get("ccMailsEmployee").clearValidators();
       this.emailTempalateEmployeeForm.controls["ccMailsEmployee"].setErrors({ 'incorrectEmail': true });
     }
   }
 
   /*
   @Type: File, <ts>
   @Name: removeEmployeeCCEmail
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For remove remove Employee CC Email
   */
   removeEmployeeCCEmail(data: any): void {
     if (this.ccEmailsContactEmployee.indexOf(data) >= 0) {
       this.ccEmailsContactEmployee.splice(this.ccEmailsContactEmployee.indexOf(data), 1);
     }
 
     let eMailVal = '';
     let invalidEmail = false;
 
     for (let i = 0; i < this.ccEmailsContactEmployee.length; i++) {
       if (this.ccEmailsContactEmployee[i].invalid === true) {
         invalidEmail = true;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.ccEmailsContactEmployee[i].value;
       }
       else {
         eMailVal += ',' + this.ccEmailsContactEmployee[i].value;
       }
     }
 
     this.emailTempalateEmployeeForm.patchValue({
       'ccMailsEmployee': eMailVal
     });
 
     if (eMailVal.length === 0 || eMailVal === '') {
       /* this.addEmailTemplateForm.get("ccMails").clearValidators();
       this.addEmailTemplateForm.get("ccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("ccMails").markAsDirty(); */
     }
     else {
       if (invalidEmail) {
         this.emailTempalateEmployeeForm.get("ccMailsEmployee").clearValidators();
         this.emailTempalateEmployeeForm.controls["ccMailsEmployee"].setErrors({ 'incorrectEmail': true });
       }
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: addEmployeeCC
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What: Add CC  For Employee
   */
   addEmployeeCC(event: MatChipInputEvent): void {
     const input = event.input;
     const value = event.value;
     var IsDuplicate = false;
 
     if (event.value) {
       for (let i = 0; i < this.ccEmailsContactEmployee.length; i++) {
         if (this.ccEmailsContactEmployee[i].value === value) {
           IsDuplicate = true;
         }
       }
       if (IsDuplicate === false) {
         if (this.validateEmail(event.value)) {
           this.ccEmailsContactEmployee.push({ value: event.value, invalid: false });
           this.setCCEmailsValuesEmployee();
         } else {
           this.ccEmailsContactEmployee.push({ value: event.value, invalid: true });
           this.setCCEmailsValuesEmployee();
           this.emailTempalateEmployeeForm.get("ccMailsEmployee").clearValidators();
           this.emailTempalateEmployeeForm.controls["ccMailsEmployee"].setErrors({ 'incorrectEmail': true });
         }
       }
     }
     else if (this.emailTempalateEmployeeForm.get("ccMailsEmployee").value === null || this.emailTempalateEmployeeForm.get("ccMailsCandidate").value === '') {
       /* this.addEmailTemplateForm.get("ccMails").clearValidators();
       this.addEmailTemplateForm.get("ccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("ccMails").markAsDirty(); */
     }
     if (event.input) {
       event.input.value = '';
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: setBccEmailsValuesEmployee
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For Validation of Bcc Emails Values Employee
   */
   setBccEmailsValuesEmployee() {
     let eMailVal = '';
     let IsValid = true;
 
     for (let i = 0; i < this.bccEmailsContactEmployee.length; i++) {
       if (this.validateEmail(this.bccEmailsContactEmployee[i].value) === false) {
         IsValid = false;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.bccEmailsContactEmployee[i].value;
       }
       else {
         eMailVal += ',' + this.bccEmailsContactEmployee[i].value;
       }
     }
 
     this.emailTempalateEmployeeForm.patchValue({
       'bccMailsEmployee': eMailVal
     });
 
     if (IsValid === false) {
       this.emailTempalateEmployeeForm.get("bccMailsEmployee").clearValidators();
       this.emailTempalateEmployeeForm.controls["bccMailsEmployee"].setErrors({ 'incorrectEmail': true });
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: removeEmployeeBccEmail
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What:For remove BCC Employee
   */
   removeEmployeeBccEmail(data: any): void {
     if (this.bccEmailsContactEmployee.indexOf(data) >= 0) {
       this.bccEmailsContactEmployee.splice(this.bccEmailsContactEmployee.indexOf(data), 1);
     }
 
     let eMailVal = '';
     let invalidEmail = false;
 
     for (let i = 0; i < this.bccEmailsContactEmployee.length; i++) {
       if (this.bccEmailsContactEmployee[i].invalid === true) {
         invalidEmail = true;
       }
 
       if (eMailVal.length === 0 || eMailVal === '') {
         eMailVal = this.bccEmailsContactEmployee[i].value;
       }
       else {
         eMailVal += ',' + this.bccEmailsContactEmployee[i].value;
       }
     }
 
     this.emailTempalateEmployeeForm.patchValue({
       'bccMailsEmployee': eMailVal
     });
 
     if (eMailVal.length === 0 || eMailVal === '') {
       /* this.addEmailTemplateForm.get("bccMails").clearValidators();
       this.addEmailTemplateForm.get("bccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("bccMails").markAsDirty(); */
     }
     else {
       if (invalidEmail) {
         this.emailTempalateEmployeeForm.get("bccMailsEmployee").clearValidators();
         this.emailTempalateEmployeeForm.controls["bccMailsEmployee"].setErrors({ 'incorrectEmail': true });
       }
     }
   }
 
 
   /*
   @Type: File, <ts>
   @Name: addEmployeeBcc
   @Who: Anup Singh
   @When: 14-Feb-2022
   @Why: EWM-4672 EWM-5191
   @What: Add BCC for Employee
   */
   addEmployeeBcc(event: MatChipInputEvent): void {
     const input = event.input;
     const value = event.value;
     var IsDuplicate = false;
 
     if (event.value) {
       for (let i = 0; i < this.bccEmailsContactEmployee.length; i++) {
         if (this.bccEmailsContactEmployee[i].value === value) {
           IsDuplicate = true;
         }
       }
       if (IsDuplicate === false) {
         if (this.validateEmail(event.value)) {
           this.bccEmailsContactEmployee.push({ value: event.value, invalid: false });
           this.setBccEmailsValuesEmployee();
         } else {
           this.bccEmailsContactEmployee.push({ value: event.value, invalid: true });
           this.setBccEmailsValuesEmployee();
           this.emailTempalateEmployeeForm.get("bccMailsEmployee").clearValidators();
           this.emailTempalateEmployeeForm.controls["bccMailsEmployee"].setErrors({ 'incorrectEmail': true });
         }
       }
     }
     else if (this.emailTempalateEmployeeForm.get("bccMailsEmployee").value === null || this.emailTempalateEmployeeForm.get("bccMailsEmployee").value === '') {
       /* this.addEmailTemplateForm.get("bccMails").clearValidators();
       this.addEmailTemplateForm.get("bccMails").setErrors({ required: true });
       this.addEmailTemplateForm.get("bccMails").markAsDirty(); */
     }
     if (event.input) {
       event.input.value = '';
     }
   }
 
   //////////////End For CC BCC Employee Section///////////////
 
 
 
 
     /*
   @Type: File, <ts>
   @Name: getUserTypeList
   @Who: Anup Singh
   @When: 15-Feb-2022
   @Why: EWM-4672 EWM-5192
   @What:For module list
   */
   getUserTypeList() {
     this.systemSettingService.fetchModuleList().subscribe(
       (repsonsedata: any) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.moduleTypeList = repsonsedata.Data;
         }
         else {
           // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
       }, err => {
         // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
   }
 
 
     /*
   @Type: File, <ts>
   @Name: getGDPREmailTempByModule
   @Who: Anup Singh
   @When: 15-Feb-2022
   @Why: EWM-4672 EWM-5192
   @What:For get GDPR Email Template By Module
   */
   getGDPREmailTempByModule(module) {
     this.loading = true;
     this.systemSettingService.getGDPREmailTempByModule("?moduleType=" + module).subscribe(
       (repsonsedata: any) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.loading = false;
           if (this.isCandidate === true) {
             this.patchDataForCandidate(repsonsedata.Data);
           } else if (this.isEmployee === true) {
             this.patchDataForEmployee(repsonsedata.Data)
           }
          
         }
         else {
           this.loading = false;
           // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
       }, err => {
         this.loading = false;
         // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       })
   }
 
 
   /*
   @Type: File, <ts>
   @Name: patchDataForCandidate
   @Who: Anup Singh
   @When: 15-Feb-2022
   @Why: EWM-4672 EWM-5192
   @What:For patch Data For Candidate
   */
   patchDataForCandidate(data) {
     if(data!==undefined && data!==null && data!==''){
       this.ccEmailsContactCandidate = [];
       this.bccEmailsContactCandidate = [];
   
       let ccListCandidate = data.CCEmail.split(',');
       for (let itr2 = 0; itr2 < ccListCandidate.length; itr2++) {
         if (ccListCandidate[itr2].length != 0 && ccListCandidate[itr2] != '') {
           this.ccEmailsContactCandidate.push({ value: ccListCandidate[itr2], invalid: false });
         }
       }
   
       let bccListCandidate = data.BCCEmail.split(',');
       for (let itr2 = 0; itr2 < bccListCandidate.length; itr2++) {
         if (bccListCandidate[itr2].length != 0 && bccListCandidate[itr2] != '') {
           this.bccEmailsContactCandidate.push({ value: bccListCandidate[itr2], invalid: false });
         }
       }
   
       let ccEMailValCandidate = '';
       for (let i = 0; i < this.ccEmailsContactCandidate.length; i++) {
         if (ccEMailValCandidate.length === 0 || ccEMailValCandidate === '') {
           ccEMailValCandidate = this.ccEmailsContactCandidate[i].value;
         }
         else {
           ccEMailValCandidate += ',' + this.ccEmailsContactCandidate[i].value;
         }
       }
   
       let bccEMailValCandidate = '';
       for (let i = 0; i < this.bccEmailsContactCandidate.length; i++) {
         if (bccEMailValCandidate.length === 0 || bccEMailValCandidate === '') {
           bccEMailValCandidate = this.bccEmailsContactCandidate[i].value;
         }
         else {
           bccEMailValCandidate += ',' + this.bccEmailsContactCandidate[i].value;
         }
       }
   
       this.emailTempalateCandidateForm.patchValue({
         'ccMailsCandidate': ccEMailValCandidate,
         'bccMailsCandidate': bccEMailValCandidate,
          
         'Id':data?.Id,
         'CandidateModule': data?.ModuleType,
         'CandidateTemplateName': data?.TemplateName,
         'CandidateSubject': data?.TemplateSubject,
         'CandidateEmailTemplate': data?.Template,
         'Status': data?.Status,
       });
   this.getEditorVal= data?.Template;
       this.candEmailTemp = data?.Template;
 
       this.emailTempalateCandidateForm.controls['CandidateModule'].disable();
     }
 
   }
 
 
   /*
   @Type: File, <ts>
   @Name: patchDataForEmployee
   @Who: Anup Singh
   @When: 15-Feb-2022
   @Why: EWM-4672 EWM-5192
   @What:For patch Data For Employee
   */
   patchDataForEmployee(data){
     if(data!==undefined && data!==null && data!==''){
       this.ccEmailsContactEmployee = [];
       this.bccEmailsContactEmployee = [];
   
       if (data.CCEmail== undefined && data.CCEmail == null) {
         data.CCEmail='';
       }else{
         let ccListEmployee = data.CCEmail?.split(',');
         for (let itr2 = 0; itr2 < ccListEmployee.length; itr2++) {
           if (ccListEmployee[itr2].length != 0 && ccListEmployee[itr2] != '') {
             this.ccEmailsContactEmployee.push({ value: ccListEmployee[itr2], invalid: false });
           }
         }
       }
          
       if (data.BCCEmail== undefined && data.BCCEmail == null) {
         data.BCCEmail='';
       }else{
         let bccListEmployee = data.BCCEmail?.split(',');
         for (let itr2 = 0; itr2 < bccListEmployee.length; itr2++) {
           if (bccListEmployee[itr2].length != 0 && bccListEmployee[itr2] != '') {
             this.bccEmailsContactEmployee.push({ value: bccListEmployee[itr2], invalid: false });
           }
         }
       }
   
       let ccEMailValEmployee = '';
       for (let i = 0; i < this.ccEmailsContactEmployee.length; i++) {
         if (ccEMailValEmployee.length === 0 || ccEMailValEmployee === '') {
           ccEMailValEmployee = this.ccEmailsContactEmployee[i].value;
         }
         else {
           ccEMailValEmployee += ',' + this.ccEmailsContactEmployee[i].value;
         }
       }
   
       let bccEMailValEmployee = '';
       for (let i = 0; i < this.bccEmailsContactEmployee.length; i++) {
         if (bccEMailValEmployee.length === 0 || bccEMailValEmployee === '') {
           bccEMailValEmployee = this.bccEmailsContactEmployee[i].value;
         }
         else {
           bccEMailValEmployee += ',' + this.bccEmailsContactEmployee[i].value;
         }
       }
   
       this.emailTempalateEmployeeForm.patchValue({
         'ccMailsEmployee': ccEMailValEmployee,
         'bccMailsEmployee': bccEMailValEmployee,
          
         'Id':data?.Id,
         'EmployeeModule': data?.ModuleType,
         'EmployeeTemplateName': data?.TemplateName,
         'EmployeeSubject': data?.TemplateSubject,
         'EmployeeEmailTemplate': data?.Template,
         'Status': data?.Status,
       });
       this.getEditorValEmployee= data?.Template;
       this.emplEmailTemp = data?.Template;
       this.emailTempalateEmployeeForm.controls['EmployeeModule'].disable();
     }
    
   }
 
 
 
   /*
   @Type: File, <ts>
   @Name: OnSave
   @Who: Anup Singh
   @When: 15-Feb-2022
   @Why: EWM-4672 EWM-5192
   @What:For email template save
   */
   OnSave(value, dataSaveFor) {
      let updateEmailTemp = {};
      if(dataSaveFor=='Candidate'){
       updateEmailTemp['Id'] = value.Id;
       updateEmailTemp['ModuleType'] = value.CandidateModule;
       updateEmailTemp['TemplateName'] = value.CandidateTemplateName;
       updateEmailTemp['TemplateSubject'] = value.CandidateSubject;
       updateEmailTemp['CCEmail'] = value.ccMailsCandidate;
       updateEmailTemp['BCCEmail'] = value.bccMailsCandidate;
       updateEmailTemp['Template'] = value.CandidateEmailTemplate;
       updateEmailTemp['Status'] = value.Status;
      }
      else if(dataSaveFor=='Employee'){
       updateEmailTemp['Id'] = value.Id;
       updateEmailTemp['ModuleType'] = value.EmployeeModule;
       updateEmailTemp['TemplateName'] = value.EmployeeTemplateName;
       updateEmailTemp['TemplateSubject'] = value.EmployeeSubject;
       updateEmailTemp['CCEmail'] = value.ccMailsEmployee;
       updateEmailTemp['BCCEmail'] = value.bccMailsEmployee;
       updateEmailTemp['Template'] = value.EmployeeEmailTemplate;
       updateEmailTemp['Status'] = value.Status;
      }
    
     this.loading = true;
 
     this.systemSettingService.updateEmailTempByModule(updateEmailTemp).subscribe(
       (repsonsedata: any) => {
         if (repsonsedata.HttpStatusCode === 200) {
           this.loading = false;
           this.consentReqEmailTemp.emit(true);
           this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         } else if (repsonsedata.HttpStatusCode === 400) {
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
           this.loading = false;
         }
         else {
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
           this.loading = false;
         }
       },
       err => {
         this.loading = false;
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
openImageUpload(val:number): void {
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
           if (val === 1) {
            this.editorCandidate.exec('insertImage', res);
           }
           else{
            this.editorEmployee.exec('insertImage', res);
           }
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
          if (val === 1) {
            this.editorCandidate.exec('insertImage', res);
           }
           else{
            this.editorEmployee.exec('insertImage', res);
           }
           this.loading = false;
         })
       }
     }
   })
}

ngOnDestroy(){
  this.subscription$?.unsubscribe();
}

getEditorFormInfo(event){  
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  // this.ownerList=event?.ownerList;
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDesc=false;
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue(event?.val);
  } else if(sources != undefined && event?.val==''){
    this.showErrorDesc=false;
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==null ){
    this.showErrorDesc=true;
    this.editConfig();
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValidators([Validators.required]);
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').updateValueAndValidity();
    this.emailTempalateCandidateForm.get("CandidateEmailTemplate").markAsTouched();
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDesc=false;
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDesc=true;
    this.editConfig();
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue('');
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValidators([Validators.required]);
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').updateValueAndValidity();
    this.emailTempalateCandidateForm.get("CandidateEmailTemplate").markAsTouched();
  }
}
getEditorImageFormInfo(event){ 
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.showErrorDesc=false;
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue(event?.val);
  }else if(sources == undefined && event?.val==null ){
    this.showErrorDesc=true;
    this.editConfig();
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue('');
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValidators([Validators.required]);
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').updateValueAndValidity();
    this.emailTempalateCandidateForm.get("CandidateEmailTemplate").markAsTouched();
  }
  else if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDesc=false;
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue(event?.val);
  }  else if(sources != undefined && event?.val==''){
    this.showErrorDesc=false;
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue(event?.val);
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDesc=false;
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val?.length==0){
    this.showErrorDesc=true;
    this.editConfig();
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').updateValueAndValidity();
    this.emailTempalateCandidateForm.get("CandidateEmailTemplate").markAsTouched();
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').setValue('');   
  }

}
editConfig(){
  this.editorConfig={
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_pageTemplate',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
  this.showErrorDesc=true;
  this.getRequiredValidationMassage.next(this.editorConfig);
    this.emailTempalateCandidateForm.get('CandidateEmailTemplate').updateValueAndValidity();
    this.emailTempalateCandidateForm.get("CandidateEmailTemplate").markAsTouched();
} 


getEditorFormInforEmployee(event){  
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue(event?.val);
  } else if(sources != undefined && event?.val==''){
    this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==null ){
    this.showErrorDescEmployee=true;
    this.editConfigForEmployee();
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValidators([Validators.required]);
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').updateValueAndValidity();
    this.emailTempalateEmployeeForm.get("EmployeeEmailTemplate").markAsTouched();
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val==''){
    this.showErrorDescEmployee=true;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue('');
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValidators([Validators.required]);
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').updateValueAndValidity();
    this.emailTempalateEmployeeForm.get("EmployeeEmailTemplate").markAsTouched();
  }
}
getEditorImageFormInforEmployee(event){ 
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  if(event?.val!='' && sources!=undefined){
    this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue(event?.val);
  }else if(sources == undefined && event?.val==null ){
    this.showErrorDescEmployee=true;
    this.editConfigForEmployee();
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue('');
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValidators([Validators.required]);
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').updateValueAndValidity();
    this.emailTempalateEmployeeForm.get("EmployeeEmailTemplate").markAsTouched();
  }
  else if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig,"")?.length!==0){
    this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue(event?.val);
  }  else if(sources != undefined && event?.val==''){
    this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue(event?.val);
  } else if(sources == undefined && event?.val?.length!=0){
    this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue(event?.val);
  }
  else if(sources == undefined && event?.val?.length==0){
    this.showErrorDescEmployee=true;
    this.editConfigForEmployee();
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').updateValueAndValidity();
    this.emailTempalateEmployeeForm.get("EmployeeEmailTemplate").markAsTouched();
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').setValue('');   
  }

}
editConfigForEmployee(){
  this.editorConfig={   
    REQUIRED:true,
    DESC_VALUE:null,
    PLACEHOLDER:'label_pageTemplate',
    Tag:this.tagListEmployee,
    EditorTools:[],
    MentionStatus:false, 
    maxLength:0,
    MaxlengthErrormessage:false,   
    JobActionComment:false
  }
  this.showErrorDescEmployee=false;
    this.emailTempalateEmployeeForm.get('EmployeeEmailTemplate').updateValueAndValidity();
    this.emailTempalateEmployeeForm.get("EmployeeEmailTemplate").markAsTouched();
} 
 }