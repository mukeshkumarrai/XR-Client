/* (C): Entire Software
@Type: File, <ts>
@Name: domain-confrim-dialog.component
@Who: Renu
@When: 11-feb-2021
@Why: For opening the dialog pop-up for Delete
@What: Function will call when user click on any action buttons.
*/
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-domain-confirm-dialog',
  templateUrl: './domain-confirm-dialog.component.html',
  styleUrls: ['./domain-confirm-dialog.component.scss']
})
export class DomainConfirmDialogComponent implements OnInit {

  title: string;
  subtitle:string;
  message: string;
  id:number;
  constructor(public dialogRef: MatDialogRef<DomainConfirmDialogComponent>, 
     @Inject(MAT_DIALOG_DATA) public data: DomainConfirmDialogModel) {
    // Update view with given values
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.message = data.message;
  }
  ngOnInit() {
   
  }
  
   /* @(C): Entire Software
@Type: File, <ts>
@Name: confirm-dialog.compenent.ts
@Who: Renu
@When: 19-Sep-2020
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
    
  }

  /* @(C): Entire Software
@Type: File, <ts>
@Name: confirm-dialog.compenent.ts
@Who: Renu
@When: 19-Sep-2020
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */
 
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
    
  }
}
 
/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class DomainConfirmDialogModel {
 
  constructor(public title: string,public subtitle: string, public message: string) {
  }

}
