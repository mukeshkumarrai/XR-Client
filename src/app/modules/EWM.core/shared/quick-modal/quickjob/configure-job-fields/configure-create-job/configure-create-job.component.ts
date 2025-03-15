/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: quickjob.component.ts
 @Who: Nitin Bhati 
 @When: 08-Feb-2023
 @Why: EWM-9628 EWM-10420
 @What: quick job Section
 */
 import { Component, OnInit, ViewChild } from '@angular/core';
 import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
 import { MatDialog, MatDialogRef } from '@angular/material/dialog';
 import { ActivatedRoute, Router } from '@angular/router';
 import { TranslateService } from '@ngx-translate/core';
 import { MessageService } from '@progress/kendo-angular-l10n';
 import { ValidateCode } from 'src/app/shared/helper/commonserverside';
 import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
 import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
 import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
 import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
 import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
 import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
 import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
 import { Userpreferences } from 'src/app/shared/models';
import { SystemSettingService } from '../../../../services/system-setting/system-setting.service';
import { QuickJobService } from '../../../../services/quickJob/quickJob.service';
import { QuickjobComponent } from '../../quickjob.component';
import { ConfigureTemplatePopupComponent } from '../configure-template-popup/configure-template-popup.component';
 

@Component({
  providers: [MessageService],
  selector: 'app-configure-create-job',
  templateUrl: './configure-create-job.component.html',
  styleUrls: ['./configure-create-job.component.scss']
})
export class ConfigureCreateJobComponent implements OnInit {

  
  public ascIcon: string;
  panelOpenState = false;
  loading: boolean;
  public userpreferences: Userpreferences;

  public btnShow: boolean = true;
  public boxShow: boolean = false;

  public type: string = ''
  public clientId: any;
  public workFlowLenght:any=0;
  dirctionalLang;
  res: boolean;
  Menudata=[];
  /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Nitin Bhati 
 @When: 08-Feb-2023
 @Why: EWM-9628 EWM-10420
 @What: constructor for injecting services and formbuilder and other dependency injections
 */
  constructor( public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService,
    public dialog: MatDialog,public _userpreferencesService: UserpreferencesService,public dialogRef: MatDialogRef<ConfigureCreateJobComponent>) {
  }
  ngOnInit(): void {
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }

    if (this.type === 'AddJobClient') {
      this._sidebarService.subManuGroup.next('clients');
    } else {
      this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    }
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.ascIcon = 'north';

    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }
  /* 
    @Type: File, <ts>
    @Name: openDialogforDescription function
    @Who: Nitin Bhati 
    @When: 08-Feb-2023
    @Why: EWM-9628 EWM-10420
   */

  openBoxForCompleteFormOrTemplate() {
    this.btnShow = false;
    this.boxShow = true;

  }
/*
 @Type: File, <ts>
 @Name: reloadApiBasedOnorg function
 @Who: Nitin Bhati 
 @When: 08-Feb-2023
 @Why: EWM-9628 EWM-10420
 @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.route.navigate(['/client/core/job/create-job'])
  }

/*
@Type: File, <ts>
@Name: goToQuickAddJob function
@Who: Nitin Bhati 
@When: 08-Feb-2023
@Why: EWM-9628 EWM-10420
*/
  goToQuickAddJob() {
    this.openQuickjobModal();
    //this.route.navigate(['/client/core/job/complete-job-form', { createJobForm: "blankForm",workFlowLenght:this.workFlowLenght, type: this.type, clientId: this.clientId }]);
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }
/*
@Type: File, <ts>
@Name: cancelButton function
@Who: Nitin Bhati 
@When: 08-Feb-2023
@Why: EWM-9628 EWM-10420
*/
  cancelButton() {
    document.getElementsByClassName("ConfigureJobFields")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("ConfigureJobFields")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(true); }, 200);


  }


  /*
@Type: File, <ts>
@Name: selectJobTemplate function
@Who: Nitin Bhati 
@When: 08-Feb-2023
@Why: EWM-9628 EWM-10420
*/
  selectJobTemplate() {
    const dialogRef = this.dialog.open(ConfigureTemplatePopupComponent, {
      maxWidth: "450px",
      data: new Object({ workFlowLenght:this.workFlowLenght,type: this.type, clientId: this.clientId, formType: 'quick' }),
      panelClass: ['quick-modalbox', 'selectJobTemplate', 'animate__animated', 'animate__zoomIn', 'ml-0'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {  
      this.commonserviceService.popupCloseServiceObj.subscribe((res1:any)=>{
        this.res = true;
        if(res1){
          this.dialogRef.close();
        }
      });
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

    // let dir: string;
    //   dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    //   let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    //   for (let i = 0; i < classList.length; i++) {
    //     classList[i].setAttribute('dir', this.dirctionalLang);
    //   }

  }

/*
@Type: File, <ts>
@Name: openQuickjobModal function
@Who: Nitin Bhati 
@When: 08-Feb-2023
@Why: EWM-9628 EWM-10420
*/
  openQuickjobModal() {
    const dialogRef = this.dialog.open(QuickjobComponent, {
      /*@When: 22-08-2023 @who:Amit @why: EWM-13922 @what:add new class*/
      panelClass: ['xeople-modal-full-screen', 'add_Quickjob', 'add_Quickjob-new', 'animate__animated', 'animate__fadeInDownBig'],
      disableClose: true,
      });
    
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.dialogRef.close();
      }
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    })
  }


}
