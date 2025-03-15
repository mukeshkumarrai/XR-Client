import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridComponent, GridDataResult, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ClientService } from '../../shared/services/client/client.service';
import { AddLeadSourceMasterComponent } from './add-lead-source-master/add-lead-source-master.component';
import { ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from '@app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { RtlService } from '@app/shared/services/commonservice/rtl/rtl.service';
@Component({
  selector: 'app-lead-source-master',
  templateUrl: './lead-source-master.component.html',
  styleUrls: ['./lead-source-master.component.scss']
})
export class LeadSourceMasterComponent implements OnInit {
  public ActiveMenu: string;
  public loading: boolean;
  public pagneNo = 1;
  public buttonCount = 5;
  public info = true;
  public searchValue: string = "";
  public filterCount: number = 0;
  public colArr: any = [];
  public filterConfig: any;
  public sortDirection: string = 'asc';
  public userpreferences: Userpreferences;
  public loadingscroll: boolean;
  public loadingSearch: boolean;
  animationVar: any;
  searchSubject$ = new Subject<any>();
  dirctionalLang;
  gridColConfigStatus: boolean = false;
  loaderStatus: number;
  public columnsWithAction: any[] = [];
  @ViewChild(GridComponent) public grid: GridComponent;
  totalContactCount: number;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  private destroySubject: Subject<void> = new Subject();
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [50, 100, 200];
  public initialstate: State = {
    skip: 0,
    take: 200,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'Name',
      dir: 'asc'
    }]

  };
  public state: State;
  public pageLabel: any = "label_LeadSourceMasterComponent";
  public formtitle: string = 'grid';
  public auditParameter;
  constructor(private clientService: ClientService,
    private snackBService: SnackBarService,
    private translateService: TranslateService,
    public dialog: MatDialog, public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService, private route: Router,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService,
    private _rtlService: RtlService) {
    this.sizes = this.appSettingsService.pageSizeOptions;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.auditParameter = encodeURIComponent('Lead Source');

  }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable.next('1');
    this.state = { ...this.initialstate }
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.animationVar = ButtonTypes;
    this.sendRequest(this.state);
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(searchValue => {   // put this code in ngOnIt section
      this.loadingSearch = true;
      this.sendRequest(this.state);

    });
    this._sidebarService.searchEnable.next('1');
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.sendRequest(state);

  }
  public sendRequest(state: State): void {
    this.loading = true;
    this.clientService.fetchLeadSource(state, this.searchValue).pipe(
      takeUntil(this.destroySubject)
    ).subscribe((response: GridDataResult) => {
      this.data = response;
      this.totalContactCount = response?.total;
      this.loading = false;
      this.loadingSearch = false;
    }, err => {
      this.loading = false;
      this.loadingscroll = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant('label_Opration_failed'), '');
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

  refreshComponent() {
    this.state = { ...this.initialstate }
    this.sendRequest(this.state);

  }

  public onFilter(): void {
    if (this.searchValue?.length > 0 && this.searchValue?.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.state.skip = 0;
    this.searchSubject$.next(this.searchValue);
  }


  onSearchFilterClear() {
    this.searchValue = '';
    this.searchSubject$.next(this.searchValue);

  }


  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('ng-star-inserted') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
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
    else if (element.nodeName === 'SPAN' || element.nodeName === 'A') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
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

  openQuickAddLeadModal() {
    const dialogRef = this.dialog.open(AddLeadSourceMasterComponent, {
      data: new Object({activestatus:'Add' }),
      panelClass: ['xeople-modal-md', 'quickAddLead', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.sendRequest(this.state);
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
  openQuickEditLead(Id) {
    const dialogRef = this.dialog.open(AddLeadSourceMasterComponent, {
      data: new Object({ LeadId: Id,activestatus:'Edit'}),
      panelClass: ['xeople-modal-md', 'quickAddLead', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.sendRequest(this.state);
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
  deleteLead(val): void {
    let docObj = {};
    docObj['id'] = val;
    const message = 'label_Lead_Source_Delete';
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
        this.clientService.deleteLeadSource(val).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.searchValue = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.sendRequest(this.state);
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
    this._rtlService.onModalRTLHandler();

  }
  
}