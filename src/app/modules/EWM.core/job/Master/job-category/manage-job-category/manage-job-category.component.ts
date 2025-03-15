/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1823
  @What:  This page will be use for the job category template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@progress/kendo-angular-l10n';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { statusList } from '../../../../shared/datamodels/common.model';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { JobCategory } from '../../../../shared/datamodels/job-category';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';

@Component({
  selector: 'app-manage-job-category',
  templateUrl: './manage-job-category.component.html',
  styleUrls: ['./manage-job-category.component.scss']
})
export class ManageJobCategoryComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public jobCategoryJsonObj = {};
  tempID: string;
  public statusList: any = [];
  public gridRegion: any = [];
  public specialcharPattern = "[A-Za-z0-9. ]+$";
  viewModeValue: any;
  public isResponseGet:boolean = false;
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public _jobCategoryService: JobService, private snackBService: SnackBarService,
    private commonserviceService: CommonserviceService,
    public _sidebarService: SidebarService,
    private translateService: TranslateService, private _systemSettingService: SystemSettingService) {
    this.addForm = this.fb.group({
      Id: [''],
      JobCategory: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.specialcharPattern),this.noWhitespaceValidator()]],
      RegionId: [[], Validators.required],
      Status: ['1', Validators.required], //  <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
    });
  }

  ngOnInit(): void {
    this.getAllRegion();
    this.getStatusList();
    this.route.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.actionStatus = 'Edit'
          this.tempID = params['id'];
          this.editForm(this.tempID);
        }
      });
    this._sidebarService.activesubMenuObs.next('masterdata');
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
      @What:call Get method from services for showing data into grid.
    */
  getAllRegion() {
    this._systemSettingService.getRegion().subscribe(
      (data: JobCategory) => {
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
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1823
   @What: For setting value in the edit form
  */
  editForm(Id: String) {
    this.loading = true;
    this._jobCategoryService.getJobCategoryById('?Id=' + Id).subscribe(
      (data: JobCategory) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.addForm.patchValue({
            Id: Id,
            RegionId: data.Data.RegionId.toString(),
            JobCategory: data.Data.JobCategory,
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

  this.isResponseGet = true;//who:maneesh,what:ewm-15708 for pass false in true and save loader case,when:18/01/2023

    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.onJobCategoryChanges(true);
   
  }
  /*
   @Type: File, <ts>
   @Name: createJobCategory function
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1823
   @What: For setting value in the create form data
  */
  createJobCategory(value) {
    this.loading = true;
    this.isResponseGet = true;
    this.jobCategoryJsonObj['JobCategory'] = value.JobCategory;
    this.jobCategoryJsonObj['RegionId'] = parseInt(value.RegionId);
    this.jobCategoryJsonObj['Status'] = parseInt(value.Status);
   
    this._jobCategoryService.createJobCategory(this.jobCategoryJsonObj).subscribe((repsonsedata: JobCategory) => {

      if (repsonsedata.HttpStatusCode == 200) {
        this.isResponseGet = false;
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

        // let viewModeData: any = this.viewModeValue;
        // this.router.navigate(['./client/core/administrators/job-category'], {
        //   queryParams: { viewModeData }
        // });
        this.router.navigate(['./client/core/administrators/job-category']);

      } else if (repsonsedata.HttpStatusCode == 400) {
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
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.isResponseGet = false;
      });
  }
  /*
   @Type: File, <ts>
   @Name: updateJobCategory function
   @Who: Nitin Bhati
   @When: 21-June-2021
   @Why: EWM-1823
   @What: For setting value in the update form data
  */
  updateJobCategory(value) {
    this.loading = true;
    this.isResponseGet = true;
    this.jobCategoryJsonObj['Id'] = value.Id;
    this.jobCategoryJsonObj['RegionId'] = parseInt(value.RegionId);
    this.jobCategoryJsonObj['JobCategory'] = value.JobCategory;
    this.jobCategoryJsonObj['Status'] = parseInt(value.Status);
    this._jobCategoryService.updateJobCategoryById(this.jobCategoryJsonObj).subscribe((repsonsedata: JobCategory) => {

      if (repsonsedata.HttpStatusCode == 200) {
        this.loading = false;
        this.isResponseGet = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        // let viewModeData: any = this.viewModeValue;
        // this.router.navigate(['./client/core/administrators/job-category'], {
        //   queryParams: { viewModeData }
        // });
        this.router.navigate(['./client/core/administrators/job-category']);

      } else if (repsonsedata.HttpStatusCode == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.isResponseGet = false;
      });

  }

  /*
 @Type: File, <ts>
 @Name: onCancel function
 @Who: Nitin Bhati
 @When: 21-June-2021
 @Why: EWM-1823
 @What: For setting value in the cancel form data
*/
  onCancel(e) {
    e.preventDefault();
    this.addForm.reset();
    this.actionStatus = 'Add';
    // let viewModeData: any = this.viewModeValue;
    // this.router.navigate(['./client/core/administrators/job-category'], {
    //   queryParams: { viewModeData }
    // });
    this.router.navigate(['./client/core/administrators/job-category']);
  }
  /*
  @Type: File, <ts>
  @Name: onJobCategoryChanges function
  @Who: Nitin Bhati
  @When: 21-June-2021
  @Why: EWM-1823
  @What: This function is used for checking duplicacy for code
  */
  onJobCategoryChanges(isSave) {
    let alreadyExistCheckObj = {};
    let jobCategoryId;
    if (this.tempID != undefined) {
      jobCategoryId = this.tempID;
    } else {
      jobCategoryId = null;
    }
    alreadyExistCheckObj['Id'] = jobCategoryId;
    alreadyExistCheckObj['RegionId'] = parseInt(this.addForm.get("RegionId").value);
    alreadyExistCheckObj['Value'] = this.addForm.get("JobCategory").value;
    if (this.addForm.get("JobCategory").value) {
      this._jobCategoryService.checkJobCategoryIsExist(alreadyExistCheckObj).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 200) {
            this.isResponseGet = false;
            if (repsonsedata['Data'] == false) {
              this.isResponseGet = false;
              this.addForm.get("JobCategory").setErrors({ codeTaken: true });
              this.addForm.get("JobCategory").markAsDirty();

            } else if (repsonsedata['Data'] == true) {
              this.addForm.get("JobCategory").clearValidators();
              this.addForm.get("JobCategory").markAsPristine();
              this.addForm.get('JobCategory').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
            //   if (this.addForm && this.submitted == true) {
            //     alert('ontwoe')

            //     if (this.tempID == undefined || this.tempID == null) {
            //      this.isResponseGet = true;
            //      alert('one')
            //     this.createJobCategory(this.addForm.value);
            //   } else {
            //     this.isResponseGet = true;
            //     this.updateJobCategory(this.addForm.value);
            //   }
            // }
          }
        }
           else if (repsonsedata['HttpStatusCode'] == 400) {

            this.isResponseGet = false; //who:maneesh,what:ewm-15708 for pass false in true and save loader case,when:18/01/2023

            this.addForm.get("JobCategory").clearValidators();
            this.addForm.get("JobCategory").markAsPristine();
            this.addForm.get('JobCategory').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
            if (this.addForm && this.submitted == true && isSave==true) {
              if (this.tempID == undefined || this.tempID == null) {
                this.isResponseGet = true; //who:maneesh,what:ewm-15708 for pass false in true and save loader case,when:18/01/2023
              this.createJobCategory(this.addForm.value);
            } else {
              this.isResponseGet = true; //who:maneesh,what:ewm-15708 for pass false in true and save loader case,when:18/01/2023
              this.updateJobCategory(this.addForm.value);
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
      this.addForm.get('JobCategory').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);
      this.isResponseGet = false;

    }
    this.addForm.get('JobCategory').updateValueAndValidity();
  }

  /*
    @Type: File, <ts>
    @Name: getStatusList function
    @Who: Nitin Bhati
    @When: 21-June-2021
    @Why: EWM-1823
    @What: For status listing
   */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: JobCategory) => {
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
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 21-dec-2022
   @Why: EWM-9959
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}

