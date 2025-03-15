/*
 @Type: File, <ts>
 @Name: showownerlist component
 @Who:  maneesh
 @When: 15-06-2022
 @Why:  EWM.6960.EWM.7324
 @What: This page will be use for Job landing page Component ts file 
  */
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobService } from '../../../shared/services/Job/job.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';

@Component({
  selector: 'app-show-ownerlist-popup',
  templateUrl: './show-ownerlist-popup.component.html',
  styleUrls: ['./show-ownerlist-popup.component.scss']
})
export class ShowOwnerlistPopupComponent implements OnInit {
  loading: boolean;
  ownername: any;
  OwnerProfileImage: any;
  OwnerProfileImageUrl: any;
  public ownerList: any;
  constructor(public dialogRef: MatDialogRef<ShowOwnerlistPopupComponent>, public systemSettingService: SystemSettingService,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    private translateService: TranslateService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
    private jobService: JobService, public _userpreferencesService: UserpreferencesService,) {

    this.ownerList = this.data.ownerList;
  }
  ngOnInit(): void {
  }
  sortName(fisrtName, lastName) {
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.match(/\b(\w)/g).join('');
    return ShortName.toUpperCase();
  }
  onDismiss() {
    document.getElementsByClassName("all-owner-list")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("all-owner-list")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }
  
}