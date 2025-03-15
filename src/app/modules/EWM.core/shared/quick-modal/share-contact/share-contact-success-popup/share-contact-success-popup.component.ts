import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelService } from '@app/modules/EWM.core/shared/services/excel.service';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';

@Component({
  selector: 'app-share-contact-success-popup',
  templateUrl: './share-contact-success-popup.component.html',
  styleUrls: ['./share-contact-success-popup.component.scss']
})
export class ShareContactSuccessPopupComponent implements OnInit {

  candidatePushedInfo: any;
  httpstatus: number;
  message: string;

  constructor( public dialogRef: MatDialogRef<ShareContactSuccessPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
  private pushCandidateEOHService: PushCandidateEOHService) { 
    this.candidatePushedInfo=data?.contactPushedInfo;
    this.message=data?.contactPushedInfo?.EOHResponseMsg;
    this.httpstatus=data?.httpstatus;
  }

  ngOnInit(): void {
  }
  onDismiss(): void {
    document.getElementsByClassName("view_pushCandidate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("view_pushCandidate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  generatePushCandidateExcel(){
    this.candidatePushedInfo.CandidateInformation.applicantId=this.candidatePushedInfo?.ApplicantId;
    this.candidatePushedInfo.CandidateInformation.message=this.message;
    this.candidatePushedInfo.CandidateInformation.httpstatus=this.httpstatus;
    this.candidatePushedInfo.CandidateInformation.HowDidYouHear='Xeople Recruit';
    this.pushCandidateEOHService.generateExcel([this.candidatePushedInfo?.CandidateInformation]);
  }

}
