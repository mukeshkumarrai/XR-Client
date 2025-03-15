/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Priti Srivastava
    @When: 2-june-2021
    @Why: EWM-1640
    @What:  This page wil be use only for the user invite
 */
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { TranslateService } from '@ngx-translate/core';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { ContactReceipentPopupComponent } from '../../../shared/contact-receipent-popup/contact-receipent-popup.component';
import { UserEmails } from '../user-invitation.component';

@Component({
  selector: 'app-user-invite',
  templateUrl: './user-invite.component.html',
  styleUrls: ['./user-invite.component.scss']
})
export class UserInviteComponent implements OnInit {
  loading: boolean;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('utypeSelect') utypeSelect;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  private rtl = false;
  private ltr = true;
  public formtitle: string = 'grid';
  viewMode: string = "listMode";
  public active = false;
  public activeDetails = false;
  selectable = true;
  removable = true;
  addOnBlur = true;
  ListFilterForm: FormGroup;
  UserInviteForm: FormGroup;
  UserInviteDetailsForm: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON, SPACE];
  userEmail: UserEmails[] = [];
  public emailList = [];
  public userRoles: any[];
  public userTypes: any[];
  public accessLevels: any[];
  public userInviteArray = {};
  public searchValue: string = '';
  pagesize;
  pagneNo = 1;
  sortingValue: string = "email,asc";
  roleType = '';
  userListType = '';
  public gridViewClient: any[];
  public gridViewSupplier: any[];
  public gridData: any[];
  public sortedcolumnName: string = 'email';
  public sortDirection = 'asc';
  public ascIcon: string;
  public descIcon: string;
  loadingscroll: boolean;
  canLoad = false;
  pendingLoad = false;
  public userInviteDetailsEmailID: string;
  public maxCharacterLengthSubHead = 130;
  public userpreferences: Userpreferences;
  totalDataCount: any;
  tabActive:string='people';
  LastSignIn:any=0;
  username: any;
  totalClientDataCount: any;
  totalSupplierDataCount: any;
  fromEmailList=[];
  isViewMode: boolean=true;
  auditParameter: string;
  userLocation: any='Noida';
  imgPreview: any='';
  selectedTabIndex: any=0;
  public isResponseGet:boolean = false;
  constructor(private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private rtlLtrService: RtlLtrService,private routes: ActivatedRoute,
    public elementRef: ElementRef,  private _formInvite: FormBuilder,
    public _userpreferencesService: UserpreferencesService,
    private translateService: TranslateService) { 
      this.UserInviteForm = this._formInvite.group({
        ddlUtype: [[], [Validators.required]],
        ddlRoles: [null, [Validators.required]],
        ddlAccessLevel: [[], [Validators.required]],
        siteAccess: [1],
        eMails: ['', [Validators.required]]
      });
    }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
      URL_AS_LIST = URL.split('/');
     }else
     {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
     }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.routes.queryParams.subscribe((params) => {
      if(Object.keys(params).length!=0){
       this.viewMode = params['mode'];
       this.tabActive=params['tab'];
      }
     });
    this.getRolesList();
    this.getUserTypeList();
    this.getAccessLevelList();
   
  }
  getRolesList() {
    this.systemSettingService.fetchuUserInvitationRoleList().subscribe(
      repsonsedata => {
        this.userRoles = repsonsedata['Data'];
       
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  getUserTypeList() {
    this.systemSettingService.fetchuUserInvitationUserTypeList(this.tabActive).subscribe(
      repsonsedata => {
        this.userTypes = repsonsedata['Data'];
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  getAccessLevelList() {
    this.systemSettingService.fetchuUserInvitationAccessLevelList().subscribe(
      repsonsedata => {
        this.accessLevels = repsonsedata['Data'];
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  setSiteAccess(siteAcess) {
    if (siteAcess.checked) {
      this.UserInviteForm.patchValue({
        'siteAccess': 1
      });
    }
    else {
      this.UserInviteForm.patchValue({
        'siteAccess': 0
      });
    }
  }
  onSave(value) {
    this.isResponseGet = true; // who:maneesh,what:ewm-14781 for save btn loader,when:17/10/2023
    this.userInviteArray['UserTypeCode'] = value.ddlUtype;
    this.userInviteArray['Email'] = value.eMails;
    this.userInviteArray['IsSiteAccess'] = value.siteAccess?1:0;
    this.userInviteArray['SiteAccessLevelId'] = value.ddlAccessLevel;
    this.userInviteArray['RoleCode'] = value.ddlRoles;    
   // @suika @EWM-10629 @whn 27-03-2023 to add timezone param
   let timezone= Intl.DateTimeFormat().resolvedOptions().timeZone;
   this.userInviteArray['TimeZone'] = timezone.replace("Asia/Calcutta", "Asia/Kolkata");
    if (this.UserInviteForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.systemSettingService.addUserInvitation(this.userInviteArray).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.active = false;
            this.activeDetails = false;
            this.UserInviteForm.reset();
            this.UserInviteForm.reset({ eMails: '' });
            this.emailList = [];
            this.isResponseGet = false;
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.onCancel();
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading = false;
            this.isResponseGet = false;
          }
        }, err => {
          this.loading = false;
          this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         
        })
    }
  }
  public onCancel(): void {
    this.UserInviteForm.reset();
    this.emailList = [];
    this.route.navigate(['./client/core/user-management/user-invitation'] ,
    {queryParams: {mode: this.viewMode,tab:this.tabActive}});
  }
  getUserContactInfo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.maxWidth = "750px";
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = ['quick-modalbox', 'contact_receipent', 'animate__animated', 'animate__zoomIn'];
    dialogConfig.data = new Object({userType:this.tabActive,isUser:false,recordFor:this.UserInviteForm.controls['ddlUtype'].value});
   // dialogConfig.data = new Object({userType:this.UserInviteForm.controls['ddlUtype'].value,isUser:false});
    const modalDialog = this.dialog.open(ContactReceipentPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      for (let i = 0; i < res['data'].length; i++) {
        let IsDuplicate = false;
        
          for (let j = 0; j < this.emailList.length; j++) {
            if (this.emailList[j].value === res['data'][i]['emailId']) {
              IsDuplicate = true;
            }
          }
          if (IsDuplicate === false) {
            if (this.validateEmail(res['data'][i]['emailId'])) {
              this.emailList.push({ value: res['data'][i]['emailId'], invalid: false });
              this.setEmailsValues();
            } else {
              this.emailList.push({ value: res['data'][i]['emailId'], invalid: true });
              this.setEmailsValues();
              this.UserInviteForm.get("eMails").clearValidators();
              this.UserInviteForm.controls["eMails"].setErrors({ 'incorrectEmail': true });
            }
          }
      }
    });
    return false;
  }
  setEmailsValues() {
    let eMailVal = '';
    let IsValid = true;

    for (let i = 0; i < this.emailList.length; i++) {
      if (this.validateEmail(this.emailList[i].value) === false) {
        IsValid = false;
      }
      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.emailList[i].value;
      }
      else {
        eMailVal += ',' + this.emailList[i].value;
      }
     
    }

    this.UserInviteForm.patchValue({
      'eMails': eMailVal
    });

    if (IsValid === false) {
      this.UserInviteForm.get("eMails").clearValidators();
      this.UserInviteForm.controls["eMails"].setErrors({ 'incorrectEmail': true });
    }
  }
  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;

    if (event.value) {
      for (let i = 0; i < this.emailList.length; i++) {
        if (this.emailList[i].value === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value)) {
          this.emailList.push({ value: event.value, invalid: false });
          this.setEmailsValues();
        } else {
          this.emailList.push({ value: event.value, invalid: true });
          this.setEmailsValues();
          this.UserInviteForm.get("eMails").clearValidators();
          this.UserInviteForm.controls['eMails'].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.UserInviteForm.get("eMails").value === null || this.UserInviteForm.get("eMails").value === '') {
      this.UserInviteForm.get("eMails").clearValidators();
      this.UserInviteForm.get("eMails").setErrors({ required: true });
      this.UserInviteForm.get("eMails").markAsDirty();
    }
    if (event.input) {
      event.input.value = '';
    }


  }
  remove(userMail: UserEmails): void {
    const index = this.userEmail.indexOf(userMail);

    if (index >= 0) {
      this.userEmail.splice(index, 1);
    }
  }
  removeEmail(data: any): void {  
    if (this.emailList.indexOf(data) >= 0) {
      this.emailList.splice(this.emailList.indexOf(data), 1);
    }

    let eMailVal = '';
    let invalidEmail = false;

    for (let i = 0; i < this.emailList.length; i++) {

      if (this.emailList[i].invalid === true) {
        invalidEmail = true;
      }

      if (eMailVal.length === 0 || eMailVal === '') {
        eMailVal = this.emailList[i].value;
      }
      else {
        eMailVal += ',' + this.emailList[i].value;
      }
    }

    this.UserInviteForm.patchValue({
      'eMails': eMailVal
    });

    if (eMailVal.length === 0 || eMailVal === '') {
      this.UserInviteForm.get("eMails").clearValidators();
      this.UserInviteForm.get("eMails").setErrors({ required: true });
      this.UserInviteForm.get("eMails").markAsDirty();
    }
    else {
      if (invalidEmail) {
        this.UserInviteForm.get("eMails").clearValidators();
        this.UserInviteForm.controls['eMails'].setErrors({ 'incorrectEmail': true });
      }
    }
  }

}
