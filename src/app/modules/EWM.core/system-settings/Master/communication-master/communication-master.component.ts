/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup Singh
  @When: 15-May-2021
  @Why: EWM-1448 EWM-1495
  @What:  This page will be use for the People Master Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  providers: [MessageService],
  selector: 'app-communication-master',
  templateUrl: './communication-master.component.html',
  styleUrls: ['./communication-master.component.scss'],
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
export class CommunicationMasterComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  private rtl = false;
  private ltr = true;
  public listData: any[] = [];
  public listCategorydata = [];
  public pageSize = 5;
  public listView: any[];
  public formtitle: string = 'grid';
  public active = false;
  addUserSmsForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public opened = false;
  public usergrpList = [];
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  viewMode: string = "listMode";
  public personTag: string = '';
  public jobTag: string = '';
  public smstemplate: string = '';
  @Input() name: string;
  searchChar: string;
  result: string = '';
  public smstemplateDescriptuion: string = '';
  ckeConfig: any;
  show = false;
  showMore: boolean;
  showLess = false;
  divId;
  activestatus: string = 'Add';
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  loadingscroll: boolean;
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "Name asc";
  public sortedcolumnName: string = 'Name';
  public sortDirection = 'asc';
  isvisible: boolean;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  private targetInput = 'Description';
  public searchValue: string = "";
  public maxCharacterLengthSubHead = 130;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;

  public categoryList: any;
  public index: number;
  public userpreferences: Userpreferences;
  next: number = 0;
  listDataview: any[] = [];
  pageLabel: any = "lablel_peopleMaster";
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  searchSubject$ = new Subject<any>();
  public loadingSearch: boolean;
  getAllCategoryData: Subscription;

  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file

    this.pagesize = this.appSettingsService.pagesize;

    this.auditParameter = encodeURIComponent('Communication Master');

  }
  /* 
 @Type: File, <ts>
 @Name: ngOnInit function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
 @What: For calling 
 */
  ngOnInit(): void {
    let URL = this.route.url;
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

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        // this.reloadApiBasedOnorg();
      }
    })

    this.userpreferences = this._userpreferencesService.getuserpreferences();

    this.getAllCategoryList();
    this.animationVar = ButtonTypes;
    //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList)
    });
  }

  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    })

    ///////geting Data Via Routing from add people Master component///////
    this.routes.queryParams.subscribe((params) => {

      this.viewMode = params['viewModeData'];
    })
    this.switchListMode(this.viewMode);
  }
  //////////////////

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
  @Name: onAdd() function 
  @Who: Anup Singh
  @When: 20-May-2020
  @Why: EWM-1448 EWM-1497
  @What: For Navigate add form and also sending data via routing
  */

  // onAdd() {
  //   let ViewModeDataValue: any = this.viewMode
  //   this.route.navigate(['/client/core/administrators/communication-master/add-communication-master'], {
  //     queryParams: { ViewModeDataValue }
  //   })
  // }

  // refresh button onclick method by Piyush Singh
  refreshComponent() {
    this.pagneNo = 1
    this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList)
  }


  /*
  @Type: File, <ts>
  @Name: onEdit() function 
  @Who: Anup Singh
  @When: 20-May-2020
  @Why: EWM-1448 EWM-1497
  @What: For Navigate Edit form and also sending data via routing
  */
  onEdit(id) {
    let ViewModeDataValue: any = this.viewMode
    this.route.navigate(['/client/core/administrators/communication-master/add-communication-master/' + id], {
      queryParams: { ViewModeDataValue }
    })
  }

  /* 
   @Type: File, <ts>
   @Name: getAllCategoryList function
   @Who: Anup Singh
   @When: 18-May-2020
   @Why: EWM-1448 EWM-1497
   @What: For All Category List
   */

  getAllCategoryList() {
    this.loading = true;
    this.getAllCategoryData=this.systemSettingService.getAllCategory().subscribe(
      repsonsedata => {
        this.animate();
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listCategorydata = repsonsedata['Data'];
          //this.onClickFilterCategoryGetData(this.listCategorydata[0], 0);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })

  }

  /*
     @Type: File, <ts>
    @Name: onClickFilterCategoryGetData
    @Who: Anup Singh
    @When: 15-May-2020
    @Why: EWM-1448 EWM-1495
    @What: For on Click Filter Category Get Data
    */
  onClickFilterCategoryGetData(category: string, indexNo: any) {
    this.pagneNo = 1;
    this.categoryList = category;
    this.index = indexNo;
    this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, category)
    this.loadingscroll = false;

  }
  /* 
  @Type: File, <ts>
  @Name: PeopleMasterContactTypeList function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: service call for creating Sms data
  */
  PeopleMasterContactTypeList(pagesize, pagneNo, sortingValue, searchVal, category) {
    this.loading = true;
    this.systemSettingService.fetchPeopleMasterContactTypeList(pagesize, pagneNo, sortingValue, searchVal, category).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listView = repsonsedata['Data'];
          this.listData = repsonsedata['Data'];
          this.loadingSearch = false;
          // this.reloadListData();
          // this.doNext();
        }  //  who:maneesh,what:ewm-12630 for in  case 204 apply debounce when search data,when:06/06/2023
        else if (repsonsedata['HttpStatusCode'] === 204) {
          this.loadingSearch = false;
          this.listData = repsonsedata['Data'];
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
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
  @Name: PeopleMasterContactTypeList function
   @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: service call for searching Sms data
  */
  //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  PeopleMasterContactTypeListSearch(value) {
    if (value.length > 0 && value.length < 3) {
      return;
    }
    this.loadingSearch = true;
    this.pagneNo = 1;
    this.searchSubject$.next(value);
  }
  // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023

  // PeopleMasterContactTypeListSearch(event: any) {
  //   this.searchChar = event.target.value;
  //   let numberOfCharacters = event.target.value.length;
  //   this.pagneNo = 1;
  //   let maxNumberOfCharacters = 3;
  //   if (numberOfCharacters < 1 || numberOfCharacters > 3) {
  //     if (numberOfCharacters > maxNumberOfCharacters) {
  //       this.loadingPopup = true;
  //       this.listData = []
  //       this.systemSettingService.fetchPeopleMasterContactTypeListSearch(this.categoryList, this.searchChar).subscribe(
  //         repsonsedata => {
  //           this.loadingPopup = false;
  //           this.listData = repsonsedata['Data'];
  //           // this.reloadListData();
  //           // this.doNext();
  //           // this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList)
  //         }, err => {
  //           this.loadingPopup = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //         })
  //     } else {
  //       this.systemSettingService.fetchPeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList,).subscribe(
  //         repsonsedata => {
  //           this.listData = repsonsedata['Data'];
  //           //this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList)
  //           this.loadingPopup = false;
  //         }, err => {
  //           this.loadingPopup = false;
  //           this.loading = false;
  //           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  //         })
  //     }
  //   }
  // }



  /**
    @(C): Entire Software
    @Type: Function
    @Who: Satya Prakash
    @When: 15-Dec-2020
    @Why:  Switch mode List and card
    @What: This function responsible to change list and card view
   */
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.isCardMode = true;
      this.isListMode = false;
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.isCardMode = false;
      this.isListMode = true;
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "listMode";
      this.isvisible = false;
      // listHeader.classList.remove("hide");
      this.animate();
    }

    localStorage.setItem("mode", this.viewMode);
  }

  /* 
  @Type: File, <ts>
  @Name: DeletePeopleMasterContactTypeList function 
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: call Api for delete record using ID.
  */
  public deletestatus: boolean;
  confirmDialog(val: any, index): void {
    const formData = {
      SmsId: val
    };
    const message = `label_titleDialogContent`;
    const subtitle = 'lablel_peopleMaster';
    const title = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
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
        this.systemSettingService.deletePeopleMasterUserContactType(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.listDataview.splice(index, 1);
              this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList);

            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
            this.cancel.emit();
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      } else {
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
      }
    });
  }
  /* 
  @Type: File, <ts>
  @Name: onScrollDown function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: for pagination whenever user scroll down
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
      if (this.totalDataCount > this.listData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.PeopleMasterContactTypeListScroll(this.pagesize, this.pagneNo, this.sortingValue);
      }
      else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }


  /* 
  @Type: File, <ts>
  @Name: PeopleMasterContactTypeListScroll function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: service call for listing sms list data on scroll
  */
  PeopleMasterContactTypeListScroll(pagesize, pagneNo, sortingValue) {
    this.loadingscroll = true;
    this.systemSettingService.fetchPeopleMasterContactTypeList(pagesize, pagneNo, sortingValue, this.searchValue, this.categoryList).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map, obj) => map.set(obj.Id, obj), new Map()).values());
          this.listData = uniqueUsers;
          //  console.log(this.listData,uniqueUsers,"Data")
          this.listView = this.listData;
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
  @Type: File, <ts>
  @Name: onSort function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: This function is used for sorting asc /desc based on column Clicked
  */

  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ' ' + this.sortDirection;
    this.pagneNo = 1;
    this.systemSettingService.fetchPeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          document.getElementById('contentdata').scrollTo(0, 0)
          this.loading = false;
          this.listData = repsonsedata['Data'];
          //this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList)

          this.loadingscroll = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
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
  @Name: reloadApiBasedOnorg function
  @Who: Anup Singh
  @When: 17-May-2020
  @Why: EWM-1448 EWM-1497
  @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.PeopleMasterContactTypeList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.categoryList);
    this.formtitle = 'grid';
  }


  doNext() {
    if (this.next < this.listData.length) {
      //alert('go')
      this.listDataview.push(this.listData[this.next++]);
    }
  }


  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
  reloadListData() {
    this.next = 0;
    this.listDataview = [];
  }

  public onFilterClear(): void {
    this.loadingSearch = false;
    this.searchValue = '';
    this.getAllCategoryList();
  }


  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getAllCategoryData API 
*/
ngOnDestroy(): void {
  this.getAllCategoryData.unsubscribe();

}
}
