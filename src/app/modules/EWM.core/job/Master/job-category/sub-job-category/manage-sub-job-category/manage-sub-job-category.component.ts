/*
 @Type: File, <ts>
 @Name: subJobcategory component
 @Who: Nitin Bhati
 @When: 21-June-2021
 @Why: EWM-1821/1823
 @What: For setting value in the edit form
*/

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SubJobCategory } from '../../../../../shared/datamodels/job-category';
import { SystemSettingService } from '../../../../../shared/services/system-setting/system-setting.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';

@Component({
  selector: 'app-manage-sub-job-category',
  templateUrl: './manage-sub-job-category.component.html',
  styleUrls: ['./manage-sub-job-category.component.scss']
})
export class ManageSubJobCategoryComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public jobJsonObj = {};
  public isHideExternally: number = 1;
  public isBuiltIn: number = 1;
  public industryId;
  public IndustryDescription: string;
  public maxCharacterLengthSubHead = 130;
  tempID: string;
  public statusList: any = [];
  public gridRegion: any = [];
  public gridExpertise: any = [];
  public jobCategoryAutoId;
  public ExpertiseName;
  public categoryId;
  public specialcharPattern = "[A-Za-z0-9. ]+$";
  viewModeValue: any;
  public catogryName:string;
  public isResponseGet:boolean = false;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public _jobCategoryService: JobService, private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService,
    private translateService: TranslateService, private _systemSettingService: SystemSettingService) {
    this.addForm = this.fb.group({
      Id: [''],
      JobSubCategory: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.specialcharPattern)]],
      JobCategoryId: ['', Validators.required],
      RegionId: [null, Validators.required],
      Status: ['1', Validators.required],//  <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
    });
  }

  ngOnInit(): void {
    this.getAllJobCategory();
    this.getAllRegion();
    this.getStatusList();
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.jobCategoryAutoId = localStorage.getItem('JobCategoryId');
    this.categoryId=this.jobCategoryAutoId;//who:maneesh,what:ewm-15708 ,when:16/01/2024
    this.route.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.actionStatus = 'Edit'
          this.tempID = params['id'];
          this.editForm(this.tempID);
        } else if(params['JobCategoryId']!= undefined || params['JobCategoryId']!= null){
          this.categoryId=params['JobCategoryId'];
          this.addForm.patchValue({
            JobCategoryId:params['JobCategoryId']
          });

        }
      });
    this.route.queryParams.subscribe((params) => {
      this.viewModeValue = params['viewModeData'];
    })

  }

  /*
      @Type: File, <ts>
      @Name: getAllRegion function
      @Who: Nitin Bhati
      @When: 21-June-2021
      @Why: EWM-1823
      @What:call Get method from services for region data.
    */
  getAllRegion() {
    this._systemSettingService.getRegion().subscribe(
      (data: SubJobCategory) => {
        this.gridRegion = data.Data;
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
      @Type: File, <ts>
      @Name: getAllJobCategory function
      @Who: Nitin Bhati
      @When: 21-June-2021
      @Why: EWM-1823
      @What:call Get method from services for showing data into grid.
    */
  getAllJobCategory() {
    this._jobCategoryService.getJobCategoryAllList().subscribe(
      (data: SubJobCategory) => {
        this.gridExpertise = data.Data;        
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
   @Type: File, <ts>
   @Name: addPatchForm function
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1823
   @What: For setting value in the patch form data
  */
  addPatchForm(Id: String) {
    this.loading = true;
    this._jobCategoryService.getJobCategoryById('?Id=' + Id).subscribe(
      (data: SubJobCategory) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.categoryId = data.Data.Id;
          this.addForm.controls["RegionId"].disable();
          this.addForm.controls["JobCategoryId"].disable();
          this.addForm.patchValue({
            Id: Id,
            RegionId: data.Data.RegionId.toString(),
          });
          this.addForm.patchValue({
            JobCategoryId: this.categoryId
          });
        } else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        } else {
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
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1823
   @What: For setting value in the edit form
  */
  editForm(Id: String) {
    this.loading = true;
    this._jobCategoryService.getSubJobCategoryById('?Id=' + Id + '&JobCategoryId=' + this.jobCategoryAutoId).subscribe(
      (data: SubJobCategory) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.categoryId = data.Data.JobCategoryId;
          this.addForm.controls["RegionId"].disable();
          this.addForm.controls["JobCategoryId"].disable();
          this.addForm.patchValue({
            Id: Id,
            RegionId: data.Data.RegionId.toString(),
            JobSubCategory: data.Data.JobSubCategory,
            JobCategoryId: data.Data.JobCategoryId,
            Status: data.Data.Status.toString(),
          });
        } else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

        } else {
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
   @Name: onSave function
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1823
   @What: For setting value in the save form
  */
  onSave(value, actionStatus) {
  this.isResponseGet = true;
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.onSubCategoryNameChanges(true);
  }
  /*
   @Type: File, <ts>
   @Name: createSubJobCategory function
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1821
   @What: For setting value in the add form
  */
  createSubJobCategory(value) {
    this.loading = true;
    this.isResponseGet = true;
    //console.log(value)
    this.jobJsonObj['JobSubCategory'] = value.JobSubCategory;
    this.jobJsonObj['JobCategoryId'] = this.categoryId;
    this.jobJsonObj['Status'] = parseInt(value.Status);
    this._jobCategoryService.createSubJobCategory(this.jobJsonObj).subscribe((repsonsedata: SubJobCategory) => {

      if (repsonsedata.HttpStatusCode == 200) {
        this.loading = false;
        this.isResponseGet = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.router.navigate(['./client/core/administrators/job-category/sub-job-category', { id: this.categoryId }]);

        // let viewModeData: any = this.viewModeValue;
        // this.router.navigate(['./client/core/administrators/job-category/sub-job-category', { id: this.categoryId }], {
        //   queryParams: { viewModeData }
        // });

      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;

      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.isResponseGet = false;

        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.isResponseGet = false;

      });

  }

  /*
   @Type: File, <ts>
   @Name: updateSubJobCategoryById function
   @Who: Nitin Bhati
   @When: 22-June-2021
   @Why: ROST-1823
   @What: For setting value in the update form
  */
  updateSubJobCategoryById(value) {
    this.loading = true;
    this.isResponseGet = true;
    //console.log(value)
    this.jobJsonObj['Id'] = parseInt(value.Id);
    this.jobJsonObj['JobCategoryId'] = this.jobCategoryAutoId;
    this.jobJsonObj['JobSubCategory'] = value.JobSubCategory;
    this.jobJsonObj['Status'] = parseInt(value.Status);
    this._jobCategoryService.updateSubJobCategoryById(this.jobJsonObj).subscribe((repsonsedata: SubJobCategory) => {
      if (repsonsedata.HttpStatusCode == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        // let viewModeData: any = this.viewModeValue;
        // this.router.navigate(['./client/core/administrators/job-category/sub-job-category', { id: this.categoryId }], {
        //   queryParams: { viewModeData }
        // });
        this.router.navigate(['./client/core/administrators/job-category/sub-job-category', { id: this.categoryId }]);
      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.isResponseGet = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.isResponseGet = false; 
      });

  }
  /*
  @Type: File, <ts>
  @Name: onCancel function
  @Who:  Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1821
  @What: This function is used for cancel
  */
  onCancel(e) {
    e.preventDefault();
    this.addForm.reset();
    this.actionStatus = 'Add';
    // let viewModeData: any = this.viewModeValue;
    // this.router.navigate(['./client/core/administrators/job-category/sub-job-category', { id: this.categoryId }], {
    //   queryParams: { viewModeData }
    // });
    this.router.navigate(['./client/core/administrators/job-category/sub-job-category', { id: this.categoryId }]);
  }
  /*
  @Type: File, <ts>
  @Name: onSubCategoryNameChanges function
  @Who:  Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1821
  @What: This function is used for checking duplicacy for code
  */
  onSubCategoryNameChanges(isSave) {
    let alreadyExistCheckObj = {};
    let subexpertiseId;
    if (this.tempID != undefined) {
      subexpertiseId = this.tempID;
    } else {
      subexpertiseId = 0;
    }
    alreadyExistCheckObj['Id'] = parseInt(subexpertiseId);
    alreadyExistCheckObj['JobCategoryId'] = this.categoryId;
    alreadyExistCheckObj['Value'] = this.addForm.get("JobSubCategory").value;
    if (this.addForm.get("JobSubCategory").value) {
      this._jobCategoryService.checkSubJobCategoryIsExist(alreadyExistCheckObj).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 200) {
            this.isResponseGet = false;
            if (repsonsedata['Data'] == false) {
            this.isResponseGet = false;
              this.addForm.get("JobSubCategory").setErrors({ codeTaken: true });
              this.addForm.get("JobSubCategory").markAsDirty();

            } else if (repsonsedata['Data'] == true) {
              this.addForm.get("JobSubCategory").clearValidators();
              this.addForm.get("JobSubCategory").markAsPristine();
              this.addForm.get('JobSubCategory').setValidators([Validators.required, Validators.maxLength(100)]);

            }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.isResponseGet = false;
            this.addForm.get("JobSubCategory").clearValidators();
            this.addForm.get("JobSubCategory").markAsPristine();
            this.addForm.get('JobSubCategory').setValidators([Validators.required, Validators.maxLength(100)]);
            if (this.addForm && this.submitted == true && isSave==true) {
              if (this.tempID == undefined || this.tempID == null) {
              this.isResponseGet = true;
              this.createSubJobCategory(this.addForm.value);
            } else {
              this.isResponseGet = true;
              this.updateSubJobCategoryById(this.addForm.value);
            }
          }
        }

          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
            this.isResponseGet = false;
          }
        },
        err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
            this.isResponseGet = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
          this.isResponseGet = false;
        });
    }
    else {
      this.addForm.get('JobSubCategory').setValidators([Validators.required, Validators.maxLength(100)]);
      this.isResponseGet = false;

    }
    this.addForm.get('JobSubCategory').updateValueAndValidity();
  }


  /*
     @Type: File, <ts>
     @Name: getStatusList function
     @Who:  Nitin Bhati
     @When: 22-June-2021
     @Why: ROST-1823
     @What: For status listing
    */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: SubJobCategory) => {
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

}
