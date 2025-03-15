/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 25-Oct-2021
  @Why: EWM-3272/3483
  @What:  This page will be use for Client landing page Component ts file
*/

import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ResponceData, SCREEN_SIZE, Userpreferences } from 'src/app/shared/models';
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
import { QuickjobComponent } from '../../shared/quick-modal/quickjob/quickjob.component';
import { QuickCompanyComponent } from '../../shared/quick-modal/quick-company/quick-company.component';
import { ClientService } from '../../shared/services/client/client.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { NewEmailComponent } from '../../shared/quick-modal/new-email/new-email.component';
import { CompositeFilterDescriptor, SortDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { CandidateFolderComponent } from '@app/modules/EWM-Candidate/candidate-folder/candidate-folder.component';
import { ManageCandidateFolderComponent } from '@app/modules/EWM-Candidate/candidate-folder/manage-candidate-folder/manage-candidate-folder.component';
import { CandidateFolderService } from '../../shared/services/candidate/candidate-folder.service';
import { ClientlandingFolderComponent } from '../clientlanding-folder/clientlanding-folder.component';
import { ClientBulkSmsComponent } from '../client-bulk-sms/client-bulk-sms.component';
import { ClientBulkEmailComponent } from '../client-bulk-email/client-bulk-email.component';
import { ProximitySearchComponent } from 'src/app/shared/popups/proximity-search/proximity-search.component';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
import { ShareClientEohComponent } from '../client-detail/share-client-eoh/share-client-eoh.component';
import { CommonServiesService } from '../../../../shared/services/common-servies.service';
import { AlertDialogComponent } from '../../../../shared/modal/alert-dialog/alert-dialog.component';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order:number
}

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-client-landing',
  templateUrl: './client-landing.component.html',
  styleUrls: ['./client-landing.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class ClientLandingComponent implements OnInit {

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
  // public sort: any[] = [{
  //   field: 'ClientName',
  //   dir: 'asc'
  // }];

  public GridId:any='grid003';
  public sortingValue: string;
  public searchValue: string = "";
  public gridListData: any[];
  public columns: ColumnSetting[] = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public workflowList: any=[];
  public workflowId: any;
  public filterCount: number=0;
  public colArr: any=[];
  public tempID: any;
  public stagesList: any=[];
  public totalJobsWorkFlow: number;
  public filterConfig: any= [];
  public sortDirection = 'asc';
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
  industryId='00000000-0000-0000-0000-000000000000';
  countryId=0;
  parentClinetId='00000000-0000-0000-0000-000000000000';
  clientRMId='00000000-0000-0000-0000-000000000000';
  TotalNoOfClient: number;
  public searchVal: string = '';
  public loadingSearch: boolean;
  pageNumberC: any=1;
  pageSizeC: any=500;
  public positionMatDrawer: string ;
  public countryCustomClass: string ;
  loaderStatus: number;
  public totalDataCount: number;
  // @Who: Ankit Rawat, @When: 30-jan-2024,@Why: EWM-15875 (Enable Export feature only for Super Admin)
  public UserType: number=0;
  @ViewChild(GridComponent)
  public grid: GridComponent;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
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
  dateFormatKendo: string;
  countryList:any = [];
  oraganizationChangeSubscription: Subscription;
  //************ Kendo grid pageng variabel***********
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
  public sort: SortDescriptor[] = [
    {
      field: 'ClientName',
      dir: 'asc'
    }
  ];
  //folderList variabel
public totalDataCountFolder: number;
public folderId:number=null;
public folderName: any;
public folderList = [];
public userType:string='client'
public dirctionalLang: string;
/***@Who:Renu @when: 21-11-2023 @Why:EWM-15174 EWM-15186****/
selectableSettings:SelectableSettings = {
  checkboxOnly: true
}
public selectedCandidate: any = [];
burstSMSRegistrationCode: string;
SMSCheckStatus: boolean = false;
emailConnectionStatus: string;
public multipleEmail:boolean = false;
  mailConnectStatus: boolean;
 //Who:Ankit Rawat, What:EWM-16114 EWM-16203 Add Proximity Search, When:29Feb24
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
  //folderList variabel END
  gridId_03: string = 'grid003';
  brandAppSetting: any=[];
  EOHLogo: any;
  extractEnableClientCheck: number=0;
  eohRegistrationCode: any;
  IsEOHIntergrated: any;

  constructor(private route: Router,public dialog: MatDialog,private jobService:JobService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService,private router: ActivatedRoute,private cache: CacheServiceService,
    public _userpreferencesService: UserpreferencesService,private elementRef: ElementRef,public _sidebarService: SidebarService,private serviceListClass: ServiceListClass,private _clientService: ClientService,
    private commonserviceService: CommonserviceService, private ngZone: NgZone,private _commonserviceService: CommonserviceService,
    public _CandidateFolderService: CandidateFolderService,private commonServiesService: CommonServiesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    this.sizes = this.appSettingsService.pageSizeOptions;
    this.state.take=this.appSettingsService.pagesize;
    // page option from config file
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll;
    this.dropDoneConfig['placeholder'] = 'label_industry';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/industry-master';
    this.dropDoneConfig['bindLabel'] = 'Description';
    this.dropDoneConfig['IsRequired'] = false;
    this.dropDoneConfig['isselectAll'] = true;
    this.dropDoneConfig['clearable'] = true;
    //this.dropDoneConfigCountry['placeholder'] = 'label_country';
    this.dropDoneConfigCountry['IsDisabled'] = false;
    this.dropDoneConfigCountry['apiEndPoint'] = this.serviceListClass.countryList + '?ByPassPaging=true';
    this.dropDoneConfigCountry['placeholder'] = 'label_country';
    this.dropDoneConfigCountry['searchEnable'] = true;
    this.dropDoneConfigCountry['IsManage'] = '';
    this.dropDoneConfigCountry['bindLabel'] = 'CountryName';
    this.dropDoneConfigCountry['IsRequired'] = false;
    this.dropDoneConfigCountry['countryCustomClass'] = 'CountryNameCountryCustomClass';
    this.dropDoneConfigCountry['isselectAll'] = true;
    this.dropDoneConfigCountry['clearable'] = true;
    this.dropDoneConfigParentClient['IsDisabled'] = false;
    this.dropDoneConfigParentClient['apiEndPoint'] = this.serviceListClass.getParentCompanyAll;
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
      // this.pagesize = this.appSettingsService.pagesize;
      this.pageSizeOptions = this.appSettingsService.pageSizeOptions;
      this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
     }
  ngOnInit(): void {
    this.isOnInit=true;
    this.sortingValue= this.sort[0].field + '-'+ this.sortDirection;
    /*--@Who:Nitin Bhati,@When:20-07-2023 @Why: EWM-13434--*/
   this.dateFormatKendo = localStorage.getItem('DateFormat');
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable.next('1');
    // this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    // this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
     this._sidebarService.activesubMenuObs.next('list');
      this.userpreferences = this._userpreferencesService.getuserpreferences();
      this.emailConnectionStatus= localStorage.getItem('emailConnection');
      this.mailConnectStatus=this.emailConnectionStatus=='1'?false:true;
    this.getFilterConfig();
     /*--@When:09-08-2023 @who:Nitin Bhati,@why:EWM-13490,@what:showing data after change organization Names--*/
     this.oraganizationChangeSubscription=   this._commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
        this.getFilterConfig();
      }
     })
    let queryParams = this.router.snapshot.params.Id;
    this.workflowId=decodeURIComponent(queryParams);
    this.currentMenuWidth = window.innerWidth;
    // window.dispatchEvent(new Event('resize'));
    this.onResize(window.innerWidth,'onload');
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.dirChange(res);
    });
    this.countryCustomClass="countryCustomClass";

    // setInterval(() => {
    //   this.canLoad = true;
    //   if (this.pendingLoad) {
    //     this.onScrollDown();
    //   }
    // }, 2000);
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
      this.getClientList(this.pagesize, this.pagneNo, this.sortingValue,val,this.filterConfig);
       });
       this._sidebarService.searchEnable.next('1');
       // @Who: Ankit Rawat, @When: 30-jan-2024,@Why: EWM-15875 (Enable Export feature only for Super Admin)
       let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
       this.UserType = currentUser?.UserType;
        let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));          
        let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
        this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;
        const filteredBrands = this.brandAppSetting?.filter(brand => brand?.EOH);
        this.EOHLogo=filteredBrands[0]?.logo;
        this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
        let eohRegistrationCode = otherIntegrations?.filter(res => res.RegistrationCode === this.eohRegistrationCode);
        this.IsEOHIntergrated = eohRegistrationCode[0]?.Connected; 
        let EOHIntegrationSubscribe = JSON.parse(localStorage.getItem('EOHIntegration'));
        this.extractEnableClientCheck=EOHIntegrationSubscribe?.clientExtractEnable;
   }
  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
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
delaAnimation(i:number){
  if(i<=25){
    return 0+i*80;
  }
  else{
    return 0;
  }
}

   ngOnDestroy(){
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        })
      };
      this.setConfiguration(gridConfig.columnsConfig);
    }
    this.oraganizationChangeSubscription?.unsubscribe();
  }
   /*
  @Type: File, <ts>
  @Name: setConfiguration function
  @Who: Renu
  @When: 26-oct-2021
  @Why: ROST-1734 EWM-3271
  @What: For saving the setting config WITH WIdth of columns
   */

  setConfiguration(columnsConfig,isLoad=true){
    let gridConf={};
    let tempArr:any[]=this.colArr;
    columnsConfig.forEach(x => {
    let  objIndex:any = tempArr?.findIndex((obj => obj.Field == x.field));

      if(objIndex>=0)
      {
        tempArr[objIndex].Format = x.format,
        tempArr[objIndex].Locked = x.locked,
        tempArr[objIndex].Order =x.leafIndex+1,
        tempArr[objIndex].Selected = true,

        tempArr[objIndex].width = String(x._width)
      }

    });

    gridConf['GridId']=this.GridId;
    gridConf['GridConfig']=tempArr;
    gridConf['CardConfig']=[];
    gridConf['filterConfig']=this.filterConfig;
    //Who:Ankit Rawat, What:EWM-16114-EWM-16203 set proximity data, When:04March24
    gridConf['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    gridConf['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    gridConf['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    gridConf['Address']=this.ProximitySearchResult?.Address;


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
  /*



   /*
  @Name: footer.component.ts
  @Who: Nitin
  @When: 09-Oct-2020
  @Why: ROST-247
  @What: Implementation of Footer Section Flip with Logo Icon
  */
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
    const currentSize = this.sizess.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
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


  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Nitin Bhati
  @When: 25-Oct-2021
  @Why: EWM-3272/3483
  @What: For getting the deafult config for the user
   */
  onSwiper(swiper) {
   // console.log(swiper);
  }
  onSlideChange() {
  //  console.log('slide change');
  }

  getFilterConfig(proximityData:any=null){
    this.loading=true;

    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch=false;
          let colArrSelected=[];
          if(repsonsedata.Data!==null)
          {
            //Who:Ankit Rawat, What:EWM-16114-EWM-16295 retain Proximity, When:01March24
            if(proximityData!=null){
              this.ProximitySearchResult.Latitude=proximityData?.Latitude ?? 0;
              this.ProximitySearchResult.Longitude=proximityData?.Longitude ?? 0;
              this.ProximitySearchResult.Address=proximityData?.Address;
              this.ProximitySearchResult.Distance=proximityData?.Distance  ?? 0;
            }
            else{
            this.ProximitySearchResult.Latitude=repsonsedata.Data?.Latitude ?? 0;
            this.ProximitySearchResult.Longitude=repsonsedata.Data?.Longitude ?? 0;
            this.ProximitySearchResult.Address=repsonsedata.Data?.Address;
            this.ProximitySearchResult.Distance=repsonsedata.Data?.Distance  ?? 0;
            }
            if(this.ProximitySearchResult.Latitude!=0 && this.ProximitySearchResult.Longitude!=0 && this.ProximitySearchResult.Address){
              this.IsProximitySearch=true;
            }
            else this.IsProximitySearch=false;

            this.colArr= repsonsedata.Data.GridConfig;
            //Who:Ankit Rawat, What:EWM-16114-EWM-16295 retain Proximity, When:04March24
            let proximityObject:any = this.colArr.find(obj => obj.Field === 'Proximity');
             if (proximityObject) {
               proximityObject.Selected = this.IsProximitySearch;
             }
            /*--@Who:Ankit Rawat,@When:07March24 @Why: EWM-16114,@what:Applied proximity sorting if proximity flag is ON--*/
            if(this.isOnInit){
              if(this.IsProximitySearch) {
                 this.sortingValue='Proximity-asc';
                 this.sort[0].field='Proximity';
                 this.sort[0].dir='asc';
              }
            }
            else{
              if(this.IsProximitySearch==false){
                this.sortingValue='ClientName-asc';
                this.sort[0].field='ClientName';
                this.sort[0].dir='asc';
              }
            }
            this.isOnInit=false;
            this.filterConfig=repsonsedata.Data.FilterConfig;
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;
            if( this.filterConfig!==null)
            {
              this.filterCount=this.filterConfig.length;
            }else{
              this.filterCount=0;
            }
            if(repsonsedata.Data.GridConfig.length!=0)
            {
              colArrSelected=repsonsedata.Data.GridConfig.filter(x=>x.Selected==true);
            }
          if(colArrSelected.length!==0){
            //this.columns=colArrSelected;
            colArrSelected.sort(function (a, b) {
              return a.Order - b.Order;
            });
            this.columns = colArrSelected;
          }else{
            this.columns=this.colArr;
          }
          }
          this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
        }else {
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
  @Who: Nitin Bhati
  @When: 25-Oct-2021
  @Why: EWM-3272/3483
  @What: For opening filter  dialog box
   */

  openFilterModalDialog(){
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId}),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    // this.pagneNo = 1;
    dialogRef.afterClosed().subscribe(res => {
      if(res!=false){
        this.loading=true;
        this.filterCount=res.data.length;
        let filterParamArr=[];
        res.data.forEach(element => {
          filterParamArr.push({
              'FilterValue':element.ParamValue,
              'ColumnName':element.filterParam.Field,
              'ColumnType':element.filterParam.Type,
              'FilterOption':element.condition,
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
        jsonObjFilter['IndustryId']=this.industryId;
        jsonObjFilter['CountryId']=this.countryId;
        jsonObjFilter['ParentClientId']=this.parentClinetId;
        jsonObjFilter['ClientRMId']=this.clientRMId;
        jsonObjFilter['ClientFilterParams']=filterParamArr;
        jsonObjFilter['page']=this.pagneNo;
        jsonObjFilter['sort']=this.sortingValue;
        jsonObjFilter['FolderId']=this.folderId;
        this.filterConfig=filterParamArr;
        this._clientService.fetchClientlist(jsonObjFilter).subscribe(
          (repsonsedata:ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200) {
              this.gridListData = repsonsedata.Data;
              this.data = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
              this.TotalNoOfClient = repsonsedata.TotalRecord;
              this.loading = false;
              this.loadingscroll = false;
              this.loaderStatus=0;
              this.TotalNoOfClient = repsonsedata.TotalRecord;
              this.loaderStatus=1;
              this.applyFilterConfig();
            }else if (repsonsedata.HttpStatusCode === 204){
              this.data = null;
              this.gridListData=null;
              this.TotalNoOfClient = repsonsedata.TotalRecord;
              this.loading = false;
              this.loadingSearch = false;
              this.loadingscroll = false;
            }else if (repsonsedata.HttpStatusCode === 400){
              this.data = null
              this.gridListData=null;
              this.TotalNoOfClient = repsonsedata.TotalRecord;
              this.loading = false;
              this.loadingSearch = false;
              this.loadingscroll = false;

            }
            // if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            //   this.loading = false;
            // this.gridListData = repsonsedata.Data;
            // this.loaderStatus=1;
            // this.getFilterConfig();
            // }else {
            //   this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            //   this.loading = false;
            // }
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
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch=false;
          let colArrSelected=[];
          if(repsonsedata.Data!==null)
          {
            this.cache.setLocalStorage(this.GridId,JSON.stringify(repsonsedata.Data));
            this.colArr= repsonsedata.Data.GridConfig;
            this.filterConfig=repsonsedata.Data.FilterConfig;
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;
            if( this.filterConfig!==null)
            {
              this.filterCount=this.filterConfig.length;
            }else{
              this.filterCount=0;
            }
            if(repsonsedata.Data.GridConfig.length!=0)
            {
              colArrSelected=repsonsedata.Data.GridConfig.filter(x=>x.Selected==true);
            }
          if(colArrSelected.length!==0){
            //this.columns=colArrSelected;
            colArrSelected.sort(function (a, b) {
              return a.Order - b.Order;
            });
            this.columns = colArrSelected;
          }else{
            this.columns=this.colArr;
          }
          }
          // this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
        }else {
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
  @Name: openActionModalDialog function
  @Who: Nitin Bhati
  @When: 25-Oct-2021
  @Why: EWM-3272/3483
  @What: For opening action dialog box
   */

  openActionModalDialog(){
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        })
      };
      this.setConfiguration(gridConfig.columnsConfig);
    }
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      maxWidth: "750px",
      data: new Object({GridId: this.gridId_03}),
      panelClass: ['quick-modalbox', 'add_actiondialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     // this.columns=res.data;
      if(res!=false)
      {
        this.colArr = res.data;  //<!-----@suika@EWM-10650 @whn  @021-03-2023 to handle API url----->
        let selectedCol=[];
        selectedCol=res.data.filter(x=>x['Selected']==true);
        if(selectedCol.length!=0){
          selectedCol.sort(function(a, b) {
            return a.Order - b.Order;
        });
          this.columns=selectedCol;
        }else{
          this.columns=this.colArr;
        }
        this.getFilterConfig(); //@When: 13-07-2023 @who:Nitin Bhati @why: EWM-13108 @what: for calling function
      }


    })
  }


   /*
  @Type: File, <ts>
  @Name: getClientList function
  @Who: Nitin Bhati
  @When: 25-Oct-2021
  @Why: EWM-3272/3483
  @What: For getting the client list
   */

  getClientList(pagesize, pagneNo, sortingValue, searchVal,JobFilter){
    this.animate();
  //this.loading = true;
   if(this.loaderStatus===1){
      this.loading = false;
    }else{
      this.loading = true;
    }
  let jsonObj={};
  if(JobFilter!==null){
    jsonObj['ClientFilterParams']=this.filterConfig;
  }else{
    jsonObj['ClientFilterParams']=[];
  }
  jsonObj['FilterParams']=null;
  jsonObj['GridId']=this.GridId;
  jsonObj['search']=this.searchVal;
  jsonObj['PageSize'] = pagesize;
  jsonObj['IndustryId']=this.industryId;
  jsonObj['CountryId']=this.countryId;
  jsonObj['ParentClientId']=this.parentClinetId;
  jsonObj['ClientRMId']=this.clientRMId;
  jsonObj['page']=pagneNo;
  jsonObj['sort']=this.sortingValue;
  jsonObj['FolderId']=this.folderId;
  //Who:Ankit Rawat, What:EWM-16114 EWM-16203 Add Proximity Search, When:29Feb24
  jsonObj['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
  jsonObj['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
  jsonObj['Distance']=this.ProximitySearchResult?.Distance ?? 0;
  jsonObj['Unit']=this.ProximitySearchResult?.Unit;
  jsonObj['Address']=this.ProximitySearchResult?.Address;

  this._clientService.fetchClientlist(jsonObj).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loadingscroll = false;
        this.loading = false;
        this.loaderStatus=0;
      this.gridListData = repsonsedata.Data;
      this.data = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
      this.TotalNoOfClient = repsonsedata.TotalRecord;
      this.loading = false;
      this.TotalNoOfClient = repsonsedata.TotalRecord;
      this.TotalRecordgrid = repsonsedata.TotalRecord;
      this.FilterDataClearList = repsonsedata;
     this.gridListDataFilter= repsonsedata.Data;

      //this.kendoLoading=false;
      this.loadingSearch = false;
      if(this.gridColConfigStatus){
        this.fitColumns();
      }
    }else if (repsonsedata.HttpStatusCode === 204){
      this.data = null;
      this.gridListData=null;
      this.TotalNoOfClient = repsonsedata.TotalRecord;
      this.loading = false;
      this.loadingSearch = false;
      this.loadingscroll = false;
    }else if (repsonsedata.HttpStatusCode === 400){
      this.data = null
      this.gridListData=null;
      this.TotalNoOfClient = repsonsedata.TotalRecord;
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

   /*
  @Type: File, <ts>
  @Name: showTooltip function
  @Who: Nitin Bhati
  @When: 25-Oct-2021
  @Why: EWM-3272/3483
  @What: For showing tooltip in kendo

  @modify
  @Who: Adarsh Singh
  @When: 21-APRIL-2023
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
    @Name: sortChange function
    @Who: Nitin Bhati
    @When: 25-Oct-2021
    @Why: EWM-3272/3483
    @What: for sorting
  */
    // public sortChange($event): void {
    //   this.sortDirection = $event[0].dir;
    //   if (this.sortDirection == null ||this.sortDirection ==  undefined) {
    //     this.sortDirection = 'asc';
    //   } else {
    //     this.sortingValue =  $event[0].field + ',' + this.sortDirection;
    //   }
    //   this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
    // }

  //   public sortChange(sort: SortDescriptor[]): void {
  //     this.sort = sort;
  //     console.log('ggg',this.sort);

  //       if (this.sort[0].dir!=undefined || this.sort[0].dir!=null) {
  //     this.sortDirection= this.sort[0].dir;
  //   }else{
  //     this.sortDirection='asc';
  //   }
  //     this.sortingValue= this.sort[0].field + '-'+ this.sortDirection;
  //     console.log('ggg',this.sortingValue);

  //     this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
  // }

    /*
    @Type: File, <ts>
    @Name: pageChange function
    @Who: Nitin Bhati
    @When: 25-Oct-2021
    @Why: EWM-3272/3483
    @What: for Pagination data
  */
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData.length) {
    this.pagneNo = this.pagneNo + 1;
    this.fetchMoreRecord(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
    } else {
        this.loadingscroll = false;
      }
  }

    /*
    @Type: File, <ts>
    @Name: switchListMode function
    @Who: Nitin Bhati
    @When: 25-Oct-2021
    @Why: EWM-3272/3483
    @What: for swtiching list mode to cARD MODE OR VICE VERSA
  */
  switchListMode(viewMode){
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.animate();
     }else{
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.pagneNo=1;
       this.pagesize=50;
       this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
       this.animate();
     }
   }

   /*
    @Type: File, <ts>
    @Name: clearFilterData function
    @Who: Nitin Bhati
    @When: 25-Oct-2021
    @Why: EWM-3272/3483
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
        this.filterConfig=null;
      let JobFilter=[];
      this.loading = true;
      let jsonObjFilter={};
      this.state['take']=50;
      this.skip=0;
      jsonObjFilter['ClientFilterParams']=JobFilter;
      jsonObjFilter['GridId']=this.GridId;
      jsonObjFilter['search']=this.searchValue;
      jsonObjFilter['PageSize']=this.pagesize;
      jsonObjFilter['IndustryId']=this.industryId;
      jsonObjFilter['CountryId']=this.countryId;
      jsonObjFilter['ParentClientId']=this.parentClinetId;
      jsonObjFilter['ClientRMId']=this.clientRMId;
      jsonObjFilter['page']=this.pagneNo;
      jsonObjFilter['sort']=this.sortingValue;
      jsonObjFilter['FolderId']=this.folderId;
      this._clientService.fetchClientlist(jsonObjFilter).subscribe(
        (repsonsedata:ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.gridListData = repsonsedata.Data;
            this.data = {data:repsonsedata.Data,total:repsonsedata.TotalRecord};
            this.TotalNoOfClient = repsonsedata.TotalRecord;
            this.loading = false;
            this.loadingscroll = false;
            this.loaderStatus=0;
            this.TotalNoOfClient = repsonsedata.TotalRecord;
            //this.kendoLoading=false;
            this.loadingSearch = false;
            this.loaderStatus=1;
            // this.getFilterConfig();
            this.applyFilterConfig();
          }else if (repsonsedata.HttpStatusCode === 204){
            this.data = null;
            this.gridListData=null;
            this.TotalNoOfClient = repsonsedata.TotalRecord;
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;
            this.applyFilterConfig();
          }else if (repsonsedata.HttpStatusCode === 400){
            this.data = null
            this.gridListData=null;
            this.TotalNoOfClient = repsonsedata.TotalRecord;
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;

          }
          // if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          //   this.loading = false;
          // this.gridListData = repsonsedata.Data;

          // this.loaderStatus=1;
          // this.getFilterConfig();
          // }else {
          //   this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          //   this.loading = false;
          // }
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



/*
     @Type: File, <ts>
     @Name: openQuickCompanyModal
     @Who: Nitin Bhati
     @When: 25-Oct-2021
     @Why: EWM-3272/3483
     @What: For open client page
   */
    openQuickCompanyModal() {
      const message = `Are you sure you want to do this?`;
      const title = 'label_disabled';
      const subtitle = 'label_securitymfa';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this.dialog.open(QuickCompanyComponent, {
        // maxWidth: "1000px",
        // width: "90%",
        // maxHeight: "85%",
        panelClass: ['xeople-modal-lg', 'quickCompany','animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.getFilterConfig();
        }
      })
    }

    /*
     @Type: File, <ts>
     @Name: onIndustrychange
     @Who: Nitin Bhati
     @When: 25-Oct-2021
     @Why: EWM-3272/3483
     @What: when Industry drop down changes
   */
     onIndustrychange(data) {
      this.pagneNo=1;
       if(data!=undefined && data!=null && data!=''){
        this.industryId=data.Id;
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
       }else{
        this.industryId='00000000-0000-0000-0000-000000000000';
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
       }

       }

     /*
     @Type: File, <ts>
     @Name: onCountrychange
     @Who: Nitin Bhati
     @When: 25-Oct-2021
     @Why: EWM-3272/3483
     @What: when Country Name drop down changes
   */
     onCountrychange(data) {
      this.pagneNo=1;
      if (data === undefined) {
        this.countryId = 0;
      } else if (data === null) {
        this.countryId = 0;
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
     }
     else {
        this.countryId = data?.Id;
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
     }
    }
     /*
     @Type: File, <ts>
     @Name: onParentClientchange
     @Who: Nitin Bhati
     @When: 25-Oct-2021
     @Why: EWM-3272/3483
     @What: when Parent Client drop down changes
   */
     onParentClientchange(data) {
      this.pagneNo=1;
      if(data!=undefined && data!=null && data!=''){
        this.parentClinetId=data.ClientId;
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);

      }else{
        this.parentClinetId='00000000-0000-0000-0000-000000000000';
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);

      }

     }

     /*
     @Type: File, <ts>
     @Name: onClientRMchange
     @Who: Nitin Bhati
     @When: 25-Oct-2021
     @Why: EWM-3272/3483
     @What: when clientRM drop down changes
   */
     onClientRMchange(data) {
      this.pagneNo=1;
      if(data!=undefined && data!=null && data!=''){
        this.clientRMId=data.Id;
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
      }else{
        this.clientRMId='00000000-0000-0000-0000-000000000000';
        this.pagesize=this.state['take'];
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
      }
         }
   /*
     @Type: File, <ts>
     @Name: onFilter
     @Who: Nitin Bhati
     @When: 25-Oct-2021
     @Why: EWM-3272/3483
     @What: For search value
   */
     public onFilter(inputValue: string): void {
     // this.loading = false;
     this.searchVal=inputValue;
      if (inputValue.length > 0 && inputValue.length <= 2) {
        this.loadingSearch = false;
        return;
      }
       this.loaderStatus=1;
       this.pagneNo = 1;
       this.searchSubject$.next(inputValue);

    }

  /*
     @Type: File, <ts>
     @Name: onSearchFilterClear
     @Who: Nitin Bhati
     @When: 25-Oct-2021
     @Why: EWM-3272/3483
     @What: For clear Filter search value
   */
  public onSearchFilterClear(): void {
    this.loadingSearch = false;
    this.searchVal = '';
    // this.pagneNo=this.skip/this.pageSize + 1;
    this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal,this.filterConfig);
  }


   /*
  @Name: sortName function
  @Who: Nitin
  @When: 26-Oct-2021
  @Why: EWM-3483
  @What: For showing shortname on image icon
  */
  sortName(fisrtName) {

    if (fisrtName) {
      const Name = fisrtName;
      let charCount=Name.split(" ").length - 1;
      if(charCount>0){
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let last = ShortName1.slice(-1);
        let ShortName = first.concat(last.toString());
        return ShortName.toUpperCase();
      }else{
        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let first = ShortName1.slice(0, 1);
        let ShortName = first;
        return ShortName.toUpperCase();
      }

    }

  }

  /*
 @Type: File, <ts>
 @Name: fetchMoreRecord
 @Who: Nitin Bhati
 @When: 29-oct-2021
 @Why: EWM-3483
 @What: To get more data from server on page scroll.
 */

 fetchMoreRecord(pagesize, pagneNo, sortingValue, searchVal,JobFilter) {
  let jsonObj={};
  if(JobFilter!==null){
    jsonObj['ClientFilterParams']=this.filterConfig;
  }else{
    jsonObj['ClientFilterParams']=[];
  }
  jsonObj['GridId']=this.GridId;
  jsonObj['search']=this.searchVal;
  jsonObj['PageSize']=pagesize;
  jsonObj['IndustryId']=this.industryId;
  jsonObj['CountryId']=this.countryId;
  jsonObj['ParentClientId']=this.parentClinetId;
  jsonObj['ClientRMId']=this.clientRMId;
  jsonObj['page']=pagneNo;
  jsonObj['sort']=this.sortingValue;
  jsonObj['FolderId']=this.folderId;
  this._clientService.fetchClientlist(jsonObj).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loadingscroll = false;
        if (repsonsedata.Data) {
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          if(this.gridColConfigStatus){
            this.fitColumns();
          }
          this.gridListData = this.gridListData.concat(nextgridView);
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

  /*
 @Type: File, <ts>
 @Name: onScrollDown
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: To add data on page scroll.
 */
//  onScrollDown(ev?) {
//   this.loadingscroll = true;
//   if (this.canLoad) {
//     this.canLoad = false;
//     this.pendingLoad = false;
//     if (this.totalDataCount > this.gridListData.length) {
//       this.pageNumber = this.pageNumber + 1;
//       this.fetchMoreRecord(this.pagesize, this.pageNumber, this.sortingValue, this.searchValue,this.filterConfig);
//     }
//     else {
//       this.loadingscroll = false;
//     }
//   } else {
//     this.loadingscroll = false;
//     this.pendingLoad = true;
//   }
// }
onScrollDown(ev?) {
  this.loadingscroll = true;
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.TotalNoOfClient > this.gridListData?.length) {
      this.pageNumber = this.pageNumber + 1;
      this.fetchMoreRecord(this.pagesize, this.pageNumber, this.sortingValue, this.searchValue,this.filterConfig);
    }
    else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }

}
//@who:priti;@when:30-nov-2021;@why:EWM-3939;@what:add button for download data
downloadCSV()
{
      this.loading=true;
  let jsonObj={};
  jsonObj['ClientFilterParams']=this.filterConfig==null?[]:this.filterConfig;
  jsonObj['GridId']=this.GridId;
  jsonObj['search']=this.searchVal;
  jsonObj['PageSize']=this.state.take;
  jsonObj['IndustryId']=this.industryId;
  jsonObj['CountryId']=this.countryId;
  jsonObj['ParentClientId']=this.parentClinetId;
  jsonObj['ClientRMId']=this.clientRMId;
  // if (this.state?.sort[0]?.dir!=undefined || this.state?.sort[0]?.dir!=null) {
  //   this.sortDirection=this.state?.sort[0]?.dir;
  // }else{
  //   this.sortDirection='asc';
  // }
  // this.sortingValue= this.state?.sort[0]?.field + '-'+ this.sortDirection;
  this.pagneNo=this.state.skip/this.state.take + 1;
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
    //@who:priti;@when:30-nov-2021;@why:EWM-3939;@what:add button for download data
    private downloadFile(data,filename) {
      const downloadedFile = new Blob([data], { type: data.type });
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.download = filename;
      a.href = URL.createObjectURL(downloadedFile);
      a.target = '_blank';
      a.click();
      document.body.removeChild(a);
  }

// refresh button onclick method by Adarsh Singh
  refreshComponent(){
    this.pagneNo= 1;
    // this.pagneNo=this.skip/this.pageSize + 1;
    this.state['take']=50
    this.skip=0;
    this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
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


 /*
 @Type: File, <ts>
 @Name: openNewEmailModal function
 @Who: Suika
 @When:24-July-2023
 @Why: EWM-13288 EWM-13179
 @What: opening new mail
 */
openNewEmailModal(responseData: any, mailRespondType: string, email: string) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(NewEmailComponent, {
    maxWidth: "750px",
    width: "95%",
    height: "100%",
    maxHeight: "100%",
    data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'),'candidateMail': email,'workflowId': this.workflowId,openDocumentPopUpFor:'Candidate',isBulkEmail:false },
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
   @Who: Suika
   @When:24-July-2023
   @Why: EWM-13288 EWM-13179
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
  this.getClientList(take, this.pagneNo, this.sortingValue,this.searchVal,this.filterConfig);
}

   // who:maneesh,what:ewm-15699 for local search when:11/01/2023
   public gridViewlistClearData: GridDataResult;
   public filterChange(filter: CompositeFilterDescriptor): void {
     this.filter = filter;
     if(this.filter?.filters?.length==0){
     this.gridViewlistClearData = {
       data: this.FilterDataClearList.Data,
       total: this.FilterDataClearList.TotalRecord
     };
     this.data=this.gridViewlistClearData;
     this.TotalNoOfClient = this.FilterDataClearList.TotalRecord;
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

   public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
      if (this.sort[0].dir!=undefined || this.sort[0].dir!=null) {
      this.sortDirection= this.sort[0].dir;
  }else{
    this.sortDirection='asc';
  }
    this.sortingValue= this.sort[0].field + '-'+ this.sortDirection;
    this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
}
//get folder list functnionality start,who:maneesh,what:ewm-15817,when:29/01/2023 getClientFolderListAll
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
        this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);

      }else if( res.cancel==true){
        this.folderId =null;
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
  this.folderId =null;
  this.folderName='';
  // this.filterConfig = null;
  this.getClientList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,this.filterConfig);
}
//get folder list functnionality start,who:maneesh,what:ewm-15817,when:29/01/2023

/*  @Name: selectedCallback  @Who: Renu @When: 21-11-2023  @Why: EWM-15174 EWM-15186 @What: get all checkbox event */
public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;

/* @Who: Renu @When: 21-11-2023  @Why: EWM-15174 EWM-15186  @What: to get value on checkbox selection */
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
  @Who: Amit Rajput
  @When: 29-Feb-2024
  @Why: EWM-16185
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
      if(res.Action.toUpperCase()=='SEARCH') {
        this.setProximityData().then(() => {
          setTimeout(() => {
            this.sortingValue='Proximity-asc';
            this.sort[0].field='Proximity';
            this.sort[0].dir='asc';
            this.getProximityData().then(() => {
            });
          }, 1000);        
        });
      }
    }
    else  {
      this.IsProximitySearch=false;
    }
  })
}

//Who:Ankit Rawat, What:EWM-16114-EWM-16203 cleared Proximity search, When:01March24 -->
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
        //this.gridProxmityProcess(this.ProximitySearchResult);
        this.setProximityData().then(() => {
          setTimeout(() => {
            this.sortingValue='ClientName-asc';
            this.sort[0].field='ClientName';
            this.sort[0].dir='asc';
            this.getProximityData(this.ProximitySearchResult).then(() => {
            });
          }, 1000);    
        });
      }
    });
  }

setProximityData() {
  return new Promise<void>((resolve) => {
      this.setProximityConfiguration();
      resolve(); 
  });
}


getProximityData(proximityData:any=null) {
  return new Promise<void>((resolve) => {
    this.getFilterConfig(proximityData);
      resolve(); 
  });
}
  

  //Who:Ankit Rawat, What:EWM-16114-EWM-16203 call configuration api to set proximity column while proximity is apply, When:01March24
  setProximityConfiguration(){
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        })
      };
      this.setConfiguration(gridConfig.columnsConfig,false);
    }
  }

  // who:Renu,why: EWM-19410 EWM-19551 what: FOR OPENING FORM TO SHARE CLIENT,when:12/02/2025
  openEOHShareClientPopUp(clientInfo:any){
     if(clientInfo?.EOHClientId !==null && clientInfo?.EOHClientId !==''){
        const message = clientInfo?.ClientName +' '+this.translateService.instant('label_ShareClientEOHAlreadyPush')+clientInfo?.EOHClientId;
        const title = ''
        const subTitle = '';
        const dialogData = new ConfirmDialogModel(title, subTitle, message);
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          maxWidth: "350px",
          data: {dialogData, isButtonShow: true},
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        }else{
         
     const message = ``;
      const title = 'label_shareClientEOH';
      const subtitle = '';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this.dialog.open(ShareClientEohComponent, {
        data: new Object({'ClientName':clientInfo?.ClientName,'clientId':clientInfo?.ClientId,dialogData: dialogData}),
        panelClass: ['xeople-modal', 'share-client-eoh', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    }
       // RTL Code
       let dir: string;
       dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
       let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
       for (let i = 0; i < classList.length; i++) {
         classList[i].setAttribute('dir', this.dirctionalLang);
       }
  }

  redirectOnMarketPlace(){
    this.route.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode))
  }
  

}

