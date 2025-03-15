import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';


@Injectable({
  providedIn: 'root'
})
export class CandidateTagService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }
  fetchCandidateTagList(pagesize, pageNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getCandidateTagAll + '?PageNumber=' + pageNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  fetchCandidateTagById(Id:number) {
    return this.http.get(this.serviceListClass.getCandidateTagById + '?Id='+ Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  createCandidateTag(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createCandidatetag, formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }
 updateCandidateTag(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateCandidateTag, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  deleteCandidateTag(Id:number):Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.deleteCandidateTag + '?Id='+ Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  checkdDuplicay(value:any):Observable<any> {
    return this.http.post(this.serviceListClass.checkCandidatetagIsexist, value).pipe(
      retry(1),
      catchError(handleError)
    );

  }
  
}
