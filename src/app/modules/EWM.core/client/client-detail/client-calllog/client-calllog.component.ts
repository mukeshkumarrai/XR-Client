import { Component, Input, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonFilterDiologComponent } from '@app/modules/EWM.core/job/landingpage/common-filter-diolog/common-filter-diolog.component';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ClientService } from '@app/modules/EWM.core/shared/services/client/client.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from '@app/shared/models';
import { ColumnSettings } from '@app/shared/models/column-settings.interface';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { CommonFilterdilogService } from '@app/shared/services/common-filterdilog.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { CompositeFilterDescriptor, filterBy, SortDescriptor, State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { FilterService } from 'src/app/shared/services/commonservice/Filterservice.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonAddCallLogComponent } from '@app/modules/EWM.core/client/client-detail/common-add-call-log/common-add-call-log.component';
import { Router } from '@angular/router';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { DeleteConfirmationComponent } from '@app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { DateFilterActivityComponent } from '@app/modules/EWM-Employee/employee-detail/employee-activity/date-filter-activity/date-filter-activity.component';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { VxtAddCallLogComponent } from '@app/modules/EWM-Candidate/candidate-list/vxt-add-call-log/vxt-add-call-log.component';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}
@Component({
  selector: 'app-client-calllog',
  templateUrl: './client-calllog.component.html',
  styleUrls: ['./client-calllog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClientCalllogComponent implements OnInit {
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
  public folderName: any;
  public statusList: any = [];
  public userTypeList: any;
  mobileQueryClick: MediaQueryList;
  mobileQuery: MediaQueryList;
  desktopQueryOver: MediaQueryList;
  public gridViewlistFilter: GridDataResult;
  public gridViewlist: GridDataResult;
  // public data: GridDataResult = { data: [], total: 0 };
  // public sizes = [50, 100, 200];
  GridId = "CallHistoryClientGrid_001";
  // public state: State = { skip: 0, take: 50 };
  pagneNo: number
  public expandedDetailKeys: number[] = [1];
  public expandDetailsBy: any;
  @Input() ClientSortName: string;
  @Input() candidateName: string;
  @Input() candidateData: string;
  @Input() candidateId: string;
  @Input() ShortName: string;
  @Input() ImageUrl: string;
  @Input() StatusColorCode: string;
  public ActiveMenu: any;
  public _sidebarService: SidebarService;
  getCallLogData: any = [];
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [];
  public initialstate: State = {
    skip: 0,
    take: 50,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'Date',
      dir: 'desc'
    }],
  };
  public state: State;
  public startOfCurrentWeek: any;
  loadingSearch: boolean;
  searchValue: any = '';
  searchSubject$ = new Subject<any>();
  isFilter: boolean = false;
  public filterAlert: any = 0;
  public quickFilterStatus: number = 0;
  public filterConfig: any;
  loading: boolean;
  filterCount: number;
  dirctionalLang;
  animationVar: any;
  public colArr: any = [];
  gridColConfigStatus: boolean = false;
  public columnsWithAction: any[] = [];
  public columns: ColumnSetting[] = [];
  gridListData: any[] = [];
  loaderStatus: number;
  clearcache: string = '';
  public searchVal: string = '';
  private destroySubject: Subject<void> = new Subject();
  public sortingValue: string = "";

  public pageNumber: number = 1;
  public othersParam: any[] = [];
  public gridData: any[] = [];
  public gridListDataFilter: [] = [];

  public filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
  pageSize: number;
  FilterDataClearList: any = [];
  event: any;
  private ngZone: NgZone;
  animationState = false;
  PatchFromDate: string;
  PatchToDate: string;
  public filterCountDate: any = 0;
  public ToDate: any;
  public FromDate: any;
  public pagesize;
  public skip = 0;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public isReadMore: any[] = [false];
  contactSummery = '/client/cont/contacts/contact-detail';
  jobSummery = '/client/jobs/job/job-detail/detail';
  clientSummery = '/client/core/clients/list/client-detail'
  candidateSummery = '/client/cand/candidate/candidate'
  fromSummery = '/client/emp/employees/employee-detail'
  detailsSummery = '/client/emp/employees/employee-detail'
  tONameRedirectUrl: string;
  fromRedirectUrl: string;
  detailsSummeryUrl: string = 'null';
  usertype: string='CLIE'
  PhoneNumber:number;
  @Input() clientId:string;
  @Input() clientIdData:string;
  clientIdForVxt:string;
  public emailId:string;
  public currentuserUserId:string;
  @Input() clientType:string;
  @Input() candidatePhone:string;
  public ProfileImagePath: string;
  vxtRegistrationCode: string;
  public vxtCheckStatus: boolean = false;
  constructor(public dialog: MatDialog, private clientService: ClientService, private jobService: JobService,
    private CommonFilterdilogsrvs: CommonFilterdilogService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService, public filterQueryService: FilterService,
    private candidateService: CandidateService, media: MediaMatcher, private route: Router,private commonserviceService: CommonserviceService,
  ) {  
    this.currentuserUserId=JSON.parse(localStorage.getItem('currentUser'))?.UserId;
    this.pagesize = this.appSettingsService.pagesize;
    this.initialstate.take=this.pagesize;
    this.sizes = this.appSettingsService.pageSizeOptions;
    this.mobileQuery = media.matchMedia('(max-width: 900px)');;
    this.mobileQueryClick = media.matchMedia('(max-width: 1024px)');
    this.desktopQueryOver = media.matchMedia('(min-width: 1024px)');
    this.getCallLogData = JSON.parse(localStorage.getItem('ClientCallLogDatass'))            
    this.candidateName = this.getCallLogData?.ClientDetails?.ClientName
    this.candidateId = this.getCallLogData?.ClientDetails?.ClientId;
    this.StatusColorCode = this.getCallLogData?.ClientDetails?.ShortNameColor;
    this.ShortName = this.getCallLogData?.ClientDetails?.ShortName;
    this.ImageUrl = this.getCallLogData?.ImageUrl;
    this.PhoneNumber = this.getCallLogData?.ClientDetails?.PhoneNumber;
    this.emailId=this.getCallLogData?.ClientDetails?.EmailId;
    this.ProfileImagePath = this.getCallLogData?.CandidateImage;
    this.vxtRegistrationCode = this.appSettingsService.vxtRagistrationCode;
    if (this.clientIdData!=undefined) {
      this.clientIdForVxt=this.clientIdData;
    }else{
      this.clientIdForVxt=this.clientId;
    }

  }

  ngOnInit(): void {
    this.state = { ...this.initialstate }
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService?.searchEnable.next('1');
    this.getFilteredConfig();
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.searchValue = val;
      this.state = { ...this.initialstate };
      this.sendRequest(this.state);
    });
    this.startOfCurrentWeek = this.getStartOfCurrentWeek();
    this.commonserviceService.onClientSelectId.subscribe(value => {  // add api calling when change client dropdown ewm-18382 when:30/10/2024
      if (value !== null) {
       this.candidateId = value;
       this.getFilteredConfig();
      }
    })
    // @Tajuddiin Baksh @EWM-19387 Whn 06-03-2024
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let vxtIntegrationObj = otherIntegrations?.filter(res => res.RegistrationCode == this.vxtRegistrationCode);
    this.vxtCheckStatus = vxtIntegrationObj[0]?.Connected;
  }
  public onFilter(inputValue: string): void {
    this.isFilter = true;

    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.loaderStatus = 1; 
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue);
  }

  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.sendRequest(this.state);
  }


  public onDataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.sendRequest(state);
  }
  refresh() {
    this.sendRequest(this.state);
  }

  openFilterModalDialog() {
    // who;maneesh,what:ewm-11422 groupName:'people' fixed groupid for employee section when filter  ,when:27/06/2023
    const dialogRef = this.dialog.open(CommonFilterDiologComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId, groupName:'people' }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {      
      if (res != false && res != 'false') {
        this.loading = true;
        this.filterCount = res.data.length;
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
        this.loading = true;
       
        this.state.skip = 0;
        this.filterConfig = filterParamArr;
        this.othersParam = [];
        this.othersParam.push({
          UserType: this.usertype,
          Id: this.candidateId,
          search: '',
          ByPassPaging: true,
          Filter: '',
          OrderBy: '',
          HaveOrderBy: true,
          FromDate: this.FromDate ? this.FromDate : '',
          ToDate: this.ToDate ? this.ToDate : ''
        });
        this.createConfiguration();
        let queryString = this.filterQueryService.VxtFilterQueryString(filterParamArr !== null?filterParamArr:[], this.searchValue, this.sortingValue, this.othersParam);
        if (this.clearcache != '') {
          queryString = queryString + this.clearcache
        }
        this.candidateService.getCandidatelistCallDetails(this.state, queryString).pipe(takeUntil(this.destroySubject)).subscribe(
          (repsonsedata: GridDataResult) => {
            this.clearcache = '';
            this.data = repsonsedata;
            this.gridListData = repsonsedata.data;

            this.totalDataCount = repsonsedata.total;
            this.loading = false;
            this.loadingSearch = false;
            this.loaderStatus = 0;
            // this.getFilteredConfig();
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
  clearFilterDates(): void {
    const message = 'label_clearFilterCallLog';//label_confirmDialogJob removed 
    const title = '';//Call remove from title
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      // this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        this.filterCountDate = 0;
        this.loading = false;
        this.FromDate = '';
        this.ToDate = '';
        this.createConfiguration();
        this.sendRequest(this.state)

      }
      this.loading = false;

    });
  }
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
          setTimeout(() => {
            this.getLocalStorageData();
            this.setLocalStorageData('commonFilterDataStore', repsonsedata.Data);
          }, 100)
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }
  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId)?.classList?.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId)?.classList?.remove(animationName)
  }
  clearFilterData(viewMode): void {
    const message = `label_clearFilterCallLog`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      // this.result = dialogResult;
      if (dialogResult == true) {
        this.filterConfig = [];
        let JobFilter = [];
        this.loading = true;
        this.filterCount = 0;
        // this.filterCountDate = 1;
        this.loading = false;
        this.createConfiguration();
        this.sendRequest(this.state)

      }
      this.loading = false;

    });
  }

  getFilteredConfig() {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.gridColConfigStatus = repsonsedata.Data.IsDefault;
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig?.length;
            } else {
              this.filterCount = 0;
            }
            if (repsonsedata.Data.GridConfig?.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig?.filter(x => x.Selected == true);
            }
            if (colArrSelected?.length !== 0) {
              colArrSelected?.sort(function (a, b) {
                return a.Order - b.Order;
              });
              this.columns = colArrSelected;
              this.columns?.sort((a, b) => {
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
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  // Function to get the current config data from localStorage
  getLocalStorageData() {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
    const data = this.CommonFilterdilogsrvs.getLocalStorage('commonFilterDataStore');
    return data ? JSON.parse(data) : {};
  }

  // Function to save config data to localStorage
  setLocalStorageData(key, data) {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
    this.CommonFilterdilogsrvs.setLocalStorage(key, JSON.stringify(data));
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
    this.othersParam = [];
    this.othersParam.push({
      UserType: this.usertype,
      Id: this.candidateId,
      search: '',
      ByPassPaging: true,
      Filter: '',
      OrderBy: '',
      HaveOrderBy: true,
      FromDate: this.FromDate ? this.FromDate : '',
      ToDate: this.ToDate ? this.ToDate : ''
    });
    let queryString = this.filterQueryService.VxtFilterQueryString(this.filterConfig !== null ? this.filterConfig : [], this.searchValue, this.sortingValue, this.othersParam);
    if (this.clearcache != '') {
      queryString = queryString + this.clearcache
    }
    this.loading=false;
    this.candidateService.getCandidatelistCallDetails(state, queryString).pipe(takeUntil(this.destroySubject)).subscribe(
      (repsonsedata: GridDataResult) => {
        this.clearcache = '';
        this.data = repsonsedata;
        this.gridListData = repsonsedata.data;
        this.loading=false;
        this.totalDataCount = repsonsedata.total;
        this.loading = false;
        this.loadingSearch = false;
        this.loaderStatus = 0;
        if(this.gridColConfigStatus){
          this.fitColumns();
        }
      })
  }
  expandDetails() {
    this.gridListData?.forEach(element => {
      return element?.callId;
    });

  }

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


  public fitColumns(): void {
    this.ngZone?.onStable?.asObservable().pipe(take(1)).subscribe(() => {
      this.grid.autoFitColumns();
    });
  }

  public pageChangess(event: PageChangeEvent): void {
    this.event = event;
    this.state['take'] = event.take
    this.state['skip'] = event.skip
    // this.sendRequest(this.state);
  }
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    if (this.filter?.filters?.length == 0) {
      this.data = this.FilterDataClearList;
      this.totalDataCount = this.FilterDataClearList?.total;
    } else {
      this.loadData();
    }
  }

  public loadData(): void {
    this.gridData = filterBy(this.gridListDataFilter, this.filter);
    this.gridViewlist = {
      data: this.gridData,
      total: this.gridData?.length
    };
    this.data = this.gridViewlist;
    this.totalDataCount = this.gridViewlist?.total;
  }
  createConfiguration() {
    const columns = this.grid.columns;
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            ?.filter(propName => !propName.toLowerCase()
              .includes('template'))
            .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
        }),
      };
      this.setConfiguration(gridConfig.columnsConfig);
    }
  }

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
  // who:maneesh,what:ewm-17969 for kendo paging, when:20/09/2024

  public pageChanges({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.state['take'] = take;
    this.pagesize = this.state.take;
    if (skip == 0) {
      this.pagneNo = 1;
    } else {
      this.pagneNo = this.skip / this.pagesize + 1;
    }
    this.sendRequest(this.state)
  }

  // who:maneesh,what:ewm-17969 for date filter popup, when:20/09/2024


  // who:maneesh,what:ewm-17969 for add call log popup, when:20/09/2024
  openDateFilterDialog() {
    sessionStorage.setItem('Call','true');
    const dialogRef = this.dialog.open(DateFilterActivityComponent, {
      // data: dialogData,
      panelClass: ['xeople-modal-sm', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data: { CallData: true,CallDatefilterPop:true },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.FromDate = result.FromDate;
      this.ToDate = result.ToDate;
      if (this.FromDate && this.ToDate) {
        this.filterCountDate = 1;
        var element = document.getElementById("filter-date");
        element?.classList.add("active");
      }

      this.sendRequest(this.state)
    });
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
  OpenDocuemntPopUp(add) {
    const dialogRef = this.dialog.open(CommonAddCallLogComponent, {
      data: new Object({
        ShortName: this.ShortName, Name: this.candidateName, Id: this.candidateId, StatusColorCode: this.StatusColorCode,
        ImageUrl: this.ImageUrl, usertype: "CLIE", isEdit: add, gridlistData: this.gridListData,
        ToNameredirectUrl: this.tONameRedirectUrl,reletedUserTypeCodeValue:'Client',reletedUserTypeCode:'CLIE',
        FromNameredirectUrl: this.fromRedirectUrl, detailsSummeryUrl: this.detailsSummeryUrl,PhoneNumber:this.PhoneNumber,EmailId:this.emailId,
        clientType:this.clientType}),
      panelClass: ['xeople-modal', 'add-calllog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.filterConfig = [];
        this.loading = true;
        this.getFilteredConfig();
        // this.sendRequest(this.state)
        this.commonserviceService.countDataRefreshForContact.next({clientCall:true,clientId:this.candidateId});
      }
    });
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

  // who:maneesh,what:ewm-17969 for update call log popup, when:20/09/2024

  openEditCallPopup(dataItem) {
    const dialogRef = this.dialog.open(CommonAddCallLogComponent, {
      data: new Object({
        ShortName: this.ShortName, Name: this.candidateName, Id: this.candidateId, StatusColorCode: this.StatusColorCode,
        ImageUrl: this.ImageUrl, dataItem: dataItem, callId: dataItem?.callId, isEdit: 'Edit', usertype: "CLIE",
        reletedUserTypeCodeValue:'Client',reletedUserTypeCode:'CLIE',PhoneNumber:this.PhoneNumber,EmailId:this.emailId,
        clientType:this.clientType}),
      panelClass: ['xeople-modal', 'add-calllog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.filterConfig = [];
        // let JobFilter = [];
        this.loading = true;
        this.getFilteredConfig();
        // this.sendRequest(this.state);

      }
    });
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

  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }
  // who:maneesh,what:ewm-17969 for delete, when:20/09/2024

  deleteQualification(CallId): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'Call histroy';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let ContactsObj = {};
    ContactsObj['CallId'] = CallId;
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.candidateService.candidateVxtDeleteCall(CallId).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.searchValue = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.sendRequest(this.state);
              this.commonserviceService.countDataRefreshForContact.next({clientCall:true,clientId:this.candidateId});

            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
    // this._rtlService.onModalRTLHandler();
  }

  private getStartOfCurrentWeek(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.getTime();
  }

  viewJobSummery(type, Id, relatedTo){
    localStorage.setItem('redirectContactId',Id);
    window.open(relatedTo, '_blank');
  }
  ngOnDestroy(){
    localStorage.removeItem('redirectContactId')
  }
  // viewJobSummery(type, Id, relatedTo) {
  //   let tenantData = JSON.parse(localStorage.getItem('currentUser'));
  //   let currentUserId = tenantData?.UserId;
  //   if (relatedTo == 'Candidate') {
  //     this.usertype = 'CAND'
  //   } else if (relatedTo == 'Job') {
  //     this.usertype = 'Job'

  //   } else if (relatedTo == 'Client') {
  //     this.usertype = 'CLIE'

  //   } else if (relatedTo == 'Contact') {
  //     this.usertype = 'CONT'

  //   }
  //   if (type == 'ToName') {
  //     const baseUrl = window.location.origin;
  //     if (relatedTo == 'CLIE') {
  //       this.detailsSummery = '/tenant/client/core/clients/list/client-detail';
  //       // client/core/clients/list/client-detail?clientId=1fea7a5f-a3b9-421b-879d-45aa84e0e28f
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?clientId=" + Id;
  //       window.open(this.detailsSummeryUrl, '_blank');

  //     } else if (relatedTo == 'CAND') {
  //       if (Id==currentUserId) {
  //         this.detailsSummery = '/tenant/client/emp/employees/employee-detail';
         
  //         this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?CandidateId=" + Id + "&employeeType=" + "EMPL";
  //         window.open(this.detailsSummeryUrl, '_blank');  
  //       }else{
  //         this.detailsSummery = '/tenant/client/cand/candidate/candidate';
  //         this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?CandidateId=" + Id + "&Type=" + relatedTo;
  //         window.open(this.detailsSummeryUrl, '_blank');
  //       }
 

  //     }
  //     else if (relatedTo == 'JOB') {
  //       // jobs/job/job-list/list/90fc2d08-7e37-4e7f-a3db-f986c5f91f2f?filter=TotalActiveJobs
  //       this.detailsSummery = '/tenant/client/jobs/job/job-list/list/';
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery +Id + "?filter=" + 'TotalActiveJobs';
  //       window.open(this.detailsSummeryUrl, '_blank');
  //     }
  //     else if (relatedTo == 'CONT') {
  //       // http://localhost:4200/tenant/client/cont/contacts/contact-detail?ContactId=466&ContactIdString=6771c9ea-7d3a-47ca-bf9e-35023fd46528&ContactName=aaaaaaaaaaaaaaaaaabbbbbccccccm%20jhgjhghjhjgj&ShortName=AJ
  //       // jobs/job/job-list/list/90fc2d08-7e37-4e7f-a3db-f986c5f91f2f?filter=TotalActiveJobs
  //       this.detailsSummery = '/tenant/client/cont/contacts/contact-detail?ContactId';
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery +Id;
  //       window.open(this.detailsSummeryUrl, '_blank');
  //     }
  //   } else if (type == 'FromName' ) {
  //     const baseUrl = window.location.origin;
  //     if (relatedTo == 'CLIE') {
  //       this.detailsSummery = '/tenant/client/core/clients/list/client-detail';
  //       // client/core/clients/list/client-detail?clientId=1fea7a5f-a3b9-421b-879d-45aa84e0e28f
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?clientId=" + Id;
  //       window.open(this.detailsSummeryUrl, '_blank');

  //     } else if (relatedTo == 'CAND') {
  //       if (Id==currentUserId) {
  //         this.detailsSummery = '/tenant/client/emp/employees/employee-detail';
         
  //         this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?CandidateId=" + Id + "&employeeType=" + "EMPL";
  //         window.open(this.detailsSummeryUrl, '_blank');  
  //       }else{
  //         this.detailsSummery = '/tenant/client/cand/candidate/candidate';
  //         this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?CandidateId=" + Id + "&Type=" + relatedTo;
  //         window.open(this.detailsSummeryUrl, '_blank');
  //       }

  //     }
  //     else if (relatedTo == 'JOB') {
  //       // jobs/job/job-list/list/90fc2d08-7e37-4e7f-a3db-f986c5f91f2f?filter=TotalActiveJobs
  //       this.detailsSummery = '/tenant/client/jobs/job/job-list/list/';
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery +Id + "?filter=" + 'TotalActiveJobs';
  //       window.open(this.detailsSummeryUrl, '_blank');
  //     }
  //     else if (relatedTo == 'CONT') {
  //       // http://localhost:4200/tenant/client/cont/contacts/contact-detail?ContactId=466&ContactIdString=6771c9ea-7d3a-47ca-bf9e-35023fd46528&ContactName=aaaaaaaaaaaaaaaaaabbbbbccccccm%20jhgjhghjhjgj&ShortName=AJ
  //       // jobs/job/job-list/list/90fc2d08-7e37-4e7f-a3db-f986c5f91f2f?filter=TotalActiveJobs
  //       this.detailsSummery = '/tenant/client/cont/contacts/contact-detail?ContactId';
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery +Id;
  //       window.open(this.detailsSummeryUrl, '_blank');
  //     }
  //   }
  //   else if (type == 'DetailsName') {
  //     const baseUrl = window.location.origin;
  //     // const router = RouterData.jobSummery;
  //     if (relatedTo == 'CLIE') {
  //       this.detailsSummery = '/tenant/client/core/clients/list/client-detail';
  //       // client/core/clients/list/client-detail?clientId=1fea7a5f-a3b9-421b-879d-45aa84e0e28f
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?clientId=" + Id;
  //       window.open(this.detailsSummeryUrl, '_blank');

  //     } else if (relatedTo == 'CAND') {
  //       this.detailsSummery = '/tenant/client/cand/candidate/candidate';
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery + "?CandidateId=" + Id + "&Type=" + relatedTo;
  //       window.open(this.detailsSummeryUrl, '_blank');

  //     }
  //     else if (relatedTo == 'JOB') {
  //       // jobs/job/job-list/list/90fc2d08-7e37-4e7f-a3db-f986c5f91f2f?filter=TotalActiveJobs
  //       this.detailsSummery = '/tenant/client/jobs/job/job-list/list/';
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery +Id + "?filter=" + 'TotalActiveJobs';
  //       window.open(this.detailsSummeryUrl, '_blank');
  //     }
  //     else if (relatedTo == 'CONT') {
  //       // http://localhost:4200/tenant/client/cont/contacts/contact-detail?ContactId=466&ContactIdString=6771c9ea-7d3a-47ca-bf9e-35023fd46528&ContactName=aaaaaaaaaaaaaaaaaabbbbbccccccm%20jhgjhghjhjgj&ShortName=AJ
  //       // jobs/job/job-list/list/90fc2d08-7e37-4e7f-a3db-f986c5f91f2f?filter=TotalActiveJobs
  //       this.detailsSummery = '/tenant/client/cont/contacts/contact-detail?ContactId';
  //       this.detailsSummeryUrl = baseUrl + this.detailsSummery +Id;
  //       window.open(this.detailsSummeryUrl, '_blank');
  //     }
  //   }
  // }

  decimalPipe(Duration){
    const decimalHours = Duration; // 13 hours and 75% of an hour
    const minutes = Math.floor(decimalHours / 60 / 1000);
    let milliminut = minutes;
    const seconds = Math.floor(decimalHours / 1000) % 60;
   let  milliminutSecond = seconds;
    // this.addCallForm.patchValue({
    //   mins: minutes,
    //   Second: seconds
    // })
    return milliminut +' ' +'minute'+' ' +milliminutSecond +' '+ 'second';
  }
  decimalPipeForMinuts(Duration){
    const decimalHours = Duration; // 13 hours and 75% of an hour
    const minutes = Math.floor(decimalHours / 60 / 1000);
    let milliminut = minutes;
    const seconds = Math.floor(decimalHours / 1000) % 60;
   let  milliminutSecond = seconds;
   if (minutes>1 && milliminutSecond>1 ) {
    return milliminut +' ' +'minutes'+' ' +milliminutSecond +' '+ 'seconds';
      
   }else if(minutes>1 && milliminutSecond==0){
    return milliminut +' ' +'minutes'+' ' +milliminutSecond +' '+ 'second';

   }else if(minutes==0 && milliminutSecond>1){
    return milliminut +' ' +'minute'+' ' +milliminutSecond +' '+ 'seconds';

   }
   else if(minutes==1 && milliminutSecond==1){
    return milliminut +' ' +'minute'+' ' +milliminutSecond +' '+ 'second';

   }   else if(minutes==1 && milliminutSecond==0){
    return milliminut +' ' +'minute'+' ' +milliminutSecond +' '+ 'second';

   }
   else if(minutes==0 && milliminutSecond==0){
    return milliminut +' ' +'minute'+' ' +milliminutSecond +' '+ 'second';

   }  else if(minutes>1 && milliminutSecond==1){
    return milliminut +' ' +'minutes'+' ' +milliminutSecond +' '+ 'second';

   }
  }

  // function formatHoursMinutesSeconds(num){
  //   var hours = Math.floor(num * 24);
  //   var minutes = Math.floor(((num * 24) - hours) * 60);
  //   var seconds = Math.floor(((((num * 24) - hours) * 60)-minutes)*60);
  
  //   return (hours + ":" + minutes.toString().padStart(2, '0') + ":" + 
  //   seconds.toString().padStart(2, '0'));
  //  }

   /* @When: 05-02-2025 @who:Amit @why: EWM-19489 @what: manaul a call popup */
   onManualCall() {
    const dialogRef = this.dialog.open(VxtAddCallLogComponent, {
      panelClass: ['xeople-modal', 'manualCall', 'fade-right-modal', 'animate__animated', 'animate__fadeInRight'],
      disableClose: false,
      data: new Object({ isCandidate: true }),
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {
        return true;
      }
    });
  }

  openConversation(url)
  {
    window.open(url,'_blank');
  } 

}


