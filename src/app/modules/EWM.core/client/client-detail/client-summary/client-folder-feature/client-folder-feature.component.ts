/*--@who:Nitin Bhati,@when:29-01-2024,@what:folder map feature under client summary,@why:EWM-15818,EWM-15835--*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ClientService } from '@app/modules/EWM.core/shared/services/client/client.service';
@Component({
  selector: 'app-client-folder-feature',
  templateUrl: './client-folder-feature.component.html',
  styleUrls: ['./client-folder-feature.component.scss']
})
export class ClientFolderFeatureComponent implements OnInit {
  public loading: boolean;
  public folderdata: any = [];
  public candidateId;
  isStarActive: any = [];
  searchTextTag;
  public loadingSearch: boolean;
  labelAddFolders = false;
  constructor( public dialogRef: MatDialogRef<ClientFolderFeatureComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialog, private snackBService: SnackBarService,private translateService: TranslateService,private appSettingsService: AppSettingsService,private _clientService: ClientService)
    { 
      this.candidateId = data.candidateId;
      this.labelAddFolders = data?.labelAddFolder;
    }

  ngOnInit(): void {
    this.getFolderList();
  }
  public getFolderList() {
    this.loading = true;
    this._clientService.getClientMapToFolder('?id=' + this.candidateId).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.folderdata = repsonsedata.Data;
        }else if(repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.folderdata = [];
        } else {
           this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  public onFilter(inputValue: string): void {
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 3) {
      this.loadingSearch = false;
      return;
    }
    this._clientService.getClientMapToFolder('?Search=' +inputValue + '&id=' + this.candidateId ).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingSearch = false;
          this.folderdata = repsonsedata.Data;
        }else if(repsonsedata.HttpStatusCode == '204') {
          this.loadingSearch = false;
          this.folderdata = [];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingSearch = false;
        }
      }, err => {
         this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
public onFilterClear(): void {
  this.searchTextTag='';
  this._clientService.getClientMapToFolder('?Search=' +this.searchTextTag ).subscribe(
    (repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode == '200') {
         this.loadingSearch = false;
        this.folderdata = repsonsedata.Data;
      }else if(repsonsedata.HttpStatusCode == '204') {
        this.loadingSearch = false;
        this.folderdata = [];
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loadingSearch = false;
      }
    }, err => {
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
 }
 public selectFolderList(selected:any,id:any,name:any) {
    this.loading = true;
    if (selected == 0) {
      this.isStarActive = 1;
    } else {
      this.isStarActive = 0;
    }
    let updateJson = {};
   let folderArr={};
   folderArr['Id']=id,
   folderArr['Name']=name,
   folderArr['IsSelected']=this.isStarActive,
   updateJson['Client'] = [this.candidateId];
   updateJson['Folder']=folderArr;
   this._clientService.updateMapClientToFolder(updateJson).subscribe((
    repsonsedata: FolderMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.getFolderList();
      this.loading = false;
     } else if (repsonsedata.HttpStatusCode === 400) {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.loading = false;
    }
    else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.loading = false;
    }
  },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
 }
 public onDismiss(): void {
    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
   }

}
