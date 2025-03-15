/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: header.component.ts
 @Who: Renu
 @When: 22-Dec-2020
 @Why: ROST-572
 @What: common Header Section
 */
import { Component, OnInit, HostBinding, Inject, ViewChild, ElementRef, HostListener, QueryList, ViewChildren } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { Renderer2 } from '@angular/core';
const THEME_DARKNESS_SUFFIX = `-dark`;
import { TranslateService } from '@ngx-translate/core';
import { CommonServiesService } from '../../../shared/services/common-servies.service';
import { SystemSettingService } from '../../../modules/EWM.core/shared/services/system-setting/system-setting.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login/login.service';
import { ENVIRONMENTER } from '../../../../environments/environmeter.token';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SCREEN_SIZE, menuItem } from 'src/app/shared/models/index';
import { ThemingService } from 'src/app/shared/services/theming.service';
import { SocialAuthService } from 'angularx-social-login';
import { MsalService } from '@azure/msal-angular';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { LoginResponce, ResponceData } from 'src/app/shared/models';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DynamicMenuService } from 'src/app/shared/services/commonservice/dynamic-menu.service';
import { QuickpeopleComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quickpeople/quickpeople.component';
import { InviteATeammateComponent } from 'src/app/modules/EWM.core/invite-a-teammate/invite-a-teammate.component';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { MatDrawer } from '@angular/material/sidenav';
import { MatMenuTrigger } from '@angular/material/menu';
import { QuickjobComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quickjob/quickjob.component';

import { QuickCompanyComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quick-company/quick-company.component';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickCandidateComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quick-candidate/quick-candidate.component';
import { WelcomeComponent } from 'src/app/modules/welcome/welcome.component';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { delay, take } from 'rxjs/operators';
import { QuickAddContactComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EncryptionDecryptionService } from 'src/app/shared/services/encryption-decryption.service';
import { ChooseExpressionCandidateComponent } from 'src/app/modules/EWM-Candidate/candidate-list/choose-expression-candidate/choose-expression-candidate.component';
import { ConfigureCreateJobComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quickjob/configure-job-fields/configure-create-job/configure-create-job.component';
import { QuickAddActivity } from 'src/app/modules/EWM.core/shared/quick-modal/quick-add-activity/quick-add-activity.component';
import * as signalR from '@microsoft/signalr';
import { AppSignalrService } from '@app/shared/services/app-signalr.service';
import {ToastrService} from 'ngx-toastr'
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ServiceListClass } from '@app/shared/services/sevicelist';
import { debounceTime } from 'rxjs/operators';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { MaterialIconService } from '@app/shared/services/material-icon.service';
import { QuickCompanyChooseComponent } from '../../../shared/modal/quick-company-choose/quick-company-choose.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /*******************Global Variables decalared here *************************/
  @HostBinding('class') activeThemeCssClass: string;
  @ViewChild('spanval') span: ElementRef;
  @ViewChild('image') image: ElementRef;
  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  @ViewChild('profiletrigger') profiletrigger: MatMenuTrigger;
  @ViewChild('settingtrigger') settingtrigger: MatMenuTrigger;
  @ViewChild('helptrigger') helptrigger: MatMenuTrigger;

  isEnable = false;
  isRtl = false;
  rtlVal: string = 'ltr';
  sharedData: string;
  isThemeDark = false;
  activeTheme: string;
  activeColor: string;
  userDefoultLang: string;
  userDefoultConvert: string;
  private _jsonURL;
  dirctionalLang;
  isFullScreen: boolean;
  public logoImage: any;
  public ProfileUrl: string;
  toggleActive: boolean = false;
  fullscreenmode;
  currentMenuWidth: number;
  public lang: string;
  prefix = 'is-';
  sizes = [
    {
      id: SCREEN_SIZE.small, name: 'small',
      css: `showMenu`
    },
    {
      id: SCREEN_SIZE.large, name: 'large',
      css: `hide`
    }
  ];
  themes: string[];
  public organizationData = [];
  public OrganizationId: string;
  public loading: boolean;
  public loginResponce: LoginResponce;
  orgId: any;

  public menuData: any;
  public topMenu: any;
  public setting: any;
  public profile: any;
  public helpmenu: any;
  result: string = '';
  ActiveTopMenu: string;
  totalNotificationCount: number =  0;
  public notificationList: any[];
  public appTitle;
  public tourId;

  clients: any;
  client: any;
  employee:any;
  employees:any;
  val: any;
  largeScreenTag: boolean = true;
  mobileScreenTag: boolean = false;
  largeScreenMenuData: any;
  smallScreenMenuData: any;
  RoadMapMenuLink: string;
  APIMenuLink: string;
  DocumentCentreMenuLink: string;
  SupportMenuLink: string;
  public userName:string="";
  public userEmail: string="";
  currentUser: any;
  headerTooltip = false;
  OptionalMenu: number;
  public defaultlogo: string;
  byDefaultlogo :string;
  inviteTeammate:number;
  userNotificationsList:any=[];
  countNotification={};
  tokenNotification: string;
  isUnreadEnable:boolean=false;
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  public pageNo: number = 1;
  public pageSize=50;
  public stages: any[];
  responseData: ResponceData;
  public notificationHeight: number=61;
  NotificationDebugStatus: boolean;
  public searchVal: string = '';
  public loadingSearch: boolean;
  public loadingNotification:boolean;
  searchSubject$ = new Subject<any>();
  NotificationStatus: string;
  notificationLoading:string='label_loading';
  previousPageNo=0;
  profileShortName: string;
  dashboard:string;
  token:string;
  public companyId: string="";
  /*
  @Type: File, <ts>
  @Name: constructor()
  @Who: Renu
  @When: 22-dec-2020
  @Why: ROST-572
  @What: all dependecies are declared here for this component
  */
  constructor(
    public materialIconService:MaterialIconService,
    private breakpointObserver: BreakpointObserver,
    private overlayContainer: OverlayContainer,
    private translateService: TranslateService,
    private renderer: Renderer2,
    private domSanitizer: DomSanitizer,
    private commonServiesService: CommonServiesService, private textChangeLngService: TextChangeLngService,
    private _dynamicMenuService: DynamicMenuService,
    private _systemSettingService: SystemSettingService, private _profileInfoService: ProfileInfoService,
    private http: HttpClient, private router: Router, private authenticationService: LoginService,
    @Inject(ENVIRONMENTER) public environmenter: any, @Inject(DOCUMENT) private document: any,
    private commonserviceService: CommonserviceService, private elementRef: ElementRef,
    private theming: ThemingService, private authService: SocialAuthService, private msalService: MsalService,
    private snackBService: SnackBarService,
    private countryMasterService: CountryMasterService,
    public dialogObj: MatDialog,
    public dialog: MatDialog, private _sidebarService: SidebarService, private _appSetting: AppSettingsService,
    public _encryptionDecryptionService: EncryptionDecryptionService,private signalRService: AppSignalrService,
    private toastr: ToastrService,private serviceListClass: ServiceListClass
  ) {
    this.materialIconService.registerIcon();
    //this.pageSize = this._appSetting.pagesize;
    this.tokenNotification = localStorage.getItem('Token');
    this.RoadMapMenuLink=this._appSetting.roadMapMenuLink;
    this.APIMenuLink=this._appSetting.aPIMenuLink;
    this.DocumentCentreMenuLink=this._appSetting.documentCentreMenuLink;
    this.SupportMenuLink=this._appSetting.supportMenuLink;
    this.OptionalMenu=this._appSetting.optionalMenu;
    this.inviteTeammate = this._appSetting.inviteTeammate;
      // @When: 23-03-2023 @who:maneesh  for default logo @why: EWM-10646
    this.defaultlogo=this._appSetting.defaultlogoSetting
    this.inviteTeammate = this._appSetting.inviteTeammate;
    this.NotificationDebugStatus = this._appSetting.NotificationDebugStatus;
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.userEmail=tenantData?.EmailId; //by maneesh redirect url;
    let Token = localStorage.getItem('Token');
    this.token=Token;
    this.companyId = localStorage.getItem('tenantDomain');
    // Set default theme here:
    // this.setActiveTheme('deeppurple-amber', false);
    this.useLanguage(localStorage.getItem('Language'));
    //this.translateService.use('eng');
    //this.userDefoultLang = 'eng';
    this.useLanguage(localStorage.getItem('Language'));
    // --------@When: 27-02-2023 @who:Adarsh singh @why: EWM-10754 --------
    this.commonserviceService.onOrganizationLogoSelectChange.subscribe((data:any)=>{
      // who:maneesh,what:ewm-11600 ,when:28/03/2023
      if (data!=null && data!=''  && data!=undefined && data!='null') {
        localStorage.setItem('LogoUrl', data);
        this.logoImage = data;
      }else{
        this.logoImage = '/assets/default-logo.png';
      }
    })
    // End
   if (localStorage.getItem('LogoUrl') != null && localStorage.getItem('LogoUrl') != 'null' && localStorage.getItem('LogoUrl') != '' && localStorage.getItem('LogoUrl') != undefined) {
      this.logoImage = localStorage.getItem('LogoUrl');
    } else {
      this.logoImage = '/assets/default-logo.png';
    }

    this.RoadMapMenuLink=this._appSetting.roadMapMenuLink;
    this.APIMenuLink=this._appSetting.aPIMenuLink;
    this.DocumentCentreMenuLink=this._appSetting.documentCentreMenuLink;
    this.SupportMenuLink=this._appSetting.supportMenuLink;
    this.dashboard = "https://dashboards.entiredev.in/authcheck?source=xr&email="+this.userEmail+"&companyId="+this.companyId+"&orignUrl="+window.location.origin + this.router.url+"&token="+this.token;
  }


  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Switching language
  // @What: this function used for change language of application.
  // @Return: None
  // @Params :
  // 1. lang - language code.
  public useLanguage(lang): void {
    this.translateService.setDefaultLang(lang);
    this.userDefoultLang = lang;
  }
  /*
  @Type: File, <ts>
  @Name: constructor()
  @Who: Renu
  @When: 22-dec-2020
  @Why: ROST-572
  @What: all dependecies are declared here for this component
  */

  ngOnInit() {
   /*--@EWM-15181,@why:Web Notification,@who:Nitin Bhati,start--*/
    setTimeout(() => {
      this.tokenNotification = localStorage.getItem('Token');
    }, 3000);
    let applicationURL = this.serviceListClass.notificationwss+'?access_token='+this.tokenNotification;
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(this.NotificationDebugStatus?signalR.LogLevel.Debug:signalR.LogLevel.Error)
      .withUrl(applicationURL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();
    connection.start().then(function () {
    }).catch(function (err) {
      return console.error(err.toString());
    });
    connection.on("pop", (type) => {
      let createrName = type?.createrName;
      let message = type?.message;
      let relatedTo = type?.relatedTo;
      let navigateUrl = type?.navigateUrl;
      let createrProfilePath=type?.createrProfilePath;
      let shortName=type?.shortName;
      let notificationId=type?.notificationId;
      let OptionalField1=type?.optionalField1;
      let GenerateSource=type?.generateSource;
      let NotificationType=type?.notificationType;

console.log('type',type)
      this.showSuccessNotification(createrName, message, relatedTo, navigateUrl,createrProfilePath,shortName,notificationId,NotificationType,OptionalField1,GenerateSource);
    });
    connection.on("bell", (type) => {
      this.totalNotificationCount = (type?.count)>99?(type?.count)+'+':(type?.count);
    });
    let GetOnlyUnreadCount = true;
    this.NotificationStatus = 'All';
    this.getUserNotificationsAll(GetOnlyUnreadCount, this.NotificationStatus);
   /*--@EWM-15181,@why:Web Notification,@who:Nitin Bhati, End--*/
    this.currentMenuWidth = window.innerWidth;
   this.commonserviceService.ononnameManageChangeObs.subscribe(value=>{
    this.val=value;
   })
    let URL = this.router.url;
    let URL_AS_LIST = URL.split('/');
    this.ActiveTopMenu = URL_AS_LIST[3];
    this._sidebarService.topMenuAciveObs.next(this.ActiveTopMenu);
    this._sidebarService.topMenuActive.subscribe(res=>{
    this.ActiveTopMenu=res;
})
    this.appTitle = this._appSetting.getApptitle;
    this._sidebarService.activesubMenu.subscribe(val => {
    })

    let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (matched) {
      this.isEnable = true;
    }
 // @When: 28-06-2023 @who:bantee  There is some issue at the time of open the system dark mode @why: EWM-7932
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        if (event.matches) {
          this.isEnable = true;
          document.querySelector("body").classList.replace("light-theme", "dark-theme");
          document.getElementById("main-comp").classList.replace("light-theme", "dark-theme");
        } else {
          this.isEnable = false;
          document.querySelector("body").classList.replace("dark-theme", "light-theme");
        document.getElementById("main-comp").classList.replace("dark-theme", "light-theme");
        }
      });
    this.commonserviceService.onUserLanguageChange.subscribe(value => {
      this.lang = localStorage.getItem('Language');
      this.useLanguage(this.lang);
      this.translateService.setDefaultLang(this.lang);
      this.themes = this.theming.themes;
    })

    this.fullscreenmode = document.documentElement;
    this.commonserviceService.userDetailsObs1.subscribe(value => {
      this.ProfileUrl = localStorage.getItem('ProfileUrl');
      this.profileShortName = localStorage.getItem('ShortName');
      if (!this.ProfileUrl) {
        this.profileShortName;
      } else {
        this.ProfileUrl;
      }
    });
    let tenantData = JSON.parse(localStorage.getItem('currentUser'));
    this.userName=tenantData.FirstName + ' ' + tenantData.LastName;
    this.userEmail=tenantData.EmailId;
    this.commonserviceService.refreshOrgObs.subscribe(value => {
      if (value === 1)
        this.getOrganizationList();
    });
    this.setTitle();
    this.getOrganizationList();

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
        this.getUserNotificationsAll(GetOnlyUnreadCount, this.NotificationStatus);
      }

    })
    this.menuData = JSON.parse(localStorage.getItem('menuInfo'));
    this._dynamicMenuService.setAllMenu(JSON.parse(localStorage.getItem('menuInfo')));
    this.setMenuAll();
    this.getDarkMode();

    this.tourId = localStorage.getItem('QuickTour');
    if (this.tourId == 1) {
      this.openQuickWelcomeModal();
    }

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      let GetOnlyUnreadCount = false;
      this.NotificationStatus = 'All';
      this.getUserNotificationsAll(GetOnlyUnreadCount, this.NotificationStatus);
    });
  }
  /*
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 13-07-2023
  @Why: EWM-13134
  @What: set background color
  */
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }
  showTooltip() {
    this.headerTooltip=true;
  }
  hideTooltip() {
    this.headerTooltip=false;
  }
  setMenuAll() {
    if (this.menuData) {
      let topmenu;
      let topsettingicon;
      let topProfile;
      let helpmenu;
      this.menuData.forEach(element => {
        topmenu = this.menuData.filter(x => x['Position'] === 'T');
        topsettingicon = this.menuData.filter(x => x['Position'] === 'TRS');
        topProfile = this.menuData.filter(x => x['Position'] === 'TRP');
        helpmenu = this.menuData.filter(x => x['Position'] === 'H');
      });
      this.topMenu = topmenu;
      this.setting = topsettingicon;
      this.profile = topProfile;
      this.helpmenu = helpmenu;
     this.mobileMenu(this.topMenu);
    }
  this._sidebarService.subManuGroupData.subscribe(res=>{
    this.ActiveTopMenu=res;
  });
  }

  /*
 @Type: File, <ts>
 @Name: ngAfterViewInit
 @Who: Renu
 @When: 04-12-2020
 @Why: ROST-468
 @What: after compoenent reloads method to handle any additional initialization tasks.
*/
  ngAfterViewInit(): void {
    this.toggleLtrRtl('ltr');
  }

  /*
 @Type: File, <TS>
 @Name: header.component.ts
 @Who: Nitin Bhati
 @When: 09-Oct-2020
 @Why: ROST-247
 @What: Implementation of Header Section Flip with Logo Icon
 */

  data = 'Initial Data';
  toggleLtrRtl(value) {
    this.rtlVal = value;
    this.commonServiesService.emitEvent(this.rtlVal);
    if (value == 'ltr') {
      this.commonserviceService.onUserLanguageDirection.next('ltr');
      this.translateService.setDefaultLang(this.userDefoultLang);
      this.userDefoultConvert = 'ltr';
      document.body.dir = 'ltr';
    } else {
      this.commonserviceService.onUserLanguageDirection.next('rtl');
      this.translateService.setDefaultLang(this.userDefoultLang);
      this.userDefoultConvert = 'rtl';
      document.body.dir = 'rtl';
    }
  }

  /*
  @Type: File, <ts>
  @Name: logout
  @Who: Renu
  @When: 26-Oct-2020
  @Why: ROST-290
  @What: For destorying the user session in front end side
  */

  logout() {
    this.onLogout();
    this.authenticationService.serverlogout(1).subscribe( (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200){
      // this.authenticationService.serverlogout(1);
      this.authenticationService.logout(false);
      this.authService.signOut(true);
      //this.msalService.logout();
      this.document.getElementById('favIcon').setAttribute('href', 'ssets/fab.png');
      }
    });
  }

  /*
  @(C): Entire Software
  @Type: File, <TS>
  @Name: header.component.ts
  @Who: Satya Prakash Gupta
  @When: 5-Nov-2020
  @Why:
  @What: Implementation of full screen mode
*/
  openFullscreen() {
    if (this.fullscreenmode.requestFullscreen) {
      this.fullscreenmode.requestFullscreen();
    } else if (this.fullscreenmode.mozRequestFullScreen) {
      /* Firefox */
      this.fullscreenmode.mozRequestFullScreen();
    } else if (this.fullscreenmode.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.fullscreenmode.webkitRequestFullscreen();
    } else if (this.fullscreenmode.msRequestFullscreen) {
      /* IE/Edge */
      this.fullscreenmode.msRequestFullscreen();
    }
  }
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event) {
    this.chkScreenMode();
  }
  chkScreenMode() {
    if (document.fullscreenElement) {
      //fullscreen
      this.isFullScreen = true;
    } else {
      //not in full screen
      this.isFullScreen = false;
    }
  }

  /*
  @Type: File, <ts>
  @Name: toggleSidenav()
  @Who: Renu
  @When: 22-Dec-2020
  @Why: ROST-572
  @What: For toggling side nav on moblie menu
  */

  toggleSidenav() {
    this.toggleActive = !this.toggleActive;
    this.commonserviceService.toggle();
  }
  setTitle() {
    this._systemSettingService.getGeneralSettingInfo().subscribe(
      repsonsedata => {

        if (repsonsedata['HttpStatusCode'] == '200') {
          let AppIntroduction;
          sessionStorage.setItem('IsDashboardAavailable',repsonsedata['Data']['IsDashboardAavailable']);
          if (repsonsedata['Data']['AppTitle']) {
            //this.commonserviceService.setTitle(repsonsedata['Data']['AppTitle']);
            localStorage.setItem('AppTitle', repsonsedata['Data']['AppTitle']);
            localStorage.setItem('Distance', repsonsedata['Data']['Distance']);
            localStorage.setItem('DistanceUnit', repsonsedata['Data']['DistanceUnit']);
          } else {
            //this.commonserviceService.setTitle('Entire Workforce Management');
            localStorage.setItem('AppTitle', "Entire Workforce Management");
            localStorage.setItem('Distance', '1');
            localStorage.setItem('DistanceUnit', 'KMs');
          }

        }
      }, err => {

      })
  }

  /*
    @Type: File, <TS>
    @Name: onChangeTheme
    @Who: Renu
    @When: 29-jan-2021
    @Why:-
    @What: Implementation of dark mode theme
  */
  onChangeTheme(event) {
    var isDarkMode;
    if (event.checked == true) {
      this.theming.theme.next("dark-theme");
      localStorage.setItem('isDarkModeEnable', "1");
      this.isEnable = true;
      isDarkMode = 1;
      document.querySelector("body").classList.toggle("dark-theme");
      document.getElementById("main-comp").classList.toggle("dark-theme");
    } else {
      this.theming.theme.next("light-theme");
      localStorage.setItem('isDarkModeEnable', "0");
      this.isEnable = false;
      isDarkMode = 0;
      document.querySelector("body").classList.toggle("dark-theme");
      document.getElementById("main-comp").classList.toggle("dark-theme");
    }
    this.night(event);
    this.updateDarkMode(isDarkMode);
  }
  night(event) {
 // @When: 28-06-2023 @who:bantee  There is some issue at the time of open the system dark mode @why: EWM-7932
     if (event.checked == true) {
        document.querySelector("body").classList.replace("light-theme", "dark-theme");
        document.getElementById("main-comp").classList.replace("light-theme", "dark-theme");
        // setTimeout(() => {}, 200);
      } else {
        document.querySelector("body").classList.replace("dark-theme", "light-theme");
        document.getElementById("main-comp").classList.replace("dark-theme", "light-theme");
      }
  }
  /*
    @Type: File, <ts>
    @Name: updateDarkMode
    @Who: Suika
    @When: 18-June-2021
    @Why: ROST-1876
    @What: to update updateDarkMode
    */
  updateDarkMode(isDarkMode) {
    var removeJsonId = {};
    removeJsonId['IsDarkMode'] = isDarkMode;
    this._profileInfoService.updateDarkMode(JSON.stringify(removeJsonId)).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
    @Type: File, <ts>
    @Name: getDarkMode
    @Who: Suika
    @When: 18-June-2021
    @Why: ROST-1876
    @What: to  getDarkMode
    */
  getDarkMode() {
    this._profileInfoService.getDarkMode().subscribe(
      (repsonsedata: ResponceData) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          let isDarkMode = repsonsedata.Data.IsDarkMode;
          if (isDarkMode == "0") {
            this.isEnable = false;
            this.theming.theme.next("light-theme");
            document.body.classList.remove('dark-theme');
          } else if (isDarkMode == "1") {
            this.isEnable = true;
            this.theming.theme.next("dark-theme");
            document.body.classList.add('dark-theme');
          }
        } else {
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
   /*
   @Type: File, <ts>
   @Name: getOrganizationList
   @Who: Renu
   @When: 08-Apr-2021
   @Why: ROST-1289
   @What: get all organization Details
   */
  getOrganizationList() {
    this.countryMasterService.getOrganizationList().subscribe(
      (responseData: any[]) => {
        if (responseData['HttpStatusCode'] == '200') {
          this.organizationData = responseData['Data'];
          if (this.organizationData.length !== 0) {
            let orgDefault = this.organizationData.filter(x => x['OrganizationId'] === this.OrganizationId)[0]?.OrganizationName;
            this.commonserviceService.onOrgSelect.next(orgDefault);
            localStorage.setItem('OrganizationName', orgDefault);
          }
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
   @Type: File, <ts>
   @Name: openConfrmDialog
   @Who: Renu
   @When: 13-Apr-2021
   @Why: ROST-1356
   @What:open the confirmation box when user change organization
   */
  openConfrmDialog(value: any): void {
    const message = ``;
    const title = '';
    const subtitle = 'label_onOrgchangeTitle';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogObj.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__slow', 'animate__zoomIn'],
      disableClose: true,
    });
    this.loading = true;
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.onOrgChange(value);
      } else {
        this.loading = false;
      }
    });
  }
  /*
   @Type: File, <ts>
   @Name: onOrgChange
   @Who: Renu
   @When: 08-Apr-2021
   @Why: ROST-1289
   @What: save the selected organization on selection os user
   */
  onOrgChange(ev: any) {
    this.loading = true;
    let orgName = ev.source.selected.viewValue;
    this.orgId = ev.value;
    this.commonserviceService.onOrgSelect.next(orgName);
    localStorage.setItem('OrganizationName', orgName);
    let formdata = { 'OrganizationId': ev.value };
    this.authenticationService.orgToken(formdata).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          if (data.Data.Token) {

            this.loginResponce = data.Data;
            this.setLocalStoreageData(data);
            this.commonserviceService.onOrgSelectLastLogin.next(data.Data['LastLoginDateTime']);
            this.commonserviceService.onOrgSelectId.next(this.orgId);
          } else {
            this.router.navigate(['/login']);
          }
        } else {
          this.loading = false;
          this.router.navigate(['/login']);
        }
      },
      error => {
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_snackbarerrmsg'), error.StatusCode);
        this.loading = false;
      });

  }
  /*
  @Type: File, <ts>
  @Name: setLocalStoreageData function
  @Who: Renu
  @When: 21-Jan-2020
  @Why: ROST-663
  @What: For Storing Neccessary Information in localstorage
  */
  setLocalStoreageData(data) {
    localStorage.setItem('Token', data.Data['Token']);
    localStorage.setItem('RefreshToken', data.Data['RefreshToken']);
    localStorage.setItem('currentUser', JSON.stringify(data.Data));
    if (data.Data['Colors'] != undefined && data.Data['Colors'] != null) {
      localStorage.setItem('HeaderBackground', data.Data['Colors']['HeaderBackground']);
      localStorage.setItem('HeaderColor', data.Data['Colors']['HeaderColor']);
      localStorage.setItem('HighlightBackground', data.Data['Colors']['HighlightBackground']);
      localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
      localStorage.setItem('HighlightColor', data.Data['Colors']['HighlightColor']);
    }
    if (data.Data['Urls'] != undefined && data.Data['Urls'] != null) {
      localStorage.setItem('FaviconUrl', data.Data['Urls']['FaviconUrl']);
      localStorage.setItem('LogoUrl', data.Data['Urls']['LogoUrl']);
    }

    localStorage.setItem('MFA', data.Data['MFA']);
    localStorage.setItem('OrganizationId', data.Data['OrganizationId']);
    if (data.Data['OrganizationName'] != undefined && data.Data['OrganizationName'] != null) {
    localStorage.setItem('OrganizationName', data.Data['OrganizationName']);//who:maneesh,what:ewm-15806 for set OrganizationName,when:23/01/2024
    }
    localStorage.setItem('LastLoginDateTime', data.Data['LastLoginDateTime']);
    localStorage.setItem('QuickTour', data.Data['QuickTour']);

    //localStorage.setItem('Language', data.Data['Language']);
    if (data.Data['Language'] === null) {
      localStorage.setItem('Language', 'eng');
    } else {
      localStorage.setItem('Language', data.Data['Language']);
    }
  }

  /*
  @Type: File, <ts>
  @Name: setLocalStoreageData function
  @Who: Satya Prakash Gupta
  @When: 17-June-2021
  @Why: EWM-1749 EWM-1897
  @What: For quickjob modal
  */
  openQuickjobModal() {
    /*--@Why: EWM-9628 EWM-10420,@Who: Nitin Bhati,@When: 07-Feb-2023,@What: For open Create Job component--*/
     const dialogRef = this.dialog.open(ConfigureCreateJobComponent,{
      data: new Object({JobId:'JobId'}),
      panelClass: ['xeople-modal', 'ConfigureJobFields', 'ConfigureJobFields', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  openCompaniesModal() {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(QuickpeopleComponent, {
      panelClass: ['xeople-modal-full-screen', 'add_people', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
  }
  openQuickCompanyModal() {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(QuickCompanyComponent, {
      data: new Object({ formType:"AddForm"}),
      panelClass: ['xeople-modal-full-screen', 'quickCompany', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
  }

  openDialogforteammate() {
    const dialogRef = this.dialog.open(InviteATeammateComponent, {
      panelClass: ['xeople-modal', 'add_teamMate','animate__animated', 'animate__slideInDown'],
      disableClose: true,
    });
    if (this._appSetting.isBlurredOn) {
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
  /*
  @Type: File, <ts>
  @Name: topMenuActive function
  @Who: Renu
  @When: 01-June-2021
  @Why: ROST-1688
  @What: For add active class in top menu
  */
  topMenuActive(menu) {
    this._sidebarService.topMenuAciveObs.next(menu);
    this.ActiveTopMenu = menu;
  }


  private detectScreenSize() {
    const currentSize = this.sizes.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
    })
    this.mobileMenu(this.topMenu);
  }
  /*
    @Type: File, <ts>
    @Name: HostListener
    @Who: Renu
    @When: 04-12-2020
    @Why: ROST-468
    @What: to check when window resizes and close the open menu's
  */
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    this.detectScreenSize();
    event.target.innerWidth;
    this.profiletrigger.closeMenu();
    this.settingtrigger.closeMenu();
    if (this.topMenu.length > 0) {
    }
  }
  /*
    @Type: File, <ts>
    @Name: openQuickCandidateModal
    @Who: Renu
    @When: 12-Jul-2021
    @Why: ROST-468
    @What: to open quick add candidate modal dialog
  */
/*
 @Who: Adarsh Singh
 @When: 16-Dec-2022
 @Why: EWM-9627 EWM-9907
 */
  openQuickCandidateModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(ChooseExpressionCandidateComponent, {
      panelClass: ['xeople-modal-md', 'chooseExpressionCandidateModal', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  quickCompanyChoose(){
    const dialogRef = this.dialog.open(QuickCompanyChooseComponent, {
      panelClass: ['xeople-modal', 'chooseCompanyModal', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  openQuickWelcomeModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(WelcomeComponent, {
      maxHeight: '85%',
      panelClass: ['welcomeModal', 'animate__slow', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
  }

  MobileMapMenuSelected: any;
  mobileMenu(data) {
    if (data) {
      let items = data.slice(0, 7);
      let threeDotItems = data.slice(7, data.length);

      this.MobileMapMenuSelected = [];

      this.largeScreenMenuData = items;
      this.smallScreenMenuData = threeDotItems;
      this.mobileScreenTag = false;

      if (this.currentMenuWidth > 1206 && this.currentMenuWidth < 1290) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(5, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      }
      else if (this.currentMenuWidth > 1110 && this.currentMenuWidth < 1207) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(3, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      }
      else if (this.currentMenuWidth >  1050 && this.currentMenuWidth < 1111) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(2, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      }
      else if (this.currentMenuWidth >  981 && this.currentMenuWidth < 1051) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(2, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      }
      else if (this.currentMenuWidth >  954 && this.currentMenuWidth < 982) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(1, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      }
      else if (this.currentMenuWidth >  880 && this.currentMenuWidth < 955) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(3, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      }
      else if (this.currentMenuWidth >  794 && this.currentMenuWidth < 881) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(2, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      }
      else if (this.currentMenuWidth >  740 && this.currentMenuWidth < 795) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(1, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      }
       else if (this.currentMenuWidth >  640 && this.currentMenuWidth < 741) {
        this.smallScreenMenuData = this.smallScreenMenuData.concat(items.splice(1, 7));
        this.MobileMapMenuSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;

      }
      else {
         this.largeScreenTag = true;
        this.mobileScreenTag = false;
        }
     }

  }

   /*
    @Type: File, <ts>
    @Name: openQuickAddContactModal
    @Who: ANUP
    @When: 25-Nov-2021
    @Why: EWM-3700 EWM-3918
    @What: to open quick add contact modal dialog
  */
  openQuickAddContactModal() {
    const message = `Are you sure you want to do this?`;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(QuickAddContactComponent, {
      data: new Object({ formType:"AddForm"}),
      panelClass: ['xeople-modal-full-screen', 'quickAddContact', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
    });
    let dir:string;
    dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
    for(let i=0; i < classList.length; i++){
      classList[i].setAttribute('dir', this.dirctionalLang);
     }
  }
   /*
    @Type: File, <ts>
    @Name: getAccountPreference function
    @Who: Anup
    @When: 27-Dec-2021
    @Why: call Get method from services for showing data into grid.
    @What: .
  */
 getAccountPreference() {
  this.loading = true;
  this._profileInfoService.getPreference().subscribe(
    (repsonsedata:any)=> {
      this.loading = false;

      if (repsonsedata['HttpStatusCode'] == '200') {
        localStorage.setItem('animation', repsonsedata?.Data?.IsAnimation);
        localStorage.setItem('XeepAnimation', repsonsedata?.Data?.IsXeepAnimation);
        localStorage.setItem('UserTimezone', repsonsedata?.Data?.UserTimezone);
      }
    }, err => {
     this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
  /*
  @Type: File, <ts>
  @Name: onLogout function
  @Who: Adarsh singh
  @When: 25-july-2022
  @Why: ROST-290
  @What: For destorying the user session in front end side
  */
  onLogout() {
    let RefreshToken = localStorage.getItem('RefreshToken');
    let obj = {};
    obj['RefreshToken'] = this._encryptionDecryptionService.encryptData(RefreshToken);
    this.authenticationService.onLogout(obj).subscribe((repsonsedata) => {
      if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
  }
/*
  @Type: File, <ts>
  @Name: openQuickAddActivity function
  @Who: Adarsh singh
  @When: 24-Aug-2023
  @Why: EWM-13711-EWM-13884
  @What: for open quick-add-activity
*/
  openQuickAddActivity(): void{
    const dialogRef = this.dialog.open(QuickAddActivity, {
      // @When: 28-08-2023 @who:Amit @why: EWM-13886 @what: add class
      panelClass: ['xeople-modal-full-screen', 'quick-modal-full-screen', 'quickAddActivity', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    // @When: 29-08-2023 @who:Amit @why: EWM-13886 @what: add RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }	
  }
  getClickNotification(){
    this.userNotificationsList=[];
    this.searchVal = '';
    let GetOnlyUnreadCount=false;
    this.NotificationStatus='All';
    this.pageNo=1;
    this.isUnreadEnable=false;
    this.getUserNotificationsAll(GetOnlyUnreadCount,this.NotificationStatus);
  }
  getUserNotificationsAll(GetOnlyUnreadCount,NotificationStatus) {
    this.loadingNotification = true;  
    this._systemSettingService.getUserNotificationsAll(GetOnlyUnreadCount,NotificationStatus,this.pageNo,this.pageSize,this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingNotification = false;  
          this.loadingSearch = false;
          this.responseData=repsonsedata;
          this.userNotificationsList=repsonsedata?.Data?.DataList;
          this.totalNotificationCount=(repsonsedata?.Data?.Count)>99?(repsonsedata?.Data?.Count)+'+':(repsonsedata?.Data?.Count);
         } else if(repsonsedata.HttpStatusCode == '204') {
        this.notificationLoading='label_notificationNotFound';
         this.loadingNotification = false;
         this.loadingSearch = false;
         this.userNotificationsList=[];
          }
      }, err => {
        this.loadingNotification = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  getNavigationURL(NavigationURL,NotificationId) {
    this.readNotification(NotificationId);
    // this.router.navigateByUrl('client/cand/candidate/candidate?CandidateId=975591d4-b119-4acf-bd8c-8416407ac63c&Type=CAND&cantabIndex=6&uniqueId=28994');
    this.router.navigateByUrl(NavigationURL);
   }
   showSuccessNotification(createrName:string,message:string,relatedTo:string,navigateUrl:string,createrProfilePath:string,shortName:string,notificationId:string,NotificationType?:string,OptionalField1?:string,GenerateSource?:string) {
   let img =``;
   if(createrProfilePath !=''){
    img =`<img src="`+createrProfilePath+`">`;
   }else {
    img =` <span>`+shortName+`</span>`;
   }
   
   let cutomHTML='';
   if(NotificationType.toLowerCase() ==='CandidateMappedJobExternal'.toLowerCase()){
    cutomHTML=`<div class="toast-data"><img class="bell-icon" src="assets/bell.svg">
    <img class="curve" src="/assets/toast-bg.svg">
   <div class="user-data">
  <div class="user-data-bottom">
    <div class="user-details">
      <span >`+this.translateService.instant('label_webnotifications_job_title')+ `</span>
      <span class="last-name">`+relatedTo+`</span>
      <span> `+this.translateService.instant('label_webnotifications_job_for')+ ` </span>
      <span class="last-name">`+OptionalField1+`</span>
      <span> `+this.translateService.instant('label_webnotifications_job_via')+ ` </span>
      <span class="last-name">`+GenerateSource+`</span>
    </div>
    <div class="time" (click)="getNavigationURL(navigateUrl,notificationId)">
    <span>View </span>
  </div>
  </div>
</div>
</div>`;
   }else{
    cutomHTML=`<div class="toast-data"><img class="bell-icon" src="assets/bell.svg">
    <img class="curve" src="/assets/toast-bg.svg">
    <div class="profile-and-name" id="user-avtaar-name">
   `+ img+`
  </div> <div class="user-data">
  <div class="user-data-bottom">
    <div class="user-details">
      <span class="first-name">`+createrName+`</span><span class="mention">`+this.translateService.instant(message)+`</span>
      <span class="last-name">`+relatedTo+`</span>
    </div>
    <div class="time" (click)="getNavigationURL(navigateUrl,notificationId)">
    <span>View Notes</span>
  </div>
  </div>
</div>
</div>`;
   }
    console.log(cutomHTML);
    this.toastr.success(cutomHTML, null, {
      enableHtml: true,
      closeButton:true,positionClass: "toast-bottom-right"
    }).onTap
      .pipe(take(1))
      .subscribe(() =>
        this.getNavigationURL(navigateUrl,notificationId)
          //this.router.navigateByUrl(navigateUrl)
       );
  }
  onChangeUnreadNotification(event) {
    this.userNotificationsList=[];
    this.pageNo=1;
    if(event?.checked){
      this.isUnreadEnable=true;
      let GetOnlyUnreadCount=false;
      this.NotificationStatus='Unread';
      this.getUserNotificationsAll(GetOnlyUnreadCount,this.NotificationStatus);
    }else{
      this.isUnreadEnable=false;
      let GetOnlyUnreadCount=false;
      this.NotificationStatus='All';
      this.getUserNotificationsAll(GetOnlyUnreadCount,this.NotificationStatus);
    }
  } 
 readNotification(NotificationId){
    var readNotificationId = {};
    readNotificationId['NotificationId'] = NotificationId=='00000000-0000-0000-0000-000000000000'?null:NotificationId;
    this._systemSettingService.readNotification(JSON.stringify(readNotificationId)).subscribe(
      repsonsedata => {
        this.loading = false;
         if (repsonsedata.HttpStatusCode == 200) {
           if(this.userNotificationsList == undefined || this.userNotificationsList == null || this.userNotificationsList == '' || this.userNotificationsList?.length == 0){
            let GetOnlyUnreadCount = true;
            this.NotificationStatus = 'All';
            this.getUserNotificationsAll(GetOnlyUnreadCount, this.NotificationStatus);
            }else{
              if(NotificationId=='00000000-0000-0000-0000-000000000000'){
                this.userNotificationsList?.forEach(element => {
                  element['IsRead'] = 1;
                 });
              }else{
                const index = this.userNotificationsList?.findIndex(item => item?.NotificationId === NotificationId);
                if (index !== -1) {
                  this.userNotificationsList[index].IsRead = 1;
                }
              }
              this.userNotificationsList=[...this.userNotificationsList];
              let totalNotificationCountR = this.userNotificationsList?.filter(x => x['IsRead'] === 0);
              this.totalNotificationCount=(totalNotificationCountR?.length)>99?(totalNotificationCountR?.length)+'+':(totalNotificationCountR?.length);
           }
          }else if(repsonsedata.HttpStatusCode == '204') {
            this.notificationLoading='label_notificationNotFound';
             this.loading = false;
             this.userNotificationsList=[];
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  deleteNotification(NotificationId){
    var readNotificationId = {};
    this.loadingNotification = true;
    readNotificationId['NotificationId'] = NotificationId;
    this._systemSettingService.deleteNotification(JSON.stringify(readNotificationId)).subscribe(
      repsonsedata => {
        this.loadingNotification = false;
        if (repsonsedata.HttpStatusCode == 200) {
          const index = this.userNotificationsList?.findIndex(item => item?.NotificationId === NotificationId);
          if (index !== -1) {
           this.userNotificationsList?.splice(index, 1);
           }
           this.userNotificationsList=[...this.userNotificationsList];
           let totalNotificationCountR = this.userNotificationsList?.filter(x => x['IsRead'] === 0);
           this.totalNotificationCount=(totalNotificationCountR?.length)>99?(totalNotificationCountR?.length)+'+':(totalNotificationCountR?.length);
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loadingNotification = false;
        }
      }, err => {
        this.loadingNotification = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  scrolled(event: any){
     const end = this.viewPort?.getRenderedRange()?.end;
     const start = this.viewPort?.getRenderedRange()?.start;
     const total =this.viewPort?.getDataLength();
    if (end >= total) {
      this.nextBatch();
       }
    if (start == 0) {
    //  this.previousBatch(stageId,index);
    }
  } 

  nextBatch(){
   let maxSize =   this.responseData?.TotalPages;
   let HeaderPageNo=this.responseData?.PageNumber;
   if(this.previousPageNo!=HeaderPageNo){
    if(HeaderPageNo<maxSize){
      this.previousPageNo=HeaderPageNo;
      let GetOnlyUnreadCount = false;
      this.NotificationStatus = 'All';
      this.pageNo = Number(HeaderPageNo+1);
      this.getUserNotificationsAll(GetOnlyUnreadCount, this.NotificationStatus);
    }
   }
  }
  onFilter(value) {
    if (value.length > 0 && value.length < 3) {
      return;
    }
    this.pageNo = 1;
    this.searchSubject$.next(value);
  }
  public onFilterClear(): void {
    this.searchVal = '';
    let GetOnlyUnreadCount = false;
    this.getUserNotificationsAll(GetOnlyUnreadCount, this.NotificationStatus);
   }
   openDoc(url:any){ //by maneesh redirect dashboard
   console.log(url)
    window.open(url, '_blank');
  }
}
