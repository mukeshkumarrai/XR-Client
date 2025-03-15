/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 13-May-2021
  @Why: EWM-1526
  @What:  This page will be use for the sms template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  providers: [ MessageService ],
  selector: 'app-location-type',
  templateUrl: './location-type.component.html',
  styleUrls: ['./location-type.component.scss']
})
export class LocationTypeComponent implements OnInit {
/****************Decalaration of Global Variables*************************/
status: boolean = false;
submitted = false;
loading:boolean;
public loadingPopup: boolean;
@ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
@ViewChild('revAdd') revAdd: ElementRef;
@ViewChild('revAdd1') revAdd1: ElementRef;
@ViewChild('search') search: ElementRef;
private rtl = false;
private ltr=true;
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
public formtitle:string='grid';
public active = false;
addUserSmsForm:FormGroup;
@Output() cancel: EventEmitter<any> = new EventEmitter();
public opened = false;  
public usergrpList=[];
public specialcharPattern="^[A-Za-z0-9 ]+$";
viewMode: string = "listMode";
public personTag: string='';
public jobTag: string='';
public smstemplate: string='';
@Input() name: string;
searchChar:string;
result: string = '';
public smstemplateDescriptuion: string='';
ckeConfig: any;
show = false;
showMore :boolean;
showLess=false;
divId;
//public activestatus: string;
activestatus: string='Add';
smsById;
canLoad = false;
pendingLoad = false;
pagesize;
pagneNo = 1;
loadingscroll: boolean;
public ascIcon:string;
public descIcon:string;
sortingValue: string = "Title asc";
public sortedcolumnName:string='Title';
public sortDirection='asc';
isvisible:boolean;
public maxCharacterLength=80;
public maxCharacterLengthName=40;
private targetInput = 'Description';
public searchValue:string="";
public maxCharacterLengthSubHead = 130;
moduleArray: any = [];
private _toolButtons$ = new BehaviorSubject<any[]>([]);
public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
public plcData = [];
remainingchr: number=1600;
totalDataCount: any;
selectedModuleName: any;
public auditParameter;
public idSms='';
public idName='Id';
pageLabel: any = "label_locationTypes";
/* 
@Type: File, <ts>
@Name: constructor function
@Who: Nitin Bhati
@When: 14-Dec-2020
@Why: ROST-487
@What: constructor for injecting services and formbuilder and other dependency injections
*/
  constructor(private fb: FormBuilder,private commonServiesService: CommonServiesService,private systemSettingService:SystemSettingService,private snackBService:SnackBarService,
    private validateCode:ValidateCode,public _sidebarService: SidebarService,private route: Router,
    private commonserviceService:CommonserviceService,private rtlLtrService:RtlLtrService,
    private messages: MessageService,public dialog: MatDialog,private appSettingsService:AppSettingsService,
    private translateService: TranslateService,private routes: ActivatedRoute) {
      this.pagesize=this.appSettingsService.pagesize;   
      this.addUserSmsForm=this.fb.group({
      moduleId:[''], 
      statusId:['',[Validators.required]],
      name: ['',[Validators.required,Validators.maxLength(100),Validators.minLength(2),Validators.pattern(this.specialcharPattern)]],
      smsbody:['',[Validators.required,Validators.maxLength(1600),Validators.minLength(2)]],
      personTag:[''],
      jobTag:[''],
      id:[''],
    });
    this.auditParameter=encodeURIComponent('SMS Templates'); 
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
    let queryParams = this.routes.snapshot.params.id;
    this.idSms=decodeURIComponent(queryParams);
    if(this.idSms=='undefined'){
      this.idSms="";
    }else{
      this.idSms=decodeURIComponent(queryParams);
    }
   
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.userSmsList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue, this.idName, this.idSms);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.ascIcon='north';
    this.addUserSmsForm.patchValue({
      moduleId:0,
      statusId:1
    });

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if(value!==null)
      {
          this.reloadApiBasedOnorg();
      }
     })
  //   this.commonServiesService.event.subscribe(res => {
  //     this.rtlLtrService.gridLtrToRtl(this.revAdd,this.revAdd1,this.search,res);
  //     if(res=='rtl'){
  //       this.messages.notify(this.ltr);
  //   }else if(res=='ltr'){
  //       this.messages.notify(this.rtl);
  //   }
  // })
}    
ngAfterViewInit(): void {
this.commonserviceService.onUserLanguageDirections.subscribe(res => {
  this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
 })
}
/* 
@Type: File, <ts>
@Name: userSmsList function
@Who: Nitin Bhati
@When: 25-Dec-2020
@Why: ROST-488
@What: service call for creating Sms data
*/
userSmsList(pagesize,pagneNo,sortingValue,searchVal, idName, idSms)
{
 this.loading=true;
 this.systemSettingService.fetchSmsList(pagesize,pagneNo,sortingValue,searchVal, idName, idSms).subscribe(
   repsonsedata=>{     
     if(repsonsedata['HttpStatusCode']=='200' || repsonsedata['HttpStatusCode'] == '204')
     {
       this.loading=false;
       /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
       this.totalDataCount=repsonsedata['TotalRecord'];
       this.listView=repsonsedata['Data'];
       this.listData=repsonsedata['Data'];
     }else
     {
       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
       this.loading=false;
     }
   },err=>{
      this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
     
     })
}
/* 
@Type: File, <ts>
@Name: userSmsList function
@Who: Nitin Bhati
@When: 25-Dec-2020
@Why: ROST-488
@What: service call for searching Sms data
*/
userSmsListSearch(event: any)
{
 this.searchChar=event.target.value;
 let numberOfCharacters = event.target.value.length;
 this.pagneNo=1;
 let maxNumberOfCharacters = 3;
 if(numberOfCharacters<1 ||numberOfCharacters>3){
 if (numberOfCharacters > maxNumberOfCharacters) {
this.loadingPopup=false;
this.systemSettingService.fetchSmsListSearch(this.searchChar).subscribe(
   repsonsedata=>{     
   this.loadingPopup=false;
     this.listData=repsonsedata['Data'];
    },err=>{
      this.loadingPopup=false;
   this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
 
   })
 }else{
  this.systemSettingService.fetchSmsList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue, this.idName, this.idSms).subscribe(
    repsonsedata=>{     
      this.listData=repsonsedata['Data'];
     },err=>{
      this.loading=false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}
}
}
/* 
@Type: File, <ts>
@Name: addHandler function
@Who: Nitin Bhati
@When: 15-Dec-2020
@Why: ROST-487
@What: FOR opening the Handling event
*/ 
public addHandler() {
  this.isNew = true;
  }
  public editHandler({dataItem}) {
   this.isNew = false;
  }
/* 
@Type: File, <ts>
@Name: openForm function
@Who: Nitin Bhati
@When: 15-Dec-2020
@Why: ROST-487
@What: FOR opening the form on button click event
*/
  public openForm(formType,id) {
  this.formtitle = formType;
  this.active = true;
  this.smsById = this.listView.filter(x => x['Id'] == id);
  if (id != '') {
    this.editForm(this.smsById);
  }
 }
/*
  @Type: File, <ts>
  @Name: editForm function
  @Who: Nitin Bhati
  @When: 25-dec-2020
  @Why: use for set value in patch file for showing information.
  @What: .
*/
editForm(items) {
this.addUserSmsForm.patchValue({
  id: items[0].Id,
  name: items[0].Title,
  smsbody: items[0].SmsBody,
  moduleId:items[0].ModuleId,
  statusId:items[0].StatusId
});
this.smstemplateDescriptuion=items[0].SmsBody;
this.activestatus = 'Update';
this.countCharector();
}
/* 
@Type: File, <ts>
@Name: onCancel function
@Who: Nitin Bhati
@When: 15-Dec-2020
@Why: ROST-487
@What: FOR closing the form on button click event
*/
  public onCancel(e): void {
      this.formtitle='grid';
      this.active = true;
       this.addUserSmsForm.reset();
      this.activestatus='Add';
      this.addUserSmsForm.patchValue({
        moduleId:0,
        statusId:1
      });

    }    
/* 
@Type: File, <ts>
@Name: closeForm function
@Who: Nitin Bhati
@When: 15-Dec-2020
@Why: ROST-487
@What: FOR closing the form on button click event
*/
    private closeForm(): void {
      this.active = false;
      this.cancel.emit();
    }  
/* 
@Type: File, <ts>
@Name: onSave function
@Who: Nitin Bhati
@When: 14-Dec-2020
@Why: ROST-486
@What: FOR creating groups data
*/
onSave(value,actionStatus) {
      this.submitted = true;
      if (this.addUserSmsForm.invalid) {
        return;
      }
      this.onTitleChanges(value);
   }
/* 
@Type: File, <ts>
@Name: adduserSms function
@Who: Nitin Bhati
@When: 15-Dec-2020
@Why: ROST-487
@What: service call for creating Sms data
*/
onChangeModule(moduledata){
 this.selectedModuleName=this.moduleArray.filter(s =>s.ModuleId===moduledata)[0].ModuleName;

}
adduserSms(value)
{
  let status = value.statusId;
  if (status == '1') {
    value['Status']='Active';
    } else {
      value['Status']='Inactive';
    }
  value['ModuleName']=this.selectedModuleName;
  this.pagneNo=1;
  this.submitted = true;
  if (this.addUserSmsForm.invalid) {
  return;
  }else
  {
    this.loading=true;
    this.systemSettingService.userSMSCreate(value).subscribe(
      repsonsedata=>{     
        this.loading=false;
        if(repsonsedata.HttpStatusCode==200)
        {
          this.active = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.addUserSmsForm.reset();
          this.addUserSmsForm.patchValue({
            moduleId:0,
            statusId:1
          });
          this.searchValue='';
          this.userSmsList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue, this.idName, this.idSms);
          this.formtitle = 'grid';
        }else{
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading=false;
        }
      },err=>{
        this.loading=false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    
      })
}
}
/* 
@Type: File, <ts>
@Name: edituserSms function
@Who: Nitin Bhati
@When: 15-Dec-2020
@Why: ROST-488
@What: service call for update sms data
*/
edituserSms(value)
{
//this.pagneNo=1;// commented by priti ,@why:EWM-1325 date:12-april-2021
let status = value.statusId;
if (status == '1') {
  value['Status']='Active';
  } else {
    value['Status']='Inactive';
  }
  value['ModuleName']=this.selectedModuleName;
 this.submitted = true;
 if (this.addUserSmsForm.invalid) {
 return;
 }else
 {
   this.loading=true;
   this.systemSettingService.updateSms(value).subscribe(
     repsonsedata=>{     
       this.loading=false;
       if(repsonsedata.HttpStatusCode==200)
       {
         this.active = false;
         this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
         this.addUserSmsForm.reset();
         this.addUserSmsForm.patchValue({
          moduleId:0,
          statusId:1
        });
         this.activestatus = 'Add'; // added by priti to handle add after Update date:11-jan-2021
         this.userSmsList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue, this.idName, this.idSms);
         this.formtitle = 'grid';
       }else{
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
         this.loading=false;
       }
     },err=>{
      this.loading=false;
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
switchListMode(viewMode){
  let listHeader = document.getElementById("listHeader");
  if(viewMode==='cardMode'){
    this.maxCharacterLength=80;
    this.maxCharacterLengthName=40;
    this.viewMode = "cardMode";
    this.isvisible=true;
  }else{
    this.maxCharacterLength=80;
    this.maxCharacterLengthName=40;
    this.viewMode = "listMode";
    this.isvisible=false;
    listHeader.classList.remove("hide");
  }
}
/**
  @(C): Entire Software
  @Type: personChangeAction
  @Who:  Nitin Bhati
  @When: 15-Dec-2020
  @Why:  ROST-487
  @What: This function responsible to change person tag list
 */
personChangeAction(person) {
  this.personTag=person;
   }
/**
  @(C): Entire Software
  @Type: personChangeClick
  @Who:  Nitin Bhati
  @When: 13-Jan-2021
  @Why:  EWM-693
  @What: This function responsible to change person tag list
 */
personChangeClick() {
  if(this.personTag!==''){
    if(this.smstemplateDescriptuion==null){
      this.smstemplateDescriptuion='';
      this.smstemplateDescriptuion=this.smstemplateDescriptuion.concat('{{',this.personTag,'}}').replace(/<p>/g,'');
    }else{
      this.smstemplateDescriptuion=this.smstemplateDescriptuion.concat('{{',this.personTag,'}}').replace(/<p>/g,'');
    }
  }

 }
/**
  @(C): Entire Software
  @Type: jobChangeAction
  @Who:  Nitin Bhati
  @When: 15-Dec-2020
  @Why:  ROST-487
  @What: This function responsible to change Job tag list
 */
jobChangeAction(jobtag) {
 this.jobTag=jobtag;
}
/**
  @(C): Entire Software
  @Type: jobChangeClick
  @Who:  Nitin Bhati
  @When: 13-Jan-2021
  @Why:  EWM-693
  @What: This function responsible to change Job tag list
 */
jobChangeClick() {
if(this.jobTag!==''){
  if(this.smstemplateDescriptuion==null){
    this.smstemplateDescriptuion='';
    this.smstemplateDescriptuion=this.smstemplateDescriptuion.concat('{{',this.jobTag,'}}').replace(/<p>/g,'');
  }else{
    this.smstemplateDescriptuion=this.smstemplateDescriptuion.concat('{{',this.jobTag,'}}').replace(/<p>/g,'');
  }
 }

}
/**
  @(C): Entire Software
  @Type: getShowDataList
  @Who:  Nitin Bhati
  @When: 15-Dec-2020
  @Why:  ROST-487
  @What: This function responsible to change data in HTML editor
 */
getShowDataList(value)
{
this.smstemplateDescriptuion=value;
}
/* 
@Type: File, <ts>
@Name: DeleteSmsInfo function 
@Who: Nitin Bhati
@When: 26-Nov-2020
@Why: ROST-428
@What: call Api for delete record using ID.
*/
public deletestatus:boolean;
 DeleteSmsInfo(val): void {
 const formData = {  
  SmsId: val 
};
  const message = `label_titleDialogContent`;
  const subtitle='label_smsTemplate';
  const title='';
  const dialogData = new ConfirmDialogModel(title,subtitle, message);
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated','animate__zoomIn'],
    disableClose: true,
});
  dialogRef.afterClosed().subscribe(dialogResult => {
    this.result = dialogResult;
    if(dialogResult==true){
      this.loading=true;
      this.systemSettingService.deleteSms(val).subscribe(
        repsonsedata=>{     
          this.active = false;
          this.loading=false;
          if(repsonsedata['HttpStatusCode']==200){
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            this.pagneNo=1;
            this.userSmsList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue, this.idName, this.idSms);
            this.addUserSmsForm.reset();
          }else{
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
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
  /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
  if(this.totalDataCount>this.listData.length){
  this.pagneNo = this.pagneNo + 1;
  this.userSmsListScroll(this.pagesize, this.pagneNo, this.sortingValue);
  }
  else{this.loadingscroll = false;}

} else {
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
 this.systemSettingService.fetchSmsList(pagesize,pagneNo,sortingValue,this.searchValue, this.idName, this.idSms).subscribe(
   repsonsedata=>{    
     if(repsonsedata['HttpStatusCode']=='200' || repsonsedata['HttpStatusCode'] == '204')
     {
       this.loadingscroll=false;
      let nextgridView = [];
       nextgridView = repsonsedata['Data'];
       this.listData = this.listData.concat(nextgridView);
       this.listView=this.listData;
      
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
this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
this.ascIcon='north';
this.descIcon='south';
this.sortingValue=this.sortedcolumnName+' '+this.sortDirection;
this.pagneNo=1;
this.systemSettingService.fetchSmsList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue, this.idName, this.idSms).subscribe(
  repsonsedata => {
    if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
      document.getElementById('contentdata').scrollTo(0,0)
      this.loading = false;
      this.listData = repsonsedata['Data'];
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
@Name: onTitleChanges function
@Who: Renu
@When: 06-Jan-2020
@Why: EWM-640
@What: This function is used for checking duplicacy for role Name
*/
onTitleChanges(value)
{
let tempID = this.addUserSmsForm.get("id").value;
if(tempID == '') {
  tempID = 0;
}else if(tempID == null)
{
  tempID = 0;
}
if(this.addUserSmsForm.get("name").value){
this.systemSettingService.checkSmsTitleDuplicacy('?Title=' + this.addUserSmsForm.get("name").value + '&Id='+tempID ).subscribe(
  repsonsedata=>{     
   if(repsonsedata['HttpStatusCode']==200)
    {
      if(repsonsedata['Data'] == true) {
        this.addUserSmsForm.get("name").setErrors({ codeTaken: true });
        this.addUserSmsForm.get("name").markAsDirty();
      }else if(repsonsedata['Data'] == false) {
        this.addUserSmsForm.get("name").clearValidators();
        this.addUserSmsForm.get("name").markAsPristine();
        this.addUserSmsForm.get('name').setValidators([Validators.required,Validators.maxLength(100),Validators.minLength(2),Validators.pattern(this.specialcharPattern)]);

        if(value){
          if (this.activestatus == 'Update') {
            this.edituserSms(value);
          } else {
            this.adduserSms(value);
          }
        }
        }
        
    }
    else{
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
      this.loading=false;
    }
  },
  err=>{
    this.loading=false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  
});
}else
{
  this.addUserSmsForm.get('name').setValidators([Validators.required,Validators.maxLength(100),Validators.minLength(2),Validators.pattern(this.specialcharPattern)]);

}
this.addUserSmsForm.get('name').updateValueAndValidity();
}
countCharector()
{
if(this.smstemplateDescriptuion){
this.remainingchr=1600-this.smstemplateDescriptuion.length;
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

  reloadApiBasedOnorg(){
    this.userSmsList(this.pagesize, this.pagneNo, this.sortingValue,this.searchValue, this.idName, this.idSms);
    this.formtitle='grid';
    }
}
