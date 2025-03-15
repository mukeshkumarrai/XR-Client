import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar.service';
import { ClientService } from '@app/modules/EWM.core/shared/services/client/client.service';
import { ResponceData } from '@app/shared/models';
import { statusList } from '@app/modules/EWM.core/shared/datamodels';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { pattern } from '@rxweb/reactive-form-validators';
import { SidebarService } from '@app/shared/services/sidebar/sidebar.service';
export class updateLeadSourceData {
  Description: 'String';
  DisplaySequence: number;
  StatusId: number;
  Status: string;
  Id: string;
  Name: string;
}
export class createLeadSourceData {
  Description: 'String';
  DisplaySequence: number;
  StatusId: number;
  Status: string;
  Name: string;
}
@Component({
  selector: 'app-add-lead-source-master',
  templateUrl: './add-lead-source-master.component.html',
  styleUrls: ['./add-lead-source-master.component.scss']
})
export class AddLeadSourceMasterComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  addLeadSourseForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public submitted = false;
  public GrupAddObj = {};
  public tempID: string = '00000000-0000-0000-0000-000000000000';
  public statusList: any = [];
  public viewMode: any;
  public specialcharPattern = "[A-Za-z0-9-+ ]+$";
  public isResponseGet: boolean = false;
  public fromObj: any = {};
  public status: string;
  public stausId: number;
  public searchSubject$ = new Subject<any>();
  public checkduplicasy: string;
  public leadId: string
  constructor( private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private clientService: ClientService,public _sidebarService: SidebarService,
    private snackBService: SnackBarService, private route: Router, private commonserviceService: CommonserviceService,
    private appSettingsService: AppSettingsService) {
    this.addLeadSourseForm = this.fb.group({
      Id: [''],
      leadSourceName: ['', [Validators.required, Validators.minLength(1), this.noWhitespaceValidator(),
        Validators.pattern(this.specialcharPattern)]],
      Description: ['', [Validators.required, this.noWhitespaceValidator(), Validators.minLength(1),
        Validators.pattern(this.specialcharPattern)]],
      Status: [null, Validators.required],
      StausId:[1],
      DisplaySequence: [null,[ Validators.min(1),
        Validators.max(100)]],
    });

  }


  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
     this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
     this._sidebarService.activesubMenuObs.next('masterdata');
    this.getStatusList();
    this.router.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.tempID = params['id'];
          this.leadId = params['id'];
          this.activestatus=params['activestatus'];
        }
      });
    if (this.activestatus=='Edit') {
      this.tempID = this.leadId;
      this.editForm(this.leadId);
    }else{
      this.status = 'Active';
      this.stausId = 1;
      this.addLeadSourseForm.patchValue({
        DisplaySequence: 1,
        Status: this.status,
        stausId:1
      })
    }
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(searchValue => {   // put this code in ngOnIt section
      this.duplicayCheck()
    });


  }



  editForm(Id) {
    this.loading = true;
    this.clientService.getLeadSourceById('?Id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == '200' || data.HttpStatusCode == '204') {
          if (data.Data?.StatusId == 1 || data.Data?.Status.toLowerCase()=='active' ) {
            this.status = 'Active';
            this.stausId = 1;
          } else {
            this.status = 'Inactive';
            this.stausId = 2;
          }

          this.addLeadSourseForm.patchValue({
            Id: data['Data']?.Id,
            leadSourceName: data.Data?.Name,
            Description: data.Data?.Description,
            Status: this.status,
            DisplaySequence: data?.Data?.DisplaySequence,
            stausId:data?.Data?.StatusId
          });
          this.fromObj = data.Data;
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }



  onSave(value) {
    this.isResponseGet = true;
    this.submitted = true;
    if (this.addLeadSourseForm.invalid) {
      return;
    }
    if (this.activestatus == 'Add') {
      this.createLeadSource(value);
    } else {
      this.updateLeadSource(value);
    }

  }



  createLeadSource(value) {
    this.loading = true;
    if (value?.Status == 'Active') {
      this.status = 'Active';
      this.stausId = 1;
    } else {
      this.status = 'Inactive';
      this.stausId = 2;
    }
    let AddNotesObj: createLeadSourceData = {
      Description: value?.Description?.trim(),
      DisplaySequence: value?.DisplaySequence ? value?.DisplaySequence : 1,
      StatusId: parseInt(value?.StausId),
      Status: this.status,
      Name: value?.leadSourceName?.trim()
    }
    this.clientService.addLeadSource(AddNotesObj).subscribe((repsonsedata) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        this.loading = false;
        this.isResponseGet = false;
        this.addLeadSourseForm.reset();
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['./client/core/administrators/lead-source']);
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.loading = false;
        this.isResponseGet = false;
        this.route.navigate(['./client/core/administrators/lead-source']);
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
        this.route.navigate(['./client/core/administrators/lead-source']);
      }
    },
      err => {
        this.loading = false;
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });

  }


  updateLeadSource(value) {
    this.isResponseGet = true;
    this.loading = true;
    if (value?.Status == 'Active' || value?.Status == 1) {
      this.status = 'Active';
      this.stausId = 1;
    } else {
      this.status = 'Inactive';
      this.stausId = 2;
    }
    let UpdateObj: updateLeadSourceData = {
      Description: value?.Description?.trim(),
      DisplaySequence: value?.DisplaySequence ? value?.DisplaySequence : 1,
      StatusId: this.stausId,
      Status: this.status,
      Name: value?.leadSourceName?.trim(),
      Id: this.tempID
    }
    let updateObj = {
      "From": this.fromObj,
      "To":UpdateObj,
    };
    this.clientService.updateLeadSource(updateObj).subscribe((repsonsedata) => {
      if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
        this.loading = false;
        this.isResponseGet = false;
        this.route.navigate(['./client/core/administrators/lead-source']);
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      } else if (repsonsedata.HttpStatusCode === 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
        this.isResponseGet = false;
        this.route.navigate(['./client/core/administrators/lead-source']);
      }
      else {
        this.loading = false;
        this.isResponseGet = false;
        this.route.navigate(['./client/core/administrators/lead-source']);
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    },
      err => {
        this.loading = false;
        this.isResponseGet = false;
        this.route.navigate(['./client/core/administrators/lead-source']);
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });

  }


  duplicayCheck() {
    this.clientService.checkduplicasyLeadSource('?value=' + this.addLeadSourseForm.get("leadSourceName").value + '&id=' + this.tempID).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == '200' || data.HttpStatusCode == '204') {
          if (data.Data == true) {
            // this.addLeadSourseForm.get("leadSourceName").clearValidators();
            // this.addLeadSourseForm.get("leadSourceName").markAsPristine();
          }
        }
        
        else if (data.HttpStatusCode == '402') {
          if (data.Data == false) {
            this.addLeadSourseForm.get("leadSourceName").setErrors({ leadSourceNameTaken: true });
            this.addLeadSourseForm.get("leadSourceName").markAsDirty();
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


  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          this.statusList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  public checkdupliName(value): void {
    if (value?.trim()?.length != 0) {
      this.searchSubject$.next(value);
      if (value?.trim()?.length > 30) {
        this.addLeadSourseForm.get("leadSourceName").setErrors({ required: true });
        this.addLeadSourseForm.get("leadSourceName").markAsPristine();
      }
    } else if (value?.trim()?.length == 0) {
      this.addLeadSourseForm.patchValue({
        leadSourceName: ''
      });
      this.noWhitespaceValidator();
      this.addLeadSourseForm.get("leadSourceName").setErrors({ required: true });
      this.addLeadSourseForm.get("leadSourceName").markAsPristine();
    }
  }

  checkDescription(value): void {
    if (value?.trim()?.length > 100) {
      this.addLeadSourseForm.get("Description").setErrors({ required: true });
      this.addLeadSourseForm.get("Description").markAsPristine();

    } else if (value?.trim()?.length == 0) {
      this.noWhitespaceValidator();
      this.addLeadSourseForm.get("Description").setErrors({ required: true });
      this.addLeadSourseForm.get("Description").markAsPristine();
    }
  }


  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '')?.trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }


  onDismiss(): void {
    this.route.navigate(['./client/core/administrators/lead-source']);
  }
  
}


