/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 11-Aug-2021
  @Why: EWM-2424/2426
  @What: this section handle all general informationcomponent related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickpeopleService } from 'src/app/modules/EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AddphonesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addphones/addphones.component';
import { CandidateLocationComponent } from './candidate-location/candidate-location.component';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { GeneralInformationMaster } from 'src/app/modules/EWM.core/shared/datamodels/candidate-generalinformation';
import { ActivatedRoute } from '@angular/router';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { AddSocialComponent } from 'src/app/modules/EWM.core/shared/quick-modal/add-social/add-social.component';
import { DRP_CONFIG } from '@app/shared/models/common-dropdown';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss']
})
export class GeneralInformationComponent implements OnInit {
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

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('phoneInput') phoneInput: ElementRef<HTMLInputElement>;
  @ViewChild('profileInput') profileInput: ElementRef<HTMLInputElement>;
  addForm: FormGroup;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public emailPattern:any;
  public numberPattern:any;
  public specialcharPattern:any;
  public statusList: any = [];
  public urlpattern:any;
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
  public generalInformationData: any;
  public oldPatchValues: any;
  public patchEmailID;
  GeneralInformationFor: any;
  mainEmailId:string;
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public dropDownStatusConfig: customDropdownConfig[] = [];
  public selectedReason: any = {};
  public selectedStatus: any = {};
  public activeStatus:string;
  resetFormSubjectSubExperties: Subject<any> = new Subject<any>();
  StatusIdData:any;
  StatusNameData:string;
  loading: boolean;
  groupCode: any;
  UserType: any;
  dirctionalLang;
  public namePattern =  new RegExp(/^[a-zA-Z\s]{1,50}$/);
  public candidateheaderData:boolean=true;
  //who:Ankit Rawat,what:EWM-16075 Add new dropdown control Recruiter,When:21 Feb 2024
  public RecruiterDropdownConfig: DRP_CONFIG;
  public selectedRecruiterItem: any = [];
  public RecruiterList:[]=[];
  public currentMenuWidth: number;
  public maxMoreLengthForCandidateRecruiters:number=5;

  constructor(public dialogRef: MatDialogRef<GeneralInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private countryMasterService: CountryMasterService,
    private textChangeLngService: TextChangeLngService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private profileInfoService: ProfileInfoService, private quickpeopleService: QuickpeopleService,private serviceListClass: ServiceListClass,
    public _GeneralInformationService: GeneralInformationService, private router: ActivatedRoute, private appSettingsService: AppSettingsService) {
    this.candidateId = data.candidateId;
    this.GeneralInformationFor = data.GeneralInformationFor;
    this.UserType = data.UserType;
     // --------@When: 03-April-2023 @who:Adarsh singh @why: EWM-10209 --------
     this.emailPattern = this.appSettingsService.emailPattern;
     this.numberPattern = this.appSettingsService.numberPattern;
     this.specialcharPattern = this.appSettingsService.namePattern;
     this.urlpattern = this.appSettingsService.urlpattern;
    // end 
    // @Who: Bantee Kumar,@Why:EWM-10891,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.

    this.groupCode=data.groupCode;
    if(data.formType){
    this.activeStatus=data.formType;
    }

    this.dropDownReasonConfig['IsDisabled'] = false;
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList+'?StatusId=';
    this.dropDownReasonConfig['placeholder'] = 'label_MenuReason';
    this.dropDownReasonConfig['IsManage'] = '';
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;

    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + '?GroupId='+this.groupCode + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownStatusConfig['placeholder'] = 'label_status';
    this.dropDownStatusConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId='+this.groupCode;
    this.dropDownStatusConfig['IsRequired'] = true;
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['bindLabel'] = 'Code';
    this.dropDownStatusConfig['multiple'] = false;


    this.addForm = this.fb.group({
      orgId: [''],
      //  @Who: maneesh, @When: 12-jan-2023,@Why: EWM-10108 addnoWhitespaceValidator  Validators.pattern(this.specialcharPattern)
      // who:maneesh,what:ewm-13531 for change specialcharPattern ,when:24/07/2023
      //  @Who: Ankit Rawat, @When: 02-Feb-2024, @Why: EWM-15523-EWM-15895 (Allow some special characters on Name)
      firstName: ['', [Validators.required, Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50),this.noWhitespaceValidator()]],
      lastName: ['', [Validators.required, Validators.pattern(this.appSettingsService.specialcharNamePattern), Validators.maxLength(50),this.noWhitespaceValidator()]],
      CurrentCompany: [''],
      JobTitle: ['',[Validators.maxLength(50)]],
      CurrentLocation: [''],
      CurrentSalary: [''],
      NoticePeriod: ['', [, Validators.maxLength(4), Validators.pattern(this.numberPattern)]],
      SalaryUnit: [''],
      Currency: [''],
      IsImmediateAvailable: [''],
      Status: [[], Validators.required],
      StatusName: [''],
      ReasonId: [[],],
      Reasonname: [''],
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
      socialmul: this.fb.group({
        socialInfo: this.fb.array([this.createSocial()])
      }),
    });
  }

  ngOnInit() {
    //who:Ankit Rawat,what:EWM-16075 Add new dropdown control Recruiter,When:21 Feb 2024
    this.selectedRecruiterItem=[]
    this.dropdownConfigRecruiters();
    this.getGeneralInformation();
    //this.getInternationalization();
    this.currentMenuWidth = window.innerWidth;
    this.screenMediaQuiryForCandidateRecruiters();
  }
  
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    // this.detectScreenSize();
    this.screenMediaQuiryForCandidateRecruiters()
  }

  /* 
   @Type: File, <ts>
   @Name: getGeneralInformation function
   @Who: Nitin Bhati
   @When: 11-Aug-2021
   @Why: EWM-2424
   @What: For setting value in the edit form
  */
  getGeneralInformation() {
    this._GeneralInformationService.getGeneralInformationList('?candidateid=' + this.candidateId).subscribe(
      (data: GeneralInformationMaster) => {
        if (data.HttpStatusCode == 200) {
          this.generalInformationData = data.Data
          // @Who: Ankit Rawat, @When: 20-Feb-2024,@Why: EWM-16075-EWM-16165 (set recruiter value to view selected items in edit mode)
          const transformedCandidates=data.Data?.RecruiterDetails?.map(item=>({
                 'CandidateId':item.CandidateId,
                 'UserId':item.RecruiterId,
                 'UserName':item.RecruiterName
           }));
           this.selectedRecruiterItem=transformedCandidates?.length>0?transformedCandidates[0]:null; //who:Renu,what:EWM-18743 EWM-18822 converted to single selection,When:20 Nov 2024
          this.generalInformationData.Phone = this.generalInformationData.Phones;        
          this.generalInformationData?.Phone?.forEach(element => {
            element['phoneCodeName']=element.PhoneCode;
          });
          this.oldPatchValues = this.generalInformationData;
          this.generalInformationData?.Phone?.forEach(element => {
            element['phoneCodeName']=element.PhoneCode;
          });
          this.PhonePopUpData = this.generalInformationData?.Phone;
          let social = this.generalInformationData?.SocialProfile;
          if (social) {
            social.forEach(element => {
              this.socials.push({
                ProfileURL: element.ProfileUrl,
                TypeId: element.ProfileTypeId,
              })
            });
          }
          
          this.addForm.patchValue({
            firstName: data['Data'].FirstName,
            lastName: data['Data'].LastName,
            Email: data['Data'].Email,
            PhoneNumber: data['Data'].PhoneNumber,
            CurrentCompany: data['Data'].CurrentCompany,
            JobTitle: data['Data'].JobTitle,
            TotalExperience: data['Data'].TotalExperience,
            CurrentLocation: data['Data'].AddressLinkToMap,//CurrentLocation,
            CurrentSalary: data['Data'].Salary,
            Currency: data['Data'].Currency,
            SalaryUnit: data['Data'].SalaryUnit,
            NoticePeriod: data['Data'].NoticePeriod
          });

          if (data.Data?.IsImmediateAvailable == 1) {
            this.addForm.patchValue({
              IsImmediateAvailable: true
            })
          } else {
            this.addForm.patchValue({
              IsImmediateAvailable: false
            })
          }
          if (data['Data'].CountryId === 0) {
            this.getInternationalization();
          } else {
            this.commonserviceService.ondefultCountry.next(data['Data'].CountryId);
          }
          this.patch(data['Data'].Email, data['Data'].EmailTypeId);
        /*@Who: Nitin Bhati,@When: 01-March-2022,@Why: EWM-10722,@What: For showing multiple emailId's and remove unused values*/
          if (data['Data'].Email != '') {
            if (data['Data'].Emails?.length > 0) {
              let oldPatchEmailValues = data['Data']?.Emails;
        /*@Who: Bantee kumar,@When: 10-08-2023,@Why: EWM-13746,@What: Main Email Id should be dynamic*/

              // oldPatchEmailValues.sort((a,b) => b.IsDefault - a.IsDefault);
              oldPatchEmailValues.forEach(element => {
                this.emails.push({
                  IsDefault: element.IsDefault,
                  Name: element.TypeName,
                  EmailId: element.EmailId,
                  Type: element.Type,
                  IsMainEmailEditable:element.IsMainEmailEditable

                })
               });
            }
          }
         this.mainEmailId = this.generalInformationData.EmailTypeId;
          if (data['Data'].PhoneNumber != '') {
            if (data['Data'].Phones.length > 0) {
              let oldPatchPhoneValues = data['Data'].Phones;
              oldPatchPhoneValues.forEach(element => {
                this.phone.push({
                  phone: element.PhoneNumber,
                  type: element.Type,
                  Name: element.TypeName,
                  IsDefault: element.IsDefault,
                  PhoneCode: parseInt(element.CountryId),
                  phoneCodeName: element.PhoneCode
                })
              });
            }
          }

          if(data['Data'].Status!=0){
            this.selectedStatus = {'Id':data['Data'].Status,StatusName:data['Data'].StatusName }
            this.onManageStatuschange(this.selectedStatus );
          }         
          if(data['Data'].ReasonId!=0){
            this.selectedReason = {'Id':data['Data'].ReasonId,Reasonname:data['Data'].Reasonname }
            this.onManageReasonchange(this.selectedReason );
          }           
          this.addForm.controls["CurrentCompany"].disable();
          // @suika @EWM-14149 @Whn-09-09-2023 
         // this.addForm.controls["JobTitle"].disable();
          this.addForm.controls["CurrentLocation"].disable();
          this.addForm.controls["CurrentSalary"].disable();
          this.addForm.controls["Currency"].disable();
          this.addForm.controls["SalaryUnit"].disable();

        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString())
        }
      },
      err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  patch(emailId, typeId) {
    const control = <FormGroup>this.addForm.get('emailmul');
    const childcontrol = <FormArray>control.controls.emailInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValues(emailId, typeId))
    this.addForm.patchValue({
      emailmul: childcontrol
    })
  }

  patchPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault) {
    const control = <FormGroup>this.addForm.get('phonemul');
    const childcontrol = <FormArray>control.controls.phoneInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValuesPhone(PhoneNumber, Type, phoneCode, phoneCodeName, IsDefault))
    this.addForm.patchValue({
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

  getCountryInfo() {
    this.profileInfoService.fetchCountryInfo(this.pageNumber, this.pageSize).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.countryList = repsonsedata['Data'];
        }
      }, err => {
      })
  }

  /*
   @Type: File, <ts>
   @Name: createemail
   @Who: Nitin Bhati
   @When: 11-Aug-2021
   @Why: EWM-2426
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
   @Who: Nitin Bhati
   @When: 11-Aug-2021
   @Why: EWM-2426
   @What: when user click on add to create form group with same formcontrol
   */

  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      phoneCode: [''],
      phoneCodeName: [],
      IsDefault: [],
    });
  }
  /*
   @Type: File, <ts>
   @Name: add
   @Who: Nitin Bhati
   @When: 11-Aug-2021
   @Why: EWM-2426
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
  @When: 11-Aug-2021
  @Why: EWM-2426
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
  @Who: Nitin Bhati
  @When: 11-Aug-2021
  @Why: EWM-2426
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
    @When: 11-Aug-2021
    @Why: EWM-2426
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(): void {
    if (this.addForm.invalid) {
      return;
    }
    let formValue = this.addForm.value?.IsImmediateAvailable;
    let createPeopJson = {};
    let emailJson = [];
    let phoneJson = [];
    createPeopJson['GeneralInformationFor'] = this.GeneralInformationFor;
    createPeopJson['UserType'] = this.UserType;
    createPeopJson['CandidateId'] = this.candidateId;
     // who:maneesh,what:ewm-13531 for trim data ,when:24/07/2023 
    createPeopJson['FirstName'] = this.addForm.value.firstName.trim();
    createPeopJson['LastName'] = this.addForm.value.lastName.trim();
    createPeopJson['NoticePeriod'] = parseInt(this.addForm.value.NoticePeriod);
    createPeopJson['ReasonId'] = parseInt(this.addForm.value.ReasonId);
    createPeopJson['Reasonname'] = this.addForm.value.Reasonname;
    createPeopJson['SocialProfile'] = this.socials;
    // @suika @EWM-14149 @Whn-09-09-2023 add job title in post request 
    createPeopJson['JobTitle'] = this.addForm.value.JobTitle.trim();
    if (this.addForm.value.StatusName != null && this.addForm.value.StatusName != undefined) {
      createPeopJson['StatusName'] = this.addForm.value.StatusName;
      createPeopJson['Status'] = this.addForm.value.Status;
    } else {
      createPeopJson['StatusName'] = '';
      createPeopJson['Status'] = '';
    }
    createPeopJson['OldStatusName'] =  this.generalInformationData?.StatusName;
    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "Type": elem.Type, "EmailId": elem.EmailId, "IsDefault": elem.IsDefault ,"IsMainEmailEditable":elem.IsMainEmailEditable});
    });
    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({ "Type": elem.type, "PhoneNumber": elem.phone, "IsDefault": elem.IsDefault, "PhoneCode": elem.PhoneCode.toString(),"PhoneCodeName": elem.phoneCodeName, "CountryId": elem.PhoneCode });
    });
    createPeopJson['Email'] = emailJson;
    createPeopJson['Phone'] = phoneJson;
    if (formValue == true) {
      createPeopJson['IsImmediateAvailable'] = 1;
    } else {
      createPeopJson['IsImmediateAvailable'] = 0;
    }
   //who:Ankit Rawat,what:EWM-16075 mapped Recruiter with candidate,When:21 Feb 2024
    // if(this.selectedRecruiterItem?.length>0){
    //   createPeopJson['Recruiters']=this.selectedRecruiterItem?.map(item => item.UserId);
    // }
    if (this.selectedRecruiterItem && typeof this.selectedRecruiterItem === 'object' && Object?.keys(this.selectedRecruiterItem)?.length>0){
      createPeopJson['Recruiters']=[this.selectedRecruiterItem?.UserId];//who:Renu,what:EWM-18743 EWM-18822 converted to single selection,When:20 Nov 2024
    }
    this._GeneralInformationService.updateGeneralInformation(createPeopJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.commonserviceService?.updateCandidateHeaderdata?.next(this.candidateheaderData);//who:maneesh,what:ewm-14825 for update candidate header data ,when:23/10/2023
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
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
  }

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2426
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    // Close the dialog, return false
    
    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /* 
    @Type: File, <ts>
    @Name: addEmail
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2426
    @What: for opening the email dialog box
  */
  addEmail() {
    this.addForm.get('emailmul').reset();
    //@who:Priti;@when:15-nov-2021;@why:EWM-3055
    let actionEmail;
    if (this.emails.length == 0) {
      actionEmail = 'Add';
      }else{
      actionEmail = 'edit';
      }
    
   /*@Who: Nitin Bhati,@When: 02-March-2022,@Why: EWM-10722,@What: pass some more parameter for showing all email ids's*/
         /*@Who: Bantee kumar,@When: 26-july-2023,@Why: EWM-13328,@What: Main Email id across system should be editable*/

    const dialogRef = this.dialog.open(AddemailComponent, {
      maxWidth: "700px",
      data: new Object({ emailmul: this.addForm.get('emailmul'), emailsChip: this.emails, mode: 'edit', pageName: 'genralInfoPage', values: {Email:this.emails} }),
      panelClass: ['quick-modalbox', , 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.emailArr = res.data;
       if (this.emailArr) {
         /*@Who: Nitin Bhati,@When: 02-March-2022,@Why: EWM-10722,@What: for patch values in array using for loop*/
        this.emails = [];
        // this.emailArr.sort((a, b) => b.IsDefault - a.IsDefault);

        for (let j = 0; j < this.emailArr.length; j++) {
          this.emails.push({
            IsDefault: this.emailArr[j]['IsDefault'],
            Name: this.emailArr[j]['Name'],
            EmailId: this.emailArr[j]['EmailId'],
            Type: this.emailArr[j]['Type'],
            IsMainEmailEditable:this.emailArr[j].hasOwnProperty('IsMainEmailEditable') ? this.emailArr[j]['IsMainEmailEditable'] : 1
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
   @Name: addPhone
   @Who: Nitin Bhati
   @When: 11-Aug-2021
   @Why: EWM-2426
   @What: for opening the phone dialog box
 */
  public PhonePopUpData = [];
  addPhone() {
    this.addForm.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {
      maxWidth: "700px",
      data: new Object({ phonemul: this.addForm.get('phonemul'), phoneChip: [], mode: 'edit', values: { Phone: this.PhonePopUpData } }),
      panelClass: ['quick-modalbox', , 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
     
      this.phoneArr = res?.data;
      if (this.phoneArr) {
        this.PhonePopUpData = this.phoneArr;
        this.phone = [];
        for (let j = 0; j < this.phoneArr.length; j++) {
          this.phone.push({
            phone: this.phoneArr[j]['PhoneNumber'],
            type: this.phoneArr[j]['Type'],
            Name: this.phoneArr[j]['Name'],
            IsDefault: this.phoneArr[j]['IsDefault'],
            PhoneCode: this.phoneArr[j]['PhoneCode'],
            CountryId:this.phoneArr[j]['CountryId'],
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
    @Name: tenantUserTypeList
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2426
    @What: To get Data from people type will be from user types where type is People
    */
  getStatusBaseUserType(userType) {
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
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2426
    @What: To get Data from people type will be from user types where type is People
    */
  tenantUserTypeList() {
    let groupName = 'Candidate';
    let isExcluded = true;
    this.systemSettingService.getAllTenantUserPeopleType(groupName, isExcluded).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.userTypeList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        }
      }, err => {

      })
  }
  /*
     @Type: File, <ts>
     @Name: addAddress
     @Who: Nitin Bhati
     @When: 11-Aug-2021
     @Why: EWM-2426
     @What: To get Data from address of people
     */
  addAddress() {
    const dialogRef = this.dialog.open(CandidateLocationComponent, {
      maxWidth: "700px",
      data: new Object({ address: this.candidateId, AutoFilldata: this.addressBarData,isGeneralInfo:true }),
      panelClass: ['quick-modalbox', , 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.addForm.controls['CurrentLocation'].setValue(res.data.AddressLinkToMap);//@who:Priti;@when:12-Nov-2021;@why:EWM-3459;
      this.locationArr = [res.data];
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
   @Who: Nitin Bhati
   @When: 11-Aug-2021
   @Why: EWM-2426
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
      this.addForm.patchValue(
        {
          ReasonId: null,
          Reasonname: null
        }
      )
      this.addForm.get("ReasonId").markAsTouched();
      this.addForm.get("ReasonId").markAsDirty();
    }
    else if(data.Id === null){
      this.selectedReason = null;
      this.addForm.patchValue(
        {
          ReasonId: null,
        }
      )
    }
    else {
      this.addForm.get("ReasonId").clearValidators();
      this.addForm.get("ReasonId").markAsPristine();
      this.selectedReason = data;
      this.addForm.patchValue(
        {
          ReasonId: data.Id,
          Reasonname: data.ReasonName,
        }
      )
    }
  }

  onManageStatuschange(data) {
    this.selectedReason = null ;
    if (data == null || data == "") {
      this.selectedStatus = null;
      this.addForm.patchValue(
        {
          Status: null,
          ReasonId: null,
          StatusName: null,
        }
      )
      this.addForm.get("Status").setErrors({ required: true });
      this.addForm.get("Status").markAsTouched();
      this.addForm.get("Status").markAsDirty();
      this.dropDownReasonConfig['IsManage'] = '';
    }
    else {
      this.addForm.get("Status").clearValidators();
      this.addForm.get("Status").markAsPristine();
      this.selectedStatus = data;
      this.addForm.patchValue(
        {
          Status: data.Id,
          StatusName: data.StatusName,  //When: 14-March-2024 @who:Ankit Rawat @why:Status is undefine issue, not able to update record due to status ID and Name. --------
          ReasonId: data.ReasonId,
          Reasonname: data.Reasonname
        }
      )
      // --------@When: 14-April-2023 @who:Adarsh singh @why: EWM-11938 --------
      let type =  this.GeneralInformationFor === 'EMPL' ? 'employee' : 'candidate';
      // End
      this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId='+this.groupCode+'&statusId='+ this.selectedStatus.Id+'&GroupCode='+this.UserType;
      this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id + '&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType='+type;
      this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);
    }
    
    
    
  }

    /* 
   @Type: File, <ts>
   @Name: addSocialPofileName
   @Who: Adarsh singh
   @When: 25-Oct-2022
   @Why: EWM-9259
   @What: for opening the social dialog box
 */
addSocialPofileName() {
  const dialogRef = this.dialog.open(AddSocialComponent, {
    data: new Object({ socialmul: this.addForm.get('socialmul'), socialChip: this.socials, IsDisabled: true, mode: 'edit', values: { socials: this.socials }}),
    panelClass: ['xeople-modal', 'add_SocialPofile', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    this.socialArr = res.data;
    if (this.socialArr) {
      this.socials = [];
      for (let j = 0; j < this.socialArr.length; j++) {
        this.socials.push({ ProfileURL: this.socialArr[j]['ProfileURL'], TypeId: this.socialArr[j]['TypeId'] })
      }
    }
  });

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
  @Name: createSocial
   @Who: Adarsh singh
   @When: 25-Oct-2022
  @Why: ROST-9259
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
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 12-jan-2023
   @Why: EWM-10108
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

//  @Who: Ankit Rawat, @When: 20-Feb-2024,@Why: EWM-16075-EWM-16165 (Add new control Recruiter on edit mode)
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
   //  @Who: Ankit Rawat, @When: 20-Feb-2024,@Why: EWM-16075-EWM-16165 (Add new control Recruiter on edit mode)
   onManageRecruiterchange(data){
    this.selectedRecruiterItem = null ;
    if (data == null || data == "") {
      this.selectedRecruiterItem = null;
      this.addForm.patchValue(
        {
          CandidateRecruiters: null
        }
      )
      this.addForm.get("CandidateRecruiters")?.setErrors({ required: false });
    }
    else {
      //this.addForm.get("CandidateRecruiters").clearValidators();
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
