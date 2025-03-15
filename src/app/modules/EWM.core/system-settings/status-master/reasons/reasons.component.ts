/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: resaons.component.ts
  @Who: Renu
  @When: 11-May-2021
  @Why: ROST-1540
  @What: reason master edit/add manage forms
 */

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { reasonMaster, statusMaster } from '../../../shared/datamodels/status-master';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reasons',
  templateUrl: './reasons.component.html',
  styleUrls: ['./reasons.component.scss'],
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
export class ReasonsComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public submitted = false;
  public loading: boolean;
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "Description,asc";
  public sortedcolumnName: string = 'Description';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  public formtitle: string = 'grid';
  public gridViewList: any = []
  public maxCharacterLengthSubHead = 130;
  public viewMode: string;
  public isvisible: boolean;
  public descVal: any;
  public keywordVal: any;
  public statusId: number;
  public searchVal: string = '';
  public totalDataCount: any;
  public loadingSearch: boolean;
  public listData: any = [];
  public groupId: any;
  public auditParameter: string;
  public GroupCode: string;
  public anchorTagLength: any;
  public next: number = 0;
  public listDataview: any[] = [];
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size

  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  public GroupId: any;
  dirctionalLang;
  searchSubject$ = new Subject<any>();


  /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Renu
 @When: 12-May-2021
 @Why: ROST-1540
 @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private appSettingsService: AppSettingsService, private route: ActivatedRoute,
    private translateService: TranslateService, private reasonsService: SystemSettingService,
    @Inject(DOCUMENT) private _document: HTMLDocument,) {
      // page option from config file
      this.pageOption = this.appSettingsService.pageOption;
      // page option from config file
    this.pageSize = this.appSettingsService.pagesize;

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
    this.route.queryParams.subscribe(
      params => {
        this.GroupId = params['GroupId'];                       
        this.GroupCode = params['GroupCode']
        if (params['statusId'] != undefined) {
          this.statusId = params['statusId'];
          this.getReasonList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.statusId,this.GroupId);

        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
          this.switchListMode(this.viewMode);
        }
      });
    this.auditParameter = encodeURIComponent('Reason Master');
    this.animationVar = ButtonTypes;
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getReasonList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.statusId,this.GroupId);
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

  redirect(){
    this.router.navigate(['./client/core/administrators/masterdata']);
  }


  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;

  }
 // refresh button onclick method by Piyush Singh
  refreshComponent(){
    this.pageNo=1;
    this.getReasonList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.statusId,this.GroupId);
  }
  /* 
@Type: File, <ts>
@Name: getReasonList function
@Who: Renu
@When:18-May-2021
@Why: ROST-1540
@What: For showing the list of reason - status data
*/
//who:maneesh,what:ewm-10460 Add this.GroupId in getReasonList when:13/02/2023
  getReasonList(pageSize: any, pageNo: number, sortingValue: string, searchVal: any, statusId: any,GroupId:any) {
    this.loading = true;
    this.reasonsService.getReasonList(pageSize, pageNo, sortingValue, searchVal, statusId,GroupId).subscribe(
      (repsonsedata: reasonMaster) => {  
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data[0].reasons;            
            this.totalDataCount = repsonsedata.TotalRecord;
            this.descVal = repsonsedata.Data[0]['StatusDescription'];
            this.keywordVal = repsonsedata.Data[0]['StatusCode'];
            // this.reloadListData();
            // this.doNext();
            // if(arr?.length==0){
            //   this.loadingSearch = false;
            //       this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'),'400');       
            //        }
          }
        }else if (repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.loading = false;
          this.gridViewList = []
         } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
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
  @Name: switchListMode 
  @Who: Renu
  @When: 11-May-2021
  @Why: EWM-1499
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
  @Name: onScrollDown 
  @Who: Renu
  @When: 12-May-2021
  @Why: EWM-1540
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue, this.statusId,this.GroupId);//who:maneesh,what:ewm-10460 this.GroupId
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
 @Name: fetchMoreRecord
 @Who: Renu
 @When: 12-May-2021
 @Why: EWM-1540
 @What: To get more data from server on page scroll.
 */

  fetchMoreRecord(pagesize, pagneNo, sortingValue, statusId,GroupId) {
    this.loadingscroll=true;

    this.reasonsService.getReasonList(pagesize, pagneNo, sortingValue, this.searchVal, statusId,GroupId).subscribe(
      (repsonsedata: reasonMaster) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingscroll = false;
          this.loading = false;

          if (repsonsedata.Data) {
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data[0].reasons;
            this.gridViewList = this.gridViewList.concat(nextgridView);
            //Removing duplicates from the concat array by Piyush Singh
          // const uniqueUsers = Array.from(this.gridViewList.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          // this.gridViewList = uniqueUsers;
         // console.log(this.gridViewList,uniqueUsers,"Data")
            // this.reloadListData();
            // this.doNext();
          }

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
    @When: 12-May-2021
    @Why: ROST-1540
    @What: FOR DIALOG BOX confirmation
  */

  confirmDialog(val, viewMode,index): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_reason';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        // who:maneesh,EWM-11414 for delete data in job and candidate pass GroupId,when:21/03/2023,
        this.reasonsService.deleteReason('?StatusId=' + this.statusId + '&Id=' + val + '&GroupId=' +this.GroupId).subscribe(
          (data: reasonMaster) => {
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.listDataview.splice(index, 1);
              this.getReasonList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.statusId,this.GroupId)

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
      @When:18-May-2021
      @Why: ROST-1500
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
    this.reasonsService.getReasonList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.statusId,this.GroupId).subscribe(
      (repsonsedata: reasonMaster) => {
        if (repsonsedata.HttpStatusCode === 200) {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data[0].reasons;
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
  /*
  @Name: onFilter function
  @Who: Renu
  @When:18-May-2021
  @Why: EWM-1540
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
  // public onFilter(inputValue: string): void {
  //   this.loading = false;
  //   this.loadingSearch = true;
  //   if (inputValue.length > 0 && inputValue.length < 3) {
  //     this.loadingSearch = false;
  //     return;
  //   }
  //   this.pageNo = 1;
  //   this.reasonsService.getReasonList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.statusId,this.GroupId).subscribe(
  //     (repsonsedata: reasonMaster) => {
  //       if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         if (repsonsedata.Data) {
  //           this.gridViewList = repsonsedata.Data[0].reasons;
  //         }
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

  //<!-- @When: 10-05-2023 @who:Bantee @why: EWM-12342 @what: filter clear -->
  public onFilterClear(): void {
    this.searchVal='';
    this.getReasonList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.statusId,this.GroupId);
  }

//  /**@what: for animation @by: renu on @date: 03/07/2021 */
//  doNext() {
//   if (this.next < this.gridViewList.length) {
//     this.listDataview.push(this.gridViewList[this.next++]);
//   }
// }

// /**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */
// reloadListData() {
//   this.next=0;
//   this.listDataview=[];
// }
}
