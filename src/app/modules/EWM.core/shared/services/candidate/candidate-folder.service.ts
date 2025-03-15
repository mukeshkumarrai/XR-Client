/*
@(C): Entire Software
@Type: File, <ts>
@Name: CandidateFolderService.service.ts
@Who: Nitin Bhati
@When: 18-Aug-2020
@Why: EWM-2495
@What: Service Api's
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Injectable({
  providedIn: 'root'
})
export class CandidateFolderService {
/*
  @Type: File, <ts>
  @Name: Candidate-FolderService.service.ts
  @Who: Nitin Bhati
  @When: 18-Aug-2020
  @Why: EWM-2495
  @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
  }


   /*
  @Name: getFolderListAll
  @Who: Nitin Bhati
  @When: 18-Aug-2020
  @Why: EWM-2495
  @What: get candidate folder list data
  */
  getFolderListAll(userType) {
    return this.http.get(this.serviceListClass.candidateFolderAllList+'?userType='+userType).pipe(
      retry(1),
      catchError(handleError)
    );
  }

 /*
  @Name: getFolderList
  @Who: Nitin Bhati
  @When: 18-Aug-2020
  @Why: EWM-2495
  @What: get candidate folder list data
  */
  getFolderList(pagesize, pagneNo, orderBy, searchVal,idName,id,userType) {
    return this.http.get(this.serviceListClass.candidateFolderAllList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&userType='+userType).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createFolder
  @Who: Nitin Bhati
  @When: 18-Aug-2020
  @Why: EWM-2495
  @What: creating experience Data by inserting in database
  */

  createFolder(formData): Observable<any> {
    return this.http.post(this.serviceListClass.candidateFolderCreate,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateExperience
  @Who: Nitin Bhati
  @When: 18-Aug-2020
  @Why: EWM-2495
  @What: update experience data
  */

  updateFolder(formData): Observable<any> {
    return this.http.post(this.serviceListClass.candidateFolderUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
/*
  @Type: File, <ts>
  @Name: getExperienceByID
  @Who: Nitin Bhati
  @When: 18-Aug-2020
  @Why: EWM-2495
  @What: get Experience by ID from APi
  */
  getFolderByID(formData) {
    return this.http.get(this.serviceListClass.candidateFolderById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteDelete
  @Who: Nitin Bhati
  @When: 18-Aug-2020
  @Why: EWM-2495
  @What: delete Folder data by id
  */

  deleteDelete(formData): Observable<any> {
    return this.http.post(this.serviceListClass.candidateFolderDelete, formData).pipe(
    //return this.http.request('delete',this.serviceListClass.candidateFolderDelete ,{body: formData}).pipe(
      retry(1),
      catchError(handleError)
    );
  }


/*
  @Name: getCandidateMapToFolder
  @Who: Nitin Bhati
  @When: 20-Aug-2020
  @Why: EWM-2495
  @What: get map candidate folder list data
  */
  getCandidateMapToFolder(formData) {
    return this.http.get(this.serviceListClass.getCandidateMapToFolder+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Type: File, <ts>
  @Name: updateMapCandidateToFolder
  @Who: Nitin Bhati
  @When: 20-Aug-2020
  @Why: EWM-2495
  @What: update map candidate folder data
  */

  updateMapCandidateToFolder(formData): Observable<any> {
    return this.http.post(this.serviceListClass.mapCandidateToFolderUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

/*
  @Name: getCandidateMapToFolder
  @Who: Nitin Bhati
  @When: 20-Aug-2020
  @Why: EWM-2495
  @What: get map candidate folder list data
  */
  getCandidateFilterFolderList(formData) {
    return this.http.get(this.serviceListClass.candidateFilterFolderList+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: postCandidateFoldersDetails
  @Who: Adarsh Singh
  @When: 30-May-2023
  @Why: EWM-12547
  @What: get all folders of candiate
  */
  postCandidateFoldersDetails(formData) {
    return this.http.post(this.serviceListClass.canidateMappedFoldersDetails,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Name: post saveJobActionStatus
  @Who: Adarsh Singh
  @When: 31-May-2023
  @Why: EWM-12547
  @What:save job action status tab data
  */
  saveJobActionStatus(formData) {
    return this.http.post(this.serviceListClass.saveJobActionStatus,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  //client folderlist service 
  createClientFolderList(formData): Observable<any> {
    return this.http.post(this.serviceListClass.clientFolderListCreate,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  // getClientFolderList() {
  //   return this.http.get(this.serviceListClass.clientFolderList).pipe(
  //     retry(1),
  //     catchError(handleError)
  //   );
  // }

  public getClientFolderListAll(state: State,searchValue): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      searchValue=searchValue.replace('?', '');
      queryStr += '&' + searchValue;
    }
    return this.http
      .get(`${this.serviceListClass.clientFolderListAll}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }
  clientlistfolderDelete(formData): Observable<any> {
    return this.http.post(this.serviceListClass.clientFolderDelete, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getClientFolderListByID(formData) {
    return this.http.get(this.serviceListClass.clientFolderListById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  updateClientFolder(formData): Observable<any> {
    return this.http.post(this.serviceListClass.clientFolderListUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getClientFolderDuplicacyCheck(formData): Observable<any> {
    return this.http.post(this.serviceListClass.clientFolderduplicateCheck, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  //END client folderlist service 
}
