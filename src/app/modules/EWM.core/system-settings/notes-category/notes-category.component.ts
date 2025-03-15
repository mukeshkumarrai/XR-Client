/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What:  This page will be use for the Note Category configuration
*/
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
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-notes-category',
  templateUrl: './notes-category.component.html',
  styleUrls: ['./notes-category.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class NotesCategoryComponent implements OnInit {

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
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  // who:maneesh,what :change sortingValue  and sortedcolumnName  by default UserTypeName, why:ewm-10703 ewm-10789,when:24/02/2023
  public sortingValue: string = "UserTypeName,asc";
  public sortedcolumnName: string = 'UserTypeName';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public pagneNo = 1;
  public searchVal: string = '';
  public listData: any = [];
  public loadingSearch: boolean;
  public totalDataCount: any;
  public gridViewList: any = [];
  public viewMode: string;
  public isvisible: boolean;
  public auditParameter: string;
  anchorTagLength: any;
  public next: number = 0;
  public listDataview: any[] = [];
  public pageLabel: any = "label_notesCategory";
  client: any
  public idWeightage = '';
  public idName = 'Id';
  public userpreferences: Userpreferences;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  searchSubject$ = new Subject<any>();
  getNotesCategoryData: Subscription;

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService: TextChangeLngService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService,
    private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
  }

  ngOnInit(): void {
    let URL = this.router.url;
    //let URL_AS_LIST = URL.split('/');
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
    this.auditParameter = encodeURIComponent('Notes Category Landing Page');
    this.getWeightageList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idWeightage);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getWeightageList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idWeightage);
    });
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

  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;

  }
  // refresh button onclick method by Piyush Singh
  refreshComponent() {
    this.pageNo = 1;
    this.getWeightageList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idWeightage);
  }

  /*
 @Type: File, <ts>
 @Name: getWeightageList function
 @Who: Nitin Bhati
 @When: 10-Dec-2021
@Why: EWM-4140
 @What: For showing the list of Note Category data
*/

  getWeightageList(pageSize, pageNo, sortingValue, searchVal, idName, idWeightage) {
    this.loading = true;
    this.getNotesCategoryData = this._SystemSettingService.getNotesCategoryList(pageSize, pageNo, sortingValue, searchVal, idName, idWeightage).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
            this.loadingSearch = false;
          }
          this.totalDataCount = repsonsedata.TotalRecord;
          /************************ handle no result found status code 204 @suika@EWM-10630 *************************************/
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.gridViewList = [];
          this.totalDataCount = 0;
          this.loading = false;
          this.loadingSearch = false;
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchNotesCategoryMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
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
 @Name: fetchWeightageMoreRecord
 @Who: Nitin Bhati
 @When: 10-Dec-2021
 @Why: EWM-4140
 @What: To get more data from server on page scroll.
 */

  //@suika @ewm-12234 @why scrolling data reload 
  fetchNotesCategoryMoreRecord(pagesize, pagneNo, sortingValue) {
    this._SystemSettingService.getNotesCategoryList(pagesize, pagneNo, sortingValue, this.searchVal, this.idName, this.idWeightage).subscribe(
      (repsonsedata) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.gridViewList = this.gridViewList.concat(nextgridView);
          const uniqueUsers = Array.from(this.gridViewList.reduce((map, obj) => map.set(obj.Id, obj), new Map()).values());
          this.gridViewList = uniqueUsers;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loadingscroll = false;
      })
  }
  /*
      @Type: File, <ts>
      @Name: deleteWeightage function
      @Who: Nitin Bhati
      @When: 10-Dec-2021
      @Why: EWM-4140
      @What: FOR DIALOG BOX confirmation
    */

  deleteWeightage(val, viewMode): void {
    let weightageObj = {};
    weightageObj = val;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_notesCategory';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._SystemSettingService.deleteNotesCategory(weightageObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getWeightageList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idWeightage);
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
    @Who: Nitin Bhati
    @When: 10-Dec-2021
    @Why: EWM-4140
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
@Name: onFilter function
@Who: Nitin Bhati
@When: 10-Dec-2021
@Why: EWM-4140
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
  //   this.loading = false;
  //   this.loadingSearch = true;
  //   if (inputValue.length > 0 && inputValue.length < 1) {
  //     this.loadingSearch = false;
  //     return;
  //   }
  //   this.pageNo = 1;
  //   this._SystemSettingService.getNotesCategoryList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idWeightage).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         if (repsonsedata.Data) {
  //           this.gridViewList = repsonsedata.Data;
  //         }
  //         this.totalDataCount = repsonsedata.Data.TotalRecord;
  //          /************************ handle no result found status code 204 @suika@EWM-10630 *************************************/
  //         }else if(repsonsedata.HttpStatusCode === 204){
  //           this.gridViewList = [];
  //           this.loading = false;
  //           this.loadingSearch = false;
  //           this.totalDataCount = repsonsedata.Data.TotalRecord;
  //         }else {
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
 @Name: onFilterClear function
 @Who: Nitin Bhati
 @When: 10-Dec-2021
 @Why: EWM-4140
 @What: use Clear for Searching records
 */
  public onFilterClear(): void {
    this.searchVal = '';
    this.getWeightageList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idWeightage);
  }

  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Nitin Bhati
    @When: 10-Dec-2021
    @Why: EWM-4140
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
    this._SystemSettingService.getNotesCategoryList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idWeightage).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
          }
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
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getNotesCategoryData API 
*/
  ngOnDestroy(): void {
    this.getNotesCategoryData.unsubscribe();

  }

}

