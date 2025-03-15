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
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { from, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AddphonesComponent } from '../addphones/addphones.component';
import { AddSocialComponent } from '../add-social/add-social.component';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { email, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressBarComponent } from 'src/app/shared/address-bar/address-bar.component';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { ProfileInfoService } from '../../services/profile-info/profile-info.service';
import { customDropdownConfig, statusList } from '../../../shared/datamodels/common.model';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

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
  addAddressForm: FormGroup;
  public direction: string;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public emailPattern:string;//= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z]+$";
  public statusList: any = [];
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public emailArr: any;
  public phoneArr: any = [];
  public socialArr: any;

  public emailForm: FormGroup;
  public emailChip: any;
  //public addressBarData;
  selectedValue: any = {};
  selectedLocationType: any = {};
  selectedState: any = {};
  selectedStatus: any = {};
  selectedValueCountryCode: number;
  public customerTypeList: any = [];
  public stateList: any = [];
  public groupCode;
  addressBarData: Address;
  CompanyLocationspopUp;
  countryISO: string;
  eventsSubject: Subject<any> = new Subject<any>();
  public activityStatus: any;
  public oldPatchValues: any;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  public AddressLinkToMapAdd;
  public locationName: string;
  public StateName: string;
  public locationTypeList: string;
  public matchipDisabled: boolean;
  public oldIsDefault=0;
  IsDisabled: boolean;
  isMultiple: boolean = true;
  public clientName: any;
  clientId: any;
  clientIdStatus: any;
  public isDefault: any;
  loading:boolean;
  public dropDownStateConfig: customDropdownConfig[] = [];
  public selectedStates: any = {};
  resetStateDropdown: Subject<any> = new Subject<any>();
  stateCode: any;
  dirctionalLang;
  public emailPhoneDisabled:boolean; 
  CountryId: number=0;
  CountryIdValue: number=0;

  constructor(public dialogRef: MatDialogRef<AddAddressComponent>, private countryMasterService: CountryMasterService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    @Inject(MAT_DIALOG_DATA) public data: any, private profileInfoService: ProfileInfoService, private route: ActivatedRoute,private appSettingsService: AppSettingsService,
    private serviceListClass: ServiceListClass) {
      this.emailPattern=this.appSettingsService.emailPattern;
    this.addAddressForm = this.fb.group({
      //  locationName:['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]],
      LocationType: [null],
      LocationTypeId: [0],
      CountryId: ['', [Validators.required]],
      Country: [''],
      AddressLinkToMap: ['', [Validators.maxLength(250)]],
      addressLine1: ['', [Validators.required,Validators.maxLength(100)]],
      addressLine2: ['', [Validators.maxLength(100)]],
      districtSuburb: ['', [Validators.maxLength(50)]],
      townCity: ['', [Validators.maxLength(50)]],
      StateId: [''],
      StateName: [null],
      zipPostalCode: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      longitude: ['', [Validators.maxLength(50), Validators.pattern('^[-+]?[0-9]{1,7}(\.[0-9]+)?$')]],
      lattitude: ['', [Validators.maxLength(50), Validators.pattern('^[-+]?[0-9]{1,7}(\.[0-9]+)?$')]],
      Country_Code: [''],
      isDefault: [],
      clientId: [''],
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
    });
    this.emailForm = data.emailmul;
    this.emailChip = data.emailsChip;
    this.addressBarData = data.addressBarData;
    this.activityStatus = data.mode;
    this.clientIdStatus = data.clientStatus;
  
    if (data.clientStatus == 1) { 
      this.addAddressForm.patchValue({
        isDefault: 1
        
      })
      this.isDefault = 1;
      this.addAddressForm.controls["isDefault"].disable();     
    }else{
      this.isDefault = data.IsDefault;
    }
    if (data.isMultiple != undefined) {
      this.isMultiple = data.isMultiple;
    }
    if (data.clientName != undefined) {
      this.clientName = data.clientName;
    }

    //alert(this.activityStatus);
     ////// State //////////////
     this.dropDownStateConfig['IsDisabled'] = false;
    //  this.dropDownStateConfig['apiEndPoint'] = this.serviceListClass.StateAll+'?ByPassPaging=true';
     this.dropDownStateConfig['placeholder'] = 'label_state';
     this.dropDownStateConfig['IsManage'] = '/client/core/administrators/states';
     this.dropDownStateConfig['IsRequired'] = false;
     this.dropDownStateConfig['searchEnable'] = true;
     this.dropDownStateConfig['bindLabel'] = 'StateName';
     this.dropDownStateConfig['multiple'] = false;
    
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clientId = params['clientId'];
    });
// <!--@Bantee Kumar,@EWM-14407 ,@when:20-09-2023, client address state does not change after change address-->

    //this.getCountryInfo();
    // if(this.activityStatus=='add'){
    //   this.addAddressForm.patchValue({ locationName: 'Main' });
    // } 
    //this.getInternationalization();
    this.getOrganizationList();
    // this.getCustomerAllList();
    this.getLocationType();
    //this.getState();
    if (this.data?.addressBarData != undefined && this.data?.addressBarData != null && this.activityStatus != 'add') {
      this.patchValues(this.data?.addressBarData);
    } else {   
      this.isDefault=0;   
      this.getInternationalization();      
    }

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }
    })
    let orgdata = [this.OrganizationId];
    this.addAddressForm.patchValue({
      'orgId': orgdata
    })
    this.direction = localStorage.getItem('direction');
  }

// <!--@Bantee Kumar,@EWM-14407 ,@when:20-09-2023, country list coming from child component-->

  // getCountryInfo() {
  //   this.profileInfoService.fetchCountryInfo(this.pageNumber, this.pageSize).subscribe(
  //     repsonsedata => {
  //       if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
  //         this.countryList = repsonsedata['Data'];
  //       }
  //     }, err => {
  //       // console.log(err);
  //     })
  // }

  getState() {
    this.systemSettingService.getStateList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.stateList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  countryId: any;
  getInternationalization() {
    this.systemSettingService.getInternalization().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.selectedValue = { 'Id': repsonsedata['Data']['CountryId'], 'CountryName': repsonsedata['Data']['CountryName'] };
          this.CountryId = Number(repsonsedata['Data']['CountryId']);
          this.commonserviceService.ondefultCountry.next(this.CountryId);
          this.ddlchange(this.selectedValue);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  // getCustomerAllList() {
  //    this.systemSettingService.getCustomerAllList().subscribe(
  //     (repsonsedata: ResponceData) => {
  //       if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
  //         this.customerTypeList = repsonsedata.Data;
  //       } else {
  //         this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
  //       }
  //     }, err => {
  //       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  //     })
  // }


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
      EmailId: ['', [Validators.pattern(this.emailPattern), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      TypeName: ['']
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
      TypeName: [''],
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
    const value = (event.value || '').trim();
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
        // this.addAddressForm.controls['emailmul'].setErrors({ 'required': true });
      }

    } else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
      }
    } else {
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

  /* 
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Nitin Bhati
    @When: 26-June-2021
    @Why: EWM-864
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(value): void {
    let CompanyLocations = {};
    let emailJson = [];
    let phoneJson = [];

    this.AddressLinkToMapAdd = this.addAddressForm.value.AddressLinkToMap;
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.type, "TypeName": elem.TypeName, "EmailId": elem.email, "IsDefault": elem.IsDefault });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "TypeName": elem.TypeName, "PhoneNumber": elem.phone, "PhoneCode": elem.PhoneCode, "PhoneCodeName": elem.PhoneCodeName, "IsDefault": elem.IsDefault });
    });
    // CompanyLocations['LocationName'] = this.addAddressForm.value.locationName;

    if (this.addAddressForm.value.LocationType != null && this.addAddressForm.value.LocationType != undefined) {
      CompanyLocations['LocationTypeId'] = Number(this.addAddressForm.value.LocationTypeId);
      CompanyLocations['LocationType'] = this.addAddressForm.value.LocationType;
    } else {
      CompanyLocations['LocationTypeId'] = 0;
      CompanyLocations['LocationType'] = '';
    }
    CompanyLocations['CountryId'] = String(this.addAddressForm.value.CountryId);
    CompanyLocations['Country'] = String(this.addAddressForm.value.Country);
    CompanyLocations['AddressLinkToMap'] = this.addAddressForm.value.AddressLinkToMap;
    CompanyLocations['AddressLine1'] = this.addAddressForm.value.addressLine1;
    CompanyLocations['AddressLine2'] = this.addAddressForm.value.addressLine2;
    CompanyLocations['District'] = this.addAddressForm.value.districtSuburb;
    CompanyLocations['TownCity'] = this.addAddressForm.value.townCity;
    if (this.addAddressForm.value.StateName != null && this.addAddressForm.value.StateName != undefined) {
      CompanyLocations['StateId'] =  this.addAddressForm.value.StateId?this.addAddressForm.value.StateId:0//String(this.addAddressForm.value.StateId);
      CompanyLocations['StateName'] = this.addAddressForm.value.StateName;
    } else {
      CompanyLocations['StateId'] = 0;
      CompanyLocations['StateName'] = '';
    }
    CompanyLocations['ZipCode'] = this.addAddressForm.value.zipPostalCode;
    CompanyLocations['Longitude'] = String(this.addAddressForm.value.longitude);
    CompanyLocations['Latitude'] = String(this.addAddressForm.value.lattitude);
    CompanyLocations['Email'] = emailJson;
    CompanyLocations['Phone'] = phoneJson;
    CompanyLocations['isDefault'] = this.isDefault;
    //CompanyLocations['PhoneData'] = this.phone;

    document.getElementsByClassName("add_address")[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("add_address")[0].classList.add("animate__slideOutUp");
    //setTimeout(() => { this.dialogRef.close(CompanyLocations);}, 200);
    setTimeout(() => { this.dialogRef.close({ data: CompanyLocations }); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  getLocationData(typeData) {
    this.addAddressForm.patchValue({
      LocationType: typeData.Name,
      LocationTypeId: typeData.Id,
    })
    // this.selectedLocationType = this.customerTypeList.filter((dl: any) => dl.Id == Id);
    // this.locationName = this.selectedLocationType[0].TypeName;    
  }


  getStateData(stateData) {
    /* this.selectedState = this.stateList.filter((dl: any) => dl.Id == Id);
     this.StateName = this.selectedState[0].StateName;  */
    this.addAddressForm.patchValue({
      StateName: stateData.StateName,
      StateId: stateData.Id,
    })
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
    // Close the dialog, return false
    //this.dialogRef.close(false);

    document.getElementsByClassName("add_address")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("add_address")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

  }

  /* 
    @Type: File, <ts>
    @Name: addEmail
    @Who: Nitin Bhati
    @When: 26-June-2021
    @Why: EWM-864
    @What: for opening the email dialog box
  */
 isDisabled = false;
  addEmail() {
    // who:Ankit Rawat,what:EWM-17801,Set Add/Edit mode,when:02 Aug 24
    if (this.emails.length == 0) {
      this.activityStatus = 'Add';
      }else{
        this.activityStatus = 'edit';
      }
    this.addAddressForm.get('emailmul').reset();
    const dialogRef = this.dialog.open(AddemailComponent, {
      maxWidth: "700px",
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

      data: new Object({ emailmul: this.addAddressForm.get('emailmul'), emailsChip: this.emails, mode: this.activityStatus, values: {Email:this.emails} }),
      panelClass: ['quick-modalbox', 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data != '') {
        this.emailArr = res.data;
        if (this.emailArr?.length > 0) {
          this.emails = [];
          for (let j = 0; j < this.emailArr.length; j++) {
            this.emails.push({
              email: this.emailArr[j]['EmailId'],
              type: this.emailArr[j]['Type'],
              TypeName: this.emailArr[j]['Name'], 
              IsDefault: this.emailArr[j]['IsDefault'],
              // who:Ankit Rawat,what:EWM-17801, Added EmialId and Type properties, when:02 Aug 24
              EmailId: this.emailArr[j]['EmailId'],
              Type: this.emailArr[j]['Type']
            })
          }
          //this.emails  = [...new Map(this.emails.map(item =>[item['EmailId'], item])).values()];
        }
      }
      else{
        const control = this.addAddressForm.get("emailmul").get("emailInfo") as FormArray
          control.clear();
          control.push(
              this.fb.group({
              EmailId: ['', [Validators.pattern(this.emailPattern), Validators.maxLength(100), RxwebValidators.unique()]],
              Type: [[], [RxwebValidators.unique()]],
              TypeName: ['']
            })
          )
      }
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	

    // this.addAddressForm.get('emailmul').markAsPristine();
    // this.addAddressForm.get('emailmul').markAsUntouched();
    // this.addAddressForm.get('emailmul').updateValueAndValidity();
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
    this.addAddressForm.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {
      maxWidth: "700px",
      width: "90%",
      data: new Object({ phonemul: this.addAddressForm.get('phonemul'), phoneChip:[], mode: 'edit', values: { Phone: this.phoneArr } }),
      panelClass: ['quick-modalbox', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data != '') {
        this.phoneArr = res.data;
        if (this.phoneArr.length > 0) {
          this.phone = [];
          for (let j = 0; j < this.phoneArr.length; j++) {
            this.phone.push({
              phone: this.phoneArr[j]['PhoneNumber'],
              type: this.phoneArr[j]['Type'],
              TypeName: this.phoneArr[j]['Name'],
              IsDefault: this.phoneArr[j]['IsDefault'],
              PhoneCode: this.phoneArr[j]['phoneCodeName'],
              PhoneCodeName: this.phoneArr[j]['phoneCodeName']
            })
          }
          // this.phone  = [...new Map(this.phone.map(item =>[item['PhoneNumber'], item])).values()];
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
          // if (this.organizationData.length !== 0) {
          //   let orgDefault = this.organizationData.filter(x => x['OrganizationId'] === this.OrganizationId)[0].OrganizationName;
          //   this.commonserviceService.onOrgSelect.next(orgDefault);
          // }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  public fetchDataFromAddressBar(address) {
    let latitude = address.geometry.location.lat();
    let longitude = address.geometry.location.lng();
    let addressOne: any = "";
    let addressTwo: any = "";

    for (let index = 0; index < address.address_components.length; index++) {
      const element = address.address_components[index];

      switch (element.types[0]) {
        case "locality":
          this.addAddressForm.patchValue({ townCity: element.long_name });
          this.addAddressForm.patchValue({ districtSuburb: element.long_name });
         // addressOne += element.long_name + " ";
          break;
        /*--@Who:Bantee,@When: 28-09-2023,@Why:EWM-14320,@What:Updating lat/long value via refresh icon and lat/long value by clicking on link to map address shows different values.-----*/

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
          // this.addAddressForm.patchValue({ townCity: element.long_name });
          // this.addAddressForm.patchValue({ districtSuburb: element.long_name });
          break;

        case "administrative_area_level_1":
           /*--@Who:Nitin Bhati,@When: 14-March-2023,@Why:EWM-10651,@What:For state code-----*/
// <!--@Bantee Kumar,@EWM-14407 ,@when:20-09-2023, client address state does not change after change address-->

           this.stateCode=  element.short_name;
          let stateId: string;
          let StateName: string;
          if (this.stateList?.length != 0) {
            let StateArr;
            StateArr = this.stateList.filter(x => x['StateCode'].toLowerCase() == element.short_name.toLowerCase());
            if (StateArr.length != 0) {
              stateId = StateArr[0].Id;
              StateName= StateArr[0].StateName;
            } else {
              stateId = '0';
            }
          }
          this.selectedStates = { 'Id': Number(stateId), StateName: StateName};
          this.addAddressForm.patchValue({ StateId: stateId });
          this.addAddressForm.patchValue({ StateName: StateName });
          break;

        case "country":
          this.selectedValue = { 'ISOCode1': element.short_name };
          // this.CountryId = this.countryList.filter(x => x['ISOCode1'] == this.selectedValue.ISOCode1)[0].Id;
          // this.commonserviceService.ondefultCountry.next(this.CountryId);
          break;

        case "postal_code":
          this.addAddressForm.patchValue({ zipPostalCode: element.long_name });
          break;

        default:
          break;
      }

      this.addAddressForm.patchValue({ addressLine1: addressOne });
      this.addAddressForm.patchValue({ addressLine2: addressTwo });
      this.addAddressForm.patchValue({ AddressLinkToMap: address.formatted_address });
      this.addAddressForm.patchValue({ lattitude: latitude });
      this.addAddressForm.patchValue({ longitude: longitude });
      // this.addAddressForm.patchValue({ locationName: 'Main' });

    }


  }
  /*
     @Who: Suika
     @When: 16-june-2021
     @Why: EWM-1876
     @What: get selected data
   */
  ddlchange(data) {
// <!--@Bantee Kumar,@EWM-14407 ,@when:20-09-2023, client address state does not change after change address-->

    if (data == null || data == "" || data == 0) {
      this.selectedState = null;
      this.selectedValue = {};
      if (this.data?.mode== 'View' || this.data?.mode == 'view') {
        this.addAddressForm.get("CountryId").setErrors({ required: false });
      } else {
        this.addAddressForm.get("CountryId").setErrors({ required: true });
        this.addAddressForm.get("CountryId").markAsTouched();
        this.addAddressForm.get("CountryId").markAsDirty();
      }
      this.addAddressForm.patchValue(
        {
          CountryId: '',
          CountryName: '',
        }
      );
    }
    else {
      this.addAddressForm.get("CountryId").clearValidators();
      this.addAddressForm.get("CountryId").markAsPristine();
      this.addAddressForm.get("CountryId").setValidators(Validators.required);

      this.selectedValue = data;
      this.CountryId=data.Id;
      this.addAddressForm.patchValue(
        {
          CountryId: data.Id,
          Country: data.CountryName
        }
      )

        /*--@Who:Nitin Bhati,@When: 11-Aug-2023,@Why:EWM-12429,@What:Implement if condition for handle multile api calling-----*/
        /*--@Who:Bantee,@When: 20-09-2023,@Why:EWM-14407,@What:Implement if condition for handle multile api calling-----*/

        if(this.CountryIdValue!=this.CountryId){
       this.dropDownStateConfig['apiEndPoint'] = this.serviceListClass.StateAll + '?CountryId=' + this.selectedValue.Id + '&ByPassPaging=true' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
       this.resetStateDropdown.next(this.dropDownStateConfig);
       this.CountryIdValue=data?.Id;
     /*--@Who:Nitin Bhati,@When: 14-March-2023,@Why:EWM-10651,@What:For country state mapping ID-----*/
      this.clickCountrygetAllState();
       }
    }

  }
/*
   @Who: Nitin Bhati
   @When: 14-March-2023
   @Why: EWM-10651
   @What:click country get state by id
 */
  clickCountrygetAllState() {
    this.selectedStates = null;
        /*--@Who:Bantee,@When: 20-09-2023,@Why:EWM-14407,@What:removed state API calling----*/

          if(this.stateCode!=null){
            let stateId: any;
            let StateName: string;
            if (this.stateList?.length != 0 && this.stateList != null && this.stateList != undefined && this.stateList !='' ) {
              let StateArr;
// <!--@Bantee Kumar,@EWM-14407 ,@when:20-09-2023, client address state does not change after change address-->

              StateArr = this.stateList?.filter(x => x['StateCode'].toLowerCase() == this.stateCode.toLowerCase());
              if (StateArr?.length != 0) {
                stateId = StateArr[0]?.Id;
                StateName = StateArr[0]?.StateName
              } else {
                stateId = 0;
              }
              if (stateId == 0) {
                StateName = null

              } else {
                this.selectedStates = { 'Id': Number(stateId), StateName: StateName};
                this.addAddressForm.patchValue({ StateId: stateId });
                this.addAddressForm.patchValue({ StateName: StateName });
               }
            }
          }
           
  }


  countryCodeChange(data) {
    if (data == null || data == "") {
      this.addAddressForm.get("Country_Code").setErrors({ required: true });
      this.addAddressForm.get("Country_Code").markAsTouched();
      this.addAddressForm.get("Country_Code").markAsDirty();
    }
    else {
      this.addAddressForm.get("Country_Code").clearValidators();
      this.addAddressForm.get("Country_Code").markAsPristine();
      this.selectedValueCountryCode = data;
      this.addAddressForm.patchValue(
        {
          Country_Code: data
        }
      )
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


  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: patch value in form in Edit Case
*/
  
  patchValues(addressBarData) {
// <!--@Bantee Kumar,@EWM-14407 ,@when:20-09-2023, client address state does not change after change address-->
    this.loading = true;
    setTimeout(() => {
      this.selectedValue = { 'Id': parseInt(addressBarData.CountryId), 'CountryName': addressBarData.Country };
      this.CountryId = this.selectedValue.Id;
      this.ddlchange(this.selectedValue);
      setTimeout(() => {
        this.selectedStates = { Id: addressBarData?.StateId, StateName: addressBarData?.StateName }
        this.onStateChange(this.selectedStates);
        this.loading = false;
      }, 2000);
     }, 2000);
   
    this.emailArr = addressBarData.Email;
    if (this.emailArr) {
      for (let j = 0; j < this.emailArr.length; j++) {
        this.emails.push({ email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['TypeName'], IsDefault: this.emailArr[j]['IsDefault'] })
      }
    }
    // --------@When: 18-July-2023 @who:Adarsh singh @why: EWM-10549 --------
     addressBarData.Phone.forEach(e=>{
      this.phoneArr.push({...e, CountryId: +e.CountryId, phoneCodeName: e.PhoneCode})
     })
    //  End 
    if (this.phoneArr) {
      for (let j = 0; j < this.phoneArr.length; j++) {
        this.phone.push({ phone: this.phoneArr[j]['PhoneNumber'], PhoneCode: this.phoneArr[j]['PhoneCode'], type: this.phoneArr[j]['Type'], TypeName: this.phoneArr[j]['TypeName'], IsDefault: this.phoneArr[j]['IsDefault'] })
      }
    }

    this.oldPatchValues = addressBarData;
    this.oldIsDefault = addressBarData.IsDefault;
    this.addAddressForm.patchValue({
      CountryId: parseInt(addressBarData.CountryId),
      Country: addressBarData.Country,
      locationName:addressBarData.LocationName,
      LocationType: addressBarData.LocationType,
      LocationTypeId: addressBarData.LocationTypeId,
      AddressLinkToMap: addressBarData.AddressLinkToMap,
      addressLine1: addressBarData.AddressLine1,
      addressLine2: addressBarData.AddressLine2,
      districtSuburb: addressBarData.District,
      townCity: addressBarData.TownCity,
      // StateId: addressBarData.StateId,
      // StateName: addressBarData.StateName,
      zipPostalCode: addressBarData.ZipCode,
      longitude: addressBarData.Longitude,
      lattitude: addressBarData.Latitude,
      Country_Code: parseInt(addressBarData.CountryId),
      phonemul: this.phone,
      emailmul: this.emails,
      isDefault: (addressBarData?.IsDefault == 1) ? true : false
    })
    if (this.activityStatus == 'view') {
      this.addAddressForm.disable();
      this.dropDownStateConfig['IsDisabled'] = true;
      this.matchipDisabled = true;
      this.IsDisabled = true;
      // who:maneesh,what:ewm-10726 email Phone Disabled for view mode disabel email and phone button discuss with mukesh sir and rajesh sr  ,when:16/03/2023 
      this.emailPhoneDisabled=true;

    } else {
      this.matchipDisabled = false;
      this.dropDownStateConfig['IsDisabled'] = false;
      this.emailPhoneDisabled=false;

    }
  }
  /* 
   @Type: File, <ts>
   @Name: onChangeLocation function
   @Who: maneesh
   @When: 06-june-2022
   @Why: EWM-6812 EWM-6989
   @What: on change the location
 */

  onChangeLocation() {
    let isDeflt = this.addAddressForm.value.isDefault;
    let data = isDeflt == true ? 1 : 0;
    this.isDefault = data; 
    this.duplicayCheck()
  }
  /* 
    @Type: File, <ts>
    @Name: onChangeLocation function
    @Who: maneesh
    @When: 06-june-2022
    @Why: EWM-6812 EWM-6989
    @What: For checking duplicacy for code and description
  */
  duplicayCheck() {
    this.loading = true;
    let obj = {}
    obj['clientId'] = this.clientId;
    this.systemSettingService.checkIsDefaultLocation(obj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == '200' || data.HttpStatusCode == '204') {
          this.loading = false;
          this.IsDisabled = false;
        }
        else if (data.HttpStatusCode == 402) {
          this.addAddressForm.patchValue({
            isDefault: false
          });
          this.isDefault = 0;
          this.openWarningDialog('400038', 'label_alert');
          this.loading = false;   
        }
        else {
          this.isDefault = 1;
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  /* 
  @Type: File, <ts>
  @Name: openWarningDialog function
  @Who: maneesh
  @When: 06-june-2022
  @Why: EWM-6812 EWM-6989
  @What: on clicking toggle next ADD SECTION
*/
  openWarningDialog(label_SubtitleWeightage, label_TitleWeightage) {
  const message = label_SubtitleWeightage;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData, isButtonShow: true},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
}

/*
  @Type: File, <ts>
  @Name: onStateChange function
  @Who: Adarsh Singh
  @When: 29-Aug-2022
  @Why: EWM.8060.EWM.8372
  @What: To get Data from state while click on that
*/
onStateChange(data) {
  if (data == null || data == "" || data?.length == 0) {
    this.selectedStates = null;
    this.addAddressForm.patchValue({
      StateId: null,
      StateName: null
    })
  }
  else if (data.Id ==0) {
    this.selectedState = null;
    this.addAddressForm.patchValue({
      StateId: null,
      StateName: null
    })
  }
  else {
    this.selectedState = data;
    this.addAddressForm.patchValue({
      StateId: data.Id,
      StateName: data.StateName
    })
  }
  // this.addressChange();
  
}

/*
  @Type: File, <ts>
  @Name: resetData function
  @Who: Adarsh Singh
  @When: 03-Aug-2022
  @Why: EWM.8060.EWM.8372
  @What: for reset the state data while chnaging the country 
*/
resetData(e) {
  this.selectedStates = null;
}

// <!--@Bantee Kumar,@EWM-13525,@when:14-08-2023, Common location changes-->


getLatLongCoordinates() {
 let zipcode= this.addAddressForm.value.zipPostalCode;
 let address=this.addAddressForm.value.addressLine1
if(zipcode && address){
  this.addAddressForm.get('lattitude')?.disable();
  this.addAddressForm.get('longitude')?.disable();

  let jsonObj = {};
  jsonObj['addresslinktomap'] = this.addAddressForm.value.AddressLinkToMap;
  jsonObj['addressline1'] = address;
  jsonObj['addressline2'] = this.addAddressForm.value.addressLine2;
  jsonObj['districtsuburb'] = this.addAddressForm.value.districtSuburb;
  jsonObj['towncity'] = this.addAddressForm.value.townCity;
  jsonObj['state'] = this.addAddressForm.value.StateName;
  jsonObj['country'] = this.addAddressForm.value.Country;
  jsonObj['zippostalcode'] = zipcode;
  
  this.systemSettingService.getLatLongCoordinates(jsonObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        let latitude = repsonsedata.Data.latitude;
        let longitude = repsonsedata.Data.longitude;

        this.addAddressForm.patchValue({ lattitude: latitude });
        this.addAddressForm.patchValue({ longitude: longitude });
        


        if (repsonsedata.HttpStatusCode == '204') {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
      }
      this.addAddressForm.get('longitude')?.enable();
      this.addAddressForm.get('lattitude')?.enable();
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
  }else{
    this.addAddressForm.controls['zipPostalCode'].markAllAsTouched();
  this.addAddressForm.controls['addressLine1'].markAllAsTouched();
  }
}
stateDataFromComponent(e) {
  this.stateList = e;
  this.clickCountrygetAllState();
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
