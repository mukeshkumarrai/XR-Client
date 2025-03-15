import { Component, Input, OnInit } from '@angular/core';
import { ResponceData } from '@app/shared/models/responce.model';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { Userpreferences } from '@app/shared/models/common.model';
import { ButtonTypes } from 'src/app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { JobSMSComponent } from '../../job/job/job-sms/job-sms.component';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';


@Component({
  selector: 'client-sms',
  templateUrl: './client-sms.component.html',
  styleUrls: ['./client-sms.component.scss']
})
export class ClientSmsComponent implements OnInit {
  public loading:boolean=false;
  public clientId: string;
  public SMSHistory : any =[];
  animationVar: any;
  @Input() clientIdData:any;
  @Input() clientDetails:any;
  public userType='CLIE';
  public userpreferences: Userpreferences;
  constructor(public systemSettingService: SystemSettingService, private snackBService: SnackBarService, 
    private router: ActivatedRoute, private translateService: TranslateService,public dialog: MatDialog, private _userpreferencesService: UserpreferencesService,
    private commonserviceService: CommonserviceService,) {
      this.userpreferences = this._userpreferencesService.getuserpreferences();
     }

  ngOnInit(): void {
    this.router.queryParams.subscribe((value) => {
      this.clientId = value?.clientId;
this.userType = value?.type ? value.type.toUpperCase() : this.userType;
  
    });
    this.getSMSHistory();
    this.animationVar = ButtonTypes;
    this.commonserviceService.onClientSelectId.subscribe(value => {  // add api calling when change client dropdown ewm-18382 when:30/10/2024
      if (value !== null) {
       this.clientId = value;
       this.getSMSHistory();
       }
    })
  }
  getSMSHistory() {
    localStorage.removeItem('selectSMSTemp');
    this.loading = true;
    
    this.systemSettingService.getSMSHistory('?Id='+this.clientId+'&UserType='+this.userType).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.SMSHistory = repsonsedata.Data;
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.SMSHistory = [];
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  
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
  JobId;
  JobName;

  openJobSMSForCandidate(dataItem) {
    const dialogRef = this.dialog.open(JobSMSComponent, {
      maxWidth: "700px",
      data: new Object({ jobdetailsData: dataItem, JobId: this.JobId,JobName:dataItem?.JobName?dataItem?.JobName:this.JobName,UserType:this.userType}),
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
  
     
  
  }
}
