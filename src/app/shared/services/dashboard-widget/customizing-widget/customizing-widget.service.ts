 /*
  @Type: File, <ts>
  @Name: customizing-widget.service.ts
  @Who: Suika
  @When: 15-July-2021
  @Why: ROST-2009
  @What: Api call for Listing of dashbord widget data
  */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../../shared/helper/exception-handler';
import { ServiceListClass } from '../../sevicelist';
@Injectable({
  providedIn: 'root'
})
export class CustomizingWidgetService {

  constructor(private http: HttpClient, private serviceListClass: ServiceListClass) { }

  /*
  @Type: File, <ts>
  @Name: customizing-widget.service.ts
  @Who: Suika
  @When: 15-July-2021
  @Why: ROST-2009
  @What: Api call for Listing of dashbord widget data
  */
  getdashboardWidgetList(pagneNo, pagesize) {
    return this.http.get(this.serviceListClass.dashboardWidgetList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize).pipe(
      retry(1),
      catchError(handleError)
    );
  }


   /*
  @Type: File, <ts>
  @Name: customizing-widget.service.ts
  @Who: Suika
  @When: 15-July-2021
  @Why: ROST-2009
  @What: Update user dashboard Information related info from APi
  */

 dashboardConfigure(formData): Observable<any> {
  return this.http.post(this.serviceListClass.dashboardConfigure, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
  @Type: File, <ts>
  @Name: getUserdashboardjob
  @Who: Nitin Bhati
  @When: 03-05-2023
  @Why: EWM-12199
  @What: Api call for user dashboard JOb data
  */
  getUserdashboardjob(datalimit, expiredays) {
    return this.http.get(this.serviceListClass.getUserDashboardjob+'?datalimit='+datalimit+'&expiredays='+expiredays).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Type: File, <ts>
  @Name: getUserdashboardActivity
  @Who: Nitin Bhati
  @When: 03-05-2023
  @Why: EWM-12211
  @What: Api call for user dashboard Activity data
  */
  getUserdashboardActivity(datalimit, expiredays) {
    return this.http.get(this.serviceListClass.getUserDashboardActivity+'?limit='+datalimit+'&noDays='+expiredays).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   /*
  @Type: File, <ts>
  @Name: getUserdashboardActivity
  @Who: Nitin Bhati
  @When: 04-05-2023
  @Why: EWM-12205
  @What: Api call for user dashboard My Inbox data
  */
  getUserdashboardMyInbox(datalimit, expiredays) {
    return this.http.get(this.serviceListClass.getUserdashboardMyInbox+'?limit='+datalimit+'&noDays='+expiredays).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getUserdashboardAction
  @Who: Nitin Bhati
  @When: 04-05-2023
  @Why: EWM-12194,EWM-12218
  @What: Api call for user dashboard Action data
  */
  getUserdashboardAction(datalimit, expiredays) {
    return this.http.get(this.serviceListClass.getUserdashboardAction+'?ActionDurationDays='+expiredays+'&LastActionListNoOfRecords='+datalimit).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getUserdashboardCandidate
  @Who: Nitin Bhati
  @When: 04-05-2023
  @Why: EWM-12193,EWM-12223
  @What: Api call for user dashboard Action data
  */
  getUserdashboardCandidate(datalimit, expiredays) {
    return this.http.get(this.serviceListClass.getUserdashboardCandidate+'?limit='+datalimit+'&noDays='+expiredays).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getDasboardAll() {
    return this.http.get(this.serviceListClass.getDasboardAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }
 
}
