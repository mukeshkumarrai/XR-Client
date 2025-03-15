import { Component, OnInit,ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Subject } from 'rxjs';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { CandidateSourceService } from 'src/app/modules/EWM.core/shared/services/candidate-source/candidate-source.service';
import { FilterService } from 'src/app/shared/services/commonservice/Filterservice.service';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ButtonTypes } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-candidate-source',
  templateUrl: './candidate-source.component.html',
  styleUrls: ['./candidate-source.component.scss']
})
export class CandidateSourceComponent implements OnInit {

  public loading=false;
  loadingSearch: boolean;
  searchValue: string = "";
  animationVar: any;
  searchSubject$ = new Subject<any>();  
  private destroySubject: Subject<void> = new Subject();
  public userpreferences: Userpreferences;

  public gridView: GridDataResult= { data: [], total: 0 };
  public initialstate: State = {
    skip: 0,
    take: 50,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'ApplicationSource',
      dir: 'asc'
    }],
  };
  public state: State;
  public filterConfig: any;
  clearcache:string='';
  public sizes = [];
  auditParameter: string;
  public pageValue='';

  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  constructor(private translateService: TranslateService,public dialog: MatDialog, private candidateSourceService: CandidateSourceService,
    public filterQueryService:FilterService,public _userpreferencesService: UserpreferencesService,private routes: ActivatedRoute,private route: Router,
    public _sidebarService: SidebarService,private snackBService: SnackBarService,  private commonserviceService: CommonserviceService,
    public dialogModel: MatDialog,
   ){

  }
  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.state = { ...this.initialstate };
    this.sendRequest(this.state);
    this.animationVar = ButtonTypes;
    this.auditParameter='candidate Source'

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loading = true;
      this.sendRequest(this.state);
       });
       this.commonserviceService.refreshchildSource.subscribe(res => {
        if (res?.childSource==true) {
          this.loading = true;
          this.sendRequest(this.state);
        }
      });
  }

  public onFilter(): void {
    if (this.searchValue?.length > 0 && this.searchValue?.length <= 2) {
      this.loading = false;
      return;
    }
    this.state.skip = 0;
	  this.searchSubject$.next(this.searchValue);
  }

  onFilterClear()
  {
    this.searchValue='';
    this.onFilter();
  }

  refreshComponent(){
    //this.loading=true;
    this.sendRequest(this.state);
    
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

  public onDataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.sendRequest(state);
  }

  public sendRequest(state: State): void {
    this.candidateSourceService.getCandidateSourceList(state,this.searchValue).pipe(takeUntil(this.destroySubject)).subscribe(
      (repsonsedata: GridDataResult) => {
       this.clearcache='';
       this.gridView = repsonsedata;
       this.loading = false;
      })
  }

  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;

    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && !Number.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
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
  DeleteCandidateSource(Id: any) {
    const message = 'label_titleDialogContentSiteDomain';
    const title = 'label_candidate_source_delete';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialogModel.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
       this.loading = true;
       this.DeleteCandidateSourceId(Id);
      }
    });
  }
//bymaneesh add application source
DeleteCandidateSourceId(Id){
  this.candidateSourceService.getCandidateSourceDeleteURL(Id).subscribe(
    (data) => {
      if (data.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
         this.sendRequest(this.state);
        } else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
  }

  openQuickCandidateSource() {
    this.route.navigate(['/client/core/system-settings/manage-candidate-source'], { queryParams: { type:'Add' }} )
  }
// end by maneesh add application source
public rowCallback = (context: any) => {
  return {
    'no-detail-icon': context.dataItem.TotalChilds === 0
  };
};
}
