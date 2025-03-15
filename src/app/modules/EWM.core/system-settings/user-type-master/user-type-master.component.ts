/*
  @(C): Entire Software
  @Type: File, <html>
  @Who: Priti Srivastava
  @When: 23-Dec-2020
  @Why: ROST-569
  @What: This component is used for user type master
 */
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Renderer2 } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from '@progress/kendo-angular-l10n';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ImageUploadPopupComponent } from '../../shared/image-upload-popup/image-upload-popup.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from '../../shared/datamodels/location-type';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  providers: [MessageService],
  selector: 'app-user-type-master',
  templateUrl: './user-type-master.component.html',
  styleUrls: ['./user-type-master.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class UserTypeMasterComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public FileSize = 0;
  public gridView;
  public gridData;
  public mySelection: string[] = [];
  public active = false;
  public isNew = false;
  public editDataItem;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  addUserTypeForm: FormGroup;
  submitted = false;
  fileBinary: File;
  @ViewChild('fileInput') fileInput: ElementRef;
  myfilename = '';
  selectedFiles = '';
  result: string = '';
  public formtitle: string = 'grid';
  result1: boolean;
  viewMode: string = "listMode";
  public loading: boolean;
  private rtl = false;
  private ltr = true;
  public IsExists: boolean = false;
  public userRole;
  public activestatus: string;
  public loadingSearch: boolean;
  // for image upload

  IconPreviewUrl;
  IconImagePath;
  imagePreview: string;
  imagePreviewStatus: boolean = false;
  public imagePreviewloading: boolean = false;
  // for side menu
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  //for pagination and sorting
  pagesize;
  pageNo = 1;
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "GroupName,asc";
  public sortedcolumnName: string = 'GroupName';
  public sortDirection = 'asc';
  loadingscroll: boolean;
  canLoad: boolean;
  pendingLoad: boolean;
  fileType: any;
  searchValue: string = "";
  croppedImage: any;
  public maxSubHeadCharacterLengthName = 130;
  totalDataCount: any;
  visibility: string = '';
  visibilityStatus = false;
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public auditParameter;
  public idUserType = '';
  public idName = 'Id';
  auditbtnVisibility = false;
  next: number = 0;
  listDataview: any[] = [];
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  searchSubject$ = new Subject<any>(); 
  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 13-May-2021
  @Why: EWM-1488
  @What: For injection of service class and other dependencies
  */
  constructor(private fb: FormBuilder,
    public _settingService: SystemSettingService,
    public _sidebarService: SidebarService,
    private route: Router,
    private imageUploadService: ImageUploadService,
    public dialog: MatDialog,
    private snackBService: SnackBarService, private messages: MessageService, private commonServiesService: CommonServiesService, private renderer: Renderer2, private rtlLtrService: RtlLtrService,
    public _dialog: MatDialog, private appSettingsService: AppSettingsService, private translateService: TranslateService, private commonserviceService: CommonserviceService, private routes: ActivatedRoute) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    this.auditParameter = encodeURIComponent('User Types');
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
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    let queryParams = this.routes.snapshot.params.id;
    this.idUserType = decodeURIComponent(queryParams);
    if (this.idUserType == 'undefined') {
      this.idUserType = "";
    } else {
      this.idUserType = decodeURIComponent(queryParams);
    }

    this.loading = false;
    this.getAllUserRole();
    this.getTenantUserType(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.idName, this.idUserType);

    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.animationVar = ButtonTypes;
    this.switchListMode(this.viewMode);
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {  
      this.loadingSearch = true;
      this.getFilterValue(val);
       });
  }
  public openForm(formType, id, visi) {
    this.formtitle = formType;
    this.visibility = visi;
    this.active = true;
    this.editDataItem = this.gridView.filter(x => x['Id'] == id);
    this.editForm(this.editDataItem);
  }

  /* 
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: Amit Rajput
  @When: 19-Jan-2022
  @Why: EWM-4368 EWM-4526
  @What: creating animation
*/

animate() {
  this.animationState = false;
  setTimeout(() => {
    this.animationState = true;
  }, 0);
}
delaAnimation(i:number){
  if(i<=25){
    return 0+i*80;
  }
  else{
    return 0;
  }
}

mouseoverAnimation(matIconId, animationName) {
  let amin= localStorage.getItem('animation');
  if(Number(amin) !=0){
    document.getElementById(matIconId).classList.add(animationName);
  }
}
mouseleaveAnimation(matIconId, animationName) {
  document.getElementById(matIconId).classList.remove(animationName)
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
    if (this.viewMode === 'cardMode') {
      this.isvisible = true;
    } else {
      this.isvisible = false;
    }
    if (items[0].UserRoleName == null || items[0].UserRoleName == '') {
      items[0].RoleCode = '';
    }
    this.addUserTypeForm.patchValue({
      Id: items[0].Id,
      Icon: items[0].Icon,
      Code: items[0].Code,
      InternalName: items[0].InternalName,
      PublicName: items[0].PublicName,
      RoleCode: items[0].RoleCode,
      Abbreviation: items[0].Abbreviation,
      GroupName: items[0].GroupName,
    });
    this.activestatus = 'Update';
    this.IconPreviewUrl = items[0].PreviewIcon;
    this.IconImagePath = items[0].Icon;
    this.imagePreviewStatus = true;
    this.auditbtnVisibility = true;
    if (this.visibility === 'visi') {
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
      if (items[0].CodeInternal === 'EMPL') {
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
    this.formtitle = 'grid';
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
    dialogConfig.panelClass = 'myDialogCroppingImage';
    dialogConfig.data = new Object({ type: this.appSettingsService.getImageTypeSmall(), size: this.appSettingsService.getImageSizeMedium(),ratioStatus:false , recommendedDimensionSize:true, recommendedDimensionWidth:'700',recommendedDimensionHeight:'700' });
    const modalDialog = this.dialog.open(ImageUploadPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        this.uploadImageFileInBase64();
      }
    })
  }
  remove() {
    this.IconImagePath = '';
    this.IconPreviewUrl = '';
    this.imagePreviewStatus = false;
    this.addUserTypeForm.get('Icon').setValue('');
  }
  isvisible: boolean;
  // switchListMode(viewMode) {
  //   let listHeader = document.getElementById("listHeader");
  //   if (viewMode === 'cardMode') {
  //     this.viewMode = "cardMode";
  //     this.isvisible = true;
  //     this.animate();
  //   } else {
  //     this.viewMode = "listMode";
  //     this.isvisible = false;
  //     this.animate();
  //   }
  // }
  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.isvisible = false;
       this.animate();
       //listHeader.classList.remove("hide");
     }
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
  private getTenantUserType(pagesize, pageNo, sortingValue, searchVal, idName, idUserType) {
    this.loading = true;
    this._settingService.getAllTenantUserType(pagesize, pageNo, sortingValue, searchVal, idName, idUserType).subscribe(
      (data: any) => {
        this.animate();
        /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
        this.totalDataCount = data.TotalRecord;
        this.gridView = data.Data;
        // this.reloadListData();
        // this.doNext();
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
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
            this.addUserTypeForm.reset();
            this.getTenantUserType(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.idName, this.idUserType);
            this.formtitle = 'grid';
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
 @Name: checkColumnunique function
 @Who: Nitin Bhati
 @When: 19-May-2021
 @Why: ROST-1488
 @What: For sorting
*/
  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this._settingService.getAllTenantUserType(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.idName, this.idUserType).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          document.getElementById('contentdata').scrollTo(0, 0)
          this.loading = false;
          this.gridData = repsonsedata['Data'];
          this.gridView = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.tenantUserTypeScroll(this.pagesize, this.pageNo, this.sortingValue);
        // this.reloadListData();
        // this.doNext();
      } else {

        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }


  tenantUserTypeScroll(pagesize, pageNo, sortingValue) {
    //this.loadingscroll = true;
    this._settingService.getAllTenantUserType(pagesize, pageNo, sortingValue, this.searchValue, this.idName, this.idUserType).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.gridView = this.gridView.concat(nextgridView);
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loadingscroll = false;
      })
  }


  public onFilter(inputValue: string): void {
    this.loading = false;   
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;  
    this.searchSubject$.next(inputValue);
  }

  getFilterValue(searchValue){
    this._settingService.getAllTenantUserType(this.pagesize, this.pageNo, this.sortingValue, searchValue, this.idName, this.idUserType).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata['Data'];
          this.gridData = repsonsedata['Data'];
        }else  if (repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView =[];
          this.gridData = [];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
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
    this.getAllUserRole();
    this.getTenantUserType(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.idName, this.idUserType);
    this.formtitle = 'grid';
  }


  // reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
  // } 
  // doNext() {
  //   if (this.next < this.gridView.length) {
  //     this.listDataview.push(this.gridView[this.next++]);
  //   }
  // }


// refresh button onclick method by Adarsh Singh
refreshComponent(){
  this.getTenantUserType(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.idName, this.idUserType);
}

/*
@Name: onFilterClear function
@Who: maneesh
@When: 09-03-2023
@Why: EWM-10669
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchValue='';
  this.getTenantUserType(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.idName, this.idUserType);
}
}
