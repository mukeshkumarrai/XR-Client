/**
   @(C): Entire Software
   @Type: ts
   @Name: xeople-search.service.ts
   @Who: Renu
   @When: 07-Feb-2023
   @Why: EWM-9370 EWM-10115
   @What: service file for x-factor search
**/
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { GridDataResult } from '@progress/kendo-angular-grid';


@Injectable({
  providedIn: 'root'
})
export class XeopleSearchService {

  
  constructor(private http:HttpClient,private serviceListClass:ServiceListClass) { }

  /*
   @Type: File, <ts>
   @Name: getXfactorpList
   @Who: renu
   @When: 30-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: get x-factor list info
   */
   getXfactorList(pagesize: number, pagneNo: number, orderBy: string, searchVal: string) {
    return this.http.get(this.serviceListClass.getXfactorFilterList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getXfactorpList
   @Who: renu
   @When: 30-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: get x-factor list info by id
   */
   getXfactorFilterById(filterId: Number){
    return this.http.get(this.serviceListClass.getXfactorFilterById+'?filterId='+filterId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getXfactorpList
   @Who: renu
   @When: 30-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: get search pool list
   */
   getsearchPoolList() {
    return this.http.get(this.serviceListClass.getXfactorPoolList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  
   /*
   @Type: File, <ts>
   @Name: getXfactorIOList
   @Who: renu
   @When: 31-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: get x-factor input/output list data
   */
   getXfactorIOList(userType : String){
    return this.http.get(this.serviceListClass.getXfactorIOList+'?userType='+userType ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getXfactorIOList
   @Who: renu
   @When: 31-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: get x-factor input/output list data
   */
   xeopleSearchJobList(userType : String,JobId:any){
    return this.http.get(this.serviceListClass.xeopleSearchJob+'?userType='+userType+'&jobId='+JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Name: getGenericDropdownList()
    @Who: renu
    @When: 31-jan-2023
    @Why:EWM-9625 EWM-10071
    @What: get data for dropdown based on endpoint passed
  */
  getGenericDropdownList(apiEndPoint: any): Observable<any> {
    return this.http.get(apiEndPoint).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
 /*
    @Name: saveXfilter()
    @Who: renu
    @When: 05-Feb-2023
    @Why:EWM-9625 EWM-10071
    @What: save xeople filter
  */
  saveXfilter(formData:any): Observable<any> {
    return this.http.post(this.serviceListClass.saveFilterConfig, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getFilterSearchAll
   @Who: renu
   @When: 14-Feb-2023
   @Why:EWM-9370 EWM-10115
   @What: get searchList in X-Factor if exisits
   */
   getFilterSearchAll(pagesize: number, pagneNo: number, orderBy: string, searchVal: string) {
    return this.http.get(this.serviceListClass.getFilterSearchAll + '?PageNumber=' + pagneNo + '&PageSize=' + 
    pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Name: checkFilterUnique()
    @Who: renu
    @When: 14-Feb-2023
    @Why:EWM-9370 EWM-10115
    @What: check unique save xeople filter
  */
    checkFilterUnique(formData:any): Observable<any> {
      return this.http.post(this.serviceListClass.checkFilterUnique, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }
    
  /*
    @Name: deleteFilterSearch()
    @Who: renu
    @When: 14-Feb-2023
    @Why: EWM-9370 EWM-10115
    @What: delete filter search in XFACTOR
  */
    
    deleteFilterSearch(formData): Observable<any> {
      return this.http.request('delete',this.serviceListClass.deleteFilterSearch,{body:formData}).pipe(
          retry(1),
          catchError(handleError)
        );
      }
      
  /*
   @Type: File, <ts>
   @Name: getXfactorIOList
   @Who: renu
   @When: 31-jan-2023
   @Why:EWM-9625 EWM-10071
   @What: get x-factor input/output list data
   */
   outputFilterGridList(filterId : number){
    return this.http.get(this.serviceListClass.outputFilterGrid+'?filterId ='+filterId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getcvParsedCountAll
   @Who: renu
   @When: 22-June-2023
   @Why:EWM-10610 EWM-12677
   @What: get cv parsed count info
   */
   getcvParsedCountAll() {
    return this.http.get(this.serviceListClass.cvParsedCount).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getAllJobsWithoutWorkflow
   @Who: renu
   @When: 24-July-2023
   @Why:EWM-13284 EWM-13357
   @What: get all Jobs without Workflow
   */
  getAllJobsWithoutWorkflow(searchVal:string,byPassPaging:boolean) {
    return this.http.get(this.serviceListClass.jobWithoutWorkflowV3+'?ByPassPaging='+byPassPaging+'&search='+searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   /*
   @Type: File, <ts>
   @Name: onValidateEohClientById
   @Who: renu
   @When: 05-Sept-2023
   @Why:EWM-13753 EWM-14130
   @What: EOH TOKEN API
   */
   getEOHTokenAuthentication(): Observable<any> {
    return this.http.get(this.serviceListClass.getValidateEohClientById + '?IsXeopleSearchTokenRequest=true').pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /* @Name: getTagList @Who: renu @When: 05-Sept-2023 @Why:EWM-13708 EWM-13925 @What: EOH TOKEN API */
  getTagInputList(formdata: {}): Observable<any> {
    return this.http.post(this.serviceListClass.getXSearchTagData,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
   /* @Name: getXfactorCardList @Who: renu @When: 11-Sept-2023 @Why:EWM-13708 EWM-13925 @What:card view */
  public getXfactorCardList(formdata: {},top:number): Observable<any> {

    return this.http
          .post(this.serviceListClass.getXSearchCardList,formdata)
          .pipe(
              map(response => (<GridDataResult>{
                  data: response['Data']?response['Data']:[], 
                  total: parseInt(response['TotalRecord']),
                  HttpStatusCode:response['HttpStatusCode']
              }))
          );
}

 /* @Name: getTagList @Who: renu @When: 05-Sept-2023 @Why:EWM-13708 EWM-13925 @What: EOH TOKEN API */
 getProfilePicMembersList(formdata: {}): Observable<any> {
    return this.http
    .post(this.serviceListClass.getXSearchCardProfilePic,formdata)
    .pipe(
        map(response => (<GridDataResult>{
            data: response['Data']?response['Data']:[], 
            total: parseInt(response['TotalRecords']),
            HttpStatusCode:response['HttpStatusCode']
        }))
    );
}


  /* @Name: getListMapToFolder @Who: renu @When: 05-Sept-2023 @Why:EWM-13708 EWM-13925 @What:get map candidate folder list data */
  getListMapToFolder(formData) {
    return this.http.get(this.serviceListClass.XeopleMapToFolder+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

     /* @Name: XeopleExtractMembers @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: extract EOH members*/
     XeopleExtractMembers(formdata: {}): Observable<any> {
      return this.http.post(this.serviceListClass.getXSearchCardSelected,formdata).pipe(
        retry(1),
        catchError(handleError)
      );
    }
   
/* @Name: SaveXeopleExtractMembers @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: extract EOH members save into xeople*/

   SaveXeopleExtractMembers(formData:any): Observable<any> {
      return this.http.post(this.serviceListClass.xeopleExtractMembers, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /* @Name: eohSendpushNotification @Who: renu @When: 19-Sept-2023 @Why:EWM-13752 EWM-14378 @What: push notification*/
  eohSendpushNotification(formdata: {}): Observable<any> {
    return this.http.post(this.serviceListClass.eohSendpushNotification,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
   
  }
 
 /* @Name: fetchCandidateEOHResume @Who: renu @When: 19-Sept-2023 @Why:EWM-13752 EWM-14378 @What:get Resume URL*/

  fetchCandidateEOHResume(formData) {
    return this.http.get(this.serviceListClass.getXSearchCardResumeUrl+formData).pipe(
      retry(1),
      catchError(handleError)
    );
    }

     /* @Name: xeoplePushMembers @Who: renu @When: 19-Sept-2023 @Why:EWM-13752 EWM-14378 @What: push memebers notification mail*/
  xeoplePushMembers(formdata: {}): Observable<any> {
    return this.http.post(this.serviceListClass.xeoplePushMembers,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
   
  }

  /* @Name: getEOHFilterAll @Who: renu @When: 20-Sept-2023 @Why:EWM-13706 EWM-14092 @What: getEOHFilter all*/
  getEOHFilterAll(pagesize: number, pagneNo: number, orderBy: string, searchVal: string) {
    return this.http.get(this.serviceListClass.getEOHFilterAll + '?PageNumber=' + pagneNo + '&PageSize=' + 
    pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

 /* @Name: deleteEOHFilterSearch @Who: renu @When: 20-Sept-2023 @Why:EWM-13706 EWM-14092 @What: delete filter for EOH all*/
    
    deleteEOHFilterSearch(formData): Observable<any> {
      return this.http.request('delete',this.serviceListClass.deleteEOHFilter,{body:formData}).pipe(
          retry(1),
          catchError(handleError)
        );
      }
 /* @Name: deleteEOHFilterSearch @Who: renu @When: 2-Sept-2023 @Why:EWM-13706 EWM-14092 @What: filter EOH uinque check*/
      uniqueCheckEOHFilter(formData:any): Observable<any> {
        return this.http.post(this.serviceListClass.uniqueCheckEOHFilter, formData).pipe(
          retry(1),
          catchError(handleError)
        );
      }
/* @Name: configureEOHFilter @Who: renu @When: 2-Sept-2023 @Why:EWM-13706 EWM-14092 @What: save filter EOH*/
configureEOHFilter(formData:any): Observable<any> {
        return this.http.post(this.serviceListClass.configureEOHFilter, formData).pipe(
          retry(1),
          catchError(handleError)
        );
      }
/* @Name: getEOHFilterById @Who: renu @When: 2-Sept-2023 @Why:EWM-13706 EWM-14092 @What: get filter by id*/
      getEOHFilterById(filterId: Number){
        return this.http.get(this.serviceListClass.getEOHFilterById+'?filterId='+filterId).pipe(
          retry(1),
          catchError(handleError)
        );
      }

/*
  @Type: File, <ts>
  @Name: getAllJobsWithoutWorkflow
  @Who: Adarsh singh
  @When: 04 March 2024
  @Why: EWM-16083
  @What: get all Jobs without Workflow
*/
  getAllJobsWithoutWorkflowWithoutParsing(params:string) {
  return this.http.get(this.serviceListClass.jobWithoutWorkflowV3+params).pipe(
    retry(1),
    catchError(handleError)
  );
}
}


