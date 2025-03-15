/*
 @(C): Entire Software
@Type: File, <ts>
@Name: country-master.service.ts
@Who: Renu
@When: 19-Sep-2020
@Why: ROST-299
@What: country CURD Based Service File
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/exception-handler';
import { ServiceListClass } from '../sevicelist';

@Injectable({
  providedIn: 'root'
})
export class CountryMasterService {

  constructor(private http: HttpClient, private serviceListClass: ServiceListClass) { }

  /*
  @Type: File, <ts>
  @Name: country-master.service.ts
  @Who: Renu
  @When: 19-Sep-2020
  @Why: ROST-299
  @What: Api call for Listing of country data
  */
  getCountryList(pagneNo, pagesize) {
    return this.http.get(this.serviceListClass.countryList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getRegionList
  @Who: Renu
  @When: 19-Sep-2020
  @Why: ROST-299
  @What: Api call for Listing of RE=egion data
  */
  getRegionList() {
    return this.http.get(this.serviceListClass.regionList).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: getCountryByname
  @Who: Renu
  @When: 11-dec-2020
  @Why: ROST-536
  @What: Api call for Listing of countrydata by Name
  @Param: @name
  */
  getCountryByname(countryName) {
    return this.http.get(this.serviceListClass.countryByName + `?countryname=` + countryName).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getOrganizationList
  @Who: Renu
  @When: 08-Apr-2021
  @Why: ROST-1289
  @What: get all organization Details
  */
 getOrganizationList() {
  return this.http.get(this.serviceListClass.getOrganizationList).pipe(
    retry(1),
    catchError(handleError)
  );
}

}
