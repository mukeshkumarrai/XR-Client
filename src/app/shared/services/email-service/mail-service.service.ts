/*
@(C): Entire Software
@Type: File, <ts>
@Name: mail-service.service.ts
@Who: Renu
@When: 21-Sept-2021
@Why: EWM-2511 EWM-2704
@What: Service Api's for Job
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { ServiceListClass } from '../sevicelist';
import { handleError } from '../../helper/exception-handler';


@Injectable({
  providedIn: 'root'
})
export class MailServiceService {

  /*
  @Type: File, <ts>
  @Name: constructor
  @Who: Renu
  @When: 21-Sept-2021
  @Why: EWM-2511 EWM-2704
  @What: constructor function
  */
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }

   /*
   @Type: File, <ts>
   @Name: fetchMailList function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What:  fetch record mail data list 
   */

   fetchMailList(pagesize, pagneNo, orderBy, searchVal,candidateEmail) {
    return this.http.get(this.serviceListClass.emailInbox + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&search='+searchVal+'&CandidateEmail='+candidateEmail).pipe(
      retry(1),
      catchError(handleError)
    );
  }

/*
   @Type: File, <ts>
   @Name: emailDisconnection function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What: to disconnect email
   */

  emailDisconnection() {  
    // @suika @EWM-13297 @whn 29-07-2023  
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(this.serviceListClass.IsEmailDisConnected+ '?emailId=' + currentUser?.EmailId).pipe(
      shareReplay(),
      retry(1),
      catchError(handleError)
    );
  }
  
/*
   @Type: File, <ts>
   @Name: getUserIsEmailConnected function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What: to check  email connection
   */
  getUserIsEmailConnected(): Observable<any> {
    // @suika @EWM-13297 @whn 29-07-2023  
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(this.serviceListClass.IsEmailConnected+'?emailId=' + currentUser?.EmailId).pipe(
      retry(1),
      catchError(handleError)
    );
     
   }

   /*
   @Type: File, <ts>
   @Name: fetchMailDetails function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What:  fetch record mail detail based on UniqueId
   */

   fetchMailDetails(uniqueId,activeTab?:string) {
    let url = `${this.serviceListClass.emailInboxDetails}?uniqueId=${uniqueId}`;

    if (activeTab?.toLowerCase() === 'sent') {
        url += `&sent=1`;
    }
    return this.http.get(url).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getDraftMail function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What:  fetch record DRAFT mail 
   */

   getDraftMail(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getDraftMail + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&search='+searchVal ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: createDraftMail function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What: create DRAFT mail 
   */
   createDraftMail(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createDraftMail, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: updateDraftMailById function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What: update DRAFT mail based on Unique Id
   */
   updateDraftMailById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateDraftMailById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: deleteDraftMailById function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What: update DRAFT mail based on Unique Id
   */
   deleteDraftMailById(formData) : Observable<any>{
    return this.http.request('delete',this.serviceListClass.deleteDraftMailById+'?draftId='+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

    /*
   @Type: File, <ts>
   @Name: fetchMailCount function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What:  fetch record mail data list count info 
   */

   fetchMailCount() {
    return this.http.get(this.serviceListClass.getMailCount).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: emailDownloadAttachement function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What: create DRAFT mail 
   */
   emailDownloadAttachement(formData): Observable<any> {
    return this.http.post(this.serviceListClass.emailDownloadAttachement, formData,{reportProgress: true,responseType: 'blob'}).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  
  /*
   @Type: File, <ts>
   @Name: markAsImportant function
   @Who: Renu
   @When: 24st-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: mark as imp
   */
  markAsImportant(formData): Observable<any> {
    return this.http.post(this.serviceListClass.markAsImportant, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: markAsRead function
   @Who: Renu
   @When: 24st-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: mark as Read
   */
   markAsRead(formData): Observable<any> {
    return this.http.post(this.serviceListClass.markAsisread, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: markAsUnRead function
   @Who: Renu
   @When: 24st-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: mark as UnRead
   */
   markAsUnRead(formData): Observable<any> {
    return this.http.post(this.serviceListClass.markAsunread, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: mailSend function
   @Who: Renu
   @When: 28-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: mail send
   */
   mailSend(formData): Observable<any> {
    return this.http.post(this.serviceListClass.mailSend, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  
   /*
   @Type: File, <ts>
   @Name: jobWithoutWorkFlow function
   @Who: Renu
   @When: 29-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What: job listing api
   */
   jobWithoutWorkFlow(formData): Observable<any> {
    return this.http.post(this.serviceListClass.jobWithoutWorkflow, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

     /*
   @Type: File, <ts>
   @Name: fetchSendMailList function
   @Who: Renu
   @When: 29th-Sept-2021
   @Why: EWM-2641 EWM-2996
   @What:  fetch record send mail data list 
   */

   fetchSendMailList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.emailSent + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&search='+searchVal ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

     /*
   @Type: File, <ts>
   @Name: emailDraftDetail function
   @Who: Renu
   @When: 29th-Sept-2021
   @Why: EWM-2641 EWM-3073
   @What:  email draft mail deatil info
   */

  emailDraftDetail(formData){
    return this.http.get(this.serviceListClass.emailDraftDetail + '?uniqueId='+formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: uploadDocument function
   @Who: Renu
   @When: 29th-Sept-2021
   @Why: EWM-2641 EWM-3073
   @What: attachement upload
   */
  uploadDocument(filedata:any):Observable<any>
  {
    return this.http.post(this.serviceListClass.siteLogoupload+'?resources=document',filedata)
    .pipe(retry(1),catchError(handleError));
  }

   /*
   @Type: File, <ts>
   @Name: fetchFavoriteMailList function
   @Who: Renu
   @When: 21st-Sept-2021
   @Why: EWM-2511 EWM-2704
   @What:  fetch record mail data list for fav only
   */

   fetchFavoriteMailList(pagesize, pagneNo, orderBy, searchVal,candidateEmail) {
    return this.http.get(this.serviceListClass.emailfavouriteList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&search='+searchVal+'&emailId=' +candidateEmail ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: fetchCandidateMailList function
   @Who: Renu
   @When: 19th-Oct-2021
   @Why: EWM-1733 EWM-3126
   @What:  fetch record mail data list for candidate
   */
   fetchCandidateMailList(pagesize, pagneNo, orderBy, searchVal,CandidateEmail ) {
    return this.http.get(this.serviceListClass.generalInbox + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&search='+searchVal+'&RecepientEmail='+CandidateEmail).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
   @Name: fetchMailCandidateCount function
   @Who: Renu
   @When: 20th-Oct-2021
   @Why: EWM-1733 EWM-3126
   @What:  fetch record mail data list count info for particular candidate
   */
   fetchMailCandidateCount(candidateEmail) {
    return this.http.get(this.serviceListClass.recipientMailCount+'?RecipientEmail='+candidateEmail).pipe(
      retry(1),
      catchError(handleError)
    );
  }

/*
   @Type: File, <ts>
   @Name: bulkMailSend function
   @Who: Adarsh singh
   @When: 28-Sept-2021
   @Why: EWM-7481
   @What: send bulk email
*/
  bulkMailSend(formData): Observable<any> {
    return this.http.post(this.serviceListClass.bulkEmail, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  fetchCandidateMailListV2(pagesize, pagneNo, orderBy, searchVal,CandidateEmail,ClientId ) {
    return this.http.get(this.serviceListClass.candidateInboxV2 + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&search='+searchVal+'&CandidateEmail='+CandidateEmail+'&ClientId='+ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  fetchMailCandidateCountV2(ClientId) {
    return this.http.get(this.serviceListClass.candidateMailCountV2+'?ClientId='+ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  

  /*
   @Type: File, <ts>
   @Name: fetchMailClientCount function
   @Who: Nitin Bhati
   @When: 04-01-2024
   @Why: EWM-15475 EWM-15612
   @What:  fetch record mail data list count info for particular client
   */
  fetchMailClientCount(ClientId) {
    return this.http.get(this.serviceListClass.clientMailCount+'?ClientId='+ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: fetchClientMailList function
   @Who: Nitin Bhati
   @When: 04-01-2024
   @Why: EWM-15475 EWM-15612
   @What: fetch record mail data list for client
   */
  fetchClientMailList(pagesize, pagneNo, orderBy, searchVal,ClientEmail,ClientId ) {
    return this.http.get(this.serviceListClass.clientInbox + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize+'&search='+searchVal+'&RecepientEmail='+ClientEmail+'&ClientId='+ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getClientandContactEmails(ClientId) {
    return this.http.get(this.serviceListClass.getClientandContactEmails+'?ClientId='+ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  //by maneesh,when:22/04/2024 for ewm-16029
  xeoplesearchEmail(formData): Observable<any> {
    return this.http.post(this.serviceListClass.xeoplesearchEmail, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
}
