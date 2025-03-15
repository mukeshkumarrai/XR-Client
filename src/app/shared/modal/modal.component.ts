// @(C): Entire Software
// @Type: ts
// @Name: modal.component.ts
// @Who: Mukesh Kumar rai
// @When: 10-Sept-2020
// @Why: #ROST-185
// @What: This file handle open modal and put data in modal window
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  title: string;
  content: string;
  count: any;
  constructor(
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<ModalComponent>,
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
   document.getElementsByClassName("imageModal")[0].classList.remove("animate__zoomIn")
   document.getElementsByClassName("imageModal")[0].classList.add("animate__zoomOut");
   setTimeout(() => {this.dialogRef.close(false); }, 200);
 }
}
