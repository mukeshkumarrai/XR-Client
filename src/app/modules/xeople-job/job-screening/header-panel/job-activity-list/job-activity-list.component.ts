import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MarkDoneActivityComponent } from 'src/app/modules/EWM-Employee/employee-detail/employee-activity/mark-done-activity/mark-done-activity.component';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { Userpreferences } from 'src/app/shared/models';
import { GridState, JobScreening, candidateEntity } from 'src/app/shared/models/job-screening';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { JobActivityCreateComponent } from '../job-activity-create/job-activity-create.component';

@Component({
  selector: 'app-job-activity-list',
  templateUrl: './job-activity-list.component.html',
  styleUrls: ['./job-activity-list.component.scss']
})
export class JobActivityListComponent implements OnInit {
  gridList;
  loadingscroll:Boolean=false;
  eventFor: any;
  loading: boolean;
  candidateList:  Array<candidateEntity> = [];
  GridState: GridState;
  dataList: JobScreening;
  public userpreferences: Userpreferences;
  selectedItemListForActiveClass = null;
  public isReadMore: any[] = [false];
  activityActionForm = 'Edit';
  public timePeriod: any = 60;
  public calenderMode: number = 1;

  public utctimezonName: any = localStorage.getItem('UserTimezone');
  public timezonName: any = localStorage.getItem('UserTimezone');
  public activityId: number;
  public isSlotActive: boolean = false;
  public slotsData: any;
  activityObj = {};
  candidateId:string;
  public attendeesDataList: any[] = [];
  pagneNo: number;
  activityStatus: boolean=true;
  constructor(public dialogRef: MatDialogRef<JobActivityListComponent>,@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,private appSettingsService: AppSettingsService,
  private jobService:JobService,private _commonService: CommonserviceService,public _userpreferencesService: UserpreferencesService,public candidateService: CandidateService,private snackBService: SnackBarService,private translateService: TranslateService) { 
    this.eventFor=this.data?.eventFor;
    this.activityStatus=this.data?.activityStatus;
    this.userpreferences = this._userpreferencesService.getuserpreferences();
  }

  ngOnInit(): void {
    this._commonService.getJobScreeningInfo().subscribe((data: JobScreening) => {
     this.candidateList=data.CandidateList;
     this.GridState=data.GridState;
     this.dataList=data;
    })
    this.getcanJobActivities(this.eventFor);
  }
   /*
    @Type: File, <ts>
    @Name: getcanJobActivities function
    @Who: Renu
    @When: 26-May-2023
    @Why: EWM-11783 EWM-12522
    @What: get candidate Job avtivity details (completed/ total)
  */
    getcanJobActivities(eventFor:string){
      const formdata = {
        JobId: this.GridState?.JobId,
        PageNumber: this.GridState?.PageNumber,
        PageSize: this.GridState?.PageSize,
        EventFor: eventFor,
        CandidateId:this.candidateList.map(function(i) {
          return i['CandidateId'];
        }),
        WorkflowStageId:this.candidateList[0]?.WorkFlowStageId
      }
      this.jobService.getcanJobActivities(formdata).subscribe(
        (repsonsedata: ResponceData) => {        
          if (repsonsedata.HttpStatusCode === 200) {
             this.gridList=repsonsedata.Data;
            this.loading = false;
          } else if (repsonsedata.HttpStatusCode ===204) {
            
            this.loading = false;
          } else {
            //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            this.loading = false;
          }
        }, err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
            //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          }
        })
    }
 /*
     @Type: ondismiss()
     @Who: Renu
     @When: 24-May-2023
     @Why:  EWM-11781 EWM-12517
     @What: close popup on click cross button
   */

  /* @When: 12-06-2023 @who:Amit @what: class change */
     onDismiss(){
      document.getElementsByClassName("quick-modal-drawer")[0].classList.remove("animate__slideInRight")
      document.getElementsByClassName("quick-modal-drawer")[0].classList.add("animate__slideOutRight");
      setTimeout(()=>{this.dialogRef.close(false);}, 200);
    }

    /*
   @Type: File, <ts>
   @Name: createactivity function
   @Who: Adarsh singh
   @When: 26-June-2023
   @Why: EWM-11778 EWM-12850
   @What: create Activity
 */
   editActivity(activityId,edit,list) {
     const dialogRef = this.dialog.open(JobActivityCreateComponent, {
     data: {activityActionForm: this.activityActionForm, utctimezonName:this.utctimezonName,
       timezonName: this.timezonName, timePeriod: this.timePeriod, activityId: activityId, isSlotActive: this.isSlotActive,
       slotsData: this.slotsData,activityObj: list?.RelatedTo, candidateId: this.candidateId,syncCandidateAttendeeList:this.attendeesDataList},
     panelClass: ['xeople-drawer-lg', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(res => {
   })

 }


  /* 
  @Type: File, <ts>
  @Name: deleteActivity function 
  @Who: Nitin Bhati
  @When: 13-Jan-2022
  @Why: EWM-4545
  @What: call Api for delete record .
  */
  deleteActivity(val): void {
     const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'label_MenuActivity';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      maxWidth: "355px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.loading = true;
        let delObj = {};
        let relatedUserId:string;
           delObj = val;
          delObj["PageName"] = 'Candidate Screening';
          // delObj["AttendeesList"] = this.requiredAttendeesList;
          // relatedUserId = this.relatedUserJobId;
          delObj["RelatedUserId"] = relatedUserId;
          delObj["RelatedUserType"] = "JOB";
        this.candidateService.deleteActivityById(delObj).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata['HttpStatusCode'] == 200) {
              this.loading = false;
              this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
              this.pagneNo = 1;             
              this.getcanJobActivities(this.eventFor);
              } else {
              this.loading = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
            }
          }, err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

          })
      } else {
        // this.snackBService.showErrorSnackBar("not required on NO click", this.result);
      }
    });
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

  /*
    @Type: File, <ts>
    @Name: openQuickMarkDoneModal
    @Who: Nitin Bhati
    @When: 11-Aug-2021
    @Why: EWM-2424
    @What: to open quick Activity mark as done modal dialog
*/
openQuickMarkDoneModal(Id: any, remarkStatus: any, Remarks: any) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_markAsdone';
  const dialogRef = this.dialog.open(MarkDoneActivityComponent, {
    // maxWidth: "750px",
    // width: "90%",
    data: new Object({ editId: Id, remarkStatusId: remarkStatus, remarks: Remarks }),
    // maxHeight: "85%",
    panelClass: ['xeople-modal', 'add_Manage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    if (res == true) {
      //this.clientActivityCount.emit(true);
      this.getcanJobActivities(this.eventFor);
    } else {
      // this.generalLoader = false;
    }
  })
}

}






