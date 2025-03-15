/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 12-Jul-2021
  @Why: EWM-2094
  @What: this section handle all quick Add Candidate component related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl,FormArray, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { RxwebValidators, required } from '@rxweb/reactive-form-validators';
import { QuicklocationComponent } from '../addlocation/quicklocation.component';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ProfileInfoService } from '../../services/profile-info/profile-info.service';
import { QuickpeopleService } from '../../services/quick-people/quickpeople.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { customDropdownConfig } from '../../datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { PushcandidateToEohFromPopupComponent } from '@app/modules/xeople-job/job-screening/pushcandidate-to-eoh-from-popup/pushcandidate-to-eoh-from-popup.component';
import { AlertDialogComponent } from '@app/shared/modal/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-quick-candidate',
  templateUrl: './quick-candidate.component.html',
  styleUrls: ['./quick-candidate.component.scss']
})
export class QuickCandidateComponent implements OnInit {


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
  public addressBarData: Address;
  resetFormSubjectSubExperties: Subject<any> = new Subject<any>();


  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput: ElementRef<HTMLInputElement>;
  addCandidateForm: FormGroup;
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
  public selectType: any;
  public countryId: number;
  dirctionalLang;
  public addressData: any;
  public isCandidate: false;
  public selectedReason: any = {};
  public selectedStatus: any = {};
  candidateID: any;
  CandidateStatusActiveKey: string;   // <!---------@When: 03-Feb-2023 @who:suika @why: EWM-10681 EWM-10814 for default value of status--------->
  public activeStatus: string='Active';
  public common_DropdownC_Config:DRP_CONFIG;
  public selectedOrgName: any = {};
  public OrganizationName:string;
  public common_DropdownStatus_Config:DRP_CONFIG;
  public common_DropdownReason_Config:DRP_CONFIG;
  //who:Ankit Rawat,what:EWM-16075 Add new dropdown control Recruiter,When:21 Feb 2024
  public RecruiterDropdownConfig: DRP_CONFIG;
  public selectedRecruiterItem: any = {};
  public currentMenuWidth: number;
  public maxMoreLengthForCandidateRecruiters:number=5;
  public candidateDefaultStatus:any=[];
  eohRegistrationCode: string;
  public IsEOHIntergrated: boolean=false;
  extractEnableCanCheck: number=0;
  IsXRCandidatePushedToEOH: number;
  saveShareStatus: boolean=false;
  brandAppSetting: any=[];
  EOHLogo: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<QuickCandidateComponent>, private countryMasterService: CountryMasterService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService, private serviceListClass: ServiceListClass,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private profileInfoService: ProfileInfoService, private quickpeopleService: QuickpeopleService, private appSettingsService: AppSettingsService,private quickJobService: QuickJobService) {
      this.emailPattern=this.appSettingsService.emailPattern;
    this.candidateID = this.appSettingsService.candidateID;
     // <!---------@When: 03-Feb-2023 @who:suika @why: EWM-10681 EWM-10814 for default value of status--------->
    this.CandidateStatusActiveKey = this.appSettingsService.CandidateStatusActiveKey;
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;

    this.addCandidateForm = this.fb.group({
      orgId: ['', [Validators.required]],
      //  @Who: maneesh, @When: 10-jan-2023,@Why: EWM-10107 addnoWhitespaceValidator
      //  @Who: Ankit Rawat, @When: 29-jan-2024,@Why: EWM-15577-EWM-15840 (Allow some special characters on First Name and Last Name)
      firstName: ['', [Validators.required, Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50),this.noWhitespaceValidator()]],
      lastName: ['', [Validators.required, Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50),this.noWhitespaceValidator()]],
    // who:maneesh,what:ewm-13511 for trim data this.noWhitespaceValidator() ,when:24/07/2023 
      smsTitle: ['', [Validators.maxLength(30)]], // who:maneesh,what:ewm-14682 for max length 30 ,when:10/10/2023 
      temptype: [{ value: [], disabled: true }, [Validators.required]],
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
        
        'AddressLinkToMap': ['', [ Validators.maxLength(250)]],
        
      }),
      CandidateRecruiters:[[],]

    });
    if (data?.isCandidate != undefined && data?.isCandidate != null) {
      this.isCandidate = data?.isCandidate;
    }

  }
  ngOnInit() {
    this.currentMenuWidth = window.innerWidth;
    this.dropdownConfig();
    //who:Ankit Rawat,what:EWM-16075 Recruiter dropdown configuration,When:20 Feb 2024
    this.screenMediaQuiryForCandidateRecruiters();
    this.dropdownConfigRecruiters();
    this.tenantUserTypeList();
    this.getInternationalization();
    this.getcandidateDefaultStatus();
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value == null) {
        this.OrganizationId = localStorage.getItem('OrganizationId')
        this.OrganizationName = localStorage.getItem('OrganizationName')//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 EWM-15785 fixed dropdown
      } else {
        this.OrganizationId = value;
      }   
    })
    this.addCandidateForm.patchValue({
      'orgId': this.OrganizationId
    })
    this.selectedOrgName={OrganizationId:this.OrganizationId,OrganizationName:this.OrganizationName}//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 fixed dropdown
       // <!---------@When: 03-Feb-2023 @who:suika @why: EWM-10681 EWM-10814 for default value of status--------->
    // this.selectedStatus =  {Id:this.CandidateStatusActiveKey,Code:this.activeStatus};//who:maneesh,what:ewm-14744 for send status name in payload,when:11/10/2023
    // this.onManageStatuschange(this.selectedStatus);
    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let EOHIntegrationSubscribe = JSON.parse(localStorage.getItem('EOHIntegration'));
    let eohRegistrationCode=otherIntegrations?.filter(res=>res?.RegistrationCode==this.eohRegistrationCode);
    this.IsEOHIntergrated =  eohRegistrationCode[0]?.Connected;
    this.extractEnableCanCheck= EOHIntegrationSubscribe?.candExtractEnable;

    const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople );
    this.EOHLogo=filteredBrands[0]?.logo;

  }
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    // this.detectScreenSize();
    this.screenMediaQuiryForCandidateRecruiters()
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
      EmailId: ['', [Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],

      // EmailId: ['', [Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(1), Validators.maxLength(100), RxwebValidators.unique()]],
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
      if (this.emails?.length == 0) {
        this.addCandidateForm.controls['emailmul'].setErrors({ 'required': true });
      }
      // who:maneesh,what: remove  main type email then error massage show,when:15/05/2023
      let mainTypeEmail = this.emails?.filter(el => (el.IsDefault == true));
      if(mainTypeEmail?.length==0){
      this.addCandidateForm.controls['emailmul'].setErrors({ 'mainEmail': true });
      }
    } else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
        this.phoneArr.splice(index, 1);
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
    if (this.addCandidateForm.invalid) {
      return;
    }
    let createPeopJson = {};
    let emailJson = [];
    let phoneJson = [];
    let socialJson = [];
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.type,"TypeName": elem.TypeName, "EmailId": elem.email, "IsDefault": elem.IsDefault });
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
// <!---------@When: 04-05-2023 @who:bantee @why: EWM-11847 EWM-11910 Automatically take a space in the first name when the user edits the general information--------->
    createPeopJson['Organization'] = [this.addCandidateForm.value.orgId];
    createPeopJson['FirstName'] = this.addCandidateForm.value.firstName?.trim();
    createPeopJson['LastName'] = this.addCandidateForm.value.lastName?.trim();
    createPeopJson['MiddleName'] = '';   
    // who:maneesh,what:ewm-13511 for trim data ,when:24/07/2023 
    createPeopJson['Title'] = this.addCandidateForm.value.smsTitle?.trim();
    createPeopJson['Type'] = this.addCandidateForm.getRawValue().temptype;
    createPeopJson['Status'] = this.addCandidateForm.value.Status;
    createPeopJson['StatusName'] = this.addCandidateForm.value.StatusName;
    createPeopJson['ReasonId'] = this.addCandidateForm.value.ReasonId;
    createPeopJson['ReasonName'] = this.addCandidateForm.value.ReasonName;
    createPeopJson['Email'] = emailJson;
    if (this.phoneArr) {
      createPeopJson['Phone'] = phoneJson;
    }
    if (this.socialArr) {
      createPeopJson['SocialProfile'] = socialJson;
    }

    if (this.locationArr!= null || this.locationArr != undefined ) {
      createPeopJson['Address'] = this.locationArr;
    }
   //who:Ankit Rawat,what:EWM-16075 mapped Recruiter with candidate,When:20 Feb 2024
    // if(this.selectedRecruiterItem?.length>0){
    //   createPeopJson['Recruiters']=this.selectedRecruiterItem?.map(item => item.UserId);
    // }
    if (this.selectedRecruiterItem && typeof this.selectedRecruiterItem === 'object' && Object?.keys(this.selectedRecruiterItem)?.length>0){
      createPeopJson['Recruiters']=[this.selectedRecruiterItem.UserId];//who:Renu,what:EWM-18743 EWM-18822 converted to single selection,When:20 Nov 2024
    }
    this.systemSettingService.createQuickCandidate(createPeopJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addCandidateForm.reset();
          //this.popupClose();
          if(this.saveShareStatus){
            this.pushCandidateToEOH(responseData?.Data);
            this.popupClose();
          }else{
          this.popupClose();
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
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

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Renu
    @When: 26-May-2021
    @Why: EWM-1586
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  /*
    @Type: File, <ts>
    @Name: openQuickCandidateModal
    @Who: Satya Prakash
    @When: 08-Apr-2022
    @Why: EWM-5654 EWM-5887
    @What: add animation for modal
  */

  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
    if (this.isCandidate) {
      document.getElementsByClassName("quickCandidateModal")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("quickCandidateModal")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
    } else {
      document.getElementsByClassName("quickCandidateModal")[0].classList.remove("animate__fadeInDownBig")
      document.getElementsByClassName("quickCandidateModal")[0].classList.add("animate__fadeOutUpBig");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /* 
    @Type: File, <ts>
    @Name: addEmail
    @Who: Renu
    @When: 26-May-2021
    @Why: EWM-1586
    @What: for opening the email dialog box
  */
    emailValid:boolean=false;
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

  addEmail() {
    // who:maneesh,what:ewm-12097 when click on add button then required validation handel when:12/05/2023,
    this.addCandidateForm.get('emailmul').reset();
    let mode;
    if (this.emails.length == 0) {
      mode = 'Add';
      }else{
      mode = 'edit';
      }
   const dialogRef = this.dialog.open(AddemailComponent, {
      
      data: new Object({ emailmul: this.addCandidateForm.get('emailmul'), emailsChip: this.emails, mode:mode,  pageName: 'genralInfoPage', values: {Email:this.emails}}),
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
            email: this.emailArr[j]['EmailId'],
            type: this.emailArr[j]['Type'],
            IsDefault: this.emailArr[j]['IsDefault'],
            Name: this.emailArr[j]['Name'],
            EmailId: this.emailArr[j]['EmailId'],
            Type: this.emailArr[j]['Type']
          })
 //<!-------@maneesh @EWM-12097 @patch value in form control-------------->
          this.patch(this.emailArr[j]['EmailId'],this.emailArr[j]['Type']);
          this.emailValid = true;
        }
   
      }else{
        this.patch(null,null);
        if(this.emails?.length==0){
          this.emailValid = false;
          this.addCandidateForm.controls['emailmul'].setErrors({ 'required': true });

        }
      }
    }) 
    let mainTypeEmail = this.emails.filter(el => (el.IsDefault == true));
    if(mainTypeEmail?.length==0){
    this.addCandidateForm.controls['emailmul'].setErrors({ 'mainEmail': true });
    }  
   
  }
 //@maneesh @EWM-12097 @patch value in form control
 patch(emailId, typeId) {
  const control = <FormGroup>this.addCandidateForm.get('emailmul');
  const childcontrol = <FormArray>control.controls.emailInfo;
  childcontrol.clear();
  childcontrol.push(this.patchValues(emailId, typeId))
  this.addCandidateForm.patchValue({
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
  /* 
   @Type: File, <ts>
   @Name: addPhone
   @Who: Renu
   @When: 26-May-2021
   @Why: EWM-1586
   @What: for opening the phone dialog box
 */

  addPhone() {
      const dialogRef = this.dialog.open(AddphonesComponent, {
      data: new Object({ phonemul: this.addCandidateForm.get('phonemul'), phoneChip: [], mode: 'edit', values: { Phone: this.phoneArr } }),
      // data: new Object({ phonemul: this.addCandidateForm.get('phonemul'), phoneChip: this.phone,values: { Phone: this.phoneArr } }),
      panelClass: ['xeople-modal', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data!=null && res.data!='') {
        this.phoneArr = res.data;
           this.phone=[];
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
     
      data: new Object({ socialmul: this.addCandidateForm.get('socialmul'), socialChip: this.socials }),
      panelClass: ['xeople-modal', 'add_SocialPofile', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.socialArr = res.data;
      if (this.socialArr) {
        for (let j = 0; j < this.socialArr.length; j++) {
          this.socials.push({ link: this.socialArr[j]['ProfileURL'], type: this.socialArr[j]['TypeId'] })
        }
      }
    });
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
    this.systemSettingService.getStatusUserType(userType +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
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
    let groupName = 'Candidate';
    let isExcluded = true;
    this.systemSettingService.getAllTenantUserPeopleType(groupName, isExcluded).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.userTypeList = repsonsedata.Data;
          if (this.userTypeList.length > 0) {
            this.selectType = this.userTypeList[0].InternalCode;
            // this.getStatusBaseUserType(this.userTypeList[0].InternalCode);
          }

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
      @Type: File, <ts>
      @Name: getInternationalization
      @Who: Renu
      @When: 12-Jul-2021
      @Why: ROST-1748
      @What: To get defaukt setting data of user
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
     @Name: addAddress
     @Who: Renu
     @When: 13-June-2021
     @Why: ROST-1748
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
        this.addCandidateForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap)
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

  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.addCandidateForm.patchValue(
        {
          ReasonId: null,
          ReasonName: null
        }
      )
      this.addCandidateForm.get("ReasonId").markAsTouched();
      this.addCandidateForm.get("ReasonId").markAsDirty();
    }
    else {
      this.addCandidateForm.get("ReasonId").clearValidators();
      this.addCandidateForm.get("ReasonId").markAsPristine();
      this.selectedReason = data;
      this.addCandidateForm.patchValue(
        {
          ReasonId: data.Id,
          ReasonName: data.ReasonName
        }
      )
    }
  }

  onManageStatuschange(data) {
    this.selectedReason = null ;
    if (data == null || data == "") {
      this.selectedStatus = null;
      this.addCandidateForm.patchValue(
        {
          Status: null,
          ReasonId: null,
        }
      )
      this.addCandidateForm.get("Status").setErrors({ required: true });
      this.addCandidateForm.get("Status").markAsTouched();
      this.addCandidateForm.get("Status").markAsDirty();
    }
    else {
      this.addCandidateForm.get("Status").clearValidators();
      this.addCandidateForm.get("Status").markAsPristine();
      this.selectedStatus = data;      
      this.addCandidateForm.patchValue(
        {
          Status: data.Id,
          StatusName:data.Code,//who:maneesh,what:ewm-14744 for send status name in payload,when:11/10/2023
          ReasonId: data.ReasonId,
          Reasonname: data.Reasonname
        }
      )
      this.getReasonData() //@When: 23-jan-2024 @who:maneesh @why: EWM-15806 EWM-15785 get orgnazition dropdown data
      this.resetFormSubjectSubExperties.next(this.common_DropdownReason_Config);
    }
    
   
  }
 //  @Who: Ankit Rawat, @When: 20-Feb-2024,@Why: EWM-16075-EWM-16119 (Add new control Recruiter)
  onManageRecruiterchange(data){
    this.selectedRecruiterItem = null ;
    if (data == null || data == "") {
      this.selectedRecruiterItem = null;
      this.addCandidateForm.patchValue(
        {
          CandidateRecruiters: null
        }
      )
      //this.addCandidateForm.get("CandidateRecruiters").setErrors({ required: false });
    }
    else {
   //  this.addCandidateForm.get("CandidateRecruiters").clearValidators();
      this.selectedRecruiterItem = data;    
     /* this.addCandidateForm.patchValue(
        {
          Status: data.Id,
          StatusName:data.Code,//who:maneesh,what:ewm-14744 for send status name in payload,when:11/10/2023
          ReasonId: data.ReasonId,
          Reasonname: data.Reasonname,

        }
      )*/
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
 // <!---------@When: 23-jan-2024 @who:maneesh @why: EWM-15806 fixed dropdown--------->
 dropdownConfig(){
  this.common_DropdownC_Config = {
    API: this.serviceListClass.getOrganizationList,
    MANAGE: '',
    BINDBY: 'OrganizationName',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_organization',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'OrganizationId'
  }

  this.common_DropdownStatus_Config = {
    API: this.serviceListClass.getallStatusDetails + '?GroupId=' + this.candidateID +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo',
    MANAGE: '/client/core/administrators/group-master/status?groupId=' + this.candidateID,
    BINDBY: 'Code',
    REQUIRED: true,
    DISABLED: false,
    PLACEHOLDER: 'label_status',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: true,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'Id'
  }


}
//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 EWM-15785 fixed dropdown when select status then show reason
getReasonData(){
  this.common_DropdownReason_Config = {
    API: this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=candidate',
    MANAGE:'/client/core/administrators/group-master/reason?GroupId=' + this.candidateID + '&statusId='+ this.selectedStatus.Id+'&GroupCode=CANDIDATE',
    BINDBY: 'ReasonName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_MenuReason',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'Id'
  }
}
//@When: 23-jan-2024 @who:maneesh @why: EWM-15806 EWM-15785 get orgnazition dropdown data
getOrgData(data){
  if (data?.length == 0) {
    this.selectedOrgName = null;
    this.addCandidateForm.patchValue(
      {
        orgId:null
      });
    this.addCandidateForm.get("orgId").setErrors({ required: true });
    this.addCandidateForm.get("orgId").markAsTouched();
    this.addCandidateForm.get("orgId").markAsDirty();
  }
  else {
    this.addCandidateForm.get("orgId").clearValidators();
    this.addCandidateForm.get("orgId").markAsPristine();
    this.selectedOrgName = data;
    this.addCandidateForm.patchValue({
      orgId: data?.Id
    });
  }
}
 //  @Who: Ankit Rawat, @When: 20-Feb-2024,@Why: EWM-16075-EWM-16119 (Add new control Recruiter)
dropdownConfigRecruiters(){
  this.RecruiterDropdownConfig = {
    API: this.serviceListClass.userInvitationList +'?RecordFor=People',
    MANAGE: '',
    BINDBY: 'UserName',
    REQUIRED: false,
    DISABLED: false,
    PLACEHOLDER: 'label_CandidateRecruiter',
    SHORTNAME_SHOW: false,
    SINGLE_SELECETION: true,
    AT_LEAST_ONE_IS_NOT_REMOVABLE: false,
    IMG_SHOW: false,
    EXTRA_BIND_VALUE: '',
    IMG_BIND_VALUE:'ProfileImage',
    FIND_BY_INDEX: 'UserId'
    }
  }

   //  @Who: Ankit Rawat, @When: 22-Feb-2024,@Why: EWM-16075-EWM-16165 (Add new control Recruiter on edit mode-Resize code)
   screenMediaQuiryForCandidateRecruiters(){
    if (this.currentMenuWidth >= 240 && this.currentMenuWidth <= 767) {
      this.maxMoreLengthForCandidateRecruiters = 1;
    } else if (this.currentMenuWidth >= 767 && this.currentMenuWidth <= 900) {
      this.maxMoreLengthForCandidateRecruiters = 2;
    } else if (this.currentMenuWidth >= 900 && this.currentMenuWidth <= 1040) {
      this.maxMoreLengthForCandidateRecruiters = 3;
    } else {
      this.maxMoreLengthForCandidateRecruiters = 4;
    }
  }

  getcandidateDefaultStatus() {
    let ApplicationSource  = 'Form';
    this.systemSettingService.getCandidateSourceDefaultStatus(ApplicationSource).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.candidateDefaultStatus = repsonsedata?.Data;
          this.selectedStatus =  {Id:repsonsedata?.Data?.StatusId,Code:repsonsedata?.Data?.StatusName};//who:maneesh,what:ewm-14744 for send status name in payload,when:11/10/2023
          this.onManageStatuschange(this.selectedStatus);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  pushCandidateToEOH(candidateData:any){
      const dialogRef = this.dialog.open(PushcandidateToEohFromPopupComponent, {
        data: new Object({candidateId:candidateData?.CandidateId,IsOpenFor:'popUp',candidateName:candidateData?.FirstName+''+candidateData?.LastName}),
        panelClass: ['xeople-modal-full-screen', 'push-candidate-to-eoh-modal', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  } 

  onSaveShare(){
    this.saveShareStatus=true;
    this.onConfirm();
  }
  onSaveExit(){
    this.saveShareStatus=false;
    this.onConfirm();
  }
/*
  @Type: File, <ts>
  @Name: openQuickCandidateModal
  @Who: Satya Prakash
  @When: 08-Apr-2022
  @Why: EWM-5654 EWM-5887
  @What: add animation for modal
*/
  popupClose(){
    if (this.isCandidate) {
      document.getElementsByClassName("quickCandidateModal")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("quickCandidateModal")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(true); }, 200);
    } else {
      document.getElementsByClassName("quickCandidateModal")[0].classList.remove("animate__fadeInDownBig")
      document.getElementsByClassName("quickCandidateModal")[0].classList.add("animate__fadeOutUpBig");
      setTimeout(() => { this.dialogRef.close(true); }, 200);
    }
  }
  
}
