/*
    @(C): Entire Software
    @Type: File, <TS>
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
    @What:  This component is used for image popup advanced feature in kendo editor
 */

import { Component, Inject, Optional } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { NgxFileDropEntry } from "ngx-file-drop";
import { CropperPosition, ImageCroppedEvent } from "ngx-image-cropper";
import { AppSettingsService } from "../../services/app-settings.service";
import { ImageUploadService } from "../../services/image-upload/image-upload.service";
import { SnackBarService } from "../../services/snackbar/snack-bar.service";

@Component({
    selector: 'app-image-upload-kendo-editor-pop',
    templateUrl: './image-upload-kendo-editor-pop.component.html',
    styleUrls: ['./image-upload-kendo-editor-pop.component.scss']
})

export class ImageUploadKendoEditorPopComponent {

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
    public files: NgxFileDropEntry[] = [];
    imagePreview: string;
    imagePreviewStatus: boolean = false;
    title: any;
    localUploadMode:boolean = true;
    urlUploadMode:boolean = false;
    urlUploadFileSize: number;
    whichTypeImageUploaded:string = 'LOCAL';
        
    constructor(public dialogRef: MatDialogRef<ImageUploadKendoEditorPopComponent>, private fb: FormBuilder, public dialog: MatDialog,
        private domSanitizer: DomSanitizer,
        private translateService: TranslateService, private _imageUploadService: ImageUploadService, @Optional()
        @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private snackBService: SnackBarService, private _appSetting: AppSettingsService) {
        this.addForm = this.fb.group({
            mapicon: ['', [RxwebValidators.extension({ extensions: ["jpeg", "gif", "png"] })]],
            mapiconUrl: ['']
        });
        this.fileType = data.type;
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
        this.title = data.title;
    }

    ngOnInit(): void {
    }

    /*
    @Type: File, <ts>
    @Name: ShowHideButton function
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
    @What: use for upload image  via url
    */
    ShowHideButton(value) {
        this.dropDownContainer = value;
        if (value) {
            this.localUploadMode = true;
            this.urlUploadMode = false;
        }
        else{
            this.localUploadMode = false;
            this.urlUploadMode = true;
        }
        this.addForm.get('mapiconUrl').setValue('');
    }

    /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
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
            setTimeout(() => { this.dialogRef.close({ event: this.whichTypeImageUploaded === 'URL' ? 2 : 1, data: this.imagePreview, imageContent: imageContent, uploadByUrl: this.imagePreview}); }, 200);
        }
        else {
            this.snackBService.showErrorSnackBar("Image size is must be less than " + this.fileSizetoShow, '');
        }
    }

    /*
    @Type: File, <ts>
    @Name: checkfileSize function
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
    @What: use for checkfileSize before uploding
    */
    checkfileSize() {
        if (this.urlUploadMode) {
            if (this.imagePreview != undefined && this.imagePreview != null) {
                let padding = 0;
                if (this.imagePreview.endsWith('==')) { padding = 2; }
                else if (this.imagePreview.endsWith('=')) { padding = 1; }
                let str = this.imagePreview.split(',');
                var sizeInBytes = 4 * Math.ceil((str[1].length / 3)) * 0.5624896334383812;
                var sizeInKb = sizeInBytes / 1000;
                if (sizeInKb > this.fileSize) {
                    return false;
                }
    
            }
        }
        else{
            if (this.urlUploadFileSize > this.fileSize) {
                return false;
            }
        }
        return true;
    }

    /*
    @Type: File, <ts>
    @Name: onDismiss function
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
    @What: for closing the popup
    */
    onDismiss() {
        document.getElementsByClassName("myDialogCroppingImage")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("myDialogCroppingImage")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(null) }, 200);
    }

    /*
    @Type: File, <ts>
    @Name: onDismiss function
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
    @What: when image ready to upload
    */
  selectedFiles?: FileList;

    fileChangeEvent(event: any): void {
        if (!this.fileType.includes(event.target.files[0].type.split('/')[1])) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
            event = null;
            this.imageChangedEvent = null;
            return;
        }
        if (event.target.files[0].size > this.fileSize) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
            event = null;
            this.imageChangedEvent = null;
            return;
        }
        this.selectedFiles = event.target.files;
        if (this.selectedFiles) {
            this.localUploadMode = false;
            const file: File | null = this.selectedFiles.item(0);
            this.imageDimensionHidden = false;
            if (file) {
              this.imagePreview = '';
              const reader = new FileReader();
              reader.onload = (e: any) => {
                this.imagePreview = e.target.result;
              };
              reader.readAsDataURL(file);
            }
            this.imageChangedEvent = event;
          }
        
        this.noImage = false;
    }

    /*
    @Type: File, <ts>
    @Name: closeImage function
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
    @What: when image clear data
    */
    closeImage() {
        this.noImage = true;
        this.imageDimensionHidden = true;
        this.croppedImage = '';
        this.imageChangedEvent = null;
        this.localUploadMode = true;
        this.urlUploadMode = false;
        this.imagePreview = null;
        this.whichTypeImageUploaded = null;
    }

    /*
    @Type: File, <ts>
    @Name:uploadImageFileByUrl
    @Who: Adarsh singh
    @When: 28-July-2023
    @Why: EWM-13179 EWM-13223
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
        let result = this._imageUploadService.uploadByUrlMethod(file, 2);
        result.subscribe((res: any) => {
            if (res) {
                this.imagePreviewloading = false;
                this.addForm.get('mapiconUrl').setValue('');
                this.filePathOnServer = res.filePathOnServer;
                this.imagePreview = res.imagePreview;
                this.urlUploadFileSize = res.SizeOfFile;
                this.whichTypeImageUploaded = 'URL';
                let data: any;
                data = {
                    "type": this._appSetting.getImageTypeSmall(), "size": this._appSetting.getImageSizeMedium(),
                    "uploadMethod": "2", "imageData": res.croppedImage
                };
                this.croppedImage = data;
                this.noImage = false;
                let imagePreviewSanitze: any = this.domSanitizer.bypassSecurityTrustUrl(this.imagePreview)
                fetch(imagePreviewSanitze.changingThisBreaksApplicationSecurity)
                    .then(res => res.blob())
                    .then(blob => this.blob = blob);
                this.imagebyUrl = true;
                this.addForm.get('mapicon').setValue(this.filePathOnServer);
                this.imagePreviewloading = false;
                this.dropDownContainer = true;
                this.urlUploadMode = false;
                this.imageDimensionHidden = false;
                
            } else {
                this.imagePreviewloading = false;
            }
        });
    }

     
}