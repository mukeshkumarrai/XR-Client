import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ResponceData, SCREEN_SIZE, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { CompositeFilterDescriptor, SortDescriptor, State, filterBy, toDataSourceRequestString } from '@progress/kendo-data-query';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
import { customDropdownConfig } from '@app/modules/EWM.core/shared/datamodels';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { CandidateFolderService } from '@app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { FilterDialogComponent } from '@app/modules/EWM.core/job/landingpage/filter-dialog/filter-dialog.component';
import { ActionDialogComponent } from '@app/modules/EWM.core/job/landingpage/action-dialog/action-dialog.component';
import { ClientBulkSmsComponent } from '@app/modules/EWM.core/client/client-bulk-sms/client-bulk-sms.component';
import { ClientService } from '@app/modules/EWM.core/shared/services/client/client.service';
import { LeadsService } from '@app/modules/EWM.core/shared/services/leads/leads.service';
import { ConvertLeadClientComponent } from '../convert-lead-client/convert-lead-client.component';
import { LeadMailComponent } from '../lead-mail/lead-mail.component';
import { JobSmsComponent } from '../../xeople-job/job-detail/job-sms/job-sms.component';
import { AddLeadComponent } from '@app/shared/modal/add-lead/add-lead.component';
import { LeadDetails, leadsLikeEntity } from '../../../shared/models/lead.model';
import { LeadWorkflowStagesMappedPopupComponent } from '../lead-workflow-stages-mapped-popup/lead-workflow-stages-mapped-popup.component';
import { ViewLeadWorkflowStagesComponent } from '../lead-workflow/view-lead-workflow-stages/view-lead-workflow-stages.component';
import { NewEmailComponent } from '../../EWM.core/shared/quick-modal/new-email/new-email.component';
import { JobFilterDialogComponent } from '../../xeople-job/job-shared/job-filter-dialog/job-filter-dialog.component';
import { NavigationService } from '../../../shared/helper/navigation.service';
import { XeepService } from '../../../shared/services/xeep/xeep.service';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order:number
}

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-lead-listing',
  templateUrl: './lead-listing.component.html',
  styleUrls: ['../lead-details/lead-details.component.scss']
})
export class LeadListingComponent implements OnInit {

  
  /***********************global variables decalaration**************************/
  public ActiveMenu: any;
  //public loading: boolean;
  public pagesize;
  public pageSizeOptions;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public skip = 0;
  public GridId:any='LeadLanding_grid_001';
  public sortingValue: string;
  public searchValue: string = "";
  public gridListData: any[];
  public columns: ColumnSetting[] = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public workflowList: any=[];
  public filterCount: number=0;
  public colArr: any=[];
  public tempID: any;
  public stagesList: any=[];
  public totalJobsWorkFlow: number;
  public filterConfig: any= [];
  public sortDirection = 'desc';
  public userpreferences: Userpreferences;
  public screnSizePerStage:number;
  public totalStages: number;
  public currentMenuWidth: number;
  public screenPreviewClass: string="";
  public loadingscroll: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public viewMode:string='listMode';
  public result: string = '';
  public kendoLoading: boolean;
  scrolledValue: any;
  public loading: boolean;
  public dropDoneConfigCountry: customDropdownConfig[] = [];
  public dropDoneConfigParentClient: customDropdownConfig[] = [];
  public dropDoneConfigClientRM: customDropdownConfig[] = [];
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public industryList: any = [];
  selectedValue: any ;
  leadWorkflowId='00000000-0000-0000-0000-000000000000';
  countryId=0;
  leadStageId='00000000-0000-0000-0000-000000000000';
  TotalNoOfLead: number;
  public searchVal: string = '';
  public loadingSearch: boolean;
  pageNumberC: any=1;
  pageSizeC: any=500;
  public positionMatDrawer: string ;
  public countryCustomClass: string ;
  loaderStatus: number;
  public totalDataCount: number;
  public UserType: number=0;
  @ViewChild(GridComponent)
  public grid: GridComponent;
  pageOption: any;
  animationState = false;
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
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
  MobileMapMenuSelected: any;
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false;
  searchSubject$ = new Subject<any>();
  gridColConfigStatus:boolean=false;
  dateFormatKendo: string|null;
  countryList:any = [];
  oraganizationChangeSubscription: Subscription;
  LeadChangeSubscription: Subscription;
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [50, 100, 200];
  public pageNumber:number=1;
  public gridViewlistFilter: GridDataResult;
  public filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
    pageSize: number;
    FilterDataClearList: any=[];
    public gridData:any[]=[];
    public gridListDataFilter:[] = [];
    Totalcount: number;
    TotalRecordgrid: number;
  public state: State = { skip: 0, take: 50};
  public initialstate: State = {
     filter: { filters: [], logic: "and" },
  };
  //public state: State;
  public sort: SortDescriptor[] = [
    {
      field: 'isPin',
      dir: 'asc'
    }
  ];
public totalDataCountFolder: number;
public folderId:number=null;
public folderName: any;
public folderList = [];
public userType:string='client'
public dirctionalLang: string;
selectableSettings:SelectableSettings = {
  checkboxOnly: true
}
public selectedCandidate: any = [];
burstSMSRegistrationCode: string;
SMSCheckStatus: boolean = false;
emailConnectionStatus: string;
public multipleEmail:boolean = false;
mailConnectStatus: boolean;
public isOnInit: boolean=false;
  public  toEmailList:any=[];
  public getCandidateData:any = [];
  public isSMSStatus: boolean = false;
  public zoomPhoneCallRegistrationCode: string;
  public zoomCheckStatus: boolean = false;
  public smsBtnTooltip:string = 'label_SMS';
  public LeadWorkflowName:string;
  public stages: any[];
  @Output() lead_listing = new EventEmitter();
  public leadetails: LeadDetails = {};
  IsIntermediate: boolean;
  isSelectedCandOfFirstSatgesOnly: boolean = false;
  isSelectedCandOfOtherSatgesOnly: boolean = false;
  public allComplete: boolean = false;
  @Output() getSelectedDataOnEveryChange = new EventEmitter<any>();
  @Input() firstStageData: any;
  @Input() isAnyRejectedStageTypeListView: any;
  isLastStageCandidate: boolean = false;
  kFilters: string;
  @Input() forListModeStagesList: any;
  public gridViewlistClearData: GridDataResult;
  constructor(private route: Router,public dialog: MatDialog,private jobService:JobService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService,private router: ActivatedRoute,private cache: CacheServiceService,
    public _userpreferencesService: UserpreferencesService,private elementRef: ElementRef,public _sidebarService: SidebarService,private serviceListClass: ServiceListClass,private _clientService: ClientService,
    private commonserviceService: CommonserviceService, private ngZone: NgZone,private _commonserviceService: CommonserviceService,private xeepService:XeepService,
    public _CandidateFolderService: CandidateFolderService,private _LeadsService: LeadsService,private navigationService:NavigationService) {
    this.pageOption = this.appSettingsService?.pageOption;
    this.sizes = this.appSettingsService?.pageSizeOptions;
    this.state.take=this.appSettingsService?.pagesize;
      this.pageSizeOptions = this.appSettingsService?.pageSizeOptions;
      this.burstSMSRegistrationCode = this.appSettingsService?.burstSMSRegistrationCode;
      this.zoomPhoneCallRegistrationCode = this.appSettingsService?.zoomPhoneCallRegistrationCode;
     }
  ngOnInit(): void {
    this.isOnInit=true;
    this.sortingValue= this.sort[0]?.field + '-'+ this.sortDirection;
   this.dateFormatKendo = localStorage.getItem('DateFormat');
    let URL = this.route?.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL?.indexOf("?")) == '') {
      URL_AS_LIST = URL?.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL?.indexOf("?"))?.split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable?.next('1');
     this._sidebarService.activesubMenuObs?.next('list');
      this.userpreferences = this._userpreferencesService.getuserpreferences();
      this.emailConnectionStatus= localStorage.getItem('emailConnection');
      this.mailConnectStatus=this.emailConnectionStatus=='1'?false:true;
      this.router.queryParams.subscribe((value) => {                
          this.leadWorkflowId = value?.workflowId;
          this.LeadWorkflowName=value?.WorkflowName;
        });
      
    this.getFilterConfig();
     this.oraganizationChangeSubscription=   this._commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
        this.getFilterConfig();
      }
     })
     this.LeadChangeSubscription=this._commonserviceService?.onLeadSelectId?.subscribe(value => {
      if(value!==null)
      {
        this.leadWorkflowId = value?.leadWorkflowId;
        this.leadStageId=value?.leadStageId;
        this.refreshComponent();
      }
     })
    this.currentMenuWidth = window?.innerWidth;
    // window.dispatchEvent(new Event('resize'));
    this.onResize(window.innerWidth,'onload');
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.dirChange(res);
    });
    this.countryCustomClass="countryCustomClass";
  this.animationVar = ButtonTypes;
    this.router.queryParams.subscribe((params) => {
      this.viewMode = params['viewModeData'];
      if (this.viewMode ==undefined) {
        this.viewMode='listMode'
      }
    })
    // this.switchListMode(this.viewMode);
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.pagneNo= 1;
      this.pageSize=50;
      // this.pagneNo=this.skip/this.pageSize + 1;
      this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue,val,this.filterConfig);
       });
       this._sidebarService.searchEnable.next('1');
       let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
       this.UserType = currentUser?.UserType;
      let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));          
      let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
      this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;
      this.commonserviceService?.leadListModeData.subscribe(res => {
        if (res?.Mode=='LISTDATA') {
          this.selectedCandidate=[];
        this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue,this.filterConfig);
        }
      })
   }
  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId)?.classList?.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList?.remove(animationName)
  }
  
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

   ngOnDestroy(){
    const columns = this.grid?.columns;
    if (columns) {
      const gridConfig = {
        columnsConfig: columns?.toArray()?.map(item => {
          return Object.keys(item)
            .filter(propName => !propName?.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        })
      };
      this.setConfiguration(gridConfig?.columnsConfig);
    }
    this.oraganizationChangeSubscription?.unsubscribe();
    this.LeadChangeSubscription?.unsubscribe();
  }
 
  setConfiguration(columnsConfig,isLoad=true){
    let gridConf={};
    let tempArr:any[]=this.colArr;
    columnsConfig.forEach(x => {
    let  objIndex:any = tempArr?.findIndex((obj => obj?.Field == x?.field));
      if(objIndex>=0)
      {
        tempArr[objIndex].Format = x?.format,
        tempArr[objIndex].Locked = x?.locked,
        tempArr[objIndex].Order =x?.leafIndex+1,
        tempArr[objIndex].Selected = true,
        tempArr[objIndex].width = String(x?._width)
      }
    });
    gridConf['GridId']=this.GridId;
    gridConf['GridConfig']=tempArr;
    gridConf['CardConfig']=[];
    gridConf['filterConfig']=this.filterConfig;
   this.jobService.setfilterConfig(gridConf).subscribe(
     (repsonsedata:ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200 ) {
        if(isLoad) this.loading = false;
         // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
       }else {
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        if(isLoad) this.loading = false;
       }
     }, err => {
      if(isLoad) this.loading = false;
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

     })
  }
  
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }


  maxNumberClass(perSlide){
    if(this.totalStages>perSlide){
      this.screenPreviewClass = 'flext-start';
    }else{
      this.screenPreviewClass = '';
    }
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event,loadingType) {
    this.detectScreenSize();
    if(loadingType=='onload')
    {
      this.currentMenuWidth = event;
    }else{
      this.currentMenuWidth = event?.target?.innerWidth;
    }

    if (this.currentMenuWidth > 1750 && this.currentMenuWidth < 1800) {
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1650 && this.currentMenuWidth < 1750) {
      this.screnSizePerStage = 8;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1500 && this.currentMenuWidth < 1650) {
      this.screnSizePerStage = 6;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1400 && this.currentMenuWidth < 1500) {
      this.screnSizePerStage = 5;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 1300 && this.currentMenuWidth < 1400) {
      this.screnSizePerStage = 4;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 950 && this.currentMenuWidth < 1300) {
      this.screnSizePerStage = 3;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 800 && this.currentMenuWidth < 950) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 600 && this.currentMenuWidth < 800) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 440 && this.currentMenuWidth < 600) {
      this.screnSizePerStage = 2;
      this.maxNumberClass(this.screnSizePerStage);
    }else if (this.currentMenuWidth > 580 && this.currentMenuWidth < 600) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    }else if (this.currentMenuWidth > 280 && this.currentMenuWidth < 441) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } else {
      this.screnSizePerStage = 9;
      this.maxNumberClass(this.screnSizePerStage);
    }
  }

  private detectScreenSize() {
    const currentSize = this.sizess?.find(x => {
      // get the HTML element
      const el = this.elementRef?.nativeElement?.querySelector(`.${this.prefix}${x?.id}`);
      // check its display property value
    })

    this.mobileMenu();
  }
  mobileMenu() {
      if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 1024) {
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      }else {
         this.largeScreenTag = true;
         this.mobileScreenTag = false;
        }
  }

  onSwiper(swiper) {
   // console.log(swiper);
  }
  onSlideChange() {
  //  console.log('slide change');
  }

  getFilterConfig(){
    this.loading=true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch=false;
          let colArrSelected=[];
          if(repsonsedata.Data!==null)
          {
            this.isOnInit=false;
            this.filterConfig=repsonsedata?.Data?.FilterConfig;
            this.gridColConfigStatus=repsonsedata?.Data?.IsDefault;
            if( this.filterConfig!==null)
            {
              this.filterCount=this.filterConfig?.length;
            }else{
              this.filterCount=0;
            }
            if(repsonsedata.Data?.GridConfig?.length!=0)
            {
              colArrSelected=repsonsedata?.Data?.GridConfig?.filter(x=>x?.Selected==true);
            }
          if(colArrSelected?.length!==0){
            //this.columns=colArrSelected;
            colArrSelected?.sort(function (a, b) {
              return a?.Order - b?.Order;
            });
            this.columns = colArrSelected;
          }else{
            this.columns=this.colArr;
          }
          }
          this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
        }else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  openFilterModalDialog(){
    const dialogRef = this.dialog.open(JobFilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId}),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    // this.pagneNo = 1;
    dialogRef.afterClosed().subscribe(res => {
      if(res!=false){
        this.loading=true;
        this.filterCount=res?.data?.length;
        let filterParamArr=[];
        res.data?.forEach(element => {
          filterParamArr?.push({
              'FilterValue':element?.ParamValue,
              'ColumnName':element?.filterParam?.Field,
              'ColumnType':element?.filterParam?.Type,
              'FilterOption':element?.condition,
              'FilterCondition':'AND'
          })
        });
        this.loading = true;
        let jsonObjFilter={};
        this.pagneNo=1;
        this.state['take']=50
        this.skip=0;
        jsonObjFilter['GridId']=this.GridId;
        jsonObjFilter['search']=this.searchValue;
        jsonObjFilter['PageSize']=this.pagesize;
        jsonObjFilter['workflowId']=this.leadWorkflowId;
        jsonObjFilter['LeadFilterParams']=filterParamArr;
        jsonObjFilter['page']=this.pagneNo;
        jsonObjFilter['sort']=this.sortingValue;
        this.filterConfig=filterParamArr;
        this._LeadsService.fetchLeadlist(jsonObjFilter).subscribe(
          (repsonsedata:ResponceData) => {
            if (repsonsedata?.HttpStatusCode === 200) {
              this.gridListData = repsonsedata?.Data;
              this.data = {data:repsonsedata?.Data,total:repsonsedata?.TotalRecord};
              this.TotalNoOfLead = repsonsedata?.TotalRecord;
              this.loading = false;
              this.loadingscroll = false;
              this.loaderStatus=0;
              this.TotalNoOfLead = repsonsedata?.TotalRecord;
              this.loaderStatus=1;
              this.applyFilterConfig();
            }else if (repsonsedata?.HttpStatusCode === 204){
              this.data = null;
              this.gridListData=null;
              this.TotalNoOfLead = repsonsedata?.TotalRecord;
              this.loading = false;
              this.loadingSearch = false;
              this.loadingscroll = false;
            }else if (repsonsedata.HttpStatusCode === 400){
              this.data = null
              this.gridListData=null;
              this.TotalNoOfLead = repsonsedata?.TotalRecord;
              this.loading = false;
              this.loadingSearch = false;
              this.loadingscroll = false;

            }
             }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      }
      })
  }
  applyFilterConfig(){
    this.loading=true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch=false;
          let colArrSelected=[];
          if(repsonsedata.Data!==null)
          {
            this.cache.setLocalStorage(this.GridId,JSON.stringify(repsonsedata?.Data));
            this.colArr= repsonsedata?.Data?.GridConfig;
            this.filterConfig=repsonsedata?.Data?.FilterConfig;
            this.gridColConfigStatus=repsonsedata?.Data?.IsDefault;
            if( this.filterConfig!==null)
            {
              this.filterCount=this.filterConfig?.length;
            }else{
              this.filterCount=0;
            }
            if(repsonsedata?.Data?.GridConfig?.length!=0)
            {
              colArrSelected=repsonsedata?.Data?.GridConfig?.filter(x=>x?.Selected==true);
            }
          if(colArrSelected?.length!==0){
            //this.columns=colArrSelected;
            colArrSelected?.sort(function (a, b) {
              return a?.Order - b?.Order;
            });
            this.columns = colArrSelected;
          }else{
            this.columns=this.colArr;
          }
          }
          // this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
        }else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  
  openActionModalDialog(){
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns?.toArray()?.map(item => {
          return Object.keys(item)
            .filter(propName => !propName?.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        })
      };
      this.setConfiguration(gridConfig.columnsConfig);
    }
    let otherConfigObj={};
    otherConfigObj['filterConfig']=this.filterConfig;
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      maxWidth: "750px",
      data: new Object({gridConfig: otherConfigObj,GridId: this.GridId}),
      panelClass: ['quick-modalbox', 'add_actiondialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     // this.columns=res.data;
      if(res!=false)
      {
        this.colArr = res?.data;
        let selectedCol=[];
        selectedCol=res.data?.filter(x=>x['Selected']==true);
        if(selectedCol?.length!=0){
          selectedCol?.sort(function(a, b) {
            return a?.Order - b?.Order;
        });
          this.columns=selectedCol;
        }else{
          this.columns=this.colArr;
        }
        this.getFilterConfig();
      }


    })
  }


  getLeadList(pagesize, pagneNo, sortingValue, searchVal,JobFilter){
    this.animate();
  //this.loading = true;
  //let queryStr = `${toDataSourceRequestString(this.state)}`;
   if(this.loaderStatus===1){
      this.loading = false;
    }else{
      this.loading = true;
    }
  let jsonObj={};
  if(JobFilter!==null){
    jsonObj['LeadFilterParams']=this.filterConfig;
  }else{
    jsonObj['LeadFilterParams']=[];
  }
  jsonObj['FilterParams']=null;
  jsonObj['GridId']=this.GridId;
  jsonObj['WorkflowId']=this.leadWorkflowId;
  jsonObj['StageId']=this.leadStageId;
  jsonObj['search']=this.searchVal;
  jsonObj['PageSize'] = pagesize;
  //jsonObj['ByPassPaging']=true;
  jsonObj['page']=pagneNo;
  jsonObj['sort']=this.sortingValue;
  jsonObj['KFilter']=this.kFilters;
  this._LeadsService.fetchLeadlist(jsonObj).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata?.HttpStatusCode === 200) {
        this.loadingscroll = false;
        this.loading = false;
        this.loaderStatus=0;
      this.gridListData = repsonsedata?.Data;
      this.allComplete = false;
      this.IsIntermediate = false;
      this.gridListData?.forEach(v => { v.IsIntermediate = false; });
      this.data = {data:repsonsedata?.Data,total:repsonsedata?.TotalRecord};
      this.TotalNoOfLead = repsonsedata?.TotalRecord;
      this.loading = false;
      this.TotalNoOfLead = repsonsedata?.TotalRecord;
      this.TotalRecordgrid = repsonsedata?.TotalRecord;
      this.FilterDataClearList = repsonsedata;
     this.gridListDataFilter= repsonsedata?.Data;
      //this.kendoLoading=false;
      this.loadingSearch = false;
      if(this.gridColConfigStatus){
        this.fitColumns();
      }
    }else if (repsonsedata.HttpStatusCode === 204){
      this.data = null;
      this.gridListData=null;
      this.TotalNoOfLead = repsonsedata?.TotalRecord;
      this.loading = false;
      this.loadingSearch = false;
      this.loadingscroll = false;
    }else if (repsonsedata.HttpStatusCode === 400){
      this.data = null
      this.gridListData=null;
      this.TotalNoOfLead = repsonsedata?.TotalRecord;
      this.loading = false;
      this.loadingSearch = false;
      this.loadingscroll = false;
    }
    }, err => {
      //this.kendoLoading = false;
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
  }


  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element?.nodeName === 'TD') {
      var attrr = element?.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && !Number?.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
        if (element.classList?.contains('k-virtual-content') === true || element?.classList.contains('mat-form-field-infix') === true || element?.classList.contains('mat-date-range-input-container') === true || element?.classList.contains('gridTollbar') === true || element?.classList.contains('kendogridcolumnhandle') === true || element?.classList.contains('kendodraggable') === true || element?.classList.contains('k-grid-header') === true || element?.classList.contains('toggler') === true || element?.classList.contains('k-grid-header-wrap') === true || element?.classList.contains('k-column-resizer') === true || element?.classList.contains('mat-date-range-input-separator') === true || element?.classList.contains('mat-form-field-flex') === true || element?.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element?.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
          this.tooltipDir.hide();
        }
        else {
          if (element?.innerText == '') {
            this.tooltipDir?.hide();
          } else {
            this.tooltipDir?.toggle(element);
          }
        }
      }
      else {
        this.tooltipDir?.hide();
      }
    }
    else if (element?.nodeName === 'DIV' || element?.nodeName === 'SPAN') {
      if (element?.classList?.contains('k-virtual-content') === true || element?.classList?.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
        this.tooltipDir.hide();
      }
      else {
        this.tooltipDir?.toggle(element);
      }
    }
    else {
      this.tooltipDir?.hide();
    }
  }
  
   
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData?.length) {
    this.pagneNo = this.pagneNo + 1;
    this.fetchMoreRecord(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
    } else {
        this.loadingscroll = false;
      }
  }

  switchListMode(viewMode){
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.animate();
     }else{
      this.lead_listing?.emit('cardMode');
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.pagneNo=1;
       this.pagesize=50;
       //this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
       this.animate();
     }
   }

  clearFilterData(viewMode): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_leadLanding';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog?.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.filterConfig=null;
      let JobFilter=[];
      this.loading = true;
      let jsonObjFilter={};
      this.state['take']=50;
      this.skip=0;
      jsonObjFilter['LeadFilterParams']=JobFilter;
      jsonObjFilter['GridId']=this.GridId;
      jsonObjFilter['search']=this.searchValue;
      jsonObjFilter['PageSize']=this.pagesize;
      jsonObjFilter['workflowId']=this.leadWorkflowId;
      jsonObjFilter['StageId']=this.leadStageId;
      jsonObjFilter['page']=this.pagneNo;
      jsonObjFilter['sort']=this.sortingValue;
      this._LeadsService.fetchLeadlist(jsonObjFilter).subscribe(
        (repsonsedata:ResponceData) => {
          if (repsonsedata?.HttpStatusCode === 200) {
            this.gridListData = repsonsedata?.Data;
            this.data = {data:repsonsedata?.Data,total:repsonsedata?.TotalRecord};
            this.TotalNoOfLead = repsonsedata?.TotalRecord;
            this.loading = false;
            this.loadingscroll = false;
            this.loaderStatus=0;
            this.TotalNoOfLead = repsonsedata?.TotalRecord;
            //this.kendoLoading=false;
            this.loadingSearch = false;
            this.loaderStatus=1;
            // this.getFilterConfig();
            this.applyFilterConfig();
          }else if (repsonsedata.HttpStatusCode === 204){
            this.data = null;
            this.gridListData=null;
            this.TotalNoOfLead = repsonsedata?.TotalRecord;
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;
            this.applyFilterConfig();
          }else if (repsonsedata.HttpStatusCode === 400){
            this.data = null
            this.gridListData=null;
            this.TotalNoOfLead = repsonsedata?.TotalRecord;
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;

          }
         }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })


      }
    });
  }

 divScroll(e) {
    //console.log(e.srcElement, "e.srcElement.scrollTop")
    if (e.srcElement.scrollTop >= 20) {
      this.scrolledValue = e.isTrusted;
    } else {
      this.scrolledValue = false;
    }
  }

  createLead() {
    const dialogRef = this.dialog?.open(AddLeadComponent, {
      data: new Object({ PageUrl:this.route?.url}),
      panelClass: ['xeople-modal-md', 'add-lead', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getFilterConfig();
        //this.dialogRef.close();
      }
      let dir: string;
      dir = document?.getElementsByClassName('cdk-global-overlay-wrapper')[0]?.attributes['dir']?.value;
      let classList = document?.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList?.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    })
  }

     public onFilter(inputValue: string): void {
     // this.loading = false;
     this.searchVal=inputValue;
      if (inputValue?.length > 0 && inputValue?.length <= 2) {
        this.loadingSearch = false;
        return;
      }
       this.loaderStatus=1;
       this.pagneNo = 1;
       this.searchSubject$.next(inputValue);

    }

  public onSearchFilterClear(): void {
    this.loadingSearch = false;
    this.searchVal = '';
    // this.pagneNo=this.skip/this.pageSize + 1;
    this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal,this.filterConfig);
  }

  sortName(fisrtName) {
    if (fisrtName) {
      const Name = fisrtName;
      let charCount=Name?.split(" ")?.length - 1;
      if(charCount>0){
        const ShortName1 = Name?.split(/\s/).reduce((response, word) => response += word?.slice(0, 1), '');
        let first = ShortName1?.slice(0, 1);
        let last = ShortName1?.slice(-1);
        let ShortName = first?.concat(last?.toString());
        return ShortName?.toUpperCase();
      }else{
        const ShortName1 = Name?.split(/\s/).reduce((response, word) => response += word?.slice(0, 1), '');
        let first = ShortName1?.slice(0, 1);
        let ShortName = first;
        return ShortName?.toUpperCase();
      }

    }

  }

 fetchMoreRecord(pagesize, pagneNo, sortingValue, searchVal,JobFilter) {
  let jsonObj={};
  if(JobFilter!==null){
    jsonObj['LeadFilterParams']=this.filterConfig;
  }else{
    jsonObj['LeadFilterParams']=[];
  }
  jsonObj['GridId']=this.GridId;
  jsonObj['search']=this.searchVal;
  jsonObj['PageSize']=pagesize;
  jsonObj['workflowId']=this.leadWorkflowId;
  jsonObj['StageId']=this.leadStageId;
  jsonObj['page']=pagneNo;
  jsonObj['sort']=this.sortingValue;
  jsonObj['FolderId']=this.folderId;
  this._LeadsService.fetchLeadlist(jsonObj).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata?.HttpStatusCode === 200 || repsonsedata?.HttpStatusCode === 204) {
        this.loadingscroll = false;
        if (repsonsedata?.Data) {
          let nextgridView: any = [];
          nextgridView = repsonsedata?.Data;
          if(this.gridColConfigStatus){
            this.fitColumns();
          }
          this.gridListData = this.gridListData?.concat(nextgridView);
        }
      } else {
      //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loadingscroll = false;
      }
    }, err => {
      this.loading = false;
      this.loadingscroll = false;
    //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

onScrollDown(ev?) {
  this.loadingscroll = true;
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.TotalNoOfLead > this.gridListData?.length) {
      this.pageNumber = this.pageNumber + 1;
      this.fetchMoreRecord(this.pagesize, this.pageNumber, this.sortingValue, this.searchValue,this.filterConfig);
    }
    else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }

}
downloadCSV()
{
  this.loading=true;
  let jsonObj={};
  jsonObj['LeadFilterParams']=this.filterConfig==null?[]:this.filterConfig;
  jsonObj['GridId']=this.GridId;
  jsonObj['search']=this.searchVal;
  jsonObj['PageSize']=this.state.take;
  jsonObj['workflowId']=this.leadWorkflowId;
  jsonObj['StageId']=this.leadStageId;
  this.pagneNo=this.state?.skip/this.state?.take + 1;
   jsonObj['page']=this.pagneNo;
   jsonObj['sort']=this.sortingValue;
      this._clientService.downloadData(jsonObj).subscribe(
        (data:any)=>{
       const Url= URL.createObjectURL(data)
       const prefix=this.appSettingsService.getClientFilePrefix==undefined?"":this.appSettingsService.getClientFilePrefix+'-';
       const subdomain=localStorage.getItem("tenantDomain");
       let org='';
       this.commonserviceService.onOrgSelect.subscribe(value=>{
         if(value!=null)
         {
           org=value;
         }
       });
        let fileName=prefix+subdomain+'-'+org+'-'+'clients.csv';
        this.loading=false;
        this.downloadFile(data,fileName);
        }, err => {
          this.loading = false;
        }
      );
    }
    private downloadFile(data,filename) {
      const downloadedFile = new Blob([data], { type: data.type });
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.download = filename;
      a.href = URL.createObjectURL(downloadedFile);
      a.target = '_blank';
      a.click();
      document?.body?.removeChild(a);
  }
  refreshComponent(){
    this.selectedCandidate = []
    this.allComplete = false;
    this.pagneNo= 1;
    // this.pagneNo=this.skip/this.pageSize + 1;
    this.state['take']=50
    this.skip=0;
    this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
  }


public fitColumns(): void {
  this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
    this.grid.autoFitColumns();
  });
}


openNewEmailModal(responseData: any, mailRespondType: string, email: string) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(LeadMailComponent, {
    maxWidth: "750px",
    width: "95%",
    height: "100%",
    maxHeight: "100%",
    data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'),'candidateMail': email,
      'workflowId': this.leadWorkflowId, 'JobId': this.leadWorkflowId ,openDocumentPopUpFor:'Candidate',isBulkEmail:false,
    RelatedToInternalCode:'CLIE' ,
    listView:'listView'},
    panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult) {
      this.pagneNo = 1;
      this.sortingValue = '';
      this.searchValue = '';
      this.selectedCandidate=[];
      // this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
    }
  })

}

copyCandidateEmailId(EmailId:any, i:any){
  // for display and auto hide after some time
  let el = document?.getElementById('autoHide' + i);
  el.style.display = 'block';
  setTimeout(() => {
    let el = document?.getElementById('autoHide' + i);
    el.style.display = 'none';
  }, 2000);
  // End
  let selBox = document?.createElement('textarea');
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

public pageChanges({ skip, take }: PageChangeEvent): void {
  this.skip = skip;
  this.state['take'] = take;
  this.pagesize=this.state.take;
  if (skip==0) {
    this.pagneNo=1;
  }else{
    this.pagneNo=this.skip/this.pagesize + 1;
  }
  this.selectedCandidate=[];
  this.getLeadList(take, this.pagneNo, this.sortingValue,this.searchVal,this.filterConfig);
}
 
   public filterChange(filter: CompositeFilterDescriptor): void {
     this.filter = filter;
     if(this.filter?.filters?.length==0){
     this.gridViewlistClearData = {
       data: this.FilterDataClearList?.Data,
       total: this.FilterDataClearList?.TotalRecord
     };
     this.data=this.gridViewlistClearData;
     this.TotalNoOfLead = this.FilterDataClearList?.TotalRecord;
     }else{
       this.loadData();
     }
   }
   public onDataStateChange(state: DataStateChangeEvent): void {
    this.selectedCandidate=[];
    this.state = state;
    let filterObject=state?.filter;
   filterObject.filters = filterObject?.filters?.map(filter => {
  if('field' in filter){
    if (filter?.field === 'WorkflowDateIn') {
      let localDate = new Date(filter?.value);
      let utcDate = localDate?.toISOString();
      return { ...filter, value: utcDate }; // Update value for date
    }else  if(filter?.field === 'LastActivity') {
      let localDate = new Date(filter?.value);
      let utcDate = localDate?.toISOString();
      return { ...filter, value: utcDate }; // Update value for date
    }else  if(filter?.field === 'LeadGeneratedOn') {
      let localDate = new Date(filter?.value);
      let utcDate = localDate?.toISOString();
      return { ...filter, value: utcDate }; // Update value for date
    }
    return filter; // Keep other filters unchanged
  }
});
   let queryStr = `${toDataSourceRequestString(state)}`;
   let parsedQuery = this.parseQueryString(queryStr);
   }
   parseQueryString(queryString: string): any {
    let params = new URLSearchParams(queryString);
    let paramCount = 0;
    params?.forEach(() => {
      paramCount++;
  });
 if(paramCount === 4){
      params?.forEach((value, key) => {
        if (key === 'filter') {
          let cleanedFilter = this.removeDatetimeKeyword(value);
          this.kFilters=cleanedFilter;
          this.getLeadList(take, this.pagneNo, this.sortingValue,this.searchVal,this.filterConfig);
        }
      });
    }else{
      this.kFilters='';
      this.getLeadList(take, this.pagneNo, this.sortingValue,this.searchVal,this.filterConfig);
    }
   // return result;
  }
  removeDatetimeKeyword(filter: string): string {
    // Regular expression to remove the `datetime` keyword
    return filter?.replace(/datetime'/g, "'");
  }
   public gridViewlist: GridDataResult;
   public loadData(): void {
     this.gridData = filterBy(this.gridListDataFilter, this.filter);
     this.gridViewlist = {
       data: this.gridData,
       total: this.gridData?.length
     };
     this.data=this.gridViewlist;
     this.TotalNoOfLead = this.gridViewlist?.total;
   }

   public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
      if (this.sort[0]?.dir!=undefined || this.sort[0]?.dir!=null) {
      this.sortDirection= this.sort[0]?.dir;
  }else{
    this.sortDirection='asc';
  }
    this.sortingValue= this.sort[0]?.field + '-'+ this.sortDirection;
    this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
}

public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;

selectionChange(event:any){
  if(event?.length==1){
    this.selectedCandidate=event;
  }
  //console.log("selectedClientList:",this.selectedCandidate);
}

openJobBulkSMSForClient() {
  this.selectedCandidate?.forEach(element => {
    element["PhoneNumber"] = '+'+element?.PhoneCode+''+element?.PhoneNo,
    element["ContactId"] = element?.ClientId,
    element["ContactName"] = element?.ClientName,
    element["UserType"] = 'CLIE'
  });
 const dialogRef = this.dialog.open(ClientBulkSmsComponent,{
   data: new Object({selectedClient:this.selectedCandidate}),
   panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
   disableClose: true,
 });
 dialogRef.afterClosed().subscribe(res => {
   if (res != true) {
     this.loading = false;
     this.selectedCandidate=[];
   }else{
    this.loading = false;
    this.selectedCandidate=[];
   }
 })
let dir: string;
 dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
 let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
 for (let i = 0; i < classList.length; i++) {
   classList[i].setAttribute('dir', this.dirctionalLang);
 }
}
 onBulkEmail() {
  this.selectedCandidate?.forEach(element => {
    element["ContactId"] = element?.ClientId,
    element["ContactName"] = element?.ClientName,
    element["UserType"] = 'CLIE'
  });
 let subObj = {}
 const message = ``;
 const title = 'label_disabled';
 const subtitle = 'label_securitymfa';
 const dialogData = new ConfirmDialogModel(title, subtitle, message);
 const dialogRef = this.dialog.open(LeadMailComponent, {
   maxWidth: "750px",
   width: "95%",
   height: "100%",
   maxHeight: "100%",
   data: { selectedClient:this.selectedCandidate, 'IsEmailConnected': this.emailConnectionStatus,
    'isBulkEmail': true},
   panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
   disableClose: true,
 });
 dialogRef.afterClosed().subscribe(dialogResult => {
   this.multipleEmail = false;
   this.selectedCandidate=[];
 })
 // RTL Code
 let dir: string;
   dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
   let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
   for (let i = 0; i < classList.length; i++) {
     classList[i].setAttribute('dir', this.dirctionalLang);
   }
}
  conertIntoLead(LeadId) {
      const dialogRef = this.dialog.open(ConvertLeadClientComponent, {
        data: new Object({ LeadId: LeadId}),
        panelClass: ['xeople-modal-lg', 'leadEdit', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {        
        if (res==true) {
          this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig); 
        }else{

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

    getBulkSmsFlag(){
      if(!this.isSMSStatus && this.selectedCandidate==null ||this.selectedCandidate==undefined || this.selectedCandidate?.length==0){
        return true;
      }else{
        let checkStage = this.selectedCandidate != null && this.selectedCandidate?.filter(t => t?.PhoneNumber != "");
        if(!this.isSMSStatus || checkStage?.length>0){
          return false;
        }{
          return true;
        }
      }
    }
    checkZoomConnectedOrNot(){
      let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
      // Zoom
      let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res?.RegistrationCode === this.zoomPhoneCallRegistrationCode);
      this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;
      // SMS
      let smsIntegrationObj = otherIntegrations?.filter(res=>res?.RegistrationCode === this.burstSMSRegistrationCode);
      this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;
      this.zoomSMSTooltipMSG();
    }
    zoomSMSTooltipMSG(){ 
      if (!this.SMSCheckStatus) {
        this.smsBtnTooltip = 'label_connectsms';
      }
      else{
        this.smsBtnTooltip = 'label_SMS';
      }
    }
      openJobSMSForCandidate(dataItem) {
        let dataItemObj = {};
        dataItemObj['PhoneNumber'] = dataItem?.PhoneNumber;
        dataItemObj['Name'] = dataItem?.LeadName;
        dataItemObj['CandidateId'] = dataItem?.LeadId;
        dataItem=dataItemObj;
        const dialogRef = this.dialog.open(JobSmsComponent, {
          data: new Object({ jobdetailsData: dataItem, JobId:dataItem?.LeadId,JobName:dataItem.LeadName,UserType:this.userType }),
          panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res == true) {
            this.loading = false;
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



likeLead(can){
  let canArr: leadsLikeEntity[]=[];
  canArr.push({
  LeadId:can?.LeadId,
  LeadName:can?.LeadName,
  StageId:can?.StageId,
  StageName:can?.StageName,
  StageDisplaySeq:can?.StageDisplaySeq
})
  let payload = {
    Leads: canArr,
    WorkflowId: this.leadWorkflowId,
    WorkflowName: this.LeadWorkflowName
  }
  this.commonMarkAsReadSingle(can);
  this._LeadsService.likeLead(payload).subscribe((repsonsedata: ResponceData) => {
   if (repsonsedata.HttpStatusCode === 200) {
     let data = repsonsedata.Data;
     if (data?.length == 1) {
       let nextStageId = repsonsedata.Data[0]?.NextStageId;
       let parentStageId = repsonsedata.Data[0]?.ParentStageId;
       let nextStageName = repsonsedata.Data[0]?.NextStageName;
       let nextStageType = repsonsedata.Data[0]?.NextStageType;
       const nextStageIndex: any = this.gridListData.findIndex(obj => obj?.ParentId === parentStageId);
       const IsLastStage =this.stages.filter(x=>x?.InternalCode===nextStageId)[0]?.IsLastStage;
       if (nextStageIndex !== -1) {
        can.ParentId = nextStageId;
        can.ParentName = nextStageName;
        can.WorkFlowStageName = repsonsedata.Data[0]?.NextStageName;
        can.WorkFlowStageId = repsonsedata.Data[0]?.NextStageId;
        can.StageDisplaySeq = repsonsedata.Data[0]?.NextStageDisplaySeq;
        const obj = can
        this.gridListData.splice(nextStageIndex, 0, obj)
      }
      else {
        can.ParentId = nextStageId;
        can.ParentName = nextStageName;
        can.WorkFlowStageName = repsonsedata.Data[0]?.NextStageName;
        can.WorkFlowStageId = repsonsedata.Data[0]?.NextStageId;
        can.StageDisplaySeq = repsonsedata.Data[0]?.NextStageDisplaySeq;
      }
       this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig); 
       if(IsLastStage===1){
        this.xeepService.performAction('eats-cookie');
      }
     }
   } else if (repsonsedata.HttpStatusCode === 204) {
    this.loading = false;
    if (repsonsedata.Message == '400056') {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
     }
   } else if (repsonsedata.HttpStatusCode === 400) {
    this.loading = false;
   }
 }, err => {
   if (err.StatusCode == undefined) {
     return false;
   }
 })
 this.loading = false;
}

commonMarkAsReadSingle(cand) {
  let candArrs: any = [];
  let candDiv: any = document.querySelector(".candidateInfoPanel_" + cand?.LeadId);
  if (candDiv?.classList.contains("unread")) {
    candDiv?.classList.remove("unread");
    cand.IsProfileRead = 1;
    candArrs.push(cand?.LeadId)
  }
  if (candArrs?.length > 0) {
    this.commonserviceService.candidateProfileReadUnread(candArrs, cand?.LeadId);
  }
}


 dislikeLead(can){
  let canArr: leadsLikeEntity[]=[];
  canArr.push({
  LeadId:can?.LeadId,
  LeadName:can?.LeadName,
  StageId:can?.StageId,
  StageName:can?.StageName,
  StageDisplaySeq:can?.StageDisplaySeq
})
  let payload = {
    Leads: canArr,
    WorkflowId: this.leadWorkflowId,
    WorkflowName: this.LeadWorkflowName
  }
  this.commonMarkAsReadSingle(can);
this._LeadsService.disLikeLead(payload).subscribe(
 (repsonsedata: ResponceData) => {
   if (repsonsedata.HttpStatusCode === 200) {
    this.loading = false;
     let data = repsonsedata.Data;
     if (data?.length == 1) {
       let rejectedStageId = repsonsedata.Data[0]?.NextStageId;
       let nextStageName = repsonsedata.Data[0]?.NextStageName;
       let nextStageType=repsonsedata.Data[0]?.NextStageType;
       const nextStageIndex: any = this.stages.findIndex(obj => obj?.InternalCode === rejectedStageId);
       if (nextStageIndex !== -1) {
        can.ParentId = rejectedStageId;
        can.ParentName = nextStageName;
        can.WorkFlowStageName = repsonsedata.Data[0]?.NextStageName;
        can.WorkFlowStageId = repsonsedata.Data[0]?.NextStageId;
        can.StageDisplaySeq = repsonsedata.Data[0]?.NextStageDisplaySeq;
        const obj = can
        this.gridListData.splice(nextStageIndex, 0, obj)

      }
      else {
        can.ParentId = rejectedStageId;
        can.ParentName = nextStageName;
        can.WorkFlowStageName = repsonsedata.Data[0]?.NextStageName;
        can.WorkFlowStageId = repsonsedata.Data[0]?.NextStageId;
        can.StageDisplaySeq = repsonsedata.Data[0]?.NextStageDisplaySeq;
      }
       // End
       this.xeepService.performAction('binshot');
     }
   } else if (repsonsedata.HttpStatusCode === 204) {
    this.loading = false;
     if (repsonsedata.Message == '400054') {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
     }
   } else if (repsonsedata.HttpStatusCode === 400) {
     this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
     this.loading = false;
    }
 }, err => {
   if (err.StatusCode == undefined) {
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     return false;
   }
 })
 this.loading = false;
}
 viewWorkflowStages() {
    const dialogRef = this.dialog.open(ViewLeadWorkflowStagesComponent, {
      data: new Object({ workflowId: this.leadWorkflowId, isParentStages: true }),
      panelClass: ['xeople-modal-full-screen', 'workflow-sub-stages', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  markPinUnPinGridView(can) {
    this.markAsReadGridView(can);
    let isPin;
    if (can?.IsPin == 1) {
      can.IsPin = 0;
      isPin = 0;
    } else {
      can.IsPin = 1;
      isPin = 1;
    }
    this.pinunpinCandidate(can, isPin)
    this.gridListData.sort((a, b) => {
      if (b?.IsPin !== a?.IsPin) {
        return b?.IsPin - a?.IsPin;
      }
      if (b?.Proximity !== a?.Proximity) {
        return a?.Proximity - b?.Proximity;
      }
      return a?.LeadName.localeCompare(b?.LeadName);
    })
    // this.setAllDataInStorage(this.data);
  }

  pinunpinCandidate(can, isPin) {    
    this.leadetails.LeadId = can?.LeadId ? [can?.LeadId] : [""];
    this.leadetails['IsPin'] = isPin == 1 ? true : false;
    this.commonMarkAsReadSingle(can);
    this._LeadsService.pinUnpinLead(this.leadetails).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
      this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue,this.filterConfig);
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          return false;
        }
      })
  }

  markAsReadGridView(can) {
    let candArrs: any = [];
    let candDiv: any = document.querySelector(".btnViewCandiateName__" + can?.LeadId);
    if (candDiv?.classList.contains("unread")) {
      candDiv?.classList.remove("unread");
      can.IsProfileRead = 1;
      candArrs.push(can?.LeadId)
    }
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileReadUnread(candArrs, this.leadWorkflowId);
    }
  }
setAll(completed: boolean) {
    if (completed && this.IsIntermediate == false) {
      this.allComplete = true;
      this.IsIntermediate = false;

      if (this.gridListData == null) return;
      this.gridListData.forEach((t, index) => {
        t.CheckboxStatus = true;
      });
    }
    else {
      this.allComplete = true;
      setTimeout(() => {
        this.allComplete = false;
        this.IsIntermediate = false;
      }, 10);
      this.gridListData.forEach((t: any) => {
        t.CheckboxStatus = false;
      });
    }
    // @suika @EWM-12925 @whn 29-06-2023  modification as per story @EWM-12888
    this.selectedCandidate = this.gridListData.filter(x => x.CheckboxStatus == true);
    // adarsh singh EWM-14729 13-OCT-23
    this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
    if (!this.isSelectedCandOfFirstSatgesOnly) {
      this.isSelectedCandOfOtherSatgesOnly = true;
    } else {
      this.isSelectedCandOfOtherSatgesOnly = false;
    }
    // End
    this.getSelectedDataOnEveryChange.emit(this.selectedCandidate);
    this.commonserviceService.leadList.next({selectedCandidate:this.selectedCandidate,Mode:'LIST',stagesList:this.forListModeStagesList});
  }

  // <!---------@When: 12-10-2023 @who:Adarsh singh @why: EWM-14741 @Desc-check selected candidate of only 1st stage -------->
  checkSelectedCandOfFirstStage() {
    let res: boolean;
    if (this.selectedCandidate?.length > 0) {
      res = this.selectedCandidate.every((e: any) => e?.ParentId === this.firstStageData?.InternalCode);
    }
    else {
      res = false;
    }
    return res
  }

  onHideField(isChecked, data) {
    if (isChecked.checked == true) {
      this.gridListData.forEach(element => {
        if (element?.LeadId == data?.LeadId) {
          element.CheckboxStatus = 1
          element.IsIntermediate = true;
        }
      });
    }
    else {
      this.gridListData.forEach(element => {
        if (element?.LeadId == data?.LeadId) {
          element.CheckboxStatus = 0
          element.IsIntermediate = false;
        }
      });
    }
    this.selectedCandidate = this.gridListData.filter(x => x?.CheckboxStatus == 1);
    this.isSelectedCandOfFirstSatgesOnly = this.checkSelectedCandOfFirstStage();
    if (!this.isSelectedCandOfFirstSatgesOnly) {
      this.isSelectedCandOfOtherSatgesOnly = true;
    } else {
      this.isSelectedCandOfOtherSatgesOnly = false;
    }
    //  End
    this.getSelectedDataOnEveryChange.emit(this.selectedCandidate)
    this.checkListParentStage(data);
    this.commonserviceService.leadList.next({selectedCandidate:this.selectedCandidate,Mode:'LIST',singleCheck:true,isAnyRejectedStageTypeListView:this.isAnyRejectedStageTypeListView,stagesList:this.forListModeStagesList});
    
  }
  checkListParentStage(stageData) {
    if (this.selectedCandidate?.length == 0) {
      this.IsIntermediate = false;
      this.allComplete = false;
      return;
    }
    let checkStage = stageData != null && this.gridListData.every(t => t.CheckboxStatus == 1 || t.CheckboxStatus == true);
    if (checkStage) {
      this.IsIntermediate = false;
      this.allComplete = true;
    } else {
      this.allComplete = false;
      this.IsIntermediate = true;
    }
  }

  openMoveBoxModal(dataItem: any) {
    this.commonMarkAsReadSingle(dataItem);
    const dialogRef = this.dialog.open(LeadWorkflowStagesMappedPopupComponent, {
      maxWidth: "550px",
      data: { data: dataItem, WorkflowId: this.leadWorkflowId, WorkflowName: this.LeadWorkflowName },
      width: "95%",
      maxHeight: "85%",
      panelClass: ['quick-modalbox', 'add_manageAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.getLeadList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
        this.IsIntermediate = false;
        
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
  selectedCandThreeDot(can: any) {
    let res = this.stagesList?.filter((e: any) => e?.IsLastStage === 1)[0];
    let isRejectedStage = this.stagesList?.rejectedStage;
    if (res?.InternalCode == can?.ParentId) {      
      this.isLastStageCandidate = true;
    }
    else {
      this.isLastStageCandidate = false;
    }

  }


  setPreviousUrl(leadId){
    const previousUrl = '/client/leads/lead/lead-details';
    const queryParams = {
      workflowId: this.leadWorkflowId,
      WorkflowName: this.LeadWorkflowName
    };
    this.navigationService.setPreviousUrl(previousUrl, queryParams);
    this.route.navigate(['/client/leads/lead/lead-detail-summary'], { queryParams: { clientId: leadId,type:'lead' } });
   
  }


}



