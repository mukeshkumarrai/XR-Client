/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: job-type.component.ts
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1826
  @What: Job-type master
 */
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
//import { JobCommitment } from '../../../shared/datamodels/Job-commitment';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject, Subscription } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
@Component({
  selector: 'app-job-type-list',
  templateUrl: './job-type-list.component.html',
  styleUrls: ['./job-type-list.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition("* => void", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ])
    ]),
      fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class JobTypeListComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "JobType,asc";
  public sortedcolumnName: string = 'JobType';
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
  public pageLabel : any = "label_JobHead";  
  next: number = 0;
  listDataview: any[] = [];
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;



private subjectKeyUpSearch = new Subject<any>();
  jobTypeData: Subscription;


  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1826
  @What: For injection of service class and other dependencies
  */

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router, private jobService: JobService,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, @Inject(DOCUMENT) private _document: HTMLDocument,
    private translateService: TranslateService, private systemSettingService: SystemSettingService, private route: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this.appSettingsService.pagesize;
    this.auditParameter = encodeURIComponent('Job Type');
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
    this.ActiveMenu = URL_AS_LIST[3];
    this.sideBarMenu = this.ActiveMenu;
    this.selectedSubMenu = URL_AS_LIST[4];
    this._sidebarService.activesubMenuObs.next(this.selectedSubMenu);
    this._sidebarService.subManuGroup.next(this.sideBarMenu);
    this._sidebarService.activesubMenuObs.next('masterdata');  
    this._sidebarService.subManuGroupData.subscribe(value => {
      this.ActiveMenu = value;
    });
    this._sidebarService.activesubMenu.subscribe(value => {
      this.selectedSubMenu = value;
    });
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.route.queryParams.subscribe((params) => {
      if (params['V'] != undefined) {
        this.viewMode = params['V'];
        this.switchListMode(this.viewMode);
      }

    })
    this.userpreferences = this._userpreferencesService.getuserpreferences();

    this.getJobTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    this.animationVar = ButtonTypes;


   ///// for debounce time
    this.subjectKeyUpSearch.pipe(debounceTime(1500),distinctUntilChanged()).subscribe((value)=>{
     // console.log(value)
    this.getFilterData(value)
     })

  }
  // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.getJobTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
  @Name: getJobTypeList function
  @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
  @What: For showing the list of group data
  */

  getJobTypeList(pageSize, pageNo, sortingValue, searchVal) {
    this.loading = true;
    this.jobTypeData=this.jobService.getJobTypeList(pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  public onFilter(inputValue: string): void {
    this.subjectKeyUpSearch.next(inputValue)
  }


  /*
  @Name: onFilter function
  @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
  @What: use for Searching records
   */
  public getFilterData(inputValue: string): void {
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this.jobService.getJobTypeListSearch(inputValue).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
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
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
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
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
   @What: To get more data from server on page scroll.
   */

  fetchGroupMoreRecord(pagesize, pagneNo, sortingValue) {
    // this.loadingscroll=true;
    this.jobService.getJobTypeList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
         // console.log(this.listData,uniqueUsers,"Data")
          this.gridView = this.listData;
          // this.reloadListData();
          // this.doNext();
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
  @Name: switchListMode
  @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
  @What: To switch between card view to list view.
  */

  switchListMode(viewMode) {
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
    }
  }


  /*
    @Type: File, <ts>
    @Name: confirmDialog function
    @Who: Anup
  @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
    @What: FOR DIALOG BOX confirmation
  */

  confirmDialog(val, viewMode,index): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_JobType';
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
        this.loading = true;
        this.jobService.deleteJobType('?Id=' + val).subscribe(
          (data: any) => {
            this.active = false;
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.listDataview.splice(index, 1);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getJobTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
              this.loading = false;
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.loading = false;
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
   @When: 22-june-2021
  @Why: EWM-1738 EWM-1828
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
    this.jobService.getJobTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          this.gridView = repsonsedata.Data;
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
 /*
@Name: onFilterClear function
@Who: Nitin Bhati
@When: 19-Dec-2021
@Why: EWM-2274
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchVal='';
  this.getJobTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
}

  // doNext() {
  //   // alert(this.gridData.length)
  //   if (this.next < this.gridView.length) {
  //     //alert('go')
  //     this.listDataview.push(this.gridView[this.next++]);
  //   }
  // }

  //  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
  //  reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
  // }
    /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 19-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the jobTypeData API 
*/
ngOnDestroy(): void {
  this.jobTypeData.unsubscribe();
 
 }

}