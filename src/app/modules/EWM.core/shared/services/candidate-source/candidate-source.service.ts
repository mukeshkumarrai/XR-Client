/*
@(C): Entire Software
@Type: File, <ts>
@Name: candidate-source.service.ts
@Who: Ankit Rawat
@When: 16 May 2024
@Why: EWM-17076
@What: Service Api's for candidate Source
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from 'src/app/shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class CandidateSourceService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }

  public getCandidateSourceList(state: State, searchValue): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      queryStr += '&search=' + searchValue;
    }
    return this.http
      .get(`${this.serviceListClass.getCandidateSourceListURL}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }

  getCandidateSourceByID(formData) {
    return this.http.get(this.serviceListClass.getCandidateSourceByIdURL + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  updateCandidateSource(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateCandidateSourceURL, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  //by maneesh ewm-18474 create application source
  createCandidateSourceURL(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createCandidateSourceURL, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  public getCandidateSourceChildList(state: State, searchValue,ParentID): Observable<GridDataResult> {    
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      queryStr += '&search=' + searchValue + '&ParentID=' + ParentID  ;
    }
    if (ParentID) {
      queryStr += '&ParentID=' + ParentID  ;
    }
    return this.http
      .get(`${this.serviceListClass.getCandidateChildSourceListURL}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }

  getCandidateSourceDeleteURL(formData): Observable<any> {
    return this.http.request('delete',this.serviceListClass.getCandidateSourceDeleteURL+'?SourceId='+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

}
