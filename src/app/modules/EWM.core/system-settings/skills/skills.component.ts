import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FilterDialogComponent } from '../../job/landingpage/filter-dialog/filter-dialog.component';
import { JobService } from '../../shared/services/Job/job.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { BulkEditComponent } from './bulk-edit/bulk-edit.component';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class SkillsComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public submitted = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "SkillName,asc";
  public sortedcolumnName: string = 'SkillName';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public result: string = '';
  //public actionStatus: string = 'Add';
  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  public viewMode: string;
  public isvisible: boolean;
  public maxCharacterLengthSubHead = 130;
  public gridView = [{ 'ID': 1, 'GroupCode': 'FOO1', 'GroupDescription': 'treee', 'IsBuiltIn': 1, 'IsActive': 1 },
  { 'ID': 2, 'GroupCode': 'FOO9', 'GroupDescription': 'test2', 'IsBuiltIn': 1, 'IsActive': 1 }]
  public auditParameter;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  public totalDataCount: number;
  public pagneNo = 1;
  public groupId = '';
  public gridData: any = [];
  searchVal: string = '';
  searchValue: string = '';
  public loadingSearch: boolean;
  next: number = 0;
  listDataview: any[] = [];
  public pageLabel: any = "label_skills";
  public userpreferences: Userpreferences;

  public GridId: any = 'Skills_grid_001';
  public filterConfig: any[] = [];
  public colArr: any = [];
  public columns: ColumnSetting[] = [];
  public filterCount: number = 0;
  pageOption: any;  
  pageSizeOptions: any;
   animationState = false;
   // animate and scroll page size
   animationVar: any;
   dirctionalLang;
   searchSubject$ = new Subject<any>();

  /*
 @Type: File, <ts>
 @Name: constructor function
 @Who: Suika
 @When: 07-September-2021
 @Why: ROST-2693
 @What: For injection of service class and other dependencies
  */

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router, private route: ActivatedRoute,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private translateService: TranslateService, private systemSettingService: SystemSettingService, private jobService: JobService,
    public _userpreferencesService: UserpreferencesService, private appSettingsService:AppSettingsService) {
      // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.pageSizeOptions = this._appSetting.pageSizeOptions;
    this.pageOption = this._appSetting.pageOption;
    this.auditParameter = encodeURIComponent('Skills');
  }

  ngOnInit(): void {
    let URL = this.router.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    let queryParams = this.routes.snapshot.params.id;
    this.groupId = decodeURIComponent(queryParams);
    if (this.groupId == 'undefined') {
      this.groupId = "";
    } else {
      this.groupId = decodeURIComponent(queryParams);
    }

    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);

    this.ascIcon = 'north';


    this.getFilterConfig();
    /*******geting Data Via Routing*******/
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.route.queryParams.subscribe((params) => {
      this.viewMode = params['viewModeData'];
    })
    this.switchListMode(this.viewMode);
    this.animationVar = ButtonTypes;
  //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
    this.loadingSearch = true;
    this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.filterConfig, false, false);
       });

  }

  // refresh button onclick method by Piyush Singh
  refreshComponent() {
    this.pageNo = 1;
    this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);

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
  @Name: switchListMode
  @Who: Suika
  @When: 07-September-2021
  @Why: ROST-2693
  @What: To switch between card view to list view.
  */

  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
    }
  }


  /*
@Type: File, <ts>
@Name: getFilterConfig function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
  getFilterConfig() {
    // if(this.loaderStatus===1){
    //   this.loading = false;
    // }else{
    //   this.loading = true;
    // }
    this.loading = true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected = [];
          if (repsonsedata.Data !== null) {
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
              this.columns = colArrSelected;
            } else {
              this.columns = this.colArr;
            }
          }
          this.loading = false;
          this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
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
@Name: getAllSkillListData function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039 EWM-3405
@What: For getting the job list 
*/
  getAllSkillListData(pagesize, pageNo, sortingValue, searchVal, JobFilter, isclearfilter: boolean, isScroll: boolean) {
    if (searchVal != undefined && searchVal != null && searchVal != '') {
      this.loadingSearch = true;
    } else if (isScroll == true) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    let jsonObj = {};
    if (JobFilter !== null) {
      jsonObj['FilterParams'] = this.filterConfig;
    } else {
      jsonObj['FilterParams'] = [];
    }
    jsonObj['GridId'] = this.GridId;
    jsonObj['search'] = searchVal;
    jsonObj['PageNumber'] = pageNo;
    jsonObj['PageSize'] = pagesize;
    jsonObj['OrderBy'] = sortingValue;
    this.systemSettingService.getskillsListWithFilter(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          if (isScroll === true) {
            let nextgridView = [];
            nextgridView = repsonsedata['Data'];
            this.gridData = this.gridData.concat(nextgridView);
            this.loadingscroll = false;
            this.loadingSearch = false;
          } else {
            this.gridData = repsonsedata.Data;
            this.loading = false;
            this.loadingSearch = false;
          }

          this.totalDataCount = repsonsedata.TotalRecord;
          if (isclearfilter === true) {
            this.getFilterConfig();
          }
        } else if (repsonsedata.HttpStatusCode === 204) {

          if (isScroll === true) {
            let nextgridView = [];
            nextgridView = repsonsedata['Data'];
            this.gridData = this.gridData.concat(nextgridView);
            this.loadingscroll = false;
            this.loadingSearch = false;
          } else {
            this.gridData = repsonsedata.Data;            
            this.loading = false;
            this.loadingSearch = false;
          }

          if (isclearfilter === true) {
            this.getFilterConfig();
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
          if (isclearfilter === true) {
            this.getFilterConfig();
          }
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        if (isclearfilter === true) {
          this.getFilterConfig();
        }

      })
  }






  /*
@Type: File, <ts>
@Name: openFilterModalDialog function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039 EWM-3405
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
       // console.log(res);
        
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
        this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
      }
    })
  }


  /*
    @Type: File, <ts>
    @Name: clearFilterData function
    @Who: Anup Singh
    @When: 20-oct-2021
    @Why: EWM-3039
    @What: FOR DIALOG BOX confirmation
  */
  clearFilterData(): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_skills';
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
        this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, true, false);

      }
    });
  }



  /*
  @Type: File, <ts>
  @Name: onFilter function
  @Who: Anup
  @When: 01-Nov-2021
  @Why: EWM-3132 EWM-3603
  @What: use for Searching record
   */
    //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  onFilter(value)
  {
     if (value.length > 0 && value.length < 3) {
       return;
     }
     this.loadingSearch = true;
     this.pageNo=1;
    //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
    this.searchSubject$.next(value);
  }


  /*
  @Type: File, <ts>
  @Name: onFilter function
  @Who: Anup
  @When: 01-Nov-2021
  @Why: EWM-3132 EWM-3603
  @What: use for clear Searching record
   */
    //  who:maneesh,what:ewm-12630 for apply this.searchVal = '' clear data when search data,when:06/06/2023
  public onFilterClear(): void {
    this.searchVal = '';
    this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.filterConfig, false, false);
  }

  /*
  @Type: File, <ts>
  @Name: short column
  @Who: Suika
  @When: 07-September-2021
  @Why: ROST-2693
  @What: To short column on the basis of column name.
  */
  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);

  }



  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Suika
  @When: 07-September-2021
  @Why: ROST-2693
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridData.length) {
        this.pageNo = this.pageNo + 1;
        this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, true);
      } else {
        this.loadingscroll = false;
      }

    } else {
      this.pendingLoad = true;
    }
  }




  /*
    @Type: File, <ts>
    @Name: confirmDialog function
    @Who: Suika
    @When: 07-September-2021
    @Why: ROST-2693
    @What: FOR DIALOG BOX confirmation
  */
  confirmDialog(val, index): void {
    const data = val;
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'label_skills';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {

        this.systemSettingService.deleteSkillsById(data).subscribe(
          (data: ResponceData) => {
            this.active = false;
            if (data.HttpStatusCode == 200) {
              this.pageNo = 1;
              this.searchVal = '';
              this.listDataview.splice(index, 1);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getAllSkillListData(this.pageSize, this.pageNo, this.sortingValue, this.searchValue, this.filterConfig, false, false);
            } else if (data.HttpStatusCode == 400) {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	
  }



  doNext() {
    // alert(this.gridData.length)
    if (this.next < this.gridData.length) {
      //alert('go')
      this.listDataview.push(this.gridData[this.next++]);
    }
  }


  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
  reloadListData() {
    this.next = 0;
    this.listDataview = [];
  }





}




