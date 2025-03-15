import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-settings.service';
import { ServiceListClass } from '../sevicelist';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '@app/shared/helper/exception-handler';


@Injectable({
  providedIn: 'root'
})
export class ShortUrlService {
  public agentId: string;
  public apiKey: string;

  constructor(private http: HttpClient,private appSettingsService:AppSettingsService, private serviceListClass: ServiceListClass) {
    this.agentId=this.appSettingsService.agentId;
    this.apiKey=this.appSettingsService.apikey;
   }

  shortenUrl(formData): Observable<any>{
    return this.http.post(this.serviceListClass.encodeUri, formData).pipe(
      retry(1),
      catchError(handleError)
    );
    // return this.http.post<{ link: string }>(
    //   this.serviceListClass.encodeUri,
    //   { CompleteUrl: longUrl }
    // ).pipe( retry(1),catchError(handleError));
  }
}
