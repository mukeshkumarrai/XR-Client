import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { JobScreening } from 'src/app/shared/models/job-screening';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AddMapChecklistComponent } from './add-map-checklist/add-map-checklist.component';
import { UploadDocumentChecklistComponent } from './upload-document-checklist/upload-document-checklist.component';
import { ChecklistComponent } from '@app/modules/EWM.core/system-settings/checklist/checklist.component';


enum fileExtention{
  "application/zip"="zip",
  "application/pdf"="pdf",
  "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"="xlsx",
  "text/plain"="txt",
  "application/vnd.ms-word"="doc",
  "application/vnd.ms-excel"="xls",
  "image/png"="png",
  "image/jpeg"="jpeg",
  "image/gif"="gif",
  "text/csv"="csv"
}
@Component({
  selector: 'app-job-checklist',
  templateUrl: './job-checklist.component.html',
  styleUrls: ['./job-checklist.component.scss']
})
export class JobChecklistComponent implements OnInit {
  public positionMatDrawer: string = 'end';
  public userpreferences: Userpreferences;
  loading: boolean;
  WorkflowChecklistData: any=[];
  indexExpanded: number;
  checklistType: any;
  checkListStatus: boolean=false;
  isEditable: boolean=false;
  checklistData: any[]=[];
  hidecomponent: boolean=false;
  animationVar: any;
  JobActionServiceSubscription: Subscription;
  candidateId: string;
  WorkFlowStageId: string;
  EmailId: string;
  jobId: string;
  resetComponent: Subject<any> = new Subject<any>();
  public isChecklist:Boolean=true;
  public searchVal: string = '';
  public pagesize:any=200;
  public pagneNo:any=1;
  public sortingValue:any='Name,asc';
  checkListView: any;
  searchTextTag;
  checklistId: number = 0;
  WorkFlowStageName: string;
  CandidateName: string;
  @Input() JobName:string;
  dirctionalLang:string;
  WorkFlowId: string;
  WorkFlowName: string;
  TotalChecklistSum: number = 0;
  TotalMandatoryChecklistSum: number=0;
  TotalPendingSum: number = 0;
  TotalMandatoryPendingSum: number=0;
  panelOpenState = false;
  checkListSingleDownload: any=[];
  checkListGroupDownload:any=[];
  checkListSingleUpload: any=[];
  checkListGroupUpload: any=[];
  CandidateJobActionSubscription: Subscription;
  candidateIdIdUnique:string='00000000-0000-0000-0000-000000000000';
  public checkListResult = {
    JobName: '',
    Action: 'OPEN',  //DISMISS
    Source:''
  }
  constructor(private quickJobService: QuickJobService,public _sidebarService: SidebarService, private snackBService: SnackBarService, private routes: ActivatedRoute,
    private translateService: TranslateService,public _userpreferencesService: UserpreferencesService,private _commonserviceService: CommonserviceService,
    private jobService: JobService,public dialog: MatDialog,public dialogRef: MatDialogRef<ChecklistComponent>,@Inject(MAT_DIALOG_DATA) public checkListData: any) { 
      if(checkListData && checkListData!==undefined){
        this.checkListResult=checkListData.checkListData;
      }
    }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.animationVar = ButtonTypes;
    this.routes.queryParams.subscribe((parmsValue) => {
         this.jobId = parmsValue.jobId;
          
      });

    this.JobActionServiceSubscription = this._commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
      let candidateList = res?.SelectedCandidate;
      if (candidateList?.length > 0) {
        this.candidateId = candidateList[0]?.CandidateId;
        this.CandidateName = candidateList[0]?.CandidateName;
        this.WorkFlowStageId= candidateList[0]?.WorkFlowStageId;
        this.WorkFlowStageName= candidateList[0]?.WorkFlowStageName;
        this.WorkFlowId= candidateList[0]?.WorkFlowId;
        this.WorkFlowName= candidateList[0]?.WorkFlowName;
        this.EmailId= candidateList[0]?.EmailId;
        if(this.candidateIdIdUnique!=this.candidateId){
          this.getCandidateJobAction(); 
          this.candidateIdIdUnique=this.candidateId;
        }
               
      }
    });
  }
  /*
   @Type: File, <ts>
   @Name: getCandidateJobAction function
   @Who: Nitin Bhati
   @When: 11-sep-2023
   @Why: EWM-13985
   @What: service call for candidate job action
   */
   getCandidateJobAction() {
    this.loading = true;
    this.CandidateJobActionSubscription = this.quickJobService.getCandidateJobAction_v2("?jobId="+this.jobId + '&stageid='+this.WorkFlowStageId + '&candidateid='+this.candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.WorkflowChecklistData = repsonsedata.Data;
          this.TotalChecklistSum= 0;
          this.TotalMandatoryChecklistSum= 0;
          this.TotalPendingSum= 0;
          this.TotalMandatoryPendingSum=0;
          //this.WorkflowChecklistData.forEach(a => this.TotalChecklistSum += a.TotalChecklistCount);
          //this.WorkflowChecklistData.forEach(a => this.TotalPendingSum += a.TotalChecklistPendingCount);
          //Who:Ankit Rawat, What:EWM-17469 Add pending mandatory on header, When:09Jul24
          this.WorkflowChecklistData.forEach(a => this.TotalMandatoryChecklistSum += a.TotalMandatoryChecklistCount);
          this.WorkflowChecklistData.forEach(a => this.TotalMandatoryPendingSum += a.TotalMandatoryChecklistPendingCount);
           } else if(repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /*
  @Name: checkListOpen function
  @Who: Nitin Bhati
  @When: 11-sep-2023
  @Why: EWM-13985
  @What: on Workflow  checklist click
*/
checkListOpen(list:any,isEditable:boolean,index:number){
this.indexExpanded =  index;
this.checkListStatus=true;
this.checklistType=list;
this.isEditable=isEditable;
  this._commonserviceService.checklistServiceObs.next(list);
  this.checklistId = list?.Id;
}

open(panel: MatExpansionPanel) {
  panel._body.nativeElement
     .scrollIntoView({ behavior: 'smooth' });
}
/*
@Name: documentDataFetchFromChild function
@Who: Nitin Bhati
@When: 23-Sep-2023
@Why: EWM-9456
@What: for getting checklist saved Data
*/
documentDataFetchFromChild(checkList:any){
  this.checkListStatus=false;
  //this.checklistData=checkList;
  this.isChecklist=true;
  this.panelOpenState = false;
  this.getChecklistCount();
  }
/*
@Name: mapChecklistAsDocument function
@Who: Renu
@When: 15-Oct-2022
@Why: EWM-8801 EWM-9167
@What: formapping  checklist  Data with document
*/
mapChecklistAsDocument(checkListInfo:any){
  this.checkListSingleUpload=checkListInfo?.ChecklistDetails?.SingleCheckList;
  this.checkListGroupUpload=checkListInfo?.ChecklistDetails?.GroupCheckList;
  const dialogRef = this.dialog.open(UploadDocumentChecklistComponent, {
    data:{docRequiredStatus:true,openDocumentPopUpFor:'Candidate','documentData':{'Name':checkListInfo?.Name}},
    panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
  if(dialogResult?.res==true){
    let res=dialogResult.value;
    let checklistName=checkListInfo?.Name;
    let checklistType=checkListInfo?.ChecklistType;
    let checkListId=checkListInfo?.Id;
    this.getMappedChecklistInfo(checklistType,checklistName,res,checkListId)
    
  }    
  })
}

getMappedChecklistInfo(checklistType,checklistName,res,id){
  let docObj={};
  docObj['CategoryId']=res?.CategoryId;
  docObj['Category']=res?.Category;
  docObj['DocumentId']=res?.DocumentId;
  docObj['DocumentName']=res?.DocumentName;
  docObj['ReferenceId']=res?.ReferenceId;
  docObj['StartDate']=res?.StartDate;
  docObj['ExpiryDate']=res?.ExpiryDate;
  docObj['Comment']=res?.Comment;
  docObj['ChecklistId']=id;
  docObj['ChecklistName']=checklistName;
  docObj['Name']=checklistName;
  docObj['UserTypeId']=this.candidateId;
  docObj['PageName']='candidate';
  docObj['BtnId']='attachments-tab';
  let checkList={};
  checkList['ChecklistName']=checklistName;
  checkList['JobTitle']=this.JobName;
  checkList['CandidateName']=this.CandidateName;
  checkList['WorkflowName']=this.WorkFlowName;
  checkList['StageName']=this.WorkFlowStageName;
  checkList['CreatedBy']='';
  checkList['OrgLogo']=localStorage.getItem('LogoUrl');
  checkList['ChecklistType']=checklistType; 
  let SingleObj=[];
  let GroupObj=[];
  if(checklistType=='Single')
  {
    this.checkListSingleUpload?.forEach((element:any,i)=>{
      SingleObj.push({
        Id:element?.Id,
        QstId:element?.QstId,
        TaskName:element?.TaskName,
        Comments:element?.Comments,
        Status:element?.Status,
        StatusName:element?.Status==1?'Completed':'Pending',
        Files:element?.Files,
      })
    });
    checkList['TasksList']=[{
      'SingleCheckList':SingleObj,
      'GroupCheckList':null
    }];
  } else if(checklistType=='Group'){
      this.checkListGroupUpload?.forEach((element:any,i)=>{
        GroupObj.push({
          CheckListName:element?.CheckListName,
          CheckListQst:element?.CheckListQst,
        })
        element?.CheckListQst?.forEach((x:any,i)=>{
          x['StatusName'] = x?.Status==1?'Completed':'Pending';
        })
      });
      checkList['TasksList']=[{
        'SingleCheckList':null,
        'GroupCheckList':GroupObj
      }];
    }
  docObj['Checklist']=checkList;
  this.loading=true;
  this.jobService.mapChecklistDocument(docObj).subscribe(
    (repsonsedata:ResponceData)=>{
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading=false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);

      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })

}

/*
@Name: dowLoadCheckList function
@Who: Nitin Bhati
  @When: 17-sep-2023
  @Why: EWM-11785
@What: for Workflow  checklist download into pdf
*/
dowLoadCheckList(checkList:any){
  this.checkListSingleDownload=checkList?.ChecklistDetails?.SingleCheckList;
  this.checkListGroupDownload=checkList?.ChecklistDetails?.GroupCheckList;
  let checklistName=checkList?.Name;
  let checklistType=checkList?.ChecklistType;
  this.getDownLoadInfo(checklistType,checklistName); 
  }

  getDownLoadInfo(checklistType:string,checklistName:string){
    let downloadObj={};
    downloadObj['ChecklistName']=checklistName;
    downloadObj['JobTitle']=this.JobName;
    downloadObj['CandidateName']=this.CandidateName;
    downloadObj['WorkflowName']=this.WorkFlowName;
    downloadObj['StageName']=this.WorkFlowStageName;
    downloadObj['CreatedBy']='';
    downloadObj['OrgLogo']=localStorage.getItem('LogoUrl');
    downloadObj['ChecklistType']=checklistType;
    let SingleObj=[];
    let GroupObj=[];
    if(checklistType=='Single')
    {
      this.checkListSingleDownload?.forEach((element:any,i)=>{
        SingleObj.push({
          Id:element?.Id,
          QstId:element?.QstId,
          TaskName:element?.TaskName,
          Comments:element?.Comments,
          Status:element?.Status,
          StatusName:element?.Status==1?'Completed':'Pending',
          Files:element?.Files,
        })
      });
      downloadObj['TasksList']=[{
        'SingleCheckList':SingleObj,
        'GroupCheckList':null
      }];
    }else if(checklistType=='Group'){
      this.checkListGroupDownload.forEach((element:any,i)=>{
        GroupObj.push({
          CheckListName:element?.CheckListName,
          CheckListQst:element?.CheckListQst,
        })

        element?.CheckListQst.forEach((x:any,i)=>{
          x['StatusName'] = x?.Status==1?'Completed':'Pending';
        })
      });
      downloadObj['TasksList']=[{
        'SingleCheckList':null,
        'GroupCheckList':GroupObj
      }];
    }
      this.loading=true;
      this.jobService.downloadCheckList(downloadObj).subscribe(
        (data:any)=>{
        const fileExt=fileExtention[data.type];
        let fileName=(this.checklistType?.Name)?(this.checklistType?.Name):checklistName+'.'+fileExt;
        this.loading=false;
        this.downloadFile(data,fileName);
        }
      );
    } 
    
    /*
@Name: downloadFile function
@Who: Nitin Bhati
@When: 17-sep-2023
@Why: EWM-11785
@What: for Workflow  checklist download into pdf
*/
private downloadFile(data,filename) {
  const downloadedFile = new Blob([data], { type: data.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.download = filename;
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.click();
  document.body.removeChild(a);
}


/*
    @Type: File, <ts>
    @Name: openMapChecklistModule
    @Who: Nitin Bhati
    @When: 15-09-2023
    @Why: EWM-12599,EWM-13985
    @What: for open add checklist map
    */
    openMapChecklistModule() {
        const dialogRef = this.dialog.open(AddMapChecklistComponent, {
          data: { ChecklistArray: this.WorkflowChecklistData,candidateId:this.candidateId,WorkFlowId:this.WorkFlowId,WorkFlowName:this.WorkFlowName,WorkFlowStageId:this.WorkFlowStageId,WorkFlowStageName:this.WorkFlowStageName,jobId:this.jobId },
          panelClass: ['xeople-modal-lg', 'add-assessment-modal', 'uploadNewResume', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }
        dialogRef.afterClosed().subscribe(resData => {
          if (resData.res == true) {
             this.getCandidateJobAction();       
          }         
        })          
    }

    ngOnDestroy(): void {
      this.CandidateJobActionSubscription?.unsubscribe();
    }

    onDismiss(): void {
      this.checkListResult.Action='DISMISS';
      this.dialogRef.close(this.checkListResult);
    }

    /*
    @Type: File, <ts>
    @Name: getChecklistCount
    @Who: Ankit Rawat
    @When: 18Jul24
    @Why: EWM-17469
    @What: Bind Pending and mandatory checklist count on header
    */
    
    getChecklistCount() {
      this.loading = true;
      this.CandidateJobActionSubscription = this.quickJobService.getCandidateJobAction_v2("?jobId="+this.jobId + '&stageid='+this.WorkFlowStageId + '&candidateid='+this.candidateId).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata['HttpStatusCode'] == '200') {
            this.loading = false;
            let ChecklistDetails=repsonsedata.Data;
            this.TotalChecklistSum= 0;
            this.TotalMandatoryChecklistSum= 0;
            this.TotalPendingSum= 0;
            this.TotalMandatoryPendingSum=0;
            //Who:Ankit Rawat, What:EWM-17469 Add pending mandatory on header, When:09Jul24
            ChecklistDetails.forEach(a => this.TotalMandatoryChecklistSum += a.TotalMandatoryChecklistCount);
            ChecklistDetails.forEach(a => this.TotalMandatoryPendingSum += a.TotalMandatoryChecklistPendingCount);
            ChecklistDetails.forEach(chklistDetails => {
              const item = this.WorkflowChecklistData.find(workFlowData => workFlowData.Id === chklistDetails.Id);
              if (item) {
                item.Status = chklistDetails.Status;
                item.CompletedDate=chklistDetails.CompletedDate;
              }
            });
             } 
             else if(repsonsedata['HttpStatusCode'] == '204') {
                this.loading = false;
            //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
              }
        }, err => {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

}
