/*
@(C): Entire Software
@Type: File, <ts>
@Name: ManageAccessService.service.ts
@Who: Nitin Bhati
@When: 17-Sep-2021
@Why: EWM-2859
@What: Service Api's
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class ManageAccessService {

 /*
  @Type: File, <ts>
  @Name: manage-AccessService.service.ts
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
  }


   /*
  @Name: getDocumentAccessModeList
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What: get Document Access Mode
  */
  getDocumentAccessModeList() {
    return this.http.get(this.serviceListClass.getDocumentAccessMode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Type: File, <ts>
  @Name: createGrantDocumentAccess
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What: creating manage access Data by inserting in database
  */

  createGrantDocumentAccess(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createGrantDocumentAccess,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

 /*
  @Name: getDocumentHasAccessById
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What: get Document Has Access By Folder Id
  */
  getDocumentHasAccessById(folderId:any,searchVal:any) {
    return this.http.get(this.serviceListClass.getDocumentHasAccessById + '?id=' + folderId + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getSearchUserWithGroup
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What: get Document Has Access By Folder Id
  */
  getSearchUserWithGroup(searchVal:any) {
    return this.http.get(this.serviceListClass.getSearchUserwithGroup + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: removeDocumentAccess
  @Who: Nitin Bhati
  @When: 17-Sep-2021
  @Why: EWM-2859
  @What: remove Document Access data
  */
  removeDocumentAccess(formData): Observable<any> {
    return this.http.post(this.serviceListClass.removeDocumentAccess, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


    /*
  @Name: getManageAccessModeList
  @Who: Anup Singh
  @When: 11-Jan-2022
  @Why: EWM-4530
  @What: get Manage Access Mode
  */
 getManageAccessModeList() {
  return this.http.get(this.serviceListClass.getManageAccessMode).pipe(
    retry(1),
    catchError(handleError)
  );
}


}

