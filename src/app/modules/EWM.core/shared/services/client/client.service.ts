/*
@(C): Entire Software
@Type: File, <ts>
@Name: client.service.ts
@Who: Nitin Bhati
@When: 25-o t-2021
@Why: EWM-3272 EWM-2483
@What: Service Api's for Client
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, ReplaySubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  /*
  @Type: File, <ts>
  @Name: client.service.ts
  @Who: Nitin Bhati
  @When: 25-o t-2021
  @Why: EWM-3272 EWM-2483 
  @What: constructor function
  */
  
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }


  /* 
   @Type: File, <ts>
   @Name: fetchClientlist function
   @Who: Nitin Bhati
   @When: 25-o t-2021
   @Why: EWM-3272 EWM-2483
   @What: Api call for gettig listing data in grid
 */

  fetchClientlist(formData): Observable<any> {
    return this.http.post(this.serviceListClass.clientLandingList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
      @Type: File, <ts>
      @Name: dashboardStateClientDetails
      @Who:  Suika
      @When:27-Oct-2021
      @Why: EWM-3279.EWM-33516
      @What: get  Reason workflow pipline data  from APi
      */
  dashboardStateClientDetails(jsonObj): Observable<any> {
    return this.http.post(this.serviceListClass.dashboardStateClientDetails, jsonObj).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: dashboardParentClientDetails
    @Who:  Suika
    @When:27-Oct-2021
    @Why: EWM-3279.EWM-33516
    @What: get  Reason workflow pipline data  from APi
    */
  dashboardParentClientDetails(jsonObj): Observable<any> {
    return this.http.post(this.serviceListClass.dashboardParentClientDetails, jsonObj).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: dashboardStatusClientDetails
   @Who:  Suika
   @When:27-Oct-2021
   @Why: EWM-3279.EWM-33516
   @What: get  Reason workflow pipline data  from APi
   */
  dashboardStatusClientDetails(jsonObj): Observable<any> {
    return this.http.post(this.serviceListClass.dashboardStatusClientDetails, jsonObj).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: dashboardClientDetails
 @Who:  Suika
 @When:27-Oct-2021
 @Why: EWM-3279.EWM-33516
 @What: get  Reason workflow pipline data  from APi
 */
  dashboardClientDetails(jsonObj): Observable<any> {
    return this.http.post(this.serviceListClass.dashboardClientDetails, jsonObj).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
 @Type: File, <ts>
 @Name: dashboardClientDetails
 @Who:  Suika
 @When:27-Oct-2021
 @Why: EWM-3279.EWM-33516
 @What: get  Reason workflow pipline data  from APi
 */
  dashboardClientCount(jsonObj): Observable<any> {
    return this.http.post(this.serviceListClass.dashboardClientCount, jsonObj).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getClientSummaryHeaderList
  @Who: Nitin Bhati
  @When: 22-Nov-2021
  @Why: EWM-3834
  @What: get client mapped Job Header data By Id  
  */
  getClientSummaryHeaderList(ClientId,clientType) {
    return this.http.get(this.serviceListClass.clientSummaryHeader + '?clientId=' + ClientId + '&Type=' + clientType).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
   @Type: File, <ts>
   @Name: fetchLocationMappedToClientAll function
   @Who: Suika
   @When: 18-nov-2021
   @Why: EWM-3641 EWM-3840
   @What: Api call for get
 */
  fetchLocationMappedToClientAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.getLocationMappedToClientAll, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
   
    @Who: priti
    @When: 23-nov-2021
    @Why: EWM-3853
    @What: Api call for get all description of client 
  */
  getAlldescription(formquery): Observable<any> {
    return this.http.get(this.serviceListClass.getAllDescriptionOfClient + formquery).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
   @Who: priti
    @When: 23-nov-2021
    @Why: EWM-3853
    @What: Api call for get description of client 
  */
  getdescriptionById(formquery): Observable<any> {
    return this.http.get(this.serviceListClass.getbyIdDescriptionOfClient + formquery).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
  @Who: priti
   @When: 23-nov-2021
   @Why: EWM-3853
   @What: Api call to create description of client 
 */
  createdescription(formdata): Observable<any> {
    return this.http.post(this.serviceListClass.createDescriptionOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
  @Who: priti
   @When: 23-nov-2021
   @Why: EWM-3853
   @What: Api call to update description of client 
 */
  updatedescription(formdata): Observable<any> {
    return this.http.post(this.serviceListClass.updateDescriptionOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
  @Who: priti
   @When: 23-nov-2021
   @Why: EWM-3853
   @What: Api call to create description of client 
 */
  deletedescription(formdata) {
    return this.http.post(this.serviceListClass.deleteDescriptionOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getclientDetailsByIdList
     @Who: Nitin Bhati
     @When: 22-Nov-2021
     @Why: EWM-3856
     @What: get client Details data By Id  
     */
  getclientDetailsByIdList(ClientId) {
    return this.http.get(this.serviceListClass.clientDetailsById + '?ClientId=' + ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getClientMappingTagList function
    @Who: Nitin Bhati
    @When: 22-Nov-2021
    @Why: EWM-3856
    @What: get Client MappingTagList
    */
  getClientMappingTagList(formData) {
    return this.http.get(this.serviceListClass.clientMappingTagList + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: updateClientMappingTagList function
     @Who: Nitin Bhati
     @When: 22-Nov-2021
     @Why: EWM-3856
     @What: Update Client Mapping Tag List
     */
  updateClientMappingTagList(formData): Observable<any> {
    return this.http.post<any>(this.serviceListClass.updateClientMappingTagList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateClientStatusList function
  @Who: Nitin Bhati
  @When: 22-Nov-2021
  @Why: EWM-3856
  @What: Update Client Mapping Status List
  */
  updateClientStatusList(formData): Observable<any> {
    return this.http.post<any>(this.serviceListClass.updateClientStatusList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
    @Type: File, <ts>
    @Name: fetchLocationMappedToClientById function
    @Who: Suika
    @When: 18-nov-2021
    @Why: EWM-3641 EWM-3840
    @What: Api call for get
  */
  fetchLocationMappedToClientById(FormData): Observable<any> {
    return this.http.get(this.serviceListClass.getLocationMappedToClientById + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  deleteClientLocation(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteClientLocation, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
    @Type: File, <ts>
    @Name: createClientLocation function
    @Who: Suika
    @When: 18-nov-2021
    @Why: EWM-3641 EWM-3840
    @What: Api call for get
  */
  createClientLocation(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.createClientLocation, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
     @Type: File, <ts>
     @Name: updateClientLocation function
     @Who: Suika
     @When: 18-nov-2021
     @Why: EWM-3641 EWM-3840
     @What: Api call for get
   */
  updateClientLocation(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.updateClientLocation, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Name: updateQuickClientDetails
    @Who: Nitin Bhati
    @When: 22-Nov-2021
    @Why: EWM-3856
    @params : Client Details
    */

  updateQuickClientDetails(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateClientDetailsById, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
     @Type: File, <ts>
     @Name: getBusinessRegistrationByIdList
     @Who: Nitin Bhati
     @When: 24-Nov-2021
     @Why: EWM-3913
     @What: get client Business Registration Details data By Id  
     */
  getBusinessRegistrationByIdList(ClientId): Observable<any> {
    return this.http.get(this.serviceListClass.businessRegistrationById + '?ClientId=' + ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: updateBusinessRegistration
  @Who: Nitin Bhati
  @When: 24-Nov-2021
  @Why: EWM-3913
  @params : Update Business Registration Details
  */
  updateBusinessRegistration(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateBusinessRegistration, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }
  /* 
    
     @Who: priti
     @When: 24-nov-2021
     @Why: EWM-3909
     @What: Api call for get all Eamil of client 
   */
  getAllEmail(formquery) {
    return this.http.get(this.serviceListClass.getAllEmailOfClient + formquery).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
    @Who: priti
     @When: 23-nov-2021
     @Why: EWM-3853
     @What: Api call to create description of client 
   */
  createEmail(formdata) {
    return this.http.post(this.serviceListClass.createEmailOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
  @Who: priti
   @When: 23-nov-2021
   @Why: EWM-3853
   @What: Api call to update description of client 
 */
  updateEmail(formdata) {
    return this.http.post(this.serviceListClass.updateEmailOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
  @Who: priti
   @When: 25-nov-2021
   @Why: EWM-3909
   @What: Api call to create description of client 
 */
  deleteEmail(formdata) {
    return this.http.post(this.serviceListClass.deleteEmailOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Name: getClientAdressAll
   @Who: Nitin Bhati
   @When: 24-Nov-2021
   @Why: EWM-3929
   @What: get candidate address Information list data
   */
  getClientAdressAll(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getClientLocationMain + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Name: getClientAdressById
@Who: Nitin Bhati
@When: 24-Nov-2021
@Why: EWM-3929
@What: get candidate address Information list data
*/
  getClientAdressById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getClientLocationById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Name: updateClientAddress
@Who: Nitin Bhati
@When: 24-Nov-2021
@Why: EWM-3929
@What: uddate candidate address Information list data
*/
  updateClientAddress(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateClientLocation, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: deleteClientAddress
  @Who: Nitin Bhati
  @When: 24-Nov-2021
  @Why: EWM-3929
  @What: delete client address Information list data
  */

  deleteClientAddress(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteClientLocation, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getClientNameList
     @Who: Nitin Bhati
     @When: 26-Nov-2021
     @Why: EWM-3834
     @What: get client name list  
     */
  getClientNameList(FormData) {
    return this.http.get(this.serviceListClass.getClientAllList + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
   @Name: getAllPhone
   @Who: Nitin Bhati
   @When: 26-Nov-2021
   @Why: EWM-3911
   @What: get Phone list  
   */
  getAllPhone(formquery) {
    return this.http.get(this.serviceListClass.getAllPhoneOfClient + formquery).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /* 
     @Who: Nitin Bhati
     @When: 26-Nov-2021
     @Why: EWM-3911
     @What: Api call to update of client 
   */
  updatePhone(formdata) {
    return this.http.post(this.serviceListClass.updatePhoneOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
   @Who: Nitin Bhati
   @When: 26-Nov-2021
   @Why: EWM-3911
   @What: Api call to update of client 
 */
  deletePhone(formdata) {
    return this.http.post(this.serviceListClass.deletePhoneOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
  @Name: createPhone
  @Who: Nitin Bhati
  @When: 26-Nov-2021
  @Why: EWM-3911
   @What: Api call to create phone of client 
 */
  createPhone(formdata) {
    return this.http.post(this.serviceListClass.createPhoneOfClient, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Type: File, <ts>
   @Name: fetchLocationCount function
   @Who: Anup
   @When: 22-oct-2021
   @Why: EWM-3039 EWM-3405
   @What:  get All assign job Data count
   */

  fetchLocationCount(FormData) {
    return this.http.get(this.serviceListClass.getLocationCount + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  downloadData(formData: any) {
    return this.http.post(this.serviceListClass.downloadClientData, formData, {
      reportProgress: true,
      responseType: 'blob'
    }).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /* 
 @Type: File, <ts>
 @Name: fetchLocationMappedToClientAll function
 @Who: Anup
 @When: 01-Dec-2021
 @Why: EWM-3696 EWM-3970
 @What: Api call for get
*/
  fetchContactListById(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.getContactListById, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
 @Type: File, <ts>
 @Name: deLinkClientContact function
 @Who: Anup
 @When: 01-Dec-2021
 @Why: EWM-3696 EWM-3970
 @What: delink Contact list 
*/
  deLinkClientContact(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deLinkClientContact, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
 @Type: File, <ts>
 @Name: fetchContactCount function
 @Who: Anup
 @When: 01-Dec-2021
 @Why: EWM-3696 EWM-3970
 @What: for contact count 
*/

  fetchContactCount(FormData) {
    return this.http.get(this.serviceListClass.getContactCount + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
@Type: File, <ts>
@Name: fetchLocationMappedToClientAll function
@Who: Anup
@When: 01-Dec-2021
@Why: EWM-3696 EWM-3970
@What: Api call for get
*/
  fetchJobListByClientId(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobListByClientId, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
 @Type: File, <ts>
 @Name: fetchJobCount function
 @Who: Anup
 @When: 03-Dec-2021
 @Why: EWM-3696 EWM-3968
 @What: for job count 
*/
  fetchJobCount(FormData) {
    return this.http.get(this.serviceListClass.getJobCount + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
 @Name: getClientAccessModeList
 @Who: Suika
 @When: 03-Dec-2021
 @Why: EWM-3867
 @What: get Client Access Mode
 */
  getClientAccessModeList() {
    return this.http.get(this.serviceListClass.getClientAccessMode).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Name: getClientAccessModeList
 @Who: Suika
 @When: 03-Dec-2021
 @Why: EWM-3867
 @What: get Client Access Mode
 */
  getClientAccessModeListById(formData) {
    return this.http.get(this.serviceListClass.getClientAccessModeById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createGrantClientAccess
  @Who: Suika
  @When: 03-Dec-2021
  @Why: EWM-3867
  @What: creating manage access Data by inserting in database
  */

  createGrantClientAccess(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createGrantClientAccess, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
   @Type: File, <ts>
   @Name: fetchClientNotesAll function
   @Who: Renu
   @When: 14-Dec-2021
   @Why: EWM-3751 EWM-4175
   @What: Api call for get list for all notes
 */
  fetchClientNotesAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.clientNoteList, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
   @Type: File, <ts>
   @Name: fetchNotesMonthYearCountAll function
   @Who: Renu
   @When: 14-Dec-2021
   @Why: EWM-3751 EWM-4175
   @What: Api call for get list for all notes mponth year count
 */
  fetchNotesMonthYearCountAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.clientNoteCount, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
  @Type: File, <ts>
  @Name: fetchClientNoteTotal function
  @Who: Renu
  @When: 14-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: Api call for Client Note
*/
  fetchClientNoteTotal(FormData): Observable<any> {
    return this.http.get(this.serviceListClass.clientNoteTotal + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
  @Type: File, <ts>
  @Name: clientUserAccess function
  @Who: Renu
  @When: 14-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: Api call for Client Note get User acess list
*/
  clientUserAccess(FormData): Observable<any> {
    return this.http.get(this.serviceListClass.clientUserAccess + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
   @Type: File, <ts>
   @Name: AddClientNotesAll function
   @Who: Renu
   @When: 14-Dec-2021
   @Why: EWM-3751 EWM-4175
   @What: Api call for get list for all notes
 */
  AddClientNotesAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.clientNoteCreate, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
 @Type: File, <ts>
 @Name: EditClientNotesAll function
 @Who: Renu
 @When: 14-Dec-2021
 @Why: EWM-3751 EWM-4175
 @What: Api call for get list for all notes
*/
  EditClientNotesAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.clientNoteUpdate, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getClientNotesById
  @Who: Renu
  @When: 14-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: get Client Note based on Id
  */
  getClientNotesById(formData) {
    return this.http.get(this.serviceListClass.clientNoteById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Name: getNotesCategoryList
    @Who: Renu
    @When: 20-Dec-2021
    @Why: EWM-3751 EWM-4175
    @What: delete Client Note based on Id
    */
  getNotesCategoryList(category: any) {
    return this.http.get(this.serviceListClass.notesCategoryList + '?UserType=' + category).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: deleteClientLocation
  @Who: Renu
  @When: 20-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: delete Client Note based on Id
  */

  deleteClientNotes(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.clientNoteDelete, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
   @Type: File, <ts>
   @Name: getOrganisationStructure function
   @Who: Suika
   @When: 21-dec-2021
   @Why: EWM-4070 EWM-4229
   @What: Api call for get
 */
  getOrganisationStructure(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.organisationStructure, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
   @Type: File, <ts>
   @Name: downloadOrganisationStructure function
   @Who: Suika
   @When: 21-dec-2021
   @Why: EWM-4070 EWM-4229
   @What: Api call for get
 */

  downloadOrganisationStructure(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.downloadorgStructure, FormData, {
      reportProgress: true,
      responseType: 'blob',
    })
      .pipe(retry(0), catchError(handleError));
  }

  /* 
     @Type: File, <ts>
     @Name: Get Teams 
     @Who: Adarsh Singh
     @When: 11-jan-2022
     @Why: EWM-4052 EWM-4488
     @What: Api call for get
   */
  clientTeamDetails(FormData: any) {
    return this.http.post(this.serviceListClass.clientTeamDetails, FormData)
      .pipe(retry(0), catchError(handleError));
  }

  /* 
     @Type: File, <ts>
     @Name: Delete Teams 
     @Who: Adarsh Singh
     @When: 13-jan-2022
     @Why: EWM-4052 EWM-4488
     @What: Api call for delete
   */

  clientTeamDelete(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.clientTeamDeleteById, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
     @Type: File, <ts>
     @Name: createQuickAddContact
     @Who: Adarsh Singh
     @When: 12J-an-2021
     @Why: EWM-3700 EWM-3916
     @What: create quick add contact 
     */

  createAddTeam(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createAddTeam, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
  @Type: File, <ts>
  @Name: createQuickAddContact
  @Who: Adarsh Singh
  @When: 12J-an-2021
  @Why: EWM-3700 EWM-3916
  @What: create quick add contact 
  */

  getClientTeamById(formdata: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.getClientTeamById + formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /* 
   @Type: File, <ts>
   @Name: Update Teams 
   @Who: Adarsh Singh
   @When: 12-jan-2022
   @Why: EWM-4052 EWM-4488
   @What: Api call for get
 */
  clientTeamUpdate(FormData: any) {
    return this.http.post(this.serviceListClass.clientTeamUpdate, FormData)
      .pipe(retry(0), catchError(handleError));
  }


  /* 
 @Type: File, <ts>
 @Name: Update Teams 
 @Who: Adarsh Singh
 @When: 12-jan-2022
 @Why: EWM-4052 EWM-4488
 @What: Api call for get 
*/

  fetchTeamCount(FormData) {
    return this.http.get(this.serviceListClass.getTeamCount + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
 @Type: File, <ts>
 @Name: Update Teams 
 @Who: Adarsh Singh
 @When: 12-jan-2022
 @Why: EWM-4052 EWM-4488
 @What: Api call for get 
*/

  checkDuplicateEmployeeTeam(FormData) {
    return this.http.post(this.serviceListClass.getDuplicateEmployeeTeam, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
     @Type: File, <ts>
     @Name: updateOwnerList function
     @Who: Suika
     @When: 04-Feb-2022
     @Why: EWM-4670
     @What: Update Owner List
     */
  updateOwnerList(formData): Observable<any> {
    return this.http.post<any>(this.serviceListClass.updateOwner, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
    @Type: File, <ts>
    @Name: getfilterConfigCandidate function
  @Who: Adarsh singh
 @When: 16-Feb-2022
 @Why: EWM-4498 EWM-4004
    @What:  for presist filter getting config state
  */

  getClientfilterConfigCandidate() {
    return this.http.get(this.serviceListClass.getfilterConfig + '?GridId=' + 'client_dashboard_config').pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* 
     @Type: File, <ts>
     @Name: setfilterConfig function
     @Who: Anup
     @When: 05-oct-2021
     @Why: EWM-3088 EWM-3138
     @What: for presist filter setting config
   */

  setfilterConfigCandidate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.setfilterConfig, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
   @Type: File, <ts>
   @Name: getEmailPreviewData function
   @Who: Suika
   @When: 28-march-2023
   @Why: EWM-11151 EWM-11481
   @What: Api call for get
 */
  getEmailPreviewData(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.emailPreview, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  fetchClientContactList(pagesize, pagneNo, sortingValue, searchValue): Observable<any> {
    return this.http.get(this.serviceListClass.getClientsContact + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + sortingValue + '&search=' + searchValue).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getfilterConfig(GridId): Observable<any> {
    return this.http.get(this.serviceListClass.getfilterConfig + '?GridId=' + GridId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*public fetch(state: State, searchValue): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      queryStr += '&search=' + searchValue;
    }
    return this.http
      .get(`${this.serviceListClass.getClientsContact}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],  
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }*/
//by maneesh changes ewm-18154 fixed ShowClientContactsProximity 
  public fetch(state: State, searchValue,isProximity=false, Latitude=0,Longitude=0,Distance=0,Unit='KM',ShowClientContactsProximity): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if(isProximity){
      queryStr += '&Latitude=' + Latitude+'&Longitude='+Longitude+'&Distance='+Distance+'&Unit='+Unit+'&ShowClientContactsProximity='+ShowClientContactsProximity;
    }
    if (searchValue) {
      queryStr += '&search=' + searchValue;
    }
    
    return this.http
      .get(`${this.serviceListClass.getClientsContact}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],  
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }
  
  


  getContactSummaryHeader(contactId): Observable<any> {
    return this.http.get(this.serviceListClass.getContactSummaryHeader+"?id="+contactId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getContactPersonalDetails(contactId): Observable<any> {
    return this.http.get(this.serviceListClass.getContactPersonalDetails+"?id="+contactId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getContactAddressDetails(contactId): Observable<any> {
    return this.http.get(this.serviceListClass.getContactAddress+"?id="+contactId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  updateContactAddress(contactData): Observable<any> {
    return this.http.post(this.serviceListClass.updateContactAddress ,contactData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  createContactAddress(contactData): Observable<any> {
    return this.http.post(this.serviceListClass.createContactAddress ,contactData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
 
  
  deleteContactAddress(location) : Observable<any>{
    return this.http.post(this.serviceListClass.deleteContactAddress,location ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getContactDetailsById(contactId): Observable<any> {
    return this.http.get(this.serviceListClass.getContactDetailsById+"?id="+contactId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  updateContactImage(updateImage): Observable<any> {
    return this.http.post(this.serviceListClass.updateContactImage, updateImage).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   
  deleteContact(formData) : Observable<any>{
    return this.http.post(this.serviceListClass.deleteContact+'?id='+formData ,{}).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  
  updatePersonalInformation(personalInfoData): Observable<any> {
    return this.http.post(this.serviceListClass.updatePersonalInfoData ,personalInfoData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  public fetchAssignedClientList(state: State, searchValue,contactId,IsUnassigned?:boolean): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      queryStr += '&search=' + searchValue;
    }
    let url:string
    if(IsUnassigned){
       url=this.serviceListClass.getClientUnAssignContactList
    }else{
     url=this.serviceListClass.getClientAssignContactList
    }
     queryStr+='&ContactId='+contactId
    // queryStr='ContactId='+contactId
    return this.http
      .get(`${url}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [], 
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }

  // public fetchUnAssignedClientList(state: State, searchValue,contactId): Observable<GridDataResult> {
  //   let queryStr = `${toDataSourceRequestString(state)}`;
  //   if (searchValue) {
  //     queryStr += '&search=' + searchValue;
  //   }
  //   queryStr+='&ContactId='+contactId
  //   return this.http
  //     .get(`${this.serviceListClass.getClientUnAssignContactList}?${queryStr}`)
  //     .pipe(
  //       map(response => (<GridDataResult>{
  //         data: response['Data'] ? response['Data'] : [], /*******@when: 28-04-2023  @WHo: Renu @WHY: EWM-9844 EWM-10187***********/
  //         total: parseInt(response['TotalRecord'], 10)
  //       }))
  //     );
  // }


  updateAssignment(assignmentData): Observable<any> {

    let url=this.serviceListClass.assignClientContact
    return this.http.post(url ,assignmentData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  delinkContact(personalInfoData): Observable<any> {
    return this.http.post(this.serviceListClass.delinkClientContact ,personalInfoData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name: dashboardClientDetails
 @Who:  Suika
 @When:27-Oct-2021
 @Why: EWM-3279.EWM-33516
 @What: get  Reason workflow pipline data  from APi
 */
 dashboardClientDetailsV2(jsonObj): Observable<any> {
  return this.http.post(this.serviceListClass.dashboardClientDetailsV2, jsonObj).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
  @Name: getClientFilterFolderList
  @Who: Nitin Bhati
  @When: 29-01-2024
  @Why: EWM-15818
  @What: get map client folder list data
  */
  getClientFilterFolderList(formData) {
    return this.http.get(this.serviceListClass.clientFolderList+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getClientMapToFolder
  @Who: Nitin Bhati
  @When: 29-01-2024
  @Why: EWM-15818
  @What: get map client folder list data
  */
  getClientMapToFolder(formData) {
    return this.http.get(this.serviceListClass.getClientFoldermappedList+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Type: File, <ts>
  @Name: updateMapClientToFolder
  @Who: Nitin Bhati
  @When: 29-01-2024
  @Why: EWM-15818
  @What: update map client folder data
  */
  updateMapClientToFolder(formData): Observable<any> {
    return this.http.post(this.serviceListClass.mapClientToFolder, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
//who:maneesh,what:ewm-16066 for fixed delete functionality,when:29/06/2024
  deLinkClientContact_V2(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deLinkClientContact_V2, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
//who:maneesh,what:ewm-16066 for fixed primarycontact functionality,when:29/06/2024
  isPrimaryContact(formData): Observable<any> {
    return this.http.post(this.serviceListClass.isPrimaryContact, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getRedirectedClientNotebyid(reqiestdata): Observable<any>{
    return this.http.get(this.serviceListClass.getRedirectedClientNotebyid+reqiestdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getClientNoteContactByClientid(requestData): Observable<any> {
    return this.http.get(this.serviceListClass.getContactByClientId+requestData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  addLeadSource(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addLeadSource, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getLeadSourceById(formData) {
    return this.http.get(this.serviceListClass.getLeadSourceById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  checkduplicasyLeadSource(formData) {
    return this.http.get(this.serviceListClass.checkduplicasyLeadSource + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  } 
  deleteLeadSource(formData): Observable<any> {
    return this.http.request('delete',this.serviceListClass.deleteLeadSource +'?Id='+ formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  updateLeadSource(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateLeadSource, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
        //by maneesh changes ewm-18154 fixed ShowClientContactsProximity 
        public fetchLeadSource(state: State, searchValue): Observable<GridDataResult> {
          let queryStr = `${toDataSourceRequestString(state)}`;
          if (searchValue) {
            queryStr += '&search=' + searchValue;
          }
          
          return this.http
            .get(`${this.serviceListClass.LeadSource}?${queryStr}`)
            .pipe(
              map(response => (<GridDataResult>{
                data: response['Data'] ? response['Data'] : [],  
                total: parseInt(response['TotalRecord'], 10)
              }))
            );
        }
        updateclientAccess(formData): Observable<any> {
          return this.http.post(this.serviceListClass.updateclientAccess, formData).pipe(
            retry(1),
            catchError(handleError)
          );
        }

        getclientAccessById(formData) {
          return this.http.get(this.serviceListClass.getclientAccessById+ formData).pipe(
            retry(1),
            catchError(handleError)
          );
        }

//who:Renu,what: EWM-19410 EWM-19551 @What:to get all EOH STATE DATA, @when:12/02/2025
        getEOHStateList(formData) {
          return this.http.get(this.serviceListClass.getEOHState+ formData).pipe(
            retry(1),
            catchError(handleError)
          );
        }

        //who:Renu,what: EWM-19410 EWM-19551 @What:to get all EOH LOCATION TYPE DATA, @when:12/02/2025
        getEOHLocationTypeList(formData) {
          return this.http.get(this.serviceListClass.getEOHLocationType+ formData).pipe(
            retry(1),
            catchError(handleError)
          );
        }

        //who:Renu,what: EWM-19410 EWM-19551 @What:to get all EOH LOCATION Function DATA, @when:12/02/2025
        getEOHLocationFuncList(formData) {
          return this.http.get(this.serviceListClass.getEOHLocationFunc+ formData).pipe(
            retry(1),
            catchError(handleError)
          );
        }

        //who:Renu,what: EWM-19410 EWM-19551 @What:to get all EOH Office DATA, @when:12/02/2025
        getEOHOfficeList(formData) {
          return this.http.get(this.serviceListClass.getEOHOffice+ formData).pipe(
            retry(1),
            catchError(handleError)
          );
        }

         //who:Renu,what: EWM-19410 EWM-19551 @What:to get all EOH Group DATA, @when:12/02/2025
         getEOHGrupList(formData) {
          return this.http.get(this.serviceListClass.getEOHGrup+ formData).pipe(
            retry(1),
            catchError(handleError)
          );
        }


          //who:Renu,what: EWM-19410 EWM-19551 @What:to get all EOH Priority DATA, @when:12/02/2025
          getEOHPriorityList(formData) {
            return this.http.get(this.serviceListClass.getEOHPriority+ formData).pipe(
              retry(1),
              catchError(handleError)
            );
          }

           //who:Renu,what: EWM-19410 EWM-19551 @What:to get all EOH List DATA, @when:12/02/2025
           getEOHStatusList(formData) {
            return this.http.get(this.serviceListClass.getEOHStatus+ formData).pipe(
              retry(1),
              catchError(handleError)
            );
          }

          // Method to call all EOH APIs in single function
  getAllClientEOHShareData(params: { }): Observable<any> {
    return forkJoin({
      eohStateList: this.getEOHStateList(params),
      eohLocationTypeList: this.getEOHLocationTypeList(params),
      eohLocationFuncList:this.getEOHLocationFuncList(params),
      eohOfficeList:this.getEOHOfficeList(params),
      eohGrupList:this.getEOHGrupList(params),
      eohPriorityList:this.getEOHPriorityList(params),
      eohStatusList:this.getEOHStatusList(params)
    });
  }

  //who:Renu,what: EWM-19410 EWM-19551 @What: Share Client TO EOH, @when:12/02/2025

  shareClientTOEOH(formData): Observable<any> {
    return this.http.post(this.serviceListClass.shareEOHClient, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  //who:Renu,what: EWM-19411 EWM-19651 @What: check Client already shared to EOH or not, @when:04/03/2025

  checkClientSyncTOEOH(formData: string): Observable<any> {
    return this.http.get(this.serviceListClass.checkClientSyncEOH+ formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
}
