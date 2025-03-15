/*
  @(C): Entire Software
  @Type: File, <TS>
  @Who: Nitin Bhati
  @When: 02-06-2023
  @Why: EWM-11915
  @What: restrict candidate.component.ts
 */
  import { Component, Inject, OnInit } from '@angular/core';
  import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-restrict-candidate',
  templateUrl: './restrict-candidate.component.html',
  styleUrls: ['./restrict-candidate.component.scss']
})
export class RestrictCandidateComponent implements OnInit {
  loading: boolean;
  dirctionalLang;
  AlertMessage: any;
  constructor(public dialogRef: MatDialogRef<RestrictCandidateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog) {
      this.AlertMessage=data;
    }
  /*
   @Type: File, <ts>
   @Name: ngOnInit function
   @Who: Nitin Bhati
   @When: 02-06-2023
   @Why: EWM-11915
   @What: calling function while opening the modal
 */
  ngOnInit(): void {
   
    }
  /*
   @Type: File, <ts>
   @Name: onDismiss function
   @Who: Nitin Bhati
   @When: 02-06-2023
   @Why: EWM-11915
   @What: for close modal
 */
  onDismiss(): void {
    document.getElementsByClassName("RestrictCandidateComponent")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("RestrictCandidateComponent")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
   }

}
