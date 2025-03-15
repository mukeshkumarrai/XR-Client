
/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Suika
  @When: 20-Dec-2022
  @Why: ROST-1732 ROST-9629
  @What:  This component is used for add  templates for compose mail.
*/

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { EmailPreviewPopupComponent } from 'src/app/modules/EWM.core/system-settings/email-templates/email-preview-popup/email-preview-popup.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ButtonTypes } from 'src/app/shared/models';
enum Tab{
  'My Templates',
   'Shared Templates'
   }

@Component({
  selector: 'app-job-email-templates',
  templateUrl: './job-email-templates.component.html',
  styleUrls: ['./job-email-templates.component.scss']
})
export class JobEmailTemplatesComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  public active = false;
  public loading: boolean;
  //for pagination and sorting
  public ascIcon: string;
  public descIcon: string;
  public sortingValue: string = "Title,asc";
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
  public isInsertTemplatevisible: boolean=false;

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
  public gridsharedData:any [] =[];
  loader:any;
  animationVar: any;
  constructor(public dialogRef: MatDialogRef<JobEmailTemplatesComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,private snackBService: SnackBarService,private systemSettingService:SystemSettingService,private _appSetting: AppSettingsService,
    private translateService: TranslateService) { 
      this.pageSize = this._appSetting.pagesize;
    }

 
    ngOnInit(): void {
      this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);
      this.animationVar = ButtonTypes;
    }
    /*
     @Type: File, <ts>
     @Name: selectTemplate
     @Who: Suika
     @When: 20-Dec-2022
     @Why: ROST-1732 ROST-9629
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
      document.getElementsByClassName("add_template")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("add_template")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({'data':this.selectTemp}); }, 200);
    }
  // this.dialogRef.close({'data':this.selectTemp});
     /*
     @Type: File, <ts>
     @Name: onScrollDown
     @Who: Suika
     @When: 20-Dec-2022
     @Why: ROST-1732 ROST-9629
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
     @Name: fetchMoreRecord
     @Who: Suika
     @When: 20-Dec-2022
     @Why: ROST-1732 ROST-9629
     @What: on scroll pagination fetch more record
     */
    fetchMoreRecord(pagesize, pagneNo, sortingValue) {
      this.systemSettingService.fetchJobEmailTemplatesList(pagesize, pagneNo, sortingValue, this.searchVal).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == '200') {
            this.loadingscroll = false;
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data?.filter(res => res.IsShared === 0)
            this.gridData = this.gridData.concat(nextgridView);
            this.gridData.forEach(element=>{
              element['CheckboxStatus'] = false;
            })
            this.gridsharedData = repsonsedata.Data?.filter(res => res.IsShared === 1)
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
     @Name: onSort
     @Who: Suika
     @When: 20-Dec-2022
     @Why: ROST-1732 ROST-9629
     @What: on sort
     */
      onSort(columnName) {
        this.loading = true;
        this.sortedcolumnName = columnName;
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.ascIcon = 'north';
        this.descIcon = 'south';
        this.sortingValue = this.sortedcolumnName + ',' + this.sortDirection;
        this.pageNo = 1;
        this.systemSettingService.fetchJobEmailTemplatesList(this.pageSize, this.pageNo, this.sortingValue, this.searchVal).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode == '200') {
              document.getElementById('contentdata').scrollTo(0, 0);
              this.loading = false;
              this.gridData = repsonsedata.Data?.filter(res => res.IsShared === 0)
              this.gridData.forEach(element=>{
                element['CheckboxStatus'] = false;
              })
              this.gridsharedData = repsonsedata.Data?.filter(res => res.IsShared === 1)
              //console.log(this.gridsharedData,"this.gridsharedData");
              this.totalDataCount = repsonsedata.TotalRecord;
            }else if(repsonsedata.HttpStatusCode == '204'){
              this.loading = false;
              this.gridData = [];
              this.gridsharedData = [];
            }else {
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
    @When: 20-Dec-2022
    @Why: ROST-1732 ROST-9629
    @What: reset data as per selected tab
  */
   ActiveTab(event)
   { 
   this.tabActive=Tab[event.index];    
   }
  
   /*
    @Name: onFilter function
    @Who: Suika
    @When: 20-Dec-2022
    @Why: ROST-1732 ROST-9629
    @What: use for Searching records
     */
    public onFilter(inputValue: string): void {
      this.loading = false;
      this.loadingSearch = true;
      if (inputValue.length > 0 && inputValue.length <= 3) {
        this.loadingSearch = false;
        return;
      }
      this.pageNo = 1;
      this.systemSettingService.fetchJobEmailTemplatesList(this.pageSize, this.pageNo, this.sortingValue,inputValue).subscribe(
        (repsonsedata:ResponceData)=>{     
          if(repsonsedata.HttpStatusCode===200)
          {
            this.loadingSearch=false;
            this.totalDataCount=repsonsedata.TotalRecord;
            this.gridData=repsonsedata.Data?.filter(res => res.IsShared === 0);
            this.gridData.forEach(element=>{
              element['CheckboxStatus'] = false;
            })  
            this.gridsharedData = repsonsedata.Data?.filter(res => res.IsShared === 1)   
          }else if(repsonsedata.HttpStatusCode===204){
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
    @Who: Suika
    @When: 20-Dec-2022
    @Why: ROST-1732 ROST-9629
    @What: on closing popup
     */
    onDismiss(): void {
      document.getElementsByClassName("add_template")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("add_template")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
    }
  //this.dialogRef.close(false);
  /*
    @Name: emailTemplatesList function
    @Who: Suika
    @When: 20-Dec-2022
    @Why: ROST-1732 ROST-9629
    @What: list of templates data
     */
    emailTemplatesList(pagesize, pagneNo, sortingValue,searchVal)
    {
      this.loading=true;
      this.systemSettingService.fetchJobEmailTemplatesList(pagesize, pagneNo, sortingValue,searchVal).subscribe(
        (repsonsedata:ResponceData)=>{     
          if(repsonsedata.HttpStatusCode===200)
          {
            this.loading=false;
            this.totalDataCount=repsonsedata.TotalRecord;
            this.gridData=repsonsedata.Data?.filter(res => res.IsShared === 0);
            this.gridData.forEach(element=>{
              element['CheckboxStatus'] = false;
            })
            this.gridsharedData = repsonsedata.Data?.filter(res => res.IsShared === 1)
            //console.log(this.gridsharedData,"this.gridsharedData");
          }else if(repsonsedata.HttpStatusCode===204){
            this.gridData= [];
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
  @When: 20-Dec-2022
  @Why: ROST-1732 ROST-9629
  @What: use Clear for Searching records
  */
  public onFilterClear(): void {
    this.searchVal='';
    this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);
   }


   refresh(){
    this.emailTemplatesList(this.pageSize,this.pagneNo,this.sortingValue,this.searchVal);
   }

   redirect() {
    window.open('./client/core/profile/email-template', '_blank');
  }


     /*
    @Type: File, <ts>
    @Name: openPriviewPopup function
    @Who: Suika
    @When: 22-Dec-2022
    @Why: EWM-1732 EWM-9629
    @What: For open email preivew poup
   */
  openPriviewPopup(listDataList) {
    let subject = listDataList.Subject;
    let body = listDataList.TemplateText;
    
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: new Object({ subjectName: subject, emailTemplateData: body }),
      panelClass: ['xeople-modal-lg', 'emailPreview', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {

      }
      else {
      
      }

    }); 
  }


    /*
     @Type: File, <ts>
     @Name: onInsert
     @Who: Renu
     @When: 26-Sep-2021
     @Why: ROST-2641 ROST-3073
     @What: when user insert templates
     */
    onCancel(){
      document.getElementsByClassName("add_template")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("add_template")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
    }
  }
  