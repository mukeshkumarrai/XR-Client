import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WorkflowChangeStagesData } from '@app/modules/xeople-job/job-manage/IquickJob';
import { TranslateService } from '@ngx-translate/core';
import { WorkflowCandidateMappedBoxComponent } from 'src/app/modules/EWM.core/job/workflow-candidate-mapped-box/workflow-candidate-mapped-box.component';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ResponceData } from '../../models';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { XeepService } from '../../services/xeep/xeep.service';

@Component({
  selector: 'app-candidate-workflow-stages-mapped-jobdetails-pop',
  templateUrl: './candidate-workflow-stages-mapped-jobdetails-pop.component.html',
  styleUrls: ['./candidate-workflow-stages-mapped-jobdetails-pop.component.scss']
})
export class CandidateWorkflowStagesMappedJobdetailsPopComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public industryJsonObj = {};
  public codePattern = '^[A-Z]{5,20}$';
  public scorePattern = new RegExp(/^(?:100(?:\.0)?|\d{1,3}(?:\.\d{1,2})?)$/);
  public tempID: string;
  public statusList: any = [];
  public industryId;
  public viewModeValue: any;
  public oldPatchValues:any={};
  public selectedLevel1:any={};
  public selectedLevel2:any={};
  public selectedLevel3:any={};
  public dropDoneConfig:customDropdownConfig[]=[];
  public dropDoneConfig1:customDropdownConfig[]=[];
  public dropDoneConfig2:customDropdownConfig[]=[];
  public candidateData:any;
  public workflowId = "4be903ef-e481-4739-8273-d3b5b013c6b7";
  public level1:any = [];
  public level2:any = [];
  public level3:any = [];
  public WorkflowId:any;
  public WorkflowName:any;
  public JobId:any;
  public level1Id:any =[];
  public level2Id:any =[];
  public level3Id:any=[];  
  public dirctionalLang: any;
  public JobName:any;
  public workflowStagesData:WorkflowChangeStagesData;
  isResponseGet:boolean = false;
  jobHeadCountNum:number = 0;
  IsRejectedStage: string;

  constructor(  public dialog: MatDialog,public dialogRef: MatDialogRef<WorkflowCandidateMappedBoxComponent>,private fb: FormBuilder, private router: Router, 
    @Inject(MAT_DIALOG_DATA) public candidateDetails : any,public systemSettingService: SystemSettingService, private commonServiesService: CommonServiesService,
     public _sidebarService: SidebarService, private snackBService: SnackBarService,private jobService : JobService,private xeepService:XeepService,
     private translateService: TranslateService) {       
     this.candidateData = this.candidateDetails.data;
     this.WorkflowId = this.candidateDetails.WorkflowId;
     this.WorkflowName = this.candidateDetails.WorkflowName;
     this.JobId = this.candidateDetails.JobId;
     this.JobName = this.candidateDetails.JobName;
     this.IsRejectedStage=this.candidateDetails?.IsRejectedStage
     this.jobHeadCountNum = this.candidateDetails.data?.JobHeadCount
    this.addForm = this.fb.group({
      Id: [''],     
      level1: [[], Validators.required],
      level2: [[]],
      level3: [[]] 
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
    this.getWorkflowHierarchyData();
    this.addForm.get("level1").markAsUntouched();
  }



  

  onConfirm(value){
    this.isResponseGet = true;
    let formdata = {};
    formdata['CandidateName'] =  this.candidateData?.CandidateName;
    formdata['CandidateId'] = this.candidateData?.CandidateId;
    formdata['JobId'] = this.JobId;
    formdata['JobName'] = this.JobName;//this.candidateData?.JobTitle;
    formdata['WorkflowId'] = this.candidateData?.WorkFlowId;
    formdata['WorkflowName'] = this.WorkflowName;   
    formdata['PreviousStageId'] = this.candidateData?.WorkFlowStageId;
    formdata['PreviousStageName'] = this.candidateData?.WorkFlowStageName; 
    formdata['JobHeadCount'] = this.jobHeadCountNum; 
    if(value.level3?.length != 0 && value?.level3!=null){
      formdata['NextStageId'] = value.level3?.InternalCode;
      formdata['NextStageName'] = value.level3?.StageName; 
      formdata['NextStageDisplaySeq'] = value.level3?.DisplaySeq; 
      formdata['CurrentStageDisplaySeq'] = this.candidateData?.StageDisplaySeq;     
    }else  if(value.level2?.length != 0  && value?.level2!=null){
      formdata['NextStageId'] = value.level2?.InternalCode;
      formdata['NextStageName'] = value.level2?.StageName;  
      formdata['NextStageDisplaySeq'] = value.level2?.DisplaySeq; 
      formdata['CurrentStageDisplaySeq'] = this.candidateData?.StageDisplaySeq;     
    }else{
      formdata['NextStageId'] = value.level1?.InternalCode;
      formdata['NextStageName'] = value.level1?.StageName;
      formdata['NextStageDisplaySeq'] = value.level1?.DisplaySeq; 
      formdata['CurrentStageDisplaySeq'] = this.candidateData?.StageDisplaySeq;  
      
    }   
    this.jobService.candidateMoveAction(formdata).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;  
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message),repsonsedata['HttpStatusCode']);  
          this.onDismiss(true);   
          this.isResponseGet = false;
          if(value.level1?.IsLastStage==1){
            this.xeepService.performAction('eats-cookie');
          }
          if(this.IsRejectedStage=== value.level1?.InternalCode){
            this.xeepService.performAction('binshot');
          }
        } else if(repsonsedata.HttpStatusCode == '204') {
         this.loading = false;
         this.isResponseGet = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          if(repsonsedata.Message=='400041'){
            // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show 
            this.alertValidationManageAccess(repsonsedata.Data.SkipStageName, repsonsedata.Data.SkipStagePosition);
          }
          else if (repsonsedata.Message === "400058") {
            this.alertMaxCandidateAddInLastStage();
          }
          else{
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);           
           }
          this.loading = false;
         this.isResponseGet = false;
        }else{
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
         this.isResponseGet = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
         this.isResponseGet = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }



  onDismiss(flag){
    document.getElementsByClassName("quick-modalbox")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("quick-modalbox")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(flag); }, 200);
  }
  



    /*
@Type: File, <ts>
@Name: getLevel1List function
@Who: Suika
@When: 07-September-2021
@Why: ROST-2693
@What: service call for get list for level1 data
*/

getLevel1List() {
  this.loading = true;
  this.jobService.jobWorkFlowLatestId('?workflowId='+this.workflowId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;
        this.level1 = repsonsedata.Data.Stages;         
      } else if(repsonsedata.HttpStatusCode == '204') {
       this.loading = false;
      }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    })
}




getAllNextStageList(workflowId,currentStageId,isChild) {
  this.loading = true;
  let level = 1;
  let parentstageid = "";
  let level1valid=false;
  this.jobService.getAllNextStages_v2('?workflowid='+workflowId+'&currentstageid='+currentStageId+'&level='+level).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;        
        this.level1 = repsonsedata.Data; 
       let selectLevel = repsonsedata.Data.filter(res=>res.InternalCode==this.workflowStagesData?.Parent); 
       this.addForm.get('level1').patchValue(selectLevel[0]);  
         
        } else if(repsonsedata.HttpStatusCode == '204') {
        if (level1valid) {
          this.addForm.get("level1").clearValidators();
        }
       this.loading = false;
      }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    })
}



getAllNextStageLevel2List(workflowId,currentStageId,Id) {
  this.level2 = [];
  this.level3 = [];
  this.loading = true;
  let level = 2;
  let parentstageid = Id;
  this.jobService.getAllNextStages_v2('?workflowid='+workflowId+'&currentstageid='+currentStageId+'&level='+level+'&parentstageid='+parentstageid).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;        
        this.level2 = repsonsedata.Data;      
        let selectLevel = repsonsedata.Data.filter(res=>res.InternalCode==this.workflowStagesData.Child); 
        this.addForm.get('level2').patchValue(selectLevel[0]);     
      } else if(repsonsedata.HttpStatusCode == '204') {
       this.loading = false;
      }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    })
}


getAllNextStageLevel3List(workflowId,currentStageId,Id) {
  this.level3 = [];
  this.loading = true;
  let level = 3;
  let parentstageid = Id;
  this.jobService.getAllNextStages_v2('?workflowid='+workflowId+'&currentstageid='+currentStageId+'&level='+level+'&parentstageid='+parentstageid).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;        
        this.level3 = repsonsedata.Data;   
        let selectLevel = repsonsedata.Data.filter(res=>res.InternalCode==this.workflowStagesData.Subchild); 
        this.addForm.get('level3').patchValue(selectLevel[0]);          
      } else if(repsonsedata.HttpStatusCode == '204') {
       this.loading = false;
      }else{
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      }
    })
}


getUpdateOptionsLevel1(){
  this.getAllNextStageList(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,"0");
}

getUpdateOptionsLevel2(){
  this.getAllNextStageLevel2List(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,this.level1Id); 
}
getUpdateOptionsLevel3(){
  this.getAllNextStageLevel3List(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,this.level2Id);
}


onLevel1Changes(e){
  if(e!=undefined){
    this.level1Id = e?.InternalCode;
    this.getAllNextStageLevel2List(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,this.level1Id); 
  }
  this.addForm.get('level2').patchValue(null);  
  this.addForm.get('level3').patchValue(null);  
}

onLevel2Changes(e){
  if(e!=undefined){  
    this.level2Id = e?.InternalCode;
    this.getAllNextStageLevel3List(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,this.level2Id);
  }
  else{
    this.addForm.get('level2').patchValue(null);  
  }
}
  
onLevel3Changes(e){
  if(e!=undefined){  }
  else{
    this.addForm.get('level3').patchValue(null);  
  }
}

redirect(){  
 this.router.navigate(['./client/core/administrators/job-workflows']);
 this.onDismiss('false');
}



  /* 
    @Type: File, <ts>
    @Name: alertValidationManageAccess function
    @Who: Suika
    @When: 25-Aug-2022
    @Why: EWM-7489 EWM-8426
    @What: For Alert validation message
  */
 // @When: 01-08-2024 @who:Amit @why: EWM-17809 @what: Skip Stage Position show
 public alertValidationManageAccess(SkipStageName, SkipStagePosition){
  let message1 = `label_stage_msg1`;
  const message2 = `label_stage_msg2`;
  const message3 = `label_stage_msg3`;
  const message = '';
  const title = '';
  const subTitle = '';
  let mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates';
  switch (SkipStagePosition) {
    case 'parent':
      mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates';
      break;
    case 'child':
      mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates_substage';
      break;
    case 'subchild':
      mintitle ='label_jobsummary_job_workflow_manuallymovingcandidates_substage_Sub-substage';
      break;
  }

  message1 = this.commonServiesService.getreplace(mintitle, SkipStageName);

  const dialogData = new ConfirmDialogModel(title, subTitle,message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData,isButtonShow:true,SkipStageName:SkipStageName,message1:message1,message2:message2,message3:message3},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  let dir:string;
  dir=document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList=document.getElementsByClassName('cdk-global-overlay-wrapper');
  for(let i=0; i < classList.length; i++){
    classList[i].setAttribute('dir', this.dirctionalLang);
   }
  dialogRef.afterClosed().subscribe(res => {
    
  })
}

  getWorkflowHierarchyData() {
    this.jobService.getWorkflowHierarchy('?worflowid=' + this.candidateData.WorkFlowId + '&stageid=' + this.candidateData.WorkFlowStageId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200' || repsonsedata.HttpStatusCode == '204') {
          let res = repsonsedata.Data;
          let parent: string, child: string, subchild: string;
          let code: string = "00000000-0000-0000-0000-000000000000";
          if (res.FirstParentStageId === code) {
            parent = null;
            if (res.SecondParentStageId === code) {
              parent = res.StageId;
            }
            else {
              child = res.StageId
              parent = res.SecondParentStageId
            }
          }
          else {
            parent = res.FirstParentStageId;
            if (res.SecondParentStageId === code) { }
            else {
              parent = res.FirstParentStageId;
              child = res.SecondParentStageId;
              subchild = res.StageId;
            }
          }

          let stageObj: WorkflowChangeStagesData = {
            Parent: parent,
            Child: child,
            Subchild: subchild
          }
          this.workflowStagesData = stageObj;
          this.level1Id = this.workflowStagesData?.Parent;
          this.level2Id = this.workflowStagesData?.Child;
          this.getAllNextStageList(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,"0");
          this.getAllNextStageLevel2List(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,this.level1Id); 
          if (this.workflowStagesData.Child) {
            this.getAllNextStageLevel3List(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,this.level2Id);
          }
        }
        else {  
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        }
      })
  }
// adarsh singh on 9 April 2024 for EWM-16567
  public alertMaxCandidateAddInLastStage(){
    const jobHeadCount = this.jobHeadCountNum;
    const message = `${this.translateService.instant('label_candidate_Of_Job_HeaCount')} (${jobHeadCount}).
     ${this.translateService.instant('label_max_candidate_Of_Job_HeaCount')} (${jobHeadCount})
     ${this.translateService.instant('label_candidate_Of_Job_HeaCount_message')} 
     `
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle,message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData,isButtonShow:true,message:message},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
     
  }
}



