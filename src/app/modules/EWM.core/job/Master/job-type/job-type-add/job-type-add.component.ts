/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: job-type-add.component.ts
  @Who: Anup
  @When: 21-june-2021
  @Why: EWM-1738 EWM-1826
  @What: Job-type master
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
  selector: 'app-job-type-add',
  templateUrl: './job-type-add.component.html',
  styleUrls: ['./job-type-add.component.scss']
})
export class JobTypeAddComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  addJobForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public submitted = false;
  public JobAddObj = {};
  public tempID: number;
  public statusList: any = [];
  public viewMode: any;
  public specialcharPattern = "[A-Za-z0-9- ]*$";
  public formtitle: string = 'grid';
  public StatusDataId: any[];
  //<!--@Who: Bantee Kumar,@Why:EWM-11417,@When: 20-Mar-2023 -->

  public StatusDataName:any='Active';

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
    this.addJobForm = this.fb.group({
      Id: [''],
      JobType: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]],
      Status: ["1", Validators.required] //   <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
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
          this.editForm(this.tempID);
        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }
      });

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
       // this.reloadApiBasedOnorg();
      }
    })

  }

  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Anup
   @When: 22-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For setting value in the edit form
  */

  editForm(Id: any) {
    this.loading = true;
    this.jobService.getJobTypeByID('?Id=' + Id).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          let isActive;
          if (data.Data.Status == 1) {
            isActive = '1';
          } else {
            isActive = '2';
          }
          this.addJobForm.patchValue({
            Id: data.Data.Id,
            JobType: data.Data.JobType,
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
    @When: 22-june-2021
    @Why: EWM-1738 EWM-1828
    @What: For checking wheather the data save or edit on the basis on active satatus
   */

  onSave(value) {
    this.submitted = true;
    if (this.addJobForm.invalid) {
      return;
    }
    this.JobduplicayCheck();

  }

  /*
   @Type: File, <ts>
   @Name: createJobMaster function
   @Who: Anup
   @When: 22-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For saving group master data
  */

  createJobMaster(value) {
    this.loading = true;
    this.JobAddObj['JobType'] = value.JobType;
    this.JobAddObj['Status'] = parseInt(value.Status);
    this.JobAddObj['StatusName'] = this.StatusDataName;

    this.jobService.AddJobType(this.JobAddObj).subscribe((repsonsedata: JobCommitment) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        //this.route.navigate(['/client/core/administrators/job-type'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['/client/core/administrators/job-type']);
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
   @When: 22-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For updating group master data
  */

  updateJobMaster(value) {
    let updateJobObj = {};
    this.loading = true;
    updateJobObj['Id'] = value.Id;
    updateJobObj['JobType'] = value.JobType;
    updateJobObj['Status'] = parseInt(value.Status);
    updateJobObj['StatusName'] = this.StatusDataName;

    this.jobService.updateJobType(updateJobObj).subscribe((repsonsedata: JobCommitment) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        //this.route.navigate(['/client/core/administrators/job-type'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['/client/core/administrators/job-type']);
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
   @When: 22-june-2021
   @Why: EWM-1738 EWM-1828
  @What: For checking duplicacy for code and description
 */
  JobduplicayCheck() {
    let JobId;
    if (this.tempID != undefined) {
      JobId = this.tempID;
    } else {
      JobId = " ";
    }
    if (this.addJobForm.get('JobType').value == '') {
      return false;
    }
    this.jobService.checkJobTypeIsExists('?Id=' + JobId + '&Value=' + this.addJobForm.get('JobType').value).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          if (repsonsedata.Status == true) {
            this.addJobForm.get("JobType").setErrors({ codeTaken: true });
            this.addJobForm.get("JobType").markAsDirty();
          }
        } else if (repsonsedata.HttpStatusCode == 400) {
          if (repsonsedata.Status == false) {
            this.addJobForm.get("JobType").clearValidators();
            this.addJobForm.get("JobType").markAsPristine();
            this.addJobForm.get('JobType').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]);

            if (this.addJobForm && this.submitted == true) {
              if (this.tempID == undefined || this.tempID == null) {
                this.createJobMaster(this.addJobForm.value);
              } else {
                this.updateJobMaster(this.addJobForm.value);
              }
            }
          }
        }
        else {
          this.addJobForm.get("JobType").clearValidators();
          this.addJobForm.get("JobType").markAsPristine();
          this.addJobForm.get('JobType').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]);
        }
        // this.addJobForm.get('Name').updateValueAndValidity();
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
   @When: 22-june-2021
   @Why: EWM-1738 EWM-1828
   @What: For status listing
  */
  getJobList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: any) => {
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
    this.route.navigate(['/client/core/administrators/job-type']);
  }

/* 
   @Type: File, <ts>
   @Name: clickStatusID function
   @Who: Adarsh singh
   @When: 23-Aug-2022
   @Why: EWM-2596
   @What: For status Click event
*/

 clickStatusID(Id) {
  this.StatusDataId = this.statusList.filter((dl: any) => dl.StatusId == Id);
  this.StatusDataName = this.StatusDataId[0].StatusName;
}

}
