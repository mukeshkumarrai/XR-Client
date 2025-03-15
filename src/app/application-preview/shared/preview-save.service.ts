/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: preview-save.component.ts
 @Who: Renu
 @When: 17-06-2022
 @Why: ROST-7151 EWM-7233
 @What: common service to save data for sharing between components
 */

import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Actions } from '../interface/actions';
import {documentInfo} from '../interface/applicationInfo';
import { UploadDocsComponent } from '../upload-docs/upload-docs.component';
import { ActionserviceService } from './actionservice.service';


@Injectable({
  providedIn: 'root'
})

export class PreviewSaveService {
  

  onCandidateExistsInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentCandidateExistsInfo = this.onCandidateExistsInfo.asObservable();

  onResumeUploadInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ononResumeUploadInfoChange = this.onResumeUploadInfo.asObservable();

  private actions: Actions;

  onpersonalInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public personalInfoChange = this.onpersonalInfo.asObservable();

  ondocumentInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public ondocumentInfoChange = this.ondocumentInfo.asObservable();

  onknockOutInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onknockOutInfoChange = this.onknockOutInfo.asObservable();
  
  onIsAutoFillInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onIsAutoFillInfoChange = this.onIsAutoFillInfo.asObservable();

  onJobInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onJobInfoChange = this.onJobInfo.asObservable();

  konckoutStatus: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public konckoutStatusChange = this.konckoutStatus.asObservable();

  welcomePageInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public welcomePageInfoChange = this.welcomePageInfo.asObservable();
  
  stepperConfigInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public stepperConfigInfoChange = this.stepperConfigInfo.asObservable();

  resumeUploadInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public resumeUploadInfoChange = this.resumeUploadInfo.asObservable();

  coverLetterInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public coverLetterInfoChange = this.coverLetterInfo.asObservable();

  IsResumeInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public IsResumeInfoChange = this.IsResumeInfo.asObservable();

  @ViewChild('UploadDocsComponent') UploadDocsComponent:UploadDocsComponent;
  
  parsedResumeInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public parsedResumeInfoChange = this.parsedResumeInfo.asObservable();

  orgName: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public orgNameChange = this.orgName.asObservable();
 
  successMsg: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public successMsgChange = this.successMsg.asObservable();
  
  goNextStep: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public goNextStepChange = this.goNextStep.asObservable();

  typeResumeSelectedInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public typeResumeSelectedInfoChange = this.typeResumeSelectedInfo.asObservable();
  
  constructor(private actionsService: ActionserviceService) { 
    this.actions = this.actionsService.constants;
  }

  setActionRunnerFn(action: string, value: any) {
    this.processAction(action, value);
  }
  processAction = async (action: string, data: any) => {
    // console.log("action",action);
    // console.log("data",data);
    switch (true) {
      case (action === this.actions.DOCUMENT_INFO):
        this.ondocumentInfo.next(data);
        break;
      
      case (action === this.actions.PERSONAL_INFO):
        this.onpersonalInfo.next(data);
        break;

        case (action === this.actions.KNOCK_OUT):
          this.onknockOutInfo.next(data);
          break;
    }
  }
}
