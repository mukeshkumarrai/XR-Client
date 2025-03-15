import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobService } from '@app/modules/EWM.core/shared/services/Job/job.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-view-workflow-stages',
  templateUrl: './view-workflow-stages.component.html',
  styleUrls: ['./view-workflow-stages.component.scss']
})
export class ViewWorkflowStagesComponent implements OnInit {

  
nodes: any = [];
stageList: any;
workflowId: string;
stageId: string;
stagesList: any = [];
public selectjobcatparam: any = 'TotalJobs';
InternalCode: string;
loading: boolean;
jobId: string;
dataArr:any = [];
listData: any = [];

  constructor(public dialogRef: MatDialogRef<ViewWorkflowStagesComponent>, private jobService: JobService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService,
    private translateService: TranslateService) {
    this.stageList = data?.stageList;
    this.workflowId = data?.workflowId;
    this.stageId = data?.stageId;
    this.jobId = data?.jobId;
    data?.stageList ? this.InternalCode = data?.stageList[0].InternalCode: '';
  }

/*
  @Type: File, <ts>
  @Name: ngOnInit function
  @Who: Adarsh Singh
  @When: 04-Jan-2022
  @Why: EWM-10065
  @What: calling api on condition basis
*/
  ngOnInit(): void {
    if (this.data?.isParentStages) {
      this.getWorkFlowStagesAll(this.workflowId);
    }else{
      this.getWorkFlowSubStages();
    }
  }

/*
  @Type: File, <ts>
  @Name: onDismiss function
  @Who: Adarsh Singh
  @When: 12-July-2022
  @Why: EWM-10065
  @What: For close modal
*/
  onDismiss() {
    document.getElementsByClassName("workflow-sub-stages")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("workflow-sub-stages")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }

/*
  @Type: File, <ts>
  @Name: getWorkFlowStages function
  @Who: Adarsh Singh
  @When: 12-July-2022
  @Why: EWM-7751
  @What: For getting the stages basesd on workflowId
*/
  getWorkFlowSubStages() {
    this.loading = true;

    let IsJobid = '';

    if (this.jobId != null || this.jobId != undefined) {
      IsJobid = '?workflowId=' + this.workflowId + '&stageId=' + this.stageId + '&countfilter=' + this.selectjobcatparam + '&jobId=' + this.jobId
    } else {
      IsJobid = '?workflowId=' + this.workflowId + '&stageId=' + this.stageId + '&countfilter=' + this.selectjobcatparam
    }

    this.jobService.jobworkFlowChildById(IsJobid).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.listData = data.Data.Stages.filter(e => e.InternalCode == this.InternalCode);
          this.getStagesList();
          this.loading = false;
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

/*
  @Type: File, <ts>
  @Name: getStagesList function
  @Who: Adarsh Singh
  @When: 12-July-2022
  @Why: EWM-7751
  @What: For showing all satges on DOM
*/
  getStagesList() {
    if (this.data) {
      // this.nodes.push({
      //   name: this.stageList[0].StageName,
      //   cssClass: 'ngx-org-workflow',
      //   title: this.stageList[0].Count,
      //    image: this.stageList[0].ColorCodeUrl,
      //   childs: []
      // })

      let ForBlankColorCode = "https://res-dev-ewm.entiredev.in/EWM/RESOURCES/IMAGES/FFFFFF.PNG";
      this.listData.forEach((x, i) => {
        this.nodes.push({
          name: x.StageName,
          cssClass: 'ngx-org-parent',
          title: x.Count,
          color: x.ColorCode,
          image: x.ColorCodeUrl != undefined || null || '' ? x.ColorCodeUrl : ForBlankColorCode,
          childs: []
        })

        this.listData[i].Stages.forEach((y, j) => {
          this.nodes[0].childs.push({
            name: y.StageName,
            cssClass: 'ngx-org-child',
            title: y.Count,
            image: y.ColorCodeUrl != undefined || null || '' ? y.ColorCodeUrl : ForBlankColorCode,
            childs: []
          })
          this.listData[i].Stages[j].Stages.forEach((z, k) => {
            this.nodes[0].childs[j].childs.push({
              name: z.StageName,
              cssClass: 'ngx-org-subChild',
              image: z.ColorCodeUrl != undefined || null || '' ? z.ColorCodeUrl : ForBlankColorCode,
              title: z.Count
            })
          })
        })
      });
    }
  }

/* 
  @Type: File, <ts>
  @Name: getWorkFlowStagesAll function
  @Who: Adarsh singh
  @When: 04-Jan-23
  @Why: EWM-10065
  @What: For calling all stages api
*/
 getWorkFlowStagesAll(WorkFlowId: any) {
  this.loading = true;
  this.jobService.getJobWorkflowByID('?workflowId=' + WorkFlowId).subscribe(
    (data: ResponceData) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
        this.dataArr = data.Data;
        this.nodes.push({
          name: this.dataArr.WorkflowName,
          cssClass: 'ngx-org-workflow',
          title: '',
          image: this.dataArr?.ColorCodeUrl,
          childs: []
        })
        let ForBlankColorCode = "https://res-dev-ewm.entiredev.in/EWM/RESOURCES/IMAGES/FFFFFF.PNG";
        this.dataArr.Stages.forEach((x, i) => {
          this.nodes[0].childs.push({
            name: x.StageName,
            cssClass: 'ngx-org-parent',
            image: x.ColorCodeUrl != undefined || null || '' ? x.ColorCodeUrl : ForBlankColorCode,
            childs: []
          })
          this.dataArr.Stages[i].Stages.forEach((y, j) => {
            this.nodes[0].childs[i].childs.push({
              name: y.StageName,
              cssClass: 'ngx-org-child',
              // title:y.StageDesc,
              image: y.ColorCodeUrl != undefined || null || '' ? y.ColorCodeUrl : ForBlankColorCode,
              childs: []
            })
            this.dataArr.Stages[i].Stages[j].Stages.forEach((z, k) => {
              this.nodes[0].childs[i].childs[j].childs.push({
                name: z.StageName,
                cssClass: 'ngx-org-subChild',
                image: z.ColorCodeUrl != undefined || null || '' ? z.ColorCodeUrl : ForBlankColorCode,
                // title:z.StageDesc
              })
            })
          })
        });
      }
      else {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    },
    err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

}
