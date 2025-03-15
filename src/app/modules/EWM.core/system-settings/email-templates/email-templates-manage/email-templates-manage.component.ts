import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../../shared/services/commonservice/commonservice.service';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, of, Subscription } from "rxjs";
import { BehaviorSubject } from 'rxjs'
import { EditorComponent } from '@progress/kendo-angular-editor';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContactReceipentPopupComponent } from '../../../shared/contact-receipent-popup/contact-receipent-popup.component';
import { FileQueueObject, FileUploaderService } from '../../../../../shared/services/file-uploader.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { DocumentEmailTemplateComponent } from './document-email-template/document-email-template.component';
import { fadeInRightBigAnimation } from 'angular-animations';
import { CustomAttachmentPopupComponent } from 'src/app/shared/modal/custom-attachment-popup/custom-attachment-popup.component';
import { HttpClient } from '@angular/common/http';
import { EmailPreviewPopupComponent } from '../email-preview-popup/email-preview-popup.component';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';


@Component({
  selector: 'app-email-templates-manage',
  templateUrl: './email-templates-manage.component.html',
  styleUrls: ['./email-templates-manage.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class EmailTemplatesManageComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON, SPACE];
  moduleArray: any = [];
  moduleArrayFilter = [];
  activestatus: string = 'Add';
  public emailTemplateArray = {};
  public uploadFileCount: number = 0;
  public uploadResponse: any = [];
  public createdByText: string = '';
  public IsEdit: boolean = false;
  public createdOn: Date;
  public upAttachments: any[] = [];
  public upAttachmentsRemoved: any[] = [];
  public prevUploadedFileCount: number = 0;
  public prevUploadedFileSize: number = 0;
  public IsSignature = 0;
  public IsattchResume = 0;
  dirctionalLang;

  @ViewChild('editor') editor: EditorComponent;

  @Output() onCompleteItem = new EventEmitter();

  @ViewChild('fileInput') fileInput;
  queue: Observable<FileQueueObject[]>;

  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();

  public pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: true
  };

  addEmailTemplateForm: FormGroup;
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  loading: boolean;
  loadingscroll: boolean;
  public fromEmailList = [];
  public ccEmailList = [];
  public bccEmailList = [];
  public plcData = [];
  public routeURLList = [];
  public userpreferences: Userpreferences;

  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;

  public oldPatchValues: any;
  public oldPatchValueForUpdate: any;
  public clientId: any;
  public accessEmailId: any = [];


  public fileAttachments: any[] = [];
  public fileAttachmentsOnlyTow: any[] = [];

  public fileType: any;
  public fileSizetoShow: any;
  public fileSize: number;
  public selectedFiles: any;
  public fileBinary: File;
  public myfilename = '';
  public filePath: any;
  public previewUrl: any;
  documentTypeOptions: any;
  uploadedFileName: any;
  statusList:any=[];
  public getInternalcodebyID: any;
  userTypeList: { StatusId: number; StatusName: string; };
  files = [];
  AccessName: any;
  AccessId: any;
  getPlaceholderTypeAll: any;
  placeholderType: any;

//  kendo image uploader Adarsh singh 01-Aug-2023
subscription$: Subscription;
// End
public editorConfig: EDITOR_CONFIG;
public showErrorDesc: boolean = false;
public getEditorVal: string;
public gridListView: any = [];
ownerList: string[]=[];
  constructor(private fb: FormBuilder, private http: HttpClient, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
      public _sidebarService: SidebarService, private route: Router, private router: ActivatedRoute,
    private commonserviceService: CommonserviceService,   public _encryptionDecryptionService: EncryptionDecryptionService,
    private appSettingsService: AppSettingsService, private translateService: TranslateService, public dialog: MatDialog,
    public _userpreferencesService: UserpreferencesService,
    private _dialog: MatDialog, public uploader: FileUploaderService,private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
    // this.queue = this.uploader.queue;

     /*** @When: 13-04-2023 @Who:Nitin Bhati @Why: EWM-11903 EWM-10765 @What:make defualt access public **/
     this.AccessId=this.appSettingsService.getDefaultAccessId;
     this.AccessName=this.appSettingsService.getDefaultaccessName;

    this.systemSettingService.getModulesListByTenant().subscribe(
      repsonsedata => {
        this.moduleArray = repsonsedata['Data'];
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });


    this.addEmailTemplateForm = this.fb.group({
      ID: [0],
      RelatedTo: [null, [Validators.required]],
      ddlModules: [[], [Validators.required]],
      ddlModulesName: [null, [Validators.required]],
      Title: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      fromMails: ['', [Validators.required]],
      ccMails: [''],
      bccMails: [''],
      Subject: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(2)]],
      AccessName: [this.AccessName, [Validators.required]],
      AccessId: [this.AccessId],
      TemplateText: ['', [Validators.required, Validators.minLength(2)]],
      ddlStatus: [null],
      Status: [[], [Validators.required]],
      defSignature: [0],
      attchResume:[false],
      IsShared: [false]
    });


    this.fileType = appSettingsService.file_file_type_extralarge;
    this.fileSizetoShow = appSettingsService.file_file_size_extraExtraLarge;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }

    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
    });
  }


  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this.routeURLList = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.getAllStatus();
    this.getuserTypeList();
    this.router.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.activestatus = 'Edit';
          let tempID = parseInt(params['id']);
          this.addEmailTemplateForm.patchValue({
            ID: tempID
          });

          this.IsEdit = true;

          this.loading = true;
          this.systemSettingService.getEmailTemplateByID('?id=' + tempID).subscribe(
            (repsonsedata: any) => {
              this.loading = false;
              if (repsonsedata['HttpStatusCode'] == 200) {
                if (repsonsedata['Data'].DefaultSignature == 1) {
                  this.IsSignature = 1;
                } else {
                  this.IsSignature = 0;
                }
                if (repsonsedata['Data'].IsResumeAttach == 1) {
                  this.IsattchResume = 1;
                } else {
                  this.IsattchResume = 0;
                }
                let feList = repsonsedata['Data']?.FromEmail?.split(',');
                for (let itr1 = 0; itr1 < feList?.length; itr1++) {
                  if (feList[itr1]?.length != 0 && feList[itr1] != '') {
                    this.fromEmailList.push({ value: feList[itr1], invalid: false });
                  }
                }

                let cceList = repsonsedata['Data']?.CcEmail?.split(',');
                for (let itr2 = 0; itr2 < cceList?.length; itr2++) {
                  if (cceList[itr2]?.length != 0 && cceList[itr2] != '') {
                    this.ccEmailList.push({ value: cceList[itr2], invalid: false });
                  }
                }

                let bcceList = repsonsedata['Data']?.BccEmail?.split(',');
                for (let itr3 = 0; itr3 < bcceList?.length; itr3++) {
                  if (bcceList[itr3]?.length != 0 && bcceList[itr3] != '') {
                    this.bccEmailList.push({ value: bcceList[itr3], invalid: false });
                  }
                }
                this.getInternalcodebyID=repsonsedata.Data?.InternalCode;
                this.addEmailTemplateForm.patchValue({
                  'ID': repsonsedata['Data'].Id,
                  'ddlModules': repsonsedata['Data'].ModuleID,
                  'ddlModulesName': repsonsedata['Data'].ModuleName,
                  'Title': repsonsedata['Data'].Title,
                  'Subject': repsonsedata['Data'].Subject,
                  'TemplateText': repsonsedata['Data'].TemplateText,
                  'ddlStatus': repsonsedata['Data'].StatusID,
                  'Status': repsonsedata['Data'].Status,
                  'defSignature': parseInt(repsonsedata['Data'].DefaultSignature) == 1 ? true : false,
                  'RelatedTo': repsonsedata['Data'].RelatedTo,
                  'AccessId': repsonsedata['Data'].AccessId,
                  'AccessName': repsonsedata['Data'].AccessName,
                  'IsShared': (repsonsedata['Data']?.IsShared) == 1 ? true : false,
                  'attchResume': (repsonsedata['Data']?.IsResumeAttach) == 1 ? true : false,
                });
                this.getEditorVal=repsonsedata['Data']?.TemplateText; //who:maneesh,what:ewm-16207 ewm-16358,when:14/03/2024
                this.oldPatchValues = repsonsedata.Data;
                this.oldPatchValueForUpdate = repsonsedata.Data;
    /*  @Who: bantee @When: 23-sept-2023 @Why: EWM-14400 (email template edit case)*/

                if(!repsonsedata.Data?.FromEmail){
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                let loggedInUserEmail=currentUser.EmailId
                this.oldPatchValueForUpdate['FromEmail']=loggedInUserEmail;
                this.oldPatchValueForUpdate = repsonsedata.Data;
                }
                this.accessEmailId = this.oldPatchValues?.GrantAccesList;
                this.subCategoryCheckedForSubmit = repsonsedata['Data'].UserEmailDocumentList;
                this.typeId = repsonsedata['Data'].UserDocumentTypeId;
                this.typeName = repsonsedata['Data'].UserDocumentTypeName;
                this.CodeInternal = repsonsedata['Data'].InternalCode;


                this.fileAttachments = repsonsedata['Data']?.Files;
                if (this.fileAttachments?.length > 2) {
                  this.fileAttachmentsOnlyTow = this.fileAttachments?.slice(0, 2)
                } else {
                  this.fileAttachmentsOnlyTow = this.fileAttachments
                }

                this.activestatus = 'Edit';

                let fromEMailVal = '';
                let ccEMailVal = '';
                let bccEMailVal = '';

                for (let i = 0; i < this.fromEmailList?.length; i++) {
                  if (fromEMailVal?.length === 0 || fromEMailVal === '') {
                    fromEMailVal = this.fromEmailList[i].value;
                  }
                  else {
                    fromEMailVal += ',' + this.fromEmailList[i].value;
                  }
                }

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

                this.addEmailTemplateForm.patchValue({
                  'fromMails': fromEMailVal
                });
                this.addEmailTemplateForm.patchValue({
                  'ccMails': ccEMailVal
                });
                this.addEmailTemplateForm.patchValue({
                  'bccMails': bccEMailVal
                });

                this.createdByText = repsonsedata['Data']?.CreatedBy;
                this.createdOn = repsonsedata['Data']?.CreatedOn;
                this.getPlaceHolderTypeAll();/*** @When: 04-08-2023 @Who:Renu  @Why: EWM-10528 EWM-13695 @What:Placeholder option is missing **/

              }
              else {
                this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
                this.loading = false;
              }
            },
            err => {
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
              this.loading = false;
            });
        }
      }
    );


    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    //  @Who: maneesh, @When: 13-03-2024,@Why: EWM-16342-EWM-16207 @What: on changes on kendo editor catch the event here
    this.editorConfig={
       REQUIRED:true,
       DESC_VALUE:null,
       PLACEHOLDER:'label_templateBody',
       Tag:[],
       EditorTools:[],
       MentionStatus:false,
       maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false

    };
  }

/*** @When: 05-08-2023 @Who:Renu  @Why: EWM-10528 EWM-13695 @What:Placeholder option is missing **/
  getPlaceHolderTypeAll(){
  this.systemSettingService.getPlaceholderTypeAll().subscribe(
          (respdata:ResponceData) => {
            if(respdata.HttpStatusCode==200){
              this.getPlaceholderTypeAll=respdata.Data; /*** @When: 04-08-2023 @Who:Renu  @Why: EWM-10528 EWM-13695 @What:Placeholder option is missing **/
              this.getData();
            } else{
              this.getPlaceholderTypeAll=[];
            }

          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

  onchangeModule(module) {
    this.addEmailTemplateForm.patchValue({
      ddlModulesName: module.ModuleName,
      ddlModules: module.ModuleId,
    });
  }

  /*
@Type: File, <ts>
@Name: animate delaAnimation function
@Who: Anup Singh
@When: 13-April-2022
@Why: EWM-5580 EWM-6099
@What: creating animation
*/

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }


  getUserContactInfo(currEmailType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'myDialogCroppingImage';
    dialogConfig.data = null;// change by priti at 28 may 2021
    // dialogConfig.maxWidth = "750px";
    dialogConfig.panelClass = ['xeople-modal', 'contact_receipent', 'animate__animated', 'animate__zoomIn'];
    const modalDialog = this._dialog.open(ContactReceipentPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      for (let i = 0; i < res['data']?.length; i++) {
        let IsDuplicate = false;
        if (currEmailType === 'From') {
          // && i < res['data'].length
          for (let j = 0; j < this.fromEmailList?.length; j++) {
            if (this.fromEmailList[j].value === res['data'][i]['emailId']) {
              IsDuplicate = true;
            }
          }
          if (IsDuplicate === false) {
            if (this.validateEmail(res['data'][i]['emailId'])) {
              this.fromEmailList.push({ value: res['data'][i]['emailId'], invalid: false });
              this.setFromEmailsValues();
            } else {
              this.fromEmailList.push({ value: res['data'][i]['emailId'], invalid: true });
              this.setFromEmailsValues();
              this.addEmailTemplateForm.get("fromMails").clearValidators();
              this.addEmailTemplateForm.controls["fromMails"].setErrors({ 'incorrectEmail': true });
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
              this.addEmailTemplateForm.get("ccMails").clearValidators();
              this.addEmailTemplateForm.controls["ccMails"].setErrors({ 'incorrectEmail': true });
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
              this.addEmailTemplateForm.get("bccMails").clearValidators();
              this.addEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
            }
          }
        }
      }

    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    return false;

  }
  setAttachResume(attchResume) {
    if (attchResume.checked) {
      this.IsattchResume = 1;
      this.addEmailTemplateForm.patchValue({
        'attchResume': 1
      });
    }
    else {
      this.IsattchResume = 0;
      this.addEmailTemplateForm.patchValue({
        'attchResume': 0
      });
    }
  }
  setDefaultSignature(defSignature) {
    if (defSignature.checked) {
      this.IsSignature = 1;
      this.addEmailTemplateForm.patchValue({
        'defSignature': 1
      });
    }
    else {
      this.IsSignature = 0;
      this.addEmailTemplateForm.patchValue({
        'defSignature': 0
      });
    }
  }


  getAllStatus() {
    this.loading = true;
    this.systemSettingService.getAllUserTypeStatus().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.statusList = repsonsedata['Data'];
               // who:maneesh,what:ewm-11605 for by default  patch value active when:20/04/2023
                 this.addEmailTemplateForm.patchValue({
                    'Status': this.statusList[0]?.StatusName,
                    'ddlStatus': this.statusList[0]?.Id
                   });
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  onChangeStatus(status){
   this.addEmailTemplateForm.patchValue({
      'ddlStatus': status.Id,
      'Status' : status.StatusName,
    });
  }

  public onTitleChanges() {
    let tempName = this.addEmailTemplateForm.get("Title").value;
    let tempID = this.addEmailTemplateForm.get("ID").value;
    let modID = this.addEmailTemplateForm.get("ddlModules").value;

    if (tempName === '') {
      this.addEmailTemplateForm.get("Title").setErrors({ required: true });
      this.addEmailTemplateForm.get("Title").markAsDirty();
      return;
    }

    if (isNaN(parseInt(modID))) {
      return;
    }

    if (tempID == null || tempID == undefined || tempID == 0) {
      tempID = 0;
    }
    let DuplicateObj = {};
    DuplicateObj['ModuleId'] = modID;
    DuplicateObj['Value'] = this.addEmailTemplateForm.get("Title").value.trim();
    DuplicateObj['Id'] = parseInt(tempID)

    this.systemSettingService.checkEmailTemplateDuplicacy(DuplicateObj).subscribe(
      repsonsedata => {
        /* this.loading=false; */
     // @bantee @User is unable to save the template after entering more than 255 chars  @whn 18-09-2023

        if (repsonsedata['HttpStatusCode'] == 402) {
          if (repsonsedata['Data'] == false) {
            this.addEmailTemplateForm.get("Title").setErrors({ codeTaken: true });
            this.addEmailTemplateForm.get("Title").markAsDirty();
          }
          
        }
        else if (repsonsedata['HttpStatusCode'] == 204) {
          if (repsonsedata['Data'] == true) {
            this.addEmailTemplateForm.get("Title").clearValidators();
            this.addEmailTemplateForm.get("Title").markAsPristine();
            this.addEmailTemplateForm.get('Title').setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(2)]);
            this.addEmailTemplateForm.get("Title").updateValueAndValidity();
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
        this.loading = false;
      },
      err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }

  onSave(actionStatus) {
    this.loading = true;
     // @suika @remove files element with not Path key @whn 21-03-2023
     //this.files = [];
     this.fileAttachments.forEach(element => {
       if(element.hasOwnProperty('Path')){
         this.files.push(element);
       }
     });
    if (this.addEmailTemplateForm.invalid) {
      this.loading = false;
      return;
    }

    let tempID = this.addEmailTemplateForm.get("ID").value;
    let modID = this.addEmailTemplateForm.get("ddlModules").value;

    if (tempID == null || tempID == undefined || tempID == 0) {
      tempID = 0;
    }

    let DuplicateObj = {};
    DuplicateObj['ModuleId'] = modID;
    DuplicateObj['Value'] = this.addEmailTemplateForm.get("Title").value?.trim();
    DuplicateObj['Id'] = parseInt(tempID)

    this.systemSettingService.checkEmailTemplateDuplicacy(DuplicateObj).subscribe(
      repsonsedata => {

        /* this.loading=false; */
        if (repsonsedata['HttpStatusCode'] == 402) {
          if (repsonsedata['Data'] == false) {
            this.addEmailTemplateForm.get("Title").setErrors({ codeTaken: true });
            this.addEmailTemplateForm.get("Title").markAsDirty();
            this.loading = false;
          }
          else {
            this.addEmailTemplateForm.get("Title").clearValidators();
            this.addEmailTemplateForm.get("Title").markAsPristine();

            if (this.addEmailTemplateForm.invalid) {
              this.loading = false;
              return;
            }
            if (actionStatus == 'Add') {
              this.addemailTemplate();
            }
            else {
              this.editemailTemplate();
            }
          }

        }
        else if (repsonsedata['HttpStatusCode'] == 204) {
          if (repsonsedata['Data'] == true) {
            this.addEmailTemplateForm.get("Title").clearValidators();
            this.addEmailTemplateForm.get("Title").markAsPristine();
     // @bantee @User is unable to save the template after entering more than 255 chars  @whn 18-09-2023

            this.addEmailTemplateForm.get('Title').setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(2)]);
            this.addEmailTemplateForm.get("Title").updateValueAndValidity();
            if (this.addEmailTemplateForm.invalid) {
              this.loading = false;
              return;
            }
            if (actionStatus == 'Add') {
              this.addemailTemplate();
            }
            else {
              this.editemailTemplate();
            }
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
        this.loading = false;

      },
      err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }

  saveNewEmailTemplate() {
    this.emailTemplateArray['Title'] = this.addEmailTemplateForm.get("Title").value;
    this.emailTemplateArray['Subject'] = this.addEmailTemplateForm.get("Subject").value;
    this.emailTemplateArray['TemplateText'] = this.addEmailTemplateForm.get("TemplateText").value;
    this.emailTemplateArray['ModuleID'] = this.addEmailTemplateForm.get("ddlModules").value;
    this.emailTemplateArray['FromEmail'] = this.addEmailTemplateForm.get("fromMails").value;
    this.emailTemplateArray['CcEmail'] = this.addEmailTemplateForm.get("ccMails").value;
    this.emailTemplateArray['BccEmail'] = this.addEmailTemplateForm.get("bccMails").value;
    this.emailTemplateArray['DefaultSignature'] = this.IsSignature;//this.addEmailTemplateForm.get("defSignature").value === true ? 1 : 0;
    this.emailTemplateArray['StatusID'] = this.addEmailTemplateForm.get("ddlStatus").value;
    this.emailTemplateArray['Status'] = this.addEmailTemplateForm.get("Status").value;

    this.emailTemplateArray['ModuleName'] = this.addEmailTemplateForm.get("ddlModulesName").value;
    this.emailTemplateArray['RelatedTo'] = this.addEmailTemplateForm.get("RelatedTo").value;
    this.emailTemplateArray['AccessId'] = this.addEmailTemplateForm.get("AccessId").value;
    this.emailTemplateArray['AccessName'] = this.addEmailTemplateForm.get("AccessName").value;
    this.emailTemplateArray['GrantAccesList'] = this.accessEmailId;

    this.emailTemplateArray['UserEmailDocumentList'] = this.subCategoryCheckedForSubmit;
    this.emailTemplateArray['UserDocumentTypeId'] = this.typeId;
    this.emailTemplateArray['UserDocumentTypeName'] = this.typeName;
    this.emailTemplateArray['InternalCode'] = this.CodeInternal;
    this.emailTemplateArray['IsAttachment'] = this.fileAttachments.length > 0 ? 1 : 0;
    this.emailTemplateArray['Files'] = this.files;
    this.emailTemplateArray['IsShared'] = (this.addEmailTemplateForm.get("IsShared").value) == true ? 1 : 0;
    this.emailTemplateArray['IsResumeAttach'] = this.IsattchResume;
    if (this.addEmailTemplateForm.invalid) {
      this.loading = false;
      return;
    }
    else {
      this.loading = true;
      this.systemSettingService.EmailTemplateCreate(this.emailTemplateArray).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.Httpstatuscode);
            this.addEmailTemplateForm.reset();
            this.addEmailTemplateForm.reset({ TemplateText: '' });
            this.getEditorVal=''; //who:maneesh,what:ewm-16207 ewm-16358,when:14/03/2024

            //this.uploader.clearQueue();

            let mainRoute = '';
            let rCount = 0;
            for (let entry of this.routeURLList) {
              if (entry != '') {
                if (this.routeURLList.length - 1 != rCount) {
                  mainRoute += '/' + entry;
                }
              }
              rCount += 1;
            }

            this.route.navigate([mainRoute]);
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        })
    }
  }

  addemailTemplate() {
    // if (this.uploader._files.length > 0) {
    //   this.uploadFileCount = 0;
    //   this.uploader.uploadAll();
    // }
    // else {
    this.saveNewEmailTemplate();
    // }
  }

  updateEmailTemplate() {
    this.emailTemplateArray['Id'] = this.addEmailTemplateForm.get("ID").value;
    this.emailTemplateArray['Title'] = this.addEmailTemplateForm.get("Title").value;
    this.emailTemplateArray['Subject'] = this.addEmailTemplateForm.get("Subject").value;
    this.emailTemplateArray['TemplateText'] = this.addEmailTemplateForm.get("TemplateText").value;
    this.emailTemplateArray['ModuleID'] = this.addEmailTemplateForm.get("ddlModules").value;
    this.emailTemplateArray['FromEmail'] = this.addEmailTemplateForm.get("fromMails").value;
    this.emailTemplateArray['CcEmail'] = this.addEmailTemplateForm.get("ccMails").value;
    this.emailTemplateArray['BccEmail'] = this.addEmailTemplateForm.get("bccMails").value;
    this.emailTemplateArray['DefaultSignature'] = this.IsSignature;//this.addEmailTemplateForm.get("defSignature").value === true ? 1 : 0;
    this.emailTemplateArray['StatusID'] =this.addEmailTemplateForm.get("ddlStatus").value;
    this.emailTemplateArray['Status'] = this.addEmailTemplateForm.get("Status").value;

    this.emailTemplateArray['ModuleName'] = this.addEmailTemplateForm.get("ddlModulesName").value;
    this.emailTemplateArray['RelatedTo'] = this.addEmailTemplateForm.get("RelatedTo").value;
    this.emailTemplateArray['AccessId'] = this.addEmailTemplateForm.get("AccessId").value;
    this.emailTemplateArray['AccessName'] = this.addEmailTemplateForm.get("AccessName").value;
    this.emailTemplateArray['GrantAccesList'] = this.accessEmailId;
    this.emailTemplateArray['UserEmailDocumentList'] = this.subCategoryCheckedForSubmit;
    this.emailTemplateArray['UserDocumentTypeId'] = this.typeId;
    this.emailTemplateArray['UserDocumentTypeName'] = this.typeName;
    this.emailTemplateArray['InternalCode'] = this.getInternalcodebyID;
    this.emailTemplateArray['IsAttachment'] = this.fileAttachments.length > 0 ? 1 : 0;
    this.emailTemplateArray['Files'] = this.files;
    this.emailTemplateArray['IsShared'] = (this.addEmailTemplateForm.get("IsShared").value) == true ? 1 : 0;
    this.emailTemplateArray['CreatedBy'] = this.createdByText;
    this.emailTemplateArray['IsResumeAttach'] = this.IsattchResume;
    if (this.addEmailTemplateForm.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.oldPatchValueForUpdate;
      let fileData = [];
      this.oldPatchValueForUpdate.Files.forEach(element => {
        if(element.hasOwnProperty('Path')){
          fileData.push(element);
        }
      });
      this.oldPatchValueForUpdate['Files'] = fileData;
       let updateObj = {
        "From": this.oldPatchValueForUpdate,
        "To": this.emailTemplateArray
      }
      this.systemSettingService.updateEmailTemplates(updateObj).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.Httpstatuscode);

            this.uploader.clearQueue();

            let mainRoute = '';
            let rCount = 0;
            for (let entry of this.routeURLList) {
              if (entry != '') {
                if (this.routeURLList.length - 1 != rCount) {
                  mainRoute += '/' + entry;
                }
              }
              rCount += 1;
            }

            this.route.navigate([mainRoute]);
          } else if (repsonsedata.HttpStatusCode == 400) {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.Httpstatuscode);
            this.loading = false;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        },
        err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        })
    }
  }

  editemailTemplate() {
    // if (this.uploader._files.length > 0) {
    //   this.uploadFileCount = 0;
    //   this.uploader.uploadAll();
    //   // this.loading = false;
    // }
    // else {
    this.updateEmailTemplate();
    // }
  }


  removeFromEmail(data: any): void {
    if (this.fromEmailList.indexOf(data) >= 0) {
      this.fromEmailList.splice(this.fromEmailList.indexOf(data), 1);
    }

    let eMailVal = '';
    let invalidEmail = false;

    for (let i = 0; i < this.fromEmailList.length; i++) {
      if (this.fromEmailList[i].invalid === true) {
        invalidEmail = true;
      }

      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.fromEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.fromEmailList[i].value;
      }
    }

    this.addEmailTemplateForm.patchValue({
      'fromMails': eMailVal
    });

    if (eMailVal.length === 0 || eMailVal === '') {
      this.addEmailTemplateForm.get("fromMails").clearValidators();
      this.addEmailTemplateForm.get("fromMails").setErrors({ required: true });
      this.addEmailTemplateForm.get("fromMails").markAsDirty();
    }
    else {
      if (invalidEmail) {
        this.addEmailTemplateForm.get("fromMails").clearValidators();
        this.addEmailTemplateForm.controls["fromMails"].setErrors({ 'incorrectEmail': true });
      }
    }
  }

  setFromEmailsValues() {
    let eMailVal = '';
    let IsValid = true;
    for (let i = 0; i < this.fromEmailList.length; i++) {
      if (this.validateEmail(this.fromEmailList[i].value) === false) {
        IsValid = false;
      }

      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.fromEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.fromEmailList[i].value;
      }

    }
    this.addEmailTemplateForm.patchValue({
      'fromMails': eMailVal
    });

    if (IsValid === false) {
      this.addEmailTemplateForm.get("fromMails").clearValidators();
      this.addEmailTemplateForm.controls["fromMails"].setErrors({ 'incorrectEmail': true });
    }
  }

  addFrom(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;

    if (event.value) {
      for (let i = 0; i < this.fromEmailList.length; i++) {
        if (this.fromEmailList[i].value === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value)) {
          this.fromEmailList.push({ value: event.value, invalid: false });
          this.setFromEmailsValues();
        } else {
          this.fromEmailList.push({ value: event.value, invalid: true });
          this.setFromEmailsValues();
          this.addEmailTemplateForm.get("fromMails").clearValidators();
          this.addEmailTemplateForm.controls["fromMails"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.addEmailTemplateForm.get("fromMails").value === null || this.addEmailTemplateForm.get("fromMails").value === '') {
      this.addEmailTemplateForm.get("fromMails").clearValidators();
      this.addEmailTemplateForm.get("fromMails").setErrors({ required: true });
      this.addEmailTemplateForm.get("fromMails").markAsDirty();
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  removeccEmail(data: any): void {
    if (this.ccEmailList.indexOf(data) >= 0) {
      this.ccEmailList.splice(this.ccEmailList.indexOf(data), 1);
    }

    let eMailVal = '';
    let invalidEmail = false;

    for (let i = 0; i < this.ccEmailList.length; i++) {
      if (this.ccEmailList[i].invalid === true) {
        invalidEmail = true;
      }

      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.ccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.ccEmailList[i].value;
      }
    }

    this.addEmailTemplateForm.patchValue({
      'ccMails': eMailVal
    });

    if (eMailVal.length === 0 || eMailVal === '') {
      /* this.addEmailTemplateForm.get("ccMails").clearValidators();
      this.addEmailTemplateForm.get("ccMails").setErrors({ required: true });
      this.addEmailTemplateForm.get("ccMails").markAsDirty(); */
    }
    else {
      if (invalidEmail) {
        this.addEmailTemplateForm.get("ccMails").clearValidators();
        this.addEmailTemplateForm.controls["ccMails"].setErrors({ 'incorrectEmail': true });
      }
    }
  }

  setCCEmailsValues() {
    let eMailVal = '';
    let IsValid = true;

    for (let i = 0; i < this.ccEmailList.length; i++) {
      if (this.validateEmail(this.ccEmailList[i].value) === false) {
        IsValid = false;
      }

      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.ccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.ccEmailList[i].value;
      }
    }

    this.addEmailTemplateForm.patchValue({
      'ccMails': eMailVal
    });

    if (IsValid === false) {
      this.addEmailTemplateForm.get("ccMails").clearValidators();
      this.addEmailTemplateForm.controls["ccMails"].setErrors({ 'incorrectEmail': true });
    }
  }

  addCC(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;

    if (event.value) {
      for (let i = 0; i < this.ccEmailList.length; i++) {
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
          this.addEmailTemplateForm.get("ccMails").clearValidators();
          this.addEmailTemplateForm.controls["ccMails"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.addEmailTemplateForm.get("ccMails").value === null || this.addEmailTemplateForm.get("ccMails").value === '') {
      /* this.addEmailTemplateForm.get("ccMails").clearValidators();
      this.addEmailTemplateForm.get("ccMails").setErrors({ required: true });
      this.addEmailTemplateForm.get("ccMails").markAsDirty(); */
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

    for (let i = 0; i < this.bccEmailList.length; i++) {
      if (this.bccEmailList[i].invalid === true) {
        invalidEmail = true;
      }

      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.bccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.bccEmailList[i].value;
      }
    }

    this.addEmailTemplateForm.patchValue({
      'bccMails': eMailVal
    });

    if (eMailVal.length === 0 || eMailVal === '') {
      /* this.addEmailTemplateForm.get("bccMails").clearValidators();
      this.addEmailTemplateForm.get("bccMails").setErrors({ required: true });
      this.addEmailTemplateForm.get("bccMails").markAsDirty(); */
    }
    else {
      if (invalidEmail) {
        this.addEmailTemplateForm.get("bccMails").clearValidators();
        this.addEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
      }
    }
  }

  setBccEmailsValues() {
    let eMailVal = '';
    let IsValid = true;

    for (let i = 0; i < this.bccEmailList.length; i++) {
      if (this.validateEmail(this.bccEmailList[i].value) === false) {
        IsValid = false;
      }

      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.bccEmailList[i].value;
      }
      else {
        eMailVal += ',' + this.bccEmailList[i].value;
      }
    }

    this.addEmailTemplateForm.patchValue({
      'bccMails': eMailVal
    });

    if (IsValid === false) {
      this.addEmailTemplateForm.get("bccMails").clearValidators();
      this.addEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
    }
  }

  addBcc(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;

    if (event.value) {
      for (let i = 0; i < this.bccEmailList.length; i++) {
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
          this.addEmailTemplateForm.get("bccMails").clearValidators();
          this.addEmailTemplateForm.controls["bccMails"].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.addEmailTemplateForm.get("bccMails").value === null || this.addEmailTemplateForm.get("bccMails").value === '') {
      /* this.addEmailTemplateForm.get("bccMails").clearValidators();
      this.addEmailTemplateForm.get("bccMails").setErrors({ required: true });
      this.addEmailTemplateForm.get("bccMails").markAsDirty(); */
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  private validateEmail(email) {
     var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

   /*
   @Type: File, <ts>
   @Name: getuserTypeList function
   @Who: Bantee Kumar
   @When: 30-Dec-2022
   @Why: EWM-9634.EWM-10022
   @What: Function which will get all the saved userType lists
 */
getuserTypeList() {
  this.systemSettingService.getUserTypeList().subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.userTypeList = repsonsedata.Data.filter((data: any) => data.PublicName != "Supplier" && data.PublicName != "Sub Contractor");
       // this.typePlaceholderAll=repsonsedata.Data.map(x=>{x.})
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

  onchangeRelatedTo(){
    if(this.addEmailTemplateForm.get('RelatedTo').value){
     this.getPlaceHolderTypeAll(); /*** @When: 05-08-2023 @Who:Renu  @Why: EWM-10528 EWM-13695 @What:Placeholder option is missing **/
      }
      else{
        this._toolButtons$.next([]);
      }
  }

  getData() {
       switch (this.addEmailTemplateForm.get('RelatedTo').value) {
        case "JOBS":
          this.placeholderType= this.getPlaceholderTypeAll.filter((item) => {
            return item.Type === "Jobs"
          })
          break;

        case "CAND":
          this.placeholderType= this.getPlaceholderTypeAll?.filter((item) => {
            return item.Type === "Candidate"
          });
          break;

          case "EMPL":
            this.placeholderType = this.getPlaceholderTypeAll?.filter((item) => {
              return item.Type === "Employee"
            });
            break;

            case "CLIE":
              this.placeholderType= this.getPlaceholderTypeAll?.filter((item) => {
                return item.Type === "Clients"
              });
              break;

            case "CONT":
                this.placeholderType= this.getPlaceholderTypeAll?.filter((item) => {
                  return item.Type === "Contact"
                });
              break;     

        default:
          break;
      }
          this.systemSettingService.getPlaceholderByType(this.placeholderType[0]?.Type).subscribe(
            respdata => {
              if (respdata['Data']) {
                let existing: any[] = this._toolButtons$.getValue();
                this.plcData = [];
                for (let plc of respdata['Data']) {
                  this.plcData.push({ text: plc['Placeholder'], icon: '', click: () => { this.editor.exec('insertText', { text: plc['PlaceholderTag'] }); } })
                }
                let peopleButton: string = this.placeholderType[0].Type;
                // existing.push({ text: peopleButton, icon: 'rss', data: this.peopledata });
                existing.push({ text: peopleButton, data: this.plcData });

                switch (this.addEmailTemplateForm.get('RelatedTo').value) {
                  case "JOBS":
                    let jobData: any = existing.filter((item) => {
                      return item.text === "Jobs"
                    });
                    this._toolButtons$.next(jobData);
                    break;

                  case "CAND":
                    let candidateData: any = existing.filter((item) => {
                      return item.text === "Candidate"
                    });
                    this._toolButtons$.next(candidateData);
                    break;

                    case "EMPL":
                      let employeeData: any = existing.filter((item) => {
                        return item.text === "Employee"
                      });
                      this._toolButtons$.next(employeeData);
                      break;

                      case "CLIE":
                        let clientData: any = existing.filter((item) => {
                          return item.text === "Clients"
                        });
                        this._toolButtons$.next(clientData);
                        break;
                  case "CONT":
                    let contactData: any = existing.filter((item) => {
                    return item.text === "Contact"
                    });
                    this._toolButtons$.next(contactData);
                    break;      

                  default:
                    let nodefaultData:any[];
                    this._toolButtons$.next(existing);
                    break;
                }



                // let candidateData: any = existing.filter((item) => {
                //   return item.text === "Candidate"
                // });

                // this._toolButtons$.next(candidateData);
              }
            }, err => {
              this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
            });

      // }, err => {
      //   this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      // });

  }


  /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

  reloadApiBasedOnorg() {

    this.getData();
    // this.route.navigate(['/client/core/system-settings/email-template']);
  }



  /*
 @Type: File, <ts>
 @Name: openManageAccessModal
 @Who:Anup
 @When: 14-April-2022
 @Why:EWM-4945 EWM-6165
 @What: to open quick add Manage Access modal dialog
*/
  openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
      data: { candidateId: this.clientId, Id: Id, Name: Name, AccessModeId: this.oldPatchValues, ActivityType: 1 },
      panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isSubmit == true) {
        this.oldPatchValues = {};
        this.accessEmailId = [];
        let mode: number;
        if (this.activestatus == 'Add') {
          mode = 0;
        } else {
          mode = 1;
        }
        res.ToEmailIds.forEach(element => {
          this.accessEmailId.push({
            'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': mode
          });
        });

        this.addEmailTemplateForm.patchValue({
          'AccessName': res.AccessName,
          'AccessId': res.AccessId[0].Id
        });
        this.oldPatchValues = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

      } else {

      }
    });
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }


  /*
 @Type: File, <ts>
 @Name: openDocumentModal
 @Who:Anup
 @When: 14-April-2022
 @Why:EWM-4945 EWM-6165
 @What: to open document modal dialog
*/
  public subCategoryCheckedForSubmit = [];
  public typeId: any = 0;
  public typeName: any = '';
  public CodeInternal: string = "";
  openDocumentModal() {
    const dialogRef = this.dialog.open(DocumentEmailTemplateComponent, {
      data: ({ subCategoryChecked: this.subCategoryCheckedForSubmit, typeId: this.typeId, typeName: this.typeName, CodeInternal: this.CodeInternal }),
      panelClass: ['xeople-modal', 'add_documents', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {

          if (res.resType === true) {
        this.subCategoryCheckedForSubmit = res.subCategoryChecked11;
       this.typeId = res.typeId;
        this.typeName = res.typeName;
        this.CodeInternal = res.CodeInternal;
        }

    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }



  /*
   @Type: File, <ts>
   @Name: openMultipleAttachmentModal function
   @Who: Anup Singh
   @When: 08-Feb-2022
   @Why:EWM-4805 EWM-4861
   @What: For Open Model For Multiple Attachment
 */
  openMultipleAttachmentModal() {
    const dialogRef = this.dialog.open(CustomAttachmentPopupComponent, {
      // maxWidth: "480px",
      data: new Object({
        fileType: this.fileType, fileSize: this.fileSize, fileSizetoShow: this.fileSizetoShow,
        fileAttachments: this.fileAttachments
      }),
      // width: "85%",
      // maxHeight: "85%",
      panelClass: ['xeople-modal', 'customAttachment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.isFile == true) {
        this.fileAttachments = [];
        this.fileAttachments = res.fileAttachments;

        if (this.fileAttachments.length > 2) {
          this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
        } else {
          this.fileAttachmentsOnlyTow = this.fileAttachments
        }
      }
    })
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
   @Who: Anup Singh
   @When: 08-Feb-2022
   @Why:EWM-4805 EWM-4861
   @What: For remove Attachment
 */
  removeAttachment(fileInfo: any) {
    const index: number = this.fileAttachments.indexOf(fileInfo);
    if (index !== -1) {
      this.fileAttachments.splice(index, 1);
    }

    if (this.fileAttachments.length > 2) {
      this.fileAttachmentsOnlyTow = this.fileAttachments.slice(0, 2)
    } else {
      this.fileAttachmentsOnlyTow = this.fileAttachments
    }
  }


  openPriviewPopup() {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: new Object({ subjectName: this.addEmailTemplateForm.get("Subject").value, emailTemplateData: this.addEmailTemplateForm.get("TemplateText").value }),
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
 //who:maneesh,what:ewm-16207 ewm-16358,when:14/03/2024
getEditorFormInfo(event) {
  this.ownerList = event?.ownerList;
  if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
    this.showErrorDesc = false;
    this.addEmailTemplateForm.get('TemplateText').setValue(event?.val);
  } else {
    this.showErrorDesc = true;
    this.addEmailTemplateForm.get('TemplateText').setValue('');
    this.addEmailTemplateForm.get('TemplateText').setValidators([Validators.required]);
    this.addEmailTemplateForm.get('TemplateText').updateValueAndValidity();
    this.addEmailTemplateForm.get("TemplateText").markAsTouched();
  }
}
}
