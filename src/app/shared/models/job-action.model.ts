/**
   @(C): Entire Software
   @Type: job-action.modalts
   @Name: job-action.modal
   @Who: Nitin Bhati
   @When: 10-Oct-2022
   @Why: All job action model class
   @What: This file contain All common model class
  */
   export class JobActionModel {
    applicationForm: string;
    applicationTotalSection: number;
    applicationStatus: string;
    applicationDate: string;
    checklistName: string;
    checklisttotalStep: number;
    checklistmendatory: number;
    checklistStatus: string;
    assessmentName: string;
    assessmentScore: number;
    assessmentStatus: string;
    assessmentDate: string;
    upcomingActivities: string;
    recentActivities: number;
    notesComment: string;
    notesActivities: string;
}
  
  export interface applicationForm {​​​​​​​
    applicationForm: string;
    applicationTotalSection: number;
    applicationStatus: string;
    applicationDate: string;
}
export interface checklist {​​​​​​​
    Name: string;
    totalStep: number;
    mendatory: number;
    Status: string;
}
export interface assessment {​​​​​​​
    assessmentName: string;
    assessmentScore: number;
    assessmentStatus: string;
    assessmentDate: string;
}
export interface notesScheduleActivity {​​​​​​​
    upcomingActivities: string;
    recentActivities: number;
    notesComment: string;
    notesActivities: string;
}
