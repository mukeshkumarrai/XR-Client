/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Naresh Singh
  @When: 10-Mar-2021
  @Why: EWM-1021 EWM-1114
  @What:  This page will be use for the Access Levels Component ts file
*/

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataBindingDirective, GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { ValidateCode } from '../../../../shared/helper/commonserverside';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiesService } from '../../../../shared/services/common-servies.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { JobService } from '../../shared/services/Job/job.service';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  providers: [MessageService],
  selector: 'app-access-levels',
  templateUrl: './access-levels.component.html',
  styleUrls: ['./access-levels.component.scss'],
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
export class AccessLevelsComponent implements OnInit {

  /****************Decalaration of Global Variables*************************/
  status: boolean = false;
  submitted = false;
  loading: boolean;
  loadingscroll: boolean;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  private rtl = false;
  private ltr = true;
  public gridData: any[];
  public isNew = false;
  public pageSizes = true;
  public previousNext = true;
  public pageSize = 5;
  public gridView: any[];
  public editData: any[];
  public type: 'numeric' | 'input' = 'numeric';
  public info = true;
  public buttonCount = 5;
  public mySelection: string[] = [];
  public formtitle: string = 'grid';
  public active = false;
  addUserRoleForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public opened = false;
  public usergrpList = [];
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  viewMode: string = "listMode";
  //public activestatus: string;
  activestatus: string='Add';
  roleId: any[];
  result: string = '';
  public deletestatus: boolean;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  modalOpen = false;
  // Checkers
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  public ascIcon:string;
  public descIcon:string;
  sortingValue: string = "Name asc";
  public sortedcolumnName:string='Name';
  public sortDirection='asc';
  public maxCharacterLength=50;
  public maxCharacterLengthName=30;
  isvisible:boolean;
  searchVal: string;
  public maxSubHeadCharacterLengthName = 250;
  accessName;
  totalDataCount: any;
  next: number = 0;
  listDataview: any[] = [];
   // animate and scroll page size
   pageOption: any;
   animationState = false;
   // animate and scroll page size
   animationVar: any;
   public isCardMode:boolean = false;
   public isListMode:boolean = true;
   loadingSearch:boolean=false;
  searchSubject$ = new Subject<any>();
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 18-March-2020
  @Why: EWM-1116
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder,private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private messages: MessageService,
    public elementRef: ElementRef,private appSettingsService:AppSettingsService,private translateService: TranslateService,
    private candidateService:CandidateService,private jobService:JobService) {
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
      this.pagesize=this.appSettingsService.pagesize; 
     this.addUserRoleForm = this.fb.group({
      Id: [''],
      DataPermissionId: [''],
      DataType: [''],
      AccessLevelId: [''],
      View: [''],
      Add: [''],
      Edit: [''],
      Delete: [''],
      Comment: [''],
      ExportReport: [''],
      Print: [''],
      SendEmail: [''],
      SendSms: [''],
      DataPermissionName: ['']
    })
  }

/* 
  @Type: File, <ts>
  @Name: ngOnInit function
  @Who: Nitin Bhati
  @When: 18-March-2020
  @Why: EWM-1116
  @What: for calling ngOnInit function
  */
  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.searchVal='';
    this.userAccessLevelList(this.pagesize, this.pagneNo, this.sortingValue,this.searchVal);
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
     },err=>{
      this.loading = false;
     })
     this.animationVar = ButtonTypes;

       // @suika @EWM-14427 @Whn 27-09-2023
       this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        this.loading = true;
        this.loadingSearch=true;
         this.sendRequest(val);
         });
  }


  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd1, this.search, res);
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


mouseoverAnimation(matIconId, animationName) {
  let amin= localStorage.getItem('animation');
  if(Number(amin) !=0){
    document.getElementById(matIconId).classList.add(animationName);
  }
}
mouseleaveAnimation(matIconId, animationName) {
  document.getElementById(matIconId).classList.remove(animationName)
}

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
  @Name: closeForm function
  @Who: Nitin Bhati
  @When: 18-March-2021
  @Why: EWM-1116
  @What: FOR closing the form on button click event
  */
  private closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }
/* 
  @Type: File, <ts>
  @Name: userAccessLevelList function
  @Who: Nitin Bhati
  @When: 18-March-2021
  @Why: EWM-1116
  @What: service call for get list for user role data
  */
  userAccessLevelList(pagesize:number, pagneNo:number, sortingValue:string,searchVal:string) {
    this.loading = true;
    this.systemSettingService.fetchAccessLevelList(pagesize, pagneNo, sortingValue,searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.animate();
          this.loading = false;
          /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.totalDataCount=repsonsedata['TotalRecord'];
          this.gridView = repsonsedata['Data'];
          this.gridData = repsonsedata['Data'];
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
  this.searchVal='';
  this.sendRequest(this.searchVal);
}
  /* 
  @Type: File, <ts>
  @Name: sendRequest function
  @Who: Nitin Bhati
  @When: 24-march-2021
  @Why: EWM-1228
  @What: use for filter/search data
   */
  public sendRequest(inputValue: string): void {
    this.loading = false;
    if(inputValue.length>3)
    {
      this.systemSettingService.searchAccessLevelList(inputValue).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == '200') {
            this.loading = false;
            this.loadingSearch=false;
            this.gridView = repsonsedata['Data'];
            this.gridData = repsonsedata['Data'];  
          }else if (repsonsedata['HttpStatusCode'] == '204') {
            this.loading = false;
            this.loadingSearch=false;
            this.gridView = [];
            this.gridData = [];  
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
            this.loadingSearch=false;
          }
        }, err => {
          this.loading = false;
          this.loadingSearch=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          
        })
    }else{
      this.pagneNo=1;
      this.searchVal='';
      this.systemSettingService.fetchAccessLevelList(this.pagesize, this.pagneNo, this.sortingValue,this.searchVal).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == '200') {
            this.loading = false;
            this.loadingSearch=false;
            this.gridView = repsonsedata['Data'];
            this.gridData = repsonsedata['Data'];
          //   this.reloadListData();
          //  this.doNext();
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
            this.loadingSearch=false;
          }
        }, err => {
          this.loading = false;
          this.loadingSearch=false;
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
    
  switchListMode(viewMode) {  
  
  //  let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.isCardMode = true;
      this.isListMode = false;
      this.maxCharacterLength=80;
      this.maxCharacterLengthName=40;
      this.viewMode = "cardMode";
      this.isvisible=true;
      this.active = false;
      this.animate();
     // listHeader.classList.add("hide");
    } else {
      this.isCardMode = false;
      this.isListMode = true;
      this.maxCharacterLength=50;
      this.maxCharacterLengthName=30;
      this.viewMode = "listMode";
      this.isvisible=false;
      this.animate();
     // listHeader.classList.remove("hide");
    }
  }

  /* 
  @Type: File, <ts>
  @Name: userAccessLevelListScroll function
  @Who: Nitin Bhati
  @When: 18-March-2021
  @Why: EWM-1116
  @What: used to append list data whenever user scrolldown
  */

  userAccessLevelListScroll(pagesize, pagneNo, sortingValue) {
    //this.loadingscroll = true;
    this.systemSettingService.fetchAccessLevelList(pagesize, pagneNo, sortingValue,this.searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.gridData = this.gridData.concat(nextgridView);
        //   this.reloadListData();
        //  this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
      })
  }


  /* 
 @Type: File, <ts>
 @Name: onScrollDown function
 @Who: Nitin Bhati
 @When: 18-March-2021
 @Why: EWM-1116
 @What: for pagination whenever user scroll down
 */
onScrollDown(ev?) {
  //this.active = true;
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
     ;
      if(this.active==true){
        this.loadingscroll = false;
      }
      else{
        /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
        if(this.totalDataCount>this.gridData.length){
          this.pagneNo = this.pagneNo + 1
          this.userAccessLevelListScroll(this.pagesize, this.pagneNo, this.sortingValue);
        //   this.reloadListData();
        //  this.doNext();
        }
        else
        { 
          this.loadingscroll = false;
        }
      }
    } else {
      this.pendingLoad = true;
    }
  }

/*
@Type: File, <ts>
@Name: onSort function
@Who: Nitin Bhati
@When: 18-March-2021
@Why: EWM-1116
@What: This function is used for sorting asc /desc based on column Clicked
*/
onSort(columnName)
  {
    this.loading = true;
    this.sortedcolumnName=columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon='north';
    this.descIcon='south';
    this.sortingValue=this.sortedcolumnName+' '+this.sortDirection;
    this.pagneNo=1;
    this.systemSettingService.fetchAccessLevelList(this.pagesize, this.pagneNo, this.sortingValue,this.searchVal).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          document.getElementById('contentdata').scrollTo(0,0)
          this.loading = false;
          this.gridData = repsonsedata['Data'];
        //   this.reloadListData();
        //  this.doNext();
        }else
        {
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
    @Name: reloadApiBasedOnorg function
    @Who: Renu
    @When: 13-Apr-2021
    @Why: EWM-1356
    @What: Reload Api's when user change organization
  */

    reloadApiBasedOnorg(){
      this.userAccessLevelList(this.pagesize, this.pagneNo, this.sortingValue,this.searchVal);
      this.formtitle='grid';
      this.active = false;
      }

  //   reloadListData() {
  //       this.next=0;
  //       this.listDataview=[];
  //     } 

  // doNext() {
  //       // alert(this.gridData.length)
  //       if (this.next < this.gridData.length) {
  //         //alert('go')
  //         this.listDataview.push(this.gridData[this.next++]);
  //       }
  //     }



   /*
  @Type: File, <ts>
  @Name: showTooltip function
  @Who: Renu
  @When: 10-Aug-2021
  @Why: ROST-2363
  @What: For showing tooltip in kendo
   */
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    
    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
          this.tooltipDir.hide();
        }
        else {
        if(element.innerText=='')
        {
          this.tooltipDir.hide();
        }else{
          this.tooltipDir.toggle(element);
        }
          
        }
      }
      else {
        this.tooltipDir.hide();
      }
    }
    else if (element.nodeName === 'SPAN' || element.nodeName === 'A') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
        this.tooltipDir.hide();
      }
      else {
        if(element.innerText=='')
        {
          this.tooltipDir.hide();
        }else{
          this.tooltipDir.toggle(element);
        }
          
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }

// refresh button onclick method by Adarsh Singh
  refreshComponent(){
    this.userAccessLevelList(this.pagesize, this.pagneNo, this.sortingValue,this.searchVal);
  }
      
}