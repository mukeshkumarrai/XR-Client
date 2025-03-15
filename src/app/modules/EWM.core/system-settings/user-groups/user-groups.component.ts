/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 20-Nov-2020
  @Why: ROST-404
  @What:  This page will be use for the User Groups Component ts file
*/

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { ValidateCode } from '../../../../shared/helper/commonserverside';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { ContactReceipentPopupComponent } from '../../shared/contact-receipent-popup/contact-receipent-popup.component';
import { UserEmails } from '../user-invitation/user-invitation.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { Industry } from '../industry/model/industry';
import { ResponceData,Userpreferences } from 'src/app/shared/models';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';

@Component({
  providers: [MessageService],
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss'],
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
            style({ opacity: 1, transform: "translateX(0)", offset: 0 }),
            style({ opacity: 1, transform: "translateX(-15px)", offset: 0.7 }),
            style({ opacity: 0, transform: "translateX(100%)", offset: 1.0 })
          ])
        )
      ])
    ]),
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
  ]
})
export class UserGroupsComponent implements OnInit {

  /****************Decalaration of Global Variables*************************/
  status: boolean = false;
  submitted = false;
  loading: boolean;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
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
  isvisible: boolean;
  addUserGroupForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public opened = false;
  public usergrpList = [];
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  sortingDown: boolean = true;
  sortingUp: boolean = false;
  sortingDownNext: boolean = true;
  sortingUpNext: boolean = false;
  sortingUpDown: string = 'asc';
  show = false;
  showMore: boolean;
  showLess = false;
  divId;
  //public activestatus: string;
  activestatus: string = 'Add';
  smsById;
  viewMode: string = "listMode";
  loadingscroll: boolean;
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "name,asc";
  public sortedcolumnName: string = "name";
  public sortDirection = 'asc';
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  searchVal: string;
  public gridData: any[];
  groupId: any[];
  public maxCharacterLengthSubHead = 250;
  totalDataCount: any;
  next: number = 0;
  listDataview: any[] = [];
  userEmail: UserEmails[] = [];
  public usersList = [];
  tabActive: string = 'people';
  isShowUserKeyword: boolean = false;
  removable = true;  
  public result: string = '';
  public auditParameter;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  isCheckBoxDisableStatus: boolean=false;
  FormStatus:string="List";
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  dirctionalLang;
  searchSubject$ = new Subject<any>(); 
  public userpreferences: Userpreferences;
  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Renu
  @When: 20-Nov-2020
  @Why: ROST-404
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private messages: MessageService,
    private appSettingsService: AppSettingsService, private translateService: TranslateService,public _userpreferencesService: UserpreferencesService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    this.auditParameter=encodeURIComponent('User Groups'); 
    this.addUserGroupForm = this.fb.group({
      GroupId: [''],
      Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]],
      Description: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2)]],
      eMails: [''],
      isMember: [false]
    })

  }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.searchVal = '';
    this.userGroupList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);

    this.ascIcon = 'north';
    this.FormStatus="List";
    
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.animationVar = ButtonTypes;


      // @suika @EWM-14427 @Whn 27-09-2023
      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        this.loading = true;
         this.sendRequest(val);
         });
  }
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd, this.search, res);
    })
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

  public addHandler() {
    this.isNew = true;
  }
  public editHandler({ dataItem }) {

    this.isNew = false;
  }

 
 
  /* 
  @Type: File, <ts>
  @Name: onCancel function
  @Who: Renu
  @When: 25-Nov-2020
  @Why: ROST-404,ROST-405
  @What: FOR closing the form on button click event
  */
  public onCancel(e): void {
    this.FormStatus = 'List';
    this.formtitle = 'grid';
    this.active = true;
    this.addUserGroupForm.reset();
    this.activestatus = 'Add';
    this.usersList = [];
    this.isShowUserKeyword = false;
    
    // this.opened = false;
    // e.preventDefault();
    // this.closeForm();
  }
  /* 
  @Type: File, <ts>
  @Name: closeForm function
  @Who: Renu
  @When: 25-Nov-2020
  @Why: ROST-404,ROST-405
  @What: FOR closing the form on button click event
  */
  private closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }

 
 

  /* 
  @Type: File, <ts>
  @Name: userGroupList function
  @Who: Renu
  @When: 25-Nov-2020
  @Why: ROST-405
  @What: service call for creating groups data
  */

  userGroupList(pagesize, pagneNo, orderBy, searchVal) {
    this.loading = true;
    this.systemSettingService.fetchuserGrupList(pagesize, pagneNo, orderBy, searchVal).subscribe(
      repsonsedata => {

        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.animate();
          this.loading = false;
          /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount = repsonsedata['TotalRecord'];
          this.listView = repsonsedata['Data'];
          this.listData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }




    // @suika @EWM-14427 @Whn 27-09-2023
      public onFilter(inputValue: string): void {
       this.searchVal = inputValue;
        if (this.searchVal?.length > 0 && this.searchVal?.length <= 2) {
          this.loading = false;
          return;
        }
        this.searchSubject$.next(inputValue);
      }
  /* 
  @Type: File, <ts>
  @Name: onFilter function
  @Who: Renu
  @When: 25-Nov-2020
  @Why: use for filter data.
  @What: .
   */
  public sendRequest(inputValue: string): void {
    this.loading = false;
    if (inputValue.length >= 3) {
      this.systemSettingService.searchGrupList(inputValue).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == 204) {
            this.loading = false;
            this.listData = repsonsedata['Data'];
            // this.reloadListData();
            // this.doNext();

          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
    } else {
      this.pagneNo = 1;
      // this.searchVal = '';
      this.systemSettingService.fetchuserGrupList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
            this.loading = false;
            this.listView = repsonsedata['Data'];
            this.listData = repsonsedata['Data'];
            // this.reloadListData();
            // this.doNext();
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })

    }
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
    //   let listHeader = document.getElementById("listHeader");
    //   if (viewMode === 'cardMode') {
    //     this.maxCharacterLength = 80;
    //     this.maxCharacterLengthName = 40;
    //     this.viewMode = "cardMode";
    //     this.isvisible = true;
    //     this.animate();
    //     // listHeader.classList.add("hide");
    //   } else {
    //     this.maxCharacterLength = 50;
    //     this.maxCharacterLengthName = 30;
    //     this.viewMode = "listMode";
    //     this.isvisible = false;
    //     this.animate();
    //     // listHeader.classList.remove("hide");
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
    @Name: userSmsListScroll function
    @Who: Renu
    @When: 30-Dec-2020
    @Why: ROST-488
    @What: service call for listing sms list data on scroll
    */
  usergrupListScroll(pagesize, pagneNo, sortingValue) {
    // this.loadingscroll=true;
    this.systemSettingService.fetchuserGrupList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loadingscroll = false;
          this.listView = repsonsedata['Data'];
          // this.listData=repsonsedata['Data'];
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.listData = this.listData.concat(nextgridView);
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
  @Type: File, <ts>
  @Name: onSort function
  @Who: Renu
  @When: 31-Dec-2020
  @Why: ROST-488
  @What: This function is used for sorting asc /desc based on column Clicked
  */

  onSort(columnName) {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pagneNo = 1;
    this.systemSettingService.fetchuserGrupList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == 204) {
          document.getElementById('contentdata').scrollTo(0, 0)
          this.loading = false;
          this.listData = repsonsedata['Data'];
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
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
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      // Append elements 
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
      if (this.totalDataCount > this.listData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.usergrupListScroll(this.pagesize, this.pagneNo, this.sortingValue);
        // this.reloadListData();
        // this.doNext();
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }

 
 

  /*
      @Type: File, <ts>
      @Name: reloadApiBasedOnorg function
      @Who: Renu
      @When: 13-Apr-2021
      @Why: EWM-1356
      @What: Reload Api's when user change organization
    */
  reloadApiBasedOnorg() {
    this.userGroupList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
    this.formtitle = 'grid';
  }
 
   

  /*
  @Type: File, <ts>
  @Name: confirmDialog function
  @Who: Suika
  @When: 13-07-2021
  @Why: ROST-1998
  @What: FOR DIALOG BOX confirmation
*/
confirmDialog(val,index): void {
  const id = val;
  const message = 'label_titleDialogContent';
  const title = 'label_delete';
  const subTitle = 'label_userGroups';
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
      this.systemSettingService.deleteUserGroupById('?Id=' + id).subscribe(
        (data: ResponceData) => {
          this.active = false;
        if (data.HttpStatusCode == 200) {   
            this.pagneNo = 1;
            this.searchVal='';   
            this.listDataview.splice(index, 1);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());           
            this.userGroupList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
          }else  if(data.HttpStatusCode == 400) {                   
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
           // this.industryList(this.pageSize, this.pageNo, this.sortingValue,this.searchVal);
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

  // RTL code
  let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	
}

// refresh button onclick method by Adarsh Singh
refreshComponent(){
  this.userGroupList(this.pagesize, this.pagneNo, this.sortingValue, this.searchVal);
}

getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}

}

