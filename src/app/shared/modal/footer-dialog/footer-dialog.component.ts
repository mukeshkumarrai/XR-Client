// @(C): Entire Software
// @Type: ts
// @Name: Footermodal.component.ts
// @Who: Naresh SIngh
// @When: 04-Jun-2021
// @Why: #EWM-1729
// @What: This file handle open modal and put data in modal window
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-dialog',
  templateUrl: './footer-dialog.component.html',
  styleUrls: ['./footer-dialog.component.scss']
})
export class FooterDialogComponent implements OnInit {

  title: string;
  content: string;
  count: any;
  constructor(
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<FooterDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any[]) {
    const tempRoster = JSON.parse(JSON.stringify(data));
    this.title = tempRoster.title;
    this.content = tempRoster.content;
    this.count = Object.keys(data).length;

    if (this.count > 2) {
      this.title = tempRoster.title;
      this.content = tempRoster.content;
    } else {
      this.title = tempRoster.title;
      this.content = tempRoster.content;
    }
  }
  

  
  ngOnInit(): void {
  }

  // @(C): Entire Software
  // @Type: Function
  // @Who: Mukesh kumar rai
  // @When: 10-Sept-2020
  // @Why:  Open for modal window
  // @What: This function responsible to open and close the modal window.
  // @Return: None
  // @Params :
  onNoClick(): void {    
    //this.dialogRef.close();
   document.getElementsByClassName("footerPopUp")[0].classList.remove("animate__fadeInUpBig")
   document.getElementsByClassName("footerPopUp")[0].classList.add("animate__fadeOutDownBig");
   setTimeout(() => {this.dialogRef.close(); }, 500);
 }

}
