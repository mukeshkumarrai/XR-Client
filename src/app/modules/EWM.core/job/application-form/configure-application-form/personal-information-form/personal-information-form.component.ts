import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';


@Component({
  selector: 'app-personal-information-form',
  templateUrl: './personal-information-form.component.html',
  styleUrls: ['./personal-information-form.component.scss']
})
export class PersonalInformationFormComponent implements OnInit {
  @Input() personalInformationIdData: any;
  @Input() IsPersonalInfo = ''; // decorate the property with @Input()
  personalInfoForm: FormGroup;
  applicationFormId: number;
  loading: boolean;

  constructor(private translateService: TranslateService, private fb: FormBuilder, public _dialog: MatDialog,
    private commonService: CommonserviceService, private snackBService: SnackBarService, public _sidebarService: SidebarService,
    public dialog: MatDialog, private jobService: JobService, private routes: ActivatedRoute,) {

      
    this.personalInfoForm = this.fb.group({
      Id: [0],
      ApplicationFormId: [0],
      IsFirstNameApplicable: [true],
      IsFirstNameRequired: [true],
      IsLastNameApplicable: [true],
      IsLastNameRequired: [true],
      IsEmailApplicable: [true],
      IsEmailRequired: [true],
      IsPhoneApplicable: [true],
      IsPhoneRequired: [false],
      IsProfilePicApplicable: [true],
      IsProfilePicRequired: [false],
      IsAddressApplicable: [true],
      IsAddressRequired: [false],
      IsNoticePeriodApplicable: [false],
      IsNoticePeriodRequired: [false],
      IsSkillsApplicable: [true],
      IsSkillsRequired: [false],
      IsExperienceApplicable: [true],
      IsExperienceRequired: [false],
      IsEducationApplicable: [true],
      IsEducationRequired: [false],
      CurrentSalary: [false],
      IsExpectedSalaryRequired: [false],

      IsPositionNameRequired:[true],
      IsEmployerRequired:[true],
      IsCurrencyRequired:[false],
      IsSalaryRequired:[false],
      IsSalaryUnitRequired:[false],
      IsStartDateExpRequired:[true],
      IsEndDateExpRequired:[false],
      IsLocationExpRequired:[false],
      IsDescriptionExpRequired:[false],

      IsDegreeTypeRequired:[false],
      IsDegreeTitleRequired:[false],
      IsNameInstituteRequired:[false],
      IsNameUniversityRequired:[false],
      IsStartDateEduRequired:[false],
      IsEndDateEduRequired:[false],
      IsLocationEduRequired:[false],
      IsDescriptionEduRequired:[false],
      IsQualificationRequired:[true],
      IsScoreTypeRequired:[false],
      IsFinalScoreRequired:[false]
    });
  }

  ngOnInit(): void {

    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
        this.personalInfoForm.patchValue({
          ApplicationFormId: parseInt(parms?.Id),
        });
        this.applicationFormId = parms?.Id
        this.getPersonalInfoPagById(parseInt(parms?.Id))
      }
    });
this.sendDataToParent();
  }
  sendDataToParent() {
    this.commonService.configueApplicationForm.next(this.personalInfoForm)
  }


  /*
  @Type: File, <ts>
  @Name: getPersonalInfoPagById function
  @Who: Adarsh singh
  @When: 18-05-2022
  @Why: EWM-6553 EWM-6709
  @What: get data by id
  */
  getPersonalInfoPagById(ApplicationFormId: any) {
    this.loading = true;
    this.jobService.fetchPersonalInfoFormPageById('?applicationId=' + ApplicationFormId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.loading = false;
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            let resData = data?.Data;
            this.personalInfoForm.patchValue({
              Id: data?.Data?.Id,
              ApplicationFormId: ApplicationFormId,
              IsFirstNameApplicable: (resData.IsFirstNameApplicable == 1) ? true : false,
              IsFirstNameRequired: (resData.IsFirstNameRequired == 1) ? true : false,
              IsLastNameApplicable: (resData.IsLastNameApplicable == 1) ? true : false,
              IsLastNameRequired: (resData.IsLastNameRequired == 1) ? true : false,
              IsEmailApplicable: (resData.IsEmailApplicable == 1) ? true : false,
              IsEmailRequired: (resData.IsEmailRequired == 1) ? true : false,
              IsPhoneApplicable: (resData.IsPhoneApplicable == 1) ? true : false,
              IsPhoneRequired: (resData.IsPhoneRequired == 1) ? true : false,
              IsProfilePicApplicable: (resData.IsProfilePicApplicable == 1) ? true : false,
              IsProfilePicRequired: (resData.IsProfilePicRequired == 1) ? true : false,
              IsAddressApplicable: (resData.IsAddressApplicable == 1) ? true : false,
              IsAddressRequired: (resData.IsAddressRequired == 1) ? true : false,
              IsNoticePeriodApplicable: (resData.IsNoticePeriodApplicable == 1) ? true : false,
              IsNoticePeriodRequired: (resData.IsNoticePeriodRequired == 1) ? true : false,
              IsSkillsApplicable: (resData.IsSkillsApplicable == 1) ? true : false,
              IsSkillsRequired: (resData.IsSkillsRequired == 1) ? true : false,
              IsExperienceApplicable: (resData.IsExperienceApplicable == 1) ? true : false,
              IsExperienceRequired: (resData.IsExperienceRequired == 1) ? true : false,
              IsEducationApplicable: (resData.IsEducationApplicable == 1) ? true : false,
              IsEducationRequired: (resData.IsEducationRequired == 1) ? true : false,
              CurrentSalary: (resData.CurrentSalary == 1) ? true : false,
              IsExpectedSalaryRequired:(resData.IsExpectedSalaryRequired == 1) ? true : false,

              IsPositionNameRequired: (resData.IsPositionNameRequired == 1) ? true : false,
              IsEmployerRequired: (resData.IsEmployerRequired == 1) ? true : false,
              IsCurrencyRequired: (resData.IsCurrencyRequired == 1) ? true : false,
              IsSalaryRequired: (resData.IsSalaryRequired == 1) ? true : false,
              IsSalaryUnitRequired: (resData.IsSalaryUnitRequired == 1) ? true : false,
              IsStartDateExpRequired: (resData.IsStartDateExpRequired == 1) ? true : false,
              IsEndDateExpRequired: (resData.IsEndDateExpRequired == 1) ? true : false,
              IsLocationExpRequired: (resData.IsLocationExpRequired == 1) ? true : false,
              IsDescriptionExpRequired: (resData.IsDescriptionExpRequired == 1) ? true : false,
            
              IsDegreeTypeRequired: (resData.IsDegreeTypeRequired == 1) ? true : false,
              IsDegreeTitleRequired: (resData.IsDegreeTitleRequired == 1) ? true : false,
              IsNameInstituteRequired: (resData.IsNameInstituteRequired == 1) ? true : false,
              IsNameUniversityRequired: (resData.IsNameUniversityRequired == 1) ? true : false,
              IsStartDateEduRequired: (resData.IsStartDateEduRequired == 1) ? true : false,
              IsEndDateEduRequired: (resData.IsEndDateEduRequired == 1) ? true : false,
              IsLocationEduRequired: (resData.IsLocationEduRequired == 1) ? true : false,
              IsDescriptionEduRequired: (resData.IsDescriptionEduRequired == 1) ? true : false,
              IsQualificationRequired: (resData.IsQualificationRequired == 1) ? true : false,
            
            });
          this.sendDataToParent()
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }
/*
  @Type: File, <ts>
  @Name: activestate function
  @Who: Satya Prakash
  @When: 02-Aug-2022
  @Why: EWM-6553 EWM-6709
  @What: disable all action button
  */
  activestate(){
    return !this.IsPersonalInfo;
  }
}
