/**
   @(C): Entire Software
   @Type: ts
   @Name: auth.interceptor.ts
   @Who: Mukesh Kumar rai
   @When: 29-Sept-2020
   @Why: ROST-208
   @What: This file add header in each http call
  */
import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError,EMPTY  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginService } from '../services/login/login.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionExpiredLoginComponent } from '@app/modules/sign-in/session-expired-login/session-expired-login.component';
import { AlertDialogComponent } from '../modal/alert-dialog/alert-dialog.component';
import { CommonserviceService } from '../services/commonservice/commonservice.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  dirctionalLang;
  stopThisRequest:boolean=false;
  constructor(private authenticationService: LoginService, public router: Router, public dialog: MatDialog, private commonserviceService: CommonserviceService) { }

  /*
     @(C): Entire Software
     @Type: login
     @Who: Mukesh kumar rai
     @When: 9-Sept-2020
     @Why:  ROST-208
     @What: This function for http call error.
     @Return:
*/

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return next.handle(request).pipe(catchError(err => {    
  //     if (err.status === 401) {
  //       // auto logout if 401 response returned from api
  //       // commented by priti @ 24-feb-2021 for EWM-925
  //       this.authenticationService.logout(false);
  //       //location.reload(true);
  //       return throwError(err.error);
  //     }
  //     if (err.status === 403) {
  //       this.router.navigate(['/unauthorized-access']);
  //     }
  //     if (err.status === 419) {
  //       const message = ``;
  //       const title = 'label_disabled';
  //       const subtitle = 'label_folderName';
  //       const dialogData = new ConfirmDialogModel(title, subtitle, message);
  //       const dialogRef = this.dialog.open(SessionExpiredLoginComponent, {
  //        data: new Object(),
  //        panelClass: ['xeople-modal', 'add_sessionExpValidation','animate__animated', 'animate__zoomIn'],
  //        disableClose: true,
  //       });
  //       let dir:string;
  //       dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  //       let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  //       for(let i=0; i < classList.length; i++){
  //         classList[i].setAttribute('dir', this.dirctionalLang);
  //        }
  //       dialogRef.afterClosed().subscribe(res => {  
  //         this.authenticationService.logout(false);
  //         // this.router.navigate(['/login']);
  //    })
  //     }

  //     // if (err.status === 200) {
  //     //   alert("login")
  //     //   this.router.navigate(['/login']);
  //     //  // alert('400 error');
  //     // }
  //     const error = err.error.message || err.statusText;
  //     return throwError(error);
  //   }))
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
       //  console.log('This is client side error');
          errorMsg = `Error: ${error.error.message}`;
        } else {
         // console.log('This is server side error');
          errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
       // console.log(errorMsg);
        if (error.status === 401) {
          this.authenticationService.logout(true);
          return throwError(error);
        }
        if (error.status === 403) {
          this.router.navigate(['/unauthorized-access']);
        }
        if (error.status === 419) {
          if (this.stopThisRequest==true) {
            return EMPTY;
          }
        
        
          const message = ``;
          const title = 'label_disabled';
          const subtitle = 'label_folderName';
          const dialogData = new ConfirmDialogModel(title, subtitle, message);
          const dialogRef = this.dialog.open(SessionExpiredLoginComponent, {
            data: new Object(),
            panelClass: ['xeople-modal', 'add_sessionExpValidation', 'animate__animated', 'animate__zoomIn'],
            disableClose: true,
          });
          let dir: string;
          dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
          let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
          for (let i = 0; i < classList.length; i++) {
            classList[i].setAttribute('dir', this.dirctionalLang);
          }
          dialogRef.afterClosed().subscribe(res => {
            this.stopThisRequest=true;
            this.authenticationService.logout(false);
            // this.router.navigate(['/login']);
          })
        }
        //       if (error.status === 400) {
        //         let data = {};
        //       data = {
        //       reason: error && error.error && error.error.reason ? error.error.reason : '',
        //       status: error.status
        //       };
        //         return throwError(data);
        //  }
         //this.logError(error);
        return throwError(error);
      }));
  }
/*
     @Type: logError
     @Who: Renu
     @When: 5-Sept-2021
     @Why:  ROST-8235 ROST-8659
     @What: to log all error which caught by status
     @Return:
*/
  logError(error) {
    let obj={};
    let logedInUser= localStorage.getItem('currentUser');
    let UserName =logedInUser['FirstName']+' '+logedInUser['LastName'];
    obj['tenantDomain']=localStorage.getItem('tenantDomain');
    obj['currentUser']=UserName;
    obj['InputValue']=JSON.stringify(error);
    // this.commonserviceService.logErrorApi(obj).subscribe((data: any) => {
    //   ((res: any) => {
    //     // console.log('res',res);
    // })
    // }, (error) => {
    // });
  }

}
