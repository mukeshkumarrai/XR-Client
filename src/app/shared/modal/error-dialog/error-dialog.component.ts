import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html'
})
export class ErrorDialogComponent implements OnInit {

  title: string;
  subtitle:string;
  message: string;
  id:number;
  constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogModel) {
    // Update view with given values
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.message = data.message;
  }
  ngOnInit() {
   
  }
  
   /* @(C): Entire Software
@Type: File, <ts>
@Name: error-dialog.compenent.ts
@Who: Nitin
@When: 17-March-2021
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */

  onConfirm(): void {
    // Close the dialog, return true
    //this.dialogRef.close(true);
    document.getElementsByClassName("animate__animated")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("animate__animated")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(true);}, 200);
    
  }

  /* @(C): Entire Software
@Type: File, <ts>
@Name: error-dialog.compenent.ts
@Who: Nitin Bhati
@When: 17-March-2021
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */
 
  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
    document.getElementsByClassName("animate__animated")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("animate__animated")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(false);}, 200);
    
  }
}
 
/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ErrorDialogModel {
 
  constructor(public title: string,public subtitle: string, public message: string) {
  }


}
