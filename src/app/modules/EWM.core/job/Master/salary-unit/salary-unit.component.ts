/*
  @Type: File, <ts>
  @Name: salaryunit.component.ts
  @Who: Priti Srivastava
  @When: 24-May-2021
  @Why:EWM-1607
  @What: salary unit job master data
 */
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
import { SalaryunitService } from '../../../shared/services/salary-unit/salaryunit.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { PreviousRouteService } from 'src/app/shared/services/commonservice/previous-route-service.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-salary-unit',
  templateUrl: './salary-unit.component.html',
  styleUrls: ['./salary-unit.component.scss'],
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
export class SalaryUnitComponent implements OnInit {


  loading: boolean;
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
  sortingValue: string = "Name,asc";
  public sortedcolumnName: string = 'Name';
  public sortDirection = 'asc';
  isvisible: boolean =false;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  public searchValue: string = "";
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;

  public userpreferences: Userpreferences;
  public pageLabel: any = "label_salaryunit";
  public listDataview: any[] = [];
  public next: number = 0;
  public loadingSearch: boolean;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  dirctionalLang;
  searchSubject$ = new Subject<any>();
  salaryUnitData: Subscription;

  constructor(private _salaryUnitServices: SalaryunitService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file

    this.pagesize = this.appSettingsService.pagesize;

    this.auditParameter = encodeURIComponent('Salary Unit');

  }

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

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true);
    this.animationVar = ButtonTypes;
     //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
 this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
  this.loadingSearch = true;
  this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true);
});
  }

  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    });

    this.routes.queryParams.subscribe((params) => {
      this.viewMode = params['viewModeData'];
    });
    this.switchListMode(this.viewMode);
  }
  refreshComponent(){
    this.pagneNo=1;
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true);
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

  // onAdd() {
  //   let ViewModeDataValue: any = this.viewMode
  //   this.route.navigate(['/client/core/administrators/salaryunit/add'], {
  //     queryParams: { ViewModeDataValue }
  //   })
  // }

  // onEdit(id) {
  //   let ViewModeDataValue: any = this.viewMode
  //   this.route.navigate(['/client/core/administrators/salaryunit/add/' + id], {
  //     queryParams: { ViewModeDataValue }
  //   })
  // }
  getAll(pagesize, pagneNo, sortingValue, searchVal, loader) {
    this.loading = loader;
    this.salaryUnitData=this._salaryUnitServices.getAll(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      repsonsedata => {        
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
 //  who:maneesh,what:ewm-12630 for apply debounce and handel 204 ,when:08/06/2023
        }else if (repsonsedata['HttpStatusCode'] === 204){
          this.loading = false;
          this.loadingSearch = false;
          this.listData = repsonsedata['Data'];
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
 //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
 onSearch(value){
  if (value.length > 0 && value.length < 3) {
      return;
  }
 this.loadingSearch = true;
 this.pagneNo = 1;
 //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
   this.searchSubject$.next(value);
 }
 // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
  
  // onSearch(event: any) {
  //   this.searchChar = event.target.value;
  //   let numberOfCharacters = event.target.value.length;
  //   this.pagneNo = 1;
  //   this.loadingSearch = true;
  //   if (numberOfCharacters > 0 && numberOfCharacters < 3){
  //     this.loadingSearch = false;
  //     return;
  //   }
  //   this.pagneNo = 1;
  //   this._salaryUnitServices.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchChar).subscribe(
  //     repsonsedata => {
  //       if (repsonsedata['HttpStatusCode'] == '200') {
  //         this.loadingSearch = false;
  //         this.totalDataCount = repsonsedata['TotalRecord'];
  //         this.listData = repsonsedata['Data'];
  //         // this.reloadListData();
  //         // this.doNext();
  //       } else {
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
  //         this.loadingSearch = false;
  //       }
  //     }, err => {
  //       this.loadingSearch = false;
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //     })
  // }

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
      // listHeader?.classList.remove("hide");
      this.animate();
    }
  }

  public deletestatus: boolean;
  confirmDialog(val, index): void {
    const formData = {
      SmsId: val
    };
    const message = `label_titleDialogContent`;
    const subtitle = 'label_salaryunit';
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
        this._salaryUnitServices.delete(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.listDataview.splice(index, 1);
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true)
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

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

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
    this._salaryUnitServices.getAll(pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.listData = this.listData.concat(nextgridView);
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
         // console.log(this.listData,uniqueUsers,"Data")
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



  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true);
  }
  reloadApiBasedOnorg() {
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true);
    this.formtitle = 'grid';
  }

  /**@what: for animation @by: Anup on @date: 04/07/2021 */
  doNext() {
    // console.log(this.gridView.length);
    // console.log(this.listDataview.length);
    // console.log(this.next);
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
    this.searchValue='';
    this.getAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true);
  }

      /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 19-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the salaryUnitData API 
*/
ngOnDestroy(): void {
  this.salaryUnitData.unsubscribe();
 
 }
}
