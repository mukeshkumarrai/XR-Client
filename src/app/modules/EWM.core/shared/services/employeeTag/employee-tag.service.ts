
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTagService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }
  fetchEmployeeTagList(pagesize, pageNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getEmployeeTagAll + '?PageNumber=' + pageNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  fetchEmployeeTagById(Id:number) {
    return this.http.get(this.serviceListClass.getEmployeeTagById + '?Id='+ Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  createEmployeeTag(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createEmployeetag, formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }
 updateEmployeeTag(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateEmployeeTag, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  deleteEmployeeTag(Id:number):Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.deleteEmployeeTag + '?Id='+ Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  checkdDuplicay(value:any):Observable<any> {
    return this.http.post(this.serviceListClass.checkEmployeetagIsexist, value).pipe(
      retry(1),
      catchError(handleError)
    );

    // return this.http.get<any[]>(this.serviceListClass.checkEmployeetagIsexist + value).pipe(
    //   retry(1),
    //   catchError(handleError)
    // );
  }
  checkdDuplicayOfKeyword(value:any):Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.checkemployeetagkeywordisexist + value).pipe(
      retry(1),
      catchError(handleError)
    );
  }
}
