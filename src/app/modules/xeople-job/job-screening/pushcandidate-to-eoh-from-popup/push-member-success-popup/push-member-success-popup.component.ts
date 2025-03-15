import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExcelService } from '@app/modules/EWM.core/shared/services/excel.service';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';


@Component({
  selector: 'app-push-member-success-popup',
  templateUrl: './push-member-success-popup.component.html',
  styleUrls: ['./push-member-success-popup.component.scss']
})
export class PushMemberSuccessPopupComponent implements OnInit {

  candidatePushedInfo: any;
  httpstatus: number;
  message: string;

  constructor( public dialogRef: MatDialogRef<PushMemberSuccessPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
  private pushCandidateEOHService: PushCandidateEOHService) { 
    this.candidatePushedInfo=data?.candidatePushedInfo;
    this.message=data?.candidatePushedInfo?.Message;
    this.httpstatus=data?.httpstatus;
  }

  ngOnInit(): void {
  }

  // who:Renu,why:ewm-15844 ewm-15853 what:om cancel pupup ,when:02/02/2024

  onDismiss(): void {
    document.getElementsByClassName("view_pushCandidate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("view_pushCandidate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  // who:Renu,why:ewm-15844 ewm-15853 what:generatePushCandidateExcel ,when:02/02/2024
  generatePushCandidateExcel(){
    this.candidatePushedInfo.CandidateInformation.applicantId=this.candidatePushedInfo?.ApplicantId;
    this.candidatePushedInfo.CandidateInformation.message=this.message;
    this.candidatePushedInfo.CandidateInformation.httpstatus=this.httpstatus;
    this.candidatePushedInfo.CandidateInformation.HowDidYouHear='Xeople Recruit';
    this.pushCandidateEOHService.generateExcel([this.candidatePushedInfo?.CandidateInformation]);
  }
}
