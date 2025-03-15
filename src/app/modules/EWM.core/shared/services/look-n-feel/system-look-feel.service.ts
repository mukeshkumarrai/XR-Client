/*
@(C): Entire Software
@Type: File, <ts>
@Name: profile-info.service.ts
@Who: Mukesh Kumar Rai
@When: 26-Nov-2020
@Why: ROST-403
@What: Service Api's
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class SystemLookFeelService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }

  /*
 @Type: File, <ts>
 @Name: system-llok-feel.service.ts
 @Who: Mukesh Kumar rai
 @When: 26-Nov-2020
 @Why: ROST-403
 @What: get system look feel  Information related info from APi
 */

  getSystemLookFeelInfo() {
    return this.http.get(this.serviceListClass.getSystemLookFeel).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: system-llok-feel.service.ts
  @Who: Mukesh Kumar rai
  @When: 26-Nov-2020
  @Why: ROST-403
  @What: Updated system look feel  Information related info from APi
  */
  updateSystemLookFeelInfo(updateData): Observable<any> {
    return this.http.post(this.serviceListClass.updateSystemLookFeel, updateData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: system-llok-feel.service.ts
  @Who: Mukesh Kumar rai
  @When: 26-Nov-2020
  @Why: ROST-403
  @What: Updated system look feel  Information related info from APi
  */
  getSystemDatetimeFormats(): Observable<any> {
    return this.http.get(this.serviceListClass.getSystemDatetimeFormats).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: system-llok-feel.service.ts
  @Who: Mukesh Kumar rai
  @When: 26-Nov-2020
  @Why: ROST-403
  @Why: For submitting the form data with some params
  @What: Api call for submitting Image Upload data
*/
  addImageUploadFile(updateData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.siteLogoupload, updateData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }
  
  /*
  @Type: File, <ts>
  @Name: system-llok-feel.service.ts
  @Who: Priti Srivastava
  @When: 21-jan-2021
  @Why: EWM-700
  @What: Api call for submitting Image Upload data
*/
addImageByUrl(updateData:any): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.imageUploadByUrl+'?imageUrl='+updateData, '')
    .pipe(
      retry(1),
      catchError(handleError)
    );
}


  /*
  @Type: File, <ts>
  @Name: fetchAllProximity
  @Who: Anup Singh
  @When: 26-oct-2021
  @Why: EWM-3276 EWM-3496
  @What: Api call for proximity data
*/
fetchAllProximity(): Observable<any> {
  return this.http.get(this.serviceListClass.getAllProximity).pipe(
    retry(1),
    catchError(handleError)
  );
}

}
