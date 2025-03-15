/*
  @(C): Entire Software
  @Type: File, <TS>
  @Name:create-job-and-client-popup.component.html
  @Who: nitin Bhati
  @When: 09-Feb-2023
  @Why: EWM-10420
 */

import { Component, EventEmitter, Inject, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { JobService } from '../../../../services/Job/job.service';
import { ConfigureJobTemplateComponent } from '../configure-job-template/configure-job-template.component';
import { QuickjobComponent } from '../../quickjob.component';
import { SystemSettingService } from '../../../../services/system-setting/system-setting.service';
import { ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-configure-template-popup',
  templateUrl: './configure-template-popup.component.html',
  styleUrls: ['./configure-template-popup.component.scss']
})
export class ConfigureTemplatePopupComponent implements OnInit {

  saveEnableDisable: boolean = true;
  loading: boolean;
  listData: [] = [];
  selectedData: any

  noRecordFound: boolean = false;

  @ViewChild('workFlow') workFlow;
  public workFlowLenght:any=0;
  dirctionalLang;
  configureFielddata=[];
  /*
   @Type: File, <ts>
   @Name: constructor function
   @Who: nitin Bhati
   @When: 09-Feb-2023
   @Why: EWM-10420
   @What: constructor for injecting services and formbuilder and other dependency injections
    */
  constructor(private fb: FormBuilder, public _sidebarService: SidebarService, private snackBService: SnackBarService, private commonserviceService: CommonserviceService,
    private route: Router, private translateService: TranslateService, private jobService: JobService, private routes: ActivatedRoute,
    public dialogRef: MatDialogRef<ConfigureTemplatePopupComponent>, @Optional()
    @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog,private systemSettingService: SystemSettingService
  ) {

  }
  ngOnInit(): void {
     this.JobTemplateList();
     /*@Who: Nitin Bhati,@When: 02-March-2023,@Why: EWM-11001,@What:For call configuration data*/
     this.getJobConfigureFieldPermission();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.workFlow.focus();
    }, 500);
  }

  /* 
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: nitin Bhati
  @When: 09-Feb-2023
  @Why: EWM-10420
  @What: For popup close
 */
  onDismiss() {
    document.getElementsByClassName("selectJobTemplate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("selectJobTemplate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);

  }

  /* 
   @Type: File, <ts>
   @Name: goToCreateTemplate function
   @Who: nitin Bhati
   @When: 09-Feb-2023
   @Why: EWM-10420
   @What: For popup close and go to create template page
  */

  goToCreateTemplate() {
       const dialogRef = this._dialog.open(ConfigureJobTemplateComponent, {
        data: new Object({type: 'patch'}),
        panelClass: ['xeople-modal', 'JobTemplateManage', 'animate__animated', 'animate__fadeInDownBig'],
        disableClose: true,
      });     
      dialogRef.afterClosed().subscribe(res => {
        this.JobTemplateList();
        let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }
      })     
      
      // RTL Code
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }
  /* 
   @Type: File, <ts>
   @Name: JobTemplateList function
   @Who: nitin Bhati
   @When: 09-Feb-2023
   @Why: EWM-10420
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
 @Who: nitin Bhati
 @When: 09-Feb-2023
 @Why: EWM-10420
 @What: For disable enable continue btn
*/
  selectedTempData(data: any) {
  /*@Who: Nitin Bhati,@When: 02-March-2023,@Why: EWM-11001,@What:For save configuration data*/
    this.onSaveConfigurationField();
    this.selectedData = data
    // if (this.selectedData != null) {
    //   this.saveEnableDisable = false;
    // } else {
    //   this.saveEnableDisable = true;
    // }
  }



  /* 
   @Type: File, <ts>
   @Name: goToQuickJobWithTempData function
   @Who: nitin Bhati
   @When: 09-Feb-2023
   @Why: EWM-10420
   @What: For popup close and go to create job form page
  */

  goToQuickJobWithTempData() {
    this.commonserviceService.onTemplateSelect.next(this.selectedData); 
      const dialogRef = this._dialog.open(QuickjobComponent, {
        data: new Object({type: 'patch'}),
        panelClass: ['xeople-modal-full-screen', 'add_Quickjob', 'animate__animated', 'animate__fadeInDownBig'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.commonserviceService.popupCloseService.next(true);
          document.getElementsByClassName("selectJobTemplate")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("selectJobTemplate")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          this.dialogRef.close();
          
        }
        let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }
      })
      // let dir:string;
      // dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      // let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');   
  }

/*
@Type: File, <ts>
@Name: getJobConfigureFieldPermission function
@Who: Nitin Bhati 
@When: 02-March-2023
@Why: EWM-11001
*/
getJobConfigureFieldPermission(){
  this.systemSettingService.getJobConfigurePermission().subscribe(
    (responsedata:any) => {
      if(responsedata.HttpStatusCode==200 && responsedata.Data!=null){
        this.configureFielddata=responsedata.Data;
      }
    });
 }

 /*
    @Type: File, <ts>
    @Name: onSaveConfigurationField function
    @Who:  Nitin Bhati
    @When: 2th March 2023
    @Why: EWM-11001
    @What: For Save permission data
  */
  onSaveConfigurationField()
   {
       this.configureFielddata.forEach(t=>{
        if(t.GroupName.toLowerCase()=='salary'){
        t.ListColumn.forEach((tc:any) =>{ 
        if(tc?.ColumnName.toLowerCase()=='salaryunit'){
          tc.IsChecked = true;
        };
        if(tc?.ColumnName.toLowerCase()=='salaryband'){
          tc.IsChecked = true;
        };
      });
    }
    });
    //this.loading = true;
     this.systemSettingService.createJobConfigureField(this.configureFielddata).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (this.selectedData != null) {
            this.saveEnableDisable = false;
          } else {
            this.saveEnableDisable = true;
          }
         // this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
          
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      }, err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
   }

}
