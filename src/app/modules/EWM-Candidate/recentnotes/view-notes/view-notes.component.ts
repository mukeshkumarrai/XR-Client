import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.scss']
})
export class ViewNotesComponent implements OnInit {
  loading: boolean;
  ViewNotesData:any='';
  JobDescription:any='';

  ISDescription:boolean; 
  JobDescriptionData:string
  constructor(public dialogRef: MatDialogRef<ViewNotesComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private translateService: TranslateService, 
  private snackBService: SnackBarService) {

    this.ViewNotesData=data.notesViewInfo;
    this.JobDescription=data.JobDescription;


    
if (data.IsDiscription) {
  this.ISDescription=true;
} else {
  this.ISDescription=false;
  
}
    // console.log("data.notesViewInfo",data.notesViewInfo)
   }

  ngOnInit(): void {
  }

  onDismiss()
  {
    document.getElementsByClassName("view_notes")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("view_notes")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

}
