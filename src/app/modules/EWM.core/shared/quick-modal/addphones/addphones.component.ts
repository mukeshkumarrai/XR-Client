/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash Gupta
  @When: 21-May-2021
  @Why: EWM-1449 EWM-1583
  @What: this section handle all phone component related functions
*/

import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { QuickpeopleService } from '../../services/quick-people/quickpeople.service';
import { SystemSettingService } from '../../services/system-setting/system-setting.service';
import { ButtonTypes } from 'src/app/shared/models';

@Component({
  selector: 'app-addphones',
  templateUrl: './addphones.component.html',
  styleUrls: ['./addphones.component.scss']
})
export class AddphonesComponent implements OnInit {
  /*********************global variables decalared here **********************/
  public contactCategory: any = [];
  public numberPattern : string;//"^[1-9][0-9]*$";//"^[0-9]*$";
  mainExists: any;
  mainId: any;
  mainExistVal: boolean = false;
  phoneForm: FormGroup;
  phoneChip: any;
  phoneDuplicate: boolean = false;
  typeDuplicate: boolean = false;
  blankval: boolean;
  selectedMobileNumberValue: any = 0;
  countryId: any;
  countryCode: any = [];
  phoneName: any;
  mode: any;
  IsDisabled: boolean;
  mainDataId: any;
  mainName: any;
  mainTypeName: any;
  animationVar: any;
  countryList = [];
  isEditId:boolean=false;
  updatecase:boolean=false;
  hideAddButton:boolean=false;
  @ViewChild('target') private myScrollContainer: ElementRef;
  constructor(public dialogRef: MatDialogRef<AddphonesComponent>, private snackBService: SnackBarService, private translateService: TranslateService,
    private commonserviceService: CommonserviceService, public systemSettingService: SystemSettingService,
    public dialog: MatDialog, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private quickpeopleService: QuickpeopleService,
    private appSettingsService: AppSettingsService) {
      // @suika @whn 12-09-2023 @EWM-14300
      this.numberPattern = appSettingsService?.phoneNumberPattern;
    //this.phoneForm=data.phonemul;
    this.phoneChip = data?.phoneChip;
    this.updatecase = data?.updatecase; //this line use for only client summery when edit phone poup ewm-18042 by maneesh when:25/10/2024
    // <!----------@suika @whn 07-08-2023 handle eidt case in client phone details--------------------------------------------->
    if(data.iseditId!=undefined){
    this.isEditId=data?.iseditId;
    }
    this.mode = data?.mode;
    this.hideAddButton = data?.hideAddButton;//by maneesh ewm-18045
    if (data.phoneChip.length!= 0) {
      this.phoneForm = data.phonemul;
    }
    else {
      this.phoneForm = this.fb.group({
        phoneInfo: this.fb.array([this.createphone()]),
      });
    }

    if (this.phoneChip.length != 0) {
      this.phoneForm = this.fb.group({
        phoneInfo: this.fb.array([this.createphone()]),
      });
    }
  }

  ngOnInit(): void {
    this.getUserContactTypeCategory();
    if (this.mode != 'Edit' && this.mode != 'edit' && this.mode != 'View' && this.mode != 'view' || this.phoneChip.length == 0) { 
      this.getCodeValue();
    }
   
   
   
    /*this.phoneForm = this.fb.group({
         phoneInfo: this.fb.array([this.createphone()]) ,
       });*/

      this.disabledSelectedMainTypeInEditMode(this.data.pageName);
      this.animationVar = ButtonTypes;

  }

  getCodeValue(){
    this.commonserviceService.ondefultCountryObs.subscribe(value => {
      this.countryId = value;
      //@who:Priti;@when:05-jan-2022;@why:EWM-4285;@What: put condition and call api for default data 
      if (this.countryId == undefined || this.countryId == null) {
        this.systemSettingService.getInternalization().subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata['HttpStatusCode'] === 200) {
              this.countryId = Number(repsonsedata['Data']['CountryId']);
              this.getCountryCode(this.countryId);
            }
          });

      }
      else {
         this.getCountryCode(this.countryId); 
        }

    })
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
      PhoneNumber: ['', [Validators.required, Validators.pattern(this.numberPattern), Validators.maxLength(15), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      TypeName: [],
      phoneCode: [this.countryCode.Id, [Validators.required]],
      phoneCodeName: [this.countryCode.CountryCode]
    });
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
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
    return this.phoneForm.get("phoneInfo") as FormArray
  }

  /*
    @Type: File, <ts>
    @Name: addPhoneRow
    @Who: Renu
    @When: 26-May-2021
    @Why: ROST-1586
    @What: on add mulitple row
    */

  addPhoneRow(el) {    
    this.blankval = true;
    this.mainExistVal = false;
    this.phoneInfo().push(this.createphone());
    setTimeout(() => { this.myScrollContainer.nativeElement.scroll({
       top: this.myScrollContainer.nativeElement.scrollHeight, 
       left: 0, 
       behavior: 'smooth' }); }, 0);
  }

  /*
   @Type: File, <ts>
   @Name: removeRow
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: for removing the single row
   */

   // <!---------@When: 05-05-2023 @who:bantee kumar @why: EWM-12023 EWM-12096,  What :When a user enters a phone number, clicks the plus button to add a new number, and then removes that newly added field, the Add button and the Save button are disabled.-->
  removeRow(i: number) {
    const phoneFormArray = this.phoneForm.get("phoneInfo") as FormArray;
   let delElementId =  phoneFormArray.at(i).get('Type').value;
    this.phoneInfo().removeAt(i);
    this.blankval = false;
    // @suika @EWM-19-05-2023 to handle validation msges
    let mainIdArr= [];
    this.phoneInfo().controls.forEach(res=>{
      mainIdArr.push(res.value.Type);
    })
    if(mainIdArr.includes(this.mainId)){
      this.mainExistVal = false;      
    }else{
      this.mainExistVal = true;
    }   
    let phonedata = this.phoneForm.value.phoneInfo; 
    const findDuplicateVal = phonedata.filter(e => e.Type == this.mainId);
    if(findDuplicateVal?.length==1){
 // @suika @EWM-19-05-2023 to handle validation msges
 phoneFormArray.controls.forEach((res,key)=>{
  if(phoneFormArray.at(key).get('Type').value==delElementId){
    phoneFormArray.at(key).get('Type').setErrors(null);
    this.typeDuplicate = false;
    this.phoneDuplicate = false;
    phoneFormArray.at(key).get('Type').markAsUntouched();  
    phoneFormArray.at(key).get('Type').clearValidators();
    phoneFormArray.at(key).get('Type').markAsPristine();
    phoneFormArray.at(key).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
    phoneFormArray.at(key).get('PhoneNumber').setErrors(null);
    phoneFormArray.at(key).get('PhoneNumber').markAsUntouched(); 
    phoneFormArray.at(key).get('PhoneNumber').clearValidators();
    phoneFormArray.at(key).get('PhoneNumber').markAsPristine();
    // <!-- // @Bantee @whn 13-9-2023 @EWM-14439 to handle multiple validation after setting null -->

    phoneFormArray.at(key).get('PhoneNumber').setValidators([Validators.required,Validators.pattern(this.numberPattern),Validators.maxLength(20), Validators.minLength(5),RxwebValidators.unique()]);
    }
})
    }

   
  }

 
  /*
   @Type: File, <ts>
   @Name: checkforPhone
   @Who: Renu
   @When: 26-May-2021
   @Why: ROST-1586
   @What: on save btn save data to chiplist
   */
  checkforPhone(phoneVal,index) {
    const phoneFormArray = this.phoneForm.get("phoneInfo") as FormArray;
    if (phoneVal) {
      this.blankval = false;
    }
    let phoneforEdit;
    if (this.data.values != undefined || this.data?.values?.length==0) {
      phoneforEdit = this.data?.values?.Phone[0]?.PhoneNumber;
    }
    const checkphoneExistence = phoneParam => this.phoneChip.some(({ phone }) => phone == phoneParam && phone != phoneforEdit)
   // @suika @whn 18-05-2023 @EWM-12096 to handle validation msg already exist
      if(checkphoneExistence(phoneVal)==true)
      {
           this.phoneDuplicate=true;
           phoneFormArray.at(index).get('PhoneNumber').setErrors({ nameTaken: true });
           phoneFormArray.at(index).get('PhoneNumber').markAsTouched();
           phoneFormArray.at(index).get('PhoneNumber').markAsDirty();
      }else
      {
           this.phoneDuplicate=false;
           phoneFormArray.at(index).get('PhoneNumber').clearValidators();
           phoneFormArray.at(index).get('PhoneNumber').markAsPristine();
    // <!-- // @Bantee @whn 13-9-2023 @EWM-14439 to handle multiple validation after setting null -->

           phoneFormArray.at(index).get('PhoneNumber').setValidators([Validators.required,Validators.pattern(this.numberPattern),Validators.maxLength(20), Validators.minLength(5),RxwebValidators.unique()]);
      }
  }

  /*
  @Type: File, <ts>
  @Name: onConfirmphone
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: on save btn save data to chiplist
  */
  onConfirmphone(): void {
    let phoendata = this.phoneForm.value.phoneInfo;       
    let phoneArr: any = [];
    for (let i = 0; i < phoendata.length; i++) {
      for (var j = 0; j < this.contactCategory.length; j++) {
        if (phoendata[i].Type == this.contactCategory[j].Id) {
          if (phoendata[i].PhoneNumber != '' && phoendata[i].PhoneNumber != null) {
            phoneArr.push({
              'PhoneNumber': phoendata[i].PhoneNumber,
              'Type': parseInt(phoendata[i].Type),
              'Name': this.contactCategory[j].Name,
              //'Name':this.mainTypeName,
              'IsDefault': Boolean(this.contactCategory[j].IsDefault),
              'PhoneCode': phoendata[i].phoneCode,
              'CountryId':phoendata[i].phoneCode,
              'phoneCodeName': phoendata[i].phoneCodeName
            })
          }
        }
      }
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.remove("is-blurred");
      }
    }
    if (this.phoneChip.length == 0) {
      this.mainExists = phoendata.some(e => e.Type == this.mainId);
      if (this.mainExists == true) {
        this.mainExistVal = false;
      } else if(this.updatecase==true) { //this line use for only client summery edit phone poup ewm-18042 by maneesh when:25/10/2024    
            this.mainExistVal = false;
          }
      else {
        this.mainExistVal = true;
        return;
      }
    } else {
      // @suika @EWM-13694 handle edit case
      let phoneforEdit;
      if(this.data.values!=undefined)
      {
        phoneforEdit=this.data.values?.Phone[0]?.Type;
      }      
      this.mainExists = phoendata.some(e => e.Type == this.mainId);
      const checkTYpeExistence = typeParam => this.phoneChip.some(({ type }) => type == typeParam && type!=phoneforEdit);
      if (this.mainExists == true) {
        if (checkTYpeExistence(this.mainId) == true) {
          this.typeDuplicate = true;
          return;
        } else {
          this.typeDuplicate = false;
        }
        this.mainExistVal = false;
      } else {
        if (checkTYpeExistence(this.mainId) == true) {
          this.mainExistVal = false;
        } else {
          this.mainExistVal = true;
          return;
        }

      }
    } 
    document.getElementsByClassName("add_phone")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_phone")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: phoneArr }); }, 200);
    const control = <FormArray>this.phoneForm.controls['phoneInfo'];
    for (let i = control.length - 1; i > 0; i--) {
      control.removeAt(i)
    }
  }

  /* 
    @Type: File, <ts>
    @Name: onDismissphone
    @Who: Renu
    @When: 26-May-2021
    @Why: For Closing the dialog pop-up.
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismissphone(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
    document.getElementsByClassName("add_phone")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_phone")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: '' }); }, 200);
    const control = <FormArray>this.phoneForm.controls['phoneInfo'];
    for (let i = control.length - 1; i > 0; i--) {
      control.removeAt(i)
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /*
     @Type: File, <ts>
     @Name: getUserContactTypeCategory
     @Who: Renu
     @When: 26-Apr-2021
     @Why: ROST-1586
     @What: To get Data of contact based on categopry type
     */
  getUserContactTypeCategory() {
    let category = "phone";
    this.systemSettingService.getUserContactTypeCategory(category).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.contactCategory = repsonsedata.Data;
          // let mainFilter=this.contactCategory.filter(res=>res.Name.toLowerCase()== 'main');
          let mainFilter = this.contactCategory.filter(res => res.IsDefault == 1);
          if (mainFilter.length !== 0) {
            this.mainId = mainFilter[0]['Id'];
            const checkphoneExistence = typeParam => this.phoneChip.some(({ type }) => type == typeParam)
            if (checkphoneExistence(this.mainId) == false) {
              this.phoneInfo()?.at(0)?.patchValue({
                'Type': this.mainId
              })
            }
          }
          if (this.mode?.toLowerCase() == 'edit' || this.mode?.toLowerCase() == 'view') { //by maneesh what:ewm-14406
            this.patchValues(this.data.values);
            this.blankval = false;
          } else {
            this.blankval = true;
          }
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());

        }
      }, err => {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
  @Type: File, <ts>
  @Name: checkMainType
  @Who: Renu
  @When: 26-May-2021
  @Why: ROST-1586
  @What: check main type on dropdown changevalue and validate the form
  */
  checkMainType(mainId,index) {
    this.mainDataId = this.contactCategory.filter((dl: any) => dl.Id == mainId);
    this.mainTypeName = this.mainDataId[0].Name;
    this.blankval = false;
    const phoneFormArray = this.phoneForm.get("phoneInfo") as FormArray;
    if (this.phoneChip.length == 0) {
      let phonedata = this.phoneForm.value.phoneInfo;
      this.mainExists = phonedata.some(e => e.Type == this.mainId);
      if (this.mainExists == true) {
        this.mainExistVal = false; 
        const findDuplicateVal = phonedata.filter(e => e.Type == this.mainId);
         if(findDuplicateVal?.length==1){
           // @suika @EWM-26-06-2023 to handle validation msges
        phoneFormArray.controls.forEach((res,key)=>{
      if(phoneFormArray.at(key).get('Type').value==findDuplicateVal[0].Type){
        phoneFormArray.at(key).get('Type').setErrors(null);
        this.typeDuplicate = false;
        this.phoneDuplicate = false;
        phoneFormArray.at(key).get('Type').markAsUntouched();  
        phoneFormArray.at(key).get('Type').clearValidators();
        phoneFormArray.at(key).get('Type').markAsPristine();
        phoneFormArray.at(key).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
        if(phoneFormArray.at(key).get('PhoneNumber').valid){
         phoneFormArray.at(key).get('PhoneNumber').setErrors(null);
         phoneFormArray.at(key).get('PhoneNumber').markAsUntouched(); 
         phoneFormArray.at(key).get('PhoneNumber').clearValidators();
         phoneFormArray.at(key).get('PhoneNumber').markAsPristine();
         phoneFormArray.at(key).get('PhoneNumber').setValidators([Validators.required,Validators.pattern(this.numberPattern),Validators.maxLength(20), Validators.minLength(5),RxwebValidators.unique()]);
        }else{
        phoneFormArray.at(key).get('PhoneNumber').setValidators([Validators.required,Validators.pattern(this.numberPattern),Validators.maxLength(20), Validators.minLength(5),RxwebValidators.unique()]);
        }
      
        }
       })
         }
      } else {
        this.mainExistVal = true;
        return;
      }
    } else {
     
      if (this.mainId == mainId) {
        const checkTYpeExistence = typeParam => this.phoneChip.some(({ type }) => type == typeParam)
        //@who:suika;@when:26-nov-2021;@why:to handle edit case validation 
        if(this.data.values!=undefined && mainId==this.data.values.Phone[0]?.Type)
        {
             // @suika @whn 18-05-2023 @EWM-12096 to handle validation msg already exist
          this.typeDuplicate=false;
          this.mainExistVal=false;
          phoneFormArray.at(index).get('Type').clearValidators();
          phoneFormArray.at(index).get('Type').markAsPristine();
          phoneFormArray.at(index).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
          
        }
        else if(checkTYpeExistence(this.mainId)==true)
        {
            this.typeDuplicate=true;           
            phoneFormArray.at(index).get('Type').setErrors({ TypeTaken: true });
            phoneFormArray.at(index).get('Type').markAsTouched();
            phoneFormArray.at(index).get('Type').markAsDirty();
        }else
        {
            this.typeDuplicate=false;
            phoneFormArray.at(index).get('Type').clearValidators();
            phoneFormArray.at(index).get('Type').markAsPristine();
            phoneFormArray.at(index).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
            this.mainExistVal=false; // @suika @EWM-10662 @whn 22-03-2023 @handle main
        }
      }else{
        this.typeDuplicate=false;
        phoneFormArray.at(index).get('Type').clearValidators();
        phoneFormArray.at(index).get('Type').markAsPristine();
        phoneFormArray.at(index).get('Type').setValidators([Validators.required, RxwebValidators.unique()]);
      }
     
    }
  }

  /*
    
      @Who: priti
      @When: 11-june-2021
      @Why: EWM-1806
      @What: get selected data
    */
  ddlMobileNumberChange(data, index) {
    // if(data==null || data=="")
    // {
    //   this.phoneForm.get("phoneCode").setErrors({ required: true });
    //   this.phoneForm.get("phoneCode").markAsTouched();
    //   this.phoneForm.get("phoneCode").markAsDirty();
    // }
    // else
    // {
    // this.phoneForm.get("phoneCode").clearValidators();
    // this.phoneForm.get("phoneCode").markAsPristine();
    //this.selectedMobileNumberValue[index]=data;

  // --------@When: 16-01-2023 @who:Adarsh singh @why: EWM-9561 Desc- adding this code inside if else part --------
    if (data) {
      this.quickpeopleService.getCountryById(data).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.phoneName = repsonsedata.Data.CountryCode;
            (<FormArray>this.phoneForm.get('phoneInfo'))?.at(index)?.patchValue(
              {
               phoneCode: Number(data),
                phoneCodeName: this.phoneName
              }
            )
          }
        }, err => {
        });
    }else{
      (<FormArray>this.phoneForm.get('phoneInfo'))?.at(index)?.patchValue(
        {
         phoneCode: null,
          phoneCodeName: null
        }
      )
    }
  // --------End --------
    // }
  }

  /*
 @Type: File, <ts>
 @Name: getCountryCode
 @Who: Renu
 @When: 28-June-2021
 @Why: ROST-1586
 @What: To get Data of contact based on categopry type
 */
  getCountryCode(countryId) {
    this.quickpeopleService.getCountryById(countryId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.countryCode = repsonsedata.Data;
             this.selectedMobileNumberValue = Number(this.countryCode.Id);
          (<FormArray>this.phoneForm.get('phoneInfo'))?.at(0)?.patchValue(
            {
              'phoneCode': Number(this.countryCode.Id),
              'CountryId':Number(this.countryCode.Id),
              'phoneCodeName': this.countryCode.CountryCode
            })


        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  patchValues(formvalues) {  
    // <!-- // @Bantee @whn 13-9-2023 @EWM-14439 to handle multiple validation after setting null -->

    if (formvalues.Phone?.length > 0) {    
      const control = <FormArray>this.phoneForm.controls['phoneInfo'];
      control.clear();
      formvalues.Phone.forEach((x,y) => {
        this.selectedMobileNumberValue = Number(x.CountryId);
       // this.ddlMobileNumberChange(x.CountryId,y);
        control.push(
          this.fb.group({
            PhoneNumber: [x.PhoneNumber, [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
            Type: [x.Type, [RxwebValidators.unique()]], //who:maneesh,what:ewm-14782 for patch type name,when:16/10/2023
            TypeName: [x.TypeName],
            phoneCode: [x.CountryId, Validators.required],
            CountryId:[x.CountryId],
            phoneCodeName: [x.phoneCodeName]
          })
        )
      })
    }
    if (this.mode == 'View' || this.mode == 'view') {
      const control = <FormArray>this.phoneForm.controls['phoneInfo'];    
      control.disable();
      this.IsDisabled = true;
    }
  }

/*
  @Type: File, <ts>
  @Name: disabledSelectedMainTypeInEditMode
  @Who: Adarsh singh
  @When: 25-JuAugne-2022
  @Why: ROST-8367
  @What: for disabled phone number and type filed while editing data for Edit Organization Details
 */

  disabledSelectedMainTypeInEditMode(pageName) {
    setTimeout(() => {
      if (pageName === 'orgPage') {
        const phoneNumber = document.getElementById('phones-number0') as HTMLInputElement | null;
        const phoneType = document.getElementById('phones-category0') as HTMLInputElement | null;
        const countryCode = document.querySelector('#MobileNumber0 .countrySelect') as HTMLInputElement | null;


        if (this.data.mode == 'edit') {
          phoneNumber?.setAttribute('disabled', 'true');
          phoneType?.setAttribute('disabled', 'true');
          phoneType.style.pointerEvents = 'none';
          phoneType.style.opacity = '.6';
          countryCode.style.pointerEvents = 'none';
          countryCode.style.opacity = '.6';
        } else {
          phoneNumber?.removeAttribute('disabled');
          phoneType?.removeAttribute('disabled');
          phoneType.style.pointerEvents = 'auto';
          phoneType.style.opacity = '1';
          countryCode.style.pointerEvents = 'auto';
          countryCode.style.opacity = '1';
        }
      }
    }, 500);
  }
}
