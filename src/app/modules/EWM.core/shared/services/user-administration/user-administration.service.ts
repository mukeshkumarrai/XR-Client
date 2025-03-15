/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: user-administration.service.ts
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-428
  @What: Service Api's
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, tap,retryWhen } from 'rxjs/operators';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class UserAdministrationService {
  /*
    @Type: File, <ts>
    @Name: user-administration.service.ts
    @Who: Nitin Bhati
    @When: 25-Nov-2020
    @Why: ROST-428
    @What: constructor function
  */

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }

  /*
  @Type: File, <ts>
  @Name: getOrganizationInfo
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-428
  @What: get organization related information from Api
  */
  getOrganizationInfo(pagesize, pagneNo, orderBy, searchValue) {
    return this.http.get(this.serviceListClass.organizationList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchValue +'&ByPassPaging=true').pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: AddOrganization
    @Who: Nitin Bhati
    @When: 25-Nov-2020
    @Why: ROST-428
    @What: Update Organization Information related info from APi
  */
  AddOrganization(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addOrganization, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: updateOrganization
    @Who: Nitin Bhati
    @When: 25-Nov-2020
    @Why: ROST-428
    @What: Update Organization Information related info from APi
  */
  updateOrganization(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateOrganization, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Type: File, <ts>
  @Name: checkDuplicityOrganizationKey
  @Who: Nitin Bhati
  @When: 11-Nov-2021
  @Why: EWM-3710
  @What: check Organization duplicay
  */
  checkDuplicityOrganizationKey(value:any) {
    return this.http.get(this.serviceListClass.checkDuplicityKey + '?value=' + value).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getAdministratorsInfo
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-428
  @What: get adminstrator related information from Api
  */
  getAdministratorsInfo(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.administratorsList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: deleteAdministratorsInfo
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-428
  @What: get delete Organization related information from Api
  */
  deleteAdministratorsInfo(formData) {
    return this.http.post(this.serviceListClass.deleteAdministrators, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getSiteDomainInfo
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-428
  @What: get Site Domain related information from Api
  */
  getSiteDomainInfo() {
    return this.http.get(this.serviceListClass.siteDomainList).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: Update Site Domain
  @Who: Naresh Singh
  @When: 18-Jan-2021
  @Why: ROST-715
  @What: Update Site Domain information from Api
  */
  updateSiteDomainInfo(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateSiteDomain, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
  @Type: File, <ts>
  @Name: getSearchAdmin
  @Who: Nitin Bhati
  @When: 29-Nov-2020
  @Why: ROST-428
  @What: get adminstrator search related information from Api
  */
  getSearchAdmin(formData) {
    return this.http.get(this.serviceListClass.searchAdminList + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: AddAdministratorsUser
    @Who: Nitin Bhati
    @When: 25-Nov-2020
    @Why: ROST-428
    @What: Add AdministratorsUser Information related info from APi
  */
  AddAdministratorsUser(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addAdministratorsUser, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: getOrganizationInfo
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-428
  @What: get searched organization related information from Api
  @param: searchVal
  */
  getOrganizationSerachList(searchVal) {
    return this.http.get(this.serviceListClass.organizationList + `?search=` + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getAdministratorsInfo
  @Who: Nitin Bhati
  @When: 25-Nov-2020
  @Why: ROST-428
  @What: get adminstrator related information from Api
  */
  getAdministratorsSearch(searchVal) {
    return this.http.get(this.serviceListClass.administratorsList + `?search=` + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getCountryInfo(pagneNo, pagesize) {
    return this.http.get(this.serviceListClass.countryList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getSubDomainAvailable
  @Who: Renu
  @When: 13-Feb-2021
  @Why: ROST-866
  @What: get Site Domain related information from Api for redirection of user after changing domain
  */
  getSubDomainAvailable(formdata) {
    return this.http.get(this.serviceListClass.getDomainAvailable + '?domainname=' + formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchCountryInfoSearch.service.ts
  @Who: Nitin Bhati
  @When: 20-March-2021
  @Why: EWM-1205
  @What: get country search related info from APi
  */
  fetchCountryInfoSearch(search:string) {
    return this.http.get(this.serviceListClass.countryList + '?search=' + search).pipe(
      retry(1),
      catchError(handleError)
    );
  }

    /*
  @Type: File, <ts>
  @Name: getEmailForwardingh.service.ts
  @Who: Adarsh singh
  @When: 02-Feb-2021
  @Why: EWM.4462.EWM-4968
  @What: get email forwarding api
  */
 getEmailForwarding() {
  return this.http.get(this.serviceListClass.getEmailForwarding).pipe(
    retry(1),
    catchError(handleError)
  );
}

   /*
  @Type: File, <ts>
  @Name: updatEmailForwardingh.service.ts
  @Who: Adarsh singh
  @When: 03-Feb-2021
  @Why: EWM.4462.EWM-4968
  @What: update email forwarding api
  */
 updateEmailForwarding(formData:any) {
  return this.http.post(this.serviceListClass.updateEmailForwarding,formData).pipe(
    retry(1),
    catchError(handleError)
  );
}


/*
    @Type: File, <ts>
    @Name: getAssessmentList
    @Who: Renu
    @When: 05-March-2021
    @Why: ROST-1732 EWM-5339
    @What: get assessment list data
*/
    getAssessmentList(formData:any) {
      return this.http.post(this.serviceListClass.getAssessmentList,formData).pipe(
        retry(1),
        catchError(handleError)
      );
     
    }

    /*
    @Type: File, <ts>
    @Name: fetchAssessmentRelatedTo
    @Who: Renu
    @When: 08-March-2021
    @Why: ROST-1732 EWM-5427
    @What: get assessment related To List data
*/
  
    fetchAssessmentRelatedTo() {
      return this.http.get(this.serviceListClass.getAssessmentRelatedTo ).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    
  /*
  @Type: File, <ts>
  @Name: getAssessmentInfoBYId
  @Who: Renu
  @When: 09-March-2022
  @Why: EWM-1732 EWM-5427
  @What: get assesssment info data by Id
  */
  getAssessmentInfoBYId(Id:Number) {
    return this.http.get(this.serviceListClass.getAssessmentById + '?id=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getAssessmentDetailsFilter
  @Who: Suika
  @When: 02-June-2022
  @Why: EWM-5334 EWM-7001
  @What: get assesssment info details 
  */
 getAssessmentDetailsFilter(pagesize, pagneNo, sortingValue,searchVal,filterConfig) {
  return this.http.get(this.serviceListClass.getAssessmentAllWithoutFilter + '?PageSize=' + pagesize+ '&PageNumber=' + pagneNo+ '&OrderBy=' + sortingValue+ '&search=' + searchVal+ '&RelatedToId=' + filterConfig).pipe(
    retry(1),
    catchError(handleError)
  );
}

      
  /*
  @Type: File, <ts>
  @Name: getAssessmentVersionById
  @Who: Renu
  @When: 09-March-2022
  @Why: EWM-1732 EWM-5427
  @What: get assesssment version data by Id
  */
  getAssessmentVersionById(pageSize:Number,pageNo:Number,sortingValue:String,searchVal:String,Id:Number) {
    return this.http.get(this.serviceListClass.getAssessmentVersionById + '?Id=' + Id+'&PageSize='+pageSize+'&PageNumber='+pageNo+'&OrderBy='+sortingValue+'&search='+searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
    @Type: File, <ts>
    @Name: deleteAssessment
    @Who: Renu
    @When: 10-March-2022
    @Why: EWM-1732 EWM-5427
    @What: Delete assessment data from APi
    */

    deleteAssessment(formdata: any): Observable<any> {
      return this.http.request('delete', this.serviceListClass.deleteAssessment, { body: formdata })
        .pipe(
          retry(1),
          catchError(handleError)
        )
    }
    
/*
  @Type: File, <ts>
  @Name: checkAssessmentName
  @Who: Renu
  @When: 17-March-2022
  @Why: EWM-5427 EWM-5467
  @What: check assesssment name duplicacy
*/
  checkAssessmentName(Id:Number,Name:String) {
    return this.http.get(this.serviceListClass.checkAssessmentDuplicacy + '?value=' + Name+'&Id='+Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: addAssementStep
  @Who: Renu
  @When: 17-March-2022
  @Why: EWM-5427 EWM-5467
  @What: save step 1 data for assement
*/
addAssementStep(FormGroup) {
  return this.http.post(this.serviceListClass.addAssementStep ,FormGroup).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
  @Type: File, <ts>
  @Name: addAssementQuestionsStep
  @Who: Renu
  @When: 17-March-2022
  @Why: EWM-5427 EWM-5467
  @What: save step 2 data for assement
*/
addAssementQuestionsStep(FormGroup) {
  return this.http.post(this.serviceListClass.addAssementQues ,FormGroup).pipe(
    retry(1),
    catchError(handleError)
  );
}
  
/*
  @Type: File, <ts>
  @Name: addAssementGuidelinesStep
  @Who: Renu
  @When: 17-March-2022
  @Why: EWM-5427 EWM-5467
  @What: save step 3 data for assement
*/
addAssementGuidelinesStep(FormGroup) {
  return this.http.post(this.serviceListClass.addAssementGuidLines ,FormGroup).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
   @Type: File, <ts>
    @Name: getOrganizationById
    @Who: Adarsh singh
    @When: 06-APRIL-2022
    @Why: EWM 1581 EWM 5862
    @What: get Organization Information by id 
  */
  getOrganizationById(id): Observable<any> {
    return this.http.get(this.serviceListClass.getOrganizationById+'?organizationId='+ id).pipe(
      retry(1),
      catchError(handleError)
    );
  }


   /*
  @Type: File, <ts>
  @Name: getStep4Info
  @Who: Renu
  @When: 20-Aprl-2022
  @Why: ROST-5340 ROST-5485
  @What: get Step4 list data
  */
  getStep4Info(Id:any,patternId:any) {
    return this.http.get(this.serviceListClass.getStep4List + '?id='+Id+'&assessmentpatternid='+patternId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
    @Type: File, <ts>
    @Name: deleteAssessmentStep4
    @Who: Renu
    @When: 24-March-2022
    @Why: EWM-5340 EWM-5485
    @What: Delete assessment data from APi at step 4
    */

    deleteAssessmentStep4(formdata: any): Observable<any> {
      return this.http.request('delete', this.serviceListClass.deleteAssessmentStep4, { body: formdata })
        .pipe(
          retry(1),
          catchError(handleError)
        )
    }

    /*
    @Type: File, <ts>
    @Name: getStep1InfoById
    @Who: Renu
    @When: 24-March-2022
    @Why: EWM-5340 EWM-5485
    @What: get Step Info By Id
    */

    getStep1InfoById(formData) {
      return this.http.get(this.serviceListClass.getStep1ById + formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }
    
    
    /*
    @Type: File, <ts>
    @Name: getStep3InfoById
    @Who: Renu
    @When: 24-March-2022
    @Why: EWM-5340 EWM-5485
    @What: get Step  3 Info By Id
    */

    getStep3InfoById(formData) {
      return this.http.get(this.serviceListClass.getStep3ById + formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    /*
  @Type: File, <ts>
  @Name: addReviewStep
  @Who: Renu
  @When: 17-March-2022
  @Why: EWM-5427 EWM-5467
  @What: save step 4 data for assement
*/
addReviewStep(FormGroup) {
  return this.http.post(this.serviceListClass.addReviewSection ,FormGroup).pipe(
    retry(1),
    catchError(handleError)
  );
}


    /*
  @Type: File, <ts>
  @Name: updateSectionName
  @Who: Renu
  @When: 17-March-2022
  @Why: EWM-5427 EWM-5467
  @What: save step 2update section Name
*/
updateSectionName(FormGroup) {
  return this.http.post(this.serviceListClass.updateSectionName ,FormGroup).pipe(
    retry(1),
    catchError(handleError)
  );
}
 /*
    @Type: File, <ts>
    @Name: getStep2InfoById
    @Who: Renu
    @When: 24-March-2022
    @Why: EWM-5340 EWM-5485
    @What: get Step 2 Info By Id
    */

    getStep2InfoById(formData) {
      return this.http.get(this.serviceListClass.getStep2List + formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }


    /*
    @Type: File, <ts>
    @Name: deleteQuestion
    @Who: Renu
    @When: 10-March-2022
    @Why: EWM-1732 EWM-5427
    @What: Delete question from add questions/sections
    */

    deleteQuestion(formdata: any): Observable<any> {
      return this.http.request('delete', this.serviceListClass.getStep2deleteQues, { body: formdata })
        .pipe(
          retry(1),
          catchError(handleError)
        )
    }

     /*
    @Type: File, <ts>
    @Name: deleteAssessmentDraft
    @Who: Renu
    @When: 26-July-2022
    @Why: -
    @What: Delete assessment data from APi in draft case
    */

    deleteAssessmentDraft(formdata: any): Observable<any> {
      return this.http.request('delete', this.serviceListClass.getAssessmentDeleteDraft, { body: formdata })
        .pipe(
          retry(1),
          catchError(handleError)
        )
    }

    getTenantBasedOrganizationInfo(pagesize, pagneNo, orderBy, searchValue) {
      return this.http.get(this.serviceListClass.getTenantBasedOrg + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchValue).pipe(
        retry(1),
        catchError(handleError)
      );
    }


    getUserByOrganization(pagesize, pagneNo, searchValue,RecordFor,OrganizationId) {
      return this.http.get(this.serviceListClass.getUserOrganizationList + '?RecordFor='+ RecordFor+'&OrganizationId='+OrganizationId+ '&PageNumber=' + pagneNo + '&PageSize=' + pagesize  + '&search=' + searchValue ).pipe(
        retry(1),
        catchError(handleError)
      );
    }
}
