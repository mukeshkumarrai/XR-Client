/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: maneesh
  @When: 25-Aug-2021
  @Why: EWM-8055
  @What:  This page will be use for the state configuration
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
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class StatesComponent implements OnInit {
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
  public sortingValue: string = "StateName,asc";
  public sortedcolumnName: string = 'StateName';
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
  public pageLabel: any = "label_states";
  client:any
  public idstates='';
  public idName='Id';
  public userpreferences: Userpreferences;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  dirctionalLang;
  searchSubject$ = new Subject<any>();
  getStateData: Subscription;

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService:TextChangeLngService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService, private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService, private appSettingsService:AppSettingsService) {
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
    let queryParams = this.routes.snapshot.params.id;
    this.idstates=decodeURIComponent(queryParams);
    if(this.idstates=='undefined'){
      this.idstates="";
    }else{
      this.idstates=decodeURIComponent(queryParams);
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
    this.route.queryParams.subscribe(
      params => {
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
          this.switchListMode(this.viewMode);
        }
      });
    this.auditParameter = encodeURIComponent('States');
    this.getStateAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idstates);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
       //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
   this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
    this.loadingSearch = true;
    this.getStateAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idstates);
   });
  }

  /* 
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: maneesh
  @When: 25-Aug-2021
  @Why: EWM-8055
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
  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;
 
  }
// refresh button onclick method by maneesh
  refreshComponent(){
    this.pageNo=1;
    this.getStateAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idstates);
  }

  /*
 @Type: File, <ts>
 @Name: getStatesAll function
 @Who: maneesh
 @When: 25-Aug-2025
 @Why: EWM-8055.EWM-8385
 @What: For showing the list of states data
*/

getStateAll(pageSize, pageNo, sortingValue, searchVal, idName, idstates) {
    this.loading = true;
    this.getStateData=this._SystemSettingService.getStateAll(pageSize, pageNo, sortingValue, searchVal, idName, idstates).subscribe(
      (repsonsedata: ResponceData) => {  
        if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
          }
          this.totalDataCount = repsonsedata.TotalRecord;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loadingSearch = false;
          this.loading = false;
          this.gridViewList = repsonsedata.Data;
        }
        else {
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
  @Name: onScrollDown function
  @Who: maneesh
  @When: 25-Aug-2025
  @Why: EWM-8055.EWM-8385
  @What: To add data on page scroll.
  */
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList?.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchStatesMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      // this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }
  /*
 @Type: File, <ts>
 @Name: fetchstatesMoreRecord
 @Who: maneesh
 @When: 25-Aug-2025
 @Why: EWM-8055.EWM-8385
 @What: To get more data from server on page scroll.
 */

 fetchStatesMoreRecord(pagesize, pagneNo, sortingValue) {
    this._SystemSettingService.getStateAll(pagesize, pagneNo, sortingValue, this.searchVal, this.idName, this.idstates).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingscroll = false;

          if (repsonsedata.Data) {
            this.totalDataCount = repsonsedata.TotalRecord;
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data;
            this.gridViewList = this.gridViewList.concat(nextgridView);
          }

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.loadingscroll = false;
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
      @Name: deleteState function
      @Who: maneesh
      @When: 25-Aug-2025
      @Why: EWM-8055.EWM-8385
      @What: FOR DIALOG BOX confirmation
    */

    deleteState(val, viewMode): void {
    let statesObj = {};
    statesObj = val;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._SystemSettingService.deleteState(statesObj).subscribe( 
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getStateAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idstates);
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
  /**
    @(C): Entire Software
    @Type: switchListMode Function
    @Who: maneesh
    @When: 25-Aug-2025
    @Why: EWM-8055.EWM-8385
    @What: This function responsible to change list and card view
   */

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
 @Who: maneesh
 @When: 25-Aug-2025
 @Why: EWM-8055.EWM-8385
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
  //   this._SystemSettingService.getStateAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idstates).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         if (repsonsedata.Data) {
  //           this.gridViewList = repsonsedata.Data;
  //         }
          
  //         }else if(repsonsedata.HttpStatusCode === 204){
  //         this.loadingSearch = false;
  //           this.gridViewList = repsonsedata.Data;

  //         }
          
  //         else {

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
 @Who: maneesh
 @When: 25-Aug-2025
 @Why: EWM-8055.EWM-8385
 @What: use Clear for Searching records
*/
  public onFilterClear(): void {
    this.searchVal='';
    this.getStateAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,this.idName, this.idstates);
  }

  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: maneesh
    @When: 25-Aug-2025
    @Why: EWM-8055.EWM-8385
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
    this._SystemSettingService.getStateAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idstates).subscribe(
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
@What: to unsubscribe the getStateData API 
*/
ngOnDestroy(): void {
  this.getStateData.unsubscribe();

}
}
