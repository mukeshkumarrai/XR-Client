import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { catchError, map, retry } from 'rxjs/operators';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }

 /*  @Name: getleadworkflowList  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What:get workflow list info*/
        
    public getleadworkflowList(state: State, searchValue): Observable<GridDataResult> {
          let queryStr = `${toDataSourceRequestString(state)}`;
          if (searchValue) {
            queryStr += '&search=' + searchValue;
          }
          return this.http
            .get(`${this.serviceListClass.getLeadWorkflowAll}?${queryStr}`)
            .pipe(
              map(response => (<GridDataResult>{
                data: response['Data'] ? response['Data'] : [],  
                total: parseInt(response['TotalRecord'], 10)
              }))
            );
        }
 /*  @Name: getLeadworkflowListInfo  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What:get workflow list info*/

        getLeadworkflowListInfo(queryString: State,searchValue: string) {
          let queryStr = `${toDataSourceRequestString(queryString)}`;
          return this.http.get(this.serviceListClass.getLeadWorkflowAll + '?'+queryStr+'&search='+searchValue).pipe(
            retry(1),
            catchError(handleError)
          );
        }

   /*  @Name: checkLeadWorkFlowIsExists  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What: check Job Workflow -stages duplicay*/

  checkLeadWorkFlowIsExists(formData) {
    return this.http.post(this.serviceListClass.leadWorkFlowIsExists, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


/*  @Name: checkStageIsExists  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What: check Job Workflow  duplicay*/
  checkStageIsExists(formData) {
    return this.http.post(this.serviceListClass.leadWorkFlowStageIsExists, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

/* @Who: Renu @When: 27-12-2024 @Why:EWM-19016 EWM-19116 @What:get workflow list data  */

     getworkflowList(pagesize, pagneNo, orderBy, searchVal) {
      return this.http.get(this.serviceListClass.jobWorkFlowList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
        retry(1),
        catchError(handleError)
      );
    }
  
/*  @Name: AddLeadWorkflow  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What: creating Lead workflow*/
  
    AddLeadWorkflow(formData): Observable<any> {
      return this.http.post(this.serviceListClass.createLeadWOrkFlow, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }
  
   /*  @Name: updateLeadWorkflow  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What: update Lead workflow*/
    updateLeadWorkflow(formData): Observable<any> {
      return this.http.post(this.serviceListClass.updateLeadWorkFlow, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }
   
  /*  @Name: getLeadWorkflowByID  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What: get Lead workflow data by ID from APi*/
    getLeadWorkflowByID(formData) {
      return this.http.get(this.serviceListClass.getLeadWorkFlowById + formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /*  @Name: deleteLeadflowById  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What:  Api call for delete workflow data*/

    deleteLeadflowById(formData): Observable<any> {
      return this.http.get(this.serviceListClass.deleteLeadWorkFlowById + formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }
  
  /*  @Name: getDefaultLeadWorkflow  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What:  get Default Lead Workflow*/

    getDefaultLeadWorkflow() {
      return this.http.get(this.serviceListClass.getDefaultWorkflow+'?RelatedTo=CLIE').pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /*  @Name: workflowapplicationstages  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What:  get Lead Workflow stages*/

    workflowapplicationstages() {
      return this.http.get(this.serviceListClass.workflowapplicationstages+'?RelatedTo=CLIE').pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /*  @Name: CandidateLeadCount  @Who: Renu  @When:19-Dec-2024 @Why: EWM-18938 EWM-18965 @What:  get Lead Workflow is already in use or not*/

    CandidateLeadCount(workflowId: string): Observable<any> {
      return this.http.get(this.serviceListClass.checkLeadWorkflowMapping + '?workflowid=' + workflowId).pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /* @Who: Renu @When: 20-12-2024 @Why:EWM-18938 EWM-18965 @What: set isDefault on listing page for lead workflow */
setDefaultLeadWorkflow(formData) {
  return this.http.get(this.serviceListClass.updateDefaultWorkFlow + '?WorkflowId='+ formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

  /* @Who: Renu @When: 23-12-2024 @Why:EWM-19017 EWM-19061 @What: lead Details view card details */
  getLeadCardDetails(formData: any): Observable<any> {
    return this.http.post(this.serviceListClass.getLeadCardDetails, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /* @Who: Renu @When: 23-12-2024 @Why:EWM-19017 EWM-19061 @What: get all stages for card view based on workflowId */
   getAllStageDetails(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getAllStageDetails+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
     /* @Who: Renu @When: 27-12-2024 @Why:EWM-19016 EWM-19113 @What: for pin unpin  */

  pinUnpinLead(formData) {
    return this.http.post(this.serviceListClass.pinUnpinLead, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
  
getLeadWorkflowCount(searchVal): Observable<any> {
  return this.http.get(this.serviceListClass.getLeadWorkflowCount + '?search=' + searchVal).pipe(
    retry(1),
    catchError(handleError)
  );
}

/* @Who: Renu @When: 27-12-2024 @Why:EWM-19016 EWM-19116 @What: for like lead  */

likeLead(formData) {
  return this.http.post(this.serviceListClass.likeLead, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

/* @Who: Renu @When: 27-12-2024 @Why:EWM-19016 EWM-19116 @What: for dislike lead  */

disLikeLead(formData) {
  return this.http.post(this.serviceListClass.disLikeLead, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}
/* @Who: Renu @When: 27-12-2024 @Why:EWM-19016 EWM-19116 @What: for move to another stage  */

leadMoveAction(formData) {
  return this.http.post(this.serviceListClass.leadMoveAction, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

/* @Who: Renu @When: 03-01-2025 @Why:EWM-19016 EWM-19136 @What: hide workflowStages from APi  */

hideLeadWorkflowStage(formData) {
  return this.http.post(this.serviceListClass.hideLeadWorkflowStage, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

fetchLeadlist(formData): Observable<any> {
  return this.http.post(this.serviceListClass.leadLandingList, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}


getAllNextStages_v2(formData) {
  return this.http.get(this.serviceListClass.getLeadNextStages + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

getWorkflowHierarchy(formData) {
  return this.http.get(this.serviceListClass.getLeadworkflowhierarchy+ formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

  
getLeadworkflowList(searchVal: string): Observable<any> {
  return this.http.get(this.serviceListClass.getLeadworkflowList + '?search=' + searchVal).pipe(
    retry(1),
    catchError(handleError)
  );
}

}
