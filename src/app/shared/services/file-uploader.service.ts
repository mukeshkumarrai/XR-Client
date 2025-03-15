import * as _ from 'lodash';

import { Injectable, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
//import { BehaviorSubject } from 'rxjs/BehaviorSubject';
//import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BehaviorSubject } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from './snackbar/snack-bar.service';
import { SystemSettingService } from '../../modules/EWM.core/shared/services/system-setting/system-setting.service';

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress
}

export class FileQueueObject {
  public file: any;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress: number = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(file: any) {
    this.file = file;
  }

  // actions
  public upload = () => { /* set in service */ };
  public cancel = () => { /* set in service */ };
  public remove = () => { /* set in service */ };

  // statuses
  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () => this.status === FileQueueStatus.Pending || this.status === FileQueueStatus.Error;

}


@Injectable()
export class FileUploaderService {

  private _queue: BehaviorSubject<FileQueueObject[]>;
  public _files: FileQueueObject[] = [];
  public fileType: string = "";
  public fileSize: number = 1000;
  public fileSizetoShow: string = '1 KB';
  public maxFileCount: number = 0;
  public maxSize: number = 1000;
  public maxSizetoShow: string = '1 KB';
  public IsUploaded: boolean = false;
  public uploadFileCount: number = 0;
  
  constructor(private http: HttpClient, private _appSetting:AppSettingsService, private translateService: TranslateService, private snackBService: SnackBarService, private systemSettingService:SystemSettingService) {
    this._queue = <BehaviorSubject<FileQueueObject[]>>new BehaviorSubject(this._files);
    this.fileType = _appSetting.getDocumentfileTypeExtralarge();
    this.fileSizetoShow = _appSetting.getDocumentfileSizeExtralarge();
    this.maxFileCount = parseInt(_appSetting.getAttachmentMaxCount());
    this.maxSizetoShow = _appSetting.getAttachmentMaxSize();
    if(this.maxSizetoShow!=undefined){
    if (this.maxSizetoShow.includes('KB')) {
      let str = this.maxSizetoShow.replace('KB', '')
      this.maxSize = Number(str) * 1000;
    }
    else if (this.maxSizetoShow.includes('MB')) {
      let str = this.maxSizetoShow.replace('MB', '')
      this.maxSize = Number(str) * 1000000;
    }
    }
    if(this.fileSizetoShow!=undefined){
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }
  }
  }

  // the queue
  public get queue() {
    return this._queue.asObservable();
  }

  // public events
  public onCompleteItem(queueObj: FileQueueObject, response: any): any {
    return { queueObj, response };
  }

  // public functions
  public addToQueue(data: any, prevFileCount: number, prevFileSize: number) {
    // add file to the queue
    _.each(data, (file: any) => this._addToQueue(file, prevFileCount, prevFileSize));
  }

  public clearQueue() {
    // clear the queue
    this._files = [];
    this._queue.next(this._files);
  }

  public uploadAll() {
    // upload all except already successfull or in progress
    this.IsUploaded = false;
    this.uploadFileCount = 0;

    _.each(this._files, (queueObj: FileQueueObject) => {
      if (queueObj.isUploadable()) {
        this._upload(queueObj);
      }
    });    
  
    return false;
  }

  public checkUploadAll() {
    if(this._files.length === this.uploadFileCount) {
      do {
          if(this._files.length === this.uploadFileCount) {
        
            this.IsUploaded = true;
          }
      } while (this.IsUploaded = false)
    }
  }

  // private functions
  private _addToQueue(file: any, prevFileCount: number, prevFileSize: number) {
    const queueObj = new FileQueueObject(file);

    if(this.maxFileCount >= 0 ) {
      if((this._files.length + prevFileCount) === this.maxFileCount) {
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidAttachmentCount') + ' ' + this.maxFileCount, 'Maximum Attachments');
        return;
      }
    }
   
    let fileType = file.name.split('.').pop();
    if (!this.fileType.includes(fileType)) { 
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidDocumentType'), 'File Type');
      return;
    }

    /* if (file.size > this.fileSize) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidDocumentSize') + ' ' + this.fileSizetoShow, 'File Size');
      return;
    } */

    let duplicateFile = false;
    for (let itr1 = 0; itr1 < this._files.length; itr1++) {
      if(this._files[itr1].file.name === file.name && this._files[itr1].file.size === file.size && this._files[itr1].file.lastModified === file.lastModified) {
        duplicateFile = true;
      }
    }

    let completeSize: number = 0;
    for (let itr1 = 0; itr1 < this._files.length; itr1++) {
      completeSize += this._files[itr1].file.size;
    }
    completeSize += file.size;

    completeSize += prevFileSize;

    if (completeSize > this.maxSize && this.maxSizetoShow != undefined) {
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidAttachmentSize') + ' ' + this.maxSizetoShow, 'Attachments Size');
      return;
    }

    if(duplicateFile) {
      return;
    }

    // set the individual object events
    queueObj.upload = () => this._upload(queueObj);
    queueObj.remove = () => this._removeFromQueue(queueObj);
    queueObj.cancel = () => this._cancel(queueObj);

    // push to the queue
    this._files.push(queueObj);
    
    this._queue.next(this._files);
  }

  private _removeFromQueue(queueObj: FileQueueObject) {
    _.remove(this._files, queueObj);
  }

  private _upload(queueObj: FileQueueObject) {
    // create form data for file

    localStorage.setItem('Image', '1');

    const form = new FormData();
    form.append('file', queueObj.file, queueObj.file.name);
    // form.append('resources', 'templates');

    // upload file and report progress
    const req = new HttpRequest('POST', this.systemSettingService.uploadDocumentFile(), form, {
      reportProgress: true,
    });

    // upload file and report progress
    queueObj.request = this.http.request(req).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this._uploadProgress(queueObj, event);
        } else if (event instanceof HttpResponse) {
          this.uploadFileCount += 1;
          this._uploadComplete(queueObj, event);
          
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          this._uploadFailed(queueObj, err);
        } else {
          // The backend returned an unsuccessful response code.
          this._uploadFailed(queueObj, err);
        }
      }
    );

    return queueObj;

    /* this.systemSettingService.uploadDocumentFile(form).subscribe(
    repsonsedata => {
      
      if (repsonsedata.type === HttpEventType.UploadProgress) {
        this._uploadProgress(queueObj, repsonsedata);
      } else if (repsonsedata instanceof HttpResponse) {
        this._uploadComplete(queueObj, repsonsedata);
        localStorage.setItem('Image', '2');
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        this._uploadFailed(queueObj, err);
      } else {
        // The backend returned an unsuccessful response code.
        this._uploadFailed(queueObj, err);
      }
    }); 

    return queueObj; */
  }

  private _cancel(queueObj: FileQueueObject) {
    // update the FileQueueObject as cancelled
    queueObj.request.unsubscribe();
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Pending;
    this._queue.next(this._files);
  }

  private _uploadProgress(queueObj: FileQueueObject, event: any) {
    // update the FileQueueObject with the current progress
    const progress = Math.round(100 * event.loaded / event.total);
    queueObj.progress = progress;
    queueObj.status = FileQueueStatus.Progress;
    this._queue.next(this._files);
  }

  private _uploadComplete(queueObj: FileQueueObject, response: HttpResponse<any>) {
    // update the FileQueueObject as completed
    queueObj.progress = 100;
    queueObj.status = FileQueueStatus.Success;
    queueObj.response = response;

    this._queue.next(this._files);
    this.onCompleteItem(queueObj, response.body);
    
    // this.checkUploadAll();
  }

  private _uploadFailed(queueObj: FileQueueObject, response: HttpErrorResponse) {
    // update the FileQueueObject as errored
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Error;
    queueObj.response = response;
    this._queue.next(this._files);
  }
}
