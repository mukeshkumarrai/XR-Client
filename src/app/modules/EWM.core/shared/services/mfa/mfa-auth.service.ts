import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../../../shared/helper/exception-handler';


@Injectable({
  providedIn: 'root'
})
export class MfaAuthService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }


  /*
   @Type: File, <ts>
    @Name: getMfaQrCode
    @Who: Mukesh Kumar
    @When: 29-Dec-2020
    @Why: ROST-307
    @What: get MfaQrCode from APi
 */

  getMfaQrCode() {
    return this.http.get(this.serviceListClass.getMfaQrCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
    @Name: getMfaQrCode
    @Who: Mukesh Kumar
    @When: 29-Dec-2020
    @Why: ROST-307
    @What: get MfaQrCode from APi
 */

  authenticatPin(code) {

    return this.http.post(this.serviceListClass.authenticatPin, code).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
    @Name: getMfaQrCode
    @Who: Mukesh Kumar
    @When: 29-Dec-2020
    @Why: ROST-432
    @What: alternate Email
 */

  alternateEmail(email) {

    return this.http.post(this.serviceListClass.alternateEmail, email).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
    @Name: alternateEmailOtpvalidate
    @Who: Mukesh Kumar
    @When: 30-Dec-2020
    @Why: ROST-432
    @What: alternate email opt validation
 */
  alternateEmailOtpvalidate(opt) {
    return this.http.post(this.serviceListClass.alternateEmailOtpvalidate, opt).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
   @Name: getSecrurityquestion
   @Who: Mukesh Kumar
   @When: 30-Dec-2020
   @Why: ROST-432
   @What: alternate email opt validation
*/
  getSecrurityquestion() {
    return this.http.get(this.serviceListClass.getSecrurityquestion).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  finishMfaAuth(data) {
    return this.http.post(this.serviceListClass.createUserMfa, data).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  disableUserMfa() {
    return this.http.post(this.serviceListClass.disableUserMfa, '').pipe(
      retry(1),
      catchError(handleError)
    );
  }
}
