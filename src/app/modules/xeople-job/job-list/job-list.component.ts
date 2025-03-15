/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 12-July-2021
  @Why: EWM-2003 EWM-2090
  @What:  This page will be use for landing page Component ts file
*/
import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import {  BroadbeanPosting, ResponceData, SCREEN_SIZE, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { NestedTreeControl } from "@angular/cdk/tree";
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { CloseJobComponent } from 'src/app/shared/modal/close-job/close-job.component';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { BroadbeanService } from '@app/modules/EWM.core/shared/services/broadbean/broadbean.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { IntegrationsBoardService } from '@app/modules/EWM.core/shared/services/profile-info/integrations-board.service';
import { TreeDataSource, TreeNode } from '@app/modules/EWM.core/job/landingpage/tree-datasource';
import { JobDescriptionPopupEditorComponent } from '@app/modules/EWM.core/shared/quick-modal/quickjob/job-description-popup-editor/job-description-popup-editor.component';
import { ShowOwnerlistPopupComponent } from '@app/modules/EWM.core/job/landingpage/show-ownerlist-popup/show-ownerlist-popup.component';
import { NewEmailComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { JobFilterDialogComponent } from '../job-shared/job-filter-dialog/job-filter-dialog.component';
import { JobActionDialogComponent } from '../job-shared/job-action-dialog/job-action-dialog.component';
import { CopyJobComponent } from '../job-manage/copy-job/copy-job.component';
import { ReopenJobComponent } from '@app/shared/modal/reopen-job/reopen-job.component';
import { ReloadService } from '@app/modules/EWM.core/shared/reload.service';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Title } from '@angular/platform-browser';
import { JoblandingkendopagingService } from 'src/app/shared/services/joblandingkendopaging.service';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
//start by maneesh ewm-17228 for make model from get total candidates count when:20/06/2024
export interface TotalCandidates {
  JobId: string;
  WorkflowId: string;
  QuickFilter: string;
  CountFilter: string;
  CandidateFilterParams:FilterParams;
  WorkflowStageId:string;
}
export interface FilterParams {
  ColumnName: string,
  ColumnType: string,
  FilterValue: string,
  FilterOption: string,
  FilterCondition: string,
}
//end  by maneesh ewm-17228 for make model from get total candidates count when:20/06/2024

SwiperCore.use([Pagination, Navigation]);
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class JobListComponent implements OnInit {
  ExpireIn: any;
  public expiryDate: any = 0;
  public days: number[] = [];
  hours: number[] = [];
  minutes: number[] = [];
  seconds: number[] = [];

  /***********************global variables decalaration**************************/
  public ActiveMenu: any;
  public maxCharacterLength = 500;
  public loading: boolean;
  public pagesize=200;
  public pageSizeOptions;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public skip = 0;
  /*--@who:@Bantee Kumar,@when:11-05-2023, @why:EWM-12369, To sort by default on Job Title --*/
  public sort: any[] = [{
    field: 'JobTitle',
    dir: 'asc'
  }];

  public GridId: any = 'grid001';
  public sortingValue: string = "";
  public searchValue: string = "";
  public gridListData: any[] = [];
  public columns: ColumnSetting[] = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public workflowList: any = [];
  public workflowId: any;
  public filterCount: number = 0;
  public colArr: any = [];
  public tempID: any;
  public stagesList: any = [];
  public totalJobsWorkFlow: number;
  public filterConfig: any;
  public sortDirection:string;
  public userpreferences: Userpreferences;
  public screnSizePerStage: number;
  public totalStages: number;
  public currentMenuWidth: number;
  public screenPreviewClass: string = "";
  public loadingscroll: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public viewMode: string = 'listMode';
  public result: string = '';
  public kendoLoading: boolean;
  scrolledValue: any;
  public selectjobcatparam: any = 'TotalJobs';
  // public selectjobcatparam: any ;
  public isShowFilter: boolean = false;
  jobSelectedData: any;
  public TotalActiveJobs = 0;
  public JobWithoutCandidate = 0;
  public JobWithCandidate = 0;
  public isActive: any;
  @ViewChild(GridComponent) public grid: GridComponent;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  seekRegistrationList: any;
  seekRegistrationCode: any;
  seekRegisCodeList: any;
  seekRegisCode: any;
  selectedIndex: number;
  // animate and scroll page size
  animationVar: any;
  public columnsWithAction: any[] = [];
  public jobFilterCount: any = [];
  public candidateId: string = '2c9d3248-1c59-4ae1-8914-dcc223b17c81';
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false;
  sizess = [
    {
      id: SCREEN_SIZE.small, name: 'small',
      css: `showMenu`
    },
    {
      id: SCREEN_SIZE.large, name: 'large',
      css: `hide`
    }
  ];
  prefix = 'is-';
  public JobId: any;
  public JobTitle: any;
  public loginUserName: any;
  dirctionalLang;
  public dynamicFilterArea: boolean = false;
  public headerExpand: boolean = true;
  public loadingSearch: boolean = false;
  searchTextTag;
  public filterAlert: number = 0;
  public quickFilterStatus: number = 0;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public isLeft: boolean = true;
  @ViewChild('quickFilter') public righttoggel: MatSidenav;
  @ViewChild('quickCandidateList') public candidatetoggel: MatSidenav;
  stageColor = '#b6b6b6';
  zoomPhoneCallRegistrationCode: any;
  zoomCheckStatus: boolean = false;
  searchSubject$ = new Subject<boolean>();
  public dataArr: any = []
  TREE_DATA: TreeNode[];
  view: boolean = false;
  treeControl: NestedTreeControl<TreeNode>;
  dataSource: TreeDataSource;
  public loadingStage: boolean;
  public loadingTree: boolean;
  treeMatDrawer: boolean = false;
  Broadbeanregistrationcode: any;
  QuickFilter: string='TotalJobs';
  quickCandidateList: string='All';
  gridColConfigStatus: boolean = false;
  /*--@who:@Bantee Kumar,@when:11-05-2023, @why:EWM-12369, To show total jobs on the landing page --*/
  totalJobCount: number;
  visibilityBraodBean: boolean;
  checkBothStatus: boolean;
  IntegrationSeekRegistrationObs: Subscription;
  IntegrationZoomRegistrationObs: Subscription;
  JobListObs:Subscription;
  JobWorkflowListObs:Subscription;
  FilterConfigObs:Subscription;
  JobCountWorkFlowByIdObs:Subscription;
  WorkflowByStageIdObs:Subscription;
  FectchJobListObs:Subscription;
  IntegrationBroadBeanRegistrationObs:Subscription;
  IntegrationCheckstatusObs:Subscription;
  destroy$: Subject<boolean> = new Subject<boolean>();
  UserIsEmailConnectedObs: Subscription;
  dateFormatKendo: string;
  private destroySubject: Subject<void> = new Subject();
  indeedRegistrationCode: string;
  WorkflowStageId: any;
  workflowStageList: any;
  @ViewChild('LandingEnddrawer') public sidenav: MatSidenav;
  sideMenuContext:string;
  drawerIconStatus: boolean = false;
  applicantStatus: boolean=false;
  //************ Kendo grid pageng variabel***********
public state: State;
public data: GridDataResult = { data: [], total: 0 };
public sizes= [50, 100, 200,300,400,500,1000];
public initialstate: State = {
  skip: 0,
  take: 200,
  group: [],
  filter: { filters: [], logic: "and" },
  sort: [{
    field: 'JobTitle',
    dir: 'asc'
  }],
};

public pageNumber:number=1;
public loaderStatus: number;
public othersParam: any[]=[];
public gridData:any[]=[];
public gridListDataFilter:[] = [];
public filter: CompositeFilterDescriptor = {logic: "and",filters: []};
  FilterDataClearList: any=[];
  event: PageChangeEvent;
  filterQueryString: string='';
  clearcache:string='';
  public totalCandidate:number;
  unsubscribeTotalCount:Subscription;
  constructor(private route: Router, public dialog: MatDialog, private jobService: JobService, private elementRef: ElementRef,
    private snackBService: SnackBarService, private commonserviceService: CommonserviceService, public systemSettingService: SystemSettingService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService, private router: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService, public _integrationsBoardService: IntegrationsBoardService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private mailService: MailServiceService, private routes: ActivatedRoute,
    private _BroadbeanService: BroadbeanService, private ngZone: NgZone,
    private titleService: Title,
    private _reloadService: ReloadService,public joblandingkendoservice:JoblandingkendopagingService,

    ) {
    //this.pagesize = this.appSettingsService.jobPagesize;
    // this.sizes = this.appSettingsService.jobPageSizeOptions;
    //this.state.take = this.pagesize;
    this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.seekRegistrationCode = this.appSettingsService.seekRegistrationCode;
    this.Broadbeanregistrationcode = this.appSettingsService.Broadbeanregistrationcode;
    this.indeedRegistrationCode = this.appSettingsService.indeedRagistrationCode;
    let loginUserName = JSON.parse(localStorage.getItem('currentUser'));
    this.loginUserName = loginUserName['FirstName'];

    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  reloadChild() {
    this._reloadService.reload();
  }
  ngOnInit(): void {
    this.state = { ...this.initialstate }
    /*--@Who:Nitin Bhati,@When:20-07-2023 @Why: EWM-13434--*/
    this.dateFormatKendo = localStorage.getItem('DateFormat');
    this.commonserviceService.onjobDrawerChange.subscribe(res => {
      if(res!=null){
       this.headerExpand=!res;
      }
     });
    this.routes.queryParams.subscribe((parmsValue) => {      
      //by maneesh ewm-17125 for ewm-17125
      this.isActive=sessionStorage.getItem('Activefilter');
      if (!parmsValue?.filter || parmsValue?.filter == null || parmsValue?.filter == undefined ) {
        let data = sessionStorage.getItem('Activefilter');    
        if (data != null && data != undefined && data!='') {
          this.isActive=data;          
          this.QuickFilter=this.isActive;
          this.getFilterConfig(true);
        }else{
        this.isActive='TotalJobs';  
        }
      }
      if (parmsValue.filter != null || parmsValue.filter != undefined) {
      /* if(parmsValue.filter=='TotalJobs' || parmsValue.filter=='TotalExpiredJobs'){
    
        this.QuickFilter = parmsValue.filter;
        }*/
        let JobsWithCandidate = 'JobsWithCandidate';
        let JobsWithoutCandidate = 'JobsWithoutCandidate';
        let TotalActiveJobs = 'TotalActiveJobs';
        let TotalExpiredJobs = 'TotalExpiredJobs';
        let TotalJobs = 'TotalJobs';
        if(parmsValue?.filter.toLowerCase()!=JobsWithCandidate.toLowerCase() && parmsValue?.filter.toLowerCase()!=JobsWithoutCandidate.toLowerCase() && parmsValue?.filter.toLowerCase()!=TotalActiveJobs.toLowerCase()){
         this.QuickFilter = parmsValue.filter;
        }
        if(parmsValue?.filter.toLowerCase()==JobsWithCandidate.toLowerCase() || parmsValue?.filter.toLowerCase()==JobsWithoutCandidate.toLowerCase() || parmsValue?.filter.toLowerCase()==TotalActiveJobs.toLowerCase() || parmsValue?.filter.toLowerCase()==TotalExpiredJobs.toLowerCase() || parmsValue?.filter.toLowerCase()==TotalJobs.toLowerCase()){
          this.selectjobcatparam = parmsValue.filter;
        }
        if(parmsValue.filter=='TotalActiveJobs'){
          this.isActive = 'ActivePositions';          
          this.QuickFilter = 'ActivePositions';
          this.selectjobcatparam = parmsValue.filter;
          this.workflowId = parmsValue.Id;
        }else{
          this.isActive = parmsValue.filter;
          this.workflowId = parmsValue.Id;
          let data = sessionStorage.getItem('Activefilter'); 
          if (data != null && data != undefined && data!='') {
            this.isActive=data;          
            this.QuickFilter=this.isActive;  
          }
        }
      }
    });
    this.getIntegSeekRegistrationAll();
    this.getOtherIntegrationZoomCheckstatus();
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.activesubMenuObs.next('landing');
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getJobWorkflowList();
    this.getFilterConfig(true);
    let queryParams = this.router.snapshot.params.Id;
    this.workflowId = decodeURIComponent(queryParams);
    //this.getJobFilterCount(this.workflowId);
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth, 'onload');
    this.animationVar = ButtonTypes;
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
     this.loadingSearch = val;
      this.sendRequest(this.state);
    });

    this.router.queryParams.subscribe((data: any) => {
      if (data['page']) {
        this.snackBService.showSuccessSnackBar(this.translateService.instant('10000'), '200');
        window.top.location.href = 'client/jobs/job/job-list/list/' + this.workflowId;
      }
    })
    this.getOtherIntegrationCheckstatusForBroadbean();
    this.commonserviceService.jobDrawer.next(true);  /*****@Who:Renu @Why:Ewm-12842 ewm-12912 @When:03-06-2023 */
    // @suika @EWM-13954 @whn-23-08-2023
    this.commonserviceService.OrgSelectIdObs.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(value => {
      if (value!==null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.fitColumns(); //by maneesh ewm-13696 when:15/05/2024
    sessionStorage.removeItem('Activefilter'); //by maneesh ewm-17125 for ewm-17125
  }
  reloadApiBasedOnorg() {
    this.getJobWorkflowList();
    this.getFilterConfig(true);
    //this.getJobFilterCount(this.workflowId);
    this.getWorkFlowStages(this.workflowId);
  }
/*
 @Name: ngOnDestroy
 @Who: Nitin Bhati
 @When: 05-06-2023
 @Why: EWM-12708
 @What: use for unsubsribe service
*/
  ngOnDestroy() {
    const columns = this.grid.columns;
    /*--@who:@Nitin Bhati,@when:24-04-2023, @why:EWM-12065, handle null--*/
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
            .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig); 
      //this.mobileQuery.removeListener(this._mobileQueryListener);
    }
   /*--@who:@Nitin Bhati,@when:06-06-2023, @why:EWM-12708, unsubsribe call--*/
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.IntegrationSeekRegistrationObs?.unsubscribe();
    this.IntegrationZoomRegistrationObs?.unsubscribe();
    this.JobListObs?.unsubscribe();
    this.JobWorkflowListObs?.unsubscribe();
    this.FilterConfigObs?.unsubscribe();
    this.JobCountWorkFlowByIdObs?.unsubscribe();
    this.WorkflowByStageIdObs?.unsubscribe();
    this.FectchJobListObs?.unsubscribe();
    this.IntegrationBroadBeanRegistrationObs?.unsubscribe();
    this.IntegrationCheckstatusObs?.unsubscribe();
    this.UserIsEmailConnectedObs?.unsubscribe();
    this.commonserviceService.jobDrawer.next(false);  /*****@Who:Renu @Why:Ewm-12842 ewm-12912 @When:03-06-2023 */
    this.unsubscribeTotalCount?.unsubscribe();
    sessionStorage.removeItem('QuickFilterForClone'); //by maneesh ewm-17125 for ewm-17125
  }

  closeDynamicFilterArea() {
    this.dynamicFilterArea = false;
  }
  setShowAlert(event) {
    if (event.checked == 1) {
      this.filterAlert = 1;
    } else {
      this.filterAlert = 0;
    }
    this.setConfiguration(this.colArr);
  }

  openDynamicFilterArea() {
    this.dynamicFilterArea = true;
  }

  headerExpandCollapse() {
    this.headerExpand = !this.headerExpand;
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
  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }





  private detectScreenSize() {
    const currentSize = this.sizess.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
      // check its display property value
    })

    this.mobileMenu();
  }




  mobileMenu() {
    // this.mobileScreenTag = false;
    if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 1024) {
      this.largeScreenTag = false;
      this.mobileScreenTag = true;
    } else {
      this.largeScreenTag = true;
      this.mobileScreenTag = false;
    }
  }


  /*
 @Type: File, <ts>
 @Name: setConfiguration function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: For saving the setting config WITH WIdth of columns
  */

  setConfiguration(columnsConfig) {
    let gridConf = {};
    let tempArr: any[] = this.colArr;
    columnsConfig?.forEach(x => {
      // @When: 05-07-2023 @who:Amit @why: EWM-12954 @what:add question mark
      let objIndex: any = tempArr?.findIndex((obj => obj.Field == x.field));
      if (objIndex >= 0) {

        tempArr[objIndex].Format = x.format,
          tempArr[objIndex].Locked = x.locked,
          tempArr[objIndex].Order = x.leafIndex + 1,
          tempArr[objIndex].Selected = true,
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
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        //  this.getFilterConfig(true);
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  maxNumberClass(perSlide) {
    if (this.totalStages > perSlide) {
      this.screenPreviewClass = 'flext-start';
    } else {
      this.screenPreviewClass = '';
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event, loadingType) {
    this.detectScreenSize();
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
    }
    if(this.currentMenuWidth >= 1650 && this.currentMenuWidth <= 1800){
      this.screnSizePerStage = 7;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 1500 && this.currentMenuWidth <= 1650){
      this.screnSizePerStage = 6;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 1400 && this.currentMenuWidth <= 1500){
      this.screnSizePerStage = 5;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 1300 && this.currentMenuWidth <= 1400){
      this.screnSizePerStage = 4;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 950 && this.currentMenuWidth <= 1300){
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth >= 441 && this.currentMenuWidth <= 950){
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    }else if(this.currentMenuWidth > 280 && this.currentMenuWidth <= 441){
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    }else{
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    }
  }
/*
@Type: File, <ts>
@Name: getWorkFlowStages function
@Who: Renu
@When: 19-Jul-2021
@Why: ROST-2087
@What: For getting the stages basesd on workflowId
 */
  getWorkFlowStages(Id?: any) {
    this.loadingStage = true;
    // let Jobobj={};
    // Jobobj['workflowId']=Id;
    // Jobobj['countfilter']=this.selectjobcatparam;
    // Jobobj['quickfilter']=this.QuickFilter;
    // Jobobj['JobFilterParams']= this.filterConfig;
    this.othersParam=[];
     this.othersParam.push({
      WorkflowId: this.workflowId,
      GridId:this.GridId,
      CountFilter:this.selectjobcatparam,
      QuickFilter:this.QuickFilter,
    });
    let queryString=this.joblandingkendoservice.QueryString(this.filterConfig !== null?this.filterConfig:[],this.searchValue,this.sortingValue,this.othersParam);
    /*who:Renu,what: EWM-14999 EWM-15107,when:08/11/2023 changes from get to post api*/
    this.WorkflowByStageIdObs = this.jobService.jobworkFlowBypipeIdV2(queryString).pipe(takeUntil(this.destroy$)).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.stagesList = data.Data.Stages;
          const pageTitle= "Jobs | " + data.Data?.WorkflowName;
  		    this.titleService.setTitle(pageTitle);
          this.totalStages = this.stagesList?.length;
          this.loadingStage = false;
        } else {
          this.loadingStage = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loadingStage = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2087
  @What: For getting the deafult config for the user
   */
  onSwiper(swiper) {
    // console.log(swiper);
  }


  getFilterConfig(loaderValue: boolean) {
    this.loading = loaderValue;
    this.FilterConfigObs = this.jobService.getfilterConfig(this.GridId).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          // this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.gridColConfigStatus = repsonsedata.Data.IsDefault;  /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064--*/
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig;

            this.filterAlert = repsonsedata.Data.FilterAlert;
            this.quickFilterStatus = repsonsedata.Data.QuickFilter;
            if(this.filterConfig && this.filterConfig!==null){
              this.FilterQueryString(this.filterConfig);
            }else{
              this.getJobFilterCount(this.workflowId);
            }

            /*@why:EWM-14999 EWM-15000 @Who:Renu @What:Passing a parameter to handle dynamic filter popup on load**/
            this.dynamicFilterArea = false;

            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig?.length;
            } else {
              this.filterCount = 0;
            }
            if (repsonsedata.Data.GridConfig?.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
            }
            if (colArrSelected?.length !== 0) {
              this.columns = colArrSelected;
              //<!-----@suika@EWM-10650 EWM-10818  @09-03-2023 to set the order of columns--->
              this.columns.sort((a, b) => {
                return a.Order < b.Order ? -1 : 1;
              });
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

          this.sendRequest(this.state);

          // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam, this.QuickFilter);
          this.getWorkFlowStages(this.workflowId);
          // }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          // this.loading = false;
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
 @Type: File, <ts>
 @Name: openFilterModalDialog function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For opening filter  dialog box
  */

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(JobFilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, workflowId: this.workflowId }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.loading = true;
        this.filterCount = res.data?.length;
        let filterParamArr = [];

        res.data?.forEach(element => {
          if (element.filterParam.Type === 'Date') {
            let ParamValue = this.appSettingsService.getUtcDateFormat(element.ParamValue);
            filterParamArr.push({
              'FilterValue': ParamValue,
              'ColumnName': element.filterParam.Field,
              'ColumnType': element.filterParam.Type,
              'FilterOption': element.condition,
              'FilterCondition': 'AND'
            })
          } else {
            filterParamArr.push({
              'FilterValue': element.ParamValue,
              'ColumnName': element.filterParam.Field,
              'ColumnType': element.filterParam.Type,
              'FilterOption': element.condition,
              'FilterCondition': 'AND'
            })
          }


        });
        this.state.skip=0;
        this.loading = true;
        this.filterConfig=filterParamArr;
        this.FilterQueryString( this.filterConfig);
        this.othersParam=[];
        this.othersParam.push({
         WorkflowId: this.workflowId,
         GridId:this.GridId,
         CountFilter:this.selectjobcatparam,
       });
       if (this.isActive !== '0') {
        this.othersParam.push({
        QuickFilter:this.QuickFilter,
        })
      }
      this.getWorkFlowStages(this.workflowId);
      this.createConfiguration();
       let queryString=this.joblandingkendoservice.QueryString( filterParamArr,this.searchValue,this.sortingValue,this.othersParam);
       this.JobListObs = this.jobService.getjoblist(this.state,queryString).pipe(takeUntil(this.destroy$)).subscribe(
          (repsonsedata: GridDataResult) => {
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;
            this.loaderStatus = 0;
            this.data = repsonsedata;
            this.gridListData=repsonsedata.data;
            this.totalJobCount = repsonsedata.total;
            this.getApplicatList();
            if(this.gridColConfigStatus){
              this.fitColumns();
            }

          //   if (repsonsedata.HttpStatusCode === 200) {
          //     this.loading = false;
          //     this.loadingSearch = false;
          //     this.loadingscroll = false;
          //   this.data = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
          //   this.gridListData=repsonsedata.Data;
          //   this.totalJobCount = repsonsedata.TotalRecord;
          //   if(this.gridColConfigStatus){
          //     this.fitColumns();
          //   }
          // }else if (repsonsedata.HttpStatusCode === 204){
          //   this.data = null;
          //   this.gridListData=null;
          //   this.totalJobCount = repsonsedata.TotalRecord;
          //   this.loading = false;
          //   this.loadingSearch = false;
          //   this.loadingscroll = false;
          // }else if (repsonsedata.HttpStatusCode === 400){
          //   this.data =null;
          //   this.gridListData=null;
          //   this.totalJobCount = repsonsedata.TotalRecord;
          //   this.loading = false;
          //   this.loadingSearch = false;
          //   this.loadingscroll = false;
          // }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      }
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

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
 @Name: openActionModalDialog function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For opening action dialog box
  */

  openActionModalDialog() {
    // @When: 05-07-2023 @who:Amit @why: EWM-12954 @what:add column code
    const columns = this.grid.columns;
    /*--@who:@Nitin Bhati,@when:24-04-2023, @why:EWM-12065, handle null--*/

    if (columns) {
     const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
            .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig);
      //this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    let otherConfigObj={};
    otherConfigObj['filterAlert']=this.filterAlert;
    otherConfigObj['filterConfig']=this.filterConfig;
    otherConfigObj['quickFilterStatus']=this.quickFilterStatus;
    const dialogRef = this.dialog.open(JobActionDialogComponent, {
      maxWidth: "750px",
      data: new Object({ GridId: this.GridId,gridConfig:otherConfigObj }),
      panelClass: ['quick-modalbox', 'add_actiondialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {

      if (res != false) {
        this.colArr = res.data;    //<!-----@suika@EWM-10650 @whn  @021-03-2023 to handle API url----->
      // this.columns=res.data;
      let selectedCol = [];
        selectedCol = res.data.filter(x => x['Selected'] == true);
        if (selectedCol?.length != 0) {
          selectedCol.sort(function (a, b) {
            return a.Order - b.Order;
          });
          this.columns = selectedCol;

          this.columnsWithAction = this.columns;
          this.columnsWithAction.splice(0, 0, {
            "Type": "Action",
            "Field": "",
            "Order": 0,
            "Title": "",
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
            "Field": "",
            "Order": 0,
            "Title": "",
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
        this.getFilterConfig(false); //@When: 13-07-2023 @who:Nitin Bhati @why: EWM-13108 @what: for calling function
      }

    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }




  /*@Type: File, <ts>
  @Name: onFilter function
  @Who: maneesh
  @When: 09-jan-2024
  @Why: EWM-15699
  @What: use for Searching record
   */
  public onFilter(inputValue: string): void {
    this.searchValue = inputValue;
    if (inputValue?.length > 0 && inputValue?.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.loaderStatus = 1;
    this.state.skip=0;
    this.loadingSearch = true;
    this.searchSubject$.next(this.loadingSearch);
  }
  // who:maneesh,what:ewm-15699 for local search when:09/01/2023
  public gridViewlistFilter: GridDataResult;
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    if(this.filter?.filters?.length==0){
       this.data= this.FilterDataClearList;
      this.totalJobCount = this.FilterDataClearList.total;
    }else{
      this.loadData();
    }
  }
  public gridViewlist: GridDataResult;
  public loadData(): void {
    this.gridData = filterBy(this.gridListDataFilter, this.filter);
    this.gridViewlist = {
      data: this.gridData,
      total: this.gridData.length
    };
    this.data=this.gridViewlist;
    this.totalJobCount = this.gridViewlist.total;
  }

  getFilterValue(searchValue) {
    let jsonObj = {};
    if (this.filterConfig !== null) {
      jsonObj['JobFilterParams'] = this.filterConfig;
    } else {
      jsonObj['JobFilterParams'] = [];
    }
    jsonObj['search'] = searchValue;
    jsonObj['PageNumber'] = this.pagneNo;
    jsonObj['PageSize'] = this.pagesize;
    jsonObj['OrderBy'] = this.sortingValue;
    jsonObj['WorkflowId'] = this.workflowId;
    jsonObj['GridId'] = this.GridId;
    jsonObj['CountFilter'] = this.selectjobcatparam;
    this.pagneNo=this.state.skip/this.state.take + 1;
    this.sortingValue = this.state.sort[0].field + '-' +this.state.sort[0].dir;
    jsonObj['page'] = this.pagneNo;
    jsonObj['sort'] = this.sortingValue;
    /*--@Who:Nitin Bhati,@When: 23-03-2023,@Why:EWM.11450,@What: For pass varibale for quick filter--*/
    if (this.isActive !== '0') {
      jsonObj['QuickFilter'] = this.QuickFilter;
    }
    this.FectchJobListObs= this.jobService.fetchJoblist(jsonObj).pipe(takeUntil(this.destroy$)).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          this.data = {data:repsonsedata['Data'],total:repsonsedata.TotalRecord};
          this.gridListData = repsonsedata['Data'];
          // <!-- /*--@who:@Bantee Kumar,@when:11-05-2023, @why:EWM-12369, To show total jobs on the landing page --*/ -->
          this.totalJobCount = repsonsedata.TotalRecord;

        } else {
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Name: onFilterClear function
  @Who: Suika
  @When: 17-June-2022
  @Why: EWM-7001
  @What: use Clear for Searching records
  */
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.loaderStatus = 0;
    this.sendRequest(this.state);
  }
  /*
 @Type: File, <ts>
 @Name: getJobList function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For getting the job list
  */

  getJobList(pagesize, pagneNo, sortingValue, searchVal, workflowId, JobFilter, isScroll: boolean, selectjobcatparam, QuickFilter) {
    if (isScroll == true) {
      this.loading = false;
    } else if (isScroll == false) {
      this.loading = true;
    }
    else {
      this.loading = true;
    }

    let jsonObj = {};
    if (this.filterConfig !== null) {
      jsonObj['JobFilterParams'] = this.filterConfig;
    } else {
      jsonObj['JobFilterParams'] = [];
    }

    jsonObj['search'] = searchVal;
    jsonObj['PageSize'] = this.state.take;
    jsonObj['WorkflowId'] = workflowId;
    jsonObj['GridId'] = this.GridId;
    jsonObj['CountFilter'] = this.selectjobcatparam;
    this.pagneNo=this.state?.skip/this.state?.take + 1;
    jsonObj['page'] = this.pagneNo;
    jsonObj['sort'] = sortingValue;
    /*--@Who:Nitin Bhati,@When: 23-03-2023,@Why:EWM.11450,@What: For pass varibale for quick filter--*/
    if (this.isActive !== '0') {
      jsonObj['QuickFilter'] = this.QuickFilter;
    }

    this.JobListObs = this.jobService.fetchJoblist(jsonObj).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          this.data = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
          this.gridListData=repsonsedata.Data;
          this.totalJobCount = repsonsedata.TotalRecord;
        if(this.gridColConfigStatus){
          this.fitColumns();
        }
      }else if (repsonsedata.HttpStatusCode === 204){
        this.data = null;
        this.gridListData=null;
        this.totalJobCount = repsonsedata.TotalRecord;
        this.loading = false;
        this.loadingSearch = false;
        this.loadingscroll = false;
      }else if (repsonsedata.HttpStatusCode === 400){
        this.data = null
        this.gridListData=null;
        this.totalJobCount = repsonsedata.TotalRecord;
        this.loading = false;
        this.loadingSearch = false;
        this.loadingscroll = false;

      }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
          this.loadingSearch = false;

        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  public sendRequest(state: State): void {
    this.animate();
    if (this.loaderStatus === 1) {
      this.loading = false;
      this.kendoLoading = false;
    } else {
      this.loading = true;
      this.kendoLoading = true;
    }
     this.othersParam=[];
     this.othersParam.push({
      WorkflowId: this.workflowId,
      GridId:this.GridId,
      CountFilter:this.selectjobcatparam,
      QuickFilter:this.QuickFilter,
    });
    let queryString=this.joblandingkendoservice.QueryString(this.filterConfig !== null?this.filterConfig:[],this.searchValue,this.sortingValue,this.othersParam);
    if(this.clearcache!=''){
      queryString=queryString+this.clearcache
    }
    this.JobListObs = this.jobService.getjoblist(state,queryString).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: any) => {
        this.clearcache='';
      this.loading = false;
      this.loadingSearch = false;
      this.loadingscroll = false;
      this.data = repsonsedata;
      this.gridListData=repsonsedata.data;
      this.gridListDataFilter= repsonsedata.data;
      this.FilterDataClearList = repsonsedata;
      this.getApplicatList();
      this.totalJobCount = repsonsedata.total;
      this.loaderStatus = 0;
      this.loading = false;
      // if(this.gridColConfigStatus){ //by maneesh ewm-13696 when:15/05/2024
      //   this.fitColumns();
      // }

    })
    }
  /*
 @Type: File, <ts>
 @Name: showTooltip function
 @Who: Suika
 @When: 17-June-2022
 @Why: ROST-7001
 @What: For showing tooltip in kendo
*/
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;

    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && !Number.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
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
 @Name: getJobWorkflowList function
 @Who: Renu
 @When: 19-Jul-2021
 @Why: ROST-2087
 @What: For getting the job list
  */

  getJobWorkflowList() {
    this.JobWorkflowListObs= this.jobService.jobLandingWorkflowList().pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          // this.loading = false;
          this.workflowList = repsonsedata.Data;
          this.totalJobsWorkFlow = this.workflowList.filter(x => x.Id === this.workflowId)[0]?.TotalJobs;
        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          //  this.loading = false;
        }
      }, err => {
        //  this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: getWorkflowBasisList function
  @Who: Renu
  @When: 19-Jul-2021
  @Why: ROST-2087
  @What: For list data based on workflowId
   */
  getWorkflowBasisList(event) {
   // this.selectjobcatparam = 'TotalJobs'; // @suika @EWM-13619 @whn 08-08-2023 remove static value set in counter filter.
    this.workflowId = event;
   // this.isActive = '0'; // @suika @EWM-13619 @whn 08-08-2023 remove this code to maintain quick filter state.
    this.totalJobsWorkFlow = this.workflowList.filter(x => x.Id === this.workflowId)[0].TotalJobs;
    this.getWorkFlowStages(this.workflowId);
    this.getJobFilterCount(this.workflowId);
    this.sendRequest(this.state);
    // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam,this.QuickFilter);
  }

  /*
    @Type: File, <ts>
    @Name: sortChange function
    @Who: Nitin Bhati
    @When: 10-Jan-2024
    @Why: EWM-15699
    @What: for sorting
  */
  public sortChange($event): void {
    this.sortDirection = $event[0].dir;
    this.state.sort=[];
    this.state.sort.push({
      'field':$event[0].field,
      'dir':$event[0].dir
    })
    this.sendRequest(this.state);
   }

  /*
  @Type: File, <ts>
  @Name: pageChange function
  @Who: Renu
  @When: 23-July-2021
  @Why: EWM-2087
  @What: for Pagination data
*/
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalJobCount > this.gridListData?.length) {
      // this.pagneNo = this.pagneNo + 1;
    this.sendRequest(this.state);
      // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, true, this.selectjobcatparam, this.QuickFilter);
    } else {
      this.loadingscroll = false;
    }
  }

  /*
  @Type: File, <ts>
  @Name: switchListMode function
  @Who: Renu
  @When: 23-July-2021
  @Why: EWM-2087
  @What: for swtiching list mode to cARD MODE OR VICE VERSA
*/
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.animate();
    } else {
      this.viewMode = "listMode";
      this.animate();
      this.state = { ...this.initialstate }
      this.sendRequest(this.state);
      //listHeader.classList.remove("hide");
    }
  }

  /*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who: Renu
   @When: 18-June-2021
   @Why: ROST-1860
   @What: FOR DIALOG BOX confirmation
 */

  clearFilterData(viewMode): void {
    const message = ``;
    const title = '';
    const subTitle = 'Joblanding_filters';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.filterConfig = null;
        let JobFilter = [];
        this.loading = true;
        this.othersParam=[];
        this.othersParam.push({
         WorkflowId: this.workflowId,
         GridId:this.GridId,
         CountFilter:this.selectjobcatparam,
       });
       if (this.isActive !== '0') {
        this.othersParam.push({
        QuickFilter:this.QuickFilter,
        })
      }
      this.createConfiguration();
      let queryString=this.joblandingkendoservice.QueryString( JobFilter,this.searchValue,this.sortingValue,this.othersParam);
       this.JobListObs = this.jobService.getjoblist(this.state,queryString).pipe(takeUntil(this.destroy$)).subscribe(
          (repsonsedata: GridDataResult) => {
              this.data = repsonsedata;
              this.gridListData=repsonsedata.data
              this.loaderStatus = 1;
              this.totalJobCount=repsonsedata?.total
              this.getFilteredConfig();
              this.getWorkFlowStages(this.workflowId);
              this.loading = false;
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }


  /*
@Type: File, <ts>
@Name: goToCreateJob function
@Who: Anup Singh
@When: 28-july-2021
@Why: EWM-2003 EWM-2158
@What: for go to create job
*/
  goToCreateJob() {
    this.route.navigate(['/client/jobs/job/job-manage/create-job-selection', { workFlowLenght: 1,createJobForm: "blankForm" }],);
  }


  divScroll(e) {
    //console.log(e.srcElement, "e.srcElement.scrollTop")
    if (e.srcElement.scrollTop >= 20) {
      this.scrolledValue = e.isTrusted;
    } else {
      this.scrolledValue = false;
    }
  }



  /*
@Type: File, <ts>
@Name: onScrollDown
@Who: Nitin Bhati
@When: 12-Nov-2021
@Why: EWM-3734
@What: To add data on page scroll.
*/
  onScrollDown(ev?) {
    this.loadingscroll = true;
      this.canLoad = false;
      this.pendingLoad = false;


      if (this.totalJobCount == this.gridListData?.length) {
        // this.pageNumber = this.pageNumber + 1;
        this.loadingscroll = false;
        }else if(this.totalJobCount > this.gridListData?.length && this.totalJobCount != this.gridListData?.length){
      this.fetchMoreRecord(this.filterConfig, true, this.selectjobcatparam, this.QuickFilter);
    }
      else {
        this.loadingscroll = false;
      }

  }

  fetchMoreRecord( JobFilter, isScroll: boolean, selectjobcatparam, QuickFilter) {
    this.state.skip= this.state.skip + this.state.take;
    this.othersParam=[];
    this.othersParam.push({
     WorkflowId: this.workflowId,
     GridId:this.GridId,
     CountFilter:this.selectjobcatparam,
   });
  // if (JobFilter !== null) {
    // this.othersParam.push({
    //   JobFilterParams:this.filterConfig,
    // })
  // }
   if (this.isActive !== '0') {
    this.othersParam.push({
    QuickFilter:this.QuickFilter,
    })
  }
  let queryString=this.joblandingkendoservice.QueryString( JobFilter !== null?this.filterConfig:[],this.searchValue,this.sortingValue,this.othersParam);
   this.JobListObs = this.jobService.getjoblist(this.state,queryString).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: GridDataResult) => {
       this.loadingscroll = false;
       let nextgridView: any = [];
       nextgridView = repsonsedata.data;
       if(this.gridColConfigStatus){
         this.fitColumns();
       }
       this.gridListData = this.gridListData.concat(nextgridView);
   }, err => {
     this.loading = false;
     this.loadingscroll = false;
     //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

   })
}
  // fetchMoreRecord(pagesize, pagneNo, sortingValue, searchVal, workflowId, JobFilter, isScroll: boolean, selectjobcatparam, QuickFilter) {
  //   if (isScroll == true) {
  //     this.loading = false;
  //   } else if (isScroll == false) {
  //     this.loading = true;
  //   }
  //   else {
  //     this.loading = true;
  //   }

    // let jsonObj = {};
    // if (JobFilter !== null) {
    //   jsonObj['JobFilterParams'] = this.filterConfig;
    // } else {
    //   jsonObj['JobFilterParams'] = [];
    // }

    // jsonObj['search'] = searchVal;
    // jsonObj['PageSize'] = this.state.take;
    // jsonObj['WorkflowId'] = workflowId;
    // jsonObj['GridId'] = this.GridId;
    // jsonObj['CountFilter'] = this.selectjobcatparam;
    // jsonObj['page'] = pagneNo;
    // jsonObj['sort'] = sortingValue;
    // if (this.isActive !== '0') {
    //   jsonObj['QuickFilter'] = this.QuickFilter;
    // }

    // this.JobListObs = this.jobService.fetchJoblist(jsonObj).pipe(takeUntil(this.destroy$)).subscribe(
    //   (repsonsedata: ResponceData) => {
    //  this.state.skip= this.state.skip + this.state.take;
    //   this.othersParam=[];
    //   this.othersParam.push({
    //    WorkflowId: this.workflowId,
    //    GridId:this.GridId,
    //    CountFilter:this.selectjobcatparam,
    //  });
    // if (JobFilter !== null) {
    //   this.othersParam.push({
    //     JobFilterParams:this.filterConfig,
    //   })
    // }
    //  if (this.isActive !== '0') {
    //   this.othersParam.push({
    //   QuickFilter:this.QuickFilter,
    //   })
    // }
    // let queryString=this.joblandingkendoservice.QueryString( JobFilter !== null?this.filterConfig:[],this.searchValue,this.sortingValue,this.othersParam);
    //  this.JobListObs = this.jobService.getjoblist(this.state,queryString).pipe(takeUntil(this.destroy$)).subscribe(
    //     (repsonsedata: GridDataResult) => {
    //       this.loading = false;
    //         this.loadingscroll = false;
    //         let nextgridView: any = [];
    //         nextgridView = repsonsedata.data;
    //         if(this.gridColConfigStatus){
    //           this.fitColumns();
    //         }
    //         this.gridListData = this.gridListData?.concat(nextgridView);
      //   if (repsonsedata.HttpStatusCode === 200) {
      //     this.loadingscroll = false;
      //     let nextgridView: any = [];
      //     nextgridView = repsonsedata.Data;
      //     if(this.gridColConfigStatus){
      //       this.fitColumns();
      //     }
      //     this.gridListData = this.gridListData?.concat(nextgridView);
      // }else if (repsonsedata.HttpStatusCode === 204){
      //   this.data = null;
      //   this.gridListData=null;
      //   this.loading = false;
      //   this.loadingSearch = false;
      //   this.loadingscroll = false;
      // }else if (repsonsedata.HttpStatusCode === 400){
      //   this.gridListData=null;
      //   this.totalJobCount = repsonsedata.TotalRecord;
      //   this.loading = false;
      //   this.loadingSearch = false;
      //   this.loadingscroll = false;

      // }
  //     }, err => {
  //       this.loading = false;
  //       this.loadingscroll = false;
  //         this.loadingSearch = false;

  //       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //     })
  // }
  /*
@Type: File, <ts>
@Name: openCopyJobModalDialog function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: open popup for copy job
*/
  openCopyJobModalDialog(jobId) {
    sessionStorage.setItem('jobLandingQuickFilter',this.QuickFilter)
    const dialogRef = this.dialog.open(CopyJobComponent, {
      data: new Object({ jobId: jobId,QuickFilterForClone:this.QuickFilter }),
      panelClass: ['xeople-modal', 'add_copyJob', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {
    })

  }


  /*
  @Type: File, <ts>
  @Name: closeDrawerForFilter
  @Who: Anup Singh
  @When: 9-Dec-2021
  @Why:EWM-3959 EWM-3614
  @What: to open Drawer
  */
  openDrawerForFilter() {
    this.isShowFilter = true;
  }

  /*
  @Type: File, <ts>
  @Name: closeDrawerForFilter
  @Who: Anup Singh
  @When: 24-Dec-2021
  @Why:EWM-3959 EWM-3614
  @What: to open Drawer
  */
  closeDrawerForFilter() {
    this.isShowFilter = false;
  }

  /*
  @Type: File, <ts>
  @Name: closeDrawerForFilter
  @Who: Anup Singh
  @When: 9-Dec-2021
  @Why:EWM-3959 EWM-3614
  @What: to open Drawer
  */
  fetchsetFilterData(filterValue) {
    let jsonObjFilter = {};
    if (filterValue != undefined && filterValue != null && filterValue?.length != 0) {
      //this.loading = true;
      this.filterCount = filterValue?.length;
      let filterParamArr = [];
      filterValue?.forEach(element => {
        filterParamArr.push({
          'FilterValue': element.ParamValue,
          'ColumnName': element.filterParam.Field,
          'ColumnType': element.filterParam.Type,
          'FilterOption': element.condition,
          'FilterCondition': 'AND'
        })
      });
      this.filterConfig = filterParamArr;
      //this.loading = true;
      jsonObjFilter['JobFilterParams'] = filterParamArr;
      jsonObjFilter['search'] = this.searchValue;
      jsonObjFilter['PageNumber'] = this.pagneNo;
      jsonObjFilter['PageSize'] = this.pagesize;
      jsonObjFilter['OrderBy'] = this.sortingValue;
      jsonObjFilter['WorkflowId'] = this.workflowId;
      jsonObjFilter['GridId'] = this.GridId;
      /*--@Who:Nitin Bhati,@When: 23-03-2023,@Why:EWM.11450,@What: For pass varibale for quick filter--*/
      if (this.isActive !== '0') {
        jsonObjFilter['QuickFilter'] = this.QuickFilter;
      }
    } else {
      //this.loading = true;
      this.filterCount = filterValue?.length;
      let filterParamArr = [];
      this.filterConfig = filterParamArr;
      jsonObjFilter['JobFilterParams'] = filterParamArr;
      jsonObjFilter['search'] = this.searchValue;
      jsonObjFilter['PageNumber'] = this.pagneNo;
      jsonObjFilter['PageSize'] = this.pagesize;
      jsonObjFilter['OrderBy'] = this.sortingValue;
      jsonObjFilter['WorkflowId'] = this.workflowId;
      jsonObjFilter['GridId'] = this.GridId;
      this.pagneNo=this.state.skip/this.state.take + 1;
      this.sortingValue = this.state.sort[0].field + '-' +this.state.sort[0].dir;
      jsonObjFilter['page'] = this.pagneNo;
      jsonObjFilter['sort'] = this.sortingValue;
      /*--@Who:Nitin Bhati,@When: 23-03-2023,@Why:EWM.11450,@What: For pass varibale for quick filter--*/
      if (this.isActive !== '0') {
        jsonObjFilter['QuickFilter'] = this.QuickFilter;
      }
    }
    this.jobService.fetchJoblist(jsonObjFilter).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.gridListData = repsonsedata.Data;
          // <!-- /*--@who:@Bantee Kumar,@when:11-05-2023, @why:EWM-12369, To show total jobs on the landing page --*/ -->
          this.totalJobCount = repsonsedata.TotalRecord;

          this.getFilterConfig(false);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })


    // else{
    //   console.log(filterValue,"filterValue")
    //   this.filterConfig = [];
    //   this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false);
    //     this.getFilterConfig(false);
    // }
  }

  /*
    @Type: File, <ts>
    @Name: clickPublish
    @Who: Adarsh Singh
    @When: 25-APRIL-2023
    @Why:EWM-10282 EWM-10476
    @What: for publish job on click
  */
  clickPublish(data) {
    this.selectedIndex = 0;
    this.commonserviceService.onselectedIndexId.next(this.selectedIndex);
    this.commonserviceService.onSeekJobPublishedSelectId.next(null);
    //<!-----@Adarsh singh@EWM-10282 EWM-10476  @25-04-2023 Set json for job published from broadbean----->
    let jobDataForBroadbean: BroadbeanPosting = {
      JobTitle: data?.JobTitle,
      JobReferenceId: data?.JobReferenceId,
      JobTypeName: data?.JobTypeName,
      Location: data?.Location,
      IndustryName: data?.IndustryName,
      SalaryMin: data?.SalaryMin,
      SalaryMax: data?.SalaryMax,
      CurrencyName: data?.CurrencyName,
      SalaryUnitName: data?.SalaryUnitName,
      salaryBenefits: 'salary benefits',
      JobDescription: data?.JobDescription,
      ApplicationFormId: data?.ApplicationFormId,
      ApplicationFormName: data?.ApplicationFormName,
      WorkflowId: data?.WorkflowId,
      Id: data?.Id,
      PublishedOnSeek: data?.PublishedOnSeek,
      PublishedOnIndeed: data?.PublishedOnIndeed
    };
    this._BroadbeanService.onBroadBeadSelect.next(jobDataForBroadbean);
    // End
  }

  /*
    @Type: File, <ts>
    @Name: onJobClick
    @Who: Adarsh Singh
    @When: 25-APRIL-2023
    @Why:EWM-10282 EWM-10476
    @What: for set job in localStorage for published broadbean job from job details page
  */
  onJobClick(data: any) {
    localStorage.setItem('jobDetails', JSON.stringify(data));
    sessionStorage.setItem('jobDetails', JSON.stringify(data));
  }

  clickPublished(data) {
    window.open(data);
  }

  getDataCount(param) {
    // console.log("param ",param);
    this.selectjobcatparam = param;
    this.pagneNo = 1;
    this.getWorkFlowStages(this.workflowId);
    this.sendRequest(this.state);
    // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam, this.QuickFilter);
  }
  /*
  @Type: File, <ts>
  @Name: getJobDetailsCount function
  @Who:  Suika
  @When: 22-Dec-2021
  @Why:  ROST-4229
  @What: For getting the job list
   */
  getJobDetailsCount(workflowId) {
    let jsonObj = {};
    jsonObj['workflowid'] = workflowId;
    jsonObj['GridId'] = this.GridId;
    this.jobService.getJobCountDetails('?workflowid=' + workflowId).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          //console.log("repsonsedata ",repsonsedata);
          //  this.gridListData = repsonsedata.Data;
          this.TotalActiveJobs = repsonsedata.Data.TotalActiveJobs;
          this.JobWithCandidate = repsonsedata.Data.JobWithCandidate;
          this.JobWithoutCandidate = repsonsedata.Data.JobWithoutCandidate;
          // this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          // this.loading = false;
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  // refresh button onclick method by Adarsh Singh
  refreshComponent() {
    this.sortingValue = '';
    this.seekRegisCode = 0;
    // this.pagneNo = 1;
    this.getJobFilterCount(this.workflowId);
    this.getIntegSeekRegistrationAll();
    this.clearcache='&clearcache=1';
    this.state = { ...this.initialstate }
    this.sendRequest(this.state);
    // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam, this.QuickFilter);
    this.getWorkFlowStages(this.workflowId); /*who:Renu,what: EWM-14999 EWM-15107,when:08/11/2023*/
  }

  /*
   @Type: File, <ts>
   @Name: getIntegSeekRegistrationAll function
   @Who: Nitin Bhati
   @When: 27-Jan-2022
   @Why: EWM-4686
   @What: For getting registration code data
  */
  getIntegSeekRegistrationAll() {
    // this.loading = true;
    this.IntegrationSeekRegistrationObs =  this._integrationsBoardService.getIntegrationAll().pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          // this.loading = false;
          this.seekRegistrationList = repsonsedata.Data;
          this.seekRegisCodeList = this.seekRegistrationList?.filter((e: any) => e.RegistrationCode === this.seekRegistrationCode);

          this.seekRegisCode = this.seekRegisCodeList[0]?.RegistrationCode;
        } else {
          this.seekRegistrationList = null;
          // this.loading = false;
        }
      }, err => {
        // this.loading = false;
      })
  }



  /*
  @Type: File, <ts>
  @Name: getJobDetailsCount function
  @Who:  Suika
  @When: 14-06-2022
  @Why:  EWM-5334,EWM-7001
  @What: For getting the job list
   */


  getJobFilterCount(workflowId: string) {

    this.JobCountWorkFlowByIdObs=this.jobService.getJobsCountByWorkFlowIdV2('?workflowid=' + workflowId+this.filterQueryString).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.jobFilterCount = repsonsedata.Data;
          //<!-----@suika@EWM-10650 EWM-10818  @09-03-2023 to handle 204 code----->
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.jobFilterCount = 0;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /* @Name: FilterQueryString function @Who:  Renu @When: 24-01-2024 @Why:  EWM-15563 EWM-15804 @What:for formatting string for filter*/
  FilterQueryString(data: any[]){
      let temp:string='';
      data?.forEach(function (value) {
      let Field = value['ColumnName'];
      let condition = value['FilterOption'];
      let ParamValue = value['FilterValue'];
      temp += Field+ '$' + condition+ '$' + ParamValue  + '~' ;
    });
      let result:string[] | void[];
      result = temp.split("~");
      result.pop();
      this.filterQueryString = '&GFilter='+result.join("~");
      this.getJobFilterCount(this.workflowId);
    }

  JobFilter(Name) {
    if (this.mobileQuery.matches) {
      this.righttoggel.close();
      this.candidatetoggel.close();
    }

    /*--@Who:Nitin Bhati,@When: 23-03-2023,@Why:EWM.11450,@What: For pass varibale for quick filter--*/
    if (this.isActive === Name) {
      this.isActive = 'TotalJobs';
      this.QuickFilter ='TotalJobs';      
    } else {
      this.isActive = Name;
      this.QuickFilter = Name;
      sessionStorage.removeItem('QuickFilterForClone')
      sessionStorage.setItem('Activefilter',this.isActive);
    }
    // as discuss with mukesh sir and subhojit sir comment this code when:04/12/2024
    // this.router.queryParams.subscribe(params => {
    //   this.selectjobcatparam =(Name==='TotalJobs')?'TotalJobs':params['filter'];  //@Who:Renu,@When: 27-11-2024,@Why:EWM-18873,@What: L3 bug to resolve count for total jobs
    //   })
    this.getWorkFlowStages(this.workflowId);
    this.sendRequest(this.state);
    // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam, this.QuickFilter);
  }
  /*
   @Type: File, <ts>
   @Name: descriptionPopup function
   @Who:  maneesh
   @When: 15-06-2022
   @Why:  EWM.6960.EWM.7324
   @What: creat popup for description
    */
  descriptionPopup(data) {
    const dialogRef = this.dialog.open(JobDescriptionPopupEditorComponent, {
      data: new Object({ jobId: data.Id, jobData: data }),
      panelClass: ['xeople-modal-lg', 'add_jobDescription', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {

    })
  }
  /*
   @Type: File, <ts>
   @Name: OwnerPopup function
   @Who:  maneesh
   @When: 15-06-2022
   @Why:  EWM.6960.EWM.7324
   @What: popup for description
    */
  OwnerPopup(data) {
    const dialogRef = this.dialog.open(ShowOwnerlistPopupComponent, {
      data: new Object({ ownerList: data }),
      panelClass: ['xeople-modal', 'all-owner-list', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(res => {

    })
  }
  /*
 @Type: File, <ts>
 @Name: sortName function
 @Who:  maneesh
 @When: 15-06-2022
 @Why:  EWM.6960.EWM.7337
 @What: sortName function for display fisrtName and lastName.
  */
  sortName(fisrtName, lastName) {
    if (fisrtName) {
      const Name = fisrtName?.split(' ');
      let NameShort = '';
      if (Name[2] != undefined) {
        NameShort = Name[0] + ' ' + Name[2];
      } else {
        NameShort = fisrtName;
      }
      const ShortName = NameShort?.match(/\b(\w)/g)?.join('');
      return ShortName?.toUpperCase();
    }
  }

  qucikFilterClose() {
    this.drawerIconStatus = false;
    this.sideMenuContext = 'quickfilter-section';
    this.sidenav.close();
  }
  qucikFilterOpen() {
    this.sidenav.close();
   if(!this.sidenav.opened){
       this.sideMenuContext = 'quickfilter-section';
      this.sidenav.open();
    }
    this.drawerIconStatus = true;
  }

  candidateIconStatus: boolean = false;
  candidateToggel(stage) {
    this.sidenav.close();
      if(!this.sidenav.opened){
      this.sidenav.open();
      this.sideMenuContext = 'applicant-section';
    }

    this.workflowStageList=stage;
    this.candidatetoggel?.toggle();
    this.WorkflowStageId=stage?.InternalCode;
    this.candidateIconStatus = !this.candidateIconStatus;
    this._reloadService.reload();
  }

  openDrawerApplicantList(stage) {
    this.sidenav.close();
     if(!this.sidenav.opened){
      this.sideMenuContext = 'applicant-section';
      this.sidenav.open();
      this.workflowStageList=stage;
      this.WorkflowStageId=stage?.InternalCode;
      this.applicantStatus = true;

    }
  }
  closeDrawerApplicantList(){
    this.applicantStatus = false;
    this.sideMenuContext = 'applicant-section';
  }

  onOpenedChangeQuickFilter(event) {
    if (event) {
      this.quickFilterStatus = 1;
      this.isLeft = true;
    } else {
      this.quickFilterStatus = 0;
      this.isLeft = false;
    }
    this.setConfiguration(this.colArr);
  }


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
    else {
      // console.log(canData)
    }
  }

  /*
@Type: File, <ts>
@Name: confirmMailSync
@Who: Renu
@When: 06-Oct-2021
@Why: EWM-2833
@What: To confirm mail is sync or not
*/
  IsEmailConnected: any;

  confirmMailSync(candidateInfo: any, workflowId: any, JobId: any): void {
    //  console.log(JobId)
    this.UserIsEmailConnectedObs = this.mailService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          if (data.Data.IsEmailConnected == 1) {
            this.IsEmailConnected = 1;
            // <!---------@When: 09-12-2022 @who:Adarsh singh @why: EWM-9908 --------->
            localStorage.setItem("emailConnection", this.IsEmailConnected);
            // end
          } else {
            this.IsEmailConnected = 0;
            // <!---------@When: 09-12-2022 @who:Adarsh singh @why: EWM-9908 --------->
            localStorage.setItem("emailConnection", this.IsEmailConnected);
            // end
          }
          this.openMail(candidateInfo, this.IsEmailConnected, workflowId, JobId);

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }

  /*
   @Type: File, <ts>
   @Name: openMail
   @Who: Renu
   @When: 04-Oct-2021
   @Why:EWM-2867 EWM-3075
   @What: to open Mail
  */
  openMail(responseData, IsEmailConnected, workflowId, JobId) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      height: "100%",
      maxHeight: "100%",
      data: { 'candidateres': responseData, 'IsEmailConnected': IsEmailConnected, 'workflowId': workflowId, 'JobTitle': this.JobTitle, 'JobId': JobId },
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {

      }
    })
  }

  zoomCallEnable(phoneNo: any) {
    if (phoneNo) {
      this.createCallLog();
      window.open('zoomphonecall://' + phoneNo, '_blank');
    }
  }

  getOtherIntegrationZoomCheckstatus() {
    // this.loading = true;
   this.IntegrationZoomRegistrationObs=this.systemSettingService.getJobBoardsIntegrationCheckstatus([{'RegistrationCode':this.zoomPhoneCallRegistrationCode,'IsUser':1}]).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Data) {
            this.zoomCheckStatus = repsonsedata.Data.Connected;
            // this.loading = false;
          }
        } else {
          //  this.loading = false;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  createCallLog() {
    this.loading = true;
    let Obj = {};
    Obj['JobId'] = this.JobId;
    Obj['CandidateId'] = this.candidateId;
    this.jobService.createJobCallLog(Obj).pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
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

  /*
   @Type: File, <ts>
   @Name: hash child
   @Who: Nitin Bhati
   @When: 14-Nov-2022
   @Why:EWM-9044
   @What: for tree view
  */
  hasChild = (_: number, node: TreeNode) =>
    !!node.Stages && node.Stages.length > 0;
  /*
    @Type: File, <ts>
    @Name: openJobWorkflowSubStages
    @Who: Nitin Bhati
    @When: 14-Nov-2022
    @Why:EWM-9044
    @What: for showing tree view for workflow stage
    */
  openJobWorkflowSubStages(code) {
    this.loadingTree = true;
    this.treeMatDrawer = true;
    this.dataArr = [];
    let stageList = this.stagesList.filter(e => e.InternalCode == code);
    let IsJobid = '';
    IsJobid = '?workflowId=' + this.workflowId + '&stageId=' + code + '&countfilter=' + this.selectjobcatparam
    this.jobService.jobworkFlowChildById(IsJobid).pipe(takeUntil(this.destroy$)).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.view = true;
          this.dataArr = data.Data.Stages.filter(e => e.InternalCode == stageList[0].InternalCode);
          this.treeControl = new NestedTreeControl<TreeNode>(node => node.Stages);
          this.dataSource = new TreeDataSource(this.treeControl, this.dataArr);
          this.loadingTree = false;
        } else {
          this.loadingTree = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loadingTree = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
   @Type: File, <ts>
   @Name: cancelTreeview
   @Who: Nitin Bhati
   @When: 14-Nov-2022
   @Why:EWM-7488
   @What: for cancel tree view
   */
  cancelTreeview() {
    this.dataArr = [];
    this.treeMatDrawer = false;
  }


  onPublishedBroadean(data) {
    this._BroadbeanService.onBroadBeadSelect.next(data);
    this.route.navigate(['/client/core/job/broadbean'], {
      queryParams: { page: 'broadbean', jobId: data.Id, workId: this.workflowId }
    });
  }

  /*
 @Type: File, <ts>
 @Name: getIntegrationCheckstatus function
 @Who: Adarsh singh
 @When: 08 -Feb 20223
 @Why: EWM-10428
 @What: For checking broadbean connected or not
*/
  getOtherIntegrationCheckstatusForBroadbean() {
    this.loading = true;
    this.IntegrationBroadBeanRegistrationObs=this.systemSettingService.getIntegrationCheckstatus(this.Broadbeanregistrationcode).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.visibilityBraodBean = repsonsedata.Data.Connected;
          this.checkBothStatus = repsonsedata.Data.Connected;
          if (!this.visibilityBraodBean) {
            this.getOtherIntegrationCheckstatusForseek();
            this.getOtherIntegrationCheckstatusForIndeed();

          }
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
 @Type: File, <ts>
 @Name: getIntegrationCheckstatus function
 @Who: Adarsh singh
 @When: 08 -Feb 20223
 @Why: EWM-10428
 @What: For checking broadbean connected or not
*/
  getOtherIntegrationCheckstatusForseek() {
    this.loading = true;
    this.IntegrationCheckstatusObs=this.systemSettingService.getIntegrationCheckstatus(this.seekRegistrationCode).pipe(takeUntil(this.destroy$)).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.checkBothStatus = repsonsedata.Data.Connected;
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
      @Type: File, <ts>
      @Name: fitColumns
      @Who: Nitin Bhati
      @When: 21-04-2023
      @Why: EWM-12064
      @What: For auto fit column size
    */
  public fitColumns(): void {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns();
    });
  }


      /*
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 13-07-2023
  @Why: EWM-13134
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}
/*
 @Type: File, <ts>
 @Name: getFilteredConfig function
 @Who: Nitin Bhati
 @When: 14-August-2023
 @Why: EWM-13768
 @What: get filter config data
 */
 getFilteredConfig(){
  this.loading=true;
  this.jobService.getfilterConfig(this.GridId).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        let colArrSelected=[];
        if(repsonsedata.Data!==null)
        {
          this.gridColConfigStatus=repsonsedata.Data.IsDefault;
          this.colArr= repsonsedata.Data.GridConfig;
          this.filterConfig=repsonsedata.Data.FilterConfig;
          if(this.filterConfig && this.filterConfig!==null){
            this.FilterQueryString(this.filterConfig);
            this.filterCount=this.filterConfig?.length;
          }else{
            this.filterQueryString='';
            this.getJobFilterCount(this.workflowId);
            this.filterCount=0;
          }
          if(repsonsedata.Data.GridConfig?.length!=0)
          {
            colArrSelected=repsonsedata.Data.GridConfig?.filter(x=>x.Selected==true);
          }
        if(colArrSelected?.length!==0){
          colArrSelected?.sort(function(a, b) {
            return a.Order - b.Order;
        });
        //<!-----@suika@EWM-10650 EWM-10818  @09-03-2023 to set the order of columns--->
          this.columns=colArrSelected;
          this.columns?.sort((a, b) => {
            return a.Order < b.Order ? -1 : 1;
         });
          this.columnsWithAction =  this.columns;
          this.columnsWithAction.splice(0,0,{
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

        }else{
          this.columns=this.colArr;

          this.columnsWithAction =  this.columns;
          this.columnsWithAction.splice(0,0,{
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
      this.getApplicatList();
      }else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

/* @Name: createConfiguration function  @Who: Nitin Bhati, @When: 14-Aug-2023 @Why:EWM-13768 @What: FOR saving filter data */
createConfiguration() {
  const columns = this.grid.columns;
  if (columns) {
    const gridConfig = {
      //state: this.gridSettings.state,
      columnsConfig: columns.toArray().map(item => {
        return Object.keys(item)
          ?.filter(propName => !propName.toLowerCase()
            .includes('template'))
            .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
      }),
    };
    this.setConfiguration(gridConfig.columnsConfig);
}
}
// <!---------@When: 12-09-2023 @who:Adarsh singh @why: EWM-13814 @Desc - open close job modal --------->
onOpenCloseJobModal(dataItem){
  let JobStatus = [{Name:dataItem.StatusName,Id:dataItem.StatusId}];
  const dialogRef = this.dialog.open(CloseJobComponent, {
    panelClass: ['xeople-modal-md', 'candidate-jobapplicationform', 'animate__animated', 'animate__zoomIn'],
    data: new Object({ JobTitle:dataItem.JobTitle,jobId:dataItem.Id,WorkflowId:dataItem.WorkflowId,WorkflowName:dataItem.WorkflowName,JobStatusObj:JobStatus}),
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if(dialogResult?.data) {
    this.sendRequest(this.state);
    this.getJobFilterCount(this.workflowId); /*@When: 25-04-2024 @who:Renu @why: EWM-16847 EWM-16862 @Desc -for updating count */
    this.getWorkFlowStages();
      // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam, this.QuickFilter);
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
 @Name: getIntegrationCheckstatus function
 @Who: Nitin Bhati
 @When: 21-Nov-20223
 @Why: EWM-10428
 @What: For checking Indeed connected or not
*/
getOtherIntegrationCheckstatusForIndeed() {
  this.loading = true;
  this.IntegrationCheckstatusObs=this.systemSettingService.getIntegrationCheckstatus(this.indeedRegistrationCode).pipe(takeUntil(this.destroy$)).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.checkBothStatus = repsonsedata.Data.Connected;
      } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

  /* Adarsh singh 1Dec 2023 for EWM-15257*/
onReopenJob = (data:any) =>{
  if (data?.DaysToExpire >= 0) {
    const message = `label_reOpen_job_msg`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data:  {dialogData,WithoutQuestionMark:true},
      panelClass: ['custom-modalbox', 'animate__animated','lowContent', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.jobClosedHandler(data);
       
      }
    }
    );
  }
  else{
    const dialogRef = this.dialog.open(ReopenJobComponent, {
      data: new Object({data:data}),
      panelClass: ['xeople-modal-sm', 'ReOpenJob', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult=>{
      if (dialogResult?.data) {
    this.sendRequest(this.state);
    this.getJobFilterCount(this.workflowId);/*@When: 25-04-2024 @who:Renu @why: EWM-16847 EWM-16862 @Desc -for updating count */
    this.getWorkFlowStages();
        // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam, this.QuickFilter);
      }
    })

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }

}
  /* Adarsh singh 1Dec 2023 for EWM-15257*/
jobClosedHandler(data:any){
  let obj = {
    JobId: data?.Id,
    Days: data?.DaysToExpire
  }
  this.jobService.updateJobExpiryDays(obj).subscribe((res:ResponceData)=>{
     if (res.HttpStatusCode == 200 || res.HttpStatusCode == 400) {
    this.sendRequest(this.state);
    this.getJobFilterCount(this.workflowId);/*@When: 25-04-2024 @who:Renu @why: EWM-16847 EWM-16862 @Desc -for updating count */
    this.getWorkFlowStages();
      // this.getJobList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.workflowId, this.filterConfig, false, this.selectjobcatparam, this.QuickFilter);
     }
     else{
      this.snackBService.showErrorSnackBar(this.translateService.instant(res.Message), res.HttpStatusCode);
     }
  })
}
public pageChanges(event: PageChangeEvent): void {
  this.event=event;
  this.state['take']=event.take
  this.state['skip']=event.skip
  this.sendRequest(this.state);
}
public onDataStateChange(state: DataStateChangeEvent): void {
   this.state = state;
   this.loadingSearch = false;
   this.searchSubject$.next(this.loadingSearch);
  //this.sendRequest(state);
 }
 //by maneesh ,when:ewm-17228 from get total candidate count
 getApplicatList() {
  let requestdata : TotalCandidates ={
    "JobId":this.JobId,
    "WorkflowId": this.workflowId,
    "CountFilter": this.selectjobcatparam,
    "QuickFilter": this.QuickFilter,
    "CandidateFilterParams": this.filterConfig,
    "WorkflowStageId": "00000000-0000-0000-0000-000000000000",
  };
    this.unsubscribeTotalCount = this.jobService.totalCandidateForJobLandingPage(requestdata).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
     this.totalCandidate=data.Data?.TotalCandidatesCount;
      }else {
       this.totalCandidate=0;
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
}
