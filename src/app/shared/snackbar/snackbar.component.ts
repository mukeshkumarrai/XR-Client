/**
  @(C): Entire Software
  @Type: File, TS
  @Name: snakbar.component.ts
  @Who: Mukesh Kumar Rai
  @When: 15-Sep-2020
  @Why: Common service for Snack bar
  @What: Handaling data for SnackbarComponent
 */
import { Component, OnInit, Injectable, Inject  } from '@angular/core';
import {MatSnackBar, MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { AppSettingsService } from '../services/app-settings.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  progressbarValue:number;
  curSec: number = 0;
  sub: any;
  progressBarDirection:string;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar:
   MatSnackBar, private _appSetting: AppSettingsService) {
    this.progressBarDirection = this._appSetting.getProgressBar_Reverse_Direction;
    if(this.progressBarDirection==="1"){
      this.progressbarValue=0;
    }else{
      this.progressbarValue=100;
    }
    }

  ngOnInit(): void {
    this.startTimer(50);
  }


  startTimer(seconds: number) {
    if( this.curSec>0){
      this.curSec =0;
      this.sub.unsubscribe();
      // if progressBarDirection value is "1" then progress dirction is reverse mode otherwise forward mode
      if(this.progressBarDirection==="1"){
        this.progressbarValue=0;
      }else{
        this.progressbarValue=100;
      }
    }
    const time = seconds;
    const timer$ = interval(100);
    this.sub = timer$.subscribe((sec) => {
      // if progressBarDirection value is "1" then progress dirction is reverse mode otherwise forward mode
      if(this.progressBarDirection==="1"){
        this.progressbarValue = 0 + (sec * 100) / seconds;
      }else{
        this.progressbarValue = 100 - (sec * 100) / seconds;
      }
      
      this.curSec = sec;
      if (this.curSec === seconds) {
        this.sub.unsubscribe();
      }
    });
  }
  clearTimer(){
    this.sub.unsubscribe();
    // if progressBarDirection value is "1" then progress dirction is reverse mode otherwise forward mode
    if(this.progressBarDirection==="1"){
      this.progressbarValue=0;
    }else{
      this.progressbarValue=100;
    }
  }

}
