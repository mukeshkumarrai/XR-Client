import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ServiceListClass } from './sevicelist';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService implements TranslateLoader {
  constructor(private http: HttpClient, private serviceList: ServiceListClass) {
  }

  public getTranslation(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
              'Access-Control-Max-Age': '86400',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'App-Local-Time-Zone': Intl.DateTimeFormat().resolvedOptions().timeZone
    }); 
   // let ccc= this.comm
    const API =this.serviceList.language;
    // Return the Observable of the translation data
    return this.http.get(`${API}`,{ headers});
   
  } 
 
}
