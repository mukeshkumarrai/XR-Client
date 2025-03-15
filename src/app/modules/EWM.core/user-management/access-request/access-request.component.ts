/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 15-Dec-2020
  @Why: ROST-487
  @What:  This page will be use for the sms template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserManagmentService } from '../../shared/services/user-management/user-managment.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { Userpreferences } from '../../../../shared/models/index';
import * as moment from 'moment';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  providers: [MessageService],
  selector: 'app-access-request',
  templateUrl: './access-request.component.html',
  styleUrls: ['./access-request.component.scss'],
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
export class AccessRequestComponent implements OnInit {

  /****************Decalaration of Global Variables*************************/
  status: boolean = false;
  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  private rtl = false;
  private ltr = true;
  public listData: any[];
  public isNew = false;
  public pageSizes = true;
  public previousNext = true;
  public pageSize = 5;
  public listView: any[];
  public type: 'numeric' | 'input' = 'numeric';
  public info = true;
  public buttonCount = 5;
  public mySelection: string[] = [];
  public formtitle: string = 'grid';
  public active = false;
  utcDateTime: any;

  addUserSmsForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public opened = false;
  public usergrpList = [];
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  viewMode: string = "listMode";
  public personTag: string = '';
  public jobTag: string = '';
  public smstemplate: string = '';
  @Input() name: string;
  searchChar: string;
  result: string = '';
  public smstemplateDescriptuion: string = '';
  ckeConfig: any;
  show = false;
  showMore: boolean;
  showLess = false;
  divId;
  //public activestatus: string;
  activestatus: string = 'Add';
  smsById;
  canLoad = false;
  pendingLoad = false;
  public totalDataCount: number;
  public totalPage: number;
  pagesize;
  pagneNo = 1;
  loadingscroll: boolean;
  public ascIcon = 'north';
  descIcon = 'south';
  sortingValue: string = "";
  public sortedcolumnName: string = 'RequestedDate';
  public sortDirection = 'asc';
  isvisible: boolean;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  private targetInput = 'Description';
  public searchValue: string = "";
  public maxCharacterLengthSubHead = 130;
  public userpreferences: Userpreferences;
  public peopleList: any=[];
  public supplierList: any=[];
  public clientList: any=[];
  public activeTab="People";
  totalpeopleCount: number;
  totalclientCount: number;
  totalsupplierCount: number;
  selectedIndexTab: number;  
  nextPeople: number = 0;
  listDataviewPeople: any[] = [];
  nextClient: number = 0;
  listDataviewClient: any[] = [];
  nextSupplier: number = 0;
  listDataviewSupplier: any[] = [];
  client:any;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  positionMatTab: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  public loadingSearch:boolean=false;
  searchSubject$ = new Subject<any>(); 
  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 14-Dec-2020
  @Why: ROST-487
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private _UserManagmentService: UserManagmentService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private textChangeLngService:TextChangeLngService,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public _userpreferencesService: UserpreferencesService,public activateroute:ActivatedRoute,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, public router: Router) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;

    this.utcDateTime = '2021-04-13T04:56:37.374549';
    let local_date = moment.utc(this.utcDateTime).local().format('YYYY-MM-DD HH:mm:ss a');
    this.searchChar = '';
    this.totalDataCount = 0;
    this.totalPage = 0;
  }
  /*
 @Type: File, <ts>
 @Name: ngOnInit function
 @Who: Nitin Bhati
 @When: 14-Dec-2020
 @Why: ROST-487
 @What: For calling
 */
  ngOnInit(): void {    

    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
      URL_AS_LIST = URL.split('/');
     }else
     {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
     }

       /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
       this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
       //
       
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.ListAccessRequest(this.pagneNo, this.sortingValue, this.searchChar,this.activeTab);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     },err =>{
       this.loading = false;
     })
     this.activateroute.queryParams.subscribe((params) => {
      if(Object.keys(params).length!=0){
       this.viewMode = params['mode'];
       this.activeTab=params['tab'];
       if( this.activeTab=='People'){
        this.selectedIndexTab=0;
       }else if(this.activeTab=='Client'){
        this.selectedIndexTab=1;
       }else{
        this.selectedIndexTab=2;
       }
      }
     });
     this.switchListMode(this.viewMode);
     this.animationVar = ButtonTypes;

     

      this.commonserviceService.onUserLanguageDirections.subscribe(res => {
        this.positionMatTab=res;
      });

        // @suika @EWM-14427 @Whn 27-09-2023
        this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
          this.loading = true;
          this.loadingSearch = true;
           this.sendRequest(val);
           });
  }
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    },err=>{
      this.loading = false;
    })
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
   @Name: userSmsList function
   @Who: Nitin Bhati
   @When: 25-Dec-2020
   @Why: ROST-488
   @What: service call for creating Sms data
   */
  ListAccessRequest(pagneNo?: number, orderBy?: string, searchVal?: string,activeTab?:string) {
    this.loading = true;
    this._UserManagmentService.getListAccessRequest(pagneNo, this.pagesize, orderBy, searchVal,activeTab).subscribe(
      (Responce: ResponceData) => {
        if (Responce.HttpStatusCode == Number('200')) {
          this.animate();
          this.loading = false;
          this.loadingSearch = false;
          if(activeTab=='People')
          {
            this.peopleList = Responce.Data;
            this.totalpeopleCount = Responce.TotalRecord;
          }else if(activeTab=='Client'){
            this.clientList = Responce.Data;
            this.totalclientCount = Responce.TotalRecord;
          }else{
            this.supplierList = Responce.Data;
            this.totalsupplierCount = Responce.TotalRecord;
            this.reloadListDataSupplier();
            this.doNextSupplier();
          }  
        } else {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(Responce.Message), String(Responce.HttpStatusCode));
         
        }
      }, err => {       
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }

  /**
      @(C): Entire Software
      @Type: Function
      @Who: Satya Prakash
      @When: 15-Dec-2020
      @Why:  Switch mode List and card
      @What: This function responsible to change list and card view
     */
  // switchListMode(viewMode) {
  //   if (viewMode === 'cardMode') {
  //     this.viewMode = "cardMode";
  //     this.isvisible = true;
  //     this.animate();
  //   } else {
  //     this.viewMode = "listMode";
  //     this.isvisible = false;
  //     this.animate();
  //   }
  // }
  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
     if(viewMode==='cardMode'){
       this.isCardMode = true;
       this.isListMode = false;
       this.viewMode = "cardMode";
       this.isvisible = true;
       this.animate();
     }else{
      this.isCardMode = false;
      this.isListMode = true;
       this.viewMode = "listMode";
       this.isvisible = false;
       this.animate();
       //listHeader.classList.remove("hide");
     }
   }


  /*
   @Type: File, <ts>
   @Name: onScrollDown function
   @Who: Renu
   @When: 30-Dec-2020
   @Why: ROST-485
   @What: for pagination whenever user scroll down
   */

  onScrollDown(ev?) {
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      // Append elements
      if(this.activeTab=='people'){
        if (this.totalDataCount > this.peopleList.length) {
          this.pagneNo = this.pagneNo + 1;
          this.getScrollData(this.pagneNo, this.sortingValue,this.activeTab);
        }
      }
        else if(this.activeTab=='client'){
         if (this.totalDataCount > this.clientList.length) {
          this.pagneNo = this.pagneNo + 1;
          this.getScrollData(this.pagneNo, this.sortingValue,this.activeTab);
        }
        }
        else{  
          if (this.totalDataCount > this.supplierList.length) {
            this.pagneNo = this.pagneNo + 1;
            this.getScrollData(this.pagneNo, this.sortingValue,this.activeTab);
          }
        }

    } else {
      this.pendingLoad = true;
    }
  }
  /*
  @Type: File, <ts>
  @Name: userSmsList function
  @Who: Nitin Bhati
  @When: 25-Dec-2020
  @Why: ROST-488
  @What: service call for creating Sms data
  */
  getScrollData(pagneNo?: number, orderBy?: string,activeTab?:string) {
    this.loadingscroll = true;
    this._UserManagmentService.getListAccessRequest(pagneNo, this.pagesize, orderBy, this.searchChar,activeTab).subscribe(
      (Responce: ResponceData) => {
        if (Responce.HttpStatusCode == Number('200')) {
          this.loadingscroll = false;
          // this.listView = Responce.Data;
          // this.totalDataCount = Responce.TotalRecord;
          // this.totalPage = Math.ceil(this.totalDataCount / 2);
          // this.listData = Responce.Data;
         // this.listData=this.listData.concat(Responce.Data);
          // this.listData.push(Responce.Data);
          let nextgridView = [];
          nextgridView = Responce.Data;  
            if(this.activeTab=='people'){
            this.peopleList= this.peopleList.concat(nextgridView);
            // this.reloadListDataPeople();
            // this.doNextPeople();
            }
            else if(this.activeTab=='client'){
             this.clientList = this.clientList.concat(nextgridView);
            //  this.reloadListDataClient();
            //  this.doNextClient();
            }
            else{  
              this.supplierList = this.supplierList.concat(nextgridView);
              this.reloadListDataSupplier();
              this.doNextSupplier();
            }
        
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(Responce.Message), String(Responce.HttpStatusCode));
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }



    // @suika @EWM-14427 @Whn 27-09-2023
    public onFilter(inputValue: string): void {
       this.searchChar = inputValue;
       this.searchValue = inputValue;
        if (inputValue?.length > 0 && inputValue?.length <= 2) {
          this.loading = false;
          return;
        }
        this.searchSubject$.next(inputValue);
      }


/*
@Name: onFilterClear function
@Who: Suika
@When: 27-Sept-2023
@Why: EWM-14427
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchChar='';
  this.searchValue = '';
  this.ListAccessRequest(1, '', this.searchChar,this.activeTab);
}

  sendRequest(value) {
    this.searchChar = value;
    if ( this.searchChar.length > 0 &&  this.searchChar.length < 3) {
      this.loading = false;
      this.loadingSearch = false;
      return;
    }else{
      this.ListAccessRequest(1, '', this.searchChar,this.activeTab);
    
    }   
  }
  /*
    @Type: File, <ts>
    @Name: onSort function
    @Who: Mukesh
    @When: 14-April-2020
    @Why: EWM-1320
    @What: This function is used for sorting asc /desc based on column Clicked
    */

  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';

    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    this._UserManagmentService.getListAccessRequest(this.pagneNo, this.pagesize, this.sortingValue, this.searchChar,this.activeTab).subscribe(
      (Responce: ResponceData) => {
        if (Responce.HttpStatusCode == Number('200')) {

          this.loading = false;
         // this.listView = Responce.Data;
         // this.listData = Responce.Data;
          if(this.activeTab=='People')
          {
            this.peopleList = Responce.Data;
            this.totalpeopleCount = Responce.TotalRecord;
            // this.reloadListDataPeople();
            // this.doNextPeople();
          }else if(this.activeTab=='Client'){
            this.clientList = Responce.Data;
            this.totalclientCount = Responce.TotalRecord;
            // this.reloadListDataClient();
            // this.doNextClient();
          }else{
            this.supplierList = Responce.Data;
            this.totalsupplierCount = Responce.TotalRecord;
            this.reloadListDataSupplier();
            this.doNextSupplier();
          }
  
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(Responce.Message), String(Responce.HttpStatusCode));
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  accessGrant(id) {
    this.router.navigate(['./client/core/user-management/access-request/access-requestmanage/' + id], 
    {queryParams: {mode: this.viewMode,tab:this.activeTab}});
  }

/*
    @Type: File, <ts>
    @Name: ActiveTab function
    @Who: Renu
    @When: 29-May-2021
    @Why: EWM-1645
    @What: This function is used for getting active tab value and filter data accordingly
    */
  ActiveTab(tabIndex){
  this.searchValue='';
  this.searchChar='';
    if(tabIndex.index==1)
    {
        this.activeTab='Client';
    }else if(tabIndex.index==2)
    {
      this.activeTab='Supplier';
    }else{
      this.activeTab='People';
    }
    this.ListAccessRequest(this.pagneNo, this.sortingValue, this.searchChar,this.activeTab);
  }

  /*
    @Type: File, <ts>
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

 reloadApiBasedOnorg(){
  this.ListAccessRequest(this.pagneNo, this.sortingValue, this.searchChar,this.activeTab);
}



// doNextPeople() {
//   if (this.nextPeople < this.peopleList.length) {
//     this.listDataviewPeople.push(this.peopleList[this.nextPeople++]);
//   }
// }

//  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
//  reloadListDataPeople() {
//   this.nextPeople=0;
//   this.listDataviewPeople=[];
// }

// doNextClient() {
//   if (this.nextClient < this.clientList.length) {
//     this.listDataviewClient.push(this.clientList[this.nextClient++]);
//   }
// }

//  /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
//  reloadListDataClient() {
//   this.nextClient=0;
//   this.listDataviewClient=[];
// }


doNextSupplier() {
  if (this.nextSupplier < this.supplierList.length) {
    this.listDataviewSupplier.push(this.supplierList[this.nextSupplier++]);
  }
}

 /**@what: for clearing and reload issues @by: suika on @date: 03/07/2021 */
 reloadListDataSupplier() {
  this.nextSupplier=0;
  this.listDataviewSupplier=[];
}
// refresh button onclick method by Adarsh Singh
refreshComponent(){
  this.ListAccessRequest(this.pagneNo, this.sortingValue, this.searchChar,this.activeTab);
}
}
