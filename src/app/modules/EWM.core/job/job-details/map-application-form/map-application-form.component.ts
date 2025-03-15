/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Adarsh singh
  @When: 12-06-22
  @Why: EWM-6970 EWM-7196
  @What: This page is creted for  map-applicarion from 
*/

import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-map-application-form',
  templateUrl: './map-application-form.component.html',
  styleUrls: ['./map-application-form.component.scss']
})
export class MapApplicationFormComponent implements OnInit {
  @Input() JobId: any;
  @Input() JobName: any;
  @Input() WorkflowId: any;
  @Input() WorkflowName: any;
  
  @Output() onMapApplicationForm = new EventEmitter<any>();
  loading: boolean;
  public pageSize;
  public pagneNo = 1;
  // --------@When: 03-Mar-2023 @who:Adarsh singh @why: EWM-10994 Desc- send order by --------
  public sortingValue: string = "ismapped,asc";
  addForm: FormGroup;
  loadingSearch: boolean;
  public searchVal = '';
  loadingscroll: boolean;
  public canLoad = false;
  public totalDataCount: number;
  public pendingLoad = false;
  gridListData: any = [];
  JobTitle: string;
  ApplicationFormId: number;
  candidateId: any;
  public positionMatDrawer: string = 'end';
  checkIsMapedApplication;
  public result: string = '';


  constructor(public dialog: MatDialog,
    private fb: FormBuilder, private snackBService: SnackBarService, private router: Router,
    private route: ActivatedRoute,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private commonServiesService: CommonServiesService,
    private translateService: TranslateService, public _userpreferencesService: UserpreferencesService, private jobService: JobService) {
    this.pageSize = this.appSettingsService.pagesize;
    this.pagneNo = this.appSettingsService.pageOption;

  }

  ngOnInit(): void {
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });

    this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pageSize, this.sortingValue, true);
  }


  /*
  @Type: File, <ts>
  @Name: getApplicationJobMapping function
  @Who: Adarsh singh
  @When: 11-06-22
  @Why: EWM-7196
  @What: For showing data
 */
  getApplicationJobMappingToJobAll(jobId: string, search: string, pageNo: number, pageSize: number, sortingValue: string, isLoader: boolean) {
    if (isLoader) {
      this.loading = true;
    } else {
      this.loading = false;
    }
    this.jobService.getApplicationJobMappingToJob(jobId, search, pageNo, pageSize, sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          let nextgridView = [];
          nextgridView = repsonsedata.Data;
          this.gridListData = this.gridListData.concat(nextgridView);
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
@Name: getApplicationJobMapping function
@Who: Adarsh singh
@When: 11-06-22
@Why: EWM-7196
@What: For showing data
*/
  updateApplicationJobMappingToJobAll() {
    this.loading = true;
    let obj = {};
    obj['JobId'] = this.JobId;
    obj['JobTitle'] = this.JobName;
    obj['ApplicationFormId'] = this.ApplicationFormId;
    obj['ApplicationFormName'] = this.applicationFormName;

    this.jobService.updateApplicationJobMappingToJob(obj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.onMapApplicationForm.emit(true);
          this.getApplicationJobMappingToJobAllWithoutConcat();
          this.loading = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  getApplicationJobMappingToJobAllWithoutConcat() {
    this.pagneNo = 1;
    this.jobService.getApplicationJobMappingToJob(this.JobId, this.searchVal, this.pagneNo, this.pageSize, this.sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridListData = repsonsedata.Data;
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
 @Name: onFilter
 @Who: Adarsh singh
 @When: 11-06-22
 @Why: EWM-7196
 @What: For showing data
  */
  public onFilter(inputValue: string): void {
    this.searchVal = inputValue;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 2) {
      this.loadingSearch = false;
      return;
    }

    this.getApplicationJobMappingToJobAllWithoutConcat();
  }
  /* 
    @Type: File, <ts>
    @Name: onFilterClear
    @Who: Adarsh singh
    @When: 11-06-22
    @Why: EWM-7196
    @What: For clear Filter search value
  */
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchVal = '';
    this.pagneNo = 1;
    this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pageSize, this.sortingValue, true);
  }

  /* 
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Adarsh singh
  @When: 11-06-22
  @Why: EWM-7196
  @What: api call while onScroll page
*/
  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridListData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pageSize, this.sortingValue, false);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

  applicationFormName: string;
  isChecked;
  onApplicationJobMapping(data, i) {
    this.ApplicationFormId = data.Id;
    this.isChecked = i;
    this.alreadyMapedToggleBtn(data);
    this.applicationFormName = data.Name
  }


  /*
    @Type: File, <ts>
    @Name: toggleMapApplication function
    @Who: Adarsh singh
    @When: 13-06-22
    @Why: EWM-7196
    @What: FOR DIALOG BOX confirmation
  */

  toggleMapApplication(data: any): void {

    let folderObj = {};
    folderObj = data;
    const message = this.checkIsMapedApplication.Name + this.translateService.instant('label_isAlreadyMapped');
    const title = 'label_doYouWantTo';
    const subTitle = 'label_ApplicationForm';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
      this.result = dialogResult;
      if (dialogResult == true) {
        this.updateApplicationJobMappingToJobAll();
      } else {
        this.getApplicationJobMappingToJobAllWithoutConcat();
      }
    });
  }

  /*
    @Type: File, <ts>
    @Name: removeMapApplication function
    @Who: Adarsh singh
    @When: 13-06-22
    @Why: EWM-7196
    @What: open popup for removeMapApplication 
  */

  removeMapApplication(data: any): void {
    let folderObj = {};
    folderObj = data;
    const message = '';
    const title = 'Jobsummarypage_mapapplicationform';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        let obj = {};
        obj['JobId'] = this.JobId;
        obj['JobTitle'] = this.JobName;
        // obj['ApplicationFormId'] = this.ApplicationFormId;
        // obj['ApplicationFormName'] = this.applicationFormName;

        this.jobService.updateApplicationJobMappingToJob(obj).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
              this.getApplicationJobMappingToJobAllWithoutConcat();
              this.onMapApplicationForm.emit(true);
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.getApplicationJobMappingToJobAllWithoutConcat();
      }
    });
  }

  /*
  @Type: File, <ts>
  @Name: alreadyMapedToggleBtn function
  @Who: Adarsh singh
  @When: 13-06-22
  @Why: EWM-7196
  @What: open popup for check already exist 
  */
  alreadyMapedToggleBtn(data) {
    let checkIsMaped = this.gridListData.filter(x => x.IsMapped == 1);
    this.checkIsMapedApplication = checkIsMaped[0];

    if (this.checkIsMapedApplication?.IsMapped == 1) {
      if (this.isChecked.checked == false) {
        this.removeMapApplication(data);
      } else {
        this.toggleMapApplication(data);
      }
    }
    else if (data.IsMapped == 0) {
      this.updateApplicationJobMappingToJobAll();
    }
    else {
      // this.updateApplicationJobMappingToJobAll();
    }

  }


  public matDrawerBgClass;
  openDrawerWithBg(value, id) {
    this.matDrawerBgClass = value;
    this.candidateId = id;
  }
  getCandidateMapAppId(id) {
    let navigate = './client/core/administrators/application-form/application-form-configure' + '?Id=' + id;
    window.open(navigate, '_blank');
  }
  dirChange(res) {
    if (res == 'ltr') {
      this.positionMatDrawer = 'end';
    } else {
      this.positionMatDrawer = 'start';
    }
  }

}
