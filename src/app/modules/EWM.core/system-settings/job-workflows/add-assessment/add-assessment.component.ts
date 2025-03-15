import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AssessmentInfoComponent } from '../../../job/Master/assessment/assessment-info/assessment-info.component';
import { customDropdownConfig } from '../../../shared/datamodels';
import { jobWorkFlow } from '../../../shared/datamodels/jobworkflow';
import { JobService } from '../../../shared/services/Job/job.service';
import { UserAdministrationService } from '../../../shared/services/user-administration/user-administration.service';

@Component({
  selector: 'app-add-assessment',
  templateUrl: './add-assessment.component.html',
  styleUrls: ['./add-assessment.component.scss']
})
export class AddAssessmentComponent implements OnInit {
public loading:boolean = false;
public gridView:any;
public maxCharacterLength=150;
public totalDataCount:any;
public searchVal: string = '';
public pagesize:any;
public pagneNo:any;
public sortingValue:any='Name';
public canLoad = false;
public pendingLoad = false;
public viewMode = 'cardMode';
public formtitle='grid';
public inputArray:any=[];
public isDelete:any;
public loadingSearch:boolean = false;
public filterConfig: any=0;
public GridId: string='Assessment_grid_001';
public dropDoneConfig: customDropdownConfig[] = [];
public selectedRelation: any = {};
public perWorkflowMapMaxAessment:number = 5;
public newArray:any=[];
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<AddAssessmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
   private translateService: TranslateService,private userAdministrationService: UserAdministrationService,private serviceListClass: ServiceListClass,
   private snackBService: SnackBarService, private appSettingsService: AppSettingsService) {
    // page option from config file    
    this.pagneNo = this.appSettingsService.pageOption;
    this.pagesize = this.appSettingsService.pagesize;
   this.perWorkflowMapMaxAessment = this.appSettingsService?.perWorkflowMapMaxAessment;
      this.dropDoneConfig['IsDisabled'] = false;
      this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getAssessmentRelatedTo;
      this.dropDoneConfig['placeholder'] = 'label_AssementRealtedTO';
      this.dropDoneConfig['searchEnable'] = true;
      this.dropDoneConfig['IsManage'] = '';
      this.dropDoneConfig['bindLabel'] = 'Name';
      this.dropDoneConfig['IsRequired'] = false;
      this.dropDoneConfig['clearable'] = true;

      if(data.AssessmentArray!=undefined){
        this.newArray = JSON.parse(JSON.stringify(this.data?.AssessmentArray));
        this.inputArray = data.AssessmentArray;
      }
     }

  ngOnInit(): void {
    this.fetchAssessmentRecord(this.pagesize,this.pagneNo,this.sortingValue);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
  }

  onDismiss()
  {    
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({res:false,inputArray:this.newArray}); }, 200);
  }

  onSave(){
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({res:true,inputArray:this.inputArray}); }, 200);
  }
  

     /*
    @Type: File, <ts>
    @Name: fetchAssessmentRecord
    @Who: Suika
    @When: 22-06-2022
    @Why: ROST-5334.EWM-7001
    @What: To get more data from server on page scroll.
   */
  fetchAssessmentRecord(pagesize,pagneNo,sortingValue) { 
    this.userAdministrationService.getAssessmentDetailsFilter(pagesize, pagneNo, sortingValue,this.searchVal,this.filterConfig).subscribe(
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
  @Who: Suika
  @When: 04-Jul-2022
  @Why: EWM-5334.EWM-7001
  @What: To add data on page scroll.
  */
  onScrollUp(){
    console.log("hi")
  }
 onScrollDown() {
  this.loading = true;
  if (this.canLoad) {
    this.canLoad = false;
    this.pendingLoad = false;
    if (this.totalDataCount > this.gridView.length) {     
      this.pagneNo = this.pagneNo + 1;
      this.fetchAssessmentMoreRecord(this.pagesize,this.pagneNo, this.sortingValue);
    } else {
      this.loading = false;
    }
  } else {
    this.loading = false;
    this.pendingLoad = true;
  }
}


addItem(assessmentData){  
const data =  this.inputArray.filter(x => x['Id'] == assessmentData.Id);
if(data==''){
  this.inputArray.push(assessmentData);
}
assessmentData.isDelete=1; 
}

deleteItem(assessmentData){
//  assessmentData.isDelete=0;
 // this.inputArray = this.inputArray.filter(x => x['Id'] != assessmentData.Id); 
  const index = this.inputArray.findIndex(x => x.Id == assessmentData.Id);
  if (index !== -1) {
  this.inputArray.splice(index, 1);
  }

  this.inputArray.forEach(x=>{
    if(x.Id==assessmentData.Id)
    {
      x.isDelete=0;
    }
  });
  //console.log(this.inputArray,"this.inputArray ");
}


public onFilterClear(): void {
  this.searchVal='';
  this.fetchAssessmentRecord(this.pagesize,this.pagneNo, this.sortingValue);
}


/*
@Name: onFilter function
@Who: suika
@When: 06-July-2022
@Why: EWM-5334/7001
@What: use for Searching records
*/
public onFilter(inputValue: string): void {
  this.loading = false;
  this.loadingSearch = true;
  this.pagneNo = 1;
  if (inputValue.length > 0 && inputValue.length < 3) {
    this.loadingSearch = false;
    return;
  }
  this.fetchAssessmentRecord(this.pagesize,this.pagneNo, this.sortingValue); 
}


  /* 
     @Type: File, <ts>
     @Name: onDesignationchange
     @Who: suika
     @When: 06-July-2022
     @Why: EWM-5334/7001
     @What: when Designation drop down changes 
   */
  onchange(data) {
    if(data!=undefined && data!=null && data!=''){   
     this.filterConfig = data.Id
     this.fetchAssessmentRecord(this.pagesize,this.pagneNo, this.sortingValue); 
     }else{ 
     this.filterConfig = 0; 
     this.fetchAssessmentRecord(this.pagesize,this.pagneNo, this.sortingValue); 
     }
   
    }

 
  /*
   @Type: File, <ts>
   @Name: getAssementInfo function
   @Who: Suika
   @When: 06-June-2022
   @Why: EWM-5335-EWM-7001
   @What: For setting value in the edit form
  */
 getAssementInfo(Id: Number) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(AssessmentInfoComponent, {
    data: new Object({ assessmentId: Id }),
    panelClass: ['xeople-modal', 'add_assInfo', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
  // console.log("res",res)
  })
  
}


  /*
 @Type: File, <ts>
 @Name: fetchAssessmentMoreRecord
 @Who: Suika
 @When: 08-Jul-2022
 @Why: ROST-5334,EWM-7001
 @What: To get more data from server on page scroll.
 */

fetchAssessmentMoreRecord(pagesize, pagneNo, sortingValue) {  
  this.userAdministrationService.getAssessmentDetailsFilter(pagesize, pagneNo, sortingValue,this.searchVal,this.filterConfig).subscribe(
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


getCurrentStatus(assessmentData){
 let selectedArray =  this.inputArray?.filter(x => x['Id'] === assessmentData.Id);
 if(selectedArray!=''){   
 assessmentData.isDelete=1; 
 }else{
  assessmentData.isDelete=0;
 }
}
}