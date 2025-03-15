/*
  @(C): Entire Software
  @Type: ts
  @Who: Renu
  @When: 31-05-2023
  @Why: EWM-11781 EWM-12698
  @What: to store job from action data
*/
import { Injectable } from '@angular/core';
import {ActionsTab} from '../../../shared/models/job-screening';

@Injectable({
  providedIn: 'root'
})
export class JobActionTabService {

  constructor() { }

  constants: ActionsTab = {
    STATUS_INFO: 'STATUS_INFO',
    COMMENTS_INFO: 'COMMENTS_INFO',
    NOTES_INFO: 'NOTES_INFO',
    INTERVIEW_INFO: 'INTERVIEW_INFO',
    CHECKLIST_INFO: 'CHECKLIST_INFO',
    SCREENING_INFO:'SCREENING_INFO',
    SCREENING_NOTES_INFO:'SCREENING_NOTES_INFO',
    SCREENING_CANDIDATE_PROFILE_INFO:'SCREENING_CANDIDATE_PROFILE_INFO'
  };
}
