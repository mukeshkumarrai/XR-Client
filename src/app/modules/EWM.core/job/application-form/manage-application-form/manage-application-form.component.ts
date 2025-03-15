/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Adarsh Singh
   @When: 16-May-2022
   @Why: EWM-6552,EWM-6673
    @What:  This page wil be use only for application form
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig, statusList } from '../../../shared/datamodels';
import { ProfileInfoService } from '../../../shared/services/profile-info/profile-info.service';
import { UserAdministrationService } from '../../../shared/services/user-administration/user-administration.service';
import { ResponceData } from 'src/app/shared/models';
import { JobService } from '../../../shared/services/Job/job.service';

@Component({
  selector: 'app-manage-application-form',
  templateUrl: './manage-application-form.component.html',
  styleUrls: ['./manage-application-form.component.scss']
})
export class ManageApplicationFormComponent implements OnInit {
  applicationForm: FormGroup;
  public loading: boolean;
  public statusList: any = [];
  loadingPopup: boolean;
  selectedValue: any;
  actionType: string = 'Add';
  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = {};
  public dropDownJobTypeConfig: customDropdownConfig[] = [];
  public selectedJobType: any = {};
  public gridLanguage: any[];
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedQualification: any = {};
  public sortingValueQualification: string = "DisplaySequence,asc";
  submitted: boolean = false;
  public activestatus: string = 'Add';
  currentValueById;
  getApplicationFormId: any;
  isClicked = false;
  cloneParamId: any;
  IndustryName: any;
  JobTypeName: any;
  QualificationName: any;
  public StatusData: any[];
  StatusName: any;
  countryList:any = [];


  constructor(private translateService: TranslateService, private fb: FormBuilder,
    public _dialog: MatDialog,
    private _userAdministrationService: UserAdministrationService, private _profileInfoService: ProfileInfoService, private route: Router, private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService, public _sidebarService: SidebarService, public dialog: MatDialog, private rtlLtrService: RtlLtrService,
    private appSettingsService: AppSettingsService, private serviceListClass: ServiceListClass, private router: ActivatedRoute,
    private jobService: JobService) {

    this.applicationForm = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(100)]],
      IndustryId: ['00000000-0000-0000-0000-000000000000'],
      JobTypeId: ['00000000-0000-0000-0000-000000000000'],
      LanguageCode: [null],
      qualification: [0],
      CountryId: [0],
      CountryName: [''],
      StatusId: ["1", [Validators.required]],//<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
      IndustryName: [''],
      QualificationName: [''],
      JobTypeName: [''],
      StatusName: [''],
    });

    ////// Industry//////////////
    this.dropDownIndustryConfig['IsDisabled'] = false;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll;
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = false;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = false;

    //////Job Type//////////////
    this.dropDownJobTypeConfig['IsDisabled'] = false;
    this.dropDownJobTypeConfig['apiEndPoint'] = this.serviceListClass.getJobTypeList;
    this.dropDownJobTypeConfig['placeholder'] = 'quickjob_jobType';
    this.dropDownJobTypeConfig['IsManage'] = '/client/core/administrators/job-type';
    this.dropDownJobTypeConfig['IsRequired'] = false;
    this.dropDownJobTypeConfig['searchEnable'] = true;
    this.dropDownJobTypeConfig['bindLabel'] = 'JobType';
    this.dropDownJobTypeConfig['multiple'] = false;

    /////Qualification///////
    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.qualificationList + '?orderBy=' + this.sortingValueQualification;
    this.dropDoneConfig['placeholder'] = 'label_qualification';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = './client/core/administrators/qualification';
    this.dropDoneConfig['IsRequired'] = false;
    this.dropDoneConfig['bindLabel'] = 'QualificationName';
    this.dropDoneConfig['multiple'] = false;

  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(
      params => {
        if (params.Id != undefined && params.Id != null && params.Id != ''&& params.CId == '0') {
            this.cloneParamId= params.CId;
            this.actionType = 'Edit';
            this.getApplicationFormId = params.Id;
            this.getApplicationFormDataById(this.getApplicationFormId);
           }
        else if(params.Id != undefined && params.Id != null && params.Id != ''&& params.CId == '1') {
          this.cloneParamId= params.CId;
          this.actionType = 'Clone';
          this.getApplicationFormId = params.Id;
          this.getApplicationFormDataById(this.getApplicationFormId)
         }

      })

    this.getStatusList();
    this.getAllLanguage();

  }

  get f() { return this.applicationForm.controls; }

  /*
   @Type: File, <ts>
   @Name: onSave function
   @Who: Adarsh Singh
   @When: 16-May-2022
   @Why: EWM-6552,EWM-6673
   @What: This function is used for update and save record into database.
 */
  onSave(value) {
    this.submitted = true;
    if (this.applicationForm.invalid) {
      return;
    }
    this.isClicked = true;
    this.duplicayCheck(value,true);
  }

  /* 
    @Type: File, <ts>
    @Name: duplicayCheck function
    @Who: Adarsh Singh
   @When: 16-May-2022
   @Why: EWM-6552,EWM-6673
    @What: For checking duplicacy for manage application
   */
  duplicayCheck(value,IsSave) {
    let duplicacyExist = {};
    duplicacyExist['Id'] = 0;

    if (value == '') {
      return false;
    }
    if(this.getApplicationFormId != undefined && this.getApplicationFormId != null && this.getApplicationFormId != '' && this.actionType=='Clone'){
      duplicacyExist['Id'] = 0;
    }else{
    if (this.getApplicationFormId != undefined && this.getApplicationFormId != null && this.getApplicationFormId != '') {
      duplicacyExist['Id'] = parseInt(this.getApplicationFormId);
    } else {
      duplicacyExist['Id'] = 0;
    }
  }
    duplicacyExist['Value'] = this.applicationForm.get("Name").value;

    this.jobService.checkApplicationDuplicacy(duplicacyExist).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {
            this.applicationForm.get("Name").setErrors({ codeTaken: true });
            this.applicationForm.get("Name").markAsTouched();
            this.submitted = false;
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.applicationForm.get("Name").clearValidators();
          this.applicationForm.get("Name").markAsPristine();
          this.applicationForm.get('Name').setValidators([Validators.required, Validators.maxLength(100)]);
          this.applicationForm.get("Name").updateValueAndValidity();
          if (this.applicationForm && this.submitted == true && IsSave == true) {
            if (this.isClicked == true) {
              if (this.activestatus == 'Add') {
                this.createApplicationForm(this.applicationForm.value);
              } else if (this.activestatus == 'Update') {
                this.updateApplicationForm(this.applicationForm.value);
              }else if (this.activestatus == 'Clone') {
                this.cloneApplicationForm(this.applicationForm.value);
              }
            }
          }
        } else {
          this.applicationForm.get("Name").clearValidators();
          this.applicationForm.get("Name").markAsPristine();
          this.applicationForm.get('Name').setValidators([Validators.required, Validators.maxLength(100)]);
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
      @Type: File, <ts>
      @Name: createApplicationForm function
      @Who: Adarsh Singh
      @When: 16-May-2022
      @Why: EWM-6552,EWM-6673
      @What: For saving data for applicationForm data
     */

  createApplicationForm(value: any) {
    let formValue = this.applicationForm.value;
    let AddObj = {}
    this.loading = true;
    AddObj['Id'] = 0;
    AddObj['Name'] = formValue.Name;
    AddObj['CountryId'] = formValue.CountryId;
    AddObj['CountryName'] = formValue.CountryName;
    AddObj['IndustryId'] = formValue.IndustryId;
    AddObj['LanguageCode'] = formValue.LanguageCode;
    AddObj['QualificationId'] = formValue.qualification;
    AddObj['JobTypeId'] = formValue.JobTypeId;
    AddObj['IsDefault'] = 0;
    AddObj['StatusId'] = parseInt(formValue.StatusId);

    AddObj['IndustryName'] = this.IndustryName;
    AddObj['QualificationName'] = this.QualificationName;
    AddObj['JobTypeName'] = this.JobTypeName;
    AddObj['StatusName'] = this.StatusName;

    this.jobService.addApplicationForm(AddObj).subscribe((repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.isClicked = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       this.route.navigate(['./client/core/administrators/application-form/application-form-configure'],{
          queryParams:{Id:repsonsedata?.Data?.Id}
        });
        
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
    @Type: File, <ts>
    @Name: updateApplicationForm function
    @Who: Adarsh Singh
   @When: 16-May-2022
   @Why: EWM-6552,EWM-6673
    @What: For saving data for applicationForm data
   */

  updateApplicationForm(value: any) {
    let formValue = this.applicationForm.value;
    let AddObj = {}
    this.loading = true;
    AddObj['Id'] = parseInt(this.getApplicationFormId);
    AddObj['Name'] = formValue.Name;
    AddObj['CountryId'] = formValue.CountryId;
    AddObj['CountryName'] = formValue.CountryName;
    AddObj['IndustryId'] = formValue.IndustryId;
    AddObj['LanguageCode'] = formValue.LanguageCode;
    AddObj['QualificationId'] = formValue.qualification;
    AddObj['JobTypeId'] = formValue.JobTypeId;
    AddObj['IsDefault'] = this.currentValueById.IsDefault;
    AddObj['StatusId'] = parseInt(formValue.StatusId);

    AddObj['IndustryName'] = this.IndustryName;
    AddObj['QualificationName'] = this.QualificationName;
    AddObj['JobTypeName'] = this.JobTypeName;
    AddObj['StatusName'] = this.StatusName;

    this.jobService.addApplicationForm(AddObj).subscribe((repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.isClicked = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['./client/core/administrators/application-form/application-form-configure'],{
          queryParams:{Id:this.getApplicationFormId}
        });
        // this.route.navigate(['/client/core/administrators/tag'], {
        //   queryParams: { viewModeData }
        // })
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        this.loading = false;
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
   @Type: File, <ts>
   @Name: getApplicationFormDataById function
   @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
   @What: getting data from ID
  */

  getApplicationFormDataById(Id: Number) {
    this.loading = true;
    this.jobService.getByIdApplicationForm(Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.currentValueById = data.Data;
          this.editForm(this.currentValueById)
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
    @Type: File, <ts>
    @Name: editForm function
    @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
  @What: use for set value in patch file for showing information.
  */
  editForm(items) {
    setTimeout(() => {
      this.selectedValue = { 'Id': Number(items.CountryId), CountryName: items.CountryName };
      this.ddlchange(this.selectedValue);
    }, 2000)

    this.applicationForm.patchValue({
      Name: items.Name,
      IndustryId: items.IndustryId,
      JobTypeId: items.JobTypeId,
      LanguageCode: items.LanguageCode,
      qualification: items.QualificationId,
      // CountryId: items.CountryId,
      // CountryName: items.CountryName,
      StatusId: items.StatusId.toString(),

      IndustryName: items.IndustryName,
      QualificationName: items.QualificationName,
      JobTypeName: items.JobTypeName,
      StatusName: items.StatusName,
    });
    this.selectedIndustry = { Id: items.IndustryId, Description: items.IndustryName };
    this.selectedJobType = { Id: items.JobTypeId, JobType: items.JobTypeName };
    this.selectedQualification = { Id: items.QualificationId, QualificationName: items.QualificationName };
    if(this.cloneParamId==='1'){
      this.activestatus = 'Clone';
      this.applicationForm.patchValue({
        Name: '',
      });
      //this.duplicayCheck(items,true);
    }else{
      this.activestatus = 'Update';
    }
    

  }
  /* 
    @Type: File, <ts>
    @Name: getStatusList function
    @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
    @What: For status listing 
   */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
   @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
  @What: get selected data
*/
  ddlchange(data) {
    if (data == null || data == "") {
      this.selectedValue = null;
    }
    else {
      // this.applicationForm.get("CountryId")?.clearValidators();
      // this.applicationForm.get("CountryId")?.markAsPristine();
      this.selectedValue = data;
      this.applicationForm.patchValue(
        {
          CountryId: data.Id,
          CountryName: data.CountryName
        }
      )
    }
  }
  /////industry
  /* 
 @Type: File, <ts>
 @Name: onIndustrychange function
 @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
 @What: get industry List
 */
  onIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.selectedIndustry = null;
      this.applicationForm.patchValue(
        {
          IndustryId: null,
          SubIndustryId: null,
        })
      // this.applicationForm.get("IndustryId").setErrors({ required: true });
      // this.applicationForm.get("IndustryId").markAsTouched();
      // this.applicationForm.get("IndustryId").markAsDirty();
    }
    else {
      this.applicationForm.get("IndustryId").clearValidators();
      this.applicationForm.get("IndustryId").markAsPristine();
      this.selectedIndustry = data;
      this.IndustryName=data.Description;

      this.applicationForm.patchValue(
        {
          IndustryId: data.Id,
          IndustryName: data.Description
        }
      )
    }
    // this.clickIndustryGetSubIndustry();
  }

  ///////////////Job Type
  /* 
  @Type: File, <ts>
  @Name: onJobTypechange function
   @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
  @What: get Job Type List
  */

  onJobTypechange(data) {
    if (data == null || data == "") {
      this.selectedJobType = null;
      this.applicationForm.patchValue(
        {
          JobTypeId: null,
          JobSubTypeId: null,
        }
      )

    }
    else {
      this.applicationForm.get("JobTypeId").clearValidators();
      this.applicationForm.get("JobTypeId").markAsPristine();
      this.selectedJobType = data;
      this.JobTypeName=data.JobType;
      this.applicationForm.patchValue(
        {
          JobTypeId: data.Id,
          JobSubTypeId: null,
          JobTypeName: data.JobType,
        }
      )
    }
  }

  /*
    @Type: File, <ts>
    @Name: getAllLanguage function
     @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
    @What: call Get method from services for showing data
  */
  getAllLanguage() {
    this.loading = true;
    this._profileInfoService.getLanguage().subscribe(
      repsonsedata => {
        this.gridLanguage = repsonsedata['Data'];
        this.loading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
   @Type: File, <ts>
   @Name: onQualificationchange
    @Who: Adarsh Singh
   @When: 17-May-2022
   @Why: EWM-6552,EWM-6673
   @What: on chnage qualification data 
 */

  onQualificationchange(data) {

    if (data.Id == null || data.Id == "" || data.Id == undefined) {

    }
    else {
      this.applicationForm.get("qualification").clearValidators();
      this.applicationForm.get("qualification").markAsPristine();
      this.selectedQualification = data;
      this.QualificationName=data.QualificationName;
     
      this.applicationForm.patchValue(
        {
          qualification: data.Id,
          QualificationName: data.QualificationName
        }
      )

    }
  }
  /*
    @Type: File, <ts>
    @Name: cloneApplicationForm function
    @Who: Nitin Bhati
    @When: 26-May-2022
    @Why: EWM-6556,EWM-6686
    @What: For cloning data for applicationForm data
   */
    cloneApplicationForm(value: any) {
      let formValue = this.applicationForm.value;
      let AddObj = {}
      this.loading = true;
      AddObj['Id'] = parseInt(this.getApplicationFormId);
      AddObj['Name'] = formValue.Name;
      AddObj['CountryId'] = formValue.CountryId;
      AddObj['CountryName'] = formValue.CountryName;
      AddObj['IndustryId'] = formValue.IndustryId;
      AddObj['IndustryName'] = formValue.IndustryName;
      AddObj['LanguageCode'] = formValue.LanguageCode;
      AddObj['QualificationId'] = formValue.qualification;
      AddObj['QualificationName'] = formValue.QualificationName;
      AddObj['JobTypeId'] = formValue.JobTypeId;
      AddObj['JobTypeName'] = formValue.JobTypeName;
      AddObj['IsDefault'] = 0;
      AddObj['StatusId'] = parseInt(formValue.StatusId);
      AddObj['StatusName'] = formValue.StatusName;
  
      this.jobService.cloneApplicationForm(AddObj).subscribe((repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.route.navigate(['./client/core/administrators/application-form']);
          // this.route.navigate(['/client/core/administrators/tag'], {
          //   queryParams: { viewModeData }
          // })
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
        err => {
          this.loading = false;
          // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        });
    }

     /* 
   @Type: File, <ts>
   @Name: clickStatusID function
   @Who: Nitin Bhati
   @When: 10-Dec-2021
   @Why: EWM-4140
   @What: For status Click event
  */
  clickStatusID(Id) {
    this.StatusData = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusName = this.StatusData[0].StatusName;
    this.applicationForm.patchValue(
      {
        StatusName: this.StatusData[0].StatusName,
      }
    )
  }
}
