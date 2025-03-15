//  @When: 18-09-2023 @who:maneesh @why: EWM-13769 @what: create component when click on expand icon for show discription
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-show-discription',
  templateUrl: './show-discription.component.html',
  styleUrls: ['./show-discription.component.scss']
})
export class ShowDiscriptionComponent implements OnInit {
  public url: any;
  public viewer = 'url';
  public isLoading: boolean = true;
  constructor(public dialogRef: MatDialogRef<ShowDiscriptionComponent>,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.url = data?.Discription;
    }
  ngOnInit(): void {
    this.isLoading = false;
  }
  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: maneesh
   @When: 07-09-2023
   @Why: -EWM-13769-EWM-13769
   @What: closing the pop-up 
*/
  onDismiss() {
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    document.getElementsByClassName("resume-docs")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("resume-docs")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
  }
}

