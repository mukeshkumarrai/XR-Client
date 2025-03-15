import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from 'src/app/shared/helper/exception-handler';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }


    /*
   @Type: File, <ts>
   @Name: fetchZoomHistoryList function
   @Who: Renu
   @When: 05-Feb-2022
   @Why: EWM-4472 EWM-4523
   @What:  fetch record zoom history  list 
   */

   fetchZoomHistoryList(formData) {
    return this.http.get(this.serviceListClass.zoomHistoryList +formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   /*
   @Type: File, <ts>
   @Name: fetchZoomHistoryDetail function
   @Who: Renu
   @When: 05-Feb-2022
   @Why: EWM-4472 EWM-4523
   @What:  fetch record zoom history  list detail
   */

   fetchZoomHistoryDetail(uniqueId) {
    return this.http.get(this.serviceListClass.zoomHistoryDetail + '?id=' + uniqueId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

     /*
   @Type: File, <ts>
   @Name: fetchCanDetail function
   @Who: Renu
   @When: 05-Feb-2022
   @Why: EWM-4472 EWM-4523
   @What:  fetch record zoom history  list detail of cadidate by phone no
   */

   fetchCanDetail(phonenumber) {
    return this.http.get(this.serviceListClass.candidatePhoneNo + '?phonenumber=' + phonenumber).pipe(
      retry(1),
      catchError(handleError)
    );
  }

}
