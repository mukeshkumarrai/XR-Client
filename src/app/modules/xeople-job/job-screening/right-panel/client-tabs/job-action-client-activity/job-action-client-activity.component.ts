import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
 import { MediaMatcher } from '@angular/cdk/layout';
 import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { ResponceData } from '@app/shared/models';
import { QuickAddActivity } from '@app/modules/EWM.core/shared/quick-modal/quick-add-activity/quick-add-activity.component';
import { JobScreening } from '@app/shared/models/job-screening';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-job-action-client-activity',
  templateUrl: './job-action-client-activity.component.html',
  styleUrls: ['./job-action-client-activity.component.scss']
})
export class JobActionClientActivityComponent implements OnInit {
  activatedRoute:any;
  public activityHistory: any = [];
  loading: boolean = false;
  public pageNo = 1;
  public oldMonthtotal: number;
  public upCommingtotal: number;
  public currentMonthtotal: number;
  public pagesize;
  public pageOption: any;
  public upCommingData:any=[];
  public currentMonthData:any=[];
  public oldMonthData:any=[];
  public currentDateTime :Number = new Date().getTime();
  public currentDate = new Date();
  mobileQueryClick: MediaQueryList;
  mobileQuery: MediaQueryList;
  desktopQueryOver: MediaQueryList;
  cardId:any;
  selectedTabIndex: number;
  @ViewChild('outer') public outer: ElementRef;
  @ViewChild('inner') public inner: ElementRef;
  public expanded: boolean = false;
  positionMatTab: any;
  private _mobileQueryListener: () => void;
  @Input() clientId: any;
  dataSubscription: Subscription;
  searchSubject$ = new Subject<any>();
  public searchText: string=''
  public searchparam: string=''
  public clearcacheParam='';
  constructor(private router: ActivatedRoute,private route: Router,
    private snackBService: SnackBarService,private translateService: TranslateService,
    private appSettingsService: AppSettingsService,
    public candidateService: CandidateService, @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private commonserviceService: CommonserviceService,) {
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
    this.dataSubscription =  this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      let candidateList = res?.SelectedCandidate;
      if (candidateList?.length>0) {
       if(res.PageName=='clientTab'){
        this.upCommingData=[];
        this.currentMonthData=[];
        this.oldMonthData=[];
        this.getActivityHistoryUpcoming();
        this.getActivityHistorycurrentMonth();
        this.getActivityHistoryoldMonth();
        }
      }
    });
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab = res;
    });
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      // this.loadingSearch = true;
       this.upCommingData =[];
       this.getActivityHistoryUpcoming();
        this.currentMonthData =[];
        this.getActivityHistorycurrentMonth();
         this.oldMonthData =[];
         this.getActivityHistoryoldMonth();
        });
    this.document.body.classList.remove('activity-remove-height');//by maneesh ewm-17740
  }
  public hasMoreItems(): boolean {
    if (this.inner && this.outer) {

      return (
        this.inner.nativeElement.offsetHeight >
        this.outer.nativeElement.offsetHeight
      );
    }
    return false;
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
        tabIndex=7;
         break;
      }
      case 'mail': {
        tabIndex=5;
         break;
      }
      case 'job': {
        tabIndex=1;
         break;
      }
   }
   let fullUrl = `client/core/clients/list/client-detail?clientId=${this.clientId}&cliTabIndex=${tabIndex}`
   window.open(fullUrl, '_blank');
  }
  noupcomingData='';
  getActivityHistoryUpcoming(){
    this.noupcomingData='Loading Data ...';
    let requestData= '?UserIdGuid='+ this.clientId +'&PageSize='+this.pagesize +'&Page=' + this.pageNo +'&View='+1 +'&Usertype=CLIE'+this.searchparam +this.clearcacheParam;
    this.candidateService.getcandidateActivityHistory(requestData).subscribe(
      (repsonsedata: ResponceData) => {
        this.clearcacheParam='';
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          let nextgridView:any = [];
           nextgridView = repsonsedata.Data;
           this.upCommingData = this.upCommingData.concat(nextgridView);
           this.upCommingtotal = repsonsedata.TotalRecord;
        }
        else if(repsonsedata['HttpStatusCode'] == '204'){
          this.noupcomingData ='No Data Found';
          this.upCommingData = repsonsedata.Data;
          this.loading = false;
        }
         else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  getActivityHistorycurrentMonth(){
    let requestData= '?UserIdGuid='+ this.clientId +'&PageSize='+this.pagesize +'&Page=' + this.pageNo +'&View='+2 +'&Usertype=CLIE'+this.searchparam +this.clearcacheParam;
    this.candidateService.getcandidateActivityHistory(requestData).subscribe(
      (repsonsedata: ResponceData) => {
        this.clearcacheParam='';
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          let nextgridView:any = [];
           nextgridView = repsonsedata.Data;
           this.currentMonthData = this.currentMonthData.concat(nextgridView);
           this.currentMonthtotal = repsonsedata.TotalRecord;

        }
        else if(repsonsedata['HttpStatusCode'] == '204'){
          this.currentMonthData = repsonsedata.Data;
          this.loading = false;
        }
         else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  getActivityHistoryoldMonth(){
    this.loading = true;
    let requestData= '?UserIdGuid='+ this.clientId +'&PageSize='+this.pagesize +'&Page=' + this.pageNo +'&View='+3 +'&Usertype=CLIE'+this.searchparam +this.clearcacheParam;
    this.candidateService.getcandidateActivityHistory(requestData).subscribe(
      (repsonsedata: ResponceData) => {
        this.clearcacheParam='';
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          let nextgridView:any = [];
           nextgridView = repsonsedata.Data;
           this.oldMonthData = this.oldMonthData.concat(nextgridView);
           this.oldMonthtotal = repsonsedata.TotalRecord;
        }
        else if(repsonsedata['HttpStatusCode'] == '204'){
          this.oldMonthData = repsonsedata.Data;
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
  onScrollDownupComming() {
    if (this.upCommingtotal > this.upCommingData?.length) {
      this.pageNo = this.pageNo + 1;
      if(this.selectedTabIndex ===0){
        this.getActivityHistoryUpcoming();
      }
    }
  }
  onScrollDowncurrentMonth() {
    if (this.currentMonthtotal > this.currentMonthData?.length) {
      this.pageNo = this.pageNo + 1;
      if(this.selectedTabIndex ===1){
        this.getActivityHistorycurrentMonth();
      }
    }
  }
  onScrollDownoldMonth() {
    if (this.oldMonthtotal > this.oldMonthData?.length) {
      this.pageNo = this.pageNo + 1;
      if(this.selectedTabIndex ===2){
        this.getActivityHistoryoldMonth();
      }
    }
  }
  refresh(){
    this.pageNo = 1;
    this.upCommingData=[];
    this.currentMonthData=[];
    this.getActivityHistoryUpcoming();
    this.getActivityHistorycurrentMonth();
    this.getActivityHistoryoldMonth();
  }
  openQuickAddActivity(): void{
    const dialogRef = this.dialog.open(QuickAddActivity, {
      // @When: 28-08-2023 @who:Amit @why: EWM-13886 @what: add class
      panelClass: ['xeople-modal-full-screen', 'quick-modal-full-screen', 'quickAddActivity', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }
  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    this.pageNo=1;

  }
  expandCollapseActivity(param){
    if(this.cardId ===param){
      this.cardId=null;
    }else{
      let el = document.getElementById(param);
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      this.cardId =param;
    }
  }
  Search(text){
    this.searchparam='';
    this.searchparam = '&Search='+text;
    this.searchSubject$.next(text);
  }
  searchClear(){
    this.searchparam='';
    this.searchText='';
    this.searchSubject$.next(this.searchText);
  }
}
