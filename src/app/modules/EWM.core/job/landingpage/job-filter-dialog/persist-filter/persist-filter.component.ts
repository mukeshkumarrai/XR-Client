/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Renu
  @When: 03-Aug-2022
  @Why: EWM-6129 EWM-8108
  @What:  This page will be use for Job filter popup page Component ts file
*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-persist-filter',
  templateUrl: './persist-filter.component.html',
  styleUrls: ['./persist-filter.component.scss']
})
export class PersistFilterComponent implements OnInit {

  loading: boolean = false;
  addForm: FormGroup;
  isSubmit: boolean;
  pattern: "/^(\s+\S+\s*)*(?!\s).*$/";
  constructor(public dialogRef: MatDialogRef<PersistFilterComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any
    , private _services: CandidateService, private translateService: TranslateService, private snackBService: SnackBarService) {
    this.addForm = this.fb.group({
      filterId: [],
      Name: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    if (this.data.folderId != undefined && this.data.folderId != 0) {
      this.addForm.patchValue({
        Name: this.data.name,
        filterId: this.data.folderId
      });
    }
  }


  onDismiss() {
    document.getElementsByClassName("add_filter")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filter")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


  onSave() {
    this.isSubmit = true;
    document.getElementsByClassName("add_filter")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_filter")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(this.addForm.value); }, 200);
    //this.checkDuplicity();
  }


  checkDuplicity() {
    if (this.addForm.controls['Name'].value == '') {
      return;
    }
    let Id = this.data.folderId;
    let Value = this.addForm.controls['Name'].value;
    let UserTypeId = this.data.candidateId;
    let JobId = this.data.JobId;

    this._services.checkduplicity('?id=' + Id + '&Value=' + Value + '&UserTypeId=' + UserTypeId + '&JobId=' + JobId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            this.addForm.get("Name").setErrors({ codeTaken: true });
            this.addForm.get("Name").markAsDirty();
          }
        }
        else if (data.HttpStatusCode == 204) {
          if (this.isSubmit == true) {
            document.getElementsByClassName("add_filter")[0].classList.remove("animate__zoomIn")
            document.getElementsByClassName("add_filter")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close(this.addForm.value); }, 200);
          }

          this.addForm.get("Name").clearValidators();
          this.addForm.get("Name").markAsPristine();
          this.addForm.get('Name').setValidators([Validators.required, Validators.maxLength(50)]);
          // }
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
      });
  }

}
