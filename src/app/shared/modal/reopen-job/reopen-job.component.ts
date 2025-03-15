  /* Adarsh singh 1Dec 2023 for EWM-15257*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from '@app/shared/models';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reopen-job',
  templateUrl: './reopen-job.component.html',
  styleUrls: ['./reopen-job.component.scss']
})
export class ReopenJobComponent implements OnInit {
  isResponseGet: boolean;
  reOpneJobForm: FormGroup;
  jobId: string;

  public onlyNumberPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,1000}?)$/);

  constructor(public dialogRef: MatDialogRef<ReopenJobComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private jobService: JobService, private snackBService: SnackBarService, private translateService: TranslateService,) { }

  ngOnInit(): void {
    this.jobId = this.data.data?.Id;
    this.reOpneJobForm = this.fb.group({
      JobExpiryDays: [null, [Validators.pattern(this.onlyNumberPattern)]],
    })
  }

  /* Adarsh singh 1Dec 2023 for EWM-15257*/
  onDismissphone(): void {
    this.dialogRef.close({ data: false });
  }
  /* Adarsh singh 1Dec 2023 for EWM-15257*/
  confirmDialog(): void {
    this.isResponseGet = true;
    let obj = {
      JobId: this.jobId,
      Days: parseInt(this.reOpneJobForm.value.JobExpiryDays)
    }
    this.jobService.updateJobExpiryDays(obj).subscribe((res: ResponceData) => {
      if (res.HttpStatusCode == 200 || res.HttpStatusCode == 400) {
        this.isResponseGet = false;
        this.dialogRef.close({ data: true });
      }
      else {
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(res.Message), res.HttpStatusCode);
      }
    })
  }

  /* Adarsh singh 1Dec 2023 for EWM-15257*/
  conditionChcek() {
    let values = this.reOpneJobForm.get("JobExpiryDays").value;
    console.log(values);
    
    if (1000 > values) {
      if (values >= 0) {
        this.reOpneJobForm.get("JobExpiryDays").clearValidators();
        this.reOpneJobForm.get("JobExpiryDays").markAsPristine();
        this.reOpneJobForm.get('JobExpiryDays').setValidators([Validators.pattern(this.onlyNumberPattern)]);
      } else {
        this.reOpneJobForm.get("JobExpiryDays").setErrors({ numbercheck: true });
        this.reOpneJobForm.get("JobExpiryDays").markAsDirty();
      }
    } else if ((values % 1) == 0) {
      this.reOpneJobForm.get("JobExpiryDays").setErrors({ numbercheck: true });
    }
    else {
      this.reOpneJobForm.get('JobExpiryDays').setValidators([Validators.pattern(this.onlyNumberPattern)]);
    }
  }

}
