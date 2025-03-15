/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: educstion-popup.component.ts
 @Who: Renu
 @When: 22-June-2022
 @Why: ROST-7151 EWM-7233
 @What: education popup
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { QuicklocationComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-education-popup',
  templateUrl: './education-popup.component.html',
  styleUrls: ['./education-popup.component.scss']
})
export class EducationPopupComponent implements OnInit {

  /**********************global variables decalared here **************/
  visible = true;
  selectable = true;
  removable = true;
  phone: any = [];
  socials: any = [];
  emails: any = []
  public addressBarData: any;
  addForm: FormGroup;
  public organizationData = [];
  public OrganizationId: string;
  public userTypeList: any = [];
  public numberPattern = "^[0-9]*$";
  public specialcharPattern = "^[a-z A-Z]+$";
  public statusList: any = [];
  public locationArr: any = {};
  public selectedValue: any;
  public countryId: number;
  public pageNumber: any = 1;
  public pageSize: any = 500;
  public countryList = [];
  public StateList: any = [];
  employee: any;
  scoreTypelist: any = [];
  degreeTypeList: any = [];
  qualificationList: any = [];
  salaryList: [] = [];
  dateStart = new Date();
  dateEnd = new Date();
  today = new Date();
  datePublish = new Date();
  endDay: Date;
  public editData;
  public activityStatus;
  public oldPatchValues: any;

  public selectedQualification: any = {};
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedDegreeType: any = {};
  public dropDoneDegreeConfig: customDropdownConfig[] = [];
  public selectedScoreType: any = {};
  public dropDoneScoreConfig: customDropdownConfig[] = [];
  public sortingValue: string = "DegreeTypeName,asc";
  public sortingValueQualification: string = "DisplaySequence,asc";
  public sortingValueScoreType: string = "ScoreTypeName,asc";
  eduInfo: any;
  getDateFormat:any;

  constructor(public dialogRef: MatDialogRef<EducationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private textChangeLngService: TextChangeLngService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private _CandidateService: CandidateService, private serviceListClass: ServiceListClass,private appSettingsService: AppSettingsService) {
   
    this.activityStatus = data.formType;
    this.eduInfo=data.resData;
    if (this.activityStatus == "view" || this.activityStatus == "View") {
      this.dropDoneConfig['IsDisabled'] = true;
      this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.qualificationList + '?orderBy=' + this.sortingValueQualification;
      this.dropDoneConfig['placeholder'] = 'label_qualification';
      this.dropDoneConfig['searchEnable'] = true;
      this.dropDoneConfig['IsManage'] = '';
      this.dropDoneConfig['IsRequired'] = (this.eduInfo?.IsQualificationRequired==1)?true:false;
      this.dropDoneConfig['bindLabel'] = 'QualificationName';
      this.dropDoneConfig['multiple'] = false;
      this.dropDoneConfig['IsRefresh'] = false;


      this.dropDoneDegreeConfig['IsDisabled'] = true;
      this.dropDoneDegreeConfig['apiEndPoint'] = this.serviceListClass.degreeTypeList + '?orderBy=' + this.sortingValue + '&search=Active';
      this.dropDoneDegreeConfig['placeholder'] = 'label_degreeType';
      this.dropDoneDegreeConfig['searchEnable'] = true;
      this.dropDoneDegreeConfig['IsManage'] = '';
      this.dropDoneDegreeConfig['IsRequired'] = (this.eduInfo?.IsDegreeTypeRequired==1)?true:false;
      this.dropDoneDegreeConfig['bindLabel'] = 'DegreeTypeName';
      this.dropDoneDegreeConfig['multiple'] = false;
      this.dropDoneDegreeConfig['IsRefresh'] = false;

      this.dropDoneScoreConfig['IsDisabled'] = true;
      this.dropDoneScoreConfig['apiEndPoint'] = this.serviceListClass.scoreTypeList + '?orderBy=' + this.sortingValueScoreType;
      this.dropDoneScoreConfig['placeholder'] = 'label_scopeType';
      this.dropDoneScoreConfig['searchEnable'] = true;
      this.dropDoneScoreConfig['IsManage'] = '';
      this.dropDoneScoreConfig['IsRequired'] = (this.eduInfo?.IsScoreTypeRequired==1)?true:false;
      this.dropDoneScoreConfig['bindLabel'] = 'ScoreTypeName';
      this.dropDoneScoreConfig['multiple'] = false;
      this.dropDoneScoreConfig['IsRefresh'] = false;

    } else {

      this.dropDoneConfig['IsDisabled'] = false;
      this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.qualificationList + '?orderBy=' + this.sortingValueQualification;
      this.dropDoneConfig['placeholder'] = 'label_qualification';
      this.dropDoneConfig['searchEnable'] = true;
      this.dropDoneConfig['IsManage'] = '';
      this.dropDoneConfig['IsRequired'] = (this.eduInfo?.IsQualificationRequired==1)?true:false;
      this.dropDoneConfig['bindLabel'] = 'QualificationName';
      this.dropDoneConfig['multiple'] = false;
      this.dropDoneConfig['IsRefresh'] = false;

      this.dropDoneDegreeConfig['IsDisabled'] = false;
      this.dropDoneDegreeConfig['apiEndPoint'] = this.serviceListClass.degreeTypeList + '?orderBy=' + this.sortingValue;
      this.dropDoneDegreeConfig['placeholder'] = 'label_degreeType';
      this.dropDoneDegreeConfig['searchEnable'] = true;
      this.dropDoneDegreeConfig['IsManage'] = '';
      this.dropDoneDegreeConfig['IsRequired'] = (this.eduInfo?.IsDegreeTypeRequired==1)?true:false;
      this.dropDoneDegreeConfig['bindLabel'] = 'DegreeTypeName';
      this.dropDoneDegreeConfig['multiple'] = false;
      this.dropDoneDegreeConfig['IsRefresh'] = false;

      this.dropDoneScoreConfig['IsDisabled'] = false;
      this.dropDoneScoreConfig['apiEndPoint'] = this.serviceListClass.scoreTypeList + '?orderBy=' + this.sortingValueScoreType;
      this.dropDoneScoreConfig['placeholder'] = 'label_scopeType';
      this.dropDoneScoreConfig['searchEnable'] = true;
      this.dropDoneScoreConfig['IsManage'] = '';
      this.dropDoneScoreConfig['IsRequired'] = (this.eduInfo?.IsScoreTypeRequired==1)?true:false;
      this.dropDoneScoreConfig['bindLabel'] = 'ScoreTypeName';
      this.dropDoneScoreConfig['multiple'] = false;
      this.dropDoneScoreConfig['IsRefresh'] = false;
    }
    let date = new Date();
    date.setDate( date.getDate() + 1 );
    this.addForm = this.fb.group({
      Id: [''],
      degreeType: [],
      degreeTitle: [],
      institute: [],
      university: [],
      startDate: [new Date(),this.eduInfo?.IsStartDateEduRequired==0 ? [CustomValidatorService.dateValidator] : [Validators.required,CustomValidatorService.dateValidator]],
      endDate: [date,this.eduInfo?.IsEndDateEduRequired==0 ? [CustomValidatorService.dateValidator] : [Validators.required,CustomValidatorService.dateValidator]],
      scoreType: [],
      finalScore: [],
      description: [],
      qualification: [],
      address: this.fb.group({
        'AddressLinkToMap': [],

      }),
      
    });
    //this.addForm.controls.startDate.setValidators(this.eduInfo?.IsStartDateEduRequired==0 ? null : [Validators.required ,CustomValidatorService.dateValidator]);
  // this.addForm.controls.startDate.updateValueAndValidity();
    if (this.activityStatus === 'view') {
      this.addForm.disable();
    }

    if (data.editData != '') {
      this.editData = data.editData;
      this.patchEduForm(this.editData);
      this.activityStatus = data.formType;
    }

  }

  ngOnInit() {
    if(this.eduInfo){
     setTimeout(() => {
      this.addForm.controls.institute.setValidators(this.eduInfo?.IsNameInstituteRequired==0 ? [Validators.maxLength(100)] : [Validators.required, Validators.maxLength(100)]);
      this.addForm.controls.institute.updateValueAndValidity();

      this.addForm.controls.degreeTitle.setValidators(this.eduInfo?.IsDegreeTitleRequired==0 ?  [Validators.maxLength(50)] : [Validators.required,Validators.maxLength(50)]);
      this.addForm.controls.degreeTitle.updateValueAndValidity();

      this.addForm.controls.university.setValidators(this.eduInfo?.IsNameUniversityRequired==0 ?  [Validators.maxLength(100)] :  [Validators.required, Validators.maxLength(100)]);
      this.addForm.controls.university.updateValueAndValidity();

      // this.addForm.controls.startDate.setValidators(this.eduInfo?.IsStartDateEduRequired==0 ? null : [Validators.required ,CustomValidatorService.dateValidator]);
      // this.addForm.controls.startDate.updateValueAndValidity();

      // this.addForm.controls.startDate.setValidators(this.eduInfo?.IsStartDateEduRequired==0 ? null : [Validators.required, CustomValidatorService.dateValidator]);
      // this.addForm.controls.startDate.updateValueAndValidity();

      // this.addForm.controls.endDate.setValidators(this.eduInfo?.IsEndDateEduRequired==0 ? null : [Validators.required ,CustomValidatorService.dateValidator]);
      // this.addForm.controls.endDate.updateValueAndValidity();
    
      this.addForm.controls.address['controls'].AddressLinkToMap.setValidators(this.eduInfo?.IsLocationEduRequired==0 ? [ Validators.maxLength(250)] : [Validators.required, Validators.maxLength(250)]);
      this.addForm.controls.address['controls'].AddressLinkToMap.updateValueAndValidity();
      
      this.addForm.controls.description.setValidators(this.eduInfo?.IsDescriptionEduRequired==0 ? [Validators.maxLength(1000)] : [Validators.required,Validators.maxLength(1000)]);
      this.addForm.controls.description.updateValueAndValidity();

      this.addForm.controls.finalScore.setValidators(this.eduInfo?.IsFinalScoreRequired==0 ? [Validators.pattern(this.numberPattern), Validators.maxLength(10)] : [Validators.required, Validators.pattern(this.numberPattern), Validators.maxLength(10)]);
      this.addForm.controls.finalScore.updateValueAndValidity();
      
       // --------@When: 01-12-2022 @who:Adarsh singh @why: EWM-9574 Desc: missing code for 3 dropdown also add setTimeout for setting validation while load page --------
      this.addForm.controls.qualification.setValidators(this.eduInfo?.IsQualificationRequired==0 ? [] : [Validators.required]);
      this.addForm.controls.qualification.updateValueAndValidity();

      this.addForm.controls.degreeType.setValidators(this.eduInfo?.IsDegreeTypeRequired==0 ? [] : [Validators.required]);
      this.addForm.controls.degreeType.updateValueAndValidity();

      this.addForm.controls.scoreType.setValidators(this.eduInfo?.IsScoreTypeRequired==0 ? [] : [Validators.required]);
      this.addForm.controls.scoreType.updateValueAndValidity();
      // END 
     }, 500);
      
    }
   // <!-- @Who: bantee ,@When: 12-04-2023, @Why: EWM-11854 ,What: add CustomValidatorService to the start date control -->
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;

    this.dateEnd.setDate(this.dateEnd.getDate() + 1);
    // this.getInternationalization();
    // this.getScoreTypeList();
    //this.getDegreeType();
    //this.getQualification();
    //this.onChangeMapAddress();
    this.endDay = new Date(this.addForm.value.startDate);
    this.endDay.setDate(this.endDay.getDate() + 1);
    console.log(this.addForm)
  }


  /* 
  @Type: File, <ts>
  @Name: getGeneralInformation function
  @Who:  Renu
  @When: 17-Aug-2021
  @Why: EWM-2127 EWM-2243
  @What: For setting value in the edit form
  */
  patchEduForm(editData:any) {
          this.oldPatchValues = editData['Data'];
          this.addForm.patchValue({
            degreeType: editData.DegreeTypeId,
            degreeTitle: editData.DegreeTitle,
            institute: editData.Institute,
            university: editData.University,
            startDate: new Date(editData.DateStart),
            endDate: new Date(editData.DateEnd),
            scoreType: editData.ScoreTypeId,
            finalScore:editData.FinalScore,
            description: editData.Description,
            qualification: editData.QualificationId,
          });
          this.endDay = new Date(new Date(editData.DateStart));
          this.endDay.setDate(this.endDay.getDate() + 1);
          //  this.addForm.get('address').patchValue({         
          //    AddressLinkToMap: data['Data']['CandidateLocation'].AddressLinkToMap,
          //    Name:data['Data']['CandidateLocation'].Name,
          //    TypeId:data['Data']['CandidateLocation'].TypeId,             
          //    AddressLine1:data['Data']['CandidateLocation'].AddressLine1,
          //    AddressLine2:data['Data']['CandidateLocation'].AddressLine2,
          //    District_Suburb:data['Data']['CandidateLocation'].District_Suburb,
          //    TownCity:data['Data']['CandidateLocation'].TownCity,
          //    StateId:data['Data']['CandidateLocation'].StateId,
          //    PostalCode:data['Data']['CandidateLocation'].PostalCode,
          //    Longitude:data['Data']['CandidateLocation'].Longitude,
          //    Latitude:data['Data']['CandidateLocation'].Latitude,
          //    CountryId:data['Data']['CandidateLocation'].CountryId
          //     });
          this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(editData.CandidateLocation.AddressLinkToMap)
          this.addressBarData =editData.CandidateLocation;
          this.locationArr = editData.CandidateLocation;

          this.selectedQualification = { Id:editData.QualificationId, Name: editData.QualificationName };
          this.selectedDegreeType = { Id: editData.DegreeTypeId, Name: editData.DegreeType };
          this.selectedScoreType = { Id: editData.ScoreTypeId, Name: editData.ScoreType };
          this.onQualificationchange(this.selectedQualification);
          this.onDegreeTypechange(this.selectedDegreeType);
          this.onScoreTypechange(this.selectedScoreType);
          if (this.activityStatus === 'view') {
            this.addForm.disable();
          }

      
  }




  /*
  @Type: File, <ts>
  @Name: getScoreTypeList function
  @Who:  Renu
  @When: 17-Aug-2021
  @Why: EWM-2127 EWM-2243
  @What: For showing the list of Score Type data
  */
  getScoreTypeList() {
    this._CandidateService.getScoreTypeList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.scoreTypelist = repsonsedata.Data;
        } else if (repsonsedata.HttpStatusCode == '400') {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
  @Type: File, <ts>
  @Name: getCurrencyAll function
  @Who:  Renu
  @When: 17-Aug-2021
  @Why: EWM-2127 EWM-2243
  @What: get degree type List
  */
  getDegreeType() {
    this._CandidateService.getDegreeTypeList('&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.degreeTypeList = repsonsedata.Data.filter(x => x['Status'] === "Active");
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
  @Name: getQualification function
  @Who:  Renu
  @When: 17-Aug-2021
  @Why: EWM-2127 EWM-2243
  @What: get qualification List
  */
  getQualification() {
    this._CandidateService.getQualificationList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.qualificationList = repsonsedata.Data;
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
    @Name: confirm-dialog.compenent.ts
    @Who:  Renu
    @When: 17-Aug-2021
    @Why: EWM-2127 EWM-2243
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(): void {
    if (this.activityStatus == 'add') {
      this.onEducationSave();
    } else if (this.activityStatus == 'edit') {
      this.onEducationUpdate()
    }
  }




  /* 
   @Type: File, <ts>
   @Name: confirm-dialog.compenent.ts
   @Who:  Renu
   @When: 17-Aug-2021
   @Why: EWM-2127 EWM-2243
   @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onEducationSave(): void {
    if (this.addForm.invalid) {
      return;
    }
    let createPeopJson = {};
    createPeopJson['DegreeTypeId'] = this.selectedDegreeType.Id;//parseInt(this.addForm.value.degreeType);
    createPeopJson['ScoreTypeId'] = this.selectedScoreType.Id;//parseInt(this.addForm.value.scoreType);
    createPeopJson['DegreeTitle'] = this.addForm.value.degreeTitle;
    createPeopJson['Description'] = this.addForm.value.description;
    createPeopJson['FinalScore'] = parseInt(this.addForm.value.finalScore);
    createPeopJson['Institute'] = this.addForm.value.institute;
    createPeopJson['University'] = this.addForm.value.university;
    createPeopJson['DateEnd'] = this.addForm.value.endDate;
    createPeopJson['DateStart'] = this.addForm.value.startDate;
    createPeopJson['CandidateLocation'] = this.locationArr;
    createPeopJson['QualificationId'] = this.selectedQualification.Id;//parseInt(this.addForm.value.qualificationList)

    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(createPeopJson); }, 200);
    this.addForm.reset();

  }

  /* 
   @Type: File, <ts>
   @Name: confirm-onEducationUpdate.compenent.ts
   @Who:  Renu
   @When: 17-Aug-2021
   @Why: EWM-2127 EWM-2243
   @What: Function will call when user click on EDIT BUTONS.
  */
  onEducationUpdate(): void {

    if (this.addForm.invalid) {
      return;
    }
    let createPeopJson = {};
    createPeopJson['DegreeTypeId'] = this.selectedDegreeType.Id;//parseInt(this.addForm.value.degreeType);
    createPeopJson['ScoreTypeId'] = this.selectedScoreType.Id;//parseInt(this.addForm.value.scoreType);
    createPeopJson['DegreeTitle'] = this.addForm.value.degreeTitle;
    createPeopJson['Description'] = this.addForm.value.description;
    createPeopJson['FinalScore'] = parseInt(this.addForm.value.finalScore);
    createPeopJson['Institute'] = this.addForm.value.institute;
    createPeopJson['University'] = this.addForm.value.university;
    createPeopJson['DateEnd'] = this.addForm.value.endDate;
    createPeopJson['DateStart'] = this.addForm.value.startDate;
    createPeopJson['CandidateLocation'] = this.locationArr;
    createPeopJson['QualificationId'] = this.selectedQualification.Id;//parseInt(this.addForm.value.qualificationList)

    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(createPeopJson); }, 200);
    this.addForm.reset();
  }

  /* 
    @Type: File, <ts>
    @Name: onDismiss
    @Who:  Renu
    @When: 22-June-2021
    @Why: EWM-7151 EWM-7233
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    document.getElementsByClassName("add_people")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_people")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    
  }


  /*
     @Type: File, <ts>
     @Name: addAddress
     @Who:  Renu
    @When: 22-June-2021
    @Why: EWM-7151 EWM-7233
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
        this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(res.data.AddressLinkToMap)
        this.locationArr = res.data;
        this.addressBarData = res.data;
      }
    })
  }






  onChangeMapAddress() {
    const PostalCode = this.addForm['controls'].address['controls'].PostalCode;
    const countryId = this.addForm['controls'].address['controls'].CountryId;

    this.addForm['controls'].address['controls'].AddressLinkToMap.valueChanges.subscribe(AddressLinkToMap => {

      if (AddressLinkToMap !== '') {
        PostalCode.setValidators(null);
        countryId.setValidators(null);
      }

    })
  }

  /* 
   @Type: File, <ts>
   @Name: onQualificationchange
   @Who: Renu
    @When: 22-June-2021
    @Why: EWM-7151 EWM-7233
   @What: when realtion drop down changes 
  */

  onQualificationchange(data) {
    if (data== null || data== "" || data== undefined) {
      this.addForm.get("qualification").setErrors({ required: true });
      this.addForm.get("qualification").markAsTouched();
      this.addForm.get("qualification").markAsDirty();
    }
    else {
      this.addForm.get("qualification").clearValidators();
      this.addForm.get("qualification").markAsPristine();
      this.selectedQualification = data;
      this.addForm.patchValue(
        {
          qualification: data.Id
        }
      )

    }
  }




  /* 
    @Type: File, <ts>
    @Name: onDegreeTypechange
    @Who: Renu
   @When: 22-June-2021
    @Why: EWM-7151 EWM-7233
    @What: when realtion drop down changes 
  */

  onDegreeTypechange(data) {
    if (data == null || data == "" || data == undefined) {
      this.addForm.get("degreeType").setErrors({ required: true });
      this.addForm.get("degreeType").markAsTouched();
      this.addForm.get("degreeType").markAsDirty();
    }
    else {
      this.addForm.get("degreeType").clearValidators();
      this.addForm.get("degreeType").markAsPristine();
      this.selectedDegreeType = data;
      this.addForm.patchValue(
        {
          degreeType: data.Id
        }
      )

    }
  }


  /* 
    @Type: File, <ts>
    @Name: onScoreTypechange
    @Who: Renu
   @When: 22-June-2021
    @Why: EWM-7151 EWM-7233
    @What: when realtion drop down changes 
  */

  onScoreTypechange(data) {
    if (data == null || data == "") {
      this.addForm.get("scoreType").setErrors({ required: true });
      this.addForm.get("scoreType").markAsTouched();
      this.addForm.get("scoreType").markAsDirty();
    }
    else {
      this.addForm.get("scoreType").clearValidators();
      this.addForm.get("scoreType").markAsPristine();
      this.selectedScoreType = data;
      this.addForm.patchValue(
        {
          scoreType: data.Id
        }
      )

    }
  }

  /* 
     @Type: File, <ts>
     @Name: clickStartDate function
     @Who:Renu
   @When: 22-June-2021
    @Why: EWM-7151 EWM-7233
     @What: For status Click event
    */
  inputEventStart(startDate) {
    // let startDate = this.addForm.get("startDate").value;
    // this.endDay = new Date(event.value);
    // this.endDay.setDate(this.endDay.getDate() + 1);
   // <!-- @Who: bantee ,@When: 12-04-2023, @Why: EWM-11854 ,What: add CustomValidatorService to the start date control -->
    if(startDate){
      this.endDay = new Date(startDate);
      this.endDay.setDate(this.endDay.getDate()+1);}
      
      if (!startDate){
        this.endDay = null;
      }
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
        this.addForm.patchValue({
          startDate: null
        });
        this.endDay=null;
      }else if (type==='endDate'){
        this.addForm.patchValue({
          endDate: null
        });
      }
    }
}

