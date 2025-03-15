/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 25-Nov-2020
  @Why: ROST-370 ROST-427
  @What:  This page will be use for the administrators Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup,FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAdministrationService } from '../../shared/services/user-administration/user-administration.service';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from '../../../../shared/services/language-service/rtl-ltr.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  providers: [ MessageService ],
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss'],
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
export class AdministratorsComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public gridData: any[];
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public pageSizes = true;
  public previousNext = true;
  public pageSize = 5;
  public gridView: any[];
  public mySelection: string[] = [];
  public active = false;
  public isNew = false;
  public editDataItem:String;
  organizationFrom: FormGroup;
  submitted = false;
  result: string = '';
  formtitle: string = 'grid';
  public loading: boolean;
  public loadingPopup: boolean;
  searchChar:string;
  searchDataList=[];
  PreviewUrl:string;
  private rtl = false;
  private ltr=true;
  show = false;
  showMore :boolean;
  showLess=false;
  divId;
  public activestatus: string;
  smsById;
  viewMode: string = "listMode";
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  loadingscroll: boolean;
  public ascIcon:string;
  public descIcon:string;
  sortingValue: string = "UserFirstName,asc";
  public sortedcolumnName:string="UserFirstName";
  public sortDirection='asc';
  public maxCharacterLengthName=40; 
  public searchValue:string="";
  isvisible: boolean;
  public maxCharacterLengthSubHead = 250;
  totalDataCount: any;
  public next: number = 0;
  public listDataview: any[] = [];
  public loadingSearch: boolean;
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  searchSubject$ = new Subject<any>();  
  constructor(private translateService:TranslateService,private fb: FormBuilder,
  public _dialog: MatDialog,
  private _userAdministrationService:UserAdministrationService,private _profileInfoService:ProfileInfoService,private route: Router,private snackBService:SnackBarService,private commonserviceService:CommonserviceService,public _sidebarService: SidebarService,public dialog: MatDialog,private rtlLtrService:RtlLtrService,private messages: MessageService,private appSettingsService:AppSettingsService) { 
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize=this.appSettingsService.pagesize; 
    this.organizationFrom=this.fb.group({
     UserId:[''],
     searchTextFiltered:['']
   }) 
   this.PreviewUrl = "/assets/user.svg";   
   }
   ngOnInit(): void {
     let URL = this.route.url;
     let URL_AS_LIST = URL.split('/');
     this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
     this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
     this.getAdmministratorInfo(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue);
       setInterval(() => {
        this.canLoad = true;
        if (this.pendingLoad) {
          this.onScrollDown();
        }
      }, 2000);
      this.ascIcon='north';
      this.commonserviceService.onOrgSelectId.subscribe(value => {
        if(value!==null)
        {
            this.reloadApiBasedOnorg();
        }
       })
       this.animationVar = ButtonTypes;

    // @suika @EWM-14427 @Whn 27-09-2023
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
       this.sendRequest(val);
       });
   }  
   ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd, this.search, res);
     })
  }
   get f() { return this.organizationFrom.controls; }

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
 @Name: getAdmministratorInfo function
 @Who: Nitin Bhati
 @When: 26-Nov-2020
 @Why: ROST-428
 @What: call Get method from services for showing data into grid.
  */
 getAdmministratorInfo(pagesize,pagneNo,sortingValue,searchVal){
   this.loading=true;
   this._userAdministrationService.getAdministratorsInfo(pagesize,pagneNo,sortingValue,searchVal).subscribe(
     repsonsedata=>{
      if (repsonsedata['HttpStatusCode'] == '200') {
      this.animate();
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
      this.totalDataCount=repsonsedata['TotalRecord'];
       this.gridData = repsonsedata['Data'];    
       this.gridView = repsonsedata['Data'];
       this.loading=false;
      }else if(repsonsedata['HttpStatusCode'] == '204'){
        this.gridData = [];    
        this.gridView = [];
        this.totalDataCount=repsonsedata['TotalRecord'];
        this.loading=false;
      }
       },err=>{
        this.loading=false;
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     
     }) 
 }


    // @suika @EWM-14427 @Whn 27-09-2023
 public onFilter(inputValue: string): void {
  this.searchValue = inputValue;
  if (inputValue?.length > 0 && inputValue?.length <= 2) {
    this.loadingSearch = false;
    return;
  }
  this.searchSubject$.next(inputValue);
}
 /* 
   @Type: File, <ts>
   @Name: sendRequest function
   @Who: Nitin Bhati
   @When: 26-Nov-2020
   @Why: ROST-428
   @What: For Filtering Records
 */
 public sendRequest(inputValue: string): void {
  this.loading = false;
  this.loadingSearch = true;
  this.pagneNo=1;
  let value='';
  if (inputValue.length > 0 && inputValue.length < 3) {
    this.loadingSearch = false;
    return;
  }

  this._userAdministrationService.getAdministratorsInfo(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue).subscribe(
   repsonsedata => {
     if (repsonsedata['HttpStatusCode'] == '200') {
       this.loading = false;
       this.loadingSearch = false;
       this.gridView = repsonsedata['Data'];
       this.gridData = repsonsedata['Data'];
      //  this.reloadListData();
      //  this.doNext();
      }else if(repsonsedata['HttpStatusCode'] == '204'){
        this.gridData = [];    
        this.gridView = [];
        this.totalDataCount=repsonsedata['TotalRecord'];
        this.loading=false;
        this.loadingSearch = false;
      } else {
       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
       this.loading = false;
       this.loadingSearch = false;
     }
   }, err => {
    this.loading = false;
    this.loadingSearch = false;
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
   })
   }
 /* 
   @Type: File, <ts>
   @Name: openform
   @Who: Nitin Bhati
   @When: 26-Nov-2020
   @Why: ROST-428
   @What: Function will call when user clock on ADD/EDIT Buttons,For opening the dialog pop-up.
 */
 featureById;
 public openForm(formType,id) {
  if (this.viewMode === 'cardMode') {
    this.isvisible=true;
  } else {
    this.isvisible=false;
  }
 this.formtitle=formType;
 this.active = true;
 this.featureById=this.gridView.filter(x=>x['UserFirstName']==id);
 }
 
 public addHandler() {
 this.isNew = true;
 }
 public editHandler({dataItem}) {
 this.editDataItem = dataItem;
 this.isNew = false;
 }
 /*
   @Type: File, <ts>
   @Name: onCancel function
   @Who: Nitin Bhati
   @When: 26-Nov-2020
   @Why: ROST-428
   @What: Function will call when user click on cancel button.
 */
 public onCancel(e): void {
//  e.preventDefault();
//  this.closeForm();
//  this.organizationFrom.reset();
this.formtitle='grid';
this.active = true;
this.organizationFrom.reset();
 this.searchDataList=[];
 }
 /*
 @Type: File, <ts>
 @Name: closeForm function
 @Who: Nitin Bhati
 @When: 26-Nov-2020
 @Why: ROST-428
 @What: Function will call on clock event of popup responsible for closing pop up.
 */
 private closeForm(): void {
 this.active = false;
 this.cancel.emit();
 }
 
 /* 
   @Type: File, <ts>
   @Name: DeleteAdmministratorInfo function 
   @Who: Nitin Bhati
   @When: 26-Nov-2020
   @Why: ROST-428
   @What: call Api for delete record using ID.
 */
 public deletestatus:boolean;
 DeleteAdmministratorInfo(val): void {
   this.pagneNo=1;
   const formData = {  
     UserId: val 
   };  
     const message = `label_titleDialogContent`;
     const title='';
     const subtitle='label_administrator';
     const dialogData = new ConfirmDialogModel(title,subtitle, message);
     const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated','animate__zoomIn'],
      disableClose: true,
 });
 dialogRef.afterClosed().subscribe(dialogResult => {
 this.result = dialogResult;
 if(dialogResult==true){
   this.loading=true;
    this._userAdministrationService.deleteAdministratorsInfo(JSON.stringify(formData)).subscribe(
     repsonsedata=>{     
       this.active = false;
       this.loading=false;
       if(repsonsedata['HttpStatusCode']==200){
         this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         this.getAdmministratorInfo(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue);
         this.organizationFrom.reset();
       }else{
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        }
       this.cancel.emit();
     },err=>{
      this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     
     })
 }else{
  // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
   }
   });
   }




   /**
    @(C): Entire Software
    @Type: Function
    @Who: Satya Prakash
    @When: 15-Dec-2020
    @Why:  Switch mode List and card
    @What: This function responsible to change list and card view
   */
  switchListMode(viewMode){
    // let listHeader = document.getElementById("listHeader");
    if(viewMode==='cardMode'){
      this.maxCharacterLengthName=40;
      this.isCardMode = true;
      this.isListMode = false;
      this.viewMode = "cardMode";
      // listHeader.classList.add("hide");
      this.isvisible = true;
      this.animate();
    }else{
      this.isCardMode = false;
      this.isListMode = true;
      this.maxCharacterLengthName=40;
      this.viewMode = "listMode";
      // listHeader.classList.remove("hide");
      this.isvisible = false;
      this.animate();
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
  this.loadingscroll = true;
  if (this.canLoad) {
    // Change value of checkers
    this.canLoad = false;
    this.pendingLoad = false;
    // Append elements
     /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
     if(this.totalDataCount>this.gridData.length){
    this.pagneNo = this.pagneNo + 1;
    this.userSmsListScroll(this.pagesize, this.pagneNo, this.sortingValue);
  } else {
    this.loadingscroll = false;
  }
  } else {
    this.loadingscroll = false;
    this.pendingLoad = true;
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
 userSmsListScroll(pagesize,pagneNo,sortingValue)
 {
  // this.loadingscroll=true;
   this._userAdministrationService.getAdministratorsInfo(pagesize,pagneNo,sortingValue,this.searchValue).subscribe(
     repsonsedata=>{     
       if(repsonsedata['HttpStatusCode']=='200')
       {
         this.loadingscroll=false;
         this.gridView=repsonsedata['Data'];
        // this.listData=repsonsedata['Data'];
         let nextgridView = [];
         nextgridView = repsonsedata['Data'];
         this.gridData = this.gridData.concat(nextgridView);
        //  this.reloadListData();
        //  this.doNext();
       }else
       {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         this.loadingscroll=false;
       }
     },err=>{
         this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
       })
 }

 
/*
@Type: File, <ts>
@Name: onSort function
@Who: Renu
@When: 15-Dec-2020
@Why: ROST-488
@What: This function is used for sorting asc /desc based on column Clicked
*/

onSort(columnName)
{
  this.loading = true;
  this.sortedcolumnName=columnName;
  this.sortDirection =this.sortDirection === 'asc' ? 'desc' : 'asc';
  this.ascIcon='north';
  this.descIcon='south';
  this.sortingValue=this.sortedcolumnName+','+this.sortDirection;
  this.pagneNo=1;
  this._userAdministrationService.getAdministratorsInfo(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue).subscribe(
    repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == '200') {
        document.getElementById('contentdata').scrollTo(0,0)
        this.loading = false;
        this.gridData = repsonsedata['Data'];
        // this.reloadListData();
        // this.doNext();
      }else
      {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loadingscroll = false;
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
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
  imagePreview(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '220px',
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated','animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {
    });
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
      this.getAdmministratorInfo(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue);
      this.formtitle='grid';
    }

    /**@what: for animation @by: renu on @date: 03/07/2021 */
doNext() {
  if (this.next < this.gridData.length) {
    this.listDataview.push(this.gridData[this.next++]);
  }
}

/**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */
reloadListData() {
  this.next=0;
  this.listDataview=[];
}

public onFilterClear(): void {
  this.searchValue='';
  this.getAdmministratorInfo(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue);
}

// refresh button onclick method by Adarsh Singh
refreshComponent(){
  this.getAdmministratorInfo(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue);
}
}
