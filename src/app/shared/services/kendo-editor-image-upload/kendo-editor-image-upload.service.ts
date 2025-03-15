/*
  @Type: File, <ts>
  @Name: uploadImageFileInBase64  <ts>
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
*/

import { Injectable } from '@angular/core';
import { ImageUploadService } from '../../services/image-upload/image-upload.service';
import { KendoImageUploaderInfo } from '../../../shared/models/kendo-image-uploader';
import { AppSettingsService } from '../app-settings.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class KendoEditorImageUploaderService {
croppedImage: string;
uploadedImage: string;
uploadedImageByUrl: string;
loading: boolean;

    constructor(
        private _imageUploadService: ImageUploadService,
        private appSettingsService: AppSettingsService) { }

/*
  @Type: File, <ts>
  @Name: uploadImageFileInBase64 function
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
  @What: upload image in base64 bit
*/

    uploadImageFileInBase64(value: string) {
        let data = new Observable(observar => {
            let result = this._imageUploadService.uploadByUrlMethod(value, 1);
            result.subscribe((res: any) => {
                if (res) {
                    this.uploadedImage = res.imagePreview;
                    observar.next(this.getImageInfo);
                    observar.complete();
                }
            });
        })
        return data;
    }

/*
  @Type: File, <ts>
  @Name: getImageInfoByURL function
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
  @What: get image info by url
*/

getImageInfoByURL(value: string) {
    this.uploadedImageByUrl = value;
    let data = new Observable(observar => {
        observar.next(this.getImageInfoByUrl);
        observar.complete();
    })
    return data;
}
/*
    @Type: File, <ts>
    @Name: getImageInfo function
    @Who: Adarsh singh
    @When: 1-Aug-2023
    @Why: EWM-13233
    @What: getting image data 
*/
    public get getImageInfo(): KendoImageUploaderInfo {
        return {
            src: this.uploadedImage,
            height: this.appSettingsService.imageUploadConfigForKendoEditor['height'],
            width: this.appSettingsService.imageUploadConfigForKendoEditor['width']
        };
    }

/*
    @Type: File, <ts>
    @Name: getImageInfoByUrl function
    @Who: Adarsh singh
    @When: 1-Aug-2023
    @Why: EWM-13233
    @What: getting image data 
*/
    public get getImageInfoByUrl(): KendoImageUploaderInfo {
        return {
            src: this.uploadedImageByUrl,
            height: this.appSettingsService.imageUploadConfigForKendoEditor['height'],
            width: this.appSettingsService.imageUploadConfigForKendoEditor['width']
        };
    }
}

 