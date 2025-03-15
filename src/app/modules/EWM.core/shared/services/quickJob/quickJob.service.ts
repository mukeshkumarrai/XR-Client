/*
@(C): Entire Software
@Type: File, <ts>
@Name: quickjob.service.ts
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: Service Api's for Job
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';

@Injectable({
  providedIn: 'root'
})
export class QuickJobService {

  /*
  @Type: File, <ts>
  @Name: job.service.ts
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: constructor function
  */
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }



  /*
  @Type: File, <ts>
  @Name: checkJobTypeIsExists
  @Who: Anup
   @When: 2-july-2021
   @Why:EWM-1738 EWM-1828
  @What: check Job Title duplicay
  */
  checkJobTitleIsExists(formData) {
    return this.http.get(this.serviceListClass.getJobTitleIsExist + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getClientAllDetailsList function
    @Who: Anup
    @When: 25-June-2021
    @Why: EWM-1749 EWM-1900
    @What:  get All Data for Company All DetailsList
    */
   getCompanyDetailsList(formData) {
    return this.http.post(this.serviceListClass.getContactListById,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getClientAllDetailsList(formData) {
    return this.http.get(this.serviceListClass.getCompanyAllDetails+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getAllStateByCountryId function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What:  get All Data for All State
  */

  getAllStateByCountryId(id) {
    return this.http.get(this.serviceListClass.getAllState + '?CountryId=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: fetchfunctionalExpertiseList function
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What:  get All Data for Industry List
   */
  getIndustryAll() {
    return this.http.get(this.serviceListClass.getIndustryAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: getSubIndustryAll function
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What:  get All Data for SubIndustry List
   */
  getSubIndustryAll(IndustryId) {
    return this.http.get(this.serviceListClass.getSubIndustryAll + '?IndustryId=' + IndustryId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: getJobCategoryAll
@Who:  Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: For creating job category service
*/
  getJobCategoryAll() {
    return this.http.get(this.serviceListClass.getJobCategoryAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: getSubJobCategoryAll
 @Who:  Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: For creating subJobcategory service
  */
  getSubJobCategoryAll(JobCategoryId) {
    return this.http.get(this.serviceListClass.getSubJobCategoryAll + '?JobCategoryId=' + JobCategoryId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getExperienceList
  @Who:  Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: get experience list data
  */
  getExperienceList() {
    return this.http.get(this.serviceListClass.experienceAllListData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getJobTypeList
     @Who: Anup
     @When: 25-June-2021
     @Why: EWM-1749 EWM-1900
     @What: get Job type list data
     */
  getJobTypeList() {
    return this.http.get(this.serviceListClass.getJobTypeList).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: getJobSubTypeList
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: get Job sub type list data
   */

  getJobSubTypeList(jobSubTypeId) {
    return this.http.get(this.serviceListClass.getAllJobSubTypeList + '?JobTypeId=' + jobSubTypeId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: fetchfunctionalExpertiseList function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What:  get All Data for functional Expertise List
  */

  fetchfunctionalExpertiseList() {
    return this.http.get(this.serviceListClass.getAllFunctionalExpertise).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: fetchfunctionalSubExpertiseList
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What:  get All Data for functional Sub Expertise List
  */

  fetchfunctionalSubExpertiseList(expertiseId) {
    return this.http.get(this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiseId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getAllWorkFlow
   @Who: Anup
    @When: 25-June-2021
    @Why: EWM-1749 EWM-1900
   @What: get getBrandAll list data
   */
  // who:maneesh,what:ewm-15029 for pass by passing paging true,when:03/11/2023
  getAllWorkFlow() {
    return this.http.get(this.serviceListClass.jobWorkFlowList +
      "?FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true").pipe(
        retry(1),
        catchError(handleError)
      );
  }


  /*
 @Type: File, <ts>
 @Name: getCurrency
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: get Currency api details
 */

  getCurrency(formData) {
    return this.http.get(this.serviceListClass.currencyList + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Type: File, <ts>
   @Name: getAllSalary
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: get All Salary api details
   */

  getAllSalary(formData) {
    return this.http.get(this.serviceListClass.getAllSalary +formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getSalaryBandList
    @Who: Anup
    @When: 25-June-2021
    @Why: EWM-1749 EWM-1900
    @What: get salary band list data
    */
  getSalaryBandList(formData) {
    /*-@Who: Nitin Bhati,@When: 03-March-2023,@Why: EWM-11009,@What:For showing Active record only--*/
    return this.http.get(this.serviceListClass.salaryBandList+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: fetchTagList function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What:  get All Data for Tag List
 */

  fetchTagList() {
    return this.http.get(this.serviceListClass.tagList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getBrandAllList
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: get getBrandAll list data
   */
  getBrandAllList() {
    return this.http.get(this.serviceListClass.getBrandAllList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getStatusAllList
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: get getStatusAllList list data
   */
  getStatusAllList() {
    return this.http.get(this.serviceListClass.statusAllList + "?GroupId=f7392f54-4ee0-4d3e-9342-f9f9ea76363a").pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /* 
   @Type: File, <ts>
   @Name: fetchUserInviteList
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: user invitation list
   */

  fetchUserInviteList() {
    return this.http.get(this.serviceListClass.userInvitationList +'?RecordFor=People&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&PageNumber=1&PageSize=200').pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
     @Type: File, <ts>
     @Name: createQuickJob function
     @Who: Anup
     @When: 25-June-2021
     @Why: EWM-1749 EWM-1900
     @What:  create Data For Quick Job 
     */
  createQuickJob(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createQuickAddJob, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

 /* 
   @Type: File, <ts>
   @Name: fetchQulificationList
   @Who: Anup
   @When: 23-Aug-2021
   @Why: EWM-2515 EWM-2621
   @What: Qulification list
   */

  fetchQulificationList() {
    return this.http.get(this.serviceListClass.getQualification).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
    @Type: File, <ts>
    @Name: getGrupList
    @Who: Renu
    @When: 13-May-2021
    @Why: ROST-1538
    @What: get group list data
    */
   getGrupList(pagesize, pagneNo) {
    return this.http.get(this.serviceListClass.groupAllList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: getAllSkill
   @Who: Nitin Bhati
   @When: 13-Sep-2021
   @Why: EWM-2756
   @What: get All skills api details
   */
   getAllSkill(searchVal:any) {
    return this.http.get(this.serviceListClass.getAllSkillsList + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: getSkillById
   @Who: Nitin Bhati
   @When: 13-Sep-2021
   @Why: EWM-2756
   @What: get skills By Id api details
   */
   getSkillById(id:any) {
    return this.http.get(this.serviceListClass.getSkillMappingListById + '?skillId=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: quickJobListBy
   @Who: Anup Singh
   @When: 30-Sep-2021
   @Why: EWM-2870 EWM-2988
   @What: get quick job data By Id  
   */
  quickJobListBy(JobId) {
    return this.http.get(this.serviceListClass.quickJobListByJobId + JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: getCandidateMappedJobHeader
   @Who: Nitin Bhati
   @When: 4-Oct-2021
   @Why: EWM-3144
   @What: get candidate mapped Job Header data By Id  
   */
   getCandidateMappedJobHeader(JobId) {
    return this.http.get(this.serviceListClass.candidateMappedJobHeader+'?jobid='+JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  } 

   /*
     @Type: File, <ts>
     @Name: updateJobMappingTagList function
     @Who: Nitin Bhati
     @When: 4-Oct-2021
     @Why: EWM-3144
     @What:  create Data For Quick Job Candidate Tag mapping
     */
     updateJobMappingTagList(formData): Observable<any> {
      return this.http.post(this.serviceListClass.updateJobMappingTagList, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    /*
   @Type: File, <ts>
   @Name: getCandidateMappedJobHeaderCount
   @Who: Nitin Bhati
   @When: 4-Oct-2021
   @Why: EWM-3144
   @What: get candidate mapped Job Header Count data By Id  
   */
  //  getCandidateMappedJobHeaderCount(JobId) {
  //   return this.http.get(this.serviceListClass.candidateMappedJobHeaderCount+'?jobid='+JobId).pipe(
  //     retry(1),
  //     catchError(handleError)
  //   );
  // } 

    /*
   @Type: File, <ts>
   @Name: getCandidateMappedJobHeadertags
   @Who: Nitin Bhati
   @When: 18-Oct-2021
   @Why: EWM-3144
   @What: get candidate mapped Job Headertags data By Id  
   */
   getCandidateMappedJobHeadertags(JobId) {
    return this.http.get(this.serviceListClass.candidateMappedJobHeaderTags+'?jobid='+JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  } 

    /*
   @Type: File, <ts>
   @Name: getAllSkillAndTag
   @Who: Anup
   @When: 11-Nov-2021
   @Why: EWM-3552 EWM-3649
   @What: get all skill and tag
   */
  getAllSkillAndTag(searchVal:any) {
    return this.http.get(this.serviceListClass.getAllSkillsTagList + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  
  /*
     @Type: File, <ts>
     @Name: updateQuickJob function
     @Who: Anup
     @When: 12-Nov-2021
     @Why: EWM-3128 EWM-3653
     @What:  update Data For Quick Job 
     */
    updateQuickJob(formData): Observable<any> {
      return this.http.post(this.serviceListClass.updateQuickAddJob, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }


      /* 
   @Type: File, <ts>
   @Name: fetchUserInviteList
   @Who: Anup
   @When: 25-June-2021
   @Why: EWM-1749 EWM-1900
   @What: user invitation list
   */

  fetchUserInviteListOnbasisSearch(pagesize, pagneNo, searchVal) {
    return this.http.get(this.serviceListClass.userInvitationList + '?RecordFor=People' + '&PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /* 
   @Type: File, <ts>
   @Name: getAvaiableTimeslots
   @Who: Suika
   @When: 21-April-2022
   @Why: EWM-5572 EWM-6231
   @What: user getAvaiableTimeslots list
   */

  getAvaiableTimeslots(slotStartDate,timePeriod,timezonName) {
    return this.http.get(this.serviceListClass.getActivityAvaiableTimeslots + '?dateTime=' + slotStartDate + '&timeperiod=' +timePeriod+'&timezone='+timezonName.toString()).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: getCandidateJobFilterCount
   @Who: Nitin Bhati
   @When: 13-June-2022
   @Why: EWM-7044
   @What: get candidate mapped Job Header data By Id  
   */
      // who:maneesh,what:ewm-12889 for pass this.workflowId show interviewinaweek count and candidate list filter interviewinaweek ,when:03/07/2023 -->
   getCandidateJobFilterCount(JobId,workflowId) {
    return this.http.get(this.serviceListClass.getCandidateJobFilterCount+'?jobId='+JobId+'&workflowid='+workflowId).pipe(
      retry(1),
      catchError(handleError)
    );
  } 

  /*
   @Type: File, <ts>
   @Name: getAllSkillAndTagWithoutFilter
   @Who: Renu
   @When: 11-Jul-2022
   @Why: EWM-7968 EWM-8026
   @What: get all skill and tag list without filter
  */
   getAllSkillAndTagWithoutFilter(formData) {
    return this.http.get(this.serviceListClass.getAllSkillsTagList+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

      /*
   @Type: File, <ts>
   @Name: getCandidateEmailAndPhone
   @Who: Nitin Bhati
   @When: 4-Oct-2021
   @Why: EWM-3144
   @What: get candidate mapped Job Header Count data By Id  
   */
  getCandidateEmailAndPhone(JobId) {
    return this.http.get(this.serviceListClass.getCandidateEmailAndPhone+'?jobid='+JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  } 


   /*
   @Type: File, <ts>
   @Name: getJobHeaderDetails
   @Who: Nitin Bhati
   @When: 30-Sep-2022
   @Why: EWM-9033
   @What: get candidate mapped Job Header data By Id  
   */
   getJobHeaderDetails(JobId) {
    return this.http.get(this.serviceListClass.jobHeaderDetails+'?jobid='+JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  } 

    /*
   @Type: File, <ts>
   @Name: getCandidateJobAction
   @Who: Nitin Bhati
   @When: 11 Oct 2022
   @Why: EWM-9161
   @What: service call for candidate job action 
   */
   getCandidateJobAction(formData) {
    return this.http.get(this.serviceListClass.candidateJobAction+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  } 
    /*
   @Type: File, <ts>
   @Name: getCandidateMappedtoJobTimelines
   @Who:maneesh
   @When: 18 Oct 2022
   @Why: EWM-
   @What: service call for candidate job action timeline popup
   */
  getCandidateMappedtoJobTimelines(candidateId,workflowId,jobId) {
    return this.http.get(this.serviceListClass.getCandidateMappedtoJobTimelines+'?candidateid='+candidateId+'&jobid='+jobId+'&workflowid='+workflowId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
     @Type: File, <ts>
     @Name: updateMapChecklistWorkflowstage function
     @Who: Nitin Bhati
     @When: 18-Nov-2022
     @Why: EWM-9456
     @What:Update data for workflow checklist
     */
     updateMapChecklistWorkflowstage(formData): Observable<any> {
      return this.http.post(this.serviceListClass.updateMapChecklistWorkflowstage, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

/*
  @Type: File, <ts>
  @Name: getJobDetailsData function
  @Who: Adarsh singh
  @When: 10-May-2023
  @Why: EWM-12361
  @What:get job details data
*/
  getJobDetailsData(jobId: string): Observable<any> {
    return this.http.get(this.serviceListClass.getJobDetails+jobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

      /*
   @Type: File, <ts>
   @Name: getCandidateJobFilterCount
   @Who: maneesh
   @When: 30-June-2023
   @Why: EWM-12889
   @What: get candidate mapped Job interview count  data By Id  
   */
   getCandidateJobInterviewCount(workflowId,JobId) {
    return this.http.get(this.serviceListClass.intervewJobCount+'?workflowid='+workflowId+'&jobId='+JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
   /* 

   /*

   @Type: File, <ts>
   @Name: fetchUserInviteList
   @Who: Nitin Bhati
   @When: 23-Aug-2023
   @Why: EWM-13903
   @What: user invitation list
   */
   
  fetchUserInviteListForOrganization() {
    return this.http.get(this.serviceListClass.userInvitationList+'?RecordFor=People'+'&ByPassPaging='+true).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
   @Type: File, <ts>
   @Name: getCandidateJobAction_v2
   @Who: Nitin Bhati
   @When: 15 Sep 2023
   @Why: EWM-13985
   @What: service call for candidate job action 
   */
   getCandidateJobAction_v2(formData) {
    return this.http.get(this.serviceListClass.candidateJobAction_v2+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  } 

   /*
     @Type: File, <ts>
     @Name: updateJobLocation function
     @Who: Renu
     @When: 26-Oct-2023
     @Why: EWM-14918 EWM-14940
     @What:Update JOB Location
     */
    updateJobLocation(formData): Observable<any> {
      return this.http.post(this.serviceListClass.updateJobLocation, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    } 

 /*@Name: onDismiss @Who:Renu @When: 20-Feb-2024  @Why: EWM-16108 @What: getEmployeeList*/
    getEmployeeList(pageNo,pagesize,orderBy,searchVal) {
      return this.http.get(this.serviceListClass.userInvitationsList +'?RecordFor=People&ByPassPaging=true&isOwner=false&PageNumber='+pageNo+'&PageSize='+pagesize+'&search='+searchVal).pipe(
        retry(1),
        catchError(handleError)
      );
    }

      /*
     @Type: File, <ts>
     @Name: createQuickJob function
     @Who: Ankit Rawat
     @When: 26-June-2024
     @Why: EWM-17356
     @What:  create Data For Quick Job 
     */
  createQuickJob_v2(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createQuickAddJob_v2, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

       /*
     @Type: File, <ts>
     @Name: createQuickJob function
     @Who: Ankit Rawat
     @When: 26-June-2024
     @Why: EWM-17356
     @What:  get job Data by Job ID
     */
   quickJobListBy_v2(JobId) {
    return this.http.get(this.serviceListClass.quickJobListByJobId_v2 + JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: createQuickJob function
     @Who: Ankit Rawat
     @When: 26-June-2024
     @Why: EWM-17356
     @What: Update job data
     */
     updateQuickJob_v2(formData): Observable<any> {
      return this.http.post(this.serviceListClass.updateQuickAddJob_v2, formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }
}