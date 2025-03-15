//  who:maneesh:what:ewm-13775 for create job action candidate add notes,when:06/09/2023
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { candidateEntity, JobScreening } from 'src/app/shared/models/job-screening';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
@Component({
  selector: 'app-client-tab-action',
  templateUrl: './client-tab-action.component.html',
  styleUrls: ['./client-tab-action.component.scss']
})
export class ClientTabActionComponent implements OnInit, OnDestroy {
  candidateList: candidateEntity[];
  candId: string;
  @Input() jobId: string;
  public loaderAddInfo = false;
  candidatelistInfo: Subscription;
  candidateName:string;
  showingCandidateDoc: boolean=false;
  @Input() clientId:string;
  @Input() jobActionTabName:string;
  @Input() jobActionCandidateId:string;
  @Input() jobActionCandidateName:string;
  public showingClientNotes: boolean=false;
  public showingClientcontact: boolean=false;
  showingCandidateMailbox: boolean=false;
  showingClientActivity: boolean=false;
  dataTotalMail: any;
  candidateEmail: string;
  constructor(public dialog: MatDialog,
    public jobservice: JobService,
    public dialogModel: MatDialog, private commonserviceService: CommonserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any, @Inject(DOCUMENT) private document: Document,) {
  }
  ngOnInit(): void {
    this.candidatelistInfo = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      this.candidateList = res.CandidateList;      
      if (this.candidateList?.length > 0 && this.jobId) {
        this.candId = this.candidateList[0]?.CandidateId;
        this.candidateName = this.candidateList[0]?.CandidateName;
        this.candidateEmail= this.candidateList[0]?.EmailId;
      }
    });
    this.document.body.classList.remove('activity-remove-height'); //maneesh ewm-17740 ewm-30/07/2024

  }
  ngOnDestroy(){
    this.candidatelistInfo?.unsubscribe();
  }
  selectedTabValue(event){
    if(event?.tab?.textLabel?.toLowerCase()=='client'){
      this.jobActionTabName=event?.tab?.textLabel?.toLowerCase();
      this.showingCandidateDoc=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='notes'){
      this.showingClientNotes=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='contactlist'){
      this.showingClientcontact=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='mailbox'){
      this.showingCandidateMailbox=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='activity'){
      this.showingClientActivity=true;
    }
  }
  fetchDataFromInbox(data: any) {
    this.dataTotalMail = data;
  }
}


