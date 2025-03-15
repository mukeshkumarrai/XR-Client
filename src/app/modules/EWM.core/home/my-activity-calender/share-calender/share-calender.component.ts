import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplatesComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/templates/templates.component';
import { CommonDropDownService } from '@app/modules/EWM.core/shared/services/common-dropdown-service/common-dropdown.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData, Userpreferences } from '@app/shared/models';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { ServiceListClass } from '@app/shared/services/sevicelist';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, GridDataResult, SelectableSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export interface UserList {
  Checked: unknown;
  UserID:  string;
  Name:    string;
  EmailId: string;
}
@Component({
  selector: 'app-share-calender',
  templateUrl: './share-calender.component.html',
  styleUrls: ['./share-calender.component.scss']
})
export class ShareCalenderComponent implements OnInit {
  gridData: GridDataResult = { data: [], total: 0 };
  employeeList: any;
  sharedUsers: any;
  loading: boolean;
  common_DropdownC_Config:DRP_CONFIG;
  public selectedEmp: any = {};
  sharedCalenderForm: FormGroup;
  ShowDate:boolean=false;
  ShowTemplateBtn:boolean=false
  dirctionalLang: string;
  tabActiveIndex: number=null;
  tabActive: string='';
  selectedTemplateId: number=null;
  labelName: number=0;
  selectableSettings:SelectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };
  public sizes = [50, 100, 200];
  todayFillDate = new Date();
private destroySubject: Subject<void> = new Subject();
  pagesize: number;
  public state: State = {};
  selectedEmployeesToRevoke: string[]=[];
  public userpreferences: Userpreferences;
  currentUserDetails: any={};
  dropdownInitilize:boolean = false;

  constructor(public dialogRef: MatDialogRef<ShareCalenderComponent>,private systemSettingService: SystemSettingService, public dialog: MatDialog,
    private serviceListClass: ServiceListClass,private fb: FormBuilder, private translateService: TranslateService,private dataService: CommonDropDownService,
    private snackBService: SnackBarService,private appSettingsService: AppSettingsService,public _userpreferencesService: UserpreferencesService) {
      this.sharedCalenderForm = this.fb.group({
        EmployeeIds: [,Validators.required],
        SharedTillDateChecked:[],
        SharedTillDate:[],
        ViewRights:[0],
        SendEmailCheck:[],
        EmailTemplateId:[],
        EmailTemplateTitle:[]
      });
      this.pagesize =  this.appSettingsService.pagesize;
    this.dropdownConfig();
    this.state={skip: 0,
      take: this.pagesize
    }
    this.currentUserDetails = JSON.parse(localStorage.getItem('currentUser'))
  }
  ngOnInit(): void {
    this.setValidators();
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
  setValidators(){
    this.sharedCalenderForm.get('SharedTillDateChecked').valueChanges
    .subscribe(value => {
      if(value){
        this.sharedCalenderForm.controls.SharedTillDate.setValidators([Validators.required]);
        this.sharedCalenderForm.controls.SharedTillDate.updateValueAndValidity();
      }else{
        this.sharedCalenderForm.controls.SharedTillDate.clearValidators();
        this.sharedCalenderForm.controls.SharedTillDate.updateValueAndValidity();
      }
    });
   
  }
  onDismiss() {
    document.getElementsByClassName("share-calender")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("share-calender")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  dropdownConfig(){
    this.common_DropdownC_Config = {
      API: this.serviceListClass.calendarnotsharedUserList,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_sharedCalenderEmployees',
      SHORTNAME_SHOW: true,
      SINGLE_SELECETION: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: 'EmailId',
      IMG_BIND_VALUE:'ProfileImage',
      FIND_BY_INDEX: 'UserID'
    }
  }
  onRelatedEmployeechange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedEmp = null;
      this.sharedCalenderForm.patchValue(
        {
          EmployeeIds:null
        });
      this.sharedCalenderForm.get("EmployeeIds").setErrors({ required: true });
      this.sharedCalenderForm.get("EmployeeIds").markAsTouched();
      this.sharedCalenderForm.get("EmployeeIds").markAsDirty();
    }
    else {
      this.sharedCalenderForm.get("EmployeeIds").clearValidators();
      this.sharedCalenderForm.get("EmployeeIds").markAsPristine();
      this.selectedEmp = data;
      this.sharedCalenderForm.patchValue({
        EmployeeIds: data?.Id
      });
    }
  }
  /* @Who: Renu @When: 04-Sept-2022 @Why: EWM-13753 EWM-1413 @What: to get value on checkbox selection */
  selectionChange(event:any){
    console.log(event)
    if(event?.length==1){
      this.selectedEmployeesToRevoke=event;
   }else{
    this.selectedEmployeesToRevoke=event;
   }
  }
/*  @Name: selectedCallback  @Who: Renu @When: 07-09-2023  @Why: EWM-13753 EWM-14131 @What: get all checkbox event */
public selectedCallback = (args: { dataItem: {}; }) => args.dataItem;
/* 
  /* @Who: Renu @When: 04-Sept-2022 @Why: EWM-13753 EWM-1413 @What: for the selection of template Id */
  openTemplateModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_insertTemplate';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(TemplatesComponent, {
      panelClass: ['xeople-modal-lg', 'add_template', 'animate__animated', 'animate__zoomIn'],
      data: {isMyActivity:true,selectedTemplateId:this.selectedTemplateId,tabActiveIndex:this.tabActiveIndex,tabActive:this.tabActive},
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != false) {
        this.selectedTemplateId = res.data.Id;
        this.tabActiveIndex = res.tabActiveIndex;
        this.tabActive = res.tabActive;
        this.loading = false;
         this.sharedCalenderForm.patchValue({
           'EmailTemplateId':res.data?.Id,
           'EmailTemplateTitle':res.data?.Title
         })
      }
    })
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  selectedTabValue(tab: { index: number; }) {
    this.sharedCalenderForm.reset();
    this.selectedEmp=null;
    this.labelName = tab.index;
    this.sharedCalenderForm.get('ViewRights').setValue(0);
    this.ShowTemplateBtn=false;
    this.ShowDate=false;
    this.selectedTemplateId=null;
    localStorage.removeItem('selectEmailTemp');
        this.tabActiveIndex = null;
        this.tabActive = '';
    if(this.labelName==1){
      this.getSharedCalenderUserList(this.state);
    }
    this.sharedCalenderForm.get('ViewRights').setValue(0);
  }
  revokeAccess(item: string[]){
      const message = '';
      const title = '';
      const subTitle = 'label_sharedCalenderevokeAcess';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.revokeSharedEmployees(item);
        }
      });
    }
  revokeSharedEmployees(item){
    this.systemSettingService.sharedCalenderUserDelete(item).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 ) {
          this.loading = false;
          this.selectedEmployeesToRevoke=[];
          this.getSharedCalenderUserList(this.state);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }
  /* @Name: getSharedCalenderUserList @Who: Renu @When: 29-Nov-2023 @Why:EWM-15176 EWM-15203 @What: for calender view list users whose access has been shared */
  getSharedCalenderUserList(state: State){
    this.loading = true;
    this.systemSettingService.sharedCalenderUserRevokeList(state).pipe(
      takeUntil(this.destroySubject)
    ).subscribe((response: GridDataResult) => {
        this.gridData = response;
        this.loading = false;
      
    }, err => {
           this.loading = false;
        });
   
  }
  resetRelattedUserDrp: Subject<any> = new Subject<any>();

  onConfromSharedCalender(){
    let value=this.sharedCalenderForm.value;
    let sharedCalenderObj={};
    sharedCalenderObj['UserList']=this.selectedEmp?.map((x,i) => {return {
      UserID:x['UserID'],
      Name:x['Name'],
      EmailId:x['EmailId']
    }})
    sharedCalenderObj['SharedTillDate']=value.SharedTillDateChecked?new Date(value?.SharedTillDate):null;
    sharedCalenderObj['View']=value?.ViewRights;
    sharedCalenderObj['IsSendEmail']=value?.SendEmailCheck?1:0;
    sharedCalenderObj['EmailTemplateId']=this.selectedTemplateId?this.selectedTemplateId:0;
    sharedCalenderObj['EmailProvider']=0;  /**0=System,1=Microsoft,2=Gmail**/
    sharedCalenderObj['UserEmail']=this.currentUserDetails?.EmailId;
    // sharedCalenderObj['TimeZone']=value.SharedTillDateChecked?this.currentUserDetails?.TimeZone:null;
    // sharedCalenderObj['TimeZoneId']=value.SharedTillDateChecked?this.currentUserDetails?.TimeZoneId:null;
    sharedCalenderObj['TimeZone']=value.SharedTillDateChecked && localStorage.getItem('TimeZone')!=='null'?localStorage.getItem('TimeZone'):null;
    sharedCalenderObj['TimeZoneId']=value.SharedTillDateChecked?localStorage.getItem('UserTimezone'):null;
    this.systemSettingService.sharedCalenderUserSave(sharedCalenderObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 ) {
          this.loading = false;
          this.sharedCalenderForm.reset();
          this.selectedEmp=null;
          // this.dataService.setSelectedData(this.selectedEmp);
          this.sharedCalenderForm.get("EmployeeIds").setErrors({ required: true });
          this.sharedCalenderForm.get('ViewRights').setValue(0);
          this.ShowTemplateBtn=false;
          this.ShowDate=false;
          this.selectedTemplateId=null;
          localStorage.removeItem('selectEmailTemp');
          this.tabActiveIndex = null;
          this.tabActive='';
          this.dropdownInitilize = true
          this.common_DropdownC_Config.API = this.serviceListClass.calendarnotsharedUserList;
          this.resetRelattedUserDrp.next(this.common_DropdownC_Config);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  ngOnDestroy(){
    this.destroySubject.next();
  }
  public dataStateChange(state:DataStateChangeEvent): void {
    this.selectedEmployeesToRevoke=[];
     this.state = state;
     this.getSharedCalenderUserList(state);
}
onEmailTemplateChange(event){
if(event.checked){
  this.ShowTemplateBtn=true;
}else{
  this.selectedTemplateId=null;
  localStorage.removeItem('selectEmailTemp');
  this.ShowTemplateBtn=false;
}
}

}