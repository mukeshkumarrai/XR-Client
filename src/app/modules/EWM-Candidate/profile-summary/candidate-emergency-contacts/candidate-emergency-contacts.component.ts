/*
  @(C): Entire Software
  @Type: candidate-emergency-contacts.component.ts
  @Who: Renu
  @When: 18-Aug-2021
  @Why: EWM-2196 EWM-2428
  @What:  This page will be use for candidate emergency contacts Component ts file
*/

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Subject } from 'rxjs';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels/common.model';
import { QuicklocationComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { AddphonesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addphones/addphones.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { QuickpeopleService } from '../../../EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from '../../../EWM.core/shared/services/system-setting/system-setting.service';


@Component({
  selector: 'app-candidate-emergency-contacts',
  templateUrl: './candidate-emergency-contacts.component.html',
  styleUrls: ['./candidate-emergency-contacts.component.scss']
})
export class CandidateEmergencyContactsComponent implements OnInit {


  /*******************common variables decalaration here ************************/
  public relationList: any = [];
  public selectedValue: any = {};
  public StateList: any = [];
  contactForm: FormGroup;
  public addressBarData: any;
  public countryISO: string;
  eventsSubject: Subject<any> = new Subject<any>();
  public employee: any;
  public candidateId: any;
  public methodType: any;
  public oldPatchValues: any;
  public IsDisabled: boolean = false;
  public selectedRelation: any = {};

  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z ]+$";
  public locationArr: any;
  public phone: any = [];
  public phoneArr: any;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  public countryId: number;
  public matchipDisabled: boolean = false;
  public dropDoneConfig: customDropdownConfig[] = [];
  removable = true;
  loading: boolean;
  tempID: any;
  public PhonePopUpData = [];
  phoneValid:boolean=false;
  dirctionalLang;
  constructor(public dialogRef: MatDialogRef<CandidateEmergencyContactsComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private snackBService: SnackBarService,
    private translateService: TranslateService, private quickpeopleService: QuickpeopleService, private routes: ActivatedRoute,
    private commonserviceService: CommonserviceService, public systemSettingService: SystemSettingService,
    public candidateService: CandidateService, private profileInfoService: ProfileInfoService, private serviceListClass: ServiceListClass,
    private appSettingsService: AppSettingsService) {

    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getRealtionShipList + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDoneConfig['placeholder'] = 'label_canEmergencyRelationShip';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = '';
    this.dropDoneConfig['IsRequired'] = true;
    this.dropDoneConfig['bindLabel'] = 'Name';
    this.dropDoneConfig['multiple'] = false;

    this.contactForm =
      this.fb.group({
        Id: [],
        FirstName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50)]],
        LastName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50)]],
        Relationship: [[], [Validators.required]],
        PrimaryContact: [false],
        AddressLinkToMap: ['', [Validators.maxLength(250)]],
        phonemul: this.fb.group({
          phoneInfo: this.fb.array([this.createphone()])
        }),
        address: this.fb.group({
          // 'Name':['',[Validators.required,Validators.maxLength(100)]],
          // 'TypeId':[],
          'AddressLinkToMap': ['', [Validators.required, Validators.maxLength(250)]],
          // 'AddressLine1':['',[Validators.maxLength(100)]],
          // 'AddressLine2':['',[Validators.maxLength(100)]],
          // 'District_Suburb':[,[Validators.maxLength(50)]],
          // 'TownCity':['',[Validators.maxLength(50)]],
          // 'StateId':[[]],
          // 'PostalCode':['',[Validators.required,Validators.maxLength(10),Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
          // 'CountryId':['',[Validators.required]],
          // 'Longitude':['',[Validators.maxLength(50)]],
          // 'Latitude':['',[Validators.maxLength(50)]]
        })
      });
      //@Who: Bantee Kumar,@Why:EWM-10893,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.

      if(data.methodType){
    this.methodType = data.methodType;
      }
    this.oldPatchValues = data.AutoFilldata;
    data.AutoFilldata?.Phone?.forEach(element => {
      element['phoneCodeName'] = element.PhoneCode;
    });
    this.PhonePopUpData = data.AutoFilldata?.Phone;
    if (this.methodType == 'View') {
      this.patchForm(data.AutoFilldata);
      this.contactForm.disable();
      this.matchipDisabled = true;
      this.IsDisabled = true;
      this.dropDoneConfig['IsDisabled'] = true;
    } else if (this.methodType == 'Edit') {
      this.matchipDisabled = false;
      this.patchForm(data.AutoFilldata);
      this.tempID = data.AutoFilldata.Id ? data.AutoFilldata.Id : 0;
    }
    this.candidateId = data.candidateId; //@who:priti @why:EWM-2973 @what:code added because 'candidate id' is coming as input @when:29-sep-2021
  }

  ngOnInit(): void {
    //@who:priti @why:EWM-2973 @what:code commented because 'candidate id' is coming as input @when:29-sep-2021 
    // this.routes.queryParams.subscribe((value) => {
    //   this.candidateId = value.CandidateId;
    // });
    this.getCountryInfo();
    this.getRealtionType();
    this.getInternationalization();
    // this.getStatesList();  
  }
  /*
  @Type: File, <ts>
  @Name: phoneInfo
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: for getting the formarray with this instance
  */

  phoneInfo(): FormArray {
    return this.contactForm.controls['phonemul'].get('phoneInfo') as FormArray
  }
  /*
    @Type: File, <ts>
    @Name: createemail
    @Who: Renu
    @When: 18-Aug-2021
    @Why: ROST-2428
    @What: when user click on add to create form group with same formcontrol
    */
  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.required, Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [Validators.required, RxwebValidators.unique()]],
      phoneCode: [],
      phoneCodeName: [],
      IsDefault: []
    });
  }

  /*
    @Type: File, <ts>
    @Name: getRealtionType
    @Who: Renu
    @When: 23-Apr-2021
    @Why: ROST-1748
    @What: To get Data from location master
    */
  getRealtionType() {
    this.candidateService.getRelationShipList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.relationList = repsonsedata.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
  @Name: onDismiss
  @Who: Renu
  @When: 18-Aug-2021
  @Why: EWM-2428
  @What: Function will call when user click on cancel button.
*/

  onDismiss(): void {
    this.contactForm.get('AddressLinkToMap').setValidators([Validators.required]);
    this.contactForm.get('AddressLinkToMap').updateValueAndValidity();
    document.getElementsByClassName("add_candidateContacts")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_candidateContacts")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
 @Type: File, <ts>
 @Name: remove
 @Who: Renu
 @When: 26-May-2021
 @Why: ROST-1586
 @What: to remove single chip via input
 */
  remove(items: any, type: string): void {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
        this.PhonePopUpData.splice(index, 1);
        // who:maneesh,what:for ewm.9767 add phone lenth and set error,when:19/12/2022
        if (this.phone.length == 0) {
          this.contactForm.controls['phonemul'].setErrors({ 'required': true });
        }
      }
  }
  /*
     @Name: onSubmit
     @Who: Renu
     @When: 18-Aug-2021
     @Why: EWM-2428
     @What: Function will to save data according to methodtype 
   */
  onSubmit(value) {
    if (this.methodType == 'Add') {
      this.createCandidateContact(value);
    } else if (this.methodType == 'Edit') {
      this.updateCandidateContact(value)
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /*
      @Name: updateCandidateContact
      @Who: Renu
      @When: 18-Aug-2021
      @Why: EWM-2428
      @What: Function will update record
    */
  updateCandidateContact(value) {
    let candidateId;
    if (this.candidateId != undefined) {
      candidateId = this.candidateId;
    } else {
      candidateId = '0';
    }
    let addObj = [];
    let fromObj = {};
    let toObj = {};
    let phoneJson = [];

    this.oldPatchValues.Phone?.forEach(element => {
      element['PhoneCode'] = element.CountryId.toString();
    });
    fromObj = this.oldPatchValues;
    this.phone?.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type,"CountryId":elem.CountryId,"PhoneNumber": elem.phone, "IsDefault": elem.IsDefault ,"PhoneCode" : elem?.CountryId.toString()});
    });
    toObj['CandidateId'] = candidateId;
    toObj['RelationId'] = this.selectedRelation.Id;
    toObj['Relationship'] = this.selectedRelation.Name;
    /*if (this.phoneArr) {
      toObj['Phone'] = phoneJson;
    }*/
    toObj['Phone'] = phoneJson;
    toObj['Location'] = this.locationArr;
    toObj['FirstName'] = value.FirstName;
    toObj['LastName'] = value.LastName;
    toObj['Id'] = value.Id;
    toObj['PrimaryContact'] = value.PrimaryContact == true ? 1 : 0;
    toObj['Location']['StateId'] = value.address.StateId ? parseInt(value.address.StateId) : 0;
    toObj['Location']['TypeId'] = value.address.TypeId ? parseInt(value.address.TypeId) : 0;


    addObj = [{
      "From": fromObj,
      "To": toObj
    }];

    this.candidateService.updateEmergencyContact(addObj[0]).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

          document.getElementsByClassName("add_candidateContacts")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_candidateContacts")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Name: createCandidateContact
    @Who: Renu
    @When: 18-Aug-2021
    @Why: EWM-2428
    @What: Function will save record
  */
  createCandidateContact(value) {
    let contactArr = {};
    let phoneJson = [];
    this.phone?.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "CountryId": elem.CountryId, "PhoneNumber": elem.phone, "IsDefault": elem.IsDefault, "PhoneCode": elem.phoneCode.toString() });
    });
    contactArr['CandidateId'] = this.candidateId;
    contactArr['FirstName'] = value.FirstName;
    contactArr['LastName'] = value.LastName;
    contactArr['RelationId'] = this.selectedRelation.Id;
    contactArr['Relationship'] = this.selectedRelation.Name;
    contactArr['PrimaryContact'] = value.PrimaryContact == true ? 1 : 0;
    if (this.phoneArr) {
      contactArr['Phone'] = phoneJson;
    }
    contactArr['Location'] = this.locationArr;

    this.candidateService.createEmergencyContacts(contactArr).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

          document.getElementsByClassName("add_candidateContacts")[0].classList.remove("animate__zoomIn");
          document.getElementsByClassName("add_candidateContacts")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })

  }





  updateAddresFormControl() {
    let updateArr = {};
    updateArr['AddressLine1'] = this.contactForm.value['address'].AddressLine1;
    updateArr['AddressLine2'] = this.contactForm.value['address'].AddressLine2;
    updateArr['AddressLinkToMap'] = this.contactForm.value['address'].AddressLinkToMap;
    updateArr['CountryId'] = this.contactForm.value['address'].CountryId;
    updateArr['District_Suburb'] = this.contactForm.value['address'].District_Suburb ? this.contactForm.value['address'].District_Suburb : '';
    updateArr['Latitude'] = this.contactForm.value['address'].Latitude.toString();
    updateArr['Longitude'] = this.contactForm.value['address'].Longitude.toString();
    updateArr['StateId'] = this.contactForm.value['address'].StateId ? parseInt(this.contactForm.value['address'].StateId) : 0;
    updateArr['Name'] = this.contactForm.value['address'].Name;
    updateArr['PostalCode'] = this.contactForm.value['address'].PostalCode;
    updateArr['TownCity'] = this.contactForm.value['address'].TownCity;
    updateArr['TypeId'] = this.contactForm.value['address'].TypeId ? parseInt(this.contactForm.value['address'].TypeId) : 0;
    this.locationArr = updateArr;
  }
  /*
  @Type: File, <ts>
  @Name: patchForm function
  @Who: renu
  @When: 18-Aug-2021
  @Why: EWM-2199 EWM-2428
  @What: For emergnecy contact get from input field
   */

  patchForm(Data: any) {
    if (Data.Phone) {
      for (let j = 0; j < Data.Phone.length; j++) {
        this.phone.push({
          phone: Data.Phone[j]['PhoneNumber'],
          type: Data.Phone[j]['Type'],
          Name: Data.Phone[j]['TypeName'],
          IsDefault: Data.Phone[j]['IsDefault'],
          phoneCode: Data.Phone[j]['CountryId'],
          phoneCodeName: Data.Phone[j]['phoneCodeName'],
          CountryId: Data.Phone[j]['CountryId'],
        })
      }
      // this.PhonePopUpData = this.phone;
    }
    
    this.selectedRelation={Id:Data.RelationId,Name:Data.Relationship};    
    this.contactForm.patchValue({
      Id: Data.Id,
      FirstName: Data.FirstName,
      LastName: Data.LastName,
      Relationship: this.selectedRelation,
      PrimaryContact: Data.PrimaryContact == 1 ? true : false,
      AddressLinkToMap: Data.Location ? Data.Location.AddressLinkToMap : ''
    })

    this.addressBarData = Data.Location;
    this.locationArr = Data.Location
    this.contactForm['controls'].address['controls'].AddressLinkToMap.setValue(Data.Location ? Data.Location.AddressLinkToMap : '')

    // this.contactForm.get('address').patchValue({
    //   Name:Data.Location.Name,
    //   TypeId:Data.Location.TypeId,
    //   AddressLinkToMap:Data.Location.AddressLinkToMap,
    //   AddressLine1:Data.Location.AddressLine1,
    //   AddressLine2:Data.Location.AddressLine2,
    //   District_Suburb:Data.Location.District_Suburb,
    //   TownCity:Data.Location.TownCity,
    //   StateId:Data.Location.StateId,
    //   PostalCode:Data.Location.PostalCode,
    //   Longitude:Data.Location.Longitude,
    //   Latitude:Data.Location.Latitude,
    //   CountryId:Data.Location.CountryId
    // });

    const control = <FormGroup>this.contactForm.get('phonemul');
    const childcontrol = <FormArray>control.controls.phoneInfo;
    childcontrol.clear();
  
   Data.Phone?.forEach((x) => {
    childcontrol.push(
       this.fb.group({
        PhoneNumber: [x.PhoneNumber, [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
        Type: [x.Type, [RxwebValidators.unique()]],
        phoneCode: [x.PhoneCode],
        phoneCodeName:[x.PhoneCode],
        IsDefault: [x.IsDefault]
       })
     )
   })
//  who:maneesh,what :ewm.EWM.9767 prNomber:9767,when:09/01/2023
   if (childcontrol.length==1) {
    this.phoneValid = true;
    
   }
  }


  /*
     @Who: Renu
     @When: 28-june-2021
     @Why: EWM-1895
     @What: to compare objects selected
   */
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
  }


  /*
    @Type: File, <ts>
    @Name: getStatesList
    @Who: Renu
    @When: 23-Apr-2021
    @Why: ROST-1748
    @What: To get Data from State master
    */
  getStatesList() {
    this.quickpeopleService.getStateList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.StateList = repsonsedata.Data;
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Type: File, <ts>
    @Name: addAddress
    @Who: Renu
    @When: 18-June-2021
    @Why: ROST-2428
    @What: To open dilaog for location add
    */
    addAddress(){
      const dialogRef = this.dialog.open(QuicklocationComponent, {
        maxWidth: "700px",
        width:"90%",
        data: new Object({ address: this.addressBarData ,formTitle:'label_location',mode:this.methodType}),
        panelClass: ['quick-modalbox', 'add_location', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if(res.data!='' ||res.data!=null)
        {
          this.contactForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data.AddressLinkToMap)
          this.locationArr=res.data;
          this.addressBarData = res.data;
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
   @Who: Renu
   @When: 18-Aug-2021
   @Why: EWM-2428
   @What: for opening the phone dialog box
 */
   addPhone() {
    this.contactForm.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {
      maxWidth: "700px",
      width: "90%",
      data: new Object({ phonemul: this.contactForm.get('phonemul'), phoneChip: [], mode: this.methodType, values: { Phone: this.PhonePopUpData } }),
      panelClass: ['quick-modalbox', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.phoneArr = res.data;      
      if (this.phoneArr) {
        this.phone = [];
        this.PhonePopUpData = this.phoneArr;
        for (let j = 0; j < this.phoneArr.length; j++) {
          this.phone.push({
            phone: this.phoneArr[j]['PhoneNumber'],
            type: this.phoneArr[j]['Type'],
            Name: this.phoneArr[j]['Name'],
            IsDefault: this.phoneArr[j]['IsDefault'],
            phoneCode: this.phoneArr[j]['PhoneCode'],
            phoneCodeName: this.phoneArr[j]['phoneCodeName'],
            CountryId: this.phoneArr[j]['PhoneCode']
          })
          this.patchPhone(this.phoneArr[j]['PhoneNumber'],this.phoneArr[j]['Type'],this.phoneArr[j]['PhoneCode'],this.phoneArr[j]['phoneCodeName'],this.phoneArr[j]['IsDefault'])
          this.phoneValid = true;
        }
    //  who:maneesh,what :ewm.EWM.9767 add else part,when:09/01/2023
    }else{
      this.patchPhone(null,null,null,null,null)
      if(this.phone?.length==0){
        this.phoneValid = false;
      }
    }
//  who:maneesh,what :ewm.EWM.9767 commenting this for ewm.9767,when:09/01/2023
        //   const control = <FormGroup>this.contactForm.get('phonemul');
        //   const childcontrol = <FormArray>control.controls.phoneInfo;
        //   childcontrol.clear();
        //   this.phoneArr?.forEach((x) => {
        //   childcontrol.push(
        //     this.fb.group({
        //       PhoneNumber: [x.PhoneNumber, [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
        //       Type: [x.Type, [RxwebValidators.unique()]],
        //       phoneCode: [x.PhoneCode],
        //       phoneCodeName:[x.PhoneCode],
        //       IsDefault: [x.IsDefault]
        //     })
        //   )

        // })        
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
   @Name: getCountryInfo
   @Who: Renu
   @When: 18-Aug-2021
   @Why: EWM-2428
   @What: getting the country info list
 */

  getCountryInfo() {
    this.profileInfoService.fetchCountryInfo(this.pageNumber, this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.countryList = repsonsedata['Data'];
        }
      }, err => {
        //console.log(err);
      })
  }

  /* 
   @Type: File, <ts>
   @Name: getInternationalization
   @Who: Renu
   @When: 18-Aug-2021
   @Why: EWM-2428
   @What: getting the default country from internationalization
 */

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
  @Name: onRelationchange
  @Who: Renu
  @When: 18-Aug-2021
  @Why: EWM-2428
  @What: when realtion drop down changes 
*/

  onRelationchange(data) {

    if (data == null || data == "") {

      this.contactForm.get("Relationship").setErrors({ required: true });

      this.contactForm.get("Relationship").markAsTouched();

      this.contactForm.get("Relationship").markAsDirty();

    }

    else {

      this.contactForm.get("Relationship").clearValidators();

      this.contactForm.get("Relationship").markAsPristine();

      this.selectedRelation = data;

      this.contactForm.patchValue(

        {

          Relationship: data.Id

        }

      )



      this.onRelationChangeCheckDuplicate();



    }

  }
  /*
  @Type: File, <ts>
  @Name: onRelationChanges function
  @Who:  Suika
  @When: 03-Nov-2022
  @Why: EWM-9352
  @What: This function is used for checking duplicacy for code
  */
  onRelationChangeCheckDuplicate() {
    let alreadyExistCheckObj = {};
    if (this.tempID == undefined) {
      this.tempID = 0;
    }
    alreadyExistCheckObj['candidateid'] = this.candidateId;
    alreadyExistCheckObj['relationshipid'] = this.selectedRelation.Id;
    alreadyExistCheckObj['relationship'] = this.selectedRelation.Name;
    alreadyExistCheckObj['Id'] = this.tempID;
    this.candidateService.checkRelationIsExist('?candidateid=' + this.candidateId + '&relationshipid=' + this.selectedRelation.Id + '&relationship=' + this.selectedRelation.Name + '&Id=' + this.tempID).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == 402) {
          this.contactForm.get("Relationship").setErrors({ RelationTaken: true });
          this.contactForm.get("Relationship").markAsDirty();
        } else if (repsonsedata['HttpStatusCode'] == 204) {
          this.contactForm.get("Relationship").clearValidators();
          this.contactForm.get("Relationship").markAsPristine();
          this.contactForm.get('Relationship').setValidators([Validators.required]);
        } else if (repsonsedata['HttpStatusCode'] == 400) {
          this.contactForm.get("Relationship").clearValidators();
          this.contactForm.get("Relationship").markAsPristine();
          this.contactForm.get('Relationship').setValidators([Validators.required]);
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

}
/*
  @Type: File, <ts>
  @Name: patchPhone function
  @Who:  maneesh
  @When: 09-jan-2023
  @Why: EWM-9767 and prNomber:9767
  @What: This function is used for patchPhone value
  */
patchPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault) {
  const control = <FormGroup>this.contactForm.get('phonemul');
  const childcontrol = <FormArray>control.controls.phoneInfo;
  childcontrol.clear();
  childcontrol.push(this.patchValuesPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault))    
  this.contactForm.patchValue({
    phonemul: childcontrol 
  })
}

/*
  @Type: File, <ts>
  @Name: patchValuesPhone function
  @Who:  maneesh
  @When: 09-jan-2023 and prNomber:9767
  @Why: EWM-9767
  @What: This function is used for patchPhone value
  */
patchValuesPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault) {
  return this.fb.group({
    PhoneNumber: [PhoneNumber],
    Type: [Type],
    phoneCode: [phoneCode],
    phoneCodeName: [phoneCodeName],
    IsDefault: [IsDefault],
  })
}
  

}
