/*
  @(C): Entire Software
  @Type: File, <ts>
    @Who: Anup Singh
    @When: 23-Sep-2021
    @Why: EWM-2682 EWM 2728
  @What:  This page will be use for the Access Levels view Component ts file
*/

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from '../../../shared/services/candidates/candidate.service';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';

@Component({
  providers: [MessageService],
  selector: 'app-manage-view-access-levels',
  templateUrl: './manage-view-access-levels.component.html',
  styleUrls: ['./manage-view-access-levels.component.scss']
})
export class ManageViewAccessLevelsComponent implements OnInit {

  addUserRoleForm: FormGroup;
  pagesize;
  accessName;
  public editData: any[];
  loading: boolean;
  public viewMode: string = 'listMode';
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  /* 
  @Type: File, <ts>
  @Name: constructor function
    @Who: Anup Singh
    @When: 23-Sep-2021
    @Why: EWM-2682 EWM 2728
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, private messages: MessageService,
    public elementRef: ElementRef, private appSettingsService: AppSettingsService, private translateService: TranslateService,
    private routes: ActivatedRoute,
  ) {

    this.pagesize = this.appSettingsService.pagesize;
    this.addUserRoleForm = this.fb.group({
      Id: [''],
      DataPermissionId: [''],
      DataType: [''],
      AccessLevelId: [''],
      View: [''],
      Add: [''],
      Edit: [''],
      Delete: [''],
      Comment: [''],
      ExportReport: [''],
      Print: [''],
      SendEmail: [''],
      SendSms: [''],
      DataPermissionName: ['']
    })
  }

  ngOnInit(): void {
    this.getAccessLevelListById();


  }




  /* 
  @Type: File, <ts>
  @Name: getAccessLevelListById function
  @Who: Anup Singh
  @When: 23-Sep-2021
  @Why: EWM-2682 EWM 2728
  @What: FOR get Access Level List By Id
  */
  public getAccessLevelListById() {
    this.loading = true;
    this.systemSettingService.fetchAccessLevelListById(this.routes.snapshot.params.id).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.editData = repsonsedata['Data'];
          this.accessName = repsonsedata['Data'][0]['AccessLevel'];
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
 @Name: showTooltip function
 @Who: Anup Singh
 @When: 23-Sep-2021
 @Why: EWM-2682 EWM 2728
 @What: For showing tooltip in kendo
  */
  public showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;

    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');
      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true) {
          this.tooltipDir.hide();
        }
        else {
          if (element.innerText == '') {
            this.tooltipDir.hide();
          } else {
            this.tooltipDir.toggle(element);
          }

        }
      }
      else {
        this.tooltipDir.hide();
      }
    }
    else if (element.nodeName === 'SPAN' || element.nodeName === 'A') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('segment-key') === true) {
        this.tooltipDir.hide();
      }
      else {
        if (element.innerText == '') {
          this.tooltipDir.hide();
        } else {
          this.tooltipDir.toggle(element);
        }

      }
    }
    else {
      this.tooltipDir.hide();
    }
  }

  /*
 @Type: File, <ts>
 @Name: switchListMode function
 @Who: Anup Singh
 @When: 23-Sep-2021
 @Why: EWM-2682 EWM 2728
 @What: For mode
  */
  switchListMode(viewMode) {
    // let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.viewMode = "cardMode";
    } else {
      this.viewMode = "listMode";
      //listHeader.classList.remove("hide");
    }
  }

}
