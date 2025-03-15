import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
 import { MediaMatcher } from '@angular/cdk/layout';
 import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { ResponceData } from '../../../../shared/models/responce.model';
import { QuickAddActivity } from '../../../../modules/EWM.core/shared/quick-modal/quick-add-activity/quick-add-activity.component';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-client-history',
  templateUrl: './client-history.component.html',
  styleUrls: ['./client-history.component.scss']
})
export class ClientHistoryComponent implements OnInit {
  activatedRoute:any;
  public activityHistory: any = [];
  public clientId: string;
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
  public startOfCurrentWeek;
  selectedTabIndex: number=1;
  @ViewChild('outer') public outer: ElementRef;
  @ViewChild('inner') public inner: ElementRef;
  public expanded: boolean = false;
  positionMatTab: any;
  public searchText: string=''
  public searchparam: string=''
  public clearcacheParam='';
  searchSubject$ = new Subject<any>();
  private _mobileQueryListener: () => void;
  @Input ()clientType:string;
  constructor(private router: ActivatedRoute,private route: Router,
    private snackBService: SnackBarService,private translateService: TranslateService,
    private appSettingsService: AppSettingsService,
    public candidateService: CandidateService,
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
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
    this.activatedRoute = this.router.url;
    this.router.queryParams.subscribe((value) => {
      this.clientId = value.clientId;
    });
    this.startOfCurrentWeek = this.getStartOfCurrentWeek();
    this.getActivityHistoryUpcoming();
  this.getActivityHistorycurrentMonth();
  this.getActivityHistoryoldMonth();
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
        this.commonserviceService.onClientSelectId.subscribe(value => {  // add api calling when change client dropdown ewm-18382 when:30/10/2024
          if (value !== null) {
            this.clientId = value;
            this.getActivityHistoryUpcoming();
            this.getActivityHistorycurrentMonth();
            this.getActivityHistoryoldMonth();
           }
        })
  }
  private getStartOfCurrentWeek(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.getTime();
  }
  public ngAfterViewInit(): void {
    this.document.body.classList.add('activity-remove-height');
  }
  public ngOnDestroy(): void {
    this.document.body.classList.remove('activity-remove-height');
  }
  public hasMoreItems(): boolean {
    if (this.inner && this.outer) {
      console.log(
        this.inner.nativeElement.offsetHeight,
        this.outer.nativeElement.offsetHeight
      );
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
    if (this.clientType.toLowerCase()=='lead') {
      switch(tab) {
        
        case 'note': {
          tabIndex=5;
           break;
        }
        case 'meeting': {
          tabIndex=6;
           break;
        }
        case 'mail': {
          tabIndex=4;
           break;
        }
        case 'sms': {
          tabIndex=9;
           break;
        }
        case 'call': {
          tabIndex=10;
           break;
        }
     }
    }else{
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
        case 'sms': {
          tabIndex=10;
           break;
        }
        case 'call': {
          tabIndex=11;
           break;
        }
     }
    }

    this.route.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: { cliTabIndex: tabIndex },
      queryParamsHandling: 'merge'
    });
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
    console.log('this.selectedTabIndex ',this.selectedTabIndex );
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
    this.clearcacheParam ='&clearcache=1';
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
  decimalPipe(Duration){
    const decimalHours = Duration; // 13 hours and 75% of an hour
    const minutes = Math.floor(decimalHours / 60 / 1000);
    let milliminut = minutes;
    const seconds = Math.floor(decimalHours / 1000) % 60;
   let  milliminutSecond = seconds;
    return milliminut +' ' +'minute'+' ' +milliminutSecond +' '+ 'second';
  }
}
