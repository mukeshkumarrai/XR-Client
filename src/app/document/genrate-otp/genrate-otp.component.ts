/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 15-Sep-2021
  @Why: EWM-2518 EWM-2848
  @What:  This page will be use for the genrate otp Component ts file
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DocumentCategoryService } from 'src/app/modules/EWM.core/shared/services/profile-info/document-category.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-genrate-otp',
  templateUrl: './genrate-otp.component.html',
  styleUrls: ['./genrate-otp.component.scss']
})
export class GenrateOtpComponent implements OnInit {
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
  isAuthorizedMessage: boolean = false;
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

  constructor(private _Service:DocumentCategoryService,private snackBService: SnackBarService,
     private route: ActivatedRoute,  private router: Router,
     private translateService: TranslateService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params.otp;  
      localStorage.setItem('ExternalLinkCode',this.code);   
   });
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
  formarr['ExternalLinkCode'] = this.code;
  this._Service.genrateOtp(formarr).subscribe(
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
  formarr['ExternalLinkCode'] = this.code;
  this._Service.genrateOtp(formarr).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.showmsgBox = true;
        this.enterOtpBox = false;   
        this.genrateOtpBox = false;  
        this.timer(1);   
        this.isAuthorizedMessage = false;
      }else  if (repsonsedata.HttpStatusCode === 400) {
        this.enterOtpBox = false;  
        this.showmsgBox = false; 
        this.genrateOtpBox = true;  
        this.errorMessage = true;   
        if (repsonsedata.Message == "400030") {
          let link = window.location.origin + '/link-expired';
            window.open(link, "_self");
        }
        this.errorMsg = repsonsedata.Message; 
        if (repsonsedata.Message == "400020") {
          this.isAuthorizedMessage = true;
        }
    //<!-----@bantee kumar @EWM-13148  @17-07-2023 Showing Snack bar on document generate OTP at the time of failure----->    

        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

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
  formarr['OTP'] = this.authCode;
  formarr['ExternalLinkCode'] = this.code;
  this._Service.validateOtp(formarr).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.otpSendMessage = false;
        this.enterOtpBox = true;   
        this.genrateOtpBox = false;  
        this.lock = "lock_open";
       this.router.navigate(['./document/list-details']);  
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
