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
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-employment-status',
  templateUrl: './employment-status.component.html',
  styleUrls: ['./employment-status.component.scss']
})
export class EmploymentStatusComponent implements OnInit {
  employeeType_DropdownC_Config: DRP_CONFIG;
  resetrecruiterDrp: Subject<any> = new Subject<any>();
  public selectedRecruiter: any = {};
  priority_DropdownC_Config: DRP_CONFIG;
  resetTemplateDrp: Subject<any> = new Subject<any>();
  public selectedTemplate: any = {};
  @Output() NextEmitOut: EventEmitter<any> = new EventEmitter<any>();
  dropdownInitilize:boolean = false;
  employmentForm: FormGroup;
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
  today = new Date();
  @Input() stageType;
  @Input() lastActivity;
  @Input() publishedStatus;
  @Input() memberStatus;
  constructor(private fb: FormBuilder,private serviceListClass: ServiceListClass,private snackBService: SnackBarService,
    private pushCandidateEOHService: PushCandidateEOHService, private translateService: TranslateService,private jobActionTabService: JobActionTabService,
    private commonserviceService: CommonserviceService,private jobActionsStoreService: JobActionsStoreService,
    public datepipe: DatePipe) { 
    this.dropdownConfig();
    this.actions = this.jobActionTabService.constants;
    this.employmentForm = this.fb.group({
      EmployeeName: [''],
      EmployeeId:[0],
      MemberPriorityName: [''],
      MemberPriorityId:[''],
      DateOfHired:[this.today,[Validators.required,CustomValidatorService.dateValidator]],
      IsCheckedSendEmail:[false],
    });

  }

  ngOnInit(): void {
    if(this.stageType?.toLocaleLowerCase()==='hired'){
      this.today=new Date(this.lastActivity);
      this.employmentForm.patchValue(
       {
         DateOfHired:new Date(this.lastActivity),
       });
     } 

    this.subscriptions = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      this.jobInfo=res;
         let filteredUsers = this.jobInfo.CandidateList?.filter(user => user?.CandidateId === this.candidateId);
         if(filteredUsers[0]?.StageType?.toLocaleLowerCase()==='hired'){
          this.today=new Date(filteredUsers[0]?.LastActivity);
         this.employmentForm.patchValue(
          {
            DateOfHired:new Date(filteredUsers[0]?.LastActivity),
          });
        } 
     });
    this.candPageTypeSubs = this.pushCandidateEOHService.SetPushCandPageType.subscribe((details: any)=>{
      if (details) {
        this.IsOpenFor=details.pageType;
        this.showWarningAlert = details.showWarningAlert;
        this.candidateId = details.candidateID;
        let filteredUsers = this.jobInfo.CandidateList?.filter(user => user?.CandidateId === this.candidateId);
         if(filteredUsers[0]?.StageType?.toLocaleLowerCase()==='hired'){
          this.today=new Date(filteredUsers[0]?.LastActivity);
         this.employmentForm.patchValue(
          {
            DateOfHired:new Date(filteredUsers[0]?.LastActivity),
          });
        } 
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
  }

/* @Name: dropdownConfig @Who:  Renu @When: 22-05-2024 @Why: EWM-17107 EWM-17173 @What: dropdown Configuration*/
dropdownConfig(){
   //recruiter dropdown config
  this.employeeType_DropdownC_Config = {
    API: this.serviceListClass.getEmploymentTypeList,
    MANAGE: '',
    BINDBY: 'Name',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_EmployeeType',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'Id'
  }

  this.priority_DropdownC_Config = {
    API: this.serviceListClass.getMemberPriorityList,
    MANAGE: '',
    BINDBY: 'Name',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_MemberPriority',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'Id'
  }
}
onEmpTypeChange(data) {
  if (data == null || data == "" || data.length == 0) {
    this.selectedRecruiter = null;
    this.employmentForm.patchValue(
      {
        EmployeeName:null,
        EmployeeId:0
      });
     }
  else {
     this.selectedRecruiter = data;
    this.employmentForm.patchValue({
      EmployeeName: data?.Name,
      EmployeeId: data?.Id
    });
  }
}
onMemberPriorityChange(data) {
  if (data == null || data == "" || data.length == 0) {
    this.selectedTemplate = null;
    this.employmentForm.patchValue(
      {
        MemberPriorityId:null,
        MemberPriorityName:null
      });
      // this.employmentForm.get("MemberPriorityName").setErrors({ required: true });
      // this.employmentForm.get("MemberPriorityName").markAsTouched();
      // this.employmentForm.get("MemberPriorityName").markAsDirty();
  }
  else {
    // this.employmentForm.get("MemberPriorityName").clearValidators();
    // this.employmentForm.get("MemberPriorityName").markAsPristine();
    this.selectedTemplate = data;
    this.employmentForm.patchValue({
      MemberPriorityId: data?.Id,
      MemberPriorityName:data?.Name
    });
  }
}

onClearHired(e){
  this.employmentForm.patchValue({
    DateOfHired: null
  });
}
onNextClick(){ 
  this.jobActionsStoreService.setActionRunnerFn(this.actions.SCREENING_EMPLOYMENT_STATUS_INFO, this.employmentForm.getRawValue());
  this.NextEmitOut.emit(true);
  this.jobActionsStoreService.isScreeningActionTabUpdate.next(true);

}

}
