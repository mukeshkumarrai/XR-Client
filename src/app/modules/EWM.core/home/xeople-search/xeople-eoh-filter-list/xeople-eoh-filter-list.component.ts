/*
@(C): Entire Software
@Type: File, <ts>
@Name: xeople-eoh-filter-list.component.ts
@Who: Renu
@When: 21-09-2023
@Why: EWM-14255 EWM-14421
@What: this component used for save filter for EOH
*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel, DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { XeopleSearchService } from '../../../shared/services/xeople-search/xeople-search.service';

@Component({
  selector: 'app-xeople-eoh-filter-list',
  templateUrl: './xeople-eoh-filter-list.component.html',
  styleUrls: ['./xeople-eoh-filter-list.component.scss']
})
export class XeopleEohFilterListComponent implements OnInit {

  filterlist:[]=[];
  public loading: boolean;
  delFilterArr:any[]=[];
  sortingValue: string="FilterName,asc";
  pagneNo: number=1;
  pagesize: number;
  searchVal: string='';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<XeopleEohFilterListComponent>, 
  public dialog: MatDialog,private snackBService: SnackBarService, private xeopleSearchService: XeopleSearchService, 
  private _appSetting: AppSettingsService,private translateService: TranslateService) { 
    this.pagesize = this._appSetting.pagesize;
    
  }

  ngOnInit(): void {
    this.filterEOHlistSaved();
  }
  
    /*  @Name: onDismiss @Who: Renu @When: 21-09-2023 @Why: EWM-14255 EWM-14421 @What:Function will call when user click on cancel button.*/
 
   onDismiss(): void {

    document.getElementsByClassName("xeople-search-all-filters")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("xeople-search-all-filters")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(true); }, 200);
  }

   /*  @Name: onCheck @Who: Renu @When: 21-09-2023 @Why: EWM-14255 EWM-14421 @What:when user click on checkbox*/

  onCheck(event: any,data: any){
    if(event.checked){
     this.delFilterArr.push(data?.Id);  
    }else{
      const index = this.delFilterArr.indexOf(data?.Id);
      if (index >= 0) {
        this.delFilterArr.splice(index, 1);
      }
    }
  }

/*  @Name: onDeleteFilter @Who: Renu @When: 21-09-2023 @Why: EWM-14255 EWM-14421 @What:when user click on delete button to delete filter */

  onDeleteFilter(){
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = 'label_filter';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult) {
    let delObj={};
    delObj['Id']=this.delFilterArr;
      this.xeopleSearchService.deleteFilterSearch(delObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
             this.filterEOHlistSaved();
             this.delFilterArr=[]; 
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }
        }, err => {
         this.loading = false;
         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  })
    
  }
/*  @Name: filterEOHlistSaved @Who: Renu @When: 21-09-2023 @Why: EWM-14255 EWM-14421 @What: get all filter save list */

   filterEOHlistSaved(){
    this.loading=true;
    this.xeopleSearchService.getEOHFilterAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: any) => {
        this.loading=false;
        if (repsonsedata.HttpStatusCode === 200) {
          this.filterlist = repsonsedata.Data;
        } else {
          this.filterlist=[];
        }
      }, err => {
        this.loading=false;
      })
  }

}
