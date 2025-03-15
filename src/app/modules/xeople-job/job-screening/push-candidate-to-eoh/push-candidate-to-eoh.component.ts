import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CandidateService } from '@app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ProfileInfoService } from '@app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { PushCandidateEOHService } from '@app/modules/EWM.core/shared/services/pushCandidate-EOH/push-candidate-eoh.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { XeopleSearchService } from '@app/modules/EWM.core/shared/services/xeople-search/xeople-search.service';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { ResponceData } from '@app/shared/models/responce.model';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { ServiceListClass } from '@app/shared/services/sevicelist';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PushCandidatePageType, pushCandidateModel } from './pushCandidate-model';
import { PushCandidateSuccessPoupComponent } from '../pushcandidate-to-eoh-from-popup/push-candidate-success-poup/push-candidate-success-poup.component';
import { ConfirmDialogComponent } from '@app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel } from '../../job-detail/share-job-application-url/share-job-application-url.component';
import { formatDate } from '@angular/common';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import { Router } from '@angular/router';
import { CommonServiesService } from '@app/shared/services/common-servies.service';
import { JobActionsStoreService } from '@app/shared/services/commonservice/job-actions-store.service';
import { ActionsTab } from '@app/shared/models/job-screening';
import { JobActionTabService } from '@app/shared/services/commonservice/job-action-tab.service';
import { ButtonConfig, ClientBtnDetails } from '../../../EWM.core/client/client-detail/share-client-eoh/share-client-model';
import { ButtonService } from '../../../../shared/services/button-service/button.service';


@Component({
  selector: 'app-push-candidate-to-eoh',
  templateUrl: './push-candidate-to-eoh.component.html',
  styleUrls: ['./push-candidate-to-eoh.component.scss']
})
export class PushCandidateToEohComponent implements OnInit, OnDestroy {
  ClientBtnDetails = ClientBtnDetails;
  pushCandidateForm: FormGroup;
  dropdownInitilize:boolean = false;
  public selectedPhoneCode: any = {};
  common_DropdownC_Config:DRP_CONFIG;
  resetPhoneCodeDrp: Subject<any> = new Subject<any>();
  public selectedTitle: any = {};
  title_DropdownC_Config: DRP_CONFIG;
  resetTitleDrp: Subject<any> = new Subject<any>();
  public selectedGender: any = {};
  gender_Dropdown_Config: DRP_CONFIG;
  resetGenderDrp: Subject<any> = new Subject<any>();
  public selectedCountry: any = {};
  country_Dropdown_Config: DRP_CONFIG;
  resetCountryDrp: Subject<any> = new Subject<any>();
  public selectedState:any={};
  state_Dropdown_Config: DRP_CONFIG;
  resetStateDrp: Subject<any> = new Subject<any>();
  public selectedIndustry:any={};
  industry_Dropdown_Config: DRP_CONFIG;
  resetIndustryDrp: Subject<any> = new Subject<any>();
  public selectedQualification:any={};
  Qual_Dropdown_Config: DRP_CONFIG;
  resetQualDrp: Subject<any> = new Subject<any>();
  public selectedOffice:any={};
  Office_Dropdown_Config: DRP_CONFIG;
  resetOfficeDrp: Subject<any> = new Subject<any>();
  stateCode: any;
  CountryId: any;
  searchSubject$ = new Subject<any>();
  public loading: boolean=false;
  candidateId: string;
  IndustryList:[]=[];
  searchVal: string='';
  //IsOpenFor: number = PushCandidatePageType.Modal;
  @Input() IsOpenFor;
  documentTypeOptions: string[];
  fileType: string;
  fileSizetoShow: string;
  fileSize: number;
  filestatus: boolean=true;
  fileInfo: string;
  fileUploadedParam:{};
  @Output() sendPushCandidateInfo = new EventEmitter<any>();
  today = new Date();
  fileName: string='';
  countryList: [];
  stateList:any= [];
  uploadFiles: File;
  candPageTypeSubs: Subscription;
  showWarningAlert:boolean = false;
  public numberPattern = "^[0-9]*$";
  dirctionalLang: string;
  @Output() NextEmitOut: EventEmitter<any> = new EventEmitter<any>();
  EOHIntegrationObj:any;
  IsEOHIntergrated: boolean = false;
  eohRegistrationCode: string;
  getDateFormat: string;
  candidateInformation: any;
  interVal:any;
  private actions: ActionsTab;
  @Input() publishedStatus;
  @Input() memberStatus;
  @Output() candidateNameOut: EventEmitter<any> = new EventEmitter<any>();
  uploadStatus:boolean;
  btnSubscription: Subscription;
  buttonVisibility: { [key in ClientBtnDetails]: ButtonConfig };
  @Output() onBackBtn = new EventEmitter<any>(); // Output to emit submitted form data

  constructor(private fb: FormBuilder,private serviceListClass: ServiceListClass,private pushCandidateEOHService: PushCandidateEOHService,
    public systemSettingService:SystemSettingService ,private xeopleSearchService: XeopleSearchService, private snackBService: SnackBarService,
    private translateService: TranslateService, @Inject(MAT_DIALOG_DATA) public data: any,private http: HttpClient, private _appSetting: AppSettingsService,
    public candidateService: CandidateService,private profileInfoService: ProfileInfoService,public dialog: MatDialog,private jobActionsStoreService: JobActionsStoreService,
    private commonServiesService: CommonServiesService,private jobActionTabService: JobActionTabService,private buttonService:ButtonService,
    private route: Router) {
      this.actions = this.jobActionTabService.constants;
    this.fileType = _appSetting.file_file_type_medium;
    this.fileSizetoShow = _appSetting.file_file_size_small;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }
    this.candidateId=data?.candidateId;
    this.pushCandidateForm = this.fb.group({
      Title: ['', [Validators.required]],
      FirstName: ['', [Validators.required,Validators.pattern(this._appSetting.specialcharNamePattern),this.noWhitespaceValidator(),Validators.maxLength(50)]],
      FamilyName: ['', [Validators.required,Validators.pattern(this._appSetting.specialcharNamePattern),this.noWhitespaceValidator(),Validators.maxLength(50)]],
      GenderId: [],
      Gender: [],
      DateOfBirth:[,[CustomValidatorService.dateValidator]],
      Address: ['', [Validators.maxLength(250)]],
      Street:['',[Validators.required,this.noWhitespaceValidator(),Validators.maxLength(100)]],
      CountryId:['',[Validators.required]],
      CountryCode:[],
      CountryName:['',[Validators.required]],
      District_Suburb:['',[Validators.required,this.noWhitespaceValidator(),Validators.maxLength(50)]],
      PostalCode:['',[Validators.required,Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      StateId:['',[Validators.required]],
      StateCode:[''],
      StateName:['',[Validators.required]],
      Email:[{value: '', disabled: true},[Validators.required]],
      PhoneCode: ['',[Validators.required]],
      PhoneNo:['',[Validators.required,Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5)]],
      IndustryID:['',[Validators.required]],
      Industry:['',[Validators.required]],
      Qualification:['',[Validators.required]],
      QualificationId:[],
      OfficeApplyingFor:['',[Validators.required]],
      OfficeName:[],
      AboutUs:[{value: '', disabled: true},[Validators.required]],
      Resume:[],
      ResumeName:[],
      CandidateID:[],
      PhoneCountryId:[],
      Latitude:[''],
      Longitude:[''],
      candidaSubmittedStatusCode:[0],
      CandidateStatus:[],
      CandidateCreationdDateTime:[],
      ApplicantId: ['']
    });
    this.dropdownConfig();
  }
  ngOnInit(): void {
    this.getDateFormat = this._appSetting.dateFormatPlaceholder;
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     })
    this.getIndustryInfo(50,this.searchVal);
    this.searchSubject$.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.searchVal=value;
      this.getIndustryInfo(200,value);
    });
    this.pushCandidateForm.statusChanges.subscribe(status => {
          this.sendPushCandidateInfo.emit(this.pushCandidateForm);
    });
    this.candPageTypeSubs = this.pushCandidateEOHService.SetPushCandPageType.subscribe((details: any)=>{
      if (details) {
        this.IsOpenFor=details.pageType;
        this.showWarningAlert = details.showWarningAlert;
        details.pageType === 2 ? this.candidateId = details.candidateID : this.candidateId=this.data?.candidateId;
      }
      this.getCandidateInfo();
    })
    this.EOHIntegrationObj = JSON.parse(localStorage.getItem("EOHIntegration"));
      // EOH
    this.eohRegistrationCode = this._appSetting.eohRegistrationCode;
  let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
  let eohRegistrationCode = otherIntegrations?.filter(res=>res.RegistrationCode === this.eohRegistrationCode);
  this.IsEOHIntergrated = eohRegistrationCode[0]?.Connected;
  this.btnSubscription=this.buttonService.buttonVisibility$.subscribe(configs => {
     this.buttonVisibility = this.buttonService.getButtonVisibility('Share-Member');
     console.log("this.buttonVisibility",this.buttonVisibility);
   });
  }
  refreshAPI() {
    this.searchVal = '';
    this.getIndustryInfo(50,this.searchVal);
  }
  getInputVal(e) {
    this.searchSubject$.next(e);
  }
 /* @Name: getIndustryInfo @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: get industry Information*/
  getIndustryInfo(pageSize: number,searchVal: string) {
    this.pushCandidateEOHService.getEOHIndustryMaster(pageSize,searchVal).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
          this.IndustryList=data?.Data?.IndustryList;
          this.selectedIndustry=data?.Data?.DefaultIndustry;
          this.Qual_Dropdown_Config.API = this.serviceListClass.getQualificationList + '?IndustryId=' + this.selectedIndustry.IndustryID ;
          // this.resetQualDrp.next(this.Qual_Dropdown_Config);
          this.pushCandidateForm.patchValue({'IndustryID': this.selectedIndustry?.IndustryID,'Industry': this.selectedIndustry?.IndustryName});
        }
        else {
          //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
   /* @Name: getCandidateInfo @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: get candidate Information*/
  getCandidateInfo(){
    this.loading=true;
   this.pushCandidateEOHService.getGenralInfoCandidateById('?candidateid=' + this.candidateId).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.loading=false;
            this.candidateInformation = data.Data;
            this.candidateNameOut.emit({candidateId:this.candidateId,candidateName:data.Data?.FirstName +' '+data.Data?.LastName});
            this.pushCandidateEOHService.SetAlreadyPushCandInfo.next(this.candidateInformation);
            this.fileName=data.Data?.ResumeName;
            this.pushCandidateForm.patchValue({
              'FirstName': data.Data?.FirstName,
              'FamilyName': data.Data?.LastName,
              'Gender': data.Data?.Gender,
              'GenderId':data.Data?.GenderId,
              'DateOfBirth': data.Data?.DateOfBirth==0? null:new Date(data.Data?.DateOfBirth),
              'Address': data.Data?.AddressLinkToMap,
              'PostalCode': data.Data?.PostalCode,
              'StateId': data.Data?.StateId,
              'StateName': data.Data?.StateName,
              'StateCode': data.Data?.StateCode,
              'CountryId': data.Data?.CountryId,
              'CountryCode': data.Data?.CountryCode,
              'CountryName': data.Data?.CountryName,
              'District_Suburb':data.Data?.District,
              'PhoneCode':data.Data?.PhoneCode,
              'PhoneNo':data.Data?.PhoneNumber,
              'Email':data.Data?.Email,
              'AboutUs':data.Data?.Source,
              'CandidateID':data.Data?.CandidateId,
              'Latitude':data.Data?.Latitude,
              'Longitude':data.Data?.Longitude,
              'PhoneCountryId':data.Data?.PhoneCountryId,
              'Resume':data.Data?.ResumeURL,
              'CandidateCreationdDateTime':data.Data?.CandidateCreationdDateTime,
              'CandidateStatus':data.Data?.CandidateStatus,
              'Street':data.Data?.Address1,
              'ResumeName':this.fileName
            });
            if(data.Data?.GenderId && data.Data?.GenderId!=0){
              this.selectedGender={Id: data.Data?.GenderId, GenderName: data.Data?.Gender};
            }
            if(data.Data?.StateId && data.Data?.StateId!=0){
              this.stateCode=data.Data?.StateCode;
              this.selectedState={Id: data.Data?.StateId, StateName: data.Data?.StateName,StateCode:data.Data?.StateCode};
            }
            if(data.Data?.CountryId && data.Data?.CountryId!=0){
              this.selectedCountry={Id: data.Data?.CountryId, CountryName: data.Data?.CountryName,ImageUrl:data.Data?.CountryImageURL};
              this.getCountryInfoPatch(data.Data?.CountryId);
              this.state_Dropdown_Config.API = this.serviceListClass.StateAll + '?CountryId=' + this.selectedCountry.Id;
              this.resetStateDrp.next(this.state_Dropdown_Config);
            }
            if(data.Data?.PhoneCountryId && data.Data?.PhoneCountryId!=0){
            this.selectedPhoneCode={Id: data.Data?.PhoneCountryId, CountryCode: data.Data?.PhoneCode,ImageUrl:data.Data?.PhoneCountryImageURL};
            }
            if( Object.keys(this.selectedCountry)?.length===0 && this.selectedCountry===null){
              this.getInternationalization();
            }
            if(this.candidateInformation?.IsXRCandidatePushedToEOH === 1 && this.candidateInformation?.MemberId?.substring(0, 3).toLowerCase()==='apl' && !this.memberStatus){
              this.pushCandidateForm.disable();
              this.title_DropdownC_Config.DISABLED =true ;
              this.resetTitleDrp.next(this.title_DropdownC_Config);
              this.gender_Dropdown_Config.DISABLED =true ;
              this.resetGenderDrp.next(this.gender_Dropdown_Config);
              this.common_DropdownC_Config.DISABLED =true ;
              this.resetPhoneCodeDrp.next(this.common_DropdownC_Config);
              this.Qual_Dropdown_Config.DISABLED =true ;
              this.resetQualDrp.next(this.Qual_Dropdown_Config);
              this.country_Dropdown_Config.DISABLED =true ;
              this.resetCountryDrp.next(this.country_Dropdown_Config);
              this.state_Dropdown_Config.DISABLED =true ;
              this.resetStateDrp.next(this.state_Dropdown_Config);
              this.Office_Dropdown_Config.DISABLED =true ;
              this.resetOfficeDrp.next(this.Office_Dropdown_Config);
             
            }
            if(this.candidateInformation?.MemberId?.substring(0, 3)?.toLowerCase()==='apl'  && this.memberStatus){
              this.pushCandidateForm.enable();
            }
            if(this.candidateInformation?.MemberId?.substring(0, 3)?.toLowerCase()==='mbr'){
              this.pushCandidateForm.disable();
              this.title_DropdownC_Config.DISABLED =true ;
              this.resetTitleDrp.next(this.title_DropdownC_Config);
              this.gender_Dropdown_Config.DISABLED =true ;
              this.resetGenderDrp.next(this.gender_Dropdown_Config);
              this.common_DropdownC_Config.DISABLED =true ;
              this.resetPhoneCodeDrp.next(this.common_DropdownC_Config);
              this.Qual_Dropdown_Config.DISABLED =true ;
              this.resetQualDrp.next(this.Qual_Dropdown_Config);
              this.country_Dropdown_Config.DISABLED =true ;
              this.resetCountryDrp.next(this.country_Dropdown_Config);
              this.state_Dropdown_Config.DISABLED =true ;
              this.resetStateDrp.next(this.state_Dropdown_Config);
              this.Office_Dropdown_Config.DISABLED =true ;
              this.resetOfficeDrp.next(this.Office_Dropdown_Config);
            }
            Object.keys(this.pushCandidateForm.controls).forEach(field => { 
              const control = this.pushCandidateForm.get(field);            
              control.markAsTouched({ onlySelf: true });       
            });

          }
          else if (data.HttpStatusCode === 204) {
            this.loading = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
            this.loading = false;
          }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
  }
   /* @Name: dropdownConfig @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: dropdown Configuration*/
  dropdownConfig(){
    //Phone Code dropdown config
    this.common_DropdownC_Config = {
      API: this.serviceListClass.countryList,
      MANAGE: '',
      BINDBY: 'CountryCode',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'label_countryCode',
      SHORTNAME_SHOW: true,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'ImageUrl',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:true
    }
     //Title dropdown config
    this.title_DropdownC_Config = {
      API: this.serviceListClass.getTitleMaster,
      MANAGE: '',
      BINDBY: 'Title',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'pushCandidateToEoh_title',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:true
    }
     //Gender dropdown config
    this.gender_Dropdown_Config = {
      API: this.serviceListClass.genderList,
      MANAGE: '',
      BINDBY: 'GenderName',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'pushCandidateToEoh_gender',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:true
    }
      //Country dropdown config
    this.country_Dropdown_Config = {
      API: this.serviceListClass.countryList,
      MANAGE: '',
      BINDBY: 'CountryName',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'pushCandidateToEoh_country',
      SHORTNAME_SHOW: true,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'ImageUrl',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:true
    }
    //State dropdown config
    this.state_Dropdown_Config = {
      API: '',
      MANAGE: '',
      BINDBY: 'StateName',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'pushCandidateToEoh_state',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:true
    }
    //Industry dropdown config
    this.industry_Dropdown_Config = {
      API: this.serviceListClass.getIndustryList,
      MANAGE: '',
      BINDBY: 'IndustryName',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'pushCandidateToEoh_industry',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'Id',
      ONLOAD_ERROR_SHOW:true
    }
    //Qualification dropdown config
    this.Qual_Dropdown_Config = {
      API: '',
      MANAGE: '',
      BINDBY: 'QualName',
      REQUIRED: true,
      DISABLED: false,
      PLACEHOLDER: 'pushCandidateToEoh_qualification',
      SHORTNAME_SHOW: false,
      SINGLE_SELECETION: true,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: false,
      EXTRA_BIND_VALUE: '',
      IMG_BIND_VALUE:'',
      FIND_BY_INDEX: 'QualID',
      ONLOAD_ERROR_SHOW:true
    }
  //Office dropdown config
  this.Office_Dropdown_Config = {
    API: this.serviceListClass.getOfficeList,
    MANAGE: '',
    BINDBY: 'OfficeName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'pushCandidateToEoh_officeApplyingFor',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'OfficeID',
    ONLOAD_ERROR_SHOW:true
  }
  }
   /* @Name: onPhoneCodechange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: phonecode dropdown Configuration*/
  onPhoneCodechange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedPhoneCode = null;
      this.pushCandidateForm.patchValue(
        {
          PhoneCode:null,
          PhoneCountryId:null
        });
      this.pushCandidateForm.get("PhoneCode").setErrors({ required: true });
      this.pushCandidateForm.get("PhoneCode").markAsTouched();
      this.pushCandidateForm.get("PhoneCode").markAsDirty();
    }
    else {
      this.pushCandidateForm.get("PhoneCode").clearValidators();
      this.pushCandidateForm.get("PhoneCode").markAsPristine();
      this.selectedPhoneCode = data;
      this.pushCandidateForm.patchValue({
        PhoneCode: data?.CountryCode,
        PhoneCountryId:data.Id
      });
    }
  }
   /* @Name: onTitlechange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: title dropdown Configuration*/
  onTitlechange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedTitle = null;
      this.pushCandidateForm.patchValue(
        {
          Title:null
        });
        this.pushCandidateForm.get("Title").setErrors({ required: true });
        this.pushCandidateForm.get("Title").markAsTouched();
        this.pushCandidateForm.get("Title").markAsDirty();
    }
    else {
      this.pushCandidateForm.get("Title").clearValidators();
      this.pushCandidateForm.get("Title").markAsPristine();
      this.selectedTitle = data;
      this.pushCandidateForm.patchValue({
        Title: data?.Id
      });
    }
  }
   /* @Name: onGenderchange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: Gender dropdown Configuration*/
  onGenderchange(data){
    if (data == null || data == "" || data.length == 0) {
      this.selectedGender = null;
      this.pushCandidateForm.patchValue(
        {
          Gender:null,
          GenderId:null
        });
    }
    else {
      this.selectedGender = data;
      this.pushCandidateForm.patchValue({
        Gender: data?.GenderName,
        GenderId:data?.Id,
      });
    }
  }
   /* @Name: fetchDataFromAddressBar @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: fetch address from google sources*/
  public fetchDataFromAddressBar(address) {
     let latitude = address.geometry.location.lat();
    let longitude = address.geometry.location.lng();
    let addressOne: any = "";
    let addressTwo: any = "";
    for (let index = 0; index < address.address_components.length; index++) {
      const element = address.address_components[index];
      switch (element.types[0]) {
        case "locality":
          this.pushCandidateForm.patchValue({ TownCity: element.long_name });
          this.pushCandidateForm.patchValue({ District_Suburb: element.long_name });
          break;
        case "sublocality_level_2":
          addressOne += element.long_name + " ";
          break;
          case "sublocality_level_1":
          addressOne += element.long_name + " ";
          break;
        case "plus_code":
          addressOne += element.long_name + " ";
          break;
        case "street_number":
          addressOne += element.long_name + " ";
          break;
        case "route":
          addressOne += element.long_name + " ";
          break;
        case "neighborhood":
          addressTwo += element.long_name + " ";
          break;
        case "administrative_area_level_3":
          addressTwo += element.long_name + " ";
          break;
        case "administrative_area_level_2":
          addressTwo += element.long_name + " ";
          break;
        case "administrative_area_level_1":
          this.stateCode = element.short_name;
         // this.clickCountrygetAllState();
          break;
        case "country":
          this.getCountryInfo(element.short_name);
          this.selectedCountry = { 'CountryName': element.long_name,'ISOCode1': element.short_name };
         // this.onCountryChange(this.selectedCountry);
          break;
        case "postal_code":
          this.pushCandidateForm.patchValue({ PostalCode: element.long_name });
          break;
        default:
          break;
      }
      this.pushCandidateForm.patchValue({
         Street: addressOne,
         Address: address.formatted_address,
         Latitude: latitude,
         Longitude: longitude
        });
    }
  }
/* @Name: getCountryInfo @Who:  Renu @When: 06-Feb-2024 @Why: EWM-15844 EWM-15853 @What: fetch country from google sources*/
  getCountryInfo(ISOCode1?: string) {
    this.profileInfoService.fetchCountryInfo().subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.countryList = repsonsedata?.Data;
          let countryId=this.countryList.filter(x=>x['ISOCode1']===ISOCode1)[0]?.['Id'];
          let countryName=this.countryList.filter(x=>x['ISOCode1']===ISOCode1)[0]?.['CountryName'];
          let countryCode=this.countryList.filter(x=>x['ISOCode1']===ISOCode1)[0]?.['ISOCode1'];
          this.state_Dropdown_Config.API = this.serviceListClass.StateAll + '?CountryId=' + countryId ;
          this.resetStateDrp.next(this.state_Dropdown_Config);
          this.pushCandidateForm.patchValue({
            'CountryId': countryId,
            'CountryName':countryName,
            'CountryCode':countryCode,
          })
          this.getState(countryId);
        }else{
          this.countryList=[];
        }
      }, err => {
        //console.log(err);
      })
  }
  clickCountrygetAllState() {
    this.selectedState = null;
    /*--@Who:Nitin Bhati,@When: 14-March-2023,@Why:EWM-10651,@What:For patch state ID-----*/
    if (this.stateCode != null) {
      let stateId: any;
      let StateName: string;
      let stateCode: string;
      if (this.stateList && this.stateList?.length != 0) {
        let StateArr: string | any[];
        StateArr = this.stateList?.filter(x => x['StateCode'].toLowerCase() == this.stateCode.toLowerCase());
        if (StateArr?.length != 0) {
          stateId = StateArr[0]?.Id;
          StateName = StateArr[0]?.StateName;
          stateCode=StateArr[0]?.StateCode;
        } else {
          stateId = 0;
        }
        if (stateId == 0) {
          StateName = null
        } else {
          this.selectedState = { Id: Number(stateId), StateName: StateName,stateCode:stateCode };
          this.pushCandidateForm.patchValue({ StateId: stateId,StateName: StateName,StateCode:stateCode });
        }
      }
    }
  }
/* @Name: getState @Who:  Renu @When: 06-Feb-2024 @Why: EWM-15844 EWM-15853 @What: fetch state on basis of countryId from google sources*/
  getState(countryId) {
    this.systemSettingService.getStateListWithCountryId('?CountryId=' + countryId ).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.stateList = repsonsedata.Data;
          this.clickCountrygetAllState();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
/* @Name: onStatechange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: fetch country from google sources*/
  onStateChange(data) {
    if (data == null || data == "" || data?.length == 0) {
      this.selectedState = null;
      this.pushCandidateForm.patchValue({
        StateId: 0,
        StateName: '',
        StateCode:''
      })
    }
    else if (data.Id == 0) {
      this.selectedState = null;
      this.pushCandidateForm.patchValue({
        StateId: 0,
        StateName: '',
        StateCode:''
      })
    }
    else {
      this.selectedState = data;
      this.pushCandidateForm.patchValue({
        StateId: data.Id,
        StateCode: data.StateCode,
        StateName: data.StateName,
      })
    }
  }
  /* @Name: onCountrychange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: fetch country from google sources*/
  onCountryChange(data) {
    if (data == null || data == "" || data?.length == 0) {
      this.selectedCountry = null;
      this.selectedState=null;
      this.pushCandidateForm.patchValue({
        CountryId: 0,
        CountryName: '',
        CountryCode:''
      })
    }
    else if (data.Id == 0) {
      this.selectedCountry = null;
      this.selectedState=null;
      this.pushCandidateForm.patchValue({
        CountryId: 0,
        CountryName: '',
        CountryCode:''
      })
    }
    else {
      this.selectedCountry = data;
      //this.selectedState=null;
      this.pushCandidateForm.patchValue({
        CountryId: data.Id,
        CountryName: data.CountryName,
        CountryCode:data.ISOCode1
      });
      this.state_Dropdown_Config.API = this.serviceListClass.StateAll + '?CountryId=' + this.selectedCountry.Id;
      this.resetStateDrp.next(this.state_Dropdown_Config);
    }
  }
/* @Name: getInternationalization @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: get default value of country*/
  getInternationalization() {
    this.systemSettingService.getInternalization().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode=== 200 || repsonsedata.HttpStatusCode=== 204) {
          this.selectedCountry = { 'Id': repsonsedata.Data?.CountryId, 'CountryName': repsonsedata.Data?.CountryName };
          this.CountryId = this.selectedCountry.Id;
          this.onCountryChange(this.selectedCountry);
        }
      }, err => {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /* @Name: onIndustrychange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: get default value of industry*/
  onIndustrychange(data){
    if (data == null || data == "" || data.length == 0) {
      this.selectedIndustry = null;
      this.pushCandidateForm.patchValue(
        {
          Industry:null
        });
    }
    else {
      let  selectedIndustryId = data.IndustryID;
      this.selectedIndustry = data;
      this.pushCandidateForm.patchValue({
        Industry: data?.IndustryName,
        IndustryID:selectedIndustryId
      });
      this.Qual_Dropdown_Config.API = this.serviceListClass.getQualificationList + '?IndustryId=' + selectedIndustryId ;
      this.resetQualDrp.next(this.Qual_Dropdown_Config);
    }
  }
    /* @Name: onQualchange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: get default value of qualification*/
  onQualchange(data){
    if (data == null || data == "" || data.length == 0) {
      this.selectedQualification = null;
      this.pushCandidateForm.patchValue(
        {
          Qualification:null,
          QualificationId:null
        });
    }
    else {
      this.selectedQualification = data;
      this.pushCandidateForm.patchValue({
        Qualification: data?.QualID,
        QualificationId:data?.QualName
      });
    }
  }
    /* @Name: onOfficeChange @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: office dropdown Configuration*/
    onOfficeChange(data){
      if (data == null || data == "" || data.length == 0) {
        this.selectedOffice = null;
        this.pushCandidateForm.patchValue(
          {
            OfficeApplyingFor:null,
            OfficeName:null
          });
      }
      else {
        this.selectedOffice = data;
        this.pushCandidateForm.patchValue({
          OfficeApplyingFor: data?.OfficeID,
          OfficeName: data?.OfficeName
        });
      }
      this.pushCandidateEOHService.SetOfficeChangeAlert.next(true);
    }
    /* @Name: Uploadfile @Who:  Renu @When: 06-Feb-2024 @Why: EWM-15844 EWM-15853 @What: Upload resume*/
    Uploadfile(file) {
      this.loading = true;
      const list = file.target.files[0]?.name.split('.');
      if(file.target.files?.length==0){
        this.loading = false;
        return;
      }
      const fileType = list[list.length - 1];
      let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
      if (!this.fileType.includes(fileType.toLowerCase())) {
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageType'), '');
        this.loading=false;
        file = null;
        return;
      }
      if (file.target.files[0].size > this.fileSize) {
        this.snackBService.showErrorSnackBar(this.translateService.instant('label_invalidImageSize') + ' ' + this.fileSizetoShow, '');
        this.loading=false;
        file = null;
        return;
      }
      this.fileInfo = file.target.files[0].name + '(' + this.formatBytes(file.target.files[0].size) + ')';
      localStorage.setItem('Image', '1');
      this.uploadFiles = file.target.files[0];
      this.filestatus = false;
      this.uploadResumeFile(this.uploadFiles);
    }
     /* @Name: Uploadfile @Who:  Renu @When: 06-Feb-2024 @Why: EWM-15844 EWM-15853 @What: Upload resume*/
    uploadResumeFile(file) {
      const formData = new FormData();
      formData.append('file', file);
      this.candidateService.FileUploadFile(formData).subscribe(
        (responseData: ResponceData) => {
          if (responseData.HttpStatusCode === 200) {
            this.loading = false;
            this.fileUploadedParam={
              filePath:responseData.Data[0].FilePathOnServer,
              previewUrl:responseData.Data[0].Preview,
              UploadFileName:responseData.Data[0].UploadFileName,
              SizeOfFile: responseData.Data[0].SizeOfFile
            };
            this.fileName=  this.fileUploadedParam['UploadFileName'];
            this.resumeUpload();
            this.pushCandidateForm.get('Resume').setValue(this.fileUploadedParam['previewUrl']);
            this.pushCandidateForm.get('ResumeName').setValue(this.fileName);
            localStorage.setItem('Image', '2');
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          }
        }, err => {
          this.loading = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
/*
 @Type: File, <ts>
 @Name: formatBytes
 @Who: Nitin Bhati
 @When: 08-oct-2021
 @Why: EWM-3227
 @What: for convert data Kb and mb
 */
  formatBytes(bytes: number): string {
    const UNITS = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const factor = 1024;
    let index = 0;
    while (bytes >= factor) {
      bytes /= factor;
      index++;
    }
    return `${parseFloat(bytes.toFixed(2))} ${UNITS[index]}`;
  }
  ngOnDestroy(){
    if (this.interVal) {
      clearInterval(this.interVal);
    }
    this.IsOpenFor = PushCandidatePageType.Modal;
    this.candPageTypeSubs?.unsubscribe();
    this.btnSubscription?.unsubscribe();
    
  }
    /* @Name: onSubmit @Who:  Renu @When: 31-jan-2024 @Why: EWM-15844 EWM-15853 @What: on submit data for push candidate*/
    onSubmit(){
      let val = this.pushCandidateForm.getRawValue();
      const message = 'pushCandidateToEoh_confirmMsg1';
      const title = val?.FirstName+' '+val?.FamilyName;
      const subTitle = 'pushCandidateToEoh_confirmMsg2';
      const dialogData = new ConfirmDialogModel(title, subTitle, message);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "350px",
        data: dialogData,
        panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.loading = true;
        if (dialogResult == true) {
          let canObj:pushCandidateModel;
          let currentUserDetails = JSON.parse(localStorage.getItem('currentUser'));
          canObj={
            Title:val?.Title,
            FirstName:val?.FirstName,
            FamilyName:val?.FamilyName,
            Gender:val?.Gender,
            DOB:(val?.DateOfBirth===undefined || val?.DateOfBirth===null)?null:formatDate(val?.DateOfBirth, 'YYYY-MM-dd', 'en_US'),
            FullAddress:val?.Address,
            Street:val?.Street,
            SuburbCode:val?.District_Suburb,
            SuburbName:val?.District_Suburb,
            PostCode:val?.PostalCode,
            Latitude:val?.Latitude.toString(),
            Longitude:val?.Longitude.toString(),
            StateId:Number(val?.StateId),
            StateCode:val?.StateCode,
            StateName:val?.StateName,
            CountryId:Number(val?.CountryId),
            CountryCode:val?.CountryCode,
            CountryName:val?.CountryName,
            CountryCallingCode:val?.PhoneCode.toString(),
            Email:val?.Email,
            MobileNo:val?.PhoneNo,
            QualificationID:val?.Qualification,
            Qualification:val?.QualificationId,
            Resume:(val?.Resume)?(val?.Resume):'null',
            OfficeID:val?.OfficeApplyingFor,
            UserName:(currentUserDetails?.FirstName)?(currentUserDetails?.FirstName+' '+currentUserDetails?.LastName):'',
            IndustryID:val?.IndustryID,
            Industry:val?.Industry,
            HowDidYouHear:val?.AboutUs,
            OrganizationId:localStorage.getItem('OrganizationId')?localStorage.getItem('OrganizationId'):'',
            OrganizationName:localStorage.getItem('OrganizationName')?localStorage.getItem('OrganizationName'):'',
            TenantID:(currentUserDetails?.Tenants[0]?.TenantId)?(currentUserDetails?.Tenants[0]?.TenantId):'',
            CandidateID:val?.CandidateID,
            PhoneCountryId:val?.PhoneCountryId.toString(),
            GenderId:Number(val?.GenderId),
            CandidateStatus:val?.CandidateStatus,
            CandidateCreationdDateTime:val?.CandidateCreationdDateTime?formatDate(val?.CandidateCreationdDateTime, 'YYYY/MM/dd hh:mm:ss', 'en_US'):null
          };
          this.pushCandidateEOHService.pushCandidateToEOH(canObj).subscribe(
           (data: ResponceData) => {
            this.pushCandidateForm.patchValue({
              candidaSubmittedStatusCode: data.HttpStatusCode
            })
            this.sendPushCandidateInfo.emit(this.pushCandidateForm);
            this.loading = false;
             if (data.HttpStatusCode === 200) {
              this.successConfirmPopup(data.HttpStatusCode,data.Data);
               }
               else if (data.HttpStatusCode === 204) {
                 this.loading = false;
               }else if(data.HttpStatusCode === 402){
                this.successConfirmPopup(data.HttpStatusCode,data.Data);
                // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg), data.HttpStatusCode);
                this.loading = false;
               }else if(data.HttpStatusCode === 400){
                this.successConfirmPopup(data.HttpStatusCode,data.Data);
                // this.snackBService.showErrorSnackBar(this.translateService.instant(data.Data?.EOHResponseMsg), data.HttpStatusCode);
               }
             else {
              //  this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
               this.loading = false;
             }
           }, err => {
             this.loading = false;
             this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
           });
        } else {
          this.loading = false;
        }
      });
  }
   /* @Name: successConfirmPopup @Who:  Renu @When: 02-feb-2024 @Why: EWM-15844 EWM-15853 @What: on sucessfully pushed popup open*/
   successConfirmPopup(httpstatus: number,CandidateInfo: string){
    const dialogRef = this.dialog.open(PushCandidateSuccessPoupComponent, {
      data: new Object({candidatePushedInfo:CandidateInfo,httpstatus:httpstatus}),
      panelClass: [ 'xeople-modal', 'view_pushCandidate','animate__animated','animate__zoomIn' ],
      disableClose: true,
    });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value as string || '')?.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  public Clear() {
    this.searchVal = '';
    this.getIndustryInfo(50, this.searchVal);
  }
  onClearDOB(e){
    this.pushCandidateForm.patchValue({
      DateOfBirth: null
    });
  }
  onFeaturesSubsribeOrNot(){
     this.interVal = setInterval(() => {
      let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
      let eohRegistrationCode = otherIntegrations?.filter(res => res.RegistrationCode === this.eohRegistrationCode);
      const IsEOHIntergrated = eohRegistrationCode[0]?.Connected;
      if (IsEOHIntergrated) {
        this.IsEOHIntergrated = IsEOHIntergrated;
        this.EOHIntegrationObj = JSON.parse(localStorage.getItem("EOHIntegration"));
        if (IsEOHIntergrated && this.EOHIntegrationObj.candExtractEnable == 1) {
          clearInterval(this.interVal);
        }
      }
    }, 1800);
  }
  redirectOnMarketPlace(){
    const pageName = (window.location.pathname)?.includes('job-detail');
    if (pageName) {
      this.onFeaturesSubsribeOrNot();
      window.open(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode),'_blank')
    }
    else{
      this.route.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode))
    }
  }
  onNextClick(){
    this.jobActionsStoreService.setActionRunnerFn(this.actions.SCREENING_CANDIDATE_PROFILE_INFO, this.pushCandidateForm.getRawValue());
    this.NextEmitOut.emit(true);
    this.jobActionsStoreService.isScreeningActionTabUpdate.next(true);
  }

  isButtonDisabled(): boolean {
    if(this.candidateInformation?.MemberId?.substring(0, 3)?.toLowerCase()==='apl'){
       if(this.EOHIntegrationObj?.candExtractEnable == 0 || !this.pushCandidateForm?.valid){
        return true;
       }else{
        return false;
       }
      }else{
        if(this.candidateInformation?.IsXRCandidatePushedToEOH === 1 ||this.EOHIntegrationObj?.candExtractEnable == 0 || !this.pushCandidateForm?.valid){
          return true;
        }else{
          return false;
        }
      }
  }
  resumeUpload(): void {
    let uploadInfo = {};
    uploadInfo['CandidateId'] = this.candidateId;
    uploadInfo['Comment'] = '';
    uploadInfo['Size'] = this.fileUploadedParam['SizeOfFile'];
    uploadInfo['FileName'] = this.fileUploadedParam['filePath'];
    uploadInfo['UploadFileName'] = this.fileUploadedParam['UploadFileName'];
    this.candidateService.addFileUploadFile(uploadInfo).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
         this.uploadStatus=true;
        }
      }, err => {
         this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }


  getCountryInfoPatch(CountryId?: string) {
    this.profileInfoService.fetchCountryInfo().subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.countryList = repsonsedata?.Data;
          let countryId=this.countryList?.filter(x=>x['Id']===CountryId)[0]?.['Id'];
          let countryName=this.countryList?.filter(x=>x['Id']===CountryId)[0]?.['CountryName'];
          let countryCode=this.countryList?.filter(x=>x['Id']===CountryId)[0]?.['ISOCode1'];
          this.state_Dropdown_Config.API = this.serviceListClass.StateAll + '?CountryId=' + countryId ;
          this.resetStateDrp.next(this.state_Dropdown_Config);
          this.pushCandidateForm.patchValue({
            'CountryId': countryId,
            'CountryName':countryName,
            'CountryCode':countryCode,
          })
          this.getState(countryId);
        }else{
          this.countryList=[];
        }
      }, err => {
        //console.log(err);
      })
  }
  
  onBack(){
    this.onBackBtn.emit(2);
  }

}