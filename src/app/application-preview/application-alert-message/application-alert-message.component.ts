import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-application-alert-message',
  templateUrl: './application-alert-message.component.html',
  styleUrls: ['./application-alert-message.component.scss']
})
export class ApplicationAlertMessageComponent implements OnInit {
  public jobDetails: any;

  constructor(public dialogRef: MatDialogRef<ApplicationAlertMessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) { 
    this.jobDetails=data.jobDetails;
  }

  ngOnInit(): void {
  }

  onDismiss(){
    document.getElementsByClassName("application-alert-msg")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("application-alert-msg")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

}
