/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: ANUP
  @When: 02-dec-2021
  @Why: EWM-3696 EWM-3970
  @What:  This page will be use for client job list Component ts file
*/

import { Component, EventEmitter, HostListener, Input, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@mainshared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from '@mainshared/models';
import { AppSettingsService } from '@mainshared/services/app-settings.service';
import { CommonServiesService } from '@mainshared/services/common-servies.service';
import { UserpreferencesService } from '@mainshared/services/commonservice/userpreferences.service';
import { SidebarService } from '@mainshared/services/sidebar/sidebar.service';
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { SnackBarService } from '@mainshared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../../EWM.core/shared/services/candidates/candidate.service';
import { ClientService } from '../../../EWM.core/shared/services/client/client.service';
import { FilterDialogComponent } from '../../job/landingpage/filter-dialog/filter-dialog.component';
import { JobService } from '../../shared/services/Job/job.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { take } from 'rxjs/operators';
import { ButtonTypes } from 'src/app/shared/models';
import { RouterData } from '@mainshared/enums/router.enum';
import { CommonFilterdilogService } from '@app/shared/services/common-filterdilog.service';
import { CommonFilterDiologComponent } from '../../job/landingpage/common-filter-diolog/common-filter-diolog.component';


interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-client-job-list',
  templateUrl: './client-job-list.component.html',
  styleUrls: ['./client-job-list.component.scss']
})
export class ClientJobListComponent implements OnInit {

  @Input() clientIdData:any
  public loading: boolean;
  gridListData: any[] = [];
  public userpreferences: Userpreferences;
  public sortDirection = 'asc';
  public sortingValue: string = "JobTitle,desc";
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';
  public sort: any[] = [{
    field: 'JobTitle',
    dir: 'asc'
  }];
  public kendoLoading: boolean;
  TotalNoOfClient: number;
  public colArr: any = [];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public pageSizeOptions;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public filterCount: number = 0;
  public columns: ColumnSetting[] = [];
  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  viewMode: string = 'listMode';
  @Output() clientJobCount = new EventEmitter();
  public totalDataCount: number;
  clientId = "";
  GridId = "ClientJob_grid_001";
  public filterConfig: any;
  public result: string = '';
  searchSubject$ = new Subject<any>();

    // get config Adarsh EWM-11971 19APRIL2023
public filterAlert: any = 0;
public quickFilterStatus: number = 0;
@ViewChild(GridComponent) public grid: GridComponent;
public dynamicFilterArea: boolean = false;
public columnsWithAction: any[] = [];
// End 
gridColConfigStatus:boolean=false;
dirctionalLang;
animationVar: any;
innerWidth: any = '1200';
  constructor(private route: Router, private fb: FormBuilder, private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private jobService: JobService, private snackBService: SnackBarService, private clientService: ClientService, public candidateService: CandidateService,
    private ngZone: NgZone, private CommonFilterdilogsrvs :CommonFilterdilogService) {
    this.pagesize = appSettingsService.pagesize;
  }

  ngOnInit(): void {

    // this.commonServiesService.event.subscribe(res => {
    //   this.dirChange(res);
    // });
    this.getFilterConfig(false);

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.routes.queryParams.subscribe((value) => {
      if (value.clientId != undefined && value.clientId != null && value.clientId != '') {
        this.clientId = value.clientId;
      }
    });
    this.commonserviceService.onClientSelectId.subscribe(value => {     
      if (value !== null) {
        this.clientId = value; 
        this.getJobListByClientId(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false); 
      } 
    })

 // this.getJobListByClientId(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
 this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {   // put this code in ngOnIt section 
  this.loadingSearch = true;
  this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, val, true, false);
   });
   this.animationVar = ButtonTypes;
   this.onResize(event);

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
  if (columns) {
    const gridConfig = {
      columnsConfig: columns.toArray().map(item => {
        return Object.keys(item)
          .filter(propName => !propName.toLowerCase()
            .includes('template'))
          .reduce((acc, curr) => ({ ...acc, ...{ [curr]: item[curr] } }), <ColumnSettings>{});
      }),
    };
    // this.setConfiguration(gridConfig.columnsConfig);//by maneesh ewm-17806
  }
}

  
  /*
    @Type: File, <ts>
    @Name: getFilterConfig
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3696 EWM-3970
    @What: filter get api
  */

 getFilterConfig(loaderValue: boolean) {
  this.loading = loaderValue;
  this.jobService.getfilterConfig(this.GridId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        let colArrSelected = [];
        if (repsonsedata.Data !== null) {
          this.colArr = repsonsedata.Data.GridConfig;
          this.filterConfig = repsonsedata.Data.FilterConfig;
          this.gridColConfigStatus=repsonsedata.Data.IsDefault;
          setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            this.getLocalStorageData();
            this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
                },100)
          if (this.filterConfig !== null) {
            this.filterCount = this.filterConfig.length;
          } else {
            this.filterCount = 0;
          }
          if (repsonsedata.Data.GridConfig.length != 0) {
            colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Grid == true);
          }
          if (colArrSelected.length !== 0) {
            this.columns = colArrSelected;
            this.columnsWithAction = this.columns;
          } else {
            this.columns = this.colArr;
           this.columnsWithAction = this.columns;
          }
        }
        this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
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
      @Name: getJobListByClientId
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: get contact list for client
    */
  getJobListByClientId(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, isSearch: boolean, isScroll: boolean) {
    if (isSearch == true) {
      this.loading = false;
    } else if (isScroll) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    let jsonObj = {};
    if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
      jsonObj['JobFilterParams'] = this.filterConfig;
    } else {
      jsonObj['JobFilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['ClientId'] = this.clientId;
    jsonObj['search'] = searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    this.clientService.fetchJobListByClientId(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            if (isScroll) {
              let nextgridView = [];
              nextgridView = data['Data'];
              if(this.gridColConfigStatus){
                this.fitColumns();
              }
              this.gridListData = this.gridListData.concat(nextgridView);
            } else {
              if(this.gridColConfigStatus){
                this.fitColumns();
              }
              this.gridListData = data.Data;
            }
            if(this.gridColConfigStatus){
              this.fitColumns();
            }
            if (isSearch == true) {
              this.clientJobCount.emit(false);
            }else{
              this.clientJobCount.emit(true);
            }
            this.totalDataCount = data.TotalRecord;
            this.loading = false;
            this.loadingscroll = false;
            this.loadingSearch = false;
            // this.loadingAssignJobSaved = false;
          }
          else if (data.HttpStatusCode === 204) {
            if (isScroll) {
              let nextgridView = [];
              nextgridView = data['Data'];
              this.gridListData = this.gridListData.concat(nextgridView);
            } else {
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




  /*
      @Type: File, <ts>
      @Name: pageChange
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: for page no
    */
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData.length) {
      this.pagneNo = this.pagneNo + 1;
      this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, true);
    } else {
      this.loadingscroll = false;
    }
  }

  /*
      @Type: File, <ts>
      @Name: sortChange
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: for shorting
    */
  public sortChange($event): void {
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null || this.sortDirection == undefined) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = $event[0].field + ',' + this.sortDirection;
    }
    this.getJobListByClientId(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
  }

  /*
      @Type: File, <ts>
      @Name: showTooltip
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: for tooltip
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
        //  console.log("show Tooltip five:");
      }
      else {
        //  console.log("show Tooltip six:");
        this.tooltipDir.toggle(element);
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }

  /*
      @Type: File, <ts>
      @Name: switchListMode
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: for mode
    */
  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";

    } else {
      this.viewMode = "listMode";
    }
  }

  /*
      @Type: File, <ts>
      @Name: onFilter
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: for search
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
      @Type: File, <ts>
      @Name: onFilterClear
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: for clear serch
    */
  loadingSearch: boolean;
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);

    // this.getFilterConfig();
  }




  /*
      @Type: File, <ts>
      @Name: sortName
      @Who: ANUP
      @When: 02-dec-2021
      @Why: EWM-3696 EWM-3970
      @What: for short Name
    */
  sortName(Name) {
    if (Name) {
      let finalNameArr = Name.split(' ').slice(0, 2);

      if (finalNameArr.length >= 2) {
        const Name = finalNameArr[0] + " " + finalNameArr[1];

        const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');

        let first = ShortName1.slice(0, 1);
        let last = ShortName1.slice(-1);
        let ShortName = first.concat(last.toString());
        return ShortName.toUpperCase();

      } else {
        const ShortName1 = finalNameArr[0].split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
        let singleName = ShortName1.slice(0, 1);
        return singleName.toUpperCase();

      }
    }
  }


  /*
     @Type: File, <ts>
     @Name: openFilterModalDialog
     @Who: ANUP
     @When: 02-dec-2021
     @Why: EWM-3696 EWM-3970
     @What: for open filter model
   */

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(CommonFilterDiologComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
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
        this.filterConfig = filterParamArr;
        this.loading = true;
        // this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
        this.setConfiguration( this.filterConfig)
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


  // @When: 27-09-2023 @who:Amit @why: EWM-14465 @what: btn animation function
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
     @Name: clearFilterData
     @Who: ANUP
     @When: 02-dec-2021
     @Why: EWM-3696 EWM-3970
     @What: for clear filter
   */

  clearFilterData(viewMode): void {
    const message = `label_confirmDialogJob`;
    const title = 'label_Client';
    const subTitle = 'label_job';
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
        this.filterConfig = [];
        let JobFilter = [];
        this.loading = true;
        this.filterCount = 0;
        setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
          this.getLocalStorageData();
          this.setLocalStorageData('commonFilterDataStore',null);
              },100)
        this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);

      }
    });
  }

  /*
   @Type: File, <ts>
   @Name: createJob
   @Who: Anup
   @When: 02-Dec-2021
   @Why: EWM-3696 EWM-3970
   @What: for add new job for client  
   */
  createJob() {
    this.route.navigate(['/client/jobs/job/job-manage/create-job-selection', { workFlowLenght: 1, type:"AddJobClient", clientId:this.clientId }],); 
    //this.route.navigate(['/client/jobs/job/job-manage/manage', { workFlowLenght: 1, type:"AddJobClient", clientId:this.clientId }],); 
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
        setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
          this.getLocalStorageData();
          this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
              },100)
        this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
        this.loading = false;
        setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
          this.getLocalStorageData();
          this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
              },100)
        this.getJobListByClientId( this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
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
@When: 24-APRIL-2023
@Why: ROST-12059
@What: fit columns auto width increase from config
*/
public fitColumns(): void {
  this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
    this.grid.autoFitColumns();
  });
}
viewJobSummery(jobId,WorkFlowId){
  const baseUrl = window.location.origin;
  const router = RouterData.jobSummery;
  const url = baseUrl+router+"?jobId="+jobId +"&workflowId="+WorkFlowId;
  
  console.log('window.location.origin',window.location.origin )
   window.open(url, '_blank');
  }
          // Function to get the current config data from localStorage
 getLocalStorageData() {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
  const data = this.CommonFilterdilogsrvs.getLocalStorage('commonFilterDataStore');
  return data ? JSON.parse(data) : {};
}

// Function to save config data to localStorage
 setLocalStorageData(key, data) {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
  this.CommonFilterdilogsrvs.setLocalStorage(key,JSON.stringify(data));
}

@HostListener('window:resize', ['$event'])
onResize(event) {
  this.innerWidth = window.innerWidth;
}
}