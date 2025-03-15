/*
   @Type: File, <ts>
    @Name: image-upload-popup.component.ts
    @Who: Priti Srivastava
    @When: 28-jan-2021
    @Why: EWM-681
    @What: common component for uploading images
  */
import { Component, EventEmitter, Inject, OnInit, Output, TemplateRef } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-upload-popup',
  templateUrl: './image-upload-popup.component.html',
  styleUrls: ['./image-upload-popup.component.scss']
})
export class ImageUploadPopupComponent implements OnInit {
  loading: boolean;
  croppedImage: any;
  noImage: boolean = true;
  imagebyUrlDragDrop: boolean = false;
  imagedata: any;
  profileImage: any;
  profileImagePreview: any;
  imageChangedEvent: any;
  imageDropEvent: any;
  imageFile: any;
  public fileType = [];
  public fileSize: number = 1000;
  public fileSizetoShow: string = '1 KB';
  public filePathOnServer: string;
  public TransfermSize: any;
  imageHeight: number = 0;
  public imagePreviewloading: boolean = false;
  public direction: string;
  imageWidth: number = 0;
  public blob: any;
  public imagebyUrl: boolean = false;
  addForm: FormGroup;
  dropDownContainer: Boolean = true;
  imageDimensionHidden: boolean = true;
  //files: FileHandle[] = [];
  public files: NgxFileDropEntry[] = [];
  imagePreview: string;
  imagePreviewStatus: boolean = false;
  title: any;
  isDisableButton:boolean=false;
  ratioStatus: boolean=false;
  recommendedDimensionSize:boolean=false;
  recommendedDimensionWidth:string='';
  recommendedDimensionHeight:string='';
  constructor(public dialogRef: MatDialogRef<ImageUploadPopupComponent>, private fb: FormBuilder, public dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private translateService: TranslateService, private _imageUploadService: ImageUploadService, @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private snackBService: SnackBarService, private _appSetting: AppSettingsService) {
    this.addForm = this.fb.group({
      mapicon: ['', [RxwebValidators.extension({ extensions: ["jpeg", "gif", "png"] })]],
      mapiconUrl: ['']
    });    
    this.fileType = data?.type;
    this.recommendedDimensionSize=data?.recommendedDimensionSize;
    this.recommendedDimensionWidth=data?.recommendedDimensionWidth;
    this.recommendedDimensionHeight=data?.recommendedDimensionHeight;
    this.ratioStatus= data?.ratioStatus;
    if (data.uploadMethod === 2) {
      this.noImage = false;
      fetch(data.imageData)
        .then(res => res.blob())
        .then(blob => this.blob = blob);
      this.imagebyUrl = true;
    } else {
      this.noImage = true;
    }
    this.fileSizetoShow = data.size;    
    if (data.size.includes('KB')) {
      let str = data.size.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (data.size.includes('MB')) {
      let str = data.size.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }
    this.title=data.title;
  }

  ngOnInit(): void {
    this.direction = localStorage.getItem('direction');
  }

  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who:  Suika
    @When: 01-June-2021
    @Why: EWM-1628
    @What: use for upload image on server
  */

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(
          (ev) => {
            if (!this.fileType.includes(ev.type)) {
              this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
              return;
            }
            if (+ev.size > this.fileSize) {
              this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
              return;
            }
            this.imageChangedEvent = { target: { files: [ev] } }
            this.noImage = false;
          },
        );
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;

      }
    }
  }
  public fileOver(event) {

  }
  public fileLeave(event) {

  }
  fileChangeEvent(event: any): void {      
    if (!this.fileType.includes(event.target.files[0].type.split('/')[1])) {    
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
      event = null;
      this.imageChangedEvent = event;
      return;
    }
    if (event.target.files[0].size > this.fileSize) {  
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
      event = null;
      this.imageChangedEvent = event;
      return;
    }

    this.imageChangedEvent = event;
    this.noImage = false;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageDimensionHidden = false;
    this.imageHeight = event.height;
    this.imageWidth = event.width;
  }
  imageLoaded(image: any) {
    // this.TransfermSize = image.transformed.size;
    // show cropper
  }
  cropperReady() {
    this.isDisableButton=true;
    // cropper ready
    // alert("cropperReady");
  }
  loadImageFailed() {
    // show message
    // alert("loadfail");
  }
  ShowHideButton(value) {
    this.dropDownContainer = value;
    this.addForm.get('mapiconUrl').setValue('');
  }
  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Priti Srivastava
    @When: 28-jan-2021
    @Why: EWM-681
    @What: use for upload image on server
  */
  uploadImageFileInBase64() {
   if (this.checkfileSize()) {
      document.getElementsByClassName("myDialogCroppingImage")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("myDialogCroppingImage")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({ event: 1, data: this.croppedImage }); }, 200);
    }
    else {
      this.snackBService.showErrorSnackBar("Image size is must be less than " + this.fileSizetoShow, '');
    }
  }
  closeImage() {
    if (this.imagebyUrl == true) {
      this.dialogRef.close();
      this.isDisableButton=false;
    }
    this.noImage = true;
    this.imageDimensionHidden = true;
    this.croppedImage = '';
    this.imageChangedEvent = null;
    this.isDisableButton=false;
  }
  onDismiss() {
    document.getElementsByClassName("myDialogCroppingImage")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("myDialogCroppingImage")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ event: 1, data: '' }) }, 200);
  }

  checkfileSize() {
    //x = (n * (3/4)) - y is a formula to calculate file size with base64 data.
    //Where:
    // x is the size of a file in bytes
    // n is the length of the Base64 String
    // y will be 2 if Base64 ends with '==' and 1 if Base64 ends with '='.
    if (this.croppedImage != undefined && this.croppedImage != null) {
      let padding = 0;
      if (this.croppedImage.endsWith('==')) { padding = 2; }
      else if (this.croppedImage.endsWith('=')) { padding = 1; }
      let str = this.croppedImage.split(',');
     /* console.log("this.croppedImage",str);
      let n = str[1].length;
      let x = (n * (3 / 4)) - padding;
      if (x > this.fileSize) {
        return false;
      }*/

      var sizeInBytes = 4 * Math.ceil((str[1].length / 3)) * 0.5624896334383812;
       var sizeInKb = sizeInBytes / 1000;
       if (sizeInKb > this.fileSize) {
        return false;
      }
     
    }
    return true;
  }

  /*
   @Type: File, <ts>
    @Name:uploadImageFileByUrl
    @Who: Suika
    @When: 01-june-2021
    @Why: EWM-1628
    @What: use for upload image on server
  */
  uploadImageFileByUrl() {
   
    let file = '';
    this.imagePreviewloading = true;
    file = this.addForm.controls.mapiconUrl.value;
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
        if (repsonsedata['HttpStatusCode'] == 200) {      
          this.addForm.get('mapiconUrl').setValue('');
          this.filePathOnServer = repsonsedata.Data[0].FilePathOnServer;
          this.imagePreview = repsonsedata.Data[0].Preview;
          
          let data: any;
          data = { "type": this._appSetting.getImageTypeSmall(), "size": this._appSetting.getImageSizeMedium(), "uploadMethod": "2", "imageData": this.imagePreview };
        // console.log("cropimage:",data);
          this.croppedImage = data;
          this.noImage = false;
        let imagePreviewSanitze:any =  this.domSanitizer.bypassSecurityTrustUrl(this.imagePreview)
          fetch(imagePreviewSanitze.changingThisBreaksApplicationSecurity)
            .then(res => res.blob())
            .then(blob => this.blob = blob);
          this.imagebyUrl = true;
          localStorage.setItem('Image', '2');
          this.addForm.get('mapicon').setValue(this.filePathOnServer);
          this.imagePreviewloading = false;
          this.dropDownContainer = true;
        }else if(repsonsedata['httpStatusCode'] == '400'){
          this.imagePreviewloading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }else{
          this.imagePreviewloading = false;
        }       
      }, err => {
        if (err.StatusCode == undefined) {
          this.imagePreviewloading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      });
  }
}
