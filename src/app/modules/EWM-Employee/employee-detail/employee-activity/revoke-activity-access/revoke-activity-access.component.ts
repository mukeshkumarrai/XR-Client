import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { ManageAccessService } from 'src/app/modules/EWM.core/shared/services/candidate/manage-access.service';
import { RemoveAccessListComponent } from 'src/app/modules/EWM-Candidate/candidate-document/manage-access/remove-access-list/remove-access-list.component';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-revoke-activity-access',
  templateUrl: './revoke-activity-access.component.html',
  styleUrls: ['./revoke-activity-access.component.scss']
})
export class RevokeActivityAccessComponent implements OnInit {

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
 NoteId: any;
 AccessId;
 AccessName;
 candidateId;
 ActivityType: number=0;
 GrantAccesList: any;
  userSelectedList: any;
  GrantAccesList1: any;
  hasAccessFromJob:boolean;
  editClientFolder:boolean=false;
 /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: For injection of service class and other dependencies
 */
 constructor(public dialogRef: MatDialogRef<RevokeActivityAccessComponent>, public dialog: MatDialog,
   @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService, 
   private _appSetting: AppSettingsService,private translateService: TranslateService, 
   public _ManageAccessService: ManageAccessService,private clientService:ClientService) {
   this.NoteId = data?.NoteId;
   this.AccessId = data?.AccessId;
   this.AccessName = data?.AccessName;
   this.candidateId = data?.candidateId;
   this.ActivityType=data?.ActivityType;
   this.GrantAccesList=data?.GrantAccesList;
   this.userSelectedList=data?.userSelectedList;
   this.editClientFolder=data?.editClientFolder;   
   if (data?.HasAccessFromJob != null || data?.HasAccessFromJob != undefined || data?.HasAccessFromJob != '') {
    this.hasAccessFromJob = data?.HasAccessFromJob;
   }
   this.auditParameter = encodeURIComponent('Manage Access');
 }
 ngOnInit(): void {
   //this.getDocumetHasAccessById(this.NoteId);
  }
 /*
 @Type: File, <ts>
 @Name: getFolderList function
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: For showing the list of Document Has Access data
 */
 public getDocumetHasAccessById(NoteId:any) {
   this.loading = true;

   this.clientService.clientUserAccess('?noteid='+NoteId).subscribe(
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
    this.loading = false;
    this.loadingSearch = false;
    //this.GrantAccesList = this.GrantAccesList.filter((dl: any) => dl.UserName == inputValue);
    // this.clientService.clientUserAccess('?noteid='+this.NoteId).subscribe(
    //   (repsonsedata: FolderMaster) => {
    //     if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
    //       this.loading = false;
    //       this.loadingSearch = false;
    //       this.gridView = repsonsedata.Data;
    //     } else {
    //       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
    //       this.loading = false;
    //       this.loadingSearch = false;
    //     }
    //   }, err => {
    //     this.loading = false;
    //     this.loadingSearch = false;
    //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    //   })
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
 }
 /*
   @Type: File, <ts>
   @Name: DeleteInfo function
   @Who: Nitin Bhati
   @When: 17-Sep-2021
   @Why: EWM-2859  
   @What: FOR DIALOG BOX confirmation
 */
 DeleteInfo(Id: any): void {
  this.loading = true;
  const message = `label_titleDialogContent`;
   const title = '';
   const subTitle = 'label_RemoveHassAccess';
   const dialogData = new ConfirmDialogModel(title, subTitle, message);
   const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
     maxWidth: "350px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = true;
     this.result = dialogResult;
     if (dialogResult == true) {
// who:maneesh,what:ewm-13214 for when click on remove acess btn first time  data not show in popup,when:04/08/2023
      this.userSelectedList=this.userSelectedList.filter(x=>x.UserId!==Id);
        if(this.GrantAccesList?.length==0){
          this.GrantAccesList=[];
        }
        this.loading = false;
      // }
      const index1 = this.userSelectedList.findIndex(x => x.UserId === Id);
      if (index1 !== -1) {
        this.userSelectedList.splice(index1, 1);        
        if(this.userSelectedList?.length==0){
          this.userSelectedList=[];
        }
        this.loading = false;
      }  
      }else{
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
   setTimeout(() => { this.dialogRef.close(this.userSelectedList); }, 200);

 }



}

