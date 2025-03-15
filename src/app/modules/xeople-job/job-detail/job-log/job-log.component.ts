import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ButtonTypes } from 'src/app/shared/models';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { DateFilterComponent } from '@app/modules/EWM.core/client/client-notes/date-filter/date-filter.component';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { ShortNameColorCode } from '@app/shared/models/background-color';

@Component({
  selector: 'app-job-log',
  templateUrl: './job-log.component.html',
  styleUrls: ['./job-log.component.scss']
})
export class JobLogComponent implements OnInit {

  @Output() jobCount = new EventEmitter();
  @Input() jobIdData: any;
  @Input()  category: string = 'JOB'; 
  @Input() Names: any;
  @Input() clientIdData: any;
  public loading: boolean = false;
  public currentDate = new Date(); 
  public FromDate:any = new Date(this.currentDate); 
  public ToDate:any = new Date();
  public pageNo: number = 1;
  public pageSize;  
  public sortingValue: string = "created,desc";
  public jobLogDeatils:any;   
  public filterCountDate: any=0; 
  endDay:Date;
  userpreferences: Userpreferences;
  public loadingscroll: boolean = false;
  public canLoad = false;
  public pendingLoad = false;  
  public totalDataCount: any;
  public descending:boolean=false;  
  public ascending:boolean=true;
  dirctionalLang;
  animationVar: any;
  ClearFromDate:string;
  ClearToDate:string

  constructor(private snackBService: SnackBarService, private translateService: TranslateService,
     public candidateService: CandidateService,  public dialog: MatDialog, private _userpreferencesService: UserpreferencesService, public jobService:JobService,private appSettingsService:AppSettingsService ) {
      this.pageNo = this.appSettingsService.pageOption;
      this.pageSize = this.appSettingsService.pagesize;
      }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.FromDate.setMonth(this.FromDate?.getMonth() - 1);
    // <!---------@When: 07-07-2023 @who:Adarsh singh @why: EWM-13010 --------->
    this.FromDate = this.appSettingsService.getUtcFromDateFormat(this.FromDate);
    this.ToDate = this.appSettingsService.getUtcFromDateFormat(this.ToDate);
    // End 
   this.ClearFromDate=this.FromDate;//by maneesh its use for clear filter data,when:28/05/2024 
   this.ClearToDate=this.ToDate;//by maneesh its use for clear filter data,when:28/05/2024 

    this.jobLogDetails();
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    //this.ToDate.setDate(this.ToDate?.getDate()+ 30);

    this.animationVar = ButtonTypes;
  
  }



   /*
 @Type: File, <ts>
 @Name: onScrollDown
 @Who: Nitin Bhati
 @When: 17-Sep-2021
 @Why: EWM-2859
 @What: To add data on page scroll.
 */
 onScrollDown(ev?) {
  this.loadingscroll = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.jobLogDeatils.length) {
      this.pageNo = this.pageNo + 1;
      this.fetchMoreRecord();
    }
    else {
      this.loadingscroll = false;
    }
  } else {
    this.loadingscroll = false;
    this.pendingLoad = true;
  }
}


  /*
 @Type: File, <ts>
 @Name: fetchMoreRecord
 @Who: Suika
 @When: 04-June-2018
 @Why: EWM-7401. EWM-7509
 @What: To get more data from server on page scroll.
 */

fetchMoreRecord() { 
  const d = new Date(this.FromDate);
  let FromDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
  const e = new Date(this.ToDate);
  let ToDate = new Date(e.getFullYear(), e.getMonth(), e.getDate(), e.getHours(), e.getMinutes() - e.getTimezoneOffset()).toISOString();
  this.jobService.getJobLogDetails(this.pageNo,this.pageSize,this.jobIdData,FromDate,ToDate,this.sortingValue).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loadingscroll = false;
        this.totalDataCount = repsonsedata.TotalRecord;
        let nextgridView: any = [];
        nextgridView = repsonsedata.Data;
        this.jobLogDeatils = this.jobLogDeatils.concat(nextgridView);
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.totalDataCount = repsonsedata.TotalRecord;
        this.loadingscroll = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loadingscroll = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

   /*
  @Type: File, <ts>
  @Name: jobLogDetails
  @Who: Suika
  @When: 04-June-2018
  @Why: EWM-7401. EWM-7509
  @What: job log  list for candidate
*/
jobLogDetails() {
  this.loading = true;
  let FromDate = this.FromDate;
  let ToDate = this.ToDate;
  this.jobService.getJobLogDetails(this.pageNo,this.pageSize,this.jobIdData,FromDate,ToDate,this.sortingValue).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.jobLogDeatils = repsonsedata.Data;   
        this.totalDataCount =  repsonsedata.TotalRecord;  
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 204) {
        this.jobLogDeatils = [];
        this.loading = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    })
}



  /* 
 @Type: File, <ts>
 @Name: openDateFilterDialog function 
 @Who: Suika
 @When: 05-July-2022
 @Why: EWM-7401 EWM-7509
 @What: open date filter dialog
 */
openDateFilterDialog() {
  const dialogRef = this.dialog.open(DateFilterComponent, {
    // data: dialogData,
    panelClass: ['xeople-modal', 'add_teamMate', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    data: new Object({
      fromDate: this.FromDate, ToDate: this.ToDate,filterCountDate:this.filterCountDate,isJobLog:true
    }),
  });
  dialogRef.afterClosed().subscribe(result => {
 if(result?.resType==true){  
  this.FromDate = result.FromDate;
  this.ToDate = result.ToDate;
  if (this.FromDate && this.ToDate) {
    this.filterCountDate = 1;
    var element = document.getElementById("filter-date");
    element.classList.add("active");
  }
  this.pageNo = 1;
  this.jobLogDetails();
 }

  });
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }

  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }	

}


sortingJobLog(sortVal){
  if(sortVal=='desc'){
    this.pageNo=1;
    this.sortingValue = 'created,desc';
    this.descending = false;
    this.ascending = true;
  }else{
    this.pageNo=1;
    this.sortingValue = 'created,asc';  
    this.ascending = false;
    this.descending = true;
  }
  this.jobLogDetails();
}



sortName(fisrtName, lastName) {
  const Name = fisrtName;
  const ShortName = Name.match(/\b(\w)/g).join('');
  return ShortName.toUpperCase();

}

 // @When: 27-09-2023 @who:Amit @why: EWM-14465 @what: btn animation function
 mouseoverAnimation(matIconId, animationName) {
  let amin = localStorage.getItem('animation');
  if (Number(amin) != 0) {
    document.getElementById(matIconId).classList.add(animationName);
  }
}
mouseleaveAnimation(matIconId, animationName) {
  document.getElementById(matIconId).classList.remove(animationName)
}


  /*
    @Type: File, <ts>
    @Name: clearFilterData function
    @Who: Anup Singh
    @When: 20-oct-2021
    @Why: EWM-3039
    @What: FOR DIALOG BOX confirmation
  */
 
 clearFilterData(): void {
  const message = `label_confirmDialogJob`;
  const title = '';
  const subTitle = 'label_job_log';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      // this.FromDate = new Date(this.currentDate);
      // this.FromDate.setMonth(this.FromDate?.getMonth() - 1);
      // this.ToDate = new Date();
      this.FromDate=this.ClearFromDate //by maneesh ewm-13058 for when clear date filter then fixed 400 issue 
      this.ToDate=this.ClearToDate; 
      this.filterCountDate=0;   
      this.jobLogDetails();    
    }
  });

  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

}
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}
}
