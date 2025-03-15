/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:  Suika
 @When: 29-Oct-2021
 @Why: EWM-3279/33516
  @What:  This page will be use for Client landing page Component ts file
*/
import { Component, ElementRef, HostListener, NgZone, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ButtonTypes, ResponceData, SCREEN_SIZE, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../shared/services/Job/job.service';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { FilterDialogComponent } from '../../job/landingpage/filter-dialog/filter-dialog.component';
import { ActionDialogComponent } from '../../job/landingpage/action-dialog/action-dialog.component';
import { customDropdownConfig } from '../../shared/datamodels/common.model';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { QuickCompanyComponent } from '../../shared/quick-modal/quick-company/quick-company.component';
import { ClientService } from '../../shared/services/client/client.service';
import { IntlService } from '@progress/kendo-angular-intl';
import { ProximitySearchComponent } from 'src/app/shared/popups/proximity-search/proximity-search.component';
import { ChartComponent } from "ng-apexcharts";
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexTooltip,
  ApexFill,
  ApexStates,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';
import { AgmInfoWindow, AgmMap, AgmMarker } from '@agm/core';
import { rollInAnimation, rotateAnimation, rubberBandAnimation } from 'angular-animations';
import { ClientConfigDashboardPopComponent } from '../client-config-dashboard-pop/client-config-dashboard-pop.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { debounceTime, delay } from 'rxjs/operators';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
 import { take } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { CompositeFilterDescriptor, SortDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { ClientlandingFolderComponent } from '../clientlanding-folder/clientlanding-folder.component';
import { ClientBulkSmsComponent } from '../client-bulk-sms/client-bulk-sms.component';
import { ClientBulkEmailComponent } from '../client-bulk-email/client-bulk-email.component';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
export type ChartOptions = {
  series1: ApexAxisChartSeries;
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
  states: ApexStates;
  title: ApexTitleSubtitle;
};
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

SwiperCore.use([Pagination, Navigation]);
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  ClientId: string;
  ClientName: string;
  CountryCode: string;
  CountryName: string;
  CountryId: number;
  Address: string;
  draggable: boolean;
 // icon: string;
  LocationId: string;
}


@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  animations: [
    rubberBandAnimation(),
    rotateAnimation({ anchor: 'rotate90', degrees: 720 }),
  ]
})
export class ClientDashboardComponent implements OnInit {
  /***********************global variables decalaration**************************/
  public ActiveMenu: any;
  public loading: boolean;
  public pagesize: any;
  public pageSizeOptions;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;

  public barheight = 220;
  public pieheight = 220;
  public GridId: any = 'Clientdashboard_grid_001';
  public sortingValue: string;
  public sortingValueByCreatedDate: string = "Created,desc";
  public searchValue: string = "";
  public gridListData: any[];
  public columns: ColumnSetting[] = [];
  chartHeight = 500;
  valueAxis: any = "yAxis";
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
  public sortDirection = 'asc';
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
  public oldRowIndex = -1;
  oldchangeObject: any;
  changeObject: any;
  markers: marker[] = [];
  public dropDoneConfigCountry: customDropdownConfig[] = [];
  public dropDoneConfigParentClient: customDropdownConfig[] = [];
  public dropDoneConfigClientRM: customDropdownConfig[] = [];
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public selectedParentClient: any = {};
  public selectedClientRM: any = {};
  public selectedValue: any;
  public industryList: any = [];
  industryId = '00000000-0000-0000-0000-000000000000';
  countryId = 0;
  parentClinetId = '00000000-0000-0000-0000-000000000000';
  clientRMId = 0;
  TotalNoOfClient: number;
  TotalRecord: number;
  public loadingSearch: boolean;
  public dasboardMapData: any;
  public dasboardMapAllData: any;
  public dasboardMapPopUpData: any;
  public mapData = [];
  public dasboardBarChartData: any;
  public dasboardPieChartData: any;
  public active = false;
  public isNew = false;
  public mySelection: string[] = [];
  public pieData: any[];
  public pieDataLegends = [];
  public pieDataColors = [];
  public barCategory = [];
  public barChartData = [];
  public maploading: boolean = false;
  public barloading: boolean = false;
  public pieloading: boolean = false;
  public mapCountryLoad: boolean = false;
  public piechartType: any = 'pie';
  public barchartType: any = 'bar';
  bardata = [23, 23, 45];
  @ViewChild('countryId') input;
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions1: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public cOptions: Partial<ChartOptions>;
  public cOptions1: Partial<ChartOptions>;
  @ViewChild('AgmMap') agmMap: AgmMap;
  minClusterSize = 2;
  // initial center position for the map
  lat: number = 26.8309535;
  lng: number = 80.9244566;
  infoWindowOpened = null
  previous_info_window = null
  clientGridSub: any;
  StateclientGridSub: any;
  clientcountSub: any;
  statusClientGridSub: any;
  parentClientGridSub: any;
  TotalRecordgrid: number;
  bounds: LatLngBounds;
  background60: any;
  animationVar: any;
  orderList: any;
  orderlistLeft = [];
  orderlistRight = [];
  ConfigData: any = [];
  public modalInnerHeight: any;
  public ClientId = '00000000-0000-0000-0000-000000000000';
  public LocationId = '00000000-0000-0000-0000-000000000000';
  public StatusId = '00000000-0000-0000-0000-000000000000';
  marker: any;
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
  advanceSearchOn: boolean;
  public quickFilterStatus: number = 0;
  @ViewChild(GridComponent) public grid: GridComponent;
  public filterAlert: any = 0;
  public dynamicFilterArea: boolean = false;
  public columnsWithAction: any[] = [];
  gridColConfigStatus:boolean=false;
  ClientGraphLimit: number;
  countryList:any = [];
  oraganizationChangeSubscription:Subscription;
  dirctionalLang;
  locationMarker = [];
  searchSubject$ = new Subject<any>();
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [];
  public gridViewlistFilter: GridDataResult;
  public filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };

  FilterDataClearList: any=[];
  public gridData:any[]=[];
  public gridListDataFilter:[] = [];
  Totalcount: number;
  public state: State = { skip: 0, take: 200};
  sum: any;
  public sort: SortDescriptor[] = [
    {
      field: 'ClientName',
      dir: 'asc'
    }
  ];
  public skip = 0;
  //folderList variabel
  public totalDataCountFolder: number;
  public folderId:number=0;
  public folderName: any;
  public folderList = [];
  public userType:string='client'
  pageOption: any;
    //folderList variabel END
    selectableSettings:SelectableSettings = {
      checkboxOnly: true
    }
    public selectedCandidate: any = [];
    burstSMSRegistrationCode: string;
SMSCheckStatus: boolean = false;
emailConnectionStatus: string;
public multipleEmail:boolean = false;
  mailConnectStatus: boolean;

   //Who:Ankit Rawat, What:EWM-16114 EWM-16298 Add Proximity Search, When:04March2024
 public IsProximitySearch: boolean=false;
 public ProximitySearchResult = {
   Latitude: 0,
   Longitude: 0,
   Distance:0,
   Unit:'KM',
   Address:'',
   //@When: 11-03-2024 @who:Amit @why: EWM-16399 @what: label changes
   Source:this.translateService.instant('label_ProxmitySearch_SearchClients') +' "Location" '+this.translateService.instant('label_ProxmitySearch_WithinTheSpecifiedRange')
 }
  //Who:Ankit Rawat, What:EWM-16158 Proximity sorting on page init, When:07March24
 public isOnInit: boolean=false;
  constructor(private route: Router, public dialog: MatDialog, private jobService: JobService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService,
     private router: ActivatedRoute, private intl: IntlService,
     private conmmonService: CommonserviceService,
      public _userpreferencesService: UserpreferencesService, public _sidebarService: SidebarService, private elementRef: ElementRef,
    private serviceListClass: ServiceListClass, private _clientService: ClientService,private _commonserviceService: CommonserviceService,private cache: CacheServiceService,
    private ngZone: NgZone) {

    this.sizes = this.appSettingsService.pageSizeOptions;
    this.state.take= this.appSettingsService.pagesize;
    this.pagesize = this.appSettingsService.pagesize;
    this.pageOption = 3;
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDoneConfig['placeholder'] = 'label_industry' ;
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/industry-master';
    this.dropDoneConfig['bindLabel'] = 'Description';
    this.dropDoneConfig['IsRequired'] = false;
    this.dropDoneConfig['isselectAll'] = true;
    this.dropDoneConfig['clearable'] = true;

    this.dropDoneConfigCountry['placeholder'] = 'label_country';
    this.dropDoneConfigCountry['isselectAll'] = true;
    this.dropDoneConfigCountry['clearable'] = true;

    this.dropDoneConfigParentClient['IsDisabled'] = false;
    this.dropDoneConfigParentClient['apiEndPoint'] = this.serviceListClass.getParentCompanyAll +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDoneConfigParentClient['placeholder'] = 'label_parentClient';
    this.dropDoneConfigParentClient['searchEnable'] = true;
    this.dropDoneConfigParentClient['IsManage'] = '';
    this.dropDoneConfigParentClient['bindLabel'] = 'ClientName';
    this.dropDoneConfigParentClient['IsRequired'] = false;
    this.dropDoneConfigParentClient['isselectAll'] = true;
    this.dropDoneConfigParentClient['clearable'] = true;

    this.dropDoneConfigClientRM['IsDisabled'] = false;
    this.dropDoneConfigClientRM['apiEndPoint'] = this.serviceListClass.userInviteList;
    this.dropDoneConfigClientRM['placeholder'] = 'label_clientRM';
    this.dropDoneConfigClientRM['searchEnable'] = true;
    this.dropDoneConfigClientRM['IsManage'] = '';
    this.dropDoneConfigClientRM['bindLabel'] = 'UserName';
    this.dropDoneConfigClientRM['IsRequired'] = false;
    this.dropDoneConfigClientRM['isselectAll'] = true;
    this.dropDoneConfigClientRM['clearable'] = true;
    this.ClientGraphLimit = this.appSettingsService.ClientGraphLimit;/*--EWM-12603,@when:24-05-2023,@why:call from appsetting--*/
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
  }

  ngOnInit(): void {
    this.isOnInit=true;
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable.next('1');

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.emailConnectionStatus= localStorage.getItem('emailConnection');
    this.mailConnectStatus=this.emailConnectionStatus=='1'?false:true;
    this.getFilterConfig(false);

    let queryParams = this.router.snapshot.params.Id;
    this.workflowId = decodeURIComponent(queryParams);
    this.currentMenuWidth = window.innerWidth;
    this.onResize(window.innerWidth, 'onload');
    this.animationVar = ButtonTypes;
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background60 = this.hexToRGB(primaryColor, 0.60);
    this.modalInnerHeight = window.innerHeight;
    this._sidebarService.searchEnable.next('1');

     /*--@When:09-08-2023 @who:Nitin Bhati,@why:EWM-13490,@what:showing data after change organization Names--*/
     this.oraganizationChangeSubscription=  this._commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
        this.getFilterConfig(false);
      }
     })

    // @suika @EWM-14427 @Whn 27-09-2023
     this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.reload();
       });
  let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
  let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
  this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;
  }
  /*
  @Type: File, <ts>
  @Name: add remove animation function
  @Who: Satya Prakash Gupta
  @When: 13-Jan-2022
  @Why: EWM-4498 EWM-4110
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

  public drawbarchart(type: any) {
    if (type == 'modal') {
      this.chartOptions2 = {
        series1: [
          {
            name: "",
            data: this.barChartData//[400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
          }
        ],
        chart: {
          type: this.barchartType,//"bar",
          width: "100%",
          height: this.barheight,
          toolbar: { show: false },
          zoom: {
            enabled: true
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              let bdata = this.dasboardBarChartData[config.dataPointIndex];
              this.parentClinetId = bdata.ParentClientId;
              this.reload();
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: this.barCategory
        }
      };
    } else {
      this.chartOptions1 = {
        series1: [
          {
            name: "",
            data: this.barChartData//[400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
          }
        ],
        chart: {
          type: this.barchartType,//"bar",
          width: "100%",
          height: this.barheight,
          toolbar: { show: false },
          zoom: {
            enabled: true
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              let bdata = this.dasboardBarChartData[config.dataPointIndex];
              this.parentClinetId = bdata.ParentClientId;
              this.reload();
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: this.barCategory
        }
      };
    }
  }

  changeBarChart(name) {
    this.barchartType = name;
    this.drawbarchart('');
  }

  openDialog(templateRef: TemplateRef<any>, temp: any) {
    if (temp == 'bar') {
      this.barheight = this.modalInnerHeight - 150;
      this.drawbarchart('modal');
    } else if (temp == 'pie') {
      this.pieheight = this.modalInnerHeight - 145;
      this.drawPiechart('modal');

    }
    this.dialog.open(templateRef, {
      // maxWidth: "100vw",
      disableClose: true,
      autoFocus: false,
      panelClass: ['xeople-modal-full-screen', 'client-dashnoard-expand-modal', 'animate__animated', 'animate__zoomIn'],
    })
  }
  onDismiss(templateRef: TemplateRef<any>, temp: any) {
    if (temp == 'bar') {
      this.barheight = 220;
    } else if (temp == 'pie') {
      this.pieheight = 220;
    }
    document.getElementsByClassName("client-dashnoard-expand-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("client-dashnoard-expand-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialog.closeAll() }, 200);
  }
  changePieChart(name) {
    this.piechartType = name;
    this.drawPiechart('');
  }

  public drawPiechart(type: any) {
    if (type == 'modal') {
      this.cOptions1 = {
        series: this.pieData,
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              let pChartData =  this.dasboardPieChartData[config.dataPointIndex];
              this.StatusId = pChartData.StatusId;
              this.getClientListAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
            },

          },
          height: this.pieheight,
          type: this.piechartType,// 'pie',
        },
        labels: this.pieDataLegends,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
              zoom: {
                enabled: true
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
    } else {
      this.cOptions = {
        series: this.pieData,
        chart: {
          events: {
            dataPointSelection: (event, chartContext, config) => {
              let pChartData =  this.dasboardPieChartData[config.dataPointIndex];
              this.StatusId = pChartData.StatusId;
              this.getClientListAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
            },

          },
          height: this.pieheight,
          type: this.piechartType,// 'pie',
        },
        labels: this.pieDataLegends,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
              zoom: {
                enabled: true
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
    }
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
    this.modalInnerHeight = window.innerHeight;
    this.detectScreenSize();
    if (loadingType == 'onload') {
      this.currentMenuWidth = event;
    } else {
      this.currentMenuWidth = event.target.innerWidth;
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
    } else if (this.currentMenuWidth > 580 && this.currentMenuWidth < 600) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } else if (this.currentMenuWidth > 280 && this.currentMenuWidth < 441) {
      this.screnSizePerStage = 1;
      this.maxNumberClass(this.screnSizePerStage);
    } else {
      this.screnSizePerStage = 9;
      this.maxNumberClass(this.screnSizePerStage);
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
      }else {
         this.largeScreenTag = true;
         this.mobileScreenTag = false;
        }
  }
  /*
    @Type: File, <ts>
    @Name: getFilterConfig function
    @Who:  Suika
    @When: 29-Oct-2021
    @Why: EWM-3279/33516
    @What: For getting the deafult config for the user
   */
  onSwiper(swiper) {
    // console.log(swiper);
  }
  onSlideChange() {
    //  console.log('slide change');
  }
  getFilterConfig(loaderValue: boolean) {
    this.loading = loaderValue;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            //Who:Ankit Rawat, What:EWM-16114-EWM-16298 retain Proximity, When:04March24
            this.ProximitySearchResult.Latitude=repsonsedata.Data?.Latitude ?? 0;
            this.ProximitySearchResult.Longitude=repsonsedata.Data?.Longitude ?? 0;
            this.ProximitySearchResult.Address=repsonsedata.Data?.Address;
            this.ProximitySearchResult.Distance=repsonsedata.Data?.Distance ?? 0;
            if(this.ProximitySearchResult.Latitude!=0 && this.ProximitySearchResult.Longitude!=0 && this.ProximitySearchResult.Address){
              this.IsProximitySearch=true;
            }
            if(this.isOnInit){
              if(this.IsProximitySearch) this.sortingValue='Proximity-asc';
            }
            this.isOnInit=false;
            this.colArr = repsonsedata.Data.GridConfig;
            //Who:Ankit Rawat, What:EWM-16114 EWM-16298 show/hide proximity column, When:04March24
            this.setProximityConfiguration();
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            this.filterAlert = repsonsedata.Data.FilterAlert;
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig.length;
            } else {
              this.filterCount = 0;
            }
            if (this.filterAlert == 1) {
              this.dynamicFilterArea = false;
            } else {
              this.dynamicFilterArea = true;
            }
            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
            }
            if (colArrSelected?.length !== 0) {
              this.columns = colArrSelected;
              this.columnsWithAction = this.columns;

            } else {
              this.columns = this.colArr;
              this.columnsWithAction = this.columns;
            }
            if (colArrSelected.length !== 0) {
              this.columns = colArrSelected;
            } else {
              this.columns = this.colArr;
            }
          }

          this.reload();
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
 @Name: openFilterModalDialog function
 @Who:  Suika
 @When: 29-Oct-2021
 @Why: EWM-3279/33516
 @What: For opening filter  dialog box
  */
  openFilterModalDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    this.pagneNo = 1;
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.loading = true;
        this.filterCount = res.data?.length;
        let filterParamArr = [];
        res.data.forEach(element => {
          filterParamArr.push({
            'FilterValue': element.ParamValue,
            'ColumnName': element.filterParam.Field,
            'ColumnType': element.filterParam.Type,
            'FilterOption': element.condition,
            'FilterCondition': 'AND'
          })
        });
        this.filterConfig = filterParamArr.length==0?null:filterParamArr;
        this.loading = true;
        this.setFilterConfig(this.filterConfig);
      }
    })
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList?.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }
  /*
    @Type: File, <ts>
    @Name: openActionModalDialog function
    @Who:  Suika
    @When: 29-Oct-2021
    @Why: EWM-3279/33516
    @What: For opening action dialog box
  */
  openActionModalDialog() {
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      maxWidth: "750px",
      data: new Object({ GridId: this.GridId }),
      panelClass: ['quick-modalbox', 'add_actiondialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      // this.columns=res.data;
      let selectedCol = [];
      if (res != false) {
        selectedCol = res.data.filter(x => x['Selected'] == true);
        if (selectedCol.length != 0) {
          selectedCol.sort(function (a, b) {
            return a.Order - b.Order;
          });
          this.columns = selectedCol;
        } else {
          this.columns = this.colArr;
        }
      }

    })
  }
  /*
 @Type: File, <ts>
 @Name: showTooltip function
 @Who:  Suika
 @When: 29-Oct-2021
 @Why: EWM-3279/33516
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
  @Type: File, <ts>
  @Name: pageChange function
  @Who:  Suika
  @When: 29-Oct-2021
  @Why: EWM-3279/33516
  @What: for Pagination data
*/
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.TotalRecordgrid > this.gridListData.length) {
      this.pagneNo = this.pagneNo + 1;
      this.fetchMoreClientRecord(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
    } else {
      this.loadingscroll = false;
    }
  }

  fetchMoreClientRecord(pagesize, pagneNo, sortingValue, searchVal, JobFilter) {

    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientId'] = this.ClientId;
    jsonObj['LocationId'] = this.LocationId;
    jsonObj['StatusId'] = this.StatusId;

    this.clientGridSub = this._clientService.dashboardClientDetails(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          if(this.gridColConfigStatus){
            this.fitColumns();
          }
          this.gridListData = this.gridListData.concat(nextgridView);
          this.TotalRecordgrid = repsonsedata.TotalRecord;
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
          // this.mapCountryLoad = false;
          this.loadingscroll = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.gridListData = [];
          this.TotalRecordgrid = repsonsedata.TotalRecord;
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingscroll = false;
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
  @Name: switchListMode function
  @Who:  Suika
  @When: 29-Oct-2021
  @Why: EWM-3279/33516
  @What: for swtiching list mode to cARD MODE OR VICE VERSA
*/
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.route.navigate(['/client/core/clients/list'], {
        queryParams: { viewModeData:this.viewMode}});
    } else if (viewMode == 'dash') {
      this.viewMode = "dash";
      this.route.navigate(['/client/core/clients/client-dashboard']);
    } else {
      this.viewMode = "listMode";
      this.route.navigate(['/client/core/clients/list'],{
         queryParams: { viewModeData:this.viewMode}});
    }
  }

  /*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who:  Suika
   @When: 29-Oct-2021
   @Why: EWM-3279/33516
   @What: FOR DIALOG BOX confirmation
 */

  clearFilterData(viewMode): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_clientLanding';
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
        this.filterCount = 0;
        this.loading = true;
        this.filterCount = 0;
        this.setFilterConfig(JobFilter);
      }
    });
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
    @Name: openQuickCompanyModal
    @Who:  Suika
    @When: 29-Oct-2021
    @Why: EWM-3279/33516
    @What: For open client page
     */
  openQuickCompanyModal() {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(QuickCompanyComponent, {
      panelClass: ['xeople-modal-lg', 'quickCompany', 'animate__slow', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.reload();
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
   @Name: onIndustrychange
   @Who:  Suika
   @When: 29-Oct-2021
   @Why: EWM-3279/33516
   @What: when Industry drop down changes
 */
  onIndustrychange(data) {
    if (data == null || data == undefined) {
      this.industryId = '00000000-0000-0000-0000-000000000000';
      this.reload();

    } else {
      this.industryId = data?.Id;
      this.reload();
    }
  }

  /*
  @Type: File, <ts>
  @Name: onCountrychange
  @Who:  Suika
  @When: 29-Oct-2021
  @Why: EWM-3279/33516
  @What: when Country Name drop down changes  mapCountryLoad
*/
  onCountrychange(data) {
    if (data === undefined) {
      this.countryId = 0;
    }
    // adarsh singh on 10-Aug-2023 for ewm-13749
    else if (data === null) {
      this.countryId = 0;
      this.reload();
    }
    else {
      this.countryId = data?.Id;
      this.reload();
    }

  }
  /*
    @Type: File, <ts>
    @Name: onParentClientchange
    @Who:  Suika
    @When: 29-Oct-2021
    @Why: EWM-3279/33516
    @What: when Parent Client drop down changes
*/
  onParentClientchange(data) {
    if (data == null || data == undefined) {
      this.parentClinetId = '00000000-0000-0000-0000-000000000000';
      this.reload();
    } else {
      this.parentClinetId = data?.ClientId;
      this.reload();
    }
  }

  /*
  @Type: File, <ts>
  @Name: onClientRMchange
  @Who:  Suika
  @When: 29-Oct-2021
  @Why: EWM-3279/33516
  @What: when clientRM drop down changes
*/
  onClientRMchange(data) {
    if (data == null || data == undefined) {
      this.clientRMId = 0;
      this.reload();
    } else {
      this.clientRMId = data?.Id;
      this.reload();
    }
  }
  /*
    @Type: File, <ts>
    @Name: onFilter
    @Who:  Suika
    @When: 29-Oct-2021
    @Why: EWM-3279/33516
    @What: For search value
*/
  public onFilter(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.searchValue = inputValue;
    this.pagneNo=1;
    this.searchSubject$.next(inputValue);

  }
  /*
     @Type: File, <ts>
     @Name: onSearchFilterClear
     @Who:  Suika
     @When: 29-Oct-2021
     @Why: EWM-3279/33516
     @What: For clear Filter search value
   */
  public onSearchFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.pagneNo=1;
    this.mapReload();
    //this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal,this.filterConfig);
  }
  /*
   @Type: File, <ts>
   @Name: addHandler
   @Who:  Suika
   @When: 29-Oct-2021
   @Why: EWM-3279/33516
   @What:
 */
  public addHandler() {
    this.isNew = true;
  }
  public editHandler({ dataItem }) {
    // this.editDataItem = dataItem;
    this.isNew = false;
  }

  /*
 @Name: sortName function
@Who:  Suika
 @When: 29-Oct-2021
 @Why: EWM-3279/33516
 @What: For showing shortname on image icon
 */
  sortName(fisrtName) {

    if (fisrtName) {
      const Name = fisrtName;
      let charCount = Name.split(" ").length - 1;
      if (charCount > 0) {
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let last = ShortName1.slice(-1);
        let ShortName = first.concat(last.toString());
        return ShortName.toUpperCase();
      } else {
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let ShortName = first;
        return ShortName.toUpperCase();
      }

    }

  }

  /*
 @Type: File, <ts>
 @Name: dashboardStateClientDetails function
@Who:  Suika
 @When: 29-Oct-2021
 @Why: EWM-3279/33516
 @What: For getting the client list
  */
  dashboardStateClientDetails(JobFilter, pagneNo, pagesize, sortingValue, searchVal) {
    this.maploading = true;
    let jsonObj = {};
    this.markers = [];
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['FolderId']=this.folderId;

     //Who:Ankit Rawat, What:EWM-16114 EWM-16298 Add Proximity Search, When:04March24
     jsonObj['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
     jsonObj['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
     jsonObj['Distance']=this.ProximitySearchResult?.Distance ?? 0;
     jsonObj['Unit']=this.ProximitySearchResult?.Unit;
     jsonObj['Address']=this.ProximitySearchResult?.Address;

    this.StateclientGridSub = this._clientService.dashboardStateClientDetails(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.dasboardMapAllData = repsonsedata.Data;
          // this.dasboardMapData  = [...new Map(repsonsedata.Data.map(item =>[item['ISOCode1'], item])).values()];
          this.dasboardMapData = repsonsedata.Data;
          this.locationMarker = repsonsedata.Data;
          let latsum = 0;
          let longsum = 0;
          let count = 1;
          if ( repsonsedata.Data?.length > 100) {
            this.locationMarker = this.locationMarker.slice(0,100)
          }
          this.locationMarker.forEach(res => {
            this.markers.push({
              lat: Number(res.Latitude),
              lng: Number(res.Longitude),
              label: res.ISOCode1,
              ClientId: res.ClientId,
              ClientName: res.ClientName,
              CountryCode: res.CountryCode,
              CountryId: res.CountryId,
              CountryName: res.CountryName,
              Address: res.Address,
              draggable: false,
              //icon: './assets/icons/marker.png',
              LocationId: res.LocationId
            });

          });
          this.TotalRecord = repsonsedata.TotalRecord;
          this.maploading = false;
          this.loadingSearch = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dasboardMapData = [];
          this.TotalRecord = repsonsedata.TotalRecord;
          this.maploading = false;
          this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.maploading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.maploading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
 @Type: File, <ts>
 @Name: dashboardParentClientDetails function
 @Who: Suika
 @When: 27-Oct-2021
 @Why: EWM-3279/33516
 @What: For getting the client list
  */

  dashboardParentClientDetails(JobFilter,pagneNo,pagesize, sortingValue, searchVal) {
    this.barloading = true;
    this.barCategory = [];
    this.barChartData = [];
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = this.pagneNo;
    jsonObj['PageSize'] = this.ClientGraphLimit;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientId'] = this.ClientId;
    jsonObj['LocationId'] = this.LocationId;
    jsonObj['FolderId']=this.folderId;

    //Who:Ankit Rawat, What:EWM-16114 EWM-16298 Add Proximity Search, When:04March24
    jsonObj['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    jsonObj['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    jsonObj['Distance']=this.ProximitySearchResult?.Distance?? 0;
    jsonObj['Unit']=this.ProximitySearchResult?.Unit;
    jsonObj['Address']=this.ProximitySearchResult?.Address;

    this.parentClientGridSub = this._clientService.dashboardParentClientDetails(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.barCategory = [];
          this.barChartData = [];
          this.dasboardBarChartData = repsonsedata.Data;
          this.dasboardBarChartData.forEach(element => {
            this.barCategory.push(element.ParentClientName);
            this.barChartData.push(element.Count);
          })
          // @(C): Entire Software @Type: File, <css> @Name: @Who: Satya Prakash @When: 26-Oct-2023 @Why: EWM-14916 @What: add min height in bar
          if(repsonsedata.TotalRecord>7){
            this.barheight = (repsonsedata.TotalRecord * 40);
          }else{
            this.barheight = 220;
          }
          this.drawbarchart('');
          this.TotalRecord = repsonsedata.TotalRecord;
          this.barloading = false;
          this.loadingSearch = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dasboardBarChartData = [];
          this.barCategory = [];
          this.barChartData = [];
          this.TotalRecord = repsonsedata.TotalRecord;
          this.barloading = false;
          this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.barloading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.barloading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
 @Type: File, <ts>
 @Name: dashboardStatusClientDetails function
 @Who: Suika
 @When: 27-Oct-2021
 @Why: EWM-3279/33516
 @What: For getting the client list
  */
  dashboardStatusClientDetails(JobFilter, pagneNo, pagesize, sortingValue, searchVal) {
    this.pieloading = true;
    this.pieData = [];
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientId'] = this.ClientId;
    jsonObj['LocationId'] = this.LocationId;
    jsonObj['FolderId']=this.folderId;

    //Who:Ankit Rawat, What:EWM-16114 EWM-16298 Add Proximity Search, When:04March24
    jsonObj['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    jsonObj['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    jsonObj['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    jsonObj['Unit']=this.ProximitySearchResult?.Unit;
    jsonObj['Address']=this.ProximitySearchResult?.Address;

    this.statusClientGridSub = this._clientService.dashboardStatusClientDetails(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        this.pieData = [];
        this.pieDataLegends = [];
        this.pieDataColors = [];
        if (repsonsedata.HttpStatusCode === 200) {
          this.dasboardPieChartData = repsonsedata.Data;
          this.dasboardPieChartData.forEach(res => {
            res['legends'] = res.StatusName + '(' + res.Count + ')';
            this.pieData.push(res.Count);
            this.pieDataLegends.push(res.StatusName);
            this.pieDataColors.push(res.ColorCode);
          })
          if (this.pieDataLegends.length > 0) {
            //this.drawPolarChart();
            this.drawPiechart('');
          }
          this.TotalRecord = repsonsedata.TotalRecord;
          this.pieloading = false;
          this.loadingSearch = false;

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.dasboardPieChartData = [];
          this.pieData = [];
          this.TotalRecord = repsonsedata.TotalRecord;
          this.pieloading = false;
          this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.pieloading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.pieloading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
@Type: File, <ts>
@Name: dashboardClientDetails function
@Who: Suika
@When: 27-Oct-2021
@Why: EWM-3279/33516
@What: For getting the client list
*/

  getClientList(pagesize, pagneNo, sortingValue, searchVal, JobFilter) {
    this.loading = true;
    this.kendoLoading = true;
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientId'] = this.ClientId;
    jsonObj['LocationId'] = this.LocationId;
    jsonObj['StatusId'] = this.StatusId;
    this.clientGridSub = this._clientService.dashboardClientDetails(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.gridListData = repsonsedata.Data;
          this.data = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
          this.TotalRecordgrid = repsonsedata.TotalRecord;
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
          if(this.gridColConfigStatus){
            this.fitColumns();
          }
          // this.mapCountryLoad = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.gridListData = [];
          this.TotalRecordgrid = repsonsedata.TotalRecord;
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
        } else {
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
@Type: File, <ts>
@Name: getClientCount function
@Who: Suika
@When: 27-Oct-2021
@Why: EWM-3279/33516
@What: For getting the client list
*/

  getClientCount(JobFilter, pagesize, pagneNo, sortingValue, searchValue) {
    this.loading = true;
    this.kendoLoading = true;
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientId'] = this.ClientId;
    jsonObj['LocationId'] = this.LocationId;
    jsonObj['FolderId']=this.folderId;
    //Who:Ankit Rawat, What:EWM-16114 EWM-16298 Add Proximity Search, When:04March24
    jsonObj['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    jsonObj['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    jsonObj['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    jsonObj['Unit']=this.ProximitySearchResult?.Unit;
    jsonObj['Address']=this.ProximitySearchResult?.Address;

    this.clientcountSub = this._clientService.dashboardClientCount(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.TotalNoOfClient = repsonsedata.Data.Count;
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.TotalNoOfClient = 0;
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
        } else {
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
@Type: File, <ts>
@Name: getClientCount function
@Who: Suika
@When: 27-Oct-2021
@Why: EWM-3279/33516
@What: For getting the client list
*/

  setFilterConfig(JobFilter) {
    this.loading = true;
    this.kendoLoading = true;
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterConfig'] = this.filterConfig;
    } else {
      jsonObj['FilterConfig'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['CardConfig'] = [];
    jsonObj['GridConfig'] = this.colArr;
    //Who:Ankit Rawat, What:EWM-16114 EWM-16298 set Proximity search data, When:04March24
    jsonObj['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    jsonObj['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    jsonObj['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    jsonObj['Address']=this.ProximitySearchResult?.Address;

    this.jobService.setfilterConfig(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {        
        if (repsonsedata.HttpStatusCode === 200) {
          this.cache.setLocalStorage(this.GridId,JSON.stringify(repsonsedata.Data));
          this.TotalNoOfClient = repsonsedata.Data.Count;
          this.reload();

          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
          // this.getFilterConfig(false);
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.TotalNoOfClient = 0;
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
        } else {
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
  onMapCountryChange(countryId: number) {
    let data = { Id: countryId };
    this.countryId = data.Id;
    this.selectedValue = data;
    this.mapCountryLoad == true;
    //this.onCountrychange(data);

  }
  resetAllFilter() {
    this.filterConfig = [];
    let JobFilter = [];
    //this.loading = true;
    this.filterCount=0;
    this.setFilterConfig(JobFilter);
    this.clientRMId = 0;
    this.industryId = '00000000-0000-0000-0000-000000000000';
    this.parentClinetId = '00000000-0000-0000-0000-000000000000';
    this.countryId = 0;
    this.selectedRelation = {};
    this.selectedParentClient = {};
    this.selectedClientRM = {};
  }
  mapReload() {
    this.pagneNo = 1;
    this.ClientId = '00000000-0000-0000-0000-000000000000';
    this.LocationId = '00000000-0000-0000-0000-000000000000';
    this.StatusId = '00000000-0000-0000-0000-000000000000'
    this.previous_info_window = null;
    //this.resetAllFilter();
    this.getClientCount(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    this.dashboardStateClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValueByCreatedDate, this.searchValue);
    this.dashboardParentClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    this.dashboardStatusClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    // this.pagneNo=this.state.skip/this.state.take + 1;
    this.skip=0;
    this.getClientListAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
  }

  ngOnDestroy() {
       //<!-----@suika@EWM-10650 @10-03-2023 to handle undefined----->
    this.StateclientGridSub?.unsubscribe();
    this.clientGridSub?.unsubscribe();
    this.clientcountSub?.unsubscribe();
    this.statusClientGridSub?.unsubscribe();
    this.parentClientGridSub?.unsubscribe();
    this.oraganizationChangeSubscription?.unsubscribe();
    //@Who: Adarsh Singh 21-APRIL-2023  EWM-12059
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig);
    }
    // End
  }

  reload() {
    this.ClientId = '00000000-0000-0000-0000-000000000000';
    this.LocationId = '00000000-0000-0000-0000-000000000000';
    this.StatusId = '00000000-0000-0000-0000-000000000000';
    this.previous_info_window = null;
    this.getClientCount(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    this.dashboardStateClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValueByCreatedDate, this.searchValue);
    this.dashboardParentClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    this.dashboardStatusClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    // this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
    this.skip = 0;
    this.pagneNo=1
    this.getClientListAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);

  }

/*
@Type: File, <ts>
@Name: advancedSearchActivate function
@Who: Renu
@When: 26-Aug-2022
@Why: EWM-8235 EWM-8450
@What: for seacrh advance loading
*/
  advancedSearchActivate(value:boolean){
    this.advanceSearchOn=value;
  }

  barreload() {
    // this.filterConfig = [];
    let JobFilter = [];
    this.clientRMId = 0;
    this.industryId = '00000000-0000-0000-0000-000000000000';
    this.parentClinetId = '00000000-0000-0000-0000-000000000000';
    this.countryId = 0;
    this.selectedRelation = {};
    this.selectedParentClient = {};
    this.selectedClientRM = {};
    this.getClientCount(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    // this.dashboardStateClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    this.dashboardParentClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
    this.dashboardStatusClientDetails(this.filterConfig, this.pagneNo, this.pagesize, this.sortingValue, this.searchValue);
      this.skip=0;
    this.getClientListAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
  }

  /*************end**************/


  /**********************map********************** */

  clickedMarker(ClientId: string, infoWindow, index: number, type: any, LocationId: string) {

    if (this.previous_info_window == null) {
      this.previous_info_window = infoWindow;
    }
    else {
      this.infoWindowOpened = infoWindow
      this.previous_info_window.close()
    }
    this.previous_info_window = infoWindow;
    this.dasboardMapPopUpData = this.dasboardMapAllData.filter(x => {
      return (x.ClientId == ClientId) && (x.LocationId == LocationId)
    });
 // console.log(" this.dasboardMapPopUpData ", this.dasboardMapPopUpData);
    if (this.dasboardMapPopUpData[0]?.CountryId != undefined && this.dasboardMapPopUpData[0]?.CountryId != null) {
      this.countryId = this.dasboardMapPopUpData[0].CountryId;
    }
    if (type == 'onload') {
      this.ClientId = ClientId;
      this.LocationId = LocationId;
     // this.reload();
    }
  }

  mapReady(map) {
    map.setOptions({
      // zoom: 1,
      // minZoom: 1,
      zoomControl: "true",
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      fullscreenControl: false,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
    });
    //this.loader = true;
    map.addListener("dragend", () => {
      //this.loader = false;
      // do something with centerLatitude/centerLongitude
    });
  }
    mapClicked($event: any) {
      if (this.previous_info_window != null) {
        this.previous_info_window.close()
      }


      this.marker.push({
        lat: $event.coords.lat,
        lng: $event.coords.lng,
        ClientId: $event.coords.ClientId,
        ClientName: $event.coords.ClientName,
        CountryCode: $event.coords.CountryCode,
        CountryId: $event.coords.CountryId,
        CountryName: $event.coords.CountryName,
        draggable: true
      });
  // console.log(this.marker);


  }
  isOpen;
  toggle() {
    this.isOpen = !this.isOpen;
  }
  /*
  @Type: File, <ts>
  @Name: convert hex to rgba color function
  @Who: Satya Prakash Gupta
  @When: 13-Jan-2022
  @Why: EWM-4213 EWM-4505
  @What: convert hex to rgba color for primary color
  */
  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

/*
@Type: File, <ts>
@Name: setConfiguration function
@Who: Adarsh singh
@When: 21-APRIL-2023
@Why: ROST-12059
@What: For saving the setting config WITH WIdth of columns
*/

setConfiguration(columnsConfig) {
  let gridConf = {};
  let tempArr: any[] = this.colArr;
  columnsConfig.forEach((x:any) => {
    let objIndex:any = tempArr?.findIndex((obj => obj.Field == x.field));
      if(objIndex>=0){
        tempArr[objIndex].Format = x.format,
        tempArr[objIndex].Locked = x.locked,
        tempArr[objIndex].Order =x.leafIndex+1,
        tempArr[objIndex].Selected = true,
        tempArr[objIndex].width = String(x._width)
      }
    });
  gridConf['GridId'] = this.GridId;
  gridConf['GridConfig'] = tempArr;
  gridConf['CardConfig'] = [];
  // gridConf['FilterAlert'] = this.filterAlert;
  gridConf['filterConfig'] = this.filterConfig;
  // gridConf['QuickFilter'] = this.quickFilterStatus;

  //Who:Ankit Rawat, What:EWM-16114 EWM-16298 set Proximity search data, When:05March24
  gridConf['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
  gridConf['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
  gridConf['Distance']=this.ProximitySearchResult?.Distance ?? 0;
  gridConf['Address']=this.ProximitySearchResult?.Address;
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
@Name: fitColumns function
@Who: Adarsh singh
@When: 21-APRIL-2023
@Why: ROST-12059
@What: fit columns auto width increase from config
*/
  public fitColumns(): void {
    this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns();
    });
  }
  getClientListAll(pagesize, pagneNo, sortingValue, searchVal, JobFilter) {
    this.loading = true;
    this.kendoLoading = true;
    this.loadingscroll = true;

    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = this.searchValue;
    jsonObj['PageSize'] = pagesize;
    jsonObj['IndustryId'] = this.industryId ? this.industryId : "00000000-0000-0000-0000-000000000000";
    jsonObj['CountryId'] = parseInt(this.countryId ? this.countryId.toString() : '0');
    jsonObj['ParentClientId'] = this.parentClinetId ? this.parentClinetId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientRMId'] = this.clientRMId ? this.clientRMId : "00000000-0000-0000-0000-000000000000";
    jsonObj['ClientId'] = this.ClientId;
    jsonObj['LocationId'] = this.LocationId;
    jsonObj['StatusId'] = this.StatusId;
    jsonObj['page'] = this.pagneNo;
    jsonObj['sort'] = sortingValue;
    jsonObj['FolderId']=this.folderId;

    //Who:Ankit Rawat, What:EWM-16114 EWM-16298 Add Proximity Search, When:04March24
    jsonObj['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    jsonObj['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    jsonObj['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    jsonObj['Unit']=this.ProximitySearchResult?.Unit;
    jsonObj['Address']=this.ProximitySearchResult?.Address;

    this.clientGridSub = this._clientService.dashboardClientDetailsV2(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          this.data = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
          this.gridListData = repsonsedata.Data;
          this.TotalRecordgrid = repsonsedata.TotalRecord;
          this.Totalcount = repsonsedata.TotalRecord;
          this.TotalNoOfClient = repsonsedata.TotalRecord;
          this.FilterDataClearList = repsonsedata.Data;
          this.gridListDataFilter= repsonsedata.Data;
          this.kendoLoading = false;
          if(this.gridColConfigStatus){
            this.fitColumns();
          }
      }else if (repsonsedata.HttpStatusCode === 204){
        this.data = null;
        this.gridListData=null;
        this.TotalRecordgrid = repsonsedata.TotalRecord;
        this.loading = false;
        this.loadingSearch = false;
        this.loadingscroll = false;
      }else if (repsonsedata.HttpStatusCode === 400){
        this.data = null
        this.gridListData=null;
        this.TotalRecordgrid = repsonsedata.TotalRecord;
        this.loading = false;
        this.loadingSearch = false;
        this.loadingscroll = false;

      }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  public dataStateChange(state): void {
    this.state = state;
    this.loading = true;
    this.pagneNo=this.state.skip/this.state.take + 1;
      this.getClientListAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
  }
    // who:maneesh,what:ewm-15699 for local search when:11/01/2023
    public gridViewlistClearData: GridDataResult;
    public filterChange(filter: CompositeFilterDescriptor): void {
      this.filter = filter;
      if(this.filter?.filters?.length==0){
      this.gridViewlistClearData = {
        data: this.FilterDataClearList,
        total: this.Totalcount
      };
      this.data=this.gridViewlistClearData;
      this.TotalNoOfClient = this.Totalcount;

      }else{
        this.loadData();
      }
    }
    public gridViewlist: GridDataResult;
    public loadData(): void {
      this.gridData = filterBy(this.gridListDataFilter, this.filter);
      this.gridViewlist = {
        data: this.gridData,
        total: this.gridData?.length
      };
      this.data=this.gridViewlist;
      this.TotalNoOfClient = this.gridViewlist?.total;
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
      this.getClientListAll(take, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);

    }
    public sortChange(sort: SortDescriptor[]): void {
      this.sort = sort;
        if (this.sort[0].dir!=undefined || this.sort[0].dir!=null) {
        this.sortDirection= this.sort[0].dir;
    }else{
      this.sortDirection='asc';
    }
      this.sortingValue= this.sort[0].field + '-'+ this.sortDirection;
      this.getClientListAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
    }

    //get folder list functnionality start,who:maneesh,what:ewm-15817,when:01/02/2024 getClientFolderListAll pass folder id
getFolderListAll() {
  this.openQuickFolderModal();
}

openQuickFolderModal() {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_folderName';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(ClientlandingFolderComponent, {
    data: new Object({totalDataCountFolder:this.totalDataCountFolder,userType:this.userType,folderList:this.folderList}),
    panelClass: ['xeople-modal-lg', 'add_folder', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    this.folderId=res.data;
    this.folderName=res.name;
    this.state.skip=0;
      if (res.data!=0 && res.data!=undefined) {
        this.mapReload();
      }
      else if( res.cancel==true){
       this.folderId = 0;
      }
   })

  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }

  // RTL Code
  let dir: string;
  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList?.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }

 }

 clearFolderData(): void {
  this.folderId =0;
  this.folderName='';
  // this.filterConfig = null;
  this.mapReload();
}
//get folder list functnionality start,who:maneesh,what:ewm-15817,when:29/01/2023
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
 // RTL Code
 let dir: string;
 dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
 let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
 for (let i = 0; i < classList.length; i++) {
   classList[i].setAttribute('dir', this.dirctionalLang);
 }
}
/*  @Name: selectedCallback  @Who: Renu @When: 21-11-2023  @Why: EWM-15174 EWM-15186 @What: get all checkbox event */
public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;

/* @Who: Renu @When: 21-11-2023  @Why: EWM-15174 EWM-15186  @What: to get value on checkbox selection */
selectionChange(event:any){
  if(event?.length==1){
    this.selectedCandidate=event;
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
  const dialogRef = this.dialog.open(ClientBulkEmailComponent, {
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

 /*
  @Type: File, <ts>
  @Name: openProximitySearchDialog function
  @Who: Ankit Rawat
  @When: 04-March-2024
  @Why: EWM-16114 EWM-16298
  */
  openProximitySearchDialog() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ProximitySearchComponent, {
      panelClass: ['xeople-modal', 'xeopleSmartEmailModal', 'animate__animated', 'animate__zoomIn'],
      data: { 'proximitySearchData': this.ProximitySearchResult},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res.Action.toUpperCase()=='SEARCH'){
        this.ProximitySearchResult=res;
      }
      else if(res.Action.toUpperCase()=='DISMISS'){
        if(this.IsProximitySearch==false){
          this.ProximitySearchResult.Latitude=this.ProximitySearchResult.Longitude=0;
          this.ProximitySearchResult.Address='';
          this.ProximitySearchResult.Distance=0;
        }
      }
      if(this.ProximitySearchResult.Latitude!=0 && this.ProximitySearchResult.Longitude!=0 && this.ProximitySearchResult.Address){
        this.IsProximitySearch=true;
        if(res.Action.toUpperCase()=='SEARCH'){
          this.setProximityData().then(() => {
            setTimeout(() => {
              this.getProximityData().then(() => {
                this.mapReload();
              });
            }, 1000);        
          });
        } 
      }
      else  {
        this.IsProximitySearch=false;
        this.setProximityData().then(() => {
          this.getProximityData().then(() => {
          });        
        });

      }
    })
  }
  
  //Who:Ankit Rawat, What:EWM-16114 EWM-16298 cleared Proximity search, When:04March24 -->
    onClearProximitySearch(): void {
      const message = `label_confirmDialog_Proximity`;
      const title = '';
      const subTitle = 'label_clientLanding';
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
          this.IsProximitySearch=false;
          this.ProximitySearchResult.Latitude=this.ProximitySearchResult.Longitude=0;
          this.ProximitySearchResult.Address='';
          this.ProximitySearchResult.Distance=0;
          this.setProximityData().then(() => {
            setTimeout(() => {
            this.sortingValue='ClientName-asc';
            this.sort[0].field='ClientName';
            this.sort[0].dir='asc';
              this.getProximityData(this.ProximitySearchResult).then(() => {
                this.mapReload();
              });
            }, 1000);        
          }); 
        }
      });
    }

  //Who:Ankit Rawat, What:EWM-16114 EWM-16298 show/hide proximity column, When:04March24
  setProximityConfiguration(){
    let proximityObject:any = this.colArr.find(obj => obj.Field === 'Proximity');
    if (proximityObject) {
      proximityObject.Selected = this.IsProximitySearch;
    }
  }

  setProximityData() {
    return new Promise<void>((resolve) => {
        this.setFilterConfig([]);
        resolve(); 
    });
  }

  getProximityData(proximityData:any=null) {
    return new Promise<void>((resolve) => {
      this.gridProximiytConfiguration(proximityData);
      resolve(); 
    });
  }

  gridProximiytConfiguration(proximityData:any=null) {
    if(!this.filterConfig){
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            //Who:Ankit Rawat, What:EWM-16114-EWM-16298 retain Proximity, When:04March24
            if(proximityData!=null){
              this.ProximitySearchResult.Latitude=proximityData?.Latitude ?? 0;
              this.ProximitySearchResult.Longitude=proximityData?.Longitude ?? 0;
              this.ProximitySearchResult.Address=proximityData?.Address;
              this.ProximitySearchResult.Distance=proximityData?.Distance ?? 0;
            }else{
            this.ProximitySearchResult.Latitude=repsonsedata.Data?.Latitude ?? 0;
            this.ProximitySearchResult.Longitude=repsonsedata.Data?.Longitude ?? 0;
            this.ProximitySearchResult.Address=repsonsedata.Data?.Address;
            this.ProximitySearchResult.Distance=repsonsedata.Data?.Distance ?? 0;
            }
            if(this.ProximitySearchResult.Latitude!=0 && this.ProximitySearchResult.Longitude!=0 && this.ProximitySearchResult.Address){
              this.IsProximitySearch=true;
            }
            this.colArr = repsonsedata.Data.GridConfig;
            //Who:Ankit Rawat, What:EWM-16114 EWM-16298 show/hide proximity column, When:04March24
            this.setProximityConfiguration();
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            this.filterAlert = repsonsedata.Data.FilterAlert;
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig.length;
            } else {
              this.filterCount = 0;
            }
            if (this.filterAlert == 1) {
              this.dynamicFilterArea = false;
            } else {
              this.dynamicFilterArea = true;
            }
            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
            }
            if (colArrSelected?.length !== 0) {
              this.columns = colArrSelected;
              this.columnsWithAction = this.columns;

            } else {
              this.columns = this.colArr;
              this.columnsWithAction = this.columns;
            }
            if (colArrSelected.length !== 0) {
              this.columns = colArrSelected;
            } else {
              this.columns = this.colArr;
            }
          }
          if(this.IsProximitySearch) {
            this.sortingValue='Proximity-asc';
            this.sort[0].field='Proximity';
            this.sort[0].dir='asc';
          }
          this.reload();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
    }
  }
  
}
