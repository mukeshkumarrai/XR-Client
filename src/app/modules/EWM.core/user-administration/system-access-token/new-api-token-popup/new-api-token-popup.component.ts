/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 06-April-2022
    @Why: EWM-5580 EWM-6098
    @What:  This page wil be use only for new-api-token Component ts
*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { TokenCreateConfirmBoxPopupComponent } from '../token-create-confirm-box-popup/token-create-confirm-box-popup.component';

@Component({
  selector: 'app-new-api-token-popup',
  templateUrl: './new-api-token-popup.component.html',
  styleUrls: ['./new-api-token-popup.component.scss']
})
export class NewApiTokenPopupComponent implements OnInit {
  newApiTokenForm: FormGroup;
  public loading: boolean=false;
  public hideClientSecret:boolean = true;
  public hideClientId:boolean = true;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<NewApiTokenPopupComponent>,
  private textChangeLngService: TextChangeLngService, private jobService: JobService, private route: Router,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService, private profileInfoService: ProfileInfoService,private _appSetting: AppSettingsService) {
    
      this.newApiTokenForm = this.fb.group({
        ClientId:[null],
        ClientSecret: [''],

      });
    }

  ngOnInit(): void {
    this.newApiTokenForm.patchValue({
      ClientId:this.data?.ClientId,
      ClientSecret:this.data?.ClientSecret,
    })
  }




  /*
@Type: File, <ts>
@Name: copyInputClientId
@Who: Anup Singh
@When: 13-April-2022
@Why: EWM-5580 EWM-6099
@What: for copy client id and secret key
*/
copyInputClientId(inputElement){
  this.hideClientId = false;
  setTimeout(() => {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.hideClientId = true;
  }, 200);
 
}

  /*
@Type: File, <ts>
@Name: copyInputClientSecret
@Who: Anup Singh
@When: 13-April-2022
@Why: EWM-5580 EWM-6099
@What: for copy client id and secret key
*/
copyInputClientSecret(inputElement){
  this.hideClientSecret = false;
  setTimeout(() => {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.hideClientSecret = true;
  }, 200);
 
}


  /*
@Type: File, <ts>
@Name: onClose
@Who: Anup Singh
@When: 13-April-2022
@Why: EWM-5580 EWM-6099
@What: for close popup and in second case open msg popup
*/
onClose() {
  if(this.data?.isPopUpClose==true){
    document.getElementsByClassName("generateNewApiToken")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("generateNewApiToken")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: false }); }, 200);
  
  }else{
    document.getElementsByClassName("generateNewApiToken")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("generateNewApiToken")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ resType: true }); }, 200);
    
    const dialogRef = this.dialog.open(TokenCreateConfirmBoxPopupComponent, {
      data: new Object({EmailId: this.data?.EmailId}),
      panelClass: ['xeople-modal', 'createTokenComfirmationBox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {
        // document.getElementsByClassName("generateNewApiToken")[0].classList.remove("animate__zoomIn")
        // document.getElementsByClassName("generateNewApiToken")[0].classList.add("animate__zoomOut");
        // setTimeout(() => { this.dialogRef.close({ resType: true }); }, 200);
      }
      else {
        // console.log("false")
      }
  
    });
  }
  }


}
