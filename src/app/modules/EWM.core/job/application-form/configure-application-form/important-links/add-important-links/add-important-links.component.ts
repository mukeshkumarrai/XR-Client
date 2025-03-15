import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-add-important-links',
  templateUrl: './add-important-links.component.html',
  styleUrls: ['./add-important-links.component.scss']
})
export class AddImportantLinksComponent implements OnInit {
  addForm: FormGroup;
  iconData: any;
  public AddObj = {};
  public submitted = false;
  public urlpattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  dataByEdit: any;
  public activestatus: string = 'Add';
  isViewMode:boolean = true;
  loading:boolean;

  constructor(public dialogRef: MatDialogRef<AddImportantLinksComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private _CandidateFolderService: CandidateFolderService, private route: Router, private commonserviceService: CommonserviceService, private _jobService: JobService,
    private http: HttpClient) {
    this.addForm = this.fb.group({
      Heading: ['', [Validators.required, Validators.maxLength(150)]],
      SubHeading: ['', [Validators.maxLength(150)]],
      IconPath: [],
      URL: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(this.urlpattern)]],
      Description: ['', [Validators.maxLength(500)]],
      DisplaySequence: [1]
    });

  }

  ngOnInit(): void {
    this.http.get<any>("/assets/config/icon-name.json").subscribe((data) =>
      this.iconData = data
    )
    this.dataByEdit = this.data.dataByEdit;
    if (this.data.editId == 'Add') {
      this.activestatus = 'Add';
    } else if (this.data.editId == 'View') {
      this.addForm.patchValue(this.dataByEdit);
      this.addForm.disable();
      this.isViewMode = false;
      this.activestatus = 'View';
    }
    else {
      this.activestatus = 'Edit';
      //  this.loading = true;
      this.addForm.patchValue(this.dataByEdit);
    }
  }

/* 
@Type: File, <ts>
@Name: onSave function
@Who: Adarsh singh
@When: 30-Oct-2022
@Why: EWM-8897 EWM-9270
@What: For passing data  to important links page 
*/
  onSave(value) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    document.getElementsByClassName("add_ImportantLinks")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_ImportantLinks")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ data: value, status: this.activestatus }); }, 200);
  }
/*
@Name: onDismiss
@Who: Adarsh singh
@When: 30-Oct-2022
@Why: EWM-8897 EWM-9270
@What: Function will call when user click on cancel button.
*/
  onDismiss(): void {
    document.getElementsByClassName("add_ImportantLinks")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_ImportantLinks")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

/*
@Name: removeSpaces function
@Who: Adarsh singh
@When: 02-Nov-2022
@Why: EWM-8897 EWM-9270
@What: Function call from checking if user entered only spaces
*/
  removeSpaces(){
    let value = this.addForm.value.Heading;
    if(value.trim()){
      this.addForm.get("Heading").clearValidators();
      this.addForm.get("Heading").markAsPristine();
      this.addForm.get('Heading').setValidators([Validators.required, Validators.maxLength(150)]);
      this.addForm.get("Heading").updateValueAndValidity();
    }else{
      this.addForm.get("Heading").setErrors({codeTaken: true});
      this.addForm.get("Heading").markAsDirty();
    }
  }
}
