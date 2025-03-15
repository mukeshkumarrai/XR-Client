import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { jobWorkFlow } from 'src/app/modules/EWM.core/shared/datamodels/jobworkflow';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { ButtonTypes, ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-add-map-checklist',
  templateUrl: './add-map-checklist.component.html',
  styleUrls: ['./add-map-checklist.component.scss']
})
export class AddMapChecklistComponent implements OnInit {

  public loading:boolean = false;
  public gridView:any;
  public maxCharacterLength=150;
  public totalDataCount:any;
  public searchVal: string = '';
  public pagesize:any;
  public pagneNo:any;
  public sortingValue:any='Name,asc';
  public canLoad = false;
  public pendingLoad = false;
  public inputArray:any=[];
  public isDelete:any;
  public loadingSearch:boolean = false;
  public filterConfig: any=0;
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public perWorkflowMapMaxChecklist:number = 15;
  public newArray:any=[];
  workflowId: string;
  WorkFlowName: string;
  WorkFlowStageId: string;
  jobId: string;
  candidateIdData: string;
  WorkFlowStageName: string;
  animationVar : any;
  searchSubject$ = new Subject<any>();
    constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<AddMapChecklistComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
     private translateService: TranslateService,private jobWorkflowService: JobService,private serviceListClass: ServiceListClass,
     private snackBService: SnackBarService, private appSettingsService: AppSettingsService,private quickJobService: QuickJobService) {
      // page option from config file    
      this.pagneNo = this.appSettingsService.pageOption;
      this.pagesize = this.appSettingsService.pagesize;
     this.perWorkflowMapMaxChecklist = this.appSettingsService?.perWorkflowMapMaxChecklist;
        if(data?.ChecklistArray!=undefined){
          this.newArray = JSON.parse(JSON.stringify(this.data?.ChecklistArray));
          this.inputArray = data?.ChecklistArray;
          this.candidateIdData = data?.candidateId;
          this.WorkFlowStageId= data?.WorkFlowStageId;
          this.WorkFlowStageName= data?.WorkFlowStageName;
          this.workflowId= data?.WorkFlowId;
          this.WorkFlowName= data?.WorkFlowName;
		      this.jobId= data?.jobId;
        }
       }
  
    ngOnInit(): void {
      this.animationVar = ButtonTypes;
      this.fetchworkflowchecklistRecord(this.sortingValue,this.searchVal);
      setInterval(() => {
        this.canLoad = true;
        if (this.pendingLoad) {
          this.onScrollDown();
        }
      }, 2000);

      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        //this.loadingSearch = true;
        this.pagneNo=1;
        this.fetchworkflowchecklistRecord(this.sortingValue,val);
         });
    }
  
    onDismiss()
    {    
      document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close({res:false}); }, 200);
    }
  
    onSave(){
       let selectedArray=[];
      this.inputArray.forEach(res => {
         selectedArray.push({
          ChecklistId: Number(res.Id),
          ChecklistName: res.Name,
          ChecklistType: res.ChecklistType,
          IsSelected: Number(1)
        });
      });
      this.UpdateMapTagList(selectedArray);     
    }
    
     /*
    @Type: File, <ts>
    @Name: UpdateMapTagList function
    @Who: Nitin Bhati
    @When: 17-Sep-2023
    @Why: EWM-11785
    @What:update workflow checklist list
    */
    UpdateMapTagList(selectedChecklist) {
      //this.loading = true;
      let UpdateObj = {};
      UpdateObj['WorkflowId'] = this.workflowId,
      UpdateObj['WorkflowName'] = this.WorkFlowName,
      UpdateObj['StageId'] = this.WorkFlowStageId,
      UpdateObj['StageName'] = this.WorkFlowStageName,
      UpdateObj['Checklists'] = selectedChecklist,
      UpdateObj['JobId'] = this.jobId,
      UpdateObj['CandidateId'] = this.candidateIdData
      this.quickJobService.updateMapChecklistWorkflowstage(UpdateObj).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
            document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close({res:true,inputArray:this.inputArray}); }, 200);
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
  
       /*
      @Type: File, <ts>
      @Name: fetchworkflowchecklistRecord
      @Who: Nitin Bhati
      @When: 17-Sep-2023
      @Why: EWM-11785
      @What: To get more data from server on page scroll.
     */
    fetchworkflowchecklistRecord(sortingValue,searchval) { 
      this.loading=true;
      this.jobWorkflowService.getGroupChecklistListDetailsByPassPaging(sortingValue,this.searchVal).subscribe(
        (repsonsedata: jobWorkFlow) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            this.loadingSearch = false;
            this.gridView = repsonsedata.Data;
            this.gridView.forEach(element => {
              element['isDelete'] = 0;
            });         
            this.totalDataCount = repsonsedata.TotalRecord;      
          }else if (repsonsedata.HttpStatusCode === 204) {
            this.loading = false;
            this.loadingSearch = false;
            this.gridView = [];         
            this.totalDataCount = repsonsedata.TotalRecord;      
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
            this.loadingSearch = false;
          }
        }, err => {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }
  
  
      /*
    @Type: File, <ts>
    @Name: onScrollDown
    @Who: Nitin Bhati
    @When: 17-Sep-2023
    @Why: EWM-11785
    @What: To add data on page scroll.
    */
    onScrollUp(){
    }
   onScrollDown() {
    this.loading = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridView.length) {     
        this.pagneNo = this.pagneNo + 1;
        this.fetchworkflowchecklistMoreRecord(this.sortingValue);
      } else {
        this.loading = false;
      }
    } else {
      this.loading = false;
      this.pendingLoad = true;
    }
  }
  
  
  addItem(addChecklistData){  
  const data =  this.inputArray.filter(x => x['Id'] == addChecklistData.Id);
  if(data==''){
      this.inputArray.push({
       Id: Number(addChecklistData.Id),
       Name: addChecklistData.Name,
       ChecklistType: addChecklistData.Type
     });
   
   // this.inputArray.push(addChecklistData);
  }
  addChecklistData.isDelete=1; 
  }
  
  deleteItem(addChecklistData){
    const index = this.inputArray.findIndex(x => x.Id == addChecklistData.Id);
    if (index !== -1) {
    this.inputArray.splice(index, 1);
    }
  
    this.inputArray.forEach(x=>{
      if(x.Id==addChecklistData.Id)
      {
        x.isDelete=0;
      }
    });
    //console.log(this.inputArray,"this.inputArray ");
  }
  
  
  public onFilterClear(): void {
    this.searchVal='';
    this.fetchworkflowchecklistRecord(this.sortingValue,this.searchVal);
  }
  
  
  /*
  @Name: onFilter function
  @Who: Nitin Bhati
  @When: 17-Sep-2023
  @Why: EWM-11785
  @What: use for Searching records
  */
  public onFilter(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
    //this.pagneNo = 1;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    //this.fetchworkflowchecklistRecord(this.pagesize,this.pagneNo, this.sortingValue); 
    this.searchSubject$.next(inputValue);
    
  }
  
/*
   @Type: File, <ts>
   @Name: fetchworkflowchecklistMoreRecord
   @Who: Nitin Bhati
    @When: 17-Sep-2023
    @Why: EWM-11785
   @What: To get more data from server on page scroll.
   */
  
  fetchworkflowchecklistMoreRecord(sortingValue) {  
    this.jobWorkflowService.getGroupChecklistListDetailsByPassPaging(sortingValue,this.searchVal).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          if (repsonsedata.Data) {;
            let nextgridView: any = [];
            nextgridView = repsonsedata.Data;
            this.gridView = this.gridView.concat(nextgridView); 
            this.gridView.forEach(element => {
              element['isDelete'] = 0;
            });           
            this.totalDataCount = repsonsedata.TotalRecord;      
          }
  
        } else if(repsonsedata.HttpStatusCode === 204) {
          this.loading = false; 
          this.loadingSearch = false;       
          this.gridView=[];  
          this.totalDataCount = repsonsedata.TotalRecord;          
          } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  
  
  getCurrentStatus(addChecklistData){
   let selectedArray =  this.inputArray?.filter(x => x['Id'] === addChecklistData.Id);
   if(selectedArray!=''){   
   addChecklistData.isDelete=1; 
   }else{
    addChecklistData.isDelete=0;
   }
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

}
