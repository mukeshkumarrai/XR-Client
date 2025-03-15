import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { Industry } from '../industry/model/industry';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-customer-master',
  templateUrl: './customer-master.component.html',
  styleUrls: ['./customer-master.component.scss'],
  animations: [
    trigger("flyInOut", [
      state("in", style({ transform: "translateX(0)" })),
      transition("void => *", [
        animate(
          '100ms',
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ]),
      transition("* => void", [
        animate(
          300,
          keyframes([
            style({ opacity: 1, transform: 'translateX(100%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 })
          ])
        )
      ])
    ]),
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class CustomerMasterComponent implements OnInit {
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
public sortingValue: string = "TypeName,asc";
public sortedcolumnName: string = 'TypeName';
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
public maxCharacterLength=80;
public maxCharacterLengthName=40;
public totalDataCount: number;
public pagneNo = 1;
public groupId='';
public gridData: any =[];
searchVal: string = '';
public loadingSearch: boolean;
public userpreferences: Userpreferences;
next: number = 0;
listDataview: any[] = [];
public pageLabel : any = "label_customer_type";

// animate and scroll page size
pageOption: any;
animationState = false;
// animate and scroll page size
animationVar: any;
public isCardMode:boolean = false;
public isListMode:boolean = true;
dirctionalLang;
searchSubject$ = new Subject<any>();
  customerData: Subscription;

/* 
@Type: File, <ts>
@Name: constructor function
@Who: Suika
@When: 19-June-2021
@Why: ROST-1904
@What: For injection of service class and other dependencies
*/

 constructor(public dialog: MatDialog, private snackBService: SnackBarService, private router: Router,private route: ActivatedRoute,
   public _sidebarService: SidebarService, private _appSetting: AppSettingsService,private routes: ActivatedRoute,
   private translateService: TranslateService, private systemSettingService: SystemSettingService,
   public _userpreferencesService: UserpreferencesService, private appSettingsService:AppSettingsService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
     this.pageSize = this._appSetting.pagesize;
     this.auditParameter=encodeURIComponent('Customer Type'); 
    }

 ngOnInit(): void {
   let URL = this.router.url;
 //  let URL_AS_LIST = URL.split('/');
 let URL_AS_LIST;
 if(URL.substring(0, URL.indexOf("?"))==''){
  URL_AS_LIST = URL.split('/');
 }else
 {
  URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
 }
   this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
   this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);   
   this._sidebarService.activesubMenuObs.next('masterdata');
   let queryParams = this.routes.snapshot.params.id;
     this.groupId=decodeURIComponent(queryParams);
     if(this.groupId=='undefined'){
       this.groupId="";
     }else{
       this.groupId=decodeURIComponent(queryParams);
     }

     setInterval(() => {
       this.canLoad = true;
       if (this.pendingLoad) {
         this.onScrollDown();
       }
     }, 2000);
     this.ascIcon = 'north';
     this.customerList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
      /*******geting Data Via Routing*******/
   this.route.queryParams.subscribe((params) => {     
     this.viewMode = params['viewModeData'];
      })
      this.switchListMode(this.viewMode);

      this.userpreferences = this._userpreferencesService.getuserpreferences();
      this.animationVar = ButtonTypes;
                  //  who:maneesh,what:ewm-12630 for apply 204 case  when search data,when:06/06/2023
                  this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
                    this.loadingSearch = true;
                    this.customerList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
                  });
 }


 /* 
  @Type: File, <ts>
  @Name: animate delaAnimation function
  @Who: Amit Rajput
  @When: 19-Jan-2022
  @Why: EWM-4368 EWM-4526
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

 /*
 @Type: File, <ts>
 @Name: onScrollDown 
 @Who: Suika
 @When: 19-June-2021
 @Why: EWM-1904
 @What: To add data on page scroll.
 */

onScrollDown(ev?) {
 this.loadingscroll = true;
 if (this.canLoad) {
   this.canLoad = false;
   this.pendingLoad = false;
   this.pageNo = this.pageNo + 1;
   if (this.totalDataCount > this.gridData.length) {
     this.pageNo = this.pageNo + 1;
     this.fetchCustomerMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
   }else{
     this.loadingscroll = false;
   }
 
 } else {
   this.pendingLoad = true;
 }
}

/*
@Type: File, <ts>
@Name: fetchCustomerMoreRecord
@Who: Suika
@When: 19-June-2021
@Why: EWM-1904
@What: To get more data from server on page scroll.
*/

fetchCustomerMoreRecord(pageSize, pagneNo, sortingValue) {

 this.systemSettingService.getCustomerAll(pageSize, pagneNo, sortingValue, this.searchVal).subscribe(
   (repsonsedata) => {

     if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') { 
       this.loadingscroll = false;
       let nextgridView = [];
       nextgridView = repsonsedata['Data'];
       this.gridData = this.gridData.concat(nextgridView);
       //Removing duplicates from the concat array by Piyush Singh
       const uniqueUsers = Array.from(this.gridData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
       this.gridData = uniqueUsers;
       
      //  this.reloadListData();
      //  this.doNext();
     } else {
       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
       this.loadingscroll = false;
     }
   }, err => {
     if(err.StatusCode==undefined)
     {
       this.loading=false;
     }
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     this.loadingscroll = false;
   })
}

// refresh button onclick method by Piyush Singh
refreshComponent(){
  this.pageNo=1;
  this.customerList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
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
@Name: switchListMode 
@Who: Suika
@When: 21-June-2021
@Why: EWM-1904
@What: To switch between card view to list view.
*/

switchListMode(viewMode) {
 if (viewMode === 'cardMode') {
   this.isCardMode = true;
   this.isListMode = false;
   this.viewMode = "cardMode";
   this.isvisible = true;
   this.animate();
 } else {
   this.isCardMode = false;
   this.isListMode = true;
   this.viewMode = "listMode";
   this.isvisible = false;
   this.animate();
 }
}

/*@Type: File, <ts>
@Name: onFilter function
@Who: Suika
@When: 21-June-2021
@Why: EWM-1904
@What: use for Searching record
*/
      //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
      onFilter(value){
        if (value.length > 0 && value.length < 3) {
            return;
        }
       this.loadingSearch = true;
       this.pageNo = 1;
       //  who:maneesh,what:ewm-12630 for apply debounce when search data,when:08/06/2023
         this.searchSubject$.next(value);
       }
       // comment this who:maneesh,what:ewm-12630 for apply debounce when search data,when:06/06/2023
       
// public onFilter(inputValue: string): void {
//  this.loadingSearch = false;
//  if(inputValue.length>0 && inputValue.length<3)
// {
//   return;
// }
// this.pageNo = 1;
// this.systemSettingService.getCustomerAll(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
//   repsonsedata => {
//     if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
//       this.loadingSearch = false;
//      // this.gridView = repsonsedata['Data'];
//       this.gridData = repsonsedata['Data'];
//       // this.reloadListData();
//       // this.doNext();
//     } else {
//       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
//       this.loadingSearch = false;
//     }
//   }, err => {
//     if(err.StatusCode==undefined)
//     {
//       this.loadingSearch=false;
//     }
//     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
//     this.loadingSearch = false;
//   })
// }

/*
 @Type: File, <ts>
 @Name: confirmDialog function
 @Who: Suika
 @When: 21-June-2021
 @Why: ROST-1904
 @What: FOR DIALOG BOX confirmation
*/
 confirmDialog(val,index): void {
   const id = val;
   const message = 'label_titleDialogContent';
   const title = 'label_delete';
   const subTitle = 'label_customer';
   const dialogData = new ConfirmDialogModel(title, subTitle, message);
   const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
     maxWidth: "350px",
     data: dialogData,
     panelClass: ['custom-modalbox', 'animate__animated','animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(dialogResult => {
     this.result = dialogResult;
     if (dialogResult == true) {
       this.systemSettingService.deleteCustomerById('?id=' + id).subscribe(
         (data: Industry) => {
           this.active = false;
           if (data.HttpStatusCode == 200) {   
             this.pageNo = 1;
             this.searchVal='';   
             this.listDataview.splice(index, 1);         
             this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
             this.customerList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
           }else  if(data.HttpStatusCode == 400) {                   
             this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
           }else {
             this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
           }
          
         }, err => {
           if(err.StatusCode==undefined)
           {
             this.loading=false;
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
@Name: customerList function
@Who: Suika
@When: 21-June-2021
@Why: ROST-1904
@What: service call for get list for customer data
*/

customerList(pagesize, pagneNo, sortingValue,searchVal) {
 this.loading = true;
 this.customerData=this.systemSettingService.getCustomerAll(pagesize, pagneNo, sortingValue,searchVal).subscribe(
   (repsonsedata: Industry)  => {
     if (repsonsedata.HttpStatusCode ===200) {
      this.animate();
       this.loading = false; 
       this.loadingSearch = false;
       this.gridData = repsonsedata.Data;
       this.totalDataCount = repsonsedata.TotalRecord;
      //  this.reloadListData();
      //  this.doNext();
              //  who:maneesh,what:ewm-12630 for apply debounce and handel 204 ,when:08/06/2023
            }else if(repsonsedata['HttpStatusCode'] ===204){
              this.loading = false;
              this.loadingSearch = false;
              this.gridData = repsonsedata?.Data;          
            } else {
       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
       this.loading = false;
       this.loadingSearch = false;
     }
   }, err => {
     if(err.StatusCode==undefined)
     {
       this.loading=false;
       this.loadingSearch = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     }
   })
}



/*
@Type: File, <ts>
@Name: short column
@Who:  Suika
@When: 21-June-2021
@Why: EWM-1904.
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
this.customerList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
}

doNext() {

  if (this.next < this.gridData.length) {
    //alert('go')
    this.listDataview.push(this.gridData[this.next++]);
  }
}

/*
@Name: onFilterClear function
@Who: Nitin Bhati
@When: 19-Dec-2021
@Why: EWM-2274
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchVal='';
  this.customerList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
}
   /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
   reloadListData() {
    this.next=0;
    this.listDataview=[];
  }



      /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 19-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the customerData API 
*/
ngOnDestroy(): void {
  this.customerData.unsubscribe();
 
 }
}




