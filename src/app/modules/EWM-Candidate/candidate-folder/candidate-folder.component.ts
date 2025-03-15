/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2494
  @What:  This page will be use for the Candidate Folder template Component ts file
*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { ManageCandidateFolderComponent } from './manage-candidate-folder/manage-candidate-folder.component';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-folder',
  templateUrl: './candidate-folder.component.html',
  styleUrls: ['./candidate-folder.component.scss']
})
export class CandidateFolderComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "FolderName,asc";
  public sortedcolumnName: string = 'FolderName';
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
  public searchVal = '';
  public totalDataCount: any;
  public listData: any = [];
  public loadingSearch: boolean;
  public auditParameter;
  public idFolder = '';
  public idName = 'Id';
  pageLabel: any = "label_folder";
  public listDataview: any[] = [];
  totalDataCountFolder: any;
  userType;
  searchSubject$ = new Subject<any>();
  public folderId:number=0;
  public folderName:string;
  dirctionalLang;
  public selestedFolder:any=[];
  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: For injection of service class and other dependencies
  */
  constructor(public dialogRef: MatDialogRef<CandidateFolderComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService, 
    private _appSetting: AppSettingsService,private translateService: TranslateService, public _CandidateFolderService: CandidateFolderService,private appSettingsService: AppSettingsService) {
    this.pageSize = this._appSetting.pagesize;
    this.totalDataCountFolder = data.totalDataCountFolder;
    this.userType=data.userType;
    this.gridView = data?.folderList;
    this.listData = data?.folderList;
    this.folderId = data?.folderId;
    this.folderName = data?.folderName;
    this.selestedFolder=data?.selestedFolder;
    this.auditParameter = encodeURIComponent('Candidate Landing Page');
  }
  ngOnInit(): void {
    //this.getFolderList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idFolder,this.userType );
    // @suika @EWM-14427 @Whn 27-09-2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
       this.sendRequest(val);
       });
   }
  /*
  @Type: File, <ts>
  @Name: getFolderList function
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: For showing the list of Folder data
  */
  getFolderList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience,userType ) {
    this.loading = true;
    this._CandidateFolderService.getFolderList(pageSize, pageNo, sortingValue, searchVal, idName, idExperience,userType ).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
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
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: To add data on page scroll.
  */
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchFolderMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
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
   @Type: File, <ts>
   @Name: fetchFolderMoreRecord
   @Who: Nitin Bhati
   @When: 18-Aug-2021
   @Why: EWM-2495
   @What: To get more data from server on page scroll.
   */
  fetchFolderMoreRecord(pagesize, pagneNo, sortingValue) {
    this._CandidateFolderService.getFolderList(pagesize, pagneNo, sortingValue, this.searchVal, this.idName, this.idFolder,this.userType).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loadingscroll = false;
          let nextgridView: any = [];
          nextgridView = repsonsedata.Data;
          this.listData = this.listData.concat(nextgridView);
          this.gridView = this.listData;
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
  @Type: File, <ts>
  @Name: switchListMode
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: To switch between card view to list view.
  */
  switchListMode(viewMode) {
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
      this.isvisible = true;
    } else {
      this.viewMode = "listMode";
      this.isvisible = false;
    }
  }




  public onFilter(inputValue: string): void {
    this.searchVal = inputValue;
    if (inputValue?.length > 0 && inputValue?.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    //this.loaderStatus = 1;
    //this.state.skip=0;
    this.searchSubject$.next(inputValue);
  }
  /*
  @Name: onFilter function
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: use for Searching records
   */
  public sendRequest(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this._CandidateFolderService.getFolderList(this.pageSize, this.pageNo, this.sortingValue, inputValue, this.idName, this.idFolder,this.userType).subscribe(
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
    @Type: File, <ts>
    @Name: DeleteFolderInfo function
    @Who: Nitin Bhati
    @When: 18-Aug-2021
    @Why: EWM-2495  
    @What: FOR DIALOG BOX confirmation
  */
  DeleteFolderInfo(folderData: any): void {
    let folderObj = {};
    folderObj = folderData;
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_folder';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.loading = false;
      this.result = dialogResult;
      if (dialogResult == true) {
        this._CandidateFolderService.deleteDelete(folderObj).subscribe(
          (data: FolderMaster) => {
            this.active = false;
            if (data.HttpStatusCode === 200) {
              this.loading = false;
              this.pageNo = 1;
              this.searchVal = '';
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.getFolderList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idFolder,this.userType);
            } else {
              this.loading = false;
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
    @Type: File, <ts>
    @Name: onSort function
    @Who: Nitin Bhati
    @When: 18-Aug-2021
    @Why: EWM-2495
    @What: FOR sorting the data
  */
  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this._CandidateFolderService.getFolderList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idFolder,this.userType).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          document.getElementById('contentdata').scrollTo(0, 0);
          this.loading = false;
          this.gridView = repsonsedata.Data;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
        } else {
          this.loading = false;
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/*
        @Type: File, <ts>
        @Name: openQuickFolderModal
        @Who: Nitin Bhati
        @When: 18-Aug-2021
        @Why: EWM-2495
        @What: to open quick add Candidate Folder Folder modal dialog
      */
  openQuickAddFolderModal(id: any, tag: string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_folderName';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ManageCandidateFolderComponent, {
      data: new Object({ editId: id, activityStatus: tag }),
      panelClass: ['xeople-modal', 'add_folderManage','animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
        // who:maneesh,what:ewm-13207 for api calling issu when cancel PopupCloseEvent,when:21/07/2023
      if (res == true) {
        // this.loading = true;
        this.getFolderList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idFolder,this.userType);
      } else {
        this.loading = false;
      }
    })

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }
  /*
   @Name: onDismiss
   @Who: Nitin Bhati
   @When: 18-Aug-2021
   @Why: EWM-2595
   @What: Function will call when user click on cancel button.
 */
  onDismiss(): void {

    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    //  <!-- @Who: maneesh ,@When: 26-sep-2023, @Why: EWM-10461  ,What:folder data is not dispaly in employee list -->
    setTimeout(() => { this.dialogRef.close({ data: this.folderId,name:this.folderName,selestedFolder:this.selestedFolder }); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

  }

  clickFolderRouter(id,name) {
    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    //setTimeout(() => { this.dialogRef.close(false); }, 500);
    setTimeout(() => { this.dialogRef.close({ data: id,name:name }); }, 200);
  }


   /*
@Name: onFilterClear function
@Who: Nitin Bhati
@When: 30-March-2022
@Why: EWM-5937
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchVal='';
  this.getFolderList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal, this.idName, this.idFolder,this.userType);
}

}

