/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 13-May-2021
  @Why: EWM-1526
  @What:  This page will be use for the location types template Component ts file
*/
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../../shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { locationMaster } from '../../../shared/datamodels/location-type';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-location-types',
  templateUrl: './location-types.component.html',
  styleUrls: ['./location-types.component.scss'],
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
            style({ opacity: 1, transform: "translateX(0)", offset: 0 }),
            style({ opacity: 1, transform: "translateX(-15px)", offset: 0.7 }),
            style({ opacity: 0, transform: "translateX(100%)", offset: 1.0 })
          ])
        )
      ])
    ]),
      fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class LocationTypesComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
public ActiveMenu: string;
public selectedSubMenu: string;
public sideBarMenu: string;
public active = false;
public loading: boolean;
//for pagination and sorting
public ascIcon: string;
public descIcon: string;
public sortingValue: string = "Name,asc";
public sortedcolumnName: string = 'Name';
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
public groupId='';
public idLocation='';
public idName='Id';
pageOption: any;  
pageSizeOptions: any;
animationState = false;
// animate and scroll page size
animationVar: any;
public isCardMode:boolean = false;
public isListMode:boolean = true;
dirctionalLang;
public pageLabel: any = "label_locationTypes";
searchSubject$ = new Subject<any>();
  getLocationData: Subscription;
// next: number = 0;
// listDataview: any[] = [];
  /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 13-May-2021
 @Why: EWM-1527
 @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService,private routes: ActivatedRoute,
    private translateService: TranslateService, private _systemSettingService: SystemSettingService) {
    this.pageSize = this._appSetting.pagesize;
    this.pageSizeOptions = this._appSetting.pageSizeOptions;
    this.pageOption = this._appSetting.pageOption;
    this.auditParameter=encodeURIComponent('Location Types'); 
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
    let queryParams = this.routes.snapshot.params.id;
    this.idLocation=decodeURIComponent(queryParams);
    if(this.idLocation=='undefined'){
      this.idLocation="";
    }else{
      this.idLocation=decodeURIComponent(queryParams);
    }
      setInterval(() => {
        this.canLoad = true;
        if (this.pendingLoad) {
          this.onScrollDown();
        }
      }, 2000);
      this.ascIcon = 'north';
  
      this.routes.queryParams.subscribe((params)=>{
        if(params['V']!=undefined)
        {
          this.viewMode = params['V'];
          this.switchListMode(this.viewMode);
        }
      })
      this.getLocationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idLocation);
      this.animationVar = ButtonTypes;
         //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
   this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
    this.loadingSearch = true;
    this.getLocationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idLocation);
  });
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



  /*
 @Type: File, <ts>
 @Name: getLocationList function
 @Who: Nitin Bhati
 @When: 19-May-2021
 @Why: EWM-1527
 @What: For showing the list of location type data
*/

getLocationList(pageSize, pageNo, sortingValue, searchVal,idName,idLocation) {
  this.loading = true;
  this.getLocationData=this._systemSettingService.getLocationTypeList(pageSize, pageNo, sortingValue, searchVal, idName, idLocation).subscribe(
    (repsonsedata: locationMaster) => {      
      if (repsonsedata.HttpStatusCode == '200') {
        this.animate();
        this.loading = false; 
        this.loadingSearch = false;
        this.gridView = repsonsedata.Data;
        this.listData = repsonsedata.Data;
        this.totalDataCount = repsonsedata.TotalRecord;
        // this.reloadListData();
        // this.doNext();
      }
       //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
       else if(repsonsedata.HttpStatusCode === 204) { 
        this.loadingSearch = false;
        this.listData = repsonsedata.Data;
        this.loading = false;
       } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loadingscroll = false;
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
@Who: Nitin Bhati
@When: 19-May-2021
@Why: EWM-1527
@What: To add data on page scroll.
*/

onScrollDown(ev?) {
  this.loadingscroll = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.gridView.length) {
      this.pageNo = this.pageNo + 1;
      this.fetchLocationMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      // this.reloadListData();
      // this.doNext();
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
 @Name: fetchLocationMoreRecord
 @Who: Nitin Bhati
 @When: 19-May-2021
 @Why: EWM-1527
 @What: To get more data from server on page scroll.
 */

fetchLocationMoreRecord(pagesize, pagneNo, sortingValue) {
  // this.loadingscroll=true;
  this._systemSettingService.getLocationTypeList(pagesize, pagneNo, sortingValue, this.searchVal,this.idName, this.idLocation).subscribe(
    (repsonsedata: locationMaster) => {
      if (repsonsedata.HttpStatusCode == '200'  || repsonsedata.HttpStatusCode == '204') {
        this.loadingscroll = false;
        let nextgridView: any = [];
        nextgridView = repsonsedata.Data;
        this.listData = this.listData.concat(nextgridView);
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
@Who: Nitin Bhati
@When: 18-May-2021
@Why: EWM-1527
@What: To switch between card view to list view.
*/

// switchListMode(viewMode) {
//   if (viewMode === 'cardMode') {
//     this.viewMode = "cardMode";
//     this.isvisible = true;
//     this.animate();
//   } else {
//     this.viewMode = "listMode";
//     this.isvisible = false;
//     this.animate();
//   }
// }

switchListMode(viewMode){
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
   }
 }

/*
@Name: onFilter function
@Who: Nitin Bhati
@When: 18-May-2021
@Why: EWM-1527
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
//   if (inputValue.length > 0 && inputValue.length <= 3) {
//     this.loadingSearch = false;
//     return;
//   }
//   this.pageNo = 1;
//   this._systemSettingService.getLocationTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idLocation).subscribe(
//     (repsonsedata: locationMaster) => {
//       if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
//         this.loading = false;
//         this.loadingSearch = false;
//         this.gridView = repsonsedata.Data;
//         this.listData = repsonsedata.Data;
//         // this.reloadListData();
//         // this.doNext();

//       } else {

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
  @Type: File, <ts>
  @Name: DeleteLocationInfo function
  @Who: Nitin Bhati
  @When: 18-May-2021
  @Why: EWM-1527
  @What: FOR DIALOG BOX confirmation
*/

DeleteLocationInfo(val,index): void {
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = 'label_locationTypes';
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
      this._systemSettingService.deleteLocationType('?id=' + val).subscribe(
        (data: locationMaster) => {
          this.active = false;
          if (data.HttpStatusCode === 200) {
            this.pageNo = 1;
            this.searchVal='';
            //this.listDataview.splice(index, 1);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.getLocationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idLocation);
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
  @Who: Nitin Bhati
  @When: 18-May-2021
  @Why: EWM-1527
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
  this._systemSettingService.getLocationTypeList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idLocation).subscribe(
    (repsonsedata: locationMaster) => {
      if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
        document.getElementById('contentdata').scrollTo(0, 0);
        this.loading = false;
        this.gridView = repsonsedata.Data;
        this.listData = repsonsedata.Data;
        this.totalDataCount = repsonsedata.TotalRecord;
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
  this.getLocationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idLocation);
}
// reloadListData() {
//   this.next=0;
//   this.listDataview=[];
// } 


// doNext() {
//    if (this.next < this.listData.length) {
//    this.listDataview.push(this.listData[this.next++]);
//   }
// }

// refresh button onclick method by Adarsh Singh
refreshComponent(){
  this.getLocationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idLocation);
}


  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getLocationData API 
*/
ngOnDestroy(): void {
  this.getLocationData.unsubscribe();

}
}