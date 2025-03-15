
/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Suika
  @When: 28-Sep-2022
  @Why: ROST-8813 ROST-8952
  @What:  This component is used for add  templates for compose mail.
*/

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../../services/system-setting/system-setting.service';
enum Tab{
  'My Templates',
   'Shared Templates'
   }

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.scss']
})
export class SmsTemplateComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "Title asc";
  public sortedcolumnName: string = 'Title';
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
  public gridData: any []= [];
  public gridsharedData:any []=[];
  public searchVal: string = '';
  public totalDataCount: any;
  public listData: any = [];
  public loadingSearch: boolean;
  public auditParameter;
  public idFolder = '';
  public idName = 'Id';
  pageLabel: any = "label_folder";
  public listDataview: any[] = [];
  public pagneNo = 1;  
  selectedTabIndex: any=0;
  tabActive:string='My Templates';
  selectTemp: any;
  public gridDataList: any []= [];

  searchSubject$ = new Subject<any>();
  public totalTemplateDataCount: number;
  public totalsharedDataCount:number;
  public IsShared:number; 
  public selectedSms:any=[];
  constructor(public dialogRef: MatDialogRef<SmsTemplateComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService, 
    private systemSettingService:SystemSettingService,private _appSetting: AppSettingsService,
    private translateService: TranslateService) {
    this.pageSize = this._appSetting.pagesize;
    }

  ngOnInit(): void {
    this.smsTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.getFilterValue(val);
       });
  }
  /*
   @Type: File, <ts>
   @Name: selectTemplate
   @Who: Suika
   @When: 28-Sep-2022
   @Why: ROST-8813 ROST-8952
   @What: on selected Templates
   */
  isChecked:boolean=false;
selectTemplate(selectGirdData:any,event:any){
  this.isSharedChecked=false;
  this.unselectSharedTemplateData();
  if(event.checked===true){
    selectGirdData.CheckboxStatus=true;
    this.selectTemp=selectGirdData;    
    this.gridData.forEach(x => {
      if (x.Id != selectGirdData.Id) {
        x.CheckboxStatus = false;
      }
    });
    this.isChecked = true;
  }else{
    selectGirdData.CheckboxStatus=false;
    this.isChecked = false;
  }
  }


   /*
   @Type: File, <ts>
   @Name: selectTemplate
   @Who: Suika
   @When: 28-Sep-2022
   @Why: ROST-8813 ROST-8952
   @What: on selected Templates
   */
isSharedChecked:boolean=false;
selectSharedTemplate(selectGirdData:any,event:any){
  this.isChecked=false;
  this.unselectTemplateData();
  if(event.checked===true){
    this.isSharedChecked=true;
    selectGirdData.CheckboxStatus=true;
    this.selectTemp=selectGirdData;
    this.gridsharedData?.forEach(x => {
      if (x.Id != selectGirdData.Id) {
        x.CheckboxStatus = false;
      }
    });
  }else{
    this.isSharedChecked=false;
    selectGirdData.CheckboxStatus=false;
  }   
  }


  unselectTemplateData(){
    this.gridData?.forEach(x => {
        x.CheckboxStatus = false;    
    });
  }

  unselectSharedTemplateData(){
    this.gridsharedData?.forEach(x => {
        x.CheckboxStatus = false;    
    });
  }
  /*
   @Type: File, <ts>
   @Name: onInsert
   @Who: Suika
   @When: 28-Sep-2022
   @Why: ROST-8813 ROST-8952
   @What: when user insert templates
   */
  onInsert(){ 
      localStorage.setItem("selectSMSTemp", JSON.stringify(this.selectTemp));      
    document.getElementsByClassName("add_template")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_template")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'data':this.selectTemp}); }, 200);
  }

   /*
   @Type: File, <ts>
   @Name: onScrollDown
   @Who: Suika
   @When: 28-Sep-2022
   @Why: ROST-8813 ROST-8952
   @What: on scroll pagination
   */
  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridData.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      }
      else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }



   /*
   @Type: File, <ts>
   @Name: onSharedScrollDown
   @Who: Suika
   @When: 28-Sep-2022
   @Why: ROST-8813 ROST-8952
   @What: on scroll pagination
   */
  onSharedScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridsharedData?.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue);
      }
      else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }
  /*
   @Type: File, <ts>
   @Name: fetchMoreRecord
   @Who: Suika
   @When: 28-Sep-2022
   @Why: ROST-8813 ROST-8952
   @What: on scroll pagination fetch more record
   */
  fetchMoreRecord(pagesize, pagneNo, sortingValue) {
    if (this.tabActive=='Shared Templates') {
      this.IsShared=1;
     }else if(this.tabActive='My Templates'){
      this.IsShared=0;
     }
    // who:maneesh,what:ewm-10537  apply &StatusFilter=Active  for only show active templates- when:22/03/2023
    this.systemSettingService.getSMSTemplate(pagesize, pagneNo, sortingValue, this.searchVal + "&IsShared=" + this.IsShared +'&FilterParams.ColumnName=Status&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingscroll = false;
          let nextgridView: any = [];
          let nextsharedgridView: any = [];
          nextgridView = repsonsedata.Data.SmsTemplates;
          nextsharedgridView = repsonsedata.Data.SharedSmsTemplates;
          this.gridData = this.gridData.concat(nextgridView);
          this.gridsharedData = this.gridsharedData?.concat(nextsharedgridView);
          this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
          this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
        }else if(repsonsedata.HttpStatusCode == '204'){
          this.loadingscroll = false;
          this.gridData = [];
          this.gridsharedData = [];
          this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
          this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Type: File, <ts>
   @Name: onSort
   @Who: Suika
   @When: 28-Sep-2022
   @Why: ROST-8813 ROST-8952
   @What: on sort
   */
    onSort(columnName) {
      this.loading = true;
      this.sortedcolumnName = columnName;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.ascIcon = 'north';
      this.descIcon = 'south';
      this.sortingValue = this.sortedcolumnName + ' ' + this.sortDirection;
      this.pageNo = 1;
      if (this.tabActive=='Shared Templates') {
        this.IsShared=1;
       }else if(this.tabActive='My Templates'){
        this.IsShared=0;
       }
    // who:maneesh,what:ewm-10537  apply &StatusFilter=Active  for only show active templates- when:22/03/2023
    this.systemSettingService.getSMSTemplate(this.pageSize, this.pageNo, this.sortingValue, this.searchVal + "&IsShared=" + this.IsShared +'&FilterParams.ColumnName=Status&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == '200') {
            document.getElementById('contentdata').scrollTo(0, 0);
            this.loading = false;
            this.gridData = repsonsedata.Data.SmsTemplates;
            this.gridsharedData = repsonsedata.Data?.SharedSmsTemplates;
            this.totalDataCount = repsonsedata.TotalRecord;
            this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
            this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
          }else if(repsonsedata.HttpStatusCode == '204'){
            this.loading = false;
            this.gridData = [];
            this.gridsharedData = [];
            this.totalDataCount = repsonsedata.TotalRecord;
            this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
            this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
          } else {
            this.loading = false;
            this.loadingscroll = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }


/*
  @Name: tab clicked function
  @Who: Suika
  @When: 28-Sep-2022
  @Why: ROST-8813 ROST-8952
  @What: reset data as per selected tab
*/
 ActiveTab(event)
 { 
 this.tabActive=Tab[event.index];  
   if (this.tabActive=='Shared Templates') {
    this.IsShared=1;
    this.searchVal=''
      this.smsTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);  
   }else if(this.tabActive='My Templates'){
    this.IsShared=0;
    this.searchVal=''
    this.smsTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);  
   }
 }

 /*
  @Name: onFilter function
  @Who: Suika
  @When: 28-Sep-2022
  @Why: ROST-8813 ROST-8952
  @What: use for Searching records
   */
  public onFilter(inputValue: string): void {
    this.loading = false;
    if (inputValue.length > 0 && inputValue.length <= 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this.searchSubject$.next(inputValue);
    
  }

  getFilterValue(inputValue){
    if (this.tabActive=='Shared Templates') {
      this.IsShared=1;
     }else if(this.tabActive='My Templates'){
      this.IsShared=0;
     }
    // who:maneesh,what:ewm-10537  apply &StatusFilter=Active  for only show active templates- when:22/03/2023
    this.systemSettingService.getSMSTemplate(this.pageSize, this.pageNo, this.sortingValue,inputValue + "&IsShared=" + this.IsShared +'&FilterParams.ColumnName=Status&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata:ResponceData)=>{     
        if(repsonsedata.HttpStatusCode===200)
        {
          this.loadingSearch=false;
          this.totalDataCount=repsonsedata?.TotalRecord;
          if (this.tabActive=='Shared Templates') {
            this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
          }else if(this.tabActive='My Templates'){
            this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
          }
          this.gridData=repsonsedata.Data?.SmsTemplates;
          this.gridsharedData = repsonsedata.Data?.SharedSmsTemplates;
   
        }else if(repsonsedata.HttpStatusCode===204){
          this.totalDataCount=repsonsedata?.TotalRecord;
          if (this.tabActive=='Shared Templates') {
            this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
          }else if(this.tabActive='My Templates'){
            this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
          }
          this.loadingSearch=false;
          this.gridData= [];
          this.gridsharedData = [];
        }else
        {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loadingSearch=false;
        }
      },err=>{
        this.loadingSearch=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
        })
  }

 /*
  @Name: onDismiss function
  @Who: Suika
  @When: 28-Sep-2022
  @Why: ROST-8813 ROST-8952
  @What: on closing popup
   */
  onDismiss(): void {
    document.getElementsByClassName("add_template")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_template")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

/*
  @Name: smsTemplatesList function
  @Who: Suika
  @When: 28-Sep-2022
  @Why: ROST-8813 ROST-8952
  @What: list of templates data
   */
  smsTemplatesList(pagesize, pagneNo, sortingValue,searchVal)
  {
    if (this.tabActive=='Shared Templates') {
      this.IsShared=1;
     }else if(this.tabActive='My Templates'){
      this.IsShared=0;
     }
    this.loading=true;
    // who:maneesh,what:ewm-10537  apply &StatusFilter=Active  for only show active templates- when:22/03/2023
    this.systemSettingService.getSMSTemplate(pagesize, pagneNo, sortingValue,searchVal + "&IsShared=" + this.IsShared +'&FilterParams.ColumnName=Status&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata:ResponceData)=>{     
        if(repsonsedata.HttpStatusCode===200)
        {
          this.loading=false;
          this.totalDataCount=repsonsedata.TotalRecord;
          this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
          this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
          this.gridData=repsonsedata.Data?.SmsTemplates;
          this.gridsharedData = repsonsedata.Data?.SharedSmsTemplates;
          this.selectedSms=JSON.parse(localStorage.getItem('selectSMSTemp'));
          if (this.selectedSms!=undefined) {
            console.log('this.selectedSms',this.selectedSms);
            this.gridData?.forEach(x => {
              if (x.Id == this.selectedSms.Id) {
                x.CheckboxStatus = true; 
              }
            });
            this.selectTemp=this.selectedSms; 
            this.isChecked = true;
  
          }
          // if (localStorage.getItem('selectSMSTemp')==null){
          //   this.gridData?.forEach(element=>{
          //     element['CheckboxStatus'] = false;
          //   })
          // }
    
          this.gridsharedData?.forEach(element=>{
            element['CheckboxStatus'] = false;
          })
        }else if(repsonsedata.HttpStatusCode===204){
          this.gridData = [];
          this.totalTemplateDataCount=repsonsedata.Data?.SmsTemplatesCount;
          this.totalsharedDataCount=repsonsedata.Data?.SharedSmsTemplatesCount;
          this.gridsharedData = [];
          this.loading=false;
        }else
        {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading=false;
        }
      },err=>{
        this.loading=false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       
        })
  }

  /*
@Name: onFilterClear function
@Who: Suika
@When: 28-Sep-2022
@Why: ROST-8813 ROST-8952
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchVal='';
  this.smsTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);
 }
    // /*
    //  @Type: File, <ts>
    //  @Name: sharedTemplate function
    //  @Who: Nitin Bhati
    //  @When: 28-04-2023
    //  @Why: EWM-12255
    //  @What: For get list of shared template
    // */
    //  sharedTemplate(){
    //   this.smsTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);
    // }
}
