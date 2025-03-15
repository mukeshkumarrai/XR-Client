/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 18-May-2023
  @Why: EWM-11781 EWM-12518
  @What:  This page will be use for screening and interview ts file
*/

import { ChangeDetectorRef, Component, EventEmitter, HostListener, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateTimelineComponent } from '../../EWM.core/job/candidate-timeline/candidate-timeline.component';
import { JobService } from '../../EWM.core/shared/services/Job/job.service';
import { ActionsTab, ActivityOrChecklist, GridState, JobScreening, SaveJobStatusTab, candidateEntity } from 'src/app/shared/models/job-screening';
import { JobActivityCreateComponent } from './header-panel/job-activity-create/job-activity-create.component';
import { JobActivityListComponent } from './header-panel/job-activity-list/job-activity-list.component';
import { JobCandidateComponent } from './right-panel/job-candidate/job-candidate.component';
import { ConfirmDialogModel, UnsavedConfirmPopComponent } from 'src/app/shared/modal/unsaved-confirm-pop/unsaved-confirm-pop.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CandidateFolderService } from '../../EWM.core/shared/services/candidate/candidate-folder.service';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { JobActionsStoreService } from 'src/app/shared/services/commonservice/job-actions-store.service';
import { JobActionTabService } from 'src/app/shared/services/commonservice/job-action-tab.service';
import { ShowPendingMandatoryListPopComponent } from 'src/app/shared/modal/show-pending-mandatory-list-pop/show-pending-mandatory-list-pop.component';
import { ShortNameColorCode } from 'src/app/shared/models/background-color'
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { PushCandidatePageType } from './push-candidate-to-eoh/pushCandidate-model';
import { ApplicantDetailPopupComponent } from '../job-list/applicant-list/applicant-detail-popup/applicant-detail-popup.component';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { debug, log } from 'console';
import { JobChecklistComponent } from 'src/app/modules/xeople-job/job-screening/job-checklist/job-checklist.component';
import { JobCommentsComponent } from 'src/app/modules/xeople-job/job-screening/job-comments/job-comments.component';
enum Tab {
  'Application',
  'Notes',
  'Interview',
  // 'Comments',
  // 'Checklist',
  'EOH',
  'Status'
}

@Component({
  selector: 'app-job-screening',
  templateUrl: './job-screening.component.html',
  styleUrls: ['./job-screening.component.scss']
})
export class JobScreeningComponent implements OnInit {
  public classChange: string = "screening-and-interview-area-three";
  public viewModeFull: boolean = false;
  public viewModeTwo: boolean = false;
  public viewModeThree: boolean = true;
  public aathreeView: string = "threeView";
  jobdetailsData: any;
  CandidateId: any;
  public downloadresumeEnable: boolean = false;
  public fileName: any;
  public fileUrl: any;
  public userpreferences: Userpreferences;
  public candidateList: candidateEntity[] = [];
  public jobId: string;
  public JobWorkflowId: string;
  public dirctionalLang: string;
  public jobName: string;
  public loading: boolean = false;
  public tabLoading: boolean=false;
  public checklist: ActivityOrChecklist;
  public activity: ActivityOrChecklist;
  public Comments: number; 
  public tabIndex: number;
  public gridStateInfo: GridState;
  public canNextPreviousInfo: candidateEntity[] = [];
  public currentIndex = 0;
  @ViewChild('candidateComponent') candidateComponent: JobCandidateComponent;
  public jobInfo: JobScreening;
  ActiveCandidate: string = '';
  reloadData: boolean = false;
  animationVar: any;
  IsCandidateActive: any[] = [];
  previousIndex: number = -1;
  mobileQuery: MediaQueryList;
  subscription1: Subscription;
  jobStatusForm: any;
  jobNotesForm: any;
  jobCommentsForms: any;
  alertMessage = `<p>Hi {{Candidate.FullName}}, </p><p></p><p>Unfortunately, we are currently not accepting any further applications for the position you have applied for. We appreciate your interest in our company and thank you for taking the time to apply. Please note that we may reopen the application process later, and we encourage you to check our website for updates. We value your skills and qualifications and would be pleased to consider your application again when we resume the hiring process. Thank you for your understanding.</p><p></p><p>Best regards, </p><p>{{Jobs.NameOfhiringManager}} </p><p>{{Jobs.TitleofhiringManager}} </p><p>{{Jobs.Company}}</p>`;
  WorkFlowStageName: string;
  private _mobileQueryListener: () => void;
  public tabActive: string = 'Status';
  NextStageId: any;
  public nextStepValidationChecked: Subject<Boolean> = new BehaviorSubject(null)
  private actions: ActionsTab;
  jobActionInitialized = false;
  isNextStep = false;
  subscriptions: Subscription;
  ParentWorkFlowStageId:string;
  forAllMiniScreen: MediaQueryList;
  disableAllButton:boolean=false;
  activityActionForm: string="Add";
  closeButtonDisabled: boolean = false;
  ClientId: any;
  public hiddenClientTab:boolean=false;
  jobActionCandidateId: string;
  jobActionCandidateName: string;
  jobActionTabName: string;
  clientTabStatus:boolean=false;
  showingClientTab: boolean=false;
  ClientName: any;
  filter: string;
  selectjob: string;
  stageType: string;
  JobActionTabs: Array<any>;
  TabSource: string;
  public checkListResult = {
    JobName: '',
    Source:''
  }
  public commentResult = {
    Source:''
  }
  TimelinePopup:boolean=false;
  isLastSatgeCand: any;

  constructor(public dialog: MatDialog, private routes: ActivatedRoute, private route: Router,
    public dialogRef: MatDialogRef<JobScreeningComponent>,
    private translateService: TranslateService, private jobService: JobService,
    private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService, public _userpreferencesService: UserpreferencesService,
    public dialogModel: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private _appSettingsService: AppSettingsService, public _CandidateFolderService: CandidateFolderService,
    public _jobAction: JobActionsStoreService, private jobActionTabService: JobActionTabService,
    private pushCandidateEOHService: PushCandidateEOHService,public _CandidateService:CandidateService) {
    this.TimelinePopup=data?.TimelinePopup;
    this.jobInfo = data?.candidateInfo[0];
    this.candidateList = data?.candidateInfo[0]?.CandidateList;
    this.jobId = data?.candidateInfo[0]?.JobId;
    this.JobWorkflowId = data?.candidateInfo[0]?.WorkflowId;
    this.jobName = data?.candidateInfo[0]?.JobTitle;
    //Who:Ankit Rawat, What:EWM-17469 Pass JobName as input to bind checklist as model popup, When:3Jul24
    this.checkListResult.JobName=data?.candidateInfo[0]?.JobTitle;
    this.gridStateInfo = data?.candidateInfo[0]?.GridState;
    this.jobInfo['SelectedCandidate'] = data?.candidateInfo[0]?.CandidateList;
    this.ClientId = data?.candidateInfo[0]?.ClientId;
    this.clientTabStatus =this.ClientId=='00000000-0000-0000-0000-000000000000'?true:false;
    this.jobActionCandidateId = data?.candidateInfo[0]?.CandidateId;    
    this.jobActionCandidateName = data?.candidateInfo[0]?.CandidateName;
    this.jobInfo.PageName='candidateTab';
    this.jobInfo.ClientName=data?.candidateInfo[0]?.ClientName;
    this.jobInfo.JobReferenceId=data?.candidateInfo[0]?.JobReferenceId;
    this.isLastSatgeCand=data?.candidateInfo[0]?.isLastSatgeCand;
    this.commonserviceService.setJobScreeningInfo(this.jobInfo);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.IsCandidateActive = Array(this.candidateList.length).fill(false);
    this.actions = this.jobActionTabService.constants;
    this.forAllMiniScreen = media.matchMedia('(max-width: 1024px)');
    this.commonserviceService.jobClientId.next(this.ClientId);
    this.getCanidateTimelineCount(this.candidateList);
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges()
      this.screenMediaQuiry();
    };
  // who:maneesh,what:ewm-13775 for disabled client tab ,when:05/09/2023
    if (this.ClientId=='00000000-0000-0000-0000-000000000000' || this.ClientId==null || this.ClientId=='') {
      this.hiddenClientTab=true;
    } else{
      this.hiddenClientTab=false;
    }
    this.stageType=data?.candidateInfo[0]?.CandidateList[0]?.StageType;
  }
  ngOnInit(): void {
    this.routes.queryParams.subscribe((parmsValue) => {
      this.filter=parmsValue?.filter;
      this.selectjob=parmsValue?.selectjob;
    });
    this.jobactivityChecklistCount();
    if (this.candidateList.length == 1) {
      this.getCandidatemappedtojobcardAll(this.data?.candidateInfo[0]?.WorkFlowStageId);
    }
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    this.tabLoading = true;
    // <!---------@When: 13 Jun 24 @who:Ankit Rawat @Desc- get dynmaic job action menu  @Why:  EWM-17249--------->
    this.jobService.getjobactionconfiguration(this.JobWorkflowId,this.stageType).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.tabLoading = false;
          this.JobActionTabs=repsonsedata.Data;
        }
      },
      err => {
        this.tabLoading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })



    this.subscriptions = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      this.candidateList = res?.CandidateList;
      this.ParentWorkFlowStageId = res.WorkFlowStageId
      this.jobInfo = res;
      // <!---------@When: 21-06-2023 @who:Adarsh singh @Desc- show active candidate--------->
      if (this.candidateList?.length >0) {
        this.IsCandidateActive[0] = true;
        this.ActiveCandidate = this.candidateList[0].CandidateId;
        if (this.candidateList[0].IsProfileRead === 0) {
          let candArr: [string] = [this.candidateList[0]?.CandidateId];
          this.commonserviceService.candidateProfileReadUnread(candArr, this.jobId);
          this.candidateList[0].IsProfileRead = 1;
        }
      }
      // <!---------@When: 13 Jun 24 @who:Ankit Rawat @Desc- Changed menu after stage changed from status  @Why:  EWM-17249--------->
      if(this.reloadData && this.TabSource=='Status'){
        this.tabLoading = true;
        let stageType=this.jobInfo.CandidateList[0].StageType;
        let workFlowId=this.jobInfo.CandidateList[0].WorkFlowId;
        this.jobService.getjobactionconfiguration(workFlowId,stageType).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.tabLoading=false;
              this.JobActionTabs=repsonsedata.Data;
              this.setTabIndex('Status');
            }
          },
          err => {
            this.tabLoading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    })

    this.threeView();
    this.screenMediaQuiry();
    let obj:any = {
      pageType: PushCandidatePageType.Normal,
      candidateID: this.candidateList[0].CandidateId,
      showWarningAlert: true
    }
    this.pushCandidateEOHService.SetPushCandPageType.next(obj);
  }

  ngOnDestroy(): void {
    // this._jobAction.hasRequiredField.unsubscribe();
    // this._jobAction.status.unsubscribe();
    // this._jobAction.notes.unsubscribe();
    this._jobAction.isJobActionWindowClose.next(null);
    this.pushCandidateEOHService.SetPushCandPageType.next(null);
    this.pushCandidateEOHService.SetAlreadyPushCandInfo.next(null);
    this.subscriptions.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  screenMediaQuiry() {
    if (this.forAllMiniScreen.matches == true) {
      this.fullView();
      this.disableAllButton=true;
    } else {
      this.threeView();
      this.disableAllButton=false;
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.screenMediaQuiry()
  }

  /*
    @Type: File, <ts>
    @Name: fullView function
    @Who: Satya Prakash
    @When: 18-May-2023
    @Why: EWM-11781 EWM-12518
    @What: For change view mode
  */
  fullView() {
    this.classChange = "screening-and-interview-area-full";
    this.viewModeFull = true;
    this.viewModeTwo = false;
    this.viewModeThree = false;
    // this.aathreeView = "fullbbthreeView";
  }


  /*
    @Type: File, <ts>
    @Name: twoView function
    @Who: Satya Prakash
  @When: 18-May-2023
  @Why: EWM-11781 EWM-12518
    @What: For change view mode
  */
  twoView() {
    this.classChange = "screening-and-interview-area-two";
    this.viewModeFull = false;
    this.viewModeTwo = true;
    this.viewModeThree = false;
    // this.aathreeView = "twobbthreeView";
  }
  /*
    @Type: File, <ts>
    @Name: threeView function
    @Who: Satya Prakash
    @When: 18-May-2023
    @Why: EWM-11781 EWM-12518
    @What: For change view mode
  */
  threeView() {
    this.classChange = "screening-and-interview-area-three";
    this.viewModeFull = false;
    this.viewModeTwo = false;
    this.viewModeThree = true;
    // this.aathreeView = "bbthreeView";
  }

  /*
 @Type: File, <ts>
 @Name: onDismiss function
 @Who:  Satya Prakash Gupta
 @When: 18-May-2023
 @Why: EWM-11781 EWM-12518
 @What: For cancel popup
*/
  onDismiss(): void {
    let jobActionMasterArr: any;
    let isAnyFormValueChanged: any;
    let isformGroupInfoChanged: any;
    this._jobAction.isJobActionWindowClose.next(true);
    setTimeout(() => {
      jobActionMasterArr = this._jobAction?.getRunner();
      if (jobActionMasterArr?.length > 0) {
        isAnyFormValueChanged = jobActionMasterArr?.filter((e: any) => e?.isChanged === true);
        isformGroupInfoChanged = isAnyFormValueChanged?.filter((x: any) => x?.formGroupInfo?.status == 'VALID');
      }
      if (isformGroupInfoChanged?.length > 0) {
        const message = '';
        const title = '';
        const subTitle = 'label_unsavedMessage';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(UnsavedConfirmPopComponent, {
          maxWidth: "420px",
          data: dialogData,
          panelClass: ['custom-modalbox', 'custom-confirmation', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res?.mode === true) {
            jobActionMasterArr.forEach((e: any) => {
              // STATUS BLOCK
              if (e?.isChanged && e?.tabName === "STATUS_INFO") {
                if (e?.formGroupInfo.status == "INVALID") {
                  this.isNextStep = true;
                  if (this.isNextStep) {
                    //this.tabIndex = 4;
                    this.setTabIndex('Status');
                  }
                  setTimeout(() => {
                    this._jobAction.hasRequiredFieldStatus.next(true);
                    this.isNextStep = false;
                  }, 300);
                  return
                }
                else {
                  this.isNextStep = true;
                  this.jobStatusForm = e.formGroupInfo.value;
                  this.onSubmitAndCheckStage();
                }
              }
              // END

              // NOTES BLOCK
              if (e?.isChanged && e?.tabName === "NOTES_INFO") {
                if (e?.formGroupInfo.status == "INVALID") {
                  this.isNextStep = true;
                  if (this.isNextStep) {
                    //this.tabIndex = 1;
                    this.setTabIndex('Notes');
                  }
                  setTimeout(() => {
                    this._jobAction.hasRequiredFieldNotes.next(true);
                    this.isNextStep = false;
                  }, 300);
                  return
                }
                else {
                  this.isNextStep = true;
                  this.jobNotesForm = e.formGroupInfo.value;
                  this.createJobNotes(this.jobNotesForm);
                }
              }
              // END

              // COMMENTS BLOCK
              if (e?.isChanged && e?.tabName === "COMMENTS_INFO") {
                if (e?.formGroupInfo.status == "INVALID") {
                  this.isNextStep = true;
                  if (this.isNextStep) {
                    this.tabIndex = 2;
                  }
                  setTimeout(() => {
                    this._jobAction.hasRequiredFieldComments.next(true);
                    this.isNextStep = false;
                  }, 300);
                }
                else {
                  this.isNextStep = true;
                  this.jobCommentsForms = e.formGroupInfo.value;
                  this.createJobActionComments(this.jobCommentsForms);
                }
              }
              // end
            });
          }
          else if (res.mode === 1){
            // nothing to do in this case
          }
          else{
            this.resetServices();
            this.closeUnsavedModal();
          }
        })
      }
      else {
        this.closeUnsavedModal();
        this.resetServices();
      }
    }, 300);
  }
  closeUnsavedModal() {
    document.getElementsByClassName("screening-and-interview-animation")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("screening-and-interview-animation")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ event: true, reloadData: this.reloadData }); }, 200);
  }

  resetServices() {
    this._jobAction.setActionRunnerFn(this.actions.STATUS_INFO, null);
    this._jobAction.setActionRunnerFn(this.actions.NOTES_INFO, null);
    this._jobAction.setActionRunnerFn(this.actions.COMMENTS_INFO, null);
    this._jobAction.status.next(null);
    this._jobAction.notes.next(null);
    this._jobAction.comments.next(null);

    this._jobAction.hasRequiredFieldStatus.next(null);
    this._jobAction.onJobStatusTabChange.next(null);
    this._jobAction.resetJobStatusFormOnSuccess.next(null);
    this._jobAction.onStageAlreadyMappedError.next(null);

    this._jobAction.onJobNotesTabChange.next(null);
    this._jobAction.hasRequiredFieldNotes.next(null);
    this._jobAction.resetJobNotesFormOnSuccess.next(null);

    this._jobAction.onJobCommentsTabChange.next(null);
    this._jobAction.hasRequiredFieldComments.next(null);
    this._jobAction.resetJobCommentsFormOnSuccess.next(null);
    this.commonserviceService?.notestimestampResponce?.next(null);

       /*****@WHY: EWM-17289 EWM-17887 @WHO: RENU @WHAT: TO RESET ALL VALUES IF DIRECTLY CLICK ON CROSS BUTTON OF JOB ACTION */
       this._jobAction.setActionRunnerFn(this.actions.SCREENING_INFO, null);
       this._jobAction.setActionRunnerFn(this.actions.SCREENING_CANDIDATE_PROFILE_INFO, null);
         this._jobAction.setActionRunnerFn(this.actions.SCREENING_NOTES_INFO, null);
       this._jobAction.screening.next(null);
       this._jobAction.candidateProfile.next(null);
       this._jobAction.notesProfile.next(null);
       this.pushCandidateEOHService.SetAlreadyPushCandInfo.next(null);
       this.pushCandidateEOHService.SetOfficeChangeAlert.next(null);

  }
  /*
   @Name: sortName function
   @Who: Renu
   @When: 24-05-2023
   @Why: EWM-11781 EWM-12517
   @What: For showing shortname on image icon
   */
  sortName(fisrtName, lastName) {
    if (fisrtName || lastName) {

      const Name = fisrtName + " " + lastName;

      const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');

      let first = ShortName1.slice(0, 1);
      let last = ShortName1.slice(-1);
      let ShortName = first.concat(last.toString());

      return ShortName.toUpperCase();

    }
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
    @Name: openCandidateDetails function
    @Who: Renu
    @When: 24-05-2023
    @Why: EWM-11781 EWM-12517
    @What: For showing candidate detials information on click
    */
  // @When: 04-04-2024 @who:Amit @why: EWM-16599 @what: class change
  openCandidateDetails(candId: any) {
    let candidatelist=[];
    candidatelist.push(candId);
    candidatelist?.forEach(element => {
      element["CandidateEmail"] = element?.EmailId,
      element["CandidateImage"] = element?.PreviewUrl,
      element["ShortName"] = element?.ShortName,
      element["Name"] = element?.CandidateName
    });
    this.dialog.open(ApplicantDetailPopupComponent, {
      data: { 'candidatedata': candidatelist[0],JobId:this.jobId},
      panelClass: ['xeople-candidate-info-card', 'open-candidate-details', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    // RTL code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  /*
    @Name: openJobTimeline function
    @Who: Renu
    @When: 24-05-2023
    @Why: EWM-11781 EWM-12517
    @What: For showing candidate job timeline
    */
  openJobTimeline(candidateId: string) {
    const dialogRef = this.dialog.open(CandidateTimelineComponent, {
      data: { candidateId: candidateId, jobId: this.jobId, workflowId: this.JobWorkflowId,TimelinePopup:this.TimelinePopup },
      panelClass: ['xeople-modal-lg', 'candidateTimeline', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    // RTL Code
    let dir: string;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  /*
    @Name: jobactivityChecklistCount function
    @Who: Renu
    @When: 25-05-2023
    @Why: EWM-11781 EWM-12517
    @What: For showing checklist & Activity count
  */
  jobactivityChecklistCount() {
    this.loading = true;
    let obj = {}
    obj['JobId'] = this.jobId;
    obj['WorkflowStageId'] = this.data?.candidateInfo[0]?.WorkFlowStageId;
    obj['CandidateId'] = this.candidateList.map(function (i) {
      return i['CandidateId'];
    });
    this.jobService.jobactivityChecklistCount(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.checklist = repsonsedata.Data?.Checklist;
          this.activity = repsonsedata.Data?.Activity;
          this.Comments=repsonsedata.Data?.Comments;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Type: File, <ts>
    @Name: openCheckList
    @Who: Renu
    @When: 16-Aug-2021
    @Why: EWM-2199 EWM-2531
    @What: for getting the active tab and load data checklist
  */
  openCheckList() {
    this.tabIndex = 2;
  }

  /*
     @Type: File, <ts>
     @Name: getCandidatemappedtojobcardAll function
     @Who: Renu
     @When: 26-May-2023
     @Why: EWM-11781 EWM-12517
     @What: For getting all candidate list on single candidate selection
   */
  getCandidatemappedtojobcardAll(nextSategId) {
    const formdata = {
      JobId: this.gridStateInfo?.JobId,
      GridId: this.gridStateInfo?.GridId,
      JobFilterParams: this.gridStateInfo?.JobFilterParams,
      search: this.gridStateInfo?.search,
      PageNumber: this.gridStateInfo?.PageNumber,
      PageSize: this.gridStateInfo?.PageSize,
      OrderBy: this.gridStateInfo?.OrderBy,
      Source: this.gridStateInfo?.Source,
      WorkflowId: this.JobWorkflowId,
      StageId: nextSategId ? nextSategId : this.data?.candidateInfo[0]?.WorkFlowStageId
    }
    this.jobService.getCandidatemappedtojobcardAll(formdata).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.ParentWorkFlowStageId = repsonsedata.Data.CardBody[0].ParentId;
          if (nextSategId) {
            this.canNextPreviousInfo = repsonsedata.Data.CardBody.filter(x => x['ParentId'] = nextSategId)[0]?.Candidates;
          }
          else {
            this.canNextPreviousInfo = repsonsedata.Data.CardBody.filter(x => x['ParentId'] == this.data?.candidateInfo[0]?.WorkFlowStageId)[0]?.Candidates;
          }
          if (this.candidateList.length == 1) {
            this.currentIndex = this.canNextPreviousInfo.findIndex(x => x.CandidateId === this.candidateList[0]?.CandidateId);
          }

          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 204) {

          this.loading = false;
        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }

  /*
  @Type: File, <ts>
  @Name: nextRecord function
  @Who: Renu
  @When: 26-May-2023
  @Why: EWM-11781 EWM-12517
  @What: For getting next candidate in list within stage
*/
  nextRecord() {
    let next = (this.currentIndex += 1);
    if (next > this.canNextPreviousInfo.length - 1) {
      this.currentIndex = this.currentIndex === 0 ? this.canNextPreviousInfo.length - 1 : this.currentIndex - 1;
      return;
    }
    let nextRecord = this.canNextPreviousInfo[next];
    this.candidateList = [nextRecord];
    this.jobInfo.CandidateList = [...this.candidateList];
    this.jobInfo.SelectedCandidate = [...this.candidateList];
    this.commonserviceService.setJobScreeningInfo(this.jobInfo);
  }

  /*
  @Type: File, <ts>
  @Name: previousRecord function
  @Who: Renu
  @When: 26-May-2023
  @Why: EWM-11781 EWM-12517
  @What: For getting previous candidate list with in same stage
*/
  previousRecord() {
    let next = (this.currentIndex -= 1);
    if (next < 0) {
      this.currentIndex = this.currentIndex === this.canNextPreviousInfo.length - 1 ? 0 : this.currentIndex + 1;
      return;
    }
    let nextRecord = this.canNextPreviousInfo[next];
    this.candidateList = [nextRecord];
    this.jobInfo.CandidateList = [...this.candidateList];
    this.jobInfo.SelectedCandidate = [...this.candidateList];
    this.commonserviceService.setJobScreeningInfo(this.jobInfo);
  }

  /*
  @Type: File, <ts>
  @Name: getcanJobActivities function
  @Who: Renu
  @When: 26-May-2023
  @Why: EWM-11783 EWM-12522
  @What: get candidate Job avtivity details (completed/ total)
*/
  getcanJobActivities(eventFor: string) {
    const dialogRef = this.dialog.open(JobActivityListComponent, {
      data: { eventFor: eventFor,activityStatus:false },
      /* @When: 03-07-2023 @who:Amit @why:12973 @what: popup size & class change */
      panelClass: ['xeople-drawer', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
  }

  /*
   @Type: File, <ts>
   @Name: createactivity function
   @Who: Renu
   @When: 26-May-2023
   @Why: EWM-11783 EWM-12522
   @What: create Activity
 */
  createActivity() {
    const dialogRef = this.dialog.open(JobActivityCreateComponent, {
      data: {activityActionForm: this.activityActionForm},
      panelClass: ['xeople-drawer-lg', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });

    // RTL Code
    let dir: string;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  isReloadApi:boolean;
  openCandidateInfoDetails(candInfo: candidateEntity, index: any) {
    if (this.candidateList?.length === 1) {
      return;
    }
    let isCandidateActive:boolean = false;
    this.commonserviceService.JobScreeningCandidateObs.next(candInfo);
    let obj:any = {
      pageType: PushCandidatePageType.Normal,
      candidateID: candInfo?.CandidateId,
      showWarningAlert: true
    }
    this.pushCandidateEOHService.SetPushCandPageType.next(obj)

    // <!---------@When: 21-06-2023 @who:Adarsh singh @Desc- Stop calling function when I'm on same candidate --------->
    if (candInfo?.CandidateId === this.ActiveCandidate) {
      isCandidateActive = true;
      //this.candidateComponent.getCandidateResumeCoverLetter(this.ActiveCandidate, true);
      return;
    }
    // End
    this.jobInfo['SelectedCandidate'] = [];
    this.ActiveCandidate = candInfo.CandidateId;
    // this.IsCandidateActive[index]=!this.IsCandidateActive[index];
    if (this.previousIndex >= 0 && this.previousIndex != index) {
      this.IsCandidateActive[this.previousIndex] = false;
    }
    this.previousIndex = index;
    this.IsCandidateActive[index] = !this.IsCandidateActive[index];

    if (this.IsCandidateActive[index]) {
      //this.candidateComponent.getCandidateResumeCoverLetter(this.ActiveCandidate, false);
      // @When: 03-07-2023 @who:Adarsh singh @EWM-12937
      if (candInfo.IsProfileRead === 0) {
        this.isReloadApi = true;
        if (this.isReloadApi) {
          this.getReloadDataEvent(true);
        }
      }
      this.jobInfo['SelectedCandidate'] = [candInfo];
      if (!isCandidateActive) {
        //this.jobInfo.PageName='candidateTab';
        this.commonserviceService.setJobScreeningInfo(this.jobInfo);
      }
      // <!---------@When: 03-07-2023 @who:Adarsh singh @why: EWM-12937 --------->
        this.profileRead(candInfo);
      // End
    } else {
      this.jobInfo['SelectedCandidate'] = this.candidateList;
      if (!isCandidateActive) {
        //this.jobInfo.PageName='candidateTab';
        this.commonserviceService.setJobScreeningInfo(this.jobInfo);
      }
       // <!---------@When: 03-07-2023 @who:Adarsh singh @why: EWM-12937 --------->
       this.profileRead(candInfo);
       // End
    }
    this.ActiveCandidate = candInfo?.CandidateId;
  }

  profileRead(candInfo){
     // <!---------@When: 03-07-2023 @who:Adarsh singh @why: EWM-12937 --------->
     if (candInfo.IsProfileRead === 0) {
      let candArr: [string] = [candInfo?.CandidateId];
      this.commonserviceService.candidateProfileReadUnread(candArr, this.jobId);
      candInfo.IsProfileRead = 1;
    }
    // End
  }
// @suika @EWM-11782 Whn 01-06-2023 To send reload api event on data saving.
  getReloadDataEvent(event) {
    if (event) {
      this.reloadData = true;
      this.TabSource='Status';
    } else {
      this.reloadData = false;
    }
  }

  ActiveTab(event) {
    this.tabActive = Tab[event.index];
     switch (this.tabActive) {
      case ('STATUS_INFO'):
        this._jobAction.onJobStatusTabChange.next(true);
        break;

      case ('NOTES_INFO'):
        this._jobAction.onJobNotesTabChange.next(true);
        break;

      case ('COMMENTS_INFO'):
        this._jobAction.onJobCommentsTabChange.next(true);
        break;
    }
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
      JobHeadCount: this.jobInfo?.JobHeadCount
    }
    return payload;
  }

  /*
    @Name: onSaveJobStaus
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: save all methode
  */
  saveJobStatusForm() {
    let formValueObj = this.storedPayloadForSend(this.jobStatusForm);
    this._CandidateFolderService.saveJobActionStatus(formValueObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.getReloadDataEvent(true);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.HttpStatusCode);
          this._jobAction.resetJobStatusFormOnSuccess.next(true);
          let jobActionMasterArr = this._jobAction.getRunner();
          let res = jobActionMasterArr.filter(e => {
            return e !== null
          })
          if (res?.length === 0) {
            this.closeUnsavedModal();
            this.resetServices();
          }
        } else {
          if (repsonsedata.Message === '400042') {
            this._jobAction.onStageAlreadyMappedError.next(true);
            this.stagesAlreadyMappped();
            //this.tabIndex = 4;
            this.setTabIndex('Status');
          }
          else if (repsonsedata.Message === "400058") {
            this.alertMaxCandidateAddInLastStage();
          }
           else {
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
      data: { dialogData, isButtonShow: true, message1: message1, message2: message2, message3: message3 },
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

    })
  }
  /*
      @Name: createJobNotes
      @Who: Adarsh singh
      @When: 18-May-2023
      @Why: EWM-11779.EWM-12547
      @What: Create Notes
  */
  createJobNotes(value) {
    let AddNotesObj = {};
    AddNotesObj['JobId'] = value.JobId;
    AddNotesObj['NotesDate'] = value.NotesDate;
    AddNotesObj['CategoryId'] = value.Category?.Id;
    AddNotesObj['CategoryName'] = value.Category?.CategoryName;
    AddNotesObj['WorkflowStageName'] = value?.WorkflowStageName;
    AddNotesObj['WorkflowStageId'] = value?.WorkflowStageId;
    AddNotesObj['Subject'] = value?.Subject;
    AddNotesObj['Description'] = value?.Description === null ? '' : value?.Description;
    AddNotesObj['Attachment'] = value?.filePath;
    AddNotesObj['AttachmentName'] = value?.uploadedFileName;
    AddNotesObj['AccessId'] = value?.AccessId;
    AddNotesObj['AccessName'] = value?.AccessName;
    AddNotesObj['GrantAccesList'] = value?.accessEmailId;
    AddNotesObj['NotesURL'] = window.location.href;
    AddNotesObj['RelatedToIds'] = value?.RelatedToIds;

    this.jobService.AddJobNotesAll(AddNotesObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this._jobAction.resetJobNotesFormOnSuccess.next(true);
            let jobActionMasterArr = this._jobAction.getRunner();
            this.getReloadDataEvent(true);
            let res = jobActionMasterArr.filter(e => {
              return e !== null
            })
            if (res?.length == 0) {
              this.closeUnsavedModal();
              this.resetServices();
            }
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          }
        }, err => {
          // this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });
  }

  /*
    @Name: onSubmitAndCheck stage function
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: submit and check stages condiions
  */
  onSubmitAndCheckStage() {
    let formValueObj = this.storedPayloadForSend(this.jobStatusForm);
    this.jobService.checkCandidateMoveAction(formValueObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          // check pending checklist
          this.saveJobStatusForm();
          // if (repsonsedata.Data?.CheckListData?.CheckList?.length === 0) {
          //   this.saveJobStatusForm();
          // }
          // else{
          //   this.showPendingChecklistAssessmentPopUp(repsonsedata.Data?.CheckListData);
          // }
        }
        else if (repsonsedata.HttpStatusCode === 400) {
          if (repsonsedata.Message == '400041') {
            // this.alertValidationOfStages(repsonsedata.Data.SkipStageName);
          }
          else if (repsonsedata.Message === '400042') {
            this._jobAction.onStageAlreadyMappedError.next(true);
            this.stagesAlreadyMappped();
            //this.tabIndex = 4;
            this.setTabIndex('Status');
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          }
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
  getCandidateJobCardAll(nextSategId: string) {
    this.getCandidatemappedtojobcardAll(nextSategId);
  }

  /*
    @Name: alertValidationOfStages
    @Who: Adarsh singh
    @When: 31-May-2023
    @Why: EWM-11779.EWM-12547
    @What: show alert while any error in matching condions of satges
  */
  showPendingChecklistAssessmentPopUp(data) {
    const message = 'label_pendingChecklistAssessmentMessage';
    const dataArr = data;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ShowPendingMandatoryListPopComponent, {
      maxWidth: "350px",
      data: { dialogData, checklistAssessment: dataArr },
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

    })
  }

  /*
    @Name: addJobActionComment function
    @Who: Adarsh Singh
    @When: 18-06-2023
    @Why: EWM-12640
    @What: Add Job Action Comments
  */
  createJobActionComments(value) {
    let AddObj = {};
    AddObj['JobId'] = value.JobId;
    AddObj['JobName'] = value.JobName;
    AddObj['Candidates'] = value.RelatedToIds;
    AddObj['ParentStageId'] = value.ParentStageId;
    AddObj['ParentStageName'] = value.ParentStageName
    AddObj['ChildStageId'] = value.ChildStageId;
    AddObj['ChildStageName'] = value.ChildStageName;
    AddObj['Comment'] = value.JobComments;
    this.jobService.addJobActionComments(AddObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.HttpStatusCode);
          this.loading = false;
          this._jobAction.resetJobCommentsFormOnSuccess.next(true);
          let jobActionMasterArr = this._jobAction.getRunner();
          this.getReloadDataEvent(true);
          let res = jobActionMasterArr.filter(e => {
            return e !== null
          })
          if (res?.length == 0) {
            this.closeUnsavedModal();
            this.resetServices();
          }

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
  @Name: getBackgroundColor function
  @Who: Bantee Kumar
  @When: 23-06-2023
  @Why: EWM-7926
  @What: set background color
*/
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0].toUpperCase()]
    }
  }

   /*
   @Name: isFormValuePatched function
   @Who: Adarsh singh
   @When: 14-July-2023
   @Why: EWM-13150
   @What: set background color
 */
   isFormValuePatched(event){
    this.closeButtonDisabled = event;
  }
  selectedTabValue(event){
      this.jobActionTabName=event?.tab?.textLabel?.toLowerCase();
      if(event?.tab?.textLabel?.toLowerCase()=='client'){
        this.jobInfo.PageName='clientTab';
        this.commonserviceService.setJobScreeningInfo(this.jobInfo);
        this.jobActionTabName=event?.tab?.textLabel?.toLowerCase();
        this.showingClientTab=true;
      }else if(event?.tab?.textLabel?.toLowerCase()=='candidate'){
        this.jobInfo.PageName='candidateTab';
        this.commonserviceService.setJobScreeningInfo(this.jobInfo);
        this.jobActionTabName=event?.tab?.textLabel?.toLowerCase();
        this.showingClientTab=false;
      }

  }

// adarsh singh on 9 April 2024 for EWM-16567
  public alertMaxCandidateAddInLastStage(){
    const jobHeadCount = this.jobInfo?.JobHeadCount;
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

  redirectCandidateSummary(CandidateId) { //by maneesh fixed tanent when:06/08/2024
    let URL = '/client/cand/candidate/candidate?CandidateId='+CandidateId+'&Type='+'CAND'+'&cantabIndex='+0;
    window.open(URL, '_blank')
  } 

  getCanidateTimelineCount(candidateList) {
    let CandId = []
    candidateList?.forEach(e => {
      CandId?.push({
        "CandidateId": e.CandidateId
      })
      });
      // by maneesh change payload for ewm-17228 when:24/06/2024
     let CandidateTimelines=    {
         "WorkflowId": this.JobWorkflowId,
         "CandidateTimelines": CandId
       }
    this._CandidateService.getCanidateTimelineCount(CandidateTimelines).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          let candidateListCount = repsonsedata?.Data;
          this.candidateList?.forEach(array1Ttem => {
             candidateListCount?.forEach(array2Item => {
              if(array1Ttem?.CandidateId === array2Item?.CandidateId){
               array1Ttem['ActiveJobs'] = array2Item?.Count
              }                        
           })
         });
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  setTabIndex(tabName){
      const tabIdx=this.JobActionTabs.findIndex(tab=>tab.TabName==tabName)
      if (tabIdx !== -1){
          this.tabIndex=tabIdx;
        }
      else{
          this.tabIndex=this.JobActionTabs.findIndex(tab=>tab.TabName == 'Notes');
      }
  }
  /*
  @Type: File, <ts>
  @Name: openProximitySearchDialog function
  @Who: Ankit Rawat
  @When: 04-March-2024
  @Why: EWM-16158 EWM-16310
  */
  openCheckListDialog() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(JobChecklistComponent, {
      panelClass: ['xeople-modal-lg', 'xeopleSmartEmailModal', 'animate__animated', 'animate__zoomIn'],
      data: { 'checkListData': this.checkListResult},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  openCommentDialog(){
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(JobCommentsComponent, {
      panelClass: ['xeople-modal-lg', 'xeopleSmartEmailModal', 'animate__animated', 'animate__zoomIn'],
      //data: { 'checkListData': this.checkListResult},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  
}
