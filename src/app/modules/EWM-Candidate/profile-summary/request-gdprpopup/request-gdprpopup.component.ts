import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-request-gdprpopup',
  templateUrl: './request-gdprpopup.component.html',
  styleUrls: ['./request-gdprpopup.component.scss']
})
export class RequestGdprpopupComponent implements OnInit {

  title: string;
  subtitle:string;
  message: string;
  id:number;
  siteDomainUpdate: boolean = false;
  orgDataEnable:boolean = false;
  

  constructor(public dialogRef: MatDialogRef<RequestGdprpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,private commonserviceService: CommonserviceService) {
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
@Who: Nitin Bhati
@When: 10-Feb-2022
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
@Who: Nitin Bhati
@When: 10-Feb-2022
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
 
  constructor(public title: string,public subtitle: string, public message: string,public prefixmsg?:string,public prefixsubtittle?:string) {
  }

}

