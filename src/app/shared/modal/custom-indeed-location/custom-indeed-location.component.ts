/*
@(C): Entire Software
@Type: File, <ts>
@Name: custom-location.component.ts
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What:  This page wil be used for common location based on given endpoint
 */

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from '../../models';
import { ServiceListClass } from '../../services/sevicelist';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';

@Component({
  selector: 'app-custom-indeed-location',
  templateUrl: './custom-indeed-location.component.html',
  styleUrls: ['./custom-indeed-location.component.scss']
})
export class CustomIndeedLocationComponent implements OnInit {
  public IsDisabled: boolean = false;
  addressData: any = {};
  savebtnIsDisable: boolean;
  public dropDownStateConfig: customDropdownConfig[] = [];
  public selectedState: any = {};
  resetStateDropdown: Subject<any> = new Subject<any>();

  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: get (Input) location Data from parent and get set method for trigger 
*/
  private _googleAddressValueIn: any;
  stateCode: any;
  loading: boolean;
  CountryId: number = 0;
  CountryIdValue: number = 0;
  @Input() set googleAddressValueIn(value: any) {
    this._googleAddressValueIn = value;
    if (this._googleAddressValueIn != undefined && this._googleAddressValueIn != null && this._googleAddressValueIn != '') {
      this.addressData = this._googleAddressValueIn;
      this.patchValues(this._googleAddressValueIn)
      this.addressChange();
    } else {
      this.getInternationalization();
    }
  }
  get googleAddressValueIn(): any {
    return this._googleAddressValueIn;
  }

  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: get (Input) view Data for disable from parent and get set method for trigger 
*/
  private _configIn: any;
  @Input() set configIn(value: any) {
    this._configIn = value;
    if (this._configIn != undefined && this._configIn != null && this._configIn != '') {
      if (this._configIn == 'View' || this._configIn == 'view') {
        this.patchValues(this._googleAddressValueIn);
        this.addressForm.disable();
        this.IsDisabled = true;
        this.savebtnIsDisable = false;
        this.dropDownStateConfig['IsDisabled'] = true;
        this.addressFormValid(this.savebtnIsDisable);
      }
    }
  }
  get configIn(): any {
    return this._configIn;
  }

  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: send (Output) Data(Location Data and disable) from child to parent 
*/
  @Output() googleAddressValueOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() googleAddressValidOut: EventEmitter<any> = new EventEmitter<any>();



  addressForm: FormGroup;
  public stateList: any = [];
  selectedValue: any = {};
  countryList: any = [];

  @ViewChild('addressLine1Focus') addressLine1Focus: MatInput;

  constructor(private fb: FormBuilder, private snackBService: SnackBarService, private translateService: TranslateService,
    public systemSettingService: SystemSettingService, private serviceListClass: ServiceListClass) {


    this.addressForm = this.fb.group({

      CountryId: ['', [Validators.required]],
      CountryName: [''],
      AddressLinkToMap: ['', [Validators.maxLength(250)]],
      AddressLine1: ['', [Validators.maxLength(100)]],
      AddressLine2: ['', [Validators.maxLength(100)]],
      District_Suburb: ['', [Validators.maxLength(50)]],
      TownCity: ['', [Validators.required,Validators.maxLength(50)]],
      StateId: ['', [Validators.required]],
      StateName: [''],
      PostalCode: ['', [Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      Longitude: ['', [Validators.maxLength(50), Validators.pattern(/^-?(0|[1-9]\d*)(\.\d+)?$/)]],
      Latitude: ['', [Validators.maxLength(50), Validators.pattern(/^-?(0|[1-9]\d*)(\.\d+)?$/)]]
    });

    ////// State //////////////
    this.dropDownStateConfig['IsDisabled'] = false;
    // this.dropDownStateConfig['apiEndPoint'] = this.serviceListClass.StateAll+'?ByPassPaging=true';
    this.dropDownStateConfig['placeholder'] = 'label_state';
    this.dropDownStateConfig['IsManage'] = '/client/core/administrators/states';
    this.dropDownStateConfig['IsRequired'] = true;
    this.dropDownStateConfig['searchEnable'] = true;
    this.dropDownStateConfig['bindLabel'] = 'StateName';
    this.dropDownStateConfig['multiple'] = false;

  }

  ngOnInit(): void {
    // this.getInternationalization();
    //this.getState();
  }

  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: for focus on 2nd input
*/
  ngAfterViewInit() {
    let data = this.addressData.AddressLinkToMap;
    if (data != undefined && data != null && data != '') {
      setTimeout(() => {
        this.addressLine1Focus.focus();
      }, 300);
    }
  }


  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: patch value in form in Edit Case
*/
  patchValues(addressData) {
  this.loading = true; 
    setTimeout(() => {
      this.selectedValue = { Id: addressData.CountryId, CountryName: addressData.CountryName };
      this.CountryId = this.selectedValue.Id;
      this.ddlchange(this.selectedValue);
      // @suika @EWM-11893 State field displaying blank hanlde
      setTimeout(() => {
        this.selectedState = { Id: addressData?.StateId, StateName: addressData?.StateName }
        this.onStateChange(this.selectedState);
        //this.loading = false;/*@Who:Renu @Why:EWM-14918 EWM-14940 @What:Loader remove from timeout added below*/
      }, 2000);
    }, 2000);
    this.loading = false;/*@Who:Renu @Why:EWM-14918 EWM-14940 @What:Loader added*/
    this.addressForm.patchValue({
      // Name: addressData.Name,
      // TypeId: addressData.TypeId,
      AddressLinkToMap: addressData.AddressLinkToMap,
      AddressLine1: addressData.AddressLine1,
      AddressLine2: addressData.AddressLine2,
      District_Suburb: addressData.District_Suburb,
      TownCity: addressData.TownCity,
      PostalCode: addressData.PostalCode,
      // StateId: addressData.StateId,
      // StateName: addressData.StateName,
      // who:maneesh,what: ewm-13437 for change latitude and longitude value Fixed value  revers issued,when:26/07/2023
      Longitude: addressData.Longitude,
      Latitude: addressData.Latitude,
    });
  }

  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: get list of Internationalization
*/
  getInternationalization() {
    this.systemSettingService.getInternalization().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.selectedValue = { 'Id': repsonsedata['Data']['CountryId'], 'CountryName': repsonsedata['Data']['CountryName'] };
          this.CountryId = this.selectedValue.Id;
          this.ddlchange(this.selectedValue);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
@Who: Anup
@When: 8-sep-2021
@Why: EWM-2696 EWM-2722
@What: get list of state
*/

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



  /*
  @Who: Anup
  @When: 8-sep-2021
  @Why: EWM-2696 EWM-2722
  @What: patch value in form from google serch location
  */
  public fetchDataFromAddressBar(address) {
    this.addressForm.reset();
    
    let latitude = address.geometry.location.lat();
    let longitude = address.geometry.location.lng();
    let addressOne: any = "";
    let addressTwo: any = "";

    for (let index = 0; index < address.address_components.length; index++) {
      const element = address.address_components[index];

      switch (element.types[0]) {
        case "locality":
          this.addressForm.patchValue({ TownCity: element.long_name });
          this.addressForm.patchValue({ District_Suburb: element.long_name });
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
          break;

        case "administrative_area_level_1":
          /*--@Who:Nitin Bhati,@When: 14-March-2023,@Why:EWM-10651,@What:For state code-----*/
          this.stateCode = element.short_name;
          this.clickCountrygetAllState();
          break;

        case "country":
          this.selectedValue = { 'ISOCode1': element.short_name };
          break;

        case "postal_code":
          this.addressForm.patchValue({ PostalCode: element.long_name });
          break;

        default:
          break;
      }

      this.addressForm.patchValue({ AddressLine1: addressOne });
      this.addressForm.patchValue({ AddressLine2: addressTwo });
      this.addressForm.patchValue({ AddressLinkToMap: address.formatted_address });
      this.addressForm.patchValue({ Latitude: latitude });
      this.addressForm.patchValue({ Longitude: longitude });

      // this.addressForm.patchValue({ locationName: 'Main' });
      //@suika @EWM-12270 @Data loading issue @whn 03-05-2023
      setTimeout(() => {
        this.addressChange();
      }, 2000);

    }

  }



  /*
  @Who: Anup
  @When: 8-sep-2021
  @Why: EWM-2696 EWM-2722
  @What: get selected data
  @Who: priti
  @When: 12-nov-2021
  @Why: EWM-3171
*/
  ddlchange(data) {
    //this.loading=true;
    if (data == null || data == "" || data == 0) {
      this.selectedState = null;
      this.selectedValue = {};
      if (this._configIn == 'View' || this._configIn == 'view') {
        this.addressForm.get("CountryId").setErrors({ required: false });
      } else {
        this.addressForm.get("CountryId").setErrors({ required: true });
        this.addressForm.get("CountryId").markAsTouched();
        this.addressForm.get("CountryId").markAsDirty();
      }
      this.addressForm.patchValue(
        {
          CountryId: '',
          CountryName: '',
        }
      );
    }
    else {
      this.addressForm.get("CountryId").clearValidators();
      this.addressForm.get("CountryId").markAsPristine();
      this.addressForm.get("CountryId").setValidators(Validators.required);
      // <!-- who:bantee,what:ewm.13579  The state field is blank when the user edits the previous address with the new address.,when:04/08/2023 -->

      //this.loading=false;
      this.selectedValue = data;
      this.CountryId = data.Id;
      this.addressForm.patchValue(
        {
          CountryId: data.Id,
          CountryName: data.CountryName,
        }
      )
      /*--@Who:Nitin Bhati,@When: 31-July-2023,@Why:EWM-13251,@What:Implement if condition for handle multile api calling-----*/
      if (this.CountryIdValue != this.CountryId) {
        this.dropDownStateConfig['apiEndPoint'] = this.serviceListClass.StateAll + '?CountryId=' + this.selectedValue.Id + '&ByPassPaging=true' + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.resetStateDropdown.next(this.dropDownStateConfig);
        this.CountryIdValue = data?.Id;
        /*--@Who:Nitin Bhati,@When: 14-March-2023,@Why:EWM-10651,@What:For country state mapping id-----*/
        this.clickCountrygetAllState();
      }
      this.addressChange();
    }

  }

  /*
   @Who: Anup
   @When: 8-sep-2021
   @Why: EWM-2696 EWM-2722
   @What:click country get state
 */

  //  commented by Adarsh on 01-09-22 why- change normal dropdown into custome dropdown ==>EWM.8060.EWM.8372
  clickCountrygetAllState() {
    this.selectedState = null;
    /*--@Who:Nitin Bhati,@When: 14-March-2023,@Why:EWM-10651,@What:For patch state ID-----*/
    if (this.stateCode != null) {
      let stateId: any;
      let StateName: string;
      if (this.stateList?.length != 0 && this.stateList != null && this.stateList != undefined && this.stateList != '') {
        let StateArr;
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
          this.selectedState = { 'Id': Number(stateId), StateName: StateName };
          this.addressForm.patchValue({ StateId: stateId });
          this.addressForm.patchValue({ StateName: StateName });
        }
      }
    }
  }


  /*
     @Who: Anup
     @When: 8-sep-2021
     @Why: EWM-2696 EWM-2722
     @What:click State get stateName
   */
  clickstateGetStateName(stateId) {
    let StateName: string;
    if (stateId != undefined && stateId != null && stateId != '') {
      let StateArr;
      StateArr = this.stateList.filter(x => x['Id'] == stateId);
      if (StateArr.length != 0) {
        StateName = StateArr[0].StateName
      } else {
        StateName = '';
      }
    }
    this.addressForm.patchValue({ StateId: stateId });
    this.addressForm.patchValue({ StateName: StateName });

    this.addressChange();
  }


  /*
   @Type: File, <ts>
   @Name: valueChangeKendo function
   @Who: Anup
   @When: 8-sep-2021
   @Why: EWM-2696 EWM-2722
   @What: get drop down list on baisis of api endpoint recived
   */

  addressChange() {
    this.addressData = this.addressForm.value;
    this.googleAddressValueOut.emit(this.addressData);
    this.savebtnIsDisable = this.addressForm.valid;
    this.addressFormValid(this.savebtnIsDisable);
  }

  addressFormValid(savebtn) {
    // who:maneesh,what:ewm-11893 for state value this.patchValues,when:15/06/2023  
    setTimeout(() => {
      this.googleAddressValidOut.emit(savebtn);
    }, 500)
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
      this.selectedState = null;
      this.addressForm.patchValue({
        StateId: null,
        StateName: null
      })
    }
    else if (data.Id == 0) {
      this.selectedState = null;
      this.addressForm.patchValue({
        StateId: null,
        StateName: null
      })
    }
    else {
      this.selectedState = data;
      this.addressForm.patchValue({
        StateId: data.Id,
        StateName: data.StateName,
      })
    }
    this.addressChange();

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
    this.selectedState = null;
  }
  /*
    @Type: File, <ts>
    @Name: stateDataFromComponent function
    @Who: Nitin Bhati
    @When: 02-Aug-2023
    @Why: EWM.13251
    @What: for state List using output decorator
  */
  stateDataFromComponent(e) {
    this.stateList = e;
    this.clickCountrygetAllState();
  }

  // <!--@Bantee Kumar,@EWM-13525,@when:14-08-2023, Common location changes-->

  getLatLongCoordinates() {

 let zipcode= this.addressForm.value.PostalCode;
 let address=this.addressForm.value.AddressLine1
  if(zipcode && address){
  this.addressForm.get('Latitude')?.disable();
  this.addressForm.get('Longitude')?.disable();

    let jsonObj = {};
    jsonObj['addresslinktomap'] = this.addressForm.value.AddressLinkToMap;
    jsonObj['addressline1'] = address;
    jsonObj['addressline2'] = this.addressForm.value.AddressLine2;
    jsonObj['districtsuburb'] = this.addressForm.value.District_Suburb;
    jsonObj['towncity'] = this.addressForm.value.TownCity;
    jsonObj['state'] = this.addressForm.value.StateName;
    jsonObj['country'] = this.addressForm.value.CountryName;
    jsonObj['zippostalcode'] = zipcode;



    this.systemSettingService.getLatLongCoordinates(jsonObj).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          let latitude = repsonsedata.Data.latitude;
          let longitude = repsonsedata.Data.longitude;
          this.addressForm.get('Longitude')?.enable();
          this.addressForm.get('Latitude')?.enable();
          this.addressForm.patchValue({ Latitude: latitude });
          this.addressForm.patchValue({ Longitude: longitude });
          this.addressChange();
          if (repsonsedata.HttpStatusCode == '204') {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
        this.addressForm.get('Longitude')?.enable();
        this.addressForm.get('Latitude')?.enable();
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
    }
    else{
      this.addressForm.controls['PostalCode'].markAllAsTouched();
    this.addressForm.controls['AddressLine1'].markAllAsTouched();
    }
  }

}
