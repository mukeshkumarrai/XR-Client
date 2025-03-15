import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  animations: [
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class ChecklistComponent implements OnInit {
 /**********************All generic variables declarations for accessing any where inside functions********/
 public ActiveMenu: string;
 public selectedSubMenu: string;
 public sideBarMenu: string;
 public active = false;
 public submitted = false;
 public loading: boolean;
 //for pagination and sorting
 public ascIcon: string;
 public descIcon: string;
 public sortingValue: string = "Order,Name,asc";
 // who:maneesh,why:ewm.10154 fixed sorting icon,when:12/01/2023 
 public sortedcolumnName: string = 'Name';
 public sortDirection = 'asc';
 public loadingscroll: boolean;
 public formtitle: string = 'grid';
 public result: string = '';
 //public actionStatus: string = 'Add';
 public canLoad = false;
 public pendingLoad = false;
 public pageNo: number = 1;
 public pageSize;
 public viewMode: string;
 public isvisible: boolean;
 public maxCharacterLengthSubHead = 130;
 public gridView = [{ 'ID': 1, 'GroupCode': 'FOO1', 'GroupDescription': 'treee', 'IsBuiltIn': 1, 'IsActive': 1 },
 { 'ID': 2, 'GroupCode': 'FOO9', 'GroupDescription': 'test2', 'IsBuiltIn': 1, 'IsActive': 1 }]
 public auditParameter;
 public maxCharacterLength = 80;
 public maxCharacterLengthName = 40;
 public totalDataCount: number;
 public pagneNo = 1;
 public groupId = '';
 public gridData: any = [];
 searchVal: string = '';
 public loadingSearch: boolean;
 next: number = 0;
 listDataview: any[] = [];
 public pageLabel : any = "label_checklist";
 pageOption: any;  
 pageSizeOptions: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  dirctionalLang;

  public userpreferences: Userpreferences;
  getcheckListData: Subscription;
 /*
@Type: File, <ts>
@Name: constructor function
@Who: Suika
@When: 01-aug-2022
@Why: EWM-1734 EWM-7427
@What: For injection of service class and other dependencies
 */

 constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router, private route: ActivatedRoute,
   public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
   private translateService: TranslateService, private systemSettingService: SystemSettingService,
    private appSettingsService:AppSettingsService, public userpreferencesService: UserpreferencesService) {
     // page option from config file
   this.pageOption = this.appSettingsService.pageOption;
   this.pageSize = this._appSetting.pagesize;
   this.auditParameter = encodeURIComponent('checklist');
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
   this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
   this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
   this._sidebarService.activesubMenuObs.next('masterdata');
   let queryParams = this.routes.snapshot.params.id;
   this.groupId = decodeURIComponent(queryParams);
   if (this.groupId == 'undefined') {
     this.groupId = "";
   } else {
     this.groupId = decodeURIComponent(queryParams);
   }

   setInterval(() => {
     this.canLoad = true;
     if (this.pendingLoad) {
       this.onScrollDown();
     }
   }, 2000);
   this.ascIcon = 'north';
   this.getcheckList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
   /*******geting Data Via Routing*******/
   this.route.queryParams.subscribe((params) => {
     this.viewMode = params['viewModeData'];
   })
   this.switchListMode(this.viewMode);
   this.animationVar = ButtonTypes;

   this.userpreferences = this.userpreferencesService.getuserpreferences();
 }

 // refresh button onclick method by Piyush Singh
 refreshComponent(){
   this.pageNo=1;
   this.getcheckList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
    
     }


       /* 
 @Type: File, <ts>
 @Name: animate delaAnimation function
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
 @What: creating animation
*/

animate() {
 this.animationState = false;
 setTimeout(() => {
   this.animationState = true;
 }, 0);
}
delaAnimation(i:number){
 if(i<=25){
   return 0+i*80;
 }
 else{
   return 0;
 }
}

mouseoverAnimation(matIconId, animationName) {
 let amin= localStorage.getItem('animation');
 if(Number(amin) !=0){
   document.getElementById(matIconId).classList.add(animationName);
 }
}
mouseleaveAnimation(matIconId, animationName) {
 document.getElementById(matIconId).classList.remove(animationName)
}

 /*
 @Type: File, <ts>
 @Name: onScrollDown
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
 @What: To add data on page scroll.
 */

 onScrollDown(ev?) {
   this.loadingscroll = true;
   if (this.canLoad) {
     this.canLoad = false;
     this.pendingLoad = false;
     // this.pageNo = this.pageNo + 1;
     if (this.totalDataCount > this.gridData?.length) {
       this.pageNo = this.pageNo + 1;
       this.fetchChecklistMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
     } else {
       this.loadingscroll = false;
     }

   } else {
     this.pendingLoad = true;
   }
 }

 /*
  @Type: File, <ts>
  @Name: fetchIndustryMoreRecord
  @Who: Suika
  @When: 01-aug-2022
  @Why: EWM-1734 EWM-7427
  @What: To get more data from server on page scroll.
  */

 fetchChecklistMoreRecord(pageSize, pagneNo, sortingValue) {

   this.systemSettingService.getcheckListAll(pageSize, pagneNo, sortingValue, this.searchVal).subscribe(
     (repsonsedata) => {

       if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {

         this.loadingscroll = false;
         let nextgridView = [];
         nextgridView = repsonsedata['Data'];
         this.gridData = this.gridData.concat(nextgridView);
         //Removing duplicates from the concat array by Piyush Singh
         const uniqueUsers = Array.from(this.gridData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
         this.gridData = uniqueUsers;
         //console.log(this.gridData,uniqueUsers,"Data")
         // this.reloadListData();
         // this.doNext();
       } else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         this.loadingscroll = false;
       }
     }, err => {
       if (err.StatusCode == undefined) {
         this.loading = false;
       }
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       this.loadingscroll = false;
     })
 }

 /*
 @Type: File, <ts>
 @Name: switchListMode
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
 @What: To switch between card view to list view.
 */

 switchListMode(viewMode) {
   if (viewMode === 'cardMode') {
     this.viewMode = "cardMode";
     this.isvisible = true;
     this.animate();
   } else {
     this.viewMode = "listMode";
     this.isvisible = false;
     this.animate();
   }
 }

 /*@Type: File, <ts>
 @Name: onFilter function
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
 @What: use for Searching record
  */
 public onFilter(inputValue: string): void {
   this.loadingSearch = true;
   if (inputValue.length > 0 && inputValue.length < 3) {
     this.loadingSearch = false;
     return;
     
   }
   this.pageNo = 1;
   this.systemSettingService.getcheckListAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
     repsonsedata => {
       if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
         this.loadingSearch = false;
         // this.gridView = repsonsedata['Data'];
         this.gridData = repsonsedata['Data'];
         //  this.reloadListData();
         //  this.doNext();

       }
       
        else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         this.loadingSearch = false;
       }
     }, err => {
       if (err.StatusCode == undefined) {
         this.loadingSearch = false;
       }
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       this.loadingSearch = false;
     })
 }

 /*
   @Type: File, <ts>
   @Name: confirmDialog function
   @Who: Suika
   @When: 01-aug-2022
   @Why: EWM-1734 EWM-7427
   @What: FOR DIALOG BOX confirmation
 */
 confirmDialog(val, index): void {
   const id = val;
   const message = 'label_titleDialogContent';
   const title = 'label_delete';
   const subTitle = 'label_checklist';
   const dialogData = new ConfirmDialogModel(title, subTitle, message);
   const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
     maxWidth: "350px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     this.result = dialogResult;
     if (dialogResult == true) {
       this.systemSettingService.deleteChecklist(val).subscribe(
         (data: ResponceData) => {
           this.active = false;
           if (data.HttpStatusCode == 200) {
             this.pageNo = 1;
             this.searchVal = '';
             this.listDataview.splice(index, 1);
             this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
             this.getcheckList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
           } else if (data.HttpStatusCode == 400) {
             this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
             // this.getcheckList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
           } else {
             this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
           }

         }, err => {
           if (err.StatusCode == undefined) {
             this.loading = false;
           }
           this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
         })
     }
   });

   // RTL Code
   let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	

 }

 /*  setRouterclickData(groupCode:any){
     this.groupService.setgrupValue(groupCode);
   } */



 /*
@Type: File, <ts>
@Name: getcheckList function
@Who: Suika
@When: 01-aug-2022
@Why: EWM-1734 EWM-7427
@What: service call for get list for checklist data
*/

 getcheckList(pagesize, pagneNo, sortingValue, searchVal) {
   this.loading = true;
   this.getcheckListData=this.systemSettingService.getcheckListAll(pagesize, pagneNo, sortingValue, searchVal).subscribe(
     (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {       
         this.animate();         
         this.loading = false;
         this.gridData = repsonsedata?.Data;          
         this.totalDataCount = repsonsedata?.TotalRecord;
         // this.reloadListData();
         // this.doNext();
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



 /*
 @Type: File, <ts>
 @Name: short column
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427 
 @What: To short column on the basis of column name.
 */
 onSort(columnName) {
   this.loading = true;
   this.sortedcolumnName = columnName;
   this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
   this.ascIcon = 'north';
   this.descIcon = 'south';
   this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
   this.pageNo = 1;
   this.getcheckList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
 }


 setRouterclickData(IndustryDescription: any) {
   this.systemSettingService.setIndustryValue(IndustryDescription);
 }
 doNext() {
   // alert(this.gridData.length)
   if (this.next < this.gridData?.length) {
     //alert('go')
     this.listDataview.push(this.gridData[this.next++]);
   }
 }

 /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
 reloadListData() {
   this.next = 0;
   this.listDataview = [];
 }

 /*
@Name: onFilterClear function
@Who: Suika
@When: 01-aug-2022
@Why: EWM-1734 EWM-7427
@What: use Clear for Searching records
*/
public onFilterClear(): void {
 this.searchVal='';
 this.getcheckList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal);
}


    /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 20-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getcheckListData API 
*/
ngOnDestroy(): void {
  this.getcheckListData.unsubscribe();
 
 }


}




