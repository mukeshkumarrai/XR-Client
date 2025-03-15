/*
    @(C): Entire Software
    @Type: File, <html>
    @Name: Logut and session expires component
    @Who: Adarsh singh
    @When: 10-July-2023
    @Why: common service for toast
*/

import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
    selector: "app-logout-snackbar",
    templateUrl: "./logout-snackbar.component.html",
    styleUrls: ["./logout-snackbar.component.css"]
})

export class LogoutSnackbarComponent {
    url: any;
    progressbarValue: number;
    curSec: number = 0;
    sub: any;
    progressBarDirection: string;
    isLoggedOutMode:boolean;

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar: MatSnackBar, private _appSetting: AppSettingsService) {
        this.progressBarDirection = this._appSetting.getProgressBar_Reverse_Direction;
        if (this.progressBarDirection === "1") {
            this.progressbarValue = 0;
        } else {
            this.progressbarValue = 100;
        }
        data.html == 'label_login_logoutMessage' ? this.isLoggedOutMode = true : this.isLoggedOutMode = false;
    }

    ngOnInit(): void {
        this.startTimer(100);
    }
/*
  @Who: Adarsh singh
  @When: 14-07-2023
  @Why:  EWM-13082
  @What: startTimer function
*/
    startTimer(seconds: number) {
        if (this.curSec > 0) {
            this.curSec = 0;
            this.sub.unsubscribe();
            if (this.progressBarDirection === "1") {
                this.progressbarValue = 0;
            } else {
                this.progressbarValue = 100;
            }
        }
        const timer$ = interval(100);
        this.sub = timer$.subscribe((sec) => {
            if (this.progressBarDirection === "1") {
                this.progressbarValue = 0 + (sec * 100) / seconds;
            } else {
                this.progressbarValue = 100 - (sec * 100) / seconds;
            }

            this.curSec = sec;
            if (this.curSec === seconds) {
                this.sub.unsubscribe();
            }
        });
    }
/*
  @Who: Adarsh singh
  @When: 14-07-2023
  @Why:  EWM-13082
  @What: startTimer function
*/
    clearTimer() {
        this.sub.unsubscribe();
        if (this.progressBarDirection === "1") {
            this.progressbarValue = 0;
        } else {
            this.progressbarValue = 100;
        }
    }
}