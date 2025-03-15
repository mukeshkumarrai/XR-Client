import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { PositionService } from 'src/app/modules/EWM.core/shared/services/position.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-positionmaster',
  templateUrl: './positionmaster.component.html',
  styleUrls: ['./positionmaster.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class PositionmasterComponent implements OnInit {
  getAllPositionData: Subscription;


  constructor(private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService, private positionService: PositionService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    this.auditParameter = encodeURIComponent('Position master');

  }
  loading: boolean;
  loadingSearch: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  private rtl = false;
  private ltr = true;
  public listData: any[] = [];
  public pageSize = 5;
  public listView: any[];
  public formtitle: string = 'grid';
  public active = false;
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
  sortingValue: string = "PositionName,asc";
  public sortedcolumnName: string = 'PositionName';
  public sortDirection = 'asc';
  isvisible: boolean;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  public searchValue: string = "";
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;

  public userpreferences: Userpreferences;
  public pageLabel: any = "label_positionMaster";
  public listDataview: any[] = [];
  public next: number = 0;
  public ModuleName: any;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size

  animationVar: any;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  searchSubject$ = new Subject<any>();

  ngOnInit(): void {
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
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
        this.reloadApiBasedOnorg();
      }
    })
    //  who:bantee,what:ewm-12783 remove console error ,when:16/06/2023

    // this.routes.queryParams.subscribe((params) => {
    //   this.viewMode = params['viewModeData'];
    // })

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
    this.animationVar = ButtonTypes;
    //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
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

  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    });


    this.switchListMode(this.viewMode);
  }


  refreshComponent() {
    this.pagneNo = 1;
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
  }


  getAll(pagesize, pagneNo, sortingValue, searchVal, loader, loaderSerch) {
    this.loading = loader;
    this.loadingSearch = loaderSerch;
    this.getAllPositionData = this.positionService.getAllposition(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.animate();
          this.loading = false;
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listData = repsonsedata['Data'];
          this.loadingSearch = false;
        } else if (repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listData = [];
          this.loadingSearch = false;
        } else {
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
  //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  onSearch(value) {
    if (value.length > 0 && value.length < 3) {
      return;
    }
    this.loadingSearch = true;
    this.pagneNo = 1;
    this.searchSubject$.next(value);
  }
  // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023

  // Search operation through the list for "Reason" method by Piyush Singh
  // onSearch(event: any) {
  //   this.searchChar = event.target.value;
  //   let numberOfCharacters = event.target.value.length;
  //   this.pagneNo = 1;
  //   let maxNumberOfCharacters = 3;
  //   if (numberOfCharacters < 1 || numberOfCharacters >= 3) {
  //     if (numberOfCharacters >= maxNumberOfCharacters) {
  //       this.getAll( this.pagesize, this.pagneNo, this.sortingValue, this.searchChar, false, true);
  //     } else {
  //       this.getAll( this.pagesize, this.pagneNo, this.sortingValue, this.searchChar, false, true);
  //     }
  //   }
  // }


  switchListMode(viewMode) {
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
      this.animate();
    }
  }

  public deletestatus: boolean;
  confirmDialog(val, index): void {

    const message = `label_titleDialogContent`;
    const subtitle = 'label_position';
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
        this.positionService.deletePostion(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.listDataview.splice(index, 1);
              this.searchValue = ''
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false)
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
            this.cancel.emit();
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode)
          })
      } else {
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
      }
    });
  }

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.listData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.ListScroll(this.pagesize, this.pagneNo, this.sortingValue);
      }
      else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }

  ListScroll(pagesize, pagneNo, sortingValue) {
    this.loadingscroll = true;
    this.positionService.getAllposition(pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.listData = this.listData.concat(nextgridView);
          const uniqueUsers = Array.from(this.listData.reduce((map, obj) => map.set(obj.Id, obj), new Map()).values());
          this.listData = uniqueUsers;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }



  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
  }


  reloadApiBasedOnorg() {
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
    this.formtitle = 'grid';
  }

  /**@what: for animation @by: Anup on @date: 04/07/2021 */
  doNext() {
    if (this.next < this.listData.length) {
      this.listDataview.push(this.listData[this.next++]);
    }
  }

  /**@what: for clearing and reload issues @by: Anup on @date: 04/07/2021 */
  reloadListData() {
    this.next = 0;
    this.listDataview = [];
  }
  public onFilterClear(): void {
    this.searchValue = '';
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
  }

  onView(data) {
    //this.jobService.ReasonObs.next({parentId:data.Id,parentName: data.GroupName});
  }


  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getAllPositionData API 
*/
  ngOnDestroy(): void {
    this.getAllPositionData.unsubscribe();

  }
}
