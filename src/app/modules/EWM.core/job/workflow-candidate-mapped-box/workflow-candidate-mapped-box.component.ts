import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AlertDialogComponent } from 'src/app/shared/modal/alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { customDropdownConfig } from '../../shared/datamodels';
import { JobService } from '../../shared/services/Job/job.service';

@Component({
  selector: 'app-workflow-candidate-mapped-box',
  templateUrl: './workflow-candidate-mapped-box.component.html',
  styleUrls: ['./workflow-candidate-mapped-box.component.scss']
})
export class WorkflowCandidateMappedBoxComponent implements OnInit {

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
  constructor(  public dialog: MatDialog,public dialogRef: MatDialogRef<WorkflowCandidateMappedBoxComponent>,private fb: FormBuilder, private router: Router, private route: ActivatedRoute, 
    @Inject(MAT_DIALOG_DATA) public candidateDetails : any,private commonserviceService: CommonserviceService,public systemSettingService: SystemSettingService,
     public _sidebarService: SidebarService,private serviceListClass: ServiceListClass, private snackBService: SnackBarService,private jobService : JobService,
     private translateService: TranslateService) {       
     this.candidateData = this.candidateDetails.data;
     this.WorkflowId = this.candidateDetails.WorkflowId;
     this.WorkflowName = this.candidateDetails.WorkflowName;
     this.JobId = this.candidateDetails.JobId;
     this.JobName = this.candidateDetails.JobName;
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
 
    this.getAllNextStageList(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,"0");
    this.addForm.get("level1").markAsUntouched();
  }



  

  onConfirm(value){
    let formdata = {};
    formdata['CandidateName'] =  this.candidateData?.CandidateName;
    formdata['CandidateId'] = this.candidateData?.CandidateId;
    formdata['JobId'] = this.JobId;
    formdata['JobName'] = this.JobName;//this.candidateData?.JobTitle;
    formdata['WorkflowId'] = this.candidateData?.WorkFlowId;
    formdata['WorkflowName'] = this.WorkflowName;   
    formdata['PreviousStageId'] = this.candidateData?.WorkFlowStageId;
    formdata['PreviousStageName'] = this.candidateData?.WorkFlowStageName; 
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
        } else if(repsonsedata.HttpStatusCode == '204') {
         this.loading = false;
        } else if (repsonsedata.HttpStatusCode === 400) {
          if(repsonsedata.Message=='400041'){
            this.alertValidationManageAccess(repsonsedata.Data.SkipStageName);
          }else{
           this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);           
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
  this.jobService.getAllNextStages('?workflowid='+workflowId+'&currentstageid='+currentStageId+'&level='+level).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;        
        this.level1 = repsonsedata.Data; 
       let selectLevel = repsonsedata.Data.filter(res=>res.InternalCode==this.candidateData?.WorkFlowStageId); 
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
  this.jobService.getAllNextStages('?workflowid='+workflowId+'&currentstageid='+currentStageId+'&level='+level+'&parentstageid='+parentstageid).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;        
        this.level2 = repsonsedata.Data;         
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
  this.jobService.getAllNextStages('?workflowid='+workflowId+'&currentstageid='+currentStageId+'&level='+level+'&parentstageid='+parentstageid).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode == '200') {
        this.loading = false;        
        this.level3 = repsonsedata.Data;         
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
}

onLevel2Changes(e){
  if(e!=undefined){  
    this.level2Id = e?.InternalCode;
    this.getAllNextStageLevel3List(this.candidateData.WorkFlowId,this.candidateData.WorkFlowStageId,this.level2Id);
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
 public alertValidationManageAccess(SkipStageName){
  const message1 = `label_stage_msg1`;
  const message2 = `label_stage_msg2`;
  const message3 = `label_stage_msg3`;
  const message = '';
  const title = '';
  const subTitle = '';
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
}

