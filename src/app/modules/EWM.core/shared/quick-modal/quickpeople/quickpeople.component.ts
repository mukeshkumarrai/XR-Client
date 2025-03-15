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
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { AddphonesComponent } from '../addphones/addphones.component';
import { AddSocialComponent } from '../add-social/add-social.component';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { QuicklocationComponent } from '../addlocation/quicklocation.component';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ProfileInfoService } from '../../services/profile-info/profile-info.service';
import { QuickpeopleService } from '../../services/quick-people/quickpeople.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { customDropdownConfig } from '../../datamodels';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ConfirmDialogComponent } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { QuickJobService } from '../../services/quickJob/quickJob.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-quickpeople',
  templateUrl: './quickpeople.component.html',
  styleUrls: ['./quickpeople.component.scss']
})
export class QuickpeopleComponent implements OnInit {

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
  public addressData: any;
  skillSelectedList: any = [];
  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput: ElementRef<HTMLInputElement>;
  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  addPeopleForm: FormGroup;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z]+$";
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
  skillListLengthMore: any = 5;
  public searchValue: string = "";
  currentSearchValue: string;
  Skills: any[] = [];
  public SkillTags: any[] = [];
  public isBulkEdit: boolean = false;
  public dropDownOrgConfig: customDropdownConfig[] = [];
  public selectedOrg: any = {};
  searchskillList: any[];
  loadingSearch: boolean;
  skillCount: any;
  SkillTag = new FormControl();
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public dropDownStatusConfig: customDropdownConfig[] = [];
  public selectedReason: any = {};
  public selectedStatus: any = {};
  resetFormSubjectSubExperties: Subject<any> = new Subject<any>();
  public statusId: any
  public groupCode: any
  employeeID: any;  
  dirctionalLang;
  emailValid:boolean=false;
  public EmployeeStatusActiveKey:string; // <!---------@When: 03-Feb-2023 @who:suika @why: EWM-10681 EWM-10817 for default value of status--------->
  constructor(public dialogRef: MatDialogRef<QuickpeopleComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private countryMasterService: CountryMasterService,
    private textChangeLngService: TextChangeLngService, private appSettingsService: AppSettingsService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private serviceListClass: ServiceListClass, private quickJobService: QuickJobService,
    private profileInfoService: ProfileInfoService, private quickpeopleService: QuickpeopleService) {
      this.emailPattern=this.appSettingsService.emailPattern;
      this.employeeID = this.appSettingsService.employeeID;
      this.emailPattern=this.appSettingsService.emailPattern;
      // <!---------@When: 03-Feb-2023 @who:suika @why: EWM-10681 EWM-10817 for default value of status--------->
      this.EmployeeStatusActiveKey = this.appSettingsService.EmployeeStatusActiveKey;
      this.statusId = data;
    this.dropDownReasonConfig['IsDisabled'] = false;
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList+'?StatusId=';
    this.dropDownReasonConfig['placeholder'] = 'label_MenuReason';
    this.dropDownReasonConfig['IsManage'] = '';
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;

    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + '?GroupId=' + this.employeeID +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
 
    this.dropDownStatusConfig['placeholder'] = 'label_status';
    this.dropDownStatusConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=' + this.employeeID;
    this.dropDownStatusConfig['IsRequired'] = true;
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['bindLabel'] = 'Code';
    this.dropDownStatusConfig['multiple'] = false;
    this.dropDownStatusConfig['isClearable'] = false; // <!---------@When: 03-Feb-2023 @who:suika @why: EWM-10681 EWM-10817 for default value of status--------->


    this.addPeopleForm = this.fb.group({
      orgId: [, [Validators.required]],
     // who:maneesh,what:ewm-13531 for trim data and add  noWhitespaceValidator(),when:24/07/2023 
     //  @Who: Ankit Rawat, @When: 25-jan-2024,@Why: EWM-15577-EWM-15840 (Allow some special characters on First Name and Last Name)
      firstName: ['', [Validators.required, Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50),this.noWhitespaceValidator()]],
      lastName: ['', [Validators.required, Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50),this.noWhitespaceValidator()]],
      smsTitle: ['', [Validators.maxLength(50)]],
      temptype: [[], [Validators.required]],
      // tempStatus: [[], [Validators.required]],
      Status: [[], Validators.required],
      StatusName: [''],
      ReasonId: [[],],
      ReasonName: [''],
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      socialmul: this.fb.group({
        socialInfo: this.fb.array([this.createSocial()])
      }),
      address: this.fb.group({
       
        'AddressLinkToMap': ['', [Validators.maxLength(250)]],
        
      })
    });

  }

  ngOnInit() {
    this.ddlconfigSetting();
    //this.getOrganizationList();
    this.tenantUserTypeList();
    this.getInternationalization();
    this.getCountryInfo();
    this.getStatesList();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
      } else {
        this.OrganizationId = value;
      }
    })
    let orgdata = [this.OrganizationId];
    this.addPeopleForm.patchValue({
      'orgId': orgdata
    })
    this.selectedOrg = [{ Id: this.OrganizationId }];
    //this.onChangeMapAddress();
  }

  ddlconfigSetting() {
    this.dropDownOrgConfig['IsDisabled'] = false;
    this.dropDownOrgConfig['apiEndPoint'] = this.serviceListClass.getOrganizationList;
    this.dropDownOrgConfig['placeholder'] = 'label_organization';
    this.dropDownOrgConfig['IsManage'] = '';
    this.dropDownOrgConfig['IsRequired'] = true;
    this.dropDownOrgConfig['searchEnable'] = true;
    this.dropDownOrgConfig['bindLabel'] = 'OrganizationName';
    this.dropDownOrgConfig['multiple'] = true;
// <!---------@When: 03-Feb-2023 @who:suika @why: EWM-10681 EWM-10817 for default value of status--------->
    this.selectedStatus =  {Id:this.EmployeeStatusActiveKey};
    this.onManageStatuschange(this.selectedStatus);

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
      this.addPeopleForm.patchValue(
        {
          orgId: null,
        });
      this.addPeopleForm.get("orgId").setErrors({ required: true });
      this.addPeopleForm.get("orgId").markAsTouched();
      this.addPeopleForm.get("orgId").markAsDirty();
    }
    else {
      this.addPeopleForm.get("orgId").clearValidators();
      this.addPeopleForm.get("orgId").markAsPristine();
      this.selectedOrg = data;
      const orgIdData = data.map((item: any) => {
        return item.Id
      });
      this.addPeopleForm.patchValue(
        {
          orgId: orgIdData
        });
    }
  }
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
   @Name: createemail
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
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
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
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
  @Name: createSocial
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: when user click on add to create form group with same formcontrol
  */
  createSocial(): FormGroup {
    return this.fb.group({
      ProfileURL: ['', [Validators.pattern(this.urlpattern), Validators.maxLength(100), RxwebValidators.unique()]],
      TypeId: [[], [RxwebValidators.unique()]]
    });
  }

  /*
   @Type: File, <ts>
   @Name: add
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
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
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails.length == 0) {
        this.addPeopleForm.controls['emailmul'].setErrors({ 'required': true });
      }
      //<!-------@suika @EWM-10662 @to check email type main exist or not-------------------------------->
      let mainTypeEmail = this.emails.filter(el => (el.IsDefault == true));
      if(mainTypeEmail?.length==0){
      this.addPeopleForm.controls['emailmul'].setErrors({ 'mainEmail': true });
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
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: to filter out duplicate value in mat chip list (not in use currently)
  */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  /*
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Renu
    @When: 26-May-2021
    @Why: EWM-1586
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(): void {
    // Close the dialog, return true
    //this.dialogRef.close(true);

    if (this.addPeopleForm.invalid) {
      return;
    }
    let createPeopJson = {};
    let emailJson = [];
    let phoneJson = [];
    let socialJson = [];
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.type, "EmailId": elem.email,"TypeName": elem.TypeName, "IsDefault": elem.IsDefault });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "PhoneNumber": elem.phone, "IsDefault": elem.IsDefault, "PhoneCode": elem.PhoneCode.toString() });
    });
    this.socials.forEach(function (elem) {
      elem.TypeId = parseInt(elem.TypeId);
      elem.ProfileURL = elem.ProfileURL;
      socialJson.push({ "TypeId": elem.type, "ProfileURL": elem.link });
    });

   // who:maneesh,what:ewm-13531 for trim data ,when:24/07/2023 

   createPeopJson['Organization'] = this.addPeopleForm.value.orgId;
   createPeopJson['FirstName'] = this.addPeopleForm.value.firstName?.trim();
   createPeopJson['LastName'] = this.addPeopleForm.value.lastName?.trim();
   createPeopJson['MiddleName'] = '';
   createPeopJson['Title'] = this.addPeopleForm.value.smsTitle?.trim();
    createPeopJson['Type'] = this.addPeopleForm.value.temptype;
    createPeopJson['Status'] = this.addPeopleForm.value.Status;
    createPeopJson['StatusName'] = this.addPeopleForm.value.StatusName;
    createPeopJson['ReasonId'] = this.addPeopleForm.value.ReasonId;
    createPeopJson['ReasonName'] = this.addPeopleForm.value.ReasonName;
    createPeopJson['Email'] = emailJson;
    if (this.phoneArr) {
      createPeopJson['Phone'] = phoneJson;
    }
    if (this.socialArr) {
      createPeopJson['SocialProfile'] = socialJson;
    }
    if (this.locationArr != null || this.locationArr != undefined ) {
      createPeopJson['Address'] = this.locationArr;
    }

    this.systemSettingService.createQuickCandidate(createPeopJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addPeopleForm.reset();
          document.getElementsByClassName("add_people")[0].classList.remove("animate__fadeInDownBig")
          document.getElementsByClassName("add_people")[0].classList.add("animate__fadeOutUpBig");
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
    @Who: Renu
    @When: 26-May-2021
    @Why: EWM-1586
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);

    document.getElementsByClassName("add_people")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("add_people")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }

  /*
    @Type: File, <ts>
    @Name: addEmail
    @Who: Renu
    @When: 26-May-2021
    @Why: EWM-1586
    @What: for opening the email dialog box
  */
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

  addEmail() {
    this.addPeopleForm.get('emailmul').reset();
    let mode;
    if (this.emails.length == 0) {
      mode = 'Add';
      }else{
      mode = 'edit';
      }
    const dialogRef = this.dialog.open(AddemailComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ emailmul: this.addPeopleForm.get('emailmul'), emailsChip: this.emails ,mode:mode,  pageName: 'genralInfoPage', values: {Email:this.emails}}),
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
            email: this.emailArr[j]['EmailId'], type: this.emailArr[j]['Type'], TypeName: this.emailArr[j]['Name'], Name: this.emailArr[j]['Name'],
            IsDefault: this.emailArr[j]['IsDefault'],Type: this.emailArr[j]['Type'],EmailId: this.emailArr[j]['EmailId']
          })
          this.patch(this.emailArr[j]['EmailId'],this.emailArr[j]['Type']);
          this.emailValid = true;
        }      
      }else{
        this.patch(null,null);
        if(this.emails?.length==0){
          this.emailValid = false;
          //@maneesh @EWM-12097 handel email is required when prss cancel button on add email popup
          this.addPeopleForm.controls['emailmul'].setErrors({ 'required': true });
        }
      }
       //<!-------@suika @EWM-10662 @to check email type main exist or not-------------------------------->
      //@maneesh @EWM-12097 comment handel email is required when prss cancel button on add email popup
      // let mainTypeEmail = this.emails.filter(el => (el.IsDefault == true));
      // if(mainTypeEmail?.length==0){
      // this.addPeopleForm.controls['emailmul'].setErrors({ 'mainEmail': true });
      // } 
    })

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	
    
    //console.log(this.addPeopleForm,"this.addPeopleForm");
  }

  findObject(arr, value) {
    if (Array.isArray(arr)) {
        return arr.find((value) => {
            return value.IsDefault === 1;
        });
    }
}

 //<!-------@suika @EWM-10662 @patch value in form control-------------->
  patch(emailId, typeId) {
    const control = <FormGroup>this.addPeopleForm.get('emailmul');
    const childcontrol = <FormArray>control.controls.emailInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValues(emailId, typeId))
    this.addPeopleForm.patchValue({
      emailmul: childcontrol
    })
  }

 //<!-------@suika @EWM-10662 @patch value in form control-------------->
  patchValues(emailId, typeId) {
    return this.fb.group({
      EmailId: [emailId],
      Type: [typeId]
    })
  }


  /*
   @Type: File, <ts>
   @Name: addPhone
   @Who: Renu
   @When: 26-May-2021
   @Why: EWM-1586
   @What: for opening the phone dialog box
 */

  addPhone() {
    this.addPeopleForm.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ phonemul: this.addPeopleForm.get('phonemul'), phoneChip: this.phone }),
      panelClass: ['xeople-modal', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.phoneArr = res.data;
      if (this.phoneArr) {
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
   @Name: addSocialPofileName
   @Who: Renu
   @When: 26-May-2021
   @Why: EWM-1586
   @What: for opening the social dialog box
 */
  addSocialPofileName() {
    const dialogRef = this.dialog.open(AddSocialComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ socialmul: this.addPeopleForm.get('socialmul'), socialChip: this.socials }),
      panelClass: ['quick-modalbox', 'add_SocialPofile', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data != '' || res.data != null) {
        this.socialArr = res.data;
        if (this.socialArr) {
          for (let j = 0; j < this.socialArr.length; j++) {
            this.socials.push({ link: this.socialArr[j]['ProfileURL'], type: this.socialArr[j]['TypeId'] })
          }
        }
        this.addPeopleForm.get('socialmul').reset();
      } else {
        this.addPeopleForm.get('socialmul').get('socialInfo').setErrors(null);
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
   @Who: Renu
   @When: 26-Apr-2021
   @Why: ROST-1586
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
    @Name: tenantUserTypeList
    @Who: Renu
    @When: 26-Apr-2021
    @Why: ROST-1586
    @What: To get Data from people type will be from user types where type is People
    */
  getStatusBaseUserType(userType) {
    this.addPeopleForm.get('tempStatus').reset();
    this.systemSettingService.getStatusUserType(userType).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data[0].statuses;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
    @Type: File, <ts>
    @Name: tenantUserTypeList
    @Who: Renu
    @When: 26-Apr-2021
    @Why: ROST-1586
    @What: To get Data from people type will be from user types where type is People
    */
  tenantUserTypeList() {
    let groupName = 'people';
    let isExcluded = true;
    this.systemSettingService.getAllTenantUserPeopleType(groupName, isExcluded).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.userTypeList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
     @Type: File, <ts>
     @Name: addAddress
     @Who: Anup
     @When: 21-Dec-2021
     @Why: Ewm-4071 Ewm-4238
     @What: To get Data from address of people
     */
  addAddress() {
    const dialogRef = this.dialog.open(QuicklocationComponent, {
      // maxWidth: "700px",
      // width: "90%",
      data: new Object({ address: this.addressData }),
      panelClass: ['xeople-modal', 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res != null) {
        this.addPeopleForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap)
        this.addressData = res.data
        this.locationArr = [res.data];
      }
      if (res.data === undefined) {
        this.locationArr = null;
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
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
  @Type: File, <ts>
  @Name: handleAddressChange function
  @Who: Anup singh
  @When: 16-June-2021
  @Why: EWM-1662 EWM-1916
  @What: For Address get from input field
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

  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.addPeopleForm.patchValue(
        {
          ReasonId: null,
          ReasonName: null
        }
      )
      // this.addPeopleForm.get("ReasonId").setErrors({ required: true });
      this.addPeopleForm.get("ReasonId").markAsTouched();
      this.addPeopleForm.get("ReasonId").markAsDirty();
    }
    else {
      this.addPeopleForm.get("ReasonId").clearValidators();
      this.addPeopleForm.get("ReasonId").markAsPristine();
      this.selectedReason = data;
      this.addPeopleForm.patchValue(
        {
          ReasonId: data.Id,
          ReasonName: data.ReasonName,
        }
      )
    }
  }

  onManageStatuschange(data) {
    this.selectedReason = null ;
    if (data == null || data == "") {
      this.selectedStatus = null;
      this.addPeopleForm.patchValue(
        {
          Status: null,
          ReasonId: null,
        }
      )
      this.addPeopleForm.get("Status").setErrors({ required: true });
      this.addPeopleForm.get("Status").markAsTouched();
      this.addPeopleForm.get("Status").markAsDirty();
      this.dropDownReasonConfig['IsManage'] = '';
      this.dropDownReasonConfig['apiEndPoint'] = '';//this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);
    }
    else {
      this.addPeopleForm.get("Status").clearValidators();
      this.addPeopleForm.get("Status").markAsPristine();
      this.selectedStatus = data;
      this.addPeopleForm.patchValue(
        {
          Status: data.Id,
          ReasonId: data.ReasonId,
          Reasonname: data.Reasonname
        }
      )
      this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=' + this.employeeID + '&statusId=' + this.selectedStatus.Id + '&GroupCode=PEOPLE';
      this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=employee';
      this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);
    }
    
  }

  /*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 10-jan-2023
   @Why: EWM-10107
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
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
