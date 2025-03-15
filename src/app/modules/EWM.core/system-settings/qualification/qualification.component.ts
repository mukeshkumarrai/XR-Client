/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 23-Aug-2021
  @Why: EWM-2595
  @What:  This page will be use for the Qualification configuration
*/
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from 'src/app/shared/models';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable, Subject, Subscription } from 'rxjs';
import { State } from '@progress/kendo-data-query';
import { debounceTime } from 'rxjs/operators';
import { RtlService } from 'src/app/shared/services/commonservice/rtl/rtl.service';
@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class QualificationComponent implements OnInit {
  /** Whether the widget is in RTL mode or not. */
  private isRtl: boolean;

  /** Subscription to the Directionality change EventEmitter. */
  private _dirChangeSubscription = Subscription.EMPTY;
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
  // public sortingValue: string = "QualificationName,asc";
  // public sortedcolumnName: string = 'QualificationName';
  public sortDirection = 'asc';
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  public pagneNo = 1;
  public searchVal: string = '';
  public listData: any = [];
  public loadingSearch: boolean;
  public totalDataCount: any;
  public gridViewList: any = [];
  viewMode: string = 'listMode';
  public isvisible: boolean;
  public auditParameter: string;
  anchorTagLength: any;
  public next: number = 0;
  public listDataview: any[] = [];
  public pageLabel: any = "label_qualification";
  client: any
  public idQualification = '';
  public idName = 'Id';
  public userpreferences: Userpreferences;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  // who:maneesh,what :change sortingValue  and sortedcolumnName  by default QualificationName, why:ewm-10703 ewm-10791,when:24/02/2023
  public sort: any[] = [{
    field: 'QualificationName',
    dir: 'asc'
  }];
  public sortingValue: string = "QualificationName,asc";
  dirctionalLang;

  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  searchSubject$ = new Subject<any>();
  //innerWidths: string='1200';
  innerWidth: any = '1200';
  getQualificationData: Subscription;
  beforegridMenu: boolean=false;
  xPosition;
  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private textChangeLngService: TextChangeLngService,
    private translateService: TranslateService, private _SystemSettingService: SystemSettingService, private route: ActivatedRoute, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private _rtlService:RtlService
  ) {

    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;   
    
  }
  ngOnInit(): void {
    let language = localStorage.getItem("Language");
    if (language === 'ara') {
      this.xPosition='before';
    } else {
      this.xPosition='after';
    }
    let URL = this.router.url;
    //let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    let queryParams = this.routes.snapshot.params.id;
    this.idQualification = decodeURIComponent(queryParams);
    if (this.idQualification == 'undefined') {
      this.idQualification = "";
    } else {
      this.idQualification = decodeURIComponent(queryParams);
    }
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.ActiveMenu = URL_AS_LIST[3];
    // console.log('this.ActiveMenu ', this.ActiveMenu);
    this.onResize(event);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    // this.ascIcon = 'north';
    this.route.queryParams.subscribe(
      params => {
        if (params['V'] != undefined) {
          // this.viewMode = params['V'];
          // this.switchListMode(this.viewMode);
        }
      });
    //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification);
    });

    this.auditParameter = encodeURIComponent('Qualification Master');
    this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    //--@When:18-July-2023,@why:EWM-11815, @who:Nitin Bhati, calling funtion for RTL showing kenod Grid
    this._rtlService.onKendoGridRTLHandler();
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


  ngAfterViewInit() {
    var buttons = document.querySelectorAll('#maindiv a')
    this.anchorTagLength = buttons.length;
    // RTL Code
    //const body: HTMLBodyElement = document.querySelector('body[dir]')
    //--@When: 10-April-2023,@why:EWM-11815, @who:Adarsh singh calling funtion for rtl
   //this._rtlService.onKendoGridRTLHandler();
    // let dir: string;
    // dir = document.getElementsByClassName('k-grid')[0].attributes['dir'].value;
    // let classList = document.getElementsByClassName('k-grid');
    // for (let i = 0; i < classList.length; i++) {
    //   classList[i].setAttribute('dir', 'rtl');
    // }
  }
  overlay(){
    // const body: HTMLBodyElement = document.querySelector('body[dir]');
    // if (body.dir === 'rtl') {
    //   this.xPosition='before';
    // } else {
    //   this.xPosition='after';
    // }
    this.beforegridMenu=true;
    this._rtlService.onOverlayDrawerRTLHandler();
    this.beforegridMenu=true;
  }
  // refresh button onclick method by Piyush Singh
  refreshComponent() {
    this.pageNo = 1;
    this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification);
  }

  /*
 @Type: File, <ts>
 @Name: getQualificationList function
 @Who: Nitin
 @When: 23-Aug-2021
 @Why: EWM-2596
 @What: For showing the list of Qualification data
*/

  getQualificationList(pageSize, pageNo, sortingValue, searchVal, idName, idQualification) {
    this.loading = true;
    this.getQualificationData = this._SystemSettingService.getQualificationList(pageSize, pageNo, sortingValue, searchVal, idName, idQualification).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.animate();
          this.loading = false;

          if (repsonsedata.Data) {
            this.gridViewList = repsonsedata.Data;
            //this.reloadListData();
            //this.doNext();
            //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
          } else if (repsonsedata.HttpStatusCode === 204) {
            this.loading = false;
            this.loadingSearch = false;
            this.gridViewList = repsonsedata.Data;
          }
          this.loadingSearch = false;
          this.totalDataCount = repsonsedata.TotalRecord;

        } else {
          this.loadingSearch = false;
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        }
      }, err => {
        this.loadingSearch = false;
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
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
  @Who: Nitin
  @When: 23-Aug-2021
  @Why: EWM-2596
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridViewList.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchQualificationMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
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
 @Name: fetchQualificationMoreRecord
 @Who: Nitin
 @When: 23-Aug-2021
 @Why: EWM-2596
 @What: To get more data from server on page scroll.
 */

  fetchQualificationMoreRecord(pagesize, pagneNo, sortingValue) {
    this._SystemSettingService.getQualificationList(pagesize, pagneNo, sortingValue, this.searchVal, this.idName, this.idQualification).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingscroll = false;

          if (repsonsedata.Data) {
            this.totalDataCount = repsonsedata.TotalRecord;
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data;
            this.gridViewList = this.gridViewList.concat(nextgridView);
            //Removing duplicates from the concat array by Piyush Singh
            // const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
            // this.listData = uniqueUsers;
            //  console.log(this.listData,uniqueUsers,"Data")
            //  this.gridViewList = this.listData;

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
      @Name: deleteQualification function
      @Who: Nitin
      @When: 23-Aug-2021
      @Why: EWM-2596
      @What: FOR DIALOG BOX confirmation
    */

  deleteQualification(val, viewMode): void {
    // let qualificationObj = {};
    let qualificationObj = val;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_qualification';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._SystemSettingService.deleteQualification(qualificationObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.viewMode = viewMode;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification);
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
    //const body: HTMLBodyElement = document.querySelector('body[dir]');
    //--@When:18-July-2023,,@why:EWM-11815, @who:Nitin Bhati, calling funtion for RTL showing popup
    this._rtlService.onModalRTLHandler();
    //this._rtlService.onModalRTLHandler(body.dir);
    // let dir: string;
    // dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    // let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    // for (let i = 0; i < classList.length; i++) {
    //   classList[i].setAttribute('dir', body.dir);
    // }
  }
  /**
    @(C): Entire Software
    @Type: switchListMode Function
    @Who: Nitin
    @When: 23-Aug-2021
    @Why: EWM-2596
    @What: This function responsible to change list and card view
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

  /*
@Name: onFilter function
@Who: Nitin
@When: 23-Aug-2021
@Why: EWM-2596
@What: use for Searching records
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

  //comment this  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  // public onFilter(inputValue: string): void {
  //   // this.loading = true;
  //   this.loadingSearch = true;
  //   if (inputValue.length > 0 && inputValue.length < 3) {
  //     this.loadingSearch = false;
  //     return;
  //   }
  // this.searchSubject$.next(inputValue);

  //   this.pageNo = 1;
  //   this._SystemSettingService.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200 ) {
  //         this.loading = false;
  //         this.loadingSearch = false;
  //         if (repsonsedata.Data) {
  //           this.gridViewList = repsonsedata.Data;
  //         }
  //         } else  if (repsonsedata.HttpStatusCode === 204){
  //           this.loading = false;
  //         this.loadingSearch = false;
  //         this.gridViewList = repsonsedata.Data;
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
 @Who: Nitin
 @When: 23-Aug-2021
 @Why: EWM-2596
 @What: use Clear for Searching records
 */
  public onFilterClear(): void {
    this.searchVal = '';
    this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification);
  }

  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Nitin
    @When: 23-Aug-2021
    @Why: EWM-2596
    @What: FOR sorting the data
  */

  // onSort(columnName) {
  //   this.loading = true;
  //   this.sortedcolumnName = columnName;
  //   this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  //   this.ascIcon = 'north';
  //   this.descIcon = 'south';
  //   this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
  //   this.pageNo = 1;
  //   this._SystemSettingService.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification).subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode === 200) {
  //         document.getElementById('contentdata').scrollTo(0, 0);
  //         this.loading = false;
  //         if (repsonsedata.Data) {
  //           this.gridViewList = repsonsedata.Data;
  //         }
  //        } else {
  //         this.loading = false;
  //         this.loadingscroll = false;
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

  //       }
  //     }, err => {
  //       this.loading = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //     })
  // }


  /*
@Name: showTooltip function
@Who: maneesh
@When: 27-Sep-2022
@Why: EWM-8840
*/
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
          this.tooltipDir.hide();
        }
        else {
          if (element.innerText == '') {
            this.tooltipDir.hide();
          } else {
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
      }
      else {
        this.tooltipDir.toggle(element);
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }

  /*
@Name: sortChange function
@Who: maneesh
@When: 27-Sep-2022
@Why: EWM-8840
*/
  public sortChange($event): void {
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null || this.sortDirection == undefined) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = $event[0].field + ',' + this.sortDirection;
    }
    this.pagneNo = 1;
    this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification);
  }
  /*
@Name: pageChange function
@Who: maneesh
@When: 27-Sep-2022
@Why: EWM-8840
*/
  public pageChange(event: PageChangeEvent): void {

    this.loadingscroll = true;
    if (this.totalDataCount > this.gridViewList.length) {
      this.pagneNo = this.pagneNo + 1;
      // console.log('this.pagneNo',this.pagneNo);

      this.fetchQualificationMoreRecord(this.pageSize, this.pagneNo, this.sortingValue)
      // this.getQualificationList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idQualification) 

    } else {
      this.loadingscroll = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }



  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getQualificationData API 
*/
  ngOnDestroy(): void {
    this.getQualificationData.unsubscribe();

  }
}