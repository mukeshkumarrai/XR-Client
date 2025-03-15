/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who:Priti Srivastava
    @When: 12-July-2021
    @Why:EWM-2114
    @What:  This component is used for show list emplooyee tag.
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import{EmployeeTagService} from './../../../shared/services/employeeTag/employee-tag.service'
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { fadeInRightBigAnimation } from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-employee-tag',
  templateUrl: './employee-tag.component.html',
  styleUrls: ['./employee-tag.component.scss'],
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
export class EmployeeTagComponent implements OnInit {
  listDataview:any;            
  listData:any[];
  viewMode:string='listMode';
  public ascIcon:string ;
  descIcon :string;
  sortedcolumnName:string='Code';
  sortDirection:string='asc';
  loading:boolean=false;
  loadingscroll:boolean=false;
  searchValue:string='';
  isvisible:boolean=false;
  auditParameter:string='';
  canLoad: boolean;
  pendingLoad: any;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  totalDataCount: any;
  next: number;
  pageSize: any;
  pageNo: any=1;
  public formtitle: string = 'grid';
  sortingValue: any='Code,asc';
  pageLabel: any = "label_employeeTag";
  loadingSearch:boolean;
  pageOption: any;  
  pageSizeOptions: any;
  animationState = false;
    // animate and scroll page size
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  employee:any;
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  searchSubject$ = new Subject<any>();
  getEmployeeTagListData: Subscription;

  
  constructor(public activateroute:ActivatedRoute,private commonserviceService: CommonserviceService,private route: Router,public _employeeTagServices: EmployeeTagService,
    public _sidebarService: SidebarService,private rtlLtrService: RtlLtrService ,private snackBService: SnackBarService,private translateService: TranslateService,
    private appSettingsService: AppSettingsService, public dialog: MatDialog, private textChangeLngService:TextChangeLngService,) {
      // page option from config file  
    this.pageSize = this.appSettingsService.pagesize;
    this.pageSizeOptions = this.appSettingsService.pageSizeOptions;
    this.pageOption = this.appSettingsService.pageOption;
     }

  ngOnInit(): void {
  

    let URL = this.route.url;
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
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
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
      }
     });
     this.switchListMode(this.viewMode); 
     this.ascIcon='north';
    this.auditParameter=encodeURIComponent('Employee tag master'); 
    this.getEmployeeTagList(true);
    this.animationVar = ButtonTypes;
             // who:maneesh,what:ewm-12630 for search data apply debounce,when:08/06/2023
             this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => { 
              this.loadingSearch = true;
              this.getEmployeeTagList(true);
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

//   openForm(type:string,Id:string)
//   {
//     if(type!='Add'){
//       this.route.navigate(['./client/core/administrators/employeetag-manage/' + Id], 
//       {queryParams: {mode: this.viewMode}});
//   }else
//   {
//     this.route.navigate(['./client/core/administrators/employeetag-manage'], 
//     {queryParams: {mode: this.viewMode}});
// }
   
//   }
// refresh button onclick method by Piyush Singh
refreshComponent(){
  this.pageNo=1;
  this.getEmployeeTagList(true);
}
  onScrollDown()
  {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.listData.length) {
        this.pageNo = this.pageNo + 1;
        this.ListScroll(this.pageSize, this.pageNo, this.sortingValue);
      }
      else { this.loadingscroll = false; }

    } else {
      this.pendingLoad = true;
      this.loadingscroll = false;
    }
  }
  ListScroll(pagesize, pagneNo, sortingValue) {
    this.loadingscroll = true;
    this._employeeTagServices.fetchEmployeeTagList(pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.listData = this.listData.concat(nextgridView);
          //this.doNext();
          //Removing duplicates from the concat array by Piyush Singh
          const uniqueUsers = Array.from(this.listData.reduce((map,obj) => map.set(obj.Id,obj),new Map()).values());
          this.listData = uniqueUsers;
        // console.log(this.listData,uniqueUsers,"Data")
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  reloadListData() {
    this.next=0;
    this.listDataview=[];
  } 
  doNext(){
    if (this.next < this.listData.length) {
      this.listDataview.push(this.listData[this.next++]);
    }
  }
  listSearch(searchValue)
  {
    this.searchValue = searchValue.target.value;
    let numberOfCharacters = searchValue.target.value.length;
    this.pageNo = 1;
    if(numberOfCharacters>1&& numberOfCharacters<3){return;}
    this.loadingSearch=true;
    // who:maneesh,what:ewm-12630 for search data apply debounce ,when:08/06/2023
    this.searchSubject$.next(searchValue);
 
  }
  onSort(columnName)
  {
    this.loading = true;
    this.sortedcolumnName = columnName;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ascIcon = 'north';
    this.descIcon = 'south';
    this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
    this.pageNo = 1;
    this.getEmployeeTagList(true);
  }

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

  getEmployeeTagList(isLoader:boolean)
  {
    this.loading = isLoader;
   this.getEmployeeTagListData= this._employeeTagServices.fetchEmployeeTagList(this.pageSize, this.pageNo, this.sortingValue, this.searchValue).subscribe(
      (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode === 200) {
          this.animate();
          this.loading = false;
          this.loadingSearch=false;
          this.listData = repsonsedata.Data;
          this.totalDataCount = repsonsedata.TotalRecord;
         // this.reloadListData();
         // this.doNext();
             // who:maneesh,what:ewm-12630 for search data apply debounce and fixed 204 case,when:08/06/2023
           }else if(repsonsedata.HttpStatusCode === 204){
              this.loading = false;
              this.loadingSearch = false;
              this.listData = repsonsedata.Data;
          }else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
          this.loadingSearch=false;
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.loadingSearch=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  DeleteInfo(Id,Index):void {
    const message = `label_titleDialogContent`;
    const subtitle = 'label_employeeTag';
    const title = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
     // this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;
         this._employeeTagServices.deleteEmployeeTag(Id).subscribe(
           repsonsedata => {
             this.loading = false;
             if (repsonsedata['HttpStatusCode'] == 200) {
              //this.listDataview.splice(Index, 1);
               this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
               this.pageNo = 1;
               this.getEmployeeTagList(true)
             } else {
               this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
             }
             this.cancel.emit();
           }, err => {
             this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode)
           })
      } else {
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
      }
    });
  }
  reloadApiBasedOnorg(){
    this.getEmployeeTagList(true);
  }
  
  public onFilterClear(): void {
    this.searchValue='';
    this.getEmployeeTagList(true);
  }


          /* 
@Name: ngOnDestroy
@Who: Bantee
@When: 20-Jun-2023
@Why: EWM-10611.EWM-12747
@What: to unsubscribe the getEmployeeTagListData API 
*/
ngOnDestroy(): void {
  this.getEmployeeTagListData.unsubscribe();
 
 }
}
