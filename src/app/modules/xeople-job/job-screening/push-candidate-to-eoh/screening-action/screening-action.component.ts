import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { ResponceData } from '@app/shared/models/responce.model';
import { ServiceListClass } from '@app/shared/services/sevicelist';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { PushCandidatePageType } from '../pushCandidate-model';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { ActionsTab, JobScreening, JobScreeningStatus } from '@app/shared/models/job-screening';
import { JobActionsStoreService } from '@app/shared/services/commonservice/job-actions-store.service';
import { JobActionTabService } from '@app/shared/services/commonservice/job-action-tab.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-screening-action',
  templateUrl: './screening-action.component.html',
  styleUrls: ['./screening-action.component.scss']
})
export class ScreeningActionComponent implements OnInit {

  recruiter_DropdownC_Config: DRP_CONFIG;
  resetrecruiterDrp: Subject<any> = new Subject<any>();
  public selectedRecruiter: any = {};
  template_DropdownC_Config: DRP_CONFIG;
  resetTemplateDrp: Subject<any> = new Subject<any>();
  public selectedTemplate: any = {};
  @Output() NextEmitOut: EventEmitter<any> = new EventEmitter<any>();
  dropdownInitilize:boolean = false;
  screeningForm: FormGroup;
  loading:boolean=false;
  candidateId: string;
  candPageTypeSubs: Subscription;
  IsOpenFor: number = PushCandidatePageType.Modal;
  subscriptions: Subscription;
  public jobInfo: JobScreening;
  activityStatus: boolean;
  candidateActivities: JobScreeningStatus[]=[];
  ScreeningInterviewStatus: any={};
  candidateActivitiesFilterDate: JobScreeningStatus[];
  private actions: ActionsTab;
  public candidateProfile: any;
  activityCandidate: JobScreeningStatus[];
  public  showWarningAlert: boolean = false;
  public CanAlreadyPushedSubs: Subscription;
  public candidateInformation: any;
  private destroy$: Subject<void> = new Subject();
  @Input() publishedStatus;
  @Input() memberStatus;
  constructor(private fb: FormBuilder,private serviceListClass: ServiceListClass,private snackBService: SnackBarService,
    private pushCandidateEOHService: PushCandidateEOHService, private translateService: TranslateService,private jobActionTabService: JobActionTabService,
    private commonserviceService: CommonserviceService,private jobActionsStoreService: JobActionsStoreService,
    public datepipe: DatePipe) { 
    this.dropdownConfig();
    this.actions = this.jobActionTabService.constants;
    this.screeningForm = this.fb.group({
      RecruiterName: ['', [Validators.required]],
      RecruiterId:['', [Validators.required]],
      ScreeningStatus:[],
      InterviewStatus:[],
      ScreeningDate:[],
      TimeSlot:[{ value: [], disabled: true }],
      ScreeningTitle:[{ value: '', disabled: true }],
      ScreeningAction:[1],
      IsSendEmail:[],
      TemplateId:[],
      TemplateName:[],
      UTCStartDateTime:[],
      UTCEndDateTime:[],
      TimeZone:[]
    });

  }

  ngOnInit(): void {
    this.subscriptions = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      this.jobInfo=res;
     });
    this.candPageTypeSubs = this.pushCandidateEOHService.SetPushCandPageType.subscribe((details: any)=>{
      if (details) {
        this.IsOpenFor=details.pageType;
        this.showWarningAlert = details.showWarningAlert;
        this.candidateId = details.candidateID;
      }
      this.getCandidateActivity();
      this.getScreeningInterviewStatus();
    });
    this.CanAlreadyPushedSubs = this.pushCandidateEOHService.SetAlreadyPushCandInfo.subscribe((cand: any)=>{
      if(cand?.IsXRCandidatePushedToEOH === 1 && cand?.MemberId!==null) {
        this.candidateInformation =cand;
        this.screeningForm.disable();

        this.template_DropdownC_Config.DISABLED =true ;
        this.resetTemplateDrp.next(this.template_DropdownC_Config);

        this.recruiter_DropdownC_Config.DISABLED =true ;
        this.resetrecruiterDrp.next(this.recruiter_DropdownC_Config);
      }
    });

    this.jobActionsStoreService.isScreeningActionTabUpdate.subscribe((e:boolean)=>{
      if (e) {
        let ScreeningMasterArr = this.jobActionsStoreService.getterEOHScreeningTab();
        ScreeningMasterArr.filter(e => {
          return e !== null
        });
        this.candidateProfile=ScreeningMasterArr[0];
       
      }
    });
    this.pushCandidateEOHService.SetOfficeChangeAlert.subscribe((officeVar:boolean)=>{
      if(officeVar){
        if(this.candidateProfile?.OfficeApplyingFor){
          this.screeningForm.get('IsSendEmail').setValue('');
          this.selectedTemplate=null;
          this.template_DropdownC_Config.DISABLED=true; 
          this.resetTemplateDrp.next(this.template_DropdownC_Config);
          this.screeningForm.get('TemplateId').clearValidators();
          this.screeningForm.get('TemplateId').updateValueAndValidity();
      }
      }
    })
  }

/* @Name: onRecruiterChange @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What: recruiter dropdown Configuration*/
onRecruiterChange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedRecruiter = null;
      this.screeningForm.patchValue(
        {
          RecruiterName:null,
          RecruiterId:null
        });
        this.screeningForm.get("RecruiterName").setErrors({ required: true });
        this.screeningForm.get("RecruiterName").markAsTouched();
        this.screeningForm.get("RecruiterName").markAsDirty();
    }
    else {
      this.screeningForm.get("RecruiterName").clearValidators();
      this.screeningForm.get("RecruiterName").markAsPristine();
      this.selectedRecruiter = data;
      this.screeningForm.patchValue({
        RecruiterName: data?.RecruiterName,
        RecruiterId: data?.RecruiterID
      });
    }
  }
/* @Name: dropdownConfig @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What: dropdown Configuration*/
dropdownConfig(){
   //recruiter dropdown config
  this.recruiter_DropdownC_Config = {
    API: this.serviceListClass.getRecruiterEOHList,
    MANAGE: '',
    BINDBY: 'RecruiterName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_EOHRecruiterName',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'RecruiterID'
  }

  this.template_DropdownC_Config = {
    API: '',
    MANAGE: '',
    BINDBY: 'EmailTemplateName',
    REQUIRED: true,
    DISABLED: true,
    PLACEHOLDER: 'label_screeningAction_TemplateCandidateEOH',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'EmailTemplateId'
  }
}
 
 /* @Name: getCandidateActivity @Who:  Renu @When: 23-05-2024 @Why: EWM-15844 EWM-17173 @What: get candidate scheduled infromation by Id*/
 getCandidateActivity() {
  this.loading=true;
  this.pushCandidateEOHService.getCandidateActivitiesById('?candidateId='+this.candidateId+'&JobId='+this.jobInfo?.JobId).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200 ) {
        this.loading=false;
        this.activityCandidate=[...data.Data];
        const unique = data.Data.filter((obj, index) => {
          return index === data.Data.findIndex(o =>this.datepipe.transform(obj.ActivityDate, 'yyyy-MM-dd') === this.datepipe.transform(o.ActivityDate, 'yyyy-MM-dd'));
      });
    
      this.candidateActivities=[...unique];
        if(data.Data.length>1){
          this.screeningForm.get('ScreeningDate').reset(); // @WHEN- 20-08-2024 @WHY : EWM-17898 For resetting the value @WHO : RENU 
          this.screeningForm.get('TimeSlot').reset();
          this.screeningForm.get('ScreeningTitle').reset();
          this.activityStatus=false;
          this.screeningForm.controls['ScreeningDate'].enable();
        }else{
          this.activityStatus=true;
          this.screeningForm.patchValue({
            ScreeningDate: this.candidateActivities[0].ActivityDate,
            ScreeningTitle: this.candidateActivities[0].ActivityName,
            TimeSlot: this.candidateActivities[0].TimeStart+'-'+this.candidateActivities[0].TimeEnd,
            UTCStartDateTime:this.candidateActivities[0].UTCStartDateTime,
            UTCEndDateTime:this.candidateActivities[0].UTCEndDateTime,
            TimeZone:localStorage.getItem('TimeZone')

          });
           this.screeningForm.controls['ScreeningDate'].disable();
           this.screeningForm.controls['ScreeningTitle'].disable(); 
           this.screeningForm.controls['TimeSlot'].disable();
        }
        
      }else if(data.HttpStatusCode === 204){
        this.activityStatus=true;
        this.screeningForm.controls['ScreeningDate'].disable();
        this.screeningForm.controls['ScreeningTitle'].disable(); 
        this.screeningForm.controls['TimeSlot'].disable();
        this.screeningForm.get('TimeSlot').reset();
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

/* @Name: OnchangeScreeningDate @Who:  Renu @When: 23-05-2024 @Why: EWM-17107 EWM-17173 @What: In case of mulitple activity scheduled*/
OnchangeScreeningDate($event: number){
this.screeningForm.get('TimeSlot').reset();
this.screeningForm.get('ScreeningTitle').reset();
this.candidateActivitiesFilterDate=this.activityCandidate.filter(obj=>this.datepipe.transform(obj.ActivityDate, 'yyyy-MM-dd') === this.datepipe.transform($event, 'yyyy-MM-dd'));
//this.candidateActivitiesFilterDate=this.candidateActivities?.filter(x=>x.ActivityDate==$event);
this.screeningForm.controls['TimeSlot'].enable();
}

/*@Name: OnchangeTimeSlot @Who:  Renu @When: 24-05-2024 @Why: EWM-17107 EWM-17196 @What: In case of mulitple activity time slot*/
OnchangeTimeSlot($event: any){
let chosenTimeSlotFilter=this.activityCandidate?.filter(x=>x.ActivityDate==$event.ActivityDate);
this.screeningForm.get('ScreeningTitle').setValue(chosenTimeSlotFilter[0]?.ActivityName);
this.screeningForm.get('TimeSlot').setValue($event.TimeStart+'-'+$event.TimeEnd);
 // Enable the third radio button only after selecting Interview Date and Time
 this.screeningForm.get('ScreeningAction').enable();
 this.screeningForm.patchValue({
  UTCStartDateTime:chosenTimeSlotFilter[0].UTCStartDateTime,
  UTCEndDateTime:chosenTimeSlotFilter[0].UTCEndDateTime,
  TimeZone:localStorage.getItem('TimeZone')
 });
}
/* @Name: getScreeningInterviewStatus @Who:  Renu @When: 23-05-2024 @Why: EWM-17107 EWM-17173 @What: get candidate screening/interview status*/
getScreeningInterviewStatus() {
  this.pushCandidateEOHService.getScreeningInterviewStatus('?candidateId='+this.candidateId+'&jobId='+this.jobInfo?.JobId+'&workflowId='+this.jobInfo?.WorkflowId).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
        this.loading=false;
        this.ScreeningInterviewStatus=data.Data;
        this.screeningForm.patchValue({
          InterviewStatus: this.ScreeningInterviewStatus?.Interview,
          ScreeningStatus:this.ScreeningInterviewStatus?.Screening,
        });

        if(this.ScreeningInterviewStatus?.Interview==1){
          this.screeningForm.get('ScreeningDate').setValidators([Validators.required]);
          this.screeningForm.get('ScreeningDate').updateValueAndValidity();

          this.screeningForm.get('TimeSlot').setValidators([Validators.required]);
          this.screeningForm.get('TimeSlot').updateValueAndValidity();
        }
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}


/* @Name: onTemplateChange @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What:template dropdown Configuration*/
onTemplateChange(data) {
  if (data == null || data == "" || data.length == 0) {
    this.selectedTemplate = null;
    this.screeningForm.patchValue(
      {
        TemplateId:null,
        TemplateName:null
      });
      // this.screeningForm.get("Template").setErrors({ required: true });
      // this.screeningForm.get("Template").markAsTouched();
      // this.screeningForm.get("Template").markAsDirty();
  }
  else {
    // this.screeningForm.get("RecruiterName").clearValidators();
    // this.screeningForm.get("RecruiterName").markAsPristine();
    this.selectedTemplate = data;
    this.screeningForm.patchValue({
      TemplateId: data?.EmailTemplateId,
      TemplateName:data?.EmailTemplateName
    });
  }
}

/* @Name: onChangeEmail @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What:when email checkbox status change*/
onChangeEmail($event){
  if($event.checked){
    if(this.candidateProfile?.OfficeApplyingFor){
      this.template_DropdownC_Config.API = this.serviceListClass.getEOHTempEmailList+'?OfficeID='+this.candidateProfile?.OfficeApplyingFor;
    }else{
      this.template_DropdownC_Config.API = this.serviceListClass.getEOHTempEmailList;
    }
    this.template_DropdownC_Config.DISABLED=false; 
    this.resetTemplateDrp.next(this.template_DropdownC_Config);
    this.screeningForm.get('TemplateId').setValidators([Validators.required]);
    this.screeningForm.get('TemplateId').updateValueAndValidity();
  }else{
    this.selectedTemplate=null;
    this.template_DropdownC_Config.API = '';
    this.template_DropdownC_Config.DISABLED=true; 
    this.resetTemplateDrp.next(this.template_DropdownC_Config);
    this.screeningForm.get('TemplateId').clearValidators();
    this.screeningForm.get('TemplateId').updateValueAndValidity();
  }
}

/* @Name: onChangeInterviewStatus @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What:when interview checkbox changes*/
onChangeInterviewStatus($event){
  this.ScreeningInterviewStatus.Interview=!$event.checked?0:1;
  this.screeningForm.get('InterviewStatus').setValue( this.ScreeningInterviewStatus.Interview);
     if($event.checked){
          this.screeningForm.get('ScreeningDate').setValidators([Validators.required]);
          this.screeningForm.get('ScreeningDate').updateValueAndValidity();
          this.screeningForm.get('TimeSlot').setValidators([Validators.required]);
          this.screeningForm.get('TimeSlot').updateValueAndValidity();
        }else{
          this.screeningForm.get('ScreeningDate').clearValidators();
          this.screeningForm.get('ScreeningDate').updateValueAndValidity();
          this.screeningForm.get('TimeSlot').clearValidators();
          this.screeningForm.get('TimeSlot').updateValueAndValidity();
          this.screeningForm.get('ScreeningAction').value==3?this.screeningForm.get('ScreeningAction').reset(1):'';
        }
}

/* @Name: onChangeScreeningStatus @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What:when screening checkbox changes*/
onChangeScreeningStatus($event){
  this.ScreeningInterviewStatus.Screening=!$event.checked?0:1
  this.screeningForm.get('ScreeningStatus').setValue( this.ScreeningInterviewStatus.Screening);
  if(!$event.checked){
    this.screeningForm.get('ScreeningAction').value==2?this.screeningForm.get('ScreeningAction').reset(1):'';
  }
  
}
/* @Name: onNextClick @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What: To store data in  services */
onNextClick(){ 
  this.jobActionsStoreService.setActionRunnerFn(this.actions.SCREENING_INFO, this.screeningForm.getRawValue());
  this.NextEmitOut.emit(true);
  this.jobActionsStoreService.isScreeningActionTabUpdate.next(true);

}
}
