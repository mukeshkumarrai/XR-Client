/*
@(C): Entire Software
@Type: File, <ts>
@Name: modules.component.ts
@Who: Renu
@When: 22-dec-2020
@Why: ROST-572
@What: This file is the main core module file all the rotuing
of feature module will be defined here
 */
import { Component, OnInit, HostBinding, Inject, ViewChild, ElementRef, ViewEncapsulation, HostListener, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Renderer2 } from '@angular/core';
const THEME_DARKNESS_SUFFIX = `-dark`;
import { TranslateService } from '@ngx-translate/core';
import { CommonServiesService } from '../shared/services/common-servies.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../shared/services/login/login.service';
import { CommonserviceService } from '../shared/services/commonservice/commonservice.service';
import { SidebarService } from '../shared/services/sidebar/sidebar.service';
import { ServiceListClass } from '../shared/services/sevicelist';
import { MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { ResizeService } from '../shared/services/resize.service';
import { SCREEN_SIZE } from '../shared/models/User';
import { DummyService } from '../shared/data/dummy.data';
import { MatDrawer } from '@angular/material/sidenav/drawer';
import { UserpreferencesService } from '../shared/services/commonservice/userpreferences.service';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { ResponceData, Userpreferences } from '../shared/models/index';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../shared/modal/confirm-dialog/confirm-dialog.component';
import { DynamicMenuService } from '../shared/services/commonservice/dynamic-menu.service';
import { FooterDialogComponent } from '../shared/modal/footer-dialog/footer-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { TextChangeLngService } from '../shared/services/commonservice/text-change-lng.service';
import {rightToLeft} from './animation/route.animation';
import { ValidateCode } from '../shared/helper/commonserverside';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { XeepService } from '../shared/services/xeep/xeep.service';
@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  animations: [rightToLeft],
  encapsulation: ViewEncapsulation.None,
  providers: [DummyService]
})
export class ModulesComponent implements OnInit {
  /*************************common decalarations of variables************************* */
  @HostBinding('class') activeThemeCssClass: string;
  @ViewChild('spanval') span: ElementRef;
  @ViewChild('image') image: ElementRef;
  @ViewChild('drawer', { static: true }) drawer: MatDrawer;
  @ViewChild('drawermenu', { static: true }) drawermenu: MatDrawer;
  @ViewChild('settingtrigger') settingtrigger: MatMenuTrigger;
  sharedData: string;
  isThemeDark = false;
  activeTheme: string;
  activeColor: string;
  currentVersion: string;
  public selectedSubMenu: string;
  regionId: any;
  status: boolean = false;
  public submenu: any = [];
  public ActiveMenu: string;
  public selectedMenu: string;
  public ActiveSubmenuList = [];
  ActiveLink: string;
  submenuUrl: string;
  sideBarMenu: string;
  selectedIndex: number;
  modaldata: any;
  public primaryBgColor: string = '#673AB7';
  public primaryTxtColor: string = '#ffffff';
  public highlightBgColor: string = '#7FB734';
  public highlightTxtColor: string = '#ffffff';
  public faviconImage: string;
  orgSelect: any;
  isFullScreen: boolean;
  fullscreenmode;
  LastLoginDateTime: string;
  watcher: Subscription;
  public userpreferences: Userpreferences;
  namedButtons = [];
  iconButtons = [];
  overflowMenuItems = [];
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
  public organizationData = [];
  public OrganizationId: string;
  public loading: boolean;
  orgId: any;
  result: string = '';
  toggleActive: boolean = false;
  public positionMatDrawer: string = 'start';
  public keyboard_arrow_right: string = 'keyboard_arrow_right';
  public keyboard_arrow_left: string = 'keyboard_arrow_left';
  currentMenuWidth: number;
  public lang: string;
  public searchEnable: any;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(result => result.matches)
  );
  loginResponce: any;
  router: any;
  ActiveTopMenu: string;
  public menuData: any;
  public topMenu: any;
  public setting: any;
  public profile: any;
  clients: any;
  client: any;
  employee:any;
  employees:any;
  mobileQuery: MediaQueryList;
  yearFilter: MediaQueryList;
  private _mobileQueryListener: () => void;
  public drawerWidth:string;
  public drawerMode:string="side";
  public drawerOpenCloseIcon:boolean;
  defaultbackgroundUrl="/assets/sidebar-banner/sidebar-bg.png"
  SidebardefaultbackgroundUrl='';
  currentXeepImage: string;
  IsXeepVisible: boolean | null;
  /*
    @Type: File, <ts>
    @Name: constructor
    @Who: Renu
    @When: 23-11-2020
    @Why: ROST-404
    @What: All dependencies are declared here
  */
  constructor(
    private commonserviceService: CommonserviceService, private breakpointObserver: BreakpointObserver,
    private translateService: TranslateService, private countryMasterService: CountryMasterService,
    private commonServiesService: CommonServiesService,
    public _userpreferencesService: UserpreferencesService, private snackBService: SnackBarService,
    private route: Router, private authenticationService: LoginService,
    @Inject(DOCUMENT) private document: any,public _sidebarService: SidebarService, public dummyService: DummyService,
    public dialog: MatDialog,private xeepService: XeepService,
    public  changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public dialogModel: MatDialog, private _appSetting: AppSettingsService
  ) {
    this.themeApply();
    this.translateService.setDefaultLang(localStorage.getItem('Language'));
    this.SidebardefaultbackgroundUrl = this._appSetting.SidebardefaultbackgroundUrl;
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this.ActiveMenu = URL_AS_LIST[3];
    this.commonserviceService.invokeEvent.subscribe(() => {
      this.subMenu();
    });
  }
  /*
    @Type: File, <ts>
    @Name: HostListener
    @Who: Renu
    @When: 04-12-2020
    @Why: ROST-468
    @What: to check when window resizes
  */
  @HostListener("window:resize", ['$event'])
  public onResize(event) {
    this.currentMenuWidth = event?.target?.innerWidth;
    event.target.innerWidth;
    this.drawerStatus();
    this.mobileMenu();
  }
  mobileMenu() {
    let items = this.ActiveSubmenuList?.slice();
    this.namedButtons = [];
    this.iconButtons = [];
    this.overflowMenuItems = [];
    if (items.length > 0) {
      this.overflowMenuItems = items;
    }
    if (this.currentMenuWidth > 441 && this.currentMenuWidth < 580) {
      this.iconButtons = this.iconButtons.concat(items.splice(0, 3));
      this.commonserviceService.toggleclose();
      this.settingtrigger.closeMenu();
    } else if (this.currentMenuWidth > 318 && this.currentMenuWidth < 440) {
      this.iconButtons = this.iconButtons.concat(items.splice(0, 2));
      this.commonserviceService.toggleclose();
      this.settingtrigger.closeMenu();
    } else {
      this.iconButtons = this.iconButtons.concat(items.splice(0, 2));
      this.commonserviceService.toggleclose();
      this.settingtrigger.closeMenu();
    }
  }
  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  themeApply
  // @What: this function used for change theme of application.
  // @Return: None
  themeApply() {
    this.primaryBgColor = localStorage.getItem('HeaderBackground');
    this.primaryTxtColor = localStorage.getItem('HeaderColor');
    this.highlightBgColor = localStorage.getItem('HighlightBackground');
    this.highlightTxtColor = localStorage.getItem('HighlightColor');
    if (this.primaryBgColor != null && this.primaryTxtColor != null && this.highlightBgColor != null && this.highlightTxtColor != null) {
      document.documentElement.style.setProperty('--primary-color', this.primaryBgColor);
      document.documentElement.style.setProperty('--secondary-color', this.primaryTxtColor);
      document.documentElement.style.setProperty('--highlightprimary-color', this.highlightBgColor);
      document.documentElement.style.setProperty('--highlightsecondary-color', this.highlightTxtColor);
    }
  }
  /*
  @Type: File, <ts>
  @Name: ngAfterViewInit
  @Who: Renu
  @When: 04-12-2020
  @Why: ROST-468
  @What: after compoenent reloads method to handle any additional initialization tasks.
*/
  ngAfterViewInit(): void {}
  /*
    @Type: File, <ts>
    @Name: ngOnInit
    @Who: Renu
    @When: 04-12-2020
    @Why: ROST-468
    @What: to initialize work and logic of the component.
  */
  ngOnInit() {
    // --------@When: 20-APR-2023 @who:Adarsh singh @why: EWM-12005 @modify Adarsh singh 28-dept-2023 -for EWM-14125--------
    this.commonserviceService.onFaviconSelectChange.subscribe((data: any) => {
      let getImg = localStorage.getItem('FaviconUrl');
      if (getImg) {
        this.faviconImage = getImg;
      } else {
        this.faviconImage = '/assets/fab.png';
      }
      setTimeout(() => {
        if (data) {
          this.document.getElementById('favIcon').setAttribute('href', this.faviconImage);
        } else {
          this.document.getElementById('favIcon').setAttribute('href', this.faviconImage);
        }
      }, 300);
      // Adarsh singh for-16034 on 19 March 2024
      this.getMobileOperatingSystemIsIOS();
    })
    //  End
    let screenWidth = window.innerWidth;
    this.currentMenuWidth = window.innerWidth;
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this.ActiveMenu = URL_AS_LIST[3];
    this.sideBarMenu = this.ActiveMenu;
    this.selectedSubMenu = URL_AS_LIST[4];
    this._sidebarService.activesubMenuObs.next(this.selectedSubMenu);
    this._sidebarService.subManuGroup.next(this.sideBarMenu);
    this._sidebarService.subManuGroupData.subscribe(value => {
      this.ActiveMenu = value;
    });
    this._sidebarService.activesubMenu.subscribe(value => {
      this.selectedSubMenu = value;
    });
    let data = {
      'timezone': localStorage.getItem('TimeZone'),
      'timeformate': localStorage.getItem('DateTimeFormat')
    };
    this._userpreferencesService.setuserpreferences(data);
    // this.openExitFullScreen = document.documentElement;
    this.commonserviceService.setDrawer(this.drawer);
    this.commonServiesService.event.subscribe(res => {
      this.dirChange(res);
    });
    this.subMenu();
    this.commonserviceService.OrgSelectObs.subscribe(value => {
      this.orgSelect = value;
    })
    this.LastLoginDateTime = localStorage.getItem('LastLoginDateTime');
    if (localStorage.getItem('TimeZone')) {
      let data = {
        'timezone': localStorage.getItem('TimeZone'),
        'timeformate': localStorage.getItem('DateTimeFormat')
      };
      this._userpreferencesService.setuserpreferences(data);
      this.userpreferences = this._userpreferencesService.getuserpreferences();
    }
    this.getOrganizationList();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }

    })
    this.menuData = JSON.parse(localStorage.getItem('menuInfo'));
    this.setMenuAll();
    this.drawerStatus();
    this.commonserviceService.onjobDrawerChange.subscribe(res => {
      /*****@Who:Satya Prakash Gupta @Why:Ewm-13079 ewm-13686 @When:03-Aug-2023 */
      if(res!=null){
        if(res==true){
          if (this.currentMenuWidth > 240 && this.currentMenuWidth < 581){
            this.drawerWidth="0px";
            document.getElementsByClassName("moduleDrawer")[0].classList.add("drawerOpen");
            this.drawerOpenCloseIcon=true;
            this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
          }else{
            this.drawerWidth="75px";
            document.getElementsByClassName("moduleDrawer")[0].classList.add("drawerOpen");
            this.drawerOpenCloseIcon=true;
            this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
          }
        }else{
          if (this.currentMenuWidth > 240 && this.currentMenuWidth < 581){
            this.drawerWidth="0px";
            document.getElementsByClassName("moduleDrawer")[0].classList.add("drawerOpen");
            this.drawerOpenCloseIcon=true;
            this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
          }else{
            /*****@Who:Renu @Why:Ewm-12861 ewm-12891 @When:29-06-2023 */
            this.drawerWidth="240px";
            document.getElementsByClassName("moduleDrawer")[0].classList.remove("drawerOpen");
            this.drawerOpenCloseIcon=false;
            this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
          }
        }
      }
    });
    setTimeout(() => {
      this.IsXeepVisible=localStorage.getItem('XeepAnimation')=='1'?true:false;
    }, 300);
 
    this.xeepService.actionImage$.subscribe(image => {
     this.currentXeepImage = image;
    });
    
  }
  ngOnDestroy(): void {
    this.mobileQuery?.removeEventListener('change',this._mobileQueryListener);/*@When:23-08-2023 @who: renu @why: EWM-13666 EWM-13910*/
  }
    /*
    @Type: File, <ts>
    @Name: mobileMenu
    @Who: Renu
    @When: 04-12-2020
    @Why: ROST-468
    @What: Detect screen curerent size and slice the menu icon accordingly
  */
    drawerStatus(){
      if (this.currentMenuWidth > 581 && this.currentMenuWidth < 1024) {
        this.drawerWidth="75px";
        document.getElementsByClassName("moduleDrawer")[0].classList.add("drawerOpen");
        this.drawerOpenCloseIcon=true;
        this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
      } else if (this.currentMenuWidth > 240 && this.currentMenuWidth < 581) {
        this.drawerWidth="0px";
      } else {
        this.drawerWidth="240px";
        document.getElementsByClassName("moduleDrawer")[0].classList.remove("drawerOpen");
        this.drawerOpenCloseIcon=false;
        this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
      }
    }
  /*
@Name: subMenu
@Who: Nitin
@When: 09-Oct-2020
@Why: ROST-247
@What: get the sub menu data
*/
  subMenu() {
    this.submenu = JSON.parse(localStorage.getItem('menuInfo'));
    let ActiveSubmenuListFilter;
    if (this.submenu) {
      ActiveSubmenuListFilter = this.submenu?.filter(x => x['Name'] == this.ActiveMenu);
      this.ActiveSubmenuList = ActiveSubmenuListFilter[0]?.Children;
     // --------@When: 26-june-2023 @who:Bantee Kumar @why: EWM-12857 --------
       this._sidebarService.searchBarEnable?.subscribe(value => {
      this.searchEnable=value;
      });
    }

  }
  /*
@Name: footer.component.ts
@Who: Nitin
@When: 09-Oct-2020
@Why: ROST-247
@What: Implementation of Footer Section Flip with Logo Icon
*/
  dirChange(res) {
    if (res == 'ltr') {
      this.keyboard_arrow_right = 'keyboard_arrow_right';
      this.keyboard_arrow_left = 'keyboard_arrow_left';
      this.positionMatDrawer = 'start';
    } else {
      this.keyboard_arrow_right = 'keyboard_arrow_left';
      this.keyboard_arrow_left = 'keyboard_arrow_right';
      this.positionMatDrawer = 'end';
    }
  }
  /*
   @Type: File, <TS>
   @Name: clickEvent
   @Who: Satya Prakash Gupta
   @When: 10-Nov-2020
   @Why: ROST-375 ROST-401
   @What: to show hide menu on click event
   */
  moduleDrawerOpenClose() {
    if (this.currentMenuWidth > 581 && this.currentMenuWidth < 1024) {
      if(this.drawerWidth==="75px"){
        document.getElementsByClassName("moduleDrawer")[0].classList.remove("drawerOpen");
        this.drawerWidth="240px";
        this.drawerOpenCloseIcon=false;
        this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
      }else{
        document.getElementsByClassName("moduleDrawer")[0].classList.add("drawerOpen");
        this.drawerWidth="75px";
        this.drawerOpenCloseIcon=true;
        this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
      }
    }else {
      if(this.drawerWidth==="75px"){
        document.getElementsByClassName("moduleDrawer")[0].classList.remove("drawerOpen");
        this.drawerWidth="240px";
        this.drawerOpenCloseIcon=false;
        this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
      }else{
        document.getElementsByClassName("moduleDrawer")[0].classList.add("drawerOpen");
        this.drawerWidth="75px";
        this.drawerOpenCloseIcon=true;
        this.commonserviceService.leftMenuServiceObs.next(this.drawerOpenCloseIcon);
      }
    }
  }
  /*
    @Type: File, <TS>
    @Name: getOrganizationList
    @Who: Satya Prakash Gupta
    @When: 10-Nov-2020
    @Why: ROST-375 ROST-401
    @What: get org data
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
  openConfrmDialog(value: any): void {
    this.drawer.close();
    const message = ``;
    const title = '';
    const subtitle = 'label_onOrgchangeTitle';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogModel.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
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
    localStorage.setItem('OrganizationName', data.Data['OrganizationName']);//who:maneesh,what:ewm-15806 for set OrganizationName,when:23/01/2024
    localStorage.setItem('LastLoginDateTime', data.Data['LastLoginDateTime']);
    //localStorage.setItem('Language', data.Data['Language']);
    if (data.Data['Language'] === null) {
      localStorage.setItem('Language', 'eng');
    } else {
      localStorage.setItem('Language', data.Data['Language']);
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
      maxWidth: '750px',
      width:"90%",
      disableClose: true,
      data: this.modaldata,
      panelClass: ['footerPopUp', 'animate__animated', 'animate__slow', 'animate__fadeInUpBig']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {
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
  /*
      @Type: File, <ts>
      @Name: setMenuAll function
      @Who: Mukesh
      @When: 01-June-2021
      @Why: ROST-1688
      @What: for selecting menudata
      */
  setMenuAll() {
    if (this.menuData) {
      let topmenu;
      let topsettingicon;
      let topProfile;
      this.menuData.forEach(element => {
        topmenu = this.menuData.filter(x => x['Position'] === 'T');
        topsettingicon = this.menuData.filter(x => x['Position'] === 'TRS');
        topProfile = this.menuData.filter(x => x['Position'] === 'TRP');
      });
      this.topMenu = topmenu;
      this.setting = topsettingicon;
      this.profile = topProfile;
    }
  }
    // Adarsh singh for-16034 on 19 March 2024
    getMobileOperatingSystemIsIOS(){
      let res = this.commonServiesService.checkOnlyIphoneDevice();
      if (res) {
        document.querySelector('body').classList.add('IOS-device');
      }
    }
}
