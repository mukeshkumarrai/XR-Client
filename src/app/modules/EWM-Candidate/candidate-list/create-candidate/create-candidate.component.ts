/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: create-candidate.component.ts
 @Who: Adarsh Singh
 @When: 16-Dec-2022
 @Why: EWM-9627 EWM-9907
 @What: choose candidate template
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ValidateCode } from '../../../../shared/helper/commonserverside';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { CommonServiesService } from '../../../../shared/services/common-servies.service';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from '../../../../shared/services/commonservice/userpreferences.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { QuickJobService } from '../../../EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from '../../../EWM.core/shared/services/system-setting/system-setting.service';
import { RtlLtrService } from '../../../../shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { QuickCandidateComponent } from 'src/app/modules/EWM.core/shared/quick-modal/quick-candidate/quick-candidate.component';
import { ResponceData } from 'src/app/shared/models';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { XeopleSmartEmailComponent } from '../xeople-smart-email/xeople-smart-email.component';
import { MapApplicationFormCandidateComponent } from '../map-application-form-candidate/map-application-form-candidate.component';


@Component({
  selector: 'app-create-candidate',
  templateUrl: './create-candidate.component.html',
  styleUrls: ['./create-candidate.component.scss']
})
export class CreateCandidateComponent implements OnInit {
  loading: boolean;
  dirctionalLang;
  /* 
   @Type: File, <ts>
   @Name: constructor function
   @Who: Adarsh Singh
  @When: 16-Dec-2022
  @Why: EWM-9627 EWM-9907
   @What: constructor for injecting services and formbuilder and other dependency injections
   */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private quickJobService: QuickJobService,
    public dialog: MatDialog, private appSettingsService: AppSettingsService, private jobService: JobService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService,public dialogObj: MatDialog) {
    //this.pagesize = this.appSettingsService.pagesize;


  }

  ngOnInit(): void {
  }

  /*
  @Type: File, <ts>
  @Name: onAddCandidateForm function
  @Who: Adarsh Singh
  @When: 16-Dec-2022
  @Why: EWM-9627 EWM-9907
  */
  onAddCandidateForm() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(QuickCandidateComponent, {
      panelClass: ['xeople-modal-full-screen', 'quickCandidateModal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data: new Object({ isCandidate: true }),
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) { 
       this.goBack();
      }
      
    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }

  /*
  @Type: File, <ts>
  @Name: goBack function
  @Who: Adarsh Singh
  @When: 16-Dec-2022
  @Why: EWM-9627 EWM-9907
  */
  goBack() {
    this.route.navigate(['/client/cand/candidate/candidate-list']);
  }

  /*
  @Type: File, <ts>
  @Name: onXeopleSmaartEmail function
  @Who: Adarsh Singh
  @When: 16-Dec-2022
  @Why: EWM-9627 EWM-9907
  */
  onXeopleSmaartEmail() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(XeopleSmartEmailComponent, {
      panelClass: ['xeople-modal-md', 'xeopleSmartEmailModal', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      data: new Object({ isCandidate: true }),
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
       this.goBack();

       }
      
    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }

   /* @Type: File, <ts>
     @Name: openMapAllicationFormModule Name
     @Who: Nitin Bhati
     @When: 20-Dec-2022
     @Why: EWM-9875
     @What: for open map application form
    */
     openMapAllicationFormModule(){
      const dialogRef = this.dialogObj.open(MapApplicationFormCandidateComponent, {
    // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 desc: sending apllicationId in popup--------->
        data: {  },
        panelClass: ['xeople-modal-lg', 'add-assessment-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      // let dir: string;
      // dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      // let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
     
      dialogRef.afterClosed().subscribe(res => {          
        if (res == true) {
          this.goBack();
   
          }
        //this.inputwithoutValidation(this.addForm.value);

      })   
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }  
  }

}
