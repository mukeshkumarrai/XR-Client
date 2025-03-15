/*
@(C): Xeople Software
@Type: File, <ts>
@Name:integartions-board.service.ts
@Who: priti srivastava
@When: 16-Nov-2020
@Why: ROST-316
@What: Service Api's
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from './../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
@Injectable({
  providedIn: 'root'
})
export class IntegrationsBoardService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }
  
  fetchIntegrationBilingType() {
    return this.http.get(this.serviceListClass.get_integration_biling_type).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   
  getIntegrationCategory() {
    return this.http.get(this.serviceListClass.get_integration_Category).pipe(
      retry(1),
      catchError(handleError)
    );
  } 
  getIntegrationStatus() {
    return this.http.get(this.serviceListClass.get_integration_status).pipe(
      retry(1),
      catchError(handleError)
    );
  } 
  getIntegrationType() {
    return this.http.get(this.serviceListClass.get_integration_type+'?OrderBy=TypeName,asc').pipe(
      retry(1),
      catchError(handleError)
    );
  } 
  getIntegrationTag() {
    return this.http.get(this.serviceListClass.get_integration_tag).pipe(
      retry(1),
      catchError(handleError)
    );
  } 
  getIntegrationBoard() {
    return this.http.get(this.serviceListClass.get_integration_Board).pipe(
      retry(1),
      catchError(handleError)
    );
  } 
/*
 @Type: File, <ts>
 @Name: getIntegrationAll function
 @Who: Nitin Bhati
 @When: 03-Nov-2021
 @Why: EWM-3450
 @What: For getting registration code data 
*/
  getIntegrationAll() {
    return this.http.get(this.serviceListClass.getIntegrationAll).pipe(
      retry(1),
      catchError(handleError)
    );
  } 
 

  /*
 @Type: File, <ts>
 @Name: getOtherIntegrationAll function
 @Who: Anup Singh
 @When: 04-Feb-2022
 @Why: EWM-4063 EWM-4610
 @What: For getting other integration data 
*/
getOtherIntegrationAll() {
  return this.http.get(this.serviceListClass.getOtherIntegrationAll).pipe(
    retry(1),
    catchError(handleError)
  );
} 

 /*
 @Type: File, <ts>
 @Name: getMeetingPlatformList function
 @Who: Nitin Bhati
 @When: 20-April-2022
 @Why: EWM-6237
 @What: For getting other integration data 
*/
getMeetingPlatformList(intergrationType:any) {
  return this.http.get(this.serviceListClass.getOtherIntegrationAll + '?intergrationType=' + intergrationType).pipe(
    retry(1),
    catchError(handleError)
  );
} 
/*
 @Type: File, <ts>
 @Name: getCreateMeetingUrl function
 @Who: Nitin Bhati
 @When: 04-April-2022
 @Why: EWM-6237
 @What: For getting create Meeting Url
*/
createMeetingUrl(formData): Observable<any>  {
  return this.http.post(this.serviceListClass.creatMeetingUrl, formData).pipe(
    retry(1),
    catchError(handleError)
  );
} 

}
