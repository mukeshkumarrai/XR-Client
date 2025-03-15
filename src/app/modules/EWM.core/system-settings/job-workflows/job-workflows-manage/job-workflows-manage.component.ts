/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: job-workflows-manage.component.ts
  @Who: Renu
  @When: 14-june-2021
  @Why: ROST-1871.
  @What: Job-workflow
 */

import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { jobWorkFlow } from '../../../shared/datamodels/jobworkflow';
import { JobService } from '../../../shared/services/Job/job.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { AddAssessmentComponent } from '../add-assessment/add-assessment.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { MapChecklistComponent } from '../map-checklist/map-checklist.component';
import { Industry } from '../../industry/model/industry';
import { QuickJobService } from '../../../shared/services/quickJob/quickJob.service';
@Component({
  selector: 'app-job-workflows-manage',
  templateUrl: './job-workflows-manage.component.html'
})
export class JobWorkflowsManageComponent implements OnInit {
  /**********************All generic variables declarations for accessing any where inside functions********/
  JobWorkForm: FormGroup;
  public loading: boolean = false;
  public specialcharPattern = "[A-Za-z0-9- ]*$";
  public statusList: any = [];
  public primaryBgColor: string;
  public stageBgColor: string = '#b6b6b6';
  public hideChildContent: boolean[] = [];
  public hideSubChildContent: boolean[] = [];
  public tempID: any;
  public jobid: any;
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
  public ActiveMenu: string;
  public selectedSubMenu: string;
  public sideBarMenu: string;
  stage;

  activestatus: string = 'Add';
  public assessmentIds: any;
  dirctionalLang;
  public AssessmentId: any;
  public ChecklistId:any;
  public checkList: any = [];
  public stageOneCheckList: any = [];
  public checkChildList: any = [];
  public checkSubchildList: any = [];
  public selectedCheckedFirstStage: any = [];
  checklistStatus: any[] = [];
  searchText: '';
  @ViewChild('levelThreeTrigger') levelThreeTrigger;
  @ViewChild('levelTwoTrigger') levelTwoTrigger;
  @ViewChild('levelOneTrigger') levelOneTrigger;
  isClone:boolean = false;
  @ViewChildren('mapWorkflowTrigger') trigger: QueryList<MatMenuTrigger>;
  @ViewChildren('stageTypeTrigger') stageTypeTrigger: QueryList<MatMenuTrigger>;
  industryInfo:any=[];
  JobTypeList: any;
  stageForm: FormGroup;
  public stageIndex: number;
  public searchTextTag:string;
  public stagesTagCopy:any= [];
  public fisrtStage: boolean=false;
  public lastStage: boolean=false;
  public stageTypeIndex: number;
  public eventType: String;
  public stagesTag:any=[];
  public selectedStage=[];
  public editStageTypeName :string;
 // @ViewChildren(MatMenuTrigger) trigger: QueryList<MatMenuTrigger>;
  // @ViewChild('menuSubChilds') menuSubChilds;
  @ViewChild(MatMenuTrigger) menuSubChilds: MatMenuTrigger;
  /*** @When: 14-03-2023 @Who:Renu @Why: EWM-10634 EWM-11123 @What: color picker **/
  showColorPallateContainer :boolean[]=[];
  showColorPallateContainerChild :boolean[]=[];
  showColorPallateContainerSubchild :boolean[]=[];
  selctedColor:any[] = ['#b6b6b6'];
  themeColors:[] = [];
  standardColor: [] = [];
  isMoreColorClicked!: boolean;
  color: any = '#2883e9'
  workflowUsed: boolean=false;
  // ewm-16752 variabel
  disabledSaveBtn:boolean=false;
  requiredStageType:boolean[] = [];
  stageName:string;
  addstage:boolean=true;
  indexNumber: number;
  public newSelectedStageTag=[];
  public stageType:string;  
  public deleteStageType:string;
  // end ewm-16752
  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Renu
  @When: 14-June-2021
  @Why: ROST-1871
  @What: For injection of service class and other dependencies
   */
  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private route: Router, private commonserviceService: CommonserviceService, private snackBService: SnackBarService,
    private jobWorkflowService: JobService, @Inject(DOCUMENT) private document: HTMLDocument, public dialog: MatDialog,
    public _sidebarService: SidebarService,private quickJobService: QuickJobService) {
    this.JobWorkForm = this.fb.group({
      Id: [''],
      workflowName: ['', [Validators.required, Validators.maxLength(100)]],//@who:priti;@why:EWM-3733;@when:13-dec-2021;@what:remove pattern validation 
      // workflowName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(this.specialcharPattern)]],
      Status: [1, [Validators.required]],
      DisplaySeq: [''],
      Stages: this.fb.array([]),
      Industry:[],
      jobType:[],
    });
    this.stageForm=this.fb.group({
      stageInfo: this.fb.array([this.createStages()],requireCheckboxesToBeCheckedValidator())
     })
    this.primaryBgColor = localStorage.getItem('HeaderBackground');
  }

  ngOnInit(): void {
    this.addstage=false;  
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this.ActiveMenu = URL_AS_LIST[3];
    this.sideBarMenu = this.ActiveMenu;
    this.selectedSubMenu = URL_AS_LIST[4];
    this._sidebarService.activesubMenuObs.next(this.selectedSubMenu);
    this._sidebarService.subManuGroup.next(this.sideBarMenu);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this._sidebarService.subManuGroupData.subscribe(value => {
      this.ActiveMenu = value;
    });
    this._sidebarService.activesubMenu.subscribe(value => {
      this.selectedSubMenu = value;
    });

    this.router.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.mode='E';
          this.editable = true;
          this.activestatus = 'Edit';
          this.tempID = params['id'];
          this.jobid = params['jobid'];
          this.cardJob = params['cardJob'];
          this.isClone = params['clone'];

        } else {
          this.mode='A';
          this.activestatus = 'Add';
          this.getDeafultWorkflow();
        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }
        this.mode = params['mode'];
      });

    if (this.mode == 'R') {
      this.activestatus = 'View';
      this.JobWorkForm.controls['workflowName'].disable();
      this.JobWorkForm.controls['Status'].disable();
    } else {
      this.JobWorkForm.controls['workflowName'].enable();
      this.JobWorkForm.controls['Status'].enable();
      this.getStatusList();
      //this.getGroupCheckListAll('');
    }

    setTimeout(() => {
      if (this.tempID != undefined) {
        //this.editForm(this.tempID);
       
        if(this.isClone){
          this.editForm(this.tempID);
        }else{
          this.editForm(this.tempID);
          //this.CandidateJobCount(this.tempID);
          
        }
      }
    }, 1500);
    this.industryList();
    this.getJobTypeList();
    this.getWorkFlowStageList();
    this.getColorCodeAll();
   
  }

  /* 
  @Type: File, <ts>
  @Name: industryList function
  @Who: Renu
  @When: 30-Dec-2022
  @Why: ROST-9388 EWM-10001
  @What: service call for get list for industry List info
  */
 
  industryList() {
    this.loading = true;
    this.quickJobService.getIndustryAll().subscribe(
      (repsonsedata: Industry)  => {
        if (repsonsedata.HttpStatusCode ==200 || repsonsedata.HttpStatusCode ==204) {
          this.loading = false;         
          this.industryInfo = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        if(err.StatusCode==undefined)
        {
          this.loading=false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
  @Type: File, <ts>
  @Name: getJobTypeList function
  @Who: Renu
  @When: 30-Dec-2022
  @Why:EWM-9388 EWM-10001
  @What: For showing the list of Job type data
 */
 
  getJobTypeList() {
    this.quickJobService.getJobTypeList().subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          this.JobTypeList = repsonsedata.Data;
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
    @Type: File, <ts>
    @Name: workflowExists function
    @Who: Renu
    @When: 19-June-2021
    @Why: ROST-1871
    @What: For checking duplicacy for workflow
   */
  workflowExists(isSave) {
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
    // jsonExistObj['Id'] = JobId;
    jsonExistObj['Id']= this.isClone && this.tempID ? '' : JobId;
    jsonExistObj['WorkflowName'] = this.JobWorkForm.get('workflowName').value.trim();
    jsonExistObj['IndustryId']=this.JobWorkForm.get('Industry').value?this.JobWorkForm.get('Industry').value.Id:'';
  jsonExistObj['JobTypeId']=this.JobWorkForm.get('jobType').value?this.JobWorkForm.get('jobType').value.Id:'';
    if (this.JobWorkForm.get('workflowName').value) {
      this.jobWorkflowService.checkJobWorkFlowIsExists(jsonExistObj).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 402) {
            if (repsonsedata.Status == false) {
              if(this.JobWorkForm.get('Industry').value==null && this.JobWorkForm.get('jobType').value==null){
                this.JobWorkForm.get("workflowName").setErrors({ codeTaken: true });
                this.JobWorkForm.get("workflowName").markAsTouched();
                this.JobWorkForm.get("workflowName").markAsDirty();
             }else if(this.JobWorkForm.get('Industry').value!=null && this.JobWorkForm.get('jobType').value==null){
               //this.snackBService.showErrorSnackBar(this.translateService.instant('label_duplicateWorkflow'),'');
               this.JobWorkForm.get("workflowName").setErrors({ industryTaken: true });
               this.JobWorkForm.get("workflowName").markAsTouched();
               this.JobWorkForm.get("workflowName").markAsDirty();
             }
             else if(this.JobWorkForm.get('Industry').value==null && this.JobWorkForm.get('jobType').value!=null){
              //this.snackBService.showErrorSnackBar(this.translateService.instant('label_duplicateWorkflow'),'');
              this.JobWorkForm.get("workflowName").setErrors({ jobTypeTaken: true });
              this.JobWorkForm.get("workflowName").markAsTouched();
              this.JobWorkForm.get("workflowName").markAsDirty();
            }
            else if(this.JobWorkForm.get('Industry').value!=null && this.JobWorkForm.get('jobType').value!=null){
              //this.snackBService.showErrorSnackBar(this.translateService.instant('label_duplicateWorkflow'),'');
              this.JobWorkForm.get("workflowName").setErrors({ IndustryjobTypeTaken: true });
              this.JobWorkForm.get("workflowName").markAsTouched();
              this.JobWorkForm.get("workflowName").markAsDirty();
            }
            }
             
             
          } else if (repsonsedata.HttpStatusCode === 204) {
            if (repsonsedata.Status == true) {
              this.JobWorkForm.get("workflowName").clearValidators();
              this.JobWorkForm.get("workflowName").markAsPristine();
              this.JobWorkForm.get('workflowName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(100)]);
              this.JobWorkForm.get("workflowName").updateValueAndValidity();
              if (this.JobWorkForm && this.submitted == true && isSave) {
                if (this.tempID == undefined || this.tempID == null) {
                  this.createJobWorkFlow(this.JobWorkForm.getRawValue());
                } else if(this.isClone){
                  this.createJobWorkFlow(this.JobWorkForm.getRawValue());
                }
                else {
                  this.updateJobWorkFlow(this.JobWorkForm.getRawValue());
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
          this.dataArr?.Stages?.forEach((x,i) => { //by maneesh ,when:16752
            this.newSelectedStageTag.push({
              'stageName':x?.StageType,
            })
          })
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
              // title:x.StageDesc,
              // color:x.ColorCode,
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
       
          this.JobWorkForm.patchValue({
            Id: this.dataArr.Id,
           // workflowName: this.dataArr.WorkflowName,
            Status: this.dataArr.Status.toString(),
            Industry:{'Id':this.dataArr?.IndustryId,'Description':this.dataArr?.IndustryName},
            jobType:{'Id':this.dataArr?.JobTypeId},
          })
            // @ Adarsh singh EWM-9981 When: 30-12-2022
            if (this.isClone) {
              this.JobWorkForm.patchValue({
                workflowName: this.dataArr.WorkflowName + ' Clone'
              })
            }else{
              this.JobWorkForm.patchValue({
                workflowName: this.dataArr.WorkflowName
              })
            }
            // @ Adarsh singh EWM-9981 When: 30-12-2022 END
          const parentInfo = this.JobWorkForm.get('Stages') as FormArray;
          parentInfo.clear();               
          this.dataArr.Stages.forEach((x, index) => {
            this.hideChildContent[index]=true;//by maneesh ewm-17618 when:12/07/2024
            let selectedCheckList: any[] = [];
            let tempP;
            if (x['ColorCode']) {
              this.selctedColor[index]=x['ColorCode'];
              tempP = this.hexToRgb(x['ColorCode']);
            } else {
              tempP = '';
            }
         
            parentInfo.push(
              this.fb.group({
                StageName: [x['StageName'], [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]],
                StageDesc: [x['StageDesc'], [Validators.maxLength(100)]],
                //Active: Boolean(Number(x['Status'])),
                Active:new FormControl({
                  value:Boolean(Number(x['Status'] || x['StageType']=='Applied' ||x['StageType']=='Hired'))?Boolean(Number(x['Status'])):false,
                  disabled:Boolean(Number(x['Status'] &&  x['StageType']=='Applied' ||x['StageType']=='Hired'))?true:false
                }),
                BuiltIn: Boolean(Number(x['IsBuiltIn'])),
                workflowUsed:this.workflowUsed,
                ColorCode: x['ColorCode'],
                ColorCodeUrl: x['ColorCodeUrl'],
                DisplaySeq: x['DisplaySeq'],
                JobPipeline:new FormControl(
                  {
                   value:Boolean(Number(x['Status']==true))?Boolean(Number(x['IsIncludeInPipeline'])):false,
                   disabled:Boolean(Number(x['Status'] && x['StageType']=='Applied' ||x['StageType']=='Hired'))?true:false
                  }),
                //JobPipeline: new FormControl({ value: Boolean(Number(x['Status'])) == true ? Boolean(Number(x['IsIncludeInPipeline'])) : false, disabled: Boolean(Number(x['Status'])) ? false : true }),
                AutomatedActions: Boolean(Number(x['AutomatedActions'])),
                IsMapAssessmentTest: Boolean(Number(x['IsMapAssessmentTest'])),
                AssessmentId: x['IsMapAssessmentTest']?x['AssessmentId']:[],
                IsMapChecklist: Boolean(Number(x['IsMapChecklist'])),
                ChecklistId: x['IsMapChecklist']?x['ChecklistId']:[],
                StageId: x['StageId'],
                InternalCode: x['InternalCode'],
                ParentStageId: x['ParentStageId'],
                IsDeleted: x['IsDeleted'],
                WorkflowInternalCode: x['WorkflowInternalCode'],
                Stages: this.fb.array([]),
                IsNew: [0],
                IsMapWorkflowFeature: x['IsMapWorkflowFeature'],
                StageType: x['StageType'],
                // StageType: [x['StageType'],[Validators.required]],
                StageTypeInternalCode:x['StageTypeInternalCode'],
                StageTypeColorCode:x['StageTypeColorCode'],
                StageTypeCode:x['StageType'],
                IsFirstStage:x['IsFirstStage'],
                IsLastStage:x['IsLastStage'],
                IsStageType:Boolean(Number(x['IsStageType']))
              })
            );
            this.defaultColorValue = x['ColorCode']
            if (this.mode == 'R') {
              parentInfo.disable();
            }
            this.dataArr.Stages[index].Stages.forEach((y, j) => {     
              let tempC;
              if (y['ColorCode']) {
                this.selctedColor[index+'_'+j]=y['ColorCode'];
                tempC = this.hexToRgb(y['ColorCode']);
              } else {
                tempC = '';
              }
            
              const childInfo = parentInfo.at(index).get('Stages') as FormArray;
              childInfo.push(
                this.fb.group({
                  StageName: [y['StageName'], [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]],//@who:priti;@why:EWM-3717;@when:13-dec-2021;@what:remove pattern validation
                  StageDesc: [y['StageDesc'], [Validators.maxLength(100)]],
                  Active: new FormControl({ value: Boolean(Number(x['Status'])) == true ? Boolean(Number(y['Status'])) : false, disabled: Boolean(Number(x['Status'])) ? false : true }),
                  BuiltIn: Boolean(Number(y['IsBuiltIn'])),
                  ColorCode: y['ColorCode'],
                  ColorCodeUrl: y['ColorCodeUrl'],
                  DisplaySeq: y['DisplaySeq'],
                  JobPipeline: new FormControl({ value: Boolean(Number(y['Status'])) == true ? Boolean(Number(y['IsIncludeInPipeline'])) : false, disabled: Boolean(Number(y['Status'])) ? false : true }),
                  AutomatedActions: Boolean(Number(y['AutomatedActions'])),
                  IsMapAssessmentTest: Boolean(Number(y['IsMapAssessmentTest'])),
                  AssessmentId: y['IsMapAssessmentTest']?y['AssessmentId']:[],
                  IsMapChecklist: Boolean(Number(y['IsMapChecklist'])),
                 // ChecklistId: y['ChecklistId'],
                  ChecklistId: y['IsMapChecklist']?y['ChecklistId']:[],
                  StageId: y['StageId'],
                  InternalCode: y['InternalCode'],
                  ParentStageId: y['ParentStageId'],
                  IsDeleted: x['IsDeleted'],
                  IsNew: [0],
                  Stages: this.fb.array([]),
                  stageType: x['StageType'],
                  // StageType: [x['StageType'],[Validators.required]],
                  StageTypeInternalCode:x['StageTypeInternalCode'],
                  StageTypeColorCode:x['StageTypeColorCode'],
                  StageTypeCode:x['StageType'],
                  IsFirstStage:x['IsFirstStage'],
                  IsLastStage:x['IsLastStage'],
                  IsStageType:Boolean(Number(x['IsStageType']))
                })
              );
              if (this.mode == 'R') {
                childInfo.disable();
              }
              this.dataArr.Stages[index].Stages[j].Stages.forEach((z, k) => {
                const subchildInfo = childInfo.at(j).get('Stages') as FormArray;
                let tempS;
                if (z['ColorCode']) {
                  this.selctedColor[index+'_'+j+'_'+k]=z['ColorCode'];
                  tempS = this.hexToRgb(z['ColorCode']);
                } else {
                  tempS = '';
                }
             
               
                subchildInfo.push(
                  this.fb.group({
                    StageName: [z['StageName'], [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]], //@who:priti;@why:EWM-3717;@when:13-dec-2021;@what:remove pattern validation
                    StageDesc: [z['StageDesc'], [Validators.maxLength(100)]],
                    Active: new FormControl({ value: Boolean(Number(y['Status'])) == true ? Boolean(Number(z['Status'])) : false, disabled: Boolean(Number(y['Status'])) ? false : true }),
                    BuiltIn: Boolean(Number(z['IsBuiltIn'])),
                    DisplaySeq: y['DisplaySeq'],
                    ColorCode: z['ColorCode'],
                    ColorCodeUrl: z['ColorCodeUrl'],
                    StageId: z['StageId'],
                    InternalCode: z['InternalCode'],
                    ParentStageId: z['ParentStageId'],
                    IsDeleted: x['IsDeleted'],
                    IsNew: [0],
                    JobPipeline: new FormControl({ value: Boolean(Number(z['Status'])) == true ? Boolean(Number(z['IsIncludeInPipeline'])) : false, disabled: Boolean(Number(z['Status'])) ? false : true }),
                    AutomatedActions: Boolean(Number(z['AutomatedActions'])),
                    IsMapAssessmentTest: Boolean(Number(z['IsMapAssessmentTest'])),
                    AssessmentId:z['IsMapAssessmentTest']?z['AssessmentId']:[],
                    IsMapChecklist: Boolean(Number(z['IsMapChecklist'])),
                   // ChecklistId: z['ChecklistId'],
                    ChecklistId: z['IsMapChecklist']?z['ChecklistId']:[],
                    stageType: x['StageType'],
                    // StageType: [x['StageType'],[Validators.required]],

                    StageTypeInternalCode:x['StageTypeInternalCode'],
                    StageTypeColorCode:x['StageTypeColorCode'],
                    StageTypeCode:x['StageType'],
                    IsFirstStage:x['IsFirstStage'],
                    IsLastStage:x['IsLastStage'],
                    IsStageType:Boolean(Number(x['IsStageType']))
                  })
                );
                if (this.mode == 'R') {
                  subchildInfo.disable();
                }
              })
            })
          })

          this.JobWorkForm.patchValue(this.dataArr);
          this.newSelectedStageTag.forEach((z,m) => { // by maneesh
            this.stageType=z?.stageName;            
                if (this.stageType==''  || this.stageType==null) {
                  this.requiredStageType[m]= true; 
                  this.addstage=true;
                }
             })
          // <!---------@When: 28-12-2022 @who:Adarsh singh @why: EWM-10008 --------->
         // this.isClone ? this.JobWorkForm.get("workflowName").reset() : '';
          // End 
          // console.log(this.JobWorkForm,"jobworkflow");
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
    this.addstage=true; 
    this.userAnimationStatus = true;
     this.parentInfo().insert(this.parentInfo().length-1, this.createParent());
  //  this.parentInfo().push(this.createParent());
    setTimeout(() => {
      document.getElementById("addStage" + (this.parentInfo().length-1)).classList.add("animate__slideInRight");
    }, 0);
    this.requiredStageType[this.parentInfo().length-2]= true; //by maneesh    
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
      // StageName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
      StageName: ['', [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]],//@who:priti;@why:EWM-3717;@when:13-dec-2021;@what:remove pattern validation
      StageDesc: ['', [Validators.maxLength(100)]],
      Active: [],
      BuiltIn: [],
      ColorCode: [this.stageBgColor],
      ColorCodeUrl: [],
      JobPipeline: new FormControl({ value: '', disabled: true }),
      DisplaySeq: [],
      StageId: [],
      InternalCode: [],
      ParentStageId: [],
      IsDeleted: [],
      WorkflowInternalCode: [],
      Stages: this.fb.array([]),
      IsNew: [1],
      AutomatedActions: [],
      IsMapAssessmentTest: [],
      AssessmentId: [],
      IsMapChecklist: [],
      ChecklistId: [],
      IsMapWorkflowFeature: [false],
      StageType: [],
      StageTypeInternalCode:[],
      StageTypeColorCode:[],
      StageTypeCode:[],
      IsFirstStage:[0],
      IsLastStage:[0],
      IsStageType:[],
      workflowUsed:false
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
    this.hideChildContent[j]=false; //by maneesh ewm-17618
    this.userAnimationStatus = true;
    const control = (<FormArray>this.JobWorkForm.controls['Stages']).at(j).get('Stages') as FormArray;
    const parentform = (<FormArray>this.JobWorkForm.get('Stages')) as FormArray;
    let activeVal = parentform?.at(j).get('Active')?.value;
    control.push(this.createChild(activeVal));
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
  createChild(activeVal) {
    return this.fb.group({
      //@who:priti;@why:EWM-3717;@when:13-dec-2021;@what:remove pattern validation
      StageName: ['', [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]],
      // StageName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
      StageDesc: ['', [Validators.maxLength(100)]],
      Active: new FormControl({ value: '', disabled: activeVal ? false : true }),
      BuiltIn: [],
      ColorCode: [this.stageBgColor],
      ColorCodeUrl: [],
      JobPipeline: new FormControl({ value: '', disabled: true }),
      DisplaySeq: [],
      StageId: [],
      InternalCode: [],
      ParentStageId: [],
      IsNew: [1],
      AutomatedActions: [],
      IsMapAssessmentTest: [],
      AssessmentId: [],
      IsMapChecklist: [],
      ChecklistId: [],
      IsMapWorkflowFeature: [false],
      Stages: this.fb.array([]),
      StageTypeInternalCode:[],
      StageTypeColorCode:[],
      StageType: [],
      IsFirstStage:[0],
      IsLastStage:[0],
      IsStageType:[],
      StageTypeCode:[],
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
      this.hideChildContent[pIndex]=false; //by maneesh ewm-17618
      this.userAnimationStatus = true;
      const control = ((<FormArray>this.JobWorkForm.controls['Stages']).at(pIndex).get('Stages') as FormArray).at(cIndex).get('Stages') as FormArray;
      const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(pIndex)?.get('Stages') as FormArray;
      let activeVal = childform?.at(cIndex)?.get('Active').value;
      control.push(this.createSubChild(activeVal));
      setTimeout(() => {
        this.hideSubChildContent[pIndex + '.' + cIndex] = false; //fixed plus btn for child ewm-15/07/2024
        // document.getElementById("addSubChild" + pIndex + cIndex + (totalSubChild + 1)).classList.add("animate__slideInRight");
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
  createSubChild(activeVal) {
    return this.fb.group({
      //@who:priti;@why:EWM-3717;@when:13-dec-2021;@what:remove pattern validation
      StageName: ['', [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]],
      //StageName: ['', [Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]],
      StageDesc: ['', [Validators.maxLength(100)]],
      Active: new FormControl({ value: '', disabled: activeVal ? false : true }),
      BuiltIn: [],
      ColorCode: [this.stageBgColor],
      ColorCodeUrl: [],
      JobPipeline: new FormControl({ value: '', disabled: true }),
      DisplaySeq: [],
      StageId: [],
      InternalCode: [],
      ParentStageId: [],
      isEditable: [],
      IsNew: [1],
      AutomatedActions: [],
      IsMapAssessmentTest: [],
      AssessmentId: [],
      IsMapChecklist: [],
      IsMapWorkflowFeature: [false],
      ChecklistId: [],
      StageTypeInternalCode:[],
      StageTypeColorCode:[],
      StageType: [],
      IsFirstStage:[0],
      IsLastStage:[0],
      IsStageType:[],
      StageTypeCode:[],
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
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['IsMapAssessmentTest'] = subChild.value.IsMapAssessmentTest;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['AssessmentId'] = subChild.value.AssessmentId;
    this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['IsMapChecklist'] = subChild.value.IsMapChecklist;
    // this.updateArr['Stages'][i]['Stages'][j]['Stages'][pos]['IsMapWorkflowFeature'] = subChild.value.IsMapWorkflowFeature;


    

    //subChild.disable(); //  AssessmentId:[],
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
    this.updateArr['Stages'][i]['Stages'][pos]['IsMapAssessmentTest'] = Child.value.IsMapAssessmentTest;
    this.updateArr['Stages'][i]['Stages'][pos]['Stages'][pos]['AssessmentId'] = Child.value.AssessmentId;
    this.updateArr['Stages'][i]['Stages'][pos]['IsMapChecklist'] = Child.value.IsMapChecklist;
    this.updateArr['Stages'][i]['Stages'][pos]['IsMapWorkflowFeature'] = Child.value.IsMapWorkflowFeature;

    

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
    this.updateArr['Stages'][pos]['IsMapAssessmentTest'] = parent.value.IsMapAssessmentTest;
    this.updateArr['Stages'][pos]['AssessmentId'] = parent.value.AssessmentId;
    this.updateArr['Stages'][pos]['IsMapChecklist'] = parent.value.IsMapChecklist;
    this.updateArr['Stages'][pos]['ChecklistId'] = parent.value.ChecklistId;
    this.updateArr['Stages'][pos]['IsMapWorkflowFeature'] = parent.value.IsMapWorkflowFeature;

    

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
    this.hideChildContent[cindex] = false; //by maneesh ewm-17618 when:12/07/2024
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
    let formArray: FormArray;
    this.userAnimationStatus = false;
    formArray = this.JobWorkForm.get("Stages") as FormArray;
    const from = event.previousIndex;
    const to = event.currentIndex; 
    this.moveItemInArrayIfAllowed(formArray['controls'], from, to);
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
    this.moveItemInFormArray(formArray, from, to, cIndex);
    
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
    this.moveItemInFormArray(formArray, from, to,pIndex,cIndex);
  }

  /**
  * Moves an item in a FormArray to another position.
  * @param formArray FormArray instance in which to move the item.
  * @param fromIndex Starting index of the item.
  * @param toIndex Index to which he item should be moved.
  */
  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number,pIndex:number,cIndex?:number): any {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);
    if (from === to) {
      return;
    }
    const previous = formArray.at(from);
    const current = formArray.at(to);
    formArray.setControl(to, previous);
    formArray.setControl(from, current);
  /*** @When: 17-07-2023 @Who:bantee @Why: EWM-12471 @What: When user swaps any two job workflow stage, color code of those stage is not swapped. **/

    let bgChildcolor=this.selctedColor[pIndex+'_'+fromIndex];
    this.selctedColor[pIndex+'_'+fromIndex]=this.selctedColor[pIndex+'_'+toIndex] ;
    this.selctedColor[pIndex+'_'+toIndex]=bgChildcolor;

   
      let bgSubchildcolor=this.selctedColor[pIndex+'_'+cIndex+'_'+fromIndex];
      this.selctedColor[pIndex+'_'+cIndex+'_'+fromIndex]=this.selctedColor[pIndex+'_'+cIndex+'_'+toIndex] ;
      this.selctedColor[pIndex+'_'+cIndex+'_'+toIndex]=bgSubchildcolor;
    
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
    JsonObj['IndustryId']=value.Industry?.Id;
    JsonObj['IndustryName']=value.Industry?.Description;
    JsonObj['JobTypeId']=value.jobType?.Id;
    JsonObj['Status'] = parseInt(value.Status);
    let parentobj = [];
    value.Stages.forEach((x, pindex) => {  
      parentobj.push({
        'StageName': x.StageName,
        'StagePublicName': x.StageName,
        'StageDesc': x.StageDesc,
        'IsIncludeInPipeline': x.JobPipeline == null ? Number(0) : Number(x.JobPipeline),
        'AutomatedActions': Number(x.AutomatedActions),
        'IsMapAssessmentTest': Number(x.IsMapAssessmentTest),
        'AssessmentId': x.AssessmentId ? x.AssessmentId : [],
        'IsMapChecklist': Number(x.IsMapChecklist),
        'ColorCode': x.ColorCode,
        'ColorCodeUrl': x?.ColorCodeUrl,
        'IsBuiltIn': Number(x.BuiltIn),
        'Status': x.Active == null ? Number(0) : Number(x.Active),
        'Keyword': '',
        'IsEditable': 0,
        'DisplaySeq': Number(pindex + 1),
        'IsIncludeFixed': 0,
        'IsActiveFixed': 0,
        'NavigateURL': "",
        'Stages': null,
        'ChecklistId':x.ChecklistId ? x.ChecklistId : [],
        'IsMapWorkflowFeature': Number(x.IsMapWorkflowFeature),
        'StageTypeInternalCode':x.StageTypeInternalCode?x.StageTypeInternalCode:null,
       'StageType':x.StageTypeCode?x.StageTypeCode:'',
       'StageTypeColorCode':x.StageTypeColorCode?x.StageTypeColorCode:'',
       'IsStageType':Number(x.IsStageType)?Number(x.IsStageType):0,
       'IsFirstStage':Number(x.IsFirstStage?x.IsFirstStage:0),
       'IsLastStage':Number(x.IsLastStage?x.IsLastStage:0)
        
      })
      JsonObj['Stages'] = parentobj;
      let childobj = [];

      value.Stages[pindex].Stages.forEach((y, cindex) => {
        childobj.push({
          'StageName': y.StageName,
          'StagePublicName': y.StageName,
          'StageDesc': y.StageDesc,
          'IsIncludeInPipeline': y.JobPipeline == null ? Number(0) : Number(y.JobPipeline),
          'AutomatedActions': Number(y.AutomatedActions),
          'IsMapAssessmentTest': Number(y.IsMapAssessmentTest),
          'AssessmentId': y.AssessmentId ? y.AssessmentId : [],
          'IsMapChecklist': Number(y.IsMapChecklist),
          'ColorCode': y.ColorCode,
          'ColorCodeUrl': y?.ColorCodeUrl,
          'IsBuiltIn': Number(y.BuiltIn),
          'Status': y.Active == null ? Number(0) : Number(y.Active),
          'Keyword': '',
          'IsEditable': 0,
          'DisplaySeq': Number(cindex + 1),
          'IsIncludeFixed': 0,
          'IsActiveFixed': 0,
          'NavigateURL': "",
          'Stages': null,
          'ChecklistId': y.ChecklistId ? y.ChecklistId : [],
          // 'StageTypeInternalCode':y.StageTypeInternalCode?y.StageTypeInternalCode:null,
          // 'StageType':y.StageTypeCode?y.StageTypeCode:'',
          // 'StageTypeColorCode':y.StageTypeColorCode?y.StageTypeColorCode:'',
          'StageTypeInternalCode':x.StageTypeInternalCode?x.StageTypeInternalCode:null,//by maneesh
          'StageType':x.StageTypeCode?x.StageTypeCode:'',
          'StageTypeColorCode':x.StageTypeColorCode?x.StageTypeColorCode:'',
          'IsStageType':Number(y.IsStageType)?Number(y.IsStageType):0,
          'IsFirstStage':Number(y.IsFirstStage?y.IsFirstStage:0),
          'IsLastStage':Number(y.IsLastStage?y.IsLastStage:0)
        })

        parentobj[pindex]['Stages'] = childobj;

        let subChild = [];

        value.Stages[pindex].Stages[cindex].Stages.forEach((z, scindex) => {
          subChild.push({
            'StageName': z.StageName,
            'StagePublicName': z.StageName,
            'StageDesc': z.StageDesc,
            'IsIncludeInPipeline': z.JobPipeline == null ? Number(0) : Number(z.JobPipeline),
            'AutomatedActions': Number(z.AutomatedActions),
            'IsMapAssessmentTest': Number(z.IsMapAssessmentTest),
            'AssessmentId': z.AssessmentId ? z.AssessmentId : [],
            'IsMapChecklist': Number(z.IsMapChecklist),
            'ColorCode': z.ColorCode,
            'ColorCodeUrl': z?.ColorCodeUrl,
            'IsBuiltIn': Number(z.BuiltIn),
            'Status': z.Active == null ? Number(0) : Number(z.Active),
            'Keyword': '',
            'IsEditable': 0,
            'DisplaySeq': Number(scindex + 1),
            'IsIncludeFixed': 0,
            'IsActiveFixed': 0,
            'NavigateURL': "",
            'ChecklistId':  z.ChecklistId ? z.ChecklistId : [],
            // 'StageTypeInternalCode':z.StageTypeInternalCode?z.StageTypeInternalCode:null,
            // 'StageType':z.StageTypeCode?z.StageTypeCode:'',
            // 'StageTypeColorCode':z.StageTypeColorCode?z.StageTypeColorCode:'',
            'StageTypeInternalCode':x.StageTypeInternalCode?x.StageTypeInternalCode:null, //by maneesh
            'StageType':x.StageTypeCode?x.StageTypeCode:'',
            'StageTypeColorCode':x.StageTypeColorCode?x.StageTypeColorCode:'',
            'IsStageType':Number(z.IsStageType)?Number(z.IsStageType):0,
            'IsFirstStage':Number(z.IsFirstStage?z.IsFirstStage:0),
            'IsLastStage':Number(z.IsLastStage?z.IsLastStage:0)
          })
          parentobj[pindex]['Stages'][cindex]['Stages'] = subChild;
        });
      });
    });
    this.jobWorkflowService.AddJobWorkflow(JsonObj).subscribe((repsonsedata: jobWorkFlow) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.submitted = false;
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
    // <!---------@When: 28-12-2022 @who:Adarsh singh @why: EWM-10008 --------->
    this.workflowExists(true);
    // End 
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
    jsonExistObj['StageName'] = event.target.value.trim();
    //@who:Nitin Bhati;@why:EWM-3732;@when:30-dec-2021;@what:handle space validation
    formGroup.patchValue({
      'StageName': event.target.value.trim()
    }
    );
    this.jobWorkflowService.checkStageIsExists(jsonExistObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          if (repsonsedata.Status == true) {
            formGroup.get("StageName").setErrors({ stageTaken: true });
            formGroup.get("StageName").markAsDirty();
          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Status == true) {

            formGroup.get("StageName").clearValidators();
            formGroup.get("StageName").markAsPristine();
            //@who:priti;@why:EWM-3717;@when:13-dec-2021;@what:remove pattern validation
            formGroup.get("StageName").setValidators([Validators.required, Validators.maxLength(50), RxwebValidators.unique()]);
            //formGroup.get('StageName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]);
          }
        }
        else {
          formGroup.get("StageName").clearValidators();
          formGroup.get("StageName").markAsPristine();
          //@who:priti;@why:EWM-3717;@when:13-dec-2021;@what:remove pattern validation
          formGroup.get('StageName').setValidators([Validators.required, Validators.maxLength(50), RxwebValidators.unique()]);
          // formGroup.get('StageName').setValidators([Validators.required, Validators.pattern(this.specialcharPattern), Validators.maxLength(50), RxwebValidators.unique()]);
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
    JsonObj['IndustryId']=value.Industry?.Id;
    JsonObj['IndustryName']=value.Industry?.Description;
    JsonObj['JobTypeId']=value.jobType?.Id;
    let parentobj = [];    
    this.parentDelArr.forEach(element => {
      value.Stages.push(element);
    });

    value.Stages.forEach((x, pindex) => {   
      let selectedChecklist = [];
      selectedChecklist = x.ChecklistId?.filter(res => res.IsSelected === 1)
      parentobj.push({
        'StageName': x.StageName,
        'StagePublicName': x.StageName,
        'StageDesc': x.StageDesc,
        'IsIncludeInPipeline': x.JobPipeline == null ? Number(0) : Number(x.JobPipeline),
        'AutomatedActions': x.AutomatedActions == null ? Number(0) : Number(x.AutomatedActions),
        'IsMapAssessmentTest': x.IsMapAssessmentTest == null ? Number(0) : Number(x.IsMapAssessmentTest),
        'AssessmentId': x.IsMapAssessmentTest ? x.AssessmentId : [],
        'IsMapChecklist': x.IsMapChecklist == null ? Number(0) : Number(x.IsMapChecklist),
        'ChecklistId': x.IsMapChecklist ? x.ChecklistId : [],
        //'ChecklistId': x?.ChecklistId.filter(res => res.IsSelected === 1),
       // 'ChecklistId': selectedChecklist ? selectedChecklist : [],
        'ColorCode': x.ColorCode ? this.checkColorFormat(x.ColorCode) : x.ColorCode,
        'ColorCodeUrl': x?.ColorCodeUrl,
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
        'Stages': null,
        'IsMapWorkflowFeature': x.IsMapWorkflowFeature == null ? Number(0) : Number(x.IsMapWorkflowFeature),
      'StageTypeInternalCode':x.StageTypeInternalCode?x.StageTypeInternalCode:null,
      'StageType':x.StageTypeCode?x.StageTypeCode:'',
      'StageTypeColorCode':x.StageTypeColorCode?x.StageTypeColorCode:'',
      'IsStageType':Number(x.IsStageType)?Number(x.IsStageType):0,
      'IsFirstStage':Number(x.IsFirstStage?x.IsFirstStage:0),
      'IsLastStage':Number(x.IsLastStage?x.IsLastStage:0)
      })
      JsonObj['Stages'] = parentobj;
      let childobj = [];
      this.childDelArr.forEach(element => {
        /****************@When:01-05-2023 @Who: renu @why:EWM-12122***********/
        //let parentId = element.ParentStageId;
        //let Id = value.Stages[pindex].Stages.InternalCode;
        //if (parentId == Id) {
          value.Stages[pindex].Stages.push(element);
       // }
      });      
      value.Stages[pindex].Stages.forEach((y, cindex) => {
        let selectedChildChecklist = [];
        selectedChildChecklist = y.ChecklistId?.filter(res => res.IsSelected === 1)
        childobj.push({
          'StageName': y.StageName,
          'StagePublicName': x.StageName,
          'StageDesc': y.StageDesc,
          'IsIncludeInPipeline': y.JobPipeline == null ? Number(0) : Number(y.JobPipeline),
          'AutomatedActions': y.AutomatedActions == null ? Number(0) : Number(y.AutomatedActions),
          'IsMapAssessmentTest': y.IsMapAssessmentTest == null ? Number(0) : Number(y.IsMapAssessmentTest),
          'AssessmentId': y.IsMapAssessmentTest ? y.AssessmentId : [],
          'IsMapChecklist': y.IsMapChecklist == null ? Number(0) : Number(y.IsMapChecklist),
          'ChecklistId': y.IsMapChecklist ? y.ChecklistId : [],
         // 'ChecklistId':  y?.ChecklistId.filter(res => res.IsSelected === 1), 
         // 'ChecklistId': selectedChildChecklist ? selectedChildChecklist : [],
          'ColorCode': y.ColorCode ? this.checkColorFormat(y.ColorCode) : y.ColorCode,
          'ColorCodeUrl': y?.ColorCodeUrl,
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
          'Stages': null,
          // 'StageTypeInternalCode':y.StageTypeInternalCode?y.StageTypeInternalCode:null,
          // 'StageType':y.StageTypeCode?y.StageTypeCode:'',
          // 'StageTypeColorCode':y.StageTypeColorCode?y.StageTypeColorCode:'',
          'StageTypeInternalCode':x.StageTypeInternalCode?x.StageTypeInternalCode:null, //by maneesh
          'StageType':x.StageTypeCode?x.StageTypeCode:'',
          'StageTypeColorCode':x.StageTypeColorCode?x.StageTypeColorCode:'',
          'IsStageType':Number(y.IsStageType)?Number(y.IsStageType):0,
          'IsFirstStage':Number(y.IsFirstStage?y.IsFirstStage:0),
          'IsLastStage':Number(y.IsLastStage?y.IsLastStage:0)
        })

        parentobj[pindex]['Stages'] = childobj;

        let subChild = [];
        this.subChildArr.forEach(element => {
          /****************@When:01-05-2023 @Who: renu @why:EWM-12122***********/
         // let parentId = element.ParentStageId;
          //let Id = value.Stages[pindex].Stages[cindex].InternalCode;
          //if (parentId == Id) {
            value.Stages[pindex].Stages[cindex].Stages.push(element);
         // }
        });
        value.Stages[pindex].Stages[cindex].Stages.forEach((z, scindex) => {
          let selectedSubChildChecklist = [];
          selectedSubChildChecklist = z.ChecklistId?.filter(res => res.IsSelected === 1)
          subChild.push({
            'StageName': z.StageName,
            'StagePublicName': x.StageName,
            'StageDesc': z.StageDesc,
            'IsIncludeInPipeline': z.JobPipeline == null ? Number(0) : Number(z.JobPipeline),
            'AutomatedActions': z.AutomatedActions == null ? Number(0) : Number(z.AutomatedActions),
            'IsMapAssessmentTest': z.IsMapAssessmentTest == null ? Number(0) : Number(z.IsMapAssessmentTest),
            'AssessmentId': z.IsMapAssessmentTest ? z.AssessmentId : [],
            'IsMapChecklist': z.IsMapChecklist == null ? Number(0) : Number(z.IsMapChecklist),
            'ChecklistId': z.IsMapChecklist ? z.ChecklistId : [],
             //'ChecklistId':  z?.ChecklistId.filter(res => res.IsSelected === 1),
            //'ChecklistId': selectedSubChildChecklist ? selectedSubChildChecklist : [],
            'ColorCode': z.ColorCode ? this.checkColorFormat(z.ColorCode) : z.ColorCode,
            'ColorCodeUrl': z?.ColorCodeUrl,
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
            // 'StageTypeInternalCode':z.StageTypeInternalCode?z.StageTypeInternalCode:null,
            // 'StageType':z.StageTypeCode?z.StageTypeCode:'',
            // 'StageTypeColorCode':z.StageTypeColorCode?z.StageTypeColorCode:'',
            'StageTypeInternalCode':x.StageTypeInternalCode?x.StageTypeInternalCode:null,// by maneesh
            'StageType':x.StageTypeCode?x.StageTypeCode:'',
            'StageTypeColorCode':x.StageTypeColorCode?x.StageTypeColorCode:'',
            'IsStageType':Number(z.IsStageType)?Number(z.IsStageType):0,
            'IsFirstStage':Number(z.IsFirstStage?z.IsFirstStage:0),
            'IsLastStage':Number(z.IsLastStage?z.IsLastStage:0)
          })
          parentobj[pindex]['Stages'][cindex]['Stages'] = subChild;
        });
      });
    });

    this.jobWorkflowService.updateJobWorkflow(JsonObj).subscribe((repsonsedata: jobWorkFlow) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.submitted = false;
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
    this.deleteStageType=this.parentInfo().value[index]?.StageTypeCode;//by maneesh
    // @When: 30-07-2024 @who:Amit @why: EWM-17739 @what: label change & remove
    const message = `label_masters_jobworkflow_deletestage`;
    const title = '';
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.addstage=false;   
        if (IsNew !== 1) {          
          this.parentDelArr.push(this.JobWorkForm.getRawValue()['Stages'][index]);      
          this.deletedNodeUpdate(this.parentDelArr);
        }
        document.getElementsByClassName("deleteparent-" + index)[0].classList.remove("animate__slideInDown");
        document.getElementsByClassName("deleteparent-" + index)[0].classList.add("animate__slideOutLeft");
setTimeout(() => {
this.parentInfo().removeAt(index);
let ind =this.newSelectedStageTag.findIndex(elem => elem['stageName'] == this.deleteStageType);//by maneesh ewm-16752
this.newSelectedStageTag.splice(ind, 1); 
}, 200);


setTimeout(() => {
  this.parentInfo().value.forEach((x) => {   //by maneesh,what:ewm-16752 when:26/06/2024  
    if (x?.StageTypeCode=='' || x?.StageTypeCode==null ) {
    this.requiredStageType[index]= !this.requiredStageType[index]; //by maneesh
      this.addstage=true;   
          }
      })
  // this.parentInfo();
  }, 400);  
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
    // @When: 30-07-2024 @who:Amit @why: EWM-17739 @what: label change & remove
    const message = `label_masters_jobworkflow_deletesubstage`;
    const title = '';
    const subTitle = '';
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
    // @When: 30-07-2024 @who:Amit @why: EWM-17739 @what: label change & remove
    const message = `label_masters_jobworkflow_deletesub-substage`;
    const title = '';
    const subTitle = '';
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

  /*
 @Type: File, <ts>
 @Name: redirectTo
 @Who: Renu
 @When: 21-Oct-2021
 @Why: EWM-3320 EWM-3344
 @What: redirect ot JOB page on back btn
*/
  redirectTo() {
    this._sidebarService.topMenuAciveObs.next('job');
    this.route.navigate(['./client/jobs/job/job-detail/detail'], { queryParams: { jobId: this.jobid, cardJob: this.cardJob, workflowId: this.tempID } });

  }


  /* 
@Type: File, <ts>
@Name: getStatusList function
@Who: ANup
@When: 14-Mar-2022
@Why: EWM-5285 EWM-3988
@What: For img url 
*/
  onChangeColorCodeGetImgUrl(data, i, j, k) {
    let ColorCodeJson = {}
    ColorCodeJson['ColorCode'] = '#' + data?.value?.hex;
    this.jobWorkflowService.getWorkFlowImgUrlByColorCode(ColorCodeJson).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          const parentform = this.JobWorkForm.get('Stages') as FormArray;
          if (i != null && j == null && k == null) {
            parentform.at(i).patchValue({
              ColorCodeUrl: repsonsedata.Data[0]?.Preview,
            });
          }

          const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
          if (j != null && k == null) {
            childform.at(j).patchValue({
              ColorCodeUrl: repsonsedata.Data[0]?.Preview,
            });
          }

          const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray).at(j).get('Stages') as FormArray;
          if (k != null) {
            subChildform.at(k).patchValue({
              ColorCodeUrl: repsonsedata.Data[0]?.Preview,
            });
          }

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
    @Name: openAddAssessmentModule
    @Who: Suika
    @When: 22-06-2022
    @Why: ROST-5334.EWM-7001
    @What: for open add assessment
    */
  openAddAssessmentModule(event, i, j, k, AssessmentArray) {
    if (event.checked == 1 || event == true) {
      const dialogRef = this.dialog.open(AddAssessmentComponent, {
        data: { AssessmentArray: AssessmentArray },
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
        if (resData.inputArray?.length > 0 && resData.res == true) {
          this.AssessmentId = resData.inputArray;
          const parentform = this.JobWorkForm.get('Stages') as FormArray;
          if (i != null && j == null && k == null) {
            parentform.at(i).patchValue({
              AssessmentId: this.AssessmentId
            });
          }

          const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
          if (j != null && k == null) {
            childform.at(j).patchValue({
              AssessmentId: this.AssessmentId
            });
          }

          const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray).at(j).get('Stages') as FormArray;
          if (k != null) {
            subChildform.at(k).patchValue({
              AssessmentId: this.AssessmentId
            });
          }

        } else if (resData.inputArray?.length == 0 && resData.res == true) {
          this.AssessmentId = resData.inputArray;
          const parentform = this.JobWorkForm.get('Stages') as FormArray;
          if (i != null && j == null && k == null) {
            parentform.at(i).patchValue({
              IsMapAssessmentTest: 0,
              AssessmentId: []
            });
          }

          const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
          if (j != null && k == null) {
            childform.at(j).patchValue({
              IsMapAssessmentTest: 0,
              AssessmentId: []
            });
          }

          const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray).at(j).get('Stages') as FormArray;
          if (k != null) {
            subChildform.at(k).patchValue({
              IsMapAssessmentTest: 0,
              AssessmentId: []
            });
          }

        } else if (resData.res == false) {
          this.loading = false;
          if (resData.inputArray?.length == 0) {
            const parentform = this.JobWorkForm.get('Stages') as FormArray;
            if (i != null && j == null && k == null) {
              parentform.at(i).patchValue({
                IsMapAssessmentTest: 0,
                AssessmentId: []
              });
            }

            const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
            if (j != null && k == null) {
              childform.at(j).patchValue({
                IsMapAssessmentTest: 0,
                AssessmentId: []
              });
            }

            const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray).at(j).get('Stages') as FormArray;
            if (k != null) {
              subChildform.at(k).patchValue({
                IsMapAssessmentTest: 0,
                AssessmentId: []
              });
            }
          } else {
            this.AssessmentId = resData.inputArray;
            const parentform = this.JobWorkForm.get('Stages') as FormArray;
            if (i != null && j == null && k == null) {
              parentform.at(i).patchValue({
                IsMapAssessmentTest: 1,
                AssessmentId: this.AssessmentId
              });
            }

            const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
            if (j != null && k == null) {
              childform.at(j).patchValue({
                IsMapAssessmentTest: 1,
                AssessmentId: this.AssessmentId
              });
            }

            const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray).at(j).get('Stages') as FormArray;
            if (k != null) {
              subChildform.at(k).patchValue({
                IsMapAssessmentTest: 1,
                AssessmentId: this.AssessmentId
              });
            }

          }
        }
      })
    } else {
      return;
    }
  }

  /* 
@Type: File, <ts>
@Name: onChange function
@Who: Adarsh Singh
@When: 06-07-2022
@Why: EWM-7363 EWM-7607
@What: For change color on chnage while select color
*/
  public defaultColorValue = "#ffffff";

  public onChange(getColor: string, stage: string, i, j, k): void {
    const parentform = this.JobWorkForm.get('Stages') as FormArray;
    const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
    const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;

    const color = getColor;
    const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
  
    // this.defaultColorValue = hex;
    if (stage === 'parent') {
     // this.parentInfo().controls[i].value.ColorCode = hex;
      parentform?.at(i)?.patchValue({
        ColorCode: hex
      });
    }
    if (stage === 'child') {
      //this.parentInfo().controls[i].value.Stages[j].ColorCode = hex
      childform?.at(j)?.patchValue({
        ColorCode: hex
      });
    }
    if (stage === 'subchild') {
     // this.parentInfo().controls[i].value.Stages[j].Stages[k].ColorCode = hex;
      subChildform?.at(k).patchValue({
        ColorCode: hex
      });
    }
  }


  /* 
@Type: File, <ts>
@Name: changeActiveToggel function
@Who: Suika
@When: 25-Aug-2022
@Why: ROST-8426
@What: For change active status toggelworkflow data Sub-Child
*/

  changeActiveToggel(event, i, j, k, isActiveToggel, isParentToggel) {
    const parentform = this.JobWorkForm.get('Stages') as FormArray;
    const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
    const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;

    if (isActiveToggel === false) {
      if (i != null && j == null && k == null) {
        parentform?.at(i)?.get('JobPipeline').disable();
        parentform?.at(i)?.patchValue({
          JobPipeline: 0
        });
      }


      if (j != null && k == null) {
        childform?.at(j)?.get('JobPipeline').disable();
        childform?.at(j)?.patchValue({
          JobPipeline: 0,
        });
      }

      if (k != null) {
        subChildform?.at(k)?.get('JobPipeline').disable();
        subChildform?.at(k).patchValue({
          JobPipeline: 0,
        });
      }
    } else {
      if (i != null && j == null && k == null) {
        parentform?.at(i)?.get('JobPipeline').enable();
      }
      if (j != null && k == null) {
        childform?.at(j)?.get('JobPipeline').enable();
        childform?.at(j)?.get('Active').enable();
      }
      if (k != null) {
        subChildform?.at(k)?.get('JobPipeline').enable();
        subChildform?.at(k)?.get('Active').enable();
      }



    }
  }




  changeParentToggel(index, value) {
    const parentform = this.JobWorkForm.get('Stages') as FormArray;
    const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(index)?.get('Stages') as FormArray;
    if (value === true) {
      childform.controls.forEach((element, cindex) => {
        childform?.at(cindex)?.get('Active').enable();
        childform?.at(cindex)?.get('JobPipeline').disable();
        childform?.at(cindex)?.patchValue({
          JobPipeline: 0,
          Active: 0
        });
        const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(index)?.get('Stages') as FormArray)?.at(cindex)?.get('Stages') as FormArray;
        subChildform.controls.forEach((element, subindex) => {
          subChildform?.at(subindex)?.get('Active').disable();
          subChildform?.at(subindex)?.get('JobPipeline').disable();
          subChildform?.at(subindex)?.patchValue({
            JobPipeline: 0,
            Active: 0
          });
        })
      })
    } else {
      childform.controls.forEach((element, cindex) => {
        childform?.at(cindex)?.get('JobPipeline').disable();
        childform?.at(cindex)?.get('Active').disable();
        childform?.at(cindex)?.patchValue({
          JobPipeline: 0,
          Active: 0
        });
        const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(index)?.get('Stages') as FormArray)?.at(cindex)?.get('Stages') as FormArray;
        subChildform.controls.forEach((element, subindex) => {
          subChildform?.at(subindex)?.get('JobPipeline').disable();
          subChildform?.at(subindex)?.get('Active').disable();
          subChildform?.at(subindex)?.patchValue({
            JobPipeline: 0,
            Active: 0
          });
        })
      })
    }

  }

  changeChildToggel(index, cindex, value) {
    const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(index)?.get('Stages') as FormArray)?.at(cindex)?.get('Stages') as FormArray;
    if (value === true) {
      subChildform.controls.forEach((element, subindex) => {
        subChildform?.at(subindex)?.get('Active').enable();
        subChildform?.at(subindex)?.get('JobPipeline').disable();
        subChildform?.at(subindex)?.patchValue({
          JobPipeline: 0,
          Active: 0
        });
      })
    } else {
      subChildform.controls.forEach((element, subindex) => {
        subChildform?.at(subindex)?.get('JobPipeline').disable();
        subChildform?.at(subindex)?.get('Active').disable();
        subChildform?.at(subindex)?.patchValue({
          JobPipeline: 0,
          Active: 0
        });
      })
    }

  }



  /* 
 @Type: File, <ts>
 @Name: getGroupCheckListAll function
 @Who: Nitin Bhati
 @When: 03-Aug-2022
 @Why: EWM-8085
 @What: For Group Checklist listing 
*/
  getGroupCheckListAll(search) {
    this.jobWorkflowService.getGroupChecklistList('?search='+search).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          //this.checkList = repsonsedata.Data;
          repsonsedata.Data.forEach(element => {
            element['IsSelected'] = 0;
          })
          this.checkList = Array.from(repsonsedata.Data);
          this.checkChildList = Array.from(repsonsedata.Data);
          this.checkSubchildList = Array.from(repsonsedata.Data);
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  selectLevelOneCheckListList($event: any, tag, i, j, k) {
    $event.stopPropagation();
    $event.preventDefault();
    if (tag.IsSelected === 1) {
      if (i != null && j == null && k == null) {
        tag.IsSelected = 0
      }
      if (j != null && k == null) {
        tag.IsSelected = 0
      }
      if (k != null) {
        tag.IsSelected = 0
      }
    } else {
      if (i != null && j == null && k == null) {
        tag.IsSelected = 1
      }
      if (j != null && k == null) {
        tag.IsSelected = 1
      }
      if (k != null) {
        tag.IsSelected = 1
      }
    }


  }


  selectLevelCheckListList($event: any, tag, i, j, k) {
    const parentform = this.JobWorkForm.get('Stages') as FormArray;
    // let parentArray=parentform.controls[i].value.ChecklistId;
    // this stops the menu from closing
    $event.stopPropagation();
    $event.preventDefault();
    if (tag.IsSelected === 1) {
      if (i != null && j == null && k == null) {
        parentform.controls[i].value.ChecklistId.forEach(x => {
          if (x.Id === tag.Id) {
            x.IsSelected = 0;
          }
        });
      }
      const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
      if (j != null && k == null) {
        childform.controls[j].value.ChecklistId.forEach(x => {
          if (x.Id === tag.Id) {
            x.IsSelected = 0;
          }
        });
      }
      const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i)?.get('Stages') as FormArray).at(j)?.get('Stages') as FormArray;
      if (k != null) {
        subChildform.controls[k].value.ChecklistId.forEach(x => {
          if (x.Id === tag.Id) {
            x.IsSelected = 0;
          }
        });
      }
    } else {
      if (i != null && j == null && k == null) {
        parentform.controls[i].value.ChecklistId.forEach(x => {
          if (x.Id === tag.Id) {
            x.IsSelected = 1;
          }
        });
      }
      const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
      if (j != null && k == null) {
        childform.controls[j].value.ChecklistId.forEach(x => {
          if (x.Id === tag.Id) {
            x.IsSelected = 1;
          }
        });
      }
      const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i)?.get('Stages') as FormArray).at(j)?.get('Stages') as FormArray;
      if (k != null) {
        subChildform.controls[k].value.ChecklistId.forEach(x => {
          if (x.Id === tag.Id) {
            x.IsSelected = 1;
          }
        });
      }
    }
    // console.log("parentForm:",parentform);
  }
  checkBoxStatus(i) {

  }

  public onChangeToggle(event, i, j, k) {
    if (event) {
      if (i != null && j == null && k == null) {
        this.checklistStatus[i] = 0;
      }
      if (j != null && k == null) {
        this.checklistStatus[j] = 0;
      }
      if (k != null) {
        this.checklistStatus[k] = 0;
      }
    } else {
      if (i != null && j == null && k == null) {
        this.checklistStatus[i] = 1;
      }
      if (j != null && k == null) {
        this.checklistStatus[j] = 1;
      }
      if (k != null) {
        this.checklistStatus[k] = 1;
      }
    }

  }


  openCheckListToggle(tag) {
     tag?.forEach(function (elem) { 
             elem.IsSelected=0;
              });

  }


  closeToggel($event: any, tag, i, j, k) {
    // $event.stopPropagation();
    //$event.preventDefault();
    let res = tag.some(item => item.IsSelected === 1);
    if (res) {
      // console.log(res,"res");
    } else {
      if (i != null && j == null && k == null) {
        const parentform = this.JobWorkForm.get('Stages') as FormArray;
        parentform.controls[i].patchValue({
          IsMapChecklist: false
        })
        //  this.checklistStatus[i] = 0;
      }
      const childform = (<FormArray>this.JobWorkForm.controls['Stages']).at(i).get('Stages') as FormArray;
      if (j != null && k == null) {
        childform.controls[j].patchValue({
          IsMapChecklist: false
        })
        //this.checklistStatus[j] = 0;
      }
      const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages']).at(i)?.get('Stages') as FormArray).at(j)?.get('Stages') as FormArray;
      if (k != null) {
        subChildform.controls[k].patchValue({
          IsMapChecklist: false
        })
        //    this.checklistStatus[k] = 0;
      }
    }

  }



 



 /*
    @Type: File, <ts>
    @Name: openMapChecklistModule
    @Who: Suika
    @When: 06-09-2022
    @Why: ROST-7489.EWM-8426
    @What: for open add checklist map
    */
   openMapChecklistModule(event, i, j, k, ChecklistArray) {
    if (event == 1 || event == true) {
      const dialogRef = this.dialog.open(MapChecklistComponent, {
        data: { ChecklistArray: ChecklistArray },
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
        if (resData.inputArray?.length > 0 && resData.res == true) {
          this.ChecklistId = resData.inputArray;
          const parentform = this.JobWorkForm.get('Stages') as FormArray;
          if (i != null && j == null && k == null) {
            parentform.at(i).patchValue({
              ChecklistId: this.ChecklistId
            });
          }

          const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
          if (j != null && k == null) {
            childform?.at(j)?.patchValue({
              ChecklistId: this.ChecklistId
            });
          }

          const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;
          if (k != null) {
            subChildform.at(k).patchValue({
              ChecklistId: this.ChecklistId
            });
          }

        } else if (resData.inputArray?.length == 0 && resData.res == true) {
          this.ChecklistId = resData.inputArray;
          const parentform = this.JobWorkForm.get('Stages') as FormArray;
          if (i != null && j == null && k == null) {
            parentform?.at(i)?.patchValue({
              IsMapChecklist: 0,
              ChecklistId: []
            });
          }

          const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
          if (j != null && k == null) {
            childform?.at(j).patchValue({
              IsMapChecklist: 0,
              ChecklistId: []
            });
          }

          const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;
          if (k != null) {
            subChildform?.at(k).patchValue({
              IsMapChecklist: 0,
              ChecklistId: []
            });
          }

        } else if (resData.res == false) {
          this.loading = false;
          if (resData.inputArray?.length == 0) {
            const parentform = this.JobWorkForm.get('Stages') as FormArray;
            if (i != null && j == null && k == null) {
              parentform?.at(i)?.patchValue({
                IsMapChecklist: 0,
                ChecklistId: []
              });
            }

            const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
            if (j != null && k == null) {
              childform?.at(j)?.patchValue({
                IsMapChecklist: 0,
                ChecklistId: []
              });
            }

            const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;
            if (k != null) {
              subChildform?.at(k).patchValue({
                IsMapChecklist: 0,
                ChecklistId: []
              });
            }
          } else {
            this.ChecklistId = resData.inputArray;
            const parentform = this.JobWorkForm.get('Stages') as FormArray;
            if (i != null && j == null && k == null) {
              parentform?.at(i)?.patchValue({
                IsMapChecklist: 1,
                ChecklistId: this.ChecklistId
              });
            }

            const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
            if (j != null && k == null) {
              childform?.at(j)?.patchValue({
                IsMapChecklist: 1,
                ChecklistId: this.ChecklistId
              });
            }

            const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;
            if (k != null) {
              subChildform?.at(k)?.patchValue({
                IsMapChecklist: 1,
                ChecklistId: this.ChecklistId
              });
            }

          }
        }
      })
    } else {
      return;
  
    }
    
  }
 
/*
  @Type: File, <ts>
  @Name: onCancelMapFeatures
  @Who: Adarsh singh
  @When: 29-12-2022
  @Why: ROST-9390.EWM-10074
  @What: for close  menu 
*/
  onCancelMapFeatures(i){
    // this.trigger.toArray()[i].closeMenu();
    this.menuSubChilds.closeMenu();
  }
 /*
  @Type: File, <ts>
  @Name: onChangeFun
  @Who: Adarsh singh
  @When: 29-12-2022
  @Why: ROST-9390.EWM-10074
  @What: for searching data while enter in input text
*/
  onChangeFun(e){
    let value = e.target.value.toUpperCase();
    // let names = document.querySelector(".mapFeaturesMenuBox");
    let rows:any = document.querySelectorAll(".define-map-features .define-map-features-list .search-value"); 
    for (let i = 0; i < rows.length; i++) {
      let column:any = rows[i];
      let language = column.textContent;
      setTimeout(() => {
        rows[i].parentElement.style.display =language.toUpperCase().indexOf(value) > -1 ? "" : "none";
      }, 300);
    }
  }
  
 /*
  @Type: File, <ts>
  @Name: getDisplayType
  @Who: Adarsh singh
  @When: 29-12-2022
  @Why: ROST-9390.EWM-10074
  @What: for searching data while enter in input text
*/
  getDisplayType(element) {
    var elementStyle = element.currentStyle || window.getComputedStyle(element, "");
    return elementStyle.display;
  }
/*
  @Type: File, <ts>
  @Name: getDeafultWorkflow
  @Who: Renu
  @When: 30-12-2022
  @Why: ROST-9388.EWM-10001
  @What: getting the last and first stage of the workflow
*/
  getDeafultWorkflow(){
    this.jobWorkflowService.getDefaultWorkflow().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.dataArr = data.Data;          
          //this.updateArr=data.Data;
          this.nodes.push({
            name: '',
            cssClass: 'ngx-org-workflow',
            title: '',
            image: '',
            childs: []
          })
          let ForBlankColorCode = "https://res-dev-ewm.entiredev.in/EWM/RESOURCES/IMAGES/FFFFFF.PNG";
          const parentInfo = this.JobWorkForm.get('Stages') as FormArray;
          parentInfo.clear();
          this.dataArr.forEach((x, i) => {
            this.nodes[0].childs.push({
              name: x.Code,
              cssClass: 'ngx-org-parent',
              // title:x.StageDesc,
              // color:x.ColorCode,
              image: ForBlankColorCode,
              childs: []
            })
            parentInfo.push(
              this.fb.group({
                StageName: [x['Code'], [Validators.required, Validators.maxLength(50), RxwebValidators.unique()]],
                StageDesc: ['', [Validators.maxLength(100)]],
                //Active: Boolean(Number(x['Status'])),
                Active:new FormControl({
                  value:true,
                  disabled:true
                }),
                BuiltIn: false,
                ColorCode: this.stageBgColor,
                ColorCodeUrl: '',
                DisplaySeq: x['DisplaySequence'],
                JobPipeline:new FormControl(
                  {
                   value:true,
                   disabled:true
                  }),
               // JobPipeline: new FormControl({ value: Boolean(Number(x['Status'])) == true ? Boolean(Number(x['IsIncludeInPipeline'])) : false, disabled: Boolean(Number(x['Status'])) ? false : true }),
                AutomatedActions: false,
                IsMapAssessmentTest: false,
                AssessmentId: [],
                IsMapChecklist:false,
                ChecklistId: [],
                StageId: 0,
                InternalCode: '',
                ParentStageId: 0,
                IsDeleted: '',
                WorkflowInternalCode: '',
                Stages: this.fb.array([]),
                IsNew: [0],
                IsMapWorkflowFeature: false,
                stageType: x['StageType'],
                StageTypeInternalCode:x['Id'],
                StageTypeColorCode:x['ColorCode'],
                StageTypeCode:x['Code'],
                IsFirstStage:x['Code']=='Applied'?1:0,
                IsLastStage:x['Code']=='Hired'?1:0,
                IsStageType:true
              })
            );
            if (this.mode == 'R') {
              parentInfo.disable();
            }
          });
         
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
   @Name: createSection
   @Who: Renu
   @When: 03-Jan-2023
   @Why: ROST-9387 ROST-9992
   @What: when user click on add to create form group with same formcontrol
   */
   createStages(): FormGroup {
    return this.fb.group({
      Id: [''],
      Code: [''],
      ColorCode:[],
      DisplaySequence:[],
      stageCheck:[false]
    });
  }

  /* 
  @Type: File, <ts>
  @Name: getWorkFlowStageList function
  @Who: Renu
  @When: 03-Jan-2023
  @Why: ROST-9388 EWM-10001
  @What: get workflowStage List 
  */

getWorkFlowStageList(){
  this.jobWorkflowService.workflowapplicationstages().subscribe(
    (repsonsedata: Industry)  => {
      if (repsonsedata.HttpStatusCode ==200 || repsonsedata.HttpStatusCode ==204) {
        this.loading = false;         
        this.stagesTag = repsonsedata.Data;
        this.stagesTagCopy =  [ ...this.stagesTag ];
        //this.stageTypePatch();
        
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    }, err => {
      if(err.StatusCode==undefined)
      {
        this.loading=false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      this.loading = false;
    })
}

     /*
    @Type: File, <ts>
    @Name: onSlideStage function
    @Who: Renu
    @When: 03-Jan-2023
    @Why: EWM-9388 EWM-10001
    @What: on select stage type 
    */
   
    onSlideStage($event,index:number,eventType:String,stageType:any){
      this.disabledSaveBtn=false;
      this.addstage=true;
      this.matmenuTriggerCloseAll(index);
      this.eventType=eventType;
      this.stageTypeIndex=index;
      const control=<FormArray>this.stageForm.controls['stageInfo'];
      if ($event==false) { //by maneesh,what:ewm-16752 when:26/06/2024
      let ind =this.newSelectedStageTag.findIndex(elem => elem['stageName'] == stageType);
      this.newSelectedStageTag.splice(ind, 1); 
      this.disabledSaveBtn=false;
      this.requiredStageType[index] = true;            
      }
      if(eventType=='Add'){
        const parentform = this.JobWorkForm.get('Stages') as FormArray; 
        // if(this.fisrtStage===true){
        //   this.stagesTag= this.stagesTag.filter(x=>x['Code']!=='Applied');
        // }else if(this.lastStage===true){
        //   this.stagesTag= this.stagesTag.filter(x=>x['Code']!=='Hired');
        // }
        control.clear();
        if(this.stagesTag.length>0){
        this.stagesTag.forEach((x) => {
        control.push(
          this.fb.group({      
           Id: [x['Id']],
           Code: [x['Code']],
           ColorCode:[x['ColorCode']],
           DisplaySequence:[x['DisplaySequence']],
           stageCheck:[false]
          })
        );
        })
        }
    
        if($event===true){
          this.stageTypeTrigger.toArray()[index].openMenu();
         this.stageIndex=index;
        this.requiredStageType[index] = false; //by maneesh ewm-16752
        }else{
        // this.checkStagesOnAdd(parentform,index);
         this.stageTypeTrigger.toArray()[index].closeMenu();
          this.clearStageData(parentform,index);
        }
       
      }else{
        //this.checkStagesOnEdit(stageType);
       this.editStageTypeName=this.JobWorkForm.value.Stages[this.stageTypeIndex]?.StageTypeCode;//by maneesh ewm-16752
        let Id=this.JobWorkForm.value.Stages[index].StageTypeInternalCode;
        this.selectedStage[Id]=Id;
        this.stageTypeTrigger.toArray()[index].openMenu();
        this.updateStagesOnEdit(Id);
    }
    }

    matmenuTriggerCloseAll(index){
      this.stageTypeTrigger.toArray().forEach((item: MatMenuTrigger, i: number) => {
        if(i !== index && item.menuOpen) {
          item.closeMenu();
          this.onCancel();
        }
      });
    }
  /*
  @Type: File, <ts>
  @Name: updateStagesOnEdit
  @Who: Renu
  @When: 27-Dec-2022
  @Why: ROST-9387 EWM-9992
  @What:update stages for first & last  on Edit
  */
  updateStagesOnEdit(Id:any){
    const control=<FormArray>this.stageForm.controls['stageInfo'];
    control.clear();
    if(this.stagesTag.length>0){
      let stageCheck:boolean;
      this.stagesTag.forEach((x) => {
        if(Id===x['Id']){
          stageCheck=true;
        }else{
          stageCheck=false;
        }
         control.push(
         this.fb.group({      
          Id: [x['Id']],
          Code: [x['Code']],
          ColorCode:[x['ColorCode']],
          DisplaySequence:[x['DisplaySequence']],
          stageCheck:[stageCheck]
         })
       );
     });
    }
  }
  /*
  @Type: File, <ts>
  @Name: checkStagesOnEdit
  @Who: Renu
  @When: 27-Dec-2022
  @Why: ROST-9387 EWM-9992
  @What:check stages for first & last  on Edit
  */
  // checkStagesOnEdit(stageType:string){
  //   if(stageType==='Applied'){
  //     let indexA =  this.stagesTag.filter(x=>x['Code']==='Applied');
  //     if(indexA.length==0)
  //     {
  //       this.stagesTag.unshift(this.stagesTagCopy[0]);
  //     }
    
  //    }else if(stageType==='Hired'){
  //     let indexH =  this.stagesTag.filter(x=>x['Code']==='Hired');
  //     if(indexH.length==0)
  //     {
  //       this.stagesTag.push(this.stagesTagCopy[this.stagesTagCopy.length-1]);
  //     }
  //    }
  // }

  /*
  @Type: File, <ts>
  @Name: checkStagesOnAdd
  @Who: Renu
  @When: 27-Dec-2022
  @Why: ROST-9387 EWM-9992
  @What:check stages for first & last  on ADD
  */
  checkStagesOnAdd(parentform,index:number){
    if(parentform.at(index).get('StageTypeCode').value==='Applied'){
      this.fisrtStage=false;
      let indexA =  this.stagesTag.filter(x=>x['Code']==='Applied');
      if(indexA.length==0)
      {
        this.stagesTag.unshift(this.stagesTagCopy[0]);
      }
    }else if(parentform.at(index).get('StageTypeCode').value==='Hired'){
      this.lastStage=false;
      let indexH =  this.stagesTag.filter(x=>x['Code']==='Hired');
      if(indexH.length==0)
      {
        this.stagesTag.push(this.stagesTagCopy[this.stagesTagCopy.length-1]);
      }
    }
  }
/*
@Type: File, <ts>
@Name: clearStageData
@Who: Renu
@When: 03-Jan-2023
@Why: ROST-9388 EWM-10001
@What: for getting the formarray with this instance
*/
  clearStageData(parentform:FormArray,index:number)
  {
       parentform?.at(index)?.patchValue({
          StageTypeInternalCode: null,
          StageTypeCode:'',
          StageTypeColorCode:'',
          stageType:'',
          IsStageType:false
        });
  }
    /*
   @Type: File, <ts>
   @Name: stageTypePatch
   @Who: Renu
   @When: 03-Jan-2023
   @Why: ROST-9388 EWM-10001
   @What: create stage type list 
   */
  stageTypePatch(){
    const parentform = this.JobWorkForm.get('Stages') as FormArray; 
    const control=<FormArray>this.stageForm.controls['stageInfo'];
      control.clear();
      if(this.stagesTag.length>0){
        this.stagesTag.forEach((x) => {
          if(x.Code==='Applied'){
            //this.stagesTag.shift();
            this.fisrtStage=true;
            this.enableActiveJobPipeLine(parentform,true);
          }else if(x.Code==='Hired'){
           // this.stagesTag.pop();
            this.lastStage=true;
            this.enableActiveJobPipeLine(parentform,true);
          }else{
            this.fisrtStage=false;
            this.lastStage=false;
            this.enableActiveJobPipeLine(parentform,false);
          }
        control.push(
           this.fb.group({      
            Id: [x['Id']],
            Code: [x['Code']],
            ColorCode:[x['ColorCode']],
            DisplaySequence:[x['DisplaySequence']],
            stageCheck:[false]
           })
         );
       });
      }
  }

  /*
  @Type: File, <ts>
  @Name: stageInfo
  @Who: Renu
  @When: 03-Jan-2021
  @Why: ROST-9388 EWM-10001
  @What: for getting the formarray with this instance
  */

  stageInfo() : FormArray {
    return this.stageForm.get("stageInfo") as FormArray
  }

  /*
    @Type: File, <ts>
    @Name: onCancel function
    @Who: Renu
    @When: 04-Jab-2022
    @Why: EWM-9388 EWM-10001
    @What: on dismiss the stage type popup
    */
    onCancel(type?:number){
      if(this.eventType==='Add'){
        const stageform = this.JobWorkForm.get('Stages') as FormArray; 
        stageform.controls[this.stageTypeIndex].patchValue({
          IsStageType:false
        });
      }
      this.searchTextTag='';
       // start by maneesh fixed save enabel and disabled when click edit icon then open popup and click cansel btn
       if (this.eventType?.toLocaleLowerCase()=='edit'){  
        this.requiredStageType[type]= false; 
        this.addstage=false;
      }
        else if (this.eventType?.toLocaleLowerCase()=='add'){
        this.requiredStageType[type]= true;    
      }
      this.searchTextTag='';
 // end by maneesh fixed save enabel and disabled when click edit icon then open popup and click cansel btn
    }

  /*
    @Type: File, <ts>
    @Name: selectStageList function
    @Who: Renu
    @When: 04-Jan-2022
    @Why: EWM-9388 EWM-10001
    @What: on select stage type 
    */
    selectStageList($event,Id:any,code:string,tag) {
      if($event.checked==true){
        this.selectedStage[Id]=Id;
        this.disabledSaveBtn=false; 
        this.stageName=tag?.value?.Code; //by maneesh
      }
            // start by maneesh,what:ewm-16752 when:26/06/2024
            this.disabledSaveBtn=false;            
            this.newSelectedStageTag.forEach((x) => {                        
              if (x?.stageName?.toLocaleLowerCase()==this.stageName?.toLocaleLowerCase() && $event.checked && this.stageName?.toLocaleLowerCase()!="others"
              ) {
               this.disabledSaveBtn=true;
              }
              }) 
              // end by maneesh,what:ewm-16753 when:06/06/2024 
      this.stageInfo().controls.filter(x=>{
        if(x.get('Code').value!==code){
          x.get('stageCheck').setValue(false);
        }
      })
    }
     /*
    @Type: File, <ts>
    @Name: selectTagList function
    @Who: Renu
    @When: 05-Jan-2022
    @Why: EWM-9388 EWM-10001
    @What: selected stage list 
    */
    onSaveStage(){
      const parentform = this.JobWorkForm.get('Stages') as FormArray; 
      const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(this.stageIndex)?.get('Stages') as FormArray; 
      this.stageForm.value.stageInfo.forEach(ele=> {
        if(ele.stageCheck==true){
          if(ele.Code==='Applied'){
           // this.stagesTag.shift();
            this.fisrtStage=true;
            this.enableActiveJobPipeLine(parentform,true);
          }else if(ele.Code==='Hired'){
            //this.stagesTag.pop();
            this.lastStage=true;
            this.enableActiveJobPipeLine(parentform,true);
          }else{
            this.fisrtStage=false;
            this.lastStage=false;
            this.enableActiveJobPipeLine(parentform,false);
          }
          if (this.eventType=='Edit') {
              let ind =this.newSelectedStageTag.findIndex(elem => elem['stageName'] == this.editStageTypeName);
              this.newSelectedStageTag.splice(ind, 1);
            }
          this.newSelectedStageTag.push({ //by maneesh,what:ewm-16752 when:26/06/2024
            'stageName':this.stageName,
          })  
          this.addstage=false;          
          this.requiredStageType[this.indexNumber] = false;   
          parentform?.at(this.stageTypeIndex)?.patchValue({
            IsFirstStage:this.fisrtStage?1:0,
            IsLastStage:this.lastStage?1:0,
            StageType:ele.stageCheck,
            StageTypeInternalCode: ele.Id,
            StageTypeCode: ele.Code,
            StageTypeColorCode:ele.ColorCode
          });
          childform?.controls.forEach(element => {
            element.patchValue({
              IsFirstStage:this.fisrtStage?1:0,
              IsLastStage:this.lastStage?1:0,
              StageType:ele.stageCheck,
              StageTypeInternalCode: ele.Id,
              StageTypeCode: ele.Code,
              StageTypeColorCode:ele.ColorCode
            })
            const subChildform = element.get('Stages') as FormArray;
            subChildform?.controls.forEach(subChild => {
              subChild.patchValue({
                IsFirstStage:this.fisrtStage?1:0,
                IsLastStage:this.lastStage?1:0,
                StageType:ele.stageCheck,
                StageTypeInternalCode: ele.Id,
                StageTypeCode: ele.Code,
                StageTypeColorCode:ele.ColorCode
            })
          })
          });
        } 
      });
      this.searchTextTag='';
      this.parentInfo().value.forEach((x) => {   //by maneesh,what:ewm-16752 when:26/06/2024  
        if (x?.StageTypeCode=='' || x?.StageTypeCode==null ) {
        this.addstage=true;   
      }
        })
     //this.stageTypePatch();
    }

    /*
    @Type: File, <ts>
    @Name: enableActiveJobPipeLine function
    @Who: Renu
    @When: 05-Jan-2022
    @Why: EWM-9388 EWM-10001
    @What: enabling active status & job pipeline in case of first/last stage
    */
    enableActiveJobPipeLine(parentform:any,status:boolean){
      // parentform?.at(this.stageTypeIndex)?.patchValue({
      //   'Active':status?1:0,
      //   'JobPipeline':status?1:0
      // });
    
      if(status==true){
        parentform?.at(this.stageTypeIndex)?.get('JobPipeline').disable();
        parentform?.at(this.stageTypeIndex)?.get('Active').disable();
      }else{
        parentform?.at(this.stageTypeIndex)?.get('Active').enable();
      }
    }
     /*
@Type: File, <ts>
@Name: moveItemInArrayIfAllowed function
@Who: Renu
@When: 05-Dec-2022
@Why: EWM-8902 EWM-9112
@What: drop sections
*/

 private moveItemInArrayIfAllowed(array: any[],fromIndex: number,toIndex: number): void {
  const from = this.clamp(fromIndex, array.length - 1);
  const to = this.clamp(toIndex, array.length - 1);

  if (from === to) {
    return;
  }

  const target = array[from];
  const delta = to < from ? -1 : 1;

  const affectedItems = array.filter((item, index) =>
   delta > 0 ? index >= from && index <= to : index >= to && index <= from 
  );
  if (affectedItems.some((i) => (i.value.StageTypeCode=='Applied' || i.value.StageTypeCode=='Hired') ?true:false)) {
    return;
  }
  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }
  array[to] = target;
  /*** @When: 17-07-2023 @Who:bantee @Why: EWM-12471 @What: When user swaps any two job workflow stage, color code of those stage is not swapped. **/

  let bgcolor=this.selctedColor[fromIndex];
  this.selctedColor[fromIndex]=this.selctedColor[toIndex] ;
  this.selctedColor[toIndex]=bgcolor;
 }

 /*
    @Who: Renu
    @When: 04-Jan-2023
    @Why: ROST-9387 ROST-9993
    @What: to compare objects selected
  */
    compareFn(c1: any, c2: any): boolean {
      return c1 && c2 ? c1.Id === c2.Id : c1 === c2;
    }

/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: Renu
  @When: 14-Mar-2023
  @Why: EWM-10634 EWM-11123
  @What: for open color picker dropdown
*/
showColorPallate(e:any, stage:string,i: number, j: number, k: number) {
  if (stage === 'parent') {
    this.showColorPallateContainer[i] =!this.showColorPallateContainer[i];
  }if (stage === 'child') {
    this.showColorPallateContainerChild[i+'_'+j] =!this.showColorPallateContainer[i+'_'+j];
  } if (stage === 'subchild') {
    this.showColorPallateContainerSubchild[i+'_'+j+'_'+k]=!this.showColorPallateContainer[i+'_'+j+'_'+k];
  }
 
}

/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: Renu
  @When: 14-Mar-2023
  @Why: EWM-10634 EWM-11123
  @What: for which color we have choose
*/
onSelectColor(codes: any,stage: string, i: number, j: number, k: number) {    
  const parentform = this.JobWorkForm.get('Stages') as FormArray;
  const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
  const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;

  if (stage === 'parent') {
    if(codes){
      this.selctedColor[i] = codes.colorCode;
    }else{
      this.selctedColor[i] = null;
    }
    parentform?.at(i)?.patchValue({
      ColorCode: this.selctedColor[i]
    });
    
  }
  if (stage === 'child') {
    if(codes){
      this.selctedColor[i+'_'+j]= codes.colorCode;
    }else{
      this.selctedColor[i+'_'+j]=null;
    }
    childform?.at(j)?.patchValue({
      ColorCode:  this.selctedColor[i+'_'+j]
    });
    
  }
  if (stage === 'subchild') {
    if(codes){
      this.selctedColor[i+'_'+j+'_'+k]= codes.colorCode;
    }else{
      this.selctedColor[i+'_'+j+'_'+k]=null;
    }
    subChildform?.at(k).patchValue({
      ColorCode:  this.selctedColor[i+'_'+j+'_'+k]
    });
   
  }
  
}
/*
  @Type: File, <ts>
  @Name: getColorCodeAll funtion
  @Who: Renu
  @When: 14-Mar-2023
  @Why: EWM-10634 EWM-11123
  @What: get all custom color code from config file
*/
getColorCodeAll() {
  this.loading = true;
  this.commonserviceService.getAllColorCode().subscribe((data: ResponceData) => {
    this.loading = false;
    this.themeColors = data[0]?.themeColors;
    this.standardColor = data[1]?.standardColors;
  },
    err => {
      this.loading = false;
    })
}

/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: Renu
  @When: 14-Mar-2023
  @Why: EWM-10634 EWM-11123
  @What: close dropdown while click on more label
*/
closeTemplate() {
  //this.showColorPallateContainer = true;
  this.isMoreColorClicked = true;
  setTimeout(() => {
    this.isMoreColorClicked = false;
  }, 100);
}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: Renu
  @When: 14-Mar-2023
  @Why: EWM-10634 EWM-11123
  @What: selecting color on change
*/
onChaneColor(getColor: any, stage: string, i: number, j: number, k: number) {
  this.color = getColor.target.value;
  if(stage=== 'parent'){
    this.selctedColor[i] = getColor.target.value;
  }
  if (stage === 'child') {
    this.selctedColor[i+'_'+j] = getColor.target.value;
  }
  if (stage === 'subchild') {
    this.selctedColor[i+'_'+j+'_'+k] = getColor.target.value;
  }

  const parentform = this.JobWorkForm.get('Stages') as FormArray;
  const childform = (<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray;
  const subChildform = ((<FormArray>this.JobWorkForm.controls['Stages'])?.at(i)?.get('Stages') as FormArray)?.at(j)?.get('Stages') as FormArray;

  if (stage === 'parent') {
    parentform?.at(i)?.patchValue({
      ColorCode: this.selctedColor[i]
    });
  }
  if (stage === 'child') {
    childform?.at(j)?.patchValue({
      ColorCode:  this.selctedColor[i+'_'+j]
    });
  }
  if (stage === 'subchild') {
    subChildform?.at(k).patchValue({
      ColorCode:  this.selctedColor[i+'_'+j+'_'+k]
    });
  }
}
/*
  @Type: File, <ts>
  @Name: CandidateJobCount
  @Who: Renu
  @When: 02-12-2022
  @Why: ROST-11814.EWM-12293
  @What: candidate job count to check workflow exists in other jobs or not
*/
CandidateJobCount(jobId:any){
  this.jobWorkflowService.CandidateJobCount(jobId).subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        this.editForm(jobId);
        if(data.Data==true){
          this.workflowUsed=true;
        }else{
          this.workflowUsed=false;
        }

      }
      else {
        this.loading = false;
        this.workflowUsed=false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
      }
    },
    err => {
      this.loading = false;
      this.workflowUsed=false;
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

}


export function requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
  return function validate (formGroup: FormGroup) {
    let checked = 0;
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];
      if (control.value.stageCheck === true) {
        checked ++;
      }
    });
    if (checked !== minRequired) {
      return {
        requireCheckboxesToBeChecked: true,
      };
    }
    return null;
  };
}