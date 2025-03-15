
/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 29-Sep-2021
  @Why: ROST-2641 ROST-3073
  @What:  This component is used for add  templates for compose mail.
*/

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EmailPreviewPopupComponent } from 'src/app/modules/EWM.core/system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SystemSettingService } from '../../../services/system-setting/system-setting.service';
enum Tab{
  'My Templates',
   'Shared Templates'
   }

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

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
  gridsharedData: any;
  CountCreatedBy:string;
  public isInsertTemplatevisible: boolean=false;
  isMyActivity:boolean = false;
  selectedTemplateId:any;
  tabActiveIndex: any=0;
  myTempDataCount: number;
  sharedTemplDataCount: number;
  public selectedSms:any=[]
  constructor(public dialogRef: MatDialogRef<TemplatesComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService, 
    private systemSettingService:SystemSettingService,private _appSetting: AppSettingsService,
    private translateService: TranslateService) {
    this.pageSize = this._appSetting.pagesize;
    this.isMyActivity = data?.isMyActivity;    
    this.selectedTemplateId = data?.selectedTemplateId;
    if(data?.tabActiveIndex!=undefined){
      this.tabActiveIndex = data?.tabActiveIndex;    
      this.selectedTabIndex = data?.tabActiveIndex;
      this.tabActive = data?.tabActive;
      this.ActiveTab({index:data?.tabActiveIndex});
    }  
 
    }

  ngOnInit(): void {
   // <!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->
    this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal, 'CreatedBy');
    this.selectedTabIndex = this.tabActiveIndex;
    this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal, 'SharedBy');

   
  }
  /*
   @Type: File, <ts>
   @Name: selectTemplate
   @Who: Renu
   @When: 26-Sep-2021
   @Why: ROST-2641 ROST-3073
   @What: on selected Templates
   */
  isChecked;
  selectTemplate(selectGirdData:any,event:any){
    if(event.checked===true){
      selectGirdData.CheckboxStatus=true;
      this.isInsertTemplatevisible=true;
      this.selectTemp=selectGirdData;
      this.gridData.forEach(x => {
        if (x.Id != selectGirdData.Id) {
          x.CheckboxStatus = false;
        }
      });
    }else{
      selectGirdData.CheckboxStatus=false;
      this.isInsertTemplatevisible=false;

    }
    // this.isChecked = !this.isChecked;
    //     if(event.target.checked==true){
    //       this.selectTemp=selectGirdData;
    //   }
     
    }

  

  /*
   @Type: File, <ts>
   @Name: onInsert
   @Who: Renu
   @When: 26-Sep-2021
   @Why: ROST-2641 ROST-3073
   @What: when user insert templates
   */
  onInsert(){
    localStorage.setItem("selectEmailTemp", JSON.stringify(this.selectTemp));      
    document.getElementsByClassName("add_template")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_template")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({'data':this.selectTemp,tabActiveIndex:this.tabActiveIndex,tabActive:this.tabActive}); }, 200);
  }

   /*
   @Type: File, <ts>
   @Name: onScrollDown
   @Who: Renu
   @When: 26-Sep-2021
   @Why: ROST-2641 ROST-3073
   @What: on scroll pagination
   */
  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->

  onScrollDown(CountCreatedBy?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridData?.length) {
        this.pageNo = this.pageNo + 1;
        this.fetchMoreRecord(this.pageSize, this.pageNo, this.sortingValue,CountCreatedBy);
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
   @Who: Renu
   @When: 26-Sep-2021
   @Why: ROST-2641 ROST-3073
   @What: on scroll pagination fetch more record
   */
  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->

  fetchMoreRecord(pagesize, pagneNo, sortingValue,CountCreatedBy) {
    // who:maneesh,what:ewm-10508  apply &StatusFilter=Active  for only show active templates- when:22/03/2023
    this.systemSettingService.fetchEmailTemplatesList(pagesize, pagneNo, sortingValue, this.searchVal,CountCreatedBy +'&StatusFilter=Active').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingscroll = false;
          let nextgridView: any = [];
          if(CountCreatedBy==='CreatedBy') {nextgridView = repsonsedata.Data;}
         
          this.gridData = this.gridData.concat(nextgridView);
          this.gridData.forEach(element=>{
            element['CheckboxStatus'] = false;
          })
          if(CountCreatedBy==='SharedBy') {this.gridsharedData = repsonsedata.Data;}

          
        }else if(repsonsedata.HttpStatusCode == '204'){
          this.loading = false;
          this.gridData = [];
          this.gridsharedData = [];
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
   @Who: Renu
   @When: 29-Sept-2021
   @Why: ROST-2641 ROST-3073
   @What: on sort
   */

  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->

    onSort(columnName,CountCreatedBy) {
      this.loading = true;
      this.sortedcolumnName = columnName;
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.ascIcon = 'north';
      this.descIcon = 'south';
      this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;//who:maneesh,what:ewm-13477 for sorting issue so that fixed commas,when:07/08/2023
      this.pageNo = 1;
    // who:maneesh,what:ewm-10508  apply &StatusFilter=Active  for only show active templates- when:22/03/2023
      this.systemSettingService.fetchEmailTemplatesList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal,CountCreatedBy +'&StatusFilter=Active').subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
            document.getElementById('contentdata').scrollTo(0, 0);
           
           if(CountCreatedBy==='CreatedBy') {this.gridData = repsonsedata.Data;}
              this.gridData.forEach(element=>{
                element['CheckboxStatus'] = false;
              })
              if(CountCreatedBy==='SharedBy') {this.gridsharedData = repsonsedata.Data;}
              this.totalDataCount = repsonsedata.TotalRecord;
              this.loading = false;
            }else if(repsonsedata.HttpStatusCode == '204'){
              this.loading = false;
              this.gridData = [];
              this.gridsharedData = [];
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
  @Who: Renu
  @When: 29-Sep-2021
  @Why: ROST-2641 ROST-3073
  @What: reset data as per selected tab
*/
  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->

 ActiveTab(event)
 { 
 this.tabActive=Tab[event.index]; 
 this.tabActiveIndex = event.index?event.index:0;
 if(event.index==0){
   
  this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal, 'CreatedBy');

 }else{
   
  this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal, 'SharedBy');

 }
 
 
   
 }

 /*`
  @Name: onFilter function
  @Who: Renu
  @When: 18-Aug-2021
  @Why:  ROST-2641 ROST-3073
  @What: use for Searching records
   */

  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->

  public onFilter(inputValue: string, CountCreatedBy): void {
    this.loading = false;
    this.loadingSearch = true;
    if (inputValue?.length > 0 && inputValue?.length <= 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    // who:maneesh,what:ewm-10508  apply &StatusFilter=Active  for only show active templates- when:22/03/2023
    this.systemSettingService.fetchEmailTemplatesList(this.pageSize, this.pageNo, this.sortingValue,inputValue,CountCreatedBy +'&StatusFilter=Active').subscribe(
      (repsonsedata:ResponceData)=>{     
        if(repsonsedata.HttpStatusCode===200)
          {
            this.loadingSearch=false;
            this.totalDataCount=repsonsedata.TotalRecord;
            // <!---------@When: 28-07-2023 @who:Bantee Kumar @why: EWM-13388  what:to show the total count of records showing there in form of My Template & Shared template. --------->

            if(CountCreatedBy==='CreatedBy'){
              this.gridData=repsonsedata.Data;
              this.myTempDataCount=repsonsedata.TotalRecord;}
            this.gridData.forEach(element=>{
              element['CheckboxStatus'] = false;
            })  
            if(CountCreatedBy==='SharedBy'){
              this.gridsharedData = repsonsedata.Data;
              this.sharedTemplDataCount=repsonsedata.TotalRecord;}   
          }else if(repsonsedata.HttpStatusCode===204){
            if(CountCreatedBy==='CreatedBy'){
              this.myTempDataCount=repsonsedata.TotalRecord;}
              if(CountCreatedBy==='SharedBy'){
                this.sharedTemplDataCount=repsonsedata.TotalRecord;} 
            this.loadingSearch=false;
            this.gridData=[];
            this.gridsharedData=[];
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
  @Who: Renu
  @When: 30-Sept-2021
  @Why:  ROST-2641 ROST-3073
  @What: on closing popup
   */
  onDismiss(): void {
    document.getElementsByClassName("add_template")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_template")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

/*
  @Name: emailTemplatesList function
  @Who: Renu
  @When: 30-Sept-2021
  @Why:  ROST-2641 ROST-3073
  @What: list of templates data
   */

  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->
  emailTemplatesList(pagesize, pagneNo, sortingValue,searchVal, CountCreatedBy  )
  {
    this.loading=true;
    /*--@who:Nitin Bhati,@what:12255,@when:28-04-2023--*/
    this.systemSettingService.geMyTemplateAndSharedData(pagesize, pagneNo, sortingValue,searchVal,CountCreatedBy).subscribe(
      (repsonsedata:ResponceData)=>{     
        if(repsonsedata.HttpStatusCode===200)
        {
          this.loading=false;
          this.totalDataCount=repsonsedata.TotalRecord;
          // <!---------@When: 28-07-2023 @who:Bantee Kumar @why: EWM-13388 to show the total count of records showing there in form of My Template & Shared template. --------->

          if(CountCreatedBy==='CreatedBy'){
          this.gridData=repsonsedata.Data;
          this.myTempDataCount=repsonsedata.TotalRecord;
        }
        //who:maneesh,what:ewm-15173 for get value email templtae ;
        this.selectedSms=JSON.parse(localStorage.getItem('selectEmailTemp'));        
        if (this.selectedSms!=undefined && this.selectedSms!=null) {
          this.gridData?.forEach(x => {
            if (x.Id == this.selectedSms?.Id) {
              x.CheckboxStatus = true; 
            }
          });
          this.selectTemp=this.selectedSms; 
          this.isInsertTemplatevisible=true;
        }else{
           this.gridData.forEach(element=>{
              element['CheckboxStatus'] = false;
            })
        }
            // this.gridData.forEach(element=>{
            //   element['CheckboxStatus'] = false;
            // })
            if(CountCreatedBy==='SharedBy'){
          this.gridsharedData = repsonsedata.Data;
        this.sharedTemplDataCount=repsonsedata.TotalRecord;


        this.selectedSms=JSON.parse(localStorage.getItem('selectEmailTemp'));
        if (this.selectedSms!=undefined && this.selectedSms!=null) {
          this.gridsharedData?.forEach(x => {
            if (x.Id == this.selectedSms?.Id) {
              x.CheckboxStatus = true; 
            }
          });
          this.selectTemp=this.selectedSms; 
          this.isInsertTemplatevisible=true;
        }
      }
          
   if(this.isMyActivity && this.selectedTemplateId!=undefined){
  //shared
  // if(this.tabActiveIndex==1){
  //   let selectSharedGirdData =  this.gridsharedData?.filter(res=>res.Id==this.selectedTemplateId);
  //   selectSharedGirdData[0].CheckboxStatus=true;
  //   this.isInsertTemplatevisible=true;
  //   this.selectTemp=selectSharedGirdData[0];
  //   this.gridsharedData?.forEach(x => {
  //     if (x.Id == this.selectedTemplateId) {
  //       x.CheckboxStatus = true;
  //     }
  //   });
  // }else{
  //   let selectGirdData =  this.gridData?.filter(res=>res.Id==this.selectedTemplateId);
  //   selectGirdData[0].CheckboxStatus=true;
  //   this.isInsertTemplatevisible=true;
  //   this.selectTemp=selectGirdData[0];
  //   this.gridData?.forEach(x => {
  //     if (x.Id == this.selectedTemplateId) {
  //       x.CheckboxStatus = true;
  //     }
  //   });
  // }  
  } 
  }
          // <!---------@When: 28-07-2023 @who:Bantee Kumar @why: EWM-13388 to show the total count of records showing there in form of My Template & Shared template. --------->

  else if(repsonsedata.HttpStatusCode===204){
          this.loading = false;
          if(CountCreatedBy==='CreatedBy'){
          this.gridData=[];

          this.myTempDataCount=repsonsedata.TotalRecord;
          }
          if(CountCreatedBy==='SharedBy'){
          this.gridsharedData =[];

            this.sharedTemplDataCount=repsonsedata.TotalRecord;
          }
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
@Who: Renu
@When: 30-Sep-2021
@Why: EWM-2641 EWM-3073 
@What: use Clear for Searching records
*/
  //<!---------@When: 20-03-2023 @who:Bantee Kumar @why: EWM-11246 --------->

public onFilterClear(CountCreatedBy): void {
  this.searchVal='';
  this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal, CountCreatedBy);
 }

  /*
   @Type: File, <ts>
   @Name: selectSharedTemplate
   @Who: Suika
   @When: 13-Feb-2023
   @Why: ROST-10494 ROST-10541
   @What: on selected Templates
   */
 selectSharedTemplate(selectGirdData:any,event:any){
  if(event.checked===true){
    selectGirdData.CheckboxStatus=true;
    this.isInsertTemplatevisible=true;
    this.selectTemp=selectGirdData;
    this.gridsharedData.forEach(x => {
      if (x.Id != selectGirdData.Id) {
        x.CheckboxStatus = false;
      }
    });
  }else{
    selectGirdData.CheckboxStatus=false;
    this.isInsertTemplatevisible=false;

  }    
   
  }
   /*
    @Type: File, <ts>
    @Name: openPriviewPopup function
    @Who: maneesh
    @When: 10-march-2023
    @Why: EWM-10780
    @What: For open email preivew poup
   */
  openPriviewPopup(listDataList) {
    let subject = listDataList.Subject;
    let body = listDataList.TemplateText;
  
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: new Object({ subjectName: subject, emailTemplateData: body }),
      panelClass: ['xeople-modal-md', 'emailPreview', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }
   /*
     @Type: File, <ts>
     @Name: sharedTemplate function
     @Who: Nitin Bhati
     @When: 28-04-2023
     @Why: EWM-12255
     @What: For get list of shared template
    */
     sharedTemplate(){
      this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal, 'SharedBy');
    }
}
