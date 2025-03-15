/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 23-Nov-2021
  @Why: EWM-3856
  @What: this section handle all quick client Details component related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable,Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { customDropdownConfig } from '../../../shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { ClientService } from '../../../shared/services/client/client.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { RouterData } from '@app/shared/enums/router.enum';

@Component({
  selector: 'app-quick-client-details',
  templateUrl: './quick-client-details.component.html',
  styleUrls: ['./quick-client-details.component.scss']
})
export class QuickClientDetailsComponent implements OnInit {

 
  /**********************global variables decalared here **************/
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addCompanyForm: FormGroup;
  public userTypeList: any = [];
  public brandList: any = [];
  public industryList: any = [];
  public subIndustryList: any = [];
  public subIndustryListId: any = [];
  public selected :any=[];
  public statusList: any = [];
  public locationTypeList: any = [];
  public reasonList: any = [];
  public companyList: any = [];
  public selectedValue: any;
  events: Event[] = [];
  public selectedSubIndustryIdValue: any;
  public client:any;
  public ClientDataById: any;
  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = {};
  public ClientIndustries: any[] = [];
  public resetFormSubjectSubIndustry: Subject<any> = new Subject<any>();
  public dropDownSubIndustryConfig: customDropdownConfig[] = [];
  public selectedSubIndustry: any = {};
  public ClientSubIndustries: any[] = [];
  public isEditForm : boolean;
  public customerTypeList : boolean;

  groupCodeQuickClientDetailsPage: any;
  public clientshopId: any;
  loadingSearch: boolean;
  public searchValue: string = "";
  public searchVal: string = "";
  public userpreferences: Userpreferences;

  animationVar:any;
  regonStatu: any;
  statusregoenList: any;
  reasonId:string;
  inputValue: any;
  selectedStatus: any;
  public leadName:String;
  public leadGeneratedOn:String;
  public LeadGeneratedBy:String;
  public LeadWorkflow:String;
  clientLeadType: string;
  pathNameLead: string='/client/leads/lead/lead-landing';
  pathNameClient: string='/client/core/clients/list';
  PageUrl: string;
  clientLeadTypeLabel:string='label_clientDetails';
  currentStartDate: any = new Date();
  getDateFormat: string;
  public dropDownLeadSourceMasterConfig: customDropdownConfig[] = [];
  public selectedLeadSource: any = {};
  public dropDownWorkFlowNameConfig: customDropdownConfig[] = [];
  public selectedLeadGeneratedby: any = [];
  public leadGeneratedbyConfig: DRP_CONFIG;
  public dropDownJobWorkflowConfig: customDropdownConfig[] = [];
  public selectedJobWorkflow: any = {};
  pageNameDRPObj = {
    pageName: 'jobManage',
    mode: 'add'
  }
  SecondresetRelattedUserDrp: Subject<any> = new Subject<any>();
  leadWorkflowId: any;
  leadWorkflowIdName: any;
  PreviousLeadWorkflow: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<QuickClientDetailsComponent>,private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    public _userpreferencesService: UserpreferencesService,
    private serviceListClass: ServiceListClass,private _clientService: ClientService,
    private appSettingsService: AppSettingsService,private _appSetting: AppSettingsService,) {
      this.groupCodeQuickClientDetailsPage = this._appSetting.groupCodeQuickClientDetailsPage;
      this.addCompanyForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(100)]],
      IndustryId: [],
      SubIndustryId: [],
      brandId: [],
      parentCompany: [],
      temptype: [null],
      tempStatus: [null, [Validators.required]],
      reasonStatus: [],
      SourceName: [''],
      SourceId: ['00000000-0000-0000-0000-000000000000'],
      LeadGeneratedbyId: ['00000000-0000-0000-0000-000000000000'],
      LeadGeneratedbyName: [''],
      DateStart: [null, [CustomValidatorService.dateValidator]],
      WorkFlowId: [''],
      WorkFlowName: [''],
    });
    if (this.data?.clientDetailsData != undefined) {
      this.ClientDataById=this.data?.clientDetailsData;
      this.regonStatu=this.ClientDataById;
      this.clientshopId=this.ClientDataById.ClientId;
    }
  this.clientLeadType=this.data?.clientLeadType;
 ////// Industry//////////////
 this.dropDownIndustryConfig['IsDisabled'] = false;
 this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll+ '?PageNumber=1&PageSize=500' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
//  this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll+ '?PageNumber=1&PageSize=500';
 this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
 this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
 this.dropDownIndustryConfig['IsRequired'] = false;
 this.dropDownIndustryConfig['searchEnable'] = true;
 this.dropDownIndustryConfig['bindLabel'] = 'Description';
 this.dropDownIndustryConfig['multiple'] = true;

 //////Sub Industry//////////////
 this.dropDownSubIndustryConfig['IsDisabled'] = false;
 this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAllWithoutID + '?PageNumber=1&PageSize=500'+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
//  this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAllWithoutID+ '?PageNumber=1&PageSize=500';
 this.dropDownSubIndustryConfig['placeholder'] = 'quickjob_subIndustry';
 this.dropDownSubIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
 this.dropDownSubIndustryConfig['IsRequired'] = false;
 this.dropDownSubIndustryConfig['searchEnable'] = true;
 this.dropDownSubIndustryConfig['bindLabel'] = 'Description';
 this.dropDownSubIndustryConfig['multiple'] = true;

 this.dropDownLeadSourceMasterConfig['IsDisabled'] = false;
    this.dropDownLeadSourceMasterConfig['apiEndPoint'] = this.serviceListClass?.getLeadSourceMaster+ '?PageNumber=1&PageSize=200' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownLeadSourceMasterConfig['placeholder'] = 'label_LeadSource';
    this.dropDownLeadSourceMasterConfig['IsManage'] = '/client/core/administrators/lead-source';
    this.dropDownLeadSourceMasterConfig['IsRequired'] = false;
    this.dropDownLeadSourceMasterConfig['searchEnable'] = true;
    this.dropDownLeadSourceMasterConfig['bindLabel'] = 'Name';
    this.dropDownLeadSourceMasterConfig['multiple'] = false;
    this.dropDownLeadSourceMasterConfig['isClearable'] = true;

    this.dropDownWorkFlowNameConfig['IsDisabled'] = false;
    this.dropDownWorkFlowNameConfig['apiEndPoint'] = this.serviceListClass?.getClientWorkflowAll + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND';
    this.dropDownWorkFlowNameConfig['placeholder'] = 'label_ClientWorkflow';
    this.dropDownWorkFlowNameConfig['IsManage'] = '';
    this.dropDownWorkFlowNameConfig['IsRequired'] = true;
    this.dropDownWorkFlowNameConfig['searchEnable'] = true;
    this.dropDownWorkFlowNameConfig['bindLabel'] = 'WorkflowName';
    this.dropDownWorkFlowNameConfig['multiple'] = false; 

  }
  ngOnInit() {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    this.tenantBrandList();
    this.getLocationType();
    this.bindConfigUserInvitation();
    // who:this.openModelContactRelatedSearch,what:ewm-12030 for manage and refresh and search value this.getStatusGroupCode(),when:05/05/2023
    // this.getStatusGroupCode();
    this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, this.searchValue);

    this.tenantParentCompanyList();
   
    //this.ClientDataById=this.data?.clientDetailsData;
    this.addCompanyForm.patchValue({
      'companyName': this.ClientDataById?.ClientName,
      'industry': this.ClientDataById?.Industry,
      'subIndustry': this.ClientDataById?.SubIndustry,
      //'brandId': this.ClientDataById.BrandId.toString(),
      'temptype': this.ClientDataById?.TypeId===0?null:this.ClientDataById?.TypeId.toString(),
      'tempStatus': this.ClientDataById?.StatusId,
      //'reasonStatus': this.ClientDataById.ReasonId.toString(),
     // 'parentCompany': this.ClientDataById.ParentId,  
     });
    const typeControl = this.addCompanyForm.get('temptype');
    if(this.clientLeadType==='LEAD'){
      this.leadName=this.data?.clientDetailsData?.LeadSourceName;
      this.LeadGeneratedBy=this.data?.clientDetailsData?.LeadGeneratedbyName;
      this.LeadWorkflow=this.data?.clientDetailsData?.ClientWorkflowName;
      this.PreviousLeadWorkflow=this.ClientDataById?.ClientWorkflow;
     // this.clientLeadType=this.data?.clientLeadType;
      
      this.selectedLeadSource=(this.ClientDataById?.LeadSourceId==='00000000-0000-0000-0000-000000000000')?{}:{Id:this.ClientDataById?.LeadSourceId,Name:this.ClientDataById?.LeadSourceName};
      this.selectedJobWorkflow={Id:this.ClientDataById?.ClientWorkflow,Name:this.ClientDataById?.ClientWorkflowName,WorkflowName:this.ClientDataById?.ClientWorkflowName};
      this.selectedLeadGeneratedby={Id:this.ClientDataById?.LeadGeneratedbyId,UserName:this.ClientDataById?.LeadGeneratedbyName};
      this.SecondresetRelattedUserDrp.next(this.leadGeneratedbyConfig);
      //this.selectedLeadSource = this.ClientDataById?.LeadSourceId;
      //this.selectedLeadGeneratedby = this.ClientDataById?.LeadGeneratedbyId;
      //this.selectedJobWorkflow = this.ClientDataById?.ClientWorkflow;
      if(this.ClientDataById?.LeadGeneratedOn===0){
        this.currentStartDate=null;
        this.addCompanyForm.patchValue({
          'DateStart': null,
           });
      }else{
        this.addCompanyForm.patchValue({
          'DateStart': this.data?.clientDetailsData?.LeadGeneratedOn,
           });
        this.currentStartDate=new Date(this.data?.clientDetailsData?.LeadGeneratedOn);
      }
      typeControl?.clearValidators();
      this.clientLeadTypeLabel='label_LeadDetails';
      this.PageUrl= window?.location?.origin+this.pathNameLead;
      this.addCompanyForm.controls['parentCompany']?.disable();
      this.addCompanyForm.controls['tempStatus']?.disable();
      this.addCompanyForm.controls['reasonStatus']?.disable();
    }else{
      typeControl.setValidators([Validators.required]);
      this.PageUrl= window?.location?.origin+this.pathNameClient;
      this.clientLeadTypeLabel='label_clientDetails';
    }
    typeControl?.updateValueAndValidity(); // Notify Angular of the change
    if(this.ClientDataById.ParentId==='00000000-0000-0000-0000-000000000000'){
      this.addCompanyForm.patchValue({
        'parentCompany': null,
         });
    }else{
      this.addCompanyForm.patchValue({
        'parentCompany': this.ClientDataById.ParentId,
         });
    }
    
    if(this.ClientDataById.BrandId===0){
      this.addCompanyForm.patchValue({
        'brandId': null,
         });
    }else{
      this.addCompanyForm.patchValue({
        'brandId': this.ClientDataById.BrandId.toString(),
         });
    }

  setTimeout(() => {
    if(this.ClientDataById.ReasonId===0){
      this.addCompanyForm.patchValue({
        'reasonStatus': null,
         });
    }else{
      this.addCompanyForm.patchValue({
        'reasonStatus': this.ClientDataById.ReasonId.toString(),
         });
    }
  }, 1000);

  
    this.selectedIndustry = this.ClientDataById.Industry;
    this.ClientIndustries = this.ClientDataById.Industry;
    this.selectedSubIndustry = this.ClientDataById.SubIndustry;
    this.ClientSubIndustries = this.ClientDataById.SubIndustry;
    // this.regonStatu = {Code:"Active", Id:this.ClientStatusActiveKey}
    // this.tenantReasonGropCodeList(status,this.searchVal); 
    // who:this.openModelContactRelatedSearch,what:ewm-12030 for manage and refresh and search value this.searchVal,when:05/05/2023
    this.tenantReasonGropCodeList(this.ClientDataById.StatusId,this.searchVal)


   
  }
  /* 
    @Type: File, <ts>
    @Name: onUpdate
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: For Update client details data
  */
    onUpdate(value): void {
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = this.ClientDataById;
   
    toObj['ClientId'] = this.ClientDataById.ClientId;
    // <!-- who:maneesh,what:ewm-13530 for trim data,When:25/07/2023 -->
    toObj['ClientName'] = this.addCompanyForm.value.companyName?.trim();
    toObj['Industry'] = this.ClientIndustries;
    toObj['SubIndustry'] =this.ClientSubIndustries;
    toObj['BrandId'] = Number(this.addCompanyForm.value.brandId);
    toObj['Brand'] = this.addCompanyForm.value.parentCompany;
    toObj['TypeId'] = Number(this.addCompanyForm.value.temptype);
    toObj['Type'] = this.addCompanyForm.value.temptype;
    toObj['StatusId'] = this.addCompanyForm.getRawValue().tempStatus;
    toObj['Status'] = this.addCompanyForm.getRawValue().tempStatus;
    toObj['ReasonId'] = Number(this.addCompanyForm.getRawValue().reasonStatus);
    toObj['Reason'] = this.addCompanyForm.getRawValue().reasonStatus;
    toObj['ParentId'] = this.addCompanyForm.getRawValue().parentCompany?this.addCompanyForm.getRawValue().parentCompany:'00000000-0000-0000-0000-000000000000';
    toObj['ParentName'] = this.addCompanyForm.value.parentCompany;
    toObj['PageURL'] = this.PageUrl;
    if(this.clientLeadType==='LEAD'){
      toObj['LeadSourceId'] = this.selectedLeadSource?.Id;
      toObj['LeadSourceName'] = this.selectedLeadSource?.Name;
      toObj['ClientWorkflow'] = this.selectedJobWorkflow?.Id;
      toObj['ClientWorkflowName'] = this.selectedJobWorkflow?.WorkflowName;
      toObj['LeadGeneratedbyId'] = this.selectedLeadGeneratedby?.Id;
      toObj['LeadGeneratedbyName'] = this.selectedLeadGeneratedby?.UserName;
      toObj['GeneratedOn'] = this.addCompanyForm.value?.DateStart;
      toObj['IsLead'] = 1;
    }else{
      toObj['IsLead'] = 0;
    }

    this.leadWorkflowId=this.selectedJobWorkflow?.Id;
    this.leadWorkflowIdName=this.selectedJobWorkflow?.WorkflowName;
    const router = RouterData.clientSummery;
    const baseUrl = window.location.origin;
    
     updateObj = [{
      "From": fromObj,
      "To": toObj,
      'ShareClientURL':baseUrl+router
    }];
     this._clientService.updateQuickClientDetails(updateObj[0]).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addCompanyForm.reset();
          document.getElementsByClassName("quickCompany")[0].classList.remove("animate__fadeInDownBig")
          document.getElementsByClassName("quickCompany")[0].classList.add("animate__fadeOutUpBig");
          setTimeout(() => { this.dialogRef.close({resp:true,leadWorkflowId:this.leadWorkflowId,leadWorkflowIdName:this.leadWorkflowIdName,previousleadWorkflowId:this.PreviousLeadWorkflow}); }, 200);
      
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
  
  }

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: Function will call when user click on EDIT BUUTONS.
  */
  onDismiss(): void {
    document.getElementsByClassName("quickCompany")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("quickCompany")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

/* 
    @Type: File, <ts>
    @Name: getLocationType
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: For get Location Type .
  */
  getLocationType() {
    this.systemSettingService.getLocationTypeListAll('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
     (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
         this.locationTypeList = repsonsedata.Data;
       } else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
       }
     }, err => {
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

     })
 }

 getCustomerAllList() {
  this.systemSettingService.getCustomerAllList().subscribe(
   (repsonsedata: ResponceData) => {
     if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
       this.customerTypeList = repsonsedata.Data;
     } else {
       this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
     }
   }, err => {
     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

   })
}
  /*
    @Type: File, <ts>
    @Name: getStatusGroupCode
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: To get Data from people type will be from user types where type is Client
    */
    getStatusGroupCode(groupCodeQuickClientDetailsPage,searchValue) {
      // let groupCode = 'e26277ba-3a40-4e42-825a-ed5198219d01'
     this.systemSettingService.getStatusGroupCodesearchValue(groupCodeQuickClientDetailsPage, searchValue +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&StatusFor='+this.clientLeadType).subscribe(
        (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data[0].statuses;
         this.statusregoenList = repsonsedata.Data[0]?.statuses[0]?.Id;         
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
/*
    @Type: File, <ts>
    @Name: tenantUserTypeList
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: To get Data from Client type will be from user types where type is Client
    */
  tenantReasonGropCodeList(statusId,inputValue) {
    // who:maneesh,what:ewm-11606 for refresh regon button,when:05/05/2023
    this.inputValue=inputValue
    if (inputValue==null) {
          this.inputValue=''
       }
    // who:maneesh,what:ewm-11606 for status id ,When:14/05/2023
    this.selectedStatus = statusId;  
  if(statusId != undefined && statusId != null && statusId != " "){
    this.addCompanyForm.get("reasonStatus").reset()
    this.systemSettingService.getReasonStatusGroupCodesearchValue(statusId , this.inputValue +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
       (repsonsedata: ResponceData) => {
         if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
           this.reasonList = repsonsedata.Data[0].reasons;
           this.reasonId = repsonsedata.Data[0].StatusId;           
           } else {
           //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
         }
       }, err => {
         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
 
       })
  }
  }
 /*
    @Type: File, <ts>
    @Name: tenantSubIndustryList
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: To get Data from sub-industry 
    */
    onIndustrychange(data) {
      if (data == null || data == "" || data.length == 0) {
        this.selectedIndustry = null;
        this.selectedSubIndustry = null;
        this.addCompanyForm.patchValue(
          {
            IndustryId: "00000000-0000-0000-0000-000000000000",
            SubIndustryId:"00000000-0000-0000-0000-000000000000" ,
          })
           this.ClientIndustries=  [];
          this.ClientSubIndustries = [];
        // this.addCompanyForm.get("IndustryId").setErrors({ required: true });
        // this.addCompanyForm.get("IndustryId").markAsTouched();
        // this.addCompanyForm.get("IndustryId").markAsDirty();
      }
      else {
        this.addCompanyForm.get("IndustryId").clearValidators();
        this.addCompanyForm.get("IndustryId").markAsPristine();
        this.selectedIndustry = data;
        this.ClientIndustries = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          this.ClientIndustries.push({ Id: element.Id, Name: element.Description })
        }
        const industryId = data.map((item: any) => {
          return item.Id
        });
        this.addCompanyForm.patchValue(
          {
            IndustryId: industryId
          }
        )
        //////Sub Industry//////////////
        // this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + industryId 
        this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + industryId+ '&PageNumber=1&PageSize=500' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';;
        this.resetFormSubjectSubIndustry.next(this.dropDownSubIndustryConfig);
      }
      this.clickIndustryGetSubIndustry();
    }
 /*
    @Type: File, <ts>
    @Name: clickIndustryGetSubIndustry
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: To get Data from clickIndustryGetSubIndustry 
    */
    clickIndustryGetSubIndustry() {
      let Id = this.addCompanyForm.get('IndustryId').value;
      let id = Id;
       this.systemSettingService.getSubIndustryListAll(id).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.subIndustryList = repsonsedata.Data;
            this.cancelIndustryUpdateSubIndustry(this.subIndustryList);
          }
  
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          // this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

    /*
    @Type: File, <ts>
    @Name: onSubIndustrychange
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: To get Data from onSubIndustrychange 
    */
    onSubIndustrychange(data) {
      if (data == null || data == "" || data.length == 0) {
        this.selectedSubIndustry = null;
        this.addCompanyForm.patchValue(
          {
            SubIndustryId: null
          });
          this.ClientSubIndustries = [];
        // this.addCompanyForm.get("SubIndustryId").setErrors({ required: true });
        // this.addCompanyForm.get("SubIndustryId").markAsTouched();
        // this.addCompanyForm.get("SubIndustryId").markAsDirty();
      }
      else {
        this.addCompanyForm.get("SubIndustryId").clearValidators();
        this.addCompanyForm.get("SubIndustryId").markAsPristine();
        this.selectedSubIndustry = data;
        this.ClientSubIndustries = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          this.ClientSubIndustries.push({ Id: element.Id, Name: element.Description })
        }
        const subIndustryId = data.map((item: any) => {
          return item.Id
        });
        this.addCompanyForm.patchValue(
          {
            SubIndustryId: subIndustryId
          }
        )
  
      }
    }

  /* 
@Type: File, <ts>
@Name: cancelIndustryUpdateSubIndustry function
@Who: Nitin Bhati
@When: 23-Nov-2021
@Why: EWM-3856
@What: get sub industry List by industry id
*/
cancelIndustryUpdateSubIndustry(data) {
  const subId = data.map((item: any) => {
    return item.Id
  });
  //filter common id/value b/w two array
  const commonSubIndustryId = subId.filter(e => this.addCompanyForm.get('subIndustry').value.indexOf(e) !== -1);
  this.selectedSubIndustryIdValue = commonSubIndustryId;

}

   /*
    @Type: File, <ts>
    @Name: tenantBrandList
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: To get Data from Brand 
    */
  tenantBrandList() {
    this.systemSettingService.getBrandAllListAll('?FilterParams.ColumnName=statusname&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.brandList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

   /*
    @Type: File, <ts>
    @Name: tenantParentCompanyList
    @Who: Nitin Bhati
    @When: 23-Nov-2021
    @Why: EWM-3856
    @What: To get Data from parent company 
    */
  // who:maneesh,what:ewm.9644 change filtervalue clientshopId ,when:03/01/2023
  tenantParentCompanyList() {
    this.systemSettingService.getParentCompanyAllEditClient('?ClientId='+this.clientshopId+'&ByPassPaging=true').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.companyList = repsonsedata.Data;
         } else {
         // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

 /* 
   @Type: File, <ts>
   @Name: duplicayCheck function
   @Who: Nitin Bhati
   @When: 23-Nov-2021
   @Why: EWM-3856
   @What: For checking duplicacy for code and description
  */
   duplicayCheck() {
    let duplicacyExist = {};
    let clientName = this.addCompanyForm.get("companyName").value;
    if (clientName == null) {
      clientName = 0;
    }
    if (clientName == '') {
      clientName = 0;
    }
  
    duplicacyExist['clientName'] = this.addCompanyForm.get("companyName").value;
    duplicacyExist['clientId'] = this.ClientDataById.ClientId;
if (clientName != '') {
  this.systemSettingService.checkCompanyNameDuplicacy(duplicacyExist).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 402) {
        if (repsonsedata.Status == false) {
         
          this.addCompanyForm.get("companyName").setErrors({ codeTaken: true });
          this.addCompanyForm.get("companyName").markAsDirty();
            //this.submitted = false;
          
        } 
       } else if (repsonsedata.HttpStatusCode === 204) {
       if (repsonsedata.Status == true) {     
            this.addCompanyForm.get("companyName").clearValidators();
            this.addCompanyForm.get("companyName").markAsPristine();
            this.addCompanyForm.get('companyName').setValidators([Validators.required, Validators.minLength(2),Validators.maxLength(100)]);
            this.addCompanyForm.get("companyName").updateValueAndValidity();
            // if (this.addForm && this.submitted == true) { 
            //   if (this.activestatus == 'Add') {
            //     this.createNoteCategoryMaster(this.addForm.value);
            //   } else if(this.activestatus == 'Edit') {
            //     this.updateNoteCategoryMaster(this.addForm.value);
            //   }
            // }
          
        }

      } else {
     
          this.addCompanyForm.get("companyName").clearValidators();
          this.addCompanyForm.get("companyName").markAsPristine();
          this.addCompanyForm.get('companyName').setValidators([Validators.required, Validators.minLength(2),Validators.maxLength(100)]);

        }
      
      // this.addForm.get('Code').updateValueAndValidity();
      // this.addForm.get('Description').updateValueAndValidity();

    },
    err => {
      //this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    });
}
   }

 /* 
   @Type: File, <ts>
   @Name: onClearData function
   @Who: maneesh
   @When: 11-may-2023
   @Why: EWM-11606
   @What: For clear data
  */
   onClearData(){
    this.addCompanyForm.get("reasonStatus").reset()
    this.addCompanyForm.get("tempStatus").reset()
   }
        /* 
       @Type: File, <ts>
       @Name: refreshRegon
       @Who:  maneesh
       @When: 05-may-2023
       @Why: EWM.11606
       @What:  for refresh Regon
     */
       refreshRegon(){
        this.tenantReasonGropCodeList(this.reasonId,this.searchVal)
      }
          /* 
       @Type: File, <ts>
       @Name: refreshRegon
       @Who:  maneesh
       @When: 05-may-2023
       @Why: EWM.11606
       @What:  for refresh status
     */
        refresh(){
          this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, this.searchValue);
        }
    /* 
     @Type: File, <ts>
     @Name: redirectRegon
     @Who:  maneesh
     @When: 05-may-2023
     @Why: EWM.11606
     @What: For redirect status
   */
     redirect() {    
      window.open('./client/core/administrators/group-master/status?groupId='+this.groupCodeQuickClientDetailsPage, '_blank');
    }
        /* 
       @Type: File, <ts>
       @Name: redirectRegon
       @Who:  maneesh
       @When: 05-may-2023
       @Why: EWM.11606
       @What: For redirect Regon data server side
     */
    redirectRegon() { 
    // who:maneesh,what:ewm-11606 for status id ,When:14/05/2023 --
  window.open('./client/core/administrators/group-master/reason?GroupId='+this.groupCodeQuickClientDetailsPage +'&statusId='+this.selectedStatus+'&V=listMode' +'&GroupCode=COMPANY');
    //  window.open('./client/core/administrators/group-master/status?groupId='+this.groupCodeQuickClientDetailsPage +'&statusId='+this.reasonId +'&GroupCode=COMPANY', '_blank');
    }
      /* 
       @Type: File, <ts>
       @Name: searchData
       @Who:  maneesh
       @When: 05/05-may-2023
       @Why: EWM.11606
       @What: For searching data server side
     */
       searchData(inputValue){
        // this.searchValue=inputValue;
        if (inputValue.length > 0 && inputValue.length < 3) {
          this.loadingSearch = false;
          return;
        }
        this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, inputValue)
      }
         /* 
       @Type: File, <ts>
       @Name: searchData
       @Who:  maneesh
       @When: 05/05-may-2023
       @Why: EWM.11606
       @What: For searching data server side
     */
       searchRegonData(inputValue){
        if (inputValue.length > 0 && inputValue.length < 3) {
          this.loadingSearch = false;
          return;
        }
        this.tenantReasonGropCodeList(this.ClientDataById.StatusId,this.searchVal)
      }
      /* 
       @Type: File, <ts>
       @Name: onSearchFilterClear
       @Who:  maneesh
       @When: 05/05-may-2023
       @Why: EWM.11606
       @What: For clear Filter search value
     */
       public onSearchResonFilterClear(): void {
        // this.loadingSearch = false;
        this.searchVal = '';    
        this.tenantReasonGropCodeList(this.ClientDataById.StatusId,this.searchVal)
      }
  /* 
       @Type: File, <ts>
       @Name: onSearchFilterClear
       @Who:  maneesh
       @When: 05/05-may-2023
       @Why: EWM.11606
       @What: For clear Filter search value
     */
       public onSearchFilterClear(): void {
        this.loadingSearch = true;
        this.searchValue = '';    
        this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, this.searchValue);
      }
            /* 
       @Type: File, <ts>
       @Name: mouseoverAnimation
       @Who:  maneesh
       @When: 05/05/2023
       @Why: EWM.11606
       @What:  animation for hover
     */
       mouseoverAnimation(matIconId, animationName) {
        let amin= localStorage.getItem('animation');
        if(Number(amin) !=0){
          document.getElementById(matIconId).classList.add(animationName);
        }
      }
        /* 
       @Type: File, <ts>
       @Name: mouseoverAnimation
       @Who:  maneesh
       @When: 05/05/2023
       @Why: EWM.11606
       @What:  animation for leave
     */
      mouseleaveAnimation(matIconId, animationName) {
        document.getElementById(matIconId).classList.remove(animationName)
      }


      bindConfigUserInvitation() {
        this.leadGeneratedbyConfig = {
          API: this.serviceListClass?.userInvitationsList + "?RecordFor=People&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND",
          MANAGE: '',
          BINDBY: 'UserName',
          REQUIRED: false,
          DISABLED: false,
          PLACEHOLDER: 'label_LeadGeneratedBY',
          SHORTNAME_SHOW: true,
          SINGLE_SELECETION: true,
          AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
          IMG_SHOW: false,
          EXTRA_BIND_VALUE: 'Email',
          IMG_BIND_VALUE: 'ProfileImageUrl',
          FIND_BY_INDEX: 'UserId'
        }
      }

      onLeadSourceChange(data) {
        this.selectedLeadSource = data;
        this.addCompanyForm?.patchValue(
          {
            SourceId: data?.Id,
            SourceName: data?.Name
          }
        )
      }

      onLeadGeneratedByChange(data) {
        if (data == null || data == "") {
          this.selectedLeadGeneratedby = null;
          this.addCompanyForm.patchValue(
            {
              LeadGeneratedbyId: null,
              LeadGeneratedbyName: null
            }
          )
        }
        else {
          this.selectedLeadGeneratedby = data;
          this.addCompanyForm.patchValue(
            {
              LeadGeneratedbyId: data?.Id,
              LeadGeneratedbyName: data?.UserName
            }
          )
        }
      }

      onWorkflowchange(data) {
        if (data == null || data == "") {
          this.selectedJobWorkflow = null;
          this.addCompanyForm?.patchValue(
            {
              WorkFlowId: null,
              WorkFlowName: null
            }
          )
          this.addCompanyForm.get("WorkFlowId").setErrors({ required: true });
          this.addCompanyForm.get("WorkFlowId").markAsTouched();
          this.addCompanyForm.get("WorkFlowId").markAsDirty();
        }
        else {
          this.addCompanyForm.get("WorkFlowId").clearValidators();
          this.addCompanyForm.get("WorkFlowId").markAsPristine();
          this.selectedJobWorkflow = data;
          this.addCompanyForm.patchValue(
            {
              WorkFlowId: data?.Id,
              WorkFlowName: data?.WorkflowName
            }
          )
        }
      }  

      clearEndDate() {
        this.currentStartDate=null;
        this.addCompanyForm.patchValue({
          DateStart: null
        });
      } 

}





