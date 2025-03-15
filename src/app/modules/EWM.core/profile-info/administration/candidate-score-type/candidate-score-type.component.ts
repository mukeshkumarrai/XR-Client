/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 10-Aug-2021
  @Why: EWM-2442
  @What:  This page will be use for the score type template Component ts file
*/
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ExperienceMaster } from '../../../shared/datamodels/experience';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ScoreTypeService } from 'src/app/modules/EWM.core/shared/services/candidate/score-type.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-score-type',
  templateUrl: './candidate-score-type.component.html',
  styleUrls: ['./candidate-score-type.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class CandidateScoreTypeComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
public ActiveMenu: string;
public selectedSubMenu: string;
public sideBarMenu: string;
public active = false;
public loading: boolean;
//for pagination and sorting
public ascIcon: string;
public descIcon: string;
public sortingValue: string = "ScoreTypeName,asc";
public sortedcolumnName: string = 'ScoreTypeName';
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
public auditParameter;
public idScoreType = '';
public idName = 'Id';
public userpreferences: Userpreferences;
pageLabel: any = "label_scoreType";
public listDataview: any[] = [];
public next: number = 0;
// animate and scroll page size
pageOption: any;
animationState = false;
// animate and scroll page size
animationVar: any;
public isCardMode:boolean = false;
public isListMode:boolean = true;
searchSubject$ = new Subject<any>();
  getScoreTypeData: Subscription;

/* 
@Type: File, <ts>
@Name: constructor function
@Who: Nitin Bhati
@When: 10-Aug-2021
@Why: EWM-2442
@What: For injection of service class and other dependencies
*/
constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
  public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
  private translateService: TranslateService, private _scoreTypeService: ScoreTypeService, public _userpreferencesService: UserpreferencesService,private appSettingsService:AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
  this.pageSize = this._appSetting.pagesize;
  this.pageOption = this._appSetting.pageOption;
  this.auditParameter = encodeURIComponent('Score Type');
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
  this._sidebarService.activesubMenuObs.next('masterdata');
  let queryParams = this.routes.snapshot.params.id;
  this.idScoreType = decodeURIComponent(queryParams);
  if (this.idScoreType == 'undefined') {
    this.idScoreType = "";
  } else {
    this.idScoreType = decodeURIComponent(queryParams);
  }
  setInterval(() => {
    this.canLoad = true;
    if (this.pendingLoad) {
      this.onScrollDown();
    }
  }, 2000);
  this.ascIcon = 'north';

  this.routes.queryParams.subscribe((params) => {
    if (params['V'] != undefined) {
      this.viewMode = params['V'];
      this.switchListMode(this.viewMode);
    }
  })
  this.getScoreTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idScoreType);
  this.userpreferences = this._userpreferencesService.getuserpreferences();
  this.animationVar = ButtonTypes;
       // who:maneesh,what:ewm-12630 for search data apply debounce,when:08/06/2023
       this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => { 
        this.loadingSearch = true;
        this.getScoreTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idScoreType);
      });
}
 // refresh button onclick method by Piyush Singh
refreshComponent(){
  this.pageNo=1;
  this.getScoreTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idScoreType);
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
@Name: getScoreTypeList function
@Who: Nitin Bhati
@When: 10-Aug-2021
@Why: EWM-2443
@What: For showing the list of Score Type data
*/
getScoreTypeList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience) {
  this.loading = true;
  this.getScoreTypeData=this._scoreTypeService.getScoreTypeList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience).subscribe(
    (repsonsedata: ExperienceMaster) => { 
      if (repsonsedata.HttpStatusCode  === 200) {
        this.animate();
        this.loading = false;
        this.loadingSearch = false;
        this.gridView = repsonsedata.Data;
        this.listData = repsonsedata.Data;
        this.totalDataCount = repsonsedata.TotalRecord;
      // who:maneesh,what:ewm-12630 for search data apply debounce and fixed 204 case,when:08/06/2023
        }else if(repsonsedata.HttpStatusCode === 204){
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = [];
        }else {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loadingscroll = false;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
/*
@Type: File, <ts>
@Name: onScrollDown
@Who: Nitin Bhati
@When: 10-Aug-2021
@Why: EWM-2443
@What: To add data on page scroll.
*/
onScrollDown(ev?) {
  this.loadingscroll = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.gridView.length) {
      this.pageNo = this.pageNo + 1;
      this.fetchScoreTypeMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
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
 @Name: fetchScoreTypeMoreRecord
 @Who: Nitin Bhati
 @When: 10-Aug-2021
 @Why: EWM-2443
 @What: To get more data from server on page scroll.
 */
fetchScoreTypeMoreRecord(pagesize, pagneNo, sortingValue) {
   this._scoreTypeService.getScoreTypeList(pagesize, pagneNo, sortingValue, this.searchVal, this.idName, this.idScoreType).subscribe(
    (repsonsedata: ExperienceMaster) => {
      if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
        this.loadingscroll = false;
        let nextgridView: any = [];
        nextgridView = repsonsedata.Data;
        this.listData = this.listData.concat(nextgridView);
        //Removing duplicates from the concat array by Piyush Singh
        const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
        this.listData = uniqueUsers;
      //  console.log(this.listData,uniqueUsers,"Data")
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
@Name: switchListMode
@Who: Nitin Bhati
@When: 10-Aug-2021
@Why: EWM-2443
@What: To switch between card view to list view.
*/

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
@Who: Nitin Bhati
@When: 10-Aug-2021
@Why: EWM-2443
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
//   if (inputValue.length > 0 && inputValue.length <= 3) {
//     this.loadingSearch = false;
//     return;
//   }
//   this.pageNo = 1;
//   this._scoreTypeService.getScoreTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idScoreType).subscribe(
//     (repsonsedata: ExperienceMaster) => {
//       if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
//         this.loading = false;
//         this.loadingSearch = false;
//         this.gridView = repsonsedata.Data;
//        } else {
//         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
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
@Who: Nitin
@When: 10-Aug-2021
@Why: EWM-2443
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchVal='';
  this.getScoreTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idScoreType);
}
/*
  @Type: File, <ts>
  @Name: DeleteInfo function
  @Who: Nitin Bhati
  @When: 10-Aug-2021
  @Why: EWM-2443
  @What: FOR DIALOG BOX confirmation
*/

DeleteInfo(val,index): void {
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = 'label_scoreType';
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
      this._scoreTypeService.deleteScoreType('?id=' + val).subscribe(
        (data: ExperienceMaster) => {
          this.active = false;
          if (data.HttpStatusCode === 200) {
            this.pageNo = 1;
            this.searchVal = '';
            this.listDataview.splice(index, 1);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.getScoreTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idScoreType);
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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
  @Who: Nitin Bhati
  @When: 10-Aug-2021
  @Why: EWM-2443
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
  this._scoreTypeService.getScoreTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idScoreType).subscribe(
    (repsonsedata: ExperienceMaster) => {
      if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
        document.getElementById('contentdata').scrollTo(0, 0);
        this.loading = false;
        this.gridView = repsonsedata.Data;
        this.listData = repsonsedata.Data;
        this.totalDataCount = repsonsedata.TotalRecord;
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
@When: 20-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getScoreTypeData API 
*/
ngOnDestroy(): void {
  this.getScoreTypeData.unsubscribe();
 
 }
}
