import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

import { IconfigureRule} from '../welcome-rule/IconfigureRule';

@Component({
  selector: 'app-welcome-rule',
  templateUrl: './welcome-rule.component.html',
  styleUrls: ['./welcome-rule.component.scss']
})
export class WelcomeRuleComponent implements OnInit {
  candidateID: any;
  statusList :any;
  loading:boolean=false;
  isStatusSelected:boolean=false;
  //defaultSMS:any;
  public pageLabel:any;
  public IsWelcomeConfigured:number=0;
  public IsKnockoutConfigured:number=0;
  public IsThankyouConfigured:number=0;
  @Input() ApplicationFormId:any;
  @Input() ApplicationFormName:any;
  @Output() cancelDrawer=new EventEmitter();
  submitted:boolean=false;
  configureRuleList:any=[];
  configureRuleTemplateData:any=[];
  configureRuleTemplateSameJobData:any=[];
  emailTemplateData:any=[];
  welcomeTemplateName:any = "Email template for restricting candidates";
  welcomeTemplateNameSameJob:any = "Email template to stop candidate from applying for the same job";
  knockoutTemplateName:any = "Email template for Knocked out candidates";
  thankyouTemplateName:any = "Email template for successful applications";
  public pageNo: number = 1;
  public pageSize;  
  public sortingValue: string = "Title,asc";  
  public searchVal: string = '';
  public TemplateIdCandStatus:any=0;
  public TemplateIdSameJob:any =0;
  public TemplateIdKnockout:any=0;
  public TemplateIdThankyou:any=0;
  public isTemplateActive:boolean = false;
  TemplateSameJob: any;
  TemplateCandStatus: any;
  public configureRuleId:number=0;  
  readioSelected:any=1;
  public defaultCandStatus="Thank you for your application for the  {{Jobs.JobTitle}} at {{Jobs.Company}}. We really appreciate your interest in joining our company and we want to thank you for the time and energy you invested in your application. We received a large number of applications, and after carefully reviewing all of them, unfortunately, we have to inform you that this time we won’t be able to invite you to the next round of our hiring process. Due to the high number of applications we are, unfortunately, not able to provide individual feedback to your application at this early stage of the process. However, we really appreciated your application and you are welcome to apply again at {{Jobs.Company}} in the future. We wish you all the best in your job search.";
  public defaultMsgForSameJob = "Thank you for your job application for the position {{Jobs.JobTitle}}. We would like to inform you that your application {{Jobs.ApplicationReferenceNo}} is already submitted and is under process. We will get back to you when you job application status changes to next stage.";
  public defaultMsgForKnockOut = "Thank you for taking the time to consider {{Jobs.Company}}. Our hiring team reviewed your application and we’d like to inform you that we will not move forward with your application for the [Job_title] position at this time. We encourage you to apply again in the future, if you find an open role at our company that suits you. Thank you again for applying to {{Jobs.Company}} and we wish you all the best in your job search.";
  TemplateKnockout: any;
  TemplateThankyou: any;
  selectedCandidateStatus: any;
  animationVar: any;
  isCanStatusOpen:boolean=false;  
  isSameJobOpen:boolean=false;
  
  isCanStatusMsgOpen:boolean=false;  
  isSameJobMsgOpen:boolean=false;
  defaultTemplateCandStatus: any;
  defaultTemplateSameJob: any;
  defaultTemplateKnockout: any;
  defaultTemplateThankyou: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatExpansionPanel, {static: true}) matExpansionPanelElement: MatExpansionPanel;  
  @ViewChild(MatExpansionPanel, {static: true}) matExpansionPanelSameJobEmailSection: MatExpansionPanel;  
  @ViewChild(MatExpansionPanel, {static: true}) matExpansionPanelEmailSection: MatExpansionPanel;    
  @ViewChild(MatExpansionPanel, {static: true}) matExpansionPanelMsgSection: MatExpansionPanel;
  jobData: any;
  canData: any;
  jobTagData: any;
  canTagData: any;
  alertMessageValue:boolean=false;
  constructor(private appSettingsService: AppSettingsService, public systemSettingService: SystemSettingService,
     private snackBService: SnackBarService,private translateService: TranslateService,private commonService:CommonserviceService,) { 
    this.candidateID = this.appSettingsService.candidateID;
    this.pageSize = this.appSettingsService.pagesize;
  }

  ngOnInit(): void {   
    this.getJobPlaceholderData();
    this.getCanPlaceholderData();
  
    this.commonService.activePageLabelObs.subscribe(res=>{
      this.pageLabel = res;
      if(this.pageLabel=="Welcome_Page"){
        //this.isStatusSelected=true;  
        this.IsWelcomeConfigured = 1;      
        this.searchVal = this.welcomeTemplateName; 
        if(this.isStatusSelected){
          this.defaultCandStatus = "Thank you for your application for the  {{Jobs.JobTitle}} at {{Jobs.Company}}. We really appreciate your interest in joining our company and we want to thank you for the time and energy you invested in your application. We received a large number of applications, and after carefully reviewing all of them, unfortunately, we have to inform you that this time we won’t be able to invite you to the next round of our hiring process. Due to the high number of applications we are, unfortunately, not able to provide individual feedback to your application at this early stage of the process. However, we really appreciated your application and you are welcome to apply again at {{Jobs.Company}} in the future. We wish you all the best in your job search.";       
       }else{
          this.defaultMsgForSameJob =   "Thank you for your job application for the position {{Jobs.JobTitle}}. We would like to inform you that your application {{Jobs.ApplicationReferenceNo}} is already submitted and is under process. We will get back to you when you job application status changes to next stage.";
       }

       }else if(this.pageLabel=="Knockout_Questions"){
        this.IsKnockoutConfigured = 1; 
        
        this.searchVal = this.knockoutTemplateName;
        this.defaultMsgForKnockOut = "Thank you for taking the time to consider {{Jobs.Company}}. Our hiring team reviewed your application and we’d like to inform you that we will not move forward with your application for the {{Jobs.JobTitle}} position at this time. We encourage you to apply again in the future, if you find an open role at our company that suits you. Thank you again for applying to {{Jobs.Company}} and we wish you all the best in your job search."; 
      }else  if(this.pageLabel=="Thank_You"){
       this.IsThankyouConfigured = 1; 
        this.searchVal = this.thankyouTemplateName;
        this.defaultCandStatus = ""; 
        this.defaultMsgForSameJob = ""; 
        this.defaultMsgForKnockOut = "";
      }else{
        this.IsWelcomeConfigured = 0;
        this.IsKnockoutConfigured = 0; 
        this.IsThankyouConfigured = 0; 
        this.defaultCandStatus = ""; 
        this.defaultMsgForSameJob = ""; 
        this.defaultMsgForKnockOut = "";
      }
    })
    setTimeout(() => {
      if(this.pageLabel=="Welcome_Page"){
        this.getCandidateActiveStatus();   
      }
    }, 1000);
    setTimeout(() => {
      this.getConfigureRule();
    }, 1500);
    this.commonService.configueApplicationFormAlertObj.subscribe((res:any)=>{      
      if(res){ 
        this.alertMessageValue = !res?.valid;
       }   
    });

  }

/*
    @Type: File, <ts>
    @Name: add remove animation function
    @Who: Satya Prakash Gupta
    @When: 29-Dec-2022
    @Why: EWM-9629 EWM-9900
    @What: add and remove animation
  */

  mouseoverAnimation(matIconId, animationName) {
  let amin = localStorage.getItem('animation');
  if (Number(amin) != 0) {
    document.getElementById(matIconId)?.classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList.remove(animationName)
  }

 /* 
@Type: File, <ts>
@Name: getCandidateActiveStatus function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: get Status List
*/
getCandidateActiveStatus() {
  this.loading = true;
  this.systemSettingService.getCandidateActiveStatus(this.candidateID).subscribe(
    repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
        this.loading = false;
        this.statusList = repsonsedata['Data'];
        this.statusList?.forEach(element=>{
          element['isSelected'] = 0;
          element['color'] = '';
        })
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}



 /* 
@Type: File, <ts>
@Name: selectStatus function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: select status
*/
public statusData=[];
selectStatus(statusData){ 
  if(statusData.isSelected==1){
    statusData.isSelected = 0;
    statusData.color = '';
    this.isStatusSelected = false;
    const items = this.statusList?.filter(item => item.Id.indexOf(statusData.Id) !== -1);
    items[0].isSelected = 0;
    items[0].color = '';
  }else{
    const items = this.statusList?.filter(item => item.Id.indexOf(statusData.Id) !== -1);
    items[0].isSelected = 1;
    items[0].color = 'primary';
  } 
  this.statusData = [];
 let data = this.statusList.filter(res => res.isSelected === 1);
 data?.forEach(element => {
  this.statusData.push({'StatusName':element.Description,'StatusId':element.Id});
 });
 
      if(data?.length>0){
        this.isStatusSelected = true;
      }else{
        this.isStatusSelected = false;
      }
    if(this.isStatusSelected && data?.length<=1){
      if(this.TemplateIdCandStatus!=0){
        this.searchVal = this.welcomeTemplateName;
        this.getConfigureRuleTemplate(this.TemplateIdCandStatus);
      }else{
        this.isTemplateActive=true;
        this.searchVal = this.welcomeTemplateName;
        this.emailTemplatesList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
      }
      this.defaultCandStatus = "Thank you for your application for the  {{Jobs.JobTitle}} at {{Jobs.Company}}. We really appreciate your interest in joining our company and we want to thank you for the time and energy you invested in your application. We received a large number of applications, and after carefully reviewing all of them, unfortunately, we have to inform you that this time we won’t be able to invite you to the next round of our hiring process. Due to the high number of applications we are, unfortunately, not able to provide individual feedback to your application at this early stage of the process. However, we really appreciated your application and you are welcome to apply again at {{Jobs.Company}} in the future. We wish you all the best in your job search.";       
     }
}


/* 
@Type: File, <ts>
@Name: alertMsgDetails function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: alertMsgDetails 
*/
alertDetails(event){
  this.defaultCandStatus = event.alertMMsg;
  // this.isCanStatusOpen = false;
  // this.isCanStatusMsgOpen = false;
  //this.matExpansionPanelMsgSection.close();
}

/* 
@Type: File, <ts>
@Name: alertMsgSameJobDetails function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: alertMsgSameJobDetails 
*/
alertMsgSameJobDetails(event){
  this.defaultMsgForSameJob = event.alertMMsg;
  //this.isSameJobMsgOpen = false;
  //this.matExpansionPanelElement.close();
}

/* 
@Type: File, <ts>
@Name: alertMsgSameJobDetails function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: alertMsgSameJobDetails 
*/
alertMsgKnockOutDetails(event){
  this.defaultMsgForKnockOut = event.alertMMsg;
  // this.matExpansionPanelElement.close();
  // this.isSameJobMsgOpen = false;
}

/* 
@Type: File, <ts>
@Name: emailDetails function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: emailDetails 
*/
emailDetails(event){
  this.TemplateCandStatus = event.emailTemplateData;
  if(this.TemplateIdCandStatus==0){
    this.defaultTemplateCandStatus = event.emailTemplateData;
  }  
  //this.isCanStatusOpen = false;
  //this.matExpansionPanelEmailSection.close();
}

/* 
@Type: File, <ts>
@Name: emailSameJobDetails function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: emailSameJobDetails 
*/
emailSameJobDetails(event){  

  //this.isSameJobOpen = false;
  if(this.pageLabel=="Welcome_Page"){
    this.TemplateSameJob = event.emailTemplateData;
    if(this.TemplateIdSameJob==0){
      this.defaultTemplateSameJob = event.emailTemplateData;
    }
  }else if(this.pageLabel=="Knockout_Questions"){
    this.TemplateKnockout  = event.emailTemplateData;
    if(this.TemplateIdKnockout==0){
      this.defaultTemplateKnockout = event.emailTemplateData;
    }

  }else  if(this.pageLabel=="Thank_You"){
    this.TemplateThankyou = event.emailTemplateData;
    if(this.TemplateIdThankyou==0){
      this.defaultTemplateThankyou = event.emailTemplateData;
    }
  }
  //this.matExpansionPanelSameJobEmailSection.close();

}



/* 
@Type: File, <ts>
@Name: createRequest function
@Who: Suika
@When: 19-dec-2022
@Why: EWM-1732 EWM-9629
@What: createRequest 
*/
public createRequest(): IconfigureRule {    
  let requestData: IconfigureRule = {};
  requestData.Id = this.configureRuleId;
  requestData.ApplicationFormId = this.ApplicationFormId?this.ApplicationFormId:0;
  requestData.ApplicationFormName=this.ApplicationFormName;
  if(this.pageLabel=="Welcome_Page"){
    requestData.CandidateStatus=this.statusData?.length>0?this.statusData:null;
    requestData.IsWelcomeConfigured= 1;//this.IsWelcomeConfigured;
    requestData.TemplateIdCandStatus=this.TemplateIdCandStatus!=0?this.TemplateIdCandStatus:0;
    if(this.TemplateIdCandStatus==0 && this.IsWelcomeConfigured==0){
      delete this.TemplateCandStatus?.Id;
     // this.TemplateCandStatus['Id']=0;
     delete this.defaultTemplateCandStatus?.Id;
    } 
    if(this.TemplateIdCandStatus==0 && this.IsWelcomeConfigured==1){   
     delete this.defaultTemplateCandStatus?.Id;
    } 
    if(this.isStatusSelected){
      requestData.TemplateCandStatus=this.TemplateIdCandStatus!=0?this.TemplateCandStatus:this.defaultTemplateCandStatus;
      requestData.AlertMessageCandStatus=this.defaultCandStatus;
    }   
    requestData.TemplateIdSameJob=this.TemplateIdSameJob!=0?this.TemplateIdSameJob:0;
    if(this.TemplateIdSameJob==0 && this.IsWelcomeConfigured==0){
      delete this.TemplateSameJob?.Id;
      //this.TemplateSameJob['Id']=0;
      delete this.defaultTemplateSameJob?.Id;
    } 
    if(this.TemplateIdSameJob==0 && this.IsWelcomeConfigured==1){     
      delete this.defaultTemplateSameJob?.Id;
    } 
    requestData.TemplateSameJob=this.TemplateIdSameJob!=0?this.TemplateSameJob:this.defaultTemplateSameJob;
    requestData.AlertMessageSameJob=this.defaultMsgForSameJob;
  }else if (this.pageLabel=="Knockout_Questions"){   
    requestData.IsKnockoutConfigured= 1;//this.IsKnockoutConfigured;
    requestData.TemplateIdKnockout=this.TemplateIdKnockout?this.TemplateIdKnockout:0;
    if(this.TemplateIdKnockout==0  && this.IsKnockoutConfigured==0){
      delete this.TemplateSameJob?.Id;
      delete this.defaultTemplateKnockout?.Id;
    } 
    if(this.TemplateIdKnockout==0  && this.IsKnockoutConfigured==1){     
      delete this.defaultTemplateKnockout?.Id;
    }   
    requestData.TemplateKnockout=this.TemplateIdKnockout!=0?this.TemplateKnockout:this.defaultTemplateKnockout;
    requestData.AlertMessageKnockout=this.defaultMsgForKnockOut;
  }else{
    requestData.IsThankyouConfigured = 1;// this.IsThankyouConfigured;
    if(this.TemplateIdThankyou==0  && this.IsThankyouConfigured==0){
      delete this.TemplateIdThankyou?.Id;
      delete this.defaultTemplateThankyou?.Id;
    }
    if(this.TemplateIdThankyou==0  && this.IsThankyouConfigured==1){     
      delete this.defaultTemplateThankyou?.Id;
    } 
       
    requestData.TemplateIdThankyou=this.TemplateIdThankyou!=0?this.TemplateIdThankyou:0;
    requestData.TemplateThankyou=this.TemplateIdThankyou!=0?this.TemplateThankyou:this.defaultTemplateThankyou;
    requestData.SendApplicationAttachment=this.readioSelected;
  }
  return requestData;
}


/* 
   @Type: File, <ts>
   @Name: configureRule function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For saving configureRule data
  */
 configureRule(): void{
    this.submitted = true;
    this.loading = true; 
     //return;
    const configureRequest = JSON.stringify(this.createRequest())
    this.systemSettingService.configureRule(configureRequest).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false; 
          //this.cancelDrawer.emit(true); 
         /* this.TemplateSameJob={};
          this.TemplateCandStatus={};
          this.configureRuleTemplateSameJobData = [];
          this.configureRuleTemplateData = []; */
          //this.getConfigureRule();
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
               
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



/* 
   @Type: File, <ts>
   @Name: getConfigureRule function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For get configureRule data
  */
 getConfigureRule(){
    this.loading = true; 
    this.systemSettingService.getConfigureRule(this.ApplicationFormId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;  
          this.configureRuleList.push(repsonsedata.Data); 
          this.configureRuleId = repsonsedata.Data.Id;
          this.readioSelected = repsonsedata.Data.SendApplicationAttachment;
          this.isTemplateActive=true;         
          if(this.pageLabel=="Welcome_Page"){
            this.selectedCandidateStatus = repsonsedata.Data.CandidateStatus; 
            if(this.selectedCandidateStatus?.length>0){
              this.isStatusSelected=true;          
                 this.selectedCandidateStatus?.forEach(x => {
                   const items = this.statusList?.filter(item => item.Id.indexOf(x.StatusId) !== -1);
                   items[0].isSelected = 1;
               });
              this.statusData = this.selectedCandidateStatus;
             }
            this.TemplateIdCandStatus = repsonsedata.Data.TemplateIdCandStatus; 
            this.TemplateIdSameJob = repsonsedata.Data.TemplateIdSameJob; 
            this.IsWelcomeConfigured = repsonsedata.Data.IsWelcomeConfigured;
            this.defaultMsgForSameJob =  repsonsedata.Data.AlertMessageSameJob?repsonsedata.Data.AlertMessageSameJob:this.defaultMsgForSameJob;
            this.defaultCandStatus =  repsonsedata.Data.AlertMessageCandStatus?repsonsedata.Data.AlertMessageCandStatus:this.defaultCandStatus;        
          }else if(this.pageLabel=="Knockout_Questions"){
            this.TemplateIdKnockout = repsonsedata.Data.TemplateIdKnockout;
            this.IsKnockoutConfigured = repsonsedata.Data.IsKnockoutConfigured;
            this.defaultMsgForKnockOut =  repsonsedata.Data.AlertMessageKnockout?repsonsedata.Data.AlertMessageKnockout:this.defaultMsgForKnockOut;
          }else if(this.pageLabel=="Thank_You"){
            this.TemplateIdThankyou = repsonsedata.Data.TemplateIdThankyou; 
            this.IsThankyouConfigured = repsonsedata.Data.IsThankyouConfigured;
          }
          this.setConfigureRuleEmailTemplate();
        }else if (repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.configureRuleList = [];
          this.isTemplateActive=true;
          this.setConfigureRuleEmailTemplate();
          //this.getConfigureTemplateData();
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

/* 
   @Type: File, <ts>
   @Name: setConfigureRuleEmailTemplate function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For set configureRule template data
  */

setConfigureRuleEmailTemplate(){
  if(this.pageLabel=="Welcome_Page"){
    if(this.isStatusSelected){
      this.getWelcomePageCanStatusTemplate();
    }   
    this.getWelcomePageTemplate();
   }else if(this.pageLabel=="Knockout_Questions"){
    this.getKnockoutPageTemplate();
   }else if(this.pageLabel=="Thank_You"){
    this.getThankYouPageTemplate();
  }

}

/* 
   @Type: File, <ts>
   @Name: getWelcomePageCanStatusTemplate function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For get welcome template data
  */
 getWelcomePageCanStatusTemplate(){ 
    if(this.TemplateIdCandStatus==0 && this.IsWelcomeConfigured==0){
    this.searchVal = this.welcomeTemplateName;       
    this.emailTemplatesList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }else if(this.TemplateIdCandStatus==0 && this.IsWelcomeConfigured==1){
      this.searchVal = this.welcomeTemplateName;       
      this.emailTemplatesList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }else if(this.TemplateIdCandStatus!=0 && this.IsWelcomeConfigured==1){
      //console.log('dd');
      this.getConfigureRuleTemplate(this.TemplateIdCandStatus);
    }else{
      this.searchVal = this.welcomeTemplateName;       
      this.emailTemplatesList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);    
  }
}

/* 
   @Type: File, <ts>
   @Name: getWelcomePageTemplate function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For get welcome template data
  */
getWelcomePageTemplate(){ 
    if(this.TemplateIdSameJob==0 && this.IsWelcomeConfigured==0){
      this.searchVal = this.welcomeTemplateNameSameJob;       
      this.emailTemplatesSameJobList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
      }else if(this.TemplateIdSameJob==0 && this.IsWelcomeConfigured==1){
        this.searchVal = this.welcomeTemplateNameSameJob;       
        this.emailTemplatesSameJobList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
      }else if(this.TemplateIdSameJob!=0 && this.IsWelcomeConfigured==1){
        this.getConfigureRuleSameJobTemplate(this.TemplateIdSameJob);
      }else{
        this.searchVal = this.welcomeTemplateNameSameJob;       
        this.emailTemplatesSameJobList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
      }
}


/* 
   @Type: File, <ts>
   @Name: getKnockoutPageTemplate function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For get welcome template data
  */
getKnockoutPageTemplate(){
  this.IsKnockoutConfigured = 1;
  if(this.TemplateIdKnockout==0 && this.IsKnockoutConfigured==0){
    this.searchVal = this.knockoutTemplateName;       
    this.emailTemplatesKnockoutList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }else if(this.TemplateIdKnockout==0 && this.IsKnockoutConfigured==1){
      this.searchVal = this.knockoutTemplateName;       
      this.emailTemplatesKnockoutList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }else if(this.TemplateIdKnockout!=0 && this.IsKnockoutConfigured==1){
      this.getConfigureRuleSameJobTemplate(this.TemplateIdKnockout);
    }else{
      this.searchVal = this.knockoutTemplateName;       
      this.emailTemplatesKnockoutList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }
}

/* 
   @Type: File, <ts>
   @Name: getThankYouPageTemplate function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For get welcome template data
  */
getThankYouPageTemplate(){
  this.IsThankyouConfigured = 1;
  if(this.TemplateIdThankyou==0 && this.IsThankyouConfigured==0){
    this.searchVal = this.thankyouTemplateName;       
    this.emailTemplatesThankyouList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }else if(this.TemplateIdThankyou==0 && this.IsThankyouConfigured==1){
      this.searchVal = this.thankyouTemplateName;       
      this.emailTemplatesThankyouList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }else if(this.TemplateIdThankyou!=0 && this.IsThankyouConfigured==1){
      this.getConfigureRuleSameJobTemplate(this.TemplateIdThankyou);
    }else{
      this.searchVal = this.thankyouTemplateName;       
      this.emailTemplatesThankyouList(this.pageNo,this.pageSize,this.sortingValue,this.searchVal);
    }
}



/* 
   @Type: File, <ts>
   @Name: getConfigureRuleTemplate function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For get configureRule template data
  */
 getConfigureRuleTemplate(templateId){
  this.loading = true;
  this.systemSettingService.getConfigureRuleTemplate(templateId).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false; 
        this.configureRuleTemplateData.push(repsonsedata.Data); 
        this.TemplateCandStatus = this.configureRuleTemplateData[0];   
        this.isTemplateActive=true;
      }else if (repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        if(this.isStatusSelected){
          this.configureRuleTemplateData = [];
        }
        this.isTemplateActive=true;
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


/* 
   @Type: File, <ts>
   @Name: getConfigureRuleTemplate function
   @Who: Suika
   @When: 25-Dec-2022
   @Why: EWM-1732,EWM-9629
   @What: For get configureRule template data
  */
 getConfigureRuleSameJobTemplate(templateId){
  this.loading = true;
  this.systemSettingService.getConfigureRuleTemplate(templateId).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
       
          this.configureRuleTemplateSameJobData.push(repsonsedata.Data);
          if(this.pageLabel=="Welcome_Page"){
            this.TemplateSameJob = this.configureRuleTemplateSameJobData[0];   
            //this.TemplateSameJob.Id = this.TemplateIdSameJob;
            //this.defaultTemplateSameJob = this.configureRuleTemplateSameJobData[0]; 
          }else if(this.pageLabel=="Knockout_Questions"){
            this.TemplateKnockout = this.configureRuleTemplateSameJobData[0]; 
            //this.defaultTemplateKnockout = this.configureRuleTemplateSameJobData[0]; 
          }else if(this.pageLabel=="Thank_You"){
             this.TemplateThankyou = this.configureRuleTemplateSameJobData[0]; 
            // this.defaultTemplateThankyou = this.configureRuleTemplateSameJobData[0];
          }
         
          //this.TemplateSameJob = this.configureRuleTemplateSameJobData[0];          
          this.isTemplateActive=true;
      }else if (repsonsedata.HttpStatusCode === 204) {
        this.loading = false;       
        this.configureRuleTemplateSameJobData = [];
        this.isTemplateActive=true;
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



/*
    @Name: emailTemplatesList function
    @Who: Suika
    @When: 20-Dec-2022
    @Why: ROST-1732 ROST-9629
    @What: list of templates data
     */
    emailTemplatesList(pagesize, pagneNo, sortingValue,searchVal)
    {
      this.loading=true;
      this.configureRuleTemplateData = [];
      this.systemSettingService.fetchJobEmailTemplatesList(pagesize, pagneNo, sortingValue,searchVal).subscribe(
        (repsonsedata:ResponceData)=>{     
          if(repsonsedata.HttpStatusCode===200)
          {
            this.isTemplateActive=true;
            this.loading=false;
            let defaultTemplateData = {};
            this.emailTemplateData=repsonsedata.Data;
            this.emailTemplateData?.forEach(element=>{
              element['CheckboxStatus'] = false;
              element['TemplateName'] = element.Title;
              defaultTemplateData['Id'] = this.TemplateIdCandStatus;
              defaultTemplateData['TemplateName'] = element.Title;
              defaultTemplateData['Subject'] = element.Subject;
              defaultTemplateData['CcEmail'] = element.CcEmail;
              defaultTemplateData['BccEmail'] = element.BccEmail;
              defaultTemplateData['TemplateText'] = element.TemplateText;
              defaultTemplateData['Files'] = element.Files?.length>0?element.Files:null;
            }) 
            this.configureRuleTemplateData = this.emailTemplateData;
             if(this.TemplateIdCandStatus==0){
              this.defaultTemplateCandStatus =  defaultTemplateData; 
             }else{
             // this.TemplateCandStatus =  defaultTemplateData;
             }
                 
          }else if(repsonsedata.HttpStatusCode===204){
            this.emailTemplateData= [];
            this.configureRuleTemplateData = this.emailTemplateData;
            this.loading=false;   
            this.isTemplateActive=true;        
          }else
          {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading=false;
          }
        },err=>{
          this.loading=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         
          })
    }

    emailTemplatesSameJobList(pagesize, pagneNo, sortingValue,searchVal)
    {
      this.loading=true;
      this.systemSettingService.fetchJobEmailTemplatesList(pagesize, pagneNo, sortingValue,searchVal).subscribe(
        (repsonsedata:ResponceData)=>{     
          if(repsonsedata.HttpStatusCode===200)
          {
            this.isTemplateActive=true;
            this.loading=false;
            let defaultTemplateData = {};
            this.emailTemplateData=repsonsedata.Data;
            this.emailTemplateData?.forEach(element=>{
              element['CheckboxStatus'] = false;
              element['TemplateName'] = element.Title;
              defaultTemplateData['Id'] = this.TemplateIdSameJob;
              defaultTemplateData['TemplateName'] = element.Title;
              defaultTemplateData['Subject'] = element.Subject;
              defaultTemplateData['CcEmail'] = element.CcEmail;
              defaultTemplateData['BccEmail'] = element.BccEmail;
              defaultTemplateData['TemplateText'] = element.TemplateText;
              defaultTemplateData['Files'] = element.Files?.length>0?element.Files:null;
             
            
            })         
            this.configureRuleTemplateSameJobData = this.emailTemplateData;           
             if(this.TemplateIdSameJob==0){
              this.defaultTemplateSameJob =  defaultTemplateData; 
             }else{
             // this.TemplateSameJob =  defaultTemplateData;
             }
          }else if(repsonsedata.HttpStatusCode===204){
            this.emailTemplateData= [];
            this.configureRuleTemplateSameJobData = this.emailTemplateData;
            this.loading=false;   
            this.isTemplateActive=true;        
          }else
          {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading=false;
          }
        },err=>{
          this.loading=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         
          })
    }

    emailTemplatesKnockoutList(pagesize, pagneNo, sortingValue,searchVal)
    {
      this.loading=true;
      this.systemSettingService.fetchJobEmailTemplatesList(pagesize, pagneNo, sortingValue,searchVal).subscribe(
        (repsonsedata:ResponceData)=>{     
          if(repsonsedata.HttpStatusCode===200)
          {
            this.isTemplateActive=true;
            this.loading=false;
            let defaultTemplateData = {};
            this.emailTemplateData=repsonsedata.Data;
            this.emailTemplateData?.forEach(element=>{
              element['CheckboxStatus'] = false;
              element['TemplateName'] = element.Title;
              defaultTemplateData['Id'] = this.TemplateIdKnockout;
              defaultTemplateData['TemplateName'] = element.Title;
              defaultTemplateData['Subject'] = element.Subject;
              defaultTemplateData['CcEmail'] = element.CcEmail;
              defaultTemplateData['BccEmail'] = element.BccEmail;
              defaultTemplateData['TemplateText'] = element.TemplateText;
              defaultTemplateData['Files'] = element.Files?.length>0?element.Files:null;
             
            
            }) 
            this.configureRuleTemplateSameJobData = this.emailTemplateData;           
             if(this.TemplateIdKnockout==0){
              this.defaultTemplateKnockout =  defaultTemplateData; 
             }else{
             // this.TemplateKnockout =  defaultTemplateData;
             }   
          }else if(repsonsedata.HttpStatusCode===204){
            this.emailTemplateData= [];
            this.configureRuleTemplateSameJobData = this.emailTemplateData;
            this.loading=false;   
            this.isTemplateActive=true;        
          }else
          {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading=false;
          }
        },err=>{
          this.loading=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         
          })
    }
    
    emailTemplatesThankyouList(pagesize, pagneNo, sortingValue,searchVal)
    {
      this.loading=true;
      this.systemSettingService.fetchJobEmailTemplatesList(pagesize, pagneNo, sortingValue,searchVal).subscribe(
        (repsonsedata:ResponceData)=>{     
          if(repsonsedata.HttpStatusCode===200)
          {
            this.isTemplateActive=true;
            this.loading=false;
            let defaultTemplateData = {};
            this.emailTemplateData=repsonsedata.Data;
            this.emailTemplateData?.forEach(element=>{
              element['CheckboxStatus'] = false;
              element['TemplateName'] = element.Title;
              defaultTemplateData['Id'] = this.TemplateIdThankyou;
              defaultTemplateData['TemplateName'] = element.Title;
              defaultTemplateData['Subject'] = element.Subject;
              defaultTemplateData['CcEmail'] = element.CcEmail;
              defaultTemplateData['BccEmail'] = element.BccEmail;
              defaultTemplateData['TemplateText'] = element.TemplateText;
              defaultTemplateData['Files'] = element.Files?.length>0?element.Files:null;
            }) 
            this.configureRuleTemplateSameJobData = this.emailTemplateData;           
             if(this.TemplateIdThankyou==0){
              this.defaultTemplateThankyou =  defaultTemplateData; 
             }else{
             // this.TemplateThankyou =  defaultTemplateData;
             }   
          }else if(repsonsedata.HttpStatusCode===204){
            this.emailTemplateData= [];
            this.configureRuleTemplateSameJobData = this.emailTemplateData;
            this.loading=false;   
            this.isTemplateActive=true;        
          }else
          {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading=false;
          }
        },err=>{
          this.loading=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         
          })
    }

    onCancel(){
      this.cancelDrawer.emit(true);
    }

    getValue(val){
      this.readioSelected = val;
    }

    closeSameJobMsgSection(val){
     //this.matExpansionPanelElement.close();
     this.isSameJobMsgOpen = false;
    }

    closeSameJobEmailSection(val){
      this.matExpansionPanelSameJobEmailSection.close();
      this.isSameJobOpen = false;
    }

    closeEmailSection(val){
      this.matExpansionPanelEmailSection.close();
      this.isCanStatusOpen = false;
    }
    closeMsgSection(val){
      //this.matExpansionPanelMsgSection.close();
       this.isCanStatusMsgOpen = false;
    }


    getJobPlaceholderData(){
      this.systemSettingService.getPlaceholderByType('Jobs').subscribe(
        respdata => {
          if (respdata['Data']) {
            this.jobTagData = respdata['Data'];
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }
  
    getCanPlaceholderData(){
      this.systemSettingService.getPlaceholderByType('Candidate').subscribe(
        respdata => {
          if (respdata['Data']) {
            this.canTagData = respdata['Data'];
          } 
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }
  

}
