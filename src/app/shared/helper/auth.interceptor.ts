/*
@(C): Entire Software
@Type: File, <ts>
@Name: auth.interceptor.ts
@Who: Renu
@When: 26-Oct-2020
@Why: ROST-290
@What: this file contains the auth interceptor realted data
*/
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpBackend } from '@angular/common/http';
import { LoginService } from '../../shared/services/login/login.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {  catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AppSettingsService } from '../services/app-settings.service';
import { CookieService } from 'ngx-cookie-service';
import { EncryptionDecryptionService } from '../services/encryption-decryption.service';
//import {JwtHelperService} from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorsService implements HttpInterceptor {
 public agentId: string;
 public apiKey: string;
 public  clientId: string;
  // for avoiding entering an infinite loop
  private refreshTokenInProgress = false;
    // Refresh Token Subject tracks the current token, or is null if no token is currently
    // available (e.g. refresh pending).
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );
/*
@Type: File, <ts>
@Name: constructor function
@Who: Renu
@When: 26-Oct-2020
@Why: ROST-290
@What: this function contains the service file used for login and routing file for redirection
*/
  constructor(private authenticationService: LoginService, private router: Router,  public _encryptionDecryptionService: EncryptionDecryptionService,
    private appSettingsService:AppSettingsService,private cookieService: CookieService,private httpClient: HttpClient,private injector: Injector) {
 this.agentId=this.appSettingsService.agentId;
 this.apiKey=this.appSettingsService.apikey;


  }

 /*
@Type: File, <ts>
@Name: serviceListClass
@Who: Renu
@When: 26-nov-2020
@Why: ROST-405
@What: this creates serviceclasslist for getting url's property on login service to avoid cyclic dependency.
 */

// public get serviceListClass(): ServiceListClass {
//   return this.injector.get(ServiceListClass);
// }

// public get jwtHelperService(): JwtHelperService {
//   return this.injector.get(JwtHelperService);
// }
  /*
  @Type: File, <ts>
  @Name: intercept function
  @Who: Renu
  @When: 26-Oct-2020
  @Why: ROST-290
  @What: To set the Authorization header for each web service call
  */

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = this.authenticationService.currentUserValue;
    let imageUploadStatus = localStorage.getItem('Image');

    //  @Anup Singh For EWM-5430(redirect after session expire)
    localStorage.setItem('redirectUrl', window.location.href);
    //
    if (request.headers.get('EOHAuth') === 'EOH') {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer  ${localStorage.getItem('EOHToken')}`,
          "X-Er-Type": localStorage.getItem('EOHJTI'),
          'App-Local-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone

        }
      });
    }else if (currentUser) {
      const Xkey = this.securty();
        if (imageUploadStatus === '1') {

          request = request.clone({
           // withCredentials: true, // Add the withCredentials option to the request
            setHeaders: {
              Authorization: `Bearer  ${localStorage.getItem('Token')}`,
              'Access-Control-Max-Age': '86400',
              'Xkey': Xkey,
              'clientId': this.clientId,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'App-Local-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
             
            }
          });
          localStorage.removeItem("Image");
        } else {

          request = request.clone({
            //   withCredentials: true, // Add the withCredentials option to the request
            setHeaders: {
              Authorization: `Bearer  ${localStorage.getItem('Token')}`,
              'Content-Type': 'application/json',
              'Access-Control-Max-Age': '86400',
              'Xkey': Xkey,
              'clientId': this.clientId,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'App-Local-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
            }
          });
        }
      } else if (currentUser === null) {
        if (imageUploadStatus === '1') {
          request = request.clone({
            setHeaders: {
                  AgentId: this.agentId,
                  ApiKey:  this.apiKey
            }
          });
          localStorage.removeItem("Image");
        } else {
          request = request.clone({
            setHeaders: {
              AgentId:  this.agentId,
              ApiKey:  this.apiKey,
              'Content-Type': 'application/json',
              'App-Local-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
            }
          });

        }
    }  else {
     this.authenticationService.logout(false);
     this.authenticationService.serverlogout(1);
     this.router.navigate(['/login']);

    }

    return next.handle(request).pipe(tap(() => { },(error => {
      if (
          request.url.includes("refreshtoken") ||
          request.url.includes("login")
      ) {

          if (request.url.includes("refreshtoken")) {

              this.authenticationService.logout(false);
          }

          return Observable.throwError(error);
      }
       if (error.StatusCode !== 401) {
              return Observable.throwError(error);
          }

          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => next.handle(this.addAuthenticationToken(request)))
            );

        } else {
          this.refreshTokenInProgress = true;
          this.refreshTokenSubject.next(null);
          return this.authenticationService.refreshToken()
          .pipe(
            switchMap((token: any) => {
                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(token);

                  return next.handle(this.addAuthenticationToken(request));

              }),catchError(err => {
               // this.authenticationService.logout(false);
                return throwError(err);
                })
                ).subscribe(r => r);
    }
  })))
  }

  addAuthenticationToken(request: HttpRequest<any>) {
    location.reload();
    let imageUploadStatus = localStorage.getItem('Image');
    if (imageUploadStatus === '1') {
                    request = request.clone({
                      setHeaders: {
                        Authorization: `Bearer  ${localStorage.getItem('Token')}`,
                        'App-Local-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
                      }
                    });
                    localStorage.removeItem("Image");
                  } else {

                    request = request.clone({
                        // withCredentials: true, // Add the withCredentials option to the request
                      setHeaders: {
                        Authorization: `Bearer  ${localStorage.getItem('Token')}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Max-Age': '86400',
                        'App-Local-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
                      }
                    });
                  }
                  return request;

}
getCookie(email:string) {
  const cookieValue = this.cookieService.get(email);
  console.log('Cookie Value:',  JSON.stringify(cookieValue));
  return cookieValue ? cookieValue : '';
}

private securty(): string { 
  const storedUserInfo = localStorage.getItem('currentUser'); 
  if(storedUserInfo){
    const currentDate = new Date(); // Format to UTC string
    const addMinutes = 3;
    const futureDate = new Date(currentDate);
    futureDate.setMinutes(currentDate.getMinutes() + addMinutes);
    const futureDateISOString = futureDate.toISOString(); // Convert to ISO string
    let userInfo = JSON.parse(storedUserInfo);
    this.clientId = userInfo?.UserId;
    const sessionID= userInfo?.SessionId;
     let key=sessionID+","+futureDateISOString;
    return  this._encryptionDecryptionService.encryptData(key)
  }else {
    return '';
  }
  
}   
}
