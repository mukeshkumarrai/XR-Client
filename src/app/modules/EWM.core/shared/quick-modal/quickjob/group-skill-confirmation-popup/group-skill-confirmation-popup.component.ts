import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-group-skill-confirmation-popup',
  templateUrl: './group-skill-confirmation-popup.component.html',
  styleUrls: ['./group-skill-confirmation-popup.component.scss']
})
export class GroupSkillConfirmationPopupComponent implements OnInit {
  title: string;
  subtitle:string;
  message: string;
  id:number;
  siteDomainUpdate: boolean = false;
  orgDataEnable:boolean = false;
  public candidateIdData: any;
  public candidateDataString:any;
  constructor(public dialogRef: MatDialogRef<GroupSkillConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private commonserviceService: CommonserviceService) { 
     this.candidateIdData=data.skillGroupByIdList;
    //  let arr = [];
    //  this.candidateIdData.forEach(element => {
    //      arr.push(element.SkillName);
       
    //  });
    //  this.candidateDataString = arr.toString();
    }

  ngOnInit(): void {
  }
/* @(C): Entire Software
@Type: File, <ts>
@Who: Nitin Bhati
@When: 15-Sep-2021
@Why: EWM-2756
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */

onConfirm(): void {
  // Close the dialog, return true
  //this.dialogRef.close(true);
  document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
  setTimeout(()=>{this.dialogRef.close(true);}, 200);
  
}

/* @(C): Entire Software
@Type: File, <ts>
@Who: Nitin Bhati
@When: 15-Sep-2021
@Why: EWM-2756
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
*/

onDismiss(): void {
  // Close the dialog, return false
  //this.dialogRef.close(false);
  document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
  
}

}
