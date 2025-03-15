/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: manage-checklist.component.ts
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
 @What: manage checklist section
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
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { Userpreferences } from 'src/app/shared/models';
@Component({
  selector: 'app-manage-checklist',
  templateUrl: './manage-checklist.component.html',
  styleUrls: ['./manage-checklist.component.scss']
})
export class ManageChecklistComponent implements OnInit {
  public ascIcon: string;
  panelOpenState = false;
  loading: boolean;
  public userpreferences: Userpreferences;

  public btnShow: boolean = true;
  public boxShow: boolean = false;

  public type: string = ''
  public clientId: any;
  public workFlowLenght:any=0;
  /* 
 @Type: File, <ts>
 @Name: constructor function
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
 @What: constructor for injecting services and formbuilder and other dependency injections
 */
  constructor(private route: Router,
    private commonserviceService: CommonserviceService,
     public dialog: MatDialog, private routes: ActivatedRoute, public _userpreferencesService: UserpreferencesService) {
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
    @Who: Suika
    @When: 01-aug-2022
    @Why: EWM-1734 EWM-7427
   */

  openBoxForCompleteFormOrTemplate() {
    this.btnShow = false;
    this.boxShow = true;

  }


  /*
 @Type: File, <ts>
 @Name: reloadApiBasedOnorg function
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
 @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.route.navigate(['/client/core/job/create-job'])
  }

  /*
 @Type: File, <ts>
 @Name: goToAddCheckList function
 @Who: Suika
 @When: 01-aug-2022
 @Why: EWM-1734 EWM-7427
*/
goToAddCheckList() {
    this.route.navigate(['/client/core/administrators/checklist/add-checklist']);
  }

  goBack() {
      this.route.navigate(['/client/core/administrators/checklist'], {
        queryParams: { clientId: this.clientId }
      });
  }


  /*
@Type: File, <ts>
@Name: goToAddCheckListGroup function
@Who: Suika
@When: 01-aug-2022
@Why: EWM-1734 EWM-7427
*/
goToAddCheckListGroup() {
  this.route.navigate(['/client/core/administrators/checklist/add-checklist-group']);
  }
}