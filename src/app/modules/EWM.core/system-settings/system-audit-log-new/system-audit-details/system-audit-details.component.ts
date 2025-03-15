import { Component, Inject,  OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';


@Component({
  selector: 'app-system-audit-details',
  templateUrl: './system-audit-details.component.html',
  styleUrls: ['./system-audit-details.component.scss']
})
export class SystemAuditDetailsComponent implements OnInit {
  dataItem:any;
  public changeObject: any;
  public oldchangeObject: any;
  public userpreferences: Userpreferences;
  constructor(public dialogRef: MatDialogRef<SystemAuditDetailsComponent>,public _userpreferencesService: UserpreferencesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dataItem=data;
     }
  ngOnInit(): void {
    
    this.changeObject = JSON.parse(this.dataItem.ChangeObjectinJson);
    this.oldchangeObject = JSON.parse(this.dataItem.OldObjectinJson);
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
  // onConfirm(): void {
  //   document.getElementsByClassName("animate__animated")[0].classList.remove("animate__zoomIn")
  //   document.getElementsByClassName("animate__animated")[0].classList.add("animate__zoomOut");
  //   setTimeout(()=>{this.dialogRef.close(true);}, 200);
    
  // }
  onNoClick(): void {
    document.getElementsByClassName("animate__animated")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("animate__animated")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(false);}, 200);
   
  }
  
}
