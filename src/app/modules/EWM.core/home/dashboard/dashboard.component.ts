/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Naresh Singh
  @When: 12-Jul-2021
  @Why: EWM-2009 EWM-2049
  @What:  This page will be use for the Customizing Widgets component ts file
*/

import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomizingWidgetService } from 'src/app/shared/services/dashboard-widget/customizing-widget/customizing-widget.service';
import { ResponceData,Job,CountEntity,LastJobsEntity,MyInbox,DasboardActivity,DashboardAction,DashboardCandidate,StageDetails} from 'src/app/shared/models';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { Userpreferences } from 'src/app/shared/models/common.model';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ButtonTypes } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subscription } from 'rxjs';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  public pageNo: number = 1;
  public pageSize = 200;
  searchVal: string = '';
  public gridData: any = [];
  public leftGridData: any = [];
  public rightGridData: any = [];
  next: number = 0;
  public loading: boolean = false;
  public IsEnabled: any;
  public groupId = '';
  public isButtonActive: boolean = false;
  changeText: boolean;

  public dasboardMapData: any;
  public dasboardMapPopUpData: any;
  public filterConfig: any;
  public maploading: boolean = false;
  TotalNoOfClient: number;
  TotalRecord: number;

  infoWindowOpened = null
  previous_info_window = null
  animationVar: any;
  public origin: any;
  public destination: any;
  Datalimit:number;
  Expiredays:number;
  countList:any[];
  lastJobsList:any[];
  public userpreferences: Userpreferences;
  dashboardActivityList: any=[];
  totalTodayActivity: number;
  totalActivityInWeek: number;
  MyInboxData:MyInbox;
  DasboardActivity:DasboardActivity;
  DashboardAction:DashboardAction;
  DashboardCandidate:DashboardCandidate;

  public myInboxColor: string;
  public myJobColor: string ;
  public myActivityColor: string;
  public candidateColor: string;
  public recentActionColor: string;

  public numberCounterSpeed: number;

  @ViewChild('countMyInbox') countMyInbox: any;
  @ViewChild('countMyUnread') countMyUnread: any;
  @ViewChild('countMyInboxToday') countMyInboxToday: any;
  @ViewChild('countMyDraft') countMyDraft: any;

  @ViewChild('countTotalJob') countTotalJob: any;
  @ViewChild('countExpiringIn7') countExpiringIn7: any;
  @ViewChild('countJobPostedToday') countJobPostedToday: any;

  @ViewChild('countMyActivityToday') countMyActivityToday: any;
  @ViewChild('countMyActivityUpcoming') countMyActivityUpcoming: any;
  @ViewChild('countMyActivityThisWeek') countMyActivityThisWeek: any;

  @ViewChild('countCandidateTotal') countCandidateTotal: any;
  @ViewChild('countCandidateMapToJob') countCandidateMapToJob: any;
  @ViewChild('countKnockedOut') countKnockedOut: any;
  @ViewChild('countOtherSources') countOtherSources: any;

  @ViewChild('countRecentActionsToday') countRecentActionsToday: any;
  @ViewChild('countRecentActionsThisWeek') countRecentActionsThisWeek: any;
  candidateIsEnabled: string;
  myActivityIsEnabled: string;
  myInboxIsEnabled: string;
  myJobIsEnabled: string;
  recentActionIsEnabled: string;
  dashboardJobdata:Job;
 countEntity:CountEntity;
 lastJobsEntity:LastJobsEntity;
  MyInboxDataLength: number;
  loadingMyInbox: boolean;
  loadingMyJob: boolean;
  loadingMyActivity: boolean;
  loadingMyAction: boolean;
  loadingCandidate: boolean;
  totalJobs: number;
  jobsPostedToday: number;
  expireIn7Days: number;
  ShowDummyDashboard: number;
  DashboardCandidateSubscription: Subscription;
  DashboardActionSubscription: Subscription;
  MyInboxDataSubscription: Subscription;
  DasboardActivitySubscription: Subscription;
  dashboardJobdataSubscription: Subscription;
  dashboardGridDataSubscription: Subscription;
  oraganizationChangeSubscription: Subscription;
  dashboard:string;
  token:string;
  public userEmail: string="";
  public companyId: string="";
  public IsDashboardAavailable: Number=0;  
  SessionId='';    
  dasboardurl:string =''
   constructor(public _sidebarService: SidebarService, private router: Router,
     public snackBService: SnackBarService, private commonServiesService: CommonServiesService,private translateService: TranslateService, private customizingWidgetService: CustomizingWidgetService,
     private activatedRoutes: ActivatedRoute,
     private _appSetting: AppSettingsService,public _userpreferencesService: UserpreferencesService,private _commonserviceService: CommonserviceService,private _systemSettingService: SystemSettingService) {
      this.numberCounterSpeed = this._appSetting.getCounterDashboardTimer;
      this.Datalimit = this._appSetting.getDatalimit;
      this.Expiredays = this._appSetting.getExpiredays;
      this.ShowDummyDashboard = this._appSetting.ShowDummyDashboard;
      let Token = localStorage.getItem('Token');
      this.IsDashboardAavailable=0;
      this.companyId= localStorage.getItem('tenantDomain')
      this.token=Token;
      const storedUserInfo = localStorage.getItem('currentUser'); 
      let userInfo = JSON.parse(storedUserInfo);
      this.SessionId=userInfo?.SessionId;
     
     
      //this.dashboard = "https://dashboards.entiredev.in/authcheck?source=xr&email="+this.userEmail+"&companyId="+this.companyId+"&orignUrl="+window.location.origin+"&SessionId="+this.SessionId+"&token="+this.token;
     }

  ngOnInit(): void {
    let URL = this.router.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
  this.getInitializePage();
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    const pageTitle= 'label_dashboard';
    this._commonserviceService.setTitle(pageTitle);
  /*--@When:16-05-2023 @who:Nitin Bhati,@why:EWM-12445,@what:For redirect to dashboard demo page--*/
    if(this.ShowDummyDashboard==1){
      this.loading = false;
      this.router.navigate(['./client/core/home/dashboardv1']);
      }
    /* @When: 23-03-2023 @who:Amit @why: EWM-11380 @what: search enable */
    this.commonServiesService.searchEnableCheck(1);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.getWidgetList();
    this.animationVar = ButtonTypes;
     /*--@When:24-05-2023 @who:Nitin Bhati,@why:EWM-12622,@what:showing data after change organization Names--*/
   this.oraganizationChangeSubscription= this._commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
        this.getWidgetList();
      }
     }) 
     let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    // this.userName=tenantData.FirstName + ' ' + tenantData.LastName;
   // this.dasboardurl =this._appSetting.dashboardurl;
   this.dasboardurl = "https://dashboards.entiredev.in";
    this.dashboard =  this.dasboardurl + "/authcheck?source=xr&email="+this.userEmail+"&companyId="+this.companyId+"&orignUrl="+window.location.origin+"&SessionId="+this.SessionId;
    this.userEmail=tenantData.EmailId;
    // this.activatedRoutes.queryParams.subscribe(params => { 
    //   let dashboardActive = params['dashboardActive'];
    //   if(dashboardActive==='yes') {
    //     this.IsDashboardAavailable=1;
    //   }
    // });
  }

  /*
     @Type: File, <ts>
     @Name: animateValue
     @Who: Satya Prakash Gupta
     @When: 06-May-2023
     @Why: EWM-12190 EWM-12206
     @What: Counter animation fucntion
   */
   animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = timestamp => {
      //  Set the actual time
      if (!startTimestamp) startTimestamp = timestamp;
      // Calculate progress (the time versus the set duration)
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Calculate the value compared to the progress and set the value in the HTML
      let amin = localStorage.getItem('animation');
      // --------@When: 26-june-2023 @who:Bantee Kumar @why: EWM-12857 --------
      if(obj){
      if (Number(amin) != 0) {
        obj.nativeElement.innerHTML = Math.floor(
          progress * (end - start) + start
        );
      }else{
        obj.nativeElement.innerHTML = end;
      }
    }
      // If progress is not 100%, an call a new animation of step
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    // Call a last animation of step
    window.requestAnimationFrame(step);
  }

  getWidgetList() {
          // who:maneesh,what:ewm-12746 comment loader,when:14/06/2023
   this.loading = true;
   this.dashboardGridDataSubscription= this.customizingWidgetService.getdashboardWidgetList(this.pageNo,this.pageSize).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.loading = false;
          this.gridData = repsonsedata.Data;
          this.leftGridData = this.gridData?.filter(x => x['WidgetLocation'] === 'L');
          this.rightGridData = this.gridData?.filter(x => x['WidgetLocation'] === 'R');

          this.gridData = repsonsedata.Data;

          let lData = this.gridData?.filter(x => x['WidgetLocation'] === 'L' && x['IsEnabled'] == 1);
          this.leftGridData = lData?.sort(function (a, b) {
            return a.WidgetSequence - b.WidgetSequence;
          });
          let rData = this.gridData?.filter(x => x['WidgetLocation'] === 'R' && x['IsEnabled'] == 1);
          this.rightGridData = rData?.sort(function (a, b) {
            return a.WidgetSequence - b.WidgetSequence;
          });
          if (this.leftGridData?.length > 0 || this.rightGridData?.length > 0) {
            this.isButtonActive = false;
          } else {
            this.isButtonActive = true;
          }
          this.gridData.forEach(element =>{
            if (element.WidgetName.toLowerCase() == 'my inbox') {
              this.myInboxColor=element.Color;
             }
            else if (element.WidgetName.toLowerCase() == 'my jobs') {
              this.myJobColor=element.Color;
             }
            else if (element.WidgetName.toLowerCase() == 'my activities') {
              this.myActivityColor=element.Color;
              }
            else if (element.WidgetName.toLowerCase() == 'candidates') {
                this.candidateColor=element.Color;
            }
            else if (element.WidgetName.toLowerCase() == 'recent actions') {
              this.recentActionColor=element.Color;
            }
          })
          this.getUserdashboardMyInbox();/*--@When:04-05-2023,@who:Nitin Bhati,@why:EWM-12190,EWM-12205,@what:For Inbox Dashboard-*/
          this.getUserdashboardjob(); /*--@When:03-05-2023,@who:Nitin Bhati,@why:EWM-12199,@what:For job Dashboard-*/
          this.getUserdashboardActivity();/*--@When:03-05-2023,@who:Nitin Bhati,@why:EWM-12211,@what:For Activity Dashboard-*/
          this.getUserdashboardCandidate();/*--@When:04-05-2023,@who:Nitin Bhati,@why:EWM-12194,EWM-12218,@what:For Inbox Dashboard-*/
          this.getUserdashboardAction();/*--@When:04-05-2023,@who:Nitin Bhati,@why:EWM-12194,EWM-12218s,@what:For Inbox Dashboard-*/

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }


  customizeDashboard() {
    this.router.navigate(['./client/core/profile/customizing-widgets']);
    this._sidebarService.topMenuAciveObs.next('profile');
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
  /*
  @Type: File, <ts>
  @Name: getUserdashboardjob
  @Who: Nitin Bhati
  @When: 03-05-2023
  @Why: EWM-12199
  @What: Api call for user dashboard JOb data
  */

  getUserdashboardjob() {
    this.loadingMyJob = true;
    this.dashboardJobdataSubscription=this.customizingWidgetService.getUserdashboardjob(this.Datalimit, this.Expiredays).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
         this.loadingMyJob = false;
          this.dashboardJobdata = repsonsedata.Data;
          this.countList = this.dashboardJobdata.Count;
          this.lastJobsList = this.dashboardJobdata.LastJobs;
          this.countList.forEach(element =>{
            if (element.Key.toLowerCase() == 'totaljobs') {
              this.totalJobs=element.JobsCount;
               this.animateValue(this.countTotalJob, 0, element.JobsCount, this.numberCounterSpeed);
            }
            else if (element.Key.toLowerCase() == 'jobspostedtoday') {
              this.jobsPostedToday=element.JobsCount;
              this.animateValue(this.countJobPostedToday, 0, element.JobsCount, this.numberCounterSpeed);
            }
            else if (element.Key.toLowerCase() == 'expirein7days') {
              this.expireIn7Days=element.JobsCount;
              this.animateValue(this.countExpiringIn7, 0, element.JobsCount, this.numberCounterSpeed);
            };
          })
            } else if(repsonsedata.HttpStatusCode == '204'){
            this.loadingMyJob=false;
            this.countList = [];
            this.lastJobsList = [];
           } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingMyJob = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loadingMyJob = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
 /*
  @Type: File, <ts>
  @Name: getUserdashboardjob
  @Who: Nitin Bhati
  @When: 03-05-2023
  @Why: EWM-12211
  @What: Api call for user dashboard Activity data
  */
  getUserdashboardActivity() {
    this.loadingMyActivity = true;
    this.DasboardActivitySubscription= this.customizingWidgetService.getUserdashboardActivity(this.Datalimit, this.Expiredays).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingMyActivity = false;
          this.DasboardActivity=repsonsedata.Data;
          this.animateValue(this.countMyActivityToday, 0, this.DasboardActivity.Today, this.numberCounterSpeed);
          this.animateValue(this.countMyActivityThisWeek, 0, this.DasboardActivity.NotCompleted, this.numberCounterSpeed);
          this.animateValue(this.countMyActivityUpcoming, 0, this.DasboardActivity.UpcomingSevenDays, this.numberCounterSpeed);

           } else if(repsonsedata.HttpStatusCode == '204'){
            this.loadingMyActivity=false;
            this.DasboardActivity.UpCommingFiveActivityList=[];
            } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingMyActivity = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loadingMyActivity = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }


  /*
  @Type: File, <ts>
  @Name: getUserdashboardInbox
  @Who: Nitin Bhati
  @When: 04-05-2023
  @Why: EWM-12205
  @What: Api call for user dashboard Inbox data
  */
  getUserdashboardMyInbox() {
    this.loadingMyInbox = true;
    this.MyInboxDataSubscription =  this.customizingWidgetService.getUserdashboardMyInbox(this.Datalimit, this.Expiredays).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingMyInbox = false;
          this.MyInboxData = repsonsedata.Data;
          this.animateValue(this.countMyInbox, 0, this.MyInboxData.Inbox , this.numberCounterSpeed);
          this.animateValue(this.countMyUnread, 0, this.MyInboxData.Unread, this.numberCounterSpeed);
          this.animateValue(this.countMyInboxToday, 0, this.MyInboxData.Today, this.numberCounterSpeed);
          this.animateValue(this.countMyDraft, 0, this.MyInboxData.Draft, this.numberCounterSpeed);
          } else if(repsonsedata.HttpStatusCode == '204'){
            this.loadingMyInbox = false;
            this.MyInboxData.ListOfTop5Mail = [];
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingMyInbox = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loadingMyInbox = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }

   /*
  @Type: File, <ts>
  @Name: getUserdashboardAction
  @Who: Nitin Bhati
  @When: 04-05-2023
  @Why: EWM-12194,EWM-12218
  @What: Api call for user dashboard Action data
  */
  getUserdashboardAction() {
    this.loadingMyAction = true;
    this.DashboardActionSubscription=  this.customizingWidgetService.getUserdashboardAction(this.Datalimit, this.Expiredays).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingMyAction = false;
          this.DashboardAction = repsonsedata.Data;
          this.animateValue(this.countRecentActionsToday, 0, this.DashboardAction.NoOfActionToday, this.numberCounterSpeed);
          this.animateValue(this.countRecentActionsThisWeek, 0, this.DashboardAction.NoOFActioninWeek, this.numberCounterSpeed);
          } else if(repsonsedata.HttpStatusCode == '204'){
            this.loadingMyAction=false;
            this.DashboardAction.ActionList = [];
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingMyAction = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loadingMyAction = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }

  /*
  @Type: File, <ts>
  @Name: getUserdashboardCandidate
  @Who: Nitin Bhati
  @When: 04-05-2023
  @Why: EWM-12193,EWM-12223
  @What: Api call for user dashboard Candidate data
  */
  getUserdashboardCandidate() {
    this.loadingCandidate = true;
   this.DashboardCandidateSubscription= this.customizingWidgetService.getUserdashboardCandidate(this.Datalimit, this.Expiredays).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingCandidate = false;
          this.DashboardCandidate = repsonsedata.Data;
           this.animateValue(this.countCandidateTotal, 0, this.DashboardCandidate.Total, this.numberCounterSpeed);
           this.animateValue(this.countCandidateMapToJob, 0, this.DashboardCandidate.AppliedToday, this.numberCounterSpeed);
           this.animateValue(this.countKnockedOut, 0, this.DashboardCandidate.AppliedInLastWeek, this.numberCounterSpeed);
          // this.animateValue(this.countOtherSources, 0, this.DashboardCandidate., this.numberCounterSpeed);
          } else if(repsonsedata.HttpStatusCode == '204'){
            this.loadingCandidate=false;
            this.DashboardCandidate.ListOfCandidate = [];
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loadingCandidate = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loadingCandidate = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
/*
@Name: ngOnDestroy
@Who: Nitin Bhati
@When: 04-05-2023
@Why: EWM-13180
@What: to unsubscribe the dashboard API
*/
ngOnDestroy(): void {
  this.DashboardCandidateSubscription?.unsubscribe();
  this.DashboardActionSubscription?.unsubscribe();
  this.MyInboxDataSubscription?.unsubscribe();
  this.DasboardActivitySubscription?.unsubscribe();
  this.dashboardJobdataSubscription?.unsubscribe();
  this.dashboardGridDataSubscription?.unsubscribe();
  this.oraganizationChangeSubscription?.unsubscribe();
 }
 openDoc(url:any){ //by maneesh redirect dashboard
  window.open(url, '_blank');
}

openDashboard(url:any, page?:string){ //by maneesh redirect dashboard
  let urltemp= url+"&token="+localStorage.getItem('Token');
  if (page==='setting'){
    let finalUrl=urltemp+'&redirect=setting'
    window.open(finalUrl, '_blank');
  }
  else{
    window.open(urltemp, '_blank');
  }
}

getInitializePage() {
  this._systemSettingService.getGeneralSettingInfo().subscribe(
    repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == '200') {
        this.IsDashboardAavailable=repsonsedata['Data']['IsDashboardAavailable'];
        if(this.IsDashboardAavailable===0){
          this.activatedRoutes.queryParams.subscribe(params => { 
            let dashboardActive = params['dashboardActive'];
            if(dashboardActive==='yes') {
              this.IsDashboardAavailable=1;
            }
          });
        }
      }
    }, err => {
    })
}
}


