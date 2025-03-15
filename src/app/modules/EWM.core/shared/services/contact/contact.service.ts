/*
@(C): Entire Software
@Type: File, <ts>
@Name: client.service.ts
@Who: Nitin Bhati
@When: 25-o t-2021
@Why: EWM-3272 EWM-2483
@What: Service Api's for Client
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }

  getEOHSharedContactDataById(contactId): Observable<any> {
    return this.http.get(this.serviceListClass.getEOHSharedContactData+"?id="+contactId).pipe(
      retry(1),
      catchError(handleError)
    );
  } 

  pushContactToEOH(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.pushContactToEOH, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  } 

}
