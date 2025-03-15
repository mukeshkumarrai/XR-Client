/*
  @Type: File, <ts>
  @Name: salary-band.component.ts
  @Who: Renu
  @When: 18-June-2021
  @Why:EWM-1860
  @What: salary Band master list data
 */

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
@Component({
  selector: 'app-salary-band',
  templateUrl: './salary-band.component.html',
  styleUrls: ['./salary-band.component.scss'],
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
export class SalaryBandComponent implements OnInit {


  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "SalaryBandName,asc";
  public sortedcolumnName: string = 'SalaryBandName';
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
  public pageLabel : any = "label_salaryBand";
  next: number = 0;
  listDataview: any[] = [];
   // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size
   animationVar: any;
   public isCardMode:boolean = false;
   public isListMode:boolean = true;
   dirctionalLang;
   searchSubject$ = new Subject<any>();
  getSalaryBandData: Subscription;
  /*
 @Type: File, <ts>
 @Name: constructor function
 @Who: Renu
 @When: 18-June-2021
 @Why: ROST-1860
 @What: For injection of service class and other dependencies
  */

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, @Inject(DOCUMENT) private _document: HTMLDocument,
    private translateService: TranslateService, private jobMasterService: JobService, private route: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this.appSettingsService.pagesize;
    this.auditParameter = encodeURIComponent('Salary Band');
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

    this.getSalaryBandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    this.animationVar = ButtonTypes;
         //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
         this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
          this.loadingSearch = true;
          this.getSalaryBandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
 @Name: getSalaryBandList function
 @Who: Renu
 @When: 18-June-2021
 @Why: ROST-1860
 @What: For showing the list of group data
*/

getSalaryBandList(pageSize, pageNo, sortingValue, searchVal) {
    this.loading = true;
    this.getSalaryBandData=this.jobMasterService.getSalaryBandList(pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
          // this.reloadListData();
          // this.doNext();
        //  who:maneesh,what:ewm-12630 for apply debounce and handel 204 ,when:08/06/2023
      }else if(repsonsedata['HttpStatusCode'] ===204){
        this.loading = false;
        this.loadingSearch = false;
        this.gridView = repsonsedata.Data;
        this.listData = repsonsedata.Data;
      } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          this.loadingscroll = false;
          this.loading = false;
        this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
// refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.getSalaryBandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
  }


  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Renu
  @When: 18-June-2021
  @Why: EWM-1630
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
   @Who: Renu
   @When: 18-June-2021
   @Why: EWM-1630
   @What: To get more data from server on page scroll.
   */

  fetchGroupMoreRecord(pagesize, pagneNo, sortingValue) {
    // this.loadingscroll=true;
    this.jobMasterService.getSalaryBandList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
          //console.log(this.listData,uniqueUsers,"Data")
          this.gridView = this.listData;
          // this.reloadListData();
          // this.doNext(); 
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
  @Who: Renu
  @When: 18-June-2021
  @Why: EWM-1630
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
  @Name: onFilter function
  @Who: Renu
  @When: 18-June-2021
  @Why: EWM-1630
  @What: use for Searching records
   */
    //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
    onFilter(value){
      if (value.length > 0 && value.length < 3) {
          return;
      }
     this.loadingSearch = true;
     this.pageNo = 1;
     //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
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
  //   this.jobMasterService.getSalaryBandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         this.gridView = repsonsedata.Data;
  //         this.listData = repsonsedata.Data;
  //         // this.reloadListData();
  //         // this.doNext();
  //       } else {

  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
    @Name: confirmDialog function
    @Who: Renu
    @When: 18-June-2021
    @Why: ROST-1860
    @What: FOR DIALOG BOX confirmation
  */

  confirmDialog(val, viewMode,index): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_salaryBand';
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
        this.jobMasterService.deleteSalaryBand('?Id=' + val).subscribe(
          (data: ResponceData) => {
            this.active = false;
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.listDataview.splice(index, 1);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getSalaryBandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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
    @Name: onSort function
    @Who: Renu
    @When: 18-June-2021
    @Why: ROST-1860
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
    this.jobMasterService.getSalaryBandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          // this.reloadListData();
          // this.doNext();
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

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
  this.getSalaryBandList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
}
  // doNext() {
  //   if(this.listData!=null)
  //   {  
  //     if (this.next < this.listData.length) {
  //     this.listDataview.push(this.listData[this.next++]);
  //    }
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
@What: to unsubscribe the getSalaryBandData API 
*/
ngOnDestroy(): void {
  this.getSalaryBandData.unsubscribe();
 
 }
}
