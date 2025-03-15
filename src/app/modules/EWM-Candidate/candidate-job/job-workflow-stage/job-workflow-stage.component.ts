import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { Color } from '@angular-material-components/color-picker';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { jobWorkFlow } from 'src/app/modules/EWM.core/shared/datamodels/jobworkflow';



@Component({
  selector: 'app-job-workflow-stage',
  templateUrl: './job-workflow-stage.component.html',
  styleUrls: ['./job-workflow-stage.component.scss']
})
export class JobWorkflowStageComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  JobWorkForm: FormGroup;
  public loading: boolean = false;
  public specialcharPattern = "[A-Za-z0-9- ]*$";
  public statusList: any = [];
  public primaryBgColor: string;
  public hideChildContent: boolean[] = [];
  public hideSubChildContent: boolean[] = [];
  public tempID: any;
  public jobid:any;
  public viewMode: any;
  public sampleArr: any = [];
  public editable: boolean = false;
  public submitted = false;
  public dataArr: any = []
  public updateArr: any = [];
  public disabled: boolean = false;
  public counter: number = 0;
  public mode: any;
  public parentDelArr = [];
  public childDelArr = [];
  public subChildArr = [];
  public nodes: any = [];
  public userAnimationStatus: boolean = true;
  sum: Array<number> = [0];
  cardJob: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private jobService: JobService,
  private snackBService: SnackBarService, private serviceListClass: ServiceListClass,private route: Router,
  public dialogRef: MatDialogRef<JobWorkflowStageComponent>, 
  private commonserviceService: CommonserviceService, public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
   private jobWorkflowService: JobService, @Inject(DOCUMENT) private document: HTMLDocument) {
    this.JobWorkForm = this.fb.group({
      Id: [''],
      workflowName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.specialcharPattern)]],
      Status: [[], [Validators.required]],
      DisplaySeq: [''],
      Stages: this.fb.array([])
    });
    this.primaryBgColor = localStorage.getItem('HeaderBackground');
    }

  ngOnInit(): void {
    //this.router.queryParams.subscribe(
    //  params => {
      //  if (params['id'] != undefined) {
          //this.editable = true;
          this.tempID = this.data.id;
         // this.jobid = params['jobid'];
         // this.cardJob = params['cardJob'];
          this.editForm(this.tempID);
        //}
      //  if (params['V'] != undefined) {
        //  this.viewMode = params['V'];
      //  }
        this.mode = this.data.mode
     // });
    if (this.mode == 'R') {
      this.JobWorkForm.controls['workflowName'].disable();
      this.JobWorkForm.controls['Status'].disable();
    } else {
      this.JobWorkForm.controls['workflowName'].enable();
      this.JobWorkForm.controls['Status'].enable();
    }
  }


    /*
@Type: File, <ts>
@Name: onDismiss function
@Who:  ANUP
@When: 01-oct-2021
@Why: EWM-2871 EWM-2974
@What: For cancel popup
*/
onDismiss(): void {
  document.getElementsByClassName("jobWorkFlowStageView")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("jobWorkFlowStageView")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}





 /* 
    @Type: File, <ts>
    @Name: workflowExists function
    @Who: Renu
    @When: 19-June-2021
    @Why: ROST-1871
    @What: For checking duplicacy for workflow
   */
  workflowExists() {
    let JobId;
    if (this.tempID != undefined) {
      JobId = this.tempID;
    } else {
      JobId = "";
    }
    if (this.JobWorkForm.get('workflowName').value == '') {
      return false;
    }
    let jsonExistObj = {};
    jsonExistObj['Id'] = JobId;
    jsonExistObj['WorkflowName'] = this.JobWorkForm.get('workflowName').value;
    this.jobWorkflowService.checkJobWorkFlowIsExists(jsonExistObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 400) {
          if (repsonsedata.Status == false) {
            this.JobWorkForm.get("workflowName").setErrors({ codeTaken: true });
            this.JobWorkForm.get("workflowName").markAsDirty();
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Status == true) {
            this.JobWorkForm.get("workflowName").clearValidators();
            this.JobWorkForm.get("workflowName").markAsPristine();
            this.JobWorkForm.get('workflowName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]);
            if (this.JobWorkForm && this.submitted == true) {
              if (this.tempID == undefined || this.tempID == null) {
                this.createJobWorkFlow(this.JobWorkForm.value);
              } else {
                this.updateJobWorkFlow(this.JobWorkForm.value);
              }
            }
          }
        }
        else {
          this.JobWorkForm.get("workflowName").clearValidators();
          this.JobWorkForm.get("workflowName").markAsPristine();
          this.JobWorkForm.get('workflowName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]);
        }
        // this.addJobForm.get('Name').updateValueAndValidity();
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }

  /* 
   @Type: File, <ts>
   @Name: editForm function
   @Who: Renu
   @When: 19-June-2021
   @Why: ROST-1634
   @What: For setting value in the edit form
  */

  editForm(Id: Number) {

    this.loading = true;
    this.jobWorkflowService.getJobWorkflowByID('?workflowId=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.dataArr = data.Data;
          //this.updateArr=data.Data;
          this.nodes.push({
            name: this.dataArr.WorkflowName,
            cssClass: 'ngx-org-workflow',
            title: '',
            childs: []
          })
          this.dataArr.Stages.forEach((x, i) => {
            this.nodes[0].childs.push({
              name: x.StageName,
              cssClass: 'ngx-org-parent',
              // title:x.StageDesc,
              // color:x.ColorCode,
              childs: []
            })
            this.dataArr.Stages[i].Stages.forEach((y, j) => {

              this.nodes[0].childs[i].childs.push({
                name: y.StageName,
                cssClass: 'ngx-org-child',
                // title:y.StageDesc,
                childs: []
              })
              this.dataArr.Stages[i].Stages[j].Stages.forEach((z, k) => {
                this.nodes[0].childs[i].childs[j].childs.push({
                  name: z.StageName,
                  cssClass: 'ngx-org-subChild',
                  // title:z.StageDesc
                })
              })
            })
          });
          this.JobWorkForm.patchValue({
            Id: this.dataArr.Id,
            workflowName: this.dataArr.WorkflowName,
            Status: this.dataArr.Status.toString()
          })
          const parentInfo = this.JobWorkForm.get('Stages') as FormArray;
          parentInfo.clear();
          this.dataArr.Stages.forEach((x, index) => {
            let tempP;
            if (x['ColorCode']) {
              tempP = this.hexToRgb(x['ColorCode']);
            } else {
              tempP = '';
            }
            parentInfo.push(
              this.fb.group({
                StageName: [x['StageName'], [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
                StageDesc: [x['StageDesc'], [Validators.maxLength(100)]],
                Active: Boolean(Number(x['Status'])),
                BuiltIn: Boolean(Number(x['IsBuiltIn'])),
                ColorCode: tempP ? new Color(tempP.r, tempP.g, tempP.b) : '',
                DisplaySeq: x['DisplaySeq'],
                JobPipeline: Boolean(Number(x['IsIncludeInPipeline'])),
                AutomatedActions: Boolean(Number(x['AutomatedActions'])),
                StageId: x['StageId'],
                InternalCode: x['InternalCode'],
                ParentStageId: x['ParentStageId'],
                IsDeleted: x['IsDeleted'],
                WorkflowInternalCode: x['WorkflowInternalCode'],
                Stages: this.fb.array([]),
                IsNew: [0]
              })
            );
            if (this.mode == 'R') {
              parentInfo.disable();
            }

            this.dataArr.Stages[index].Stages.forEach((y, j) => {
              let tempC;
              if (y['ColorCode']) {
                tempC = this.hexToRgb(y['ColorCode']);
              } else {
                tempC = '';
              }

              const childInfo = parentInfo.at(index).get('Stages') as FormArray;

              childInfo.push(
                this.fb.group({
                  StageName: [y['StageName'], [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
                  StageDesc: [y['StageDesc'], [Validators.maxLength(100)]],
                  Active: Boolean(Number(y['Status'])),
                  BuiltIn: Boolean(Number(y['IsBuiltIn'])),
                  ColorCode: tempC ? new Color(tempC.r, tempC.g, tempC.b) : '',
                  DisplaySeq: y['DisplaySeq'],
                  JobPipeline: Boolean(Number(y['IsIncludeInPipeline'])),
                  AutomatedActions: Boolean(Number(y['AutomatedActions'])),
                  StageId: y['StageId'],
                  InternalCode: y['InternalCode'],
                  ParentStageId: y['ParentStageId'],
                  IsDeleted: x['IsDeleted'],
                  IsNew: [0],
                  Stages: this.fb.array([]),
                })
              );
              if (this.mode == 'R') {
                childInfo.disable();
              }
              this.dataArr.Stages[index].Stages[j].Stages.forEach((z, k) => {
                const subchildInfo = childInfo.at(j).get('Stages') as FormArray;
                let tempS;
                if (z['ColorCode']) {
                  tempS = this.hexToRgb(z['ColorCode']);
                } else {
                  tempS = '';
                }
                subchildInfo.push(
                  this.fb.group({
                    StageName: [z['StageName'], [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
                    StageDesc: [z['StageDesc'], [Validators.maxLength(100)]],
                    Active: Boolean(Number(z['Status'])),
                    BuiltIn: Boolean(Number(z['IsBuiltIn'])),
                    DisplaySeq: y['DisplaySeq'],
                    ColorCode: tempS ? new Color(tempS.r, tempS.g, tempS.b) : '',
                    StageId: z['StageId'],
                    InternalCode: z['InternalCode'],
                    ParentStageId: z['ParentStageId'],
                    IsDeleted: x['IsDeleted'],
                    IsNew: [0],
                    JobPipeline: Boolean(Number(z['IsIncludeInPipeline'])),
                    AutomatedActions: Boolean(Number(z['AutomatedActions'])),
                  })
                );
                if (this.mode == 'R') {
                  subchildInfo.disable();
                }
              })
            })
          })

          this.JobWorkForm.patchValue(this.dataArr);

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

  /*
  @Type: File, <ts>
  @Name: hexToRgb
  @Who: Renu
  @When: 29-June-2021
  @Why: ROST-1871
  @What: TO CONVERT color to hex code 
  */
  hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  /*
   @Type: File, <ts>
   @Name: parentInfo
   @Who: Renu
   @When: 14-June-2021
   @Why: ROST-1871
   @What: for getting the formarray with this instance
   */

  parentInfo(): FormArray {
    return this.JobWorkForm.get("Stages") as FormArray
  }

  /*
    @Type: File, <ts>
    @Name: addParentStage
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: on add mulitple row
    */

  addParentStage(totalStage) {
    this.userAnimationStatus = true;
    this.parentInfo().push(this.createParent());
    setTimeout(() => {
      document.getElementById("addStage" + (totalStage + 1)).classList.add("animate__slideInRight");
    }, 0);

  }

  /*
   @Type: File, <ts>
   @Name: DeletedNode
   @Who: Renu
   @When: 15-june-2021
   @Why: ROST-1871
   @What: genric function to update the deleted record
   */
  deletedNodeUpdate(node) {
    node.forEach(function iter(a) {
      if (a.hasOwnProperty("IsDeleted")) {
        a.IsDeleted = "1";
      }
      Array.isArray(a.Stages) && a.Stages.forEach(iter);
    });
    return node;
  }

  /*
    @Type: File, <ts>
    @Name: removeParentRow
    @Who: Renu
    @When: 15-june-2021
    @Why: ROST-1586
    @What: for removing the single row
    */

  removeParentRow(index: number, IsNew: number) {
    if (IsNew !== 1) {
      this.parentDelArr.push(this.JobWorkForm.getRawValue()['Stages'][index]);
      this.deletedNodeUpdate(this.parentDelArr);
    }

    //  document.getElementsByClassName("deleteparent-" + index)[0].classList.remove("animate__slideInDown");
    //   document.getElementsByClassName("deleteparent-" + index)[0].classList.add("animate__slideOutLeft");
    setTimeout(() => {
      this.parentInfo().removeAt(index);
      //  this.JobWorkForm.value.Stages.push(arr);
    }, 200);
  }

  /*
   @Type: File, <ts>
   @Name: createParent
   @Who: Renu
   @When: 15-june-2021
   @Why: ROST-1586
   @What: for creating the single row
   */
  createParent() {
    return this.fb.group({
      StageName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
      StageDesc: ['', [Validators.maxLength(100)]],
      Active: [],
      BuiltIn: [],
      ColorCode: [],
      JobPipeline: [],
      DisplaySeq: [],
      StageId: [],
      InternalCode: [],
      ParentStageId: [],
      IsDeleted: [],
      WorkflowInternalCode: [],
      Stages: this.fb.array([]),
      IsNew: [1],
      AutomatedActions: []
    });

  }

  /*
   @Type: File, <ts>
   @Name: child
   @Who: Renu
   @When: 14-June-2021
   @Why: ROST-1871
   @What: for getting the formarray with this instance
   */

  childInfo(pi): FormArray {
    return (<FormArray>this.JobWorkForm.controls['Stages']).at(pi).get('Stages') as FormArray;
  }

  /*
    @Type: File, <ts>
    @Name: addChildStage
    @Who: Renu
    @When: 14-june-2021
    @Why: ROST-1871
    @What: on add mulitple row
    */

  addChildStage(j, totalChild) {
    this.userAnimationStatus = true;
    const control = (<FormArray>this.JobWorkForm.controls['Stages']).at(j).get('Stages') as FormArray;
    control.push(this.createChild());
    setTimeout(() => {
      document.getElementById("addChild" + j + (totalChild + 1)).classList.add("animate__slideInRight");
    }, 0);
  }

  /*
   @Type: File, <ts>
   @Name: removeChildRow
   @Who: Renu
   @When: 15-june-2021
   @Why: ROST-1586
   @What: for removing the single row
   */
  removeChildRow(pi: number, index: number, IsNew: number) {
    if (IsNew !== 1) {
      this.childDelArr.push(this.JobWorkForm.getRawValue()['Stages'][pi]['Stages'][index]);
      this.deletedNodeUpdate(this.childDelArr);
    }
    document.getElementsByClassName("deleteChild-" + pi + index)[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("deleteChild-" + pi + index)[0].classList.add("animate__slideOutLeft");
    setTimeout(() => {
      this.childInfo(pi).removeAt(index);
    }, 200);
  }


  /*
   @Type: File, <ts>
   @Name: createChild
   @Who: Renu
   @When: 15-june-2021
   @Why: ROST-1586
   @What: for adding the single row
   */
  createChild() {
    return this.fb.group({
      StageName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
      StageDesc: ['', [Validators.maxLength(100)]],
      Active: [],
      BuiltIn: [],
      ColorCode: [],
      JobPipeline: [],
      DisplaySeq: [],
      StageId: [],
      InternalCode: [],
      ParentStageId: [],
      IsNew: [1],
      AutomatedActions: [],
      Stages: this.fb.array([])
    });
  }

  /*
   @Type: File, <ts>
   @Name: subChildInfo
   @Who: Renu
   @When: 14-June-2021
   @Why: ROST-1871
   @What: for getting the formarray with this instance
   */

  subChildInfo(parentIndex, childIndex): FormArray {
    return ((<FormArray>this.JobWorkForm.controls['Stages']).at(parentIndex).get('Stages') as FormArray).at(childIndex).get('Stages') as FormArray;
  }

  /*
    @Type: File, <ts>
    @Name: addSubChildStage
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: on add mulitple row
    */

  addSubChildStage(pIndex, cIndex, totalSubChild) {
    this.userAnimationStatus = true;
    const control = ((<FormArray>this.JobWorkForm.controls['Stages']).at(pIndex).get('Stages') as FormArray).at(cIndex).get('Stages') as FormArray;
    control.push(this.createSubChild());
    setTimeout(() => {
      document.getElementById("addSubChild" + pIndex + cIndex + (totalSubChild + 1)).classList.add("animate__slideInRight");

    }, 0);
  }

  /*
   @Type: File, <ts>
   @Name: removeSubChildRow
   @Who: Renu
   @When: 15-june-2021
   @Why: ROST-1586
   @What: for removing the single row
   */
  removeSubChildRow(pIndex: number, cIndex: number, index: number, IsNew: number) {
    if (IsNew !== 1) {
      this.subChildArr.push(this.JobWorkForm.getRawValue()['Stages'][pIndex]['Stages'][cIndex]['Stages'][index]);
      this.deletedNodeUpdate(this.subChildArr);
    }
    document.getElementsByClassName("deleteSubChild-" + pIndex + cIndex + index)[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("deleteSubChild-" + pIndex + cIndex + index)[0].classList.add("animate__slideOutLeft");
    setTimeout(() => {
      this.subChildInfo(pIndex, cIndex).removeAt(index);
    }, 200);
  }

  /*
    @Type: File, <ts>
    @Name: createSubChild
    @Who: Renu
    @When: 15-June-2021
    @Why: ROST-1586
    @What: for adding the single row
    */
  createSubChild() {
    return this.fb.group({
      StageName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
      StageDesc: ['', [Validators.maxLength(100)]],
      Active: [],
      BuiltIn: [],
      ColorCode: [],
      JobPipeline: [],
      DisplaySeq: [],
      StageId: [],
      InternalCode: [],
      ParentStageId: [],
      isEditable: [],
      IsNew: [1],
      AutomatedActions: []
    });
  }

  /*
  @Type: File, <ts>
  @Name: editSubChildRow
  @Who: Renu
  @When: 15-June-2021
  @Why: ROST-1586
  @What: for adding the single row
  */
  editSubChildRow(subChild: FormGroup, i: number, j: number, k: number) {
    this.counter = this.counter + 1;
    //subChild.enable();
    if (subChild instanceof FormGroup) {
      const controls = (subChild as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].enable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-Subchild-' + i + j + k);
    elSave.classList.remove("hide");
    const elEdit = document.querySelector('#btnEdit-Subchild-' + i + j + k);
    elEdit.classList.add("hide");
    const elCancel = document.querySelector('#btnCancel-Subchild-' + i + j + k);
    elCancel.classList.remove("hide");
    const elRemove = document.querySelector('#btnRemove-Subchild-' + i + j + k);
    elRemove.classList.add("hide");
  }
  /*
    @Type: File, <ts>
    @Name: cancelSubChildRow
    @Who: Renu
    @When: 15-June-2021
    @Why: ROST-1586
    @What: for cancel the single row
    */
  saveSubChildRow(subChild: FormGroup, i: number, j: number, k: number) {
    this.counter = this.counter - 1;
    let pos = this.updateArr['Stages'][i]['Stages'][j]['Stages'].findIndex(P => P.StageId == subChild.value.StageId);
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['Active'] = subChild.value.Active == null ? '0' : subChild.value.Active;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['BuiltIn'] = subChild.value.BuiltIn == null ? '0' : subChild.value.BuiltIn;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['ColorCode'] = subChild.value.ColorCode;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['JobPipeline'] = subChild.value.JobPipeline == null ? '0' : subChild.value.JobPipeline;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['StageDesc'] = subChild.value.StageDesc;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['StageName'] = subChild.value.StageName;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['AutomatedActions'] = subChild.value.AutomatedActions;
    //subChild.disable();
    if (subChild instanceof FormGroup) {
      const controls = (subChild as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].disable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-Subchild-' + i + j + k);
    elSave.classList.add("hide");
    const elEdit = document.querySelector('#btnEdit-Subchild-' + i + j + k);
    elEdit.classList.remove("hide");
    const elCancel = document.querySelector('#btnCancel-Subchild-' + i + j + k);
    elCancel.classList.add("hide");
    const elRemove = document.querySelector('#btnRemove-Subchild-' + i + j + k);
    elRemove.classList.remove("hide");


  }

  /*
   @Type: File, <ts>
   @Name: cancelSubChildRow
   @Who: Renu
   @When: 15-June-2021
   @Why: ROST-1586
   @What: for cancel the single row
   */
  cancelSubChildRow(subChild: FormGroup, i: number, j: number, k: number) {
    //subChild.disable();

    if (subChild instanceof FormGroup) {
      const controls = (subChild as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].disable();
        } else {
        }
      }

    }
    const elSave = document.querySelector('#btnSave-Subchild-' + i + j + k);
    elSave.classList.add("hide");
    const elEdit = document.querySelector('#btnEdit-Subchild-' + i + j + k);
    elEdit.classList.remove("hide");
    const elCancel = document.querySelector('#btnCancel-Subchild-' + i + j + k);
    elCancel.classList.add("hide");
    const elRemove = document.querySelector('#btnRemove-Subchild-' + i + j + k);
    elRemove.classList.remove("hide");

  }
  /*
    @Type: File, <ts>
    @Name: editChildRow
    @Who: Renu
    @When: 15-June-2021
    @Why: ROST-1586
    @What: for editing the single row
    */
  editChildRow(Child: FormGroup, i: number, j: number) {
    this.counter = this.counter + 1;
    // Child.enable();
    // Child.controls['Stages'].disable();
    if (Child instanceof FormGroup) {
      const controls = (Child as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].enable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-child-' + i + j);
    elSave.classList.remove("hide");
    const elEdit = document.querySelector('#btnEdit-child-' + i + j);
    elEdit.classList.add("hide");
    const elCancel = document.querySelector('#btnCancel-child-' + i + j);
    elCancel.classList.remove("hide");
    const elRemove = document.querySelector('#btnRemove-child-' + i + j);
    elRemove.classList.add("hide");
    const elAdd = document.querySelector('#btnAdd-child-' + i + j);
    elAdd.classList.add("hide");

  }
  /*
    @Type: File, <ts>
    @Name: cancelChildRow
    @Who: Renu
    @When: 15-June-2021
    @Why: ROST-1586
    @What: for cancel the single row
    */
  cancelChildRow(Child: FormGroup, i: number, j: number) {
    // Child.disable();

    if (Child instanceof FormGroup) {
      const controls = (Child as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].disable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-child-' + i + j);
    elSave.classList.add("hide");
    const elEdit = document.querySelector('#btnEdit-child-' + i + j);
    elEdit.classList.remove("hide");
    const elCancel = document.querySelector('#btnCancel-child-' + i + j);
    elCancel.classList.add("hide");
    const elRemove = document.querySelector('#btnRemove-child-' + i + j);
    elRemove.classList.remove("hide");
    const elAdd = document.querySelector('#btnAdd-child-' + i + j);
    elAdd.classList.remove("hide");

  }

  /*
   @Type: File, <ts>
   @Name: saveChildRow
   @Who: Renu
   @When: 15-June-2021
   @Why: ROST-1586
   @What: for save the single row
   */
  saveChildRow(Child: FormGroup, i: number, j: number) {
    this.counter = this.counter - 1;
    let pos = this.updateArr['Stages'][i]['Stages'].findIndex(P => P.StageId == Child.value.StageId);
    this.updateArr['Stages'][i]['Stages'][pos]['Active'] = Child.value.Active == null ? '0' : Child.value.Active;
    this.updateArr['Stages'][i]['Stages'][pos]['BuiltIn'] = Child.value.BuiltIn == null ? '0' : Child.value.BuiltIn;
    this.updateArr['Stages'][i]['Stages'][pos]['ColorCode'] = Child.value.ColorCode;
    this.updateArr['Stages'][i]['Stages'][pos]['JobPipeline'] = Child.value.JobPipeline == null ? '0' : Child.value.JobPipeline;
    this.updateArr['Stages'][i]['Stages'][pos]['StageDesc'] = Child.value.StageDesc;
    this.updateArr['Stages'][i]['Stages'][pos]['StageName'] = Child.value.StageName;
    this.updateArr['Stages'][i]['Stages'][pos]['AutomatedActions'] = Child.value.AutomatedActions;

    //Child.disable();
    if (Child instanceof FormGroup) {
      const controls = (Child as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].disable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-child-' + i + j);
    elSave.classList.add("hide");
    const elEdit = document.querySelector('#btnEdit-child-' + i + j);
    elEdit.classList.remove("hide");
    const elCancel = document.querySelector('#btnCancel-child-' + i + j);
    elCancel.classList.add("hide");
    const elRemove = document.querySelector('#btnRemove-child-' + i + j);
    elRemove.classList.remove("hide");
    const elAdd = document.querySelector('#btnAdd-child-' + i + j);
    elAdd.classList.remove("hide");
  }
  /*
    @Type: File, <ts>
    @Name: editParentRow
    @Who: Renu
    @When: 15-June-2021
    @Why: ROST-1586
    @What: for edit the single row
    */
  editParentRow(parent: FormGroup, i: number) {
    this.counter = this.counter + 1;
    // parent.enable();
    // parent.controls['Stages'].disable();
    if (parent instanceof FormGroup) {
      const controls = (parent as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].enable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-parent-' + i);
    elSave.classList.remove("hide");
    const elEdit = document.querySelector('#btnEdit-parent-' + i);
    elEdit.classList.add("hide");
    const elCancel = document.querySelector('#btnCancel-parent-' + i);
    elCancel.classList.remove("hide");
    const elRemove = document.querySelector('#btnRemove-parent-' + i);
    elRemove.classList.add("hide");
    const elAdd = document.querySelector('#btnAdd-parent-' + i);
    elAdd.classList.add("hide");
  }
  /*
    @Type: File, <ts>
    @Name: SaveParentRow
    @Who: Renu
    @When: 15-June-2021
    @Why: ROST-1586
    @What: for saving the single row
    */
  SaveParentRow(parent: FormGroup, i: number) {
    this.counter = this.counter - 1;
    let pos = this.updateArr['Stages'].findIndex(P => P.StageId == parent.value.StageId);
    this.updateArr['Stages'][pos]['Active'] = parent.value.Active == null ? '0' : parent.value.Active;
    this.updateArr['Stages'][pos]['BuiltIn'] = parent.value.BuiltIn == null ? '0' : parent.value.BuiltIn;
    this.updateArr['Stages'][pos]['ColorCode'] = parent.value.ColorCode;
    this.updateArr['Stages'][pos]['JobPipeline'] = parent.value.JobPipeline == null ? '0' : parent.value.JobPipeline;
    this.updateArr['Stages'][pos]['StageDesc'] = parent.value.StageDesc;
    this.updateArr['Stages'][pos]['StageName'] = parent.value.StageName;
    this.updateArr['Stages'][pos]['AutomatedActions'] = parent.value.AutomatedActions;
    //parent.disable();
    if (parent instanceof FormGroup) {
      const controls = (parent as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].disable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-parent-' + i);
    elSave.classList.add("hide");
    const elEdit = document.querySelector('#btnEdit-parent-' + i);
    elEdit.classList.remove("hide");
    const elCancel = document.querySelector('#btnCancel-parent-' + i);
    elCancel.classList.add("hide");
    const elRemove = document.querySelector('#btnRemove-parent-' + i);
    elRemove.classList.remove("hide");
    const elAdd = document.querySelector('#btnAdd-parent-' + i);
    elAdd.classList.remove("hide");
  }
  /*
    @Type: File, <ts>
    @Name: cancelParentRow
    @Who: Renu
    @When: 15-June-2021
    @Why: ROST-1586
    @What: for cancel the single row
    */
  cancelParentRow(parent: FormGroup, i: number) {
    //parent.disable();

    if (parent instanceof FormGroup) {
      const controls = (parent as FormGroup).controls
      for (const name in controls) {
        if (name != 'Stages') {
          controls[name].disable();
        } else {
        }
      }
    }
    const elSave = document.querySelector('#btnSave-parent-' + i);
    elSave.classList.add("hide");
    const elEdit = document.querySelector('#btnEdit-parent-' + i);
    elEdit.classList.remove("hide");
    const elCancel = document.querySelector('#btnCancel-parent-' + i);
    elCancel.classList.add("hide");
    const elRemove = document.querySelector('#btnRemove-parent-' + i);
    elRemove.classList.remove("hide");
    const elAdd = document.querySelector('#btnAdd-parent-' + i);
    elAdd.classList.remove("hide");

  }
  /* 
   @Type: File, <ts>
   @Name: getStatusList function
   @Who: Renu
   @When: 14-June-2021
   @Why: ROST-1871
   @What: For status listing 
  */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /* 
    @Type: File, <ts>
    @Name: toggleParent function
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: For toggling data if child exists
   */

  toggleParent(index: any) {

    document.getElementsByClassName("childAnimation-" + index)[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("childAnimation-" + index)[0].classList.add("animate__slideOutUp");
    setTimeout(() => {
      this.hideChildContent[index] = !this.hideChildContent[index];
    }, 400);

  }
  /* 
    @Type: File, <ts>
    @Name: toggleChild function
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: For toggling data if subchild exists
   */
  toggleChild(pindex: any, cindex: any) {
    document.getElementsByClassName("subChildAnimation-" + pindex + cindex)[0].classList.remove("animate__slideInDown")
    document.getElementsByClassName("subChildAnimation-" + pindex + cindex)[0].classList.add("animate__slideOutUp");
    setTimeout(() => {
      this.hideSubChildContent[pindex + '.' + cindex] = !this.hideSubChildContent[pindex + '.' + cindex];
    }, 400);


  }

  /* 
    @Type: File, <ts>
    @Name: dropParent function
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: For drop parent data
   */
  dropParent(event: CdkDragDrop<string[]>) {
    let formArray;
    this.userAnimationStatus = false;
    formArray = this.JobWorkForm.get("Stages") as FormArray;
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.moveItemInFormArray(formArray, from, to);
  }

  /* 
    @Type: File, <ts>
    @Name: dropChild function
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: For drop child data
   */

  dropChild(event: CdkDragDrop<string[]>, cIndex: number) {
    this.userAnimationStatus = false;
    let formArray;
    formArray = (<FormArray>this.JobWorkForm.controls['Stages']).at(cIndex).get('Stages') as FormArray;
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.moveItemInFormArray(formArray, from, to);
  }

  /* 
    @Type: File, <ts>
    @Name: drop function
    @Who: Renu
    @When: 14-June-2021
    @Why: ROST-1871
    @What: For drop parent data
   */
  drop(event: CdkDragDrop<string[]>, pIndex: number, cIndex: number) {
    this.userAnimationStatus = false;
    let formArray;
    formArray = ((<FormArray>this.JobWorkForm.controls['Stages']).at(pIndex).get('Stages') as FormArray).at(cIndex).get('Stages') as FormArray;
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.moveItemInFormArray(formArray, from, to);
  }

  /**
  * Moves an item in a FormArray to another position.
  * @param formArray FormArray instance in which to move the item.
  * @param fromIndex Starting index of the item.
  * @param toIndex Index to which he item should be moved.
  */
  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): any {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);

    if (from === to) {
      return;
    }

    const previous = formArray.at(from);
    const current = formArray.at(to);
    formArray.setControl(to, previous);
    formArray.setControl(from, current);
  }

  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }
  /* 
   @Type: File, <ts>
   @Name: createJobWorkFlow function
   @Who: Renu
   @When: 14-June-2021
   @Why: ROST-1872
   @What: For saving job workflow data
  */

  createJobWorkFlow(value) {
    this.loading = true;
    let JsonObj = {};
    JsonObj['Id'] = value.Id;
    JsonObj['workflowName'] = value.workflowName;
    JsonObj['Status'] = parseInt(value.Status);
    let parentobj = [];
    value.Stages.forEach((x, pindex) => {
      parentobj.push({
        'StageName': x.StageName,
        'StagePublicName': x.StageName,
        'StageDesc': x.StageDesc,
        'IsIncludeInPipeline': Number(x.JobPipeline),
        'AutomatedActions': Number(x.AutomatedActions),
        'ColorCode': x.ColorCode ? '#' + x.ColorCode.hex : '',
        'IsBuiltIn': Number(x.BuiltIn),
        'Status': Number(x.Active),
        'Keyword': '',
        'IsEditable': 0,
        'DisplaySeq': Number(pindex + 1),
        'IsIncludeFixed': 0,
        'IsActiveFixed': 0,
        'NavigateURL': "",
        'Stages': null
      })
      JsonObj['Stages'] = parentobj;
      let childobj = [];
      value.Stages[pindex].Stages.forEach((y, cindex) => {
        childobj.push({
          'StageName': y.StageName,
          'StagePublicName': y.StageName,
          'StageDesc': y.StageDesc,
          'IsIncludeInPipeline': Number(y.JobPipeline),
          'AutomatedActions': Number(y.AutomatedActions),
          'ColorCode': y.ColorCode ? '#' + y.ColorCode?.hex : '',
          'IsBuiltIn': Number(y.BuiltIn),
          'Status': Number(y.Active),
          'Keyword': '',
          'IsEditable': 0,
          'DisplaySeq': Number(cindex + 1),
          'IsIncludeFixed': 0,
          'IsActiveFixed': 0,
          'NavigateURL': "",
          'Stages': null
        })

        parentobj[pindex]['Stages'] = childobj;

        let subChild = [];
        value.Stages[pindex].Stages[cindex].Stages.forEach((z, scindex) => {
          subChild.push({
            'StageName': z.StageName,
            'StagePublicName': z.StageName,
            'StageDesc': z.StageDesc,
            'IsIncludeInPipeline': Number(z.JobPipeline),
            'AutomatedActions': Number(z.AutomatedActions),
            'ColorCode': z.ColorCode ? '#' + z.ColorCode?.hex : '',
            'IsBuiltIn': Number(z.BuiltIn),
            'Status': Number(z.Active),
            'Keyword': '',
            'IsEditable': 0,
            'DisplaySeq': Number(scindex + 1),
            'IsIncludeFixed': 0,
            'IsActiveFixed': 0,
            'NavigateURL': ""
          })
          parentobj[pindex]['Stages'][cindex]['Stages'] = subChild;
        });
      });
    });
    this.jobWorkflowService.AddJobWorkflow(JsonObj).subscribe((repsonsedata: jobWorkFlow) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        //this.route.navigate(['./client/core/administrators/job-workflows'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['./client/core/administrators/job-workflows']);
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
 @Name: onSave function
 @Who: Renu
 @When: 14-June-2021
 @Why: ROST-1872
 @What: For saving job workflow data
*/

  onSave(value) {
    this.submitted = true;
    if (this.JobWorkForm.invalid) {
      return;
    }
    this.workflowExists();
  }

  /* 
   @Type: File, <ts>
   @Name: stageExists function
   @Who: Renu
   @When: 19-June-2021
   @Why: ROST-1872
   @What: For checking the stage duplicacy
  */
  stageExists(event, InternalCode, ParentStageId, formGroup: FormGroup) {
    let JobId;
    let parentId;
    if (this.tempID != undefined) {
      JobId = this.tempID;
    } else {
      JobId = "null";
    }
    if (ParentStageId == null) {
      parentId = "null";
    }
    else if (String(parseInt(ParentStageId)) == '0') {
      parentId = "null";
    } else {
      parentId = ParentStageId;
    }
    if (event.target.value == '') {
      return false;
    }

    let jsonExistObj = {};
    jsonExistObj['Id'] = InternalCode ? InternalCode : "null";
    jsonExistObj['WorkflowId'] = JobId;
    jsonExistObj['ParentId'] = parentId;
    jsonExistObj['StageName'] = event.target.value;
    this.jobWorkflowService.checkStageIsExists(jsonExistObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          if (repsonsedata.Status == true) {
            formGroup.get("StageName").setErrors({ stageTaken: true });
            formGroup.get("StageName").markAsDirty();
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Status == false) {
            formGroup.get("StageName").clearValidators();
            formGroup.get("StageName").markAsPristine();
            formGroup.get('StageName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]);

          }
        }
        else {
          formGroup.get("StageName").clearValidators();
          formGroup.get("StageName").markAsPristine();
          formGroup.get('StageName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]);
        }
        // this.addJobForm.get('Name').updateValueAndValidity();
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }


  /* 
  @Type: File, <ts>
  @Name: checkColorFormat function
  @Who: Renu
  @When: 14-June-2021
  @Why: ROST-1872
  @What: For checking color code format checkColorFormat
 */
  checkColorFormat(colorcode) {
    if (typeof colorcode === 'object' && colorcode !== null) {
      return '#' + colorcode?.hex;
    } else {
      return colorcode;
    }

  }

  /* 
  @Type: File, <ts>
  @Name: updateJobWorkFlow function
  @Who: Renu
  @When: 14-June-2021
  @Why: ROST-1872
  @What: For update job workflow data
 */

  updateJobWorkFlow(value) {
    let JsonObj = {};
    JsonObj['Id'] = value.Id;
    JsonObj['workflowName'] = value.workflowName;
    JsonObj['Status'] = parseInt(value.Status);
    let parentobj = [];
    this.parentDelArr.forEach(element => {
      value.Stages.push(element);
    });

    value.Stages.forEach((x, pindex) => {
      parentobj.push({
        'StageName': x.StageName,
        'StagePublicName': x.StageName,
        'StageDesc': x.StageDesc,
        'IsIncludeInPipeline': x.JobPipeline == null ? Number(0) : Number(x.JobPipeline),
        'AutomatedActions': x.AutomatedActions == null ? Number(0) : Number(x.AutomatedActions),
        'ColorCode': x.ColorCode ? this.checkColorFormat(x.ColorCode) : x.ColorCode,
        'IsBuiltIn': x.BuiltIn == null ? Number(0) : Number(x.BuiltIn),
        'Status': x.Active == null ? Number(0) : Number(x.Active),
        'Keyword': '',
        'IsEditable': 0,
        'DisplaySeq': Number(pindex + 1),
        'IsIncludeFixed': 0,
        'IsActiveFixed': 0,
        'NavigateURL': "",
        'IsDeleted': x.IsDeleted == null ? '0' : x.IsDeleted,
        "StageId": x.StageId == null ? Number(0) : x.StageId,
        "InternalCode": x.InternalCode,
        'WorkflowInternalCode': x.WorkflowInternalCode,
        'ParentStageId': x.ParentStageId,
        'Stages': null
      })
      JsonObj['Stages'] = parentobj;
      let childobj = [];
      this.childDelArr.forEach(element => {
        let parentId = element.ParentStageId;
        let Id = value.Stages[pindex].Stages.InternalCode;
        if (parentId == Id) {
          value.Stages[pindex].Stages.push(element);
        }
      });
      value.Stages[pindex].Stages.forEach((y, cindex) => {
        childobj.push({
          'StageName': y.StageName,
          'StagePublicName': x.StageName,
          'StageDesc': y.StageDesc,
          'IsIncludeInPipeline': y.JobPipeline == null ? Number(0) : Number(y.JobPipeline),
          'AutomatedActions': y.AutomatedActions == null ? Number(0) : Number(y.AutomatedActions),
          'ColorCode': y.ColorCode ? this.checkColorFormat(y.ColorCode) : y.ColorCode,
          'IsBuiltIn': y.BuiltIn == null ? Number(0) : Number(y.BuiltIn),
          'Status': y.Active == null ? Number(0) : Number(y.Active),
          'Keyword': '',
          'IsEditable': 0,
          'DisplaySeq': Number(cindex + 1),
          'IsIncludeFixed': 0,
          'IsActiveFixed': 0,
          'NavigateURL': "",
          'IsDeleted': y.IsDeleted == null ? '0' : y.IsDeleted,
          "StageId": y.StageId == null ? Number(0) : y.StageId,
          "InternalCode": y.InternalCode,
          'WorkflowInternalCode': y.WorkflowInternalCode,
          'ParentStageId': y.ParentStageId,
          'Stages': null
        })

        parentobj[pindex]['Stages'] = childobj;

        let subChild = [];
        this.subChildArr.forEach(element => {
          let parentId = element.ParentStageId;
          let Id = value.Stages[pindex].Stages[cindex].InternalCode;
          if (parentId == Id) {
            value.Stages[pindex].Stages[cindex].Stages.push(element);
          }
        });
        value.Stages[pindex].Stages[cindex].Stages.forEach((z, scindex) => {
          subChild.push({
            'StageName': z.StageName,
            'StagePublicName': x.StageName,
            'StageDesc': z.StageDesc,
            'IsIncludeInPipeline': z.JobPipeline == null ? Number(0) : Number(z.JobPipeline),
            'AutomatedActions': z.AutomatedActions == null ? Number(0) : Number(z.AutomatedActions),
            'ColorCode': z.ColorCode ? this.checkColorFormat(z.ColorCode) : z.ColorCode,
            'IsBuiltIn': z.BuiltIn == null ? Number(0) : Number(z.BuiltIn),
            'Status': z.Active == null ? Number(0) : Number(z.Active),
            'Keyword': '',
            'IsEditable': 0,
            'DisplaySeq': Number(scindex + 1),
            'IsIncludeFixed': 0,
            'IsActiveFixed': 0,
            'NavigateURL': "",
            'IsDeleted': z.IsDeleted == null ? '0' : z.IsDeleted,
            'StageId': z.StageId == null ? Number(0) : z.StageId,
            'InternalCode': z.InternalCode,
            'WorkflowInternalCode': z.WorkflowInternalCode,
            'ParentStageId': z.ParentStageId,
          })
          parentobj[pindex]['Stages'][cindex]['Stages'] = subChild;
        });
      });
    });

    this.jobWorkflowService.updateJobWorkflow(JsonObj).subscribe((repsonsedata: jobWorkFlow) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        //this.route.navigate(['./client/core/administrators/job-workflows'], { queryParams: { V: this.viewMode } });
        this.route.navigate(['./client/core/administrators/job-workflows']);
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
      @Name: confirmDialogParentRow function
      @Who: Renu
      @When: 07-july-2021
      @Why:EWM-1713
      @What: FOR DIALOG BOX confirmation for deletion of parent
    */

  confirmDialogParentRow(index: number, IsNew: number): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_stagedelete';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if (IsNew !== 1) {
          this.parentDelArr.push(this.JobWorkForm.getRawValue()['Stages'][index]);
          this.deletedNodeUpdate(this.parentDelArr);
        }
        document.getElementsByClassName("deleteparent-" + index)[0].classList.remove("animate__slideInDown");
        document.getElementsByClassName("deleteparent-" + index)[0].classList.add("animate__slideOutLeft");
        setTimeout(() => {
          this.parentInfo().removeAt(index);
        }, 200);
      }
    });
  }

  /*
  @Type: File, <ts>
  @Name: confirmDialogChildRow function
  @Who: Renu
  @When: 07-july-2021
  @Why:EWM-1713
  @What: FOR DIALOG BOX confirmation for deletion of child
*/
  confirmDialogChildRow(pi: number, index: number, IsNew: number): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_stagedelete';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if (IsNew !== 1) {
          this.childDelArr.push(this.JobWorkForm.getRawValue()['Stages'][pi]['Stages'][index]);
          this.deletedNodeUpdate(this.childDelArr);
        }
        document.getElementsByClassName("deleteChild-" + pi + index)[0].classList.remove("animate__slideInDown")
        document.getElementsByClassName("deleteChild-" + pi + index)[0].classList.add("animate__slideOutLeft");
        setTimeout(() => {
          this.childInfo(pi).removeAt(index);
        }, 200);
      }
    });
  }


  /*
  @Type: File, <ts>
  @Name: confirmDialogSubChildRow function
  @Who: Renu
  @When: 07-july-2021
  @Why:EWM-1713
  @What: FOR DIALOG BOX confirmation for deletion of sub child
*/

  confirmDialogSubChildRow(pIndex: number, cIndex: number, index: number, IsNew: number): void {
    const message = `label_titleDialogContent`;
    const title = '';
    const subTitle = 'label_stagedelete';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if (IsNew !== 1) {
          this.subChildArr.push(this.JobWorkForm.getRawValue()['Stages'][pIndex]['Stages'][cIndex]['Stages'][index]);
          this.deletedNodeUpdate(this.subChildArr);
        }
        document.getElementsByClassName("deleteSubChild-" + pIndex + cIndex + index)[0].classList.remove("animate__slideInDown")
        document.getElementsByClassName("deleteSubChild-" + pIndex + cIndex + index)[0].classList.add("animate__slideOutLeft");
        setTimeout(() => {
          this.subChildInfo(pIndex, cIndex).removeAt(index);
        }, 200);
      }
    });
  }

}
