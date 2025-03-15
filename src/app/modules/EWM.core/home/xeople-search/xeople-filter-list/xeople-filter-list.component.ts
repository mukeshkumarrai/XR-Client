import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel, DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { XeopleSearchService } from '../../../shared/services/xeople-search/xeople-search.service';

@Component({
  selector: 'app-xeople-filter-list',
  templateUrl: './xeople-filter-list.component.html',
  styleUrls: ['./xeople-filter-list.component.scss']
})
export class XeopleFilterListComponent implements OnInit {

  filterlist:[]=[];
  public loading: boolean;
  delFilterArr:any[]=[];
  sortingValue: string="FilterName,asc";
  pagneNo: number=1;
  pagesize: number;
  searchVal: string='';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<XeopleFilterListComponent>, 
  public dialog: MatDialog,private snackBService: SnackBarService, private xeopleSearchService: XeopleSearchService, 
  private _appSetting: AppSettingsService,private translateService: TranslateService) { 
    //this.filterlist=data?.SavedfilterList;
    this.pagesize = this._appSetting.pagesize;
    
  }

  ngOnInit(): void {
    this.filterlistSaved();
  }
  /*
   @Name: onDismiss
   @Who: Renu
   @When: 16-Feb-2023
   @Why: EWM-9377 EWM-10167
   @What: Function will call when user click on cancel button.
 */
   onDismiss(): void {

    document.getElementsByClassName("xeople-search-all-filters")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("xeople-search-all-filters")[0].classList.add("animate__zoomOut");
    //setTimeout(() => { this.dialogRef.close(false); }, 500);
    setTimeout(() => { this.dialogRef.close(true); }, 200);
  }
 /*
   @Name: onCheck
   @Who: Renu
   @When: 16-Feb-2023
   @Why: EWM-9377 EWM-10167
   @What: when user click on checkbox
 */
  onCheck(event: any,data: any){
    if(event.checked==true){
     this.delFilterArr.push(data?.Id);  
    }else{
      /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10970 EWM-11133 @What: delete btn disabled **/
      const index = this.delFilterArr.indexOf(data?.Id);
      if (index >= 0) {
        this.delFilterArr.splice(index, 1);
      }
    }
  }
  /*
   @Name: onDeleteFilter
   @Who: Renu
   @When: 16-Feb-2023
   @Why: EWM-9377 EWM-10167
   @What: when user click on delete button to delete filter
 */

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
    if (dialogResult == true) {
    let delObj={};
    delObj['Id']=this.delFilterArr;
      this.xeopleSearchService.deleteFilterSearch(delObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
             this.filterlistSaved();
             this.delFilterArr=[]; /*** @When: 12-03-2023 @Who:Renu @Why: EWM-10970 EWM-11133 @What: delete btn disabled **/
           //[] this.SavedfilterList.splice(index, 1);
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
/*
   @Name: filterlistSaved
   @Who: Renu
   @When: 16-Feb-2023
   @Why: EWM-9377 EWM-10167
   @What: get all filter save list
 */

  filterlistSaved(){
    this.loading=true;
    this.xeopleSearchService.getFilterSearchAll(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal).subscribe(
      (repsonsedata: any) => {
        this.loading=false;
        if (repsonsedata.HttpStatusCode === 200) {
          this.filterlist = repsonsedata.Data;
        } else {
          this.filterlist=[];
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading=false;
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
}
