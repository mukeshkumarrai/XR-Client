import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-document-category',
  templateUrl: './document-category.component.html',
  styleUrls: ['./document-category.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class DocumentCategoryComponent implements OnInit {
  loading: boolean = false;
  viewMode: string = 'list';
  pageLabel: string = 'label_document';
  loadingSearch: boolean = false;
  // who:maneesh,what :change sorting coulm name by default UserTypeName, why:ewm-10703 ewm-10788,when:24/02/2023
  sortedcolumnName: string = 'UserTypeName';
  sortDirection: string = 'asc';
  gridView: any = [];
  loadingscroll: boolean = false;
  searchVal: string = '';
  isvisible: boolean = false;
  loadingPopup: boolean = false;
  auditParameter: string;
  pageSize: any = 10;
  pageNo: any = 1;
  public formtitle: string = 'grid';
  // who:maneesh,what :change sortingValue name by default UserTypeName, why:ewm-10703 ewm-10788,when:24/02/2023
  sortingValue: any = 'UserTypeName,asc';
  canLoad: boolean;
  pendingLoad: any;
  ascIcon: string;
  descIcon: string;
  totalDataCount: any;
  public userpreferences: Userpreferences;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode: boolean = false;
  public isListMode: boolean = true;
  dirctionalLang;
  searchSubject$ = new Subject<any>();
  getDocumentCategoryData: Subscription;

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private translateService: TranslateService, private _Service: DocumentCategoryService, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.pageOption = this._appSetting.pageOption;
    this.auditParameter = encodeURIComponent('Document Category');
  }

  ngOnInit(): void {
    let URL = this.router.url;;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon = 'north';
    this.routes.queryParams.subscribe(
      (params: any) => {
        if (Object.keys(params).length != 0) {
          this.viewMode = params['V'];
          this.switchListMode(this.viewMode);
        }
      });

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getList(false);
    this.animationVar = ButtonTypes;
    //  who:maneesh,what:ewm-12630 for apply debounce when search dataUri,when:06/06/2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getList(false);
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


  getList(isScroll) {
    this.getDocumentCategoryData = this._Service.getDocumentCategory(this.pageNo, this.pageSize, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.animate();
          this.loading = false;
          if (isScroll) {
            let nextgridView = [];
            nextgridView = repsonsedata['Data'];
            this.gridView = this.gridView.concat(nextgridView);
            //Removing duplicates from the concat array by Piyush Singh
            const uniqueUsers = Array.from(this.gridView.reduce((map, obj) => map.set(obj.Id, obj), new Map()).values());
            this.gridView = uniqueUsers;

            this.loadingscroll = false;
          }
          else {
            this.gridView = repsonsedata.Data;
            this.loadingSearch = false;
          }
          this.totalDataCount = repsonsedata.TotalRecord;
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
  // refresh button onclick method by Piyush Singh
  refreshComponent() {
    this.pageNo = 1;
    this.getList(false);
  }

  // switchListMode(mode:any)
  // {
  //   if (mode === 'cardMode') {
  //     this.viewMode = "cardMode";
  //     this.isvisible = true;
  //     this.animate();
  //   } else {
  //     this.viewMode = "listMode";
  //     this.isvisible = false;
  //     this.animate();
  //   }
  // }

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

  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.getList(true);
      } else {
        this.loadingscroll = false;
      }



    } else {
      this.pendingLoad = true;
    }
  }
  onFilter(value) {
    if (value.length > 0 && value.length < 3) {
      return;
    }
    this.loadingSearch = true;
    this.pageNo = 1;
    //  this.getList(false);
    //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
    this.searchSubject$.next(value);
  }
  onSort(val) {
    this.sortedcolumnName = val;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this.getList(false);

  }
  DeleteInfo(degreeData: any): void {
    let degreeObj = {};
    degreeObj = degreeData;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_document';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
      if (dialogResult == true) {
        this._Service.delete(degreeObj).subscribe(
          (data: ResponceData) => {
            //this.active = false;
            if (data.HttpStatusCode === 200) {
              this.pageNo = 1;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getList(false);
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
  public onFilterClear(): void {
    this.searchVal = '';
    this.getList(false);
  }

  /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 15-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getDocumentCategoryData API 
*/
  ngOnDestroy(): void {
    this.getDocumentCategoryData.unsubscribe();

  }
}
