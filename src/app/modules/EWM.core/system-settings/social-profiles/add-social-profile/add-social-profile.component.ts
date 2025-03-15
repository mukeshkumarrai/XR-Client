import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ImageUploadPopupComponent } from '../../../shared/image-upload-popup/image-upload-popup.component';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-add-social-profile',
  templateUrl: './add-social-profile.component.html',
  styleUrls: ['./add-social-profile.component.scss'],
  providers: [MessageService],


})
export class AddSocialProfileComponent implements OnInit {
  imagePreview: string;
  imagePreviewStatus: boolean = false;
  public imagePreviewloading: boolean = false;
  actionStatus: string = 'Add';
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "Id asc";
  public sortedcolumnName: string = 'Id';
  public sortDirection = 'asc';
  loadingscroll: boolean;
  canLoad: boolean = false;
  pendingLoad: boolean = false;
  pageNo: number = 1;
  searchVal: string = '';
  viewMode: string;
  isvisible: boolean;
  croppedImage: any;
  public filePathOnServer: string;

  addSocialProfileForm: FormGroup;
  loading: boolean;
  public IsEdit: boolean = false;
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public activestatus: string = 'Add';
  formtitle: string = 'grid';
  fileBinary: File;
  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  myfilename = '';
  selectedFiles = '';
  submitted = false;
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public active = false;
  public slideOut: boolean;


  constructor(
    private fb: FormBuilder, private router: ActivatedRoute, private _imageUploadService: ImageUploadService,
    public dialog: MatDialog, private snackBService: SnackBarService, private messages: MessageService,
    private commonServiesService: CommonServiesService, private validateCode: ValidateCode, private renderer: Renderer2, private rtlLtrService: RtlLtrService,
    private route: Router, public _sidebarService: SidebarService,
    public _dialog: MatDialog, private appSettingsService: AppSettingsService, private translateService: TranslateService,
    private systemSettingService: SystemSettingService,
    private routes: ActivatedRoute
  ) {
    this.addSocialProfileForm = this.fb.group({
      Id: [''],
      ProfileName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1), Validators.pattern(this.specialcharPattern)]],
      Logo: ['', [RxwebValidators.extension({ extensions: ["jpeg", "gif", "png"] })]],
      ImageTextUrl: ['']
    });
  }

  ngOnInit(): void {
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.router.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.activestatus = 'Edit'
          let tempID = parseInt(params['id']);
          this.IsEdit = true;
          this.editForm(tempID);
        }
      }
    )
    this.slideOut = true;
  }

  onCancel() {
    this.slideOut = false;
    setTimeout(() => {
      this.route.navigate(['./client/core/administrators/social-profiles']);
    }, 500);

  }


  get f() {
    return this.addSocialProfileForm.controls;
  }

  editForm(id) {
    this.loading = true;
    this.systemSettingService.getSocialProfileById('?Id=' + id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        this.actionStatus = 'update';
        if (data.HttpStatusCode == 200) {
          this.addSocialProfileForm.patchValue({
            Id: data.Data.Id,
            ProfileName: data.Data.ProfileName,
            Logo: data.Data.Logo,
          });
          this.imagePreviewStatus = true;
          this.imagePreview = data.Data.Logourl;
          this.actionStatus = 'update';
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
      })
  }
  /*
    @Type: File, <ts>
    @Name: selectFile function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: trigger on onchange event on input file.For capturing the image file realted info
  */
  selectFile(fileInput: any) {
    this.selectedFiles = fileInput.target.files;
    this.fileBinary = fileInput.target.files[0];
    this.myfilename = '';
    Array.from(fileInput.target.files).forEach((file: File) => {
      this.myfilename = file.name;
    });
    this.addSocialProfileForm.get('Image').setValue(this.myfilename);
    localStorage.setItem('Logo', '1');
    this.uploadImageFile(this.fileBinary);
  }
  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: use for upload image on server
  */
  uploadImageFile(file) {
    this.imagePreviewloading = true;
    const formData = new FormData();
    formData.append('file', file);
    this._imageUploadService.addImageUploadFile(formData).subscribe(
      repsonsedata => {
        this.filePathOnServer = repsonsedata['data'][0].filePathOnServer;
        this.imagePreview = repsonsedata['data'][0].preview;
        this.imagePreviewStatus = true;
        localStorage.setItem('Logo', '2');
        this.imagePreviewloading = false;
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      })
  }
  /*
    @Type: File, <ts>
    @Name: onSave function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @Why: This function is used for update and save record into database
    @What: .
  */
  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.addSocialProfileForm.invalid) {
      return;
    }
    this.pageNo = 1
    if (actionStatus == 'Add') {
      this.addSocialProfile(value);
    } else {
      this.editSocialProfile(value);
    }
  }
  /*
    @Type: File, <ts>
    @Name: addSubmitForm function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What:  For submit the form data
  */
  addSocialProfile(value) {
    let addJsonObj = {};
    addJsonObj['ProfileName'] = value.ProfileName;
    addJsonObj['Logo'] = value.Logo;
    this.loading = true;
    this.systemSettingService.addSocialProfile(addJsonObj).subscribe(
      (data: ResponceData) => {
        this.active = false;
        if (data.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          //this.searchVal = '';
          this.addSocialProfileForm.reset();
          this.loading = false;
          this.imagePreviewStatus = false;
          //this.formtitle = 'grid';
          this.route.navigate(['./client/core/administrators/social-profiles']);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        //this.cancel.emit();
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: editSocialProfile function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @Why: use for Edit Feature.
    @What: .
  */
  editSocialProfile(value) {
    if (!this.filePathOnServer) {
      value['Logo'] = value.Logo;
    } else {
      value['Logo'] = this.filePathOnServer;
    }
    this.loading = true;
    this.systemSettingService.updateSocialProfile(value).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.addSocialProfileForm.reset();
          // this.formtitle = 'grid';
          this.actionStatus = 'Add';
          this.loading = false;
          this.imagePreviewStatus = false;
          this.route.navigate(['./client/core/administrators/social-profiles']);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        //this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }
  /*
    @Type: File, <ts>
    @Name: User Type master
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: use for upload image on server
  */
  uploadImageFileByUrl() {
    let file = '';
    this.imagePreviewloading = true;
    file = this.addSocialProfileForm.controls.ImageTextUrl.value;
    let strlist = file.split('.');
    const extensionArray = ['png', 'gif', 'jpeg', 'jpg'];
    const fileExtention = strlist[strlist.length - 1];
    const fileExtentionValidation = extensionArray.findIndex(item => item === fileExtention.toLowerCase());
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
    this._imageUploadService.addImageByUrl(file).subscribe(
      repsonsedata => {
        this.addSocialProfileForm.get('ImageTextUrl').setValue('');
        this.filePathOnServer = repsonsedata['data'][0].filePathOnServer;
        // this.imagePreview = repsonsedata[0].preview;
        this.croppingImage(2, repsonsedata['data'][0].preview);
        //this.imagePreviewStatus=true;
        this.addSocialProfileForm.get('Logo').setValue(this.filePathOnServer);
        localStorage.setItem('Logo', '2');
        this.imagePreviewloading = false;
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      });
  }
  /*
   @Type: File, <ts>
   @Name: upload Image function
   @Who: Satya Prakash Gupta
   @When: 18-May-2021
   @Why: EWM-1481 EWM-1554
   @What: use for upload image on server
 */
  croppingImage(uploadMethod: any, logoPreviewUrl: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'myDialogCroppingImage';
    // @when:12-feb-2021 @who:priti @why:EWM-949  @What: pass data to image component to check size and type of image
    dialogConfig.data = new Object({ type: this.appSettingsService.getImageTypeSmall(), size: this.appSettingsService.getImageSizeMedium(), uploadMethod: uploadMethod, imageData: logoPreviewUrl,ratioStatus:true , recommendedDimensionSize:true, recommendedDimensionWidth:'50',recommendedDimensionHeight:'50' });
    const modalDialog = this.dialog.open(ImageUploadPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        this.uploadImageFileInBase64();
      }
    })
  }
  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Satya Prakash Gupta
    @When: 18-May-2021
    @Why: EWM-1481 EWM-1554
    @What: use for upload image on server
  */
  uploadImageFileInBase64() {
    this.imagePreviewloading = true;
    const formData = { 'base64ImageString': this.croppedImage };
    this._imageUploadService.ImageUploadBase64(formData).subscribe(
      (repsonsedata:any) => {
        this.filePathOnServer = repsonsedata['Data'][0].FilePathOnServer;
        this.imagePreview = repsonsedata['Data'][0].Preview;
        this.imagePreviewStatus = true;
        localStorage.setItem('Logo', '2');
        this.addSocialProfileForm.get('Logo').setValue(this.filePathOnServer);
        this.imagePreviewloading = false;
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      })
  }


  openImageDialog(Logo): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Logo };
    const dialogRef = this._dialog.open(ModalComponent, {
      disableClose: true,
      data: data,
      panelClass:  ['imageModal', 'animate__animated','animate__zoomIn']
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  onSocialProfileNameChanges() {
    let tempID = this.addSocialProfileForm.get("Id").value;
    if (tempID == '') {
      tempID = 0;
    } else if (tempID == null) {
      tempID = 0;
    }
    if (this.addSocialProfileForm.get("ProfileName").value == '') {
      return false;
    }
    this.systemSettingService.checkdSocialProfileDuplicay('?ProfileName=' + this.addSocialProfileForm.get("ProfileName").value + '&Id=' + tempID).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (data.Data == true) {

            this.addSocialProfileForm.get("ProfileName").clearValidators();
            this.addSocialProfileForm.get("ProfileName").markAsPristine();
          }
        }
        else if (data.HttpStatusCode == 400) {
          if (data.Data == false) {
            this.addSocialProfileForm.get("ProfileName").setErrors({ codeTaken: true });
            this.addSocialProfileForm.get("ProfileName").markAsDirty();
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
}
