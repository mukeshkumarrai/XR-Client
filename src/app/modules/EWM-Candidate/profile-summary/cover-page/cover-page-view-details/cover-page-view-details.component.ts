import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-cover-page-view-details',
  templateUrl: './cover-page-view-details.component.html',
  styleUrls: ['./cover-page-view-details.component.scss']
})
export class CoverPageViewDetailsComponent implements OnInit {

  loading: boolean;
  coverPageInfoId: Number;
  coverPageInfoList:any={};
  public userpreferences: Userpreferences;
  
  constructor(public dialogRef: MatDialogRef<CoverPageViewDetailsComponent>,private snackBService:SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any,public candidateService: CandidateService,private translateService:TranslateService,private _userpreferencesService:UserpreferencesService) {
      this.coverPageInfoId = data.Id;
      this.userpreferences = this._userpreferencesService.getuserpreferences();
     }

  ngOnInit(): void {
    this.coverPageInfo(this.coverPageInfoId);
  }

    /*
    @Type: File, <ts>
    @Name: coverPageInfo
    @Who: Suika
    @When: 17-May-2022
    @Why: EWM-6605 EWM-6720
    @What: to get list by info Id 
    */

  coverPageInfo(Id){
    this.loading = true;
    this.candidateService.fetchCoverDetailsById('?Id='+Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
         this.coverPageInfoList=data.Data;
        } else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.coverPageInfoList=[];
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })

  }

  /*
@Name: onDismiss function
@Who: Suika
@When: 17-May-2022
@Why: EWM-6605 EWM-6720
@What: TO close the modal
*/
onDismiss()
{
  document.getElementsByClassName("xeople-modal")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("xeople-modal")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}
}
