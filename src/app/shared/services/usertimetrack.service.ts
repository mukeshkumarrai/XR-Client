/**
   @(C): Entire Software
   @Type: ts
   @Name: usertimetrack.service.ts
   @Who: Mukesh Kumar rai
   @When: 24-Sept-2020
   @Why: ROST-207
   @What: This service user for geting data how much time spend by user on which component
  */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usertrack } from '../models/common.model'

@Injectable({
  providedIn: 'root'
})
export class UsertimetrackService {

  constructor() { }

  /**
    @(C): Entire Software
    @Type: Function
    @Who: Mukesh kumar rai
    @When: 10-Sept-2020
    @Why:  ROST-207
    @What: This function responsible track what time user spends on a particular page.
  */
  Usertimetrack(starttime, endtime) {
    const diffInMs = Date.parse(endtime) - Date.parse(starttime);
    const diffInHours = diffInMs / 1000 / 60 / 60;
    const totalMins = diffInMs / 1000 / 60 + ' Mins ';
    //console.warn('time spend by user = ', totalMins);
  }
}
