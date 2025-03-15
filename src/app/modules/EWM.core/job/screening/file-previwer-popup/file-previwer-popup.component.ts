import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';

@Component({
  selector: 'app-file-previwer-popup',
  templateUrl: './file-previwer-popup.component.html',
  styleUrls: ['./file-previwer-popup.component.scss']
})
export class FilePreviwerPopupComponent implements OnInit {
  public url: any;
  public viewer = 'url';
  public isLoading: boolean = true;
  public fileType: any;
  // <!-- @bantee @whn 27-05-2023 @whyEWM-12535 to show corresponding tab name; -->
  public showTabName: string;
  docStatus: boolean;
  // public loading: boolean=true;
  /*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: maneesh
    @When: 25-may-2021
    @Why: -EWM-5839-EWM-5872
    @What:  this component created for open popup reason and copmlete the functionlity openpopup
*/
  constructor(public dialogRef: MatDialogRef<FilePreviwerPopupComponent>, public systemSettingService: SystemSettingService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.url = data?.ResumeUrl;
    this.showTabName = data?.TabName;
    const list = data?.FileName?.split('.');
    if (list != undefined) {
      this.fileType = list[list?.length - 1];
      if(this.fileType?.toLowerCase()=='jpg' || this.fileType?.toLowerCase()=='png' || this.fileType?.toLowerCase() == 'jpeg' || this.fileType?.toLowerCase() == 'gif'){
        this.docStatus=false;
      }
      else if (this.fileType?.toLowerCase() == 'pdf') {
        this.docStatus=true;
        this.viewer = 'url';
      } else {
        this.docStatus=true;
        this.viewer = 'office';
      }
    }
  }
  ngOnInit(): void {
    this.isLoading = false;
  }
  /*
   @(C): Entire Software
   @Type: File, <ts>
   @Who: maneesh
   @When: 25-may-2022
   @Why: -EWM-5839-EWM-5872
   @What: closing the pop-up 
*/
  onDismiss() {
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    document.getElementsByClassName("resume-docs")[0].classList.remove("animate__fadeInDownBig")
    document.getElementsByClassName("resume-docs")[0].classList.add("animate__fadeOutUpBig");
    setTimeout(() => { this.dialogRef.close(false); }, 500);
  }
}
