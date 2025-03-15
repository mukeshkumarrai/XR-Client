import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {

  title: string;
  subtitle:string;
  message: string;
  id:number;
  siteDomainUpdate: boolean = false;
  orgDataEnable:boolean = false;
  noQuestionMark:boolean = true;
  isQuestionMark: boolean = true;
  isWithoutQuestionMark:boolean=false;
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel,private commonserviceService: CommonserviceService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService) {
    // Update view with given values
    this.isWithoutQuestionMark=data['WithoutQuestionMark'];
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.message = data.message; 
    if(this.isWithoutQuestionMark) {
      this.title = data['dialogData'].title;
      this.subtitle = data['dialogData'].subtitle;
      this.message = data['dialogData'].message;
      }
    if(data.noQuestionMark!=undefined){
      this.noQuestionMark = data.noQuestionMark;
    }

  
    // if( this.message=='label_org')
    // {
    //   this.orgDataEnable=true;
      
    // }
    
    //  if(this.subtitle=="label_siteDomain"){
    //   this.siteDomainUpdate=true;
    // }
   
  }
  ngOnInit() { 
      this.subtitle =  this.subtitle ? this.translateService.instant(this.subtitle): '';
      this.filterData();
  }
  
   /* @(C): Entire Software
@Type: File, <ts>
@Name: confirm-dialog.compenent.ts
@Who: Renu
@When: 19-Sep-2020
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */

  onConfirm(): void {
    // Close the dialog, return true
    //this.dialogRef.close(true);
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(true);}, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

/* @(C): Entire Software
@Type: File, <ts>
@Name: confirm-dialog.compenent.ts
@Who: Renu
@When: 19-Sep-2020
@Why: For Closing the dialog pop-up.
@What: Function will call when user click on ADD/EDIT BUUTONS.
 */
 
  onDismiss(): void {
    // Close the dialog, return false
    //this.dialogRef.close(false);
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(()=>{this.dialogRef.close(false);}, 200);
    this.commonserviceService.onOrgSelectId.next(null);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

/* @(C): Entire Software
@Type: File, <ts>
@Name: confirm-dialog.compenent.ts
@Who: Adarsh singh
@When: 26-March-2022
@Why: EWM-5544
@What: remove unncessary question mark 
 */
   filterData(){
      const filteredThatArray = this.subtitle.split(' ').filter((item) => item =="?");
      if (filteredThatArray[0] == '?') {
        this.isQuestionMark = false;
      }else{
        this.isQuestionMark = true;
      }
      // console.log(filteredThatArray);
   }

}
 
/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {
 
  constructor(public title: string,public subtitle: string, public message: string,public iscloseJob?:boolean,public noQuestionMark?:boolean,public prefixmsg?:string,public prefixsubtittle?:string) {
  }

}
