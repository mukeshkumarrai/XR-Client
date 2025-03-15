// who:maneesh,what:ewm-11774 create component for edit status when:19/09/2023
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig } from '../../../shared/datamodels';
import { JobService } from '../../../shared/services/Job/job.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { Subject } from 'rxjs';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { GetStatusModel } from 'src/app/shared/models/edit-status-jobdetailsModel'


@Component({
  selector: 'app-job-deatils-header-status',
  templateUrl: './job-deatils-header-status.component.html',
  styleUrls: ['./job-deatils-header-status.component.scss']
})
export class JobDeatilsHeaderStatusComponent implements OnInit {

  quickJobForm: FormGroup;
  public loading: boolean = false;
  public JobId:string;  
  public dirctionalLang: string;
  public dropDownJobStatusConfig: customDropdownConfig[] = [];
  public selectedJobStatus: any = {};
  public jobStatusActiveKey:string;
  public selectedReason: any = {};
  public resetFormSubjectrReason: Subject<any> = new Subject<any>();
  public dropDownReasonConfig: customDropdownConfig[] = [];
  public resetFormselectedReason: Subject<any> = new Subject<any>();
  public currentStatus:string;
  public JobName:string;
  public Statusdata: string;
  public jobID:string;
  public candidateDetailsJobId:string;
  constructor(  public dialog: MatDialog,public dialogRef: MatDialogRef<JobDeatilsHeaderStatusComponent>,private fb: FormBuilder, private router: Router, private route: ActivatedRoute, 
    @Inject(MAT_DIALOG_DATA) public candidateDetails : any,
     public _sidebarService: SidebarService,private serviceListClass: ServiceListClass, private snackBService: SnackBarService,private jobService : JobService,
     private translateService: TranslateService,private appSettingsService: AppSettingsService, private commonService: CommonserviceService) {
      this.jobStatusActiveKey = this.appSettingsService.JobStatusActiveKey;
      this.jobID = this.appSettingsService.jobID
      this.candidateDetailsJobId = this.candidateDetails.JobId;
      this.currentStatus = this.candidateDetails.currentStatus;
      this.JobName = this.candidateDetails.JobName;


     ////// Status//////////////
      this.dropDownJobStatusConfig['apiEndPoint'] = this.serviceListClass.getallStatusDetails + "?GroupId="+ this.jobID +'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
      this.dropDownJobStatusConfig['placeholder'] = 'quickjob_status';
      this.dropDownJobStatusConfig['IsManage'] = '/client/core/administrators/group-master';
      this.dropDownJobStatusConfig['IsRequired'] = true;
      this.dropDownJobStatusConfig['searchEnable'] = true;
      this.dropDownJobStatusConfig['bindLabel'] = 'Code';
      this.dropDownJobStatusConfig['multiple'] = false;
      this.dropDownJobStatusConfig['isClearable'] = false;    

     ////// Reason//////////////
    this.dropDownReasonConfig['placeholder'] = 'label_reasonMaster';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/status?groupId='+this.jobID;
    this.dropDownReasonConfig['IsRequired'] = false;
    this.dropDownReasonConfig['searchEnable'] = true;
    this.dropDownReasonConfig['bindLabel'] = 'ReasonName';
    this.dropDownReasonConfig['multiple'] = false;
    this.quickJobForm = this.fb.group({
      ReasonId:[0],
      ReasonName:[''],
      StatusId: [, [Validators.required]],
      StatusName: [],
    });

  }


  ngOnInit(): void {  
    let URL = this.router.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata'); 
   }

// who:maneesh,what:ewm-11774 for create status  when:19/09/2023
  onConfirm(value){
   let formdata: GetStatusModel;
    formdata = {
      JobId: this.candidateDetailsJobId,
      JobName: this.JobName,
      StatusId: this.quickJobForm.value.StatusId,
      StatusName: this.quickJobForm.value.StatusName,
      ReasonId: this.quickJobForm.value.ReasonId,
      ReasonName: this.quickJobForm.value.ReasonName
    }
    this.jobService.updateJobStatusheaderData(formdata).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.Statusdata=repsonsedata.Data.StatusName;          
          this.commonService.ChangeStatus.next(this.Statusdata);
  
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message),repsonsedata['HttpStatusCode']);  
          this.onDismiss(true);    
        } else if(repsonsedata.HttpStatusCode == '204') {
         this.loading = false;
        } 
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }


// who:maneesh,what:ewm-11774 for cancel popup when:19/09/2023
  onDismiss(flag){
    document.getElementsByClassName("quick-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("quick-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(flag); }, 200);
  }
// who:maneesh,what:ewm-11774 for change status when:19/09/2023
  onJobStatuschange(data) {
    this.selectedReason = null;
    if (data == null || data == "") {
      this.selectedJobStatus = null;
      this.quickJobForm.patchValue(
        {
          StatusId: null,
          ReasonId: 0,
          ReasonName: ''
        }
      )
      
      this.quickJobForm.get("StatusId").setErrors({ required: true });
      this.quickJobForm.get("StatusId").markAsTouched();
      this.quickJobForm.get("StatusId").markAsDirty();
    }
    else {
      this.quickJobForm.get("StatusId").clearValidators();
      this.quickJobForm.get("StatusId").markAsPristine();
      this.selectedJobStatus = data;            
      this.quickJobForm.patchValue(
        {
          StatusId: data.Id,
          StatusName:data.Code,
          ReasonId: 0,
          ReasonName: ''
        }
      )
    }
    this.dropDownReasonConfig['apiEndPoint'] = this.serviceListClass.removeReasonCandidate + '?groupInternalCode=' + this.selectedJobStatus.Id+'&FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo&groupType=JOB';
    this.dropDownReasonConfig['IsManage'] = '/client/core/administrators/group-master/reason?GroupId=' + this.jobID + '&statusId='+ this.selectedJobStatus.Id+'&GroupCode=JOB';
    this.resetFormselectedReason.next(this.dropDownReasonConfig);
  }
// who:maneesh,what:ewm-11774 for change reason when:19/09/2023
  onManageReasonchange(data) {
    if (data == null || data == "") {
      this.selectedReason = null;
      this.quickJobForm.patchValue(
        {
          ReasonId: 0,
          ReasonName: ''
        }
      )

    }
    else {
      this.selectedReason = data;  
      this.quickJobForm.patchValue(
        {
          ReasonId: data.Id,
          ReasonName: data.ReasonName,
        }
      )
    }
  }
}


