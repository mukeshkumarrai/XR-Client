import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss']
})
export class SessionExpiredComponent implements OnInit {
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
 @When: 08-July-2022
 @Why: EWM-7574
 @What: For injection of service class and other dependencies
*/
 constructor(public dialogRef: MatDialogRef<SessionExpiredComponent>, public dialog: MatDialog,
   @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
   private snackBService: SnackBarService, private route: Router) { 
       this.loading = false;                  
   }
   ngOnInit(): void {
   }
/* 
  @Type: File, <ts>
  @Name: onSave function
  @Who: Nitin Bhati
 @When: 08-July-2022
  @Why: EWM-7574
  @What: For passing data  to onsave question 
 */
 onSave() {
   this.submitted = true;
   document.getElementsByClassName("add_sessionExpValidation")[0].classList.remove("animate__zoomIn");
   document.getElementsByClassName("add_sessionExpValidation")[0].classList.add("animate__zoomOut");
   setTimeout(() => { this.dialogRef.close(true); }, 200);
  
    }
    /*
     @Name: onDismiss
     @Who: Nitin Bhati
     @When: 08-July-2022
     @Why: EWM-7574
     @What: Function will call when user click on cancel button.
   */
     onDismiss(): void {
       document.getElementsByClassName("add_sessionExpValidation")[0].classList.remove("animate__zoomIn");
       document.getElementsByClassName("add_sessionExpValidation")[0].classList.add("animate__zoomOut");
       setTimeout(() => { this.dialogRef.close(false); }, 200);
     }
  
  
 }
 
 
 