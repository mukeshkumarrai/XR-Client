/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: maneesh
  @When: 30-jan-2023
  @Why: EWM-10305-EWM-9378
  @What:  This page will be use for xeople search assign job Component ts file
*/

import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ColumnMenuSettings, DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models/index'
import {  Observable, Subject } from 'rxjs';
import {  take, takeUntil, takeWhile } from 'rxjs/operators';
import { JobService } from '../../../shared/services/Job/job.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CandidateService } from '../../../shared/services/candidates/candidate.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { NewEmailComponent } from '../../../shared/quick-modal/new-email/new-email.component';
import { MatSidenav } from '@angular/material/sidenav';
import { ElasticService } from '../../../shared/services/elastic/elastic.service';
import { ShareResumeComponent } from '../../../job/screening/share-resume/share-resume.component';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import {  State } from '@progress/kendo-data-query';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { XeopleSearchFolderlistComponent } from '../xeople-search-folderlist/xeople-search-folderlist.component';
import { OutputField } from '../../../shared/datamodels/xeople-eoh-card';
import { ParsedResumeKeywordSearchComponent } from '@app/shared/parsed-resume-keyword-search/parsed-resume-keyword-search/parsed-resume-keyword-search.component';

@Component({
  selector: 'app-xeopler-assing-job',
  templateUrl: './xeopler-assing-job.component.html',
  styleUrls: ['./xeopler-assing-job.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ],
  encapsulation: ViewEncapsulation.None
})
export class XeoplerAssingJobComponent implements OnInit {

  /***********************global variables decalaration**************************/
  public ActiveMenu: any;
  //<!---------@When: 30-03-2023 @who:Bantee @why: EWM-11492 --------->
  public menuSettings: ColumnMenuSettings = {
    filter: false
  };
  public loading: boolean=false;
  public pagesize ;
  public pagneNo = 1;
  public sort: any[] = [{
    field: 'Proximity',
    dir: 'asc'
  }];
  public GridId: any = 'CandidateLanding_grid_001';
  public sortingValue: string = "Proximity,asc";
  public searchValue: string = "";
  public gridListData: any = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public workflowId: any;
  public colArr: any = [];
  public filterConfig: any;
  public sortDirection = 'asc';
  public loadingscroll: boolean =false;
  public canLoad = false;
  public pendingLoad = false;
  public viewMode: string = 'listMode';
  public kendoLoading: boolean;
  @ViewChild(GridComponent)
  public grid: GridComponent;
  public totalDataCount: number;
  public listData: any = [];
  public folderId: any = 0;
  public searchVal: string = '';
  public loadingSearch: boolean;
  statusId = '00000000-0000-0000-0000-000000000000';
  designationId = '';
  loaderStatus: number;
  scrolledValue: any;
  animationVar: any;
  pageOption: any;
  animationState = false;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  @Input() resetFormSubject: Subject<any> = new Subject<any>();
  searchSubject$ = new Subject<any>();
  PhoneNumber: any;
  JobId: any;
  public canidatedata: any = [];
  public status: boolean;
  public candidateId: any;
  public candidateName: any;
  public positionMatDrawer: string = 'end';
  public hiddenColumns: string[] = [];
  @ViewChild('activityAdd') public sidenav: MatSidenav;
  public allComplete: boolean = false;
  @Output() xeopleSearchCanidatedata = new EventEmitter();
  @Output() candidateid =new EventEmitter();
  @Output() candidate=new EventEmitter();
  public filterValue: any;
  SearchQuery: any;
  ShowTopMatchingRecordNumber: number=0;
  OutputFieldsColumns: OutputField[]=[];
  activeJobPipeline: number;
  public dirctionalLang: any;
  zoomCheckStatus: boolean = false;
  zoomPhoneCallRegistrationCode:any;
  gridListDatalength: any;
  public userpreferences: Userpreferences;
  data$: any;
  alive: boolean= true;
  @Output() otherJobs = new EventEmitter<any>();
  public state: State = {};
selectableSettings:SelectableSettings = {
  checkboxOnly: true
}
public view: Observable<GridDataResult>;
public data: GridDataResult = { data: [], total: 0 };
customFilterString: string;
public sizes = [50, 100, 200,500,1000];
folderCancel: number;
private destroySubject: Subject<void> = new Subject();
distanceUnit: string='KM';
XeopleSearchId:string;
  constructor(private routes: ActivatedRoute, private route: Router, public dialog: MatDialog, private candidateService: CandidateService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService,
    private jobService: JobService, public _sidebarService: SidebarService, public _userpreferencesService: UserpreferencesService,
    private commonserviceService: CommonserviceService,private ngZone: NgZone,
    private mailService: MailServiceService, public systemSettingService: SystemSettingService, private _ElasticService: ElasticService) {
  
    this.pageOption = this.appSettingsService.pageOption;
    this.pagesize = this.appSettingsService.pagesize;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.state={skip: 0,
      take: this.pagesize,
      group: [],
      filter: { filters: [], logic: "and" },
      sort: [{
        field: 'Proximity',
        dir: 'asc'
      }]}
  }

  ngOnInit(): void {
    this.animationVar = ButtonTypes;
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];

    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.zoomPhoneCallRegistrationCode);
    this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;
    this.switchListMode(this.viewMode);
     this.commonserviceService.DisabelData.next(this.canidatedata);

    this.commonserviceService.getFilterInfo.pipe(
      takeUntil(this.destroySubject)
    ).subscribe((data) => {
      this.hiddenColumns=[];
      this.SearchQuery = data?.SearchQuery;
      this.ShowTopMatchingRecordNumber = (data?.ShowAllMatchingRecord!==1)? (data?.ShowTopMatchingRecordNumber):0;      
      this.OutputFieldsColumns = data?.OutputFields;
      this.activeJobPipeline=data?.IncludeJobPipelineCandidate?parseInt(data?.IncludeJobPipelineCandidate):0;
      data?.OutputFields?.forEach(element => {
        if(!element?.selected){
          this.hiddenColumns.push(element?.DBColumnName);
        }
      });
    });  
  //<!---------@When: 30-03-2023 @who:Bantee @why: EWM-11492 --------->
  this.data$=this.resetFormSubject.pipe(takeWhile(() => this.alive)).subscribe(response => {
    if(response==true){
      this.getElasticSearchEngineList(false);
      this.userpreferences = this._userpreferencesService.getuserpreferences();
    }
  })
    
  this.getElasticSearchEngineList(false);
  this.userpreferences = this._userpreferencesService.getuserpreferences();
  this.distanceUnit = localStorage.getItem('DistanceUnit')!=='null'?localStorage.getItem('DistanceUnit'):'KM';
  this.commonserviceService.xeoplesearchJobDataId.subscribe(value => { //by maneesh ewm-16783
    this.XeopleSearchId=value;
  });
  }
  public ngOnDestroy(): void {

    //this.data$.unsubscribe(); 
    this.alive = false;
    this.data$.complete();
    this.destroySubject.next();
  }
   /*
  @Type: File, <ts>
  @Name: updateAllComplete function
  @Who: maneesh
  @When: 04-feb-2023
  @Why: EWM-10305
*/
  onHideField(isChecked, data) {
    
    if (isChecked.checked == true) {
      this.candidateId = data?.Id;
      this.candidateName = data?.Name;
      this.candidateid.emit(this.candidateId)
      this.candidate.emit(this.candidateName)
      this.data?.data?.forEach(element => { 
        if (element.Id == data.Id) {
          element.IsDefault = 1
        }
      });      
    }
    else {
      this.data?.data?.forEach(element => {
        if (element.Id == data.Id) {
          element.IsDefault = 0
        }
      });
    }
    this.updateAllComplete();
  this.canidatedata=this.data?.data?.filter(x=>x.IsDefault==1);
  /*@When: 10-07-2023 @Who: Renu @Why: EWM-13067*/
  let obj= {
    'totalDataCount':this.totalDataCount,
    'canidatedata': this.canidatedata
  }
  this.xeopleSearchCanidatedata.emit(obj);
   this.commonserviceService.DisabelData.next(this.canidatedata);

  }
  public dataStateChange(state:DataStateChangeEvent): void {
      this.canidatedata=[];
      this.commonserviceService.DisabelData.next(this.canidatedata);
       this.state = state;
       this.sendRequest(state,this.customFilterString);
}

/*
  @Type: File, <ts>
  @Name: parseCustomFilter function
  @Who: Renu
  @When: 26-aug-2023
  @Why: EWM-13753 EWM-14029
*/
parseCustomFilter(state: any[]) {
  let serialized ='AND';
  state[0].filters.forEach((filter, index) => {
    let logic='';
    if(index>0){
      logic=`${state[0].logic}`.toUpperCase();
    }  
    serialized +=logic+
      `${filter.field}$` +
      `${filter.operator}$` +
      `${filter.value}`;
  });

  return serialized;
}
  /*
  @Type: File, <ts>
  @Name: updateAllComplete function
  @Who: maneesh
  @When: 04-feb-2023
  @Why: EWM-10305
*/
  updateAllComplete() {
    this.allComplete = this.data?.data != null && this.data?.data.every(t => t.IsDefault == 1); 
  }
  /*
  @Type: File, <ts>
  @Name: setAll function
  @Who: maneesh
  @When: 04-feb-2023
  @Why: EWM-10305
  what:for set all checkbox 
*/
  setAll(completed: boolean) {
    if (completed) {
      this.allComplete = completed;
      if (this.gridListData == null) return;
      this.data?.data?.forEach((t) => {
        t.IsDefault = 1; 
      });
    }
    else {
      this.allComplete = completed;
      this.data?.data?.forEach((t:any) => {   
        t.IsDefault = 0;
      });
    }
    this.canidatedata=this.data?.data?.filter(x=>x.IsDefault==1);
    /*@When: 10-07-2023 @Who: Renu @Why: EWM-13067*/
    let obj= {
      'totalDataCount':this.totalDataCount,
      'canidatedata': this.canidatedata
    }
    this.xeopleSearchCanidatedata.emit(obj);
     this.commonserviceService.DisabelData.next(this.canidatedata);


  }

/*
  @Type: File, <ts>
  @Name: someComplete function
  @Who: maneesh
  @When: 04-feb-2023
  @Why: EWM-10305
*/

  someComplete(): boolean {
    if (this.data == null) {
      return;
    }
    return this.data?.data.filter(t => t.IsHidden).length > 0 && !this.allComplete;
  }
  /*
@Type: File, <ts>
@Name: switchListMode function
@Who: maneesh
@When: 30-jan-2023
@Why:EWM-10305-EWM-9378
@What: for swtiching list mode to cARD MODE OR VICE VERSA
*/
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.isCardMode = true;
      this.isListMode = false;
      this.viewMode = "cardMode";
      this.animate();
    } else {
      this.isCardMode = false;
      this.isListMode = true;
      this.viewMode = "listMode";
      this.animate();
      //listHeader.classList.remove("hide");
    }
  }

  /* 
@Type: File, <ts>
@Name: animate delaAnimation function
@Who: maneesh
@When: 30-jan-2023
@Why: EWM-10305-EWM-9378
@What: creating animation
*/

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }

  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: maneesh
  @When: 25-jan-2023
  @Why: EWM-10305-EWM-9378
  @What: For get filter config data
  */

  getFilterConfig() {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          if (repsonsedata.Data !== null) {
            this.colArr = repsonsedata.Data.GridConfig;

            this.filterConfig = repsonsedata.Data.FilterConfig;
          }
         this.getCandidateList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
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
 @Name: getCandidateList function
 @Who: maneesh
 @When: 30-jan-2023
 @Why: EWM-10305-EWM-9378
 @What: For getting the job list
  */
  getCandidateList(pagesize, pagneNo, sortingValue, searchVal, JobFilter) {
    this.loading = true;
    this.kendoLoading = true;

    this.animate();
    if (this.loaderStatus === 1) {
      this.loading = false;
      this.kendoLoading = false;
    } else {
      this.loading = true;
      this.kendoLoading = true;
    }
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['CandidateFilterParams'] = this.filterConfig;
    } else {
      jsonObj['CandidateFilterParams'] = [];
    }

    jsonObj['search'] = this.searchVal;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['GridId'] = this.GridId;
    jsonObj['FolderId'] = this.folderId;
    jsonObj['StatusId'] = this.statusId;
    jsonObj['Designation'] = this.designationId;
    jsonObj['WorkflowStageId'] = this.workflowId;
    jsonObj['JobId'] = this.JobId;
    this.candidateService.fetchCandidatelist(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.kendoLoading = false;

          this.gridListData = repsonsedata.Data;
          this.gridListData.forEach(element => {
            element['IsDefault'] = 0;
             });
          this.gridListDatalength = this.gridListData?.length;
            this.allComplete=false;
          this.commonserviceService.xeopleSearchService.next(this.gridListData);
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
          this.loaderStatus = 0;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.PhoneNumber = repsonsedata.Data[0]?.PhoneNumber;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
 @Type: File, <ts>
 @Name: showTooltip function
 @Who: maneesh
 @When: 30-jan-2023
 @Why:EWM-10305-EWM-9378
 @What: For showing tooltip in kendo
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
    else if (element.nodeName === 'SPAN' || element.nodeName === 'A') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
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


  /*
    @Type: File, <ts>
    @Name: sortChange function
    @Who: maneesh
    @When: 30-jan-2023
    @Why: EWM-10305-EWM-9378
    @What: for sorting
  */
 public sortChange($event): void {
  this.sortDirection = $event[0].dir;
  if (this.sortDirection == null || this.sortDirection == undefined) {
    this.sortDirection = 'asc';
  } else {
    this.sortingValue = $event[0].field + ',' + this.sortDirection;
  }
  this.pagneNo=1;
  //<!---------@When: 30-03-2023 @who:Bantee @why: EWM-11492 --------->

  this.getElasticSearchEngineList(false);
}


  divScroll(e) {
    if (e.srcElement.scrollTop >= 20) {
      this.scrolledValue = e.isTrusted;
    } else {
      this.scrolledValue = false;
    }
  }

  /*
@Type: File, <ts>
@Name: dirChange
@Who: maneesh
@When: 31-jan-2023
@Why:EWM-10305-EWM-9378
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
 @Type: File, <ts>
 @Name: getElasticSearchEngineList function
 @Who: Nitin Bhati
 @When: 18-Feb-2023
 @Why: EWM-10317
 @What: For getting the Elastic Search Engine
*/
 getElasticSearchEngineList(isScroll:boolean) {
  //<!---------@When: 30-03-2023 @who:Bantee @why: EWM-11492 --------->
   if(isScroll){ 
     this.loading=false;
     this.kendoLoading = false;

   }else{

     this.loading = true;
     this.kendoLoading = true;
   }
  this.animate();
  this.customFilterString="&XeopleFilter="+this.SearchQuery+"&Max="+this.ShowTopMatchingRecordNumber+'&ActiveJobPipeline='+this.activeJobPipeline;
  this.filterConfig='';
  this.sendRequest(this.state,this.customFilterString);
}

public sendRequest(state: State,customFilterString): void {
  this.loading = true;
  this._ElasticService.fetch(state,customFilterString).pipe(
    takeUntil(this.destroySubject)
  ).subscribe((response: GridDataResult) => {
      this.data = response;
      this.totalDataCount=response?.total;
      this.xeopleSearchCanidatedata.emit( {
          'totalDataCount':this.totalDataCount,
          'canidatedata': this.canidatedata
        })
      this.loading = false;
    
  }, err => {
         this.loading = false;
      });
}

public fitColumns(): void {
  this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
    this.grid.autoFitColumns();
  });
}


public pageChange(event: PageChangeEvent): void {
  this.state.skip = event.skip;
}



 /*
 @Type: File, <ts>
 @Name: showResume function
 @Who: Adarsh singh
 @When: 18-Feb-2023
 @Why: EWM-9379 EWM-10612
 @What: For display resume
*/
 showResume(CandidateId: string) {
  const dialogRef = this.dialog.open(ParsedResumeKeywordSearchComponent, {
    data: new Object({ CandidateId:CandidateId }),
    panelClass: ['xeople-modal-lg', 'resume-view-parse', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir: string;

  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
    }
  });
}

 /*
 @Type: File, <ts>
 @Name: confirmShareDocument function
 @Who: Adarsh singh
 @When: 18-Feb-2023
 @Why: EWM-9379 EWM-10612
 @What: share documnet while click save button
*/
  CandidateId: any;
  CandidateName: string;
  confirmShareDocument(CandidateId, CandidateName) {
    this.loading = true;
    this.fetchVersionHistory(CandidateId);
    this.CandidateId = CandidateId;
    this.CandidateName = CandidateName;
  }
  isResumeUpload: any = [];
  public ResumeName: any;
  public FileName: any;
  public ResumeId: any;
  fetchVersionHistory(candidateId) {
    this.loading = true;
    this.candidateService.fetchCandidateVersionHistory("?candidateId=" + candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode == 204) {
          let gridView = repsonsedata.Data;
          if (gridView?.length == 0) {
            this.snackBService.showErrorSnackBar(this.translateService.instant('label_resumeNotAddedYet'), repsonsedata['HttpStatusCode']);
            this.loading = false;
            this.isResumeUpload[candidateId] = true;
          } else {
            if (gridView) {
              let Id = gridView?.ResumeId;
              this.ResumeName = gridView[0].UploadFileName;
              this.FileName = gridView[0].FileName;
              this.ResumeId = gridView[0].ResumeId;
              // this.loadViewer(DemoDoc, Id, FileName)
              this.onShareDocPopUp();
              this.loading = false;
            }
            this.loading = false;
          }

        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

 /*
 @Type: File, <ts>
 @Name: onShareDocPopUp function
 @Who: Adarsh singh
 @When: 18-Feb-2023
 @Why: EWM-9379 EWM-10612
 @What: opne document popup
*/
  onShareDocPopUp() {
    let documentData = {};
    documentData['Name'] = this.ResumeName ? this.ResumeName : 'Resume';
    documentData['ResumeLink'] = this.FileName;
    documentData['Id'] = this.ResumeId;
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ShareResumeComponent, {
      data: new Object({ documentData: documentData, candidateId: this.CandidateId, candidateName: this.CandidateName }),
      panelClass: ['xeople-modal', 'resume-docs', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
      } else {
        this.loading = false;
      }
    });
  }

 /*
 @Type: File, <ts>
 @Name: openNewEmailModal function
 @Who: Adarsh singh
 @When: 18-Feb-2023
 @Why: EWM-9379 EWM-10612
 @What: for open email modal
*/
openNewEmailModal(responseData: any, mailRespondType: string, email: string,candidateId) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(NewEmailComponent, {
    maxWidth: "750px",
    width: "95%",
    height: "100%",
    maxHeight: "100%",
    data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': email,'workflowId': this.workflowId, 'JobId':this.XeopleSearchId,CandidateId:candidateId,
    'XeopleSearchgridMail': true,  },
    panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult) {
      this.pagneNo = 1;
      this.sortingValue = '';
      this.searchValue = '';
      // this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
    }
  })

}
  

 /* 
  @Type: File, <ts>
  @Name: copyCandidateEmailId function
  @Who: Adarsh singh
  @When: 18-Feb-2023
  @Why: EWM-9379 EWM-10612
  @What: for copy current data 
*/
copyCandidateEmailId(EmailId:any, i:any){ 
  // for display and auto hide after some time 
  let el = document.getElementById('autoHide' + i);
  el.style.display = 'block';
  setTimeout(() => {
    let el = document.getElementById('autoHide' + i);
    el.style.display = 'none';
  }, 2000);
  // End 
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = EmailId;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

  /*
  @Type: File, <ts>
  @Name: openNewTabForClientGoogleMapLocation
  @Who: Adarsh singh
  @When: 18-Feb-2023
  @Why: EWM-9379 EWM-10612
  @What: to open New window Tab For Client Google Map Location show
 */
openNewTabForClientGoogleMapLocation(Latitude, Longitude, Location) {
  if ((Latitude != undefined && Latitude != null && Latitude != "") &&
    (Longitude != undefined && Longitude != null && Longitude != "")) {
    let urlloc = "https://www.google.com/maps/place/" + Latitude + ',' + Longitude;
    window.open(urlloc, '_blank');
  }
  else if (Location != undefined && Location != null && Location != "") {
    let urlloc = "https://www.google.com/maps/place/" + Location;
    window.open(urlloc, '_blank');
  }
 
}


/*
  @Type: File, <ts>
  @Name: openTimelinePopup function
  @Who: Renu
  @When: 16-May-2023
  @Why: EWM-10970 EWM-11195
  @What: For showing Job Timeline
*/

openTimelinePopup(dataItem){
  this.otherJobs.emit(dataItem?.Id);
}

 /*
    @Type: File, <TS>
    @Name: openQuickFolderModal
    @Who: Renu
    @When: 04-Sept-2022
    @Why: EWM-13753 EWM-1413
    @What: to open folder model
    */
    
    openQuickFolderModal(CandidateId: string) {
      const message = ``;
      const title = 'label_disabled';
      const subtitle = 'label_folder';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this.dialog.open(XeopleSearchFolderlistComponent, {
        data: new Object({ candidateId: CandidateId, labelAddFolder: true ,disabledMode:true}),
        // data: dialogData,
        panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == false) {
          this.folderCancel = 1;
          this.commonserviceService.onOrgSelectFolderId.next(this.folderCancel);
         
        } else {
        }
      })
    }
    
/* @Who: Renu @When: 04-Sept-2022 @Why: EWM-13753 EWM-1413 @What: to get value on checkbox selection */

    selectionChange(event:any){
       if(event?.length==1){
        this.candidateId =event[0]?.Id;
        this.candidateName =event[0]?.Name;
        this.candidateid.emit(this.candidateId);
        this.candidate.emit(this.candidateName);
        this.canidatedata=event;
       }else{
        this.canidatedata=event;
       }
       this.xeopleSearchCanidatedata.emit({
          'totalDataCount':this.totalDataCount,
          'canidatedata': this.canidatedata
        });
        this.commonserviceService.DisabelData.next(this.canidatedata);
        this.commonserviceService.xeopleSearchService.next(this.canidatedata.map(x=>({
          'CandidateId':x.Id,
          'CandidateName':x.Name,
          'ResumeName':x.ResumeName,
          'ResumePath':x.ResumePath,
          'ResumeSize':x.ResumeSize,
          'ResumeURL':x.ResumeURL,
          'Resume':x.Resume,
          'Email':x.Email
        })));
    }

/*  @Name: selectedCallback  @Who: Renu @When: 07-09-2023  @Why: EWM-13753 EWM-14131 @What: get all checkbox event */
    public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;
    /* 
  @Name: getBackgroundColor function
  @Who: Bantee Kumar
  @When: 23-06-2023
  @Why: EWM-7926
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}
}
