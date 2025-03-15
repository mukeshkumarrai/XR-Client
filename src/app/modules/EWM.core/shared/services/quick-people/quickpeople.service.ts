/*
@(C): Entire Software
@Type: File, <ts>
@Name: quickpeople.service.ts
@Who: Renu
@When: 23-june-2021
@Why: ROST-1748
@What: Service Api's for quick people 
 */

import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { HttpClient } from '@angular/common/http';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';

@Injectable({
  providedIn: 'root'
})
export class QuickpeopleService {

  /*
  @Type: File, <ts>
  @Name: quickpeople.service.ts
  @Who: Renu
  @When: 23-June-202
  @Why: ROST-1748
  @What: constructor function
  */
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }


   /*
  @Name: getLocationTypeList
  @Who: Renu
  @When: 23-June-2021
  @Why: EWM-1748
  @What: get location type list data
  */
  getLocationTypeList() {
    return this.http.get(this.serviceListClass.locationTypeAllList).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
  
   /*
  @Name: getStateList
  @Who: Renu
  @When: 23-June-2021
  @Why: EWM-1748
  @What: get state list data
  */
  getStateList() {
    return this.http.get(this.serviceListClass.stateList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getAllStateByCountryId function
   @Who: Renu
   @When: 25-June-2021
   @Why: EWM-1895
   @What:  get All Data for All State
   */
  getAllStateByCountryId(id){
    return this.http.get(this.serviceListClass.getAllState + '?CountryId=' + id).pipe( 
      retry(1),
     catchError(handleError)
     );
  }

   /*
   @Type: File, <ts>
   @Name: getCountryById function
   @Who: Renu
   @When: 25-June-2021
   @Why: EWM-1895
   @What:  get All Data country realted
   */
  
   getCountryById(id){
    return this.http.get(this.serviceListClass.countryById + '?Id=' + id).pipe( 
      retry(1),
     catchError(handleError)
     );
  }
// @bantee @EWM-14292 @whn 22-09-2023

  getCountryByphoneCode(phonecode){
    return this.http.get(this.serviceListClass.countryById + '?PhoneCode=' + phonecode).pipe( 
      retry(1),
     catchError(handleError)
     );
  }

}
