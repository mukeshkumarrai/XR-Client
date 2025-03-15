/*
   @Type: File, <ts>
    @Name: image-upload-advanced.component.ts
    @Who: Renu
    @When: 16-May-2022
    @Why: EWM-6607 EWM-6751
    @What: common component for uploading images advanced
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
  selector: 'app-image-upload-advanced',
  templateUrl: './image-upload-advanced.component.html',
  styleUrls: ['./image-upload-advanced.component.scss']
})
export class ImageUploadAdvancedComponent implements OnInit {

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
  recommendedDimensionSize:boolean=false;
  recommendedDimensionWidth:string='';
  recommendedDimensionHeight:string='';
  ratioStatus: boolean=false;

  constructor(public dialogRef: MatDialogRef<ImageUploadAdvancedComponent>, private fb: FormBuilder, public dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private translateService: TranslateService, private _imageUploadService: ImageUploadService, @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private snackBService: SnackBarService, private _appSetting: AppSettingsService) {
      this.addForm = this.fb.group({
        mapicon: ['', [RxwebValidators.extension({ extensions: ["jpeg", "gif", "png"] })]],
        mapiconUrl: ['']
      });
      this.fileType = data.type;
      this.recommendedDimensionSize=data?.recommendedDimensionSize;
      this.recommendedDimensionWidth=data?.recommendedDimensionWidth
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
  }

/*
  @Type: File, <ts>
  @Name: ShowHideButton function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: use for upload image  via url
*/
  ShowHideButton(value) {
    this.dropDownContainer = value;
    this.addForm.get('mapiconUrl').setValue('');
  }

/*
  @Type: File, <ts>
  @Name: upload Image function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: use for upload image on server
*/
    uploadImageFileInBase64() {
      if (this.checkfileSize()) {
        // <!---------@When: 01-12-2022 @who:Adarsh singh @why: EWM-9142 --------->
        let imageContent = {};
        imageContent['width'] = this.imageWidth;
        imageContent['height'] = this.imageHeight;
        // End 
         document.getElementsByClassName("myDialogCroppingImage")[0].classList.remove("animate__zoomIn")
         document.getElementsByClassName("myDialogCroppingImage")[0].classList.add("animate__zoomOut");
         setTimeout(() => { this.dialogRef.close({ event: 1, data: this.croppedImage, imageContent: imageContent }); }, 200);
       }
       else {
         this.snackBService.showErrorSnackBar("Image size is must be less than " + this.fileSizetoShow, '');
       }
     }

/*
  @Type: File, <ts>
  @Name: checkfileSize function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: use for checkfileSize before uploding
*/
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
  @Name: onDismiss function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: for closing the popup
*/
    onDismiss() {
      document.getElementsByClassName("myDialogCroppingImage")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("myDialogCroppingImage")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({ event: 1, data: '' }) }, 200);
    }
  
/*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: when image ready to upload
*/
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

/*
  @Type: File, <ts>
  @Name: imageLoaded function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: when image load
*/

    imageLoaded(image: any) {
      // this.TransfermSize = image.transformed.size;
      // show cropper
    }

/*
  @Type: File, <ts>
  @Name: cropperReady function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: when image ready to crop
*/
    cropperReady() {
      // cropper ready
      // alert("cropperReady");
    }

/*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: when image loading failed
*/
    loadImageFailed() {
      // show message
      // alert("loadfail");
    }
/*
    @Type: File, <ts>
    @Name: closeImage function
    @Who: Renu
    @When: 16-May-2022
    @Why: EWM-6607 EWM-6751
    @What: when image clear data
*/
    closeImage() {
      if (this.imagebyUrl == true) {
        this.dialogRef.close();
      }
      this.noImage = true;
      this.imageDimensionHidden = true;
      this.croppedImage = '';
      this.imageChangedEvent = null;
    }
  
/*
    @Type: File, <ts>
    @Name: imageCropped function
    @Who: Renu
    @When: 16-May-2022
    @Why: EWM-6607 EWM-6751
    @What: when image ready to cropped
*/
    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      this.imageDimensionHidden = false;
      this.imageHeight = event.height;
      this.imageWidth = event.width;
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
    let result=this._imageUploadService.uploadByUrlMethod(file,2);
    result.subscribe((res:any)=>{
      if(res){
       this.imagePreviewloading = false;
      
     this.addForm.get('mapiconUrl').setValue('');
      this.filePathOnServer = res.filePathOnServer;
      this.imagePreview =res.imagePreview;
      let data: any;
            data = { "type": this._appSetting.getImageTypeSmall(), "size": this._appSetting.getImageSizeMedium(), 
            "uploadMethod": "2", "imageData": res.croppedImage };
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
      }else{
        this.imagePreviewloading = false;
      }
     });

      /*** 
     * why:EWM-6607 EWM-6751 
     * who: renu
     * when: 17 may 2022
     * */
    // this._imageUploadService.addImageByUrl(file).subscribe(
    //   repsonsedata => {
    //     if (repsonsedata['HttpStatusCode'] == 200) {      
    //       this.addForm.get('mapiconUrl').setValue('');
    //       this.filePathOnServer = repsonsedata.Data[0].FilePathOnServer;
    //       this.imagePreview = repsonsedata.Data[0].Preview;
          
    //       let data: any;
    //       data = { "type": this._appSetting.getImageTypeSmall(), "size": this._appSetting.getImageSizeMedium(), "uploadMethod": "2", "imageData": this.imagePreview };
    //     // console.log("cropimage:",data);
    //       this.croppedImage = data;
    //       this.noImage = false;
    //     let imagePreviewSanitze:any =  this.domSanitizer.bypassSecurityTrustUrl(this.imagePreview)
    //       fetch(imagePreviewSanitze.changingThisBreaksApplicationSecurity)
    //         .then(res => res.blob())
    //         .then(blob => this.blob = blob);
    //       this.imagebyUrl = true;
    //       localStorage.setItem('Image', '2');
    //       this.addForm.get('mapicon').setValue(this.filePathOnServer);
    //       this.imagePreviewloading = false;
    //       this.dropDownContainer = true;
    //     }else if(repsonsedata['httpStatusCode'] == '400'){
    //       this.imagePreviewloading = false;
    //       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
    //     }else{
    //       this.imagePreviewloading = false;
    //     }       
    //   }, err => {
    //     if (err.StatusCode == undefined) {
    //       this.imagePreviewloading = false;
    //     }
    //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    //     this.imagePreviewloading = false;
    //   });
  }

}
