/*
@(C): Entire Software
@Type: File, <ts>
@Who: Adarsh singh
@When: 06-June-2023
@Why: EWM-11779.EWM-12547
@What: This component is used forUnsavedConfirmPopComponent
*/

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';


@Component({
  selector: 'app-unsaved-confirm-pop',
  templateUrl: './unsaved-confirm-pop.component.html',
  styleUrls: ['./unsaved-confirm-pop.component.scss']
})
export class UnsavedConfirmPopComponent implements OnInit {

  title: string;
  subtitle: string;
  message: string;
  id: number;
  siteDomainUpdate: boolean = false;
  orgDataEnable: boolean = false;
  noQuestionMark: boolean = true;
  isQuestionMark: boolean = true;

  constructor(public dialogRef: MatDialogRef<UnsavedConfirmPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel, private commonserviceService: CommonserviceService,
    private translateService: TranslateService, private appSettingsService: AppSettingsService) {
    // Update view with given values

    this.title = data.title;
    this.subtitle = data.subtitle;
    this.message = data.subtitle;
    if (data.noQuestionMark != undefined) {
      this.noQuestionMark = data.noQuestionMark;
    }
  }
  ngOnInit() {
    this.subtitle = this.translateService.instant(this.subtitle);
    this.filterData();
  }

  /* 
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Adarsh singh
  @When: 06-June-2023
  @Why: EWM-11779.EWM-12547
  @What: Function will call when user click on ADD/EDIT BUUTONS.
  */
  onConfirm(): void {
    // Close the dialog, return true
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({mode: true}); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /* @(C): Entire Software
  @Type: File, <ts>
  @Who: Adarsh singh
  @When: 06-June-2023
  @Why: EWM-11779.EWM-12547
  @What: Function will call when user click on ADD/EDIT BUUTONS.
  */

  onDismiss(): void {
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({mode: false}); }, 200);
    this.commonserviceService.onOrgSelectId.next(null);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /* @(C): Entire Software
  @Type: File, <ts>
  @Who: Adarsh singh
  @When: 06-June-2023
  @Why: EWM-11779.EWM-12547
  @What: remove unncessary question mark 
  */
  filterData() {
    const filteredThatArray = this.subtitle.split(' ').filter((item) => item == "?");
    if (filteredThatArray[0] == '?') {
      this.isQuestionMark = false;
    } else {
      this.isQuestionMark = true;
    }
  }

  onPopupClose(){
    document.getElementsByClassName("custom-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("custom-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({mode: 1}); }, 200);
  }

}
export class ConfirmDialogModel {

  constructor(public title: string, public subtitle: string, public message: string, public noQuestionMark?: boolean, public prefixmsg?: string, public prefixsubtittle?: string) {
  }

}
