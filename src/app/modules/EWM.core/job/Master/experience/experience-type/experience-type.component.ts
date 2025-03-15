/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 24-May-2021
  @Why: EWM-1602
  @What:  This page will be use for the Job Experience template Component ts file
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ExperienceMaster } from '../../../../shared/datamodels/experience';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'app-experience-type',
  templateUrl: './experience-type.component.html',
  styleUrls: ['./experience-type.component.scss'],
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
export class ExperienceTypeComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public result: string = '';
  //public actionStatus: string = 'Add';
  public canLoad = false;
  public pendingLoad = false;
  public pageNo: number = 1;
  public pageSize;
  viewMode: string = 'listMode';
  public isvisible: boolean;
  public maxCharacterLengthSubHead = 130;
  public gridView: any = [];
  public searchVal: string = '';
  public totalDataCount: any;
  public listData: any = [];
  public loadingSearch: boolean;
  public auditParameter;
  public idExperience = '';
  public idName = 'Id';
  public userpreferences: Userpreferences;
  public pageLabel: any = "label_experience";
  public listDataview: any[] = [];
  public next: number = 0;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  public pagneNo = 1;
  dirctionalLang;
  // who:maneesh,what:ewm.10154 fixed sorting icon when:11/01/2023
  // public sortingValue: string = "Name,desc";
  public sortingValue: string = "Name,asc";
  public sortedcolumnName: string = 'Name';
  public sort: any[] = [{
    field: 'Name',
    dir: 'asc'
  }];
  
  searchSubject$ = new Subject<any>();
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  experienceData: Subscription;

  /*
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 24-May-2021
 @Why: EWM-1602
 @What: For injection of service class and other dependencies
  */
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private translateService: TranslateService, private _systemSettingService: JobService, public _userpreferencesService: UserpreferencesService, private appSettingsService:AppSettingsService) {
      // page option from config file
      this.pageOption = this.appSettingsService.pageOption;
      // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.auditParameter = encodeURIComponent('Experience Master');
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
    this.idExperience = decodeURIComponent(queryParams);
    if (this.idExperience == 'undefined') {
      this.idExperience = "";
    } else {
      this.idExperience = decodeURIComponent(queryParams);
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
        // this.viewMode = params['V'];
        // this.switchListMode(this.viewMode);
      }
    })
    this.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
              //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
              this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
                this.loadingSearch = true;
                this.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience);
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
    this.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience);
     
      }

  /*
 @Type: File, <ts>
 @Name: getExperienceList function
 @Who: Nitin Bhati
 @When: 24-May-2021
 @Why: EWM-1602
 @What: For showing the list of Experience data
*/

  getExperienceList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience) {
    this.loading = true;
    this.experienceData=this._systemSettingService.getExperienceList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience).subscribe(
      (repsonsedata: ExperienceMaster) => {  
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
        }else if( repsonsedata.HttpStatusCode ===204){
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
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
  @When: 24-May-2021
  @Why: EWM-1602
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchExperienceMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
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
   @Name: fetchExperienceMoreRecord
   @Who: Nitin Bhati
   @When: 24-May-2021
   @Why: EWM-1602
   @What: To get more data from server on page scroll.
   */

  fetchExperienceMoreRecord(pagesize, pagneNo, sortingValue) {
    // this.loadingscroll=true;
    this._systemSettingService.getExperienceList(pagesize, pagneNo, sortingValue, this.searchVal, this.idName, this.idExperience).subscribe(
      (repsonsedata: ExperienceMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
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
  @When: 24-May-2021
  @Why: EWM-1602
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
  @Who: Nitin Bhati
  @When: 24-May-2021
  @Why: EWM-1602
  @What: use for Searching records
   */
         //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
         onFilter(value)
         {
            if (value.length > 0 && value.length < 3) {
              return;
            }
            this.loadingSearch = true;
            this.pageNo=1;
           //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
           this.searchSubject$.next(value);
         }
         // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  
//   public onFilter(inputValue: string): void {
//     // this.loading = false;
//     this.loadingSearch = true;
//     if (inputValue.length > 0 && inputValue.length <= 3) {
//       this.loadingSearch = false;
//       return;
//     }
// this.searchSubject$.next(inputValue);

//     this.pageNo = 1;
//     this._systemSettingService.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience).subscribe(
//       (repsonsedata: ExperienceMaster) => {
//         if (repsonsedata.HttpStatusCode == '200') {
//           this.loading = false;
//           this.loadingSearch = false;
//           this.gridView = repsonsedata.Data;
//           // this.reloadListData();
//           // this.doNext();

//         } else  if (repsonsedata.HttpStatusCode === 204){
//           this.loading = false;
//         this.loadingSearch = false;
//         this.gridView = repsonsedata.Data;

// // console.log('nnnn');

//         }
//         else {

//           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
//           this.loading = false;
//           this.loadingSearch = false;
//         }
//       }, err => {
//         this.loading = false;
//         this.loadingSearch = false;
//         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

//       })

//   }

  /*
    @Type: File, <ts>
    @Name: DeleteExperienceInfo function
    @Who: Nitin Bhati
    @When: 24-May-2021
    @Why: EWM-1602
    @What: FOR DIALOG BOX confirmation
  */

  DeleteExperienceInfo(val, index): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_experienceMaster';
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
        this._systemSettingService.deleteExperience('?experienceId=' + val).subscribe(
          (data: ExperienceMaster) => {
            this.active = false;
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.searchVal = '';
              this.listDataview.splice(index, 1);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience);
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
    @When: 24-May-2021
    @Why: EWM-1602
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
    this._systemSettingService.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience).subscribe(
      (repsonsedata: ExperienceMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
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
  this.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience);
}
  /**@what: for animation @by: Anup on @date: 04/07/2021 */
  //   doNext() {
  //      if (this.next < this.gridView.length) {
  //      this.listDataview.push(this.gridView[this.next++]);
  //    }
  //  }

  // /**@what: for clearing and reload issues @by: Anup on @date: 04/07/2021 */
  //  reloadListData() {
  //    this.next=0;
  //    this.listDataview=[];
  //  }


      /*
@Name: pageChange function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
public pageChange(event: PageChangeEvent): void {
  this.loadingscroll = true;
  if (this.totalDataCount > this.gridView.length) {
    this.pagneNo = this.pagneNo + 1;
    this.fetchExperienceMoreRecord(this.pageSize, this.pagneNo, this.sortingValue)  
    } else {
    this.loadingscroll = false;
  }
}

    /*
@Name: sortChange function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
public sortChange($event): void {
  this.sortDirection = $event[0].dir;
  if (this.sortDirection == null || this.sortDirection == undefined) {
    this.sortDirection = 'asc';
  } else {
    this.sortingValue = $event[0].field + ',' + this.sortDirection;
  }
  this.pagneNo=1;
  this.getExperienceList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idExperience) 
}

public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
  //console.log("show Tooltip:", e.target as HTMLElement);
  //alert("show tooltip");

  if (element.nodeName === 'TD') {
    var attrr = element.getAttribute('ng-reflect-logical-col-index');
   // console.log("show Tooltip One:");
    if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
        this.tooltipDir.hide();
      //  console.log("show Tooltip two:");
      }
      else {
        if (element.innerText == '') {
          this.tooltipDir.hide();
         // console.log("show Tooltip three:");
        } else {
        //  console.log("show Tooltip four:");
          this.tooltipDir.toggle(element);
        }
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }
  else if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
    if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
      this.tooltipDir.hide();
    //  console.log("show Tooltip five:");
    }
    else {
    //  console.log("show Tooltip six:");
      this.tooltipDir.toggle(element);
    }
  }
  else {
    this.tooltipDir.hide();
  }
}


      /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 19-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the experienceData API 
*/
ngOnDestroy(): void {
  this.experienceData.unsubscribe();
 
 }
}
