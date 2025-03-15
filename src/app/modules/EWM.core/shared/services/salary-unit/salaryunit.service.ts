/*
  @Type: File, <ts>
  @Name: salaryunit.service.ts
  @Who: priti srivastava
  @When: 24-may-2021
  @Why: EWM-1616
  @What: salary unit 
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
export class SalaryunitService {

  constructor(private https:HttpClient,private _servicelist:ServiceListClass) { }
  getdataByID(ID:any):Observable<any>
  {
return this.https.get<any[]>(this._servicelist.getSalaryById+'?id='+ID).pipe(retry(1),catchError(handleError));
  }
  getAll(pageSize:number, pageNo:number, sortingValue:string, searchVal:string):Observable<any>
  {
    return this.https.get<any[]>(
      this._servicelist.getAllSalary+'?PageNumber='+pageNo+'&PageSize='+pageSize+'&orderBy='+sortingValue+'&search='+searchVal
    )
    .pipe(
      retry(1),
      catchError(handleError)
    )
  }

checkdDuplicay(formdata:any):Observable<any>
  {
    return this.https.post<any[]>(this._servicelist.checkDuplicityofSalaryUnit,formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
  }


  Create(formdata:any):Observable<any>
  {
    return this.https.post<any[]>(this._servicelist.addSalaryUnit,formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
  }
  delete(val:any):Observable<any>{
    return this.https.get(this._servicelist.deleteSalaryUnit+'?id='+val)
    .pipe(
      retry(1),
      catchError(handleError)
    )
  }
  update(formdata:any):Observable<any>
  {
    return this.https.post(this._servicelist.UpdateSalaryUnit,formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
  }
}
