/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:Renu
  @When: 13-July-2021
  @Why: EWM-2104
  @What:  This page will be use for the client tag configuration
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
// import { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { FilterDialogComponent } from '../../../landingpage/filter-dialog/filter-dialog.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { MatDrawer } from '@angular/material/sidenav';
import { AssessmentInfoComponent } from '../assessment-info/assessment-info.component';
import { AssessmentVersionComponent } from '../assessment-version/assessment-version.component';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
// const defaultItems: BreadCrumbItem[] = [
//   {
//       text: 'Administrators',
//       title: 'administrators',
//       icon: 'home'
//   },
//   {
//       text: 'Master Data',
//       title: 'masterdata'
//   },
//   {
//       text: 'Assessment',
//       title: 'Assessment'
//   }
// ];

@Component({
  selector: 'app-assessment-landing-page',
  templateUrl: './assessment-landing-page.component.html',
  styleUrls: ['./assessment-landing-page.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class AssessmentLandingPageComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  public groupId: any;
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public submitted = false;
  public loading: boolean;
  @ViewChild('assessment', { static: true }) matDrawer: MatDrawer;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "Id,asc";
  public sortedcolumnName: string = 'Id';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public pagneNo = 1;
  public searchVal: string = '';
  public listData: any = [];
  public loadingSearch: boolean;
  public totalDataCount: any;
  public gridViewList: any = [];
  public viewMode: string='cardMode';
  public isvisible: boolean;
  public auditParameter: string;
  anchorTagLength: any;
  public next: number = 0;
  public listDataview: any[] = [];
  public pageLabel: any = "label_headerAssement";
  client:any
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public filterCount: number=0;
  //public items: BreadCrumbItem[] = [...defaultItems];
  public filterConfig: any=null;
  public GridId: string='Assessment_grid_001';
  colArr: any;
  columns: any[];
  columnsWithAction: any[];
  loaderStatus: number;
  result: any;
  public maxCharacterLength=800;
  dirctionalLang;
  searchSubject$ = new Subject<any>();


  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService:TextChangeLngService,private commonService: CommonserviceService,
    private translateService: TranslateService, private systemSettingService: ProfileInfoService,
    private userAdministrationService:UserAdministrationService,private jobService:JobService,
    private route: ActivatedRoute,private appSettingsService:AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file  
    this.pageSize = this._appSetting.pagesize;
  }

  ngOnInit(): void {
    
    let URL = this.router.url;
    //let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.ActiveMenu = URL_AS_LIST[3];
   // console.log('this.ActiveMenu ', this.ActiveMenu);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.route.queryParams.subscribe(
      params => {
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
          this.switchListMode(this.viewMode);
        }
      });
      this.getFilterConfig();
    this.auditParameter = encodeURIComponent('Assessment');
    //this.getAssessmentList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.filterConfig);
    this.animationVar = ButtonTypes;
    //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
  this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
  this.loadingSearch = true;
  this.getAssessmentList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.filterConfig);
}); 
  }


  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;
 
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

  // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo = 1;
    this.getAssessmentList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.filterConfig);
  }

  /*
 @Type: File, <ts>
 @Name: getAssessmentList function
 @Who: Renu
 @When: 13-Jul-2021
 @Why: ROST-2104
 @What: For showing the list of group - status data
*/

  getAssessmentList(pageSize, pageNo, sortingValue, searchVal,filterConfig) {
    this.loading = true;
    let jsonObj={};
    jsonObj['PageNumber']=pageNo;
    jsonObj['PageSize']=pageSize;
    jsonObj['OrderBy']=sortingValue;
    jsonObj['search']=searchVal;
    jsonObj['GridId']=this.GridId;
    jsonObj['AssessmentFilterParams']=filterConfig;
    this.userAdministrationService.getAssessmentList(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
            this.loadingSearch = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
            //this.reloadListData();
            //this.doNext();
          }
          this.totalDataCount = repsonsedata.TotalRecord;
        } else if(repsonsedata.HttpStatusCode === 204) { 
          this.gridViewList=[];         
          this.totalDataCount = repsonsedata.TotalRecord;
           this.loading = false;
           this.loadingSearch = false;
          } else {
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Renu
  @When: 13-Jul-2021
  @Why: ROST-2104
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchStatusMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

  /*
 @Type: File, <ts>
 @Name: fetchStatusMoreRecord
 @Who: Renu
 @When: 13-Jul-2021
 @Why: ROST-2104
 @What: To get more data from server on page scroll.
 */

  fetchStatusMoreRecord(pagesize, pagneNo, sortingValue) {
    let jsonObj={};
    jsonObj['PageNumber']=pagneNo;
    jsonObj['PageSize']=pagesize;
    jsonObj['OrderBy']=sortingValue;
    jsonObj['search']=this.searchVal;
    jsonObj['GridId']=this.GridId;
    jsonObj['AssessmentFilterParams']=this.filterConfig;
    this.userAdministrationService.getAssessmentList(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingscroll = false;
          if (repsonsedata.Data) {;
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data;
            this.gridViewList = this.gridViewList.concat(nextgridView);
            //Removing duplicates from the concat array by Piyush Singh
           // const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
            //this.listData = uniqueUsers;
           // this.gridViewList = this.listData; 
            this.totalDataCount = repsonsedata.TotalRecord;      
          }

        } else if(repsonsedata.HttpStatusCode === 204) {
          this.loading = false; 
          this.loadingSearch = false;       
          this.gridViewList=[];  
          this.totalDataCount = repsonsedata.TotalRecord;          
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
      @Type: File, <ts>
      @Name: confirmDialog function
      @Who: Renu
      @When: 13-Jul-2021
      @Why: ROST-2104
      @What: FOR DIALOG BOX confirmation
    */

  confirmDialog(val, viewMode,index): void {
  
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_headerAssement';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.userAdministrationService.deleteAssessment(val).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              //this.listDataview.splice(index, 1);
              this.getAssessmentList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.filterConfig);
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
  }
  /**
    @(C): Entire Software
    @Type: switchListMode Function
    @Who: Renu
    @When:13-Jul-2021
    @Why:  ROST-2104
    @What: This function responsible to change list and card view
   */
  switchListMode(viewMode) {
    let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {

      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
      //listHeader.classList.remove("hide");
    }
  }

  /*
@Name: onFilter function
@Who: Renu
@When: 13-Jul-2021
@Why: ROST-2104
@What: use for Searching records
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
     // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023

  // public onFilter(inputValue: string): void {
  //   this.loading = false;
  //   this.loadingSearch = true;
  //   if (inputValue.length > 0 && inputValue.length < 3) {
  //     this.loadingSearch = false;
  //     return;
  //   }
  //   this.pageNo = 1;
  //   let jsonObj={};
  //   jsonObj['PageNumber']=this.pagneNo;
  //   jsonObj['PageSize']=this.pageSize;
  //   jsonObj['OrderBy']=this.sortingValue;
  //   jsonObj['search']=this.searchVal;
  //   jsonObj['GridId']=this.GridId;
  //   jsonObj['AssessmentFilterParams']=this.filterConfig;
  //   this.userAdministrationService.getAssessmentList(jsonObj).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200 ) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         if (repsonsedata.Data) {
  //           this.gridViewList = repsonsedata.Data;
  //         }
  //         // this.reloadListData();
  //         // this.doNext();
  //       } else if(repsonsedata.HttpStatusCode === 204){
  //         this.gridViewList=[];
  //         this.totalDataCount = repsonsedata.TotalRecord;
  //         this.loading = false;  
  //         this.loadingSearch = false;
  //       } else{
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //         this.loading = false;
  //         this.loadingSearch = false;
  //       }
  //     }, err => {
  //       this.loading = false;
  //       this.loadingSearch = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //     })

  // }

  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Renu
    @When: 13-Jul-2021
    @Why: ROST-2104
    @What: FOR sorting the data
  */

  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this.systemSettingService.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
          }
          // this.reloadListData();
          // this.doNext();
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

   /**@what: for animation @by: renu on @date: 03/07/2021 */
   doNext() {
    if (this.next < this.gridViewList.length) {
      this.listDataview.push(this.gridViewList[this.next++]);
    }
  }

  /**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */
  reloadListData() {
    this.next=0;
    this.listDataview=[];
  }

  public onFilterClear(): void {
    this.searchVal='';
    this.getAssessmentList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.filterConfig);
  }
 /*
    @Type: File, <ts>
    @Name: redirectRoute function
    @Who: Renu
    @When: 03-March-2021
    @Why: ROST-5307
    @What: FOR redirecting from breadcum
  */

  redirectRoute(text:string){
    if(text.toLowerCase()=='masterdata' || text.toLowerCase()=='administrators'){
      this.router.navigate(['./client/core/administrators/masterdata']);
    }

  }


  /*
  @Type: File, <ts>
  @Name: getFilterConfig function
  @Who: Renu
  @When: 10-Aug-2021
  @Why: ROST-2363
  @What: For get filter config data
  */

  getFilterConfig(){
    this.loading=true;
    this.jobService.getfilterConfig(this.GridId).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          let colArrSelected=[];
          if(repsonsedata.Data!==null)
          {  
            this.colArr= repsonsedata.Data.GridConfig;
            this.filterConfig=repsonsedata.Data.FilterConfig;
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
            this.columns=colArrSelected;

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
          this.getAssessmentList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.filterConfig);
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
    @Name: clearFilterData function
    @Who: Renu
    @When: 10-Aug-2021
    @Why: ROST-2363
    @What: FOR DIALOG BOX confirmation
  */

    clearFilterData(viewMode): void {
      const message = `label_confirmDialogJob`;
      const title = '';
      const subTitle = 'label_clearAssementfilter';
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
        let AssessmentFilterParams=[];
        this.loading = true;
        let jsonObjFilter={};
        jsonObjFilter['AssessmentFilterParams']=AssessmentFilterParams;
        jsonObjFilter['search']=this.searchVal;
        jsonObjFilter['PageNumber']=this.pagneNo;
        jsonObjFilter['PageSize']=this.pageSize;
        jsonObjFilter['OrderBy']=this.sortingValue;
        jsonObjFilter['GridId']=this.GridId;
       
        this.userAdministrationService.getAssessmentList(jsonObjFilter).subscribe(
          (repsonsedata:ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
            this.gridViewList = repsonsedata.Data;
            this.loaderStatus=1;
            this.getFilterConfig();
           
            }else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
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
  

  /*
  @Type: File, <ts>
  @Name: openFilterModalDialog function
  @Who: Renu
  @When: 10-Aug-2021
  @Why: ROST-2363
  @What: For opening filter  dialog box
  */ 

  openFilterModalDialog(){
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: new Object({ filterObj: this.filterConfig, GridId: this.GridId}),
      panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
   
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
        jsonObjFilter['AssessmentFilterParams']=filterParamArr;
        jsonObjFilter['search']=this.searchVal;
        jsonObjFilter['PageNumber']=this.pagneNo;
        jsonObjFilter['PageSize']=this.pageSize;
        jsonObjFilter['OrderBy']=this.sortingValue;
        jsonObjFilter['GridId']=this.GridId;
      
        this.userAdministrationService.getAssessmentList(jsonObjFilter).subscribe(
          (repsonsedata:ResponceData) => {
            if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
              this.loading = false;
            this.gridViewList = repsonsedata.Data;
            this.loaderStatus=1;
            this.getFilterConfig();
            }else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          
          })
      }
      })    
  }
  

  // openCreateAssessment(){
  //  this.matDrawer.toggle();
  // }


  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1823
   @What: For setting value in the edit form
  */
   getAssementInfo(Id: Number) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(AssessmentInfoComponent, {
      // maxWidth: "1000px",
      data: new Object({ assessmentId: Id }),
      // width: "65%",
      // maxHeight: "85%",
      // data: dialogData,
      panelClass: ['xeople-modal', 'add_assInfo', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
    // console.log("res",res)
    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    
  }

    /*
   @Type: File, <ts>
   @Name: getAssementVersion function
   @Who: Renu
   @When: 09-March-2021
   @Why: EWM-1823
   @What: For setting value in the edit form
  */
  getAssementVersion(Id:Number){
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(AssessmentVersionComponent, {
      // maxWidth: "1000px",
      data: new Object({ assessmentId: Id }),
      // width: "65%",
      // maxHeight: "85%",
      // data: dialogData,
      panelClass: ['xeople-modal-lg', 'add_assessment', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
    // console.log("res",res)
    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    
  }


  /*
@Type: File, <ts>
@Name: assementPreview function
@Who: Renu
@When: 16-06-2022
@Why: EWM-7151 EWM-7233
@What: Show Preview 
*/
assementPreview(assessmenetID:Number){
  let manageurl='./assessment/preview?Id='+assessmenetID;
  window.open(manageurl, '_blank');
}
}
