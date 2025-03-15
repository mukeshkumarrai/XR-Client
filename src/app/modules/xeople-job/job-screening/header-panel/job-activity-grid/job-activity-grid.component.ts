import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { Subject, Subscription } from 'rxjs';
import { MarkDoneActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/mark-done-activity/mark-done-activity.component';
import { CalenderFilterComponent } from 'src/app/modules/EWM.core/home/my-activity-list/calender-filter/calender-filter.component';
import { MyActivityViewComponent } from 'src/app/modules/EWM.core/home/my-activity-list/my-activity-view/my-activity-view.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobActivityCreateComponent } from '../job-activity-create/job-activity-create.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-job-activity-grid',
  templateUrl: './job-activity-grid.component.html',
  styleUrls: ['./job-activity-grid.component.scss']
})
export class JobActivityGridComponent implements OnInit {
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  isMyActivityList: boolean = false;
  defaultSelectActivityListing = "Upcoming";
  loadingscroll: boolean;
  gridListData: any[] = [];
  loading: boolean;
  startDate: any = new Date();
  endDate: any = null;
  public userpreferences: Userpreferences;
  pagesize: any;
  pagneNo: any = 1;
  public totalDataCount: number;
  @Input() syncCandidateDataList: [];
  @Input() syncInterviewDataListId: [];
  @Input() syncOrganiserDataListId: [];
  public sortingValue: string = "ActivityTitle,desc";
  jobId: string;
  @Output() DateFilterClearCount = new EventEmitter();
  @Output() CategoryFilterClearCount = new EventEmitter();
  @Output() UpcomingActivityListing = new EventEmitter();
  filterModeType: any = '';

  activityActionForm = 'Edit';
  public utctimezonName: any = localStorage.getItem('UserTimezone');
  public timezonName: any = localStorage.getItem('UserTimezone');
  public timePeriod: any = 60;
  public calenderMode: number = 1;
  public isSlotActive: boolean = false;
  public attendeesDataList: any[] = [];
  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;
  subscription5: Subscription;

  @Input() searchVal:string = '';

  public searchSubject$ = new Subject<any>();
  public searchActivity: Subscription;
  loadingSearch: boolean;

  constructor(private commonserviceService: CommonserviceService,
    public dialog: MatDialog, private systemSettingService: SystemSettingService,
    public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private routes: ActivatedRoute,
    private snackBService: SnackBarService, private translateService: TranslateService,
  ) {
    this.pagesize = appSettingsService.pagesize;

    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.jobId) {
        this.jobId = parms?.jobId;
      }

    })
  }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    if (this.activityListingValue == "Upcoming") {
      this.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    this.getAllActivityList(false, false, false,this.searchVal);


    this.subscription1=this.commonserviceService.ActivityDateFilterObs.subscribe(resDate => {
      if (resDate) {
        this.DateFilter(resDate)
      }
    });

    this.subscription2=this.commonserviceService.ActivityCategoryFilterObs.subscribe(resCategory => {
      if (resCategory) {
        this.CategoryFilter(resCategory)
      }
    });




    //// For Activity Date Filter Clear By @Bantee Kumar ///////
    this.subscription3=this.commonserviceService.ActivityDateFilterClearObs.subscribe(resClearDateFilter => {
      if (resClearDateFilter) {
        this.clearDateFilter(resClearDateFilter);
      }
    });

    //// For Activity Category Filter Clear By @Bantee Kumar ///////
    this.subscription4=this.commonserviceService.ActivityCategoryFilterClearObs.subscribe(resClearCategoryFilter => {
      if (resClearCategoryFilter) {
        this.clearCategoryFilter(resClearCategoryFilter)
      }
    });

    //// For Activity Listing Filter By @Bantee Kumar //////
    this.subscription5=this.commonserviceService.ActivityListingObs.subscribe(resActivityListing => {
      if (resActivityListing) {
        this.onChangeActivityListing(resActivityListing);
      }
    });

    this.searchActivity= this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      this.getAllActivityList(false, false, false,this.searchVal);
    });
  }
/*
  @Type: File, <ts>
  @Name: clearDateFilter function
  @Who: Bantee Kumar
  @When: 7-july-2023
  @Why:EWM-11778 EWM-13014
  @What: clear Date Filter
  */
  clearDateFilter(viewMode) {
    if (viewMode == 'Date') {
      this.startDate = new Date();
      this.endDate = null;
      this.filterModeType = viewMode;
      this.pagneNo = 1;
      this.getAllActivityList(false, false, false,this.searchVal);
    }
  }
/*
  @Type: File, <ts>
  @Name: clearCategoryFilter function
  @Who: Bantee Kumar
  @When: 7-july-2023
  @Why:EWM-11778 EWM-13014
  @What: clear Category Filter
  */

  clearCategoryFilter(viewMode) {
    if (viewMode == 'Category') {
      this.CategoryIds = [];
      this.filterModeType = viewMode;
      this.pagneNo = 1;
      this.getAllActivityList(false, false, false, this.searchVal);
    }
  }

/*
  @Type: File, <ts>
  @Name: showTooltip function
  @Who: Bantee Kumar
  @When: 7-july-2023
  @Why:EWM-11778 EWM-13014
  @What: show tooltip
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
  @Name: openModelForCalenderFilter
  @Who: Bantee Kumar
  @When: 7-july-2023
  @Why:EWM-11778 EWM-13014
  @What: open popup for calender filter
  */

  public filterCountDate: any = 0;
  openModelForCalenderFilter() {
    const dialogRef = this.dialog.open(CalenderFilterComponent, {
      // maxWidth: "1000px",
      data: new Object({ activityListingValue: this.activityListingValue }),
      // width: "90%",
      // maxHeight: "85%",
      panelClass: ['xeople-modal', 'CalenderFilter', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isSchedule == true) {
        this.commonserviceService.onActivityDateFilter.next(res)
        this.filterCountDate = 1;
        var element = document.getElementById("filter-date");
        element.classList.add("filteractive");
      } else {
      }
    })
  }


  /*
@Type: File, <ts>
@Name: add remove animation function
@Who: Bantee Kumar
@When: 7-July-2023
@Why: EWM-11778 EWM-13014
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
   @Name: clearFilterData function
   @Who: Bantee Kumar
   @When: 7-July-2023
   @Why:EWM-11778 EWM-13014
  @What: FOR DIALOG BOX confirmation

  */

  clearFilterData(viewMode: string): void {
    const message = `label_confirmDialogJob`;
    const title = '';
    const subTitle = 'label_myActivity';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if (viewMode == 'Date') {
          this.commonserviceService.onActivityDateFilterClear.next(viewMode);
        }
        else if (viewMode == 'Category') {
          this.commonserviceService.onActivityCategoryFilterClear.next(viewMode);
        }
      }
    });
  }

  /*
   @Type: File, <ts>
   @Name: getAllActivityList
   @Who: Bantee Kumar
   @When: 7-July-2023
   @Why:EWM-11778 EWM-13014
   @What: get all activity list
   */
  getAllActivityList(isScroll, isCalenderFilter, iscategoryFilter,searchVal:string) {
    if (isScroll) {
      this.loading = false;
    } else {
      this.loading = true;
    }
    const d = new Date(this.startDate);
    const s = new Date(this.endDate);

    let getJson = {
      "CategoryIds": this.CategoryIds.length ? this.CategoryIds : [],
      "ActivityListingType": this.activityListingValue,
      "FromDate": this.dataRes != null ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString() : this.startDate,
      "ToDate": this.endDate != null ? new Date(s.getFullYear(), s.getMonth(), s.getDate(), s.getHours(), s.getMinutes() - s.getTimezoneOffset()).toISOString() : this.endDate,
      "PageNumber": this.pagneNo,
      "PageSize": this.pagesize,
      "OrderBy": this.sortingValue,
      "Organizers": [this.syncOrganiserDataListId],
      "Interviewers": this.syncInterviewDataListId,
      "Candidates": this.syncCandidateDataList,
      "JobId": this.jobId,
      "Search": searchVal


    }

    this.systemSettingService.getAllMyInterviewActivities(getJson)
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
      @Name: DateFilter function
      @Who: Bantee Kumar
      @When: 7-july-2023
      @Why: EWM-11778 EWM-13014
      @What: to filter activity based on Date
    */
  dataRes: any;
  DateFilter(res) {
    this.startDate = res.scheduleData?.DateStart;
    this.endDate = res.scheduleData?.DateEnd;
    this.dataRes = res;
    //this.filterCountDate = 1;
    var element = document.getElementById("filter-date");
    element.classList.add("filteractive");
    if (this.CategoryIds.length == 0) {
      this.CategoryIds = [];
    }
    this.pagneNo = 1;
    this.getAllActivityList(false, false, false,this.searchVal);
  }

 /*
      @Type: File, <ts>
      @Name: CategoryFilter function
      @Who: Bantee Kumar
      @When: 7-july-2023
      @Why: EWM-11778 EWM-13014
      @What: to filter activity based on category
    */

  public CategoryIds: any = [];
  CategoryFilter(result) {
    this.CategoryIds = result.res;
    var element = document.getElementById("filter-category");
    element.classList.add("filteractive");
    this.pagneNo = 1;
    this.getAllActivityList(false, false, false,this.searchVal);
  }



  /*
      @Type: File, <ts>
      @Name: openMyActivityViewModal
      @Who: Bantee Kumar
      @When: 7-july-2023
      @Why: EWM-11778 EWM-13014
      @What: to open quick Activity view modal dialog
    */
  openMyActivityViewModal(activityId) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_markAsdone';
    const dialogRef = this.dialog.open(MyActivityViewComponent, {
      maxWidth: "750px",
      width: "90%",
      data: new Object({ activityId: activityId }),
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



  /*
@Type: File, <ts>
@Name: editActivity function
@Who: Bantee Kumar
@When: 7-July-2023
@Why: EWM-11778 EWM-13014
@What: editActivity 
*/
  editActivity(activityId, edit, list) {
    const dialogRef = this.dialog.open(JobActivityCreateComponent, {
      data: {
        activityActionForm: this.activityActionForm, utctimezonName: this.utctimezonName,
        timezonName: this.timezonName, timePeriod: this.timePeriod, activityId: activityId, isSlotActive: this.isSlotActive,
        activityObj: list?.RelatedTo, syncCandidateAttendeeList: this.attendeesDataList
      },
      panelClass: ['xeople-drawer-lg', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res==true){
    this.getAllActivityList(false, false, false,this.searchVal);

      }
    })

  }


  /* 
   @Type: File, <ts>
   @Name: deleteActivity function 
   @Who: Bantee Kumar
   @When: 7-july-2023
   @Why: EWM-11778 EWM-13014
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
              this.getAllActivityList(false, false, false,this.searchVal);

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
    @Who: Bantee Kumar
    @When: 7-July-2023
    @Why: EWM-11778 EWM-13014
    @What: to open quick Activity mark as done modal dialog
*/
  openQuickMarkDoneModal(Id: any, remarkStatus: any, Remarks: any) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_markAsdone';
    const dialogRef = this.dialog.open(MarkDoneActivityComponent, {
      // maxWidth: "750px",
      // width: "90%",
      data: new Object({ editId: Id, remarkStatusId: remarkStatus, remarks: Remarks }),
      // maxHeight: "85%",
      panelClass: ['xeople-modal', 'add_Manage', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        //this.clientActivityCount.emit(true);
        this.getAllActivityList(false, false, false,this.searchVal);

      } else {
        // this.generalLoader = false;
      }
    })
  }



  /*
    @Type: File, <ts>
    @Name: onChangeActivityListing
    @Who: Bantee Kumar
    @When: 7-july-2023
    @Why:EWM-11778 EWM-13014
    @What: Change Activity Listing get list according
    */
  public activityListingValue: string = "Upcoming";

  onChangeActivityListing(activityListing) {
    this.activityListingValue = activityListing;
    if (this.activityListingValue == "Upcoming") {
      this.startDate = this.appSettingsService.getUtcDateFormat(new Date());
      this.endDate = this.appSettingsService.getUtcDateFormat(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    } else if (this.activityListingValue == "Past") {
      this.startDate = this.appSettingsService.getUtcDateFormat(new Date());
      this.endDate = null;
    } else {
      this.startDate = null;
      this.endDate = null;
    }
    this.pagneNo = 1;
    this.getAllActivityList(false, false, false,this.searchVal);
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
      this.getAllActivityList(true, true, true, this.searchVal);
    } else {
      this.loadingscroll = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
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