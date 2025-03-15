import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInRightBigAnimation } from 'angular-animations';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-document-name',
  templateUrl: './document-name.component.html',
  styleUrls: ['./document-name.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class DocumentNameComponent implements OnInit {

  loading:boolean=false;
  viewMode: string = 'listMode';
  pageLabel:string='label_document,label_documentname';
  loadingSearch:boolean=false;
  sortedcolumnName:string='DocumentName';
  sortDirection:string='asc';
  gridView:any=[];
  loadingscroll:boolean=false;
  searchVal:string='';
  isvisible:boolean=false;
  loadingPopup:boolean=false;
  auditParameter: string;
  pageSize: any=10;
  pageNo: any=1;
  public formtitle: string = 'grid';
  // sortingValue: any='DocumentName,asc';
  canLoad: boolean;
  pendingLoad: any;
  ascIcon: string;
  descIcon: string;
  totalDataCount: any;
  public userpreferences: Userpreferences;
  categoryId:any=0;
  categoryName: any;
   // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size

   animationVar: any;
   public isCardMode:boolean = false;
   public isListMode:boolean = true;
   public pagneNo = 1;
   public sortingValue: string = "DocumentName,asc";
   public sort: any[] = [{
     field: 'DocumentName',
     dir: 'asc'
   }];
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;
  searchSubject$ = new Subject<any>();
   public HideExternally:any;
   constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,
    public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private translateService: TranslateService,private _Service:DocumentCategoryService, public _userpreferencesService: UserpreferencesService, private appSettingsService:AppSettingsService) {
      // page option from config file
    this.pageSize = this._appSetting.pagesize;
    this.pageOption = this._appSetting.pageOption;
    this.auditParameter = encodeURIComponent('Document Name');
  }

  ngOnInit(): void {
    let URL = this.router.url;;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
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
       params => {
         if(Object.keys(params).length!=0) {
           this.categoryId=params['documentcategoryId'];
           /*  @Who: maneesh @When: 11-jan-2023 @Why: EWM-9734 (isHideExternally:this.HideExternally )*/
           this.HideExternally=params['isHideExternally'];
          //  this.viewMode = params['V'];
          //  this.switchListMode(this.viewMode);
         }
       });
      
    this.userpreferences = this._userpreferencesService.getuserpreferences(); 
     this.getList(false);
     this.animationVar = ButtonTypes;
     this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {  
      this.loadingSearch = false;
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

  getList(isScroll) {
    this._Service.getDocumentName( this.categoryId,this.pageNo,this.pageSize,this.sortingValue,this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode  == '200' || repsonsedata.HttpStatusCode == '204') {
          this.animate();
          this.loading = false;
          if(isScroll)
          { 
            let nextgridView = [];
            nextgridView = repsonsedata['Data'];
            this.gridView = this.gridView.concat(nextgridView);
            //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.gridView.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.gridView = uniqueUsers;
         // console.log(this.gridView,uniqueUsers,"Data")
            this.loadingscroll = false;
            this.totalDataCount = repsonsedata.TotalRecord;
          }
          else{
          this.gridView = repsonsedata.Data;
          // console.log('this.gridView ',this.gridView );
          
          this.categoryName=repsonsedata.Data[0].CategoryName;
          this.loadingSearch = false;}
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
refreshComponent(){
  this.pageNo=1;
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

  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.isvisible = false;
       this.animate();
       //listHeader.classList.remove("hide");
     }
   }
  
  onScrollDown(){
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      /*  @Who: Anup @When: 24-Dec-2021 @Why: EWM-4295 (add condition)*/
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.getList(true);
      }
      else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }










  onFilter(value)
  {
    this.loadingSearch = true;
    // this.loadingSearch = false;

     if (value.length > 0 && value.length < 3) {
      this.loadingSearch = false;

       return;
     }
     this.pageNo=1;
  this.searchSubject$.next(value);
  this.getList(false);

  }
/*
  @Name: onFilter function
  @Who: amit
  @When: 23-March-2022
  @Why: EWM-5656
  @What: use for Searching records
   */

  public onFilterClear(): void {
    this.searchVal='';
    this.getList(false);
  }
  onSort(val)
  {
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
    const subTitle = 'label_documentname';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this._Service.deleteDocumentName(degreeObj).subscribe(
          (data: ResponceData) => {
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
    this.pagneNo = this.pagneNo + 1;
    this.getList(true);
  } else {
    this.loadingscroll = false;
  }
}
    /*
@Name: sortChange function
@Who: Anup Singh
@When: 20-oct-2021
@Why: EWM-3039
*/
public sortChange($event): void {
  this.sortDirection = $event[0].dir;
  if (this.sortDirection == null || this.sortDirection == undefined) {
    this.sortDirection = 'asc';
  } else {
    this.sortingValue = $event[0].field + ',' + this.sortDirection;
  }
  this.pagneNo=1;
  this.getList(true);
}
    /*
@Name: showTooltip function
@Who: maneesh
@When: 27-Sep-2022
@Why: EWM-8840
*/
public showTooltip(e: MouseEvent): void {
  const element = e.target as HTMLElement;
  //console.log("show Tooltip:", e.target as HTMLElement);
  //alert("show tooltip");

  if (element.nodeName === 'TD') {
    var attrr = element.getAttribute('ng-reflect-logical-col-index');
   // console.log("show Tooltip One:");
    if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
        this.tooltipDir.hide();
      //  console.log("show Tooltip two:");
      }
      else {
        if (element.innerText == '') {
          this.tooltipDir.hide();
         // console.log("show Tooltip three:");
        } else {
        //  console.log("show Tooltip four:");
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
    //  console.log("show Tooltip five:");
    }
    else {
    //  console.log("show Tooltip six:");
      this.tooltipDir.toggle(element);
    }
  }
  else {
    this.tooltipDir.hide();
  }
}
}
