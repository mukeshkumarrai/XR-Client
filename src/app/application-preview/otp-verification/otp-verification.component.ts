import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { MfaAuthService } from 'src/app/modules/EWM.core/shared/services/mfa/mfa-auth.service';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { PreviewSaveService } from '../shared/preview-save.service';


@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otp: string;
  display: any;
  public authCode: string;
  public lock:string = 'lock';
  public otpSendMessage : boolean;
  public errorMessage : boolean;
  public errorMsg : string;
  public showOtpComponent = true;
  public showmsgBox : boolean = false;
  public enterOtpBox : boolean = false;
  public otpEnable : boolean = false;
  public genrateOtpBox : boolean = true;
  public docId:any;
  public showResendButton : boolean = false;
  Link = 'https://sso-client-dev-ewm.entiredev.in/';  
  code = "";
  public otpparm = "VTJGc2RHVmtYMThONUt5eG4xYURLTkdlb2RWYmJYNEUvc1RrMm15eU1YY2Z0YTU3OFZYcm1mYnR2MGVReGJBa2k2QWRuU2lTY0cwMnNnTFVLd0JIZlBHSWdiZXFiMXRhTURmRXR2QkJ6Qy84VWtYZzBnbUdRUUxRYU04akZQV2owR1RoS3NhYVI4UUdZUlJPL2RrNVRTUEtxRncybWlHTjBtdXBqUVNwNkxtT2t5bWVkTCszR01Ed01UZXNNMmR0NkQ2a2ZONWlQZTlkVG01NzJEbEJPOTJ3U2hqTjNFRjhnUWlEejI4VEhNdVNKS0J4dFQ4WjV5NTF4aWE2UWczejNLQU5vbDRrc04xdlhuQkRCNmN0aUh3aExtZU1wV3Rrc1RvbE1LY081V3RuT3BWNkpkeFdzNnlCODhFWVp4d0dtZ1dWbUpIekdZaWhnMzRUQzc4UUhKUm8vVEdDdHQrM21xWmorQlVaZ28zRTF6OTdLaVBXUmlaWDJoR3NVa2pGMm1SeUpDT3Bna3hRaDlwL2w4WnhzUU1tS3NoZC9aSjV5b2YydG8waVdDVjZITG9pOXpwV3F3aVZJOXNmSnlXQ2gxNlNtRXlNemYwWHR6enl5SnRubGRHdmpJaXNMcHpMRGlBN2VvaVFMaG84YWJPcGFoN1RKY1ZZN1FMYlBSZG5TTnBIZE92MnpNeGZvckdKVHJyVFQ0bTlvUzR0N0R3c0hDMHBqS1hyZEgrenY2WStWTkYrdDNTWkVnRGU4cHNxYzk1aG4zcWtMNXVEMnRiK3loWXA2TXp2eGV5OFdrUjlReXM3WDNCTE1wVWdXZXNscUx5OUFQRms3eTk2WFhaV1BBNG5lN1N2dW5ib3ZMQlV1Wjl2bEl1aFNVVVFYSGdGWXp1NU9qMHlnendjQjhGTzRrVm8rRXNSMWJETkM2T1NDVlpPY2FrY3locmpsQ0IyUzRQWWtraGU4M0FwTVcrcnRaaUhVNU12dWVHV0c1SElwMmZXbnJudkJodFVZTUE3RzRiYld0WXBhNXBpWWtyNkZqM2s5S09jWFU3dGo4d0hzT0tLLzg5eWhpc251QkJPR2hCUzFZRDVWdFV4cWhOWTFoeGl0T2JLY3ROWjRIWVFjaVBIVXJYWEg0ZzZQb3ByTXVFbmNSVE8rcktJdHpscVBtMkRBQXJEWWEvWWphdk5uRmxDdjdISSsyQTJXUjUwT0JlNEtpdzIrbmU2bmhhS01uSWdlSUREL0pTV1R2UnhOa3I0U3J5OTNTTy8rdXdGU01PcUxXTTdmSjYvL3NtL3U5WVIvVHBXQ1VSSlNDRHlXSnJYL2FvUHF1cz0";
  config = {
    allowNumbersOnly: false,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  candidateInfo: any;
  emailId: any;
  subscription: Subscription;
  browserRefresh:boolean=false;
  applicationParam: string;
  mode: any;
  applicationId: any;
  JobId: any;
  stepper: any;


  onOtpChange(otp) {
    this.otp = otp;
    if (this.otp.length === 6) {
      this.otpEnable = true;
      this.authCode = this.otp;
    
    }else{
      this.otpEnable = false;
    }
  }

  getMsg(){    
    this.showmsgBox = false;
    this.enterOtpBox = true;   
    this.genrateOtpBox = false;  
  }

  constructor(private _Service:JobService,private snackBService: SnackBarService,private _mfaAuthService: MfaAuthService,
     private route: ActivatedRoute,  private router: Router,private previewSaveService:PreviewSaveService,
     private translateService: TranslateService) {
      
      }

  ngOnInit(): void {
    this.route.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationId=parms?.applicationId;
        this.applicationParam='applicationId';
      }else  if (parms?.jobId){
        this.JobId=parms?.jobId;
        this.applicationParam='jobId';
      }
      if(parms?.mode)
   {
     this.mode=parms?.mode;
   }
    });
   this.previewSaveService.ononResumeUploadInfoChange.subscribe((res: any) => {
    if (res) {
      this.emailId=res.EmailId;
    }
  });
   this.previewSaveService.currentCandidateExistsInfo.subscribe(res=> {
    if(res){
      this.candidateInfo=res;
    }
  });
  this.genrateOtpCode();
 
  }

 

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }
  
  /* 
  @Type: File, <ts>
  @Name: resendOtpCode function
  @Who: Suika
  @When: 23-Sept-2021
  @Why: EWM-2519 EWM-2952
  @What: use to resend otp code api integration 
 */
resendOtpCode() {
  this.errorMessage = false;   
  this.errorMsg = "";   
  this.otp = '';
  let formarr = {};
  formarr['EmailId'] = this.emailId;
  formarr['CandidateId'] = this.candidateInfo?.CandidateId;
  formarr['CandidateName'] = this.candidateInfo?.CandidateName;
 
  this._Service.sendOtp(formarr).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.timer(1); 
        //console.log("repsonsedata.Data "+repsonsedata.Data);
        this.otpEnable = false; 
        this.otpSendMessage = true;
        this.ngOtpInput.setValue('');       
      }else  if (repsonsedata.HttpStatusCode === 400) {
        this.otpEnable = false;   
        this.otpSendMessage = false;
        this.errorMessage = true; 
        this.errorMsg = repsonsedata.Message;
       } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

  
 

  /* 
  @Type: File, <ts>
  @Name: genrateOtpCode function
  @Who: Suika
  @When: 23-Sept-2021
  @Why: EWM-2519 EWM-2952
  @What: use to send otp code api integration 
 */
genrateOtpCode() {
  let formarr = {};
  formarr['EmailId'] = this.emailId;
  formarr['CandidateId'] = this.candidateInfo?.CandidateId;
  formarr['CandidateName'] = this.candidateInfo?.CandidateName;
 
  this._Service.sendOtp(formarr).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.showmsgBox = true;
        this.enterOtpBox = false;   
        this.genrateOtpBox = false;  
        this.timer(1);   
      }else  if (repsonsedata.HttpStatusCode === 400) {
        this.enterOtpBox = false;  
        this.showmsgBox = false; 
        this.genrateOtpBox = true;  
        this.errorMessage = true;   
        this.errorMsg = repsonsedata.Message; 
       } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}



/* 
  @Type: File, <ts>
  @Name: validateOtpCode function
  @Who: Suika
  @When: 23-Sept-2021
  @Why: EWM-2519 EWM-2952
  @What: used to validate otp code
 */

 validateOtpCode() {
  let formarr = {};
  formarr['Pin'] = this.authCode;
  formarr['CandidateId'] = this.candidateInfo?.CandidateId;
  this._mfaAuthService.alternateEmailOtpvalidate(formarr).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.otpSendMessage = false;
        this.enterOtpBox = true;   
        this.genrateOtpBox = false;  
        this.lock = "lock_open";
        
        this.stepper.selected.completed = true;
        this.stepper.next();
       // this.router.navigate(['./application/apply'],{queryParams:{[this.applicationParam]:(this.applicationId?this.applicationId:this.JobId),'mode':this.mode}});  
      }else  if (repsonsedata.HttpStatusCode === 400) { 
        this.showResendButton = true;        
        this.otpSendMessage = false;
        this.enterOtpBox = true;  
        this.showmsgBox = false; 
        this.genrateOtpBox = false;  
        this.otpEnable = false;
        this.errorMessage = true;   
        this.errorMsg = repsonsedata.Message;    
       } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
   
    })

}

timer(minute) {
  // let minute = 1;
  this.showResendButton = false;
  let seconds: number = minute * 60;
  let textSec: any = "0";
  let statSec: number = 60;

  const prefix = minute < 10 ? "0" : "";

  const timer = setInterval(() => {
    seconds--;
    if (statSec != 0) statSec--;
    else statSec = 59;

    if (statSec < 10) {
      textSec = "0" + statSec;
    } else textSec = statSec;

    this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

    if (seconds == 0) {
      this.showResendButton = true;
     // console.log("finished");
      clearInterval(timer);
    }
  }, 1000);
}

}
