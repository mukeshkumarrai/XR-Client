/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Nitin Bhati
  @When: 14-Jan-2022
  @Why: EWM-4545
  @What:  This page will be use for the mark done Activity template Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { FolderMaster } from 'src/app/shared/models/candidate-folder';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateFolderService } from 'src/app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
@Component({
  selector: 'app-mark-done-activity',
  templateUrl: './mark-done-activity.component.html',
  styleUrls: ['./mark-done-activity.component.scss']
})
export class MarkDoneActivityComponent implements OnInit {

   /**********************All generic variables declarations for accessing any where inside functions********/
   maxMessage = 100;
   addForm: FormGroup;
   public loading: boolean = false;
   public activestatus: boolean = false;
   public submitted = false;
   public AddObj = {};
   public tempID: number;
   public editId;
  remarkStatus: any;
  remarks: any;
  public divStatus: boolean = false;
  toggleId: any;
 
   /* 
    @Type: File, <ts>
    @Name: constructor function
    @Who: Nitin Bhati
    @When: 14-Jan-2022
    @Why: EWM-4545
    @What: For injection of service class and other dependencies
   */
 
   constructor(public dialogRef: MatDialogRef<MarkDoneActivityComponent>, public dialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
     private snackBService: SnackBarService, private _CandidateFolderService: CandidateFolderService, private route: Router,public candidateService: CandidateService) {
    this.remarkStatus = data.remarkStatusId;
    this.remarks = data.remarks;
     this.editId = data.editId;
     this.addForm = this.fb.group({
       Id: [''],
      //  who:maneesh,what:ewm-11932 for remove required validation, when:19/04/2023
       Description: ['', [Validators.maxLength(100)]],
       MarkDoneTogle: [false],
     });
   }
   ngOnInit(): void {
    this.addForm.controls["Description"].disable();
    if (this.remarkStatus === 1) {
      this.divStatus=true;
      this.addForm.patchValue({
        Description: this.remarks,
        MarkDoneTogle: this.remarkStatus,
      });
      this.activestatus=true;
      this.addForm.controls["MarkDoneTogle"].disable();
      this.addForm.controls["Description"].disable();
     }
   }
 
   
   /* 
    @Type: File, <ts>
    @Name: onSave function
    @Who: Nitin Bhati
    @When: 17-Jan-2022
    @Why: EWM-4545
    @What: For checking wheather the data save or edit on the basis on active status
   */
   onSave(value) {
     this.submitted = true;
     if (this.addForm.invalid) {
       return;
     }
     this.createRemarkStatus(value);
    }
   /* 
    @Type: File, <ts>
    @Name: createRemarkStatus function
    @Who: Nitin Bhati
    @When: 14-Jan-2022
    @Why: EWM-4545
    @What: For saving Update activity Remark data
   */
 
   createRemarkStatus(value) {
     this.loading = true;
     let MarkDoneTogle: any;
     if (value.MarkDoneTogle == true) {
       MarkDoneTogle = 1;
     } else {
       MarkDoneTogle = 0;
     }
     this.AddObj['Id'] = this.editId;
     this.AddObj['IsCompleted'] = parseInt(MarkDoneTogle);
     this.AddObj['Remarks'] = value.Description;
     this.candidateService.createActivityReadMark(this.AddObj).subscribe((repsonsedata: FolderMaster) => {
       if (repsonsedata.HttpStatusCode === 200) {
         this.loading = false;
           document.getElementsByClassName("add_Manage")[0].classList.remove("animate__zoomIn");
           document.getElementsByClassName("add_Manage")[0].classList.add("animate__zoomOut");
           setTimeout(() => { this.dialogRef.close(true); }, 200);
            this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
       @Name: clickToggleData
       @Who: Nitin Bhati
       @When: 14-Jan-2022
       @Why: EWM-4545
       @What: For on/Off Toggle button.
     */
   clickToggleData(){
   this.toggleId= this.addForm.get("MarkDoneTogle").value;
   if(this.toggleId==false){
    this.addForm.controls["Description"].enable();
     this.divStatus=true; 
   }else{
    this.addForm.controls["Description"].disable();
     this.divStatus=false; 
   }
   }
/*
       @Name: onMessage
       @Who: Nitin Bhati
       @When: 18-Jan-2022
       @Why: EWM-4545
       @What: For Text count.
     */
   public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 100 - value.length;
    }
  }
    /*
       @Name: onDismiss
       @Who: Nitin Bhati
       @When: 14-Jan-2022
       @Why: EWM-4545
       @What: Function will call when user click on cancel button.
     */
       onDismiss(): void {
        document.getElementsByClassName("add_Manage")[0].classList.remove("animate__zoomIn");
        document.getElementsByClassName("add_Manage")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close(false); }, 200);
      }

 }
 
 
 