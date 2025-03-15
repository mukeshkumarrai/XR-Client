/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:  Suika
  @When: 17-Aug-2021
  @Why: EWM-2127 EWM-2243
  @What: this section handle all quick candidate experience component related functions
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
import { model, RxwebValidators } from '@rxweb/reactive-form-validators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { QuickpeopleService } from 'src/app/modules/EWM.core/shared/services/quick-people/quickpeople.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickpeopleComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quickpeople/quickpeople.component';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AddphonesComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addphones/addphones.component';
import { AddSocialComponent } from 'src/app/modules/EWM.core/shared/quick-modal/add-social/add-social.component';
import { QuicklocationComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addlocation/quicklocation.component';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { CandidateExperienceService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-experience.service';
import { CandidateExperienceMaster } from 'src/app/modules/EWM.core/shared/datamodels/candidate-experience';
import { CandidateService } from '../../EWM.core/shared/services/candidates/candidate.service';
import { ScoreTypeService } from '../../EWM.core/shared/services/candidate/score-type.service';
import { customDropdownConfig } from '../../EWM.core/shared/datamodels';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CustomValidatorService } from '../../../shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-candidate-education',
  templateUrl: './candidate-education.component.html',
  styleUrls: ['./candidate-education.component.scss']
})
export class CandidateEducationComponent implements OnInit {
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
  public candidateId;
  public editId;
  public activityStatus;
  public oldPatchValues: any;
  dirctionalLang;

  public selectedQualification: any = {};
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedDegreeType: any = {};
  public dropDoneDegreeConfig: customDropdownConfig[] = [];
  public selectedScoreType: any = {};
  public dropDoneScoreConfig: customDropdownConfig[] = [];
  public sortingValue: string = "DegreeTypeName,asc";
  public sortingValueQualification: string = "DisplaySequence,asc";
  public sortingValueScoreType: string = "ScoreTypeName,asc";
  getDateFormat:any;
  public addLocationDisabled:boolean; 
  maxMessage: number = 1000;
  constructor(public dialogRef: MatDialogRef<CandidateEducationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private textChangeLngService: TextChangeLngService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private _CandidateService: CandidateService, private serviceListClass: ServiceListClass,private appSettingsService: AppSettingsService) {
    this.candidateId = data.candidateId;
    // @Who: Bantee Kumar,@Why:EWM-10893,@When: 09-Mar-2023,@What: Add, edit, and View prefix word is missing in General information, Experience section, Education section, Dependent section, Emergency contact section.

    if(data.formType){
    this.activityStatus = data.formType;
    }

    if (this.activityStatus == "view" || this.activityStatus == "View") {
// who:maneesh,what:ewm-12040 for add location button is disabled in view mode  this.addLocationDisabled=true;,when:25/04/2023      
      this.addLocationDisabled=true;
      this.dropDoneConfig['IsDisabled'] = true;
      this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.qualificationList + '?orderBy=' + this.sortingValueQualification +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true'
      this.dropDoneConfig['placeholder'] = 'label_qualification';
      this.dropDoneConfig['searchEnable'] = true;
      this.dropDoneConfig['IsManage'] = './client/core/administrators/qualification';
      this.dropDoneConfig['IsRequired'] = true;
      this.dropDoneConfig['bindLabel'] = 'QualificationName';
      this.dropDoneConfig['multiple'] = false;


      this.dropDoneDegreeConfig['IsDisabled'] = true;
      this.dropDoneDegreeConfig['apiEndPoint'] = this.serviceListClass.degreeTypeList + '?orderBy=' + this.sortingValue +'&search=Active' +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true'
      this.dropDoneDegreeConfig['placeholder'] = 'label_degreeType';
      this.dropDoneDegreeConfig['searchEnable'] = true;
      this.dropDoneDegreeConfig['IsManage'] = './client/core/administrators/degree-type';
      this.dropDoneDegreeConfig['IsRequired'] = false;
      this.dropDoneDegreeConfig['bindLabel'] = 'DegreeTypeName';
      this.dropDoneDegreeConfig['multiple'] = false;


      this.dropDoneScoreConfig['IsDisabled'] = true;
      this.dropDoneScoreConfig['apiEndPoint'] = this.serviceListClass.scoreTypeList + '?orderBy=' + this.sortingValueScoreType +'&FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND';
      this.dropDoneScoreConfig['placeholder'] = 'label_scopeType';
      this.dropDoneScoreConfig['searchEnable'] = true;
      this.dropDoneScoreConfig['IsManage'] = './client/core/administrators/score-type';
      this.dropDoneScoreConfig['IsRequired'] = false;
      this.dropDoneScoreConfig['bindLabel'] = 'ScoreTypeName';
      this.dropDoneScoreConfig['multiple'] = false;

    } else {
// who:maneesh,what:ewm-12040 for add location button is disabled in view mode  this.addLocationDisabled=false;,when:25/04/2023      
      this.addLocationDisabled=false;
      this.dropDoneConfig['IsDisabled'] = false;
      this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.qualificationList + '?orderBy=' + this.sortingValueQualification +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&ByPassPaging=true';
      this.dropDoneConfig['placeholder'] = 'label_qualification';
      this.dropDoneConfig['searchEnable'] = true;
      this.dropDoneConfig['IsManage'] = './client/core/administrators/qualification';
      this.dropDoneConfig['IsRequired'] = true;
      this.dropDoneConfig['bindLabel'] = 'QualificationName';
      this.dropDoneConfig['multiple'] = false;


      this.dropDoneDegreeConfig['IsDisabled'] = false;
      this.dropDoneDegreeConfig['apiEndPoint'] = this.serviceListClass.degreeTypeList + '?orderBy=' + this.sortingValue +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.dropDoneDegreeConfig['placeholder'] = 'label_degreeType';
      this.dropDoneDegreeConfig['searchEnable'] = true;
      this.dropDoneDegreeConfig['IsManage'] = './client/core/administrators/degree-type';
      this.dropDoneDegreeConfig['IsRequired'] = false;
      this.dropDoneDegreeConfig['bindLabel'] = 'DegreeTypeName';
      this.dropDoneDegreeConfig['multiple'] = false;

      this.dropDoneScoreConfig['IsDisabled'] = false;
      this.dropDoneScoreConfig['apiEndPoint'] = this.serviceListClass.scoreTypeList + '?orderBy=' + this.sortingValueScoreType +'&FilterParams.ColumnName=statusname&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND';
      this.dropDoneScoreConfig['placeholder'] = 'label_scopeType';
      this.dropDoneScoreConfig['searchEnable'] = true;
      this.dropDoneScoreConfig['IsManage'] = './client/core/administrators/score-type';
      this.dropDoneScoreConfig['IsRequired'] = false;
      this.dropDoneScoreConfig['bindLabel'] = 'ScoreTypeName';
      this.dropDoneScoreConfig['multiple'] = false;
      
    }
    // @Who: bantee ,@When: 14-mar-2023, @Why: EWM-11152 ,What: add CustomValidatorService to the start date control.
    let date = new Date();
    date.setDate( date.getDate() + 1 );
    this.addForm = this.fb.group({
      Id: [''],
      degreeType: [''],
      degreeTitle: ['', [Validators.maxLength(50)]],
      institute: ['', [Validators.maxLength(100)]],
      university: ['', [Validators.maxLength(100)]],
      startDate: [null,[CustomValidatorService.dateValidator]],
      endDate: [null,[CustomValidatorService.dateValidator]],
      scoreType: [''],
      finalScore: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(10)]],
      description: ['', [Validators.maxLength(1000)]],
      qualification: [null, [Validators.required]],
      address: this.fb.group({
        'AddressLinkToMap': ['', [ Validators.maxLength(250)]],

      })
    });

    if (this.activityStatus === 'View') {
      this.addForm.disable();
    }


    if (data.editId != undefined) {
      this.editId = data.editId;
      this.getEducationById(this.editId);

    } else {
      this.candidateId = data.candidateId;
      this.activityStatus = data.formType;
    }

  }

  ngOnInit() {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.dateEnd.setDate(this.dateEnd.getDate() + 1);
    // this.getInternationalization();
   // this.getScoreTypeList();
    //this.getDegreeType();
    //this.getQualification();
    //this.onChangeMapAddress();
    // <!---------@When: 29-03-2023 @who:Adarsh singh @why: EWM-11208 --------->
    this.endDay = new Date(this.addForm.value.startDate);
    this.endDay.setDate(this.endDay.getDate() + 1);
  }


  /* 
 @Type: File, <ts>
 @Name: getGeneralInformation function
 @Who:  Suika
 @When: 17-Aug-2021
 @Why: EWM-2127 EWM-2243
 @What: For setting value in the edit form
*/
  getEducationById(id) {
    if (id) {
      this._CandidateService.getCandidateEducationListById('?id=' + id + '&candidateid=' + this.candidateId).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            this.oldPatchValues = data['Data'];
            this.addForm.patchValue({
              // degreeType: data['Data'].DegreeTypeId,
              degreeTitle: data['Data'].DegreeTitle,  
              institute: data['Data'].Institute,
              university: data['Data'].University,
              startDate: data['Data'].DateStart!=0 && data['Data'].DateStart!=null?new Date(data['Data'].DateStart):'',
              endDate: data['Data'].DateEnd!=0 && data['Data'].DateEnd!=null?new Date(data['Data'].DateEnd):'',
              // scoreType: data['Data'].ScoreTypeId,
              // finalScore: data['Data'].FinalScore,
              description: data['Data'].Description,
              qualification: data['Data'].QualificationId,
            });
            this.endDay = new Date(new Date(data['Data'].DateStart));
            this.endDay.setDate(this.endDay.getDate() + 1);

            if (data['Data'].DateStart == 0) {
              this.addForm.patchValue({
                startDate: null
              })
            }
            if (data['Data'].DateEnd == 0) {
              this.addForm.patchValue({
                endDate: null
              })
            }
            if (data['Data'].FinalScore == 0) {
              this.addForm.patchValue({
                finalScore: null
              })
            }else{
              this.addForm.patchValue({
                finalScore: data['Data'].FinalScore
              })
            }
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
            this.addForm['controls'].address['controls'].AddressLinkToMap.setValue(data.Data.CandidateLocation?.AddressLinkToMap)
            this.addressBarData = data.Data?.CandidateLocation;
            this.locationArr = data.Data?.CandidateLocation;
            let DateStart =   this.appSettingsService.getUtcDateFormat(data['Data'].DateStart); 
            let DateEnd =   this.appSettingsService.getUtcDateFormat(data['Data'].DateEnd); 
            this.oldPatchValues['DateStart'] = DateStart;
            this.oldPatchValues['DateEnd'] = DateEnd;

            this.selectedQualification = { Id: data['Data'].QualificationId, QualificationName: data['Data'].QualificationName };

            if (data['Data'].DegreeTypeId == 0) {
              this.onDegreeTypechange(null);
            }else{
              this.selectedDegreeType = { Id: data['Data'].DegreeTypeId, Name: data['Data'].DegreeType };
              this.onDegreeTypechange(this.selectedDegreeType);
            }

            if (data['Data'].ScoreTypeId == 0) {
            this.onScoreTypechange(null);
            }else{
              this.selectedScoreType = { Id: data['Data'].ScoreTypeId, Name: data['Data'].ScoreType };
              this.onScoreTypechange(this.selectedScoreType );
            }
            this.onQualificationchange(this.selectedQualification);
            if (this.activityStatus === 'View') {
              this.addForm.disable();
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
  }




  /*
  @Type: File, <ts>
  @Name: getScoreTypeList function
  @Who:  Suika
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
@Who:  Suika
@When: 17-Aug-2021
@Why: EWM-2127 EWM-2243
@What: get degree type List
*/
  getDegreeType() {
    this._CandidateService.getDegreeTypeList('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&FilterParams.FilterCondition=AND&ByPassPaging=true').subscribe(
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
@Who:  Suika
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
   @Name: add
   @Who:  Suika
   @When: 17-Aug-2021
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
    @Name: confirm-dialog.compenent.ts
    @Who:  Suika
    @When: 17-Aug-2021
    @Why: EWM-2127 EWM-2243
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onConfirm(): void {
    if (this.activityStatus == 'Add') {
      this.onEducationSave();
    } else if (this.activityStatus == 'Edit') {
      this.onEducationUpdate()
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }




  /* 
   @Type: File, <ts>
   @Name: confirm-dialog.compenent.ts
   @Who:  Suika
   @When: 17-Aug-2021
   @Why: EWM-2127 EWM-2243
   @What: Function will call when user click on ADD/EDIT BUUTONS.
 */
  onEducationSave(): void {
    if (this.addForm.invalid) {
      return;
    }
    let createPeopJson = {};
    createPeopJson['CandidateId'] = this.candidateId;
    createPeopJson['DegreeTypeId'] = this.selectedDegreeType.Id;//parseInt(this.addForm.value.degreeType);
    createPeopJson['ScoreTypeId'] = this.selectedScoreType.Id;//parseInt(this.addForm.value.scoreType);
    createPeopJson['DegreeTitle'] = this.addForm.value.degreeTitle;
    createPeopJson['Description'] = this.addForm.value.description;
    createPeopJson['FinalScore'] = this.addForm.value.finalScore ? parseInt(this.addForm.value.finalScore) : 0;
    createPeopJson['Institute'] = this.addForm.value.institute;
    createPeopJson['University'] = this.addForm.value.university;
    let DateStart = this.addForm.value.startDate ? this.appSettingsService.getUtcDateFormat(this.addForm.value.startDate) : null;
    let DateEnd =  this.addForm.value.endDate ? this.appSettingsService.getUtcDateFormat(this.addForm.value.endDate) : null;
    
    createPeopJson['DateEnd'] = DateEnd; 
    createPeopJson['DateStart'] = DateStart;
    createPeopJson['CandidateLocation'] = this.locationArr.AddressLine1 ? this.locationArr : null;
    createPeopJson['QualificationId'] = this.selectedQualification.Id;//parseInt(this.addForm.value.qualificationList)
    createPeopJson['QualificationName'] = this.selectedQualification.QualificationName;

    // console.log("education value :",createPeopJson); 
    this._CandidateService.createCandidateEducation(createPeopJson).subscribe(
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
   @Name: confirm-onEducationUpdate.compenent.ts
   @Who:  Suika
   @When: 17-Aug-2021
   @Why: EWM-2127 EWM-2243
   @What: Function will call when user click on EDIT BUTONS.
 */
  onEducationUpdate(): void {

    if (this.addForm.invalid) {
      return;
    }
    //let createPeopJson = {};
    let isCurrent: any;
    let addObj = [];
    let fromObj = {};
    let toObj = {};

    fromObj = this.oldPatchValues;
    let FromDateStart =   this.appSettingsService.getUtcDateFormat(this.oldPatchValues.DateStart); 
    let FromDateEnd =   this.appSettingsService.getUtcDateFormat(this.oldPatchValues.DateEnd);
    fromObj['DateStart'] = FromDateStart;
    fromObj['DateEnd'] = FromDateEnd;
    toObj['Id'] = this.editId;
    toObj['CandidateId'] = this.candidateId;
    toObj['DegreeTypeId'] = this.selectedDegreeType?.Id;//parseInt(this.addForm.value.degreeType);
    toObj['ScoreTypeId'] = this.selectedScoreType?.Id;//parseInt(this.addForm.value.scoreType);
    toObj['DegreeTitle'] = this.addForm.value.degreeTitle;
    toObj['Description'] = this.addForm.value.description;
    toObj['FinalScore'] = this.addForm.value.finalScore ? parseInt(this.addForm.value.finalScore) : 0;
    toObj['Institute'] = this.addForm.value.institute;
    toObj['University'] = this.addForm.value.university;
    let DateStart =   this.appSettingsService.getUtcDateFormat(this.addForm.value.startDate); 
    let DateEnd =   this.appSettingsService.getUtcDateFormat(this.addForm.value.endDate);
    toObj['DateEnd'] = DateEnd;
    toObj['DateStart'] = DateStart;
    toObj['CandidateLocation'] = this.locationArr;
    // toObj['CandidateLocation']['StateId'] = this.addForm.value.address.StateId?parseInt(this.addForm.value.address.StateId):0;
    //  toObj['CandidateLocation']['TypeId'] = this.addForm.value.address.TypeId?parseInt(this.addForm.value.address.TypeId):0;
    toObj['QualificationId'] = this.selectedQualification.Id;//parseInt(this.addForm.value.qualification)
    toObj['QualificationName'] = this.selectedQualification.QualificationName;

    addObj = [{
      "From": fromObj,
      "To": toObj
    }];
    // console.log("update:", addObj);
    this._CandidateService.updateCandidateEducation(addObj[0]).subscribe(
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
    @When: 17-Aug-2021
    @Why: EWM-2127 EWM-2243
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
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
     @Who:  Suika
     @When: 17-Aug-2021
     @Why: EWM-2127 EWM-2243
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

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	

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
   @Who: Suika
   @When: 18-Aug-2021
   @Why: EWM-2243
   @What: when realtion drop down changes 
 */

  onQualificationchange(data) {
    if (data == null || data == "" || data==undefined) {
      this.selectedQualification = null;
      this.addForm.patchValue(
        {
          qualification: null
        }
      )
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
    @Who: Suika
    @When: 18-Aug-2021
    @Why: EWM-2243
    @What: when realtion drop down changes 
  */

  onDegreeTypechange(data) {
    
    if (data == null || data == "" || data == undefined) {
      this.selectedDegreeType = null;
      this.addForm.patchValue(
        {
          degreeType: null
        }
      )
      // this.addForm.get("degreeType").setErrors({ required: true });
      // this.addForm.get("degreeType").markAsTouched();
      // this.addForm.get("degreeType").markAsDirty();
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
    @Who: Suika
    @When: 18-Aug-2021
    @Why: EWM-2243
    @What: when realtion drop down changes 
  */

  onScoreTypechange(data) {
    if (data == null || data == "") {
      this.selectedScoreType = null;
      this.addForm.patchValue(
        {
          scoreType: null
        }
      )
      // this.addForm.get("scoreType").setErrors({ required: true });
      // this.addForm.get("scoreType").markAsTouched();
      // this.addForm.get("scoreType").markAsDirty();
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
     @Who: Nitin Bhati
     @When: 24-Sep-2021
      @Why: EWM-2529
     @What: For status Click event
    */
  isErrorEndDay:boolean;
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
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear start  date 
     */
    clearStartDate(e){
      this.addForm.patchValue({
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
      this.addForm.patchValue({
        endDate: null
      });
    }

    public onMessage(value: any) {
      if (value != undefined && value != null) {
        // <!------------@suika @EWM-14081 EWM-14083 @whn 28-09-2023--------------------->
        this.maxMessage = 1000 - value.length;
        if(value?.length>1000){
          this.addForm.get('description').markAsTouched();
          this.addForm.get('description').setErrors({maxlength:true});
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
