import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public loadingscroll: boolean;
  public formtitle: string = 'grid';
  //public actionStatus: string = 'Add';
  public canLoad = false;
  public viewMode: string;
  public isvisible: boolean;
  public auditParameter;

  searchVal: string = '';
  public loadingSearch: boolean;

  public menuCount: any = [];
  public menuCountArray: any = [];
  public favMenuList: any = [];
  menuData: any = [];
  submenu: any = [];
  groupName: any = [];
  distinctGroupName: any = [];
  gridArray: any = [];
  menuArray: any = [];// Jobsetting;
  toggelGroup:string='';
  isStarActive:any = [];
  isMore:any;
  ActiveMenu;
  mcount:number = 0;
  //@ViewChild('star_') star: ElementRef;
  constructor(private router: ActivatedRoute, private route: Router, private appSettingsService: AppSettingsService,
    private systemSettingService: SystemSettingService, private snackBService: SnackBarService, private translateService: TranslateService) {
      this.mcount = this.appSettingsService.menuMoreConfig;
  }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.getFavouriteMenuList();
    this.renderMenuData(this.toggelGroup);    
    this.ActiveMenu = URL_AS_LIST[3];
    //console.log('this.ActiveMenu ', this.ActiveMenu)
  }


  renderMenuData(groupdata) {
    let res = JSON.parse(localStorage.getItem('menuInfo'));
    let activeSubmenuChildren;
    let activeThirdLevel;
    let menu: any = [];
    this.menuData = res;
    this.menuData.forEach(element => {
      if (element.Children.length != 0) {
        activeSubmenuChildren = this.findByMatchingProperties(element.Children, { Name: "custom" });
        if (activeSubmenuChildren.length != 0) {
          this.submenu.push(activeSubmenuChildren);
          activeThirdLevel = this.findByMatchingProperties(activeSubmenuChildren[0]['Children'], { Name: "profile" });
        }
      }
    });

    this.submenu.forEach(element => {
      for (let i = 0; i <= element[0].Children.length; i++) {
        if (element[0].Children[i]) {
          element[0].Children[i]['isfavourite'] = 0;
          this.gridArray.push(element[0].Children[i]);
          this.groupName.push(element[0].Children[i].GroupName);
        }
      }
    })


    this.distinctGroupName = this.groupName.filter((n, i) => this.groupName.indexOf(n) === i);
    let data;
    this.distinctGroupName.forEach((item) => {
      data = this.getNestedChildren(this.gridArray, item);
      this.menuArray[item] = data;   
      this.menuCount[item] = this.appSettingsService.menuMoreConfig;  
    });
  }


  onScrollDown() {

  }


  /*
@Name: findByMatchingProperties()
@Who: Renu
@When: 04-Jun-2021
@Why: EWM-1727
@What: Get all menu realted data object based on param
@params: menu data array data data object to be searched
*/

  findByMatchingProperties(set, properties) {
    return set.filter(function (entry) {
      return Object.keys(properties).every(function (key) {
        return entry[key] === properties[key];
      });
    });
  }


  /*
@Name: getNestedChildren()
@Who: Suika
@When: 26-Jun-2021
@Why: EWM-1908
@What: Get all menu realted data in nested array
@params: menu data array data data object to be searched
*/

  getNestedChildren(gridArray, parent) {
    var newGridArray = []
    for (var i in gridArray) {
      if (gridArray[i].GroupName == parent) {
        var children = this.getNestedChildren(gridArray, gridArray[i].id)
        if (children.length) {
          gridArray[i].children = children
        }
        newGridArray.push(gridArray[i])
      }
    }
    return newGridArray
  }




  goToPage(routePath) {
    this.route.navigate(['./client/core/' + this.ActiveMenu + '/' + routePath]);
  }

  viewMore(menuKey) {
    this.menuCount[menuKey] = this.menuArray[menuKey].length+1;
  }
  viewLess(menuKey) {
    this.menuCount[menuKey] = this.appSettingsService.menuMoreConfig;
  }

  makeFavourite(MenuLabel, MenuId, IsFavourite,groupdata) {    
    if(IsFavourite==0){
      this.isStarActive[MenuId]=1;
    }else{
      this.isStarActive[MenuId]=0;     
    }  
    let menusFavouriteObj = {};
    menusFavouriteObj['MenuLabel'] = MenuLabel;
    menusFavouriteObj['MenuId'] = MenuId;
    menusFavouriteObj['IsChecked'] = this.isStarActive[MenuId];
    this.systemSettingService.updateFavouritMenu(menusFavouriteObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
             
        this.reloadMenuData(MenuId,groupdata);
        this.loading = false;

      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.loading = false;
      }
      else {
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.loading = false;
      });

  }

  getFavouriteMenuList() {
    this.systemSettingService.getFavouritMenuList().subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == 200 || repsonsedata.HttpStatusCode == 204) {
        this.favMenuList = repsonsedata.Data;
        this.favMenuList.forEach((favArr) => {
          this.markfavourite(this.gridArray, favArr);
        })
        this.loading = false;

      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

  }


  markfavourite(menuList, favArr) {
    var out = []
    for (var i in menuList) {
      if (menuList[i].Id == favArr.MenuId) {
        menuList[i].isfavourite = 1;
        out.push(menuList[i])
      }
    }
    return out
  }

  reloadMenuData(MenuId,groupdata) { 
    let selectedMenuArray =  this.menuArray[groupdata].filter(x => x['Id'] === MenuId);
    selectedMenuArray.forEach(element => {
      element['isfavourite'] = this.isStarActive[MenuId];
    }); 
  }
}
