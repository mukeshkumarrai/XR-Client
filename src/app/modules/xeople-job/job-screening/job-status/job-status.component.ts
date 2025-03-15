/*
@(C): Entire Software
@Type: File, <ts>
@Who: Adarsh singh
@When: 28-May-2023
@Why: EWM-11779.EWM-12547
@What: This component is used for job screening modal
*/
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ActionsTab, JobScreening, SaveJobStatusTab, candidateEntity, jobActionsEntity } from 'src/app/shared/models/job-screening';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ButtonTypes } from 'src/app/shared/models/button-animation.model';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { Observable, Observer, Subject, Subscription, of } from 'rxjs';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { JobActionTabService } from '../../../../shared/services/commonservice/job-action-tab.service';
import { JobActionsStoreService } from '../../../../shared/services/commonservice/job-actions-store.service';
import { JobStatusService } from '../../../../shared/services/job-status/job-status.service';
import { takeUntil } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MediaMatcher } from '@angular/cdk/layout';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { CommonServiesService } from '@app/shared/services/common-servies.service';

@Component({
  selector: 'app-job-status',
  templateUrl: './job-status.component.html',
  styleUrls: ['./job-status.component.scss']
})
export class JobStatusComponent implements OnInit, OnDestroy {
  public loading: boolean;
  public jobStatusForm: FormGroup;
  public candidateListOfArray: candidateEntity[];
  public allDetailsData: JobScreening;
  public currentApplication: string;
  public level1Id: any = [];
  public level2Id: any = [];
  public level3Id: any = [];
  public level1: any = [];
  public level2: any = [];
  public level3: any = [];
  public workflowId: String;
  public stageId: String;
  public jobId: String;

  public onActiveCandidate: candidateEntity;

  dirctionalLang;
  public animationVar: any;

  public folderdata: any = [];
  public isStarActive: any = [];
  getFolder: Array<any> = [];
  selectedFolder: any = []
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public dropDownStatusConfig: customDropdownConfig[] = [];
  public selectedReason: any = {};
  public selectedStatus: any = {};
  resetReason: Subject<any> = new Subject<any>();
  candidateID: any;

  applicationStatusId: string;
  getDateFormat: any;
  isRestrictedMessage: boolean;
  // @suika @EWM-11782 Whn 01-06-2023
  @Output() reloadDataEvent = new EventEmitter();
  private actions: ActionsTab;
  savedFormStatus: boolean = true;
  reasonDataByStage: any = [];

  minDate: Date;
  maxDate: Date;
  alertMessage = `<p>Hi {{Candidate.FullName}}, </p><p></p><p>Unfortunately, we are currently not accepting any further applications for the position you have applied for. We appreciate your interest in our company and thank you for taking the time to apply. Please note that we may reopen the application process later, and we encourage you to check our website for updates. We value your skills and qualifications and would be pleased to consider your application again when we resume the hiring process. Thank you for your understanding.</p><p></p><p>Best regards, </p><p>{{Jobs.NameOfhiringManager}} </p><p>{{Jobs.TitleofhiringManager}} </p><p>{{Jobs.Company}}</p>`;
  WorkFlowStageName: string;
  jobName: string;
  workflowName: string;
  level1Name: any;
  @ViewChild('target') private myScrollContainer: ElementRef;
  StageDisplaySeq: number;
  NextStageId: any;

  private unsubscribe = new Subject<void>();
  private hasUnsavedData = false;
  maxMoreLength = 3; 
  Name = 'Name';
  folderArr = [];
  defaultFormValue:any;
  hasChangeValue: boolean = false;
  @ViewChild('select') select: NgSelectComponent;
  currentStageId:string;

  forSmallSmartphones: MediaQueryList;
  forSmartphones: MediaQueryList;
  forLargeSmartphones: MediaQueryList;
  forIpads: MediaQueryList;
  forMiniLapi: MediaQueryList;
  private _mobileQueryListener: () => void;
 

  defaultJobStatusFormData:any;
  onSuccessStatusPage:boolean = true;
  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;
  subscription5: Subscription;
  subscription6: Subscription;
  subscription7: Subscription;

  @Output() reloaCanidateMappedJobCard = new EventEmitter();
  @Output() isFormValuePatched = new EventEmitter();

  //  kendo image uploader Adarsh singh 11-Aug-2023
  @ViewChild('editor') editor: EditorComponent;
 subscription$: Subscription;
 // End 
 isResponseGet:boolean = false;
 isResponseGetdata:boolean=false;
 public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
ownerList: string[]=[];
public showErrorDesc: boolean = false;
public basic:any=[];
  constructor(private fb: FormBuilder, private _commonService: CommonserviceService, private snackBService: SnackBarService, private jobService: JobService,
    private translateService: TranslateService, public dialog: MatDialog, private router: Router, public _CandidateFolderService: CandidateFolderService,
    private _appSettingsService: AppSettingsService, private serviceListClass: ServiceListClass, media: MediaMatcher, private commonServiesService: CommonServiesService,
    private jobActionTabService: JobActionTabService, private jobActionsStoreService: JobActionsStoreService, changeDetectorRef: ChangeDetectorRef,
    private _jobStatusService: JobStatusService,private el:ElementRef,
    private _KendoEditorImageUploaderService: KendoEditorImageUploaderService) {
    this.applicationStatusId = _appSettingsService.ApplicationStatusId;
    this.actions = this.jobActionTabService.constants;
    this.forSmallSmartphones = media.matchMedia('(max-width: 600px)');
    this.forSmartphones = media.matchMedia('(max-width: 832px)');
    this.forLargeSmartphones = media.matchMedia('(max-width: 767px)');
    this.forIpads = media.matchMedia('(max-width: 1024px)');
    this.forMiniLapi = media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
      this.screenMediaQuiryForSkills();
    };
    this.forSmallSmartphones.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.editorConfig={
      REQUIRED:true,
      DESC_VALUE:null,
      PLACEHOLDER:'label_alert_messageJobActionStatus', 
      Tag:[],
      EditorTools:this.basic,
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    };
    this.getEditorVal=this.alertMessage;
  // Services 
  this.screenMediaQuiryForSkills();
    this.subscription1 = this._commonService.getJobScreeningInfo().subscribe((data: JobScreening) => {
      this.allDetailsData = data;
      this.candidateListOfArray = data?.CandidateList;
    // End 
  });
  this.initializedOnStarting();

  // End 
  
/* 
  @Name: Subscribe All Services for saving data while user closed the page
  @Who: Adarsh Singh
  @When: 18-06-2023
  @Why: EWM-11779 EWM-12547
*/
    // called when click on cross icon in Job Action Modal
    this.subscription3 = this.jobActionsStoreService.isJobActionWindowClose.subscribe((e: boolean) => {
      if (e) {
        let hasChnage = this.checkFormValueChaned();
        if (e && hasChnage && this.onSuccessStatusPage) {
          // console.log('Changed Status', hasChnage);
          let obj: jobActionsEntity = {
            formGroupInfo: this.jobStatusForm,
            APIEndPoint: this.serviceListClass.createJobNotes,
            isChanged: hasChnage,
            tabName: 'STATUS_INFO'
          }
          this.jobActionsStoreService.setActionRunnerFn(this.actions.STATUS_INFO, obj);
          hasChnage = false;
        }
      }
    })
    // End 
    // called when user changed the tab inside Job Action Modal
    this.subscription4 = this.jobActionsStoreService.onJobStatusTabChange.subscribe((e: boolean) => {
      if (e) {
        let hasChnage = this.checkFormValueChaned();
        if (e && hasChnage) {
          let obj: jobActionsEntity = {
            formGroupInfo: this.jobStatusForm,
            APIEndPoint: this.serviceListClass.createJobNotes,
            isChanged: hasChnage,
            tabName: 'STATUS_INFO'
          }
          this.jobActionsStoreService.setActionRunnerFn(this.actions.STATUS_INFO, obj);
          hasChnage = false;
        }
      }
    })
    // End 

    // Called When save API called while click on Cross icon Then Check If Any Required Field or not
    this.subscription5 = this.jobActionsStoreService.hasRequiredFieldStatus.subscribe((e:boolean)=>{
      if (e) {
        this.onCheckRequiredValidationField();
      }
    });
    // End 

    // called when successfully data submit and reset the form 
    this.subscription6 = this.jobActionsStoreService.resetJobStatusFormOnSuccess.subscribe((e:boolean)=>{
      if (e) {
        this.jobCandidateMappedAll();
        this.jobActionsStoreService.setActionRunnerFn(this.actions.STATUS_INFO, null);
        this.jobActionsStoreService.status.next(null);
      }
    })
    // End 

    // called when any error related to stage 
    this.subscription7 = this.jobActionsStoreService.onStageAlreadyMappedError.subscribe((e:boolean)=>{
      if (e) {
        this.resetOnlyStage();
      }
    })
    // End 
    // this.jobStatusForm.patchValue(({
    //   RestrictedMessage:''
    // }))
    // this.getEditorVal='';
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }  

/* 
  @Name: initializedOnStarting
  @Who: Adarsh Singh
  @When: 20-06-2023
  @Why: EWM-11779 EWM-12547
  @What: initialized filed on starting 
*/
  initializedOnStarting(){
    const currentYear = new Date().getFullYear();
    const currentMoth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear, currentMoth + 6, currentDay);
    this.configLoad();
    // Stored Data 
    this.workflowId = this.allDetailsData.WorkflowId;
    this.workflowName = this.allDetailsData.WorkflowName;
    this.stageId = this.allDetailsData.WorkFlowStageId;
    this.jobId = this.allDetailsData.JobId;
    this.jobName = this.allDetailsData.JobTitle;
    this.WorkFlowStageName = this.allDetailsData.WorkFlowStageName;
    this.onActiveCandidate = this.candidateListOfArray[0];
    this.StageDisplaySeq = this.onActiveCandidate.StageDisplaySeq;
    this.currentStageId = this.candidateListOfArray[0].WorkFlowStageId;
    
    // End 
    this.animationVar = ButtonTypes;
    // Form 
    this.jobStatusForm = this.fb.group({
      CandidateList: [[]],
      JobId: [this.jobId],
      JobName: [this.jobName],
      WorkflowId: [this.workflowId],
      WorkflowName: [this.workflowName],
      PreviousStageId: [this.onActiveCandidate.WorkFlowStageId],
      PreviousStageName: [this.onActiveCandidate.WorkFlowStageName],
      NextStageId: [null],
      NextStageName: [null],
      NewSubStageId: [null],
      NewSubStageName: [null],
      NewSubChildStageId: [null],
      NewSubChildStageName: [null],
      CurrentStageDisplaySeq: [this.StageDisplaySeq],
      NextStageDisplaySeq: [],
      SkipStageName: [''],
      ApplicationStatusReasonId: [null],
      CandidateProfileStatusId: [null],
      CandidateReasonId: [''],
      IsRestricted: [false],
      FolderList: [null],
      FolderListId: [],
      level1: [null, Validators.required],
      level2: [null],
      level3: [null],
      RestrictedUntilDate: [null, [CustomValidatorService.dateValidator]],
      RestrictedMessage: [this.alertMessage],
      CandidateProfileStatusName: ['']
    })
    // End 

    this.jobStatusForm.controls['PreviousStageName'].disable();
    this.jobStatusForm.controls['ApplicationStatusReasonId'].disable();
    this.getAllNextStageList(this.allDetailsData.WorkflowId, this.allDetailsData.WorkFlowStageId);
    this.getCanidateMappedFoldersDetails();
    this.getDateFormat = this._appSettingsService.dateFormatPlaceholder;
    // this.getFolderList()
    const allEqual = (arr: any) => arr?.every(val => val.StatusId === arr[0].StatusId);
    const result = allEqual(this.candidateListOfArray);
    if (this.candidateListOfArray?.length > 1) {
      if (result) {
        this.selectedStatus = { Id: this.candidateListOfArray[0].StatusId };
        this.onManageStatuschange(this.selectedStatus);
      }
    } else {
      if (this.candidateListOfArray?.length === 1) {
        this.selectedStatus = { Id: this.candidateListOfArray[0].StatusId };
        this.onManageStatuschange(this.selectedStatus);
      }
      
    }
    let candidateListArr = [];
    this.candidateListOfArray.forEach(cand => {
      candidateListArr.push({
        CandidateId: cand.CandidateId,
        CandidateName: cand.CandidateName,
        PreviousStageId: cand.WorkFlowStageId,
        PreviousStageName: cand.WorkFlowStageName,
        CurrentStageDisplaySeq: cand.StageDisplaySeq,
        PreviousCandidateStatusName: cand.CandidateStatus ?? cand.StatusName,
      })
    })
    
    this.jobStatusForm.patchValue({
      CandidateList: candidateListArr
    })
  }

  /* 
    @Name: configLoad
    @Who: Adarsh singh
    @When: 28-May-2023
    @Why: EWM-11779.EWM-12547
    @What: load config of dropdown
  */
  configLoad() {
    this.candidateID = this._appSettingsService.candidateID;
    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + '?GroupId=' + this.candidateID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownStatusConfig['placeholder'] = 'label_candidateProfileStatus';
    this.dropDownStatusConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=' + this.candidateID;
    this.dropDownStatusConfig['IsRequired'] = false;
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['bindLabel'] = 'Code';
    this.dropDownStatusConfig['multiple'] = false;
    this.dropDownStatusConfig['isClearable'] = false;

    // reason
    this.dropDownReasonConfig['IsDisabled'] = false;
    this.dropDownReasonConfig['placeholder'] = 'label_JobAction_ReasonOfStatus';
    this.dropDownReasonConfig['IsManage'] = '';
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;
  }

  /* 
    @Name: onLevel1Changes
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: change first level of stage
  */
  onLevel1Changes(e) {
    this.jobStatusForm.get("NewSubStageName").reset();
    this.jobStatusForm.get("NewSubStageId").reset();
    this.jobStatusForm.get("NewSubChildStageName").reset();
    this.jobStatusForm.get("NewSubChildStageId").reset();
    this.jobStatusForm.get("ApplicationStatusReasonId").reset();
    if (e) {
      this.level1Id = e?.InternalCode;
      this.level1Name = e?.StageName;
      this.jobStatusForm.patchValue({
        NextStageName: e?.StageName,
        level1: e,
        NextStageId: e?.InternalCode,
        NextStageDisplaySeq: e?.DisplaySeq,
        NewSubStageId: null,
        NewSubStageName: null,
        NewSubChildStageId: null,
        NewSubChildStageName: null,
        ApplicationStatusReasonId: null
      })
      this.getAllNextStageLevel2List(this.workflowId, this.stageId, this.level1Id);
      this.getReasonByStageSelected(e?.StageType);
      // check if parent stage id and selected stage id are not same 
      if (this.currentStageId !== e?.InternalCode) {
        // this.onSubmitAndCheckStage(this.jobStatusForm.getRawValue());
      }
      this.jobStatusForm.get("ApplicationStatusReasonId").enable();
    } else {
      this.jobStatusForm.patchValue({
        NextStageId: null,
        level1: null
        // NextStageName: null
      })
      this.level2 = null;
      this.jobStatusForm.get("ApplicationStatusReasonId").disable();
    }
  }
  /* 
    @Name: onLevel2Changes
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: change second level of stage
  */
  onLevel2Changes(e) {
    this.jobStatusForm.get("NewSubChildStageName").reset();
    this.jobStatusForm.get("NewSubChildStageId").reset();
    if (e) {
      this.level2Id = e?.InternalCode;
      this.jobStatusForm.patchValue({
        level2: e,
        NewSubStageId: e?.InternalCode,
        NewSubStageName: e?.StageName,
        NewSubChildStageId: null,
        NewSubChildStageName: null
      })
      this.getAllNextStageLevel3List(this.workflowId, this.stageId, this.level2Id);
      // stage updating 
      // this.onSubmitAndCheckStage(this.jobStatusForm.getRawValue());
      // End 
    }
    else {
      this.jobStatusForm.patchValue({
        NewSubStageId: null,
        NewSubStageName: null,
        level2: null
      })
      this.level3 = null;
    }
  }
  /* 
    @Name: onLevel3Changes
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: change third level of stage
  */
  onLevel3Changes(e) {
    if (e) {
      this.jobStatusForm.patchValue({
        level3: e,
        NewSubChildStageId: e?.InternalCode,
        // NewSubChildStageName: e?.StageName,
      })
      // this.onSubmitAndCheckStage(this.jobStatusForm.getRawValue());
    }
    else {
      this.jobStatusForm.patchValue({
        NewSubChildStageId: null,
        level3: null
        // NewSubChildStageName: null
      })
    }
  }
  /* 
    @Name: getAllNextStageList
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: get all stages on load
  */
  getAllNextStageList(workflowId, currentStageId) {
    this.loading = true;
    let level = 1;
    let level1valid = false;
    this.jobService.getAllNextStages_v2('?workflowid=' + workflowId + '&currentstageid=' + currentStageId + '&level=' + level).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.level1 = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
  /* 
    @Name: getAllNextStageLevel2List
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: get second lavel stages on click fist lavel
  */
  getAllNextStageLevel2List(workflowId, currentStageId, Id) {
    this.level2 = [];
    this.level3 = [];
    this.loading = true;
    let level = 2;
    let parentstageid = Id;
    this.jobService.getAllNextStages_v2('?workflowid=' + workflowId + '&currentstageid=' + currentStageId + '&level=' + level + '&parentstageid=' + parentstageid).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.level2 = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
  /* 
    @Name: getAllNextStageLevel3List
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: get third lavel stages on click fist second
  */
  getAllNextStageLevel3List(workflowId, currentStageId, Id) {
    this.level3 = [];
    this.loading = true;
    let level = 3;
    let parentstageid = Id;
    this.jobService.getAllNextStages_v2('?workflowid=' + workflowId + '&currentstageid=' + currentStageId + '&level=' + level + '&parentstageid=' + parentstageid).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.level3 = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
  /* 
    @Name: getUpdateOptionsLevel1
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: refrsh first level stages
  */
  getUpdateOptionsLevel1() {
    this.getAllNextStageList(this.allDetailsData.WorkflowId, this.allDetailsData.WorkFlowStageId);
  }
  /* 
    @Name: getUpdateOptionsLevel2
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: refrsh second level stages
  */
  getUpdateOptionsLevel2() {
    this.getAllNextStageLevel2List(this.allDetailsData.WorkflowId, this.allDetailsData.WorkFlowStageId, this.level1Id);
  }
  /* 
    @Name: getUpdateOptionsLevel3
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: refrsh third level stages
  */
  getUpdateOptionsLevel3() {
    this.getAllNextStageLevel3List(this.allDetailsData.WorkflowId, this.allDetailsData.WorkFlowStageId, this.level2Id);
  }

  /* 
    @Name: onSubmitAndCheckStage
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: submit and check stages condiions
  */
  onSubmitAndCheckStage(value) {
    this.isResponseGet = true;
    let formValueObj = this.storedPayloadForSend(this.jobStatusForm.getRawValue());

    this.jobService.checkCandidateMoveAction(formValueObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          // save form 
          this.onSaveJobStaus();
          // end 
        }
        else if (repsonsedata.HttpStatusCode === 400) {
          this.isResponseGet = false;
          if (repsonsedata.Message == '400041') {
            // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show 
            this.alertValidationOfStages(repsonsedata.Data.SkipStageName, repsonsedata.Data.SkipStagePosition);
            this.resetOnlyStage();
          } 
          else if (repsonsedata.Message === '400042') {
            this.stagesAlreadyMappped();
            this.resetOnlyStage();
          }
          else if (repsonsedata.Message === "400058") {
            this.alertMaxCandidateAddInLastStage();
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          }
          this.loading = false;
        } else {
          this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.isResponseGet = false;
        if (err.StatusCode == undefined) {
          this.isResponseGet = false;
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
  /* 
    @Name: alertValidationOfStages
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: show alert while any error in matching condions of satges
  */
 // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show
  public alertValidationOfStages(SkipStageName, SkipStagePosition) {
    let message1 = `label_stage_msg1`;
    const message2 = `label_stage_msg2`;
    const message3 = `label_stage_msg3`;
    const message = '';
    const title = '';
    const subTitle = '';
    let mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates';
    switch (SkipStagePosition) {
      case 'parent':
        mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates';
        break;
      case 'child':
        mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates_substage';
        break;
      case 'subchild':
        mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates_substage_Sub-substage';
        break;
    }

    message1 = this.commonServiesService.getreplace(mintitle, SkipStageName);

    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: { dialogData, isButtonShow: true, SkipStageName: SkipStageName, message1: message1, message2: message2, message3: message3 },
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {
      this.select.focus();
    })
  }

  /* 
    @Name: onFilterFolder
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: on search folder
  */
  onFilterFolder(inputValue: string): void {
    if (inputValue.length > 0 && inputValue.length <= 3) {
      return;
    }
    this._CandidateFolderService.getCandidateMapToFolder('?Search=' + inputValue).subscribe((repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        this.folderdata = repsonsedata.Data;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
  }
  /* 
    @Name: onSelectFolder
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: on select folder array
  */
  onSelectFolder(folder: any) {
    this.getFolder = folder;
    this.getFolder.forEach(e => {
      this.folderArr.push({
        Id: e.Id
      })
    })
    this.jobStatusForm.patchValue({
      FolderListId: this.folderArr
    })
  }
  /* 
    @Name: onManageStatuschange
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: staus dropdown data store
  */
  onManageStatuschange(data) {
    this.selectedReason = null;
    if (data == null || data == "") {
      this.selectedStatus = null;
      this.jobStatusForm.patchValue({
        CandidateProfileStatusId: null,
        CandidateProfileStatusName: ''
      })
    }
    else {
      this.selectedStatus = data;
      this.jobStatusForm.patchValue({
        CandidateProfileStatusId: this.selectedStatus?.Id,
        CandidateProfileStatusName: this.selectedStatus?.ShortDescription
      })
      this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=' + this.candidateID + '&statusId=' + this.selectedStatus.Id + '&GroupCode=CANDIDATE';
      this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=candidate';
      this.resetReason.next(this.dropDownReasonConfig);
    }
  }
  /* 
    @Name: onManageReasonchange
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: reason dropdown data store
  */
  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.jobStatusForm.patchValue({
        CandidateReasonId: null
      })
    }
    else {
      this.selectedReason = data;
      this.jobStatusForm.patchValue({
        CandidateReasonId: this.selectedReason?.Id
      })
    }
  }

  /* 
    @Name: getReasonByStageSelected
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: get reason by stages
  */
  shortDesc: string;
  getReasonByStageSelected(shortDesc: string) {
    this.loading = true;
    this.shortDesc = shortDesc;
    let shortDescription = shortDesc ? shortDesc : 'Others';
    this.jobService.getReasonByShortDesc('?groupId=' + this.applicationStatusId + '&shortDescription=' + shortDescription).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.reasonDataByStage = repsonsedata.Data;
        } else {
          this.loading = false;
          this.reasonDataByStage = null;
        }
      }, err => {
        this.loading = false;
        this.reasonDataByStage = null;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /* 
    @Name: getCanidateMappedFoldersDetails
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: get all folder which selected candidate os mapped with same folder
  */
  getCanidateMappedFoldersDetails() {
    this.isFormValuePatched.next(true);
    let CandId = []
    // let candidateIdArray = Array.prototype.map.call(this.candidateListOfArray, function(item) { return item.CandidateId; }).join(",");
    let candidateIdArray = this.candidateListOfArray.forEach(e => {
      CandId.push(e.CandidateId);
    })
    let obj = {
      "Candidates": CandId
    }
    this._CandidateFolderService.postCandidateFoldersDetails(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          let res = repsonsedata.Data?.CandidateFolderMappingList;
          this.folderdata = res;
          setTimeout(() => {
            let mappedFolder = res.filter((e: any) => e.IsSelected === 1);
            let arr = [];
            let folderArr = [];
          if (mappedFolder?.length >= 1) {
            mappedFolder.forEach((e: any) => {
              arr.push(e.Name);
              this.selectedFolder = [...arr];
              folderArr.push({ Id: e.Id })
              this.folderArr = [...folderArr];
            })
            this.jobStatusForm.patchValue({
              FolderList: this.selectedFolder,
              FolderListId: this.folderArr
            })
          }
          else {
            this.selectedFolder = null;
            this.jobStatusForm.patchValue({
              FolderList: null
            })
          }
          this.defaultJobStatusFormData = this.jobStatusForm.value;
          this.isFormValuePatched.next(false);
          }, 500);

        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /* 
    @Name: clearDate
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: clear date 
  */
  clearDate() {
    this.jobStatusForm.patchValue({
      RestrictedUntilDate: null
    });
  }
  /* 
    @Name: onRestricedMessage
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: show hide alert message box
  */
  onRestricedMessage(event: any) {
    if (event.checked) {
      this.isRestrictedMessage = true;
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scroll({
          top: this.myScrollContainer.nativeElement.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      }, 0);
    }
    else {
      this.isRestrictedMessage = false;
    }
  }
  /* 
    @Name: onSaveJobStaus
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: save all methode 
  */
  onSaveJobStaus() {
    let formValueObj = this.storedPayloadForSend(this.jobStatusForm.getRawValue());
    this._CandidateFolderService.saveJobActionStatus(formValueObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.jobCandidateMappedAll();
          // @suika @EWM-11782 Whn 01-06-2023 To send reload api event on data saving.
          this.reloadDataEvent.emit(true);
          this.defaultJobStatusFormData = this.jobStatusForm.value;
          // set null value in service when user has saved data
          this.jobActionsStoreService.setActionRunnerFn(this.actions.STATUS_INFO, null);
          // 
          // End 
        } else {
          if (repsonsedata.Message === '400042') {
            this.resetOnlyStage();
            this.stagesAlreadyMappped();
          }else{
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.HttpStatusCode);
          }
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

/* 
  @Name: resetForm
  @Who: Adarsh Singh
  @When: 20-06-2023
  @Why: EWM-11779 EWM-12547
  @What: reset form control
*/
  resetForm() {
    this.savedFormStatus = false;
    this.jobStatusForm.patchValue({
      NextStageName: null,
      level1: null,
      level2: null,
      level3: null,
      NextStageId: null,
      NextStageDisplaySeq: null,
      NewSubStageId: null,
      NewSubStageName: null,
      NewSubChildStageId: null,
      NewSubChildStageName: null,
      ApplicationStatusReasonId: null,
      FolderList: null,
      FolderListId: null,
      CandidateProfileStatusId: null,
      CandidateReasonId: null,
      IsRestricted: false,
      RestrictedUntilDate: null,
      RestrictedMessage: this.alertMessage
    })
    this.getEditorVal=this.alertMessage; //who:maneesh,what:ewm-15815 ewm-16342,when:18/03/2024

    this.level1Id = null;
    this.level2Id = null;
    this.level3Id = null;
    this.folderArr = null;
    this.selectedFolder = null;
    this.selectedStatus = null;
    this.selectedReason = null;
    this.isRestrictedMessage = false;
    this.jobStatusForm.markAsPristine();
    this.jobStatusForm.markAsUntouched();
    this.jobStatusForm.updateValueAndValidity();
    this.jobStatusForm.get("ApplicationStatusReasonId").disable();
  }
/* 
  @Name: resetOnlyStage
  @Who: Adarsh Singh
  @When: 20-06-2023
  @Why: EWM-11779 EWM-12547
  @What: reset stages
*/
  resetOnlyStage(){
    this.jobStatusForm.patchValue({
      NextStageName: null,
      level1: null,
      level2: null,
      level3: null,
      NextStageId: null,
      NextStageDisplaySeq: null,
      NewSubStageId: null,
      NewSubStageName: null,
      NewSubChildStageId: null,
      NewSubChildStageName: null,
    })
    this.level1Id = null;
    this.level2Id = null;
    this.level3Id = null;
    this.level2 = null;
    this.level3 = null;
  }
  /* 
    @Name: onSubmitJobStatusForm
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: submit and save all methde here
  */
  onSubmitJobStatusForm() {
    if (this.jobStatusForm.valid) {
      // folder mapping  
      this.getFolder.forEach(e => {
        e.IsSelected = 1;
      })
      // check stage mapping 
      this.onSubmitAndCheckStage(this.jobStatusForm.getRawValue());
      // end 
    }
  }

  /* 
  @Name: ngOnDestroy
  @Who: Rrnu
  @When: 31-May-2023
  @Why: EWM-11781.EWM-12698
  @What: to store data in service 
*/
  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    // this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
    this.subscription$?.unsubscribe();

    // this.subscription7.unsubscribe();
  }

/* 
  @Name: storedPayloadFor send 
  @Who: Adarsh singh
  @When: 31-May-2023
  @Why: EWM-11779.EWM-12547
  @What: Store payload single function 
*/
  storedPayloadForSend(value) {
    let payload: SaveJobStatusTab;
    let val = value;
    let date = val.RestrictedUntilDate ? this._appSettingsService.getUtcDateFormat(val.RestrictedUntilDate) : null;
    let uniqueFolde = [];
    uniqueFolde = [...new Map(val.FolderListId?.map((m) => [m.Id, m])).values()];
    let NextStageId: string, NextStageName: string, NextStageDisplaySeq: number;
    if (value.level3?.length != 0 && value?.level3 != null) {
      NextStageId = value.level3?.InternalCode;
      NextStageName = value.level3?.StageName;
      NextStageDisplaySeq = value.level3?.DisplaySeq;
    } else if (value.level2?.length != 0 && value?.level2 != null) {
      NextStageId = value.level2?.InternalCode;
      NextStageName = value.level2?.StageName;
      NextStageDisplaySeq = value.level2?.DisplaySeq;
    } else {
      NextStageId = value.level1?.InternalCode;
      NextStageName = value.level1?.StageName;
      NextStageDisplaySeq = value.level1?.DisplaySeq;
    }
    this.NextStageId = NextStageId;
    payload = {
      CandidateList: val.CandidateList,
      JobId: val.JobId,
      JobName: val.JobName,
      WorkflowId: val.WorkflowId,
      WorkflowName: val.WorkflowName,
      // PreviousStageId: val.PreviousStageId,
      // PreviousStageName: val.PreviousStageName,
      NextStageId: NextStageId,
      NextStageName: NextStageName,
      // CurrentStageDisplaySeq: val.CurrentStageDisplaySeq,
      NextStageDisplaySeq: NextStageDisplaySeq,
      SkipStageName: val.SkipStageName,
      ApplicationStatusReasonId: +val.ApplicationStatusReasonId,
      CandidateProfileStatusId: val.CandidateProfileStatusId ? val.CandidateProfileStatusId : '00000000-0000-0000-0000-000000000000',
      CandidateProfileStatusName: val.CandidateProfileStatusName,
      CandidateReasonId: val.CandidateReasonId ? val.CandidateReasonId : 0,
      IsRestricted: val.IsRestricted ? 1 : 0,
      RestrictedUntilDate: date,
      RestrictedMessage: val.RestrictedMessage,
      FolderList: uniqueFolde,
      JobHeadCount: this.allDetailsData?.JobHeadCount

    }
    return payload;
  }

  jobCandidateMappedAll() {  
    let candidateJobObj = {};

    let NextStageId: string, NextStageName: string, NextStageDisplaySeq: number;
    let value = this.jobStatusForm.value;
    if (value.level3?.length != 0 && value?.level3 != null) {
      NextStageId = value.level3?.InternalCode;
      NextStageName = value.level3?.StageName;
      NextStageDisplaySeq = value.level3?.DisplaySeq;
    } else if (value.level2?.length != 0 && value?.level2 != null) {
      NextStageId = value.level2?.InternalCode;
      NextStageName = value.level2?.StageName;
      NextStageDisplaySeq = value.level2?.DisplaySeq;
    } else {
      NextStageId = value.level1?.InternalCode;
      NextStageName = value.level1?.StageName;
      NextStageDisplaySeq = value.level1?.DisplaySeq;
    }
    candidateJobObj['PageNumber'] =this.allDetailsData?.GridState?.PageNumber;
    candidateJobObj['PageSize'] =this.allDetailsData?.GridState?.PageSize;
    candidateJobObj['OrderBy'] =this.allDetailsData?.GridState?.OrderBy;
    candidateJobObj['search'] =this.allDetailsData?.GridState?.search;
    if(this.allDetailsData?.GridState?.JobFilterParams.length==0){
      candidateJobObj['FilterParams'] =null;
    }else{
      candidateJobObj['FilterParams'] =this.allDetailsData?.GridState?.JobFilterParams;
    }
    candidateJobObj['JobId'] = this.allDetailsData?.JobId;
    candidateJobObj['WorkflowId'] = this.allDetailsData?.WorkflowId;
    candidateJobObj['WorkflowName'] = this.allDetailsData?.WorkflowName;
    candidateJobObj['StageName'] = value.level1?.StageName;
    candidateJobObj['StageId'] = value.level1?.InternalCode;
    candidateJobObj['CandidateId']=this.candidateListOfArray.map(function (i) {
      return i['CandidateId'];
    });

    this.jobService.jobCandidateMappedAll(candidateJobObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.isResponseGet = false;
          this.resetForm();
          let resObj:JobScreening;
          resObj = repsonsedata?.Data;
          resObj['SelectedCandidate'] = repsonsedata?.Data.CandidateList;
          resObj['JobHeadCount'] = this.allDetailsData?.JobHeadCount;
          this.allDetailsData = resObj;
          this._commonService.setJobScreeningInfo(this.allDetailsData);
          let CandArray = repsonsedata?.Data.CandidateList;;
          let candidateListArr = [];
          CandArray.forEach(cand => {
              candidateListArr.push({
                CandidateId: cand.CandidateId,
                CandidateName: cand.CandidateName,
                PreviousStageId: cand.WorkFlowStageId,
                PreviousStageName: cand.WorkFlowStageName,
                CurrentStageDisplaySeq: cand.StageDisplaySeq
              })
            })
            this.jobStatusForm.patchValue({
              CandidateList: candidateListArr
            })
          //this._commonService.setJobScreeningInfo(this.allDetailsData);
          this.jobStatusForm.patchValue({
            PreviousStageId: repsonsedata?.Data.WorkFlowStageId,
            PreviousStageName: repsonsedata?.Data.WorkFlowStageName
          })
          
          if (this.candidateListOfArray.length == 1) {
          this.reloaCanidateMappedJobCard.emit(this.NextStageId);
            // this.getCandidatemappedtojobcardAll();
          }
          this.defaultJobStatusFormData = this.jobStatusForm.value;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.HttpStatusCode);
        } else {
          this.isResponseGet = false;
          this.resetForm();
          this.defaultJobStatusFormData = this.jobStatusForm.value;
          this.loading = false;
        }
      }, err => {
        this.isResponseGet = false;
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

    /* 
    @Name: alertValidationOfStages
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: show alert while any error in matching condions of satges
  */
     stagesAlreadyMappped() {
      const message1 = `400042`;
      const message2 = `400042`;
      const message3 = `400042 `;
      const message = '400042';
      const title = '';
      const subTitle = '';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        maxWidth: "350px",
        data: { dialogData, isButtonShow: true,  message1: message1, message2: message2, message3: message3 },
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
      dialogRef.afterClosed().subscribe(res => {
        this.select.focus();
      })
    }

/*
  @Type: File, <ts>
  @Name: checkFormValueChaned function
  @Who: Adarsh singh
  @When: 14-June-2023
  @Why: EWM-11779.EWM-12547
  @What: check form data has been chnaged or not
*/
  checkFormValueChaned() {
    let initialValue:any = this.defaultJobStatusFormData;
    let val = this.jobStatusForm.value;
    let defaultObj = {
      CandidateProfileStatusId: initialValue?.CandidateProfileStatusId,
      CandidateReasonId: initialValue?.CandidateReasonId,
      CurrentStageDisplaySeq: initialValue?.CurrentStageDisplaySeq,
      FolderList: initialValue?.FolderList,
      FolderListId: initialValue?.FolderListId,
      IsRestricted: initialValue?.IsRestricted,
      NextStageDisplaySeq: initialValue?.NextStageDisplaySeq,
      NextStageId: initialValue?.NextStageId,
      NextStageName: initialValue?.NextStageName,
      RestrictedMessage: initialValue?.RestrictedMessage,
      RestrictedUntilDate: initialValue?.RestrictedUntilDate,
      SkipStageName: initialValue?.SkipStageName,
      level1: initialValue?.level1,
    }
    // this.getEditorVal=initialValue?.RestrictedMessage; //who:maneesh,what:ewm-15815 ewm-16342,when:18/03/2024

    let current = {
      CandidateProfileStatusId: val?.CandidateProfileStatusId,
      CandidateReasonId: val?.CandidateReasonId,
      CurrentStageDisplaySeq: val?.CurrentStageDisplaySeq,
      FolderList: val?.FolderList,
      FolderListId: val?.FolderListId,
      IsRestricted: val?.IsRestricted,
      NextStageDisplaySeq: val?.NextStageDisplaySeq,
      NextStageId: val?.NextStageId,
      NextStageName: val?.NextStageName,
      RestrictedMessage: val?.RestrictedMessage,
      RestrictedUntilDate: val?.RestrictedUntilDate,
      SkipStageName: val?.SkipStageName,
      level1: val?.level1,
    } 

   // console.log(defaultObj,'defaultObj');
   // console.log(current,'current');
    let res = JSON.stringify(defaultObj) != JSON.stringify(current);
    return res;
  }

/*
  @Type: File, <ts>
  @Name: screenMediaQuiryForSkills function
  @Who: Adarsh singh
  @When: 21-12-2021
  @Why: EWM-9369 EWM-9967
  @What: for showing data according to screen size
  */
 screenMediaQuiryForSkills() {
  if (this.forSmallSmartphones.matches == true) {
    this.maxMoreLength = 1;
  } else if (this.forSmartphones.matches == true) {
    this.maxMoreLength = 0;
  } else if (this.forLargeSmartphones.matches == true) {
    this.maxMoreLength = 1;
  } else if (this.forIpads.matches == true) {
    this.maxMoreLength = 1;
  } else if (this.forMiniLapi.matches == true) {
    this.maxMoreLength = 4;
  } else {
    this.maxMoreLength = 2;
  }
}

@HostListener("window:resize", ['$event'])
private onResize(event) {
  this.screenMediaQuiryForSkills();
}

  onCheckRequiredValidationField() {
    for (const key of Object.keys(this.jobStatusForm.controls)) {
      if (this.jobStatusForm.controls[key].invalid) {
        if (key === 'level1') {
          this.select?.focus();
        }
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  /*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 11-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/  
openImageUpload(): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this._appSettingsService.imageUploadConfigForKendoEditor['file_img_type_small'], size: this._appSettingsService.imageUploadConfigForKendoEditor['file_img_size_small'] }),
    panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    width: '100%'
  });
   dialogRef.afterClosed().subscribe(res => {
     if (res.data != undefined && res.data != '') {
       this.loading = true;
       if (res.event === 1) {
        this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
           this.editor.exec('insertImage', res);
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
           this.editor.exec('insertImage', res);
           this.loading = false;
         })
       }
     }
   })
}
// <!-- who:maneesh,what:ewm-13052 for fixed reset ,save,cancel btn,when:11/12/2023 -->
saveDiscription(data){ 
  if (data=='true') {
    this.isResponseGetdata = true;
  }
  this.isResponseGetdata = false;

}
// <!-- who:maneesh,what:ewm-13052 for fixed reset ,save,cancel btn,when:11/12/2023 -->
MessageCansel() {
  this.jobStatusForm.patchValue(({
    IsRestricted:false,
    RestrictedMessage:this.alertMessage
  }))
  this.getEditorVal=this.alertMessage; //who:maneesh,what:ewm-15815 ewm-16342,when:18/03/2024

  this.isRestrictedMessage = false;
}
// <!-- who:maneesh,what:ewm-13052 for fixed reset ,save,cancel btn,when:11/12/2023 -->
ResetDataForDiscription() {
  this.jobStatusForm.patchValue(({
    RestrictedMessage:''
  }))
  this.getEditorVal=null; //who:maneesh,what:ewm-15815 ewm-16342,when:18/03/2024

}
      
    //  @Who: maneesh, @When: 18-03-2024,@Why: EWM-16342-EWM-16207 @What: on changes on kendo editor catch the event here
      getEditorFormInfo(event) {
        const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
        ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
        this.ownerList = event?.ownerList;  
        this.jobStatusForm.get('RestrictedMessage').setValue(event?.val);

        if(event && event?.val && event?.val?.replace(/(<([^>]+)>)/ig, "")?.length !== 0) {
          this.showErrorDesc = false;
          this.jobStatusForm.get('RestrictedMessage').setValue(event?.val);
        }
         else if (event?.val=='' && sources==undefined){
          this.showErrorDesc = true;
          this.jobStatusForm.get('RestrictedMessage').setValue('');
          this.jobStatusForm.get('RestrictedMessage').setValidators([Validators.required]);

          this.jobStatusForm.get('RestrictedMessage').updateValueAndValidity();
          this.jobStatusForm.get("RestrictedMessage").markAsTouched();
        }     
            else if (sources==undefined && event?.val==null){
          this.showErrorDesc = true;
          this.jobStatusForm.get('RestrictedMessage').setValue('');
          this.jobStatusForm.get('RestrictedMessage').setValidators([Validators.required]);

          this.jobStatusForm.get('RestrictedMessage').updateValueAndValidity();
          this.jobStatusForm.get("RestrictedMessage").markAsTouched();
        }
        else {
          // this.showErrorDesc = true;
          // this.jobStatusForm.get('RestrictedMessage').setValue('');
          // this.jobStatusForm.get('RestrictedMessage').setValidators([Validators.required]);

          this.jobStatusForm.get('RestrictedMessage').updateValueAndValidity();
          this.jobStatusForm.get("RestrictedMessage").markAsTouched();
        }
      }

// adarsh singh on 9 April 2024 for EWM-16567
      public alertMaxCandidateAddInLastStage(){
        const jobHeadCount = this.allDetailsData?.JobHeadCount;
        const message = `${this.translateService.instant('label_candidate_Of_Job_HeaCount')} (${jobHeadCount}).
         ${this.translateService.instant('label_max_candidate_Of_Job_HeaCount')} (${jobHeadCount})
         ${this.translateService.instant('label_candidate_Of_Job_HeaCount_message')} 
         `
        const title = '';
        const subTitle = '';
        const dialogData = new ConfirmDialogModel(title, subTitle,message);
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          maxWidth: "350px",
          data: {dialogData,isButtonShow:true,message:message},
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
         
      }
  }
