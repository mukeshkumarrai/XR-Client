/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What:  This page will be use for the Functional Sub Experties add Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from '../../../../shared/services/Job/job.service';
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

@Component({
  providers: [MessageService],
  selector: 'app-functional-sub-experties-add',
  templateUrl: './functional-sub-experties-add.component.html',
  styleUrls: ['./functional-sub-experties-add.component.scss']
})
export class FunctionalSubExpertiesAddComponent implements OnInit {
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
  addfunctionalSubExpertiseForm: FormGroup;
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

  public disable: boolean = false;
  activestatus: string;
  statusList: [] = [];
  gridJobCategory: any[] = [];
  viewModeValue: any;
  ExpertiseId: any;
  RegionName: string;
  FunctionalExpertise: string;
  StatusData: any;
  //<!--@Who: Bantee Kumar,@Why:EWM-11417,@When: 20-Mar-2023 -->

  StatusDataName: any ='Active';
  public typeStatus: boolean = true;
  public isResponseGet:boolean = false;

  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private jobService: JobService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router, private systemSettingService: SystemSettingService,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,) {
    this.pagesize = this.appSettingsService.pagesize;

    this.addfunctionalSubExpertiseForm = this.fb.group({
      Id: [''],
      JobCategoryId: [[]],
      FunctionalExpertise: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]],
      FunctionalSubExpertise: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.specialcharPattern)]],
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
    //    this.reloadApiBasedOnorg();
      }
    })

    if (this.routes.snapshot.params.id != null) {
      this.editForm();
      this.disable = true;
      this.activestatus = "Edit";
      this.ExpertiseId = localStorage.getItem('ExpertiseId');
    } else {
      this.activestatus = "Add";
      this.ExpertiseId = localStorage.getItem('ExpertiseId');
    }
    ///////geting Data Via Routing from user contact type component///////
    this.routes.queryParams.subscribe((params) => {
      this.viewModeValue = params['ViewModeDataValue'];
      this.ExpertiseId = params['expertiseId'];

    })
    ////////
    this.patchValueForResionAndExperties()
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
  @What: For Navigate list component and also sending data via routing
 */
  onCancel() {
    ////////For Sending Data Of view mode by routing and also doing routing/////////
    let viewModeData: any = this.viewModeValue;
    this.route.navigate(['/client/core/administrators/functional-experties/functional-sub-experties'], {
      queryParams: { viewModeData, expertiesId: this.ExpertiseId, FunctionalExpertise: this.FunctionalExpertise, }
    })
    //////////////
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
  patchValueForResionAndExperties() {
    this.loading = true;
    this.jobService.getfunctionalExpertiseById('?expertiseId=' + this.ExpertiseId).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        //this.actionStatus='update';
        if (data.HttpStatusCode === 200 || data.HttpStatusCode === 204) {
          this.addfunctionalSubExpertiseForm.controls["JobCategoryId"].disable();
          this.addfunctionalSubExpertiseForm.controls["FunctionalExpertise"].disable();
          this.addfunctionalSubExpertiseForm.patchValue({
            FunctionalExpertise: data.Data.FunctionalExpertise,
            JobCategoryId: data.Data.JobCategoryId,

          });
          this.FunctionalExpertise = data.Data.FunctionalExpertise;
         // this.StatusDataName = data.Data.StatusName;
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
    this.isResponseGet = true;//who:maneesh,what:ewm-16273 for pass false in true and save loader case,when:12/03/2023
    this.submitted = true;
    if (this.addfunctionalSubExpertiseForm.invalid) {
      return;
    }
    this.duplicateCheck(true);

  }

  /*
   @Type: File, <ts>
   @Name: duplicateCheck Function
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
   @What:  For check duplicate value
  */
  public duplicateCheck(isSave) {
    this.loading = false;
    let contactTypeID = this.addfunctionalSubExpertiseForm.get("Id").value;
    if (contactTypeID == null) {
      contactTypeID = 0;
    }
    if (contactTypeID == '') {
      contactTypeID = 0;
    }
    let duplicacyExpertiesObj = {};
    duplicacyExpertiesObj['Id'] = contactTypeID;
    duplicacyExpertiesObj['ExpertiseId'] = this.ExpertiseId;
    duplicacyExpertiesObj['FunctionalSubExpertise'] = this.addfunctionalSubExpertiseForm.get("FunctionalSubExpertise").value;

    this.jobService.checkFunctionalSubExpertiseDuplicay(duplicacyExpertiesObj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 402) {
          this.isResponseGet = false;
          if (data.Data == false) {
            this.isResponseGet = false;
            this.addfunctionalSubExpertiseForm.get("FunctionalSubExpertise").setErrors({ codeTaken: true });
            this.addfunctionalSubExpertiseForm.get("FunctionalSubExpertise").markAsDirty();
            this.loading = false;

          }
        }
        else if (data.HttpStatusCode === 204) {
          this.isResponseGet = false;
          this.loading = false;
          if (data.Data == true) {
            //this.addfunctionalSubExpertiseForm.get("Name").clearValidators();
            this.addfunctionalSubExpertiseForm.get("FunctionalSubExpertise").markAsPristine();
            if (this.addfunctionalSubExpertiseForm && this.submitted == true && isSave==true) {
              this.isResponseGet = true; //who:maneesh,what:ewm-16273 for pass false in true and save loader case,when:12/03/2023 
              if (this.routes.snapshot.params.id == null) {
                this.isResponseGet = true; //who:maneesh,what:ewm-16273 for pass false in true and save loader case,when:12/03/2023 
                this.createForm(this.addfunctionalSubExpertiseForm.getRawValue());
              } else {
                this.isResponseGet = true; //who:maneesh,what:ewm-16273 for pass false in true and save loader case,when:12/03/2023 
                this.updateForm(this.addfunctionalSubExpertiseForm.getRawValue());
              }
            }

          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
          this.isResponseGet = false;

        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.isResponseGet = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.isResponseGet = false;
      });
  }
  /*
  @Type: File, <ts>
  @Name: editForm function
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What: use for set value in patch file for showing information.

     */
  editForm() {
    this.loading = true;
    this.jobService.getfunctionalSubExpertiseById('?subExpertiseId=' + this.routes.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        //this.actionStatus='update';
        if (data.HttpStatusCode === 200) {
          this.addfunctionalSubExpertiseForm.patchValue({
            Id: data.Data.Id,
            JobCategoryId: data.Data.JobCategoryId,
            FunctionalExpertise: data.Data.ExpertiseName,
            FunctionalSubExpertise: data.Data.FunctionalSubExpertise,
            Status: data.Data.Status,
          });
          this.FunctionalExpertise = data.Data.ExpertiseName;
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
    this.isResponseGet = true;
    this.loading = true;
    let addSubExpertiseObj = {};
    addSubExpertiseObj['ExpertiseId'] = this.ExpertiseId;
    addSubExpertiseObj['ExpertiseName'] = value.FunctionalExpertise;
    //addSubExpertiseObj['RegionId'] = value.RegionId;
    addSubExpertiseObj['FunctionalSubExpertise'] = value.FunctionalSubExpertise;
    addSubExpertiseObj['Status'] = value.Status;
    addSubExpertiseObj['StatusName']  = this.StatusDataName;
    this.isResponseGet = true;
    this.jobService.createfunctionalSubExpertise(addSubExpertiseObj).subscribe(
      (data: ResponceData) => {
        this.isResponseGet = true; //who:maneesh,what:ewm-15708 for pass false in true and save loader case,when:18/01/2023
        if (data.HttpStatusCode === 200) {
        // this.isResponseGet = false;
          this.isResponseGet = true;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.addfunctionalSubExpertiseForm.reset();
          this.isResponseGet = false;
          this.route.navigate(['/client/core/administrators/functional-experties/functional-sub-experties'], {
            queryParams: { expertiesId: this.ExpertiseId, FunctionalExpertise: this.FunctionalExpertise, }
          })
           this.loading = false;
          this.formtitle = 'grid';
        }else if (data.HttpStatusCode === 400) {
        this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
          this.isResponseGet = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        this.isResponseGet = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.isResponseGet = false;
      })
  }
  /*
  @Type: File, <ts>
  @Who: Anup
  @When: 18-June-2021
  @Why: EWM-1746 EWM-1843
  @What: use for update form data.

     */
  updateForm(value) {
    this.isResponseGet = true;
    this.loading = true;
    let updateSubExpertiseObj = {};
    updateSubExpertiseObj['Id'] = value.Id;
    updateSubExpertiseObj['ExpertiseId'] = this.ExpertiseId;
    updateSubExpertiseObj['RegionId'] = value.RegionId;
    updateSubExpertiseObj['FunctionalSubExpertise'] = value.FunctionalSubExpertise;
    updateSubExpertiseObj['Status'] = value.Status;
    //updateSubExpertiseObj['RegionName'] = this.RegionName;
    updateSubExpertiseObj['ExpertiseName'] = value.FunctionalExpertise;
    updateSubExpertiseObj['StatusName']  = this.StatusDataName;
    this.jobService.updatefunctionalSubExpertiseById(updateSubExpertiseObj).subscribe(
      (data: ResponceData) => {
    this.isResponseGet = true;
        if (data.HttpStatusCode === 200) {
        this.isResponseGet = false;
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.addfunctionalSubExpertiseForm.reset();
           this.route.navigate(['/client/core/administrators/functional-experties/functional-sub-experties'], {
            queryParams: { expertiesId: this.ExpertiseId, FunctionalExpertise: this.FunctionalExpertise, }
          })
          this.loading = false;
          this.formtitle = 'grid';
        }else if (data.HttpStatusCode === 400) {
        this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
        } else {
        this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
        this.isResponseGet = false;
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
        this.isResponseGet = false;
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
    this.route.navigate(['/client/core/administrators/functional-experties/functional-sub-experties'], {
      queryParams: { expertiesId: this.ExpertiseId, FunctionalExpertise: this.FunctionalExpertise, }
    })
   // this.route.navigate(['/client/core/administrators/functional-experties/functional-sub-experties']);
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
