import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-revokeaccess',
  templateUrl: './revokeaccess.component.html',
  styleUrls: ['./revokeaccess.component.scss']
})
export class RevokeaccessComponent implements OnInit {
  loadingscroll: boolean = false;
  gridView: any = [];
  loadingSearch: boolean;
  pageNo: number;
  pendingLoad: boolean;
  canLoad: any;
  sortDirection: string;
  ascIcon: string;
  descIcon: string;
  sortingValue: string = 'FileName';
  public userpreferences: Userpreferences;
  loadingPopup: boolean = false;
  isvisible: boolean = false;
  loading: boolean = false;
  totalRecords: number;
  public searchVal: string = '';
  sortedcolumnName: string = 'FileName';
  pagesize: any;
  pagneNo: any = 1;
  searchValue: any = '';

  constructor(public _userpreferencesService: UserpreferencesService, private _services: DocumentService,
    private translateService: TranslateService, private snackBService: SnackBarService, private dialog: MatDialog,
    private _appSetting: AppSettingsService, public dialogRef: MatDialogRef<RevokeaccessComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.pagesize = this._appSetting.pagesize;
    this.pageNo = this._appSetting.pagesize;
  }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.ascIcon = 'north';
    this.getAllData(false, false);
  }

  onSort(columnName) {
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this.getAllData(false, false);
  }
  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      this.pageNo = this.pageNo + 1;
      this.getAllData(true, false);

    } else {
      this.pendingLoad = true;
    }

  }



  getAllData(isScroll: boolean, isSearch: boolean) {
    this.loadingscroll = isScroll;
    this.loadingSearch = isSearch;
    if (!isScroll && !isSearch) {
      this.loading = true;
    }
    this._services.getDataForRevokeAccess(this.pageNo, this.pagesize, this.searchVal, this.data.DocumentId)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (isScroll) {
            let nextgridView = [];
            nextgridView = data.Data;
            this.gridView = this.gridView.concat(nextgridView);
            this.loadingscroll = false;
          } else {
            this.gridView = data.Data;
            this.totalRecords = data.TotalRecord;
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;
          }
        }
        else if (data.HttpStatusCode == 204) {
          if (!isScroll) {
            this.gridView = null;
          }
          this.totalRecords = data.TotalRecord;
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loadingscroll = false;
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

/*
@Type: File, <ts>
@Name: onFilter()
@Who: Adarsh singh
@When: 04-Aug-2022
@Why: EWM-8133
@What: for searching data
*/
  onFilter(searchVal) {
    if (searchVal.length > 0 && searchVal.length < 3) {
      return;
    }
    this.loadingSearch = true;
    this.pageNo = 1;
    this.getAllData(false, true);
  }
  /*
  @Type: File, <ts>
  @Name: onDismiss()
  @Who: Adarsh singh
  @When: 04-Aug-2022
  @Why: EWM-8133
  @What: for clear search data
*/
  onDismiss() {
    document.getElementsByClassName("reovoke_access")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("reovoke_access")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  DeleteInfo(data) {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_RemoveHassAccess';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
      if (dialogResult == true) {
        this._services.deleteAccesssofshareableLink(data).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getAllData(false, false);
            } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      } else {
        this.loading = false;
      }
    });
  }

  /*
 @who: priti
 @when:14-oct-2021
 */
  onFilterClear() {
    this.searchVal = '';
    this.onFilter(this.searchVal);
  }

}
