import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-popup-integration-category',
  templateUrl: './popup-integration-category.component.html',
  styleUrls: ['./popup-integration-category.component.scss']
})
export class PopupIntegrationCategoryComponent implements OnInit {
/**********************All generic variables declarations for accessing any where inside functions********/
addForm: FormGroup;
public loading: boolean = false;
public submitted = false;
public AddObj = {};
knockoutQuestion=[];
 editId: any;
 oldPatchValues: any;
 DisplaySequence: any;
 public activestatus: string = 'Add';
 ApplicationFormId: any;
 knockoutQuestionList=[];
 name: any;
 dataByEdit:any;
 dirctionalLang;
/* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 06-June-2022
 @Why: EWM-7019
 @What: For injection of service class and other dependencies
*/
 constructor(public dialogRef: MatDialogRef<PopupIntegrationCategoryComponent>, public dialog: MatDialog,
   @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
   private snackBService: SnackBarService, private _CandidateFolderService: CandidateFolderService, private route: Router, private commonserviceService: CommonserviceService,private _jobService: JobService) { 
     this.addForm = this.fb.group({
       Id: [''],
       IntegrationCategory: ['', [Validators.required,Validators.maxLength(250),Validators.minLength(1)]],
     });
    this.editId = data.editId;
    this.dataByEdit = data.dataByEdit;        
   }
   ngOnInit(): void {
    

   }
/* 
  @Type: File, <ts>
  @Name: onSave function
  @Who: Nitin Bhati
  @When: 06-June-2022
  @Why: EWM-7019
  @What: For save and close popup 
 */
 onSave(value) {
   this.submitted = true;
   document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__zoomIn");
   document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__zoomOut");
   setTimeout(() => { this.dialogRef.close(true); }, 200);
    }
    /*
     @Name: onDismiss
     @Who: Nitin Bhati
     @When: 06-June-2022
     @Why: EWM-7019
     @What: Function will call when user click on cancel button.
   */
     onDismiss(): void {
       document.getElementsByClassName("add_Integrationcategory")[0].classList.remove("animate__zoomIn");
       document.getElementsByClassName("add_Integrationcategory")[0].classList.add("animate__zoomOut");
       setTimeout(() => { this.dialogRef.close(false); }, 200);
     }
  
  
 }
 
 
 
