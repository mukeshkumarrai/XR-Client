/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:Renu
  @When: 09-March-2022
  @Why: EWM-5337 EWM-5461
  @What:  This page will be use for show assesment info By id
*/
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-assessment-info',
  templateUrl: './assessment-info.component.html',
  styleUrls: ['./assessment-info.component.scss']
})
export class AssessmentInfoComponent implements OnInit {

  loading: boolean;
  assementInfoId: Number;
  assementInfoList:any={};
  public userpreferences: Userpreferences;
  
  constructor(public dialogRef: MatDialogRef<AssessmentInfoComponent>,private snackBService:SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any,private userAdministrationService:UserAdministrationService,
    private translateService:TranslateService,private _userpreferencesService:UserpreferencesService) {
      this.assementInfoId = data.assessmentId;
      this.userpreferences = this._userpreferencesService.getuserpreferences();
     }

  ngOnInit(): void {
    this.assessmentInfo(this.assementInfoId);
  }

    /*
    @Type: File, <ts>
    @Name: assessmentInfo
    @Who: Renu
    @When: 09-March-2022
   @Why: EWM-5337 EWM-5461
    @What: to get list by info Id 
    */

  assessmentInfo(Id){
    this.loading = true;
    this.userAdministrationService.getAssessmentInfoBYId(Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
         this.assementInfoList=data.Data;
        } else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.assementInfoList=[];
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
@Who: Renu
@When: 09-March-2022
@Why: EWM-5337 EWM-5461
@What: TO close the modal
*/
onDismiss()
{
  document.getElementsByClassName("add_assInfo")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_assInfo")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}

viewQuestionById() {
  let navigate = './assessment/preview?Id=' + this.assementInfoId;
  window.open(navigate, '_blank');
}

}
