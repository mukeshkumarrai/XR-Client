import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { email, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ButtonTypes } from 'src/app/shared/models';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { customDropdownConfig } from '@app/modules/EWM.core/shared/datamodels';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AddAddressComponent } from '@app/modules/EWM.core/shared/quick-modal/add-address/add-address.component';
import { AddphonesComponent } from '@app/modules/EWM.core/shared/quick-modal/addphones/addphones.component';
import { CustomValidatorService } from '@app/shared/services/custome-validator/custom-validator.service';
import { ManageAccessActivityComponent } from '@app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { IquickLead } from './IquickLead';
@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.scss']
})
export class AddLeadComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  phone: any = [];
  emails: any = []
  addLeadForm: FormGroup;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public selected: any = [];
  public emailPattern: string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public statusList: any = [];
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public emailArr: any;
  public phoneArr: any = [];
  addressBarData: Address;
  public CompanyLocationspopUp: any=[];
  public CompanyLocationspopUpView: any;
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  events: Event[] = [];
  loading: boolean = false;
  public dropDownOrgConfig: customDropdownConfig[] = [];
  public selectedOrg: any = {};
  public dropDownWorkFlowNameConfig: customDropdownConfig[] = [];
  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = {};
  public dropDownLeadSourceMasterConfig: customDropdownConfig[] = [];
  public selectedLeadSource: any = {};
  public dropDownJobWorkflowConfig: customDropdownConfig[] = [];
  public selectedJobWorkflow: any = {};
  value: any;
  groupCodeClientLead: any;
  animationVar: any;
  public StatusId: any;
  public inputValue: any;
  searchSubject$ = new Subject<any>();
  pagesize = 200;
  pageNo = 1;
  public loadingPopup: boolean;
  isFilter: boolean = false;
  isResponseGet: boolean = false;
  getDateFormat: string;
  public clientId: any;
  public oldPatchValues: any;
  accessEmailId: any = [];
  Access: boolean = false;
  pageNameDRPObj = {
    pageName: 'jobManage',
    mode: 'add'
  }
  public workFlowDropdownConfig: DRP_CONFIG;
  public maxMoreLengthForWorkFlow: number = 5;
  StatusName: string;
  public selectedLeadGeneratedby: any = [];
  public leadGeneratedbyConfig: DRP_CONFIG;
  public ClientIndustries: any[] = [];
  submitted = false;
  isDisabled: boolean = true;
  DefaultWorkflow = 1;
  currentStartDate: any = new Date();
  public expandedMoreFields: boolean = false;
  PageUrl: string;
  pathName: string='/client/leads/lead/lead-landing';
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddLeadComponent>, private countryMasterService: CountryMasterService,
    private serviceListClass: ServiceListClass,private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, private _appSetting: AppSettingsService,public systemSettingService: SystemSettingService) {
      this.emailPattern=this._appSetting.emailPattern;
      this.groupCodeClientLead = this._appSetting.groupCodeQuickClientDetailsPage;
      //this.PageUrl=data?.PageUrl+'?leadId=';
      this.addLeadForm = this.fb.group({
      OrgId: [[], [Validators.required]],
      LeadId: [''],
      LeadName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()]],
      WorkFlowId: [''],
      WorkFlowName: [''],
      LeadStatusName: [null, [Validators.required]],
      LeadStatusId: ['00000000-0000-0000-0000-000000000000'],
      SourceName: [''],
      SourceId: ['00000000-0000-0000-0000-000000000000'],
      LeadGeneratedbyId: ['00000000-0000-0000-0000-000000000000'],
      LeadGeneratedbyName: [''],
      DateStart: [null, [CustomValidatorService.dateValidator]],
      address: ['', [Validators.maxLength(250)]],
      industry: [],
      AccessName: ['', [Validators.required]],
      AccessId: [],
      Phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      Emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
    });
  }
  ngOnInit() {
    this.PageUrl= window?.location?.origin+this.pathName;
    this.animationVar = ButtonTypes;
    this.setDefaultWorkflow();
    this.bindConfigUserInvitation();
    this.dropdownConfigSetting();
    this.getStatusGroupCode(this.groupCodeClientLead);
    this.addLeadForm.controls['LeadStatusName']?.disable();
    this.commonserviceService?.onOrgSelectId?.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage?.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }
    })    
      let orgdata = [this.OrganizationId];
      this.addLeadForm?.patchValue({
        'OrgId': orgdata,
        'AccessName': 'Public',
        'AccessId': 2
      });
      this.selectedOrg = [{ Id: this.OrganizationId }];
  }
  dropdownConfigSetting() {
    this.dropDownOrgConfig['IsDisabled'] = false;
    this.dropDownOrgConfig['apiEndPoint'] = this.serviceListClass?.getOrganizationList;
    this.dropDownOrgConfig['placeholder'] = 'label_organization';
    this.dropDownOrgConfig['IsManage'] = '';
    this.dropDownOrgConfig['IsRequired'] = true;
    this.dropDownOrgConfig['searchEnable'] = true;
    this.dropDownOrgConfig['bindLabel'] = 'OrganizationName';
    this.dropDownOrgConfig['multiple'] = true;

    this.dropDownWorkFlowNameConfig['IsDisabled'] = false;
    this.dropDownWorkFlowNameConfig['apiEndPoint'] = this.serviceListClass?.getClientWorkflowAll + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND';
    this.dropDownWorkFlowNameConfig['placeholder'] = 'label_ClientWorkflow';
    this.dropDownWorkFlowNameConfig['IsManage'] = '';
    this.dropDownWorkFlowNameConfig['IsRequired'] = true;
    this.dropDownWorkFlowNameConfig['searchEnable'] = true;
    this.dropDownWorkFlowNameConfig['bindLabel'] = 'WorkflowName';
    this.dropDownWorkFlowNameConfig['multiple'] = false;

    this.dropDownIndustryConfig['IsDisabled'] = false;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass?.getIndustryAll + '?PageNumber=1&PageSize=500' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;

    this.dropDownLeadSourceMasterConfig['IsDisabled'] = false;
    this.dropDownLeadSourceMasterConfig['apiEndPoint'] = this.serviceListClass?.getLeadSourceMaster+ '?PageNumber=1&PageSize=200' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownLeadSourceMasterConfig['placeholder'] = 'label_LeadSource';
    this.dropDownLeadSourceMasterConfig['IsManage'] = '/client/core/administrators/lead-source';
    this.dropDownLeadSourceMasterConfig['IsRequired'] = false;
    this.dropDownLeadSourceMasterConfig['searchEnable'] = true;
    this.dropDownLeadSourceMasterConfig['bindLabel'] = 'Name';
    this.dropDownLeadSourceMasterConfig['multiple'] = false;
    this.dropDownLeadSourceMasterConfig['isClearable'] = true;
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
  onOrgChange(data) {
    if (data == null || data == "" || data?.length == 0) {
      this.selectedOrg = null;
      this.addLeadForm?.patchValue(
        {
          OrgId: null,
        });
      this.addLeadForm.get("OrgId")?.setErrors({ required: true });
      this.addLeadForm.get("OrgId")?.markAsTouched();
      this.addLeadForm.get("OrgId")?.markAsDirty();
    }
    else {
      this.addLeadForm.get("OrgId")?.clearValidators();
      this.addLeadForm.get("OrgId")?.markAsPristine();
      this.selectedOrg = data;
      const OrgIdData = data?.map((item: any) => {
        return item?.Id
      });
      this.addLeadForm?.patchValue(
        {
          OrgId: OrgIdData
        });
    }
  }
  onIndustrychange(data) {
    if (data == null || data == "" || data?.length == 0) {
      this.selectedIndustry = null;
      this.addLeadForm?.patchValue(
        {
          industry: null,
          subIndustry: null,
        })
      this.ClientIndustries = [];
    }
    else {
      this.addLeadForm.get("industry")?.clearValidators();
      this.addLeadForm.get("industry")?.markAsPristine();
      this.selectedIndustry = data;
      this.ClientIndustries = [];
      this.ClientIndustries = data?.map((item: any) => {
        return item?.Id
      });
      this.addLeadForm?.patchValue(
        {
          industry: this.ClientIndustries
        }
      )
    }
  }
  createemail(): FormGroup {
    return this.fb.group({
      EmailId: ['', [Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators?.unique()]]
    });
  }
  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators?.unique()]],
      phoneCode: [''],
      phoneCodeName: []
    });
  }
  remove(items: any, type: string): void {
    if (type == 'email') {
      const index = this.emails?.indexOf(items);
      if (index >= 0) {
        this.emails?.splice(index, 1);
      }
      if (this.emails?.length == 0) {
        this.addLeadForm?.controls['Emailmul']?.setErrors({ 'required': true });
      }
    }
    else if (type == 'phone') {
      const index = this.phone?.indexOf(items);
      if (index >= 0) {
        this.phone?.splice(index, 1);
        this.phoneArr?.splice(index, 1);
      }
    }
  }
  addEmail() {
    this.addLeadForm.get('Emailmul')?.reset();
    let mode;
    if (this.emails?.length == 0) {
      mode = 'Add';
    } else {
      mode = 'edit';
      }
      const dialogRef = this.dialog?.open(AddemailComponent, {
      data: new Object({ Emailmul: this.addLeadForm?.get('Emailmul'),emailsChip: this.emails, mode:mode,  pageName: 'genralInfoPage', values: {Email:this.emails}}),
      panelClass: ['xeople-modal' , 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed()?.subscribe(res => {
      this.emailArr = res?.data;
      if (this.emailArr) {
        this.emails = [];
        let emailControls = this.addLeadForm?.get('Emailmul')?.get('emailInfo') as FormArray;
        for (let j = 0; j < this.emailArr?.length; j++) {
          this.emails?.push({
            email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['Name'],
            IsDefault: this.emailArr[j]['IsDefault'], EmailId: this.emailArr[j]['EmailId'], Type: this.emailArr[j]['Type']
          })
          emailControls?.controls?.forEach(c => {
            c.get('EmailId').setValue('');
            c.get('Type').clearValidators();
          });
          this.patch(this.emailArr[j]['EmailId'], this.emailArr[j]['Type']);
        }
      } else {
        this.patch(null, null);
        let emailControls = this.addLeadForm?.get('Emailmul')?.get('emailInfo') as FormArray;
        emailControls?.controls?.forEach(c => {
          c.get('EmailId')?.clearValidators();
          c.get('Type')?.clearValidators();
          c.get('EmailId')?.updateValueAndValidity();
          c.get('Type')?.updateValueAndValidity();
        });
      }
    })
  }
  patch(emailId: any, typeId: any) {
    const control = <FormGroup>this.addLeadForm.get('Emailmul');
    const childcontrol = <FormArray>control?.controls?.emailInfo;
    childcontrol?.clear();
    childcontrol?.push(this.patchValues(emailId, typeId))
    this.addLeadForm.patchValue({
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
    const dialogRef = this.dialog?.open(AddAddressComponent, {
      data: new Object({
        addressmul: this.addLeadForm?.get('addressmul'), emailsChip: this.emails,
        addressBarData: this.CompanyLocationspopUpView,
        clientStatus: '1'
      }),
      panelClass: ['xeople-modal', 'add_address', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res && res?.data) {
        let AddressLinkToMap = res.data?.AddressLinkToMap;
        if (AddressLinkToMap != undefined && AddressLinkToMap != null && AddressLinkToMap != '') {
          this.addLeadForm?.patchValue({ address: res.data?.AddressLinkToMap });
        } else {
          this.addLeadForm?.patchValue({ address: (res.data?.AddressLine1 + ' ' + res.data?.AddressLine2) });
        }
        this.addLeadForm?.patchValue({ lattitude: res.data?.Latitude });
        this.addLeadForm?.patchValue({ longitude: res.data?.Longitude });
        this.CompanyLocationspopUpView=res?.data;
        this.CompanyLocationspopUp = [res?.data];
      }
    })
  }
 addPhone() {
    this.addLeadForm.get('Phonemul')?.reset();
    const dialogRef = this.dialog?.open(AddphonesComponent, {
      data: new Object({ Phonemul: this.addLeadForm.get('Phonemul'), phoneChip:[], mode: 'edit', values: { Phone: this.phoneArr } }),
      panelClass: ['xeople-modal' , 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.data != null && res?.data != '') {
        this.phoneArr = res.data;
        this.phone = [];
        for (let j = 0; j < this.phoneArr?.length; j++) {
          this.phone?.push({
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
  }
  getOrganizationList() {
    this.countryMasterService.getOrganizationList().subscribe(
      (responseData: ResponceData) => {
        if (responseData?.HttpStatusCode === 200) {
          this.organizationData = responseData?.Data;
        } else if (responseData?.HttpStatusCode === 204) {
          this.organizationData = [];
        } else if (responseData?.HttpStatusCode === 400) {
          this.organizationData = responseData?.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService?.instant(err?.Message), err?.StatusCode);
      })
  }
  getStatusGroupCode(groupCodeClientLead) {
    this.systemSettingService.getLeadActiveStatus(groupCodeClientLead).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata?.HttpStatusCode === 200) {
          this.statusList = repsonsedata?.Data;
          this.StatusId = this.statusList[0]?.Id;
          this.StatusName = this.statusList[0]?.ShortDescription;
          this.addLeadForm.patchValue({
            LeadStatusId: this.StatusId,
            LeadStatusName: this.StatusName
          });
        } else if (repsonsedata?.HttpStatusCode === 204) {
          this.statusList = [];
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err?.Message), err?.StatusCode);
      })
  }
  duplicacyCheckLeadName(isClicked) {
    let jsonObj = {};
    jsonObj['clientName'] = this.addLeadForm.get("LeadName").value?.trim();
    if (this.addLeadForm.get("LeadName").value?.trim() !== '' || !this.addLeadForm.controls['LeadName'].invalid) {
      this.systemSettingService.checkCompanyNameDuplicacy(jsonObj).subscribe(
        (data: ResponceData) => {
          if (data?.HttpStatusCode == 200 || data?.HttpStatusCode == 204) {
            if (data?.Data == true) {
              if (this.addLeadForm && this.submitted == true && isClicked) {
                this.onConfirm(this.addLeadForm?.getRawValue());
              }
              this.addLeadForm.get("LeadName")?.clearValidators();
              this.addLeadForm.get("LeadName")?.markAsPristine();
              this.addLeadForm.get('LeadName')?.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()]);//@who:priti;@when:3-dec-2021;@why:EWM-3982
            }
          }
          else if (data?.HttpStatusCode == 402) {
            if (data?.Data == false) {
              this.addLeadForm?.get("LeadName")?.setErrors({ codeTaken: true });
              this.addLeadForm?.get("LeadName")?.markAsDirty();
              this.isResponseGet = false;
            }
            this.isResponseGet = false;
          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data?.Message), data?.HttpStatusCode?.toString());
            this.isResponseGet = false;
          }
        },
        err => {
          if (err?.StatusCode == undefined) {
          }
          this.snackBService?.showErrorSnackBar(this.translateService?.instant(err?.Message), err?.StatusCode);
          this.isResponseGet = false;
        });
    }
    else {
      this.addLeadForm.get("LeadName")?.clearValidators();
      this.addLeadForm.get("LeadName")?.markAsPristine();
      this.addLeadForm.get('LeadName')?.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()])
      this.isResponseGet = false;
    }
  }
  onSave(value) {
    this.submitted = true;
    this.isResponseGet = true;
    if (this.addLeadForm?.invalid) {
      return;
    }
    this.duplicacyCheckLeadName(true);
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control?.value as string || '')?.trim()?.length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  clearEndDate(e) {
    this.addLeadForm.patchValue({
      DateStart: null
    });
  }
  openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
    const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
      data: { candidateId: this.clientId, Id: Id, Name: Name, AccessModeId: this.oldPatchValues, ActivityType: 1, HasAccessFromJob: true },
      panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef?.afterClosed()?.subscribe(res => {
      if (res?.isSubmit == true) {
        this.oldPatchValues = {};
        this.accessEmailId = [];
        res.ToEmailIds?.forEach(element => {
          this.accessEmailId?.push({
            'Id': element['Id'],
            'UserId': element['UserId'],
            'EmailId': element['EmailId'],
            'UserName': element['UserName'],
            'MappingId': element[''],
            'Mode': 0
          });
        });
        this.addLeadForm?.patchValue({
          'AccessName': res?.AccessName,
          'AccessId': res?.AccessId[0]?.Id
        });
        this.oldPatchValues = { 'AccessId': res.AccessId[0]?.Id, 'GrantAccesList': this.accessEmailId }
      }
    })
  }
  onLeadSourceChange(data) {
    this.selectedLeadSource = data;
    this.addLeadForm?.patchValue(
      {
        SourceId: data?.Id,
        SourceName: data?.Name
      }
    )
  }
  setDefaultWorkflow() {
    this.systemSettingService.getClientWorkflowAll(this.DefaultWorkflow).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata?.HttpStatusCode === 200) {
          const selectedWorkflowItem = repsonsedata?.Data?.find(item => item?.IsDefault === 1);
          this.selectedJobWorkflow = selectedWorkflowItem;
          if (selectedWorkflowItem) {
            this.addLeadForm?.patchValue(
              {
                WorkFlowId: this.selectedJobWorkflow?.Id,
                WorkFlowName: this.selectedJobWorkflow?.WorkflowName
              }
            )
          }
          else {
            this.selectedJobWorkflow = null;
            this.addLeadForm?.patchValue(
              {
                WorkFlowId: null,
                WorkFlowName: null
              }
            )
          }
        } else {
          this.selectedJobWorkflow = null;
          this.addLeadForm?.patchValue(
            {
              WorkFlowId: null,
              WorkFlowName: null
            }
          )
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  onWorkflowchange(data) {
    if (data == null || data == "") {
      this.selectedJobWorkflow = null;
      this.addLeadForm?.patchValue(
        {
          WorkFlowId: null,
          WorkFlowName: null
        }
      )
      this.addLeadForm.get("WorkFlowId").setErrors({ required: true });
      this.addLeadForm.get("WorkFlowId").markAsTouched();
      this.addLeadForm.get("WorkFlowId").markAsDirty();
    }
    else {
      this.addLeadForm.get("WorkFlowId").clearValidators();
      this.addLeadForm.get("WorkFlowId").markAsPristine();
      this.selectedJobWorkflow = data;
      this.addLeadForm.patchValue(
        {
          WorkFlowId: data?.Id,
          WorkFlowName: data?.WorkflowName
        }
      )
    }
  }
  onLeadGeneratedByChange(data) {
    if (data == null || data == "") {
      this.selectedLeadGeneratedby = null;
      this.addLeadForm.patchValue(
        {
          LeadGeneratedbyId: null,
          LeadGeneratedbyName: null
        }
      )
    }
    else {
      this.selectedLeadGeneratedby = data;
      this.addLeadForm.patchValue(
        {
          LeadGeneratedbyId: data?.Id,
          LeadGeneratedbyName: data?.UserName
        }
      )
    }
  }
  onConfirm(value): void {
      let createCompnyJson:IquickLead={} as IquickLead;
      const emailJson = this.emails?.map(elem => ({
        Type: parseInt(elem?.type),
        TypeName: elem?.TypeName,
        EmailId: elem?.email,
        IsDefault: elem?.IsDefault
      }));
      const phoneJson = this.phone?.map(elem => ({
        Type: parseInt(elem?.type),
        TypeName: elem?.Name,
        PhoneNumber: elem?.phone,
        PhoneCode: elem?.phoneCodeName,
        IsDefault: elem?.IsDefault
      }));
        createCompnyJson['OrganizationIdList'] = this.addLeadForm?.value?.OrgId;
        createCompnyJson['LeadName'] = this.addLeadForm.value.LeadName?.trim();
        createCompnyJson['ClientWorkflow'] = this.addLeadForm.value?.WorkFlowId;
        createCompnyJson['ClientWorkflowName'] = this.addLeadForm.value?.WorkFlowName;
        createCompnyJson['LeadSourceId'] = this.addLeadForm.value?.SourceId;
        createCompnyJson['LeadSourceName'] = this.addLeadForm.value?.SourceName;
        createCompnyJson['LeadGeneratedbyId'] = this.addLeadForm.value?.LeadGeneratedbyId;
        createCompnyJson['LeadGeneratedbyName'] = this.addLeadForm.value?.LeadGeneratedbyName;
        createCompnyJson['LeadGeneratedOn'] = this.addLeadForm.value?.DateStart;
        createCompnyJson['LeadLocations'] = this.CompanyLocationspopUp;
        createCompnyJson['Address'] = this.addLeadForm.value.address;
        createCompnyJson['IndustryInternalCodeList'] = this.addLeadForm.value?.industry;
        createCompnyJson['AccessId'] = this.addLeadForm.value?.AccessId;
        createCompnyJson['AccessName'] = this.addLeadForm.value?.AccessName;
        createCompnyJson['GrantAccessList'] = this.accessEmailId;
        createCompnyJson['StatusName'] = this.StatusName;
        createCompnyJson['StatusId'] = this.addLeadForm.value?.LeadStatusId;
        createCompnyJson['Email'] = emailJson;
        createCompnyJson['Phone'] = phoneJson;
        createCompnyJson['PageUrl'] = this.PageUrl;
        this.systemSettingService?.createQuickLead(createCompnyJson)?.subscribe(
          (responseData: ResponceData) => {
            if (responseData?.HttpStatusCode === 200) {
              this.addLeadForm?.reset();
              this.snackBService.showSuccessSnackBar(this.translateService?.instant(responseData?.Message), responseData?.HttpStatusCode?.toString());
              document.getElementsByClassName("add-lead")[0]?.classList?.remove("animate__fadeInDownBig")
              document.getElementsByClassName("add-lead")[0]?.classList?.add("animate__fadeOutUpBig");
              setTimeout(() => { this.dialogRef.close(true); }, 200);
               }else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(responseData?.Message), responseData?.HttpStatusCode?.toString());
            }
            this.isResponseGet=false;
          }, err => {
            this.snackBService.showErrorSnackBar(this.translateService.instant(err?.Message), err?.StatusCode);
            this.isResponseGet=false;
          })
      }
     onDismiss(): void {
        document?.getElementsByClassName("add-lead")[0]?.classList?.remove("animate__fadeInDownBig")
        document?.getElementsByClassName("add-lead")[0]?.classList?.add("animate__fadeOutUpBig");
        setTimeout(() => { this.dialogRef?.close(false); }, 200);
      }

      toggleMoreFields() {
        this.expandedMoreFields = !this.expandedMoreFields;
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
