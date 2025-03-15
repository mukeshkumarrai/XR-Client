import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-disconnect-email',
  templateUrl: './disconnect-email.component.html',
  styleUrls: ['./disconnect-email.component.scss']
})
export class DisconnectEmailComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DisconnectEmailComponent>,) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
   document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
   document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
   setTimeout(() => {this.dialogRef.close(); }, 200);
 }

}
