/*
@(C): Entire Software
@Type: File, <ts>
@Name: score-type.service.ts
@Who: Nitin Bhati
@When: 10-Aug-2020
@Why: EWM-2443
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
export class ScoreTypeService {
/*
  @Type: File, <ts>
  @Name: score-type.service.ts
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
  }

 /*
  @Name: getScoreTypeList
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: get Score type type list data
  */
  getScoreTypeList(pagesize, pagneNo, orderBy, searchVal,idName,id) {
    return this.http.get(this.serviceListClass.scoreTypeList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  

  /*
  @Type: File, <ts>
  @Name: scoreTypeCreate
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: creating score type Data by inserting in database
  */

  createScoreType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.scoreTypeCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateScoreType
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: update score type type data
  */

  updateScoreType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.scoreTypeUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
/*
  @Type: File, <ts>
  @Name: getScoreTypeByID
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: get score type data by ID from APi
  */
  getScoreTypeByID(formData) {
    return this.http.get(this.serviceListClass.scoreTypeByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteScoreType
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: delete score type data by id
  */

  deleteScoreType(formData): Observable<any> {
    return this.http.get(this.serviceListClass.scoreTypeDelete + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkScoreTypeDuplicacy
  @Who: Nitin Bhati
  @When: 10-Aug-2020
  @Why: EWM-2443
  @What: check score type duplicay
  */
  // checkScoreTypeDuplicacy(formData) {
  //   return this.http.get(this.serviceListClass.scoreTypeDuplicate + formData).pipe(
  //     retry(1),
  //     catchError(handleError)
  //   );
  // }

  checkScoreTypeDuplicacy(formData): Observable<any> {
    return this.http.post(this.serviceListClass.scoreTypeDuplicate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

}

