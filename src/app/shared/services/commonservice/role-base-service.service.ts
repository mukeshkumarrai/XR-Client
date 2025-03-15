/*
@(C): Entire Software
@Type: File, <ts>
@Name: role-base-service.service.ts
@Who: Anup Singh
@When: 01-Jun-2021
@Why: EWM-
@What: this file is used for common observable service to communicate b/q compenents independenantly
 */


import { HttpClient, HttpParams, HttpHeaders, HttpBackend } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { delay } from 'rxjs/operators/delay';
import { ResponseData } from '../common-servies.service';
import { Title } from '@angular/platform-browser';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../helper/exception-handler';
import { ServiceListClass } from '../sevicelist';

@Injectable({
  providedIn: 'root'
})
export class RoleBaseServiceService {

  constructor(handler: HttpBackend, private serviceListClass: ServiceListClass, private http: HttpClient) { }

  /*
   @Type: File, <ts>
   @Name: getRollBaseAccess
   @Who: Anup Singh
   @When: 01-June-2021
   @Why: EWM-
   @What: get Roll Access
   */
  getRollBaseAccess() {
    return this.http.get(this.serviceListClass.getRollAccess).pipe(
      retry(1),
      catchError(handleError)
    );
  }
}
