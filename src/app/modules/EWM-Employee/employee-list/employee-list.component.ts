/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 26-Oct-2021
  @Why: EWM-1734 EWM-3271
  @What:  This page will be use for employeee landing page list Component ts file
*/

import { Component, OnInit, ViewChild,NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../EWM.core/shared/services/candidates/candidate.service';
import { EmployeeService } from '../../EWM.core/shared/services/employee/employee.service';
import { JobService } from '../../EWM.core/shared/services/Job/job.service';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AdvancedFilterCandidateComponent } from '../../EWM-Candidate/candidate-list/advanced-filter-candidate/advanced-filter-candidate.component';
import { QuickpeopleComponent } from '../../EWM.core/shared/quick-modal/quickpeople/quickpeople.component';
import { ActionDialogComponent } from '../../EWM.core/job/landingpage/action-dialog/action-dialog.component';
import { SystemSettingService } from '../../EWM.core/shared/services/system-setting/system-setting.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { FilterDialogComponent } from '../../EWM.core/job/landingpage/filter-dialog/filter-dialog.component';
import { customDropdownConfig } from '../../EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { Subject } from 'rxjs';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { CandidateFolderComponent } from '../../EWM-Candidate/candidate-folder/candidate-folder.component';
import { ManageCandidateFolderComponent } from '../../EWM-Candidate/candidate-folder/manage-candidate-folder/manage-candidate-folder.component';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { NewEmailComponent } from '../../EWM.core/shared/quick-modal/new-email/new-email.component';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { EmployeelistkendopagingService } from 'src/app/shared/services/commonservice/employeelistkendopaging.service';
import { CacheServiceService } from '@app/shared/services/commonservice/CacheService.service';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class EmployeeListComponent implements OnInit {

  /***********************global variables decalaration**************************/
  public ActiveMenu: any;
  public loading: boolean;
  public pagesize;
  public pageSizeOptions;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public skip = 0;
  // public sort: any[] = [{
  //   field: 'FirstName',
  //   dir: 'asc'
  // }];

  public GridId: any = 'employeeLanding_grid_001';
  public sortingValue: string;
  public searchValue: string = "";
  public gridListData: any = [];
  public columns: ColumnSetting[] = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  public workflowList: any = [];
  public workflowId: any;
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
  public folderName: any;
  public statusList: any = [];
  public userTypeList: any;
  public loadingSearch: boolean;

  public searchVal: string = '';
  public typeId: any = null;
  public StatusId: any = null;
  public ProfileImagePreviewURL: string;
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedUserType: any = {};
  public selectedUserStatus: any = {};
  public dropDownStatusConfig: customDropdownConfig[] = [];
  resetFormSubjectStatus: Subject<any> = new Subject<any>();
  public dropDownDesignationConfig: customDropdownConfig[] = [];
  public selectedDesignation: any = {};
  public designation: any = null;
  coreRoute: any;
  animationVar: any;

  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size

  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  public folderId: any = 0;
  public totalDataCountFolder: number;
  public userType = 'EMPL';
  searchSubject$ = new Subject<any>();
  dirctionalLang;
  gridColConfigStatus:boolean=false;
  public JobCandidateGridId = 'JobEmployeeGrid001';
  loaderStatus: number;
  folderList = [];
  private destroySubjectEmpl: Subject<void> = new Subject();
  public cancelDocumentFolder:boolean=false;
  public state: State;
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [50, 100, 200];
  public initialstate: State = {
    skip: 0,
    take: 50,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'FirstName',
      dir: 'asc'
    }],
  };

  public pageNumber:number=1;
  public othersParam: any[]=[];
  public gridData:any[]=[];
  public gridListDataFilter:[] = [];

  public filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
    pageSize: number;
    FilterDataClearList: any=[];
    event:any;
  constructor(private route: Router, public dialog: MatDialog, private candidateService: CandidateService, private snackBService: SnackBarService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService, private router: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService, private jobService: JobService, public systemSettingService: SystemSettingService,
    public _CandidateFolderService: CandidateFolderService, private commonserviceService: CommonserviceService, public _sidebarService: SidebarService,
    private employeeService: EmployeeService, private serviceListClass: ServiceListClass,private ngZone: NgZone,
    public EmployeelistkendopagingService:EmployeelistkendopagingService,private cache:CacheServiceService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    this.sizes = this.appSettingsService.pageSizeOptions;
    this.initialstate.take=this.pagesize;
    this.ProfileImagePreviewURL = "/assets/user.svg";


    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.tenantUserTypeList + '?GroupName=people&IsExcluded=true';
    this.dropDoneConfig['placeholder'] = 'label_templatetype';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = '/client/core/user-management/user-type-master';
    this.dropDoneConfig['bindLabel'] = 'PublicName';
    this.dropDoneConfig['IsRequired'] = false;
    this.dropDoneConfig['clearable'] = true;

    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.statusListLevel + '?UserType=EMPL'+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownStatusConfig['placeholder'] = 'label_templateStatus';
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=c8cb59d8-492f-42dd-9079-6733ed4efbaa';
    this.dropDownStatusConfig['bindLabel'] = 'Code';
    this.dropDownStatusConfig['IsRequired'] = false;
    this.dropDownStatusConfig['clearable'] = true;

    this.dropDownDesignationConfig['IsDisabled'] = false;
    this.dropDownDesignationConfig['apiEndPoint'] = this.serviceListClass.getEmployeeDesignation+ '?designationFor=EMPL'; /*  @Who: Bantee Kumar @When: 16-May-2023 @Why: EWM-12344 EWM-12453*/
    this.dropDownDesignationConfig['placeholder'] = 'label_employeeListCurrentPosition';
    this.dropDownDesignationConfig['searchEnable'] = true;
    this.dropDownDesignationConfig['IsManage'] = '';
    this.dropDownDesignationConfig['bindLabel'] = 'PositionName';
    this.dropDownDesignationConfig['IsRequired'] = false;
    this.dropDownDesignationConfig['clearable'] = true;
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
    this._sidebarService.searchEnable.next('1');

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);

    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('employee-list');
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    this.getFilterConfig();
    this.commonserviceService.onOrgSelectId.pipe(
      takeUntil(this.destroySubjectEmpl)
    ).subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);

    this.animationVar = ButtonTypes;
    // this.switchListMode(this.viewMode);

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      //this.getFilterConfig();
    this.state = { ...this.initialstate }
      this.sendRequest(this.state);
      // this.getEmployeeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
    });
    this._sidebarService.searchEnable.next('1');
  }


  ngOnDestroy() {
    const columns = this.grid.columns;
    /*--@who:@Nitin Bhati,@when:24-04-2023, @why:EWM-12065--*/
    if (columns) {
      const gridConfig = {
        //state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
            .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
        })
      };
      this.setConfiguration(gridConfig.columnsConfig);
      this.destroySubjectEmpl.next();
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
 @When: 26-oct-2021
 @Why: ROST-1734 EWM-3271
 @What: For saving the setting config WITH WIdth of columns
  */



 setConfiguration(columnsConfig) {
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
  if( this.filterConfig!==null)
  {
    this.filterCount=this.filterConfig?.length;
  }else{
    this.filterCount=0;
  }
  this.jobService.setfilterConfig(gridConf).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.cache.setLocalStorage(this.GridId,JSON.stringify(repsonsedata.Data));
        this.loading = false;
        // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      } else {
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
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
  @When: 26-oct-2021
  @Why: ROST-1734 EWM-3271
  @What: For get filter config data
  */
  getFilterConfig() {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).pipe(
      takeUntil(this.destroySubjectEmpl)
    ).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.loadingSearch = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
            this.gridColConfigStatus=repsonsedata.Data.IsDefault;  /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064--*/
            this.colArr = repsonsedata.Data.GridConfig;
            this.filterConfig = repsonsedata.Data.FilterConfig;
            if (this.filterConfig !== null) {
              this.filterCount = this.filterConfig.length;
            } else {
              this.filterCount = 0;
            }
            if (repsonsedata.Data.GridConfig.length != 0) {
              colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
            }
            if (colArrSelected.length !== 0) {
              colArrSelected.sort(function (a, b) {
                return a.Order - b.Order;
              });
              this.columns = colArrSelected;
            } else {
              this.columns = this.colArr;
            }
          }
          this.pagneNo = 1;
          this.sendRequest(this.state);
          // this.getEmployeeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
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
 @Who: Renu
 @When: 26-oct-2021
 @Why: ROST-1734 EWM-3271
 @What: For opening filter  dialog box
  */

  openFilterModalDialog() {
    // who;maneesh,what:ewm-11422 groupName:'people' fixed groupid for employee section when filter  ,when:27/06/2023
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId, groupName:'people' }),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
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
        this.othersParam=[];
        this.othersParam.push({
         GridId:this.GridId,
         FilterParams:[],
         Designation:this.designation != null ? this.designation : '',
         StatusId:this.StatusId != null ? this.StatusId : '',
         FolderId:this.folderId,
         Type:this.typeId != null ? this.typeId : '',
         CandidateFilterParams:filterParamArr,

       });
       this.filterConfig=filterParamArr;
       this.state = { ...this.initialstate }
       this.createConfiguration();
        let queryString=this.EmployeelistkendopagingService.QueryString(filterParamArr !== null?filterParamArr:[],this.searchValue,this.sortingValue,this.othersParam);
        this.employeeService.EmployeelistdataV3(this.state,queryString).pipe(takeUntil(this.destroySubjectEmpl)).subscribe(
          (repsonsedata: any) => {

            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;
            this.data = repsonsedata;
            this.gridListData=repsonsedata.data;
            this.gridListDataFilter= repsonsedata.data;
            this.FilterDataClearList = repsonsedata;
            this.totalDataCount = repsonsedata.TotalRecord;
            this.loaderStatus = 0;
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
 @Name: getEmployeeList function
 @Who: Renu
 @When: 26-oct-2021
 @Why: ROST-1734 EWM-3271
 @What: For getting the job list
  */

  getEmployeeList(pagesize, pagneNo, sortingValue, searchVal, JobFilter) {
     // this.loading = true;
    // this.kendoLoading = true;
    /*--@who: Nitin Bhati,@why:12268,@when:28-04-2023,for showing loader --*/
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
    jsonObj['FilterParams'] = [];
    jsonObj['search'] = searchVal;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    jsonObj['GridId'] = this.GridId;
    jsonObj['FolderId'] = this.folderId;
    jsonObj['Type'] = this.typeId != null ? this.typeId : '';
    jsonObj['StatusId'] = this.StatusId != null ? this.StatusId : null;
    jsonObj['Designation'] = this.designation != null ? this.designation : '';
    /*--@who:maneesh,@when:29-09-2023,@why: 14304,@what:For showing social profile change api v2--*/
    this.employeeService.Employeelistdata(jsonObj).pipe(
      takeUntil(this.destroySubjectEmpl)
    ).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.gridListData = repsonsedata.Data;
          /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064,@what:For showing auto fit--*/
          if(this.gridColConfigStatus){
            this.fitColumns();
          }
          this.loading = false;
          this.kendoLoading = false;
          this.loadingSearch = false;
          this.loaderStatus = 0; /*--@who: Nitin Bhati,@why:12268,@when:28-04-2023,for handle loader --*/
          this.totalDataCount = repsonsedata.TotalRecord;
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
 @Name: showTooltip functions
 @Who: Nitin Bhati
 @When: 21-April-2023
 @Why: ROST-12064
 @What: For showing tooltip in kendo
*/
 public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
        if ((element.nodeName === 'TD' || element.nodeName === 'TH')) {
            this.tooltipDir.toggle(element);
        } else {
            this.tooltipDir.hide();
        }

  // const element = e.target as HTMLElement;
  // if (element.nodeName === 'TD') {
  //   var attrr = element.getAttribute('ng-reflect-logical-col-index');
  //   if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
  //     if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
  //       this.tooltipDir.hide();
  //     }
  //     else {
  //       if (element.innerText == '') {
  //         this.tooltipDir.hide();
  //       } else {
  //         this.tooltipDir.toggle(element);
  //       }

  //     }
  //   }
  //   else {
  //     this.tooltipDir.hide();
  //   }
  // }
  // else if (element.nodeName === 'SPAN' || element.nodeName === 'A') {
  //   if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
  //     this.tooltipDir.hide();
  //   }
  //   else {
  //     if (element.innerText == '') {
  //       this.tooltipDir.hide();
  //     } else {
  //       this.tooltipDir.toggle(element);
  //     }

  //   }
  // }
  // else {
  //   this.tooltipDir.hide();
  // }
}

  // refresh button onclick method by Adarsh Singh
  refreshComponent() {
    this.state = { ...this.initialstate }
    this.sendRequest(this.state);

    // this.getEmployeeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
  }

  /*
    @Type: File, <ts>
    @Name: sortChange function
    @Who: Renu
    @When: 20-July-2021
    @Why: ROST-1734 EWM-3271
    @What: for sorting
  */
  // public sortChange($event): void {
  //   this.sortDirection = $event[0].dir;
  //   if (this.sortDirection == null || this.sortDirection == undefined) {
  //     this.sortDirection = 'asc';
  //   } else {
  //     this.sortingValue = $event[0].field + ',' + this.sortDirection;
  //   }
  //   this.pagneNo = 1;
  //   this.getEmployeeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
  // }


  /*
@Type: File, <ts>
@Name: switchListMode function
@Who: Nitin Bhati
@When: 25-Oct-2021
@Why: EWM-3272/3483
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
      this.state = { ...this.initialstate }
      this.sendRequest(this.state);
      this.animate();
      //listHeader.classList.remove("hide");
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

  fetchMoreRecord() {
      this.state.skip= this.state.skip + this.state.take;
      this.othersParam=[];
      this.othersParam.push({
       GridId:this.GridId,
       FilterParams:[],
       Designation:this.designation != null ? this.designation : '',
       StatusId:this.StatusId != null ? this.StatusId : '',
       FolderId:this.folderId,
       Type:this.typeId != null ? this.typeId : '',
       CandidateFilterParams:this.filterConfig,

     });

    //  this.createConfiguration();
      let queryString=this.EmployeelistkendopagingService.QueryString(this.filterConfig !== null?this.filterConfig:[],this.searchValue,this.sortingValue,this.othersParam);
      this.employeeService.EmployeelistdataV3(this.state,queryString).pipe(takeUntil(this.destroySubjectEmpl)).subscribe(
        (repsonsedata: any) => {
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
  @Name: switchListMode function
  @Who: Renu
  @When: 26-oct-2021
  @Why: ROST-1734 EWM-3271
  @What: for swtiching list mode to cARD MODE OR VICE VERSA
*/
  // switchListMode(viewMode) {
  //   let listHeader = document.getElementById("listHeader");
  //   if (viewMode === 'cardMode') {
  //     this.viewMode = "cardMode";
  //     this.animate();
  //   } else {
  //     this.viewMode = "listMode";
  //     this.animate();
  //     listHeader.classList.remove("hide");
  //   }
  // }

   /*
  @Type: File, <ts>
  @Name: clearAdvanceSearch function
  @Who: Bantee Kumar
  @When: 10-Jan-2023
  @Why: EWM-9947.EWM-9937
  @What: for clearing the advance search fields
*/
  clearAdvanceSearch() {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_employees';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {

      if (dialogResult == true) {
        this.loading = true;
        this.typeId=null;
        this.StatusId=null;
        this.designation=null;
      this.selectedDesignation=null;
      this.selectedUserStatus=null;
      this.selectedUserType=null;

        this.getFilterConfig();

      }
    } )


  }
  /*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who: Renu
   @When: 26-oct-2021
   @Why: ROST-1734 EWM-3271
   @What: FOR DIALOG BOX confirmation
 */

  clearFilterData(viewMode): void {
      const message = `label_confirmDialogJob`;
      const title = '';
      const subTitle = 'label_employees';
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
          let jsonObjFilter = {};
          this.othersParam=[];
          this.othersParam.push({
           GridId:this.GridId,
           FilterParams:[],
           Designation:this.designation != null ? this.designation : '',
           StatusId:this.StatusId != null ? this.StatusId : '',
           FolderId:this.folderId,
           Type:this.typeId != null ? this.typeId : '',
           CandidateFilterParams:CandidateFilterParams,

         });
         this.createConfiguration();
          let queryString=this.EmployeelistkendopagingService.QueryString(this.filterConfig !== null?this.filterConfig:[],this.searchValue,this.sortingValue,this.othersParam);
          this.employeeService.EmployeelistdataV3(this.state,queryString).pipe(takeUntil(this.destroySubjectEmpl)).subscribe(
            (repsonsedata: any) => {
              this.loading = false;
              this.loadingSearch = false;
              this.loadingscroll = false;
              this.data = repsonsedata;
              this.gridListData=repsonsedata.data;
              this.gridListDataFilter= repsonsedata.data;
              this.FilterDataClearList = repsonsedata;

              this.totalDataCount = repsonsedata.TotalRecord;
              this.loaderStatus = 0;
              // this.getFilterConfig();
              // if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              //   this.loading = false;
              //   this.gridListData = repsonsedata.Data;
              //   this.totalDataCount = repsonsedata.TotalRecord
              //   this.loaderStatus = 1; /*--@who: Nitin Bhati,@why:12268,@when:28-04-2023,for handle loader --*/
              //   this.getFilterConfig();
              //   this.folderId = 0;

              // } else {
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



  /**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */

  reloadApiBasedOnorg() {
      this.getFilterConfig();
    //  this.getFolderListAll();
    }

  /*
  @Type: File, <ts>
  @Name: openEmployeeModal
  @Who: Renu
  @When: 26-Oct-2021
  @Why: EWM-1734 EWM-3271
  @What: OPEN quick modal employee
*/
  openEmployeeModal() {
      const message = `Are you sure you want to do this?`;
      const title = 'label_disabled';
      const subtitle = 'label_securitymfa';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this.dialog.open(QuickpeopleComponent, {
        // maxWidth: "1000px",
        // width: "90%",
        // maxHeight: "85%",
        // data: dialogData,
        panelClass: ['xeople-modal-full-screen', 'add_people', 'animate__slow', 'animate__animated', 'animate__fadeInDownBig'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.getFilterConfig();
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
  @Name: openActionModalDialog function
  @Who: Renu
  @When: 26-Oct-2021
  @Why: ROST-1734 EWM-3271
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
        this.colArr = res.data;  //<!-----@suika@EWM-10650 @whn  @021-03-2023 to handle API url----->
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
    @Name: tenantUserTypeList
    @Who: Renu
    @When: 26-Apr-2021
    @Why: ROST-1734 ROST-3271
    @What: To get Data from people type will be from user types where type is People
    */
  getStatusBaseUserType(userType) {
      //this.addPeopleForm.get('tempStatus').reset();
      //this.typeId=userType;
      this.getFilterConfig();
      this.systemSettingService.getStatusUserTypeLevel(userType).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.statusList = repsonsedata.Data;

          } else {
            //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
    }


  /*
    @Type: File, <ts>
    @Name: onFilter
    @Who: Renu
    @When: 26-Oct-2021
    @Why: ROST-1734 ROST-3271
    @What: For search value
  */
  public onFilter(inputValue: string): void {
      this.loading = false;
      if(inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.loaderStatus = 1; /*--@who: Nitin Bhati,@why:12268,@when:28-04-2023,for handle loader --*/
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue);
  }

  /*
   @Type: File, <ts>
   @Name: onSearchFilterClear
   @Who: Renu
   @When: 26-Oct-2021
   @Why: ROST-1734 ROST-3271
   @What: For clear Filter search value
 */
  public onSearchFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.loaderStatus = 0; /*--@who: Nitin Bhati,@why:12268,@when:28-04-2023,for handle loader --*/
    this.getFilterConfig();
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

  onChangeStatus(StatusId) {
    this.StatusId = StatusId;
    this.getFilterConfig();
  }

  /**
    @(C): Entire Software
    @Type: Function
    @Who: Mukesh kumar rai
    @When: 10-Sept-2020
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
      @Name: onTypechange
      @Who: Renu
      @When: 28-Oct-2021
      @Why:  EWM-3039 EWM-3405
      @What: when type changes Name drop down changes
    */
  onTypechange(data) {
    if (data == undefined || data == null) {
      this.typeId = null;
      this.selectedUserType=null;
      this.getFilterConfig();
    } else {
      this.selectedUserType=data;
      this.typeId = data.InternalCode;
      this.getStatusBaseUserType(this.typeId);
      this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.statusListLevel + '?UserType=' + this.typeId;
      this.dropDownStatusConfig['bindLabel'] = 'Description';
      this.resetFormSubjectStatus.next(this.dropDownStatusConfig);
    }



  }


  /*
      @Type: File, <ts>
      @Name: onStatuschange
      @Who: Renu
      @When: 28-Oct-2021
      @Why:  EWM-3039 EWM-3405
      @What: when status changes Name drop down changes
    */
  onStatuschange(data) {
    if (data == undefined || data == null) {
      this.StatusId = null;
      this.selectedUserStatus=null;
      this.getFilterConfig();
    } else {
      this.StatusId = data.Id;
      this.selectedUserStatus=data;
      this.state = { ...this.initialstate }
      this.getFilterConfig();
    }
  }


  /*
      @Type: File, <ts>
      @Name: onStatuschange
      @Who: Renu
      @When: 28-Oct-2021
      @Why:  EWM-3039 EWM-3405
      @What: when designation changes Name drop down changes
    */
  onDesignationchange(data) {
    if (data == undefined || data == null) {
      this.designation = null;
      this.selectedDesignation=null;
      this.getFilterConfig();
    } else {
      this.designation = data.Id;
      this.selectedDesignation=data;
      this.state = { ...this.initialstate }
      this.getFilterConfig();
    }
  }

  /*
@Type: File, <ts>
@Name: onScrollDown
@Who: Nitin Bhati
@When: 17-Sep-2021
@Why: EWM-2859
@What: To add data on page scroll.
*/
  // onScrollDown(ev?) {

  //   this.loadingscroll = true;
  //   if (this.canLoad) {
  //     this.canLoad = false;
  //     this.pendingLoad = false;
  //     if (this.totalDataCount > this.gridListData.length) {
  //       this.pagneNo = this.pagneNo + 1;
  //       this.fetchMoreRecord(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
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
      if (this.totalDataCount > this.gridListData?.length) {
        this.fetchMoreRecord();
      }
      else {
        this.loadingscroll = false;
      }
  }

  /*
      @Type: File, <ts>
      @Name: clearFolderData
      @Who: Nitin Bhati
      @When: 24-July-2021
      @Why: EWM-6123
      @What: For clear folder data
    */
  clearFolderData(): void {
    this.folderId = 0;
    this.filterConfig = null;
    this.sendRequest(this.state);

    // this.getEmployeeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
  }

  /*
   @Type: File, <ts>
   @Name: getFolderListAll
   @Who: Nitin Bhati
   @When: 24-July-2021
   @Why: EWM-6123
   @What: reintialisation the Candidate folder list for candidate
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
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Type: File, <ts>
    @Name: openQuickFolderModal
    @Who: Nitin Bhati
    @When: 24-July-2021
    @Why: EWM-6123
    @What: to open quick add Candidate Folder modal dialog
  */
  openQuickFolderModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    if (this.totalDataCountFolder > 0) {
      //  <!-- @Who: maneesh ,@When: 26-sep-2023, @Why: EWM-10461  ,What:folder data is not dispaly in employee list and no api calling when cancel popup -->
      const dialogRef = this.dialog.open(CandidateFolderComponent, {
        data: new Object({ folderName :this.folderName,folderId :this.folderId, totalDataCountFolder: this.totalDataCountFolder, userType: 'EMPL',folderList:this.folderList}),
        panelClass: ['xeople-modal-lg', 'add_folder', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
       this.folderId = res?.data;
       this.cancelDocumentFolder = res?.cancel;
       this.folderName = res?.name;
         if (res?.data!=0 && !this.cancelDocumentFolder) {
          this.state = { ...this.initialstate }
          this.sendRequest(this.state);
          // this.getEmployeeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
         }
      })
    } else {
      const dialogRef = this.dialog.open(ManageCandidateFolderComponent, {
        data: new Object({ editId: '0', activityStatus: 'Add', totalDataCountFolder: this.totalDataCountFolder, userType: 'EMPL' }),
        panelClass: ['xeople-modal', 'add_folderManage', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
       // this.getFolderListAll();
       // this.getEmployeeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.filterConfig);
        //this.folderId=0;
      })
    }
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
   @Name: socialURL function
   @Who: Bantee Kumar
   @When: 09-Feb-2023
   @Why: EWM-10494.EWM-10487
   @What: for redirect on new tab with url
*/
  socialURL(url){
    let http = url.search('http')
    let tempurl;
    if(http===-1){
      tempurl = "http://"+url;
    }else{
      tempurl = url;
    }
    if(url!=''){
      window.open(tempurl,'_blank')
    }
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
    GridId:this.GridId,
    FilterParams:[],
    Designation:this.designation != null ? this.designation : '',
    StatusId:this.StatusId != null ? this.StatusId : '',
    FolderId:this.folderId,
    Type:this.typeId != null ? this.typeId : ''
  });
  if (this.filterConfig !== null) {
    this.othersParam.push({
      CandidateFilterParams:this.filterConfig,
    });
  } else {
    this.othersParam.push({
      CandidateFilterParams:[],
    });  }
  let queryString=this.EmployeelistkendopagingService.QueryString(this.filterConfig !== null?this.filterConfig:[],this.searchValue,this.sortingValue,this.othersParam);
  this.employeeService.EmployeelistdataV3(state,queryString).pipe(takeUntil(this.destroySubjectEmpl)).subscribe(
    (repsonsedata: any) => {
    this.loading = false;
    this.loadingSearch = false;
    this.loadingscroll = false;
    this.data = repsonsedata;
    this.gridListData=repsonsedata.data;
    this.gridListDataFilter= repsonsedata.data;
    this.FilterDataClearList = repsonsedata;

    this.totalDataCount = repsonsedata.total;
    this.loaderStatus = 0;

    if(this.gridColConfigStatus){
      this.fitColumns();
    }

  })
  }

    // who:maneesh,what:ewm-15699 for local search when:12/01/2023
    public gridViewlistFilter: GridDataResult;
    public filterChange(filter: CompositeFilterDescriptor): void {

      this.filter = filter;
      if(this.filter?.filters?.length==0){
         this.data= this.FilterDataClearList;
        this.totalDataCount = this.FilterDataClearList?.total;
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
      this.totalDataCount = this.gridViewlist?.total;
    }

    public sortChange($event): void {
      this.sortDirection = $event[0].dir;
      this.state.sort=[];
      this.state.sort.push({
        'field':$event[0]?.field,
        'dir':$event[0]?.dir
      })
      this.sendRequest(this.state);
     }

// who:maneesh,what:ewm-15444 for kendo paging, when:12/01/2023
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
// who:maneesh,what:ewm-15444 for kendo paging, when:12/01/2023

  public pageChangess(event: PageChangeEvent): void {
    this.event=event;
    this.state['take']=event.take
    this.state['skip']=event.skip
    this.sendRequest(this.state);
  }
}
