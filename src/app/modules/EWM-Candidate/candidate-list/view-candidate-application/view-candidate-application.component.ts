import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { truncateSync } from 'fs';
import { PreviewSaveService } from 'src/app/application-preview/shared/preview-save.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-view-candidate-application',
  templateUrl: './view-candidate-application.component.html',
  styleUrls: ['./view-candidate-application.component.scss']
})
export class ViewCandidateApplicationComponent implements OnInit {
  loading:boolean = false;
  public isPersonalInfo:boolean = true;
  public isKnockoutInfo:boolean = false;
  public isDocumentInfo:boolean = false;
  public IsKnockoutSuccess:boolean = false;
  stepperConfig: any;
  appId: number;
  hideButton: any;
  constructor(private jobService: JobService,private  previewSaveService:PreviewSaveService,private routes: ActivatedRoute,
    private snackBService: SnackBarService,private translateService: TranslateService) { }    
  @Input() CandidateId:any;
  @Input() isClose:boolean;
  @Output() backtoJobDetailss = new EventEmitter();
  ngOnInit(): void {    
    this.jobService.isKnockoutSuccess.subscribe(res=>{
      this.IsKnockoutSuccess = res;
    }) 
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.appId) {
        this.appId= parms?.appId;
        this.hideButton= parms?.hideButton;
        this.getStepperConfig(this.appId);
      }     
    }); 
  }


/*
@Type: File, <ts>
@Name: getStepperConfig function
@Who: Renu
@When: 18-11-2022
@Why: EWM-8900 EWM-9436
@What: get stepper Config
*/
getStepperConfig(ApplicationFormId){

  this.jobService.fetchConfigStepperById('?applicationId='+ApplicationFormId).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
        this.loading=false;
         this.stepperConfig=data.Data;
      } else {
        this.loading=false
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
  }
  
  selectedTabValue(event) { 
    let labelName = event.tab.textLabel;
    if (labelName === 'Personal Information') {

      this.isPersonalInfo = true;
      this.isDocumentInfo = false;
      this.isKnockoutInfo = false;      
    }else if(labelName === 'Documents'){   

      this.isPersonalInfo = false;
      this.isDocumentInfo = true;
      this.isKnockoutInfo = false;
    } else {    
      this.isPersonalInfo = false;
      this.isDocumentInfo = false;
      this.isKnockoutInfo = true;
    }
  }
  /*
@Type: File, <ts>
@Name: moveToSelectedTab function
@Who: maneesh
@When: 05-12-2022
@Why: EWM-9513 EWM-9513
@What: move To other tab 
*/
  moveToSelectedTab(tabName: string) {
    for (let i =0; i< document.querySelectorAll('.mat-tab-label-content').length; i++) {
    if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == tabName) 
       {
          (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
       }
     }
  }
  /*
@Type: File, <ts>
@Name: closeDrawerMyActivity function
@Who: maneesh
@When: 05-12-2022
@Why: EWM-9513 EWM-9513
@What: click close button then closeDrawer
*/
  closeDrawerMyActivity() {
  this.backtoJobDetailss.emit(true);
  }
 
}
