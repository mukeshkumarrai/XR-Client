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
  selector: 'app-add-knockout-questions',
  templateUrl: './add-knockout-questions.component.html',
  styleUrls: ['./add-knockout-questions.component.scss']
})
export class AddKnockoutQuestionsComponent implements OnInit {
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
 /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 18-may-2022
  @Why: EWM-6678
  @What: For injection of service class and other dependencies
 */
  constructor(public dialogRef: MatDialogRef<AddKnockoutQuestionsComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private _CandidateFolderService: CandidateFolderService, private route: Router, private commonserviceService: CommonserviceService,private _jobService: JobService) { 
      this.addForm = this.fb.group({
        Id: [''],
        Question: ['', [Validators.required,Validators.maxLength(250),Validators.minLength(1)]],
        Answer: [1]
      });
     this.editId = data.editId;
     this.dataByEdit = data.dataByEdit;
     this.ApplicationFormId = data.ApplicationFormId;
     this.knockoutQuestionList = data.knockoutQuestionList;
     if(data.editId=='Add'){
       }else{
      // this.editKnockoutquestion(data.editId);
       this.activestatus = 'Edit';
       this.loading = true;
      this.addForm.patchValue({
        Id: this.dataByEdit.Id,
        Question:this.dataByEdit.Question,
        Answer:this.dataByEdit.Answer
      }); 
      this.loading = false;
      
     }          
    }
    ngOnInit(): void {
     

    }
/*
@Type: File, <ts>
@Name: getKnockoutQuestionDataById function
@Who: Nitin Bhati
@When: 18-may-2022
@Why: EWM-6678
@What: get data
*/
// editKnockoutquestion(Id: any) {
//   this.activestatus = 'Edit';
//   this.loading = true;
//   // var knockoutQuestionListData = this.knockoutQuestionList.filter((dl: any) => dl.Id == Id);
//   // this._jobService.fetchKnockoutQuestionDataById('?id='+Id).subscribe(
//   //   (data: any) => {
//   //     this.loading = false;
//   //     if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
//   //       if(data?.Data!=undefined && data?.Data!=null && data?.Data!=''){
//   //          this.addForm.patchValue({
//   //           Id: data?.Data?.Id,
//   //           Question: data?.Data?.Question,
//   //           Answer: data?.Data?.Answer
//   //         }); 
//   //         this.oldPatchValues = data['Data'];
//   //         this.ApplicationFormId=data?.Data?.ApplicatinFormId;
//   //         this.DisplaySequence=data?.Data?.DisplaySequence;        
//   //       }      
//   //     }
//   //     else {
//   //       this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
//   //       this.loading = false;
//   //     }
//   //   },
//   //   err => {
//   //     if (err.StatusCode == undefined) {
//   //      this.loading = false;
//   //       this.loading = false;
//   //       this.addForm.patchValue({
//   //         //Id: this.dataByEdit.Id,
//   //         Question:this.dataByEdit[0].Question,
//   //         Answer:this.dataByEdit[0].Answer
//   //       }); 
//   //     }
//   //     this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
//   //     this.loading = false;
//   //   })
// }

   /* 
   @Type: File, <ts>
   @Name: onSave function
   @Who: Nitin Bhati
   @When: 18-may-2022
   @Why: EWM-6678
   @What: For passing data  to knockout question 
  */
  onSave(value) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.duplicayCheck(value);
     }
     /*
      @Name: onDismiss
      @Who: Nitin Bhati
      @When: 18-may-2022
      @Why: EWM-6678
      @What: Function will call when user click on cancel button.
    */
      onDismiss(): void {
        document.getElementsByClassName("add_knockoutQuestion")[0].classList.remove("animate__zoomIn");
        document.getElementsByClassName("add_knockoutQuestion")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(false); }, 200);
      }
    /* 
   @Type: File, <ts>
   @Name: duplicayCheck function
   @Who: Nitin Bhati
   @When: 10-Dec-2021
   @Why: EWM-4140
   @What: For checking duplicacy for Note category type
  */
   duplicayCheck(value) {
    let duplicacyExist = {};
    let valueId= this.addForm.get("Id").value
     if (value == '') {
      value = 0;
      return false;
    }
    if (valueId == null) {
      valueId = 0;
    }
    if (valueId == '') {
      valueId = 0;
    }
    duplicacyExist['ApplicationFormId'] = this.ApplicationFormId;
    duplicacyExist['Knockout'] = [{
      "Id": valueId,
      "Question": this.addForm.get("Question").value
    }],
    this._jobService.checkKnockoutQuestion(duplicacyExist).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {           
              this.addForm.get("Question").setErrors({ codeTaken: true });
              this.addForm.get("Question").markAsDirty();
              this.submitted = false;           
          } 
         } else if (repsonsedata.HttpStatusCode === 204) {
         if (repsonsedata.Status == true) {     
              this.addForm.get("Question").clearValidators();
              this.addForm.get("Question").markAsPristine();
              this.addForm.get('Question').setValidators([Validators.required, Validators.maxLength(250), Validators.minLength(1)]);
              this.addForm.get("Question").updateValueAndValidity();
              if (this.addForm && this.submitted == true) { 
                this.loading = true;
                this.AddObj['Id'] = valueId;
                this.AddObj['Question'] = this.addForm.value.Question;
                this.AddObj['Answer'] = this.addForm.value.Answer;
                // const index = this.knockoutQuestionList.findIndex(x => x.Question == this.addForm.value.Question);
                // if (index>= 0) {
                //   this.addForm.get("Question").setErrors({ codeTaken: true });
                //   this.addForm.get("Question").markAsDirty();
                //   this.submitted = false;  
                //   this.loading = false;
                // }else{
                //   this.loading = false;
                //   this.addForm.get("Question").clearValidators();
                //   this.addForm.get("Question").markAsPristine();
                //   this.addForm.get('Question').setValidators([Validators.required, Validators.maxLength(250), Validators.minLength(1)]);
                //   this.addForm.get("Question").updateValueAndValidity();
                //   document.getElementsByClassName("add_knockoutQuestion")[0].classList.remove("animate__zoomIn");
                //   document.getElementsByClassName("add_knockoutQuestion")[0].classList.add("animate__zoomOut");
                //   setTimeout(() => { this.dialogRef.close({data: this.AddObj,status: this.activestatus} ); }, 200);
                // }
                document.getElementsByClassName("add_knockoutQuestion")[0].classList.remove("animate__zoomIn");
                document.getElementsByClassName("add_knockoutQuestion")[0].classList.add("animate__zoomOut");
                setTimeout(() => { this.dialogRef.close({data: this.AddObj,status: this.activestatus} ); }, 200);
              }           
          }
        } else {      
            this.addForm.get("Question").clearValidators();
            this.addForm.get("Question").markAsPristine();
            this.addForm.get('Question').setValidators([Validators.required, Validators.maxLength(250), Validators.minLength(1)]);
          }
         },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
   
  }
  
  
  