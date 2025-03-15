/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What:  This page will be use for the Remoce access template Component ts file
*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { ManageAccessComponent } from '../manage-access.component';
import { ManageAccessService } from 'src/app/modules/EWM.core/shared/services/candidate/manage-access.service';

@Component({
  selector: 'app-remove-access-list',
  templateUrl: './remove-access-list.component.html',
  styleUrls: ['./remove-access-list.component.scss']
})
export class RemoveAccessListComponent implements OnInit {
 /**********************All generic variables declarations for accessing any where inside functions********/
 public ActiveMenu: string;
 public selectedSubMenu: string;
 public sideBarMenu: string;
 public active = false;
 public loading: boolean;
 //for pagination and sorting
 public ascIcon: string;
 public descIcon: string;
 public sortDirection = 'asc';
 public loadingscroll: boolean;
 public formtitle: string = 'grid';
 public result: string = '';
 //public actionStatus: string = 'Add';
 public canLoad = false;
 public pendingLoad = false;
 public pageNo: number = 1;
 public pageSize;
 public viewMode: string;
 public isvisible: boolean;
 public maxCharacterLengthSubHead = 130;
 public gridView: any = [];
 public searchVal: string = '';
 public totalDataCount: any;
 public listData: any = [];
 public loadingSearch: boolean;
 public auditParameter;
 public listDataview: any[] = [];
 FolderId: any;
 FolderName;
 AccessId;
 AccessName;
 candidateId;
 /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: For injection of service class and other dependencies
 */
 constructor(public dialogRef: MatDialogRef<RemoveAccessListComponent>, public dialog: MatDialog,
   @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService, 
   private _appSetting: AppSettingsService,private translateService: TranslateService, public _ManageAccessService: ManageAccessService) {
   this.FolderId = data.FolderId;
   this.FolderName = data.FolderName;
   this.AccessId = data.AccessId;
   this.AccessName = data.AccessName;
   this.candidateId = data.candidateId;
  
   this.auditParameter = encodeURIComponent('Manage Access');
 }
 ngOnInit(): void {
   this.getDocumetHasAccessById(this.FolderId,this.searchVal);
  }
 /*
 @Type: File, <ts>
 @Name: getFolderList function
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: For showing the list of Document Has Access data
 */
 public getDocumetHasAccessById(FolderId:any,searchVal:any) {
   this.loading = true;
   this._ManageAccessService.getDocumentHasAccessById(FolderId,this.searchVal).subscribe(
     (repsonsedata: FolderMaster) => {
       if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
         this.loading = false;
         this.gridView = repsonsedata.Data;
         this.listData = repsonsedata.Data;
         this.totalDataCount = repsonsedata.TotalRecord;
       } else {
         this.loadingscroll = false;
         this.loading = false;
       }
     }, err => {
       this.loading = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     })
 }
 /*
 @Type: File, <ts>
 @Name: onScrollDown
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: To add data on page scroll.
 */
 onScrollDown(ev?) {
   this.loadingscroll = true;
   if (this.canLoad) {
     this.canLoad = false;
     this.pendingLoad = false;
     if (this.totalDataCount > this.gridView.length) {
       this.pageNo = this.pageNo + 1;
       //this.fetchFolderMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
     }
     else {
       this.loadingscroll = false;
     }
   } else {
     this.loadingscroll = false;
     this.pendingLoad = true;
   }
 }
 
 /*
 @Name: onFilter function
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: use for Searching records
  */
 public onFilter(inputValue: string): void {
  this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this._ManageAccessService.getDocumentHasAccessById(this.FolderId,inputValue).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridView = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
 }
  /*
@Name: onFilterClear function
@Who: Nitin
@When: 17-Sep-2021
@Why: EWM-2859 
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchVal='';
  this.getDocumetHasAccessById(this.FolderId,this.searchVal);
 }
 /*
   @Type: File, <ts>
   @Name: DeleteInfo function
   @Who: Nitin Bhati
   @When: 17-Sep-2021
   @Why: EWM-2859  
   @What: FOR DIALOG BOX confirmation
 */
 DeleteInfo(folderData: any): void {
   let removeAccessObj = {};
   removeAccessObj['Id'] = this.FolderId;
   removeAccessObj['HasAccessId'] = folderData.Id;
   removeAccessObj['Name'] = this.FolderName;
   removeAccessObj['AccessId'] = this.AccessId;
   removeAccessObj['AccessName'] = this.AccessName;
   removeAccessObj['PermissionName'] = folderData.PermissionName;
   removeAccessObj['EmailId'] = folderData.EmailId;
   removeAccessObj['CandidateId'] = this.candidateId;
   removeAccessObj['CandidateName'] ='' ;
    const message = '';
   const title = '';
   const subTitle = 'label_titleDialogContent';
   const dialogData = new ConfirmDialogModel(title, subTitle, message);
   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
     maxWidth: "350px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     this.loading = true;
     this.result = dialogResult;
     if (dialogResult == true) {
       this._ManageAccessService.removeDocumentAccess(removeAccessObj).subscribe(
         (data: FolderMaster) => {
           this.active = false;
           if (data.HttpStatusCode === 200) {
             this.loading = false;
             this.pageNo = 1;
             this.searchVal = '';
             this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
             this.getDocumetHasAccessById(this.FolderId,this.searchVal);
           } else {
             this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
           }
         }, err => {
           this.loading = false;
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         })
     }else {
      this.loading = false;
    }
   });
 }

 /*
  @Name: onDismiss
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What: Function will call when user click on cancel button.
*/
 onDismiss(): void {
   document.getElementsByClassName("remove_Access")[0].classList.remove("animate__zoomIn")
   document.getElementsByClassName("remove_Access")[0].classList.add("animate__zoomOut");
   //setTimeout(() => { this.dialogRef.close(false); }, 500);
   setTimeout(() => { this.dialogRef.close({ data: 0,name:null }); }, 200);

 }


}
