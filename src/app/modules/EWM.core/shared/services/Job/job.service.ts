/*
@(C): Entire Software
@Type: File, <ts>
@Name: job.service.ts
@Who: Anup
@When: 18-June-2021
@Why: EWM-1746 EWM-1843
@What: Service Api's for Job
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';
import { handleError } from '../../../../../shared/helper/exception-handler';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';


@Injectable({
  providedIn: 'root'
})
export class JobService {


  ModuleNameObs: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  ReasonObs: BehaviorSubject<any> = new BehaviorSubject<string>(null);
  public activeModuleName = this.ModuleNameObs.asObservable();
  public activeReasonDeatils = this.ReasonObs.asObservable();
  public manageCareerPageFormData = new BehaviorSubject(null);


  isKnockoutSuccessInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isKnockoutSuccess = this.isKnockoutSuccessInfo.asObservable();


  isKnockoutEnableInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isKnockoutEnable = this.isKnockoutEnableInfo.asObservable();

  assessmentShareObj: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public assessmentShare = this.assessmentShareObj.asObservable();


  /*
  @Type: File, <ts>
  @Name: job.service.ts
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What: constructor function
  */
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }


  /*
   @Type: File, <ts>
   @Name: fetchfunctionalExpertiseList function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What:  get All Data for functional Expertise List
   */

  fetchfunctionalExpertiseList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getAllFunctionalExpertise + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: fetchfunctionalExpertiseListSearch function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  get All Data by serching
    */
  fetchfunctionalExpertiseListSearch(formData) {
    return this.http.get(this.serviceListClass.getAllFunctionalExpertise + '?search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: fetchRegionMaster function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What:  get All Data for Region Master
   */

  fetchRegionMaster() {
    return this.http.get(this.serviceListClass.regionList).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: createfunctionalExpertise function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  create Data For functional Expertise
    */
  createfunctionalExpertise(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addfunctionalExpertise, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: deletefunctionalExpertiseById function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  Delete Data For functional Expertise By Id
    */
  deletefunctionalExpertiseById(formDataId): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.deleteFunctionalExpertiseList + `?expertiseId=` + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getfunctionalExpertiseById function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  Get Data For functional Expertise By Id
    */

  getfunctionalExpertiseById(formDataId) {
    return this.http.get(this.serviceListClass.functionalExpertiseById + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: updatefunctionalExpertiseById
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  Update For functional Expertise By Id
    */
  updatefunctionalExpertiseById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updatefunctionalExpertise, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: checkFunctionalExpertiseDuplicay function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @Why: For check duplicate  data from server
    @What: Api call for duplicacy check for Functional Expertise
  */
  checkFunctionalExpertiseDuplicay(formData): Observable<any> {
    return this.http.post(this.serviceListClass.FunctionalExpertiseDuplicay, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  ////////////////////////////////////////functional Sub Expertise///////////////////////////////////////////////////
  /*
   @Type: File, <ts>
   @Name: fetchfunctionalSubExpertiseList
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What:  get All Data for functional Sub Expertise List
   */

  fetchfunctionalSubExpertiseList(pagesize, pagneNo, orderBy, searchVal, expertiseId) {
    return this.http.get(this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiseId + '&PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: fetchfunctionalSubExpertiseListSearch function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  get All Data by serching
    */
  fetchfunctionalSubExpertiseListSearch(formData, expertiseId) {
    return this.http.get(this.serviceListClass.getAllFunctionalSubExpertise + '?ExpertiseId=' + expertiseId + '&search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: fetchRegionMasterForSub function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What:  get All Data for functional Sub Expertise List
   */

  fetchRegionMasterForSub() {
    return this.http.get(this.serviceListClass.regionList).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: createfunctionalSubExpertise function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  create Data For functional Sub Expertise List
    */
  createfunctionalSubExpertise(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addfunctionalSubExpertise, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: deletefunctionalSubExpertiseById function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  Delete Data For functional Sub Expertise List By Id
    */
  deletefunctionalSubExpertiseById(formDataId): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.deleteFunctionalSubExpertiseList + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getfunctionalSubExpertiseById function
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  Get Data For functional Sub Expertise List By Id
    */

  getfunctionalSubExpertiseById(formDataId) {
    return this.http.get(this.serviceListClass.getfunctionalSubExpertiseById + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: updatefunctionalSubExpertiseById
    @Who: Anup
    @When: 18-June-2021
    @Why: EWM-1746 EWM-1843
    @What:  Update For functional Sub Expertise List By Id
    */
  updatefunctionalSubExpertiseById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updatefunctionalSubExpertise, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: checkFunctionalSubExpertiseDuplicay function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @Why: For check duplicate  data from server
    @What: Api call for duplicacy check for functional Sub Expertise
  */
  checkFunctionalSubExpertiseDuplicay(formData): Observable<any> {
    return this.http.post(this.serviceListClass.FunctionalSubExpertiseDuplicay, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Type: File, <ts>
   @Name: getSalaryBandList
   @Who: Renu
   @When:18-June-2021
   @Why: ROST-1860
   @What: get salary band list data
   */
  getSalaryBandList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.salaryBandList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: AddSalaryBand
  @Who: Renu
  @When:18-June-2021
  @Why: ROST-1860
  @What: creating salary band by inserting in database
  */

  AddSalaryBand(formData): Observable<any> {
    return this.http.post(this.serviceListClass.CreateSalaryBand, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateSalaryBand
  @Who: Renu
  @When:18-June-2021
  @Why: ROST-1860
  @What: update Salary Band
  */

  updateSalaryBand(formData): Observable<any> {
    return this.http.post(this.serviceListClass.UpdateSalaryBand, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getSalaryBandByID
    @Who: Renu
    @When:18-June-2021
    @Why: ROST-1860
    @What: get Salary Band data by ID from APi
    */
  getSalaryBandByID(formData) {
    return this.http.get(this.serviceListClass.salaryBandById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteSalaryBand
  @Who: Renu
  @When: 18-June-2021
  @Why: ROST-1860
  @What: delete Salary Band data by id
  */

  deleteSalaryBand(formData): Observable<any> {
    return this.http.get(this.serviceListClass.DeleteSalaryBand + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkSalaryBandIsExists
  @Who: Renu
  @When: 18-June-2021
  @Why: ROST-1860
  @What: check salary band duplicay
  */
  checkSalaryBandIsExists(formData) {
    return this.http.get(this.serviceListClass.salaryBandDuplicayCheck + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  ///////////////////////Job Type And Job Sub Type////////////////////////////////////


  /*
   @Type: File, <ts>
   @Name: getJobTypeList
   @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
   @What: get Job type list data
   */
  getJobTypeList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getJobTypeList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&OrderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getJobTypeListSearch(formData) {
    return this.http.get(this.serviceListClass.getJobTypeList + '?search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );

  }

  /*
  @Type: File, <ts>
   @Name: AddJobType
   @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
  @What: creating Job type by inserting in database
  */

  AddJobType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobTypeCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateJobType
   @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
  @What: update Job type
  */

  updateJobType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobTypeUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getJobTypeByID
     @Who: Anup
     @When: 22-june-2021
     @Why:EWM-1738 EWM-1828
    @What: get Job type data by ID from APi
    */
  getJobTypeByID(formData) {
    return this.http.get(this.serviceListClass.getJobTypeByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteJobType
  @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
  @What: delete Job type data by id
  */

  deleteJobType(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getdeleteJobType + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkJobTypeIsExists
  @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
  @What: check Job type Name duplicay
  */
  checkJobTypeIsExists(formData) {
    return this.http.get(this.serviceListClass.getJobTypeIsExist + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Type: File, <ts>
   @Name: getJobSubTypeList
   @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
   @What: get Job sub type list data
   */

  getJobSubTypeList(pagesize, pagneNo, orderBy, searchVal, jobSubTypeId) {
    return this.http.get(this.serviceListClass.getAllJobSubTypeList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize +
      '&orderBy=' + orderBy + '&search=' + searchVal + '&JobTypeId=' + jobSubTypeId).pipe(
        retry(1),
        catchError(handleError)
      );
  }

  getJobSubTypeListSearch(formData) {
    return this.http.get(this.serviceListClass.getAllJobSubTypeList + '?search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
@Type: File, <ts>
@Name: deleteJobSubTypeList
@Who: Anup
 @When: 22-june-2021
 @Why:EWM-1738 EWM-1828
@What: delete Job sub type data by id
*/
  deleteJobSubTypeList(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getdeleteJobsubType + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
   @Name: AddJobSubType
   @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
  @What: creating Job sub type by inserting in database
  */
  AddJobSubType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobSubTypeCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: checkJobSubTypeIsExists
@Who: Anup
 @When: 22-june-2021
 @Why:EWM-1738 EWM-1828
@What: check Job sub type Name duplicay
*/
  checkJobSubTypeIsExists(formData) {
    return this.http.get(this.serviceListClass.getJobSubTypeIsExist + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getJobSubTypeByID
   @Who: Anup
   @When: 22-june-2021
   @Why:EWM-1738 EWM-1828
  @What: get Job sub type data by ID from APi
  */
  getJobSubTypeByID(formData) {
    return this.http.get(this.serviceListClass.getJobSubTypeByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: updateJobSubType
 @Who: Anup
 @When: 22-june-2021
 @Why:EWM-1738 EWM-1828
@What: update sub Job type
*/
  updateJobSubType(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobSubTypeUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }







  /*
 @Type: File, <ts>
 @Name: createJobCategory
 @Who:  Nitin Bhati
 @When: 21-June-2021
 @Why:  EWM-1823
 @What: For creating job category service
  */

  createJobCategory(formdata: any) {
    return this.http.post<any>(this.serviceListClass.createJobCategory, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getJobCategoryAll
  @Who:  Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: For creating job category service
   */
  getJobCategoryAll(pagesize, pagneNo, orderBy, searchVal, idName, id) {
    return this.http.get(this.serviceListClass.getJobCategoryAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getJobCategoryById function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for update job category data
  */
  getJobCategoryById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getJobCategoryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: updateJobCategoryById function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for update job category data
  */
  updateJobCategoryById(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateJobCategoryById, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }



  /*
  @Type: File, <ts>
  @Name: deleteJobCategoryById function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for delete job category data
  */
  deleteJobCategoryById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteJobCategoryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: createSubJobCategory
 @Who:  Nitin Bhati
 @When: 21-June-2021
 @Why:  EWM-1823
 @What: For creating createSubJobCategory service
  */
  createSubJobCategory(formdata: any) {
    return this.http.post<any>(this.serviceListClass.createSubJobCategory, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name: getSubJobCategoryAll
 @Who:  Nitin Bhati
 @When: 21-June-2021
 @Why:  EWM-1823
 @What: For creating subJobcategory service
  */
  getSubJobCategoryAll(JobCategoryId, pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getSubJobCategoryAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&JobCategoryId=' + JobCategoryId).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: getSubExpertiseById function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for update subJobcategory data
  */
  getSubJobCategoryById(formData: any): Observable<any> {
    return this.http.get(this.serviceListClass.getSubJobCategoryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: updateSubExpertiseById function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for update SubJobCategory data
  */
  updateSubJobCategoryById(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateSubJobCategoryById, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }
  /*
  @Type: File, <ts>
  @Name: deleteSubExpertiseById function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for delete SubJobCategory data
  */
  deleteSubJobCategoryById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteSubJobCategoryById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: checkJobCategoryIsExist function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for already exist job category field
  */
  checkJobCategoryIsExist(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkJobCategoryIsExist, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }
  /*
  @Type: File, <ts>
  @Name: checkSubJobCategoryIsExist function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: Api call for already exist SubJobCategory field
  */
  checkSubJobCategoryIsExist(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.checkSubJobCategoryIsExist, formData)
      .pipe(
        retry(0),
        catchError(handleError)
      );
  }

  /*
  @Type: File, <ts>
  @Name: getJobCategoryAllList
  @Who:  Nitin Bhati
  @When: 21-June-2021
  @Why:  EWM-1823
  @What: For creating jopb category service
   */
  getJobCategoryAllList() {
    return this.http.get(this.serviceListClass.getJobCategoryAll).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getJobworkflowList
     @Who: Renu
     @When:16-June-2021
     @Why: ROST-1872
     @What: get Job workflow list data
     */
  getJobworkflowList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.jobWorkFlowList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name: AddJobWorkflow
 @Who: Renu
 @When:16-June-2021
 @Why: ROST-1872
 @What: creating Job workflow by inserting in database
 */

  AddJobWorkflow(formData): Observable<any> {
    return this.http.post(this.serviceListClass.jobWorkFlowCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateJobWorkflow
  @Who: Renu
  @When:16-June-2021
  @Why: ROST-1872
  @What: update Job workflow
  */

  updateJobWorkflow(formData): Observable<any> {
    return this.http.post(this.serviceListClass.jobWorkFlowUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getJobWorkflowByID
    @Who: Renu
    @When:16-June-2021
    @Why: ROST-1872
    @What: get Job workfloe data by ID from APi
    */
  getJobWorkflowByID(formData) {
    return this.http.get(this.serviceListClass.jobWorkFlowById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: deleteWorkflowById function
  @Who: Renu
  @When: 19-June-2021
  @Why: EWM-1872
  @What: Api call for delete workflow data
  */
  deleteWorkflowById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.jobWorkFlowDelete + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Name: checkJobWorkFlowIsExists
   @Who: Renu
   @When: 19-june-2021
   @Why:EWM-1871
   @What: check Job Workflow Name duplicay
   */
  checkJobWorkFlowIsExists(formData) {
    return this.http.post(this.serviceListClass.jobWorkFlowIsExists, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Name: checkStageIsExists
 @Who: Renu
 @When: 19-june-2021
 @Why:EWM-1871
 @What: check Job Workflow -stages duplicay
 */
  checkStageIsExists(formData) {
    return this.http.post(this.serviceListClass.jobWorkFlowStageIsExists, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }





  /*
    @Type: File, <ts>
    @Name: getExperienceList
    @Who: Nitin Bhati
    @When: 24-May-2021
    @Why: EWM-1622
    @What: get experience list data
    */
  getExperienceList(pagesize, pagneNo, orderBy, searchVal, idName, id) {
    return this.http.get(this.serviceListClass.experienceAllList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=' + idName + '&FilterParams.FilterValue=' + id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: experienceCreate
  @Who: Nitin Bhati
  @When: 24-May-2021
  @Why: EWM-1622
  @What: creating Experience Data by inserting in database
  */

  experienceCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addexperience, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateExperience
  @Who: Nitin Bhati
  @When: 24-May-2021
  @Why: EWM-1622
  @What: update Experience data
  */

  updateExperience(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateexperience, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getExperienceByID
    @Who: Nitin Bhati
    @When: 24-May-2021
    @Why: EWM-1622
    @What: get Experience data by ID from APi
    */
  getExperienceByID(formData) {
    return this.http.get(this.serviceListClass.experienceByID + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteExperience
  @Who: Nitin Bhati
  @When: 24-May-2021
  @Why: EWM-1622
  @What: delete Experience data by id
  */

  deleteExperience(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteexperience + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkExperienceDuplicacy
  @Who: Nitin Bhati
  @When: 24-May-2021
  @Why: EWM-1622
  @What: check Experience duplicay
  */
  checkExperienceDuplicacy(formData) {
    return this.http.get(this.serviceListClass.experienceExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  /*
    @Type: File, <ts>
    @Name: getJobBoardAll
    @Who: Anup
    @When: 3-july-2021
    @Why:EWM-1807 EWM-1976
    */
  getJobBoardAll() {
    return this.http.get(this.serviceListClass.getJobBoard).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getJobBoardCategoryByJobId
    @Who: Anup
    @When: 3-july-2021
    @Why:EWM-1807 EWM-1976
    */
  getJobBoardCategoryByJobId(formData) {
    return this.http.get(this.serviceListClass.getJobBoardCategory + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
     @Type: File, <ts>
     @Name: getItemsByJobIdCategoryId
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     */

  getItemsByJobIdCategoryId(formData) {
    return this.http.get(this.serviceListClass.getJobboardCategoryItems + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Type: File, <ts>
   @Name: getJobBoardItemsList
   @Who: Anup
   @When: 3-july-2021
   @Why:EWM-1807 EWM-1976
   */
  getJobBoardItemsList(jobboardId, categoryId, pageSize, pageNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.getJobBoardConfigurationList + "?JobBoardId=" + jobboardId + "&JobBoardCategoryId=" + categoryId + '&search=' + searchVal + '&PageNumber=' + pageNo + '&PageSize=' + pageSize + '&OrderBy=' + orderBy).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getJobBoardItemsListSearch
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     */
  getJobBoardItemsListSearch(jobboardId, categoryId, formData) {
    return this.http.get(this.serviceListClass.getJobBoardConfigurationList + "?JobBoardId=" + jobboardId + "&JobBoardCategoryId=" + categoryId + '&search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
     @Type: File, <ts>
     @Name: createJobBoardConfigue
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     */
  createJobBoardConfigue(formdata: any) {
    return this.http.post<any>(this.serviceListClass.creatJobBoardConfigue, formdata).pipe(
      retry(0),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: deleteJobBoardConfigue
     @Who: Anup
     @When: 3-july-2021
     @Why:EWM-1807 EWM-1976
     */
  deleteJobBoardConfigue(formData): Observable<any> {
    return this.http.get(this.serviceListClass.deleteJobBoardConfigueList + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }






  ///////////////////////////////////////////

  /*
 @Type: File, <ts>
 @Name: fetchJobTemplateList function
 @Who: Anup Singh
 @When: 14-july-2021
 @Why: EWM-2001 EWM-2070
 @What:  get All Data for template List
 */

  fetchJobTemplateList(pagesize, pagneNo, orderBy, searchVal) {
    return this.http.get(this.serviceListClass.jobTemplateList + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: fetchJobTemplateListSearch function
    @Who: Anup Singh
    @When: 14-july-2021
    @Why: EWM-2001 EWM-2070
    @What:  get All Data by serching
    */
  fetchJobTemplateListSearch(formData) {
    return this.http.get(this.serviceListClass.jobTemplateList + '?search=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: createJobTemplateList function
    @Who: Anup Singh
    @When: 14-july-2021
    @Why: EWM-2001 EWM-2070
    @What:  create Data For template List
    */
  createJobTemplateList(formData): Observable<any> {
    return this.http.post(this.serviceListClass.addJobTemplateList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: deleteJobTemplateListById function
    @Who: Anup Singh
    @When: 14-july-2021
    @Why: EWM-2001 EWM-2070
    @What:  Delete Data For template List By Id
    */
  deleteJobTemplateListById(formDataId): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.deleteJobTemplateList + `?Id=` + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: getJobTemplateListById function
    @Who: Anup Singh
    @When: 14-july-2021
    @Why: EWM-2001 EWM-2070
    @What:  Get Data For template List By Id
    */

  getJobTemplateListById(formDataId) {
    return this.http.get(this.serviceListClass.JobTemplateListById + formDataId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: updateJobTemplateListById
    @Who: Anup Singh
    @When: 14-july-2021
    @Why: EWM-2001 EWM-2070
    @What:  Update For template List By Id
    */
  updateJobTemplateListById(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateJobTemplateList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: duplicayCheckNameAndTitle function
    @Who: Anup Singh
    @When: 14-july-2021
    @Why: EWM-2001 EWM-2070
    @What: Api call for duplicacy check
  */

  duplicayCheckNameAndTitle(formData): Observable<any> {
    return this.http.post(this.serviceListClass.duplicayJobTemplateNameAndTitle, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: fetchJoblist function
     @Who: Renu
     @When: 17-july-2021
     @Why: EWM-2003
     @What: Api call for gettig listing data in grid
   */

  fetchJoblist(formData): Observable<any> {
    return this.http.post(this.serviceListClass.jobLandingList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  public getjoblist(state: State, searchValue): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      searchValue=searchValue.replace('?', '');
      queryStr += '&' + searchValue;
    }
    return this.http
      .get(`${this.serviceListClass.jobLandingkendoList}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],
          total: parseInt(response['TotalRecord'], 10),
          HttpStatusCode: parseInt(response['HttpStatusCode'], 10),
        }))
      );
  }
  /*
     @Type: File, <ts>
     @Name: getAllJobTemplateList function
      @Who: Anup
     @When: 17-july-2021
     @Why: EWM-2003
     @What:  for get job template list
   */

  getAllJobTemplateList() {
    return this.http.get(this.serviceListClass.jobTemplateListByFilter + "?TemplateFilterParams.ColumnName=statusname&TemplateFilterParams.FilterValue=active&TemplateFilterParams.FilterOption=IsEqualTo&TemplateFilterParams.FilterCondition=AND&PageNumber=1&PageSize=200").pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
     @Type: File, <ts>
     @Name: getfilterConfig function
      @Who: Renu
     @When: 17-july-2021
     @Why: EWM-2003
     @What:  for presist filter getting config state
   */

  getfilterConfig(GridId): Observable<any> {
    return this.http.get(this.serviceListClass.getfilterConfig + '?GridId=' + GridId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: setfilterConfig function
     @Who: Renu
     @When: 17-july-2021
     @Why: EWM-2003
     @What: for presist filter setting config
   */

  setfilterConfig(formData): Observable<any> {
    return this.http.post(this.serviceListClass.setfilterConfig, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: jobLandingWorkflowList function
     @Who: Renu
     @When: 17-july-2021
     @Why: EWM-2003
     @What: for getting job workflow list
   */

  jobLandingWorkflowList(): Observable<any> {
    return this.http.get(this.serviceListClass.jobLandingWorkflow).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  getAllJobWorkFlowList() {
    return this.http.get(this.serviceListClass.getJobWorkFlowList).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getAllWorkFlowList() {
    return this.http.get(this.serviceListClass.getAllJobWorkFlowList+'?FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND').pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: jobworkFlowBypipeId
    @Who: Renu
    @When:24-Aug-2021
    @Why: ROST-2627
    @What: get Job workflow pipline data by ID from APi
    */
  jobworkFlowBypipeId(formData) {
    return this.http.get(this.serviceListClass.jobworkFlowBypipeId + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
      @Type: File, <ts>
      @Name: getdataByID
      @Who: Piyush Singh
      @When:24-Sept-2021
      @Why: EWM-2869.EWM-2924
      @What: get Remove Reason workflow pipline data by ID from APi
      */

  getdataByID(ID: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.getRemoveReasonById + '?id=' + ID).pipe(retry(1), catchError(handleError));
  }
  /*
    @Type: File, <ts>
    @Name: getdataByID
    @Who: Piyush Singh
    @When:24-Sept-2021
    @Why: EWM-2869.EWM-2924
    @What: get Remove Reason workflow pipline data  from APi
    */


  getAllRemoveReason(pageSize: number, pageNo: number, sortingValue: string, searchVal: string) {
    return this.http.get(this.serviceListClass.getRemoveReason + '?PageNumber=' + pageNo + '&PageSize=' + pageSize + '&orderBy=' + sortingValue + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getdataByID
  @Who: Piyush Singh
  @When:24-Sept-2021
  @Why: EWM-2869.EWM-2924
  @What: checkDuplicay data Remove Reason workflow pipline  from APi
  */

  checkdDuplicay(data: string): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.checkDuplicityofremoveReason + data)
      .pipe(retry(1),
        catchError(handleError));
  }


  /*
    @Type: File, <ts>
    @Name: getdataByID
    @Who: Piyush Singh
    @When:24-Sept-2021
    @Why: EWM-2869.EWM-2924
    @What: create Remove Reason workflow pipline data  from APi
    */

  Create(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createRemoveReason, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }
  /*
    @Type: File, <ts>
    @Name: getdataByID
    @Who: Piyush Singh
    @When:24-Sept-2021
    @Why: EWM-2869.EWM-2924
    @What: Delete Remove Reason workflow pipline data  from APi
    */

  delete(formdata: any): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteRemoveReason, { body: formdata })
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }
  /*
    @Type: File, <ts>
    @Name: getdataByID
    @Who: Piyush Singh
    @When:24-Sept-2021
    @Why: EWM-2869.EWM-2924
    @What: Update Remove Reason workflow pipline data  from APi
    */

  update(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.updateRemoveReason, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }


  /*
  @Type: File, <ts>
  @Name: jobWorkFlowLatestId
  @Who: Suika
  @When:30-Sep-2021
  @Why: ROST-3084
  @What: get Job workflow  data by ID from APi
  */
  jobWorkFlowLatestId(formData) {
    return this.http.get(this.serviceListClass.jobWorkFlowLatest + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: jobWorkFlowLatestId
 @Who: Suika
 @When:30-Sep-2021
 @Why: ROST-3084
 @What: get Job workflow  data by ID from APi
 */
  getAllNextStages(formData) {
    return this.http.get(this.serviceListClass.getAllNextStages + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  //

  /*
   @Type: File, <ts>
   @Name: getCandidatemappedtojobcardAll
   @Who: Suika
   @When:30-Sep-2021
   @Why: ROST-3084
   @What: getCandidatemappedtojobcardAll
   */
  getCandidatemappedtojobcardAll(formdata) {
    return this.http.post(this.serviceListClass.getCandidatemappedtojobcardAll, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: candidateMoveAction
 @Who: Suika
 @When:30-Sep-2021
 @Why: ROST-3084
 @What: get Job workflow  data by ID from APi
 */
  candidateMoveAction(formData) {
    return this.http.post(this.serviceListClass.candidateMoveAction, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: fetchCandidateJobMappedList function
   @Who: Nitin Bhati
   @When: 29-july-2021
   @Why: EWM-2980
   @What: Api call for gettig listing data in grid
 */
  fetchCandidateJobMappedList(formData): Observable<any> {
    return this.http.post(this.serviceListClass.candidateNotMappedToJobList, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: candidateNotMappedToJobCreate function
    @Who: Nitin Bhati
    @When: 29-july-2021
    @Why: EWM-2980
    @What: Api call for Create data
  */
  candidateNotMappedToJobCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.candidateNotMappedToJobCreate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: removeCandidate
 @Who: Anup Singh
 @When:01-Oct-2021
 @Why: EWM-2871.EWM-2974
 @What:  Remove Candidate from job details
 */

  removeCandidate(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.removeCandidate, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }


  /*
 @Type: File, <ts>
 @Name: fetchJobsCandidateList function
 @Who: Anup Singh
 @When: 20-oct-2021
 @Why: EWM-3039 EWM-3405
 @What: Api call for gettig listing data in grid
*/
  fetchJobNotMappedToCandidateAll(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobNotMappedToCandidateAll, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: JobMappedToCandidateCreate function
    @Who: Anup Singh
    @When: 20-oct-2021
    @Why: EWM-3039 EWM-3405
    @What: Api call for create
  */
  JobMappedToCandidateCreate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.JobMappedToCandidate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
  @Type: File, <ts>
  @Name: CreateReason
  @Who:  Suika
  @When:22-Oct-2021
  @Why: EWM-3141.EWM-3424
  @What: create  Reason workflow pipline data  from APi
  */
  CreateReason(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createReasonGroup, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }


  /*
 @Type: File, <ts>
 @Name: UpdateReason
 @Who:  Suika
 @When:22-Oct-2021
 @Why: EWM-3141.EWM-3424
 @What: create  Reason workflow pipline data  from APi
 */
  UpdateReason(formdata: any): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateReasonGroup, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }


  /*
   @Type: File, <ts>
   @Name: deleteReason
   @Who:  Suika
   @When:22-Oct-2021
   @Why: EWM-3141.EWM-3424
   @What: Delete Reason workflow pipline data  from APi
JobMappedToCandidateCreate(formData): Observable<any> {
  return this.http.post(this.serviceListClass.JobMappedToCandidate,formData).pipe(
    retry(1),
    catchError(handleError)
  );
}
/*
   @Type: File, <ts>
   @Name: fetchJobMappedToCandidateAll function
   @Who: Anup Singh
   @When: 20-oct-2021
   @Why: EWM-3039 EWM-3405
   @What: Api call for get
 */
  fetchJobMappedToCandidateAll(FormData) {
    return this.http.get(this.serviceListClass.getJobMappedToCandidateAll + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: fetchJobMappedToCandidateAllForSerch function
    @Who: Anup
    @When: 22-oct-2021
    @Why: EWM-3039 EWM-3405
    @What:  get All Data by serch
    */
  fetchJobMappedToCandidateAllForSerch(FormData) {
    return this.http.get(this.serviceListClass.getJobMappedToCandidateAllForSearch + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: fetchAssignJobCount function
   @Who: Anup
   @When: 22-oct-2021
   @Why: EWM-3039 EWM-3405
   @What:  get All assign job Data count
   */

  fetchAssignJobCount(FormData) {
    return this.http.get(this.serviceListClass.getAssignJobCount + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: unassignJobFromCandidate
@Who: Anup Singh
@When:01-Oct-2021
@Why: EWM-3046 EWM-3525
@What:  unassign job from Candidate
*/

  deleteReason(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.deleteReasonGroup, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }

  /*
    @Type: File, <ts>
    @Name: getReasonGroupById
    @Who:  Suika
    @When:22-Oct-2021
    @Why: EWM-3141.EWM-3424
    @What: get Reason workflow pipline data by ID from APi
    */
  getReasonGroupById(ID: any): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.getReasonGroupById + '?id=' + ID).pipe(retry(1), catchError(handleError));
  }

  /*
    @Type: File, <ts>
    @Name: getAllReasonGroup
    @Who:  Suika
    @When:22-Oct-2021
    @Why: EWM-3141.EWM-3424
    @What: get  Reason workflow pipline data  from APi
    */
  getAllReasonGroup(GroupId: string, pageSize: number, pageNo: number, sortingValue: string, searchVal: string) {
    return this.http.get(this.serviceListClass.getReasonGroup + '?ReasonGroupInternalCode=' + GroupId + '&PageNumber=' + pageNo + '&PageSize=' + pageSize + '&orderBy=' + sortingValue + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: checkdDuplicayReason
  @Who:  Suika
  @When:22-Oct-2021
  @Why: EWM-3141.EWM-3424
  @What: checkDuplicay data  Reason workflow pipline  from APi
  */
  checkdDuplicayReason(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.checkDuplicityofReasonGroup, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }


  /*
      @Type: File, <ts>
      @Name: getReasonGroupModule
      @Who:  Suika
      @When:22-Oct-2021
      @Why: EWM-3141.EWM-3424
      @What: get  Reason workflow pipline data  from APi
      */
  getReasonGroupModule(ModuleName: string, pageSize: number, pageNo: number, sortingValue: string, searchVal: string) {
    return this.http.get(this.serviceListClass.getReasonGroupModule + '?ModuleName=' + ModuleName + '&PageNumber=' + pageNo + '&PageSize=' + pageSize + '&orderBy=' + sortingValue + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  unassignJobFromCandidate(formdata: any): Observable<any> {
    return this.http.post(this.serviceListClass.unassignJobFromCandidate, formdata)
      .pipe(
        retry(1),
        catchError(handleError)
      )
  }



  /*
  @Type: File, <ts>
  @Name: getJobCountDetails function
  @Who: Suika
  @When: 22-dec-2021
  @Why: EWM-4229
  @What: Api call for gettig listing data in grid
*/

  getJobCountDetails(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getJobsCount + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
     @Type: File, <ts>
     @Name: getJobCountDetails function
     @Who: Suika
     @When: 14-06-2022
     @Why: EWM-5334.EWM-7001
     @What: Api call for gettig listing data in grid
   */
  getJobCountByWorkFlowId(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getJobsCountByWorkFlowId + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getPostedJobdetailsByid function
  @Who: Nitin Bhati
  @When: 02-feb-2022
  @Why: EWM-4980
  @What: Api call for gettig listing data in grid
*/
  getPostedJobdetailsByid(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getPostedJobdetailsByid + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: getWorkFlowImgUrlByColorCode
@Who: Anup Singh
@When: 14-Mar-2022
@Why: EWM-5285 EWM-3988
@What: get img URL By Color Code
*/
  getWorkFlowImgUrlByColorCode(formData): Observable<any> {
    return this.http.post(this.serviceListClass.getWorkFlowImgByColorCode, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
       @Type: File, <ts>
       @Name: getJobDetailsByid function
       @Who: Nitin Bhati
       @When: 23-March-5397
       @Why: EWM-4980
       @What: get Job data by id
     */
  getJobDetailsByid(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getJobdetailsByid + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }




  /*
   @Type: File, <ts>
   @Name: fetchJobNotesAll function
   @Who: Suika
   @When: 14-April-2022
   @Why: EWM-4668 EWM-6153
   @What: Api call for get list for all notes
 */
  fetchJobNotesAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.jobFilterNoteByYear, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
@Type: File, <ts>
@Name: fetchJobNotesMonthYearCountAll function
@Who: Suika
@When: 14-April-2022
@Why: EWM-4668 EWM-6153
@What: Api call for get list for all notes mponth year count
*/
  fetchJobNotesMonthYearCountAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.getJobNotesByJobId, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: AddJobNotesAll function
  @Who: Suika
  @When: 14-April-2022
  @Why: EWM-4668 EWM-6153
  @What: Api call for get list for all notes
*/
  AddJobNotesAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.createJobNotes, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: EditJobNotesAll function
  @Who: Suika
  @When: 14-April-2022
  @Why: EWM-4668 EWM-6153
  @What: Api call for get list for all notes
*/
  EditJobNotesAll(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.updateJobNotes, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: deleteJobNotesById function
  @Who: Suika
  @When: 14-April-2022
  @Why: EWM-4668 EWM-6153
  @What: Api call for delete  can/emp notes by id data
  */
  deleteJobNotesById(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteJobNotesById, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Name: getJobNotesById
    @Who: Suika
    @When: 14-April-2022
    @Why: EWM-4668 EWM-6153
    @What: get  Note based on Id
    */
  getJobNotesById(formData) {
    return this.http.get(this.serviceListClass.getJobNotesById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
    @Type: File, <ts>
    @Name: fetchJobNotesTotal function
    @Who: Suika
    @When: 14-April-2022
    @Why: EWM-4668 EWM-6153
    @What: Api call for notes count
  */
  fetchJobNotesTotal(FormData): Observable<any> {
    return this.http.get(this.serviceListClass.JobNotesCount + FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: fetchJobNotesTotal function
     @Who: Adarsh Singh
   @When: 26-Feb-2022
   @Why: EWM-6224 EWM-6369
     @What: Api call for notes count
   */
  getCareerPageAll(pagesize, pagneNo, orderBy, searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.getCareerPageAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: fetchJobNotesTotal function
     @Who: Adarsh Singh
   @When: 26-Feb-2022
   @Why: EWM-6224 EWM-6369
     @What: Api call for notes count
   */
  createCareerPage(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.createCareerPage, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: fetchJobNotesTotal function
     @Who: Adarsh Singh
   @When: 26-Feb-2022
   @Why: EWM-6224 EWM-6369
     @What: Api call for notes count
   */
  checkCareerPageDuplicacy(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.checkCareerPageDuplicacy, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: fetchJobNotesTotal function
     @Who: Adarsh Singh
   @When: 26-Feb-2022
   @Why: EWM-6224 EWM-6369
     @What: Api call for notes count
   */
  updateCareerPage(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.updateCareerPage, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: fetchJobNotesTotal function
     @Who: Adarsh Singh
   @When: 26-Feb-2022
   @Why: EWM-6224 EWM-6369
     @What: Api call for notes count
   */
  getByIdCareerPage(Id): Observable<any> {
    return this.http.get(this.serviceListClass.getByIdCareerPage + '?id=' + Id).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: fetchJobNotesTotal function
     @Who: Adarsh Singh
   @When: 26-Feb-2022
   @Why: EWM-6224 EWM-6369
     @What: Api call for notes count
   */
  deleteCareerPage(formData: any): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteCareerPage, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
     @Type: File, <ts>
     @Name: createNetworkPage function
     @Who: Adarsh Singh
   @When: 07-May-2022
   @Why: EWM-6220 EWM-6502
     @What: Api call for create
   */
  createNetworkPage(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.createNetworkPage, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
     @Type: File, <ts>
     @Name: getActiveJobAll function
     @Who: Suika
     @When: 16-May-2022
     @Why: EWM-6606 EWM-6720
     @What:  get All Data by serch
     */
  getActiveJobAll(isActive?) {
    return this.http.get(this.serviceListClass.getActiveJobAll + '?isActive=' + isActive).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getApplicationFormAll function
    @Who: Adarsh Singh
    @When: 13-May-2022
    @Why: EWM-6552 EWM-6672
    @What: Api call for get data
   */
  getApplicationFormAll(pagesize, pagneNo, orderBy, searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.getApplicationFormAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getApplicationFormAll function
    @Who: Adarsh Singh
    @When: 06-OCt-2022
    @Why: EWM-6552 EWM-6672
    @What: Api call for get data
   */
  getApplicationFormAllWithoutFilter(pagesize, pagneNo, orderBy, searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.getApplicationFormAll + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: updateIsDefault function
  @Who: Adarsh Singh
  @When: 13-May-2022
  @Why: EWM-6552 EWM-6672
  @What: Api update for is default is on or off
   */
  updateIsDefault(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateIsDefault, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkApplicationDuplicacy function
  @Who: Adarsh Singh
  @When: 13-May-2022
  @Why: EWM-6552 EWM-6672
  @What: Api calling for check duplicacy data
   */
  checkApplicationDuplicacy(formData): Observable<any> {
    return this.http.post(this.serviceListClass.applicationDuplicacy, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: addApplicationForm function
  @Who: Adarsh Singh
  @When: 13-May-2022
  @Why: EWM-6552,EWM-6673
  @What: Api calling for create
   */
  addApplicationForm(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createApplicationForm, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getByIdApplicationForm function
  @Who: Adarsh Singh
  @When: 16-May-2022
  @Why: EWM-6552,EWM-6673
  @What: get by id data
   */
  getByIdApplicationForm(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getByIdApplicationForm + '?id=' + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createUpdateWelcomePage function
  @Who: Anup Singh
  @When: 17-May-2022
  @Why: EWM-6554 EWM-6678
  @What: Api update and save
   */
  createUpdateWelcomePage(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createWelcomePage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  fetchWelComePageDataById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getWelcomeFormData + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createUpdatePersonalInfoFormPage function
  @Who: Adarsh singh
  @When: 18-05-2022
  @Why: EWM-6553 EWM-6709
  @What: Api update and save
   */
  createUpdatePersonalInfoFormPage(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createPersonalInfoPage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchPersonalInfoFormPageById function
  @Who: Adarsh singh
  @When: 18-05-2022
  @Why: EWM-6553 EWM-6709
  @What: get data by id
   */
  fetchPersonalInfoFormPageById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.fetchPersonalInfoById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getFormDocumentAllPage function
  @Who: Adarsh singh
  @When: 19-05-2022
  @Why: EWM-6550 EWM-6696
  @What: Api call for get data
  */
  getFormDocumentAllPage(Id, pagneNo, pagesize, orderBy, searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.getFormDocumnetPage + Id + '&PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + orderBy + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createDocumentPage function
  @Who: Adarsh singh
  @When: 19-05-2022
  @Why: EWM-6550 EWM-6696
  @What: Api update and save
   */
  createDocumentPage(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createDocumentPage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: createKnockoutQuestion function
  @Who: Nitin Bhati
  @When: 18-May-2022
  @Why: EWM-6554 EWM-6678
  @What: Api save
   */
  createKnockoutQuestion(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createKnockoutQuestion, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: fetchKnockoutQuestionDataById function
  @Who: Nitin Bhati
  @When: 18-May-2022
  @Why: EWM-6554 EWM-6678
  @What: Api Get data by Id
   */
  fetchKnockoutQuestionDataById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getKnockoutQuestionById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getKnockoutQuestionAll function
  @Who: Nitin Bhati
  @When: 18-May-2022
  @Why: EWM-6554 EWM-6678
  @What: Api Get data All
   */
  getKnockoutQuestionAll(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getKnockoutQuestionAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: deleteKnockoutQuestionById function
  @Who: Nitin Bhati
  @When: 18-May-2022
  @Why: EWM-6554 EWM-6678
  @What: Api Delete data  by Id
   */
  deleteKnockoutQuestionById(formData: any): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteKnockoutQuestionById, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: updateKnockoutQuestion function
  @Who: Nitin Bhati
  @When: 18-May-2022
  @Why: EWM-6554 EWM-6678
  @What: Api update
   */
  updateKnockoutQuestion(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateKnockoutQuestion, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkKnockoutQuestion function
  @Who: Nitin Bhati
  @When: 22-May-2022
  @Why: EWM-6554 EWM-6678
  @What: check knockoutQuestion name duplicacy
   */
  checkKnockoutQuestion(formData): Observable<any> {
    return this.http.post(this.serviceListClass.checkKnockoutQuestion, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getApplicationformConfigurationById function
  @Who: Nitin Bhati
  @When: 23-May-2022
  @Why: EWM-6554 EWM-6678
  @What: Api Application configuration data
   */
  getApplicationformConfigurationById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getAppformConfigById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchConfigStepperById function
  @Who: Renu
  @When: 23-May-2022
  @Why: EWM-6558 EWM-6782
  @What: to get the config Stepper by Id
  */

  fetchConfigStepperById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.applicationConfigStepById + formData).pipe(
      retry(1),
      catchError(handleError)
    )
  }

  /*
  @Name: createApplicationformConfiguration function
  @Who: Nitin Bhati
  @When: 22-May-2022
  @Why: EWM-6554 EWM-6678
  @What: For create form application data
   */
  createApplicationformConfiguration(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createApplicationformConfiguration, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: sectionUpdate function
  @Who: Renu
  @When: 08-Oct-2022
  @Why: EWM-8902 EWM-9112
  @What: section Update
   */
  sectionUpdate(formData): Observable<any> {
    return this.http.post(this.serviceListClass.sectionUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: cloneApplicationForm function
  @Who: Nitin Bhati
  @When: 26-May-2022
  @Why: EWM-6556,EWM-6686
  @What: Api calling for create clone
   */
  cloneApplicationForm(formData): Observable<any> {
    return this.http.post(this.serviceListClass.cloneApplicationForm, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: setDefaultlocation function
  @Who:  maneesh
  @When: 03-06-2022
  @Why: EWM-6812,EWM-6989
  @What: Api update and save
   */
  setDefaultlocation(formData): Observable<any> {
    return this.http.post(this.serviceListClass.setDefaultlocation, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createUpdateCandidateRank function
  @Who: Adarsh Singh
  @When: 26-Feb-2022
  @Why: EWM-7067 EWM-7080
  @What: Api call for update and create candiate Rank
   */
  createUpdateCandidateRank(FormData): Observable<any> {
    return this.http.post(this.serviceListClass.updateCandiateRank, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createUpdateCandidateRank function
  @Who: Adarsh Singh
  @When: 26-Feb-2022
  @Why: EWM-7067 EWM-7080
  @What: Api call for update and create candiate Rank
   */
  getApplicationJobMappingToJob(jobId, searchVal, pagneNo, pagesize, orderBy): Observable<any> {
    return this.http.get(this.serviceListClass.getapplicationFormMappingToJob + '?JobId=' + jobId + '&search=' + searchVal + '&PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&OrderBy=' + orderBy + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: getJobPublishDetail function
  @Who:  maneesh
  @When: 10-jun-2022
  @Why:  EWM-6872-EWM-7186
  @What: Api update and save
   */
  getJobPublishDetail(formData): Observable<any> {
    return this.http.get(this.serviceListClass.jobpublisheddetails + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createUpdateCandidateRank function
  @Who: Adarsh Singh
  @When: 26-Feb-2022
  @Why: EWM-7067 EWM-7080
  @What: Api call for update and create candiate Rank
   */
  updateApplicationJobMappingToJob(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateapplicationFormMappingToJob, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: checkCandidateExists function
  @Who: Renu
  @When: 15-06-2022
  @Why: EWM-7151 EWM-7233
  @What: check candidate Exists while appliying from external link
   */
  checkCandidateExists(formData): Observable<any> {
    return this.http.get(this.serviceListClass.checkCandidateExists + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: saveApplicationPreview function
  @Who: Renu
  @When: 15-06-2022
  @Why: EWM-7151 EWM-7233
  @What: save application preview form data
   */
  saveApplicationPreview(formData): Observable<any> {
    return this.http.post(this.serviceListClass.saveApplicationPreview, formData).pipe(
      retry(1),
      catchError(handleError)
    );

  }



  /*
  @Type: File, <ts>
  @Name: getPersonalInfo function
  @Who: Suika
  @When: 22-06-2022
  @Why: EWM-5334 EWM-7001
  @What: save application preview form data
   */
  getPersonalInfo(formData): Observable<any> {
    return this.http.get(this.serviceListClass.candidatePersonalInfo + formData).pipe(
      retry(1),
      catchError(handleError)
    );

  }

  /*
  @Type: File, <ts>
  @Name: getPersonalInfo function
  @Who: Suika
  @When: 22-06-2022
  @Why: EWM-5334 EWM-7001
  @What: save application preview form data
   */
  getCandidateKnockoutInfo(formData): Observable<any> {
    return this.http.get(this.serviceListClass.candidateKnockoutInfo + formData).pipe(
      retry(1),
      catchError(handleError)
    );

  }

  /*
  @Type: File, <ts>
  @Name: getCandidateDocumentInfo function
  @Who: Suika
  @When: 22-06-2022
  @Why: EWM-5334 EWM-7001
  @What: save application preview form data
   */
  getCandidateDocumentInfo(formData): Observable<any> {
    return this.http.get(this.serviceListClass.candidateDocumentInfo + formData).pipe(
      retry(1),
      catchError(handleError)
    );

  }

  /*
     @Type: File, <ts>
     @Name: getJobLogDetails function
     @Who: Suika
     @When: 04-July-2022
     @Why: EWM-7401 EWM-7509
     @What:  Get Data For functional job log By Id
     */

  getJobLogDetails(pageNo, pageSize, jobIdData, FromDate, ToDate, sortingValue) {
    return this.http.get(this.serviceListClass.getJobLogHistory + '?PageNumber=' + pageNo + '&PageSize=' + pageSize + '&jobId=' + jobIdData + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&OrderBy=' + sortingValue).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: sendOtp function
    @Who: Renu
    @When: 05-July-2022
    @Why: EWM-7404 EWM-7516
    @What:send otp for exisiting candidate apply through application form
    */
  sendOtp(formData): Observable<any> {
    return this.http.post(this.serviceListClass.sendOtp, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: candidateDetails function
  @Who: Renu
  @When: 05-July-2022
  @Why: EWM-7404 EWM-7516
  @What: candidate application personal Info fetech data
  */
  candidateDetails(formData): Observable<any> {
    return this.http.get(this.serviceListClass.candidateDetails + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: shareJobApplicationUrl function
  @Who: Suika
  @When: 05-July-2022
  @Why: EWM-6969.EWM-7521
  @What:share job application to candidates
  */
  shareJobApplicationUrl(formData): Observable<any> {
    return this.http.post(this.serviceListClass.sharejobapplicationurl, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createShareableLinkWithName function
  @Who: Renu
  @When: 28-Nov-2024
  @Why: EWM-17954 EWM-18882
  @What:share job application to candidates
  */
  
  createShareableLinkWithName(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createShareableLinkWithName, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: createJobCallLog function
   @Who: Suika
   @When: 05-July-2022
   @Why: EWM-6969.EWM-7521
   @What:share job application to candidates
   */
  createJobCallLog(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createJobCallLog, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: jobworkFlowBypipeId
  @Who: Renu
  @When:24-Aug-2021
  @Why: ROST-2627
  @What: get Job workflow pipline data by ID from APi
  */
  jobworkFlowChildById(formData) {
    return this.http.get(this.serviceListClass.jobworkFlowChildById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
@Name: deleteSavedConfig
@Who: Renu
@When: 04-Aug-2022
@Why: EWM-6129 EWM-8108
@What: delete config save filter
*/

  deleteSavedConfig(formData): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteSavedConfig, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: getJobCountWithIcon function
@Who: maneesh
@When: 31-Aug-2022
@Why: EWM-8432
@What: Api call for gettig count data in grid
*/

  getJobCountWithIcon(searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.getJobsCount + '?search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getGroupChecklistList
     @Who: Nitin Bhati
     @When: 03-Aug-2022
     @Why: EWM-8085
     @What: get Group Checklist list data
     */
  getGroupChecklistList(formData) {
    return this.http.get(this.serviceListClass.groupCheckListAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getGroupChecklistListDetails(pagesize, pagneNo, sortingValue, searchVal, filterConfig) {
    return this.http.get(this.serviceListClass.groupCheckListAll + '?PageSize=' + pagesize + '&PageNumber=' + pagneNo + '&OrderBy=' + sortingValue + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: getActiveJobAllWithJobId function
 @Who: Nitin Bhati
 @When: 07-Sep-2022
 @Why: EWM-8485
 @What:  get All Data by serch
 */
  getActiveJobAllWithJobId(JobId) {
    return this.http.get(this.serviceListClass.getActiveJobAllWithJobId + '?jobId=' + JobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Type: File, <ts>
   @Name: getJobsummaryHeaderSourcepichart
   @Who: Suika
   @When: 12-Sep-2022
   @Why: EWM-7478
   @What: getJobsummaryHeaderSourcepichart list data
   */
  getJobsummaryHeaderSourcepichart(formData) {
    return this.http.get(this.serviceListClass.getJobsummaryHeaderSourcepichart + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getApplicationDefault function
  @Who: Renu
  @When: 27-Sep-2022
  @Why: EWM-7875 EWM-8992
  @What: Api call for get data for application default
  */
  getApplicationDefault(): Observable<any> {
    return this.http.get(this.serviceListClass.getApplicationFormAll + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&IsDefaultOnly=true').pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: fetchThankYouDataById function
  @Who: Renu
  @When: 27-Sep-2022
  @Why: EWM-8901 EWM-9096
  @What: Api call for get data for thank you page data
  */
  fetchThankYouDataById(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getThankYouInfo + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createThankYouInfo function
  @Who: Renu
  @When: 27-Sep-2022
  @Why: EWM-8901 EWM-9096
  @What: Api call for get data for thank you page data
  */
  createThankYouInfo(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createThankYouInfo, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: sectionCheck function
  @Who: Renu
  @When: 08-Oct-2022
  @Why: EWM-8902 EWM-9112
  @What: section duplicacy check
   */
  sectionCheck(formData): Observable<any> {
    return this.http.post(this.serviceListClass.checkSection, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
 @Type: File, <ts>
 @Name: fetchCoverDetails function
 @Who: maneesh
 @When:  06-May-2022
 @Why: EWM-6605 EWM-6720
 @What: Api call for total active count and discription
*/

  getAppChartCandidate(formData) {
    return this.http.get(this.serviceListClass.getAppChartCandidate + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: getChecklistDetails function
@Who: Renu
@When: 13-Oct-2022
@Why: EWM-8801 EWM-9167
@What: Api call for get data for checklist
*/
  getChecklistDetails(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getChecklistDetails + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Name: updateChecklistInfo function
  @Who: Renu
  @When: 15-Oct-2022
  @Why: EWM-8801 EWM-9167
  @What: update checklist info
   */
  updateChecklistInfo(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateChecklistInfo, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: downloadCheckList function
  @Who: Renu
  @When: 06-Oct-2022
  @Why: EWM-8801 EWM-9167
  @What: download checklist info
   */
  downloadCheckList(formData): Observable<any> {
    return this.http.post(this.serviceListClass.downloadCheckList, formData, {
      reportProgress: true,
      responseType: 'blob',
    })
      .pipe(retry(0), catchError(handleError));
  }

  /*
  @Name: mapChecklistDocument function
  @Who: Renu
  @When: 06-Oct-2022
  @Why: EWM-8801 EWM-9167
  @What: map checklist info document
   */
  mapChecklistDocument(formData): Observable<any> {
    return this.http.post(this.serviceListClass.mapChecklistDocument, formData)
      .pipe(retry(0), catchError(handleError));
  }

  /*
    @Type: File, <ts>
    @Name: postDownloadApplicationForm function
    @Who: Nitin Bhati
    @When: 16-Oct-2022
    @Why: EWM-9161
    @What: Api for download application form
  */
  postDownloadApplicationForm(JobId, CandidateId): Observable<any> {
    return this.http.get(this.serviceListClass.getDownloadApplicationForm + '?JobId=' + JobId + '&CandidateId=' + CandidateId, { responseType: 'blob' }).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  getApplicationFormByJobId(CandidateId, JobId): Observable<any> {
    return this.http.get(this.serviceListClass.getApplicationFormByJobId + '?JobId=' + JobId + '&CandidateId=' + CandidateId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getImportantLinksAll function
  @Who: Adarsh singh
  @When: 27-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: Api Get data All
   */
  getImportantLinksAll(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getImportantsLinksAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
  @Type: File, <ts>
  @Name: getImportantLinksAll function
  @Who: Adarsh singh
  @When: 27-Oct-2022
  @Why: EWM-8897 EWM-9270
  @What: Api Get data All
   */
  createUpdateImportantLinksAll(formData): Observable<any> {
    return this.http.post(this.serviceListClass.createUpdateImportantsLinksAll, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getDefaultWorkflow
    @Who: Renu
    @When: 30-Dec-2022
    @Why: EWM-9388 EWM-10001
    @What: get Default workflow for first and last stage
    */
  getDefaultWorkflow() {
    return this.http.get(this.serviceListClass.getDefaultWorkflow).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: workflowapplicationstages
     @Who: Renu
     @When: 03-Jan-2023
     @Why: EWM-9388 EWM-10001
     @What: get  workflow stages
     */
  workflowapplicationstages() {
    return this.http.get(this.serviceListClass.workflowapplicationstages).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getJobPostingdetailsById(jobId) {
    return this.http.get(this.serviceListClass.getJobPostingDetailByID + "?jobId=" + jobId).pipe(
      retry(1),
      catchError(handleError)
    );

  }

  /*
    @Type: File, <ts>
    @Name: getDefaultWorkflow
    @Who: Adarsh singh
    @When: 11-Jan-2023
    @Why: EWM-9388 EWM-10089
    @What: share assessment data from job action
  */
  shareAssessment(formData: any) {
    return this.http.post(this.serviceListClass.shareAssessment, formData).pipe(retry(1), catchError(handleError));
  }
  /*
    @Type: File, <ts>
    @Name: getShareAssessment
    @Who: Adarsh singh
    @When: 11-Jan-2023
    @Why: EWM-10028 EWM-10090
    @What: get assessment data from job action
  */
  getShareAssessment(id: any) {
    return this.http.get(this.serviceListClass.getShareAssessment + id).pipe(retry(1), catchError(handleError));
  }
  /*
   @Type: File, <ts>
   @Name: jobWithoutWorkflow
   @Who: maneesh
   @When: 31-jan-2023
   @Why:  EWM-1823
   @What: For search asign  job category service
    */
  /*** @When: 01-03-2023 @Who:Renu @Why: EWM-10970 EWM-11002 @What: job assign search not working as passing wrng data withput search param**/
  jobWithoutWorkflow(pagesize, pagneNo, sortingValue, searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.jobWithoutWorkflow + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + sortingValue + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  jobWithoutWorkflowV3(pagesize, pagneNo, sortingValue, searchVal): Observable<any> {
    return this.http.get(this.serviceListClass.jobWithoutWorkflowV3 + '?PageNumber=' + pagneNo + '&PageSize=' + pagesize + '&orderBy=' + sortingValue + '&search=' + searchVal).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: CandidateMappedJobAsignJob function
    @Who: maneesh
    @When: 31-jan-2023
    @Why:  EWM-1823
    @What: Api call for AsignJob
  */
  CandidateMappedJobAsignJob(formData): Observable<any> {
    return this.http.post(this.serviceListClass.CandidateMappedJobAsignJobV2, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: CandidateAlljobTimeLine function
    @Who: maneesh
    @When: 14-feb-2023
    @Why:  EWM-10033
    @What: Api call for view job TimeLine in xeople search
  */
  CandidateAlljobTimeLine(formData): Observable<any> {
    return this.http.get(this.serviceListClass.CandidateAlljobTimeLine + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: CandidateJobCount function
    @Who: Renu
    @When: 02-MAY-2023
    @Why:  EWM-11814 EWM-12293
    @What: get candidate job count API
  */
  CandidateJobCount(workflowId: string): Observable<any> {
    return this.http.get(this.serviceListClass.checkWorkflowMapping + '?workflowid=' + workflowId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
      @Type: File, <ts>
      @Name: jobScreeningHeader function
      @Who: Renu
      @When: 23-MAY-2023
      @Why:  EWM-11814 EWM-12293
      @What: get candidate screening header
    */
  jobScreeningHeader(stageId: string, jobId: string): Observable<any> {
    return this.http.get(this.serviceListClass.jobScreeningHeader + '?stageId=' + stageId + '&jobId=' + jobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: jobScreeningCandidateDetails function
    @Who: Renu
    @When: 24-MAY-2023
    @Why:  EWM-11814 EWM-12293
    @What: get candidate details information on poup click
  */
  jobScreeningCandidateDetails(candidateId: string, jobId: string): Observable<any> {
    return this.http.get(this.serviceListClass.candidateResumeCoverLetter + '?candidateId=' + candidateId + '&jobId=' + jobId).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Type: File, <ts>
   @Name: jobactivityChecklistCount function
   @Who: Renu
   @When: 25-May-2023
   @Why:  EWM-11811 EWM-12517
   @What: get candidate details information on poup click
 */
  jobactivityChecklistCount(formdata): Observable<any> {
    return this.http.post(this.serviceListClass.jobactivityChecklistCount, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getcanJobActivities function
    @Who: Renu
    @When: 25-May-2023
    @Why:  EWM-11811 EWM-12517
    @What: get candidate Job avtivity details (completed/ total)
  */
  getcanJobActivities(formdata): Observable<any> {
    return this.http.post(this.serviceListClass.getcanJobActivities, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: getReasonByShortDesc function
  @Who: Adarsh singh
  @When: 25-May-2023
  @Why:  EWM-11779 EWM-12547
  @What: get reason by stage id
*/
  getReasonByShortDesc(formdata): Observable<any> {
    return this.http.get(this.serviceListClass.getReasonByShortDesc + formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
 @Type: File, <ts>
 @Name: hideWorkflowStage
 @Who: Suika
 @When:30-05-2023
 @Why: ROST-11782
 @What: hide workflowStages from APi
 */
  hideWorkflowStage(formData) {
    return this.http.post(this.serviceListClass.hideWorkflowStage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getJobPublishDetail function
    @Who:  Adarsh singh
    @When: 01-jun-2023
    @Why:  EWM-12604-EWM-12665
    @What: get all job published boards
  */
  GETJobBoardPublishedDetailsOfBroadben(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getJobBoardsPublishedDetails + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
    @Type: File, <ts>
    @Name: getAllNextStages_v2 function
    @Who:  Adarsh singh
    @When: 01-jun-2023
    @Why:  EWM-12604-EWM-12665
    @What: get all next stages
  */
  getAllNextStages_v2(formData) {
    return this.http.get(this.serviceListClass.getAllNextStagesv2 + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getJobActionNotes function
     @Who: Bantee
     @When: 5-June-2023
     @Why: EWM-11780 EWM-12635
     @What: to get the data of created notes
   */

  getJobActionNotes(formData) {
    return this.http.post(this.serviceListClass.getJobActionNotesDate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  //  @Type: File, <ts>
  //  @Name: checkCandidateMoveAction
  //  @Who:  Adarsh singh
  //   @When: 01-jun-2023
  //   @Why:  EWM-12604-EWM-12665
  //   @What: check candidate stages
  //  */
  checkCandidateMoveAction(formData) {
    return this.http.post(this.serviceListClass.checkCandidateMoveAction, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
   @Type: File, <ts>
   @Name: hideWorkflowStage
   @Who: Renu
   @When:01-06-2023
   @Why: ROST-11779
   @What: get details on workflow stage change
   */
  jobCandidateMappedAll(formData) {
    return this.http.post(this.serviceListClass.jobCandidateMappedAll, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: getJobActionNotesCount
 @Who: Bantee
 @When:05-06-2023
 @Why: EWM-11780 EWM-12635
 @What: get details on job action notes Count
 */

  getJobActionNotesCount(jobId, satgeId) {
    return this.http.get(this.serviceListClass.getJobActionNotesCount + '?jobId=' + jobId + '&stageId=' + satgeId).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
 @Type: File, <ts>
 @Name: getNotesCategoryList
 @Who: Bantee
 @When:05-06-2023
 @Why: EWM-11780 EWM-12635
 @What: get notes category dropdown list
 */
  getNotesCategoryList(category: any) {
    return this.http.get(this.serviceListClass.notesCategoryList + '?UserType=' + category + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
     @Type: File, <ts>
     @Name: getJobActionComments function
     @Who: Nitin Bhati
     @When:13-June-2023
     @Why:EWM-12640
     @What: to get the data of get Comments
   */
     getJobActionComments(formData) {
      return this.http.post(this.serviceListClass.getJobActionComments,formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    /*
     @Type: File, <ts>
     @Name: updateJobActionComments function
     @Who: Nitin Bhati
     @When:13-June-2023
     @Why:EWM-12640
     @What: to get the data of Update Comments
   */
     updateJobActionComments(formData) {
      return this.http.post(this.serviceListClass.updateJobActionComments,formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    /*
     @Type: File, <ts>
     @Name: addJobActionComments function
     @Who: Nitin Bhati
     @When:13-June-2023
     @Why:EWM-12640
     @What: to Add the data of Update Comments
   */
     addJobActionComments(formData) {
      return this.http.post(this.serviceListClass.addJobActionComments,formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /*
  @Type: File, <ts>
  @Name: deleteNotesCategory
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: delete Note category data by id
  */

  deleteJobActionComments(formData: any): Observable<any> {
    return this.http.request('delete', this.serviceListClass.deleteJobActionComments, { body: formData }).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
    @Type: File, <ts>
    @Name: getJobActionRecuirters function
    @Who:  Nitin Bhati
    @When: 15-jun-2023
    @Why:  EWM-12640
    @What: get data of recuirters
  */
    getJobActionRecuirters() {
      return this.http.get(this.serviceListClass.getJobActionRecuirters).pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /*
     @Type: File, <ts>
     @Name: setfilterConfig function
     @Who: maneesh
     @When: 03-july-2023
     @Why: EWM-12932
     @What: for for restore default config data
   */
     restoreDefaultConfig(formdata: any): Observable<any> {
      return this.http.request('delete', this.serviceListClass.restoreDefaultConfig, { body: formdata })
        .pipe(
          retry(1),
          catchError(handleError)
        )
    }

    /*
   @Type: File, <ts>
   @Name: getCandidatecountbyworkflowid_v1 function
   @Who: Nitin Bhati
   @When: 10-Aug-2023
   @Why: EWM-13273,EWM-13636
   @What:share job application to candidates
   */
   getCandidatecountbyworkflowid_v1(formData): Observable<any> {
    return this.http.post(this.serviceListClass.Candidatecountbyworkflowid_v1, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  /*
  @Type: File, <ts>
  @Name: createJob_V2_Notes function
  @Who: maneesh
  @When: 31-july-2023
  @Why: EWM-13770
  @What: Api call for create notes for job action candidate notes
*/
createJob_V2_Notes(FormData): Observable<any> {
  return this.http.post(this.serviceListClass.createJob_V2_Notes, FormData).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
 @Type: File, <ts>
 @Name: likeCandidate
 @Who: Suika
 @When:30-08-2023
 @Why: ROST-13813
 @What: like candidate from APi
 */
likeCandidate(formData) {
  return this.http.post(this.serviceListClass.likeCandidate, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}
/*
 @Type: File, <ts>
 @Name: applicantProfileUpdate
 @Who: Mukesh
 @When:05-12-2023
 @Why: EWM-15298
 @What: Sync updated information from Candidate Profile
 */
 applicantProfileUpdate(formData) {
  return this.http.post(this.serviceListClass.applicantProfileUpdate, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
 @Type: File, <ts>
 @Name: disLikeCandidate
 @Who: Suika
 @When:30-08-2023
 @Why: ROST-13813
 @What: dislike candidate from APi
 */
disLikeCandidate(formData) {
  return this.http.post(this.serviceListClass.disLikeCandidate, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
 @Type: File, <ts>
 @Name: pinUnpinCandidate
 @Who: Suika
 @When:30-08-2023
 @Why: ROST-13813
 @What:pin unpin candidate from APi
 */
pinUnpinCandidate(formData) {
  return this.http.post(this.serviceListClass.pinUnpinCandidate, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
 @Type: File, <ts>
 @Name: getWorkflowHierarchy
 @Who: Adarsh singh
 @When:12-09-2023
 @Why: ROST-13877
 @What: get getWorkflowHierarchy
 */
 getWorkflowHierarchy(formData) {
  return this.http.get(this.serviceListClass.GETworkflowhierarchy+ formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

getGroupChecklistListDetailsByPassPaging(sortingValue, searchVal) {
  return this.http.get(this.serviceListClass.groupCheckListAll + '?OrderBy=' + sortingValue + '&search=' + searchVal + '&ByPassPaging=' + true + '&FilterParams.FilterValue=' + 'active').pipe(
    retry(1),
    catchError(handleError)
  );
}
  /*
  @Type: File, <ts>
  @Name: updateJobStatusheaderData function
  @Who: maneesh
  @When: 20-sep-2023
  @Why: EWM-11774
  @What: Api call for edit status  for job details header
*/
updateJobStatusheaderData(formData) {
  return this.http.post(this.serviceListClass.updateJobStatus, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

  /*
 @Type: File, <ts>
 @Name: removeCandidate
 @Who: Adarsh Singh
 @When: 11-Oct-2023
 @Why: EWM-14697.EWM-14741
 @What:  Remove Candidate from job details
 */

 removeBulkCandidate(formdata: any): Observable<any> {
  return this.http.post(this.serviceListClass.removeCandidateV2, formdata)
    .pipe(
      retry(1),
      catchError(handleError)
    )
}

/*
       @Type: File, <ts>
       @Name: getJobDetailsByidV2 function
       @Who: Nitin Bhati
       @When: 15-Nov-2023
       @Why: EWM-14484
       @What: get Job data by id for Indeed
     */
       getJobDetailsByidV2(formData): Observable<any> {
        return this.http.get(this.serviceListClass.getJobdetailsByidV2 + formData).pipe(
          retry(1),
          catchError(handleError)
        );
      }

/*
@Name: getPostingIndeedDetails
@Who: Nitin Bhati
@When: 15-Nov-2023
@Why: EWM-14484
@What: get Indeed Branding
*/
getPostingIndeedDetails() {
  return this.http.get(this.serviceListClass.getPostingIndeedDetails).pipe(
    retry(1),
    catchError(handleError)
  );
}
/*
@Name: getClientHoldingName
@Who: Nitin Bhati
@When: 15-Nov-2023
@Why: EWM-14484
@What: get Client Holding Company name
*/
getClientHoldingName(formData): Observable<any> {
  return this.http.get(this.serviceListClass.clientSummaryHeader + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
    @Type: File, <ts>
    @Name: jobworkFlowBypipeIdV2
    @Who: Renu
    @When:08-nov-2023
    @Why: EWM-14999 EWM-15107
    @What: get Job workflow pipline data by ID from APi V2 version
    */
   jobworkFlowBypipeIdV2(formData) {
    return this.http.get(this.serviceListClass.jobworkFlowBypipeIdV2 + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  // adarsh singh for 15257 on 1 Dec 2023
    updateJobExpiryDays(formData) {
      return this.http.post(this.serviceListClass.updateJobExpiry , formData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

    /*
   @Type: File, <ts>
   @Name: getCandidatemappedtojobcardAll
   @Who: Suika
   @When:30-Sep-2021
   @Why: ROST-3084
   @What: getCandidatemappedtojobcardAll
   */
  getCandidatemappedtojobcardAllV2(formdata) {
    return this.http.post(this.serviceListClass.getCandidatemappedtojobcardAllV2, formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* @Name: getJobsCountByWorkFlowIdV2 function @Who: Renu @When: 23-01-2024 @Why: EWM-14463 EWM-15804 */
  getJobsCountByWorkFlowIdV2(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getJobsCountByWorkFlowIdV2 + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getRedirectedJobNotebyid(reqiestdata): Observable<any>{
    return this.http.get(this.serviceListClass.getRedirectedJobNotebyid+reqiestdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /* @Who: Renu @When: 09-04-2023 @Why:EWM-16594 EWM-16607 @What: set isDefault on listing page for job workflow */
setDefaultWorkflow(formData) {
  return this.http.get(this.serviceListClass.setDefaultWorkflow + '?WorkflowId='+ formData).pipe(
    retry(1),
    catchError(handleError)
  );
}
getJobNoteContactByJobId(requestData): Observable<any> {
  return this.http.get(this.serviceListClass.getContactByClientId+requestData).pipe(
    retry(1),
    catchError(handleError)
  );
}
pageDataChangeStatus(status){
  if(status){
    localStorage.setItem('jobDetailsPageEventStatus','1');
  }else{
    localStorage.removeItem('jobDetailsPageEventStatus');
    //localStorage.setItem('jobDetailsPageEventStatus','1');
  }
  
}
/*
      @Type: File, <ts>
      @Name: getjobactionconfiguration function
      @Who: Ankit Rawat
      @When: 12-Jun-2024
      @Why:  EWM-17249
      @What: get dynmaic job action menu
    */
getjobactionconfiguration(WorkflowId: string, StageType: string): Observable<any> {
  return this.http.get(this.serviceListClass.getjobactionconfiguration + '?WorkflowId=' + WorkflowId + '&StageType=' + StageType).pipe(
    retry(1),
    catchError(handleError)
  );
}

getJobActiontenantConfiguration() {
  return this.http.get(this.serviceListClass.getJobActiontenantConfiguration).pipe(
    retry(1),
    catchError(handleError)
  );
}
updateJobActionNameandDisplay(formdata) {
  return this.http.post(this.serviceListClass.updateJobActionNameandDisplay, formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}

updateJobActionStageTypeMapping(formdata) {
  return this.http.post(this.serviceListClass.updateJobActionStageTypeMapping, formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}
updateJobActionDisplaySequence(formdata) {
  return this.http.post(this.serviceListClass.updateJobActionDisplaySequence, formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}
//by maneesh Job-Landing.EWM-17228 when:19/06/2024
totalCandidateForJobLandingPage(formData) {
  return this.http.post(this.serviceListClass.totalCandidateForJobLandingPage , formData).pipe(
    retry(1),
    catchError(handleError)
  );
}
//by renu EWM-19590.EWM-19445 when:06/03/2025

getJobQualificationEOH(formData): Observable<any> {
  return this.http.get(this.serviceListClass.getJobQualificationEOH + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

//by renu EWM-19590.EWM-19445 when:06/03/2025

getJobShiftTypeEOH(formData): Observable<any> {
  return this.http.get(this.serviceListClass.getJobShiftTypeEOH + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

//by renu EWM-19590.EWM-19445 when:06/03/2025

shareJobEOH(formdata: any) {
  return this.http.post(this.serviceListClass.shareJobEOH, formdata).pipe(
    retry(1),
    catchError(handleError)
  );
}

}
