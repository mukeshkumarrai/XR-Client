/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 10-Aug-2021
  @Why: EWM-2020 EWM-2363
  @What:  This page will be use for candidate landing page list Component ts file
*/

import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult, SelectableSettings} from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../EWM.core/shared/services/candidates/candidate.service';
import { JobService } from '../../EWM.core/shared/services/Job/job.service';
import { CandidateFolderComponent } from '../candidate-folder/candidate-folder.component';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { ManageCandidateFolderComponent } from '../candidate-folder/manage-candidate-folder/manage-candidate-folder.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ActionDialogComponent } from '../../EWM.core/job/landingpage/action-dialog/action-dialog.component';
import { customDropdownConfig } from '../../EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SystemSettingService } from '../../EWM.core/shared/services/system-setting/system-setting.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { FilterDialogComponent } from '../../EWM.core/job/landingpage/filter-dialog/filter-dialog.component';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models/index'
import {  Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { FilterService } from 'src/app/shared/services/commonservice/Filterservice.service';
import { NewEmailComponent } from '../../EWM.core/shared/quick-modal/new-email/new-email.component';
import { MatSidenav } from '@angular/material/sidenav';
import { State } from '@progress/kendo-data-query';
import { JobSMSComponent } from '../../EWM.core/job/job/job-sms/job-sms.component';
import { MailServiceService } from '@app/shared/services/email-service/mail-service.service';
import { CandidateBulkEmailComponent } from './candidate-bulk-email/candidate-bulk-email.component';
import { BulkSmsComponent } from '@app/modules/EWM.core/job/job/job-sms/bulk-sms/bulk-sms.component';
import { CandidateBulkSmsComponent } from './candidate-bulk-sms/candidate-bulk-sms.component';
import { ProximitySearchComponent } from 'src/app/shared/popups/proximity-search/proximity-search.component';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';
import { CommonServiesService } from '@app/shared/services/common-servies.service';
import { AlertDialogComponent } from '@app/shared/modal/alert-dialog/alert-dialog.component';
import { PushcandidateToEohFromPopupComponent } from '@app/modules/xeople-job/job-screening/pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class CandidateListComponent implements OnInit,OnDestroy  {

  /***********************global variables decalaration**************************/
  public ActiveMenu: any;
  public loading: boolean;
  public pagesize;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public skip = 0;
  public sort: any[] = [{
    field: 'Name',
    dir: 'asc'
  }];

  public GridId: string = 'CandidateLanding_grid_001';
  public sortingValue: string = "";
  public searchValue: string = "";
  public gridListData: any = [];
  public columns: ColumnSetting[] = [];
  public columnsWithAction: any[] = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  public workflowList: any = [];
  public workflowId: string;
  public filterCount: number = 0;
  public colArr: any = [];
  public tempID: any;
  public stagesList: any = [];

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
  @ViewChild(GridComponent)
  public grid: GridComponent;
  public totalDataCount: number;
  public listData: any = [];
  public totalDataCountFolder: number;
  public folderId: any = 0;
  public folderName: any;

  public dropDoneConfigCountry: customDropdownConfig[] = [];
  public dropDoneConfigParentClient: customDropdownConfig[] = [];
  public dropDoneConfigClientRM: customDropdownConfig[] = [];
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public searchVal: string = '';
  public loadingSearch: boolean;
  public statusList: any = [];
  public loader: boolean = false;
  statusId = '00000000-0000-0000-0000-000000000000';
  designationId = '';
  loaderStatus: number;
  ProfileImagePreviewURL = "/assets/user.svg";
  scrolledValue: any;
  animationVar: any;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  // animate and scroll page size
  zoomPhoneCallRegistrationCode:string;
  zoomCheckStatus:boolean= false;
  public userType='CAND';
  searchSubject$ = new Subject<any>();
  JobId: string;
  filter: any;
  dirctionalLang: string;
  dateFormatKendo: string;
  IsEmailConnected: number;
  toEmailList: any;
  @ViewChild('advancedsearch') public advancedsearchDrawer: MatSidenav;
  resetFormSubjectParentClient: Subject<any> = new Subject<any>();
  designationList=[];
  folderList = [];
  public othersParam: any[]=[];
  statusCode: string;
  private destroySubject: Subject<void> = new Subject();
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [];
  public initialstate: State = {
    skip: 0,
    take: 50,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'Name',
      dir: 'asc'
    }],
  };
  public state: State;
  burstSMSRegistrationCode: string;
  isSMSStatus: boolean;
  candidateId: string;
  SMSHistory:any=[];
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  isSmsHistoryForm: boolean = false;
  smsHistoryToggel: boolean;
  quickFilterToggel: boolean;
  candidateDetails: any;
  /***@Who:Renu @when: 21-11-2023 @Why:EWM-15174 EWM-15186****/
  selectableSettings:SelectableSettings = {
    checkboxOnly: true
  }
  public selectedCandidate: any = [];
  public multipleEmail:boolean = false;
  getCandidateData:any = [];
  getAllEmailIdFormMappedJob:any = [];
  SMSCheckStatus: boolean = false;
  clearcache:string='';
  public selestedFolder:any=[];
//Who:Ankit Rawat, What:EWM-16158 EWM-16310 Add Proximity Search, When:29Feb24
 public IsProximitySearch: boolean=false;
 public ProximitySearchResult = {
   Latitude: 0,
   Longitude: 0,
   Distance:0,
   Unit:'KM',
   Address:'',
   //@When: 11-03-2024 @who:Amit @why: EWM-16399 @what: label changes
   Source:this.translateService.instant('label_ProxmitySearch_SearchCandidates') +' "Location" '+this.translateService.instant('label_ProxmitySearch_WithinTheSpecifiedRange')
 }
 //Who:Ankit Rawat, What:EWM-16158 Proximity sorting on page init, When:07March24
  public isOnInit: boolean=false;
  public contactPhone:number;
  eohRegistrationCode: string;
  public IsEOHIntergrated: boolean=false;
  extractEnableCanCheck: number=0;
  IsXRCandidatePushedToEOH: number;
  referenceApplicantid: string;
  brandAppSetting: any=[];
  EOHLogo: any;
  constructor(private routes: ActivatedRoute,private route: Router,public dialog: MatDialog,private candidateService:CandidateService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService,public filterQueryService:FilterService,
    public _userpreferencesService: UserpreferencesService, private jobService: JobService, public _sidebarService: SidebarService,
    public _CandidateFolderService: CandidateFolderService, private commonserviceService: CommonserviceService, private serviceListClass: ServiceListClass, public systemSettingService: SystemSettingService,
    private ngZone: NgZone, private mailService: MailServiceService,private cache : CacheServiceService,private commonServiesService: CommonServiesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    this.sizes = this.appSettingsService.pageSizeOptions;
     this.zoomPhoneCallRegistrationCode = this.appSettingsService.zoomPhoneCallRegistrationCode;
    this.pagesize = this.appSettingsService.pagesize;
    this.initialstate.take=this.pagesize;
    this.burstSMSRegistrationCode = this.appSettingsService.burstSMSRegistrationCode;
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;

  }

  ngOnInit(): void {
    const filteredBrands = this.brandAppSetting?.filter(brand => brand?.EOH === 'Entire OnHire');
    this.EOHLogo=filteredBrands[0]?.logo;

    this.isOnInit=true;
    /*--@Who:Nitin Bhati,@When:20-07-2023 @Why: EWM-13434--*/
   this.dateFormatKendo = localStorage.getItem('DateFormat');
    this.animationVar = ButtonTypes;
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable.next('1');
    // <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

    this.state = { ...this.initialstate }
    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //

     this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
     this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.routes.queryParams.subscribe((parmsValue) => {
      if (parmsValue.workflowId!=null || parmsValue.workflowId!=undefined) { /*********@When:24-08-2023 @Who:renu @Why: EWM-13666 EWM-13956 */
        this.filter = parmsValue?.filter;
        this.JobId = parmsValue?.JobId;
        this.workflowId = parmsValue?.workflowId;
      }
    });


    this.getFilterConfig();
    this.commonserviceService.OrgSelectIdObs.pipe(
      takeUntil(this.destroySubject)
    ).subscribe(value => {
      if (value!==null) {
        this.reloadApiBasedOnorg();
      }
    })

     // @suika @EWM-13670 Whn 03-08-2023
   let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let zoomCallIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.zoomPhoneCallRegistrationCode);
     this.zoomCheckStatus =  zoomCallIntegrationObj[0]?.Connected;

       // SMS
  let smsIntegrationObj = otherIntegrations?.filter(res=>res.RegistrationCode==this.burstSMSRegistrationCode);
  this.SMSCheckStatus =  smsIntegrationObj[0]?.Connected;

    let EOHIntegrationSubscribe = JSON.parse(localStorage.getItem('EOHIntegration'));
    let eohRegistrationCode=otherIntegrations?.filter(res=>res?.RegistrationCode==this.eohRegistrationCode);
    this.IsEOHIntergrated =  eohRegistrationCode[0]?.Connected;
    this.extractEnableCanCheck= EOHIntegrationSubscribe?.candExtractEnable;

    this.switchListMode(this.viewMode);

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
    this.sendRequest(this.state);

       });
       this._sidebarService.searchEnable.next('1');
    //Entire Software : Bantee Kumar : 22-Sep-2023 : getIntegrationCheckSMSstatus EWM-14292

    this.getIntegrationCheckSMSstatus();
  }

/*
  @Type: File, <ts>
  @Name: ngOnDestroy function
  @Who: Adarsh singh
  @When: 13-April-2023
  @Why: EWM-11885
  @What: for saving configuation while user navigate on another page
*/
  ngOnDestroy(){
    const columns = this.grid?.columns || this.OldGridData;
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

    this.destroySubject.next();

  }

  /*
@Type: File, <ts>
@Name: switchListMode function
@Who: Nitin Bhati
@When: 25-Oct-2021
@Why: EWM-3272/3483
@What: for swtiching list mode to cARD MODE OR VICE VERSA
*/
  switchListMode(viewMode) {
    this.OldGridData = this.grid?.columns;
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
    }
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



  /*
 @Type: File, <ts>
 @Name: setConfiguration function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: For saving the setting config WITH WIdth of columns
  */

  setConfiguration(columnsConfig, isLoad=true) {
    let gridConf = {};
    let tempArr: any[] = this.colArr;
    columnsConfig?.forEach(x => {
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
    gridConf['filterConfig'] = this.filterConfig;
    //Who:Ankit Rawat, What:EWM-16158 EWM-16310 set proximity data, When:04March24
    gridConf['Latitude']=this.ProximitySearchResult?.Latitude ?? 0;
    gridConf['Longitude']=this.ProximitySearchResult?.Longitude ?? 0;
    gridConf['Distance']=this.ProximitySearchResult?.Distance ?? 0;
    gridConf['Address']=this.ProximitySearchResult?.Address;
    this.jobService.setfilterConfig(gridConf).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.cache.setLocalStorage(this.GridId,JSON.stringify(repsonsedata.Data));
          if(isLoad) this.loading = false;
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        } else {
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          if(isLoad) this.loading = false;
        }
      }, err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
 /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Renu
  @When: 10-Aug-2021
  @Why: ROST-2363
  @What: For get filter config data
  */

  gridColConfigStatus:boolean=false;
  getFilterConfig(proximityData:any=null){
     this.loading=true;
     this.jobService.getfilterConfig(this.GridId).pipe(
      takeUntil(this.destroySubject)
    ).subscribe(
       (repsonsedata:ResponceData) => {
         if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
           this.loading = false;
           let colArrSelected=[];
           if(repsonsedata.Data!==null)
           {
             //Who:Ankit Rawat, What:EWM-16158 EWM-16310 retain Proximity, When:04March24
             if(proximityData!=null){
              this.ProximitySearchResult.Latitude=proximityData?.Latitude ?? 0;
              this.ProximitySearchResult.Longitude=proximityData?.Longitude ?? 0;
              this.ProximitySearchResult.Address=proximityData?.Address;
              this.ProximitySearchResult.Distance=proximityData?.Distance;
            }
            else{
            this.ProximitySearchResult.Latitude=repsonsedata.Data?.Latitude ?? 0;
            this.ProximitySearchResult.Longitude=repsonsedata.Data?.Longitude ?? 0;
            this.ProximitySearchResult.Address=repsonsedata.Data?.Address;
            this.ProximitySearchResult.Distance=repsonsedata.Data?.Distance;
            }
             if(this.ProximitySearchResult.Latitude!=0 && this.ProximitySearchResult.Longitude!=0 && this.ProximitySearchResult.Address){
               this.IsProximitySearch=true;
             }
             else this.IsProximitySearch=false;

             this.gridColConfigStatus=repsonsedata.Data.IsDefault;
             this.colArr= repsonsedata.Data.GridConfig;
             let proximityObject:any = this.colArr.find(obj => obj.Field === 'Proximity');
             if (proximityObject) {
               proximityObject.Selected = this.IsProximitySearch;
             }
             /*--@Who:Ankit Rawat,@When:07March24 @Why: EWM-16114,@what:Applied proximity sorting if proximity flag is ON--*/
            if(this.isOnInit){
              if(this.IsProximitySearch) {
                this.state.sort[0].field='Proximity';
                this.state.sort[0].dir = 'asc';

                this.sort[0].field='Proximity';
                this.sort[0].dir='asc';
              }
            }
            else{
              if(this.IsProximitySearch==false){
                this.state.sort[0].field='Name';
                this.state.sort[0].dir = 'asc';
                this.sort[0].field='Name';
                this.sort[0].dir='asc';
              }
            }
             this.isOnInit=false;
             this.filterConfig=repsonsedata.Data.FilterConfig;
             if( this.filterConfig!==null)
             {
               this.filterCount=this.filterConfig?.length;
             }else{
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
          //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

    this.sendRequest(this.state);


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
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
 @What: For opening filter  dialog box
  */

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.loading = true;
        this.filterCount = res.data?.length;
        let filterParamArr = [];
        let value:string;
        let filterParamConfig = [];
        let key:string;
        res.data?.forEach(element => {
          if(element?.DropDwonName){
            key=this.colArr.filter(x=>x.Field==element.filterParam?.Field)[0]?.APIKey;
            value =  element.DropDwonName?.map((item: any) => {
            return item[key]?.toString();
          }).join(",");
          }else if(element.filterParam?.Type=='Date'){
            const formattedDate = new Date(element.ParamValue).toISOString();
            value=formattedDate;
          }else{
          value=element.ParamValue;
        }

        filterParamConfig.push({
          'FilterValue': element.ParamValue,
          'ColumnName': element.filterParam.Field,
          'ColumnType': element.filterParam.Type,
          'ValueName':value,
          'FilterOption': element.condition,
          'FilterCondition': 'AND'
        })
          filterParamArr.push({
            'FilterValue':value,
            'ColumnName': element.filterParam.Field,
            'ColumnType': element.filterParam.Type,
            'FilterOption': element.condition,
            'FilterCondition': 'AND',
            'ValueName':value,
          })
        });

        this.loading = true;

        this.state.skip=0;
         /*******@when: 10-08-2023  @WHo: Renu @WHY: EWM-13079 EWM-13734**********/
    this.filterConfig=filterParamConfig;
     this.othersParam=[];
     this.othersParam.push({
      StatusId:this.statusCode?this.statusCode:'',
      FolderId:this.folderName?this.folderName:'',
      Designation: this.designationId?this.designationId:'',
      WorkflowStageId:this.workflowId?this.workflowId:'',
      JobId:this.JobId?this.JobId:'',
      GridId:this.GridId,
      PageSize:this.pagesize,
      Page:this.pagneNo,
      //Who:Ankit Rawat, What:EWM-16158 EWM-16310 Retain Proximity value, When:05March24 -->
      Latitude:this.ProximitySearchResult?.Latitude ?? 0,
      Longitude:this.ProximitySearchResult?.Longitude ?? 0,
      Distance: this.ProximitySearchResult?.Distance ?? 0,
      Unit: this.ProximitySearchResult?.Unit
    });
    this.createConfiguration();
          //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

    let queryString=this.filterQueryService.FilterQueryString( filterParamArr,this.searchVal,this.sortingValue,this.othersParam);
        this.candidateService.getCandidatelist(this.state,queryString).subscribe(
          (repsonsedata: GridDataResult) => {

              this.loading = false;
              this.gridListData = repsonsedata.data;
              this.data=repsonsedata;
              this.loaderStatus = 1;
              this.getFilteredConfig();
               this.totalDataCount = repsonsedata.total;

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
      for (let i = 0; i < classList?.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }

          //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

  public onDataStateChange(state: DataStateChangeEvent): void {
    this.selectedCandidate=[];
    this.state = state;
    this.sendRequest(state);
    /*--@Who:Satya Prakash Gupta,@When:04-Aug-2023 @Why: EWM-13432 : remove this function (this.fitColumns()) column filter issue--*/
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

     /*******@when: 10-08-2023  @WHo: Renu @WHY: EWM-13079 EWM-13734**********/
     this.othersParam=[];
     this.othersParam.push({
      StatusId: this.statusCode?this.statusCode:'',
      FolderId:this.folderName?this.folderName:'',
      Designation: this.designationId?this.designationId:'',
      WorkflowStageId:this.workflowId?this.workflowId:'',
      JobId:this.JobId?this.JobId:'',
      GridId:this.GridId,

       //Who:Ankit Rawat, What:EWM-16158 EWM-16310 Retain Proximity value, When:05March24 -->
       Latitude:this.ProximitySearchResult?.Latitude ?? 0,
       Longitude:this.ProximitySearchResult?.Longitude ?? 0,
       Distance: this.ProximitySearchResult?.Distance ?? 0,
       Unit: this.ProximitySearchResult?.Unit
    });
 
    let queryString=this.filterQueryService.FilterQueryString(this.filterConfig !== null?this.filterConfig:[],this.searchVal,this.sortingValue,this.othersParam);
    if(this.clearcache!=''){
      queryString=queryString+this.clearcache
    }
    this.candidateService.getCandidatelist(state,queryString).pipe(takeUntil(this.destroySubject)).subscribe(
      (repsonsedata: GridDataResult) => {
       this.clearcache='';
      this.data = repsonsedata;
      this.gridListData=repsonsedata.data;
      this.totalDataCount = repsonsedata.total;
      this.loading = false;
      this.loadingSearch = false;
      this.loaderStatus = 0;
      this.selectedCandidate=[];
      if(this.gridColConfigStatus){
        this.fitColumns();
      }

    })
    }


/* @Name: createConfiguration function  @Who: Renu @When: 11-Aug-2021 @Why: ROST-13079 EWM-13760 @What: FOR saving filter data */
OldGridData:any;
createConfiguration(isLoad:boolean=true) {
    const columns = this.grid?.columns || this.OldGridData;
    if (columns) {
      const gridConfig = {
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            ?.filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig,isLoad);
  }
}

  /*
 @Type: File, <ts>
 @Name: showTooltip function
 @Who: Renu
 @When: 10-Aug-2021
 @Why: ROST-2363
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
  @Name: fetchStatusMoreRecord
  @Who: Renu
  @When: 17-May-2021
  @Why: EWM-1538
  @What: To get more data from server on page scroll.
  */

  fetchMoreRecord(pagesize, pagneNo, sortingValue, searchVal, JobFilter) {

       /*******@when: 10-08-2023  @WHo: Renu @WHY: EWM-13079 EWM-13734**********/
     this.state.skip= this.state.skip + this.state.take;
     this.othersParam=[];
     this.othersParam.push({
      StatusId:this.statusCode?this.statusCode:'',
      FolderId:this.folderName?this.folderName:'',
      Designation: this.designationId?this.designationId:'',
      WorkflowStageId:this.workflowId?this.workflowId:'',
      JobId:this.JobId?this.JobId:'',
      GridId:this.GridId,
      //Who:Ankit Rawat, What:EWM-16158 EWM-16310 Retain Proximity value, When:05March24 -->
      Latitude:this.ProximitySearchResult?.Latitude ?? 0,
      Longitude:this.ProximitySearchResult?.Longitude ?? 0,
      Distance: this.ProximitySearchResult?.Distance ?? 0,
      Unit: this.ProximitySearchResult?.Unit
    });
    let queryString=this.filterQueryService.FilterQueryString(JobFilter !== null?this.filterConfig:[],searchVal,sortingValue,this.othersParam);
    this.candidateService.getCandidatelist(this.state,queryString).subscribe(
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

  /*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who: Renu
   @When: 10-Aug-2021
   @Why: ROST-2363
   @What: FOR DIALOG BOX confirmation
 */

  clearFilterData(): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_candidate';
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
        let CandidateFilterParams = [];
        this.loading = true;
        /*******@when: 10-08-2023  @WHo: Renu @WHY: EWM-13079 EWM-13734**********/
     this.othersParam=[];
     this.othersParam.push({
      StatusId:this.statusCode?this.statusCode:'',
      FolderId:this.folderName?this.folderName:'',
      Designation: this.designationId?this.designationId:'',
      WorkflowStageId:this.workflowId?this.workflowId:'',
      JobId:this.JobId?this.JobId:'',
      GridId:this.GridId,
      //Who:Ankit Rawat, What:EWM-16158 EWM-16310 Retain Proximity value, When:05March24 -->
      Latitude:this.ProximitySearchResult?.Latitude ?? 0,
      Longitude:this.ProximitySearchResult?.Longitude ?? 0,
      Distance: this.ProximitySearchResult?.Distance ?? 0,
      Unit: this.ProximitySearchResult?.Unit
    });
    this.createConfiguration();
          //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

    let queryString=this.filterQueryService.FilterQueryString(CandidateFilterParams,this.searchVal,this.sortingValue,this.othersParam);
        this.candidateService.getCandidatelist(this.state,queryString).subscribe(
          (repsonsedata: GridDataResult) => {

              this.loading = false;
              this.data = repsonsedata;
              this.gridListData=repsonsedata.data
              this.loaderStatus = 1;
              this.folderId = 0;
              this.folderName = null;
              this.totalDataCount=repsonsedata?.total
              this.getFilteredConfig();

          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })

      }
    });
  }

  clearFolderData(): void {
    this.folderId = 0;
    this.folderName='';
    this.filterConfig = null;
    this.sendRequest(this.state);

  }



  /*
    @Type: File, <ts>
    @Name: openQuickFolderModal
    @Who: Nitin Bhati
    @When: 18-Aug-2021
    @Why: EWM-2495
    @What: to open quick add Candidate Folder modal dialog
  */
    getFolderListAll() {
       this._CandidateFolderService.getFolderListAll(this.userType).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.folderList = repsonsedata.Data;
            this.totalDataCountFolder = repsonsedata['TotalRecord'];
            if(this.totalDataCountFolder!=undefined){
             this.openQuickFolderModal();
            }
          } else {
            this.loading = false;
           }
        }, err => {
           this.loading = false;
        })
    }

    /*
      @Type: File, <ts>
      @Name: openQuickFolderModal
      @Who: Nitin Bhati
      @When: 18-Aug-2021
      @Why: EWM-2495
      @What: to open quick add Candidate Folder modal dialog
    */
      openQuickFolderModal() {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_folderName';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        if (this.totalDataCountFolder > 0){
          const dialogRef = this.dialog.open(CandidateFolderComponent, {
            data: new Object({totalDataCountFolder:this.totalDataCountFolder,userType:this.userType,folderList:this.folderList,selestedFolder:this.selestedFolder}),
            panelClass: ['xeople-modal-lg', 'add_folder', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(res => {
            this.state.skip=0;
            //  @Who: maneesh ,@When: 28-june-2023, @Why: EWM-10461  ,What:when cancel popup then api not calling -->
              if (res.data!=0 && res.data!=undefined) {
            this.folderId=res?.data;
            this.selestedFolder=res?.data;
            this.folderName=res.name;
            this.sendRequest(this.state);
              }else if(this.selestedFolder=='') {
            this.folderId=0;
              }
           })
        }else{
          const dialogRef = this.dialog.open(ManageCandidateFolderComponent, {
            data: new Object({editId: '0',activityStatus:'Add',totalDataCountFolder:this.totalDataCountFolder,userType:this.userType}),
            panelClass: ['xeople-modal', 'add_folderManage', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(res => {
            this.state.skip=0;

            this.sendRequest(this.state);

           })
        }
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

  reloadApiBasedOnorg() {
    this.getFilterConfig();
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
 @Name: openActionModalDialog function
 @Who: Nitin Bhati
 @When: 27-Oct-2021
 @Why: EWM-3436/3504
 @What: For opening action dialog box
 */
  openActionModalDialog() {
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            ?.filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr) => ({...acc, ...{[curr]: item[curr]}}), <ColumnSettings> {});
        }),
      };
    }
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      maxWidth: "750px",
      data: new Object({ GridId: this.GridId }),
      panelClass: ['quick-modalbox', 'add_actiondialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
        if(res!=false)
        {
          this.colArr = res.data; //<!-----@suika@EWM-10650 @whn  @021-03-2023 to handle API url----->
          let selectedCol=[];
          selectedCol=res.data?.filter(x=>x['Selected']==true);
          if(selectedCol?.length!=0){
            selectedCol?.sort(function(a, b) {
              return a.Order - b.Order;
          });
            this.columns=selectedCol;

            this.columnsWithAction =  this.columns;
            this.columnsWithAction.splice(0,0,{
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
          }else{
            this.columns=this.colArr;

            this.columnsWithAction =  this.columns;
            this.columnsWithAction.splice(0,0,{
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
          this.getFilterConfig(); //@When: 13-07-2023 @who:Nitin Bhati @why: EWM-13108 @what: for calling function
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
   @Name: onFilter
   @Who: Nitin Bhati
   @When: 27-Oct-2021
   @Why: EWM-3436/3504
   @What: For search value
 */
  public onFilter(inputValue: string): void {
    this.searchVal = inputValue;
    if (inputValue?.length > 0 && inputValue?.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.loaderStatus = 1;
    this.state.skip=0;
    this.searchSubject$.next(inputValue);
  }

  /*
 @Type: File, <ts>
 @Name: onSearchFilterClear
 @Who: Nitin Bhati
 @When: 27-Oct-2021
 @Why: EWM-3436/3504
 @What: For clear Filter search value
*/
  public onSearchFilterClear(): void {
    this.loadingSearch = false;
    this.searchVal = '';
    this.loaderStatus = 0;
    this.sendRequest(this.state);

  }


  /*
    @Type: File, <ts>
    @Name: openQuickCandidateModal
    @Who: Satya Prakash
    @When: 08-Apr-2022
    @Why: EWM-5654 EWM-5887
    @What: make full screen modal
  */
  openQuickCandidateModal() {
    this.route.navigate(['/client/cand/candidate/create-candidate'])
  }

  /*
    @Type: File, <ts>
    @Name: getStatusGroupCode
    @Who: Nitin Bhati
    @When: 28-Oct-2021
    @Why: EWM-3504
    @What: To get Data from status
    */
  getStatusGroupCode() {
    let UserType = 'CAND'
    this.systemSettingService.getStatusUserType(UserType).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loader = false;
          this.statusList = repsonsedata.Data[0].statuses;
        } else {
          this.loader = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.loader = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: redirect
  @Who: Nitin Bhati
  @When: 28-Oct-2021
  @Why: EWM-3504
  @What: To redirect
  */
  redirect() {
    let manageurl = './client/core/administrators/group-master/status?groupId=e26277ba-3a40-4e42-825a-ed5198219d01';
    window.open(manageurl, '_blank');
  }
  /*
    @Who: Renu
    @When: 21-Aug-2021
    @Why: EWM-2447
    @What: to compare objects selected
  */
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1['Id'] === c2['Id'] : c1 === c2;
  }

  /*
   @Type: File, <ts>
   @Name: onStatuschange
   @Who: Nitin Bhati
   @When: 28-Oct-2021
   @Why: EWM-3436/3504
   @What: when Status drop down changes
 */
  onStatuschange(data) {
    this.state.skip=0;
    // this.pagneNo=1;
    if (data != undefined && data != null && data != '') {
      this.statusId = data?.Id;
      this.statusCode=data?.Code;
    this.sendRequest(this.state);

    } else {
      this.statusId = '00000000-0000-0000-0000-000000000000';
      this.statusCode='';
    this.sendRequest(this.state);

    }

  }

  /*
   @Type: File, <ts>
   @Name: onDesignationchange
   @Who: Nitin Bhati
   @When: 28-Oct-2021
   @Why: EWM-3436/3504
   @What: when Designation drop down changes
 */
  onDesignationchange(data) {
    if (data != undefined && data != null && data != '') {
      this.designationId = data.Id;
    this.sendRequest(this.state);

    } else {
      this.designationId = '';
    this.sendRequest(this.state);

    }

  }
  /*
       @Type: File, <ts>
       @Name: onDesignationchange
       @Who: Nitin Bhati
       @When: 28-Oct-2021
       @Why: EWM-3436/3504
       @What: when Designation drop down changes
     */
  getUpdateOptions() {
    this.loader = true;
    this.getStatusGroupCode();
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
      let charCount = Name.split(" ")?.length - 1;
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

  /**
   @(C): Entire Software
   @Type: Function
   @Who: Nitin Bhati
   @When: 28-Oct-2021
   @Why:  Open for modal window
   @What: This function responsible to open and close the modal window.
   @Return: None
   @Params :
   1. param -button name so we can check it come from which link.
  */
  imagePreview(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '220px',
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated', 'animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /*
@Type: File, <ts>
@Name: onScrollDown
@Who: Nitin Bhati
@When: 17-Sep-2021
@Why: EWM-2859
@What: To add data on page scroll.
*/
//<!-- @Who:Bantee Kumar ,@When: 19-April-2023, @Why: EWM-11962 ,What: Search is not working as expected when next page is loaded -->
  onScrollDown(ev?) {
    this.loadingscroll = true;

      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridListData?.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchMoreRecord(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal, this.filterConfig);
      }
      else {
        this.loadingscroll = false;
      }

  }

  // refresh button onclick method by Adarsh Singh
  refreshComponent() {
    this.clearcache='&clearcache=1';
    this.state = { ...this.initialstate }
          //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

    this.sendRequest(this.state);

  }





  public fitColumns(): void {
      this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this.grid.autoFitColumns();
      });
  }
      /*
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 14-07-2023
  @Why: EWM-13117
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
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
    data: { 'res': responseData, 'mailRespondType': mailRespondType, 'openType': localStorage.getItem('emailConnection'),'candidateMail': email,'workflowId': this.workflowId, 'JobId': this.JobId ,openDocumentPopUpFor:'Candidate',isBulkEmail:false,
    RelatedToInternalCode:'CAND' },
    panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult) {
      this.state.skip=0;
      this.sortingValue = '';
      this.searchValue = '';
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


 /*
 @Type: File, <ts>
 @Name: toggleDrwer function
 @Who: Suika
 @When: 01-August-2023
 @Why: EWM-13542
 @What: toggle assign search drawer
 */
toggleDrwer(start) {
  if(this.statusList?.length==0 ) {
    this.getStatusGroupCode();
  }
    // page option from config file
    if(this.designationList?.length==0){
    this.dropDoneConfigParentClient['IsDisabled'] = false;
    this.dropDoneConfigParentClient['apiEndPoint'] = this.serviceListClass.getCanDesignationList + '?designationFor=CAND'; /*  @Who: Bantee Kumar @When: 16-May-2023 @Why: EWM-12344 EWM-12453*/
    this.dropDoneConfigParentClient['placeholder'] = 'label_candidateListCurrentPosition';
    this.dropDoneConfigParentClient['searchEnable'] = true;
    this.dropDoneConfigParentClient['IsManage'] = '';
    this.dropDoneConfigParentClient['bindLabel'] = 'PositionName';
    this.dropDoneConfigParentClient['IsRequired'] = false;
    this.dropDoneConfigParentClient['clearable'] = true;
    this.resetFormSubjectParentClient.next(this.dropDoneConfigParentClient);
    }
    start.toggle();
}

 /*
 @Type: File, <ts>
 @Name: closeDrawer function
 @Who: Suika
 @When: 01-August-2023
 @Why: EWM-13542
 @What: toggle assign search drawer
 */
closeDrawer(end){
  end.toggle();
}


onDataload(e){
  this.designationList = e;
}


 /*
 @Type: File, <ts>
 @Name: getFilteredConfig function
 @Who: Suika
 @When: 01-August-2023
 @Why: EWM-13542
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
           if( this.filterConfig!==null)
           {
             this.filterCount=this.filterConfig?.length;
           }else{
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
       }else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         this.loading = false;
       }
     }, err => {
       this.loading = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     })
 }

    //Entire Software : Bantee Kumar : 22-Sep-2023 : getIntegrationCheckSMSstatus EWM-14292

 getIntegrationCheckSMSstatus() {
  this.systemSettingService.getIntegrationCheckstatus(this.burstSMSRegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        if (repsonsedata.Data) {
          this.isSMSStatus = repsonsedata.Data?.Connected;
        }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

    //Entire Software : Bantee Kumar : 22-Sep-2023 : smsHistoryDetails EWM-14292

smsHistoryDetails(can) {  
  this.contactPhone=can?.PhoneNumber; //who:maneesh as discuss with ankit rajput sir this line use for send sms btn enabel and disable
  this.candidateId = can?.CandidateId;
  this.getSMSHistory();
  this.smsHistoryToggel = true;
  this.quickFilterToggel=false;
  setTimeout(() => {
    this.openDrawer(can);
  }, 1000);

}


    //Entire Software : Bantee Kumar : 22-Sep-2023 : openDrawer  EWM-14292

openDrawer(can){
  setTimeout(() => {
    if(this.SMSHistory.length>0){
      this.smsHistoryDrawer.open();
      this.isSmsHistoryForm = true;
      this.candidateId = can.CandidateId;
       this.candidateDetails = can;
    }else{
      this.openJobSMSForCandidate(can)
    }
  }, 1500);
}

    //Entire Software : Bantee Kumar : 22-Sep-2023 : openJobSMSForCandidate EWM-14292

openJobSMSForCandidate(dataItem) {
  // who:maneesh,what:for fixed send sms parameter key ,when:11/03/2024
  let dataItemObj = {};
  dataItemObj['PhoneNumber'] = dataItem?.PhoneNumber;
  dataItemObj['Name'] = dataItem?.Name;
  dataItemObj['CandidateId'] = dataItem?.CandidateId;
  dataItemObj['PhoneCode'] = dataItem?.PhoneCode;
  dataItem=dataItemObj;
  const dialogRef = this.dialog.open(JobSMSComponent, {
    data: new Object({ jobdetailsData: dataItem,pageName:'candSMS',UserType:this.userType}),
    panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      this.getSMSHistory();
    }
    this.loading = false;
    this.smsHistoryToggel = false;
    this.quickFilterToggel=true;
  })

  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

}

    //Entire Software : Bantee Kumar : 22-Sep-2023 : getSMSHistory EWM-14292

getSMSHistory() {
  this.loading = true;
  let userType='CAND';
  this.systemSettingService.getSMSHistory('?Id='+this.candidateId+'&UserType='+this.userType).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.SMSHistory = repsonsedata.Data;
        this.loading = false;
      }else if(repsonsedata.HttpStatusCode === 204){
        this.SMSHistory = [];
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    })

}

    //Entire Software : Bantee Kumar : 22-Sep-2023 : toggleDrawer EWM-14292

toggleDrawer(start: any) {
  localStorage.removeItem('selectEmailTemp');//who:maneesh,what:ewm-15173 for clear value;
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
  start.toggle();
}

    //Entire Software : Bantee Kumar : 22-Sep-2023 : fetchDataFromSMSHistory EWM-14292

fetchDataFromSMSHistory(event){
  if(event){
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
    this.smsHistoryDrawer.close();
  }
}

/*  @Name: selectedCallback  @Who: Renu @When: 21-11-2023  @Why: EWM-15174 EWM-15186 @What: get all checkbox event */
public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;

/* @Who: Renu @When: 21-11-2023  @Why: EWM-15174 EWM-15186  @What: to get value on checkbox selection */
selectionChange(event:any){
  if(event?.length==1){
    this.selectedCandidate=event;
  }else{
   this.selectedCandidate=[];
  }
}
/* @Who: Renu @When: 21-11-2023  @Why: EWM-15174 EWM-15186  @What: for opening popup */
onBulkEmail(){

  this.toEmailList =  this.selectedCandidate.map(({ Email }) => ({ EmailId: Email }));
  this.loading = false;
  this.getAllEmailIdFromMappedJob(this.selectedCandidate);
  this.openMail(this.selectedCandidate, this.IsEmailConnected, true);
 }
 /***********  @Name: getAllEmailIdFromMappedJob @Who: Renu @When: 21-Nov-2021 @Why:EWM-15174 EWM-15186 @What:check mail is connected or not ***********/
 confirmMailSync(): void {
  this.mailService.getUserIsEmailConnected().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        if (data.Data.IsEmailConnected == 1) {
          this.IsEmailConnected = 1;
        } else {
          this.IsEmailConnected = 0;
        }
      } else {
       // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    }, err => {
      this.loading = false;
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })

}
 /***********  @Name: getAllEmailIdFromMappedJob @Who: Renu @When: 21-Nov-2021 @Why:EWM-15174 EWM-15186 @What: get all email from which candidate mapped from Job ***********/
getAllEmailIdFromMappedJob(data){
   let arr = data;
   this.getAllEmailIdFormMappedJob = data?.map(function (el: { Email: any; }) { return el.Email; });
   this.getCandidateData = [];
   arr?.forEach(element => {
     this.getCandidateData.push({
      "ModuleType": "CAND",
      "Id": element?.CandidateId,
      "EmailTo": element?.Email
     })
   });
  this.getCandidateData.filter((value , index) =>{
    data.indexOf(value) === index
  })
}
/***********  @Name: openMail @Who: Renu @When: 21-Nov-2021 @Why:EWM-15174 EWM-15186 @What: To open Mail ***********/
 openMail(responseData: any, IsEmailConnected: number, isBulkEmail:boolean) {
  let subObj = {}
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(CandidateBulkEmailComponent, {
    maxWidth: "750px",
    width: "95%",
    height: "100%",
    maxHeight: "100%",
    data: { 'candidateres': responseData, 'IsEmailConnected': IsEmailConnected, 'workflowId': this.workflowId, 'JobId': this.JobId,
     'isBulkEmail': isBulkEmail,'toEmailList':this.toEmailList,'candiateDetails': this.getCandidateData,
     openDocumentPopUpFor:'Candidate',multipleEmail: this.multipleEmail,
    isDefaultSubj: true, subjectObj: subObj,candidateEmail:true},
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
  @Name: getBulkSmsFlag
  @Who:  Nitin Bhati
  @When: 01 Dec 2023
  @Why: EWM-15214,EWM-15247
  @What: to open template modal dialog
*/
getBulkSmsFlag(){
  if(!this.isSMSStatus && this.selectedCandidate==null ||this.selectedCandidate==undefined || this.selectedCandidate?.length==0){
    return true;
  }else{
    let checkStage = this.selectedCandidate != null && this.selectedCandidate?.filter(t => t.PhoneNumber != "");
    if(!this.isSMSStatus || checkStage?.length>0){
      return false;
    }{
      return true;
    }
  }
}
/*
  @Type: File, <ts>
  @Name: openJobBulkSMSForCandidate
  @Who:  Nitin Bhati
  @When: 01 Dec 2023
  @Why: EWM-15214,EWM-15247
  @What: to open template modal dialog
*/
openJobBulkSMSForCandidate() {
  // <!---------@When: 03-07-2023 @who:Adarsh singh @why: EWM-12937 @modify for EWM-14637 on 09-10-2023--------->
 this.commonMarkAsRead(this.selectedCandidate);
 //  End
 const dialogRef = this.dialog.open(CandidateBulkSmsComponent,{
   data: new Object({JobId:this.JobId,JobName:this.JobId,selectedCandidates:this.selectedCandidate,UserType:'CAND'}),
   panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
   disableClose: true,
 });
 dialogRef.afterClosed().subscribe(res => {
  this.selectedCandidate=[];
   if (res != true) {
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
  @Name: commonMarkAsRead
  @Who:  Nitin Bhati
  @When: 01 Dec 2023
  @Why: EWM-15214,EWM-15247
  @What: to open template modal dialog
*/
// <!---------@When: 09-10-2023 @who:Adarsh singh @why: EWM-14638 @Desc- make a common function for mark as read-------->
commonMarkAsRead(cand) {
  let candArrs: any = [];
  if (cand?.length > 0) {
    cand?.forEach(element => {
      let candDiv: any = document.querySelector(".candidateInfoPanel_" + element.CandidateId);
      if (candDiv?.classList.contains("unread")) {
        candDiv?.classList.remove("unread");
        element.IsProfileRead = 1;
        candArrs.push(element.CandidateId)
      }
    });
    if (candArrs?.length > 0) {
      this.commonserviceService.candidateProfileReadUnread(candArrs, this.JobId);
    }
  }
}


/*
  @Type: File, <ts>
  @Name: openProximitySearchDialog function
  @Who: Ankit Rawat
  @When: 04-March-2024
  @Why: EWM-16158 EWM-16310
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
              this.state.sort[0].field='Proximity';
              this.state.sort[0].dir = 'asc';
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
  
  //Who:Ankit Rawat, What:EWM-16158 EWM-16310 cleared Proximity search, When:04March24 -->
    onClearProximitySearch(): void {
      const message = `label_confirmDialog_Proximity`;
      const title = '';
      const subTitle = 'label_candidate';
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
              this.state.sort[0].field='Name';
              this.state.sort[0].dir = 'asc';
              this.sort[0].field='Name';
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
        this.createConfiguration(false);
        resolve(); 
      });
    }
    
    
    getProximityData(proximityData:any=null) {
      return new Promise<void>((resolve) => {
        this.getFilterConfig(proximityData);
          resolve(); 
      });
    }
    pushCandidateToEOH(dataItem:any){
      let slCand = dataItem;
      let ApplicantMemberPublishedStatus=slCand?.EOHId?.substring(0, 3)?.toLowerCase();
      if(slCand?.EOHId?.substring(0, 3).toLowerCase()==='mbr' && slCand?.EOHId!=null && slCand?.EOHId !==''){
      const message = this.translateService.instant('label_pushCandidateToEoh_alreadyconfirmMsg1')+slCand?.Name+this.translateService.instant('label_pushCandidateToEohMember_alreadyconfirmMsg2')+slCand?.EOHId;
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
        const dialogRef = this.dialog.open(PushcandidateToEohFromPopupComponent, {
          data: new Object({candidateId:slCand?.CandidateId,IsOpenFor:'popUp',candidateName:slCand?.Name,PublishedStatus: ApplicantMemberPublishedStatus}),
          panelClass: ['xeople-modal', 'push-candidate-to-eoh-modal', 'animate__animated', 'animate__zoomIn'],
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
