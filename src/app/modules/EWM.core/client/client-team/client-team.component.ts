import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { GridComponent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { Subject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { ColumnSettings } from 'src/app/shared/models/column-settings.interface';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FilterDialogComponent } from '../../job/landingpage/filter-dialog/filter-dialog.component';
import { AddTeamComponent } from '../../shared/quick-modal/add-team/add-team.component';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { ClientService } from '../../shared/services/client/client.service';
import { JobService } from '../../shared/services/Job/job.service';
import { ButtonTypes } from 'src/app/shared/models';
import { CommonFilterDiologComponent } from '../../job/landingpage/common-filter-diolog/common-filter-diolog.component';
import { CommonFilterdilogService } from '@app/shared/services/common-filterdilog.service';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-client-team',
  templateUrl: './client-team.component.html',
  styleUrls: ['./client-team.component.scss']
})
export class ClientTeamComponent implements OnInit {
  @Input() clientIdData:any
  gridListData: any[]=[];
  viewMode: string = 'listMode';
  public filterConfig: any;
  public GridId: any = 'ClientTeamDetails_grid_001';
  public pagesize;
  public pagneNo = 1;
  public sortingValue: string = "EmployeeName,desc";
  public searchValue: string = "";
  clientId = "";
  public userpreferences: Userpreferences;
  public loading: boolean;
  loadingscroll: boolean;
  public result: string = '';

  loadingSearch:boolean=false;
  public filterCount: number = 0;
  public sortDirection = 'asc';
  public sort: any[] = [{
    field: 'EmployeeName',
    dir: 'asc'
  }];
  public totalDataCount: number;
  public colArr: any = [];
  public columns: ColumnSetting[] = [];
  @Output() clientTeamCount = new EventEmitter();

  searchSubject$ = new Subject<any>();
  dirctionalLang;
public columnsWithAction: any[] = [];
@ViewChild(GridComponent) public grid: GridComponent;

  // get config Adarsh EWM-12059 27-APRIL-2023
  public filterAlert: any = 0;
  public quickFilterStatus: number = 0;
  public dynamicFilterArea: boolean = false;
  // End 
  gridColConfigStatus:boolean=false;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  animationVar: any;
  @Input()clientType:string;
  constructor(private route: Router, private fb: FormBuilder, private routes: ActivatedRoute, public _sidebarService: SidebarService, private commonServiesService: CommonServiesService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService, private jobService: JobService, private snackBService: SnackBarService, private clientService: ClientService, public candidateService: CandidateService,
    private ngZone: NgZone,private CommonFilterdilogsrvs :CommonFilterdilogService)
     {
    this.pagesize = appSettingsService.pagesize;
  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((value) => {
      if (value.clientId != undefined && value.clientId != null && value.clientId != '') {
        this.clientId = value.clientId;
      }
    });
    this.getFilterConfig(false);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.commonserviceService.onClientSelectId.subscribe(value => {     
      if (value !== null) {
        this.clientId = value;  
        this.getFilterConfig(false);   
      } 
    })

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {   // put this code in ngOnIt section 
      this.loadingSearch = true;
      this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, val, true, false);
       });

       this.animationVar = ButtonTypes;
    
  }

     /* 
@Type: File, <ts>
@Name: ngOnDestroy
@Who: Adarsh Singh
@When: 27-APRIL-2023
@Why: ROST-12059
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
    @Why: EWM-3692 EWM-3861
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
          setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            this.getLocalStorageData();
            this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
                },100)
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
            // <!-- --------@When: 26-APR-2023 @who:Adarsh singh @why: EWM-12059 -------- -->
            this.columnsWithAction = this.columns;
            this.columnsWithAction.splice(0,0,{
              "Type": "Action",
              "Field": null,
              "Order": 0,
              "Title": null,
              "Selected": true,
              "Format": "{0:c}",
              "Locked": true,
              "width": "40px",
              "Alighment": null,
              "ColumnAlignment": "Left",
              "Grid": true,
              "Filter": false,
              "API": null,
              "APIKey": null,
              "Label": null
              });
              // End 
          } else {
            this.columns = this.colArr;
            // <!-- --------@When: 26-APR-2023 @who:Adarsh singh @why: EWM-12059 -------- -->
            this.columnsWithAction = this.columns;
            this.columnsWithAction.splice(0,0,{
              "Type": "Action",
              "Field": null,
              "Order": 0,
              "Title": null,
              "Selected": true,
              "Format": "{0:c}",
              "Locked": true,
              "width": "40px",
              "Alighment": null,
              "Grid": true,
              "ColumnAlignment": "Left",
              "Filter": false,
              "API": null,
              "APIKey": null,
              "Label": null
            });
            // End 
          }
        }
        this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false); 
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
  @Name: on add data, popup will open
  @Who: Adarsh singh
  @When: 02-dec-2021
  @Why: 4052 EWM-4489
  @What: for popup open
*/
  addData(){
    const dialogRef = this.dialog.open(AddTeamComponent, {
      maxWidth: "750px",
      width:"90%",
      data: new Object({clientType:this.clientType}),
      panelClass: ['quick-modalbox', 'addClientTeam', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      // console.log(dialogResult);
      
      if (dialogResult == true) {
        this.filterConfig = [];
        let JobFilter = [];
        this.loading = true;
        // this.filterCount = 0;
        // this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
        this.getFilterConfig(false); 
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


/*
  @Type: File, <ts>
  @Name: get all data
  @Who: Adarsh singh
  @When: 02-dec-2021
  @Why: 4052 EWM-4489
  @What: get all client Team data
*/
  getClientTeamAll(pagesize: any, pagneNo: any, sortingValue: string, searchValue: any, isSearch: boolean, isScroll: boolean) {
    if (isSearch == true) {
      this.loading = false;
    } else if (isScroll) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    let jsonObj = {};
    if (this.filterConfig !== undefined && this.filterConfig !== null && this.filterConfig !== '') {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['ClientId'] = this.clientId;
    // jsonObj['ClientId'] = "28390828-5445-42a6-9dc5-e347fef1559f",
    jsonObj['search'] = searchValue;
    jsonObj['PageNumber'] = pagneNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    
    this.clientService.clientTeamDetails(jsonObj)
      .subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            if (isScroll) {
              let nextgridView = [];
              nextgridView = data['Data'];
              this.gridListData = this.gridListData.concat(nextgridView);
            } else {
              this.gridListData = data.Data;
            }
            if(this.gridColConfigStatus){
              this.fitColumns();
            }
            if (isSearch == true) {
              this.clientTeamCount.emit(false);
            }else{
              this.clientTeamCount.emit(true);
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
            // console.log(this.gridListData,'gridData');
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
  @Name: edit data 
  @Who: Adarsh singh
  @When: 02-dec-2021
  @Why: 4052 EWM-4489
  @What: for open popup
*/
  editData(id){
    const dialogRef = this.dialog.open(AddTeamComponent, {
      maxWidth: "750px",
      width:"90%",
      data:{teamId:id},
      panelClass: ['quick-modalbox', 'addClientTeam', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      
      if (dialogResult == true) {
        this.filterConfig = [];
        let JobFilter = [];
        this.loading = true;
        // this.filterCount = 0;
        this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false); 
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
  @Name:delete client team
  @Who: Adarsh singh
  @When: 02-dec-2021
  @Why: 4052 EWM-4489
  @What: for delete client data
*/ 
  onDeleteClientTeam(val): void {
          //maneesh,what:changes fixed ewm-15616 fixed delete confermation box,when:19/01/2024
          const message = 'label_titleDialogContent';
          const title = 'label_delete';
          const subTitle =null;
          const dialogData = new ConfirmDialogModel(title, subTitle, message);
          const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
            maxWidth: "355px",
            data: dialogData,
            panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.loading = true;
        this.clientService.clientTeamDelete(val).subscribe(
          (repsonsedata:any) => {
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
              this.clientTeamCount.emit(true);
             } else {
               this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
 
          })
      } else {
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
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
    @Name: sortChange
    @Who: Adarsh singh
    @When: 13-jan-2022
    @Why: 4052 EWM-4489
    @What: for shorting
  */
 public sortChange($event): void {
  this.sortDirection = $event[0].dir;
  if (this.sortDirection == null || this.sortDirection == undefined) {
    this.sortDirection = 'asc';
  } else {
    this.sortingValue = $event[0].field + ',' + this.sortDirection;
  }
  this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
}

/*
@Name: onFilter function
@Who: Adarsh
@When: 13-jan-2022
@Why:E4052 EWM-4489
@What: filter data 

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
@Name: onFilterClear function
@Who: adarsh
@When: 13-jan-2022
@Why:E4052 EWM-4489
@What: for clear filter

*/
public onFilterClear(): void {
  this.loadingSearch = false;
  this.searchValue = '';
  this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
}

  /*
@Name: pageChange function
@Who: Adarsh
@When: 13-jan-2022
@Why:E4052 EWM-4489*/
public pageChange(event: PageChangeEvent): void {
  this.loadingscroll = true;
  if (this.totalDataCount > this.gridListData.length) {
    this.pagneNo = this.pagneNo + 1;
  this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, true);

  } else {
    this.loadingscroll = false;
  }
}




 /*
    @Type: File, <ts>
    @Name: openFilterModalDialog
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for open filter model
  */

 openFilterModalDialog() {
  const dialogRef = this.dialog.open(CommonFilterDiologComponent, {
    data: new Object({ filterObj: this.filterConfig, GridId: this.GridId,onlyshowFilter:true }),
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
      let jsonObjFilterG = {};
      this.filterConfig = filterParamArr;
      jsonObjFilterG['FilterConfig'] =res?.data?.length=='0'? null:filterParamArr;
      jsonObjFilterG['GridConfig'] = this.colArr;
      jsonObjFilterG['GridId'] = this.GridId;
      // setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
      //   this.getLocalStorageData();
      //   this.setLocalStorageData('commonFilterDataStore',jsonObjFilterG);
      //       },100)
             this.setConfiguration(this.filterConfig);//by maneesh ewm-17806
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


          // Function to get the current config data from localStorage
          getLocalStorageData() {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            const data = this.CommonFilterdilogsrvs.getLocalStorage('commonFilterDataStore');
            return data ? JSON.parse(data) : {};
          }
          
          // Function to save config data to localStorage
           setLocalStorageData(key, data) {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            this.CommonFilterdilogsrvs.setLocalStorage(key,JSON.stringify(data));
          }



 /*
    @Type: File, <ts>
    @Name: clearFilterData
    @Who: ANUP
    @When: 02-dec-2021
    @Why: EWM-3692 EWM-3861
    @What: for clear filter
  */

clearFilterData(viewMode): void {
  const message = `label_confirmDialogJob`;
  const title = '';
  const subTitle = 'label_Team';
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
      let jsonObjFilterG = {};
      jsonObjFilterG['FilterConfig'] =null;
      jsonObjFilterG['GridId'] = this.GridId;
      setTimeout(()=>{  //by maneesh fixed new CommonFilterDiologComponent stop calling api
        this.getLocalStorageData();
        this.setLocalStorageData('commonFilterDataStore',null);
            },100)
      this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);
    }
  });
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
@Name: setConfiguration function
@Who: Adarsh singh
@When: 27-APRIL-2023
@Why: ROST-12059
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
        this.loading = false;
      this.getClientTeamAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, false, false);

      } else {
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}
/*
  @Type: File, <ts>
  @Name: showTooltip
  @Who: Adarsh singh
  @When: 27-APRIL-2023
  @Why: ROST-12059
  @What: for tooltip
  */
 public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
  //console.log("show Tooltip:", e.target as HTMLElement);
  //alert("show tooltip");

  if (element.nodeName === 'TD') {
    var attrr = element.getAttribute('ng-reflect-logical-col-index');
   // console.log("show Tooltip One:");
    if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
        this.tooltipDir.hide();
      //  console.log("show Tooltip two:");
      }
      else {
        if (element.innerText == '') {
          this.tooltipDir.hide();
         // console.log("show Tooltip three:");
        } else {
        //  console.log("show Tooltip four:");
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

}
