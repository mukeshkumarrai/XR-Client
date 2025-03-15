/*
@(C): Entire Software
@Type: File, <ts>
@Name: login.service.ts
@Who: Renu
@When: 26-Oct-2020
@Why: ROST-290
@What: Login Authentication
@modified on: 08/05/2021
 */
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/exception-handler';
import { User } from '../../../shared/models/User'
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { EncryptionDecryptionService } from '../encryption-decryption.service';
import { AppSettingsService } from '../app-settings.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {v4 as uuid} from 'uuid';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private httpClient: HttpClient;
  logoutBaseUrl: any;

  /*
  @Type: File, <ts>
  @Name: constructor
  @Who: Renu
  @When: 26-nov-2020
  @Why: ROST-405
  @What: for injecting all dependecy & service class
  */

  constructor(private commonserviceService: CommonserviceService, private injector: Injector, private http: HttpClient,
    public _encryptionDecryptionService: EncryptionDecryptionService, private handler: HttpBackend, private _appSetting: AppSettingsService,
    private router: Router, private _profileInfoService: ProfileInfoService,
    private cookieService: CookieService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.logoutBaseUrl = this._appSetting.baseUrl;
    this.httpClient = new HttpClient(handler);

  }

  /*
  @Type: File, <ts>
  @Name: serviceListClass
  @Who: Renu
  @When: 26-nov-2020
  @Why: ROST-405
  @What: this creates serviceclasslist for getting url's property on login service to avoid cyclic dependency.
   */

  public get serviceListClass(): ServiceListClass {
    return this.injector.get(ServiceListClass);
  }

  /*
  @Type: File, <ts>
  @Name: currentUserValue
  @Who: Renu
  @When: 26-Oct-2020
  @Why: ROST-290
  @What: For getting the current user login details
   */

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /*
  @Type: File, <ts>
  @Name: login check
  @Who: Vipul Bansal
  @When: 18-Feb-2021
  @Why: EWM-973
  @What: For check login into system that the given user name is exists or not
  @params: @username
          @pwd
          @domain: Entire
          @isRemember: boolean value (true/false)
          @device: web/Mobile
   */

  loginCheck(formdata) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post<any>(this.serviceListClass.loginUserCheck, formdata, { headers: headers })
      .pipe(map(response => {
        return response;
      }))
  }

  /*
  @Type: File, <ts>
  @Name: login
  @Who: Renu
  @When: 26-Oct-2020
  @Why: ROST-290
  @What: For login into system and stored the user information in localStorage
  @params: @username
          @pwd
          @domain: Entire
          @isRemember: boolean value (true/false)
          @device: web/Mobile
   */



  login(formdata) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post<any>(this.serviceListClass.loginUserAuth, formdata, { headers: headers })
      .pipe(map(user => {
        // login successful if there's a  token in the response
        if (user.Data && user.Data['Token']) {
         // localStorage.setItem('Token', user.Data['Token']);
          this.commonserviceService.onProfileImageSelect.next(localStorage.setItem('ProfileUrl', user.Data['ProfileUrl']));

          this.commonserviceService.onProfileImageSelect.next(localStorage.setItem('ShortName', user.Data['ShortName']));
          // store user details and  token in local storage to keep user logged in between page refreshes
          localStorage.setItem('tenantData', JSON.stringify(user.Data));
          this.currentUserSubject.next(user);
          // set login sessionID :Priti(2-july-2021)EWM-1989
          localStorage.setItem('sessionId', uuid());
        }
        return user;
      }))


  }

  /*
  @Type: File, <ts>
  @Name: Uri Decoder
  @Who: Vipul Bansal
  @When: 27-Feb-2021
  @Why: EWM-1025
  @What: For calling the uri decoder service
   */

  decodeUri(formdata: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
   // headers = headers.append('ApiKey', 'qwert');
   // headers = headers.append('AgentId', '8e63bfaa-a258-48ef-838e-9daab7fb4cfd');
   headers = headers.append('ApiKey', this._appSetting.apikey);
   headers = headers.append('AgentId', this._appSetting.agentId);
    return this.http.post<any>(this.serviceListClass.decodeUri, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: Get Machine IP Address
  @Who: Vipul Bansal
  @When: 16-Mar-2021
  @Why: EWM-1168
  @What: For getting the machine IP address
   */

  getMachineIP() {
    this.http.get(this.serviceListClass.getIpAddress).subscribe(
      (data: any) => {
        return data.ip;
      },
      error => {
        return '';
      });
  }

  /*
  @Type: File, <ts>
  @Name: Forgot Password
  @Who: Vipul Bansal
  @When: 11-Feb-2021
  @Why: EWM-917
  @What: For calling the forgot password API by passing the email-id of the user.
   */

  resetPassword(formdata: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post<any>(this.serviceListClass.resetPassword, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: Forgot Password
  @Who: Vipul Bansal
  @When: 26-Feb-2021
  @Why: EWM-1046
  @What: For calling the forgot password API by passing the email-id of the user.
   */

  verifyResetPasswordLink(formdata: any) {
    return this.http.post<any>(this.serviceListClass.verifyResetLink, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: Forgot Password
  @Who: Vipul Bansal
  @When: 11-Feb-2021
  @Why: EWM-916
  @What: For calling the forgot password API by passing the email-id of the user.
   */

  forgotPassword(formdata: any) {
    // let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('ApiKey', 'qwert');
    // headers = headers.append('AgentId', '8e63bfaa-a258-48ef-838e-9daab7fb4cfd');

    return this.http.post<any>(this.serviceListClass.forgotPassword, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: logout
  @Who: Renu
  @When: 26-Oct-2020
  @Why: ROST-290
  @What: For destorying the user session in front end side
   */

  logout(isSessionExp) {
    if(isSessionExp===true){
      //  @Anup Singh For EWM-5430(redirect after session expire)
      window.location.href = this.logoutBaseUrl + '/login?domain=' + localStorage.getItem('tenantDomain') + '&redirectUrl=' + localStorage.getItem('redirectUrl') + '&sessionExpire=y';
    
    }else{
    // remove user from local storage to log user out
     window.location.href = this.logoutBaseUrl + '/login?domain=' + localStorage.getItem('tenantDomain') + '&logout=y';

    }
     localStorage.removeItem('currentUser');
     localStorage.removeItem('Token');
     localStorage.removeItem('EOHJTI'); //remove login sessionID for EOH token
     localStorage.removeItem('EOHToken');
     localStorage.removeItem('QuickTour');
     //localStorage.clear();
     this.cookieService.delete('userDomain');
     this.cookieService.delete('Token'); //remove login sessionID for EOH token
     this.cookieService.delete('EOHJTI');
     this.cookieService.delete('EOHToken');
     // remove login sessionID :Priti(2-july-2021)EWM-1989
     localStorage.removeItem('sessionId');
    
    this.currentUserSubject.next(null);
   
  }



  /*
 @Type: File, <ts>
 @Name: serverlogout
 @Who: Renu
 @When: 26-Oct-2020
 @Why: ROST-290
 @What: For destorying the user session and herewithin the token via Api
  */
  serverlogout(formData): Observable<any> {
    return this.http.post(this.serviceListClass.logoutUserAuth, formData).pipe(
      retry(1),
      catchError(handleError)
    );
    // let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('Authorization', `Bearer  ${localStorage.getItem('Token')}`);
    // return this.http.post(this.serviceListClass.logoutUserAuth, formData, { headers: headers }).pipe(
    //   retry(1),
    //   catchError(handleError)
    // ); 
  }

  /*
  @Type: File, <ts>
  @Name:createAccount function
  @Who: Renu
  @When: 17-nov-2020
  @Why: ROST-316
  @What: This Api service will check weather the email exist or not.(Not in Use)
  */

  // defaultLogin(): Observable<any> {
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Content-Type', 'application/json');
  //   return this.http.post(this.serviceListClass.defaultLoginUser, { username: 'test@gmail.com', password: this._encryptionDecryptionService.encryptData('1111') }, { headers: headers })
  //     .pipe(map(user => {
  //       localStorage.setItem('defaultToken', user['Data']['Token']);
  //     })
  //     )

  // }

  /*
   @(C): Entire Software
   @Type: isLoggedIn
   @Who: Mukesh kumar rai
   @When: 23-Sept-2020
   @Why:  ROST-205
   @What: This function check in local storage user name present or not.
   @Return: User login status

 */

  isLoggedIn() {
    return !!localStorage.getItem("currentUser");
  }

  /*
    @Type: createUninviteUser()
    @Who: Renu
    @When: 31-Dec-2020
    @Why:  -
    @What: This function create acc for uninvite users
  */
  createUninviteUser(formData): Observable<any> {
    return this.http.post(this.serviceListClass.uninvitedUser, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: validateInviteUser()
     @Who: Renu
     @When: 31-Dec-2020
     @Why:  ROST-816
     @What: This function validate invite Users
   */
  validateInviteUser(formData): Observable<any> {
    return this.http.post(this.serviceListClass.validateinvitedUser, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: createInviteUser()
     @Who: Renu
     @When: 04-Feb-2021
     @Why:  ROST-816
     @What: This function create acc for inviteD users
   */
  createInviteUser(formData): Observable<any> {
    return this.http.post(this.serviceListClass.invitedUser, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: loginExternalUser()
    @Who: Renu
    @When: 07-Feb-2021
    @Why:  EWM-816
    @What: This function for external user login
  */

  loginExternalUser(formdata) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post<any>(this.serviceListClass.externalLogin, formdata, { headers: headers })
      .pipe(map(user => {

        // login successful if there's a  token in the response
        if (user.Data && user.Data['Token']) {
          localStorage.setItem('Token', user.Data['Token']);
          this.commonserviceService.onProfileImageSelect.next(localStorage.setItem('ProfileUrl', user.Data['ProfileUrl']));
          this.commonserviceService.onProfileImageSelect.next(localStorage.setItem('ShortName', user.Data['ShortName']));
          // store user details and  token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.Data));
          this.currentUserSubject.next(user);
        }
        return user;
      }))
  }
  /*
  @Type: Refresh token after expiry
  @Who: priti
  @When: 24-Feb-2021
  @Why:  EWM-925
  @What: This function for Refresh token after expiry
  @modified by : renu/30/04/2021
*/
refreshToken() {
  let formdata = new FormData();
  formdata['Token'] = localStorage.getItem('Token');
  formdata['RefreshToken'] = localStorage.getItem('RefreshToken');
  formdata['Device'] = 'Web';
  return this.http.post<any>(this.serviceListClass.refreshTokenlogin, JSON.stringify(formdata)).pipe(tap((user: any) => {
    if (user.Data && user.Data['Token']) {
      localStorage.setItem('Token', user.Data['Token']);
      localStorage.setItem('RefreshToken', user.Data['RefreshToken']);
      //localStorage.setItem('currentUser', JSON.stringify(user.Data));
      this.currentUserSubject.next(user);
    }
    else {
      localStorage.setItem('currentUser', null);
      this.currentUserSubject.next(null);
    }
    return user.Data['Token'];
  }));
}

 
  /*
  @Type: File, <ts>
  @Name: loginDomain
  @Who: Renu
  @When: 24-feb-2021
  @Why: ROST-865
  @What: For login into system and stored the user information in localStorage in landing page
  @params:
          @domain: user domain
          @isRemember: boolean value (true/false)
          @device: web/Mobile
   */


  loginDomain( formdata) {
    this.httpClient = new HttpClient(this.handler);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Bypass':'1',
      'AgentId': '8e63bfaa-a258-48ef-838e-9daab7fb4cfd',
      'ApiKey': 'qwert'
    });
    let options = { headers: headers };
    return this.httpClient.post<any>(this.serviceListClass.loginDomain, formdata,options)
      .pipe(map(user => {
       
        // login successful if there's a  token in the response
        if (user.Data && user.Data['Token']) {
          localStorage.setItem('Token', user.Data['Token']);
          localStorage.setItem('RefreshToken', user.Data['RefreshToken']);
          localStorage.setItem('tenantDomain', user.Data.Tenants[0]['DomainName']);
        
          this.commonserviceService.onProfileImageSelect.next(localStorage.setItem('ProfileUrl', user.Data['ProfileUrl']));
          this.commonserviceService.onProfileImageSelect.next(localStorage.setItem('ShortName', user.Data['ShortName']));
          // store user details and  token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.Data));
          this.currentUserSubject.next(user);
        }
        return user;
      }))
  }

    /*
    @Type: File, <ts>
    @Name: getAccountPreference function
    @Who: Anup
    @When: 27-Dec-2021
    @Why: call Get method from services for showing data into grid.
    @What: .
  */
 getAccountPreference() {
  this._profileInfoService.getPreference().subscribe(
    (repsonsedata:any)=> {
      if (repsonsedata['HttpStatusCode'] == '200') {
        localStorage.setItem('animation', repsonsedata?.Data?.IsAnimation);
        localStorage.setItem('XeepAnimation', repsonsedata?.Data?.IsXeepAnimation);
        localStorage.setItem('UserTimezone', repsonsedata?.Data?.UserTimezone);
      }
    }, err => {
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
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
@who:Mukesh
@when:19-March-2021
@why:1201
@what:check Ip valodation
*/
  getIPValidation() {
    return this.http.get(this.serviceListClass.getIPValidation).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: orgToken()
     @Who: Renu
     @When: 08-Apr-2021
     @Why:  ROST-1295
     @What: when user choose org and data will be filtered accordingly
   */
     orgToken(formData): Observable<any> {
      return this.http.post(this.serviceListClass.orgToken, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }




/*
  @Type: File, <ts>
  @Name: getVerifyForgotEmail
  @Who: Nitin Bhati
  @When: 07-April-2021
  @Why: EWM-1306
  @What: get verify forgot email related info from APi
  */
  getVerifyForgotEmail(formData): Observable<any> {
    // let headers = new HttpHeaders();
    // headers = headers.append('Content-Type', 'application/json');
    return this.http.post(this.serviceListClass.verifyForgotEmail, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: checkUserNameorSendCode
  @Who: Nitin Bhati
  @When: 07-April-2021
  @Why: EWM-1306
  @What: for check user name is corrrect and send code  related info from APi
  */
  checkUserNameorSendCode(formData): Observable<any> {
    return this.http.post(this.serviceListClass.verifyuserName, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Type: File, <ts>
  @Name: sendVerificationCode
  @Who: Nitin Bhati
  @When: 07-April-2021
  @Why: EWM-1306
  @What: for send verification Email related info from APi
  */
  sendVerificationCode(formData): Observable<any> {
    return this.http.post(this.serviceListClass.sendVerificationCode, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   /*
  @Type: File, <ts>
  @Name: verifyCodeorReturnEmail
  @Who: Nitin Bhati
  @When: 07-April-2021
  @Why: EWM-1306
  @What: for verify code and return the email id related info from APi
  */
  verifyCodeorReturnEmail(formData): Observable<any> {
    return this.http.post(this.serviceListClass.validateVerificationCode, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


   /*
  @Type: File, <ts>
  @Name: setUninvitedPassword
  @Who: suika
  @When: 30-April-2021
  @Why: EWM-1425
  @What: For calling the create password API by passing the user-id of the user.
   */

  setUninvitedPassword(formdata: any) {
    
    return this.http.post<any>(this.serviceListClass.setUninvitedUserPassword, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }




  /*
    @Type: signUp()
    @Who: Suika
    @When: 30-May-2021
    @Why:  -
    @What: This function create acc for uninvite users
  */
 
 signUp(formData): Observable<any> {
  return this.http.post(this.serviceListClass.signUp, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}



  /*
  @Type: File, <ts>
  @Name: createPassword
  @Who: suika
  @When: 1-June-2021
  @Why: EWM-1425
  @What: For calling the create password API by passing the user-id and code of the user.
   */

  createPassword(formdata: any) {    
    return this.http.post<any>(this.serviceListClass.createpassword, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }


  updateQucikTour(formdata: any) {
    return this.http.post<any>(this.serviceListClass.updateQuickLink, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }

/*
     @Type: validateInviteUser()
     @Who: Renu
     @When: 31-Dec-2020
     @Why:  ROST-816
     @What: This function validate invite Users
   */
     getAuthenticationExternalUser(formData): Observable<any> {
      return this.http.post(this.serviceListClass.externalUser, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    /*
     @Type: validateInviteUser()
     @Who: Renu
     @When: 31-Dec-2020
     @Why:  ROST-816
     @What: This function validate invite Users
   */
  onLogout(formData): Observable<any> {
    return this.http.post(this.serviceListClass.logoutUrl, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  currentUrl;
  getUrl(e){
    this.currentUrl = e;
  }

  setUrl(){
    return this.currentUrl;
  }
  
}
