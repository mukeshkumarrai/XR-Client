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
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-skill-group',
  templateUrl: './skill-group.component.html',
  styleUrls: ['./skill-group.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class SkillGroupComponent implements OnInit {
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
  public sortingValue: string = "GroupName,asc";
  public sortedcolumnName: string = 'GroupName';
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
  public loadingSearch: boolean;
  next: number = 0;
  listDataview: any[] = [];
  public pageLabel: any = "label_skillsTag";
  public userpreferences: Userpreferences;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  searchSubject$ = new Subject<any>();
  skillListData: Subscription;

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
    private translateService: TranslateService, private systemSettingService: SystemSettingService,
    public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.auditParameter = encodeURIComponent('Skills Tag');
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
    this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
      this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    });
  }
  // refresh button onclick method by Piyush Singh
  refreshComponent() {
    this.pageNo = 1;
    this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
        this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }

    } else {
      this.pendingLoad = true;
    }
  }

  /*
   @Type: File, <ts>
   @Name: fetchMoreRecord
   @Who: Suika
   @When: 07-September-2021
   @Why: ROST-2693
   @What: To get more data from server on page scroll.
   */

  fetchMoreRecord(pageSize, pagneNo, sortingValue) {

    this.systemSettingService.getskillTagList(pageSize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata) => {

        if (repsonsedata['HttpStatusCode'] == '200') {

          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.gridData = this.gridData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.gridData.reduce((map, obj) => map.set(obj.Id, obj), new Map()).values());
          this.gridData = uniqueUsers;
          // console.log(this.gridData,uniqueUsers,"Data")
          // this.reloadListData();
          // this.doNext();
        } else if (repsonsedata['HttpStatusCode'] == '204') {
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
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
  @Name: switchListMode
  @Who: Suika
  @When: 07-September-2021
  @Why: ROST-2693
  @What: To switch between card view to list view.
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

  /*@Type: File, <ts>
  @Name: onFilter function
  @Who: Suika
  @When: 07-September-2021
  @Why: ROST-2693
  @What: use for Searching record
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
  //  public onFilter(inputValue: string): void {
  //    this.loadingSearch = true;
  //    if (inputValue.length > 0 && inputValue.length < 3) {
  //     this.loadingSearch = false;
  //      return;
  //    }
  //    this.pageNo = 1;
  //    this.systemSettingService.getskillTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
  //      repsonsedata => {
  //        if (repsonsedata['HttpStatusCode'] == '200') {
  //          this.loadingSearch = false;
  //          this.gridData = repsonsedata['Data'];        
  //        }else if(repsonsedata['HttpStatusCode'] == '204') {
  //          this.gridData = [];    
  //          this.totalDataCount = repsonsedata['TotalRecord'];
  //          this.loading = false;     
  //          this.loadingSearch = false;   
  //         }else{
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
  //           this.loading = false;
  //           this.loadingSearch = false;
  //         }
  //      }, err => {
  //        if (err.StatusCode == undefined) {
  //          this.loadingSearch = false;
  //        }
  //        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //        this.loadingSearch = false;
  //      })
  //  }
  /*
@Name: onFilterClear function
@Who: Nitin
@When: 22-Sep-2021
@Why: EWM-2939
@What: use Clear for Searching records
*/
  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchVal = '';
    this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
    const subTitle = 'label_skillTag';
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
        this.systemSettingService.deleteSkillTagById(data).subscribe(
          (data: ResponceData) => {
            this.active = false;
            if (data.HttpStatusCode == 200) {
              this.pageNo = 1;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
  }



  /*
 @Type: File, <ts>
 @Name: skillsList function
 @Who: Suika
 @When: 07-September-2021
 @Why: ROST-2693
 @What: service call for get list for skills data
 */

  skillsList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.skillListData = this.systemSettingService.getskillTagList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.animate();
          this.loading = false;
          this.gridData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loadingSearch = false;
        } else if (repsonsedata.HttpStatusCode == '204') {
          this.gridData = repsonsedata.Data;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.totalDataCount = 0;
          this.loading = false;
          this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
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
    this.skillsList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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

  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the skillListData API 
*/
  ngOnDestroy(): void {
    this.skillListData.unsubscribe();

  }

}




