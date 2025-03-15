import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-related-to-module',
  templateUrl: './related-to-module.component.html',
  styleUrls: ['./related-to-module.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class RelatedToModuleComponent implements OnInit {
  public viewMode: string;
  public pageNo: number = 1;
  public pageSize;
  public loadingscroll: boolean;
  public gridView: any = [];
  public formtitle: string = 'grid';
  public loading: boolean;
  public ActiveMenu: string;
  public sideBarMenu: string;
  public selectedSubMenu: string;
  public result: string = '';
  public active = false;
  public searchVal: string = '';
  public sortingValue: string = "RelatedTo,asc";
  public listDataview: any[] = [];
  public searchValue: string = "";
  pagneNo = 1;
  public loadingSearch: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public totalDataCount: any;
  public listData: any = [];
  public sortedcolumnName: string = 'RelatedTo';
  public sortDirection = 'asc';
  public ascIcon: string;
  public descIcon: string;
  pageOption: any;
  public auditParameter;
  public pageLabel: any = "label_relatedToModule";
  public isvisible: boolean;
  public idWeightage = '';
  public userpreferences: Userpreferences;
  // animate and scroll page size
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  searchSubject$ = new Subject<any>();
  getRelatedModuleData: Subscription;


  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService: TextChangeLngService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService, private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.auditParameter = encodeURIComponent('Related to Module');

  }
  ngOnInit(): void {
    let URL = this.router.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    let queryParams = this.routes.snapshot.params.id;
    this.idWeightage = decodeURIComponent(queryParams);
    if (this.idWeightage == 'undefined') {
      this.idWeightage = "";
    } else {
      this.idWeightage = decodeURIComponent(queryParams);
    }
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.ActiveMenu = URL_AS_LIST[3];
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.getRelatedModule(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getRelatedModule(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    });
  }

  /*
  @Type: File, <ts>
  @Name: getRelatedModule list
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: get gridview data
  */
  getRelatedModule(pageSize, pageNo, sortingValue, searchVal) {
    this.loading = true;
    this.getRelatedModuleData = this._SystemSettingService.getRelatedToModule(pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          if (repsonsedata.Data) {
            this.gridView = repsonsedata.Data;
            this.listData = repsonsedata.Data;
            this.totalDataCount = repsonsedata.TotalRecord;
          }
          //comment this  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          this.loading = false;
          this.loadingscroll = false;
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
  @Name: refreshComponent
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: refresh Data
  */
  refreshComponent() {
    this.getRelatedModule(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);

  }

  /*
   @Type: File, <ts>
   @Name: deleteInfo function
   @Who: Adarsh singh
   @When: 11 feb 22
   @Why: EWM-4953
   @What: FOR DIALOG BOX confirmation
  */

  deleteInfo(val, index): void {
    let deleteDataObj = {};
    deleteDataObj['Id'] = val.Id;
    deleteDataObj['CreatedBy'] = val.CreatedBy;
    deleteDataObj['LastUpdated'] = val.LastUpdated;
    deleteDataObj['RelatedTo'] = val.RelatedTo;
    deleteDataObj['StatusName'] = val.StatusName;
    const message = `label_titleDialogContent`;
    const subtitle = 'label_relatedToModule';
    const title = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        this._SystemSettingService.deleteRelatedToModule(deleteDataObj).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.listDataview.splice(index, 1);
              this.searchValue = ''
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.getRelatedModule(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }

          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode)
          })
      } else {
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
      }
    });
  }

  /*
  @Name: onFilter function
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: use for Searching records
  */
  //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  onFilter(value) {
    if (value.length > 0 && value.length < 3) {
      return;
    }
    this.loadingSearch = true;
    this.pageNo = 1;
    //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
    this.searchSubject$.next(value);
  }
  // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023

  // public onFilter(inputValue: string): void {
  // this.loading = false;
  // this.loadingSearch = true;
  // if (inputValue.length > 0 && inputValue.length < 3) {
  //   this.loadingSearch = false;
  //   return;
  // }
  // this.pageNo = 1;
  // this._SystemSettingService.getRelatedToModule(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
  //   (repsonsedata: ResponceData) => {
  //     if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //       this.loading = false;
  //       this.loadingSearch = false;
  //       this.gridView = repsonsedata.Data;
  //     } else {
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
  //       this.loading = false;
  //       this.loadingSearch = false;
  //     }
  //   }, err => {
  //     this.loading = false;
  //     this.loadingSearch = false;
  //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //   })

  // }

  /*
   @Type: File, <ts>
   @Name: clearSearch function
   @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
   @What: FOR clear search data
  */
  clearSearch() {
    this.searchVal = '';
    this.pageNo = 1;
    this.getRelatedModule(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
  }
  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
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
  @Name: fetchMoreRecord
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: To get more data from server on page scroll.
  */

  fetchMoreRecord(pagesize, pagneNo, sortingValue) {
    this.loadingscroll = true;
    this._SystemSettingService.getRelatedToModule(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
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
  @Name: onSort function
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
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
    this._SystemSettingService.getRelatedToModule(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          this.gridView = repsonsedata.Data;
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

  /**
     @(C): Entire Software
     @Type: switchListMode Function
     @Who: Adarsh singh
 @When: 11 feb 22
 @Why: EWM-4953
     @What: This function responsible to change list and card view
    */

  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.isCardMode = true;
      this.isListMode = false;
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.isCardMode = false;
      this.isListMode = true;
      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
      //listHeader.classList.remove("hide");
    }
  }


  /* 
@Type: File, <ts>
@Name: animate delaAnimation function
 @Who: Adarsh singh
@When: 14 feb 22
@Why: EWM-4953
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
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getRelatedModuleData API 
*/
  ngOnDestroy(): void {
    this.getRelatedModuleData.unsubscribe();

  }
}
