/*
@(C): Entire Software
@Type: File, <html>
@Who: Anup Singh
@When: 20-April-2022
@Why: EWM-4945
@What:  This page wil be use only for email preview Component TS
*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ClientService } from '../../../shared/services/client/client.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-email-preview-popup',
  templateUrl: './email-preview-popup.component.html',
  styleUrls: ['./email-preview-popup.component.scss']
})
export class EmailPreviewPopupComponent implements OnInit {
  subjectName:string='';
  candName="{{Candidate.Name}}";
  job="{{job.Name}}";
  company="{{Jobs.Company}}";
  emailtemplateData:any;
  resEmailtemplateData:any;
  resSubjectName:string='';
  loading:boolean=false;
  ReplaceTag=[];
  isActivity:boolean=false;
  isMailActive:boolean=false;
  XeopleSearchCandidateMail:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
  private textChangeLngService: TextChangeLngService, private jobService: JobService, private route: Router,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
     private profileInfoService: ProfileInfoService,private _appSetting: AppSettingsService,private clientService: ClientService,) { 
     this.subjectName = data?.subjectName;
     this.emailtemplateData = data?.emailTemplateData     
     // @suika @whn 29-03-2023 @why dynamic email template preview data for activity section
    this.isActivity = data?.isActivity;
    this.isMailActive = data?.isMailActive;
    this.XeopleSearchCandidateMail=data?.XeopleSearchgridMail;    
    if(data?.isActivity!=undefined){
      this.subjectName = data?.subjectName;
      this.emailtemplateData = data?.emailTemplateData;
      this.ReplaceTag.push({"Id":data?.RelatedUserId,"ObjectType": data?.RelatedUserType})
      if(data?.CandidateId!='' && data?.CandidateId!=null && data?.CandidateId!=undefined && this.data.openDocumentPopUpFor =='Candidate'){
        this.ReplaceTag.push({"Id":data?.CandidateId,"ObjectType":'CAND'})        
        //@suika @whn 03-05-2023
      }else if(data?.JobId!='' && data?.JobId!=null && data?.JobId!=undefined && this.data.openDocumentPopUpFor =='JOB'){
        this.ReplaceTag.push({"Id":data?.JobId,"ObjectType":'JOB'});        
      }
    }
    if(data?.isMailActive!=undefined){
      this.subjectName = data?.subjectName;
      this.emailtemplateData = data?.emailTemplateData;
      if(data?.JobId!='' && data?.JobId!=null && data?.JobId!=undefined){
        this.ReplaceTag.push({"Id":data?.JobId,"ObjectType":'JOB'},{"Id":data?.caldidateJobMappedPreviewEmail,"ObjectType":'CAND'})
      }
      if(data?.CandidateId!='' && data?.CandidateId!=null && data?.CandidateId!=undefined && this.data.openDocumentPopUpFor =='Candidate'){        
        this.ReplaceTag.push({"Id":data?.CandidateId,"ObjectType":'CAND'})
      }
      if(data?.CandidateId!='' && data?.CandidateId!=null && data?.CandidateId!=undefined && this.data.openDocumentPopUpFor =='Employee'){
        this.ReplaceTag.push({"Id":data?.CandidateId,"ObjectType":'EMPL'})
      }
      if(data?.CandidateId!='' && data?.CandidateId!=null && data?.CandidateId!=undefined && this.data.openDocumentPopUpFor =='Client'){
        this.ReplaceTag=[];
        this.ReplaceTag.push({"Id":data?.CandidateId,"ObjectType":'CLIE'})
        if(data?.JobClientId){
          this.ReplaceTag.push({"Id":data?.JobClientId,"ObjectType":'JOB'})
        }
      }

      if(data?.CandidateId!='' && data?.CandidateId!=null && data?.CandidateId!=undefined && this.data.openDocumentPopUpFor =='Contact'){
        this.ReplaceTag=[];
        this.ReplaceTag.push({"Id":data?.CandidateId,"ObjectType":'CONT'})
        if(data?.JobClientId){
          this.ReplaceTag.push({"Id":data?.JobClientId,"ObjectType":'JOB'})
        }
      }
     
    }
    if (data?.candidateEmail) { //by maneesh this condition use for when select candidate and send single and bulk email only single candidate sp send replace tag data
      this.ReplaceTag.push({"Id":data?.emailToCount[0]?.CandidateId,"ObjectType":'CAND'});
    }
    }

  ngOnInit(): void {
    this.emailPreviewData();
  }


  /* 
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Anup Singh
  @When: 20-April-2022
  @Why: EWM-4945
  @What: for close popup.
*/
onClose(): void {
  document.getElementsByClassName("emailPreview")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("emailPreview")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({ resType: false }); }, 200);
}


  /*
  @Type: File, <ts>
  @Name: emailPreviewData function
  @Who: Suika
  @When: 29-Jan-2023
  @Why: EWM-11481
  @What: email preview list data list data
*/

emailPreviewData() {
  this.loading=true;
  let previewObj = [];
  let mailObj = {};
  mailObj['Subject']=this.subjectName;
  mailObj['Body']=this.emailtemplateData;  
  if ((this.data?.emailToCount?.length>1 || this.data?.emailToCount?.length==0) && !this.XeopleSearchCandidateMail) { //by maneesh ewm-16783
    this.ReplaceTag=[];
  }else if((this.data?.XeopleSearchCandidates?.length>1 || this.data?.XeopleSearchCandidates?.length==0) && !this.XeopleSearchCandidateMail){
    this.ReplaceTag=[];
  }
  previewObj.push({Preview:mailObj,ReplaceTag:this.ReplaceTag});
  this.clientService.getEmailPreviewData(previewObj[0]).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.resSubjectName = repsonsedata.Data.Subject;
        this.resEmailtemplateData = repsonsedata.Data.Body;
        this.loading = false;       
      }else if(repsonsedata.HttpStatusCode === 204){
        this.loading = false;
      } else {
        this.loading = false;

        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

}
