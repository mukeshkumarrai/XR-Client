/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: sidebar.component.ts
 @Who: Renu
 @When: 22-Dec-2020
 @Why: ROST-572
 @What: sidebar Section
 */

import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { DynamicMenuService } from 'src/app/shared/services/commonservice/dynamic-menu.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { slideInOutAnimation } from 'src/app/shared/_animations/index';

export let browserRefresh = false;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [slideInOutAnimation],
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  /***********************Global Decalaration of variables******************/
  selectedIndex: number;
  submenuUrl: string;
  sideBarMenu: string;
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public submenu: any = [];
  public ActiveSubmenuList = [];
  public submenuCount = [];
  public submenuThirdLevel = [];
  public submenuThirdLevelStatus: boolean = false;
  namedButtons = [];
  iconButtons = [];
  overflowMenuItems = [];
  currentMenuWidth: number;
  public positionMatDrawer: string = 'start';
  status: boolean = true;
  secondLavelMenu: boolean = false;
  firstLavelMenu: boolean = true;
  backFirstLavelMenu: boolean = false;
  public backbutton = '';
  menuData: any;

  clients:any;
  employees:any;
  coreRoute: any;
  tooltipStatus: boolean;
  /*
   @(C): Entire Software
   @Type: File, <TS>
   @Name: sidebar.component.ts
   @Who: Renu
   @When: 22-Dec-2020
   @Why: ROST-572
   @What: sidebar Section
   */

  constructor(private route: Router, public _sidebarService: SidebarService,
    private serviceListClass: ServiceListClass,private textChangeLngService:TextChangeLngService,
    private _dynamicMenuService: DynamicMenuService,
    private commonserviceService: CommonserviceService) { }

  ngOnInit(): void {
    // this.client=this.textChangeLngService.getData('singular');
    // this.commonserviceService.changeLngForClientTextObs.pipe(delay(0)).subscribe(value => {
    //   if(value!=null){
    // this.client = value;
    //   }
    // })

  // this.clients=this.textChangeLngService.getData('plural');
  //   this.commonserviceService.changeLngForClientsTextObs.pipe(delay(0)).subscribe(value => {
  //     if(value!=null){
  //   this.clients = value;
  //     }
  //   })


  //   this.employee=this.textChangeLngService.getDataEmployee('singular');
  // this.commonserviceService.changeLngForEmployeeTextObs.pipe(delay(0)).subscribe(value => {
  //   if(value!=null){
  // this.employee = value;
  //   }
  // })

  // this.employees=this.textChangeLngService.getDataEmployee('plural');
  // this.commonserviceService.changeLngForEmployeesTextObs.pipe(delay(0)).subscribe(value => {
  //   if(value!=null){
  // this.employees = value;
  //   }
  // })


    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.coreRoute= URL_AS_LIST[2];
    this.ActiveMenu = URL_AS_LIST[3];
    //console.log(this.ActiveMenu);
    this.sideBarMenu = this.ActiveMenu;
    if (URL_AS_LIST[4] == 'access-denied') {
      this._sidebarService.activesubMenu.subscribe(val => {
        if (val == 'access-denied') {
          this.selectedSubMenu = sessionStorage.getItem('LastmenuSelect');
        } else {
          this.selectedSubMenu = val;
        }
      })
    }
    else {
      this.selectedSubMenu = URL_AS_LIST[4];
    }
    this._dynamicMenuService.setAllMenu(JSON.parse(localStorage.getItem('menuInfo')));
    this.getSubMenuList();
    this.commonserviceService.leftMenuServiceObsObj.subscribe((res:any)=>{
      this.tooltipStatus=res;
    });
  }

  ngAfterViewInit(): void {
    //  this._dynamicMenuService.getsubMenuall().subscribe((response: ResponceData) => {
    //   this._dynamicMenuService.setAllMenu(response.Data);
    //   this.menuData = response.Data;

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

/*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRoute.subscribe(value => {
      if(value!=undefined && value!=null && value!=''){
      this.coreRoute = value;
    }
    });
//////////////////

  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnloadHander(event) {
    if (browserRefresh) {
     // alert('refresh')
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

  routerUrl(submenu, menu_Name, index: number) {
    //alert(submenu + menu_Name);
    this.route.navigate(['./client/'+this.coreRoute+'/' + this.ActiveMenu + '/' + submenu]);
    this.selectedIndex = index;
  }

  clickMenu(Router, Name, ActiveMenu) {
    this.backFirstLavelMenu = true;
    this.backbutton = './client/core/' + ActiveMenu
    this.submenuThirdLevelStatus = false;
    this.ActiveSubmenuList = this.ActiveSubmenuList[0].Children;
    this.route.navigate(['./client/core/job/' + Router]);
    this.firstLavelMenu = false;
    document.getElementsByClassName("backtMenu")[0].classList.remove("animate__slideOutRight");
    document.getElementsByClassName("backtMenu")[0].classList.add("animate__slideInRight");
    document.documentElement.style.setProperty('--animate-duration', '.5s');
  }

  back() {

    this.submenuThirdLevelStatus = false;
    this.backFirstLavelMenu = false;
    this.firstLavelMenu = true;
    this.route.navigate([this.backbutton]);
  }

  /*
   @Type: File, <TS>
   @Name: getSubMenuList()
   @Who: Mukesh
   @When: 22-May-2021
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
   // console.log('this.ActiveMenu', this.ActiveMenu);
   // console.log('this.ActiveSubmenuList', this.ActiveSubmenuList);
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
    let items = this.ActiveSubmenuList?.slice();
    this.namedButtons = [];
    this.iconButtons = [];
    this.overflowMenuItems = [];

    if (items?.length > 0) {
      this.overflowMenuItems = items;
    }
    if (this.currentMenuWidth > 425 && this.currentMenuWidth < 580) {
      this.iconButtons = this.iconButtons?.concat(items?.splice(0, 4));
    } else if (this.currentMenuWidth > 318 && this.currentMenuWidth < 355) {
      this.iconButtons = this.iconButtons?.concat(items?.splice(0, 2));
    } else {
      this.iconButtons = this.iconButtons?.concat(items?.splice(0, 3));
    }
  }

  /*
   @Type: File, <TS>
   @Name: onResize
   @Who: Renu
   @When: 09-Feb-2021
   @Why: ROST-853
   @What: to ajust the mobile menu while resizing the screen
   */

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileMenu();
  }
}
