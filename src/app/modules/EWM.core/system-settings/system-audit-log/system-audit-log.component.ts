/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 02-Feb-2021
  @Why: EWM-814
  @What:  This page will be use for the System Audit log Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { saveAs as importedSaveAs } from "file-saver";
import { HttpClient } from '@angular/common/http';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { UserpreferencesService } from '../../../../shared/services/commonservice/userpreferences.service';
import { Userpreferences } from '../../../../shared/models/index';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  providers: [MessageService],
  selector: 'app-system-audit-log',
  templateUrl: './system-audit-log.component.html',
  styleUrls: ['./system-audit-log.component.scss'],
})
export class SystemAuditLogComponent implements OnInit {
  /*
    @Type: File, <ts>
    @Who: Nitin Bhati
   @When: 02-Feb-2021
    @Why: EWM-814
    @What:  Decalaration of Global Variables
  */
  clearbtn: boolean;
  pagesize;
  pageSizeOptions;
  pagneNo = 1;
  totalLength;
  sortingValue: string = "Id desc";
  searchValue: string = "";
  fromDate = '';
  toDate = '';
  fromDateClear = '';
  toDateClear = '';
  filterValue;
  exportTo;
  public sortDirection = 'asc';
  public sortDirectionValue = '';
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  public gridData: any[];
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public pageSizes;
  public previousNext = true;
  public skip = 0;

  public gridView: any[];
  public mySelection: string[] = [];
  public active = false;
  public isNew = false;
  public editDataItem: String;
  auditFrom: FormGroup;
  submitted = false;
  result: string = '';
  formtitle: string = 'Add';
  public loading: boolean;
  public loadingPopup: boolean;
  searchChar: string;
  searchDataList = [];
  private rtl = false;
  private ltr = true;
  changeObject: any;
  oldchangeObject:any;
  public getAPiData: any[];
  public oldRowIndex = -1;
  public maxSubHeadCharacterLengthName = 130;
  public sort: any[] = [{
    field: 'Created',
    dir: 'desc'
  }];
  public userpreferences: Userpreferences;

  maxDate = new Date();

  loadingscroll: boolean;
  canLoad = false;
  pendingLoad = false;  
  notDataAvailable=0;
  public pageName='PageName';
  public pageValue='';
  searchSubject$ = new Subject<any>(); 
  constructor(private translateService: TranslateService, private fb: FormBuilder,
    private systemSettingService: SystemSettingService, private route: Router, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, public dialog: MatDialog, public http: HttpClient,
    private commonserviceService: CommonserviceService,
    public _userpreferencesService: UserpreferencesService,
    private rtlLtrService: RtlLtrService, private messages: MessageService, public elementRef: ElementRef,
    private appSettingsService: AppSettingsService,private routes: ActivatedRoute) {
    this.maxDate.setDate(this.maxDate.getDate());
    this.pagesize = this.appSettingsService.pagesize;
    this.pageSizeOptions = this.appSettingsService.pageSizeOptions;
    this.auditFrom = this.fb.group({
      start: [''],
      end: ['']
    })

  }
  /*
    @Type: File, <ts>
    @Name: ngOnInit function
    @Who: Nitin Bhati
    @When: 3-Feb-2021
    @Why: ROST-814
    @What: for call page loading time
 */
  ngOnInit(): void {
    let URL = this.route.url;
    let queryParams = this.routes.snapshot.params.id;
    this.pageValue=decodeURIComponent(queryParams);

    if(this.pageValue=='undefined'){
      this.pageValue="";
     }else{
      this.pageValue=decodeURIComponent(queryParams);
    }
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    

    // this.http.get("assets/config/App-settings.config.json").subscribe(data => {
    //   data = JSON.parse(JSON.stringify(data));
    //   this.pagesize = data['pagesize'];
    //   this.pageSizeOptions=data['pageSizeOptions'];
    //   this.systemLogList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue,this.fromDate,this.toDate);
    //  });
    this.systemLogList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate, this.pageName, this.pageValue);
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

      // @suika @EWM-14427 @Whn 27-09-2023
      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        this.loading = true;
         this.sendRequest(val);
         });
  }
  /*
      @Type: File, <ts>
      @Name: ngAfterViewInit function
      @Who: Nitin Bhati
      @When: 3-Feb-2021
      @Why: ROST-814
      @What: for call for language direction
   */
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd1, this.search, res);
      if (res == 'rtl') {
        this.messages.notify(this.ltr);
      } else if (res == 'ltr') {
        this.messages.notify(this.rtl);
      }
    })
  }
  get f() { return this.auditFrom.controls; }
  /*
    @Type: File, <ts>
    @Name: systemLogList function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: call Get method from services for showing data into grid.
   */
  systemLogList(pagesize, pagneNo, sortingValue, searchVal, fromDate, toDate,pageName,pageValue) {
    this.loading = true;
    this.systemSettingService.fetchSystemLogList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue).subscribe(
      repsonsedata => {
        this.gridData = repsonsedata['Data'];
        this.gridView = repsonsedata['Data'];
        this.getAPiData = repsonsedata['Data'];
        this.notDataAvailable=repsonsedata['TotalRecord'];
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
      })
  }


  
// @suika @EWM-14427 @Whn 27-09-2023
 public onFilter(inputValue: string): void {
  this.filterValue = inputValue;
  if (inputValue?.length > 0 && inputValue?.length <= 2) {
    this.loading = false;
    return;
  }
  this.searchSubject$.next(inputValue);
}
  /*
    @Type: File, <ts>
    @Name: sendRequest function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: For Filtering Records
  */
  public sendRequest(inputValue: string): void {
    this.filterValue = inputValue.trim(); // Remove whitespace
    this.filterValue = inputValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.systemSettingService.fetchSystemLogListSearch(this.filterValue).subscribe(
      repsonsedata => {
        // this.loadingPopup=false;
        this.gridView = repsonsedata['Data'];
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        //this.loadingPopup=false;
      })
    this.dataBinding.skip = 0;
  }
  /*
    @Type: File, <ts>
    @Name: addHandler
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What:
  */
  public addHandler() {
    this.isNew = true;
  }
  public editHandler({ dataItem }) {
    this.editDataItem = dataItem;
    this.isNew = false;
  }
  /*
    @Type: File, <ts>
    @Name: onCancel function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: Function will call when user click on cancel button.
  */
  public onCancel(e): void {
    e.preventDefault();
    this.closeForm();
    this.auditFrom.reset();
    this.searchDataList = [];
  }
  /*
    @Type: File, <ts>
    @Name: closeForm function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: Function will call on clock event of popup responsible for closing pop up.
  */
  private closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }
  /*
    @Type: File, <ts>
    @Name: downloadFile function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: for download data in PDF,XLS and CSV file
  */
  downloadFile(value) {
    this.exportTo = value;
    this.loading = true;
    this.systemSettingService.fetchSystemLogListDownload(this.fromDate, this.toDate, this.exportTo,this.sortingValue).subscribe(
      repsonsedata => {
        if (value == 'CSV') {
          let BLOB = new Blob([repsonsedata], { type: "text/csv;charset=utf-8" });
          importedSaveAs(BLOB, this.exportTo + '.csv')
        } else if (value == 'PDF') {
          importedSaveAs(repsonsedata, this.exportTo);
        } else {
          importedSaveAs(repsonsedata, this.exportTo);
        }

        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
      })
  }
  /*
    @Type: File, <ts>
    @Name: onPaginatorChange function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: for Pagination data
  */
  onPaginatorChange($event) {
    let pagneNo = $event.skip / $event.take;
    let pagesize = $event.take;
    pagneNo = pagneNo + 1;
    this.systemSettingService.fetchSystemLogList(pagesize, pagneNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.gridData = this.gridView.concat(repsonsedata['Data']);
          this.pagneNo = repsonsedata['PageNumber'];
          this.pagesize = repsonsedata['PageSize'];
          this.totalLength = repsonsedata['TotalRecord'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: pageChange function
    @Who: Nitin Bhati
    @When: 28-April-2021
    @Why: EWM-1410
    @What: for Pagination data
  */
  public pageChange(event: PageChangeEvent): void {
    this.loadingscroll = true;
     if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      this.pagneNo = this.pagneNo + 1;
      this.fetchSystemLogListScroll(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue);
  
    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }

  fetchSystemLogListScroll(pagesize, pagneNo, sortingValue,searchValue) {
    //this.loadingscroll = true;
    this.systemSettingService.fetchSystemLogListScroll(pagesize, pagneNo, sortingValue,searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          //this.gridData = this.gridData.concat(nextgridView);
          this.gridView=this.gridView.concat(nextgridView);
          this.gridData=this.gridData.concat(nextgridView);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loadingscroll = false;
      })
  }
  /*
    @Type: File, <ts>
    @Name: onPaginatorChange function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: for Pagination data
  */
  public sortChange($event): void {
    this.sortDirectionValue = $event[0].field;
    this.sortDirection = $event[0].dir;
    if (this.sortDirection == null) {
      this.sortDirection = 'asc';
    } else {
      this.sortingValue = this.sortDirectionValue + ' ' + this.sortDirection;
    }
    this.systemSettingService.fetchSystemLogList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.gridView = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: inputEventStart function
    @Who: Nitin Bhati
    @When: 02-Feb-2021
    @Why: EWM-814
    @What: for getting Start date Value
  */
  inputEventStart(event) {
    var date = new Date(event.value); /*--@why:EWM-10571,@when:29-09-2023,@who: Nitin Bhati--*/
    let str = date.toDateString();
    this.fromDate = str;
  }
  /*
   @Type: File, <ts>
   @Name: inputEventEnd function
   @Who: Nitin Bhati
   @When: 02-Feb-2021
   @Why: EWM-814
   @What: for getting End date Value
  */
  inputEventEnd(event) {
    var date = new Date(event.value); /*--@why:EWM-10571,@when:29-09-2023,@who: Nitin Bhati--*/
    let str = date.toDateString();
    this.toDate = str;
    // this.systemLogList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue,this.fromDate,this.toDate);
    this.clearbtn = true;
  }
  /*
   @Type: File, <ts>
   @Name: onClose function
   @Who: Nitin Bhati
   @When: 10-March-2021
   @Why: EWM-1111
   @What: for close button
  */
  onClose() {
    const today = new Date();  /*--@why:EWM-10571,@when:29-09-2023,@who: Nitin Bhati--*/
    if (!this.auditFrom.value.end) {
      this.auditFrom.patchValue({ 'end': today });
    }
    this.systemLogList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue);
  }
  /*
   @Type: File, <ts>
   @Name: clearDate function
   @Who: Nitin Bhati
   @When: 3rd-Feb-2021
   @Why: EWM-814
   @What: for clear data on calendar
   */
  clearDate(event) {
    this.clearbtn = false;
    event.stopPropagation();
    this.auditFrom.reset();
    this.fromDate = '';
    this.toDate = '';
    this.systemLogList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue);
  }
  /*
    @Type: File, <ts>
    @Name: onExpand function
    @Who: Nitin Bhati
    @When: 3rd-Feb-2021
    @Why: EWM-814
    @What: for expend kendo row
  */
  onExpand(e) {
    let element: HTMLElement = document.getElementById('BtnCollapseAll') as HTMLElement;
    element.click();
    this.oldRowIndex = e.index;
    this.removeDefaultTooltips();
    this.changeObject = JSON.parse(e.dataItem.ChangeObjectinJson);
    this.oldchangeObject = JSON.parse(e.dataItem.OldObjectinJson);
  }
  /*
   @Type: File, <ts>
   @Name: onCollapse function
   @Who: Nitin Bhati
   @When: 3rd-Feb-2021
   @Why: EWM-814
   @What: for onCollapse kendo column
 */
  onCollapse(e) {
    this.removeDefaultTooltips();
  }
  public collapseAll(topGrid) {
    // this.getAPiData.forEach((item, idx) => {
    //   topGrid.collapseRow(idx);
    // })
    topGrid.collapseRow(this.oldRowIndex);
  }

  /*
    @Type: File, <ts>
    @Name: removeDefaultTooltips function
    @Who: Nitin Bhati
    @When: 3rd-Feb-2021
    @Why: EWM-814
    @What: for remove default tool tips
  */
  public removeDefaultTooltips() {
    document
      .querySelectorAll(".k-grid td .k-icon.k-plus, .k-grid td .k-icon.k-minus")
      .forEach(icon => {
        setTimeout(() => {
          icon.removeAttribute("title");
        });
      });
  }

  /*
    @Type: File, <ts>
    @Name: showTooltip function
    @Who: Nitin Bhati
    @When: 10th-march-2021
    @Why: EWM-1112
    @What: for showing tooltip data
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
          this.tooltipDir.toggle(element);
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
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
  @Who: Renu
  @When: 13-Apr-2021
  @Why: EWM-1356
  @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.systemLogList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue);
  }
}
