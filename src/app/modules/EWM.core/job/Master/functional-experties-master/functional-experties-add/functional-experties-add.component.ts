/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What:  This page will be use for the Functional Experties add Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';

@Component({
  providers: [MessageService],
  selector: 'app-functional-experties-add',
  templateUrl: './functional-experties-add.component.html',
  styleUrls: ['./functional-experties-add.component.scss']
})
export class FunctionalExpertiesAddComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/
  // status: boolean = false;
  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public categoryList: any[];
  public formtitle: string = 'grid';
  addfunctionalExpertiseForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  viewMode: string = "listMode";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  @Input() name: string;
  canLoad = false;
  pendingLoad = false;
  pagesize;
  loadingscroll: boolean;
  public ascIcon: string;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;
  public idSms = '';

  public disable: boolean = false;
  activestatus: string;
  statusList: [] = [];
  gridJobCategory: any[] = [];
  viewModeValue: any;
  public typeStatus: boolean = true;
  StatusData: any;
  //<!--@Who: Bantee Kumar,@Why:EWM-11417,@When: 20-Mar-2023 -->

  StatusDataName: any='Active';
  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, private jobService: JobService,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,) {
    this.pagesize = this.appSettingsService.pagesize;

    this.addfunctionalExpertiseForm = this.fb.group({
      Id: [''],
      JobCategoryId: [[]],
      FunctionalExpertise: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]],
      Status: [1, [Validators.required]] //   <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
    });

  }
  /*
 @Type: File, <ts>
 @Name: ngOnInit function
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
 @What: For calling
 */
  ngOnInit(): void {
    this.getAllStatus();
    this.getAllJobCategory();

    let URL = this.route.url;
    //  let URL_AS_LIST = URL.split('/');
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
      //  this.reloadApiBasedOnorg();
      }
    })

    if (this.routes.snapshot.params.id != null) {
      this.editForm();
      this.disable = true;
      this.activestatus = "Edit";
    } else {
      this.activestatus = "Add";
    }
    ///////geting Data Via Routing from user contact type component///////
    this.routes.queryParams.subscribe((params) => {
      this.viewModeValue = params['ViewModeDataValue'];
    })
    ////////

  }



  // ngAfterViewInit(): void {
  //   this.commonserviceService.onUserLanguageDirections.subscribe(res => {
  //     this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
  //   })
  // }


  /*
  @Type: File, <ts>
  @Name: onCancel() function
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What: For Navigate and sending data via routing
 */
  onCancel() {
    ////////For Sending Data Of view mode by routing and also doing routing/////////
    // let viewModeData: any = this.viewModeValue;
    // this.route.navigate(['/client/core/administrators/functional-experties'], {
    //   queryParams: { viewModeData }
    // })
    this.route.navigate(['/client/core/administrators/functional-experties']);
    //////////////
  }

  /*
   @Type: File, <ts>
   @Name: getAllStatus function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What: For All status List
   */

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

  /*
 @Type: File, <ts>
 @Name: getAllJobCategory function
 @Who: Nitin Bhati
 @When: 29-July-2021
 @Why: EWM-8002
 @What: For All Job category
 */

 getAllJobCategory() {
    this.loading = true;
    this.jobService.getJobCategoryAllList().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.gridJobCategory = repsonsedata['Data'];
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
   @Name: onSave function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What:This function is used for update and save record into database
    */
  onSave(value) {
    this.submitted = true;
    if (this.addfunctionalExpertiseForm.invalid) {
      return;
    }
    this.duplicateCheck();

  }

  /*
   @Type: File, <ts>
   @Name: duplicateCheck Function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What:  For check duplicate value
  */
  public duplicateCheck() {
    this.loading = false;
    let contactTypeID = this.addfunctionalExpertiseForm.get("Id").value;
    if (contactTypeID == null) {
      contactTypeID = '00000000-0000-0000-0000-000000000000';
    }
    if (contactTypeID == '') {
      contactTypeID = '00000000-0000-0000-0000-000000000000';
    }
    let duplicacyExpertiesObj = {};
    duplicacyExpertiesObj['Id'] = contactTypeID;
    duplicacyExpertiesObj['FunctionalExpertise'] = this.addfunctionalExpertiseForm.get("FunctionalExpertise").value;
    //duplicacyExpertiesObj['RegionId'] = this.addfunctionalExpertiseForm.get("RegionId").value;

    this.jobService.checkFunctionalExpertiseDuplicay(duplicacyExpertiesObj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 402) {
          if (data.Data == false) {
            this.addfunctionalExpertiseForm.get("FunctionalExpertise").setErrors({ codeTaken: true });
            this.addfunctionalExpertiseForm.get("FunctionalExpertise").markAsDirty();
            this.loading = false;

          }
        }
        else if (data.HttpStatusCode == 204) {
          this.loading = false;
          if (data.Data == true) {
            //this.addfunctionalExpertiseForm.get("Name").clearValidators();
            this.addfunctionalExpertiseForm.get("FunctionalExpertise").markAsPristine();
            if (this.addfunctionalExpertiseForm && this.submitted == true) {
              if (this.routes.snapshot.params.id == null) {
                this.createForm(this.addfunctionalExpertiseForm.value);
              } else {
                this.updateForm(this.addfunctionalExpertiseForm.value);
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



  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @Why: use for set value in patch file for showing information.
   @What: .
  */
  editForm() {
    this.loading = true;
    this.jobService.getfunctionalExpertiseById('?expertiseId=' + this.routes.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        //this.actionStatus='update';
        if (data.HttpStatusCode == 200) {
          this.addfunctionalExpertiseForm.patchValue({
            Id: data.Data.Id,
            JobCategoryId: data.Data.JobCategoryId,
            FunctionalExpertise: data.Data.FunctionalExpertise,
            Status: data.Data.Status,
          });
          this.StatusDataName = data.Data.StatusName;

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


  /*
  @Type: File, <ts>
  @Name: createForm
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What:  For submit the form data
    */
  createForm(value) {
    console.log("create:",value);
    this.loading = true;
    const formData = new FormData();
    var removeJsonId = value;
     removeJsonId['StatusName']  = this.StatusDataName;
     delete removeJsonId.Id;
    this.jobService.createfunctionalExpertise(removeJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.addfunctionalExpertiseForm.reset();
           this.route.navigate(['/client/core/administrators/functional-experties']);
          this.loading = false;
          this.formtitle = 'grid';
        }else if (data.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
   @Type: File, <ts>
   @Name: updateForm function
   @Who: Anup
   @When: 18-June-2021
   @Why: EWM-1746 EWM-1843
   @What: use for update form data.
  */
  updateForm(value) {
    this.loading = true;
    var updateJsonId = value;
    updateJsonId['StatusName']  = this.StatusDataName;
    this.jobService.updatefunctionalExpertiseById(updateJsonId).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.addfunctionalExpertiseForm.reset();
          this.route.navigate(['/client/core/administrators/functional-experties']);
          this.loading = false;
          this.formtitle = 'grid';
        }else if (data.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        }else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }



  /*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.formtitle = 'grid';
    this.route.navigate(['/client/core/administrators/functional-experties']);
  }

/* 
   @Type: File, <ts>
   @Name: clickStatusID function
   @Who: Nitin Bhati
   @When: 27-July-2022
   @Why: EWM-8002
   @What: For status Click event
  */
   clickStatusID(Id) {
    this.StatusData = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusDataName = this.StatusData[0].StatusName;
  }


}
