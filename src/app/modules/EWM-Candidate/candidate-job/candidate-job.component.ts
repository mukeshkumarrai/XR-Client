/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup Singh
  @When: 19-oct-2021
  @Why:EWM-3039 EWM-3407
  @What:  This page will be use for job of candidate Component ts file
*/

import { Component, EventEmitter, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { fadeInRightBigAnimation } from 'angular-animations';
import { Subject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CandidatejobmappingService } from 'src/app/shared/services/candidate/candidatejobmapping.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../EWM.core/shared/services/candidates/candidate.service';
import { JobService } from '../../EWM.core/shared/services/Job/job.service';
import { QuickJobService } from '../../EWM.core/shared/services/quickJob/quickJob.service';
import { JobWorkflowStageComponent } from './job-workflow-stage/job-workflow-stage.component';
import { Location } from '@angular/common';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { RestrictCandidateComponent } from '@app/modules/xeople-job/job-detail/search-candidate/restrict-candidate/restrict-candidate.component';
import { RouterData } from '@mainshared/enums/router.enum';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-candidate-job',
  templateUrl: './candidate-job.component.html',
  styleUrls: ['./candidate-job.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class CandidateJobComponent implements OnInit {

  public loading: boolean;
  public positionMatDrawer: string = 'end';
  public isAsignJob: boolean = false;
  gridListData: any[]=[];
  public userpreferences: Userpreferences;
  public sortDirection = 'asc';
  public sortingValue: string = "JobTitle,asc";
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';
  public sort: any[] = [{
    field: 'JobTitle',
    dir: 'asc'
  }];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
 // candidateId: any;

  public pageSizeOptions;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;

  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  viewMode: string = 'listMode';
  @Output() assignJobCount = new EventEmitter();
  public totalDataCount: number;
  @Input() candidateId:any;
   // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size

  public getAllJobDataSub:any;
  searchSubject$ = new Subject<any>();
  animationVar: any;
  activatedRoute:any;
  JobId:any;
  triggerOrigin: any;
  overlayCandidateProfile:boolean = false;
  candidateProfileDrwer:boolean = false;
  candidateProfileDrwerForEdit:boolean = false;
  userType: any;
  dirctionalLang;
  overlayAssignJob:boolean;
  public currentJobId:string;  //@suika @whn 28-03-2023 @reset jobId on route url
  // get config Adarsh EWM-11971 19APRIL2023
public colArr: any = [];
public columns: ColumnSetting[] = [];  
filterConfig: any = [];
public filterAlert: any = 0;
public quickFilterStatus: number = 0;
@ViewChild(GridComponent) public grid: GridComponent;
public dynamicFilterArea: boolean = false;
filterCount: number;
public columnsWithAction: any[] = [];
//public GridId: any = 'JobCandidateGrid001';
@Input() GridId:any;  /*--@who:@Nitin Bhati,@when:24-04-2023, @why:EWM-12065--*/
gridColConfigStatus:boolean=false;
@Input() IsRestricted: any; /*-@Why: EWM-12714,@When: EWM-12-06-2023,@Who: Nitin Bhati--*/
@Input() AlertMessage: any; 
public IsJobClosed:number
  constructor(private route: Router, private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService, private _services: DocumentService,
    private _service: CandidatejobmappingService, private translateService: TranslateService, private snackBService: SnackBarService,
    private quickJobService: QuickJobService, private renderer: Renderer2, private jobService: JobService, private mailService: MailServiceService,
     public candidateService: CandidateService,private _location: Location,private ngZone: NgZone) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = appSettingsService.pagesize;
  }

  ngOnInit(): void {
    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });

    this.getFilterConfig();
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    this.routes.queryParams.subscribe((value) => {
      if(value.CandidateId!=undefined && value.CandidateId!=null && value.CandidateId!=''){
       this.candidateId = value.CandidateId;
      }
      if (value['Type']) {
        this.userType = true;
      }else{
        this.userType = false;
      }
    });

    this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {   
      this.loadingSearch = true;
      this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, val, true, false);
       });
   //who:maneesh,when:13/02/2033,what :ewm-10466 this.animationVar,ButtonTypes
    this.animationVar = ButtonTypes;

  }

/* 
@Type: File, <ts>
@Name: ngOnDestroy
@Who: Adarsh Singh
@When: 18-APRIL-2023
@Why: EWM-11971
@What: calling configuation while user has leave the page
*/
ngOnDestroy() {
  const columns = this.grid?.columns;
  /*--@who:@Nitin Bhati,@when:24-04-2023, @why:EWM-12065--*/
  if(columns){
    const gridConfig = {
      columnsConfig: columns.toArray().map(item => {
        return Object.keys(item)
          .filter(propName => !propName.toLowerCase()
            .includes('template'))
          .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
      }),
    };
    this.setConfiguration(gridConfig.columnsConfig);
  }
  
}


  /*
@Type: File, <ts>
@Name: closeDrawerAssignJob
@Who: Anup Singh
@When: 19-oct-2021
@Why:EWM-3039 EWM-3407
@What: to open Drawer
*/

closeDrawerAssignJob() {
    this.isAsignJob = false;
  }

  /* 
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: Amit Rajput
  @When: 19-Jan-2022
  @Why: EWM-4368 EWM-4526
  @What: creating animation
*/

animate() {
  this.animationState = false;
  setTimeout(() => {
    this.animationState = true;
  }, 0);
}
delaAnimation(i:number){
  if(i<=25){
    return 0+i*80;
  }
  else{
    return 0;
  }
}

  /*
@Type: File, <ts>
@Name: dirChange
@Who: Anup Singh
@When: 19-oct-2021
@Why:EWM-3039 EWM-3407
@What: for ltr and rtr
*/
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }

  /*
@Name: getCandidateListByJob function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  getCandidateListByJob(candidateId: any, pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, isSearch: boolean, isScroll:boolean) {
    
    if (isSearch == true) {
      this.loading = false;
    } else if(isScroll) {
      this.loading = false;
    }else{
      this.loading = true;
    }
    this.getAllJobDataSub =  this.jobService.fetchJobMappedToCandidateAll
      ("?CandidateId=" + candidateId + "&search=" + searchValue + "&PageNumber=" + pagneNo + "&PageSize=" + pagesize + "&OrderBy=" + sortingValue)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.animate();
            if(isScroll){
              let nextgridView = [];
              nextgridView = data['Data'];
              this.gridListData = this.gridListData.concat(nextgridView);
            }else{
              this.gridListData = data.Data;
            }
           /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064,@what:For showing auto fit--*/
          if(this.gridColConfigStatus){
            this.fitColumns();
          }
            this.totalDataCount = data.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
            this.loadingSearch = false;
            // this.loadingAssignJobSaved = false;
          }
          else if (data.HttpStatusCode === 204) {
            if(isScroll){
              let nextgridView = [];
              nextgridView = data['Data'];
              this.gridListData = this.gridListData.concat(nextgridView);
            }else{
              this.gridListData = data.Data;
            }
           
            this.totalDataCount = data.TotalRecord;
          this.loading = false;
          this.loadingscroll = false;
            this.loadingSearch = false;
            // this.loadingAssignJobSaved = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.loadingscroll = false;
            this.loadingSearch = false;
            //  this.loadingAssignJobSaved = false;
          }
        }, err => {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          //  this.loadingAssignJobSaved = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        });

  }

// refresh button onclick method by maneesh
  refreshComponent(){
    this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
  }


  /*
@Name: pageChange function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData.length) {
      this.pagneNo = this.pagneNo + 1;
      this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, true);
    } else {
      this.loadingscroll = false;
    }
  }

  /*
@Name: sortChange function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  public sortChange($event): void {
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null || this.sortDirection == undefined) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = $event[0].field + ',' + this.sortDirection;
    }
    this.pagneNo=1;
    this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
  }

  /*
@Name: showTooltip function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
          this.tooltipDir.hide();
        }
        else {
          if (element.innerText == '') {
            this.tooltipDir.hide();
          } else {
            this.tooltipDir.toggle(element);
          }
        }
      }
      else {
        this.tooltipDir.hide();
      }
    }
    else if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
        this.tooltipDir.hide();
      }
      else {
        this.tooltipDir.toggle(element);
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }

  /*
@Name: switchListMode function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.animate();

    } else {
      this.viewMode = "listMode";
      this.animate();
    }
  }

  /*
@Name: onFilter function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  isFilter: boolean = false;
  public onFilter(inputValue: string): void {
    this.isFilter = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue); 
  }

/*
@Name: onFilterClear function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  loadingSearch: boolean;
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);

    // this.getFilterConfig();
  }


  /*
@Name: fetchRefreshgetjobApi function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  fetchRefreshgetjobApi(value) {
    if (value == true ) {
    this.isAsignJob = false;
    this.overlayAssignJob = !this.overlayAssignJob;
    this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true,false);
    this.assignJobCount.emit(true);
  }
}


  /*
@Name: sortName function
@Who: Anup Singh
@When: 21-oct-2021
@Why: EWM-3039
@What: For showing shortname on image icon
*/
sortName(Name) {
  if (Name) {
    let finalNameArr = Name.split(' ').slice(0, 2);

if(finalNameArr.length>=2){
const Name = finalNameArr[0] + " " + finalNameArr[1];

    const ShortName1 = Name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
    
     let first= ShortName1.slice(0,1);
     let last=ShortName1.slice(-1);
     let ShortName = first.concat(last.toString());
     return ShortName.toUpperCase();
     
}else{
 const ShortName1 = finalNameArr[0].split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
    let singleName = ShortName1.slice(0, 1);
    return singleName.toUpperCase();

}
  }
}



  /*
@Type: File, <ts>
@Name: openJobWorkFlowStage
@Who: Anup Singh
@When: 21-oct-2021
@Why: EWM-3039
@What: to open job workflow stage modal dialog
*/
openJobWorkFlowStage(workflowid) {
  const dialogRef = this.dialog.open(JobWorkflowStageComponent, {
    maxWidth: "1000px",
     data: new Object({ id: workflowid, mode:'R' }),
    width: "90%",
    maxHeight: "85%",
    panelClass: ['quick-modalbox', 'jobWorkFlowStageView', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) {
     
    } else {
      this.loading = false;
    }
  })

  // RTL Code
  let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	 
}


/* 
  @Type: File, <ts>
  @Name: openjobDetailsView function 
  @Who: Anup Singh
  @When: 25-Oct-2021
  @Why: EWM-3046 EWM-3525
  @What: open drawer For Job Details View.
+++++++++++++++
  @Who: Adarsh Singh
  @When: 03-Feb-2023
  @Why: EWM-9386 EWM-10393
  */
openjobDetailsView(trigger:any, value,jobId,IsJobClosed){
  this.IsJobClosed=IsJobClosed;//who:maneesh,what:ewm-13861 for hide edit icon ,when:22/09/2023
  this.triggerOrigin = trigger;
  this.overlayCandidateProfile=!this.overlayCandidateProfile;
  this.JobId = jobId;
  this.candidateProfileDrwer = true;
}

 /*
   @Type: File, <ts>
   @Name: CloseShareAssessmentFromJobAction function
   @Who: Adarsh singh
   @When: 03-Feb-2023
   @Why: EWM-9386 EWM-10392
   @What: For close candidate Job drawer
*/
CloseShareAssessmentFromJobAction(){
  this.overlayCandidateProfile=!this.overlayCandidateProfile;
  this.candidateProfileDrwer = false;
  this.candidateProfileDrwerForEdit = false;
  //@suika @whn 28-03-2023 @reset the jobId on route url
  this.route.navigate([],{
    relativeTo: this.activatedRoute,
    queryParams: {jobId: this.currentJobId },
    queryParamsHandling: 'merge'
  }); 
}

 /* 
  @Type: File, <ts>
  @Name: unassignJobFromCandidate function 
  @Who: Anup Singh
  @When: 25-Oct-2021
  @Why: EWM-3046 EWM-3525
  @What: call Api for delete record .
  */
 unassignJobFromCandidate(val): void {
   const message = ``;
   const subtitle = 'message_unassingCandidate';
   const title = '';
   const dialogData = new ConfirmDialogModel(title, subtitle, message);
   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
     maxWidth: "350px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     if (dialogResult == true) {
       this.loading = true;
       let unassignObj = {};
       unassignObj["CandidateId"] = this?.candidateId,
         unassignObj["CandidateName"] = val?.CandidateName,
         unassignObj["JobId"] = val?.JobId,
         unassignObj["JobName"] = val?.JobTitle,
         unassignObj["StageId"] = val?.StageId,
         unassignObj["StageName"] = val?.HiringStage,
         unassignObj["PageName"] = "Candidate Job",
         unassignObj["BtnId"] = "btnDelete";
       this.jobService.unassignJobFromCandidate(unassignObj).subscribe(
         (repsonsedata:any) => {
           if (repsonsedata['HttpStatusCode'] == 200) {
             this.loading = false;
             this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
             this.pagneNo = 1;
             this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false,false);
             this.assignJobCount.emit(true);
            } else {
              this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
           }
         }, err => {
           this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

         })
     } else {
       // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
     }
   });

   // RTL Code
   let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	

 }

 /* 
  @Type: File, <ts>
  @Name: toggleDrwer function 
  @Who: Adarsh Singh
  @When: 27-Mar-2022
  @Why: EWM-5674
  @What: toggle assign job drawer
  */
 toggleDrwer(start: any) {
    start.toggle();
}
receivedMessageHandler(p,asignJob) {
  if (p == false) {
    asignJob.toggle();
  }
}

  /*
    @Type: File, <ts>
    @Name: add remove animation function
    @Who: maneesh
    @When: 13-feb-2023
    @Why: EWM-10466
    @What: add and remove animation
     */

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
  @Type: File, <ts>
  @Name: receivedEventForEditModeJob function 
  @Who: Adarsh Singh
  @When: 03-Feb-2023
  @Why: EWM-10393
  @What: get data from job page while click flotting edit button
*/
receivedEventForEditModeJob(e:boolean){
 let currentJobid;
  //@suika @whn 28-03-2023 @reset the jobId on route url
 this.routes.queryParams
      .subscribe(params => {
        currentJobid = params.jobId; 
      }
    );
    this.currentJobId = currentJobid;  
    //@suika @whn 28-03-2023 @reset the jobId on route url
  this.route.navigate([],{
    relativeTo: this.activatedRoute,
    queryParams: {jobId: this.JobId, editForm:'editForm', floatingButton:'true' },
    queryParamsHandling: 'merge'
  }); 
  if (e) {
    this.candidateProfileDrwer = false;
    this.candidateProfileDrwerForEdit = true;
  }
}


/* 
  @Type: File, <ts>
  @Name: closeDrawerOfEditMode function 
  @Who: Adarsh Singh
  @When: 03-Feb-2023
  @Why: EWM-10393
  @What: for closing drawer
*/

  closeDrawerOfEditMode(e: any) {
    if (e == 2) {
      this.candidateProfileDrwer = true;
      this.candidateProfileDrwerForEdit = false;     
    } else {
      this.CloseShareAssessmentFromJobAction();
    }
  }
/*
  @Type: File, <ts>
  @Name: openjobDetailsView
  @Who: Adarsh Singh
  @When: 07-Feb-2023
  @Why:EWM-10280 EWM-10428
  @What: for open assign job drawer
*/

openAsignJob() {
  /*-@Why: EWM-12714,@When: EWM-12-06-2023,@Who: Nitin Bhati--*/
  if(this.IsRestricted===1){
    this.onRestrictcandidate();
  }else{
    this.overlayAssignJob = !this.overlayAssignJob;
    this.isAsignJob = true;
  }
}

/*
  @Type: File, <ts>
  @Name: CloseAssessmentJob
  @Who: Adarsh Singh
  @When: 07-Feb-2023
  @Why: EWM-10280 EWM-10428
  @What: for close assign job drawer
*/
CloseAssessmentJob(){
  this.overlayAssignJob = !this.overlayAssignJob;
  this.isAsignJob = false;
}

 /* 
@Type: File, <ts>
@Name: getFilterConfig
@Who: Adarsh Singh
@When: 18-APRIL-2023
@Why: EWM-11971
@What: get configuation 
*/
getFilterConfig() {
  this.loading = true;
  this.jobService.getfilterConfig(this.GridId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        let colArrSelected = [];
        if (repsonsedata.Data !== null) {
          this.gridColConfigStatus=repsonsedata.Data.IsDefault;  /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064--*/
          this.colArr = repsonsedata.Data.GridConfig;
          this.filterConfig = repsonsedata.Data.FilterConfig;
          this.filterAlert = repsonsedata.Data.FilterAlert;
          this.quickFilterStatus = repsonsedata.Data.QuickFilter;
          if (this.filterAlert == 1) {
            this.dynamicFilterArea = false;
          } else {
            this.dynamicFilterArea = true;
          }
          if (this.filterConfig !== null) {
            this.filterCount = this.filterConfig?.length;
          } else {
            this.filterCount = 0;
          }
          if (repsonsedata.Data.GridConfig?.length != 0) {
            colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Grid == true);
          }
          if (colArrSelected?.length !== 0) {
            this.columns = colArrSelected;
            this.columnsWithAction = this.columns;
            this.columnsWithAction.splice(0, 0, {
              "Type": "Action",
              "Field": null,
              "Order": 0,
              "Title": null,
              "Selected": false,
              "Format": "{0:c}",
              "Locked": true,
              "width": "40px",
              "Alighment": null,
              "Grid": true,
              "Filter": false,
              "API": null,
              "APIKey": null,
              "Label": null
            });

          } else {
            this.columns = this.colArr;
            this.columnsWithAction = this.columns;
            this.columnsWithAction.splice(0, 0, {
              "Type": "Action",
              "Field": null,
              "Order": 0,
              "Title": null,
              "Selected": false,
              "Format": "{0:c}",
              "Locked": true,
              "width": "40px",
              "Alighment": null,
              "Grid": true,
              "Filter": false,
              "API": null,
              "APIKey": null,
              "Label": null
            });
          }
        }
        /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12065,@what:For showing auto fit--*/
        this.pagneNo = 1;
        this.getCandidateListByJob(this.candidateId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
      } else {
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
@Name: setConfiguration function
@Who: Adarsh singh
@When: 18-APRIL-2023
@Why: ROST-11971
@What: For saving the setting config WITH WIdth of columns
*/
setConfiguration(columnsConfig) {
  let gridConf = {};
  let tempArr: any[] = this.colArr;
  columnsConfig?.forEach(x => {
    let objIndex: any = tempArr.findIndex((obj => obj.Field == x.field));
    if (objIndex >= 0) {
      tempArr[objIndex].Format = x.format,
        tempArr[objIndex].Locked = x.locked,
        tempArr[objIndex].Order = x.leafIndex + 1,
        tempArr[objIndex].Selected = true,
        tempArr[objIndex].Type = x.filter,
        tempArr[objIndex].width = String(x._width)
    }
  });
  gridConf['GridId'] = this.GridId;
  gridConf['GridConfig'] = tempArr;
  gridConf['CardConfig'] = [];
  gridConf['FilterAlert'] = this.filterAlert;
  gridConf['filterConfig'] = this.filterConfig;
  gridConf['QuickFilter'] = this.quickFilterStatus;
  this.jobService.setfilterConfig(gridConf).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}

/*
    @Type: File, <ts>
    @Name: fitColumns
    @Who: Nitin Bhati
    @When: 24-04-2023
    @Why: EWM-12065
    @What: For auto fit column size
  */
    public fitColumns(): void {
      this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns();
      });
    }


    /*
  @Type: File, <ts>
  @Name: onRestrictcandidate function
  @Who: Nitin Bhati
  @When: 02-06-2023
  @Why: EWM-11915
  */
  onRestrictcandidate() {
    const dialogRef = this.dialog.open(RestrictCandidateComponent, {
      panelClass: ['xeople-modal-md', 'RestrictCandidateComponent', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data: this.AlertMessage
    });
    dialogRef.afterClosed().subscribe(res => {
    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }
  viewJobSummery(jobId,WorkFlowId){
    const baseUrl = window.location.origin;
    const router = RouterData.jobSummery;
    const url = baseUrl+router+"?jobId="+jobId +"&workflowId="+WorkFlowId;
     window.open(url, '_blank');
    }
}
