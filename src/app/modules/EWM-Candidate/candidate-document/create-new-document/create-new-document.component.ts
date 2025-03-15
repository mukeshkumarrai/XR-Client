import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';

@Component({
  selector: 'app-create-new-document',
  templateUrl: './create-new-document.component.html',
  styleUrls: ['./create-new-document.component.scss']
})
export class CreateNewDocumentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateNewDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private appSettingsService: AppSettingsService) {
    //console.log(data,"data");
   }

  ngOnInit(): void {
  }
  onDismiss(value:string): void {
    document.getElementsByClassName("add-folder-document")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-folder-document")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(value);}, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

}
