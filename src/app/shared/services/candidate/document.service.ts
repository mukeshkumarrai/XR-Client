
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../helper/exception-handler';
import { ServiceListClass } from '../sevicelist';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http:HttpClient,private serviceListClass:ServiceListClass) { }
  getAllDocuemnt(pageNo:number,pageSize:number,orderBy:string,searchValue:string,candidateId:any)
  {
   return this.http.get(this.serviceListClass.getAllDocument+'?UserTypeId='+candidateId+'&PageNumber='+pageNo+'&PageSize='+pageSize+'&OrderBy='+orderBy+'&search='+searchValue)
   .pipe(retry(1),catchError(handleError));
  }
  getDocuemntById(id:any,isExternal:boolean,jobId:string)
  {
    if(!isExternal){
      return this.http.get(this.serviceListClass.getDocumentById+'?id='+id+'&jobId='+jobId)
      .pipe(retry(1),catchError(handleError));
    }
    else{
      const formData={
        id:id,
        ExternalLinkCode:localStorage.getItem('ExternalLinkCode')
      }
      return this.http.post(this.serviceListClass.getDocumentDetailsForExternal,formData)
      .pipe(retry(1),catchError(handleError))
    }
  }
  createFolder(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createFolder, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  createDocument(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createDocument, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getDocumentCategory() {
    return this.http.get(this.serviceListClass.getDocumentcategory ).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getDocumentName(CategoryId) {
    return this.http.get(this.serviceListClass.getDocumentName + '?DocumentCategoryId='+CategoryId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  uploadDocument(candidateId:any,filedata:any):Observable<any>
  {
    return this.http.post(this.serviceListClass.uploadCandidateDocument+'?candidateid='+candidateId+'&resources=document',filedata)
    .pipe(retry(1),catchError(handleError));
  }
  checkduplicity(formdata):Observable<any>
  {
    return this.http.post(this.serviceListClass.checkduplicityCandidateDocument,formdata)
    .pipe(retry(1),catchError(handleError));
  }
  delete(formData): Observable<any> {
    return this.http.request('delete',this.serviceListClass.deletedocumentdata,{body:formData}).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  downloadData(Id,jobId)
  {
    return this.http.get(this.serviceListClass.downloadFolder+'?id='+Id+'&jobId='+jobId,{  reportProgress: true,
      responseType: 'blob',})
    .pipe(retry(0),catchError(handleError));
  }
  renameData(formData):Observable<any>
  {
    return this.http.post(this.serviceListClass.RenameFolder,formData)
    .pipe(retry(1),catchError(handleError));
  }


     /*
  @Type: File, <ts>
  @Name: getAllVersion
  @Who: Anup
  @When: 16-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for get All version list
  */
  getAllVersion(pageNo:number,pageSize:number,orderBy:string,searchValue:string,DocumentId:any){
   return this.http.get(this.serviceListClass.documentVersion+'?DocumentVersionId='+DocumentId+'&PageNumber='+pageNo+'&PageSize='+pageSize+'&OrderBy='+orderBy+'&search='+searchValue)
   .pipe(retry(1),catchError(handleError));
  }

     /*
  @Type: File, <ts>
  @Name: createVersionDocument
  @Who: Anup
  @When: 16-sep-2021
  @Why: EWM-2638 EWM-2853
  @What: for create version document
  */
  createVersionDocument(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createVersionDocument, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  getUserIsEmailConnected(): Observable<any> { 
    // @suika @EWM-13297 @whn 29-07-2023  
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(this.serviceListClass.IsEmailConnected+'?emailId=' + currentUser?.EmailId).pipe( 
      retry(1),
      catchError(handleError)
    );
     
   }
   pushShareableLink(formdata):Observable<any>{
     return this.http.post(this.serviceListClass.createShareableLink,formdata)
     .pipe(retry(1),catchError(handleError)
     );
   }

getDataForRevokeAccess(pageNo:number,pageSize:number,searchValue:string,documentId)
{
  return this.http.get(this.serviceListClass.getshareablesharedLinkList+'?Id='+documentId+'&PageNumber='+pageNo+'&PageSize='+pageSize+'&search='+searchValue).pipe(
    retry(1),
    catchError(handleError)
  );
}
deleteAccesssofshareableLink(formData)
{
  return this.http.request('delete',this.serviceListClass.revokeAccessOfShareablelink,{body:formData}).pipe(
    retry(1),
    catchError(handleError)
  );
}

getAllDocumentExternally(formdata):Observable<any>{
  return this.http.post(this.serviceListClass.getAllDocumentForExternalLink,formdata)
  .pipe(retry(1),catchError(handleError)
  );
}
downloadDataExternally(formdata)
{
  return this.http.post(this.serviceListClass.downloadDocumentForExternalLink,formdata,{  reportProgress: true,
    responseType: 'blob',})
  .pipe(retry(0),catchError(handleError));
}

  /* 
@Type: File, <ts>
@Name: UploadFile Function
@Who:  Renu
@When: 14-Oct-2022
@Why: EWM-8801 EWM-9167
@What: Api call for uploding file for checklist
*/

UploadFile(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.userProfileImageUpload+'?resources=document',formData).pipe( 
     retry(1),
     catchError(handleError)
   );
  }



/* 
@Type: File, <ts>
@Name: getDocumentHierarchy Function
@Who:  Suika
@When: 14-July-2023
@Why: EWM-12625
@What: Api call for uploding file for checklist
*/

  getDocumentHierarchy(pageNo:number,pageSize:number,orderBy:string,searchValue:string,documentId:any)
  {
   return this.http.get(this.serviceListClass.getDocumentByHeierarchy+'?id='+documentId+'&PageNumber='+pageNo+'&PageSize='+pageSize+'&OrderBy='+orderBy+'&search='+searchValue)
   .pipe(retry(1),catchError(handleError));
  }

  getViewDocument(JobId:string,Id:number):Observable<any>{
    return this.http.get(this.serviceListClass.getViewDocument+'?jobId='+JobId+'&id='+Id)
    .pipe(retry(1),catchError(handleError)
    );
  }

  getJobActionDocuemnt(orderBy:string,Id:string)
  {
   return this.http.get(this.serviceListClass.getAllDocument+'?UserTypeId='+Id+'&OrderBy='+orderBy+'&ByPassPaging='+true)
   .pipe(retry(1),catchError(handleError));
  }
  //by maneesh,when:08/05/2024,what:ewm-16992
  downloadResumeFolder(name){   
    return this.http.get(this.serviceListClass.resumeFolder+'?filename='+name,{responseType: 'blob' as 'json'})
    .pipe(retry(0),catchError(handleError));
  }
}
