/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup Singh
  @When: 25-Nov-2021
  @Why: EWM-3700 EWM-3918
  @What: this section handle all quick AddContact component related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
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
import { AddAddressComponent } from '../add-address/add-address.component';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressBarComponent } from 'src/app/shared/address-bar/address-bar.component';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { ProfileInfoService } from '../../services/profile-info/profile-info.service';
import { MatInput } from '@angular/material/input';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { CandidateService } from '../../services/candidates/candidate.service';
import { ContactRelatedTypeComponent } from './contact-related-type/contact-related-type.component';
import { QuicklocationComponent } from '../addlocation/quicklocation.component';
import { customDropdownConfig } from '../../datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ContactData, PersonalData } from 'src/app/shared/models/contact';
import { ClientService } from '../../services/client/client.service';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';

@Component({
  selector: 'app-quick-add-contact',
  templateUrl: './quick-add-contact.component.html',
  styleUrls: ['./quick-add-contact.component.scss']
})
export class QuickAddContactComponent implements OnInit {
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
  addContactForm: FormGroup;

  public selected: any = [];
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  // public specialcharPattern = "^[A-Za-z0-9 ]+$";
  public specialcharPattern = "^[a-z A-Z]+$";
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  public emailArr: any;
  public phoneArr: any;
  public socialArr: any;
  addressBarData: Address;
  public locationTypeList: any = [];
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  events: Event[] = [];

  clientListById: any;
  client: any;
  public addressData: any;
  public locationArr: any;

  public ContactRelatedTo: any = [];
  public loading: boolean = false;
  genderList: any = [];
  clientId: any;
  dirctionalLang;
  public dropDownOrgConfig: customDropdownConfig[] = [];

  emailValid: boolean = true;
  phoneValid: boolean = false;
  clientIdData: any = [];
  ClientNamedata: string[];
  //@ViewChild('title') title: MatInput;
  contactRelatedData: boolean;
  public selectedOrg: any = {};
  public OrganizationId: string;
  disableSave: boolean;
  showAddContact: boolean = false;
  public dropDownJobStatusConfig: customDropdownConfig[] = [];
  public selectedContactStatus: any = {};
  contactGrpID: string = "0985d0e6-45a6-4574-aed0-b75e5049faa2";
  ContactStatusActiveKey: string;
  contactInfoData: ContactData;
  editContact: boolean;
  public common_DropdownC_Config:DRP_CONFIG;
  public selectedOrgName: any = {};
  public selectedGender: any = {};
  public OrganizationName:string;
  public common_DropdownStatus_Config:DRP_CONFIG;
  public common_DropdownGender_Config:DRP_CONFIG;
  position: any;
  public  selectedContactOwner :any={};
  public common_DropdownContactOwners_Config:DRP_CONFIG;
  ownersId: any;
  ownersdta=[];
  fromownersdta=[];
  public currentMenuWidth: number;
  public maxMoreLengthForOwnerContacts:number=5;
  noRequiredValidation:boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QuickAddContactComponent>, private countryMasterService: CountryMasterService,
    private textChangeLngService: TextChangeLngService, public candidateService: CandidateService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private serviceListClass: ServiceListClass, private translateService: TranslateService, public systemSettingService: SystemSettingService, private appSettingsService: AppSettingsService, private profileInfoService: ProfileInfoService,
    private clientService: ClientService,) {
      //  who:maneesh,what:ewm-14862 for fixed validation message and maxlenth 50,when:18/10/2023 -->
      this.emailPattern=this.appSettingsService.emailPattern;
    this.addContactForm = this.fb.group({
      //  @Who: Ankit Rawat, @When: 29-jan-2024,@Why: EWM-15577 (Allow some special characters on Candidate/Employee/Contacts Name)
      FirstName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.pattern(this.appSettingsService.specialcharNamePattern), this.noWhitespaceValidator()]],
      LastName: ['', [Validators.minLength(1), Validators.maxLength(50), Validators.pattern(this.appSettingsService.specialcharNamePattern)]],
      Gender: [null], /**********************@suika**@EWM-10821  @02-03-2023 remove required validation ************/
      address: [''],
      Status: [[], Validators.required],
      // @Who: Bantee Kumar,@Why:EWM-11134,@When: 11-Mar-2023,@What: GenderId passed.

      GenderId: [0],
      ContactOwners:[null],
      ContactOwnersId:[''],
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()]) /**********************@suika**@EWM-10821  @02-03-2023 remove required validation ************/
      }),
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
     
      orgId: [[], [Validators.required]],
      Position: ['', [Validators.maxLength(50)]],
    });

    this.ContactStatusActiveKey = this.appSettingsService.ContactStatusActiveKey;
  }
  public organizationData = [];

  public isEditForm: boolean;
  public dropListData: [] = [];
  bufferSize: number = 50;
  loadingOnScroll: boolean = false;
  ngOnInit() {
    this.selectedContactOwner=null;
    this.dropdownConfig();
    // <!-- who:maneesh,what:ewm-12569.ewm-12569 for getting data when click on create contact btn,When:30/05/2023 --> 
    this.clientIdData = this.data.clientIdData
    this.contactRelatedData = this.data.contactRelatedData
    if (this.contactRelatedData == true) {
      this.ClientNamedata = this.clientIdData?.ClientName;
    }
    this.clientId = this.data?.clientId;
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId');
        this.OrganizationName = localStorage.getItem('OrganizationName')//@When: 23-jan-2024 @who:maneesh @why: EWM-15823 EWM-15785 fixed dropdown
      } else {
        this.OrganizationId = value;
      }
    })        
    if (this.data?.formType === 'AddClientContactForm') {
      this.isEditForm = true;
      // this.getClientListById(this.data?.clientId);
      let orgdata = [this.OrganizationId];
      this.addContactForm.patchValue({
        'orgId': orgdata
      });

      this.selectedOrg = [{ Id: this.OrganizationId }];
    }
    else if (this.data?.formType === 'AddForm') {
      this.isEditForm = false;
      let orgdata = [this.OrganizationId];
      this.addContactForm.patchValue({
        'orgId': orgdata
      });
      this.selectedOrg = [{ Id: this.OrganizationId }];
    }
    this.selectedOrgName=[{OrganizationId:this.OrganizationId,OrganizationName:this.OrganizationName}]//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 fixed dropdown
    if (this.data?.showAddContact) {
      this.showAddContact = true;
    }

    /*************@suika@EWM-10681 EWM-EWM-10816  @02-03-2023 to set default values for status in jcontact and not clearable************/
    // let status = {StatusName:"Active", StatusId:1};
    // this.onChangeStatus(status);
    this.selectedContactStatus = { Id: this.ContactStatusActiveKey, Code: 'Active' };
    this.onJobStatuschange(this.selectedContactStatus);
    // setTimeout(() => {
    //  this.title.focus();
    // }, 1000);
    if (this.data?.pageName === 'contact') {
      this.getContactDetailsById(this.data?.contactId);
      this.editContact = true;
      this.showAddContact = false;
    }
    this.currentMenuWidth = window.innerWidth;
    this.screenMediaQuiryForOwnerContact();
  }

  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    // this.detectScreenSize();
    this.screenMediaQuiryForOwnerContact()
  }
  // @Who: Bantee Kumar,@Why:EWM-13709,@When: 07-09-2023,@What: dataStateChange function for kendogrid 

  onOrgchange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedOrg = null;
      this.addContactForm.patchValue(
        {
          orgId: null,
        });
      this.addContactForm.get("orgId").setErrors({ required: true });
      this.addContactForm.get("orgId").markAsTouched();
      this.addContactForm.get("orgId").markAsDirty();
    }
    else {
      this.addContactForm.get("orgId").clearValidators();
      this.addContactForm.get("orgId").markAsPristine();
      this.selectedOrg = data;
      const orgIdData = data.map((item: any) => {
        return item.Id
      });
      this.addContactForm.patchValue(
        {
          orgId: orgIdData
        });
    }
  }

  /*
   @Type: File, <ts>
   @Name: createemail
   @Who: Anup Singh
   @When: 26-Nov-2021
   @Why: EWM-3700 EWM-3918
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
   @Who: Anup Singh
   @When: 26-Nov-2021
   @Why: EWM-3700 EWM-3918
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
   @Who: Anup Singh
   @When: 26-Nov-2021
   @Why: EWM-3700 EWM-3918
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
   @Who: Anup Singh
   @When: 26-Nov-2021
   @Why: EWM-3700 EWM-3918
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails.length == 0) {
       // this.addContactForm.controls['emailmul'].setErrors({ 'required': true }); //who:mukesh ,what:EWM-18417 Contact Email address should be optional
      }
    } else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
        this.phoneArr.splice(index, 1); //who:maneesh,what:ewm-14782 remove phone data ,when:16/10/2023
      }
    } else if (type == 'contactRelatedTo') {
      const index = this.ContactRelatedTo.indexOf(items);
      if (index >= 0) {
        this.ContactRelatedTo.splice(index, 1);
      }
    }
    else {
      const index = this.socials.indexOf(items);
      if (index >= 0) {
        this.socials.splice(index, 1);
      }
    }

  }



  onChangeGender(data) {
    if (data == null || data == "") {
      this.selectedGender = null;
      this.addContactForm.patchValue(
        {
          Gender: null,
        }
      )
    }
    else {
      this.selectedGender = data;   
      this.addContactForm.patchValue({
        Gender: data.GenderName,
        GenderId: data.Id,
      });   
    }
  }
  /* 
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Anup Singh
    @When: 29-Nov-2021
    @Why: EWM-3700 EWM-3916
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onConfirm(value): void {
    let createContactJson = {};
    let emailJson = [];
    let phoneJson = [];
    this.disableSave = true;
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.type, "TypeName": elem.TypeName, "Name": elem.TypeName, "EmailId": elem.email, "IsDefault": elem.IsDefault });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "TypeName": elem.Name, "PhoneNumber": elem.phone, "PhoneCode": elem.phoneCodeName, "IsDefault": elem.IsDefault });
    });
    createContactJson['FirstName'] = this.addContactForm.value?.FirstName?.trim();
      if (this.addContactForm.value?.LastName != null && this.addContactForm.value?.LastName != undefined && this.addContactForm.value?.LastName != '') {
        createContactJson['LastName'] = this.addContactForm.value?.LastName?.trim();
      } else {
        createContactJson['LastName'] ='';
      }
    createContactJson['ContactAddress'] = this.addressData;
    // @Who: Bantee Kumar,@Why:EWM-11134,@When: 11-Mar-2023,@What: GenderId passed. -->

    if (this.addContactForm.value.Gender != null && this.addContactForm.value.Gender != undefined) {
      createContactJson['GenderId'] = Number(this.addContactForm.value.GenderId);
      createContactJson['Gender'] = this.addContactForm.value.Gender;
    } else {
      createContactJson['GenderId'] = 0;
      createContactJson['Gender'] = '';
    }

    createContactJson['Email'] = emailJson;
    createContactJson['Phone'] = phoneJson;
    createContactJson['ContactRelatedTo'] = this.ContactRelatedTo;

    createContactJson['StatusId'] = this.selectedContactStatus.Id;
    createContactJson['StatusName'] = this.selectedContactStatus.Code;

    if (this.clientId != undefined && this.clientId != null && this.clientId != '') {
      createContactJson['ClientId'] = this.clientId;
    }
    createContactJson['OrganizationId'] = this.selectedOrgName.map(x=>x.OrganizationId);//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 fixed dropdown
    createContactJson['Position'] = this.addContactForm.value?.Position?.trim();//who:maneesh,what:ewm-15941 for add this field,when:06/02/2024
    let OwnerData =   this.selectedContactOwner?.filter(x=>{
      return x?.UserId;
    })
    OwnerData?.forEach(ele=>{
      this.ownersdta?.push({'OwnerId':ele?.UserId});
   })
    createContactJson['ContactOwner'] = this.ownersdta;//@Whe: 20-feb-2024 @who:maneesh @why: EWM-16068 fixed dropdown

    this.systemSettingService.createQuickAddContact(createContactJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addContactForm.reset();
          if (this.data?.formType === 'AddClientContactForm') {
            document.getElementsByClassName("quickAddClientContact")[0].classList.remove("animate__zoomIn")
            document.getElementsByClassName("quickAddClientContact")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close(true); }, 200);
          }
          //@Who: Bantee Kumar,@Why:EWM-11050,@When: 10-Mar-2023,@What: Create Contact from "Create Client" Screen  -->

          else if (this.data?.formType === 'AddInstantContact') {
            document.getElementsByClassName("quickAddContact")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("quickAddContact")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => {
              this.dialogRef.close(responseData.Data);


            }, 200);
          } else {
            document.getElementsByClassName("quickAddContact")[0].classList.remove("animate__fadeInDownBig")
            document.getElementsByClassName("quickAddContact")[0].classList.add("animate__fadeOutUpBig");
            setTimeout(() => {
              this.dialogRef.close(true);


            }, 200);
          }


          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
        this.disableSave = false;
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })

  }




  updateContact() {    
    this.loading = true;
    let updateContact={}
    let updateEmailjson=[];
    let updatePhoneJson=[];


    this.disableSave = true;
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      updateEmailjson.push({ "Type": elem.type, "TypeName": elem.TypeName, "Name": elem.TypeName, "EmailId": elem.email, "IsDefault": elem.IsDefault });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      updatePhoneJson.push({ "Type": elem.type, "TypeName": elem.Name, "PhoneNumber": elem.phone, "PhoneCode": elem.phoneCodeName?elem.phoneCodeName:elem.PhoneCode, "IsDefault": elem.IsDefault });
    });
    let ContactDetails={}

    updateContact['ContactDetails'] = ContactDetails;
    updateContact['ContactAddress'] = this.addressData;//who:maneesh,what:ewm-14782 this.addressData ,when:16/10/2023

    ContactDetails['Id'] = this.contactInfoData?.ContactDetails?.Id;
    ContactDetails['FirstName'] = this.addContactForm.value?.FirstName?.trim();
    if (this.addContactForm.value?.LastName != null && this.addContactForm.value?.LastName != undefined && this.addContactForm.value?.LastName != '') {
      ContactDetails['LastName'] = this.addContactForm.value?.LastName?.trim();
    } else {
      ContactDetails['LastName'] = '';
    }
    if (this.addContactForm.value.Gender != null && this.addContactForm.value.Gender != undefined) {
      ContactDetails['GenderId'] = Number(this.addContactForm.value.GenderId);
      ContactDetails['GenderName'] = this.addContactForm.value.Gender;
    } else {
      ContactDetails['GenderId'] = 0;
      ContactDetails['GenderName'] = '';
    }

    updateContact['Emails'] = updateEmailjson;
    updateContact['Phones'] = updatePhoneJson;
    updateContact['ContactRelatedTo'] = this.ContactRelatedTo;

    ContactDetails['StatusName'] = this.selectedContactStatus.Code;
    ContactDetails['StatusId'] = this.selectedContactStatus.Id;
    ContactDetails['ShareContactURL'] = window?.location?.href;
    ContactDetails['ContactId'] = this.data?.ContactIdString;

    if (this.clientId != undefined && this.clientId != null && this.clientId != '') {
      updateContact['ClientId'] = this.clientId;
    }

    updateContact['Organizations'] = this.selectedOrgName;
    updateContact['LocationId'] = this.contactInfoData?.ContactAddress?.LocationId;
    updateContact['ContactId'] = this.contactInfoData?.ContactAddress?.ContactId;
    ContactDetails['Position'] = this.addContactForm.value?.Position?.trim();//who:maneesh,what:ewm-15941 for add this field,when:06/02/2024
    let OwnerData =   this.selectedContactOwner?.filter(x=>{
      return x?.UserId;
    })
    OwnerData?.forEach(ele=>{
      this.ownersdta?.push({'OwnerId':ele?.UserId});
   })
   updateContact['ContactOwner'] = this.ownersdta;//@Whe: 23-jan-2024 @who:maneesh @why: EWM-15806 fixed dropdown

    let createContactJson = {};
    let fromContactDetails={}
    fromContactDetails['FirstName'] = this.contactInfoData?.ContactDetails?.FirstName?.trim();
    if (this.addContactForm.value?.LastName != null && this.addContactForm.value?.LastName != undefined && this.addContactForm.value?.LastName != '') {
      fromContactDetails['LastName'] = this.contactInfoData?.ContactDetails?.LastName?.trim();
    } else {
      fromContactDetails['LastName'] = '';
    }
    fromContactDetails['Position'] = this.contactInfoData?.ContactDetails?.Position?.trim();//who:maneesh,what:ewm-15941 for add this field,when:06/02/2024
    createContactJson['ContactAddress'] = this.contactInfoData.ContactAddress;
    fromContactDetails['Id'] = this.contactInfoData?.ContactDetails?.Id;


    if (this.addContactForm.value.Gender != null && this.addContactForm.value.Gender != undefined) {
      fromContactDetails['GenderId'] = Number(this.contactInfoData?.ContactDetails?.GenderId);
      fromContactDetails['GenderName'] = this.contactInfoData?.ContactDetails?.GenderName;
    } else {
      fromContactDetails['GenderId'] = 0;
      fromContactDetails['GenderName'] = '';
    }

    createContactJson['Emails'] = this.contactInfoData?.Emails;
    createContactJson['Phones'] = this.contactInfoData?.Phones;
    createContactJson['ContactRelatedTo'] = this.contactInfoData?.ContactRelatedTo;

    fromContactDetails['StatusName'] =this.contactInfoData?.ContactDetails?.StatusName;
	  fromContactDetails['StatusId'] = this.contactInfoData?.ContactDetails?.StatusId;

    createContactJson['ContactDetails'] = fromContactDetails;
    // this.contactInfoData?.Organizations;
    createContactJson['Organizations'] = this.contactInfoData?.Organizations;
    let fromOwnerData =   this.selectedContactOwner?.filter(x=>{
      return x?.UserId;
    })
    fromOwnerData?.forEach(ele=>{
      this.fromownersdta?.push({'OwnerId':ele?.UserId});
   })
    createContactJson['ContactOwner'] = this.fromownersdta;//@Whe: 19-feb-2024 @who:maneesh @why: EWM-16068 fixed dropdown 
    let updateObj = {
      "From": createContactJson,
      "To": updateContact,
    };

    this.systemSettingService.updateContactDetails(updateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          document.getElementsByClassName("quickAddContact")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("quickAddContact")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
       this.disableSave = false;

      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Anup Singh
    @When: 26-Nov-2021
    @Why: EWM-3700 EWM-3916
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onDismiss(): void {
    document.getElementsByClassName("quickAddContact")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("quickAddContact")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  /* 
    @Type: File, <ts>
    @Name: addEmail
    @Who: Anup Singh
    @When: 26-Nov-2021
    @Why: EWM-3700 EWM-3916
    @What: for opening the email dialog box
  */
  /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

  addEmail() {
    this.addContactForm.get('emailmul').reset();
    this.noRequiredValidation=true;
    let mode = '';
    if (this.emails.length == 0) {
      mode = 'Add';
    } else {
      mode = 'edit';
    }
    const dialogRef = this.dialog.open(AddemailComponent, {
      data: new Object({noRequiredValidation:this.noRequiredValidation, emailmul: this.addContactForm.get('emailmul'), emailsChip: this.emails, mode: mode, pageName: 'genralInfoPage', values: { Email: this.emails } }),
      panelClass: ['xeople-modal', 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.emailArr = res.data;
      if (this.emailArr) {
        this.emails = [];
        // this.emailArr.sort((a, b) => b.IsDefault - a.IsDefault);
        for (let j = 0; j < this.emailArr.length; j++) {
          this.emails.push({
            email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['Name'],
            IsDefault: this.emailArr[j]['IsDefault'], Type: this.emailArr[j]['Type'], EmailId: this.emailArr[j]['EmailId'],
            Name: this.emailArr[j]['Name']
          })
          this.patch(this.emailArr[j]['EmailId'], this.emailArr[j]['Type']);
          this.emailValid = true;
        }
      } else { //by maneesh ewm-18417 for remove no rewured validition on email,when:24/10/2024
        const control = <FormGroup>this.addContactForm.get('emailmul');
        const childcontrol = <FormArray>control.controls.emailInfo;
        childcontrol.clear();
        childcontrol.updateValueAndValidity();
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

  patch(emailId, typeId) {
    const control = <FormGroup>this.addContactForm.get('emailmul');
    const childcontrol = <FormArray>control.controls.emailInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValues(emailId, typeId))
    this.addContactForm.patchValue({
      emailmul: childcontrol
    })
  }


  patchValues(emailId, typeId) {
    return this.fb.group({
      EmailId: [emailId],
      Type: [typeId]
    })
  }




  /*
  @Type: File, <ts>
  @Name: addAddress
  @Who: Anup
  @When: 29-Nov-2021
  @Why: EWM-3700 EWM-3916
  @What: To get Data from address of people
  */
  addAddress() {
    const dialogRef = this.dialog.open(QuicklocationComponent, {

      data: new Object({ address: this.addressData }),
      panelClass: ['xeople-modal', 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res != null) {
        this.addContactForm.patchValue({ address: res.data?.AddressLinkToMap });
        this.addressData = res.data
        this.locationArr = [res.data];
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
    @Who: Anup Singh
    @When: 26-Nov-2021
    @Why: EWM-3700 EWM-3916
   @What: for opening the phone dialog box
 */

  addPhone() {
    this.addContactForm.get('phonemul').reset();
    if(this.phoneArr && this.phoneArr.length){
      this.phoneArr.forEach(phone => {
        phone.CountryId = Number(phone.CountryId);
        phone.PhoneCode = Number(phone.PhoneCode);
      });
    }
    const dialogRef = this.dialog.open(AddphonesComponent, {

      data: new Object({ phonemul: this.addContactForm.get('phonemul'), phoneChip:[], mode: 'edit', values: { Phone: this.phoneArr } }),
      panelClass: ['xeople-modal', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      
      if(res?.data == ''){
        return;
       } else{
         this.phoneArr = res?.data;
       }
       if (this.phoneArr) {
        // this.PhonePopUpData = this.phoneArr;
        this.phone = [];
        for (let j = 0; j < this.phoneArr.length; j++) {
          this.phone.push({
            phone: this.phoneArr[j]['PhoneNumber'],
            type: this.phoneArr[j]['Type'],
            Name: this.phoneArr[j]['Name'],
            IsDefault: this.phoneArr[j]['IsDefault'],
            PhoneCode: this.phoneArr[j]['PhoneCode'],
            // CountryId:this.phoneArr[j]['CountryId'].toString(),
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





  patchPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault) {
    const control = <FormGroup>this.addContactForm.get('phonemul');
    const childcontrol = <FormArray>control.controls.phoneInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValuesPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault))
    this.addContactForm.patchValue({
      phonemul: childcontrol
    })
  }


  patchValuesPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault) {
    return this.fb.group({
      PhoneNumber: [PhoneNumber],
      Type: [Type],
      phoneCode: [phoneCode],
      phoneCodeName: [phoneCodeName],
      IsDefault: [IsDefault],
    })
  }





  /*
  @Type: File, <ts>
  @Name: openModelContactRelatedType
  @Who: Anup Singh
  @When: 26-Nov-2021
  @Why: EWM-3700 EWM-3916
  @What: open Modal for contact related type
  */
  openModelContactRelatedType() {
    const dialogRef = this.dialog.open(ContactRelatedTypeComponent, {
      data: new Object({ clientId: this.clientId }),

      panelClass: ['xeople-modal', 'AddContactRelatedType', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.resType == true) {
        this.ContactRelatedTo = res.clientArr;
      } else if (res.resType === 'goToClientDetails') {
        if (this.data?.formType === 'AddClientContactForm') {
          document.getElementsByClassName("quickAddClientContact")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("quickAddClientContact")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(false); }, 200);
        } else {
          document.getElementsByClassName("quickAddContact")[0].classList.remove("animate__fadeInDownBig")
          document.getElementsByClassName("quickAddContact")[0].classList.add("animate__fadeOutUpBig");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
        }
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
  @Name: onDismissEdit
  @Who: Anup Singh
  @When: 22-Nov-2021
  @Why: EWM-3638 EWM-3847
  @What: To close Quick Company Modal for edit
  */
  onDismissEdit(): void {
    document.getElementsByClassName("quickAddClientContact")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("quickAddClientContact")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }

  // onJobStatuschange(data) {
  //   if (data == null || data == "") {
      
  //   }
  //   else {
      
  //     this.selectedContactStatus = data;
      

  //   }

  // }

  getOrganizationList() {
    this.countryMasterService.getOrganizationList().subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {


          this.organizationData = responseData.Data;
  /*@Who: Bantee kumar,@When: 19-09-2023,@Why: EWM-14409,@What: when user changing the org from dropdown and When user edit the contact record all the mapped organization is not showing in disable mode.*/

          let orgdata= responseData.Data.filter((e: any) => e.OrganizationId === this.OrganizationId)
      if(!this.editContact){
         this.addContactForm.patchValue({
          'orgId': orgdata
        });
      }
          // let orgId=responseData.Data.filter((e: any) => e.OrganizationId === this.OrganizationId).map(x=>x.OrganizationId);
          // this.addContactForm.controls['orgId'].setValue(orgId)


          // this.organizationData = this.dropListData.slice(0, this.bufferSize);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  // fetchMore() {
  //   const len = this.organizationData.length;
  //   const more = this.dropListData.slice(len, this.bufferSize + len);
  //   if (len>49) {

  //     this.loadingOnScroll = true;
  //   }
  //   setTimeout(() => {
  //       this.loadingOnScroll = false;
  //       this.organizationData = this.organizationData.concat(more);
  //   }, 200)

  // }



  getContactDetailsById(contactId) {
    this.loading = true;
    this.clientService.getContactDetailsById(contactId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.contactInfoData = repsonsedata.Data;
          this.patchDataForClientEdit()
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

  patchDataForClientEdit() {    
    if (this.contactInfoData != undefined && this.contactInfoData != null) {
      this.addContactForm.patchValue({
        'FirstName': this.contactInfoData?.ContactDetails?.FirstName,
        'LastName': this.contactInfoData?.ContactDetails?.LastName,
        // 'StatusId': this.contactInfoData?.ContactDetails?.StatusId,
        // 'StatusName': this.contactInfoData?.ContactDetails?.StatusName,
        'address': this.contactInfoData.ContactAddress?.AddressLinkToMap,
        'Position': this.contactInfoData?.ContactDetails?.Position
      })
          // who:maneesh,what:ewm-16068 for patch contact owners this.data,when:21/02/2024
    let arr = [];
    if (this.contactInfoData?.ContactOwner?.length!=0) {
      this.contactInfoData?.ContactOwner?.forEach((ele:any)=>{
        arr.push({...ele, UserId: ele?.OwnerId, UserName: ele?.OwnerName})
      }) 
      this.selectedContactOwner = arr; 
    }
      this.selectedContactStatus = { Id: this.contactInfoData?.ContactDetails?.StatusId, Code: this.contactInfoData?.ContactDetails?.StatusName };
      this.selectedOrgName=this.contactInfoData?.Organizations;
      if (this.contactInfoData?.ContactDetails?.GenderName==null) {
        this.selectedGender={};
      }else{
        this.selectedGender = { Id: this.contactInfoData?.ContactDetails?.GenderId, GenderName: this.contactInfoData?.ContactDetails?.GenderName };    
      }
      this.addressData=this.contactInfoData?.ContactAddress;
      this.addContactForm.controls['orgId'].disable();
       

      if (this.contactInfoData?.Phones) {
        this.phoneArr = JSON.parse(JSON.stringify(this.contactInfoData?.Phones));
        this.phoneArr.forEach(e=>
          e.phoneCodeName = e.PhoneCode
        )
        if (this.phoneArr != '') {
          for (let j = 0; j < this.phoneArr.length; j++) {
            this.phone.push({
              phone: this.phoneArr[j]['PhoneNumber'],
              type: this.phoneArr[j]['Type'],
              Name: this.phoneArr[j]['TypeName'],
              IsDefault: this.phoneArr[j]['IsDefault'],
              PhoneCode: this.phoneArr[j]['PhoneCode'],
              phoneCodeName: this.phoneArr[j]['phoneCodeName'],
              CountryId: this.phoneArr[j]['CountryId']

            })
           
          }
        
        }
      }

      if (this.contactInfoData?.Emails) {
        this.emailArr = this.contactInfoData?.Emails;
        if (this.emailArr) {
          this.emails = [];
          for (let j = 0; j < this.emailArr.length; j++) {
            this.emails.push({
              email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['TypeName'],
              IsDefault: this.emailArr[j]['IsDefault'], Type: this.emailArr[j]['Type'], EmailId: this.emailArr[j]['EmailId'],
              Name: this.emailArr[j]['Name']
            })
            this.patch(this.emailArr[j]['EmailId'], this.emailArr[j]['Type']);
            this.emailValid = true;
          }
        } else {
          this.patch(null, null);
          if (this.emails?.length == 0) {
            this.emailValid = false;
            this.addContactForm.controls['emailmul'].setErrors({ 'required': true });

          }
        }
      }

      if (this.contactInfoData?.ContactRelatedTo) {
        this.ContactRelatedTo = this.contactInfoData?.ContactRelatedTo
      }
    }
  }

 // <!---------@When: 23-jan-2024 @who:maneesh @why: EWM-15806 fixed dropdown--------->
 dropdownConfig(){
  //Org
  this.common_DropdownC_Config = {
    API: this.serviceListClass.getOrganizationList,
    MANAGE: '',
    BINDBY: 'OrganizationName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_organization',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'OrganizationId'
  }
//Status
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
//Gender
  this.common_DropdownGender_Config = {
    API: this.serviceListClass.genderList,
    MANAGE: '',
    BINDBY: 'GenderName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_Gender',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: ''  ,
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'Id'
  }

  // <!-- who:maneesh,what:ewm-16068 for fixed dropdown ,When:19/02/2024 -->
  this.common_DropdownContactOwners_Config = {
    API: this.serviceListClass.userInvitationList +'?RecordFor=People',
    MANAGE: '',
    BINDBY: 'UserName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_contactOwner',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: false,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: 'Email',
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'UserId'
  }

}
//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 EWM-15785 get orgnazition dropdown data
onChangeContactOwner(data) {
  this.selectedContactOwner=null;
  if (data == null || data == "") {
    this.selectedContactOwner = null;
    this.addContactForm.patchValue(
      {
        ContactOwners: null,
        ContactOwnersId:'',
      }
    )
  }
  else {
    this.selectedContactOwner = data;   
    this.addContactForm.patchValue({
      ContactOwners: data.ContactOwners,
      ContactOwnersId: data.OwnerId,
    });   
  }


}
//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 EWM-15785 get orgnazition dropdown data
getOrgData(data){
  if (data?.length == 0) {
    this.disableSave = true;
    this.selectedOrgName = null;
    this.addContactForm.patchValue(
      {
        orgId:''
      });
    this.addContactForm.get("orgId").setErrors({ required: true });
    this.addContactForm.get("orgId").markAsTouched();
    this.addContactForm.get("orgId").markAsDirty();
  }
  else {
    this.addContactForm.get("orgId").clearValidators();
    this.addContactForm.get("orgId").markAsPristine();
    this.selectedOrgName = data;
    this.disableSave = false;

    this.addContactForm.patchValue({
      orgId: data?.Id
    });
  }
}

onJobStatuschange(data) {
  if (data == null || data == "") {
    this.selectedContactStatus = null;
    this.addContactForm.patchValue(
      {
        Status: null,
      }
    )
    this.addContactForm.get("Status").setErrors({ required: true });
    this.addContactForm.get("Status").markAsTouched();
    this.addContactForm.get("Status").markAsDirty();
  }
  else {
    this.addContactForm.get("Status").clearValidators();
    this.addContactForm.get("Status").markAsPristine();
    this.selectedContactStatus = data;      
    this.addContactForm.patchValue(
      {
        Status: data.Id,
      }
    )
  }
}

  screenMediaQuiryForOwnerContact(){
    /* @When: 29-08-2023 @who:Amit @why: EWM-13922 @what:max length changes */
    if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
      this.maxMoreLengthForOwnerContacts = 1;
    } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
      this.maxMoreLengthForOwnerContacts = 2;
    } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
      this.maxMoreLengthForOwnerContacts = 3;
    } else {
      this.maxMoreLengthForOwnerContacts = 4;
    }
  }
}


