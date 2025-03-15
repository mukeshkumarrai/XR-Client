import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-xeople-search-msg',
  templateUrl: './xeople-search-msg.component.html',
  styleUrls: ['./xeople-search-msg.component.scss']
})
export class XeopleSearchMsgComponent implements OnInit {
  errorFieldNumber:string;
  constructor(public dialogObj: MatDialog, public _dialog: MatDialog, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private translateService: TranslateService,
    public dialogRef: MatDialogRef<XeopleSearchMsgComponent>,) { }

  ngOnInit(): void {    
    this.errorFieldNumber=this.data.errorFieldData;//by maneesh,when:21/05/2024 what:ewm-17100
  } 
  onDismiss(): void {
    localStorage.removeItem('selectSMSTemp');
    document.getElementsByClassName("JobSMSForCandidate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("JobSMSForCandidate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
}
