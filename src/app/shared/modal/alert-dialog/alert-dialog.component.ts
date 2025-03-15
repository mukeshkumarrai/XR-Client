import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  
  title: string;
  subtitle:string;
  message: string = null;
  label1: string;
  label2: string;
  label3: string;
  id:number;
  isOkButtonShow:boolean=false;
  isOkButton:boolean=false;
  isTrue:boolean;

  SkipStageName=null;
  appId: any;
  redirectAppid: any;
  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WarningDialogModel, private router: Router) {


    // Update view with given values
    this.title = data?.title;
    this.subtitle = data?.subtitle;
    this.message = data?.message;
    this.isOkButtonShow = data?.isButtonShow;
    this.isOkButton = data?.isButtonShow;
    this.appId= data['appId'];     
    // this.isTrue=data?.isTrue;
    data?.SkipStageName
    if (data?.isButtonShow) {
    this.title = data?.dialogData.title;
    this.subtitle = data?.dialogData.subtitle;
    this.message = data?.dialogData?.message;
    this.label1 = data?.message1;
    this.label2 = data?.message2;
    this.label3 = data?.message3;
    }
    
    if(data?.SkipStageName!=undefined){
    this.SkipStageName = '';
    this.label1 = data?.message1;
    this.label2 = '';
    this.label3 = '';
    }

  }
  ngOnInit() {   
    this.isOkButtonShow = this.data?.isButtonShow;
  }
  
/* @(C): Entire Software
@Type: File, <ts>
@Name: warning-dialog.compenent.ts
@Who: Nitin Bhati
@When: 17-march-2021
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
@Name: warning-dialog.compenent.ts
@Who: Nitin Bhati
@When: 17-March-2021
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */
 
  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(false);}, 200);
    
  }
     /*
  @Type: File, <ts>
  @Name: redirectTo
  @Who: maneesh
  @When: 20-03-2023
  @Why: EWM-3320 EWM-3344  can=job/application-form-configure
  @What: redirect ot workflow page
 */
redirectTo() {
  // this.router.navigate(['../application-form-configure',{ Id: this.appId }])
  document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
  setTimeout(()=>{this.dialogRef.close(true);}, 200);
}

  /* @(C): Entire Software
@Type: File, <ts>
@Name: warning-dialog.compenent.ts
@Who: maneesh
@When: 31-March-2023
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */
 
onDismissToggel(): void {
  document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
  setTimeout(()=>{this.dialogRef.close(false);}, 200);
  
}
}
 
/**
 * Class to represent inform dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class WarningDialogModel {
  isButtonShow: any;
  dialogData: any;
  SkipStageName:any;
  message1:any;
  message2:any;
  message3:any;
  constructor(public title: string,public subtitle: string, public message: string) {
  }


}
