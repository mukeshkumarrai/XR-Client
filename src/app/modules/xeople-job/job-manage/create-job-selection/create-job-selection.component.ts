/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: quickjob.component.ts
 @Who: Anup Singh
 @When: 13-july-2021
 @Why: EWM-2001 EWM-2070
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
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { QuickJobService } from '@app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { CreateJobAndClientPopupComponent } from '../create-job-and-client-popup/create-job-and-client-popup.component';

@Component({
  providers: [MessageService],
  selector: 'app-create-job-selection',
  templateUrl: './create-job-selection.component.html',
  styleUrls: ['./create-job-selection.component.scss']
})
export class CreateJobSelectionComponent implements OnInit {

  public ascIcon: string;
  panelOpenState = false;
  loading: boolean;
  public userpreferences: Userpreferences;

  public btnShow: boolean = false;
  public boxShow: boolean = true;

  public type: string = ''
  public clientId: any;
  public workFlowLenght:any=0;
  dirctionalLang;
  /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Anup Singh
 @When: 13-july-2021
 @Why: EWM-2001 EWM-2070
 @What: constructor for injecting services and formbuilder and other dependency injections
 */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private quickJobService: QuickJobService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService) {
    //this.pagesize = this.appSettingsService.pagesize;


  }
  ngOnInit(): void {
    this.routes.params.subscribe(
      data => {
        this.workFlowLenght = data["workFlowLenght"]
        this.type = data["type"];
        this.clientId = data["clientId"]
      });

    if (this.workFlowLenght > 0) {
      this.btnShow = false;
      this.boxShow = true;
    }

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

    // setInterval(() => {
    //   this.canLoad = true;
    //   if (this.pendingLoad) {
    //     this.onScrollDown();
    //   }
    // }, 2000);
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
    @Who: Anup Singh
    @When: 13-july-2021
    @Why: EWM-2001 EWM-2070
   */

  openBoxForCompleteFormOrTemplate() {
    this.btnShow = false;
    this.boxShow = true;

  }


  /*
 @Type: File, <ts>
 @Name: reloadApiBasedOnorg function
 @Who: Anup Singh
 @When: 14-july-2021
 @Why: EWM-2001 EWM-2070
 @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.route.navigate(['/client/jobs/job/job-manage/create-job-selection'])
  }

  /*
@Type: File, <ts>
@Name: goToQuickAddJob function
@Who: Anup Singh
@When: 14-july-2021
@Why: EWM-2001 EWM-2070
*/
  goToQuickAddJob() {
    this.route.navigate(['/client/jobs/job/job-manage/manage', { createJobForm: "blankForm",workFlowLenght:this.workFlowLenght, type: this.type, clientId: this.clientId }]);
  }

  goBack() {
    if (this.type === "AddJobClient") {
      this.route.navigate(['/client/core/clients/list/client-detail'], {
        queryParams: { clientId: this.clientId }
      });
    } else {
      this.route.navigate(['/client/jobs/job/job-workflow/workflow']);
    }



  }


  /*
@Type: File, <ts>
@Name: selectJobTemplate function
@Who: Anup Singh
@When: 14-july-2021
@Why: EWM-2001 EWM-2070
*/
  selectJobTemplate() {
    const dialogRef = this.dialog.open(CreateJobAndClientPopupComponent, {
      maxWidth: "450px",
      data: new Object({ workFlowLenght:this.workFlowLenght,type: this.type, clientId: this.clientId }),
      panelClass: ['quick-modalbox', 'selectJobTemplate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }	
  }


}
