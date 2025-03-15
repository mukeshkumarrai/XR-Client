/*
@(C): Entire Software
@Type: File, <ts>
@Name: degree-type.service.ts
@Who: Nitin Bhati
@When: 21-Aug-2020
@Why: EWM-2502
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
export class CandidateDegreeTypeService {

  /*
  @Type: File, <ts>
  @Name: degree-type.service.ts
  @Who: Nitin Bhati
  @When: 21-Aug-2020
  @Why: EWM-2502
  @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
  }

 /*
  @Name: getDegreeTypeList
  @Who: Nitin Bhati
  @When: 21-Aug-2020
  @Why: EWM-2502
  @What: get Degree type type list data
  */
  getDegreeTypeList(pagesize, pagneNo, orderBy, searchVal,idName,id) {
    return this.http.get(this.serviceListClass.degreeTypeList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  

  /*
  @Type: File, <ts>
  @Name: createDegreeType
  @Who: Nitin Bhati
  @When: 21-Aug-2020
  @Why: EWM-2502
  @What: creating degree type Data by inserting in database
  */

  createDegreeType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.degreeTypeCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateDegreeType
  @Who: Nitin Bhati
  @When: 21-Aug-2020
  @Why: EWM-2502
  @What: update degree type type data
  */

  updateDegreeType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.degreeTypeUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
/*
  @Type: File, <ts>
  @Name: getDegreeTypeByID
  @Who: Nitin Bhati
  @When: 21-Aug-2020
  @Why: EWM-2502
  @What: get degree type data by ID from APi
  */
  getDegreeTypeByID(formData) {
    return this.http.get(this.serviceListClass.degreeTypeById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteDegreeType
  @Who: Nitin Bhati
  @When: 21-Aug-2020
  @Why: EWM-2502
  @What: delete degree type data by id
  */

  deleteDegreeType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.degreeTypeDelete,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkDegreeTypeDuplicacy
  @Who: Nitin Bhati
  @When: 21-Aug-2020
  @Why: EWM-2502
  @What: check degree type duplicay
  */
  checkDegreeTypeDuplicacy(formData) {
    return this.http.get(this.serviceListClass.degreeTypeDuplicate + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

}

