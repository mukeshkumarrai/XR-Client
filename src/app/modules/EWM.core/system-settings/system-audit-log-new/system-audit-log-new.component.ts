
/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: priti sri
  @When:07-July-2021
  @Why: EWM-1991
  @What:  This page will be use for the System Audit log Component ts file
*/
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { from, Subject } from 'rxjs';
import { saveAs as importedSaveAs } from "file-saver";
import { Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import{SystemAuditDetailsComponent} from './system-audit-details/system-audit-details.component';
import { slideInRightAnimation, lightSpeedInAnimation, flipInXAnimation, fadeInRightBigAnimation, fadeInRightAnimation, bounceInRightAnimation }from 'angular-animations';
import { ButtonTypes } from 'src/app/shared/models';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-system-audit-log-new',
  templateUrl: './system-audit-log-new.component.html',
  styleUrls: ['./system-audit-log-new.component.scss'],
  animations: [
    slideInRightAnimation({ anchor: 'letterAnim1', duration: 500 }),
    lightSpeedInAnimation({ anchor: 'letterAnim2', duration: 500 }),
    flipInXAnimation({ anchor: 'letterAnim3', duration: 500 }),
    fadeInRightBigAnimation({ anchor: 'letterAnim4', duration: 500 }),
    fadeInRightAnimation({ anchor: 'letterAnim5', duration: 500 }),
    bounceInRightAnimation({ anchor: 'letterAnim6', duration: 500 }),
  ]
})
export class SystemAuditLogNewComponent implements OnInit {
  public userpreferences: Userpreferences;
  clearbtn: boolean;
  public pageValue='';  
  notDataAvailable=0;
  public loading=false;
  viewMode: string;
  isvisible: boolean;
  loadingscroll: boolean;
  canLoad: any;
  pendingLoad: boolean;
  totalDataCount: any;
  pageNo: number=1;
  pagesize: any;
  sortingValue: string = "Id desc";
  searchValue: string = "";
  fromDate: any='';
  toDate: any='';
  public sortDirection:string='asc';
  public sortedcolumnName:string='Id';
  pageName: string='PageName';
  gridData: any;
  maxDate = new Date();
  pageSizeOptions: any;
  auditFrom: FormGroup;
  public loadingPopup: boolean;
  next: number=0;
  public ascIcon:string;
  public descIcon:string;
  listDataview: any;
  exportTo: any;
  loadingSearch: boolean;
  pageOption: any;

  CandidateId:any='';
  Id:any=0;
  PageNameCan:any='';
  animationVar: any;
  public isCardMode:boolean = false;
  public isListMode:boolean = true;
  dirctionalLang;
  getDateFormat:any;
  searchSubject$ = new Subject<any>();  
  utcDate:string;
  constructor(private translateService: TranslateService, private fb: FormBuilder,private appSettingsService: AppSettingsService,
    private systemSettingService: SystemSettingService, public _sidebarService: SidebarService, public dialog: MatDialog, public http: HttpClient,
    private commonserviceService: CommonserviceService, private snackBService: SnackBarService,
    public _userpreferencesService: UserpreferencesService,
    private rtlLtrService: RtlLtrService,private routes: ActivatedRoute,private route: Router, ) {
      this.maxDate.setDate(this.maxDate.getDate());
    this.pagesize = this.appSettingsService.pagesize;
    this.pageSizeOptions = this.appSettingsService.pageSizeOptions;
    this.pageOption = this.appSettingsService.pageOption;
    this.auditFrom = this.fb.group({
      start: ['', [Validators.required, CustomValidatorService.dateValidator]],
      end: ['', [Validators.required, CustomValidatorService.dateValidator]]
    })
     }

  ngOnInit(): void {
    let URL = this.route.url;
    let queryParams = this.routes.snapshot.params.id;
    this.pageValue=decodeURIComponent(queryParams);
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;

    if(this.pageValue=='undefined'){
      this.pageValue="";
     }else{
      this.pageValue=decodeURIComponent(queryParams);
    }
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.systemLogList();
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 500);
    this.ascIcon='north';
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    this.routes.queryParams.subscribe(parms=>{
      if(parms?.CandidateId!=undefined && parms?.CandidateId!=null && parms?.CandidateId !=''){
        this.CandidateId = parms?.CandidateId;
        this.Id = parms?.Id;
        this.PageNameCan = parms?.pageName; 
      }
     
  })
  this.animationVar = ButtonTypes;
  
      // @suika @EWM-14427 @Whn 27-09-2023
      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        this.loading = true;
         this.sendRequest(val);
         });

  }
  animationState = false;
  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }

  reloadApiBasedOnorg() {
    this.systemLogList();
  }
  // switchListMode(viewMode){
  //   if(viewMode==='cardMode'){
  //     this.viewMode = "cardMode";
  //     this.isvisible=true;
  //     this.animate();
  //   }else{
     
  //     this.viewMode = "listMode";
  //     this.isvisible=false;
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
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if(this.totalDataCount>this.gridData.length){
      this.pageNo = this.pageNo + 1;
      this.onPaginatorChange();
      }
      else{this.loadingscroll = false;}
  
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }
  systemLogList() {
    this.loading = true;
    this.systemSettingService.fetchSystemLogList(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue).subscribe(
      repsonsedata => {
        this.animate();
        this.gridData = repsonsedata['Data'];
        this.totalDataCount=repsonsedata['TotalRecord'];
        this.notDataAvailable=repsonsedata['TotalRecord'];
        this.loading = false;
        // this.reloadListData();
        // this.doNext();
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      
      })
  }
  onPaginatorChange() {
    this.loadingscroll = true;
    this.systemSettingService.fetchSystemLogList(this.pagesize, this.pageNo, this.sortingValue, this.searchValue, this.fromDate, this.toDate,this.pageName,this.pageValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.gridData = this.gridData.concat(repsonsedata['Data']);
          //this.totalDataCount = repsonsedata['TotalRecord'];
          this.loading = false;
          this.loadingscroll = false;

          // this.reloadListData();
          // this.doNext();
        } else {
          this.loadingscroll = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  inputEventStart(event) {
    const d = new Date(event.value);
    this.fromDate  = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
  }
 
  inputEventEnd(event) {  
    const dateObj = new Date(event.value);
    // Check if the date object is valid
    if (isNaN(dateObj.getTime())) {  //by maneesh ewm-18909 when:03/12/2024
      console.error('Invalid Date');
    } else {
      dateObj.setDate(dateObj.getDate() + 1);
      dateObj.setMinutes(dateObj.getMinutes() - 1);
      this.toDate = dateObj.toISOString();      
    }
    this.clearbtn = true;
    
  }

  clearDate(event) {
    this.clearbtn = false;
    event.stopPropagation();
    this.auditFrom.reset();
    this.fromDate = '';
    this.toDate = '';
    this.systemLogList();
  }
  onClose() {
    // const d = new Date();
    //const d = new Date(event.value);
    // this.toDate  = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()).toISOString();
    if (!this.auditFrom.value.end) {
      this.auditFrom.patchValue({ 'end': this.toDate });
    }
    this.pageNo=1;
    this.systemLogList();
  }
  doNext() {

    if (this.next < this.gridData.length) {
      this.listDataview.push(this.gridData[this.next++]);
    }
  }

reloadListData() {
this.next=0;
this.listDataview=[];
}
onSort(columnName)
{
  this.loading = true;
  this.sortedcolumnName=columnName;
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  this.ascIcon='north';
  this.descIcon='south';
  this.sortingValue=this.sortedcolumnName+' '+this.sortDirection;
  this.pageNo=1;
  this.systemLogList();
}



// @suika @EWM-14427 @Whn 27-09-2023
public onFilter(inputValue: string): void {
  this.searchValue = inputValue;
  if (inputValue?.length > 0 && inputValue?.length <= 2) {
    this.loading = false;
    return;
  }
  this.searchSubject$.next(inputValue);
}


public sendRequest(inputValue: string): void {
  this.searchValue = inputValue.trim(); // Remove whitespace
  this.searchValue = inputValue.toLowerCase(); // Datasource defaults to lowercase matches
  this.loadingSearch=true;
  this.systemSettingService.fetchSystemLogListSearch(this.searchValue).subscribe(
    repsonsedata => {
      this.gridData = repsonsedata['Data'];
      this.loading = false;
      this.loadingSearch = false;
    }, err => {
      this.loading = false;
      this.loadingSearch = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
showDetails(data)
{
  const dialogData = data;
  const dialogRef = this.dialog.open(SystemAuditDetailsComponent, {
    // maxWidth: "750px",
    // width:"90%",
    // height: "580px",
    data: dialogData,
    panelClass: ['xeople-modal', 'auditLogPopUp', 'animate__animated','animate__zoomIn'],
    disableClose: true,
});
  dialogRef.afterClosed().subscribe(dialogResult => {
    //this.result = dialogResult;
    if(dialogResult==true){
      this.loading=true;
    }else{
     // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
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
downloadFile(value) {
  this.exportTo = value;
  this.loading = true;
  this.systemSettingService.fetchSystemLogListDownload(this.fromDate, this.toDate, this.exportTo,this.sortingValue).subscribe(
    repsonsedata => {
      if (value == 'CSV') {
        let BLOB = new Blob([repsonsedata], { type: "text/csv;charset=utf-8" });
        importedSaveAs(BLOB, this.exportTo + '.csv')
      } else if (value == 'PDF') {
        importedSaveAs(repsonsedata, this.exportTo);
      } else {
        importedSaveAs(repsonsedata, this.exportTo);
      }

      this.loading = false;
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
    })
}

/*
@Name: onFilterClear 
  @Who: Priti Srivastava
  @When: 14-oct-2021
  @Why: EWM-2274.
  @What: To remove search value.
*/
onFilterClear()
{
  this.searchValue='';
  this.onFilter(this.searchValue);
}

// refresh button onclick method by Adarsh Singh
refreshComponent(){
  // who:maneesh,what:ewm-10904 for when scrool and go last page when click on  refresh button 
  // then no record message display so that i am commenting this and add loader and this.onPaginatorChange() ,when:09/03/2023
  this.gridData = [];
  this.pageNo=1;
  this.loading = true;
  this.systemLogList();
  //this.onPaginatorChange();
  // this.systemLogList();
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
   @Name: add remove animation function
   @Who: maneesh
   @When: 09-03-2023
   @Why: EWM-10904
   @What: add and remove animation
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
}
