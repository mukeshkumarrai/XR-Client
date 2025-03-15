/*
@(C): Entire Software
@Type: File, <ts>
@Name: CandidateExperienceService.service.ts
@Who: Nitin Bhati
@When: 17-Aug-2020
@Why: EWM-2529
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
export class CandidateExperienceService {

 /*
  @Type: File, <ts>
  @Name: Candidate-ExperienceService.service.ts
  @Who: Nitin Bhati
  @When: 17-Aug-2020
  @Why: EWM-2529
  @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
  }

 /*
  @Name: getExperienceList
  @Who: Nitin Bhati
  @When: 17-Aug-2020
  @Why: EWM-2529
  @What: get candidate experience list data
  */
  getExperienceList(formData) {
    return this.http.get(this.serviceListClass.candidateExperienceAllList+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createExperience
  @Who: Nitin Bhati
  @When: 17-Aug-2020
  @Why: EWM-2529
  @What: creating experience Data by inserting in database
  */

  createExperience(formData): Observable<any> {
    return this.http.post(this.serviceListClass.candidateExperienceCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateExperience
  @Who: Nitin Bhati
  @When: 17-Aug-2020
  @Why: EWM-2529
  @What: update experience data
  */

  updateExperience(formData): Observable<any> {
    return this.http.post(this.serviceListClass.candidateExperienceUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
/*
  @Type: File, <ts>
  @Name: getExperienceByID
  @Who: Nitin Bhati
  @When: 17-Aug-2020
  @Why: EWM-2529
  @What: get Experience by ID from APi
  */
  getExperienceByID(formData) {
    return this.http.get(this.serviceListClass.candidateExperienceById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteExperience
  @Who: Nitin Bhati
  @When: 17-Aug-2020
  @Why: EWM-2529
  @What: delete experience data by id
  */

  deleteExperience(formData): Observable<any> {
    return this.http.request('delete',this.serviceListClass.candidateExperienceDelete ,{body: formData}).pipe(
      retry(1),
      catchError(handleError)
    );
  }

}