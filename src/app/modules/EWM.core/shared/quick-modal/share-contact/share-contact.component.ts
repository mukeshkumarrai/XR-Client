/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 24-Feb-2025
  @Why: EWM-19578
  @What: this section handle all share contact component related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl,FormBuilder,ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { CandidateService } from '../../services/candidates/candidate.service';
import { customDropdownConfig } from '../../datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ContactData,sharedContactData } from 'src/app/shared/models/contact';
import { ContactService } from '../../services/contact/contact.service';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { ShareContactSuccessPopupComponent } from '../share-contact/share-contact-success-popup/share-contact-success-popup.component';
import { shareContactJSON } from './share-contact-model';
@Component({
  selector: 'app-share-contact',
  templateUrl: './share-contact.component.html',
  styleUrls: ['./share-contact.component.scss']
})
export class ShareContactComponent implements OnInit {
 /**********************global variables decalared here **************/
 visible = true;
 selectable = true;
 removable = true;
 separatorKeysCodes: number[] = [ENTER, COMMA];
 sharedContactForm: FormGroup;
 public selected: any = [];
 public numberPattern = "^[0-9]*$";
 public specialcharPattern = "^[a-z A-Z]+$";
 public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
 public countryId: number;
 public pageNumber: any = 1;
 public pageSize: any = 500;
 public ContactRelatedTo: any = [];
 public loading: boolean = false;
 genderList: any = [];
 clientId: any;
 dirctionalLang;
 public dropDownOrgConfig: customDropdownConfig[] = [];
 disableSave: boolean;
 showAddContact: boolean = false;
 public dropDownJobStatusConfig: customDropdownConfig[] = [];
 public selectedContactStatus: any = {};
 contactGrpID: string = "0985d0e6-45a6-4574-aed0-b75e5049faa2";
 ContactStatusActiveKey: string;
 contactInfoData: ContactData;
 sharedContactData:sharedContactData;
 editContact: boolean;
 public common_DropdownC_Config:DRP_CONFIG;
 public selectedGender: any = {};
 public selectedProfessionalLevel: any = {};
 public common_DropdownStatus_Config:DRP_CONFIG;
 public common_DropdownGender_Config:DRP_CONFIG;
 public common_DropdownProfessionallevel_Config:DRP_CONFIG;
 position: any;
 public  selectedSyncedClients :any={};
 public common_DropdownSyncedClients_Config:DRP_CONFIG;
 ownersId: any;
 clientdataListSync=[];
 fromownersdta=[];
 public currentMenuWidth: number;
 public maxMoreLengthForOwnerContacts:number=5;
 noRequiredValidation:boolean;
 selectedValue: any = {};
 countryList: any = [];
 public IsDisabled: boolean = false;
 CountryId: number = 0;
 CountryIdValue: number = 0;
 ProfessionallevelActiveKey:string;
 brandAppSetting: any=[];
 EOHLogo: any;
 isResponseGet: boolean=false;
 constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ShareContactComponent>,
   public candidateService: CandidateService,private fb: FormBuilder, private snackBService: SnackBarService,public dialog: MatDialog, private serviceListClass: ServiceListClass, private translateService: TranslateService, public systemSettingService: SystemSettingService, private appSettingsService: AppSettingsService,
   private _ContactService: ContactService) {
    this.sharedContactForm = this.fb.group({
     FirstName: ['', [Validators.required]],
     LastName: ['', [Validators.required,Validators.minLength(1), Validators.maxLength(50), Validators.pattern(this.appSettingsService.specialcharNamePattern)]],
     Status: [[], Validators.required],
     GenderId: [''],
     Gender: ['', [Validators.required]],
     ProfessionalLevelId:['', [Validators.required]],
     ProfessionalLevelName:[],
     CountryId: ['', [Validators.required]],
     CountryName: [''],
     SyncedClients:['', [Validators.required]]
   });
   this.ContactStatusActiveKey = this.appSettingsService.ContactStatusActiveKey;
   this.ProfessionallevelActiveKey = this.appSettingsService.ProfessionallevelActiveKey;
   this.brandAppSetting = this.appSettingsService.brandAppSetting;
 }
 loadingOnScroll: boolean = false;
 ngOnInit() {
  const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople === 'Xeople');
   this.EOHLogo=filteredBrands[0]?.logo;
   this.selectedSyncedClients=null;
   this.dropdownConfig();
   this.getInternationalization();
   this.selectedContactStatus = { Id: this.ContactStatusActiveKey, Code: 'Active' };
   this.selectedProfessionalLevel = { ProfessionalLevelId: this.ProfessionallevelActiveKey, ProfessionalLevelName: 'STAFF' };
   this.onJobStatuschange(this.selectedContactStatus);
   this.getEOHSharedContactDataById(this.data?.contactId);
   this.currentMenuWidth = window?.innerWidth;
   this.screenMediaQuiryForOwnerContact();
 }

 @HostListener("window:resize", ['$event'])
 private onResize(event) {
   this.currentMenuWidth = event?.target?.innerWidth;
   // this.detectScreenSize();
   this.screenMediaQuiryForOwnerContact()
 }
 
 noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control?.value || '')?.trim()?.length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
dropdownConfig(){
  this.common_DropdownStatus_Config = {
    API: this.serviceListClass.getallStatusDetails + "?GroupId=" + this.contactGrpID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
    MANAGE: '/client/core/administrators/group-master',
    BINDBY: 'Code',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'quickjob_status',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: '' ,
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'Id' 
  }
  this.common_DropdownGender_Config = {
    API: this.serviceListClass.genderList,
    MANAGE: '',
    BINDBY: 'GenderName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_Gender',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: ''  ,
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'Id'
  }
  this.common_DropdownProfessionallevel_Config = {
   API: this.serviceListClass.getEOHProfessionalLevel,
   MANAGE: '',
   BINDBY: 'ProfessionalLevelName',
   REQUIRED: true,
   DISABLED: false,
   PLACEHOLDER: 'label_ShareContactProfessionalLevel',
   SHORTNAME_SHOW: false,
   SINGLE_SELECETION: true,
   AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
   IMG_SHOW: true,
   EXTRA_BIND_VALUE: ''  ,
   IMG_BIND_VALUE:'',
   FIND_BY_INDEX: 'ProfessionalLevelId'
 }
  this.common_DropdownSyncedClients_Config = {
    API: this.serviceListClass.getEOHSyncedClients +"?id="+this.data?.contactId,
    MANAGE: '',
    BINDBY: 'ClientName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_ShareContactAdminLocation',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'',
    FIND_BY_INDEX: 'ClientId'
  }
 }
 remove(items: any, type: string): void {
   if (type == 'contactRelatedTo') {
     const index = this.ContactRelatedTo?.indexOf(items);
     if (index >= 0) {
       this.ContactRelatedTo?.splice(index, 1);
     }
   }
 }

 onChangeGender(data) {
   if (data == null || data == "") {
     this.selectedGender = null;
     this.sharedContactForm.patchValue(
       {
         Gender: null,
       }
     )
    this.sharedContactForm.get("GenderId").setErrors({ required: true });
   this.sharedContactForm.get("GenderId").markAsTouched();
   this.sharedContactForm.get("GenderId").markAsDirty();
   }
   else {
    this.sharedContactForm.get("GenderId").clearValidators();
    this.sharedContactForm.get("GenderId").markAsPristine();
     this.selectedGender = data;   
     this.sharedContactForm.patchValue({
       Gender: data?.GenderName,
       GenderId: data?.Id,
     });   
   }
 }
 onChangeProfessionalLevel(data) {
  if (data == null || data == "") {
    this.selectedProfessionalLevel = null;
    this.sharedContactForm.patchValue(
      {
        ProfessionalLevel: null,
      }
    )
   this.sharedContactForm.get("ProfessionalLevelId").setErrors({ required: true });
   this.sharedContactForm.get("ProfessionalLevelId").markAsTouched();
   this.sharedContactForm.get("ProfessionalLevelId").markAsDirty();
  }
  else {
    this.sharedContactForm.get("ProfessionalLevelId").clearValidators();
    this.sharedContactForm.get("ProfessionalLevelId").markAsPristine();
    this.selectedProfessionalLevel = data;   
    this.sharedContactForm.patchValue({
      ProfessionalLevelId: data?.ProfessionalLevelId,
      ProfessionalLevelName: data?.ProfessionalLevelName,
    });   
  }
}
 
 getEOHSharedContactDataById(contactId) {
   this.loading = true;
   this._ContactService.getEOHSharedContactDataById(contactId).subscribe(
     (repsonsedata: ResponceData) => {
       if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
         this.sharedContactData = repsonsedata?.Data;
         this.sharedContactForm.patchValue({
          'FirstName': this.sharedContactData?.FirstName,
          'LastName': this.sharedContactData?.LastName,
          'Gender': this.sharedContactData?.Gender,
          'SyncedClients': this.sharedContactData?.SyncedClients,
          'ProfessionalLevelId': this.selectedProfessionalLevel?.ProfessionalLevelId,
          'ProfessionalLevelName': this.selectedProfessionalLevel?.ProfessionalLevelName,
        });
        this.sharedContactForm.get('FirstName').disable();
        if (this.sharedContactData?.LastName != null && this.sharedContactData?.LastName != undefined && this.sharedContactData?.LastName != '') {
          this.sharedContactForm.get('LastName').disable();
        } 
        //this.sharedContactForm.get('LastName').disable();
        if(this.data?.tabType==='client'){
          this.selectedSyncedClients=this.data?.onSynchedClientData;
        }else{
          let arr = [];
          if (this.contactInfoData?.ContactOwner?.length!=0) {
            this.sharedContactData?.SyncedClients?.forEach((ele:any)=>{
              arr.push({...ele, UserId: ele?.ClientId, UserName: ele?.ClientName})
            }) 
            this.selectedSyncedClients = arr; 
          }
        }
       
     if (this.sharedContactData?.Gender==null) {
       this.selectedGender={};
     }else{
       this.selectedGender = { Id: this.sharedContactData?.GenderId, GenderName: this.sharedContactData?.Gender};    
     }
     this.onChangeGender(this.selectedGender);
     if (this.contactInfoData?.ContactRelatedTo) {
       this.ContactRelatedTo = this.contactInfoData?.ContactRelatedTo
     }
         this.loading = false;
       } else {
         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
         this.loading = false;
       }
     }, err => {
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
       this.loading = false;
     })
 }

onChangeContactOwner(data) {
 this.selectedSyncedClients=null;
 if (data == null || data == "") {
   this.selectedSyncedClients = null;
   this.sharedContactForm.patchValue(
     {
      SyncedClients: null
     }
   )
   this.sharedContactForm.get("SyncedClients").setErrors({ required: true });
   this.sharedContactForm.get("SyncedClients").markAsTouched();
   this.sharedContactForm.get("SyncedClients").markAsDirty();
 }
 else {
  this.sharedContactForm.get("SyncedClients").clearValidators();
   this.sharedContactForm.get("SyncedClients").markAsPristine();
   this.selectedSyncedClients = data;   
   this.sharedContactForm.patchValue({
    SyncedClients: data
   });   
 }
}


onJobStatuschange(data) {
 if (data == null || data == "") {
   this.selectedContactStatus = null;
   this.sharedContactForm.patchValue(
     {
       Status: null,
     }
   )
   this.sharedContactForm.get("Status").setErrors({ required: true });
   this.sharedContactForm.get("Status").markAsTouched();
   this.sharedContactForm.get("Status").markAsDirty();
 }
 else {
   this.sharedContactForm.get("Status").clearValidators();
   this.sharedContactForm.get("Status").markAsPristine();
   this.selectedContactStatus = data;      
   this.sharedContactForm.patchValue(
     {
       Status: data?.Id,
     }
   )
 }
}

 screenMediaQuiryForOwnerContact(){
   if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
     this.maxMoreLengthForOwnerContacts = 1;
   } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
     this.maxMoreLengthForOwnerContacts = 2;
   } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
     this.maxMoreLengthForOwnerContacts = 3;
   } else {
     this.maxMoreLengthForOwnerContacts = 2;
   }
 }
getInternationalization() {
  this.systemSettingService.getInternalization().subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata['HttpStatusCode'] === 200) {
        //this.selectedValue = { 'Id': repsonsedata['Data']['CountryId'], 'CountryName': repsonsedata['Data']['CountryName'], 'CountryCode': repsonsedata['Data']['CountryName'] };
          this.CountryId = this.selectedValue?.Id;
          //this.ddlchange(this.selectedValue);
          this.getCountryCode(repsonsedata['Data']['CountryId']);
      }
    }, err => {
      // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

getCountryCode(countryId) {
  this.systemSettingService.getCountryById(countryId).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.selectedValue = repsonsedata?.Data;
        this.sharedContactForm.patchValue(
        {
          CountryId: repsonsedata?.Data?.Id,
          CountryName: repsonsedata?.Data?.CountryName,
          CountryCode: repsonsedata?.Data?.CountryCode,
        }
      )
    }}, err => {
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
  }

ddlchange(data) {
  //this.loading=true;
  if (data == null || data == "" || data == 0) {
    this.selectedValue = {};
      this.sharedContactForm.get("CountryId").setErrors({ required: true });
      this.sharedContactForm.get("CountryId").markAsTouched();
      this.sharedContactForm.get("CountryId").markAsDirty();
    this.sharedContactForm.patchValue(
      {
        CountryId: '',
        CountryName: '',
      }
    );
  }
  else {
    this.sharedContactForm.get("CountryId").clearValidators();
    this.sharedContactForm.get("CountryId").markAsPristine();
    this.sharedContactForm.get("CountryId").setValidators(Validators.required);
    //this.loading=false;
    this.selectedValue = data;
    this.CountryId = data?.Id;
    if ( this.CountryId==0) {
      this.sharedContactForm.get("CountryId").setValidators(Validators.required);
      }else{
        this.sharedContactForm.patchValue(
          {
            CountryId: data?.Id,
            CountryName: data?.CountryName,
            CountryCode: data?.CountryCode,
          }
        )
      }
    // this.addressChange();
  }
}

onConfirm(value): void {
  this.isResponseGet=true;
  let OwnerData =   this.selectedSyncedClients?.filter(x=>{
    return x?.ClientId;
  })
  OwnerData?.forEach(ele=>{
    this.clientdataListSync?.push({'ClientId':ele?.ClientId,'ClientName':ele?.ClientName,'ClientEOHId':ele?.ClientEOHId});
 })
//createContactJson['Clients'] = this.ownersdta;
  const formData :shareContactJSON= {
    ContactId: this.data?.ContactIdString,
    FirstName: this.sharedContactForm.getRawValue()?.FirstName?.trim(),
    LastName: this.sharedContactForm.getRawValue()?.LastName?.trim(),
    Gender: this.sharedContactForm?.value?.Gender,
    EmailAddress: this.data?.contactId,
    CountryId: this.selectedValue?.Id,
    CountryCode: this.selectedValue?.CountryCode,
    CountryName: this.selectedValue?.CountryName,
    Clients: this.clientdataListSync,
    ProfessionalLevelId: this.selectedProfessionalLevel?.ProfessionalLevelId,
    ProfessionalLevelName: this.selectedProfessionalLevel?.ProfessionalLevelName,
    EOHId: '',
    Status: this.selectedContactStatus?.Id,
    StatusName: this.selectedContactStatus?.Code,
    ShareContactURL:window?.location?.href
  };
  this._ContactService.pushContactToEOH(formData).subscribe(
    (data: ResponceData) => {
    if (data.HttpStatusCode === 200) {
      this.successConfirmPopup(data.HttpStatusCode,data.Data);
      this.sharedContactForm.reset();
      document.getElementsByClassName("share-contact-eoh")[0].classList.remove("animate__fadeInDownBig")
      document.getElementsByClassName("share-contact-eoh")[0].classList.add("animate__fadeOutUpBig");
      setTimeout(() => { this.dialogRef.close(true); }, 200);
      //this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      this.loading = false;
      this.isResponseGet=false;
    }
    else if (data.HttpStatusCode === 204) {
      this.isResponseGet=false;
    this.loading = false;
    }else if(data.HttpStatusCode === 402){
      this.successConfirmPopup(data.HttpStatusCode,data.Data);
      this.isResponseGet=false;
    //this.snackBService.showErrorSnackBar(this.translateService.instant(data?.Message), data.HttpStatusCode);
    this.loading = false;
    }else if(data.HttpStatusCode === 400){
      this.isResponseGet=false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(data?.Message), data.HttpStatusCode);
    }
    else {
      this.isResponseGet=false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
    this.loading = false;
    }
    }, err => {
    this.loading = false;
    this.isResponseGet=false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}
onDismiss(): void {
  document?.getElementsByClassName("share-contact-eoh")[0]?.classList?.remove("animate__fadeInDownBig")
  document?.getElementsByClassName("share-contact-eoh")[0]?.classList?.add("animate__fadeOutUpBig");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}
successConfirmPopup(httpstatus: number,ContactInfo: string){
  const dialogRef = this.dialog?.open(ShareContactSuccessPopupComponent, {
    data: new Object({contactPushedInfo:ContactInfo,httpstatus:httpstatus}),
    panelClass: [ 'xeople-modal', 'view_pushCandidate','animate__animated','animate__zoomIn' ],
    disableClose: true,
  });
  // RTL Code
  let dir: string;
  dir = document?.getElementsByClassName('cdk-global-overlay-wrapper')[0]?.attributes['dir']?.value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList?.length; i++) {
    classList[i]?.setAttribute('dir', this.dirctionalLang);
  }
}

}
