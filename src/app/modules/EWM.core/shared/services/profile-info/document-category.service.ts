/*
@(C): Xeople Software
@Type: File, <ts>
@Who: priti srivastava
@When:24-Aug-2021
@Why: EWM-2591
@What: Service Api's
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from './../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
@Injectable({
  providedIn: 'root'
})
export class DocumentCategoryService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }
  
  getDocumentCategory(pagneNo, pagesize,orderby,SearchVal) {
    return this.http.get(this.serviceListClass.getDocumentcategory + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&OrderBy='+orderby+'&search='+SearchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getDocumentCategoryById(ID:any) {
    return this.http.get(this.serviceListClass.getDocumentcategorybyId + '?id='+ID).pipe(
      retry(1),
      catchError(handleError)
    );
  }
 checkduplicityofDocumentCategory(ID:any,category:string,userTypeId:number) {
    return this.http.get(this.serviceListClass.checkduplicityDocumentcategory + '?id='+ID+'&documentCategoryName='+category+'&userTypeId='+userTypeId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  update(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateDocumentcategory, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  Create(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createDocumentcategory, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  delete(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deleteDocumentcategory, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getUserTypeList()
  {
    return this.http.get(this.serviceListClass.getAllUsertYpe ).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
  getDocumentName(CategoryId,pagneNo, pagesize,orderby,SearchVal) {
    return this.http.get(this.serviceListClass.getDocumentName + '?DocumentCategoryId='+CategoryId+'&PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&OrderBy='+orderby+'&search='+SearchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getDocumentNameById(ID:any) {
    return this.http.get(this.serviceListClass.getDocumentNamebyId + '?id='+ID).pipe(
      retry(1),
      catchError(handleError)
    );
  }
 checkduplicityofDocumentName(ID:any,documentCategoryId:any,name:string) {
    return this.http.get(this.serviceListClass.checkduplicityDocumentName + '?id='+ID+'&documentCategoryId='+documentCategoryId+'&documentName='+name).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  updateDocumentName(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateDocumentName, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  CreateDocumentName(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createDocumentName, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  deleteDocumentName(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deleteDocumentName, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
  /*
@(C): Xeople Software
@Type: File, <ts>
@Who: suika 
@When:17-Sept-2021
@Why: EWM-2833
@What: Api for document sharing
 */
  shareDocument(formData): Observable<any> {
    return this.http.post(this.serviceListClass.documentShare, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
/*
@(C): Xeople Software
@Type: File, <ts>
@Who: suika 
@When:11-March-2022
@Why: EWM-5336
@What: Api for resume sharing
 */
shareResume(formData): Observable<any> {
  return this.http.post(this.serviceListClass.createShareableLink, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

  getSearchUserWithGroup(formData): Observable<any> {
    return this.http.get(this.serviceListClass.searchUserWithGroup+ formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getshareDocumentById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getdocumentShareById+ formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  genrateOtp(formData): Observable<any> {
    return this.http.post(this.serviceListClass.sendDocumentOtp , formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  validateOtp(formData): Observable<any> {
    return this.http.post(this.serviceListClass.validateDocumentOtp , formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  getCategoryListByType(type) {
    return this.http.get(this.serviceListClass.getCategoryListByType + type).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
@(C): Xeople Software
@Type: File, <ts>
@Who: maneesh 
@When:02-08-2022
@Why: EWM-8117
@What: Api for document categry 
 */
  getTenantUserType()
  {
    return this.http.get(this.serviceListClass.TenantUserType ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

}
