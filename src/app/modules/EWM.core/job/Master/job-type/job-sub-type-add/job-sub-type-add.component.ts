/*
 @(C): Entire Software
  @Type: File, <ts>
  @Name: add job-sub-type.component.ts
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1826
  @What: For Add job Sub Type
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobCommitment } from 'src/app/modules/EWM.core/shared/datamodels/Job-commitment';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-job-sub-type-add',
  templateUrl: './job-sub-type-add.component.html',
  styleUrls: ['./job-sub-type-add.component.scss']
})
export class JobSubTypeAddComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  addJobSubForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public submitted = false;
  public JobAddObj = {};
  public tempID: number;
  public statusList: any = [];
  public viewMode: any;
  public specialcharPattern = "[A-Za-z0-9- ]*$";
  public JobTypeId: any;
  public jobType: string;
  public formtitle: string = 'grid';
  public StatusDataId: any[];
  public StatusDataName;
  /*
   @Type: File, <ts>
   @Name: constructor function
   @Who: Anup
   @When: 21-june-2021
   @Why: EWM-1738 EWM-1826
   @What: For injection of service class and other dependencies
  */

  constructor(private fb: FormBuilder, private translateService: TranslateService, private jobService: JobService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private systemSettingService: SystemSettingService, private route: Router, public _sidebarService: SidebarService,
    private commonserviceService: CommonserviceService) {
    this.addJobSubForm = this.fb.group({
      Id: [''],
      JobType: [''],
      JobSubType: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]],
      Status: [[], Validators.required]
    });
  }


  ngOnInit(): void {
    this.getJobList();
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.router.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.activestatus = 'Edit';
          this.tempID = params['id'];
          this.JobTypeId = params['JobTypeId']
          this.editForm(this.tempID, this.JobTypeId);
        }
        else {
          this.JobTypeId = localStorage.getItem('JobTypeId');

        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }
        // if(params['JobTypeId'] != undefined) {
        //   this.JobTypeId = params['JobTypeId'];
        // }
      });
    this.JobTypeId = localStorage.getItem('JobTypeId');

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
      //  this.reloadApiBasedOnorg();
      }
    });

    this.patchValueForJobType();
  }



  /*
   @Type: File, <ts>
   @Name: patchValueForJobType function
   @Who: Anup
   @When: 21-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For setting value in the patch form
  */

  patchValueForJobType() {
    this.loading = true;
    this.jobService.getJobTypeByID('?Id=' + this.JobTypeId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.addJobSubForm.controls["JobType"].disable();
          this.addJobSubForm.patchValue({
            JobType: data.Data.JobType,
          });
          this.jobType = data.Data.JobType;
          this.StatusDataName = data.Data.StatusName;
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
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1828
  @What: For setting value in the edit form
 */

  editForm(Id: Number, jobTypeId: any) {
    this.loading = true;
    this.jobService.getJobSubTypeByID('?Id=' + Id + '&JobTypeId=' + jobTypeId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          let isActive;
          if (data.Data.Status == 1) {
            isActive = '1';
          } else {
            isActive = '2';
          }
          this.JobTypeId = data.Data.JobTypeId;
          this.addJobSubForm.patchValue({
            Id: data.Data.Id,
            JobSubType: data.Data.JobSubType,
            Status: isActive,
          });
          this.StatusDataName = data.Data.StatusName;

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
    @Name: onSave function
    @Who: Anup
    @When: 21-june-2021
    @Why: EWM-1738 EWM-1828
    @What: For checking wheather the data save or edit on the basis on active satatus
   */

  onSave(value) {
    this.submitted = true;
    if (this.addJobSubForm.invalid) {
      return;
    }
    this.JobduplicayCheck();

  }

  /*
   @Type: File, <ts>
   @Name: createJobMaster function
   @Who: Anup
   @When: 21-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For saving group master data
  */
  createJobMaster(value) {
    this.loading = true;
    this.JobAddObj['JobSubType'] = value.JobSubType;
    this.JobAddObj['JobTypeId'] = this.JobTypeId;
    //this.JobAddObj['JobType'] = value.JobType;
    this.JobAddObj['Status'] = parseInt(value.Status);
    this.JobAddObj['StatusName'] = this.StatusDataName;

    this.jobService.AddJobSubType(this.JobAddObj).subscribe((repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['/client/core/administrators/job-type/job-sub-type'],
          { queryParams: { V: this.viewMode, id: this.JobTypeId, jobType: this.jobType }, });
        this.formtitle = 'grid';
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
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /*
   @Type: File, <ts>
   @Name: updateJobMaster function
   @Who: Anup
   @When: 21-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For updating group master data
  */

  updateJobMaster(value) {
    let updateJobObj = {};
    this.loading = true;
    updateJobObj['Id'] = value.Id;
    updateJobObj['JobTypeId'] = this.JobTypeId;
    //updateJobObj['JobType'] = value.JobType;
    updateJobObj['JobSubType'] = value.JobSubType;
    updateJobObj['Status'] = parseInt(value.Status);
    updateJobObj['StatusName'] = this.StatusDataName;

    this.jobService.updateJobSubType(updateJobObj).subscribe((repsonsedata: any) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['/client/core/administrators/job-type/job-sub-type'], {
          queryParams: { V: this.viewMode, id: this.JobTypeId, jobType: this.jobType }
        });
        this.formtitle = 'grid';
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
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });

  }



  /*
  @Type: File, <ts>
  @Name: duplicayCheck function
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1828
  @What: For checking duplicacy for code and description
  */
  JobduplicayCheck() {
    let JobId;
    if (this.tempID != undefined) {
      JobId = this.tempID;
    } else {
      JobId = 0;
    }
    if (this.addJobSubForm.get('JobSubType').value == '') {
      return false;
    }
    this.jobService.checkJobSubTypeIsExists('?Id=' + JobId + '&JobTypeId=' + this.JobTypeId + '&Value=' + this.addJobSubForm.get('JobSubType').value).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          if (repsonsedata.Status == true) {
            this.addJobSubForm.get("JobSubType").setErrors({ codeTaken: true });
            this.addJobSubForm.get("JobSubType").markAsDirty();
          }
        } else if (repsonsedata.HttpStatusCode == 400) {
          if (repsonsedata.Status == false) {

            this.addJobSubForm.get("JobSubType").clearValidators();
            this.addJobSubForm.get("JobSubType").markAsPristine();
            this.addJobSubForm.get('JobSubType').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]);

            if (this.addJobSubForm && this.submitted == true) {
              if (this.tempID == undefined || this.tempID == null) {
                this.createJobMaster(this.addJobSubForm.getRawValue());
              } else {
                this.updateJobMaster(this.addJobSubForm.getRawValue());
              }
            }
          }
        }
        else {
          this.addJobSubForm.get("JobSubType").clearValidators();
          this.addJobSubForm.get("JobSubType").markAsPristine();
          this.addJobSubForm.get('JobSubType').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]);
        }
        // this.addJobSubForm.get('JobSubType').updateValueAndValidity();
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }

  /*
   @Type: File, <ts>
   @Name: getJobList function
   @Who: Anup
   @When: 21-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For status listing
  */
  getJobList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: JobCommitment) => {
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
 @Name: reloadApiBasedOnorg function
 @Who: Anup Singh
 @When: 21-June-2021
 @Why: EWM-1738 EWM-1826
 @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.formtitle = 'grid';
    this.route.navigate(['/client/core/administrators/job-type/job-sub-type'], {
      queryParams: { V: this.viewMode, id: this.JobTypeId, jobType: this.jobType }
    });
  }

/* 
   @Type: File, <ts>
   @Name: clickStatusID function
   @Who: Adarsh singh
   @When: 23-Aug-2022
   @Why: EWM-8238
   @What: For status Click event
*/

clickStatusID(Id) {
  this.StatusDataId = this.statusList.filter((dl: any) => dl.StatusId == Id);
  this.StatusDataName = this.StatusDataId[0].StatusName;
}

}


