/**
   @(C): Entire Software
   @Type: ts
   @Name: auth.service.ts
   @Who: Mukesh Kumar rai
   @When: 23-Sept-2020
   @Why: ROST-205
   @What: This file contain user authentication functions
  */
import { Injectable, Injector, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAccessService } from '../data/user.acces.data';


const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
 
  
  userData: any;
  constructor(public router: Router, public ngZone: NgZone,  private http: HttpClient,private injector:Injector) { }
  /*
    @(C): Entire Software
    @Type: login
    @Who: Mukesh kumar rai
    @When: 23-Sept-2020
    @Why:  ROST-205
    @What: This function for user login.
    @Return: User login token

  */
    public get userAccessService(): UserAccessService { 
      return this.injector.get(UserAccessService);
  }
  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }
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
    return !!localStorage.getItem("SeesionUser");
  }
  /*
    @(C): Entire Software
    @Type: getUserAccesConrtrol
    @Who: Mukesh kumar rai
    @When: 23-Sept-2020
    @Why:  ROST-205
    @What: This function return user access control data.
    @Return: user access control data

  */
  getUserAccesConrtrol() {
    return this.userAccessService.Getuseraccess();
  }
  /*
    @(C): Entire Software
    @Type: getUserAccesConrtrol
    @Who: Mukesh kumar rai
    @When: 23-Sept-2020
    @Why:  ROST-205
    @What: This functionfor user logout.
    @Return:

  */
  singout() {
    localStorage.removeItem('SeesionUser');
    this.router.navigateByUrl('/');
  }
  
}
