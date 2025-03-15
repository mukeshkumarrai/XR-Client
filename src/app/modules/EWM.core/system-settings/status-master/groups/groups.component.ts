/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: group.compenent.ts
  @Who: Renu
  @When: 13-May-2021
  @Why: ROST-1538.
  @What: groups master .
 */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { groupMaster } from '../../../shared/datamodels/status-master';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
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
export class GroupsComponent implements OnInit {

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
  // who:maneesh,what:change default sorting code ewm-10794,when:27/02/2023
  public sortingValue: string = "Code,asc";
  public sortedcolumnName: string = 'Code';
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
  public gridView: any = []
  public auditParameter;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  public totalDataCount: number;
  public pagneNo = 1;
  public searchVal: string = '';
  public listData: any = [];
  public loadingSearch: boolean;
  public next: number = 0;
  public listDataview: any[] = [];  
  pageLabel: any = "label_subHeadGrupMaster";
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  searchSubject$ = new Subject<any>();
  groupData: Subscription;

/* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Renu
 @When: 13-May-2021
 @Why: ROST-1538
 @What: For injection of service class and other dependencies
*/

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private translateService: TranslateService, private systemSettingService: SystemSettingService, private appSettingsService:AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.auditParameter = encodeURIComponent('Status Master');
  }

  ngOnInit(): void {
    let URL = this.router.url;
   // let URL_AS_LIST = URL.split('/');
   let URL_AS_LIST;
   if(URL.substring(0, URL.indexOf("?"))==''){
    URL_AS_LIST = URL.split('/');
   }else
   {
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
    this.routes.queryParams.subscribe(
      params => {
        if(Object.keys(params).length!=0) {
          this.viewMode = params['V'];
          this.switchListMode(this.viewMode);
        }
      });
    this.getGrupList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    this.animationVar = ButtonTypes;
           //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
   this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
    this.loadingSearch = true;
    this.getGrupList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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

  // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.getGrupList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
      }

  /*
 @Type: File, <ts>
 @Name: getGrupList function
 @Who: Renu
 @When: 17-May-2021
 @Why: ROST-1538
 @What: For showing the list of group data
*/

  getGrupList(pageSize, pageNo, sortingValue, searchVal) {
    this.loading = true;
    this.groupData=this.systemSettingService.getGrupList(pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: groupMaster) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
          // this.reloadListData();
          // this.doNext();
        }else if (repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.loading = false;
          this.gridView = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /**
    @(C): Entire Software
    @Type: switchListMode Function
    @Who: Renu
    @When: 13-May-2021
    @Why:  Rost-1538
    @What: This function responsible to change list and card view
   */

  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.maxCharacterLength = 80;
       this.maxCharacterLengthName = 40;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
      this.isCardMode = false;
      this.isListMode = true;
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
       this.viewMode = "listMode";
       this.isvisible = false;
       this.animate();
       //listHeader.classList.remove("hide");
     }
   }

  /* 
 @Type: File, <ts>
 @Name: onScrollDown function
 @Who: Renu
 @When: 13-May-2021
 @Why: ROST-1538
 @What: for pagination whenever user scroll down
 */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchGroupMoreRecord(this.pageSize, this.pagneNo, this.sortingValue);
      }
      else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
    }
  }

  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Renu
    @When: 13-May-2021
    @Why: ROST-1538
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
    this.systemSettingService.getGrupList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: groupMaster) => {
        if (repsonsedata.HttpStatusCode === 200) {
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
   @Type: File, <ts>
   @Name: fetchGroupMoreRecord
   @Who: Renu
   @When: 11-May-2021
   @Why: EWM-1538
   @What: To get more data from server on page scroll.
   */

  fetchGroupMoreRecord(pagesize, pagneNo, sortingValue) {
    // this.loadingscroll=true;
    this.systemSettingService.getGrupList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: groupMaster) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
        //  console.log(this.listData,uniqueUsers,"Data")
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
  @Name: onFilter function
  @Who: Renu
  @When: 11-May-2021
  @Why: EWM-1538
  @What: use for Searching records
   */
  //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  onFilter(value)
       {
          if (value.length > 0 && value.length < 3) {
            return; 
          }
          this.loadingSearch = true;
          this.pageNo=1;
         //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
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
  //   this.systemSettingService.getGrupList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
  //     (repsonsedata: groupMaster) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         this.gridView = repsonsedata.Data;
  //         // this.reloadListData();
  //         // this.doNext();
  //       } else {

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

  public onFilterClear(): void {
    this.searchVal='';
    this.getGrupList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
  }
  //  /**@what: for animation @by: renu on @date: 03/07/2021 */
  //  doNext() {
  //   if (this.next < this.gridView.length) {
  //     this.listDataview.push(this.gridView[this.next++]);
  //   }
  // }
  // /**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */
  // reloadListData() {
  //   this.next=0;
  //   this.listDataview=[];
  // }


  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the groupData API 
*/
ngOnDestroy(): void {
  this.groupData.unsubscribe();

}
}
