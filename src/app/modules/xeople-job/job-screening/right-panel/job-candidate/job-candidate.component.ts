import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { candidateEntity, candResumeCoverLetter, JobScreening } from 'src/app/shared/models/job-screening';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { JobCandidateDocumentsComponent } from './job-candidate-documents/job-candidate-documents.component';

@Component({
  selector: 'app-job-candidate',
  templateUrl: './job-candidate.component.html',
  styleUrls: ['./job-candidate.component.scss']
})
export class JobCandidateComponent implements OnInit, OnDestroy {
  candidateList: candidateEntity[];
  candId: string;
  @Input() jobId: string;
  candidateData: candResumeCoverLetter;
  //loaderAddInfo = false;
  public loaderAddInfo = false;

  @Output() reloadDataEvent = new EventEmitter();
  subscription: Subscription;
  candidateName:string;
  showingCandidateDoc: boolean=false;
  public showingCandidateNotes: boolean=false;
  labelName: string;
  @Input() jobActionTabName:string;
  showingCandidateMailbox: boolean=false;
  dataTotalMail: any;
  candidateEmail: string;
  showingCandidateActivity: boolean=false;
  tabActive:string;
  constructor(public dialog: MatDialog,
    public jobservice: JobService,
    public dialogModel: MatDialog, private commonserviceService: CommonserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.subscription = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      this.candidateList = res.SelectedCandidate; 
       if (this.candidateList?.length > 0 && this.jobId) {
        this.candId = this.candidateList[0]?.CandidateId;
        this.candidateName = this.candidateList[0]?.CandidateName;
        this.candidateEmail= this.candidateList[0]?.EmailId;
        this.getCandidateResumeCoverLetter(this.candId, false);
      }
    });
  }



  /*
   @Type: File, <ts>
   @Name: getCandidateResumeCoverLetter function
   @Who: Bantee Kumar
   @When: 26-May-2023
   @Why: EWM-11776 EWM-12534
   @What: get candidate Resume and cover letter data
 */
   getCandidateResumeCoverLetter(candId, isSameCand) {
    if (isSameCand) {
      this.candidateData = null;
      this.candId = null;
      return;
    }
    this.candId = candId;
    this.loaderAddInfo = true;
    this.jobservice.jobScreeningCandidateDetails(candId, this.jobId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.candidateData = repsonsedata.Data;
          this.candId = this.candidateList[0]?.CandidateId;
        }
        this.loaderAddInfo = false;
      })
  }

  getResumeInfo(event) {
    if (event == true) {
      this.getCandidateResumeCoverLetter(this.candId, false);
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  selectedTabValue(event){
    this.tabActive=event?.tab?.textLabel?.toLowerCase();//by maneesh
    if(event?.tab?.textLabel?.toLowerCase()=='candidate'){
      this.jobActionTabName=event?.tab?.textLabel?.toLowerCase();
      this.showingCandidateDoc=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='notes'){
      this.showingCandidateNotes=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='mailbox'){
      this.showingCandidateMailbox=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='activity'){
      this.showingCandidateActivity=true;
    }
  }
  fetchDataFromInbox(data: any) {
    this.dataTotalMail = data;
  }

}
