// who:maneesh,what:ewm-16064 for contact histroy when:23/02/2024
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { JobSMSComponent } from '@app/modules/EWM.core/job/job/job-sms/job-sms.component';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { Userpreferences } from '@app/shared/models';
import { ResponceData } from '@app/shared/models/responce.model';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonTypes } from 'src/app/shared/models';
import { SendSmsData } from 'src/app/shared/models/sendsms';

@Component({
  selector: 'app-contact-smshistroy',
  templateUrl: './contact-smshistroy.component.html',
  styleUrls: ['./contact-smshistroy.component.scss']
})

export class ContactSmshistroyComponent implements OnInit {

  animationVar: any;
  @Input() candidateIdData:any;
  @Input() candidateDetails:any;
  @Output() onSmsHistoryForm = new EventEmitter<any>();
  public loading:boolean=false;
  public candidateId: string;
  dirctionalLang;
  @ViewChild('target', { read: ElementRef }) public myScrollContainer: ElementRef<any>;
  @Input() SMSHistory: any;
  @Input() contactHeaderDataId: any;
  @Input() contactHeaderData: any;
  @Input() contactPersonalData: any;
  public userpreferences: Userpreferences;
  JobId: string;
  constructor(public systemSettingService: SystemSettingService,private _appSetting: AppSettingsService, public dialog: MatDialog,
    private snackBService: SnackBarService, private translateService: TranslateService,
    private router: ActivatedRoute,private route: Router,
    private _userpreferencesService: UserpreferencesService,private commonserviceService: CommonserviceService,) {
      this.userpreferences = this._userpreferencesService.getuserpreferences();
   }
  ngOnInit(): void {
    this.commonserviceService?.getcontactsmsHistroy?.subscribe(res => {
      this.contactHeaderData=res;
      this.getSMSHistory();
     })
     this.commonserviceService?.getContactSummerySmsData?.subscribe(res => {
      if (res!=null && res!=undefined) {
        this.SMSHistory=res;
      }
     })
   if(this.contactHeaderDataId!=undefined){

    setTimeout(() => {
      this.myScrollContainer.nativeElement.scroll({
        top: this.myScrollContainer.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }, 0);

   }
  this.animationVar = ButtonTypes;
  }


  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }
// who:maneesh,what:ewm-16064 for to open template modal dialog
getSMSHistory() {  
  this.loading = true;
    this.systemSettingService.getContactSMSHistory('?ContactId='+this.contactHeaderData.Id).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.SMSHistory = repsonsedata.Data;
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.SMSHistory = [];
          this.loading = false;
        } else{
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }) 
}


// who:maneesh,what:ewm-16064 for For showing shortname on image icon
 sortName(fisrtName) {
  if (fisrtName) {
    const Name = fisrtName;
    let charCount = Name.split(" ").length - 1;
    if (charCount > 0) {
      const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
      let first = ShortName1.slice(0, 1);
      let last = ShortName1.slice(-1);
      let ShortName = first.concat(last.toString());
      return ShortName.toUpperCase();
    } else {
      const ShortName1 = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
      let first = ShortName1.slice(0, 1);
      let ShortName = first;
      return ShortName.toUpperCase();
    }

  }

}
// who:maneesh,what:ewm-16064 for to open job Sms For Candidate modal dialog
 openJobSMSForCandidate() {
  const dialogRef = this.dialog.open(JobSMSComponent, {
    maxWidth: "700px",
    data: new Object({ jobdetailsData: this.contactHeaderData,contectUserType:'CONT',contactHeaderDataId:this.contactHeaderDataId}),
    width: "90%",
    maxHeight: "85%",
    panelClass: ['JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) {
      setTimeout(() => {
        this.getSMSHistory();
      }, 1500);

    } else {
      this.loading = false;
    }
  })

  // RTL Code
  let dir: string;
  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }

}


closeToggel(){
  this.onSmsHistoryForm.emit(true);
}
// who:maneesh,what:ewm-16064 for resend sms
resendSMS(sms){
  this.loading = true;
     let ToPhone={};
     let PhoneList:any[] = [];     
        ToPhone["ToPhone"] =sms?.MobileNumber,
        PhoneList.push(ToPhone);
        ToPhone["Name"] =sms?.Name,
        ToPhone["Id"] = sms?.Id
        let smsObj:SendSmsData = {
         PhoneList:PhoneList,
         Subject:sms.subject?sms.subject:"subject",
         MessageBody:sms.MessageBody,
         Type:"ReSendSmsNotification",
         Provider:"Burst",
         JobId:this.JobId,
         JobName: '',
         UserType:"CONT"
        }
  this.systemSettingService.sendSmsJobForCan(smsObj).subscribe(
    (repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        document.getElementsByClassName("JobSMSForCandidate")[0]?.classList.remove("animate__zoomIn")
        document.getElementsByClassName("JobSMSForCandidate")[0]?.classList.add("animate__zoomOut");
          } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}


}

