import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitorsService {

  constructor(
    private http: HttpClient
  ) { 

  }
 
  getIpAddress() {
    return this.http
          .get('https://api.ipify.org/?format=json')
          .pipe(
            catchError(this.handleError)
          );
  } 

   getGEOLocation(ip) {

  let url = "https://api.ipgeolocation.io/ipgeo?apiKey=b81cc74e124247a0b99438bc3c22f79c&ip="+ip+"&fields=geo"; 
    return this.http
          .get(url)
          .pipe(
            catchError(this.handleError)
          );
  } 

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      console.error('An error occurred:', error.error.message);
    } else {

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    
    return throwError(
      'Something bad happened; please try again later.');
  }

}
