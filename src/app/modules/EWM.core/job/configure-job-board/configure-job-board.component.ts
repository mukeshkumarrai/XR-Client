/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup
  @When: 2-july-2021
  @Why:EWM-1807 EWM-1976
  @What:  This page will be use for job board configuration Component ts file
*/

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { IJobBoard } from './IjobBoard';

@Component({
  providers: [MessageService],
  selector: 'app-configure-job-board',
  templateUrl: './configure-job-board.component.html',
  styleUrls: ['./configure-job-board.component.scss']
})
export class ConfigureJobBoardComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/
  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  public loadingMainSelection: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "JobBoardItemName,asc";
  public sortedcolumnName: string = 'JobBoardItemName';
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
  public gridView: any = [];
  public searchVal: string = '';
  public totalDataCount: any;
  public listData: any = [];
  public loadingSearch: boolean;
  public userpreferences: Userpreferences;
  public auditParameter: string;
  searchTextJobBoard;
  searchTextEWM;

  jobBoardList: any = [];
  jobBoardCategoryList: any = [];
  JobBoardItemList: any = [];
  EWMItemListData: any = [];
  jobBoardNameUI: any;
  categoryName: any;
  jobBoardId: any;
  categoryId: any;
  category: any;
  selectedtype: any;

  jobBoardItemId: number;
  jobBoardItemName: string;

  submitted = false;
  jobBoardForm: FormGroup;

  constructor(
    private fb: FormBuilder, private commonServiesService: CommonServiesService, private jobService: JobService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, private systemSettingService: SystemSettingService,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService
  ) {
    this.pageSize = this.appSettingsService.pagesize;
    this.auditParameter = encodeURIComponent('Job Type');

    this.jobBoardForm = this.fb.group({
      //JobBoardId: [],
      JobBoardName: [[], [Validators.required]],
      // JobBoardCategoryId: [],
      JobBoardCategoryName: [[], [Validators.required]],
      // JobBoardItemId: [],
      JobBoardItemName: [[], [Validators.required]],
      EWMItemList: [[], [Validators.required]],

    })
  }

  ngOnInit(): void {
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        //  this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        //  this.reloadApiBasedOnorg();
      }
    })

    this.getJobBoardList();
  }



  /*
     @Type: File, <ts>
     @Name: getJobBoardList
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     */
  getJobBoardList() {
    this.loadingMainSelection = true;
    this.jobService.getJobBoardAll().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingMainSelection = false;
          this.jobBoardList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.loadingMainSelection = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
     @Type: File, <ts>
     @Name: clickJobBoardgetCategory
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     */
  clickJobBoardgetCategory(jobBoard: any) {
    ///reset
    this.selectedtype = null;
    this.jobBoardForm.get('JobBoardCategoryName').reset();
    this.jobBoardForm.get('JobBoardItemName').reset();
    this.jobBoardForm.get('EWMItemList').reset();
    this.JobBoardItemList = [];
    this.EWMItemListData = [];
    this.gridView = [];
    this.listData = [];
    ////

    this.loadingMainSelection = true;
    this.jobBoardNameUI = jobBoard.Name;
    this.jobBoardId = jobBoard.Id;
    this.jobService.getJobBoardCategoryByJobId("?JobBoardId=" + jobBoard.Id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingMainSelection = false;
          this.jobBoardCategoryList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          this.loadingMainSelection = false;
        }
      }, err => {
        this.loadingMainSelection = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }


  /*
     @Type: File, <ts>
     @Name: clickJobCategorygetItems
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     */
  clickJobCategorygetItems(category: any) {
    ///reset
    this.selectedtype = null;
    this.jobBoardForm.get('JobBoardItemName').reset();
    this.jobBoardForm.get('EWMItemList').reset();
    this.JobBoardItemList = [];
    this.EWMItemListData = [];
    this.gridView = [];
    this.listData = [];
    

    this.loading = true;
    this.category = category;
    this.categoryId = category.Id;
    this.categoryName = category.Name;
    this.jobService.getItemsByJobIdCategoryId("?JobBoardId=" + category.JobboardId + "&JobBoardCategoryId=" + category.Id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.JobBoardItemList = repsonsedata.Data.JobBoardItemList;
          this.EWMItemListData = repsonsedata.Data.EWMItemList;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

    this.getJobBoardItemsList(category.JobboardId, category.Id, this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
  }



  /*
   @Type: File, <ts>
   @Name: clickJobBoardgetJobBoardData
   @Who: Anup
   @When: 3-july-2021
   @Why:EWM-1807 EWM-1976
   */

  clickJobBoardgetJobBoardData(jobBoardItems, index) {
    this.selectedtype = index;
    this.jobBoardItemId = parseInt(jobBoardItems.Id);
    this.jobBoardItemName = jobBoardItems.Name;


  }


  /*
     @Type: File, <ts>
     @Name: onConfirm
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     @what :  for submit Data
     */
  onConfirm(): void {
    //console.log(this.createRequest(), "submit")
    
    this.submitted = true;
    if (this.jobBoardForm.valid) {
      this.loading = true;
      const quickJobRequest = JSON.stringify(this.createRequest())
      //console.log("value:",quickJobRequest);

      this.jobService.createJobBoardConfigue(quickJobRequest).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.clickJobCategorygetItems(this.category);
          } else if (repsonsedata.HttpStatusCode === 400) {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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

  }


  /*
     @Type: File, <ts>
     @Name: createRequest
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     @what : create method for submit 
     */
  public createRequest(): IJobBoard {
    let requestData: IJobBoard = {};

    requestData.JobBoardId = this.jobBoardId;
    requestData.JobBoardCategoryId = this.categoryId;
    requestData.JobBoardItemId = this.jobBoardItemId;
    requestData.JobBoardItemName = this.jobBoardItemName;
    requestData.EWMItemList = this.jobBoardForm.value.EWMItemList;
   // console.log("Values:",requestData);

    return requestData;
  }


  /*
  /*
    @Type: File, <ts>
    @Name: getJobBoardItemsList
    @Who: Anup
    @When: 3-july-2021
    @Why:EWM-1807 EWM-1976
    */

  getJobBoardItemsList(jobboardId, categoryId, pageSize, pageNo, sortingValue, searchVal) {
    this.loading = true;
    this.jobService.getJobBoardItemsList(jobboardId, categoryId, pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loading = false;
          this.gridView = repsonsedata.Data.JobBoardConfigurationDetails;
          this.listData = repsonsedata.Data.JobBoardConfigurationDetails;
          this.totalDataCount = repsonsedata.TotalRecord;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Name: onFilter function
  @Who: Anup
  @When: 3-july-2021
  @Why:EWM-1807 EWM-1976
  @What: use for Searching records
   */
  public onFilter(inputValue: string): void {
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this.jobService.getJobBoardItemsListSearch(this.jobBoardId, this.categoryId, inputValue).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data.JobBoardConfigurationDetails;
          this.listData = repsonsedata.Data.JobBoardConfigurationDetails;

        } else {

          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })

  }


  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Anup
  @When: 3-july-2021
  @Why:EWM-1807 EWM-1976
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchGroupMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
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
   @Name: fetchGroupMoreRecord
   @Who: Anup
   @When: 3-july-2021
   @Why:EWM-1807 EWM-1976
   @What: To get more data from server on page scroll.
   */

  fetchGroupMoreRecord(pagesize, pagneNo, sortingValue) {
    this.loadingscroll = true;
    this.jobService.getJobBoardItemsList(this.jobBoardId, this.categoryId, pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data.JobBoardConfigurationDetails;
          this.listData = this.listData.concat(nextgridView);
          this.gridView = this.listData;
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
    @Who: Anup
    @When: 3-july-2021
    @Why:EWM-1807 EWM-1976
    @What: FOR DIALOG BOX confirmation
  */

  confirmDialog(val, viewMode): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_configureJobBoard';
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
        this.loading = true;
        this.jobService.deleteJobBoardConfigue('?jobBoardConfiguraitonId=' + val).subscribe(
          (data: any) => {
            this.active = false;
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              //this.getJobBoardItemsList(this.jobBoardId, this.categoryId, this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
              this.clickJobCategorygetItems(this.category);
              this.loading = false;
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });
  }


  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Anup
    @When: 3-july-2021
    @Why:EWM-1807 EWM-1976
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
    this.jobService.getJobBoardItemsList(this.jobBoardId, this.categoryId, this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          this.gridView = repsonsedata.Data.JobBoardConfigurationDetails;
          this.listData = repsonsedata.Data.JobBoardConfigurationDetails;
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



  onGridView(): void {
    //let JobBoardConfigurationDetails={};
      // const quickJobRequest = JSON.stringify(this.createRequest())
      //console.log("value:",this.jobBoardForm.value.EWMItemList);
      // requestData.JobBoardId = this.jobBoardId;
      // requestData.JobBoardCategoryId = this.categoryId;
      // requestData.JobBoardItemId = this.jobBoardItemId;
      // requestData.JobBoardItemName = this.jobBoardItemName;
      // requestData.EWMItemList = this.jobBoardForm.value.EWMItemList;
      this.jobBoardForm.value.EWMItemList.forEach(element => {
        
        this.gridView.push({
          "Id":0,
          "JobBoardId": this.jobBoardId, 
          "JobBoardCategoryId": this.categoryId,
          "JobBoardItemId": this.jobBoardItemId,
          "JobBoardItemName": this.jobBoardItemName,
          "EwmItemId": element.Id,
          "EWMItemName": element.Name
          });

         // this.JobBoardItemList;
          const index = this.EWMItemListData.findIndex(x => x.Id === element.Id);
          if (index !== -1) {
            this.EWMItemListData.splice(index, 1);
          } 
          //console.log("gridvaluess:",element.Name);
      });
     
      
          
     
  }

}

