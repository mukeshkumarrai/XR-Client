
/*
@Type: File, <ts>
@Name: my-activity-list.component.ts
@Who: Anup
@When: 14-jan-2022
 @Why:EWM-4465 EWM-4660
@What: my activity list
*/
import { IfStmt } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { MarkDoneActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/mark-done-activity/mark-done-activity.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CandidatejobmappingService } from 'src/app/shared/services/candidate/candidatejobmapping.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { MailServiceService } from 'src/app/shared/services/email-service/mail-service.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../../EWM.core/shared/services/candidates/candidate.service';
import { JobService } from '../../../EWM.core/shared/services/Job/job.service';
import { QuickJobService } from '../../../EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { CalenderFilterComponent } from './calender-filter/calender-filter.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { MyActivityViewComponent } from './my-activity-view/my-activity-view.component';
import { Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-my-activity-list',
  templateUrl: './my-activity-list.component.html',
  styleUrls: ['./my-activity-list.component.scss']
})
export class MyActivityListComponent implements OnInit {

  public loading: boolean;
  public positionMatDrawer: string = 'end';
  public isAsignJob: boolean = false;
  gridListData: any[] = [];
  public userpreferences: Userpreferences;
  public sortDirection = 'asc';
  public sortingValue: string = "ActivityTitle,desc";
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';
  public sort: any[] = [{
    field: 'ActivityTitle',
    dir: 'desc'
  }];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  public pageSizeOptions;
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;

  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  viewMode: string = 'listMode';
  @Output() editMyActivityDrawer = new EventEmitter();
  public totalDataCount: number;

  public activityListingValue: string = "Upcoming";

  defaultSelectActivityListing = "Upcoming"
  filterModeType: any = '';
  startDate: any = new Date();
  endDate: any = null;

  @Output() DateFilterClearCount = new EventEmitter();
  @Output() CategoryFilterClearCount = new EventEmitter();

  @Output() UpcomingActivityListing = new EventEmitter();
  @Input() searchVal:string = '';
  public searchSubject$ = new Subject<any>();
  public searchActivity: Subscription;
  loadingSearch: boolean;
  resClearDateFilter:string='';
  applystartDate: any = new Date();
  applyendDate: any = new Date();
  dataRes:any;
  applyDatefilter:any
  dateFilterCount:number;
  constructor(private route: Router, private routes: ActivatedRoute, public _sidebarService: SidebarService,
    private commonserviceService: CommonserviceService, private systemSettingService: SystemSettingService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService, private _services: DocumentService,
    private _service: CandidatejobmappingService, private translateService: TranslateService, private snackBService: SnackBarService,
    private quickJobService: QuickJobService, private renderer: Renderer2, private jobService: JobService, private mailService: MailServiceService, public candidateService: CandidateService) {
    this.pagesize = appSettingsService.pagesize;
  }

  ngOnInit(): void {

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    if(this.activityListingValue=="Upcoming"){
      this.endDate= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, true, true);
    
      //// For Activity Listing when activity create or edit By @Anup Singh //////
    this.commonserviceService.ActivityCreateGetListObs.subscribe(res=>{
      if(res){
        this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, true, true);
      }
    })

        //// For Activity Listing Filter By @Anup Singh //////
    this.commonserviceService.ActivityListingObs.subscribe(resActivityListing=>{
      if(resActivityListing){
       this.onChangeActivityListing(resActivityListing)
      }
    });

    //// For Activity Date Filter By @Anup Singh ///////
    this.commonserviceService.ActivityDateFilterObs.subscribe(resDate=>{
      if(resDate){
        this.DateFilter(resDate);
      }
    });

     //// For Activity Date Filter Clear By @Anup Singh ///////
   this.commonserviceService.ActivityDateFilterClearObs.subscribe(resClearDateFilter=>{
     if(resClearDateFilter){
      this.resClearDateFilter=resClearDateFilter;
      this.clearDateFilter(resClearDateFilter);
     }
     });

  //// For Activity Category Filter By @Anup Singh ///////
     this.commonserviceService.ActivityCategoryFilterObs.subscribe(resCategory=>{
      if(resCategory){
        this.CategoryFilter(resCategory)
      } 
    });

    //// For Activity Category Filter Clear By @Anup Singh ///////
   this.commonserviceService.ActivityCategoryFilterClearObs.subscribe(resClearCategoryFilter=>{
     if(resClearCategoryFilter){
      this.clearCategoryFilter(resClearCategoryFilter)
     } 
   });
    //// For Activity date Filter apply count By @maneesh ///////
    this.commonserviceService.PastActivityDateFilterCount.subscribe(resdateFilter=>{
      if(resdateFilter){
        this.dateFilterCount=resdateFilter;
      } 
    });
  }





  /*
   @Type: File, <ts>
   @Name: getAllActivityList
   @Who: Anup Singh
   @When: 17-jan-2022
   @Why:EWM-4465 EWM-4661
   @What: get all activity list
   */
   getJson:any={}
  getAllActivityList(pagesize: any, pagneNo: any, sortingValue: string, isScroll: boolean, isCalenderFilter: boolean, iscategoryFilter: boolean) {
    if (isScroll) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    this.getJson = {};
    if (this.dataRes != undefined && this.resClearDateFilter != 'Date') {
      const d = new Date(this.applystartDate);
      const s = new Date(this.applyendDate);
      this.getJson['FromDate'] = this.applyDatefilter != null ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString() : this.startDate,
      this.getJson['ToDate'] = this.applyendDate != null ? new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString() : this.endDate,
      this.getJson['PageNumber'] = pagneNo,
      this.getJson['PageSize'] = pagesize,
      this.getJson['OrderBy'] = sortingValue,
      this.getJson['CategoryIds'] = this.CategoryIds
      this.getJson['ActivityListingType'] = this.activityListingValue
    } else {
      const d = new Date(this.startDate ?? new Date());
      const s = new Date(this.endDate ?? new Date());
      this.getJson['FromDate'] = this.dataRes != null ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString() : this.startDate,
      this.getJson['ToDate'] = this.endDate != null ? new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString() : this.endDate,
      this.getJson['PageNumber'] = pagneNo,
      this.getJson['PageSize'] = pagesize,
      this.getJson['OrderBy'] = sortingValue,
      this.getJson['CategoryIds'] = this.CategoryIds
      this.getJson['ActivityListingType'] = this.activityListingValue
    }

    this.systemSettingService.getAllMyActivity(this.getJson)
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
            this.totalDataCount = data.TotalRecord;
            this.loading = false;
            this.loadingscroll = false;
            // For Category Filter
            if (iscategoryFilter === false) {
              if (this.filterModeType == 'Category') {
                this.CategoryFilterClearCount.emit(true);
              }
            }
            // For Date Filter
            if (isCalenderFilter === false) {
              if (this.filterModeType == 'Date') {
                this.DateFilterClearCount.emit(true);
              }
            }
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
            // For Category Filter
            if (iscategoryFilter === false) {
              if (this.filterModeType == 'Category') {
                this.CategoryFilterClearCount.emit(true);
              }
            }
            // For Date Filter
            if (isCalenderFilter === false) {
              if (this.filterModeType == 'Date') {
                this.DateFilterClearCount.emit(true);
              }
            }
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
            this.loadingscroll = false;
          }
        }, err => {
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
  }
  /*
   @Type: File, <ts>
   @Name: pageChange
   @Who: Anup Singh
   @When: 17-jan-2022
   @Why:EWM-4465 EWM-4661
   @What: infinite scroll
   */
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
    if (this.totalDataCount > this.gridListData.length) {
      this.pagneNo = this.pagneNo + 1;
      this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, true, true, true);
    } else {
      this.loadingscroll = false;
    }
  }

  /*
    @Type: File, <ts>
    @Name: sortChange
    @Who: Anup Singh
    @When: 17-jan-2022
    @Why:EWM-4465 EWM-4661
    @What: for shorting
    */
  public sortChange($event): void {
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null || this.sortDirection == undefined) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = $event[0].field + ',' + this.sortDirection;
    }
    this.pagneNo = 1;
    this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, true, true);
  }


  /*
    @Type: File, <ts>
    @Name: showTooltip
    @Who: Anup Singh
    @When: 17-jan-2022
    @Why:EWM-4465 EWM-4661
    @What: for tooltip
    */
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    //console.log("show Tooltip:", e.target as HTMLElement);
    //alert("show tooltip");

    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      // console.log("show Tooltip One:");
      if (attrr != null && !Number.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
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




  /*
    @Type: File, <ts>
    @Name: onChangeActivityListing
    @Who: Anup Singh
    @When: 17-jan-2022
    @Why:EWM-4465 EWM-4661
    @What: Change Activity Listing get list according
    */
  onChangeActivityListing(activityListing) {
    this.activityListingValue = activityListing;
    if(this.activityListingValue=="Upcoming"){
      if (this.dateFilterCount==undefined || this.dateFilterCount==0) { //who:maneesh,what:ewm-16043 when:13/03/2024
        this.startDate = new Date();
        this.endDate= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    }else if(this.activityListingValue=="Past"){
      if (this.dateFilterCount==undefined || this.dateFilterCount==0) { //who:maneesh,what:ewm-16043 when:13/03/2024
        this.startDate = new Date();
        this.endDate=null;
      }
    }else{
      this.startDate =null;
      this.endDate=null;
    }
    this.pagneNo=1;
    this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, true, true);
  }



  /*
    @Type: File, <ts>
    @Name: DateFilter
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why:EWM-4465 EWM-4744
    @What: open popup for calender filter
    */

   DateFilter(res){       
    this.startDate = res.scheduleData?.DateStart;
    this.endDate = res.scheduleData?.DateEnd;
    this.dataRes = res;
    this.applystartDate=res.scheduleData?.DateStart;
    this.applyendDate=res.scheduleData?.DateEnd;
    this.applyDatefilter=res;    
    //this.filterCountDate = 1;
    var element = document.getElementById("filter-date");
    element.classList.add("filteractive");
    if (this.CategoryIds.length == 0) {
      this.CategoryIds = [];
    }
    this.pagneNo=1;
    this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, true, false);
  }




 /*
    @Type: File, <ts>
    @Name: CategoryFilter
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why:EWM-4465 EWM-4744
    @What: open popup for category filter
    */
public CategoryIds: any = [];
CategoryFilter(result){
     this.CategoryIds = result.res;
      var element = document.getElementById("filter-category");
      element.classList.add("filteractive");
      this.pagneNo=1;
      this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, false, true);
}
 

  /*
    @Type: File, <ts>
    @Name: clearFilterData function
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why:EWM-4465 EWM-4744
    @What: FOR DIALOG BOX confirmation
  */
  clearDateFilter(viewMode){
    if (viewMode == 'Date') {
      this.startDate = new Date();
      this.endDate = null;
      this.filterModeType = viewMode;
      this.pagneNo=1;
      this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, false, false);
    }
  }


   /*
    @Type: File, <ts>
    @Name: clearCategoryFilter function
    @Who: Anup Singh
    @When: 20-jan-2022
    @Why:EWM-4465 EWM-4744
    @What: FOR DIALOG BOX confirmation
  */
  clearCategoryFilter(viewMode){
    if (viewMode == 'Category') {
      this.CategoryIds = [];
      this.filterModeType = viewMode;
      this.pagneNo=1;
      this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, false, false);
    }
  }



/* 
  @Type: File, <ts>
  @Name: openDrawerForEdit function 
  @Who: Anup Singh
  @When: 18-jan-2022
  @Why: EWM-4478 EWM-47155
  @What: open drawer for edit .
  */
  openDrawerForEdit(activityId){
    this.editMyActivityDrawer.emit({isEdit:true, activityId:activityId});
  }


 /* 
  @Type: File, <ts>
  @Name: deleteActivity function 
  @Who: Anup Singh
  @When: 18-jan-2022
  @Why: EWM-4478 EWM-47155
  @What: call Api for delete record .
  */
 deleteActivity(val): void {
  // const message = 'label_titleDialogContentSiteDomain';
  const message = 'label_titleDialogContent';
  const title = 'label_delete';
  const subTitle = 'label_MenuActivity';
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
      let delObj = {};

      delObj = val;
      this.systemSettingService.deleteMyActivityById(delObj).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata['HttpStatusCode'] == 200) {
            this.loading = false;
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            this.pagneNo = 1;
           this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, true, true);
            
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
}



/*
      @Type: File, <ts>
      @Name: openQuickMarkDoneModal
      @Who: Anup Singh
      @When: 18-jan-2022
      @Why: EWM-4478 EWM-4715
      @What: to open quick Activity mark as done modal dialog
    */
   openQuickMarkDoneModal(Id:any,remarkStatus:any,Remarks:any) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_markAsdone';
    const dialogRef = this.dialog.open(MarkDoneActivityComponent, {
      maxWidth: "750px",
      width: "90%",
      data: new Object({ editId: Id,remarkStatusId: remarkStatus,remarks: Remarks }),
     // maxHeight: "85%",
      panelClass: ['quick-modalbox', 'add_Manage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.pagneNo = 1;
      this.getAllActivityList(this.pagesize, this.pagneNo, this.sortingValue, false, true, true);
      } else {
       // this.generalLoader = false;
      }
    })
  }



  /*
      @Type: File, <ts>
      @Name: openMyActivityViewModal
      @Who: Anup Singh
      @When: 18-jan-2022
      @Why: EWM-4478 EWM-4715
      @What: to open quick Activity view modal dialog
    */
   openMyActivityViewModal(activityId) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_markAsdone';
    const dialogRef = this.dialog.open(MyActivityViewComponent, {
    maxWidth: "750px",
    width: "90%",
    data: new Object({activityId: activityId}),
     // maxHeight: "85%",
      panelClass: ['quick-modalbox', 'viewActivity', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
      
      } else {
      }
    })
  }


ngOnDestroy(){
  this.UpcomingActivityListing.emit(true);
  } 
  ngOnChanges(changes: SimpleChanges): void {
    let val = changes.searchVal.currentValue
    this.searchVal = val;
    this.pagneNo = 1;
   if (val) {
    this.searchSubject$.next(val);
   }
  }

}