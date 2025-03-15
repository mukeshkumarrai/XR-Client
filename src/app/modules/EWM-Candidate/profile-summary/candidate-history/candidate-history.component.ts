import { ChangeDetectorRef, Component, Input, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { Icandidate } from '../candidate-summary/Icandidate.interface';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { QuickAddActivity } from '@app/modules/EWM.core/shared/quick-modal/quick-add-activity/quick-add-activity.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { ResponceData } from '@app/shared/models';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { CommonAddCallLogComponent } from '@app/modules/EWM.core/client/client-detail/common-add-call-log/common-add-call-log.component';

@Component({
  selector: 'app-candate-history',
  templateUrl: './candidate-history.component.html',
  styleUrls: ['./candidate-history.component.scss']
})
export class CandidateHistoryComponent implements OnInit {
  public activityHistory: any = [];
  @Input() candidateId: any;
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
  cardId:number;
  selectedTabIndex: number=1;
  @ViewChild('outer') public outer: ElementRef;
  @ViewChild('inner') public inner: ElementRef;
  public expanded: boolean = false;
  positionMatTab: any;
  public searchText: string=''
  public searchparam: string=''
  public clearcacheParam='';
  public startOfCurrentWeek
  searchSubject$ = new Subject<any>();
  private _mobileQueryListener: () => void;
  @ViewChild('viewActivity') public sidenav: MatSidenav;
  uniqueId: string='00000000-0000-0000-0000-000000000000';
  public gridListView: any = [];
  unSubscripViewNotificationData: Subscription;
  activatedRoute: any;
  notificationLoading:string='label_loading';
  candidateIdUnique: string;
  @Input() ShortName: string;
  @Input() candidateName: string;
  @Input() StatusColorCode: string;
  @Input() ImageUrl: string;
  gridListData: any[] = [];
  tONameRedirectUrl: string;
  fromRedirectUrl: string;
  detailsSummeryUrl: string = 'null';
  PhoneNumber:number;
  public emailId:string;
  public ProfileImagePath:string;
  getCallLogData: any = [];
  public result: string = '';
  public filterConfig: any;
  dirctionalLang;
  constructor(private router: ActivatedRoute,private route: Router,
    private snackBService: SnackBarService,private translateService: TranslateService,
    private appSettingsService: AppSettingsService,
    public candidateService: CandidateService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document,
    private sanitizer: DomSanitizer,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private commonserviceService: CommonserviceService,) {
    this.pagesize = this.appSettingsService.pagesize;
    this.pageOption = this.appSettingsService.pageOption;
    this.mobileQuery = media.matchMedia('(max-width: 900px)');;
    this.mobileQueryClick = media.matchMedia('(max-width: 1024px)');
    this.desktopQueryOver = media.matchMedia('(min-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.getCallLogData = JSON.parse(localStorage.getItem('candidateCallLogData'));  
    this.candidateName = this.getCallLogData?.Name;
    this.candidateId = this.getCallLogData?.CandidateId;
    this.StatusColorCode = this.getCallLogData?.StatusColorCode;
    this.ShortName = this.getCallLogData?.ShortName;
    this.ImageUrl = this.getCallLogData?.ImageUrl;
    this.PhoneNumber = this.getCallLogData?.PhoneNumber;
    this.emailId=this.getCallLogData?.CandidateEmail;
    this.ProfileImagePath=this.getCallLogData?.CandidateImage;

  }
  ngOnInit(): void {
    this.activatedRoute = this.router.url;
    this.router.queryParams.subscribe((value) => {
      if(value?.CandidateId){
        this.candidateId = value?.CandidateId;
      }
      
    });
    this.startOfCurrentWeek = this.getStartOfCurrentWeek();
    this.getcandidateActivityHistoryUpcoming();
    this.getcandidateActivityHistorycurrentMonth();
    this.getcandidateActivityHistoryoldMonth();
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab = res;
    });
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
     // this.loadingSearch = true;
      this.upCommingData =[];
        this.getcandidateActivityHistoryUpcoming();
       this.currentMonthData =[];
        this.getcandidateActivityHistorycurrentMonth();
        this.oldMonthData =[];
        this.getcandidateActivityHistoryoldMonth();


       });
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
    this.router.queryParams.subscribe((value) => {
      if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='' && value.cantabIndex=='4') {
        this.sidenav.close();
        this.uniqueId = value?.uniqueId;
        this.sidenav.toggle();
        this.gridListView=[];
        this.viewActivityLogById(this.uniqueId); 
        if(this.candidateIdUnique!=value?.CandidateId){
          this.candidateIdUnique = value?.CandidateId;
          this.upCommingData =[];
          this.getcandidateActivityHistoryUpcoming();
         this.currentMonthData =[];
          this.getcandidateActivityHistorycurrentMonth();
          this.oldMonthData =[];
          this.getcandidateActivityHistoryoldMonth();
        }
      }
    });
    this.document.body.classList.add('activity-remove-height');
  }
  viewActivityLogById(Id: string) {
    this.loading = true;
  this.unSubscripViewNotificationData= this.candidateService.getActivityLogById('?Id='+Id+'&UserType='+'CAND')
      .subscribe(
        (data: ResponceData) => {
          this.route.navigate([],{
          relativeTo: this.activatedRoute,
          queryParams: {uniqueId: null},
          queryParamsHandling: 'merge'
        });
          if (data.HttpStatusCode === 200) {
            this.loading = false;
            this.gridListView=data?.Data;
            }
          else if(data.HttpStatusCode === 204) {
            this.notificationLoading='label_RecordDeleted';
            this.loading = false;
            this.gridListView=[];
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
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
        tabIndex=3;
        break;
      }
      case 'sms': {
        tabIndex=8;
        break;
      }
      case 'call': {
        tabIndex=10;
        break;
      }
    }
    this.route.navigate([],{
      relativeTo: this.activatedRoute,
      queryParams: { cantabIndex: tabIndex },
      queryParamsHandling: 'merge'
    });
  }
  getcandidateActivityHistoryUpcoming(){
    let requestData= '?UserIdGuid='+ this.candidateId +'&PageSize='+this.pagesize +'&Page=' + this.pageNo +'&View='+1 + '&Usertype=CAND'+this.searchparam +this.clearcacheParam;
    this.candidateService.getcandidateActivityHistory(requestData).subscribe(
      (repsonsedata: Icandidate) => {
        this.clearcacheParam =''
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          let nextgridView:any = [];
          nextgridView = repsonsedata.Data;
          this.upCommingData = this.upCommingData.concat(nextgridView);
          this.upCommingtotal = repsonsedata.TotalRecord;
        }
        else if(repsonsedata['HttpStatusCode'] == '204'){
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
  getcandidateActivityHistorycurrentMonth(){
    let requestData= '?UserIdGuid='+ this.candidateId +'&PageSize='+this.pagesize +'&Page=' + this.pageNo +'&View='+2 + '&Usertype=CAND'+this.searchparam +this.clearcacheParam;
    this.candidateService.getcandidateActivityHistory(requestData).subscribe(
      (repsonsedata: Icandidate) => {
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
  getcandidateActivityHistoryoldMonth(){
    this.loading = true;
    let requestData= '?UserIdGuid='+ this.candidateId +'&PageSize='+this.pagesize +'&Page=' + this.pageNo +'&View='+3 + '&Usertype=CAND'+this.searchparam +this.clearcacheParam;
    this.candidateService.getcandidateActivityHistory(requestData).subscribe(
      (repsonsedata: Icandidate) => {
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
        this.getcandidateActivityHistoryUpcoming();
      }
    }
  }
  onScrollDowncurrentMonth() {

    if (this.currentMonthtotal > this.currentMonthData?.length) {
      this.pageNo = this.pageNo + 1;
      if(this.selectedTabIndex ===1){
        this.getcandidateActivityHistorycurrentMonth();
      }
    }
  }
  onScrollDownoldMonth() {
    if (this.oldMonthtotal > this.oldMonthData?.length) {
      this.pageNo = this.pageNo + 1;
      if(this.selectedTabIndex ===2){
        this.getcandidateActivityHistoryoldMonth();
      }
    }
  }
  refresh(){
    this.pageNo=1;
    this.clearcacheParam ='&clearcache=1'
    this.upCommingData=[];
    this.currentMonthData=[];
    this.oldMonthData=[];
    this.getcandidateActivityHistoryUpcoming();
    this.getcandidateActivityHistorycurrentMonth();
    this.getcandidateActivityHistoryoldMonth();
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

  returnFullName(Code){
    switch (Code) {
      case 'CAND':
        return 'Candidate';
        break;
      case 'CONT':
        return 'Contact';
        break;
      case 'CLIE':
        return 'Client';
         break;
      case 'JOB':
        return 'Job';
        break;   
    }
  }

 
  
  OpenDocuemntPopUp(add) {
    const dialogRef = this.dialog.open(CommonAddCallLogComponent, {
      data: new Object({
        ShortName: this.ShortName, Name: this.candidateName, Id: this.candidateId, StatusColorCode: this.StatusColorCode,
        ImageUrl: this.ImageUrl, usertype: "CAND", isEdit: add, gridlistData: this.gridListData,
        ToNameredirectUrl: this.tONameRedirectUrl,reletedUserTypeCodeValue:'Candidate',reletedUserTypeCode:'CAND',
        FromNameredirectUrl: this.fromRedirectUrl, detailsSummeryUrl: this.detailsSummeryUrl,
        PhoneNumber:this.PhoneNumber,EmailId:this.emailId,ProfileImagePath:this.ProfileImagePath
      }),
      panelClass: ['xeople-modal', 'add-calllog', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;      
      if (dialogResult == true) {
        this.filterConfig = [];
        // let JobFilter = [];
        this.loading = true;
        // this.getFilteredConfig();
        // this.sendRequest(this.state)
        this.commonserviceService.countDataRefreshForContact.next({candidateCall:true,candidateId:this.candidateId});
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

  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }

}

