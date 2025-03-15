// <!-- /*
//   @Type: File, <ts>
//   @Name: removeReason.component.ts
//   @Who: Piyush Singh
//   @When: 24-Sept-2021
//   @Why:EWM-2869.EWM-2924
//   @What: remove reason unit master data list
//  */ -->


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
import { BehaviorSubject, Observable } from 'rxjs';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
import { SalaryunitService } from '../../../../shared/services/salary-unit/salaryunit.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { PreviousRouteService } from 'src/app/shared/services/commonservice/previous-route-service.service';
import { JobService } from '../../../../shared/services/Job/job.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';

@Component({
  selector: 'app-remove-reason',
  templateUrl: './remove-reason.component.html',
  styleUrls: ['./remove-reason.component.scss'],
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
export class RemoveReasonComponent implements OnInit {

  constructor(private _salaryUnitServices: SalaryunitService, private systemSettingService: SystemSettingService, private jobService: JobService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,
    public _userpreferencesService: UserpreferencesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file

    this.pagesize = this.appSettingsService.pagesize;

    this.auditParameter = encodeURIComponent('Reasons Landing Page');

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
  sortingValue: string = "ReasonName,asc";
  public sortedcolumnName: string = 'ReasonName';
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
  public pageLabel: any = "label_manageremovereason";
  public listDataview: any[] = [];
  public next: number = 0;
  public GroupName: any = "candidate";
  public GroupId: any;

  public parentId: any;
  public parentName: any;
  public ModuleName: any;

   // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size
   animationVar: any;
   reasonId:any;
   groupName: string;

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

this.routes.queryParams.subscribe((grpName)=>{
  this.groupName = grpName['groupName']
})


    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    localStorage.removeItem("parentId");
    // localStorage.removeItem("parentName");
    this.routes.params.subscribe((params) => {
      this.GroupId = params.id;
    });

    this.routes.queryParams.subscribe((value) => {
      this.GroupId = value.id;
    });

    this.jobService.activeModuleName.subscribe(res => {
      this.ModuleName = res;
    })
    this.ModuleName = localStorage.getItem("moduleName");
    this.jobService.ModuleNameObs.next(this.ModuleName);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
    this.animationVar = ButtonTypes;
  }

 

  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    });


    this.switchListMode(this.viewMode);
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
  refreshComponent() {
    this.pagneNo = 1;
    this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
  }


  //  Get remove reason list method by Piyush Singh
  getAll(GroupId, pagesize, pagneNo, sortingValue, searchVal, loader, loaderSerch) {
    this.loading = loader;
    this.loadingSearch = loaderSerch;
    this.jobService.getAllReasonGroup(GroupId, pagesize, pagneNo, sortingValue, searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.animate();
          this.loading = false;
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listData = repsonsedata['Data'][0].TenantReasons;
          this.parentId = repsonsedata['Data'][0].GroupId;
          // this.parentName = repsonsedata['Data'][0].GroupName;
          localStorage.setItem('parentId', this.parentId);
          localStorage.setItem('moduleName', this.ModuleName);
          this.jobService.ReasonObs.next({ parentId: this.parentId, parentName: this.parentName });
         
          this.loadingSearch = false;
        } else if (repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listData = [];
          this.parentId = repsonsedata['Data'][0].GroupId;
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
  // Search operation through the list for "Reason" method by Piyush Singh
  onSearch(event: any) {
    this.searchChar = event.target.value;
    let numberOfCharacters = event.target.value.length;
    this.pagneNo = 1;
    let maxNumberOfCharacters = 3;
    if (numberOfCharacters < 1 || numberOfCharacters >= 3) {
      if (numberOfCharacters >= maxNumberOfCharacters) {
        this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchChar, false, true);

      } else {
        this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchChar, false, true);
      }
    }
  }

  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
    }
  }

  public deletestatus: boolean;
  confirmDialog(val, index): void {

    let deleteDataObj = {};
    deleteDataObj['Id'] = val.Id;
    deleteDataObj['LastUpdated'] = val.LastUpdated;
    deleteDataObj['ReasonName'] = val.Reason;
    deleteDataObj['Status'] = val.Status;
    deleteDataObj['StatusName'] = val.StatusName;

    const message = `label_titleDialogContent`;
    const subtitle = 'label_manageremovereason';
    const title = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
        this.jobService.deleteReason(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.listDataview.splice(index, 1);
              this.searchValue = ''
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;
              this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false)
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
    this.jobService.getAllReasonGroup(this.GroupId, pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          this.parentId = repsonsedata['Data'][0].GroupId;
          // this.parentName = repsonsedata['Data'][0].GroupName;
          nextgridView = repsonsedata['Data'][0].TenantReasons;
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
    this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
  }
  reloadApiBasedOnorg() {
    this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
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
    this.searchValue = '';
    this.getAll(this.GroupId, this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, true, false);
  }
}


