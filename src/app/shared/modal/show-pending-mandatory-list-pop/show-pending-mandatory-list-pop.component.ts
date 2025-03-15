// <!--- 
//     @Type: File, <html>
//     @Name:show-pending-mandatory-list-pop.component.ts 
//     @Who: Adarsh singh
//     @When: 16-June-2023
//     @Why: EWM-11779 EWM-12547
//     @What: This page wil be use only for the warning alert TS
// -->

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-pending-mandatory-list-pop',
  templateUrl: './show-pending-mandatory-list-pop.component.html',
  styleUrls: ['./show-pending-mandatory-list-pop.component.scss']
})
export class ShowPendingMandatoryListPopComponent implements OnInit {

 
  title: string;
  subtitle:string;
  message: string = null;

  SkipStageName=null;
  appId: any;
  redirectAppid: any;
  checklistAssessmentArray:any;

  constructor(public dialogRef: MatDialogRef<ShowPendingMandatoryListPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WarningDialogModel, private router: Router) {
    console.log(data,'data');
    this.title = data?.dialogData?.title;
    this.subtitle = data?.dialogData?.subtitle;
    this.message = data?.dialogData?.message;
    this.checklistAssessmentArray = data?.checklistAssessment;
    console.log( this.checklistAssessmentArray,' this');
    
  }
  ngOnInit() {   
  }
  
/*  
@Type: File, <ts>
@Name: warning-dialog.compenent.ts
@Who: Adarsh singh
@When: 16-June-2023
@Why: EWM-11779 EWM-12547
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */

  onConfirm(): void {
    document.getElementsByClassName("animate__animated")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("animate__animated")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(true);}, 200);
    
  }

  /* @(C): Entire Software
@Type: File, <ts>
@Name: warning-dialog.compenent.ts
@Who: Adarsh singh
@When: 16-June-2023
@Why: EWM-11779 EWM-12547
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */
 
  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
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
  
  constructor(public title: string,public subtitle: string, public message: string, public checklistAssessment:any) {
  }


}
