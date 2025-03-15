import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';
import { DisconnectEmailComponent } from '../disconnect-email/disconnect-email.component';

@Component({
  selector: 'app-email-confirm-dialog',
  templateUrl: './email-confirm-dialog.component.html',
  styleUrls: ['./email-confirm-dialog.component.scss']
})
export class EmailConfirmDialogComponent implements OnInit {

  title: string;
  subtitle:string;
  message: string;
  id:number;
  siteDomainUpdate: boolean = false;
  orgDataEnable:boolean = false;

  constructor(public dialogRef: MatDialogRef<EmailConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,private commonserviceService: CommonserviceService, public dialog: MatDialog) {
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
    //this.dialogRef.close(true);
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(true);}, 200);
    
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
    //this.dialogRef.close(false);
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(false);}, 200);
    this.commonserviceService.onOrgSelectId.next(null);
    
  }

 
}
 
/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {
 
  constructor(public title: string,public subtitle: string, public message: string) {
  }

}
