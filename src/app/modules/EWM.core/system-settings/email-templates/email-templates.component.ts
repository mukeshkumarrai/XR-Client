/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Vipul Bansal
  @When: 27-Nov-2020
  @Why: ROST-446
  @What:  This component is used for thr system settings of the email templates.
*/

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { ConfirmDialogModel } from '../../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { CommonserviceService } from '../../../../shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { AppSettingsService } from '../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { State } from '@progress/kendo-data-query';
import { ButtonTypes, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { debounceTime} from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  providers: [MessageService],
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})

export class EmailTemplatesComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/
  status: boolean = false;
  submitted = false;
  loading: boolean;

  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  @ViewChild(TooltipDirective) public tooltipDir: TooltipDirective;

  public formtitle: string = 'grid';
  public active = false;
  result: string = '';
  addEmailTemplateForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  activestatus: string = 'Add';
  public ascIcon: string;
  public descIcon: string;
  public pagesize;
  public searchValue: string = '';
  dirctionalLang;
  isvisible: boolean;
  animationVar: any;
  public loadingSearch: boolean;
  public auditParameter;
  searchSubject$ = new Subject<any>();
  public userpreferences: Userpreferences;
  public skip = 0;
  public data: GridDataResult = { data: [], total: 0 };
  public sizes = [];
  public initialstate: State = {
    skip: 0,
    take: 50,
    group: [],
    filter: { filters: [], logic: "and" },
    sort: [{
      field: 'Title',
      dir: 'asc'
    }],
  };
  public state: State;
  constructor(private fb: FormBuilder, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router, public dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    public _userpreferencesService: UserpreferencesService,
    private appSettingsService: AppSettingsService, private translateService: TranslateService) {
    this.pagesize = this.appSettingsService.pagesize;
    this.initialstate.take=this.pagesize;
    this.sizes=this.appSettingsService.pageSizeOptions;
    
    this.addEmailTemplateForm = this.fb.group({
      ID: ['0'],
      Title: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]],
      Subject: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(2)]],
      TemplateText: [' ', [Validators.required, Validators.minLength(2)]]
    })

    this.auditParameter = encodeURIComponent('Email Templates');
    
  }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.state = { ...this.initialstate }
    this.sendRequest(this.state);

    this.ascIcon = 'north';
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(searchValue => {
      this.loadingSearch = true;
      this.sendRequest(this.state);

    });

  }

  ngAfterViewInit(): void {
    this.commonserviceService?.onUserLanguageDirections?.subscribe(res => {
      this.rtlLtrService?.gridLtrToRtl(this.gridAdd, this.gridAdd1, this.search, res);
    })
  }


  public onTitleChanges() {
    let tempID = this.addEmailTemplateForm.get("ID").value;
    if (tempID == null) {
      tempID = 0;
    }
    this.systemSettingService.checkEmailTemplateDuplicacy('?EmailTemplateName=' + this.addEmailTemplateForm.get("Title").value.trim() + '&id=' + tempID).subscribe(
      repsonsedata => {
        /* this.loading=false; */
        if (repsonsedata['HttpStatusCode'] == 200) {
          if (repsonsedata['Data'] == true) {
            this.addEmailTemplateForm.get("Title").setErrors({ codeTaken: true });
            this.addEmailTemplateForm.get("Title").markAsDirty();
          }
          else {
            this.addEmailTemplateForm.get("Title").clearValidators();
            this.addEmailTemplateForm.get("Title").markAsPristine();
          }
        }
        else if (repsonsedata['HttpStatusCode'] == 400) {
          if (repsonsedata['Data'] == false) {
            this.addEmailTemplateForm.get("Title").clearValidators();
            this.addEmailTemplateForm.get("Title").markAsPristine();
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }


  DeleteEmailTemplate(val): void {
    const message = `label_titleDialogContent`;
    const subtitle = 'label_emailTemplate';
    const title = '';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (dialogResult == true) {
        this.loading = true;

        this.systemSettingService.deleteEmailTemplates(val).subscribe(
          repsonsedata => {
            this.active = false;
            this.loading = false;
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
              this.addEmailTemplateForm.reset();
              this.addEmailTemplateForm.reset({ TemplateText: '' });
              this.sendRequest(this.state);
              this.formtitle = 'grid';
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            }
            this.cancel.emit();
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      } else {
        /* this.snackBService.showErrorSnackBar("not required on NO click", this.result); */
      }
    });

    // RTL code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
  }

/*** @When: 20-09-2023 @Who:bantee  @Why: EWM-14395 @What: managing kendo grid via data state **/

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.sendRequest(state);
  }

/*** @When: 20-09-2023 @Who:bantee  @Why: EWM-14395 @What: API calling to get template list **/

  public sendRequest(state: State): void {
    this.loading = true;
    this.systemSettingService.fetchEmailTemplateList(state, this.searchValue).pipe(
    ).subscribe((response: GridDataResult) => {
      this.data = response;
      this.loading = false;
      this.loadingSearch = false;
      this.activestatus = 'Add';

    });
  }
/*** @When: 20-09-2023 @Who:bantee  @Why: EWM-14395 @What: search  **/

  public onFilter(): void {
    if (this.searchValue?.length > 0 && this.searchValue?.length <= 2) {
      this.loadingSearch = false;
      return;
    }
    this.state.skip = 0;
    this.searchSubject$.next(this.searchValue);
  }

/*** @When: 20-09-2023 @Who:bantee  @Why: EWM-14395 @What: search clear **/

  onSearchFilterClear() {
    this.searchValue = '';
    this.searchSubject$.next(this.searchValue);

  }

  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }


  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

/*** @When: 20-09-2023 @Who:bantee  @Why: EWM-14395 @What: refresh **/

  refreshComponent() {
    this.state = { ...this.initialstate }
    this.sendRequest(this.state);

  }


  public showTooltipKendo(e: MouseEvent): void {
    const element = e.target as HTMLElement;

    if (element.nodeName === 'TD') {
      var attrr = element.getAttribute('ng-reflect-logical-col-index');

      if (attrr != null && parseInt(attrr) != NaN && parseInt(attrr) != 0) {
        if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('k-command-cell') === true || element.classList.contains('k-indicator-container') === true || element.parentElement.classList.contains('k-grouping-header k-grouping-header-flex') === true || element.classList.contains('k-icon') === true) {
          this.tooltipDir.hide();
        }
        else {
          this.tooltipDir.toggle(element);
        }
      }
      else {
        this.tooltipDir.hide();
      }
    }
    else if (element.nodeName === 'DIV' || element.nodeName === 'SPAN') {
      if (element.classList.contains('k-virtual-content') === true || element.classList.contains('mat-form-field-infix') === true || element.classList.contains('mat-date-range-input-container') === true || element.classList.contains('gridTollbar') === true || element.classList.contains('kendogridcolumnhandle') === true || element.classList.contains('kendodraggable') === true || element.classList.contains('k-grid-header') === true || element.classList.contains('toggler') === true || element.classList.contains('k-grid-header-wrap') === true || element.classList.contains('k-column-resizer') === true || element.classList.contains('mat-date-range-input-separator') === true || element.classList.contains('mat-form-field-flex') === true || element.parentElement.parentElement.classList.contains('k-grid-toolbar') === true || element.parentElement.classList.contains('k-header') === true || element.classList.contains('k-i-sort-desc-sm') === true || element.classList.contains('k-i-sort-asc-sm') === true || element.classList.contains('segment-separator') === true || element.classList.contains('k-command-cell') === true || element.classList.contains('k-indicator-container') === true || element.parentElement.classList.contains('k-grouping-header k-grouping-header-flex') === true || element.classList.contains('k-icon') === true) {
        this.tooltipDir.hide();
      }
      else {
        this.tooltipDir.toggle(element);
      }
    }
    else {
      this.tooltipDir.hide();
    }
  }

  reloadApiBasedOnorg() {
    this.state = { ...this.initialstate }
    this.sendRequest(this.state)
    this.formtitle = 'grid';
  }
}
