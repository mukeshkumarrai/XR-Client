import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { Router } from '@angular/router';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-candidate-folder-filter',
  templateUrl: './candidate-folder-filter.component.html',
  styleUrls: ['./candidate-folder-filter.component.scss']
})
export class CandidateFolderFilterComponent implements OnInit {
  public loading: boolean;
  public folderdata: any = [];
  public candidateId;
  isStarActive: any = [];
  searchTextTag;
  public loadingSearch: boolean;
  labelAddFolders = false;

  constructor( public dialogRef: MatDialogRef<CandidateFolderFilterComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialog, private fb: FormBuilder, private snackBService: SnackBarService,
    private translateService: TranslateService, public _CandidateFolderService: CandidateFolderService,private route: Router,
    private appSettingsService: AppSettingsService)
    { 
      this.candidateId = data.candidateId;
      this.labelAddFolders = data?.labelAddFolder;
    }

  ngOnInit(): void {
    this.getFolderList();
  }


  /*
  @Type: File, <ts>
  @Name: getFolderList function
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: For showing the list of Folder data
  */
  getFolderList() {
    this.loading = true;
    this._CandidateFolderService.getCandidateMapToFolder('?id=' + this.candidateId).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.folderdata = repsonsedata.Data;
        } else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
           this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

   /*
  @Name: onFilter function
  @Who: Nitin Bhati
  @When: 18-Aug-2021
  @Why: EWM-2495
  @What: use for Searching records
   */
  public onFilter(inputValue: string): void {
     //this.loading = false;
    this.loadingSearch = true;
    if (inputValue.length > 0 && inputValue.length <= 3) {
      this.loadingSearch = false;
      return;
    }
   // this.searchTextTag = inputValue;
    this._CandidateFolderService.getCandidateMapToFolder('?Search=' +inputValue ).subscribe(
      (repsonsedata: FolderMaster) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          //this.loading = false;
          this.loadingSearch = false;
          this.folderdata = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          //this.loading = false;
          this.loadingSearch = false;
        }
      }, err => {
        //this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


/*
@Name: onFilterClear function
@Who: Nitin Bhati
@When: 18-Aug-2021
@Why: EWM-2495
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchTextTag='';
  this._CandidateFolderService.getCandidateMapToFolder('?Search=' +this.searchTextTag ).subscribe(
    (repsonsedata: FolderMaster) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        //this.loading = false;
        this.loadingSearch = false;
        this.folderdata = repsonsedata.Data;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        //this.loading = false;
        this.loadingSearch = false;
      }
    }, err => {
      //this.loading = false;
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

  /*
    @Type: File, <ts>
    @Name: selectFolderList function
    @Who: Nitin Bhati
    @When: 20-Aug-2021
    @Why: EWM-2495
    @What:select folder list
    */
  
  selectFolderList(selected:any,id:any,name:any) {
    this.loading = true;
    if (selected == 0) {
      this.isStarActive = 1;
    } else {
      this.isStarActive = 0;
    }
    // let selectedArray = this.folderdata.filter(x => x['Id'] === id);
    // selectedArray.forEach(element => {
    //   element['IsSelected'] = this.isStarActive;
    // });

   let updateJson = {};
   let folderArr={};
   folderArr['Id']=id,
   folderArr['Name']=name,
   folderArr['IsSelected']=this.isStarActive,
   updateJson['Candidate'] = [this.candidateId];
   updateJson['Folder']=folderArr;
   this._CandidateFolderService.updateMapCandidateToFolder(updateJson).subscribe((
    repsonsedata: FolderMaster) => {
    if (repsonsedata.HttpStatusCode === 200) {
      this.getFolderList();
      this.loading = false;
      //this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
    //this.route.navigate(['/client/cand/candidate/candidate', {CandidateId: this.candidateId}])
   }

}
