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
  selector: 'app-publish-job-validation',
  templateUrl: './publish-job-validation.component.html',
  styleUrls: ['./publish-job-validation.component.scss']
})
export class PublishJobValidationComponent implements OnInit {
 /**********************All generic variables declarations for accessing any where inside functions********/
 addForm: FormGroup;
 public loading: boolean = false;
 public submitted = false;
 public AddObj = {};
 knockoutQuestion=[];
  editId: any;
  public activestatus: string = 'Add';
  name: any;
  dataByEdit:any;
  dirctionalLang;
 /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 06-June-2022
  @Why: EWM-6871
  @What: For injection of service class and other dependencies
 */
  constructor(public dialogRef: MatDialogRef<PublishJobValidationComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private _CandidateFolderService: CandidateFolderService, private route: Router, private commonserviceService: CommonserviceService,private _jobService: JobService) { 
      this.editId = data.editId;
      this.dataByEdit = data.dataByEdit;    
      this.loading = false;                  
    }
    ngOnInit(): void {
    }
/* 
   @Type: File, <ts>
   @Name: onSave function
   @Who: Nitin Bhati
   @When: 06-June-2022
   @Why: EWM-6871
   @What: For passing data  to onsave question 
  */
  onSave() {
    this.submitted = true;
    document.getElementsByClassName("add_publishValidation")[0].classList.remove("animate__zoomIn");
    document.getElementsByClassName("add_publishValidation")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(true); }, 200);
   
     }
     /*
      @Name: onDismiss
      @Who: Nitin Bhati
      @When: 06-June-2022
      @Why: EWM-6871
      @What: Function will call when user click on cancel button.
    */
      onDismiss(): void {
        document.getElementsByClassName("add_publishValidation")[0].classList.remove("animate__zoomIn");
        document.getElementsByClassName("add_publishValidation")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(false); }, 200);
      }
   
   
  }
  
  
  