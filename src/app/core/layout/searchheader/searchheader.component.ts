/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: searchheader.component.ts
 @Who: Renu
 @When: 22-Dec-2020
 @Why: ROST-572
 @What: common search bar template Header Section
 */

import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ResponceData, SCREEN_SIZE } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { DynamicMenuService } from 'src/app/shared/services/commonservice/dynamic-menu.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-searchheader',
  templateUrl: './searchheader.component.html',
  styleUrls: ['./searchheader.component.scss']
})
export class SearchheaderComponent implements OnInit {

  /************************Global Variables Decalared Here*************************/
  selectedIndex: number;
  namedButtons = [];
  iconButtons = [];
  overflowMenuItems = [];
  currentMenuWidth: number;
  public ActiveSubmenuList = [];
  public submenu: any = [];
  public ActiveMenu: string;
  public selectedSubMenu: string;
  sideBarMenu: string;
  public submenuThirdLevelStatus: boolean = false;
  menuData: any;
  public submenuCount = [];
  backFirstLavelMenu: boolean = false;
  public backbutton = '';
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
  coreRoute;
  firstLavelMenu: boolean = true;
  @ViewChild('mobileSide') mobileSide: MatMenuTrigger;

  mobileQuery: MediaQueryList;
  yearFilter: MediaQueryList;
  private _mobileQueryListener: () => void;

  /*
   @Type: File, <TS>
   @Name: constructor()
   @Who: Renu
   @When: 22-Dec-2020
   @Why: ROST-572
   @What: All Dependency are injected here for this component
   */

  constructor(private serviceListClass: ServiceListClass,
    private _dynamicMenuService: DynamicMenuService, private elementRef: ElementRef,
    public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 420px)')
    this.yearFilter = media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  /*
   @Type: File, <TS>
   @Name: ngOnInit()
   @Who: Renu
   @When: 22-Dec-2020
   @Why: ROST-572
   @What: Component binding would be decalared here
   */

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this.ActiveMenu = URL_AS_LIST[3];
    this.coreRoute= URL_AS_LIST[2];
    this.sideBarMenu = this.ActiveMenu;
    this.selectedSubMenu = URL_AS_LIST[4];
    this._dynamicMenuService.setAllMenu(JSON.parse(localStorage.getItem('menuInfo')));
    this.getSubMenuList();
  }

  onSwiper(swiper) {
    // console.log(swiper);
  }
  onSlideChange() {
    //  console.log('slide change');
  }

  ngAfterViewInit(): void {
    //this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
    //  this._dynamicMenuService.setAllMenu(response.Data);
    // this.menuData = response.Data;
    //  this._dynamicMenuService.setAllMenu(JSON.parse(localStorage.getItem('menuInfo')));
    //   this.getSubMenuList();
    //});

    this._sidebarService.activesubMenuObs.next(this.selectedSubMenu);
    this._sidebarService.subManuGroup.next(this.sideBarMenu);

    this._sidebarService.subManuGroupData.subscribe(value => {
      this.ActiveMenu = value;
      this.submenuThirdLevelStatus = false;
      this.getSubMenuList();
    });


    this._sidebarService.activesubMenu.subscribe(value => {
      this.selectedSubMenu = value;

    });
    this._sidebarService.activeCoreRoute.subscribe(value => {
      if(value!=undefined && value!=null && value!=''){
      this.coreRoute = value;
    }})
    this.detectScreenSize();
  }
  /*
    @Type: File, <ts>
    @Name: detectScreenSize
    @Who: Renu
    @When: 04-12-2020
    @Why: ROST-468
    @What: Detect screen curerent size and change the menu list accordingly for small screen
*/
  private detectScreenSize() {
    const currentSize = this.sizes.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
      // check its display property value
    })

    this.mobileMenu();
  }

  /*
 @Type: File, <TS>
 @Name: back()
 @Who: Renu
 @When: 02-June-2021
 @Why: ROST-1688
 @What: for third level menu get back to master parent
 */
  back() {
    this.submenuThirdLevelStatus = false;
    this.backFirstLavelMenu = false;
    this.firstLavelMenu = true;
    this.route.navigate([this.backbutton]);
  }
  /*
   @Type: File, <TS>
   @Name: getSubMenuList()
   @Who: Renu
   @When: 22-Dec-2020
   @Why: ROST-572
   @What: get the menu list based on the routing file from module.menu.json
   */

  getSubMenuList() {

    //this.backFirstLavelMenu = false;
    this._dynamicMenuService.menuLavelStatus.subscribe(value => {
      if (value == 2) {
        this.backFirstLavelMenu = true;
      } else {
        this.backFirstLavelMenu = false;
      }

    });
    this.submenuCount = []
    this.ActiveSubmenuList = this._dynamicMenuService.getSubMenubyName(this.ActiveMenu);
    if (this.ActiveSubmenuList) {
      if (this.ActiveSubmenuList.length > 0) {
        this.mobileMenu();
      }
    }
  }


  /*
   @Type: File, <TS>
   @Name: mobileMenu()
   @Who: Renu
   @When: 22-Dec-2020
   @Why: ROST-572
   @What: menu which will be shown as an header for screen size smaller
   */

  mobileMenu() {
    if (this.ActiveSubmenuList) {
      let items = this.ActiveSubmenuList.slice();
      this.namedButtons = [];
      this.iconButtons = [];
      this.overflowMenuItems = [];

      if (items.length > 0) {
        this.overflowMenuItems = items;
      }
      // if (this.currentMenuWidth > 441 && this.currentMenuWidth < 580) {
      //   this.iconButtons = this.iconButtons.concat(items.splice(0, 3));
      //   if(this.mobileSide){
      //     this.mobileSide.closeMenu();
      //   }
      //   // this.commonserviceService.toggleclose();
      // } else if (this.currentMenuWidth > 318 && this.currentMenuWidth < 440) {
      //   this.iconButtons = this.iconButtons.concat(items.splice(0, 2));
      //   if(this.mobileSide){
      //     this.mobileSide.closeMenu();
      //   }
      //   /// this.commonserviceService.toggleclose();
      // }
      else {
        // this.iconButtons = this.iconButtons.concat(items.splice(0, 2));
        if (this.mobileSide) {
          this.mobileSide.closeMenu();
        }
        // this.commonserviceService.toggleclose();
      }
    }

  }
  /*
   @Type: File, <TS>
   @Name: routerUrl()
   @Who: Renu
   @When: 22-Dec-2020
   @Why: ROST-572
   @What: to dynamicaaly call the router on click event based on active menu
   */


  routerUrl(submenu, index: number) {
    this.route.navigate(['./client/' +this.coreRoute+'/'+ this.ActiveMenu + '/'+ submenu]);  
    this.selectedIndex = index;
  }

  /*
  @Type: File, <TS>
  @Name: clickMenu()
  @Who: Renu
  @When: 02-June-2021
  @Why: ROST-1688
  @What: to dynamicaaly call the router on click event based on active menu
  */

  clickMenu(Router, Name, ActiveMenu) {
    this.backFirstLavelMenu = true;
    this.backbutton = './client/core/' + ActiveMenu
    this.submenuThirdLevelStatus = false;
    this.ActiveSubmenuList = this.ActiveSubmenuList[0].Children;
    this.route.navigate(['./client/core/' + Router]);
    this.firstLavelMenu = false;
  }
  /*
   @Type: File, <TS>
   @Name: onResize
   @Who: Renu
   @When: 09-Feb-2021
   @Why: ROST-853
   @What: to ajust the mobile menu while resizing the screen
   */
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    this.detectScreenSize();
    event.target.innerWidth;
    if (this.ActiveSubmenuList?.length > 0) {
      this.mobileMenu();
    }
  }
}
