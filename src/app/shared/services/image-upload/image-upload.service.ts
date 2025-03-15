/**
   @(C): Entire Software
   @Type: ts
   @Name: image-upload.service.ts
   @Who: Nitin Bhati
   @When: 16-Nov-2020
   @Why: ROST-377
   @What: This file getting data from Server URL
  */
 import { Injectable } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { Observable, Subject } from 'rxjs';
 import { catchError, retry } from 'rxjs/operators';
 import { handleError } from '../../../shared/helper/exception-handler';
import { ServiceListClass } from '../sevicelist';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ResponceData } from '../../models/responce.model';
import { SnackBarService } from '../snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  uploadByUrlMethod$: Observable<any>;
  private uploadByUrlMethodSubject = new Subject<any>();
  profileImagePreview: string;
  profileImage: string;
  imagePreviewStatus: boolean;
  imagePreviewloading: boolean;
  loading: boolean;
  croppedImage: String;
  filePathOnServer: any;
  imagePreview: any;

  constructor(private http:HttpClient,private serviceListClass:ServiceListClass,private _profileInfoService: ProfileInfoService,
    private snackBService: SnackBarService, private translateService: TranslateService) { 
    this.uploadByUrlMethod$ = this.uploadByUrlMethodSubject.asObservable();
  }
/* 
@Type: File, <ts>
@Name: addImageUploadFile Function
@Who:  Renu
@When: 18-Nov-2020
@Why: For submitting the form data with some params
@What: Api call for submitting Image Upload data
*/

addImageUploadFile(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.siteLogoupload,formData).pipe( 
     retry(1),
     catchError(handleError)
   );
  }

  /*
  @Type: File, <ts>
  @Name: system-llok-feel.service.ts
  @Who: Priti Srivastava
  @When: 22-jan-2021
  @Why: EWM-700
  @What: Api call for submitting Image Upload data
*/
addImageByUrl(updateData:any): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.imageUploadByUrl+'?imageUrl='+updateData, '')
    .pipe(
      retry(1),
      catchError(handleError)
    );
}
/*
  @Type: File, <ts>
  @Name: Upload Image Function
  @Who:  Priti Srivastava
  @When: 27-jan-2021
  @Why: EWM 681
  @What: Api call for submitting Image Upload data
  */
 ImageUploadBase64(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.imageUploadByBase64, formData)
    .pipe(
      retry(1),
      catchError(handleError)
    );
}

/*
  @Type: File, <ts>
  @Name: uploadByUrlMethod Function
  @Who:  Renu
  @When: 16-May-2022
  @Why: EWM-6607 EWM-6751
  @What: Api call for uploading by URL 
  */

uploadByUrlMethod(data:String,type:Number) {

  /****
   * type==1 /// withOUT URL
   * type==2 /// with URL
   */
  this.uploadByUrlMethodSubject.next(data);
  let subject = new Subject();
  if(type===1){
    const formData = { 'base64ImageString': data };
     this._profileInfoService.ImageUploadBase64(formData).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.profileImagePreview = "";
          this.profileImage = '';
          this.imagePreviewStatus = false;
          this.profileImage = repsonsedata.Data[0].FilePathOnServer;
          this.profileImagePreview = repsonsedata.Data[0].Preview;
          if (!this.profileImagePreview) {
            this.profileImagePreview = "/assets/user.svg";
          } else {
            this.profileImagePreview;
          }
          localStorage.setItem('Image', '2');
          this.imagePreviewloading = false;
          let dataObj={};
          
          dataObj={filePathOnServer:this.profileImage,imagePreview:this.profileImagePreview}
          subject.next(dataObj);
        }else{
          this.loading = false;
          subject.next(false);
         // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString())
       
        }
     
      }, err => {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
        subject.next(false);
      })
  }else{
    this.addImageByUrl(data).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == 200) {      
         let dataObj={};
          this.croppedImage = data;
          this.filePathOnServer = repsonsedata.Data[0].FilePathOnServer;
         this.imagePreview = repsonsedata.Data[0].Preview;
         dataObj={croppedImage:this.croppedImage,filePathOnServer:this.filePathOnServer,imagePreview:this.imagePreview, SizeOfFile:repsonsedata.Data[0].SizeOfFile}
          subject.next(dataObj);
        }else if(repsonsedata['httpStatusCode'] == '400'){
          this.imagePreviewloading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }else{
          subject.next(false);
          this.imagePreviewloading = false;
        }       
      }, err => {
        if (err.StatusCode == undefined) {
          subject.next(false);
          this.imagePreviewloading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
        subject.next(false);
      });
  }
  return subject;
}

}

