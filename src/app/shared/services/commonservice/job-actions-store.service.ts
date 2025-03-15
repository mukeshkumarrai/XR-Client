/*
  @(C): Entire Software
  @Type: ts
  @Who: Renu
  @When: 31-05-2023
  @Why: EWM-11781 EWM-12698
  @What: to store job from action data
*/
import { Injectable } from '@angular/core';
import { ActionsTab, jobActionsEntity } from '../../models/job-screening';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { JobActionTabService } from './job-action-tab.service';

@Injectable({
  providedIn: 'root'
})
export class JobActionsStoreService {
  private actions: ActionsTab;

  public isJobActionWindowClose: Subject<boolean> = new BehaviorSubject(null);

  public hasRequiredFieldStatus: Subject<boolean> = new BehaviorSubject(null);
  public onJobStatusTabChange: Subject<boolean> = new BehaviorSubject(null);
  public resetJobStatusFormOnSuccess: Subject<boolean> = new BehaviorSubject(null);
  public onStageAlreadyMappedError: Subject<boolean> = new BehaviorSubject(null);

  public onJobNotesTabChange: Subject<boolean> = new BehaviorSubject(null);
  public hasRequiredFieldNotes: Subject<boolean> = new BehaviorSubject(null);
  public resetJobNotesFormOnSuccess: Subject<boolean> = new BehaviorSubject(null);

  public onJobCommentsTabChange: Subject<boolean> = new BehaviorSubject(null);
  public hasRequiredFieldComments: Subject<boolean> = new BehaviorSubject(null);
  public resetJobCommentsFormOnSuccess: Subject<boolean> = new BehaviorSubject(null);

  public status: Subject<jobActionsEntity> = new BehaviorSubject(null);
  public notes: Subject<jobActionsEntity> = new BehaviorSubject(null);
  public comments: Subject<jobActionsEntity> = new BehaviorSubject(null);
  public screening: Subject<jobActionsEntity> = new BehaviorSubject(null);
  public candidateProfile: Subject<jobActionsEntity> = new BehaviorSubject(null);
  public notesProfile: Subject<jobActionsEntity> = new BehaviorSubject(null);
  public employeeStatusInfo: Subject<jobActionsEntity> = new BehaviorSubject(null);

  public isScreeningActionTabUpdate: Subject<boolean> = new BehaviorSubject(null);

  private _spinner: boolean = false;
  public spinner: BehaviorSubject<boolean> = new BehaviorSubject(this._spinner);

  constructor(  private jobActionTabService: JobActionTabService) {
    this.actions = this.jobActionTabService.constants;
   }
setActionRunnerFn(action: string, value: any) {
    this.processAction(action, value);
      this.isJobActionWindowClose.subscribe((e:boolean)=>{
        if (e) {
         this.getRunner();
        }
      })
     
  }

  processAction = async (action: string, data: any) => {
    switch (true) {
      case (action === this.actions.STATUS_INFO):
         this.status.next(data);
        break;

        case (action === this.actions.NOTES_INFO):
         this.notes.next(data);
        break;

        case (action === this.actions.COMMENTS_INFO):
         this.comments.next(data);
        break;

        case (action === this.actions.SCREENING_INFO):
        this.screening.next(data);
        break;

        case (action === this.actions.SCREENING_CANDIDATE_PROFILE_INFO):
        this.candidateProfile.next(data);
        break;

        case (action === this.actions.SCREENING_NOTES_INFO):
          this.notesProfile.next(data);
          break;
       case (action === this.actions.SCREENING_EMPLOYMENT_STATUS_INFO):
            this.employeeStatusInfo.next(data);
          break;
          
     }
  };

  getRunner(){
    let result = []
    combineLatest([this.status, this.notes, this.comments]).subscribe(results => {
      result = results;
    });
    return result;
  }

  /* @Name: getterEOHScreeningTab @Who:  Renu @When: 24-05-2024 @Why: EWM-17107 EWM-17196 @What: To store screening tab resposes */
  getterEOHScreeningTab(){
    let result = []
    combineLatest([this.candidateProfile,this.screening,this.notesProfile,this.employeeStatusInfo]).subscribe(results => {
      result = results;
    });
    return result;
  }
  
}
