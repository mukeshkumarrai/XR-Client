/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:Renu
  @When: 13-July-2021
  @Why: EWM-2104
  @What:  This page will be use for the client tag configuration
*/
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ResponceData } from 'src/app/shared/models';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-client-tag-master',
  templateUrl: './client-tag-master.component.html',
  styleUrls: ['./client-tag-master.component.scss'],
  // animations: [
  //   trigger("flyInOut", [
  //     state("in", style({ transform: "translateX(0)" })),
  //     transition("void => *", [
  //       animate(
  //         '100ms',
  //         keyframes([
  //           style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
  //           style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
  //         ])
  //       )
  //     ]),
  //     transition("* => void", [
  //       animate(
  //         300,
  //         keyframes([
  //           style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
  //           style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
  //         ])
  //       )
  //     ])
  //   ])
  // ]
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})

export class ClientTagMasterComponent implements OnInit {

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
  public sortingValue: string = "DisplaySequence,asc";
  public sortedcolumnName: string = 'DisplaySequence';
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
  public pageLabel: any = "label_clientTag";
  client:any
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  searchSubject$ = new Subject<any>();
  getClientTagListData: Subscription;

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService:TextChangeLngService,
    private translateService: TranslateService, private systemSettingService: ProfileInfoService, private route: ActivatedRoute,private appSettingsService:AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file  
    this.pageSize = this._appSetting.pagesize;
  }

  ngOnInit(): void {
    
    let URL = this.router.url;
    //let URL_AS_LIST = URL.split('/');
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
    this.auditParameter = encodeURIComponent('Client Tag');
    this.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    this.animationVar = ButtonTypes;
  // who:maneesh,what:ewm-12630 for search data apply debounce,when:08/06/2023
   this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => { 
   this.loadingSearch = true;
   this.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
 });
  }


  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;
 
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
    this.pageNo = 1;
    this.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
  }

  /*
 @Type: File, <ts>
 @Name: getClientTagList function
 @Who: Renu
 @When: 13-Jul-2021
 @Why: ROST-2104
 @What: For showing the list of group - status data
*/

  getClientTagList(pageSize, pageNo, sortingValue, searchVal) {
    this.loading = true;
   this.getClientTagListData= this.systemSettingService.getClientTagList(pageSize, pageNo, sortingValue, searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
            //this.reloadListData();
            //this.doNext();
          }
          this.totalDataCount = repsonsedata.TotalRecord;
        } else if(repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.gridViewList = repsonsedata.Data;
           this.loading = false;
          } else {
          this.loading = false;
          this.loadingscroll = false;
          this.loadingSearch = false;

          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Renu
  @When: 13-Jul-2021
  @Why: ROST-2104
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchStatusMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

  /*
 @Type: File, <ts>
 @Name: fetchStatusMoreRecord
 @Who: Renu
 @When: 13-Jul-2021
 @Why: ROST-2104
 @What: To get more data from server on page scroll.
 */

  fetchStatusMoreRecord(pagesize, pagneNo, sortingValue) {
    this.systemSettingService.getClientTagList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingscroll = false;
          if (repsonsedata.Data) {
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data;
            this.listData = this.listData.concat(nextgridView);
            //Removing duplicates from the concat array by Piyush Singh
            const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
            this.listData = uniqueUsers;
            this.gridViewList = this.listData; 
            this.totalDataCount = repsonsedata.TotalRecord;      
          }

        } else if(repsonsedata.HttpStatusCode == '204') {
          this.loading = false;        
          this.totalDataCount = repsonsedata.TotalRecord;          
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
      @Who: Renu
      @When: 13-Jul-2021
      @Why: ROST-2104
      @What: FOR DIALOG BOX confirmation
    */

  confirmDialog(val, viewMode,index): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_clientTag';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.systemSettingService.deletClientTag('?Id=' + val).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              //this.listDataview.splice(index, 1);
              this.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
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
    @Who: Renu
    @When:13-Jul-2021
    @Why:  ROST-2104
    @What: This function responsible to change list and card view
   */
  // switchListMode(viewMode) {
  //   let listHeader = document.getElementById("listHeader");
  //   if (viewMode === 'cardMode') {
  //     this.viewMode = "cardMode";
  //     this.isvisible = true;
  //     this.animate();
  //   } else {

  //     this.viewMode = "listMode";
  //     this.isvisible = false;
  //     this.animate();
  //     //listHeader.classList.remove("hide");
  //   }
  // }

  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
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
@Who: Renu
@When: 13-Jul-2021
@Why: ROST-2104
@What: use for Searching records
*/
// who:maneesh,what:ewm-12630 for search data apply debounce ,when:08/06/2023
      public onFilter(inputValue: string): void {
        if (inputValue.length > 0 && inputValue.length <= 3) {
          this.loadingSearch = false;
          return;
        }
        this.pageNo = 1;
        this.searchSubject$.next(inputValue);
      }
  // public onFilter(inputValue: string): void {
  //   this.loading = false;
  //   this.loadingSearch = true;
  //   if (inputValue.length > 0 && inputValue.length < 3) {
  //     this.loadingSearch = false;
  //     return;
  //   }
  //   this.pageNo = 1;
  //   this.systemSettingService.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //           this.gridViewList = repsonsedata.Data;
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

  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Renu
    @When: 13-Jul-2021
    @Why: ROST-2104
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
    this.systemSettingService.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
          }
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

   /**@what: for animation @by: renu on @date: 03/07/2021 */
   doNext() {
    if (this.next < this.gridViewList.length) {
      this.listDataview.push(this.gridViewList[this.next++]);
    }
  }

  /**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */
  reloadListData() {
    this.next=0;
    this.listDataview=[];
  }

  public onFilterClear(): void {
    this.searchVal='';
    this.getClientTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    
  }


            /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 20-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getClientTagListData API 
*/
ngOnDestroy(): void {
  this.getClientTagListData.unsubscribe();
 
 }
}

