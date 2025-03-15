/* 
@(C): Entire Software
@Type: File, <ts>
@Name: commonserverside.ts
@Who: Renu
@When: 01-Nov-2020
@Why: ROST-254
@What: Service Api's
 */
import { FormGroup, AbstractControl } from '@angular/forms';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ServiceListClass } from '../../shared/services/sevicelist';

@Injectable ()
export class ValidateCode {
  private timeout;
  constructor(private http:HttpClient,private serviceListClass:ServiceListClass) 
  {
  }

/* 
@Type: File, <ts>
@Name:  checkdDomainDuplicay function
@Who: Renu
@When:  01-Nov-2020
@Why: ROST-253
@What: to check domain entered already exist or not
@params: @domainname
 */
  checkdDomainDuplicay(domain): Promise<{ [key: string]: boolean }> {
    clearTimeout(this.timeout);
    //const value = postion.value;
    if (!domain) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      this.timeout = setTimeout(() => {
        this.http.get<any>(this.serviceListClass.checkDomainAvailable+`?domainname=`+domain.value)
          .subscribe(flag => {
              if (flag['Status']==false) {
                resolve({'codeTaken': true});
              } else {
                resolve(null);
              }
            },
            (err) => {
              //console.warn(err);
            }
          );
      }, 200);
    });
  }

/* 
@Type: File, <ts>
@Name:  checkdUsergrpDuplicay function
@Who: Renu
@When:  01-Nov-2020
@Why: ROST-253
@What: to check User Group entered already exist or not
@params: @userGroup
*/

  checkdUsergrpDuplicay(userGroup): Promise<{ [key: string]: boolean }> {
    clearTimeout(this.timeout);
  
    //const value = postion.value;
    if (!userGroup) {
      return Promise.resolve(null);
    }
   return new Promise((resolve, reject) => {
      this.timeout = setTimeout(() => {
        this.http.get<any>(this.serviceListClass.userGrpExists+`?UserGroupName=`+userGroup.value)
          .subscribe(flag => {
              if (flag['Status']==false) {
                resolve({'codeTaken': true});
              } else {
                resolve(null);
              }
            },
            (err) => {
             // console.warn(err);
            }
          );
      }, 200);
    });
  }

  /* 
@Type: File, <ts>
@Name:  checkUserRoleDuplicay function
@Who: Renu
@When:  26-DEC-2020
@Why: ROST-485
@What: to check User Role entered already exist or not
@params: @userRole
*/

checkUserRoleDuplicay(userRole): Promise<{ [key: string]: boolean }> {
  clearTimeout(this.timeout);
  //const value = postion.value;
  if (!userRole) {
    return Promise.resolve(null);
  }
 return new Promise((resolve, reject) => {
    this.timeout = setTimeout(() => {
      this.http.get<any>(this.serviceListClass.userRoleExists+`?RoleName=`+userRole.value)
        .subscribe(flag => {
            if (flag['Status']==false) {
              resolve({'codeTaken': true});
            } else {
              resolve(null);
            }
          },
          (err) => {
            //console.warn(err);
          }
        );
    }, 200);
  });
}


 /* 
@Type: File, <ts>
@Name:  checkUserRoleDuplicay function
@Who: Nitin Bhati
@When:  5-Jan-2021
@Why: ROST-487
@What: to check sms template entered already exist or not
@params: @smstemplate
*/

checkSmsTitleDuplicay(userSms): Promise<{ [key: string]: boolean }> {
  clearTimeout(this.timeout);
  //const value = postion.value;
  if (!userSms) {
    return Promise.resolve(null);
  }
 return new Promise((resolve, reject) => {
    this.timeout = setTimeout(() => {
      this.http.get<any>(this.serviceListClass.userSmsExists+`?Title=`+userSms.value)
        .subscribe(flag => {
            if (flag['Status']==false) {
              resolve({'codeTaken': true});
            } else {
              resolve(null);
            }
          },
          (err) => {
            //console.warn(err);
          }
        );
    }, 200);
  });
}

 /*  @Who: Adarsh @When: 13-dec-2021 @Why: EWM-3944 (add remove animations)*/
//  onActiveAnimation(outlet:any){
//   const getAnimtion = localStorage.getItem('animation');
//   if(getAnimtion === '1'){
//     return outlet.activatedRoute;
//   }
//   else {return ;}
// }

}