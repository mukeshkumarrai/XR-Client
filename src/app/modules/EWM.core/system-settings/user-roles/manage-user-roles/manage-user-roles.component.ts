/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Adarsh singh
    @When: 12-05-2022
    @Why: EWM-1581 EWM-5862
    @What: This page wil be use only for user roles
*/

import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-manage-user-roles',
  templateUrl: './manage-user-roles.component.html',
  styleUrls: ['./manage-user-roles.component.scss']
})
export class ManageUserRolesComponent implements OnInit {

  addUserRoleForm: FormGroup;
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  addPermissionForm: any;
  loading:boolean;
  activestatus: string = 'Add';
  status: boolean = false;
  submitted = false;
  pagneNo = 1;
  public active = false;
  public formtitle: string = 'grid';
  searchVal: string = '';
  isViewMode: boolean;
  viewMode: string = "listMode";
  isvisible: boolean;
  @ViewChild('curtain') divCurtain: ElementRef;
  scrolposistion: any;
  public gridData: any[];
  actionType = 'Add';
  totalDataCount: any;
  public gridView: any[];
  pageOption: any;
  pagesize;
  sortingValue: string = "Is_system_defined,desc";
  currentValueById:any;
  RoleCode:any;
  isClicked:boolean =false;
  isCopyMethode = false;
  isView= false;

  constructor(private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,private routes: ActivatedRoute,
    public elementRef: ElementRef, private appSettingsService: AppSettingsService, private translateService: TranslateService) {
    
         // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;

    this.addUserRoleForm = this.fb.group({
      RoleCode: [''],
      CloneFrom:[],
      Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2),
      Validators.pattern(this.specialcharPattern)]],
      Description: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(2)]],
      Is_system_defined:[0]
    });
    this.addPermissionForm=this.fb.group({
      RoleCode:[''],
      Menus:[]}); 
  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe(
      params =>{
        if (params.RoleCode != undefined && params.RoleCode != null && params.RoleCode != '') {
          if (params.Copy != undefined && params.Copy != null && params.Copy != '') {
             this.isCopyMethode = true;
          }
          if (params.View != undefined && params.View != null && params.View != '') {
            this.isView = true;
         }
          this.RoleCode = params.RoleCode;
          this.getOrgById(this.RoleCode);
        }
        else {}
        
      })
    this.userRoleList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
  }



  /* 
  @Type: File, <ts>
  @Name: onSave function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-486
  @What: FOR creating groups data
  */
 onSave(value, actionStatus) {
  this.submitted = true;
  if (this.addUserRoleForm.invalid) {
    return;
  }
  this.onNameChanges(value);
  this.isClicked = true;

}

  /* 
  @Type: File, <ts>
  @Name: adduserGrup function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-483
  @What: service call for creating groups data
  */

 adduserRole(value) {
  this.submitted = true;
  this.pagneNo = 1;
  if (this.addUserRoleForm.invalid) {
    return;
  } else {
    //this.loading = true;
    //value['Is_system_defined'] = 0;
    this.systemSettingService.UserRoleCreate(value).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.active = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.addUserRoleForm.reset();
          this.route.navigate(['./client/core/user-management/user-role']);
          this.formtitle = 'grid';
          this.searchVal = '';
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
    @Name: userRoleList function
    @Who: Renu
    @When: 25-Nov-2020
    @Why: ROST-405
    @What: service call for get list for user role data
    */

   userRoleList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.systemSettingService.fetchuserRoleList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
           /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount=repsonsedata['TotalRecord'];
          this.gridView = repsonsedata['Data'];
          this.gridData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }
  /*
  @Type: File, <ts>
  @Name: onNameChanges function
  @Who: Renu
  @When: 06-Jan-2020
  @Why: EWM-640
  @What: This function is used for checking duplicacy for role Name
  */

 onNameChanges(value) {
   let tempID;
if (this.isCopyMethode == true) {
   tempID = null;
}else{
   tempID = this.addUserRoleForm.get("RoleCode").value;
}
  
  let roleName = this.addUserRoleForm.get("Name").value;
  // if (tempID == '') {
  //   tempID = 0;
  // } else if (tempID == null) {
  //   tempID = 0;
  // }
  if (this.addUserRoleForm.get("Name").value) {
    this.systemSettingService.checkRoleDuplicacy('?RoleName=' + roleName + '&RoleCode=' + tempID).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == 200) {
         // if (repsonsedata['Data'] == true) {
            this.addUserRoleForm.get('Name').markAsTouched();
            this.addUserRoleForm.get("Name").setErrors({ codeTaken: true });
            this.addUserRoleForm.get("Name").markAsDirty();

          //} else if (repsonsedata['Data'] == false) {
          //{
        }
        else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.addUserRoleForm.get("Name").clearValidators();
          this.addUserRoleForm.get("Name").markAsPristine();
          this.addUserRoleForm.get('Name').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]);

         if (this.isClicked == true) {
          if (this.activestatus == 'Update') {
            this.edituserRole(value);
          } else {
            this.adduserRole(value);
          }
         }
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      });
  }
  else {
    this.addUserRoleForm.get('Name').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]);

  }
  this.addUserRoleForm.get('Name').updateValueAndValidity();
}

      /*
 @Type: File, <ts>
 @Name: getOrgById function
 @Who: Adarsh
 @When: 11-May-2022
 @Why: ROST-5862
 @What: get data by id
*/
getOrgById(Id) {
  this.loading = true;
  this.systemSettingService.getUserRoleById(Id).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
        this.currentValueById = data.Data;
        if (this.isView == true) {
          this.editRoleForm(this.currentValueById, true);
          this.activestatus = 'View';
        }else{
          this.editRoleForm(this.currentValueById, false)
        }
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
  @Name: editRoleForm function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-483
  @What: to set value in form control if user click edit event
  */

 editRoleForm(items,isView:boolean) {
  this.addUserRoleForm.patchValue({
    'Name': items.Name,
    'Description': items.Description,
    'RoleCode': items.RoleCode,
    'Is_system_defined':0
  })
  if(isView){
    this.addUserRoleForm.disable();
    this.isViewMode=true;
  }
  else{
    this.addUserRoleForm.enable();
    this.isViewMode=false;
  }
  if (this.isCopyMethode == true) {
    this.addUserRoleForm.enable();
    this.addUserRoleForm.patchValue({
      'CloneFrom':items.RoleCode,
      'Name': items.Name,
      'Description': items.Description
    })
    this.formtitle = 'Add';
   }else{
    this.activestatus = 'Update';
   }
}

/* 
@Type: File, <ts>
@Name: edituserRole function
@Who: Renu
@When: 24-Dec-2020
@Why: ROST-485
@What: edit user Role data
*/

edituserRole(value) {
  if (this.viewMode === 'cardMode') {
    this.isvisible = true;
  } else {
    this.isvisible = false;
  }
  this.submitted = true;
  this.pagneNo = 1;
  if (this.addUserRoleForm.invalid) {
    return;
  } else {
   // this.loading = true;
    //value['Is_system_defined'] = 0;
   // delete value.roleId;
    this.systemSettingService.updateRoleById(value).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.active = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.route.navigate(['./client/core/user-management/user-role']);
          this.addUserRoleForm.reset();
          this.formtitle = 'grid';
          this.activestatus = 'Add'; // added by priti to handle add after Update date:11-jan-2021
          // this.divCurtain.nativeElement.scrollHeight=this.scrolposistion; 
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
    @Who: priti
    @When: 19-May-2021
    @Why: EWM-1468
  */
 onUserRolechange(id:number)
 {
   let item;
   item=this.gridData.filter(x => x['RoleCode'] == id);
   this.addUserRoleForm.patchValue({
    'Name': item[0].Name,
    'Description': item[0].Description
  });
 }
   /* 
  @Type: File, <ts>
  @Name: onCancel function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-483
  @What: FOR closing the form on button click event
  */

 public onCancel(e): void {
  this.formtitle = 'grid';
  this.active = true;
  this.addUserRoleForm.reset();
  this.activestatus = 'Add';
}

}
