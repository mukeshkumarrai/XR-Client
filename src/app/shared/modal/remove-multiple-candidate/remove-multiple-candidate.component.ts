// <!---
//     @(C): Entire Software
//     @Who: Adarsh Singh
//     @When: 11-OCT-2023
//     @Why: EWM-14697 EWM-14741
//     @What:  This page is creted for remove multiple candidate
// -->



import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { RemoveCandidateComponent } from 'src/app/modules/EWM.core/job/remove-candidate/remove-candidate.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from '../../models';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';
import { ServiceListClass } from '../../services/sevicelist';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';

@Component({
  selector: 'app-remove-multiple-candidate',
  templateUrl: './remove-multiple-candidate.component.html',
  styleUrls: ['./remove-multiple-candidate.component.scss']
})
export class RemoveMultipleCandidateComponent implements OnInit {

  addForm: FormGroup;
  maxMessage: number = 300;
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

  isbulkCase:boolean = false;
  numberOfCandidate: [] = [];

 isResponseGet:boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
    private snackBService: SnackBarService, private serviceListClass: ServiceListClass,
    public dialogRef: MatDialogRef<RemoveCandidateComponent>,
    private commonserviceService: CommonserviceService, public dialog: MatDialog,
    private translateService: TranslateService, public systemSettingService: SystemSettingService) {

    //////Manage Access//////////////
    this.dropDownReasonConfig['IsDisabled'] = false;
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
      ReasonId: [],
      ReasonName: [''],
      Remarks: ["", [Validators.maxLength(this.maxMessage)]],
      StatusId: [],
      StatusName: ['']

    });
  }


  ngOnInit(): void {
    this.jobdetailsData = this.data.jobdetailsData;
    this.JobId = this.data?.JobId;
    this.JobName = this.data?.JobName;
    if(this.data?.JobId){
      let data = this.data
      this.isbulkCase = data?.isBulkCase;
      this.numberOfCandidate = this.data?.candList;

      if (this.data?.candList?.length === 1) {
        setTimeout(() => {
          this.selectedStatus = {'Id':this.data?.candList[0].StatusId,StatusName:this.data?.candList[0].StatusName }
          this.onManageStatuschange(this.selectedStatus )
          this.loading=false
         },200);
      }
    

    }
    
  }


  /*
@Type: File, <ts>
@Name: onDismiss function
@Who: Adarsh Singh
@When: 11-OCT-2023
@Why: EWM-14697 EWM-14741
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
@Who: Adarsh Singh
@When: 11-OCT-2023
@Why: EWM-14697 EWM-14741
@What: For message count
*/
  public onMessage(value: any) {
    if (value != undefined && value != null) {
      // who:maneesh,what:ewm-14855 for validation issue,when:27/10/2023
      this.maxMessage = 300- value.length;
      if(value?.length>300){
        this.addForm.get('Remarks').markAsTouched();
        this.addForm.get('Remarks').setErrors({maxlength:true});
      }
    }
  }

  /*
@Type: File, <ts>
@Name: onManageReasonchange function
@Who: Adarsh Singh
@When: 11-OCT-2023
@Why: EWM-14697 EWM-14741
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
          StatusName: null
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
    this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedStatus.Id+ '&groupType=candidate'+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=candidate';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=c81dacbe-3e57-4a32-805d-001380c65303&statusId='+ this.selectedStatus.Id+'&GroupCode=CANDIDATE';
    this.resetFormSubjectSubExperties.next(this.dropDownReasonConfig);
  }


  /*
  @Type: File, <ts>
  @Name: onConfirm function
  @Who:  ANUP
  @When: 01-oct-2023
  @Why: EWM-2871 EWM-2974
  @What: For Save remove resion
  */
  onConfirm(value) {
    this.isResponseGet = true;
    let removeObj = {};
    let candArr = [];
     this.numberOfCandidate.forEach((e:any)=>{
      candArr.push({
        CandidateId:  e?.CandidateId,
        CandidateName:  e?.CandidateName,
        CurrentStageId:  e?.WorkFlowStageId,
        CurrentStageName:  e?.WorkFlowStageName,
        PreviousStatusName: e?.StatusName
      })
    })
      removeObj["StatusId"] = value.StatusId ? value.StatusId : '00000000-0000-0000-0000-000000000000',
      removeObj["StatusName"] = value.StatusName,
      removeObj["CandidateId"] = this.jobdetailsData?.CandidateId,
      removeObj["CandidateName"] = this.jobdetailsData?.CandidateName,
      removeObj["JobId"] = this.JobId,
      removeObj["JobName"] = this.JobName,
      removeObj["Remarks"] = value.Remarks,
      removeObj["ReasonId"] = value.ReasonId ? value.ReasonId : 0,
      removeObj["ReasonName"] = value.ReasonName,
      removeObj["CandidateList"] = candArr,

    this.jobService.removeBulkCandidate(removeObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.isResponseGet = false;
          document.getElementsByClassName("candidateTimeline")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("candidateTimeline")[0].classList.add("animate__zoomOut");
           this.dialogRef.close(true);  
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        } else if (repsonsedata.HttpStatusCode === 400) {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.isResponseGet = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.isResponseGet = false;
        }
      },
      err => {
        this.isResponseGet = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  getStatusBaseUserType(userType: any) {
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