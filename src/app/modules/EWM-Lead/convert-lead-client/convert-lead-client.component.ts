import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { customDropdownConfig } from '../../EWM.core/shared/datamodels';
import { DRP_CONFIG } from '../../../shared/models/common-dropdown';
import { QuickJobService } from '../../EWM.core/shared/services/quickJob/quickJob.service';
import { ServiceListClass } from '../../../shared/services/sevicelist';
import { SnackBarService } from '../../../shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from '../../../shared/services/commonservice/commonservice.service';
import { CountryMasterService } from '../../../shared/services/country-master/country-master.service';

import { AppSettingsService } from '../../../shared/services/app-settings.service';
import { ProfileInfoService } from '../../EWM.core/shared/services/profile-info/profile-info.service';
import { SystemSettingService } from '../../EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from '../../../shared/models';
import { ButtonTypes } from '../../../shared/models';

import { AddemailComponent } from '../../EWM.core/shared/quick-modal/addemail/addemail.component';
import { AddAddressComponent } from '../../EWM.core/shared/quick-modal/add-address/add-address.component';
import { AddphonesComponent } from '../../EWM.core/shared/quick-modal/addphones/addphones.component';
import { CompanyContactPopupComponent } from '../../EWM.core/shared/quick-modal/quick-company/company-contact-popup/company-contact-popup.component';
@Component({
  selector: 'app-convert-lead-client',
  templateUrl: './convert-lead-client.component.html',
  styleUrls: ['./convert-lead-client.component.scss']
})
export class ConvertLeadClientComponent implements OnInit {

  /**********************global variables decalared here **************/
  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public phone: any = [];
  public socials: any = [];
  public emails: any = []
  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput: ElementRef<HTMLInputElement>;
  public addCompanyForm: FormGroup;
  public organizationData = [];
  public OrganizationId: any;
  public userTypeList: any = [];
  public brandList: any = [];
  public industryList: any = [];
  public subIndustryList: any = [];
  public subIndustryListId: any = [];
  public selected: any = [];
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public statusList: any = [];
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public emailArr: any;
  public phoneArr: any = [];
  public socialArr: any;
  public addressBarData: Address;
  public CompanyLocationspopUp: any;
  public locationTypeList: any = [];
  public reasonList: any = [];
  public companyList: any = [];
  public selectedValue: any;
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  public events: Event[] = [];
  public selectedSubIndustryIdValue: any;
  public clientListById: any;
  public client: any;
  public loading: boolean = false;
  public ownerList: any[] = [];
  public companyContactsList: any[] = [];
  public clientContact: any = [];
  public dropDownOrgConfig: customDropdownConfig[] = [];
  public selectedOrg: any = {};
  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = {};
  public dropDownselectClientcontactConfig: customDropdownConfig[] = [];
  public selectClientcontact: any = {};
  public resetFormSubjectSubIndustry: Subject<any> = new Subject<any>();
  public dropDownSubIndustryConfig: customDropdownConfig[] = [];
  public selectedSubIndustry: any = {};
  public sendMainEmailSelected: boolean = false;
  public dirctionalLang;
  public value: any;
  public groupCodeQuickClientDetailsPage: any;
  public loadingSearch: boolean;
  public searchValue: string = "";
  public searchVal: string = "";
  public animationVar: any;
  public ClientStatusActiveKey: string;
  public regonStatus: { Code: string; Id: string; };
  public statusregoenList: any;
  public regonStatu: {};
  public StatusCode: any;
  public StatusId: any;
  public inputValue: any;
  public dropDownSalaryBandNameConfig: customDropdownConfig[] = [];
  public selectedSalaryBandName: any = {};
  public selectedCurrencyValue: string;
  public searchSubject$ = new Subject<any>();
  public pagesize = 200;
  public pageNo = 1;
  public loadingPopup: boolean;
  public isFilter: boolean = false;
  public finalArrayList = [];
  public selectedStatusone: any = {};
  public isResponseGet: boolean = false;
  public common_DropdownC_Config: DRP_CONFIG;
  public selectedClientContact: any = {};
  public emailPattern: string;
  public isEditForm: boolean;
  public submitted = false;
  public clientshopId = "";
  public ClientIndustries: any[] = [];
  public industryPatch: any;
  public clientEmailIds: any = [];
  public userSelectedList: any = [];
  public LeadId:string;
  public acessId:number;
  public acessName:number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConvertLeadClientComponent>,
    private countryMasterService: CountryMasterService,
    private quickJobService: QuickJobService,
    private serviceListClass: ServiceListClass,
    private commonserviceService: CommonserviceService,
    private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService,
    private _appSetting: AppSettingsService,
    public systemSettingService: SystemSettingService, private profileInfoService: ProfileInfoService) {
    this.emailPattern = this._appSetting.emailPattern;
    this.groupCodeQuickClientDetailsPage = this._appSetting.groupCodeQuickClientDetailsPage;
    this.ClientStatusActiveKey = this._appSetting.ClientStatusActiveKey;
    this.LeadId = this.data?.LeadId
    this.addCompanyForm = this.fb.group({
      orgId: [[], [Validators.required]],
      companyId: [''],
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()]],//@who:priti;@when:3-dec-2021;@why:EWM-3982
      address: [[], [Validators.required, Validators.maxLength(250)]],
      industry: [],
      subIndustry: [],
      BrandId: [0],
      Brand: [null],
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
      ParentId: [''],
      ParentClient: [null],
      ClientRM: [[]],
      longitude: ['', [Validators.maxLength(50), Validators.pattern('^[-+]?[0-9]{1,7}(\.[0-9]+)?$')]],
      lattitude: ['', [Validators.maxLength(50), Validators.pattern('^[-+]?[0-9]{1,7}(\.[0-9]+)?$')]],
      TypeId: [0],
      Type: [null, [Validators.required]],
      StatusName: [null, [Validators.required]],
      StatusId: [''],
      ReasonId: [0],
      Reason: [null],
      contact: [null]
    });

  }
  ngOnInit() {
    this.selectedClientContact = null;
    this.dropdownConfig();
    this.animationVar = ButtonTypes;
    this.ddlconfigSetting();
    this.tenantBrandList(this.value);
    this.getLocationType();
    this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, this.searchValue);
    this.getInternationalization();
    this.getAllOwnerAndCompanyContacts();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }
    })
    this.getClientListById();
    this.tenantParentCompanyList();
    let status = { Code: "ACTIVE", Id: this.ClientStatusActiveKey }
    this.regonStatu = { Code: "ACTIVE", Id: this.ClientStatusActiveKey }
    this.tenantReasonGropCodeList(status, this.searchVal, false);
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
    });
    this.addCompanyForm.patchValue({
      StatusName: 'Active',
      StatusId: status.Id,
    });
  }
  refresh() {
    this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, this.searchValue);
  }
  ddlconfigSetting() {
    ////// Organization//////////////
    this.dropDownOrgConfig['IsDisabled'] = false;
    this.dropDownOrgConfig['apiEndPoint'] = this.serviceListClass.getOrganizationList;
    this.dropDownOrgConfig['placeholder'] = 'label_organization';
    this.dropDownOrgConfig['IsManage'] = '';
    this.dropDownOrgConfig['IsRequired'] = true;
    this.dropDownOrgConfig['searchEnable'] = true;
    this.dropDownOrgConfig['bindLabel'] = 'OrganizationName';
    this.dropDownOrgConfig['multiple'] = true;
    ////// Industry//////////////
    this.dropDownIndustryConfig['IsDisabled'] = false;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll + '?PageNumber=1&PageSize=500' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;
    //////Sub Industry//////////////
    this.dropDownSubIndustryConfig['IsDisabled'] = false;
    this.dropDownSubIndustryConfig['placeholder'] = 'quickjob_subIndustry';
    this.dropDownSubIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownSubIndustryConfig['IsRequired'] = false;
    this.dropDownSubIndustryConfig['searchEnable'] = true;
    this.dropDownSubIndustryConfig['bindLabel'] = 'Description';
    this.dropDownSubIndustryConfig['multiple'] = true;
  }

  onOrgchange(data) {
    if (data == null || data == "" || data?.length == 0) {
      this.selectedOrg = null;
      this.addCompanyForm.patchValue(
        {
          orgId: null,
        });
      this.addCompanyForm.get("orgId").setErrors({ required: true });
      this.addCompanyForm.get("orgId").markAsTouched();
      this.addCompanyForm.get("orgId").markAsDirty();
    }
    else {
      this.addCompanyForm.get("orgId").clearValidators();
      this.addCompanyForm.get("orgId").markAsPristine();
      this.selectedOrg = data;
      const orgIdData = data.map((item: any) => {
        return item?.Id
      });
      this.addCompanyForm.patchValue(
        {
          orgId: orgIdData
        });
    }
  }

  onIndustrychange(data) {
    if (data == null || data == "" || data?.length == 0) {
      this.selectedIndustry = null;
      this.selectedSubIndustry = null;
      this.addCompanyForm.patchValue(
        {
          industry: null,
          subIndustry: null,
        })
      this.ClientIndustries = [];
    }
    else {
      this.addCompanyForm.get("industry").clearValidators();
      this.addCompanyForm.get("industry").markAsPristine();
      this.selectedIndustry = data;
      this.ClientIndustries = [];
      this.ClientIndustries = data.map((item: any) => {
        return item.Id
      });
      this.addCompanyForm.patchValue(
        {
          industry: this.ClientIndustries
        }
      )
      //////Sub Industry//////////////
      this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + this.ClientIndustries + '&PageNumber=1&PageSize=500' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubIndustry.next(this.dropDownSubIndustryConfig);
    }
    this.clickIndustryGetSubIndustry();
  }

  onSubIndustrychange(data) {
    if (data == null || data == "" || data?.length == 0) {
      this.selectedSubIndustry = null;
      this.addCompanyForm.patchValue(
        {
          subIndustry: null
        });
    }
    else {
      this.addCompanyForm.get("subIndustry").clearValidators();
      this.addCompanyForm.get("subIndustry").markAsPristine();
      this.selectedSubIndustry = data;
      const subIndustryId = data.map((item: any) => {
        return item.Id
      });
      this.addCompanyForm.patchValue(
        {
          subIndustry: subIndustryId
        }
      )

    }
  }


  clickIndustryGetSubIndustry() {
    let Id = this.addCompanyForm.get('industry').value;
    let id = Id;
    this.quickJobService.getSubIndustryAll(id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.subIndustryList = repsonsedata.Data;
          this.cancelIndustryUpdateSubIndustry(this.subIndustryList);
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.subIndustryList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  cancelIndustryUpdateSubIndustry(data) {
    const subId = data.map((item: any) => {
      return item.Id
    });
    const commonSubIndustryId = subId.filter(e => this.addCompanyForm.get('subIndustry').value?.indexOf(e) !== -1);
    this.selectedSubIndustryIdValue = commonSubIndustryId;

  }

  getCountryInfo() {
    this.profileInfoService.fetchCountryInfo(this.pageNumber, this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.countryList = repsonsedata['Data'];
        }
      }, err => {
      })
  }

  getInternationalization() {
    this.systemSettingService.getInternalization().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] === 200) {
          this.countryId = Number(repsonsedata['Data']['CountryId']);
          this.commonserviceService.ondefultCountry.next(this.countryId);
        }
      })

  }
  createemail(): FormGroup {
    return this.fb.group({
      EmailId: ['', [Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]]
    });
  }
  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      phoneCode: [''],
      phoneCodeName: []
    });
  }


  remove(items: any, type: string): void {
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails?.length == 0) {
        this.addCompanyForm.controls['emailmul'].setErrors({ 'required': true });
      }

    }
    else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
        this.phoneArr.splice(index, 1);
      }
    }
    else if (type == 'clientContact') {
      const index = this.clientContact.indexOf(items);
      if (index >= 0) {
        this.clientContact.splice(index, 1);
      }
    }
    else {
      const index = this.socials.indexOf(items);
      if (index >= 0) {
        this.socials.splice(index, 1);
      }
    }

  }
  onChangeType(type) {
    this.addCompanyForm.patchValue({
      TypeId: type?.Id,
      Type: type?.Name
    });
  }

  onChangeClient(client) {
    this.addCompanyForm.patchValue({
      ParentId: client?.ClientId,
      ParentClient: client?.ClientName
    });
  }

  onChangeBrand(brand) {
    this.addCompanyForm.patchValue({
      BrandId: brand?.Id,
      Brand: brand?.Brand
    });
  }


  onChangeReason(reason) {
    this.addCompanyForm.patchValue({
      ReasonId: reason?.Id,
      Reason: reason?.Description
    });
  }

  finalArray = [];
  onChangeRM(dataRM) {
    this.finalArray = [];
    for (let index = 0; index < dataRM?.length; index++) {
      const element = dataRM[index];
      this.finalArray.push({ Id: element.UserId, Name: element.UserName })
    }
  }
  onDismiss(): void {
    document.getElementsByClassName("leadEdit")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("leadEdit")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  addEmail() {
    this.addCompanyForm.get('emailmul').reset();
    let mode;
    if (this.emails?.length == 0) {
      mode = 'Add';
    } else {
      mode = 'edit';
    }
    const dialogRef = this.dialog.open(AddemailComponent, {
      data: new Object({ emailmul: this.addCompanyForm.get('emailmul'), emailsChip: this.emails, mode: mode, pageName: 'genralInfoPage', values: { Email: this.emails } }),
      panelClass: ['xeople-modal', 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.emailArr = res.data;
      if (this.emailArr) {
        this.emails = [];
        let emailControls = this.addCompanyForm.get('emailmul').get('emailInfo') as FormArray;
        for (let j = 0; j < this.emailArr?.length; j++) {
          this.emails.push({
            email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['Name'],
            IsDefault: this.emailArr[j]['IsDefault'], EmailId: this.emailArr[j]['EmailId'], Type: this.emailArr[j]['Type']
          })
          emailControls.controls.forEach(c => {
            c.get('EmailId').setValue('');
            c.get('Type').clearValidators();
          });
          this.patch(this.emailArr[j]['EmailId'], this.emailArr[j]['Type']);
        }

      } else {
        this.patch(null, null);
        let emailControls = this.addCompanyForm.get('emailmul').get('emailInfo') as FormArray;
        emailControls.controls.forEach(c => {
          c.get('EmailId').clearValidators();
          c.get('Type').clearValidators();
          c.get('EmailId').updateValueAndValidity();
          c.get('Type').updateValueAndValidity();
        });
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

  patch(emailId: any, typeId: any) {
    const control = <FormGroup>this.addCompanyForm.get('emailmul');
    const childcontrol = <FormArray>control.controls.emailInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValues(emailId, typeId))
    this.addCompanyForm.patchValue({
      emailmul: childcontrol
    })
  }

  patchValues(emailId, typeId) {
    return this.fb.group({
      EmailId: [emailId],
      Type: [typeId]
    })
  }
  addAddress() {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      data: new Object({
        addressmul: this.addCompanyForm.get('addressmul'), emailsChip: this.emails,
        addressBarData: this.CompanyLocationspopUp, countryId: this.countryId,
        clientStatus: '1'
      }),
      panelClass: ['xeople-modal', 'add_address', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,

    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res?.data) {
        let AddressLinkToMap = res.data?.AddressLinkToMap;
        if (AddressLinkToMap != undefined && AddressLinkToMap != null && AddressLinkToMap != '') {
          this.addCompanyForm.patchValue({ address: res.data?.AddressLinkToMap });
        } else {
          this.addCompanyForm.patchValue({ address: (res.data?.AddressLine1 + ' ' + res.data?.AddressLine2) });
        }
        this.addCompanyForm.patchValue({ lattitude: res.data?.Latitude });
        this.addCompanyForm.patchValue({ longitude: res.data?.Longitude });
        this.CompanyLocationspopUp = res?.data;
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

  addPhone() {
    this.addCompanyForm.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {
      data: new Object({ phonemul: this.addCompanyForm.get('phonemul'), phoneChip: [], mode: 'edit', values: { Phone: this.phoneArr } }),
      panelClass: ['xeople-modal', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data != null && res.data != '') {
        this.phoneArr = res.data;
        this.phone = [];
        for (let j = 0; j < this.phoneArr?.length; j++) {
          this.phone.push({
            phone: this.phoneArr[j]['PhoneNumber'],
            type: this.phoneArr[j]['Type'],
            Name: this.phoneArr[j]['Name'],
            IsDefault: this.phoneArr[j]['IsDefault'],
            PhoneCode: this.phoneArr[j]['PhoneCode'],
            phoneCodeName: this.phoneArr[j]['phoneCodeName']
          })
        }
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
  getOrganizationList() {
    this.countryMasterService.getOrganizationList().subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode == '200' || responseData.HttpStatusCode == '204') {
          this.organizationData = responseData.Data;
        } else if (responseData.HttpStatusCode === 400) {
          this.organizationData = responseData.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  getLocationType() {
    this.systemSettingService.getLocationTypeListAll('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.locationTypeList = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.locationTypeList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  getStatusGroupCode(groupCodeQuickClientDetailsPage, searchValue) {
    this.systemSettingService.getStatusGroupCodesearchValue(groupCodeQuickClientDetailsPage, searchValue + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        this.loadingSearch = false;
        this.statusList = repsonsedata.Data[0]?.statuses;
        this.statusregoenList = repsonsedata.Data[0]?.statuses[0]?.Id;
        this.loadingSearch = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.statusList = repsonsedata.Data[0]?.statuses;
          this.loadingSearch = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.statusList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  tenantReasonGropCodeList(status, inputValue, data) {
    if (data == true) {
      this.addCompanyForm.patchValue({
        StatusName: status?.Code,
        StatusId: status?.Id,
        ReasonId: null,
        Reason: null
      });
    } else {
      this.addCompanyForm.patchValue({
        StatusName: status?.Code,
        StatusId: status?.Id,
      });
    }
    this.selectedStatusone = status;
    this.systemSettingService.getReasonStatusGroupCodesearchValue(status.Id, inputValue + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        this.reasonList = repsonsedata.Data[0]?.reasons;
        this.loadingSearch = false;
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.reasonList = repsonsedata.Data[0]?.reasons;
          this.StatusCode = repsonsedata.Data[0]?.StatusCode;
          this.StatusId = repsonsedata.Data[0]?.StatusId;
          this.loadingSearch = false;

        } else if (repsonsedata.HttpStatusCode == 400) {
          this.reasonList = repsonsedata.Data[0]?.reasons;
          this.StatusCode = repsonsedata.Data[0]?.StatusCode;
          this.StatusId = repsonsedata.Data[0]?.StatusId;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  tenantBrandList(value) {
    this.systemSettingService.getBrandAllListAll('?FilterParams.ColumnName=statusname&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.brandList = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.brandList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  tenantParentCompanyList() {
    this.systemSettingService.getParentCompanyList('?FilterParams.ColumnName=id&FilterParams.ColumnType=Text&FilterParams.FilterValue=' + this.clientshopId + '&FilterParams.FilterOption=IsNotEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.companyList = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.companyList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  duplicayCheck(isClicked) {
    let jsonObj = {};
    jsonObj['clientName'] = this.addCompanyForm.get("companyName").value?.trim();
    jsonObj['clientId'] = this.addCompanyForm.get("companyId")?.value;
    if (this.addCompanyForm.get("companyName").value?.trim() !== '' || !this.addCompanyForm.controls['companyName'].invalid) {
      this.systemSettingService.checkCompanyNameDuplicacy(jsonObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
            if (data.Data == true) {
              if (this.submitted==true) {
              this.onConfirm(this.addCompanyForm.getRawValue()); 
              }
              // End
              this.addCompanyForm.get("companyName").clearValidators();
              this.addCompanyForm.get("companyName").markAsPristine();
              this.addCompanyForm.get('companyName').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()]);//@who:priti;@when:3-dec-2021;@why:EWM-3982
            }
          }
          else if (data.HttpStatusCode == 402) {
            if (data.Data == false) {
              this.addCompanyForm.get("companyName").setErrors({ codeTaken: true });
              this.addCompanyForm.get("companyName").markAsDirty();
              this.isResponseGet = false;
            }
            this.isResponseGet = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.isResponseGet = false;
          }

        },
        err => {
          if (err.StatusCode == undefined) {
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.isResponseGet = false;
        });
    }
    else {
      this.addCompanyForm.get("companyName").clearValidators();
      this.addCompanyForm.get("companyName").markAsPristine();
      this.addCompanyForm.get('companyName').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()])
      this.isResponseGet = false;
    }
  }

  onDismissEdit(): void {
    document.getElementsByClassName("leadEdit")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("leadEdit")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  onSave(value) {
    this.submitted = true;
    this.isResponseGet = true;
    if (this.addCompanyForm.invalid) {
      return;
    }
    this.duplicayCheck(true);
  }
  getClientListById() {
    this.loading = true;
    this.systemSettingService.fetchClientListById("?ClientId=" + this.LeadId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.clientListById = repsonsedata.Data;
          this.patchDataForClientEdit(repsonsedata.Data)
          this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.loading = false;
          this.clientListById = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
      this.loading = false;
  }

  patchDataForClientEdit(value) {
    if (value != undefined && value != null && value != '') {
      this.CompanyLocationspopUp = value?.ClientLocations[0];
      if ((value?.OrganizationIds != undefined) && (value?.OrganizationIds != null) && (value?.OrganizationIds.length != 0)) {
        let orgIdData: any = [];
        for (let index = 0; index < value?.OrganizationIds.length; index++) {
          const element = value?.OrganizationIds[index];
          orgIdData.push({ 'Id': element })
        }
        this.selectedOrg = orgIdData;
      }
      this.addCompanyForm.patchValue({
        'orgId': value?.OrganizationIds,
        'companyName': value?.ClientDetails?.ClientName,
        'companyId': this.LeadId,
        'address': value.ClientLocations[0]?.AddressLinkToMap,
        'BrandId': value?.ClientDetails?.BrandId,
        'Brand': value?.ClientDetails?.BrandName,
        'ParentId': value?.ClientDetails?.ParentClientId,
        'ParentClient': value?.ClientDetails?.ParentClientName,
        'ClientRM': value?.ClientRM,
        'contact': value?.ClientContacts,
        'longitude': value.ClientLocations[0]?.Longitude,
        'lattitude': value.ClientLocations[0]?.Latitude,
        'TypeId': value?.ClientDetails?.TypeId,
        'Type': value?.ClientDetails?.TypeName,
        // 'StatusName': value?.LeadDetails?.StatusName,
        // 'StatusId': value?.LeadDetails?.StatusId,
        'ReasonId': value?.ClientDetails?.ReasonId,
        'Reason': value?.ClientDetails?.Reason,
      });
      this.clientContact = value?.ClientContacts;
      this.selectedClientContact = value?.ClientContacts;
      this.clientEmailIds = value?.GrantAccessList;
      this.clientEmailIds?.forEach(x => {
        this.userSelectedList.push({
          'UserId': x?.UserId,
          'EmailId': x?.EmailId,
          'MappingId': 0,
          'UserName': x?.UserName,
          'Mode': 0
        });
      });
      this.acessId = value?.LeadDetails?.AccessId;
      this.acessName =value?.LeadDetails?.AccessName;
      // this.regonStatu = { Code: value?.LeadDetails?.StatusName, Id: value?.LeadDetails?.StatusId, }
      // this.tenantReasonGropCodeList(this.regonStatu, this.searchVal, false);
      //////Industry//////////////
      if ((value?.IndustryList != undefined) && (value?.IndustryList != null) && (value?.IndustryList?.length != 0)) {
        this.addCompanyForm.patchValue({
          industryId: value?.IndustryList
        });
        let industryId: any = []
        for (let index = 0; index < value?.IndustryList?.length; index++) {
          const element = value?.IndustryList[index];
          industryId.push({ Id: element })
        }
        this.selectedIndustry = industryId;
        this.ClientIndustries = this.selectedIndustry.map((item: any) => {
          return item.Id
        });
        //////Sub Industry//////////////
        this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + value?.IndustryList + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.resetFormSubjectSubIndustry.next(this.dropDownSubIndustryConfig);
        this.addCompanyForm.patchValue({
          subIndustry: value?.SubIndustryList
        });
        let subIndustryId: any = []
        for (let index = 0; index < value?.SubIndustryList?.length; index++) {
          const element = value?.SubIndustryList[index];
          subIndustryId.push({ Id: element })
        }
        this.selectedSubIndustry = subIndustryId;
      }
      if (value?.Emails) {
        let checkMainEmail = value?.Emails.filter(x => x['TypeName'] === 'Main');
        if (checkMainEmail?.length > 0) {
          this.sendMainEmailSelected = true;
        } else {
          this.sendMainEmailSelected = false;
        }
        for (let j = 0; j < value?.Emails?.length; j++) {
          this.emails.push({
            email: value?.Emails[j]['EmailId'],
            type: value?.Emails[j]['Type'],
            Name: value?.Emails[j]['TypeName'],
            IsDefault: value?.Emails[j]['IsDefault'],
            EmailId: value?.Emails[j]['EmailId'],
            Type: value?.Emails[j]['Type'],
          })
        }
      }


      if (value?.Phones) {
        value?.Phones.forEach(e => {
          this.phoneArr.push({ ...e, CountryId: +e?.CountryId, phoneCodeName: e?.PhoneCode })
        })
        //  End
        for (let j = 0; j < value?.Phones?.length; j++) {
          this.phone.push({
            phone: value?.Phones[j]['PhoneNumber'],
            type: value?.Phones[j]['Type'],
            Name: value?.Phones[j]['TypeName'],
            IsDefault: value?.Phones[j]['IsDefault'],
            phoneCodeName: value?.Phones[j]['PhoneCode'],
            CountryId: value?.Phones[j]['CountryId']
          })
        }
      }

    }
  }

  onConfirm(value): void {
    let createCompnyJson = {};
    let emailJson = [];
    let phoneJson = [];
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem?.Type);
      elem.EmailId = elem?.EmailId;
      emailJson.push({ "Type": elem?.type, "TypeName": elem?.TypeName, "EmailId": elem?.email, "IsDefault": elem?.IsDefault });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem?.Type);
      elem.PhoneNumber = elem?.PhoneNumber;
      phoneJson.push({ "Type": elem?.type, "TypeName": elem?.Name, "PhoneNumber": elem?.phone, "PhoneCode": elem?.phoneCodeName, "IsDefault": elem?.IsDefault });
    });
    createCompnyJson['OrganizationIdList'] = this.addCompanyForm.value?.orgId;
    createCompnyJson['ClientName'] = this.addCompanyForm.value?.companyName?.trim();
    createCompnyJson['ClientLocations'] = [this.CompanyLocationspopUp];
    createCompnyJson['Address'] = this.addCompanyForm.value?.address;
    createCompnyJson['IndustryInternalCodeList'] = this.addCompanyForm.value?.industry;
    createCompnyJson['SubIndustryIdList'] = this.addCompanyForm.value?.subIndustry;
    if (this.addCompanyForm.value.Brand != null && this.addCompanyForm.value?.Brand != undefined) {
      createCompnyJson['BrandId'] = Number(this.addCompanyForm.value?.BrandId);
      createCompnyJson['Brand'] = this.addCompanyForm.value?.Brand;
    } else {
      createCompnyJson['BrandId'] = 0;
      createCompnyJson['Brand'] = '';
    }
    if (this.addCompanyForm.value?.ParentClient != null && this.addCompanyForm.value?.ParentClient != undefined) {
      createCompnyJson['ParentClient'] = this.addCompanyForm.value?.ParentClient;
      createCompnyJson['ParentId'] = this.addCompanyForm.value?.ParentId;
    } else {
      createCompnyJson['ParentClient'] = '';
      createCompnyJson['ParentId'] = '00000000-0000-0000-0000-000000000000';
    }
    createCompnyJson['ClientRM'] = !this.addCompanyForm.value?.ClientRM?[]:this.addCompanyForm.value?.ClientRM;
    createCompnyJson['ClientContacts'] = this.selectedClientContact;
    createCompnyJson['Longitude'] = String(this.addCompanyForm.value?.longitude);
    createCompnyJson['Latitude'] = String(this.addCompanyForm.value?.lattitude);
    if (this.addCompanyForm.value.Type != null && this.addCompanyForm.value?.Type != undefined) {
      createCompnyJson['TypeId'] = Number(this.addCompanyForm.value?.TypeId);
      createCompnyJson['Type'] = this.addCompanyForm.value?.Type;
    } else {
      createCompnyJson['TypeId'] = 0;
      createCompnyJson['Type'] = '';
    }
    if (this.addCompanyForm.value?.StatusName != null && this.addCompanyForm.value?.StatusName != undefined) {
      createCompnyJson['StatusName'] = this.addCompanyForm.value?.StatusName;
      createCompnyJson['StatusId'] = this.addCompanyForm.value?.StatusId;
    } else {
      createCompnyJson['StatusName'] = '';
      createCompnyJson['StatusId'] = '';
    }
    if (this.addCompanyForm.value?.Reason != null && this.addCompanyForm.value?.Reason != undefined) {
      createCompnyJson['Reason'] = this.addCompanyForm.value?.Reason;
      createCompnyJson['ReasonId'] = this.addCompanyForm.value?.ReasonId;
    } else {
      createCompnyJson['Reason'] = '';
      createCompnyJson['ReasonId'] = 0;
    }
    createCompnyJson['Email'] = emailJson;
    createCompnyJson['Phone'] = phoneJson;
    createCompnyJson['AccessId'] =  this.acessId;
     createCompnyJson['AccessName'] =  this.acessName;
     createCompnyJson['GrantAccessList'] = this.userSelectedList;
     createCompnyJson['PageURL'] = window.location.href;
     createCompnyJson['LeadId'] = this.LeadId;
    this.systemSettingService.convertLeadIntoClient(createCompnyJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addCompanyForm.reset();
          document.getElementsByClassName("leadEdit")[0].classList.remove("animate__fadeInDownBig")
          document.getElementsByClassName("leadEdit")[0].classList.add("animate__fadeOutUpBig");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
        this.isResponseGet=false;

      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.isResponseGet=false;

      })

  }

  getAllOwnerAndCompanyContacts() {
    this.quickJobService.fetchUserInviteList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.ownerList = repsonsedata.Data;
          this.companyContactsList = this.ownerList?.filter((e: any) => e?.UserTypeCode === 'EMPL');
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.ownerList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  openModelContactRelatedSearch() {
    const dialogRef = this.dialog.open(CompanyContactPopupComponent, {
      data: new Object({ clientContact: this.clientContact }),
      panelClass: ['xeople-modal', 'AddContactForCompany', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.clientContact = res;
      }
      else {
        this.loading = false;
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


  redirect() {
    window.open('./client/core/administrators/group-master/status?groupId=' + this.groupCodeQuickClientDetailsPage, '_blank');
  }

  redirectRegon() {
    window.open('./client/core/administrators/group-master/reason?GroupId=' + this.groupCodeQuickClientDetailsPage + '&statusId=' + this.selectedStatusone.Id + '&V=listMode' + '&GroupCode=COMPANY');
  }

  searchData(inputValue) {
    if (inputValue?.length > 0 && inputValue?.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, inputValue)
  }

  searchRegonData(inputValue) {
    if (inputValue?.length > 0 && inputValue?.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.tenantReasonGropCodeList(this.regonStatu, inputValue, false);
  }

  public onSearchResonFilterClear(): void {
    this.searchVal = '';
    this.tenantReasonGropCodeList(this.regonStatu, this.searchVal, false);
  }

  public onSearchFilterClear(): void {
    this.loadingSearch = true;
    this.searchValue = '';
    this.getStatusGroupCode(this.groupCodeQuickClientDetailsPage, this.searchValue);
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }

  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }
  refreshRegon() {
    this.regonStatu = { Code: this.StatusCode, Id: this.StatusId }
    this.tenantReasonGropCodeList(this.regonStatu, this.searchValue, false);
  }
  onClearData() {
    this.addCompanyForm.get("StatusName").reset()
    this.addCompanyForm.get("Reason").reset()
  }
  onChangeContact(dataRM) {
    if (dataRM != null && dataRM != undefined && dataRM != '') {
      this.selectedClientContact = dataRM;
    }
    this.finalArrayList = [];
    for (let index = 0; index < dataRM?.length; index++) {
      const element = dataRM[index];
      this.finalArrayList.push({ Name: element?.EmailName })
    }
  }
  public onFilter(inputValue: string): void {
    this.isFilter = true;
    if (inputValue?.length > 0 && inputValue?.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this.searchSubject$.next(inputValue);

  }
  customClientContactSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.Name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.EmailId.toLocaleLowerCase().indexOf(term) > -1 ||
      (item.Name + " (" + item.EmailId + ")").toLocaleLowerCase().indexOf(term) > -1;
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value as string || '')?.trim()?.length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  dropdownConfig() {
    this.common_DropdownC_Config = {
      API: this.serviceListClass.getClientContactList,
      MANAGE: '',
      BINDBY: 'Name',
      REQUIRED: false,
      DISABLED: false,
      PLACEHOLDER: 'label_contact',
      SHORTNAME_SHOW: true,
      SINGLE_SELECETION: false,
      AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
      IMG_SHOW: true,
      EXTRA_BIND_VALUE: 'EmailId',
      IMG_BIND_VALUE: 'ProfileImage',
      FIND_BY_INDEX: 'Id',
    }
  }
}



/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {
  addressBarData: Address;
  constructor(public title: string, public subtitle: string, public message: string) {
  }

  public handleAddressChange(address: Address) {
    this.addressBarData = address

  }

}

