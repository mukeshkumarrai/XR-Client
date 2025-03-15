/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Nitin Bhati
    @When: 06th-Oct-2022
    @Why: EWM-9027
    @What:  This page is creted for reason 
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { AddemailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/addemail/addemail.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { CountryMasterService } from 'src/app/shared/services/country-master/country-master.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { JobService } from '../../shared/services/Job/job.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { customDropdownConfig, statusList } from '../../shared/datamodels';
import { ResponceData } from 'src/app/shared/models';
import { CandidateService } from '../../shared/services/candidates/candidate.service';

@Component({
  selector: 'app-status-candidate-update',
  templateUrl: './status-candidate-update.component.html',
  styleUrls: ['./status-candidate-update.component.scss']
})
export class StatusCandidateUpdateComponent implements OnInit {
  addForm: FormGroup;
  maxMessage: number = 1000;
  loading: boolean;
  jobdetailsData: any = {};
  JobId: any;

  resetFormSubjectSubExperties: Subject<any> = new Subject<any>();
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public dropDownStatusConfig: customDropdownConfig[] = [];
  public selectedReason: any = {};
  public selectedStatus: any = {};
  public statusList: any = [];
  public statusId: any;
  public statusName: any;
  StatusIdData:any;
  StatusNameData:string;
  ReasonIdData: any;
  ReasonNameData: any; 


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
    private snackBService: SnackBarService, private serviceListClass: ServiceListClass,
    public dialogRef: MatDialogRef<StatusCandidateUpdateComponent>,
    private commonserviceService: CommonserviceService, public dialog: MatDialog,
    private translateService: TranslateService, public systemSettingService: SystemSettingService,public _CandidateService:CandidateService) {

    // 6th
    //////Manage Access//////////////
    this.dropDownReasonConfig['IsDisabled'] = false;
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList+'?StatusId=';
    this.dropDownReasonConfig['placeholder'] = 'label_reasonMaster';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=c81dacbe-3e57-4a32-805d-001380c65303';
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;


    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + '?GroupId=c81dacbe-3e57-4a32-805d-001380c65303';
    this.dropDownStatusConfig['placeholder'] = 'label_status';
    this.dropDownStatusConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=c81dacbe-3e57-4a32-805d-001380c65303';
    this.dropDownStatusConfig['IsRequired'] = true;
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['bindLabel'] = 'Code';
    this.dropDownStatusConfig['multiple'] = false;


    this.addForm = this.fb.group({
      ReasonId: [''],
      ReasonName: [null],
      Remarks: ["", [Validators.maxLength(1000)]],
      StatusId: [[], Validators.required],
      StatusName: ['']

    });
  }


  ngOnInit(): void {
    // this.getStatusBaseUserType(userType)
    this.jobdetailsData = this.data.jobdetailsData;
    this.JobId = this.data?.JobId;
    if(this.data){
      let data = this.data?.StatusData
      this.StatusIdData = data.StatusId;
      this.StatusNameData = data.StatusName;
      this.ReasonIdData = data.ReasonId;
      this.ReasonNameData = data.ReasonName;
      this.loading= true;
     setTimeout(() => {
      this.loading=false
      this.selectedStatus = {'Id':this.StatusIdData,StatusName:this.StatusNameData }
      this.onManageStatuschange(this.selectedStatus )
      this.selectedReason = {'Id':this.ReasonIdData,ReasonName:this.ReasonNameData }
      this.onManageReasonchange(this.selectedReason );          
     },200);

    }
    

    
  }


  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: Nitin Bhati
@When: 06th-Oct-2022
@Why: EWM-9027
@What: For cancel popup
*/
  onDismiss(): void {
    document.getElementsByClassName("candidateTimeline")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("candidateTimeline")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

  /*
  @Type: File, <ts>
  @Name: onManageReasonchange function
  @Who: Nitin Bhati
  @When: 06th-Oct-2022
  @Why: EWM-9027
  @What: For showing the list of reason data
 */
  // onManageReasonchange(data) {
  //   if (data == null || data == "") {
  //     this.selectedReason = null;
  //     this.addForm.patchValue(
  //       {
  //         ReasonId: null,
  //         ReasonName: null
  //       }
  //     )
  //    // this.addForm.get("ReasonId").setErrors({ required: true });
  //    this.addForm.get("ReasonId").markAsTouched();
  //    this.addForm.get("ReasonId").markAsDirty();
  //   }
  //   else {
  //   //  this.addForm.get("ReasonId").clearValidators();
  //   //  this.addForm.get("ReasonId").markAsPristine();
  //    // this.selectedReason = data;
  //     this.addForm.patchValue(
  //       {
  //         ReasonId: data.Id,
  //         ReasonName: data.ReasonName,
  //       }
  //     )
  //   }
  // }

  // who:maneesh,what:for ewm.9796,when:15/12/2022
  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.addForm.patchValue(
        {
          ReasonId: null,
          ReasonName: null 
        }
      )
      // this.addForm.get("ReasonId").setErrors({ required: true });
      this.addForm.get("ReasonId").markAsTouched();
      this.addForm.get("ReasonId").markAsDirty();
    }
    else if(data.Id === null || data.Id === 0 ){
      this.selectedReason = null;
      this.addForm.patchValue(
        {
          ReasonId: null,
        }
      )
    }
    else {
      this.addForm.get("ReasonId").clearValidators();
      this.addForm.get("ReasonId").markAsPristine();
      this.selectedReason = data;      
      this.addForm.patchValue(
        {
          ReasonId: data.Id,
          ReasonName: data.ReasonName, 
        }
      )
    }
  }


          onManageStatuschange(data) {
            this.selectedReason = null ;
            if (data == null || data == "") {
              this.selectedStatus = null;
              this.addForm.patchValue(
                {
                  StatusId: null,
                  ReasonId: null,
                }
              )
              this.addForm.get("StatusId").setErrors({ required: true });
              this.addForm.get("StatusId").markAsTouched();
              this.addForm.get("StatusId").markAsDirty();
              // this.dropDownReasonConfig['IsManage'] = '';
            }
            else {
              this.addForm.get("StatusId").clearValidators();
              this.addForm.get("StatusId").markAsPristine();
              this.selectedStatus = data;
              this.addForm.patchValue(
                {
                  StatusId: data.Id,
                  ReasonId: data.ReasonId,
                  ReasonName: data.ReasonName
                }
              )
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList + '?StatusId=' + this.selectedStatus.Id;
    // this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);

    //////Job Sub Type//////////////
       this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id;
       this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=c81dacbe-3e57-4a32-805d-001380c65303&statusId='+ this.selectedStatus.Id+'&GroupCode=CANDIDATE';
       this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);
    }
    
  }


  /*
  @Type: File, <ts>
  @Name: onConfirm function
  @Who: Nitin Bhati
  @When: 06th-Oct-2022
  @Why: EWM-9027
  @What: For Save resion
  */
  onConfirm(value) {
    this.loading = true;
    let removeObj = {};
      removeObj["CandidateID"] = this.jobdetailsData?.CandidateId,
      removeObj["JobId"] = this.JobId,
      removeObj["StatusID"] = value.StatusId,
      //removeObj["StatusName"] = value.StatusName,
      removeObj["ReasonId"] = value.ReasonId?value.ReasonId:0,
      // removeObj["ReasonName"] = value.ReasonName,
      // removeObj["Remarks"] = value.Remarks,
      // removeObj["PageName"] = "Job Details",
      // removeObj["BtnId"] = "btnSave";

    this._CandidateService.updateCanStatus(removeObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          document.getElementsByClassName("candidateTimeline")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("candidateTimeline")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true); }, 200);
          // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  getStatusBaseUserType(userType: any) {
    // this.addCandidateForm.get('tempStatus').reset();
    this.systemSettingService.getStatusUserType('Candidate').subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data[0].statuses;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


}

