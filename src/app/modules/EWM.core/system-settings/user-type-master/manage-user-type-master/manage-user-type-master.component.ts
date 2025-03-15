/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Adarsh singh
    @When: 11-05-2022
    @Why: EWM-1581 EWM-5862
    @What: This page wil be use only for user type master
*/



import { Component, OnInit, Renderer2 } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from '@progress/kendo-angular-l10n';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';

import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { ImageUploadPopupComponent } from '../../../shared/image-upload-popup/image-upload-popup.component';
import { ResponceData } from '../../../shared/datamodels/location-type';

@Component({
  selector: 'app-manage-user-type-master',
  templateUrl: './manage-user-type-master.component.html',
  styleUrls: ['./manage-user-type-master.component.scss']
})
export class ManageUserTypeMasterComponent implements OnInit {
  addUserTypeForm: FormGroup;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  submitted = false;
  public IsExists: boolean = false;
  public activestatus: string;
  public loading: boolean;
  // for image upload

  IconPreviewUrl;
  IconImagePath;
  imagePreview: string;
  imagePreviewStatus: boolean = false;
  public imagePreviewloading: boolean = false;
  auditbtnVisibility = false;
  visibility: string = '';
  visibilityStatus = false;
  public active = false;
  croppedImage: any;
  public FileSize = 0;
  public userRole;
  currentValueById;
  getOrgId:any;
  dirctionalLang;




  constructor(private fb: FormBuilder,
    public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,
    private route: Router,
    private imageUploadService: ImageUploadService,
    public dialog: MatDialog,
    private snackBService: SnackBarService, private commonServiesService: CommonServiesService, private renderer: Renderer2, private rtlLtrService: RtlLtrService,
    public _dialog: MatDialog, private appSettingsService: AppSettingsService, private translateService: TranslateService, private commonserviceService: CommonserviceService, private routes: ActivatedRoute) {
   
    this.addUserTypeForm = this.fb.group({
      Id: [''],
      Icon: [''],
      IconUrl: [''],
      InternalName: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(this.specialcharPattern)]],
      PublicName: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(this.specialcharPattern)]],
      Code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern("^[A-Za-z]*$")]],
      RoleCode: ['', [Validators.required]],
      Abbreviation: ['', [Validators.required, Validators.maxLength(5), Validators.pattern(this.specialcharPattern)]],
      GroupName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe(
      params =>{
        if ( (params.Id != undefined && params.Id != null && params.Id != '') || (params.Visibility != undefined && params.Visibility != null && params.Visibility != '')) {
          this.getOrgId = params.Id;
          this.visibility = params.Visibility
          this.getOrgById(this.getOrgId);
          this.getAllUserRole();
        }
        else {}
        
      })
  }
  
  onSave(value) {
    this.submitted = true;
    if (this.addUserTypeForm.invalid) {
      return;
    }
    if (this.IsExists) {
      this.snackBService.showErrorSnackBar("Public name exists", "");
      return;
    }

    if (this.activestatus == 'Update') {
      this.editTenantUserType(value);
    }
  }

      /*
 @Type: File, <ts>
 @Name: getOrgById function
 @Who: Adarsh
 @When: 11-May-2022
 @Why: ROST-5862
 @What: get data by id
*/
getOrgById(Id: Number) {
  this.loading = true;
  this._settingService.getTenantUserById(Id).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
        this.currentValueById = data.Data;
        this.editForm(this.currentValueById)
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
@Name: editForm function
@Who: Nitin Bhati
@When: 19-May-2021
@Why: ROST-1488
@What: For setting value in the edit form
*/
editForm(items) {
  // if (items.UserRoleName == null || items.UserRoleName == '') {
  //   items.RoleCode = '';
  // }
  this.addUserTypeForm.patchValue({
    'Id': items.Id,
    'Icon': items.Icon,
    'Code': items.Code,
    'InternalName': items.InternalName,
    'PublicName': items.PublicName,
    'RoleCode': items.RoleCode,
    'Abbreviation': items.Abbreviation,
    'GroupName': items.GroupName,
  });
  
  this.activestatus = 'Update';
  this.IconPreviewUrl = items.PreviewIcon;
  this.IconImagePath = items.Icon;
  this.imagePreviewStatus = true;
  this.auditbtnVisibility = true;
  if (this.visibility === 'visi') {
  this.activestatus = 'visible';

    this.visibilityStatus = true;
    this.addUserTypeForm.controls["RoleCode"].disable();
    this.addUserTypeForm.controls["InternalName"].disable();
    this.addUserTypeForm.controls["Code"].disable();
    this.addUserTypeForm.controls["Abbreviation"].disable();
    this.addUserTypeForm.controls["PublicName"].disable();
    this.addUserTypeForm.controls["GroupName"].disable();
  }
  else {
    this.visibilityStatus = false;
    if (items.CodeInternal === 'EMPL') {
      this.addUserTypeForm.controls["RoleCode"].enable();
    } else {
      this.addUserTypeForm.controls["RoleCode"].disable();
    }
    //this.addUserTypeForm.controls["UserRoleId"].enable();
    this.addUserTypeForm.controls["InternalName"].enable();
    this.addUserTypeForm.controls["Code"].enable();
    this.addUserTypeForm.controls["Abbreviation"].enable();
    this.addUserTypeForm.controls["PublicName"].enable();
    this.addUserTypeForm.controls["GroupName"].disable();
  }
}

public onCancel(e): void {
  this.active = true;
  this.addUserTypeForm.reset();
}

  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Priti Srivastava
    @When: 29-jan-2021
    @Why: EWM-681
    @What: use for upload image on server
  */
 uploadImageFileInBase64() {
  this.imagePreviewloading = true;
  const formData = { 'base64ImageString': this.croppedImage };
  this.imageUploadService.ImageUploadBase64(formData).subscribe(
    repsonsedata => {
      this.imagePreviewStatus = true;
      this.IconPreviewUrl = repsonsedata.Data[0].Preview;
      this.IconImagePath = repsonsedata.Data[0].FilePathOnServer;
      this.FileSize = repsonsedata.Data[0].SizeOfFile;
      this.addUserTypeForm.get('Icon').setValue(this.IconImagePath);
      localStorage.setItem('Image', '2');
      this.imagePreviewloading = false;
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.imagePreviewloading = false;
    })
}

croppingImage() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.id = "modal-component";
  dialogConfig.height = "";
  dialogConfig.width = "100%";
  dialogConfig.panelClass = ['myDialogCroppingImage', 'animate__animated','animate__zoomIn'];
  dialogConfig.data = new Object({ type: this.appSettingsService.getImageTypeSmall(), size: this.appSettingsService.getImageSizeMedium(),ratioStatus:true , recommendedDimensionSize:true, recommendedDimensionWidth:'700',recommendedDimensionHeight:'700' });
  const modalDialog = this.dialog.open(ImageUploadPopupComponent, dialogConfig);
  modalDialog.afterClosed().subscribe(res => {
    if (res.data != undefined && res.data != '') {
      this.croppedImage = res.data;
      this.uploadImageFileInBase64();
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
remove() {
  this.IconImagePath = '';
  this.IconPreviewUrl = '';
  this.imagePreviewStatus = false;
  this.addUserTypeForm.get('Icon').setValue('');
}

private getAllUserRole() {
  this.loading = true;
  this._settingService.getUserRole().subscribe(
    (data: any) => {
      this.userRole = data.Data;

      this.loading = false;
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

editTenantUserType(value) {
  this.submitted = true;
  if (this.addUserTypeForm.invalid) {
    return;
  } else {
    this.loading = true;
    this._settingService.update(value).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.active = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.route.navigate(['./client/core/user-management/user-type-master']);
          this.addUserTypeForm.reset();
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
@Name: checkColumnunique function
@Who: Nitin Bhati
@When: 19-May-2021
@Why: ROST-1488
@What: For scheck duplicacy
*/
checkColumnunique(column, event) {
  let userTypeID = this.addUserTypeForm.get("Id").value;
  if (userTypeID == null) {
    userTypeID = 0;
  }
  if (userTypeID == '') {
    userTypeID = 0;
  }

  let checkIsExists = { 'ColumnName': column, 'Value': event.target.value, 'Id': userTypeID };

  this._settingService.getColumnCheck(checkIsExists).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode == 200) {
        if (data.Data == true) {
          this.addUserTypeForm.get(column).setErrors({ codeTaken: true });
          this.addUserTypeForm.get(column).markAsDirty();
        }
      }
      else if (data.HttpStatusCode == 400) {
        if (data.Data == false) {
          this.addUserTypeForm.get(column).clearValidators();
          this.addUserTypeForm.get(column).markAsPristine();
        }
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.loading = false;
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    });
}

 /*
   @Type: File, <ts>
    @Name: User Type master
    @Who: Priti Srivastava
    @When: 22-jan-2021
    @Why: EWM-700
    @What: use for upload image on server
  */
 uploadImageFileByUrl() {
  let file = '';
  this.imagePreviewloading = true;
  file = this.addUserTypeForm.controls.IconUrl.value;
  let strlist = file.split('.');
  const extensionArray = ['png', 'gif', 'jpeg', 'jpg'];
  const fileExtention = strlist[strlist.length - 1];
  //const fileExtentionValidation = extensionArray.findIndex(item => item === fileExtention.toLowerCase());
  const fileExtentionValidation = extensionArray.findIndex(item => fileExtention.toLowerCase().includes(item));
  if (fileExtentionValidation < 0) {
    this.imagePreviewloading = false;
    this.snackBService.showErrorSnackBar("Image is not a valid format.", '');
    return;
  }
  const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  let match = file.match(reg);
  if (match[1] == undefined) {
    this.imagePreviewloading = false;
    this.snackBService.showErrorSnackBar("URL is not in valid format.", '');
    return;
  }
  this.imageUploadService.addImageByUrl(file).subscribe(
    repsonsedata => {
      this.addUserTypeForm.get('IconUrl').setValue('');
      this.IconImagePath = repsonsedata.data[0].filePathOnServer;
      this.IconPreviewUrl = repsonsedata.data[0].preview;
      this.FileSize = repsonsedata.data[0].sizeOfFile;
      this.addUserTypeForm.get('Icon').setValue(this.IconImagePath);
      this.imagePreviewStatus = true;
      localStorage.setItem('Image', '2');
      this.imagePreviewloading = false;
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.imagePreviewloading = false;
    });
}

/**
  @(C): Entire Software
  @Type: Function
  @Who: Mukesh kumar rai
  @When: 10-Sept-2020
  @Why:  Open for modal window
  @What: This function responsible to open and close the modal window.
  @Return: None
  @Params :
  1. param -button name so we can check it come from which link.
 */
imagePreviewModal(Image): void {
  let data: any;
  data = { "title": 'title', "type": 'Image', "content": Image };
  const dialogRef = this._dialog.open(ModalComponent, {
    width: '240px',
    disableClose: true,
    data: data,
    panelClass: ['imageModal', 'animate__animated','animate__zoomIn']
  });
  //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
  dialogRef.afterClosed().subscribe(result => {
  });

  // RTL Code
  let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

}





}
