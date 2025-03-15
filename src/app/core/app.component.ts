import { ApplicationRef, Component, HostBinding, HostListener, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserIdleService } from 'angular-user-idle';
import { NavigationEnd, Router } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceListClass } from '../shared/services/sevicelist';
import { DatePipe, DOCUMENT } from '@angular/common';
import { SCREEN_SIZE } from '../shared/models/User';
import { ResizeService } from '../shared/services/resize.service';
import { delay, filter } from 'rxjs/operators';
import { LoginService } from '../shared/services/login/login.service';
import { Title } from '@angular/platform-browser';
import { CommonserviceService } from '../shared/services/commonservice/commonservice.service';
import { ThemingService } from '../shared/services/theming.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs/Rx';
import { AppSettingsService } from '../shared/services/app-settings.service';
//import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs/internal/observable/interval';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppSignalrService  } from '../shared/services/app-signalr.service';
import * as signalR from '@microsoft/signalr';
import { GoogleapiService } from 'src/app/core/googleapi.service'
//@suika @whn 27-06-2023 @EWM-12865 To set default format of date dd-mm-yyyy
export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "DD/MM/YYYY HH:mm:ss",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
//@suika @whn 27-06-2023 @EWM-12865 To set default format of date dd-mm-yyyy
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ]

})
export class AppComponent {
  previousUrl: string = null;
  currentUrl: string = null;
  title = 'ENTIRE.ROSTERS.WEB.CLIENT';
  textDir: string = 'rtl';
  geocoder: any;
  geocoderStatus: any;
  @HostListener('window:mousemove') refreshUserState() {
    this.restart();
  }
  public primaryBgColor: string = '#673AB7';
  public primaryTxtColor: string = '#ffffff';
  public highlightBgColor: string = '#7FB734';
  public highlightTxtColor: string = '#ffffff';
  size: SCREEN_SIZE;
  themingSubscription: Subscription;
  receivedMessage: string;
  //swUpdate: boolean = true;

  constructor(private translateService: TranslateService, private userIdle: UserIdleService, public router: Router,
    public dialog: MatDialog, public authService: LoginService, private serviceListClass: ServiceListClass,
    @Inject(DOCUMENT) private _document: HTMLDocument, private resizeSvc: ResizeService, private titleService: Title,
    private commonService: CommonserviceService,
    private themingService: ThemingService,
    private overlayContainer: OverlayContainer,private _appRef: ApplicationRef,
    private signalRService: AppSignalrService
  ) {

    //private swUpdates:SwUpdate,
    /*When: 16/09/2022 @Who: Renu @Why: EWM-8782 EWM-8729 @what: Refresh old tabs when a new Service Worker is installed*/
    // var refreshing;
    // navigator.serviceWorker.addEventListener('controllerchange',
    //   function() {
    //     if (refreshing) return;
    //     refreshing = true;
    //     window.location.reload();
    //   }
    // );
  /* navigator.serviceWorker.register('');
     navigator.serviceWorker.getRegistrations()
     .then(registrations => {
     registrations.forEach(registration => {
       registration.unregister();
      this.router.navigate(['/login']);
    })
   })
   navigator.serviceWorker.register('/ngsw-worker.js');
     if(swUpdates.isEnabled){
        swUpdates.available.subscribe(event=>{
        swUpdates.activateUpdate().then(() => window.location.reload);
       navigator.serviceWorker.register('/ngsw-worker.js');
     })
     }*/

   /*  navigator.serviceWorker.register('');
     if(swUpdates.isEnabled){
       swUpdates.available.subscribe(event=>{
         console.log("restart service worker");
         swUpdates.activateUpdate().then(() => window.location.reload);

      })
     }*/

   /*  swUpdates.available.subscribe(event => {
      this.swUpdate=true;
      swUpdates.activateUpdate().then(() => document.location.reload());

    })*/
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            console.log('Service Worker unregistered:', success);
          });
        }
      });
    }
  let tenantData= JSON.parse(localStorage.getItem('tenantData')) ;
  let Language='eng';
  if(tenantData!=undefined)
  {
  Language=tenantData.Language===null?Language:tenantData.Language;
  }
  this.translateService.setDefaultLang(Language);


    this.resizeSvc.onResize$
      .pipe(delay(0))
      .subscribe(x => {
        this.size = x;
      });
  }

  @HostBinding('class') public cssClass: string;

  ngOnInit(): void {
    this._document.getElementById('favIcon').setAttribute('href', '/assets/fab.png');
    this.changeTheme(this.primaryBgColor, this.primaryTxtColor, this.highlightBgColor, this.highlightTxtColor); // Set default theme
    if (this.authService.isLoggedIn() === true) {
      //Start watching for user inactivity.
      this.userIdle?.startWatching();
      // Start watching when user idle is starting.
      this.userIdle.onTimerStart().subscribe(count =>'');
      // Start watch when time is up.
      this.userIdle.onTimeout().subscribe(() => {
        this.router.navigateByUrl('/');
      }

      );
    }

    let host = this._document.location.hostname;
    let URL_AS_LIST = host.split('.');


    this.themingSubscription = this.themingService.theme.subscribe((theme: string) => {
      this.cssClass = theme;
      this.applyThemeOnOverlays();
    });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.commonService.setPreviousUrl(this.previousUrl);
    });
  // this.checkDarkTheme();
  }

  ngAfterViewInit() { //by maneesh using this for get url googleapi
    GoogleapiService.load()
  .then((_mapsApi) => {
    // debugger;
    // this.geocoder       = new _mapsApi.Geocoder();
    // this.geocoderStatus = _mapsApi.GeocoderStatus;
  });
}
  changeTheme(primary: string, secondary: string, highlightprimary: string, highlightsecondary: string) {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--highlightprimary-color', highlightprimary);
    //document.documentElement.style.setProperty('--highlightsecondary-color', highlightsecondary);
  }

/**
   * Apply the current theme on components with overlay (e.g. Dropdowns, Dialogs)
   */
  private applyThemeOnOverlays() {
    // remove old theme class and add new theme class
    // we're removing any css class that contains '-theme' string but your theme classes can follow any pattern
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(this.themingService.themes);
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(this.cssClass);
  }

  ngOnDestroy() {
    this.themingSubscription.unsubscribe();
  }




  /**
    @(C): Entire Software
    @Type: Function
    @Who: Mukesh kumar rai
    @When: 27-Sept-2020
    @Why:  ROST-217
    @What: This function responsible stop user idle checking.
  */
  stop() {
    this.userIdle.stopTimer();
  }
  /**
      @(C): Entire Software
      @Type: Function
      @Who: Mukesh kumar rai
      @When: 27-Sept-2020
      @Why:  ROST-217
      @What: This function responsible stopwatching user idle checking.
    */
  stopWatching() {
    this.userIdle.stopWatching();
  }
  /**
      @(C): Entire Software
      @Type: Function
      @Who: Mukesh kumar rai
      @When: 27-Sept-2020
      @Why:  ROST-217
      @What: This function responsible start user idle checking.
    */
  startWatching() {
    this.userIdle?.startWatching();
  }
  /**
      @(C): Entire Software
      @Type: Function
      @Who: Mukesh kumar rai
      @When: 27-Sept-2020
      @Why:  ROST-217
      @What: This function responsible reset idle timer user idle checking.
    */
  restart() {
    this.userIdle.resetTimer();
  }

 /* updateClient(){
    if(!this.swUpdates.isEnabled){
      console.log('Not Enabled');
      return;
    }
    this.swUpdates.available.subscribe((event)=>{
      console.log("current", event.current, "avaiable",event.available);
      if(confirm('update avaiable for the app plz confirm')){
        this.swUpdates.activateUpdate().then(()=>location.reload());
      }
    })

    this.swUpdates.available.subscribe((event)=>{
      console.log("current", event.current);
    })
  }
*/

 /* checkUpdate(){
    this._appRef.isStable.subscribe((isStable)=>{
      if(isStable){
        const timeInterval = interval(20000);
        timeInterval.subscribe(()=>{
          this.swUpdates.checkForUpdate().then(()=>console.log("checked"));
          console.log("update checked");
        })
      }
    })
  }*/


/* @Adarsh Singh
  when dark mode will enabled of the window our application will not convert into dark mode
*/
checkDarkTheme(){
 window.matchMedia('(prefers-color-scheme: dark)')
 .addEventListener('change', event => {
  setTimeout(() => {
   const isDarkMode = document.querySelector('.dark-theme');
   if (event.matches) {
     isDarkMode?.classList.remove('dark-theme');
     window.location.reload();
   } else {
     if(isDarkMode){
       isDarkMode?.classList.remove('dark-theme');
     }
   }
  }, 500);
 });
}


}
