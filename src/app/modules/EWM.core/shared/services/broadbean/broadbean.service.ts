/*
@(C): Entire Software
@Type: File, <ts>
@Name: broadbean.service.ts
@Who: Adarsh singh
@When: 08-Feb-2023
@Why: ROST-10280 EWM-10428
@What: Service Api's for broadbean
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';


@Injectable({
  providedIn: 'root'
})
export class BroadbeanService {

  onBroadBeadSelect: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public broadBeanPublishedJobSelected = this.onBroadBeadSelect.asObservable();

  
  onJobHeaderDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public onJobHeaderDetailsSelected = this.onJobHeaderDetails.asObservable();
  
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {}

/*
  @Type: File, <ts>
  @Name: broadbeanJobPosting function
  @Who: Adarsh singh
  @When: 08-Feb-2023
  @Why: EWM-10279 EWM-10330
  @What: for create job broadbean
*/
broadbeanJobPosting(formdata:any) {
  return this.http.post(this.serviceListClass.broadBeanJobPosting, formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}
}
