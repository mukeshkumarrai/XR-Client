import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toDataSourceRequestString, toODataString } from '@progress/kendo-data-query';

@Injectable({
  providedIn: 'root'
})
export class ElasticService { 
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {}

/*
  @Type: File, <ts>
  @Name: getElasticSearchEngine function
  @Who: Nitin Bhati
  @When: 18-Feb-2023
  @Why: EWM-10317
  @What: for create elastic Search engine
*/
getElasticSearchEngine(formdata:any) {
  return this.http.get(this.serviceListClass.elasticSearchEngine+formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}
/* @Name: fetch @Who: renu @When: 15-Sept-2023 @Why:EWM-13708 EWM-13925 @What:get xeople serah grid list data */

public fetch(state: State,customFilterString:string): Observable<GridDataResult> {  
        const queryStr = `${toDataSourceRequestString(state)}`;
        let text = queryStr +customFilterString;
        return this.http
            .get(`${this.serviceListClass.elasticSearchEngine}?${text}`)
            .pipe(
              map(response => (<GridDataResult>{
                             data: response['Data']?response['Data']:[], /*******@when: 28-04-2023  @WHo: Renu @WHY: EWM-9844 EWM-10187***********/
                             total: parseInt(response['TotalRecord'], 10)
              }))
            );
}
}
