
import { Injectable } from '@angular/core';
 @Injectable()
/*--@When:03-05-2023,@who:Nitin Bhati,@why:EWM-12199,@what:For job Dashboard */
 export class Job {
    Count?: (CountEntity)[] | null;
    LastJobs?: (LastJobsEntity)[] | null;
  }
  export class CountEntity {
    Key: string;
    Count: number;
  }
  export class LastJobsEntity {
    Title: string;
    Workflow: string;
    Created: number;
  }

  /*--@When:04-05-2023,@who:Nitin Bhati,@why:EWM-12190,EWM-12205,@what:For Inbox Dashboard */
  export class MyInbox {
    Today: number;
    Inbox: number;
    Unread: number;
    Draft: number;
    ListOfTop5Mail?: (ListOfTop5MailEntity)[] | null;
  }
  export class ListOfTop5MailEntity {
    From: string;
    Subject: string;
    Received: number;
  }
/*--@When:03-05-2023,@who:Nitin Bhati,@why:EWM-12211,@what:For Activity Dashboard */
  export class DasboardActivity {
    Today: number;
    UpcomingSevenDays: number;
    NotCompleted: number;
    UpCommingFiveActivityList?: (UpCommingFiveActivityListEntity)[] | null;
  }
  export class UpCommingFiveActivityListEntity {
    Title: string;
    Category: string;
    TimeZone: string;
    DateStart: string;
    TimeStart: string;
  }
  /*--@When:03-05-2023,@who:Nitin Bhati,@why:EWM-12194,EWM-12218,@what:For My Action Dashboard */
export class DashboardAction {
  NoOfActionToday: number;
  NoOFActioninWeek: number;
  LastActionDateTime: string;
  ActionList?: (LastFiveActionListEntity)[] | null;
}
export class LastFiveActionListEntity {
  id: number;
  servicename: string;
  eventname: string;
  userid: string;
  username: string;
  tenantid: string;
  changesummary: string;
  eventdate: string;
  eventdateindecimal:string;
  ipaddress: string;
  changeObjectinJson: string;
  created: number;
  IPv6: string;
  OrgId: string;
  Router: string;
  PageName: string;
  ModuleName: string;
  PrimaryKey: string;
  OldObjectinJson: string;
  EventDescription: string;
}
/*--@When:03-05-2023,@who:Nitin Bhati,@why:EWM-12193,EWM-12223,@what:For My Candidate Dashboard */
export interface DashboardCandidate {
  Total: number;
  AppliedToday: number;
  AppliedInLastWeek: number;
  ListOfCandidate?: (ListOfCandidateEntity)[] | null;
}
export interface ListOfCandidateEntity {
  Name: string;
  Source: string;
  Created: number;
}


  
  