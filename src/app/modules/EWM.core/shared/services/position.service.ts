
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../shared/services/sevicelist';
import { handleError } from '../../../../shared/helper/exception-handler';
@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }
  getAllposition(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getPosition_All + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&OrderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getpositionbyid(Id) {
    return this.http.get(this.serviceListClass.getPosition_byId + '?id=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getpositionbyIndustry(Id) {
    return this.http.get(this.serviceListClass.getPosition_ByIndustry + '?industryid=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getpositionCount(Id) {
    return this.http.get(this.serviceListClass.getPositionCount + '?industryid=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  createPostion(formdata):Observable<any>
  {
  return this.http.post(this.serviceListClass.createPosition,formdata).pipe(
    retry(0),
    catchError(handleError)
  );
  }
  updatePostion(formdata):Observable<any>
  {
  return this.http.post(this.serviceListClass.updatePosition,formdata).pipe(
    retry(0),
    catchError(handleError)
  );
  }
  bulkUpdatePostion(formdata):Observable<any>
  {
  return this.http.post(this.serviceListClass.bulkUpdatePosition,formdata).pipe(
    retry(0),
    catchError(handleError)
  );
  }
  deletePostion(formdata):Observable<any>
  {
  return this.http.post(this.serviceListClass.deletePosition,formdata).pipe(
    retry(0),
    catchError(handleError)
  );
  }
  checkPostionName(formdata):Observable<any>
  {
  return this.http.post(this.serviceListClass.checkPositionDuplicacy,formdata).pipe(
    retry(0),
    catchError(handleError)
  );
  }
}
