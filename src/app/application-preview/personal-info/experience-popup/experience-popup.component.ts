/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: experience-popup.component.ts
 @Who: Renu
 @When: 22-June-2022
 @Why: ROST-7151 EWM-7233
 @What: experience popup
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CandidateExperienceMaster } from 'src/app/modules/EWM.core/shared/datamodels/candidate-experience';
import { QuicklocationComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { CandidateExperienceService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-experience.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-experience-popup',
  templateUrl: './experience-popup.component.html',
  styleUrls: ['./experience-popup.component.scss']
})
export class ExperiencePopupComponent implements OnInit {

  /**********************global variables decalared here **************/

  public addressBarData: any;
  addExpForm: FormGroup;
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
  public activityStatus;
  public IsDisabled: boolean = false;
  public oldPatchValues: any;
  endDay: Date;
  fromDate = '';
  editdata: any;
  expInfo: any;
  getDateFormat:any;
  constructor(public dialogRef: MatDialogRef<ExperiencePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private countryMasterService: CountryMasterService,
    private textChangeLngService: TextChangeLngService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private profileInfoService: ProfileInfoService, private appSettingsService: AppSettingsService, private _CandidateExperienceService: CandidateExperienceService, private quickJobService: QuickJobService) {
     
      this.today = new Date();
      this.today.setDate( this.today.getDate() - 1 );
    this.activityStatus = data.activityStatus;
    this.expInfo=data.resData;
    this.addExpForm = this.fb.group({
      Id: [''],
      positionName: [],
      employer: [],
      salary: [],
      CurrencyId: [],
      SalaryUnitId: [],
     // <!-- @Who: bantee ,@When: 12-04-2023, @Why: EWM-11854 ,What: add CustomValidatorService to the start date control -->
      startDate: [this.today,this.expInfo?.IsStartDateExpRequired==0 ? [CustomValidatorService.dateValidator] : [Validators.required,CustomValidatorService.dateValidator]],
      endDate: [new Date(),this.expInfo?.IsEndDateExpRequired==0 ? [CustomValidatorService.dateValidator] : [Validators.required,CustomValidatorService.dateValidator]],
      description: [],
      IsCurrent: [''],
      address: this.fb.group({
        'AddressLinkToMap': [],
      })
    });
    
    if (this.activityStatus === 'view') {
      this.addExpForm.disable();
    }
    if (data.editdata !='') {
      this.editdata = data.editdata;
      this.patchExpData(this.editdata);
      this.activityStatus = data.activityStatus;

    }
  }

  ngOnInit() {

    if(this.expInfo){
      this.addExpForm.controls.positionName.setValidators(this.expInfo?.IsPositionNameRequired==0 ? [Validators.maxLength(50)] : [Validators.required, Validators.maxLength(50)]);
      this.addExpForm.controls.positionName.updateValueAndValidity();

      this.addExpForm.controls.employer.setValidators(this.expInfo?.IsEmployerRequired==0 ? [Validators.maxLength(100)] : [Validators.required, Validators.maxLength(100)]);
      this.addExpForm.controls.employer.updateValueAndValidity();

      this.addExpForm.controls.salary.setValidators(this.expInfo?.IsSalaryRequired==0 ? [Validators.maxLength(10), Validators.pattern(this.numberPattern)] : [Validators.required, Validators.maxLength(10), Validators.pattern(this.numberPattern)]);
      this.addExpForm.controls.salary.updateValueAndValidity();

      this.addExpForm.controls.CurrencyId.setValidators(this.expInfo?.IsCurrencyRequired==0 ? null : [Validators.required]);
      this.addExpForm.controls.CurrencyId.updateValueAndValidity();

      this.addExpForm.controls.SalaryUnitId.setValidators(this.expInfo?.IsSalaryUnitRequired==0 ? null : [Validators.required]);
      this.addExpForm.controls.SalaryUnitId.updateValueAndValidity();

      // this.addExpForm.controls.startDate.setValidators(this.expInfo?.IsStartDateExpRequired==0 ? null : [Validators.required ,CustomValidatorService.dateValidator]);
      // this.addExpForm.controls.startDate.updateValueAndValidity();
      
      // this.addExpForm.controls.endDate.setValidators(this.expInfo?.IsEndDateExpRequired==0 ? null : [Validators.required, CustomValidatorService.dateValidator]);
      // this.addExpForm.controls.endDate.updateValueAndValidity();

      this.addExpForm.controls.description.setValidators(this.expInfo?.IsDescriptionExpRequired==0 ? [Validators.maxLength(1000)] : [Validators.required, Validators.maxLength(1000)]);
      this.addExpForm.controls.description.updateValueAndValidity();

      this.addExpForm.controls.address['controls'].AddressLinkToMap.setValidators(this.expInfo?.IsLocationExpRequired==0 ? [ Validators.maxLength(250)] : [Validators.required, Validators.maxLength(250)]);
      this.addExpForm.controls.address['controls'].AddressLinkToMap.updateValueAndValidity();
      
    }
    this.today = new Date();
    this.today.setDate(this.today.getDate() - 1);
    // this.getInternationalization();
    // this.getCountryInfo();
    this.getCurrencyAll();
    this.getAllSalary();
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;

  }


  /* 
 @Type: File, <ts>
 @Name: getGeneralInformation function
 @Who: Renu
 @When: 11-Aug-2021
 @Why: EWM-2424
 @What: For setting value in the edit form
 */
  patchExpData(editData: any) {
    let IsCurrent;
    if (editData.IsCurrent == 1) {
      IsCurrent = true;
      this.addExpForm.controls["endDate"].disable();
      this.addExpForm.controls["endDate"].reset();
    } else {
      IsCurrent = false;
      this.addExpForm.controls["endDate"].enable();
      this.addExpForm.patchValue({
        endDate: new Date(editData.DateEnd),
      })
    }

    let IsSalary;
    if (editData.Salary == 0) {
      IsSalary = '';
    } else {
      IsSalary = editData.Salary;
    }

    this.addExpForm.patchValue({
      positionName: editData.PositionName,
      employer: editData.Employer,
      salary: IsSalary,
      CurrencyId: {'Id':editData.CurrencyId,'CurrencyName':editData.Currency,'Symbol':editData.Symbol},
      SalaryUnitId: {'Id':editData.SalaryUnitId,'Name':editData.SalaryUnit},
      startDate: new Date(editData.DateStart),
      // endDate: new Date(data['Data'].DateEnd),
      description: editData.Description,
      IsCurrent: IsCurrent,
    });

    this.endDay = new Date(new Date(editData.DateStart));

    if (this.activityStatus == 'view') {
      this.addExpForm.disable();

      this.addExpForm['controls'].address['controls'].AddressLinkToMap.setValue(editData.Location?.AddressLinkToMap)
      this.addressBarData = editData.Location;


    } else {
      this.addExpForm['controls'].address['controls'].AddressLinkToMap.setValue(editData.Location?.AddressLinkToMap)
      this.addressBarData = editData.Location;

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
 @Name: getCurrencyAll function
 @Who: Anup
 @When: 25-June-2021
 @Why: EWM-1749 EWM-1900
 @What: get currency List
 */
// who:maneesh,what:ewm-12803 for bypassing true,when:21/06/2023
  getCurrencyAll() {
    this.quickJobService.getCurrency('?ByPassPaging=true&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
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
    this.quickJobService.getAllSalary('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
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
   @Name: onSubmit
   @Who: Renu
   @When: 17-Aug-2021
   @Why:EWM-7151 EWM-7233
   @What: Function will to save data according to methodtype 
 */
  onConfirm(): void {
    if (this.activityStatus == 'add') {
      this.onExperienceSave();
    } else if (this.activityStatus == 'edit') {
      this.onExperienceUpdate()
    }
  }
  /* 
    @Type: File, <ts>
    @Name: confirm-dialog.compenent.ts
    @Who: Renu
    @When: 22-June-2022
    @Why:EWM-7151 EWM-7233
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onExperienceSave(): void {
    if (this.addExpForm.invalid) {
      return;
    }
    let createPeopJson = {};
    let isCurrent: any;
    let Days:number;
    if (this.addExpForm.value.IsCurrent == true) {
      isCurrent = 1;
      createPeopJson['DateEnd'] = null;
      let currentDate:any = new Date();
      Days=this.monthDiff( new Date(this.addExpForm.value.startDate),currentDate);
      // var diff = Math.abs(currentDate- this.addExpForm.value.startDate.getTime());
      // Days = Math.ceil(diff / ( 24 * 60 * 60 * 1000)); 
    } else {
      isCurrent = 0;
      createPeopJson['DateEnd'] = this.addExpForm.value.endDate;
      Days=this.monthDiff( new Date(this.addExpForm.value.startDate), new Date(this.addExpForm.value.endDate));
      // var diff = Math.abs(this.addExpForm.value.endDate.getTime() - this.addExpForm.value.startDate.getTime());
      // Days = Math.ceil(diff / ( 24 * 60 * 60 * 1000)); 
    }

    createPeopJson['PositionName'] = this.addExpForm.value.positionName;
    createPeopJson['Employer'] = this.addExpForm.value.employer;
    createPeopJson['Salary'] = this.addExpForm.value.salary ? parseInt(this.addExpForm.value.salary) : 0;
    createPeopJson['CurrencyId'] = this.addExpForm.value.CurrencyId ? parseInt((this.addExpForm.value.CurrencyId?.Id) ) : 0;
    createPeopJson['Currency'] = this.addExpForm.value.CurrencyId ? this.addExpForm.value.CurrencyId?.CurrencyName : '';
    createPeopJson['Symbol'] = this.addExpForm.value.CurrencyId ? this.addExpForm.value.CurrencyId?.Symbol : '';
    createPeopJson['SalaryUnitId'] =  this.addExpForm.value.SalaryUnitId ? parseInt( (this.addExpForm.value.SalaryUnitId?.Id) ) : 0;
    createPeopJson['SalaryUnit'] = this.addExpForm.value.SalaryUnitId? this.addExpForm.value.SalaryUnitId?.Name : '';
    createPeopJson['DateStart'] = this.addExpForm.value.startDate;
    //createPeopJson['DateEnd'] = this.addExpForm.value.endDate;
    createPeopJson['Description'] = this.addExpForm.value.description;
    createPeopJson['IsCurrent'] = isCurrent;
    createPeopJson['Location'] = this.locationArr;
    createPeopJson['TotalExperience'] = Days;
    

    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(createPeopJson); }, 200);
    this.addExpForm.reset();

  }

  /* 
   @Type: File, <ts>
   @Name: confirm-onExperienceUpdate.compenent.ts
   @Who: Renu
   @When: 22-June-2022
   @Why:EWM-7151 EWM-7233
   @What: Function will call when user click on EDIT BUTONS.
 */
  onExperienceUpdate(): void {
    if (this.addExpForm.invalid) {
      return;
    }
    let createPeopJson = {};
    let isCurrent: any;
    let Days:number;
    if (this.addExpForm.value.IsCurrent == true) {
      isCurrent = 1;
      createPeopJson['DateEnd'] = null;
      let currentDate:any = new Date();
      Days=this.monthDiff( new Date(this.addExpForm.value.startDate),currentDate);
      //var diff = Math.abs(currentDate- this.addExpForm.value.startDate.getTime());
    //  Days = Math.ceil(diff / ( 24 * 60 * 60 * 1000)); 
    } else {
      isCurrent = 0;
      createPeopJson['DateEnd'] = this.addExpForm.value.endDate;
      Days=this.monthDiff( new Date(this.addExpForm.value.startDate), new Date(this.addExpForm.value.endDate));
     // var diff = Math.abs(this.addExpForm.value.endDate.getTime() - this.addExpForm.value.startDate.getTime());
     // Days = Math.ceil(diff / ( 24 * 60 * 60 * 1000)); 
    }

    createPeopJson['PositionName'] = this.addExpForm.value.positionName;
    createPeopJson['Employer'] = this.addExpForm.value.employer;
    createPeopJson['Salary'] = this.addExpForm.value.salary ? parseInt(this.addExpForm.value.salary) : 0;
    createPeopJson['CurrencyId'] = this.addExpForm.value.CurrencyId ? parseInt((this.addExpForm.value.CurrencyId?.Id) ) : 0;
    createPeopJson['Currency'] = this.addExpForm.value.CurrencyId ? this.addExpForm.value.CurrencyId?.CurrencyName : '';
    createPeopJson['Symbol'] = this.addExpForm.value.CurrencyId ? this.addExpForm.value.CurrencyId?.Symbol : '';
    createPeopJson['SalaryUnitId'] =  this.addExpForm.value.SalaryUnitId ? parseInt( (this.addExpForm.value.SalaryUnitId?.Id) ) : 0;
    createPeopJson['SalaryUnit'] = this.addExpForm.value.SalaryUnitId? this.addExpForm.value.SalaryUnitId?.Name : '';
    createPeopJson['DateStart'] = this.addExpForm.value.startDate;
    //createPeopJson['DateEnd'] = this.addExpForm.value.endDate;
    createPeopJson['Description'] = this.addExpForm.value.description;
    createPeopJson['IsCurrent'] = isCurrent;
    createPeopJson['Location'] = this.locationArr?this.locationArr:this.addExpForm.value.address;
    createPeopJson['TotalExperience'] = Days;
    

    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(createPeopJson); }, 200);
    this.addExpForm.reset();

  }

 monthDiff(d1, d2) {
   var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
  /* 
   @Type: File, <ts>
   @Name: clickStartDate function
   @Who: Renu
   @When: 22-June-2022
     @Why:EWM-7151 EWM-7233
   @What: For status Click event
  */
  inputEventStart(startDate) {
    if(startDate){
      this.endDay = new Date(startDate);
      this.endDay.setDate(this.endDay.getDate()+1);}
     
      if (!startDate){
        this.endDay = null;
      }
  }

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who: Renu
    @When: 22-June-2022
    @Why:EWM-7151 EWM-7233
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  /*
      @Type: File, <ts>
      @Name: addAddress
      @Who: Renu
      @When: 22-June-2022
      @Why:EWM-7151 EWM-7233
      @What: To get Data from address of people
      */
  addAddress() {
    const dialogRef = this.dialog.open(QuicklocationComponent, {
      data: new Object({ address: this.addressBarData, mode: this.activityStatus }),
      panelClass: ['xeople-modal', 'add_location', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res != undefined && res != null) {
        this.addExpForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data.AddressLinkToMap)
        this.locationArr = res.data;
        this.addressBarData = res.data;
      }
    })
  }



  onChangeMapAddress() {
    const PostalCode = this.addExpForm['controls'].address['controls'].PostalCode;
    const countryId = this.addExpForm['controls'].address['controls'].CountryId;

    this.addExpForm['controls'].address['controls'].AddressLinkToMap.valueChanges.subscribe(AddressLinkToMap => {

      if (AddressLinkToMap !== '') {
        PostalCode.setValidators(null);
        countryId.setValidators(null);
      }

    })
  }

  /*
    @Type: File, <ts>
    @Name: getInternationalization function
    @Who: Renu
    @When: 22-June-2022
    @Why:EWM-7151 EWM-7233
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

  onCurrentCompany($event) {
    let currentCompany = this.addExpForm.value.IsCurrent;
    if ($event.checked !== true) {
      this.addExpForm.controls["endDate"].enable();
    } else {
      this.addExpForm.controls["endDate"].disable();
      this.addExpForm.controls["endDate"].reset();
    }

  }


    /*
    @Who: Renu
    @When: 28-june-2021
    @Why: EWM-1895
    @What: to compare objects selected
  */
    compareFn(c1: any, c2:any): boolean {     
      return c1 && c2 ?c1.Id === c2.Id : c1 === c2; 
  }
 /*
    @Type: File, <ts>
    @Name: clearStartDateEndDate function
    @Who: maneesh
    @When: 23-march-2023
    @Why: EWM-9802
    @What: For clear start  date 
     */
    clearStartDateEndDate(type:any){
      if (type==='startDate') {
        this.addExpForm.patchValue({
          startDate: null
        });
        this.endDay=null;
      }else if (type==='endDate'){
        this.addExpForm.patchValue({
          endDate: null
        });
      }
    }
}
