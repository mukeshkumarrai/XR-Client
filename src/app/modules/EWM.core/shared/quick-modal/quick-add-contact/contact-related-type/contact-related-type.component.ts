import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ProfileInfoService } from '../../../services/profile-info/profile-info.service';
import { SystemSettingService } from '../../../services/system-setting/system-setting.service';
import { AddContactRelatedToComponent } from '../add-contact-related-to/add-contact-related-to.component';

@Component({
  selector: 'app-contact-related-type',
  templateUrl: './contact-related-type.component.html',
  styleUrls: ['./contact-related-type.component.scss']
})
export class ContactRelatedTypeComponent implements OnInit {

  public loading:boolean=false;
  public contactRelatedTypeList:any=[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ContactRelatedTypeComponent>,
    private textChangeLngService:TextChangeLngService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,private profileInfoService: ProfileInfoService) {

  }

  ngOnInit(): void {
    this.getAllContactRelatedType();
  }




    /* 
    @Type: File, <ts>
    @Name: onDismiss
@Who: Anup Singh
@When: 26-Nov-2021
@Why: EWM-3700 EWM-3916
    @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
 onDismiss(): void {
 document.getElementsByClassName("AddContactRelatedType")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("AddContactRelatedType")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close({resType:false}); }, 200);
}



/*
@Type: File, <ts>
@Name: openModelContactRelatedType
@Who: Anup Singh
@When: 26-Nov-2021
@Why: EWM-3700 EWM-3916
@What: open Modal for contact related type
*/
openModelContactRelatedTo(value){
  if(value.InternalName==="Client" && value !=undefined){
 const dialogRef = this.dialog.open(AddContactRelatedToComponent, {
      // maxWidth: "1000px",
      data: new Object({ Id: value.Id, clientId:this.data?.clientId}),
      // width: "90%",
      // height: "75%",
      // minHeight: "250px",
      panelClass: ['xeople-modal', 'AddContactRelatedTo', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resType == true) {
        document.getElementsByClassName("AddContactRelatedType")[0].classList.remove("animate__zoomIn")
        document.getElementsByClassName("AddContactRelatedType")[0].classList.add("animate__zoomOut");
        setTimeout(() => { this.dialogRef.close({resType:true, clientArr:res.clientArr}); }, 200);
     }else if(res.resType==='goToClientDetail'){
      document.getElementsByClassName("AddContactRelatedType")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("AddContactRelatedType")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({resType:"goToClientDetails"}); }, 200);
     }
      else {
      // console.log("false")
       }
  
    }) 
  }
  
  
}


 /*
   @Type: File, <ts>
   @Name: getAllContactRelatedType function
   @Who: Anup Singh
   @When: 29-Nov-2021
   @Why: EWM-3700 EWM-3916
   @What: For All contact related type List
   */
 
  getAllContactRelatedType() {
    this.loading = true;
    this.systemSettingService.getAllContactRelatedType().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.contactRelatedTypeList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }



}
