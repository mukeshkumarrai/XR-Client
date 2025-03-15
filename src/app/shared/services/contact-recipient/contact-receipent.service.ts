/*
   @Type: File, <ts>
    @Name: contact-receipent.service.ts
    @Who: Renu
    @When: 25-March-2021
    @Why: EWM-1181
    @What: service for contact-receipent Selection option
*/

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../helper/exception-handler';
import { ServiceListClass } from '../sevicelist';

@Injectable({
  providedIn: 'root'
})
export class ContactReceipentService {

  constructor(private http:HttpClient,private serviceListClass:ServiceListClass) { }

/*
@Type: File, <ts>
@Name: addImageUploadFile Function
@Who:  Renu
@When: 25-Mar-2021
@Why: ROST-1181
@What: Api call for contact receipent via first Name, last Name or email Id
*/

getUserDirectoryList(searchVal:any,Isuser:boolean,usrType:string,recordFor:string) {
  if(Isuser){
  return this.http.get(this.serviceListClass.getUserDirectory + '?Search=' + searchVal).pipe(
    retry(1),
    catchError(handleError)
  );
  }
  else{
    let orgId=localStorage.getItem('OrganizationId').toString();
    return this.http.get(this.serviceListClass.getInviteTeammate + '?Search=' + searchVal+'&OrganizationId='+orgId+'&userType='+usrType +'&recordFor='+recordFor).pipe(
      retry(1),
      catchError(handleError)
    );
  }
}


/*
  @Type: File, <ts>
  @Name: getUserInviteList
  @Who: Suika
  @When: 12-July-2021
  @Why: EWM-1998 EWM-2036
  @What: user invitation list
  */

 getUserInviteList(searchVal:any,Isuser:boolean,usrType:string) {
  return this.http.get(this.serviceListClass.userInvitationList + '?RecordFor='+ usrType + '&Search=' + searchVal).pipe(
    retry(1),
    catchError(handleError)
  );
}


/*
  @Type: File, <ts>
  @Name: getUserInviteListGroupMember
  @Who: Nitin Bhati
  @When: 17-Jan-2022
  @Why: EWM-4676
  @What: user invitation list
  */
      // who:maneesh,what:ewm-11940 for by pass paging true,when:19/04/2023
  getUserInviteListGroupMember(searchVal:any,Isuser:boolean,usrType:string) {
    return this.http.get(this.serviceListClass.userGroupmemberAll + '?Search='+ searchVal +'&ByPassPaging=true').pipe(
      retry(1),
      catchError(handleError)
    );
  }

}
