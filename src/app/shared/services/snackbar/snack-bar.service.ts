/*
@(C): Entire Software
@Type: File, <ts>
@Name: snack-bar.service.ts
@Who: Renu
@When: 17-11-2020
@Why: ROST-316
@What: for showing toast success/failure msgs
 */
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SeekPostSubmitResponseComponent } from '@app/modules/xeople-job/job-publish/seek-post-submit-response/seek-post-submit-response.component';
import { TranslateService } from '@ngx-translate/core';
import { LogoutSnackbarComponent } from 'src/app/modules/sign-in/logout-snackbar/logout-snackbar.component';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { AppSettingsService } from '../app-settings.service';
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  
  /*****************Common variables decalartion ******************/
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  workflowId: string;
  JobBoardUrl: string;

  constructor(private snackBar: MatSnackBar,private translate: TranslateService, private router: Router,
    private _appSettingService: AppSettingsService) { }
  /* It takes three parameters
    1.the message string
    2.the action
    3.the duration, alignment, etc. */
  showSuccessSnackBar(message: string, action: string) {
    // this.snackBar.open(message, action, {
    //   duration: 5000,
    //   verticalPosition: 'bottom',
    //   horizontalPosition: 'end',
    //   panelClass: ['success-snackbar'],
    // });
    let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['success-snackbar'],
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: {
        snackbarType:"scusess",
        html: '<div class="snackbarMsg"><span class="material-icons signal-icon">check_circle</span><strong>'+this.translate.instant('label_snackbarsuccessheader')+'</strong></div>'+message
      }
    });
    snackBarRef.afterDismissed().subscribe(() => {
    });
  }

  showThankyouSMSSnackBar(message: string, action: string) {
    // this.snackBar.open(message, action, {
    //   duration: 5000,
    //   verticalPosition: 'bottom',
    //   horizontalPosition: 'end',
    //   panelClass: ['success-snackbar'],
    // });
    let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['success-snackbar'],
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: {
        snackbarType:"scusess",
        html: '<div class="snackbarMsg"><span class="material-icons signal-icon">check_circle</span><strong>'+this.translate.instant('label_thankYou')+'</strong></div>'+message
      }
    });
    snackBarRef.afterDismissed().subscribe(() => {
    });
  }

   
/*
@Type: File, <ts>
@Name: showErrorSnackBar
@Who: Renu
@When: 12-02-2021
@Why: ROST-953
@What: Used for showing error msg
*/

  showErrorSnackBar(message: string, action: string) {
    // this.snackBar.open(message, action, {
    //   duration: 5000,
    //   verticalPosition: 'bottom',
    //   horizontalPosition: 'end',
    //   panelClass: ['warn-snackbar'],
    // });
    let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['warn-snackbar'],
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: {
        snackbarType:"warn",
        html: '<div class="snackbarMsg"><span class="material-icons signal-icon">cancel</span><strong>'+this.translate.instant('label_snackbarerrheader')+'</strong></div>'+message
      }
    });
    snackBarRef.afterDismissed().subscribe(() => {
    });
  }

  showNoRecordDataSnackBar(message: string, action: string) {
    // this.snackBar.open(message, action, {
    //   duration: 5000,
    //   verticalPosition: 'bottom',
    //   horizontalPosition: 'end',
    //   panelClass: ['warn-snackbar'],
    // });
    let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: ['warn-snackbar'],
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: {
        snackbarType:"warn",
        html: '<div class="snackbarMsg"><span class="material-icons signal-icon">cancel</span><strong>'+this.translate.instant('label_snackbarnodataerrheader')+'</strong></div>'+message
      }
    });
    snackBarRef.afterDismissed().subscribe(() => {
    });
  }


/*
@Type: File, <ts>
@Name: showSeekPostSnackBar
@Who: Nitin Bhati
@When: 19-12-2021
@Why: EWM-3759
@What: Used for showing seek job posting message
*/
  showSeekPostSnackBar(message: string, data: string,workflowId:string) {
    this.workflowId=workflowId;
   // this.JobBoardUrl="https://www.seek.com.au/job/55350429/";
    this.JobBoardUrl= data;
   let snackBarRef = this.snackBar.openFromComponent(SeekPostSubmitResponseComponent, {
      panelClass: ['success-snackbar'],
      duration: 20000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: {
        // @Who: Satya Prakash Gupta | @When: 02-Mar-2023 | @Why: EWM-10617 | Add class for bold and underline 
        html: '<div class="snackbarMsg"><span class="material-icons signal-icon">check_circle</span><strong>'+this.translate.instant('label_snackbarsuccessheader')+' </strong></div>Job successfully published to <a mat-stroked-button class="snackbar-link" href='+this.JobBoardUrl+' target="_blank">Seek.</a>'
        }
    });
    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
    });
  }

  /*
@Type: File, <ts>
@Name: showGDPRConsentSnackBar
@Who: Nitin Bhati
@When: 16-02-2022
@Why: EWM-5145
@What: Used for showing GDPR Consent message
*/
showGDPRConsentSnackBar(message: string, data: string) {
   let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
    panelClass: ['success-snackbar'],
    duration: 20000,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    data: {
      html: '<div class="snackbarMsg"><span class="material-icons signal-icon">check_circle</span><strong>'+this.translate.instant('label_snackbarsuccessGDPR')+message+'</strong></div>'
      }
  });
  snackBarRef.afterDismissed().subscribe(() => {
   
  });
}


/*
@Type: File, <ts>
@Name: showSeekPostSnackBar
@Who: Adarsh singh
@When: 13-July-2023
@Why: EWM-13083
@What: Used for showing logout and session expiress snackbar
*/
  showSuccessLogoutSnackBar(message: string) {
    this.snackBar.openFromComponent(LogoutSnackbarComponent, {
      panelClass: ['logout-snackbar'],
      duration: this._appSettingService.logoutAndSessionExpireSnackbarShow,
      horizontalPosition: "center",
      verticalPosition: "top",
      data: { html: message }
    });
  }

  /*
@Type: File, <ts>
@Name: showIndeedPostSnackBar
@Who: Nitin Bhati
@When: 22-11-2023
@Why: EWM-14484
@What: Used for showing Indeed job posting message
*/
showIndeedPostSnackBar(message: string, workflowId: string) {
 this.workflowId=workflowId;
 let snackBarRef = this.snackBar.openFromComponent(SeekPostSubmitResponseComponent, {
    panelClass: ['success-snackbar'],
    duration: 20000,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    data: {
      html: '<div class="snackbarMsg"><span class="material-icons signal-icon">check_circle</span><strong>'+this.translate.instant('label_snackbarsuccessheader')+' </strong></div>Job successfully published to Indeed.'
      }
  });
  snackBarRef.afterDismissed().subscribe(() => {
    this.router.navigate(['/client/jobs/job/job-list/list/' + this.workflowId]);
  });
}
/* @Name: showInfoMsgSnackBar @Who: renu @When: 07-Dec-2023 @Why:EWM-15095 EWM-15364 @What: Show imfo msg while response is coming */
showInfoMsgSnackBar(message: string, data: string,msgTitle: string | string[]) {
  this.snackBar.openFromComponent(SnackbarComponent, {
    panelClass: ['warn-snackbar'],
    duration: 5000,
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    data: {
      snackbarType:"warn",
      html: '<div class="snackbarMsg"><span class="material-icons signal-icon info-signal">info</span><strong>'+
      this.translate.instant(msgTitle)+'</strong></div>'+message
    }
  });

}
}
