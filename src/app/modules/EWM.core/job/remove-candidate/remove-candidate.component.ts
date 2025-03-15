/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Anup Singh
    @When: 30-Sep-2021
    @Why: EWM-2871 EWM-2979
    @What:  This page is creted for remove reason 
*/

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { JobService } from '../../shared/services/Job/job.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { customDropdownConfig, statusList } from '../../shared/datamodels';
import { ResponceData } from 'src/app/shared/models';

@Component({
  selector: 'app-remove-candidate',
  templateUrl: './remove-candidate.component.html',
  styleUrls: ['./remove-candidate.component.scss']
})
export class RemoveCandidateComponent implements OnInit {
  addForm: FormGroup;
  maxMessage: number = 1000;
  loading: boolean;
  jobdetailsData: any = {};
  JobId: any;
  JobName:any;

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


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
    private snackBService: SnackBarService, private serviceListClass: ServiceListClass,
    public dialogRef: MatDialogRef<RemoveCandidateComponent>,
    private commonserviceService: CommonserviceService, public dialog: MatDialog,
    private translateService: TranslateService, public systemSettingService: SystemSettingService) {

    // 6th
    //////Manage Access//////////////
    this.dropDownReasonConfig['IsDisabled'] = false;
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList+'?StatusId=';
    this.dropDownReasonConfig['placeholder'] = 'label_reasonOfRemovingCandidates';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=c81dacbe-3e57-4a32-805d-001380c65303';
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;
    this.dropDownReasonConfig['isClearable'] = true;    

      
    this.dropDownStatusConfig['IsDisabled'] = false;
    this.dropDownStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + '?GroupId=c81dacbe-3e57-4a32-805d-001380c65303'+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=candidate';
    this.dropDownStatusConfig['placeholder'] = 'label_status';
    this.dropDownStatusConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId=c81dacbe-3e57-4a32-805d-001380c65303';
    this.dropDownStatusConfig['IsRequired'] = false;
    this.dropDownStatusConfig['searchEnable'] = true;
    this.dropDownStatusConfig['bindLabel'] = 'Code';
    this.dropDownStatusConfig['multiple'] = false;
    this.dropDownStatusConfig['isClearable'] = true;    



    this.addForm = this.fb.group({
      ReasonId: [[]],
      ReasonName: [''],
      Remarks: ["", [Validators.maxLength(1000)]],
      StatusId: [[]],
      StatusName: ['']

    });
  }


  ngOnInit(): void {
    // this.getStatusBaseUserType(userType)
    this.jobdetailsData = this.data.jobdetailsData;
    this.JobId = this.data?.JobId;
    this.JobName = this.data?.JobName;
    if(this.data){
      let data = this.data?.StatusData
      this.StatusIdData = data.StatusId;
      this.StatusNameData = data.StatusName;
      this.loading= true;
     setTimeout(() => {
      this.selectedStatus = {'Id':this.StatusIdData,StatusName:this.StatusNameData }
      this.onManageStatuschange(this.selectedStatus )
      this.loading=false
     },200);

    }
    
  }


  /*
@Type: File, <ts>
@Name: onDismiss function
@Who:  ANUP
@When: 01-oct-2021
@Why: EWM-2871 EWM-2974
@What: For cancel popup
*/
  onDismiss(): void {
    document.getElementsByClassName("candidateTimeline")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("candidateTimeline")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


  /*
@Type: File, <ts>
@Name: onMessage function
@Who:  ANUP
@When: 01-oct-2021
@Why: EWM-2871 EWM-2974
@What: For message count
*/
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      this.maxMessage = 1000 - value.length;
    }
  }


  /*
  @Type: File, <ts>
  @Name: onManageReasonchange function
  @Who: Anup
  @When: 30-sep-2021
  @Why: EWM-2871 EWM-2979
  @What: For showing the list of reason data
 */
  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.addForm.patchValue(
        {
          ReasonId: null,
          ReasonName: ''
        }
      )
      // commnet by adarsh singh for EWM-14917
      // this.addForm.get("ReasonId").setErrors({ required: true });
      // this.addForm.get("ReasonId").markAsTouched();
      // this.addForm.get("ReasonId").markAsDirty();
    }
    else {
      // this.addForm.get("ReasonId").clearValidators();
      // this.addForm.get("ReasonId").markAsPristine();
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
    this.selectedReason = null;
    if (data == null || data == "") {
      this.selectedStatus = null;
      this.addForm.patchValue(
        {
          StatusId: null,
          ReasonId: null,
          StatusName: null,
        }
      )
      // commnet by adarsh singh for EWM-14917
      // this.addForm.get("StatusId").setErrors({ required: true });
      // this.addForm.get("StatusId").markAsTouched();
      // this.addForm.get("StatusId").markAsDirty();
    }
    else {
      // this.addForm.get("StatusId").clearValidators();
      // this.addForm.get("StatusId").markAsPristine();
      this.selectedStatus = data;
      this.addForm.patchValue(
        {
          StatusId: data.Id,
          StatusName: data.ShortDescription,
          ReasonId: null,
        }
      )
    }
    // this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.reasonList + '?StatusId=' + this.selectedStatus.Id;
    // this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);

    //////Job Sub Type//////////////
    // who:maneesh,what:ewm-11901 pass '&groupType=candidate' for all regeon displayDate,when:01/06/2023
    this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id+ '&groupType=candidate'+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=candidate';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=c81dacbe-3e57-4a32-805d-001380c65303&statusId='+ this.selectedStatus.Id+'&GroupCode=CANDIDATE';
    this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);
  }


  /*
  @Type: File, <ts>
  @Name: onConfirm function
  @Who:  ANUP
  @When: 01-oct-2021
  @Why: EWM-2871 EWM-2974
  @What: For Save remove resion
  */
  onConfirm(value) {
    this.loading = true;
    let removeObj = {};
    removeObj["CandidateId"] = this.jobdetailsData?.CandidateId,
      removeObj["CandidateName"] = this.jobdetailsData?.CandidateName,
      // removeObj["JobId"] = this.jobdetailsData?.JobId,
      removeObj["JobId"] = this.JobId,
      removeObj["JobName"] = this.JobName,
      removeObj["StageId"] = this.jobdetailsData?.WorkFlowStageId,
      removeObj["StageName"] = this.jobdetailsData?.WorkFlowStageName?this.jobdetailsData?.WorkFlowStageName:'',
      removeObj["StatusId"] = value.StatusId ? value.StatusId : '00000000-0000-0000-0000-000000000000',
      removeObj["StatusName"] = value.StatusName,
      removeObj["ReasonId"] = value.ReasonId ? value.ReasonId : 0,
      removeObj["ReasonName"] = value.ReasonName,
      removeObj["Remarks"] = value.Remarks,
      removeObj["PageName"] = "Job Details",
      removeObj["BtnId"] = "btnSave";
      removeObj["PreviousStatusName"] = this.StatusNameData;

    this.jobService.removeCandidate(removeObj).subscribe(
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