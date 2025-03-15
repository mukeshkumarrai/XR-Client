/*
@(C): Entire Software
@Type: File, <ts>
@Name: mail-service.service.ts
@Who: Renu
@When: 21-Sept-2021
@Why: EWM-2511 EWM-2704
@What: Service Api's for Job
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../shared/services/sevicelist';
import { handleError } from '../../../shared/helper/exception-handler';


@Injectable({
  providedIn: 'root'
})
export class MailServiceService {

  /*
  @Type: File, <ts>
  @Name: constructor
  @Who: Renu
  @When: 21-Sept-2021
  @Why: EWM-2511 EWM-2704
  @What: constructor function
  */
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }

   /*
   @Type: File, <ts>
   @Name: fetchMailList function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What:  fetch record mail data list 
   */

   fetchMailList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.emailInbox + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: fetchMailCount function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What:  fetch record mail data list count info 
   */

   fetchMailCount() {
    return this.http.get(this.serviceListClass.getMailCount).pipe(
      retry(1),
      catchError(handleError)
    );
  }
}
