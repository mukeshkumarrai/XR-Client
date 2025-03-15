/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: knock-ques.component.ts
 @Who: Renu
 @When: 03-June-2022
 @Why: ROST-6558 EWM-6782
 @What: knock ques component
 */
import { Component, EventEmitter, Input, OnInit, Output, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Actions } from '../interface/actions';
import { knockOutInfo, personalInfo } from '../interface/applicationInfo';
import { ActionserviceService } from '../shared/actionservice.service';
import { PreviewSaveService } from '../shared/preview-save.service';

@Component({
  selector: 'app-knockout-ques',
  templateUrl: './knockout-ques.component.html',
  styleUrls: ['./knockout-ques.component.scss']
})
export class KnockoutQuesComponent implements OnInit {
  loading: boolean = false;
  knockoutQuestionList: [] = [];
  public knockQuesForm: FormGroup;
  @Input() totalStepsCount: number;
  currentStep: any;
  submitActive: boolean;
  applicationParam: string;
  @Output() stepperNext= new EventEmitter<any>();
  mode: any;
  private actions: Actions;
  knockOutData: knockOutInfo;
  personalInfo: personalInfo;
  autoFill: any;
  JobTittle: any;
  applicationId: any;
  JobId: any;
  docsInfo: personalInfo;
  @Input() ApplicationFormId:any;
  orgName: any;
  candidateId: any;
  @Input() lableTitleName: string;
  constructor(private snackBService: SnackBarService, private jobService: JobService, private translateService: TranslateService,
    private routes: ActivatedRoute, private fb: FormBuilder, private commonserviceService: CommonserviceService,
    private actionsService: ActionserviceService, private previewSaveService: PreviewSaveService, private router: Router) {
    this.knockQuesForm = this.fb.group({
      QuesInfo: this.fb.array([])
    });
    this.actions = this.actionsService.constants;
  }

  ngOnInit(): void {
    this.commonserviceService.onstepperInfoChange.subscribe(res => {
      this.currentStep = res + 1;
      if (this.totalStepsCount == this.currentStep) {
        this.submitActive = true;
      }else{
        this.submitActive = false;
      }
    })

    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.applicationId) {
        this.applicationId = parms?.applicationId;
        this.applicationParam = '?applicationId=' + parms?.applicationId;
      } else if (parms?.jobId) {
        this.JobId = parms?.jobId;
        this.applicationParam = '?jobId=' + parms?.jobId;
      }
      if (parms?.mode) {
        this.mode = parms?.mode;
      }
    })
    this.getKnockoutQuestionById(this.applicationParam);

    this.previewSaveService.personalInfoChange.subscribe((data: personalInfo) => {
      this.personalInfo = data;
    });


    this.previewSaveService.onIsAutoFillInfoChange.subscribe((res: any) => {
      this.autoFill = res;
    });

    this.previewSaveService.onJobInfoChange.subscribe((res: any) => {
      this.JobTittle = res;
    });

    this.previewSaveService.ondocumentInfoChange.subscribe((res: personalInfo) => {
      this.docsInfo = res;
    });

    this.previewSaveService.currentCandidateExistsInfo.subscribe(res => {
      if (res?.CandidateId) {
        this.candidateId = res.CandidateId;
      }
    });
  }

  /*
  @Type: File, <ts>
  @Name: QuesInfo
  @Who: Renu
  @When: 03-June-2022
  @Why:  ROST-6558 EWM-6782
  @What: for getting the formarray with this instance
  */
  QuesInfo(): FormArray {
    return this.knockQuesForm.get("QuesInfo") as FormArray
  }
  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Renu
     @When: 03-June-2022
     @Why: EWM-6558 EWM-6782
     @What: on save pop-up button file
   */

  onConfirm(): void {
    let top = document.getElementById('preview-section');
    top.scrollTop = 0;
    if (this.mode == 'apply') {

      if (this.knockQuesForm.invalid) {
        return;
      }
      this.saveKnockOutQues();

    } else {
      this.stepperNext.emit(true);
    }

  }

  /*
   @Type: File, <ts>
   @Name: saveKnockOutQues
   @Who:Renu
   @When: 03-June-2022
   @Why: EWM-6558 EWM-6782
   @What: for saving knock out  data
   */

  saveKnockOutQues() {
    
    this.previewSaveService.setActionRunnerFn(this.actions.KNOCK_OUT, this.knockQuesForm.value.QuesInfo);
    this.stepperNext.emit(true);
  }

  /*
  @Type: File, <ts>
  @Name: getKnockoutQuestionById function
  @Who:Renu
  @When: 03-June-2022
  @Why: EWM-6678
  @What: get data list for knockout Question
  */
  getKnockoutQuestionById(ApplicationFormId: any) {
    this.loading = true;
    this.jobService.getKnockoutQuestionAll(ApplicationFormId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            this.knockoutQuestionList = data?.Data;
            const control = <FormArray>this.knockQuesForm.controls['QuesInfo'];
            control.clear();
            if (this.knockoutQuestionList.length > 0) {
              this.knockoutQuestionList.forEach((x, i) => {
                control.push(
                  this.fb.group({
                    Id: [x['Id']],
                    Question: [x['Question']],
                    correctAnswer: [x['Answer']],
                    Answer: ['', [Validators.required]],
                    DisplaySequence: [x['DisplaySequence']]
                  })
                )
              });
            }
          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
 @Type: File, <ts>
 @Name: saveApplicationInfo
 @Who:Renu
 @When: 03-June-2022
 @Why: EWM-6558 EWM-6782
 @What: for saving application overall  data
*/
  saveApplicationInfo() {
    let top = document.getElementById('preview-section');
    top.scrollTop = 0;
    if (this.mode == 'apply') {
      this.loading = true;
      let res = this.knockQuesForm.value.QuesInfo;
      let constchangedObjects = res.filter(x => x.Answer == x.correctAnswer);
     // if (constchangedObjects.length == this.knockoutQuestionList.length) {
        this.previewSaveService.konckoutStatus.next((constchangedObjects.length == this.knockoutQuestionList.length)?1:0);
        this.previewSaveService.onknockOutInfoChange.subscribe((data: knockOutInfo) => {
          if (data) {
            this.loading = false;
            this.knockOutData = data;
          } else {
            let obj = {};
            obj['KnockoutQuestions'] = this.knockQuesForm.value.QuesInfo;
            obj['PersonalInfo'] = this.personalInfo;
            obj['ApplicationFormId'] = this.applicationId ? this.applicationId : this.ApplicationFormId;
            obj['JobId'] = this.JobId ? this.JobId : '';
            obj['JobTitle'] = this.JobTittle ? this.JobTittle : '';
            obj['Documents'] = this.docsInfo;
            obj['IsAutoFill'] = this.autoFill;
            obj['IsKnockoutSuccess']=(constchangedObjects.length == this.knockoutQuestionList.length)?1:0;
            obj['CandidateId']=this.candidateId;
            
            this.jobService.saveApplicationPreview(obj).subscribe(
              (repsonsedata: ResponceData) => {
                if (repsonsedata.HttpStatusCode === 200) {
                  this.loading = false;
                  this.orgName=repsonsedata.Data.OrgName;
                  this.previewSaveService.orgName.next(this.orgName);
                  this.previewSaveService.successMsg.next(repsonsedata.Data?.ThankyouMessage);
                  if (constchangedObjects.length == this.knockoutQuestionList.length) {
                  this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
                  }else{
                    this.router.navigate(['./application/success'], { queryParams: { req: 0 } });
                  }
                } else {
                  this.loading = false;
                }
              }, err => {
                this.loading = false;
                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
              })
          }
        });
      // } else {
      //   this.router.navigate(['./application/success'], { queryParams: { req: 0 } });
      // }

    } else {
      let res = this.knockQuesForm.value.QuesInfo;
      let constchangedObjects = res.filter(x => x.Answer == x.correctAnswer);
      if (constchangedObjects.length == this.knockoutQuestionList.length) {
        this.router.navigate(['./application/success'], { queryParams: { req: 1 } });
      } else {
        this.router.navigate(['./application/success'], { queryParams: { req: 0 } });
      }

    }
  }
}
