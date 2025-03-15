
/**
   @(C): Entire Software
   @Type: ts
   @Name: auth.guard.ts
   @Who: Mukesh Kumar rai
   @When: 23-Sept-2020
   @Why: ROST-205
   @What: This file check  user authentication functions before going to page.
  */
 import {  Injectable, ViewChild, ViewContainerRef } from '@angular/core';
 import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
 import { Observable } from 'rxjs';
 import { AuthService } from '../services/auth.service';
 import { TitleService } from '../helper/title.service';

 import { SnackbarComponent } from '../snackbar/snackbar.component';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { ResponceData } from '../models/responce.model';
 import { DynamicMenuService } from '../services/commonservice/dynamic-menu.service';
 import {  ConfirmDialogModel } from '../modal/confirm-dialog/confirm-dialog.component';
 import { MatDialog } from '@angular/material/dialog';
 import { SidebarService } from '../services/sidebar/sidebar.service';
 import { InformDialogComponent } from '../modal/inform-dialog/inform-dialog.component';
 import { LoginService } from '../services/login/login.service';
 import { CommonserviceService } from '../services/commonservice/commonservice.service';

 @Injectable({
   providedIn: 'root'
 })
 export class AuthGuard implements CanActivate {
   menuData: any = [];
   accessInfo: any = [];
   activeSubMenu: string;

   menuId: any;
   activeParent: string;
   IsMenuAccess: boolean;
   IsSiteAccess: boolean;
   pageType: any;
   @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;
   currentURL: string;
   subRoute: string=''; /*@When:23-08-2023 @who: renu @why: EWM-13666 EWM-13910*/

   constructor(public authService: AuthService, public router: Router, private snackBar: MatSnackBar, private authenticationService: LoginService,
     private dynamicMenuService: DynamicMenuService, public dialog: MatDialog, public _sidebarService: SidebarService,
     private commonserviceService: CommonserviceService,
     private titleService :TitleService
     ) { }


   canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     let URL = state.url;
     this.currentURL = window.location.href;
     let menuName:string;
     let MenuLabel:string;
     let URL_AS_LIST = URL.split('/');
     this.activeParent = URL_AS_LIST[3];
     this.subRoute = URL_AS_LIST[2]; /*@When:23-08-2023 @who: renu @why: EWM-13666 EWM-13910*/
     this.authenticationService.getUrl(URL)
     //this.activeSubMenu = URL_AS_LIST[4];

     //Nitin Bhati 27th oct 21 EWM-3573 Start
     let activeSubMenutemp = URL_AS_LIST[4];

     let strActiveSubMenutemp = new String(activeSubMenutemp);
     let substr = '?';
     let index = strActiveSubMenutemp.indexOf(substr);
     if(index!=-1){
       let splitActiveSubMenutemp = strActiveSubMenutemp.split("?",1);
       this.activeSubMenu = splitActiveSubMenutemp[0];
     }else{
       let splitActiveSubMenutemp = strActiveSubMenutemp.split(";",1);
       this.activeSubMenu = splitActiveSubMenutemp[0];
     }

     //this.activeSubMenu = splitActiveSubMenutemp[0];

      // EWM-3573 End

     this._sidebarService.activesubMenuObs.next(this.activeSubMenu);
     this._sidebarService.subManuGroup.next(this.activeParent);
     let currentUser = this.authenticationService.currentUserValue;
     if (currentUser || (localStorage.getItem('menuInfo')!=undefined || localStorage.getItem('menuInfo')!=null)) {
       if (this.activeSubMenu == 'profile-setting' || this.activeSubMenu == 'dashboard') {
         this.logUserActivity(this.activeSubMenu,this.menuId,this.activeSubMenu);
        return true;
       } else {
         let res = JSON.parse(localStorage.getItem('menuInfo'));

          this.menuData = res;
         //let activeParent = this.findByMatchingProperties(this.menuData, { Name: this.activeParent });
         let activeParent =  this.findByMatchingObj(this.menuData, this.activeParent, "Children");
         if (activeParent?.length != 0) {
           //let activeSubmenu = this.findByMatchingProperties(activeParent.Children, { Name: this.activeSubMenu });
           let activeSubmenu =  this.findByMatchingObj(activeParent.Children, this.activeSubMenu, "Children");
           if (activeSubmenu?.length != 0) {
            // this.menuId = activeSubmenu[0].Id;
             //menuName=activeSubmenu[0].Name;
             this.menuId = activeSubmenu.Id;
             menuName=activeSubmenu.Name;
             MenuLabel = activeSubmenu.MenuLabel;
             this.searchEnableCheck(activeSubmenu.SearchEnable);

           } else {
            // let activeSubmenu = this.findByMatchingProperties(this.menuData, { Name: this.activeParent });
             let activeSubmenu =  this.findByMatchingObj(this.menuData, this.activeParent, "Children");
             this.menuId = activeSubmenu.Id;
             menuName=activeSubmenu.Name;
             MenuLabel = activeSubmenu.MenuLabel;
             this.searchEnableCheck(activeSubmenu.SearchEnable);

           }
           this.pageType=this.getPageTypeById(this.menuData,this.menuId).MenuType;
         } else {
           let activeSubmenuChildren;
           let activeThirdLevel;
           this.menuData.forEach(element => {
             if (element.Children?.length != 0) {
              // activeSubmenuChildren = this.findByMatchingProperties(element.Children, { Name: this.activeParent });
             // console.log("element.Children ",element.Children);
             // console.log("this.activeParent ",this.activeParent);
                activeSubmenuChildren =  this.findByMatchingObj(element.Children, this.activeParent, "Children");
               if (activeSubmenuChildren?.length != 0) {
               //  activeThirdLevel = this.findByMatchingProperties(activeSubmenuChildren.Children, { Name: this.activeSubMenu });
                 activeThirdLevel =  this.findByMatchingObj(activeSubmenuChildren.Children, this.activeSubMenu, "Children");
                 if (activeThirdLevel?.length != 0) {
                   //this.menuId = activeThirdLevel[0].Id;
                   //menuName=activeThirdLevel[0].Name;
                   this.menuId = activeThirdLevel.Id;
                   menuName=activeThirdLevel.Name;
                   MenuLabel = activeThirdLevel.MenuLabel;
                   this.searchEnableCheck(activeThirdLevel.SearchEnable);

                 }
               }
             }
           });
           this.pageType=this.getPageTypeById(this.menuData,this.menuId).MenuType;
         }
         //Priti(2-july-2021)EWM-1989
         this.logUserActivity(menuName,this.menuId,MenuLabel);
         //End EWM-1989

         return this.checkAuthentication(this.menuId,this.pageType);
       }
     }
     else{
      this.router.navigate(['/login'], { queryParams: {redirectUrl: this.currentURL}});
     }
     return false;
   }

   /*
  @Name: getPageTypeById()
  @Who: Renu
  @When: 14-Sep-2021
  @Why: EWM-2716
  @What: to get the page type from menu id
  @params: menu id,menudataArray
   */
   getPageTypeById(array, Id){
       var result;
       array.some(o => result = o.Id === Id ? o : this.getPageTypeById(o.Children || [], Id));
       return result;
   }


   /*
  @Name: logUserActivity()
  @Who: priti Srivastava
  @When: 02-July-2021
  @Why: EWM-1989
  @What: to log user active time at one page
  @params: menu id,menuName
   */
 logUserActivity(menuName:string,menuId:number,MenuLabel:string)
 {
   let data={
     SessionID: localStorage.getItem('sessionId'),
     MenuName: menuName,
     MenuID: menuId
   }
   this.commonserviceService.setTitle(MenuLabel);
   this.commonserviceService.saveUserActivity(data).subscribe(
     res=> {
       //console.log('data',res);
     }
   );
 }
   /*
  @Name: checkAuthentication()
  @Who: Renu
  @When: 04-Jun-2021
  @Why: EWM-1727
  @What: Get access realted info based on param passed with return type boolean
  @params: menu id
  */

   async checkAuthentication(menuId,pageType): Promise<boolean> {
     const resdata = await this.dynamicMenuService.getAccessRole(menuId,pageType).then((response: ResponceData) => {
       if (response.HttpStatusCode === 200) {
         this.accessInfo = response.Data;
         if (this.accessInfo.IsSiteAccess == true) {
           if (this.accessInfo.IsMenuAccess == false) {
            this.router.navigate(['./client/' + this.subRoute+'/'+this.activeParent + '/access-denied']);/*@When:23-08-2023 @who: renu @why: EWM-13666 EWM-13910*/
             sessionStorage.setItem("LastmenuSelect", this.activeSubMenu);
             return true;

           }

           else {
             this.commonserviceService.setPermissionsInfo(response.Data.AccessLevel);
             return true;
           }

         } else if( this.accessInfo==null ){
           this.router.navigate(['./client/core/' + this.activeParent + '/access-denied']);
           sessionStorage.setItem("LastmenuSelect", this.activeSubMenu);
           return true;
         }
         else {
           this.openConfirmDialog();
           return false;
         }
       }else{
         // this.router.navigate(['/login'], { queryParams: {redirectUrl: this.currentURL}});
        this.authenticationService.logout(false);
       }
     });
     return resdata;
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
  @Name:openConfirmDialog()
  @Who: Renu
  @When: 04-Jun-2021
  @Why: EWM-1727
  @What: to open dialog box in case of siteAccess false
  */
   openConfirmDialog() {
     const message = `label_titleDialogContentRevoke`;
     const title = 'label_subtittleRevoke';
     const subTitle = 'label_linkRevoke';
     const dialogData = new ConfirmDialogModel(title, subTitle, message);
     const dialogRef = this.dialog.open(InformDialogComponent, {
       maxWidth: "350px",
       data: dialogData,
       panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     });
     dialogRef.afterClosed().subscribe(dialogResult => {
       if (dialogResult == true) {

       }
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
     let snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
       panelClass: [className],
       duration: 5000,
       horizontalPosition: 'end',
       verticalPosition: 'bottom',
       data: {
         html: message
       }
     });
     snackBarRef.afterDismissed().subscribe(() => {
     });
   }


 /* @Name: findByMatchingObj()
 @Who: Suika
 @When: 26-Jun-2021
 @Why: EWM-1908
 @What: Get all menu realted data in nested array
 @params: menu data array data data object to be searched
 */
 findByMatchingObj(menuData, menuName, Key) {
   //console.log("menuData ",menuData);
   //console.log("menuName ",menuName);
   if(menuData?.length == 0 || menuData?.length==undefined) return
   return menuData.find(d => d.Name == menuName)
       || this.findByMatchingObj(menuData.flatMap(d => d[Key] || []), menuName,Key)
       || []
 }

 /*
  @Name: searchEnableCheck()
 @Who: Renu
 @When: 14-Nov-2021
 @Why: EWM-3735
 @What:  set value in observale for searcheanble
 @params: searchData:any
 */
 searchEnableCheck(searchData:any){
   if(searchData==1)
   {
     this._sidebarService.searchEnable.next('1');
   }
  else
   {
   this._sidebarService.searchEnable.next('0');
   }
 }

 }


