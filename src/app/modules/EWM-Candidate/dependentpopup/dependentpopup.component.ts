
/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 21-May-2021
  @Why: EWM-1449 EWM-1583
  @What: this section handle all quick people component related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { QuickpeopleComponent } from '../../EWM.core/shared/quick-modal/quickpeople/quickpeople.component';
import { ProfileInfoService } from '../../EWM.core/shared/services/profile-info/profile-info.service';
import { QuickpeopleService } from '../../EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from '../../EWM.core/shared/services/system-setting/system-setting.service';
import { AddphonesComponent } from '../../EWM.core/shared/quick-modal/addphones/addphones.component';
import { QuicklocationComponent } from '../../EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { CandidateService } from '../../EWM.core/shared/services/candidates/candidate.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CustomValidatorService } from '../../../shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-dependentpopup',
  templateUrl: './dependentpopup.component.html',
  styleUrls: ['./dependentpopup.component.scss']
})
export class DependentpopupComponent implements OnInit {


  /**********************global variables decalared here **************/
  dateStart = new Date();
  today = new Date();
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  phone: any = [];
  socials: any = [];
  emails: any = [];
  relationshipList: any = [];
  relationshipName = "";
  genderList: any = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  public addressBarData: any;
  public methodType: any;
  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput: ElementRef<HTMLInputElement>;
  addForm: FormGroup;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public emailPattern:string //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z0-9]+$";
  public statusList: any = [];
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public emailArr: any;
  public phoneArr: any;
  public socialArr: any;
  public locationArr: any;
  public selectedValue: any;
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  public StateList: any = [];
  employee: any;
  public candidateId;
  public editId;
  public activityStatus;
  public oldPatchValues: any;
  public oldPatchPhoneValues: any;
  public oldAddressPatchValues: any;
  public matchipDisabled: boolean;
  public loading: boolean;
  isDisabledData:boolean;
  public PhonePopUpData = [];
  getDateFormat:any;
  dirctionalLang;

  constructor(public dialogRef: MatDialogRef<QuickpeopleComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private countryMasterService: CountryMasterService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private profileInfoService: ProfileInfoService, private quickpeopleService: QuickpeopleService, private candidateService: CandidateService,
    private appSettingsService: AppSettingsService) {
      this.emailPattern=this.appSettingsService.emailPattern;
    this.candidateId = data.candidateId;
    // @Who: Bantee Kumar,@Why:EWM-10893,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.
    this.emailPattern=this.appSettingsService.emailPattern;
    if(data.formType){
    this.activityStatus = data.formType;
    }
         /*@Who: Bantee kumar,@When: 26-sept-2023,@Why: EWM-14404 ,@What: When a user goes to Add Dependent then By Default Current Date is displaying in Birth date field*/

    this.addForm = this.fb.group({
      orgId: [''],
      Id: [''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      relationship: [null, [Validators.required]],
      birthDate: [null,[CustomValidatorService.dateValidator]],
      gender: [null],
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      address: this.fb.group({
        'AddressLinkToMap': ['', [Validators.maxLength(250)]],
      })
    });

    if (this.activityStatus == 'Edit' || this.activityStatus == 'View') {
      this.editId = data.editId;
      this.getDependentById(this.editId);
    } else {
      this.candidateId = data.candidateId;
      this.activityStatus = data.formType;
    }

  }

  ngOnInit() {
    // this.employee = this.textChangeLngService.getDataEmployee('singular');
    // this.getOrganizationList();
    // this.tenantUserTypeList();
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.getRelationshipType();
    this.getGenderList();
    this.getInternationalization();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }
    })
    let orgdata = [this.OrganizationId];
    this.addForm.patchValue({
      'orgId': orgdata,
      'Id': this.editId
    })
    //this.onChangeMapAddress();
  }



  /*
   @Type: File, <ts>
   @Name: createemail
  @Who:  Suika
  @When: 20-Aug-2021
  @Why: EWM-2127 EWM-2243
   @What: when user click on add to create form group with same formcontrol
   */
  createemail(): FormGroup {
    return this.fb.group({
      EmailId: ['', [Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [Validators.required, RxwebValidators.unique()]]
    });
  }


  /*
   @Type: File, <ts>
   @Name: createphone
   @Who:  Suika
   @When: 20-Aug-2021
   @Why: EWM-2127 EWM-2243
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
   @Who:  Suika
   @When: 20-Aug-2021
   @Why: EWM-2127 EWM-2243
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
  @Who:  Suika
  @When: 20-Aug-2021
  @Why: EWM-2127 EWM-2243
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails.length == 0) {
        this.addForm.controls['emailmul'].setErrors({ 'required': true });
      }

    } else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
        this.PhonePopUpData.splice(index, 1);
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
  @Who:  Suika
  @When: 20-Aug-2021
  @Why: EWM-2127 EWM-2243
  @What: to filter out duplicate value in mat chip list (not in use currently)
  */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  /*
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who:  Suika
    @When: 20-Aug-2021
    @Why: EWM-2127 EWM-2243
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(): void {
    if (this.activityStatus == 'Add') {
      this.onDependentSave();
    } else if (this.activityStatus == 'Edit') {
      this.onDependentUpdate()
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }




  onDependentSave() {
    if (this.addForm.invalid) {
      return;
    }
    let createPeopJson = {};
    let phoneJson = [];
    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "PhoneNumber": elem.phone, "IsDefault": elem.IsDefault, "PhoneCode": elem.PhoneCode.toString() });
    });
    let dependentId;
    if (this.editId != undefined) {
      dependentId = this.editId
    } else {
      dependentId = 0;
    }    
    //createPeopJson['orgId'] = this.addPeopleForm.value.orgId;
    createPeopJson['Id'] = dependentId;
    createPeopJson['candidateId'] = this.candidateId;
    createPeopJson['Name'] = this.addForm.value.name;
    createPeopJson['GenderId'] = this.addForm.value.gender !=null? this.addForm.value.gender : 0;
    createPeopJson['RelationshipId'] = this.addForm.value.relationship;
    createPeopJson['RelationshipName'] = this.relationshipName;
    createPeopJson['DateBirth'] = this.addForm.value.birthDate;
    if (this.phoneArr) {
      createPeopJson['DependentPhones'] = phoneJson;
    }
    createPeopJson['CandidateLocation'] = this.locationArr;
    this.candidateService.createCandidateDependent(createPeopJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addForm.reset();
          document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })



  }




  onDependentUpdate() {
    if (this.addForm.invalid) {
      return;
    }
    let phoneJson = [];
    let addObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = this.oldPatchValues;
    let dob =   this.appSettingsService.getUtcDateFormat(this.oldPatchValues.DateBirth); 
    fromObj['DateBirth'] = dob
    // who:bantee,why:ewm-11662 User is not able to save the record when user changes the Relationship in second time under Dependent section ,when:17/04/2023
    this.phone?.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "PhoneNumber": elem.phone, "IsDefault": elem.IsDefault, "PhoneCode": elem?.CountryId.toString(), CountryId: elem.CountryId });


    });

    toObj['Id'] = this.addForm.value.Id;
    toObj['candidateId'] = this.candidateId;
    toObj['Name'] = this.addForm.value.name;
    toObj['GenderId'] = this.addForm.value.gender ? this.addForm.value.gender : 0;
    toObj['RelationshipId'] = this.addForm.value.relationship;
    toObj['RelationshipName'] = this.relationshipName;
    let todob =   this.appSettingsService.getUtcDateFormat(this.addForm.value.birthDate); 
    toObj['DateBirth'] = todob;
    if (this.phone) {
      toObj['DependentPhones'] = phoneJson;
    }
    toObj['CandidateLocation'] = this.locationArr;
    addObj = [{
      "From": fromObj,
      "To": toObj
    }];

    this.candidateService.updateCandidateDependent(addObj[0]).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addForm.reset();
          document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })



  }


  /*
    @Type: File, <ts>
    @Name: onDismiss
    @Who:  Suika
    @When: 20-Aug-2021
    @Why: EWM-2127 EWM-2243
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);

    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

  }


  /* 
   @Type: File, <ts>
   @Name: addPhone
   @Who:  Suika
   @When: 20-Aug-2021
   @Why: EWM-2127 EWM-2243
   @What: for opening the phone dialog box
 */

  addPhone() {
    this.addForm.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {
      maxWidth: "700px",
      data: new Object({ phonemul: this.addForm.get('phonemul'), phoneChip: [], mode: this.activityStatus, values: { Phone: this.PhonePopUpData } }),
      panelClass: ['quick-modalbox', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {   
      // @suika @EWM-EWM-11452  @Whn 17-05-2023 for dependent phone issue made changes
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
            PhoneCode: this.phoneArr[j]['PhoneCode'],
            phoneCodeName: this.phoneArr[j]['phoneCodeName'],
            CountryId:this.phoneArr[j]['PhoneCode']
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
   @Who:  Suika
   @When: 20-Aug-2021
   @Why: EWM-2127 EWM-2243
   @What: get all organization Details
   */

  getOrganizationList() {
    this.countryMasterService.getOrganizationList().subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {

          this.organizationData = responseData.Data;

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }



  /*
     @Type: File, <ts>
     @Name: addAddress
     @Who:  Suika
     @When: 20-Aug-2021
     @Why: EWM-2127 EWM-2243
     @What: To get Data from address of people
     */
  addAddress() {
    const dialogRef = this.dialog.open(QuicklocationComponent, {
      maxWidth: "700px",
      data: new Object({ address: this.oldAddressPatchValues, mode: this.activityStatus, formTitle: 'label_location', IsDisabled: this.activityStatus }),
      panelClass: ['quick-modalbox', 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res != null) {
        this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap)
        this.locationArr = res.data;
        this.commonserviceService.ondefultCountry.next(this.locationArr.CountryId);
        this.oldAddressPatchValues = res.data;
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
 @Name: getGeneralInformation function
 @Who:  Suika
 @When: 17-Aug-2021
 @Why: EWM-2127 EWM-2243
 @What: For setting value in the edit form
*/
  getDependentById(id) {
    this.candidateService.getCandidatedependentListById('?id=' + id + '&candidateid=' + this.candidateId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          let relobj = {};
          relobj = { Id: data['Data'].RelationshipId, Name: data['Data'].RelationshipName };
          // <!---------@When: 05-12-2022 @who:Adarsh singh @why: EWM-9723 --------->
          let dob:any = data['Data'].DateBirth;
          if (dob==0) {
            this.addForm.patchValue({
              birthDate: null
            });
          }else{
            dob = this.appSettingsService.getUtcDateFormat(data['Data'].DateBirth)
            this.addForm.patchValue({
              birthDate: dob
            });
          }
          // end 
          this.addForm.patchValue({
            name: data['Data'].Name,
            gender: (data['Data'].GenderId==0)?null : data['Data'].GenderId,
            relationship: data['Data'].RelationshipId,
          });
          this.oldAddressPatchValues = data['Data'].Location;
          this.locationArr = data['Data'].Location;
          if (data['Data'].Location != null) {
            this.addForm.get('address').patchValue({
              AddressLinkToMap: data['Data'].Location.AddressLinkToMap,
            });
          }
          if (data['Data'].Phone.length > 0) {
            this.oldPatchPhoneValues = data['Data'].Phone;
            this.oldPatchPhoneValues.forEach(element => {
              this.phone.push({
                phone: element.PhoneNumber,
                type: element.Type,
                Name: element.TypeName,
                IsDefault: true,
                PhoneCode: element.PhoneCode,
                phoneCodeName: element.PhoneCode,
                CountryId:element.CountryId
              })
            });

          }

          this.oldPatchValues = data['Data'];  
          data['Data']?.Phone.forEach(element => {
            element['CountryId']=element?.CountryId;
            element['phoneCodeName']=element?.PhoneCode;
          });
          this.PhonePopUpData = data['Data']?.Phone; 
          if (this.activityStatus === 'View') {
            this.addForm.disable();
            this.matchipDisabled = true;
            this.isDisabledData = true;
          } else {
            this.matchipDisabled = false;
            this.isDisabledData = false;
          }

        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
        }
      },
      err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
 @Type: File, <ts>
 @Name: getRelationshipType function
  @Who:  Suika
  @When: 20-Aug-2021
  @Why: EWM-2127 EWM-2243
 @What: get relationship type List
 */
  getRelationshipType() {
    this.candidateService.getRelationshipList('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.relationshipList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }





  /*
 @Type: File, <ts>
 @Name: getGenderList function
  @Who:  Suika
  @When: 20-Aug-2021
  @Why: EWM-2127 EWM-2243
 @What: get getGenderList  List
 */
  getGenderList() {
    this.candidateService.getGenderList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.genderList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Type: File, <ts>
    @Name: onDependentNameChanges function
    @Who:  Suika
    @When: 20-Aug-2021
    @Why: EWM-2127 EWM-2243
    @What: This function is used for checking duplicacy for code
    */
  onDependentNameChanges() {
    let alreadyExistCheckObj = {};
    let dependentId;
    if (this.editId != undefined) {
      dependentId = this.editId;
    } else {
      dependentId = 0;
    }
    let relationshipValue = this.addForm.get("relationship").value;
    let rel = this.relationshipList.filter(x => x.Id === relationshipValue);
    this.relationshipName = rel[0].Name;
    alreadyExistCheckObj['Id'] = dependentId;
    alreadyExistCheckObj['CandidateId'] = this.candidateId;
    alreadyExistCheckObj['DependentName'] = this.addForm.get("name").value;
    alreadyExistCheckObj['RelationshipId'] = rel[0].Id;
    alreadyExistCheckObj['RelationshipName'] = this.relationshipName;
    if (this.addForm.get("relationship").value) {
      this.candidateService.checkDependentDuplicay(alreadyExistCheckObj).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 402) {
            if (repsonsedata['Data'] == false) {
              this.addForm.get("relationship").setErrors({ nameTaken: true });
              this.addForm.get("relationship").markAsDirty();

            } else if (repsonsedata['Data'] == true) {
              this.addForm.get("relationship").clearValidators();
              this.addForm.get("relationship").markAsPristine();
              this.addForm.get('relationship').setValidators([Validators.required]);

            }
          } else if (repsonsedata['HttpStatusCode'] == 204) {
            if (repsonsedata['Data'] == true) {
              this.addForm.get("relationship").clearValidators();
              this.addForm.get("relationship").markAsPristine();
              this.addForm.get('relationship').setValidators([Validators.required]);

            }
          } else if (repsonsedata['HttpStatusCode'] == 400) {
            this.addForm.get("relationship").clearValidators();
            this.addForm.get("relationship").markAsPristine();
            this.addForm.get('relationship').setValidators([Validators.required]);

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
    else {
      this.addForm.get('relationship').setValidators([Validators.required]);

    }
    this.addForm.get('relationship').updateValueAndValidity();
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
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear end  date 
     */
    clearEndDate(e){
      this.addForm.patchValue({
        birthDate: null
      });
    }

}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {

  constructor(public title: string, public subtitle: string, public message: string) {
  }


}
