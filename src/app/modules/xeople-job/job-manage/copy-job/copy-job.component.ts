/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 17-Nov-2021
    @Why: EWM-3131 EWM-3796
    @What:  This page is for copy job
*/

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-copy-job',
  templateUrl: './copy-job.component.html',
  styleUrls: ['./copy-job.component.scss']
})
export class CopyJobComponent implements OnInit {
  QuickFilter:string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
  private snackBService: SnackBarService, private serviceListClass: ServiceListClass,private route: Router,
  public dialogRef: MatDialogRef<CopyJobComponent>, private commonserviceService: CommonserviceService, public dialog: MatDialog,
   private translateService: TranslateService,
   public systemSettingService: SystemSettingService) {
    this.QuickFilter=data?.QuickFilterForClone; //by maneesh for clone job  
}


ngOnInit(): void {
}


/*
@Type: File, <ts>
@Name: onDismiss function
@Who:  ANUP
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: For cancel popup
*/
onDismiss(): void {
  document.getElementsByClassName("add_copyJob")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_copyJob")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}



  /* 
@Type: File, <ts>
@Name: checkUncheckedGeneral function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: for checked unchecked for general
*/
classToggledGeneral:any=false;
checkUncheckedGeneral() {
  this.classToggledGeneral = !this.classToggledGeneral; 
}


  /* 
@Type: File, <ts>
@Name: checkUncheckedJobDetails function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: for checked unchecked for job details
*/
classToggledJobDetails:any=false;
checkUncheckedJobDetails() {
  this.classToggledJobDetails = !this.classToggledJobDetails; 
}

 /* 
@Type: File, <ts>
@Name: checkUncheckedSalary function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: for checked unchecked for salary
*/
classToggledSalary:any=false;
checkUncheckedSalary() {
  this.classToggledSalary = !this.classToggledSalary; 
}

  /* 
@Type: File, <ts>
@Name: checkUncheckedJobDescription function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: for checked unchecked for job Description
*/
classToggledJobDescription:any=false;
checkUncheckedJobDescription() {
  this.classToggledJobDescription = !this.classToggledJobDescription; 
}

  /* 
@Type: File, <ts>
@Name: checkUncheckedAdvanced function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: for checked unchecked for Advanced
*/
classToggledAdvanced:any=false;
checkUncheckedAdvanced() {
  this.classToggledAdvanced = !this.classToggledAdvanced; 
}

  /* 
@Type: File, <ts>
@Name: checkUncheckedPublish function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: for checked unchecked for Publish
*/
classToggledPublish:any=false;
checkUncheckedPublish() {
  this.classToggledPublish = !this.classToggledPublish; 
}

  /* 
@Type: File, <ts>
@Name: checkUncheckedPublish function
@Who: Anup Singh
@When: 17-Nov-2021
@Why: EWM-3131 EWM-3796
@What: for checked unchecked for Publish
*/
onConfirmToNext(): void {
  document.getElementsByClassName("add_copyJob")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_copyJob")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(true); }, 200);  
  this.route.navigate(['/client/jobs/job/job-manage/manage'],{
    queryParams: {jobId: this.data?.jobId, editForm:'copyForm',filter:this.QuickFilter}
  });
  let ArrSectionForJobCopy:any[] = [];
  ArrSectionForJobCopy.push({isGeneral:this.classToggledGeneral, isJobDetails:this.classToggledJobDetails, 
    isSalary:this.classToggledSalary, isJobDescription:this.classToggledJobDescription, isAdvanced:this.classToggledAdvanced,
     isPublish:this.classToggledPublish})
  this.commonserviceService.onJobCopySectionSelect.next(ArrSectionForJobCopy);

        
}

}
