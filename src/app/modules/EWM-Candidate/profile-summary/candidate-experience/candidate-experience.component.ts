/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 16-Aug-2021
  @Why: EWM-2528 EWM-2529
  @What: this section handle all quick candidate experience component related functions
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms'; 
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { CandidateExperienceService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-experience.service';
import { CandidateExperienceMaster } from 'src/app/modules/EWM.core/shared/datamodels/candidate-experience';
import { QuicklocationComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
@Component({
  selector: 'app-candidate-experience',
  templateUrl: './candidate-experience.component.html',
  styleUrls: ['./candidate-experience.component.scss']
})
export class CandidateExperienceComponent implements OnInit {

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
  public addressBarData: any;
  addPeopleForm: FormGroup;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z]+$";
  public statusList: any = [];
  public locationArr: any;
  public selectedValue: any;
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  public StateList: any = [];
  employee: any;
  currencyList: [] = [];
  salaryList: [] = [];
  dateStart = new Date();
  dateEnd = new Date();
  today = new Date();
  datePublish = new Date();
  public candidateId;
  public editId;
  public activityStatus;
  public IsDisabled: boolean = false;
  public oldPatchValues: any;
  endDay: Date;
  fromDate = '';
  getDateFormat:any;
  dirctionalLang;
  public dropDownSalaryUnitConfig: customDropdownConfig[] = [];
  public selectedSalaryUnit: any = {};
  maxMessage: number = 1000;
  constructor(public dialogRef: MatDialogRef<CandidateExperienceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private countryMasterService: CountryMasterService,
    private textChangeLngService: TextChangeLngService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private profileInfoService: ProfileInfoService, private _CandidateExperienceService: CandidateExperienceService, private quickJobService: QuickJobService,
    private appSettingsService: AppSettingsService,private serviceListClass: ServiceListClass,) {
    this.candidateId = data.candidateId;
    // @Who: Bantee Kumar,@Why:EWM-10893,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.

    if(data.activityStatus){
    this.activityStatus = data.activityStatus;    
    }
     if (data.editId != undefined) {
      this.editId = data.editId;
      this.getExperienceById(this.editId);
      this.activityStatus = data.activityStatus;

    } else {
      this.candidateId = data.candidateId;
    }
    // @Who: bantee ,@When: 14-mar-2023, @Why: EWM-11156 ,What: add CustomValidatorService to the start date control
    this.today = new Date();
    this.today.setDate( this.today.getDate() - 1 );

    this.addPeopleForm = this.fb.group({
      Id: [''],
      positionName: ['', [Validators.required, Validators.maxLength(50)]],
      employer: ['', [Validators.required, Validators.maxLength(100)]],
      salary: ['', [Validators.maxLength(9), Validators.pattern(this.numberPattern)]],//who:maneesh,what:ewm-14040 for change maxlength from 10 to 9char,when:28/08/2023
      CurrencyId: [null],
      SalaryUnitId: [null],
      startDate: [null, [Validators.required,CustomValidatorService.dateValidator]],
      endDate: [null, [Validators.required,CustomValidatorService.dateValidator]],
      description: ['', [Validators.maxLength(1000)]],
      IsCurrent: [''],
      SalaryUnitName: [],
      address: this.fb.group({
        // 'Name': ['', [Validators.maxLength(100)]],
        // 'TypeId': [],
        'AddressLinkToMap': ['', [Validators.maxLength(250)]],
        // 'AddressLine1': ['', [Validators.maxLength(200)]],
        // 'AddressLine2': ['', [Validators.maxLength(200)]],
        // 'District_Suburb': [, [Validators.maxLength(50)]],
        // 'TownCity': ['', [Validators.maxLength(50)]],
        // 'StateId': [''],
        // 'PostalCode': ['', [Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
        // 'CountryId': [''],
        // 'Longitude': ['', [Validators.maxLength(50)]],
        // 'Latitude': ['', [Validators.maxLength(50)]]
      })
    });
  }

  ngOnInit() {    
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.today = new Date();
    this.today.setDate( this.today.getDate() - 1 );
    // this.getInternationalization();
    // this.getCountryInfo();
    this.getCurrencyAll();
    // this.getAllSalary();
    // <!---------@When: 29-03-2023 @who:Adarsh singh @why: EWM-11208 --------->
    this.endDay = new Date(this.addPeopleForm.value.startDate);
    this.endDay.setDate( this.endDay.getDate() + 1 );
          //  who:maneesh,what:ewm-9865 for apply custome dropdown this.selectedSalaryUnit,when:02/05/2023 -->
        //////Salary Unit//////////////
        this.dropDownSalaryUnitConfig['IsDisabled'] =  false;
        this.dropDownSalaryUnitConfig['apiEndPoint'] = this.serviceListClass.getAllSalary +'?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
        this.dropDownSalaryUnitConfig['placeholder'] = 'quickjob_salaryUnit';
        this.dropDownSalaryUnitConfig['IsManage'] = '/client/core/administrators/salaryunit';
        this.dropDownSalaryUnitConfig['IsRequired'] = false;
        this.dropDownSalaryUnitConfig['searchEnable'] = true;
        this.dropDownSalaryUnitConfig['bindLabel'] = 'Name';
        this.dropDownSalaryUnitConfig['multiple'] = false;  
          //  who:maneesh,what:in view mode salary field disable,when:03/05/2023 -->
        if (this.activityStatus == 'View') {
        this.dropDownSalaryUnitConfig['IsDisabled'] =  true;
        }else{
          this.dropDownSalaryUnitConfig['IsDisabled'] =  false;
        }
  }


  /* 
 @Type: File, <ts>
 @Name: getGeneralInformation function
 @Who: Nitin Bhati
 @When: 11-Aug-2021
 @Why: EWM-2424
 @What: For setting value in the edit form
*/
  getExperienceById(id) {
    this._CandidateExperienceService.getExperienceByID('?id=' + id + '&candidateid=' + this.candidateId).subscribe(
      (data: CandidateExperienceMaster) => {
        if (data.HttpStatusCode == 200) {
          let IsCurrent;
          if (data['Data'].IsCurrent == 1) {
            IsCurrent = true;
            this.addPeopleForm.controls["endDate"].disable();
            this.addPeopleForm.controls["endDate"].reset();
          } else {
            IsCurrent = false;
            this.addPeopleForm.controls["endDate"].enable();
            this.addPeopleForm.patchValue({
              endDate:data['Data'].DateEnd!='0' && data['Data'].DateEnd!=null?new Date(data['Data'].DateEnd):'',
            })
          }
          //  who:maneesh,what:ewm-9865 for apply custome dropdown this.selectedSalaryUnit,when:02/05/2023
          if (data['Data'].SalaryUnitId != null && data['Data'].SalaryUnitId != undefined) {
            this.selectedSalaryUnit = { Id: data['Data'].SalaryUnitId };
          }
          let IsSalary;
          if (data['Data'].Salary == 0) {
            IsSalary = '';
            } else {
            IsSalary = data['Data'].Salary;
          }
       let startDate =   this.appSettingsService.getUtcDateFormat(data['Data'].DateStart);
          this.addPeopleForm.patchValue({
            positionName: data['Data'].PositionName,
            employer: data['Data'].Employer, 
            salary: IsSalary,
            
            CurrencyId: data['Data'].CurrencyId || null,
          //  who:maneesh,what:ewm-9865 for apply custome dropdown this.selectedSalaryUnit,when:02/05/2023 -->
            SalaryUnitId: data['Data'].SalaryUnitId,
            startDate: startDate,
           // endDate: new Date(data['Data'].DateEnd),
            description: data['Data'].Description,
            IsCurrent: IsCurrent,
          });
          //  who:maneesh,what:ewm-9865 for apply custome dropdown this.selectedSalaryUnit,when:02/05/2023 -->
          if (data['Data'].SalaryUnitId != null && data['Data'].SalaryUnitId != undefined) {
            this.selectedSalaryUnit = { 
            Id:data['Data'].SalaryUnitId
            };      
        }
        if (data['Data'].SalaryUnitId ==0) {
          this.selectedSalaryUnit = null;
          this.addPeopleForm.patchValue({
            SalaryUnitId: null
          })
        }else{
          this.addPeopleForm.patchValue(
            {
              SalaryUnitId: this.selectedSalaryUnit.Id
            })
        }
          this.endDay = new Date(startDate);
          // this.addPeopleForm.get('address').patchValue({
          //   AddressLinkToMap: data['Data']['Location'].AddressLinkToMap,
          // });

          this.oldPatchValues = data['Data'];
          this.oldPatchValues['DateStart'] = new Date(data['Data'].DateStart);
          this.oldPatchValues['DateEnd'] = new Date(data['Data'].DateEnd);

          if (this.activityStatus == 'View') {
            this.addPeopleForm.disable();

            this.addPeopleForm['controls'].address['controls'].AddressLinkToMap?.setValue(data.Data.Location?.AddressLinkToMap)
            this.addressBarData =  data.Data.Location;
            
            // this.addPeopleForm.get('address').patchValue({
            //   AddressLinkToMap: data['Data']['Location'].AddressLinkToMap,
            // });
          }else{
            this.addPeopleForm['controls'].address['controls'].AddressLinkToMap?.setValue(data.Data.Location?.AddressLinkToMap)
            this.addressBarData =  data.Data.Location;
            // this.addPeopleForm.get('address').patchValue({
            //   AddressLinkToMap: data['Data']['Location'].AddressLinkToMap,
            // });
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
@Name: getCurrencyAll function
@Who: Anup
@When: 25-June-2021
@Why: EWM-1749 EWM-1900
@What: get currency List
*/
  getCurrencyAll() {
    this.quickJobService.getCurrency('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.currencyList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /////Salary
  /* 
  @Type: File, <ts>
  @Name: getAllSalary function
  @Who: Anup
  @When: 25-June-2021
  @Why: EWM-1749 EWM-1900
  @What: get salary List
  */
  getAllSalary() {
    this.quickJobService.getAllSalary('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.salaryList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        // this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
   @Type: File, <ts>
   @Name: add
   @Who: Nitin Bhati
   @When: 16-Aug-2021
   @Why: EWM-2529
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
   @Name: onSubmit
   @Who: Nitin Bhati
   @When: 17-Aug-2021
   @Why: EWM-2529
   @What: Function will to save data according to methodtype 
 */
  onConfirm(): void {
    if (this.activityStatus == 'Add') {
      this.onExperienceSave();
    } else if (this.activityStatus == 'Edit') {
      this.onExperienceUpdate()
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }
  /* 
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Nitin Bhati
    @When: 16-Aug-2021
    @Why: EWM-2529
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onExperienceSave(): void {
    if (this.addPeopleForm.invalid) {
      return;
    }
    let createPeopJson = {};
    let isCurrent: any;
    if (this.addPeopleForm.value.IsCurrent == true) {
      isCurrent = 1;
      createPeopJson['DateEnd'] = null;
    } else {
      isCurrent = 0;
      let endDate =   this.appSettingsService.getUtcDateFormat(this.addPeopleForm.value.endDate);    
      createPeopJson['DateEnd'] = endDate;
    }
    createPeopJson['CandidateId'] = this.candidateId;
    createPeopJson['PositionName'] = this.addPeopleForm.value.positionName;
    createPeopJson['Employer'] = this.addPeopleForm.value.employer;
    createPeopJson['Salary'] = this.addPeopleForm.value.salary?parseInt(this.addPeopleForm.value.salary):0;
    createPeopJson['CurrencyId'] = this.addPeopleForm.value.CurrencyId?parseInt(this.addPeopleForm.value.CurrencyId):0;
    createPeopJson['SalaryUnitId'] = this.addPeopleForm.value.SalaryUnitId?parseInt(this.addPeopleForm.value.SalaryUnitId):0;
    // createPeopJson['SalaryUnitName'] = this.addPeopleForm.value.SalaryUnitName;

    let startDate =   this.appSettingsService.getUtcDateFormat(this.addPeopleForm.value.startDate);
    createPeopJson['DateStart'] = startDate;
    //createPeopJson['DateEnd'] = this.addPeopleForm.value.endDate;
    createPeopJson['Description'] = this.addPeopleForm.value.description;
    createPeopJson['IsCurrent'] = isCurrent;

    createPeopJson['Location'] = this.locationArr;


    this._CandidateExperienceService.createExperience(createPeopJson).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addPeopleForm.reset();
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
   @Name: confirm-onExperienceUpdate.compenent.ts
   @Who: Nitin Bhati
   @When: 16-Aug-2021
   @Why: EWM-2529
   @What: Function will call when user click on EDIT BUTONS.
 */
  onExperienceUpdate(): void {
   if (this.addPeopleForm.invalid) {
      return;
    }
    //let createPeopJson = {};
    let isCurrent: any;
    let addObj = [];
    let fromObj = {};
    let toObj = {};
   if (this.addPeopleForm.value.IsCurrent == true) {
       isCurrent = 1;
       toObj['DateEnd'] = null;
   } else {
      isCurrent = 0;
      let endDate =   this.appSettingsService.getUtcDateFormat(this.addPeopleForm.value.endDate); 
      toObj['DateEnd'] = endDate;
   }
    fromObj = this.oldPatchValues;
    toObj['Id'] = this.editId;
    toObj['CandidateId'] = this.candidateId;
    toObj['PositionName'] = this.addPeopleForm.value.positionName;
    toObj['Employer'] = this.addPeopleForm.value.employer;
    toObj['Salary'] = this.addPeopleForm.value.salary?parseInt(this.addPeopleForm.value.salary):0 //parseInt(this.addPeopleForm.value.salary);
    toObj['CurrencyId'] = this.addPeopleForm.value.CurrencyId?parseInt(this.addPeopleForm.value.CurrencyId):0;//this.addPeopleForm.value.CurrencyId;
    toObj['SalaryUnitId'] = this.addPeopleForm.value.SalaryUnitId?parseInt(this.addPeopleForm.value.SalaryUnitId):0;
    // toObj['SalaryUnitName'] = this.addPeopleForm.value.SalaryUnitName;//this.addPeopleForm.value.SalaryUnitId;
    //this.addPeopleForm.value.SalaryUnitId;
    let startDate =   this.appSettingsService.getUtcDateFormat(this.addPeopleForm.value.startDate); 
    toObj['DateStart'] = startDate;
   // toObj['DateEnd'] = this.addPeopleForm.value.endDate;
    toObj['Description'] = this.addPeopleForm.value.description;
    toObj['IsCurrent'] = isCurrent;
    toObj['Location'] = this.addressBarData; //who:maneesh, what ewm-9864 for while update experience then location show,when:30/10/2023

    addObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this._CandidateExperienceService.updateExperience(addObj[0]).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addPeopleForm.reset();
          document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          //this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
   @Type: File, <ts>
   @Name: clickStartDate function
   @Who: Nitin Bhati
   @When: 16-Aug-2021
     @Why: EWM-2529
   @What: For status Click event
  */
   inputEventStart(startDate) {
    if(startDate){
      this.endDay = new Date(startDate);
      this.endDay.setDate(this.endDay.getDate() + 1);
     }
        if (!startDate){
        this.endDay = null;
      }  
    }

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Nitin Bhati
    @When: 16-Aug-2021
    @Why: EWM-2529
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
     @Name: addAddress
     @Who: Nitin Bhati
     @When: 16-Aug-2021
     @Why: EWM-2529
     @What: To get Data from address of people
     */
  addAddress() {
    const dialogRef = this.dialog.open(QuicklocationComponent, {
      data: new Object({ address: this.addressBarData,  mode: this.activityStatus }),
      panelClass: ['xeople-modal', 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res !=null) {
       this.addPeopleForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data?.AddressLinkToMap)
      this.locationArr = res.data;
      this.addressBarData =  res.data;
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


 
  onChangeMapAddress() {
    const PostalCode = this.addPeopleForm['controls'].address['controls'].PostalCode;
    const countryId = this.addPeopleForm['controls'].address['controls'].CountryId;

    this.addPeopleForm['controls'].address['controls'].AddressLinkToMap.valueChanges.subscribe(AddressLinkToMap => {

      if (AddressLinkToMap !== '') {
        PostalCode.setValidators(null);
        countryId.setValidators(null);
      }

    })
  }

  /*
    @Type: File, <ts>
    @Name: getInternationalization function
    @Who: Nitin Bhati
    @When: 16-Aug-2021
    @Why: EWM-2529
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

  onCurrentCompany($event){
   let currentCompany= this.addPeopleForm.value.IsCurrent;
    if(currentCompany==true){
      this.addPeopleForm.controls["endDate"].disable();
    this.addPeopleForm.controls["endDate"].reset();
    }else{
    this.addPeopleForm.controls["endDate"].enable();
     }

    }

   /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear start  date 
     */
    clearStartDate(e){
      this.addPeopleForm.patchValue({
        startDate: null
      });
      this.endDay=null;
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
      this.addPeopleForm.patchValue({
        endDate: null
      });
    }
     /*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 20-dec-2022
    @Why: EWM-8500
    @What: For clear end  date 
     */
    handleKeyUp(event){
      // if (event.keyCode===9) {
      //  console.log('hai');
        
      // }
      if(event.keyCode===13){
        this.onConfirm();
      }
     }

       /////Salary
  /* 
@Type: File, <ts>
@Name: onJobSalaryUnitchange function
@Who: maneesh
@When: 02-may-2023
@Why: EWM-9865
@What: get salary List
*/

  onJobSalaryUnitchange(data) {
    if (data == null || data == "") {
      this.selectedSalaryUnit = null;
      this.addPeopleForm.patchValue(
        {
          SalaryUnitId: null
        }
      )
    }
    else {
      this.addPeopleForm.get("SalaryUnitId").clearValidators();
      this.addPeopleForm.get("SalaryUnitId").markAsPristine();
      this.selectedSalaryUnit = data;
      this.addPeopleForm.patchValue(
        {
          SalaryUnitId: data.Id,
          SalaryUnitName: data.Name,
        }
      )
    }
  }

  public onMessage(value: any) {
    if (value != undefined && value != null) {
      // <!------------@suika @EWM-14081 EWM-14083 @whn 28-09-2023--------------------->
      this.maxMessage = 1000 - value.length;
      if(value?.length>1000){
        this.addPeopleForm.get('description').markAsTouched();
        this.addPeopleForm.get('description').setErrors({maxlength:true});
      }
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
