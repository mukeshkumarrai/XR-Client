import { Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { candidateEntity, JobScreening } from 'src/app/shared/models/job-screening';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
@Component({
  selector: 'app-job-tab-action',
  templateUrl: './job-tab-action.component.html',
  styleUrls: ['./job-tab-action.component.scss']
})
export class JobTabActionComponent implements OnInit, OnDestroy {
  candidateList: candidateEntity[];
  candId: string;
  @Input() jobId: string;
  public loaderAddInfo = false;
  candidatelistInfo: Subscription;
  candidateName:string;
  showingCandidateDoc: boolean=false;
  @Input() jobActionTabName:string;
  @Input() jobActionCandidateId:string;
  @Input() jobActionCandidateName:string;
  public showingJobNotes: boolean=false;
  constructor(public dialog: MatDialog,
    public jobservice: JobService,
    public dialogModel: MatDialog, private commonserviceService: CommonserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
    this.candidatelistInfo = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      this.candidateList = res.CandidateList;      
      if (this.candidateList?.length > 0 && this.jobId) {
        this.candId = this.candidateList[0]?.CandidateId;
        this.candidateName = this.candidateList[0]?.CandidateName;
      }
    });
  }
  ngOnDestroy(){
    this.candidatelistInfo.unsubscribe();
  }
  selectedTabValue(event){
    if(event?.tab?.textLabel?.toLowerCase()=='job'){
      this.jobActionTabName=event?.tab?.textLabel?.toLowerCase();
      this.showingCandidateDoc=true;
    }else if(event?.tab?.textLabel?.toLowerCase()=='notes'){
      this.showingJobNotes=true;
    }
  }
}

