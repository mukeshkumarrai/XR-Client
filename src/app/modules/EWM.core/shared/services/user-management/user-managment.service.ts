/*
@(C): Entire Software
@Type: File, <ts>
@Name: UserManagmentService.service.ts
@Who: Mukesh
@When: 12-Aprit-2021
@Why: EWM-1320
@What: Service Api's for UserManagment
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class UserManagmentService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }
  /*
 @Type: File, <ts>
 @Name: UserManagmentService.service.ts.service.ts
 @Who: Mukesh
 @When: 12-April-2021
 @Why: EWM-1320
 @What: get general setting Information related info from APi
 */
  getListAccessRequest(pagneNo?: number, pagesize?: number, orderBy?: string, searchVal?: string,activeTab?:string) {

    let parameter = '';
    if (pagesize !== 0) {
      parameter += '?PageSize=' + pagesize;
    }
    if (pagneNo !== 0) {
      parameter += '&PageNumber=' + pagneNo;
    }

    if (orderBy !== '') {

      parameter += '&orderBy=' + orderBy;
    }
    if (searchVal !== '') {

      parameter += '&search=' + searchVal;
    }

    if(activeTab!==''){
      parameter += '&GroupName=' + activeTab;
    }
    return this.http.get(this.serviceListClass.getUninvitedUsers + parameter).pipe(
      retry(0),
      catchError(handleError)
    );
  }
  getUninvitedUserById(id:number)
  {
    let parameter='?Id='+id;
    return this.http.get(this.serviceListClass.uninvitedUserByID + parameter).pipe(
      retry(0),
      catchError(handleError)
    );
  }
  updateAccessGrant(formdata):Observable<any>
  {
  return this.http.post(this.serviceListClass.updateUninvitedUserRequest,formdata).pipe(
    retry(0),
    catchError(handleError)
  );
  }
}
