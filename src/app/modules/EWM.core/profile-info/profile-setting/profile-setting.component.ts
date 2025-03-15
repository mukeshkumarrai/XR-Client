/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 16-Nov-2020
  @Why: ROST-364 ROST-394
  @What:  This page will be use for the profile setting Component ts file
*/
import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ImageUploadAdvancedComponent } from '../../shared/image-upload-advanced/image-upload-advanced.component';
import { ResponceData } from 'src/app/shared/models';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { Subscription } from 'rxjs';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { ShortNameColorCode } from '@app/shared/models/background-color';

@Component({
  providers: [MessageService],
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.scss'],
})
export class ProfileSettingComponent implements OnInit {
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  @Input() rtlVal: string;
  @Input() orgId: string[];
  userProfileList = [];
  userFrom: FormGroup;
  submitted = false;
  status: boolean = false;
  firstname: String;
  lastname: String;
  emailid: string;
  phoneNumber: string;
  jobTitle: string;
  profileImage: string = '';
  profileImagePreview: string;
  fileBinary: File;
  loading: boolean;
  isDarkModeEnable: string = "";
  @ViewChild('fileInput') fileInput: ElementRef;
  myfilename = '';
  selectedFiles = '';
  fileType;
  result: string = '';
  ckeConfig: any;
  private rtl = false;
  private ltr = true;
  imageChangedEvent: any = '';
  croppedImage: any = null;
  public noImage: boolean = true;
  public maxCharacterLengthSubHead = 115;
  public imagePreviewloading: boolean = false;
  JobProfilecontent: string;
  public imagePreviewStatus: boolean = true;
  dirctionalLang;
  //  kendo image uploader Adarsh singh 01-Aug-2023
  subscription$: Subscription;
  @ViewChild('editor') editor: EditorComponent;
  // End
  public editorConfig: EDITOR_CONFIG;
  public showErrorDesc: boolean = false;
  public getEditorVal: string;
  public gridListView: any = [];
  ownerList: string[] = [];
  profileShortName: string;
  constructor(private translateService: TranslateService, private fb: FormBuilder, private _profileInfoService: ProfileInfoService, private _imageUploadService: ImageUploadService,
    private route: Router, private snackBService: SnackBarService, private commonserviceService: CommonserviceService, public _sidebarService: SidebarService, public _dialog: MatDialog,
    private rtlLtrService: RtlLtrService, private messages: MessageService, private commonServiesService: CommonServiesService, private _appSetting: AppSettingsService,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.userFrom = this.fb.group({
      UserFirstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      JobTitle: ['', [Validators.minLength(1), Validators.maxLength(30)]],
      UserLastName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      Department: ['', [Validators.minLength(1), Validators.maxLength(30)]],
      UserPublicName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      Organization: ['', [Validators.minLength(1), Validators.maxLength(30)]],
      Facebook: ['', [Validators.pattern(reg)]],
      Linkedin: ['', [Validators.pattern(reg)]],
      JobProfile: [''],
      Imagepath: ['']
    })
    this.commonserviceService.refreshSearchComponent();
  }
  public value = ``;

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    const pageTitle = 'label_myProfile';
    this.commonserviceService.setTitle(pageTitle);
    this.getUserProfileInfo();
    this._sidebarService.subManuGroup.next('profile');
    this.ckeConfig = {
      title: "",
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      toolbar: [
        { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"] },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote"] },
        { name: "justify", items: ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"] },
        { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor"] }
      ]
    };

    this.commonserviceService.event.subscribe(res => {
      if (res == 'rtl') {
        this.messages.notify(this.ltr);
      } else if (res == 'ltr') {
        this.messages.notify(this.rtl);
      }
    }, err => {
      this.loading = false;
    })
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    }, err => {
      this.loading = false;
    })
    this.loading = false;

    /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
    this.commonServiesService.searchEnableCheck(1);
    //who:maneesh,what:ewm-16207 ewm-16359 for fixed config  ,when:14/03/2024
    this.editorConfig = {
      REQUIRED: false,
      DESC_VALUE: null,
      PLACEHOLDER: '',
      Tag: [],
      EditorTools: [],
      MentionStatus: false,
      maxLength: 0,
      MaxlengthErrormessage: false,
      JobActionComment: false
    };
  }
  /*
 @Type: File, <ts>
 @Name: getUserProfileInfo
 @Who: Nitin Bhati
 @When: 18-Nov-2020
 @Why: ROST-395
 @What: to get User profile related info
 */
  getUserProfileInfo() {
    this.loading = true;
    this._profileInfoService.getUserProfileInfo().subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.firstname = repsonsedata['Data']['UserFirstName'];
          this.lastname = repsonsedata['Data']['UserLastName'];
          this.emailid = repsonsedata['Data']['UserEmail'];
          this.phoneNumber = repsonsedata['Data']['UserPhone'];
          this.jobTitle = repsonsedata['Data']['JobTitle'];
          this.profileImage = repsonsedata['Data']['Imagepath'];
          this.profileImagePreview = repsonsedata['Data']['PreviewUrl'];
          this.profileShortName = repsonsedata['Data']['ShortName'];
          this.isDarkModeEnable = repsonsedata['Data']['IsDarkMode'];
          localStorage.setItem('isDarkModeEnable', this.isDarkModeEnable);
          if (!this.profileImagePreview) {
            this.profileShortName;
          } else {
            this.profileImagePreview;
          }
          let JobProfile;
          if (repsonsedata['Data']['JobProfile']) {
            JobProfile = repsonsedata['Data']['JobProfile']?.trim();
          }

          this.userFrom.patchValue({
            'UserFirstName': repsonsedata['Data']['UserFirstName'],
            'JobTitle': repsonsedata['Data']['JobTitle'],
            'UserLastName': repsonsedata['Data']['UserLastName'],
            'Department': repsonsedata['Data']['Department'],
            'UserPublicName': repsonsedata['Data']['UserPublicName'],
            'Organization': repsonsedata['Data']['Organization'],
            'Facebook': repsonsedata['Data']['Facebook'],
            'Linkedin': repsonsedata['Data']['Linkedin'],
            'JobProfile': JobProfile,
            'Imagepath': this.profileImage
          })
          this.getEditorVal = JobProfile; //who:maneesh,what:ewm-16207 ewm-16358,when:14/03/2024

        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

        }
      }, err => {
        this.loading = false;

      })
  }
  /*
    @Type: File, <ts>
    @Name: selectFile function
    @Who: Nitin Bhati
    @When: 18-Nov-2020
    @Why: ROST-395
    @What: trigger on onchange event on input file.For capturing the image file realted info
  */
  selectFile(fileInput: any) {
    this.selectedFiles = fileInput.target.files;
    this.fileBinary = fileInput.target.files[0];
    const files = fileInput.target.files;
    const file = files[0];
    const extensionArray = ['png', 'gif', 'jpeg'];
    const filetype = file.type;
    this.fileType = filetype;
    const fileExtention = this.fileType.substring(6);
    const fileExtentionValidation = extensionArray.findIndex(item => item === fileExtention.toLowerCase());
    if (fileExtentionValidation > -1) {
      this.uploadImageFile(this.fileBinary);
      localStorage.setItem('Image', '1');
      this.fileInput.nativeElement.value = "";
    } else {
      this.fileInput.nativeElement.value = "";
      this.loading = false;
      this.snackBService.showErrorSnackBar("Image is not a valid format.", '');
    }
  }
  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Nitin Bhati
    @When: 18-Nov-2020
    @Why: ROST-395
    @What: use for upload image on server
  */
  uploadImageFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    this.loading = true;
    this._profileInfoService.addImageUploadFile(formData).subscribe(
      repsonsedata => {
        this.profileImage = repsonsedata.data[0].filePathOnServer;
        this.profileImagePreview = repsonsedata.data[0].preview;
        // this.profileShortName=repsonsedata.data[0].preview;
        localStorage.setItem('Image', '2');
        this.fileInput.nativeElement.value = "";
        this.loading = false;
      }, err => {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }
  /*
  @Type: File, <ts>
  @Name: updateUserProfileInfo
  @Who: Nitin Bhati
  @When: 18-Nov-2020
  @Why: ROST-395
  @What: For update all User profile Information
  */
  updateUserProfile(value) {
    this.loading = true;

    this.submitted = true;
    if (this.userFrom.invalid) {
      return;
    } else {
      this.uploadImageFileInBase64(value);

    }
  }

  /*
  @Type: File, <ts>
  @Name: profileUploadingInfo
  @Who: Renu
  @When: 16-May-2022
  @Why: ROST-6607 EWM-6751
  @What: For update all User profile Information
  */

  profileUploadingInfo(value) {
    value['Imagepath'] = this.profileImage;
    value['JobProfile'] = value?.JobProfile;
    this._profileInfoService.updateUserProfileInfo(JSON.stringify(value)).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.loading = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.getUserProfileInfo();
          this.commonserviceService.onProfileImageSelect.next(localStorage.setItem('ProfileUrl', repsonsedata.Data['PreviewUrl']));
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
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
  openDialog(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this._dialog.open(ModalComponent, {
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated', 'animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {
    });
  }


  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    this._dialog.open(templateRef);
  }
  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Priti Srivastava
    @When: 27-jan-2021
    @Why: EWM-681
    @What: use for upload image on server
  */
  uploadImageFileInBase64(value) {
    this.imagePreviewloading = true;
    const formData = { 'base64ImageString': this.croppedImage };
    if (this.croppedImage != null) {
      let result = this._imageUploadService.uploadByUrlMethod(this.croppedImage, 1);
      result.subscribe((res: any) => {
        if (res) {
          this.imagePreviewloading = false;
          this.profileImage = res.filePathOnServer;
          this.profileUploadingInfo(value);
        } else {
          this.imagePreviewloading = false;
        }
      });
    } else {
      this.loading = false;
      this.imagePreviewloading = false;
      this.profileUploadingInfo(value);
    }

  }
  /*
      @Type: File, <ts>
      @Name: upload Image function
      @Who: Priti Srivastava
      @When: 27-jan-2021
      @Why: EWM-681
      @What: use for upload image on server
    */
  croppingImage() {
    // this.loading = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'];
    // @when:10-feb-2021 @who:priti @why:EWM-882  @What: pass data to image component to check size and type of image
    dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeMedium(), ratioStatus: true, recommendedDimensionSize: true, recommendedDimensionWidth: '700', recommendedDimensionHeight: '700' });
    const modalDialog = this._dialog.open(ImageUploadAdvancedComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        this.profileImagePreview = this.croppedImage;
      }
    })

    // RTL code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
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
    this.getUserProfileInfo();
  }

  /*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 2-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/
  openImageUpload(): void {
    const dialogRef = this._dialog.open(ImageUploadKendoEditorPopComponent, {
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
  ngOnDestroy() {
    this.subscription$?.unsubscribe();
  }
  //who:maneesh,what:ewm-16207 ewm-16359,when:14/03/2024
  getEditorFormInfo(event) {
    this.ownerList = event?.ownerList;
    if (event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
      this.showErrorDesc = false;
      this.userFrom.get('JobProfile').setValue(event?.val);
    } else {
      this.userFrom.get('JobProfile').updateValueAndValidity();
      this.userFrom.get("JobProfile").markAsTouched();
    }
  }
  getEditorImageFormInfo(event) {
    const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
    if (event?.val?.replace(/(<([^>]+)>)/ig, "")?.length == 0 && sources == undefined) {
      this.userFrom.get('JobProfile').setValue('');
    } else {
      this.userFrom.get('JobProfile').setValue(event?.val);
    }
  }

  /*
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 13-07-2023
  @Why: EWM-13134
  @What: set background color
  */
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }
}