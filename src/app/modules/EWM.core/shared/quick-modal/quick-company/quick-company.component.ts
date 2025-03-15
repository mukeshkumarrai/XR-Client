/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Naresh Singh
  @When: 16-June-2021
  @Why: EWM-1450 EWM-1865
  @What: this section handle all quick people component related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { AddphonesComponent } from '../addphones/addphones.component';
import { AddSocialComponent } from '../add-social/add-social.component';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { email, RxwebValidators } from '@rxweb/reactive-form-validators';
import { AddAddressComponent } from '../add-address/add-address.component';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressBarComponent } from 'src/app/shared/address-bar/address-bar.component';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { ProfileInfoService } from '../../services/profile-info/profile-info.service';
import { MatInput } from '@angular/material/input';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { QuickJobService } from '../../services/quickJob/quickJob.service';
import { CompanyContactPopupComponent } from './company-contact-popup/company-contact-popup.component';
import { customDropdownConfig } from '../../../shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ButtonTypes } from 'src/app/shared/models';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { ManageAccessActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/manage-access-activity/manage-access-activity.component';
import { ShareClientEohComponent } from '../../../client/client-detail/share-client-eoh/share-client-eoh.component';
import { RouterData } from '../../../../../shared/enums/router.enum';
@Component({
  selector: 'app-quick-company',
  templateUrl: './quick-company.component.html',
  styleUrls: ['./quick-company.component.scss']
})
export class QuickCompanyComponent implements OnInit {

  /**********************global variables decalared here **************/
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  phone: any = [];
  socials: any = [];
  emails: any = []
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput: ElementRef<HTMLInputElement>;
  addCompanyForm: FormGroup;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public brandList: any = [];
  public industryList: any = [];
  public subIndustryList: any = [];
  public subIndustryListId: any = [];
  public selected: any = [];
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public statusList: any = [];
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public emailArr: any;
  public phoneArr: any = [];
  public socialArr: any;
  addressBarData: Address;
  public CompanyLocationspopUp: any;
  public locationTypeList: any = [];
  public reasonList: any = [];
  public companyList: any = [];
  public selectedValue: any;
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  events: Event[] = [];
  // public countryId:any=[];
  selectedSubIndustryIdValue: any;

  clientListById: any;

  client: any;
  loading: boolean = false;

  public ownerList: any[] = [];
  public companyContactsList: any[] = [];
  public clientContact: any = [];

  public dropDownOrgConfig: customDropdownConfig[] = [];
  public selectedOrg: any = {};

  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = {};

  public dropDownselectClientcontactConfig: customDropdownConfig[] = [];
  public selectClientcontact: any = {};

  resetFormSubjectSubIndustry: Subject<any> = new Subject<any>();
  public dropDownSubIndustryConfig: customDropdownConfig[] = []; 
  public selectedSubIndustry: any = {};
  sendMainEmailSelected:boolean = false;
  dirctionalLang;
  value: any;
  groupCodeQuickClientDetailsPage: any;
  public clientshopId:any
  loadingSearch: boolean;
  public searchValue: string = "";
  public searchVal: string = "";
  animationVar:any;

   /*************@suika@EWM-10681 EWM-EWM-10815  @02-03-2023 to set default values for status in client and not clearable************/
  public ClientStatusActiveKey:string;
  regonStatus: { Code: string; Id: string; };
  statusregoenList: any;
  regonStatu: {};
  public StatusCode: any;
  public StatusId: any;
  public inputValue: any;
  public dropDownSalaryBandNameConfig: customDropdownConfig[] = [];
  public selectedSalaryBandName: any = {};
  selectedCurrencyValue: string;
  searchSubject$ = new Subject<any>();
  pagesize=200;
  pageNo = 1;
  public loadingPopup: boolean;
  isFilter: boolean = false;
  finalArrayList = [];
  public selectedStatusone: any = {};
  isResponseGet: boolean=false;
  common_DropdownC_Config:DRP_CONFIG;
  public selectedClientContact: any = {};
  Accesspermission: any ={};
  accessEmailId: any = [];
  clientLeadType: string;
  StatusName: string;
  clientLeadId: any;
  pathNameLead: string='/client/leads/lead/lead-landing';
  pathNameClient: string='/client/core/clients/list';
  PageUrl: string;
  brandAppSetting: any=[];
  EOHLogo: any;
  buttonConfig = 
    {
        id: 'EOHSHareClientBtn',
        label: 'label_saveShare',
        apiCall: this.openEOHShareClientPopUp.bind(this)
    }
;
EOHIntegrationObj: any;
IsEOHIntergrated: any;
eohRegistrationCode: any;
extractEnableClientCheck: number=0;
  savedClientId: any;

  loadingStates = {
    save: false,
    saveExit: false,
    EOHShare:false
};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QuickCompanyComponent>, private countryMasterService: CountryMasterService,
    private textChangeLngService: TextChangeLngService, private quickJobService: QuickJobService,
    private serviceListClass: ServiceListClass,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, private _appSetting: AppSettingsService,
    public systemSettingService: SystemSettingService, private profileInfoService: ProfileInfoService) {
      this.emailPattern=this._appSetting.emailPattern;
      this.groupCodeQuickClientDetailsPage = this._appSetting.groupCodeQuickClientDetailsPage;
       /*************@suika@EWM-10681 EWM-EWM-10815  @02-03-2023 to set default values for status in client and not clearable************/
      this.ClientStatusActiveKey = this._appSetting.ClientStatusActiveKey;
      this.clientshopId=this.data?.clientId
      this.addCompanyForm = this.fb.group({
      orgId: [[], [Validators.required]],
      companyId: [''],
      companyName: ['', [Validators.required,Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()]],//@who:priti;@when:3-dec-2021;@why:EWM-3982
      address: [[], [Validators.maxLength(250)]],
      industry: [],
      subIndustry: [],
      BrandId: [0],
      Brand: [null],
      AccessName: ['', [Validators.required]],
      AccessId: [],

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
      Type: [null],
      StatusName: [null, [Validators.required]],
      StatusId: [''],
      ReasonId: [0],
      Reason: [null],
      contact:[null]

    }); 
    this.brandAppSetting = this._appSetting.brandAppSetting;
  }

  public isEditForm: boolean;
  submitted = false;

  ngOnInit() {
    this.selectedClientContact=null;
    this.dropdownConfig();
    this.animationVar = ButtonTypes;
    this.ddlconfigSetting();
   // this.getCountryInfo();
    this.tenantBrandList(this.value);
    this.getLocationType();
    // who:this.maneesh,what:ewm-11606 for manage and refresh and search value this.getStatusGroupCode(),when:05/05/2023
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
    if (this.data?.formType === 'Edit' || this.data?.formType ==='edit' || this.data?.formType ==='EditForm') {   
      this.clientLeadType=this.data?.clientLeadType;
      const typeControl = this.addCompanyForm.get('Type');
      const addressControl = this.addCompanyForm.get('address');
      if(this.data?.clientLeadType==='LEAD'){
        this.PageUrl= window?.location?.origin+this.pathNameLead;
        this.addCompanyForm.controls['ParentClient']?.disable();
        this.addCompanyForm.controls['StatusName']?.disable();
        this.addCompanyForm.controls['Reason']?.disable();
        typeControl?.clearValidators();
        addressControl?.clearValidators();
      }else{
        this.PageUrl= window?.location?.origin+this.pathNameClient;
        typeControl.setValidators([Validators.required]);
        addressControl.setValidators([Validators.required]);
      }
      typeControl?.updateValueAndValidity(); // Notify Angular of the change
      addressControl?.updateValueAndValidity(); // Notify Angular of the change
      this.isEditForm = true;
      this.getClientListById(this.data?.clientId);
      this.tenantParentCompanyListEditClient();//who:maneesh,what:ewm-15501 for edit client then get parent client fixed this api,when:20/12/2023
    }
    else if (this.data?.formType === 'AddForm') {
      this.PageUrl= window?.location?.origin+this.pathNameClient;
      const typeControl = this.addCompanyForm.get('Type');
      const addressControl = this.addCompanyForm.get('address');
      typeControl.setValidators([Validators.required]);
      typeControl?.updateValueAndValidity(); // Notify Angular of the change
      addressControl.setValidators([Validators.required]);
      addressControl?.updateValueAndValidity(); // Notify Angular of the change
      this.isEditForm = false;
      let orgdata = [this.OrganizationId];
      this.addCompanyForm.patchValue({
        'orgId': orgdata
      });
      this.selectedOrg = [{ Id: this.OrganizationId }];
      this.tenantParentCompanyList();//who:maneesh,what:ewm-15501 for add client then get parent client fixed this api,when:20/12/2023

    } else {
      this.PageUrl= window?.location?.origin+this.pathNameClient;
      const typeControl = this.addCompanyForm.get('Type');
      typeControl?.setValidators([Validators.required]);
      typeControl?.updateValueAndValidity(); // Notify Angular of the change
      const addressControl = this.addCompanyForm.get('address');
      addressControl?.setValidators([Validators.required]);
      addressControl?.updateValueAndValidity(); // Notify Angular of the change
      this.isEditForm = false; 
      let orgdata = [this.OrganizationId];
      this.addCompanyForm.patchValue({
        'orgId': orgdata
      });
      this.selectedOrg = [{ Id: this.OrganizationId }];
      this.tenantParentCompanyList();//who:maneesh,what:ewm-15501 for add client then get parent client fixed this api,when:20/12/2023
    }

      /*************@suika@EWM-10681 EWM-EWM-10815  @02-03-2023 to set default values for status in client and not clearable************/

      let status = {Code:"ACTIVE", Id:this.ClientStatusActiveKey}
      this.regonStatu = {Code:"ACTIVE", Id:this.ClientStatusActiveKey}
      this.tenantReasonGropCodeList(status,this.searchVal,false);
      // who:maneesh,what:ewm-11569.ewm-11569 for dropdown and matchip,When:27/03/2023 -->
      this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      
        this.loadingSearch = true;
      });
      this.addCompanyForm.patchValue({
        'AccessName': 'Public',
        'AccessId': 2
      });
      this.Accesspermission = { 'AccessId': 2, 'GrantAccesList': '' };
      const filteredBrands = this.brandAppSetting?.filter(brand => brand?.EOH);
      this.EOHLogo=filteredBrands[0]?.logo;
      this.eohRegistrationCode = this._appSetting.eohRegistrationCode;
      let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
      this.EOHIntegrationObj = JSON.parse(localStorage.getItem("EOHIntegration"));
     let eohRegistrationCode = otherIntegrations?.filter(res => res.RegistrationCode === this.eohRegistrationCode);
    this.IsEOHIntergrated = eohRegistrationCode[0]?.Connected; 
    this.extractEnableClientCheck= this.EOHIntegrationObj?.clientExtractEnable;
  
}
    // who:this.openModelContactRelatedSearch,what:ewm-12030 for manage and refresh and search value this.getStatusGroupCode(),when:05/05/2023
  refresh(){
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
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll +'?PageNumber=1&PageSize=500' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;
    //////Sub Industry//////////////
    this.dropDownSubIndustryConfig['IsDisabled'] = false;
    //  this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + IndustryId ;
    this.dropDownSubIndustryConfig['placeholder'] = 'quickjob_subIndustry';
    this.dropDownSubIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownSubIndustryConfig['IsRequired'] = false;
    this.dropDownSubIndustryConfig['searchEnable'] = true;
    this.dropDownSubIndustryConfig['bindLabel'] = 'Description';
    this.dropDownSubIndustryConfig['multiple'] = true;

  }

  /*
 @Type: File, <ts>
 @Name: onOrgchange function
 @Who: Anup
 @When: 02-feb-2022
 @Why: EWM-4615 EWM-4816
 @What: get org List
 */
  onOrgchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedOrg = null;
      this.addCompanyForm.patchValue(
        {
          orgId: null,
        });
      this.addCompanyForm.get("orgId")?.setErrors({ required: true });
      this.addCompanyForm.get("orgId")?.markAsTouched();
      this.addCompanyForm.get("orgId")?.markAsDirty();
    }
    else {
      this.addCompanyForm.get("orgId")?.clearValidators();
      this.addCompanyForm.get("orgId")?.markAsPristine();
      this.selectedOrg = data;
      const orgIdData = data.map((item: any) => {
        return item.Id
      });
      this.addCompanyForm.patchValue(
        {
          orgId: orgIdData
        });
    }
  }



  /*
 @Type: File, <ts>
 @Name: onIndustrychange function
 @Who: Anup
 @When: 02-feb-2022
 @Why: EWM-4615 EWM-4816
 @What: get industry List
 */
  onIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedIndustry = null;
      this.selectedSubIndustry = null;
      this.addCompanyForm.patchValue(
        {
          industry: null,
          subIndustry: null,
        })
        this.ClientIndustries=  [];
    }
    else {
      this.addCompanyForm.get("industry")?.clearValidators();
      this.addCompanyForm.get("industry")?.markAsPristine();
      this.selectedIndustry = data;
      // who:this.maneesh,what:ewm-13074 for idustry data not patch without change in edit case ,when:10/17/2023
      this.ClientIndustries=  [];
      this.ClientIndustries = data.map((item: any) => {
        return item.Id
      });
      // who:this.maneesh,what:ewm-13074 for idustry data not patch without change in edit case this.ClientIndustries ,when:10/17/2023
      this.addCompanyForm.patchValue(
        {
          industry: this.ClientIndustries
        }
      )
      //////Sub Industry//////////////
      this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + this.ClientIndustries+ '&PageNumber=1&PageSize=500' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubIndustry.next(this.dropDownSubIndustryConfig);
    }
    this.clickIndustryGetSubIndustry();
  }

  /*
  @Type: File, <ts>
  @Name: onSubIndustrychange function
  @Who: Anup
  @When: 02-feb-2022
  @Why: EWM-4615 EWM-4816
  @What: get sub industry List by industry id
  */
  onSubIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
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

  /*
  @Type: File, <ts>
  @Name: clickIndustryGetSubIndustry function
  @Who: Anup
  @When: 02-feb-2022
  @Why: EWM-4615 EWM-4816
  @What: click industry get sub industry
  */
  clickIndustryGetSubIndustry() {
    let Id = this.addCompanyForm.get('industry')?.value;
    let id = Id;

    this.quickJobService.getSubIndustryAll(id).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.subIndustryList = repsonsedata.Data;
          this.cancelIndustryUpdateSubIndustry(this.subIndustryList);
        }else if(repsonsedata.HttpStatusCode === 400){ //who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
          this.subIndustryList = repsonsedata.Data;
         }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


      // who:this.maneesh,what:ewm-13074 for sub idustry data not patch if i select new industry ,when:10/17/2023
  cancelIndustryUpdateSubIndustry(data) {
    const subId = data.map((item: any) => {
      return item.Id
    });
    const commonSubIndustryId = subId.filter(e => this.addCompanyForm.get('subIndustry')?.value?.indexOf(e) !== -1);
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
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }




  /*
   @Type: File, <ts>
   @Name: createemail
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: when user click on add to create form group with same formcontrol
   */
  createemail(): FormGroup {
    return this.fb.group({
      EmailId: ['', [Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]]
    });
  }


  /*
   @Type: File, <ts>
   @Name: createphone
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: when user click on add to create form group with same formcontrol
   */

  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      phoneCode: [''],
      phoneCodeName: []
    });
  }


  /*
   @Type: File, <ts>
   @Name: add
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: to add more chip via input(not used currently)
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '')?.trim();
    if (value) {
      this.fruits.push(value);
    }

    this.fruitCtrl.setValue(null);
  }

  /*
  @Type: File, <ts>
  @Name: remove
  @Who: Nitin Bhati
  @When: 26-June-2021
  @Why: EWM-864
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {   
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails.length == 0) {
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

  /*
  @Type: File, <ts>
  @Name: _filter
  @Who: Nitin Bhati
  @When: 26-June-2021
  @Why: EWM-864
  @What: to filter out duplicate value in mat chip list (not in use currently)
  */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }


  onChangeType(type) {
    this.addCompanyForm.patchValue({
      TypeId: type.Id,
      Type: type.Name
    });

  }

  onChangeClient(client) {
    this.addCompanyForm.patchValue({
      ParentId: client.ClientId,
      ParentClient: client.ClientName
    });
  }

  onChangeBrand(brand) {
    this.addCompanyForm.patchValue({
      BrandId: brand.Id,
      Brand: brand.Brand
    });
  }


  onChangeReason(reason) {
     this.addCompanyForm.patchValue({
      ReasonId: reason.Id,
      Reason: reason.Description
    });
  }

  finalArray = [];
  onChangeRM(dataRM) {
    this.finalArray = [];
    for (let index = 0; index < dataRM.length; index++) {
      const element = dataRM[index];

      this.finalArray.push({ Id: element.UserId, Name: element.UserName })
    }
  }

  /*
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Nitin Bhati
    @When: 26-June-2021
    @Why: EWM-864
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onConfirm(value,action,btnId?:string): void {
    let createCompnyJson = {};
    let emailJson :any= [];
    let phoneJson :any= [];

    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.type, "TypeName": elem.TypeName, "EmailId": elem.email, "IsDefault": elem.IsDefault });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "TypeName": elem.Name, "PhoneNumber": elem.phone, "PhoneCode": elem.phoneCodeName, "IsDefault": elem.IsDefault });
    });
    createCompnyJson['OrganizationIdList'] = this.addCompanyForm.value.orgId;
    // <!-- who:maneesh,what:ewm-13530 for trim data,When:25/07/2023 -->
    createCompnyJson['ClientName'] = this.addCompanyForm.value.companyName?.trim();
    createCompnyJson['ClientLocations'] = [this.CompanyLocationspopUp];
    createCompnyJson['Address'] = this.addCompanyForm.value.address;
    createCompnyJson['IndustryInternalCodeList'] = this.addCompanyForm.value.industry;
    createCompnyJson['SubIndustryIdList'] = this.addCompanyForm.value.subIndustry;
    createCompnyJson['AccessId'] = this.addCompanyForm.value.AccessId;
    createCompnyJson['AccessName'] = this.addCompanyForm.value.AccessName;
    createCompnyJson['GrantAccessList'] = this.accessEmailId;
    if (this.addCompanyForm.value.Brand != null && this.addCompanyForm.value.Brand != undefined) {
      createCompnyJson['BrandId'] = Number(this.addCompanyForm.value.BrandId);
      createCompnyJson['Brand'] = this.addCompanyForm.value.Brand;
    } else {
      createCompnyJson['BrandId'] = 0;
      createCompnyJson['Brand'] = '';
    }

    if (this.addCompanyForm.value.ParentClient != null && this.addCompanyForm.value.ParentClient != undefined) {
      createCompnyJson['ParentClient'] = this.addCompanyForm.value.ParentClient;
      createCompnyJson['ParentId'] = this.addCompanyForm.value.ParentId;
    } else {
      createCompnyJson['ParentClient'] = '';
      createCompnyJson['ParentId'] = '00000000-0000-0000-0000-000000000000';
    }

    createCompnyJson['ClientRM'] = this.addCompanyForm.value.ClientRM;
    // <!-- who:maneesh,what:ewm-11569.ewm-11569 for dropdown and matchip when create client,When:27/03/2023 -->
    createCompnyJson['ClientContacts'] = this.selectedClientContact;


    createCompnyJson['Longitude'] = String(this.addCompanyForm.value.longitude);
    createCompnyJson['Latitude'] = String(this.addCompanyForm.value.lattitude);


    if (this.addCompanyForm.value.Type != null && this.addCompanyForm.value.Type != undefined) {
      createCompnyJson['TypeId'] = Number(this.addCompanyForm.value.TypeId);
      createCompnyJson['Type'] = this.addCompanyForm.value.Type;
    } else {
      createCompnyJson['TypeId'] = 0;
      createCompnyJson['Type'] = '';
    }

    if (this.addCompanyForm.value.StatusName != null && this.addCompanyForm.value.StatusName != undefined) {
      createCompnyJson['StatusName'] = this.addCompanyForm.value.StatusName;
      createCompnyJson['StatusId'] = this.addCompanyForm.value.StatusId;
    } else {
      createCompnyJson['StatusName'] = '';
      createCompnyJson['StatusId'] = '';
    }


    if (this.addCompanyForm.value.Reason != null && this.addCompanyForm.value.Reason != undefined) {
      createCompnyJson['Reason'] = this.addCompanyForm.value.Reason;
      createCompnyJson['ReasonId'] = this.addCompanyForm.value.ReasonId;
    } else {
      createCompnyJson['Reason'] = '';
      createCompnyJson['ReasonId'] = 0;
    }
    createCompnyJson['Email'] = emailJson;
    createCompnyJson['Phone'] = phoneJson;
    createCompnyJson['PageURL'] = this.PageUrl;

    this.systemSettingService.createQuickCompany(createCompnyJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.loadingStates[action] = false;
          this.addCompanyForm.reset();
          document.getElementsByClassName("quickCompany")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("quickCompany")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          // who:Renu,why: EWM-19577 EWM-19597 what: FOR OPENING FORM TO SHARE CLIENT,when24/02/2025
          if (btnId) {
            this.savedClientId=responseData?.Data?.ClientId;
            this.buttonConfig.apiCall(responseData?.Data?.ClientName);
          }
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
        // aarsh singh 17-08-2023
        else if(responseData.Message === '400021'){}
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
        this.isResponseGet=false;
        this.loadingStates[action] = false;
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.isResponseGet=false;

      })

  }
  // who:Renu,why: EWM-19410 EWM-19551 what: FOR OPENING FORM TO SHARE CLIENT,when:12/02/2025
  openEOHShareClientPopUp(value: string){
    const message = ``;
     const title = 'label_ClientHeadingEOH';
     const subtitle = '';
     const dialogData = new ConfirmDialogModel(title, subtitle, message);
     const dialogRef = this.dialog.open(ShareClientEohComponent, {
       data: new Object({'ClientName':value,dialogData: dialogData,'savedClientId':this.savedClientId}),
       panelClass: ['xeople-modal', 'share-client-eoh', 'animate__animated', 'animate__zoomIn'],
       disableClose: true,
     });
     dialogRef.afterClosed().subscribe(res => {
      if(res==false){
   
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
 
 
  /*
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Nitin Bhati
    @When: 26-June-2021
    @Why: EWM-864
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onDismiss(): void {
    document.getElementsByClassName("quickCompany")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("quickCompany")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  /*
    @Type: File, <ts>
    @Name: addEmail
    @Who: Nitin Bhati
    @When: 26-June-2021
    @Why: EWM-864
    @What: for opening the email dialog box
  */
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

  addEmail() {
    this.addCompanyForm.get('emailmul').reset();
    let mode;
    if (this.emails.length == 0) {
      mode = 'Add';
      }else{
      mode = 'edit';
      }
    const dialogRef = this.dialog.open(AddemailComponent, {

      data: new Object({ emailmul: this.addCompanyForm.get('emailmul'),emailsChip: this.emails, mode:mode,  pageName: 'genralInfoPage', values: {Email:this.emails}}),
      panelClass: ['xeople-modal' , 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.emailArr = res.data;
      if (this.emailArr) {
        this.emails = [];
        let emailControls = this.addCompanyForm.get('emailmul')?.get('emailInfo') as FormArray;
       
        // this.emailArr.sort((a, b) => b.IsDefault - a.IsDefault);
        for (let j = 0; j < this.emailArr.length; j++) {
          this.emails.push({
            email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['Name'],
            IsDefault: this.emailArr[j]['IsDefault'], EmailId: this.emailArr[j]['EmailId'],Type: this.emailArr[j]['Type']
          })
          emailControls.controls.forEach(c => {
            c.get('EmailId').setValue('');
            c.get('Type').clearValidators();
          });
          this.patch(this.emailArr[j]['EmailId'],this.emailArr[j]['Type']);
        }
       
      }else{
        this.patch(null,null);
    // who:bantee,what:ewm-13675 what:Save button gets disabled just after opening and cancel the emailpop up. when:02/08/2023
        let emailControls = this.addCompanyForm.get('emailmul')?.get('emailInfo') as FormArray;
        emailControls.controls.forEach(c => {
            c.get('EmailId')?.clearValidators();
            c.get('Type')?.clearValidators();
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

 //@maneesh @EWM-12097 @patch value in form control
 patch(emailId: any, typeId: any) {
  const control = <FormGroup>this.addCompanyForm.get('emailmul');
  const childcontrol = <FormArray>control.controls.emailInfo;
  childcontrol.clear();
  childcontrol.push(this.patchValues(emailId, typeId))
  this.addCompanyForm.patchValue({
    emailmul: childcontrol
  })
}

//@maneesh @EWM-12097 @patch value in form control
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
        clientStatus:'1'
      }),
      panelClass: ['xeople-modal', 'add_address', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,

    });
    dialogRef.afterClosed().subscribe(res => {
// <!--@Bantee Kumar,@EWM-14407 ,@when:20-09-2023, client address state does not change after change address-->
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

  /*
   @Type: File, <ts>
   @Name: addPhone
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: for opening the phone dialog box
 */

  addPhone() {
    this.addCompanyForm.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {

      data: new Object({ phonemul: this.addCompanyForm.get('phonemul'), phoneChip:[], mode: 'edit', values: { Phone: this.phoneArr } }),
      panelClass: ['xeople-modal' , 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data!=null && res.data!='') {
        this.phoneArr = res.data;
        this.phone = [];
        for (let j = 0; j < this.phoneArr.length; j++) {
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

  /*
   @Type: File, <ts>
   @Name: getOrganizationList
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: get all organization Details
   */

  getOrganizationList() {
    this.countryMasterService.getOrganizationList().subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode == '200' || responseData.HttpStatusCode == '204') {
          this.organizationData = responseData.Data;
        }else if(responseData.HttpStatusCode === 400){ //who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
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
        } else if (repsonsedata.HttpStatusCode === 400) {//who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
          this.locationTypeList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
    @Type: File, <ts>
    @Name: getStatusGroupCode
    @Who: Nitin Bhati
    @When: 26-June-2021
    @Why: EWM-864
    @What: To get Data from people type will be from user types where type is People
    */

  getStatusGroupCode(groupCodeQuickClientDetailsPage,searchValue) {
   this.systemSettingService.getStatusGroupCodesearchValue(groupCodeQuickClientDetailsPage, searchValue +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
      this.loadingSearch = false;
         this.statusList = repsonsedata.Data[0]?.statuses;
         this.statusregoenList = repsonsedata.Data[0]?.statuses[0]?.Id;
         this.loadingSearch = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.statusList = repsonsedata.Data[0].statuses;
          this.loadingSearch = false;
        }else if (repsonsedata.HttpStatusCode === 400){ //who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
          this.statusList = repsonsedata.Data;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
      @Type: File, <ts>
      @Name: tenantUserTypeList
      @Who: Nitin Bhati
      @When: 26-June-2021
      @Why: EWM-864
      @What: To get Data from people type will be from user types where type is People
      */

  tenantReasonGropCodeList(status,inputValue,data) {
      // who:maneesh,what:ewm-11606 for status id tenantReasonGropCodeList pass parameter false,When:14/05/2023 -->
 if (data==true) {
  this.addCompanyForm.patchValue({
    StatusName: status.Code,
    StatusId: status.Id,
    ReasonId:null,
    Reason:null
  });
}else{
  this.addCompanyForm.patchValue({
    StatusName: status.Code,
    StatusId: status.Id,
  });
}
      // who:maneesh,what:ewm-11606 for status id ,When:14/05/2023 -->
    this.selectedStatusone = status;
 this.systemSettingService.getReasonStatusGroupCodesearchValue(status.Id ,inputValue +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        this.reasonList = repsonsedata.Data[0]?.reasons;
        this.loadingSearch = false;
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.reasonList = repsonsedata.Data[0]?.reasons;
          // who:maneesh,what:ewm-11606 for status regon when:11/05/2023
          this.StatusCode = repsonsedata.Data[0]?.StatusCode;
          this.StatusId = repsonsedata.Data[0]?.StatusId;
          this.loadingSearch = false;

        } else if (repsonsedata.HttpStatusCode == 400) { // who:maneesh,what:ewm-14174 for handel 400 when:28/09/2023
          this.reasonList = repsonsedata.Data[0]?.reasons;
          this.StatusCode = repsonsedata.Data[0]?.StatusCode;
          this.StatusId = repsonsedata.Data[0]?.StatusId;
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }




  /*
   @Type: File, <ts>
   @Name: tenantBrandList
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: To get Data from industry
   */
  tenantBrandList(value) {
    this.systemSettingService.getBrandAllListAll('?FilterParams.ColumnName=statusname&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.brandList = repsonsedata.Data;
        }else if(repsonsedata.HttpStatusCode === 400){ //who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
          this.brandList = repsonsedata.Data;
         }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Type: File, <ts>
   @Name: tenantParentCompanyList
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: To get Data from parent company
   */

  // who:maneesh,what:ewm.9644 change filtervalue clientshopId ,when:03/01/2023
  tenantParentCompanyList() {
    this.systemSettingService.getParentCompanyList('?FilterParams.ColumnName=id&FilterParams.ColumnType=Text&FilterParams.FilterValue='+this.clientshopId+ '&FilterParams.FilterOption=IsNotEqualTo').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.companyList = repsonsedata.Data;
        }else if(repsonsedata.HttpStatusCode === 400){ //who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
          this.companyList = repsonsedata.Data; 
         }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

    /*
   @Type: File, <ts>
   @Name: tenantParentCompanyListEditClient
   @Who: maneesh
   @When: 20-12-2023
   @Why: EWM-864
   @What: To get Data from parent company
   */
   tenantParentCompanyListEditClient() {
    this.systemSettingService.getParentCompanyAllEditClient('?ClientId='+this.clientshopId+'&ByPassPaging=true').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == 200) {
          this.companyList = repsonsedata.Data;
        }else if(repsonsedata.HttpStatusCode == 204){ 
          this.companyList = repsonsedata.Data;
         }
        else if(repsonsedata.HttpStatusCode == 400){ 
          this.companyList = repsonsedata.Data;
         } 
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Type: File, <ts>
    @Name: duplicayCheck function
    @Who: Nitin Bhati, Adarsh singh
    @When: 02-July-2021, 17-Aug-2023
    @Why: EWM-1864
    @What: For checking duplicacy for code and description
   */
  duplicayCheck(isClicked,action,btnId?:string) {
    let jsonObj={};
    jsonObj['clientName']=this.addCompanyForm.get("companyName")?.value?.trim();
     // @bantee @save functionality is not working before editing or after editing client @whn 18-09-2023

    if(this.isEditForm === true)
   { jsonObj['clientId']=this.addCompanyForm.get("companyId")?.value;}


    if (this.addCompanyForm.get("companyName")?.value?.trim() !== '' || !this.addCompanyForm.controls['companyName'].invalid) {
      this.systemSettingService.checkCompanyNameDuplicacy(jsonObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
            if (data.Data == true) {
              // modify function by adarsh singh on 17-Aug-223
              if (this.addCompanyForm && this.submitted == true && isClicked) {
                if (this.isEditForm === true) {
                  this.onConfirmUpdate(this.addCompanyForm.getRawValue());
                } else {
                  this.onConfirm(this.addCompanyForm.getRawValue(),action,btnId);
                }
              }
              // End
              this.addCompanyForm.get("companyName")?.clearValidators();
              this.addCompanyForm.get("companyName")?.markAsPristine();
              this.addCompanyForm.get('companyName')?.setValidators([Validators.required,Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()]);//@who:priti;@when:3-dec-2021;@why:EWM-3982
            }
          }
          else if (data.HttpStatusCode == 402) {
            if (data.Data == false) {
              this.addCompanyForm.get("companyName")?.setErrors({ codeTaken: true });
              this.addCompanyForm.get("companyName")?.markAsDirty();
        this.isResponseGet=false;

            }
        this.isResponseGet=false;

          }
          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        this.isResponseGet=false;

          }

        },
        err => {
          if (err.StatusCode == undefined) {
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.isResponseGet=false;

        });
    }
    else{
      this.addCompanyForm.get("companyName").clearValidators();
      this.addCompanyForm.get("companyName").markAsPristine();
      this.addCompanyForm.get('companyName').setValidators([Validators.required,Validators.minLength(2), Validators.maxLength(100), this.noWhitespaceValidator()])
      this.isResponseGet=false;
    
    }
  }


  /*
  @Type: File, <ts>
  @Name: onDismissEdit
  @Who: Anup Singh
  @When: 22-Nov-2021
  @Why: EWM-3638 EWM-3847
  @What: To close Quick Company Modal for edit
  */
  onDismissEdit(): void {
    document.getElementsByClassName("clientEdit")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("clientEdit")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


  /*
  @Type: File, <ts>
  @Name: onSave
  @Who: Anup Singh
  @When: 24-Nov-2021
  @Why: EWM-3638 EWM-3847
  @What: for save and update
  */
  onSave(value,action: 'EOHShare' | 'save' | 'saveExit',btnId?:string) {
    this.loadingStates[action] = true;
    this.submitted = true;
    this.isResponseGet=true;
    if (this.addCompanyForm.invalid) {
      return;
    }
    this.duplicayCheck(true,action,btnId);
  }

  /*
  @Type: File, <ts>
  @Name: getClientListById
  @Who: Anup Singh
  @When: 23-Nov-2021
  @Why: EWM-3638 EWM-3847
  @What: To close Quick Company Modal for edit
  */
  getClientListById(ClientId) {
    this.loading = true;
    this.systemSettingService.fetchClientListById("?ClientId=" + ClientId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.clientListById = repsonsedata.Data;
          this.patchDataForClientEdit(repsonsedata.Data)
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 400){//who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
          this.loading = false; 
          this.clientListById = repsonsedata.Data;
         }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
  @Type: File, <ts>
  @Name: patchDataForClientEdit
  @Who: Anup Singh
  @When: 23-Nov-2021
  @Why: EWM-3638 EWM-3847
  @What: patch data for edit
  */
  industryPatch: any;
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
        'companyId': value?.ClientDetails?.ClientId,
        'address': value.ClientLocations[0]?.AddressLinkToMap,
        'BrandId': value?.ClientDetails?.BrandId,
        'Brand': value?.ClientDetails?.BrandName,

        'ParentId': value?.ClientDetails?.ParentClientId,
        'ParentClient': value?.ClientDetails?.ParentClientName,

        'ClientRM': value?.ClientRM,
        //  who:maneesh,what:ewm-11569.ewm-11569 for patch value in dropdown and matchip,When:27/03/2023 -->
        'contact': value?.ClientContacts,

        'longitude': value.ClientLocations[0]?.Longitude,
        'lattitude': value.ClientLocations[0]?.Latitude,

        'TypeId': value?.ClientDetails?.TypeId,
        'Type': value?.ClientDetails?.TypeName,

        'StatusName': value?.ClientDetails?.StatusName,
        'StatusId': value?.ClientDetails?.StatusId,

        'ReasonId': value?.ClientDetails?.ReasonId,
        'Reason': value?.ClientDetails?.Reason,
        'AccessId': value?.AccessId,
        'AccessName': value?.AccessName,
      });
      this.clientLeadId=value?.ClientDetails?.ClientId;
      this.Accesspermission=value;
      this.accessEmailId = value?.GrantAccessList;
      this.StatusName=value?.ClientDetails?.StatusName;
      this.clientContact = value?.ClientContacts;
      this.selectedClientContact=value?.ClientContacts;//who:maneesh, what:15815 fir patch contact data when:1602/2024
      // who:maneesh,what:ewm-11606 for patch value dropdown,When:16/11/2023 -->
      // this.getClientContact(this.pagesize, this.pageNo,this.searchValue);
      // who:maneesh,what:ewm-11606 for status id tenantReasonGropCodeList pass parameter false,When:14/05/2023 -->
    this.regonStatu = {Code:value?.ClientDetails?.StatusName, Id:value?.ClientDetails?.StatusId,}
      this.tenantReasonGropCodeList(this.regonStatu,this.searchVal,false);

      //////Industry//////////////
      if ((value?.IndustryList != undefined) && (value?.IndustryList != null) && (value?.IndustryList.length != 0)) {
        this.addCompanyForm.patchValue({
          industryId: value?.IndustryList
        });
        let industryId: any = []
        for (let index = 0; index < value?.IndustryList.length; index++) {
          const element = value?.IndustryList[index];
          industryId.push({ Id: element })
        }
        this.selectedIndustry = industryId;
      // who:this.maneesh,what:ewm-13074 for  idustry data not patch if i select new industry ,when:10/17/2023
        this.ClientIndustries = this.selectedIndustry.map((item: any) => {
          return item.Id
        });
        //////Sub Industry//////////////
        this.dropDownSubIndustryConfig['apiEndPoint'] = this.serviceListClass.getSubIndustryAll + '?IndustryId=' + value?.IndustryList +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.resetFormSubjectSubIndustry.next(this.dropDownSubIndustryConfig);
        this.addCompanyForm.patchValue({
          subIndustry: value?.SubIndustryList
        });
        let subIndustryId: any = []
        for (let index = 0; index < value?.SubIndustryList.length; index++) {
          const element = value?.SubIndustryList[index];
          subIndustryId.push({ Id: element })
        }
        this.selectedSubIndustry = subIndustryId;
      }


      if (value?.Emails) {
        let checkMainEmail =  value?.Emails.filter(x => x['TypeName'] === 'Main');
        if (checkMainEmail?.length > 0) {
          this.sendMainEmailSelected = true;
        }else{
          this.sendMainEmailSelected = false;
        }
        for (let j = 0; j < value?.Emails.length; j++) {
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


      if (value.Phones) {
      // --------@When: 18-July-2023 @who:Adarsh singh @why: EWM-10549 --------
        value.Phones.forEach(e=>{
          this.phoneArr.push({...e, CountryId: +e.CountryId, phoneCodeName: e.PhoneCode})
         })
        //  End
        for (let j = 0; j < value?.Phones.length; j++) {
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


  /*
  @Type: File, <ts>
  @Name: onConfirmUpdate
  @Who: Anup Singh
  @When: 23-Nov-2021
  @Why: EWM-3638 EWM-3847
  @What: data save for edit
  */
  public ClientIndustries: any[] = [];
  onConfirmUpdate(value): void {
    let updateCompnyJson = {};
    let emailJson = [];
    let phoneJson = [];

    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.type, "TypeName": elem.TypeName, "EmailId": elem.email, "IsDefault": elem.IsDefault });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "TypeName": elem.Name, "PhoneNumber": elem.phone, "PhoneCode": elem.phoneCodeName, "IsDefault": elem.IsDefault });
    });
    updateCompnyJson['ClientLocations'] =this.CompanyLocationspopUp && Object.keys(this.CompanyLocationspopUp).length > 0  ? [this.CompanyLocationspopUp]  : [];
    //updateCompnyJson['ClientLocations'] = this.CompanyLocationspopUp?.length>2?[this.CompanyLocationspopUp]:[]; commented on 17/01/2025
    updateCompnyJson['OrganizationIds'] = this.addCompanyForm.value.orgId;
      // who:this.maneesh,what:ewm-13074 for  idustry data not patch if i select new industry ,when:10/17/2023
    updateCompnyJson['IndustryList'] = this.ClientIndustries;
    updateCompnyJson['SubIndustryList'] = this.addCompanyForm.value.subIndustry;
    updateCompnyJson['Emails'] = emailJson;
    updateCompnyJson['Phones'] = phoneJson;
    updateCompnyJson['ClientRM'] = this.addCompanyForm.value.ClientRM;
    // <!-- who:maneesh,what:ewm-11569.ewm-11569 for dropdown value select when update data,When:27/03/2023 -->
    updateCompnyJson['ClientContacts'] = this.selectedClientContact;

    let ClientDetailsJson = {}
    updateCompnyJson['ClientDetails'] = ClientDetailsJson
    // <!-- who:maneesh,what:ewm-13530 for trim data,When:25/07/2023 -->
    ClientDetailsJson['ClientName'] = this.addCompanyForm.value.companyName?.trim();
    ClientDetailsJson['ClientId'] = this.addCompanyForm.value.companyId;
    ClientDetailsJson['FullAddress'] = this.addCompanyForm.value.address;
    if (this.addCompanyForm.value.Brand != null && this.addCompanyForm.value.Brand != undefined) {
      ClientDetailsJson['BrandId'] = Number(this.addCompanyForm.value.BrandId);
      ClientDetailsJson['BrandName'] = this.addCompanyForm.value.Brand;
    } else {
      ClientDetailsJson['BrandId'] = 0;
      ClientDetailsJson['BrandName'] = '';
    }
    if (this.addCompanyForm.value.ParentClient != null && this.addCompanyForm.value.ParentClient != undefined) {
      ClientDetailsJson['ParentClientName'] = this.addCompanyForm.value.ParentClient;
      ClientDetailsJson['ParentClientId'] = this.addCompanyForm.value.ParentId;
    } else {
      ClientDetailsJson['ParentClientName'] = '';
      ClientDetailsJson['ParentClientId'] = '00000000-0000-0000-0000-000000000000';
    }

    ClientDetailsJson['Longitude'] = String(this.addCompanyForm.value.longitude);
    ClientDetailsJson['Latitude'] = String(this.addCompanyForm.value.lattitude);

    if (this.addCompanyForm.value.Type != null && this.addCompanyForm.value.Type != undefined) {
      ClientDetailsJson['TypeId'] = Number(this.addCompanyForm.value.TypeId);
      ClientDetailsJson['TypeName'] = this.addCompanyForm.value.Type;
    } else {
      ClientDetailsJson['TypeId'] = 0;
      ClientDetailsJson['TypeName'] = '';
    }

    if (this.addCompanyForm.value.StatusName != null && this.addCompanyForm.value.StatusName != undefined) {
      ClientDetailsJson['StatusName'] = this.addCompanyForm.value.StatusName;
      ClientDetailsJson['StatusId'] = this.addCompanyForm.value.StatusId;
    } else {
      ClientDetailsJson['StatusName'] = '';
      ClientDetailsJson['StatusId'] = '';
    }


    if (this.addCompanyForm.value.Reason != null && this.addCompanyForm.value.Reason != undefined) {
      ClientDetailsJson['Reason'] = this.addCompanyForm.value.Reason;
      ClientDetailsJson['ReasonId'] = this.addCompanyForm.value.ReasonId;
    } else {
      ClientDetailsJson['Reason'] = '';
      ClientDetailsJson['ReasonId'] = 0;
    }
    if(this.clientLeadType==='LEAD'){
      ClientDetailsJson['StatusName'] = this.StatusName;
      ClientDetailsJson['StatusId'] = this.addCompanyForm.value.StatusId;
    }
    updateCompnyJson['AccessId'] = this.addCompanyForm.value.AccessId;
    updateCompnyJson['AccessName'] = this.addCompanyForm.value.AccessName;
    updateCompnyJson['GrantAccessList'] = this.accessEmailId;
    updateCompnyJson['PageURL'] = this.PageUrl;
    const router = RouterData.clientSummery;
    const baseUrl = window.location.origin;
  

    let updateFormData = {
      "From": this.clientListById,
      "To": updateCompnyJson,
      "IsLead":this.clientLeadType==='LEAD'?1:0,
      'ShareClientURL':baseUrl+router
    }


    this.systemSettingService.updateQuickCompany(updateFormData).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
    // who:maneesh,what:ewm-13004 for when edit data then updat details pageXOffset,when:05/07/2023
         this.commonserviceService.updateClientData.next(true);
          this.addCompanyForm.reset();
          document.getElementsByClassName("clientEdit")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("clientEdit")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);

          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
        // aarsh singh 17-08-2023
        else if(responseData.Message === '400021'){}
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
        this.isResponseGet=false;
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.isResponseGet=false;

      })
  }



  ////Owner & company contacts
  /*
@Type: File, <ts>
@Name: getAllOwnerAndCompanyContacts function
@Who: Anup
@When: 09-Dec-2021
@Why: EWM-3695 EWM-4126
@What: get All Owner And Company Contacts
*/
  getAllOwnerAndCompanyContacts() {
    this.quickJobService.fetchUserInviteList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.ownerList = repsonsedata.Data;
          this.companyContactsList = this.ownerList?.filter((e: any) => e.UserTypeCode === 'EMPL');
        }else if(repsonsedata.HttpStatusCode === 400){//who:maneesh,what:ewm-14174 for handel toast in case 204 and 400 ,when:28/09/2023
          this.ownerList = repsonsedata.Data;
         }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }



  /*
  @Type: File, <ts>
  @Name: openModelContactRelatedType
  @Who: Anup Singh
  @When: 09-Dec-2021
  @Why: EWM-3695 EWM-4126
  @What: open Modal for contact related type
  */
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
  window.open('./client/core/administrators/group-master/reason?GroupId='+this.groupCodeQuickClientDetailsPage +'&statusId='+this.selectedStatusone.Id+'&V=listMode' +'&GroupCode=COMPANY');
      // window.open('./client/core/administrators/group-master/status?groupId='+this.groupCodeQuickClientDetailsPage +this.statusregoenList, '_blank');
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
        this.tenantReasonGropCodeList(this.regonStatu,inputValue,false);
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
        this.searchVal = '';
        this.tenantReasonGropCodeList(this.regonStatu,this.searchVal,false);
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
          /*
       @Type: File, <ts>
       @Name: refreshRegon
       @Who:  maneesh
       @When: 08-may-2023
       @Why: EWM.11606
       @What:  for refresh Regon
     */
      refreshRegon(){
        this.regonStatu = {Code:this.StatusCode, Id:this.StatusId}
      this.tenantReasonGropCodeList(this.regonStatu,this.searchValue,false);
      }
               /*
       @Type: File, <ts>
       @Name: onClearData
       @Who:  maneesh
       @When: 08-may-2023
       @Why: EWM.11606
       @What:  for clear data
     */
      onClearData(){
        this.addCompanyForm.get("StatusName").reset()
        this.addCompanyForm.get("Reason").reset()
       }
       /*
    @Type: File, <ts>
    @Name: onChangeContact
    @Who:maneesh
    @When: 29-may-2023
    @Why: EWM-11569
    @What: Function will call when user ChangeContact.
  */
    onChangeContact(dataRM) {
    if (dataRM!=null && dataRM!=undefined && dataRM !='') {
      this.selectedClientContact=dataRM;
    }
      this.finalArrayList = [];
      for (let index = 0; index < dataRM.length; index++) {
        const element = dataRM[index];
        this.finalArrayList.push({ Name: element.EmailName })
      }
    }
    /*
 @Type: File, <ts>
 @Name: onFilter function
 @Who: maneesh
 @When: 30-may-2023
 @Why: EWM-11569
 @What: onFilter
 */
  public onFilter(inputValue: string): void {
    this.isFilter = true;
    if (inputValue?.length > 0 && inputValue?.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pageNo = 1;
    this.searchSubject$.next(inputValue);

  }
    // <!-- who:bantee,what:ewm-14152 On quick add client page, on CONTACT field, keyword search is not working for email ids of client contact, ,When:14/09/2023 -->

    customClientContactSearchFn(term: string, item: any) {
      term = term.toLocaleLowerCase();
      return item.Name.toLocaleLowerCase().indexOf(term) > -1 || 
      item.EmailId.toLocaleLowerCase().indexOf(term) > -1 ||
      (item.Name + " (" + item.EmailId +")").toLocaleLowerCase().indexOf(term) > -1;
   }

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: Adarsh singh
   @When: 17-Aug-2023
   @Why: no
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}


// <!-- who:maneesh,what:ewm-15815 for fixed dropdown ,When:16/02/2024 -->
dropdownConfig(){
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
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'Id',
  }
}
openManageAccessModal(Id: any, Name: any, AccessModeId: any) {
  const dialogRef = this.dialog.open(ManageAccessActivityComponent, {
    data: { candidateId:this.clientLeadId, Id: Id, Name: Name, AccessModeId:this.Accesspermission , ActivityType: 1, HasAccessFromJob: true },
    panelClass: ['xeople-modal', 'add_manageAccess', 'manageClientAccess', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res.isSubmit == true) {
      this.Accesspermission = {};
     this.accessEmailId = [];
      
      res.ToEmailIds?.forEach(element => {
        this.accessEmailId.push({
          'Id': element['Id'],
          'UserId': element['UserId'],
          'EmailId': element['EmailId'],
          'UserName': element['UserName'],
          'MappingId': element[''],
          'Mode': 0
        });
      });
      this.addCompanyForm.patchValue({
        'AccessName': res.AccessName,
        'AccessId': res.AccessId[0].Id
      });
      this.Accesspermission = { 'AccessId': res.AccessId[0].Id, 'GrantAccesList': this.accessEmailId }

    }  

  })

  // RTL Code
  let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      //classList[i].setAttribute('dir', this.dirctionalLang);
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
  /*
   @Type: File, <ts>
   @Name: handleAddressChange function
   @Who: Nitin Bhati
   @When: 26-June-2021
   @Why: EWM-864
   @What: For Address get from input field
    */
  public handleAddressChange(address: Address) {
    this.addressBarData = address

  }
  
 
}
