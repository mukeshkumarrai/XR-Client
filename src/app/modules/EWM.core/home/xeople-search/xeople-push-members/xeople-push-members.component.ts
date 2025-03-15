/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Renu
    @When: 18-Sep-2022
    @Why: EWM-13752 EWM-14377
    @What:  This page is Push Notification Details pop up
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { XeopleSearchService } from '../../../shared/services/xeople-search/xeople-search.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ResponceData } from 'src/app/shared/models';
import { pushMailNotification } from '../../../shared/datamodels/xeople-eoh-card';
import { ExcelService } from '../../../shared/services/excel.service';
import { EncryptionDecryptionService } from '@app/shared/services/encryption-decryption.service';
import { ServiceListClass } from '@app/shared/services/sevicelist';


@Component({
  selector: 'app-xeople-push-members',
  templateUrl: './xeople-push-members.component.html',
  styleUrls: ['./xeople-push-members.component.scss']
})
export class XeoplePushMembersComponent implements OnInit {

  addForm: FormGroup;
  loading: boolean;
  resultShow: boolean = false;
  alphaNumericPattern: string;
  public JobDetails: {Id: string,JobTitle:string,Description:string,Location:string,ExpireIn:string};
  HeaderAdditionalDetails: {
    JobReferenceId: string;JobType:string,jobcategory:string
};
  applyJobUrl: string;
  memberInfo:[]=[];
  memberTobePushed: []=[];
  sucessPushedMembers:string[]=[];
  applicationBaseUrl: string;
  loginUser: any;
  notificationUrl: string;
  checkStatus: []=[];
  public ParentSource: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,private excelService: ExcelService,
    private snackBService: SnackBarService,private _appSetting: AppSettingsService,
    public dialogRef: MatDialogRef<XeoplePushMembersComponent>,private commonserviceService: CommonserviceService,
    public dialog: MatDialog, private xeopleSearchService: XeopleSearchService, public _encryptionDecryptionService: EncryptionDecryptionService,
    private translateService: TranslateService,private serviceListClass:ServiceListClass) {
   this.alphaNumericPattern=this._appSetting.getAlphaNumericPattern;
    this.addForm = this.fb.group({
      notificationTitle: ['', [Validators.required,Validators.maxLength(75),Validators.pattern(/^(?:[a-zA-Z0-9\s]+)?$/)]],
      notificationDescription: ['', [Validators.required,Validators.maxLength(160)]],
      applyType:[1]
    });
    this.applicationBaseUrl =  this._appSetting.applicationBaseUrl;
    this.loginUser= JSON.parse(localStorage.getItem('currentUser'));
    this.notificationUrl=this.serviceListClass.jobNotificationUrl;
    this.ParentSource=this._appSetting.SourceCodeParam['EOH'];
  }


  ngOnInit(): void { 
    let URL = localStorage.getItem('redirectUrl'); 
    let URL_AS_LIST = URL.split('/'); 
   
    this.commonserviceService.getFilterInfo.subscribe((data) => {
      this.JobDetails = data?.JobDetails?.HeaderDetails?.JobDetails; 
      this.HeaderAdditionalDetails= data?.JobDetails?.HeaderAdditionalDetails; 
    });  
    this.commonserviceService.xeopleSearchDisabel.subscribe((data) => {
      this.memberInfo=data;
      this.memberTobePushed=data.filter(x=>{
        if(x.MemberId && x.MemberId!='' && (x.Source.toLowerCase()=='eoh')){
          return x;
        }
      })
    });
    const subdomain=localStorage.getItem("tenantDomain"); 
    this.applyJobUrl=this.applicationBaseUrl+'/application/apply?mode=apply&jobId='+this.JobDetails?.Id+'&domain='+subdomain+'&Source='+this.ParentSource+'&AppliedSource=APP&parentSource='+this.ParentSource; 
  }

  // who:Renu,why:ewm-13752 ewm-14377 what:om cancel pupup ,when:19/09/2023

  onDismiss(): void {
    document.getElementsByClassName("view_pushMembers")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("view_pushMembers")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  // who:Renu,why:ewm-13752 ewm-14377 what:for saving data ,when:19/09/2023
  onConfirm(value) {
   
    let checkMemberID=this.memberInfo.filter(x=>x['MemberId'] && x['MemberId']!= '');
    if(checkMemberID?.length===0){
      this.resultShow = true;
      return;
    }
    this.loading = true;
    let pushObj = {};
    let QuickApplyUrl:string='';
    let memberTOPush=[];
    this.memberInfo.forEach(item => {
      if(item['MemberId'] && item['MemberId']!= ''){
        let canObj:{};
        canObj={
          TenantId : this.loginUser?.Tenants[0]?.TenantId, 						
          CandidateId :item['Id'], 						
          JobId :this.JobDetails?.Id,
          MemberId : item['MemberId']
         }
        if(value?.applyType==1){
          let JSONobjEncode=btoa(JSON.stringify(canObj));
          let encryptObj=this._encryptionDecryptionService.encryptData(JSONobjEncode);
          QuickApplyUrl=this.notificationUrl+'?code='+btoa(encryptObj);
          this.applyJobUrl='';
        }else{
          QuickApplyUrl='';
        }
        
        memberTOPush.push({
          "memberId":item['MemberId'], 
          "QuickApplyUrl":QuickApplyUrl,
          "jobApplyUrl":this.applyJobUrl
        })
        return true; 
      }
      return false;
    });
 
    pushObj['MemberDetailList']=memberTOPush;
    pushObj['ApplicationType'] = value?.applyType==1?'QUICKAPPLY':'LINKOUT';
    pushObj['notificationTitle'] = value?.notificationTitle;
    pushObj['notificationDescription'] = value?.notificationDescription;
    pushObj['jobHeader'] = 'Job(s) opportunities matching your profile are waiting for your review and apply in last 7 days.';
    pushObj['jobId'] = this.JobDetails?.Id;
    pushObj['jobTitle'] = this.JobDetails?.JobTitle;
    pushObj['jobDescription'] = '';
    pushObj['jobType'] = this.HeaderAdditionalDetails?.JobType;
    pushObj['jobCategory'] = this.HeaderAdditionalDetails?.jobcategory;
    // pushObj['jobApplyUrl'] = this.applyJobUrl;
    // pushObj['jobDetailUrl'] =this.applyJobUrl;
    pushObj['jobLocation'] =  this.JobDetails?.Location;
    let tempDate=new Date(parseInt(this.JobDetails?.ExpireIn));
    pushObj['jobExpiryDateTime'] =  tempDate?.toISOString();

    this.xeopleSearchService.eohSendpushNotification(pushObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.resultShow = true;
          this.checkStatus=repsonsedata?.Data.filter(x=>x?.DeliveryStatus==true);
          this.sucessPushedMembers=this.memberTobePushed?.filter(o => this.checkStatus?.some(v => v['MemberId'] === o['MemberId']));
          if(this.checkStatus?.length>0){
            this.sendMailNotification();
         }
         
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.resultShow = false;
        } else if(repsonsedata.HttpStatusCode === 403){
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.resultShow = false;
        }
        else {
          this.resultShow = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

   /**** who:Renu, why:ewm-13752 ewm-14378 what:for notification Mail data ,when:19/09/2023****/
  sendMailNotification() {
   let notifiyObj:pushMailNotification=new pushMailNotification();
   notifiyObj.JobId=this.JobDetails?.Id;
   notifiyObj.JobRefNo=this.HeaderAdditionalDetails?.JobReferenceId;
   notifiyObj.JobTitle=this.JobDetails?.JobTitle;
   notifiyObj.MembersDetails= this.sucessPushedMembers?.filter(x => x['MemberId']  && x['MemberId']!='').map((x,i) => {return {
    MemberId:x['MemberId'],
    MemberName:x['Name'],
    EmailId:x['Email'],
    CandidateId:x['Id']
  }}) 

   this.xeopleSearchService.xeoplePushMembers(notifiyObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
  }
 /**** who:Renu, why:ewm-13752 ewm-14378 what:for push memberes excel data ,when:19/09/2023****/
  generatePushMembersExcel() { 
    let downloadInfo:string[]=this.sucessPushedMembers.map((item, i) => Object.assign({}, item, this.checkStatus[i]));
     this.excelService.generateExcel(downloadInfo,'');
   }
}
