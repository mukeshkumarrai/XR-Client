import { Component, EventEmitter, Inject, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';

@Component({
  selector: 'app-create-job-and-client-popup',
  templateUrl: './create-job-and-client-popup.component.html',
  styleUrls: ['./create-job-and-client-popup.component.scss']
})
export class CreateJobAndClientPopupComponent implements OnInit {

  saveEnableDisable: boolean = true;
  loading: boolean;
  listData: [] = [];
  selectedData: any

  noRecordFound: boolean = false;

  @ViewChild('workFlow') workFlow;
  public workFlowLenght:any=0;
  /*
   @Type: File, <ts>
   @Name: constructor function
   @Who: Anup Singh
   @When: 15-July-2021
   @Why: EWM-2001 EWM-2070
   @What: constructor for injecting services and formbuilder and other dependency injections
    */
  constructor(private fb: FormBuilder, public _sidebarService: SidebarService, private snackBService: SnackBarService, private commonserviceService: CommonserviceService,
    private route: Router, private translateService: TranslateService, private jobService: JobService, private routes: ActivatedRoute,
    public dialogRef: MatDialogRef<CreateJobAndClientPopupComponent>, @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog,
  ) {

  }



  ngOnInit(): void {
     this.JobTemplateList();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.workFlow.focus();
    }, 500);
  }

  /* 
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Anup Singh
  @When: 15-July-2021
  @Why: EWM-2001 EWM-2070
  @What: For popup close
 */
  onDismiss() {
    document.getElementsByClassName("selectJobTemplate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("selectJobTemplate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(); }, 200);

  }

  /* 
   @Type: File, <ts>
   @Name: goToCreateTemplate function
   @Who: Anup Singh
   @When: 15-July-2021
   @Why: EWM-2001 EWM-2070
   @What: For popup close and go to create template page
  */

  goToCreateTemplate() {
    document.getElementsByClassName("selectJobTemplate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("selectJobTemplate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(); }, 200);
    this.route.navigate(['/client/core/administrators/job-template-create/manage', {createJobForm: "template",workFlowLenght:this.data?.workFlowLenght}]);
  }





  /* 
   @Type: File, <ts>
   @Name: JobTemplateList function
   @Who: Anup Singh
   @When: 15-July-2021
   @Why: EWM-2001 EWM-2070
   @What:get job template data
  */
  JobTemplateList() {
    this.loading = true;
    this.jobService.getAllJobTemplateList().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (set total record)*/
          this.listData = repsonsedata['Data'];
          if (this.listData.length == 0) {
            this.noRecordFound = true;
          }
          else {
            this.noRecordFound = false;
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /* 
 @Type: File, <ts>
 @Name: selectedTempData function
 @Who: Anup Singh
 @When: 15-July-2021
 @Why: EWM-2001 EWM-2070
 @What: For disable enable continue btn
*/

  selectedTempData(data: any) {
    this.selectedData = data
    if (this.selectedData != null) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }
  }



  /* 
   @Type: File, <ts>
   @Name: goToQuickJobWithTempData function
   @Who: Anup Singh
   @When: 15-July-2021
   @Why: EWM-2001 EWM-2070
   @What: For popup close and go to create job form page
  */

  goToQuickJobWithTempData() {
    document.getElementsByClassName("selectJobTemplate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("selectJobTemplate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(this.selectedData); }, 200);

    this.route.navigate(['/client/jobs/job/job-manage/manage',
      { createJobForm: "template",workFlowLenght:this.data?.workFlowLenght,type: this.data?.type, clientId: this.data?.clientId,ClientName: this.data?.ClientName }]);
    this.commonserviceService.onTemplateSelect.next(this.selectedData);
  }



}
