/*
@(C): Entire Software
@Type: File, <ts>
@Who: Anup
@When: 15-sep-2021
@Why: EWM-2638 EWM-2853
@What: For version of Documents
*/

import { Component, Inject, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CreateDocumentComponent } from '../create-document/create-document.component';
import {PdfViewerComponent} from 'src/app/modules/EWM-Candidate/candidate-document/pdf-viewer/pdf-viewer.component';
import { PageChangeEvent } from '@progress/kendo-angular-dropdowns/dist/es2015/common/models/page-change-event';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { take } from 'rxjs/operators';
import { GridComponent } from '@progress/kendo-angular-grid';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {
  loadingscroll: boolean = false;
  public userpreferences: Userpreferences;
  gridView: any = [];
  sortedcolumnName: string = 'VersionNumber';
  sortDirection: string = 'asc';
  searchVal: string = '';
  loadingPopup: boolean = false;
  isvisible: boolean = false;
  loading: boolean = false;
  loadingSearch: boolean = false;
  @Input() candidateId: any;
  pageNo: number = 1;
  pageSize: number;
  totalRecords: number = 0;
  sortingValue: string = 'VersionNumber,asc';
  ascIcon: string;
  descIcon: string;
  canLoad: any;
  pendingLoad: boolean;
  documentData: any;
  public formtitle: string = 'grid';
  totalDataCount: number;
  innerWidth: any = '1200';
  public sort: any[] = [{
    field: 'QualificationName',
    dir: 'asc'
  }];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective; 
  @ViewChild(GridComponent) public grid: GridComponent;
  public DemoDoc: any;
  public viewer = 'url';
  public fileType: any;
  public showUploadedFile:boolean=false;
  public isLoading: boolean = true;
  duplicateName: boolean = false;
  constructor(public _userpreferencesService: UserpreferencesService, public dialog: MatDialog, private fb: FormBuilder, public dialogRef: MatDialogRef<VersionComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _services: DocumentService, private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService, private serviceListClass: ServiceListClass,private ngZone: NgZone) {
    this.pageSize = this._appSetting.pagesize;
    this.candidateId = data.candidateId;
    this.documentData = data.documentData;
    }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.ascIcon = 'north';
    this.getAllVersion(false, false);
    
  
  }

  

     /*
  @Type: File, <ts>
  @Name: onDismiss
  @Who: Anup
  @When: 17-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for close popup
  */
  onDismiss() {
    document.getElementsByClassName("add_version")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_version")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


      /*
  @Type: File, <ts>
  @Name: onSort
  @Who: Anup
  @When: 17-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for get  version list by shorting
  */
  onSort(columnName) {
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this.getAllVersion(false, false);
  }

     /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Anup
  @When: 17-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for get  version list by scroll down
  */
  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      this.pageNo = this.pageNo + 1;
      this.getAllVersion(true, false);

    } else {
      this.pendingLoad = true;
    }

  }

   /*
  @Type: File, <ts>
  @Name: onFilter
  @Who: Anup
  @When: 17-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for get  version list by filter
  */
  onFilter(searchVal) {
    if (searchVal.length > 0 && searchVal.length < 3) {
      return;
    }
    this.loadingSearch = true;
    this.loading = false;
    this.pageNo = 1;
    this.getAllVersion(false, true);
  }


  

 /*
  @Type: File, <ts>
  @Name: getAllVersion
  @Who: Anup
  @When: 17-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for get all version list
  */

  getAllVersion(isScroll, search) {
    if(search){
      this.loading = false;
    }else if(isScroll){
      this.loading = false;
    }else{
      this.loading = true;
    }
     this._services.getAllVersion(this.pageNo, this.pageSize, this.sortingValue, this.searchVal, this.data?.documentData?.Id)
      .subscribe((data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (isScroll) {
            let nextgridView = [];
            nextgridView = data.Data;
            this.gridView = this.gridView.concat(nextgridView);
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;
          } else {
            this.gridView = data.Data; 
            if(this.gridView?.length>0){
             // this.fitColumns(); 
            }                    
            this.totalDataCount = data.TotalRecord;
            this.loading = false;
            this.loadingSearch = false;
            this.loadingscroll = false;
          }
          
          setTimeout(() => {
            this.fitColumns();
          }, 100);
        }
        else if (data.HttpStatusCode == 204) {
          this.gridView = null;
          this.totalRecords = data.TotalRecord;
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
          this.loadingSearch = false;
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.loadingscroll = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


 /*
  @Type: File, <ts>
  @Name: OpenDocuemntPopUp
  @Who: Anup
  @When: 17-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for document add popup
  */
  OpenDocuemntPopUp() {
    const dialogRef = this.dialog.open(CreateDocumentComponent, {
      data: { candidateId: this.candidateId, documentData: this.documentData},
      panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      //this.result = dialogResult;
      if (dialogResult) {
        this.getAllVersion(false, false);
      }

    });
  }

 /*
  @Type: File, <ts>
  @Name: loadViewerForVersion
  @Who: Anup
  @When: 17-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for document view popup
  */

  // loadViewerForVersion(url){
  //  const dialogRef = this.dialog.open(PdfViewerComponent, {
  //     maxWidth: "1100px",
  //     width: "90%",
  //     maxHeight: "100%",
  //     data:url,
  //     panelClass: ['quick-modalbox', 'add_folder', 'animate__animated', 'animate__zoomIn'],
  //     disableClose: true,
  //   });
  //   dialogRef.afterClosed().subscribe(dialogResult => {
  //     //return;
     
  //   });
  // } 

 /*
  @Type: File, <ts>
  @Name: switchListMode
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: To switch between card view to list view.
  */
 viewMode:any;
 switchListMode(viewMode) {
  if (viewMode === 'cardMode') {
    this.viewMode = "cardMode";
    this.isvisible = true;
  } else {
    this.viewMode = "listMode";
    this.isvisible = false;
  }
}


  /*
@Name: pageChange function
@Who: maneesh
@When: 27-Sep-2022
@Why: EWM-8840
*/
public pageChange(event: PageChangeEvent): void {

  this.loadingscroll = true;
  if (this.totalDataCount > this.gridView.length) {
    this.pageNo = this.pageNo + 1;
    this.fetchVersionMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
  } else {
    this.loadingscroll = false;
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
  this.pageNo = 1;
  this.getAllVersion(false, false);
}

  /*
 @Type: File, <ts>
 @Name: fetchVersionMoreRecord
 @Who: Suika
 @When: 20-July-2023
 @Why: EWM-13489
 @What: To get more data from server on page scroll.
 */

fetchVersionMoreRecord(pagesize, pagneNo, sortingValue) {
  this._services.getAllVersion(pagneNo,pagesize,sortingValue, this.searchVal, this.data?.documentData?.Id).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loadingscroll = false;
        if (repsonsedata.Data) {
          this.totalDataCount = repsonsedata.TotalRecord;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.gridView = this.gridView.concat(nextgridView);
        }
       // this.fitColumns();
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
@Name: showTooltip function
@Who: maneesh
@When: 27-Sep-2022
@Why: EWM-8840
*/
public showTooltip(e: MouseEvent): void {
 /* const element = e.target as HTMLElement;
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
  }*/
  const element = e.target as HTMLElement;
  if ((element.nodeName === 'TD' || element.nodeName === 'TH')
          && element.offsetWidth < element.scrollWidth) {
      this.tooltipDir.toggle(element);
  } else {
      this.tooltipDir.hide();
  }
}


/*
@Name: onDataStateChange function
@Who: Suika
@When: 21-July-2023
@Why: EWM-13489
*/
public onDataStateChange(): void {
  this.fitColumns();
}


/*
@Name: fitColumns function
@Who: Suika
@When: 21-July-2023
@Why: EWM-13489
*/
public fitColumns(): void {
  this.grid?.autoFitColumns();
}


/*
@Name: showFile function
@Who: Suika
@When: 21-July-2023
@Why: EWM-13489
*/
showFile(dataItem){
  this.DemoDoc = dataItem?.PreviewUrl;
  const list = dataItem?.FileName?.split('.');
    const fileType = list[list.length - 1];
    if(fileType=='PDF' || fileType=='pdf'){
    const dialogRef = this.dialog.open(PdfViewerComponent, {
      data:{url:this.DemoDoc,fileType:fileType},
      panelClass: ['xeople-modal-full-screen', 'add_folder', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      return;
     
    });
  }else{
    this.openDialog(this.DemoDoc);
  }
}

/*
@Name: openDialog function
@Who: Suika
@When: 21-July-2023
@Why: EWM-13489
*/
openDialog(Image): void {
  let data: any;
  data = { "title": 'title', "type": 'Image', "content": Image };
  const dialogRef = this.dialog.open(ModalComponent, {
    disableClose: true,
    data: data,
    panelClass: ['imageModal', 'animate__animated','animate__zoomIn']
  });
  dialogRef.afterClosed().subscribe(result => {
  });
}

}
