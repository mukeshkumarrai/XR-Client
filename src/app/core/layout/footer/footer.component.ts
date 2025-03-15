/**
@(C): Entire Software
@Type: File, TS
@Name: footer.component.ts
@Who: Mukesh Kumar Rai
@When: 15-Sep-2020
@Why: Application footer
@What: this section handle all footer related functions
 */
import { ApplicationRef, Component, ElementRef, HostListener, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { DummyService } from '../../../shared/data/dummy.data';
import { ConnectionService } from 'ng-connection-service';
import { HttpClient } from '@angular/common/http';
import { SnackbarComponent } from '../../../shared/snackbar/snackbar.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UserIdleService } from 'angular-user-idle';
import { CommonServiesService } from '../../../shared/services/common-servies.service';
import { environment } from 'src/environments/environment';
import { CommonserviceService } from '../../../shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { Userpreferences } from '../../../shared/models/index';
import { FooterDialogComponent } from 'src/app/shared/modal/footer-dialog/footer-dialog.component';
import { interval } from 'rxjs';
import { I } from '@angular/cdk/keycodes';
//import { SwUpdate } from '@angular/service-worker';
import { CookieService } from 'ngx-cookie-service';
var cookies = require('browser-cookies');
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [DummyService]
})
export class FooterComponent implements OnInit {
  @ViewChild('footerDirection') footerDirection: ElementRef;
  @ViewChild('footerDirectionMove') footerDirectionMove: ElementRef;
  @ViewChild('imagefooter') imagefooter: ElementRef;
  @Input() rtlVal: string;
  // @ViewChild(MatMenuTrigger) EnvironmentMenu: MatMenuTrigger;
  @ViewChild('versionTrigger') versiontrigger;
  // @ViewChild('screenResolutionTrigger') screenResolutionTrigger;
  @ViewChild('networkonTrigger') networkonTrigger;
  @ViewChild('networkoffTrigger') networkoffTrigger;
  @ViewChild('lastLoginTrigger') lastLoginTrigger;
  @ViewChild('environmenTrigger') environmenTrigger;

  @ViewChild('networkonTriggerMobile') networkonTriggerMobile;
  // @ViewChild('screenResolutionTriggerMobile') screenResolutionTriggerMobile;
  @ViewChild('versionTriggerMobile') versionTriggerMobile;
  @ViewChild('lastLoginTriggerMobile') lastLoginTriggerMobile;
  @ViewChild('networkoffTriggerMobile') networkoffTriggerMobile;


  @ViewChild('versionTrigger') versionTrigger: MatMenuTrigger;


  inStorage: boolean = false;
  cookieValue = "";
  versionValue: any;
  swVersionValue: any;
  modaldata: any;
  public currentYear: any;
  statusClass = '';
  noInternetConnection: boolean = false;
  isConnected = true;
  currentVersion: string;
  preferredScreenSize: number = 1024;
  preferredScreenResoMsg: string = 'You are using best Screen Resolution';
  preferredScreenResostatus: string = 'tv';
  //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : toast settings  : ROST-189
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : Checking screen resolution status show : ROST-190
  screenResolutionMessage: string = 'tooltip_bestScreenResolution';
  preferredScreenResolution: number;
  preferredMaxScreenResolution: number;
  currentScreenResolution: number;
  ScreenResolutionIcon: string = 'tv'
  currentApplicationVersion: any;
  previousApplicationVersion: any;
  swCurrentApplicationVersion: any;
  environment;
  environment_color = '#5844DA';
  cookieEnabled;
  classChange: boolean = false;
  versionColor = "";
  isVersionMismatch: boolean = false;
  accessBlocked: boolean = true;
  environmentDirection: boolean = false;
  orgSelect: any;
  LastLoginDateTime: string;
  autoDisapperTime: any;
  environmentbtnName: boolean = false;
  public userpreferences: Userpreferences;
  timers: any;
  lastLogin;
  lastLogin_color = '#0000FF';
  public clicked = false;
  public openMenu: boolean = false;
  isOver = false;
  classAdd: string;
  public isServiceWorkerActive: boolean = false;
  @ViewChild('widgetsContent', { read: ElementRef, static: false }) elementView: ElementRef;
  // @ViewChild('widgetsContent') elementView: ElementRef;
  viewHeight: number;
  public currentHash;
  public avaiableHash;
  currentUser = [];
  progressBarDirection:string;
  progressbarValue :number;
  curSec: number = 0;
  sub: any;
public appVersion:string;

  constructor(public dialog: MatDialog, public dummyService: DummyService, private translate: TranslateService, private connectionService: ConnectionService,
    private snackBar: MatSnackBar, public http: HttpClient, private userIdle: UserIdleService, private renderer: Renderer2, private commonServiesService: CommonServiesService, private _appSetting: AppSettingsService,
    private overlayContainer: OverlayContainer, private route: Router,
    private commonserviceService: CommonserviceService,
    public _userpreferencesService: UserpreferencesService, private cookieService: CookieService,
    private elementRef: ElementRef, private _appRef: ApplicationRef
  ) {
    //private swUpdates: SwUpdate,
    this.updateClient();
    this.checkUpdate();
    this.environment = this._appSetting.environment;
    this.lastLogin = this._appSetting.lastLogin_color;
    this.progressBarDirection = this._appSetting.getProgressBar_Reverse_Direction;
    this.appVersion = this._appSetting.appVersion;
    if(this.progressBarDirection==="1"){
      this.progressbarValue=0;
    }else{
      this.progressbarValue=100;
    }
    let environment_color = this._appSetting.environment_color;
    if (environment_color !== '') {
      this.environment_color = this._appSetting.environment_color;

    }
    this.currentYear = new Date().getFullYear();
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : Checking Network status show : ROST-189
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      let message = '';
      if (this.isConnected) {
        this.statusClass = 'success-snackbar';
        // Toast message
        message = '<div class="snackbarMsg"><span class="material-icons signal-icon">wifi</span><strong>' + this.translate.instant('label_networkOnlineTxt') + '</strong></div>' + this.translate.instant('label_networkOnlineMsg');
        this.noInternetConnection = false;
      } else {
        this.statusClass = 'warn-snackbar';
        this.noInternetConnection = true;

        // Toast message
        message = '<div class="snackbarMsg"><span class="material-icons signal-icon">wifi_off</span><strong>' + this.translate.instant('label_networkOfflineTxt') + '</strong></div>' + this.translate.instant('label_networkOfflineMsg');
      }
      //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : Calling toast function
      this.openSnackBar(message, 'close', this.statusClass);
    })
    this.currentVersion = '';
    this.screenResolutionMessage = 'tooltip_bestScreenResolution';
    this.preferredScreenResolution = 1024;
    this.preferredMaxScreenResolution = 1920;
    this.currentScreenResolution = 0;
    this.autoDisapperTime = this._appSetting.autodisappearTime;


  }

  preventCloseOnClickOut() {
    this.overlayContainer.getContainerElement().classList.add('disable-backdrop-click');
  }

  allowCloseOnClickOut() {
    this.overlayContainer.getContainerElement().classList.remove('disable-backdrop-click');
    // add remove active class
    this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
    // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
    this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
    this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
    this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");
    if (this.LastLoginDateTime && this.orgSelect) {
      this.lastLoginTrigger._element.nativeElement.classList.remove("footerIcontActive");
      this.lastLoginTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
    }
    this.networkonTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
    // this.screenResolutionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
    this.versionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");

    this.networkoffTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
    // add remove active class
  }


  startTimer(seconds: number) {

    if (this.curSec > 0) {
      this.curSec = 0;
      this.sub.unsubscribe();
      // if progressBarDirection value is "1" then progress dirction is reverse mode otherwise forward mode
      if(this.progressBarDirection==="1"){
        this.progressbarValue=0;
      }else{
        this.progressbarValue=100;
      }
    }
    const time = seconds;
    const timer$ = interval(100);
    this.sub = timer$.subscribe((sec) => {
      // if progressBarDirection value is "1" then progress dirction is reverse mode otherwise forward mode
      if(this.progressBarDirection==="1"){
        this.progressbarValue = 0 + (sec * 100) / seconds;
      }else{
        this.progressbarValue = 100 - (sec * 100) / seconds;
      }
      this.curSec = sec;
      if (this.curSec === seconds) {
        this.sub.unsubscribe();
      }
    });
  }

  clearTimer() {
    this.sub.unsubscribe();
    // if progressBarDirection value is "1" then progress dirction is reverse mode otherwise forward mode
    if(this.progressBarDirection==="1"){
      this.progressbarValue = 0;
    }else{
      this.progressbarValue = 100;
    }
  }

  upButtondisabled: boolean;
  downButtondisabled: boolean;
  upDownButtondisabled: boolean;
  clickMenu() {
    this.elementView.nativeElement.scrollTop = 0;
    this.openMenu = !this.openMenu;
    this.environmenTrigger.closeMenu();
    this.upButtondisabled = true;
    let offsetHeight = this.elementView.nativeElement.offsetHeight;
    if (offsetHeight <= 190) {
      this.upDownButtondisabled = true;
    } else {
      this.upDownButtondisabled = false;
    }
  }

  checkthis(e) {
    this.upButtondisabled = false;
    if (e.target.scrollHeight <= (e.target.scrollTop + e.target.offsetHeight)) {
      this.upButtondisabled = false;
      this.downButtondisabled = true;
    } else {
      this.upButtondisabled = true;
      this.downButtondisabled = false;
    }
  }

  ngOnInit() {

    let URL = this.route.url;
    if (URL == "/unauthorized-access") {
      this.accessBlocked = false;
    } else {
      this.accessBlocked = true;
    }

    const envVersion = environment.version;
    this.previousApplicationVersion = cookies.get('version');
    if (this.previousApplicationVersion == undefined) {
      cookies.set('version', envVersion, { expires: 365 });
      this.currentApplicationVersion = envVersion;
      this.previousApplicationVersion = cookies.get('version');
    } else {
      this.currentApplicationVersion = envVersion;
      this.previousApplicationVersion = cookies.get('version');
      // alert( this.previousApplicationVersion);
      // alert( this.currentApplicationVersion);
    }

    this.cookieValue = cookies.get('isCookiesStore');
    if (this.cookieValue) {
      this.inStorage = true;
    } else {
      this.inStorage = false;
    }



    if (!navigator.cookieEnabled) {
      // The browser does not support or is blocking cookies from being set.
      this.cookieEnabled = true;
    } else {
      this.cookieEnabled = false;
    }

    this.http.get("assets/config/version.json").subscribe(data => {
      data = JSON.parse(JSON.stringify(data));
      this.currentVersion = data['Version'];

    });
    this.currentScreenResolution = window.innerWidth;
    this.ScreenResolution(this.currentScreenResolution);

    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);

    })

    // this.currentApplicationVersion = environment.appVersion;
    this.currentApplicationVersion = environment.version;
    // console.log(this.versionValue);
    this.commonserviceService.OrgSelectObs.subscribe(value => {
      this.orgSelect = value;

    })


    this.commonserviceService.onOrgSelectLastLoginObs.subscribe(value => {
      if (value == null) {
        this.LastLoginDateTime = localStorage.getItem('LastLoginDateTime');

      } else {
        this.LastLoginDateTime = value;
      }

    })



    if (localStorage.getItem('TimeZone')) {
      let data = {
        'timezone': localStorage.getItem('TimeZone'),
        'timeformate': localStorage.getItem('DateTimeFormat')
      };
      this._userpreferencesService.changeTimeZoneFormat(data.timezone);
      this._userpreferencesService.changeDateFormat(data.timeformate);
    }

    this._userpreferencesService.dateFormat.subscribe(res => {
      let data = {
        'timezone': localStorage.getItem('TimeZone'),
        'timeformate': res
      };
      this._userpreferencesService.setuserpreferences(data);
      this.userpreferences = this._userpreferencesService.getNewPrefresnces();
    })

    this._userpreferencesService.timeZoneFormat.subscribe(res => {
      let data = {
        'timezone': res,
        'timeformate': localStorage.getItem('DateTimeFormat'),
      };

      this._userpreferencesService.setuserpreferences(data);
      this.userpreferences = this._userpreferencesService.getNewPrefresnces();
    })

    this.getBasicUserDetails();
  }


  /*
     @Type: File, <ts>
     @Name: ngAfterViewInit
     @Who: ANUP
     @When: 17-Dec-2021
     @Why: EWM-4037 EWM-4047
     @What: to open virsion dialog when version is not updated
   */
  ngAfterViewInit() {
    if (this.swCurrentApplicationVersion != this.swVersionValue) {
      this.versionTrigger.openMenu();
      this.setTimer('version');
    }
  }
  /*--
@(C): Entire Software
@Type: File, <TS>
@Name: footer.component.ts
@Who: Nitin
@When: 09-Oct-2020
@Why: ROST-247
@What: Implementation of Footer Section Flip with Logo Icon
*/
  dirChange(res) {
    if (res == 'ltr') {
      if (localStorage.getItem('MFA')) {
        this.environmentDirection = false;
        this.renderer.removeClass(this.footerDirection.nativeElement, 'right');
        this.renderer.removeClass(this.footerDirectionMove.nativeElement, 'right-align');
        //this.renderer.removeClass(this.imagefooter.nativeElement, 'left-align');
        //this.renderer.removeClass(this.imagefooter.nativeElement, 'right-align');
      } else {

        this.environmentDirection = false;
        this.renderer.removeClass(this.footerDirection.nativeElement, 'right');
        this.renderer.removeClass(this.imagefooter.nativeElement, 'left-align');
        this.renderer.removeClass(this.footerDirectionMove.nativeElement, 'right-align');
        this.renderer.addClass(this.imagefooter.nativeElement, 'right-align');
      }
    } else {
      if (localStorage.getItem('MFA')) {
        this.environmentDirection = true;
        this.renderer.addClass(this.footerDirection.nativeElement, 'right');
        this.renderer.removeClass(this.footerDirectionMove.nativeElement, 'right-align');
        // this.renderer.removeClass(this.imagefooter.nativeElement, 'right-align');
        //this.renderer.removeClass(this.imagefooter.nativeElement, 'left-align');
      } else {
        this.environmentDirection = true;
        this.renderer.addClass(this.footerDirection.nativeElement, 'right');
        this.renderer.addClass(this.footerDirectionMove.nativeElement, 'right-align');
        this.renderer.removeClass(this.imagefooter.nativeElement, 'right-align');
        this.renderer.addClass(this.imagefooter.nativeElement, 'left-align');
      }
    }
  }



  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.currentScreenResolution = window.innerWidth;
    this.ScreenResolution(this.currentScreenResolution);
  }

  ScreenResolution(width) {
    if (this.preferredScreenResolution > this.currentScreenResolution || this.preferredMaxScreenResolution < this.currentScreenResolution) {
      this.ScreenResolutionIcon = 'desktop_access_disabled';
      this.screenResolutionMessage = 'tooltip_screenResolution';
      this.classChange = true;
    } else {
      this.ScreenResolutionIcon = 'desktop_windows';
      this.screenResolutionMessage = 'tooltip_bestScreenResolution';
      this.classChange = false;
    }
  }
  /**
    @(C): Entire Software
    @Type: Function
    @Who: Mukesh kumar rai
    @When: 10-Sept-2020
    @Why:  Open for modal window
    @What: This function responsible to open and close the modal window.
    @Return: None
    @Params :
    1. param -button name so we can check it come from which link.
   */
  openDialog(param): void {
    if (param === 'privacy') {
      this.modaldata = this.dummyService.getPolicy();
    }
    if (param === 'term') {
      this.modaldata = this.dummyService.getTerm();
    }
    const dialogRef = this.dialog.open(FooterDialogComponent, {
      // maxWidth: '750px',
      // width: '90%',
      disableClose: true,
      data: this.modaldata,
      panelClass: ['xeople-modal-lg', 'footerPopUp', 'animate__animated', 'animate__slow', 'animate__fadeInUpBig']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  /**
   @(C): Entire Software
   @Type: Function
   @Who: Mukesh kumar rai
   @When: 15-Sept-2020
   @Why:  ROST-189
   @What: This function used for passing data to the toast component
   @Return: None
   @Params :
   1. message - Message which you want to show in toast
   2.action - action on button for close
  */
  openSnackBar(message: string, action: string, className: string) {
    let SnackbarType: string;
    if (className === 'success-snackbar') {
      SnackbarType = 'scusess';
    } else {
      SnackbarType = 'warn';
    }
    let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass: [className],
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: {
        snackbarType: SnackbarType,
        html: message
      }
    });
    snackBarRef.afterDismissed().subscribe(() => {
    });
  }
  // openSnackBar(message: string, action: string, className: string) {
  //   this.snackBar.open(message, action, {
  //     duration: 5000,
  //     panelClass: [className],
  //     horizontalPosition: this.horizontalPosition,
  //     verticalPosition: this.verticalPosition,
  //   });
  // }

  /**
     @(C): Entire Software
     @Type: Function
     @Who:  Suika
     @When: 22-March-2021
     @Why:  ROST-1207
     @What: This function used for storing data to the storage
     @Return: None
    */
  saveCookies() {
    cookies.set('isCookiesStore', "true", { expires: 365 });
    this.cookieValue = cookies.get('isCookiesStore');
    if (this.cookieValue) {
      this.inStorage = true;
    } else {
      this.inStorage = false;
    }
  }


  /**
    @Name: setTimer Function
    @Who:  Renu
    @When: 15-Apr-2021
    @Why:  ROST-1356
    @What: This function used for auto disappearance of buttons
    @Return: None
   */
  // orgSelect && LastLoginDateTime
  public setTimer(btnName: any) {
    let progressTimer = this.autoDisapperTime / 100;
    this.startTimer(progressTimer);
    if (this.autoDisapperTime !== '0') {
      if (btnName == 'environment') {

        this.versiontrigger.closeMenu();
        // this.screenResolutionTrigger.closeMenu();
        this.networkoffTrigger.closeMenu();
        this.networkonTrigger.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTrigger.closeMenu();
          this.lastLoginTrigger._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.openMenu = false;
        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.add("footerIcontActive");

        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
        // @When: 30-03-2023 @who:Amit @why: EWM-11636 @what: environment popup close
          this.environmenTrigger.closeMenu();
        }, callbackDealy);

      }
      if (btnName == 'version') {
        //this.EnvironmentMenu.closeMenu();
        // this.screenResolutionTrigger.closeMenu();
        this.networkoffTrigger.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTrigger.closeMenu();
          this.lastLoginTrigger._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.networkonTrigger.closeMenu();
        this.environmenTrigger.closeMenu();
        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");

        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.add("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;
        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.versiontrigger.closeMenu();
        }, callbackDealy);
      }

      /*
      if (btnName == 'ScreenResolution') {
        //this.EnvironmentMenu.closeMenu();
        this.versiontrigger.closeMenu();
        this.networkoffTrigger.closeMenu();
        this.networkonTrigger.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTrigger.closeMenu();
          this.lastLoginTrigger._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.classAdd = "true";
        this.environmenTrigger.closeMenu();
        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.screenResolutionTrigger._element.nativeElement.classList.add("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.screenResolutionTrigger.closeMenu();
        }, callbackDealy);
      }*/
      if (btnName == 'NetworkOn') {
        //this.EnvironmentMenu.closeMenu();
        this.versiontrigger.closeMenu();
        this.networkoffTrigger.closeMenu();
        // this.screenResolutionTrigger.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTrigger.closeMenu();
          this.lastLoginTrigger._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.environmenTrigger.closeMenu();
        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.add("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.networkonTrigger.closeMenu();
        }, callbackDealy);
      }
      if (btnName == 'NetworkOff') {

        //this.EnvironmentMenu.closeMenu();
        this.versiontrigger.closeMenu();
        this.networkonTrigger.closeMenu();
        // this.screenResolutionTrigger.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTrigger.closeMenu();
          this.lastLoginTrigger._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.environmenTrigger.closeMenu();
        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");

        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.add("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.networkoffTrigger.closeMenu();
        }, callbackDealy);
      }
      if (btnName == 'lastLogin') {

        //this.EnvironmentMenu.closeMenu();
        this.versiontrigger.closeMenu();
        this.networkonTrigger.closeMenu();
        // this.screenResolutionTrigger.closeMenu();
        this.environmenTrigger.closeMenu();
        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");

        this.lastLoginTrigger._element.nativeElement.classList.add("footerIcontActive");
        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.lastLoginTrigger.closeMenu();
        }, callbackDealy);
      }
      if (btnName == 'NetworkOnMobile') {
        this.environmenTrigger.closeMenu();
        // this.screenResolutionTriggerMobile.closeMenu();
        this.versionTriggerMobile.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTriggerMobile.closeMenu();
          this.lastLoginTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.networkoffTriggerMobile.closeMenu();

        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");

        this.networkonTriggerMobile._element.nativeElement.classList.add("footerIcontActive");
        // this.screenResolutionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        this.versionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");

        this.networkoffTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.networkonTriggerMobile.closeMenu();
        }, callbackDealy);
      }
      /*
      if (btnName == 'ScreenResolutionMobile') {
        this.environmenTrigger.closeMenu();
        this.networkonTriggerMobile.closeMenu();
        this.versionTriggerMobile.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTriggerMobile.closeMenu();
          this.lastLoginTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.networkoffTriggerMobile.closeMenu();

        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");

        this.networkonTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTriggerMobile._element.nativeElement.classList.add("footerIcontActive");
        this.versionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");

        this.networkoffTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.screenResolutionTriggerMobile.closeMenu();
        }, callbackDealy);
      }*/
      if (btnName == 'versionMobile') {
        this.environmenTrigger.closeMenu();
        this.networkonTriggerMobile.closeMenu();
        // this.screenResolutionTriggerMobile.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTriggerMobile.closeMenu();
          this.lastLoginTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.networkoffTriggerMobile.closeMenu();

        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");

        this.networkonTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        this.versionTriggerMobile._element.nativeElement.classList.add("footerIcontActive");

        this.networkoffTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.versionTriggerMobile.closeMenu();
        }, callbackDealy);
      }

      if (btnName == 'lastLoginMobile') {
        this.environmenTrigger.closeMenu();
        this.networkonTriggerMobile.closeMenu();
        // this.screenResolutionTriggerMobile.closeMenu();
        this.versionTriggerMobile.closeMenu();
        this.networkoffTriggerMobile.closeMenu();

        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");

        this.networkonTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        this.versionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        this.lastLoginTriggerMobile._element.nativeElement.classList.add("footerIcontActive");
        this.networkoffTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.lastLoginTriggerMobile.closeMenu();
        }, callbackDealy);
      }

      if (btnName == 'NetworkOffMobile') {
        this.environmenTrigger.closeMenu();
        this.networkonTriggerMobile.closeMenu();
        // this.screenResolutionTriggerMobile.closeMenu();
        if (this.LastLoginDateTime && this.orgSelect) {
          this.lastLoginTriggerMobile.closeMenu();
          this.lastLoginTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        }
        this.versionTriggerMobile.closeMenu();

        // add remove active class
        this.environmenTrigger._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkonTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.networkoffTrigger._element.nativeElement.classList.remove("footerIcontActive");
        this.versiontrigger._element.nativeElement.classList.remove("footerIcontActive");

        this.networkonTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        // this.screenResolutionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");
        this.versionTriggerMobile._element.nativeElement.classList.remove("footerIcontActive");

        this.networkoffTriggerMobile._element.nativeElement.classList.add("footerIcontActive");
        // add remove active class
        let callbackDealy = this.autoDisapperTime;

        if (this.timers) {
          clearTimeout(this.timers);

        }
        this.timers = setTimeout(() => {
          this.networkoffTriggerMobile.closeMenu();
        }, callbackDealy);
      }

    }

  }


  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ top: (this.widgetsContent.nativeElement.scrollTop + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ top: (this.widgetsContent.nativeElement.scrollTop - 150), behavior: 'smooth' });
  }


  updateClient() {
    // if (!this.swUpdates.isEnabled) {
    //   //  console.log('Not Enabled');
    //   return;
    // }
    // this.swUpdates.available.subscribe((event) => {
    //   // this.currentApplicationVersion = event.current.hash
    //   // this.versionValue = event.available.hash;
    //   cookies.set('available-hashVersion', event.available.hash, { expires: 365 });
    //   this.swVersionValue = cookies.get('available-hashVersion');
    //   if (this.swVersionValue != undefined && this.swCurrentApplicationVersion == this.swVersionValue) {
    //     this.isVersionMismatch = false;
    //   } else {
    //     this.isVersionMismatch = true;
    //   }
      /*  if(confirm('update avaiable for the app plz confirm')){
          this.currentHash = event.current;
          this.avaiableHash = event.available;
          console.log("confirmcurrent", this.currentHash, "confirmavaiable",this.avaiableHash);
          this.swUpdates.activateUpdate().then(()=> console.log("currentvaa", event.current, "avaiablevaaa",event.available));

          console.log("activatedcurent", event.current, "activatedavaiable",event.available);
        }*/
    //})


  }



  versionUpdate() {
    // this.swUpdates.activateUpdate().then(() => location.reload());
    // this.swUpdates.activated.subscribe((event) => {
    //   // this.currentApplicationVersion = event.previous.hash
    //   //this.versionValue = event.current.hash;
    //   cookies.set('current-hashVersion', event.current.hash, { expires: 365 });
    //   this.swVersionValue = cookies.get('available-hashVersion');
    //   this.swCurrentApplicationVersion = cookies.get('current-hashVersion');
    //   cookies.set('version', environment.version, { expires: 365 });
    //   if (this.swVersionValue != undefined && this.swCurrentApplicationVersion == this.swVersionValue) {
    //     this.isVersionMismatch = false;
    //   } else {
    //     this.isVersionMismatch = true;
    //   }
    // })
  }


  checkUpdate() {
    this._appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(2 * 30 * 30 * 1000);
        // timeInterval.subscribe(() => {
        // //this.swUpdates.checkForUpdate().then(() =>location.reload());
        // //console.log('update checked');
        // });
      }
    });
  }

/*
  @Type: File, <ts>
  @Name: getBasicUserDetails
  @Who: Adarsh singh
  @When: 07-11-2022
  @Why: EWM-9433
  @What: get current user info from localStorage
*/
 getBasicUserDetails = () =>{
    let currentUserDetails = JSON.parse(localStorage.getItem('currentUser'))
    let ProfileUrl = localStorage.getItem('ProfileUrl');
    if (currentUserDetails && ProfileUrl) {
      if (!ProfileUrl) {
        ProfileUrl = "/assets/user.svg";
      } else {
        ProfileUrl;
      }
    this.currentUser.push({
      name: currentUserDetails?.FirstName+ ' '+currentUserDetails?.LastName,
      email: currentUserDetails?.EmailId,
      profileUrl: ProfileUrl
    })

  }
    }
}
