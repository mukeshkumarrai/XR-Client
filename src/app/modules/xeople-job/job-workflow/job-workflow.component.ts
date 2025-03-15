/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: quickjob.component.ts
 @Who: Anup Singh
 @When: 16-july-2021
 @Why: EWM-2003 EWM-2158
 @What: quick job Section
 */

 import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
 import { MatDialog} from '@angular/material/dialog';
 import { ActivatedRoute, Router } from '@angular/router';
 import { TranslateService } from '@ngx-translate/core';
 import { MessageService } from '@progress/kendo-angular-l10n';
 import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
 import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
 import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
 import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
 import { ResponceData, Userpreferences } from 'src/app/shared/models';
 import { ButtonTypes } from 'src/app/shared/models';
 import { Subject, Subscription } from 'rxjs';
 import { debounceTime, takeUntil } from 'rxjs/operators';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { ViewWorkflowStagesComponent } from './view-workflow-stages/view-workflow-stages.component';
import { Title } from '@angular/platform-browser';

@Component({
  providers: [MessageService],
  selector: 'app-job-workflow',
  templateUrl: './job-workflow.component.html',
  styleUrls: ['./job-workflow.component.scss']
})
export class JobWorkflowComponent implements OnInit {
  public ascIcon: string;
  panelOpenState = false;
  loading: boolean;
  public userpreferences: Userpreferences;
  listData: any[] = [];
  selected = -1;
  public disableContinuebtn: boolean = true;
  WorkflowId:any;
  workflowId:any;
  workFlowLenght :any;
  animationVar: any;
  public maxCharacterLength:number;
  public TotalActiveJobs :any;
  public JobWithoutCandidate:any;
  public JobWithCandidate :any;
  public TotalCandidates :any;
  public TotalExpiredJobs :any;
  public TotalJobs:any;
  public loadingSearch: boolean;
  public searchVal: string ='';
  public loaderStatus: number;
  public workflowcolor: any;
  searchSubject$ = new Subject<any>();
  stagedata:any=[]
  JobCountWithIconObs: Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  public currentMenuWidth: number;
  workflowstageId:any
  // workflowIdData:any= [
  //   {
  //     "WorkflowId": "653a72f1-1542-4838-ba65-7d8f4bfc9c72",
  //     "TotalCandidates": 27,
  //     "JobWithCandidate": 1
  //   },
  //   {
  //     "WorkflowId": "8b4710d1-d9b4-4f0a-b9df-55ea8348b814",
  //     "TotalCandidates": 644,
  //     "JobWithCandidate": 11
  //   }
  // ]
  public workflowIdData: any[] = [];
  public baseData: any[] = [];
  public loadingCount: boolean;
  /*
 @Type: File, <ts>
 @Name: constructor function
 @Who: Anup Singh
 @When: 16-july-2021
 @Why: EWM-2003 EWM-2158
 @What: constructor for injecting services and formbuilder and other dependency injections
 */
  constructor(private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router,private commonserviceService: CommonserviceService,public dialog: MatDialog, private jobService: JobService,
    private translateService: TranslateService, private routes: ActivatedRoute,
    private titleService: Title,
    public _userpreferencesService: UserpreferencesService) {
  }
  ngOnInit(): void {
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
     /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
     this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.ascIcon = 'north';
    this.getJobCountWithIcon(this.searchVal);
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    this.workflowcolor="border-bottom: 3px solid #ed7e32";
    // this.getJobDetailsCount(workflowId)
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getFilterValue(val);
       });
       this.routes.queryParams.subscribe((parmsValue) => {
        this.workflowId = parmsValue.WorkflowId;
        this.TotalActiveJobs = parmsValue.TotalActiveJobs;
      });
      this.currentMenuWidth = window.innerWidth;
      this.detectScreenSize();
    sessionStorage.removeItem('joblandingCreatejob');
    sessionStorage.removeItem('jobLandingQuickFilter');
    //   const pageTitle= 'label_jobs';
    // const subpageTitle = ' | Worklow';
    //       this.commonserviceService.setTitle(pageTitle, subpageTitle);
  }

  // @Type: File, <ts>|@Name: detectScreenSize | @Who: Satya Prakash Gupta | @When: 31-Jul-23 | @Why: EWM-13294 EWM-13548 | @What: detectScreenSize for ... dot
  detectScreenSize(){
    if (this.currentMenuWidth > 240 && this.currentMenuWidth < 1150) {
      this.maxCharacterLength = 40;
    } else {
      this.maxCharacterLength = 60;
    }
  }

  @HostListener("window:resize", ['$event'])
  public onResize(event) {
    event.target.innerWidth;
    this.currentMenuWidth = event.target.innerWidth;
    this.detectScreenSize();
  }

  /*
  @Type: File, <ts>
  @Name: viewWorkflowStages
  @Who: maneesh
  @When: 07-Jan-23
  @Why: EWM-10386
  @What: to open view workflow modal
*/
workflowstageID:any;
viewWorkflowStages(WorkflowId) {
  this.workflowstageID=WorkflowId;
  const dialogRef = this.dialog.open(ViewWorkflowStagesComponent, {
    data: new Object({ workflowId: this.workflowstageID, isParentStages: true }),
    panelClass: ['xeople-modal-full-screen', 'workflow-sub-stages', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
}
  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId)?.classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList.remove(animationName)
  }

  /*
@Type: File, <ts>
@Name: goToCreateJob function
@Who: Anup Singh
@When: 19-july-2021
@Why: EWM-2003 EWM-2158
@What: for go to create job
*/
  goToCreateJob() {
    this.route.navigate(['/client/jobs/job/job-manage/create-job-selection', { workFlowLenght: this.workFlowLenght }],);
  }

  /*
@Type: File, <ts>
@Name: goToJobLandingPage function
@Who: Anup Singh
@When: 19-july-2021
@Why: EWM-2003 EWM-2158
@What: for go to job-landingPage
*/
  goToJobLandingPage() {
    this.route.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
  }
  /*
@Type: File, <ts>
@Name: reloadApiBasedOnorg function
@Who: Anup Singh
@When: 19-july-2021
@Why: EWM-2003 EWM-2158
*/

  reloadApiBasedOnorg() {
    this. getJobCountWithIcon(this.searchVal);
  }
/*
@Type: File, <ts>
@Name: checkUnchecked function
@Who: Anup Singh
@When: 19-july-2021
@Why: EWM-2003 EWM-2158
@What: for checked unchecked and disabled
*/
  checkUnchecked(index: any, WorkflowId) {
    this.selected = index;
    this.disableContinuebtn = false;
    this.route.navigate(['/client/jobs/job/job-list/list/' + WorkflowId ]);
  }

 /*
 @Type: File, <ts>
 @Name: getJobCountWithIcon function
 @Who:  maneesh
 @When: 31-Aug-2022
 @Why:  EWM-8432
 @What: For getJobCountWithIcon count the job list
  */
 getJobCountWithIcon(searchVal) {
    this.loading = true;
    this.JobCountWithIconObs = this.jobService.getJobCountWithIcon(searchVal).pipe(takeUntil(this.destroy$)).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
       if((repsonsedata['Data'] !=null) && (repsonsedata['Data'] !=undefined) && (repsonsedata['Data'].length==1)){
        this.route.navigate(['/client/jobs/job/job-list/list/'+repsonsedata['Data'][0].WorkflowId, {filter: 'TotalJobs'}]);
       }else{
        this.getAssignWorkflowIdToCandidate(repsonsedata?.Data);
        this.listData = repsonsedata.Data;
      }
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        this.listData = repsonsedata.Data;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       this.loading = false;
      }
    }, err => {
     this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
    /*
     @Type: File, <ts>
     @Name: onSearchFilterClear
     @Who:maneesh
     @When: 01-Sep-2022
     @Why: EWM-8432
     @What: For clear Filter search value
   */
     public onSearchFilterClear(): void {
      this.loadingSearch = false;
      this.searchVal = '';
      this. getJobCountWithIcon(this.searchVal)
    }
/*
 @Name: onFilter function
 @Who: maneesh
 @When: 01-Sep-2022
 @Why: EWM-8532
 @What: use for Searching records
*/
  public onFilter(inputValue: string): void {
    this.loading = false;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.searchSubject$.next(inputValue);
  }

  getFilterValue(searchVal){
    this.JobCountWithIconObs =this.jobService.getJobCountWithIcon(searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.loadingSearch = false;
          if (repsonsedata.Data) {
            this.listData = repsonsedata.Data;
          }
          }else if(repsonsedata.HttpStatusCode === 204){
          this.loadingSearch = false;
          this.listData = repsonsedata.Data;
          }
          else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

/*
 @Name: ngOnDestroy
 @Who: Nitin Bhati
 @When: 05-06-2023
 @Why: EWM-12708
 @What: use for unsubsribe service
*/
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.JobCountWithIconObs?.unsubscribe();
  }
/*
 @Name: getAssignWorkflowIdToCandidate
 @Who: Nitin Bhati
 @When: 10-08-2023
 @Why: EWM-13636
 @What: for assign workflowid for getting record of candidate
*/
  getAssignWorkflowIdToCandidate(workflowIdsData) {
        let workflowIds = [];
        workflowIdsData?.forEach(element => {
          workflowIds?.push(element?.WorkflowId);
        });
     this.getCandidateCountbyworkflowid_v1(workflowIds);
  }
/*
 @Name: getCandidatecountbyworkflowid_v1
 @Who: Nitin Bhati
 @When: 10-08-2023
 @Why: EWM-13636
 @What: for candidate count by workflow
*/
  getCandidateCountbyworkflowid_v1(workflowIds) {
      this.jobService.getCandidatecountbyworkflowid_v1(workflowIds).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata?.HttpStatusCode === 200) {
          this.getCalculationWorkflowCand(repsonsedata?.Data);
         }
      else if(repsonsedata?.HttpStatusCode === 400){
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       }
     },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
/*
 @Name: getCalculationWorkflowCand
 @Who: Nitin Bhati
 @When: 10-08-2023
 @Why: EWM-13636
 @What: Implemented logic for showing workflow candidate count
*/
  getCalculationWorkflowCand(workflowIdData){
    this.loadingCount=true;
    this.listData?.forEach( mainItem => {
      workflowIdData?.forEach( remainItem => {
         if(mainItem?.WorkflowId === remainItem?.WorkflowId){
          mainItem['TotalCandidates'] = remainItem['TotalCandidatesCount'];
          mainItem['JobWithCandidate'] = remainItem['CandidatesCount'];
          mainItem['JobWithoutCandidate'] = (mainItem['TotalJobs']-remainItem['CandidatesCount']>=0)?(mainItem['TotalJobs']-remainItem['CandidatesCount']):0;
         }
      })
     });
     this.loadingCount=false;
  }


}
