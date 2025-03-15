import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataBindingDirective, GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CandidatejobmappingService } from 'src/app/shared/services/candidate/candidatejobmapping.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { fadeInRightBigAnimation, rubberBandAnimation } from 'angular-animations';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { debounce, debounceTime, distinctUntilChanged, switchMap, take, takeUntil } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { ButtonTypes } from 'src/app/shared/models';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { JobFilterDialogComponent } from '../../job-shared/job-filter-dialog/job-filter-dialog.component';
import { RestrictCandidateComponent } from './restrict-candidate/restrict-candidate.component';



interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-search-candidate',
  templateUrl: './search-candidate.component.html',
  styleUrls: ['./search-candidate.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class SearchCandidateComponent implements OnInit {
  background20: any;
  loadingSearch:boolean = false;
  loading: boolean = false;
  @Input() JobId: any;
  @Input() JobName: any;
  @Input() WorkflowId: any;
  @Input() JobReferenceId:any;
  @Input() WorkflowName: any;
  public GridId: any = 'SearchCandidateGrid001';  
  CountFilter: any = 'TotalJobs';  
  public Source:any;  
  gridListData: any[] = [];  
  public sortDirection = 'asc';
  // by maneesh,what ewm-17081 ewm-17120 for remove by default sorting = "CandidateJobTitle,asc";,when:22/05/2024
  public sortingValue: string;   
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  pageNo: any = 1;
  searchValue: any = '';
  filterConfig: any = [];
  JobFilterParams:any=[];
  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  public pageSize;  
  viewMode: string = 'listMode';
  isCardMode: boolean = false;  
  public userpreferences: Userpreferences;  
  public colArr: any = [];
  public columns: ColumnSetting[] = [];    
  public totalDataCount: any;
  public descending:boolean=false;  
  public ascending:boolean=true;
  filterCount: number;
  public dynamicFilterArea: boolean = false;
  public filterAlert: any = 0;
  public sort: any[] = [{
    field: 'JobTitle',
    dir: 'desc'
  }];  
  isFilter: boolean = false;  
  animationState = false;
  public columnsWithAction: any[] = [];
  searchSubject$ = new Subject<any>();
  @Output() assignToJob= new EventEmitter<any>();
  public isFilterClearData :boolean=false;
  public filterModelData:any
  hidecomponent = false;
  public matDrawerBgClass;  
  candidateIdData: any;
  public quickFilterStatus: number = 0;
  @ViewChild(GridComponent) public grid: GridComponent;
  gridColConfigStatus:boolean=false;
  dirctionalLang;
  public searchData:boolean=false;
  @Input() IsJobClosed: number;
  animationVar: any;
  @Input() JobLatitude: any;
  @Input() JobLongitude: any;
  distanceUnit: string='KM';
  constructor(private route: Router, private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
     private _service: CandidatejobmappingService, private jobService: JobService, private translateService: TranslateService, private snackBService: SnackBarService,
     private ngZone: NgZone) {
      this.pageNo = this.appSettingsService.pageOption;
      this.pageSize = this.appSettingsService.pagesize;
      this.userpreferences = this._userpreferencesService.getuserpreferences();   
      }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((parmsValue) => {
      this.JobId = parmsValue.jobId;
      this.viewMode = parmsValue.cardJob;
      this.WorkflowId = parmsValue.workflowId;   
    });
    this.getFilterConfig();
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.switchListMode(this.viewMode);

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      if (val.trim().length > 3) {
        this.loadingSearch = true;
        this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, val, this.filterConfig, true, false);
      }else{
        this.gridListData = null;
      }
       });

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
ngOnDestroy(){
  const columns = this.grid?.columns;
  if (columns) {
    const gridConfig = {
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
  
  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.isCardMode = true;   
    } else {
      this.viewMode = "listMode";
      this.isCardMode = false;
    }
  }




  getFilterConfig() {
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
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
// who:maneesh,what:ewm-13417 for change width 170 to 40px when:19/07/2023
              this.columnsWithAction = this.columns;
              this.columnsWithAction.splice(0, 0, {
                "Type": "Action",
                "Field": null,
                "Order": 0,
                "Title": null,
                "Selected": false,
                "Format": "{0:c}",
                "Locked": true,
                "width": "120px",// @suika @EWM-13583 @whn 08-08-2023
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
                "width": "120px", // @suika @EWM-13583 @whn 08-08-2023
                "Alighment": null,
                "Grid": true,
                "Filter": false,
                "API": null,
                "APIKey": null,
                "Label": null
              });
            }
          }
          if (this.filterConfig==null) {
            this.loading = false; 
          }
          if (this.filterConfig!=null) {
            this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
            }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  // @When: 26-09-2023 @who:Amit @why: EWM-14465 @what: btn animation function
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
 @Name: onScrollDown
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To add data on page scroll.
 */
onScrollDown(ev?) {
  this.loadingscroll = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.gridListData?.length) {
      this.pageNo = this.pageNo + 1;
      this.fetchMoreRecord();
    }
    else {
      this.loadingscroll = false;
    }
  } else {
    this.loadingscroll = false;
    this.pendingLoad = true;
  }
}


 /*
 @Type: File, <ts>
 @Name: pageChange
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To add data on page change event.
 */
pageChange(event: PageChangeEvent): void {
  this.loadingscroll = true;
  if (this.totalDataCount > this.gridListData?.length) {
    this.pageNo = this.pageNo + 1;
    this.fetchMoreRecord();
  } else {
    this.loadingscroll = false;
  }
}


/*
 @Type: File, <ts>
 @Name: fetchMoreRecord
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To get more data from server on page scroll.
 */
fetchMoreRecord() {
  this.loadingscroll = true; 
  const formdata = {
    JobId: this.JobId,
    GridId: this.GridId,
    JobFilterParams: this.filterConfig,
    search: this.searchValue,
    PageNumber: this.pageNo,
    PageSize: this.pageSize,
    OrderBy: this.sortingValue,
    CountFilter: this.CountFilter,
    Source:this.Source,
  } 

  this.jobService.fetchCandidateJobMappedList(formdata).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.totalDataCount = repsonsedata.TotalRecord;
        let nextgridView: any = [];
        nextgridView = repsonsedata.Data;
        if(this.gridColConfigStatus){
          this.fitColumns();
        } 
        this.gridListData = this.gridListData.concat(nextgridView);
        this.loadingscroll = false;
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.totalDataCount = repsonsedata.TotalRecord;
        this.loadingscroll = false;
        this.filterCount = 0;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loadingscroll = false;
        this.filterCount = 0;
      }
    }, err => {
      this.loadingscroll = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}


  /*
 @Type: File, <ts>
 @Name: getCandidateListByJob
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To get more data from server on page scroll.
 */
  getCandidateListByJob(pageSize: any, pageNo: any, sortingValue: string, searchValue: any, filterConfig: any, isSearch: boolean, isScroll: boolean) {  
    //this.loading = true;
     const formdata = {
      JobId: this.JobId,
      GridId: this.GridId,
      JobFilterParams:this.filterConfig?this.filterConfig:[],
      search: searchValue,
      PageNumber: pageNo,
      PageSize: pageSize,
      OrderBy: sortingValue,
      Source:this.Source,
      Latitude: this.JobLatitude==null || this.JobLatitude==''?0:parseFloat(this.JobLatitude), /*-@why:EWM-14983,@who: Nitin Bhati.@when:27-10-2023-*/
      Longitude: this.JobLongitude==null || this.JobLongitude==''?0:parseFloat(this.JobLongitude), 
    }   
   // this.loading = true;
    this.jobService.fetchCandidateJobMappedList(formdata).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) { 
          if(this.gridColConfigStatus){
            this.fitColumns();
          }       
            this.gridListData = data.Data;          
            /*--@who:Nitin Bhati,@when:21-04-2023,@why: 12064,@what:For showing auto fit--*/
            if(this.gridColConfigStatus){
              this.fitColumns();
            }
            this.totalDataCount = data.TotalRecord;       
            this.loading = false;
            this.loadingSearch = false;
        }else if(data.HttpStatusCode === 204){
          this.gridListData = []; 
          if (this.gridListData.length==0) { //who:maneesh,what:show no record found ewm-13732,when:18/08/2023
            this.searchData=true;
          }       
          this.loading = false;
          this.loadingSearch = false;
        }else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false; 
        this.loadingSearch = false;      
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });

  }


  // public showTooltip(e: MouseEvent): void {
  //   const element = e.target as HTMLElement;
  //   if ((element.nodeName === 'TD' || element.nodeName === 'TH') && element.offsetWidth < element.scrollWidth) {
  //     this.tooltipDir.toggle(element);
  //   } else {
  //     this.tooltipDir.hide();
  //   }
  // }
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


  isNotSort: boolean = false;
  public sortChange($event) {
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null || this.sortDirection == undefined) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = $event[0].field + ',' + this.sortDirection;
    }

    if ($event[0].field == 'mappedwithfolder') {
      this.isNotSort = true;
    } else if ($event[0].field == 'resume') {
      this.isNotSort = true;
    } else {
      this.isNotSort = false;
    }
    if (this.isNotSort != true) {
      this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
    }
  }


  /*
 @Type: File, <ts>
 @Name: openFilterModalDialog
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To get more data from server on page scroll.
 */ 

  openFilterModalDialog() {
    const dialogRef = this.dialog.open(JobFilterDialogComponent, {
      data: new Object({ GridId: this.GridId, filterObj: this.filterConfig, isFilter:true}),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res != false && res.data?.length>0) {
        this.loading = true;
        this.isFilterClearData=true;
        this.filterModelData=res.data;
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
        this.loading = true;
        let jsonObjFilter = {};
        this.pageNo = 1;
        jsonObjFilter['JobFilterParams'] = filterParamArr;
        jsonObjFilter['search'] = this.searchValue;
        jsonObjFilter['PageNumber'] = this.pageNo;
        jsonObjFilter['PageSize'] = this.pageSize;
        jsonObjFilter['OrderBy'] = this.sortingValue;
        //jsonObjFilter['WorkflowId']=this.workflowId;
        jsonObjFilter['GridId'] = this.GridId;
        this.filterConfig = filterParamArr; 
        this.setConfiguration(this.filterConfig);//ewm-17957 by maneesh
    }
    if (res.data?.length==0) {  //ewm-17957 by maneesh
      this.filterConfig = null;
      this.filterCount=0;
      this.gridListData=null
      this.setConfiguration(this.filterConfig)  }
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
 @Name: onFilter
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To get more data from server on page scroll.
 */ 
  public onFilter(inputValue: string): void {
    if (inputValue.length<=3 || inputValue.length==0) { //who:maneesh,what:show no record found ewm-13732,when:18/08/2023
     this.searchData=false;
    }
    this.isFilter = true;  
    this.pageNo = 1;
    this.searchSubject$.next(inputValue);
  }
  

/*
 @Type: File, <ts>
 @Name: onFilterClear
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To get more data from server on page scroll.
 */  
  public onFilterClear(): void {
    this.searchData=false;  //maneesh,what:show no record found ewm-13732,when:18/08/2023;
    this.loadingSearch = false;
    this.searchValue = '';
    if (this.isFilterClearData==true) {
      let filterParamArr = [];
      this.filterModelData.forEach(element => {
        filterParamArr.push({
          'FilterValue': element.ParamValue,
          'ColumnName': element.filterParam.Field,
          'ColumnType': element.filterParam.Type,
          'FilterOption': element.condition,
          'FilterCondition': 'AND'
        })
      });
      this.loading = true;
      let jsonObjFilter = {};
      this.pageNo = 1;
      jsonObjFilter['JobFilterParams'] = filterParamArr;
      jsonObjFilter['search'] = this.searchValue;
      jsonObjFilter['PageNumber'] = this.pageNo;
      jsonObjFilter['PageSize'] = this.pageSize;
      jsonObjFilter['OrderBy'] = this.sortingValue;
      //jsonObjFilter['WorkflowId']=this.workflowId;
      jsonObjFilter['GridId'] = this.GridId;
      this.filterConfig = filterParamArr;      
      this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);

      
    }else{
      this.gridListData=null;
      // this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
  
    }
    // this.gridListData=null;
    // this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
  
    // this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
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
 @Name: sortName
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: for sorting the data.
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


 /*
 @Type: File, <ts>
 @Name: clearFilterData
 @Who: Suika
 @When: 21-Sep-2022
 @Why: EWM-7480-EWM-8857
 @What: To clear the filter data.
 */

clearFilterData(viewMode): void {
  const message = `label_confirmDialogJob`;
  const title = '';
  const subTitle = 'label_search_Candidate';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {      
      this.filterConfig = null;
      this.filterCount=0;
      this.gridListData=null
      this.setConfiguration(this.filterConfig)
      // let JobFilter = [];
      // this.loading = true;
      // let jsonObjFilter = {};
      // jsonObjFilter['JobFilterParams'] = JobFilter;
      // jsonObjFilter['search'] = this.searchValue;
      // jsonObjFilter['PageNumber'] = this.pageNo;
      // jsonObjFilter['PageSize'] = this.pageSize;
      // jsonObjFilter['OrderBy'] = this.sortingValue;
      // jsonObjFilter['JobId'] = this.JobId;
      // jsonObjFilter['GridId'] = this.GridId;
      // this.jobService.fetchCandidateJobMappedList(jsonObjFilter).subscribe(
      //   (repsonsedata: ResponceData) => {
      //     if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
      //       this.loading = false;
      //       this.gridListData = repsonsedata.Data;
      //       this.getFilterConfig();
      //     } else {
      //       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      //       this.loading = false;
      //     }
      //   }, err => {
      //     this.loading = false;
      //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      //   })

      // this.getJobList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,this.workflowId,JobFilter);
      //  this.getFilterConfig();
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
     @Name: onSave function
     @Who: Suika
     @When: 21-Sep-2022
     @Why: EWM-7480-EWM-8857
     @What: For saving candidate job mapping data 
    */
   AssignToCandidateToJob(value,index) {
    this.loading = true;
    let updateObj = {};
    updateObj['JobId'] = this.JobId;
    updateObj['JobName'] = this.JobName;
    updateObj['WorkflowId'] = this.WorkflowId;
    updateObj['WorkflowName'] = this.WorkflowName;
    updateObj['JobRefNo'] = this.JobReferenceId;
    const arr = [];
      arr.push({
        'CandidateId': value.CandidateId,
        'CandidateName':value.Name
      })   
    updateObj['Candidates'] = arr;
    updateObj['PageName'] = 'Job Deatils Page';
    updateObj['BtnId'] = 'btnAssignCandidate';
    this.jobService.candidateNotMappedToJobCreate(updateObj).subscribe((
      repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {        
         //this.assignToJob.emit(true);
        /*--@When:26-04-2023,@who:Nitin Bhati,@why:EWM-12233--*/
        localStorage.setItem('AssignToCandidateToJob','1');
        // Who:Ankit Rawat, What:EWM-17802, on switching the mode candidate is going blank (set local storage 'jobDetailsPageEventStatus'), When:07Aug24
        this.jobService.pageDataChangeStatus(true);
        this.gridListData.splice(index, 1);
         if(this.gridListData.length<20 && this.totalDataCount > this.pageSize){ /*@When:29-03-2023,@who:Renu,@why:EWM-13665 Ewm-14102*/
          this.pageNo = this.pageNo + 1;
          this.fetchMoreRecord();
         }
        
         this.loading = false;
         //this.getCandidateListByJob(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
       } else if (repsonsedata.HttpStatusCode === 400) {
          /*--@When:02-05-2023,@who:Nitin Bhati,@why:EWM-11915--*/
         if(repsonsedata.Message==='400049'){
          this.onRestrictcandidate(repsonsedata?.Data?.AlertMessage);
         }else{
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
         this.loading = false;       
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }

 
  openDrawerWithBg(value) {
    this.matDrawerBgClass = value;
    this.hidecomponent = false;   
  }

  candidate(value, cdata) {

    this.matDrawerBgClass = value;
    this.candidateIdData = cdata
    this.hidecomponent = true;
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
          this.getFilterConfig();
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

/*
  @Type: File, <ts>
  @Name: onRestrictcandidate function
  @Who: Nitin Bhati
  @When: 02-06-2023
  @Why: EWM-11915
  */
  onRestrictcandidate(AlertMessage) {
    const dialogRef = this.dialog.open(RestrictCandidateComponent, {
      panelClass: ['xeople-modal-md', 'RestrictCandidateComponent', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data: AlertMessage
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


}
