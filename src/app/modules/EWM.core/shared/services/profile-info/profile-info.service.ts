/*
@(C): Entire Software
@Type: File, <ts>
@Name: profile-info.service.ts
@Who: Renu
@When: 16-Nov-2020
@Why: ROST-316
@What: Service Api's
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, shareReplay } from 'rxjs/operators';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoService {

  /*
  @Type: File, <ts>
  @Name: profile-info.service.ts
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
  }


  /*
  @Type: File, <ts>
  @Name: fetchContactInfo
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: get contact related information from Api
  */


  fetchContactInfo() {
    return this.http.get(this.serviceListClass.contactList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: profile-info.service.ts
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: get country related info from APi
  */

  fetchCountryInfo(pagneNo?:number, pagesize?:any) {
    /*-@When:31-07-2023,@why:EWM-13251,@who: Nitin Bhati-*/
    return this.http.get(this.serviceListClass.countryList + '?ByPassPaging=' + true).pipe(
      shareReplay(),
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: profile-info.service.ts
  @Who: Nitin Bhati
  @When: 16-March-2021
  @Why: EWM-1051
  @What: get country search related info from APi
  */
  fetchCountryInfoSearch(search: string) {
    return this.http.get(this.serviceListClass.countryList + '?search=' + search).pipe(
      shareReplay(),
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateContactDetails
  @Who: Renu
  @When: 16-Nov-2020
  @Why: ROST-316
  @What: update contact info based on userid
  */

  updateContactDetails(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateContact, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: profile-info.service.ts
  @Who: Nitin Bhati
  @When: 18-Nov-2020
  @Why: ROST-395
  @What: get user Profile Information related info from APi
  */

  getUserProfileInfo() {
    return this.http.get(this.serviceListClass.userProfileList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: profile-info.service.ts
  @Who: Nitin Bhati
  @When: 18-Nov-2020
  @Why: ROST-395
  @What: Update user Profile Information related info from APi
  */

  updateUserProfileInfo(formData): Observable<any> {
    return this.http.post(this.serviceListClass.userProfileUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: Upload Image Function
  @Who:  Nitin Bhati
  @When: 18-Nov-2020
  @Why: For submitting the form data with some params
  @What: Api call for submitting Image Upload data
  */
  addImageUploadFile(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.userProfileImageUpload, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
  @Type: File, <ts>
  @Name: chgPwdForm
  @Who:  Renu
  @When: 23-Nov-2020
  @Why: For submitting the form data with some params
  @What: Api call for submitting Image Upload data
  */

  chgPwdForm(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateUserPwd, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
  @Type: File, <ts>
  @Name:
  @Who:  Renu
  @When: 23-Nov-2020
  @Why: For submitting the form data with some params
  @What: for two step verification process
  */

  accVerifyPwd(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.verifyPwd, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
@Type: File, <ts>
@Name: profile-info.service.ts
@Who: Nitin Bhati
@When: 20-Nov-2020
@Why: ROST-399
@What: get user email setting Information related info from APi
*/

  getUserEmailSettingInfo() {
    return this.http.get(this.serviceListClass.emailSettingList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: profile-info.service.ts
  @Who: Nitin Bhati
  @When: 20-Nov-2020
  @Why: ROST-399
  @What: Update user email setting Information related info from APi
  */

  updateUserEmailSettingInfo(formData): Observable<any> {
    return this.http.post(this.serviceListClass.emailSettingUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: system-setting.service.ts
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: ROST-307
    @What: get Language Internalization Information related info from APi
  */
  getLanguage() {
    return this.http.get(this.serviceListClass.getLanguageList).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: system-setting.service.ts
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: ROST-307
    @What: get Timezone Internalization Information related info from APi
  */
  getTimezone() {
    return this.http.get(this.serviceListClass.getTimeZoneList).pipe(
      shareReplay(),
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: system-setting.service.ts
    @Who: Nitin Bhati
    @When: 23-Nov-2020
    @Why: ROST-307
    @What: Update Internalization Information related info from APi
  */
  updatePreference(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateuserPreference, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: system-setting.service.ts
    @Who: Nitin Bhati
    @When: 24-Nov-2020
    @Why: ROST-307
    @What: get Internalization Information related info from APi
  */
  getPreference() {
    return this.http.get(this.serviceListClass.userPreferenceList).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
     @Name: updateUserEmailIntegration
     @Who: Mukesh Kumar
     @When: 27-Dec-2020
     @Why: ROST-307
     @What: get getUserEmailIntegration related info from APi
  */
//  <!-----@When:  27-07-2023 @Who : bantee @why: EWM-13394---->

  getUserEmailIntegration(emailId?) {
     // @suika @EWM-13297 @whn 29-07-2023  
     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.http.get(this.serviceListClass.getEmailIntegration + '?emailId=' + currentUser.EmailId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
     @Type: File, <ts>
     @Name: updateUserEmailIntegration
     @Who: Mukesh Kumar
     @When: 27-Dec-2020
     @Why: ROST-307
     @What: update updateUserEmailIntegration related info from APi
   */

  updateUserEmailIntegration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateUserEmailIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateMFASettings()
  @Who: Renu
  @When: 13-Jan-2020
  @Why: ROST-702
  @What: Update User MFA to diabled
  */

  updateMFASettings(): Observable<any> {
    return this.http.post(this.serviceListClass.disableUserMfa, {}).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: Upload Image Function
    @Who:  Priti Srivastava
    @When: 27-jan-2021
    @Why: EWM 681
    @What: Api call for submitting Image Upload data
    */
  ImageUploadBase64(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.imageUploadByBase64, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }
  /*
 @who:priti
 @when:16-March-2021
 @why:1165
 @what:For get password pattern details from API
 */
  getPasswordValidationParameter() {
    return this.http.get(this.serviceListClass.passwordPattern).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getCurrency
  @Who: Suika
  @When: 16-06-2020
  @Why: ROST-1876
  @What: get mail setting api details
  */
  getCurrency(pagneNo, pagesize) {
    return this.http.get(this.serviceListClass.currencyList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
   @Type: File, <ts>
   @Name: updateDarkMode
   @Who:  Suika
   @When: 19-June-2021
   @Why: ROST-1876
   @What: update darkmode info
   */

  updateDarkMode(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateDarkMode, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @who:Suika
 @when:19-June-2021
 @why:1876
 @what:For get getDarkMode from API
 */
  getDarkMode() {
    return this.http.get(this.serviceListClass.getDarkMode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getClientTagList
    @Who: Renu
    @When: 13-July-2021
    @Why: ROST-2104
    @What: get client tag list data
    */
  getClientTagList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.clientTagList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: clientTagCreate
  @Who: Renu
  @When: 13-Jul-2021
  @Why: ROST-2104
  @What: creating client tag Data by inserting in database
  */

  clientTagCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.clientTagCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: deletClientTag
  @Who: Renu
  @When: 13-Jul-2021
  @Why: ROST-2104
  @What: delete Client Tag data by id
  */

  deletClientTag(formData): Observable<any> {
    return this.http.get(this.serviceListClass.clientTagDelete + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getClientTagByID
    @Who: Renu
    @When: 13-July-2021
    @Why: ROST-2104
    @What: get Client data by ID from APi
    */
  getClientTagByID(formData) {
    return this.http.get(this.serviceListClass.clientTagById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateClientTag
  @Who: Renu
  @When: 13-Jul-2021
  @Why: ROST-2104
  @What: update client tag data
  */

  updateClientTag(formData): Observable<any> {
    return this.http.post(this.serviceListClass.clientTagUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: checkCodeKeywordDuplicacy
 @Who: Renu
 @When: 14-July-2021
 @Why: ROST-2104
 @What: check  code/Keyword duplicay
 */
  checkCodeKeywordDuplicacy(formData) {
    return this.http.post(this.serviceListClass.clientTagDuplicate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  //----------------Manage Name for Client and Employee Mange Name--------------//
  /*
   @Type: File, <ts>
   @Name: getManageNameList
   @Who: Nitin Bhati
   @When: 16-July-2021
   @Why: EWM-2057/2067
   @What: get Manage Name Information related info from APi
 */
  getManageNameList(formData) {
    return this.http.get(this.serviceListClass.getManageNameList + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
      @Type: File, <ts>
      @Name: createManageName
      @Who: Nitin Bhati
      @When: 16-July-2021
      @Why: EWM-2057/2067
      @What: Update Manage Name By Id Information related info from APi
    */
  createManageName(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createManageName, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
      @Type: File, <ts>
      @Name: getmanageNameValueListAdmin
      @Who: Nitin Bhati
      @When: 16-July-2021
      @Why: EWM-2057/2067
      @What: get Client Manage Name By Admin Information related info from APi
    */
  getmanageNameValueListAdmin(formData) {
    return this.http.get(this.serviceListClass.getmanageNameValueListAdmin + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getManageNameAdminById
   @Who: Nitin Bhati
   @When: 16-July-2021
   @Why: EWM-2057/2067
   @What: get Manage Name By Id Information related info from APi
 */
  getManageNameAdminById(formData) {
    return this.http.get(this.serviceListClass.getManageNameAdminById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getManageNameList
  @Who: Renu
  @When: 26-Aug-2021
  @Why: EWM-2057/2067
  @What: get Manage Name Information related info from APi
*/
  getManageNameAllList(formData) {
    return this.http.get(this.serviceListClass.getManageAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getManageNameList
   @Who: Renu
   @When: 15-Sept-2021
   @Why: EWM-2716
   @What: office 365 configure with authorization code
 */
  officeConfigure(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getEmailIntegrationNew, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

    /*
   @Type: File, <ts>
   @Name: getWorkSchedule
   @Who: Adarsh SIngh
   @When: 14-APRIL-2022
   @Why:EWM-5579 EWM-6172
   @What:  get work schedule data from api
 */
getWorkSchedule() {
  return this.http.get(this.serviceListClass.getWorkSchedule).pipe(
    retry(1),
    catchError(handleError)
  );
}
    /*
   @Type: File, <ts>
   @Name: updateWorkSchedule
   @Who: Adarsh SIngh
   @When: 14-APRIL-2022
   @Why:EWM-5579 EWM-6172
   @What:  update work schedule data from api
 */
updateWorkSchedule(formData): Observable<any> {
  return this.http.post(this.serviceListClass.updateWorkSchedule, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}


}
