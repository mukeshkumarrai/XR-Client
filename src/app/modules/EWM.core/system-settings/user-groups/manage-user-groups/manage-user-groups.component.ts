/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Adarsh singh
    @When: 31-05-2022
    @Why: EWM-1581 EWM-5862
    @What: This page wil be use only for manage user groups
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { ResponceData } from 'src/app/shared/models';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service'; 
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { UserEmails } from '../../user-invitation/user-invitation.component';
import { ContactReceipentPopupComponent } from '../../../shared/contact-receipent-popup/contact-receipent-popup.component';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-user-groups',
  templateUrl: './manage-user-groups.component.html',
  styleUrls: ['./manage-user-groups.component.scss']
})
export class ManageUserGroupsComponent implements OnInit {
  public formtitle: string = 'grid';
  activestatus: string = 'Add';
  visibilityStatus = false;
  pageOption: any;
  pagesize;
  pagneNo = 1;
  addUserGroupForm: FormGroup;
  isShowUserKeyword: boolean = false;
  isCheckBoxDisableStatus: boolean = false;
  listDataview: any[] = [];
  userEmail: UserEmails[] = [];
  public usersList = [];
  submitted = false;
  loading: boolean;
  public active = false;
  tabActive: string = 'people';
  removable = true;
  currentValueById: [] = [];
  groupId: any[];
  formType: string;
  isView: string;

  //Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Owner and Team Member, When:10Apr2024
  public selectedOwnerItem: any = {};
  public ddlOwnerConfig: DRP_CONFIG;
  public currentMenuWidth: number;
  public maxMoreLengthForOwner: number = 5;

  public selectedMemberItem: any = {};
  public ddlMemberConfig: DRP_CONFIG;
  public maxMoreLengthForMember: number = 5;

  public isOwnerValid: boolean=false;
  public isMemberValid: boolean=false;
  public ddlOwnerDisabled:Object;
  public ddlMemberDisabled:Object;

  public statusList: any[];

  constructor(private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog, private router: ActivatedRoute,
    private appSettingsService: AppSettingsService, private translateService: TranslateService,private serviceListClass: ServiceListClass) {
      // by maneesh ewm-18304 for fixed statusid from 0 to 2 when:07/10/2024 behalf of nitin kumar chauhan sir
    this.statusList=[
      { statusId: 1, status: 'Active' },
      { statusId: 2, status: 'Inactive' }
    ];
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    // this.auditParameter=encodeURIComponent('User Groups'); 
    this.addUserGroupForm = this.fb.group({
      GroupId: [''],
      Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      Description: ['', [Validators.maxLength(250), Validators.minLength(2)]],
      statusId: ['',[Validators.required]],
      status:[],
      eMails: ['']
    })

  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(
      params => {
        if (params.Id != undefined && params.Id != null && params.Id != '') {
          this.formType = params.formType;
          this.getOrgById(params.Id);
        }
      })
    //Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Owner and Team Member, When:10Apr2024
    if(this.activestatus=='Add'){
      this.bindConfigOwner();
      this.bindConfigMember();
      this.addUserGroupForm.patchValue({
        'status': 'Active',
        'statusId': 1
      });
    }
   
    this.currentMenuWidth = window.innerWidth;
    this.screenMediaQuiryForWorkflow();
    this.screenMediaQuiryForMember();

  }
  
  /* 
   @Type: File, <ts>
   @Name: onSave function
   @Who: Renu
   @When: 25-Nov-2020
   @Why: ROST-405
   @What: FOR creating groups data
   */
  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.addUserGroupForm.invalid) {
      return;
    }
    this.onNameChanges(value,true);
  }
  /* 
  @Type: File, <ts>
  @Name: adduserGrup function
  @Who: Renu
  @When: 25-Nov-2020
  @Why: ROST-405
  @What: service call for creating groups data
  */

  adduserGrup(value) {
    value.statusId=this.addUserGroupForm.get("statusId").value;
    const selectedStatus=this.statusList.find(option=>option.statusId==value.statusId); 
    this.submitted = true;
    this.pagneNo = 1;
    if (this.addUserGroupForm.invalid) {
      return;
    } else {
      value.status=selectedStatus.status;
      value['Users']= this.selectedMemberItem.map(item=>({
        'UserId':item.UserId,
        'UserName':item.UserName,
        'IsOwner': 0,
      }));
      value['Users']=value['Users'].concat(this.selectedOwnerItem.map(item=>({
        'UserId':item.UserId,
        'UserName':item.UserName,
        'IsOwner': 1,
      })));
      this.systemSettingService.UserGrpCreate(value).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.active = false;
            this.route.navigate(['./client/core/user-management/user-group']);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.usersList = [];
            this.isShowUserKeyword = false;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  }

  /*
  @Type: File, <ts>
  @Name: onNameChanges function
  @Who: Renu
  @When: 06-Jan-2020
  @Why: EWM-640
  @What: This function is used for checking duplicacy for role Name
  */

  onNameChanges(value, isFromSave: boolean=false) {
   if(isFromSave){
    this.loading = true;
   }
    let tempID = this.addUserGroupForm.get("GroupId").value;
    let groupName = this.addUserGroupForm.get("Name").value;
    if (tempID == '') {
      tempID = 0;
    } else if (tempID == null) {
      tempID = 0;
    }
    if (this.addUserGroupForm.get("Name").value) {
      this.systemSettingService.checkUserGrpDuplicacy('?UserGroupName=' + groupName + '&Id=' + tempID).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 200 || repsonsedata['HttpStatusCode'] == 204) {
            if (repsonsedata['Data'] == true) {
              this.addUserGroupForm.get("Name").setErrors({ codeTaken: true });
              this.addUserGroupForm.get("Name").markAsDirty();
            } else if (repsonsedata['Data'] == false) {
              this.addUserGroupForm.get("Name").clearValidators();
              this.addUserGroupForm.get("Name").markAsPristine();
              this.addUserGroupForm.get('Name').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(2)]);
              if (value && isFromSave) {
                if (this.activestatus == 'Update') {
                  this.edituserGroup(value);
                } else {
                  this.adduserGrup(value);
                }
              }
            }

          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
          }
        },
        err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
    } else {
      this.addUserGroupForm.get('Name').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(2)]);

    }
    this.addUserGroupForm.get('Name').updateValueAndValidity();
  }

  /*
@Type: File, <ts>
@Name: editForm function
@Who: Renu
@When: 18-May-2021
@Why: ROST-2104
@What: For setting value in the edit form
*/

  getOrgById(Id: Number) {
    this.loading = true;
    this.systemSettingService.getUserGroupListById(Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.currentValueById = data.Data;
          this.editGroupForm(this.currentValueById)
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
      @Type: File, <ts>
      @Name: edituserGroup function
      @Who: Nitin Bhati
      @When: 10-Feb-2021
      @Why: EWM-861
      @What: edit user Group data
    */
  edituserGroup(value) {
    value.statusId=this.addUserGroupForm.get("statusId").value;
    const selectedStatus=this.statusList.find(option=>option.statusId==value.statusId); 
    this.submitted = true;
    this.pagneNo = 1;
    if (this.addUserGroupForm.invalid) {
      return;
    } else {
      value['Id'] = value.GroupId;
      value.status=selectedStatus.status;
      value['Users']= this.selectedMemberItem.map(item=>({
        'UserId':item.UserId,
        'UserName':item.UserName,
        'IsOwner': 0,
      }));
      value['Users']=value['Users'].concat(this.selectedOwnerItem.map(item=>({
        'UserId':item.UserId,
        'UserName':item.UserName,
        'IsOwner': 1,
      })));
  
      this.systemSettingService.updateGroupById(value).subscribe(
        repsonsedata => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode == 200) {
            this.active = false;
            this.route.navigate(['./client/core/user-management/user-group']);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.activestatus = 'Update';
            this.usersList = [];
            this.isShowUserKeyword = false;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
    }
  }

  /* 
    @Type: File, <ts>
    @Name: editGroupForm function
    @Who: Nitin Bhati
    @When: 10-Feb-2021
    @Why: EWM-861
    @What: to set value in form control if user click edit event
    */
 

  editGroupForm(items) {
    this.addUserGroupForm.patchValue({
      'Name': items[0]?.Name,
      'Description': items[0]?.Description,
      'GroupId': items[0]?.Id,
      'statusId': items[0]?.statusId,
      'status':items[0]?.status
    });

    //this.addUserGroupForm.get('statusId').setValue(items[0].status);

    if(items[0].Users !=null && items[0].Users.length>0){
      this.selectedMemberItem=items[0].Users;
      this.isMemberValid=true;
    }
    else 
    {
      this.isMemberValid=false;
    }
    if(items[0].Owners !=null && items[0].Owners.length>0){
      this.selectedOwnerItem=items[0].Owners;
      this.isOwnerValid=true;
    }
    else 
    {
      this.isOwnerValid=false;
    }



    this.bindConfigOwner();
    this.bindConfigMember();
    this.activestatus = 'Update';

    if(this.formType==='View'){
      this.activestatus = 'View';
      this.isCheckBoxDisableStatus=true;
      this.addUserGroupForm.disable();
      this.ddlOwnerDisabled=true;
      this.ddlMemberDisabled=true;
      this.isOwnerValid=false;
      this.isMemberValid=false;
    }
  }
  /* 
@Type: File, <ts>
@Name: getUserContactInfo function
@Who: Suika
@When: 12-July-2021
@Why: use for get  data.
@What: getUserContactInfo
 */

  getUserContactInfo() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.maxWidth = "750px";
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = ['quick-modalbox', 'contact_receipent', 'animate__animated', 'animate__zoomIn'];
    dialogConfig.data = new Object({ userType: this.tabActive, isUser: false, filterFor: 'usergroup' });
    const modalDialog = this.dialog.open(ContactReceipentPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      for (let i = 0; i < res['data'].length; i++) {
        let IsDuplicate = false;
        for (let j = 0; j < this.usersList.length; j++) {
          if (this.usersList[j]?.UserName === res['data'][i]['FullNameEmail']) {
            IsDuplicate = true;
          }
        }
        if (IsDuplicate === false) {
          this.usersList.push({ 'UserId': res['data'][i]['userId'], "UserName": res['data'][i]['FullNameEmail'], invalid: false });
          this.setEmailsValues();
          this.addUserGroupForm.get("eMails").clearValidators();
        }
      }
    });
    return false;
  }

  setEmailsValues() {
    let userVal = '';
    let IsValid = true;
    for (let i = 0; i < this.usersList.length; i++) {
      /* if (this.validateEmail(this.usersList[i].value) === false) {
         IsValid = false;
       }*/
      if (userVal === '0' || userVal === '') {
        userVal = this.usersList[i]?.UserName;
      }
      else {
        userVal += ',' + this.usersList[i]?.UserName;
      }
    }

    this.addUserGroupForm.patchValue({
      'eMails': userVal
    });

  }


  /* 
  @Type: File, <ts>
  @Name: validateEmail function
  @Who: Suika
  @When: 12-July-2021
  @Why: use for validateEmail values.
  @What: validateEmail
   */


  private validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  /* 
  @Type: File, <ts>
  @Name: add function
  @Who: Suika
  @When: 12-July-2021
  @Why: use for add selected values.
  @What: add
   */

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var IsDuplicate = false;

    if (event.value) {
      for (let i = 0; i < this.usersList.length; i++) {
        if (this.usersList[i].value === value) {
          IsDuplicate = true;
        }
      }
      if (IsDuplicate === false) {
        if (this.validateEmail(event.value)) {
          this.usersList.push({ value: event.value, invalid: false });
          this.setEmailsValues();
        } else {
          this.usersList.push({ value: event.value, invalid: true });
          this.setEmailsValues();
          this.addUserGroupForm.get("eMails").clearValidators();
          //this.addUserGroupForm.controls['eMails'].setErrors({ 'incorrectEmail': true });
        }
      }
    }
    else if (this.addUserGroupForm.get("eMails").value === null || this.addUserGroupForm.get("eMails").value === '') {
      this.addUserGroupForm.get("eMails").clearValidators();
      this.addUserGroupForm.get("eMails").setErrors({ required: true });
      this.addUserGroupForm.get("eMails").markAsDirty();
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  /* 
   @Type: File, <ts>
   @Name: remove function
   @Who: Suika
   @When: 12-July-2021
   @Why: use for remove values.
   @What: remove
    */

  remove(userMail: UserEmails): void {
    const index = this.userEmail.indexOf(userMail);

    if (index >= 0) {
      this.userEmail.splice(index, 1);
    }
  }


  /* 
   @Type: File, <ts>
   @Name: removeEmail function
   @Who: Suika
   @When: 12-July-2021
   @Why: use for removeEmail values.
   @What: removeEmail email
    */
  removeEmail(data: any): void {
    if (this.usersList.indexOf(data) >= 0) {
      this.usersList.splice(this.usersList.indexOf(data), 1);
    }

    let userVal = '';
    let invalidEmail = false;
    for (let i = 0; i < this.usersList.length; i++) {
      if (userVal === '0' || userVal === '') {
        userVal = this.usersList[i].value;
      }
      else {
        userVal += ',' + this.usersList[i].value;
      }
    }

    this.addUserGroupForm.patchValue({
      'eMails': userVal
    });

    if (userVal.length === 0 || userVal === '') {
      this.addUserGroupForm.get("eMails").clearValidators();
      this.addUserGroupForm.get("eMails").setErrors({ required: true });
      this.addUserGroupForm.get("eMails").markAsDirty();
    }
    else {
      if (invalidEmail) {
        this.addUserGroupForm.get("eMails").clearValidators();
        this.addUserGroupForm.controls['eMails'].setErrors({ 'incorrectEmail': true });
      }
    }
  }


  /* 
 @Type: File, <ts>
 @Name: isChecked function
 @Who: Suika
 @When: 12-July-2021
 @Why: use for markChecked .
 @What: isChecked
  */

  isChecked(event) {
    if (event === true) {
      this.isShowUserKeyword = true;
    } else {
      // this.usersList = [];
      // this.addUserGroupForm.get("eMails").reset();
      // this.addUserGroupForm.get("eMails").clearValidators();
      this.isShowUserKeyword = false;
    }
  }

//Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Owner, When:10Apr2024
bindConfigOwner() {
  this.ddlOwnerConfig = {
    API: this.serviceListClass.userInvitationsList +"?RecordFor=People&ByPassPaging=true",
    MANAGE: '',
    BINDBY: 'UserName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_OwnerName',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE: 'ProfileImageUrl',
    FIND_BY_INDEX: 'UserId'
  }
}

//Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Owner, When:10Apr2024
ddlChangeOwner(data) {
if (data == null || data == "") {
  this.selectedOwnerItem = null;
  this.isOwnerValid=false;
}
else {
  if(this.selectedMemberItem){
  if(Object.keys(this.selectedMemberItem).length > 0){
  var oneitem=data[data.length - 1];
  if(this.selectedMemberItem.some(item => item.UserId === oneitem.UserId)) {
    this.alertMessage('label_OwnerExists_Alert');
    if(data.length>1){
      data.pop();
    }
    else{
      data.length=0;
    }
  }
  }
  }
    this.selectedOwnerItem = data;
    if (data === null || data === undefined) {
      this.isOwnerValid=false;
    }
    else if(data.length==0){
      this.isOwnerValid=false;
    }
    else{
      this.isOwnerValid=true;
    }
  }
}

//Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Owner, When:10Apr2024
screenMediaQuiryForWorkflow() {
  if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
    this.maxMoreLengthForOwner = 1;
  } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
    this.maxMoreLengthForOwner = 2;
  } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
    this.maxMoreLengthForOwner = 3;
  } else {
    this.maxMoreLengthForOwner = 4;
  }
}

//Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Member, When:10Apr2024
bindConfigMember() {
  this.ddlMemberConfig = {
    API: this.serviceListClass.userInvitationsList +"?RecordFor=People&ByPassPaging=true",
    MANAGE: '',
    BINDBY: 'UserName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_MemberName',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE: 'ProfileImageUrl',
    FIND_BY_INDEX: 'UserId'
  }
}

//Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Member, When:10Apr2024
ddlChangeMember(data) {
if (data == null || data == "") {
  this.selectedMemberItem = null;
  this.isMemberValid=false;
}
else {
  if(this.selectedOwnerItem){
  if(Object.keys(this.selectedOwnerItem).length > 0){
    let oneitem=data[data.length - 1];
    if(this.selectedOwnerItem.some(item => item.UserId === oneitem.UserId)) {
      this.alertMessage('label_MemberExists_Alert');
      if(data.length>1){
       data.pop();
      } else{
        data.length=0;
      }
    }
  }
  }
    
    this.selectedMemberItem = data;
    if (data === null || data === undefined) {
      this.isMemberValid=false;
    }
    else if(data.length==0){
      this.isMemberValid=false;
    }
    else{
      this.isMemberValid=true;
    }
}
}

//Who:Ankit Rawat,Why: EWM-16598 Added new dropdown control for Member, When:10Apr2024
screenMediaQuiryForMember() {
  if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
    this.maxMoreLengthForMember = 1;
  } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
    this.maxMoreLengthForMember = 2;
  } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
    this.maxMoreLengthForMember = 3;
  } else {
    this.maxMoreLengthForMember = 4;
  }
}


public alertMessage(label){
  const message = ``;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,message:message, message1: label, message2: '', message3: ''},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
}

onStatusChange(event: any) {
  this.addUserGroupForm.patchValue({
    'statusId': +event
  });
}

}
