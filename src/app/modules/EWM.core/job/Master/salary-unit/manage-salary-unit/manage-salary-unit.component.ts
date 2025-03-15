/*
  @Type: File, <ts>
  @Name: managesalaryunit.component.ts
  @Who: Priti Srivastava
  @When: 24-May-2021
  @Why:EWM-1607
  @What: salary unit master add and update
 */

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { SalaryunitService } from 'src/app/modules/EWM.core/shared/services/salary-unit/salaryunit.service';
import { PreviousRouteService } from 'src/app/shared/services/commonservice/previous-route-service.service';

@Component({
  selector: 'app-manage-salary-unit',
  templateUrl: './manage-salary-unit.component.html',
  styleUrls: ['./manage-salary-unit.component.scss']
})
export class ManageSalaryUnitComponent implements OnInit {


  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public categoryList: any[];
  addForm: FormGroup;
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  @Input() name: string;
  loadingscroll: boolean;
  public auditParameter;
  public disable: boolean = false;
  activestatus: string;
  statusList: [] = []
  viewModeValue: any;

  constructor(private fb: FormBuilder, private _salaryUnitServices: SalaryunitService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private previousRouteService: PreviousRouteService,
    public dialog: MatDialog, private translateService: TranslateService, private routes: ActivatedRoute,) {
    this.addForm = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2),this.noWhitespaceValidator()]],
      IsActive: [1, [Validators.required]] //  <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
    });

  }
  ngOnInit(): void {
    this.getAllStatus();

    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })

    if (this.routes.snapshot.params.id != null) {
      this.editForm();
      this.disable = true;
      this.activestatus = "Edit";
    } else {
      this.activestatus = "Add";
    }
    this.routes.queryParams.subscribe((params) => {
      this.viewModeValue = params['ViewModeDataValue'];
    });
  }



  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
    })
  }

  onCancel() {
    // let viewModeData: any = this.viewModeValue;
    //  this.route.navigate(['/client/core/administrators/salaryunit'], {
    //   queryParams: { viewModeData }
    // });
    this.route.navigate(['/client/core/administrators/salaryunit']);
  }


  getAllStatus() {
    this.loading = true;
    this.systemSettingService.getAllUserTypeStatus().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.statusList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  onSave() {
    if (this.addForm.invalid) {
      return;
    }
    this.submitted = true;
    this.onNameChanges(true);

  }
  public onNameChanges(isSave:boolean) {
    let ID = this.addForm.get("Id").value;
    if (ID == null || ID == '') {
      ID = 0;
    }
    let updateJson={};
    updateJson['Id']=ID;
    updateJson['Value']=this.addForm.get("Name").value;
    this._salaryUnitServices.checkdDuplicay(updateJson).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            this.addForm.get("Name").setErrors({ codeTaken: true });
            this.addForm.get("Name").markAsDirty();
            this.submitted = false;
          }
        }
        else if (data.HttpStatusCode == 204) {
          if (data.Data == true) {
            this.addForm.get("Name").markAsPristine();
            if (this.addForm && this.submitted == true && isSave==true) {
              if (this.routes.snapshot.params.id == null) {
                this.add(this.addForm.value);
              } else {
                this.update(this.addForm.value);
              }
            }

          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }


  editForm() {
    this.loading = true;
    this._salaryUnitServices.getdataByID(this.routes.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.addForm.patchValue({
            Id: data.Data.Id,
            Name: data.Data.Name,
            IsActive: data.Data.Status,
          });
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })

  }

  add(value) {
    this.submitted = false;
    this.loading = true;
    const formData = new FormData();
    var removeJsonId = value;
    removeJsonId['Status'] = value.IsActive; 
    delete removeJsonId.Id;
    this._salaryUnitServices.Create(removeJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {  
          this.addForm.reset();
          this.submitted = false; 
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.onCancel();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
          this.submitted = false; 
        }
        // this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  update(value) {
    this.loading = true;
    var removeJsonId = value;
    removeJsonId['Status'] = value.IsActive;
    this._salaryUnitServices.update(removeJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.onCancel();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        // this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });
  }

  reloadApiBasedOnorg() {
    this.route.navigate(['/client/core/administrators/salaryunit']);
  }

/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 21-dec-2022
   @Why: EWM-9959
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}

}

