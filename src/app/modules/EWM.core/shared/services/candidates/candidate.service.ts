/*
@(C): Entire Software
@Type: File, <ts>
@Name: candidate.service.ts
@Who: Renu
@When: 10-Aug-2020
@Why: EWM-2020 EWM-2363
@What: Service Api's for candidates
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toDataSourceRequestString } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { handleError } from 'src/app/shared/helper/exception-handler';
import { ServiceListClass } from '../../../../../shared/services/sevicelist';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private candidateName = new BehaviorSubject('');
  currentCandidateName= this.candidateName.asObservable();
  /*
@Type: File, <ts>
@Name: candidate.service.ts
@Who: Renu
@When:  10-Aug-2020
@Why:  EWM-2020 EWM-2363
@What: constructor function
*/
  constructor(private serviceListClass: ServiceListClass, private http: HttpClient) { }


  /*
     @Type: File, <ts>
     @Name: fetchJoblist function
     @Who: Renu
     @When:  10-Aug-2020
     @Why: EWM-2020 EWM-2363
     @What: Api call for getting listing data in grid
   */

  fetchCandidatelist(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getCandidateList+ formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  /*
   @Name: getGeneralInformationList
   @Who: Anup
   @When: 12-Aug-2021
   @Why: EWM-2240 EWM-2414
   @What: get General Information list data
   */
  getCandidateSummaryList(formData) {
    return this.http.get(this.serviceListClass.getCandidateSummary + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
   @Name: updateCandidateImage
   @Who: Anup
   @When: 12-Aug-2021
   @Why: EWM-2240 EWM-2414
   @What: image update
   */
  updateCandidateImage(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateCandidateImage, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
@Type: File, <ts>
@Name: addFileUploadFile Function
@Who:  Renu
@When: 13-Aug-2021
@Why: EWM-2493
@What: Api call for uplading resume of candidate
*/

addFileUploadFile(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.uploadCandidateResume,formData).pipe(
     retry(1),
     catchError(handleError)
   );
  }

  /*
@Type: File, <ts>
@Name: FileUploadFile Function
@Who:  Renu
@When: 13-Aug-2021
@Why: EWM-2493
@What: Api call for uplading resume of candidate
*/

FileUploadFile(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.userProfileImageUpload+'?resources=resume',formData).pipe(
     retry(1),
     catchError(handleError)
   );
  }

/*
  @Type: File, <ts>
  @Name: fetchCandidateVersionHistory function
  @Who: Renu
  @When:  10-Aug-2020
  @Why: EWM-2241 EWM-2493
  @What: Api call for getting listing data in grid
*/

  fetchCandidateVersionHistory(formData) {
  return this.http.get(this.serviceListClass.getCandidateResumeById+formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

 /*
  @Name: getCandidateNotesList
  @Who: Suika
  @When: 12-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: get notes Information list data
  */
 getCandidateNotesList(formData) {
  // console.log("urlspace  "+this.serviceListClass.getCandidateNoteAll + formData);
  return this.http.get(this.serviceListClass.getCandidateNoteAll + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}



/*
  @Name: createCandidateNotes
  @Who: Suika
  @When: 12-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: create notes Information list data
  */
createCandidateNotes(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.createCandidateNote, formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}


/*
  @Name: updateCandidateTag
  @Who: Suika
  @When: 12-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: update notes Information list data
  */
updateCandidateNotes(formData): Observable<any> {
  return this.http.post(this.serviceListClass.updateCandidateNote, formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
    @Type: File, <ts>
    @Name: getAllSkillsData function
    @Who: Anup
    @When: 16-Aug-2021
    @Why: EWM-2242.EWM-2507
    @What: Get Skills List
    */

getAllSkillsData(formData) {
  return this.http.get(this.serviceListClass.getAllSkills + formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }



   /*
    @Name: deleteCandidateSkill
    @Who: Suika
    @When: 12-Nov-2021
   @Why: EWM-3556 EWM-3643
    @What: delete candidate ewergency Contact Information list data
    */


    deleteCandidateSkill(formData) : Observable<any>{
      return this.http.post(this.serviceListClass.deleteCandidateSkillsById ,formData).pipe(
        retry(1),
        catchError(handleError)
      );
      }




  /*
    @Type: File, <ts>
    @Name: getAllSkillsData function
    @Who: suika
    @When: 11-Nov-2021
    @Why: EWM-3556.EWM-3643
    @What: Get Skills List
    */

getCanAllSkillsData(formData) {
  return this.http.get(this.serviceListClass.getCandidateSkillsAll + formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

  /*
    @Type: File, <ts>
    @Name: getCanSkillsById function
    @Who: Suika
    @When: 12-Nov-2021
    @Why: EWM-3556.EWM-3643
    @What: Get Skills List
    */

getCanSkillsById(formData) {
  return this.http.get(this.serviceListClass.getCandidateSkillsById + formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

/*
    @Type: File, <ts>
    @Name: addSkillsData function
    @Who: Anup
    @When: 16-Aug-2021
    @Why: EWM-2242.EWM-2507
    @What: Add Skills
    */
  addSkillsData(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.addSkills, formData ).pipe(
      retry(1),
      catchError(handleError)
    );
}


/*
    @Type: File, <ts>
    @Name: addSkillsData function
    @Who: Anup
    @When: 16-Aug-2021
    @Why: EWM-2242.EWM-2507
    @What: Add Skills
    */
   addcanSkillsData(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createCandidateSkills, formData ).pipe(
      retry(1),
      catchError(handleError)
    );
}

 /*
    @Type: File, <ts>
    @Name: updateSkillsData function
    @Who: Anup
    @When: 16-Aug-2021
    @Why: EWM-2242.EWM-2507
    @What: Update Skills
    */
updateSkillsData(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.updateSkills, formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}



/*
    @Type: File, <ts>
    @Name: updateCanSkillsData function
    @Who: Anup
    @When: 16-Aug-2021
    @Why: EWM-2242.EWM-2507
    @What: Update Skills
    */
   updateCanSkillsData(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateCandidateSkills, formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }
/*
@Type: File, <ts>
@Name: deleteIndustryById function
@Who: Suika
@When: 16-Aug-2021
@Why: EWM-2376 EWM-2214
@What: Api call for delete Industry data
*/
deleteNotesById(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.deleteCandidateNote ,formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

  /*****************Address candidate Start *******************/

  /*
  @Name: createCandidateAddress
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: create candidate address Information list data
  */
  createCandidateAddress(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.createCandidateAdress, formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
  @Name: deleteCandidateAddress
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: delete candidate address Information list data
  */

  deleteCandidateAddress(formData) : Observable<any>{
  return this.http.request('delete',this.serviceListClass.deleteCandidateAdress ,{body: formData}).pipe(
    retry(1),
    catchError(handleError)
  );
  }

 /*
  @Name: getCandidateAdressAll
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: get candidate address Information list data
  */
  getCandidateAdressAll(formData) {
    return this.http.get(this.serviceListClass.getCandidateAdressAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
    }

    /*
  @Name: getCandidateAdressById
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: get candidate address Information list data
  */
  getCandidateAdressById(formData) {
    return this.http.get(this.serviceListClass.getCandidateAdressById + formData).pipe(
      retry(1),
      catchError(handleError)
    );
    }

    /*
  @Name: updateCandidateAddress
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: uddate candidate address Information list data
  */
  updateCandidateAddress(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.updateCandidateAdress, formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Name: checkTypeDuplicay
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: check type duplicacy
  */
  checkTypeDuplicay(formData): Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.checkAdressTypeIsExists+formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

/*****************Address candidate End *******************/

/*****************EDUCATIONS *******************/

/*
  @Name: getCandidateNotesList
  @Who: Suika
  @When: 12-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: get notes Information list data
  */
 getCandidateEducationList(formData) {
 // console.log("urlspace  "+this.serviceListClass.getCandidateEducationAll + formData);
 return this.http.get(this.serviceListClass.getCandidateEducationAll + formData).pipe(
   retry(1),
   catchError(handleError)
 );
}


/*
  @Name: getCandidateEducationListById
  @Who: Suika
  @When: 12-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: get notes Information list data
  */
 getCandidateEducationListById(formData) {
 return this.http.get(this.serviceListClass.getCandidateEducationById + formData).pipe(
   retry(1),
   catchError(handleError)
 );
}


/*
 @Name: createCandidateEducation
 @Who: Suika
 @When: 12-Aug-2021
 @Why: EWM-2376 EWM-2214
 @What: create notes Information list data
 */
createCandidateEducation(formData): Observable<any> {
 return this.http.post<any[]>(this.serviceListClass.createCandidateEducation, formData ).pipe(
   retry(1),
   catchError(handleError)
 );
}


/*
 @Name: updateCandidateEducation
 @Who: Suika
 @When: 12-Aug-2021
 @Why: EWM-2376 EWM-2214
 @What: update notes Information list data
 */
updateCandidateEducation(formData): Observable<any> {
 return this.http.post(this.serviceListClass.updateCandidateEducation, formData).pipe(
   retry(1),
   catchError(handleError)
 );
}




/*
@Type: File, <ts>
@Name: deleteCandidateEducation function
@Who: Suika
@When: 16-Aug-2021
@Why: EWM-2376 EWM-2214
@What: Api call for delete Industry data
*/
deleteEducationById(formData) : Observable<any>{
 return this.http.post(this.serviceListClass.deleteCandidateEducation ,formData).pipe(
   retry(1),
   catchError(handleError)
 );
 }


/*
    @Type: File, <ts>
    @Name: getCandidateMappingTagList function
    @Who: Anup
    @When: 18-Aug-2021
    @Why: EWM-2240.EWM-2547
    @What: get Candidate MappingTagList
    */
 getCandidateMappingTagList(formData) {
 return this.http.get(this.serviceListClass.candidateMappingTagList + formData).pipe(
   retry(1),
   catchError(handleError)
 );
}

/*
    @Type: File, <ts>
    @Name: updateCandidateMappingTagList function
    @Who: Anup
    @When: 18-Aug-2021
    @Why: EWM-2240.EWM-2547
    @What: Update Candidate Mapping Tag List
    */
   updateCandidateMappingTagList(formData): Observable<any> {
    return this.http.post<any>(this.serviceListClass.CandidateMappingTagList, formData ).pipe(
    retry(1),
    catchError(handleError)
    );
  }

 /*
@Type: File, <ts>
@Name: getScoreTypeList function
@Who:  Suika
@When: 17-Aug-2021
@Why: EWM-2127 EWM-2243
@What: For showing the list of Score Type data
*/

 getScoreTypeList() {
  return this.http.get(this.serviceListClass.scoreTypeList).pipe(
    retry(1),
    catchError(handleError)
  );
}



 /*
@Type: File, <ts>
@Name: getScoreTypeList function
@Who:  Suika
@When: 17-Aug-2021
@Why: EWM-2127 EWM-2243
@What: For showing the list of Score Type data
*/

getDegreeTypeList(formData) {
  return this.http.get(this.serviceListClass.degreeTypeList + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}


 /*
@Type: File, <ts>
@Name: getQualificationList function
@Who:  Suika
@When: 17-Aug-2021
@Why: EWM-2127 EWM-2243
@What: For showing the list of Qualification Type data
*/

getQualificationList() {
  return this.http.get(this.serviceListClass.qualificationList).pipe(
    retry(1),
    catchError(handleError)
  );
}

  /******************Emergency Contacts candidate Start *******************/

  /*
  @Name: createEmergencyContacts
  @Who: Renu
  @When: 18-Aug-2021
  @Why: EWM-2196 EWM-2430
  @What: create Emergency Contact Information list data
  */
  createEmergencyContacts(formData): Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.createEmergencyContact, formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }


   /*
    @Name: deleteEmergencyContact
    @Who: Renu
    @When: 18-Aug-2021
   @Why: EWM-2196 EWM-2430
    @What: delete candidate ewergency Contact Information list data
    */

    deleteEmergencyContact(formData) : Observable<any>{
    return this.http.request('delete',this.serviceListClass.EmergencyContactDelete ,{body: formData}).pipe(
      retry(1),
      catchError(handleError)
    );
    }

   /*
    @Name: getEmergencyContactAll
    @Who: Renu
     @When: 18-Aug-2021
   @Why: EWM-2196 EWM-2430
    @What: get candidate emergency contact Information list data
    */
    getEmergencyContactAll(formData) {
      return this.http.get(this.serviceListClass.getEmergencyContactList + formData).pipe(
        retry(1),
        catchError(handleError)
      );
      }

      /*
    @Name: getEmergencyContactById
    @Who: Renu
    @When: 18-Aug-2021
   @Why: EWM-2196 EWM-2430
    @What: get candidate emergency contact Information by Id
    */
    getEmergencyContactById(formData) {
      return this.http.get(this.serviceListClass.getEmergencyContactById + formData).pipe(
        retry(1),
        catchError(handleError)
      );
      }

      /*
    @Name: updateEmergencyContact
    @Who: Renu
    @When: 18-Aug-2021
   @Why: EWM-2196 EWM-2430
    @What: uddate candidate emergency contact Information list data
    */
    updateEmergencyContact(formData): Observable<any> {
      return this.http.post<any[]>(this.serviceListClass.EmergencyContactUpdate, formData ).pipe(
        retry(1),
        catchError(handleError)
      );
    }

  /*
    @Name: getRelationShipList
    @Who: Renu
    @When: 18-Aug-2021
    @Why: EWM-2196 EWM-2430
    @What: get relationship list data
    */
    getRelationShipList() {
      return this.http.get(this.serviceListClass.getRealtionShipList).pipe(
        retry(1),
        catchError(handleError)
      );
      }
    /*****************Emergency Contacts candidate End *******************/
  /*****************Emergency Contacts candidate End *******************/

/*****************dependent *******************/

/*
  @Name: getCandidatedependentList
  @Who: Suika
  @When: 12-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: get dependent Information list data
  */
 getCandidatedependentList(formData) {
 return this.http.get(this.serviceListClass.getCandidateDependentAll + formData).pipe(
   retry(1),
   catchError(handleError)
 );
}


/*
  @Name: getCandidatedependentListById
  @Who: Suika
  @When: 12-Aug-2021
  @Why: EWM-2376 EWM-2214
  @What: get notes Information list data
  */
 getCandidatedependentListById(formData) {
 return this.http.get(this.serviceListClass.getCandidateDependentById + formData).pipe(
   retry(1),
   catchError(handleError)
 );
}


/*
 @Name: createCandidateDependent
 @Who: Suika
 @When: 12-Aug-2021
 @Why: EWM-2376 EWM-2214
 @What: create notes Information list data
 */
createCandidateDependent(formData): Observable<any> {
 return this.http.post<any[]>(this.serviceListClass.createCandidateDependent, formData ).pipe(
   retry(1),
   catchError(handleError)
 );
}


/*
 @Name: updateCandidateDependent
 @Who: Suika
 @When: 12-Aug-2021
 @Why: EWM-2376 EWM-2214
 @What: update notes Information list data
 */
updateCandidateDependent(formData): Observable<any> {
 return this.http.post(this.serviceListClass.updateCandidateDependent, formData).pipe(
   retry(1),
   catchError(handleError)
 );
}




/*
@Type: File, <ts>
@Name: deleteDependentById function
@Who: Suika
@When: 16-Aug-2021
@Why: EWM-2376 EWM-2214
@What: Api call for delete Industry data
*/
deleteDependentById(formData) : Observable<any>{
 return this.http.post(this.serviceListClass.deleteCandidateDependent ,formData).pipe(
   retry(1),
   catchError(handleError)
 );
 }


  /*
  @Name: checkTypeDuplicay
  @Who: Renu
  @When: 16-Aug-2021
  @Why: EWM-2199 EWM-2531
  @What: check type duplicacy
  */
 checkDependentDuplicay(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.checkCandidateDependentExist,formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}


 /*
@Type: File, <ts>
@Name: getRelationshipList function
@Who:  Suika
@When: 20-Aug-2021
@Why: EWM-2127 EWM-2243
@What: For showing the list of Score Type data
*/

getRelationshipList(formData) {
  return this.http.get(this.serviceListClass.relationshipList+formData).pipe(
    retry(1),
    catchError(handleError)
  );
}


 /*
@Type: File, <ts>
@Name: getGenderList function
@Who:  Suika
@When: 20-Aug-2021
@Why: EWM-2127 EWM-2243
@What: For showing the list of Score Type data
*/

getGenderList() {
  return this.http.get(this.serviceListClass.genderList).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
@Type: File, <ts>
@Name: getAllGenderList function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For showing the list of gender List
*/
getAllGenderList(){
  return this.http.get(this.serviceListClass.genderList).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
@Type: File, <ts>
@Name: getAllLanguageList function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For showing the list of Language List
*/
getAllLanguageList(formData){
  return this.http.get(this.serviceListClass.getAllLanguage + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
@Type: File, <ts>
@Name: getAllNationalitiesList function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For showing the list of Nationalities List
*/
getAllNationalitiesList(formData){
  return this.http.get(this.serviceListClass.getAllNationality + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
@Type: File, <ts>
@Name: getAllAdditionalInfoData function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For showing the list of AdditionalInfo List
*/
getAllAdditionalInfoData(formData) {
  return this.http.get(this.serviceListClass.AllAdditionalInfoData + formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

 /*
@Type: File, <ts>
@Name: updateAdditionalInfoData function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For showing the updateAdditionalInfo
*/
updateAdditionalInfoData(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.UpdateAdditionalInfoData ,formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

   /*
@Type: File, <ts>
@Name: CreateAdditionalInfoData function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For showing the updateAdditionalInfo
*/
CreateAdditionalInfoData(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.CreateAdditionalInfoData ,formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }


  /***************************************dependent *****************************/

  /*
@Type: File, <ts>
@Name: deleteIndustryById function
@Who: Renu
@When: 27-Aug-2021
@Why: EWM-2240 EWM-2654
@What: Api call for delete candidate info
*/
deleteCandidateInfo(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.candidateInfoDelete ,formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }


  setCandidateName(name: string) {
    this.candidateName.next(name)
}
getDocumentCount(formData): Observable<any> {
  return this.http.get(this.serviceListClass.getDocumentCount+ formData).pipe(
    retry(1),
    catchError(handleError)
  );
}


/*
   @Type: File, <ts>
   @Name: getfilterConfigCandidate function
    @Who: Anup
   @When: 05-oct-2021
   @Why: EWM-3088 EWM-3138
   @What:  for presist filter getting config state
 */

getfilterConfigCandidate() {
  return this.http.get(this.serviceListClass.getfilterConfig+'?GridId=' + 'CandidateSummary_grid_001').pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
   @Type: File, <ts>
   @Name: setfilterConfig function
   @Who: Anup
   @When: 05-oct-2021
   @Why: EWM-3088 EWM-3138
   @What: for presist filter setting config
 */

setfilterConfigCandidate(formData): Observable<any>  {
  return this.http.post(this.serviceListClass.setfilterConfig,formData).pipe(
    retry(1),
    catchError(handleError)
  );
}



  /*
@Type: File, <ts>
@Name: deleteCandidateAdditionalInfo function
@Who: Suika
@When: 01-Dec-2021
@Why: EWM-3697 EWM-3867
@What: Api call for delete candidate info
*/
deleteCandidateAdditionalInfo(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.deleteAdditionalInfoData ,formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }



  /*
  @Name: parseResume
  @Who: Suika
  @When: 12-Dec-2021
  @Why: EWM-4147
  @What: parseResume data
  */
 parseResume(formData) {
  return this.http.post(this.serviceListClass.parseResume,formData).pipe(
    retry(1),
    catchError(handleError)
  );
}

  /*
  @Name: getResumeDetailsById
  @Who: Suika
  @When: 12-Dec-2021
  @Why: EWM-4147
  @What: parseResume data
  */
 getResumeDetailsById(formData) {
  return this.http.get(this.serviceListClass.getResumeByCandidateId+formData).pipe(
    retry(1),
    catchError(handleError)
  );
}


  /*
@Type: File, <ts>
@Name: FileUploadClient Function
@Who:  Renu
@When: 15-Dec-2021
@Why: EWM-3571 EWM-4175
@What: Api call for uplading docs for client
*/

FileUploadClient(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.siteLogoupload+'?resources=document',formData).pipe(
     retry(1),
     catchError(handleError)
   );
  }

   /*
   @Type: File, <ts>
   @Name: fetchNotesTotal function
   @Who: Renu
   @When: 14-Dec-2021
   @Why: EWM-3751 EWM-4175
   @What: Api call for Client Note
 */
   fetchNotesTotal(FormData): Observable<any>{
    return this.http.get(this.serviceListClass.candidateNoteCount+ FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



  /*
   @Type: File, <ts>
   @Name: fetchClientNotesAll function
   @Who: Renu
   @When: 14-Dec-2021
   @Why: EWM-3751 EWM-4175
   @What: Api call for get list for all notes
 */
   fetchNotesAll(FormData): Observable<any>{
    return this.http.post(this.serviceListClass.candidateFilterNoteByYear, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

    /*
   @Type: File, <ts>
   @Name: fetchNotesMonthYearCountAll function
   @Who: Renu
   @When: 14-Dec-2021
   @Why: EWM-3751 EWM-4175
   @What: Api call for get list for all notes mponth year count
 */
   fetchNotesMonthYearCountAll(FormData): Observable<any>{
    return this.http.post(this.serviceListClass.candidateNotesBycandidateId, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

   /*
  @Name: deleteNotes
  @Who: Renu
  @When: 20-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: delete Client Note based on Id
  */

deleteNotes(formData): Observable<any> {
  return this.http.request('delete',this.serviceListClass.candidateNoteDelete,{body:formData}).pipe(
    retry(1),
    catchError(handleError)
  );
}


  /*
  @Name: getNotesById
  @Who: Renu
  @When: 14-Dec-2021
  @Why: EWM-3751 EWM-4175
  @What: get  Note based on Id
  */
  getNotesById(formData) {
    return this.http.get(this.serviceListClass.candidateNoteById+formData).pipe(
      retry(1),
      catchError(handleError)
    );
   }

    /*
   @Type: File, <ts>
   @Name: AddClientNotesAll function
   @Who: Renu
   @When: 14-Dec-2021
   @Why: EWM-3751 EWM-4175
   @What: Api call for get list for all notes
 */
   AddNotesAll(FormData): Observable<any>{
    return this.http.post(this.serviceListClass.createCandidateNote, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }



      /*
    @Type: File, <ts>
    @Name: EditClientNotesAll function
    @Who: Renu
    @When: 14-Dec-2021
    @Why: EWM-3751 EWM-4175
    @What: Api call for get list for all notes
  */
    EditNotesAll(FormData): Observable<any>{
      return this.http.post(this.serviceListClass.updateCandidateNote, FormData).pipe(
        retry(1),
        catchError(handleError)
      );
    }


        /*
@Type: File, <ts>
@Name: deleteCanNotesById function
@Who: Anup
@When: 28-Dec-2021
@Why: EWM-4037 EWM-4363
@What: Api call for delete  can/emp notes by id data
*/
deleteCanEmpNotesById(formData): Observable<any> {
  return this.http.request('delete',this.serviceListClass.deleteCanEmpById,{body:formData}).pipe(
    retry(1),
    catchError(handleError)
  );
}





  /*
   @Type: File, <ts>
   @Name: fetchActivityAll function
   @Who: Nitin Bhati
   @When: 12-Jan-2022
   @Why: EWM-4545
   @What: Api call for get list for all activities
 */
   fetchActivityAll(FormData): Observable<any>{
    return this.http.post(this.serviceListClass.candidateFilterActivityByYear, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

    /*
   @Type: File, <ts>
   @Name: fetchActivityMonthYearCountAll function
   @Who: Nitin Bhati
   @When: 12-Jan-2022
   @Why: EWM-4545
   @What: Api call for get list for all activities mponth year count
 */
   fetchActivityMonthYearCountAll(FormData): Observable<any>{
    return this.http.post(this.serviceListClass.candidateActivityBycandidateId, FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Name: getActivityById
  @Who: Nitin Bhati
  @When: 12-Jan-2022
  @Why: EWM-4545
  @What: get  Activity based on Id
  */
  getActivityById(formData) {
    return this.http.get(this.serviceListClass.candidateActivityById+formData).pipe(
      retry(1),
      catchError(handleError)
    );
   }

   /*
    @Type: File, <ts>
    @Name: EditActivityAll function
    @Who: Nitin Bhati
    @When: 12-Jan-2022
    @Why: EWM-4545
    @What: Api call for get list for all activities
  */
    EditActivityAll(FormData): Observable<any>{
      return this.http.post(this.serviceListClass.updateActivityMaster, FormData).pipe(
        retry(1),
        catchError(handleError)
      );
    }

         /*
@Type: File, <ts>
@Name: deleteActivityById function
@Who: Nitin Bhati
@When: 13-Jan-2022
@Why: EWM-4545
@What: Api call for delete Activity by id data
*/
deleteActivityById(formData): Observable<any> {
  return this.http.request('delete',this.serviceListClass.deleteActivityId,{body:formData}).pipe(
    retry(1),
    catchError(handleError)
  );
}


 /*
   @Type: File, <ts>
   @Name: fetchActivityTotal function
   @Who: Nitin Bhati
   @When: 13-Jan-2022
   @Why: EWM-4545
   @What: Api call for Client Recent Activity
 */
   fetchActivityTotal(FormData): Observable<any>{
    return this.http.get(this.serviceListClass.recentActivityCount+ FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  /*
  @Type: File, <ts>
  @Name: createActivityReadMark
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: creating experience Data by inserting in database
  */

  createActivityReadMark(formData): Observable<any> {
    return this.http.post(this.serviceListClass.updateActivityStatus,formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


    /*
@Type: File, <ts>
@Name: sendGDPRRequest function
@Who: Nitin Bhati
@When: 16-Feb-2022
@Why: EWM-5145
@What: Api call for send GDPR Request
*/
sendGDPRRequest(formData) : Observable<any>{
  return this.http.post(this.serviceListClass.sendgdprrequest,formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }


    /*
    @Type: File, <ts>
    @Name: getFolderCount function
    @Who: Anup
    @When: 9-Mar-2022
    @Why: EWM-5328.EWM-5582
    @What: Get folder count
    */

fetchFolderCount(formData) {
  return this.http.get(this.serviceListClass.getFolderCount + formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }


    /*
    @Type: File, <ts>
    @Name: getCanSocialData function
    @Who: suika
    @When: 09-March-2022
    @Why: EWM-3556.EWM-3643
    @What: Get Social List Data
    */

getCanSocialData(formData) {
  return this.http.get(this.serviceListClass.getCandidateSocialProfile + formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

      /*
    @Type: File, <ts>
    @Name: gateCandStatus function
    @Who: Adarsh
    @When: 09-March-2022
    @Why: EWM-3556.EWM-3643
    @What: Get status list data
    */

getCanStatus(formData) {
  return this.http.get(this.serviceListClass.getCandidateStatus + formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

     /*
    @Type: File, <ts>
    @Name: update CandStatus function
    @Who: Adarsh
    @When: 09-March-2022
    @Why: EWM-3556.EWM-3643
    @What: Update status list data
    */

updateCanStatus(formData) {
  return this.http.post(this.serviceListClass.updateCandidateStatus, formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }



  /*
  @Type: File, <ts>
  @Name: fetchCoverDetails function
  @Who: Suika
  @When:  16-May-2022
  @Why: EWM-6605 EWM-6720
  @What: Api call for getting listing data in grid
*/

fetchCoverDetails(formData) {
  return this.http.get(this.serviceListClass.getCoverLetterAll+formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }


    /*
  @Type: File, <ts>
  @Name: fetchCoverDetailsById function
  @Who: Suika
  @When:  16-May-2022
  @Why: EWM-6605 EWM-6720
  @What: Api call for getting listing data in grid
*/

fetchCoverDetailsById(formData) {
  return this.http.get(this.serviceListClass.getCoverLetterDetailsById+formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }


    /*
  @Type: File, <ts>
  @Name: fetchCoverPageVersionHistory function
  @Who: Suika
  @When:  16-May-2022
  @Why: EWM-6605 EWM-6720
  @What: Api call for getting listing data in grid
*/

fetchCoverPageVersionHistory(formData) {
  return this.http.get(this.serviceListClass.getCoverPageVersionHistory+formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }

   /*
    @Name: deleteCoverPage
    @Who: Suika
    @When: 16-May-2022
   @Why: EWM-6605 EWM-6720
    @What: delete cover page Information list data
    */


   deleteCoverPage(formData) : Observable<any>{
    return this.http.request('delete',this.serviceListClass.deleteCoverLetter,{body: formData}).pipe(
      retry(1),
      catchError(handleError)
    );
    }



/*
  @Name: createCoverPage
  @Who: Suika
  @When: 16-May-2022
  @Why: EWM-6605 EWM-6720
  @What: create cover page list data
  */
createCoverPage(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.createCoverLetter, formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
  @Name: createCoverPage
  @Who: Suika
  @When: 16-May-2022
  @Why: EWM-6605 EWM-6720
  @What: create cover page list data
  */
 renameCoverPage(formData): Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.renameCoverLetter, formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}



checkduplicity(formData): Observable<any> {
  return this.http.get<any[]>(this.serviceListClass.checkDuplicateCoverLetter+formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}

/*
  @Type: File, <ts>
  @Name: fetchCandidateVersionHistory function
  @Who: Adarsh singh
  @When:09-07-22
  @Why: EWM-7533
  @What: Api call for get resume by candidate id
*/

fetchCandidateResumeHistory(formData) {
  return this.http.get(this.serviceListClass.getCandidateResumeLatestById+formData).pipe(
    retry(1),
    catchError(handleError)
  );
  }
   /*
   @Type: File, <ts>
   @Name: JobNotesCandidate function
   @Who: maneesh
   @When: 11-oct-2022
   @Why: EWM-9180
   @What: Api call for notes JobNotesCandidate
 */
   JobNotesCandidate(FormData): Observable<any>{
    return this.http.get(this.serviceListClass.JobNotesCandidate+ FormData).pipe(
      retry(1),
      catchError(handleError)
    );
  }


  checkRelationIsExist(formData):Observable<any> {
    return this.http.get<any[]>(this.serviceListClass.checkEmergencycontactsRelationship+formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }


/*
   @Type: File, <ts>
   @Name: profileReadInread function
   @Who: Adarsh singh
   @When: 11-oct-2022
   @Why: EWM-12937
*/
  profileReadInread(formData:any):Observable<any> {
    return this.http.post<any[]>(this.serviceListClass.candProfileReadUnread,formData ).pipe(
      retry(1),
      catchError(handleError)
    );
  }

          //  <!-- @Who: bantee ,@When: 18-09-2023, @Why: EWM-14057 ,What: Managing kendo grid via data state -->

  public getCandidatelist(state: State, searchValue): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      searchValue=searchValue.replace('?', '');
      queryStr += '&' + searchValue;
    }
    return this.http
      .get(`${this.serviceListClass.getCandidateList}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }

  /*
   @Type: File, <ts>
   @Name: profileReadInreadV2 function
   @Who: Renu
   @When: 26-oct-2022
   @Why: EWM-14918 EWM-14941
*/
profileUnread(formData:any):Observable<any> {
  return this.http.post<any[]>(this.serviceListClass.candProfileReadUnreadV2,formData ).pipe(
    retry(1),
    catchError(handleError)
  );
}
/*
  @Name: getcandidateActivityHistory
  @Who: Mukesh Kumar rai
  @When: 07-Dec-2023
  @Why: EWM-15165 EWM-15329
  @What: Geting candidate activity history
  */
  getcandidateActivityHistory(reqiestdata): Observable<any> {
    return this.http.get(this.serviceListClass.getCandidateActivityHistoryAll + reqiestdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getCandidatenoteByYearfilterByid(reqiestdata): Observable<any>{
    return this.http.get(this.serviceListClass.candidatenoteByYearfilterByid+reqiestdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getActivityLogById(reqiestdata): Observable<any>{
    return this.http.get(this.serviceListClass.getActivityLogById+reqiestdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getCanidateTimelineCount(formdata): Observable<any> {
    return this.http.post(this.serviceListClass.getCanidateTimelineCount,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getAllStatus(formData): Observable<any> {
    return this.http.get(this.serviceListClass.getallStatusDetails+ formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  updateCandidateStatusList(formData): Observable<any> {
    return this.http.post(this.serviceListClass.CandidateStatusUpdate, formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
// by maneesh,when:24/05/2024 ewm-17105
  fetchEohNotesAll(formData): Observable<any>{
    return this.http.get(this.serviceListClass.fetchEohNotesAll + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
// maneesh for vxt api when:13/09/2024
  CreatecandidateVxtCall(formdata): Observable<any> {
    return this.http.post(this.serviceListClass.candidateVxtCreateCall,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }
  getVxtLastCallDetails(formData): Observable<any>{
    return this.http.get(this.serviceListClass.getVxtLastCallDetails + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  getVxtCandidateListCallDetailsById(formData): Observable<any>{
    return this.http.get(this.serviceListClass.getVxtCandidateListCallDetailsById +"?CallId="+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  public getCandidatelistCallDetails(state: State, searchValue): Observable<GridDataResult> {
    let queryStr = `${toDataSourceRequestString(state)}`;
    if (searchValue) {
      searchValue=searchValue.replace('?', '');
      queryStr += '&' + searchValue;
    }
    return this.http
      .get(`${this.serviceListClass.getVxtCandidateListCallDetails}?${queryStr}`)
      .pipe(
        map(response => (<GridDataResult>{
          data: response['Data'] ? response['Data'] : [],
          total: parseInt(response['TotalRecord'], 10)
        }))
      );
  }
  candidateVxtUpdateCall(formdata): Observable<any> {
    return this.http.post(this.serviceListClass.candidateVxtUpdateCall,formdata).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  candidateVxtDeleteCall(formData): Observable<any> {
    return this.http.request('delete',this.serviceListClass.candidateVxtDeleteCall+'?CallId='+formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }

  countVxtCall(formData): Observable<any>{
    return this.http.get(this.serviceListClass.countVxtCall + formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
// end maneesh for vxt api when:13/09/2024

 //who:Renu,what: EWM-19411 EWM-19651 @What: check candidate already shared to EOH or not, @when:04/03/2025

  checkCandidateSyncTOEOH(formData: string): Observable<any> {
    return this.http.get(this.serviceListClass.checkCandidateSyncEOH+ formData).pipe(
      retry(1),
      catchError(handleError)
    );
  }
}
