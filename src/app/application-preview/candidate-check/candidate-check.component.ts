/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: candidate-check.component.ts
 @Who: Renu
 @When: 17-May-2022
 @Why: ROST-7151 EWM-7233
 @What: when candidate already exists
 */
 import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
 import { MatHorizontalStepper } from '@angular/material/stepper';
 import { ActivatedRoute, Router } from '@angular/router';
 import { PreviewSaveService } from '../shared/preview-save.service';

@Component({
  selector: 'app-candidate-check',
  templateUrl: './candidate-check.component.html',
  styleUrls: ['./candidate-check.component.scss']
})
export class CandidateCheckComponent implements OnInit {

  loading:boolean=false;
  candidateInfo: any;
  applicationParam: string;
  mode: any;
  applicationId: any;
  JobId: any;
  @Input() urlParam: any;
  otpVerify: boolean=false;
  stepper:MatHorizontalStepper;
  @Output() onCancelCandidate = new EventEmitter<any>();
  
  constructor(private previewSaveService:PreviewSaveService,private router:Router,private routes:ActivatedRoute) {
    console.log("urlParam",this.urlParam);
    console.log("stepper",this.stepper);
   }

  ngOnInit(): void {
    this.previewSaveService.currentCandidateExistsInfo.subscribe(res=> {
        if(res){
          this.candidateInfo=res;
        }
      });

      this.previewSaveService.goNextStepChange.subscribe(res=>{
        console.log("res",res)
        if(res){
          this.stepper=res;
        }
       
      })
      
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationId = parms?.applicationId;
        this.applicationParam = 'applicationId';
      } else if (parms?.jobId) {
        this.JobId = parms?.jobId;
        this.applicationId = parms?.applicationId;
        this.applicationParam = 'jobId';

      }
      if (parms?.mode) {
        this.mode = parms?.mode;
      }
    });
    let getClasswrapper = document.getElementById("preview-section");
    getClasswrapper.classList.add('thanku-preview-section')
  }

  onCancel(){
  this.onCancelCandidate.emit(false);
    this.router.navigate(['./application/apply'],{queryParams:{[this.applicationParam]:(this.applicationId?this.applicationId:this.JobId),'mode':this.mode}});
  }

  /*
    @Type: File, <ts>
    @Name: onContinue function
    @Who: Renu
    @When: 05-July-2022
    @Why:EWM-7404 EWM-7516
    @What: when user click on continue btn
  */
  onContinue(){
    this.stepper.selected.completed = true;
    this.stepper.next();
   
    //this.previewSaveService.goNextStep.next(true);
    //this.otpVerify=true;
   // this.router.navigate(['./application/send-otp'],{queryParams:{[this.applicationParam]:(this.applicationId?this.applicationId:this.JobId),'mode':this.mode}});
  }

}
