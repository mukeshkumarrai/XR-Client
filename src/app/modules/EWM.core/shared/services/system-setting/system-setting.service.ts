/*
@(C): Entire Software
@Type: File, <ts>
@Name: system-setting.service.ts
@Who: Renu
@When: 24-Nov-2020
@Why: ROST-415
@What: Service Api's for system setting
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, map, retry, shareReplay } from 'rxjs/operators';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';


@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {


  /*
  @Type: File, <ts>
  @Name: system-setting.service.ts
  @Who: Nitin Bhati
  @When: 23-Nov-2020
  @Why: ROST-309
  @What: constructor function
  */
  private setgrupValueEmmit = new ReplaySubject<any>(1);
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) {
    this.setIndustryValue(localStorage.getItem('IndustryDescription'));
  }

  /*
 @Type: File, <ts>
 @Name: system-setting.service.ts
 @Who: Nitin Bhati
 @When: 20-Nov-2020
 @Why: ROST-399
 @What: get general setting Information related info from APi
 */
  getGeneralSettingInfo() {
    return this.http.get(this.serviceListClass.generalSettingList).pipe(
      retry(0),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: system-setting.service.ts
  @Who: mukesh kumar rai
  @When: 21-01-2021
  @Why: EWM-668
  @What: get AddressFormat from APi
  */
  getAddressFormat() {
    return this.http.get(this.serviceListClass.getAddressFormat).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: system-setting.service.ts
  @Who: mukesh kumar rai
  @When: 21-01-2021
  @Why: EWM-668
  @What: get AddressFormat from APi
  */
  setAddressFormat(formData): Observable<any> {
    return this.http.post(this.serviceListClass.setAddressFormat, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: system-setting.service.ts
  @Who: Nitin Bhati
  @When: 23-Nov-2020
  @Why: ROST-309
  @What: Update general setting Information related info from APi
  */
  updateGeneralSettingInfo(formData): Observable<any> {
    return this.http.post(this.serviceListClass.generalSettingUpdate, formData).pipe(
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
  getLanguageInternalization() {
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
  getTimezoneInternalization() {
    return this.http.get(this.serviceListClass.getTimeZoneList).pipe(
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
  updateInternalization(formData): Observable<any> {
    return this.http.post(this.serviceListClass.internalizationUpdate, formData).pipe(
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
  getInternalization() {
    return this.http.get(this.serviceListClass.internalizationList).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: fetchmailSettingList
  @Who: Renu
  @When: 24-Nov-2020
  @Why: ROST-415
  @What: get mail setting api details
  */

  fetchmailSettingList() {
    return this.http.get(this.serviceListClass.mailSettingList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateMailSettingDetails
  @Who: Renu
  @When: 24-Nov-2020
  @Why: ROST-415
  @What: update mail setting data
  */

  updateMailSettingDetails(formData): Observable<any> {
    return this.http.post(this.serviceListClass.mailSettingUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: Check Email Credentails
  @Who: Nitin Bhati
  @When: 04-Dec-2020
  @Why: ROST-415
  @What: verify email credentails mail setting data
  */
  checkEmailCredentils(formData): Observable<any> {
    return this.http.post(this.serviceListClass.checkEmailcredential, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createUserGrp
  @Who: Renu
  @When: 25-Nov-2020
  @Why: ROST-404
  @What: creating User Group Data
  */

  UserGrpCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.userGrpAdd, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
      @Type: File, <ts>
      @Name: updateUserGrp
      @Who: Nitin Bhati
      @When: 10-Feb-2021
      @Why: EWM-861
      @What: update User Group Data
    */
  updateGroupById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.userGrpUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: deleteUserGroupById function
@Who: Suika
@When: 13-July-2021
@Why: EWM-1998
@What: Api call for delete Industry data
*/
  deleteUserGroupById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.userGrpDelete + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchuserGrupList
  @Who: Renu
  @When: 25-Nov-2020
  @Why: ROST-404
  @What: Get user Group List data
  */
  fetchuserGrupList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.userGrpList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: fetchuserGrupList
  @Who: Renu
  @When: 25-Nov-2020
  @Why: ROST-404
  @What: Get user Group List data (For grid kendo server side pagination)
  */

  fetchuserGrupListPag(paginationParams) {
    return this.http.get(this.serviceListClass.userGrpList + '?' + paginationParams).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: fetchEmailTemplatesList
  @Who: Vipul
  @When: 09-DEC-2020
  @Why: ROST-445
  @What: Get email templates List data
  */
  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->

  fetchEmailTemplatesList(pagesize, pagneNo, orderBy, searchVal, CreatedBy?) {
    let url = this.serviceListClass.emailTempsList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal
    if (CreatedBy) {
      url += '&FilterBy=' + CreatedBy
    }
    return this.http.get(url).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createEmailTemplate
  @Who: Vipul
  @When: 09-DEC-2020
  @Why: ROST-445
  @What: creating Email Template Data
  */

  EmailTemplateCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.emailTempsAdd, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateEmailTemplates
  @Who: Vipul
  @When: 10-DEC-2020
  @Why: ROST-445
  @What: update email Template data
  */

  updateEmailTemplates(formData): Observable<any> {
    return this.http.post(this.serviceListClass.emailTempsUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteEmailTemplates
  @Who: Vipul
  @When: 10-DEC-2020
  @Why: ROST-445
  @What: delete email Template data
  */

  deleteEmailTemplates(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.emailTempsDelete, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );

  }

  /*
  @Type: File, <ts>
  @Name: GetEmailTemplateByID
  @Who: Vipul Bansal
  @When: 10-DEC-2020
  @Why: ROST-445
  @What: get email template by ID from APi
  */
  getEmailTemplateByID(formData) {
    return this.http.get(this.serviceListClass.emailTempByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: GetEmailTemplateByID
  @Who: Vipul Bansal
  @When: 10-DEC-2020
  @Why: ROST-445
  @What: check email template exists
  */
  checkEmailTemplateDuplicacy(formData) {
    // return this.http.get(this.serviceListClass.emailTemplateExists + formData).pipe(
    //   retry(1),
    //   catchError(handleError)
    // );

    return this.http.post(this.serviceListClass.emailTemplateExists, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: userSMSCreate
  @Who: Nitin Bhati
  @When: 25-Dec-2020
  @Why: ROST-488
  @What: creating User SMS Data
  */

  userSMSCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.userSmsAdd, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: fetchSmsList
  @Who: Nitin Bhati
  @When: 25-Dec-2020
  @Why: ROST-488
  @What: Get sms List data
  */

  fetchSmsList(pagesize, pagneNo, orderBy, searchVal, idName, idSms) {
    return this.http.get(this.serviceListClass.userSmsList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + idSms).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateSms
  @Who: Nitin Bhati
  @When: 15-DEC-2020
  @Why: ROST-488
  @What: update email Template data
  */
  updateSms(formData): Observable<any> {
    return this.http.post(this.serviceListClass.userSmsUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteSms
  @Who: Nitin Bhati
  @When: 24-DEC-2020
  @Why: ROST-488
  @What: delete email Template data
  */
  deleteSms(formData): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.userSmsDelete + `?SmsId=` + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: fetchSmsListSearch
  @Who: Nitin Bhati
  @When: 25-Dec-2020
  @Why: ROST-488
  @What: Get sms List using search data
  */
  fetchSmsListSearch(formData) {
    return this.http.get(this.serviceListClass.userSmsList + `?search=` + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchuserRoleList
  @Who: Renu
  @When: 24-Dec-2020
  @Why: ROST-485
  @What: get role details
  */

  fetchuserRoleList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.userRoleList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: searchRoleList
  @Who: Renu
  @When: 24-Dec-2020
  @Why: ROST-485
  @What: search role data from list
  @params : serachval
  */

  /*
  @Type: File, <ts>
  @Name: fetchuUserInvitationRoleList
  @Who: Vipul Bansal
  @When: 29-Jan-2021
  @Why: EWM-760
  @What: get user invitation role list
  */

  fetchuUserInvitationRoleList() {
    //return this.http.get(this.serviceListClass.userInvitationRoleList).pipe(
    return this.http.get(this.serviceListClass.userRoleList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchuUserInvitationUserTypeList
  @Who: Vipul Bansal
  @When: 29-Jan-2021
  @Why: EWM-760
  @What: get user invitation user type list
  */

  fetchuUserInvitationUserTypeList(groupName: string) {
    return this.http.get(this.serviceListClass.tenantUserTypeList + '?GroupName=' + groupName).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchuUserInvitationAccessLevelList
  @Who: Vipul Bansal
  @When: 29-Jan-2021
  @Why: EWM-760
  @What: get user invitation access level list
  */

  fetchuUserInvitationAccessLevelList() {
    return this.http.get(this.serviceListClass.accessLevelList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: addUserInvitation
  @Who: Vipul Bansal
  @When: 31-Jan-2021
  @Why: EWM-760
  @What: add user invitation
  */

  addUserInvitation(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addUserInvitation, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchUserInviteList
  @Who: Vipul Bansal
  @When: 31-Jan-2021
  @Why: EWM-760
  @What: user invitation list
  */

  fetchUserInviteList(pagesize, pagneNo, orderBy, searchVal, uType, uRole, recordFor: string) {
    return this.http.get(this.serviceListClass.userInvitationList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&RecordFor=' + recordFor + '&search=' + searchVal + '&RoleCodes=' + uRole + '&AccessLevelIds=' + uType).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  RevokeUserAccess(form: any): Observable<any> {
    return this.http.post(this.serviceListClass.revokUserAccess, form).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  updateUserInvitation(form: any): Observable<any> {
    return this.http.post(this.serviceListClass.UpdateUserInvitation, form).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  checkInvitationEmailExist(form: any): Observable<any> {
    return this.http.get(this.serviceListClass.checkInvitationEmailExist + '?Email=' + form.eamilId + '&UserTypeCode=' + form.userTypeCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getUserInviteByID
    @Who: Vipul Bansal
    @When: 31-Jan-2021
    @Why: EWM-766
    @What: get email template by ID from APi
    */
  getUserInviteByID(formData) {
    return this.http.get(this.serviceListClass.userInvitationByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: searchRoleList
  @Who: Renu
  @When: 24-Dec-2020
  @Why: ROST-485
  @What: search role data from list
  @params : serachval
  */

  searchRoleList(searchVal) {
    return this.http.get(this.serviceListClass.userRoleList + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteRoleById
  @Who: Renu
  @When: 24-Dec-2020
  @Why: ROST-485
  @What: delete role data from list
  @params : roleId
  */

  deleteRoleById(roleId) {
    return this.http.get(this.serviceListClass.userRoleDelete + '?RoleCode=' + roleId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateRoleById
  @Who: Renu
  @When: 24-Dec-2020
  @Why: ROST-485
  @What: update role data from list
  */

  updateRoleById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.userRoleUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: UserRoleCreate
  @Who: Renu
  @When: 24-Dec-2020
  @Why: ROST-485
  @What: ceate role data insertion
  */

  UserRoleCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.userRoleCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: roleDataSorting
  @Who: Renu
  @When: 25-Dec-2020
  @Why: ROST-885
  @What: Get email template using sorting data
  */

  emailTemplateDataSorting(pagesize, pagneNo, orderBy) {
    return this.http.get(this.serviceListClass.emailTempsList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: searchEmailTemplateList
 @Who: Renu
 @When: 24-Dec-2020
 @Why: ROST-485
 @What: search role data from list
 @params : serachval
 */

  searchEmailTemplateList(searchVal) {
    return this.http.get(this.serviceListClass.emailTempsList + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: searchGrupList
  @Who: Nitin Bhati
  @When: 25-Dec-2020
  @Why: ROST-488
  @What: Get User Group List search data
  */
  searchGrupList(searchVal) {
    return this.http.get(this.serviceListClass.userGrpList + `?search=` + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*

 @Name: getUserRole
 @Who: Priti Srivastava
 @When: 4-jan-2021
 @Why: EWM-607
 @What: To get user role
 @params :
 */
  getUserRole(): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.userRoleList)
      .pipe(
        retry(0),
        catchError(handleError)
      );

    /*
    @Name: getAllTenantUserType
    @Who: Priti Srivastava
    @When: 4-jan-2021
    @Why: EWM-607
    @What: To get all user type data
    @params : pagesize,pageNo,orderBy
    */
  }
  getAllTenantUserType(pagesize: any, pageNo: any, orderBy: any, searchVal: any, idName: any, id: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.tenantUserTypeList + '?PageNumber=' + pageNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id)
      .pipe(retry(0),
        catchError(handleError));
  }


  /*
  @Type: File, <ts>
  @Name: getTenantUserTypeByID
  @Who: Nitin Bhati
  @When: 25-May-2021
  @Why: EWM-1521
  @What: get user types data by ID from APi
  */
  getTenantUserTypeByID(formData) {
    return this.http.get(this.serviceListClass.tenantUserTypeListById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*

 @Name: update
 @Who: Priti Srivastava
 @When: 4-jan-2021
 @Why: EWM-607
 @What: update user type
 @params : formData
 */
  update(formData): Observable<any> {
    return this.http.post(this.serviceListClass.tenantUserTypeUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*

  @Name: getColumnCheck
  @Who: Nitin Bhati
  @When: 15-May-2021
  @Why: EWM-1488
  @What:to Column Check
  @params : column,value,id
  */
  getColumnCheck(formData): Observable<any> {
    return this.http.post(this.serviceListClass.tenantuserTypeColumnUniqueCheck, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Name: searchUserTypeList
  @Who: Priti Srivastava
  @When: 4-jan-2021
  @Why: EWM-607
  @What: search User Type from list
  @params : serachval
  */
  searchUserTypeList(searchVal) {
    return this.http.get(this.serviceListClass.tenantUserTypeList + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkRoleDuplicacy
  @Who: Renu
  @When: 06-01-2021
  @Why: ROST-640
  @What: check userrole Duplicacy
  */
  checkRoleDuplicacy(formData) {
    return this.http.get(this.serviceListClass.userRoleExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkUserGrpDuplicacy
  @Who: Renu
  @When: 06-01-2021
  @Why: ROST-641
  @What: check user Group Duplicacy
  */
  checkUserGrpDuplicacy(formData) {
    return this.http.get(this.serviceListClass.userGrpExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: checkUserGrpDuplicacy
  @Who: Renu
  @When: 06-01-2021
  @Why: ROST-641
  @What: check user Group Duplicacy
  */
  checkSmsTitleDuplicacy(formData) {
    return this.http.get(this.serviceListClass.userSmsExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchSystemLogList
  @Who: Nitin Bhati
  @When: 25-Jan-2021
  @Why: ROST-724
  @What: Get system log List data
  */
  fetchSystemLogList(pagesize, pagneNo, orderBy, searchVal, fromDate, toDate, pageName, pageValue) {
    if (pageValue == '') {
      return this.http.get(this.serviceListClass.userSystemLogList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&From=' + fromDate + '&To=' + toDate).pipe(
        retry(1),
        catchError(handleError)
      );
    } else {
      return this.http.get(this.serviceListClass.userSystemLogList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&From=' + fromDate + '&To=' + toDate + '&FilterParams.ColumnName=' + pageName + '&FilterParams.FilterValue=' + pageValue).pipe(
        retry(1),
        catchError(handleError)
      );
    }
  }

  /*
   @Type: File, <ts>
   @Name: fetchSystemLogListScroll
   @Who: Nitin Bhati
   @When: 25-Jan-2021
   @Why: ROST-724
   @What: Get system log List scroll data
   */
  fetchSystemLogListScroll(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.userSystemLogList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchSystemLogList
  @Who: Nitin Bhati
  @When: 25-Jan-2021
  @Why: ROST-724
  @What: Get system log List data
  */
  fetchSystemLogListDownload(fromDate, toDate, exportTo,sortingValue) {
    return this.http.get(this.serviceListClass.userSystemLogListDownload + '?From=' + fromDate + '&To=' + toDate + '&orderBy=' + sortingValue + '&ExportTo=' + exportTo, { responseType: 'blob' }).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: fetchSmsListSearch
  @Who: Nitin Bhati
  @When: 25-Dec-2020
  @Why: ROST-724
  @What: Get System Audit Log List using search data
  */
  fetchSystemLogListSearch(formData) {
    return this.http.get(this.serviceListClass.userSystemLogList + `?search=` + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: fetchAccessLevelList
   @Who: Nitin Bhati
   @When: 18-March-2021
   @Why: EWM-1116
   @What: get access level details
   */
  fetchAccessLevelList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.accessLevelList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: fetchAccessLevelList
    @Who: Nitin Bhati
    @When: 18-March-2021
    @Why: EWM-1116
    @What: get access level details
    */
  fetchAccessLevelListById(formData) {
    return this.http.get(this.serviceListClass.accessLevelListById + '?id=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*  @Name: fetchAccessLevelList
    @Who: Nitin Bhati
    @When: 19-May-2021
    @Why: EWM-1468
    */
  getRolePermission(roleId: string) {
    return this.http.get(this.serviceListClass.rolePermissionById + roleId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*  @Name: fetchAccessLevelList
  @Who: Nitin Bhati
  @When: 19-May-2021
  @Why: EWM-1468
  */
  saveRolePermission(formData): Observable<any> {
    return this.http.post(this.serviceListClass.saveRolePermission, formData).pipe(
      retry(1),
      catchError(handleError)
    );

  }

  /*
    @Type: File, <ts>
    @Name: getModulesListByTenant
    @Who: Vipul Bansal
    @When: 23-Mar-2021
    @Why: EWM-1183
    @What: get Modules List By Tenant
  */
  getModulesListByTenant() {
    return this.http.get(this.serviceListClass.getModuleList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: uploadDocumentFile
    @Who: Vipul Bansal
    @When: 30-Mar-2021
    @Why: EWM-1255
    @What: upload document files
  */
  uploadDocumentFile() { // : Observable<any>
    /* headers = headers.append('ApiKey', 'qwert');
    headers = headers.append('AgentId', '8e63bfaa-a258-48ef-838e-9daab7fb4cfd'); */

    /* let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'multipart/form-data');
    return this.http.post(this.serviceListClass.siteLogoupload + '?resources=templates', formData).pipe(
      retry(1),
      catchError(handleError)
    ); */

    return this.serviceListClass.siteLogoupload + '?resources=templates';
  }

  /*
    @Type: File, <ts>
    @Name: getPlaceholderTypeAll
    @Who: Vipul Bansal
    @When: 23-Mar-2021
    @Why: EWM-1183
    @What: get Modules List By Tenant
  */
  getPlaceholderTypeAll() {
    return this.http.get(this.serviceListClass.getPlaceHolderType).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getPlaceholderByType
    @Who: Vipul Bansal
    @When: 23-Mar-2021
    @Why: EWM-1183
    @What: get Modules List By Tenant
  */
  //  @Who: maneesh, @When: 28-dec-2022,@Why: EWM-10054 change relatedto sms to email

  getPlaceholderByType(formdata) {
    return this.http.get(this.serviceListClass.getPlaceHolderByType + '?placeholdertype=' + formdata + '&relatedto=email').pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getPlaceholderDetails
    @Who: Vipul Bansal
    @When: 23-Mar-2021
    @Why: EWM-1183
    @What: get Modules List By Tenant
  */
  getPlaceholderDetails() {
    return this.http.get(this.serviceListClass.getPlaceHolderDetails).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: searchAccessLevelList
  @Who: Nitin Bhati
  @When: 24-March-2021
  @Why: EWM-1228
  @What: search access level data from list
  @params : serachval
  */
  searchAccessLevelList(searchVal: string) {
    return this.http.get(this.serviceListClass.accessLevelList + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getOrganizationList() {
    return this.http.get(this.serviceListClass.getOrganizationList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getGrupList
    @Who: Renu
    @When: 13-May-2021
    @Why: ROST-1538
    @What: get group list data
    */
  getGrupList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.groupAllList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
  @Type: File, <ts>
  @Name: fetch People Master Contact Type List
  @Who: Anup Singh
  @When: 17-May-2021
  @Why: EWM-1448 EWM-1497
  @What: Get People Master Contact Type List data
  */

  fetchPeopleMasterContactTypeList(pagesize, pagneNo, orderBy, searchVal, category) {
    return this.http.get(this.serviceListClass.getAllPeopleMasterUserContactType + '?category=' + category + '&PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetch People Master Contact Type List Search
  @Who: Anup Singh
  @When: 17-May-2021
  @Why: EWM-1448 EWM-1497
  @What: Get People Master Contact Type List data For Search
  */
  fetchPeopleMasterContactTypeListSearch(category, formData) {
    return this.http.get(this.serviceListClass.getAllPeopleMasterUserContactType + '?category=' + category + '&search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: Create People Master Contact Type
   @Who: Anup Singh
   @When: 17-May-2021
   @Why: EWM-1448 EWM-1497
   @What:  Create For People Master Contact Type
   */
  createPeopleMasterUserContactType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addPeopleMasterUserContactType, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: Delete People Master Contact Type
    @Who: Anup Singh
    @When: 17-May-2021
    @Why: EWM-1448 EWM-1497
    @What:  Delete For People Master Contact Type By Id
    */
  deletePeopleMasterUserContactType(formDataId): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.deletePeople_MasterUserContactType + `?id=` + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: Get People Master Contact Type By Id
    @Who: Anup Singh
    @When: 17-May-2021
    @Why: EWM-1448 EWM-1497
    @What:  Get List for People Master Contact Type By Id
    */

  getPeopleMasterContactByID(formDataId) {
    return this.http.get(this.serviceListClass.getPeople_MasterContactByID + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: Update People Master Contact Type
    @Who: Anup Singh
    @When: 17-May-2021
    @Why: EWM-1448 EWM-1497
    @What:  Update For People Master Contact Type By Id
    */
  updatePeopleMasterContactType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updatePeople_MasterContactType, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getAllCategory
    @Who: Anup Singh
    @When: 17-May-2021
    @Why: EWM-1448 EWM-1497
    @What: get All Category
    */

  getAllCategory() {
    return this.http.get(this.serviceListClass.getAllCategoryForPeopleMaster).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: checkdContactDuplicay function
    @Who: Anup Singh
   @When: 17-May-2021
   @Why: EWM-1448 EWM-1497
   @Why: For check duplicate  data from server
   @What: Api call for get User Contact Type Data
 */
  checkdContactDuplicay(formData): Observable<any> {
    return this.http.get(this.serviceListClass.duplicayContactType + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*****************industry module service functions **********************************************/

  setIndustryValue(IndustryDescription: any) {
    localStorage.setItem('IndustryDescription', IndustryDescription);
    this.setgrupValueEmmit.next(IndustryDescription);

  }

  /*
 @Type: File, <ts>
 @Name: Uri Decoder
 @Who:  Suika
 @When: 19-May-2021
 @Why:  EWM-1506
 @What: For creating industry service
  */

  createIndustry(formdata: any) {
    return this.http.post<any>(this.serviceListClass.createIndustry, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }


  /*@who:Suika
  @when:19-May-2021
  @why:1506
  @what:get all Industries
  */
  getIndustryAll(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getIndustryAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*@who:Suika
  @when:19-May-2021
  @why:1506
  @what:get  Industry by id
  */
  getIndustryById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getIndustryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: updateIndustryById function
  @Who: Suika
  @When: 19-May-2021
  @Why: EWM-1506
  @What: Api call for update Industry data
  */
  updateIndustryById(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateIndustryById, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }



  /*
  @Type: File, <ts>
  @Name: deleteIndustryById function
  @Who: Suika
  @When: 19-May-2021
  @Why: EWM-1506
  @What: Api call for delete Industry data
  */
  deleteIndustryById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteIndustryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /******************sub industry *********************/


  /*
 @Type: File, <ts>
 @Name: Uri Decoder
 @Who:  Suika
 @When: 19-May-2021
 @Why:  EWM-1506
 @What: For creating subindustry service
  */

  createSubIndustry(formdata: any) {
    return this.http.post<any>(this.serviceListClass.createSubIndustry, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }


  /*@who:Suika
  @when:19-May-2021
  @why:1506
  @what:get all SubIndustries
  */
  getSubIndustryAll(IndustryId, pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getSubIndustryAll + '?IndustryId=' + IndustryId + '&PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*@who:Suika
  @when:19-May-2021
  @why:1506
  @what:get SubIndustry by id
  */
  getSubIndustryById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getSubIndustryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: updateSubIndustryById function
  @Who: Suika
  @When: 19-May-2021
  @Why: EWM-1506
  @What: Api call for update Industry data
  */
  updateSubIndustryById(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateSubIndustryById, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }



  /*
  @Type: File, <ts>
  @Name: deleteSubIndustryById function
  @Who: Suika
  @When: 19-May-2021
  @Why: EWM-1506
  @What: Api call for delete SubIndustry data
  */

  deleteSubIndustryById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteSubIndustryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: checkIndustryIsExist function
  @Who: Suika
  @When: 19-May-2021
  @Why: EWM-1506
  @What: Api call for already exist Industry field
  */
  checkIndustryIsExist(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkIndustryIsExist, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }



  /*
  @Type: File, <ts>
  @Name: checkSubIndustryIsExist function
  @Who: Suika
  @When: 19-May-2021
  @Why: EWM-1506
  @What: Api call for already exist SubIndustry field
  */
  checkSubIndustryIsExist(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkSubIndustryIsExist, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }


  /*
 @Type: File, <ts>
 @Name: getStatusList
 @Who: Renu
 @When: 12-May-2021
 @Why: ROST-1539
 @What: get status list data
 */
  getStatusList(pagesize, pagneNo, orderBy, searchVal, GroupId,StatusFor) {
    return this.http.get(this.serviceListClass.statusAllList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&GroupId=' + GroupId + '&StatusFor=' + StatusFor).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: statusCreate
  @Who: Renu
  @When: 12-May-2021
  @Why: ROST-1539
  @What: creating status Data by inserting in database
  */

  statusCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.creategrupstatus, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateStatus
  @Who: Renu
  @When: 12-May-2021
  @Why: ROST-1539
  @What: update status data
  */

  updateStatus(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateStatus, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getStatusByID
    @Who: Renu
    @When: 12-May-2021
    @Why: ROST-1539
    @What: get status data by ID from APi
    */
  getStatusByID(formData) {
    return this.http.get(this.serviceListClass.statusByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteStatus
  @Who: Renu
  @When: 12-May-2021
  @Why: ROST-1539
  @What: delete status data by id
  */

  deleteStatus(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteStatus + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkCodeDuplicacy
  @Who: Renu
  @When: 12-May-2021
  @Why: ROST-1539
  @What: check status code duplicay
  */
  checkCodeDuplicacy(formData) {
    return this.http.get(this.serviceListClass.checkCodeExist + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: checkCodeDuplicacy
 @Who: Renu
 @When: 18-May-2021
 @Why: ROST-1538
 @What: check status code duplicay
 */
  checkDescDuplicacy(formData) {
    return this.http.get(this.serviceListClass.statusDescExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: getReasonList
 @Who: Renu
 @When: 18-May-2021
 @Why: ROST-1538
 @What: get reason list data
 */
  getReasonList(pagesize, pagneNo, orderBy, searchVal, statusId, GroupId) {
    return this.http.get(this.serviceListClass.reasonList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&StatusId=' + statusId + '&GroupId=' + GroupId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: reasonCreate
  @Who: Renu
  @When: 18-May-2021
  @Why: ROST-1538
  @What: creating reason Data by inserting in database
  */

  reasonCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createReason, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateReason
  @Who: Renu
  @When: 18-May-2021
  @Why: ROST-1538
  @What: update Reason data
  */

  updateReason(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateReasonById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getReasonByID
    @Who: Renu
    @When: 18-May-2021
    @Why: ROST-1538
    @What: get reason data by ID from APi
    */
  getReasonByID(formData) {
    return this.http.get(this.serviceListClass.getReasonById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteReason
  @Who: Renu
  @When: 18-May-2021
  @Why: ROST-1540
  @What: delete reason data by id
  */

  deleteReason(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteReasonById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getAllUserTypeStatus
  @Who: Anup Singh
  @When: 20-May-2021
  @Why: EWM-1448 EWM-1497
  @What: get All User Type Status
  */

  getAllUserTypeStatus() {
    return this.http.get(this.serviceListClass.getAllstatus).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Name: getLocationTypeList
  @Who: Nitin Bhati
  @When: 17-May-2021
  @Why: EWM-1521
  @What: get location type list data
  */
  getLocationTypeList(pagesize, pagneNo, orderBy, searchVal, idName, id) {
    return this.http.get(this.serviceListClass.locationTypeAllList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: locationTypeCreate
  @Who: Nitin Bhati
  @When: 17-May-2021
  @Why: EWM-1521
  @What: creating location Data by inserting in database
  */

  locationTypeCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addLocationType, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateLocationType
  @Who: Nitin Bhati
  @When: 17-May-2021
  @Why: EWM-1521
  @What: update location type data
  */

  updateLocationType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateLocationType, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getLocationTypeByID
    @Who: Nitin Bhati
    @When: 17-May-2021
    @Why: EWM-1521
    @What: get location types data by ID from APi
    */
  getLocationTypeByID(formData) {
    return this.http.get(this.serviceListClass.locationTypeByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteLocationType
  @Who: Nitin Bhati
  @When: 17-May-2021
  @Why: EWM-1521
  @What: delete location type data by id
  */

  deleteLocationType(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteLocationType + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkLocationTypeDuplicacy
  @Who: Nitin Bhati
  @When: 17-May-2021
  @Why: EWM-1521
  @What: check location type duplicay
  */
  checkLocationTypeDuplicacy(formData) {
    return this.http.get(this.serviceListClass.locationTypeExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  fetchSocialProfile(pagneNo, pagesize, orderBy, searchVal): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.socialProfileListMaster + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  fetchSocialProfileSearch(formData) {
    return this.http.get(this.serviceListClass.socialProfileListMaster + `?search=` + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  // getSocailList() {
  //   return this.http.get(this.serviceListClass.socialProfileListMaster).pipe(
  //     retry(1),
  //     catchError(handleError)
  //   );
  // }

  checkdSocialProfileDuplicay(formData): Observable<any> {
    return this.http.get(this.serviceListClass.duplicaySocialProfileName + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getSocialProfileById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.socialProfileById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  deleteSocialProfile(formData): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.socialProfileDeleteMaster + `?id=` + formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  updateSocialProfile(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.socialProfileEditMaster, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }
  addSocialProfile(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.socialProfileAddMaster, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }




  /*
   @Type: File, <ts>
   @Name: fetchTagList function
   @Who: Anup Singh
   @When: 21-May-2021
    @Why: EWM-1445 EWM-1597
   @What:  get All Data for Tag List
   */

  fetchTagList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.tagList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: fetchTagListSearch function
    @Who: Anup Singh
    @When: 21-May-2021
     @Why: EWM-1445 EWM-1597
    @What:  get All Data by serching
    */
  fetchTagListSearch(formData) {
    return this.http.get(this.serviceListClass.tagList + '?search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: createTagList function
    @Who: Anup Singh
    @When: 21-May-2021
     @Why: EWM-1445 EWM-1597
    @What:  create Data For Tag List
    */
  createTagList(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addTagList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: deleteTagListById function
    @Who: Anup Singh
    @When: 21-May-2021
     @Why: EWM-1445 EWM-1597
    @What:  Delete Data For Tag List By Id
    */
  deleteTagListById(formDataId): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.deleteTagList + `?id=` + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getTagListByID function
    @Who: Anup Singh
    @When: 21-May-2021
     @Why: EWM-1445 EWM-1597
    @What:  Get Data For Tag List By Id
    */

  getTagListByID(formDataId) {
    return this.http.get(this.serviceListClass.tagListById + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: updateTagListById
    @Who: Anup Singh
    @When: 21-May-2021
     @Why: EWM-1445 EWM-1597
    @What:  Update For Tag List By Id
    */
  updateTagListById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateTagList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: checkdTagNameDuplicay function
     @Who: Anup Singh
    @When: 21-May-2021
    @Why: EWM-1445 EWM-1597
   @Why: For check duplicate  data from server
    @What: Api call for duplicacy check for tagName
  */
  checkdTagNameDuplicay(formData): Observable<any> {
    return this.http.get(this.serviceListClass.duplicayTagName + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: getJobCommitmentList
   @Who: Renu
   @When:24-May-2021
   @Why: ROST-1631
   @What: get Job commitement list data
   */
  getJobCommitmentList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getJobCommitmentList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: AddJobCommitment
  @Who: Renu
  @When:24-May-2021
  @Why: ROST-1631
  @What: creating Job commitment by inserting in database
  */

  AddJobCommitment(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobCommitmentCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateGroup
  @Who: Renu
  @When:24-May-2021
  @Why: ROST-1631
  @What: update Job Commitment
  */

  updateJobCommitment(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobCommitmentUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getJobCommitmentByID
    @Who: Renu
    @When:24-May-2021
    @Why: ROST-1631
    @What: get Job commitment data by ID from APi
    */
  getJobCommitmentByID(formData) {
    return this.http.get(this.serviceListClass.getJobCommitmentById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteJobCommitment
  @Who: Renu
  @When: 24-May-2021
  @Why: ROST-1631
  @What: delete Job commitment data by id
  */

  deleteJobCommitment(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getJobCommitmentDelete + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkJobCommitmentIsExists
  @Who: Renu
  @When: 24-May-2021
  @Why: ROST-1631
  @What: check Job commitement Name duplicay
  */
  checkJobCommitmentIsExists(formData) {
    return this.http.get(this.serviceListClass.getJobCommitmentIsExist + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: getInviteTeammateList Function
@Who:  Anup Singh
@When: 26-May-2021
@Why: EWM-1434 EWM-1613
@What: Api call for invite teammate via first Name, last Name or email Id
*/

  getInviteTeammateList(searchVal: any) {
    return this.http.get(this.serviceListClass.getInviteTeammate + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: createTeammate Function
 @Who:  Anup Singh
 @When: 27-May-2021
 @Why: EWM-1434 EWM-1613
 @What: Api call for create invite teammate
 */

  createTeammate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createInviteTeammate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Name: getAllTenantUserType
  @Who: Renu
  @When: 26-May-2021
  @Why: EWM-1586
  @What: To get Data from people type will be from user types where type is People
  @params : coumnName,filtervalue
  */

  getAllTenantUserPeopleType(columnValue: any, IsExcluded: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.tenantUserTypeList + '?GroupName=' + columnValue + '&IsExcluded=' + IsExcluded)
      .pipe(retry(0),
        catchError(handleError));
  }

  /*
  @Name: getSocialProfileListAll
  @Who: Renu
  @When: 26-May-2021
  @Why: EWM-1586
  @What: To get Data from social profile
  @params : None
  */
  getSocialProfileListAll(formData): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.socialProfileListMaster + formData)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
 @Name: getUserContactTypeCategory
 @Who: Renu
 @When: 26-May-2021
 @Why: EWM-1586
 @What: To get Data from social profile
 @params : category - email/phone
 */
  getUserContactTypeCategory(category: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.getPeopleListByCategory + '?category=' + category)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
@Name: createQuickPeople
@Who: Renu
@When: 26-May-2021
@Why: EWM-1586
@What: To create QUick people
@params : category - email/phone
*/

  createQuickPeople(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createPeople, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
@Name: createQuickCandidate
@Who: Renu
@When: 26-May-2021
@Why: EWM-1586
@What: To create QUick candidate
@params : category - email/phone
*/


  /*
@Name: createQuickCandidate
@Who: Renu
@When: 26-May-2021
@Why: EWM-1586
@What: To create QUick candidate
@params : category - email/phone
*/
  createQuickCandidate(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createCandidate, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }



  /*
@Name: getStatusUserType
@Who: Renu
@When: 26-May-2021
@Why: EWM-1586
@What: getting status form the user type filter
@params : usertype internal Code - EMPL/SUPP/CLIE
*/

  getStatusUserType(usertype: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.statusAllList + '?UserType=' + usertype)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
@Name: getStatusUserTypeLevel
@Who: Renu
@When: 29-oct-2021
@Why: EWM-1586
@What: getting status form the user type filter
@params : usertype internal Code - EMPL/SUPP/CLIEnt for fist level
*/

  getStatusUserTypeLevel(usertype: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.statusListLevel + '?UserType=' + usertype)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }
  /*
@Type: File, <ts>
@Name: getUserRoleListWithFilter
@Who: Renu
@When: 30-May-2021
@Why: EWM-1646
@What: get User role List with Filter
*/

  getUserRoleListWithFilter(columnName, columnValue) {
    return this.http.get(this.serviceListClass.userRoleList + '?FilterParams.ColumnName=' + columnName + '&FilterParams.FilterValue=' + columnValue).pipe(
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

  getCurrency() {
    return this.http.get(this.serviceListClass.currencyList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getRegion
   @Who: Nitin Bhati
   @When: 21-06-2020
   @Why: ROST-1821
   @What: get job category setting api details
   */

  getRegion() {
    return this.http.get(this.serviceListClass.regionList).pipe(
      retry(1),
      catchError(handleError)
    );
  }





  /*****************customer module service functions **********************************************/

  /*
 @Type: File, <ts>
 @Name: Uri Decoder
 @Who:  Suika
 @When: 21-June-2021
 @Why:  EWM-1904
 @What: For creating customer service
  */

  createCustomer(formdata: any) {
    return this.http.post<any>(this.serviceListClass.createCustomer, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }


  /*@who:Suika
  @when:21-June-2021
  @why:1904
  @what:get all Customer
  */
  getCustomerAll(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getCustomerAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*@who:Suika
  @when:19-June-2021
  @why:1904
  @what:get Customer by id
  */
  getCustomerById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getCustomerById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: updateCustomerById function
  @Who: Suika
  @When: 19-June-2021
  @Why: EWM-1904
  @What: Api call for update Customer data
  */
  updateCustomerById(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateCustomerById, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }



  /*
  @Type: File, <ts>
  @Name: deleteCustomerById function
  @Who: Suika
  @When: 19-June-2021
  @Why: EWM-1904
  @What: Api call for delete Customer data
  */
  deleteCustomerById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteCustomerById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
  @Type: File, <ts>
  @Name: checkCustomerIsExist function
  @Who: Suika
  @When: 19-June-2021
  @Why: EWM-1904
  @What: Api call for already exist Industry field
  */
  checkCustomerIsExist(formData): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.checkCustomerIsExist + '?typename=' + formData.typename + '&id=' + formData.id)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }

  /*
  @Type: File, <ts>
  @Name: getBrandAllList
  @Who: Nitin Bhati
  @When: 19-June-2021
  @Why: EWM-1786
  @What: get getBrandAll list data
  */
  getBrandAllList(pagesize, pagneNo, orderBy, searchVal, idName, id) {
    return this.http.get(this.serviceListClass.getBrandAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createBrand
  @Who: Nitin Bhati
  @When: 19-June-2021
  @Why: EWM-1786
  @What: creating createBrand Data by inserting in database
  */

  createBrand(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createBrand, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateBrandById
  @Who: Nitin Bhati
  @When: 19-June-2021
  @Why: EWM-1786
  @What: update updateBrandById data
  */
  updateBrandById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateBrandById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getBrandById
    @Who: Nitin Bhati
    @When: 19-June-2021
    @Why: EWM-1786
    @What: get getBrandById data by ID from APi
    */
  getBrandById(formData) {
    return this.http.get(this.serviceListClass.getBrandById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteBrandById
  @Who: Nitin Bhati
  @When: 19-June-2021
  @Why: EWM-1786
  @What: delete Brands data by id
  */

  deleteBrandById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteBrandById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkBrandIsExist
  @Who: Nitin Bhati
  @When: 19-June-2021
  @Why: EWM-1786
  @What: check barnd duplicay
  */
  checkBrandIsExist(formData) {
    return this.http.get(this.serviceListClass.checkBrandIsExist + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  getBrandAllListAll(formData) {
    return this.http.get(this.serviceListClass.getBrandAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getIndustryListAll() {
    return this.http.get(this.serviceListClass.getIndustryAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getSubIndustryListAll(IndustryId) {
    return this.http.get(this.serviceListClass.getSubIndustryAll + '?IndustryId=' + IndustryId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getLocationTypeListAll(formData) {
    return this.http.get(this.serviceListClass.locationTypeAllList + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getStatusGroupCode(groupcode: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.statusAllList + '?GroupId=' + groupcode)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  getReasonStatusGroupCode(StatusId: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.reasonList + '?StatusId=' + StatusId)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  getStateList() {
    return this.http.get(this.serviceListClass.getStateList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getAllStateByCountryId(id) {
    return this.http.get(this.serviceListClass.StateAll + '?CountryId=' + id + '&ByPassPaging=true' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').pipe(
      retry(1),
      catchError(handleError)
    );
  }


  getCustomerAllList() {
    return this.http.get(this.serviceListClass.getCustomerAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getParentCompanyList(formData) {
    return this.http.get(this.serviceListClass.getParentCompanyAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Name: createQuickCompany
@Who: Nitin Bhati
@When: 25-June-2021
@Why: EWM-1864
@What: To create QUick Company
@params : category - email/phone
*/

  createQuickCompany(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createQuickCompany, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
 @Name: checkCompanyNameDuplicacy
 @Who: Nitin Bhati
 @When: 02-July-2021
 @Why: EWM-1864
 @What: for check duplicacy
 */
  checkCompanyNameDuplicacy(formData) {
    return this.http.post(this.serviceListClass.companyNameExists, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Type: File, <ts>
   @Name: getFavouritMenuList
   @Who: Suika
   @When: 01-July-2021
   @Why: ROST-1908
   @What: get favourite Menu Information related info from APi
   */
  getFavouritMenuList() {
    return this.http.get(this.serviceListClass.getFavouriteMenu).pipe(
      retry(0),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: updateFavouritMenu
   @Who: Suika
   @When: 01-July-2021
   @Why: ROST-1908
   @What:update menu favourite Information related info from APi
   */
  updateFavouritMenu(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateFavouriteMenu, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }



  /*
   @Name: getQualificationList
   @Who: Nitin Bhati
   @When: 23Aug-2021
   @Why: EWM-2596
   @What: get Qualification list data
   */
  getQualificationList(pagesize, pagneNo, orderBy, searchVal, idName, id) {
    return this.http.get(this.serviceListClass.qualificationAllList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getQualificationByID
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2596
  @What: get Qualification data by ID from APi
  */
  getQualificationByID(formData) {
    return this.http.get(this.serviceListClass.qualificationByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: QualificationCreate
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2596
  @What: creating Qualification Data by inserting in database
  */

  qualificationCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addQualification, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: qualificationUpdate
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2596
  @What: update Qualification data
  */

  qualificationUpdate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateQualification, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: deleteQualification
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2596
  @What: delete Qualification data by id
  */

  deleteQualification(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteQualification, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkQualificationTypeDuplicacy
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2596
  @What: check Qualification duplicay
  */
  checkQualificationTypeDuplicacy(formData) {
    return this.http.get(this.serviceListClass.qualificationExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getIndustryList
  @Who: Nitin Bhati
  @When: 23Aug-2021
  @Why: EWM-2596
  @What: get Industry list data
  */
  getIndustryList() {
    return this.http.get(this.serviceListClass.getIndustryAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*****************skills *******************/

  /*
    @Name: getskillsList
    @Who: Suika
    @When: 12-Aug-2021
    @Why: EWM-2376 EWM-2214
    @What: get skills Information list data
    */

  getskillsList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getAllSkillsList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Name: getskillsList
    @Who: Anup
    @When: 01-Nov-2021
    @Why: EWM-3132 EWM-3603
    @What: get skills Information list data with filter
    */

  getskillsListWithFilter(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.getAllSkillsListWithFilter, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Name: getskillsListById
    @Who: Suika
    @When: 12-Aug-2021
    @Why: EWM-2376 EWM-2214
    @What: get skills Information list data
    */
  getskillsListById(formData) {
    return this.http.get(this.serviceListClass.getSkillById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Name: createSkills
   @Who: Suika
   @When: 12-Aug-2021
   @Why: EWM-2376 EWM-2214
   @What: create notes Information list data
   */
  createSkills(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createSkill, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Name: updateSkills
   @Who: Suika
   @When: 12-Aug-2021
   @Why: EWM-2376 EWM-2214
   @What: update notes Information list data
   */
  updateSkills(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateSkillById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
  @Type: File, <ts>
  @Name: deleteSkillsById function
  @Who: Suika
  @When: 16-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: Api call for delete Industry data
  */
  deleteSkillsById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deleteSkillById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Name: checkSkillsDuplicay
    @Who: Suika
    @When: 16-Aug-2021
    @Why: EWM-2199 EWM-2531
    @What: check type duplicacy
    */
  checkSkillsDuplicay(formdata): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkSkillName, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Name: checkSkillsDuplicay
    @Who: Suika
    @When: 16-Aug-2021
    @Why: EWM-2199 EWM-2531
    @What: check type duplicacy
    */
  checkcandidateSkillsDuplicay(formdata): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkCandidateskillsExists, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Name: fetchSkillNameCount
 @Who: Anup
 @When: 02-Nov-2021
 @Why: EWM-3132 EWM-3603
 @What: get skills Count
 */
  fetchSkillNameCount(formData) {
    return this.http.get(this.serviceListClass.getSkillsCount + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: fetchSkillsByTagId
  @Who: Anup
  @When: 02-Nov-2021
  @Why: EWM-3132 EWM-3603
  @What: get skills By tagId
  */
  fetchSkillsByTagId(formData) {
    return this.http.get(this.serviceListClass.getSkillsByTagId + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Name: updateBulkEdits
 @Who: Suika
 @When: 12-Aug-2021
 @Why: EWM-2376 EWM-2214
 @What: create notes Information list data
 */
  updateBulkEdit(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateBulkEditSkill, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*****************skill group *******************/

  /*
    @Name: getskillsList
    @Who: Suika
    @When: 12-Aug-2021
    @Why: EWM-2376 EWM-2214
    @What: get skills Information list data
    */

  getskillGroupList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getAllSkillGroupList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Name: getskillGroupListById
    @Who: Suika
    @When: 12-Aug-2021
    @Why: EWM-2376 EWM-2214
    @What: get skills Information list data
    */
  getskillGroupListById(formData) {
    return this.http.get(this.serviceListClass.getSkillGroupById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Name: createSkillGroup
   @Who: Suika
   @When: 12-Aug-2021
   @Why: EWM-2376 EWM-2214
   @What: create notes Information list data
   */
  createSkillGroup(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createSkillGroup, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Name: updateSkillGroup
   @Who: Suika
   @When: 12-Aug-2021
   @Why: EWM-2376 EWM-2214
   @What: update notes Information list data
   */
  updateSkillGroup(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateSkillGroupById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
  @Type: File, <ts>
  @Name: deleteSkillGroupById function
  @Who: Suika
  @When: 16-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: Api call for delete Industry data
  */
  deleteSkillGroupById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deleteSkillGroupById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Name: checkSkillsDuplicay
  @Who: Suika
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: check type duplicacy
  */
  checkSkillGroupDuplicay(Id, groupName): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.checkSkillGroupName + '?Id=' + Id + '&skillGroupName=' + groupName).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getWeightageList
  @Who: Nitin Bhati
  @When: 20-OCT-2021
  @Why: EWM-3431
  @What: get weightage list data
  */
  getWeightageList(pagesize: any, pagneNo: any, orderBy: any, searchVal: any, idName: any, id: any) {
    return this.http.get(this.serviceListClass.getWeightageList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: weightageCreate
  @Who: Nitin Bhati
  @When: 20-OCT-2021
  @Why: EWM-3431
  @What: creating weightage Data by inserting in database
  */

  weightageCreate(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.createWeightage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateWeightage
  @Who: Nitin Bhati
  @When: 20-OCT-2021
  @Why: EWM-3431
  @What: update Weightage data
  */

  updateWeightage(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.updateWeightage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getWeightageById
    @Who: Nitin Bhati
    @When: 20-OCT-2021
    @Why: EWM-3431
    @What: get weightage data by ID from APi
    */
  getWeightageById(formData: any) {
    return this.http.get(this.serviceListClass.getWeightageById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteWeightage
  @Who: Nitin Bhati
  @When: 20-OCT-2021
  @Why: EWM-3431
  @What: delete weightage data by id
  */
  deleteWeightage(formData: any): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteWeightage, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: checkDuplicityWeightage
 @Who: Nitin Bhati
 @When: 20-OCT-2021
 @Why: EWM-3431
 @What: check Weightage duplicay
 */
  checkDuplicityWeightage(formData: any) {
    return this.http.post(this.serviceListClass.checkDuplicityWeightage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: seekIntegrationConnectCreate
  @Who: Nitin Bhati
  @When: 02-Nov-2021
  @Why: EWM-3450
  @What: creating Seek Integration Data by inserting in database
  */
  seekIntegrationConnectCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addSeekIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: updateSeekIntegration
 @Who: Nitin Bhati
 @When: 02-Nov-2021
 @Why: EWM-3450
 @What: For update data for seek integration
 */
  updateSeekIntegration(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.updateSeekIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: disconnectSeekIntegration
 @Who: Nitin Bhati
 @When: 02-Nov-2021
 @Why: EWM-3450
 @What: For disconnect data for seek integration
 */
  disconnectSeekIntegration(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.seekIntegrationDisconnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getIntegrationCheckstatus
  @Who: Nitin Bhati
  @When: 02-Nov-2021
  @Why: EWM-3450
  @What: For checkIntegration Status
  */
  getIntegrationCheckstatus(registrationCode: any) {
    return this.http.get(this.serviceListClass.integrationCheckStatus + '?registrationcode=' + registrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
   @Name: getIntegrationCheckstatus
   @Who: Bantee Kumar
   @When: 17-july-2023
   @Why: EWM-10204
   @What: For checkIntegration Status
   */

  getJobBoardsIntegrationCheckstatus(registrationCode: any) {
    return this.http.post(this.serviceListClass.checkintegrationStatus, registrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: geIntegrationById
  @Who: Nitin Bhati
  @When: 02-Nov-2021
  @Why: EWM-3450
  @What: get Integration data by ID from APi
  */
  geIntegrationById(registrationCode: any) {
    return this.http.get(this.serviceListClass.getIntegrationById + '?registrationcode=' + registrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: geIntegrationById
  @Who: Nitin Bhati
  @When: 02-Nov-2021
  @Why: EWM-3450
  @What: get Integration data by ID from APi
  */
  getIntegrationRegistrationByCode(registrationCode: any) {
    return this.http.get(this.serviceListClass.getIntegrationRegistrationByCode + '?code=' + registrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*****************skill Tag *******************/

  /*
    @Name: getskillsList
    @Who: Nitin Bhati
    @When: 08-Nov-2021
    @Why: EWM-3596
    @What: get skills Information list data
    */

  getskillTagList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getAllSkillTagList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Name: getskillGroupListById
    @Who: Nitin Bhati
    @When: 08-Nov-2021
    @Why: EWM-3596
    @What: get skills Information list data
    */
  getskillTagListById(formData) {
    return this.http.get(this.serviceListClass.getSkillTagById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Name: createSkillGroup
   @Who: Nitin Bhati
   @When: 08-Nov-2021
   @Why: EWM-3596
   @What: create notes Information list data
   */
  createSkillTag(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createSkillTag, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Name: updateSkillGroup
   @Who: Nitin Bhati
   @When: 08-Nov-2021
   @Why: EWM-3596
   @What: update notes Information list data
   */
  updateSkillTag(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateSkillTagById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
  @Type: File, <ts>
  @Name: deleteSkillGroupById function
  @Who: Nitin Bhati
  @When: 08-Nov-2021
  @Why: EWM-3596
  @What: Api call for delete Industry data
  */
  deleteSkillTagById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deleteSkillTagById, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Name: checkSkillsDuplicay
  @Who: Nitin Bhati
  @When: 08-Nov-2021
  @Why: EWM-3596
  @What: check type duplicacy
  */
  checkSkillTagDuplicay(Id, groupName): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.checkSkillTagName + '?id=' + Id + '&skillGroupName=' + groupName).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Name: getSeekLocationList
   @Who: Nitin Bhati
   @When: 09Nov-2021
   @Why: EWM-3691
   @What: get Seek Location list data
   */
  getSeekLocationList(searchVal: any, organizationId: any) {
    return this.http.get(this.serviceListClass.getSeekLocation + '?locationName=' + searchVal + '&organizationId=' + organizationId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Name: getSeekJobCategorySugestion
  @Who: Nitin Bhati
  @When: 09Nov-2021
  @Why: EWM-3691
  @What: get Seek Job category sugestion
  */
  getSeekJobCategorySugestion(jobTitle: any, locationId: any) {
    return this.http.get(this.serviceListClass.getSeekJobCategorySugestion + '?jobTitle=' + jobTitle + '&locationId=' + locationId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getSeekJobCategoryWithchild
  @Who: Nitin Bhati
  @When: 09Nov-2021
  @Why: EWM-3691
  @What: get Seek job category with child
  */
  getSeekJobCategoryWithchild() {
    return this.http.get(this.serviceListClass.getSeekJobCategoryWithchild).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getSeekJobCategoryWithchild
  @Who: Nitin Bhati
  @When: 09Nov-2021
  @Why: EWM-3691
  @What: get Seek Location using lat long
  */
  getSeekLocationGeo(latitude: any, longitude: any) {
    return this.http.get(this.serviceListClass.getSeekLocationGeo + '?latitude=' + latitude + '&longitude=' + longitude).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Name: fetchClientListById
   @Who: Anup
   @When: 24-Nov-2021
   @Why: EWM-3638 EWM-3845
   @What: get client list by id
   */
  fetchClientListById(formData) {
    return this.http.get(this.serviceListClass.getClientListById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Name: updateQuickCompany
@Who: Anup
@When: 24-Nov-2021
@Why: EWM-3638 EWM-3845
@What: To update QUick Company
@params : category - email/phone
*/

  updateQuickCompany(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateQuickCompany, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }

  /*
  @Type: File, <ts>
  @Name: getAllContactRelatedType
  @Who: Anup Singh
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
  @What: get All Contact Related Type
  */

  getAllContactRelatedType() {
    return this.http.get(this.serviceListClass.getAllContactRelatedType).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: createQuickAddContact
   @Who: Anup Singh
   @When: 29-Nov-2021
   @Why: EWM-3700 EWM-3916
   @What: create quick add contact
   */

  createQuickAddContact(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createQuickContact, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }


  /*
     @Type: File, <ts>
     @Name: JobMappedToCandidateCreate function
     @Who: Anup Singh
     @When: 20-oct-2021
     @Why: EWM-3039 EWM-3405
     @What: Api call for create
   */
  fetchContactRelatedClientall(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getContactRelatedClientall, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
   @Name: unsubscribeDaxtraIntegration
   @Who: Nitin Bhati
   @When: 01-Dec-2021
   @Why: EWM-3946
   @What: For unsubsribe/disconnect data for Daxtra integration
   */
  unsubscribeDaxtraIntegration(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.daxtraIntegrationDisconnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: subscribeDaxtraIntegration
  @Who: Nitin Bhati
  @When: 01-Dec-2021
  @Why: EWM-3946
  @What: subscribe/connect Daxtra Integration Data by inserting in database
  */
  subscribeDaxtraIntegration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.daxtraIntegrationConnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getClientContactList
    @Who: Anup
    @When: 13 Dec
    @Why: EWM-3695 EWM-4126
    @What: Get all client contact on popup
    */
  getClientContactList(pagesize, pagneNo, searchVal, byPassPaging = false) {
    let url = this.serviceListClass.getClientContactList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&search=' + searchVal;
    if(byPassPaging){
      url = this.serviceListClass.getClientContactList + '?ByPassPaging=true';
    }
    return this.http.get(url).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
      @Type: File, <ts>
      @Name: getNotesCategoryList
      @Who: Nitin Bhati
      @When: 10-Dec-2021
      @Why: EWM-4140
      @What: get Note category list data
    */
  getNotesCategoryList(pagesize, pagneNo, orderBy, searchVal, idName: any, id: any) {
    return this.http.get(this.serviceListClass.notesCategoryList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: notesCategoryCreate
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: creating note category Data by inserting in database
  */

  notesCategoryCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.notesCategoryCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateNotesCategory
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: update Note category  data
  */

  updateNotesCategory(formData): Observable<any> {
    return this.http.post(this.serviceListClass.notesCategoryEdit, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getNotesCategoryByID
    @Who: Nitin Bhati
    @When: 10-Dec-2021
    @Why: EWM-4140
    @What: get note category data by ID from APi
    */
  getNotesCategoryByID(formData) {
    return this.http.get(this.serviceListClass.notesCategoryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteNotesCategory
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: delete Note category data by id
  */

  deleteNotesCategory(formData: any): Observable<any> {
    return this.http.request('delete', this.serviceListClass.notesCategoryDelete, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name: checkNotesCategoryDuplicacy
 @Who: Nitin Bhati
 @When: 10-Dec-2021
 @Why: EWM-4140
 @What: check Note category duplicay
 */
  checkNotesCategoryDuplicacy(formData) {
    return this.http.post(this.serviceListClass.notesCategoryDuplicayCheck, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getUserTypeList
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: get Note Category list data
  */
  getUserTypeList() {
    return this.http.get(this.serviceListClass.getAllUsertYpe).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Name: getSeekJobCategoryWithchild
@Who: Nitin Bhati
@When: 11-Dec-2021
@Why: EWM-3759
@What: get Seek Ad Selection
*/
  getSeekAdSelection(formData) {
    return this.http.get(this.serviceListClass.getSeekAdSelection + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getUpdatedSeekAdSelection
  @Who: Nitin Bhati
  @When: 06-Apr-2021
  @Why: EWM-6080
  @What: get Updated Seek Ad Selection
  */
  getUpdatedSeekAdSelection(formData) {
    return this.http.get(this.serviceListClass.getUpdatedSeekAdSelection + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getSeekBranding
  @Who: Nitin Bhati
  @When: 11-Dec-2021
  @Why: EWM-3759
  @What: get Seek Branding
  */
  getSeekBranding(organisationId: any) {
    return this.http.get(this.serviceListClass.getSeekBranding + '?organizationId=' + organisationId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Name: getPostingseekDetails
@Who: Nitin Bhati
@When: 11-Dec-2021
@Why: EWM-3759
@What: get Seek Branding
*/
  getPostingseekDetails() {
    return this.http.get(this.serviceListClass.getPostingseekDetails).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
@Name: getSeekAccountUser
@Who: Nitin Bhati
@When: 11-Dec-2021
@Why: EWM-3759
@What: get Seek Account user
*/
  getSeekAccountUser(formData) {
    return this.http.get(this.serviceListClass.getUserDirectory + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: createSeekPosting
    @Who: Nitin Bhati
    @When: 11-Dec-2021
    @Why: EWM-3759
    @What: creating Seek Job Posting Data by inserting in database
    */
  createSeekPosting(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createSeekJobPosting, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: updateSeekPosting
    @Who: Nitin Bhati
    @When: 04-Feb-2022
    @Why: EWM-3759
    @What: updating Seek Job Posting Data by inserting in database
    */
  updateSeekPosting(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateSeekJobPosting, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: enableXeopleSMSIntegration
@Who: ANUP SINGH
@When: 15-Dec-2021
@Why: EWM-3275 EWM-4199
@What: enable Xeople SMS Integration Data by inserting in database
*/
  enableXeopleSMSIntegration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.enableXeopleSMSIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: disableXeopleSMSIntegration
 @Who: ANUP SINGH
 @When: 15-Dec-2021
 @Why: EWM-3275 EWM-4199
 @What: disable Xeople SMS Integration Data by inserting in database
 */
  disableXeopleSMSIntegration(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.disableXeopleSMSIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: sendSmsJobForCan
 @Who: Anup Singh
 @When:16-Dec-2021
 @Why: EWM-4210.EWM-4219
 @What: send sms for can
 */

  sendSmsJobForCan(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.sendSmsJobForCan, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
 @Type: File, <ts>
 @Name: access permission
 @Who: Adarsh Singh
 @When:21-Dec-2021
 @Why: EWM-4060.EWM-4245
 @What: access permission
 */

  getAccessPermission(): Observable<any> {
    return this.http.get(this.serviceListClass.getAccessPermission)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  updateAccessPermission(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.postAccessPermission, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }



  /*
  @Type: File, <ts>
  @Name: getUserDirectoryList Function
  @Who:  Renu
  @When: 25-Mar-2021
  @Why: ROST-1181
  @What: Api call for contact receipent via first Name, last Name or email Id
  */

  getUserDirectoryList(formData) {
    return this.http.get(this.serviceListClass.getUserDirectory + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
        @Type: File, <ts>
        @Name: getActivityCategoryList
        @Who: Nitin Bhati
        @When: 07-Jan-2022
        @Why: EWM-4516
        @What: get Activity category list data
      */
  getActivityCategoryList(pagesize, pagneNo, orderBy, searchVal, idName: any, id: any) {
    return this.http.get(this.serviceListClass.activityCategoryList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: activityCategoryCreate
  @Who: Nitin Bhati
  @When: 07-Jan-2022
  @Why: EWM-4516
  @What: creating Activity category Data by inserting in database
  */

  activityCategoryCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.activityCategoryCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateActivityCategory
  @Who: Nitin Bhati
  @When: 07-Jan-2022
  @Why: EWM-4516
  @What: update Activity category  data
  */

  updateActivityCategory(formData): Observable<any> {
    return this.http.post(this.serviceListClass.activityCategoryEdit, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getActivityCategoryByID
    @Who: Nitin Bhati
    @When: 07-Jan-2022
    @Why: EWM-4516
    @What: get activity category data by ID from APi
    */
  getActivityCategoryByID(formData) {
    return this.http.get(this.serviceListClass.activityCategoryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteActivityCategory
  @Who: Nitin Bhati
  @When: 07-Jan-2022
  @Why: EWM-4516
  @What: delete Activity category data by id
  */

  deleteActivityCategory(formData: any): Observable<any> {
    return this.http.request('delete', this.serviceListClass.activityCategoryDelete, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name: checkActivityCategoryDuplicacy
 @Who: Nitin Bhati
 @When: 07-Jan-2022
 @Why: EWM-4516
 @What: check Activity category duplicay
 */
  checkActivityCategoryDuplicacy(formData) {
    return this.http.post(this.serviceListClass.activityCategoryDuplicayCheck, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getAllActivityListOnCategory
     @Who: Anup Singh
     @When: 10-Jan-2022
     @Why: EWM-4467 EWM-4530
     @What: get all on activity
   */
  getAllActivityListCategory(formData) {
    return this.http.get(this.serviceListClass.getAllActivityCategory + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getAllJobForAttendees
    @Who: Anup
    @When: 10 Jan 2022
    @Why: EWM-4467 EWM-4530
    @What: Get all list
    */
  getAllJobForCandidate(searchVal) {
    return this.http.get(this.serviceListClass.getAllCandidateForActivity + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getAllJobForAttendees
    @Who: Anup
    @When: 10 Jan 2022
    @Why: EWM-4467 EWM-4530
    @What: Get all list
    */
  getAllJobForAttendees(searchVal) {
    return this.http.get(this.serviceListClass.getAllJobForActivity + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getAllEmployeeForAttendees
    @Who: Anup
    @When: 10 Jan 2022
    @Why: EWM-4467 EWM-4530
    @What: Get all list
    */
  getAllEmployeeForAttendees(searchVal) {
    return this.http.get(this.serviceListClass.getAllEmployeeForActivity + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getAllClientForAttendees
    @Who: Anup
    @When: 10 Jan 2022
    @Why: EWM-4467 EWM-4530
    @What: Get all list
    */
  getAllClientForAttendees(searchVal) {
    return this.http.get(this.serviceListClass.getAllClientForActivity + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  AddMyActivity(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.myActivityCreate, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getActivitySchedular
   @Who: Renu
   @When: 14-Jan-2022
   @Why: EWM-4479 EWM-4603
   @What: get all on activity schedular list
 */
  getActivitySchedular(formData) {
    return this.http.get(this.serviceListClass.activitySchedular + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
      @Type: File, <ts>
      @Name: getActivityCategoryListBySearch
      @Who: Nitin Bhati
      @When: 14-Jan-2022
      @Why: EWM-4545
      @What: get Activity category list data
    */
  getActivityCategoryListBySearch(searchVal) {
    return this.http.get(this.serviceListClass.activityCategoryList + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: geAllMyActivity
    @Who: Anup
    @When: 17 Jan 2022
    @Why: EWM-4465 EWM-4661
    @What: Get all Activity list
    */
  getAllMyActivity(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.myActivityList, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getActivityCategoryListForFilter
  @Who: Anup Singh
  @When: 17-Jan-2022
  @Why: EWM-4465 EWM-4661
  @What: get Activity category list for filter data
*/
  getActivityCategoryListForFilter(pagesize, pagneNo, searchVal, IsInterviewedCategory?) {
    let url = this.serviceListClass.getAllActivityCategory + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&search=' + searchVal;
    if (IsInterviewedCategory) {
      url += '&IsInterviewedCategory=' + IsInterviewedCategory
    }
    return this.http.get(url).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getMyActivityById
  @Who: Anup Singh
  @When: 18-jan-2022
  @Why:EWM-4465 EWM-4661
  @What: get  Activity based on Id
  */
  getMyActivityById(formData) {
    return this.http.get(this.serviceListClass.getMyActivityById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: EditMyActivityById function
     @Who: Anup Singh
     @When: 18-jan-2022
     @Why:EWM-4465 EWM-4661 for get list for all activities
   */
  EditMyActivityById(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.updateMyActivityById, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: deleteMyActivityById function
@Who: Anup Singh
@When: 18-jan-2022
@Why:EWM-4465 EWM-4661
@What: Api call for delete Activity by id data
*/
  deleteMyActivityById(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteMyActivityById, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
    @Type: File, <ts>
    @Name: getAllClientCandidateForAttendees
    @Who: Nitin Bhati
    @When: 24 Jan 2022
    @Why: EWM-4467 EWM-4530
    @What: Get all list
    */
  getAllClientCandidateForAttendees(searchVal, ClientId) {
    return this.http.get(this.serviceListClass.getContactByClientId + '?search=' + searchVal + '&ClientId=' + ClientId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: zoomConfiguration
@Who: ANUP SINGH
@When: 4-feb-2022
@Why: EWM-4063 EWM-4611
@What:zoom configurationFor Enable
*/
  zoomConfiguration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.zoomConfiguration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: getOtherIntegrationCheckstatus
   @Who: ANUP SINGH
   @When: 4-feb-2022
   @Why: EWM-4063 EWM-4611
   @What: For checkIntegration Status
   */
  getOtherIntegrationCheckstatus(registrationCode: any) {
    return this.http.get(this.serviceListClass.otherIntegrationCheckStatus + '?registrationcode=' + registrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: zoomConfigurationDisabled
@Who: ANUP SINGH
@When: 7-feb-2022
@Why: EWM-4063 EWM-4611
@What:zoom configurationFor Enable
*/
  zoomConfigurationDisabled(formData): Observable<any> {
    return this.http.post(this.serviceListClass.zoomConfigurationDisabled, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
  @Name: fetchGDPRCompliance
  @Who: Anup Singh
  @When: 10-Feb-2022
  @Why: EWM-4674 EWM-5116
  @What: get GDPR Compliance
  */
  fetchGDPRCompliance() {
    return this.http.get(this.serviceListClass.getGDPRCompliance).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Name: updateGDPRCompliance
   @Who: Anup Singh
   @When: 10-Feb-2022
   @Why: EWM-4674 EWM-5116
   @What: update GDPR Compliance
   */
  updateGDPRCompliance(formData: any) {
    return this.http.post(this.serviceListClass.updateGDPRCompliance, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: get related list
  @Who: Adarsh singh
 @When: 11 feb 22
 @Why: EWM-4953
  @What: get All list
*/
  getRelatedToModule(pagesize, pagneNo, orderBy, searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.relateToModuleList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
  @Type: File, <ts>
  @Name:create realted function
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: create related module data
  */
  createRelatedToModule(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.relateToModuleCreate, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
@Type: File, <ts>
@Name:getRelatedToModuleById function
@Who: Adarsh singh
@When: 11 feb 22
@Why: EWM-4953
@What: get related data by id
*/
  getRelatedToModuleById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.relateToModuleById + formData)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
 @Type: File, <ts>
 @Name: updateRelatedToModule function
 @Who: Adarsh singh
 @When: 11 feb 22
 @Why: EWM-4953
 @What: updateRelatedToModule
 */
  updateRelatedToModule(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.relateToModuleUpdate, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
@Type: File, <ts>
@Name: checkDuplicacyRelatedToModule function
@Who: Adarsh singh
@When: 11 feb 22
@Why: EWM-4953
@What: checkDuplicacyRelatedToModule value
*/
  checkDuplicacyRelatedToModule(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.relateToModuleCheckDuplicacy, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
  @Type: File, <ts>
  @Name: deleteRelatedToModule function
  @Who: Adarsh singh
  @When: 11 feb 22
  @Why: EWM-4953
  @What: deleteRelatedToModule on by one
  */
  deleteRelatedToModule(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.relateToModuleDelete, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }
  /*
@Type: File, <ts>
@Name: getGDPRConsentByid function
@Who: Nitin Bhati
@When: 16 feb 22
@Why: EWM-5145
@What: getGDPRConsentByid on GDPR Consent
*/
  getGDPRConsentByid(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getGDPRConsentByid + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name: updateGDPRConsent function
 @Who: Nitin Bhati
 @When: 16 feb 22
 @Why: EWM-5145
 @What: updateGDPRConsent on GDPR Consent
 */
  updateGDPRConsent(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.updateGDPRConsent, formData)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }


  /*
  @Type: File, <ts>
  @Name: fetchModuleList
  @Who: Anup
  @When: 15-Feb-2022
  @Why: EWM-4672 EWM-5192
  @What: get Module Type
  */
  fetchModuleList() {
    return this.http.get(this.serviceListClass.getAllUsertYpe).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: getGDPREmailTempByModule
 @Who: Anup
 @When: 15-Feb-2022
 @Why: EWM-4672 EWM-5192
 @What: get GDPR Email Temp ByModule
 */
  getGDPREmailTempByModule(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getGDPREmailTemp + formData)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
@Type: File, <ts>
@Name: updateEmailTempByModule
@Who: Anup
@When: 15-Feb-2022
@Why: EWM-4672 EWM-5192
@What: update Email Temp ByModule
*/
  updateEmailTempByModule(formData: any) {
    return this.http.post(this.serviceListClass.updateGDPREmailTemp, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: getGDPRPageTempByModule
@Who: Anup
@When: 15-Feb-2022
@Why: EWM-4671 EWM-5186
@What: get GDPR Page Temp ByModule
*/
  getGDPRPageTempByModule(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getGDPRPageTemp + formData)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
 @Type: File, <ts>
 @Name: updatePageTempByModule
 @Who: Anup
 @When: 15-Feb-2022
 @Why: EWM-4671 EWM-5186
 @What: update Page Temp ByModule
 */

  updatePageTempByModule(formData: any) {
    return this.http.post(this.serviceListClass.updateGDPRPageTemp, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
@Type: File, <ts>
@Name: onValidateSeekAdvertiseId
@Who: Nitin Bhati
@When: 03-March-2022
@Why: EWM-5433
@What: get Seek advertise id
*/
  onValidateSeekAdvertiseId(advertiseId: any): Observable<any> {
    return this.http.get(this.serviceListClass.getSeekAdvertiseId + '?advertiserId=' + advertiseId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getSeekIntegrationById
  @Who: Nitin Bhati
  @When: 04-March-2022
  @Why: EWM-5433
  @What: get seek Integration data by ID from APi
  */
  getSeekIntegrationById(registrationCode: any) {
    return this.http.get(this.serviceListClass.getSeekIntegrationById + '?registrationcode=' + registrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getSeekApplicationMethod
    @Who: Nitin Bhati
    @When: 07-March-2022
    @Why: EWM-5445
    @What: for showing Apply Type
 */
  getSeekApplicationMethod(orgId: any) {
    return this.http.get(this.serviceListClass.getSeekApplicationMethod + '?Id=' + orgId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: zoomConfigurationConnect
@Who: ANUP SINGH
@When: 4-feb-2022
@Why: EWM-4063 EWM-4611
@What:zoom configurationFor Enable
*/
  zoomConfigurationConnect(formData): Observable<any> {
    return this.http.post(this.serviceListClass.zoomConfigurationConnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: zoomConfigurationDisconnect
@Who: ANUP SINGH
@When: 7-feb-2022
@Why: EWM-4063 EWM-4611
@What:zoom configurationFor Enable
*/
  zoomConfigurationDisconnect(formData): Observable<any> {
    return this.http.post(this.serviceListClass.zoomConfigurationDisconnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Name: createSystemAccessToken
   @Who: Anup Singh
   @When: 13-April-2022
   @Why: EWM-5580 EWM-6099
   @What: create System Access Token
   */
  createSystemAccessToken(formData: any) {
    return this.http.post(this.serviceListClass.createSystemAccessToken, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Name: getSystemAccessToken
   @Who: Anup Singh
   @When: 13-April-2022
   @Why: EWM-5580 EWM-6099
   @What: get System Access Token
   */
  getSystemAccessToken(sortingValue) {
    return this.http.get(this.serviceListClass.SystemAccessTokenList + '?OrderBy=' + sortingValue).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Name: revokeSystemAccessToken
   @Who: Anup Singh
   @When: 13-April-2022
   @Why: EWM-5580 EWM-6099
   @What: revoke System Access Token
   */
  revokeSystemAccessToken(formData: any) {
    return this.http.post(this.serviceListClass.revokeSystemAccessToken, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: msTeamConfigurationConnect
  @Who: Nitin Bhati
  @When: 13-Aprl-2022
  @Why: EWM-6189
  @What:NS Team configurationFor Enable
  */
  msTeamConfigurationConnect(formData): Observable<any> {
    return this.http.post(this.serviceListClass.msTeamConfigurationConnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: msTeamConfigurationDisconnect
  @Who: Nitin Bhati
  @When: 13-Aprl-2022
  @Why: EWM-6189
  @What:MS Team configurationFor Enable
  */
  msTeamConfigurationDisconnect(formData): Observable<any> {
    return this.http.post(this.serviceListClass.msTeamConfigurationDisconnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: googleMeetConfigurationConnect
  @Who: Nitin Bhati
  @When: 13-Aprl-2022
  @Why: EWM-6189
  @What:NS Team configurationFor Enable
  */
  googleMeetConfigurationConnect(formData): Observable<any> {
    return this.http.post(this.serviceListClass.googleMeetConfigurationConnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: googleMeetConfigurationDisconnect
  @Who: Nitin Bhati
  @When: 13-Aprl-2022
  @Why: EWM-6189
  @What:MS Team configurationFor Enable
  */
  googleMeetConfigurationDisconnect(formData): Observable<any> {
    return this.http.post(this.serviceListClass.googleMeetConfigurationDisconnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getUserSmsById
  @Who: Adarsh singh
  @When: 22-Aprl-2022
  @Why: EWM-5862
  @What:get data from api
  */
  getUserSmsById(Id): Observable<any> {
    return this.http.get(this.serviceListClass.getSmsById + '?id=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: msTeamConfiguration
  @Who: Nitin Bhati
  @When: 25-April-2022
  @Why: EWM-6237
  @What:ms team configurationFor Enable
  */
  msTeamConfiguration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.msTeamConfiguration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: googleMeetConfiguration
  @Who: Nitin Bhati
  @When: 28-April-2022
  @Why: EWM-6237
  @What:Google Meet configurationFor Enable
  */
  googleMeetConfiguration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.googleMeetConfiguration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*

 @Name: get by id
 @Who: Adarsh
 @When: 11-May-2022
 @Why: ROST-5862
@What: get data by ud
 */
  getTenantUserById(Id): Observable<any> {
    return this.http.get(this.serviceListClass.tenantUserTypeListById + '?userTypeId=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*

 @Name: get by id
 @Who: Adarsh
 @When: 11-May-2022
 @Why: ROST-5862
@What: get data by ud
 */
  getUserRoleById(Id): Observable<any> {
    return this.http.get(this.serviceListClass.getUserRoleById + '?RoleCode=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getUserGroupListById
  @Who: Adarsh singh
  @When: 01-06-2022
  @Why: EWM-1581 EWM-5862
  @What: get user group list by id
  */
  getUserGroupListById(formData) {
    return this.http.get(this.serviceListClass.getUserGroupListById + '?id=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: access permission Type
 @Who: Nitin Bhati
 @When:06-June-2022
 @Why: EWM-7056
 @What: access permission Type
 */
  getAccessPermissionType(): Observable<any> {
    return this.http.get(this.serviceListClass.getAccessPermissionType)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
    @Type: File, <ts>
    @Name: updateAccess
    @Who: Nitin Bhati
    @When:06-June-2022
    @Why: EWM-7056
    @What: update Access data
    */
  updateAccess(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateAccess, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
   @Name: checkIsDefaultLocation function
   @Who: maneesh
   @When: 06-june-2022
   @Why: EWM-6812 EWM-6989
   @What:change the  DefaultLocation
 */
  checkIsDefaultLocation(formData): Observable<any> {
    return this.http.post(this.serviceListClass.checkIsDefaultLocation, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*@who:Suika
    @when:01-Aug-2022
    @why:7427
    @what:get all checkList
    */
  getcheckListAll(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getCheckListAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*@who:Suika
    @when:01-Aug-2022
    @why:7427
    @what:get  checklist by id
    */
  getChecklistById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getCheckListById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*@who:Suika
    @when:01-Aug-2022
    @why:7427
    @what:getChecklistGroupById by id
    */
  getChecklistGroupById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getCheckListGroupById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: deleteChecklist
   @Who: suika
   @When: 01-Aug-2022
   @Why: EWM-7427
   @What: delete checklist data
   */

  deleteChecklist(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteChecklist, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  checkduplicateQuestions(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkUniqueQuestions, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  checkduplicateChecklist(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkUniqueChecklist, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  checkduplicateGrouplist(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkUniqueGroupList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name:createCheckList
 @Who:  Suika
 @When: 05-Aug-2022
 @Why:  EWM-7635
 @What: For  createCheckList service
  */

  createCheckList(formdata: any) {
    return this.http.post<any>(this.serviceListClass.createChecklist, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name:createCheckList
 @Who:  Suika
 @When: 05-Aug-2022
 @Why:  EWM-7635
 @What: For  createChecklistGroup service
  */

  createChecklistGroup(formdata: any) {
    return this.http.post<any>(this.serviceListClass.createChecklistGroup, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: updateCheckListById function
  @Who:  Suika
  @When: 05-Aug-2022
  @Why:  EWM-7635
  @What: Api call for update Industry data
  */
  updateCheckListById(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateChecklist, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }


  /*
  @Type: File, <ts>
  @Name: updateCheckListGroupById function
  @Who:  Suika
  @When: 05-Aug-2022
  @Why:  EWM-7635
  @What: Api call for update Industry data
  */
  updateCheckListGroupById(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateChecklistGroup, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }


  /*
  @Type: File, <ts>
  @Name:state Create
  @Who: maneesh
  @When: 25Aug-2022
  @Why: EWM-8055
  @What: get state Data in database
  */
  getStateAll(pagesize, pagneNo, orderBy, searchVal, idName, id) {
    return this.http.get(this.serviceListClass.StateAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name:state Create
  @Who: maneesh
  @When: 25Aug-2022
  @Why: EWM-8055
  @What: delete state Data in database
  */

  deleteState(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteState, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
   @Name:state Create
   @Who: maneesh
   @When: 25Aug-2022
   @Why: EWM-8055
   @What: update state Data
   */
  updateState(formData) {
    return this.http.post(this.serviceListClass.state, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name:state Create
  @Who: maneesh
  @When: 25Aug-2022
  @Why: EWM-8055
  @What: get state Data by inserting in database
  */
  getStateByID(formData) {
    return this.http.get(this.serviceListClass.getStateByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name:state Create
 @Who: maneesh
 @When: 25Aug-2022
 @Why: EWM-8055
 @What: creating state Data by inserting in database
 */

  statesCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.states, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name:state Create
  @Who: maneesh
  @When:25Aug-2022
  @Why: EWM-8055
  @What: check Duplicacy of State  Data by inserting in database
  */
  checkDuplicacyofState(formData) {
    return this.http.post(this.serviceListClass.checkDuplicacyofState, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
@Type: File, <ts>
@Name: disconnectbroadBeanIntegration
@Who: maneesh
@When: 20-sep-2022
@Why: EWM-8670
@What: For disconnect data for seek integration
*/
  disconnectbroadBeanIntegration(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.broadBeanIntegrationDisconnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: broadBeanIntegrationConnectCreate
  @Who: maneesh
  @When: 20-sep-2022
  @Why: EWM-8670
  @What: creating Broadbean Integration Data by inserting in database
  */
  broadBeanIntegrationConnectCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addbroadBeanIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
@Type: File, <ts>
@Name: getbroadbeantenantdetails
@Who: maneesh
@When: 21-Sep-2022
@Why: EWM-7472
@What: get broadbeantenant details data by ID from APi
*/
  getbroadbeantenantdetails(RegistrationCode: any) {
    return this.http.get(this.serviceListClass.getbroadbeantenantdetails + '?registrationCode=' + RegistrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: disconnectbroadBeanIntegration
@Who: maneesh
@When: 22-sep-2022
@Why: EWM-8676
@What: For disabel data for seek integration
*/
  disablebroadBeanIntegration(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.disablebroadBeanIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: broadBeanIntegrationConnectCreate
  @Who: maneesh
  @When: 22-sep-2022
  @Why: EWM-8676
  @What: creating enabelbroadBeanIntegration  Data by inserting in database
  */
  enabelbroadBeanIntegration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.enabelbroadBeanIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getbroadbeantenantdetails
  @Who: maneesh
  @When: 22-Sep-2022
  @Why: EWM-8676
  @What: get getbroadbeanuserdetails details data by ID from APi
  */
  getbroadbeanuserdetails(RegistrationCode: any) {
    return this.http.get(this.serviceListClass.getbroadbeanuserdetails + '?registrationCode=' + RegistrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: disconnectBurstSmsIntegration
 @Who: Nitin Bhati
 @When: 22-Sep-2022
 @Why: EWM-8875
 @What: For disconnect data for burst sms integration
 */
  disconnectBurstSmsIntegration(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.burstSmsIntegrationDisconnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: burstSmsIntegrationConnectCreate
    @Who: Nitin Bhati
    @When: 22-Sep-2022
    @Why: EWM-8875
    @What: creating Burst Sms Integration Data by inserting in database
    */
  burstSmsIntegrationConnectCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addBurstSmsIntegration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getBurstSmstenantdetails
  @Who: Nitin Bhati
  @When: 22-Sep-2022
  @Why: EWM-8875
  @What: get Burst Sms details data by ID from APi
  */
  getBurstSmstenantdetails(RegistrationCode: any) {
    return this.http.get(this.serviceListClass.getBurstSmstenantdetails + '?registrationCode=' + RegistrationCode).pipe(
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
  getWeightageUserType() {
    return this.http.get(this.serviceListClass.weighageUserType).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getSMSTemplate
  @Who: Suika
  @When: 28-Sep-2022
  @Why: EWM-8952
  @What: getSMSTemplate list data
  */
  getSMSTemplate(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.smsTempsList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: sendSms
  @Who: Suika
  @When:29-Sept-2022
  @Why: EWM-4210.EWM-4219
  @What: send sms for can
  */
  sendSms(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.sendSMS, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }


  /*
  @Type: File, <ts>
  @Name:getBalance
  @Who: Suika
  @When: 29-Sept-2022
  @Why: ROST-8952
  @What: get Internalization Information related info from APi
*/
  getBalance(formData) {
    return this.http.get(this.serviceListClass.getSMSBalance + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name:getSMSHistory
  @Who: Suika
  @When: 29-Sept-2022
  @Why: ROST-8952
  @What: get Internalization Information related info from APi
*/
  getSMSHistory(formData) {
    return this.http.get(this.serviceListClass.getSMSall + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name:getCandidateMappedPhone
  @Who: Suika
  @When: 29-Sept-2022
  @Why: ROST-8952
  @What: get Internalization Information related info from APi
*/
  getCandidateMappedPhone(formData) {
    return this.http.post(this.serviceListClass.getCandidateMappedPhone, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getCandidateMappedBulkemail function
    @Who: Suika
    @When: 13-Oct-2022
    @Why: EWM-6605 EWM-6720
    @What: Api call for total active count and discription
  */
  getCandidateMappedBulkemail(formData) {
    return this.http.post(this.serviceListClass.getCandidatemappedBulkemail, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getClientContactListAll
    @Who: Adarsh singh
    @When: 20 OCT 2022
    @Why: EWM-8880 EWM-9151
    @What: Get all client contact list for add reuired attendies popup
  */
  getClientContactListAll(searchVal) {
    return this.http.get(this.serviceListClass.getClientContactList + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getAllEmployeeList
  @Who: maneesh
  @When: 01 dec 2022
  @Why: EWM-9579 EWM-9573
  @What: Get all employee list
  */
  getAllEmployeeList(searchVal) {
    return this.http.get(this.serviceListClass.getAllEmployeeForActivity + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getCandidateActiveStatus
  @Who: Suika
  @When: 19-Dec-2022
  @Why: EWM-1732 EWM-9629
  @What: get All Candidate Status
  */

  getCandidateActiveStatus(candidateID) {
    return this.http.get(this.serviceListClass.getallStatusDetails + '?GroupId=' + candidateID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: fetchJobEmailTemplatesList
  @Who: Suika
  @When: 22-DEC-2022
  @Why: ROST-9629
  @What: Get email templates List data
  */
  fetchJobEmailTemplatesList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.emailTempsList + '?FilterParams.ColumnName=RelatedTo&FilterParams.ColumnType=Text&FilterParams.FilterValue=JOBS&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true&CountCreatedBy=CreatedBy' + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  configureRule(formData) {
    return this.http.post(this.serviceListClass.configureRule, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getConfigureRule
  @Who: Suika
  @When: 25-Dec-2022
  @Why: EWM-1732 EWM-9629
  @What: get All Candidate Status
  */

  getConfigureRule(applicationId) {
    return this.http.get(this.serviceListClass.getConfigureRule + '?applicationId=' + applicationId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getConfigureRuleTemplate
  @Who: Suika
  @When: 25-Dec-2022
  @Why: EWM-1732 EWM-9629
  @What: get All Candidate Status
  */

  getConfigureRuleTemplate(templateId) {
    return this.http.get(this.serviceListClass.getConfigureRuleTemplate + '?templateId=' + templateId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: broadbeanAddUser function
    @Who: Adarsh singh
    @When: 33-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: for adding record
  */
  broadbeanAddUser(formData: any) {
    return this.http.post(this.serviceListClass.broadbeanAddUser, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getBroadbeanUsersAll function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: get all plan all users
  */
  getBroadbeanUsersAll(data: any, pagneNo, pageSize, searchVal) {
    return this.http.get(this.serviceListClass.getBroadbeanUsersAll + '?registrationCode=' + data + '&PageNumber=' + pagneNo + '&PageSize=' + pageSize + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getPlanTypeAll function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: get all plan type
  */
  getPlanTypeAll() {
    return this.http.get(this.serviceListClass.getPlanTypeAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: deleteBroadbeanUsers function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: for deleting record by id
  */
  deleteBroadbeanUsers(userId) {
    return this.http.get(this.serviceListClass.deleteBroadbeanUsers + '?userId=' + userId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: deleteBroadbeanUsers function
    @Who: Adarsh singh
    @When: 31-Jan-2023
    @Why: EWM-10279 EWM-10330
    @What: for deleting record by id
  */
  checkBroadBeanUserIsExist(data) {
    return this.http.post(this.serviceListClass.isBroadBeanUserExist, data).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* @Name: getJobConfigurePermission
     @Who: Nitin Bhati
     @When: 07-Feb-2023
     @Why: EWM-10420
     */
  getJobConfigurePermission() {
    return this.http.get(this.serviceListClass.jobConfigurePermission).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*@Name: createJobConfigureField
    @Who: Nitin Bhati
    @When: 07-Feb-2023
    @Why: EWM-10420
  */
  createJobConfigureField(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createJobConfigureField, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: postSeekJobExpire
    @Who: Nitin Bhati
    @When: 28-Feb-2023
    @Why: EWM-10833
    @What: For post seek Job Expire
    */
    postSeekJobExpire(formData): Observable<any> {
    return this.http.post(this.serviceListClass.postSeekJobExpire, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: Insert Email Template
@Who: Nitin Bhati
@When: 28-04-2023
@Why: EWM-12255
@What: Get email templates List data for My Template and shared template
*/
  geMyTemplateAndSharedData(pagesize, pagneNo, orderBy, searchVal, CreatedBy) {
    return this.http.get(this.serviceListClass.emailTempsList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterBy=' + CreatedBy + '&StatusFilter=' + 'Active').pipe(
      retry(1),
      catchError(handleError)
    );

  }
  /*
@Type: File, <ts>
@Name: getStatusGroupCodesearchValue
@Who: maneesh
@When: 05-05-2023
@Why: EWM-11606
@What: Get status
*/
  getStatusGroupCodesearchValue(groupcode: any, searchValue): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.statusAllList + '?GroupId=' + groupcode + '&search=' + searchValue)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }
  /*
@Type: File, <ts>
@Name: getReasonStatusGroupCodesearchValue
@Who: maneesh
@When: 05-05-2023
@Why: EWM-11606
@What: Get reason
*/
  getReasonStatusGroupCodesearchValue(StatusId: any, searchValue): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.reasonList + '?StatusId=' + StatusId + '&search=' + searchValue)
      .pipe(
        retry(1),
        catchError(handleError)
      );
  }
  /*
@Type: File, <ts>
@Name: getClientContact
@Who: maneesh
@When: 29-05-2023
@Why: EWM-11569
@What: Get ClientContact list
*/
  getClientContact(formData) {
    return this.http.post(this.serviceListClass.getClientContactMapList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
@Type: File, <ts>
@Name: getClientContact
@Who: maneesh
@When: 29-05-2023
@Why: EWM-11569
@What: Get ClientContact list
*/
  getClientAssignContact(formData) {
    return this.http.post(this.serviceListClass.getClientAssignContact, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getClientContactList
    @Who: maneesh
    @When: 13 Dec
    @Why: EWM-11569
    @What: Get all client contact list on popup
    */
  getClientContactData() {
    return this.http.get(this.serviceListClass.getClientContactList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getEmployeeList
  @Who: Nitin Bhati
  @When: 26 June 2023
  @Why: EWM-9579 EWM-12837
  @What: Get all employee list
  */
  getEmployeeList() {
    return this.http.get(this.serviceListClass.getAllEmployeeForActivity).pipe(
      shareReplay(),
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getContactClientList
    @Who: Nitin Bhati
    @When: 26-June-2023
    @Why: EWM-12837
    @What: Get all client contact list
    */
  getContactClientList() {
    return this.http.get(this.serviceListClass.getClientContactList).pipe(
      shareReplay(),
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getCandidateActivityCount
    @Who: Nitin Bhati
    @When: 27-06-2023
    @Why: EWM-12837
    @What: Get Candidate Activity Count
    */
  getCandidateActivityCount(formData) {
    return this.http.post(this.serviceListClass.getCandidateActivityCount, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getActivitySchedular
    @Who: Adarsh singh
    @When: 14-June-2023
    @Why: EWM-11778 EWM-12850
    @What: get all on SYNC activity schedular list
  */
  getSYNCActivitySchedular(formData) {
    return this.http.post(this.serviceListClass.SYNCactivitySchedular, formData).pipe(
      shareReplay(),
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: geAllMyActivity
  @Who: Anup
  @When: 17 Jan 2022
  @Why: EWM-4465 EWM-4661
  @What: Get all Activity list
  */
  getAllMyInterviewActivities(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.myInterviewActivityList, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
@Type: File, <ts>
@Name: fetchemployeeInviteList
@Who: maneesh
@When: 31-july-2023
@Why: EWM-13334
@What: user invitation list
*/

  fetchemployeeInviteList(ByPassPaging, orderBy, searchVal, uType, uRole, recordFor: string) {
    return this.http.get(this.serviceListClass.userInvitationList + '?ByPassPaging=true' + '&orderBy=' + orderBy + '&RecordFor=' + recordFor + '&search=' + searchVal + '&RoleCodes=' + uRole + '&AccessLevelIds=' + uType).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  // <!--@Bantee Kumar,@EWM-13525,@when:14-08-2023, Common location changes-->

  getLatLongCoordinates(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.getLatLongByAddress, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  onValidateEohClientById(ClientId, SecretId): Observable<any> {
    return this.http.get(this.serviceListClass.getValidateEohClientById + '?clientId=' + ClientId + '&SecretKey=' + encodeURIComponent(SecretId)).pipe(
      retry(1),
      catchError(handleError)
    );
  }
    /*
  @Type: File, <ts>
  @Name: getCanLastUpcomingActivity
  @Who: Adarsh singh
  @When: 10-09-2023
  @Why: EWM-13814
  @What: get candidate upcoming and last activity details
  */
  getCanLastUpcomingActivity(FormData): Observable<any>{
    return this.http.get(this.serviceListClass.getCanLastUpcomingActivity+ FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  disconnectEOHIntegration(registerationCode: any): Observable<any> {
    return this.http.post(this.serviceListClass.EOHIntegrationDisconnect, registerationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  EOHIntegrationConnectCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.EOHIntegrationConnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getEOHIntegrationDetails(RegistrationCode): Observable<any> {
    return this.http.get(this.serviceListClass.getEOHIntegrationDetails + '?registrationCode=' + RegistrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  subscribeEOHSearchExtNotf(formData): Observable<any> {
    return this.http.post(this.serviceListClass.subscribeEOHSearchExtNotf, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  subscribeEOHPushJobNotf(formData): Observable<any> {
    return this.http.post(this.serviceListClass.subscribeEOHPushJobNotf, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  saveEOHSubsFeatures(formData): Observable<any> {
    return this.http.post(this.serviceListClass.saveEOHSubsFeatures, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  fetchUserInvititationList(recordFor: string) {
    return this.http.get(this.serviceListClass.userInvitationList + '?ByPassPaging=true' +'&RecordFor=' + recordFor ).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  getEOHSrhExtSubsDetails(RegistrationCode: string) {
    return this.http.get(this.serviceListClass.getEOHSrhExtSubsDetails + '?registrationCode='+ RegistrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getEOHPushJobSubsDetails(RegistrationCode: string) {
    return this.http.get(this.serviceListClass.getEOHPushJobSubsDetails + '?registrationCode='+ RegistrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getSuperAdminDetails() {
    return this.http.get(this.serviceListClass.getSuperUserDetails).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  // <!--@Bantee Kumar,@EWM-13525,@when:14-08-2023, updateContactDetails-->

  updateContactDetails(FormData): Observable<any>{
    return this.http.post(this.serviceListClass.updateContactDetails, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getAllSelectedCandidates
  @Who: Suika
  @When: 17-09-2023
  @Why: EWM-13816 EWM-13898
  @What: To get Data for selected candidates
  @params : coumnName,filtervalue
  */
 getAllSelectedCandidates(JobId:string,WorkflowId:string): Observable<any> {
  return this.http.get<any[]>(this.serviceListClass.getAllSelectedCandidates + '?JobId=' + JobId + '&WorkflowId='+ WorkflowId)
    .pipe(retry(0),
      catchError(handleError));
}

/*** @When: 20-09-2023 @Who:bantee  @Why: EWM-14395 @What: managing kendo grid via data state **/

  public fetchEmailTemplateList(state: State, searchValue): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      queryStr += '&search=' + searchValue;
    }
    return this.http
      .get(`${this.serviceListClass.emailTemplateList}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }

  /*
  @Name: closeJob
  @Who: Suika
  @When: 17-09-2023
  @Why: EWM-13816 EWM-13898
  @What: To get Data for selected candidates
  @params : coumnName,filtervalue
  */
 closeJob(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.closeJob,formData)
    .pipe(retry(0),
      catchError(handleError));
}
/*** @When: 01-11-2023 @Who:maneesh @What: managing kendo grid via data state **/
public fetchSmsTemplateList(state: State, searchValue): Observable<GridDataResult> {
  let queryStr = `${toDataSourceRequestString(state)}`;
  if (searchValue) {
    queryStr += '&search=' + searchValue;
  }
  return this.http
    .get(`${this.serviceListClass.userV2SmsList}?${queryStr}`)
    .pipe(
      map(response => (<GridDataResult>{
        data: response['Data'] ? response['Data'] : [],
        total: parseInt(response['TotalRecord'], 10)
      }))
    );
}

/*
    @Type: File, <ts>
    @Name: createIndeedPosting
    @Who: Nitin Bhati
    @When: 16-Nov-2023
    @Why: EWM-15083
    @What: creating Indeed Job Posting Data by inserting in database
    */
    createIndeedPosting(formData): Observable<any> {
      return this.http.post(this.serviceListClass.createIndeedJobPosting, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    getIndeedJobPublishedDetailsById(formData): Observable<any> {
      return this.http.get(this.serviceListClass.getIndeedPublishedJobDetails + formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    getDownloadJobXml(JobID): Observable<any> {
      return this.http.get(this.serviceListClass.getIndeedDownloadJobXml + '?JobID=' + JobID, { responseType: 'blob' }).pipe(
        retry(1),
        catchError(handleError)
      );
      // return this.http.get(this.serviceListClass.getIndeedDownloadJobXml + formData).pipe(
      //   retry(1),
      //   catchError(handleError)
      // );
    }

    /*
  @Type: File, <ts>
  @Name: getIndeedIntegrationCheckstatus
  @Who: maneesh
  @When: 07-Nov-2023
  @Why: EWM-14477
  @What: For checkIntegration indeed Status
  */

  getIndeedIntegrationCheckstatus(registrationCode: any) {
    return this.http.get(this.serviceListClass.inDeedintegrationCheckStatus + '?RegistrationCode=' + registrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  disconnectIndeedIntegration(registerationCode: any): Observable<any> {
    return this.http.post(this.serviceListClass.indeedIntegrationDisconnect, registerationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  indeedIntegrationConnectCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.IndeedIntegrationConnect, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

/*** @When: 29-11-2023 @Why:EWM-15176 EWM-15203 @Who:Renu @What: get shared calender List revoke**/

public sharedCalenderUserRevokeList(state: State): Observable<GridDataResult> {
  const queryStr = `${toDataSourceRequestString(state)}`;
  let text = queryStr;
  return this.http
      .get(`${this.serviceListClass.sharedCalenderListSharedTo}?${text}`)
      .pipe(
        map(response => (<GridDataResult>{
                       data: response['Data']?response['Data']:[],
                       total: parseInt(response['TotalRecord'], 10)
        }))
      );
}

  /*** @When: 29-11-2023 @Why:EWM-15176 EWM-15203 @Who:Renu @What: get shared calender List **/

  sharedCalenderUserList() {
    return this.http.get(this.serviceListClass.sharedCalenderListSharedBy).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*** @When: 29-11-2023 @Why:EWM-15176 EWM-15203 @Who:Renu @What: save shared calender List **/
  sharedCalenderUserSave(formData): Observable<any> {
    return this.http.post(this.serviceListClass.sharedCalenderUserSave, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*** @When: 29-11-2023 @Why:EWM-15176 EWM-15203 @Who:Renu @What: delete shared calender List **/
   sharedCalenderUserDelete(formData): Observable<any> {
    return this.http.post(this.serviceListClass.sharedCalenderUserDelete, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   /*** @When: 30-11-2023 @Why:EWM-15160  @Who:Adarsh @What: get external attendees name **/
   getExternalAttendees(query:string) {
    return this.http.get(this.serviceListClass.getExternalAttendeeName + query).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   /*** @When: 20-12-2023 @Why:EWM-15501  @Who:maneesh @What: get client name when edit client**/
  getParentCompanyAllEditClient(formData) {
    return this.http.get(this.serviceListClass.getParentCompanyAllEditClient + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  subscribeNotification(formData): Observable<any> {
    return this.http.post(this.serviceListClass.postEOHCandNotification, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getEOHCandidateSubsDetails(RegistrationCode: string) {
    return this.http.get(this.serviceListClass.getEOHCandsubscriptionDetails + '?registrationCode='+ RegistrationCode).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getClientContactsList(formData) {
    return this.http.post(this.serviceListClass.getClientContactsList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  // who:maneesh,what:ewm-16064 for get contact sms history,when:22/02/2024
  getContactSMSHistory(formData) {
    return this.http.get(this.serviceListClass.getContactSMSHistory + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getSMSAllContact(formData) {
    return this.http.get(this.serviceListClass.getSMSAllContact + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getUserNotificationsAll(GetOnlyUnreadCount,NotificationStatus,PageNumber,PageSize,search): Observable<any> {
    return this.http.get(this.serviceListClass.getUserNotificationsAll+'?GetOnlyUnreadCount='+GetOnlyUnreadCount+'&NotificationStatus='+NotificationStatus+'&PageNumber='+PageNumber+'&PageSize='+PageSize+'&search=' + search).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  readNotification(formData): Observable<any> {
    return this.http.post(this.serviceListClass.readNotification, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  deleteNotification(formData): Observable<any> {
    return this.http.post(this.serviceListClass.deleteNotification, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  sendBulkSmsForClient(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.sendBulkSmsForClient, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

//by maneesh,what:ewm-16918 when:01/05/2024
  resetlockedUser(UserId) {
      return this.http.get(this.serviceListClass.resetlockedUser+'?UserId='+UserId).pipe( 
    retry(1),
   catchError(handleError)
   );
  }
  //by maneesh,what:ewm-16918 when:01/05/2024
invitedlockedUser(formdata: any): Observable<any> {
  return this.http.post(this.serviceListClass.invitedlockedUser, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
}
getSeekCurrencies() {
  return this.http.get(this.serviceListClass.getSeekCurrencies).pipe(
    retry(1),
    catchError(handleError)
  );
}

getSeekAdselectionV2(formdata: any): Observable<any> {
  return this.http.post(this.serviceListClass.getSeekAdselectionV2, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
}

createSeekJobPostingPreview(formdata: any): Observable<any> {
  return this.http.post(this.serviceListClass.createSeekJobPostingPreview, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
}

getCandidateSourceDefaultStatus(ApplicationSource : string): Observable<any> {
  return this.http.get<any[]>(this.serviceListClass.getCandidateSourceDefaultStatus +'?ApplicationSource='+ApplicationSource)
    .pipe(retry(0),
      catchError(handleError));
}
getSeekPayType() {
  return this.http.get(this.serviceListClass.getSeekPayType).pipe(
    retry(1),
    catchError(handleError)
  );
}
getSeekWorkType() {
  return this.http.get(this.serviceListClass.getSeekWorkType).pipe(
    retry(1),
    catchError(handleError)
  );
}

getStateListWithCountryId(countryInfo) {
  return this.http.get(this.serviceListClass.getStateList+countryInfo).pipe(
    retry(1),
    catchError(handleError)
  );
}
 
 
getSeekAdselectionUpdateV2(formdata: any): Observable<any> {
  return this.http.post(this.serviceListClass.getSeekAdselectionUpdateV2, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
}
// START <!-- for Vxt feature integration by maneesh ewm-17967 ,when:30-08-2024-->
getIntegrationCheckstatusVxt(registrationCode: any) {
  return this.http.get(this.serviceListClass.integrationCheckStatusVxt + '?RegistrationCode=' + registrationCode).pipe(
    retry(1),
    catchError(handleError)
  );
}
getVxtIntegrationRegistrationByCode(registrationCode: any) {
  return this.http.get(this.serviceListClass.getVxtIntegrationRegistrationByCode + '?code=' + registrationCode).pipe(
    retry(1),
    catchError(handleError)
  );
}
getVxtIntegrationStatus(formdata: any): Observable<any> {
  return this.http.post(this.serviceListClass.getVxtIntegrationStatus, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
}

getAllDataForProfileImage(formdata) {
  return this.http.get(this.serviceListClass.getAllCandidateForActivity_v2 + formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}
getClientDataForProfileImage(formdata) {
  return this.http.get(this.serviceListClass.getAllClientForActivity + formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}
getContactDataForProfileImage(formdata) {
  return this.http.get(this.serviceListClass.getClientsContact + formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}

getLeadActiveStatus(candidateID) {
  return this.http.get(this.serviceListClass.getallStatusDetails + '?GroupId=' + candidateID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&StatusFor=LEAD').pipe(
    retry(1),
    catchError(handleError)
  );
}

createQuickLead(formdata: any): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.createQuickLead, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    );
}

getClientWorkflowAll(DefaultWorkflow) {
  return this.http.get(this.serviceListClass.getClientWorkflowAll + '?GetDefaultWorkflow=' + DefaultWorkflow + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND').pipe(
    retry(1),
    catchError(handleError)
  );
}
convertLeadIntoClient(formdata: any): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.convertLeadIntoClient, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    );
}
getLeaddetailsById(formData) {
  return this.http.get(this.serviceListClass.getLeaddetailsById + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}
//END <!-- for Vxt feature integration by maneesh ewm-17967 ,when:30-08-2024-->

/*******client/job/clinet sunscription from marketplace********/

getEOHClientsubsDetails(RegistrationCode: string) {
  return this.http.get(this.serviceListClass.getEOHClientsubscriptionDetails + '?registrationCode='+ RegistrationCode).pipe(
    retry(1),
    catchError(handleError)
  );
}

getEOHContactsubsDetails(RegistrationCode: string) {
  return this.http.get(this.serviceListClass.getEOHContactsubscriptionDetails + '?registrationCode='+ RegistrationCode).pipe(
    retry(1),
    catchError(handleError)
  );
}

getEOHJobsubsDetails(RegistrationCode: string) {
  return this.http.get(this.serviceListClass.getEOHJobsubscriptionDetails + '?registrationCode='+ RegistrationCode).pipe(
    retry(1),
    catchError(handleError)
  );
}

subscribeEOHShareClientNotf(formData): Observable<any> {
  return this.http.post(this.serviceListClass.subscribeEOHClientNotf, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

subscribeEOHShareJobNotf(formData): Observable<any> {
  return this.http.post(this.serviceListClass.subscribeEOHJobNotf, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

subscribeEOHShareContactNotf(formData): Observable<any> {
  return this.http.post(this.serviceListClass.subscribeEOHContactNotf, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

getCountryById(id){
  return this.http.get(this.serviceListClass.countryById + '?Id=' + id).pipe( 
    retry(1),
   catchError(handleError)
   );
}

}

