import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadsService } from '@app/modules/EWM.core/shared/services/leads/leads.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-view-lead-workflow-stages',
  templateUrl: './view-lead-workflow-stages.component.html',
  styleUrls: ['./view-lead-workflow-stages.component.scss']
})
export class ViewLeadWorkflowStagesComponent implements OnInit {
 
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
  
    constructor(public dialogRef: MatDialogRef<ViewLeadWorkflowStagesComponent>, private _LeadsService: LeadsService,
      public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private snackBService: SnackBarService,
      private translateService: TranslateService) {
      this.workflowId = data?.workflowId;
    }
  
    ngOnInit(): void {
        this.getWorkFlowStagesAll(this.workflowId);
    }
   onDismiss() {
      document.getElementsByClassName("workflow-sub-stages")[0].classList.remove("animate__zoomIn")
      document.getElementsByClassName("workflow-sub-stages")[0].classList.add("animate__zoomOut");
      setTimeout(() => { this.dialogRef.close(false); }, 200);
    }
  
   getWorkFlowStagesAll(WorkFlowId: any) {
    this.loading = true;
    this._LeadsService.getLeadWorkflowByID('?workflowId=' + WorkFlowId).subscribe(
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
