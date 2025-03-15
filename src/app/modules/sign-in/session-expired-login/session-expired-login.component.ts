import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-session-expired-login',
  templateUrl: './session-expired-login.component.html',
  styleUrls: ['./session-expired-login.component.scss']
})
export class SessionExpiredLoginComponent implements OnInit {

  /**********************All generic variables declarations for accessing any where inside functions********/
addForm: FormGroup;
public loading: boolean = false;
public submitted = false;
public AddObj = {};
 public activestatus: string = 'Add';
 name: any;
 dirctionalLang;
/* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati
 @When: 08-July-2022
 @Why: EWM-7574
 @What: For injection of service class and other dependencies
*/
 constructor(public dialogRef: MatDialogRef<SessionExpiredLoginComponent>, public dialog: MatDialog,
   @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private translateService: TranslateService,
   private snackBService: SnackBarService, private route: Router,public router: Router) { 
       this.loading = false;                  
   }
   ngOnInit(): void {
   }
/* 
  @Type: File, <ts>
  @Name: onRedirect function
  @Who: Nitin Bhati
 @When: 08-July-2022
  @Why: EWM-7574
  @What: For passing data  to onsave onRedirect 
 */
  onRedirect() {
   // this.router.navigate(['/login']);
   this.submitted = true;
   document.getElementsByClassName("add_sessionExpValidation")[0].classList.remove("animate__zoomIn");
   document.getElementsByClassName("add_sessionExpValidation")[0].classList.add("animate__zoomOut");
   setTimeout(() => { this.dialogRef.close(true); }, 200);

  
 }
 
}
 
