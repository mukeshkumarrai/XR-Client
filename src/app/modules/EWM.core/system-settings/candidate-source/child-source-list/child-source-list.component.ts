
// <!-- //by maneesh ewm-18474 create component for child list when:19/11/2024 -->
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CancelEvent, DataStateChangeEvent, EditEvent, GridComponent, GridDataResult, SaveEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { CandidateSourceService } from 'src/app/modules/EWM.core/shared/services/candidate-source/candidate-source.service';
import { FilterService } from 'src/app/shared/services/commonservice/Filterservice.service';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ButtonTypes } from 'src/app/shared/models';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {  CandidateSource, CandidateSourceList } from 'src/app/shared/models/candidate-source.model';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
const createFormGroup = dataItem => new FormGroup({
  'ApplicationSource': new FormControl(dataItem?.ApplicationSource,[Validators.required, Validators.maxLength(50)]),
  'Description': new FormControl(dataItem?.Description, [Validators.required, Validators.maxLength(100)]),
  'ApplicationSourceKey': new FormControl(dataItem?.ApplicationSourceKey)
});


@Component({
  selector: 'app-child-source-list',
  templateUrl: './child-source-list.component.html',
  styleUrls: ['./child-source-list.component.scss']
})
export class ChildSourceListComponent implements OnInit {

  public loading = false;
  loadingSearch: boolean;
  searchValue: string = "";
  animationVar: any;
  searchSubject$ = new Subject<any>();
  private destroySubject: Subject<void> = new Subject();
  public userpreferences: Userpreferences;
  public gridView: GridDataResult = { data: [], total: 0 };
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
  clearcache: string = '';
  public sizes = [];
  auditParameter: string;
  public pageValue = '';
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public parentId: number;
  @Input() SourceId:number;
  private editedRowIndex: number;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5,
  };
  candidateSourceList:CandidateSourceList;
  public formGroup: FormGroup;
  public maxlength:boolean=false;
  public whitespace:boolean=false;
  dataItem:any={};
  maxlengthDescription:boolean=false;
  whitespaceDescription:boolean=false;
  public isResponseGet: boolean = false;

  constructor(
    private translateService: TranslateService,
    public dialog: MatDialog,
    private candidateSourceService: CandidateSourceService,
    public filterQueryService: FilterService,
    public _userpreferencesService: UserpreferencesService,
    private routes: ActivatedRoute,
    private route: Router,
    public _sidebarService: SidebarService,
    private snackBService: SnackBarService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private commonserviceService: CommonserviceService,
  ) {
   }

  ngOnInit(): void {
    const URL = this.route.url;
    const URL_AS_LIST = URL.split('/');
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);

    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.parentId=this.SourceId;    
    this.routes.queryParams.subscribe(params => {
      if (params?.SourceId != undefined && params?.SourceId != null && params?.SourceId != '') {
        this.parentId = params?.SourceId;
      }
    });
    this.state = { ...this.initialstate };
    this.sendRequest(this.state);
    this.animationVar = ButtonTypes;
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loading = true;
      this.sendRequest(this.state);
    });

    this.router.queryParams.subscribe(
      params => {
        if (params?.SourceId != undefined && params?.SourceId != null && params?.SourceId != '') {
          // this.getSourceFormId(params?.SourceId);
        }  
      })
  }
  getSourceFormId(sourceID: number){
    this.loading=true;
    this.candidateSourceService.getCandidateSourceByID('?SourceId=' + sourceID)
    .subscribe(
      (data: any) => {
        this.loading=false;
        if (data.HttpStatusCode === 200) {
          // this.IsSystemDefined=data.Data[0]?.IsSystemDefined,
          this.candidateSourceList.From=data.Data[0] as CandidateSource;
          this.formGroup.patchValue({
            sourceId:this.candidateSourceList.From?.SourceId,
            sourceName: this.candidateSourceList.From?.ApplicationSource,
            sourceDescription:this.candidateSourceList.From?.Description
          });
        }
      }, err => {
        this.loading = false;
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

  onFilterClear() {
    this.searchValue = '';
    this.onFilter();
  }

  refreshComponent() {
    this.sendRequest(this.state);
  }

  mouseoverAnimation(matIconId: string, animationName: string) {
    const amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }

  mouseleaveAnimation(matIconId: string, animationName: string) {
    document.getElementById(matIconId).classList.remove(animationName);
  }

  public onDataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    // this.gridState = state;
    this.sendRequest(state);
  }

  public sendRequest(state: State): void {
    this.candidateSourceService.getCandidateSourceChildList(state, this.searchValue, this.parentId).pipe(takeUntil(this.destroySubject)).subscribe(
      (repsonsedata: GridDataResult) => {
        this.clearcache = '';
        this.gridView = repsonsedata;        
        this.loading = false;
        this.isResponseGet = false;
      }
    );
  }

  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;

    if (element.nodeName === 'TD') {
      const attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && !Number.isNaN(parseInt(attrr)) && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
          this.tooltipDir.hide();
        } else {
          if (element.innerText == '') {
            this.tooltipDir.hide();
          } else {
            this.tooltipDir.toggle(element);
          }
        }
      } else {
        this.tooltipDir.hide();
      }
    } else if (element.nodeName === 'SPAN' || element.nodeName === 'A') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
        this.tooltipDir.hide();
      } else {
        if (element.innerText == '') {
          this.tooltipDir.hide();
        } else {
          this.tooltipDir.toggle(element);
        }
      }
    } else {
      this.tooltipDir.hide();
    }
  }

  openQuickCandidateModal() {
    this.route.navigate(['/client/core/system-settings/manage-candidate-source'], { queryParams: { type: 'Add' } });
  }

  openchildList(SourceId: number) {
    this.route.navigate(['/client/core/system-settings/candidate-source/candidate-child-source'], { queryParams: { SourceId: SourceId } });
  }

  openchildListPage(SourceId: number) {
    this.route.navigate(['/client/core/system-settings/candidate-source/child-source-list'], { queryParams: { SourceId: SourceId } });
  }
  
    //by maneesh ewm-18474 when:18/11/2024 handel whitespace
    noWhitespaceValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const isWhitespace = (control.value || '')?.trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
      };
    }

    public editHandler({ sender, rowIndex, dataItem }) { 
      this.dataItem=dataItem;
      this.SourceId=dataItem?.SourceId;
      this.whitespaceDescription=false;
      this.closeEditor(sender);
      this.formGroup = createFormGroup(dataItem);
      this.editedRowIndex = rowIndex;
      sender.editRow(rowIndex, this.formGroup);
  }


  getValue(data){    
     if (this.formGroup.controls.ApplicationSource.value.trim()?.length==0) {
    this.maxlength=false;
    this.whitespace=true;
    this.formGroup.get('ApplicationSource').setValidators([this.noWhitespaceValidator()]);  
    this.formGroup.controls.ApplicationSource.updateValueAndValidity();
    }else{
    this.maxlength=false;
    }
    if (this.formGroup.controls.ApplicationSource.value.trim()?.length>50) {
      this.maxlength=true;
      this.whitespace=false;
      this.formGroup.get('ApplicationSource').setValidators([Validators.maxLength(50)]); 
      this.formGroup.controls.ApplicationSource.updateValueAndValidity();
      }else{
      this.maxlength=false;
      this.whitespace=false;
      this.formGroup.valid;
      }
  }
  getValueDescription(data){
   this.whitespaceDescription=false;
    if (this.formGroup.controls.Description.value.trim()?.length==0) {
   // this.noWhitespaceValidator();
   this.maxlengthDescription=false;
   this.whitespaceDescription=true;

   this.formGroup.get('Description').setValidators([this.noWhitespaceValidator()]);  
   this.formGroup.controls.Description.updateValueAndValidity();   
   }else{
   this.maxlengthDescription=false;
   }
   if (this.formGroup.controls.Description.value.trim()?.length>100) {
     this.maxlengthDescription=true;
     this.whitespaceDescription=false;
     this.formGroup.get('Description').setValidators([Validators.maxLength(100)]); 
     this.formGroup.controls.Description.updateValueAndValidity();
     }else{
     this.maxlengthDescription=false;
     this.whitespaceDescription=false;
    // this.formGroup.valid;
     }
     if (this.formGroup.controls.Description.value.trim()?.length==0) {
      // this.noWhitespaceValidator();
      this.maxlengthDescription=false;
      this.whitespaceDescription=true;
   
      this.formGroup.get('Description').setValidators([this.noWhitespaceValidator()]);  
      // this.formGroup.controls.Description.updateValueAndValidity();      
      }
 }
  setFormGroupInvalid() {
    this.formGroup.setErrors({ invalidGroup: true });
  }
  setFormGroupMaxlength() {
    this.formGroup.setErrors({ MaxlengthGroup: true });
  }
  
  public cancelHandler({ sender, rowIndex }) {
      this.closeEditor(sender, rowIndex);
  }

  
  private closeEditor(grid, rowIndex = this.editedRowIndex) { 
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
}

    public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void { 
     
      const product = formGroup.value;  
      this.onSave(product)  
      sender.closeRow(rowIndex);
    }


    onSave(value) {  
      if (this.formGroup.invalid) {
        return;
      }
      this.isResponseGet = true;
      this.loading=true;
      let addObj = [];
      let fromObj = {};
      let toObj = {};
      toObj['SourceId'] = this.SourceId;
      toObj['Description'] = value?.Description?.trim();
      toObj['ApplicationSource'] = value?.ApplicationSource?.trim();
      toObj['ApplicationSourceKey']=this.dataItem?.ApplicationSourceKey;
      fromObj['SourceId'] = this.SourceId;
      fromObj['ApplicationSource'] = this.dataItem?.ApplicationSource;
      fromObj['Description'] = this.dataItem?.Description;
      fromObj['ApplicationSourceKey']=this.dataItem?.ApplicationSourceKey;
      addObj = [{
        "From": fromObj,
        "To": toObj
      }];
      this.candidateSourceService.updateCandidateSource(addObj[0]).subscribe(
        repsonsedata => {
          this.loading = false;
          this.isResponseGet = false;
          this.commonserviceService.refreshchildSourceData.next({childSource:true});
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          // if (repsonsedata.HttpStatusCode == 200) {
          //   this.route.navigate(['./client/core/system-settings/candidate-source']);
          // }
         this.sendRequest(this.state);
        }, err => {
          this.loading = false;
          this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
}
