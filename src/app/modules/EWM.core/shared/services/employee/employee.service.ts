/*
@(C): Entire Software
@Type: File, <ts>
@Name: employee.service.ts
@Who: Renu
@When: 26-Oct-2021
@Why: EWM-1734 EWM-3271
@What: Service Api's for employees
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

/*
@Type: File, <ts>
@Name: employee.service.ts
@Who: Renu
@When: 26-Oct-2021
@Why: EWM-1734 EWM-3271
@What: constructor function
*/
constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }


/* 
@Type: File, <ts>
@Name: fetchEmployeelist function
@Who: Renu
@When: 26-Oct-2021
@Why: EWM-1734 EWM-3271
@What: Api call for getting listing data in grid for employee
*/

 fetchEmployeelist(formData): Observable<any> {
      return this.http.post(this.serviceListClass.getAllEmployee, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

/* 
@Type: File, <ts>
@Name: Employeelistdata function
@Who: maneesh
@When: 29-sep-2023
@Why: EWM-14304
@What: Api call for getting listing data social profile in grid for employee
*/
    Employeelistdata(formData): Observable<any> {
      return this.http.post(this.serviceListClass.getAllEmployeeListV2, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }
  

    public EmployeelistdataV3(state: State, searchValue): Observable<GridDataResult> {
      let queryStr = `${toDataSourceRequestString(state)}`;
      if (searchValue) {
        searchValue=searchValue.replace('?', '');
        queryStr += '&' + searchValue;
      }
      return this.http
        .get(`${this.serviceListClass.getAllEmployeeListV3}?${queryStr}`)
        .pipe(
          map(response => (<GridDataResult>{
            data: response['Data'] ? response['Data'] : [],
            total: parseInt(response['TotalRecord'], 10),
          }))
        );
    }
}
