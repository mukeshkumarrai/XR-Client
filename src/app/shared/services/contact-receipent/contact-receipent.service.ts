/*
   @Type: File, <ts>
    @Name: contact-receipent.service.ts
    @Who: Renu
    @When: 25-March-2021
    @Why: EWM-1181
    @What: service for contact-receipent Selection option
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../helper/exception-handler';
import { ServiceListClass } from '../sevicelist';

@Injectable({
  providedIn: 'root'
})
export class ContactReceipentService {

  constructor(private http:HttpClient,private serviceListClass:ServiceListClass) { }

/* 
@Type: File, <ts>
@Name: addImageUploadFile Function
@Who:  Renu
@When: 25-Mar-2021
@Why: ROST-1181
@What: Api call for contact receipent via first Name, last Name or email Id
*/

getUserDirectoryList(searchVal) {
  return this.http.get(this.serviceListClass.getUserDirectory + '?Search=' + searchVal).pipe(
    retry(1),
    catchError(handleError)
  );
}

}
