
/*
   @Type: File, <ts>
    @Name: timezone-modal.component.ts
    @Who: Renu
    @When: 18-Feb-2021
    @Why: EWM-4498 EWM-5297
    @What: popup component for timezone modal
  */
   
import { Component, ElementRef, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-timezone-modal',
  templateUrl: './timezone-modal.component.html',
  styleUrls: ['./timezone-modal.component.scss']
})
export class TimezoneModalComponent implements OnInit {

/************************Global Variables decaraed her*********************** */
public loadingPopup: boolean;
public searchValue: string = "";
public searchListUser: any = [];
public PreviewUrl: string;
searchTeammate = [];
orgId: any;
maxMsg: boolean = false;
loading: boolean;
noRecordFound: string;
maxSelectEmail: any;
saveEnableDisable: boolean = true;
gridTimeZone: any;
utctimezonName:any;
public timezonName:any=localStorage.getItem('UserTimezone');

constructor(public dialogRef: MatDialogRef<TimezoneModalComponent>, @Optional()
@Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
 private appSettingsService: AppSettingsService,private _profileInfoService: ProfileInfoService,private snackBService: SnackBarService) {
}

ngOnInit(): void {
  this.getTimeZone();
}



/*
 @Type: File, <ts>
  @Name: AddSelectTeammate()
  @Who: Anup
  @When: 27-May-2021
  @Why: EWM-1434 EWM-1613
  @What: add teammate after searching in searchTeammate Array
*/
AddSelectTeammate(userData: any, userName: string) {

  if (this.searchTeammate.length < this.maxSelectEmail) {
    const index = this.searchTeammate.findIndex(x => x.id === userData.Id);
    if (index !== -1) {
      //  this.searchTeammate.splice(index, 1);
    } else {
      this.searchTeammate.push({
        'id': userData.Id,
        'email': userData.Email,
        'fullName': userData.FullName,
        'firstName': userData.FirstName,
        'middleName': userData.MiddleName,
        'lastName': userData.LastName,
        'orgId': userData.OrgId,
        'userTypeCode': userData.UserTypeCode,
        'PreviewUrl': userData.ProfileImageUrl
      })
      this.maxMsg = false;
    }
  }
  else {
    this.maxMsg = true;
  }

  if (this.searchTeammate.length > 0) {
    this.saveEnableDisable = false;
  } else {
    this.saveEnableDisable = true;
  }

}

/*
    @Type: File, <ts>
     @Name: saveTeamMates()
     @Who: Anup Singh
     @When: 27-May-2021
     @Why: EWM-1434 EWM-1613
     @What: submit All selected Teammate
   */
saveTeamMates() {
  let  gridTimeZone = this.gridTimeZone.filter(x => x['Id'] === this.timezonName);
  this.utctimezonName = gridTimeZone[0].Timezone;
      document.getElementsByClassName("changeEventTimeZone")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("changeEventTimeZone")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close({timezonName:this.timezonName,utctimezonName:this.utctimezonName}); }, 200);
     
}


/*
@Type: File, <ts>
@Name: onDismiss()
@Who: Anup Singh
@When: 27-May-2021
@Why: EWM-1434 EWM-1613
@What: cancel button to close the dialog
*/
onDismiss() {
  document.getElementsByClassName("changeEventTimeZone")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("changeEventTimeZone")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(true); }, 200);

  // this.dialogRef.close({ data: '' })
}


/*
    @Type: File, <ts>
    @Name: getTimeZone function
    @Who: Renu
    @When: 21-Jan-2021
    @Why: ROST-4469 EWM-4559
    @What: getting timezone dropdown
  */

    getTimeZone(){
      this._profileInfoService.getTimezone().subscribe(
        (repsonsedata:ResponceData) => {
          if(repsonsedata.HttpStatusCode==200)
          {
            this.gridTimeZone = repsonsedata.Data; 
            let  gridTimeZone = this.gridTimeZone.filter(x => x['Id'] === this.timezonName);
            this.utctimezonName = gridTimeZone[0].Timezone;                 
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
        })
     }   
  
     changeActivityTimeZone(event){
      this.timezonName=event;
  }
      
      
}
