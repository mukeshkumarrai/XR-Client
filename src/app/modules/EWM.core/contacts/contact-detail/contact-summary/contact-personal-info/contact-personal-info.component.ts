import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { AddphonesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addphones/addphones.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { ResponceData } from 'src/app/shared/models';
import { PersonalData } from 'src/app/shared/models/contact';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-contact-personal-info',
  templateUrl: './contact-personal-info.component.html',
  styleUrls: ['./contact-personal-info.component.scss']
})
export class ContactPersonalInfoComponent implements OnInit {
  loading: boolean;
  genderList: any = [];
  editPersonalForm: FormGroup;
  // public namePattern =  new RegExp(/^[a-zA-Z\s]{1,50}$/);
  public namePattern = "^[a-z A-Z]+$";


  emailPattern: string;
  numberPattern: string;
  specialcharPattern: string;
  personalInformationData: PersonalData=null;
  emails: any = []
  public emailArr: any;
  dirctionalLang;
  public phoneArr: any;
  phone: any = [];
  phoneValid: boolean;
  emailValid: boolean;
  public dropDownStatusConfig: customDropdownConfig[] = [];
  contactGrpID: string = "0985d0e6-45a6-4574-aed0-b75e5049faa2";
  ContactStatusActiveKey: string;
  public selectedContactStatus: any = {};
  removable = true;
  public  selectedContactOwner :any={};
  public common_DropdownContactOwners_Config:DRP_CONFIG;
  ownersId: any;
  ownersdta=[];
  public currentMenuWidth: number;
  public maxMoreLengthForOwnerContacts:number=5;
  public noRequiredValidation:boolean;
  constructor(public candidateService: CandidateService,private translateService: TranslateService,
    private snackBService: SnackBarService,
     @Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,
     private appSettingsService: AppSettingsService,public dialog: MatDialog,
     private clientService: ClientService, private serviceListClass: ServiceListClass,public dialogRef: MatDialogRef<ContactPersonalInfoComponent> ) {

      this.emailPattern = this.appSettingsService.emailPattern;
     this.numberPattern = this.appSettingsService.numberPattern;
     this.specialcharPattern = this.appSettingsService.namePattern;
     this.ContactStatusActiveKey = this.appSettingsService.ContactStatusActiveKey;

     this.personalInformationData=this.data?.personalInformationData;

      this.editPersonalForm = this.fb.group({
          //  @Who: Ankit Rawat, @When: 2-feb-2024,@Why: EWM-EWM-15523-EWM-15895 (Allow some special characters on Name)
        FirstName: ['', [Validators.required, Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50),this.noWhitespaceValidator()]],
        LastName: ['', [Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50)]],
        StatusId: [[], Validators.required],
        StatusName: [''],
        Gender: [null], 
        GenderId: [0],
        ContactOwners:[null],
        ContactOwnersId:[''],
        emailmul: this.fb.group({
          emailInfo: this.fb.array([this.createemail()])
        }),
        phonemul: this.fb.group({
          phoneInfo: this.fb.array([this.createphone()])
        }),
        Position: ['', [Validators.maxLength(50)]], //who:maneesh,what:ewm-15941 for add position field,when:06/02/2024 
      });

     }

  ngOnInit(): void {
    this.dropdownConfig();
    this.selectedContactStatus = { Id: this.ContactStatusActiveKey, Code: 'Active' };
    this.selectedContactOwner=null;
    this.onManageStatuschange(this.selectedContactStatus);
    this.getAllGender();
    if(this.personalInformationData){
      this.patchDataForClientEdit();
    }
    this.ddlconfigSetting();
    this.currentMenuWidth = window.innerWidth;
    this.screenMediaQuiryForOwnerContact();
  }

  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    // this.detectScreenSize();
    this.screenMediaQuiryForOwnerContact()
  }
  onManageStatuschange(data) {
    if (data == null || data == "") {
      this.selectedContactStatus = null;
      this.editPersonalForm.patchValue(
        {
          StatusId: null
        }
      )
      this.editPersonalForm.get("StatusId").setErrors({ required: true });
      this.editPersonalForm.get("StatusId").markAsTouched();
      this.editPersonalForm.get("StatusId").markAsDirty();
    }
    else {
      this.editPersonalForm.get("StatusId").clearValidators();
      this.editPersonalForm.get("StatusId").markAsPristine();
      this.selectedContactStatus = data;
      this.editPersonalForm.patchValue(
        {
          StatusId: data.Id,
          StatusName: data.Code,
          StatusColorCode: data.ColorCode,

        }
      )

    }

  }

  ddlconfigSetting(){
   // contact status
   this.dropDownStatusConfig['IsDisabled'] = false;
   this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + "?GroupId=" + this.contactGrpID + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
   this.dropDownStatusConfig['placeholder'] = 'quickjob_status';
   this.dropDownStatusConfig['IsManage'] = '/client/core/administrators/group-master';
   this.dropDownStatusConfig['IsRequired'] = true;
   this.dropDownStatusConfig['searchEnable'] = true;
   this.dropDownStatusConfig['bindLabel'] = 'Code';
   this.dropDownStatusConfig['multiple'] = false;
   this.dropDownStatusConfig['isClearable'] = false;



  }
  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      phoneCode: [''],
      phoneCodeName: [],
      IsDefault: [],
    });
  }


  createemail(): FormGroup {
    return this.fb.group({ //by maneesh ewm-18417 for remove rewured validition on email,when:24/10/2024
      EmailId: ['', [Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [ RxwebValidators.unique()]]
    });
  }



  addEmail() {
    this.editPersonalForm.get('emailmul').reset();
    this.noRequiredValidation=true;    //by maneesh ewm-18417 for remove no rewured validition on email,when:24/10/2024
    let actionEmail;
    if (this.emails.length == 0) {
      actionEmail = 'Add';
      }else{
      actionEmail = 'edit';
      }
    

    const dialogRef = this.dialog.open(AddemailComponent, {
      maxWidth: "700px",
      data: new Object({noRequiredValidation:this.noRequiredValidation, emailmul: this.editPersonalForm.get('emailmul'), emailsChip: this.emails, mode: actionEmail, pageName: 'genralInfoPage', values: {Email:this.emails} }),
      panelClass: ['quick-modalbox', , 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.emailArr = res.data;      
       if (this.emailArr) {
        this.emails = [];
        for (let j = 0; j < this.emailArr.length; j++) {
          this.emails.push({
            IsDefault: this.emailArr[j]['IsDefault'],
            Name: this.emailArr[j]['Name'],
            EmailId: this.emailArr[j]['EmailId'],
            TypeName: this.emailArr[j]['Type'],
            Type: this.emailArr[j]['Type'],
          })
        }
      }else {
        const control = <FormGroup>this.editPersonalForm.get('emailmul'); //by maneesh ewm-18417 for remove no rewured validition on email,when:24/10/2024
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
  


  public PhonePopUpData = [];
  addPhone() {
    this.editPersonalForm.get('phonemul').reset();
    if(this.phoneArr && this.phoneArr.length){
      this.phoneArr.forEach(phone => {
        phone.CountryId = Number(phone.CountryId);
        phone.PhoneCode = Number(phone.PhoneCode);
      });
    }
    const dialogRef = this.dialog.open(AddphonesComponent, {
      maxWidth: "700px",
      data: new Object({   phonemul: this.editPersonalForm.get('phonemul'), phoneChip:[], mode: 'edit', values: { Phone: this.phoneArr } }),
      panelClass: ['quick-modalbox', , 'add_phone', 'animate__animated', 'animate__zoomIn'],
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


  remove(items: any, type: string): void {
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails.length == 0) {
        //this.editPersonalForm.controls['emailmul'].setErrors({ 'required': true });

      }

    } else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
        this.phoneArr.splice(index, 1);
      }
    }  

  }

  patch(emailId, typeId) {
    const control = <FormGroup>this.editPersonalForm.get('emailmul');
    const childcontrol = <FormArray>control.controls.emailInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValues(emailId, typeId))
    this.editPersonalForm.patchValue({
      emailmul: childcontrol
    })
  }

  patchPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault) {
    const control = <FormGroup>this.editPersonalForm.get('phonemul');
    const childcontrol = <FormArray>control.controls.phoneInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValuesPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault))
    this.editPersonalForm.patchValue({
      phonemul: childcontrol
    })
  }

  patchValues(emailId, typeId) {
    return this.fb.group({
      EmailId: [emailId],
      Type: [typeId]
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


  onConfirm(): void {
    if (this.editPersonalForm.invalid) {
      return;
    }

    let contactPersonalJson = {};
    contactPersonalJson['ContactId'] = this.data?.ContactIdString;
    contactPersonalJson['ShareContactURL'] = window?.location?.href;
    contactPersonalJson['ClientId'] = this.personalInformationData?.ClientId;
    contactPersonalJson['Id'] =this.personalInformationData?.Id ;
    contactPersonalJson['FirstName'] = this.editPersonalForm.value.FirstName?.trim();

    
    if (this.editPersonalForm.value?.LastName != null && this.editPersonalForm.value?.LastName != undefined && this.editPersonalForm.value?.LastName !='') {
      contactPersonalJson['LastName'] = this.editPersonalForm.value?.LastName?.trim();
    } else {
      contactPersonalJson['LastName'] ='';
    }
    contactPersonalJson['Gender'] = this.editPersonalForm.value.Gender;
    contactPersonalJson['GenderId'] = this.editPersonalForm.value.GenderId;
    contactPersonalJson['EmailId'] = this.personalInformationData?.EmailId;
    if(this.phone.length){
      contactPersonalJson['PhoneCode'] = this.personalInformationData?.PhoneCode;
      contactPersonalJson['PhoneNo'] = this.personalInformationData?.PhoneNo;
    } else{
      contactPersonalJson['PhoneCode'] = '';
      contactPersonalJson['PhoneNo'] = '';
    }
     
    // contactPersonalJson['Status'] = this.personalInformationData?.Status;
    // contactPersonalJson['StatusColor'] = this.personalInformationData?.StatusColor;
    
    
    let emailJson = [];
    let phoneJson = []; 

    if (this.editPersonalForm.value.StatusName != null && this.editPersonalForm.value.StatusName != undefined) {
      contactPersonalJson['StatusName'] = this.editPersonalForm.value.StatusName;
      contactPersonalJson['StatusId'] = this.editPersonalForm.value.StatusId;
    } else {
      contactPersonalJson['StatusName'] = '';
      contactPersonalJson['StatusId'] = '';
    }

    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.Type, "EmailId": elem.EmailId, "IsDefault": elem.IsDefault });
    });
    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "TypeName": elem.Name, "PhoneNumber": elem.phone, "PhoneCode": elem.phoneCodeName?elem.phoneCodeName:elem.PhoneCode, "IsDefault": elem.IsDefault });
    });

    contactPersonalJson['Email'] = emailJson;
    contactPersonalJson['Phone'] = phoneJson;

     
    contactPersonalJson['Position'] =this.editPersonalForm.value?.Position?.trim();//who:maneesh,what:ewm-15941 for add position field,when:06/02/2024
    let OwnerData =   this.selectedContactOwner?.filter(x=>{
      return x?.UserId;
    })
    OwnerData?.forEach(ele=>{
      this.ownersdta?.push({'OwnerId':ele?.UserId});
   })
   contactPersonalJson['Owners'] = this.ownersdta;//@Whe: 20-feb-2024 @who:maneesh @why: EWM-16068 fixed dropdown
    this.clientService.updatePersonalInformation(contactPersonalJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.editPersonalForm.reset();
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
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
  }


  getAllGender() {
    this.loading = true;
    this.candidateService.getAllGenderList().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.genderList = repsonsedata['Data'];
        } else if (repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.genderList = [];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  onChangeGender(gender) {
    // who:maneesh,what:ewm-14781 for handel null chech,when:17/10/2023
    this.editPersonalForm.patchValue({
      Gender: gender?.GenderName,
      GenderId: gender?.Id,
    });
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '')?.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }



  patchDataForClientEdit() {
    if (this.personalInformationData != undefined && this.personalInformationData != null) {     
      this.editPersonalForm.patchValue({
        'FirstName': this.personalInformationData?.FirstName,
        'LastName': this.personalInformationData?.LastName,
        'Gender': this.personalInformationData?.Gender,
        'GenderId': this.personalInformationData?.GenderId,
        'StatusId': this.personalInformationData?.StatusId,
        'StatusName': this.personalInformationData?.StatusName,
        'Position': this.personalInformationData?.Position, //who:maneesh,what:ewm-15941 for add position field,when:06/02/2024       
        
      })
    this.selectedContactStatus = { Id: this.personalInformationData?.StatusId, code: this.personalInformationData?.StatusName };
    // who:maneesh,what:ewm-16068 for patch contact owners this.data,when:21/02/2024
    let arr = [];
    if (this.personalInformationData?.Owners?.length!=0) {
      this.personalInformationData?.Owners.forEach((ele:any)=>{
        arr.push({...ele, UserId: ele?.OwnerId, UserName: ele?.OwnerName})
      }) 
      this.selectedContactOwner = arr;
    }

      if (this.personalInformationData?.Phone) {
        this.phoneArr=[];
        // this.PhonePopUpData = this.personalInformationData?.Phone;
        this.phoneArr = this.personalInformationData?.Phone;

        this.phoneArr.forEach(e=>
          e.phoneCodeName = e.PhoneCode
        )

        if (this.phoneArr != '') {
          this.phone=[];
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

      if (this.personalInformationData?.Email) {
        this.emailArr = this.personalInformationData?.Email;
        if (this.emailArr) {
          this.emails = [];
          for (let j = 0; j < this.emailArr.length; j++) {
            this.emails.push({
              email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['TypeName'],
              IsDefault: this.emailArr[j]['IsDefault'], Type: this.emailArr[j]['Type'], EmailId: this.emailArr[j]['EmailId'],
              Name: this.emailArr[j]['TypeName']
            })
            this.patch(this.emailArr[j]['EmailId'], this.emailArr[j]['Type']);
            this.emailValid = true;
          }
        } else {
          this.patch(null, null);
          if (this.emails?.length == 0) {
            this.emailValid = true;
            this.editPersonalForm.controls['emailmul'].setErrors({ 'required': true });

          }
        }
      }

    }
  }


  onDismiss(): void {
    
    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

   // <!-- who:maneesh,what:ewm-16068 for fixed dropdown ,When:19/02/2024 -->
   dropdownConfig(){
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
    this.editPersonalForm.patchValue(
      {
        ContactOwners: null,
        ContactOwnersId:'',
      }
    )
  }
  else {
    this.selectedContactOwner = data;     
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
