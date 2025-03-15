import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { ResponceData } from 'src/app/shared/models';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
@Component({
  selector: 'app-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss']
})
export class EmployeeHistoryComponent implements OnInit {

  activatedRoute:any;
  public activityHistory: any = [];
  public candidateId: string;
  loading: boolean = false;
  public pageNo = 1;
  public totalDataCount: number;
  public pagesize;
  public pageOption: any;
  public upCommingData:any[] = [];
  public currentMonthData:any[] = [];
  public currentDate :Number = new Date().getTime();
  mobileQueryClick: MediaQueryList;
  mobileQuery: MediaQueryList;
  desktopQueryOver: MediaQueryList;

private _mobileQueryListener: () => void;
constructor(private router: ActivatedRoute,private route: Router,
  private snackBService: SnackBarService,private translateService: TranslateService,
  private appSettingsService: AppSettingsService,
  public candidateService: CandidateService,
  changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
  this.activatedRoute = this.router.url;
  this.pagesize = this.appSettingsService.pagesize;
  this.pageOption = this.appSettingsService.pageOption;
  this.mobileQuery = media.matchMedia('(max-width: 900px)');;
  this.mobileQueryClick = media.matchMedia('(max-width: 1024px)');
  this.desktopQueryOver = media.matchMedia('(min-width: 1024px)');
  this._mobileQueryListener = () => changeDetectorRef.detectChanges();
  this.mobileQuery.addListener(this._mobileQueryListener);
}

ngOnInit(): void {
  this.activatedRoute = this.router.url;
  this.router.queryParams.subscribe((value) => {
    this.candidateId = value.CandidateId;
  });
  this.getcandidateActivityHistoryAll();

}
tabChange(tabid){
let tab = tabid.toLowerCase();
let tabIndex=0;
switch(tab) {

  case 'note': {
    tabIndex=6;
     break;
  }
  case 'meeting': {
    tabIndex=5;
     break;
  }
  case 'mail': {
    tabIndex=3;
     break;
  }
  case 'job': {
    tabIndex=4;
     break;
  }
  case 'sms': {
    tabIndex=9;
     break;
  }
  case 'History': {
    tabIndex=7;
     break;
  }


}
this.route.navigate([],{
  relativeTo: this.activatedRoute,
  queryParams: { cantabIndex: tabIndex },
  queryParamsHandling: 'merge'
});
}
getcandidateActivityHistoryAll(){
this.loading = true;
let requestData= '?CandidateId='+ this.candidateId +'&PageSize='+this.pagesize +'&PageNumber=' + this.pageNo;
this.candidateService.getcandidateActivityHistory(requestData).subscribe(
  (repsonsedata: ResponceData) => {
    if (repsonsedata['HttpStatusCode'] == '200') {
      this.loading = false;
      let nextgridView:any = [];
       nextgridView = repsonsedata.Data;
       nextgridView.forEach((element:any) => {
        if (element?.Created > this.currentDate) {
          this.upCommingData.push(element)
        }else{
          this.currentMonthData.push(element)
        }
       });
       this.activityHistory = this.activityHistory.concat(nextgridView);
       this.totalDataCount = repsonsedata.TotalRecord;

    }
    else if(repsonsedata['HttpStatusCode'] == '204'){
      this.activityHistory = repsonsedata.Data;
      this.loading = false;
    }
     else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
      this.loading = false;
    }
  }, err => {
    this.loading = false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  })
}
onScrollDown() {
console.log('getcandidateActivityHistoryAll');
  if (this.totalDataCount > this.activityHistory?.length) {
    this.pageNo = this.pageNo + 1;
   this.getcandidateActivityHistoryAll();
  }
}

refresh(){
this.pageNo = 1;
this.upCommingData=[];
this.currentMonthData=[];
this.getcandidateActivityHistoryAll();
}
}
