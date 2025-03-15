/*
  @(C): Entire Software
  @Type: welcome.component.ts
  @Who: Nitin Bhati
  @When: 20-July-2021
  @Why: EWM-2139
  @What: welcome page after login to system
*/
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginResponce, ResponceData } from 'src/app/shared/models';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  /*****************common varibale declaration************************* */
  public loginData: any;
  loading: boolean;
  addForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<WelcomeComponent>,private fb: FormBuilder, public router: Router,
    private authenticationService: LoginService,
    private translateService: TranslateService,
    private _snackBarService: SnackBarService) { 
      this.addForm = this.fb.group({
        QuickTourValue: [true]
      });
    }

  /* 
    @Type: File, <ts>
    @Name: ngOnInit function
    @Who: Nitin Bhati
    @When: 20-July-2021
    @Why: EWM-2139
    @What: For calling 
*/ 
  ngOnInit() {
      //this.updateQucikTour();
    }
 
    /* 
    @Type: File, <ts>
    @Name: updateQucikTour function
    @Who: Nitin Bhati
    @When: 20-July-2021
    @Why: EWM-2139
    @What: For call update quick Tour api 
  */ 
    updateQucikTour() {
      let updateLocObj={};
      updateLocObj['QuickTour'] = 1;
      this.authenticationService.updateQucikTour(updateLocObj).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          //this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          }
      },
      error => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(error.Message), error.StatusCode);
       })
    }

 /* 
    @Type: File, <ts>
    @Name: changed function
    @Who: Nitin Bhati
    @When: 20-July-2021
    @Why: EWM-2139
    @What: For call checkbox on onchange 
*/ 
    changed(evt) {
      let updateQuickObj={};
       if (evt.target.checked == true) {
            updateQuickObj['QuickTour'] = 1;
            localStorage.setItem('QuickTour', '1');
          } else {
            updateQuickObj['QuickTour'] = 0;
            localStorage.setItem('QuickTour', '0');
           }
       this.authenticationService.updateQucikTour(updateQuickObj).subscribe(
        (data: ResponceData) => {
          this.loading = false;
          if (data.HttpStatusCode == 200) {
           // this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            }
        },
        error => {
          this._snackBarService.showErrorSnackBar(this.translateService.instant(error.Message), error.StatusCode);
         })

  }

  onNoClick(): void {    
    localStorage.setItem('QuickTour', '0');
   document.getElementsByClassName("welcomeModal")[0].classList.remove("animate__zoomIn")
   document.getElementsByClassName("welcomeModal")[0].classList.add("animate__zoomOut");
   setTimeout(() => {this.dialogRef.close(); }, 500);
 }

}
