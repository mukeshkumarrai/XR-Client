// @Type: File, <html>
// @Who: Adarsh singh
// @When: 08-Sept-2023
// @Why: EWM-13814 EWM-13877
// @What:  This component is used for multiple candidate folder mapping


import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { FolderMaster } from '../../models/candidate-folder';
import { AppSettingsService } from '../../services/app-settings.service';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';

@Component({
  selector: 'app-mulitple-candidate-folder-mapping',
  templateUrl: './mulitple-candidate-folder-mapping.component.html',
  styleUrls: ['./mulitple-candidate-folder-mapping.component.scss']
})
export class MulitpleCandidateFolderMappingComponent implements OnInit {

  public loading: boolean;
  public folderdata: any = [];
  public candidateIdArr;
  isStarActive: any = [];
  searchTextTag;
  public loadingSearch: boolean;
  labelAddFolders = false;
  constructor( public dialogRef: MatDialogRef<MulitpleCandidateFolderMappingComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialog, private fb: FormBuilder, private snackBService: SnackBarService,
    private translateService: TranslateService, public _CandidateFolderService: CandidateFolderService,private route: Router,
    private appSettingsService: AppSettingsService)
    { 
      this.candidateIdArr = data.candidateIdArr;
      this.labelAddFolders = data?.labelAddFolder;
    }

  ngOnInit(): void {
    this.getFolderList();
  }


  /*
  @Name: getFolderList function
  @Who: Adarsh singh
  @When: 08-Sept-2023
  @Why: EWM-13814 EWM-13877
  @What: For showing the list of Folder data
  */
  getFolderList() {
    this.loading = true;
    let obj = {
      "Candidates": this.candidateIdArr
    }
    this._CandidateFolderService.postCandidateFoldersDetails(obj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.folderdata = repsonsedata.Data?.CandidateFolderMappingList;
        } else {
           this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

   /*
  @Name: onFilter function
   @Who: Adarsh singh
  @When: 08-Sept-2023
  @Why: EWM-13814 EWM-13877
  @What: use for Searching records
   */
  public onFilter(inputValue: string): void {
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 3) {
      this.loadingSearch = false;
      return;
    }
    this._CandidateFolderService.getCandidateMapToFolder('?Search=' +inputValue ).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loadingSearch = false;
          this.folderdata = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingSearch = false;
        }
      }, err => {
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


/*
@Name: onFilterClear function
 @Who: Adarsh singh
  @When: 08-Sept-2023
  @Why: EWM-13814 EWM-13877
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchTextTag='';
  this._CandidateFolderService.getCandidateMapToFolder('?Search=' +this.searchTextTag ).subscribe(
    (repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        this.loadingSearch = false;
        this.folderdata = repsonsedata.Data;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loadingSearch = false;
      }
    }, err => {
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

/*
@Type: File, <ts>
@Name: selectFolderList function
@Who: Adarsh singh
@When: 08-Sept-2023
@Why: EWM-13814 EWM-13877
@What:select folder list
*/
  
  selectFolderList(selected:any,id:any,name:any) {
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
   updateJson['Candidate'] = this.candidateIdArr;
   updateJson['Folder']=folderArr;
   this._CandidateFolderService.updateMapCandidateToFolder(updateJson).subscribe((
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

  onDismiss(): void {
    document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
   }

}
