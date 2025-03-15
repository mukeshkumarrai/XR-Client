/*
@(C): Entire Software
@Type: File, <ts>
@Name: general-information.service.ts
@Who: Nitin Bhati
@When: 11-Aug-2020
@Why: EWM-2426
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
export class GeneralInformationService {

  
  /*
  @Type: File, <ts>
  @Name: score-type.service.ts
  @Who: Nitin Bhati
  @When: 11-Aug-2020
  @Why: EWM-2426
  @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
  }

 /*
  @Name: getGeneralInformationList
  @Who: Nitin Bhati
  @When: 11-Aug-2020
  @Why: EWM-2426
  @What: get General Information list data
  */
  getGeneralInformationList(formData) {
    return this.http.get(this.serviceListClass.generalInformationList + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
 /*
  @Type: File, <ts>
  @Name: updateGeneralInformation
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: update General Information Data by inserting in database
  */
  updateGeneralInformation(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateGeneralInformation, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




}
