import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, toODataString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ServiceListClass } from '../services/sevicelist';

@Injectable({
  providedIn: 'root'
})
export class GriddataService {

  constructor(private http: HttpClient,private serviceListClass: ServiceListClass,
    ) { }

    public fetch(state: State,filter): Observable<GridDataResult> {
      const xx =''
      const queryStr = `${toODataString(state)}`;
      let re = /\$/gi;
      let queryStrfinal = queryStr.replace(re, "");
      let text = queryStrfinal + filter;
      console.log(text,'queryStrfinal');
      return this.http
          .get(`${this.serviceListClass.getcandidateall}?${text}`)
          .pipe(
              map(response => (<GridDataResult>{
                  data: response['Data']?response['Data']:[], /*******@when: 28-04-2023  @WHo: Renu @WHY: EWM-9844 EWM-10187***********/
                  total: parseInt(response['TotalRecord'], 10)
              }))
          );
  }
}

